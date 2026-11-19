# ZONE ONLINE 4.7 — SOULS OF THE ZONE

ZONE ONLINE 4.5 extends 4.4 NPC AI and 4.3 WAR SYSTEM with revisioned shared-world replication and reconnect recovery.

## ONLINE WORLD features
- One authoritative server owns player presence, shared NPC state, faction warfare, territory ownership, world events and PDA news.
- Every replicated world mutation receives a monotonic revision and is recorded in a bounded 500-event journal stored inside the shared `zone_world` JSON state.
- Reconnecting clients send their last known revision. The server replays missed events when the cursor is recent, or returns a full snapshot when the journal no longer covers the gap.
- Socket.IO broadcasts player joins, departures, sector movement, NPC simulation ticks, NPC encounters, warfare, diplomacy and discovered points.
- A multiplayer status panel shows online players, living NPCs, active wars, sector count and the current world revision.
- Read-only HTTP endpoints: `/api/status`, `/api/world/snapshot`, and `/api/world/events?since=<revision>`.
- The NPC scheduler is guarded against overlapping ticks within the server process. World state and event history persist in PostgreSQL when `DATABASE_URL` is configured.

## Existing systems retained
- 4.4 NPC AI: autonomous stalker schedules, movement, encounters and relationships.
- 4.3 WAR SYSTEM: faction operations, deployments, capture results and rewards.
- 4.2 LIVING ZONE: relationships, ranks, contracts, patrols, emissions, rumors and camp life.

## Run

```bash
npm install
npm test
npm run check
npm start
```

Set `DATABASE_URL` to PostgreSQL for persistence across server restarts. Without PostgreSQL, the server uses memory mode and the shared world resets on restart.

## Deployment topology

This release is a single-authoritative-process multiplayer server. It synchronizes all connected clients attached to that server instance. For horizontal multi-instance deployment, add a Socket.IO PostgreSQL/Redis adapter, distributed scheduler leadership, and transactional world-event writes before running more than one game server process. The in-process NPC tick guard does not coordinate multiple server instances.

## ZONE ONLINE 4.6 — ECOSYSTEM

This release expands the persistent world with a procedural supporting-NPC roster and contextual dialogue.

### New systems
- **Procedural stalkers:** 36 persistent supporting NPCs with generated nicknames (for example, «Вадим Спагетти», «Вовка Табак», «Гена Пельмень»), faction, role, mood, supplies, health and location.
- **Long-form dialogue:** multi-paragraph greetings and replies, role-specific topics, personal-trust variations and context from recent world events. Dialogue topics rotate on a 15-minute world cycle and react to NPC history and current events.
- **Mutant ecology:** packs of mutants move between sectors; their numbers and aggression fluctuate and migration reports enter the world event feed.
- **Faction bases:** persistent base level, fortification and supplies. Players can upgrade a base belonging to their own faction for 500 ₽.
- **Clans:** players can create a faction-bound clan and other players of the same faction can join it.
- **Dynamic markets:** every sector tracks scarcity and a changing price index.

### Run
```bash
npm install
npm run check
npm test
npm start
```
Set `DATABASE_URL` to a PostgreSQL connection string for persistence across server restarts. Without PostgreSQL, the server runs in memory fallback mode.


## 4.7 SOULS OF THE ZONE
- Generated stalkers now receive persistent biographies, personality quirks, friends, rivalries and squad membership.
- NPC squads travel between sectors on simulated raids; their positions and status are part of the shared world state.
- NPCs that die are retained in a memorial record. After a short in-world grace period, a new wanderer joins the Zone under a fresh nickname.
- Dialogue topics are requested from the authoritative server, use the current NPC state and rotate on a 15-minute cycle. Biographies, recent world events, friendships and rivalries can influence replies.
- The NPC panel shows nearby characters, biographies, squad activity and recent memorial entries.

## Multiplayer connection repair
- Fixed a fatal server bootstrap error: the Socket.IO `player:hello` handler called `safeState` without creating it. The handler now uses `createSafeState(FACTIONS, LOCATIONS)`.
- The hello handshake now has an acknowledgement, explicit failure response and a 12-second client timeout, so the UI no longer remains in an endless connecting state after the socket transport connects but profile loading fails.
- The client prefers HTTP long-polling first and upgrades to WebSocket, with visible connect/reconnect/error status.
- Database read/write errors degrade to in-memory mode instead of preventing player login. `/health` reports whether PostgreSQL persistence is active.
- Replacing an existing session with the same player ID disconnects the stale socket before registering the new one.

## Run and deploy
```bash
npm install
npm run check
npm test
npm start
```
Set `DATABASE_URL` to a PostgreSQL connection string for durable player/world state. Without it, multiplayer works while the process is running, but world and profile persistence reset when the server restarts. Deploy the whole folder to the Node service; do not open `public/index.html` as a local file. The browser must load `/socket.io/socket.io.js` from the same deployed server origin. After deployment, open `https://YOUR-SERVER/health`; the response should contain `ok: true`. Then reload the game. If the page is still served from an old static-host URL while the socket points elsewhere, configure the client and server under the same origin or use an explicit Socket.IO server URL.
