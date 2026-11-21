const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
const client = fs.readFileSync(path.join(__dirname, '../public/js/game.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../public/css/game.css'), 'utf8');

test('inventory can be opened directly from the in-game header', () => {
  assert.match(html, /class="inventory-quick-trigger"[^>]*onclick="view\('inventory'\)"/);
  assert.match(html, /aria-label="Открыть инвентарь"/);
  assert.match(css, /\.inventory-quick-trigger/);
});

test('full Zone map preserves its original aspect ratio instead of stretching', () => {
  assert.match(client, /zoneMapMode==='zone'\?'xMidYMid meet'/);
  assert.match(css, /\.zone-map\{[^}]*aspect-ratio:1\/2/s);
});

test('NPC squad markers do not render group size as an overlaid number', () => {
  assert.doesNotMatch(client, /class="squad-count"/);
  assert.match(client, /function showMapSquad/);
  assert.match(client, /ОТРЯД · \$\{members\.length\}/);
});
