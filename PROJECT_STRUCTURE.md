# ZONE ONLINE 4.2 — project structure

```text
ZONE_ONLINE/
├── client/                  # Browser presentation layer (public/)
│   ├── interface/           # PDA views and navigation (public/index.html)
│   ├── hud/                 # Status panels and combat overlay
│   ├── inventory/           # Inventory, equipment and crafting UI
│   ├── pda/                 # News, contracts, contacts and archive
│   ├── maps/                # Sector map and points of interest
│   └── multiplayer/         # Socket.IO client and player trading
├── server/
│   ├── world/               # Shared world bootstrap (src/server/world.js)
│   ├── players/             # Player validation and persistence (server.js)
│   ├── factions/            # Faction registry and diplomacy
│   ├── npc/                 # NPC homes and world positions
│   ├── patrols/             # Patrol domain rules
│   ├── territories/         # Territory influence rules
│   ├── economy/             # Market and player-to-player trade
│   └── events/              # Shared world events and emissions
├── systems/                 # Reusable game rules (src/systems/)
│   ├── reputation.js
│   ├── relationships.js
│   ├── ranks.js
│   ├── contracts.js
│   ├── patrols.js
│   ├── territories.js
│   ├── emissions.js
│   ├── rumors.js
│   └── camp-life.js
├── database/                # PostgreSQL schema and JSONB persistence (server.js)
├── content/                 # Authored content (public/js/content.js, game-data.js)
└── shared/                  # Shared constants, validation and protocols
    ├── config/
    ├── constants/
    └── protocols/
```

The existing repository uses a compact Express/Socket.IO layout. This map shows the logical module boundaries; the existing runtime paths are retained to avoid breaking deployment.


## 4.3 WAR SYSTEM runtime additions

- `world.territoryOwners` and `world.territoryControl` store authoritative sector control.
- `world.warOperations` stores active and recently completed operations.
- `world.warHistory` stores the latest 30 resolved battles.
- Socket.IO events: `war:operation:create`, `war:operation:deploy`, `war:operation:resolve`, `war:state`, `war:result`, `war:reward`.
