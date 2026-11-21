const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

test('4.33.21 immersive title screen has branded menu, version and new-game flow', () => {
  const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'public/css/game.css'), 'utf8');
  for (const id of ['titleScreen', 'titleContinue', 'titleLoad', 'titleCredits']) assert.match(html, new RegExp(`id="${id}"`));
  assert.ok(html.includes('ZONE ONLINE · VER. 4.33.21'));
  assert.match(html, /Новая игра/);
  assert.ok(js.includes('function beginNewZoneGame()'));
  assert.ok(js.includes('function continueZoneGame()'));
  assert.ok(js.includes('function openTitleScreen()'));
  assert.ok(js.includes('g=clone(base);g.characterCreated=false'));
  assert.ok(css.includes('body.title-screen-active .title-screen{display:block}'));
  assert.ok(css.includes('@media(max-width:700px)'));
});
