# ZONE ONLINE 4.54.0

## 4.54.0 — Living A-Life Routines

This release adds a server-authoritative individual NPC life layer on top of the existing faction, squad, mutant and proximity systems.

### New behavior
- NPCs periodically choose local routines: visit a campfire, visit a trader, rest, socialize or search for artifacts.
- NPCs physically walk to their routine destination using the existing one-second movement simulation and smooth client motion broadcasts.
- Artifact searches can produce a small, persistent NPC inventory find and a memory entry.
- Same-faction NPCs that meet nearby can socialize, improve their mutual relationship slightly and remember the encounter.
- Routine state is kept on the NPC record and therefore persists with the shared world save.
- Combat, mission orders, retreat, rescue and strategic squad travel take priority; A-Life routines do not interrupt them.

### Timing
- A-Life decision and routine progression: every 15 seconds.
- NPC movement: every 1 second.
- Strategic faction and squad planning remains on its existing slower schedule.

### Run
```bash
npm install
npm test
npm run check
npm start
```

The automated test suite covers routine assignment, artifact-search completion, social memories and protection of combat/mission states. Live browser and multiplayer server validation still requires running the project with its dependencies and configured database.
