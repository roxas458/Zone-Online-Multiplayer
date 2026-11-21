# ZONE ONLINE 4.34.0 — Multiplayer Foundation

This build begins the multiplayer return without replacing the existing local game simulation.

## Phase 1 included
- Same-origin Socket.IO server hosted by the existing Render web service.
- Connection status on the home screen.
- Live online-player roster with callsign, faction and current location.
- Reconnection handling and health endpoint.
- Client sends presence metadata only; local save, money, inventory and progression are not uploaded.

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000. Open a second browser/private window to see both sessions in the roster.

## Render
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/health`
- Node: 22.16.0

## Important scope
This is the first multiplayer milestone: connection and presence only. It does not yet synchronize movement in real time, combat, NPC/world state, inventory, trading, quests, faction wars, or saves. Those systems will be added in separate stages with server-side validation. The single-player simulation and browser-local save remain available when the server is offline.
