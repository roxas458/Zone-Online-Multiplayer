# Stability report — ZONE ONLINE 4.31.0

## Root-cause-oriented changes
- Removed account registration, login, session-token verification and account UI. The multiplayer handshake is now guest-only and does not depend on account tables or account tokens.
- The `player:hello` acknowledgement is sent after the guest is registered in the online map but before the large world snapshot is queued. This specifically avoids acknowledgement delay caused by long-polling delivery of large packets.
- `player:ready` now receives a reduced world snapshot without the full internal NPC state or NPC event history.
- NPC state is transmitted separately as a compact public roster, excluding internal AI memory, pathing and server-only fields.
- Socket.IO is created with `autoConnect:false`; all event handlers are attached before calling `connect()`.
- Client tracks `zonePlayerReady`, not merely the low-level Socket.IO `connected` flag, before sending live NPC interactions.
- NPC rumor queries have a local fallback while offline or before player hydration completes.

## Gameplay additions
- Every faction is assigned one generated medic and one generated technician without increasing the generated NPC count.
- Medic service: up to +35 health for 75 RU.
- Technician service: up to +35 armor condition for 100 RU.
- Added medic/technician dialogue topics.
- Expanded generated first-name and surname pools; generated NPC surnames are unique within the active generated roster and deterministic across restarts.

## Verification
- `node --check` passed for server, client and changed NPC modules.
- `npm test`: **81 passed, 0 failed**.
- A local live-server integration check could not be completed in this environment because project dependencies were not installed and package installation timed out. Therefore this archive is syntax- and test-verified, not confirmed against the live Render service.

## Operational notes
- PostgreSQL is optional for guest multiplayer. Without `DATABASE_URL`, server-side world/player state is in memory and resets on service restart; local browser saves remain available.
- After deployment, verify `/health`, `/api/diagnostics`, and Render socket logs. A real two-client test is still required to confirm live multiplayer.
