# ZONE ONLINE 4.3 — WAR SYSTEM

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


## Version 4.2 — Living Zone
The Living Zone panel adds NPC relationships, faction rank progression, contracts, patrol sightings, territory influence, camp activities, PDA rumors and emission alerts. New fields are added through save migration, so an existing 4.1 save can be continued. Reusable domain helpers are located in `src/systems/`.


## Version 4.3 — WAR SYSTEM

The 4.3 update adds server-authoritative faction operations and persistent territory control. The PDA now has a dedicated War System screen.

- **Operations:** a player can organize an assault while physically present in a hostile-controlled sector. Only one active operation can exist per sector, with a global cap on active operations.
- **Deployment:** members of the attacking and defending factions can deploy once per operation while present in the target sector. Deployment consumes 100 ₽ and adds combat power based on XP and reputation.
- **Command:** only the operation creator can resolve the operation; at least two players must have deployed. Attack score is compared with the defending garrison plus defender deployments.
- **Territory control:** a successful assault transfers the sector to the attacking faction. The new owner and control value are stored in the shared world and PostgreSQL JSONB state.
- **Rewards and history:** participants receive XP and reputation changes; winners receive a cash reward. Completed operations are written to the shared war history and PDA news.
- **Validation:** faction membership, location, costs, duplicate deployment, operation ownership and operation limits are checked on the server.

### WAR SYSTEM files

- `src/systems/war.js` — operation creation, deployment power, participant validation and battle resolution rules.
- `src/shared/game-data.js` — initial territory owners and control values.
- `server.js` — Socket.IO commands and authoritative persistence/rewards.
- `public/index.html` / `public/js/game.js` — War System PDA screen and multiplayer controls.
- `tests/core.test.js` — battle lifecycle and validation tests.

### Current WAR SYSTEM scope

This is the first playable strategic layer, not a real-time tactical shooter: battles are resolved from player deployments and server-side scores. NPC armies, live combat units, supply convoys and autonomous front movement are reserved for the NPC AI and later Online World phases. Existing 4.1/4.2 player saves are retained; older world records receive initial territory data during world bootstrap.
