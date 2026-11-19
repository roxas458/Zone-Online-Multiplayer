# ZONE ONLINE — Multiplayer prototype

## What is multiplayer now
- Room-based multiplayer (players with the same room code meet each other).
- Live online player list.
- Shared PDA chat.
- Location and faction presence synchronization.
- Automatic reconnect is not forced; players can reconnect using the same room code.

The RPG economy, quests, inventory and NPC progression remain per-player/local at this stage. This avoids players overwriting each other's saves. The next step can add server-side shared world state, persistent accounts and co-op quest progression.

## Run locally
1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000` in two browser tabs/devices.
5. Use the same room code in both clients.

## Deploy on Render
- Create a new **Web Service** from this project repository.
- Runtime: Node.
- Build command: `npm install`
- Start command: `npm start`
- Render will provide `PORT`; the app reads it automatically.
- No environment variables are required for this prototype.

The in-memory room list and chat are cleared when the server restarts. Do not use this prototype for private information; chat is not end-to-end encrypted.


## Build 0.3 — Call of Pripyat-inspired update

- PDA-style interface refresh and responsive inventory grid.
- Equipment slots for suit, primary weapon and detector.
- Additional Zone sectors: Zaton, Jupiter, Yanov, Kopachi, Volkhov AA and Iron Forest.
- Schematic interactive Zone map with travel nodes.
- Random generated stalkers, personal greetings and topic-based conversations; some wander between sectors as time advances.
- Faction emblems, diplomatic channels, information exchange and trade agreements.
- Achievement journal.
- Existing local saves are migrated automatically; player progress is retained.
- Multiplayer location synchronization accepts the additional sectors.

Visual assets in this fan project are original interface elements and symbols inspired by the atmosphere of S.T.A.L.K.E.R.; original game artwork and extracted assets are not included.
