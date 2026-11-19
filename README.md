# ZONE ONLINE 4.4 — NPC AI

ZONE ONLINE 4.4 extends 4.3 WAR SYSTEM with a server-authoritative simulation layer for non-player stalkers.

## NPC simulation
- Persistent NPC profiles with faction, role, location, destination, action, health, morale, supplies and recent activity history.
- Autonomous schedule ticks: patrol, travel, trade, search and rest.
- NPC movement updates the shared world position map.
- Hostile NPCs that meet in one sector can trigger a simulated skirmish; damage, morale and death state are recorded.
- NPC events are broadcast to connected clients and surfaced in the PDA news feed.
- Player interaction supports greeting, asking for information, trading conversation and helping; trust is stored per NPC/player pair.

## Server events
- Client → server: `npc:interact` with `{ npcId, action }`; actions: `greet`, `ask`, `trade`, `help`.
- Server → client: `npc:interaction-result` with success/reply/trust or reason.
- Server → all clients: `world:npc-state`, `world:npc-event`, and `world:npcs`.

The server owns NPC state and movement. Client-side display is not authoritative. NPC ticks run once per minute. The existing PostgreSQL `zone_world` JSON state stores NPC profiles and event history; memory mode remains available but does not survive server restarts.

## Run

```bash
npm install
npm test
npm run check
npm start
```

Set `DATABASE_URL` to PostgreSQL for persistent shared-world state.

## Roadmap
- 4.4 NPC AI: persistent autonomous NPC simulation.
- 4.5 ONLINE WORLD: stronger multiplayer synchronization, world event replication, reconnect recovery and authoritative simulation scheduling.
