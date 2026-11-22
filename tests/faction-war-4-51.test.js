'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {FACTIONS,TERRITORY_START}=require('../src/shared/game-data');
const {initFactionWar,tickFactionWar,aggregateTerritories,routeBetween,FACTION_OBJECTIVES}=require('../src/systems/faction-war');
const {tickNpcWorld}=require('../src/systems/npc-ai');

test('every known sector receives three stable strategic key points and faction objectives',()=>{
  const world={territoryOwners:Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v])=>[id,v.owner])),territoryControl:Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v])=>[id,v.control]))};
  initFactionWar(world,1000);
  assert.equal(Object.keys(world.keyPoints).length,Object.keys(TERRITORY_START).length*3);
  assert.equal(Object.keys(world.factionObjectives).length,FACTIONS.size);
  assert.equal(world.territoryControl.cordon,TERRITORY_START.cordon.control);
  for(const [location,sector] of Object.entries(TERRITORY_START)){
    const points=Object.values(world.keyPoints).filter(p=>p.location===location);
    assert.equal(points.length,3);
    assert.ok(points.every(p=>p.owner===sector.owner));
  }
});

test('sector ownership changes only when a faction controls a majority of its key points',()=>{
  const world={};initFactionWar(world,1000);
  const cordon=Object.values(world.keyPoints).filter(p=>p.location==='cordon');
  cordon[0].owner='Долг';aggregateTerritories(world);
  assert.equal(world.territoryOwners.cordon,'Одиночки');
  cordon[1].owner='Долг';aggregateTerritories(world);
  assert.equal(world.territoryOwners.cordon,'Долг');
});

test('faction strategy assigns a real squad a connected route to a strategic object',()=>{
  const world={territoryOwners:Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v])=>[id,v.owner])),territoryControl:Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v])=>[id,v.control])),diplomacy:{'Долг':{'Наёмники':-45}},npcState:{a:{id:'a',name:'Ветер',faction:'Долг',location:'bar',alive:true},b:{id:'b',name:'Крот',faction:'Долг',location:'bar',alive:true},c:{id:'c',name:'Рысь',faction:'Долг',location:'bar',alive:true}},npcSquads:[{id:'s1',name:'Северный дозор',faction:'Долг',location:'bar',members:['a','b','c'],status:'camped'}]};
  initFactionWar(world,1000);
  const events=tickFactionWar(world,1_000_000,()=>0);
  const squad=world.npcSquads[0];
  assert.ok(events.some(e=>e.type==='faction_squad_deployed'));
  assert.equal(squad.missionType,'faction_war');
  assert.ok(squad.route.length>=2);
  assert.equal(world.keyPoints[squad.targetPointId].contestedBySquadId,squad.id);
  assert.equal(squad.route[0],'bar');
  assert.equal(squad.route.at(-1),squad.targetLocation);
  for(let i=1;i<squad.route.length;i++)assert.ok(routeBetween(squad.route[i-1],squad.route[i],2));
});

test('war squad captures one key point without instantly taking the whole sector',()=>{
  const world={territoryOwners:Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v])=>[id,v.owner])),territoryControl:Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v])=>[id,v.control])),diplomacy:{'Долг':{'Наёмники':-45}},npcState:{a:{id:'a',name:'Ветер',faction:'Долг',location:'wild',alive:true},b:{id:'b',name:'Крот',faction:'Долг',location:'wild',alive:true},c:{id:'c',name:'Рысь',faction:'Долг',location:'wild',alive:true}},npcSquads:[{id:'s1',name:'Северный дозор',faction:'Долг',location:'wild',members:['a','b','c'],status:'holding_objective',missionType:'faction_war',targetPointId:'wild_1',targetLocation:'wild',route:['bar','wild'],routeIndex:1,nextCaptureAt:0}]};
  initFactionWar(world,1000);
  world.keyPoints.wild_1.owner='Наёмники';
  world.npcSquads[0].nextCaptureAt=0;
  let now=2_000_000;
  for(let i=0;i<8&&world.keyPoints.wild_1.owner!=='Долг';i++){tickFactionWar(world,now,()=>0.5);now+=60_000;}
  assert.equal(world.keyPoints.wild_1.owner,'Долг');
  assert.equal(world.territoryOwners.wild,'Наёмники');
  assert.ok(world.factionWarHistory.some(x=>x.pointId==='wild_1'));
});

test('legacy key point ownership and faction resource balances survive initialization',()=>{
  const world={keyPoints:{cordon_1:{id:'cordon_1',location:'cordon',name:'Старый объект',owner:'Свобода',control:41}},factionResources:{'Свобода':{supplies:777,materials:222,intel:33}}};
  initFactionWar(world,2000);
  assert.equal(world.keyPoints.cordon_1.owner,'Свобода');
  assert.equal(world.keyPoints.cordon_1.control,41);
  assert.equal(world.factionResources['Свобода'].supplies,777);
  assert.equal(world.keyPoints.cordon_2.owner,'Одиночки');
  assert.ok(FACTION_OBJECTIVES['Учёные'].priorities.includes('research'));
});


test('NPC AI does not override a strategic squad route or clear its key-point order',()=>{
  const world={territoryOwners:{bar:'Долг',wild:'Наёмники'},territoryOrders:{},npcSquads:[{id:'war_squad',faction:'Долг',location:'bar',members:['a','b'],status:'war_moving',missionType:'faction_war',targetPointId:'wild_1'}],npcState:{a:{id:'a',name:'Ветер',faction:'Долг',location:'bar',alive:true,health:100,morale:60,supplies:50,action:'travel',behavior:'faction_march',missionOrder:{type:'secure_key_point',target:'wild',pointId:'wild_1'},squadId:'war_squad',nextDecisionAt:0},b:{id:'b',name:'Крот',faction:'Долг',location:'bar',alive:true,health:100,morale:60,supplies:50,action:'travel',behavior:'faction_march',missionOrder:{type:'secure_key_point',target:'wild',pointId:'wild_1'},squadId:'war_squad',nextDecisionAt:0}}};
  tickNpcWorld(world,new Set(['bar','wild']),()=>0,1000);
  assert.equal(world.npcState.a.location,'bar');
  assert.equal(world.npcState.a.missionOrder.pointId,'wild_1');
  assert.equal(world.npcSquads[0].status,'war_moving');
});

test('war PDA and map expose the shared key-point and faction-objective state',()=>{
  const fs=require('node:fs');
  const html=fs.readFileSync(require('node:path').join(__dirname,'../public/index.html'),'utf8');
  const client=fs.readFileSync(require('node:path').join(__dirname,'../public/js/game.js'),'utf8');
  const server=fs.readFileSync(require('node:path').join(__dirname,'../server.js'),'utf8');
  assert.match(html,/id="warKeyPoints"/);
  assert.match(client,/function showMapKeyPoint\(/);
  assert.match(client,/marker-keypoint/);
  assert.match(server,/keyPoints:world\.keyPoints/);
  assert.match(server,/tickFactionWar\(world,now,Math\.random\)/);
});


test('legacy whole-sector assault orders are retired during migration',()=>{
  const world={frontlineOrders:[{id:'legacy-front',status:'active',target:'dump'}],territoryOrders:{dump:{faction:'Долг',type:'attack',expiresAt:999999}},npcState:{a:{id:'a',missionOrder:{type:'attack',target:'dump'},action:'travel',behavior:'assault'}}};
  initFactionWar(world,5000);
  assert.equal(world.frontlineOrders[0].status,'superseded');
  assert.equal(world.territoryOrders.dump,undefined);
  assert.equal(world.npcState.a.missionOrder,null);
  assert.equal(world.npcState.a.behavior,'guard');
});
