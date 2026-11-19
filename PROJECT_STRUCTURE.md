# Project structure — ZONE ONLINE 4.4

```text
ZONE_ONLINE/
├── server.js                    # Socket.IO server and authoritative world events
├── src/
│   ├── shared/game-data.js      # Canonical factions, sectors, NPC homes and items
│   ├── server/
│   │   ├── validation.js        # Player state/input validation
│   │   └── world.js             # Shared world bootstrap and migrations
│   └── systems/
│       ├── npc-ai.js            # NPC schedules, movement, encounters and interaction
│       ├── war.js               # Faction operations and territory warfare
│       ├── territories.js       # Territory influence and control
│       ├── relationships.js     # Personal relationships
│       ├── ranks.js             # Faction progression
│       ├── contracts.js         # Contract rules
│       ├── patrols.js           # Patrol helpers
│       ├── emissions.js         # Emission events
│       ├── rumors.js            # Rumor generation
│       └── camp-life.js         # Camp activity
├── public/
│   ├── index.html
│   ├── css/game.css
│   └── js/                      # Browser client and content
└── tests/core.test.js           # Automated domain tests
```

## NPC state model
Each NPC record contains `id`, `name`, `faction`, `role`, `location`, `destination`, `action`, `mood`, `health`, `morale`, `supplies`, `alive`, `lastActionAt`, `relationships`, `inventory`, and a bounded `history` log. The server is authoritative; clients receive snapshots and event notifications.
