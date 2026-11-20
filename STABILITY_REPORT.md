# Stability report — 4.17.0

- Canonical map asset replaced with the exact labeled image supplied by the project developer.
- Global map and location anchors updated to 17 user-labeled regions.
- Legacy location IDs are migrated in browser saves; the visible map and server validation use only the new canonical sector set.
- NPC direction indicators, optional route overlays and mouse-wheel zoom added.
- Validation: `npm run check` passes.
- Automated tests: `npm test` passes (47/47).

Known limitation: NPC direction is currently an orientation hint unless the NPC has explicit direction/heading data. Route lines render only when route data is supplied by the world simulation. Detailed local sector maps and exact building collision meshes remain future work.

# ZONE ONLINE 4.7.1 — Stability audit report

## Critical defect found and fixed

The browser client called `render()` before initializing the multiplayer globals:
- `serverWorld`
- `zoneSocket`
- `onlinePlayers`
- `serverChat`
- `incomingTrades`
- `applyingServerState`

The initial `render()` calls `renderPeople()` -> `nearbyNpcs()` -> `syncNpcRosterToClient()`. That function reads `serverWorld`, which was declared later with `let`. JavaScript throws `ReferenceError: Cannot access 'serverWorld' before initialization` (temporal dead zone). This aborts the rest of the client script, so the game may partially display while many interactions and multiplayer initialization never run.

The multiplayer globals are now initialized before the first render.

## Additional repairs

- Socket.IO browser client loads from the local game server first and falls back to the official Socket.IO CDN.
- Multiplayer view now has a configurable server origin. Leave blank when game and backend share an origin; enter the deployed Node/Render origin when the frontend is hosted separately.
- Connection failures show the address and error context rather than appearing as an unexplained endless connection.
- Existing saves and gameplay systems are retained; no save reset or schema wipe was introduced.

## Automated checks

- `npm run check`: passed.
- `npm test`: 24 passed, 0 failed.
- Browser client bootstrap smoke test: passed.
- Main view navigation smoke test: all 17 views opened without a JavaScript exception.
- Static audit: no duplicate HTML IDs, no unresolved literal `$()` DOM IDs, no missing inline click handlers.

## Deployment verification still required

The archive was syntax-checked and its pure/client tests passed. A live production Socket.IO + PostgreSQL test cannot be completed without installing the production dependencies and knowing the deployed server origin/environment variables. The attempted dependency install did not complete in this environment.

After deploying:
1. Set the Node service start command to `npm start` and build command to `npm install`.
2. Open `https://YOUR-SERVER/health`; verify `ok: true`.
3. If the browser frontend is hosted on another domain, open Multiplayer, enter `https://YOUR-SERVER` in "Адрес игрового сервера", and press "Подключиться / переподключиться".
4. If frontend and backend are served by the same Node service, leave that field empty.
5. Verify two browser sessions appear in each other's online list.

## 4.14.0 verification
- `npm run check`: passed.
- `npm test`: 46/46 passed, including squad travel, role, journal, escort, and encounter source-level integration checks.
- ZIP integrity checked after packaging.
- Live Render/PostgreSQL multiplayer session and physical mobile devices were not available for runtime verification.


## 4.15 — FREE ROAM MAP
- Added the supplied aerial Zone map as the shared cartographic background.
- Added overview and current-location map modes with sector, NPC, player and discovered-cache markers.
- Added click-to-walk, WASD/arrow-key movement and touch movement controls.
- Added validated multiplayer position updates; position is scoped to the player's current sector.
- Local map uses schematic sector centers and a bounded movement area; detailed collision/navigation mesh and physical-device testing remain future work.
