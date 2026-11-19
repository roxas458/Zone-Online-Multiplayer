# ZONE ONLINE 4.9.0 — HUMAN STORIES

A backward-compatible continuation of ZONE ONLINE 4.8.0.

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

Deploy the full project folder to the existing Node service. Keep the existing `DATABASE_URL` and PostgreSQL database; 4.9 does not require a schema migration. Do not delete browser local storage or reset the player profile. Existing 4.8 saves are migrated in place.

## Notes
- Device clock is used for the client display; players with incorrect device clocks may see an incorrect local time. The authoritative server still timestamps shared-world events.
- The browser clock is not used to authorize multiplayer actions.


## 4.9 — HUMAN STORIES

- Переработана тактическая карта: рельефные слои, водные преграды, маршруты, сектора, подписи контроля и маркеры точек интереса.
- Добавлены масштабирование карты и более удобная навигация на сенсорных экранах.
- Для телефонов добавлена нижняя панель быстрого доступа, увеличены зоны нажатия, учтены safe-area отступы iOS.
- Добавлен раздел личных историй NPC с заданиями по локациям, наградами и сохранением прогресса.
- Обновлена визуальная система КПК в индустриальном полевом стиле.
