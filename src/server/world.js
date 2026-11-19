// Shared world bootstrap helpers.
const { TERRITORY_START } = require('../shared/game-data');
function initSharedWorld(world, NPC_HOME, LOCATIONS, COOP_TEMPLATES) {
  world.npcPositions ||= {};
  world.territoryOwners ||= Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v]) => [id,v.owner]));
  world.territoryControl ||= Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v]) => [id,v.control]));
  world.warOperations ||= [];
  world.warHistory ||= [];
  world.discoveredPoints ||= {};
  world.zoneEvents ||= [];
  for (const [id, loc] of Object.entries(NPC_HOME)) {
    if (!LOCATIONS.has(world.npcPositions[id])) world.npcPositions[id] = loc;
  }
  world.coOpQuests ||= COOP_TEMPLATES.map(q => ({ ...q, participants: [], done: false }));
}

function initDiplomacy(world, FACTIONS) {
  const names = [...FACTIONS];
  const baseline = {
    'Одиночки':15, 'Долг':0, 'Свобода':0, 'Бандиты':-25,
    'Военные':-20, 'Учёные':10, 'Наёмники':-5, 'Монолит':-35, 'Чистое небо':8
  };
  for (const a of names) {
    world.diplomacy[a] ||= {};
    for (const b of names) {
      if (a !== b && !Number.isFinite(world.diplomacy[a][b])) {
        world.diplomacy[a][b] = Math.max(-60, Math.min(60, ((baseline[a] || 0) + (baseline[b] || 0)) / 2));
      }
    }
  }
}

module.exports = { initSharedWorld, initDiplomacy };
