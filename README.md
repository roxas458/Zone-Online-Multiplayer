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
