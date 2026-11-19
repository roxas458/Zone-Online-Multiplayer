# ZONE ONLINE 4.8.0 — REAL STALKER LIFE

## Added
- Real-time-only game clock based on the device wall clock. Day count advances once per real 24-hour period from the first 4.8 launch; displayed hour/minute follow local device time.
- Removed the time fast-forward control. Exploration, travel, rest, searching, POI discovery and camp actions no longer increment the in-game clock or consume simulated hours.
- Offline local-world pulse runs on a 15-minute wall-clock cadence; connected play continues to use the authoritative server scheduler.
- Increased the persistent generated server-side stalker roster from 36 to 60. Existing NPC IDs and biographies remain intact; new IDs are appended.
- Expanded the weapon catalogue with additional pistols, shotguns, rifles, assault rifles and special weapons.
- Added the Encyclopedia PDA section with searchable dossiers for sectors, points of interest, factions, NPCs, weapons, mutants and artifacts.
- Added three additional discoverable points of interest to every existing sector/map location.

## Stability
- Kept the 4.7.1 client bootstrap ordering and multiplayer handshake unchanged.
- Made replacement-NPC nickname generation bounded so deterministic/random test sources cannot cause an infinite name-collision loop.
- Existing browser saves are migrated in place; no save reset or database schema migration is required.

## Verification
- `npm run check`
- `npm test` — 26 tests passing.
