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
  assert.equal(world.territoryOwners.dump, 'Бандиты');
  assert.equal(world.warOperations.length, 0);
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

const { createOperation, deploymentPower, addDeployment, resolveOperation, WAR_CONFIG } = require('../src/systems/war');

test('WAR SYSTEM creates operations, validates deployments and resolves territory capture', () => {
  const op = createOperation({ id: 'op-1', location: 'dump', attacker: 'Одиночки', defender: 'Бандиты', createdBy: 'p1', territoryControl: 40, now: 100 });
  assert.equal(op.status, 'active');
  assert.equal(op.defenseScore, 40);
  const power = deploymentPower({ xp: 500, rep: 20, action: 'attack' });
  assert.equal(addDeployment(op, { id: 'p1', name: 'Север', faction: 'Одиночки' }, 'attack', power, 110).ok, true);
  assert.equal(addDeployment(op, { id: 'p1', name: 'Север', faction: 'Одиночки' }, 'attack', power, 120).ok, false);
  assert.equal(addDeployment(op, { id: 'p2', name: 'Клык', faction: 'Одиночки' }, 'attack', 80, 130).ok, true);
  const result = resolveOperation(op);
  assert.equal(result.ok, true);
  assert.equal(result.winner, 'Одиночки');
  assert.equal(result.captured, true);
  assert.equal(op.status, 'resolved');
  assert.equal(WAR_CONFIG.operationCost, 350);
});

test('WAR SYSTEM rejects premature resolution and unauthorized side deployments', () => {
  const op = createOperation({ id: 'op-2', location: 'bar', attacker: 'Свобода', defender: 'Долг', createdBy: 'p1' });
  assert.equal(resolveOperation(op).ok, false);
  assert.equal(addDeployment(op, { id: 'p2', name: 'Игрок', faction: 'Бандиты' }, 'defend', 20).ok, false);
});


const { createNpcRoster, tickNpcWorld, interactWithNpc } = require('../src/systems/npc-ai');
test('NPC AI bootstraps independent NPC profiles with roles and factions', () => {
  const roster = createNpcRoster(NPC_HOME, 100);
  assert.equal(roster.sid.faction, 'Одиночки');
  assert.equal(roster.voronin.role, 'командир');
  assert.equal(roster.lebedev.location, 'swamps');
  assert.equal(roster.sid.alive, true);
});
test('NPC AI advances schedules, records history and publishes shared positions', () => {
  const world = { npcPositions: { alpha:'cordon', beta:'dump' } };
  world.npcState = createNpcRoster({ alpha:'cordon', beta:'dump' }, 100);
  const events = tickNpcWorld(world, new Set(['cordon','dump','bar']), () => 0, 200);
  assert.equal(world.npcState.alpha.lastActionAt, 200);
  assert.ok(world.npcState.alpha.history.length >= 1);
  assert.ok(world.npcPositions.alpha);
  assert.ok(Array.isArray(world.npcEvents));
  assert.ok(Array.isArray(events));
});
test('NPC interaction requires same location and builds personal trust', () => {
  const npc = createNpcRoster({ sid:'cordon' }, 100).sid;
  assert.equal(interactWithNpc(npc,{id:'p1',location:'dump'},'greet').ok,false);
  const result = interactWithNpc(npc,{id:'p1',location:'cordon'},'help',200);
  assert.equal(result.ok,true);
  assert.equal(result.relationship,5);
  assert.match(result.reply,/помощь/);
});
