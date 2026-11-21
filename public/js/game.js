// ZONE ONLINE 4.33.23 browser client. IMMERSIVE TITLE SCREEN / SURVIVAL / MULTIPLAYER.
const clone=o=>JSON.parse(JSON.stringify(o));
const base={
 name:"Новичок",money:1450,hp:100,radiation:0,radiationProtectionUntil:0,stamina:85,hunger:18,thirst:20,rep:10,day:1,hour:9,loc:"cordon",faction:"Одиночки",xp:0,meetings:0,completed:0,flags:{metSid:false,metWolf:false,heardBar:false,foundArtifact:false,helpedWolf:false},
 items:[{id:"med",name:"Аптечка",type:"Медицина",desc:"Восстанавливает 35 здоровья.",weight:.4,qty:2,value:100},{id:"bread",name:"Хлеб",type:"Еда",desc:"Восстанавливает 20 выносливости.",weight:.3,qty:2,value:35},{id:"bolt",name:"Болт",type:"Инструмент",desc:"Обычный металлический болт.",weight:.1,qty:8,value:5},{id:"scrap",name:"Металлолом",type:"Материал",desc:"Материал для простого ремесла.",weight:.8,qty:2,value:30},{id:"bandage",name:"Бинт",type:"Медицина",desc:"Небольшая помощь в пути.",weight:.2,qty:2,value:45},{id:"anti_rad",name:"Антирад",type:"Медицина",desc:"Снижает накопленную радиацию и временно защищает от нового заражения.",weight:.1,qty:1,value:180}],
 equipment:{suit:"Кожаная куртка",tool:"Простой детектор",weapon:"Старый ПМ"},
 locations:[
 {id:"chaes",name:"ЧАЭС",icon:"☢",owner:"Монолит",control:91,risk:"Критический",desc:"Северный промышленный комплекс и главный источник тайн Зоны.",people:["charon","archivist"],travel:8,loot:120},
 {id:"zaton",name:"Затон",icon:"▧",owner:"Одиночки",control:52,risk:"Средний",desc:"Заболоченная низина, старые баржи и промышленные руины.",people:["beard","sultan","cardan"],travel:3,loot:65},
 {id:"pripyat",name:"Припять",icon:"🏙️",owner:"Монолит",control:91,risk:"Критический",desc:"Город-призрак глубоко в Зоне.",people:["loner"],travel:6,loot:110},
 {id:"jupiter",name:"Юпитер",icon:"▦",owner:"Свобода",control:58,risk:"Высокий",desc:"Промышленный район вокруг завода «Юпитер» и станции Янов.",people:["azot"],travel:4,loot:80},
 {id:"limansk",name:"Лиманск",icon:"🏚",owner:"Наёмники",control:39,risk:"Очень высокий",desc:"Заброшенный город с узкими улицами и опасными проходами.",people:["wolfhound"],travel:6,loot:95},
 {id:"red",name:"Рыжий лес",icon:"🌲",owner:"Свобода",control:48,risk:"Очень высокий",desc:"Лесные тропы, странные сигналы и опасные находки.",people:["guide"],travel:5,loot:90},
 {id:"radar",name:"Радар",icon:"📡",owner:"Монолит",control:84,risk:"Критический",desc:"Зона сильного пси-излучения вокруг антенного комплекса.",people:["monolith_scout"],travel:7,loot:105},
 {id:"army",name:"Военные склады",icon:"📦",owner:"Свобода",control:67,risk:"Средний",desc:"Северные склады и старые укрепления.",people:["freedom"],travel:4,loot:55},
 {id:"wild",name:"Дикие территории",icon:"☣",owner:"Наёмники",control:42,risk:"Высокий",desc:"Разрушенная городская промзона, где часто пересекаются отряды.",people:["merc"],travel:5,loot:85},
 {id:"bar",name:"Бар",icon:"🍺",owner:"Долг",control:78,risk:"Низкий",desc:"Нейтральная точка отдыха, торговли, слухов и встреч сталкеров.",people:["barman","seriy","voronin"],travel:2,loot:15},
 {id:"yantar",name:"Янтарь",icon:"🧪",owner:"Учёные",control:88,risk:"Высокий",desc:"Научный сектор, полевые исследования и аномальные явления.",people:["prof"],travel:4,loot:70},
 {id:"dump",name:"Свалка",icon:"⚙️",owner:"Бандиты",control:61,risk:"Средний",desc:"Горы металлолома, старые машины и спорные маршруты.",people:["scout","bandit"],travel:2,loot:45},
 {id:"agro",name:"Агропром",icon:"🏭",owner:"Военные",control:72,risk:"Средний",desc:"Заброшенные корпуса и запутанные переходы.",people:["scientist"],travel:3,loot:50},
 {id:"dark",name:"Тёмная Долина",icon:"🌘",owner:"Бандиты",control:63,risk:"Высокий",desc:"Старая промышленная зона с дурной славой.",people:["merc"],travel:3,loot:60},
 {id:"cordon",name:"Кордон",icon:"🌾",owner:"Одиночки",control:55,risk:"Низкий",desc:"Южные ворота Зоны. Новички, торговцы и знакомые костры.",people:["sid","wolf","fanatic"],travel:0,loot:25},
 {id:"swamps",name:"Болота",icon:"⌁",owner:"Чистое небо",control:58,risk:"Высокий",desc:"Топкие тропы, скрытые стоянки и следы ранних экспедиций.",people:["lebedev","novikov","cold"],travel:4,loot:75},
 {id:"darkhollow",name:"Тёмная Лощина",icon:"🌑",owner:"Ренегаты",control:46,risk:"Очень высокий",desc:"Глухая низина с заброшенными объектами и обходными тропами.",people:[],travel:5,loot:88}
 ],
 factions:[
 {name:"Одиночки",icon:"◉",members:420,influence:48,territories:1,relation:15,style:"Нейтральная сеть сталкеров"},
 {name:"Долг",icon:"✚",members:248,influence:76,territories:1,relation:0,style:"Порядок и сдерживание Зоны"},
 {name:"Свобода",icon:"☼",members:310,influence:68,territories:1,relation:0,style:"Свобода исследования"},
 {name:"Бандиты",icon:"◆",members:190,influence:55,territories:2,relation:-25,style:"Силовое влияние и нажива"},
 {name:"Военные",icon:"▣",members:360,influence:80,territories:1,relation:-20,style:"Периметр и контроль"},
 {name:"Учёные",icon:"⚗",members:85,influence:39,territories:1,relation:10,style:"Исследования и наблюдения"},
 {name:"Наёмники",icon:"✕",members:120,influence:35,territories:0,relation:-5,style:"Контракты и нейтралитет"},
 {name:"Монолит",icon:"◈",members:280,influence:73,territories:1,relation:-35,style:"Закрытая фанатичная группировка"},
 {name:"Чистое небо",icon:"⌁",members:95,influence:28,territories:0,relation:8,style:"Изучение природы Зоны"},
 {name:"Ренегаты",icon:"☠",members:74,influence:22,territories:0,relation:-18,style:"Болотные мародёры и бывшие сталкеры, живущие вне правил группировок"}
 ],
 npcs:[
 {id:"sid",name:"Сидорович",role:"Торговец",loc:"cordon",icon:"🧔",desc:"Хозяин бункера на Кордоне.",greeting:"Ну, заходи, сталкер. Деньги есть — поговорим. Нет денег — тоже поговорим, но короче.",topics:[["Кто ты?","Кто я? Человек, который умеет превращать найденный хлам в хорошие деньги. И наоборот."],["Что нового?","На Свалке опять спорят за территорию. А у меня поставка задерживается. В Зоне всё по расписанию: если что-то должно пойти не так — оно пойдёт."],["Есть работа?","Мне нужен небольшой набор металлолома. Принеси три единицы — заплачу и добавлю немного репутации."],["Торговля","Можешь открыть раздел торговли. Ассортимент у меня не музейный, но полезное найдётся."]]},
 {id:"wolf",name:"Волк",role:"Опытный сталкер",loc:"cordon",icon:"🐺",desc:"Помогает новичкам освоиться на Кордоне.",greeting:"Новенький? Не суетись. Сначала узнавай местность, потом принимай решения.",topics:[["Расскажи о Кордоне","Здесь всё держится на взаимовыручке. Не лезь в чужие дела без причины и слушай, что говорят у костра."],["Нужна помощь?","У одного из наших потерялся запас провизии. Принеси две буханки хлеба — я отблагодарю."],["Как дела?","Пока спокойно. Но сталкеры говорят, что на Свалке стало тесно."]]},
 {id:"fanatic",name:"Фанат",role:"Сталкер",loc:"cordon",icon:"🎒",desc:"Молодой сталкер у костра.",greeting:"О, привет! Слышал, на Свалке можно найти интересные вещи. Только одному туда идти не хочется.",topics:[["Что ищешь?","Да всякую мелочь. Болты, детали, старые инструменты. Иногда попадаются настоящие находки."],["Слухи","Говорят, учёные на Янтаре ищут добровольцев для наблюдений." ]]},
 {id:"scout",name:"Разведчик",role:"Одиночка",loc:"dump",icon:"🧭",desc:"Собирает сведения о маршрутах Свалки.",greeting:"Тише. Я тут маршруты отмечаю. Если ищешь дорогу — спрашивай.",topics:[["Что на Свалке?","Много старого железа и ещё больше желающих его присвоить. В последнее время чаще встречаются незнакомые группы."],["Покажи маршрут","Я могу подсказать безопасный путь, но сначала докажи, что умеешь держать слово."]]},
 {id:"bandit",name:"Клык",role:"Представитель бандитов",loc:"dump",icon:"🧢",desc:"Смотрит за порядком на своей территории.",greeting:"Эй, сталкер. Чего надо? Тут не проходной двор.",topics:[["Договориться","Не люблю пустые разговоры. Если уважаешь местные правила, проблем не будет."],["Что происходит?","Все хотят контролировать Свалку. Даже те, кто делает вид, что им всё равно."]]},
 {id:"barman",name:"Бармен",role:"Информатор",loc:"bar",icon:"🍺",desc:"Знает новости и слухи со всей Зоны.",greeting:"Присаживайся. Сначала выдохни, потом расскажешь, что видел. А я поделюсь тем, что слышал.",topics:[["Последние новости","На Свалке растёт напряжённость. Учёные с Янтаря запрашивают образцы, а на Кордоне ждут торговый караван. Ничего необычного — и всё же будь внимателен."],["Расскажи о группировках","Долг укрепляет Росток, Свобода держится севернее. Одиночки стараются не ввязываться в большие споры. Но долго так не продлится."],["Есть задание?","Мне нужен человек, который соберёт три слуха в разных местах. Поговори с Волком, Разведчиком и профессором на Янтаре."],["Слухи","Слухи — валюта не хуже рублей. Только проверяй, кто их приносит."]]},
 {id:"seriy",name:"Серый",role:"Сталкер",loc:"bar",icon:"🧥",desc:"Постоянный посетитель бара.",greeting:"Слышал новости? Тут каждый второй что-то знает, а каждый первый преувеличивает.",topics:[["Что слышно?","На Рыжем лесу видели странное свечение. Похоже, кто-то обнаружил новый участок аномальной активности."],["Поговорить","Садись. Расскажу пару историй, если угостишь чаем."]]},
 {id:"scientist",name:"Лаборант Круглов",role:"Исследователь",loc:"agro",icon:"🧑‍🔬",desc:"Проводит полевые наблюдения.",greeting:"Осторожнее с образцами. Нам нужны наблюдения, а не геройство.",topics:[["Чем занимаешься?","Собираем сведения об изменениях среды. Зона не статична: показатели меняются даже без заметных событий."],["Нужна помощь?","Нам требуются две единицы металлолома для крепления переносного оборудования. За помощь начислим оплату."],["О Янтаре","Профессор на Янтаре координирует исследования. Он может предложить интересную работу."]]},
 {id:"merc",name:"Наёмник",role:"Контрактник",loc:"dark",icon:"🕶️",desc:"Незнакомец, который предпочитает говорить коротко.",greeting:"Если разговор по делу — слушаю. Если нет, не задерживай.",topics:[["Кто заказчик?","Заказчики бывают разные. Имена здесь редко что-то значат."],["Есть контракт?","Пока нет подходящего предложения. Загляни позже."]]},
 {id:"prof",name:"Профессор Сахаров",role:"Учёный",loc:"yantar",icon:"🧑‍🏫",desc:"Руководит исследованиями на Янтаре.",greeting:"Рад встрече. Надеюсь, путь сюда был спокойным. У нас есть несколько исследовательских задач.",topics:[["Что изучаете?","Мы анализируем аномальные зоны, артефакты и изменения окружающей среды."],["Можно помочь?","Соберите сведения у трёх сталкеров: Волка, Разведчика и Бармена. Это поможет сопоставить наблюдения."],["Артефакты","Каждая находка требует аккуратной фиксации. Не стоит считать неизвестный предмет безделушкой."]]},
 {id:"freedom",name:"Свободовец Лис",role:"Свобода",loc:"army",icon:"🟢",desc:"Представитель Свободы на складах.",greeting:"Привет! Не каждый день встречаешь нового человека в этих местах.",topics:[["Позиция Свободы","Мы считаем, что Зону нужно изучать, а не просто пытаться закрыть от всех."],["Новости","На севере неспокойно. Но пока удаётся сохранять связь между постами."]]},
 {id:"guide",name:"Проводник",role:"Проводник",loc:"red",icon:"🧭",desc:"Знает тропы Рыжего леса.",greeting:"Дороги здесь меняются. Хорошо, что ты нашёл меня.",topics:[["Можно пройти дальше?","Можно. Но сначала подготовься и проверь припасы. Путь не любит спешки."],["Странное свечение","Я тоже его видел. Учёным стоит об этом сообщить."]]},
 {id:"loner",name:"Молчаливый сталкер",role:"Неизвестный",loc:"pripyat",icon:"👤",desc:"Редко вступает в разговор.",greeting:"Ты далеко зашёл. Здесь слова быстро теряют смысл.",topics:[["Что здесь произошло?","У каждого здания своя история. Но не каждую историю стоит искать."],["Ты один?","Сейчас — да."]]},
 {id:"cardan",name:"Кардан",role:"техник",loc:"zaton",icon:"🔧",desc:"Опытный механик со Скадовска. Ремонтирует оружие и броню, ценит качественные детали.",greeting:"Ну, показывай железо. Если не совсем развалилось — верну в строй. За хорошую работу, правда, придётся заплатить.",topics:[["Что умеешь ремонтировать?","Оружие, броню и детекторы. Сначала осмотрю состояние, потом назову цену."],["Как работаешь?","Чем сильнее износ, тем дороже ремонт. Не тяни до последнего — сломанное оружие в Зоне никому не поможет."]] },
 {id:"azot",name:"Азот",role:"техник",loc:"jupiter",icon:"⚙",desc:"Техник станции Янов. Специализируется на ремонте снаряжения и обслуживании экипировки.",greeting:"Привет. Если принёс что-то на ремонт — выкладывай. Только без разговоров о скидках до осмотра.",topics:[["Какие услуги доступны?","Починка оружия, брони и детекторов. Цена зависит от состояния предмета."],["Есть ли скидка?","Постоянным клиентам могу сделать небольшую скидку. Репутация имеет значение."]] }
 ],
 quests:[
 {id:"intro",title:"Первое знакомство",giver:"Волк",desc:"Поговори с Волком на Кордоне и узнай, как устроена жизнь новичков.",reward:180,xp:25,rep:3,goal:"talk_wolf",done:false},
 {id:"scrap",title:"Запрос Сидоровича",giver:"Сидорович",desc:"Собери 3 единицы металлолома и вернись к торговцу.",reward:320,xp:40,rep:5,goal:"scrap3",done:false},
 {id:"bread",title:"Запас для группы",giver:"Волк",desc:"Принеси две единицы хлеба для сталкеров у костра.",reward:220,xp:30,rep:4,goal:"bread2",done:false},
 {id:"rumors",title:"Слухи Зоны",giver:"Бармен",desc:"Поговори с Волком, Разведчиком и профессором Сахаровым.",reward:500,xp:65,rep:8,goal:"rumors3",done:false},
 {id:"research",title:"Полевые наблюдения",giver:"Профессор Сахаров",desc:"Найди артефакт и передай исследовательскую сводку.",reward:650,xp:90,rep:10,goal:"artifact",done:false}
 ],
 news:[{day:1,hour:"09:00",title:"КПК активирован",body:"Новый сталкер зарегистрирован на Кордоне. Канал связи работает в локальном режиме."},{day:1,hour:"09:15",title:"Слухи у костра",body:"Сталкеры говорят о повышенной активности на Свалке."}],
 log:["КПК активирован. Добро пожаловать в Зону.","Получено стартовое снаряжение."],
 world:{weather:"Пасмурно",emission: "Низкая активность",mutants:"Следы замечены",tension:42}
};
const hadLocalSave=!!localStorage.getItem("zoneExpandedSave");
let g;try{g=JSON.parse(localStorage.getItem("zoneExpandedSave"))||clone(base)}catch(e){g=clone(base)}
if(g.characterCreated===undefined)g.characterCreated=hadLocalSave;
let chosenLoc=null,activeNpc=null,questFilter="all";
const $=id=>document.getElementById(id);
// Convert legacy locally-saved random NPCs as well as server NPCs to Zone callsigns.
const STORY_NPC_IDS=new Set(['sid','wolf','fanatic','scout','bandit','barman','seriy','scientist','merc','prof','freedom','guide','loner','lebedev','novikov','cold','renegade_leader','renegade_scout','lukash','voronin','sultan','beard','charon','wolfhound','archivist','kravtsov','monolith_scout']);
const CALLSIGN_FIRST=['Васян','Лёша','Максим','Влад','Колька','Андрюха','Сева','Пётр','Жора','Андрей','Димон','Ромка','Саня','Федя','Гриша','Вован','Тоха','Илюха','Мишаня','Егор','Борис','Тимур','Кир','Паша','Витёк','Глеб','Антон','Ярик','Стас','Даня','Аркадий','Захар','Игнат','Клим','Фома','Гена','Лёня','Трофим','Матвей','Славик','Марат','Руслан','Виталик','Юрец','Костян','Женёк','Михалыч','Дэн','Рыж','Батя'];
const CALLSIGN_LAST=['Глюк','Дворецкий','Скелет','Князь','Глобус','Француз','Грубиян','Авторитет','Стрелец','Железный','Шутник','Бес','Клык','Грач','Филин','Болт','Шуруп','Кабан','Беркут','Сыч','Глухарь','Рысь','Ворон','Барс','Прапор','Дизель','Факел','Сухарь','Патрон','Гильза','Затвор','Приклад','Калибр','Механик','Бродяга','Фартовый','Лютый','Шальной','Бывалый','Кремень','Медведь','Вепрь','Ястреб','Сокол','Барсук','Шершень','Комар','Камень','Бетон','Кирпич','Пепел','Дым','Уголь','Мотор','Порох','Гвоздь','Лом','Домкрат','Картечь','Шторм','Гром','Вихрь','Север','Южак','Батон','Кекс','Бублик','Шпрот','Пончик','Самовар','Квас','Чебур','Фарт','Казак','Кочевник','Гусар','Атаман','Барин','Профессор','Маэстро','Банкир','Шкипер','Капитан','Командор','Рубака','Снайпер','Лоцман','Каскадёр','Писарь','Художник','Поэт','Философ','Бухгалтер','Адвокат','Артист','Трактирщик','Скрипач','Кузнец','Шахтёр','Сапёр','Пилот','Беглец','Везунчик','Крестный','Шериф','Кондор','Тайфун','Бархан','Гранит','Титан','Рубеж','Дозор','Капкан','Мародёр','Зверь','Пёс','Волк','Зубр','Пузырь','Хмель','Трактор','Слесарь','Маяк','Громила','Голландец','Цыган','Монах','Купец','Боцман','Граф','Маркиз','Княжич','Сенатор','Губернатор','Генерал','Полковник','Ефрейтор','Рядовой','Комиссар','Каратель','Палач','Смотрящий','Хозяин','Старшина','Колдун','Знахарь','Кулибин','Самородок','Балагур','Весельчак','Молчун','Заноза','Хитрец','Проныра','Хапуга','Кочегар','Громовержец'];
function migrateLocalNpcCallsigns(){
 const used=new Set((g.npcs||[]).filter(n=>STORY_NPC_IDS.has(n.id)).map(n=>String(n.name||'').trim()));
 for(const npc of (g.npcs||[])){
  if(!npc||STORY_NPC_IDS.has(npc.id))continue;
  const id=String(npc.id||'unknown-npc');const featured=({'wander_cordon_0':'Влад Князь','wander_cordon_1':'Колька Глобус','wander_cordon_2':'Андрюха Француз','wander_cordon_3':'Сева Грубиян','wander_cordon_4':'Пётр Авторитет','wander_cordon_5':'Жора Стрелец','wander_cordon_6':'Влад Железный','wander_cordon_7':'Андрей Шутник'}[id]);if(featured&&!used.has(featured)){npc.name=featured;used.add(featured);npc.generated=true;continue;}let h=2166136261;
  for(let i=0;i<id.length;i++){h^=id.charCodeAt(i);h=Math.imul(h,16777619);}
  h>>>=0;let name='';
  for(let step=0;step<CALLSIGN_FIRST.length*CALLSIGN_LAST.length;step++){
   const ix=(h+step)%(CALLSIGN_FIRST.length*CALLSIGN_LAST.length);
   const candidate=CALLSIGN_FIRST[Math.floor(ix/CALLSIGN_LAST.length)]+' '+CALLSIGN_LAST[ix%CALLSIGN_LAST.length];
   if(!used.has(candidate)){name=candidate;break;}
  }
  if(name){npc.name=name;used.add(name);npc.generated=true;}
 }
}
// Save migration: extend existing saves without resetting player progress.
function migrateWorld(){
 g.locations ||= clone(base.locations); g.npcs ||= clone(base.npcs); g.factions ||= clone(base.factions); g.items ||= []; g.quests ||= clone(base.quests);
 const locationAliases={yanov:"radar",kopachi:"wild",volkhov:"darkhollow",iron:"limansk"};
 const canonicalIds=new Set(base.locations.map(l=>l.id));
 const migrateLoc=id=>locationAliases[id]|| (canonicalIds.has(id)?id:"cordon");
 g.loc=migrateLoc(g.loc||"cordon");
 for(const n of g.npcs){n.loc=migrateLoc(n.loc||n.location||"cordon");if(n.location)n.location=migrateLoc(n.location);}
 for(const [oldId,newId] of Object.entries(locationAliases)){if(g.keyPoints?.[oldId]&&!g.keyPoints[newId])g.keyPoints[newId]=g.keyPoints[oldId];}
 if(g.keyPoints){for(const [oldId,newId] of Object.entries(locationAliases)){delete g.keyPoints[oldId];}}
 g.visitedLocations=(g.visitedLocations||[]).map(migrateLoc);g.visitedLocations=[...new Set(g.visitedLocations)];
 g.locations=base.locations.map(def=>{const oldLoc=(g.locations||[]).find(x=>migrateLoc(x.id)===def.id);return oldLoc?{...clone(def),owner:oldLoc.owner||def.owner,control:oldLoc.control??def.control}:clone(def)});
 for(const f of g.factions){const b=base.factions.find(x=>x.name===f.name);if(b&& !f.icon)f.icon=b.icon;}
 g.achievements ||= {}; g.diplomacy ||= {};
 const canonicalDiplomacy={
  'Одиночки':{'Долг':10,'Свобода':10,'Бандиты':-45,'Военные':-35,'Учёные':30,'Наёмники':-15,'Монолит':-60,'Чистое небо':25,'Ренегаты':-50},
  'Долг':{'Свобода':-60,'Бандиты':-55,'Военные':-40,'Учёные':30,'Наёмники':-45,'Монолит':-60,'Чистое небо':15,'Ренегаты':-50},
  'Свобода':{'Бандиты':-45,'Военные':-50,'Учёные':25,'Наёмники':-45,'Монолит':-60,'Чистое небо':25,'Ренегаты':-55},
  'Бандиты':{'Военные':-45,'Учёные':-20,'Наёмники':0,'Монолит':-60,'Чистое небо':-45,'Ренегаты':15},
  'Военные':{'Учёные':45,'Наёмники':-40,'Монолит':-60,'Чистое небо':0,'Ренегаты':-45},
  'Учёные':{'Наёмники':0,'Монолит':-60,'Чистое небо':35,'Ренегаты':-50},
  'Наёмники':{'Монолит':-60,'Чистое небо':0,'Ренегаты':-15},
  'Монолит':{'Чистое небо':-60,'Ренегаты':-60},'Чистое небо':{'Ренегаты':-55}
 };
 if(Number(g.diplomacyVersion||0)<2){g.diplomacy={};for(const a of Object.keys(canonicalDiplomacy)){g.diplomacy[a]={};for(const [b,v] of Object.entries(canonicalDiplomacy[a])){g.diplomacy[a][b]=v;(g.diplomacy[b]||={})[a]=v;}}g.diplomacyVersion=2;}
 for(const f of g.factions){g.diplomacy[f.name]||={};for(const other of g.factions){if(f.name!==other.name&&(f.name==='Монолит'||other.name==='Монолит'))g.diplomacy[f.name][other.name]=-60;else if(f.name!==other.name&&!Number.isFinite(Number(g.diplomacy[f.name][other.name])))g.diplomacy[f.name][other.name]=0;}}
 const names=['Васян Глюк','Лёша Дворецкий','Максим Скелет','Влад Князь','Колька Глобус','Андрюха Француз','Сева Грубиян','Пётр Авторитет','Жора Стрелец','Влад Железный','Андрей Шутник'];
 const roles=["Одиночка","Разведчик","Торговец","Проводник","Охотник за артефактами","Научный помощник"];
 const icons=["◉","♟","⌖","▣","⚑","◈","✚","☼"];
 const factions=g.factions.map(x=>x.name);
 for(const l of g.locations){l.people ||= []; if(l.people.length<6){for(let j=0;j<Math.min(3,6-l.people.length);j++){let id="wander_"+l.id+"_"+j;if(!g.npcs.some(n=>n.id===id)){let name=names[(g.npcs.length+j*3)%names.length];let role=roles[(g.npcs.length+j)%roles.length];let n={id,name,role,loc:l.id,icon:icons[(g.npcs.length+j)%icons.length],desc:"Случайный сталкер. У него есть собственные слухи о районе.",greeting:"Здорово. В этих местах лучше держать ухо востро. Что хотел узнать?",topics:[["Что нового в округе?",`Говорят, в районе «${l.name}» меняется обстановка. Кто-то ищет работу, кто-то — надёжный маршрут.`],["Кто здесь главный?",`Здесь пересекаются интересы разных групп. Сейчас заметнее всего влияние: ${l.owner}.`],["Есть работа?","Пока только слухи. Загляни позже — возможно, появится поручение."]]};n.faction=factions[(g.npcs.length+j)%factions.length];n.mood="нейтральное";g.npcs.push(n);l.people.push(id);}}}}

 if(!g.items.some(x=>x.id==="pm"))g.items.push({id:"pm",name:"ПМм",type:"Оружие",desc:"Служебный пистолет. Состояние: 78%.",weight:.9,qty:1,value:850,icon:"▰",condition:78});
 if(!g.items.some(x=>x.id==="shotgun"))g.items.push({id:"shotgun",name:"Обрез",type:"Оружие",desc:"Старое двуствольное ружьё. Состояние: 62%.",weight:2.4,qty:1,value:1250,icon:"╾",condition:62});
 if(!g.items.some(x=>x.id==="suit"))g.items.push({id:"suit",name:"Комбинезон сталкера",type:"Броня",desc:"Полевой костюм с базовой защитой.",weight:4.2,qty:1,value:1700,icon:"▤",condition:84});
 if(!g.items.some(x=>x.id==="detector"))g.items.push({id:"detector",name:"Детектор Отклик",type:"Детектор",desc:"Помогает отмечать аномальные сигналы.",weight:1.1,qty:1,value:950,icon:"⌁",condition:91});
 g.equipment ||= {suit:"Кожаная куртка",tool:"Простой детектор",weapon:"Старый ПМ"}; for(const item of (g.items||[])){if((item.type==="Оружие"||item.type==="Броня"||item.type==="Детектор")&&item.condition==null)item.condition=100;}
 g.hunger=Number.isFinite(g.hunger)?Math.max(0,Math.min(100,g.hunger)):18;
 g.thirst=Number.isFinite(g.thirst)?Math.max(0,Math.min(100,g.thirst)):20;
 g.storyFlags ||= {};
 g.realTimeStartedAt = Number.isFinite(Number(g.realTimeStartedAt)) ? Number(g.realTimeStartedAt) : Date.now();
 g.lastVitalsAt = Number.isFinite(Number(g.lastVitalsAt)) ? Number(g.lastVitalsAt) : Date.now();
 const content=window.ZONE_CONTENT||{};
 for(const [faction,leader] of Object.entries(content.factionLeaders||{})){const f=g.factions.find(x=>x.name===faction);if(f)f.leader=clone(leader);}
 for(const n of (content.npcs||[])){if(!g.npcs.some(x=>x.id===n.id))g.npcs.push(clone(n));const l=g.locations.find(x=>x.id===n.loc);if(l&&!l.people.includes(n.id))l.people.push(n.id);}
 for(const q of (content.storyQuests||[])){if(!g.quests.some(x=>x.id===q.id))g.quests.push({...clone(q),accepted:false,done:false});}
 // Give every faction a permanent technician at its home base. Existing saves are migrated without resetting progress.
 const factionTechBases={
  'Одиночки':['cordon','Тихон','Полевой механик одиночек'],
  'Долг':['bar','Медведь','Техник ремонтной службы Долга'],
  'Свобода':['army','Лис','Механик свободовцев'],
  'Бандиты':['dump','Шило','Мастер бандитской стоянки'],
  'Военные':['agro','Сержант Ковалёв','Техник ремонтной роты'],
  'Учёные':['yantar','Кондратьев','Инженер научной экспедиции'],
  'Наёмники':['limansk','Грей','Контрактный оружейник'],
  'Монолит':['radar','Послушник','Механик группировки Монолит'],
  'Чистое небо':['swamps','Новиков','Техник базы Чистого неба'],
  'Ренегаты':['darkhollow','Гвоздь','Ремонтник болотной группировки']
 };
 for(const [faction,[loc,name,desc]] of Object.entries(factionTechBases)){
  const id='faction-tech-'+faction.toLowerCase().replace(/[^a-zа-яё0-9]+/gi,'-');
  if(!g.npcs.some(n=>n.id===id))g.npcs.push({id,name,role:'техник',faction,loc,icon:'🔧',desc,greeting:'Показывай снаряжение. Для своих сделаю по нормальной цене.',topics:[['Что ремонтируешь?','Оружие, броню и детекторы. Осмотр и ремонт прямо здесь.'],['Условия ремонта','Цена зависит от стоимости предмета и степени износа. Для бойцов нашей группировки действует скидка.']]});
  const baseLocation=g.locations.find(l=>l.id===loc);if(baseLocation){baseLocation.people||=[];if(!baseLocation.people.includes(id))baseLocation.people.push(id);}
 }
 // Run AFTER all legacy and content NPCs are loaded, otherwise old browser saves keep their real-name NPCs.
 migrateLocalNpcCallsigns();
 if(!g.foodKitGranted){addItem("canned","Консервы","Еда","Сытный полевой паёк.",.45,65,1);addItem("water","Бутылка воды","Еда","Чистая питьевая вода.",.5,25,2);g.foodKitGranted=true;}
}
migrateWorld();
g.careerStats ||= {kills:0,discoveries:0,travelled:0,conversations:0};
g.options ||= {largeText:false,reduceMotion:false,compactUI:false};
g.visitedLocations ||= [g.loc];
g.careerStats.kills=Number(g.careerStats.kills)||0;g.careerStats.discoveries=Number(g.careerStats.discoveries)||0;g.careerStats.travelled=Number(g.careerStats.travelled)||0;g.careerStats.conversations=Number(g.careerStats.conversations)||0;
try{localStorage.setItem("zoneExpandedSave",JSON.stringify(g));}catch(e){console.warn("Could not persist save migration",e);}


// Original ZONE ONLINE weapon catalogue and authored location POIs.
const weaponCatalogue=[
["pm","ПМм","Пистолеты","Пистолет","9×18 мм",0.9,850,78],["fort","Форт-12","Пистолеты","Пистолет","9×18 мм",0.95,1100,82],["udp","УДП «Компакт»","Пистолеты","Пистолет",".45 ACP",1.1,1450,76],["kora","Кора-919","Пистолеты","Пистолет","9×19 мм",0.95,1350,81],["martha","Мартышка","Пистолеты","Пистолет","9×18 мм",0.85,1250,74],
["spsa","СПСА-14","Дробовики","Дробовик","12 калибр",3.6,3100,72],["chaser","Chaser-13","Дробовики","Дробовик","12 калибр",3.1,2700,80],["protecta","Protecta","Дробовики","Дробовик","12 калибр",4.2,4200,68],["sawed","Обрез","Дробовики","Дробовик","12 калибр",2.4,1250,62],
["akm","АКМ-74/2","Автоматы","Автомат","5.45×39 мм",3.4,3600,80],["akm_gl","АКМ-74/2У","Автоматы","Автомат","5.45×39 мм",3.1,3300,77],["abakan","АС-96/2","Автоматы","Автомат","5.45×39 мм",3.6,5100,83],["obokan","Обокан","Автоматы","Автомат","5.45×39 мм",3.8,4800,79],["tr301","ТРс-301","Автоматы","Автомат","5.56×45 мм",3.2,5200,85],["il86","ИЛ86","Автоматы","Автомат","5.56×45 мм",3.7,4700,73],["gp37","ГП37","Автоматы","Автомат","5.56×45 мм",3.5,5900,88],["groza","Гроза","Автоматы","Автомат","9×39 мм",3.9,7200,80],
["vintar","Винтарь ВС","Винтовки","Винтовка","9×39 мм",3.4,8900,86],["svd","СВДм-2","Винтовки","Винтовка","7.62×54 мм",4.3,9800,84],["svu","СВУмк2","Винтовки","Винтовка","7.62×54 мм",3.8,9300,79],["gauss","Гаусс-пушка","Особое","Экспериментальное","энергетические элементы",5.2,18000,95],["bulldog","Бульдог-6","Особое","Гранатомёт","выстрелы ВОГ",5.0,12500,70],["rp74","РП-74","Особое","Пулемёт","7.62×54 мм",7.8,14500,76],["knife","Нож сталкера","Особое","Инструмент","—",0.35,180,90],
["walther","ПМм-Н","Пистолеты","Пистолет","9×18 мм",0.95,1650,82],["usp","УСП-45","Пистолеты","Пистолет",".45 ACP",1.0,2100,79],["saiga","Сайга-12К","Дробовики","Дробовик","12 калибр",3.8,4600,84],["toz","ТОЗ-34","Дробовики","Двуствольное ружьё","12 калибр",3.2,1900,66],["ak74","АК-74","Автоматы","Автомат","5.45×39 мм",3.3,3900,81],["aksu","АКС-74У","Автоматы","Автомат","5.45×39 мм",2.9,3500,75],["fn2000","ФН2000","Автоматы","Автомат","5.56×45 мм",4.0,9800,90],["famas","ФАМАС","Автоматы","Автомат","5.56×45 мм",3.6,7600,77],["vsk","ВСК-94","Винтовки","Винтовка","9×39 мм",3.2,8200,83],["mosin","Мосинка","Винтовки","Винтовка","7.62×54 мм",4.1,4300,70],["rpk","РПК-74","Особое","Ручной пулемёт","5.45×39 мм",4.7,8900,80],["svt","СВТ-40","Винтовки","Винтовка","7.62×54 мм",3.9,6100,73],["gauss_mk2","Гаусс-модуль","Особое","Экспериментальное","энергетические элементы",5.4,22000,97]
];
const poiSeed={
cordon:[["Бункер Сидоровича","Торговля","Торговец и базовые припасы"],["Деревня новичков","Стоянка","Костёр и слухи сталкеров"],["Мост через железную дорогу","Переход","Старый маршрут на север"],["Аномальное поле у дороги","Аномалия","Место для поиска артефактов"]],
dump:[["Кладбище техники","Тайник","Разобранные машины и детали"],["Свалка металлолома","Ресурсы","Материалы и случайные находки"],["Пост бандитов","Пост","Контролируемый проход"],["Северный проход","Переход","Маршрут к Ростку"]],
bar:[["Бар «100 рентген»","Безопасная зона","Отдых, новости и торговля"],["Стоянка Долга","Пост","Патруль и групповые поручения"],["Доска объявлений","Задания","Работа от сталкеров и торговцев"]],
agro:[["Подземный комплекс","Исследование","Заброшенные лабораторные помещения"],["Северный двор","Переход","Выход к промышленным секторам"],["Старый блокпост","Пост","Следы прежнего гарнизона"]],
dark:[["Промышленный двор","Ресурсы","Разрушенные цеха"],["Заброшенная ферма","Стоянка","Временное укрытие"],["Южная дорога","Переход","Маршрут к Кордону"]],
yantar:[["Научный бункер","Безопасная зона","Исследовательская база"],["Берег озера","Аномалия","Зона наблюдений"],["Старый карьер","Тайник","Место полевых находок"]],
army:[["Северный блокпост","Пост","Позиции Свободы"],["Складской ангар","Ресурсы","Промышленные запасы"],["Лесная тропа","Переход","Выход к Рыжему лесу"]],
red:[["Лесная развилка","Переход","Переплетение старых троп"],["Заброшенный лагерь","Стоянка","Следы прежней экспедиции"],["Аномальная поляна","Аномалия","Нестабильная зона"]],
pripyat:[["Площадь города","Ориентир","Центральная часть Припяти"],["Старая прачечная","Укрытие","Известная точка сбора"],["Культурный центр","Исследование","Заброшенное общественное здание"]],
zaton:[["Скадовск","Безопасная зона","Плавучая база сталкеров"],["Сгоревший хутор","Тайник","Заброшенные постройки"],["Затонувшая баржа","Ресурсы","Старое судно и находки"],["Лесничество","Стоянка","Укрытие на окраине"]],
jupiter:[["Завод Юпитер","Исследование","Промышленный комплекс"],["Цеха завода","Ресурсы","Старые производственные корпуса"],["Переход к Янову","Переход","Маршрут к железнодорожному узлу"]],
radar:[["Станция Янов","Безопасная зона","Главная точка встреч"],["Буфет","Торговля","Еда и разговоры"],["Пункт учёных","Исследование","Рабочая база исследователей"]],
wild:[["Заброшенная школа","Ориентир","Пустующее здание села"],["Сельская улица","Тайник","Старые дворы"],["Окраина Копачей","Аномалия","Место полевых наблюдений"]],
darkhollow:[["Площадка техники","Ресурсы","Старая техника"],["Командный пункт","Пост","Заброшенный пункт управления"],["Северный проход","Переход","Тропа к соседним секторам"]],
limansk:[["Железная роща","Аномалия","Нестабильный участок"],["Старый мост","Переход","Узкий маршрут"],["Разрушенный цех","Тайник","Промышленные руины"]]
};
const extraPoi48={
 cordon:[["Старая водокачка","Исследование","Заброшенный узел водоснабжения."],["Южный блокпост","Пост","Проверяй обстановку у периметра."],["Овраг у линии электропередачи","Тайник","Следы временной стоянки и старых припасов."]],
 dump:[["Разбитый карьер","Ресурсы","Куча строительного лома и следы техники."],["Тоннель под насыпью","Переход","Короткий, но плохо просматриваемый проход."],["Лагерь сборщиков","Стоянка","Место, где сталкеры сортируют найденный металл."]],
 bar:[["Старая диспетчерская","Исследование","Архивные записи о движении отрядов."],["Внешний КПП Ростка","Пост","Проверка пропусков и патрульные сводки."],["Мастерская у ангара","Ремонт","Местные техники принимают заказы."]],
 agro:[["Восточная проходная","Пост","Следы старого военного поста."],["Служебный тоннель","Переход","Подземный маршрут между корпусами."],["Радиорубка Агропрома","Исследование","Старое оборудование связи."]],
 dark:[["Заброшенная котельная","Укрытие","Толстые стены и старый технический подвал."],["Южный карьер","Ресурсы","Обломки техники и строительные материалы."],["Лагерь на трубе","Стоянка","Временная стоянка местных сталкеров."]],
 yantar:[["Северный научный пост","Пост","Пункт наблюдения за аномалиями."],["Старый элеватор","Тайник","Заброшенное хранилище у берега."],["Полевой медблок","Медицина","Остатки экспедиционного медпункта."]],
 army:[["Западная казарма","Укрытие","Пустующее здание бывшего гарнизона."],["Тренировочный полигон","Исследование","Следы старых учений."],["Склад ГСМ","Ресурсы","Промышленная площадка с опасными остатками."]],
 red:[["Лесная метеостанция","Исследование","Старые приборы наблюдения."],["Заваленная просека","Переход","Обходной маршрут сквозь лес."],["Охотничий привал","Стоянка","Следы костра и охотничьих засидок."]],
 pripyat:[["Школа № 1","Исследование","Заброшенные классы и архивные бумаги."],["Подземный переход","Переход","Укрытый путь между кварталами."],["Дворец культуры","Ориентир","Крупное здание в центральном районе."]],
 zaton:[["Станция техобслуживания","Ремонт","Старые инструменты и ремонтный бокс."],["Затопленный причал","Переход","Низкий береговой маршрут."],["Лесной кордон","Пост","Наблюдательная точка на окраине болот."]],
 jupiter:[["Заводская проходная № 2","Пост","Контроль входа на территорию завода."],["Испытательный корпус","Исследование","Закрытая часть промышленного комплекса."],["Технический тоннель","Переход","Сервисный маршрут под заводом."]],
 yanov:[["Старая диспетчерская","Исследование","Журналы железнодорожного узла."],["Водонапорная башня","Ориентир","Видимая точка на открытой местности."],["Восточная платформа","Переход","Выход к промышленным маршрутам."]],
 kopachi:[["Погреб на окраине","Тайник","Заваленное хозяйственное помещение."],["Старая амбулатория","Медицина","Следы эвакуации и медицинские шкафы."],["Заросший двор","Стоянка","Тихая точка для короткой передышки."]],
 volkhov:[["Радиолокационный пост","Исследование","Старые антенны и приборы."],["Технический гараж","Ремонт","Заброшенный ремонтный участок."],["Южный КПП","Пост","Пункт наблюдения за дорогой."]],
 iron:[["Северный ангар","Укрытие","Промышленное укрытие с несколькими входами."],["Кабельная галерея","Переход","Узкий маршрут через старые коммуникации."],["Лабораторный двор","Исследование","Следы полевого исследовательского лагеря."]],
 swamps:[["Старая лодочная станция","Переход","Путь между островками суши."],["Полевой госпиталь","Медицина","Заброшенный медицинский пункт экспедиции."],["Смотровой островок","Ориентир","Сухая площадка с обзором на топь."]]
};
function ensureZoneContent(){
 g.keyPoints ||= {};
 for(const l of g.locations){if(!g.keyPoints[l.id])g.keyPoints[l.id]=(poiSeed[l.id]||[["Старая стоянка","Стоянка","Место отдыха"],["Заброшенный объект","Исследование","Точка для изучения района"],["Полевой маршрут","Переход","Путь в соседний сектор"]]).map((p,i)=>({id:l.id+"_poi_"+i,name:p[0],kind:p[1],desc:p[2],discovered:false}));
 }
 const extras=window.ZONE_CONTENT?.extraPoints||{};
 for(const [loc,points] of Object.entries(extraPoi48)){g.keyPoints[loc] ||= [];for(let i=0;i<points.length;i++){const id=loc+"_real48_"+i;if(!g.keyPoints[loc].some(x=>x.id===id))g.keyPoints[loc].push({id,name:points[i][0],kind:points[i][1],desc:points[i][2],discovered:false});}}
 for(const [loc,points] of Object.entries(extras)){g.keyPoints[loc] ||= [];for(let i=0;i<points.length;i++){const id=loc+"_extra_"+i;if(!g.keyPoints[loc].some(x=>x.id===id))g.keyPoints[loc].push({id,name:points[i][0],kind:points[i][1],desc:points[i][2],discovered:false});}}

 g.discoveredWeapons ||= ["pm","sawed"];
 g.weaponConditions ||= {};
 for(const w of weaponCatalogue)if(g.weaponConditions[w[0]]==null)g.weaponConditions[w[0]]=w[7];
 // Add a complete, discoverable catalogue without forcing duplicate inventory stacks.
 for(const w of weaponCatalogue){if(!g.items.some(x=>x.id===w[0]))g.armoryOwned ||= [];}
 g.armoryOwned ||= [];
}
ensureZoneContent();
let invFilterState="all";
function renderKeyPoints(){
 const l=here(),pts=g.keyPoints?.[l.id]||[];
 $("keyPoints").innerHTML=pts.map(p=>`<div class="poi ${p.discovered?"discovered":""}"><b>${p.discovered?"✓":"⌖"} ${p.name}</b><span class="poi-marker">${p.kind}</span><small>${p.discovered?p.desc:"Не исследовано. Осмотри район, чтобы получить сведения."}</small>${p.discovered?"":`<div style="margin-top:7px"><button onclick="discoverPoint('${p.id}')">Исследовать</button></div>`}</div>`).join("");
}
function discoverPoint(id){
 const p=Object.values(g.keyPoints).flat().find(x=>x.id===id);if(!p||p.discovered)return;
 if(g.stamina<5)return alert("Недостаточно выносливости.");
 p.discovered=true;g.careerStats||={};g.careerStats.discoveries=(g.careerStats.discoveries||0)+1;g.stamina-=5;g.xp+=12;if(zoneSocket?.connected)zoneSocket.emit('world:poi:discover',{id:p.id,location:g.loc,name:p.name});
 log("Отмечена ключевая точка: "+p.name+".");news("Новая отметка на карте",p.name+" — "+p.desc);
 if(Math.random()<.38){let w=weaponCatalogue[Math.floor(Math.random()*weaponCatalogue.length)];if(!g.discoveredWeapons.includes(w[0])){g.discoveredWeapons.push(w[0]);addItem(w[0],w[1],"Оружие","Найденное оружие. Состояние: "+w[7]+"%.",w[5],w[6]);g.items.find(x=>x.id===w[0]).condition=w[7];g.items.find(x=>x.id===w[0]).icon=weaponGlyph(w[0]);log("Найдено снаряжение: "+w[1]+".");}}
 save();
}
function applySharedDiscoveredPoints(points){if(!points||typeof points!=='object')return;for(const [loc,ids] of Object.entries(points)){for(const p of (g.keyPoints?.[loc]||[])){if(Array.isArray(ids)&&ids.includes(p.id))p.discovered=true;}}renderKeyPoints();if($('world').classList.contains('active'))selectLocation(g.loc);}
const weaponGlyphs={walther:"▰",usp:"◧",saiga:"═",toz:"╾",ak74:"━",aksu:"┅",fn2000:"━",famas:"┉",vsk:"━━",mosin:"━━",rpk:"╍",svt:"━━",gauss_mk2:"⌁",pm:"▰",fort:"◧",udp:"▱",kora:"◩",martha:"▰",spsa:"╾",chaser:"╼",protecta:"═",sawed:"╾",akm:"━",akm_gl:"┅",abakan:"━",obokan:"┉",tr301:"━",il86:"┅",gp37:"━",groza:"╾",vintar:"━",svd:"━━",svu:"━━",gauss:"⌁",bulldog:"▣",rp74:"╍",knife:"†"};
function weaponGlyph(id){return weaponGlyphs[id]||null}
function renderArmory(){
 const q=($("armorySearch")?.value||"").toLowerCase(),cl=$("armoryClass")?.value||"all";
 const list=weaponCatalogue.filter(w=>(cl==="all"||w[2]===cl)&&(w[1].toLowerCase().includes(q)||w[3].toLowerCase().includes(q)));
 $("armoryList").innerHTML=list.map(w=>{const owned=g.items.find(x=>x.id===w[0]);const found=g.discoveredWeapons.includes(w[0]);return `<div class="weapon-card"><div class="weapon-art">${weaponGlyph(w[0])||"▰"}</div><div><b>${w[1]}</b><small>${w[3]} · ${w[4]} · ${w[5]} кг</small><small>${found?"Обнаружено":"Данные в каталоге"} · ${owned?"В рюкзаке ×"+owned.qty:"Не найдено"}</small></div><div><span class="tag">${w[6]} ₽</span>${owned?`<button onclick="equipItem('${w[0]}')">Экипировать</button>`:""}</div></div>`}).join("")||'<div class="mutedbox">Совпадений нет.</div>';
}

function realClock(){const now=new Date();if(!Number.isFinite(Number(g.realTimeStartedAt))||Number(g.realTimeStartedAt)<=0)g.realTimeStartedAt=Date.now();const elapsed=Math.max(0,Date.now()-Number(g.realTimeStartedAt));const day=1+Math.floor(elapsed/86400000);const hh=String(now.getHours()).padStart(2,"0"),mm=String(now.getMinutes()).padStart(2,"0");g.day=day;g.hour=now.getHours();return {day,time:`${hh}:${mm}`,stamp:`День ${day} · ${hh}:${mm}`};}
const encyclopediaEntries={
 mutants:[
  ["Плоть","Мутант","Относительно медлительное стадное животное. Часто держится возле открытых пространств."],["Псевдособака","Мутант","Хищник, охотящийся стаями. Следы чаще замечают на окраинах секторов."],["Кабан","Мутант","Крупное и опасное животное. Может защищать территорию и бросаться на нарушителя."],["Снорк","Мутант","Подвижный мутант, встречающийся в заброшенных комплексах и руинах."],["Контролёр","Мутант","Редкая опасная форма жизни. Сталкеры советуют не приближаться и не задерживаться на открытом месте."],["Зомбированный сталкер","Мутант","Бывший человек, утративший волю и способность к осмысленному общению. Держится в заброшенных местах и иногда собирается в небольшие группы."],["Кровосос","Мутант","Опасный хищник, предпочитающий укрытия и тёмные участки. Сведения о встречах часто противоречивы."],["Псевдогигант","Мутант","Крайне опасное крупное существо. Встречи с ним обычно заканчиваются отступлением."],["Тушкан","Мутант","Мелкий стайный мутант. Поодиночке не слишком опасен, но стая может застать врасплох."]
 ],
 armor:[["Кожаная куртка с пластинами","Броня","Лёгкий комплект с базовой защитой. Подходит для первых вылазок."],["Комбинезон сталкера М-2","Броня","Универсальная полевая защита для опытного одиночки."],["Заря","Броня","Усиленный комбинезон для опасных маршрутов."],["СЕВА","Броня","Герметичный научно-полевой костюм с повышенной защитой."],["Булат","Броня","Тяжёлый бронекостюм для сложных боевых выходов."],["Экзоскелет","Броня","Тяжёлая силовая система с максимальной защитой в каталоге."]],
 artifacts:[["Медуза","Артефакт","Часто встречающаяся находка. Исследователи отмечают необычные свойства материала."],["Каменный цветок","Артефакт","Редкая находка из аномальных полей. Требует осторожной транспортировки."],["Пустышка","Артефакт","Небольшой объект с нестабильными показателями. Ценность зависит от состояния."],["Ломоть мяса","Артефакт","Органический артефакт неизвестного происхождения. Интересен полевым учёным."],["Вспышка","Артефакт","Объект с выраженной энергетической активностью. Не держи рядом с повреждённым оборудованием."],["Ночная звезда","Артефакт","Редкий артефакт с высокой рыночной стоимостью."],["Душа","Артефакт","Органическая находка, которую изучают полевые исследователи."],["Золотая рыбка","Артефакт","Редкий объект с необычной структурой и высокой ценностью."],["Пружина","Артефакт","Небольшой артефакт, часто встречающийся в опасных полях."],["Грави","Артефакт","Артефакт с выраженными физическими аномалиями."]]
};

const anomalyDossiers=[
 ['Жарка','Термическая','Невидимое поле перегретого воздуха. Первые признаки — марево, запах озона и обугленные пятна на земле. Болты помогают проверить коридор, но не гарантируют безопасность.','Опасность: высокая · Артефакты: термические и энергетические'],
 ['Электра','Электрическая','Скопление разрядов, часто заметное по голубоватым вспышкам и потрескиванию. Особенно опасна во влажную погоду и рядом с металлическими конструкциями.','Опасность: высокая · Артефакты: электрические'],
 ['Воронка','Гравитационная','Локальное искажение пространства. Может притягивать предметы и резко менять направление движения. Не подходи к центру без проверки пути.','Опасность: критическая · Артефакты: гравитационные'],
 ['Карусель','Гравитационная','Поле с вращающимся потоком обломков. Следы часто остаются на открытых площадках и в низинах. Радиус воздействия трудно определить визуально.','Опасность: критическая · Артефакты: гравитационные'],
 ['Кисель','Химическая','Едкая аномальная жидкость или туман, повреждающий снаряжение и организм. Следы — разъеденные поверхности и резкий химический запах.','Опасность: высокая · Артефакты: химические'],
 ['Газировка','Химическая','Пузырящееся поле с нестабильными выбросами. Может выглядеть безобидно, пока не нарушена поверхность. Не проверяй неизвестную лужу без дистанции.','Опасность: средняя/высокая · Артефакты: химические'],
 ['Трамплин','Гравитационная','Невидимый импульсный выброс, способный отбросить человека или предмет. Чаще встречается на тропах, в высокой траве и у разрушенных дорог.','Опасность: высокая · Артефакты: гравитационные'],
 ['Мясорубка','Гравитационная','Многоступенчатое поле с резкими перемещениями обломков. Опасная зона может быть шире видимого следа. Обходи по проверенному маршруту.','Опасность: критическая · Артефакты: гравитационные'],
 ['Пепелище','Термическая','Участок с остаточным тепловым излучением и внезапными вспышками. После выбросов активность может усиливаться.','Опасность: высокая · Артефакты: термические'],
 ['Ржавый волос','Химическая','Тонкие нити едкого вещества, почти незаметные в сумерках. Контакт может повредить одежду и кожу. Осматривай проход фонарём с безопасного расстояния.','Опасность: высокая · Артефакты: химические'],
 ['Пузырь','Неизвестная','Полупрозрачная оболочка с нестабильным давлением. При приближении может менять форму и выбрасывать содержимое. Не трогай руками.','Опасность: неизвестная · Артефакты: редкие'],
 ['Пси-поле','Психотропная','Зона воздействия на восприятие и нервную систему. Возможны дезориентация, ложные звуки и потеря контроля над движением.','Опасность: критическая · Требуется защита'],
 ['Радиационное поле','Радиационная','Ионизирующее излучение накапливается при длительном пребывании в заражённом секторе. Дозиметр показывает уровень, антирад снижает накопленную дозу, а защитный костюм замедляет заражение.','Опасность: зависит от сектора · Используй антирад и защитную экипировку']
];
const encyclopediaLong={
 'Одиночки':'Разрозненное сообщество независимых исследователей, проводников и охотников за артефактами. Их сила — в знании местности и личных договорённостях. Отряды часто объединяются на время перехода, сопровождения или поиска пропавших. Нейтралитет не означает безопасности: отношение зависит от репутации и конкретных поступков.',
 'Долг':'Организованная группировка с дисциплиной, внутренней иерархией и жёстким отношением к угрозам Зоны. Участники охраняют укреплённые позиции, сопровождают исследовательские группы и стремятся ограничить распространение аномальной опасности. Их методы вызывают споры даже среди опытных сталкеров.',
 'Свобода':'Группировка, выступающая за свободное исследование Зоны и доступ к её тайнам. В её рядах встречаются разведчики, охотники и специалисты по аномалиям. Отношения с другими фракциями зависят от контроля над маршрутами, снабжения и старых конфликтов.',
 'Бандиты':'Разношерстные группы, для которых контроль проходов и нажива часто важнее правил. Одни промышляют грабежом, другие торгуют информацией и нелегальными поставками. Договариваться можно, но любое соглашение требует осторожности.',
 'Военные':'Силы периметра и гарнизоны, пытающиеся контролировать доступ в опасные районы. Их присутствие связано с блокпостами, патрулями и проверками. Отношение к сталкерам меняется в зависимости от приказов, обстановки и конкретного командира.'
};

let encyclopediaSelected='intro';
let encyclopediaExpanded={intro:true,training:false,creatures:false,anomalies:false,locations:false,artifacts:false,history:false,societies:false,gear:false};
function encyclopediaBase(){
 const entries=[];
 const add=(id,group,title,subtitle,body,extra='',symbol='▤')=>entries.push({id,group,title,subtitle,body,extra,symbol});
 add('intro','intro','Энциклопедия Зоны','Полевой справочник','Зона не сводится к карте и перечню опасностей. Это изменчивая территория со своей географией, экономикой, сообществами и памятью. Сведения в КПК собираются из разговоров, личных наблюдений, исследовательских отчётов и архивных материалов.\n\nНе все записи одинаково надёжны: часть основана на проверенных наблюдениях, часть передаётся со слов сталкеров. Сверяй сведения с обстановкой на месте и отмечай новые открытия.','Справочная система КПК · редакция полевого архива','⌕');
 add('training','training','Первый выход в Зону','Обучение','Перед экспедицией проверь состояние персонажа, запас воды и еды, медикаменты, защиту и свободное место в рюкзаке. Изучи карту, отметь цель и оцени риск маршрута.\n\nВеди журнал наблюдений: записывай найденные ориентиры, необычные сигналы, встречи и изменения контроля над территориями. Возвращайся к торговцам и проводникам за обновлённой информацией.','Учебная запись · основы подготовки и ориентирования','▣');
 add('training-radio','training','Связь и полевые заметки','Обучение','Радиосообщения помогают узнавать о передвижениях отрядов, просьбах о помощи и событиях в соседних секторах. Относись к неподтверждённым сообщениям как к слухам, пока не появится независимое подтверждение.\n\nПолевые заметки сохраняют имена, места и обстоятельства встреч. Такие записи могут оказаться полезнее старой карты.','Памятка связиста','⌁');
 for(const x of encyclopediaEntries.mutants)add('mutant-'+x[0],'creatures',x[0],x[1],x[2]+'\n\nПолевые наблюдения о повадках и местах встреч могут различаться. Сталкеры фиксируют следы, характерные звуки и изменения поведения местной фауны. Необычная активность иногда указывает на изменение обстановки в секторе.','Досье фауны · сведения собраны по полевым сообщениям','☣');
 for(const x of anomalyDossiers)add('anomaly-'+x[0],'anomalies',x[0],'Аномалия · '+x[1],x[2]+'\n\nИсследователи связывают появление артефактов с особенностями отдельных аномальных полей. Их состав и активность могут меняться. Сведения о конкретном месте проверяй по свежим отметкам и сообщениям.','Классификация: '+x[1]+' · '+x[3],'⌁');
 for(const l of g.locations){add('loc-'+l.id,'locations',l.name,'Сектор · контроль: '+l.owner+' ('+l.control+'%)',l.desc+'\n\nКаждый сектор имеет собственные маршруты, точки интереса и уровень риска. Здесь могут встречаться патрули, торговцы, мутанты и исследовательские группы. Состояние территории меняется вместе с событиями Зоны.','Ключевых точек: '+(g.keyPoints?.[l.id]||[]).length+' · открыто: '+(g.keyPoints?.[l.id]||[]).filter(p=>p.discovered).length,'▦');for(const k of g.keyPoints?.[l.id]||[])add('poi-'+k.id,'locations',k.name,l.name+' · '+k.kind,k.desc+'\n\nОтметка на карте: '+(k.discovered?'изучена':'пока не изучена')+'. По мере исследования здесь могут появляться новые сведения.','Точка интереса · '+(k.discovered?'обнаружена':'неизвестна'),'⌖');}
 for(const x of encyclopediaEntries.artifacts)add('artifact-'+x[0],'artifacts',x[0],x[1],x[2]+'\n\nАртефакты интересуют торговцев и исследовательские группы. Их свойства, редкость и стоимость зависят от типа находки и текущего спроса. Веди запись о месте обнаружения и передавай образцы специалистам для изучения.','Каталог артефактов · полевое и научное описание','✧');
 add('history','history','Хронология Зоны','История Зоны','После катастрофы территория вокруг Чернобыльской АЭС стала известна как Зона. Со временем здесь появились аномальные поля, необычные формы жизни и предметы с неизвестными свойствами.\n\nПервые экспедиции сменились постоянными маршрутами сталкеров, научными исследованиями, военными операциями и борьбой за контроль над ценными территориями. Каждая новая группа оставляет собственные записи, а многие события известны лишь по противоречивым свидетельствам.\n\nХронология КПК пополняется подтверждёнными игровыми событиями и найденными документами.','Историческая справка · внутриигровая хроника','◷');
 const societyText={ 'Одиночки':'Независимые исследователи, проводники и охотники за артефактами. Их связи строятся на личной репутации и взаимных договорённостях.','Долг':'Организованная группировка с дисциплиной и иерархией. Участники стремятся сдерживать опасности Зоны и укреплять контролируемые позиции.','Свобода':'Сообщество, выступающее за свободное исследование Зоны и доступ к её тайнам. Среди участников есть разведчики и специалисты по аномалиям.','Бандиты':'Разрозненные группы, ориентированные на наживу и контроль маршрутов. Отношения с ними зависят от конкретных лидеров и обстоятельств.','Военные':'Гарнизоны и патрули, контролирующие периметр и отдельные территории. Их действия определяются приказами и текущей обстановкой.','Наёмники':'Профессиональные группы, выполняющие контракты за вознаграждение. Их цели часто известны только заказчику и командиру отряда.','Учёные':'Исследовательские группы, изучающие аномалии, артефакты и необычную биологию Зоны. Для работы им нужны образцы и сопровождение.','Монолит':'Закрытое и крайне опасное сообщество, связанное с центральными районами Зоны. Сведения о его структуре остаются неполными.'};
 for(const f of g.factions){const title=f.name;add('society-'+title,'societies',title,'Общество · '+(f.style||'группировка'),(societyText[title]||'Группировка действует в нескольких секторах Зоны. Её влияние зависит от численности, снабжения, союзов и контроля маршрутов.')+'\n\nЧисленность по сводкам: '+f.members+'. Влияние: '+f.influence+'. Отношение к персонажу: '+(f.relation??0)+'.','Представитель: '+(f.leader?.name||'сведения уточняются'),'⚑');}
 for(const n of g.npcs)add('person-'+n.id,'societies',n.name,(n.role||'сталкер')+' · '+(n.faction||'неизвестная группировка'),(n.biography||n.desc||'Личное дело пока содержит мало сведений.')+'\n\nИзвестное местонахождение: '+locationName(n.loc||n.location)+'. Состояние: '+(n.alive===false?'погиб':'в Зоне')+'. Отношение: '+(g.relationships?.[n.id]??n.relationship??0)+'.','Персональное досье · данные могут обновляться','♙');
 for(const w of weaponCatalogue)add('weapon-'+w[0],'gear',w[1],w[2]+' · '+w[3],w[1]+' относится к категории «'+w[2]+'». Назначение: '+w[3]+'. Тип боеприпаса: '+w[4]+'. Масса: '+w[5]+' кг. Справочная цена: '+w[6]+' RU. Начальное состояние каталога: '+w[7]+'%.\n\nСостояние экземпляра, доступность боеприпасов и возможность ремонта влияют на практическую ценность снаряжения.','Каталог снаряжения · '+(g.discoveredWeapons.includes(w[0])?'обнаружено персонажем':'справочная запись'),'▰');
 for(const x of encyclopediaEntries.armor)add('armor-'+x[0],'gear',x[0],x[1],x[2]+'\n\nЗащитное снаряжение различается по массе, удобству, устойчивости к внешним воздействиям и совместимости с полевым оборудованием. Выбор комплекта зависит от задачи и состояния экипировки.','Каталог защитного снаряжения','▣');
 return entries;
}
const encyclopediaGroups=[['intro','Об энциклопедии','⌕'],['training','Обучение','＋'],['creatures','Животные и мутанты','＋'],['anomalies','Аномалии','＋'],['locations','Локации','＋'],['artifacts','Артефакты','＋'],['history','История Зоны','＋'],['societies','Общества','＋'],['gear','Снаряжение','＋']];
function selectEncyclopediaEntry(id){encyclopediaSelected=id;renderEncyclopedia();}
function toggleEncyclopediaGroup(id){encyclopediaExpanded[id]=!encyclopediaExpanded[id];renderEncyclopedia();}
function renderEncyclopedia(){
 const q=($('encyclopediaSearch')?.value||'').trim().toLowerCase(),entries=encyclopediaBase();
 let selected=entries.find(x=>x.id===encyclopediaSelected);
 if(q){const hit=entries.find(x=>(x.title+' '+x.subtitle+' '+x.body+' '+x.extra).toLowerCase().includes(q));if(hit)selected=hit;}
 if(!selected)selected=entries[0];encyclopediaSelected=selected.id;
 const tree=$('encyclopediaTree');if(tree){tree.innerHTML=encyclopediaGroups.map(([id,label,icon])=>{const list=entries.filter(x=>x.group===id),matches=list.filter(x=>!q||(x.title+' '+x.subtitle+' '+x.body).toLowerCase().includes(q));if(q&&!matches.length)return '';const open=!!encyclopediaExpanded[id]||!!q||id==='intro';return `<section class="pda-ency-group"><button class="pda-ency-group-toggle ${selected.group===id?'current':''}" onclick="toggleEncyclopediaGroup('${id}')"><span>${open?'−':'+'}</span>${escapeHtml(label)}</button>${open?`<div class="pda-ency-nodes">${matches.map(x=>`<button class="pda-ency-node ${selected.id===x.id?'selected':''}" onclick="selectEncyclopediaEntry('${escapeHtml(x.id)}')">${escapeHtml(x.title)}</button>`).join('')}</div>`:''}</section>`;}).join('')||'<div class="pda-ency-empty">Совпадений нет.</div>';}
 const article=$('encyclopediaArticle');if(article){const paragraphs=selected.body.split(/\n\n+/).map(t=>`<p>${escapeHtml(t)}</p>`).join('');article.innerHTML=`<div class="pda-ency-article-title"><span class="pda-ency-symbol">${selected.symbol}</span><div><div class="eyebrow">${escapeHtml(encyclopediaGroups.find(x=>x[0]===selected.group)?.[1]||'Справка')}</div><h2>${escapeHtml(selected.title)}</h2><div class="pda-ency-subtitle">${escapeHtml(selected.subtitle)}</div></div></div><div class="pda-ency-rule"></div><div class="pda-ency-copy">${paragraphs}</div><div class="pda-ency-note"><b>ПОЛЕВАЯ ЗАПИСЬ</b><span>${escapeHtml(selected.extra||'Материал архива КПК')}</span></div>`;}
 const path=$('encyclopediaPath');if(path)path.textContent='# /Справка/'+(encyclopediaGroups.find(x=>x[0]===selected.group)?.[1]||'Архив')+'/'+selected.title;
 const count=$('encyclopediaCount');if(count)count.textContent=`${entries.length} ЗАПИСЕЙ · ${entries.filter(x=>x.group===selected.group).length} В РАЗДЕЛЕ`;
 const stats=$('encyclopediaStats');if(stats)stats.textContent=`${entries.length} материалов · открыто точек: ${Object.values(g.keyPoints||{}).flat().filter(p=>p.discovered).length}`;
 const legacyList=$('encyclopediaList');if(legacyList)legacyList.innerHTML=entries.map(x=>`<article><b>${escapeHtml(x.title)}</b><p>${escapeHtml(x.body)}</p></article>`).join('');
}
function save(){localStorage.setItem("zoneExpandedSave",JSON.stringify(g));render();if($("trade")?.classList.contains("active"))renderTrade()}
function log(t){g.log.unshift(t);g.log=g.log.slice(0,35)}
function news(t,b){const c=realClock();g.news.unshift({day:c.day,hour:c.time,title:t,body:b});g.news=g.news.slice(0,40)}
function addItem(id,name,type,desc,weight,value,qty=1){let x=g.items.find(i=>i.id===id);if(x)x.qty+=qty;else g.items.push({id,name,type,desc,weight,value,qty})}
function count(id){return g.items.find(i=>i.id===id)?.qty||0}
function take(id,n){let x=g.items.find(i=>i.id===id);if(!x||x.qty<n)return false;x.qty-=n;if(x.qty<=0)g.items=g.items.filter(i=>i.id!==id);return true}
function view(id){if(id!=="people"&&$("npcDialogueOverlay")?.classList.contains("open"))closeTalk();document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));document.querySelectorAll("[data-v]").forEach(b=>b.classList.toggle("active",b.dataset.v===id));document.querySelector("main>aside.panel")?.classList.remove("mobile-open");if(id==="war")renderWar();if(id==="encyclopedia")renderEncyclopedia();if(id==="stories")renderStories();if(id==="people")renderPeople();if(id==="squads")renderSquads();if(id==="profile")renderProfile();if(id==="inventory")renderInventory();if(id==="trade")renderTrade();if(id==="settings")applyGameOptions();if(id==="world")renderMap();if(id==="ranks"){renderStalkerLeaderboard()}if(id==="factions"){renderFactions();renderFactionLeaderboard();renderDiplomacy()}}
function toggleMobileMenu(){document.querySelector("main>aside.panel")?.classList.toggle("mobile-open")}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("npcDialogueOverlay")?.classList.contains("open"))closeTalk();});
document.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{view(b.dataset.v);if(b.dataset.v==="armory")renderArmory();if(b.dataset.v==="inventory")renderInventory()});

function localLeaderboardFallback(){
 const roster=(serverWorld?.npcState?Object.values(serverWorld.npcState):(g.npcs||[])).filter(n=>n&&n.name);
 const rows=roster.map((n,i)=>({id:`npc:${n.id||i}`,type:'npc',name:n.name,faction:n.faction||'Одиночки',role:n.role||'сталкер',location:n.location||g.loc,kills:Number(n.combatKills)||0,deaths:Number(n.combatDeaths)||0,score:100+(Number(n.combatKills)||0)*125+Math.max(0,20-i),place:0}));
 rows.push({id:`player:${zonePlayerId||'local'}`,type:'player',playerId:zonePlayerId||'local',name:g.name||'Ты',faction:g.faction||'Одиночки',role:'сталкер',location:g.loc,kills:Number(g.careerStats?.kills)||0,deaths:0,score:100+(Number(g.careerStats?.kills)||0)*150+Math.min(500,Math.floor((Number(g.xp)||0)/10)),place:0});
 rows.sort((a,b)=>b.score-a.score||b.kills-a.kills||a.name.localeCompare(b.name,'ru'));return rows.slice(0,20).map((x,i)=>({...x,place:i+1}));
}
function rankLabel(row){if(row.place===1)return 'Легенда Зоны';if(row.place<=3&&row.place>0)return 'Элита Зоны';if(row.place<=10&&row.place>0)return 'Ветеран Зоны';const score=Number(row.score)||0;return score>=1800?'Легенда':score>=1200?'Мастер':score>=800?'Ветеран':score>=450?'Опытный':score>=200?'Боец':'Новичок'}
function renderStalkerLeaderboard(){
 const list=$('stalkerLeaderboard');if(!list)return;
 const rows=serverLeaderboard.length?serverLeaderboard:localLeaderboardFallback();
 if(!rows.some(x=>x.id===selectedRankId))selectedRankId=rows[0]?.id||'';
 list.innerHTML=rows.map(row=>`<button class="pda-rank-row ${row.id===selectedRankId?'selected':''}" onclick="selectRankEntry('${String(row.id).replace(/[^a-zA-Z0-9:_-]/g,'')}')"><span class="rank-place">${row.place||'—'}.</span><span class="rank-name">${escapeHtml(row.name)}</span><span class="rank-score">${Number(row.score||0).toLocaleString('ru-RU')}</span></button>`).join('')||'<div class="mutedbox small">Рейтинг пока пуст.</div>';
 const chosen=rows.find(x=>x.id===selectedRankId)||rows[0];
 if(chosen){$('rankDetailTitle').textContent=chosen.name;$('rankDetail').innerHTML=`<div class="rank-detail-top">${portraitMarkup({id:chosen.id,name:chosen.name,faction:chosen.faction,role:chosen.role||'сталкер'},true)}<div><b>${escapeHtml(chosen.name)}</b><div class="desc">${escapeHtml(chosen.role||'сталкер')} · ${escapeHtml(chosen.faction||'Одиночки')}</div><span class="tag">${rankLabel(chosen)}</span></div></div><div class="rank-detail-grid"><div><small>Место</small><b>№ ${chosen.place||'—'}</b></div><div><small>Очки</small><b>${Number(chosen.score||0).toLocaleString('ru-RU')}</b></div><div><small>Победы</small><b>${Number(chosen.kills||0)}</b></div><div><small>Поражения</small><b>${Number(chosen.deaths||0)}</b></div><div><small>Локация</small><b>${escapeHtml(locationName(chosen.location)||chosen.location||'—')}</b></div><div><small>Тип записи</small><b>${chosen.type==='player'?'Игрок':'Персонаж Зоны'}</b></div></div><div class="rank-detail-note">${chosen.lastVictim?`Последняя победа: ${escapeHtml(chosen.lastVictim)}`:'Рейтинг обновляется после боевых событий и активности в Зоне.'}${chosen.achievements?.length?`<div class="desc" style="margin-top:8px">Достижения: ${chosen.achievements.map(escapeHtml).join(' · ')}</div>`:''}</div>`;}
 const me=rows.find(x=>x.playerId===zonePlayerId||x.id===`player:${zonePlayerId||'local'}`);$('rankMyPosition').textContent=me?`ТВОЁ МЕСТО: ${me.place}`:'ТВОЁ МЕСТО: ВНЕ ТОП-20';$('rankUpdated').textContent=`ОБНОВЛЕНО ${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}`;$('rankClock').textContent=realClock().time+'  '+realClock().stamp;
 $('rankSummary').innerHTML=[['Участников в рейтинге',rows.length],['Твоя статистика',Number(g.careerStats?.kills)||0],['Текущий рейтинг',me?Number(me.score).toLocaleString('ru-RU'):'—']].map(x=>`<div class="stat"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
 $('rankRecent').innerHTML=rankRecentEvents.slice(0,6).map(e=>`<div class="item block"><b>${escapeHtml(e.name||'Сталкер')}</b><div class="desc">${escapeHtml(e.text||'Позиция в рейтинге обновлена')}</div></div>`).join('')||'<div class="mutedbox small">Новых изменений пока нет.</div>';
 const hall=window.zoneHallOfFame||[];const hallEl=$('rankHallOfFame');if(hallEl)hallEl.innerHTML=hall.slice(0,8).map(x=>`<div class="item block"><b>${escapeHtml(x.name)}</b><div class="desc">${escapeHtml(x.faction||'Неизвестно')} · ${escapeHtml(x.cause||'Погиб в Зоне')}</div></div>`).join('')||'<div class="mutedbox small">Пока нет павших легенд.</div>';
 const achievements=chosen?.achievements||me?.achievements||[];const achEl=$('rankAchievements');if(achEl)achEl.innerHTML=achievements.map(x=>`<div class="item block">✦ ${escapeHtml(x)}</div>`).join('')||'<div class="mutedbox small">Продолжай исследовать Зону, выполнять задания и побеждать.</div>';
 const newsEl=$('rankNews');if(newsEl)newsEl.innerHTML=(window.zoneStalkerNews||[]).slice(0,8).map(x=>`<div class="item block"><b>${escapeHtml(x.name||'Зона')}</b><div class="desc">${escapeHtml(x.text||'')}</div></div>`).join('')||'<div class="mutedbox small">Пока тихо. Зона живёт своей жизнью.</div>';
}

const factionEmblems={
 'Одиночки':'loners.svg','Долг':'duty.svg','Свобода':'freedom.svg','Бандиты':'bandits.svg','Военные':'military.svg','Учёные':'scientists.svg','Наёмники':'mercenaries.svg','Монолит':'monolith.svg','Чистое небо':'clear-sky.svg'
};
let selectedFactionRank='';
function factionRelationValue(a,b){if(a==='Монолит'||b==='Монолит')return -60;const v=g.diplomacy?.[a]?.[b];if(Number.isFinite(Number(v)))return Math.max(-60,Math.min(60,Number(v)));const fa=g.factions.find(x=>x.name===a),fb=g.factions.find(x=>x.name===b);return Math.max(-60,Math.min(60,Math.round(((Number(fa?.relation)||0)+(Number(fb?.relation)||0))/2)));}
function factionRankRows(){
 const factions=g.factions||[], roster=serverWorld?.npcState?Object.values(serverWorld.npcState):(g.npcs||[]), locations=g.locations||[];
 return factions.map(f=>{
  const alive=roster.filter(n=>n&&n.alive!==false&&n.faction===f.name).length;
  const patrols=(g.patrols||[]).filter(p=>p.faction===f.name).reduce((a,p)=>a+(Number(p.strength)||0),0);
  const held=locations.filter(l=>l.owner===f.name), territory=held.reduce((a,l)=>a+(Number(l.control)||0),0);
  const members=Math.max(0,Number(f.members)||0)+alive;
  const influence=Math.max(0,Number(f.influence)||0);
  const wins=Number(g.factionStats?.[f.name]?.wins)||0;
  const score=Math.round(influence*5+members*.35+territory*1.5+patrols*3+wins*25);
  const base=held[0]||locations.find(l=>l.owner===f.name)||null;
  const relations=factions.filter(x=>x.name!==f.name).map(x=>({name:x.name,value:factionRelationValue(f.name,x.name)}));
  return {...f,alive,members,patrols,territory,territoryCount:held.length,score,wins,baseName:base?.name||'Нет постоянной базы',relations};
 }).sort((a,b)=>b.score-a.score||b.influence-a.influence||b.members-a.members).map((f,i)=>({...f,place:i+1}));
}
function factionEmblemMarkup(f){const file=factionEmblems[f.name];return file?`<img class="faction-emblem" src="/assets/factions/${file}" alt="Эмблема ${escapeHtml(f.name)}" loading="lazy">`:`<span class="faction-emblem-fallback">${escapeHtml(f.icon||'◈')}</span>`;}
function renderFactionLeaderboard(){
 const el=$('factionLeaderboard');if(!el)return;
 const rows=factionRankRows();if(!rows.some(x=>x.name===selectedFactionRank))selectedFactionRank=rows[0]?.name||'';
 el.innerHTML=rows.map(f=>{
  const cells=Array.from({length:18},(_,i)=>{const r=f.relations[i]||null;let cls='neutral';if(r?.value<=-20)cls='enemy';else if(r?.value>=20)cls='friend';else if(r)cls='tense';return `<i class="faction-rel-cell ${cls}" title="${r?`${escapeHtml(r.name)}: ${r.value>0?'+':''}${Math.round(r.value)}`:'Нет данных'}"></i>`}).join('');
  const move=f.place===1?'▲':f.place<=3?'◆':'•';
  return `<button class="faction-rank-row ${selectedFactionRank===f.name?'selected':''}" onclick="selectFactionRank('${String(f.name).replace(/\\/g,'').replace(/'/g,"\\'")}')"><div class="faction-rank-main"><span class="faction-rank-place">${f.place}</span><span class="faction-rank-trend ${f.place<=3?'up':''}">${move}</span><div class="faction-rank-nameblock"><b>«${escapeHtml(f.name)}»</b><small>Местонахождение: <strong>${escapeHtml(f.baseName)}</strong></small><small>Сила группировки: <strong>${f.score.toLocaleString('ru-RU')}</strong></small></div></div><div class="faction-relations"><div class="faction-rel-cells">${cells}</div><div class="faction-rel-labels"><span>Враги</span><span>Нейтральные</span><span>Друзья</span></div></div><div class="faction-rank-emblem">${factionEmblemMarkup(f)}</div></button>`;
 }).join('')||'<div class="mutedbox small">Нет данных о группировках.</div>';
 const selected=rows.find(x=>x.name===selectedFactionRank);
 const detail=$('factionRankDetail');if(detail&&selected){detail.innerHTML=`<div class="faction-detail-emblem">${factionEmblemMarkup(selected)}</div><div class="faction-detail-copy"><b>«${escapeHtml(selected.name)}»</b><span>${escapeHtml(selected.style||'Группировка Зоны')}</span></div><div class="faction-detail-stats"><span>Место <b>№ ${selected.place}</b></span><span>Очки силы <b>${selected.score.toLocaleString('ru-RU')}</b></span><span>Численность <b>${selected.members.toLocaleString('ru-RU')}</b></span><span>Влияние <b>${selected.influence}</b></span><span>Территории <b>${selected.territoryCount}</b></span><span>Патрули <b>${selected.patrols}</b></span></div>`;}
 $('factionRankUpdated').textContent=`ОБНОВЛЕНО ${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}`;$('factionRankCount').textContent=`${rows.length} ГРУППИРОВОК`;
}
function selectFactionRank(name){selectedFactionRank=name;renderFactionLeaderboard()}

function selectRankEntry(id){selectedRankId=id;renderStalkerLeaderboard()}
function applyLeaderboard(data){if(Array.isArray(data))serverLeaderboard=data.slice(0,20);else if(data&&typeof data==='object'){serverLeaderboard=Array.isArray(data.entries)?data.entries.slice(0,20):serverLeaderboard;window.zoneHallOfFame=Array.isArray(data.hallOfFame)?data.hallOfFame:window.zoneHallOfFame;window.zoneStalkerNews=Array.isArray(data.news)?data.news:window.zoneStalkerNews;}if($('ranks')?.classList.contains('active'))renderStalkerLeaderboard();}
function renderStories(){if(window.ZoneStories&&$('storyList'))$('storyList').innerHTML=window.ZoneStories.render(g)}
function chooseStory(id){if(!window.ZoneStories)return;const result=window.ZoneStories.choose(g,id);if(result.message){log(result.message);news(result.ok?'Личное дело':'Сведения по делу',result.message)}save();renderStories()}
function here(){return g.locations.find(l=>l.id===g.loc)}
function npcBy(id){return g.npcs.find(n=>n.id===id)}
function nearbyNpcs(){syncNpcRosterToClient();return here().people.map(npcBy).filter(Boolean)}
function addQuest(id){let q=g.quests.find(q=>q.id===id);if(q&&!q.accepted&&!q.done){q.accepted=true;log("Получено задание: "+q.title);news("Новое задание",q.title+" — "+q.desc)}}
function showNpcDialogue(){const overlay=$('npcDialogueOverlay');if(overlay){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('dialogue-open');}}
function dialogueTarget(){return $('dialogueBox')}
function meet(id){let n=npcBy(id);if(!n||n.loc!==g.loc)return;activeNpc=id;g.meetings++;
log("Встреча: "+n.name+".");view("people");renderPeople();startTalk(id);save()}

function renderCopDialogue(n, message, choices){
 const box=$('dialogueBox'), choiceBox=$('dialogueChoices');
 if(!n||!box||!choiceBox)return;
 const left=$('dialoguePortraitLeft');
 if(left)left.innerHTML=portraitMarkup(n,true);
 $('dialogueNpcName').textContent=n.name||'Сталкер';
 $('dialogueNpcFaction').textContent=n.faction||'Неизвестная группировка';
 $('dialogueNpcRole').textContent=n.role||'Полевой сталкер';
 $('dialoguePlayerName').textContent=g.name||'Сталкер';
 $('dialoguePlayerFaction').textContent=g.faction||'Одиночки';
 box.innerHTML=`<div class="cop-message"><b>${escapeHtml(n.name||'Сталкер')}</b><p>${escapeHtml(message||n.greeting||'…')}</p></div>`;
 choiceBox.innerHTML=(choices||[]).map((t,i)=>`<button type="button" onclick="topic('${escapeHtml(n.id)}',${i})">${escapeHtml(t[0])}</button>`).join('')+(n.role==='техник'?`<button type="button" class="dialogue-trade-action" onclick="openRepairWorkshop('${escapeHtml(n.id)}')">⚙ Мастерская: ремонт оружия и брони</button>`:'')+`<button type="button" class="dialogue-trade-action" onclick="closeTalk();openNpcTrade('${escapeHtml(n.id)}')">Торговать</button>`;
}
function startTalk(id){
 let n=npcBy(id);if(!n)return;
 const live=serverWorld?.npcState?.[id];
 if(live?.dialogue){
  if(live.generated){n.greeting=live.dialogue.greeting;n.topics=live.dialogue.topics;}
  else{n.topics=(n.topics||[]).filter(t=>!['Свежие слухи','Личная история'].includes(t[0]));n.topics.push(['Свежие слухи',live.dialogue.topics?.[1]?.[1]||'Пока новых сведений нет.'],['Личная история',live.dialogue.topics?.[2]?.[1]||'Сталкер не хочет говорить о прошлом.']);}
 }
 activeNpc=id;
 const storyMeet={lebedev:["metLebedev","story_swamp_signal"],novikov:["metNovikov","story_swamp_relay"],prof:["metSakharov","story_yantar_echo"],beard:["metBeard","story_north_route"],archivist:["metArchivist","story_pripyat_archive"]};
 if(storyMeet[id]){g.storyFlags[storyMeet[id][0]]=true;addQuest(storyMeet[id][1]);}
 showNpcDialogue();
 renderCopDialogue(n,n.greeting||'Сталкер внимательно смотрит на тебя.',n.topics||[]);
 renderQuick();
}
function topic(id,i){
 if(zoneSocket?.connected){zoneSocket.emit("npc:interact",{npcId:id,action:"topic",topicIndex:i});return;}
 let n=npcBy(id),t=n?.topics?.[i];if(!n||!t)return;
 let result=t[1];
 if(id==="wolf"&&i===1)addQuest("bread");if(id==="sid"&&i===2)addQuest("scrap");if(id==="barman"&&i===2)addQuest("rumors");if(id==="prof"&&i===1){addQuest("rumors");addQuest("research");}if(id==="scientist"&&i===1)addQuest("scrap");
 if(id==="wolf"){g.flags.metWolf=true;if(i===1)addQuest("bread");}
 if(id==="scout")g.flags.metScout=true;if(id==="prof")g.flags.metProf=true;if(id==="sid")g.flags.metSid=true;if(id==="barman")g.flags.heardBar=true;
 const oldTopics=n.topics.slice();renderCopDialogue(n,result,[['Задать другой вопрос',0],['Завершить разговор',1]]);
 const choiceBox=$('dialogueChoices');
 if(choiceBox)choiceBox.innerHTML=`<button onclick="startTalk('${id}')">Задать другой вопрос</button>${id==="sid"&&i===2?`<button onclick="turnIn('scrap')">Передать металлолом</button>`:''}${id==="wolf"&&i===1?`<button onclick="turnIn('bread')">Передать хлеб</button>`:''}<button onclick="closeTalk()">Попрощаться</button>`;
 log("Разговор: "+n.name+" — "+t[0]);save();
}
function closeTalk(){activeNpc=null;const overlay=$("npcDialogueOverlay");if(overlay){overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");}document.body.classList.remove("dialogue-open");const box=dialogueTarget();if(box)box.innerHTML="Разговор завершён. Можно осмотреться или встретить другого персонажа.";renderQuick()}

let activePlayerDM=null, playerDMHistory={};
function openPlayerDM(id){const p=onlinePlayers.find(x=>x.id===id);if(!p||p.location!==g.loc)return alert('Игрок должен находиться в этой локации.');activePlayerDM=id;zoneSocket?.emit('dm:history',{targetId:id});renderPlayerDM();}
function renderPlayerDM(){const el=$('playerDmPanel');if(!el)return;const target=onlinePlayers.find(x=>x.id===activePlayerDM);if(!target){el.innerHTML='<div class="mutedbox">Выбери игрока в этой локации.</div>';return;}const msgs=playerDMHistory[activePlayerDM]||[];el.innerHTML=`<div class="dm-head"><b>Личный канал: ${escapeHtml(target.name)}</b><span class="tag">${escapeHtml(locationName(target.location))}</span></div><div class="dm-history" id="playerDmHistory">${msgs.map(m=>`<div class="dm-line ${m.fromId===zonePlayerId?'mine':''}"><b>${escapeHtml(m.fromName||'Сталкер')}</b><p>${escapeHtml(m.text)}</p><small>${new Date(m.time).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</small></div>`).join('')||'<div class="mutedbox small">История сообщений пуста.</div>'}</div><div class="dm-compose"><input id="playerDmInput" maxlength="500" placeholder="Написать личное сообщение…" onkeydown="if(event.key==='Enter')sendPlayerDM()"><button onclick="sendPlayerDM()">Отправить</button></div>`;const h=$('playerDmHistory');if(h)h.scrollTop=h.scrollHeight;}
function sendPlayerDM(){const input=$('playerDmInput'),text=input?.value?.trim();if(!text||!activePlayerDM)return;if(!zoneSocket?.connected)return alert('Нет соединения с сервером.');zoneSocket.emit('dm:send',{targetId:activePlayerDM,text});input.value='';}
function renderPeople(){
 syncNpcRosterToClient();
 const roster=nearbyNpcs();
 const nearby=roster.map(n=>{
  const rel=Number(g.relationships?.[n.id]||n.relationships?.[zonePlayerId]||0);
  const rank=n.rank||n.title||n.role||'Сталкер';
  return `<div class="item npc-profile-card"><div class="npc-card">${portraitMarkup(n)}<div class="npc-main"><b>${escapeHtml(n.name)}</b><div class="desc">${escapeHtml(n.role)} · ${escapeHtml(n.faction||"")} · ${escapeHtml(n.desc||"")}</div><div class="small muted">${escapeHtml(n.personality||"сталкер")} · ${escapeHtml(rank)}</div><div class="npc-stat-strip"><span>Здоровье <b>${Math.round(n.health??100)}%</b></span><span>Мораль <b>${Math.round(n.morale??60)}%</b></span><span>Отношение <b>${rel>0?'+':''}${rel}</b></span><span>Друзья <b>${(n.friends||[]).length}</b></span><span>Соперники <b>${(n.rivals||[]).length}</b></span><span>Состояние <b>${escapeHtml(n.action||'в секторе')}</b></span></div></div></div>${n.biography?`<p class="desc">${escapeHtml(n.biography)}</p>`:""}<div class="rightbuttons">${npcMarkerClass(n)==='marker-enemy'?`<button class="battle-button" onclick="startNpcEncounter('${n.id}')">⚔ Вступить в бой</button><span class="tag">Враждебная группировка</span>`:`<button onclick="startTalk('${n.id}')">Поговорить</button><button onclick="npcServerAction('${n.id}','ask')">Спросить о слухах</button>${n.role==='медик'?`<button onclick="npcSpecialistAction('${n.id}')">✚ Медицинская помощь</button>`:n.role==='техник'?`<button onclick="npcSpecialistAction('${n.id}')">⚙ Ремонт снаряжения</button>`:''}<button onclick="openNpcTrade('${n.id}')">Торговля / снаряжение</button>`}</div></div>`;
 }).join("");
 const squads=(serverWorld?.npcSquads||[]).filter(s=>s.status!=='disbanded').map(s=>`<div class="item"><b>Отряд «${escapeHtml(s.name)}»</b><div class="desc">${escapeHtml(s.faction)} · ${escapeHtml(locationName(s.location))} · ${s.members.length} бойцов · ${s.status==='on_raid'?'в рейде':'на привале'}</div></div>`).join("");
 const memorial=(serverWorld?.npcMemorial||[]).slice(0,5).map(m=>`<div class="item"><b>☠ ${escapeHtml(m.name)}</b><div class="desc">Погиб: ${escapeHtml(m.cause)} · ${escapeHtml(locationName(m.location))}</div></div>`).join("");
 $("peopleList").innerHTML=(nearby||'<div class="mutedbox">В этой локации сейчас никого нет. Попробуй зайти позже.</div>')+(squads?`<h3>Отряды сталкеров</h3>${squads}`:"")+(memorial?`<h3>Память Зоны</h3>${memorial}`:"");
}

function openNpcTrade(id){const n=npcBy(id);if(!n||n.loc!==g.loc)return alert('Сталкер должен находиться рядом.');activeNpc=id;const eq=n.equipment||serverWorld?.npcState?.[id]?.equipment||{};const role=(n.role||'').toLowerCase(),fallback={suit:role.includes('торгов')?'Куртка торговца':role.includes('учён')||role.includes('исслед')?'Научный комбинезон':'Комбинезон сталкера',weapon:role.includes('охот')?'ТОЗ-34':role.includes('развед')?'АКС-74У':'ПМ',tool:'Обычный детектор',backpack:'Полевой рюкзак'};const stock=tradeGoods().filter(x=>['Медицина','Еда','Артефакт','Броня','Инструмент'].includes(x[2])).slice(0,12);const npcBalance=Number(serverWorld?.npcEconomy?.[id]?.balance??(id==='sid'?10000000:5000));let panel=$('npcTradePanel');if(!panel){panel=document.createElement('div');panel.id='npcTradePanel';panel.className='npc-trade-panel';$('peopleList').appendChild(panel);}panel.innerHTML=`<div class="npc-trade-window"><div class="npc-trade-title"><b>Полевой обмен — ${escapeHtml(n.name)}</b><span class="tag">${escapeHtml(n.role||'Сталкер')}</span></div><div class="npc-equipment"><b>Снаряжение сталкера</b><div class="npc-equipment-grid">${[['Костюм',eq.suit||n.suit||fallback.suit],['Оружие',eq.weapon||n.weapon||fallback.weapon],['Детектор',eq.detector||eq.tool||fallback.tool],['Рюкзак',eq.backpack||fallback.backpack]].map(x=>`<div><small>${x[0]}</small><b>${escapeHtml(x[1])}</b></div>`).join('')}</div></div><b>Предложение торговца</b><div class="small muted">Касса NPC: ${npcBalance.toLocaleString('ru-RU')} ₽ · твои деньги учитываются отдельно</div><div class="npc-stock">${stock.map(x=>`<div class="npc-stock-row"><span><b>${escapeHtml(x[0])}</b><small>${escapeHtml(x[2])} · ${x[3]} ₽</small></span><button onclick="npcBuy('${id}','${x[1]}')">Купить</button></div>`).join('')}</div><b>Продать сталкеру</b><div class="npc-stock">${g.items.filter(x=>x.qty>0).slice(0,10).map(x=>`<div class="npc-stock-row"><span><b>${escapeHtml(x.name)}</b><small>${x.qty} шт. · ориентир ${Math.floor(x.value*.5)} ₽</small></span><button onclick="npcSell('${id}','${x.id}')">Продать</button></div>`).join('')||'<small>В рюкзаке нет вещей для продажи.</small>'}</div><button class="quiet-action" onclick="closeNpcTrade()">Закрыть обмен</button></div>`;}
function closeNpcTrade(){const p=$('npcTradePanel');if(p)p.innerHTML='';}
function npcBuy(npcId,item){if(zoneSocket?.connected){zoneSocket.emit('npc:trade:buy',{npcId,item});return;}alert('Для безопасной торговли с NPC подключись к серверу.');}
function npcSell(npcId,item){if(zoneSocket?.connected){zoneSocket.emit('npc:trade:sell',{npcId,item,qty:1});return;}alert('Для безопасной торговли с NPC подключись к серверу.');}

function portraitMarkup(n,large=false){
 const seed=String(n.id||n.name||'npc').split('').reduce((a,c)=>((a*31)+c.charCodeAt(0))>>>0,7),portrait=(seed%16)+1,src=`/assets/portraits/stalker-${String(portrait).padStart(2,'0')}.webp`;
 return `<div class="npc-portrait ${large?'portrait-xl':''}" style="--portrait-hue:${seed%360}"><img src="${src}" alt="Портрет ${escapeHtml(n.name||'сталкера')}" loading="lazy"><span class="portrait-faction">${factionIconMarkup(n.faction)}</span></div>`;
}
function returnToTitleScreen(){
 if(!g.characterCreated)return openTitleScreen();
 save();
 closeTalk?.();
 $('combatOverlay')?.classList.remove('show');
 $('characterSetup')?.classList.remove('show');
 closeTitleOptions();
 openTitleScreen();
}
// Legacy entry point now returns to the actual title screen instead of opening the old quick-access popup.
function openMainMenu(){returnToTitleScreen();}
function closeMainMenu(){closeTitleOptions();}
function menuGo(id){view(id);render();}
function setGameOption(key,value){
 g.options||={};g.options[key]=!!value;document.body.classList.toggle('large-text',!!g.options.largeText);document.body.classList.toggle('reduce-motion',!!g.options.reduceMotion);document.body.classList.toggle('compact-ui',!!g.options.compactUI);
 const pairs={largeText:'settingLargeText',reduceMotion:'settingReduceMotion',compactUI:'settingCompact'},titlePairs={largeText:'titleLargeText',reduceMotion:'titleReduceMotion',compactUI:'titleCompact'};
 if($(pairs[key]))$(pairs[key]).checked=!!value;if($(titlePairs[key]))$(titlePairs[key]).checked=!!value;save();
}
function applyGameOptions(){for(const [key,value] of Object.entries(g.options||{})){document.body.classList.toggle(key==='largeText'?'large-text':key==='reduceMotion'?'reduce-motion':'compact-ui',!!value);}}
function npcServerAction(npcId,action){
 const npc=npcBy(npcId);if(!npc)return;
 if(zoneSocket?.connected&&zonePlayerReady){zoneSocket.emit('npc:interact',{npcId,action});return;}
 // Offline fallback keeps NPC rumor interaction playable even when the online world is unavailable.
 const rumors=['На старой дороге заметили свежий патруль. Не суйся туда без разведки.','Торговцы ждут караван с медикаментами. Говорят, он задержался у Свалки.','На Янтаре вырос фон. Учёные просят не приближаться к старому корпусу.','На севере ищут проводника, который знает обход вокруг блокпоста.','У костра шепчутся, что один из тайников недавно вскрыли.'];
 const topicList=Array.isArray(npc.topics)?npc.topics:[];
 const response=action==='ask'?(topicList[1]?.[1]||rumors[Math.abs(String(npcId).split('').reduce((a,c)=>a+c.charCodeAt(0),0))%rumors.length]):'Сталкер внимательно слушает тебя.';
 renderCopDialogue(npc,response,[['Задать другой вопрос',0],['Завершить разговор',1]]);
 const choices=$('dialogueChoices');if(choices)choices.innerHTML=`<button onclick="startTalk('${escapeHtml(npcId)}')">Задать другой вопрос</button><button onclick="closeTalk()">Попрощаться</button>`;
 log(`Слух от ${npc.name}: ${response}`);g.rep=Math.min(1000,(Number(g.rep)||0)+1);save();
}
function npcSpecialistAction(npcId){
 const npc=npcBy(npcId);if(!npc)return;
 if(npc.role==='техник'){openRepairWorkshop(npcId);return;}
 const cost=75;
 if(g.money<cost)return alert(`Нужно ${cost} ₽ за услугу.`);
 if(g.hp>=100)return alert('Здоровье уже в порядке.');
 g.money-=cost;g.hp=Math.min(100,g.hp+35);log(`${npc.name} оказал медицинскую помощь. Здоровье восстановлено.`);save();
}
function repairableGear(){return (g.items||[]).filter(x=>['Оружие','Броня','Детектор'].includes(x.type)&&Number(x.qty||1)>0);}
function repairCost(item,npc){
 const missing=100-Math.max(0,Math.min(100,Number(item.condition??100)));
 const base=Math.max(1,Number(item.value)||100);
 const factionTech=npc?.id?.startsWith('faction-tech-');
 const multiplier=npc?.id==='azot'?.92:(factionTech?.94:1);
 const reputationDiscount=Math.min(.12,Math.max(0,Number(g.rep)||0)/5000);
 return missing<=0?0:Math.max(10,Math.ceil(base*(missing/100)*.72*multiplier*(1-reputationDiscount)));
}
function repairWorkshopItemCard(item,npc,selectedId){
 const condition=Math.max(0,Math.min(100,Number(item.condition??100))),cost=repairCost(item,npc),isSelected=item.id===selectedId;
 return `<button type="button" class="repair-backpack-item ${isSelected?'selected':''} ${condition>=100?'perfect':''}" onclick="selectRepairItem('${escapeHtml(npc.id)}','${escapeHtml(item.id)}')" aria-pressed="${isSelected}"><span class="repair-item-qty">×${Math.max(1,Number(item.qty)||1)}</span><span class="repair-item-glyph">${itemGlyph(item)}</span><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.type)}</small><i><em style="width:${condition}%"></em></i><span class="repair-item-condition">${condition}%</span><span class="repair-item-cost">${condition>=100?'ИСПРАВНО':cost.toLocaleString('ru-RU')+' RU'}</span></button>`;
}
let repairSelectedItemId=null;
function openRepairWorkshop(npcId){
 const npc=npcBy(npcId);if(!npc||npc.role!=='техник')return alert('Здесь нет техника, который может выполнить ремонт.');
 if(npc.loc!==g.loc)return alert('Техник должен находиться в текущей локации.');
 if(npc.id.startsWith('faction-tech-')&&npc.faction!==g.faction)return alert(`Этот техник служит группировке «${npc.faction}». Ремонт у него доступен только своим.`);
 const gear=repairableGear();const selected=gear.find(x=>x.id===repairSelectedItemId)||gear.find(x=>x.name===g.equipment?.weapon)||gear.find(x=>x.name===g.equipment?.suit)||gear[0]||null;repairSelectedItemId=selected?.id||null;
 const old=document.getElementById('repairWorkshopOverlay');if(old)old.remove();
 const overlay=document.createElement('div');overlay.id='repairWorkshopOverlay';overlay.className='repair-overlay repair-pda-overlay';
 const damaged=gear.filter(x=>Number(x.condition??100)<100),total=damaged.reduce((sum,x)=>sum+repairCost(x,npc),0);
 const portrait=portraitMarkup(npc,true);
 const selectedCondition=selected?Math.max(0,Math.min(100,Number(selected.condition??100))):0;
 const selectedCost=selected?repairCost(selected,npc):0;
 const equippedWeapon=g.items.find(x=>x.name===g.equipment?.weapon&&x.type==='Оружие');
 const equippedArmor=g.items.find(x=>x.name===g.equipment?.suit&&x.type==='Броня');
 const equippedDetector=g.items.find(x=>x.name===g.equipment?.tool&&x.type==='Детектор');
 overlay.innerHTML=`<div class="repair-pda-shell"><header class="repair-pda-top"><div class="repair-tech-identity"><div class="repair-tech-portrait">${portrait}</div><div><b>${escapeHtml(npc.name)}</b><small>${escapeHtml(npc.faction||'Техническая служба')} · ТЕХНИК</small><button type="button" onclick="repairAllGear('${escapeHtml(npc.id)}')">РЕМОНТ ВСЕГО СНАРЯЖЕНИЯ</button></div></div><div class="repair-player-identity"><div><b>${escapeHtml(g.name||'Сталкер')}</b><small>${escapeHtml(g.faction||'Одиночки')} · ПОЛЕВОЙ СТАЛКЕР</small><strong>${Number(g.money||0).toLocaleString('ru-RU')} RU</strong></div><div class="repair-player-portrait">☻</div></div><button class="repair-close" aria-label="Закрыть мастерскую" onclick="document.getElementById('repairWorkshopOverlay')?.remove()">×</button></header><div class="repair-pda-grid"><section class="repair-pda-left"><div class="repair-pda-section-title">ЭКИПИРОВКА / ОБСЛУЖИВАНИЕ</div><div class="repair-armor-display"><div class="repair-armor-art">▤</div><b>${escapeHtml(equippedArmor?.name||'Броня не экипирована')}</b><small>${equippedArmor?Math.round(equippedArmor.condition??100)+'% прочности':'Слот брони пуст'}</small><button type="button" onclick="${equippedArmor?`selectRepairItem('${escapeHtml(npc.id)}','${escapeHtml(equippedArmor.id)}')`:'void(0)'}" ${equippedArmor?'':'disabled'}>ВЫБРАТЬ</button></div><div class="repair-equipment-slots"><div><small>ОСНОВНОЕ ОРУЖИЕ</small><b>${escapeHtml(equippedWeapon?.name||'Не установлено')}</b><span>${equippedWeapon?Math.round(equippedWeapon.condition??100)+'%':'—'}</span></div><div><small>ДЕТЕКТОР</small><b>${escapeHtml(equippedDetector?.name||'Не установлен')}</b><span>${equippedDetector?Math.round(equippedDetector.condition??100)+'%':'—'}</span></div><div><small>ВТОРОЕ ОРУЖИЕ</small><b>${escapeHtml(g.equipment?.sidearm||'Пусто')}</b><span>—</span></div><div><small>СЕРВИС</small><b>${damaged.length} предметов требуют ремонта</b><span>${total.toLocaleString('ru-RU')} RU</span></div></div><div class="repair-left-note">Техник: ${escapeHtml(npc.desc||'Мастерская группировки')}<br>Скидка: ${npc.id==='azot'?'8% · тариф Азота':npc.id.startsWith('faction-tech-')?'6% · тариф группировки':'по репутации'}</div></section><section class="repair-pda-center"><div class="repair-pda-section-title">ПЕРСОНАЛЬНОЕ СНАРЯЖЕНИЕ</div><div class="repair-character-silhouette"><div class="repair-mask-slot">◉<small>ШЛЕМ</small></div><div class="repair-body-slot">▤<small>${escapeHtml((g.equipment?.suit||'КОСТЮМ').toUpperCase())}</small></div><div class="repair-belt-slot">▣<small>ПОЯС / КПК</small></div></div><div class="repair-selected-card">${selected?`<div class="repair-selected-glyph">${itemGlyph(selected)}</div><div class="repair-selected-info"><small>ВЫБРАННЫЙ ПРЕДМЕТ</small><b>${escapeHtml(selected.name)}</b><span>${escapeHtml(selected.type)} · ${selectedCondition}% прочности</span><div class="repair-selected-meter"><i><em style="width:${selectedCondition}%"></em></i></div><strong>${selectedCondition>=100?'РЕМОНТ НЕ ТРЕБУЕТСЯ':selectedCost.toLocaleString('ru-RU')+' RU'}</strong></div>`:'<div class="repair-empty">Выбери предмет в рюкзаке справа.</div>'}</div><button class="repair-selected-action" onclick="${selected?`repairGearItem('${escapeHtml(npc.id)}','${escapeHtml(selected.id)}')`:'void(0)'}" ${!selected||selectedCondition>=100||Number(g.money||0)<selectedCost?'disabled':''}>ПОЧИНИТЬ ВЫБРАННЫЙ ПРЕДМЕТ</button><div class="repair-center-stats"><span>ПРЕДМЕТОВ В РЮКЗАКЕ <b>${gear.length}</b></span><span>ТРЕБУЮТ РЕМОНТА <b>${damaged.length}</b></span></div></section><section class="repair-pda-right"><div class="repair-pda-section-title">ИНВЕНТАРЬ СТАЛКЕРА <span>${gear.length} ПРЕДМ.</span></div><div class="repair-backpack-grid">${gear.map(x=>repairWorkshopItemCard(x,npc,selected?.id)).join('')||'<div class="repair-empty">В рюкзаке нет оружия, брони или детекторов.</div>'}</div><div class="repair-inventory-foot"><span>ВСЕГО ПРЕДМЕТОВ ДЛЯ РЕМОНТА: ${gear.length}</span><b>ОБЩИЙ ВЕС: ${(g.items||[]).reduce((sum,x)=>sum+(Number(x.weight)||0)*(Number(x.qty)||1),0).toFixed(1)} кг</b></div></section></div><footer class="repair-pda-footer"><span>ZONE ONLINE / ТЕХНИЧЕСКАЯ СЛУЖБА</span><span>РЕМОНТ ВОССТАНАВЛИВАЕТ ПРОЧНОСТЬ ДО 100%</span><button onclick="document.getElementById('repairWorkshopOverlay')?.remove()">ВЫХОД</button></footer></div>`;
 overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});document.body.append(overlay);
}
function selectRepairItem(npcId,itemId){repairSelectedItemId=itemId;openRepairWorkshop(npcId);}
function repairGearItem(npcId,itemId){
 const npc=npcBy(npcId),item=g.items.find(x=>x.id===itemId);if(!npc||!item)return;
 if(npc.loc!==g.loc)return alert('Техник должен находиться рядом.');
 if(npc.id.startsWith('faction-tech-')&&npc.faction!==g.faction)return alert('Ремонт доступен только у техника твоей группировки.');
 const cost=repairCost(item,npc);if(Number(item.condition??100)>=100)return alert('Предмет уже полностью исправен.');
 if((Number(g.money)||0)<cost)return alert(`Не хватает ${cost-(Number(g.money)||0)} RU.`);
 g.money-=cost;item.condition=100;log(`${npc.name} отремонтировал ${item.name} до 100%. Потрачено ${cost} RU.`);save();repairSelectedItemId=itemId;openRepairWorkshop(npcId);
}
function repairAllGear(npcId){
 const npc=npcBy(npcId);if(!npc)return;
 const gear=repairableGear().filter(x=>Number(x.condition??100)<100),total=gear.reduce((sum,x)=>sum+repairCost(x,npc),0);
 if(!gear.length)return alert('Всё снаряжение исправно.');
 if((Number(g.money)||0)<total)return alert(`Для полного ремонта нужно ${total.toLocaleString('ru-RU')} RU. Не хватает ${(total-(Number(g.money)||0)).toLocaleString('ru-RU')} RU.`);
 g.money-=total;for(const item of gear)item.condition=100;
 log(`${npc.name} полностью обслужил снаряжение. Отремонтировано предметов: ${gear.length}. Потрачено ${total} RU.`);save();repairSelectedItemId=null;openRepairWorkshop(npcId);
}
let lastNpcApproach=null;
function showNpcApproach(data){const n=npcBy(data?.npcId);if(!n)return;lastNpcApproach=data.npcId;const el=$('npcApproachFeed');if(!el)return;el.innerHTML=`<div class="npc-approach-card">${portraitMarkup(n)}<div><b>${escapeHtml(n.name)} подошёл к тебе</b><p>${escapeHtml(data.text||'Сталкер хочет поговорить.')}</p><button onclick="meet('${n.id}')">Поговорить</button></div></div>`;}
function squadAction(action,targetId){if(!zoneSocket?.connected)return alert('Для отряда требуется подключение к серверу.');zoneSocket.emit('squad:'+action,{targetId});}
function squadRole(memberId,role){zoneSocket?.emit('squad:role',{memberId,role});}
function squadEscort(npcId){zoneSocket?.emit('squad:escort',{npcId});}
function renderPlayerSquad(data){const el=$('playerSquadPanel');if(!el)return;const squad=data?.squad;if(!squad){activePlayerSquad=null;el.innerHTML=`<div class="mutedbox small">Ты пока не состоишь в отряде.</div><button onclick="squadAction('create')">Создать отряд</button>`;return;}activePlayerSquad=squad;const leader=squad.leader===zonePlayerId;const roles={leader:'Командир',scout:'Разведчик',medic:'Медик',rifleman:'Стрелок',technician:'Техник'};const members=squad.members.map(m=>`<div class="squad-member"><div><b>${escapeHtml(m.name)}</b><small>${escapeHtml(m.faction)} · ${roles[m.role]||'Стрелок'} ${m.id===squad.leader?' · ЛИДЕР':''}</small></div>${leader&&m.id!==squad.leader?`<select aria-label="Роль бойца" onchange="squadRole('${m.id}',this.value)"><option value="scout" ${m.role==='scout'?'selected':''}>Разведчик</option><option value="medic" ${m.role==='medic'?'selected':''}>Медик</option><option value="rifleman" ${m.role==='rifleman'?'selected':''}>Стрелок</option><option value="technician" ${m.role==='technician'?'selected':''}>Техник</option></select>`:''}</div>`).join('');const journal=(squad.journal||[]).slice(0,8).map(e=>`<div class="squad-log-entry"><small>${new Date(e.at).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</small> ${escapeHtml(e.text)}</div>`).join('')||'<small class="muted">Журнал пока пуст.</small>';const escort=squad.escortNpcId?`<div class="desc">Сопровождает NPC: ${escapeHtml(npcBy(squad.escortNpcId)?.name||squad.escortNpcId)}</div>`:'';const candidates=(g.npcs||[]).filter(n=>n.loc===g.loc&&n.alive!==false&&(n.faction===g.faction||Number(n.relationship||0)>=15)).slice(0,8);el.innerHTML=`<div class="item block"><div class="squad-heading"><b>Отряд «${escapeHtml(squad.name)}»</b><span class="tag">${squad.members.length}/4</span></div><div class="desc">${escapeHtml(locationName(squad.location))} · ${leader?'Ты командуешь':'Следуй за командиром'}</div>${members}${escort}${leader&&candidates.length?`<label class="small">Пригласить NPC в сопровождение</label><select id="squadEscortNpc" class="field">${candidates.map(n=>`<option value="${escapeHtml(n.id)}">${escapeHtml(n.name)} · ${escapeHtml(n.role||'сталкер')}</option>`).join('')}</select><button onclick="squadEscort(document.getElementById('squadEscortNpc').value)">Попросить сопровождать</button>`:''}<div class="section">Журнал отряда</div><div class="squad-journal">${journal}</div><button class="quiet-action" onclick="squadAction('leave')">Покинуть отряд</button></div>`;}
function friendRequest(targetId){if(!zoneSocket?.connected)return alert('Для добавления друзей требуется подключение к серверу.');zoneSocket.emit('friend:request',{targetId});}
function renderSquads(){const overview=$('squadOverview');if(overview){const squad=activePlayerSquad;overview.innerHTML=squad?`<div class="squad-overview-card"><b>Отряд «${escapeHtml(squad.name)}»</b><span>${squad.members?.length||0}/4 бойцов · ${escapeHtml(locationName(squad.location))}</span></div>`:'<div class="mutedbox small">Ты пока не состоишь в отряде. Создай группу или прими приглашение от другого сталкера.</div>';}const list=$('localNpcSquads');if(list){const buckets=new Map();for(const n of (g.npcs||[]).filter(n=>n.loc===g.loc&&n.alive!==false)){const key=n.squadId||`solo:${n.id}`;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(n);}list.innerHTML=[...buckets.values()].map(m=>`<div class="item"><div><b>${escapeHtml(m[0].squadName||m[0].name||'Группа сталкеров')}</b><div class="desc">${m.length} бойца · ${escapeHtml(m[0].faction||'Нейтралы')}</div></div><span class="tag">${escapeHtml(m[0].behavior||m[0].action||'на месте')}</span></div>`).join('')||'<div class="mutedbox small">В этом секторе пока не замечено групп.</div>';}}
function renderPlayerFriends(list=[]){const el=$('playerFriendsPanel');if(!el)return;el.innerHTML=(list||[]).map(f=>`<div class="small">★ ${escapeHtml(f.name)} · ${escapeHtml(f.faction||'Сталкер')}</div>`).join('')||'<div class="mutedbox small">Пока нет друзей в Зоне.</div>'; }

function renderQuick(){$("quickNpc").innerHTML=nearbyNpcs().slice(0,3).map(n=>`<div class="item" style="padding:7px;margin-bottom:6px"><span>${n.icon} ${n.name}</span><button onclick="meet('${n.id}')">Встреча</button></div>`).join("")||'<span class="muted small">Поблизости никого не видно.</span>'}
function travel(id){zoneMapDirty=true;let l=g.locations.find(x=>x.id===id);if(!l||id===g.loc)return;if(activePlayerSquad&&activePlayerSquad.leader!==zonePlayerId)return alert('Отрядом командует лидер. Попроси его сменить маршрут или покинь отряд.');let cost=l.travel;if(g.stamina<cost*5)return alert("Недостаточно выносливости. Отдохни у костра.");consumeExpeditionSupplies(Math.min(100,25+cost*8));g.loc=id;g.worldPosition={x:sectorCenter(id)[0],y:sectorCenter(id)[1]+24};activeNpc=null;log("Переход: "+l.name+".");news("Сталкер прибыл",g.name+" прибыл в район «"+l.name+"».");if(Math.random()<.35){let event=["По дороге ты заметил следы недавнего лагеря.","На маршруте встретилась небольшая группа сталкеров.","Погода изменилась, путь занял больше времени."][Math.floor(Math.random()*3)];log(event);news("Событие в пути",event)}render();mpSyncLocation();view("world")}
function renderMap(){if((($("world")?.classList.contains("active")||!zoneMapHasRendered)&&zoneMapDirty))renderZoneMap();$("map").innerHTML=g.locations.map(l=>`<button class="loc ${chosenLoc===l.id?"selected":""}" onclick="selectLocation('${l.id}')"><b>${l.icon} ${l.name}</b><span class="owner">${l.owner}</span><span class="risk">Опасность: ${l.risk} · Расход сил: ${(l.travel||0)*5}%</span>${l.id===g.loc?'<span class="tag">Вы здесь</span>':""}</button>`).join("")}
function selectLocation(id){
 chosenLoc=id;let l=g.locations.find(x=>x.id===id),pts=g.keyPoints?.[id]||[];
 $("locationInfo").innerHTML=`<b>${l.icon} ${l.name}</b> <span class="tag">${l.owner}</span><p class="muted small">${l.desc}</p><div class="small">Контроль: ${l.control}% · Уровень риска: ${l.risk}</div><div class="bar"><i style="width:${l.control}%"></i></div><div class="rightbuttons" style="margin-top:10px">${id===g.loc?'<span class="tag">Текущая локация</span>':`<button onclick="travel('${id}')">Отправиться · ${l.travel} ч.</button>`}<button onclick="influence('${id}')" ${l.owner===g.faction?"disabled":""}>Повысить влияние · 120 ₽</button></div><div class="section">Ключевые точки сектора</div><div class="poi-list">${pts.map(p=>`<div class="poi ${p.discovered?"discovered":""}"><b>${p.discovered?"✓":"⌖"} ${p.name}</b><span class="poi-marker">${p.kind}</span><small>${p.discovered?p.desc:"Сведения отсутствуют"}</small>${id===g.loc&&!p.discovered?`<div style="margin-top:7px"><button onclick="discoverPoint('${p.id}')">Исследовать</button></div>`:""}</div>`).join("")}</div>`;
 renderMap();
}
function explore(){startAreaSurvey()}
function searchAnomaly(){searchArtifacts()}
function rest(){g.stamina=Math.min(100,g.stamina+(g.hunger>85||g.thirst>85?12:35));g.hp=Math.min(100,g.hp+5);log("Ты отдохнул у костра. Силы частично восстановлены.");save()}
function roamNPCs(){if(Math.random()>.32)return;let candidates=g.npcs.filter(n=>n.id.startsWith("wander_")&&n.loc!==g.loc);if(!candidates.length)return;let n=candidates[Math.floor(Math.random()*candidates.length)],from=g.locations.find(l=>l.id===n.loc),dest=g.locations[Math.floor(Math.random()*g.locations.length)];if(!from||!dest||from.id===dest.id)return;from.people=from.people.filter(id=>id!==n.id);dest.people.push(n.id);n.loc=dest.id;news("Сталкеры в пути",n.name+" замечен в районе «"+dest.name+"». ");log("Слухи: сталкер "+n.name+" сменил район.")}
function renderQuests(){let qs=g.quests.filter(q=>questFilter==="all"||(questFilter==="active"&&q.accepted&&!q.done)||(questFilter==="done"&&q.done));$("questList").innerHTML=qs.map(q=>{const giver=(g.npcs||[]).find(n=>n.name===q.giver);const art=giver?portraitMarkup(giver):`<div class="quest-portrait-fallback">▣</div>`;return `<article class="item block quest-card"><div class="quest-card-main">${art}<div class="quest-card-copy"><div class="quest-card-title"><b>${escapeHtml(q.title)}</b><span class="tag ${q.done?'quest-done':''}">${q.done?"Завершено":q.accepted?"Активно":"Не принято"}</span></div><div class="desc">Выдал: ${escapeHtml(q.giver)} · Награда: ${q.reward} ₽ · ${q.xp} опыта</div>${q.chapter?`<div class="small gold">${escapeHtml(q.chapter)}</div>`:""}<p class="small">${escapeHtml(q.desc)}</p>${q.accepted&&!q.done?`<div class="rightbuttons"><button onclick="turnIn('${q.id}')">Проверить выполнение</button></div>`:!q.done?`<button onclick="acceptQuest('${q.id}')">Принять задание</button>`:""}</div></div></article>`}).join("")||'<div class="mutedbox">Здесь пока пусто.</div>'}
function acceptQuest(id){let q=g.quests.find(x=>x.id===id);if(!q)return;q.accepted=true;log("Принято задание: "+q.title);news("Новое задание",q.title);save()}
function turnIn(id){let q=g.quests.find(x=>x.id===id);if(!q||!q.accepted||q.done)return;let ok=false;
 const found=(loc,part)=>!!g.keyPoints?.[loc]?.some(p=>p.id===part&&p.discovered);
 const storyChecks={
 story_swamp_signal:()=>g.storyFlags.metLebedev&&found("swamps","swamps_extra_0"),
 story_swamp_relay:()=>g.storyFlags.metNovikov&&found("swamps","swamps_extra_3"),
 story_yantar_echo:()=>g.storyFlags.metSakharov&&found("yantar","yantar_extra_0"),
 story_north_route:()=>g.storyFlags.metBeard&&found("jupiter","jupiter_extra_3")&&found("radar","radar_extra_1"),
 story_pripyat_archive:()=>g.storyFlags.metArchivist&&found("pripyat","pripyat_extra_3")
 };
 if(storyChecks[id])ok=storyChecks[id]();if(id==="intro")ok=g.flags.metWolf;if(id==="scrap")ok=count("scrap")>=3;if(id==="bread")ok=count("bread")>=2;if(id==="rumors")ok=g.flags.metWolf&&g.flags.heardBar&&g.flags.metScout&&g.flags.metProf;if(id==="research")ok=g.flags.foundArtifact;if(!ok){alert("Пока условия задания не выполнены. Проверь описание и поговори с нужными персонажами.");return}if(id==="scrap")take("scrap",3);if(id==="bread")take("bread",2);q.done=true;g.money+=q.reward;g.xp+=q.xp;g.rep+=q.rep;g.completed++;log("Задание выполнено: "+q.title+". Получено "+q.reward+" ₽.");news("Задание выполнено",q.title+" — награда начислена.");save()}
function tradeGoods(){return [
 ["Антирад","anti_rad","Медицина",180,.1,"Снижает радиацию и защищает от нового заражения."],["Аптечка","med","Медицина",180,.4,"Восстанавливает здоровье."],["Хлеб","bread","Еда",45,.3,"Небольшой перекус."],["Бинт","bandage","Медицина",70,.2,"Полевой расходный предмет."],["Металлолом","scrap","Материал",55,.8,"Материал для ремесла."],["Болты ×5","bolt","Инструмент",40,.1,"Набор болтов."],["Консервы","canned","Еда",95,.45,"Сытный полевой паёк."],["Колбаса","sausage","Еда",75,.25,"Еда в дорогу."],["Сгущённое молоко","condensed","Еда",85,.38,"Сладкий запас энергии."],["Бутылка воды","water","Еда",40,.5,"Питьевая вода."],["Термос чая","tea","Еда",55,.35,"Тёплый напиток."],["Сухой паёк","ration","Еда",130,.55,"Компактный набор продуктов."],
 ["Медуза","artifact_medusa","Артефакт",760,.6,"Стабильный артефакт. Востребован у перекупщиков."],["Каменный цветок","artifact_flower","Артефакт",1850,.8,"Редкая находка с высокой исследовательской ценностью."],["Пустышка","artifact_dummy","Артефакт",1120,.5,"Небольшой артефакт с нестабильными свойствами."],["Ломоть мяса","artifact_meat","Артефакт",940,.7,"Органический объект неизвестного происхождения."],["Вспышка","artifact_flash","Артефакт",2450,.4,"Энергетически активный артефакт."],["Ночная звезда","artifact_nightstar","Артефакт",3200,1.1,"Редкий объект, который высоко ценят коллекционеры."],["Душа","artifact_soul","Артефакт",4100,.9,"Редкий органический артефакт."],["Золотая рыбка","artifact_goldfish","Артефакт",5200,1.4,"Ценный артефакт с необычной структурой."],
 ["Кожаная куртка с пластинами","armor_leather","Броня",520,.7,"Лёгкая защита для первых вылазок."],["Комбинезон сталкера М-2","armor_stalker","Броня",1850,1.1,"Практичный полевой костюм."],["Заря","armor_zarya","Броня",3850,1.5,"Усиленный комбинезон с хорошей защитой."],["СЕВА","armor_seva","Броня",9200,2.2,"Герметичный научно-полевой костюм."],["Булат","armor_bulat","Броня",14800,3.4,"Тяжёлый бронекостюм для опасных маршрутов."],["Экзоскелет","armor_exo","Броня",24500,5.2,"Тяжёлая силовая система защиты."]
]}
function buy(i){let x=tradeGoods()[i];if(!x)return;if(g.money<x[3])return alert("Не хватает рублей.");if(zoneSocket?.connected){zoneSocket.emit('market:buy',{item:x[1]});return;}g.money-=x[3];const gear=x[2]==="Броня"?{condition:100,defense:({armor_leather:2,armor_stalker:3,armor_zarya:5,armor_seva:7,armor_bulat:9,armor_exo:11})[x[1]]||2}:{};addItem(x[1],x[0],x[2],x[5],x[4],Math.floor(x[1]==="bolt"?5:1));Object.assign(g.items.find(z=>z.id===x[1]),gear);log("Куплено: "+x[0]+".");save()}

function sell(id,amount=1){let x=g.items.find(i=>i.id===id);if(!x)return;amount=Math.max(1,Math.min(x.qty,Math.floor(Number(amount)||1)));if(zoneSocket?.connected){if(amount!==1)return alert("В онлайн-режиме продавай предметы по одной единице за операцию.");zoneSocket.emit('market:sell',{item:id,qty:amount});return;}x.qty-=amount;const payout=Math.floor(x.value*.65)*amount;g.money+=payout;if(x.qty<=0)g.items=g.items.filter(i=>i.id!==id);log("Продано: "+x.name+" ×"+amount+" · +"+payout+" ₽.");save()}
function useItem(id){let x=g.items.find(i=>i.id===id);if(!x)return;const nutrition=window.ZONE_CONTENT?.foods?.[id];if(nutrition){g.hunger=Math.max(0,g.hunger-(nutrition.satiety||0));g.thirst=Math.max(0,g.thirst-(nutrition.hydration||0));g.stamina=Math.min(100,g.stamina+(nutrition.stamina||0));take(id,1);log("Использован припас: "+x.name+". Голод и жажда уменьшились.");save();return;}if(id==="anti_rad"){g.radiation=Math.max(0,(g.radiation||0)-65);g.radiationProtectionUntil=Date.now()+12*60*1000;take(id,1);log("Антирад принят: уровень радиации снижен, защита действует 12 минут.");save();return;}if(id==="med"){if(g.hp>=100)return alert("Здоровье уже полное.");g.hp=Math.min(100,g.hp+35);take(id,1)}else if(id==="bandage"){g.hp=Math.min(100,g.hp+15);take(id,1)}else if(id==="bread"){g.stamina=Math.min(100,g.stamina+20);take(id,1)}else return alert("Этот предмет нельзя использовать напрямую.");log("Использован предмет: "+x.name+".");save()}
function itemGlyph(x){
 const kind=x.type==='Оружие'?'weapon':x.type==='Броня'?'armor':x.type==='Медицина'?'med':x.type==='Еда'?'food':x.type==='Артефакт'?'artifact':x.type==='Детектор'?'detector':'tool';
 const shapes={weapon:'<path d="M9 25h40v-7H34l-4-7H18l-2 7H9z"/><path d="M23 25v13h9V25M39 18v-5h7v5"/>',armor:'<path d="M18 8l12 5 12-5 9 10-7 7-4-4v20H20V21l-4 4-7-7z"/>',med:'<rect x="10" y="14" width="40" height="26" rx="3"/><path d="M27 18h7v7h7v7h-7v7h-7v-7h-7v-7h7z"/>',food:'<path d="M12 28c0-10 8-17 18-17s18 7 18 17-8 13-18 13-18-3-18-13z"/><path d="M20 26h20M22 33h16"/>',artifact:'<path d="M30 5l8 12 12 7-8 13-12 8-12-8-8-13 12-7z"/><circle cx="30" cy="27" r="6"/>',detector:'<rect x="14" y="10" width="32" height="38" rx="4"/><circle cx="30" cy="25" r="9"/><path d="M30 25l7-5M22 40h16"/>',tool:'<path d="M12 15l9-9 10 10-9 9zM26 24l20 20-6 6-20-20M35 11l9-5 8 8-5 9"/>'};
 return `<svg viewBox="0 0 60 56" width="42" height="40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${shapes[kind]}</svg>`;
}
function equipItem(id){let x=g.items.find(i=>i.id===id);if(!x)return;if(x.type==="Оружие")g.equipment.weapon=x.name;else if(x.type==="Броня")g.equipment.suit=x.name;else if(x.type==="Детектор")g.equipment.tool=x.name;else return alert("Этот предмет нельзя экипировать.");log("Экипировано: "+x.name);save()}
function rankForXpClient(xp){const ranks=[[0,'Новичок'],[50,'Опытный сталкер'],[150,'Следопыт'],[300,'Ветеран Зоны'],[600,'Легенда Зоны']];return ranks.filter(x=>Number(xp||0)>=x[0]).at(-1)?.[1]||'Новичок'}
function renderInventory(){
 const query=($("invSearch")?.value||"").toLowerCase(),filter=$("invFilter")?.value||"all",sort=$("invSort")?.value||"name";
 let items=g.items.filter(x=>(filter==="all"||x.type===filter)&&x.name.toLowerCase().includes(query));
 items.sort((a,b)=>sort==="value"?b.value-a.value:sort==="weight"?b.weight-a.weight:sort==="type"?a.type.localeCompare(b.type,"ru"):a.name.localeCompare(b.name,"ru"));
 const equipped=x=>Object.values(g.equipment||{}).includes(x.name);
 const itemCard=x=>`<button class="backpack-item ${equipped(x)?'is-equipped':''}" onclick="inspectInventoryItem('${x.id}')" title="${escapeHtml(x.name)} · ${escapeHtml(x.type)}"><span class="backpack-qty">${x.qty>1?'×'+x.qty:''}</span><span class="backpack-art">${itemGlyph(x)}</span><span class="backpack-name">${escapeHtml(x.name)}</span>${x.condition!=null?`<span class="backpack-condition"><i style="width:${x.condition}%"></i></span>`:''}</button>`;
 const cells=items.map(itemCard);while(cells.length<48)cells.push('<div class="backpack-empty" aria-hidden="true"></div>');
 $("items").innerHTML=cells.join("")||'<div class="mutedbox">Рюкзак пуст.</div>';
 const weight=g.items.reduce((a,x)=>a+x.weight*x.qty,0),count=g.items.reduce((a,x)=>a+x.qty,0);
 $("weight").textContent=weight.toFixed(1)+" кг";$("itemCount").textContent=count;
 $("inventoryMoney").textContent=(g.money||0).toLocaleString('ru-RU')+' RU';
 $("inventoryOwner").textContent=escapeHtml(g.name||'СТАЛКЕР');$("gearCallsign").textContent=escapeHtml((g.name||'СТАЛКЕР').toUpperCase());$("inventoryRank").textContent=rankForXpClient(g.xp).toUpperCase();$("inventoryFaction").textContent=(g.faction||'ОДИНОЧКИ').toUpperCase();
 $("gearWeapon").textContent=g.equipment.weapon||'НЕ УСТАНОВЛЕНО';$("gearTool").textContent=g.equipment.tool||'НЕТ';$("gearSuit").textContent=(g.equipment.suit||'КОСТЮМ НЕ УСТАНОВЛЕН').toUpperCase();
 const sidearm=g.items.find(x=>x.type==='Оружие'&&x.name!==g.equipment.weapon);$("gearSidearm").textContent=sidearm?.name||'ПУСТО';
 const artifact=g.items.find(x=>x.type==='Артефакт');$("gearArtifact").textContent=artifact?.name||'ПУСТО';
 $("gearLoadMeter").style.width=Math.min(100,weight/50*100)+'%';$("gearWeight").textContent=weight.toFixed(1)+' / 50.0 KG';
 const suit=g.items.find(x=>x.name===g.equipment?.suit&&x.type==='Броня');
 const weapon=g.items.find(x=>x.name===g.equipment?.weapon&&x.type==='Оружие');
 const stat=(label,value)=>`<div><span>${label}</span><b>${value}</b></div>`;
 $("gearStats").innerHTML=stat('Защита костюма',suit?.defense||0)+stat('Состояние',suit?(suit.condition??100)+'%':'—')+stat('Урон оружия',weapon?.damage||'—')+stat('Вес комплекта',weight.toFixed(1)+' кг');
 $("equipment").innerHTML=`<div>Костюм · ${escapeHtml(g.equipment.suit||"Не установлено")}</div><div>Оружие · ${escapeHtml(g.equipment.weapon||"Не установлено")}</div><div>Детектор · ${escapeHtml(g.equipment.tool||"Не установлено")}</div>`;
}
function inspectInventoryItem(id){const x=g.items.find(i=>i.id===id);if(!x)return;const actions=[];if(['Медицина','Еда'].includes(x.type))actions.push(`<button onclick="useItem('${x.id}')">Применить</button>`);if(['Оружие','Броня','Детектор'].includes(x.type))actions.push(`<button onclick="equipItem('${x.id}')">${Object.values(g.equipment||{}).includes(x.name)?'Экипировано':'Экипировать'}</button>`);actions.push(`<button class="quiet-action" onclick="sell('${x.id}')">Продать · ${Math.floor(x.value*.65)} ₽</button>`);const panel=document.createElement('div');panel.className='inventory-inspect';panel.innerHTML=`<div class="inventory-inspect-card"><button class="inspect-close" onclick="this.closest('.inventory-inspect').remove()">×</button><div class="inspect-art">${itemGlyph(x)}</div><b>${escapeHtml(x.name)}</b><small>${escapeHtml(x.type)} · ${x.weight} кг · ×${x.qty}</small>${x.condition!=null?`<div class="inspect-condition"><span>Прочность</span><b>${Math.round(x.condition)}%</b><i><em style="width:${Math.max(0,Math.min(100,Number(x.condition)||0))}%"></em></i></div>`:''}<p>${escapeHtml(x.desc||'Полевой предмет.')}</p><strong>${x.value} ₽</strong><div class="rightbuttons">${actions.join('')}</div></div>`;panel.addEventListener('click',e=>{if(e.target===panel)panel.remove()});document.body.append(panel)}

let tradeCategory='all';
function setTradeCategory(category){tradeCategory=category;renderTrade()}

let tradeBasket={buy:{},sell:{}};
function tradeAllowDrop(ev){ev.preventDefault();ev.dataTransfer.dropEffect='copy';}
function tradeDragStart(ev,side,key){ev.dataTransfer.setData('application/x-zone-trade',JSON.stringify({side,key:String(key)}));ev.dataTransfer.effectAllowed='copy';}
function tradeDrop(ev,target){ev.preventDefault();let raw=ev.dataTransfer.getData('application/x-zone-trade');try{const d=JSON.parse(raw);if(d.side===target)addTradeBasket(target,d.key);}catch(_){}}
function addTradeBasket(side,key){
 const bucket=tradeBasket[side];
 let next=(Number(bucket[key])||0)+1;
 if(side==='sell'){const item=g.items.find(x=>x.id===key);next=Math.min(next,Number(item?.qty)||0);if(!next)return;}
 else next=Math.min(next,20);
 bucket[key]=next;renderTrade();
}
function removeTradeBasket(side,key){delete tradeBasket[side][key];renderTrade();}
function clearTradeBasket(){tradeBasket={buy:{},sell:{}};renderTrade();}
function tradeBasketTotals(){
 const goods=tradeGoods();let buy=0,sell=0;
 Object.entries(tradeBasket.buy).forEach(([i,q])=>{const x=goods[Number(i)];if(x)buy+=x[3]*q;});
 Object.entries(tradeBasket.sell).forEach(([id,q])=>{const x=g.items.find(v=>v.id===id);if(x)sell+=Math.floor(x.value*.65)*q;});
 return {buy,sell,net:buy-sell};
}
function renderTradeBasket(){
 const goods=tradeGoods(),buyEl=$('tradeBuyBasket'),sellEl=$('tradeSellBasket');
 if(buyEl)buyEl.innerHTML=Object.entries(tradeBasket.buy).map(([i,q])=>{const x=goods[Number(i)];return x?`<div class="trade-basket-entry"><span>${escapeHtml(x[0])} ×${q}</span><b>${(x[3]*q).toLocaleString('ru-RU')} RU</b><button onclick="removeTradeBasket('buy','${i}')">×</button></div>`:''}).join('')||'Перетащи сюда товары торговца';
 if(sellEl)sellEl.innerHTML=Object.entries(tradeBasket.sell).map(([id,q])=>{const x=g.items.find(v=>v.id===id);return x?`<div class="trade-basket-entry"><span>${escapeHtml(x.name)} ×${q}</span><b>${(Math.floor(x.value*.65)*q).toLocaleString('ru-RU')} RU</b><button onclick="removeTradeBasket('sell','${escapeHtml(id)}')">×</button></div>`:''}).join('')||'Перетащи сюда свои предметы';
 const totals=tradeBasketTotals(),status=$('tradeBasketStatus');
 if(status)status.textContent=`Покупка ${totals.buy.toLocaleString('ru-RU')} RU · продажа ${totals.sell.toLocaleString('ru-RU')} RU · ${totals.net>0?'к оплате '+totals.net.toLocaleString('ru-RU')+' RU':totals.net<0?'получишь '+Math.abs(totals.net).toLocaleString('ru-RU')+' RU':'без доплаты'}`;
}
function commitTradeBasket(){
 const buy=Object.entries(tradeBasket.buy).map(([i,qty])=>({item:tradeGoods()[Number(i)]?.[1],qty})).filter(x=>x.item);
 const sell=Object.entries(tradeBasket.sell).map(([item,qty])=>({item,qty}));
 if(!buy.length&&!sell.length)return alert('Добавь предметы в корзину сделки.');
 const totals=tradeBasketTotals();
 if(!zoneSocket?.connected){
  if(g.money<totals.buy)return alert('Недостаточно рублей для этой сделки.');
  for(const x of sell){const item=g.items.find(v=>v.id===x.item);if(!item||item.qty<x.qty)return alert('Количество предметов в рюкзаке изменилось. Обнови корзину.');}
  g.money-=totals.buy;
  for(const x of buy){const item=tradeGoods().find(v=>v[1]===x.item);if(!item)continue;const gear=item[2]==='Броня'?{condition:100,defense:({armor_leather:2,armor_stalker:3,armor_zarya:5,armor_seva:7,armor_bulat:9,armor_exo:11})[item[1]]||2}:{};addItem(item[1],item[0],item[2],item[5],item[4],x.qty);Object.assign(g.items.find(v=>v.id===item[1])||{},gear);}
  for(const x of sell){const item=g.items.find(v=>v.id===x.item);const payout=Math.floor(item.value*.65)*x.qty;item.qty-=x.qty;g.money+=payout;if(item.qty<=0)g.items=g.items.filter(v=>v.id!==x.item);}
  log(`Сделка завершена: покупка ${totals.buy} RU, продажа ${totals.sell} RU.`);clearTradeBasket();save();renderTrade();return;
 }
 zoneSocket.emit('market:deal',{buy,sell});
}
function renderTrade(){
 const trader=g.loc==="cordon"?"Сидорович":g.loc==="bar"?"Бармен":"Полевой обмен";
 const traderRole=g.loc==="cordon"?"Торговец · Одиночки":g.loc==="bar"?"Бармен · Нейтрал":"Снабжение сектора";
 const name=$('traderName');if(name)name.textContent=trader;
 const role=$('tradeTraderRole');if(role)role.textContent=traderRole;
 const place=$('traderPlace');if(place)place.textContent=here().name+" · ассортимент зависит от поставок";
 const portrait=$('traderPortrait');if(portrait){portrait.src=g.loc==="cordon"?"/assets/portraits/stalker-03.webp":g.loc==="bar"?"/assets/portraits/stalker-08.webp":"/assets/portraits/stalker-12.webp";portrait.alt="Портрет: "+trader;}
 const playerName=$('tradePlayerName');if(playerName)playerName.textContent=g.name||'Сталкер';
 const balanceText=(Number(g.money)||0).toLocaleString('ru-RU')+' RU';
 ['tradePlayerBalance','tradeBalance','tradeFooterBalance'].forEach(id=>{const el=$(id);if(el)el.textContent=balanceText;});
 const query=($('tradeSearch')?.value||'').trim().toLocaleLowerCase('ru-RU');
 const goods=tradeGoods().map((x,i)=>({...x,index:i})).filter(x=>(tradeCategory==='all'||(tradeCategory==='gear'?['Броня','Артефакт'].includes(x[2]):tradeCategory===x[2]))&&(!query||x[0].toLocaleLowerCase('ru-RU').includes(query)||x[2].toLocaleLowerCase('ru-RU').includes(query)));
 const shop=$('shop');if(shop)shop.innerHTML=goods.map(x=>`<article class="trade-item-card" draggable="true" ondragstart="tradeDragStart(event,'buy','${x.index}')"><div class="trade-item-art ${x[2]==='Броня'?'armor-art':x[2]==='Артефакт'?'artifact-art':''}">${itemGlyph({type:x[2]})}</div><div class="trade-item-copy"><b>${escapeHtml(x[0])}</b><small>${escapeHtml(x[2])} · ${x[4]} кг</small><span>${escapeHtml(x[5])}</span></div><div class="trade-item-action"><b>${x[3].toLocaleString('ru-RU')} RU</b><button onclick="addTradeBasket('buy','${x.index}')">В сделку</button></div></article>`).join('')||'<div class="mutedbox">В этой категории нет товаров.</div>';
 const owned=(g.items||[]).filter(x=>x.qty>0&&(!query||x.name.toLocaleLowerCase('ru-RU').includes(query)||x.type.toLocaleLowerCase('ru-RU').includes(query)));
 const sell=$('sellList');if(sell)sell.innerHTML=owned.map(x=>`<article class="trade-item-card" draggable="true" ondragstart="tradeDragStart(event,'sell','${escapeHtml(x.id)}')"><div class="trade-item-art">${itemGlyph(x)}</div><div class="trade-item-copy"><b>${escapeHtml(x.name)}</b><small>${escapeHtml(x.type)} · ×${x.qty} · ${x.weight} кг</small><span>Цена скупки: ${Math.floor(x.value*.65).toLocaleString('ru-RU')} RU / шт.</span></div><div class="trade-item-action"><b>${(Math.floor(x.value*.65)*x.qty).toLocaleString('ru-RU')} RU</b><button class="sell-trade-button" onclick="addTradeBasket('sell','${escapeHtml(x.id)}')">В сделку · Продать 1</button></div></article>`).join('')||'<div class="mutedbox">В рюкзаке пока нечего продавать.</div>';
 const weight=owned.reduce((sum,x)=>sum+(Number(x.weight)||0)*(Number(x.qty)||0),0);const weightEl=$('tradePlayerWeight');if(weightEl)weightEl.textContent=weight.toFixed(1)+' / 50.0 кг';
 const stockCount=$('tradeStockCount');if(stockCount)stockCount.textContent=goods.length+' позиций';
 const weapon=$('tradeWeapon');if(weapon)weapon.textContent=g.equipment?.weapon||'Не экипировано';const armor=$('tradeArmor');if(armor)armor.textContent=g.equipment?.suit||'Не экипировано';
 const quick=$('tradeQuickSlots');if(quick)quick.innerHTML=['Медицина','Еда','Артефакт','Детектор'].map((type,i)=>{const item=(g.items||[]).find(x=>x.type===type&&x.qty>0);return `<div class="trade-quick-slot">${item?itemGlyph(item):['✚','◒','✧','◉'][i]}<small>${item?escapeHtml(item.name):['Аптечка','Провизия','Артефакт','Детектор'][i]}</small></div>`}).join('');
 const stats=$('tradeStats');if(stats)stats.innerHTML=`<span>ЗДОРОВЬЕ <b>${Math.round(g.hp||0)}%</b></span><span>РАДИАЦИЯ <b>${Math.round(radiationLevel())}%</b></span><span>РЕПУТАЦИЯ <b>${g.rep||0}</b></span><span>ВЕС <b>${weight.toFixed(1)} кг</b></span>`;
 const totals=tradeBasketTotals();
 [['tradeSellValue',totals.sell],['tradeSellTotal',totals.sell],['tradeBuyValue',totals.buy],['tradeBuyTotal',totals.buy]].forEach(([id,value])=>{const el=$(id);if(el)el.textContent=value.toLocaleString('ru-RU')+' RU';});
 document.querySelectorAll('[data-trade-cat]').forEach(btn=>btn.classList.toggle('active',btn.dataset.tradeCat===tradeCategory));
 renderTradeBasket();
}

function influence(id){let l=g.locations.find(x=>x.id===id);if(!l||l.owner===g.faction)return;if(g.money<120)return alert("Недостаточно рублей.");g.money-=120;l.control=Math.min(100,l.control+15);if(l.control>=95){let old=l.owner;l.owner=g.faction;l.control=50;let f=g.factions.find(x=>x.name===old),m=g.factions.find(x=>x.name===g.faction);if(f)f.territories=Math.max(0,f.territories-1);if(m)m.territories++;log("Группировка "+g.faction+" установила влияние в районе "+l.name+".");news("Изменение контроля","Группировка "+g.faction+" усилила позиции в районе "+l.name+".")}else log("Влияние в районе "+l.name+" выросло до "+l.control+"%.");save();selectLocation(id)}
function factionIconMarkup(name){const map={'Одиночки':'loners','Долг':'duty','Свобода':'freedom','Бандиты':'bandits','Военные':'military','Учёные':'scientists','Наёмники':'mercenaries','Монолит':'monolith','Чистое небо':'clear-sky'};const slug=map[name]||'loners';return `<img class="faction-icon" src="/assets/factions/${slug}.svg" alt="Эмблема ${escapeHtml(name||'группировки')}" loading="lazy">`; }
let factionTab="overview",overviewRival="";
function setFactionTab(tab){factionTab=tab;document.querySelectorAll("[data-faction-tab]").forEach(b=>b.classList.toggle("active",b.dataset.factionTab===tab));document.querySelectorAll(".faction-tab-panel").forEach(p=>p.classList.toggle("active",p.id==={overview:"factionTabOverview",relations:"factionTabRelations",talks:"factionTabTalks"}[tab]));if(tab==="relations"||tab==="talks")renderDiplomacy()}
function renderFactions(){
 $("factionList").innerHTML=g.factions.map(f=>`<div class="item block"><div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;gap:9px;align-items:center"><span class="faction-emblem">${factionIconMarkup(f.name)}</span><b>${f.name}</b></div><span class="tag">${f.territories} террит.</span></div><div class="desc">${f.style} · ${f.members} участников</div><div class="small">Влияние ${f.influence}%</div><div class="bar"><i style="width:${f.influence}%"></i></div></div>`).join("");
 $("factionLeaders").innerHTML=g.factions.map(f=>{const x=f.leader||{name:"Неизвестно",title:"Нет единого лидера",canon:"",bio:""};return `<div class="leader-card"><div class="eyebrow">${escapeHtml(f.name)}</div><b>${escapeHtml(x.name)}</b><div class="desc">${escapeHtml(x.title)}</div><p class="small">${escapeHtml(x.bio)}</p><small class="muted">${escapeHtml(x.canon)}</small></div>`}).join("");
 $("relations").innerHTML=g.factions.filter(f=>f.name!==g.faction).map(f=>{const v=factionRelationValue(g.faction,f.name);const label=v<=-25?"Враждебность":v>=25?"Сотрудничество":"Нейтралитет";return `<div class="item"><span>${escapeHtml(f.name)} <small class="muted">· ${label}</small></span><b class="${v<0?'red':'gold'}">${v>0?"+":""}${v}</b></div>`}).join("");
}
function renderArchive(){
 const timeline=window.ZONE_CONTENT?.timeline||[];
 $("timelineList").innerHTML=timeline.map(x=>`<div class="timeline-entry"><span class="tag">${escapeHtml(x.era)}</span><b>${escapeHtml(x.title)}</b><p class="small">${escapeHtml(x.text)}</p></div>`).join("");
 const qs=(window.ZONE_CONTENT?.storyQuests||[]);
 $("storyCampaign").innerHTML=qs.map(q=>{const state=g.quests.find(x=>x.id===q.id);return `<div class="item block"><div class="eyebrow">${escapeHtml(q.chapter)}</div><b>${escapeHtml(q.title)}</b><div class="desc">Выдал: ${escapeHtml(q.giver)} · ${q.reward} ₽ · ${q.xp} опыта</div><p class="small">${escapeHtml(q.desc)}</p><span class="tag">${state?.done?'Завершено':state?.accepted?'Активно':'Ожидает контакта'}</span></div>`}).join("");
}
let zoneMapZoom=1,zoneMapMode='zone',walkTimer=null,walkTarget=null,lastPositionSync=0,pendingSectorExit=null,zoneMapHasRendered=false,zoneMapDirty=true;
let playerFacing='down',playerMoving=false,playerFrame=0,playerMoveTarget=null;
// Collision rectangles are editable world-space bounds (1000 x 2000). These first-pass
// blockers cover the clearest large structures visible on the supplied satellite map.
const WORLD_OBSTACLES=[
 {x:305,y:22,w:330,h:132,name:'Северный промышленный комплекс'},
 {x:835,y:175,w:105,h:115,name:'Восточный промышленный комплекс'},
 {x:462,y:730,w:62,h:76,name:'Центральный объект'},
 {x:690,y:780,w:142,h:105,name:'Восточная застройка'},
 {x:42,y:758,w:112,h:88,name:'Западная застройка'},
 {x:120,y:1190,w:82,h:78,name:'Юго-западный объект'},
 {x:340,y:1280,w:105,h:72,name:'Южный комплекс'},
 {x:742,y:1400,w:72,h:72,name:'Восточный лагерь'}
];
// Coordinates are aligned to the ORIGINAL unlabeled satellite map (1000 x 2000).
// The second, labeled screenshot is used only as a geographic naming/boundary reference.
// Coordinates are aligned to the exact user-supplied labeled map (1000 x 2000).
const zoneSectorCoords={
 chaes:[503,104],zaton:[561,405],pripyat:[676,649],jupiter:[391,703],limansk:[128,838],red:[311,903],radar:[675,897],army:[502,1046],wild:[347,1212],bar:[441,1215],yantar:[174,1302],dump:[466,1470],agro:[243,1528],dark:[787,1418],cordon:[463,1753],swamps:[185,1788],darkhollow:[793,1742]
};
const zoneLinks=[['chaes','zaton'],['zaton','pripyat'],['pripyat','jupiter'],['pripyat','radar'],['jupiter','red'],['red','limansk'],['red','army'],['army','wild'],['wild','bar'],['bar','dump'],['bar','yantar'],['dump','agro'],['dump','dark'],['agro','cordon'],['cordon','swamps'],['dark','darkhollow']];
// Transparent hit areas let players select the printed labels without drawing over the supplied map.
const MAP_REGIONS=[
 {name:'ЧАЭС',id:'chaes',x:420,y:10,w:170,h:170},{name:'Затон',id:'zaton',x:400,y:300,w:230,h:190},
 {name:'Припять',id:'pripyat',x:570,y:520,w:220,h:210},{name:'Юпитер',id:'jupiter',x:270,y:640,w:220,h:180},
 {name:'Лиманск',id:'limansk',x:35,y:770,w:210,h:190},{name:'Рыжий лес',id:'red',x:210,y:830,w:220,h:180},
 {name:'Радар',id:'radar',x:590,y:820,w:190,h:170},{name:'Военные склады',id:'army',x:370,y:990,w:230,h:150},
 {name:'Дикие территории',id:'wild',x:260,y:1160,w:180,h:120},{name:'Бар',id:'bar',x:390,y:1160,w:130,h:130},
 {name:'Янтарь',id:'yantar',x:80,y:1260,w:180,h:160},{name:'Свалка',id:'dump',x:330,y:1390,w:230,h:170},
 {name:'Агропром',id:'agro',x:150,y:1460,w:190,h:150},{name:'Тёмная Долина',id:'dark',x:700,y:1320,w:220,h:190},
 {name:'Кордон',id:'cordon',x:350,y:1650,w:220,h:160},{name:'Болота',id:'swamps',x:80,y:1690,w:220,h:190},
 {name:'Тёмная Лощина',id:'darkhollow',x:700,y:1640,w:230,h:180}
];
const MAP_SCALE=1;
function mapRegionMarkup(){return MAP_REGIONS.map(r=>`<g class="map-region map-region-linked" data-location="${r.id}" role="button" tabindex="0" aria-label="${escapeHtml(r.name)}" onclick="selectLocation('${r.id}')"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="8"/></g>`).join('')}
function mapZoom(step){zoneMapDirty=true;zoneMapZoom=step===0?1:Math.max(.55,Math.min(4,zoneMapZoom+step*.25));renderZoneMap()}
function setMapMode(mode){zoneMapDirty=true;zoneMapMode=mode==='local'?'local':'zone';$('mapModeZone')?.classList.toggle('active',zoneMapMode==='zone');$('mapModeLocal')?.classList.toggle('active',zoneMapMode==='local');$('mapHint').textContent=zoneMapMode==='local'?'Поставь метку на свободном месте. Персонаж самостоятельно и медленно пойдёт к ней.':'Общая карта: выбери сектор, чтобы открыть его подробную карту.';renderZoneMap()}
function sectorCenter(id){return zoneSectorCoords[id]||[500,1000]}
function playerWorldPosition(){if(g.mapCoordinateVersion!==2||!g.worldPosition||!Number.isFinite(g.worldPosition.x)||!Number.isFinite(g.worldPosition.y)){const c=sectorCenter(g.loc);g.worldPosition={x:c[0],y:c[1]+24};g.mapCoordinateVersion=2;}return g.worldPosition}
function playerDotMarkup(p){return `<g id="playerMapMarker" class="world-marker marker-self" transform="translate(${p.x} ${p.y})" aria-label="Твоё положение"><circle class="marker-pulse" r="3.2"/><circle class="marker-dot" r="1.8"/><circle class="marker-center" r=".8"/></g>`}
function npcHeading(n,index=0){const d=n.direction??n.facing??n.heading;const named={up:0,north:0,right:90,east:90,down:180,south:180,left:270,west:270};return Number.isFinite(Number(d))?Number(d):named[String(d||'').toLowerCase()]??((index*47)%360)}
function mapPoint(x,y,cls,label,extra='',heading=0){const arrow=['marker-friendly','marker-neutral','marker-enemy'].includes(cls)?`<path class="marker-direction" transform="scale(.34) rotate(${heading})" d="M0 -9 L-2.7 -4 L0 -5.5 L2.7 -4 Z"/>`:``;return `<g class="world-marker ${cls||''}" transform="translate(${x} ${y}) scale(.42)" ${extra}><circle class="marker-pulse" r="7"/>${arrow}<circle class="marker-dot" r="3.2"/><title>${escapeHtml(label||'Отметка')}${arrow?' · направление НПС':''}</title></g>`}
function mapSquadPoint(x,y,cls,label,count,extra='',heading=0,names=''){const arrow=`<path class="marker-direction" transform="scale(.34) rotate(${heading})" d="M0 -9 L-2.7 -4 L0 -5.5 L2.7 -4 Z"/>`;return `<g class="world-marker world-squad-marker ${cls||''}" transform="translate(${x} ${y}) scale(.48)" ${extra}><circle class="marker-pulse" r="8"/>${arrow}<circle class="marker-dot" r="5"/><text class="squad-count" x="0" y="2.1" text-anchor="middle">${count}</text><title>${escapeHtml(label)} · ${escapeHtml(names)}</title></g>`}
function isHostileNpcFaction(faction){if(!faction||faction===g.faction)return false;if(faction==='Монолит'||g.faction==='Монолит')return true;return factionRelationValue(g.faction,faction)<=-25;}
function npcMarkerClass(n){if(n.faction===g.faction)return 'marker-friendly';if(isHostileNpcFaction(n.faction))return 'marker-enemy';const f=(g.factions||[]).find(x=>x.name===n.faction);if(Number(n.relationship??0)<-10)return 'marker-enemy';return 'marker-neutral'}
function sectorMarkerPosition(id,index=0){const q=zoneSectorCoords[id];if(!q)return null;const angle=index*2.399963;const radius=18+((index%3)*9);return [q[0]+Math.cos(angle)*radius,q[1]+Math.sin(angle)*radius]}
function hashMapSeed(value){let h=2166136261;for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
const npcMapPositions=new Map();
function npcMapPosition(n,index=0){
 if(Number.isFinite(n.x)&&Number.isFinite(n.y))return [n.x,n.y];
 const id=String(n.id||n.name||('npc_'+index)),loc=n.location||n.loc||'cordon',center=zoneSectorCoords[loc]||zoneSectorCoords.cordon;
 let pos=npcMapPositions.get(id);
 if(!pos||pos.loc!==loc){let seed=hashMapSeed(id+'|'+loc),rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};const angle=rand()*Math.PI*2,radius=28+rand()*112;pos={loc,x:center[0]+Math.cos(angle)*radius,y:center[1]+Math.sin(angle)*radius,phase:rand()*Math.PI*2};npcMapPositions.set(id,pos)}
 return [pos.x,pos.y];
}
function driftNpcMapPositions(){
 for(const n of (g.npcs||[])){if(n.alive===false||Number.isFinite(n.x)&&Number.isFinite(n.y))continue;const p=npcMapPosition(n);const state=npcMapPositions.get(String(n.id||n.name));if(!state)continue;state.phase+=.22;const c=zoneSectorCoords[state.loc]||zoneSectorCoords.cordon;const radius=Math.hypot(state.x-c[0],state.y-c[1]);const angle=Math.atan2(state.y-c[1],state.x-c[0])+.035;const r=Math.max(24,Math.min(145,radius+Math.sin(state.phase)*1.4));state.x=c[0]+Math.cos(angle)*r;state.y=c[1]+Math.sin(angle)*r;}
 if($('world')?.classList.contains('active'))renderZoneMap();
}
// Map markers are updated only when the map is opened or authoritative world data arrives;
// avoid rebuilding hundreds of SVG nodes on a background timer (especially on mobile).
function renderZoneMap(){
 const esc=s=>escapeHtml(String(s??'')),centers=zoneSectorCoords;
 const edges=zoneLinks.map(([a,b])=>{const A=centers[a],B=centers[b];return `<path class="map-route-line" d="M${A[0]} ${A[1]} Q${(A[0]+B[0])/2+20} ${(A[1]+B[1])/2-15} ${B[0]} ${B[1]}"/>`}).join('');
 const regions=mapRegionMarkup();
 const me=playerWorldPosition();let overlays='';
 const allNpcs=zoneMapMode==='zone'?(serverWorld?.npcState?Object.values(serverWorld.npcState):g.npcs||[]):(g.npcs||[]).filter(n=>(n.loc||n.location)===g.loc);
 const living=allNpcs.filter(n=>n.alive!==false).slice(0,400),squadBuckets=new Map();
 for(const n of living){const key=n.squadId||`solo_${n.id}`;if(!squadBuckets.has(key))squadBuckets.set(key,[]);squadBuckets.get(key).push(n);}
 overlays+=[...squadBuckets.values()].map((members,i)=>{const lead=members[0],loc=lead.location||lead.loc,pts=members.map(n=>npcMapPosition(n,i)).filter(Boolean);if(!pts.length)return '';const x=pts.reduce((a,p)=>a+p[0],0)/pts.length,y=pts.reduce((a,p)=>a+p[1],0)/pts.length,cls=npcMarkerClass(lead),activity=({campfire:'у костра',guard:'на посту',patrol:'патруль',rest:'отдыхает',travel:'в пути',assault:'выдвигается',mission:'выполняет приказ',combat:'в бою',retreat:'отступает'})[lead.behavior||lead.action]||'на базе',names=members.map(n=>n.name).join(', '),label=`Отряд «${lead.squadName||lead.squadId||'сталкеры'}» · ${members.length} бойца(ов) · ${lead.faction||'нейтралы'} · ${locationName(loc)} · ${activity}`;return mapSquadPoint(x,y,cls,label,members.length,`onclick="${zoneMapMode==='local'?(cls==='marker-enemy'?`startNpcEncounter('${esc(lead.id)}')`:`openTalk('${esc(lead.id)}')`):''}"`,npcHeading(lead,i),names)}).join('');
 for(const c of (serverWorld?.convoys||[]).filter(x=>x.status==='moving'||x.status==='ambushed')){const q=sectorMarkerPosition(c.location,12);if(q)overlays+=mapPoint(q[0]+7,q[1]+7,'marker-convoy',`Караван ${c.faction} · ${c.status}`);}
 const eco=ecologyData();
 for(const [i,pack] of (eco.mutantPacks||[]).entries()){if(zoneMapMode==='local'&&pack.location!==g.loc)continue;const q=sectorMarkerPosition(pack.location,20+i);if(q)overlays+=`<g class="world-marker marker-mutant" transform="translate(${q[0]-10} ${q[1]+9})"><circle r="8"/><text text-anchor="middle" y="3">☣</text><title>${esc(pack.species)} ×${pack.count} · ${locationName(pack.location)} · агрессия ${pack.aggression}%</title></g>`;}
 for(const [i,a] of (eco.anomalies||[]).entries()){if(zoneMapMode==='local'&&a.location!==g.loc)continue;const q=sectorMarkerPosition(a.location,45+i);if(q)overlays+=`<g class="world-marker marker-anomaly" transform="translate(${q[0]+10} ${q[1]-9})"><circle r="7"/><text text-anchor="middle" y="3">✧</text><title>${esc(a.kind)} · ${locationName(a.location)} · опасность ${a.danger}%</title></g>`;}
 overlays+=(onlinePlayers||[]).filter(p=>p.id!==zonePlayerId).map((p,i)=>{const q=Number.isFinite(p.x)&&Number.isFinite(p.y)?[p.x,p.y]:sectorMarkerPosition(p.location,i+2);return q?mapPoint(q[0],q[1],'marker-player',p.name||'Игрок'):''}).join('');
 const caches=Object.entries(g.keyPoints||{}).flatMap(([loc,arr])=>(arr||[]).filter(p=>p.discovered).map((p,i)=>({loc,p,i}))); 
 overlays+=caches.map(({loc,i})=>{const q=sectorMarkerPosition(loc,i+4);return q?mapPoint(q[0]+12,q[1]-14,'marker-cache','Тайник'):''}).join('');
 const npcRoutes=allNpcs.filter(n=>Array.isArray(n.route)&&n.route.length>1).map(n=>{const pts=n.route.map((v,i)=>Array.isArray(v)?v:(typeof v==='string'?zoneSectorCoords[v]:[v?.x,v?.y])).filter(v=>v&&Number.isFinite(v[0])&&Number.isFinite(v[1]));return pts.length>1?`<polyline class="npc-route-line" points="${pts.map(v=>v.join(',')).join(' ')}"><title>Маршрут: ${esc(n.name||'отряд')}</title></polyline>`:''}).join('');
 const moveRoute=playerMoveTarget?`<path class="player-waypoint-route" d="M${me.x} ${me.y} L${playerMoveTarget.x} ${playerMoveTarget.y}"/><g class="player-waypoint" transform="translate(${playerMoveTarget.x} ${playerMoveTarget.y})"><circle r="8"/><path d="M-4 0H4M0 -4V4"/></g>`:'';
 const meDot=playerDotMarkup(me);
 const view=zoneMapMode==='zone'?(()=>{const w=1000/zoneMapZoom,h=2000/zoneMapZoom;return `${Math.max(0,Math.min(1000-w,me.x-w/2))} ${Math.max(0,Math.min(2000-h,me.y-h/2))} ${w} ${h}`})():(()=>{const size=470/zoneMapZoom;return `${Math.max(0,Math.min(1000-size,me.x-size/2))} ${Math.max(0,Math.min(2000-size,me.y-size/2))} ${size} ${size}`})();
 $('zoneMap').innerHTML=`<svg id="zoneMapSvg" viewBox="${view}" preserveAspectRatio="none" onwheel="event.preventDefault();mapZoom(event.deltaY<0?1:-1)" aria-label="${zoneMapMode==='zone'?'Карта Зоны':'Карта '+(here()?.name||'локации')}" ${zoneMapMode==='local'?'onpointerdown="mapPointer(event)"':''}><image href="/assets/zone-master-map.jpg" x="0" y="0" width="1000" height="2000" preserveAspectRatio="none"/><rect x="0" y="0" width="1000" height="2000" fill="#10170f" opacity=".08"/><g class="map-region-layer">${regions}</g>${edges}${npcRoutes}${moveRoute}<g class="map-marker-layer">${overlays}${meDot}</g><g class="map-compass" transform="translate(920 110)"><circle r="28"/><path d="M0 -20L7 7 0 2 -7 7Z"/><text y="-38" text-anchor="middle">N</text></g></svg>`;
 $('mapCoordinates').textContent=`${zoneMapMode==='zone'?'ВСЯ ЗОНА':'ЛОКАЦИЯ: '+(here()?.name||'—')} · ${Math.round(zoneMapZoom*100)}% · X ${Math.round(me.x)} / Y ${Math.round(me.y)}`;zoneMapHasRendered=true;zoneMapDirty=false;
}
function updatePlayerMapMarker(){
 const p=playerWorldPosition(),marker=$('playerMapMarker'),svg=$('zoneMapSvg');
 if(marker)marker.setAttribute('transform',`translate(${p.x} ${p.y})`);
 if(svg){const view=zoneMapMode==='zone'?(()=>{const w=1000/zoneMapZoom,h=2000/zoneMapZoom;return `${Math.max(0,Math.min(1000-w,p.x-w/2))} ${Math.max(0,Math.min(2000-h,p.y-h/2))} ${w} ${h}`})():(()=>{const size=470/zoneMapZoom;return `${Math.max(0,Math.min(1000-size,p.x-size/2))} ${Math.max(0,Math.min(2000-size,p.y-size/2))} ${size} ${size}`})();svg.setAttribute('viewBox',view);}
 const coords=$('mapCoordinates');if(coords)coords.textContent=`${zoneMapMode==='zone'?'ВСЯ ЗОНА':'ЛОКАЦИЯ: '+(here()?.name||'—')} · ${Math.round(zoneMapZoom*100)}% · X ${Math.round(p.x)} / Y ${Math.round(p.y)}`;
}
function mapPointer(ev){if(zoneMapMode!=='local'||ev.target?.closest?.('.world-marker,.map-sector,.map-region'))return;const svg=$('zoneMapSvg');if(!svg)return;const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const p=pt.matrixTransform(svg.getScreenCTM().inverse());const target={x:Math.max(8,Math.min(992,p.x)),y:Math.max(8,Math.min(1992,p.y))};pendingSectorExit=null;playerMoveTarget=target;walkTarget=target;zoneMapDirty=true;renderZoneMap();if(zoneSocket?.connected){zoneSocket.emit('player:move-order',{x:target.x,y:target.y,location:g.loc});updateMoveOrderStatus('Приказ отправлен серверу…');}else{startWalking();updateMoveOrderStatus('Локальный режим: движение без синхронизации сервера');}}
function startExpedition(){const destination=$('expeditionDestination')?.value,mode=$('expeditionMode')?.value||'safe';if(!destination){updateMoveOrderStatus('Выбери пункт назначения');return;}if(!zoneSocket?.connected){updateMoveOrderStatus('Для межсекторного перехода требуется подключение к серверу');return;}zoneSocket.emit('player:expedition-order',{destination,mode});updateMoveOrderStatus('КПК рассчитывает маршрут…');}
function cancelMoveOrder(){if(zoneSocket?.connected)zoneSocket.emit('player:move-cancel');if(walkTimer){clearInterval(walkTimer);walkTimer=null;}walkTarget=null;playerMoveTarget=null;playerMoving=false;updateMoveOrderStatus('Нет активного маршрута');renderZoneMap()}
function updateMoveOrderStatus(text){const el=$('mapOrderStatus');if(el){const b=el.querySelector('b');if(b)b.textContent=text||'Маршрут активен';}}
function blockedAt(x,y){const r=9;return x<r||y<r||x>1000-r||y>2000-r||WORLD_OBSTACLES.some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h)}
function syncWalkPosition(){const p=playerWorldPosition(),now=performance.now();if(now-lastPositionSync>1000){lastPositionSync=now;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));}}
function startWalking(){if(walkTimer||zoneSocket?.connected)return;let last=performance.now();walkTimer=setInterval(()=>{const now=performance.now(),dt=Math.min(.08,(now-last)/1000);last=now;const p=playerWorldPosition();if(!walkTarget){clearInterval(walkTimer);walkTimer=null;playerMoving=false;return;}let dx=walkTarget.x-p.x,dy=walkTarget.y-p.y,d=Math.hypot(dx,dy);if(d<3){walkTarget=null;playerMoveTarget=null;playerMoving=false;clearInterval(walkTimer);walkTimer=null;updateMoveOrderStatus('Ты достиг отмеченной точки');renderZoneMap();return;}dx/=d;dy/=d;const step=7*dt,nx=p.x+dx*step,ny=p.y+dy*step;if(!blockedAt(nx,p.y))p.x=nx;if(!blockedAt(p.x,ny))p.y=ny;g.worldPosition=p;playerMoving=true;syncWalkPosition();updatePlayerMapMarker()},100)}

const achievementDefs=[
 ["first_contact","Первый контакт","Поговорить с первым NPC","☻",()=>g.meetings>=1],
 ["wanderer","Бродяга","Посетить пять разных локаций","⌖",()=>new Set(g.log.filter(x=>x.startsWith("Переход:"))).size>=4],
 ["collector","Собиратель","Найти первый артефакт","✧",()=>!!g.flags.foundArtifact],
 ["trusted","Своего не бросаем","Достичь 25 репутации","⚑",()=>g.rep>=25],
 ["veteran","Сталкер со стажем","Выполнить три задания","★",()=>g.completed>=3],
 ["diplomat","Переговорщик","Улучшить отношения с любой группировкой","⇄",()=>Object.values(g.diplomacy||{}).some(o=>Object.values(o).some(v=>v>=20))],
 ["rich","Капитал Зоны","Накопить 5000 рублей","₽",()=>g.money>=5000],
 ["talkative","Свой человек","Провести десять встреч с NPC","▣",()=>g.meetings>=10],
 ["explorer","Картограф","Открыть все сектора карты","▦",()=>g.locations.length>=15&&g.locations.every(l=>g.log.some(x=>x.includes("Переход: "+l.name))||l.id==="cordon")]
];
function checkAchievements(){for(const [id,name,desc,icon,fn] of achievementDefs){if(!g.achievements[id]&&fn()){g.achievements[id]=true;log("Получено достижение: "+name);news("Достижение разблокировано",name+" — "+desc)}}}
function renderAchievements(){checkAchievements();let done=achievementDefs.filter(a=>g.achievements[a[0]]).length;$("achievementStats").innerHTML=`<div class="stat"><span>Открыто</span><strong>${done}/${achievementDefs.length}</strong></div><div class="stat"><span>Завершено заданий</span><strong>${g.completed}</strong></div><div class="stat"><span>Встречи</span><strong>${g.meetings}</strong></div>`;$("achievementList").innerHTML=achievementDefs.map(([id,n,d,ic])=>`<div class="achievement ${g.achievements[id]?'':'locked'}"><div class="medal">${ic}</div><div><b>${n}</b><div class="desc">${d}</div><small>${g.achievements[id]?'ПОЛУЧЕНО':'ЕЩЁ НЕ ПОЛУЧЕНО'}</small></div></div>`).join("")}
function adjustDiplomacy(name,action){let player=g.faction;if(name===player)return;let rel=g.diplomacy[player]?.[name]??0;let cost=action==="treaty"?250:action==="intel"?80:120;if(g.money<cost)return alert("Недостаточно рублей для дипломатической миссии.");g.money-=cost;let delta=action==="treaty"?12:action==="intel"?7:4;g.diplomacy[player][name]=Math.min(60,rel+delta);if(g.diplomacy[name])g.diplomacy[name][player]=Math.min(60,(g.diplomacy[name][player]||0)+Math.floor(delta/2));g.rep+=1;let msg=action==="treaty"?"предложил торговое соглашение":action==="intel"?"обменялся разведданными":"направил дипломатического посредника";log("Ты "+msg+" группировке «"+name+"».");news("Дипломатия",g.faction+" улучшили отношения с группировкой «"+name+"».");save()}
function renderDiplomacy(){const summary=$("diplomacySummary"),list=$("diplomacyList"),relations=$("relations");let friendly=g.factions.filter(f=>f.name!==g.faction&&factionRelationValue(g.faction,f.name)>=20).length;if(summary)summary.innerHTML=`<div class="stat"><span>Твоя группировка</span><strong style="font-size:15px">${escapeHtml(g.faction)}</strong></div><div class="stat"><span>Дружественные каналы</span><strong>${friendly}</strong></div><div class="stat"><span>Казна</span><strong>${Number(g.money||0).toLocaleString('ru-RU')} ₽</strong></div>`;const rows=g.factions.filter(f=>f.name!==g.faction);if(relations)relations.innerHTML=rows.map(f=>{let r=factionRelationValue(g.faction,f.name);let label=r>=35?"Союзные контакты":r>=15?"Дружелюбные":r>=-14?"Нейтралитет":r>=-34?"Напряжённость":"Враждебность";return `<div class="item"><span>${factionIconMarkup(f.name)} ${escapeHtml(f.name)} <small class="muted">· ${label}</small></span><b class="${r<0?'red':'gold'}">${r>0?'+':''}${r}</b></div>`}).join("");if(list)list.innerHTML=rows.map(f=>{let r=factionRelationValue(g.faction,f.name);let locked=g.faction==='Монолит'||f.name==='Монолит'||r<=-55;let label=r>=35?"Союзные контакты":r>=15?"Дружелюбные":r>=-14?"Нейтралитет":r>=-34?"Напряжённость":"Враждебность";return `<div class="item block"><div class="row" style="align-items:center"><div style="display:flex;gap:9px;align-items:center"><span class="faction-emblem">${factionIconMarkup(f.name)}</span><div><b>${escapeHtml(f.name)}</b><div class="desc">${label} · отношение ${r>0?'+':''}${r}</div></div></div><span class="tag">${Number(f.members||0).toLocaleString('ru-RU')} бойцов</span></div><div class="bar"><i style="width:${Math.max(0,Math.min(100,(r+60)/1.2))}%"></i></div>${locked?'<div class="desc">Дипломатический канал закрыт: устойчивая вражда.</div>':`<div class="rightbuttons" style="margin-top:9px"><button onclick="adjustDiplomacy('${f.name}','mediator')">Посредник · 120 ₽</button><button onclick="adjustDiplomacy('${f.name}','intel')">Обмен данными · 80 ₽</button><button onclick="adjustDiplomacy('${f.name}','treaty')">Торговый пакт · 250 ₽</button></div>`}</div>`}).join("")}
function setOverviewRival(name){overviewRival=name;renderOverviewFactionFront()}
function renderOverviewFactionFront(){const rows=factionRankRows(),own=rows.find(x=>x.name===g.faction);if(!own)return;const options=rows.filter(x=>x.name!==g.faction);if(!options.some(x=>x.name===overviewRival))overviewRival=options.find(x=>factionRelationValue(g.faction,x.name)<0)?.name||options[0]?.name||'';const rival=rows.find(x=>x.name===overviewRival)||options[0];const sel=$('overviewRival');if(sel){sel.innerHTML=options.map(x=>`<option value="${escapeHtml(x.name)}" ${x.name===overviewRival?'selected':''}>${escapeHtml(x.name)}</option>`).join('');}if(!rival)return;const put=(id,value)=>{const el=$(id);if(el)el.textContent=value};const bar=(id,value,max)=>{const el=$(id);if(el)el.style.width=Math.max(3,Math.min(100,max?value/max*100:0))+'%'};const relation=factionRelationValue(own.name,rival.name),relText=relation<=-35?'ОТКРЫТАЯ ВРАЖДА':relation<0?'НАПРЯЖЁННЫЕ ОТНОШЕНИЯ':relation>=25?'СОТРУДНИЧЕСТВО':'НЕЙТРАЛЬНЫЕ ОТНОШЕНИЯ';put('overviewOwnEmblem','');const ownEm=$('overviewOwnEmblem'),rivalEm=$('overviewRivalEmblem');if(ownEm)ownEm.innerHTML=factionEmblemMarkup(own);if(rivalEm)rivalEm.innerHTML=factionEmblemMarkup(rival);put('overviewOwnName',own.name);put('overviewRivalName',rival.name);put('overviewFrontGoal',relation<=-35?'Сдерживать враждебную группировку':relation<0?'Следить за напряжённостью на границе':'Укреплять позиции и влияние');put('overviewFrontTask',`Текущий сектор: ${here().name} · контроль: ${here().owner||'не установлен'}`);put('overviewFrontRelation',`${relText} · ${relation>0?'+':''}${relation}`);put('overviewOwnSquads',`${own.patrols} бойцов в патрулях`);put('overviewRivalSquads',`${rival.patrols} бойцов в патрулях`);put('overviewOwnResources',`${own.territoryCount} террит. · влияние ${own.influence}%`);put('overviewRivalResources',`${rival.territoryCount} террит. · влияние ${rival.influence}%`);const max=Math.max(own.score,rival.score,1);bar('overviewOwnStrengthBar',own.score,max);bar('overviewRivalStrengthBar',rival.score,max);const maxP=Math.max(own.patrols,rival.patrols,1),maxT=Math.max(own.territoryCount,rival.territoryCount,1);bar('overviewOwnSquadsBar',own.patrols,maxP);bar('overviewRivalSquadsBar',rival.patrols,maxP);bar('overviewOwnResourcesBar',own.territoryCount,maxT);bar('overviewRivalResourcesBar',rival.territoryCount,maxT)}

function renderNews(){$("newsList").innerHTML=g.news.map(n=>`<div class="item block"><div style="display:flex;justify-content:space-between;gap:8px"><b>${n.title}</b><span class="pill">День ${n.day} · ${n.hour}</span></div><div class="desc">${n.body}</div></div>`).join("")}
function generateRumor(){let arr=["На Кордоне говорят, что торговцы скоро обновят ассортимент.","На Свалке замечены незнакомые сталкеры. Их цели пока неизвестны.","Учёные на Янтаре ищут добровольцев для новых наблюдений.","В баре обсуждают перемены в отношениях между группировками.","Проводник утверждает, что на старой тропе появились новые ориентиры."];let r=arr[Math.floor(Math.random()*arr.length)];news("Слух от сталкеров",r);log("Получен новый слух через КПК.");save()}
function clearOldNews(){g.news=g.news.slice(0,5);save()}
function renderCraft(){$("recipes").innerHTML=[{name:"Полевой набор",desc:"Обменять 2 металлолома на 1 бинт.",cost:{scrap:2},out:"bandage"},{name:"Запас болтов",desc:"Обменять 1 металлолом на 5 болтов.",cost:{scrap:1},out:"bolt"},{name:"Аптечный комплект",desc:"Обменять 3 металлолома на аптечку.",cost:{scrap:3},out:"med"}].map((r,i)=>`<div class="item"><div><b>${r.name}</b><div class="desc">${r.desc}</div></div><button onclick="craft(${i})">Собрать</button></div>`).join("")}
function craft(i){let recipes=[{cost:2,out:"bandage",name:"Бинт"},{cost:1,out:"bolt",name:"Болты",qty:5},{cost:3,out:"med",name:"Аптечка"}],r=recipes[i];if(count("scrap")<r.cost)return alert("Недостаточно металлолома.");take("scrap",r.cost);let map={bandage:["Бинт","Медицина","Полевой расходный предмет",.2,45],bolt:["Болты","Инструмент","Металлические болты",.1,5],med:["Аптечка","Медицина","Восстанавливает здоровье",.4,100]}[r.out];addItem(r.out,map[0],map[1],map[2],map[3],map[4],r.qty||1);log("Изготовлено: "+r.name+".");save()}
function renderProfile(){
 const rank=g.xp<50?"Новичок":g.xp<150?"Опытный сталкер":g.xp<300?"Следопыт":g.xp<600?"Ветеран Зоны":"Легенда Зоны";
 $("profileName").textContent=g.name;$("rank").textContent=rank;$("profileFaction").textContent=`${g.faction} · ${here().name}`;$("profileBio").textContent=`В Зоне с ${new Date(g.realTimeStartedAt||Date.now()).toLocaleDateString('ru-RU')}. Твой путь продолжается.`;
 $("playerPortrait").innerHTML=portraitMarkup({id:'player-'+g.name,name:g.name,faction:g.faction,role:rank,icon:'☻'});
 $("profileStats").innerHTML=[["Репутация",g.rep],["Опыт",g.xp],["Здоровье",g.hp+"%"],["Выносливость",g.stamina+"%"],["Ранг",rank],["Группировка",g.faction]].map(x=>`<div class="stat"><span>${x[0]}</span><strong style="font-size:16px">${escapeHtml(x[1])}</strong></div>`).join("");
 const c=g.careerStats||{},artifacts=g.items.filter(x=>x.type==='Артефакт').reduce((a,x)=>a+x.qty,0),discovered=Object.values(g.keyPoints||{}).flat().filter(p=>p.discovered).length,done=g.quests.filter(q=>q.done).length;
 $("profileCareerStats").innerHTML=[["Победы в столкновениях",c.kills||0],["Найдено артефактов",artifacts],["Открыто точек",discovered],["Заданий выполнено",done],["Локаций посещено",(g.visitedLocations||[g.loc]).length],["Переходов",c.travelled||0]].map(x=>`<div class="stat"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join("");
 $("profileRecord").innerHTML=`<div class="record-line"><span>Позывной</span><b>${escapeHtml(g.name)}</b></div><div class="record-line"><span>Текущий сектор</span><b>${escapeHtml(here().name)}</b></div><div class="record-line"><span>Знакомства</span><b>${g.meetings||0}</b></div><div class="record-line"><span>Время в Зоне</span><b>${Math.max(0,Math.floor((Date.now()-(g.realTimeStartedAt||Date.now()))/86400000))} дн.</b></div>`;
 $("meetingCount").textContent=g.meetings||0;
}
function rename(){let n=prompt("Новый позывной:",g.name);if(n&&n.trim()){g.name=n.trim().slice(0,24);log("Позывной изменён.");save()}}
function chooseFaction(){let names=g.factions.map(f=>f.name),v=prompt("Выбери группировку:\n"+names.join("\n"),g.faction);if(!v)return;if(!names.includes(v))return alert("Такой группировки нет в списке.");g.faction=v;log("Теперь ты состоишь в группировке «"+v+"».");save();mpSyncLocation()}
function renderAtmosphere(){
 const hero=$('homeHero'),info=$('atmosphereInfo');if(!hero||!info)return;
 const bucket=Math.floor(Date.now()/900000),state=g.atmosphereState||{};
 if(state.bucket!==bucket){const weather=['clear','fog','rain','overcast','emission'];const seed=(bucket+String(g.loc||'cordon').length*13)%weather.length;g.atmosphereState={bucket,weather:weather[seed]};}
 const hour=new Date().getHours(),light=hour<6?'night':hour<9?'dawn':hour<17?'day':hour<20?'dusk':'night',weather=g.atmosphereState.weather;
 hero.dataset.weather=weather;hero.dataset.light=light;
 const names={clear:'ЯСНО',fog:'ТУМАН',rain:'ДОЖДЬ',overcast:'ПАСМУРНО',emission:'РАДИАЦИОННЫЙ ФОН'},lights={night:'НОЧЬ',dawn:'РАССВЕТ',day:'ДЕНЬ',dusk:'СУМЕРКИ'};
 info.innerHTML=`<span class="weather-pip"></span><b>${names[weather]}</b><span>·</span><span>${lights[light]}</span><span>·</span><span>${escapeHtml(here().name).toUpperCase()}</span><span class="weather-updated">СВОДКА ${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</span>`;
}
function radiationLevel(){return Math.max(0,Math.min(100,Number(g.radiation)||0))}
function tickRadiation(){const hazards={chaes:1.8,radar:1.5,pripyat:1.1,red:.65,yantar:.45,swamps:.35,darkhollow:.3,limansk:.25};if(Date.now()<(g.radiationProtectionUntil||0))return;const exposure=hazards[g.loc]||0;if(exposure){g.radiation=Math.min(100,radiationLevel()+exposure);if(g.radiation>=35&&Math.random()<.18)g.hp=Math.max(1,g.hp-1);if(g.radiation>=70&&Math.random()<.25)g.stamina=Math.max(0,g.stamina-2);save();}}
setInterval(()=>{tickRadiation();tickSurvival();if($('inventory')?.classList.contains('active'))renderInventory();},60000);
setInterval(()=>{if($('ranks')?.classList.contains('active'))renderStalkerLeaderboard();if($('factions')?.classList.contains('active'))renderFactionLeaderboard();},15000);
function needPercent(value){const n=Number(value);return Math.round(Math.max(0,Math.min(100,Number.isFinite(n)?n:0)));}
function render(){let l=here();$("topMoney").textContent=g.money.toLocaleString("ru-RU");$("topHp").textContent=g.hp+"%";$("topHunger").textContent=needPercent(g.hunger)+"%";$("topThirst").textContent=needPercent(g.thirst)+"%";const radEl=$("topRadiation");if(radEl)radEl.textContent=Math.round(radiationLevel())+"%";$("topDay").textContent=realClock().stamp;$("topLoc").textContent=l.name;$("sMoney").textContent=g.money+" ₽";$("sHp").textContent=g.hp+"%";$("sRep").textContent=g.rep;$("sDay").textContent=g.day;
$("nearby").innerHTML=nearbyNpcs().slice(0,3).map(n=>`<div class="item"><div><b>${n.icon} ${n.name}</b><div class="desc">${n.role} · ${n.desc}</div></div><button onclick="meet('${n.id}')">Подойти</button></div>`).join("")||'<div class="mutedbox">Поблизости никого нет.</div>';
$("homeNews").textContent=g.news[0]?g.news[0].title+": "+g.news[0].body:"Пока без новостей.";
$("miniStatus").innerHTML=`<div class="item"><span>Локация</span><b>${l.name}</b></div><div class="item"><span>Выносливость</span><b>${g.stamina}%</b></div><div class="bar"><i style="width:${g.stamina}%"></i></div><div class="item"><span>Голод</span><b>${needPercent(g.hunger)}%</b></div><div class="bar"><i style="width:${needPercent(g.hunger)}%;background:#c6a16c"></i></div><div class="item"><span>Жажда</span><b>${needPercent(g.thirst)}%</b></div><div class="bar"><i style="width:${needPercent(g.thirst)}%;background:#8ab5c7"></i></div><div class="item"><span>Радиация</span><b>${Math.round(radiationLevel())}%</b></div><div class="bar"><i style="width:${radiationLevel()}%;background:#a5b66d"></i></div><div class="item"><span>Погода</span><b>${g.world.weather}</b></div><div class="item"><span>Фракция</span><b>${g.faction}</b></div>`;
$("worldState").innerHTML=`<div class="item"><span>Аномальная активность</span><b>${g.world.emission}</b></div><div class="item"><span>Мутанты</span><b>${g.world.mutants}</b></div><div class="item"><span>Напряжённость</span><b>${g.world.tension}%</b></div>`;
applyGameOptions();renderAtmosphere();renderOverviewFactionFront();renderMap();renderKeyPoints();renderStories();renderArmory();renderEncyclopedia();renderPeople();renderQuests();renderInventory();renderTrade();renderFactions();renderArchive();renderDiplomacy();renderAchievements();renderNews();renderCraft();renderProfile();renderQuick();renderLivingZone();renderFieldwork();renderSurvival();renderSurvivalHud();$("log").innerHTML=g.log.map((x,i)=>`<div><time>${String(i+1).padStart(2,"0")}</time>${x}</div>`).join("")}
function exportSave(){let blob=new Blob([JSON.stringify(g,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="zone-online-save.json";a.click();URL.revokeObjectURL(a.href)}
function importSave(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let d=JSON.parse(r.result);if(!d.locations||!d.npcs||!d.items)throw Error();g=d;save();alert("Сохранение загружено.")}catch(err){alert("Файл сохранения не распознан.")}};r.readAsText(f)}
function manualSave(){save();alert("Игра сохранена в этом браузере.")}
function resetGame(){if(confirm("Начать заново? Текущее локальное сохранение будет заменено.")){g=clone(base);activeNpc=null;chosenLoc=null;save();view("home")}}
// GLOBAL ONLINE WORLD state must exist before the first render: renderPeople()
 // reads serverWorld while building the initial NPC roster.
let zoneSocket=null, zoneSocketTarget='', zoneHelloReadyTimer=null, zoneConnectAttempt=0, zonePlayerReady=false, zonePlayerId=localStorage.getItem('zoneOnlinePlayerId')||'';
// Guest-only release: discard obsolete account credentials from older builds.
localStorage.removeItem('zoneAccountToken');localStorage.removeItem('zoneAccountUsername');
const factionSpawn={ 'Одиночки':'cordon','Долг':'bar','Свобода':'army','Бандиты':'dump','Военные':'agro','Учёные':'yantar','Наёмники':'limansk','Монолит':'radar','Чистое небо':'swamps' };
const spawnNames={cordon:'Кордон',bar:'Бар',army:'Военные склады',dump:'Свалка',agro:'Агропром',yantar:'Янтарь',limansk:'Лиманск',radar:'Радар',swamps:'Болота'};
let onlinePlayers=[], serverWorld=null, serverChat=[], incomingTrades=[], activePlayerSquad=null;
let serverLeaderboard=[], selectedRankId='', rankRecentEvents=[];
let applyingServerState=false;

render();
const realClockTimer=setInterval(()=>{
 const el=$("topDay");if(el)el.textContent=realClock().stamp;
 // Offline browser mode still advances the local simulation on wall-clock time only.
 {const now=Date.now();if(!g.lastLocalWorldPulseAt)g.lastLocalWorldPulseAt=now;if(now-g.lastLocalWorldPulseAt>=15*60*1000){g.lastLocalWorldPulseAt=now;livingWorldTick();if(!zoneSocket?.connected)roamNPCs();log("Мир обновился по реальному времени. Новая сводка доступна в КПК.");save();}}
},15000);

// GLOBAL ONLINE WORLD: one shared server, no private rooms.
function renderOnlinePlayers(){
 const make=(p)=>`<div class="item"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><div><b>🟢 ${escapeHtml(p.name)}</b><div class="desc">${escapeHtml(p.faction)} · ${escapeHtml(locationName(p.location))}</div></div><span class="tag">${p.hp}% HP</span></div>${p.id!==zonePlayerId&&p.location===g.loc?`<button class="quiet-action" onclick="view('multiplayer');openPlayerDM('${p.id}')">✉ Личное сообщение</button><button class="quiet-action" onclick="squadAction('invite','${p.id}')">＋ В отряд</button><button class="quiet-action" onclick="friendRequest('${p.id}')">★ В друзья</button>`:''}</div>`;
 const all=onlinePlayers.map(make).join('')||'<div class="mutedbox small">Сейчас никого нет. Ты можешь быть первым.</div>';
 const a=$('mpPlayers');if(a)a.innerHTML=all;
 const b=$('nearbyPlayers');if(b){const near=onlinePlayers.filter(p=>p.id!==zonePlayerId&&p.location===g.loc);b.innerHTML=near.map(make).join('')||'<div class="mutedbox small">В этом секторе пока нет других игроков.</div>';}
 const status=$('mpStatus');if(status)status.textContent=zoneSocket?.connected?'🟢 Подключено к общей Зоне':'🔴 Нет соединения';
 const statusText=$('mpStatusText');if(statusText)statusText.textContent=`Онлайн: ${onlinePlayers.length} · ${zoneSocket?.connected?'все игроки видят друг друга':'переподключение…'}`;
}
function locationName(id){return g.locations.find(x=>x.id===id)?.name||id||'Неизвестно'}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function syncNpcRosterToClient(){
 migrateLocalNpcCallsigns();
 const roster=serverWorld?.npcState||{};g.npcs||=[];
 for(const npc of Object.values(roster)){
  if(!npc||!npc.alive)continue;
  let local=g.npcs.find(x=>x.id===npc.id);
  if(!local){local={id:npc.id,name:npc.name,role:npc.role||'сталкер',loc:npc.location,faction:npc.faction,icon:npc.icon||'◉',desc:`${npc.personality||'обычный'} сталкер. ${npc.action==='travel'?'Сейчас в пути.':'Находится в секторе.'}`,mood:npc.mood||'нейтральное',generated:!!npc.generated,topics:[],greeting:''};g.npcs.push(local);}
  local.name=npc.name||local.name;local.loc=npc.location||local.loc;local.faction=npc.faction||local.faction;local.role=npc.role||local.role;local.icon=npc.icon||local.icon;local.generated=!!npc.generated;local.supportSpecialist=!!npc.supportSpecialist;local.mood=npc.mood||local.mood;local.health=Number.isFinite(Number(npc.health))?Number(npc.health):local.health;local.morale=Number.isFinite(Number(npc.morale))?Number(npc.morale):local.morale;local.supplies=Number.isFinite(Number(npc.supplies))?Number(npc.supplies):local.supplies;local.action=npc.action||local.action;local.behavior=npc.behavior||local.behavior;local.duty=npc.duty||local.duty;local.guardPost=!!npc.guardPost;local.homeLocation=npc.homeLocation||local.homeLocation;local.alive=npc.alive!==false;local.biography=npc.biography||local.biography;local.friends=npc.friends||[];local.rivals=npc.rivals||[];local.squadId=npc.squadId||null;local.squadName=npc.squadName||local.squadName;local.personality=npc.personality||local.personality;local.dialogueVersion=npc.dialogueVersion||0;
  if(npc.dialogue){local.greeting=npc.dialogue.greeting;local.topics=npc.dialogue.topics;}
 }
 for(const l of g.locations||[])l.people=(g.npcs||[]).filter(n=>n.loc===l.id&&(!roster[n.id]||roster[n.id].alive!==false)).map(n=>n.id);
}
function applySharedNpcPositions(positions){
 if(!positions||typeof positions!=='object')return;
 serverWorld=serverWorld||{};serverWorld.npcPositions=positions;
 for(const n of g.npcs||[]){if(positions[n.id]&&g.locations.some(l=>l.id===positions[n.id]))n.loc=positions[n.id];}
 syncNpcRosterToClient();renderPeople();renderQuick();if($('people').classList.contains('active'))renderPeople();
}
function renderPlayerTrade(){const el=$('playerTrade');if(!el)return;const others=onlinePlayers.filter(p=>p.id!==zonePlayerId);if(!others.length){el.innerHTML='<div class="mutedbox small">Пока нет других игроков онлайн.</div>';return;}
 const items=(g.items||[]).filter(x=>x.qty>0&&['med','bread','bolt','scrap','bandage','artifact','canned','sausage','condensed','water','tea','ration'].includes(x.id)||x.type==='Артефакт'||x.type==='Броня');
 el.innerHTML=others.map(p=>`<div class="item block"><b>${escapeHtml(p.name)}</b><div class="desc">${escapeHtml(p.faction)} · ${escapeHtml(locationName(p.location))}</div><div class="rightbuttons" style="margin-top:7px"><select class="field" id="tradeItem_${p.id}">${items.map(x=>`<option value="${escapeHtml(x.id)}">${escapeHtml(x.name)} · есть ${x.qty}</option>`).join('')}</select><input class="field" id="tradeQty_${p.id}" type="number" min="1" max="99" value="1" style="width:62px"><input class="field" id="tradePrice_${p.id}" type="number" min="0" max="1000000" value="0" style="width:82px" placeholder="₽"><button onclick="sendPlayerTrade('${p.id}')" ${items.length?'':'disabled'}>Предложить</button></div></div>`).join('');
}
function sendPlayerTrade(to){if(!zoneSocket?.connected)return alert('Нет соединения.');const item=$(`tradeItem_${to}`)?.value,qty=Number($(`tradeQty_${to}`)?.value),price=Number($(`tradePrice_${to}`)?.value);zoneSocket.emit('trade:offer',{to,item,qty,price});}
function renderIncomingTrades(){const el=$('incomingTrades');if(!el)return;el.innerHTML=incomingTrades.map(o=>`<div class="item block"><b>${escapeHtml(o.fromName)}</b><div class="desc">Предлагает: ${escapeHtml(o.itemName)} ×${o.qty} за ${o.price} ₽</div><div class="rightbuttons"><button onclick="respondTrade('${o.id}',true)">Принять</button><button onclick="respondTrade('${o.id}',false)">Отклонить</button></div></div>`).join('')||'<div class="mutedbox small">Нет входящих предложений.</div>';}
function respondTrade(offerId,accept){zoneSocket?.emit('trade:respond',{offerId,accept});incomingTrades=incomingTrades.filter(x=>x.id!==offerId);renderIncomingTrades();}
function renderCoopQuests(list){const el=$('coopQuestList');if(!el)return;el.innerHTML=(list||[]).map(q=>{const joined=q.participants?.includes(zonePlayerId),arrived=q.arrivals?.includes(zonePlayerId);return `<div class="item block"><div style="display:flex;justify-content:space-between;gap:8px"><b>${escapeHtml(q.title)}</b><span class="tag">${q.done?'Выполнено':`${q.arrivals?.length||0}/${q.required} прибыли`}</span></div><div class="desc">${escapeHtml(q.description)} · сектор: ${escapeHtml(locationName(q.location))}</div><div class="small">Группа: ${q.participants?.length||0} · награда: ${q.reward} ₽ и ${q.xp} опыта</div><div class="rightbuttons" style="margin-top:7px">${!joined&&!q.done?`<button onclick="joinCoop('${q.id}')">Вступить</button>`:''}${joined&&!arrived&&!q.done?`<button onclick="contributeCoop('${q.id}')">Отметить прибытие</button>`:''}</div></div>`}).join('')||'<div class="mutedbox small">Пока нет совместных заданий.</div>';}
function joinCoop(id){zoneSocket?.emit('coop:join',{questId:id});}
function contributeCoop(id){zoneSocket?.emit('coop:contribute',{questId:id});}
function renderServerChat(){const el=$('mpChat');if(!el)return;if($('localChatHeading'))$('localChatHeading').textContent=`Локальный канал КПК · ${locationName(g.loc)}`;el.innerHTML='';for(const m of serverChat.slice(-80)){const row=document.createElement('div');row.style.padding='5px 8px';const time=new Date(m.time||Date.now()).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});row.textContent=`[${time}] ${m.name}: ${m.text}`;el.appendChild(row);}el.scrollTop=el.scrollHeight;}
function mpSend(){const input=$('mpMessage');const text=input?.value?.trim();if(!text)return;if(!zoneSocket?.connected)return alert('Нет соединения с сервером.');zoneSocket.emit('world:chat:send',{text});input.value='';}
function mpRename(){const n=$('mpName')?.value?.trim();if(!n)return alert('Введи позывной.');g.name=n.slice(0,24);save();if(zoneSocket?.connected)zoneSocket.emit('player:update',{name:g.name,location:g.loc,faction:g.faction});}
function mpSyncLocation(){if(zoneSocket?.connected)zoneSocket.emit('player:update',{location:g.loc,faction:g.faction,name:g.name});}

// Character creation: faction and callsign are chosen before entering the world.
const factionLore={
 'Одиночки':'Вольные исследователи Зоны. Не подчиняются единому командованию и ценят личную свободу.',
 'Долг':'Организованная группировка, стремящаяся сдерживать распространение опасностей Зоны.',
 'Свобода':'Сталкеры, выступающие за свободное исследование Зоны и доступ к её тайнам.',
 'Бандиты':'Разрозненные группы, живущие за счёт сделок, влияния и контроля маршрутов.',
 'Военные':'Силы периметра, поддерживающие установленный порядок и контроль территории.',
 'Учёные':'Исследовательские группы, изучающие аномальные явления и артефакты.',
 'Наёмники':'Контрактники, выполняющие заказы различных клиентов.',
 'Монолит':'Закрытая и крайне враждебная группировка из глубины Зоны.',
 'Чистое небо':'Исследователи, стремящиеся понять природу Зоны.'
};
let setupFaction='Одиночки';
function openCharacterSetup(){
 const root=$('characterSetup');if(!root)return;
 $('setupCallsign').value=g.name==='Новичок'?'':g.name;
 $('setupFactions').innerHTML=g.factions.map(f=>`<button type="button" class="faction-choice ${setupFaction===f.name?'selected':''}" onclick="selectSetupFaction('${f.name.replace(/'/g,"\\'")}')"><b>${f.icon||'◉'} ${f.name}</b><div class="desc">${f.style||''}</div></button>`).join('');
 $('factionDescription').textContent=factionLore[setupFaction]||'Выбранная сторона Зоны.';const spawn=factionSpawn[setupFaction]||'cordon';if($('setupSpawnInfo'))$('setupSpawnInfo').textContent=`Точка появления: ${spawnNames[spawn]||spawn}. Ты начнёшь игру у базы своей группировки.`;
 root.classList.add('show');
}
function selectSetupFaction(name){const current=$('setupCallsign').value;setupFaction=name;openCharacterSetup();$('setupCallsign').value=current;}
function confirmCharacter(){
 const name=$('setupCallsign').value.trim().replace(/[<>]/g,'').slice(0,24);
 if(name.length<2)return alert('Позывной должен содержать минимум 2 символа.');
 if(!g.factions.some(f=>f.name===setupFaction))return alert('Выбери группировку из списка.');
 g.name=name;g.faction=setupFaction;g.characterCreated=true;const spawn=factionSpawn[setupFaction]||'cordon';g.loc=spawn;g.visitedLocations=[...new Set([...(g.visitedLocations||[]),spawn])];g.worldPosition=null;
 g.news.unshift({day:realClock().day,hour:realClock().time,title:'Регистрация завершена',body:`Сталкер ${name} зарегистрирован в КПК. Группировка: ${setupFaction}.`});
 g.log.unshift(`Позывной: ${name}. Группировка: ${setupFaction}. Начальная база: ${spawnNames[spawn]||spawn}.`);
 $('characterSetup').classList.remove('show');document.body.classList.remove('title-screen-active');save();mpSyncLocation();
}

// Turn-based fictional combat. It uses abstract game stats, not real-world tactics.
let battle=null;
const enemyTemplates=[
 {name:'Псевдособака',icon:'🐺',hp:58,power:9,desc:'Осторожный мутант держится на расстоянии.'},
 {name:'Плоть',icon:'☣',hp:72,power:8,desc:'Неуклюжий, но выносливый обитатель Зоны.'},
 {name:'Группа мародёров',icon:'♟',hp:85,power:10,desc:'Небольшая враждебная группа перекрыла маршрут.'},
 {name:'Кровосос',icon:'◉',hp:92,power:12,desc:'Опасная встреча. Лучше не затягивать столкновение.'},
 {name:'Снорк',icon:'☢',hp:66,power:11,desc:'Непредсказуемый противник из заражённого сектора.'}
];
function equippedWeapon(){return g.items.find(x=>x.name===g.equipment?.weapon&&x.type==='Оружие')||g.items.find(x=>x.type==='Оружие')||null;}
function renderSurvivalHud(){
 const hud=$('survivalHud');if(!hud)return;
 const hp=Math.max(0,Math.min(100,Number(g.hp)||0)),st=Math.max(0,Math.min(100,Number(g.stamina)||0));
 const health=$('hudHealthTicks'),stamina=$('hudStaminaTicks');
 const ticks=(value,kind)=>Array.from({length:28},(_,i)=>`<i class="${i<Math.ceil(value/100*28)?'is-on':''}"></i>`).join('');
 if(health)health.innerHTML=ticks(hp,'health');if(stamina)stamina.innerHTML=ticks(st,'stamina');
 $('hudHealthValue').textContent=Math.round(hp)+'%';$('hudStaminaValue').textContent=Math.round(st)+'%';
 const weapon=equippedWeapon(),name=weapon?.name||'Оружие не выбрано',condition=Math.max(0,Math.min(100,Number(weapon?.condition??0)));
 $('hudWeaponName').textContent=name;$('hudWeaponCondition').textContent=weapon?'Состояние оружия':'Подготовь снаряжение';
 $('hudWeaponConditionValue').textContent=weapon?Math.round(condition)+'%':'—';
 $('hudWeaponConditionFill').style.width=weapon?condition+'%':'0%';
 $('hudWeaponSymbol').textContent=weapon?'▰':'—';
 hud.classList.toggle('hud-no-weapon',!weapon);
}

function weaponPower(item){if(!item)return 8;const n=item.name.toLowerCase();let power=12;if(/гаусс/.test(n))power=27;else if(/свд|сву|винтарь|вс/.test(n))power=22;else if(/гроза|бульдог|рп-74|гп37|ас-96|обокан|трс|ил86|акм/.test(n))power=19;else if(/спса|chaser|protecta|обрез/.test(n))power=20;else if(/форт|кора|удп|пмм|мартышка/.test(n))power=13;return Math.round(power*(Math.max(25,Number(item.condition??75))/100));}
function startRandomEncounter(force=false){
 if(battle)return;
 const chance=force?1:({ 'Низкий':.08,'Средний':.17,'Высокий':.26,'Очень высокий':.34,'Критический':.4 }[here().risk]||.15);
 if(!force&&Math.random()>chance)return;
 const e=clone(enemyTemplates[Math.floor(Math.random()*enemyTemplates.length)]);
 const scale=Math.max(.8,Math.min(1.5,1+(g.xp/800)));
 battle={enemy:{...e,hp:Math.round(e.hp*scale),maxHp:Math.round(e.hp*scale)},guard:false,log:[],turn:1};
 $('combatTitle').textContent='Контакт в секторе «'+here().name+'»';$('combatRisk').textContent=here().risk;
 $('combatOverlay').classList.add('show');combatLog('Контакт! '+e.desc);renderCombat();
}
function startNpcEncounter(id){
 if(battle)return;const n=npcBy(id);if(!n||n.alive===false)return alert('Этот сталкер больше не представляет угрозы.');
 if((n.loc||n.location)!==g.loc)return alert('Противник должен находиться в текущем секторе.');
 if(!isHostileNpcFaction(n.faction))return alert('Этот сталкер не является твоим врагом.');
 const hp=Math.max(35,Math.round(Number(n.health)||80));
 battle={npcId:id,enemy:{name:n.name,icon:n.icon||'♟',hp,maxHp:hp,power:8+Math.floor(Math.random()*6),desc:`Враждебный сталкер группировки «${n.faction}» вступил в бой.`},guard:false,log:[],turn:1};
 $('combatTitle').textContent='Бой со сталкером · '+here().name;$('combatRisk').textContent=n.faction;$('combatOverlay').classList.add('show');combatLog(`${n.name} (${n.faction}) открыл огонь. Контакт подтверждён.`);renderCombat();
}
function combatLog(text){if(!battle)return;battle.log.unshift(text);battle.log=battle.log.slice(0,12);$('combatLog').innerHTML=battle.log.map(x=>`<div>${escapeHtml(x)}</div>`).join('');}
function renderCombat(){if(!battle)return;const e=battle.enemy;$('enemyName').textContent=e.name;$('enemyIcon').textContent=e.icon;$('enemyDesc').textContent=e.desc;$('enemyHpText').textContent=Math.max(0,e.hp)+' / '+e.maxHp;$('enemyHpBar').style.width=Math.max(0,e.hp/e.maxHp*100)+'%';$('playerHpText').textContent=g.hp+'%';$('playerHpBar').style.width=g.hp+'%';const w=equippedWeapon();$('combatWeapon').textContent=w?`${w.name} · сила ${weaponPower(w)} · состояние ${w.condition??'—'}%`:'Нет оружия · сила 8';}
function finishCombat(result){if(!battle)return;const name=battle.enemy.name;if(result==='win'&&battle.npcId){const target=npcBy(battle.npcId);if(target){target.alive=false;target.health=0;target.action='dead';target.deathCause=`погиб в столкновении со сталкером ${g.name}`;}if(zoneSocket?.connected)zoneSocket.emit('npc:combat:kill',{npcId:battle.npcId});serverWorld?.npcState?.[battle.npcId]&&(serverWorld.npcState[battle.npcId].alive=false,serverWorld.npcState[battle.npcId].health=0,serverWorld.npcState[battle.npcId].action='dead');}if(result==='win'){ const reward=60+Math.floor(Math.random()*100),xp=18+Math.floor(Math.random()*16);g.money+=reward;g.xp+=xp;log(`Столкновение завершено: ${name}. Награда ${reward} ₽ и ${xp} опыта.`);news('Сводка столкновения',`${g.name} пережил встречу с угрозой в районе «${here().name}».`);}else if(result==='escape'){log('Ты отступил и избежал дальнейшего столкновения.');g.stamina=Math.max(0,g.stamina-8);}else{g.hp=15;log('Столкновение завершилось неудачно. Ты смог отойти, но потерял часть здоровья.');}
 battle=null;$('combatOverlay').classList.remove('show');save();}
function enemyTurn(){if(!battle)return;const baseDamage=battle.enemy.power+Math.floor(Math.random()*5);const armor=g.items.find(x=>x.name===g.equipment?.suit&&x.type==='Броня');const defense=armor?Math.round((Number(armor.condition??70)/100)*(Number(armor.defense)||4)):0;const damage=Math.max(2,baseDamage-defense-(battle.guard?Math.round(baseDamage*.65):0));battle.guard=false;g.hp=Math.max(0,g.hp-damage);if(armor&&damage>0)armor.condition=Math.max(0,Number(armor.condition??100)-Math.max(1,Math.ceil(damage/12)));combatLog(`${battle.enemy.name} наносит условный урон: −${damage} здоровья. Броня: ${armor?Math.round(armor.condition)+'%':'не надета'}.`);if(g.hp<=0){g.hp=15;finishCombat('loss');return;}renderCombat();}
function combatAction(action){if(!battle)return;
 if(action==='retreat'){if(Math.random()<.68){finishCombat('escape');return;}combatLog('Отступление не удалось: противник не даёт пройти.');enemyTurn();return;}
 if(action==='guard'){battle.guard=true;combatLog('Ты занял защитную позицию. Следующий ответный урон будет снижен.');enemyTurn();return;}
 if(action==='med'){const med=g.items.find(x=>x.id==='med'&&x.qty>0)||g.items.find(x=>x.type==='Медицина'&&x.qty>0);if(!med)return alert('В рюкзаке нет аптечки.');med.qty--;g.hp=Math.min(100,g.hp+32);combatLog('Использована аптечка: здоровье восстановлено.');enemyTurn();save();return;}
 const w=equippedWeapon(),power=weaponPower(w),damage=Math.max(4,power+Math.floor(Math.random()*9)-3);battle.enemy.hp=Math.max(0,battle.enemy.hp-damage);if(w&&w.condition!=null)w.condition=Math.max(0,w.condition-1);combatLog(`Ты провёл игровую атаку. Противник потерял ${damage} очков здоровья.`);
 if(battle.enemy.hp<=0){renderCombat();finishCombat('win');return;}enemyTurn();save();
}


const originalFinishCombat=finishCombat;
finishCombat=function(result){if(result==='win'){g.careerStats||={};g.careerStats.kills=(g.careerStats.kills||0)+1;rankRecentEvents.unshift({name:g.name,text:'Победа в столкновении. Личный рейтинг обновлён.'});rankRecentEvents=rankRecentEvents.slice(0,12);if($('ranks')?.classList.contains('active'))renderStalkerLeaderboard();}return originalFinishCombat(result);};
const originalTravel=travel;
travel=function(id){const before=g.loc;originalTravel(id);if(g.loc!==before){g.careerStats||={};g.careerStats.travelled=(g.careerStats.travelled||0)+1;g.visitedLocations||=[before];if(!g.visitedLocations.includes(g.loc))g.visitedLocations.push(g.loc);save();setTimeout(()=>startRandomEncounter(false),120);}};
const originalExplore=explore;
explore=function(){if(battle)return;originalExplore();if(!battle)setTimeout(()=>startRandomEncounter(false),80);};


// LIVING ZONE 4.2 — persistent local simulation layer.
function initLivingState(){
 g.relationships ||= {}; g.factionRanks ||= {}; g.contracts ||= [
  {id:"supply_cordon",title:"Снабжение Кордона",giver:"Сидорович",loc:"cordon",desc:"Передай 2 единицы металлолома торговцу.",item:"scrap",qty:2,reward:260,xp:30,rep:4},
  {id:"scout_dump",title:"Разведка Свалки",giver:"Разведчик",loc:"dump",desc:"Посети Свалку и подтверди маршрут.",item:null,qty:0,reward:190,xp:24,rep:3},
  {id:"science_yantar",title:"Образцы для лаборатории",giver:"Профессор Сахаров",loc:"yantar",desc:"Доставь один артефакт на Янтарь.",item:"artifact",qty:1,reward:480,xp:55,rep:7}
 ];
 g.patrols ||= []; g.campFeed ||= []; g.emission ||= {active:false,warning:false}; g.worldTick ||= 0;
 for(const n of g.npcs){if(g.relationships[n.id]===undefined)g.relationships[n.id]=0;}
}
function livingNews(title,body){const clock=realClock();g.news.unshift({day:clock.day,hour:clock.time,title,body});g.news=g.news.slice(0,60);g.campFeed.unshift({title,body,day:g.day});g.campFeed=g.campFeed.slice(0,12);}
function livingRank(){let xp=g.xp||0;return xp>=900?"Ветеран":xp>=500?"Старший боец":xp>=250?"Боец":xp>=100?"Новобранец":"Рекрут";}
function renderLivingZone(){
 if(!$("livingStats"))return; initLivingState();
 $("livingStats").innerHTML=[["Сектор",here().name],["Активные контракты",g.contracts.filter(c=>c.accepted&&!c.done).length],["События лагеря",g.campFeed.length]].map(x=>`<div class="stat"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join("");
 $("npcRelations").innerHTML=g.npcs.slice(0,18).map(n=>{let v=g.relationships[n.id]||0;return `<div class="item"><div><b>${escapeHtml(n.icon||"◉")} ${escapeHtml(n.name)}</b><div class="desc">${escapeHtml(n.role)} · отношение ${v>0?"+":""}${v}</div></div><button onclick="livingTalk('${n.id}')">Совместный привал · 50 ₽</button></div>`}).join("");
 $("factionRank").innerHTML=`<b>${escapeHtml(g.faction)} · ${livingRank()}</b><div class="desc">Опыт: ${g.xp} · Репутация: ${g.rep}. Следующий ранг открывается с ростом опыта и выполнением поручений.</div>`;
 $("contracts").innerHTML=g.contracts.map(c=>`<div class="item block"><b>${escapeHtml(c.title)}</b><div class="desc">${escapeHtml(c.desc)} · ${c.reward} ₽ / ${c.xp} XP</div><span class="tag">${c.done?"Выполнен":c.accepted?"В работе":"Доступен"}</span><div class="rightbuttons">${!c.accepted&&!c.done?`<button onclick="livingAccept('${c.id}')">Взять контракт</button>`:""}${c.accepted&&!c.done?`<button onclick="livingComplete('${c.id}')">Сдать контракт</button>`:""}</div></div>`).join("");
 $("patrols").innerHTML=g.patrols.slice(0,8).map(p=>`<div class="item"><span>🪖 ${escapeHtml(p.faction)} · ${escapeHtml(g.locations.find(l=>l.id===p.loc)?.name||p.loc)}</span><b>${p.strength} бойцов</b></div>`).join("")||'<div class="mutedbox small">Патрули пока не отмечены. Проверь обстановку.</div>';
 $("patrols").innerHTML += g.locations.map(l=>`<div class="item"><span>${escapeHtml(l.name)} · ${escapeHtml(l.owner)} · ${l.control}%</span>${l.owner!==g.faction?`<button onclick="livingTerritory('${l.id}')">Влияние · 350 ₽</button>`:""}</div>`).join("");
 const eco=serverWorld?.ecosystem;
 const packs=(eco?.mutantPacks||[]).filter(p=>p.location===g.loc);
 const bases=Object.values(eco?.bases||{}).filter(b=>b.faction===g.faction);
 const clans=Object.values(eco?.clans||{}).filter(c=>c.faction===g.faction);
 $("campFeed").innerHTML=g.campFeed.slice(0,6).map(e=>`<div class="item"><b>${escapeHtml(e.title)}</b><div class="desc">${escapeHtml(e.body)}</div></div>`).join("")||'<div class="mutedbox small">У костра пока тихо.</div>';
 $("campFeed").innerHTML += `<div class="section">Экосистема сектора</div><div class="item"><b>Мутанты поблизости: ${packs.reduce((a,p)=>a+p.count,0)}</b><div class="desc">${packs.map(p=>`${escapeHtml(p.species)} ×${p.count}`).join(' · ')||'Следов мутантов поблизости не обнаружено.'}</div><div class="desc">Аномальных полей: ${(eco?.anomalies||[]).filter(a=>a.location===g.loc).length}</div></div><div class="section">Базы группировки</div>${bases.map(b=>`<div class="item"><b>${escapeHtml(locationName(b.location))} · уровень ${b.level}</b><div class="desc">Укрепления ${b.fortification}% · припасы ${b.supplies}%</div><button onclick="upgradeZoneBase('${b.location}')">Улучшить · 500 ₽</button></div>`).join('')||'<div class="mutedbox small">У группировки пока нет зарегистрированных баз.</div>'}<div class="section">Кланы</div><div class="item"><b>Кланов твоей группировки: ${clans.length}</b><div class="desc">${clans.map(c=>`${escapeHtml(c.name)} · ${c.members.length} участников`).join(' · ')||'Создай клан, чтобы собирать отряд.'}</div><button onclick="createZoneClan()">Создать клан</button></div>`;
 renderSurvival();
}
function upgradeZoneBase(location){if(!zoneSocket?.connected)return alert('Для улучшения базы нужно подключение к серверу.');zoneSocket.emit('base:upgrade',{location});}
function createZoneClan(){const name=prompt('Название клана (3–24 символа):');if(!name)return;if(!zoneSocket?.connected)return alert('Для создания клана нужно подключение к серверу.');zoneSocket.emit('clan:create',{name});}
function livingTalk(id){initLivingState();let n=npcBy(id);if(!n)return;if((n.loc||n.location)!==g.loc)return alert("Для совместного привала NPC должен находиться в твоём секторе.");g.relationshipCooldowns ||= {};const now=Date.now(),last=Number(g.relationshipCooldowns[id]||0);if(now-last<6*3600000)return alert("Вы уже проводили время вместе. Следующая встреча возможна через несколько часов.");if(g.money<50)return alert("Нужно 50 ₽ на общий привал и припасы.");g.money-=50;g.relationshipCooldowns[id]=now;g.relationships[id]=Math.min(100,(g.relationships[id]||0)+1);livingNews("Совместный привал: "+n.name,`Вы поделились припасами и поговорили у костра. Отношение изменилось незначительно: ${g.relationships[id]}.`);log("Совместный привал с "+n.name+" обошёлся в 50 ₽.");save();}
function initSurvival(){g.survival ||= {lastTickAt:Date.now(),events:[],kit:null,lastHuntAt:0,shelterUntil:0};g.survival.events ||= [];g.survival.lastTickAt ||= Date.now();}
function survivalEvent(text,danger=false){initSurvival();g.survival.events.unshift({text:String(text).slice(0,220),at:Date.now(),danger:!!danger});g.survival.events=g.survival.events.slice(0,8);}
function tickSurvival(){initSurvival();const now=Date.now(),elapsed=Math.max(0,Math.min(180*60000,now-g.survival.lastTickAt));if(elapsed<60000)return;const result=window.ZoneSurvival.advanceNeeds(g,elapsed,g.atmosphereState?.weather||'overcast');g.survival.lastTickAt=now;if(g.emission?.active&&now-Number(g.survival.lastEmissionDamageAt||0)>=60000){const suit=(g.items||[]).find(x=>x.name===g.equipment?.suit&&x.type==='Броня'),protection=Number(suit?.defense||0)*5,damage=window.ZoneSurvival.emissionDamage(g.survival.shelterUntil>now,protection);g.hp=Math.max(1,g.hp-damage.hp);g.radiation=Math.min(100,radiationLevel()+damage.radiation);g.stamina=Math.max(0,g.stamina-damage.stamina);g.survival.lastEmissionDamageAt=now;if(damage.hp)survivalEvent('Выброс накрыл сектор: здоровье, выносливость и защита от радиации под угрозой.',true);}if(g.thirst>=85)survivalEvent('Сильная жажда снижает выносливость. Найди воду.',true);if(g.hunger>=85)survivalEvent('Запасы энергии на исходе. Нужно поесть.',true);if(result.damage){survivalEvent('Истощение нанесло урон здоровью: '+result.damage+'.',true);log('Здоровье ухудшилось из-за голода или жажды.');}save();}
function renderSurvival(){initSurvival();const el=$('survivalVitals');if(!el)return;const rows=[['Голод',g.hunger||0],['Жажда',g.thirst||0],['Выносливость',g.stamina||0],['Радиация',radiationLevel()]];el.innerHTML=rows.map(([n,v])=>`<div class="stat"><span>${n}</span><strong>${Math.round(v)}%</strong><div class="survival-meter ${v>=80?'warning':''}"><i style="width:${Math.max(0,Math.min(100,v))}%"></i></div></div>`).join('');const suit=(g.items||[]).find(x=>x.name===g.equipment?.suit&&x.type==='Броня');const report=$('survivalReport');if(report)report.textContent=`Защита костюма: ${suit?.condition??100}% · ${g.survival.shelterUntil>Date.now()?'Ты находишься в укрытии.':'Ты вне укрытия.'}`;const kit=$('expeditionKitStatus');if(kit)kit.textContent=g.survival.kit?'Рюкзак собран: 1 паёк и 1 бутылка воды.':'Рюкзак не подготовлен. Нужны сухой паёк и вода.';const events=$('survivalEvents');if(events)events.innerHTML=g.survival.events.slice(0,5).map(e=>`<div class="survival-event ${e.danger?'danger':''}"><small>${new Date(e.at).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</small> ${escapeHtml(e.text)}</div>`).join('')||'<div class="mutedbox small">Пока без происшествий.</div>';}
function prepareExpedition(){initSurvival();if(g.survival.kit)return alert('Рюкзак уже подготовлен.');if(!count('ration')||!count('water'))return alert('Нужны 1 сухой паёк и 1 бутылка воды.');take('ration',1);take('water',1);g.survival.kit={rations:1,water:1,preparedAt:Date.now()};survivalEvent('Ты уложил сухой паёк и воду в экспедиционный рюкзак.');log('Экспедиционный рюкзак подготовлен.');save();renderInventory();}
function survivalCamp(){initSurvival();if(g.survival.shelterUntil>Date.now())return alert('Ты уже отдыхаешь в укрытии.');if(!take('tea',1)&&!take('water',1))return alert('Для привала нужен термос чая или бутылка воды.');g.stamina=Math.min(100,(g.stamina||0)+28);g.hunger=Math.max(0,(g.hunger||0)-7);g.thirst=Math.max(0,(g.thirst||0)-16);g.survival.shelterUntil=Date.now()+5*60000;survivalEvent('Полевой привал: ты восстановил силы и укрылся на пять минут.');log('Полевой привал помог восстановить силы.');save();renderInventory();}
function survivalShelter(){initSurvival();const safe=['cordon','bar','yantar','swamps','army'].includes(g.loc);if(!safe&&Math.random()<.65)return alert('Укрытие не найдено. Осмотри сектор или вернись к базе.');g.survival.shelterUntil=Date.now()+10*60000;survivalEvent('Найдено укрытие. На десять минут ты защищён от открытого воздействия выброса.');livingNews('Укрытие найдено','Ты занял защищённую позицию в секторе '+here().name+'.');save();}
function huntMutants(){initSurvival();if(Date.now()-g.survival.lastHuntAt<60000)return alert('После последней охоты нужно восстановиться. Подожди минуту.');const eco=ecologyData(),pack=(eco.mutantPacks||[]).find(x=>x.location===g.loc&&x.count>0);if(!pack)return alert('В этом секторе не обнаружено доступных групп мутантов. Проведи осмотр местности.');const weapon=String(g.equipment?.weapon||'');if(!weapon)return alert('Нужно экипировать оружие.');if(g.stamina<18)return alert('Для охоты нужно минимум 18 выносливости.');if(zoneSocket?.connected&&zonePlayerReady){zoneSocket.emit('survival:hunt',{packId:pack.id});return;}const result=window.ZoneSurvival.resolveHunt(pack,/АК|винтов|руж|СВД|Гроза/i.test(weapon)?75:45,g.stamina,Math.random());g.survival.lastHuntAt=Date.now();g.stamina=Math.max(0,g.stamina-18);if(result.ok){pack.count=Math.max(0,pack.count-1);addItem('mutant_trophy','Трофей мутанта','Материал','Добыча после охоты на мутанта.',.8,110);g.xp+=18;g.money+=35;survivalEvent(`Охота успешна: ${pack.species}. Получен трофей, +18 опыта и 35 ₽.`);log(`Охота на ${pack.species} завершилась успешно.`);}else{g.hp=Math.max(1,g.hp-result.damage);survivalEvent(result.reason+' Потеряно здоровья: '+result.damage+'.',true);log('Мутанты отбросили тебя.');}save();renderInventory();renderLivingZone();if($('world')?.classList.contains('active'))renderZoneMap();}
function consumeExpeditionSupplies(risk){initSurvival();const kit=g.survival.kit,cost=window.ZoneSurvival.expeditionCost(risk,g.atmosphereState?.weather||'clear',!!g.emission?.active);if(kit?.rations&&kit?.water){g.hunger=Math.max(0,g.hunger-8);g.thirst=Math.max(0,g.thirst-18);g.survival.kit=null;}else{cost.stamina+=8;cost.hunger+=5;cost.thirst+=7;survivalEvent('Ты отправился без полноценного запаса припасов. Переход оказался тяжелее.',true);}g.stamina=Math.max(0,g.stamina-cost.stamina);g.hunger=Math.min(100,g.hunger+cost.hunger);g.thirst=Math.min(100,g.thirst+cost.thirst);g.radiation=Math.min(100,radiationLevel()+cost.radiation);if(g.stamina<=0){g.hp=Math.max(1,g.hp-4);survivalEvent('Переход истощил тебя. Получено 4 урона.',true);}}
function localEcology(){const zones=['cordon','swamps','dump','bar','agro','dark','yantar','army','red','pripyat','zaton','jupiter','radar','wild','darkhollow','limansk','chaes'];const species=['плоть','псевдособака','кабан','снорк','контролёр','кровосос','тушкан','зомбированный сталкер'];const kinds=['Электра','Жарка','Воронка','Кисель','Трамплин','Карусель','Пузырь','Пси-поле'];return {mutantPacks:zones.map((location,i)=>({id:'local_pack_'+i,location,species:species[(i*3)%species.length],count:2+(i*5)%6,aggression:30+(i*13)%70})),anomalies:zones.map((location,i)=>({id:'local_anomaly_'+i,location,kind:kinds[(i*5)%kinds.length],danger:35+(i*17)%65}))};}
function ecologyData(){if(zoneSocket?.connected&&serverWorld?.ecosystem)return serverWorld.ecosystem;g.localEcology ||= (serverWorld?.ecosystem?clone(serverWorld.ecosystem):localEcology());return g.localEcology;}
let fieldSurveyTimer=null;
function initFieldwork(){g.fieldNotes ||= [];g.fieldSurvey ||= null;g.artifactSearchAt ||= 0;initSurvival();}
function renderFieldwork(){initFieldwork();const notes=$('fieldNotes');if(notes)notes.innerHTML=g.fieldNotes.slice(0,12).map(n=>`<div class="item block"><b>${escapeHtml(n.place)} · ${escapeHtml(n.time)}</b><div class="desc">${escapeHtml(n.text)}</div></div>`).join('')||'<div class="mutedbox small">Записей пока нет.</div>';const status=$('surveyStatus');if(status){const s=g.fieldSurvey;if(s&&s.location!==g.loc){g.fieldSurvey=null;if(fieldSurveyTimer){clearInterval(fieldSurveyTimer);fieldSurveyTimer=null;}status.textContent='Осмотр прерван: ты покинул сектор до завершения.';livingNews('Разведка прервана','Ты покинул сектор до окончания осмотра. Собранные данные не засчитаны.');save();}else if(s&&s.endsAt>Date.now()){const left=Math.ceil((s.endsAt-Date.now())/1000);status.textContent=`Осмотр сектора продолжается: ${left} сек. Осталось.`;if(!fieldSurveyTimer)fieldSurveyTimer=setInterval(()=>{renderFieldwork();if(!g.fieldSurvey||g.fieldSurvey.endsAt<=Date.now()){clearInterval(fieldSurveyTimer);fieldSurveyTimer=null;finishAreaSurvey();}},1000);}else if(s&&s.endsAt<=Date.now()){status.textContent='Осмотр завершён. Обрабатываем наблюдения…';finishAreaSurvey();}else status.textContent='Разведка не проводится.';}}
function startAreaSurvey(){initFieldwork();if(g.fieldSurvey&&g.fieldSurvey.endsAt>Date.now())return alert('Осмотр уже проводится.');if(g.stamina<12)return alert('Нужно минимум 12 выносливости для разведки.');g.stamina-=12;g.fieldSurvey={location:g.loc,startedAt:Date.now(),endsAt:Date.now()+60000};livingNews('Начат осмотр местности',`Ты начал 60-секундную разведку сектора «${here().name}». Не покидай сектор до завершения.`);if($('fieldworkStatus'))$('fieldworkStatus').textContent='Разведка началась. Не покидай сектор; результаты появятся через 60 секунд.';save();renderFieldwork();}
function finishAreaSurvey(){initFieldwork();const s=g.fieldSurvey;if(!s||s.endsAt>Date.now())return;g.fieldSurvey=null;const points=g.keyPoints?.[s.location]||[],unknown=points.filter(p=>!p.discovered);let report=[];if(unknown.length){const count=Math.min(2,unknown.length);for(let i=0;i<count;i++){const index=Math.floor(Math.random()*unknown.length),p=unknown.splice(index,1)[0];p.discovered=true;report.push(p.name);}}const ecology=ecologyData(),packs=(ecology.mutantPacks||[]).filter(p=>p.location===s.location),anomalies=(ecology.anomalies||[]).filter(a=>a.location===s.location);const body=`Разведка завершена. ${report.length?`Обнаружены точки: ${report.join(', ')}.`:'Новых ориентиров не найдено.'} Следы мутантов: ${packs.reduce((n,p)=>n+p.count,0)}. Аномальных сигналов: ${anomalies.length}.`;g.fieldSurveyReport={location:s.location,at:Date.now(),points:report,mutants:packs.length,anomalies:anomalies.length};g.xp+=18;livingNews('Отчёт разведки',body);if($('fieldworkStatus'))$('fieldworkStatus').textContent=body;log(body);zoneMapDirty=true;save();renderKeyPoints();renderFieldwork();if($('world')?.classList.contains('active'))renderZoneMap();}
function searchArtifacts(){initFieldwork();const detector=g.items.find(x=>x.id==='detector'&&x.qty>0)||g.items.find(x=>x.type==='Детектор'&&x.qty>0);if(!detector)return alert('Для поиска нужен детектор. Купи или найди его перед вылазкой.');if(g.stamina<10)return alert('Недостаточно выносливости: требуется 10.');if(Date.now()-Number(g.artifactSearchAt||0)<20000)return alert('Детектор перегревается. Подожди 20 секунд между сканированиями.');g.stamina-=10;g.artifactSearchAt=Date.now();const anomalies=(ecologyData().anomalies||[]).filter(a=>a.location===g.loc);const discovered=(g.keyPoints?.[g.loc]||[]).filter(p=>p.discovered&&/аномал|исслед|поле/i.test(p.kind+' '+p.name)).length;const chance=Math.min(.72,.16+anomalies.length*.055+discovered*.025+(Number(detector.condition??80)>60?.08:0));const roll=Math.random();let msg;if(roll<chance){const loot=[['artifact_medusa','Медуза',.6,420],['artifact_dummy','Пустышка',.5,650],['artifact_meat','Ломоть мяса',.7,540],['artifact_flash','Вспышка',.4,1450],['artifact_flower','Каменный цветок',.8,1100],['artifact_nightstar','Ночная звезда',1.1,1900],['artifact_soul','Душа',.9,2500],['artifact_goldfish','Золотая рыбка',1.4,3200]];const rare=Math.random()<.12,entry=rare?loot[Math.floor(4+Math.random()*4)]:loot[Math.floor(Math.random()*5)];addItem(entry[0],entry[1],'Артефакт','Обнаружен детектором при полевом сканировании.',entry[2],entry[3]);g.flags.foundArtifact=true;g.xp+=28;msg=`Детектор поймал устойчивый сигнал. Найден артефакт «${entry[1]}».`; }else if(roll<chance+.24){msg='Сканер зафиксировал аномальный фон, но точный сигнал артефакта потерян. Попробуй осмотреть сектор внимательнее.';}else msg='Сигналов артефактов не обнаружено. Сместись к аномальному полю или повтори поиск позже.';livingNews('Результат поиска артефактов',msg);log(msg);if($('fieldworkStatus'))$('fieldworkStatus').textContent=msg;save();renderFieldwork();renderInventory();}
function addFieldNote(){initFieldwork();const input=$('fieldNoteInput'),text=String(input?.value||'').trim();if(!text)return alert('Сначала напиши заметку.');const clock=realClock();g.fieldNotes.unshift({id:'note_'+Date.now(),location:g.loc,place:here().name,time:clock.time,text:text.slice(0,600),at:Date.now()});g.fieldNotes=g.fieldNotes.slice(0,100);if(input)input.value='';livingNews('Запись в личном блокноте',`Ты записал наблюдение о секторе «${here().name}».`);save();renderFieldwork();}
function livingAccept(id){let c=g.contracts.find(x=>x.id===id);if(!c||c.done)return;c.accepted=true;livingNews("Контракт принят",c.title+" · заказчик: "+c.giver);save();}
function livingComplete(id){let c=g.contracts.find(x=>x.id===id);if(!c||!c.accepted||c.done)return;if(g.loc!==c.loc)return alert("Для сдачи контракта вернись в сектор: "+(g.locations.find(l=>l.id===c.loc)?.name||c.loc));if(c.item&&count(c.item)<c.qty)return alert("Не хватает предметов: "+c.item+" ×"+c.qty);if(c.item)take(c.item,c.qty);c.done=true;g.money+=c.reward;g.xp+=c.xp;g.rep+=c.rep;livingNews("Контракт выполнен",`${c.title}. Получено ${c.reward} ₽ и ${c.xp} опыта.`);save();}
function livingCamp(){initLivingState();g.stamina=Math.min(100,g.stamina+16);let nearby=nearbyNpcs(),n=nearby[Math.floor(Math.random()*Math.max(1,nearby.length))];let stories=["У костра спорят о безопасной тропе через соседний сектор.","Кто-то рассказывает историю о тайнике, который появляется на старых картах.","Сталкеры делятся припасами и обсуждают последние новости КПК.","Незнакомец предлагает обменяться сведениями о патрулях."];let body=stories[Math.floor(Math.random()*stories.length)];if(n){g.relationships[n.id]=Math.min(100,(g.relationships[n.id]||0)+2);body+=` ${n.name} стал относиться к тебе немного теплее.`;}livingNews("Вечер у костра",body);save();}
function livingRumor(){let rumors=["На Свалке видели усиленный патруль Бандитов.","Торговцы ждут караван с медикаментами на Кордоне.","Учёные отмечают рост аномальной активности на Янтаре.","На севере ищут проводника, знающего обходные тропы.","Говорят, контроль над одним из лагерей скоро изменится."];livingNews("Слух КПК",rumors[Math.floor(Math.random()*rumors.length)]);g.rep+=1;save();}
function livingPatrol(){initLivingState();let factions=g.factions.map(f=>f.name),faction=factions[Math.floor(Math.random()*factions.length)],loc=g.locations[Math.floor(Math.random()*g.locations.length)].id;g.patrols.unshift({faction,loc,strength:2+Math.floor(Math.random()*7),at:Date.now()});g.patrols=g.patrols.slice(0,12);livingNews("Обновление патрулей",`Разведка заметила отряд группировки «${faction}» в секторе ${g.locations.find(l=>l.id===loc).name}.`);save();}
function livingEmissionShelter(){initLivingState();initSurvival();if(!g.emission.active&&!g.emission.warning)return alert("Сейчас выброса нет. По КПК поступают обычные фоновые сигналы.");g.survival.shelterUntil=Date.now()+10*60000;g.emission.warning=false;if(g.emission.active){const suit=(g.items||[]).find(x=>x.name===g.equipment?.suit&&x.type==='Броня'),damage=window.ZoneSurvival.emissionDamage(true,Number(suit?.defense||0)*5);g.emission.active=false;g.survival.lastEmissionDamageAt=Date.now();livingNews("Пережитый выброс","Ты успел укрыться. Укрытие погасило основной удар, но сектор остаётся опасным.");}else livingNews("Укрытие подготовлено","Ты нашёл укрытие до начала выброса. Следующая волна не застанет тебя на открытом месте.");survivalEvent('Ты укрылся от выброса на десять минут.');save();}
function livingTerritory(id){let l=g.locations.find(x=>x.id===id);if(!l)return;if(l.owner===g.faction)return alert("Этот сектор уже под влиянием твоей группировки.");if(g.money<350)return alert("Нужно 350 ₽ на снабжение операции.");g.money-=350;l.control=Math.min(100,l.control+25);if(l.control>=100){let old=l.owner;l.owner=g.faction;l.control=55;livingNews("Смена контроля",`${l.name}: влияние перешло от «${old}» к «${g.faction}».`);g.rep+=8;}else livingNews("Операция влияния",`${g.faction} укрепляет позиции в секторе ${l.name}. Контроль: ${l.control}%.`);save();}
function livingWorldTick(){initLivingState();initSurvival();g.worldTick++;if(g.emission.active){g.emission.active=false;g.emission.cooldownUntil=Date.now()+30*60000;livingNews("Выброс отступил","Основная волна прошла. Остаточный фон ещё опасен; проверь радиацию и состояние снаряжения.");}else if(g.emission.warning){if(Math.random()<.6){g.emission.warning=false;g.emission.active=true;const suit=(g.items||[]).find(x=>x.name===g.equipment?.suit&&x.type==='Броня'),damage=window.ZoneSurvival.emissionDamage(g.survival.shelterUntil>Date.now(),Number(suit?.defense||0)*5);g.hp=Math.max(1,g.hp-damage.hp);g.radiation=Math.min(100,radiationLevel()+damage.radiation);g.stamina=Math.max(0,g.stamina-damage.stamina);g.survival.lastEmissionDamageAt=Date.now();livingNews("Выброс","Волна накрыла сектор. Укрытие и защитный костюм смягчают последствия.");}}else if(Date.now()>=Number(g.emission.cooldownUntil||0)&&Math.random()<.16){g.emission.warning=true;livingNews("Предупреждение КПК: выброс","Зафиксирован рост радиационного фона. Найди укрытие и не задерживайся на открытой местности.");}if(Math.random()<.22)livingPatrol();}
initLivingState();

function renderWar(){
 const ops=serverWorld?.warOperations||[],history=serverWorld?.warHistory||[],owners=serverWorld?.territoryOwners||{};
 if(serverWorld?.territoryOwners){for(const l of g.locations){if(owners[l.id])l.owner=owners[l.id];if(serverWorld.territoryControl?.[l.id]!==undefined)l.control=serverWorld.territoryControl[l.id];}renderMap();}
 const active=ops.filter(x=>x.status==='active');
 if($('warStats'))$('warStats').innerHTML=[["Активные операции",active.length],["Твоя сторона",g.faction],["Текущий сектор",here().name]].map(x=>`<div class="stat"><span>${escapeHtml(String(x[0]))}</span><strong style="font-size:15px">${escapeHtml(String(x[1]))}</strong></div>`).join('');
 const current=active.find(x=>x.location===g.loc);
 if($('warCurrent'))$('warCurrent').innerHTML=current?warOperationHtml(current):`<div class="mutedbox small">В секторе ${escapeHtml(here().name)} активной операции нет.</div>${(owners[g.loc]||here().owner)!==g.faction?`<div class="item"><span>Контроль сектора: ${escapeHtml(owners[g.loc]||here().owner)}</span><button onclick="warCreate()">Объявить штурм · 350 ₽</button></div>`:'<div class="mutedbox small">Сектор под контролем твоей группировки. Здесь нельзя объявить штурм.</div>'}`;
 if($('warOperations'))$('warOperations').innerHTML=active.map(warOperationHtml).join('')||'<div class="mutedbox small">Активных операций нет. Фронт пока спокоен.</div>';
 if($('npcWarFeed')){const fronts=(serverWorld?.battlefronts||[]).slice(0,12),convoys=(serverWorld?.convoys||[]).slice(-8).reverse(),bases=(serverWorld?.factionBases||[]).filter(x=>x.total>0).slice(0,8);$('npcWarFeed').innerHTML=[...fronts.map(x=>({title:`${x.attacker} против ${x.defender}`,where:x.location,status:x.status==='active'?'Бой идёт':'Столкновение завершено',type:'⚔'})),...convoys.map(x=>({title:`Караван снабжения · ${x.faction}`,where:x.location,status:x.status==='ambushed'?'Попал в засаду':x.status==='arrived'?'Прибыл':'В пути',type:'▣'})),...bases.map(x=>({title:`База · ${x.faction}`,where:x.location,status:`${x.guards} охрана · ${x.campfire} у костра · ${x.patrols} патруль`,type:'⌂'}))].map(x=>`<div class="item"><div><b>${x.type} ${escapeHtml(x.title)}</b><div class="desc">${escapeHtml(g.locations.find(l=>l.id===x.where)?.name||x.where)} · ${escapeHtml(x.status)}</div></div></div>`).join('')||'<div class="mutedbox small">Боевые столкновения и караваны появятся после обновления мира.</div>';}
 if($('warTerritories'))$('warTerritories').innerHTML=g.locations.map(l=>{let owner=owners[l.id]||l.owner;let control=serverWorld?.territoryControl?.[l.id]??l.control;return `<div class="item"><div><b>${escapeHtml(l.name)}</b><div class="desc">Контроль: ${escapeHtml(owner)} · устойчивость ${control}%</div></div><span class="tag">${owner===g.faction?'Свой сектор':'Чужая территория'}</span></div>`}).join('');
 if($('warHistory'))$('warHistory').innerHTML=history.slice(0,12).map(x=>`<div class="item"><div><b>${escapeHtml(g.locations.find(l=>l.id===x.location)?.name||x.location)}</b><div class="desc">${escapeHtml(x.attacker)} против ${escapeHtml(x.defender)} · победитель: ${escapeHtml(x.winner)}</div></div><span class="tag">${x.captured?'Захват':'Оборона'}</span></div>`).join('')||'<div class="mutedbox small">История сражений пока пуста.</div>';
}
function warOperationHtml(op){const mine=op.participants?.some(x=>x.playerId===zonePlayerId);const side=g.faction===op.attacker?'attack':g.faction===op.defender?'defend':null;const commander=op.createdBy===zonePlayerId;const location=g.locations.find(l=>l.id===op.location);return `<div class="item block"><div class="row" style="justify-content:space-between;align-items:center"><b>⚔ ${escapeHtml(location?.name||op.location)}</b><span class="tag">${op.phase==='mobilization'?'Сбор отрядов':'После боя'}</span></div><div class="desc">${escapeHtml(op.attacker)} ⚔ ${escapeHtml(op.defender)}</div><div class="grid three"><div class="stat"><span>Штурм</span><strong>${op.attackScore}</strong></div><div class="stat"><span>Оборона</span><strong>${op.defenseScore}</strong></div><div class="stat"><span>Бойцы</span><strong>${op.participants?.length||0}</strong></div></div><div class="desc">${(op.log||[]).slice(-3).map(x=>escapeHtml(x.text)).join('<br>')}</div><div class="rightbuttons">${side&&!mine&&op.status==='active'&&g.loc===op.location?`<button onclick="warDeploy('${op.id}','${side}')">${side==='attack'?'Вступить в штурм':'Встать на защиту'} · 100 ₽</button>`:''}${commander&&op.status==='active'?`<button onclick="warResolve('${op.id}')">Подвести итог</button>`:''}${mine?'<span class="tag">Ты в операции</span>':''}</div></div>`}
function warCreate(){if(!zoneSocket?.connected)return alert('Для военной операции нужно подключение к общей Зоне.');const owner=serverWorld?.territoryOwners?.[g.loc]||here().owner;zoneSocket.emit('war:operation:create',{location:g.loc,defender:owner,control:serverWorld?.territoryControl?.[g.loc]??here().control});}
function warDeploy(id,action){if(!zoneSocket?.connected)return alert('Нет связи с сервером.');zoneSocket.emit('war:operation:deploy',{operationId:id,action});}
function warResolve(id){if(!confirm('Завершить операцию и зафиксировать результат?'))return;zoneSocket.emit('war:operation:resolve',{operationId:id});}

function applyWorldSync(sync){
 if(!sync)return;
 if(sync.mode==='snapshot'&&sync.snapshot){serverWorld=sync.snapshot;}
 else if(sync.mode==='delta'&&Array.isArray(sync.events)){for(const ev of sync.events)handleOnlineWorldEvent(ev);}
 if(Number.isFinite(Number(sync.revision))){localStorage.setItem('zoneWorldRevision',String(sync.revision));}
 renderOnlineWorldStatus();
}
function handleOnlineWorldEvent(ev){
 const payload=ev.payload||{};
 if(ev.type==='player_joined'&&payload.player){const n=payload.player.name||'Сталкер';if($('onlineWorldFeed'))$('onlineWorldFeed').innerHTML=`<div class="item"><div><b>${escapeHtml(n)}</b><div class="desc">Подключился к общей Зоне</div></div><span class="tag">Онлайн</span></div>`+$('onlineWorldFeed').innerHTML;}
 else if(ev.type==='player_moved'||ev.type==='player_state_changed'){const name=payload.name||payload.player?.name||'Сталкер';const to=payload.to||payload.player?.location||'';if($('onlineWorldFeed'))$('onlineWorldFeed').innerHTML=`<div class="item"><div><b>${escapeHtml(name)}</b><div class="desc">Изменил положение${to?' · '+escapeHtml(to):''}</div></div><span class="tag">Мир</span></div>`+$('onlineWorldFeed').innerHTML;}
 else if(ev.type==='player_left'){if($('onlineWorldFeed'))$('onlineWorldFeed').innerHTML=`<div class="item"><div><b>${escapeHtml(payload.name||'Сталкер')}</b><div class="desc">Покинул общую Зону</div></div><span class="tag">Офлайн</span></div>`+$('onlineWorldFeed').innerHTML;}
 else if(ev.type==='zone_event'){const e=payload; if(e.title){g.news.unshift({day:realClock().day,hour:realClock().time,title:e.title,body:e.body||'Мировое событие'});g.news=g.news.slice(0,60);renderNews();}}
 if($('onlineWorldFeed')){const children=[...$('onlineWorldFeed').children];children.slice(25).forEach(x=>x.remove());}
}
function renderOnlineWorldStatus(status){
 const s=status||{};const revision=s.revision??Number(localStorage.getItem('zoneWorldRevision')||serverWorld?.revision||0);const npcCount=s.npcCount??Object.values(serverWorld?.npcState||{}).filter(n=>n?.alive).length;const wars=s.activeWars??(serverWorld?.warOperations||[]).filter(x=>x.status==='active').length;const sectors=s.sectors??Object.keys(serverWorld?.territoryOwners||{}).length;
 if($('onlineWorldStats'))$('onlineWorldStats').innerHTML=[["Игроки онлайн",s.online??onlinePlayers.length],["Живые NPC",npcCount],["Активные войны",wars],["Секторы",sectors],["Ревизия мира",revision]].map(([k,v])=>`<div class="stat"><span>${escapeHtml(String(k))}</span><strong>${escapeHtml(String(v))}</strong></div>`).join('');
 if($('worldRevisionLabel'))$('worldRevisionLabel').textContent=`Ревизия ${revision} · ${zoneSocket?.connected?'синхронизация активна':'нет соединения'}`;
}
function requestWorldResync(){if(zoneSocket?.connected)zoneSocket.emit('world:sync',{sinceRevision:Number(localStorage.getItem('zoneWorldRevision')||0)});}

function setOnlineConnectionState(state,message){
 const title=$("mpStatus"),detail=$("mpStatusText");
 if(title)title.textContent=state==="online"?"🟢 Подключено к общей Зоне":state==="connecting"?"🟡 Подключение к серверу…":"🔴 Нет соединения";
 if(detail)detail.textContent=message|| (state==="online"?"Сервер подтвердил вход. Игроки и мир синхронизированы.":state==="connecting"?"Устанавливаем связь и загружаем профиль…":"Сервер недоступен. Проверяем соединение и повторяем попытку.");
}
async function runNetworkCheck(){
 const output=$('mpDiagnosticsResult');if(output)output.textContent='Проверяем сервер и Socket.IO…';
 const isLocal=/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[?::1\]?)$/.test(String(window.location.hostname||''));
 let saved=(localStorage.getItem('zoneServerUrl')||'').trim();
 if(isLocal && /onrender\.com/i.test(saved)){localStorage.removeItem('zoneServerUrl');saved='';}
 const target=saved||(isLocal?window.location.origin:DEFAULT_ZONE_SERVER_URL);
 const checks=[];
 try{
  const healthResponse=await fetch(target.replace(/\/$/,'')+'/health',{cache:'no-store'});
  const health=await healthResponse.json();
  checks.push(`HTTP /health: ${healthResponse.ok&&health.ok?'OK':'ОШИБКА'} · версия ${health.version||'неизвестна'}`);
  const diagResponse=await fetch(target.replace(/\/$/,'')+'/api/diagnostics',{cache:'no-store'});
  const diag=await diagResponse.json();
  checks.push(`Мультиплеер: ${diag.multiplayer?'включён':'не подтверждён'} · игроков онлайн: ${diag.online??'—'}`);
  checks.push('Режим: гостевой вход без регистрации и пароля');
  checks.push(`Socket.IO: ${diag.socketPath||'/socket.io'} · ${Array.isArray(diag.transports)?diag.transports.join(' → '):'неизвестно'} · Node ${diag.node||'неизвестно'}`);
 }catch(error){checks.push(`HTTP /health: ОШИБКА · ${error.message||'сеть недоступна'}`);}
 checks.push(`Браузерный Socket.IO: ${typeof io==='function'?'загружен':'не загружен'}`);
 checks.push(`Адрес подключения: ${target}`);
 checks.push(`Текущее соединение: ${zoneSocket?.connected?'подключено':'не подключено'}`);
 if(output)output.textContent=checks.join(' | ');
 return checks;
}

const IS_LOCAL_ZONE_HOST=/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[?::1\]?)$/.test(String(window.location.hostname||''));
const DEFAULT_ZONE_SERVER_URL=IS_LOCAL_ZONE_HOST?window.location.origin:'https://zone-online-multiplayer.onrender.com';
async function connectZone(){
 const connectAttempt=++zoneConnectAttempt;
 if(IS_LOCAL_ZONE_HOST){const saved=(localStorage.getItem('zoneServerUrl')||'').trim();if(/onrender\.com/i.test(saved))localStorage.removeItem('zoneServerUrl');}
 const queryMatch=String(window.location.search||'').match(/[?&]server=([^&]+)/);let queryServer=null;try{queryServer=queryMatch?decodeURIComponent(queryMatch[1].replace(/\+/g,' ')):null;}catch(error){console.warn('Invalid server URL query parameter:',error.message);}if(queryServer&&!localStorage.getItem('zoneServerUrl')){try{const u=new URL(queryServer);if(['http:','https:'].includes(u.protocol))localStorage.setItem('zoneServerUrl',u.origin);}catch{}}
 let clientReady = typeof io==='function';
 if(!clientReady){
  try{clientReady=window.zoneSocketClientReady?await window.zoneSocketClientReady:(typeof io==='function');}
  catch(error){console.warn('Socket.IO loader failed:',error);clientReady=false;}
 }
 if(connectAttempt!==zoneConnectAttempt)return;
 if(!clientReady || typeof io!=='function'){
  setOnlineConnectionState('connecting','Socket.IO пока не загрузился. Повторяем загрузку автоматически через 3 секунды…');
  if(typeof window.loadZoneSocketClient==='function'){
   window.zoneSocketClientReady=window.loadZoneSocketClient();
   setTimeout(()=>{if(connectAttempt===zoneConnectAttempt)connectZone();},3000);
  }else{
   setOnlineConnectionState('offline','Загрузчик Socket.IO не найден. Обнови страницу или проверь подключение скриптов в index.html.');
  }
  return;
 }
 const sameOrigin=window.location.origin;
 let serverUrl=(localStorage.getItem('zoneServerUrl')||DEFAULT_ZONE_SERVER_URL).trim();
 if(serverUrl){
  try{const parsed=new URL(serverUrl);if(!['http:','https:'].includes(parsed.protocol))throw new Error('Неподдерживаемый протокол');serverUrl=parsed.origin;}
  catch(error){console.warn('Discarding invalid saved multiplayer server URL:',error.message);serverUrl=DEFAULT_ZONE_SERVER_URL;localStorage.setItem('zoneServerUrl',serverUrl);}
 }
 // Do not gate Socket.IO on an HTTP health preflight. Render free instances may
 // be asleep; a slow /health response must never erase the user's configured URL
 // or redirect the client to the static game's origin. Socket.IO will retry below.
 const targetUrl=serverUrl||sameOrigin;
 // A second tap on Connect must not destroy a healthy socket or an in-progress
 // automatic reconnection. Only replace the socket when the target actually changes.
 if(zoneSocket && zoneSocketTarget===targetUrl && (zoneSocket.connected||zoneSocket.active)){
  console.info('ZONE ONLINE: keeping existing Socket.IO connection', {connected:zoneSocket.connected, active:zoneSocket.active, target:targetUrl});
  return;
 }
 zonePlayerReady=false;
 if(zoneSocket){try{zoneSocket.removeAllListeners();zoneSocket.disconnect();}catch{}}
 zoneSocketTarget=targetUrl;
 if(serverUrl && serverUrl!==sameOrigin){
  console.info('Using configured multiplayer server:',serverUrl);
 }
 if($('mpServerUrl') && $('mpServerUrl').value!==serverUrl)$('mpServerUrl').value=serverUrl;
 try{
  // Prefer WebSocket, but allow Socket.IO to fall back to HTTP polling when a
  // proxy or client network blocks WebSocket upgrades.
  zoneSocket=io(serverUrl||undefined,{
   transports:['websocket','polling'],
   tryAllTransports:true,
   timeout:30000,
   reconnection:true,
   reconnectionAttempts:Infinity,
   reconnectionDelay:1000,
   reconnectionDelayMax:15000,
   randomizationFactor:0.5,
   path:'/socket.io/',
   autoConnect:false,
   withCredentials:false
  });
 zoneSocket.on('connect',()=>{console.info('ZONE ONLINE: Socket.IO connected; sending player:hello', {socketId:zoneSocket.id, transport:zoneSocket.io.engine?.transport?.name, playerId:zonePlayerId||'(new guest)'});setOnlineConnectionState('connecting','Связь установлена. Сервер принял соединение, загружаем профиль…');const lastRevision=Number(localStorage.getItem('zoneWorldRevision')||0);zoneSocket.timeout(60000).emit('player:hello',{id:zonePlayerId,state:g,lastRevision,guest:true},(err,result)=>{if(err){setOnlineConnectionState('offline','Сервер установил соединение, но не подтвердил запрос входа. Проверь журналы Render и попробуй переподключиться.');console.error('ZONE ONLINE: player:hello acknowledgement timeout',err);return;}console.info('ZONE ONLINE: player:hello acknowledgement',result);if(!result?.ok){setOnlineConnectionState('offline',result?.message||'Сервер отклонил вход.');return;}setOnlineConnectionState('connecting','Сервер подтвердил запрос. Получаем профиль и состояние Зоны…');if(zoneHelloReadyTimer)clearTimeout(zoneHelloReadyTimer);zoneHelloReadyTimer=setTimeout(()=>{if(zoneSocket?.connected)setOnlineConnectionState('offline','Сервер подтвердил вход, но не прислал профиль мира. Проверь ошибки player:hello в Render Logs.');},65000);});});
 zoneSocket.on('connect',()=>{
  const engine=zoneSocket?.io?.engine;
  if(engine&&!engine.__zoneCloseLogged){engine.__zoneCloseLogged=true;engine.on('close',reason=>console.warn('ZONE ONLINE: Engine.IO transport closed',reason));}
 });
 zoneSocket.on('connect_error',err=>{const target=(localStorage.getItem('zoneServerUrl')||window.location.origin).trim();const reason=err?.message||'ошибка сети';const extra=/timeout|websocket|transport/i.test(reason)?' Render может перезапустить экземпляр или оборвать сеть. Адрес сохранён; клиент продолжит автоматические попытки с увеличивающейся задержкой. Проверь /health и журналы Render.':' Проверь /health, адрес сервера и журналы Render.';setOnlineConnectionState('connecting',`Нет связи с ${target}. Причина: ${reason}. Клиент продолжит автоматические попытки. Проверка: ${extra}`);console.error('ZONE ONLINE Socket.IO connect_error:',err);});
 zoneSocket.on('disconnect',(reason,details)=>{console.warn('ZONE ONLINE socket disconnected:',reason,details?.message||'',details?.description||'',{active:zoneSocket?.active,connected:zoneSocket?.connected,target:zoneSocketTarget});zonePlayerReady=false;if(zoneHelloReadyTimer){clearTimeout(zoneHelloReadyTimer);zoneHelloReadyTimer=null;}if(reason!=='io client disconnect')setOnlineConnectionState('offline',`Соединение с сервером потеряно (${reason||'неизвестная причина'}). Клиент автоматически попробует подключиться снова.`);renderOnlinePlayers();renderOnlineWorldStatus();});
 zoneSocket.io.on('reconnect_attempt',()=>setOnlineConnectionState('connecting','Повторное подключение к серверу…'));
 zoneSocket.on('player:hello:error',data=>setOnlineConnectionState('offline',data?.message||'Не удалось завершить вход.'));
 zoneSocket.on('server:error',e=>{console.warn(e.message);setOnlineConnectionState('offline',e?.message||'Ошибка сервера.');});
 zoneSocket.on('player:ready',data=>{
  zonePlayerReady=true;
  if(zoneHelloReadyTimer){clearTimeout(zoneHelloReadyTimer);zoneHelloReadyTimer=null;}
  setOnlineConnectionState('online',data.persistent?'Гостевой мультиплеер подключён. Мир сохраняется на сервере.':'Гостевой мультиплеер подключён. Сервер работает без постоянной базы.');
  zonePlayerId=data.id;localStorage.setItem('zoneOnlinePlayerId',zonePlayerId);if(data?.world?.playerSquads){const squad=Object.values(data.world.playerSquads).find(q=>q.members?.some(m=>m.id===zonePlayerId));renderPlayerSquad({squad:squad||null});}renderPlayerFriends(data?.world?.playerFriends?.[zonePlayerId]||[]);
  if(data.savedState&&typeof data.savedState==='object'){applyingServerState=true;g=data.savedState;if(g.characterCreated===undefined)g.characterCreated=true;migrateWorld();localStorage.setItem('zoneExpandedSave',JSON.stringify(g));applyingServerState=false;render();if(g.characterCreated)$('characterSetup')?.classList.remove('show');else if(!$('characterSetup')?.classList.contains('show'))openCharacterSetup();}
  if(data.position&&Number.isFinite(Number(data.position.x))&&Number.isFinite(Number(data.position.y))){g.worldPosition={x:Number(data.position.x),y:Number(data.position.y)};g.mapCoordinateVersion=2;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));}
  serverWorld=data.world||null;syncNpcRosterToClient();applyWorldSync(data.worldSync);if(serverWorld?.discoveredPoints)applySharedDiscoveredPoints(serverWorld.discoveredPoints);renderWar();renderOnlineWorldStatus(data.status);if(serverWorld?.diplomacy){g.diplomacy=serverWorld.diplomacy;renderDiplomacy();}if(serverWorld?.npcPositions)applySharedNpcPositions(serverWorld.npcPositions);renderCoopQuests(serverWorld?.coOpQuests||[]);
  applyLeaderboard(data.leaderboard||[]);onlinePlayers=data.players||[];serverChat=(data.chat||[]).filter(m=>!m.location||m.location===g.loc);renderOnlinePlayers();renderServerChat();
  if($('mpName'))$('mpName').value=g.name;if($('localChatHeading'))$('localChatHeading').textContent=`Локальный канал КПК · ${locationName(g.loc)}`;
  $('mpStatusText').textContent=data.persistent?'Гостевой режим · профиль и общий мир сохраняются на сервере.':'Гостевой режим · данные сервера хранятся в памяти и сбросятся после перезапуска.';
  if(!data.savedState)zoneSocket.emit('player:save',g);
  renderPlayerTrade();renderIncomingTrades();mpSyncLocation();
 });
 zoneSocket.on('world:leaderboard',data=>{applyLeaderboard(data);});
 zoneSocket.on('world:players',list=>{onlinePlayers=list||[];renderOnlinePlayers();renderPlayerTrade();renderOnlineWorldStatus();if(activePlayerDM&&!onlinePlayers.some(p=>p.id===activePlayerDM&&p.location===g.loc)){activePlayerDM=null;renderPlayerDM();}});
 zoneSocket.on('player:expedition-result',data=>{updateMoveOrderStatus(data?.message||'Состояние экспедиции обновлено');if(data?.ok&&data.expedition){g.expedition=data.expedition;save();}});
 zoneSocket.on('player:expedition-step',data=>{if(!data?.location)return;if(data.state&&typeof data.state==='object')g={...g,...data.state};g.loc=data.location;g.expedition=data.arrived?null:{...(g.expedition||{}),path:data.route,index:data.index};activeNpc=null;save();render();view('world');updateMoveOrderStatus(data.arrived?'Экспедиция завершена':'Прибыл в сектор '+locationName(data.location));log('Экспедиция: переход в сектор '+locationName(data.location)+'.');});
 zoneSocket.on('player:movement',data=>{if(!data)return;g.worldPosition={x:Number(data.x)||0,y:Number(data.y)||0};g.mapCoordinateVersion=2;playerMoving=!!data.moving;if(!data.moving){playerMoveTarget=null;walkTarget=null;updateMoveOrderStatus('Ты достиг отмеченной точки');}else updateMoveOrderStatus('Персонаж следует к метке');updatePlayerMapMarker();localStorage.setItem('zoneExpandedSave',JSON.stringify(g));});
 zoneSocket.on('player:move-result',data=>{updateMoveOrderStatus(data?.order?.etaSeconds?`${data.message} · примерно ${data.order.etaSeconds} сек.`:(data?.message||'Обновление приказа'));if(data?.ok===false)alert(data.message||'Не удалось построить маршрут.');else if(data?.message)log(data.message);});
 zoneSocket.on('player:travel-event',data=>{updateMoveOrderStatus('Маршрут остановлен: опасность впереди');news('Опасность на маршруте',data?.message||'Обнаружена угроза.');log(data?.message||'На маршруте обнаружена опасность.');const choice=prompt((data?.message||'На маршруте обнаружена опасность.')+'\n\n1 — вступить в бой\n2 — продолжить скрытно\n3 — отступить','2');const action=choice==='1'?'fight':choice==='3'?'retreat':'continue';zoneSocket.emit('player:travel-response',{action});if(action!=='continue'){playerMoveTarget=null;walkTarget=null;}if(action==='fight'){if(data?.type==='hostile_squad'&&data?.npcId)startNpcEncounter(data.npcId);else startRandomEncounter(true);}});
 zoneSocket.on('npc:approach',data=>{showNpcApproach(data);news('Сталкер вышел на контакт',data.text||'Сталкер подошёл поговорить.');});
 zoneSocket.on('friend:invite',data=>{if(confirm(`${data.name} предлагает добавить тебя в друзья. Принять?`))zoneSocket.emit('friend:respond',{fromId:data.fromId,accept:true});else zoneSocket.emit('friend:respond',{fromId:data.fromId,accept:false});});
 zoneSocket.on('friend:state',data=>renderPlayerFriends(data?.friends||[]));
 zoneSocket.on('friend:result',data=>{if(data?.message)alert(data.message);});
 zoneSocket.on('squad:invite',data=>{if(confirm(`Сталкер ${data.leader} приглашает тебя в отряд «${data.name}». Принять?`))zoneSocket.emit('squad:respond',{squadId:data.squadId,accept:true});else zoneSocket.emit('squad:respond',{squadId:data.squadId,accept:false});});
 zoneSocket.on('squad:state',data=>{renderPlayerSquad(data);if($('squads')?.classList.contains('active'))renderSquads();});
 zoneSocket.on('squad:travelled',data=>{if(!data?.location||!g.locations.some(l=>l.id===data.location))return;g.loc=data.location;activeNpc=null;save();render();view('world');log(`Отряд прибыл в сектор ${locationName(data.location)}.`);});
 zoneSocket.on('squad:encounter',data=>{if(!data)return;news('Встреча отрядов',data.text||'В секторе замечена другая группа.');log(data.text||'В секторе замечена другая группа.');});
 zoneSocket.on('squad:result',data=>{if(data?.message)alert(data.message);});
 zoneSocket.on('dm:history',data=>{playerDMHistory[data.targetId]=data.history||[];if(activePlayerDM===data.targetId)renderPlayerDM();});
 zoneSocket.on('player:spawned',data=>{if(data?.state){applyingServerState=true;g=data.state;migrateWorld();localStorage.setItem('zoneExpandedSave',JSON.stringify(g));applyingServerState=false;render();log(`Ты прибыл на базу группировки: ${spawnNames[data.location]||data.location}.`);}});
 zoneSocket.on('dm:message',m=>{const other=m.fromId===zonePlayerId?m.toId:m.fromId;playerDMHistory[other] ||= [];if(!playerDMHistory[other].some(x=>x.id===m.id))playerDMHistory[other].push(m);if(activePlayerDM===other)renderPlayerDM();else log('Новое личное сообщение от '+(m.fromName||'сталкера')+'.');});
 zoneSocket.on('dm:error',data=>alert(data?.message||'Личный канал недоступен.'));
 zoneSocket.on('npc:trade:result',data=>{if(data?.economy&&activeNpc){serverWorld=serverWorld||{};serverWorld.npcEconomy=serverWorld.npcEconomy||{};serverWorld.npcEconomy[activeNpc]={...(serverWorld.npcEconomy[activeNpc]||{}),...data.economy};}if(data?.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();renderTrade();if(activeNpc)openNpcTrade(activeNpc);}alert(data?.message||'Обмен завершён.');});
 zoneSocket.on('world:sync',data=>applyWorldSync(data));
 zoneSocket.on('world:status',data=>renderOnlineWorldStatus(data));
 zoneSocket.on('world:event',ev=>{if(!ev||!Number.isFinite(Number(ev.revision)))return;const current=Number(localStorage.getItem('zoneWorldRevision')||0);if(Number(ev.revision)<=current)return;localStorage.setItem('zoneWorldRevision',String(ev.revision));renderOnlineWorldStatus();handleOnlineWorldEvent(ev);});
 zoneSocket.on('world:npcs',positions=>applySharedNpcPositions(positions));
 zoneSocket.on('world:npc-event',ev=>{if(!ev)return;const titles={npc_skirmish:'Перестрелка между отрядами',npc_squad_raid:'Рейд сталкерского отряда',npc_replacement:'Новый сталкер в Зоне',npc_travel:'Сталкер сменил сектор',npc_dialogue_updated:'Новые разговоры у сталкеров'};g.news.unshift({day:realClock().day,hour:realClock().time,title:titles[ev.type]||'Событие среди сталкеров',body:ev.text||'Изменения активности NPC.'});g.news=g.news.slice(0,60);renderNews();log('Сводка КПК: '+(ev.text||'активность сталкеров')+'.');});
 zoneSocket.on('npc:combat:result',data=>{if(data?.ok===false)alert(data.message||'Сервер отклонил результат столкновения.');});
 zoneSocket.on('world:npc-state',data=>{const previousVersion=activeNpc?npcBy(activeNpc)?.dialogueVersion:null;serverWorld=serverWorld||{};serverWorld.npcState=data?.npcs||{};serverWorld.npcEvents=data?.events||[];zoneMapDirty=true;serverWorld.npcSquads=data?.squads||[];serverWorld.npcMemorial=data?.memorial||[];serverWorld.battlefronts=data?.battlefronts||[];serverWorld.convoys=data?.convoys||[];serverWorld.factionBases=data?.factionBases||[];serverWorld.frontlineOrders=data?.frontlineOrders||[];syncNpcRosterToClient();const active=npcBy(activeNpc);if(active&&previousVersion!==null&&previousVersion!==active.dialogueVersion){const box=dialogueTarget(),choices=box?.querySelector('.choices');if(choices)choices.innerHTML=(active.topics||[]).map((t,i)=>`<button onclick="topic('${active.id}',${i})">› ${escapeHtml(t[0])}</button>`).join('')+`<button onclick="closeTalk()">Попрощаться</button>`;const hint=box?.querySelector('.dialogue-top .small');if(hint)hint.textContent='Темы разговора обновились · доверие: '+(Number(active.relationship)||0);}renderPeople();renderQuick();renderWar();if($('world')?.classList.contains('active'))renderMap();});
 zoneSocket.on('world:ecosystem',data=>{serverWorld=serverWorld||{};serverWorld.ecosystem=data;renderLivingZone();});
 zoneSocket.on('ecosystem:result',data=>{if(data?.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}alert(data?.message||'');renderLivingZone();});
 zoneSocket.on('survival:hunt:result',data=>{if(data?.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));}if(data?.ecosystem){serverWorld=serverWorld||{};serverWorld.ecosystem=data.ecosystem;}if(data?.message){survivalEvent(data.message,!data.ok);log(data.message);alert(data.message);}save();renderInventory();renderLivingZone();if($('world')?.classList.contains('active'))renderZoneMap();});

 zoneSocket.on('npc:specialist:result',data=>{
  if(data?.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();renderInventory();}
  if(data?.message)alert(data.message);
 });
 zoneSocket.on('npc:interaction-result',data=>{
 if(data?.reply){
  const n=npcBy(data.npcId);
  if(n&&data.dialogue){n.greeting=data.dialogue.greeting;n.topics=data.dialogue.topics;}
  if(n){showNpcDialogue();renderCopDialogue(n,data.reply,data.dialogue?.topics||n.topics||[]);}
  else alert(data.reply);
 }else if(data?.reason)alert(data.reason);
});
 zoneSocket.on('world:poi',points=>applySharedDiscoveredPoints(points));
 zoneSocket.on('world:zoneEvent',ev=>{g.news.unshift({day:realClock().day,hour:realClock().time,title:ev.title,body:ev.body});g.news=g.news.slice(0,60);renderNews();log('Сводка КПК: '+ev.title+'.');});
 zoneSocket.on('world:coop',list=>renderCoopQuests(list));
 zoneSocket.on('war:state',data=>{serverWorld=serverWorld||{};serverWorld.warOperations=data.operations||[];serverWorld.warHistory=data.history||[];renderWar();});
 zoneSocket.on('war:result',data=>{if(data.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}if(data.world)serverWorld=data.world;alert(data.message||'');renderWar();});
 zoneSocket.on('war:reward',data=>{if(data.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}alert(data.won?'Победа! +180 ₽, +35 опыта и +5 репутации.':'Операция завершена. +35 опыта, репутация скорректирована.');});
 zoneSocket.on('trade:incoming',offer=>{incomingTrades.push(offer);renderIncomingTrades();});
 zoneSocket.on('market:result',data=>{if(data.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));if(data.ok)tradeBasket={buy:{},sell:{}};render();renderTrade();}alert(data.message||'Операция выполнена.');});
 zoneSocket.on('trade:result',data=>{alert(data.message|| (data.ok?'Обмен выполнен.':'Обмен не выполнен.'));if(data.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}});
 zoneSocket.on('coop:result',data=>{alert(data.message||'');});
 zoneSocket.on('coop:reward',data=>{if(data.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}alert(`Совместное задание выполнено: +${data.reward} ₽ и ${data.xp} опыта.`);});
 zoneSocket.on('world:chat:history',list=>{serverChat=(list||[]).filter(m=>!m.location||m.location===g.loc);renderServerChat();});
 zoneSocket.on('world:chat',m=>{if(m.location&&m.location!==g.loc)return;serverChat.push(m);if(serverChat.length>100)serverChat=serverChat.slice(-100);renderServerChat();});
 zoneSocket.on('world:update',data=>{serverWorld=data.world||serverWorld;if(Number.isFinite(Number(serverWorld?.revision)))localStorage.setItem('zoneWorldRevision',String(serverWorld.revision));renderOnlineWorldStatus();renderWar();renderCoopQuests(serverWorld?.coOpQuests||[]);if(serverWorld?.diplomacy){g.diplomacy=serverWorld.diplomacy;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));renderDiplomacy();}if(data.notice){g.news.unshift({day:realClock().day,hour:realClock().time,title:'Мировая сводка',body:data.notice});g.news=g.news.slice(0,40);renderNews();}});
 zoneSocket.on('diplomacy:result',data=>{if(!data.ok){alert(data.message||'Операция не выполнена.');return;}if(data.state){g.money=data.state.money;g.rep=data.state.rep;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));}if(data.world?.diplomacy)g.diplomacy=data.world.diplomacy;render();});
  zoneSocket.connect();
 }catch(error){console.error('Socket.IO initialization failed:',error);setOnlineConnectionState('offline','Не удалось запустить сетевой клиент: '+(error?.message||'неизвестная ошибка'));}
}
function mpConnect(){
 const field=$('mpServerUrl'),raw=(field?.value||'').trim();
 if(raw){
  let parsed;try{parsed=new URL(raw);}catch{return alert('Укажи полный адрес сервера, например https://zone-online.onrender.com');}
  if(!['http:','https:'].includes(parsed.protocol))return alert('Адрес сервера должен начинаться с http:// или https://');
  localStorage.setItem('zoneServerUrl',parsed.origin);
 }else localStorage.removeItem('zoneServerUrl');
 setOnlineConnectionState('connecting','Подключаемся к серверу. Если Render неактивен после простоя, первое соединение может занять до минуты…');
 connectZone();
}
// All normal game saves are mirrored to the server. The server keeps one profile per player.
save=function(){localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();if(!applyingServerState&&zoneSocket?.connected&&zonePlayerId){zoneSocket.emit('player:save',g);zoneSocket.emit('player:update',{name:g.name,location:g.loc,faction:g.faction});}};
// Vendor transactions are validated by the server while online.
buy=function(i){const x=tradeGoods()[i];if(!x)return;if(zoneSocket?.connected){zoneSocket.emit('market:buy',{item:x[1]});return;}if(g.money<x[3])return alert('Не хватает рублей.');g.money-=x[3];addItem(x[1],x[0],x[2],x[5],x[4],Math.floor(x[1]==='bolt'?5:1));const gear=x[2]==='Броня'?{condition:100,defense:({armor_leather:2,armor_stalker:3,armor_zarya:5,armor_seva:7,armor_bulat:9,armor_exo:11})[x[1]]||2}:{};Object.assign(g.items.find(z=>z.id===x[1]),gear);log('Куплено: '+x[0]+'.');save();};
sell=function(id,amount=1){const x=g.items.find(i=>i.id===id);if(!x)return;amount=Math.max(1,Math.min(x.qty,Math.floor(Number(amount)||1)));if(zoneSocket?.connected){zoneSocket.emit('market:sell',{item:id,qty:amount});return;}x.qty-=amount;const payout=Math.floor(x.value*.65)*amount;g.money+=payout;if(x.qty<=0)g.items=g.items.filter(i=>i.id!==id);log('Продано: '+x.name+' ×'+amount+' · +'+payout+' ₽.');save();};
// Diplomacy is a shared server-side operation, not a client-only counter.
adjustDiplomacy=function(name,action){if(!zoneSocket?.connected)return alert('Подключись к общей Зоне, чтобы вести переговоры.');zoneSocket.emit('diplomacy:action',{target:name,action});};
if($('mpMessage'))$('mpMessage').addEventListener('keydown',e=>{if(e.key==='Enter')mpSend();});
connectZone();
async function toggleGameFullscreen(){
 try{
  if(!document.fullscreenElement){await document.documentElement.requestFullscreen?.();}
  else{await document.exitFullscreen?.();}
 }catch(error){console.warn('Fullscreen mode is unavailable in this browser:',error);}
}
function openTitleScreen(){
 document.body.classList.add('title-screen-active');
 if($('titleScreen'))$('titleScreen').hidden=false;
 closeTitleOptions();
 const hasSave=!!localStorage.getItem('zoneExpandedSave')&&!!g.characterCreated;
 const resume=$('titleContinue');
 if(resume){resume.disabled=!hasSave;resume.querySelector('small').textContent=hasSave?`${g.name} · ${g.faction} · ${here()?.name||'Зона'}`:'Сохранение не найдено';}
}
function continueZoneGame(){
 $('titleCredits')?.setAttribute('hidden','');
 document.body.classList.remove('title-screen-active');
 if(!g.characterCreated){openCharacterSetup();return;}
 $('characterSetup')?.classList.remove('show');render();renderOnlineWorldStatus?.();
}
function beginNewZoneGame(){
 if(g.characterCreated&&!confirm('Начать новую игру? Текущее локальное сохранение будет заменено.'))return;
 localStorage.removeItem('zoneExpandedSave');
 g=clone(base);g.characterCreated=false;setupFaction='Одиночки';
 document.body.classList.remove('title-screen-active');
 $('titleScreen')?.setAttribute('hidden','');
 openCharacterSetup();
}
function enterZoneOnline(){continueZoneGame();}
function openTitleOptions(){
 const panel=$('titleOptionsPanel');if(!panel)return;
 $('titleLargeText').checked=!!g.options?.largeText;$('titleReduceMotion').checked=!!g.options?.reduceMotion;$('titleCompact').checked=!!g.options?.compactUI;
 if($('titleMenuPanel'))$('titleMenuPanel').hidden=true;panel.hidden=false;
}
function closeTitleOptions(){const panel=$('titleOptionsPanel');if(panel)panel.hidden=true;if($('titleMenuPanel'))$('titleMenuPanel').hidden=false;}
function showTitleCredits(){$('titleCredits')?.removeAttribute('hidden');}
function hideTitleCredits(){$('titleCredits')?.setAttribute('hidden','');}
if(!g.characterCreated)openTitleScreen();else openTitleScreen();
