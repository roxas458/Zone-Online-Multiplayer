# ZONE ONLINE 4.6 — Project Structure

```text
ZONE_ONLINE/
├── server.js
├── package.json
├── render.yaml
├── public/
│   ├── index.html
│   ├── css/game.css
│   └── js/
│       ├── content.js
│       └── game.js
├── src/
│   ├── shared/game-data.js
│   ├── server/
│   │   ├── validation.js
│   │   └── world.js
│   └── systems/
│       ├── npc-ai.js
│       ├── npc-roster.js
│       ├── npc-dialogue.js
│       ├── ecosystem.js
│       ├── online-world.js
│       ├── war.js
│       ├── relationships.js
│       ├── ranks.js
│       ├── contracts.js
│       ├── patrols.js
│       ├── territories.js
│       ├── emissions.js
│       ├── rumors.js
│       └── camp-life.js
└── tests/core.test.js
```

## Architecture notes
- `server.js` is the authoritative Socket.IO server and persists the shared world to PostgreSQL when `DATABASE_URL` is configured.
- `npc-roster.js` creates a stable procedural set of supporting stalkers. Generated NPCs are stored in the shared world, so their names and identities survive restarts with PostgreSQL.
- `npc-dialogue.js` builds long-form contextual conversations. Dialogue refreshes on a 15-minute cycle and includes the latest known world event.
- `ecosystem.js` simulates mutant packs, faction bases, clan membership and sector market scarcity.
- `public/js/game.js` merges the server NPC roster into the player's sector list and renders updated dialogue and ecosystem information.
```
