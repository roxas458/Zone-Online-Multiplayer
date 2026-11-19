// Shared game data: canonical IDs and static definitions used by server modules.
const LOCATIONS = new Set(['cordon','dump','bar','agro','dark','yantar','army','red','pripyat','zaton','jupiter','yanov','kopachi','volkhov','iron']);
const FACTIONS = new Set(['Одиночки','Долг','Свобода','Бандиты','Военные','Учёные','Наёмники','Монолит','Чистое небо']);
const NPC_HOME = { sid:'cordon', wolf:'cordon', fanatic:'cordon', scout:'dump', bandit:'dump', barman:'bar', seriy:'bar', scientist:'agro', merc:'dark', prof:'yantar', freedom:'army', guide:'red', loner:'pripyat' };
const TRADE_ITEM_IDS = new Set(['med','bread','bolt','scrap','bandage','artifact']);
const SHOP = {med:{name:'Аптечка',type:'Медицина',desc:'Восстанавливает здоровье.',weight:.4,price:180,qty:1,value:100},bread:{name:'Хлеб',type:'Еда',desc:'Восстанавливает выносливость.',weight:.3,price:45,qty:1,value:35},bandage:{name:'Бинт',type:'Медицина',desc:'Полевой расходный предмет.',weight:.2,price:70,qty:1,value:45},scrap:{name:'Металлолом',type:'Материал',desc:'Материал для ремесла.',weight:.8,price:55,qty:1,value:30},bolt:{name:'Болты ×5',type:'Инструмент',desc:'Набор болтов.',weight:.1,price:40,qty:5,value:5}};
const SELL_VALUES = {med:100,bread:35,bolt:5,scrap:30,bandage:45,artifact:420};
const COOP_TEMPLATES = [{id:'survey_cordon',title:'Общая разведка Кордона',description:'Два сталкера должны прибыть на Кордон и подтвердить наблюдения.',location:'cordon',reward:240,xp:25,required:2},{id:'survey_yantar',title:'Исследовательская группа Янтаря',description:'Соберите группу из двух сталкеров на Янтаре.',location:'yantar',reward:420,xp:45,required:2}];
const ZONE_EVENTS=[
 {title:'Выброс на подходе',body:'По каналам КПК поступило предупреждение о нестабильной активности. Сталкеры ищут укрытия.'},
 {title:'Торговый караван',body:'Между безопасными секторами замечен караван. Торговцы ожидают новые поставки.'},
 {title:'Необычный сигнал',body:'Несколько детекторов зафиксировали странный сигнал. Источник пока не установлен.'},
 {title:'Ночная активность',body:'Проводники сообщают о движении в отдалённых районах. Некоторые маршруты временно обходят.'},
 {title:'Сводка группировок',body:'На нескольких территориях замечены новые патрули. Баланс сил может измениться.'}
];

module.exports = { LOCATIONS, FACTIONS, NPC_HOME, TRADE_ITEM_IDS, SHOP, SELL_VALUES, COOP_TEMPLATES, ZONE_EVENTS };
