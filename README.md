# ZONE ONLINE 4.57.1

## 4.57.1 — Faction War & Public Data Hotfix
- Fixed missing sector-coordinate import that crashed strategic faction squad movement.
- Added initialization for the public NPC position index before squad movement updates.
- Implemented return-route advancement so completed squads return to camp and can be redeployed.
- Routed public world snapshot and event HTTP endpoints through the public-data filters.
- Added integration tests for outbound faction movement, objective capture, return travel, and redeployment readiness.


## 4.57.0 — Performance, Combat & Character Death

- Player-vs-NPC proximity combat now builds one sector-aware spatial index per tick and checks only nearby cells, avoiding a full NPC scan for every connected player.
- NPC movement now detects nearby hostile stalkers before advancing movement orders. Hostile contacts stop both sides so the existing combat simulation can resolve the encounter instead of allowing NPCs to pass through each other.
- Player death is now a real character lifecycle transition. The server records death, sets health to zero, clears movement/expedition orders and permits a fresh character creation. A new character receives fresh starting health, supplies and progression.
- Desktop map rendering disables expensive SVG drop shadows and marker pulse animations on fine-pointer devices while preserving all markers and interactions.
- Imported save files are limited to 5 MB, bounded in nesting/collection size, and sanitized to strip markup/control characters and prototype-pollution keys before use.
- Added regression coverage for hostile movement blocking, character death/recreation, spatially indexed player combat and imported-save sanitization.

Validation: `npm test` — 332 tests passed. `npm run check` — passed. All production JavaScript files also passed `node --check`.

# ZONE ONLINE 4.56.0

## 4.56.0 — Living A-Life Routines

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

## 4.56.0 — Smooth A-Life & Object Approach

- NPC and mutant movement now use the same 2.5 map-units-per-second speed as player movement.
- NPC social encounters and hostile NPC skirmishes use sector-local spatial grids rather than comparing every possible pair.
- NPC motion rendering no longer runs a per-frame animation loop with repeated DOM queries. The client indexes visible markers when the map is rendered and uses short SVG transform transitions for incoming authoritative position updates.
- Mutant markers keep their reduced icon scale while moving; key-object, mutant and anomaly markers are smaller and less visually intrusive.
- Strategic key-object cards now offer an explicit approach action. For a different sector, the player travels there first and then automatically receives a local movement order to the selected object. Cancelling or replacing the expedition clears that pending destination.
- Added regression tests for movement speed, spatially indexed encounters, object approach, marker sizing and cancelled object-travel intent.

Validation: 319 automated tests pass; `npm run check` passes; every JavaScript file passes `node --check`. A local synthetic benchmark with 3,000 NPCs measured approximately 3.7 ms for the movement tick, 3.3 ms for the A-Life social tick and 14.9 ms for the proximity-combat pass on the build environment. These figures are environment-specific and are not a substitute for browser/server profiling on the deployment host.
- Nearby known generated NPCs can form a persistent two-person squad only when they are already physically together; no member is teleported into the group.
- Non-hostile cross-faction NPCs can have short road encounters and remember them; hostile relations and known rivalries are excluded.
- NPCs can pass recent artifact discoveries as rumors during conversations.
- Goods carried by visiting NPCs are delivered to trader stock. The server maps delivered goods into the existing NPC economy stock, so the items become available through the existing NPC trade flow rather than sitting in an unused side field.
