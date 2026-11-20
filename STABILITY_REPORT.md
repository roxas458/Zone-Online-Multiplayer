# Stability report — 4.26.0

## Automated checks
- `npm test`: 72 tests passed.
- `npm run check`: all JavaScript syntax checks passed.
- Added regression checks for server URL configuration, `/health`, Socket.IO reconnect setup, and trader portraits.

## Connection fixes
- `/health` now returns the deployed package version and operational status.
- Client accepts a separate Node server URL from Multiplayer settings or the `?server=` URL parameter.
- Socket.IO uses a fresh connection and a longer handshake timeout; connection errors now direct the player to the health endpoint.
- Server startup is guarded against database bootstrap rejection and logs HTTP startup errors.
- PostgreSQL remains optional for connecting to the game server; it is required for account authentication and persistent cross-device saves.

## Visual updates
- Trader portrait changes based on the current trading location.
- Quest cards now include issuer portraits when a matching NPC exists and use escaped text for player-facing content.

## Not verified in this environment
- A live public server connection and production PostgreSQL integration could not be tested because no deployment URL or database credentials were provided.
- Dependency installation timed out in this environment; therefore a full live HTTP/Socket.IO boot was not claimed.
- To verify the actual deployment, check the deployed `/health` endpoint and hosting logs.
