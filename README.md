# ZONE ONLINE 4.33.38

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


## 4.33.38 — Realistic Zone foundation

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
