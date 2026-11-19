# ZONE ONLINE 4.16.1 — TACTICAL FREE ROAM MAP

A backward-compatible continuation of ZONE ONLINE 4.8.0.


## 4.16.1 — Reference-aligned tactical map

- The original unlabeled satellite image remains the in-game background. The separately supplied labeled map is used only as a reference for region names and approximate border placement.
- The map overlays the named territories: Generators, Stancia 2, Stancia, Pripyat (SoC), Pripyat (CoP), Limansk, Hospital, Red Forest, Radar, Dead City, Military Warehouses, Predbannik, Yantar, Rostok, Bar, Garbage, Agroprom, Dark Valley, Marsh, Escape, Darkscape, Jupiter and Zaton.
- The player is shown as a position dot rather than a walking sprite. NPC dots are red when hostile, yellow when neutral, and green when in the player's faction. Discovered stashes are blue; other online players are cyan.
- Existing world-coordinate saves are migrated once to the revised map anchors; inventory, quests, factions and player identity are preserved.
- Region borders are approximate overlays traced from the reference screenshot. NPCs without authoritative world coordinates are displayed near their sector anchor, not at a verified exact position. The Cordon exit is beyond the southern edge of the supplied reference fragment.

## 4.16 — Realistic free roam foundation

- The map texture now uses the 1024×2048 satellite image supplied for this project.
- Added a realistic four-direction stalker sprite atlas with four walk frames per direction.
- Local-map camera follows the player; movement is no longer constrained to a small sector-radius circle.
- Added click-to-walk, continuous WASD/arrow-key movement, and press-and-hold mobile controls.
- Added map-edge limits and an editable first-pass set of structure collision rectangles in `WORLD_OBSTACLES`. These are initial approximations, not a finished per-building collision mesh.
- Kept the existing 1000×2000 world-coordinate contract and `player:position` multiplayer event.

## 4.8 inherited features

### Real-time world clock
- The displayed time follows the player's device clock (local timezone).
- The in-game day counter advances once per real 24 hours from the first 4.8 launch.
- No action can fast-forward or skip time. The former fast-forward button has been removed.
- Travel uses stamina cost, not simulated hours. Exploration, resting, anomaly searches, camp actions and discoveries do not move the clock.
- In offline browser mode, local ambient simulation pulses every 15 real minutes. Online mode continues to use the authoritative server scheduler.

### More people and gear
- Persistent server-generated wanderer roster increased from 36 to 60. Existing NPC identities are preserved and new records are appended.
- Additional weapons are included in the armory catalogue and discovery pool.
- Every current sector has three extra points of interest with persistent discovery flags.

### Encyclopedia
Open **Энциклопедия** from the PDA navigation. Search and filter entries for sectors/points, factions, NPCs, weapons, mutants and artifacts. NPC and POI entries use the current save/world state.

## Install / deploy

```bash
npm install
npm run check
npm test
npm start
```

Deploy the full project folder to the existing Node service. Keep the existing `DATABASE_URL` and PostgreSQL database; 4.10 does not require a schema migration. Do not delete browser local storage or reset the player profile. Existing 4.8 and 4.9 saves are migrated in place.

## Notes
- Device clock is used for the client display; players with incorrect device clocks may see an incorrect local time. The authoritative server still timestamps shared-world events.
- The browser clock is not used to authorize multiplayer actions.


## 4.9 — HUMAN STORIES

- Переработана тактическая карта: рельефные слои, водные преграды, маршруты, сектора, подписи контроля и маркеры точек интереса.
- Добавлены масштабирование карты и более удобная навигация на сенсорных экранах.
- Для телефонов добавлена нижняя панель быстрого доступа, увеличены зоны нажатия, учтены safe-area отступы iOS.
- Добавлен раздел личных историй NPC с заданиями по локациям, наградами и сохранением прогресса.
- Обновлена визуальная система КПК в индустриальном полевом стиле.


## 4.10 — IMMERSION UPDATE

- Atmospheric industrial panorama and updated field-PDA presentation.
- Redesigned inventory cards with equipped-state, condition, weight, and armor protection.
- Redesigned trader with category filters, item cards, balance, and stack selling.
- Added 8 artifacts and 6 armor suits to the shared offline/online market catalogue.
- Armor protection values are used by the combat damage calculation.
- No PostgreSQL schema migration or save reset is required.


### 4.11 — STALKER IDENTITY
The player dossier now includes expedition and combat statistics. NPCs have original illustrated portrait assets and richer contact cards. Direct PDA messages are available for NPCs sharing the player's current location; message history is saved in the local profile. The main menu provides quick navigation and persistent accessibility settings (large text, reduced motion, compact layout).


### 4.12 LIVING CONTACT
Личные сообщения между игроками работают через Socket.IO только при нахождении в одном секторе. История хранится в таблице `zone_private_messages` PostgreSQL; таблица создаётся автоматически. Торговля с NPC проверяется сервером.


## 4.13 — LIVING WORLD

- Удалены личные сообщения NPC: общение со сталкерами происходит через контекстные диалоги.
- Действия персонажей показываются отдельной сценической строкой, не смешиваются с произносимыми репликами.
- NPC могут самостоятельно инициировать контакт с игроком в том же секторе (серверное событие с периодом ожидания).
- Добавлены мужские портреты сталкеров в суровом полевом стиле по визуальному ориентиру пользователя и оригинальные эмблемы девяти группировок.
- Добавлены сетевые отряды игроков: создание, приглашения, принятие/отклонение и выход; лимит — четыре участника.
- Личные сообщения между игроками остаются, работают только в одном секторе и сохраняются в PostgreSQL. Голосового канала нет.

### Version 4.14 — Squad Expeditions
The multiplayer squad system now supports synchronized leader-led travel, member roles, a persistent expedition journal, friendly NPC escort, and encounters with other player squads. Squad/world state continues to use the existing shared-world persistence in PostgreSQL. No voice feature is included. Keep the existing `DATABASE_URL`; no database reset is required.


## 4.15 — FREE ROAM MAP
- Added the supplied aerial Zone map as the shared cartographic background.
- Added overview and current-location map modes with sector, NPC, player and discovered-cache markers.
- Added click-to-walk, WASD/arrow-key movement and touch movement controls.
- Added validated multiplayer position updates; position is scoped to the player's current sector.
- Local map uses schematic sector centers and a bounded movement area; detailed collision/navigation mesh and physical-device testing remain future work.
