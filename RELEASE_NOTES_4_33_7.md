# ZONE ONLINE 4.33.7 — multiplayer reconnect/session fix

## What changed
- Repeated presses of the Connect button no longer tear down an active or reconnecting Socket.IO client when the target server URL has not changed.
- Keeping an existing connection no longer resets the local `zonePlayerReady` flag, which could otherwise disable server-backed actions after a harmless repeated tap.
- When a new socket takes over the same player ID, the server now installs the new socket as the owner before disconnecting the previous socket. The old disconnect handler therefore cannot delete the new online player entry.
- Disconnect logs now include the player ID and takeover socket ID; browser console logs record Engine.IO close reasons and `player:hello` acknowledgement status.
- Client cache version and package version updated to 4.33.7.

## Validation
- `node --check server.js` passed.
- `node --check public/js/game.js` passed.
- `npm test` passed: 99/99 tests.
- `npm run check` is run as a separate syntax sweep.

This release has been validated locally. It has not been deployed to Render or tested against the live service from this environment.
