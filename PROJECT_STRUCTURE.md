# ZONE ONLINE 4.7 — Project Structure

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
│       ├── souls.js
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


## 4.7 additions
- `src/systems/souls.js` — biographies, social links, squads, raids, memorial and replacement stalkers.
- `src/systems/npc-dialogue.js` — contextual long-form dialogue and server-selected topic replies.
- `server.js` — repaired safe-state wiring and acknowledged multiplayer login handshake.
- `public/js/game.js` — visible connection diagnostics, server-driven dialogue topics, squad and memorial UI.

- `tests/client-smoke.test.js` — browser startup and navigation smoke tests for all main views.
