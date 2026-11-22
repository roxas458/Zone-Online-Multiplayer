# ZONE ONLINE 4.33.35 — NPC MAP & PERFORMANCE

- Fixed NPC map coordinates to use authoritative server positions for both rendering and interaction checks.
- Prevented missing/null coordinates from being interpreted as `(0, 0)`.
- Added individual selectable NPC markers on the local map, with name, faction, role, status, health and dialogue action.
- Added selected NPC route display. Active sector routes and mission destinations are shown on the map.
- Kept the full-Zone overview lightweight by clustering NPCs into squads; each squad card now lets the player select any member and inspect their route.
- Synchronized NPC route, destination, mission order, direction and dialogue data to the client.
- Kept map rendering limited to the map view and added larger touch hit areas for NPC markers.

## Verification

- `npm run check` — passed.
- `npm test` — 176 tests passed.
