# ZONE ONLINE 4.33.37 — Realistic Zone Foundation

## Technical direction

The project is being developed as a persistent, realistic multiplayer Zone. Existing player saves, Socket.IO event names, NPC dialogue/trade, player trading, faction systems, map navigation, and PostgreSQL world persistence are preserved.

## Implemented in this milestone

- Added a persistent server-authoritative emission state machine: calm, warning, active, and residual radiation cooldown.
- The shared world stores the current emission phase and cycle; existing world persistence automatically saves it.
- All connected players receive the same phase through `world:emission` and the initial world snapshot.
- Warning lasts 3 minutes, the active wave lasts 2 minutes, and the residual phase lasts 8 minutes. The next calm interval is scheduled between 20 and 35 minutes.
- Active emissions apply server-side health, radiation, and stamina exposure once per minute.
- Shelter and equipped suit protection reduce or prevent exposure. Player state is synchronized through `player:survival:update`.
- Online clients no longer roll independent local emissions or apply duplicate local emission damage. Offline play retains its local fallback.
- Legacy world saves without emission data are migrated safely without changing player save structure.

## Validation

- Added focused tests for phase transitions, migration, public state, and exposure calculations.
- Existing test suite is retained and run with the new tests.
- This release does not claim live multi-client load testing; production multiplayer verification remains required.
