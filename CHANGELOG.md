# Changelog

## 4.30.3 — Multiplayer connection compatibility
- Restored the Socket.IO transport order and connection options from the known-working 4.20.0 release.
- Removed `forceNew` and the newer `tryAllTransports` flag from the browser client.
- Rejects stale custom server URLs that answer `/health` but do not report the current 4.30.x server build; falls back to the same-origin Render service.
- Added Engine.IO handshake and connection-error diagnostics to Render logs.
- Verified JavaScript syntax and all 78 automated tests.

## 4.29.1 — CALL OF PRIPYAT DIALOGUE & DEAL BASKET
- Reworked NPC conversation into a two-character, metallic dialogue layout with portrait cards, large message panel, dialogue choices, and bottom trade/exit actions.
- Added drag-and-drop and button-based trade basket for purchases and sales.
- Added atomic server-side `market:deal` processing: all rows and quantities are validated before any inventory or balance changes are persisted.
- Kept the existing item vector illustrations; no extracted original game artwork is bundled.
- Added mobile layout rules for dialogue and deal basket.
- Preserved existing instant market endpoints for backward compatibility.

## 4.18.0 — LIVING ZONE / INVENTORY REDESIGN
- NPCs now occupy distinct positions around all assigned sectors instead of stacking around one anchor point.
- Offline NPC map markers drift gradually; server coordinates override generated positions.
- Reduced tactical map marker sizes for NPCs and the player.
- Rebuilt the inventory screen in the visual direction of the supplied S.T.A.L.K.E.R. screenshot: equipment mannequin, weapon/tool slots, quick slots, backpack grid, portrait, currency, item weight and gear condition.
- Added click-to-inspect item panel while preserving existing use/equip/sell actions.
- Kept the user's 17-region map as the canonical world map.

## 4.17 — User map edition
- Replaced the previous map with the developer-supplied labeled map.
- Rebuilt the world around the 17 named sectors.
- Migrated old sector references and removed obsolete selectable locations.
- Added directional NPC markers, route overlays and wheel zoom.

# Changelog

## 4.29.0 — Full-screen trading interface
- Rebuilt trading as a full-screen, three-column interface inspired by the supplied Call of Pripyat trader screen.
- Added player inventory sale panel, merchant stock purchase panel, central equipment/quick-slot column, item search, category filters, weight and balance summaries.
- Added responsive mobile layout with sticky header and transaction footer.
- Trade UI now refreshes after offline saves and confirmed online/NPC trade responses.
- Updated package and health endpoint version to 4.29.0.


## 4.16.1 — Reference-aligned tactical map
- Kept the original unlabeled 1024×2048 satellite image as the only map background.
- Used the user's second, labeled image only to trace approximate territory outlines and preserve its region names; it is not bundled or displayed as the game map.
- Added labels and outline overlays for Generators, Stancia 2, Stancia, both Pripyat regions, Limansk, Hospital, Red Forest, Radar, Dead City, Military Warehouses, Predbannik, Yantar, Rostok, Bar, Garbage, Agroprom, Dark Valley, Marsh, Escape, Darkscape, Jupiter and Zaton.
- Replaced the visible stalker sprite with a clear player-position dot.
- Added tactical NPC colors: hostile red, neutral yellow, player's faction green; discovered stashes blue; other online players cyan.
- Updated canonical sector anchor points to the original map layout and added a one-time coordinate-version migration for existing saves.
- Kept free-walk controls, world-space bounds, collision checks, and the existing multiplayer position event contract.
- Territory rectangles and NPC positions without authoritative x/y remain approximate; per-building collision and exact per-NPC coordinates are still future work.

## 4.16.0 — Realistic free roam foundation
- Replaced the low-resolution map texture with the user's supplied 1024×2048 Zone map.
- Added a realistic 4-direction stalker sprite atlas and animated walking frames.
- Changed local-map movement from sector-radius-limited walking to free movement across the full map.
- Added continuous WASD/arrow-key movement, hold-to-walk mobile controls, click-to-walk, map-edge bounds, and first-pass structure collision rectangles.
- Local map camera now follows the player's world coordinates.
- Kept existing world coordinate dimensions (1000×2000) and multiplayer position event contract.


## 4.9.0 — HUMAN STORIES

### Added
- Тактическая карта с рельефом, водными зонами, маршрутами, секторами, POI и масштабированием.
- Мобильная навигация и сенсорные зоны управления для Android/iOS.
- Личные истории NPC: три сюжетных дела с перемещением по карте, наградами и персистентным прогрессом.
- Обновлённый интерфейс КПК и адаптивная компоновка.

---

## 4.8.0 — REAL STALKER LIFE
## Added
- Real-time-only game clock based on the device wall clock. Day count advances once per real 24-hour period from the first 4.8 launch; displayed hour/minute follow local device time.
- Removed the time fast-forward control. Exploration, travel, rest, searching, POI discovery and camp actions no longer increment the in-game clock or consume simulated hours.
- Offline local-world pulse runs on a 15-minute wall-clock cadence; connected play continues to use the authoritative server scheduler.
- Increased the persistent generated server-side stalker roster from 36 to 60. Existing NPC IDs and biographies remain intact; new IDs are appended.
- Expanded the weapon catalogue with additional pistols, shotguns, rifles, assault rifles and special weapons.
- Added the Encyclopedia PDA section with searchable dossiers for sectors, points of interest, factions, NPCs, weapons, mutants and artifacts.
- Added three additional discoverable points of interest to every existing sector/map location.

## Stability
- Kept the 4.7.1 client bootstrap ordering and multiplayer handshake unchanged.
- Made replacement-NPC nickname generation bounded so deterministic/random test sources cannot cause an infinite name-collision loop.
- Existing browser saves are migrated in place; no save reset or database schema migration is required.

## Verification
- `npm run check`
- `npm test` — 30 tests passing for 4.9 (4.8 baseline: 27 tests).

## 4.10.0 — IMMERSION UPDATE
- Переработаны карточки инвентаря: экипированное снаряжение выделяется, видны вес, стоимость, состояние и защита.
- Торговля получила отдельную панель торговца, баланс, категории ассортимента и компактные карточки товаров.
- Добавлена продажа одной единицы или всего стека; серверная торговля принимает количество и рассчитывает выплату на сервере.
- Добавлены 8 артефактов и 6 комплектов брони в общий каталог магазина, серверные цены и список разрешённых предметов для обмена.
- Новые комплекты брони имеют параметры защиты, которые учитываются в пошаговых столкновениях.
- Добавлена авторская SVG-панорама индустриальной Зоны и атмосферное оформление главного экрана.
- Сохранения 4.9 продолжают использоваться; миграция базы данных не требуется.
- Проверки: `npm run check`; `npm test` — 34 теста.


## 4.11.0 — STALKER IDENTITY
- Added 16 original illustrated portrait assets in optimized WebP format, assigned consistently to the player and NPCs.
- Rebuilt the player dossier with rank, faction, health, reputation, XP, discoveries, visited sectors, combat victories and expedition statistics.
- Added a local PDA direct-message channel for NPCs physically present in the player's current location. Message history is stored in the local save and the channel closes when the NPC is no longer in the same sector.
- Added a new main menu with shortcuts to profile, map, inventory, contacts, trade and settings.
- Added accessibility and layout options: larger text, reduced motion and compact interface; preferences persist with the player save.
- Improved NPC contact cards and mobile messaging layout. Existing 4.10 saves are migrated without resetting progress.

## 4.12.0 — LIVING CONTACT
- Добавлены личные сообщения между игроками с проверкой общей локации, ограничением частоты и хранением истории в PostgreSQL.
- Добавлена серверная торговля с NPC и осмотр полевого снаряжения.
- Энциклопедия расширена отдельным разделом аномалий и более подробными досье.
- Обновлён интерфейс личных каналов для мобильных экранов.


## 4.13.0 — LIVING WORLD
- Убрана переписка с NPC; сохранены диалоги с выбором реплик.
- Реплики и сценические действия NPC визуально разделены.
- Добавлены самостоятельные обращения NPC к игроку при совпадении локации.
- Добавлены отряды игроков с приглашениями и ограничением в четыре участника.
- Созданы 16 новых мужских портретов и SVG-эмблемы девяти группировок.
- Сохранены личные сообщения между игроками; голосовой связи нет.

## 4.14.0 — SQUAD EXPEDITIONS
- Synchronized squad travel: the leader's sector change moves online members together; members cannot silently split off while remaining in the squad.
- Added field roles (leader, scout, medic, rifleman, technician) with leader-controlled assignment.
- Added a persistent squad field journal for formation, joining, leaving, role changes, travel, escort and rival-group encounters.
- Added friendly NPC escort orders; escorted NPC position follows the squad between sectors.
- Added contextual encounters when two active squads enter the same sector, with faction-sensitive warning text and a cooldown.
- Added mobile-friendly squad roster and journal presentation. No voice channel added.


## 4.15 — FREE ROAM MAP
- Added the supplied aerial Zone map as the shared cartographic background.
- Added overview and current-location map modes with sector, NPC, player and discovered-cache markers.
- Added click-to-walk, WASD/arrow-key movement and touch movement controls.
- Added validated multiplayer position updates; position is scoped to the player's current sector.
- Local map uses schematic sector centers and a bounded movement area; detailed collision/navigation mesh and physical-device testing remain future work.


## 4.19.0 — WAR OF THE ZONE
- Added 340 additional generated NPCs across the 17 supplied sectors.
- Added server-side faction skirmishes, battlefront records, supply convoys and ambushes.
- Added hostile NPC encounters for the player; winning a fight is validated and recorded by the server.
- NPC battle outcomes can change sector ownership.
- Added battlefield and convoy feed to the war PDA.
- Optimized map redraws by removing the 6.5-second full SVG rebuild and rendering only when visible/dirty.
- Reduced map marker footprint; global map supports up to 360 NPC markers.
- Added radiation accumulation and Anti-rad with 12-minute protection.
- Added rank and faction label to inventory backpack identity panel.
- Expanded encyclopedia with radiation field entry.


## 4.20.0 — LIVING FACTIONS

- Reworked NPC decision logic: stalkers now remain at bases by default, sit at campfires, rest, guard checkpoints and patrol only short friendly routes.
- Added faction home territories and a canonical connected-sector graph for all 17 locations.
- Corrected legacy generated NPCs whose faction did not match their home territory (including Clear Sky units appearing in Cordon).
- Added server-side hostile-border assault orders, temporary territory permissions and occupation garrisons after successful captures.
- Added faction base status aggregation and exposed guard/campfire/patrol counts in the PDA war feed.
- Added NPC activity labels to global map markers.
- Added regression coverage for faction territory assignment, stationary guards and border assault dispatch.


## 4.21.0 — ACCOUNT LINK & FACTION SPAWN
- Added PostgreSQL-backed account registration, login, token sessions and logout.
- Added scrypt password hashing with per-account salts and hashed bearer-token storage.
- Linked an account to a persistent player record for cross-device progress.
- Added faction-specific new-character spawn locations, validated server-side.
- Changed PDA world chat to a location-scoped channel and load sector-specific chat history on movement.

## 4.27.0 — LOGIN HANDSHAKE FIX
- Login acknowledgement is sent before the large world snapshot to avoid client-side acknowledgement timeouts when the world state is large.
- Socket.IO connection timeout increased to 60 seconds to tolerate Render free-instance cold starts.
- PostgreSQL connection/query timeouts bounded to prevent a stalled database request from hanging the login handshake indefinitely.
- Added regression tests for acknowledgement ordering and timeout configuration.


## 4.30.4 — Account and multiplayer recovery
- Expired or unverifiable account sessions fall back safely to a separate guest identity instead of blocking multiplayer.
- Client removes stale credentials after the server signals session fallback.
- Added `/api/diagnostics` and an in-game network/server test.
- Prevented overlapping asynchronous connect attempts.
- Compatible separately hosted server URLs are no longer rejected solely for not matching the 4.30 version prefix.
- PostgreSQL remains required for account registration/login and cross-device persistence, but not for guest multiplayer.
