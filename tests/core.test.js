const test = require('node:test');
const assert = require('node:assert/strict');
const { LOCATIONS, FACTIONS, NPC_HOME, COOP_TEMPLATES, TRADE_ITEM_IDS, SHOP } = require('../src/shared/game-data');
const { clean, validId, createSafeState } = require('../src/server/validation');
const { initSharedWorld, initDiplomacy } = require('../src/server/world');

test('input helpers sanitize text and validate player IDs', () => {
  assert.equal(clean('< stalker >\n', 20), 'stalker');
  assert.equal(validId('12345678-1234-1234'), true);
  assert.equal(validId('bad id'), false);
});

test('safeState clamps values and validates faction/location', () => {
  const safeState = createSafeState(FACTIONS, LOCATIONS);
  const result = safeState({ name: 'Tester', faction: 'Unknown', loc: 'unknown', hp: 999, money: -5 });
  assert.equal(result.faction, 'Одиночки');
  assert.equal(result.loc, 'cordon');
  assert.equal(result.hp, 100);
  assert.equal(result.money, 0);
});

test('world bootstrap creates NPC positions, quests and diplomacy', () => {
  const world = { diplomacy: {}, revision: 1 };
  initSharedWorld(world, NPC_HOME, LOCATIONS, COOP_TEMPLATES);
  initDiplomacy(world, FACTIONS);
  assert.ok(Object.keys(world.npcPositions).length >= Object.keys(NPC_HOME).length);
  assert.equal(world.coOpQuests.length, COOP_TEMPLATES.length);
  assert.ok(world.diplomacy['Одиночки']['Долг'] !== undefined);
});

test('expanded world includes Great Swamps and server-side food items', () => {
  assert.equal(LOCATIONS.has('swamps'), true);
  assert.equal(NPC_HOME.lebedev, 'swamps');
  for (const id of ['canned','sausage','condensed','water','tea','ration']) {
    assert.equal(TRADE_ITEM_IDS.has(id), true);
    assert.ok(SHOP[id]);
  }
});

const { changeRelationship, relationshipLabel } = require('../src/systems/relationships');
const { rankForXp } = require('../src/systems/ranks');
const { addInfluence, resolveControl } = require('../src/systems/territories');
const { canComplete } = require('../src/systems/contracts');

test('Living Zone relationship and rank systems have bounded progression', () => {
  assert.equal(changeRelationship(98, 10), 100);
  assert.equal(relationshipLabel(-50), 'Враждебность');
  assert.equal(rankForXp(500).name, 'Старший боец');
});

test('territory influence transfers control only at full influence', () => {
  assert.equal(addInfluence(85, 25), 100);
  assert.deepEqual(resolveControl('Бандиты', 'Одиночки', 100), { owner: 'Одиночки', control: 55 });
});

test('contract requires acceptance, location and required items', () => {
  const c = { accepted: true, done: false, location: 'cordon', item: 'scrap', qty: 2 };
  assert.equal(canComplete(c, { location: 'cordon', items: [{ id: 'scrap', qty: 2 }] }), true);
  assert.equal(canComplete(c, { location: 'dump', items: [{ id: 'scrap', qty: 2 }] }), false);
});
