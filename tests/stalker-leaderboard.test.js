const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const game = fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const npcAI = fs.readFileSync(path.join(root, 'src/systems/npc-ai.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'public/css/game.css'), 'utf8');

test('4.33.12 PDA Top 20 view is linked from navigation and includes both dossier panes', () => {
  assert.match(html, /data-v="ranks"/);
  assert.match(html, /id="ranks"/);
  assert.match(html, /id="stalkerLeaderboard"/);
  assert.match(html, /id="rankDetail"/);
  assert.match(css, /\.pda-rank-shell/);
});

test('leaderboard is exposed through HTTP and synchronized to Socket.IO clients', () => {
  assert.match(server, /app\.get\('\/api\/leaderboard'/);
  assert.match(server, /world:leaderboard/);
  assert.match(server, /function buildStalkerLeaderboard\(\)/);
});

test('player and NPC victories update leaderboard kill statistics', () => {
  assert.match(server, /recordStalkerKill\(p,npc\)/);
  assert.match(npcAI, /killer\.combatKills=\(Number\(killer\.combatKills\)\|\|0\)\+1/);
});

test('client renders server leaderboard and has a local fallback', () => {
  assert.match(game, /function localLeaderboardFallback\(\)/);
  assert.match(game, /function renderStalkerLeaderboard\(\)/);
  assert.match(game, /world:leaderboard/);
});
