const test=require('node:test');
const assert=require('node:assert/strict');
const {initEcosystem}=require('../src/systems/ecosystem');
const {FACTIONS,NPC_HOME}=require('../src/shared/game-data');

test('ecosystem bootstraps anomaly intel and mutant packs',()=>{
 const world={territoryOwners:{swamps:'Чистое небо'}};
 const eco=initEcosystem(world);
 assert.ok(eco.anomalies.length>=20);
 assert.ok(eco.mutantPacks.length>=15);
 assert.ok(eco.anomalies.every(a=>a.id&&a.kind&&a.location&&a.danger>=0&&a.danger<=100));
 assert.ok(eco.mutantPacks.some(p=>p.species==='зомбированный сталкер'));
});

test('Renegades are a valid faction with swamp-based NPCs',()=>{
 assert.equal(FACTIONS.has('Ренегаты'),true);
 assert.equal(NPC_HOME.renegade_leader,'swamps');
 assert.equal(NPC_HOME.renegade_scout,'swamps');
});
