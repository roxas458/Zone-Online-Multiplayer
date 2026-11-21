/* ZONE ONLINE multiplayer phase 1: connection + shared presence roster. */
(()=>{
 'use strict';
 const status=document.getElementById('mpConnectionStatus');
 const count=document.getElementById('mpOnlineCount');
 const list=document.getElementById('mpPlayerRoster');
 const setStatus=(state,label)=>{if(status){status.dataset.state=state;status.textContent=label;}};
 const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const readSave=()=>{try{return JSON.parse(localStorage.getItem('zoneExpandedSave')||'{}')}catch{return {}}};
 const renderRoster=players=>{if(count)count.textContent=String(players.length);if(list)list.innerHTML=players.length?players.map(p=>`<div class="item"><b>${escapeHtml(p.name)}</b><div class="desc">${escapeHtml(p.faction)} · ${escapeHtml(p.location)}</div></div>`).join(''):'<div class="mutedbox small">Пока в Зоне никого нет. Ты можешь быть первым.</div>';};
 if(typeof window.io!=='function'){setStatus('offline','СЕТЕВОЙ КЛИЕНТ НЕ ЗАГРУЖЕН');return;}
 setStatus('connecting','ПОДКЛЮЧЕНИЕ…');
 const socket=window.io({transports:['websocket','polling'],reconnection:true,reconnectionAttempts:Infinity,reconnectionDelay:1000,reconnectionDelayMax:10000,timeout:20000});
 window.zoneMultiplayerSocket=socket;
 socket.on('connect',()=>{setStatus('online','СЕРВЕР НА СВЯЗИ');const g=readSave();socket.emit('zone:join',{name:g.name||'Сталкер',faction:g.faction||'Одиночки',location:g.loc||'cordon'},result=>{if(result?.ok)setStatus('online','В СЕТИ');});});
 socket.on('disconnect',()=>setStatus('offline','НЕТ СОЕДИНЕНИЯ · ПОВТОРНОЕ ПОДКЛЮЧЕНИЕ'));
 socket.on('connect_error',()=>setStatus('connecting','СЕРВЕР НЕДОСТУПЕН · ПОВТОРЯЕМ…'));
 socket.on('zone:roster',renderRoster);
 socket.on('zone:player-joined',player=>{const current=Array.from(list?.querySelectorAll('.item')||[]);socket.emit('zone:request-roster');});
 socket.on('zone:player-left',()=>{ /* roster refreshed on next join; no stale player is used for gameplay */ });
 let lastLocation='';setInterval(()=>{if(!socket.connected)return;const g=readSave();const location=String(g.loc||'cordon');if(location!==lastLocation){lastLocation=location;socket.emit('zone:move',{location});}},3000);
})();
