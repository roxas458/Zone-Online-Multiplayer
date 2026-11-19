# ZONE ONLINE 3.0 — Expanded PDA RPG

Browser RPG update based on the supplied ZONE ONLINE 2.2 project.

## New in 3.0
- PDA inventory with search, category filters, sorting, item weight, prices and equipment condition.
- Dedicated weapon catalogue with 24 fictional in-game entries across pistols, shotguns, assault rifles, rifles and special equipment.
- Weapon entries can be discovered while investigating location points and added to the backpack.
- Authored key points for all 15 sectors, including safe areas, routes, research sites, stashes and anomaly locations.
- Each point can be investigated; discovery grants XP and may reveal equipment.
- Expanded generated NPC population across sectors, using varied names and roles.
- Original abstract item/weapon glyphs and a custom visual style. No proprietary S.T.A.L.K.E.R. game icons or extracted assets are included.
- Existing local saves are migrated without intentionally resetting player progress.

## Run locally
Node.js 18 or newer:
```bash
npm install
npm start
```
Open `http://localhost:3000`.

## Render
Keep the existing Web Service and PostgreSQL configuration:
- Build: `npm install`
- Start: `npm start`
- Environment: `DATABASE_URL` set to the Render PostgreSQL Internal Database URL.

## Notes
This remains a browser RPG, not a 3D shooter. The PDA, NPC dialogue, exploration and most quest mechanics are client-side game systems; the existing global multiplayer server handles presence, chat, profiles and the shared systems already implemented in 2.2. The weapon catalogue is an original game-facing reference, not a reproduction of proprietary source assets. The original S.T.A.L.K.E.R. icons are not bundled.


## ZONE ONLINE 3.1 — Character & Combat Update

- Новый экран создания персонажа: выбор позывного и одной из девяти группировок до начала игры.
- Выбор группировки и позывной сохраняются в профиле и передаются в общий онлайн-мир.
- Пошаговые условные столкновения: атака, укрытие, аптечка и отступление.
- Сила игрового действия зависит от экипированного оружия и его состояния; защита учитывает надетый костюм.
- Случайные столкновения могут возникать при исследовании и переходах между секторами.
- Есть тренировочный запуск столкновения из главного экрана.

Боевая система — абстрактная игровая механика, не руководство по реальному применению оружия. Столкновения пока рассчитываются на клиенте; для соревновательной защиты и честного PvP потребуется перенести их расчёт на сервер.

- Авторские векторные SVG-иконки категорий предметов вместо простых текстовых символов.
- Общие открытия ключевых точек: найденные одним игроком места становятся известны остальным.
- Серверные мировые сводки и динамические события рассылаются всем подключённым игрокам.
- Расписание перемещения NPC продолжает работать на сервере и синхронизируется с клиентами.
