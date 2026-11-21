# ZONE ONLINE 4.33.29 — Multiplayer connection fix

- The client now probes the configured multiplayer server health endpoint before starting Socket.IO, avoiding repeated Engine.IO retries while a sleeping Render Free instance boots.
- The health wait is bounded to 90 seconds; if the probe cannot complete, Socket.IO is attempted anyway. The configured server URL is never discarded by a slow health check.
- Added timing diagnostics for server boot and the `player:hello` database/profile/state phases.
- Existing WebSocket-first transport fallback, guest profile handling, and world synchronization are preserved.

Validation: `npm run check` and `npm test` pass. A live Render/two-client connection test still requires deployment and verification against the hosted service.
