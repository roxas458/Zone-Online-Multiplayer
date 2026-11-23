const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const game=fs.readFileSync(path.join(root,'public/js/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
test('4.59.1 new game keeps the character setup open and defers replacing the server profile until confirmation',()=>{
 assert.match(game,/let pendingNewCharacterSetup=false/);
 assert.match(game,/pendingNewCharacterSetup=true;[\s\S]*?localStorage\.removeItem\('zoneExpandedSave'\)/);
 assert.match(game,/if\(!pendingNewCharacterSetup&&data\.savedState&&typeof data\.savedState==='object'/);
 assert.match(game,/if\(!data\.savedState&&!pendingNewCharacterSetup\)zoneSocket\.emit\('player:save',g\)/);
 assert.match(game,/pendingNewCharacterSetup=false;awaitingNewCharacterSaveName=name;if\(zoneSocket\?\.connected&&zonePlayerId\)/);
 assert.match(game,/awaitingNewCharacterSaveName&&data\.state\.name!==awaitingNewCharacterSaveName/);
 assert.match(html,/onclick="beginNewZoneGame\(\)"/);
 assert.match(html,/onclick="confirmCharacter\(\)"/);
});
test('4.59.1 stale server save acknowledgements cannot restore the previous character after new game confirmation',()=>{
 assert.match(game,/zoneSocket\.on\('player:save:ack',data=>\{if\(pendingNewCharacterSetup\|\|!data\?\.state\)return;if\(awaitingNewCharacterSaveName&&data\.state\.name!==awaitingNewCharacterSaveName\)return/);
});

test('4.59.1 server only replaces a protected character profile through the explicit validated new-game event',()=>{
 const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
 assert.match(server,/socket\.on\('player:new-game', async input=>\{/);
 assert.match(server,/if\(!s\.characterCreated\|\|s\.name\.length<2\|\|!FACTIONS\.has\(input\?\.faction\)\)/);
 assert.match(server,/mergeClientSaveState\(p\.state,clientState\.state/);
 assert.match(server,/reconcilePlayerPosition\(p,s\.state,\{firstCharacter:true/);
 assert.match(game,/zoneSocket\.emit\('player:new-game',g\)/);
 assert.match(game,/player:new-game:error/);
});
