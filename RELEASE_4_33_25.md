# ZONE ONLINE 4.33.25 — Fullscreen Tactical Map & Slow Free-Roam Movement

## Changes
- Expanded the tactical map to use the full available frame width and a much taller viewport while preserving the original satellite-map proportions.
- Added a dedicated fullscreen control for the map.
- Added pointer-based map panning on desktop and touch devices; dragging the map no longer issues a movement order.
- Kept wheel and zoom-button controls, with zoom centered on the current map view.
- Map clicks now work in both overview and local modes: a click in another sector requests an expedition; a click in the current sector issues a precise movement order.
- Reduced online server movement speed from 7 to 2.5 world units per second and matched offline movement to the same speed.
- Preserved the supplied satellite-map asset, faction marker colors, NPCs, caches, and existing game systems.

## Verification
- `npm run check` passed.
- `npm test` passed: 137 tests.
