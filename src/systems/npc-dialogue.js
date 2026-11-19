// Long-form contextual dialogue generator. Output changes with day, mood, faction and recent events.
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const topicsByRole = {
  торговец: ['О торговле','Что сейчас в дефиците?','Есть ли работа?'],
  механик: ['Что сломалось?','Какие детали нужны?','Что слышно на маршрутах?'],
  проводник: ['Какой путь безопаснее?','Что творится в соседнем секторе?','Возьмёшь попутчика?'],
  разведчик: ['Что видел на вылазке?','Где замечали патрули?','Есть свежие отметки?'],
  'собиратель артефактов': ['Что за аномалии впереди?','Находил что-нибудь редкое?','Как не потерять голову в поле?'],
  охотник: ['Есть следы мутантов?','Как прошла последняя охота?','Что водится поблизости?'],
  сталкер: ['Как дела в Зоне?','Что слышно у костров?','Куда держишь путь?']
};
const lines = {
  hello: ['Садись, если не торопишься. Тут разговор иногда полезнее целого магазина патронов.','Здорово. Только не стой спиной к проходу — привычка, от которой здесь трудно избавиться.','О, живой человек. Уже неплохое начало дня. Как сам, цел?','Привет, сталкер. Чай не обещаю, но пару историй точно найдётся.'],
  zone: ['Последние дни Зона будто прислушивается. Вроде тихо, а собаки даже ночью не лают. Мне это не нравится.','На старой дороге опять нашли свежие гильзы. Кто-то прошёл быстро и явно не гулял.','Слышал, на соседнем секторе поменялись патрули. Карты устаревают быстрее, чем ботинки.','Вчера видел караван. Шли молча, без песен. Значит, груз был дорогой или настроение плохое.'],
  joke: ['У меня был напарник по прозвищу Кастрюля. Не спрашивай почему. Он сам не знал.','Однажды я три часа искал тайник, а потом понял, что записал координаты на банке тушёнки. Банку съел.','Если встретишь человека по имени Пельмень — не смейся. Он однажды спас отряд верёвкой и терпением.','Говорят, Болт нашёл артефакт. Обычный болт. Но теперь ходит важный, будто ему Нобелевку выдали.'],
  work: ['Нужны люди, которые умеют смотреть по сторонам и не бросают товарища ради первой блестящей штуки. Сначала выясни обстановку, потом решим, что поручить.','Есть небольшое дело: проверить старую тропу, отметить опасные места и вернуться с конкретными сведениями. За красивые рассказы не плачу.','Пока свободного контракта нет. Но если увидишь пропавший ящик снабжения или следы чужого лагеря — запомни место. Это может пригодиться.'],
  memory: ['Я не сразу привык к Зоне. Первые недели вздрагивал от каждого шороха, а теперь иногда пугаюсь тишины сильнее выстрелов.','Был у меня товарищ. Умел чинить всё — от детектора до чужого настроения. После одной вылазки он не вернулся, и с тех пор я всегда проверяю, все ли дошли до костра.','Однажды я нашёл тайник, полный консервов, и поделился с незнакомцами. Через неделю они вытащили меня из аномального поля. Вот тебе и вся местная мораль: сегодня делишься тушёнкой, завтра тебе спасают жизнь.']
};
function dayKey(now=Date.now()){return Math.floor(now/900000);}
function pick(arr, seed){return arr[Math.abs(seed)%arr.length];}
function buildDialogue(npc, context={}, now=Date.now()) {
  const day=dayKey(now), seed=(npc.dialogueVersion||0)+(day*7)+(npc.name||'').length+(npc.history||[]).length;
  const role=npc.role||'сталкер', topics=topicsByRole[role]||topicsByRole.сталкер;
  const mood=npc.mood||'насторожен', location=context.locationName||npc.location||'секторе';
  const recent=context.recentWorldEvent||'В округе пока нет подтверждённых крупных событий.';
  const friend=context.friendName||''; const rival=context.rivalName||'';
  const personal=npc.biography?` ${npc.biography}`:'';
  const social=friend?` Кстати, я часто держусь с ${friend}; в этих местах надёжный товарищ дороже хорошего автомата.`:rival?` Есть тут один тип, ${rival}. Лучше не спрашивай, почему мы не здороваемся.`:'';
  const greeting=`${pick(lines.hello,seed)} ${npc.name} поправляет снаряжение и оглядывается на ${location}. ${pick(lines.zone,seed+3)}${personal}${social}`;
  const replies=[
    `${pick(lines.zone,seed+1)} ${recent} Я бы не советовал сегодня идти напрямик: сначала расспроси людей у костра, потом сверяй маршрут с КПК.`,
    `${pick(lines.joke,seed+2)} А если серьёзно — ${npc.faction||'местные'} сейчас ${mood==='весёлый'?'держатся бодро':mood==='уставший'?'выглядят вымотанными':'ведут себя осторожно'}. Запасы не бесконечные, и лишний шум никому не нужен.`,
    `${pick(lines.work,seed+4)} Если возьмёшься, возвращайся лично. Мне важны не слухи, а то, что ты увидел своими глазами. ${pick(lines.memory,seed+6)}`
  ];
  return { greeting, topics:topics.map((label,i)=>[label,replies[(i+seed)%replies.length]]), day, version:npc.dialogueVersion||0, updatedAt:now };
}
function interactDialogue(npc, player, action, context={}, now=Date.now()) {
  npc.dialogueHistory ||= [];
  const d=buildDialogue(npc,context,now);
  const relation=clamp(Number(npc.relationships?.[player.id])||0,-100,100);
  const prefix=relation>35?'Слушай, тебе я уже немного доверяю. ':relation< -20?'Не думай, что я забыл наши прошлые разногласия. ':'';
  const selected=Number.isInteger(Number(context.topicIndex))?d.topics[Math.max(0,Math.min(d.topics.length-1,Number(context.topicIndex)))]:null;
  const response=action==='greet'?`${prefix}${d.greeting} ${d.topics[0][1]}`:
    action==='ask'?`${prefix}${d.topics[1][1]} ${d.topics[2][1]}`:
    action==='topic'?`${prefix}${selected?selected[1]:'Сейчас не могу подобрать слова. Давай вернёмся к этому позже.'}`:
    action==='help'?`${prefix}Спасибо, это не пустяк. В Зоне помощь помнят дольше, чем обещания. ${d.topics[2][1]}`:
    action==='message'?`${prefix}${/привет|здрав|добрый/i.test(context.messageText||'')?'Здорово, сталкер. Рад, что написал.':/слух|новост|аномал/i.test(context.messageText||'')?d.topics[0][1]+' '+d.topics[1][1]:/работ|задани|помощ/i.test(context.messageText||'')?d.topics[2][1]:'Прочитал твоё сообщение. Сейчас обстановка непростая, но я запомню наш разговор. '+d.topics[0][1]}`:
    `${prefix}Давай без спешки обсудим условия. ${d.topics[0][1]}`;
  npc.dialogueHistory.push({playerId:player.id,action,day:d.day,at:now}); npc.dialogueHistory=npc.dialogueHistory.slice(-20);
  npc.lastDialogueAt=now;
  return { reply:response, dialogue:d, relationship:relation, npcId:npc.id };
}
module.exports={buildDialogue,interactDialogue,dayKey};
