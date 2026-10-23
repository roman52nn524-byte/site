const effects=[
 ['Дневной салют','Взрыв цвета в момент вашего «да»','ceremony'],
 ['Фейерверк-шоу','Ночной салют на финал свадьбы','finale'],
 ['Холодные сценические фонтаны','Световые акценты для особенных мгновений','dance finale'],
 ['Пиротехнические огни','Огненный акцент в вашей программе','finale'],
 ['Цветные дымовые вспышки','Яркая палитра выездной регистрации','ceremony'],
 ['Крио-пушки','Энергия танцпола в одном залпе','party'],
 ['Вертикальные дым-машины','Динамичные струи дыма в ритме вечера','party'],
 ['Конфетти-запуск','Тысячи маленьких поводов для восторга','ceremony party'],
 ['Серпантин-запуск','Праздник, который заполняет пространство','party'],
 ['Снег на танец','Ваша маленькая зимняя сказка в любой сезон','dance'],
 ['Тяжёлый дым на сухом льду','Первый танец над облаками','dance'],
 ['Спаркуляры','Искры для самых ярких акцентов','dance party'],
 ['Пиротехническая вертушка','Вращение холодных сценических фонтанов','finale']
];
const scenarios={
 ceremony:{kicker:'МГНОВЕНИЕ, С КОТОРОГО ВСЁ НАЧИНАЕТСЯ',title:'Ваше «да» в цвете',description:'Объятия, первый поцелуй и вспышка цвета. Обсудим акцент, который подчеркнёт кульминацию церемонии.',tags:['Дневной салют','Цветные дымовые вспышки']},
 dance:{kicker:'ТОЛЬКО ВЫ. И НЕМНОГО ВОЛШЕБСТВА.',title:'Танец над облаками',description:'Тяжёлый дым стелется под ногами, а искры обрамляют вашу историю. Для нежного настроения можно обсудить снег.',tags:['Тяжёлый дым','Холодные фонтаны','Снег — по желанию']},
 party:{kicker:'КОГДА НАСТРОЕНИЕ НА МАКСИМУМЕ',title:'Всё на танцпол',description:'Конфетти, дымовые акценты и энергия гостей. Соберём эффекты в ритме вашего праздника.',tags:['Конфетти','Крио-пушки','Вертикальный дым']},
 finale:{kicker:'ПОСЛЕДНИЙ АККОРД. ПЕРВЫЕ МУРАШКИ.',title:'Небо в вашу честь',description:'Все рядом, вы держитесь за руки, и вечер заканчивается фейерверк-шоу. Именно этот момент хочется забрать с собой.',tags:['Ночной салют','Холодные фонтаны']}
};
const list=document.querySelector('#effect-list');
function renderEffects(filter='all'){
 list.replaceChildren();effects.forEach(([name,description,categories],i)=>{
  if(filter!=='all'&&!categories.split(' ').includes(filter))return;
  const row=document.createElement('div');row.className='effect-row';
  const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');
  const copy=document.createElement('div'),title=document.createElement('h3'),desc=document.createElement('p'),star=document.createElement('b');
  title.textContent=name;desc.textContent=description;star.textContent='✳';star.setAttribute('aria-hidden','true');copy.append(title,desc);row.append(number,copy,star);list.append(row);
 });
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});renderEffects(button.dataset.filter);
}));
let selected='dance';
function selectMoment(key){
 if(!scenarios[key])return;selected=key;const s=scenarios[key];
 document.querySelector('#scenario-kicker').textContent=s.kicker;document.querySelector('#scenario-title').textContent=s.title;document.querySelector('#scenario-description').textContent=s.description;
 document.querySelector('#scenario-tags').replaceChildren(...s.tags.map(tag=>{const el=document.createElement('span');el.textContent=tag;return el}));
 document.querySelectorAll('[data-select]').forEach(b=>{b.classList.toggle('active',b.dataset.select===key);b.setAttribute('aria-pressed',String(b.dataset.select===key))});
 document.querySelector('#share-status').textContent='';
}
document.querySelectorAll('[data-select]').forEach(b=>b.addEventListener('click',()=>selectMoment(b.dataset.select)));
document.querySelectorAll('[data-moment]').forEach(a=>a.addEventListener('click',()=>selectMoment(a.dataset.moment)));
function planText(){const s=scenarios[selected],date=document.querySelector('#wedding-date').value;return `Наша свадьба × Piro Family\n\n${s.title}\n${s.description}\n\nЭффекты: ${s.tags.join(', ')}${date?'\nДата: '+date.split('-').reverse().join('.'):''}\n\nХотим обсудить этот сценарий с Романом Аксеновым.\nНижний Новгород · https://pyro-family.ru/\n\nЭто идея для обсуждения. Состав, стоимость, дата и возможность запуска согласуются отдельно.`}
document.querySelector('#save-plan').addEventListener('click',()=>{
 const url=URL.createObjectURL(new Blob(['\ufeff'+planText()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Наша-свадьба-Piro-Family.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);document.querySelector('#share-status').textContent='Сценарий сохранён в файл. Отправьте его любимому человеку или Роману для обсуждения.';
});
document.querySelector('#share-plan').addEventListener('click',async()=>{
 const text=planText(),status=document.querySelector('#share-status');
 try{if(navigator.share){await navigator.share({title:'Наша свадьба × Piro Family',text});status.textContent='Сценарий передан в меню отправки.'}else if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);status.textContent='Сценарий скопирован. Отправьте его в любимый мессенджер.'}else{status.textContent='В этом браузере отправка недоступна. Нажмите «Сохранить наш сценарий» и отправьте файл.'}}catch(e){if(e.name!=='AbortError')status.textContent='Не удалось поделиться. Сохраните сценарий в файл — его тоже можно отправить.'}
});
document.querySelector('#year').textContent=new Date().getFullYear();renderEffects();selectMoment('dance');
// Canvas artwork: an original animated illustration, not a portfolio photograph.
const canvas=document.querySelector('#fireworks'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let w,h,particles=[],frame,last=0,lastBurst=0;
function burst(x,y,scale=1){for(let i=0;i<100;i++){const angle=Math.PI*2*i/100;const speed=(1+Math.random()*2.7)*scale;particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,decay:.004+Math.random()*.005,color:Math.random()>.25?'217,236,151':'245,211,163',trail:[]})}if(particles.length>800)particles.splice(0,particles.length-800)}
function resize(){w=canvas.clientWidth;h=canvas.clientHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);if(reduced.matches)still()}
function still(){ctx.clearRect(0,0,w,h);for(const [x,y,r] of [[w*.77,h*.29,w*.19],[w*.93,h*.6,w*.12]]){for(let i=0;i<90;i++){const a=i/90*Math.PI*2;ctx.strokeStyle=`rgba(217,236,151,${.15+(i%5)*.08})`;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r*.2,y+Math.sin(a)*r*.2);ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);ctx.stroke()}}}
function tick(time){const dt=Math.min((time-last)/16.67||1,2);last=time;ctx.clearRect(0,0,w,h);if(time-lastBurst>2100){burst(w*(.62+Math.random()*.3),h*(.16+Math.random()*.39),w<600?.6:1.1);lastBurst=time}
 for(const p of particles){p.trail.push([p.x,p.y]);if(p.trail.length>9)p.trail.shift();p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.009*dt;p.vx*=.995;p.life-=p.decay*dt;ctx.strokeStyle=`rgba(${p.color},${Math.max(0,p.life)*.65})`;ctx.lineWidth=1;ctx.beginPath();for(const [x,y] of p.trail)ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle=`rgba(${p.color},${Math.max(0,p.life)})`;ctx.fillRect(p.x,p.y,1.5,1.5)}particles=particles.filter(p=>p.life>0);frame=requestAnimationFrame(tick)}
function run(){cancelAnimationFrame(frame);if(reduced.matches){still();return}if(!document.hidden){last=performance.now();frame=requestAnimationFrame(tick)}}
window.addEventListener('resize',resize);document.addEventListener('visibilitychange',run);reduced.addEventListener('change',run);document.querySelector('#spark-trigger').addEventListener('click',()=>{if(reduced.matches){still();return}burst(w*.74,h*.3,1.8);burst(w*.9,h*.54,1.1)});resize();run();
