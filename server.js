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
const { initSharedWorld, initDiplomacy } = require('./src/server/world');
const { WAR_CONFIG, createOperation, deploymentPower, addDeployment, resolveOperation } = require('./src/systems/war');
const { tickNpcWorld, interactWithNpc } = require('./src/systems/npc-ai');
const { ensureOnlineWorld, appendWorldEvent, buildWorldSync, publicWorldStatus } = require('./src/systems/online-world');
const { initEcosystem, tickEcosystem, upgradeBase, createClan, joinClan } = require('./src/systems/ecosystem');
const { initSouls, tickSouls } = require('./src/systems/souls');

const online = new Map();
const recentChat = [];
let pool = null;
let dbReady = false;
let world = { diplomacy: {}, events: [], revision: 1, npcPositions: {}, coOpQuests: [], discoveredPoints: {}, zoneEvents: [], warOperations: [], warHistory: [], eventLog: [] };
let npcTickRunning = false;


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true, methods: ['GET','POST'] }, pingInterval: 25000, pingTimeout: 20000, maxHttpBufferSize: 1e6 });
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req,res) => res.json({ ok:true, service:'ZONE ONLINE 4.10 IMMERSION UPDATE', database:dbReady?'postgres':'memory-fallback', online:online.size, revision:world.revision||1 }));
app.get('/api/status', (_req,res) => res.json({ ...publicWorldStatus(world, online.size), persistent:dbReady, service:'ZONE ONLINE 4.10 IMMERSION UPDATE' }));
app.get('/api/world/snapshot', (_req,res) => res.json({ status:publicWorldStatus(world, online.size), world }));
app.get('/api/world/events', (req,res) => { const since=Number(req.query.since||0); const sync=buildWorldSync(world, Number.isSafeInteger(since)?since:0); res.json(sync); });

function publicPlayer(p){ return { id:p.id, name:p.name, faction:p.faction, location:p.location, hp:p.hp, xp:p.xp, joinedAt:p.joinedAt, lastSeen:p.lastSeen }; }
function onlineList(){ return [...online.values()].map(publicPlayer).sort((a,b)=>a.name.localeCompare(b.name,'ru')); }
function broadcastOnline(){ io.emit('world:players',onlineList()); }
function systemMessage(text){ const m={id:crypto.randomUUID(),system:true,name:'Система',text:clean(text,240),time:Date.now()}; recentChat.push(m); if(recentChat.length>80)recentChat.shift(); io.emit('world:chat',m); }
initDiplomacy(world, FACTIONS); initSharedWorld(world, NPC_HOME, LOCATIONS, COOP_TEMPLATES); initSouls(world); ensureOnlineWorld(world);
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
async function persistChat(m){ if(!pool)return; try{await pool.query('INSERT INTO zone_chat(payload) VALUES($1)',[m]);await pool.query('DELETE FROM zone_chat WHERE id NOT IN (SELECT id FROM zone_chat ORDER BY id DESC LIMIT 300)');}catch(e){await dbFallback(e,'chat save');} }

io.on('connection', socket=>{
  socket.on('player:hello', async (payload, ack)=>{
    try {
      const id=validId(payload?.id)?String(payload.id):crypto.randomUUID();
      let saved=await loadPlayer(id);
      if(!saved && payload?.state) { saved=safeState(payload.state).state; await persistPlayer(id,saved); }
      const s=saved?safeState(saved):safeState(payload?.state);
      const p={ id, name:s.name, faction:s.faction, location:s.loc, hp:s.hp, xp:s.xp, joinedAt:Date.now(), lastSeen:Date.now(), state:saved||s.state };
      const previous=online.get(id); if(previous?.socketId&&previous.socketId!==socket.id){const oldSocket=io.sockets.sockets.get(previous.socketId);if(oldSocket)oldSocket.disconnect(true);}
      socket.data.playerId=id; socket.data.name=p.name; p.socketId=socket.id; online.set(id,p); socket.join('zone-world'); socket.join(id);
      world.onlineMetrics ||= { totalJoins:0, totalMoves:0, lastTickAt:0 }; world.onlineMetrics.totalJoins += 1;
      const joinEvent = appendWorldEvent(world, 'player_joined', { player:publicPlayer(p) });
      socket.emit('player:ready',{id, savedState:saved, world, worldSync:buildWorldSync(world, Number(payload?.lastRevision)||0), status:publicWorldStatus(world,online.size), chat:recentChat.slice(-60), players:onlineList(), persistent:dbReady});
      if(typeof ack==='function')ack({ok:true,id,persistent:dbReady});
      socket.to('zone-world').emit('world:event',joinEvent);
      io.emit('world:npcs',world.npcPositions); io.emit('world:npc-state',{npcs:world.npcState,events:(world.npcEvents||[]).slice(-20),squads:world.npcSquads||[],memorial:world.npcMemorial||[]}); io.emit('world:ecosystem',world.ecosystem); io.emit('world:coop',world.coOpQuests); io.emit('war:state',{operations:world.warOperations||[],history:(world.warHistory||[]).slice(0,12)});
      systemMessage(`${p.name} вошёл в Зону.`); broadcastOnline(); persistWorld().catch(e=>console.error('join persistence:',e.message));
    } catch(e){ console.error('player:hello failed:',e); const message='Сервер принял соединение, но не смог завершить вход. Попробуй переподключиться.'; socket.emit('player:hello:error',{message}); if(typeof ack==='function')ack({ok:false,message}); }
  });
  socket.on('player:save', async input=>{
    const id=socket.data.playerId, p=online.get(id); if(!id||!p)return;
    const s=safeState(input); const previousLocation=p.location; p.name=s.name;p.faction=s.faction;p.location=s.loc;p.hp=s.hp;p.xp=s.xp;p.lastSeen=Date.now();p.state=s.state;socket.data.name=s.name;
    try{ await persistPlayer(id,s.state); }catch(e){socket.emit('server:error',{message:'Не удалось сохранить профиль на сервере.'});console.error(e);}
    if(previousLocation!==p.location){ world.onlineMetrics ||= {totalJoins:0,totalMoves:0,lastTickAt:0}; world.onlineMetrics.totalMoves+=1; const ev=appendWorldEvent(world,'player_moved',{playerId:id,name:p.name,faction:p.faction,from:previousLocation,to:p.location}); io.to('zone-world').emit('world:event',ev); await persistWorld(); }
    broadcastOnline();
  });
  socket.on('player:update', async input=>{
    const p=online.get(socket.data.playerId);if(!p)return;
    const oldLocation=p.location, oldFaction=p.faction;
    if(LOCATIONS.has(input?.location))p.location=input.location;
    if(FACTIONS.has(input?.faction))p.faction=input.faction;
    if(input?.name)p.name=clean(input.name,24)||p.name;
    p.lastSeen=Date.now();
    if(oldLocation!==p.location || oldFaction!==p.faction){
      world.onlineMetrics ||= {totalJoins:0,totalMoves:0,lastTickAt:0};
      if(oldLocation!==p.location)world.onlineMetrics.totalMoves+=1;
      const ev=appendWorldEvent(world,'player_state_changed',{player:publicPlayer(p),from:{location:oldLocation,faction:oldFaction}});
      io.to('zone-world').emit('world:event',ev); persistWorld().catch(e=>console.error('player state persistence:',e.message));
    }
    broadcastOnline();
  });
  socket.on('world:sync', input=>{
    if(!socket.data.playerId)return;
    socket.emit('world:sync',buildWorldSync(world,Number(input?.sinceRevision)||0));
  });
  socket.on('world:chat:send', async input=>{
    if(!socket.data.playerId)return;
    const text=clean(input?.text,240);if(!text)return;
    const p=online.get(socket.data.playerId);
    const m={id:crypto.randomUUID(),name:p?.name||'Сталкер',faction:p?.faction||'Одиночки',text,time:Date.now()};
    recentChat.push(m);if(recentChat.length>80)recentChat.shift();io.to('zone-world').emit('world:chat',m);
    try{await persistChat(m);}catch(e){console.error('chat persistence:',e.message);}
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
  socket.on('npc:interact', async input=>{
    const p=online.get(socket.data.playerId); if(!p)return;
    const npcId=String(input?.npcId||'').slice(0,48), action=String(input?.action||'');
    const npc=world.npcState?.[npcId];
    const result=interactWithNpc(npc,{id:p.id,location:p.location},action,Date.now(),{recentWorldEvent:world.zoneEvents?.at(-1)?.title||'',locationName:npc?.location,topicIndex:input?.topicIndex,friendName:world.npcState?.[npc?.friends?.[0]]?.name||'',rivalName:world.npcState?.[npc?.rivals?.[0]]?.name||''});
    socket.emit('npc:interaction-result',result);
    if(result.ok){ const syncEvent=appendWorldEvent(world,'npc_interaction',{npcId,playerId:p.id,action,relationship:result.relationship}); await persistWorld(); io.emit('world:event',syncEvent); io.emit('world:npc-state',{npcs:world.npcState,events:(world.npcEvents||[]).slice(-20),squads:world.npcSquads||[],memorial:world.npcMemorial||[]}); }
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
    world.diplomacy[p.faction][target]=Math.min(60,(world.diplomacy[p.faction][target]||0)+delta[action]);
    world.diplomacy[target][p.faction]=Math.min(60,(world.diplomacy[target][p.faction]||0)+Math.floor(delta[action]/2));
    const syncEvent=appendWorldEvent(world,'diplomacy_changed',{from:p.faction,to:target,action,delta:delta[action]});
    p.state=state.state;await persistPlayer(p.id,p.state);await persistWorld(); io.emit('world:event',syncEvent);
    io.emit('world:update',{world,notice:`${p.name} провёл дипломатическую миссию между «${p.faction}» и «${target}».`});
    socket.emit('diplomacy:result',{ok:true,state:p.state,world});
  });
  socket.on('disconnect',()=>{
    const id=socket.data.playerId,p=online.get(id);if(!p||p.socketId!==socket.id)return;
    online.delete(id);const ev=appendWorldEvent(world,'player_left',{playerId:id,name:p.name,faction:p.faction,location:p.location});io.to('zone-world').emit('world:event',ev);persistWorld().catch(e=>console.error('leave persistence:',e.message));systemMessage(`${p.name} покинул Зону.`);broadcastOnline();
  });
});

setInterval(async()=>{
  if(npcTickRunning)return; npcTickRunning=true;
  try {
    initSharedWorld(world, NPC_HOME, LOCATIONS, COOP_TEMPLATES);
    const now=Date.now(), events=tickNpcWorld(world,LOCATIONS,Math.random,now);
    const ecoEvents=tickEcosystem(world,Math.random,now);
    const soulEvents=tickSouls(world,LOCATIONS,Math.random,now);
    world.onlineMetrics ||= {totalJoins:0,totalMoves:0,lastTickAt:0}; world.onlineMetrics.lastTickAt=now;
    const tickEvent=appendWorldEvent(world,'world_tick',{npcEvents:events.length,activeNpcs:Object.values(world.npcState||{}).filter(n=>n.alive).length},now);
    io.emit('world:event',tickEvent);
    for(const event of [...events,...ecoEvents,...soulEvents]){const ev=appendWorldEvent(world,event.type,{...event},now);io.emit('world:event',ev);io.emit('world:npc-event',event);if(event.type==='npc_skirmish'||event.type==='mutant_migration')systemMessage(event.text);}
    await persistWorld(); io.emit('world:npcs',world.npcPositions);
    io.emit('world:npc-state',{npcs:world.npcState,events:(world.npcEvents||[]).slice(-20),squads:world.npcSquads||[],memorial:world.npcMemorial||[]});io.emit('world:ecosystem',world.ecosystem);
    io.emit('world:status',publicWorldStatus(world,online.size));
  }catch(e){console.error('NPC AI schedule:',e.message);} finally {npcTickRunning=false;}
},60*1000).unref();
setInterval(async()=>{
  const event={...ZONE_EVENTS[Math.floor(Math.random()*ZONE_EVENTS.length)],id:crypto.randomUUID(),at:Date.now()};
  world.zoneEvents ||= [];world.zoneEvents.push(event);world.zoneEvents=world.zoneEvents.slice(-30);const syncEvent=appendWorldEvent(world,'zone_event',event,event.at);
  try{await persistWorld();io.emit('world:zoneEvent',event);io.emit('world:event',syncEvent);io.emit('world:status',publicWorldStatus(world,online.size));}catch(e){console.error('Zone event:',e.message);}
},4*60*1000).unref();
initDb().finally(()=>server.listen(PORT,'0.0.0.0',()=>console.log(`ZONE ONLINE listening on ${PORT}`)));
