# Stability report — 4.27.0

## Automated checks
- `npm test`: 74 tests passed.
- `npm run check`: all JavaScript syntax checks passed.
- ZIP archive integrity check passed.

## Login handshake fixes
- Socket.IO client and server connection timeouts allow up to 60 seconds for Render free-tier cold starts.
- Server acknowledges `player:hello` before sending the potentially large world snapshot, preventing snapshot serialization/delivery from consuming the login acknowledgement timeout.
- PostgreSQL connection and query timeouts are bounded at 8 seconds so a stalled database operation cannot hold the login handshake indefinitely.

## Live deployment limitation
- The deployed homepage at https://zone-online-multiplayer.onrender.com/ responds and serves the 4.26 client build.
- The `/health` endpoint could not be independently verified from this environment, and outbound DNS/network access from the build container is unavailable.
- The updated source must be deployed to Render before these fixes affect the live site. Render logs and production Socket.IO behavior cannot be confirmed from this workspace.
