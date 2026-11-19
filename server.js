const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, methods: ["GET", "POST"] },
  pingInterval: 25000,
  pingTimeout: 20000
});

const PORT = process.env.PORT || 3000;
const rooms = new Map();
const LOCATION_NAMES = {
  cordon: "Кордон", dump: "Свалка", bar: "Росток / Бар",
  agro: "Агропром", dark: "Тёмная долина", yantar: "Янтарь",
  army: "Армейские склады", red: "Рыжий лес", pripyat: "Припять"
};
const LOCATIONS = new Set(Object.keys(LOCATION_NAMES));

app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => res.json({ ok: true, service: "zone-online-multiplayer" }));

function cleanText(value, max) {
  return String(value ?? "").replace(/[<>]/g, "").trim().slice(0, max);
}
function roomState(room) {
  const r = rooms.get(room);
  if (!r) return [];
  return [...r.players.values()];
}
function broadcastPlayers(room) {
  io.to(room).emit("players:update", roomState(room));
}
function system(room, text) {
  const r = rooms.get(room);
  if (!r) return;
  const msg = { name: "Система", text, time: Date.now() };
  r.messages.push(msg);
  r.messages = r.messages.slice(-50);
  io.to(room).emit("system:message", msg);
}

io.on("connection", socket => {
  socket.on("room:join", payload => {
    const name = cleanText(payload?.name, 20) || "Сталкер";
    const room = cleanText(payload?.room, 12).toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!room) return socket.emit("room:error", { message: "Некорректный код комнаты." });

    if (socket.data.room) {
      const old = socket.data.room;
      socket.leave(old);
      const oldRoom = rooms.get(old);
      if (oldRoom) {
        oldRoom.players.delete(socket.id);
        system(old, name + " покинул комнату.");
        broadcastPlayers(old);
        if (!oldRoom.players.size) rooms.delete(old);
      }
    }

    if (!rooms.has(room)) rooms.set(room, { players: new Map(), messages: [] });
    const r = rooms.get(room);
    const location = LOCATIONS.has(payload?.location) ? payload.location : "cordon";
    const player = {
      id: socket.id, name,
      faction: cleanText(payload?.faction, 24) || "Одиночки",
      location, locationName: LOCATION_NAMES[location],
      joinedAt: Date.now()
    };
    r.players.set(socket.id, player);
    socket.data.room = room;
    socket.data.name = name;
    socket.join(room);
    socket.emit("room:joined", { room, players: roomState(room), messages: r.messages });
    system(room, name + " вошёл в Зону.");
    broadcastPlayers(room);
  });

  socket.on("player:update", payload => {
    const room = socket.data.room;
    if (!room || !rooms.has(room)) return;
    const r = rooms.get(room), p = r.players.get(socket.id);
    if (!p) return;
    if (LOCATIONS.has(payload?.location)) { p.location = payload.location; p.locationName = LOCATION_NAMES[payload.location]; }
    if (payload?.faction) p.faction = cleanText(payload.faction, 24);
    broadcastPlayers(room);
  });

  socket.on("chat:send", payload => {
    const room = socket.data.room;
    if (!room || !rooms.has(room)) return;
    const text = cleanText(payload?.text, 240);
    if (!text) return;
    const r = rooms.get(room);
    const msg = { name: socket.data.name || "Сталкер", text, time: Date.now() };
    r.messages.push(msg);
    r.messages = r.messages.slice(-50);
    io.to(room).emit("chat:message", msg);
  });

  socket.on("disconnect", () => {
    const room = socket.data.room;
    if (!room || !rooms.has(room)) return;
    const r = rooms.get(room);
    r.players.delete(socket.id);
    system(room, (socket.data.name || "Сталкер") + " покинул Зону.");
    broadcastPlayers(room);
    if (!r.players.size) rooms.delete(room);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`ZONE ONLINE server listening on ${PORT}`);
});
