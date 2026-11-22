const test=require('node:test');
const assert=require('node:assert/strict');
const {ensureFactionRadio,listFactionRadio,postFactionRadio}=require('../src/systems/radio-network');
test('faction radio stores bounded messages in separate faction channels',()=>{const w={};const p={id:'p1',name:'Сталкер',faction:'Одиночки',location:'cordon'};const a=postFactionRadio(w,p,'Всем привет',100);assert.equal(a.ok,true);assert.equal(listFactionRadio(w,'Одиночки').length,1);assert.equal(listFactionRadio(w,'Долг').length,0);assert.equal(listFactionRadio(w,'Одиночки')[0].text,'Всем привет');});
test('faction radio sanitizes messages and rejects empty text',()=>{const w={};assert.equal(postFactionRadio(w,{faction:'Свобода'},'   ').ok,false);const r=postFactionRadio(w,{faction:'Свобода',name:'Радист'},'<script> тревога </script>',200);assert.equal(r.ok,true);assert.ok(!r.message.text.includes('<'));});
test('faction radio caps message length and history size',()=>{const w={},p={faction:'Учёные',name:'Сахаров'};for(let i=0;i<105;i++)postFactionRadio(w,p,'x'.repeat(300),i);assert.equal(listFactionRadio(w,'Учёные').length,100);assert.equal(listFactionRadio(w,'Учёные')[0].text.length,240);});
