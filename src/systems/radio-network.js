'use strict';
const MAX_MESSAGES=100, MAX_LENGTH=240;
function ensureFactionRadio(world){world.factionRadio ||= {};return world.factionRadio;}
function listFactionRadio(world,faction){const radio=ensureFactionRadio(world);return (radio[faction]||[]).slice(-MAX_MESSAGES);}
function postFactionRadio(world,player,text,now=Date.now()){
 const faction=String(player?.faction||'');const body=String(text||'').replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,MAX_LENGTH);
 if(!faction||!body)return {ok:false,message:'Сообщение пустое или группировка не определена.'};
 const radio=ensureFactionRadio(world);radio[faction] ||= [];
 const message={id:`radio-${now}-${Math.random().toString(36).slice(2,8)}`,faction,name:String(player.name||'Сталкер').slice(0,32),text:body,at:now,location:player.location||'неизвестно'};
 radio[faction].push(message);if(radio[faction].length>MAX_MESSAGES)radio[faction]=radio[faction].slice(-MAX_MESSAGES);
 return {ok:true,message};
}
module.exports={MAX_MESSAGES,MAX_LENGTH,ensureFactionRadio,listFactionRadio,postFactionRadio};
