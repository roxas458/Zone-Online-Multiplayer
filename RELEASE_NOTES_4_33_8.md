# ZONE ONLINE 4.33.8

## Multiplayer stability
- Restores the original WebSocket-only transport used by the earlier stable build.
- Removes polling-only transport, which can be sensitive to load-balancer session affinity.
- Automatic reconnect now uses randomized backoff to reduce synchronized retry bursts.
- Engine.IO close diagnostics attach to the active transport, not before the transport exists.
- The server saves the last authoritative player state on disconnect and flushes online player/world state during graceful Render shutdown.
- Static JS cache keys are bumped so mobile browsers load the new connection code.

## Verification
- `npm test`: 100/100 passed.
- `npm run check`: passed.
- ZIP integrity check: to be run on release archive.
- A live Render test is not possible from the local workspace and remains to be verified after deployment.

## Persistence note
The logs previously showed `DATABASE_URL` missing and the server using `memory-fallback`. WebSocket stability does not depend on PostgreSQL, but durable player/world saves across instance restarts do. Configure Render PostgreSQL and set `DATABASE_URL` to enable durable persistence.
