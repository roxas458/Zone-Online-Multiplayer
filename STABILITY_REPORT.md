# ZONE ONLINE 4.33.0 — Stability Report

## Implemented
- Shared browser/server survival rules module.
- Hunger and thirst advance in real time, with a three-hour cap on catch-up after inactivity.
- Expedition supplies are consumed on each server-authoritative sector hop; missing supplies increase exertion.
- Mutant hunting is validated by the server against the player's current sector, equipped weapon, stamina, cooldown and live pack population.
- Hunt results persist player rewards and mutant-pack count and broadcast updated ecology.
- Emission warnings and active waves now use shelter and suit protection in the client simulation.

## Verification
- JavaScript syntax checks and Node test suite are run in the release workspace.
- This report does not claim a live Render deployment test.

## 4.33.1 transport investigation
- 4.33.0 client negotiated Engine.IO polling first and then upgraded to WebSocket. Logs showed repeated polling session closures and `Session ID unknown`.
- Client and server now use WebSocket-only transport, removing polling session IDs from the connection lifecycle.
- Static checks and automated tests cover the selected transport. Live Render validation is still required.


## 4.33.3 Callsign migration
All NPCs outside the explicit story-character whitelist are converted to unique two-part callsigns, including old persisted NPC records whose generated flag was missing or false. Regression tests cover legacy full-name formats.
