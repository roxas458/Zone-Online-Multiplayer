# ZONE ONLINE 4.30.4 — ACCOUNT / MULTIPLAYER RECOVERY

## Critical fixes
- An invalid, expired, or unverifiable account token no longer blocks Socket.IO multiplayer. The server safely creates a separate guest identity; it never trusts the account player ID without a valid session.
- The browser clears stale account credentials when the server reports an invalid session and continues in guest mode.
- Guest multiplayer works without PostgreSQL. Account registration/login and cross-device persistence explicitly require PostgreSQL (`DATABASE_URL`).
- Added `/api/diagnostics` with service version, multiplayer status, online count, Socket.IO path/transports and account database availability.
- Added an in-game “Проверить сеть и сервер” diagnostic action.
- Added a connection-attempt guard to prevent overlapping asynchronous reconnect attempts from creating competing sockets.
- Relaxed the separate-server version check: a valid ZONE ONLINE server is no longer rejected merely because it is running an earlier compatible 4.20+ release.

## Deploy
Build: `yarn install` or `npm install`
Start: `yarn start` or `npm start`
Deploy the complete project to the existing Render Web Service. Do not create a new service or delete the database.

## Required Render configuration
- For guest multiplayer only: PostgreSQL is optional.
- For account registration/login and cross-device saves: attach Render PostgreSQL and set `DATABASE_URL` to its Internal Database URL.

## Verify after deploy
- `https://YOUR-SERVICE.onrender.com/health` should return `ok: true`, `version: "4.30.4"`.
- `https://YOUR-SERVICE.onrender.com/api/diagnostics` should return `multiplayer: true`.
- In the game, Multiplayer → “Проверить сеть и сервер” shows HTTP, Socket.IO and database status.
- Render logs should show `[socket] connected`, `[socket] player:hello received`, and `player:hello completed`.

## Important
The patch cannot enable persistent accounts without an actual PostgreSQL database. It does prevent missing/expired account sessions from disabling anonymous multiplayer. Existing browser saves are not deleted.
