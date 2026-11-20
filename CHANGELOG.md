## 4.33.3 — STALKER CALLSIGNS FIX

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
