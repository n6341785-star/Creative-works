import { Module } from '../types';

export const frontendModules: Module[] = [
  {
    id: 'fe-m1',
    trackId: 'frontend',
    title: 'HTML5 Semantic Architecture',
    order: 1,
    description: 'Master document semantics, accessible DOM trees, and resilient HTML forms.',
    iconName: 'Layout',
    lessons: [
      {
        id: 'fe-1-1',
        trackId: 'frontend',
        moduleId: 'fe-m1',
        subdivision: '1.1',
        title: 'Modern Document Foundations & Metadata',
        estimatedMinutes: 8,
        difficulty: 'beginner',
        summary: 'Learn the exact anatomy of modern HTML5 documents, viewport configuration, and SEO meta tags.',
        objectives: [
          'Understand the role of the DOCTYPE declaration',
          'Configure mobile viewport meta tags for responsive rendering',
          'Structure the head section with appropriate charset and metadata',
        ],
        content: `HTML5 documents provide the semantic backbone of the modern web. The document begins with \`<!doctype html>\`, which instructs the browser rendering engine to parse in standards mode rather than quirks mode.

Inside the \`<head>\`, three elements are non-negotiable for mobile-first and offline-capable applications:
1. **Character Encoding**: \`<meta charset="UTF-8">\` guarantees correct unicode text rendering worldwide.
2. **Viewport Tag**: \`<meta name="viewport" content="width=device-width, initial-scale=1.0">\` tells mobile browsers to scale the viewport to the device's physical pixel width instead of simulating a 980px desktop canvas.
3. **PWA & Theme Color**: \`<meta name="theme-color" content="#0f172a">\` controls the Android system status bar tint.`,
        codeExamples: [
          {
            title: 'Production HTML5 Boilerplate',
            language: 'html',
            code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Modern App</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>`,
            explanation: 'The minimal standard document structure recognized by all modern browser engines.',
          },
        ],
        keyTakeaways: [
          'Always declare <!doctype html> on line 1 to prevent quirks mode rendering bugs.',
          'The viewport meta tag is required for responsive layouts to scale on mobile screens.',
          'Keep your head section clean and order charset first to ensure early parser decoding.',
        ],
        quiz: [
          {
            id: 'q-fe-1-1-1',
            question: 'What is the primary technical consequence of omitting <!doctype html>?',
            options: [
              'The browser enters Quirks Mode and uses legacy rendering bugs from the 1990s',
              'JavaScript execution is automatically disabled by the browser',
              'CSS styling cannot be loaded via external link tags',
              'The page will immediately trigger an uncaught DOM exception',
            ],
            correctAnswerIndex: 0,
            explanation: 'Without <!doctype html>, browsers trigger "Quirks Mode" to emulate Netscape 4 and Internet Explorer 5 layout quirks, breaking standard box sizing.',
          },
          {
            id: 'q-fe-1-1-2',
            question: 'Why is content="width=device-width, initial-scale=1.0" critical on mobile devices?',
            options: [
              'It forces the mobile device to operate in landscape mode',
              'It sets the viewport width to the device screen width instead of zooming out to a 980px default',
              'It downloads smaller mobile-optimized image resolutions automatically',
              'It forces all CSS media queries to evaluate to true',
            ],
            correctAnswerIndex: 1,
            explanation: 'Without this tag, mobile browsers assume the page was built for desktop and render it at 980px, resulting in microscopic, zoomed-out text.',
          },
        ],
        starterPlaygroundCode: {
          type: 'frontend',
          html: `<header>
  <h1>Welcome to Frontend Studio</h1>
  <p>Edit this HTML to see live updates!</p>
</header>`,
          css: `header {
  padding: 1.5rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
  font-family: sans-serif;
}
h1 { color: #0284c7; margin-top: 0; }`,
          js: `console.log("Document initialized in standards mode.");`,
        },
      },
      {
        id: 'fe-1-2',
        trackId: 'frontend',
        moduleId: 'fe-m1',
        subdivision: '1.2',
        title: 'Semantic Elements & Screen-Reader Trees',
        estimatedMinutes: 10,
        difficulty: 'beginner',
        summary: 'Replace generic <div> wrappers with semantic landmarks like <header>, <nav>, <main>, <article>, and <aside>.',
        objectives: [
          'Differentiate generic container divs from semantic landmark elements',
          'Structure accessible content with main, section, nav, and article tags',
          'Understand how semantic HTML constructs the browser accessibility tree',
        ],
        content: `Browsers build two complementary trees when parsing HTML: the Document Object Model (DOM) and the Accessibility Object Model (AOM). Screen readers and search engine crawlers rely heavily on the AOM.

Replacing generic \`<div>\` containers with landmark tags creates landmarks that assistive technologies can jump between:
- \`<header>\`: Site or article banner containing branding and navigation.
- \`<nav>\`: Set of primary navigation links.
- \`<main>\`: The central unique content of the page (only one per document).
- \`<article>\`: Self-contained syndicateable content (e.g., blog post, comment, card).
- \`<section>\`: Thematic grouping of content, typically with a heading.
- \`<footer>\`: Authorship, copyright, and secondary links.`,
        codeExamples: [
          {
            title: 'Semantic Page Landmark Structure',
            language: 'html',
            code: `<header>
  <nav aria-label="Main Navigation">
    <a href="/">Home</a>
    <a href="/lessons">Lessons</a>
  </nav>
</header>
<main>
  <article>
    <h2>Semantic Elements in Depth</h2>
    <p>Using semantic HTML improves accessibility without extra code.</p>
  </article>
</main>
<footer>
  <p>&copy; 2026 DevPath Academy</p>
</footer>`,
            explanation: 'Clean landmark regions that assistive devices and search spiders parse directly.',
          },
        ],
        keyTakeaways: [
          'Semantic tags provide meaningful structure without adding CSS overhead.',
          'Always maintain a single <main> element per document.',
          'Never use <div onclick> when a native <button> exists.',
        ],
        quiz: [
          {
            id: 'q-fe-1-2-1',
            question: 'Which element represents the dominant, unique content of the document body?',
            options: ['<article>', '<main>', '<section>', '<content>'],
            correctAnswerIndex: 1,
            explanation: 'The <main> tag designates the primary content of the body. There should be only one non-hidden <main> per page.',
          },
          {
            id: 'q-fe-1-2-2',
            question: 'Why should clickable card interactions prefer <button> or <a> over <div onclick="">?',
            options: [
              'Divs cannot receive background colors in CSS',
              'Buttons natively provide keyboard focus, Enter/Space activation, and screen reader roles',
              'Click events on divs will fail in strict mode',
              'Modern browsers disallow inline JS event handlers entirely',
            ],
            correctAnswerIndex: 1,
            explanation: 'Native buttons automatically get tab focus, enter/space keypress handling, and the "button" accessibility role without custom ARIA.',
          },
        ],
        starterPlaygroundCode: {
          type: 'frontend',
          html: `<main class="card-grid">
  <article class="card">
    <span class="category">HTML5</span>
    <h3>Semantic Web</h3>
    <p>Build accessible DOM structures.</p>
    <button id="learnBtn">Learn More</button>
  </article>
</main>`,
          css: `.card-grid { padding: 1rem; }
.card { border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem; max-width: 320px; }
.category { font-size: 0.75rem; color: #64748b; text-transform: uppercase; }
h3 { margin: 0.5rem 0; color: #1e293b; }
button { background: #0284c7; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer; }`,
          js: `document.getElementById('learnBtn').addEventListener('click', () => {
  console.log('Semantic button tapped!');
});`,
        },
      },
    ],
  },
  {
    id: 'fe-m2',
    trackId: 'frontend',
    title: 'Modern CSS & Responsive Systems',
    order: 2,
    description: 'Conquer the CSS Box Model, Flexbox alignment, CSS Grid, and fluid responsive design.',
    iconName: 'Maximize2',
    lessons: [
      {
        id: 'fe-2-1',
        trackId: 'frontend',
        moduleId: 'fe-m2',
        subdivision: '2.1',
        title: 'The Box Model & Box-Sizing Discipline',
        estimatedMinutes: 8,
        difficulty: 'beginner',
        summary: 'Understand content-box vs border-box, padding, margins, and margin collapse.',
        objectives: [
          'Understand how width, padding, and border combine to determine element size',
          'Configure box-sizing: border-box globally to prevent layout overflow',
          'Recognize vertical margin collapse behavior',
        ],
        content: `Every element in CSS is rendered as a rectangular box composed of four concentric layers:
1. **Content**: The inner text, image, or child nodes.
2. **Padding**: Transparent clearing around the content, inside the border.
3. **Border**: The stroke encircling the padding.
4. **Margin**: Transparent space outside the border separating adjacent elements.

By default, CSS uses \`box-sizing: content-box\`. In this mode, setting \`width: 200px\` with \`padding: 20px\` creates a rendered width of **240px** ($200 + 20 + 20$), easily breaking multi-column layouts!

Setting \`box-sizing: border-box\` guarantees that \`width: 200px\` absorbs padding and borders internally.`,
        codeExamples: [
          {
            title: 'Universal Border-Box Reset',
            language: 'css',
            code: `*, *::before, *::after {
  box-sizing: border-box;
}

.box {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border: 2px solid #cbd5e1;
  /* Total rendered width remains 400px */
}`,
            explanation: 'Universal reset ensures padding never expands an element beyond its declared width.',
          },
        ],
        keyTakeaways: [
          'Universal box-sizing: border-box eliminates math headaches with padding and borders.',
          'Vertical margins between adjacent blocks collapse to the largest single margin value.',
          'Horizontal margins never collapse.',
        ],
        quiz: [
          {
            id: 'q-fe-2-1-1',
            question: 'An element has width: 100px, padding: 10px, border: 2px, and box-sizing: content-box. What is its total rendered width?',
            options: ['100px', '124px', '112px', '120px'],
            correctAnswerIndex: 1,
            explanation: 'Total width = 100 (content) + 10*2 (padding left/right) + 2*2 (border left/right) = 124px.',
          },
        ],
        starterPlaygroundCode: {
          type: 'frontend',
          html: `<div class="container">
  <div class="box content-box">content-box (overflow risk)</div>
  <div class="box border-box">border-box (safe width)</div>
</div>`,
          css: `.container { display: flex; flex-direction: column; gap: 1rem; }
.box { width: 200px; padding: 20px; border: 4px solid #3b82f6; background: #e0f2fe; }
.content-box { box-sizing: content-box; }
.border-box { box-sizing: border-box; }`,
          js: `console.log("Inspect both boxes in preview to see size differences.");`,
        },
      },
      {
        id: 'fe-2-2',
        trackId: 'frontend',
        moduleId: 'fe-m2',
        subdivision: '2.2',
        title: 'Flexbox Deep Dive & 1D Layouts',
        estimatedMinutes: 12,
        difficulty: 'intermediate',
        summary: 'Master the main axis vs cross axis, justify-content, align-items, flex-grow, and flex-shrink.',
        objectives: [
          'Understand main axis and cross axis directions',
          'Use justify-content and align-items for perfect alignment',
          'Utilize flex: 1 (grow, shrink, basis) for proportional distributions',
        ],
        content: `Flexbox is designed for one-dimensional layouts (a row or a column).

- When \`flex-direction: row\` (default):
  - **Main Axis**: Horizontal (controlled by \`justify-content\`).
  - **Cross Axis**: Vertical (controlled by \`align-items\`).
- When \`flex-direction: column\`:
  - **Main Axis**: Vertical (controlled by \`justify-content\`).
  - **Cross Axis**: Horizontal (controlled by \`align-items\`).

The shorthand \`flex: 1\` expands to \`flex-grow: 1; flex-shrink: 1; flex-basis: 0%\`, allowing items to share remaining space equally.`,
        codeExamples: [
          {
            title: 'Centering & Responsive Split Card',
            language: 'css',
            code: `.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.center-hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}`,
            explanation: 'Modern Flexbox solves vertical and horizontal centering in three lines of code.',
          },
        ],
        keyTakeaways: [
          'Justify-content always controls alignment along the main axis.',
          'Align-items always controls alignment along the cross axis.',
          'Use gap instead of margins on flex children for clean spacing.',
        ],
        quiz: [
          {
            id: 'q-fe-2-2-1',
            question: 'When flex-direction is set to column, which property aligns items horizontally?',
            options: ['justify-content', 'align-items', 'text-align', 'align-content'],
            correctAnswerIndex: 1,
            explanation: 'In a column layout, the cross axis is horizontal, so align-items governs horizontal positioning.',
          },
        ],
        starterPlaygroundCode: {
          type: 'frontend',
          html: `<div class="toolbar">
  <div class="logo">⚡ DevPath</div>
  <div class="nav-links">
    <span>Home</span>
    <span>Tracks</span>
    <span>Projects</span>
  </div>
  <button class="cta-btn">Sign In</button>
</div>`,
          css: `.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #0f172a;
  color: white;
  border-radius: 0.5rem;
}
.nav-links { display: flex; gap: 1rem; font-size: 0.875rem; }
.cta-btn { background: #38bdf8; border: none; padding: 0.4rem 0.8rem; border-radius: 0.25rem; font-weight: 600; cursor: pointer; }`,
          js: `console.log("Flexbox toolbar mounted.");`,
        },
      },
    ],
  },
  {
    id: 'fe-m3',
    trackId: 'frontend',
    title: 'JavaScript ES6+ & DOM Execution',
    order: 3,
    description: 'Scope, closures, array pipelines, asynchronous async/await, and event handling.',
    iconName: 'Cpu',
    lessons: [
      {
        id: 'fe-3-1',
        trackId: 'frontend',
        moduleId: 'fe-m3',
        subdivision: '3.1',
        title: 'Closures, Lexical Scope & Block Binding',
        estimatedMinutes: 10,
        difficulty: 'intermediate',
        summary: 'Deep dive into execution contexts, closures in state persistence, and let vs const vs var.',
        objectives: [
          'Understand how the JavaScript engine creates execution contexts and scopes',
          'Learn how functions retain references to outer scope variables via closures',
          'Prevent common closure pitfalls inside loops and event listeners',
        ],
        content: `A closure is the combination of a function bundled together with references to its surrounding state (lexical environment). In JavaScript, closures are created every time a function is created at function creation time.

Closures are the foundational mechanism behind data privacy, function factories, and React hooks like \`useState\`.

Because inner functions retain their outer scope references, an inner function can inspect and modify variables even after the outer function has completed execution and returned.`,
        codeExamples: [
          {
            title: 'Counter Factory Using Closures',
            language: 'javascript',
            code: `function createCounter(initialValue = 0) {
  let count = initialValue; // Private state protected by closure

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    getValue() {
      return count;
    }
  };
}

const counterA = createCounter(10);
console.log(counterA.increment()); // 11
console.log(counterA.getValue());  // 11`,
            explanation: 'The variable count cannot be accessed or modified directly from outside createCounter.',
          },
        ],
        keyTakeaways: [
          'Closures preserve access to outer variables even after the parent function returns.',
          'Always use const by default and let when reassigning; avoid var due to hoisting issues.',
          'Closures provide encapsulated private state without classes.',
        ],
        quiz: [
          {
            id: 'q-fe-3-1-1',
            question: 'What defines a JavaScript closure?',
            options: [
              'A function that has no return statement',
              'A function bundled together with references to its lexical environment',
              'A method that can only be invoked once',
              'An asynchronous function returning a Promise',
            ],
            correctAnswerIndex: 1,
            explanation: 'A closure gives a function access to its outer scope even after the outer function has finished executing.',
          },
        ],
        starterPlaygroundCode: {
          type: 'frontend',
          html: `<div style="text-align:center; padding: 2rem;">
  <h2>Closure Counter</h2>
  <div id="countDisplay" style="font-size: 2.5rem; font-weight: bold; margin: 1rem 0;">0</div>
  <button id="incBtn" style="padding: 0.5rem 1rem; margin: 0 0.25rem;">+ Increment</button>
  <button id="decBtn" style="padding: 0.5rem 1rem; margin: 0 0.25rem;">- Decrement</button>
</div>`,
          css: `button { background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }`,
          js: `function makeCounter() {
  let count = 0;
  return {
    inc: () => ++count,
    dec: () => --count
  };
}
const counter = makeCounter();
const display = document.getElementById('countDisplay');
document.getElementById('incBtn').onclick = () => { display.textContent = counter.inc(); };
document.getElementById('decBtn').onclick = () => { display.textContent = counter.dec(); };`,
        },
      },
      {
        id: 'fe-3-2',
        trackId: 'frontend',
        moduleId: 'fe-m3',
        subdivision: '3.2',
        title: 'Asynchronous JavaScript: Promises & Async/Await',
        estimatedMinutes: 12,
        difficulty: 'intermediate',
        summary: 'Understand the browser event loop, microtasks vs macrotasks, and robust error handling with async/await.',
        objectives: [
          'Understand the single-threaded event loop and Promise microtask queue',
          'Write clean asynchronous code using async/await and try/catch',
          'Execute concurrent requests safely with Promise.all()',
        ],
        content: `JavaScript is single-threaded, meaning it has one call stack and executes one operation at a time. Asynchronous tasks (timers, fetch requests, user interactions) are handed off to the browser APIs and queued.

- **Macrotasks**: setTimeout, setInterval, I/O events.
- **Microtasks**: Promise resolution handlers (.then, .catch, await resumes).
*Microtasks are always drained completely before the browser executes the next macrotask!*

Modern async/await syntax is syntactic sugar over Promises that makes asynchronous code read like synchronous code, while preserving non-blocking behavior.`,
        codeExamples: [
          {
            title: 'Parallel Fetching with Promise.all',
            language: 'javascript',
            code: `async function fetchDashboardData(userId) {
  try {
    const [profileRes, statsRes] = await Promise.all([
      fetch('/api/user/' + userId),
      fetch('/api/user/' + userId + '/stats')
    ]);

    if (!profileRes.ok || !statsRes.ok) {
      throw new Error('Network request failed');
    }

    const profile = await profileRes.json();
    const stats = await statsRes.json();
    return { profile, stats };
  } catch (err) {
    console.error('Failed to load dashboard:', err.message);
    throw err;
  }
}`,
            explanation: 'Promise.all fires both requests concurrently instead of sequentially waiting for each.',
          },
        ],
        keyTakeaways: [
          'Async functions always return a Promise implicitly.',
          'Always wrap await statements in try/catch blocks to gracefully handle network failures.',
          'Use Promise.all to fetch independent endpoints concurrently for better performance.',
        ],
        quiz: [
          {
            id: 'q-fe-3-2-1',
            question: 'What executes first after the synchronous call stack empties?',
            options: [
              'setTimeout callbacks in the macrotask queue',
              'Microtasks (such as resolved Promise .then handlers)',
              'DOM requestAnimationFrame callbacks',
              'setInterval callbacks',
            ],
            correctAnswerIndex: 1,
            explanation: 'The microtask queue has strict priority over the macrotask queue. All microtasks must drain before the next macrotask is processed.',
          },
        ],
        starterPlaygroundCode: {
          type: 'frontend',
          html: `<div style="padding: 1rem; font-family: sans-serif;">
  <h3>Async Data Simulator</h3>
  <button id="fetchBtn" style="padding: 0.5rem 1rem; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">Simulate API Fetch</button>
  <div id="output" style="margin-top: 1rem; padding: 1rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; min-height: 50px;">Click button to start...</div>
</div>`,
          css: ``,
          js: `async function mockFetchStudent() {
  const output = document.getElementById('output');
  output.textContent = 'Fetching student profile (1s delay)...';
  
  await new Promise(res => setTimeout(res, 1000));
  
  const student = { name: 'Alex Rivera', track: 'Frontend Engineering', completedLessons: 12 };
  output.innerHTML = '<strong>Loaded:</strong> ' + JSON.stringify(student, null, 2);
  console.log('Async operation complete:', student);
}

document.getElementById('fetchBtn').onclick = mockFetchStudent;`,
        },
      },
    ],
  },
  {
    id: 'fe-m4',
    trackId: 'frontend',
    title: 'React & Component Architecture',
    order: 4,
    description: 'Component lifecycles, hooks (useState, useEffect), state lifting, and immutable rendering.',
    iconName: 'Box',
    lessons: [
      {
        id: 'fe-4-1',
        trackId: 'frontend',
        moduleId: 'fe-m4',
        subdivision: '4.1',
        title: 'State, Pure Functions & The Reconciliation Loop',
        estimatedMinutes: 12,
        difficulty: 'intermediate',
        summary: 'Understand unidirectional data flow, why React requires pure render functions, and immutable state updates.',
        objectives: [
          'Understand why mutating state directly breaks React re-renders',
          'Learn the updater function pattern with useState: setVal(prev => prev + 1)',
          'Identify component re-render triggers in the Virtual DOM',
        ],
        content: `React components are functions that take props and state and return JSX. React maintains an internal Virtual DOM representation to compute differences (diffing) and commit minimal DOM updates.

Crucial rules of React state:
1. **Never mutate state directly**: \`state.count++\` modifies the existing memory reference, causing React's shallow comparison (\`Object.is\`) to assume nothing changed and skip the re-render.
2. **Immutable updates**: Always return a new object or array (\`{ ...prev, count: prev.count + 1 }\`).
3. **Batching**: Multiple state updates triggered inside event handlers are batched into a single render pass to protect 60fps frame rates.`,
        codeExamples: [
          {
            title: 'Immutable State Update Patterns',
            language: 'javascript',
            code: `// Array update: adding an item without mutating
setTodos(prev => [...prev, { id: Date.now(), text: 'Study Closures' }]);

// Array update: toggling completed flag by id
setTodos(prev =>
  prev.map(item => item.id === targetId ? { ...item, done: !item.done } : item)
);`,
            explanation: 'The map method returns a brand new array, preserving Reacts reconciliation invariants.',
          },
        ],
        keyTakeaways: [
          'Direct state mutation prevents components from re-rendering.',
          'Always use the functional updater form when new state depends on previous state.',
          'Keep components pure: given the same inputs, they should render the same output without side effects.',
        ],
        quiz: [
          {
            id: 'q-fe-4-1-1',
            question: 'Why does calling state.items.push("new") fail to reliably re-render a React component?',
            options: [
              'The push method does not exist on JavaScript arrays',
              'React compares state by reference using Object.is, so pointing to the same modified array skips re-rendering',
              'React prohibits arrays from being stored in state',
              'Push operations trigger synchronous infinite render loops',
            ],
            correctAnswerIndex: 1,
            explanation: 'Because array mutation does not change the array memory reference, React shallow comparison determines the state is unchanged and bails out.',
          },
        ],
        starterPlaygroundCode: {
          type: 'frontend',
          html: `<div id="app" style="font-family: sans-serif; padding: 1.5rem; max-width: 400px; margin: auto;">
  <h3>Task Checklist (Pure DOM simulation)</h3>
  <div style="display:flex; gap: 0.5rem; margin-bottom: 1rem;">
    <input id="taskInput" placeholder="Add a new task" style="flex:1; padding: 0.5rem; border:1px solid #cbd5e1; border-radius:4px;" />
    <button id="addBtn" style="background:#0284c7; color:white; border:none; padding:0.5rem 1rem; border-radius:4px; cursor:pointer;">Add</button>
  </div>
  <ul id="taskList" style="list-style:none; padding:0; margin:0;"></ul>
</div>`,
          css: `li { padding: 0.5rem; border-bottom: 1px solid #e2e8f0; display:flex; justify-content:space-between; }`,
          js: `let tasks = [{ id: 1, text: 'Master React state invariants' }];

function render() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.text;
    list.appendChild(li);
  });
}

document.getElementById('addBtn').onclick = () => {
  const input = document.getElementById('taskInput');
  if (input.value.trim()) {
    // Immutable update pattern!
    tasks = [...tasks, { id: Date.now(), text: input.value.trim() }];
    input.value = '';
    render();
    console.log('Tasks updated immutably:', tasks);
  }
};

render();`,
        },
      },
    ],
  },
];
