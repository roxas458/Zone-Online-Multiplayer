# ZONE ONLINE 4.33.0 — Survival & Expeditions

This build removes account registration and login completely. Players enter as guests with a browser-stored UUID. Existing local game saves are retained; old account tokens are cleared from local storage and are no longer sent to the server.

## Multiplayer changes
- The server registers a guest player, sends the small `player:hello` acknowledgement first, and only then queues the world snapshot. This prevents a large world payload from delaying the acknowledgement over Socket.IO long-polling.
- The initial `player:ready` snapshot omits internal NPC state. A compact public NPC roster is sent separately.
- Socket.IO listeners are installed before the client explicitly calls `connect()`.
- Polling is attempted first and may upgrade to WebSocket.
- A separate `zonePlayerReady` state prevents NPC interactions from being sent before the server has hydrated the player.
- NPC rumor interactions remain available offline with local fallback dialogue.

## NPC and faction additions
- Every faction has one dedicated medic and one technician, assigned to existing generated NPCs so the roster does not inflate.
- Medics restore up to 35 health for 75 RU.
- Technicians repair equipped armor by up to 35 condition points for 100 RU.
- Generated NPC names use an expanded first-name/surname pool and deterministic unique surnames.

## Deploy to Render
- Build command: `yarn install` (or `npm install`)
- Start command: `yarn start` (or `npm start`)
- Health check: `/health`
- PostgreSQL is optional for multiplayer. Without `DATABASE_URL`, player/world state is held in memory and resets when the Render service restarts. Local browser saves remain on the player's device.

## Verify
- `/health` should return `ok: true` and version `4.33.0`.
- `/api/diagnostics` should report `multiplayer: true` and `guestMode: true`.
- Render logs should show `[socket] connected`, `player:hello received`, `player:hello ack sent`, and `player:hello completed`.
- For two-player verification, open the game in two separate browsers/devices and confirm both appear in the online player list.

Automated tests do not prove the live Render deployment is healthy; the deployed service and two real browser clients must still be checked.


## 4.32.0 — Fieldwork & Living Zone expansion
- Timed 60-second sector surveys with discovered points and local threat reports.
- Detector-based artifact searches with stamina cost, heat cooldown and location/anomaly modifiers.
- Tactical map overlays for mutant packs and anomaly fields from the shared ecosystem.
- Persistent personal field notebook stored with the local player save.
- Renegades added as a valid faction with swamp NPCs and Dark Hollow territory; zombified stalkers added to mutant ecology.
- NPC relationship activity now costs supplies and has a six-hour cooldown; no free reputation gain.


## 4.33.0 — Survival & Expeditions

- Real-time hunger/thirst pressure, field rest and temporary shelter.
- Pack preparation consumes a ration and water before a sector journey.
- Sector travel now costs stamina and supplies and adds radiation exposure by route risk.
- Mutant hunting resolves on the server in multiplayer and persists the pack population and trophy reward.
- New survival status panel and event log in Living Zone.


### Version 4.33.4 — Full Legacy NPC Callsign Migration
All non-story NPC records are migrated to humorous two-part stalker callsigns on world bootstrap. Canonical named story characters remain unchanged.


Version 4.33.4 additionally migrates NPC names stored in old browser saves, including locally-created `wander_*` NPCs. Only canonical story NPC IDs retain their authored names.


### Version 4.33.9 — Multiplayer target and stalker callsigns
The browser now connects to the configured Render multiplayer service by default, with WebSocket-first and polling fallback. Diagnostics expose the server Node.js version. Generated NPCs use a curated two-part stalker callsign generator; old generated names migrate deterministically while canonical story characters remain unchanged.

### 4.33.11 — Multiplayer connection reliability patch
- Socket.IO browser loading now has bounded timeouts for the local server endpoint and CDN fallback, and exposes a reusable loader for automatic retries.
- Local development on `localhost`, `127.0.0.1`, `0.0.0.0` or `::1` defaults to the current origin instead of the public Render URL; stale Render URLs are cleared from local storage in local development.
- A failed Socket.IO script load triggers a fresh load attempt automatically rather than leaving the client offline indefinitely.
- The HTTP server starts listening immediately while PostgreSQL initializes in the background. Player profile handshakes wait for that initialization to finish (or enter the existing memory fallback), avoiding a race with database restoration.
- Render explicitly sets `NODE_ENV=production`.
- Added regression tests for the connection loader, local URL selection, server startup ordering and Render environment.


### 4.33.12 — PDA stalker leaderboard
- Added a PDA-style Top 20 stalkers screen with two-column dossier layout inspired by the supplied reference image.
- Added live server leaderboard updates and `/api/leaderboard` endpoint.
- Player NPC victories increase the player's score; NPC-vs-NPC combat increments the killer NPC's combat statistics.
- Leaderboard data is stored inside the persistent shared world and falls back to local NPC/player statistics when the multiplayer server is unavailable.
- Added selected-stalker dossier, faction, role, location, rank, kills, losses, score and current player position.


## 4.33.14 — PDA faction ranking
- Added a Call of Pripyat-inspired faction standings panel with rank, base location, strength score, relationship matrix, and local faction emblems.
- Ranking derives from faction influence, roster size, controlled territory, patrol strength, and recorded faction wins; it refreshes while the Statistics view is open.
- Includes a selected faction dossier and responsive PDA layout.
