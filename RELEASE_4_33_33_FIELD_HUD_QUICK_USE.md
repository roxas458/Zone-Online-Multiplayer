# ZONE ONLINE 4.33.33 — FIELD HUD & QUICK USE

- Removed health, hunger, and thirst text values from the top header stats.
- Added compact hunger, thirst, radiation, and stamina indicators above the survival HUD.
- Added four quick-use slots for anti-rad, medkits, bandages, and food. Counts update with the inventory; tapping a slot uses the item without opening the backpack.
- Kept the existing health/stamina tick meters and weapon condition panel.
- Reduced repeated map-sector DOM work by caching the rendered sector list until its data or selected/current location changes. The detailed SVG map remains lazy-rendered when it is dirty and needed.
- Responsive quick-use placement is raised above the survival panel on mobile to avoid overlapping controls.

Validation: `npm run check` and all 172 tests pass.
