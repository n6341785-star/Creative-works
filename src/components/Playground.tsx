import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Send,
  Terminal,
  Layers,
  FileCode,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { buildFrontendSrcDoc, executeBackendSimulation, BackendResponse, ExecutionLog } from '../utils/codeRunner';

interface PlaygroundProps {
  initialMode?: 'frontend' | 'backend';
  initialCode?: {
    html?: string;
    css?: string;
    js?: string;
    backendCode?: string;
  };
}

export const Playground: React.FC<PlaygroundProps> = ({
  initialMode = 'frontend',
  initialCode,
}) => {
  const [mode, setMode] = useState<'frontend' | 'backend'>(initialMode);

  // Frontend state
  const [htmlCode, setHtmlCode] = useState(
    initialCode?.html ||
      `<div class="app-card">
  <h1>⚡ Offline Interactive Counter</h1>
  <p>Test real-time HTML, CSS and JS changes offline.</p>
  <div class="counter-val" id="count">0</div>
  <div class="btn-group">
    <button id="dec">- Decrement</button>
    <button id="inc" class="primary">+ Increment</button>
  </div>
</div>`
  );

  const [cssCode, setCssCode] = useState(
    initialCode?.css ||
      `.app-card {
  max-width: 380px;
  margin: 2rem auto;
  padding: 1.75rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
  text-align: center;
  font-family: system-ui, sans-serif;
}
h1 { font-size: 1.25rem; color: #0f172a; margin-top: 0; }
p { font-size: 0.85rem; color: #64748b; }
.counter-val { font-size: 3rem; font-weight: 800; color: #0284c7; margin: 1rem 0; }
.btn-group { display: flex; justify-content: center; gap: 0.75rem; }
button {
  padding: 0.6rem 1.2rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
button:hover { background: #f1f5f9; }
button.primary { background: #0284c7; color: white; border: none; }
button.primary:hover { background: #0369a1; }`
  );

  const [jsCode, setJsCode] = useState(
    initialCode?.js ||
      `let count = 0;
const countEl = document.getElementById('count');
const incBtn = document.getElementById('inc');
const decBtn = document.getElementById('dec');

incBtn.addEventListener('click', () => {
  count += 1;
  countEl.textContent = count;
  console.log('Count incremented to:', count);
});

decBtn.addEventListener('click', () => {
  count -= 1;
  countEl.textContent = count;
  console.log('Count decremented to:', count);
});

console.log('Frontend Interactive App initialized!');`
  );

  const [activeFrontendTab, setActiveFrontendTab] = useState<'html' | 'css' | 'js'>('html');
  const [frontendLogs, setFrontendLogs] = useState<ExecutionLog[]>([]);
  const [iframeSrcDoc, setIframeSrcDoc] = useState('');
  const [copied, setCopied] = useState(false);

  // Backend state
  const [backendCode, setBackendCode] = useState(
    initialCode?.backendCode ||
      `// RESTful Express-like API Simulator
const students = [
  { id: 1, name: 'Ada Lovelace', track: 'Backend' },
  { id: 2, name: 'Alan Turing', track: 'Frontend' }
];

app.get('/api/students', (req, res) => {
  console.log('GET request received for /api/students');
  res.json({
    status: 'success',
    total: students.length,
    data: students
  });
});

app.post('/api/students', (req, res) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ error: 'Student name is required' });
  }
  const newStudent = {
    id: students.length + 1,
    name: req.body.name,
    track: req.body.track || 'Full-Stack'
  };
  students.push(newStudent);
  console.log('Enrolled new student:', newStudent.name);
  res.status(201).json({ status: 'created', student: newStudent });
});`
  );

  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [httpPath, setHttpPath] = useState('/api/students');
  const [httpBody, setHttpBody] = useState('{\n  "name": "Grace Hopper",\n  "track": "Backend"\n}');
  const [backendResponse, setBackendResponse] = useState<BackendResponse | null>(null);
  const [isExecutingBackend, setIsExecutingBackend] = useState(false);

  // Update initial code if prop changes
  useEffect(() => {
    if (initialMode) setMode(initialMode);
    if (initialCode?.html) setHtmlCode(initialCode.html);
    if (initialCode?.css) setCssCode(initialCode.css);
    if (initialCode?.js) setJsCode(initialCode.js);
    if (initialCode?.backendCode) setBackendCode(initialCode.backendCode);
  }, [initialMode, initialCode]);

  // Handle postMessage logs from the frontend sandbox iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'DEVPATH_CONSOLE') {
        setFrontendLogs((prev) => [
          ...prev,
          {
            type: event.data.level || 'log',
            message: event.data.message || '',
            timestamp: event.data.timestamp || Date.now(),
          },
        ]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Run frontend code
  const runFrontend = () => {
    setFrontendLogs([]);
    const compiled = buildFrontendSrcDoc(htmlCode, cssCode, jsCode);
    setIframeSrcDoc(compiled);
  };

  // Run on mount
  useEffect(() => {
    if (mode === 'frontend') {
      runFrontend();
    }
  }, [mode]);

  // Execute backend simulation
  const runBackendRequest = async () => {
    setIsExecutingBackend(true);
    let parsedBody: unknown = undefined;
    if (httpMethod === 'POST' || httpMethod === 'PUT') {
      try {
        parsedBody = JSON.parse(httpBody);
      } catch (e) {
        setBackendResponse({
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          data: { error: 'Invalid JSON payload in Request Body' },
          responseTimeMs: 0,
          logs: [{ type: 'error', message: 'SyntaxError: Malformed JSON body', timestamp: Date.now() }],
        });
        setIsExecutingBackend(false);
        return;
      }
    }

    const res = await executeBackendSimulation(backendCode, {
      method: httpMethod,
      path: httpPath,
      body: parsedBody,
    });

    setBackendResponse(res);
    setIsExecutingBackend(false);
  };

  const handleCopy = () => {
    const textToCopy =
      mode === 'frontend'
        ? `<!-- HTML -->\n${htmlCode}\n\n/* CSS */\n${cssCode}\n\n// JS\n${jsCode}`
        : backendCode;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4">
      {/* Playground Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <span>Interactive Real-Time Playground</span>
          </h1>
          <p className="text-xs text-slate-400">
            Write, execute and debug live code. Runs 100% locally in your browser sandbox.
          </p>
        </div>

        {/* Mode switcher tabs (Frontend vs Backend) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setMode('frontend')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === 'frontend'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Frontend Sandbox</span>
          </button>
          <button
            onClick={() => setMode('backend')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === 'backend'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Backend API Simulator</span>
          </button>
        </div>
      </div>

      {/* ================= FRONTEND SANDBOX VIEW ================= */}
      {mode === 'frontend' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor Column */}
          <div className="flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-1">
                {(['html', 'css', 'js'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFrontendTab(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer uppercase ${
                      activeFrontendTab === tab
                        ? 'bg-slate-800 text-sky-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  title="Copy All Code"
                  className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Copy</span>
                </button>
                <button
                  onClick={runFrontend}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Run Code</span>
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="p-2 flex-1 min-h-[300px]">
              {activeFrontendTab === 'html' && (
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="<!-- HTML markup here -->"
                  spellCheck={false}
                  className="w-full h-80 lg:h-[420px] p-3 font-mono text-xs sm:text-sm bg-slate-950 text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500/50 resize-none leading-relaxed"
                />
              )}
              {activeFrontendTab === 'css' && (
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  placeholder="/* CSS styles here */"
                  spellCheck={false}
                  className="w-full h-80 lg:h-[420px] p-3 font-mono text-xs sm:text-sm bg-slate-950 text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500/50 resize-none leading-relaxed"
                />
              )}
              {activeFrontendTab === 'js' && (
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  placeholder="// JavaScript logic here"
                  spellCheck={false}
                  className="w-full h-80 lg:h-[420px] p-3 font-mono text-xs sm:text-sm bg-slate-950 text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500/50 resize-none leading-relaxed"
                />
              )}
            </div>
          </div>

          {/* Preview & Console Column */}
          <div className="flex flex-col gap-4">
            {/* Live Render Window */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm flex flex-col">
              <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Live Preview</span>
                <span className="text-[10px] text-emerald-400 font-mono">● Isolated Sandbox</span>
              </div>
              <div className="w-full h-64 lg:h-[280px] bg-white">
                <iframe
                  title="DevPath Live Preview"
                  sandbox="allow-scripts"
                  srcDoc={iframeSrcDoc}
                  className="w-full h-full border-none"
                />
              </div>
            </div>

            {/* Console Output Inspector */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm flex flex-col">
              <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span>Console Output</span>
                </div>
                <button
                  onClick={() => setFrontendLogs([])}
                  title="Clear Console"
                  className="p-1 text-slate-400 hover:text-slate-200 text-xs rounded hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3 bg-slate-950 font-mono text-xs h-36 lg:h-[160px] overflow-y-auto space-y-1">
                {frontendLogs.length === 0 ? (
                  <div className="text-slate-600 italic">No console logs yet. Run code to inspect logs.</div>
                ) : (
                  frontendLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`py-0.5 leading-relaxed flex items-start gap-2 ${
                        log.type === 'error'
                          ? 'text-rose-400'
                          : log.type === 'warn'
                          ? 'text-amber-400'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="text-slate-600 select-none">&gt;</span>
                      <span className="break-all">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= BACKEND SIMULATOR VIEW ================= */}
      {mode === 'backend' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Server Route Code Editor */}
          <div className="flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span>Express Server Script (app.js)</span>
              </div>
              <button
                onClick={handleCopy}
                title="Copy Server Code"
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Copy</span>
              </button>
            </div>

            <div className="p-2 flex-1 min-h-[340px]">
              <textarea
                value={backendCode}
                onChange={(e) => setBackendCode(e.target.value)}
                placeholder="// Define your Express routes with app.get, app.post, etc."
                spellCheck={false}
                className="w-full h-80 lg:h-[480px] p-3 font-mono text-xs sm:text-sm bg-slate-950 text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500/50 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Interactive HTTP Client & Response Inspector */}
          <div className="flex flex-col gap-4">
            {/* Request Builder */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-sm">
              <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Simulated HTTP Request
              </h2>

              <div className="flex gap-2 mb-3">
                <select
                  value={httpMethod}
                  onChange={(e) => setHttpMethod(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-sky-400 focus:outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <input
                  type="text"
                  value={httpPath}
                  onChange={(e) => setHttpPath(e.target.value)}
                  placeholder="/api/students"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500/50"
                />

                <button
                  onClick={runBackendRequest}
                  disabled={isExecutingBackend}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors cursor-pointer disabled:bg-slate-800 disabled:text-slate-500"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>

              {(httpMethod === 'POST' || httpMethod === 'PUT') && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-1">
                    JSON Request Body:
                  </div>
                  <textarea
                    value={httpBody}
                    onChange={(e) => setHttpBody(e.target.value)}
                    rows={4}
                    spellCheck={false}
                    className="w-full p-2.5 font-mono text-xs bg-slate-950 text-slate-200 rounded-lg border border-slate-800 focus:outline-none focus:border-sky-500/50 resize-none"
                  />
                </div>
              )}
            </div>

            {/* HTTP Response Panel */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm flex flex-col flex-1">
              <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">HTTP Response</span>
                {backendResponse && (
                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`font-mono font-bold ${
                        backendResponse.status >= 200 && backendResponse.status < 300
                          ? 'text-emerald-400'
                          : backendResponse.status >= 400
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {backendResponse.status} {backendResponse.statusText}
                    </span>
                    <span className="text-slate-500 tabular-nums font-mono text-[11px]">
                      {backendResponse.responseTimeMs} ms
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-950 flex-1 min-h-[220px] overflow-y-auto">
                {!backendResponse ? (
                  <div className="text-slate-600 text-xs italic py-8 text-center">
                    Click "Send" to dispatch simulated request to the server code.
                  </div>
                ) : (
                  <div className="space-y-3 font-mono text-xs">
                    {/* Data Payload */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-sans font-semibold mb-1">
                        Body (JSON)
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-sky-300 overflow-x-auto leading-relaxed">
                        {JSON.stringify(backendResponse.data, null, 2)}
                      </pre>
                    </div>

                    {/* Server Logs */}
                    {backendResponse.logs.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-sans font-semibold mb-1">
                          Server Console Logs
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 space-y-1">
                          {backendResponse.logs.map((log, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="text-slate-600">&gt;</span>
                              <span className="break-all">{log.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
