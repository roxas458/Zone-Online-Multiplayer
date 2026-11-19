# ZONE ONLINE 3.0 — Expanded PDA RPG

Browser RPG update based on the supplied ZONE ONLINE 2.2 project.

## New in 3.0
- PDA inventory with search, category filters, sorting, item weight, prices and equipment condition.
- Dedicated weapon catalogue with 24 fictional in-game entries across pistols, shotguns, assault rifles, rifles and special equipment.
- Weapon entries can be discovered while investigating location points and added to the backpack.
- Authored key points for all 15 sectors, including safe areas, routes, research sites, stashes and anomaly locations.
- Each point can be investigated; discovery grants XP and may reveal equipment.
- Expanded generated NPC population across sectors, using varied names and roles.
- Original abstract item/weapon glyphs and a custom visual style. No proprietary S.T.A.L.K.E.R. game icons or extracted assets are included.
- Existing local saves are migrated without intentionally resetting player progress.

## Run locally
Node.js 18 or newer:
```bash
npm install
npm start
```
Open `http://localhost:3000`.

## Render
Keep the existing Web Service and PostgreSQL configuration:
- Build: `npm install`
- Start: `npm start`
- Environment: `DATABASE_URL` set to the Render PostgreSQL Internal Database URL.

## Notes
This remains a browser RPG, not a 3D shooter. The PDA, NPC dialogue, exploration and most quest mechanics are client-side game systems; the existing global multiplayer server handles presence, chat, profiles and the shared systems already implemented in 2.2. The weapon catalogue is an original game-facing reference, not a reproduction of proprietary source assets. The original S.T.A.L.K.E.R. icons are not bundled.
