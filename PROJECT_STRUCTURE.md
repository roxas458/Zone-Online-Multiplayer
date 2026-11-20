# ZONE ONLINE 4.31.0 project structure

```text
ZONE_ONLINE/
├── public/
│   ├── css/game.css
│   ├── index.html
│   └── js/
│       ├── content.js
│       ├── game.js
│       └── stories.js
├── server.js
├── src/
│   ├── server/
│   │   ├── validation.js
│   │   └── world.js
│   ├── shared/game-data.js
│   └── systems/
│       ├── npc-roster.js
│       ├── npc-dialogue.js
│       ├── npc-ai.js
│       ├── souls.js
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
│       ├── camp-life.js
│       ├── player-orders.js
│       └── expedition.js
├── tests/
│   ├── client-smoke.test.js
│   ├── core.test.js
│   ├── npc-squads.test.js
│   ├── player-orders.test.js
│   └── expedition.test.js
├── package.json
├── render.yaml
├── README.md
└── CHANGELOG.md
```

## Current architecture
- Express serves the browser game and health/diagnostics endpoints.
- Socket.IO provides guest multiplayer. Account registration and login endpoints/UI are removed.
- PostgreSQL is optional and used only for persistent guest/world/chat state.
- The server maintains the authoritative NPC simulation; clients receive a compact public NPC roster.
- Each faction has a medic and technician drawn from its generated NPC population.
