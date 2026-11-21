const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const client = fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'public/css/game.css'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
test('map supports drag panning, wheel zoom, click destinations in both map modes and fullscreen', () => {
  for (const fn of ['mapPointerDown','mapPointerMove','mapPointerUp','mapPointer','toggleMapFullscreen']) assert.match(client, new RegExp(`function ${fn}\\(`));
  assert.match(client, /onpointerdown="mapPointerDown\(event\)"/);
  assert.match(client, /onpointermove="mapPointerMove\(event\)"/);
  assert.match(client, /nearest&&nearest\.id!==g\.loc/);
  assert.match(html, /id="zoneMapFrame"/);
  assert.match(css, /touch-action:none/);
});
test('online and offline walking use a slower movement speed', () => {
  assert.match(client, /const step=2\.5\*dt/);
  assert.match(server, /createMoveOrder\(p,\{x:tx,y:ty\},Date\.now\(\),2\.5\)/);
});

test('4.33.28 confirms sector travel, routes sector clicks, and opens the whole-Zone map fullscreen', () => {
  assert.match(client, /function handleMapSectorSelect\(id\)/);
  assert.match(client, /confirm\(`Начать переход в сектор/);
  assert.match(client, /onclick=\"handleMapSectorSelect/);
  assert.match(client, /toggleMapFullscreen\(true\)/);
  assert.match(client, /function blockedAt\(x,y\)\{const r=5;return x<r\|\|y<r\|\|x>1000-r\|\|y>2000-r;/);
  assert.match(css, /map-fullscreen-fallback/);
});
