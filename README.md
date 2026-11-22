# ZONE ONLINE 4.33.43

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
