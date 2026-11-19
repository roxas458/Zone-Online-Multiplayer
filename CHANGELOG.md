# Changelog

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
