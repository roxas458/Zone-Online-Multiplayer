ZONE ONLINE 4.50.0

# ZONE ONLINE 4.39.0

Обновление: динамические сводки группировок, закрытая радиосеть фракций, улучшенные маркеры NPC, подход к NPC по клику и интерактивные тайники с точными координатами. Радиус разговора остаётся 8 м; движение к точке подхода останавливается примерно в 5 м от NPC.

# ZONE ONLINE 4.39.0

Обновление: динамические сводки группировок, закрытая радиосеть фракций, улучшенные маркеры NPC, подход к NPC по клику и интерактивные тайники с точными координатами. Радиус разговора остаётся 8 м; движение к точке подхода останавливается примерно в 5 м от NPC.

# ZONE ONLINE 4.38.0

## 4.38.0 — Expanded Stalker Equipment

- Expanded the inventory mannequin with separate slots for primary weapon, sidearm, suit, helmet, detector, artifact and backpack.
- Added an equipment picker opened from each slot, with type-safe selection and a remove-equipment action.
- Added starter helmet and standard backpack items for existing and new saves.
- Added helmet protection to local combat mitigation.
- Added field and expedition backpacks with 65 kg and 80 kg carrying capacities; the equipped backpack determines the inventory load limit.
- Added purchasable helmet and backpack models to the shop and server-side shared shop catalogue.
- Added responsive PDA styling and regression tests for equipment slot behavior.

## 4.36.0 — Armory, Contacts & Field Intel

- Removed the generic “Снаряжение” category from the encyclopedia knowledge tree; the encyclopedia now focuses on field reference material.
- Rebuilt the Armory as a unified catalogue with filters for weapons, armor/suits, helmets, detectors, artifacts and field equipment. The catalogue is informational only: it no longer has an “Equip” action. Equipping remains available from the backpack/inventory.
- Added catalogue records for protective helmets, detector models and field equipment while preserving existing weapon and armor records.
- Removed NPC squad summaries from the Characters/Contacts page; squad information remains in the dedicated “Отряды” view above “Задания”. Rescue operations and memorial notices remain in Contacts.
- Replaced duplicated survival meters and quick-contact widgets in the right sidebar with sector intelligence: local contact counts, allies, neutrals, hostile contacts, discovered points, reputation, weather, emission/mutant status and recent PDA messages.
- Added responsive styling for the expanded Armory and field-intelligence panels.
- Preserved the existing inventory equip flow and player save data.


## 4.36.0 — Living Dialogue & PDA Identity

- Added original multi-topic signature conversations for Sidorovich, Wolf and Sultan, with legacy quest topics preserved.
- Added expanded NPC conversations about personal history, life before the Zone, daily work, current local rumors, plans and news from the mainland. Random and ordinary NPC dialogue topics refresh on a 15-minute cycle; the server dialogue generator supports the same signature branches.
- Moved the Zone map shortcut from the left navigation rail to the main header and removed the duplicate mobile-dock map item.
- Added a persistent player identity card in the header with portrait, callsign and faction; existing header status continues to show money, in-game day/time and current location.
- Added regression coverage for dialogue branches and PDA navigation.

Обновление главного меню: атмосферный стартовый экран, продолжение и загрузка локального сохранения, запуск новой игры с выбором группировки и позывного, переход к сетевой игре и опциям. Адаптивная компоновка для мобильных экранов.

Запуск: `npm install`, затем `npm start`.

Новая игра заменяет текущее локальное сохранение после подтверждения. Продолжение использует сохранение браузера.


## 4.33.26 — Full-viewport layout and survival HUD

- Desktop game layout now expands to the full browser viewport instead of being constrained to a narrow centered canvas.
- Added an optional browser Fullscreen API control in the game header.
- Added a compact S.T.A.L.K.E.R.-inspired survival HUD with segmented health and stamina meters.
- HUD displays the currently equipped weapon and its condition percentage.
- HUD is hidden on the title screen and repositioned above mobile navigation on narrow screens.
- Preserved the existing save format and game state; HUD reads existing `hp`, `stamina`, equipment and item-condition fields.


## 4.33.26 — Tactical map navigation

- Full-width, taller tactical map with a dedicated fullscreen button.
- Drag to pan, wheel or buttons to zoom, and click anywhere on the map to move or request travel to another sector.
- Slower walking speed in online and offline play.
- Original map artwork and existing game content are preserved.


## 4.33.37 — Realistic Zone foundation

- Added a persistent server-authoritative emission cycle shared by multiplayer clients.
- Added warning, active, and residual-radiation phases with predictable durations.
- Added server-side exposure damage with shelter and suit protection.
- Preserved legacy save migration and offline emission fallback.

## 4.33.38 — A-Life: NPC needs and daily routines

- Added server-side hunger, thirst, fatigue, and stress values for NPCs.
- NPCs gradually consume supplies to satisfy hunger and thirst; lack of supplies slowly reduces morale.
- Each NPC receives a stable individual night-rest window derived from its ID.
- Tired stalkers enter a rest duty and wait longer before their next behavior decision.
- Legacy NPC records receive safe defaults without changing IDs, names, factions, or locations.
- Added automated coverage for needs, supplies, night rest, and legacy-state migration.

## 4.33.39 — A-Life: squad expeditions

- NPC squads are formed only from stalkers who are already in the same sector; creating a squad never teleports members.
- Generated squads can launch persistent reconnaissance and supply runs through connected sectors.
- Squad travel advances one sector at a time on the server; all living members move together and remain synchronized for multiplayer clients.
- Squads scavenge supplies at their destination, then follow their recorded route back to their departure sector.
- NPC individual AI yields control while a squad is travelling, scavenging, or returning, preventing members from splitting away from their group.
- Existing squad records are reconciled safely: members who are not physically at the squad's camp are detached rather than forcibly moved.
- Added automated tests for connected travel, no-teleport behavior, scavenging, bounded supplies, and return-state transitions.
- Documentation is consolidated in this single `README.md`; no separate release-note Markdown files are shipped.


## 4.33.42 — A-Life: mutant encounters and squad survival

- Mutant packs can engage NPC squads that are travelling, scavenging, or returning through the same sector.
- Each encounter applies bounded damage to a stalker and to the mutant pack; the event is stored in the shared ecosystem event history.
- Squad members can spend supplies to treat a critically injured companion during an encounter.
- If a squad member remains critically injured, the squad can switch to a retreat state and reverse only the route it has already travelled; no sector teleportation is used.
- Existing solo NPC-versus-mutant encounters remain available when no active squad is present.
- Added deterministic tests for squad combat, companion rescue, and route-based retreat.
- Documentation remains consolidated in this single `README.md`; no separate Markdown release notes are shipped.


## 4.33.42 — последствия потерь и восстановление NPC
- Раненые NPC постепенно восстанавливают здоровье на безопасных стоянках, расходуя припасы.
- После гибели NPC остаётся тело с ограниченным по времени тайником; обыск проверяет сектор и расстояние на сервере.
- Выжившие напарники запоминают потерю, переживают стресс и меняют настроение.
- Накапливаются сообщения группировок о гибели сталкеров; тела и уведомления сохраняются в состоянии мира.
- Сохранены прежние поля мира и обратная совместимость старых сохранений.


## 4.33.42 — полевая медицина и эвакуация

- Тяжелораненые участники активного отряда инициируют организованное возвращение по уже пройденному маршруту.
- На стоянке напарник-медик может провести полевую обработку: пациент восстанавливает до 12 здоровья, расходуя припасы пациента и медика.
- События лечения и медицинской эвакуации передаются сервером как системные сообщения.
- Обычное восстановление одиночных NPC и прежние механики сохранены.


## 4.33.43 — расширенная полевая медицина
- Добавлены обезболивающее и противошоковый набор в общий каталог предметов и торговли.
- Обезболивающее восстанавливает выносливость и снижает стресс; противошоковый набор восстанавливает больше здоровья ценой небольшой потери выносливости.
- В бою доступны аптечка, бинт и противошоковый набор с разной эффективностью; лечение занимает ход противника.
- Сохранены существующие ID предметов, серверная проверка торговли и совместимость старых сохранений.


## 4.33.45 — автономные операции спасения NPC
- Раненые одиночные сталкеры могут подавать сигнал бедствия при критическом уровне здоровья.
- Совместимые отряды NPC получают задачу спасения и физически проходят маршрут через соседние сектора.
- После обнаружения пострадавшему оказывается первая помощь, затем он присоединяется к отряду и сопровождается обратно на безопасную стоянку.
- Успешная эвакуация повышает мораль бойцов, восстанавливает часть здоровья и снабжения спасённого.
- Состояния операций сохраняются в общем мире и отображаются в разделе «Люди»; события публикуются в КПК и системном чате.
- Сохранены предыдущие механики, миграция существующего мира и единственный README.md.


## Версия 4.33.45 — тайники и полевые находки
- Добавлены постоянные тайники по секторам, записки и случайные находки.
- Поиск местности работает с серверным кулдауном; координаты тайников скрыты до обнаружения.
- Проверенные информаторы продают координаты нетронутых тайников за 22 000–43 000 ₽.
- Обыск тайника требует подойти к нему, а содержимое выдаётся сервером только один раз.


## 4.36.0 — PDA Interface Overhaul

- Player portrait, callsign, faction, balance, world clock and location are grouped in a right-aligned header dossier.
- The encyclopedia opens as a full-screen PDA workspace.
- The armory catalogue is now an encyclopedia section instead of a sidebar destination.
- The characters view is redesigned as a searchable two-pane contacts directory with portrait rows and detailed NPC dossiers.


## 4.38.0 — Character setup and Zone reports
- Restored the player squad panel when opening the Squads tab.
- Moved NPC approaches, faction casualty notices, rescue operations and Zone memorial entries into a dedicated Zone Reports tab.
- Reworked character creation into a three-panel PDA registration screen with a 400-point starter equipment budget.
- Selected starter equipment and supplies are added to the actual inventory and equipped at character creation.

## 4.43.0 — Faction equipment and expanded armory
- Added 30 additional weapon entries to the in-game armory catalogue.
- Added 14 faction-specific armor variants covering Duty, Freedom, Military, Mercenaries, Clear Sky, Loners, Monolith, Bandits, Renegades and Scientists.
- New armor variants can be selected in character creation and use the existing suit equipment/defense/condition systems.
- Added the new weapons and armor to shared NPC shop data and the player-trade allowlist.


## 4.45.0 — Comfort settings and character identity
- Added persistent interface scale (90–130%), high contrast, larger touch controls, compact layout, reduced motion and reduced background effects.
- Added matching settings to the title screen and in-game settings panel, plus a reset-to-defaults action.
- Character creation now generates a first name and a callsign only; legacy full-name values are normalized to the first name.
- Profile display now shows the character as “Имя Позывной” and stores the two values separately for multiplayer compatibility.
- Fixed the UI-scale setting to work in the lightweight browser test environment as well as normal browsers.


## 4.45.0 — PDA map intelligence and living Zone dashboard

- Added an integrated intelligence center inside the map with Overview, News, Tasks, Radio and Sectors tabs.
- Overview combines current-sector control/risk, weather, emission status, active assignments and local contacts.
- News tab shows the latest PDA reports and provides access to the full news journal and rumor requests.
- Tasks tab summarizes accepted unfinished assignments and links to the quest board and contacts.
- Radio tab previews incoming faction transmissions only; the existing receive-only radio rules remain unchanged.
- Sectors tab lists nearby strategic sectors and opens their map details without leaving the map screen.
- Added responsive styling for mobile and full-screen map layouts.

## 4.46.0 — BUGFIX & CODE CLEANUP

- Fixed sector visit history and travel statistics: they now update on each confirmed expedition hop, including intermediate sectors.
- Offline random encounters are scheduled after the expedition reaches its destination, not when the travel order is submitted.
- Removed four shadowed duplicate map interaction function declarations.
- Unified cache-busting versions for first-party browser scripts.
- Added regression coverage for duplicate declarations and expedition arrival bookkeeping.


## 4.47.0 — Multiplayer authority fixes

- Player profile saves no longer control the server-owned sector or world coordinates.
- `player:update` rejects direct client-side sector changes; confirmed expedition and squad travel remain server-driven.
- Confirmed sector arrivals update server coordinates for leaders and squad followers.
- Added regression tests for client teleport prevention and faction spawn initialization.

## Multiplayer audit — remaining risks

- The guest profile handshake uses a browser-generated UUID without account authentication. Treat it as a guest identity, not a secure account credential.
- A brand-new guest profile is still bootstrapped from its first client payload so existing character creation and starter-loadout choices remain compatible. Guest UUIDs are not authenticated accounts, so this is not a full anti-cheat or account-security boundary.
- Live multi-client and PostgreSQL integration tests still require installed dependencies and a configured database. The current automated suite validates the source contracts and isolated game systems, not a deployed multiplayer session.

## 4.48.0 — server authority and economy

- Generic online profile saves now preserve server-owned money, inventory, health, XP, reputation, quest/career progress, equipment, character identity, faction and discovered sectors. Client-side settings and non-protected presentation state can still be saved.
- The server returns an authoritative save acknowledgement; the online client reconciles the protected fields instead of retaining locally forged economy/progression values.
- PostgreSQL deployments create `zone_trade_receipts` and record each accepted trade offer ID inside the same transaction as the two profile updates. A retried offer after a restart cannot apply the same transfer twice.
- This is a staged authority migration. Guest UUID identity is still not account authentication, and offline/local gameplay continues to use local saves.


## 4.49.0 — signed guest sessions

- Guest sessions now use HMAC-SHA256 signed bearer tokens tied to the player UUID and a 90-day expiry. The browser stores the token in local storage and sends it during the Socket.IO hello handshake.
- Existing profiles created before this change are migrated once: their first successful return receives a signed session token. Generic client saves cannot change the server-owned guest-session version marker.
- Existing saved profiles with a session marker reject hello requests that do not present a valid token.
- A legacy profile without a session marker can still be claimed once during migration; this compatibility window cannot prove historical ownership.
- Configure `ZONE_SESSION_SECRET` with a stable random secret of at least 32 bytes in the hosting environment (for example, generate one with `openssl rand -hex 48`). If omitted, the server generates an ephemeral secret and warns that guest sessions will be invalidated after process restart.
- When PostgreSQL is unavailable, profiles remain memory-fallback only; session signing does not create durable profile storage.


## 4.50.0 — NPC map interaction and layout fixes

- Selecting an NPC marker on the map now only opens its information card; it does not issue a movement order.
- The player starts approaching an NPC only after pressing **«Подойти для разговора»** in that card.
- Added a dedicated `approachNpcForConversation` action that rechecks the NPC's sector and current distance before issuing the movement order.
- NPC marker pointer/click events stop propagation so they cannot be interpreted as clicks on the map background.
- Reworked the NPC interaction card layout: action buttons are consistently full-width and vertically aligned, with long labels wrapping cleanly.
- Existing talk radius remains 8 m; if the player is already within range, the explicit approach action opens dialogue directly.
