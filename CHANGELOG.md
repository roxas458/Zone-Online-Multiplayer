# Changelog 4.33.0

- Added real-time survival needs, expedition supply packs and route wear.
- Added server-authoritative mutant hunting and mutant trophy rewards.
- Added field camp, temporary shelter, survival HUD and event log.


## 4.33.1 — Multiplayer transport stability
- Switched Socket.IO client and server to WebSocket-only transport to avoid Engine.IO polling session ID mismatches behind reverse proxies.
- Kept automatic reconnection and guest player handshake.
- Updated diagnostics to report the active WebSocket-only transport mode.
- Requires a Render Web Service deployment with WebSocket support (supported by Render).
