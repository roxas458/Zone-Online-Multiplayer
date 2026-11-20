# ZONE ONLINE 4.33.6 — Render transport stability patch

## Root cause indicated by the supplied logs
The Engine.IO handshake and Socket.IO namespace connection both succeed over WebSocket, but the transport is then closed with `transport error`. The server is reachable and the initial handshake is not the failing stage. The current client prefers WebSocket (`transports: ['websocket','polling']`), repeatedly selecting the transport that the deployed path is dropping.

## Changes
- Switched game networking to HTTPS long-polling only (`transports: ['polling']`, `upgrade: false`).
- Restricted the server Engine.IO transport to polling so clients cannot negotiate the failing WebSocket transport.
- Increased heartbeat tolerance to `pingInterval: 25000` and `pingTimeout: 60000`.
- Added low-level Engine.IO close/error diagnostics and client disconnect details.
- Pinned Render to Node.js 22.16.0 and constrained package engines to Node 22 LTS instead of automatically selecting Node 26.
- Updated app/cache version to 4.33.6.

## Verification
Run `npm test` and `npm run check` before deploying. After deployment, `/api/diagnostics` should report `transports: ["polling"]`, and Render logs should show `transport=polling` with no WebSocket handshake attempts.

## Trade-off
Long-polling is slightly less efficient and can have higher latency than WebSocket, but it is a robust HTTPS fallback and suitable for this game's current multiplayer event traffic. Re-enable WebSocket only after confirming that Render edge and client networks keep upgraded connections stable.
