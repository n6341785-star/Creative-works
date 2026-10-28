export interface ExecutionLog {
  type: 'log' | 'info' | 'warn' | 'error' | 'network';
  message: string;
  timestamp: number;
}

export interface BackendResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  responseTimeMs: number;
  logs: ExecutionLog[];
  error?: string;
}

export function buildFrontendSrcDoc(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
    }
    ${css}
  </style>
</head>
<body>
  ${html}

  <script>
    (function() {
      const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
      };

      function serialize(arg) {
        try {
          if (typeof arg === 'undefined') return 'undefined';
          if (typeof arg === 'function') return arg.toString();
          if (arg instanceof Error) return arg.name + ': ' + arg.message;
          if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
          return String(arg);
        } catch (e) {
          return String(arg);
        }
      }

      function sendLog(type, args) {
        const message = Array.from(args).map(serialize).join(' ');
        window.parent.postMessage({
          type: 'DEVPATH_CONSOLE',
          level: type,
          message: message,
          timestamp: Date.now()
        }, '*');
      }

      console.log = function() {
        sendLog('log', arguments);
        originalConsole.log.apply(console, arguments);
      };
      console.info = function() {
        sendLog('info', arguments);
        originalConsole.info.apply(console, arguments);
      };
      console.warn = function() {
        sendLog('warn', arguments);
        originalConsole.warn.apply(console, arguments);
      };
      console.error = function() {
        sendLog('error', arguments);
        originalConsole.error.apply(console, arguments);
      };

      window.onerror = function(msg, url, line, col, error) {
        window.parent.postMessage({
          type: 'DEVPATH_CONSOLE',
          level: 'error',
          message: 'Uncaught Error: ' + msg + ' (line ' + line + ')',
          timestamp: Date.now()
        }, '*');
        return false;
      };
    })();
  </script>
  <script>
    try {
      ${js}
    } catch(err) {
      console.error(err.name + ": " + err.message);
    }
  </script>
</body>
</html>`;
}

export interface SimulatedRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export function executeBackendSimulation(
  code: string,
  request?: SimulatedRequest
): Promise<BackendResponse> {
  const startTime = performance.now();
  const logs: ExecutionLog[] = [];

  const fakeConsole = {
    log: (...args: unknown[]) => {
      logs.push({
        type: 'log',
        message: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
        timestamp: Date.now(),
      });
    },
    info: (...args: unknown[]) => {
      logs.push({
        type: 'info',
        message: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
        timestamp: Date.now(),
      });
    },
    warn: (...args: unknown[]) => {
      logs.push({
        type: 'warn',
        message: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
        timestamp: Date.now(),
      });
    },
    error: (...args: unknown[]) => {
      logs.push({
        type: 'error',
        message: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
        timestamp: Date.now(),
      });
    },
  };

  type Handler = (req: unknown, res: unknown) => void;
  const routes: Record<string, Record<string, Handler>> = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    PATCH: {},
  };

  const app = {
    get: (path: string, handler: Handler) => {
      routes.GET[path] = handler;
    },
    post: (path: string, handler: Handler) => {
      routes.POST[path] = handler;
    },
    put: (path: string, handler: Handler) => {
      routes.PUT[path] = handler;
    },
    delete: (path: string, handler: Handler) => {
      routes.DELETE[path] = handler;
    },
    patch: (path: string, handler: Handler) => {
      routes.PATCH[path] = handler;
    },
  };

  return new Promise<BackendResponse>((resolve) => {
    try {
      // Evaluate user script with scoped globals
      const sandboxFn = new Function('app', 'console', 'require', code);
      // Mock require for common safe node built-ins (crypto, path)
      const mockRequire = (mod: string) => {
        if (mod === 'crypto') {
          return {
            randomUUID: () => 'uuid-' + Math.random().toString(36).substring(2, 9),
            createHash: () => ({
              update: (str: string) => ({ digest: () => 'hash_' + btoa(str).slice(0, 8) }),
            }),
          };
        }
        return {};
      };

      sandboxFn(app, fakeConsole, mockRequire);

      // If user provided a simulated HTTP request, execute the route
      if (request) {
        const methodRoutes = routes[request.method] || {};
        // Match exact or parameterized route (e.g. /api/users/:id)
        let matchedHandler: Handler | null = null;
        let routeParams: Record<string, string> = {};

        if (methodRoutes[request.path]) {
          matchedHandler = methodRoutes[request.path];
        } else {
          // Check route parameters
          for (const routePattern of Object.keys(methodRoutes)) {
            const patternParts = routePattern.split('/');
            const reqParts = request.path.split('/');
            if (patternParts.length === reqParts.length) {
              let match = true;
              const params: Record<string, string> = {};
              for (let i = 0; i < patternParts.length; i++) {
                if (patternParts[i].startsWith(':')) {
                  const paramName = patternParts[i].slice(1);
                  params[paramName] = reqParts[i];
                } else if (patternParts[i] !== reqParts[i]) {
                  match = false;
                  break;
                }
              }
              if (match) {
                matchedHandler = methodRoutes[routePattern];
                routeParams = params;
                break;
              }
            }
          }
        }

        if (!matchedHandler) {
          const endTime = performance.now();
          resolve({
            status: 404,
            statusText: 'Not Found',
            headers: { 'content-type': 'application/json' },
            data: { error: `Cannot ${request.method} ${request.path}` },
            responseTimeMs: Math.round(endTime - startTime),
            logs,
          });
          return;
        }

        let responseSent = false;
        let resStatus = 200;
        let resHeaders: Record<string, string> = { 'content-type': 'application/json' };
        let resData: unknown = null;

        const reqObj = {
          method: request.method,
          path: request.path,
          params: routeParams,
          body: request.body,
          headers: request.headers || {},
          query: {},
        };

        const resObj = {
          status: (code: number) => {
            resStatus = code;
            return resObj;
          },
          setHeader: (name: string, value: string) => {
            resHeaders[name.toLowerCase()] = value;
            return resObj;
          },
          json: (data: unknown) => {
            if (responseSent) return;
            responseSent = true;
            resHeaders['content-type'] = 'application/json';
            resData = data;
            const endTime = performance.now();
            resolve({
              status: resStatus,
              statusText: resStatus === 200 ? 'OK' : resStatus === 201 ? 'Created' : 'Success',
              headers: resHeaders,
              data: resData,
              responseTimeMs: Math.round(endTime - startTime),
              logs,
            });
          },
          send: (data: unknown) => {
            if (responseSent) return;
            responseSent = true;
            resData = data;
            const endTime = performance.now();
            resolve({
              status: resStatus,
              statusText: 'OK',
              headers: resHeaders,
              data: resData,
              responseTimeMs: Math.round(endTime - startTime),
              logs,
            });
          },
        };

        matchedHandler(reqObj, resObj);

        // Fallback timeout in case user forgot to call res.json()
        setTimeout(() => {
          if (!responseSent) {
            resolve({
              status: 200,
              statusText: 'Executed without explicit response',
              headers: resHeaders,
              data: { message: 'Handler executed. Remember to call res.json(data)' },
              responseTimeMs: Math.round(performance.now() - startTime),
              logs,
            });
          }
        }, 100);
      } else {
        // Plain script run without mock request
        const endTime = performance.now();
        resolve({
          status: 200,
          statusText: 'Script Execution Finished',
          headers: {},
          data: { status: 'Executed successfully' },
          responseTimeMs: Math.round(endTime - startTime),
          logs,
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logs.push({
        type: 'error',
        message: errorMsg,
        timestamp: Date.now(),
      });
      resolve({
        status: 500,
        statusText: 'Internal Error',
        headers: {},
        data: null,
        error: errorMsg,
        responseTimeMs: Math.round(performance.now() - startTime),
        logs,
      });
    }
  });
}
