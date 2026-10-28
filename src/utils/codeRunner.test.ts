import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFrontendSrcDoc, executeBackendSimulation } from './codeRunner';

test('buildFrontendSrcDoc embeds HTML, CSS, and JS with console interception', () => {
  const html = '<h1 id="test">Hello World</h1>';
  const css = '#test { color: red; }';
  const js = 'console.log("runner test");';

  const srcdoc = buildFrontendSrcDoc(html, css, js);
  assert.ok(srcdoc.includes('<h1 id="test">Hello World</h1>'));
  assert.ok(srcdoc.includes('#test { color: red; }'));
  assert.ok(srcdoc.includes('DEVPATH_CONSOLE'));
  assert.ok(srcdoc.includes('runner test'));
});

test('executeBackendSimulation simulates Express route handling and JSON responses', async () => {
  const backendCode = `
    const users = [{ id: 1, name: 'Ada Lovelace' }];
    app.get('/api/users', (req, res) => {
      console.log('Fetching users count:', users.length);
      res.json(users);
    });
    app.post('/api/users', (req, res) => {
      res.status(201).json({ success: true, id: 2 });
    });
  `;

  // Test GET request
  const getRes = await executeBackendSimulation(backendCode, {
    method: 'GET',
    path: '/api/users',
  });

  assert.equal(getRes.status, 200);
  assert.deepEqual(getRes.data, [{ id: 1, name: 'Ada Lovelace' }]);
  assert.ok(getRes.logs.some((l) => l.message.includes('Fetching users count: 1')));

  // Test POST request
  const postRes = await executeBackendSimulation(backendCode, {
    method: 'POST',
    path: '/api/users',
    body: { name: 'Grace Hopper' },
  });

  assert.equal(postRes.status, 201);
  assert.deepEqual(postRes.data, { success: true, id: 2 });

  // Test 404 route
  const notFoundRes = await executeBackendSimulation(backendCode, {
    method: 'GET',
    path: '/api/unknown',
  });

  assert.equal(notFoundRes.status, 404);
});
