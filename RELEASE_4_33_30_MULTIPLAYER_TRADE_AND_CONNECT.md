# ZONE ONLINE 4.33.30 — multiplayer connection and player trading

## Connection
- Reduced the pre-connection `/health` wait to a 4.5-second maximum. A warm server can proceed to Socket.IO immediately after its health response; a sleeping Render instance is still subject to platform cold-start time.
- Reduced Socket.IO connection timeout and retry delays to make retries more responsive.

## Player-to-player trading
- Enabled trades in guest memory mode as well as PostgreSQL mode. Previously the trade acceptance path refused all trades when `DATABASE_URL` was absent, which is the configuration reported in the server log.
- Added an all-or-nothing trade helper that validates the item whitelist, quantity, buyer balance and seller balance ceiling before mutating either profile.
- Kept PostgreSQL trades inside a transaction with row locks; memory-mode trades update both online authoritative profiles.
- Restricted offers to players in the same sector, capped pending offers, and added a two-minute expiry.
- Restored valid pending incoming offers after reconnect and synchronized the resulting profile state to both players.
- Updated the PDA trade panel to show sector eligibility and handle incoming/result events correctly.

## Verification
- `npm run check` passes.
- `npm test`: 157 tests pass.
- Live two-browser / Render transaction testing still requires deployment and two online players; it is not claimed as completed here.
