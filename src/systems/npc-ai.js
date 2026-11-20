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

function isHostileFaction(a,b,diplomacy={}) {
  if(!a||!b||a===b||a==='Учёные'||b==='Учёные') return false;
  const enemies={ 'Долг':['Свобода','Бандиты','Монолит'], 'Свобода':['Долг','Бандиты','Монолит'], 'Одиночки':['Бандиты','Монолит'], 'Бандиты':['Одиночки','Долг','Свобода','Военные'], 'Военные':['Бандиты','Монолит'], 'Наёмники':['Монолит'], 'Монолит':['Одиночки','Долг','Свобода','Военные','Наёмники'] };
  if((enemies[a]||[]).includes(b)) return true;
  return Number(diplomacy?.[a]?.[b])<=-25;
}

const NPC_DISPLAY = {sid:'Сидорович',wolf:'Волк',fanatic:'Фанатик',scout:'Разведчик',bandit:'Бандит',barman:'Бармен',seriy:'Серый',scientist:'Учёный',merc:'Наёмник',prof:'Профессор Сахаров',freedom:'Свободовец',guide:'Проводник',loner:'Одиночка',lebedev:'Николай Лебедев',novikov:'Новиков',cold:'Холод',lukash:'Лукаш',voronin:'Генерал Воронин',sultan:'Султан',beard:'Борода',charon:'Харон',wolfhound:'Вольфхаунд',archivist:'Архивист',kravtsov:'Командир Кравцов'};
function createNpcRoster(npcHome, now = Date.now()) {
  const roster = {};
  for (const [id, location] of Object.entries(npcHome || {})) {
    roster[id] = { id, name: NPC_DISPLAY[id] || id, faction: NPC_FACTIONS[id] || 'Одиночки', role: ROLES[id] || 'сталкер', location, destination: null, action: 'rest', mood: 'спокоен', health: 100, morale: 60, supplies: 50, alive: true, lastActionAt: now, relationships: {}, inventory: [], history: [], generated:false, dialogueVersion:0, dialogueCycle:Math.floor(now/900000), lastApproachAt:0 };
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
  // Persistent faction warfare: opposing squads sharing a sector exchange fire.
  const byLocation = new Map();
  for (const npc of Object.values(world.npcState)) if (npc.alive) { const group = byLocation.get(npc.location) || []; group.push(npc); byLocation.set(npc.location, group); }
  world.battlefronts ||= []; world.convoys ||= [];
  const hostility = (a,b) => isHostileFaction(a,b,world.diplomacy);
  for (const [location, group] of byLocation) {
    const sides=[...new Set(group.map(n=>n.faction))].filter(f=>group.some(n=>hostility(f,n.faction)));
    if(sides.length<2 || random()>.42) continue;
    const a=group.find(n=>n.faction===sides[0]), b=group.find(n=>hostility(sides[0],n.faction));
    if(!a||!b) continue;
    const battle=world.battlefronts.find(x=>x.location===location&&x.status==='active');
    const engagement=battle||{id:`battle_${location}_${now}`,location,attacker:a.faction,defender:b.faction,status:'active',startedAt:now,rounds:0,losses:0};
    engagement.rounds++; engagement.lastAt=now;
    const damageA=4+Math.floor(random()*13), damageB=4+Math.floor(random()*13);
    b.health=clamp(b.health-damageA,0,100); a.health=clamp(a.health-damageB,0,100);
    a.action=b.action='combat'; a.mood=b.mood='в бою';
    for(const [victim,killer] of [[a,b],[b,a]]) if(victim.health<=0&&victim.alive){victim.alive=false;victim.action='dead';victim.deathCause=`погиб в бою с группировкой «${killer.faction}»`;victim.diedAt=now;engagement.losses++;}
    if(!battle) world.battlefronts.unshift(engagement);
    const attackAlive=group.filter(n=>n.alive&&n.faction===engagement.attacker).length;
    const defenseAlive=group.filter(n=>n.alive&&n.faction===engagement.defender).length;
    if(engagement.rounds>=4 || attackAlive===0 || defenseAlive===0){
      engagement.status='resolved';engagement.endedAt=now;
      const winner=attackAlive===defenseAlive?(attackAlive>0?(random()<.5?engagement.attacker:engagement.defender):null):(attackAlive>defenseAlive?engagement.attacker:engagement.defender);
      engagement.winner=winner;
      if(winner){world.territoryOwners ||= {};world.territoryControl ||= {};world.territoryOwners[location]=winner;world.territoryControl[location]=55;events.push({type:'territory_captured',location,winner,text:`Группировка «${winner}» установила контроль над сектором ${location} после столкновения.`,at:now});}
    }
    events.push({type:'npc_skirmish',location,participants:[a.id,b.id],attacker:engagement.attacker,defender:engagement.defender,text:`Перестрелка: ${engagement.attacker} и ${engagement.defender} ведут бой в секторе ${location}.`,at:now});
  }
  world.battlefronts=world.battlefronts.slice(0,40);
  // Rare supply convoys travel between connected sectors and can be ambushed.
  if(!world.convoys.length || (now-(world.convoys.at(-1)?.createdAt||0)>12*60*1000 && random()<.35)){
    const routes=[['cordon','dump','bar'],['swamps','yantar','agro'],['jupiter','zaton','pripyat'],['army','red','radar']];
    const route=choose(routes,random); world.convoys.push({id:`convoy_${now}`,faction:choose(['Одиночки','Долг','Свобода','Учёные'],random),route,index:0,location:route[0],strength:3+Math.floor(random()*4),status:'moving',createdAt:now});
    events.push({type:'convoy_started',location:route[0],text:`Караван снабжения отправился из сектора ${route[0]}.`,at:now});
  }
  for(const convoy of world.convoys.filter(x=>x.status==='moving')){
    if(random()<.7){convoy.index++;convoy.location=convoy.route[Math.min(convoy.index,convoy.route.length-1)];if(convoy.index>=convoy.route.length-1)convoy.status='arrived';}
    const enemies=Object.values(world.npcState).filter(n=>n.alive&&n.location===convoy.location&&hostility(convoy.faction,n.faction));
    if(enemies.length&&random()<.25){convoy.status='ambushed';events.push({type:'convoy_ambush',location:convoy.location,text:`Засада на караван ${convoy.faction} в секторе ${convoy.location}!`,at:now});}
  }
  world.convoys=world.convoys.filter(x=>now-x.createdAt<24*60*60*1000).slice(-20);
  world.npcPositions = Object.fromEntries(Object.values(world.npcState).filter(n => n.alive).map(n => [n.id,n.location]));
  world.npcEvents ||= []; world.npcEvents.push(...events); world.npcEvents = world.npcEvents.slice(-60);
  return events;
}
function interactWithNpc(npc, player, action, now = Date.now(), context = {}) {
  if (!npc || !npc.alive) return { ok:false, reason:'Этот сталкер больше не может ответить.' };
  if (!player || player.location !== npc.location) return { ok:false, reason:'Нужно находиться в одном секторе со сталкером.' };
  if (!['greet','ask','trade','help','topic'].includes(action)) return { ok:false, reason:'Неизвестное действие.' };
  npc.relationships ||= {}; const current = Number(npc.relationships[player.id]) || 0;
  const delta = action === 'help' ? 5 : action === 'greet' ? 2 : action === 'trade' ? 1 : 0;
  npc.relationships[player.id] = clamp(current + delta, -100, 100);
  npc.memory ||= []; npc.memory.push({type:'player_interaction',playerId:player.id,action,at:now}); npc.memory=npc.memory.slice(-30);
  const result=interactDialogue(npc,player,action,context,now);
  npc.lastInteractionAt = now;
  return { ok:true, ...result, relationship:npc.relationships[player.id], npcId:npc.id };
}

module.exports = { NPC_FACTIONS, ROLES, createNpcRoster, tickNpcWorld, interactWithNpc, isHostileFaction };
