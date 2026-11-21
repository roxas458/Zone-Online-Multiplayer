'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');
const { Server } = require('socket.io');
const PORT = Number(process.env.PORT) || 3000;
const VERSION = require('./package.json').version;
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const MIME = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.mp3':'audio/mpeg','.ogg':'audio/ogg','.mp4':'video/mp4'};
function send(res,status,body,type='text/plain; charset=utf-8'){res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(body);}
const server=http.createServer((req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD')return send(res,405,'Method Not Allowed');
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{return send(res,400,'Bad Request')}
 if(pathname==='/health')return send(res,200,JSON.stringify({ok:true,service:'ZONE ONLINE MULTIPLAYER',version:VERSION,mode:'multiplayer-preview',onlinePlayers:players.size,timestamp:Date.now()}),'application/json; charset=utf-8');
 const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');let file=path.resolve(PUBLIC_DIR,relative);
 if(!file.startsWith(PUBLIC_DIR+path.sep)&&file!==path.join(PUBLIC_DIR,'index.html'))return send(res,403,'Forbidden');
 try{if(!fs.existsSync(file)||!fs.statSync(file).isFile())file=path.join(PUBLIC_DIR,'index.html');const stat=fs.statSync(file);res.writeHead(200,{'Content-Type':MIME[path.extname(file).toLowerCase()]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':path.extname(file)==='.html'?'no-cache':(process.env.NODE_ENV==='production'?'public, max-age=3600':'no-cache'),'X-Content-Type-Options':'nosniff'});if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res)}catch(error){console.error('Static request failed:',error);send(res,500,'Internal Server Error')}
});
const io=new Server(server,{serveClient:true,transports:['websocket','polling'],cors:{origin:true},pingInterval:20000,pingTimeout:45000});
const players=new Map();
function publicRoster(){return [...players.values()].map(({id,name,faction,location,joinedAt})=>({id,name,faction,location,joinedAt}));}
io.on('connection',socket=>{
 socket.on('zone:join',(raw,ack)=>{
  const data=raw&&typeof raw==='object'?raw:{};
  const name=String(data.name||'Сталкер').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,24)||'Сталкер';
  const faction=String(data.faction||'Одиночки').slice(0,32);
  const location=String(data.location||'cordon').replace(/[^a-z0-9_-]/gi,'').slice(0,32)||'cordon';
  const player={id:socket.id,name,faction,location,joinedAt:Date.now()};players.set(socket.id,player);
  socket.data.zonePlayerId=socket.id;
  io.emit('zone:roster',publicRoster());socket.broadcast.emit('zone:player-joined',player);
  if(typeof ack==='function')ack({ok:true,playerId:socket.id,onlinePlayers:players.size});
 });
 socket.on('zone:request-roster',()=>socket.emit('zone:roster',publicRoster()));
 socket.on('zone:move',(raw)=>{const p=players.get(socket.id);if(!p||!raw||typeof raw!=='object')return;const location=String(raw.location||'').replace(/[^a-z0-9_-]/gi,'').slice(0,32);if(!location)return;p.location=location;socket.broadcast.emit('zone:player-moved',{id:p.id,location});});
 socket.on('disconnect',()=>{if(players.delete(socket.id)){io.emit('zone:player-left',{id:socket.id,onlinePlayers:players.size});io.emit('zone:roster',publicRoster());}});
});
server.listen(PORT,'0.0.0.0',()=>console.log(`ZONE ONLINE ${VERSION} listening on ${PORT} · Socket.IO enabled`));
function shutdown(signal){console.log(`${signal}: shutting down ZONE ONLINE`);io.close(()=>server.close(()=>process.exit(0)));setTimeout(()=>process.exit(1),10000).unref();}
process.on('SIGTERM',()=>shutdown('SIGTERM'));process.on('SIGINT',()=>shutdown('SIGINT'));
