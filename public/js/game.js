// ZONE ONLINE browser client. This file is served as a static asset.
const clone=o=>JSON.parse(JSON.stringify(o));
const base={
 name:"Новичок",money:1450,hp:100,stamina:85,hunger:18,thirst:20,rep:10,day:1,hour:9,loc:"cordon",faction:"Одиночки",xp:0,meetings:0,completed:0,flags:{metSid:false,metWolf:false,heardBar:false,foundArtifact:false,helpedWolf:false},
 items:[{id:"med",name:"Аптечка",type:"Медицина",desc:"Восстанавливает 35 здоровья.",weight:.4,qty:2,value:100},{id:"bread",name:"Хлеб",type:"Еда",desc:"Восстанавливает 20 выносливости.",weight:.3,qty:2,value:35},{id:"bolt",name:"Болт",type:"Инструмент",desc:"Обычный металлический болт.",weight:.1,qty:8,value:5},{id:"scrap",name:"Металлолом",type:"Материал",desc:"Материал для простого ремесла.",weight:.8,qty:2,value:30},{id:"bandage",name:"Бинт",type:"Медицина",desc:"Небольшая помощь в пути.",weight:.2,qty:2,value:45}],
 equipment:{suit:"Кожаная куртка",tool:"Простой детектор",weapon:"Старый ПМ"},
 locations:[
 {id:"cordon",name:"Кордон",icon:"🌾",owner:"Одиночки",control:55,risk:"Низкий",desc:"Южные ворота Зоны. Новички, торговцы и знакомые костры.",people:["sid","wolf","fanatic"],travel:0,loot:25},
 {id:"dump",name:"Свалка",icon:"⚙️",owner:"Бандиты",control:61,risk:"Средний",desc:"Горы металлолома, старые машины и спорные маршруты.",people:["scout","bandit"],travel:2,loot:45},
 {id:"bar",name:"Росток / Бар",icon:"🍺",owner:"Долг",control:78,risk:"Низкий",desc:"Место встреч, слухов, отдыха и обмена информацией.",people:["barman","seriy"],travel:2,loot:15},
 {id:"agro",name:"Агропром",icon:"🏭",owner:"Военные",control:72,risk:"Средний",desc:"Заброшенные корпуса и запутанные переходы.",people:["scientist"],travel:3,loot:50},
 {id:"dark",name:"Тёмная долина",icon:"🌘",owner:"Бандиты",control:63,risk:"Высокий",desc:"Старая промышленная зона с дурной славой.",people:["merc"],travel:3,loot:60},
 {id:"yantar",name:"Янтарь",icon:"🧪",owner:"Учёные",control:88,risk:"Высокий",desc:"Научный сектор, полевые исследования и аномальные явления.",people:["prof"],travel:4,loot:70},
 {id:"army",name:"Армейские склады",icon:"📦",owner:"Свобода",control:67,risk:"Средний",desc:"Северные склады и старые укрепления.",people:["freedom"],travel:4,loot:55},
 {id:"red",name:"Рыжий лес",icon:"🌲",owner:"Свобода",control:48,risk:"Очень высокий",desc:"Лесные тропы, странные сигналы и опасные находки.",people:["guide"],travel:5,loot:90},
 {id:"pripyat",name:"Припять",icon:"🏙️",owner:"Монолит",control:91,risk:"Критический",desc:"Город-призрак глубоко в Зоне.",people:["loner"],travel:6,loot:110}
 ,
 {id:"zaton",name:"Затон",icon:"▧",owner:"Одиночки",control:52,risk:"Средний",desc:"Заболоченная низина, старые баржи и промышленные руины. Здесь часто встречаются вольные сталкеры.",people:[],travel:3,loot:65},
 {id:"jupiter",name:"Юпитер",icon:"▦",owner:"Свобода",control:58,risk:"Высокий",desc:"Промышленный район вокруг завода «Юпитер», важные маршруты и исследовательские точки.",people:[],travel:4,loot:80},
 {id:"yanov",name:"Станция Янов",icon:"▤",owner:"Одиночки",control:64,risk:"Низкий",desc:"Железнодорожный узел и нейтральная территория для встреч сталкеров.",people:[],travel:3,loot:35},
 {id:"kopachi",name:"Копачи",icon:"⌂",owner:"Учёные",control:43,risk:"Высокий",desc:"Заброшенное село неподалёку от научных маршрутов.",people:[],travel:2,loot:75},
 {id:"volkhov",name:"Волхов АА",icon:"✣",owner:"Военные",control:71,risk:"Высокий",desc:"Старая площадка с техникой и опасными обходными тропами.",people:[],travel:3,loot:60},
 {id:"iron",name:"Железный лес",icon:"♧",owner:"Наёмники",control:39,risk:"Очень высокий",desc:"Мрачный участок с аномальными зонами и нестабильными маршрутами.",people:[],travel:3,loot:95},
 {id:"swamps",name:"Большие Болота",icon:"⌁",owner:"Чистое небо",control:58,risk:"Высокий",desc:"Скрытая база исследователей, топкие тропы и следы ранних экспедиций.",people:["lebedev","novikov","cold"],travel:4,loot:75}
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
 {name:"Чистое небо",icon:"⌁",members:95,influence:28,territories:0,relation:8,style:"Изучение природы Зоны"}
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
 {id:"loner",name:"Молчаливый сталкер",role:"Неизвестный",loc:"pripyat",icon:"👤",desc:"Редко вступает в разговор.",greeting:"Ты далеко зашёл. Здесь слова быстро теряют смысл.",topics:[["Что здесь произошло?","У каждого здания своя история. Но не каждую историю стоит искать."],["Ты один?","Сейчас — да."]]}
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
// Save migration: extend existing saves without resetting player progress.
function migrateWorld(){
 g.locations ||= clone(base.locations); g.npcs ||= clone(base.npcs); g.factions ||= clone(base.factions); g.items ||= []; g.quests ||= clone(base.quests);
 for(const l of base.locations){if(!g.locations.some(x=>x.id===l.id))g.locations.push(clone(l));}
 for(const f of g.factions){const b=base.factions.find(x=>x.name===f.name);if(b&& !f.icon)f.icon=b.icon;}
 g.achievements ||= {}; g.diplomacy ||= {};
 const names=["Грач","Шрам","Крот","Туман","Рыжий","Седой","Карат","Муха","Яр","Филин","Кедр","Барс","Тихий","Медведь","Косой","Лисёнок","Беркут","Сом","Пепел","Мороз","Клык","Ворон","Сыч","Горец","Тополь","Гвоздь","Шило","Маяк","Кремень","Бурый","Радар","Север","Капрал","Кочевник","Пластун","Скат","Гриф","Тайга","Шорох","Фартовый"];
 const roles=["Одиночка","Разведчик","Торговец","Проводник","Охотник за артефактами","Научный помощник"];
 const icons=["◉","♟","⌖","▣","⚑","◈","✚","☼"];
 const factions=g.factions.map(x=>x.name);
 for(const l of g.locations){l.people ||= []; if(l.people.length<6){for(let j=0;j<Math.min(3,6-l.people.length);j++){let id="wander_"+l.id+"_"+j;if(!g.npcs.some(n=>n.id===id)){let name=names[(g.npcs.length+j*3)%names.length];let role=roles[(g.npcs.length+j)%roles.length];let n={id,name,role,loc:l.id,icon:icons[(g.npcs.length+j)%icons.length],desc:"Случайный сталкер. У него есть собственные слухи о районе.",greeting:"Здорово. В этих местах лучше держать ухо востро. Что хотел узнать?",topics:[["Что нового в округе?",`Говорят, в районе «${l.name}» меняется обстановка. Кто-то ищет работу, кто-то — надёжный маршрут.`],["Кто здесь главный?",`Здесь пересекаются интересы разных групп. Сейчас заметнее всего влияние: ${l.owner}.`],["Есть работа?","Пока только слухи. Загляни позже — возможно, появится поручение."]]};n.faction=factions[(g.npcs.length+j)%factions.length];n.mood="нейтральное";g.npcs.push(n);l.people.push(id);}}}}
 for(const f of g.factions){g.diplomacy[f.name] ||= {};for(const other of g.factions){if(f.name!==other.name&&g.diplomacy[f.name][other.name]===undefined)g.diplomacy[f.name][other.name]=Math.max(-60,Math.min(60,Math.round(((f.relation||0)+(other.relation||0))/2)));}}
 if(!g.items.some(x=>x.id==="pm"))g.items.push({id:"pm",name:"ПМм",type:"Оружие",desc:"Служебный пистолет. Состояние: 78%.",weight:.9,qty:1,value:850,icon:"▰",condition:78});
 if(!g.items.some(x=>x.id==="shotgun"))g.items.push({id:"shotgun",name:"Обрез",type:"Оружие",desc:"Старое двуствольное ружьё. Состояние: 62%.",weight:2.4,qty:1,value:1250,icon:"╾",condition:62});
 if(!g.items.some(x=>x.id==="suit"))g.items.push({id:"suit",name:"Комбинезон сталкера",type:"Броня",desc:"Полевой костюм с базовой защитой.",weight:4.2,qty:1,value:1700,icon:"▤",condition:84});
 if(!g.items.some(x=>x.id==="detector"))g.items.push({id:"detector",name:"Детектор Отклик",type:"Детектор",desc:"Помогает отмечать аномальные сигналы.",weight:1.1,qty:1,value:950,icon:"⌁",condition:91});
 g.equipment ||= {suit:"Кожаная куртка",tool:"Простой детектор",weapon:"Старый ПМ"};
 g.hunger=Number.isFinite(g.hunger)?Math.max(0,Math.min(100,g.hunger)):18;
 g.thirst=Number.isFinite(g.thirst)?Math.max(0,Math.min(100,g.thirst)):20;
 g.storyFlags ||= {};
 const content=window.ZONE_CONTENT||{};
 for(const [faction,leader] of Object.entries(content.factionLeaders||{})){const f=g.factions.find(x=>x.name===faction);if(f)f.leader=clone(leader);}
 for(const n of (content.npcs||[])){if(!g.npcs.some(x=>x.id===n.id))g.npcs.push(clone(n));const l=g.locations.find(x=>x.id===n.loc);if(l&&!l.people.includes(n.id))l.people.push(n.id);}
 for(const q of (content.storyQuests||[])){if(!g.quests.some(x=>x.id===q.id))g.quests.push({...clone(q),accepted:false,done:false});}
 if(!g.foodKitGranted){addItem("canned","Консервы","Еда","Сытный полевой паёк.",.45,65,1);addItem("water","Бутылка воды","Еда","Чистая питьевая вода.",.5,25,2);g.foodKitGranted=true;}
}
migrateWorld();


// Original ZONE ONLINE weapon catalogue and authored location POIs.
const weaponCatalogue=[
["pm","ПМм","Пистолеты","Пистолет","9×18 мм",0.9,850,78],["fort","Форт-12","Пистолеты","Пистолет","9×18 мм",0.95,1100,82],["udp","УДП «Компакт»","Пистолеты","Пистолет",".45 ACP",1.1,1450,76],["kora","Кора-919","Пистолеты","Пистолет","9×19 мм",0.95,1350,81],["martha","Мартышка","Пистолеты","Пистолет","9×18 мм",0.85,1250,74],
["spsa","СПСА-14","Дробовики","Дробовик","12 калибр",3.6,3100,72],["chaser","Chaser-13","Дробовики","Дробовик","12 калибр",3.1,2700,80],["protecta","Protecta","Дробовики","Дробовик","12 калибр",4.2,4200,68],["sawed","Обрез","Дробовики","Дробовик","12 калибр",2.4,1250,62],
["akm","АКМ-74/2","Автоматы","Автомат","5.45×39 мм",3.4,3600,80],["akm_gl","АКМ-74/2У","Автоматы","Автомат","5.45×39 мм",3.1,3300,77],["abakan","АС-96/2","Автоматы","Автомат","5.45×39 мм",3.6,5100,83],["obokan","Обокан","Автоматы","Автомат","5.45×39 мм",3.8,4800,79],["tr301","ТРс-301","Автоматы","Автомат","5.56×45 мм",3.2,5200,85],["il86","ИЛ86","Автоматы","Автомат","5.56×45 мм",3.7,4700,73],["gp37","ГП37","Автоматы","Автомат","5.56×45 мм",3.5,5900,88],["groza","Гроза","Автоматы","Автомат","9×39 мм",3.9,7200,80],
["vintar","Винтарь ВС","Винтовки","Винтовка","9×39 мм",3.4,8900,86],["svd","СВДм-2","Винтовки","Винтовка","7.62×54 мм",4.3,9800,84],["svu","СВУмк2","Винтовки","Винтовка","7.62×54 мм",3.8,9300,79],["gauss","Гаусс-пушка","Особое","Экспериментальное","энергетические элементы",5.2,18000,95],["bulldog","Бульдог-6","Особое","Гранатомёт","выстрелы ВОГ",5.0,12500,70],["rp74","РП-74","Особое","Пулемёт","7.62×54 мм",7.8,14500,76],["knife","Нож сталкера","Особое","Инструмент","—",0.35,180,90]
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
yanov:[["Станция Янов","Безопасная зона","Главная точка встреч"],["Буфет","Торговля","Еда и разговоры"],["Пункт учёных","Исследование","Рабочая база исследователей"]],
kopachi:[["Заброшенная школа","Ориентир","Пустующее здание села"],["Сельская улица","Тайник","Старые дворы"],["Окраина Копачей","Аномалия","Место полевых наблюдений"]],
volkhov:[["Площадка техники","Ресурсы","Старая техника"],["Командный пункт","Пост","Заброшенный пункт управления"],["Северный проход","Переход","Тропа к соседним секторам"]],
iron:[["Железная роща","Аномалия","Нестабильный участок"],["Старый мост","Переход","Узкий маршрут"],["Разрушенный цех","Тайник","Промышленные руины"]]
};
function ensureZoneContent(){
 g.keyPoints ||= {};
 for(const l of g.locations){if(!g.keyPoints[l.id])g.keyPoints[l.id]=(poiSeed[l.id]||[["Старая стоянка","Стоянка","Место отдыха"],["Заброшенный объект","Исследование","Точка для изучения района"],["Полевой маршрут","Переход","Путь в соседний сектор"]]).map((p,i)=>({id:l.id+"_poi_"+i,name:p[0],kind:p[1],desc:p[2],discovered:false}));
 }
 const extras=window.ZONE_CONTENT?.extraPoints||{};
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
 p.discovered=true;g.stamina-=5;g.xp+=12;g.hour++;if(zoneSocket?.connected)zoneSocket.emit('world:poi:discover',{id:p.id,location:g.loc,name:p.name});
 log("Отмечена ключевая точка: "+p.name+".");news("Новая отметка на карте",p.name+" — "+p.desc);
 if(Math.random()<.38){let w=weaponCatalogue[Math.floor(Math.random()*weaponCatalogue.length)];if(!g.discoveredWeapons.includes(w[0])){g.discoveredWeapons.push(w[0]);addItem(w[0],w[1],"Оружие","Найденное оружие. Состояние: "+w[7]+"%.",w[5],w[6]);g.items.find(x=>x.id===w[0]).condition=w[7];g.items.find(x=>x.id===w[0]).icon=weaponGlyph(w[0]);log("Найдено снаряжение: "+w[1]+".");}}
 save();
}
function applySharedDiscoveredPoints(points){if(!points||typeof points!=='object')return;for(const [loc,ids] of Object.entries(points)){for(const p of (g.keyPoints?.[loc]||[])){if(Array.isArray(ids)&&ids.includes(p.id))p.discovered=true;}}renderKeyPoints();if($('world').classList.contains('active'))selectLocation(g.loc);}
const weaponGlyphs={pm:"▰",fort:"◧",udp:"▱",kora:"◩",martha:"▰",spsa:"╾",chaser:"╼",protecta:"═",sawed:"╾",akm:"━",akm_gl:"┅",abakan:"━",obokan:"┉",tr301:"━",il86:"┅",gp37:"━",groza:"╾",vintar:"━",svd:"━━",svu:"━━",gauss:"⌁",bulldog:"▣",rp74:"╍",knife:"†"};
function weaponGlyph(id){return weaponGlyphs[id]||null}
function renderArmory(){
 const q=($("armorySearch")?.value||"").toLowerCase(),cl=$("armoryClass")?.value||"all";
 const list=weaponCatalogue.filter(w=>(cl==="all"||w[2]===cl)&&(w[1].toLowerCase().includes(q)||w[3].toLowerCase().includes(q)));
 $("armoryList").innerHTML=list.map(w=>{const owned=g.items.find(x=>x.id===w[0]);const found=g.discoveredWeapons.includes(w[0]);return `<div class="weapon-card"><div class="weapon-art">${weaponGlyph(w[0])||"▰"}</div><div><b>${w[1]}</b><small>${w[3]} · ${w[4]} · ${w[5]} кг</small><small>${found?"Обнаружено":"Данные в каталоге"} · ${owned?"В рюкзаке ×"+owned.qty:"Не найдено"}</small></div><div><span class="tag">${w[6]} ₽</span>${owned?`<button onclick="equipItem('${w[0]}')">Экипировать</button>`:""}</div></div>`}).join("")||'<div class="mutedbox">Совпадений нет.</div>';
}

function save(){localStorage.setItem("zoneExpandedSave",JSON.stringify(g));render()}
function log(t){g.log.unshift(t);g.log=g.log.slice(0,35)}
function news(t,b){g.news.unshift({day:g.day,hour:String(g.hour).padStart(2,"0")+":00",title:t,body:b});g.news=g.news.slice(0,40)}
function addItem(id,name,type,desc,weight,value,qty=1){let x=g.items.find(i=>i.id===id);if(x)x.qty+=qty;else g.items.push({id,name,type,desc,weight,value,qty})}
function count(id){return g.items.find(i=>i.id===id)?.qty||0}
function take(id,n){let x=g.items.find(i=>i.id===id);if(!x||x.qty<n)return false;x.qty-=n;if(x.qty<=0)g.items=g.items.filter(i=>i.id!==id);return true}
function view(id){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));document.querySelectorAll("[data-v]").forEach(b=>b.classList.toggle("active",b.dataset.v===id));if(id==="war")renderWar()}
document.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{view(b.dataset.v);if(b.dataset.v==="armory")renderArmory();if(b.dataset.v==="inventory")renderInventory()});
function here(){return g.locations.find(l=>l.id===g.loc)}
function npcBy(id){return g.npcs.find(n=>n.id===id)}
function nearbyNpcs(){syncNpcRosterToClient();return here().people.map(npcBy).filter(Boolean)}
function addQuest(id){let q=g.quests.find(q=>q.id===id);if(q&&!q.accepted&&!q.done){q.accepted=true;log("Получено задание: "+q.title);news("Новое задание",q.title+" — "+q.desc)}}
function meet(id){let n=npcBy(id);if(!n||n.loc!==g.loc)return;activeNpc=id;g.meetings++;
log("Встреча: "+n.name+".");view("people");renderPeople();startTalk(id);save()}
function startTalk(id){let n=npcBy(id);if(!n)return;const live=serverWorld?.npcState?.[id];if(live?.dialogue){if(live.generated){n.greeting=live.dialogue.greeting;n.topics=live.dialogue.topics;}else{n.topics=(n.topics||[]).filter(t=>!['Свежие слухи','Личная история'].includes(t[0]));n.topics.push(['Свежие слухи',live.dialogue.topics?.[1]?.[1]||'Пока новых сведений нет.'],['Личная история',live.dialogue.topics?.[2]?.[1]||'Сталкер не хочет говорить о прошлом.']);}}activeNpc=id;
 const storyMeet={lebedev:["metLebedev","story_swamp_signal"],novikov:["metNovikov","story_swamp_relay"],prof:["metSakharov","story_yantar_echo"],beard:["metBeard","story_north_route"],archivist:["metArchivist","story_pripyat_archive"]};
 if(storyMeet[id]){g.storyFlags[storyMeet[id][0]]=true;addQuest(storyMeet[id][1]);}
 let box=$("dialogueBox");box.innerHTML=`<div class="dialogue-screen"><div class="dialogue-top"><div class="avatar portrait">${n.icon||"◉"}</div><div><div class="eyebrow">ВХОДЯЩИЙ КАНАЛ / ${here().name.toUpperCase()}</div><b class="speaker">${n.name}</b><div class="desc">${n.role} · ${n.faction||"неизвестная принадлежность"}</div><div class="small muted">Отношение: ${n.mood||"нейтральное"}</div></div></div><div class="dialogue"><span class="speaker">${n.name}:</span><p>${n.greeting}</p></div><div class="section">Выберите реплику</div><div class="choices">${n.topics.map((t,i)=>`<button onclick="topic('${id}',${i})">› ${t[0]}</button>`).join("")}<button onclick="view('trade')">⇄ Открыть торговлю</button><button onclick="closeTalk()">× Завершить разговор</button></div></div>`;renderQuick()}
function topic(id,i){if(zoneSocket?.connected){zoneSocket.emit("npc:interact",{npcId:id,action:"topic",topicIndex:i});return;}let n=npcBy(id),t=n.topics[i];if(!t)return;let result=t[1];if(id==="wolf"&&i===1)addQuest("bread");if(id==="sid"&&i===2)addQuest("scrap");if(id==="barman"&&i===2)addQuest("rumors");if(id==="prof"&&i===1){addQuest("rumors");addQuest("research");}if(id==="scientist"&&i===1)addQuest("scrap");if(id==="wolf"){g.flags.metWolf=true;if(i===1)addQuest("bread");}
if(id==="scout")g.flags.metScout=true;if(id==="prof")g.flags.metProf=true;if(id==="sid")g.flags.metSid=true;if(id==="barman")g.flags.heardBar=true;
let extra="";
if(id==="sid"&&i===2)extra=`<button onclick="turnIn('scrap')">Передать металлолом</button>`;
if(id==="wolf"&&i===1)extra=`<button onclick="turnIn('bread')">Передать хлеб</button>`;
if(id==="barman"&&i===2)extra=`<button onclick="view('quests')">Открыть журнал заданий</button>`;
$("dialogueBox").innerHTML=`<div class="dialogue"><b class="speaker">${n.name}:</b><p>${result}</p></div><div class="choices">${extra}<button onclick="startTalk('${id}')">Задать другой вопрос</button><button onclick="closeTalk()">Попрощаться</button></div>`;log("Разговор: "+n.name+" — "+t[0]);save()}
function closeTalk(){activeNpc=null;$("dialogueBox").innerHTML="Разговор завершён. Можно осмотреться или встретить другого персонажа.";renderQuick()}
function renderPeople(){
 syncNpcRosterToClient();
 const nearby=nearbyNpcs().map(n=>`<div class="item"><div class="npc-card"><div class="avatar">${escapeHtml(n.icon)}</div><div><b>${escapeHtml(n.name)}</b><div class="desc">${escapeHtml(n.role)} · ${escapeHtml(n.faction||"")} · ${escapeHtml(n.desc||"")}</div><div class="small muted">${escapeHtml(n.personality||"сталкер")}${n.squadId?" · состоит в отряде":""} · друзья: ${(n.friends||[]).length} · соперники: ${(n.rivals||[]).length}</div></div></div>${n.biography?`<p class="desc">${escapeHtml(n.biography)}</p>`:""}<div class="rightbuttons"><button onclick="startTalk('${n.id}')">Поговорить</button><button onclick="npcServerAction('${n.id}','greet')">Поздороваться</button><button onclick="npcServerAction('${n.id}','ask')">Спросить о слухах</button><button onclick="npcServerAction('${n.id}','help')">Помочь</button></div></div>`).join("");
 const squads=(serverWorld?.npcSquads||[]).filter(s=>s.status!=='disbanded').map(s=>`<div class="item"><b>Отряд «${escapeHtml(s.name)}»</b><div class="desc">${escapeHtml(s.faction)} · ${escapeHtml(locationName(s.location))} · ${s.members.length} бойцов · ${s.status==='on_raid'?'в рейде':'на привале'}</div></div>`).join("");
 const memorial=(serverWorld?.npcMemorial||[]).slice(0,5).map(m=>`<div class="item"><b>☠ ${escapeHtml(m.name)}</b><div class="desc">Погиб: ${escapeHtml(m.cause)} · ${escapeHtml(locationName(m.location))}</div></div>`).join("");
 $("peopleList").innerHTML=(nearby||'<div class="mutedbox">В этой локации сейчас никого нет. Попробуй зайти позже.</div>')+(squads?`<h3>Отряды сталкеров</h3>${squads}`:"")+(memorial?`<h3>Память Зоны</h3>${memorial}`:"");
}
function npcServerAction(npcId,action){if(!zoneSocket?.connected)return alert("Для взаимодействия с живым NPC нужно подключение к серверу.");zoneSocket.emit("npc:interact",{npcId,action});}
function renderQuick(){$("quickNpc").innerHTML=nearbyNpcs().slice(0,3).map(n=>`<div class="item" style="padding:7px;margin-bottom:6px"><span>${n.icon} ${n.name}</span><button onclick="meet('${n.id}')">Встреча</button></div>`).join("")||'<span class="muted small">Поблизости никого не видно.</span>'}
function travel(id){let l=g.locations.find(x=>x.id===id);if(!l||id===g.loc)return;let cost=l.travel;if(g.stamina<cost*5)return alert("Недостаточно выносливости. Отдохни у костра.");consumeTime(cost);g.stamina-=cost*5;g.hour+=cost;if(g.hour>=24){g.day+=Math.floor(g.hour/24);g.hour%=24}g.loc=id;activeNpc=null;log("Переход: "+l.name+".");news("Сталкер прибыл",g.name+" прибыл в район «"+l.name+"».");if(Math.random()<.35){let event=["По дороге ты заметил следы недавнего лагеря.","На маршруте встретилась небольшая группа сталкеров.","Погода изменилась, путь занял больше времени."][Math.floor(Math.random()*3)];log(event);news("Событие в пути",event)}render();mpSyncLocation();view("world")}
function renderMap(){renderZoneMap();$("map").innerHTML=g.locations.map(l=>`<button class="loc ${chosenLoc===l.id?"selected":""}" onclick="selectLocation('${l.id}')"><b>${l.icon} ${l.name}</b><span class="owner">${l.owner}</span><span class="risk">Опасность: ${l.risk} · Переход: ${l.travel||"—"} ч.</span>${l.id===g.loc?'<span class="tag">Вы здесь</span>':""}</button>`).join("")}
function selectLocation(id){
 chosenLoc=id;let l=g.locations.find(x=>x.id===id),pts=g.keyPoints?.[id]||[];
 $("locationInfo").innerHTML=`<b>${l.icon} ${l.name}</b> <span class="tag">${l.owner}</span><p class="muted small">${l.desc}</p><div class="small">Контроль: ${l.control}% · Уровень риска: ${l.risk}</div><div class="bar"><i style="width:${l.control}%"></i></div><div class="rightbuttons" style="margin-top:10px">${id===g.loc?'<span class="tag">Текущая локация</span>':`<button onclick="travel('${id}')">Отправиться · ${l.travel} ч.</button>`}<button onclick="influence('${id}')" ${l.owner===g.faction?"disabled":""}>Повысить влияние · 120 ₽</button></div><div class="section">Ключевые точки сектора</div><div class="poi-list">${pts.map(p=>`<div class="poi ${p.discovered?"discovered":""}"><b>${p.discovered?"✓":"⌖"} ${p.name}</b><span class="poi-marker">${p.kind}</span><small>${p.discovered?p.desc:"Сведения отсутствуют"}</small>${id===g.loc&&!p.discovered?`<div style="margin-top:7px"><button onclick="discoverPoint('${p.id}')">Исследовать</button></div>`:""}</div>`).join("")}</div>`;
 renderMap();
}
function consumeTime(hours){g.hunger=Math.min(100,(g.hunger||0)+Math.round(hours*3.5));g.thirst=Math.min(100,(g.thirst||0)+Math.round(hours*5));if(g.hunger>=90||g.thirst>=90){g.stamina=Math.max(0,g.stamina-3);if(g.hunger>=98||g.thirst>=98)g.hp=Math.max(1,g.hp-1);}}
function explore(){let l=here();consumeTime(1);g.stamina=Math.max(0,g.stamina-8);g.hour++;let r=Math.random();if(r<.35){let n=nearbyNpcs()[Math.floor(Math.random()*nearbyNpcs().length)];if(n){log("Во время прогулки ты встретил: "+n.name+".");activeNpc=n.id;view("people");renderPeople();return}}if(r<.65){addItem("scrap","Металлолом","Материал","Найденный материал.",.8,30,1);log("Найден металлолом.");news("Находка", "Во время осмотра местности найден металлолом.")}else{g.xp+=8;log("Ты осмотрел окрестности и отметил несколько деталей на карте.");}save()}
function searchAnomaly(){if(g.stamina<12)return alert("Нужно отдохнуть: мало выносливости.");consumeTime(1);g.stamina-=12;g.hour+=1;let chance=Math.random();if(chance<.48){addItem("artifact","Медуза","Артефакт","Небольшой артефакт неизвестного происхождения.",.6,420);g.flags.foundArtifact=true;g.xp+=35;log("Обнаружен артефакт «Медуза».");news("Необычная находка","Сталкер сообщил об обнаружении неизвестного артефакта.");}else{log("Поиск не дал результата. В этот раз ничего интересного.");}save()}
function rest(){consumeTime(3);g.stamina=Math.min(100,g.stamina+(g.hunger>85||g.thirst>85?12:35));g.hp=Math.min(100,g.hp+5);g.hour+=3;log("Ты отдохнул у костра. Силы частично восстановлены.");save()}
function roamNPCs(){if(Math.random()>.32)return;let candidates=g.npcs.filter(n=>n.id.startsWith("wander_")&&n.loc!==g.loc);if(!candidates.length)return;let n=candidates[Math.floor(Math.random()*candidates.length)],from=g.locations.find(l=>l.id===n.loc),dest=g.locations[Math.floor(Math.random()*g.locations.length)];if(!from||!dest||from.id===dest.id)return;from.people=from.people.filter(id=>id!==n.id);dest.people.push(n.id);n.loc=dest.id;news("Сталкеры в пути",n.name+" замечен в районе «"+dest.name+"». ");log("Слухи: сталкер "+n.name+" сменил район.")}
function advance(){livingWorldTick();consumeTime(4);g.hour+=4;if(g.hour>=24){g.day+=Math.floor(g.hour/24);g.hour%=24}g.stamina=Math.min(100,g.stamina+10);const events=[["Сводка с Кордона","На Кордоне замечено движение торговцев."],["Новости Свалки","Сталкеры сообщают о споре за контроль над одним из маршрутов."],["Сообщение учёных","На Янтаре продолжаются полевые наблюдения."],["Слухи из бара","Бармен передаёт: в Зоне всё спокойно лишь на первый взгляд."]];let e=events[Math.floor(Math.random()*events.length)];news(e[0],e[1]);roamNPCs();log("Время прошло. "+e[1]);if(Math.random()<.22){let l=g.locations[Math.floor(Math.random()*g.locations.length)];l.control=Math.max(10,Math.min(95,l.control+(Math.random()<.5?3:-3)));news("Изменение влияния","Баланс сил меняется в районе «"+l.name+"».")}save()}
function renderQuests(){let qs=g.quests.filter(q=>questFilter==="all"||(questFilter==="active"&&q.accepted&&!q.done)||(questFilter==="done"&&q.done));$("questList").innerHTML=qs.map(q=>`<div class="item block"><div style="display:flex;justify-content:space-between;gap:8px"><b>${q.title}</b><span class="tag">${q.done?"Завершено":q.accepted?"Активно":"Не принято"}</span></div><div class="desc">Выдал: ${q.giver} · Награда: ${q.reward} ₽ · ${q.xp} опыта</div>${q.chapter?`<div class="small gold">${q.chapter}</div>`:""}<p class="small">${q.desc}</p>${q.accepted&&!q.done?`<div class="rightbuttons"><button onclick="turnIn('${q.id}')">Проверить выполнение</button></div>`:!q.done?`<button onclick="acceptQuest('${q.id}')">Принять задание</button>`:""}</div>`).join("")||'<div class="mutedbox">Здесь пока пусто.</div>'}
function acceptQuest(id){let q=g.quests.find(x=>x.id===id);if(!q)return;q.accepted=true;log("Принято задание: "+q.title);news("Новое задание",q.title);save()}
function turnIn(id){let q=g.quests.find(x=>x.id===id);if(!q||!q.accepted||q.done)return;let ok=false;
 const found=(loc,part)=>!!g.keyPoints?.[loc]?.some(p=>p.id===part&&p.discovered);
 const storyChecks={
 story_swamp_signal:()=>g.storyFlags.metLebedev&&found("swamps","swamps_extra_0"),
 story_swamp_relay:()=>g.storyFlags.metNovikov&&found("swamps","swamps_extra_3"),
 story_yantar_echo:()=>g.storyFlags.metSakharov&&found("yantar","yantar_extra_0"),
 story_north_route:()=>g.storyFlags.metBeard&&found("jupiter","jupiter_extra_3")&&found("yanov","yanov_extra_1"),
 story_pripyat_archive:()=>g.storyFlags.metArchivist&&found("pripyat","pripyat_extra_3")
 };
 if(storyChecks[id])ok=storyChecks[id]();if(id==="intro")ok=g.flags.metWolf;if(id==="scrap")ok=count("scrap")>=3;if(id==="bread")ok=count("bread")>=2;if(id==="rumors")ok=g.flags.metWolf&&g.flags.heardBar&&g.flags.metScout&&g.flags.metProf;if(id==="research")ok=g.flags.foundArtifact;if(!ok){alert("Пока условия задания не выполнены. Проверь описание и поговори с нужными персонажами.");return}if(id==="scrap")take("scrap",3);if(id==="bread")take("bread",2);q.done=true;g.money+=q.reward;g.xp+=q.xp;g.rep+=q.rep;g.completed++;log("Задание выполнено: "+q.title+". Получено "+q.reward+" ₽.");news("Задание выполнено",q.title+" — награда начислена.");save()}
function tradeGoods(){return [["Аптечка","med","Медицина",180,.4,"Восстанавливает здоровье."],["Хлеб","bread","Еда",45,.3,"Небольшой перекус."],["Бинт","bandage","Медицина",70,.2,"Полевой расходный предмет."],["Металлолом","scrap","Материал",55,.8,"Материал для ремесла."],["Болты ×5","bolt","Инструмент",40,.1,"Набор болтов."],["Консервы","canned","Еда",95,.45,"Сытный полевой паёк."],["Колбаса","sausage","Еда",75,.25,"Еда в дорогу."],["Сгущённое молоко","condensed","Еда",85,.38,"Сладкий запас энергии."],["Бутылка воды","water","Еда",40,.5,"Питьевая вода."],["Термос чая","tea","Еда",55,.35,"Тёплый напиток."],["Сухой паёк","ration","Еда",130,.55,"Компактный набор продуктов."]]}
function buy(i){let x=tradeGoods()[i];if(g.money<x[3])return alert("Не хватает рублей.");g.money-=x[3];addItem(x[1],x[0],x[2],x[5],x[4],Math.floor(x[1]==="bolt"?5:1));log("Куплено: "+x[0]+".");save()}
function sell(id){let x=g.items.find(i=>i.id===id);if(!x)return;let amount=Math.min(x.qty,1);x.qty-=amount;g.money+=Math.floor(x.value*.65);if(x.qty<=0)g.items=g.items.filter(i=>i.id!==id);log("Продан предмет: "+x.name+".");save()}
function useItem(id){let x=g.items.find(i=>i.id===id);if(!x)return;const nutrition=window.ZONE_CONTENT?.foods?.[id];if(nutrition){g.hunger=Math.max(0,g.hunger-(nutrition.satiety||0));g.thirst=Math.max(0,g.thirst-(nutrition.hydration||0));g.stamina=Math.min(100,g.stamina+(nutrition.stamina||0));take(id,1);log("Использован припас: "+x.name+". Голод и жажда уменьшились.");save();return;}if(id==="med"){if(g.hp>=100)return alert("Здоровье уже полное.");g.hp=Math.min(100,g.hp+35);take(id,1)}else if(id==="bandage"){g.hp=Math.min(100,g.hp+15);take(id,1)}else if(id==="bread"){g.stamina=Math.min(100,g.stamina+20);take(id,1)}else return alert("Этот предмет нельзя использовать напрямую.");log("Использован предмет: "+x.name+".");save()}
function itemGlyph(x){
 const kind=x.type==='Оружие'?'weapon':x.type==='Броня'?'armor':x.type==='Медицина'?'med':x.type==='Еда'?'food':x.type==='Артефакт'?'artifact':x.type==='Детектор'?'detector':'tool';
 const shapes={weapon:'<path d="M9 25h40v-7H34l-4-7H18l-2 7H9z"/><path d="M23 25v13h9V25M39 18v-5h7v5"/>',armor:'<path d="M18 8l12 5 12-5 9 10-7 7-4-4v20H20V21l-4 4-7-7z"/>',med:'<rect x="10" y="14" width="40" height="26" rx="3"/><path d="M27 18h7v7h7v7h-7v7h-7v-7h-7v-7h7z"/>',food:'<path d="M12 28c0-10 8-17 18-17s18 7 18 17-8 13-18 13-18-3-18-13z"/><path d="M20 26h20M22 33h16"/>',artifact:'<path d="M30 5l8 12 12 7-8 13-12 8-12-8-8-13 12-7z"/><circle cx="30" cy="27" r="6"/>',detector:'<rect x="14" y="10" width="32" height="38" rx="4"/><circle cx="30" cy="25" r="9"/><path d="M30 25l7-5M22 40h16"/>',tool:'<path d="M12 15l9-9 10 10-9 9zM26 24l20 20-6 6-20-20M35 11l9-5 8 8-5 9"/>'};
 return `<svg viewBox="0 0 60 56" width="42" height="40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${shapes[kind]}</svg>`;
}
function equipItem(id){let x=g.items.find(i=>i.id===id);if(!x)return;if(x.type==="Оружие")g.equipment.weapon=x.name;else if(x.type==="Броня")g.equipment.suit=x.name;else if(x.type==="Детектор")g.equipment.tool=x.name;else return alert("Этот предмет нельзя экипировать.");log("Экипировано: "+x.name);save()}
function renderInventory(){
 const query=($("invSearch")?.value||"").toLowerCase(),filter=$("invFilter")?.value||"all",sort=$("invSort")?.value||"name";
 let items=g.items.filter(x=>(filter==="all"||x.type===filter)&&x.name.toLowerCase().includes(query));
 items.sort((a,b)=>sort==="value"?b.value-a.value:sort==="weight"?b.weight-a.weight:sort==="type"?a.type.localeCompare(b.type,"ru"):a.name.localeCompare(b.name,"ru"));
 $("items").innerHTML=items.map(x=>`<div class="inv-slot"><span class="qty">×${x.qty}</span><div class="item-icon">${itemGlyph(x)}</div><b>${x.name}</b><small>${x.type} · ${(x.weight*x.qty).toFixed(1)} кг · ${x.value} ₽</small>${x.condition!=null?`<div class="condition"><i style="width:${x.condition}%"></i></div><small>Состояние ${x.condition}%</small>`:""}<div class="rightbuttons">${["Медицина","Еда"].includes(x.type)?`<button onclick="useItem('${x.id}')">Применить</button>`:""}${["Оружие","Броня","Детектор"].includes(x.type)?`<button onclick="equipItem('${x.id}')">Экипировать</button>`:""}<button onclick="sell('${x.id}')">Продать</button></div></div>`).join("")||'<div class="mutedbox">Предметы не найдены.</div>';
 $("weight").textContent=g.items.reduce((a,x)=>a+x.weight*x.qty,0).toFixed(1)+" кг";$("itemCount").textContent=g.items.reduce((a,x)=>a+x.qty,0);
 let eq=[["Костюм","suit","▤"],["Основное оружие","weapon","▰"],["Детектор","tool","⌁"]];
 $("equipment").innerHTML=eq.map(([n,k,ic])=>`<div class="equip-slot"><span class="eq-icon">${ic}</span><div><b>${n}</b><small>${g.equipment[k]||"Не установлено"}</small></div></div>`).join("");
 $("gearStats").innerHTML=`Состояние оружия: ${g.items.find(x=>x.name===g.equipment.weapon)?.condition??"—"}%<br>Защита костюма: ${g.items.find(x=>x.name===g.equipment.suit)?.condition??"—"}%<br>Детектор: ${g.equipment.tool||"нет"}`;
}
function renderTrade(){$("traderName").textContent=g.loc==="cordon"?"Сидорович":g.loc==="bar"?"Бармен":"Полевой обмен";$("traderPlace").textContent=here().name+" · цены условные";$("shop").innerHTML=tradeGoods().map((x,i)=>`<div class="item"><div><b>${x[0]}</b><div class="desc">${x[5]}</div></div><div style="text-align:right"><b>${x[3]} ₽</b><br><button onclick="buy(${i})">Купить</button></div></div>`).join("");$("sellList").innerHTML=g.items.map(x=>`<div class="item"><span>${x.name} ×${x.qty}</span><button onclick="sell('${x.id}')">Продать · ${Math.floor(x.value*.65)} ₽</button></div>`).join("")}
function influence(id){let l=g.locations.find(x=>x.id===id);if(!l||l.owner===g.faction)return;if(g.money<120)return alert("Недостаточно рублей.");g.money-=120;l.control=Math.min(100,l.control+15);if(l.control>=95){let old=l.owner;l.owner=g.faction;l.control=50;let f=g.factions.find(x=>x.name===old),m=g.factions.find(x=>x.name===g.faction);if(f)f.territories=Math.max(0,f.territories-1);if(m)m.territories++;log("Группировка "+g.faction+" установила влияние в районе "+l.name+".");news("Изменение контроля","Группировка "+g.faction+" усилила позиции в районе "+l.name+".")}else log("Влияние в районе "+l.name+" выросло до "+l.control+"%.");save();selectLocation(id)}
function renderFactions(){
 $("factionList").innerHTML=g.factions.map(f=>`<div class="item block"><div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;gap:9px;align-items:center"><span class="faction-emblem">${f.icon||"◉"}</span><b>${f.name}</b></div><span class="tag">${f.territories} террит.</span></div><div class="desc">${f.style} · ${f.members} участников</div><div class="small">Влияние ${f.influence}%</div><div class="bar"><i style="width:${f.influence}%"></i></div></div>`).join("");
 $("factionLeaders").innerHTML=g.factions.map(f=>{const x=f.leader||{name:"Неизвестно",title:"Нет единого лидера",canon:"",bio:""};return `<div class="leader-card"><div class="eyebrow">${escapeHtml(f.name)}</div><b>${escapeHtml(x.name)}</b><div class="desc">${escapeHtml(x.title)}</div><p class="small">${escapeHtml(x.bio)}</p><small class="muted">${escapeHtml(x.canon)}</small></div>`}).join("");
 $("relations").innerHTML=g.factions.map(f=>`<div class="item"><span>${f.name}</span><b class="${f.relation<0?'red':'gold'}">${f.relation>0?"+":""}${f.relation}</b></div>`).join("");
}
function renderArchive(){
 const timeline=window.ZONE_CONTENT?.timeline||[];
 $("timelineList").innerHTML=timeline.map(x=>`<div class="timeline-entry"><span class="tag">${escapeHtml(x.era)}</span><b>${escapeHtml(x.title)}</b><p class="small">${escapeHtml(x.text)}</p></div>`).join("");
 const qs=(window.ZONE_CONTENT?.storyQuests||[]);
 $("storyCampaign").innerHTML=qs.map(q=>{const state=g.quests.find(x=>x.id===q.id);return `<div class="item block"><div class="eyebrow">${escapeHtml(q.chapter)}</div><b>${escapeHtml(q.title)}</b><div class="desc">Выдал: ${escapeHtml(q.giver)} · ${q.reward} ₽ · ${q.xp} опыта</div><p class="small">${escapeHtml(q.desc)}</p><span class="tag">${state?.done?'Завершено':state?.accepted?'Активно':'Ожидает контакта'}</span></div>`}).join("");
}
function renderZoneMap(){const pts={cordon:[14,76],dump:[30,57],bar:[48,68],agro:[40,43],dark:[26,33],yantar:[56,27],army:[73,25],red:[67,48],pripyat:[86,16],zaton:[12,22],jupiter:[55,52],yanov:[75,65],kopachi:[69,38],volkhov:[87,46],iron:[39,15],swamps:[8,48]};let edges=[["cordon","dump"],["dump","bar"],["bar","agro"],["agro","dark"],["dark","yantar"],["yantar","army"],["army","red"],["red","pripyat"],["cordon","zaton"],["zaton","jupiter"],["jupiter","yanov"],["yanov","kopachi"],["kopachi","volkhov"],["jupiter","iron"],["iron","yantar"],["cordon","swamps"],["swamps","agro"]];let lines=edges.map(([a,b])=>{let A=pts[a],B=pts[b];return `<line class="route" x1="${A[0]}%" y1="${A[1]}%" x2="${B[0]}%" y2="${B[1]}%"/>`}).join("");let nodes=g.locations.map(l=>{let [x,y]=pts[l.id]||[50,50];return `<g onclick="selectLocation('${l.id}')" style="cursor:pointer"><circle class="sector ${g.loc===l.id?'current':''}" cx="${x}%" cy="${y}%" r="${g.loc===l.id?9:6}"/><text class="sector-label" x="${x}%" y="${y+5}%" text-anchor="middle">${l.name}</text></g>`}).join("");$("zoneMap").innerHTML=`<svg viewBox="0 0 1000 500" preserveAspectRatio="none">${lines}${nodes}</svg>`}
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
function renderDiplomacy(){let friendly=g.factions.filter(f=>f.name!==g.faction&&(g.diplomacy[g.faction]?.[f.name]||0)>=20).length;$("diplomacySummary").innerHTML=`<div class="stat"><span>Твоя группировка</span><strong style="font-size:15px">${g.faction}</strong></div><div class="stat"><span>Дружественные каналы</span><strong>${friendly}</strong></div><div class="stat"><span>Казна</span><strong>${g.money} ₽</strong></div>`;$("diplomacyList").innerHTML=g.factions.filter(f=>f.name!==g.faction).map(f=>{let r=g.diplomacy[g.faction]?.[f.name]||0;let label=r>=35?"Союзные контакты":r>=15?"Дружелюбные":r>=-14?"Нейтралитет":r>=-34?"Напряжённость":"Враждебность";return `<div class="item block"><div class="row" style="align-items:center"><div style="display:flex;gap:9px;align-items:center"><span class="faction-emblem">${f.icon||"◉"}</span><div><b>${f.name}</b><div class="desc">${label} · отношение ${r>0?"+":""}${r}</div></div></div><span class="tag">${f.members} бойцов</span></div><div class="bar"><i style="width:${Math.max(0,Math.min(100,(r+60)/1.2))}%"></i></div><div class="rightbuttons" style="margin-top:9px"><button onclick="adjustDiplomacy('${f.name}','mediator')">Посредник · 120 ₽</button><button onclick="adjustDiplomacy('${f.name}','intel')">Обмен данными · 80 ₽</button><button onclick="adjustDiplomacy('${f.name}','treaty')">Торговый пакт · 250 ₽</button></div></div>`}).join("")}
function renderNews(){$("newsList").innerHTML=g.news.map(n=>`<div class="item block"><div style="display:flex;justify-content:space-between;gap:8px"><b>${n.title}</b><span class="pill">День ${n.day} · ${n.hour}</span></div><div class="desc">${n.body}</div></div>`).join("")}
function generateRumor(){let arr=["На Кордоне говорят, что торговцы скоро обновят ассортимент.","На Свалке замечены незнакомые сталкеры. Их цели пока неизвестны.","Учёные на Янтаре ищут добровольцев для новых наблюдений.","В баре обсуждают перемены в отношениях между группировками.","Проводник утверждает, что на старой тропе появились новые ориентиры."];let r=arr[Math.floor(Math.random()*arr.length)];news("Слух от сталкеров",r);log("Получен новый слух через КПК.");save()}
function clearOldNews(){g.news=g.news.slice(0,5);save()}
function renderCraft(){$("recipes").innerHTML=[{name:"Полевой набор",desc:"Обменять 2 металлолома на 1 бинт.",cost:{scrap:2},out:"bandage"},{name:"Запас болтов",desc:"Обменять 1 металлолом на 5 болтов.",cost:{scrap:1},out:"bolt"},{name:"Аптечный комплект",desc:"Обменять 3 металлолома на аптечку.",cost:{scrap:3},out:"med"}].map((r,i)=>`<div class="item"><div><b>${r.name}</b><div class="desc">${r.desc}</div></div><button onclick="craft(${i})">Собрать</button></div>`).join("")}
function craft(i){let recipes=[{cost:2,out:"bandage",name:"Бинт"},{cost:1,out:"bolt",name:"Болты",qty:5},{cost:3,out:"med",name:"Аптечка"}],r=recipes[i];if(count("scrap")<r.cost)return alert("Недостаточно металлолома.");take("scrap",r.cost);let map={bandage:["Бинт","Медицина","Полевой расходный предмет",.2,45],bolt:["Болты","Инструмент","Металлические болты",.1,5],med:["Аптечка","Медицина","Восстанавливает здоровье",.4,100]}[r.out];addItem(r.out,map[0],map[1],map[2],map[3],map[4],r.qty||1);log("Изготовлено: "+r.name+".");save()}
function renderProfile(){$("profileName").textContent=g.name;$("rank").textContent=g.xp<50?"Новичок":g.xp<150?"Опытный сталкер":g.xp<300?"Следопыт":"Ветеран Зоны";$("profileStats").innerHTML=[["Группировка",g.faction],["Репутация",g.rep],["Опыт",g.xp],["Здоровье",g.hp+"%"],["Выносливость",g.stamina+"%"],["Голод",g.hunger+"%"],["Жажда",g.thirst+"%"],["Выполнено",g.completed]].map(x=>`<div class="stat"><span>${x[0]}</span><strong style="font-size:16px">${x[1]}</strong></div>`).join("");$("meetingCount").textContent=g.meetings}
function rename(){let n=prompt("Новый позывной:",g.name);if(n&&n.trim()){g.name=n.trim().slice(0,24);log("Позывной изменён.");save()}}
function chooseFaction(){let names=g.factions.map(f=>f.name),v=prompt("Выбери группировку:\n"+names.join("\n"),g.faction);if(!v)return;if(!names.includes(v))return alert("Такой группировки нет в списке.");g.faction=v;log("Теперь ты состоишь в группировке «"+v+"».");save();mpSyncLocation()}
function render(){let l=here();$("topMoney").textContent=g.money.toLocaleString("ru-RU");$("topHp").textContent=g.hp+"%";$("topHunger").textContent=(g.hunger??0)+"%";$("topThirst").textContent=(g.thirst??0)+"%";$("topDay").textContent=g.day+" / "+String(g.hour).padStart(2,"0")+":00";$("topLoc").textContent=l.name;$("sMoney").textContent=g.money+" ₽";$("sHp").textContent=g.hp+"%";$("sRep").textContent=g.rep;$("sDay").textContent=g.day;
$("nearby").innerHTML=nearbyNpcs().slice(0,3).map(n=>`<div class="item"><div><b>${n.icon} ${n.name}</b><div class="desc">${n.role} · ${n.desc}</div></div><button onclick="meet('${n.id}')">Подойти</button></div>`).join("")||'<div class="mutedbox">Поблизости никого нет.</div>';
$("homeNews").textContent=g.news[0]?g.news[0].title+": "+g.news[0].body:"Пока без новостей.";
$("miniStatus").innerHTML=`<div class="item"><span>Локация</span><b>${l.name}</b></div><div class="item"><span>Выносливость</span><b>${g.stamina}%</b></div><div class="bar"><i style="width:${g.stamina}%"></i></div><div class="item"><span>Голод</span><b>${g.hunger}%</b></div><div class="bar"><i style="width:${g.hunger}%;background:#c6a16c"></i></div><div class="item"><span>Жажда</span><b>${g.thirst}%</b></div><div class="bar"><i style="width:${g.thirst}%;background:#8ab5c7"></i></div><div class="item"><span>Погода</span><b>${g.world.weather}</b></div><div class="item"><span>Фракция</span><b>${g.faction}</b></div>`;
$("worldState").innerHTML=`<div class="item"><span>Аномальная активность</span><b>${g.world.emission}</b></div><div class="item"><span>Мутанты</span><b>${g.world.mutants}</b></div><div class="item"><span>Напряжённость</span><b>${g.world.tension}%</b></div>`;
renderMap();renderKeyPoints();renderArmory();renderPeople();renderQuests();renderInventory();renderTrade();renderFactions();renderArchive();renderDiplomacy();renderAchievements();renderNews();renderCraft();renderProfile();renderQuick();renderLivingZone();$("log").innerHTML=g.log.map((x,i)=>`<div><time>${String(i+1).padStart(2,"0")}</time>${x}</div>`).join("")}
function exportSave(){let blob=new Blob([JSON.stringify(g,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="zone-online-save.json";a.click();URL.revokeObjectURL(a.href)}
function importSave(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let d=JSON.parse(r.result);if(!d.locations||!d.npcs||!d.items)throw Error();g=d;save();alert("Сохранение загружено.")}catch(err){alert("Файл сохранения не распознан.")}};r.readAsText(f)}
function manualSave(){save();alert("Игра сохранена в этом браузере.")}
function resetGame(){if(confirm("Начать заново? Текущее локальное сохранение будет заменено.")){g=clone(base);activeNpc=null;chosenLoc=null;save();view("home")}}
// GLOBAL ONLINE WORLD state must exist before the first render: renderPeople()
 // reads serverWorld while building the initial NPC roster.
let zoneSocket=null, zonePlayerId=localStorage.getItem('zoneOnlinePlayerId')||'';
let onlinePlayers=[], serverWorld=null, serverChat=[], incomingTrades=[];
let applyingServerState=false;

render();

// GLOBAL ONLINE WORLD: one shared server, no private rooms.
function renderOnlinePlayers(){
 const make=(p)=>`<div class="item"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><div><b>🟢 ${escapeHtml(p.name)}</b><div class="desc">${escapeHtml(p.faction)} · ${escapeHtml(locationName(p.location))}</div></div><span class="tag">${p.hp}% HP</span></div></div>`;
 const all=onlinePlayers.map(make).join('')||'<div class="mutedbox small">Сейчас никого нет. Ты можешь быть первым.</div>';
 const a=$('mpPlayers');if(a)a.innerHTML=all;
 const b=$('nearbyPlayers');if(b){const near=onlinePlayers.filter(p=>p.id!==zonePlayerId&&p.location===g.loc);b.innerHTML=near.map(make).join('')||'<div class="mutedbox small">В этом секторе пока нет других игроков.</div>';}
 const status=$('mpStatus');if(status)status.textContent=zoneSocket?.connected?'🟢 Подключено к общей Зоне':'🔴 Нет соединения';
 const statusText=$('mpStatusText');if(statusText)statusText.textContent=`Онлайн: ${onlinePlayers.length} · ${zoneSocket?.connected?'все игроки видят друг друга':'переподключение…'}`;
}
function locationName(id){return g.locations.find(x=>x.id===id)?.name||id||'Неизвестно'}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function syncNpcRosterToClient(){
 const roster=serverWorld?.npcState||{};g.npcs||=[];
 for(const npc of Object.values(roster)){
  if(!npc||!npc.alive)continue;
  let local=g.npcs.find(x=>x.id===npc.id);
  if(!local){local={id:npc.id,name:npc.name,role:npc.role||'сталкер',loc:npc.location,faction:npc.faction,icon:npc.icon||'◉',desc:`${npc.personality||'обычный'} сталкер. ${npc.action==='travel'?'Сейчас в пути.':'Находится в секторе.'}`,mood:npc.mood||'нейтральное',generated:!!npc.generated,topics:[],greeting:''};g.npcs.push(local);}
  local.name=npc.name||local.name;local.loc=npc.location||local.loc;local.faction=npc.faction||local.faction;local.role=npc.role||local.role;local.icon=npc.icon||local.icon;local.generated=!!npc.generated;local.mood=npc.mood||local.mood;local.biography=npc.biography||local.biography;local.friends=npc.friends||[];local.rivals=npc.rivals||[];local.squadId=npc.squadId||null;local.personality=npc.personality||local.personality;local.dialogueVersion=npc.dialogueVersion||0;
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
 const items=(g.items||[]).filter(x=>x.qty>0&&['med','bread','bolt','scrap','bandage','artifact','canned','sausage','condensed','water','tea','ration'].includes(x.id));
 el.innerHTML=others.map(p=>`<div class="item block"><b>${escapeHtml(p.name)}</b><div class="desc">${escapeHtml(p.faction)} · ${escapeHtml(locationName(p.location))}</div><div class="rightbuttons" style="margin-top:7px"><select class="field" id="tradeItem_${p.id}">${items.map(x=>`<option value="${escapeHtml(x.id)}">${escapeHtml(x.name)} · есть ${x.qty}</option>`).join('')}</select><input class="field" id="tradeQty_${p.id}" type="number" min="1" max="99" value="1" style="width:62px"><input class="field" id="tradePrice_${p.id}" type="number" min="0" max="1000000" value="0" style="width:82px" placeholder="₽"><button onclick="sendPlayerTrade('${p.id}')" ${items.length?'':'disabled'}>Предложить</button></div></div>`).join('');
}
function sendPlayerTrade(to){if(!zoneSocket?.connected)return alert('Нет соединения.');const item=$(`tradeItem_${to}`)?.value,qty=Number($(`tradeQty_${to}`)?.value),price=Number($(`tradePrice_${to}`)?.value);zoneSocket.emit('trade:offer',{to,item,qty,price});}
function renderIncomingTrades(){const el=$('incomingTrades');if(!el)return;el.innerHTML=incomingTrades.map(o=>`<div class="item block"><b>${escapeHtml(o.fromName)}</b><div class="desc">Предлагает: ${escapeHtml(o.itemName)} ×${o.qty} за ${o.price} ₽</div><div class="rightbuttons"><button onclick="respondTrade('${o.id}',true)">Принять</button><button onclick="respondTrade('${o.id}',false)">Отклонить</button></div></div>`).join('')||'<div class="mutedbox small">Нет входящих предложений.</div>';}
function respondTrade(offerId,accept){zoneSocket?.emit('trade:respond',{offerId,accept});incomingTrades=incomingTrades.filter(x=>x.id!==offerId);renderIncomingTrades();}
function renderCoopQuests(list){const el=$('coopQuestList');if(!el)return;el.innerHTML=(list||[]).map(q=>{const joined=q.participants?.includes(zonePlayerId),arrived=q.arrivals?.includes(zonePlayerId);return `<div class="item block"><div style="display:flex;justify-content:space-between;gap:8px"><b>${escapeHtml(q.title)}</b><span class="tag">${q.done?'Выполнено':`${q.arrivals?.length||0}/${q.required} прибыли`}</span></div><div class="desc">${escapeHtml(q.description)} · сектор: ${escapeHtml(locationName(q.location))}</div><div class="small">Группа: ${q.participants?.length||0} · награда: ${q.reward} ₽ и ${q.xp} опыта</div><div class="rightbuttons" style="margin-top:7px">${!joined&&!q.done?`<button onclick="joinCoop('${q.id}')">Вступить</button>`:''}${joined&&!arrived&&!q.done?`<button onclick="contributeCoop('${q.id}')">Отметить прибытие</button>`:''}</div></div>`}).join('')||'<div class="mutedbox small">Пока нет совместных заданий.</div>';}
function joinCoop(id){zoneSocket?.emit('coop:join',{questId:id});}
function contributeCoop(id){zoneSocket?.emit('coop:contribute',{questId:id});}
function renderServerChat(){const el=$('mpChat');if(!el)return;el.innerHTML='';for(const m of serverChat.slice(-80)){const row=document.createElement('div');row.style.padding='5px 8px';const time=new Date(m.time||Date.now()).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});row.textContent=`[${time}] ${m.name}: ${m.text}`;el.appendChild(row);}el.scrollTop=el.scrollHeight;}
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
 $('factionDescription').textContent=factionLore[setupFaction]||'Выбранная сторона Зоны.';
 root.classList.add('show');
}
function selectSetupFaction(name){const current=$('setupCallsign').value;setupFaction=name;openCharacterSetup();$('setupCallsign').value=current;}
function confirmCharacter(){
 const name=$('setupCallsign').value.trim().replace(/[<>]/g,'').slice(0,24);
 if(name.length<2)return alert('Позывной должен содержать минимум 2 символа.');
 if(!g.factions.some(f=>f.name===setupFaction))return alert('Выбери группировку из списка.');
 g.name=name;g.faction=setupFaction;g.characterCreated=true;
 g.news.unshift({day:g.day,hour:String(g.hour).padStart(2,'0')+':00',title:'Регистрация завершена',body:`Сталкер ${name} зарегистрирован в КПК. Группировка: ${setupFaction}.`});
 g.log.unshift(`Позывной: ${name}. Группировка: ${setupFaction}.`);
 $('characterSetup').classList.remove('show');save();mpSyncLocation();
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
function combatLog(text){if(!battle)return;battle.log.unshift(text);battle.log=battle.log.slice(0,12);$('combatLog').innerHTML=battle.log.map(x=>`<div>${escapeHtml(x)}</div>`).join('');}
function renderCombat(){if(!battle)return;const e=battle.enemy;$('enemyName').textContent=e.name;$('enemyIcon').textContent=e.icon;$('enemyDesc').textContent=e.desc;$('enemyHpText').textContent=Math.max(0,e.hp)+' / '+e.maxHp;$('enemyHpBar').style.width=Math.max(0,e.hp/e.maxHp*100)+'%';$('playerHpText').textContent=g.hp+'%';$('playerHpBar').style.width=g.hp+'%';const w=equippedWeapon();$('combatWeapon').textContent=w?`${w.name} · сила ${weaponPower(w)} · состояние ${w.condition??'—'}%`:'Нет оружия · сила 8';}
function finishCombat(result){if(!battle)return;const name=battle.enemy.name;if(result==='win'){const reward=60+Math.floor(Math.random()*100),xp=18+Math.floor(Math.random()*16);g.money+=reward;g.xp+=xp;log(`Столкновение завершено: ${name}. Награда ${reward} ₽ и ${xp} опыта.`);news('Сводка столкновения',`${g.name} пережил встречу с угрозой в районе «${here().name}».`);}else if(result==='escape'){log('Ты отступил и избежал дальнейшего столкновения.');g.stamina=Math.max(0,g.stamina-8);}else{g.hp=15;log('Столкновение завершилось неудачно. Ты смог отойти, но потерял часть здоровья.');}
 battle=null;$('combatOverlay').classList.remove('show');save();}
function enemyTurn(){if(!battle)return;const baseDamage=battle.enemy.power+Math.floor(Math.random()*5);const armor=g.items.find(x=>x.name===g.equipment?.suit&&x.type==='Броня');const defense=armor?Math.round((Number(armor.condition??70)/100)*4):0;const damage=Math.max(2,baseDamage-defense-(battle.guard?Math.round(baseDamage*.65):0));battle.guard=false;g.hp=Math.max(0,g.hp-damage);combatLog(`${battle.enemy.name} наносит условный урон: −${damage} здоровья.`);if(g.hp<=0){g.hp=15;finishCombat('loss');return;}renderCombat();}
function combatAction(action){if(!battle)return;
 if(action==='retreat'){if(Math.random()<.68){finishCombat('escape');return;}combatLog('Отступление не удалось: противник не даёт пройти.');enemyTurn();return;}
 if(action==='guard'){battle.guard=true;combatLog('Ты занял защитную позицию. Следующий ответный урон будет снижен.');enemyTurn();return;}
 if(action==='med'){const med=g.items.find(x=>x.id==='med'&&x.qty>0)||g.items.find(x=>x.type==='Медицина'&&x.qty>0);if(!med)return alert('В рюкзаке нет аптечки.');med.qty--;g.hp=Math.min(100,g.hp+32);combatLog('Использована аптечка: здоровье восстановлено.');enemyTurn();save();return;}
 const w=equippedWeapon(),power=weaponPower(w),damage=Math.max(4,power+Math.floor(Math.random()*9)-3);battle.enemy.hp=Math.max(0,battle.enemy.hp-damage);if(w&&w.condition!=null)w.condition=Math.max(0,w.condition-1);combatLog(`Ты провёл игровую атаку. Противник потерял ${damage} очков здоровья.`);
 if(battle.enemy.hp<=0){renderCombat();finishCombat('win');return;}enemyTurn();save();
}


const originalTravel=travel;
travel=function(id){const before=g.loc;originalTravel(id);if(g.loc!==before)setTimeout(()=>startRandomEncounter(false),120);};
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
function livingNews(title,body){g.news.unshift({day:g.day,hour:String(g.hour).padStart(2,"0")+":00",title,body});g.news=g.news.slice(0,60);g.campFeed.unshift({title,body,day:g.day});g.campFeed=g.campFeed.slice(0,12);}
function livingRank(){let xp=g.xp||0;return xp>=900?"Ветеран":xp>=500?"Старший боец":xp>=250?"Боец":xp>=100?"Новобранец":"Рекрут";}
function renderLivingZone(){
 if(!$("livingStats"))return; initLivingState();
 $("livingStats").innerHTML=[["Сектор",here().name],["Активные контракты",g.contracts.filter(c=>c.accepted&&!c.done).length],["События лагеря",g.campFeed.length]].map(x=>`<div class="stat"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join("");
 $("npcRelations").innerHTML=g.npcs.slice(0,18).map(n=>{let v=g.relationships[n.id]||0;return `<div class="item"><div><b>${escapeHtml(n.icon||"◉")} ${escapeHtml(n.name)}</b><div class="desc">${escapeHtml(n.role)} · отношение ${v>0?"+":""}${v}</div></div><button onclick="livingTalk('${n.id}')">Укрепить связь</button></div>`}).join("");
 $("factionRank").innerHTML=`<b>${escapeHtml(g.faction)} · ${livingRank()}</b><div class="desc">Опыт: ${g.xp} · Репутация: ${g.rep}. Следующий ранг открывается с ростом опыта и выполнением поручений.</div>`;
 $("contracts").innerHTML=g.contracts.map(c=>`<div class="item block"><b>${escapeHtml(c.title)}</b><div class="desc">${escapeHtml(c.desc)} · ${c.reward} ₽ / ${c.xp} XP</div><span class="tag">${c.done?"Выполнен":c.accepted?"В работе":"Доступен"}</span><div class="rightbuttons">${!c.accepted&&!c.done?`<button onclick="livingAccept('${c.id}')">Взять контракт</button>`:""}${c.accepted&&!c.done?`<button onclick="livingComplete('${c.id}')">Сдать контракт</button>`:""}</div></div>`).join("");
 $("patrols").innerHTML=g.patrols.slice(0,8).map(p=>`<div class="item"><span>🪖 ${escapeHtml(p.faction)} · ${escapeHtml(g.locations.find(l=>l.id===p.loc)?.name||p.loc)}</span><b>${p.strength} бойцов</b></div>`).join("")||'<div class="mutedbox small">Патрули пока не отмечены. Проверь обстановку.</div>';
 $("patrols").innerHTML += g.locations.map(l=>`<div class="item"><span>${escapeHtml(l.name)} · ${escapeHtml(l.owner)} · ${l.control}%</span>${l.owner!==g.faction?`<button onclick="livingTerritory('${l.id}')">Влияние · 350 ₽</button>`:""}</div>`).join("");
 const eco=serverWorld?.ecosystem;
 const packs=(eco?.mutantPacks||[]).filter(p=>p.location===g.loc);
 const bases=Object.values(eco?.bases||{}).filter(b=>b.faction===g.faction);
 const clans=Object.values(eco?.clans||{}).filter(c=>c.faction===g.faction);
 $("campFeed").innerHTML=g.campFeed.slice(0,6).map(e=>`<div class="item"><b>${escapeHtml(e.title)}</b><div class="desc">${escapeHtml(e.body)}</div></div>`).join("")||'<div class="mutedbox small">У костра пока тихо.</div>';
 $("campFeed").innerHTML += `<div class="section">Экосистема сектора</div><div class="item"><b>Мутанты поблизости: ${packs.reduce((a,p)=>a+p.count,0)}</b><div class="desc">${packs.map(p=>`${escapeHtml(p.species)} ×${p.count}`).join(' · ')||'Следов мутантов поблизости не обнаружено.'}</div></div><div class="section">Базы группировки</div>${bases.map(b=>`<div class="item"><b>${escapeHtml(locationName(b.location))} · уровень ${b.level}</b><div class="desc">Укрепления ${b.fortification}% · припасы ${b.supplies}%</div><button onclick="upgradeZoneBase('${b.location}')">Улучшить · 500 ₽</button></div>`).join('')||'<div class="mutedbox small">У группировки пока нет зарегистрированных баз.</div>'}<div class="section">Кланы</div><div class="item"><b>Кланов твоей группировки: ${clans.length}</b><div class="desc">${clans.map(c=>`${escapeHtml(c.name)} · ${c.members.length} участников`).join(' · ')||'Создай клан, чтобы собирать отряд.'}</div><button onclick="createZoneClan()">Создать клан</button></div>`;
}
function upgradeZoneBase(location){if(!zoneSocket?.connected)return alert('Для улучшения базы нужно подключение к серверу.');zoneSocket.emit('base:upgrade',{location});}
function createZoneClan(){const name=prompt('Название клана (3–24 символа):');if(!name)return;if(!zoneSocket?.connected)return alert('Для создания клана нужно подключение к серверу.');zoneSocket.emit('clan:create',{name});}
function livingTalk(id){initLivingState();let n=npcBy(id);if(!n)return;g.relationships[id]=Math.min(100,(g.relationships[id]||0)+5);g.rep=Math.min(1000,g.rep+1);livingNews("Новая связь: "+n.name,`Ты провёл время с ${n.name}. Личное доверие выросло до ${g.relationships[id]}.`);log("Отношения с "+n.name+" улучшились.");save();}
function livingAccept(id){let c=g.contracts.find(x=>x.id===id);if(!c||c.done)return;c.accepted=true;livingNews("Контракт принят",c.title+" · заказчик: "+c.giver);save();}
function livingComplete(id){let c=g.contracts.find(x=>x.id===id);if(!c||!c.accepted||c.done)return;if(g.loc!==c.loc)return alert("Для сдачи контракта вернись в сектор: "+(g.locations.find(l=>l.id===c.loc)?.name||c.loc));if(c.item&&count(c.item)<c.qty)return alert("Не хватает предметов: "+c.item+" ×"+c.qty);if(c.item)take(c.item,c.qty);c.done=true;g.money+=c.reward;g.xp+=c.xp;g.rep+=c.rep;livingNews("Контракт выполнен",`${c.title}. Получено ${c.reward} ₽ и ${c.xp} опыта.`);save();}
function livingCamp(){initLivingState();consumeTime(1);g.hour++;g.stamina=Math.min(100,g.stamina+16);let nearby=nearbyNpcs(),n=nearby[Math.floor(Math.random()*Math.max(1,nearby.length))];let stories=["У костра спорят о безопасной тропе через соседний сектор.","Кто-то рассказывает историю о тайнике, который появляется на старых картах.","Сталкеры делятся припасами и обсуждают последние новости КПК.","Незнакомец предлагает обменяться сведениями о патрулях."];let body=stories[Math.floor(Math.random()*stories.length)];if(n){g.relationships[n.id]=Math.min(100,(g.relationships[n.id]||0)+2);body+=` ${n.name} стал относиться к тебе немного теплее.`;}livingNews("Вечер у костра",body);save();}
function livingRumor(){let rumors=["На Свалке видели усиленный патруль Бандитов.","Торговцы ждут караван с медикаментами на Кордоне.","Учёные отмечают рост аномальной активности на Янтаре.","На севере ищут проводника, знающего обходные тропы.","Говорят, контроль над одним из лагерей скоро изменится."];livingNews("Слух КПК",rumors[Math.floor(Math.random()*rumors.length)]);g.rep+=1;save();}
function livingPatrol(){initLivingState();let factions=g.factions.map(f=>f.name),faction=factions[Math.floor(Math.random()*factions.length)],loc=g.locations[Math.floor(Math.random()*g.locations.length)].id;g.patrols.unshift({faction,loc,strength:2+Math.floor(Math.random()*7),at:Date.now()});g.patrols=g.patrols.slice(0,12);livingNews("Обновление патрулей",`Разведка заметила отряд группировки «${faction}» в секторе ${g.locations.find(l=>l.id===loc).name}.`);save();}
function livingEmissionShelter(){initLivingState();if(!g.emission.active&&!g.emission.warning)return alert("Сейчас выброса нет. По КПК поступают обычные фоновые сигналы.");g.emission.active=false;g.emission.warning=false;g.hp=Math.max(1,g.hp-3);livingNews("Пережитый выброс","Ты укрылся в безопасном месте. Получено лёгкое истощение, но удалось избежать основного удара.");save();}
function livingTerritory(id){let l=g.locations.find(x=>x.id===id);if(!l)return;if(l.owner===g.faction)return alert("Этот сектор уже под влиянием твоей группировки.");if(g.money<350)return alert("Нужно 350 ₽ на снабжение операции.");g.money-=350;l.control=Math.min(100,l.control+25);if(l.control>=100){let old=l.owner;l.owner=g.faction;l.control=55;livingNews("Смена контроля",`${l.name}: влияние перешло от «${old}» к «${g.faction}».`);g.rep+=8;}else livingNews("Операция влияния",`${g.faction} укрепляет позиции в секторе ${l.name}. Контроль: ${l.control}%.`);save();}
function livingWorldTick(){initLivingState();g.worldTick++;if(Math.random()<.16){g.emission.warning=true;livingNews("Предупреждение КПК: выброс","Зафиксирован рост радиационного фона. Найди укрытие и не задерживайся на открытой местности.");}else if(g.emission.warning&&Math.random()<.45){g.emission.warning=false;g.emission.active=true;g.hp=Math.max(1,g.hp-12);livingNews("Выброс","Волна накрыла сектор. Без укрытия ты получил повреждения.");}if(Math.random()<.22)livingPatrol();}
initLivingState();

function renderWar(){
 const ops=serverWorld?.warOperations||[],history=serverWorld?.warHistory||[],owners=serverWorld?.territoryOwners||{};
 if(serverWorld?.territoryOwners){for(const l of g.locations){if(owners[l.id])l.owner=owners[l.id];if(serverWorld.territoryControl?.[l.id]!==undefined)l.control=serverWorld.territoryControl[l.id];}renderMap();}
 const active=ops.filter(x=>x.status==='active');
 if($('warStats'))$('warStats').innerHTML=[["Активные операции",active.length],["Твоя сторона",g.faction],["Текущий сектор",here().name]].map(x=>`<div class="stat"><span>${escapeHtml(String(x[0]))}</span><strong style="font-size:15px">${escapeHtml(String(x[1]))}</strong></div>`).join('');
 const current=active.find(x=>x.location===g.loc);
 if($('warCurrent'))$('warCurrent').innerHTML=current?warOperationHtml(current):`<div class="mutedbox small">В секторе ${escapeHtml(here().name)} активной операции нет.</div>${(owners[g.loc]||here().owner)!==g.faction?`<div class="item"><span>Контроль сектора: ${escapeHtml(owners[g.loc]||here().owner)}</span><button onclick="warCreate()">Объявить штурм · 350 ₽</button></div>`:'<div class="mutedbox small">Сектор под контролем твоей группировки. Здесь нельзя объявить штурм.</div>'}`;
 if($('warOperations'))$('warOperations').innerHTML=active.map(warOperationHtml).join('')||'<div class="mutedbox small">Активных операций нет. Фронт пока спокоен.</div>';
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
 else if(ev.type==='zone_event'){const e=payload; if(e.title){g.news.unshift({day:g.day,hour:String(g.hour).padStart(2,'0')+':00',title:e.title,body:e.body||'Мировое событие'});g.news=g.news.slice(0,60);renderNews();}}
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
async function connectZone(){
 const clientReady = window.zoneSocketClientReady ? await window.zoneSocketClientReady : (typeof io==='function');
 if(!clientReady || typeof io!=='function'){
  setOnlineConnectionState('offline','Не удалось загрузить Socket.IO. Проверь интернет или открой игру с сервера. Если игра размещена отдельно, укажи адрес Node-сервера ниже.');
  return;
 }
 if(zoneSocket){try{zoneSocket.removeAllListeners();zoneSocket.disconnect();}catch{}}
 const serverUrl=(localStorage.getItem('zoneServerUrl')||'').trim();
 if($('mpServerUrl') && $('mpServerUrl').value!==serverUrl)$('mpServerUrl').value=serverUrl;
 try{zoneSocket=io(serverUrl||undefined,{transports:['polling','websocket'],upgrade:true,timeout:10000,reconnection:true,reconnectionAttempts:Infinity,reconnectionDelay:1000,reconnectionDelayMax:8000});
 zoneSocket.on('connect',()=>{setOnlineConnectionState('connecting','Связь установлена. Завершаем вход в Зону…');const lastRevision=Number(localStorage.getItem('zoneWorldRevision')||0);zoneSocket.timeout(12000).emit('player:hello',{id:zonePlayerId,state:g,lastRevision},(err,result)=>{if(err){setOnlineConnectionState('offline','Сервер не ответил на запрос входа за 12 секунд. Проверь адрес сервера и его журнал ошибок.');console.error('player:hello acknowledgement timeout');return;}if(!result?.ok){setOnlineConnectionState('offline',result?.message||'Сервер отклонил вход.');}});});
 zoneSocket.on('connect_error',err=>{const target=(localStorage.getItem('zoneServerUrl')||window.location.origin).trim();setOnlineConnectionState('offline',`Не удалось подключиться к ${target}: ${err?.message||'ошибка сети'}. Проверь адрес сервера, его запуск и доступность /health.`);});
 zoneSocket.io.on('reconnect_attempt',()=>setOnlineConnectionState('connecting','Повторное подключение к серверу…'));
 zoneSocket.on('player:hello:error',data=>setOnlineConnectionState('offline',data?.message||'Не удалось завершить вход.'));
 zoneSocket.on('server:error',e=>{console.warn(e.message);setOnlineConnectionState('offline',e?.message||'Ошибка сервера.');});
 zoneSocket.on('player:ready',data=>{
  setOnlineConnectionState('online',data.persistent?'Сервер подключён. Профиль и общий мир сохраняются в PostgreSQL.':'Сервер подключён в режиме памяти. Для постоянных сохранений настрой PostgreSQL.');
  zonePlayerId=data.id;localStorage.setItem('zoneOnlinePlayerId',zonePlayerId);
  if(data.savedState&&typeof data.savedState==='object'){applyingServerState=true;g=data.savedState;if(g.characterCreated===undefined)g.characterCreated=true;migrateWorld();localStorage.setItem('zoneExpandedSave',JSON.stringify(g));applyingServerState=false;render();if(g.characterCreated)$('characterSetup')?.classList.remove('show');else if(!$('characterSetup')?.classList.contains('show'))openCharacterSetup();}
  serverWorld=data.world||null;syncNpcRosterToClient();applyWorldSync(data.worldSync);if(serverWorld?.discoveredPoints)applySharedDiscoveredPoints(serverWorld.discoveredPoints);renderWar();renderOnlineWorldStatus(data.status);if(serverWorld?.diplomacy){g.diplomacy=serverWorld.diplomacy;renderDiplomacy();}if(serverWorld?.npcPositions)applySharedNpcPositions(serverWorld.npcPositions);renderCoopQuests(serverWorld?.coOpQuests||[]);
  onlinePlayers=data.players||[];serverChat=data.chat||[];renderOnlinePlayers();renderServerChat();
  if($('mpName'))$('mpName').value=g.name;
  $('mpStatusText').textContent=data.persistent?'Сервер подключён · профиль и общий мир сохраняются в PostgreSQL.':'Сервер подключён · внимание: без PostgreSQL прогресс на сервере сбросится после перезапуска.';
  if(!data.savedState)zoneSocket.emit('player:save',g);
  renderPlayerTrade();renderIncomingTrades();mpSyncLocation();
 });
 zoneSocket.on('world:players',list=>{onlinePlayers=list||[];renderOnlinePlayers();renderPlayerTrade();renderOnlineWorldStatus();});
 zoneSocket.on('world:sync',data=>applyWorldSync(data));
 zoneSocket.on('world:status',data=>renderOnlineWorldStatus(data));
 zoneSocket.on('world:event',ev=>{if(!ev||!Number.isFinite(Number(ev.revision)))return;const current=Number(localStorage.getItem('zoneWorldRevision')||0);if(Number(ev.revision)<=current)return;localStorage.setItem('zoneWorldRevision',String(ev.revision));renderOnlineWorldStatus();handleOnlineWorldEvent(ev);});
 zoneSocket.on('world:npcs',positions=>applySharedNpcPositions(positions));
 zoneSocket.on('world:npc-event',ev=>{if(!ev)return;const titles={npc_skirmish:'Перестрелка между отрядами',npc_squad_raid:'Рейд сталкерского отряда',npc_replacement:'Новый сталкер в Зоне',npc_travel:'Сталкер сменил сектор',npc_dialogue_updated:'Новые разговоры у сталкеров'};g.news.unshift({day:g.day,hour:String(g.hour).padStart(2,'0')+':00',title:titles[ev.type]||'Событие среди сталкеров',body:ev.text||'Изменения активности NPC.'});g.news=g.news.slice(0,60);renderNews();log('Сводка КПК: '+(ev.text||'активность сталкеров')+'.');});
 zoneSocket.on('world:npc-state',data=>{const previousVersion=activeNpc?npcBy(activeNpc)?.dialogueVersion:null;serverWorld=serverWorld||{};serverWorld.npcState=data?.npcs||{};serverWorld.npcEvents=data?.events||[];serverWorld.npcSquads=data?.squads||[];serverWorld.npcMemorial=data?.memorial||[];syncNpcRosterToClient();const active=npcBy(activeNpc);if(active&&previousVersion!==null&&previousVersion!==active.dialogueVersion){const box=$('dialogueBox'),choices=box?.querySelector('.choices');if(choices)choices.innerHTML=(active.topics||[]).map((t,i)=>`<button onclick="topic('${active.id}',${i})">› ${escapeHtml(t[0])}</button>`).join('')+`<button onclick="closeTalk()">Попрощаться</button>`;const hint=box?.querySelector('.dialogue-top .small');if(hint)hint.textContent='Темы разговора обновились · доверие: '+(Number(active.relationship)||0);}renderPeople();renderQuick();});
 zoneSocket.on('world:ecosystem',data=>{serverWorld=serverWorld||{};serverWorld.ecosystem=data;renderLivingZone();});
 zoneSocket.on('ecosystem:result',data=>{if(data?.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}alert(data?.message||'');renderLivingZone();});
 zoneSocket.on('npc:interaction-result',data=>{if(data?.reply){const n=npcBy(data.npcId);if(n&&data.dialogue){n.greeting=data.dialogue.greeting;n.topics=data.dialogue.topics;}const box=$('dialogueBox');if(box){const paragraphs=String(data.reply).split(/(?<=[.!?])\s+/).filter(Boolean);const choices=(data.dialogue?.topics||[]).map((t,i)=>`<button onclick=\"topic('${data.npcId}',${i})\">› ${escapeHtml(t[0])}</button>`).join('');box.innerHTML=`<div class=\"dialogue-screen\"><div class=\"dialogue-top\"><div class=\"avatar portrait\">${escapeHtml(n?.icon||'◉')}</div><div><b class=\"speaker\">${escapeHtml(n?.name||'Сталкер')}</b><div class=\"desc\">${escapeHtml(n?.role||'сталкер')} · ${escapeHtml(n?.faction||'')}</div><div class=\"small muted\">Доверие: ${Number(data.relationship)||0} · разговор обновлён</div></div></div><div class=\"dialogue\">${paragraphs.map(x=>`<p>${escapeHtml(x)}</p>`).join('')}</div><div class=\"choices\">${choices}<button onclick=\"closeTalk()\">Попрощаться</button></div></div>`;}else alert(data.reply);}else if(data?.reason)alert(data.reason);});
 zoneSocket.on('world:poi',points=>applySharedDiscoveredPoints(points));
 zoneSocket.on('world:zoneEvent',ev=>{g.news.unshift({day:g.day,hour:String(g.hour).padStart(2,'0')+':00',title:ev.title,body:ev.body});g.news=g.news.slice(0,60);renderNews();log('Сводка КПК: '+ev.title+'.');});
 zoneSocket.on('world:coop',list=>renderCoopQuests(list));
 zoneSocket.on('war:state',data=>{serverWorld=serverWorld||{};serverWorld.warOperations=data.operations||[];serverWorld.warHistory=data.history||[];renderWar();});
 zoneSocket.on('war:result',data=>{if(data.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}if(data.world)serverWorld=data.world;alert(data.message||'');renderWar();});
 zoneSocket.on('war:reward',data=>{if(data.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}alert(data.won?'Победа! +180 ₽, +35 опыта и +5 репутации.':'Операция завершена. +35 опыта, репутация скорректирована.');});
 zoneSocket.on('trade:incoming',offer=>{incomingTrades.push(offer);renderIncomingTrades();});
 zoneSocket.on('market:result',data=>{if(data.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}alert(data.message||'Операция выполнена.');});
 zoneSocket.on('trade:result',data=>{alert(data.message|| (data.ok?'Обмен выполнен.':'Обмен не выполнен.'));if(data.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}});
 zoneSocket.on('coop:result',data=>{alert(data.message||'');});
 zoneSocket.on('coop:reward',data=>{if(data.state){g=data.state;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();}alert(`Совместное задание выполнено: +${data.reward} ₽ и ${data.xp} опыта.`);});
 zoneSocket.on('world:chat',m=>{serverChat.push(m);if(serverChat.length>100)serverChat=serverChat.slice(-100);renderServerChat();});
 zoneSocket.on('world:update',data=>{serverWorld=data.world||serverWorld;if(Number.isFinite(Number(serverWorld?.revision)))localStorage.setItem('zoneWorldRevision',String(serverWorld.revision));renderOnlineWorldStatus();renderWar();renderCoopQuests(serverWorld?.coOpQuests||[]);if(serverWorld?.diplomacy){g.diplomacy=serverWorld.diplomacy;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));renderDiplomacy();}if(data.notice){g.news.unshift({day:g.day,hour:String(g.hour).padStart(2,'0')+':00',title:'Мировая сводка',body:data.notice});g.news=g.news.slice(0,40);renderNews();}});
 zoneSocket.on('diplomacy:result',data=>{if(!data.ok){alert(data.message||'Операция не выполнена.');return;}if(data.state){g.money=data.state.money;g.rep=data.state.rep;localStorage.setItem('zoneExpandedSave',JSON.stringify(g));}if(data.world?.diplomacy)g.diplomacy=data.world.diplomacy;render();});
 zoneSocket.on('disconnect',reason=>{setOnlineConnectionState('offline',`Связь потеряна (${reason||'disconnect'}). Автоматически переподключаемся…`);renderOnlinePlayers();renderOnlineWorldStatus();});
 }catch(error){console.error('Socket.IO initialization failed:',error);setOnlineConnectionState('offline','Не удалось запустить сетевой клиент: '+(error?.message||'неизвестная ошибка'));}
}
function mpConnect(){
 const field=$('mpServerUrl'),raw=(field?.value||'').trim();
 if(raw){
  let parsed;try{parsed=new URL(raw);}catch{return alert('Укажи полный адрес сервера, например https://zone-online.onrender.com');}
  if(!['http:','https:'].includes(parsed.protocol))return alert('Адрес сервера должен начинаться с http:// или https://');
  localStorage.setItem('zoneServerUrl',parsed.origin);
 }else localStorage.removeItem('zoneServerUrl');
 setOnlineConnectionState('connecting','Проверяем адрес сервера и устанавливаем новое соединение…');
 connectZone();
}
// All normal game saves are mirrored to the server. The server keeps one profile per player.
save=function(){localStorage.setItem('zoneExpandedSave',JSON.stringify(g));render();if(!applyingServerState&&zoneSocket?.connected&&zonePlayerId){zoneSocket.emit('player:save',g);zoneSocket.emit('player:update',{name:g.name,location:g.loc,faction:g.faction});}};
// Vendor transactions are validated by the server while online.
buy=function(i){const x=tradeGoods()[i];if(!x)return;if(zoneSocket?.connected){zoneSocket.emit('market:buy',{item:x[1]});return;}if(g.money<x[3])return alert('Не хватает рублей.');g.money-=x[3];addItem(x[1],x[0],x[2],x[5],x[4],Math.floor(x[1]==='bolt'?5:1));log('Куплено: '+x[0]+'.');save();};
sell=function(id){if(zoneSocket?.connected){zoneSocket.emit('market:sell',{item:id});return;}const x=g.items.find(i=>i.id===id);if(!x)return;const amount=Math.min(x.qty,1);x.qty-=amount;g.money+=Math.floor(x.value*.65);if(x.qty<=0)g.items=g.items.filter(i=>i.id!==id);log('Продан предмет: '+x.name+'.');save();};
// Diplomacy is a shared server-side operation, not a client-only counter.
adjustDiplomacy=function(name,action){if(!zoneSocket?.connected)return alert('Подключись к общей Зоне, чтобы вести переговоры.');zoneSocket.emit('diplomacy:action',{target:name,action});};
if($('mpMessage'))$('mpMessage').addEventListener('keydown',e=>{if(e.key==='Enter')mpSend();});
connectZone();
if(!g.characterCreated)openCharacterSetup();
