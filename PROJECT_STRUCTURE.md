# ZONE ONLINE 4.8.0 project structure

```text
ZONE_ONLINE/
├── public/
│   ├── css/game.css              # Main interface + encyclopedia styles
│   ├── index.html                # PDA navigation, views and controls
│   └── js/
│       ├── content.js            # Narrative and authored game content
│       └── game.js               # Browser game, real-time clock, armory, POIs, encyclopedia
├── server.js                     # Express + Socket.IO authoritative server
├── src/
│   ├── server/
│   │   ├── validation.js
│   │   └── world.js              # Shared world bootstrap (60 generated wanderers)
│   ├── shared/game-data.js
│   └── systems/
│       ├── npc-roster.js         # Persistent generated NPC roster
│       ├── souls.js              # Biographies, social links, squads and memorials
│       ├── npc-ai.js
│       ├── npc-dialogue.js
│       ├── ecosystem.js
│       ├── online-world.js
│       ├── war.js
│       ├── territories.js
│       ├── relationships.js
│       ├── ranks.js
│       ├── contracts.js
│       ├── patrols.js
│       ├── emissions.js
│       ├── rumors.js
│       └── camp-life.js
├── tests/
│   ├── client-smoke.test.js
│   └── core.test.js
├── package.json
├── README.md
└── CHANGELOG.md
```
