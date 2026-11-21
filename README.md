# ZONE ONLINE 4.33.19 — Single-player

ZONE ONLINE is now a browser-based single-player RPG. Render hosts the web application; the game no longer creates player sessions, connects to Socket.IO, or requires a shared-world service.

## Run locally

```bash
npm start
```

Open `http://localhost:3000`. The server uses Node.js built-in HTTP modules and has no runtime package dependencies.

## Deploy to Render

Create or update a **Web Service** from this repository. Render reads `render.yaml`, runs `npm install` and `npm start`, and checks `/health`. No PostgreSQL database, `DATABASE_URL`, WebSocket configuration, or Socket.IO service is required.

## Saves

The game stores the player's save in the browser's `localStorage`. Saves are local to the browser/device and are not synchronized between devices. Clearing browser site data can erase the local save; export/backup support should be used for important saves.

## Version 4.33.19

- Removed multiplayer navigation, player lists, chat, direct messages, player trading, and shared-world connection bootstrapping.
- Removed Socket.IO and PostgreSQL runtime dependencies and the old socket server.
- Replaced the backend with a dependency-free Node.js static host and `/health` endpoint for Render.
- Kept local browser saves and converted selected server-gated actions to local single-player behavior.
- Repaired PDA navigation with delegated click handling and per-tab content refresh.
- Added the missing System tab with interface preferences and save import/export controls.
- Added navigation integrity regression tests for every PDA tab.
