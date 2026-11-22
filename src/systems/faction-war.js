'use strict';

const { TERRITORY_ADJACENCY, FACTION_HOME } = require('./territories');
const { FACTIONS, TERRITORY_START } = require('../shared/game-data');

const FACTION_OBJECTIVES = Object.freeze({
  'Одиночки': { title: 'Свободные маршруты', description: 'Сохранять безопасные стоянки и открытые переходы для независимых сталкеров.', priorities: ['checkpoint','supply','trade','base'], posture: 'defensive' },
  'Долг': { title: 'Защита периметра', description: 'Укреплять блокпосты, удерживать опасные участки и ограничивать распространение угроз.', priorities: ['checkpoint','base','industry','supply'], posture: 'defensive' },
  'Свобода': { title: 'Свободная Зона', description: 'Расширять сеть наблюдательных пунктов и сохранять доступ к исследовательским районам.', priorities: ['relay','research','anomaly','checkpoint'], posture: 'expansionist' },
  'Бандиты': { title: 'Контроль путей и торговли', description: 'Получать доход от складов, торговых точек и важных транспортных переходов.', priorities: ['trade','supply','industry','checkpoint'], posture: 'opportunistic' },
  'Военные': { title: 'Периметр и блокпосты', description: 'Удерживать контрольные пункты и стратегические подходы к закрытым районам.', priorities: ['checkpoint','relay','base','industry'], posture: 'defensive' },
  'Учёные': { title: 'Исследование Зоны', description: 'Обеспечивать доступ к лабораториям, исследовательским станциям и аномальным полям.', priorities: ['research','anomaly','relay','supply'], posture: 'research' },
  'Наёмники': { title: 'Контрактные позиции', description: 'Закрепляться на объектах, которые обеспечивают ресурсы и выгодные контракты.', priorities: ['industry','supply','research','trade'], posture: 'contract' },
  'Монолит': { title: 'Северный рубеж', description: 'Удерживать северные позиции, ретрансляторы и подходы к закрытым территориям.', priorities: ['relay','base','checkpoint','research'], posture: 'expansionist' },
  'Чистое небо': { title: 'Изучение болот и аномалий', description: 'Сохранять исследовательские лагеря и контролировать аномальные районы.', priorities: ['anomaly','research','supply','relay'], posture: 'research' },
  'Ренегаты': { title: 'Территории на окраинах', description: 'Удерживать удалённые стоянки, склады и обходные маршруты.', priorities: ['supply','trade','checkpoint','base'], posture: 'opportunistic' }
});

const POINT_DEFS = Object.freeze({
  chaes: [['Северный периметр','checkpoint',1],['Ретранслятор «Монолит»','relay',2],['Станция наблюдения','base',1]],
  zaton: [['Скадовск','base',3],['Портовые склады','trade',3],['Аномальное плато','anomaly',2]],
  pripyat: [['Центральная площадь','checkpoint',2],['Подземный переход','supply',2],['Городская лаборатория','research',3]],
  jupiter: [['Завод «Юпитер»','industry',3],['Станция обслуживания','supply',2],['Исследовательский пост','research',3]],
  limansk: [['Старый блокпост','checkpoint',2],['Городской ретранслятор','relay',2],['Полевой склад','supply',2]],
  red: [['Рыжий лес · кордон','checkpoint',2],['Лесная станция','base',2],['Аномальный овраг','anomaly',3]],
  radar: [['Радарный комплекс','relay',3],['Северный лагерь','base',2],['Технический узел','industry',2]],
  army: [['Армейские склады','supply',3],['Старая казарма','base',2],['Контрольный пост','checkpoint',2]],
  wild: [['Дикий блокпост','checkpoint',2],['Заброшенный цех','industry',2],['Полевой лагерь','base',1]],
  bar: [['Бар «100 Рентген»','trade',3],['База Долга','base',3],['Северный КПП','checkpoint',2]],
  yantar: [['Научный бункер','research',3],['Озёрная станция','research',2],['Аномальный берег','anomaly',2]],
  dump: [['Ангар','base',3],['Кладбище техники','industry',3],['Торговая стоянка','trade',2]],
  agro: [['Военный блокпост','checkpoint',3],['Агропром · склады','supply',2],['Административный корпус','base',2]],
  dark: [['Тёмная долина · завод','industry',3],['Старая ферма','base',2],['Подземный склад','supply',2]],
  cordon: [['Деревня новичков','base',3],['Южный блокпост','checkpoint',3],['Склад у дороги','supply',2]],
  swamps: [['Затопленная ферма','base',2],['Научный лагерь','research',2],['Болотная аномалия','anomaly',3]],
  darkhollow: [['Заброшенный форпост','base',2],['Скрытый склад','supply',2],['Старая торговая точка','trade',1]]
});

const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
const slug=s=>String(s).toLowerCase().replace(/[^a-zа-я0-9]+/gi,'_');

function routeBetween(from,to,maxHops=5){
  if(from===to)return [from];
  const queue=[[from,[from]]],seen=new Set([from]);
  while(queue.length){const [at,path]=queue.shift();if(path.length>maxHops)continue;for(const next of TERRITORY_ADJACENCY[at]||[]){if(seen.has(next))continue;const nextPath=[...path,next];if(next===to)return nextPath;seen.add(next);queue.push([next,nextPath]);}}
  return null;
}

function initFactionWar(world, now=Date.now()){
  world.territoryOwners ||= Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v])=>[id,v.owner]));
  world.territoryControl ||= Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v])=>[id,v.control]));
  world.keyPoints ||= {};
  for(const [location,defs] of Object.entries(POINT_DEFS)){
    for(let i=0;i<defs.length;i++){
      const [name,type,production]=defs[i],id=`${location}_${i+1}`;
      const owner=world.territoryOwners[location]||TERRITORY_START[location]?.owner||'Одиночки';
      const existing=world.keyPoints[id];
      world.keyPoints[id]={id,location,name,type,production,owner:existing?.owner||owner,control:clamp(existing?.control??(world.territoryControl[location]||60),0,100),captureProgress:clamp(existing?.captureProgress??0,0,100),garrison:Math.max(0,Math.floor(Number(existing?.garrison)||0)),contestedBySquadId:existing?.contestedBySquadId||null,updatedAt:Number(existing?.updatedAt)||now};
    }
  }
  world.factionObjectives ||= {};
  for(const faction of FACTIONS){
    const def=FACTION_OBJECTIVES[faction]||{title:'Удержание позиций',description:'Сохранять влияние и ресурсы.',priorities:['base','supply'],posture:'balanced'};
    world.factionObjectives[faction] ||= {...def,faction,updatedAt:now};
  }
  world.factionResources ||= {};
  for(const faction of FACTIONS)world.factionResources[faction] ||= {supplies:100,materials:60,intel:30,artifacts:0};
  world.factionWarHistory ||= [];
  world.factionWarLastDispatchAt ||= 0;
  // Retire legacy sector-wide assault orders from pre-4.51 saves. Their target
  // model conflicts with per-object control and must not continue moving NPCs.
  for(const order of world.frontlineOrders||[]){
    if(order.status==='active'){order.status='superseded';order.resolvedAt=now;order.resolution='migrated_to_key_points';}
  }
  world.territoryOrders ||= {};
  for(const [location,order] of Object.entries(world.territoryOrders)){
    if(order?.type==='attack'||order?.type==='assault')delete world.territoryOrders[location];
  }
  for(const npc of Object.values(world.npcState||{})){
    if(npc?.missionOrder&&['attack','assault'].includes(npc.missionOrder.type)){
      npc.missionOrder=null;npc.action='guard';npc.behavior='guard';npc.duty='base_guard';npc.guardPost=true;
    }
  }
  world.factionWarVersion=1;
  const liveTargets=new Set((world.npcSquads||[]).filter(s=>s.missionType==='faction_war'&&['war_moving','holding_objective'].includes(s.status)).map(s=>s.targetPointId));
  for(const point of Object.values(world.keyPoints))if(point.contestedBySquadId&&!liveTargets.has(point.id))point.contestedBySquadId=null;
  aggregateTerritories(world);
  return world;
}

function aggregateTerritories(world){
  const byLocation={};
  for(const point of Object.values(world.keyPoints||{}))(byLocation[point.location] ||= []).push(point);
  for(const [location,points] of Object.entries(byLocation)){
    const counts={};for(const point of points)counts[point.owner]=(counts[point.owner]||0)+1;
    const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
    if(sorted[0]){
      world.territoryOwners[location]=sorted[0][0];
      world.territoryControl[location]=Math.round(points.reduce((sum,point)=>sum+clamp(point.control,0,100),0)/Math.max(1,points.length));
    }
  }
}

function pointScore(point,faction){
  const goal=FACTION_OBJECTIVES[faction]||FACTION_OBJECTIVES['Одиночки'];
  const priority=goal.priorities.indexOf(point.type);
  return (priority<0?0:50-priority*9)+(point.owner===faction?-100:0)+(point.captureProgress>0?point.captureProgress*.15:0)+point.production*2;
}

function dispatchFactionSquads(world,now,random){
  const events=[],squads=(world.npcSquads||[]).filter(s=>s&&s.status==='camped'&&!s.missionType&&now-(Number(s.lastFactionMissionAt)||0)>7*60*1000);
  for(const squad of squads){
    const members=(squad.members||[]).map(id=>world.npcState?.[id]).filter(n=>n&&n.alive!==false&&n.location===squad.location);
    if(members.length<2||random()>.24)continue;
    const faction=squad.faction,goal=FACTION_OBJECTIVES[faction];if(!goal)continue;
    // Only NPCs physically present at the squad's staging sector are deployed.
    const deployedIds=new Set(members.map(n=>n.id));
    for(const id of squad.members||[]){if(!deployedIds.has(id)){const detached=world.npcState?.[id];if(detached?.squadId===squad.id)detached.squadId=null;}}
    squad.members=members.map(n=>n.id);
    const playerLocked=new Set((world.warOperations||[]).filter(op=>op.status==='active').map(op=>op.pointId));
    const candidates=Object.values(world.keyPoints||{}).filter(point=>point.owner!==faction&&!point.contestedBySquadId&&!playerLocked.has(point.id)&&routeBetween(squad.location,point.location,4));
    const eligible=candidates.filter(point=>{
      if(point.owner===faction)return false;
      const relation=Number(world.diplomacy?.[faction]?.[point.owner]??0);
      return point.owner===faction||relation<=-15||point.location===squad.location;
    });
    if(!eligible.length)continue;
    eligible.sort((a,b)=>pointScore(b,faction)-pointScore(a,faction));
    const shortlist=eligible.slice(0,Math.min(4,eligible.length));
    const target=shortlist[Math.floor(random()*shortlist.length)],route=routeBetween(squad.location,target.location,4);
    if(!route)continue;
    squad.missionType='faction_war';squad.targetPointId=target.id;target.contestedBySquadId=squad.id;squad.targetLocation=target.location;squad.missionFaction=faction;squad.missionStartedAt=now;squad.route=route;squad.routeIndex=0;squad.lastFactionMissionAt=now;
    squad.status=route.length===1?'holding_objective':'war_moving';squad.nextMoveAt=now+(route.length===1?0:75_000+Math.floor(random()*45_000));
    for(const npc of members){npc.missionOrder={type:'secure_key_point',target:target.location,pointId:target.id};npc.action=route.length===1?'guard':'travel';npc.behavior=route.length===1?'objective_guard':'faction_march';npc.duty=route.length===1?'objective_guard':'faction_assignment';npc.guardPost=false;}
    events.push({type:'faction_squad_deployed',location:squad.location,target:target.location,pointId:target.id,faction,text:`Отряд «${squad.name}» группировки «${faction}» получил задачу: ${route.length===1?'укрепить объект':'выдвинуться к объекту'} «${target.name}».`,at:now});
  }
  return events;
}

function finishFactionMission(world,squad,now,events,success){
  const members=(squad.members||[]).map(id=>world.npcState?.[id]).filter(n=>n&&n.alive!==false);
  squad.missionCompletedAt=now;squad.missionResult=success?'secured':'failed';
  if(success)events.push({type:'faction_objective_secured',location:squad.targetLocation,pointId:squad.targetPointId,faction:squad.faction,text:`Отряд «${squad.name}» закрепился на объекте группировки «${squad.faction}».`,at:now});
  const reverse=(squad.route||[]).slice(0,(Number(squad.routeIndex)||0)+1).reverse();
  const point=world.keyPoints?.[squad.targetPointId];if(point?.contestedBySquadId===squad.id)point.contestedBySquadId=null;
  squad.missionType=null;squad.targetPointId=null;squad.targetLocation=null;squad.missionFaction=null;
  if(reverse.length>1){squad.route=reverse;squad.routeIndex=0;squad.status='returning';squad.nextMoveAt=now+90_000;}
  else {squad.route=[];squad.routeIndex=0;squad.status='camped';squad.location=members[0]?.location||squad.location;}
  for(const npc of members){npc.missionOrder=null;npc.action=reverse.length>1?'travel':'guard';npc.behavior=reverse.length>1?'squad_return':'guard';npc.duty=reverse.length>1?'return_to_base':'base_guard';npc.guardPost=reverse.length<=1;}
}

function tickFactionWar(world,now=Date.now(),random=Math.random){
  initFactionWar(world,now);
  const events=[];
  // Advance strategic squad routes independently from ordinary NPC roaming.
  for(const squad of world.npcSquads||[]){
    if(squad.status==='war_moving'&&now>=(Number(squad.nextMoveAt)||0)){
      const next=squad.route?.[Number(squad.routeIndex||0)+1];
      if(next){const from=squad.location;squad.routeIndex=(Number(squad.routeIndex)||0)+1;squad.location=next;
        for(const id of squad.members||[]){const npc=world.npcState?.[id];if(!npc||npc.alive===false)continue;npc.location=next;npc.action='travel';npc.behavior='faction_march';npc.duty='faction_assignment';npc.history||=[];npc.history.push({action:'faction_march',location:next,at:now});npc.history=npc.history.slice(-20);world.npcPositions[id]=next;}
        squad.nextMoveAt=now+90_000+Math.floor(random()*45_000);
        if(squad.routeIndex>=squad.route.length-1){squad.status='holding_objective';squad.objectiveStartedAt=now;squad.nextCaptureAt=now;for(const id of squad.members||[]){const npc=world.npcState?.[id];if(npc&&npc.alive!==false){npc.action='guard';npc.behavior='objective_guard';npc.duty='objective_guard';}}}
        events.push({type:'faction_squad_route',location:next,from,faction:squad.faction,squadId:squad.id,text:`Отряд «${squad.name}» прибыл в сектор ${next} по стратегическому маршруту.`,at:now});
      }
    }
    if(squad.status==='holding_objective'&&now>=(Number(squad.nextCaptureAt)||0)){
      const point=world.keyPoints?.[squad.targetPointId];
      if(!point||point.owner===squad.faction){finishFactionMission(world,squad,now,events,!!point);continue;}
      const members=(squad.members||[]).map(id=>world.npcState?.[id]).filter(n=>n&&n.alive!==false&&n.location===squad.location);
      const defenders=Object.values(world.npcState||{}).filter(n=>n.alive!==false&&n.location===point.location&&n.faction===point.owner&&n.guardPost).length;
      const gain=clamp(8+members.length*5-defenders*2,3,24);
      point.captureProgress=clamp(point.captureProgress+gain,0,100);point.control=clamp(100-point.captureProgress,0,100);point.updatedAt=now;squad.nextCaptureAt=now+45_000;
      if(point.captureProgress>=100){const previous=point.owner;point.owner=squad.faction;point.control=55;point.captureProgress=0;point.garrison=members.length;point.updatedAt=now;
        aggregateTerritories(world);
        const resource=world.factionResources[squad.faction];resource.supplies=clamp(resource.supplies+point.production*4,0,10000);resource.materials=clamp(resource.materials+(point.type==='industry'?point.production*5:point.production*2),0,10000);if(point.type==='research'||point.type==='anomaly')resource.intel=clamp(resource.intel+point.production*3,0,10000);
        world.factionWarHistory.unshift({id:`capture_${point.id}_${now}`,pointId:point.id,location:point.location,name:point.name,from:previous,to:squad.faction,at:now});world.factionWarHistory=world.factionWarHistory.slice(0,60);
        events.push({type:'key_point_captured',location:point.location,pointId:point.id,owner:squad.faction,previousOwner:previous,text:`Объект «${point.name}» в секторе ${point.location} перешёл от группировки «${previous}» к «${squad.faction}».`,at:now});
        finishFactionMission(world,squad,now,events,true);
      }
    }
  }
  if(now-(Number(world.factionWarLastDispatchAt)||0)>=60_000){events.push(...dispatchFactionSquads(world,now,random));world.factionWarLastDispatchAt=now;}
  // Every controlled point contributes a small, capped flow of strategic resources.
  if(now-(Number(world.factionResourceTickAt)||0)>=5*60_000){
    for(const point of Object.values(world.keyPoints||{})){const r=world.factionResources[point.owner];if(!r)continue;r.supplies=clamp(r.supplies+point.production,0,10000);if(point.type==='industry')r.materials=clamp(r.materials+point.production,0,10000);if(['research','anomaly','relay'].includes(point.type))r.intel=clamp(r.intel+Math.max(1,Math.floor(point.production/2)),0,10000);}
    world.factionResourceTickAt=now;
  }
  for(const ev of events){world.npcEvents||=[];world.npcEvents.push(ev);}world.npcEvents=(world.npcEvents||[]).slice(-120);
  world.npcPositions=Object.fromEntries(Object.values(world.npcState||{}).filter(n=>n.alive!==false).map(n=>[n.id,n.location]));
  return events;
}

module.exports={FACTION_OBJECTIVES,POINT_DEFS,initFactionWar,tickFactionWar,aggregateTerritories,routeBetween};
