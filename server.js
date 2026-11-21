const express = require('express');
const http = require('http');
const path = require('path');
const crypto = require('crypto');
const { Server } = require('socket.io');
const {
  LOCATIONS, FACTIONS, TERRITORY_START, NPC_HOME, TRADE_ITEM_IDS, SHOP, SELL_VALUES,
  COOP_TEMPLATES, ZONE_EVENTS
} = require('./src/shared/game-data');
const { clean, validId, createSafeState } = require('./src/server/validation');
const safeState = createSafeState(FACTIONS, LOCATIONS);
const { createMoveOrder, advanceMoveOrder } = require('./src/systems/player-orders');
const { createExpedition, advanceExpedition, findRoute } = require('./src/systems/expedition');
const { initSharedWorld, initDiplomacy } = require('./src/server/world');
const { WAR_CONFIG, createOperation, deploymentPower, addDeployment, resolveOperation } = require('./src/systems/war');
const { tickNpcWorld, interactWithNpc, isHostileFaction } = require('./src/systems/npc-ai');
const { ensureOnlineWorld, appendWorldEvent, buildWorldSync, publicWorldStatus } = require('./src/systems/online-world');
const { initEcosystem, tickEcosystem, upgradeBase, createClan, joinClan, addEcoEvent } = require('./src/systems/ecosystem');
const { initSouls, tickSouls } = require('./src/systems/souls');

const online = new Map();
const recentChat = [];
let pool = null;
let dbReady = false;
let dbInitialization = Promise.resolve();
let world = { diplomacy: {}, events: [], revision: 1, npcPositions: {}, coOpQuests: [], discoveredPoints: {}, zoneEvents: [], warOperations: [], warHistory: [], eventLog: [] };
let npcTickRunning = false;

const NPC_RICH_TRADERS = new Set(['sid','barman','scout','prof','scientist','beard']);
const NPC_STARTING_STOCK = Object.freeze(Object.keys(SHOP).slice(0, 18));
function npcEconomyFor(npc) {
  world.npcEconomy ||= {};
  const id=String(npc.id);
  let account=world.npcEconomy[id];
  if(!account) {
    account={
      balance:NPC_RICH_TRADERS.has(id)||String(npc.role||'').toLowerCase().includes('торгов')?10000000:5000,
      stock:Object.fromEntries(NPC_STARTING_STOCK.map(item=>[item,Math.max(1,(SHOP[item]?.qty||1)*3)])),
      maxStock:Object.fromEntries(NPC_STARTING_STOCK.map(item=>[item,Math.max(3,(SHOP[item]?.qty||1)*10)])),
      restockedAt:Date.now(),
      history:[]
    };
    world.npcEconomy[id]=account;
  }
  account.balance=Math.max(0,Math.min(999999999,Math.floor(Number(account.balance)||0)));
  account.stock ||= {};
  account.maxStock ||= {};
  account.history ||= [];
  const now=Date.now(), elapsed=now-(Number(account.restockedAt)||now);
  if(elapsed>=300000) {
    const cycles=Math.min(12,Math.floor(elapsed/300000));
    for(const item of Object.keys(account.stock)) {
      if(!SHOP[item])continue;
      const max=Math.max(1,Math.min(99,Number(account.maxStock[item])||((SHOP[item].qty||1)*10)));
      account.stock[item]=Math.min(max,Math.max(0,Number(account.stock[item])||0)+cycles*(SHOP[item].qty||1));
    }
    account.restockedAt=now;
  }
  return account;
}
function recordNpcTrade(account, entry) {
  account.history.unshift({...entry,at:Date.now()});
  account.history=account.history.slice(0,30);
}


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, methods: ['GET','POST'] },
  // Keep the original single-connection transport. Render supports WebSockets;
  // polling can fail when successive requests are routed to different instances.
  transports: ['websocket','polling'],
  allowUpgrades: true,
  pingInterval: 20000,
  pingTimeout: 45000,
  connectTimeout: 30000,
  maxHttpBufferSize: 1e6
});
io.engine.on('connection', rawSocket=>{
  console.info(`[engine] handshake id=${rawSocket.id} transport=${rawSocket.transport.name} origin=${clean(rawSocket.request.headers.origin||'unknown',180)}`);
  rawSocket.on('error', error=>console.error(`[engine] socket_error id=${rawSocket.id} transport=${rawSocket.transport.name}: ${clean(error?.message||error,240)}`));
  rawSocket.on('close', (reason, description)=>console.warn(`[engine] socket_closed id=${rawSocket.id} transport=${rawSocket.transport.name} reason=${clean(reason,120)} detail=${clean(description?.message||'',200)}`));
});
io.engine.on('connection_error', error=>console.error(`[engine] connection_error code=${error.code} message=${error.message} context=${JSON.stringify(error.context||{})}`));
const PORT = process.env.PORT || 3000;
const SECTOR_COORDS = Object.freeze({chaes:[503,104],zaton:[561,405],pripyat:[676,649],jupiter:[391,703],limansk:[128,838],red:[311,903],radar:[675,897],army:[502,1046],wild:[347,1212],bar:[441,1215],yantar:[174,1302],dump:[466,1470],agro:[243,1528],dark:[787,1418],cordon:[463,1753],swamps:[185,1788],darkhollow:[793,1742]});
const SPAWN_BY_FACTION = Object.freeze({'Одиночки':'cordon','Долг':'bar','Свобода':'army','Бандиты':'dump','Военные':'agro','Учёные':'yantar','Наёмники':'limansk','Монолит':'radar','Чистое небо':'swamps'});
app.use(express.json({limit:'64kb'}));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req,res) => { res.set('Access-Control-Allow-Origin','*'); res.set('Cache-Control','no-store'); res.status(200).json({ ok:true, service:'ZONE ONLINE', version:require('./package.json').version, database:dbReady?'postgres':'memory-fallback', databaseRequiredForAccounts:false, online:online.size, revision:world.revision||1, timestamp:Date.now() }); });
app.get('/api/diagnostics', (_req,res) => { res.set('Access-Control-Allow-Origin','*'); res.set('Cache-Control','no-store'); res.json({ ok:true, version:require('./package.json').version, multiplayer:true, guestMode:true, database:dbReady?'postgres':'memory-fallback', online:online.size, socketPath:'/socket.io', transports:['websocket','polling'], transportMode:'websocket-first-with-polling-fallback', node:process.version, nodeMajor:Number(process.versions.node.split('.')[0]), timestamp:Date.now() }); });
app.get('/api/status', (_req,res) => res.json({ ...publicWorldStatus(world, online.size), persistent:dbReady, service:`ZONE ONLINE ${require('./package.json').version} SURVIVAL & EXPEDITIONS` }));
app.get('/api/leaderboard', (_req,res) => { res.set('Cache-Control','no-store'); res.json({ok:true,updatedAt:Date.now(),entries:buildStalkerLeaderboard(),hallOfFame:(world.stalkerHallOfFame||[]).slice(0,100),news:(world.stalkerNews||[]).slice(0,40)}); });
app.get('/api/world/snapshot', (_req,res) => res.json({ status:publicWorldStatus(world, online.size), world }));
app.get('/api/world/events', (req,res) => { const since=Number(req.query.since||0); const sync=buildWorldSync(world, Number.isSafeInteger(since)?since:0); res.json(sync); });

function publicPlayer(p){ return { id:p.id, name:p.name, faction:p.faction, location:p.location, x:p.x, y:p.y, hp:p.hp, xp:p.xp, joinedAt:p.joinedAt, lastSeen:p.lastSeen }; }
function onlineList(){ return [...online.values()].map(publicPlayer).sort((a,b)=>a.name.localeCompare(b.name,'ru')); }
function stalkerAchievements(row){
  const out=[];const kills=Number(row.kills)||0,xp=Number(row.xp)||0,discoveries=Number(row.discoveries)||0,quests=Number(row.quests)||0,travelled=Number(row.travelled)||0,mutantHunts=Number(row.mutantHunts)||0,artifacts=Number(row.artifacts)||0;
  if(kills>=1)out.push('Первая победа');if(kills>=10)out.push('Охотник');if(kills>=50)out.push('Гроза Зоны');if(kills>=100)out.push('Легендарный боец');
  if(discoveries>=5)out.push('Следопыт');if(discoveries>=25)out.push('Исследователь');if(quests>=10)out.push('Надёжный исполнитель');if(travelled>=10)out.push('Странник');if(mutantHunts>=5)out.push('Охотник на мутантов');if(artifacts>=10)out.push('Искатель артефактов');if(xp>=1000)out.push('Закалённый');
  return out;
}
function addStalkerNews(text, name='Зона'){
  world.stalkerNews ||= [];world.stalkerNews.unshift({id:crypto.randomUUID(),text:clean(text,240),name,at:Date.now()});world.stalkerNews=world.stalkerNews.slice(0,40);
}
function archiveFallenStalkers(){
  world.stalkerLeaderboard ||= {};world.stalkerHallOfFame ||= [];
  for(const npc of Object.values(world.npcState||{})){
    if(npc.alive!==false||npc.leaderboardArchived)continue;
    const id=`npc:${npc.id}`,row=world.stalkerLeaderboard[id];
    const entry={id,name:npc.name||row?.name||'Неизвестный сталкер',faction:npc.faction||row?.faction||'Неизвестно',role:npc.role||'сталкер',kills:Number(npc.combatKills)||Number(row?.kills)||0,deaths:(Number(npc.combatDeaths)||0)+1,score:Number(row?.score)||100,location:npc.location||'Неизвестно',cause:npc.deathCause||'погиб в Зоне',diedAt:Number(npc.diedAt)||Date.now(),lastVictim:npc.lastVictim||null};
    world.stalkerHallOfFame.unshift(entry);world.stalkerHallOfFame=world.stalkerHallOfFame.slice(0,100);npc.leaderboardArchived=true;
    if(row){row.alive=false;row.deaths=entry.deaths;row.diedAt=entry.diedAt;row.deathCause=entry.cause;}
    addStalkerNews(`${entry.name} выбыл из рейтинга. ${entry.cause}.`,entry.name);
  }
}
function buildStalkerLeaderboard(){
  world.stalkerLeaderboard ||= {};archiveFallenStalkers();
  for(const npc of Object.values(world.npcState||{})){
    if(npc.alive===false)continue;
    const id=`npc:${npc.id}`;
    const row=world.stalkerLeaderboard[id] ||= {id,type:'npc',name:npc.name,faction:npc.faction||'Одиночки',role:npc.role||'сталкер',kills:0,deaths:0,score:100,location:npc.location||'Неизвестно',updatedAt:Date.now()};
    row.name=npc.name||row.name;row.faction=npc.faction||row.faction;row.role=npc.role||row.role;row.location=npc.location||row.location;row.alive=true;
    row.kills=Math.max(Number(row.kills)||0,Number(npc.combatKills)||0);row.deaths=Number(npc.combatDeaths)||Number(row.deaths)||0;
    row.score=Math.max(100,100+row.kills*125+Math.max(0,Number(npc.reputation)||0)*2);row.achievements=stalkerAchievements(row);row.updatedAt=Date.now();
  }
  for(const p of online.values()){
    const id=`player:${p.id}`,st=safeState(p.state).state,career=st.careerStats||{};
    const row=world.stalkerLeaderboard[id] ||= {id,type:'player',playerId:p.id,name:p.name,faction:p.faction||'Одиночки',role:'сталкер',kills:0,deaths:0,score:100,location:p.location||'Неизвестно',updatedAt:Date.now()};
    row.name=p.name||row.name;row.faction=p.faction||row.faction;row.location=p.location||row.location;row.alive=true;
    row.kills=Math.max(Number(row.kills)||0,Number(career.kills)||0);row.xp=Number(p.xp)||0;row.discoveries=Number(career.discoveries)||0;row.travelled=Number(career.travelled)||0;row.quests=(st.quests||[]).filter(q=>q.done).length;
    row.reputation=Number(st.rep)||0;row.mutantHunts=Number(career.mutantHunts)||0;row.artifacts=(st.items||[]).filter(x=>x.type==='Артефакт').reduce((sum,x)=>sum+(Number(x.qty)||0),0);row.score=100+row.kills*150+Math.min(800,Math.floor(row.xp/10))+row.discoveries*18+row.quests*25+row.travelled*8+row.mutantHunts*20+row.artifacts*12+Math.max(-100,Math.min(100,row.reputation));row.achievements=stalkerAchievements(row);row.updatedAt=Date.now();
  }
  const rows=Object.values(world.stalkerLeaderboard).filter(row=>row.alive!==false).map(row=>({...row,score:Math.max(0,Math.floor(Number(row.score)||0)),kills:Math.max(0,Math.floor(Number(row.kills)||0)),deaths:Math.max(0,Math.floor(Number(row.deaths)||0))}));
  return rows.sort((a,b)=>b.score-a.score||b.kills-a.kills||a.name.localeCompare(b.name,'ru')).slice(0,20).map((row,index)=>({...row,place:index+1}));
}
function leaderboardPayload(){return {updatedAt:Date.now(),entries:buildStalkerLeaderboard(),hallOfFame:(world.stalkerHallOfFame||[]).slice(0,100),news:(world.stalkerNews||[]).slice(0,40)};}
function recordStalkerKill(player,npc){
  world.stalkerLeaderboard ||= {};const id=`player:${player.id}`;
  const row=world.stalkerLeaderboard[id] ||= {id,type:'player',playerId:player.id,name:player.name,faction:player.faction,role:'сталкер',kills:0,deaths:0,score:100,location:player.location};
  row.name=player.name;row.faction=player.faction;row.location=player.location;row.kills=(Number(row.kills)||0)+1;row.score=100+row.kills*150+Math.min(800,Math.floor((Number(player.xp)||0)/10));row.lastKillAt=Date.now();row.lastVictim=npc.name;row.updatedAt=Date.now();
  addStalkerNews(`${player.name} одержал победу над ${npc.name}.`,player.name);
}

function publicNpcRoster(){
  const fields=['id','name','faction','role','location','alive','generated','supportSpecialist','icon','personality','mood','action','behavior','duty','guardPost','homeLocation','health','morale','supplies','biography','friends','rivals','squadId','squadName','dialogueVersion','dialogue','relationships','equipment'];
  return Object.fromEntries(Object.entries(world.npcState||{}).map(([id,n])=>[id,Object.fromEntries(fields.filter(k=>n[k]!==undefined).map(k=>[k,n[k]]))]));
}
function publicWorldSnapshot(){const {npcState,npcEvents,...snapshot}=world;return snapshot;}
function emitNpcState(target=io){target.emit('world:npc-state',{npcs:publicNpcRoster(),events:(world.npcEvents||[]).slice(-20),squads:world.npcSquads||[],memorial:world.npcMemorial||[],battlefronts:world.battlefronts||[],convoys:world.convoys||[],factionBases:world.factionBases||[],frontlineOrders:world.frontlineOrders||[]});}
function broadcastOnline(){ io.emit('world:players',onlineList()); }
function systemMessage(text){ const m={id:crypto.randomUUID(),system:true,name:'Система',text:clean(text,240),time:Date.now()}; recentChat.push(m); if(recentChat.length>80)recentChat.shift(); io.emit('world:chat',m); }
initDiplomacy(world, FACTIONS); initSharedWorld(world, NPC_HOME, LOCATIONS, COOP_TEMPLATES); initSouls(world); ensureOnlineWorld(world);
async function initDb(){
  if(!process.env.DATABASE_URL){ console.warn('DATABASE_URL missing: guest multiplayer is active in memory mode; server-side saves reset on restart.'); return; }
  try {
    const { Pool } = require('pg');
    pool = new Pool({ connectionString:process.env.DATABASE_URL, ssl:process.env.DATABASE_URL.includes('localhost')?false:{rejectUnauthorized:false}, max:10, idleTimeoutMillis:30000, connectionTimeoutMillis:8000, query_timeout:8000, statement_timeout:8000 });
    await pool.query(`CREATE TABLE IF NOT EXISTS zone_players (id TEXT PRIMARY KEY, state JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    await pool.query(`CREATE TABLE IF NOT EXISTS zone_world (id INTEGER PRIMARY KEY CHECK (id=1), state JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    await pool.query(`CREATE TABLE IF NOT EXISTS zone_chat (id BIGSERIAL PRIMARY KEY, payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    await pool.query(`CREATE TABLE IF NOT EXISTS zone_private_messages (id BIGSERIAL PRIMARY KEY, message_id TEXT UNIQUE NOT NULL, from_id TEXT NOT NULL, to_id TEXT NOT NULL, payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    await pool.query(`CREATE INDEX IF NOT EXISTS zone_private_messages_pair_idx ON zone_private_messages(from_id,to_id,id DESC)`);
    const wr=await pool.query('SELECT state FROM zone_world WHERE id=1');
    if(wr.rows[0]) world={...world,...wr.rows[0].state}; else await pool.query('INSERT INTO zone_world(id,state) VALUES(1,$1)',[world]);
    const cr=await pool.query('SELECT payload FROM zone_chat ORDER BY id DESC LIMIT 60');
    recentChat.push(...cr.rows.reverse().map(x=>x.payload)); initDiplomacy(world, FACTIONS); initSharedWorld(world, NPC_HOME, LOCATIONS, COOP_TEMPLATES); initSouls(world); ensureOnlineWorld(world); dbReady=true;
    console.log('PostgreSQL connected; shared world persistence enabled.');
  } catch(e){ console.error('PostgreSQL initialization failed; server will continue in memory mode:',e.message); pool=null; dbReady=false; }
}
async function dbFallback(error, operation){
  console.error(`PostgreSQL ${operation} failed; continuing in memory mode:`, error.message);
  dbReady=false;
  if(pool){ try{ await pool.end(); }catch{} }
  pool=null;
}
async function persistPlayer(id,state){ if(!pool)return; try{await pool.query('INSERT INTO zone_players(id,state,updated_at) VALUES($1,$2,NOW()) ON CONFLICT(id) DO UPDATE SET state=EXCLUDED.state,updated_at=NOW()',[id,state]);}catch(e){await dbFallback(e,'player save');} }
async function loadPlayer(id){ if(!pool)return null; try{const r=await pool.query('SELECT state FROM zone_players WHERE id=$1',[id]);return r.rows[0]?.state||null;}catch(e){await dbFallback(e,'player load');return null;} }
async function persistWorld(){ if(!pool)return; try{await pool.query('INSERT INTO zone_world(id,state,updated_at) VALUES(1,$1,NOW()) ON CONFLICT(id) DO UPDATE SET state=EXCLUDED.state,updated_at=NOW()',[world]);}catch(e){await dbFallback(e,'world save');} }
async function persistPrivateMessage(m){ if(!pool)return; try{await pool.query('INSERT INTO zone_private_messages(message_id,from_id,to_id,payload) VALUES($1,$2,$3,$4) ON CONFLICT(message_id) DO NOTHING',[m.id,m.fromId,m.toId,m]);}catch(e){await dbFallback(e,'private message save');} }
async function loadPrivateMessages(a,b){ if(!pool)return []; try{const r=await pool.query('SELECT payload FROM zone_private_messages WHERE (from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1) ORDER BY id DESC LIMIT 80',[a,b]);return r.rows.reverse().map(x=>x.payload);}catch(e){await dbFallback(e,'private message load');return [];}}
async function persistChat(m){ if(!pool)return; try{await pool.query('INSERT INTO zone_chat(payload) VALUES($1)',[m]);await pool.query('DELETE FROM zone_chat WHERE id NOT IN (SELECT id FROM zone_chat ORDER BY id DESC LIMIT 300)');}catch(e){await dbFallback(e,'chat save');} }


const SQUAD_ROLES = new Set(['leader','scout','medic','rifleman','technician']);
function squadOf(playerId){ return Object.values(world.playerSquads||{}).find(q=>(q.members||[]).some(m=>m.id===playerId))||null; }
function squadJournal(q,type,text,extra={}){ q.journal ||= []; q.journal.unshift({id:crypto.randomUUID(),type,text:clean(text,220),at:Date.now(),...extra}); q.journal=q.journal.slice(0,40); }
function publishSquad(q){ if(!q)return; for(const m of q.members||[])io.to(m.id).emit('squad:state',{squad:q}); }
function publishSquadMove(q,from,to,leader){
  q.location=to; squadJournal(q,'move',`${leader} повёл отряд из сектора ${from} в сектор ${to}.`);
  if(q.escortNpcId){const escort=world.npcState?.[q.escortNpcId];if(escort&&escort.alive!==false){escort.location=to;world.npcPositions ||= {};world.npcPositions[escort.id]=to;io.emit('world:npcs',world.npcPositions);emitNpcState();squadJournal(q,'escort_move',`${escort.name} продолжает идти вместе с отрядом.`);}else q.escortNpcId=null;}
  for(const m of q.members||[]){ const member=online.get(m.id); if(!member)continue; const old=member.location; member.location=to;
    const st=safeState(member.state); st.state.loc=to; member.state=st.state; const memberSocket=member.socketId&&io.sockets.sockets.get(member.socketId); if(memberSocket){memberSocket.leave(`location:${old}`);memberSocket.join(`location:${to}`);memberSocket.emit('world:chat:history',recentChat.filter(m=>!m.location||m.location===to).slice(-60));} persistPlayer(member.id,member.state).catch(()=>{});
    io.to(member.id).emit('squad:travelled',{location:to,from:old,leader:leader,squad:q});
  }
  publishSquad(q); broadcastOnline();
  const rivals=Object.values(world.playerSquads||{}).filter(other=>other.id!==q.id&&other.location===to&&(other.members||[]).some(m=>online.has(m.id)));
  for(const other of rivals){ const last=Math.max(q.lastEncounterAt||0,other.lastEncounterAt||0); if(Date.now()-last<120000)continue; q.lastEncounterAt=other.lastEncounterAt=Date.now(); const hostile=(q.members[0]?.faction||'')!==(other.members[0]?.faction||'');
    const event={id:crypto.randomUUID(),location:to,at:Date.now(),hostile,groups:[q.name,other.name],text:hostile?`В секторе ${to} замечен чужой отряд «${other.name}». Бойцы держат оружие наготове.`:`В секторе ${to} встретился отряд «${other.name}». Сталкеры оценивают друг друга.`};
    squadJournal(q,'encounter',event.text); squadJournal(other,'encounter',event.text);
    for(const group of [q,other])for(const m of group.members||[])io.to(m.id).emit('squad:encounter',event);
    publishSquad(q);publishSquad(other);
  }
}

io.on('connection', socket=>{
  console.info(`[socket] connected id=${socket.id} transport=${socket.conn.transport.name} origin=${clean(socket.handshake.headers.origin||'unknown',180)}`);
  socket.conn.on('upgrade', transport=>console.info(`[socket] upgraded id=${socket.id} transport=${transport.name}`));
  socket.on('error', error=>console.warn(`[socket] error id=${socket.id}:`,clean(error?.message||error,240)));
  socket.on('player:hello', async (payload, ack)=>{
    const helloStartedAt=Date.now();
    console.info(`[socket] player:hello received id=${socket.id} transport=${socket.conn.transport.name}`);
    try {
      // The HTTP health endpoint is available immediately, but player profile
      // loading waits for the one-time DB bootstrap to finish (or fall back).
      await dbInitialization;
      // guest identity mode: account registration/login has been removed. Every connection is a guest
      // identified by a browser-generated UUID; no token or database lookup is required.
      const id=validId(payload?.id)?String(payload.id):crypto.randomUUID();
      let saved=await loadPlayer(id);
      const pendingNewCharacter=payload?.state?.characterCreated===true&&saved?.characterCreated!==true;
      if((!saved||pendingNewCharacter) && payload?.state) { saved=safeState(payload.state).state; await persistPlayer(id,saved); }
      const s=safeState(saved||payload?.state);
      // Never reattach an unvalidated database record after normalizing it.
      if(saved) await persistPlayer(id,s.state);
      const spawnPoint=SECTOR_COORDS[s.loc]||SECTOR_COORDS.cordon;const savedPos=s.state?.worldPosition;const p={ id, name:s.name, faction:s.faction, location:s.loc, x:Number.isFinite(Number(savedPos?.x))?Math.max(0,Math.min(1000,Number(savedPos.x))):spawnPoint[0], y:Number.isFinite(Number(savedPos?.y))?Math.max(0,Math.min(2000,Number(savedPos.y))):spawnPoint[1], hp:s.hp, xp:s.xp, joinedAt:Date.now(), lastSeen:Date.now(), state:s.state, moveOrder:null, travelEncounter:null };
      // Publish the new owner before closing an older tab/session. The old
      // disconnect handler checks socketId and must never remove the new session.
      const previous=online.get(id);
      socket.data.playerId=id; socket.data.name=p.name; p.socketId=socket.id; online.set(id,p);
      if(previous?.socketId&&previous.socketId!==socket.id){
        const oldSocket=io.sockets.sockets.get(previous.socketId);
        if(oldSocket){oldSocket.data.supersededBy=socket.id;oldSocket.disconnect(true);}
      }
      socket.join('zone-world'); socket.join(id); socket.join(`location:${p.location}`); socket.join(`faction:${p.faction}`);
      world.onlineMetrics ||= { totalJoins:0, totalMoves:0, lastTickAt:0 }; world.onlineMetrics.totalJoins += 1;
      const joinEvent = appendWorldEvent(world, 'player_joined', { player:publicPlayer(p) });
      // Acknowledge after registration but BEFORE the world snapshot, so clients
      // receive the small acknowledgement without waiting for a large NPC payload.
      if(typeof ack==='function'){ack({ok:true,accepted:true,persistent:dbReady});console.info(`[socket] player:hello ack sent id=${socket.id}`);}
      socket.emit('player:ready',{id, savedState:s.state, guest:true, world:publicWorldSnapshot(), worldSync:buildWorldSync(world, Number(payload?.lastRevision)||0), status:publicWorldStatus(world,online.size), chat:recentChat.filter(m=>!m.location||m.location===p.location).slice(-60), players:onlineList(), leaderboard:leaderboardPayload(), position:{x:p.x,y:p.y}, persistent:dbReady});
      console.log(`player:hello completed for ${id} in ${Date.now()-helloStartedAt}ms (db=${dbReady?'postgres':'memory-fallback'})`);
      socket.to('zone-world').emit('world:event',joinEvent);
      io.emit('world:npcs',world.npcPositions); emitNpcState(); io.emit('world:ecosystem',world.ecosystem); io.emit('world:coop',world.coOpQuests); io.emit('war:state',{operations:world.warOperations||[],history:(world.warHistory||[]).slice(0,12)});
      systemMessage(`${p.name} вошёл в Зону.`); broadcastOnline(); persistWorld().catch(e=>console.error('join persistence:',e.message));
    } catch(e){
      console.error(`[socket] player:hello failed id=${socket.id} after ${Date.now()-helloStartedAt}ms:`,e);
      const message='Сервер принял соединение, но не смог загрузить профиль. Проверь журнал Render.';
      socket.emit('player:hello:error',{message,detail:clean(e?.message||'unknown',180)});
      if(typeof ack==='function')ack({ok:false,message,detail:clean(e?.message||'unknown',180)});
    }
  });
  socket.on('player:save', async input=>{
    const id=socket.data.playerId, p=online.get(id); if(!id||!p)return;
    const s=safeState(input); const previousLocation=p.location, previousFaction=p.faction; const squad=squadOf(id); const firstCharacter=!p.state?.characterCreated&&s.state?.characterCreated===true; if(p.state?.characterCreated&&!firstCharacter){s.state.faction=p.faction;s.faction=p.faction;} if(firstCharacter){const spawn=SPAWN_BY_FACTION[s.faction]||'cordon';s.state.loc=spawn;s.state.visitedLocations=[...new Set([...(s.state.visitedLocations||[]),spawn])];s.loc=spawn;const spawnPoint=SECTOR_COORDS[spawn]||SECTOR_COORDS.cordon;p.x=spawnPoint[0];p.y=spawnPoint[1];s.state.worldPosition={x:p.x,y:p.y};s.state.mapCoordinateVersion=2;} if(squad&&squad.leader!==id&&s.loc!==squad.location)s.state.loc=squad.location; p.name=s.name;p.faction=s.faction;p.location=squad&&squad.leader!==id?squad.location:s.loc;p.x=Number.isFinite(Number(s.state?.worldPosition?.x))?Math.max(0,Math.min(1000,Math.round(Number(s.state.worldPosition.x)))):p.x;p.y=Number.isFinite(Number(s.state?.worldPosition?.y))?Math.max(0,Math.min(2000,Math.round(Number(s.state.worldPosition.y)))):p.y;p.hp=s.hp;p.xp=s.xp;p.lastSeen=Date.now();p.state=s.state;socket.data.name=s.name; if(previousLocation!==p.location){socket.leave(`location:${previousLocation}`);socket.join(`location:${p.location}`);socket.emit('world:chat:history',recentChat.filter(m=>!m.location||m.location===p.location).slice(-60));} if(previousFaction!==p.faction){socket.leave(`faction:${previousFaction}`);socket.join(`faction:${p.faction}`);}
    try{ await persistPlayer(id,s.state); }catch(e){socket.emit('server:error',{message:'Не удалось сохранить профиль на сервере.'});console.error(e);}
    if(previousLocation!==p.location){ world.onlineMetrics ||= {totalJoins:0,totalMoves:0,lastTickAt:0}; world.onlineMetrics.totalMoves+=1; const ev=appendWorldEvent(world,'player_moved',{playerId:id,name:p.name,faction:p.faction,from:previousLocation,to:p.location}); io.to('zone-world').emit('world:event',ev); if(squad&&squad.leader===id)publishSquadMove(squad,previousLocation,p.location,p.name); await persistWorld(); }
    if(firstCharacter)socket.emit('player:spawned',{state:p.state,location:p.location});
    broadcastOnline();
  });
  socket.on('player:update', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    const oldLocation=p.location, oldFaction=p.faction; const squad=squadOf(p.id);
    if(LOCATIONS.has(input?.location)){ if(squad&&squad.leader!==p.id&&input.location!==squad.location){socket.emit('squad:result',{ok:false,message:'Отрядом управляет лидер. Покинь отряд, чтобы идти отдельно.'});p.location=squad.location;}else p.location=input.location; }
    if(!p.state?.characterCreated&&FACTIONS.has(input?.faction))p.faction=input.faction;
    if(input?.name)p.name=clean(input.name,24)||p.name;
    if(oldLocation!==p.location){socket.leave(`location:${oldLocation}`);socket.join(`location:${p.location}`);socket.emit('world:chat:history',recentChat.filter(m=>!m.location||m.location===p.location).slice(-60));} if(oldFaction!==p.faction){socket.leave(`faction:${oldFaction}`);socket.join(`faction:${p.faction}`);}
    p.lastSeen=Date.now();
    if(oldLocation!==p.location || oldFaction!==p.faction){
      world.onlineMetrics ||= {totalJoins:0,totalMoves:0,lastTickAt:0};
      if(oldLocation!==p.location)world.onlineMetrics.totalMoves+=1;
      const ev=appendWorldEvent(world,'player_state_changed',{player:publicPlayer(p),from:{location:oldLocation,faction:oldFaction}});
      io.to('zone-world').emit('world:event',ev); if(oldLocation!==p.location&&squad&&squad.leader===p.id)publishSquadMove(squad,oldLocation,p.location,p.name); persistWorld().catch(e=>console.error('player state persistence:',e.message));
    }
    broadcastOnline();
  });
  socket.on('player:position', ()=>{ /* Position is server-authoritative in 4.22; legacy client writes are ignored. */ });
  socket.on('player:expedition-order', input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    if(!LOCATIONS.has(input?.destination)){socket.emit('player:expedition-result',{ok:false,message:'Неизвестная локация назначения.'});return;}
    const squad=squadOf(p.id);if(squad&&squad.leader!==p.id){socket.emit('player:expedition-result',{ok:false,message:'Маршрутом отряда управляет командир.'});return;}
    const result=createExpedition(p,input.destination,['safe','fast','balanced'].includes(input?.mode)?input.mode:'safe');
    if(!result.ok){socket.emit('player:expedition-result',result);return;}
    p.expedition=result.expedition;p.moveOrder=null;p.travelEncounter=null;
    socket.emit('player:expedition-result',{ok:true,message:'Экспедиция началась. КПК будет сообщать о переходах между секторами.',expedition:p.expedition});
  });
  socket.on('player:expedition-cancel',()=>{const p=online.get(socket.data.playerId);if(!p)return;p.expedition=null;socket.emit('player:expedition-result',{ok:true,message:'Экспедиция отменена.'});});
  socket.on('player:move-order', input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    if(input?.location!==p.location){socket.emit('player:move-result',{ok:false,message:'Маршрут должен начинаться в текущем секторе.'});return;}
    const center=SECTOR_COORDS[p.location]||SECTOR_COORDS.cordon;
    const tx=Number(input?.x),ty=Number(input?.y);
    if(!Number.isFinite(tx)||!Number.isFinite(ty)||Math.abs(tx-center[0])>255||Math.abs(ty-center[1])>255){socket.emit('player:move-result',{ok:false,message:'Точка находится за пределами доступной части сектора.'});return;}
    const result=createMoveOrder(p,{x:tx,y:ty},Date.now(),2.5);
    if(!result.ok){socket.emit('player:move-result',{ok:false,message:result.error});return;}
    p.moveOrder=result.order;p.travelEncounter=null;p.lastSeen=Date.now();
    const risk=({chaes:0.95,radar:0.85,pripyat:0.75,red:0.65,dark:0.6,dump:0.55,swamps:0.4,cordon:0.25,bar:0.2,yantar:0.3})[p.location]??0.35;
    p.moveOrder.encounterAt=Math.random()<(.04+risk*.13)?(.25+Math.random()*.5):null;
    socket.emit('player:move-result',{ok:true,message:'Приказ принят. Персонаж начал движение по маршруту.',order:{x:tx,y:ty,etaSeconds:Math.ceil(result.order.distance/result.order.speed)}});
  });
  socket.on('player:move-cancel',()=>{const p=online.get(socket.data.playerId);if(!p)return;p.moveOrder=null;p.travelEncounter=null;socket.emit('player:movement',{x:p.x,y:p.y,moving:false});socket.emit('player:move-result',{ok:true,message:'Приказ на движение отменён.'});});
  socket.on('player:travel-response',input=>{const p=online.get(socket.data.playerId);if(!p||(!p.travelEncounter&&p.expedition?.status!=='paused'))return;const action=['continue','fight'].includes(input?.action)?input.action:'retreat';p.travelEncounter=null;if(p.expedition?.status==='paused'){if(action==='continue')p.expedition.status='travelling';else p.expedition=null;}if(action!=='continue')p.moveOrder=null;else if(p.moveOrder)p.moveOrder.encounterChecked=true;socket.emit('player:move-result',{ok:true,message:action==='continue'?'Продолжаешь путь после опасной встречи.':action==='fight'?'Ты принимаешь бой. Маршрут приостановлен.':'Маршрут прерван. Персонаж отходит в безопасную точку.'});});
  socket.on('world:sync', input=>{
    if(!socket.data.playerId)return;
    socket.emit('world:sync',buildWorldSync(world,Number(input?.sinceRevision)||0));
  });
  socket.on('world:chat:send', async input=>{
    if(!socket.data.playerId)return;
    const text=clean(input?.text,240);if(!text)return;
    const p=online.get(socket.data.playerId);
    if(!p)return; const m={id:crypto.randomUUID(),name:p.name,faction:p.faction,location:p.location,text,time:Date.now()};
    recentChat.push(m);if(recentChat.length>300)recentChat.shift();io.to(`location:${p.location}`).emit('world:chat',m);
    try{await persistChat(m);}catch(e){console.error('chat persistence:',e.message);}
  });
  socket.on('dm:history', async input=>{
    const me=online.get(socket.data.playerId), targetId=String(input?.targetId||'').slice(0,64), target=online.get(targetId);
    if(!me||!target||me.id===targetId||me.location!==target.location){socket.emit('dm:error',{message:'Личный канал доступен только игрокам, находящимся в одном секторе.'});return;}
    const history=await loadPrivateMessages(me.id,targetId);socket.emit('dm:history',{targetId,history});
  });
  socket.on('dm:send', async input=>{
    const me=online.get(socket.data.playerId), targetId=String(input?.targetId||'').slice(0,64), target=online.get(targetId), text=clean(input?.text,500);
    if(!me||!target||me.id===targetId||me.location!==target.location){socket.emit('dm:error',{message:'Игрок должен находиться с тобой в одной локации.'});return;}
    if(!text){socket.emit('dm:error',{message:'Сообщение пустое.'});return;}
    const now=Date.now(), rate=socket.data.dmRate||{at:0,count:0};if(now-rate.at>10000){rate.at=now;rate.count=0;}rate.count++;socket.data.dmRate=rate;
    if(rate.count>8){socket.emit('dm:error',{message:'Слишком часто. Подожди несколько секунд.'});return;}
    const m={id:crypto.randomUUID(),fromId:me.id,toId:target.id,fromName:me.name,toName:target.name,text,time:now};
    await persistPrivateMessage(m);socket.emit('dm:message',m);io.to(target.id).emit('dm:message',m);
  });
  socket.on('npc:trade:buy', async input=>{
    const p=online.get(socket.data.playerId), npcId=String(input?.npcId||'').slice(0,48), itemId=String(input?.item||''), goods=SHOP[itemId];
    const npc=world.npcState?.[npcId], st=p?safeState(p.state):null;
    if(!p||!npc||npc.alive===false||npc.location!==p.location||!npc.dialogue||!goods){
      socket.emit('npc:trade:result',{ok:false,message:'Этот сталкер сейчас не может торговать или находится не рядом.'});return;
    }
    const account=npcEconomyFor(npc);account.stock[itemId]??=goods.qty*3;account.maxStock[itemId]??=goods.qty*10;const available=Math.max(0,Math.floor(Number(account.stock[itemId])||0));
    if(available<goods.qty){socket.emit('npc:trade:result',{ok:false,message:'У сталкера временно закончился этот товар. Запасы пополняются автоматически.',economy:{balance:account.balance,stock:account.stock}});return;}
    if(st.money<goods.price){socket.emit('npc:trade:result',{ok:false,message:'Недостаточно рублей.'});return;}
    // Buying transfers player money out of the player's wallet only.
    // The NPC's independent balance is intentionally not debited.
    st.state.money=st.money-goods.price;
    st.state.items ||= [];
    const existing=st.state.items.find(x=>x.id===itemId);
    if(existing)existing.qty+=goods.qty;
    else st.state.items.push({id:itemId,name:goods.name,type:goods.type,desc:goods.desc,weight:goods.weight,qty:goods.qty,value:goods.value});
    account.stock[itemId]=available-goods.qty;
    recordNpcTrade(account,{playerId:p.id,playerName:p.name,type:'buy_from_npc',item:itemId,qty:goods.qty,price:goods.price});
    p.state=st.state;await persistPlayer(p.id,p.state);await persistWorld();
    socket.emit('npc:trade:result',{ok:true,message:`${npc.name}: сделка состоялась. ${goods.name} передан тебе.`,state:p.state,economy:{balance:account.balance,stock:account.stock}});
  });
  socket.on('npc:trade:sell', async input=>{
    const p=online.get(socket.data.playerId),npcId=String(input?.npcId||'').slice(0,48),itemId=String(input?.item||''),qty=Math.max(1,Math.min(10,Math.floor(Number(input?.qty)||1)));
    const npc=world.npcState?.[npcId],st=p?safeState(p.state):null,base=SELL_VALUES[itemId];
    if(!p||!npc||npc.alive===false||npc.location!==p.location||!npc.dialogue||!base){socket.emit('npc:trade:result',{ok:false,message:'Этот сталкер не принимает такой предмет.'});return;}
    st.state.items ||= [];const item=st.state.items.find(x=>x.id===itemId);
    if(!item||item.qty<qty){socket.emit('npc:trade:result',{ok:false,message:'Недостаточно предметов для продажи.'});return;}
    const account=npcEconomyFor(npc),payout=Math.floor(base*.5)*qty;
    if(account.balance<payout){socket.emit('npc:trade:result',{ok:false,message:`У ${npc.name} недостаточно денег для этой покупки.`,economy:{balance:account.balance}});return;}
    item.qty-=qty;if(item.qty<=0)st.state.items=st.state.items.filter(x=>x.id!==itemId);
    account.balance=Math.max(0,account.balance-payout);
    st.state.money=Math.min(99999999,st.money+payout);
    recordNpcTrade(account,{playerId:p.id,playerName:p.name,type:'sell_to_npc',item:itemId,qty,price:payout});
    p.state=st.state;await persistPlayer(p.id,p.state);await persistWorld();
    socket.emit('npc:trade:result',{ok:true,message:`${npc.name}: забираю. Получено ${payout} ₽.`,state:p.state,economy:{balance:account.balance,stock:account.stock}});
  });
  socket.on('market:buy', async input=>{
    const p=online.get(socket.data.playerId), itemId=String(input?.item||''), goods=SHOP[itemId];
    if(!p||!goods){socket.emit('market:result',{ok:false,message:'Товар недоступен.'});return;}
    const st=safeState(p.state);if(st.money<goods.price){socket.emit('market:result',{ok:false,message:'Недостаточно рублей.'});return;}
    st.state.money=st.money-goods.price;st.state.items ||= [];
    const existing=st.state.items.find(x=>x.id===itemId);
    if(existing){existing.qty+=goods.qty;if(goods.defense){existing.defense=goods.defense;existing.condition=existing.condition??100;}}else st.state.items.push({id:itemId,name:itemId==='bolt'?'Болт':goods.name,type:goods.type,desc:goods.desc,weight:goods.weight,qty:goods.qty,value:goods.value,...(goods.defense?{defense:goods.defense,condition:100}:{})});
    p.state=st.state;await persistPlayer(p.id,p.state);socket.emit('market:result',{ok:true,message:`Куплено: ${goods.name}.`,state:p.state});
  });
  socket.on('market:sell', async input=>{
    const p=online.get(socket.data.playerId), itemId=String(input?.item||''), amount=Math.max(1,Math.min(99,Math.floor(Number(input?.qty)||1))), st=p?safeState(p.state):null;
    if(!p||!SELL_VALUES[itemId]){socket.emit('market:result',{ok:false,message:'Этот предмет нельзя продать.'});return;}
    st.state.items ||= [];const item=st.state.items.find(x=>x.id===itemId);
    if(!item||item.qty<amount){socket.emit('market:result',{ok:false,message:'Недостаточно предметов в рюкзаке.'});return;}
    item.qty-=amount;if(item.qty<=0)st.state.items=st.state.items.filter(x=>x.id!==itemId);
    const payout=Math.floor(SELL_VALUES[itemId]*.65)*amount;st.state.money=Math.min(99999999,(Number(st.state.money)||0)+payout);
    p.state=st.state;await persistPlayer(p.id,p.state);socket.emit('market:result',{ok:true,message:`Продано: ${item.name} ×${amount} · +${payout} ₽.`,state:p.state});
  });
  socket.on('market:deal', async input=>{
    const p=online.get(socket.data.playerId);
    if(!p){socket.emit('market:result',{ok:false,message:'Игрок не найден.'});return;}
    const rawBuy=Array.isArray(input?.buy)?input.buy:[], rawSell=Array.isArray(input?.sell)?input.sell:[];
    if(rawBuy.length>40||rawSell.length>40){socket.emit('market:result',{ok:false,message:'Слишком много позиций в сделке.'});return;}
    const combineRows=rows=>{const map=new Map();for(const row of rows){const id=String(row?.item||''),qty=Math.floor(Number(row?.qty)||0);map.set(id,(map.get(id)||0)+qty);}return [...map].map(([item,qty])=>({item,qty}));};
    const buy=combineRows(rawBuy),sell=combineRows(rawSell);
    const st=safeState(p.state);st.state.items ||= [];
    let cost=0,payout=0;
    const buyPlan=[],sellPlan=[];
    for(const row of buy){
      const id=String(row?.item||''),qty=Math.floor(Number(row?.qty)||0),goods=SHOP[id];
      if(!goods||qty<1||qty>20){socket.emit('market:result',{ok:false,message:'Некорректный товар в корзине.'});return;}
      cost+=goods.price*qty;buyPlan.push({id,qty,goods});
    }
    for(const row of sell){
      const id=String(row?.item||''),qty=Math.floor(Number(row?.qty)||0);
      if(!SELL_VALUES[id]||qty<1||qty>99){socket.emit('market:result',{ok:false,message:'Некорректный предмет для продажи.'});return;}
      const item=st.state.items.find(x=>x.id===id);
      if(!item||item.qty<qty){socket.emit('market:result',{ok:false,message:'Недостаточно предметов для продажи: '+id});return;}
      payout+=Math.floor(SELL_VALUES[id]*.65)*qty;sellPlan.push({id,qty});
    }
    if(st.money+ payout<cost){socket.emit('market:result',{ok:false,message:'Недостаточно рублей для сделки.'});return;}
    for(const row of sellPlan){
      const item=st.state.items.find(x=>x.id===row.id);item.qty-=row.qty;
      if(item.qty<=0)st.state.items=st.state.items.filter(x=>x.id!==row.id);
    }
    for(const row of buyPlan){
      const goods=row.goods,existing=st.state.items.find(x=>x.id===row.id);
      if(existing)existing.qty+=goods.qty*row.qty;
      else st.state.items.push({id:row.id,name:goods.name,type:goods.type,desc:goods.desc,weight:goods.weight,qty:goods.qty*row.qty,value:goods.value,...(goods.defense?{defense:goods.defense,condition:100}:{})});
    }
    st.state.money=Math.min(99999999,Math.max(0,st.money-cost+payout));
    p.state=st.state;await persistPlayer(p.id,p.state);
    socket.emit('market:result',{ok:true,message:`Сделка завершена. Покупка: ${cost} ₽, продажа: ${payout} ₽.`,state:p.state});
  });
  socket.on('trade:offer', async input=>{
    const fromId=socket.data.playerId, from=online.get(fromId), toId=String(input?.to||'');
    const to=online.get(toId), itemId=String(input?.item||''), qty=Math.floor(Number(input?.qty)||0), rawPrice=Number(input?.price), price=Number.isFinite(rawPrice)?Math.floor(rawPrice):-1;
    if(!from||!to||fromId===toId||!TRADE_ITEM_IDS.has(itemId)||qty<1||qty>99||price<0||price>1000000){socket.emit('trade:result',{ok:false,message:'Некорректное предложение обмена.'});return;}
    const a=safeState(from.state), item=a.state.items?.find(x=>x.id===itemId);
    if(!item||item.qty<qty){socket.emit('trade:result',{ok:false,message:'Недостаточно предметов в рюкзаке.'});return;}
    const offer={id:crypto.randomUUID(),from:fromId,to:toId,fromName:from.name,toName:to.name,item:itemId,itemName:item.name,qty,price,createdAt:Date.now()};
    world.events ||= []; world.events.push({type:'trade',offer}); world.events=world.events.slice(-100); const syncEvent=appendWorldEvent(world,'trade_offer',{offerId:offer.id,from:from.name,to:to.name,item:offer.item,qty:offer.qty,price:offer.price});
    to && io.to(toId).emit('trade:incoming',offer); socket.emit('trade:result',{ok:true,message:'Предложение отправлено.',offer}); io.emit('world:event',syncEvent); await persistWorld();
  });
  socket.on('trade:respond', async input=>{
    const toId=socket.data.playerId, offerId=String(input?.offerId||''), accept=!!input?.accept;
    const event=(world.events||[]).find(x=>x.type==='trade'&&x.offer?.id===offerId);
    const offer=event?.offer;
    if(!offer||offer.to!==toId||offer.status){socket.emit('trade:result',{ok:false,message:'Предложение уже недоступно.'});return;}
    const from=online.get(offer.from), to=online.get(toId);
    if(!from||!to){socket.emit('trade:result',{ok:false,message:'Один из игроков отключился.'});return;}
    if(!accept){offer.status='declined';const syncEvent=appendWorldEvent(world,'trade_declined',{offerId:offer.id,by:to.name});io.emit('world:event',syncEvent);io.to(offer.from).emit('trade:result',{ok:false,message:`${to.name} отклонил обмен.`});socket.emit('trade:result',{ok:true,message:'Обмен отклонён.'});await persistWorld();return;}
    offer.status='processing';
    try{
      if(!pool){offer.status=null;socket.emit('trade:result',{ok:false,message:'Для безопасного обмена требуется PostgreSQL на сервере.'});return;}
      const client=await pool.connect();
      try{
        await client.query('BEGIN');
        const rows=await client.query('SELECT id,state FROM zone_players WHERE id = ANY($1::text[]) FOR UPDATE',[[offer.from,offer.to]]);
        const states=new Map(rows.rows.map(r=>[r.id,r.state])); const fs=states.get(offer.from), ts=states.get(offer.to);
        if(!fs||!ts)throw new Error('Профиль игрока не найден.');
        fs.items ||= []; ts.items ||= []; const fi=(fs.items||[]).find(x=>x.id===offer.item); if(!fi||fi.qty<offer.qty)throw new Error('У отправителя больше нет нужного количества предметов.');
        if((Number(ts.money)||0)<offer.price)throw new Error('У покупателя недостаточно рублей.');
        fi.qty-=offer.qty; if(fi.qty===0)fs.items=fs.items.filter(x=>x!==fi);
        let ti=(ts.items||[]).find(x=>x.id===offer.item); if(ti)ti.qty+=offer.qty; else ts.items.push({...fi,qty:offer.qty});
        fs.money=(Number(fs.money)||0)+offer.price; ts.money=(Number(ts.money)||0)-offer.price;
        await client.query('UPDATE zone_players SET state=$2,updated_at=NOW() WHERE id=$1',[offer.from,fs]);
        await client.query('UPDATE zone_players SET state=$2,updated_at=NOW() WHERE id=$1',[offer.to,ts]);
        await client.query('COMMIT'); from.state=fs;to.state=ts; offer.status='accepted';
        socket.emit('trade:result',{ok:true,message:'Обмен завершён.',state:ts});io.to(offer.from).emit('trade:result',{ok:true,message:`${to.name} принял обмен.`,state:fs});
        const syncEvent=appendWorldEvent(world,'trade_completed',{offerId:offer.id,from:from.name,to:to.name,item:offer.item,qty:offer.qty,price:offer.price});io.emit('world:event',syncEvent);io.emit('world:trade',{offer,from:from.name,to:to.name}); persistWorld().catch(e=>console.error('trade offer persistence:',e.message));
      }catch(err){await client.query('ROLLBACK');throw err;}finally{client.release();}
    }catch(e){offer.status=null;socket.emit('trade:result',{ok:false,message:e.message||'Не удалось выполнить обмен.'});}
  });
  socket.on('coop:join', async input=>{
    const p=online.get(socket.data.playerId); if(!p)return;
    const q=(world.coOpQuests||[]).find(x=>x.id===String(input?.questId||''));
    if(!q||q.done){socket.emit('coop:result',{ok:false,message:'Задание недоступно.'});return;}
    if(!q.participants.includes(p.id)){q.participants.push(p.id);q.participants=q.participants.slice(0,10);}
    const syncEvent=appendWorldEvent(world,'coop_joined',{questId:q.id,playerId:p.id,name:p.name});io.emit('world:event',syncEvent);await persistWorld();io.emit('world:coop',world.coOpQuests);socket.emit('coop:result',{ok:true,message:'Ты записан в группу задания.'});
  });
  socket.on('coop:contribute', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    const q=(world.coOpQuests||[]).find(x=>x.id===String(input?.questId||''));
    if(!q||q.done||!q.participants.includes(p.id)||p.location!==q.location){socket.emit('coop:result',{ok:false,message:'Нужно вступить в группу и прибыть в указанный сектор.'});return;}
    q.arrivals ||= [];if(!q.arrivals.includes(p.id))q.arrivals.push(p.id);
    if(q.arrivals.length>=q.required){
      q.done=true; const winners=q.arrivals.slice();
      if(pool){
        const client=await pool.connect();
        try{await client.query('BEGIN');const rows=await client.query('SELECT id,state FROM zone_players WHERE id = ANY($1::text[]) FOR UPDATE',[winners]);
          for(const row of rows.rows){const st=safeState(row.state);st.state.money=Math.min(99999999,st.money+q.reward);st.state.xp=Math.min(1e7,st.xp+q.xp);await client.query('UPDATE zone_players SET state=$2,updated_at=NOW() WHERE id=$1',[row.id,st.state]);const pl=online.get(row.id);if(pl)pl.state=st.state;}
          await client.query('COMMIT');
        }catch(err){await client.query('ROLLBACK');q.done=false;throw err;}finally{client.release();}
      }else{for(const id of winners){const pl=online.get(id);if(pl){const st=safeState(pl.state);st.state.money+=q.reward;st.state.xp+=q.xp;pl.state=st.state;}}}
      for(const id of winners){const pl=online.get(id);if(pl)io.to(id).emit('coop:reward',{questId:q.id,reward:q.reward,xp:q.xp,state:pl.state});}
      systemMessage(`Совместное задание «${q.title}» выполнено.`);
    }
    const syncEvent=appendWorldEvent(world,'coop_progress',{questId:q.id,playerId:p.id,arrivals:q.arrivals.length,done:q.done});io.emit('world:event',syncEvent);await persistWorld();io.emit('world:coop',world.coOpQuests);socket.emit('coop:result',{ok:true,message:q.done?'Группа выполнила задание!':'Твоё прибытие отмечено.'});
  });
  socket.on('world:poi:discover', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    const location=String(input?.location||'');const id=clean(input?.id,80);const name=clean(input?.name,80);
    if(!LOCATIONS.has(location)||p.location!==location||!new RegExp('^'+location+'_poi_[0-9]+$').test(id))return;
    world.discoveredPoints ||= {};world.discoveredPoints[location] ||= [];
    if(!world.discoveredPoints[location].includes(id)){world.discoveredPoints[location].push(id);const syncEvent=appendWorldEvent(world,'poi_discovered',{playerId:p.id,location,id,name});await persistWorld();io.emit('world:event',syncEvent);io.emit('world:poi',world.discoveredPoints);systemMessage(`${p.name} обнаружил новую точку интереса: ${name} (${location}).`);}
  });
  socket.on('war:operation:create', async input=>{
    const p=online.get(socket.data.playerId); if(!p)return;
    const location=String(input?.location||'');
    if(!LOCATIONS.has(location)||p.location!==location){socket.emit('war:result',{ok:false,message:'Нужно находиться в секторе, где начинается операция.'});return;}
    world.territoryOwners ||= Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v])=>[id,v.owner]));
    world.territoryControl ||= Object.fromEntries(Object.entries(TERRITORY_START).map(([id,v])=>[id,v.control]));
    const owner=world.territoryOwners[location];
    if(!FACTIONS.has(owner)||owner===p.faction){socket.emit('war:result',{ok:false,message:'Нельзя объявить штурм собственной территории.'});return;}
    world.warOperations ||= [];
    if(world.warOperations.some(x=>x.location===location&&x.status==='active')){socket.emit('war:result',{ok:false,message:'В этом секторе уже идёт операция.'});return;}
    if(world.warOperations.filter(x=>x.status==='active').length>=WAR_CONFIG.maxActiveOperations){socket.emit('war:result',{ok:false,message:'Слишком много активных операций. Дождись завершения одной из них.'});return;}
    const st=safeState(p.state); if(st.money<WAR_CONFIG.operationCost){socket.emit('war:result',{ok:false,message:`Для организации операции нужно ${WAR_CONFIG.operationCost} ₽.`});return;}
    st.state.money=st.money-WAR_CONFIG.operationCost;p.state=st.state;await persistPlayer(p.id,p.state);
    const op=createOperation({id:crypto.randomUUID(),location,attacker:p.faction,defender:owner,createdBy:p.id,territoryControl:world.territoryControl[location]||50});
    world.warOperations.unshift(op);world.warOperations=world.warOperations.slice(0,20);const syncEvent=appendWorldEvent(world,'war_started',{operationId:op.id,location,attacker:p.faction,defender:owner,commander:p.name});
    await persistWorld();io.emit('world:event',syncEvent);io.emit('war:state',{operations:world.warOperations,history:world.warHistory||[]});io.emit('world:update',{world,notice:`В секторе ${location} группировка «${p.faction}» начала военную операцию против «${owner}».`});
    socket.emit('war:result',{ok:true,message:'Операция объявлена. Собирай бойцов и отдавай приказы.',state:p.state});
  });
  socket.on('war:operation:deploy', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    const op=(world.warOperations||[]).find(x=>x.id===String(input?.operationId||''));
    if(!op||op.status!=='active'||p.location!==op.location){socket.emit('war:result',{ok:false,message:'Операция недоступна или ты находишься в другом секторе.'});return;}
    const action=String(input?.action||'');
    if((action==='attack'&&p.faction!==op.attacker)||(action==='defend'&&p.faction!==op.defender)){socket.emit('war:result',{ok:false,message:'Твоя группировка не может выполнить этот приказ в данной операции.'});return;}
    const st=safeState(p.state);if(st.money<WAR_CONFIG.deploymentCost){socket.emit('war:result',{ok:false,message:`Для снабжения бойца нужно ${WAR_CONFIG.deploymentCost} ₽.`});return;}
    const power=deploymentPower({xp:st.xp,rep:st.rep,action});
    const result=addDeployment(op,{id:p.id,name:p.name,faction:p.faction},action,power);
    if(!result.ok){socket.emit('war:result',{ok:false,message:result.reason});return;}
    st.state.money=st.money-WAR_CONFIG.deploymentCost;p.state=st.state;await persistPlayer(p.id,p.state);
    const syncEvent=appendWorldEvent(world,'war_deployment',{operationId:op.id,playerId:p.id,action,power});await persistWorld();io.emit('world:event',syncEvent);io.emit('war:state',{operations:world.warOperations,history:world.warHistory||[]});socket.emit('war:result',{ok:true,message:`Приказ выполнен. Боевая сила отряда: +${power}.`,state:p.state});
  });
  socket.on('war:operation:resolve', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    const op=(world.warOperations||[]).find(x=>x.id===String(input?.operationId||''));
    if(!op||op.status!=='active'||op.createdBy!==p.id){socket.emit('war:result',{ok:false,message:'Завершить операцию может только её командир.'});return;}
    const result=resolveOperation(op);if(!result.ok){socket.emit('war:result',{ok:false,message:result.reason});return;}
    if(result.captured){world.territoryOwners ||= {};world.territoryOwners[op.location]=op.attacker;world.territoryControl ||= {};world.territoryControl[op.location]=55;}
    const record={id:op.id,location:op.location,attacker:op.attacker,defender:op.defender,winner:result.winner,captured:result.captured,at:Date.now()};
    world.warHistory ||= [];world.warHistory.unshift(record);world.warHistory=world.warHistory.slice(0,30);const syncEvent=appendWorldEvent(world,'war_resolved',record);
    for(const participant of op.participants){const pl=online.get(participant.playerId);if(!pl)continue;const st=safeState(pl.state);st.state.xp=Math.min(1e7,st.xp+35);st.state.rep=Math.max(-1000,Math.min(1000,st.rep+(participant.side===result.winner?5:-2)));if(participant.side===result.winner)st.state.money=Math.min(99999999,st.money+180);pl.state=st.state;await persistPlayer(pl.id,pl.state);io.to(pl.id).emit('war:reward',{state:pl.state,winner:result.winner,won:participant.side===result.winner});}
    await persistWorld();io.emit('world:event',syncEvent);io.emit('war:state',{operations:world.warOperations,history:world.warHistory});io.emit('world:update',{world,notice:result.captured?`«${op.attacker}» захватили сектор ${op.location}.`:`Оборона «${op.defender}» удержала сектор ${op.location}.`});socket.emit('war:result',{ok:true,message:result.captured?'Победа! Территория перешла под контроль твоей группировки.':'Оборона удержала сектор.',world});
  });
  socket.on('friend:request',async input=>{const p=online.get(socket.data.playerId),target=online.get(String(input?.targetId||''));if(!p||!target||p.id===target.id){socket.emit('friend:result',{ok:false,message:'Игрок не найден.'});return;}world.playerFriends ||= {};world.playerFriendRequests ||= {};const friends=world.playerFriends[p.id]||[];if(friends.some(f=>f.id===target.id)){socket.emit('friend:result',{ok:false,message:'Этот игрок уже в друзьях.'});return;}world.playerFriendRequests[target.id] ||= [];if(!world.playerFriendRequests[target.id].some(x=>x.fromId===p.id))world.playerFriendRequests[target.id].push({fromId:p.id,name:p.name,faction:p.faction,at:Date.now()});io.to(target.id).emit('friend:invite',{fromId:p.id,name:p.name,faction:p.faction});await persistWorld();socket.emit('friend:result',{ok:true,message:`Запрос дружбы отправлен игроку ${target.name}.`});});
  socket.on('friend:respond',async input=>{const p=online.get(socket.data.playerId),fromId=String(input?.fromId||'');if(!p)return;world.playerFriends ||= {};world.playerFriendRequests ||= {};const requests=world.playerFriendRequests[p.id]||[],request=requests.find(x=>x.fromId===fromId);if(!request){socket.emit('friend:result',{ok:false,message:'Запрос больше недоступен.'});return;}world.playerFriendRequests[p.id]=requests.filter(x=>x.fromId!==fromId);if(input?.accept){const from=online.get(fromId);world.playerFriends[p.id] ||= [];world.playerFriends[fromId] ||= [];if(!world.playerFriends[p.id].some(x=>x.id===fromId))world.playerFriends[p.id].push({id:fromId,name:request.name,faction:request.faction});if(from&&!world.playerFriends[fromId].some(x=>x.id===p.id))world.playerFriends[fromId].push({id:p.id,name:p.name,faction:p.faction});io.to(fromId).emit('friend:state',{friends:world.playerFriends[fromId]});}await persistWorld();socket.emit('friend:state',{friends:world.playerFriends[p.id]||[]});socket.emit('friend:result',{ok:true,message:input?.accept?'Игрок добавлен в друзья.':'Запрос отклонён.'});});
  socket.on('squad:create', async()=>{const p=online.get(socket.data.playerId);if(!p)return;world.playerSquads ||= {};if(squadOf(p.id)){socket.emit('squad:state',{squad:squadOf(p.id)});return;}const id=crypto.randomUUID(),squad={id,name:`${p.name} и группа`,leader:p.id,location:p.location,members:[{id:p.id,name:p.name,faction:p.faction,role:'leader'}],invites:[],journal:[],escortNpcId:null,createdAt:Date.now()};squadJournal(squad,'formed',`${p.name} собрал отряд.`);world.playerSquads[id]=squad;await persistWorld();publishSquad(squad);});
  socket.on('squad:invite', async input=>{const p=online.get(socket.data.playerId),target=online.get(String(input?.targetId||''));if(!p||!target||p.location!==target.location){socket.emit('squad:result',{ok:false,message:'Приглашать можно только игрока в той же локации.'});return;}world.playerSquads ||= {};let squad=squadOf(p.id);if(squad&&squad.leader!==p.id){socket.emit('squad:result',{ok:false,message:'Только лидер может приглашать в отряд.'});return;}if(!squad){const id=crypto.randomUUID();squad=world.playerSquads[id]={id,name:`Отряд ${p.name}`,leader:p.id,location:p.location,members:[{id:p.id,name:p.name,faction:p.faction,role:'leader'}],invites:[],journal:[],escortNpcId:null,createdAt:Date.now()};}if(squad.members.length>=4){socket.emit('squad:result',{ok:false,message:'В отряде не может быть больше четырёх сталкеров.'});return;}if(squad.members.some(m=>m.id===target.id)){socket.emit('squad:result',{ok:false,message:'Игрок уже в твоём отряде.'});return;}squad.invites ||= [];if(!squad.invites.includes(target.id))squad.invites.push(target.id);io.to(target.id).emit('squad:invite',{squadId:squad.id,name:squad.name,leader:p.name,location:p.location});await persistWorld();socket.emit('squad:result',{ok:true,message:`Приглашение отправлено: ${target.name}.`});});
  socket.on('squad:respond', async input=>{const p=online.get(socket.data.playerId);if(!p)return;const squad=world.playerSquads?.[String(input?.squadId||'')];if(!squad||!squad.invites?.includes(p.id)||squad.location!==p.location){socket.emit('squad:result',{ok:false,message:'Приглашение недействительно или отряд уже ушёл.'});return;}squad.invites=squad.invites.filter(id=>id!==p.id);if(input?.accept){const previous=squadOf(p.id);if(previous){previous.members=previous.members.filter(m=>m.id!==p.id);if(!previous.members.length)delete world.playerSquads[previous.id];}squad.members.push({id:p.id,name:p.name,faction:p.faction,role:'rifleman'});squadJournal(squad,'joined',`${p.name} присоединился к отряду.`);}await persistWorld();publishSquad(squad);socket.emit('squad:state',{squad:input?.accept?squad:null});socket.emit('squad:result',{ok:true,message:input?.accept?'Ты вступил в отряд.':'Приглашение отклонено.'});});
  socket.on('squad:leave', async()=>{const p=online.get(socket.data.playerId);if(!p)return;const squad=squadOf(p.id);if(squad){squad.members=squad.members.filter(m=>m.id!==p.id);squadJournal(squad,'left',`${p.name} покинул отряд.`);if(!squad.members.length)delete world.playerSquads[squad.id];else if(squad.leader===p.id){squad.leader=squad.members[0].id;squad.members[0].role='leader';squadJournal(squad,'leader',`${squad.members[0].name} принял командование.`);}publishSquad(squad);}await persistWorld();socket.emit('squad:state',{squad:null});});
  socket.on('squad:role',async input=>{const p=online.get(socket.data.playerId),squad=p&&squadOf(p.id),member=squad?.members.find(m=>m.id===String(input?.memberId||'')),role=String(input?.role||'');if(!p||!squad||squad.leader!==p.id||!member||!SQUAD_ROLES.has(role)||member.id===squad.leader){socket.emit('squad:result',{ok:false,message:'Нельзя назначить эту роль.'});return;}member.role=role;squadJournal(squad,'role',`${member.name} назначен: ${role}.`);await persistWorld();publishSquad(squad);socket.emit('squad:result',{ok:true,message:'Роль бойца обновлена.'});});
  socket.on('squad:escort',async input=>{const p=online.get(socket.data.playerId),squad=p&&squadOf(p.id),npcId=String(input?.npcId||''),npc=world.npcState?.[npcId];if(!p||!squad||squad.leader!==p.id||!npc||npc.alive===false||npc.location!==squad.location){socket.emit('squad:result',{ok:false,message:'Нужен живой NPC в вашем секторе; приказ отдаёт лидер.'});return;}const friendly=npc.faction===p.faction||Number(npc.relationships?.[p.id]||npc.relationship||0)>=15;if(!friendly){socket.emit('squad:result',{ok:false,message:'Этот сталкер не доверяет вашему отряду.'});return;}squad.escortNpcId=npcId;npc.escortSquadId=squad.id;squadJournal(squad,'escort',`${npc.name} согласился сопровождать отряд.`);await persistWorld();publishSquad(squad);socket.emit('squad:result',{ok:true,message:`${npc.name} присоединился к сопровождению.`});});
  socket.on('npc:combat:kill', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    const npcId=String(input?.npcId||'').slice(0,48),npc=world.npcState?.[npcId];
    if(!npc||npc.alive===false||npc.location!==p.location||!isHostileFaction(p.faction,npc.faction,world.diplomacy)){
      socket.emit('npc:combat:result',{ok:false,message:'Цель недоступна или не является противником.'});return;
    }
    npc.alive=false;npc.health=0;npc.action='dead';npc.deathCause=`погиб в столкновении со сталкером ${p.name}`;npc.diedAt=Date.now();
    world.npcMemorial||=[];world.npcMemorial.unshift({id:`mem_${npc.id}_${npc.diedAt}`,name:npc.name,faction:npc.faction,role:npc.role,location:npc.location,cause:npc.deathCause,diedAt:npc.diedAt});world.npcMemorial=world.npcMemorial.slice(0,100);
    world.npcPositions[npc.id]=npc.location;
    const ev=appendWorldEvent(world,'npc_killed',{npcId:npc.id,name:npc.name,faction:npc.faction,playerId:p.id,playerName:p.name,location:p.location});
    recordStalkerKill(p,npc);
    const leaderboard=leaderboardPayload();
    await persistWorld();io.emit('world:event',ev);io.emit('world:leaderboard',leaderboard);emitNpcState();socket.emit('npc:combat:result',{ok:true,npcId:npc.id,leaderboard});
  });
  socket.on('npc:specialist', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    const npc=world.npcState?.[String(input?.npcId||'').slice(0,48)];
    if(!npc||npc.alive===false||npc.location!==p.location||!npc.supportSpecialist){socket.emit('npc:specialist:result',{ok:false,message:'Специалист должен быть жив и находиться рядом.'});return;}
    const state=safeState(p.state),medic=npc.role==='медик',technician=npc.role==='техник';
    if(!medic&&!technician){socket.emit('npc:specialist:result',{ok:false,message:'Этот сталкер не оказывает такую услугу.'});return;}
    const cost=medic?75:100;
    if(state.money<cost){socket.emit('npc:specialist:result',{ok:false,message:`Нужно ${cost} ₽ за услугу.`});return;}
    if(medic){if(state.hp>=100){socket.emit('npc:specialist:result',{ok:false,message:'Здоровье уже в порядке.'});return;}state.state.hp=Math.min(100,state.hp+35);}
    else{
      const armor=(state.state.items||[]).find(x=>x.name===state.state.equipment?.suit&&x.type==='Броня');
      if(!armor){socket.emit('npc:specialist:result',{ok:false,message:'Сначала надень броню, которую нужно отремонтировать.'});return;}
      if(Number(armor.condition??100)>=100){socket.emit('npc:specialist:result',{ok:false,message:'Броня уже полностью исправна.'});return;}
      armor.condition=Math.min(100,Number(armor.condition??70)+35);
    }
    state.state.money=state.money-cost;p.state=state.state;p.hp=state.state.hp;await persistPlayer(p.id,p.state);
    const message=medic?`${npc.name} оказал медицинскую помощь. Здоровье восстановлено на 35 пунктов.`:`${npc.name} отремонтировал броню. Состояние улучшено на 35 пунктов.`;
    socket.emit('npc:specialist:result',{ok:true,state:p.state,message});
  });
  socket.on('npc:interact', async input=>{
    const p=online.get(socket.data.playerId); if(!p)return;
    const npcId=String(input?.npcId||'').slice(0,48), action=String(input?.action||'');
    const npc=world.npcState?.[npcId];
    const result=interactWithNpc(npc,{id:p.id,location:p.location},action,Date.now(),{recentWorldEvent:world.zoneEvents?.at(-1)?.title||'',locationName:npc?.location,topicIndex:input?.topicIndex,friendName:world.npcState?.[npc?.friends?.[0]]?.name||'',rivalName:world.npcState?.[npc?.rivals?.[0]]?.name||''});
    socket.emit('npc:interaction-result',result);
    if(result.ok){ const syncEvent=appendWorldEvent(world,'npc_interaction',{npcId,playerId:p.id,action,relationship:result.relationship}); await persistWorld(); io.emit('world:event',syncEvent); emitNpcState(); }
  });
  socket.on('survival:hunt', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;const eco=initEcosystem(world),pack=eco.mutantPacks.find(x=>x.id===String(input?.packId||'')&&x.location===p.location&&x.count>0);
    if(!pack){socket.emit('survival:hunt:result',{ok:false,message:'В этом секторе больше нет доступной группы мутантов.'});return;}
    const st=safeState(p.state);st.state.items ||= [];st.state.survival ||= {lastHuntAt:0,events:[]};const now=Date.now();
    if(now-Number(st.state.survival.lastHuntAt||0)<60000){socket.emit('survival:hunt:result',{ok:false,message:'После предыдущей охоты нужно восстановиться.'});return;}
    if(Number(st.state.stamina||0)<18){socket.emit('survival:hunt:result',{ok:false,message:'Для охоты нужно минимум 18 выносливости.'});return;}
    const weapon=String(st.state.equipment?.weapon||'');if(!weapon){socket.emit('survival:hunt:result',{ok:false,message:'Нет экипированного оружия.'});return;}
    const quality=/АК|винтов|руж|СВД|Гроза/i.test(weapon)?75:45;const chance=Math.max(.18,Math.min(.82,.72-(Number(pack.aggression)||50)*.003+quality*.001-Math.max(0,100-Number(st.state.stamina||0))*.002));
    st.state.stamina=Math.max(0,Number(st.state.stamina||0)-18);st.state.survival.lastHuntAt=now;const success=Math.random()<chance;let message;
    if(success){pack.count=Math.max(0,pack.count-1);st.state.careerStats ||= {};st.state.careerStats.mutantHunts=(Number(st.state.careerStats.mutantHunts)||0)+1;const trophy=st.state.items.find(x=>x.id==='mutant_trophy');if(trophy)trophy.qty=(Number(trophy.qty)||0)+1;else st.state.items.push({id:'mutant_trophy',name:'Трофей мутанта',type:'Материал',desc:'Добыча после охоты на мутанта.',weight:.8,qty:1,value:110});st.state.xp=Math.min(1e7,(Number(st.state.xp)||0)+18);st.state.money=Math.min(99999999,(Number(st.state.money)||0)+35);message=`Охота успешна: ${pack.species}. Получен трофей, +18 опыта и 35 ₽.`;}
    else{const damage=Math.max(2,Math.round((Number(pack.aggression)||40)/12));st.state.hp=Math.max(1,(Number(st.state.hp)||100)-damage);message=`Мутанты контратаковали. Потеряно ${damage} здоровья. Следует отступить и перевязаться.`;}
    p.state=st.state;p.hp=st.state.hp;p.xp=st.state.xp;await persistPlayer(p.id,p.state);eco.revision=(eco.revision||0)+1;addEcoEvent(world,success?'mutant_hunt':'mutant_attack',`${p.name}: ${message}`,now);await persistWorld();io.emit('world:ecosystem',eco);socket.emit('survival:hunt:result',{ok:success,message,state:p.state,ecosystem:eco});
  });
  socket.on('base:upgrade', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;const cost=500,st=safeState(p.state);
    if(st.money<cost){socket.emit('ecosystem:result',{ok:false,message:`Нужно ${cost} ₽ на материалы.`});return;}
    const result=upgradeBase(world,String(input?.location||''),p.faction,cost);if(!result.ok){socket.emit('ecosystem:result',{ok:false,message:result.reason});return;}
    st.state.money=st.money-cost;p.state=st.state;await persistPlayer(p.id,p.state);const ev=appendWorldEvent(world,'base_upgraded',{location:result.base.location,faction:p.faction,level:result.base.level});await persistWorld();io.emit('world:event',ev);io.emit('world:ecosystem',world.ecosystem);socket.emit('ecosystem:result',{ok:true,message:`База улучшена до уровня ${result.base.level}.`,state:p.state});
  });
  socket.on('clan:create', async input=>{const p=online.get(socket.data.playerId);if(!p)return;const result=createClan(world,{id:p.id,name:p.name,faction:p.faction},input?.name);if(!result.ok){socket.emit('ecosystem:result',{ok:false,message:result.reason});return;}const ev=appendWorldEvent(world,'clan_created',{clanId:result.clan.id,name:result.clan.name,faction:p.faction});await persistWorld();io.emit('world:event',ev);io.emit('world:ecosystem',world.ecosystem);socket.emit('ecosystem:result',{ok:true,message:`Клан «${result.clan.name}» создан.`,clan:result.clan});});
  socket.on('clan:join', async input=>{const p=online.get(socket.data.playerId);if(!p)return;const result=joinClan(world,{id:p.id,name:p.name,faction:p.faction},input?.clanId);if(!result.ok){socket.emit('ecosystem:result',{ok:false,message:result.reason});return;}await persistWorld();io.emit('world:ecosystem',world.ecosystem);socket.emit('ecosystem:result',{ok:true,message:`Ты вступил в клан «${result.clan.name}».`});});
  socket.on('diplomacy:action', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    const target=clean(input?.target,32), action=input?.action;
    if(!FACTIONS.has(target)||target===p.faction||!['mediator','intel','treaty'].includes(action))return;
    const costs={mediator:120,intel:80,treaty:250},delta={mediator:4,intel:7,treaty:12};
    const state=safeState(p.state);if(state.money<costs[action]){socket.emit('diplomacy:result',{ok:false,message:'Недостаточно рублей.'});return;}
    state.state.money=state.money-costs[action];state.state.rep=(Number(state.state.rep)||0)+1;
    world.diplomacy[p.faction] ||= {};world.diplomacy[target] ||= {};
    if (p.faction === 'Монолит' || target === 'Монолит') { socket.emit('diplomacy:result',{ok:false,message:'Отношения с Монолитом не поддаются дипломатическому изменению.'}); return; }
    const updated=Math.min(60,(world.diplomacy[p.faction][target]||0)+delta[action]);
    world.diplomacy[p.faction][target]=updated;
    world.diplomacy[target][p.faction]=updated;
    const syncEvent=appendWorldEvent(world,'diplomacy_changed',{from:p.faction,to:target,action,delta:delta[action]});
    p.state=state.state;await persistPlayer(p.id,p.state);await persistWorld(); io.emit('world:event',syncEvent);
    io.emit('world:update',{world,notice:`${p.name} провёл дипломатическую миссию между «${p.faction}» и «${target}».`});
    socket.emit('diplomacy:result',{ok:true,state:p.state,world});
  });
  socket.on('disconnect',(reason)=>{
    console.info(`[socket] disconnected id=${socket.id} player=${socket.data.playerId||'unidentified'} reason=${reason}${socket.data.supersededBy?` supersededBy=${socket.data.supersededBy}`:''}`);
    const id=socket.data.playerId,p=online.get(id);if(!p||p.socketId!==socket.id)return;
    // Persist the last authoritative state on a real disconnect as well as on
    // explicit client saves. Superseded sockets are filtered by the socketId guard above.
    persistPlayer(id,p.state).catch(e=>console.error('disconnect player persistence:',e.message));
    online.delete(id);const ev=appendWorldEvent(world,'player_left',{playerId:id,name:p.name,faction:p.faction,location:p.location});io.to('zone-world').emit('world:event',ev);persistWorld().catch(e=>console.error('leave persistence:',e.message));systemMessage(`${p.name} покинул Зону.`);broadcastOnline();
  });
});

function socketSafeEmit(playerId,event,payload){io.to(playerId).emit(event,payload);}
let playerMovementTickRunning=false;
setInterval(async()=>{
  if(playerMovementTickRunning)return;playerMovementTickRunning=true;
  try{
    let movedAny=false;
    for(const p of online.values()){
      if(p.expedition?.status==='travelling'){
        const step=advanceExpedition(p,Date.now());
        if(step.advanced){p.lastSeen=Date.now();p.state ||= {};const hopRisk=require('./src/systems/expedition').RISK[step.location]||30;const hopCost=require('./public/js/survival').expeditionCost(hopRisk,'overcast',!!p.state.emission?.active);const kit=p.state.survival?.kit;if(kit?.rations>0&&kit?.water>0){p.state.hunger=Math.max(0,(Number(p.state.hunger)||0)-8);p.state.thirst=Math.max(0,(Number(p.state.thirst)||0)-18);p.state.survival.kit=null;}else{hopCost.stamina+=8;hopCost.hunger+=5;hopCost.thirst+=7;}p.state.stamina=Math.max(0,(Number(p.state.stamina)||0)-hopCost.stamina);p.state.hunger=Math.min(100,(Number(p.state.hunger)||0)+hopCost.hunger);p.state.thirst=Math.min(100,(Number(p.state.thirst)||0)+hopCost.thirst);p.state.radiation=Math.min(100,(Number(p.state.radiation)||0)+hopCost.radiation);if(p.state.stamina<=0)p.state.hp=Math.max(1,(Number(p.state.hp)||100)-4);p.state.loc=step.location;await persistPlayer(p.id,p.state);const old=p.expedition.path[p.expedition.index-1];const sock=[...io.sockets.sockets.values()].find(x=>x.data.playerId===p.id);if(sock){sock.leave(`location:${old}`);sock.join(`location:${p.location}`);sock.emit('world:chat:history',recentChat.filter(m=>!m.location||m.location===p.location).slice(-60));}socketSafeEmit(p.id,'player:expedition-step',{location:step.location,arrived:step.arrived,route:p.expedition.path,index:p.expedition.index,state:p.state});
          if(!step.arrived&&Math.random()<Math.min(.42,(require('./src/systems/expedition').RISK[step.location]||30)/260)){p.expedition.status='paused';p.travelEncounter={type:'route_contact',at:Date.now()};io.to(p.id).emit('player:travel-event',{type:'mutants',message:`На подходе к сектору ${step.location} обнаружена опасность: мутанты или неизвестный отряд. Экспедиция остановлена. Продолжить скрытно или отступить?`});}
          const squad=squadOf(p.id);if(squad&&squad.leader===p.id){squad.location=p.location;for(const member of squad.members||[]){const follower=online.get(member.id);if(follower&&follower.id!==p.id){const fsock=[...io.sockets.sockets.values()].find(x=>x.data.playerId===follower.id);if(fsock){fsock.leave(`location:${old}`);fsock.join(`location:${p.location}`);}follower.location=p.location;follower.expedition={...p.expedition};io.to(follower.id).emit('player:expedition-step',{location:p.location,arrived:step.arrived,route:p.expedition.path,index:p.expedition.index});}}}
          io.to(p.id).emit('player:expedition-result',{ok:true,message:step.arrived?'Экспедиция завершена. Ты прибыл в пункт назначения.':`Переход выполнен: ${p.location}.`,expedition:p.expedition});broadcastOnline();persistWorld().catch(()=>{});
          if(step.arrived)p.expedition=null;
        }
        continue;
      }
      if(!p.moveOrder||p.travelEncounter)continue;
      const order=p.moveOrder;const before=Math.hypot(order.x-p.x,order.y-p.y);
      const result=advanceMoveOrder(p,1);
      if(result.moved){movedAny=true;p.lastSeen=Date.now();p.state ||= {};p.state.worldPosition={x:p.x,y:p.y};p.state.loc=p.location;if(Date.now()-(p.lastMovePersistAt||0)>10000){p.lastMovePersistAt=Date.now();persistPlayer(p.id,p.state).catch(e=>console.error('movement save:',e.message));}io.to(p.id).emit('player:movement',{x:p.x,y:p.y,moving:!result.arrived,remaining:Math.hypot(order.x-p.x,order.y-p.y)});}
      if(order.encounterAt&&!order.encounterChecked&&before>0&&Math.hypot(order.x-p.x,order.y-p.y)<=order.distance*(1-order.encounterAt)){
        order.encounterChecked=true;
        const groups=(world.npcGroups||[]).filter(g=>g.location===p.location&&g.faction!==p.faction&&g.members?.length>=2);
        const hostile=groups.find(g=>isHostileFaction(p.faction,g.faction,world.diplomacy));
        const type=hostile?'hostile_squad':'mutants';const label=hostile?`замечен отряд «${hostile.name}» (${hostile.faction})`:'обнаружены следы мутантов и движение в кустах';
        p.travelEncounter={type,groupId:hostile?.id||null,at:Date.now()};io.to(p.id).emit('player:travel-event',{type,npcId:hostile?.members?.[0]||null,groupId:hostile?.id||null,message:`На маршруте: ${label}. Движение остановлено. Продолжить путь или отступить?`});
      }
      if(result.arrived){p.state.worldPosition={x:p.x,y:p.y};await persistPlayer(p.id,p.state);io.to(p.id).emit('player:move-result',{ok:true,message:'Ты достиг отмеченной точки.'});}
    }
    if(movedAny)broadcastOnline();
  }catch(e){console.error('Player movement tick:',e.message);}finally{playerMovementTickRunning=false;}
},1000).unref();

setInterval(async()=>{
  if(npcTickRunning)return; npcTickRunning=true;
  try {
    initSharedWorld(world, NPC_HOME, LOCATIONS, COOP_TEMPLATES);
    const now=Date.now(), events=tickNpcWorld(world,LOCATIONS,Math.random,now);
    const leaderboard=buildStalkerLeaderboard();
    if(leaderboard.length&&now-(world.stalkerRumorAt||0)>30*60*1000){const star=leaderboard[0];addStalkerNews(`По стоянкам расходится слух: ${star.name} (${star.faction}) сейчас возглавляет рейтинг Зоны с ${star.score} очками.`,star.name);world.stalkerRumorAt=now;}
    for(const p of online.values()){for(const npc of Object.values(world.npcState||{})){if(!npc.alive||npc.location!==p.location)continue;npc.lastApproachAt ||= 0;if(now-npc.lastApproachAt<8*60*1000||Math.random()>.12)continue;npc.lastApproachAt=now;io.to(p.id).emit('npc:approach',{npcId:npc.id,text:`${npc.name} замечает тебя и подходит поговорить. «Эй, сталкер. Есть минутка?»`});break;}}
    const ecoEvents=tickEcosystem(world,Math.random,now);
    const soulEvents=tickSouls(world,LOCATIONS,Math.random,now);
    world.onlineMetrics ||= {totalJoins:0,totalMoves:0,lastTickAt:0}; world.onlineMetrics.lastTickAt=now;
    const tickEvent=appendWorldEvent(world,'world_tick',{npcEvents:events.length,activeNpcs:Object.values(world.npcState||{}).filter(n=>n.alive).length},now);
    io.emit('world:event',tickEvent);
    for(const event of [...events,...ecoEvents,...soulEvents]){const ev=appendWorldEvent(world,event.type,{...event},now);io.emit('world:event',ev);io.emit('world:npc-event',event);if(['npc_skirmish','mutant_migration','anomaly_migration','convoy_ambush','convoy_started'].includes(event.type))systemMessage(event.text);}
    await persistWorld(); io.emit('world:npcs',world.npcPositions);
    emitNpcState();io.emit('world:leaderboard',leaderboardPayload());io.emit('world:ecosystem',world.ecosystem);
    io.emit('world:status',publicWorldStatus(world,online.size));
  }catch(e){console.error('NPC AI schedule:',e.message);} finally {npcTickRunning=false;}
},60*1000).unref();
setInterval(async()=>{
  const event={...ZONE_EVENTS[Math.floor(Math.random()*ZONE_EVENTS.length)],id:crypto.randomUUID(),at:Date.now()};
  world.zoneEvents ||= [];world.zoneEvents.push(event);world.zoneEvents=world.zoneEvents.slice(-30);const syncEvent=appendWorldEvent(world,'zone_event',event,event.at);
  try{await persistWorld();io.emit('world:zoneEvent',event);io.emit('world:event',syncEvent);io.emit('world:status',publicWorldStatus(world,online.size));}catch(e){console.error('Zone event:',e.message);}
},4*60*1000).unref();
dbInitialization = initDb().catch(e=>{console.error('Database bootstrap error:',e);});
server.listen(PORT,'0.0.0.0',()=>console.log(`ZONE ONLINE listening on ${PORT} node=${process.version} socketTransports=websocket,polling`));
server.on('error',error=>{console.error('HTTP server failed to start:',error);process.exitCode=1;});
let shutdownStarted=false;
async function gracefulShutdown(signal){
  if(shutdownStarted)return;
  shutdownStarted=true;
  console.info(`[shutdown] ${signal}: saving ${online.size} online player(s) and shared world`);
  const forceExit=setTimeout(()=>{console.error('[shutdown] graceful shutdown timed out');process.exit(1);},25000);
  forceExit.unref();
  try{
    await Promise.all([...online.values()].map(p=>persistPlayer(p.id,p.state).catch(e=>console.error(`[shutdown] player ${p.id} save failed:`,e.message))));
    await persistWorld();
    await new Promise(resolve=>io.close(()=>resolve()));
    if(pool){try{await pool.end();}catch(e){console.error('[shutdown] database close failed:',e.message);}}
    clearTimeout(forceExit);
    console.info('[shutdown] state saved; server closed');
    process.exit(0);
  }catch(error){console.error('[shutdown] failed:',error);process.exit(1);}
}
process.on('SIGTERM',()=>gracefulShutdown('SIGTERM'));
process.on('SIGINT',()=>gracefulShutdown('SIGINT'));
process.on('unhandledRejection',error=>console.error('Unhandled promise rejection:',error));
