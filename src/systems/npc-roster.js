// Persistent supporting stalkers. Most are stationed at faction territory, not wanderers.
const FIRST = []; // Legacy real-name pools intentionally disabled.
const LAST = []; // All generated stalkers use callsigns only.
const ROLES = ['сталкер','разведчик','техник','медик','собиратель артефактов','проводник','торговец','охотник'];
const ICONS = ['◉','⌁','⚙','☢','◆','✚','☼','▣','◈','♟'];
const NPC_TARGET = 340;
const SQUAD_NAMES = ['Северный ветер','Глухари','Ржавые псы','Последний дозор','Серая стая','Болотные тени','Чёрный след','Сухой закон','Кочевники','Тихая тропа','Свинцовый рассвет','Старые волки','Дикий рубеж','Пепельный путь','Кровавый след','Вольные стрелки'];
const { FACTION_HOME, homeForFaction } = require('./territories');
const FACTIONS = Object.keys(FACTION_HOME);
const NAME_SUFFIXES=['Северный','Тихий','Ржавый','Лесной','Степной','Дальний','Седой','Младший','Старший','Ночной','Каменный','Болотный','Красный','Серый','Восточный','Западный','Приозёрный','Сухой','Дымный','Зоркий'];
// Zone-style nicknames for procedurally generated stalkers. Named story characters are untouched.
const NICK_FIRST=['Васян','Лёша','Максим','Серый','Костя','Жека','Димон','Рома','Саня','Федя','Гриша','Вован','Тоха','Илюха','Мишаня','Егор','Борис','Тимур','Кир','Паша','Витёк','Глеб','Антон','Ярик','Стас','Даня','Аркадий','Захар','Игнат','Сева','Клим','Ратибор','Фома','Гена','Лёня','Трофим','Матвей','Славик','Кабан','Крот','Шрам','Грач','Филин','Боцман','Док','Шило','Клык','Седой','Батя','Малой'];
const NICK_TAIL=['Глюк','Дворецкий','Скелет','Бес','Шрам','Клык','Крот','Грач','Филин','Болт','Шуруп','Кабан','Беркут','Сыч','Глухарь','Рысь','Ворон','Барс','Боцман','Прапор','Дизель','Факел','Ржавый','Сухарь','Патрон','Гильза','Рикошет','Затвор','Приклад','Калибр','Сапёр','Механик','Связист','Радист','Сталкер','Бродяга','Скиталец','Фартовый','Тихий','Хмурый','Лютый','Шальной','Косой','Седой','Рыжий','Мрачный','Зоркий','Бывалый','Старый','Лесник','Болотник','Туман','Пепел','Дым','Уголь','Мотор','Порох','Гвоздь','Лом','Топор','Медведь','Вепрь','Ястреб','Сокол','Барсук','Ёрш','Карась','Шершень','Комар','Пиявка','Мухомор','Камень','Бетон','Кирпич','Рубеж','Периметр','Дозор','Следопыт','Проводник','Торговец','Доктор','Лекарь','Капкан','Мародёр','Зверь','Пёс','Волк','Зубр','Танк','Кремень','Пузырь','Хмель','Кочегар','Монтёр','Слесарь','Трактор','Домкрат','Картечь','Дробь','Магнит','Радар','Маяк','Шторм','Гром','Вихрь','Север','Южак','Батон','Кекс','Пломбир','Кефир','Бублик','Шпрот','Пончик','Ирис','Самовар','Квас','Чебур'];

def_hash_placeholder=''

function hashText(value){let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
const FEATURED_NICKS=['Васян Глюк','Лёша Дворецкий','Максим Скелет','Серый Шрам','Костя Клык','Жека Крот','Димон Грач','Рома Филин','Саня Болт','Федя Кабан','Гриша Беркут','Вован Сыч'];
function generatedName(id,usedNames=new Set()){const match=String(id).match(/^wanderer_(\d+)$/);if(match){const featured=FEATURED_NICKS[Number(match[1])-1];if(featured&&!usedNames.has(featured)){usedNames.add(featured);return featured;}}const h=hashText(id),total=NICK_FIRST.length*NICK_TAIL.length;for(let n=0;n<total;n++){const index=(h+n)%total,a=Math.floor(index/NICK_TAIL.length),b=index%NICK_TAIL.length;const partA=String(NICK_FIRST[a]).replace(/[^А-ЯЁа-яё0-9]/g,'');const partB=String(NICK_TAIL[b]).replace(/[^А-ЯЁа-яё0-9]/g,'');const name=`${partA} ${partB}`;if(!usedNames.has(name)){usedNames.add(name);return name;}}const fallback=`Сталкер ${h.toString(36)}`;usedNames.add(fallback);return fallback;}
const STORY_NPC_IDS=new Set(['sid','wolf','fanatic','scout','bandit','barman','seriy','scientist','merc','prof','freedom','guide','loner','lebedev','novikov','cold','renegade_leader','renegade_scout','lukash','voronin','sultan','beard','charon','wolfhound','archivist','kravtsov','monolith_scout']);
function ensureRandomNpcs(world, count = NPC_TARGET) {
  world.npcState ||= {}; world.npcPositions ||= {};
  const used = new Set(Object.entries(world.npcState).filter(([id,n])=>STORY_NPC_IDS.has(id)&&n?.name).map(([,n])=>String(n.name).trim())); 
  const owners=world.territoryOwners||{};
  for (let i=0; i<count; i++) {
    const id = `wanderer_${String(i+1).padStart(3,'0')}`;
    if (world.npcState[id]) continue;
    const factionIndex=i%FACTIONS.length;
    const faction=FACTIONS[factionIndex];
    const factionSlot=Math.floor(i/FACTIONS.length);
    const homes=(FACTION_HOME[faction]||[]).filter(loc=>owners[loc]===faction);
    const location=homes[Math.floor(factionSlot/4)%Math.max(1,homes.length)]||homeForFaction(faction,owners);
    const name = generatedName(id,used);
    used.add(name);
    const squadId=`npc_squad_${factionIndex}_${Math.floor(factionSlot/4)}`;
    world.npcState[id] = { id, name, faction, role:ROLES[(i*3)%ROLES.length], location, homeLocation:location, baseLocation:location, destination:null, action:'camp', behavior:'camp', duty:'base_guard', guardPost:true, mood:['спокоен','насторожен','весёлый','уставший','подозрительный'][i%5], health:75+(i*13)%26, morale:45+(i*17)%51, supplies:25+(i*19)%70, alive:true, lastActionAt:Date.now(), nextDecisionAt:Date.now()+((i%9)+3)*60000, relationships:{}, inventory:[], history:[], generated:true, icon:ICONS[i%ICONS.length], squadId, direction:(i*47)%360, personality:['болтун','параноик','шутник','прагматик','мечтатель'][i%5], squadName:SQUAD_NAMES[(factionIndex*3+Math.floor(factionSlot/4))%SQUAD_NAMES.length], dialogueDay:-1, dialogueVersion:0, dialogueHistory:[], route:[], patrolRadius:1 };
    world.npcPositions[id] = location;
  }
  // Migrate EVERY non-story NPC (including legacy records that lacked generated=true)
  // to a callsign. Only the explicit story-character whitelist keeps canonical names.
  const generated=Object.entries(world.npcState)
    .filter(([id,n])=>n&& !STORY_NPC_IDS.has(id))
    .map(([,n])=>n)
    .sort((a,b)=>String(a.id).localeCompare(String(b.id)));
  used.clear();
  for(const [id,npc] of Object.entries(world.npcState)) if(STORY_NPC_IDS.has(id)&&npc?.name) used.add(String(npc.name).trim());
  for(const npc of generated){npc.generated=true;npc.name=generatedName(npc.id,used);used.add(npc.name);}
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
module.exports = { ensureRandomNpcs, NPC_TARGET, generatedName };
