# ZONE ONLINE 4.32.0 — Stability & Feature Report

## Implemented
- 60-second timed sector survey; abandoning the sector interrupts the survey.
- Survey results reveal up to two undiscovered local points and report mutant/anomaly activity.
- Artifact search requires a detector, spends stamina, has a 20-second cooldown, and uses local anomaly/field-intel modifiers.
- Map overlay renders mutant packs and anomaly fields in Zone overview and local map; a deterministic local fallback keeps the map useful without multiplayer.
- Personal field notebook stores up to 100 entries in the browser save.
- NPC relationship activity now requires the NPC to be in the same sector, costs 50 RU, has a six-hour per-NPC cooldown, and grants only +1 relationship with no free reputation.
- Renegades are a valid faction, with named NPCs in the Swamps, supporting NPC roster, hostile faction rules, and Dark Hollow as their starting territory. A guarded migration only changes the untouched default Dark Hollow owner; captured territory is preserved.
- Zombified stalkers are included in mutant pack ecology and the encyclopedia.

## Validation
- `npm test`: 84 tests passed.
- `npm run check`: passed (Node syntax checks for server and client modules).

## Not claimed as verified
- This package was not deployed to the user's Render service from this environment.
- External multiplayer behavior and cross-device synchronization of field notes have not been end-to-end tested. Field notes are local browser-save data.
- No claim is made that all possible gameplay balance issues have been eliminated.
