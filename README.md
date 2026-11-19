# ZONE ONLINE 2.1 — Shared Zone Online

## What's online now
- One global world: players no longer need to join the same private room.
- Live global player roster, with nickname, faction, health and current sector.
- Location updates are broadcast to all connected players; the map view also shows other players in your current sector.
- Global PDA chat visible to everyone online.
- Persistent server-side player profiles: nickname, faction, location, money, health, XP, inventory, equipment, quests, achievements and other game progress are stored as the player's state.
- Shared server-side faction diplomacy. Diplomatic actions are validated and applied on the server; changes are broadcast to everyone.
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
- NPC conversations and most quest/economy rules still run in the player's game client; they are not yet a single authoritative shared NPC simulation. The next backend milestone is server-authoritative trading, shared NPC schedules, co-op quest state and anti-cheat validation.
- If the service runs without `DATABASE_URL`, it deliberately falls back to memory mode for development; that is not persistent across restarts.
- Use HTTPS on deployment. Chat is public to all connected players and is not end-to-end encrypted.

## Original fan project
The interface, icons and map graphics are original fan-made assets inspired by the genre. This project is not affiliated with or endorsed by GSC Game World.
