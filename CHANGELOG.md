# Changelog

## 4.33.4 — Stability and validation fixes
- Persisted player-state canonical fields are now clamped in the actual saved state, not only in the validation summary; zero HP remains zero.
- Existing PostgreSQL player records are normalized before being sent to clients or reused by server gameplay.
- `/api/status` reports the running package version instead of a stale 4.33.0 label.


## 4.33.4 — Full legacy NPC callsign migration
- Fixes the actual source of the remaining real-name NPCs: legacy browser saves created ordinary NPCs inside `migrateWorld()` and kept those names locally.
- Migrates every non-story NPC in the browser save after both legacy and content NPC records are loaded, including locally generated `wander_*` NPCs.
- Reapplies the migration after server-provided player state is restored and before roster synchronization.
- Keeps the explicit canonical story-character ID whitelist unchanged.


- Migrates every non-story NPC, including legacy records without the generated flag, from real first/last names to two-part Zone callsigns.
- Preserves only the explicit canonical story-character roster.
- Expands the callsign vocabulary and guarantees unique generated names.
- Adds regression coverage for legacy names such as «Вениамин Филатов», «Захар Зайцев» and «Данила Игнатов — Северный».

## 4.33.2 — STALKER CALLSIGNS
- Replaced procedural civilian-style names for generated NPC stalkers with unique Zone-flavoured nicknames.
- Existing generated NPCs are migrated in place; named story characters and player names remain unchanged.
- New NPC replacements and local fallback wanderers also use callsigns.

# Changelog 4.33.0

- Added real-time survival needs, expedition supply packs and route wear.
- Added server-authoritative mutant hunting and mutant trophy rewards.
- Added field camp, temporary shelter, survival HUD and event log.


## 4.33.1 — Multiplayer transport stability
- Switched Socket.IO client and server to WebSocket-only transport to avoid Engine.IO polling session ID mismatches behind reverse proxies.
- Kept automatic reconnection and guest player handshake.
- Updated diagnostics to report the active WebSocket-only transport mode.
- Requires a Render Web Service deployment with WebSocket support (supported by Render).
