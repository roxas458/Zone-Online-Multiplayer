'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {ensureRandomNpcs}=require('../src/systems/npc-roster');
test('generated NPCs form named 2–5 person squads',()=>{const world={territoryOwners:{cordon:'Одиночки',zaton:'Одиночки',bar:'Долг',jupiter:'Свобода',red:'Свобода',army:'Свобода',dump:'Бандиты',dark:'Бандиты',darkhollow:'Бандиты',agro:'Военные',yantar:'Учёные',limansk:'Наёмники',wild:'Наёмники',chaes:'Монолит',pripyat:'Монолит',radar:'Монолит',swamps:'Чистое небо'}};ensureRandomNpcs(world,340);assert.ok(world.npcGroups.length>0);assert.ok(world.npcGroups.every(g=>g.size>=2&&g.size<=5));assert.ok(world.npcGroups.every(g=>g.name&&g.members.length===g.size));});
