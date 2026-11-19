# ZONE ONLINE 4.0 — Modular Project

ZONE ONLINE 4.0 restructures the 3.1 project into smaller, maintainable files while preserving the existing game behavior.

## Project tree

```text
zone-online/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── game.css          # PDA and game interface styles
│   └── js/
│       └── game.js           # Browser game logic and Socket.IO client
├── src/
│   ├── shared/
│   │   └── game-data.js      # Factions, locations, NPC homes, shop and quest data
│   └── server/
│       ├── validation.js     # Input sanitizing and player state validation
│       └── world.js          # Shared-world initialization and diplomacy
├── tests/
│   └── core.test.js          # Automated tests for shared data and core helpers
├── server.js                # HTTP/Socket.IO composition and event handlers
├── package.json
├── render.yaml
└── README.md
```

## Why the structure is better

- Shared game definitions live in one place, instead of being mixed with server networking.
- Server validation is isolated and can be tested independently.
- Shared-world initialization is isolated from Socket.IO event handlers.
- Browser styles and JavaScript no longer occupy the HTML document.
- Automated tests cover basic validation and world initialization.
- Future systems can be added as separate modules without rewriting the entire application.

## Run locally

```bash
npm install
npm test
npm run check
npm start
```

Then open `http://localhost:3000`.

## Deploy on Render

- Build command: `npm install`
- Start command: `npm start`
- Keep the existing PostgreSQL `DATABASE_URL` environment variable.

## Notes

This is an architectural refactor of the uploaded 3.1 project. It preserves the existing combat, character creation, inventory, NPC, quest, trade and multiplayer logic; it does not claim that all game systems have become server-authoritative. The browser game logic is currently extracted into `public/js/game.js` as a first modular boundary. Further extraction into combat, inventory, PDA, map and multiplayer client modules can follow incrementally.

No original S.T.A.L.K.E.R. copyrighted game assets are bundled.
