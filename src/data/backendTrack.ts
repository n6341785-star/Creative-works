import { Module } from '../types';

export const backendModules: Module[] = [
  {
    id: 'be-m1',
    trackId: 'backend',
    title: 'Node.js Runtime & Async Architecture',
    order: 1,
    description: 'Master the V8 engine, single-threaded event loop, libuv worker threads, and streams.',
    iconName: 'Server',
    lessons: [
      {
        id: 'be-1-1',
        trackId: 'backend',
        moduleId: 'be-m1',
        subdivision: '1.1',
        title: 'Node.js Architecture & The Event Loop',
        estimatedMinutes: 10,
        difficulty: 'beginner',
        summary: 'Understand how Node.js achieves high I/O throughput despite having a single main execution thread.',
        objectives: [
          'Differentiate the V8 JavaScript execution engine from libuv C++ asynchronous library',
          'Learn the six phases of the Node.js event loop: timers, pending callbacks, poll, check, close',
          'Understand non-blocking I/O and offloading to thread pools',
        ],
        content: `Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine and libuv.

While traditional web servers (like Apache) spawned a dedicated operating system thread per connection (consuming memory and risking thread exhaustion), Node.js operates on an **event-driven, non-blocking I/O model**.

When Node initiates a filesystem read, database query, or network request:
1. The synchronous JavaScript call asks libuv to handle the I/O.
2. Libuv dispatches the operation to OS kernel routines or its background worker thread pool (default 4 threads).
3. The main V8 JavaScript thread is immediately free to accept and handle other incoming requests!
4. Once the operation finishes, libuv pushes the completion callback into the event loop queues.`,
        codeExamples: [
          {
            title: 'Non-blocking I/O Simulation',
            language: 'javascript',
            code: `console.log('1. Server boot initiates');

// Non-blocking timer
setTimeout(() => {
  console.log('3. Background timer executed');
}, 0);

console.log('2. Server ready for incoming connections');
// Output: 1, 2, 3`,
            explanation: 'The synchronous console statements finish first before the event loop processes the timer callback.',
          },
        ],
        keyTakeaways: [
          'Node executes JavaScript on a single thread, but I/O operations are handled asynchronously by libuv.',
          'Never execute heavy CPU-bound computations (like large prime factoring) on the main thread, as it blocks all incoming HTTP requests.',
          'The event loop constantly checks queues to execute callbacks when the call stack clears.',
        ],
        quiz: [
          {
            id: 'q-be-1-1-1',
            question: 'What happens if a developer runs a synchronous heavy loop (while(true){}) on the Node.js main thread?',
            options: [
              'Node automatically spins up a worker thread to run the loop in parallel',
              'The main thread locks up and all other incoming HTTP requests will hang indefinitely',
              'The V8 engine pauses the loop after 100ms and yields to pending I/O',
              'Node kills the process with an out-of-memory error',
            ],
            correctAnswerIndex: 1,
            explanation: 'Because JavaScript execution is single-threaded, a synchronous blocking loop freezes the entire process, preventing the event loop from servicing any other connection.',
          },
          {
            id: 'q-be-1-1-2',
            question: 'Which component in Node.js manages the thread pool, file system I/O, and the event loop?',
            options: ['Chrome V8', 'libuv', 'Babel', 'npm'],
            correctAnswerIndex: 1,
            explanation: 'libuv is the high-performance multiplatform C library that powers Node.js event loop, thread pool, and non-blocking I/O operations.',
          },
        ],
        starterPlaygroundCode: {
          type: 'backend',
          backendCode: `// Node Event Loop Flow Simulator
console.log('=== Step 1: Synchronous code starts ===');

// Simulate asynchronous background I/O
setTimeout(() => {
  console.log('=== Step 4: Asynchronous I/O callback resolved ===');
}, 50);

console.log('=== Step 2: Main thread remains unblocked ===');
console.log('=== Step 3: Call stack clears, yielding to Event Loop ===');`,
        },
      },
      {
        id: 'be-1-2',
        trackId: 'backend',
        moduleId: 'be-m1',
        subdivision: '1.2',
        title: 'Modules, CommonJS & Modern ESM',
        estimatedMinutes: 8,
        difficulty: 'beginner',
        summary: 'Explore require/module.exports vs import/export, circular dependencies, and module caching.',
        objectives: [
          'Compare synchronous CommonJS (require) with static ECMAScript Modules (import)',
          'Understand module caching and singleton instances in Node',
          'Configure "type": "module" in package.json for modern ESM apps',
        ],
        content: `Node historically used CommonJS (\`require\` and \`module.exports\`), where module loading is synchronous. Modern Node.js natively supports ES Modules (\`import\` and \`export\`).

Crucial distinctions:
- **CommonJS**: Evaluated dynamically at runtime. \`const fs = require('fs');\`.
- **ESM**: Statically parsed before execution, enabling tree-shaking, top-level await, and better bundler optimizations.
- **Module Caching**: Once a file is loaded via \`require\` or \`import\`, Node caches the exported object. Subsequent imports within the same process return the cached instance, preventing duplicate execution.`,
        codeExamples: [
          {
            title: 'Modern ESM Module Pattern',
            language: 'javascript',
            code: `// mathUtils.js
export function calculateTax(amount, rate = 0.08) {
  return amount * (1 + rate);
}

// server.js
import { calculateTax } from './mathUtils.js';
console.log('Total with tax:', calculateTax(100));`,
            explanation: 'Static ES Module imports ensure explicit exports and enable bundlers to eliminate unused code.',
          },
        ],
        keyTakeaways: [
          'Modern backend projects should prefer ESM with "type": "module" in package.json.',
          'Modules are cached in require.cache after first execution, acting as singletons.',
          'ESM enables top-level await without wrapping code in an async IIFE.',
        ],
        quiz: [
          {
            id: 'q-be-1-2-1',
            question: 'What occurs when the same module is imported or required in multiple files throughout a Node application?',
            options: [
              'The file is re-executed and parsed from disk every time it is imported',
              'Node caches the module on first load and returns the cached export instance',
              'Node raises a DuplicateImportError at startup',
              'The second import overwrites global memory',
            ],
            correctAnswerIndex: 1,
            explanation: 'Node.js caches modules in memory after the first import; subsequent calls return the cached export object.',
          },
        ],
        starterPlaygroundCode: {
          type: 'backend',
          backendCode: `// Simulated Module Registry & Export Cache
const moduleRegistry = {};

function defineModule(name, factory) {
  const exports = {};
  factory(exports);
  moduleRegistry[name] = exports;
  console.log('Registered and cached module:', name);
}

defineModule('logger', (exports) => {
  exports.info = (msg) => console.log('[LOG]: ' + msg);
});

// Import and use module from cache
const logger = moduleRegistry['logger'];
logger.info('System initialization verified.');`,
        },
      },
    ],
  },
  {
    id: 'be-m2',
    trackId: 'backend',
    title: 'Express.js & REST API Design',
    order: 2,
    description: 'Routing, middleware chains, HTTP verbs, status code contracts, and JSON payload handling.',
    iconName: 'Network',
    lessons: [
      {
        id: 'be-2-1',
        trackId: 'backend',
        moduleId: 'be-m2',
        subdivision: '2.1',
        title: 'REST Architecture & HTTP Status Codes',
        estimatedMinutes: 12,
        difficulty: 'intermediate',
        summary: 'Design clean REST endpoints, choose correct HTTP verbs, and emit standard HTTP status codes.',
        objectives: [
          'Design intuitive, noun-based RESTful API paths (e.g. /api/students/:id)',
          'Differentiate GET (safe), POST (create), PUT (replace), PATCH (modify), DELETE (remove)',
          'Select standard status codes: 200, 201, 400, 401, 403, 404, 500',
        ],
        content: `REST (Representational State Transfer) is the universal standard for client-server communication over HTTP.

### HTTP Verbs:
- **GET**: Read resource. Must be idempotent and safe (no server state mutations).
- **POST**: Create a new subordinate resource. Emits \`201 Created\`.
- **PUT**: Complete replacement of the resource at the target URL.
- **PATCH**: Partial modification of specified fields on the resource.
- **DELETE**: Remove resource. Emits \`200 OK\` or \`204 No Content\`.

### Status Codes Reference:
- **2xx Success**: \`200 OK\`, \`201 Created\`, \`204 No Content\`.
- **4xx Client Error**:
  - \`400 Bad Request\`: Malformed syntax or missing required JSON fields.
  - \`401 Unauthorized\`: Authentication is required (no or invalid token).
  - \`403 Forbidden\`: Authenticated, but user lacks permission (insufficient role).
  - \`404 Not Found\`: Target resource does not exist.
  - \`409 Conflict\`: Duplicate email or conflicting state.
- **5xx Server Error**: \`500 Internal Server Error\`.`,
        codeExamples: [
          {
            title: 'Express REST Router Implementation',
            language: 'javascript',
            code: `// GET all users
app.get('/api/users', (req, res) => {
  res.status(200).json([
    { id: 1, name: 'Taylor', role: 'student' }
  ]);
});

// POST create user with validation
app.post('/api/users', (req, res) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newUser = { id: Date.now(), name: req.body.name };
  res.status(201).json(newUser);
});`,
            explanation: 'Proper status codes and error bodies communicate operational results clearly to frontend clients.',
          },
        ],
        keyTakeaways: [
          'Use plural nouns for resource paths (/api/products, /api/orders) rather than verbs (/api/getProducts).',
          'Return 400 when client inputs fail schema validation.',
          'Never return 200 OK if the operation failed with an error in the JSON payload.',
        ],
        quiz: [
          {
            id: 'q-be-2-1-1',
            question: 'Which HTTP status code should a REST API return when a client attempts to create an account, but the request body is missing the required "email" field?',
            options: ['200 OK', '400 Bad Request', '404 Not Found', '500 Internal Server Error'],
            correctAnswerIndex: 1,
            explanation: '400 Bad Request is the standard HTTP response when the client sends malformed data or fails input validation.',
          },
          {
            id: 'q-be-2-1-2',
            question: 'What is the correct HTTP status code when a new resource is successfully created on the server via POST?',
            options: ['200 OK', '201 Created', '202 Accepted', '204 No Content'],
            correctAnswerIndex: 1,
            explanation: '201 Created indicates that the request succeeded and led to the creation of a new resource.',
          },
        ],
        starterPlaygroundCode: {
          type: 'backend',
          backendCode: `// RESTful Student API Simulator
const students = [
  { id: 1, name: 'Sarah Connor', grade: 'A' },
  { id: 2, name: 'John Doe', grade: 'B' }
];

app.get('/api/students', (req, res) => {
  console.log('GET /api/students requested, count:', students.length);
  res.json({ success: true, count: students.length, data: students });
});

app.post('/api/students', (req, res) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ success: false, error: 'Student name is required' });
  }
  const newStudent = { id: students.length + 1, name: req.body.name, grade: req.body.grade || 'A' };
  students.push(newStudent);
  console.log('Created student:', newStudent.name);
  res.status(201).json({ success: true, student: newStudent });
});`,
        },
      },
      {
        id: 'be-2-2',
        trackId: 'backend',
        moduleId: 'be-m2',
        subdivision: '2.2',
        title: 'Middleware Chains & Error Pipelines',
        estimatedMinutes: 10,
        difficulty: 'intermediate',
        summary: 'Master the req, res, next pipeline, authentication middleware, and centralized error handling.',
        objectives: [
          'Understand how middleware functions intercept and process requests sequentially',
          'Pass control down the pipeline using next()',
          'Implement a global 4-argument error handling middleware (err, req, res, next)',
        ],
        content: `In Express, an application is essentially a sequential chain of middleware functions.

Each middleware function has access to the request object (\`req\`), the response object (\`res\`), and the \`next\` function.

Middleware example:
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next(); // Pass control to the next middleware
});

If a middleware does not call \`next()\` or end the response cycle with \`res.send()\` / \`res.json()\`, the client request will hang until timeout!

**Error Handling Middleware**: Defined with four parameters: \`(err, req, res, next)\`. Express identifies this 4-argument signature and skips normal routes directly to this error pipeline when \`next(err)\` is invoked.`,
        codeExamples: [
          {
            title: 'Authentication Middleware & Central Error Pipeline',
            language: 'javascript',
            code: `function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== 'secret-dev-key') {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
}

app.get('/api/protected', requireApiKey, (req, res) => {
  res.json({ secureData: 42 });
});`,
            explanation: 'The route handler only executes if requireApiKey calls next().',
          },
        ],
        keyTakeaways: [
          'Always call next() or send a response, otherwise requests hang forever.',
          'Order matters: middlewares execute in the exact order they are registered with app.use().',
          'Use centralized error handling middleware to avoid repetitive try/catch boilerplate.',
        ],
        quiz: [
          {
            id: 'q-be-2-2-1',
            question: 'How does Express identify a dedicated error-handling middleware function?',
            options: [
              'By decorating it with the @ErrorHandler attribute',
              'By checking that the function takes exactly 4 arguments: (err, req, res, next)',
              'By registering it before all other routes',
              'By returning a Promise rejection',
            ],
            correctAnswerIndex: 1,
            explanation: 'Express inspects function.length. When it finds 4 arguments (err, req, res, next), it designates the function as an error handler.',
          },
        ],
        starterPlaygroundCode: {
          type: 'backend',
          backendCode: `// Middleware Pipeline Simulation
app.get('/api/secure-profile', (req, res) => {
  const token = req.headers['authorization'];
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Bearer token required in Authorization header' });
  }
  
  res.json({
    userId: 'usr_892',
    name: 'Dev Student',
    role: 'Full-Stack Scholar',
    verified: true
  });
});`,
        },
      },
    ],
  },
  {
    id: 'be-m3',
    trackId: 'backend',
    title: 'Databases & Data Modeling',
    order: 3,
    description: 'Relational (SQL) vs Document (NoSQL), CRUD query optimization, relationships, and indexing.',
    iconName: 'Database',
    lessons: [
      {
        id: 'be-3-1',
        trackId: 'backend',
        moduleId: 'be-m3',
        subdivision: '3.1',
        title: 'Relational (PostgreSQL) vs Document (MongoDB) Models',
        estimatedMinutes: 10,
        difficulty: 'intermediate',
        summary: 'Choose the right database paradigm: ACID transactions and strict schemas vs flexible JSON documents.',
        objectives: [
          'Understand ACID guarantees in relational databases',
          'Compare relational foreign keys and JOINs against embedded document patterns',
          'Determine when to select SQL vs NoSQL for application requirements',
        ],
        content: `The two prevailing database paradigms in modern backend engineering are:

1. **Relational Databases (SQL - PostgreSQL, MySQL)**:
   - Organized in tables with rows and columns.
   - Enforce strict schemas and data types.
   - Strong relationships managed via Primary Keys (PK) and Foreign Keys (FK).
   - Full **ACID** (Atomicity, Consistency, Isolation, Durability) guarantees, essential for financial and transactional integrity.

2. **Document Databases (NoSQL - MongoDB)**:
   - Stores data as semi-structured JSON/BSON documents.
   - Flexible schemas allow documents in the same collection to have different fields.
   - Fast read performance when embedding related child data in a single document.
   - Highly suitable for rapidly evolving content structures.`,
        codeExamples: [
          {
            title: 'SQL Schema vs Document Structure',
            language: 'json',
            code: `// Relational concept (separate tables joined by foreign key):
// users table: { id: 1, name: "Maria" }
// orders table: { id: 101, user_id: 1, amount: 49.99 }

// Document concept (embedded hierarchy):
{
  "_id": "usr_1",
  "name": "Maria",
  "orders": [
    { "orderId": 101, "amount": 49.99, "status": "shipped" }
  ]
}`,
            explanation: 'SQL normalizes data across tables, whereas NoSQL often denormalizes data for fast atomic reads.',
          },
        ],
        keyTakeaways: [
          'Choose SQL when data is relational, structured, and requires strict transaction guarantees.',
          'Choose NoSQL when data is hierarchical, polymorphic, or schema changes frequently.',
          'Never store unindexed foreign keys in high-volume tables.',
        ],
        quiz: [
          {
            id: 'q-be-3-1-1',
            question: 'What does the "A" in ACID database transactions stand for?',
            options: ['Asynchronous', 'Atomicity', 'Availability', 'Authorization'],
            correctAnswerIndex: 1,
            explanation: 'Atomicity guarantees that all operations within a transaction succeed together or the entire transaction is rolled back (all-or-nothing).',
          },
        ],
        starterPlaygroundCode: {
          type: 'backend',
          backendCode: `// In-Memory Relational Join Simulator
const users = [{ id: 1, name: 'Elena Rostova' }];
const courses = [
  { id: 101, userId: 1, title: 'Advanced Backend Systems' },
  { id: 102, userId: 1, title: 'Database Optimization' }
];

app.get('/api/users/:id/enrolled-courses', (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Simulate SQL JOIN: SELECT * FROM courses WHERE userId = :id
  const userCourses = courses.filter(c => c.userId === userId);
  res.json({
    user: user.name,
    enrolledCourses: userCourses
  });
});`,
        },
      },
    ],
  },
  {
    id: 'be-m4',
    trackId: 'backend',
    title: 'Authentication & Production Security',
    order: 4,
    description: 'Password hashing with bcrypt salts, JWT tokens, CORS policy, and rate limiting.',
    iconName: 'ShieldCheck',
    lessons: [
      {
        id: 'be-4-1',
        trackId: 'backend',
        moduleId: 'be-m4',
        subdivision: '4.1',
        title: 'Cryptographic Hashing & Salt Principles',
        estimatedMinutes: 10,
        difficulty: 'intermediate',
        summary: 'Never store plain text passwords. Master one-way cryptographic hashing, salts, and rainbow table prevention.',
        objectives: [
          'Understand why symmetric encryption is dangerous for passwords',
          'Learn how one-way hash functions (bcrypt, argon2) work',
          'Understand how unique salts neutralize precomputed rainbow table attacks',
        ],
        content: `Never store passwords in plaintext or using reversible two-way encryption!

If a database is compromised, passwords stored with simple algorithms (like MD5 or SHA1) can be reversed in seconds using **rainbow tables** (precomputed lookup tables of billions of hashed common passwords).

### Modern Standard: Slow, Salted Hashes (bcrypt / Argon2)
1. **Salt**: A random cryptographic string generated uniquely for every user.
2. **Work Factor (Cost)**: Configurable iteration count that deliberately slows down hashing (e.g. 100ms per attempt).
   - For an authorized user, a 100ms delay during login is unnoticeable.
   - For an attacker attempting billions of brute-force guesses per second, the delay makes attacks computationally impossible!`,
        codeExamples: [
          {
            title: 'bcrypt Password Hashing Simulation',
            language: 'javascript',
            code: `// When registering user:
const salt = crypto.randomUUID(); // Unique salt
const hash = hashWithSalt(password, salt);
// Save salt + hash in database

// When user logs in:
const candidateHash = hashWithSalt(loginPassword, user.salt);
const isValid = (candidateHash === user.hash);`,
            explanation: 'The stored salt is combined with the login candidate and re-hashed to verify match.',
          },
        ],
        keyTakeaways: [
          'Never store passwords in plain text or reversible formats.',
          'Always use a slow, adaptive hashing algorithm like bcrypt or Argon2.',
          'Salts ensure that two users with identical passwords have completely different hashes.',
        ],
        quiz: [
          {
            id: 'q-be-4-1-1',
            question: 'What is the primary security objective of adding a unique cryptographic "salt" to each password before hashing?',
            options: [
              'To compress the password into fewer bytes',
              'To make the password readable by the database administrator',
              'To prevent attackers from using precomputed rainbow tables to crack passwords',
              'To allow two-way decryption in case the user forgets their password',
            ],
            correctAnswerIndex: 2,
            explanation: 'Salts guarantee that identical passwords result in completely unique hashes, neutralizing precomputed dictionary and rainbow table lookups.',
          },
        ],
        starterPlaygroundCode: {
          type: 'backend',
          backendCode: `// Salted Password Hash Simulator
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomUUID().slice(0, 8);
  const hash = crypto.createHash('sha256').update(password + ':' + salt).digest('hex');
  return { salt, hash };
}

const userCredential = hashPassword('SuperSecret123!');
console.log('Generated Salt:', userCredential.salt);
console.log('Resulting Hash:', userCredential.hash);

app.post('/api/verify-password', (req, res) => {
  const input = req.body?.password || '';
  const testHash = crypto.createHash('sha256').update(input + ':' + userCredential.salt).digest('hex');
  const match = (testHash === userCredential.hash);
  res.json({ verified: match, message: match ? 'Password correct!' : 'Invalid password' });
});`,
        },
      },
      {
        id: 'be-4-2',
        trackId: 'backend',
        moduleId: 'be-m4',
        subdivision: '4.2',
        title: 'JSON Web Tokens (JWT) & Stateless Auth',
        estimatedMinutes: 12,
        difficulty: 'advanced',
        summary: 'Deep dive into Header, Payload, Signature, token expiration, and secure Bearer token dispatch.',
        objectives: [
          'Anatomy of a JWT: Base64URL(Header) . Base64URL(Payload) . HMACSHA256(Signature)',
          'Stateless verification without querying the session database on every request',
          'Differentiate Access Tokens (short-lived) from Refresh Tokens (secure httpOnly cookie)',
        ],
        content: `JSON Web Tokens (JWTs) provide a stateless, digitally signed mechanism for transferring authentication claims between client and server.

A JWT consists of three parts separated by dots (\`.\`):
1. **Header**: Contains the algorithm and token type (\`{"alg": "HS256", "typ": "JWT"}\`).
2. **Payload**: User claims (\`{"userId": "123", "role": "admin", "exp": 1712345678}\`). *Note: Payloads are Base64 encoded, not encrypted! Never put sensitive passwords or credit card numbers in a JWT.*
3. **Signature**: Cryptographic HMAC hash of \`Base64(Header) + "." + Base64(Payload)\` using the server's secret key.

Because the signature requires the server's private secret, any client attempt to alter the payload (e.g., changing \`role: "student"\` to \`role: "admin"\`) invalidates the signature immediately.`,
        codeExamples: [
          {
            title: 'JWT Bearer Verification Logic',
            language: 'javascript',
            code: `function verifyToken(token, secret) {
  const [headerB64, payloadB64, signature] = token.split('.');
  const expectedSig = hmacSha256(headerB64 + '.' + payloadB64, secret);
  if (signature !== expectedSig) {
    throw new Error('Tampered token signature');
  }
  const payload = JSON.parse(atob(payloadB64));
  if (payload.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }
  return payload;
}`,
            explanation: 'The server verifies the signature purely with math, without querying a session database on every API call.',
          },
        ],
        keyTakeaways: [
          'JWT payloads are readable by anyone; they are signed for integrity, not encrypted for secrecy.',
          'Keep access token lifespans short (15-60 minutes) to mitigate token theft.',
          'Always transmit tokens via Authorization: Bearer <token> or secure httpOnly cookies.',
        ],
        quiz: [
          {
            id: 'q-be-4-2-1',
            question: 'Why should sensitive data like a user’s social security number or credit card NEVER be stored in a standard JWT payload?',
            options: [
              'JWT payloads cannot exceed 16 bytes in length',
              'The payload is only Base64 encoded, not encrypted, meaning anyone can decode and read it',
              'The signature is invalidated if numbers are present in the payload',
              'JSON Web Tokens only support ASCII strings',
            ],
            correctAnswerIndex: 1,
            explanation: 'JWTs provide signature verification to prevent tampering, but the payload is plain Base64 encoded and can be decoded by any client or proxy.',
          },
        ],
        starterPlaygroundCode: {
          type: 'backend',
          backendCode: `// JWT Token Generator & Verifier Simulator
function createMockJWT(userId, role) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    role: role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  }));
  const signature = 'sig_' + btoa(header + '.' + payload).slice(0, 10);
  return header + '.' + payload + '.' + signature;
}

const sampleToken = createMockJWT('usr_42', 'lead_architect');
console.log('Minted JWT:', sampleToken);

app.post('/api/auth/login', (req, res) => {
  res.json({ token: sampleToken, tokenType: 'Bearer', expiresIn: 3600 });
});`,
        },
      },
    ],
  },
];
