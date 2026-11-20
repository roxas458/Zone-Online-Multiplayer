// Persistent supporting stalkers. Most are stationed at faction territory, not wanderers.
const FIRST = ['Вадим','Вовка','Гена','Серёга','Паштет','Мишаня','Костян','Рома','Федя','Жека','Аркадий','Лёха','Тимоха','Борис','Данила','Егор','Стас','Ярик','Игнат','Славик','Гриша','Макс','Толя','Рыжий'];
const LAST = ['Спагетти','Табак','Кабачок','Пельмень','Шуруп','Кефир','Бублик','Картридж','Патронов','Кисель','Сухарь','Болт','Кирпич','Шпрот','Самовар','Пылесос','Квас','Чебурек','Ржавый','Комар','Фонарик','Крот','Скрипка','Пончик','Гвоздь','Капюшон'];
const ROLES = ['сталкер','разведчик','механик','собиратель артефактов','проводник','торговец','охотник'];
const ICONS = ['◉','⌁','⚙','☢','◆','✚','☼','▣','◈','♟'];
const NPC_TARGET = 340;
const { FACTION_HOME, homeForFaction } = require('./territories');
const FACTIONS = Object.keys(FACTION_HOME);
function ensureRandomNpcs(world, count = NPC_TARGET) {
  world.npcState ||= {}; world.npcPositions ||= {};
  const used = new Set(Object.values(world.npcState).map(n => n.name));
  const owners=world.territoryOwners||{};
  for (let i=0; i<count; i++) {
    const id = `wanderer_${String(i+1).padStart(3,'0')}`;
    if (world.npcState[id]) continue;
    const faction=FACTIONS[i%FACTIONS.length];
    const homes=(FACTION_HOME[faction]||[]).filter(loc=>owners[loc]===faction);
    const location=homes[Math.floor(i/FACTIONS.length)%Math.max(1,homes.length)]||homeForFaction(faction,owners);
    let name = `${FIRST[(i*7+3)%FIRST.length]} ${LAST[(i*11+5)%LAST.length]}`;
    let suffix = 2; while (used.has(name)) name = `${FIRST[(i*7+3)%FIRST.length]} ${LAST[(i*11+5)%LAST.length]} ${suffix++}`;
    used.add(name);
    const squadId=`squad_${faction.toLowerCase().replace(/[^a-zа-я0-9]+/gi,'_')}_${Math.floor(i/4)}`;
    world.npcState[id] = { id, name, faction, role:ROLES[(i*3)%ROLES.length], location, homeLocation:location, baseLocation:location, destination:null, action:'camp', behavior:'camp', duty:'base_guard', guardPost:true, mood:['спокоен','насторожен','весёлый','уставший','подозрительный'][i%5], health:75+(i*13)%26, morale:45+(i*17)%51, supplies:25+(i*19)%70, alive:true, lastActionAt:Date.now(), nextDecisionAt:Date.now()+((i%9)+3)*60000, relationships:{}, inventory:[], history:[], generated:true, icon:ICONS[i%ICONS.length], squadId, direction:(i*47)%360, personality:['болтун','параноик','шутник','прагматик','мечтатель'][i%5], dialogueDay:-1, dialogueVersion:0, dialogueHistory:[], route:[], patrolRadius:1 };
    world.npcPositions[id] = location;
  }
  // Migrate old generated NPCs whose faction/location pair was randomly assigned in earlier builds.
  for(const npc of Object.values(world.npcState)){
    if(!npc?.generated||npc.alive===false)continue;
    const valid=(FACTION_HOME[npc.faction]||[]).filter(loc=>owners[loc]===npc.faction);
    if(valid.length&&!valid.includes(npc.location)&&!npc.missionOrder){
      const home=homeForFaction(npc.faction,owners,npc.homeLocation);
      npc.location=home;npc.homeLocation=home;npc.baseLocation=home;npc.destination=null;npc.action='camp';npc.behavior='camp';npc.duty='base_guard';npc.guardPost=true;
      world.npcPositions[npc.id]=home;
    }
    npc.homeLocation ||= npc.location; npc.baseLocation ||= npc.homeLocation; npc.behavior ||= npc.action==='travel'?'patrol':'camp';
    npc.nextDecisionAt ||= Date.now()+5*60000;
  }
  return world.npcState;
}
module.exports = { ensureRandomNpcs, NPC_TARGET };
