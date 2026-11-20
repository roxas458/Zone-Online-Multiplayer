# ZONE ONLINE 4.33.5 — Connection reliability patch

## Fixed
- Removed the `/health` preflight as a hard gate before Socket.IO. A sleeping Render instance no longer causes the configured multiplayer URL to be deleted or replaced with the static game's origin.
- Increased Socket.IO connection and `player:hello` acknowledgement timeouts to 60 seconds for Render cold starts.
- Kept infinite automatic reconnection and increased the maximum retry interval to 15 seconds.
- Enabled WebSocket with HTTP long-polling fallback on both client and server for proxy/network compatibility.
- Updated `/api/diagnostics` to report the actual available transports.
- Bounded the manual network diagnostic requests so the diagnostics panel cannot hang indefinitely.

## Verification
- `node --check server.js` — passed
- `node --check public/js/game.js` — passed
- `npm test` — 98/98 passed

## Deployment note
This archive must be deployed to the Render service `zone-online-multiplayer` and the static game host (if separate). The live Render service could not be reached from this build environment, so the deployed `/health` endpoint and real multiplayer session still require verification after deployment.
