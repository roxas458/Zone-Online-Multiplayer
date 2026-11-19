const express = require('express');
const http = require('http');
const path = require('path');
const crypto = require('crypto');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true, methods: ['GET','POST'] }, pingInterval: 25000, pingTimeout: 20000, maxHttpBufferSize: 1e6 });
const PORT = process.env.PORT || 3000;
const LOCATIONS = new Set(['cordon','dump','bar','agro','dark','yantar','army','red','pripyat','zaton','jupiter','yanov','kopachi','volkhov','iron']);
const FACTIONS = new Set(['Одиночки','Долг','Свобода','Бандиты','Военные','Учёные','Наёмники','Монолит','Чистое небо']);
const online = new Map();
const recentChat = [];
let pool = null;
let dbReady = false;
let world = { diplomacy: {}, events: [], revision: 1 };

app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req,res) => res.json({ ok:true, service:'ZONE ONLINE shared world', database:dbReady?'postgres':'memory-fallback', online:online.size }));
app.get('/api/status', (_req,res) => res.json({ online:online.size, persistent:dbReady, worldRevision:world.revision }));

function clean(value,max=80){ return String(value ?? '').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,max); }
function validId(value){ return /^[a-f0-9-]{16,64}$/i.test(String(value||'')); }
function safeState(input){
  const s = input && typeof input === 'object' ? input : {};
  return {
    name:clean(s.name,24)||'Сталкер', faction:FACTIONS.has(s.faction)?s.faction:'Одиночки',
    loc:LOCATIONS.has(s.loc)?s.loc:'cordon', money:Math.max(0,Math.min(99999999,Number(s.money)||0)),
    hp:Math.max(0,Math.min(100,Number(s.hp)||100)), xp:Math.max(0,Math.min(1e7,Number(s.xp)||0)),
    rep:Math.max(-1000,Math.min(1000,Number(s.rep)||0)), state:s
  };
}
function publicPlayer(p){ return { id:p.id, name:p.name, faction:p.faction, location:p.location, hp:p.hp, xp:p.xp, joinedAt:p.joinedAt, lastSeen:p.lastSeen }; }
function onlineList(){ return [...online.values()].map(publicPlayer).sort((a,b)=>a.name.localeCompare(b.name,'ru')); }
function broadcastOnline(){ io.emit('world:players',onlineList()); }
function systemMessage(text){ const m={id:crypto.randomUUID(),system:true,name:'Система',text:clean(text,240),time:Date.now()}; recentChat.push(m); if(recentChat.length>80)recentChat.shift(); io.emit('world:chat',m); }
function initDiplomacy(){
  const names=[...FACTIONS];
  const baseline={'Одиночки':15,'Долг':0,'Свобода':0,'Бандиты':-25,'Военные':-20,'Учёные':10,'Наёмники':-5,'Монолит':-35,'Чистое небо':8};
  for(const a of names){ world.diplomacy[a] ||= {}; for(const b of names){ if(a!==b && !Number.isFinite(world.diplomacy[a][b])) world.diplomacy[a][b]=Math.max(-60,Math.min(60,Math.round(((baseline[a]||0)+(baseline[b]||0))/2))); } }
}
initDiplomacy();
async function initDb(){
  if(!process.env.DATABASE_URL){ console.warn('DATABASE_URL missing: running in memory mode. Add Render PostgreSQL for persistence.'); return; }
  try {
    const { Pool } = require('pg');
    pool = new Pool({ connectionString:process.env.DATABASE_URL, ssl:process.env.DATABASE_URL.includes('localhost')?false:{rejectUnauthorized:false}, max:10, idleTimeoutMillis:30000, connectionTimeoutMillis:10000 });
    await pool.query(`CREATE TABLE IF NOT EXISTS zone_players (id TEXT PRIMARY KEY, state JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    await pool.query(`CREATE TABLE IF NOT EXISTS zone_world (id INTEGER PRIMARY KEY CHECK (id=1), state JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    await pool.query(`CREATE TABLE IF NOT EXISTS zone_chat (id BIGSERIAL PRIMARY KEY, payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    const wr=await pool.query('SELECT state FROM zone_world WHERE id=1');
    if(wr.rows[0]) world={...world,...wr.rows[0].state}; else await pool.query('INSERT INTO zone_world(id,state) VALUES(1,$1)',[world]);
    const cr=await pool.query('SELECT payload FROM zone_chat ORDER BY id DESC LIMIT 60');
    recentChat.push(...cr.rows.reverse().map(x=>x.payload)); initDiplomacy(); dbReady=true;
    console.log('PostgreSQL connected; shared world persistence enabled.');
  } catch(e){ console.error('PostgreSQL initialization failed; server will continue in memory mode:',e.message); pool=null; dbReady=false; }
}
async function persistPlayer(id,state){ if(pool) await pool.query('INSERT INTO zone_players(id,state,updated_at) VALUES($1,$2,NOW()) ON CONFLICT(id) DO UPDATE SET state=EXCLUDED.state,updated_at=NOW()',[id,state]); }
async function loadPlayer(id){ if(!pool)return null; const r=await pool.query('SELECT state FROM zone_players WHERE id=$1',[id]); return r.rows[0]?.state||null; }
async function persistWorld(){ if(pool) await pool.query('INSERT INTO zone_world(id,state,updated_at) VALUES(1,$1,NOW()) ON CONFLICT(id) DO UPDATE SET state=EXCLUDED.state,updated_at=NOW()',[world]); }
async function persistChat(m){ if(pool){ await pool.query('INSERT INTO zone_chat(payload) VALUES($1)',[m]); await pool.query('DELETE FROM zone_chat WHERE id NOT IN (SELECT id FROM zone_chat ORDER BY id DESC LIMIT 300)'); } }

io.on('connection', socket=>{
  socket.on('player:hello', async payload=>{
    try {
      const id=validId(payload?.id)?String(payload.id):crypto.randomUUID();
      let saved=await loadPlayer(id);
      if(!saved && payload?.state) { saved=safeState(payload.state).state; await persistPlayer(id,saved); }
      const s=saved?safeState(saved):safeState(payload?.state);
      const p={ id, name:s.name, faction:s.faction, location:s.loc, hp:s.hp, xp:s.xp, joinedAt:Date.now(), lastSeen:Date.now(), state:saved||s.state };
      socket.data.playerId=id; socket.data.name=p.name; online.set(id,p); socket.join('zone-world');
      socket.emit('player:ready',{id, savedState:saved, world, chat:recentChat.slice(-60), players:onlineList(), persistent:dbReady});
      systemMessage(`${p.name} вошёл в Зону.`); broadcastOnline();
    } catch(e){ socket.emit('server:error',{message:'Не удалось загрузить профиль.'}); console.error(e); }
  });
  socket.on('player:save', async input=>{
    const id=socket.data.playerId, p=online.get(id); if(!id||!p)return;
    const s=safeState(input); p.name=s.name;p.faction=s.faction;p.location=s.loc;p.hp=s.hp;p.xp=s.xp;p.lastSeen=Date.now();p.state=s.state;socket.data.name=s.name;
    try{ await persistPlayer(id,s.state); }catch(e){socket.emit('server:error',{message:'Не удалось сохранить профиль на сервере.'});console.error(e);}
    broadcastOnline();
  });
  socket.on('player:update', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    if(LOCATIONS.has(input?.location))p.location=input.location;
    if(FACTIONS.has(input?.faction))p.faction=input.faction;
    if(input?.name)p.name=clean(input.name,24)||p.name;
    p.lastSeen=Date.now();broadcastOnline();
  });
  socket.on('world:chat:send', async input=>{
    if(!socket.data.playerId)return;
    const text=clean(input?.text,240);if(!text)return;
    const p=online.get(socket.data.playerId);
    const m={id:crypto.randomUUID(),name:p?.name||'Сталкер',faction:p?.faction||'Одиночки',text,time:Date.now()};
    recentChat.push(m);if(recentChat.length>80)recentChat.shift();io.to('zone-world').emit('world:chat',m);
    try{await persistChat(m);}catch(e){console.error('chat persistence:',e.message);}
  });
  socket.on('diplomacy:action', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    const target=clean(input?.target,32), action=input?.action;
    if(!FACTIONS.has(target)||target===p.faction||!['mediator','intel','treaty'].includes(action))return;
    const costs={mediator:120,intel:80,treaty:250},delta={mediator:4,intel:7,treaty:12};
    const state=safeState(p.state);if(state.money<costs[action]){socket.emit('diplomacy:result',{ok:false,message:'Недостаточно рублей.'});return;}
    state.state.money=state.money-costs[action];state.state.rep=(Number(state.state.rep)||0)+1;
    world.diplomacy[p.faction] ||= {};world.diplomacy[target] ||= {};
    world.diplomacy[p.faction][target]=Math.min(60,(world.diplomacy[p.faction][target]||0)+delta[action]);
    world.diplomacy[target][p.faction]=Math.min(60,(world.diplomacy[target][p.faction]||0)+Math.floor(delta[action]/2));
    world.revision=(world.revision||0)+1;
    p.state=state.state;await persistPlayer(p.id,p.state);await persistWorld();
    io.emit('world:update',{world,notice:`${p.name} провёл дипломатическую миссию между «${p.faction}» и «${target}».`});
    socket.emit('diplomacy:result',{ok:true,state:p.state,world});
  });
  socket.on('disconnect',()=>{
    const id=socket.data.playerId,p=online.get(id);if(!p)return;
    online.delete(id);systemMessage(`${p.name} покинул Зону.`);broadcastOnline();
  });
});

initDb().finally(()=>server.listen(PORT,'0.0.0.0',()=>console.log(`ZONE ONLINE listening on ${PORT}`)));
