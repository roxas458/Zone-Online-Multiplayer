# ZONE ONLINE 4.33.4 — Audit and fixes

## Fixed
- Canonical player fields (`money`, `hp`, `xp`, `rep`, `name`, `faction`, `loc`, `characterCreated`) are normalized in the persisted player state itself. Previously only the validation summary was clamped, leaving the original untrusted values in the nested state object.
- A legitimate `hp:  0` is preserved instead of being converted to 100 by a truthiness fallback.
- Existing PostgreSQL player records are normalized before they are reused by gameplay or sent to the browser.
- `/api/status` now reports the actual `package.json` version instead of a hard-coded 4.33.0 service label.

## Verification
- `npm test`: 97 tests passed, 0 failed.
- `npm run check`: all configured JavaScript syntax checks passed.

## Remaining verification
- A live HTTP/server smoke test could not be completed in this workspace because runtime dependencies (including `express`) are not installed. Install dependencies with `npm install` and run `npm start` in the deployment environment.
- PostgreSQL and hosted WebSocket behavior require testing with the actual deployment environment and its `DATABASE_URL`/proxy configuration.
