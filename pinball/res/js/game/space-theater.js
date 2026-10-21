/* Space uses the shared theater controls, curtains and pinball-theater protocol. */
(()=>{'use strict';
TheaterFrame.mountControls({title:'宇宙點心紙雕劇場',attacks:Object.fromEntries(Object.entries(SPACE_THEATER.attacks).map(([key,value])=>[key,value.name]))});
const $=id=>document.getElementById(id),stage=$('stage'),enemies=$('enemies'),enemy=$('enemy'),boss=$('boss'),effects=$('effects');
const params=new URLSearchParams(location.search),embedded=params.has('embed'),running=new Set();
const soundBank=embedded?null:new PinballSound(Object.fromEntries(Object.entries(PirateMap.sounds).map(([name,clip])=>[name,{...clip,src:new URL('../'+clip.src,document.baseURI).href}])),{synth:true});
if(soundBank)for(const event of ['pointerdown','keydown'])addEventListener(event,()=>soundBank.unlock(),{capture:true});
function sound(name){if(embedded)parent.postMessage({channel:'pinball-theater',type:'sound',name},'*');else soundBank.play(name);}
const levels=SPACE_THEATER.bosses,damages={lv1:1,lv2:2,lv3:3,lv4:4};
const fleet=document.createElement("div");fleet.id="fleet";enemies.append(fleet);
let fleetHp=[];
const requested=Number(params.get('stage'));
let level=levels.some(b=>b.stage===requested)?requested:1,hp=0,busy=false,paused=false,loaded=false,generation=0,phaseIndex=0,entryBackground=SPACE_THEATER.background;
const config=()=>levels[level-1];
const phases=()=>config().phases||config().damageStates||[{health:config().health,src:config().src}];
const form=()=>phases()[phaseIndex];
const phaseFloor=()=>phases().slice(phaseIndex+1).reduce((sum,p)=>sum+p.health,0);
const phaseHealth=()=>hp-phaseFloor();
const isPaused=()=>paused||stage.classList.contains('paused');
function state(){return {name:config().name,level,hp:fleetHp.length?[...fleetHp]:[hp],maxHp:config().health,phase:phaseIndex+1,phaseCount:phases().length,phaseHp:phaseHealth(),phaseMaxHp:form().health,core:form().core?'empty-plate':null,target:fleetHp.length?fleetHp.findIndex(h=>h>0):hp>0?0:-1,busy,paused:isPaused(),defeated:hp===0,background:(form().background||entryBackground).includes('mechanized')?'mechanized':(form().background||entryBackground).includes('palace')?'palace':'space'};}
function applyForm(){
 enemy.hidden=!!config().ships;fleet.hidden=!config().ships;
 boss.src=form().src;boss.alt=config().name+(form().name?' · '+form().name:'');
 stage.querySelector('.background').src=form().background||entryBackground;
 stage.dataset.phase=String(phaseIndex+1);
 $('states').replaceChildren(...(config().phases||config().damageStates||[]).map((p,i)=>{const chip=document.createElement('span');chip.textContent=p.name;chip.className=i===phaseIndex?'active':'';return chip;}));
}
function hitPosition(){
 if(!form().core)return {x:50,y:56};
 const s=stage.getBoundingClientRect(),r=boss.getBoundingClientRect(),scale=Math.min(r.width/boss.naturalWidth,r.height/boss.naturalHeight),w=boss.naturalWidth*scale,h=boss.naturalHeight*scale;
 return {x:100*(r.left+(r.width-w)/2+w*form().core.x-s.left)/s.width,y:100*(r.top+(r.height-h)/2+h*form().core.y-s.top)/s.height};
}
function draw(){
 stage.dataset.level=String(level);stage.dataset.phase=String(phaseIndex+1);stage.classList.toggle('defeated',hp===0);$('enemy-type').value=String(level);
 for(const b of document.querySelectorAll('[data-attack]'))b.disabled=!loaded||busy||isPaused()||!hp;
 $('next-state').disabled=!loaded;$('next-level').disabled=!loaded||busy||hp>0||level>=levels.length;
 $('enemy-type').disabled=!loaded||busy;enemy.disabled=busy||paused||!hp;
}
function animate(element,frames,milliseconds,easing='ease-out'){
 const duration=matchMedia('(prefers-reduced-motion:reduce)').matches?0:milliseconds*Number($('speed').value)/1000;
 const animation=element.animate(frames,{duration,easing,fill:'forwards'});running.add(animation);if(isPaused())animation.pause();
 return animation.finished.catch(error=>{if(error.name!=='AbortError')throw error;}).finally(()=>running.delete(animation));
}
const frame=TheaterFrame.create(stage,animate);
function pause(value){
 paused=!!value;soundBank?.setPaused(paused);stage.classList.toggle('paused',paused);
 for(const animation of running)paused?animation.pause():animation.play();
 $('water').textContent=paused?'播放動態':'暫停動態';$('water').setAttribute('aria-pressed',String(paused));draw();
}
function resetScene(){
 generation++;for(const animation of running)animation.cancel();running.clear();effects.replaceChildren();
 delete stage.dataset.attack;delete stage.dataset.attackPhase;
 for(const element of [enemy,boss,enemies,stage.querySelector('.background')])for(const animation of element.getAnimations())animation.cancel();
 soundBank?.stop();pause(false);phaseIndex=0;hp=config().health;
 fleetHp=(config().ships||[]).map(ship=>ship.health);fleet.replaceChildren();
 for(const [i,ship] of (config().ships||[]).entries()){
  const element=document.createElement('span');element.className='fleet-ship';element.dataset.ship=String(i);
  Object.assign(element.style,{left:ship.x+'%',top:ship.y+'%',width:ship.width+'%'});
  const hearts=document.createElement('span');hearts.className='hp';element.append(hearts);
  const image=new Image();image.src=config().src;image.alt=config().name+' '+(i+1)+' · 正常';element.dataset.damageState='normal';element.append(image);fleet.append(element);
  TheaterFrame.renderHealth(hearts,fleetHp[i]);
 }
busy=false;applyForm();enemy.style.opacity='';
 TheaterFrame.renderHealth($('health'),fleetHp.length?0:hp);$('status').textContent='Boss '+level+' · '+config().name;draw();
}
async function enter(skipWarning=false,background){
 entryBackground=background||config().background||SPACE_THEATER.background;resetScene();busy=true;draw();const token=generation;
 const image=stage.querySelector('.background');
 await Promise.all([image.decode(),boss.decode()]);if(token!==generation)return;
 if(!skipWarning)await TheaterFrame.warning(stage);if(token!==generation)return;
 await frame.curtains(true);if(token!==generation)return;
 enemies.hidden=false;await frame.curtains(false);if(token!==generation)return;
 busy=false;draw();
}
async function choose(next,skipWarning=false,background){
 if(!Number.isInteger(next)||!levels[next-1])throw Error('Space 尚未建立此關卡');
 level=next;await enter(skipWarning,background);
}
async function reset(){pause(false);entryBackground=config().background||SPACE_THEATER.background;resetScene();enemies.hidden=true;await frame.curtains(true);}
async function advancePhase(token){
 if(config().damageStates){
  await animate(boss,[{transform:'rotateY(0deg)'},{transform:'rotateY(90deg)'}],160,'linear');if(token!==generation)return;
  phaseIndex++;applyForm();
  try{await boss.decode();}catch(error){if(token!==generation)return;throw error;}
  if(token!==generation)return;
  TheaterFrame.renderHealth($('health'),hp);draw();
  await animate(boss,[{transform:'rotateY(-90deg)'},{transform:'rotateY(0deg)'}],160,'linear');return;
 }
 await animate(boss,[{opacity:1},{opacity:0}],250);if(token!==generation)return;
 phaseIndex++;applyForm();
 try{await Promise.all([boss.decode(),stage.querySelector('.background').decode()]);}
 catch(error){if(token!==generation)return;throw error;}
 if(token!==generation)return;
 TheaterFrame.renderHealth($('health'),hp);draw();
 await Promise.all([animate(boss,[{opacity:0,filter:'brightness(2)'},{opacity:1,filter:'brightness(1)'}],800),animate(stage.querySelector('.background'),[{opacity:.25},{opacity:1}],800)]);
}
async function defeat(token){
 sound('explosion');
 // Grandma remains upright while fading; the other objects recoil and fade.
 const frames=level===8?[{opacity:1},{opacity:0}]:[{opacity:1,translate:'0 0'},{opacity:0,translate:'2% 15%'}];
 await animate(enemy,frames,650);if(token===generation)enemies.hidden=true;
}
function attackSprite(kind,x,y,width){
 const image=new Image();image.src=SPACE_THEATER.attacks[kind].src;image.alt='';image.className='space-attack-sprite';image.dataset.sprite=kind;
 Object.assign(image.style,{left:x+'%',top:y+'%',width:width+'%'});effects.append(image);return image;
}
function laser(from,to,large=false){
 const r=stage.getBoundingClientRect(),dx=(to.x-from.x)*r.width/100,dy=(to.y-from.y)*r.height/100,beam=document.createElement('div');
 beam.className='space-laser'+(large?' cannon-beam':'');Object.assign(beam.style,{left:from.x+'%',top:from.y+'%',width:Math.hypot(dx,dy)+'px',rotate:Math.atan2(dy,dx)+'rad'});effects.append(beam);return beam;
}
async function playAttack(kind,targets,token){
 const p=targets[0];stage.dataset.attack=kind;stage.dataset.attackPhase='launch';$('status').textContent=SPACE_THEATER.attacks[kind].name;
 let finish=()=>Promise.resolve();
 if(kind==='lv2'){
  // Let the complete cookie float into view before starting its spinning flight.
  const cookie=attackSprite(kind,50,135,18);cookie.classList.add('space-cookie-projectile');stage.dataset.attackPhase='float';
  await animate(cookie,[{top:'135%',opacity:0,rotate:'0deg',scale:1},{top:'70%',opacity:1,rotate:'0deg',scale:1}],1100);
  if(token!==generation)return false;stage.dataset.attackPhase='flight';
  await animate(cookie,[
   {left:'50%',top:'70%',scale:1,rotate:'0deg'},
   {left:((50+p.x)/2)+'%',top:(Math.min(70,p.y)-15)+'%',scale:.75,rotate:'315deg',offset:.55},
   {left:p.x+'%',top:p.y+'%',scale:.35,rotate:'720deg'}
  ],850,'ease-in');
  if(token!==generation)return false;cookie.remove();stage.dataset.attackPhase='explosion';sound('explosion');
  for(let i=0;i<2;i++){
   const puff=new Image();puff.src=SPACE_THEATER.effects.explosion;puff.alt='';puff.className='space-attack-sprite';puff.dataset.effect='explosion';
   Object.assign(puff.style,{left:p.x+'%',top:p.y+'%',width:'25.6%'});effects.append(puff);
   await animate(puff,[{scale:.2,opacity:0,translate:'0 0',offset:0},{scale:.95,opacity:1,offset:.15},{scale:1.15,opacity:.9,offset:.5},{scale:1.4,opacity:0,translate:'0 -12px',offset:1}],650,'linear');
   if(token!==generation)return false;puff.remove();
  }
 }else if(kind==='lv1'){
  // Steampunk machine-gun cadence, using code-drawn tracer beams only.
  stage.dataset.attackPhase='fire';
  for(let i=0;i<6;i++){
   sound('space-beam');const beam=laser({x:i%2?58:42,y:110},targets[i%targets.length]);beam.dataset.shot=String(i+1);
   await animate(beam,[{opacity:0,scale:'0 1'},{opacity:1,scale:'1 1',offset:.1},{opacity:0,scale:'1 1'}],95,'linear');
   if(token!==generation)return false;beam.remove();
  }
 }else if(kind==='lv3'){
  // Pirate Lv3 timing: three copies of the same alien, staggered by 95 ms.
  stage.dataset.attackPhase='volley';
  await Promise.all(Array.from({length:3},async(_,i)=>{
   const target=targets[i%targets.length],spread=i-1,startX=50+spread*20,hitX=target.x+(targets.length===1?spread*5:0),spin=(i%2?-1:1)*720;
   const bandit=attackSprite(kind,startX,140,23);bandit.classList.add('space-bandit-projectile');bandit.dataset.throw=String(i+1);
   if(i)await animate(bandit,[{opacity:0},{opacity:0}],i*95,'linear');
   if(token!==generation)return;
   await animate(bandit,[
    {left:startX+'%',top:'140%',scale:1,rotate:'0deg',opacity:1,offset:0},
    {left:startX+'%',top:'60%',scale:1,rotate:'0deg',offset:.24,easing:'ease-in'},
    {left:startX+'%',top:'60%',scale:1,rotate:'0deg',offset:.27},
    {left:((startX+hitX)/2)+'%',top:(Math.min(60,target.y)-21)+'%',scale:.56,rotate:(spin*.45)+'deg',offset:.70},
    {left:hitX+'%',top:target.y+'%',scale:.18,rotate:spin+'deg',offset:1}
   ],720,'linear');
   if(token!==generation)return;bandit.remove();sound('explosion');
   const burst=document.createElement('div');burst.className='space-bandit-hit';burst.dataset.effect='bandit-hit';Object.assign(burst.style,{left:hitX+'%',top:target.y+'%'});effects.append(burst);
   const puff=new Image();puff.src=SPACE_THEATER.effects.explosion;puff.className='space-attack-sprite';puff.alt='';Object.assign(puff.style,{left:hitX+'%',top:target.y+'%',width:'25.6%'});effects.append(puff);
   await Promise.all([
    animate(burst,[{opacity:1,scale:.2},{opacity:1,scale:i===2?1.4:1,offset:.25},{opacity:0,scale:1.6}],300),
    animate(enemies,[{translate:'0 0'},{translate:(i%2?-1:1)*(i===2?10:6)+'px -4px',offset:.3},{translate:'0 0'}],180),
    animate(puff,[{opacity:0,scale:.2},{opacity:1,scale:.95,offset:.15},{opacity:0,scale:1.4}],650,'linear')
   ]);
   if(token!==generation)return;burst.remove();puff.remove();
  }));
  if(token!==generation)return false;
 }else{
  // One pasta overlay, followed by one rotating black-hole mask.
  const pasta=attackSprite(kind,0,0,100);pasta.classList.add('space-pasta-mask');stage.dataset.attackPhase='pasta';
  await animate(pasta,[{opacity:0},{opacity:1}],700);if(token!==generation)return false;
  await animate(pasta,[{opacity:1},{opacity:1}],250);if(token!==generation)return false;
  const hole=document.createElement('div');hole.className='space-black-hole';hole.style.maskImage=`url("${SPACE_THEATER.blackHoleMask}"),linear-gradient(#000,#000)`;hole.dataset.effect='black-hole';effects.append(hole);
  stage.dataset.attackPhase='spiral';
  await Promise.all([
   animate(hole,[{opacity:0,maskSize:'90% 90%,100% 100%',transform:'translate(-50%,-50%) rotate(0deg)'},{opacity:.8,maskSize:'45% 45%,100% 100%',transform:'translate(-50%,-50%) rotate(-130deg)',offset:.5},{opacity:.8,maskSize:'0% 0%,100% 100%',transform:'translate(-50%,-50%) rotate(-300deg)'}],1600,'ease-in'),
   animate(pasta,[{opacity:1},{opacity:1}],1600)
  ]);if(token!==generation)return false;
  const black=document.createElement('div');black.className='space-blackout';effects.append(black);
  await animate(black,[{opacity:0},{opacity:1}],180);if(token!==generation)return false;
  stage.dataset.attackPhase='blackout';pasta.remove();hole.remove();
  await animate(black,[{opacity:1},{opacity:1}],250);if(token!==generation)return false;
  stage.dataset.attackPhase='blast';sound('explosion');
  const blast=new Image();blast.src=SPACE_THEATER.effects.explosion;blast.className='space-attack-sprite space-super-explosion';blast.alt='';blast.dataset.effect='super-explosion';effects.append(blast);
  const flash=document.createElement('div');flash.className='space-explosion-flash';effects.append(flash);
  await Promise.all([animate(blast,[{opacity:0,scale:.1},{opacity:1,scale:.9,offset:.16},{opacity:1,scale:1.3,offset:.5},{opacity:0,scale:1.8}],900),animate(flash,[{opacity:0},{opacity:1,offset:.2},{opacity:0}],200)]);
  if(token!==generation)return false;blast.remove();flash.remove();await animate(black,[{opacity:1},{opacity:0}],250);if(token!==generation)return false;black.remove();

 }
 if(token!==generation)return false;stage.dataset.attackPhase='impact';if(kind==='lv1')sound('metal');
 const crumbs=[];
 if(kind==='lv2')for(let i=0;i<6;i++){
  const crumb=document.createElement('div');crumb.className='space-cookie-crumb';Object.assign(crumb.style,{left:p.x+'%',top:p.y+'%'});effects.append(crumb);
  const angle=i*Math.PI/3,distance=stage.clientWidth*.055;
  crumbs.push(animate(crumb,[{opacity:1,translate:'0 0',rotate:'0deg'},{opacity:0,translate:Math.cos(angle)*distance+'px '+Math.sin(angle)*distance+'px',rotate:(i%2?120:-120)+'deg'}],300));
 }
 await Promise.all([...crumbs,...targets.map(to=>{
  const impact=document.createElement('div');impact.className='impact';impact.dataset.attack=kind;
  Object.assign(impact.style,{left:to.x+'%',top:to.y+'%'});if(form().core)impact.dataset.target='empty-plate';effects.append(impact);
  return animate(impact,[{opacity:1,scale:.2},{opacity:0,scale:kind==='lv4'?2.4:1.5}],300);
 })]);
 if(token!==generation)return false;await finish();
 return token===generation;
}
async function attackFleet(kind){
 busy=true;draw();const token=generation,previous=[...fleetHp],next=[...fleetHp];let damage=damages[kind];
 for(let i=0;i<next.length&&damage;i++){const hit=Math.min(next[i],damage);next[i]-=hit;damage-=hit;}
 try{
  const targets=config().ships.filter((_,i)=>next[i]!==previous[i]).map(ship=>({x:ship.x,y:ship.y}));
  if(!await playAttack(kind,targets,token))return false;fleetHp=next;hp=fleetHp.reduce((sum,h)=>sum+h,0);
  await Promise.all(fleetHp.map(async(h,i)=>{
   if(h===previous[i])return;
   const ship=fleet.children[i];
   await Promise.all([TheaterFrame.renderHealth(ship.querySelector('.hp'),h,previous[i]),animate(ship,[{filter:'brightness(2)'},{filter:'brightness(1)'}],350)]);
   if(token!==generation)return;
   if(h>0&&config().damageStates){
    const image=ship.querySelector(':scope > img'),damaged=h*2<=config().ships[i].health,asset=config().damageStates[damaged?1:0];
    if(image.getAttribute('src')!==asset.src){
     await animate(image,[{transform:'rotateY(0deg)'},{transform:'rotateY(90deg)'}],160,'linear');if(token!==generation)return;
     image.src=asset.src;image.alt=config().name+' '+(i+1)+' · '+asset.name;ship.dataset.damageState=damaged?'heavily-damaged':'normal';
     try{await image.decode();}catch(error){if(token!==generation)return;throw error;}
     if(token!==generation)return;
     await animate(image,[{transform:'rotateY(-90deg)'},{transform:'rotateY(0deg)'}],160,'linear');if(token!==generation)return;
    }
   }
   if(!h){sound('explosion');await animate(ship,[{opacity:1},{opacity:0,translate:'0 25%'}],650);if(token===generation)ship.hidden=true;}
  }));
  if(token!==generation)return false;
  if(!hp)enemies.hidden=true;
  $('status').textContent=hp?'追擊隊剩餘 '+hp+' / '+config().health+' 顆心':'Boss '+level+' 完成';return true;
 }finally{if(token===generation){effects.replaceChildren();delete stage.dataset.attack;delete stage.dataset.attackPhase;busy=false;draw();}}
}
async function attack(command){
 const kind={ball:'lv1',barrel:'lv2',airdrop:'lv3',kraken:'lv4'}[command]||command;
 if(!damages[kind])throw Error('Unknown Space attack: '+command);
 if(!loaded||busy||isPaused()||hp===0)return false;
 if(fleetHp.length)return attackFleet(kind);
 busy=true;draw();const token=generation,previous=hp;
 try{
  if(!await playAttack(kind,[hitPosition()],token))return false;hp=Math.max(0,hp-damages[kind]);
  await Promise.all([
   TheaterFrame.renderHealth($('health'),hp,previous),
   animate(boss,[{filter:'brightness(2)',translate:'-2% 0'},{filter:'brightness(1)',translate:'0 0'}],250)
  ]);
  if(token!==generation)return false;
  if(hp===0)await defeat(token);
  else while(hp<=phaseFloor()&&phaseIndex<phases().length-1){await advancePhase(token);if(token!==generation)return false;}
  if(token!==generation)return false;
  $('status').textContent=hp?(form().name?form().name+' · ':'')+'剩餘 '+hp+' / '+config().health+' 顆心':'Boss '+level+' 完成';return true;
 }finally{if(token===generation){effects.replaceChildren();delete stage.dataset.attack;delete stage.dataset.attackPhase;busy=false;draw();}}
}
$('enemy-type').replaceChildren(...levels.map(item=>{const option=document.createElement('option');option.value=item.stage;option.textContent='Boss '+item.stage+' · '+item.name;return option;}));
$('enemy-type').onchange=e=>choose(Number(e.target.value));
$('next-state').onclick=()=>enter(true);$('next-level').onclick=()=>choose(level+1);
$('water').onclick=()=>pause(!paused);$('height').oninput=e=>stage.style.aspectRatio=100/Number(e.target.value);
$('daynight').textContent='共用太空背景';$('daynight').disabled=true;
for(const button of document.querySelectorAll('[data-attack]'))button.onclick=()=>attack(button.dataset.attack).catch(error=>{$('status').textContent=error.message;});
resetScene();enemies.hidden=true;
const sources=[...new Set([SPACE_THEATER.background,...Object.values(SPACE_THEATER.attacks).map(a=>a.src).filter(Boolean),...Object.values(SPACE_THEATER.effects||{}),...levels.map(b=>b.background),...levels.flatMap(b=>[b.src,...(b.phases||b.damageStates||[]).flatMap(p=>[p.src,p.background].filter(Boolean))]),'img/theater-curtain-right.png','img/health-heart.svg'])];
const ready=Promise.all(sources.map(src=>{const image=new Image();image.src=src;return image.decode();})).then(async()=>{
 loaded=true;if(!embedded)await enter(params.has('skip-warning'));draw();
});
window.SpaceTheater={attack,choose,reset,pause,state,get ready(){return loaded;}};
window.viewReady=ready;
window.viewAPI={play:()=>choose(level,true),suspend:()=>pause(true),resume:()=>pause(false)};
TheaterFrame.connect({stage,ready,reset,
 async enemy(data){
  await choose(data.mode==='boss'?Number(data.stage):data.mode==='free'?1+Math.floor(Math.random()*levels.length):level,data.skipWarning,data.background);
  if(data.defeatOnly){phaseIndex=phases().length-1;hp=0;applyForm();await Promise.all([boss.decode(),stage.querySelector('.background').decode()]);draw();busy=true;await defeat(generation);busy=false;draw();}
  if(data.attackDefeat)while(hp>0)await attack(data.attackDefeat);
 },
 attack,state,
 bounds(){
  const s=stage.getBoundingClientRect(),r=(fleetHp.length?fleet.querySelector('.fleet-ship:not([hidden]) .hp')||$('health'):$('health')).getBoundingClientRect();
  return r.width&&r.height?{hearts:{x:(r.left-s.left)/s.width,y:(r.top-s.top)/s.height,w:r.width/s.width,h:r.height/s.height}}:{};
 }
});
addEventListener('pagehide',()=>{generation++;soundBank?.stop();for(const animation of running)animation.cancel();running.clear();});
})();
