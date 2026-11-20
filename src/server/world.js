// Shared world bootstrap helpers.
const { TERRITORY_START } = require('../shared/game-data');
const { createNpcRoster } = require('../systems/npc-ai');
const { ensureRandomNpcs } = require('../systems/npc-roster');
const { buildDialogue } = require('../systems/npc-dialogue');
const { initEcosystem } = require('../systems/ecosystem');
function initSharedWorld(world, NPC_HOME, LOCATIONS, COOP_TEMPLATES) {
  world.npcPositions ||= {};
  world.npcState ||= {};
  world.npcEvents ||= [];
  world.territoryOwners ||= Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v]) => [id,v.owner]));
  world.territoryControl ||= Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v]) => [id,v.control]));
  world.warOperations ||= [];
  world.battlefronts ||= []; world.convoys ||= []; world.radiationZones ||= {chaes:90,radar:82,pripyat:65,red:48,yantar:38,swamps:32,darkhollow:28,limansk:30};
  world.warHistory ||= [];
  world.discoveredPoints ||= {};
  world.zoneEvents ||= [];
  for (const [id, loc] of Object.entries(NPC_HOME)) {
    if (!LOCATIONS.has(world.npcPositions[id])) world.npcPositions[id] = loc;
  }
  const defaults = createNpcRoster(NPC_HOME);
  for (const [id, npc] of Object.entries(defaults)) world.npcState[id] ||= npc;
  ensureRandomNpcs(world,340);
  for (const [id, npc] of Object.entries(world.npcState)) { if (!LOCATIONS.has(npc.location)) npc.location = world.npcPositions[id] || NPC_HOME[id] || 'cordon'; if (!npc.generated && NPC_HOME[id] && !npc.missionOrder && npc.location !== NPC_HOME[id]) { npc.location = NPC_HOME[id]; npc.homeLocation = NPC_HOME[id]; npc.baseLocation = NPC_HOME[id]; npc.action = 'camp'; npc.behavior = 'camp'; npc.duty = 'base_guard'; npc.guardPost = true; } npc.alive = npc.alive !== false; npc.dialogueCycle ??= Math.floor(Date.now()/900000); npc.dialogueVersion ??= 0; npc.dialogue = buildDialogue(npc,{},Date.now()); }
  world.npcPositions = Object.fromEntries(Object.values(world.npcState).filter(n => n.alive).map(n => [n.id, n.location]));
  world.coOpQuests ||= COOP_TEMPLATES.map(q => ({ ...q, participants: [], done: false }));
  initEcosystem(world);
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
