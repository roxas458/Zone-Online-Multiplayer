# ZONE ONLINE 4.33.27 — compact proximity and sector travel

- NPC dialogue radius reduced to 8 map meters.
- Player/NPC combat radius reduced to 18 map meters.
- NPC-vs-NPC skirmish radius reduced to 22 map meters.
- Map radius overlays and interaction messages use the same values.
- Selecting a sector on the whole-Zone map asks for confirmation and starts a routed expedition online (or updates the offline sector).
- Whole-Zone mode opens the map fullscreen; a fixed-position fallback is included for browsers without Fullscreen API support.
- Removed rectangular movement blockers that trapped players at map structures; map-edge bounds remain enforced.
