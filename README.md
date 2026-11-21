# ZONE ONLINE 4.33.25

Обновление главного меню: атмосферный стартовый экран, продолжение и загрузка локального сохранения, запуск новой игры с выбором группировки и позывного, переход к сетевой игре и опциям. Адаптивная компоновка для мобильных экранов.

Запуск: `npm install`, затем `npm start`.

Новая игра заменяет текущее локальное сохранение после подтверждения. Продолжение использует сохранение браузера.


## 4.33.25 — Full-viewport layout and survival HUD

- Desktop game layout now expands to the full browser viewport instead of being constrained to a narrow centered canvas.
- Added an optional browser Fullscreen API control in the game header.
- Added a compact S.T.A.L.K.E.R.-inspired survival HUD with segmented health and stamina meters.
- HUD displays the currently equipped weapon and its condition percentage.
- HUD is hidden on the title screen and repositioned above mobile navigation on narrow screens.
- Preserved the existing save format and game state; HUD reads existing `hp`, `stamina`, equipment and item-condition fields.


## 4.33.25 — Tactical map navigation

- Full-width, taller tactical map with a dedicated fullscreen button.
- Drag to pan, wheel or buttons to zoom, and click anywhere on the map to move or request travel to another sector.
- Slower walking speed in online and offline play.
- Original map artwork and existing game content are preserved.
