// NPC AI simulation. Server-authoritative, deterministic inputs are injectable for tests.
const clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n) || 0));
const NPC_FACTIONS = Object.freeze({
  sid:'Одиночки', wolf:'Одиночки', fanatic:'Одиночки', scout:'Одиночки', bandit:'Бандиты',
  barman:'Одиночки', seriy:'Одиночки', scientist:'Учёные', merc:'Наёмники', prof:'Учёные',
  freedom:'Свобода', guide:'Одиночки', loner:'Одиночки', lebedev:'Чистое небо', novikov:'Чистое небо',
  cold:'Чистое небо', lukash:'Свобода', voronin:'Долг', sultan:'Бандиты', beard:'Одиночки',
  charon:'Монолит', wolfhound:'Долг', archivist:'Учёные', kravtsov:'Военные'
});
const ROLES = Object.freeze({ sid:'торговец', wolf:'сталкер', fanatic:'сталкер', scout:'разведчик', bandit:'бандит', barman:'торговец', seriy:'сталкер', scientist:'учёный', merc:'наёмник', prof:'учёный', freedom:'боец', guide:'проводник', loner:'сталкер', lebedev:'командир', novikov:'техник', cold:'боец', lukash:'командир', voronin:'командир', sultan:'главарь', beard:'торговец', charon:'командир', wolfhound:'боец', archivist:'учёный', kravtsov:'военный' });
const ACTIONS = ['patrol','travel','trade','rest','search'];
const { buildDialogue, interactDialogue } = require('./npc-dialogue');
const NPC_DISPLAY = {sid:'Сидорович',wolf:'Волк',fanatic:'Фанатик',scout:'Разведчик',bandit:'Бандит',barman:'Бармен',seriy:'Серый',scientist:'Учёный',merc:'Наёмник',prof:'Профессор Сахаров',freedom:'Свободовец',guide:'Проводник',loner:'Одиночка',lebedev:'Николай Лебедев',novikov:'Новиков',cold:'Холод',lukash:'Лукаш',voronin:'Генерал Воронин',sultan:'Султан',beard:'Борода',charon:'Харон',wolfhound:'Вольфхаунд',archivist:'Архивист',kravtsov:'Командир Кравцов'};
function createNpcRoster(npcHome, now = Date.now()) {
  const roster = {};
  for (const [id, location] of Object.entries(npcHome || {})) {
    roster[id] = { id, name: NPC_DISPLAY[id] || id, faction: NPC_FACTIONS[id] || 'Одиночки', role: ROLES[id] || 'сталкер', location, destination: null, action: 'rest', mood: 'спокоен', health: 100, morale: 60, supplies: 50, alive: true, lastActionAt: now, relationships: {}, inventory: [], history: [], generated:false, dialogueVersion:0, dialogueCycle:Math.floor(now/900000) };
  }
  return roster;
}
function choose(list, random) { return list[Math.floor(random() * list.length)] || null; }
function tickNpcWorld(world, locations, random = Math.random, now = Date.now()) {
  world.npcState ||= createNpcRoster(world.npcPositions || {}, now);
  const events = [];
  const allLocations = [...locations];
  for (const npc of Object.values(world.npcState)) {
    if (!npc.equipment) { const role=npc.role||'сталкер'; npc.equipment={suit:role.includes('учёный')?'Научный комбинезон':role.includes('торговец')?'Куртка торговца':'Комбинезон сталкера',weapon:role.includes('охотник')?'ТОЗ-34':role.includes('разведчик')?'АКС-74У':'ПМ',tool:'Обычный детектор',backpack:'Полевой рюкзак'}; }
    if (!npc.alive) continue;
    const cycle=Math.floor(now/900000); if(npc.dialogueCycle!==cycle){npc.dialogueCycle=cycle;npc.dialogueVersion=(npc.dialogueVersion||0)+1;events.push({type:'npc_dialogue_updated',npcId:npc.id,text:`${npc.name}: появились новые темы и слухи для разговора.`,at:now});}
    npc.dialogue = buildDialogue(npc, {recentWorldEvent:world.zoneEvents?.at(-1)?.title || ''}, now);
    npc.health = clamp(npc.health, 0, 100); npc.morale = clamp(npc.morale, 0, 100); npc.supplies = clamp(npc.supplies, 0, 100);
    if (npc.destination && npc.destination !== npc.location) {
      const from = npc.location; npc.location = npc.destination; npc.destination = null;
      world.npcPositions[npc.id] = npc.location; npc.action = 'travel';
      events.push({ type:'npc_travel', npcId:npc.id, from, location:npc.location, text:`${npc.name} прибыл в сектор ${npc.location}.`, at:now });
    } else {
      npc.action = choose(ACTIONS, random) || 'rest';
      if (npc.action === 'travel' || npc.action === 'patrol') {
        const options = allLocations.filter(x => x !== npc.location);
        if (options.length) { npc.destination = choose(options, random); npc.action = npc.action === 'patrol' ? 'patrol' : 'travel'; }
      } else if (npc.action === 'trade') npc.supplies = clamp(npc.supplies + 8, 0, 100);
      else if (npc.action === 'search') npc.supplies = clamp(npc.supplies + 5, 0, 100);
      else if (npc.action === 'rest') { npc.health = clamp(npc.health + 4, 0, 100); npc.morale = clamp(npc.morale + 2, 0, 100); }
    }
    npc.lastActionAt = now;
    npc.history ||= []; npc.history.push({ action:npc.action, location:npc.location, at:now }); npc.history = npc.history.slice(-12);
  }
  // Simulated skirmishes only occur when hostile faction NPCs share a sector.
  const byLocation = new Map();
  for (const npc of Object.values(world.npcState)) if (npc.alive) { const group = byLocation.get(npc.location) || []; group.push(npc); byLocation.set(npc.location, group); }
  for (const [location, group] of byLocation) {
    const pair = group.find(a => group.some(b => b.id !== a.id && b.faction !== a.faction && b.faction !== 'Учёные' && a.faction !== 'Учёные'));
    if (pair && random() < 0.08) {
      const rival = group.find(b => b.id !== pair.id && b.faction !== pair.faction && b.faction !== 'Учёные' && pair.faction !== 'Учёные');
      if (rival) {
        const damage = 5 + Math.floor(random() * 11); rival.health = clamp(rival.health - damage, 0, 100); pair.morale = clamp(pair.morale + 3, 0, 100);
        if (rival.health === 0) { rival.alive = false; rival.action = 'dead'; rival.deathCause = `перестрелка с отрядом ${pair.faction}`; rival.diedAt = now; for(const friendId of rival.friends||[]){const friend=world.npcState[friendId];if(friend){friend.mood='скорбит';friend.memory ||= [];friend.memory.push({type:'friend_lost',npcId:rival.id,at:now});friend.memory=friend.memory.slice(-20);}} }
        events.push({ type:'npc_skirmish', location, participants:[pair.id,rival.id], text:`Столкновение: ${pair.faction} и ${rival.faction} в секторе ${location}.`, at:now });
      }
    }
  }
  world.npcPositions = Object.fromEntries(Object.values(world.npcState).filter(n => n.alive).map(n => [n.id,n.location]));
  world.npcEvents ||= []; world.npcEvents.push(...events); world.npcEvents = world.npcEvents.slice(-60);
  return events;
}
function interactWithNpc(npc, player, action, now = Date.now(), context = {}) {
  if (!npc || !npc.alive) return { ok:false, reason:'Этот сталкер больше не может ответить.' };
  if (!player || player.location !== npc.location) return { ok:false, reason:'Нужно находиться в одном секторе со сталкером.' };
  if (!['greet','ask','trade','help','topic','message'].includes(action)) return { ok:false, reason:'Неизвестное действие.' };
  npc.relationships ||= {}; const current = Number(npc.relationships[player.id]) || 0;
  const delta = action === 'help' ? 5 : action === 'greet' ? 2 : action === 'trade' ? 1 : action === 'message' ? 1 : 0;
  npc.relationships[player.id] = clamp(current + delta, -100, 100);
  npc.memory ||= []; npc.memory.push({type:'player_interaction',playerId:player.id,action,at:now}); npc.memory=npc.memory.slice(-30);
  const result=interactDialogue(npc,player,action,context,now);
  npc.lastInteractionAt = now;
  return { ok:true, ...result, relationship:npc.relationships[player.id], npcId:npc.id };
}

module.exports = { NPC_FACTIONS, ROLES, createNpcRoster, tickNpcWorld, interactWithNpc };
