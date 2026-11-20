# Stability report — 4.20.0

## Automated checks
- `npm run check`: passed (server, browser client and system JavaScript syntax checks).
- `npm test`: passed, 55 tests.
- Added tests for faction-based NPC home assignment, stable base guard behavior and hostile-border assault dispatch.

## NPC simulation notes
- NPC AI remains server-authoritative and runs on the existing 60-second world tick.
- Normal behavior is stationary: campfire, guard post or rest. Decisions are spaced across 5–18 minutes; patrols are limited to adjacent friendly sectors.
- Generated NPCs are distributed only into sectors controlled by their faction at bootstrap/migration.
- Hostile territory entry requires a temporary server-side order. Border assaults are dispatched probabilistically when at least three eligible squad members are available.
- A winning assault creates an occupation garrison; unsupported units are routed back toward friendly territory.
- Battles remain abstract server-side simulations; no real-time 3D combat/ballistics are implemented by this update.

## Runtime note
A full HTTP server launch was not completed because dependencies (`express`, `socket.io`, `pg`) are not installed in this build environment. Run `npm install` before `npm start`. PostgreSQL is optional; without `DATABASE_URL`, the world uses memory mode and will not persist after a server restart.

## Remaining boundaries
- Base camp behavior is represented as authoritative NPC state and map/PDA labels; individual animated campfire scenes are not yet part of the 2D global map.
- Assaults and territory capture are strategic simulations, not a tactical RTS battle interface.
- Client-side PDA rendering still uses the existing SVG map renderer; this update adds no new heavy animation loop.


## 4.21.0 account and faction-start verification
- Account endpoints and DB schema syntax checked.
- Password derivation uses asynchronous scrypt with per-account salt; bearer tokens are stored as SHA-256 digests.
- Cross-device account functionality requires PostgreSQL; memory mode returns HTTP 503 for account creation/login.
- Faction spawn and sector-local chat behavior covered by tests.
- Automated suite: 57 tests passed; JavaScript syntax check passed.
- Live PostgreSQL integration and browser-to-browser session test remain deployment checks because no production database/browser session was available in this build environment.
