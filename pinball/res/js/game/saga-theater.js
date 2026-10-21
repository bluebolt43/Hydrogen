/* Saga's eight paper-cut Boss scenes, following tmp/stone_saga.md v4.0. */
(()=>{'use strict';
const data=SAGA_THEATER,$=id=>document.getElementById(id);
TheaterFrame.mountControls({title:data.title+' · 戰鬥劇場',attacks:Object.fromEntries(Object.entries(data.attacks).map(([id,a])=>[id,id.toUpperCase()+' '+a.name]))});
const stage=$('stage'),boss=$('boss'),enemy=$('enemy'),enemies=$('enemies'),effects=$('effects'),background=$('background'),health=$('health');
for(const image of document.querySelectorAll('.saga-wave'))image.src=data.wavesSrc;
const params=new URLSearchParams(location.search),embedded=params.has('embed'),running=new Set();
const soundBank=embedded?null:new PinballSound(Object.fromEntries(Object.entries(PirateMap.sounds).map(([name,clip])=>[name,{...clip,src:new URL('../'+clip.src,document.baseURI).href}])));
if(soundBank)for(const name of ['pointerdown','keydown'])addEventListener(name,()=>soundBank.unlock(),{capture:true});
const levels=data.bosses;let level=levels.some(b=>b.stage===Number(params.get('stage')))?Number(params.get('stage')):1;
let hp=0,stateIndex=0,busy=false,paused=false,loaded=false,generation=0;
const config=()=>levels[level-1],isPaused=()=>paused||stage.classList.contains('paused');
function sound(name){if(embedded)parent.postMessage({channel:'pinball-theater',type:'sound',name},'*');else soundBank.play(name);}
function state(){return {name:config().name,level,hp:[hp],maxHp:config().health,target:hp>0?0:-1,busy,paused:isPaused(),state:stateIndex,defeated:hp===0,background:background.getAttribute('src')};}
function draw(){
 stage.dataset.state=config().states[stateIndex].id;
 $('states').replaceChildren(...config().states.map((state,i)=>{const e=document.createElement('span');e.textContent=state.label;e.className=i===stateIndex?'active':'';return e;}));
 stage.dataset.ocean=String(!!config().waves);stage.dataset.level=level;stage.dataset.motion=config().motion;stage.classList.toggle('defeated',hp===0);
 $('enemy-type').value=String(level);
 for(const b of document.querySelectorAll('[data-attack]'))b.disabled=!loaded||busy||isPaused()||hp===0;
 $('next-state').disabled=!loaded||busy;$('enemy-type').disabled=!loaded||busy;$('next-level').disabled=!loaded||busy||hp>0||level===levels.length;
 health.setAttribute('aria-label',`Boss 生命 ${hp} / ${config().health}`);
}
function animate(element,frames,milliseconds,easing='ease-in-out'){
 const duration=matchMedia('(prefers-reduced-motion:reduce)').matches?0:milliseconds*Number($('speed').value)/1000;
 const a=element.animate(frames,{duration,easing,fill:'forwards'});running.add(a);if(isPaused())a.pause();
 return a.finished.catch(e=>{if(e.name!=='AbortError')throw e;}).finally(()=>running.delete(a));
}
const frame=TheaterFrame.create(stage,animate);
function pause(value){paused=!!value;soundBank?.setPaused(paused);stage.classList.toggle('paused',paused);for(const a of running)paused?a.pause():a.play();$('water').textContent=paused?'播放動態':'暫停動態';$('water').setAttribute('aria-pressed',String(paused));draw();}
function cancelScene(){generation++;for(const a of running)a.cancel();running.clear();for(const e of [enemy,boss])for(const a of e.getAnimations())a.cancel();effects.replaceChildren();soundBank?.stop();return generation;}
// Pirate theater uses a width-sized square anchor at a fixed stage/water baseline.
// Changing theater height crops the view; Boss size depends only on its width.
function layout(){
 const c=config(),w=stage.clientWidth,h=stage.clientHeight,ratio=c.aspect;
 const visibleHeight=Math.min(1,1/ratio),size=w*.32*c.scale;
 enemy.style.width=size+'px';enemy.style.height=size+'px';
 if(c.waterAnchor!==undefined){
  // Align the sprite's immersion point to the boundary of the lower third.
  // Include contain's vertical letterbox; the sea horizon is a separate midpoint.
  const anchor=(1-visibleHeight)/2+c.waterAnchor*visibleHeight;
  enemy.style.top=(h*2/3)+'px';enemy.style.transform=`translate(-50%,-${anchor*100}%)`;
 }else{
  const baseline=h*2/3+w*.07;
  enemy.style.top=Math.max(baseline,size*visibleHeight+h*.08)+'px';
  enemy.style.transform=`translate(-50%,-${(1+visibleHeight)*50}%)`;
 }
 if(c.backgroundHorizon&&background.naturalWidth){
  const imageHeight=w*background.naturalHeight/background.naturalWidth;
  background.style.height=imageHeight+'px';background.style.top=(h*.5-imageHeight*c.backgroundHorizon)+'px';background.style.bottom='auto';
 }else{background.style.height='100%';background.style.top='0';background.style.bottom='0';}
 health.style.top=Math.max(5,enemy.getBoundingClientRect().top-stage.getBoundingClientRect().top-health.getBoundingClientRect().height-5)+'px';
}
new ResizeObserver(layout).observe(stage);new ResizeObserver(layout).observe(health);
function healthState(value,maximum){return value*100<=maximum*34?2:value*100<=maximum*67?1:0;}
async function flip(to,token){
 if(to===stateIndex)return;
 await animate(boss,[{transform:'rotateY(0deg)'},{transform:'rotateY(90deg)'}],500);if(token!==generation)return;
 boss.src=config().states[to].src;await boss.decode();if(token!==generation)return;
 stateIndex=to;boss.alt=config().name+' · '+config().states[to].label;draw();layout();
 await animate(boss,[{transform:'rotateY(-90deg)'},{transform:'rotateY(0deg)'}],500);
}
function applyScene(override){
 const c=config();hp=c.health;stateIndex=0;boss.src=c.states[0].src;boss.alt=c.name+' · 正常';
 enemy.hidden=false;enemy.style.opacity='';enemy.style.translate='';enemy.style.rotate='';
 background.src=override||c.background;background.alt=c.name+'的戰鬥場景';stage.style.setProperty('--background-position',c.backgroundPosition);
 TheaterFrame.renderHealth(health,hp);stage.dataset.phase='idle';$('status').textContent='Boss '+level+' · '+c.name;draw();layout();
}
async function enter(skipWarning=false,override){
 const token=cancelScene();if(!embedded)pause(false);busy=true;draw();
 await frame.curtains(true);if(token!==generation)return;
 enemies.hidden=true;applyScene(override);busy=true;draw();
 await Promise.all([boss.decode(),background.decode()]);if(token!==generation)return;layout();
 if(!skipWarning)await TheaterFrame.warning(stage);if(token!==generation)return;
 enemies.hidden=false;await frame.curtains(false);if(token!==generation)return;
 busy=false;draw();
}
async function choose(next,skipWarning=false,background){if(!Number.isInteger(next)||!levels[next-1])throw Error('Saga 尚未建立此關卡');level=next;await enter(skipWarning,background);}
async function reset(){const token=cancelScene();pause(false);busy=true;draw();await frame.curtains(true);if(token!==generation)return;enemies.hidden=true;applyScene();busy=false;draw();}
function sprite(src,className='prop'){const e=document.createElement('img');e.className=className;e.src=src;e.alt='';effects.append(e);return e;}
function effect(className){const e=document.createElement('div');e.className=className;effects.append(e);return e;}
function fragments(color,count=9){return Promise.all(Array.from({length:count},(_,i)=>{const p=effect('paper-piece');p.style.background=color;const angle=i/count*Math.PI*2;return animate(p,[{opacity:1,translate:'0 0',rotate:'0deg'},{opacity:0,translate:`${Math.cos(angle)*350}% ${Math.sin(angle)*280+180}%`,rotate:(i*47)+'deg'}],620);}));}
async function approach(kind,weapon,spread=0){
 // Pirate-style rise and receding spin, with a visible 352 ms presentation hold.
 const rect=stage.getBoundingClientRect(),anchor=enemy.getBoundingClientRect(),w=rect.width;
 const h=kind==='lv4'?w/data.aspectRatio:rect.height;
 const size=w*data.attacks[kind].width/100,startX=w*(.5+spread),apexY=h-Math.min(h*.40,w*.19);
 const hitX=kind==='lv4'?w*.5:anchor.left-rect.left+anchor.width*.5+w*spread*.35;
 const hitY=kind==='lv4'?w*.225:Math.max(w*.07,Math.min(anchor.top-rect.top+anchor.height*.40,h*.85));
 weapon.classList.add('projectile');weapon.style.height=size+'px';
 const pose=(x,y,scale,angle)=>`translate(${x-size/2}px,${y-size/2}px) rotate(${angle}deg) scale(${scale})`;
 await animate(weapon,[
  {transform:pose(startX,h+size*.6,1,0),offset:0},
  {transform:pose(startX,apexY,1,0),offset:.16,easing:'ease-in'},
  {transform:pose(startX,apexY,1,0),offset:.48},
  {transform:pose((startX+hitX)/2,Math.min(apexY,hitY)-w*.07,.56,324),offset:.80},
  {transform:pose(hitX,hitY,.18,720),offset:1}
 ],1100,'linear');
 weapon.dataset.hitX=hitX;weapon.dataset.hitY=hitY;
}
async function lightningFall(weapon,token){
 // Camera overlay: fixed top-center square, independent of Boss and stage height.
 const w=stage.clientWidth,x=w*.5;
 weapon.style.opacity='0';stage.dataset.phase='mask';
 const mask=effect('lightning-mask');
 await animate(mask,[0,1,.12,1,.12,1,.12,1].map(opacity=>({opacity})),900,'linear');if(token!==generation)return;
 stage.dataset.phase='lightning';sound('judgment');
 const bolt=sprite(data.lightningSrc,'lightning');
 Object.assign(bolt.style,{width:w*.24+'px',left:(x-w*.12)+'px',top:'0px',height:w*.24+'px',transformOrigin:'50% 0'});
 await animate(bolt,[{transform:'scaleY(0)',opacity:0},{transform:'scaleY(1)',opacity:1}],180,'ease-in');
 if(token!==generation)return;
 stage.dataset.phase='lightning-hold';
 await animate(bolt,[{opacity:1},{opacity:1}],220,'linear');if(token!==generation)return;
 await animate(bolt,[{opacity:1},{opacity:0}],180,'linear');if(token!==generation)return;
 stage.dataset.phase='pre-explosion';
 await animate(bolt,[{opacity:0},{opacity:0}],250,'linear');
}
async function electricCharge(weapon){
 weapon.style.opacity='0';stage.dataset.phase='charge';sound('electric-charge');
 const sphere=sprite(data.electricSrc,'electric-sphere');
 sphere.style.left=weapon.dataset.hitX+'px';sphere.style.top=weapon.dataset.hitY+'px';sphere.style.width='82%';sphere.style.height='92%';
 const pose=scale=>`translate(-50%,-50%) scale(${scale})`;
 await animate(sphere,[{opacity:0,transform:pose(.05)},{opacity:.32,transform:pose(.35),offset:.35},{opacity:.8,transform:pose(1)}],1500,'ease-out');
}
async function impact(kind,weapon){
 const tasks=[animate(enemy,[{translate:'0 0',filter:'brightness(1)'},{translate:'2% 0',filter:'brightness(1.7)',offset:.25},{translate:'0 0',filter:'brightness(1)'}],320)];
 if(kind==='lv3'){
  const sphere=effects.querySelector('.electric-sphere'),burst=sprite(data.electricBurstSrc,'electric-burst');
  burst.style.left=weapon.dataset.hitX+'px';burst.style.top=weapon.dataset.hitY+'px';burst.style.width='92%';burst.style.height='100%';
  const pose=scale=>`translate(-50%,-50%) scale(${scale})`;
  tasks.push(animate(sphere,[{opacity:.8},{opacity:0}],220,'ease-out'),animate(burst,[{opacity:0,transform:pose(.25)},{opacity:1,transform:pose(1),offset:.3},{opacity:0,transform:pose(1.15)}],650,'ease-out'));
  await Promise.all(tasks);return;
 }
 weapon.style.opacity='0';const puff=sprite('img/pirate/pirate-explosion-smoke.png','attack-smoke');
 const w=stage.clientWidth,h=stage.clientHeight,size=w*.256,x=Number(weapon.dataset.hitX),y=Number(weapon.dataset.hitY);
 puff.style.width=size+'px';
 const pose=(scale,dy)=>`translate(${x-size/2}px,${y-size/2+dy}px) scale(${scale})`;
 tasks.push(animate(puff,[{transform:pose(.2,0),opacity:0,offset:0},{transform:pose(.95,0),opacity:1,offset:.15},{transform:pose(1.15,-w*.012),opacity:.9,offset:.5},{transform:pose(1.4,-w*.04),opacity:0,offset:1}],650,'linear'));
 if(kind==='lv4')tasks.push(animate(effects.querySelector('.lightning-mask'),[{opacity:1},{opacity:0}],650,'ease-out'));

 await Promise.all(tasks);
}
async function defeat(token){
 stage.dataset.phase='defeat';sound('explosion');
 await animate(enemy,[{opacity:1},{opacity:0}],700,'ease-out');
 if(token===generation){enemy.hidden=true;stage.dataset.phase='defeated';}
}

async function attack(command){
 const kind={ball:'lv1',barrel:'lv2',airdrop:'lv3',kraken:'lv4'}[command]||command,a=data.attacks[kind];
 if(!a)throw Error('Unknown Saga attack: '+command);
 if(!loaded||busy||isPaused()||hp===0)return false;
 busy=true;draw();const token=generation,previous=hp;
 const weapon=effect('strike');weapon.dataset.attack=kind;weapon.dataset.phase='approach';weapon.style.width=a.width+'%';const image=document.createElement('img');image.src=a.src;image.alt='';weapon.append(image);
 try{
  const weapons=[weapon];
  if(kind==='lv2'){
   const fork=effect('strike');fork.dataset.attack=kind;fork.dataset.phase='approach';fork.style.width=a.width+'%';
   const image=document.createElement('img');image.src=a.secondarySrc;image.alt='';fork.append(image);weapons.push(fork);
  }
  await Promise.all(weapons.map((item,i)=>approach(kind,item,kind==='lv2'?(i===0?-.12:.12):0)));
  if(token!==generation)return false;
  if(kind==='lv2'){
   // Both utensils arrive together; the two blasts each deal one point.
   for(const item of weapons){item.style.opacity='0';item.dataset.phase='impact';}
   for(const item of weapons){
    const before=hp;hp=Math.max(0,hp-1);stage.dataset.phase='hit';sound('explosion');
    await Promise.all([TheaterFrame.renderHealth(health,hp,before),impact(kind,item)]);if(token!==generation)return false;
   }
  }else{
   if(kind==='lv3'){await electricCharge(weapon);if(token!==generation)return false;}
   if(kind==='lv4'){await lightningFall(weapon,token);if(token!==generation)return false;}
   hp=Math.max(0,hp-a.damage);stage.dataset.phase='hit';weapon.dataset.phase='impact';sound('explosion');
   await Promise.all([TheaterFrame.renderHealth(health,hp,previous),impact(kind,weapon)]);if(token!==generation)return false;
  }
  // Clear attack effects before the enemy defeat motion.
  effects.replaceChildren();
  await flip(healthState(hp,config().health),token);if(token!==generation)return false;
  if(hp===0)await defeat(token);else stage.dataset.phase='idle';
  if(token!==generation)return false;
  $('status').textContent=hp?`剩餘 ${hp} / ${config().health} 顆心`:`Boss ${level} 完成`;return true;
 }finally{if(token===generation){busy=false;draw();}}
}
$('enemy-type').replaceChildren(...levels.map(c=>{const o=document.createElement('option');o.value=c.stage;o.textContent=`Boss ${c.stage} · ${c.name}`;return o;}));
const showError=e=>{$('status').textContent=e.message;};
$('enemy-type').onchange=e=>choose(Number(e.target.value)).catch(showError);$('next-state').onclick=()=>enter(true).catch(showError);$('next-level').onclick=()=>choose(level+1).catch(showError);
$('water').onclick=()=>pause(!paused);$('height').oninput=e=>stage.style.aspectRatio=100/Number(e.target.value);$('daynight').textContent='各關劇情背景';$('daynight').disabled=true;
document.querySelector('label:has(#speed)').firstChild.textContent='動畫速度 ';
for(const b of document.querySelectorAll('[data-attack]'))b.onclick=()=>attack(b.dataset.attack).catch(showError);
applyScene();enemies.hidden=true;
const sources=[...new Set(levels.flatMap(b=>[b.background,...b.states.map(state=>state.src)]).concat(Object.values(data.attacks).flatMap(a=>[a.src,a.secondarySrc].filter(Boolean)),[data.wavesSrc,data.lightningSrc,data.electricSrc,data.electricBurstSrc,'img/theater-curtain-right.png','img/health-heart.svg','img/pirate/pirate-explosion-smoke.png']))];
const ready=Promise.all(sources.map(src=>{const image=new Image();image.src=src;return image.decode();})).then(async()=>{loaded=true;if(!embedded)await enter(params.has('skip-warning'));draw();});
ready.catch(e=>{$('status').textContent='素材載入失敗：'+e.message;});
window.SagaTheater={attack,choose,reset,pause,state,get ready(){return loaded;}};
window.viewReady=ready;window.viewAPI={play:()=>choose(level,true),suspend:()=>pause(true),resume:()=>pause(false)};
TheaterFrame.connect({stage,ready,reset,attack,state,async enemy(message){
 await choose(message.mode==='boss'?Number(message.stage):message.mode==='free'?1+Math.floor(Math.random()*levels.length):level,message.skipWarning,message.background);
 if(message.defeatOnly){hp=0;draw();busy=true;await flip(2,generation);await defeat(generation);busy=false;draw();}
 if(message.attackDefeat)while(hp>0)await attack(message.attackDefeat);
},bounds(){const s=stage.getBoundingClientRect(),r=health.getBoundingClientRect();return r.width&&r.height?{hearts:{x:(r.left-s.left)/s.width,y:(r.top-s.top)/s.height,w:r.width/s.width,h:r.height/s.height}}:{};}});
addEventListener('pagehide',()=>{cancelScene();});
})();
