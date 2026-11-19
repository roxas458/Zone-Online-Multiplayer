# Changelog

## 4.1.0 — Chronicle & Survival

- Added the Great Swamps sector and server-side location validation.
- Added 65 additional points of interest across the map.
- Added 11 named NPCs, including faction leaders/representatives.
- Added faction leader dossiers for all nine factions, with canon-vs-original notes.
- Added a timeline archive covering the broad story periods of the original trilogy.
- Added five original story missions across three chapters.
- Added food and water supplies, hunger/thirst meters, and time-based survival needs.
- Added new food items to the client shop and server-side trading whitelist.
- Added profile migration for hunger, thirst, new NPCs, quests, points and faction dossiers.


## 4.2.0 — LIVING ZONE
- Added the Living Zone PDA section: NPC relationship scores, faction rank progression, repeatable camp interactions, rumors and contract board.
- Added contract acceptance and turn-in checks with money, XP and reputation rewards.
- Added patrol sightings, territory influence operations and control transfer events.
- Added emission warning/shelter gameplay hooks to world-time progression.
- Added modular domain helpers under `src/systems/` for reputation, relationships, ranks, contracts, patrols, territories, emissions, rumors and camp life.
- Existing local saves are migrated in place; existing player progress is preserved.
