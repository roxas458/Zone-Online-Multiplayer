# ZONE ONLINE 4.33.26 — NPC Proximity & Squad Combat

- Added shared map-space proximity rules with a 52 m interaction radius and 112 m combat radius.
- NPC conversation, NPC trading, specialist services and NPC combat kills are validated server-side against the player's actual map coordinates.
- Selecting an NPC squad marker on the tactical map highlights its talk and combat radii.
- Hostile NPCs inside combat radius can initiate a contact against the player; the player's squad contributes supporting damage in encounters.
- Hostile NPCs can engage nearby rival NPCs in local skirmishes, with health loss, deaths and world events recorded.
- NPC positions are generated deterministically from the same map-space algorithm used by the browser map.

Validation: `npm run check` and `npm test`.
