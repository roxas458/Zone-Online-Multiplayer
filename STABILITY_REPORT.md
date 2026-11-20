# Stability report — 4.19.0

## Automated checks
- `npm run check`: passed (server and browser JavaScript syntax checks).
- `npm test`: passed, 52 tests.
- Added coverage for faction hostility, NPC battles, convoys, anti-radiation market item, radiation HUD and PDA redraw behavior.

## Runtime note
A full HTTP server launch was not completed in this build environment because project dependencies (`express`, `socket.io`, `pg`) are not installed in the workspace. Install dependencies with `npm install` before running `npm start`.

## Known implementation boundaries
- NPC-vs-NPC warfare, battlefront records, convoy movement and ambushes are server-side simulations on the existing world tick.
- Player-vs-hostile-NPC combat uses the existing abstract turn-based combat UI; the server validates the final NPC defeat and records the memorial/event.
- Radiation exposure is currently advanced in the browser client on a one-minute interval; Anti-rad gives 12 minutes of local protection. A future server-authoritative survival pass should move player radiation state fully server-side.
- PDA map optimization removes periodic full SVG rebuilds and updates only the player marker during movement. Map markers refresh on authoritative NPC state updates.
