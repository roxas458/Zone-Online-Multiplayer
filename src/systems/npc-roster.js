// Procedural, persistent supporting stalkers. Names are intentionally odd and memorable.
const FIRST = ['Вадим','Вовка','Гена','Серёга','Паштет','Мишаня','Костян','Рома','Федя','Жека','Аркадий','Лёха','Тимоха','Борис','Данила','Егор','Стас','Ярик','Игнат','Славик','Гриша','Макс','Толя','Рыжий'];
const LAST = ['Спагетти','Табак','Кабачок','Пельмень','Шуруп','Кефир','Бублик','Картридж','Патронов','Кисель','Сухарь','Болт','Кирпич','Шпрот','Самовар','Пылесос','Квас','Чебурек','Ржавый','Комар','Фонарик','Крот','Скрипка','Пончик','Гвоздь','Капюшон'];
const FACTIONS = ['Одиночки','Долг','Свобода','Бандиты','Военные','Учёные','Наёмники','Чистое небо'];
const ROLES = ['сталкер','разведчик','механик','собиратель артефактов','проводник','торговец','охотник'];
const ICONS = ['◉','⌁','⚙','☢','◆','✚','☼','▣','◈','♟'];
const LOCATIONS = ['cordon','dump','bar','agro','dark','yantar','army','red','pripyat','zaton','jupiter','yanov','kopachi','volkhov','iron','swamps'];
function ensureRandomNpcs(world, count = 36) {
  world.npcState ||= {}; world.npcPositions ||= {};
  const used = new Set(Object.values(world.npcState).map(n => n.name));
  for (let i=0; i<count; i++) {
    const id = `wanderer_${String(i+1).padStart(3,'0')}`;
    if (world.npcState[id]) continue;
    let name = `${FIRST[(i*7+3)%FIRST.length]} ${LAST[(i*11+5)%LAST.length]}`;
    let suffix = 2; while (used.has(name)) name = `${FIRST[(i*7+3)%FIRST.length]} ${LAST[(i*11+5)%LAST.length]} ${suffix++}`;
    used.add(name);
    const location = LOCATIONS[(i*5+2)%LOCATIONS.length];
    const faction = FACTIONS[(i*3+1)%FACTIONS.length];
    world.npcState[id] = { id, name, faction, role:ROLES[(i*3)%ROLES.length], location, destination:null, action:'rest', mood:['спокоен','насторожен','весёлый','уставший','подозрительный'][i%5], health:75+(i*13)%26, morale:45+(i*17)%51, supplies:25+(i*19)%70, alive:true, lastActionAt:Date.now(), relationships:{}, inventory:[], history:[], generated:true, icon:ICONS[i%ICONS.length], personality:['болтун','параноик','шутник','прагматик','мечтатель'][i%5], dialogueDay:-1, dialogueVersion:0, dialogueHistory:[] };
    world.npcPositions[id] = location;
  }
  return world.npcState;
}
module.exports = { ensureRandomNpcs };
