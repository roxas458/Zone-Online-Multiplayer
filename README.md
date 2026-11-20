# ZONE ONLINE 4.27 — CONNECTION & FIELD PDA

## 4.27 — Connection diagnostics and illustrated PDA

- Added a versioned `/health` endpoint that reports service version, online count, database mode and timestamp.
- Improved Socket.IO diagnostics, increased handshake timeout and forced a fresh connection after changing server settings.
- Added support for a separate Node server address through the Multiplayer settings or `?server=https://your-node-server.example` URL parameter.
- Clarified that PostgreSQL is required for accounts and durable saves, but not for basic multiplayer server connectivity.
- Added trader portraits and illustrated quest cards with issuer portraits where available.
- Kept existing player data and map; no save reset or database schema migration is required.

## Fixing connection setup

1. Deploy the complete project folder as a Node web service (not as a static-only site). The start command is `npm start`; the build command is `npm install`.
2. Open `https://YOUR-NODE-SERVICE/health`. It must return JSON with `ok: true` and `version: "4.27.0"`.
3. If the game site is hosted at a different address, open it with `?server=https://YOUR-NODE-SERVICE` or enter that Node server URL in the Multiplayer page and press reconnect.
4. For persistent accounts and cross-device saves, attach PostgreSQL and set `DATABASE_URL`. Without it, basic server connections work in memory mode, but server progress is lost on a server restart and account login/register is unavailable.
5. If `/health` does not open, the issue is deployment/hosting rather than the browser client. Check the hosting service logs and confirm it is running `npm start` from the folder containing `server.js` and `package.json`.

## Checks

Run `npm install`, `npm run check`, `npm test`, then `npm start`.

# ZONE ONLINE 4.21 — ACCOUNT LINK

## 4.20 — Living Factions and territorial NPC AI

- Replaced random per-minute NPC roaming with scheduled, persistent base behavior: campfire, guard post, rest and short patrol.
- Added a canonical adjacency graph and faction home territories for all 17 map sectors.
- Generated 340 supporting stalkers are distributed according to the owner of their home sector; old generated NPCs are migrated out of unrelated faction territory.
- Added border assault orders. Squads may cross into hostile sectors only with a server-side attack/recon/escort/retreat order.
- Captured sectors receive occupation guards; defeated/stranded units return toward friendly territory.
- Added faction base summaries (guards, campfire population, patrols and squad count) to the PDA war feed.
- Tactical map tooltips now show NPC activity such as campfire, guard, patrol, assault, combat and retreat.
- Added regression tests for faction stationing, no-wander behavior and hostile-border assault dispatch.

## 4.19 — Faction warfare, radiation and optimized PDA
- NPCs without authoritative coordinates receive stable, unique map positions around their own sector anchors instead of stacking on one shared point.
- Offline map positions drift gradually so the global map shows a living distribution of stalkers; authoritative server positions remain preferred whenever available.
- Tactical NPC and player map symbols are reduced substantially for a cleaner overview.
- Rebuilt the inventory as a dark industrial equipment-and-backpack interface inspired by the supplied reference: equipment mannequin, gear slots, quick slots, portrait, currency, item grid, weight and condition indicators.
- Backpack items can be inspected; use, equip and sell actions remain connected to existing game systems.
- Kept the developer-supplied 17-location map and existing save data.

## 4.17 — Canonical developer map
- Replaced the previous in-game map texture with the exact labeled map supplied by the developer.
- Rebuilt the global map around the 17 named locations on that image and removed legacy sectors from the selectable map.
- Added migration aliases for older saves, keeping player progress while mapping obsolete sector IDs into the new geography.
- Added directional NPC markers, optional NPC route polylines, and mouse-wheel map zoom.

# ZONE ONLINE 4.16.1 — TACTICAL FREE ROAM MAP

A backward-compatible continuation of ZONE ONLINE 4.8.0.


## 4.16.1 — Reference-aligned tactical map

- The developer-supplied labeled aerial map is now the canonical in-game background. All 17 playable locations and map hit areas are aligned to that exact image.
- The canonical map contains: ЧАЭС, Затон, Припять, Юпитер, Лиманск, Рыжий лес, Радар, Военные склады, Дикие территории, Бар, Янтарь, Свалка, Агропром, Тёмная Долина, Кордон, Болота and Тёмная Лощина. Legacy sectors not present on this map are migrated to the closest supported new sector and removed from the selectable map.
- The player is shown as a position dot rather than a walking sprite. NPC dots are red when hostile, yellow when neutral, and green when in the player's faction. Discovered stashes are blue; other online players are cyan.
- Existing world-coordinate saves are migrated once to the revised map anchors; inventory, quests, factions and player identity are preserved.
- Region borders are approximate overlays traced from the reference screenshot. NPCs without authoritative world coordinates are displayed near their sector anchor, not at a verified exact position. Direction indicators are visual orientation hints; explicit NPC routes are drawn when route data is available. The Cordon exit is beyond the southern edge of the supplied reference fragment.

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


## Version 4.19 — WAR OF THE ZONE
- Expanded server NPC roster to 340 generated stalkers in addition to named characters.
- Added server-authoritative faction skirmishes, battlefront history, supply convoys and convoy ambush events.
- Reduced PDA map redraw work: no background SVG rebuild timer; map is rendered when visible or explicitly changed.
- Reduced tactical map marker size and increased global map NPC capacity.
- Added radiation accumulation in hazardous sectors and Anti-rad consumable with temporary protection.
- Added rank and faction identity to the backpack header.


## 4.21 — аккаунты и стартовые базы

- Регистрация и вход по логину/паролю через `/api/auth/register` и `/api/auth/login`. Пароли хранятся как scrypt-хеши с индивидуальной солью; сервер выдаёт случайный токен, в БД сохраняется только SHA-256 хеш токена.
- Для постоянного входа с разных устройств обязательно настрой `DATABASE_URL` на PostgreSQL. Без PostgreSQL аккаунты намеренно не создаются, чтобы не обещать кросс-девайс сохранение в памяти процесса.
- Таблицы `zone_accounts` и `zone_account_sessions` создаются автоматически при старте.
- Новая игра появляется на базе выбранной группировки: Одиночки — Кордон, Долг — Бар, Свобода — Военные склады, Бандиты — Свалка, Военные — Агропром, Учёные — Янтарь, Наёмники — Лиманск, Монолит — Радар, Чистое Небо — Болота. Сервер повторно проверяет начальную точку при первом создании персонажа.
- Общий чат КПК стал локальным каналом текущей локации; при переходе игрока история переключается на сектор назначения. Личные сообщения по-прежнему доступны только игрокам в одной локации.

### Настройка для публикации

1. Создай PostgreSQL базу данных у хостинга.
2. Добавь переменную окружения `DATABASE_URL` в настройки Node-сервера.
3. Перезапусти сервер и проверь `/health`: поле `database` должно быть `postgres`.
4. На телефоне создай аккаунт; на ПК выбери «Аккаунт» → «Войти» с тем же логином и паролем.


## Version 4.22 — COMMANDER'S PATH

- Direct joystick, WASD and arrow-key movement controls are removed.
- Players place a waypoint on the current-sector PDA map; online movement is advanced server-side at a slow walking pace.
- Movement orders can be cancelled and server-side travel hazards pause the route for a continue/retreat decision.
- Generated stalkers are regrouped into named 2–5 person squads and the tactical map renders one compact marker per squad with its member count.
- Added `src/systems/player-orders.js` and movement-order tests.

Online waypoint movement requires the game server. Offline preview mode keeps a local, non-authoritative walking preview.
