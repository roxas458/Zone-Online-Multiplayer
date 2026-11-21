// Shared game data: canonical IDs and static definitions used by server modules.
const LOCATIONS = new Set(['chaes','zaton','pripyat','jupiter','limansk','red','radar','army','wild','bar','yantar','dump','agro','dark','cordon','swamps','darkhollow']);
const FACTIONS = new Set(['Одиночки','Долг','Свобода','Бандиты','Военные','Учёные','Наёмники','Монолит','Чистое небо','Ренегаты']);

// Canonical starting diplomacy for the trilogy-inspired sandbox. Values are symmetric:
// -60 = open hostility, 0 = neutrality, +60 = close cooperation.
const FACTION_RELATION_PAIRS = Object.freeze({
  'Одиночки': {'Долг':10,'Свобода':10,'Бандиты':-45,'Военные':-35,'Учёные':30,'Наёмники':-15,'Монолит':-60,'Чистое небо':25,'Ренегаты':-50},
  'Долг': {'Свобода':-60,'Бандиты':-55,'Военные':-40,'Учёные':30,'Наёмники':-45,'Монолит':-60,'Чистое небо':15,'Ренегаты':-50},
  'Свобода': {'Бандиты':-45,'Военные':-50,'Учёные':25,'Наёмники':-45,'Монолит':-60,'Чистое небо':25,'Ренегаты':-55},
  'Бандиты': {'Военные':-45,'Учёные':-20,'Наёмники':0,'Монолит':-60,'Чистое небо':-45,'Ренегаты':15},
  'Военные': {'Учёные':45,'Наёмники':-40,'Монолит':-60,'Чистое небо':0,'Ренегаты':-45},
  'Учёные': {'Наёмники':0,'Монолит':-60,'Чистое небо':35,'Ренегаты':-50},
  'Наёмники': {'Монолит':-60,'Чистое небо':0,'Ренегаты':-15},
  'Монолит': {'Чистое небо':-60,'Ренегаты':-60},
  'Чистое небо': {'Ренегаты':-55}
});
function createFactionDiplomacy(factions) {
  const result = Object.fromEntries(factions.map(name => [name, {}]));
  for (const [a, relations] of Object.entries(FACTION_RELATION_PAIRS)) {
    for (const [b, value] of Object.entries(relations)) {
      if (result[a] && result[b]) { result[a][b] = value; result[b][a] = value; }
    }
  }
  for (const a of factions) for (const b of factions) if (a !== b && result[a][b] === undefined) result[a][b] = 0;
  return result;
}

const TERRITORY_START = Object.freeze({chaes:{owner:'Монолит',control:91},zaton:{owner:'Одиночки',control:52},pripyat:{owner:'Монолит',control:91},jupiter:{owner:'Свобода',control:58},limansk:{owner:'Наёмники',control:39},red:{owner:'Свобода',control:48},radar:{owner:'Монолит',control:84},army:{owner:'Свобода',control:67},wild:{owner:'Наёмники',control:42},bar:{owner:'Долг',control:78},yantar:{owner:'Учёные',control:88},dump:{owner:'Бандиты',control:61},agro:{owner:'Военные',control:72},dark:{owner:'Бандиты',control:63},cordon:{owner:'Одиночки',control:55},swamps:{owner:'Чистое небо',control:58},darkhollow:{owner:'Ренегаты',control:46}});
const NPC_HOME = { sid:'cordon', wolf:'cordon', fanatic:'cordon', scout:'cordon', bandit:'dump', barman:'cordon', seriy:'cordon', scientist:'yantar', merc:'limansk', prof:'yantar', freedom:'army', guide:'cordon', loner:'zaton', lebedev:'swamps', novikov:'swamps', cold:'swamps', renegade_leader:'swamps', renegade_scout:'swamps', lukash:'army', voronin:'bar', sultan:'dump', beard:'zaton', charon:'pripyat', wolfhound:'limansk', monolith_scout:'radar', archivist:'yantar', kravtsov:'agro' };
const TRADE_ITEM_IDS = new Set(['med','bread','bolt','scrap','bandage','anti_rad','artifact','canned','sausage','condensed','water','tea','ration','artifact_medusa','artifact_flower','artifact_dummy','artifact_meat','artifact_flash','artifact_nightstar','artifact_soul','artifact_goldfish','armor_leather','armor_stalker','armor_zarya','armor_seva','armor_bulat','armor_exo','mutant_trophy']);
const SHOP = {anti_rad:{name:'Антирад',type:'Медицина',desc:'Снижает радиацию и временно защищает от заражения.',weight:.1,price:180,qty:1,value:100},med:{name:'Аптечка',type:'Медицина',desc:'Восстанавливает здоровье.',weight:.4,price:180,qty:1,value:100},bread:{name:'Хлеб',type:'Еда',desc:'Восстанавливает выносливость.',weight:.3,price:45,qty:1,value:35},bandage:{name:'Бинт',type:'Медицина',desc:'Полевой расходный предмет.',weight:.2,price:70,qty:1,value:45},scrap:{name:'Металлолом',type:'Материал',desc:'Материал для ремесла.',weight:.8,price:55,qty:1,value:30},bolt:{name:'Болты ×5',type:'Инструмент',desc:'Набор болтов.',weight:.1,price:40,qty:5,value:5},canned:{name:'Консервы',type:'Еда',desc:'Сытный полевой паёк.',weight:.45,price:95,qty:1,value:65},sausage:{name:'Колбаса',type:'Еда',desc:'Калорийная еда в дорогу.',weight:.25,price:75,qty:1,value:50},condensed:{name:'Сгущённое молоко',type:'Еда',desc:'Сладкий запас энергии.',weight:.38,price:85,qty:1,value:55},water:{name:'Бутылка воды',type:'Еда',desc:'Чистая питьевая вода.',weight:.5,price:40,qty:1,value:25},tea:{name:'Термос чая',type:'Еда',desc:'Тёплый напиток для привала.',weight:.35,price:55,qty:1,value:35},ration:{name:'Сухой паёк',type:'Еда',desc:'Компактный набор продуктов.',weight:.55,price:130,qty:1,value:90},mutant_trophy:{name:'Трофей мутанта',type:'Материал',desc:'Добыча после охоты на мутанта.',weight:.8,price:220,qty:1,value:110},
artifact_medusa:{name:'Медуза',type:'Артефакт',desc:'Стабильный артефакт. Востребован у перекупщиков.',weight:.6,price:760,qty:1,value:420},artifact_flower:{name:'Каменный цветок',type:'Артефакт',desc:'Редкая находка с высокой исследовательской ценностью.',weight:.8,price:1850,qty:1,value:1100},artifact_dummy:{name:'Пустышка',type:'Артефакт',desc:'Небольшой артефакт с нестабильными свойствами.',weight:.5,price:1120,qty:1,value:650},artifact_meat:{name:'Ломоть мяса',type:'Артефакт',desc:'Органический объект неизвестного происхождения.',weight:.7,price:940,qty:1,value:540},artifact_flash:{name:'Вспышка',type:'Артефакт',desc:'Энергетически активный артефакт.',weight:.4,price:2450,qty:1,value:1450},artifact_nightstar:{name:'Ночная звезда',type:'Артефакт',desc:'Редкий объект, который высоко ценят коллекционеры.',weight:1.1,price:3200,qty:1,value:1900},artifact_soul:{name:'Душа',type:'Артефакт',desc:'Редкий органический артефакт.',weight:.9,price:4100,qty:1,value:2500},artifact_goldfish:{name:'Золотая рыбка',type:'Артефакт',desc:'Ценный артефакт с необычной структурой.',weight:1.4,price:5200,qty:1,value:3200},
armor_leather:{name:'Кожаная куртка с пластинами',type:'Броня',desc:'Лёгкая защита для первых вылазок.',weight:.7,price:520,qty:1,value:280,defense:2},armor_stalker:{name:'Комбинезон сталкера М-2',type:'Броня',desc:'Практичный полевой костюм.',weight:1.1,price:1850,qty:1,value:1050,defense:3},armor_zarya:{name:'Заря',type:'Броня',desc:'Усиленный комбинезон с хорошей защитой.',weight:1.5,price:3850,qty:1,value:2200,defense:5},armor_seva:{name:'СЕВА',type:'Броня',desc:'Герметичный научно-полевой костюм.',weight:2.2,price:9200,qty:1,value:5600,defense:7},armor_bulat:{name:'Булат',type:'Броня',desc:'Тяжёлый бронекостюм для опасных маршрутов.',weight:3.4,price:14800,qty:1,value:9000,defense:9},armor_exo:{name:'Экзоскелет',type:'Броня',desc:'Тяжёлая силовая система защиты.',weight:5.2,price:24500,qty:1,value:15000,defense:11}};
const SELL_VALUES = {anti_rad:100,med:100,bread:35,bolt:5,scrap:30,bandage:45,artifact:420,canned:65,sausage:50,condensed:55,water:25,tea:35,ration:90,mutant_trophy:110,artifact_medusa:420,artifact_flower:1100,artifact_dummy:650,artifact_meat:540,artifact_flash:1450,artifact_nightstar:1900,artifact_soul:2500,artifact_goldfish:3200,armor_leather:280,armor_stalker:1050,armor_zarya:2200,armor_seva:5600,armor_bulat:9000,armor_exo:15000};
const COOP_TEMPLATES = [{id:'survey_cordon',title:'Общая разведка Кордона',description:'Два сталкера должны прибыть на Кордон и подтвердить наблюдения.',location:'cordon',reward:240,xp:25,required:2},{id:'survey_yantar',title:'Исследовательская группа Янтаря',description:'Соберите группу из двух сталкеров на Янтаре.',location:'yantar',reward:420,xp:45,required:2}];
const ZONE_EVENTS=[
 {title:'Выброс на подходе',body:'По каналам КПК поступило предупреждение о нестабильной активности. Сталкеры ищут укрытия.'},
 {title:'Торговый караван',body:'Между безопасными секторами замечен караван. Торговцы ожидают новые поставки.'},
 {title:'Необычный сигнал',body:'Несколько детекторов зафиксировали странный сигнал. Источник пока не установлен.'},
 {title:'Ночная активность',body:'Проводники сообщают о движении в отдалённых районах. Некоторые маршруты временно обходят.'},
 {title:'Сводка группировок',body:'На нескольких территориях замечены новые патрули. Баланс сил может измениться.'}
];

module.exports = { LOCATIONS, FACTIONS, FACTION_RELATION_PAIRS, createFactionDiplomacy, TERRITORY_START, NPC_HOME, TRADE_ITEM_IDS, SHOP, SELL_VALUES, COOP_TEMPLATES, ZONE_EVENTS };
