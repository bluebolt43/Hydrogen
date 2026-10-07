(()=>{
'use strict';
TheaterFrame.mountControls({title:'海盜紙雕劇場',attacks:{barrel:'火藥桶',ball:'手印排球',pirates:'空投三海賊',kraken:'觸手＋落雷'}});
const embedded=new URLSearchParams(location.search).has('embed');
const storyVictory=new URLSearchParams(location.search).has('story-victory');


const catalog=JSON.parse(document.getElementById('catalog').textContent),$=id=>document.getElementById(id),stage=$('stage'),spinner=$('spinner'),enemy=$('enemy'),picker=$('enemy-type'),next=$('next-state'),daynight=$('daynight'),message=$('status'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let typeIndex=0,stateIndex=0,isNight=false,isBusy=false,level=1,maxHp=3,hp=3,defeated=false;
const soundBank=embedded?null:new PinballSound(PirateMap.sounds);
if(soundBank)for(const event of ['pointerdown','keydown'])addEventListener(event,()=>soundBank.unlock(),{capture:true});
function sound(name){if(embedded)parent.postMessage({channel:'pinball-theater',type:'sound',name},'*');else soundBank.play(name);}
const damage={ball:1,barrel:2,pirates:3,kraken:4};
const cache=new Map();function preload(src){if(!cache.has(src)){const im=new Image();im.src=src;cache.set(src,im.decode().then(()=>im).catch(e=>{cache.delete(src);throw e;}));}return cache.get(src);}
function lock(v){isBusy=v;picker.disabled=next.disabled=daynight.disabled=v;$('height').disabled=v;document.querySelectorAll('[data-attack]').forEach(b=>b.disabled=v||defeated);$('next-level').disabled=v||!defeated;}
function backgroundSources(type){const src=type.id==='kraken'?'res/img/pirate-story-kraken-cave.png':type.id==='sea-serpent'?'res/img/pirate-story-waterfall-channel.png':null;return src?[src,src]:['res/img/pirate-theater-background-day.png','res/img/pirate-theater-background-night.png'];}
function sync(){const type=catalog[typeIndex],anchor=type.states[stateIndex].waterAnchor;for(const [i,id] of ['day','night'].entries()){const image=$(id),src=backgroundSources(type)[i];if(image.getAttribute('src')!==src)image.src=src;}stage.style.setProperty('--enemy-width',(32*type.scale)+'%');stage.style.setProperty('--enemy-anchor',(-100*anchor)+'%');stage.style.setProperty('--water-pivot',(100*anchor)+'%');$('states').replaceChildren(...type.states.map((s,i)=>{const el=document.createElement('span');el.textContent=s.label;el.className=i===stateIndex?'active':'';return el;}));enemy.alt=type.name+'・'+type.states[stateIndex].label;message.textContent=enemy.alt;stage.dataset.enemy=type.id;stage.dataset.state=type.states[stateIndex].id;positionHealth();}
function animate(el,from,to,duration){if(!duration){el.style.transform=to;return Promise.resolve();}const animation=el.animate([{transform:from},{transform:to}],{duration,easing:'linear',fill:'forwards'});return animation.finished.then(()=>{el.style.transform=to;animation.cancel();});}
function healthState(value,maximum){return value*100<=maximum*34?2:value*100<=maximum*67?1:0;}
let healthPositionFrame=0;
function positionHealth(){
 if(healthPositionFrame)return;
 healthPositionFrame=requestAnimationFrame(()=>{
  healthPositionFrame=0;const hud=$('health-hud');if(hud.hidden)return;
  const bounds=stage.getBoundingClientRect(),boss=document.querySelector('.enemy-anchor').getBoundingClientRect();
  hud.style.top=Math.max(5,boss.top-bounds.top-hud.getBoundingClientRect().height-5)+'px';
 });
}
new ResizeObserver(positionHealth).observe(stage);
new ResizeObserver(positionHealth).observe($('hearts'));
function renderHealth(previous=hp){
 $('health-hud').setAttribute('aria-label',`第 ${level} 關，敵人血量 ${hp}，最大血量 ${maxHp}`);
 const loss=TheaterFrame.renderHealth($('hearts'),hp,previous);
 positionHealth();
 return loss;
}
async function flip(to){
 const asset=catalog[typeIndex].states[to];await preload(asset.src);
 const duration=reduced.matches?0:Number($('speed').value);
 message.textContent='翻面中…';
 await animate(spinner,'rotateY(0deg)','rotateY(90deg)',duration/2);
 enemy.src=asset.src;stateIndex=to;
 stage.style.setProperty('--enemy-anchor',(-100*asset.waterAnchor)+'%');stage.style.setProperty('--water-pivot',(100*asset.waterAnchor)+'%');stage.dataset.swapAngle='90';
 spinner.style.transform='rotateY(-90deg)';await animate(spinner,'rotateY(-90deg)','rotateY(0deg)',duration/2);spinner.style.transform='rotateY(0deg)';sync();
}
// Story mode uses this theater's original enemy, water layers and sinking path.
async function victoryBlast(){
 const layer=$('attack-layer'),smoke='res/img/pirate-explosion-smoke.png';
 await preload(smoke);sound('explosion');
 const w=stage.clientWidth,h=stage.clientHeight,size=w*.256;
 const animations=[],puffs=[];
 try{
  for(let i=0;i<3;i++){
   const puff=document.createElement('img');puff.src=smoke;puff.className='attack-sprite';puff.style.width=size+'px';layer.append(puff);puffs.push(puff);
   const x=w*(.45+i*.05)-size/2,y=h*.52-size/2;
   const pose=(scale,dy)=>`translate(${x}px,${y+dy}px) scale(${scale})`;
   animations.push(puff.animate([{transform:pose(.2,0),opacity:0},{transform:pose(.95,0),opacity:1,offset:.15},{transform:pose(1.15,-w*.012),opacity:.9,offset:.5},{transform:pose(1.4,-w*.04),opacity:0}],{duration:1400,delay:i*400,fill:'both'}));
  }
  const frames=Array.from({length:39},(_,i)=>{const fade=1-i/38;return {transform:`translate(${Math.sin(i*2.7)*w*.012*fade}px,${Math.cos(i*4.1)*h*.035*fade}px)`,offset:i/38}});
  frames[0].transform=frames[38].transform='translate(0,0)';
  animations.push(stage.animate(frames,{duration:2200}));
  await Promise.all(animations.map(a=>a.finished));
 }finally{animations.forEach(a=>a.cancel());puffs.forEach(p=>p.remove());}
}
async function sinkingThumb(){
 const src='res/img/pirate-story-thumbs-up.png';
 await preload(src);
 const water=stage.clientHeight*2/3+stage.clientWidth*.019333;
 const size=stage.clientWidth*.23;
 const hand=document.createElement('img');
 hand.src=src;hand.alt='海賊伸出拇指，慢慢沉入海中';
 hand.style.cssText=`position:absolute;width:${size}px;height:auto;left:calc(50% - ${size*1.07}px);top:0;z-index:2;pointer-events:none;rotate:-15deg`;
 stage.append(hand);
 const submerged=`translateY(${stage.clientHeight+2}px)`,raised=`translateY(${water-size*.52}px)`;
 const emerge=`translateY(${water}px)`;
 hand.style.transform=emerge;
 try{
  stage.dataset.combat='thumb-rise';
  const halfway=`translateY(${water-size*.26}px)`;
  await animate(hand,emerge,halfway,900);
  if(embedded)sound('snare');
  await animate(hand,halfway,raised,900);
  stage.dataset.combat='thumb-hold';
  await new Promise(resolve=>setTimeout(resolve,1200));
  stage.dataset.combat='thumb-sinking';
  await animate(hand,raised,submerged,8000);
 }finally{hand.remove();stage.dataset.combat='defeated';}
}
async function playStoryVictory(){
 lock(true);
 try{
  typeIndex=catalog.findIndex(t=>t.id==='pirate-gunship');stateIndex=2;
  const asset=catalog[typeIndex].states[stateIndex];
  await Promise.all([preload(asset.src),preload('res/img/pirate-explosion-smoke.png'),preload('res/img/pirate-story-thumbs-up.png')]);
  enemy.src=asset.src;hp=1;maxHp=3;defeated=false;sync();
  isNight=true;$('day').hidden=true;$('night').hidden=false;stage.classList.add('night');
  document.querySelectorAll('.curtain').forEach(el=>el.style.display='none');
  $('health-hud').hidden=true;spinner.style.visibility='visible';spinner.style.transform='rotateY(0deg)';
  await resolveDamage('kraken');
  await sinkingThumb();
 }finally{lock(false);}
}
async function resolveDamage(kind){
 const remaining=Math.max(0,hp-damage[kind]),to=healthState(remaining,maxHp);
 if(remaining>0&&to!==stateIndex)await preload(catalog[typeIndex].states[to].src);
 const previous=hp;hp=remaining;const heartLoss=renderHealth(previous);
 if(hp===0){
  defeated=true;stage.classList.add('defeated');stage.dataset.combat='sinking';message.textContent='敵人下沉…';
  const rect=spinner.getBoundingClientRect(),stageRect=stage.getBoundingClientRect();
  const distance=stageRect.bottom-rect.top+rect.height*.1;
  const isShip=['bamboo-raft','lateen-boat','pirate-gunship','heavy-warship'].includes(catalog[typeIndex].id);
  if(isShip){
   spinner.style.transformOrigin='50% 81%';
   try{
    await animate(spinner,'translateY(0px) rotate(0deg)','translateY(0px) rotate(-22deg)',reduced.matches?0:(storyVictory?2200:350));
    if(storyVictory)await victoryBlast();
    const sinkDistance=storyVictory?stage.clientHeight*2/3+stage.clientWidth*.019333-(rect.top-stageRect.top)+rect.height*.1:distance+rect.height*.25;
    await animate(spinner,'translateY(0px) rotate(-22deg)',`translateY(${sinkDistance}px) rotate(-22deg)`,reduced.matches?0:(storyVictory?7500:950));
   }finally{spinner.style.transformOrigin='';}
  }else{
   await animate(spinner,'translateY(0px)',`translateY(${distance}px)`,reduced.matches?0:1300);
  }
  spinner.style.visibility='hidden';stage.dataset.combat='defeated';message.textContent='擊敗敵人！按「下一關」繼續。';
 }else{
  if(to!==stateIndex)await flip(to);
  message.textContent=`命中，扣 ${previous-hp} 心！剩餘 ${hp} / ${maxHp}。`;
 }
 await heartLoss;
}
const frame=TheaterFrame.create(stage,(el,frames,duration)=>animate(el,frames[0].transform,frames[1].transform,duration));
const curtains=close=>frame.curtains(close);
async function warnAndClose(){
 stage.dataset.combat='warning';
 await TheaterFrame.warning(stage);
 stage.dataset.combat='closing';await curtains(true);
}
async function enterEnemy(){
 spinner.style.transform='rotateY(0deg)';spinner.style.visibility='visible';$('health-hud').hidden=false;positionHealth();
 stage.dataset.combat='opening';await curtains(false);delete stage.dataset.combat;message.textContent=enemy.alt;
}
async function choose(index,round=index+1,skipWarning=false){
 if(isBusy)return;lock(true);
 try{
  const asset=catalog[index].states[0];await Promise.all([asset.src,...backgroundSources(catalog[index])].map(preload));if(!skipWarning)await warnAndClose();
  typeIndex=index;stateIndex=0;level=round;maxHp=level+2;hp=maxHp;defeated=false;
  isNight=['pirate-gunship','rock-shell-beast'].includes(catalog[index].id);
  $('day').hidden=isNight;$('night').hidden=!isNight;stage.classList.toggle('night',isNight);
  daynight.textContent=isNight?'換成白天':'換成夜晚';
  stage.classList.remove('defeated');delete stage.dataset.combat;spinner.style.transform='rotateY(0deg)';spinner.style.visibility='';
  enemy.src=asset.src;picker.value=String(index);sync();renderHealth();await enterEnemy();
 }catch(e){picker.value=String(typeIndex);message.textContent='敵人圖片載入失敗。';}finally{lock(false);}
}
async function nextLevel(){if(!defeated||isBusy)return;await choose((typeIndex+1)%catalog.length,level+1);}
async function changeDay(){if(isBusy)return;lock(true);try{await frame.transition(()=>{isNight=!isNight;$('day').hidden=isNight;$('night').hidden=!isNight;stage.classList.toggle('night',isNight);daynight.textContent=isNight?'換成白天':'換成夜晚';});}finally{lock(false);}}

catalog.forEach((t,i)=>{const o=document.createElement('option');o.value=i;o.textContent=t.name;picker.append(o);});next.onclick=()=>choose(typeIndex,level);$('next-level').onclick=nextLevel;picker.onchange=()=>choose(Number(picker.value));daynight.onclick=changeDay;
$('height').oninput=e=>stage.style.aspectRatio=100/Number(e.target.value);$('water').onclick=e=>{const paused=stage.classList.toggle('still');e.currentTarget.textContent=paused?'播放動態':'暫停動態';e.currentTarget.setAttribute('aria-pressed',String(paused));};

const attackAssets={barrel:'pirate-explosive-barrel.png',ball:'pirate-volleyball.png',pirates:'pirate-airborne-crew.png'};
async function attack(kind){
 if(kind==='kraken')return tentacleAttack();
 if(isBusy||defeated||!attackAssets[kind])return;
 lock(true);
 const layer=$('attack-layer'),animations=[];
 const play=async(el,frames,duration,delay=0)=>{
  const a=el.animate(frames,{duration:reduced.matches?1:duration,delay:reduced.matches?0:delay,fill:'both',easing:'linear'});
  animations.push(a);await a.finished;
 };
 const sprite=(src,size)=>{const im=document.createElement('img');im.src=src;im.className='attack-sprite';im.style.width=size+'px';im.alt='';layer.append(im);return im;};
 try{
  const src='res/img/'+attackAssets[kind],smoke='res/img/pirate-explosion-smoke.png';
  await Promise.all([preload(src),preload(smoke)]);
  const rect=stage.getBoundingClientRect(),w=rect.width,h=rect.height;
  const anchor=document.querySelector('.enemy-anchor').getBoundingClientRect();
  const targetX=anchor.left-rect.left+anchor.width*.5;
  // Aim at the exposed part of the enemy, above the foreground wave crest.
  const waterY=h*2/3+w*.019333;
  const targetY=Math.max(w*.07,Math.min(anchor.top-rect.top+anchor.height*.40,waterY-w*.025));
  const count=kind==='pirates'?3:1;
  message.textContent=kind==='barrel'?'火藥桶投擲！':kind==='ball'?'排球出擊！':'三海賊空投！';
  stage.dataset.attack=kind;
  await Promise.all(Array.from({length:count},async(_,i)=>{
   const size=w*(count===3?.23:.28),spread=(i-(count-1)/2);
   const startX=w*.5+spread*w*.2,apexY=h-Math.min(h*.40,w*.19);
   const hitX=targetX+spread*anchor.width*.18,hitY=targetY;
   const spin=(i%2?-1:1)*720;
   const pose=(x,y,scale,angle)=>`translate(${x-size/2}px,${y-size/2}px) rotate(${angle}deg) scale(${scale})`;
   const im=sprite(src,size);
   await play(im,[
    {transform:pose(startX,h+size*.6,1,0),offset:0},
    {transform:pose(startX,apexY,1,0),offset:.24,easing:'ease-in'},
    {transform:pose(startX,apexY,1,0),offset:.27},
    {transform:pose((startX+hitX)/2,Math.min(apexY,hitY)-w*.07,.56,spin*.45),offset:.70},
    {transform:pose(hitX,hitY,.18,spin),offset:1}
   ],720,i*95);
   im.remove();
   sound('explosion');
   const puffSize=w*.256;
   const smokePose=(scale,dy)=>`translate(${hitX-puffSize/2}px,${hitY-puffSize/2+dy}px) scale(${scale})`;
   for(let burst=0;burst<(kind==='barrel'?2:1);burst++){
    const puff=sprite(smoke,puffSize);
    await play(puff,[{transform:smokePose(.2,0),opacity:0,offset:0},{transform:smokePose(.95,0),opacity:1,offset:.15},{transform:smokePose(1.15,-w*.012),opacity:.9,offset:.5},{transform:smokePose(1.4,-w*.04),opacity:0,offset:1}],650,burst?120:0);
    puff.remove();
   }
  }));
  await resolveDamage(kind);
 }catch(e){message.textContent='攻擊素材載入或播放失敗，請重新整理後再試。';}
 finally{animations.forEach(a=>a.cancel());layer.replaceChildren();delete stage.dataset.attack;lock(false);}
}

async function tentacleAttack(){
 if(isBusy||defeated)return;
 lock(true);
 const layers=[$('tentacle-behind'),$('tentacle-ahead')],fx=$('attack-layer'),animations=[];
 const play=async(el,frames,duration,easing='ease-in-out')=>{
  const a=el.animate(frames,{duration:reduced.matches?1:duration,easing,fill:'forwards'});
  animations.push(a);await a.finished;
 };
 const add=(layer,src,size,cls)=>{const im=document.createElement('img');im.src=src;im.className=cls;im.style.width=size+'px';im.alt='';layer.append(im);return im;};
 try{
  const dir='res/img/',tentacle=dir+'pirate-kraken-tentacle.png',bolt=dir+'pirate-lightning.png',smoke=dir+'pirate-explosion-smoke.png';
  await Promise.all([tentacle,bolt,smoke].map(preload));
  const rect=stage.getBoundingClientRect(),w=rect.width,h=rect.height;
  const enemyRect=document.querySelector('.enemy-anchor').getBoundingClientRect();
  const cx=enemyRect.left-rect.left+enemyRect.width/2;
  const waterY=h*2/3+w*.019333;
  const targetY=Math.max(w*.07,Math.min(enemyRect.top-rect.top+enemyRect.height*.4,waterY-w*.025));
  const size=w*.32,baseY=waterY+w*.075;
  const lowRise=['bamboo-raft','lateen-boat'].includes(catalog[typeIndex].id);
  const raisedY=baseY-size*.95+(lowRise?(size*.95-w*.075)/2:0);
  const arms=layers.map((layer,i)=>{
   const x=cx+(i===0?-1:1)*Math.max(enemyRect.width*.55,w*.115)-size/2;
   const mirror=i===0?1:-1;
   const pose=(y,angle)=>`translate(${x}px,${y}px) rotate(${angle}deg) scaleX(${mirror})`;
   return {im:add(layer,tentacle,size,'tentacle-sprite'),pose};
  });
  stage.dataset.attack='kraken';stage.dataset.attackPhase='rise';sound('thunder');message.textContent='觸手升起…';
  await Promise.all(arms.map(a=>play(a.im,[{transform:a.pose(h+size*.1,0)},{transform:a.pose(raisedY,0)}],700,'ease-out')));
  stage.dataset.attackPhase='sway';message.textContent='觸手擺動…';
  await Promise.all(arms.map((a,i)=>play(a.im,[0,-9,10,-6,0].map(angle=>({transform:a.pose(raisedY,angle*(i===0?1:-1))})),950)));
  stage.dataset.attackPhase='lightning';message.textContent='落雷！';
  const lightning=add(fx,bolt,w*.24,'attack-sprite');
  lightning.style.left=(cx-w*.12)+'px';lightning.style.top='0';lightning.style.height=(targetY+w*.015)+'px';
  lightning.style.objectFit='fill';lightning.style.transformOrigin='50% 0';
  await play(lightning,[{transform:'scaleY(0)',opacity:0},{transform:'scaleY(1)',opacity:1}],180,'ease-in');
  stage.dataset.attackPhase='explosion';sound('explosion');
  const puffSize=w*.256,puff=add(fx,smoke,puffSize,'attack-sprite');
  puff.style.left=(cx-puffSize/2)+'px';puff.style.top=(targetY-puffSize/2)+'px';
  await Promise.all([
   play(lightning,[{opacity:1},{opacity:0}],260),
   play(puff,[{transform:'scale(.2)',opacity:0,offset:0},{transform:'scale(1)',opacity:1,offset:.2},{transform:'translateY(-8px) scale(1.15)',opacity:.9,offset:.6},{transform:'translateY(-20px) scale(1.35)',opacity:0,offset:1}],700)
  ]);
  lightning.remove();puff.remove();
  await resolveDamage('kraken');
  stage.dataset.attackPhase='retract';message.textContent='觸手退回海中…';
  await Promise.all(arms.map(a=>play(a.im,[{transform:a.pose(raisedY,0)},{transform:a.pose(h+size*.1,0)}],650,'ease-in')));
  message.textContent=defeated?'擊敗敵人！按「下一關」繼續。':`命中，扣 4 心！剩餘 ${hp} / ${maxHp}。`;
 }catch(e){message.textContent='觸手合擊載入或播放失敗，請重新整理後再試。';}
 finally{animations.forEach(a=>a.cancel());layers.forEach(l=>l.replaceChildren());fx.replaceChildren();delete stage.dataset.attack;delete stage.dataset.attackPhase;lock(false);}
}

document.querySelectorAll('[data-attack]').forEach(b=>b.onclick=()=>attack(b.dataset.attack));

lock(true);
const ready=Promise.all([...document.querySelectorAll('.scene,.wave')].map(im=>im.decode()).concat(preload(enemy.src),preload('res/img/theater-curtain-right.png'))).then(async()=>{sync();renderHealth();if(!embedded){await warnAndClose();await enterEnemy();}else $('health-hud').hidden=true;lock(false);stage.dataset.ready='true';});ready.catch(()=>message.textContent='圖片載入失敗，請將 HTML 與 demo/assets 資料夾一起保留。');
let enemyPresent=false;
TheaterFrame.connect({stage,ready,
 bounds(){const s=stage.getBoundingClientRect();const rect=el=>{const r=el.getBoundingClientRect();return {x:(r.left-s.left)/s.width,y:(r.top-s.top)/s.height,w:r.width/s.width,h:r.height/s.height};};return {boss:rect(enemy),hearts:rect($('health-hud'))};},
 async reset(){
  await curtains(true);enemyPresent=false;typeIndex=stateIndex=0;level=1;hp=maxHp=3;defeated=false;
  isNight=false;$('day').hidden=false;$('night').hidden=true;stage.classList.remove('night','defeated');
  delete stage.dataset.combat;delete stage.dataset.attack;delete stage.dataset.attackPhase;
  $('attack-layer').replaceChildren();$('tentacle-behind').replaceChildren();$('tentacle-ahead').replaceChildren();
  $('hearts').replaceChildren();$('health-hud').hidden=true;spinner.style.visibility='hidden';spinner.style.transform='rotateY(0deg)';
  enemy.src=catalog[0].states[0].src;picker.value='0';sync();lock(false);
 },
 async enemy(data){
  if(enemyPresent&&!defeated)return;
  if(data.mode==='boss'&&Number.isInteger(data.stage)&&data.stage>=1&&data.stage<=catalog.length)await choose(data.stage-1,data.stage,data.skipWarning===true);
  else if(data.mode==='free'){const choices=catalog.map((_,i)=>i).filter(i=>!enemyPresent||i!==typeIndex);await choose(choices[Math.floor(Math.random()*choices.length)]);}
  else if(defeated)await nextLevel();else await choose(typeIndex,level);
  enemyPresent=true;
 },
 async attack(command){if(!enemyPresent||defeated)return;const kind={lv1:'ball',lv2:'barrel',lv3:'pirates',lv4:'kraken',airdrop:'pirates',ball:'ball',barrel:'barrel',kraken:'kraken'}[command];if(kind)await attack(kind);},
 state:()=>({defeated:enemyPresent&&defeated,maxHp}),
 storyVictory:()=>storyVictory?playStoryVictory():undefined
});
window.enemyTheater={ready,choose,changeDay,attack,nextLevel,catalog,getState:()=>({typeIndex,stateIndex,isBusy,isNight,level,hp,maxHp,defeated})};
})();
