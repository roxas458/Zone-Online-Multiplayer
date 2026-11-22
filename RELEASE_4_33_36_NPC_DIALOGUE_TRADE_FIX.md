# ZONE ONLINE 4.33.36 — NPC Dialogue & Trade Fix

## Fixed
- Restored authored, character-specific dialogue topics when server dialogue data is missing or partial.
- Kept server-generated dialogue for generated NPCs and used safe fallback topics for incomplete NPC records.
- Hardened dialogue choice rendering so an empty or malformed topic list cannot silently remove all conversation options.
- Changed the dialogue trade action to open the trade panel for the NPC currently being spoken to, rather than the sector-wide default trader.
- NPC trade now displays ordinary supplies for regular stalkers and restricts weapon stock to major traders.
- Kept the server as the authority for distance, stock, balance, and trade validation.

## Verification
- `npm run check` passed.
- `npm test` passed: 178 tests, 0 failures.
- Live multiplayer and browser-device testing still requires deployment and a real connected session.
