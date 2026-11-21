// Persistent social lives for wandering stalkers: biographies, bonds, squads, raids and memorials.
const { ensureRandomNpcs, generatedName } = require('./npc-roster');
const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
const BIOGRAPHY_BITS=[
  'Пришёл в Зону после того, как обычная жизнь стала казаться слишком тесной.',
  'Когда-то работал на железной дороге и до сих пор узнаёт старые пути по звуку.',
  'Потерял напарника на первой же вылазке и с тех пор не любит ходить один.',
  'Уверяет, что попал сюда случайно, хотя знает слишком много старых маршрутов.',
  'Начинал с охоты за артефактами, но теперь больше ценит надёжных людей и горячий чай.',
  'Считает, что в Зоне главное — не меткая стрельба, а умение вовремя промолчать.'
];
const QUIRKS=['собирает пустые гильзы','боится заводных игрушек','всегда носит лишнюю ложку','пишет заметки на пачках патронов','разговаривает с детектором','мечтает открыть столовую у костра','никогда не садится спиной к двери'];
function pick(list,random){return list[Math.floor(random()*list.length)]||list[0];}
function initSouls(world,random=Math.random){
  ensureRandomNpcs(world,60);
  const npcs=Object.values(world.npcState||{}).filter(n=>n.generated);
  for(const npc of npcs){
    npc.biography ||= `${npc.name} ${pick(BIOGRAPHY_BITS,random)} Его странная привычка: ${pick(QUIRKS,random)}.`;
    npc.friends ||= []; npc.rivals ||= []; npc.squadId ||= null;
    npc.memory ||= []; npc.replacementDueAt ||= null;
  }
  world.npcSquads ||= [];
  world.npcMemorial ||= [];
  // Seed a few social links once; links are persisted with the world state.
  const linked=new Set();
  for(const npc of npcs){
    if(npc.friends.length||npc.rivals.length)continue;
    const candidates=npcs.filter(other=>other.id!==npc.id&&other.faction===npc.faction&&other.alive);
    if(candidates.length){const friend=candidates[Math.floor(random()*candidates.length)];const key=[npc.id,friend.id].sort().join(':');if(!linked.has(key)){linked.add(key);npc.friends.push(friend.id);friend.friends ||= [];if(!friend.friends.includes(npc.id))friend.friends.push(npc.id);}}
  }
  // Seed rivalries too, so not every stranger in the Zone gets along.
  for(const npc of npcs){
    if(npc.rivals.length)continue;
    const rivals=npcs.filter(other=>other.id!==npc.id&&other.faction!==npc.faction&&other.alive);
    if(rivals.length&&random()<0.42){const rival=rivals[Math.floor(random()*rivals.length)];npc.rivals.push(rival.id);rival.rivals ||= [];if(!rival.rivals.includes(npc.id))rival.rivals.push(npc.id);}
  }
  if(!world.npcSquads.length){
    const byFaction={};
    for(const npc of npcs.filter(n=>n.alive)){(byFaction[npc.faction] ||= []).push(npc);}
    for(const [faction,members] of Object.entries(byFaction)){
      for(let i=0;i+1<members.length;i+=3){const group=members.slice(i,i+3);if(group.length<2)continue;const id=`squad_${factionSlug(faction)}_${world.npcSquads.length+1}`;const squad={id,name:`${pick(['Кривой маршрут','Последний болт','Тихая смена','Северный чай'],random)} · ${group[0].name}`,faction,leaderId:group[0].id,members:group.map(n=>n.id),location:group[0].location,status:'camped',createdAt:Date.now(),lastRaidAt:0};world.npcSquads.push(squad);for(const n of group)n.squadId=id;}
    }
  }
  return world;
}
function factionSlug(s){return String(s).toLowerCase().replace(/[^а-яa-z0-9]+/gi,'_').slice(0,18);}
function tickSouls(world,locations,random=Math.random,now=Date.now()){
  initSouls(world,random);
  const events=[];const npcs=world.npcState||{};
  for(const npc of Object.values(npcs)){
    if(!npc.generated)continue;
    if(npc.alive===false&&!npc.memorialized&&!npc.replacementDueAt)npc.replacementDueAt=now+3*60*1000;
    if(npc.alive===false&&!npc.memorialized&&npc.replacementDueAt&&now>=npc.replacementDueAt){
      const memorial={id:`mem_${npc.id}_${now}`,name:npc.name,faction:npc.faction,role:npc.role,location:npc.location,biography:npc.biography,cause:npc.deathCause||'погиб во время вылазки',diedAt:npc.diedAt||now};
      world.npcMemorial.unshift(memorial);world.npcMemorial=world.npcMemorial.slice(0,100);
      const nextId=`wanderer_${String(Object.keys(npcs).filter(id=>id.startsWith('wanderer_')).length+1).padStart(3,'0')}`;
      const used=new Set(Object.values(npcs).map(n=>n.name));
      const replacement=makeReplacement(nextId,locations,random,now,used);
      npcs[nextId]=replacement;world.npcPositions[nextId]=replacement.location;
      npc.replacementDueAt=null; npc.memorialized=true; // dead profile remains for relationship/history references
      events.push({type:'npc_replacement',npcId:nextId,memorialId:memorial.id,text:`На место погибшего ${npc.name} в Зону пришёл новый сталкер — ${replacement.name}.`,at:now});
    }
  }
  for(const squad of world.npcSquads||[]){
    const living=squad.members.map(id=>npcs[id]).filter(n=>n&&n.alive);
    squad.members=living.map(n=>n.id);
    if(!living.length){squad.status='disbanded';continue;}
    if(random()<0.12){
      const from=squad.location;const destinations=[...locations].filter(x=>x!==from);if(destinations.length){squad.location=destinations[Math.floor(random()*destinations.length)];squad.status='on_raid';squad.lastRaidAt=now;for(const n of living){n.location=squad.location;n.action='raid';n.history ||= [];n.history.push({action:'raid',location:squad.location,at:now});n.history=n.history.slice(-20);world.npcPositions[n.id]=n.location;}events.push({type:'npc_squad_raid',squadId:squad.id,location:squad.location,text:`Отряд «${squad.name}» отправился в рейд и замечен в секторе ${squad.location}.`,at:now});}
    }else if(squad.status==='on_raid'&&now-(squad.lastRaidAt||0)>8*60*1000){squad.status='camped';}
  }
  for(const ev of events){world.npcEvents ||= [];world.npcEvents.push(ev);}world.npcEvents=(world.npcEvents||[]).slice(-100);
  return events;
}
function makeReplacement(id,locations,random,now,used){
  const name=generatedName(id,used);
  const factions=['Одиночки','Долг','Свобода','Бандиты','Наёмники','Чистое небо'];
  const roles=['сталкер','разведчик','механик','проводник','охотник'];
  const locs=[...locations];const location=pick(locs,random)||'cordon';
  return {id,name,faction:pick(factions,random),role:pick(roles,random),location,destination:null,action:'rest',mood:'насторожен',health:100,morale:60,supplies:55,alive:true,lastActionAt:now,relationships:{},inventory:[],history:[],generated:true,icon:'◉',personality:'новичок',dialogueDay:-1,dialogueVersion:0,dialogueHistory:[],biography:`${name} недавно пришёл в Зону. Пока о нём известно немного; ${pick(BIOGRAPHY_BITS,random)}`,friends:[],rivals:[],squadId:null,memory:[],replacementDueAt:null};
}
module.exports={initSouls,tickSouls};
