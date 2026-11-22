// Persistent A-Life routines: camp visits, traders, scavenging and social encounters.
// This layer assigns local goals; npc-ai.js remains responsible for physical movement.
const { SECTOR_COORDS } = require('./proximity');
const { changeRelationship } = require('./relationships');
const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
const ARTIFACTS=['Медуза','Колючка','Каменный цветок','Пустышка','Огненный шар','Слизень'];
const TRADER_ROLES=['торговец','бармен','техник'];
const PROTECTED_ACTIONS=new Set(['combat','dead','retreat','await_rescue','rescue_escort','travel','assault','mission','war_moving']);
function seeded(id,slot){let h=2166136261;for(const c of `${id}|${slot}`){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function pointFor(npc,kind,now){
 const center=SECTOR_COORDS[npc.location]||SECTOR_COORDS.cordon,seed=seeded(npc.id,`${kind}:${Math.floor(now/60000)}`),angle=(seed%100000)/100000*Math.PI*2;
 const radius=kind==='campfire'?18:kind==='trader'?54:kind==='scavenge'?105:kind==='social'?30:70;
 return {x:clamp(center[0]+Math.cos(angle)*radius,5,995),y:clamp(center[1]+Math.sin(angle)*radius,5,1995)};
}
function addMemory(npc,item){npc.memory ||= [];npc.memory.push(item);npc.memory=npc.memory.slice(-40);}
function tickNpcLife(world,now=Date.now(),random=Math.random){
 const npcs=Object.values(world.npcState||{}).filter(n=>n&&n.alive!==false),events=[],bySector=new Map();
 for(const npc of npcs){const list=bySector.get(npc.location)||[];list.push(npc);bySector.set(npc.location,list);}
 for(const npc of npcs){
  if((PROTECTED_ACTIONS.has(npc.action)&&!(npc.action==='travel'&&npc.lifeRoutine))||npc.missionOrder||npc.occupationGarrison)continue;
  npc.lifeRoutine ||= null;
  const routine=npc.lifeRoutine;
  if(routine){
   const dx=Number(routine.target?.x)-Number(npc.x),dy=Number(routine.target?.y)-Number(npc.y),distance=Math.hypot(dx,dy);
   if(npc.destinationPoint&&distance<=10){npc.destinationPoint=null;npc.action=routine.activity==='rest'?'rest':routine.activity==='trade'?'trade':routine.activity==='scavenge'?'scavenge':'camp';}
   if(!npc.destinationPoint&&distance<=14){
    if(routine.phase==='outbound'){
     routine.phase='doing';routine.arrivedAt=now;routine.until=now+(routine.activity==='scavenge'?45000:routine.activity==='trade'?30000:60000);
     npc.action=routine.activity==='rest'?'rest':routine.activity==='trade'?'trade':routine.activity==='scavenge'?'scavenge':'camp';npc.behavior=routine.activity==='rest'?'rest':routine.activity==='trade'?'trading':routine.activity==='scavenge'?'artifact_search':'campfire';
     events.push({type:'npc_life_arrival',npcId:npc.id,location:npc.location,activity:routine.activity,text:`${npc.name} прибыл${npc.gender==='female'?'а':''} ${routine.activity==='trade'?'к торговцу':routine.activity==='scavenge'?'на поиски артефактов':routine.activity==='rest'?'на отдых':'к костру'} в секторе ${npc.location}.`,at:now});
    } else if(routine.phase==='doing'&&now>=routine.until){
     if(routine.activity==='scavenge'&&random()<.22){const artifact=ARTIFACTS[Math.floor(random()*ARTIFACTS.length)];npc.inventory ||= [];npc.inventory.push({id:`npc_artifact_${npc.id}_${now}`,name:artifact,type:'artifact',value:120+Math.floor(random()*380),foundAt:now,location:npc.location});addMemory(npc,{type:'artifact_found',name:artifact,location:npc.location,at:now});events.push({type:'npc_artifact_found',npcId:npc.id,location:npc.location,text:`${npc.name} обнаружил артефакт «${artifact}» в секторе ${npc.location}.`,at:now});}
     if(routine.activity==='trade'){npc.supplies=clamp((npc.supplies||0)+5,0,100);npc.lastTradeAt=now;}
     if(routine.activity==='rest'){npc.needs ||= {};npc.needs.fatigue=clamp((npc.needs.fatigue||0)-18,0,100);npc.health=clamp((npc.health||100)+2,0,100);}
     routine.phase='returning';routine.target={...(routine.home||{x:npc.x,y:npc.y})};npc.destinationPoint={...routine.target};npc.action='travel';npc.behavior='returning_to_camp';
    }
   }
   if(routine.phase==='returning'&&!npc.destinationPoint&&distance<=14){npc.lifeRoutine=null;npc.action='camp';npc.behavior='campfire';npc.duty='rest_at_base';npc.nextDecisionAt=now+30000;addMemory(npc,{type:'routine_completed',activity:routine.activity,location:npc.location,at:now});}
   continue;
  }
  if(npc.destinationPoint||now<(Number(npc.nextLifeAt)||0)||random()>.012)continue;
  const role=String(npc.role||'').toLowerCase(),needs=npc.needs||{};
  let activity='camp';
  if(Number(needs.fatigue)>65||Number(needs.stress)>80)activity='rest';
  else if(TRADER_ROLES.some(r=>role.includes(r))||random()<.18)activity='trade';
  else if(random()<.32)activity='scavenge';
  else if(random()<.62)activity='social';
  let target=pointFor(npc,activity==='trade'?'trader':activity==='scavenge'?'scavenge':activity==='rest'?'campfire':activity==='social'?'social':'campfire',now);
  if(activity==='trade'){
   const traders=(bySector.get(npc.location)||[]).filter(other=>{const role=String(other.role||'').toLowerCase();return other!==npc&&other.alive!==false&&TRADER_ROLES.some(r=>role.includes(r))&&Number.isFinite(Number(other.x))&&Number.isFinite(Number(other.y));});
   if(traders.length){traders.sort((a,b)=>Math.hypot(a.x-npc.x,a.y-npc.y)-Math.hypot(b.x-npc.x,b.y-npc.y));target={x:Number(traders[0].x),y:Number(traders[0].y)};}
  }
  npc.lifeRoutine={activity,phase:'outbound',target,home:{x:Number(npc.x)||target.x,y:Number(npc.y)||target.y},startedAt:now,sector:npc.location};npc.destinationPoint={...target};npc.action='travel';npc.behavior=activity==='scavenge'?'artifact_search_route':activity==='trade'?'going_to_trader':activity==='rest'?'going_to_rest':'going_to_campfire';npc.duty='civilian_routine';npc.guardPost=false;npc.nextLifeAt=now+5*60*1000+Math.floor(random()*7*60*1000);
  events.push({type:'npc_life_departure',npcId:npc.id,location:npc.location,activity,text:`${npc.name} отправился ${activity==='trade'?'к торговцу':activity==='scavenge'?'искать артефакты':activity==='rest'?'отдохнуть':'к месту стоянки'} в секторе ${npc.location}.`,at:now});
 }
 // Social encounters: nearby non-hostile stalkers exchange a little information and remember it.
 for(const [location,group] of bySector){for(let i=0;i<group.length;i++){const a=group[i];if(a.alive===false||now-(Number(a.lastSocialAt)||0)<8*60*1000)continue;for(let j=i+1;j<group.length;j++){const b=group[j];if(b.alive===false||a.faction!==b.faction||PROTECTED_ACTIONS.has(a.action)||PROTECTED_ACTIONS.has(b.action)||now-(Number(b.lastSocialAt)||0)<8*60*1000)continue;const d=Math.hypot((Number(a.x)||0)-(Number(b.x)||0),(Number(a.y)||0)-(Number(b.y)||0));if(d>38||random()>.035)continue;a.relationships ||= {};b.relationships ||= {};a.relationships[b.id]=changeRelationship(a.relationships[b.id],1);b.relationships[a.id]=changeRelationship(b.relationships[a.id],1);a.lastSocialAt=b.lastSocialAt=now;addMemory(a,{type:'npc_conversation',npcId:b.id,name:b.name,location,at:now});addMemory(b,{type:'npc_conversation',npcId:a.id,name:a.name,location,at:now});events.push({type:'npc_social_encounter',location,npcIds:[a.id,b.id],text:`${a.name} и ${b.name} беседуют у стоянки в секторе ${location}.`,at:now});break;}}}
 world.npcLifeEvents ||= [];world.npcLifeEvents.push(...events);world.npcLifeEvents=world.npcLifeEvents.slice(-80);
 return events;
}
module.exports={tickNpcLife,ARTIFACTS};
