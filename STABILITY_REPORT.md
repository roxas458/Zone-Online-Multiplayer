# Stability report — 4.29.1

## Automated checks
- `npm test`: **77 tests passed, 0 failed**.
- `npm run check`: **passed** (all configured JavaScript syntax checks).
- Server and client JavaScript syntax checks: passed.
- ZIP archive integrity: verified after packaging.

## Dialogue
- Replaced the previous green modal with a two-sided industrial dialogue screen: NPC/player portrait cards, large translucent conversation panel, separate response list, and bottom Trade/Exit actions.
- Kept server-driven dialogue topic updates and offline dialogue behavior.
- Responsive layout added for narrow screens.

## Trading
- Added drag-and-drop plus click-to-add controls for a deal basket.
- Basket previews purchase/sale totals and supports item removal and clearing.
- Offline deal validates funds and item quantities before applying changes.
- Online deal uses a new atomic `market:deal` server event. The server aggregates duplicate rows, validates all requested items and quantities before applying inventory and balance changes, then persists once.
- Existing `market:buy` and `market:sell` events remain for compatibility.
- Item icons remain the project's original vector glyphs; no original game asset files were extracted or redistributed.

## Verification limits
- Automated tests and syntax checks do not verify the live Render deployment, real database connectivity, or browser rendering on every device. Those require testing against the deployed service.
