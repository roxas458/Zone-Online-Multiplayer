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
    prompt(){ return null; }, setTimeout, clearTimeout, setInterval, clearInterval,
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
  for (const id of ['world','people','quests','inventory','armory','trade','factions','living','archive','war','diplomacy','achievements','journal','craft','profile','multiplayer','settings']) {
    assert.doesNotThrow(() => context.view(id), `view ${id}`);
  }
});
