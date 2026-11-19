# Project structure — ZONE ONLINE 4.5

```text
ZONE_ONLINE/
├── server.js                       # Authoritative Socket.IO server and HTTP world APIs
├── src/
│   ├── shared/game-data.js         # Canonical factions, sectors, NPC homes and items
│   ├── server/
│   │   ├── validation.js           # Player state/input validation
│   │   └── world.js                # Shared world bootstrap and migrations
│   └── systems/
│       ├── online-world.js         # Revision journal, reconnect delta/snapshot and status
│       ├── npc-ai.js               # NPC schedules, movement, encounters and interaction
│       ├── war.js                  # Faction operations and territory warfare
│       ├── territories.js          # Territory influence and control
│       ├── relationships.js        # Personal relationships
│       ├── ranks.js                # Faction progression
│       ├── contracts.js            # Contract rules
│       ├── patrols.js               # Patrol helpers
│       ├── emissions.js             # Emission events
│       ├── rumors.js                # Rumor generation
│       └── camp-life.js             # Camp activity
├── public/
│   ├── index.html                  # Multiplayer / world status panel
│   ├── css/game.css
│   └── js/                         # Browser client, reconnect cursor and event feed
└── tests/core.test.js              # Domain and online-world replication tests
```

## Replication model
- `world.revision` is the monotonic shared-world cursor.
- `world.eventLog` stores the latest 500 revisioned events.
- A client submits `lastRevision` during `player:hello`.
- `buildWorldSync` returns missed events when the cursor is covered by the journal; otherwise it returns a full snapshot.
- Each event contains `id`, `revision`, `type`, `payload` and `at`.
- PostgreSQL persists the complete world JSON state, including the event journal.

## Deployment constraint
The current runtime assumes one authoritative Node.js process. Multi-instance scaling requires a cross-instance Socket.IO adapter and distributed world-tick leadership; this release does not claim that horizontal scaling is already implemented.
