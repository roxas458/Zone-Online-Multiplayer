// Persistent supporting stalkers. Most are stationed at faction territory, not wanderers.
const FIRST = ['Артём','Андрей','Алексей','Александр','Антон','Борис','Вадим','Валентин','Василий','Виктор','Виталий','Владимир','Геннадий','Георгий','Григорий','Даниил','Денис','Дмитрий','Евгений','Егор','Иван','Игнат','Игорь','Илья','Кирилл','Константин','Леонид','Максим','Матвей','Михаил','Никита','Николай','Олег','Павел','Пётр','Роман','Руслан','Савелий','Семён','Сергей','Станислав','Степан','Тимофей','Фёдор','Эдуард','Ярослав','Аким','Альберт','Аркадий','Богдан','Вениамин','Глеб','Демьян','Захар','Лаврентий','Марк','Мирон','Платон','Прохор','Родион','Святослав','Тарас','Филипп','Юрий','Ян','Братислав','Влад','Гордей','Елисей','Зиновий','Клим','Лука','Мстислав','Назар','Остап','Ратибор','Тихон','Фаддей','Эмиль','Яромир','Анатолий','Бронислав','Вячеслав','Герман','Давид','Ефим','Зорян','Карим','Леон','Марат','Нестор','Оскар','Ренат','Трофим','Феликс','Шамиль','Эрик','Артемий','Валерий','Григорий','Данила','Емельян','Иларион','Кузьма','Милан','Радомир','Серафим','Тимур','Фома','Яков']
const LAST = ['Волков','Морозов','Соколов','Лебедев','Кузнецов','Орлов','Зайцев','Белов','Громов','Тихонов','Ковалёв','Ершов','Фомин','Брагин','Королёв','Седых','Буров','Климов','Мельник','Савин','Руденко','Кравцов','Чернов','Лисов','Гордеев','Миронов','Фролов','Быков','Панов','Котов','Зорин','Агеев','Астахов','Бессонов','Ветров','Горшков','Доронин','Елисеев','Жуков','Зимин','Игнатов','Калинин','Капустин','Карпов','Кирсанов','Князев','Комаров','Кондратьев','Коротков','Кошелев','Лапин','Ларионов','Лукин','Макаров','Мартынов','Маслов','Медведев','Минин','Молчанов','Назаров','Нестеров','Никитин','Новиков','Овчинников','Осипов','Пахомов','Поляков','Потапов','Прохоров','Рогов','Рожков','Романов','Рыбаков','Сазонов','Самойлов','Селезнёв','Сергеев','Синицын','Смирнов','Соболев','Соловьёв','Сорокин','Степанов','Субботин','Тарасов','Терентьев','Титов','Трофимов','Уваров','Федотов','Филатов','Харитонов','Хомяков','Цветков','Черкасов','Шаповалов','Шаров','Щербаков','Юдин','Яковлев','Абрамов','Аверин','Андреев','Антонов','Архипов','Баженов','Баранов','Бахтин','Блинов','Бобров','Богданов','Борисов','Булатов','Васильев','Виноградов','Власов','Гаврилов','Галкин','Гончаров','Горбачёв','Гребнев','Гусев','Давыдов','Данилов','Демидов','Дьяков','Евсеев','Жданов','Журавлёв','Захаров','Звягинцев','Иванов','Ильин','Казаков','Каменев','Кириллов','Киселёв','Козлов','Колесников','Кольцов','Крылов','Кудрявцев','Кузьмин','Лазарев','Логинов','Лыткин','Майоров','Михайлов','Мордвинов','Муравьёв','Некрасов','Носов','Петухов','Платонов','Рябов','Савельев','Сафонов','Свиридов','Суханов','Токарев','Устинов','Фадеев','Фокин','Чесноков','Шестаков','Яшин','Спагетти','Табак','Пельмень','Болт','Чебурек','Кефир','Шуруп','Сухарь','Бублик','Картридж','Кисель','Кабачок','Беркутов','Воронцов','Грачёв','Дубровин','Касьянов','Малинин','Ратников','Северцев','Туманов','Ястребов']
const ROLES = ['сталкер','разведчик','техник','медик','собиратель артефактов','проводник','торговец','охотник'];
const ICONS = ['◉','⌁','⚙','☢','◆','✚','☼','▣','◈','♟'];
const NPC_TARGET = 340;
const SQUAD_NAMES = ['Северный ветер','Глухари','Ржавые псы','Последний дозор','Серая стая','Болотные тени','Чёрный след','Сухой закон','Кочевники','Тихая тропа','Свинцовый рассвет','Старые волки','Дикий рубеж','Пепельный путь','Кровавый след','Вольные стрелки'];
const { FACTION_HOME, homeForFaction } = require('./territories');
const FACTIONS = Object.keys(FACTION_HOME);
const NAME_SUFFIXES=['Северный','Тихий','Ржавый','Лесной','Степной','Дальний','Седой','Младший','Старший','Ночной','Каменный','Болотный','Красный','Серый','Восточный','Западный','Приозёрный','Сухой','Дымный','Зоркий'];
function hashText(value){let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function generatedName(id,usedSurnames){const h=hashText(id);const first=FIRST[h%FIRST.length];let surname=LAST[Math.floor(h/FIRST.length)%LAST.length];let n=0;while(usedSurnames.has(surname)){const suffix=NAME_SUFFIXES[(h+n)%NAME_SUFFIXES.length];surname=`${LAST[(Math.floor(h/FIRST.length)+n)%LAST.length]}-${suffix}`;n++;if(n>NAME_SUFFIXES.length*LAST.length){surname+=`-${h.toString(36)}`;break;}}usedSurnames.add(surname);return `${first} ${surname}`;}
function ensureRandomNpcs(world, count = NPC_TARGET) {
  world.npcState ||= {}; world.npcPositions ||= {};
  const used = new Set(Object.values(world.npcState).filter(n=>!n.generated).map(n => n.name));
  const usedSurnames = new Set([...used].map(name=>String(name).trim().split(/\s+/).at(-1))); 
  const owners=world.territoryOwners||{};
  for (let i=0; i<count; i++) {
    const id = `wanderer_${String(i+1).padStart(3,'0')}`;
    if (world.npcState[id]) continue;
    const factionIndex=i%FACTIONS.length;
    const faction=FACTIONS[factionIndex];
    const factionSlot=Math.floor(i/FACTIONS.length);
    const homes=(FACTION_HOME[faction]||[]).filter(loc=>owners[loc]===faction);
    const location=homes[Math.floor(factionSlot/4)%Math.max(1,homes.length)]||homeForFaction(faction,owners);
    const name = generatedName(id,usedSurnames);
    used.add(name);
    const squadId=`npc_squad_${factionIndex}_${Math.floor(factionSlot/4)}`;
    world.npcState[id] = { id, name, faction, role:ROLES[(i*3)%ROLES.length], location, homeLocation:location, baseLocation:location, destination:null, action:'camp', behavior:'camp', duty:'base_guard', guardPost:true, mood:['спокоен','насторожен','весёлый','уставший','подозрительный'][i%5], health:75+(i*13)%26, morale:45+(i*17)%51, supplies:25+(i*19)%70, alive:true, lastActionAt:Date.now(), nextDecisionAt:Date.now()+((i%9)+3)*60000, relationships:{}, inventory:[], history:[], generated:true, icon:ICONS[i%ICONS.length], squadId, direction:(i*47)%360, personality:['болтун','параноик','шутник','прагматик','мечтатель'][i%5], squadName:SQUAD_NAMES[(factionIndex*3+Math.floor(factionSlot/4))%SQUAD_NAMES.length], dialogueDay:-1, dialogueVersion:0, dialogueHistory:[], route:[], patrolRadius:1 };
    world.npcPositions[id] = location;
  }
  // Migrate all generated NPC surnames to a broad deterministic pool and keep them unique.
  const generated=Object.values(world.npcState).filter(n=>n?.generated&&n.alive!==false).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
  usedSurnames.clear();
  for(const npc of Object.values(world.npcState).filter(n=>!n?.generated&&n?.name))usedSurnames.add(String(npc.name).trim().split(/\s+/).at(-1));
  for(const npc of generated){npc.name=generatedName(npc.id,usedSurnames);}
  // Every faction receives a dedicated field medic and technician by assigning
  // specialist duties to two of its existing generated stalkers (no roster inflation).
  for(let factionIndex=0;factionIndex<FACTIONS.length;factionIndex++){
    const faction=FACTIONS[factionIndex];
    const factionNpcs=Object.values(world.npcState).filter(n=>n?.generated&&n.alive!==false&&n.faction===faction).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
    for(const [index,role,kind] of [[0,'медик','medic'],[1,'техник','technician']]){
      const npc=factionNpcs[index];if(!npc)continue;
      npc.role=role;npc.supportSpecialist=true;npc.duty=kind==='medic'?'field_medic':'field_technician';
      npc.inventory=kind==='medic'?['med','bandage']:['repair_kit','scrap'];npc.icon=kind==='medic'?'✚':'⚙';
      npc.personality=kind==='medic'?'заботливый':'практичный';
    }
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
  // Rebuild stable named 2–5 person squads; old generated saves are migrated from one-person wanderers.
  const byFaction=new Map();
  for(const npc of Object.values(world.npcState)){if(!npc?.generated||npc.alive===false)continue;const key=npc.faction||'Одиночки';if(!byFaction.has(key))byFaction.set(key,[]);byFaction.get(key).push(npc);}
  world.npcGroups=[];
  for(const [faction,members] of byFaction){members.sort((a,b)=>String(a.id).localeCompare(String(b.id)));let chunks=[];for(let i=0;i<members.length;i+=4)chunks.push(members.slice(i,i+4));if(chunks.length>1&&chunks.at(-1).length===1)chunks[chunks.length-2].push(...chunks.pop());chunks.forEach((group,index)=>{const squadId=`npc_group_${faction.toLowerCase().replace(/[^a-zа-я0-9]+/gi,'_')}_${index+1}`;const name=group[0].squadName||SQUAD_NAMES[index%SQUAD_NAMES.length];for(const npc of group){npc.squadId=squadId;npc.squadName=name;}world.npcGroups.push({id:squadId,name,faction,location:group[0].location,members:group.map(n=>n.id),size:group.length,status:group.every(n=>n.behavior==='camp'||n.behavior==='guard')?'garrison':'field'});});}
  return world.npcState;
}
module.exports = { ensureRandomNpcs, NPC_TARGET };
