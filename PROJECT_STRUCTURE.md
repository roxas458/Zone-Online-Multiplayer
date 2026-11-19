# ZONE ONLINE 4.10.0 project structure

```text
ZONE_ONLINE/
├── public/
│   ├── css/game.css              # PDA interface, tactical map, mobile layout and story styles
│   ├── index.html                # PDA navigation, tactical map, views and mobile dock
│   └── js/
│       ├── content.js            # Narrative and authored game content
│       ├── game.js               # Browser game, real-time clock, tactical map and PDA
│       └── stories.js            # Persistent NPC storylines and rewards
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

- `public/js/stories.js` — личные сюжетные линии NPC, прогресс и награды (4.9).

- `public/assets/zone-atmosphere.svg` — авторская панорама индустриальной Зоны для главного экрана.
- Версия 4.10: обновлённые карточки инвентаря и торговца, серверный каталог брони и артефактов.
