# ZONE ONLINE 4.33.31 — player interactions and connection reliability

- Reduced health preflight wait to 1.8 seconds with a 1.2 second per-request limit.
- Prefer Socket.IO HTTP polling first, then upgrade to WebSocket; this avoids long WebSocket-first stalls on some desktop networks while retaining upgrade support.
- The self marker is now the same compact visual size as other player/NPC map markers and is clickable.
- Clicking the self marker opens a distance-sorted list of players in the current sector.
- Clicking another player's map marker opens actions: message, trade, invite to squad, and friend request.
- Map player markers are keyboard accessible and have enlarged invisible hit areas for touch devices.
- Player-to-player trade and squad actions continue to use existing server-authoritative handlers.

Cold starts on Render Free can still exceed 10 seconds because the platform may suspend the service.
