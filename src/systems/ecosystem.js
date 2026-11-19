// Lightweight persistent simulation for mutant packs, faction bases, clans and local markets.
const crypto=require('crypto');
const SPECIES=['плоть','псевдособака','кабан','снорк','контролёр'];
const ZONES=['cordon','dump','bar','agro','dark','yantar','army','red','pripyat','zaton','jupiter','yanov','kopachi','volkhov','iron','swamps'];
function initEcosystem(world){
  world.ecosystem ||= {mutantPacks:[],bases:{},markets:{},clans:{},events:[],revision:1};
  const e=world.ecosystem;
  if(!e.mutantPacks.length){for(let i=0;i<18;i++)e.mutantPacks.push({id:`pack_${i+1}`,species:SPECIES[i%SPECIES.length],location:ZONES[(i*7+1)%ZONES.length],count:2+(i*3)%7,aggression:25+(i*13)%76,health:100,updatedAt:Date.now()});}
  for(const [loc,owner] of Object.entries(world.territoryOwners||{}))e.bases[loc] ||= {location:loc,faction:owner,level:1,fortification:20,supplies:70,updatedAt:Date.now()};
  for(const loc of ZONES)e.markets[loc] ||= {location:loc,priceIndex:1,scarcity:0,updatedAt:Date.now()};
  return e;
}
function addEcoEvent(world,type,text,now=Date.now()){const e=initEcosystem(world);const event={id:crypto.randomUUID(),type,text,at:now};e.events.unshift(event);e.events=e.events.slice(0,40);e.revision++;return event;}
function tickEcosystem(world,random=Math.random,now=Date.now()){
 const e=initEcosystem(world),events=[];
 for(const pack of e.mutantPacks){if(random()<.38){const from=pack.location;pack.location=ZONES[Math.floor(random()*ZONES.length)];if(from!==pack.location)events.push(addEcoEvent(world,'mutant_migration',`Следы группы «${pack.species}» замечены: ${from} → ${pack.location}.`,now));}
  if(random()<.12){pack.count=Math.max(1,Math.min(12,pack.count+(random()<.55?1:-1)));pack.aggression=Math.max(10,Math.min(100,pack.aggression+(random()<.5?5:-4)));}
  pack.updatedAt=now;
 }
 for(const market of Object.values(e.markets)){market.scarcity=Math.max(0,Math.min(100,market.scarcity+(random()<.5?3:-2)));market.priceIndex=Math.max(.65,Math.min(2.4,Number((.8+market.scarcity/100+random()*.18).toFixed(2))));market.updatedAt=now;}
 for(const base of Object.values(e.bases)){base.supplies=Math.max(0,base.supplies-(random()<.35?1:0));if(base.supplies<20&&random()<.08)events.push(addEcoEvent(world,'base_supply',`На базе «${base.faction}» в секторе ${base.location} заканчиваются припасы.`,now));}
 return events;
}
function upgradeBase(world,location,faction,cost=500){const e=initEcosystem(world),b=e.bases[location];if(!b)return {ok:false,reason:'В этом секторе нет оборудованной базы.'};if(b.faction!==faction)return {ok:false,reason:'Улучшать можно только базу своей группировки.'};if(b.level>=5)return {ok:false,reason:'База уже достигла максимального уровня.'};b.level++;b.fortification=Math.min(100,b.fortification+15);b.supplies=Math.min(100,b.supplies+10);b.updatedAt=Date.now();addEcoEvent(world,'base_upgraded',`База «${faction}» в секторе ${location} улучшена до уровня ${b.level}.`);return {ok:true,base:b,cost};}
function joinClan(world,player,clanId){const e=initEcosystem(world),clan=e.clans[String(clanId||'')];if(!clan)return {ok:false,reason:'Клан не найден.'};if(clan.faction!==player.faction)return {ok:false,reason:'Вступить можно только в клан своей группировки.'};if(clan.members.some(m=>m.id===player.id))return {ok:false,reason:'Ты уже состоишь в этом клане.'};clan.members.push({id:player.id,name:player.name,rank:'боец',joinedAt:Date.now()});addEcoEvent(world,'clan_member_joined',`${player.name} вступил в клан «${clan.name}».`);return {ok:true,clan};}
function createClan(world,player,name){const e=initEcosystem(world);const clean=String(name||'').trim().replace(/[<>]/g,'').slice(0,24);if(clean.length<3)return {ok:false,reason:'Название клана должно содержать от 3 до 24 символов.'};if(Object.values(e.clans).some(c=>c.name.toLowerCase()===clean.toLowerCase()))return {ok:false,reason:'Такое название клана уже занято.'};const id=crypto.randomUUID();const clan={id,name:clean,leaderId:player.id,leaderName:player.name,faction:player.faction,members:[{id:player.id,name:player.name,rank:'лидер',joinedAt:Date.now()}],createdAt:Date.now(),level:1,stash:{money:0,items:[]}};e.clans[id]=clan;addEcoEvent(world,'clan_created',`Создан клан «${clean}» (${player.faction}).`);return {ok:true,clan};}
module.exports={initEcosystem,tickEcosystem,upgradeBase,createClan,joinClan,addEcoEvent};
