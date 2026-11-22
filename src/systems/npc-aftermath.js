'use strict';
const crypto=require('crypto');
const {npcWorldPosition}=require('./proximity');
const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
function makeLoot(npc,now){
  const seed=String(npc.id||'npc').split('').reduce((n,c)=>n+c.charCodeAt(0),0);
  const items=[];
  if(seed%3!==0)items.push({id:`corpse_${npc.id}_bandage`,name:'Бинт',type:'Медицина',qty:1,value:90,weight:.1,desc:'Найдено в снаряжении погибшего сталкера.'});
  if(seed%2===0)items.push({id:`corpse_${npc.id}_parts`,name:'Металлолом',type:'Ресурсы',qty:1+(seed%2),value:45,weight:.5,desc:'Полевые детали из личного снаряжения.'});
  return {money:20+(seed%101),items};
}
function ensureCorpse(world,npc,now){
  world.npcCorpses ||= [];
  if(npc.corpseId||world.npcCorpses.some(c=>c.npcId===npc.id))return null;
  const id=`corpse_${npc.id}_${Number(npc.diedAt)||now}`;
  const pos=npcWorldPosition(npc);
  const corpse={id,npcId:npc.id,name:npc.name,faction:npc.faction,location:npc.location,x:pos.x,y:pos.y,createdAt:Number(npc.diedAt)||now,expiresAt:now+45*60*1000,looted:false,loot:makeLoot(npc,now)};
  world.npcCorpses.unshift(corpse);world.npcCorpses=world.npcCorpses.slice(0,120);npc.corpseId=id;
  return corpse;
}
function tickNpcAftermath(world,now=Date.now()){
  world.npcState ||= {};world.npcEvents ||= [];world.npcMemorial ||= [];world.npcCorpses ||= [];world.factionNotices ||= [];
  const events=[];const npcs=world.npcState;
  for(const npc of Object.values(npcs)){
    if(!npc||!npc.generated)continue;
    if(npc.alive===false){
      const corpse=ensureCorpse(world,npc,now);
      if(corpse){
        const squad=(world.npcSquads||[]).find(s=>(s.members||[]).includes(npc.id));
        const survivors=(squad?.members||npc.friends||[]).map(id=>npcs[id]).filter(n=>n&&n.alive!==false&&n.id!==npc.id);
        for(const friend of survivors){friend.memory ||= [];friend.memory.push({type:'companion_lost',name:npc.name,location:npc.location,at:now});friend.memory=friend.memory.slice(-30);friend.needs ||= {hunger:0,thirst:0,fatigue:0,stress:0};friend.needs.stress=clamp((friend.needs.stress||0)+20,0,100);friend.mood='скорбит';friend.lastCompanionLossAt=now;}
        const notice={id:`notice_${corpse.id}`,type:'casualty',faction:npc.faction,location:npc.location,npcId:npc.id,name:npc.name,text:`Подтверждена гибель ${npc.name} (${npc.role||'сталкер'}) в секторе ${npc.location}. Причина: ${npc.deathCause||'обстоятельства неизвестны'}.`,at:now,read:false};
        world.factionNotices.unshift(notice);world.factionNotices=world.factionNotices.slice(0,80);
        events.push({type:'npc_casualty_report',npcId:npc.id,location:npc.location,faction:npc.faction,text:notice.text,at:now});
        events.push({type:'npc_companion_mourning',npcId:npc.id,location:npc.location,text:survivors.length?`${survivors.map(n=>n.name).join(', ')} узнали о гибели ${npc.name}. В отряде говорят о потере.`:`В секторе ${npc.location} нашли тело ${npc.name}.`,at:now});
      }
      continue;
    }
    const safe=(npc.action==='camp'||npc.action==='rest'||npc.behavior==='camp'||npc.duty==='base_guard'||npc.duty==='rest_at_base');
    if(!safe||Number(npc.health)>=100||now-(Number(npc.lastRecoveryAt)||0)<5*60*1000)continue;
    const supplies=Math.max(0,Number(npc.supplies)||0);if(supplies<2)continue;
    const restored=Math.min(5,100-Number(npc.health));npc.health=clamp(Number(npc.health)+restored,0,100);npc.supplies=supplies-2;npc.lastRecoveryAt=now;
    npc.memory ||= [];npc.memory.push({type:'recovered',amount:restored,location:npc.location,at:now});npc.memory=npc.memory.slice(-30);
    if(npc.health>=70&&npc.mood==='ранен')npc.mood='спокоен';
    events.push({type:'npc_injury_recovery',npcId:npc.id,location:npc.location,text:`${npc.name} восстановил ${restored} здоровья на безопасной стоянке.`,at:now});
  }
  const before=world.npcCorpses.length;
  world.npcCorpses=world.npcCorpses.filter(c=>c&&Number(c.expiresAt)>now&&!c.looted);
  if(before!==world.npcCorpses.length)world.npcCorpsesRevision=(world.npcCorpsesRevision||0)+1;
  for(const ev of events){world.npcEvents.push(ev);}
  world.npcEvents=world.npcEvents.slice(-100);
  return events;
}
function lootCorpse(world,player,corpseId,now=Date.now()){
  const corpse=(world.npcCorpses||[]).find(c=>c.id===String(corpseId));
  if(!corpse||corpse.looted||Number(corpse.expiresAt)<=now)return {ok:false,reason:'Тело уже обыскали или следы давно исчезли.'};
  if(corpse.location!==player.location)return {ok:false,reason:'Тело находится в другом секторе.'};
  const dx=(Number(player.x)||0)-(Number(corpse.x)||0),dy=(Number(player.y)||0)-(Number(corpse.y)||0);
  if(Math.hypot(dx,dy)>18)return {ok:false,reason:'Подойди ближе к телу (не дальше 18 метров).'};
  const state=player.state||player;state.items ||= [];const loot=corpse.loot||{money:0,items:[]};
  state.money=clamp((Number(state.money)||0)+(Number(loot.money)||0),0,999999999);
  for(const item of loot.items||[]){const existing=state.items.find(x=>x.id===item.id);if(existing)existing.qty=clamp((existing.qty||0)+(item.qty||1),0,999);else state.items.push({...item});}
  corpse.looted=true;corpse.lootedBy=player.id;corpse.lootedAt=now;
  world.npcCorpses=world.npcCorpses.filter(c=>c.id!==corpse.id);world.npcCorpsesRevision=(world.npcCorpsesRevision||0)+1;
  return {ok:true,money:Number(loot.money)||0,items:loot.items||[],state};
}
module.exports={tickNpcAftermath,lootCorpse,ensureCorpse};
