const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const game = fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const render = fs.readFileSync(path.join(root, 'render.yaml'), 'utf8');

test('Socket.IO script loading has bounded local and CDN attempts and can be retried', () => {
  assert.match(html, /window\.loadZoneSocketClient\s*=\s*async function/);
  assert.match(html, /loadScript\('\/socket\.io\/socket\.io\.js',\s*7000\)/);
  assert.match(html, /cdn\.socket\.io\/4\.8\.1\/socket\.io\.min\.js',\s*8000/);
  assert.match(html, /window\.zoneSocketClientReady\s*=\s*window\.loadZoneSocketClient\(\)/);
});

test('local development defaults to its own origin and retries a failed Socket.IO load', () => {
  assert.match(game, /DEFAULT_ZONE_SERVER_URL=IS_LOCAL_ZONE_HOST\?window\.location\.origin/);
  assert.match(game, /if\(IS_LOCAL_ZONE_HOST\).*onrender\\\.com/s);
  assert.match(game, /Повторяем загрузку автоматически через 3 секунды/);
  assert.match(game, /window\.zoneSocketClientReady=window\.loadZoneSocketClient\(\)/);
});

test('HTTP server listens without waiting for PostgreSQL and player hello waits for DB bootstrap', () => {
  assert.match(server, /dbInitialization\s*=\s*initDb\(\)\.catch/);
  assert.match(server, /server\.listen\(PORT,'0\.0\.0\.0'/);
  assert.match(server, /await dbInitialization;/);
  assert.doesNotMatch(server, /initDb\(\)[\s\S]{0,180}\.finally\(\(\)=>server\.listen/);
});

test('Render service explicitly uses production mode', () => {
  assert.match(render, /- key: NODE_ENV\s+value: production/);
});
