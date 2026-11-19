# Changelog

## 4.5.0 — ONLINE WORLD
- Added a monotonic world revision and bounded 500-event replication journal.
- Added reconnect recovery: replay missed world events or fall back to a complete snapshot.
- Added shared event replication for player presence, sector movement, NPC ticks/encounters, wars, diplomacy and discovered points.
- Added read-only world status, snapshot and event-history HTTP endpoints.
- Added multiplayer status UI with online count, living NPC count, active wars, sector count and revision cursor.
- Added an in-process guard to prevent overlapping NPC world ticks.
- Preserved existing 4.4 NPC AI, 4.3 WAR SYSTEM and earlier save migrations.
- Added automated tests for revision ordering, event replay, stale-cursor snapshot recovery and world status.
- Documented the single-authoritative-process deployment model and requirements for future horizontal scaling.

## 4.4.0 — NPC AI
- Added persistent server-side NPC profiles, roles, faction assignments and needs.
- Added autonomous patrol, travel, trade, search and rest behaviors.
- Added shared NPC movement updates and PDA event notifications.
- Added simulated hostile encounters with health, morale and death state.
- Added server-validated player/NPC interactions and per-player trust.
