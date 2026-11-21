# ZONE ONLINE 4.33.9

## Multiplayer connection corrections
- The client now defaults to the known Render game server `https://zone-online-multiplayer.onrender.com` instead of silently targeting the static frontend origin.
- Socket.IO attempts WebSocket first and can fall back to HTTP polling if the client network or proxy blocks WebSocket.
- Server diagnostics now expose the Node.js runtime version and accepted transports.
- Render Blueprint explicitly pins Node.js 22.16.0.

## Stalker callsign generator
- Replaced the procedural NPC nickname pools with short, two-part Zone-style callsigns.
- The first generated stalkers are `Васян Глюк`, `Лёша Дворецкий`, and `Максим Скелет`.
- Existing generated NPC records are renamed deterministically on world bootstrap; canonical story characters remain unchanged.
- Browser-local legacy NPCs are migrated using the same style.

## Verification
- `npm run check` and the automated test suite are run for this build.
- A live Render connection cannot be certified until this build is deployed to the Render service.
