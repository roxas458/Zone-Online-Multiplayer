// Clear Sky-inspired progression ranks shared by player and NPC systems.
const RANKS=Object.freeze([
 {xp:0,name:'Новичок',badge:'I',tier:0},
 {xp:50,name:'Опытный',badge:'Ⅱ',tier:1},
 {xp:150,name:'Сталкер',badge:'Ⅲ',tier:2},
 {xp:300,name:'Ветеран',badge:'Ⅳ',tier:3},
 {xp:600,name:'Мастер',badge:'Ⅴ',tier:4},
 {xp:1000,name:'Легенда',badge:'★',tier:5}
]);
function rankForXp(xp){return RANKS.filter(r=>Number(xp||0)>=r.xp).at(-1)||RANKS[0];}
function rankForNpc(npc){if(npc?.rankName)return RANKS.find(r=>r.name===npc.rankName)||RANKS[0];const id=String(npc?.id||'');let h=2166136261;for(const c of id){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}const tier=Math.min(5,Math.floor(((h>>>0)%100)/19));return RANKS[tier];}
module.exports={RANKS,rankForXp,rankForNpc};
