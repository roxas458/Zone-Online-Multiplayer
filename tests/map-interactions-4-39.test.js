const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const client=fs.readFileSync(require.resolve('../public/js/game.js'),'utf8');
const {INTERACTION_RADIUS,APPROACH_DISTANCE}=require('../src/systems/proximity');
test('NPC map selection issues an approach order while preserving the 8m talk radius and compact marker scale',()=>{assert.equal(INTERACTION_RADIUS,8);assert.equal(APPROACH_DISTANCE,5);assert.match(client,/function selectMapNpc\(id\)/);assert.match(client,/issueApproachOrder\(\{x:p\[0\],y:p\[1\]\},'npc',id\)/);assert.match(client,/scale\(\.42\)/);});
test('discovered stashes use their exact map coordinates and can be approached or looted from the map',()=>{assert.match(client,/currentStashes\|\|\[\]/);assert.match(client,/Number\(st\.x\)/);assert.match(client,/function showMapStash\(id\)/);assert.match(client,/function approachStash\(id\)/);assert.match(client,/onclick=\"showMapStash\('/);});
test('faction radio is a dedicated PDA view with send and receive handlers',()=>{const html=fs.readFileSync(require.resolve('../public/index.html'),'utf8');assert.match(html,/data-v=\"radio\"/);assert.match(html,/id=\"factionRadioFeed\"/);assert.match(client,/zoneSocket\.on\('radio:message'/);assert.match(client,/zoneSocket\.emit\('radio:send'/);});
