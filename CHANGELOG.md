# Changelog — ZONE ONLINE 4.7.1 SOULS OF THE ZONE — STABILITY PATCH

## Multiplayer reliability fixes
- Fixed missing `safeState` initialization that caused `player:hello` to throw before emitting `player:ready`.
- Added Socket.IO handshake acknowledgement and explicit error responses.
- Added client-side 12-second handshake timeout, connect-error feedback, reconnect status and polling-to-WebSocket upgrade.
- PostgreSQL failures now fall back to in-memory mode rather than leaving a connected player stuck during profile loading.
- Prevented stale duplicate sockets for a reconnecting player ID.

## Souls of the Zone
- Added persistent NPC biographies, quirks, friend and rival links.
- Added NPC squads with shared membership, movement and simulated raids.
- Added memorial entries and replacement stalkers after NPC deaths.
- Added personalized long-form server-side dialogue using biography, relationships, social links and recent events.
- Dialogue topics are now fetched from the server, and rotate on the 15-minute cycle.
- Added NPC panel sections for squads and the memorial.

## Compatibility
- Existing player saves and world state are retained; new NPC fields are initialized lazily.
- Existing WAR SYSTEM, ONLINE WORLD, ecosystem, markets and clans remain in place.


## 4.7.1 — STABILITY PATCH
- Fixed critical client startup ReferenceError caused by the first render accessing `serverWorld` before its `let` initialization.
- Added browser bootstrap and all-view smoke tests.
- Added same-origin Socket.IO loading with CDN fallback.
- Added configurable multiplayer server URL and clearer connection diagnostics.
- Preserved all existing 4.7 gameplay systems and saves.
