const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const game=fs.readFileSync(path.join(root,'public/js/game.js'),'utf8');
const css=fs.readFileSync(path.join(root,'public/css/game.css'),'utf8');
const roster=fs.readFileSync(path.join(root,'src/systems/npc-roster.js'),'utf8');
const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
const ranks=require('../src/systems/ranks');
test('4.59 starter weapon selector exposes a broad set beyond PM, TOZ and AKS-74U',()=>{
 for(const id of ['weapon_pm','weapon_sawed','weapon_bm16','weapon_toz34','weapon_chaser','weapon_aks74u','weapon_ak74','weapon_akm','weapon_abakan','weapon_vintar'])assert.match(game,new RegExp(id));
 assert.match(game,/\['weapon_none','weapon_pm','weapon_sawed','weapon_bm16','weapon_toz34','weapon_chaser','weapon_aks74u','weapon_ak74','weapon_akm','weapon_abakan','weapon_vintar'\]/);
});
test('4.59 faction quest board seeds separate missions for all ten factions and filters other faction givers',()=>{
 for(const f of ['Одиночки','Долг','Свобода','Бандиты','Военные','Учёные','Наёмники','Монолит','Чистое небо','Ренегаты'])assert.ok(game.includes(`'${f}':[[`));
 assert.match(game,/q\.faction===g\.faction/);assert.match(game,/knownStoryGivers/);
});
test('4.59 Clear Sky-inspired ranks cover six tiers and player/NPC ranks are displayed',()=>{
 assert.deepEqual(ranks.RANKS.map(r=>r.name),['Новичок','Опытный','Сталкер','Ветеран','Мастер','Легенда']);
 assert.equal(ranks.rankForXp(600).name,'Мастер');assert.match(game,/npc-rank-insignia/);assert.match(game,/rankDataForXp\(g\.xp\)\.badge/);
 assert.match(roster,/rankName:rank\.name/);assert.match(server,/rankName','rankBadge','rankTier/);
});
test('4.59 NPCs receive rank-tier and faction-specific equipment loadouts',()=>{
 assert.match(roster,/FACTION_GEAR/);assert.match(roster,/rankGenerated:true/);assert.match(roster,/Экзоскелет/);
});
test('4.59 NPC map movement interpolates between authoritative positions instead of snapping',()=>{
 assert.match(game,/function runNpcMotionFrame\(\)/);assert.match(game,/requestAnimationFrame\(runNpcMotionFrame\)/);assert.match(game,/duration:1000/);
});
test('4.59 combat markers use tactical crossed-blade signals and contain no flame/muzzle effects',()=>{
 assert.match(game,/combat-crossed-blades/);assert.doesNotMatch(game,/combat-flame|battle-hotspot-flame|combat-muzzle-flash|🔥/);
 assert.doesNotMatch(css,/combat-flame|battle-hotspot-flame|combat-muzzle-flash|zoneFireFlicker/);
});
