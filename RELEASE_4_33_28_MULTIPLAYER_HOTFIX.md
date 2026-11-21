# ZONE ONLINE 4.33.28 — Multiplayer connection optimization

- Initial player login now sends one world snapshot plus a small revision cursor instead of a second duplicated snapshot/delta.
- NPC roster is sent only to the joining socket; joining no longer broadcasts the full NPC roster to every connected player.
- NPC roster payload omits precomputed dialogue text; dialogue is generated on demand by the authoritative server.
- NPC dialogue generation is limited to the 15-minute dialogue cycle instead of rebuilding every minute.
- Browser starts an HTTP health warm-up in parallel with Socket.IO so a sleeping Render instance can wake while the socket connects.
- Socket.IO connection timeout and retry delays are shorter, with automatic retry retained.
- Node engine range supports local Node 26 while Render remains pinned to Node 22 LTS.

Validation: `npm run check` and `npm test` pass.
