/* Both Touhou parts share the theater frame and pinball-theater command protocol. */
(()=>{'use strict';
const secondPart=document.body.dataset.touhouPart==='2',part=secondPart?2:1;
const theaterData=secondPart?TOUHOU2_THEATER:TOUHOU1_THEATER;
TheaterFrame.mountControls({title:'東方賽銭録 '+(secondPart?'その弐':'その壱')+' · 戰鬥劇場',attacks:{lv1:'Lv1 靈符',lv2:'Lv2 陰陽玉',lv3:'Lv3 封魔陣',lv4:'Lv4 夢想封印'}});
if(!secondPart){const link=document.createElement('a');link.href=new URL('touhou1-spellcards.html',location.href).href;link.target='_blank';link.textContent='Boss 符卡遮罩設計';document.querySelector('.controls').append(link);}
const $=id=>document.getElementById(id),stage=$('stage'),enemies=$('enemies'),enemy=$('enemy'),boss=$('boss'),background=$('background'),effects=$('effects');
const params=new URLSearchParams(location.search),embedded=params.has('embed'),running=new Set();
const soundBank=embedded?null:new PinballSound(Object.fromEntries(Object.entries(PirateMap.sounds).map(([name,clip])=>[name,{...clip,src:new URL('../'+clip.src,document.baseURI).href}])));
if(soundBank)for(const event of ['pointerdown','keydown'])addEventListener(event,()=>soundBank.unlock(),{capture:true});
function sound(name){if(embedded)parent.postMessage({channel:'pinball-theater',type:'sound',name},'*');else soundBank.play(name);}
const levels=theaterData.bosses,damages={lv1:1,lv2:2,lv3:3,lv4:4};
const attackFrames={
 lv1:{approach:[{opacity:0,scale:1},{opacity:1,scale:1}],impact:[{opacity:1,scale:1},{opacity:0,scale:1.8}]},
 lv2:{approach:[{opacity:0,scale:.15,rotate:'-45deg'},{opacity:1,scale:.9,rotate:'0deg'}],impact:[{opacity:1,scale:.9,rotate:'0deg'},{opacity:.9,scale:1.2,rotate:'20deg',offset:.35},{opacity:0,scale:1.6,rotate:'45deg'}]},
 lv3:{approach:[{opacity:0,scale:.15,rotate:'-45deg'},{opacity:1,scale:.9,rotate:'0deg'}],impact:[{opacity:1,scale:.9,rotate:'0deg'},{opacity:.9,scale:1.2,rotate:'20deg',offset:.35},{opacity:0,scale:1.6,rotate:'45deg'}]},
 lv4:{approach:[{opacity:0,scale:.15,rotate:'-30deg'},{opacity:1,scale:.85,rotate:'0deg'}],impact:[{opacity:1,scale:.85,rotate:'0deg'},{opacity:1,scale:1.25,rotate:'25deg',offset:.3},{opacity:0,scale:1.9,rotate:'75deg'}]}
};
// Keep translation outside rotation so every effect stays centered on its anchor.
for(const frames of Object.values(attackFrames)){
 let rotation='0deg';
 for(const phase of ['approach','hold','impact'])for(const keyframe of frames[phase]||[]){
  rotation=keyframe.rotate||rotation;
  keyframe.transform=`translate(-50%,-50%) rotate(${rotation}) scale(${keyframe.scale??1})`;
  delete keyframe.rotate;delete keyframe.scale;
 }
}
let level=levels.some(b=>b.stage===Number(params.get('stage')))?Number(params.get('stage')):1,hp=0,busy=false,paused=false,loaded=false,generation=0;
const config=()=>levels[level-1],isPaused=()=>paused||stage.classList.contains('paused');
function state(){return {name:config().name,level,hp:[hp],maxHp:config().health,target:hp>0?0:-1,busy,paused:isPaused(),defeated:hp===0,background:config().background};}
function draw(){
 stage.dataset.level=String(level);stage.classList.toggle('defeated',hp===0);$('enemy-type').value=String(level);
 for(const button of document.querySelectorAll('[data-attack]'))button.disabled=!loaded||busy||isPaused()||!hp;
 $('next-state').disabled=!loaded;$('next-level').disabled=!loaded||busy||hp>0||level>=levels.length;$('enemy-type').disabled=!loaded||busy;
}
function animate(element,frames,milliseconds){
 const duration=matchMedia('(prefers-reduced-motion:reduce)').matches?0:milliseconds*Number($('speed').value)/1000;
 const animation=element.animate(frames,{duration,easing:'ease-out',fill:'forwards'});running.add(animation);if(isPaused())animation.pause();
 return animation.finished.catch(error=>{if(error.name!=='AbortError')throw error;}).finally(()=>running.delete(animation));
}
const frame=TheaterFrame.create(stage,animate);
function burst(duration){
 const element=document.createElement('div');element.className='attack-burst';effects.append(element);
 return animate(element,[
  {opacity:0,transform:'translate(-50%,-50%) scale(.2)'},
  {opacity:1,transform:'translate(-50%,-50%) scale(1.2)',offset:.22},
  {opacity:0,transform:'translate(-50%,-50%) scale(2.1)'}
 ],duration);
}
function pause(value){
 paused=!!value;soundBank?.setPaused(paused);stage.classList.toggle('paused',paused);
 for(const animation of running)paused?animation.pause():animation.play();
 $('water').textContent=paused?'播放動態':'暫停動態';$('water').setAttribute('aria-pressed',String(paused));draw();
}
function resetScene(){
 generation++;for(const animation of running)animation.cancel();running.clear();effects.replaceChildren();
 for(const animation of enemy.getAnimations())animation.cancel();
 soundBank?.stop();pause(false);hp=config().health;busy=false;
 boss.src=config().src;boss.alt=config().name+'・戰鬥';background.src=config().background;background.alt=config().name+'的戰鬥場景';
 stage.style.setProperty('--background-position',config().position||'50% 50%');
 TheaterFrame.renderHealth($('health'),hp);$('status').textContent='Boss '+level+' · '+config().name;draw();
}
async function enter(skipWarning=false){
 resetScene();busy=true;draw();const token=generation;
 await Promise.all([background.decode(),boss.decode()]);if(token!==generation)return;
 if(!skipWarning)await TheaterFrame.warning(stage);if(token!==generation)return;
 await frame.curtains(true);if(token!==generation)return;
 enemies.hidden=false;await frame.curtains(false);if(token!==generation)return;
 busy=false;draw();
}
async function choose(next,skipWarning=false){
 if(!Number.isInteger(next)||!levels[next-1])throw Error('東方 '+part+' 尚未建立此關卡');
 level=next;await enter(skipWarning);
}
async function reset(){resetScene();enemies.hidden=true;await frame.curtains(true);}
async function defeat(token){
 sound('explosion');await animate(enemy,[{opacity:1,translate:'0 0'},{opacity:0,translate:'0 15%'}],650);
 if(token===generation)enemies.hidden=true;
}
async function attack(command){
 const kind={ball:'lv1',barrel:'lv2',airdrop:'lv3',kraken:'lv4'}[command]||command;
 if(!damages[kind])throw Error('Unknown Touhou '+part+' attack: '+command);
 if(!loaded||busy||isPaused()||hp===0)return false;
 busy=true;draw();const token=generation,previous=hp,effect=TOUHOU_ATTACK_EFFECTS[kind];
 const impact=document.createElement('img');impact.className='attack-effect';impact.dataset.attack=kind;impact.dataset.phase='approach';impact.src=effect.src;impact.alt='';impact.style.width=effect.width+'%';effects.append(impact);
 try{
  await animate(impact,attackFrames[kind].approach,effect.approachDuration);
  if(token!==generation)return false;
  if(effect.holdDuration>0){
   impact.dataset.phase='hold';
   await animate(impact,attackFrames[kind].hold||[{opacity:1},{opacity:1}],effect.holdDuration);
   if(token!==generation)return false;
  }
  const explodes=kind==='lv1';
  hp=Math.max(0,hp-damages[kind]);impact.dataset.phase='impact';sound(explodes?'explosion':'metal');
  await Promise.all([TheaterFrame.renderHealth($('health'),hp,previous),
   animate(enemy,[{filter:'brightness(2)',translate:'-2% 0'},{filter:'brightness(1)',translate:'0 0'}],250),
   animate(impact,attackFrames[kind].impact,effect.impactDuration),
   ...(explodes?[burst(effect.impactDuration)]:[])]);
  if(token!==generation)return false;
  if(hp===0)await defeat(token);
  if(token!==generation)return false;
  $('status').textContent=hp?'剩餘 '+hp+' / '+config().health+' 顆心':'Boss '+level+' 完成';return true;
 }finally{if(token===generation){effects.replaceChildren();busy=false;draw();}}
}
$('enemy-type').replaceChildren(...levels.map(item=>{const option=document.createElement('option');option.value=item.stage;option.textContent='Boss '+item.stage+' · '+item.name;return option;}));
$('enemy-type').onchange=e=>choose(Number(e.target.value)).catch(error=>{$('status').textContent=error.message;});
$('next-state').onclick=()=>enter(true);$('next-level').onclick=()=>choose(level+1);
$('water').onclick=()=>pause(!paused);$('height').oninput=e=>stage.style.aspectRatio=100/Number(e.target.value);
$('daynight').textContent='各關專用背景';$('daynight').disabled=true;
document.querySelector('label:has(#speed)').firstChild.textContent='動畫速度 ';
for(const button of document.querySelectorAll('[data-attack]'))button.onclick=()=>attack(button.dataset.attack).catch(error=>{$('status').textContent=error.message;});
resetScene();enemies.hidden=true;
const sources=[...new Set(levels.flatMap(b=>[b.src,b.background]).concat(Object.values(TOUHOU_ATTACK_EFFECTS).map(effect=>effect.src),['img/theater-curtain-right.png','img/health-heart.svg']))];
const ready=Promise.all(sources.map(src=>{const image=new Image();image.src=src;return image.decode();})).then(async()=>{
 loaded=true;if(!embedded)await enter(params.has('skip-warning'));draw();
});
ready.catch(error=>{$('status').textContent='圖片載入失敗：'+error.message;});
window[secondPart?'Touhou2Theater':'Touhou1Theater']={attack,choose,reset,pause,state,get ready(){return loaded;}};
window.viewReady=ready;
window.viewAPI={play:()=>choose(level,true),suspend:()=>pause(true),resume:()=>pause(false)};
TheaterFrame.connect({stage,ready,reset,attack,state,
 async enemy(data){
  await choose(data.mode==='boss'?Number(data.stage):data.mode==='free'?1+Math.floor(Math.random()*levels.length):level,data.skipWarning);
  if(data.defeatOnly){hp=0;draw();busy=true;await defeat(generation);busy=false;draw();}
  if(data.attackDefeat)while(hp>0)await attack(data.attackDefeat);
 },
 bounds(){const s=stage.getBoundingClientRect(),r=$('health').getBoundingClientRect();return r.width&&r.height?{hearts:{x:(r.left-s.left)/s.width,y:(r.top-s.top)/s.height,w:r.width/s.width,h:r.height/s.height}}:{};}
});
addEventListener('pagehide',()=>{generation++;soundBank?.stop();for(const animation of running)animation.cancel();running.clear();});
})();
