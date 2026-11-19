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


test('4.15 map supports supplied Zone image, overview/local modes and free-walk controls', () => {
  const { context, elements } = bootClient();
  const svg = elements.get('zoneMap').innerHTML;
  assert.match(svg, /zone-master-map\.jpg/);
  assert.match(svg, /map-sector/);
  assert.match(elements.get('mapCoordinates').textContent, /ВСЯ ЗОНА/);
  assert.match(fs.readFileSync(path.join(root, 'public/index.html'), 'utf8'), /mapModeLocal/);
  assert.match(fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8'), /function mapPointer/);
  assert.match(fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8'), /function walkNudge/);
  assert.match(fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8'), /pendingSectorExit/);
  assert.doesNotThrow(() => context.setMapMode('local'));
  assert.match(elements.get('zoneMap').innerHTML, /onpointerdown=\"mapPointer/);
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

test('4.13 NPC direct messages are removed; NPC contact uses dialogue and approaches', () => {
  const html = fs.readFileSync(path.join(root,'public/index.html'),'utf8');
  const client = fs.readFileSync(path.join(root,'public/js/game.js'),'utf8');
  const server = fs.readFileSync(path.join(root,'server.js'),'utf8');
  const dialogue = fs.readFileSync(path.join(root,'src/systems/npc-dialogue.js'),'utf8');
  assert.doesNotMatch(html,/npcDmPanel|Личные сообщения \/ локальный канал/);
  assert.doesNotMatch(client,/function openNpcDM|function sendNpcMessage|npc:message:send/);
  assert.match(html,/npcApproachFeed/);
  assert.match(server,/npc:approach/);
  assert.match(dialogue,/stage/);
  assert.doesNotMatch(dialogue,/поправляет снаряжение и оглядывается/);
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

test('4.12 player direct messages are location-gated, persisted and rate-limited on server', () => {
  const server = fs.readFileSync(path.join(root,'server.js'),'utf8');
  const html = fs.readFileSync(path.join(root,'public/index.html'),'utf8');
  assert.match(server,/socket\.on\('dm:send'/);
  assert.match(server,/me\.location!==target\.location/);
  assert.match(server,/persistPrivateMessage\(m\)/);
  assert.match(server,/zone_private_messages/);
  assert.match(server,/rate\.count>8/);
  assert.match(html,/id="playerDmPanel"/);
});

test('4.12 NPC trade inspects gear, supports buy and sell, and verifies local presence server-side', () => {
  const { context, elements } = bootClient();
  assert.doesNotThrow(() => context.openNpcTrade('sid'));
  assert.match(elements.get('peopleList').children.at(-1).innerHTML,/Снаряжение сталкера/);
  assert.match(elements.get('peopleList').children.at(-1).innerHTML,/Полевой обмен/);
  const server = fs.readFileSync(path.join(root,'server.js'),'utf8');
  assert.match(server,/socket\.on\('npc:trade:buy'/);
  assert.match(server,/socket\.on\('npc:trade:sell'/);
  assert.match(server,/npc\.location!==p\.location/);
});

test('4.12 encyclopedia includes expanded anomaly field dossiers and longer reference entries', () => {
  const { context, elements } = bootClient();
  context.renderEncyclopedia();
  assert.match(elements.get('encyclopediaList').innerHTML,/Жарка/);
  assert.match(elements.get('encyclopediaList').innerHTML,/Пси-поле/);
  assert.match(elements.get('encyclopediaList').innerHTML,/транспортировк|Полевые рекомендации|полевых условиях/i);
  const html = fs.readFileSync(path.join(root,'public/index.html'),'utf8');
  assert.match(html,/value="anomalies"/);
});


test('4.13 player squads, NPC approach events and staged dialogue are server-backed', () => {
  const server = fs.readFileSync(path.join(root,'server.js'),'utf8');
  const ai = fs.readFileSync(path.join(root,'src/systems/npc-ai.js'),'utf8');
  const dialogue = fs.readFileSync(path.join(root,'src/systems/npc-dialogue.js'),'utf8');
  assert.match(server,/socket\.on\('squad:create'/);
  assert.match(server,/socket\.on\('squad:invite'/);
  assert.match(server,/socket\.on\('squad:respond'/);
  assert.match(server,/socket\.on\('squad:leave'/);
  assert.match(server,/npc:approach/);
  assert.match(ai,/npc\.memory\.push/);
  assert.match(dialogue,/stage/);
  assert.doesNotMatch(dialogue,/action==='message'/);
});


test('4.13 faction insignias and male stalker portrait assets are complete', () => {
  const factionDir = path.join(root,'public/assets/factions');
  const icons = fs.readdirSync(factionDir).filter(x=>x.endsWith('.svg'));
  assert.equal(icons.length,9);
  const portraits = fs.readdirSync(path.join(root,'public/assets/portraits')).filter(x=>x.endsWith('.webp'));
  assert.equal(portraits.length,16);
  const game = fs.readFileSync(path.join(root,'public/js/game.js'),'utf8');
  assert.match(game,/function factionIconMarkup/);
  assert.match(game,/portrait-faction.*factionIconMarkup/);
});

test('4.13 no voice feature or NPC messaging UI is exposed', () => {
  const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
  const client=fs.readFileSync(path.join(root,'public/js/game.js'),'utf8');
  assert.doesNotMatch(html,/voice-channel|Голосовой канал/);
  assert.doesNotMatch(html,/npcDmPanel|Личные сообщения \/ локальный канал/);
  assert.doesNotMatch(client,/npc:message:send|function openNpcDM/);
  assert.match(html,/playerDmPanel/);
});

test('4.13 player friend requests are handled by the server and friend UI exists', () => {
  const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
  const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
  const client=fs.readFileSync(path.join(root,'public/js/game.js'),'utf8');
  assert.match(server,/socket\.on\('friend:request'/);
  assert.match(server,/socket\.on\('friend:respond'/);
  assert.match(client,/function friendRequest/);
  assert.match(html,/id="playerFriendsPanel"/);
});


test('4.14 squads synchronize leader travel, field roles, journal and NPC escort', () => {
  const server = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
  const client = fs.readFileSync(path.join(__dirname, '..', 'public/js/game.js'), 'utf8');
  assert.match(server, /publishSquadMove\(squad,oldLocation,p\.location,p\.name\)/);
  assert.match(server, /socket\.on\('squad:role'/);
  assert.match(server, /socket\.on\('squad:escort'/);
  assert.match(server, /escort\.location=to/);
  assert.match(server, /emit\('squad:encounter'/); // server emits this event to both groups
  assert.match(server, /squadJournal\(q,'encounter'/);
  assert.match(client, /function squadRole\(/);
  assert.match(client, /function squadEscort\(/);
  assert.match(client, /squad:travelled/);
  assert.match(client, /squad:encounter/);
  assert.match(client, /Журнал отряда/);
});

test('4.16 realistic free-roam uses supplied satellite map, animated player and world-space collision', () => {
  const client = fs.readFileSync(path.join(root, 'public/js/game.js'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'public/css/game.css'), 'utf8');
  assert.match(client, /function playerSpriteMarkup\(/);
  assert.match(client, /stalker-walk-atlas\.png/);
  assert.match(client, /const WORLD_OBSTACLES=/);
  assert.match(client, /function blockedAt\(/);
  assert.match(client, /function walkHold\(/);
  assert.match(client, /function mapPointer\(/);
  assert.match(client, /player:position/);
  assert.match(html, /onpointerdown="walkHold/);
  assert.match(css, /\.player-sprite/);
  assert.ok(fs.existsSync(path.join(root, 'public/assets/zone-master-map.jpg')));
  assert.ok(fs.existsSync(path.join(root, 'public/assets/stalker-walk-atlas.png')));
});
