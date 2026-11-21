const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('Render host serves a dependency-free single-player build', () => {
  const server = read('server.js');
  assert.match(server, /http\.createServer/);
  assert.match(server, /fs\.createReadStream/);
  assert.match(server, /pathname === '\/health'/);
  assert.doesNotMatch(server, /socket\.io|require\(['"]pg['"]\)|new Server\(/i);
});

test('browser no longer loads multiplayer client or exposes multiplayer page', () => {
  const html = read('public/index.html');
  const client = read('public/js/game.js');
  assert.doesNotMatch(html, /socket\.io|data-v="multiplayer"|id="multiplayer"/i);
  assert.doesNotMatch(client, /connectZone|zoneSocketClientReady|zone-online-multiplayer\.onrender\.com/i);
});

test('Render config has no database dependency', () => {
  const render = read('render.yaml');
  assert.match(render, /healthCheckPath: \/health/);
  assert.doesNotMatch(render, /DATABASE_URL|postgres/i);
});
