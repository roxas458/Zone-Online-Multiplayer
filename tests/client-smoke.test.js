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
  vm.runInContext(fs.readFileSync(path.join(root,'public/js/stories.js'),'utf8'), context, {filename:'stories.js'});
  vm.runInContext(fs.readFileSync(path.join(root,'public/js/game.js'),'utf8'), context, {filename:'game.js'});
  return { context, elements };
}

test('browser client bootstraps without temporal-dead-zone errors', () => {
  assert.doesNotThrow(() => bootClient());
});

test('all main browser-game views can be opened after bootstrap', () => {
  const { context } = bootClient();
  for (const id of ['world','encyclopedia','stories','people','quests','inventory','armory','trade','factions','living','archive','war','diplomacy','achievements','journal','craft','profile','multiplayer','settings']) {
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


test('4.9 tactical map and mobile PDA navigation are present', () => {
  const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'public/css/game.css'), 'utf8');
  const game = fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8');
  assert.match(html, /mobile-dock/);
  assert.match(html, /map-toolbar/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(game, /function mapZoom\(/);
  assert.match(game, /function renderZoneMap\(/);
});

test('4.9 personal NPC stories persist progress and reward completion', () => {
  const { context } = bootClient();
  const state = {npcs:[{id:'sid',name:'Сидорович'}],loc:'cordon',money:100,rep:0,xp:0,relationships:{}};
  const started = context.window.ZoneStories.choose(state, 'sid_cache');
  assert.equal(started.ok, true);
  assert.equal(state.storyProgress.sid_cache, 1);
  state.loc = 'dump';
  const finished = context.window.ZoneStories.choose(state, 'sid_cache');
  assert.equal(finished.ok, true);
  assert.equal(state.storyProgress.sid_cache, 2);
  assert.equal(state.money, 280);
});


test('4.9 map renders terrain, routes and current-sector points of interest', () => {
  const { elements } = bootClient();
  const svg = elements.get('zoneMap').innerHTML;
  assert.match(svg, /map-water/);
  assert.match(svg, /map-road/);
  assert.match(svg, /map-sector/);
  assert.match(elements.get('mapCoordinates').textContent, /СЕКТОР/);
});


test('4.10 inventory and trader redesign expose expanded artifacts and armor', () => {
  const { context, elements } = bootClient();
  assert.doesNotThrow(() => context.view('inventory'));
  assert.match(elements.get('items').innerHTML, /Аптечка|Бинт/);
  assert.doesNotThrow(() => context.view('trade'));
  assert.match(elements.get('shop').innerHTML, /Медуза/);
  assert.match(elements.get('shop').innerHTML, /Экзоскелет/);
  assert.match(elements.get('sellList').innerHTML, /Продать 1/);
  assert.doesNotThrow(() => context.setTradeCategory('gear'));
  assert.match(elements.get('shop').innerHTML, /Каменный цветок/);
  assert.doesNotMatch(elements.get('shop').innerHTML, /Аптечка/);
});

test('4.10 market catalogue is shared with the online server and supports armor stats', () => {
  const shared = fs.readFileSync(path.join(root,'src/shared/game-data.js'),'utf8');
  const server = fs.readFileSync(path.join(root,'server.js'),'utf8');
  assert.match(shared, /artifact_goldfish/);
  assert.match(shared, /armor_exo/);
  assert.match(shared, /defense:11/);
  assert.match(server, /market:sell/);
  assert.match(server, /input\?\.qty/);
});


test('4.10 armor can be bought, equipped and sold from the inventory flow', () => {
  const { context, elements } = bootClient();
  const goods = context.tradeGoods();
  const armorIndex = goods.findIndex(item => item[1] === 'armor_leather');
  assert.ok(armorIndex >= 0);
  context.buy(armorIndex);
  context.view('inventory');
  assert.match(elements.get('items').innerHTML, /Кожаная куртка с пластинами/);
  context.equipItem('armor_leather');
  assert.match(elements.get('equipment').innerHTML, /Кожаная куртка с пластинами/);
  assert.match(elements.get('gearStats').innerHTML, /Защита костюма/);
});

test('4.10 home screen atmosphere reports changing local light and weather state', () => {
  const { context, elements } = bootClient();
  assert.doesNotThrow(() => context.renderAtmosphere());
  assert.ok(['clear','fog','rain','overcast','emission'].includes(elements.get('homeHero').dataset.weather));
  assert.match(elements.get('atmosphereInfo').innerHTML, /ЯСНО|ТУМАН|ДОЖДЬ|ПАСМУРНО|РАДИАЦИОННЫЙ ФОН/);
  assert.match(elements.get('atmosphereInfo').innerHTML, /НОЧЬ|РАССВЕТ|ДЕНЬ|СУМЕРКИ/);
});


test('4.11 player dossier renders portrait and expanded expedition statistics', () => {
  const { context, elements } = bootClient();
  assert.doesNotThrow(() => context.view('profile'));
  assert.match(elements.get('playerPortrait').innerHTML, /stalker-\d{2}\.webp/);
  assert.match(elements.get('profileCareerStats').innerHTML, /Победы в столкновениях/);
  assert.match(elements.get('profileRecord').innerHTML, /Позывной/);
});

test('4.11 NPC portraits and same-location personal messages work and persist', () => {
  const { context, elements } = bootClient();
  context.openNpcDM('sid');
  assert.match(elements.get('npcDmPanel').innerHTML, /ПРЯМОЙ КАНАЛ/);
  elements.set('npcDmInput', new (elements.get('npcDmPanel').constructor)('npcDmInput'));
  elements.get('npcDmInput').value = 'Привет, есть новости?';
  context.sendNpcMessage({ preventDefault(){} }, 'sid');
  assert.match(elements.get('npcDmPanel').innerHTML, /Привет, есть новости/);
  assert.match(elements.get('npcDmPanel').innerHTML, /Слышал|Здорово|Понял/);
});

test('4.11 main menu and accessibility settings are functional', () => {
  const { context, elements } = bootClient();
  context.openMainMenu();
  assert.ok(elements.get('mainMenuOverlay').classList);
  context.setGameOption('largeText', true);
  assert.equal(elements.get('settingLargeText').checked, true);
  assert.equal(elements.get('menuLargeText').checked, true);
  context.menuGo('people');
});


test('4.11 generated portrait sheet is split into sixteen optimized local character assets', () => {
  const assets = path.join(root, 'public/assets/portraits');
  const portraits = fs.readdirSync(assets).filter(name => /^stalker-\d{2}\.webp$/.test(name));
  assert.equal(portraits.length, 16);
  assert.ok(portraits.every(name => fs.statSync(path.join(assets, name)).size > 1000));
});
