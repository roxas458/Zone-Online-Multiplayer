const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const client=fs.readFileSync(require.resolve('../public/js/game.js'),'utf8');
const {INTERACTION_RADIUS,APPROACH_DISTANCE}=require('../src/systems/proximity');
test('NPC map selection issues an approach order while preserving the 8m talk radius and compact marker scale',()=>{assert.equal(INTERACTION_RADIUS,8);assert.equal(APPROACH_DISTANCE,5);assert.match(client,/function selectMapNpc\(id\)/);assert.match(client,/issueApproachOrder\(\{x:p\[0\],y:p\[1\]\},'npc',id\)/);assert.match(client,/scale\(\.42\)/);});
test('discovered stashes use their exact map coordinates and can be approached or looted from the map',()=>{assert.match(client,/currentStashes\|\|\[\]/);assert.match(client,/Number\(st\.x\)/);assert.match(client,/function showMapStash\(id\)/);assert.match(client,/function approachStash\(id\)/);assert.match(client,/onclick=\"showMapStash\('/);});
test('faction radio is a unique receive-only PDA view driven by NPC broadcasts',()=>{const html=fs.readFileSync(require.resolve('../public/index.html'),'utf8');const server=fs.readFileSync(require.resolve('../server.js'),'utf8');assert.equal((html.match(/data-v="radio"/g)||[]).length,1);assert.equal((html.match(/id="radio"/g)||[]).length,1);assert.match(html,/id="factionRadioFeed"/);assert.match(html,/Передавать сообщения с КПК нельзя/);assert.match(client,/zoneSocket\.on\('radio:message'/);assert.doesNotMatch(client,/radio:send/);assert.doesNotMatch(server,/radio:send/);});
