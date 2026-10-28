import { Project } from '../types';

export const guidedProjects: Project[] = [
  // --- FRONTEND PROJECTS ---
  {
    id: 'proj-fe-beg-1',
    title: 'Adaptive Developer Profile Card',
    trackId: 'frontend',
    level: 'beginner',
    estimatedHours: 2,
    description: 'Build a responsive, accessible developer portfolio card with theme toggling, skill tags, and social interactions.',
    skillsCovered: ['Semantic HTML', 'CSS Box Model', 'Flexbox Alignment', 'DOM Event Listeners'],
    architectureOverview: 'Single-page responsive component utilizing semantic tags (<article>, <header>, <section>), CSS flex layout, and local state.',
    requirements: [
      { id: 'req-1', description: 'Use semantic <article> and <header> containers with an avatar and headline.' },
      { id: 'req-2', description: 'Implement a skill tag container aligned horizontally with Flexbox and gap.' },
      { id: 'req-3', description: 'Add a working "Connect" button that toggles state to "Connected" and increments follower count.' },
      { id: 'req-4', description: 'Ensure all buttons have accessible labels and keyboard focus states.' },
    ],
    starterCode: {
      type: 'frontend',
      html: `<article class="profile-card">
  <div class="avatar-placeholder">💻</div>
  <h2 class="name">Dev Student</h2>
  <p class="role">Frontend Engineering Scholar</p>
  
  <div class="skills-list">
    <span class="skill-tag">HTML5</span>
    <span class="skill-tag">CSS3</span>
    <span class="skill-tag">JavaScript</span>
  </div>
  
  <div class="stats-row">
    <div><strong id="followersCount">128</strong> <span>Followers</span></div>
    <div><strong>14</strong> <span>Projects</span></div>
  </div>
  
  <button id="connectBtn" class="primary-btn">Connect</button>
</article>`,
      css: `.profile-card {
  max-width: 340px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
.avatar-placeholder { font-size: 2.5rem; margin-bottom: 0.5rem; }
.name { margin: 0; font-size: 1.25rem; color: #0f172a; }
.role { margin: 0.25rem 0 1rem; font-size: 0.875rem; color: #64748b; }
.skills-list { display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.skill-tag { background: #f1f5f9; color: #334155; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; }
.stats-row { display: flex; justify-content: space-around; padding: 0.75rem 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; margin-bottom: 1.25rem; font-size: 0.875rem; color: #475569; }
.primary-btn { width: 100%; padding: 0.6rem; background: #0284c7; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.primary-btn:hover { background: #0369a1; }
.primary-btn.connected { background: #10b981; }`,
      js: `// Implement requirement: Toggle Connect state and follower count
const connectBtn = document.getElementById('connectBtn');
const followersCount = document.getElementById('followersCount');
let isConnected = false;

connectBtn.addEventListener('click', () => {
  isConnected = !isConnected;
  if (isConnected) {
    connectBtn.textContent = 'Connected ✓';
    connectBtn.classList.add('connected');
    followersCount.textContent = '129';
  } else {
    connectBtn.textContent = 'Connect';
    connectBtn.classList.remove('connected');
    followersCount.textContent = '128';
  }
});`,
    },
    solutionCode: {
      explanation: 'Uses semantic HTML with accessible event handling and state toggle logic.',
    },
  },
  {
    id: 'proj-fe-int-1',
    title: 'Offline Expense & Budget Tracker',
    trackId: 'frontend',
    level: 'intermediate',
    estimatedHours: 4,
    description: 'Build a full-featured budget manager with category breakdowns, income/expense calculation, and local data persistence.',
    skillsCovered: ['Array Methods (filter, reduce)', 'DOM Manipulation', 'Form Validation', 'LocalStorage API'],
    architectureOverview: 'Model-View separation storing transactions in localStorage, calculating totals with array reduce, and updating UI reactively.',
    requirements: [
      { id: 'req-1', description: 'Form with Description, Amount ($), and Type (Income vs Expense).' },
      { id: 'req-2', description: 'Live summary cards displaying Total Income, Total Expenses, and Net Balance.' },
      { id: 'req-3', description: 'Transaction list with delete affordance for each entry.' },
      { id: 'req-4', description: 'Persist transactions in localStorage so data survives offline browser refreshes.' },
    ],
    starterCode: {
      type: 'frontend',
      html: `<div class="budget-app">
  <h2>Budget & Expense Ledger</h2>
  
  <div class="summary-cards">
    <div class="card income">
      <span>Income</span>
      <h3 id="incomeDisplay">$0.00</h3>
    </div>
    <div class="card expense">
      <span>Expenses</span>
      <h3 id="expenseDisplay">$0.00</h3>
    </div>
    <div class="card balance">
      <span>Net Balance</span>
      <h3 id="balanceDisplay">$0.00</h3>
    </div>
  </div>

  <form id="txForm" class="tx-form">
    <input id="txDesc" placeholder="Description (e.g. Server hosting)" required />
    <input id="txAmount" type="number" step="0.01" placeholder="Amount ($)" required />
    <select id="txType">
      <option value="expense">Expense</option>
      <option value="income">Income</option>
    </select>
    <button type="submit">Record</button>
  </form>

  <ul id="txList" class="tx-list"></ul>
</div>`,
      css: `.budget-app { max-width: 480px; margin: 1rem auto; padding: 1.5rem; background: white; border-radius: 1rem; border: 1px solid #e2e8f0; }
.summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1.5rem; }
.card { padding: 0.75rem; border-radius: 0.5rem; background: #f8fafc; text-align: center; }
.card span { font-size: 0.7rem; color: #64748b; text-transform: uppercase; }
.card h3 { margin: 0.25rem 0 0; font-size: 1.1rem; }
.income h3 { color: #16a34a; }
.expense h3 { color: #dc2626; }
.balance h3 { color: #0284c7; }
.tx-form { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 0.5rem; margin-bottom: 1rem; }
.tx-form input, select, button { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; }
.tx-form button { background: #0f172a; color: white; border: none; cursor: pointer; }
.tx-list { list-style: none; padding: 0; margin: 0; }
.tx-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; }
.tx-item button { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1rem; }`,
      js: `let transactions = [
  { id: 1, desc: 'Tutoring St不由pend', amount: 120, type: 'income' },
  { id: 2, desc: 'Domain Name', amount: 15, type: 'expense' }
];

function updateUI() {
  const list = document.getElementById('txList');
  list.innerHTML = '';
  
  let income = 0;
  let expense = 0;

  transactions.forEach(tx => {
    if (tx.type === 'income') income += tx.amount;
    else expense += tx.amount;

    const li = document.createElement('li');
    li.className = 'tx-item';
    li.innerHTML = \`<span>\${tx.desc}</span> <strong>\${tx.type === 'income' ? '+' : '-'}$\${tx.amount.toFixed(2)}</strong> <button onclick="deleteTx(\${tx.id})">&times;</button>\`;
    list.appendChild(li);
  });

  document.getElementById('incomeDisplay').textContent = '$' + income.toFixed(2);
  document.getElementById('expenseDisplay').textContent = '$' + expense.toFixed(2);
  document.getElementById('balanceDisplay').textContent = '$' + (income - expense).toFixed(2);
}

window.deleteTx = function(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateUI();
};

document.getElementById('txForm').onsubmit = (e) => {
  e.preventDefault();
  const desc = document.getElementById('txDesc').value;
  const amount = parseFloat(document.getElementById('txAmount').value);
  const type = document.getElementById('txType').value;
  if (!desc || isNaN(amount)) return;
  transactions.push({ id: Date.now(), desc, amount, type });
  document.getElementById('txDesc').value = '';
  document.getElementById('txAmount').value = '';
  updateUI();
};

updateUI();`,
    },
  },
  {
    id: 'proj-fe-adv-1',
    title: 'Markdown Studio with Local Sync',
    trackId: 'frontend',
    level: 'advanced',
    estimatedHours: 6,
    description: 'Engineer a split-pane distraction-free markdown documentation editor with syntax highlighting, word count telemetry, and offline export.',
    skillsCovered: ['Debounced Input', 'Custom Regex Parser', 'Blob URL Generation', 'Responsive Split Pane'],
    architectureOverview: 'Dual-column reactive renderer utilizing debounced input events, compiling markdown AST to sanitized HTML, and exporting files via programmatic Blob downloads.',
    requirements: [
      { id: 'req-1', description: 'Dual-pane layout (Editor on left, Live HTML Preview on right).' },
      { id: 'req-2', description: 'Real-time compilation of headers (#), bold (**), lists (-), and inline code (`).' },
      { id: 'req-3', description: 'Live word and character count indicator.' },
      { id: 'req-4', description: 'Export document button generating an offline .md file download.' },
    ],
    starterCode: {
      type: 'frontend',
      html: `<div class="editor-shell">
  <div class="editor-header">
    <strong>Markdown Studio</strong>
    <span id="docStats">0 words · 0 chars</span>
    <button id="exportBtn">Export .md</button>
  </div>
  <div class="panes">
    <textarea id="mdInput" placeholder="# Write markdown here..."></textarea>
    <div id="mdPreview" class="preview-panel"></div>
  </div>
</div>`,
      css: `.editor-shell { display: flex; flex-direction: column; height: 90vh; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; }
.editor-header { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; background: #0f172a; color: white; font-size: 0.85rem; }
.editor-header button { background: #38bdf8; border: none; padding: 0.3rem 0.8rem; border-radius: 4px; font-weight: 600; cursor: pointer; }
.panes { display: flex; flex: 1; }
#mdInput { flex: 1; border: none; border-right: 1px solid #cbd5e1; padding: 1rem; font-family: monospace; font-size: 14px; outline: none; resize: none; background: #fafafa; }
.preview-panel { flex: 1; padding: 1rem; overflow-y: auto; background: white; font-family: sans-serif; line-height: 1.6; }
.preview-panel h1 { border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; }
.preview-panel code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: monospace; }`,
      js: `function parseMarkdown(md) {
  let html = md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/\\*\\*(.*)\\*\\*/gim, '<strong>$1</strong>')
    .replace(/\\\`([^\\\`]+)\\\`/gim, '<code>$1</code>')
    .replace(/\\n/gim, '<br/>');
  return html;
}

const input = document.getElementById('mdInput');
const preview = document.getElementById('mdPreview');
const stats = document.getElementById('docStats');

input.value = '# Welcome to Markdown Studio\\n\\nWrite **bold thoughts** and \`code snippets\` offline.';

function refresh() {
  preview.innerHTML = parseMarkdown(input.value);
  const words = input.value.trim().split(/\\s+/).filter(Boolean).length;
  stats.textContent = words + ' words · ' + input.value.length + ' chars';
}

input.addEventListener('input', refresh);
refresh();`,
    },
  },

  // --- BACKEND PROJECTS ---
  {
    id: 'proj-be-beg-1',
    title: 'RESTful Student Course Catalog API',
    trackId: 'backend',
    level: 'beginner',
    estimatedHours: 2,
    description: 'Build an in-memory CRUD course catalog API with validation, course enrollment, and capacity checks.',
    skillsCovered: ['Express Routes', 'HTTP Verbs (GET, POST)', 'Route Parameters', 'Status Codes'],
    architectureOverview: 'Express REST service exposing endpoints for querying courses, filtering by subject, and adding enrollments.',
    requirements: [
      { id: 'req-1', description: 'GET /api/courses returns complete array of available courses.' },
      { id: 'req-2', description: 'GET /api/courses/:id returns the single course or 404 if not found.' },
      { id: 'req-3', description: 'POST /api/courses validates title and credits, returning 201 Created.' },
      { id: 'req-4', description: 'Reject invalid course payload with 400 Bad Request and descriptive error message.' },
    ],
    starterCode: {
      type: 'backend',
      backendCode: `// Student Course Catalog API
const courses = [
  { id: 101, title: 'Full-Stack JavaScript', credits: 4, department: 'CS' },
  { id: 102, title: 'Database Systems & SQL', credits: 3, department: 'CS' }
];

app.get('/api/courses', (req, res) => {
  console.log('GET /api/courses count:', courses.length);
  res.json({ success: true, count: courses.length, data: courses });
});

app.get('/api/courses/:id', (req, res) => {
  const courseId = Number(req.params.id);
  const course = courses.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json({ success: true, course });
});

app.post('/api/courses', (req, res) => {
  const { title, credits, department } = req.body || {};
  if (!title || typeof credits !== 'number') {
    return res.status(400).json({ error: 'title (string) and credits (number) are required' });
  }

  const newCourse = {
    id: 100 + courses.length + 1,
    title,
    credits,
    department: department || 'General'
  };

  courses.push(newCourse);
  console.log('Created course:', newCourse.title);
  res.status(201).json({ success: true, course: newCourse });
});`,
    },
  },
  {
    id: 'proj-be-int-1',
    title: 'RESTful Task Management Engine with Filtering',
    trackId: 'backend',
    level: 'intermediate',
    estimatedHours: 4,
    description: 'Engineer a production-ready task management service with query param filtering (status, priority), updates, and deletion.',
    skillsCovered: ['Query String Parsing', 'PATCH vs PUT', 'Centralized Error Handling', 'Status Codes'],
    architectureOverview: 'Multi-endpoint REST architecture handling complex query filters (?priority=high&done=false), updating records, and emitting 204 on delete.',
    requirements: [
      { id: 'req-1', description: 'GET /api/tasks supports query parameters: ?status=completed and ?priority=high.' },
      { id: 'req-2', description: 'PATCH /api/tasks/:id allows updating title, completed flag, or priority.' },
      { id: 'req-3', description: 'DELETE /api/tasks/:id deletes record and returns status 200 or 204.' },
      { id: 'req-4', description: 'Return appropriate 404 for non-existent IDs across PATCH and DELETE.' },
    ],
    starterCode: {
      type: 'backend',
      backendCode: `// Task Engine with Filtering and State Transitions
let tasks = [
  { id: 1, title: 'Finish HTML5 Semantic Lesson', priority: 'high', done: true },
  { id: 2, title: 'Implement Express REST API', priority: 'high', done: false },
  { id: 3, title: 'Review CSS Grid layouts', priority: 'low', done: false }
];

app.get('/api/tasks', (req, res) => {
  let result = [...tasks];
  // Filtering logic
  console.log('Tasks fetched. Total:', result.length);
  res.json({ success: true, data: result });
});

app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.done !== undefined) task.done = Boolean(req.body.done);
  if (req.body.priority !== undefined) task.priority = req.body.priority;

  console.log('Task patched:', id);
  res.json({ success: true, updatedTask: task });
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = tasks.some(t => t.id === id);
  if (!exists) return res.status(404).json({ error: 'Task not found' });

  tasks = tasks.filter(t => t.id !== id);
  console.log('Task deleted:', id);
  res.json({ success: true, message: 'Task deleted successfully' });
});`,
    },
  },
  {
    id: 'proj-be-adv-1',
    title: 'RBAC Auth Token Dispatcher & Rate Limiter',
    trackId: 'backend',
    level: 'advanced',
    estimatedHours: 6,
    description: 'Design a stateless Role-Based Access Control (RBAC) token dispatcher with rate limiting and salted credential verification.',
    skillsCovered: ['JWT Sign/Verify', 'Role-Based Access Control', 'Sliding Window Rate Limiter', 'Security Headers'],
    architectureOverview: 'Security gateway enforcing authentication, inspecting token claims (admin, editor, student), and blocking IP/client floods.',
    requirements: [
      { id: 'req-1', description: 'POST /api/auth/login validates credentials and returns signed JWT token with role claim.' },
      { id: 'req-2', description: 'Protected endpoint /api/admin/metrics requires Bearer token and rejects non-admin roles with 403 Forbidden.' },
      { id: 'req-3', description: 'Implement request rate limiter (max 5 requests per 30-second window).' },
      { id: 'req-4', description: 'Provide structured security audit logs for unauthorized attempts.' },
    ],
    starterCode: {
      type: 'backend',
      backendCode: `// RBAC & Rate Limiting Security Gateway
const rateLimitMap = new Map();

function checkRateLimit(clientId, maxRequests = 5) {
  const now = Date.now();
  const record = rateLimitMap.get(clientId) || { count: 0, resetAt: now + 30000 };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + 30000;
  } else {
    record.count += 1;
  }
  rateLimitMap.set(clientId, record);
  return record.count <= maxRequests;
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === 'admin' && password === 'SecretAdminPass123!') {
    const token = 'header.payload_admin_role.signature';
    return res.json({ token, role: 'admin', expiresIn: 3600 });
  } else if (username === 'student' && password === 'StudentPass123!') {
    const token = 'header.payload_student_role.signature';
    return res.json({ token, role: 'student', expiresIn: 3600 });
  }
  res.status(401).json({ error: 'Invalid username or password' });
});

app.get('/api/admin/metrics', (req, res) => {
  const auth = req.headers['authorization'] || '';
  if (!auth.includes('admin')) {
    console.warn('SECURITY ALERT: Unauthorized access attempt to /api/admin/metrics');
    return res.status(403).json({ error: 'Forbidden: Admin role required' });
  }
  res.json({
    activeStudents: 1420,
    serverUptimeSeconds: 98400,
    databaseStatus: 'HEALTHY'
  });
});`,
    },
  },
];
