# ZONE ONLINE 2.2 — Shared World Systems

## What's online now
- One global world: players no longer need to join the same private room.
- Live global player roster, with nickname, faction, health and current sector.
- Location updates are broadcast to all connected players; the map view also shows other players in your current sector.
- Global PDA chat visible to everyone online.
- Persistent server-side player profiles: nickname, faction, location, money, health, XP, inventory, equipment, quests, achievements and other game progress are stored as the player's state.
- Shared server-side faction diplomacy. Diplomatic actions are validated and applied on the server; changes are broadcast to everyone.
- Shared NPC positions: named characters move between sectors on a server timer, and every connected client receives the same positions.
- Shared co-op objectives: players join a common task, travel to its target sector, contribute an arrival, and receive a reward when the group requirement is met.
- Server-validated vendor purchases and sales while online. Item quantities and ruble balances are updated in the server profile.
- Player-to-player trade offers with accept/decline. Completion uses a PostgreSQL transaction to lock both profiles and atomically transfer items and rubles.
- Automatic reconnection and profile restoration by browser player ID.
- PostgreSQL persistence for player profiles, diplomacy/world state and chat history.
- `/health` and `/api/status` endpoints.

## Important persistence setup on Render
The game server can run without a database for a quick test, but in-memory mode loses server-side profiles and shared world state whenever the service restarts or sleeps. For a persistent online game, attach PostgreSQL:

1. In Render, create a PostgreSQL database in the same region as the Web Service.
2. Open the database page and copy its **Internal Database URL**.
3. Open the Web Service → Environment → add `DATABASE_URL` with that URL.
4. Save changes and redeploy.
5. Open `/health`; `database` should show `postgres`.

Do not publish the database URL or put it in frontend code. Keep it only in Render's server environment variables.

## Deploy/update
- Runtime: Node
- Build command: `npm install` (or `yarn install` if you use Yarn)
- Start command: `npm start` (or `yarn start`)
- Node 18+
- Render assigns `PORT` automatically.

Commit the contents of this project folder to the root of your GitHub repository. The root must contain `package.json`, `server.js`, `render.yaml`, and `public/index.html`.

## Local test
```bash
npm install
npm start
```
Open `http://localhost:3000` in two browsers. Both will enter the same global Zone automatically; no room code is needed.

## Current scope and honest limitations
- This is a persistent online browser RPG, not a 3D real-time shooter. Other players are represented by their online profiles and sector presence.
- Player progression is individually owned and saved on the server. Global chat and diplomacy are shared.
- NPC positions are shared, but NPC dialogue, daily routines, most story quests, exploration rewards, crafting and many progression rules still run in the browser. This is not yet a fully server-authoritative MMORPG.
- Vendor purchases/sales and co-op rewards are server-side when connected. Player-to-player item/currency trades require PostgreSQL; without it, the server rejects trade completion rather than risking an in-memory-only transfer.
- There is no email/password account system yet. The current profile identity is a random browser ID stored in localStorage, so clearing browser storage or switching devices does not automatically recover the same account.
- Server validation covers the new online transactions, but the general profile-save endpoint still accepts a client game state. A determined client can still modify local-only progression; full anti-cheat requires moving more game rules to the server.
- If the service runs without `DATABASE_URL`, it deliberately falls back to memory mode for development; that is not persistent across restarts.
- Use HTTPS on deployment. Chat is public to all connected players and is not end-to-end encrypted.

## Original fan project
The interface, icons and map graphics are original fan-made assets inspired by the genre. This project is not affiliated with or endorsed by GSC Game World.
