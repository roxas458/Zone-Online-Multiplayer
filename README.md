# ZONE ONLINE 4.1 — Chronicle & Survival Update

This release expands the modular 4.0 project with a new lore archive, faction dossiers, the Great Swamps sector, additional points of interest, new NPCs, a story campaign, and food/water survival needs.

## New in 4.1

- **Chronicle / archive:** concise, original summaries of the broad historical periods of the S.T.A.L.K.E.R. trilogy.
- **Faction dossiers:** a leader or key representative for all nine factions, with notes that distinguish canon figures from original campaign roles. Some groups do not have a single permanent leader in the trilogy.
- **New sector:** Great Swamps, with a connection to Cordon and Agroprom.
- **More POIs:** four extra points per existing sector plus five in Great Swamps.
- **New NPCs:** Lebedev, Novikov, Cold, Lukash, Voronin, Sultan, Beard, Charon, Wolfhound, Archivist and an original local military commander.
- **Original campaign:** five missions across three chapters. The campaign takes inspiration from trilogy themes and locations, but dialogue and new mission text are written for ZONE ONLINE.
- **Food and water:** canned food, sausage, condensed milk, water, tea and dry rations. Hunger and thirst rise as in-game time passes; supplies reduce them.
- **Migration:** existing local/server profile data is extended with new fields and content rather than intentionally resetting progress.

## Project layout

```text
public/
  index.html
  css/game.css
  js/content.js
  js/game.js
src/
  shared/game-data.js
  server/validation.js
  server/world.js
tests/
  core.test.js
server.js
package.json
render.yaml
README.md
```

## Run locally

```bash
npm install
npm test
npm run check
npm start
```

Open `http://localhost:3000`.

## Render

- Build command: `npm install`
- Start command: `npm start`
- Keep `DATABASE_URL` connected to the Render PostgreSQL database.

## Lore and canon notes

The archive is a short, paraphrased overview, not a reproduction of the games' scripts or quest text. Canonical leaders and historical figures are labeled as such in faction dossiers. Where the trilogy does not establish one permanent faction leader (for example, the mercenaries and the loosely organized loners), the game clearly marks its coordinator as an original ZONE ONLINE role.

The campaign's new dialogue, characters and objectives are original. The timeline's high-level background draws on the trilogy's depiction of Clear Sky's research in the Great Swamps, the faction conflicts in Clear Sky, and the northern events around Jupiter, Yanov and Pripyat in Call of Pripyat.

No original game textures, icons, voice lines, or other copyrighted game assets are bundled.

## Current limitations

- Main campaign quest checks and hunger/thirst calculations currently run in the browser and are mirrored to the player profile; they are not yet fully server-authoritative.
- NPC positions and multiplayer presence are synchronized, but most NPC dialogue behavior remains client-side.
- This update does not claim a fully simulated MMORPG or a production-ready authentication system.
