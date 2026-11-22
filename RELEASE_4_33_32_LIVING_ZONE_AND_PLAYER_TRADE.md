# ZONE ONLINE 4.33.32 — living Zone and player interactions

- Fixed map player trade action: it now opens a dedicated player-to-player offer sheet, not the NPC trader screen.
- Player-to-player trade is server-validated at a maximum distance of 8 map meters, both when offering and accepting.
- The self marker lists other online players and NPCs inside the 8-meter conversation radius.
- NPC map positions are server-authoritative and synchronized to clients.
- NPCs make decisions more frequently, patrol and move inside sectors, and can skirmish with hostile factions.
- Mutant packs migrate and can attack nearby NPCs, with cooldowns to avoid repeated damage spam.
- Traders receive larger capital and stock, including five weapons.
- Added energy drink, chocolate, nuts and smoked meat as usable foods.
- Added PM, AKS-74U, TOZ-34, AK-74 and Vintar-BC to shop and NPC inventories.

Validation: `npm run check`, `npm test`, archive integrity. Live Render multiplayer and visual UI behavior still require in-game confirmation.

## 4.33.34 — Sector travel and live map movement
- Sector selection on the Zone map now starts a route immediately without a blocking confirmation dialog.
- The player marker interpolates continuously between connected sector centers during an expedition, with a visible route and destination waypoint.
- The full-Zone map remains active during travel so the player can watch the marker move across the map.
- Local-map mode no longer has invisible sector hit areas intercepting clicks; clicks can place a walking waypoint normally.
- Added regression tests for click-to-travel and live marker interpolation.
