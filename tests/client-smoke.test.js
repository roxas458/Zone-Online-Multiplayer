const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function bootClient() {
  const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid=["']([^"']+)/g)].map(match => match[1]);
  class Element {
    constructor(id) {
      this.id = id; this.innerHTML = ''; this.textContent = ''; this.value = '';
      this.style = {}; this.dataset = {}; this.children = []; this.files = [];
      this.classList = { add(){}, remove(){}, contains(){ return false; }, toggle(){} };
    }
    addEventListener(){} removeEventListener(){} appendChild(child){ this.children.push(child); return child; }
    remove(){} click(){} querySelector(){ return new Element('child'); }
    querySelectorAll(){ return []; } closest(){ return this; } setAttribute(){}
    getAttribute(){ return null; } focus(){} reset(){}
  }
  const elements = new Map(ids.map(id => [id, new Element(id)]));
  const document = {
    getElementById: id => elements.get(id) || null,
    createElement: tag => new Element(tag),
    querySelector: () => new Element('query'),
    querySelectorAll: () => [],
    body: new Element('body'), head: new Element('head'),
    documentElement: new Element('root'), addEventListener(){}
  };
  const data = new Map();
  const localStorage = {
    getItem: key => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key)
  };
  const window = { addEventListener(){}, location:{ origin:'http://localhost', search:'' } };
  const context = {
    document, localStorage, window, console, Blob,
    URL:{ createObjectURL(){ return ''; }, revokeObjectURL(){} },
    FileReader:function(){}, Math, Date, JSON, Number, String, Array, Object,
    Map, Set, RegExp, Promise, Intl, alert(){}, confirm(){ return true; },
    prompt(){ return null; }, setTimeout, clearTimeout, setInterval:()=>0, clearInterval:()=>{},
    crypto:{ randomUUID:()=> '12345678-1234-1234-1234-123456789abc' }
  };
  window.document = document; window.localStorage = localStorage;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'public/js/content.js'),'utf8'), context, {filename:'content.js'});
  vm.runInContext(fs.readFileSync(path.join(root,'public/js/game.js'),'utf8'), context, {filename:'game.js'});
  return { context, elements };
}

test('browser client bootstraps without temporal-dead-zone errors', () => {
  assert.doesNotThrow(() => bootClient());
});

test('all main browser-game views can be opened after bootstrap', () => {
  const { context } = bootClient();
  for (const id of ['world','encyclopedia','people','quests','inventory','armory','trade','factions','living','archive','war','diplomacy','achievements','journal','craft','profile','multiplayer','settings']) {
    assert.doesNotThrow(() => context.view(id), `view ${id}`);
  }
});


test('REAL STALKER LIFE keeps world time tied to the real clock and removes fast-forward controls', () => {
  const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
  const game = fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8');
  assert.match(html, /Реальное время/);
  assert.doesNotMatch(html, /Продвинуть время/);
  assert.doesNotMatch(game, /g\.hour\+\+|g\.hour\s*\+=|function advance\(/);
  assert.match(game, /function realClock\(/);
});

test('encyclopedia view renders and the new navigation target is present', () => {
  const { context, elements } = bootClient();
  assert.doesNotThrow(() => context.view('encyclopedia'));
  assert.match(elements.get('encyclopediaList').innerHTML, /ПМм|Кордон|Плоть/);
});


test('4.8 catalogue and point-of-interest expansion covers every sector', () => {
  const game = fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8');
  const weapons = game.match(/const weaponCatalogue=\[([\s\S]*?)\n\];/);
  assert.ok(weapons);
  assert.equal((weapons[1].match(/\["[a-z0-9_]+"/g) || []).length, 37);
  const poi = game.match(/const extraPoi48=\{([\s\S]*?)\n\};/);
  assert.ok(poi);
  assert.equal((poi[1].match(/^\s*[a-z]+:\[\[/gm) || []).length, 16);
  assert.equal((poi[1].match(/\],\[/g) || []).length >= 32, true);
});
