/* Steampunk theme: race opponents and four attack animations. */
(()=>{'use strict';
TheaterFrame.mountControls({title:'蒸氣龐克紙雕劇場',attacks:{lv1:'機槍',lv2:'砲擊',lv3:'特斯拉空雷',lv4:'神之罰'}});
const $=id=>document.getElementById(id),stage=$('stage'),effects=$('effects');
const embedded=new URLSearchParams(location.search).has('embed');
document.documentElement.classList.toggle('embed',embedded);
document.documentElement.classList.toggle('story-defeat',new URLSearchParams(location.search).has('story-defeat'));
const frame=TheaterFrame.create(stage,animate);
const soundBank=embedded?null:new PinballSound(Object.fromEntries(Object.entries({...PirateMap.sounds,...SteampunkSounds}).map(([name,clip])=>[name,{...clip,src:new URL('../'+clip.src,document.baseURI).href}])));
if(soundBank)for(const event of ['pointerdown','keydown'])addEventListener(event,()=>soundBank.unlock(),{capture:true});
function sound(name){if(embedded)parent.postMessage({channel:'pinball-theater',type:'sound',name},'*');else soundBank.play(name);}
const pose=scale=>`translate(-50%,-50%) scale(${scale})`;
const attacks={lv1:{name:'機槍',damage:1},lv2:{name:'砲擊',damage:2},lv3:{name:'特斯拉空雷',damage:3},lv4:{name:'神之罰',damage:4}};
const art={gun:'steampunk-attack-machine-gun',beam:'steampunk-attack-beam',electric:'steampunk-attack-electric-sphere',mine:'steampunk-tesla-mine',explosion:'steampunk-attack-explosion'};
const backgrounds=['day','night','mine','space','ruins'],backgroundLabels=['白天','夜晚','礦山','太空','遺跡'];
let backgroundIndex=0;
function setBackground(index){backgroundIndex=index;const name=backgrounds[index];stage.dataset.background=name;stage.querySelector('.background').src='img/steampunk-theater-background-'+name+'.png';$('daynight').textContent='換成'+backgroundLabels[(index+1)%backgrounds.length];}
const levels=[
 {name:'競速對手',width:24,ships:[1,2,3].map(i=>'steampunk-race-rival-'+i+'.png'),positions:[{x:25,y:45},{x:75,y:45},{x:50,y:74}]},
 {name:'追擊小艇編隊',width:20,ships:Array(4).fill('steampunk-enemy-airship.png'),positions:[{x:22,y:42},{x:78,y:42},{x:37,y:78},{x:63,y:78}]},
 {name:'大型飛空戰艦',background:1,width:52,health:[5],damageStates:['steampunk-enemy-battleship.png','steampunk-enemy-battleship-damaged.png','steampunk-enemy-battleship-heavy-damaged.png'],ships:['steampunk-enemy-battleship.png'],positions:[{x:50,y:55}]},
 {name:'浮空水晶守衛',background:0,width:20,health:[6],damageStates:['steampunk-enemy-crystal.png','steampunk-enemy-crystal-damaged.png','steampunk-enemy-crystal-heavy-damaged.png'],ships:['steampunk-enemy-crystal.png'],positions:[{x:50,y:55}]},
 {name:'三艘戰艦艦隊',background:1,width:29,health:[3,2,2],damageByHp:{0:2,1:2,2:1},damageStates:['steampunk-enemy-battleship.png','steampunk-enemy-battleship-damaged.png','steampunk-enemy-battleship-heavy-damaged.png'],ships:Array(3).fill('steampunk-enemy-battleship.png'),positions:[{x:50,y:69},{x:23,y:35},{x:77,y:35}]},
 {name:'天空龍',background:2,width:40,visualTop:'calc(50% + 10.667cqw)',health:[8],damageStates:['steampunk-enemy-dragon.png','steampunk-enemy-dragon-damaged.png','steampunk-enemy-dragon-heavy-damaged.png'],ships:['steampunk-enemy-dragon.png'],positions:[{x:50,y:55}]},
 {name:'空母混合艦隊',background:0,width:24,widths:[36,24,24,12,12,12],health:[2,2,2,1,1,1],targetOrder:[3,4,5,1,2,0],damageByHp:{0:2,1:2},damageStatesByShip:[['steampunk-enemy-carrier.png','steampunk-enemy-carrier-damaged.png','steampunk-enemy-carrier-heavy-damaged.png'],['steampunk-enemy-battleship.png','steampunk-enemy-battleship-damaged.png','steampunk-enemy-battleship-heavy-damaged.png'],['steampunk-enemy-battleship.png','steampunk-enemy-battleship-damaged.png','steampunk-enemy-battleship-heavy-damaged.png'],null,null,null],ships:['steampunk-enemy-carrier.png','steampunk-enemy-battleship.png','steampunk-enemy-battleship.png','steampunk-enemy-airship.png','steampunk-enemy-airship.png','steampunk-enemy-airship.png'],positions:[{x:28,y:43},{x:74,y:25},{x:74,y:57},{x:24,y:83},{x:47,y:83},{x:72,y:85}]},
 {name:'神之罰',background:3,width:100/3,widths:[100/3,15,15],health:[6,2,2],damageStatesByShip:[['steampunk-enemy-god-punishment.png','steampunk-enemy-god-punishment-damaged.png','steampunk-enemy-god-punishment-heavy-damaged.png'],['steampunk-enemy-crystal.png','steampunk-enemy-crystal-heavy-damaged.png','steampunk-enemy-crystal-heavy-damaged.png'],['steampunk-enemy-crystal.png','steampunk-enemy-crystal-heavy-damaged.png','steampunk-enemy-crystal-heavy-damaged.png']],ships:['steampunk-enemy-god-punishment.png','steampunk-enemy-crystal.png','steampunk-enemy-crystal.png'],positions:[{x:50,y:50},{x:17,y:57},{x:83,y:57}]}
];
const requestedStage=Number(new URLSearchParams(location.search).get('stage'));
let level=Number.isInteger(requestedStage)&&levels[requestedStage-1]?requestedStage:1;
let positions=levels[level-1].positions,hp=[],target=0,busy=false,paused=false,loaded=false,generation=0;
const running=new Set();
const total=()=>hp.reduce((a,b)=>a+b,0);
function targetOrder(){if(level===8)return hp[1]||hp[2]?[1,2].filter(i=>hp[i]>0).sort((a,b)=>hp[a]-hp[b]):hp[0]>0?[0]:[];const fixed=levels[level-1].targetOrder;return fixed?fixed.filter(i=>hp[i]>0):[target,...hp.map((_,i)=>i).filter(i=>i!==target)].filter(i=>hp[i]>0).sort((a,b)=>hp[a]-hp[b]);}
function controls(){document.querySelectorAll('[data-attack]').forEach(b=>b.disabled=!loaded||busy||paused||!total());$('next-state').disabled=!loaded;$('water').disabled=!loaded;$('daynight').disabled=!loaded||busy||paused;$('enemy-type').disabled=!loaded||busy;$('next-level').disabled=!loaded||busy||total()>0||level>=levels.length;}
function state(){return {hp:[...hp],target,busy,paused,defeated:total()===0,maxHp:(levels[level-1].health||levels[level-1].ships.map(()=>1)).reduce((a,b)=>a+b,0),level,phase:level===8?stage.dataset.phase:undefined,background:backgrounds[backgroundIndex]};}
function draw(){document.querySelectorAll('.racer').forEach((e,i)=>{e.classList.toggle('target',i===target&&hp[i]>0);e.querySelector('.hp').hidden=!hp[i];e.disabled=busy||paused||hp[i]===0||(level===8&&i===0&&stage.dataset.phase!=='body');e.setAttribute('aria-label',`對手 ${i+1}，${hp[i]} HP`);});stage.classList.toggle('defeated',total()===0);controls();}
function createEnemy(i){const config=levels[level-1],position=positions[i];const b=document.createElement('button');b.className='racer';b.style.width=(config.widths?.[i]??config.width)+'%';b.style.left=position.x+'%';b.style.top=config.visualTop??(position.y+'%');b.style.animationDelay=(-i)+ 's';b.innerHTML=`<span class="hp"></span><img src="img/${config.ships[i]}" alt="${config.name} ${i+1}">`;TheaterFrame.renderHealth(b.querySelector('.hp'),hp[i]);b.onclick=()=>{if(!busy&&!paused&&hp[i]&&targetOrder().includes(i)){target=i;draw();}};return b;}
function reset(){soundBank?.setPaused(false);soundBank?.stop();generation++;for(const a of running)a.cancel();running.clear();effects.replaceChildren();delete stage.dataset.launching;stage.dataset.phase=level===8?'guards':'';const config=levels[level-1];positions=config.positions;hp=[...(config.health||config.ships.map(()=>1))];stage.dataset.level=String(level);$('enemy-type').value=String(level);target=hp.indexOf(Math.min(...hp));busy=false;paused=false;stage.classList.remove('paused');$('water').textContent='暫停動態';$('racers').replaceChildren();positions.forEach((_,i)=>$('racers').append(createEnemy(i)));$('status').textContent=`Boss ${level} · ${config.name}`;draw();}
function animate(el,frames,duration){const a=el.animate(frames,{duration:duration*Number($('speed').value)/1000,fill:'forwards',easing:'ease-out'});running.add(a);if(paused)a.pause();return a.finished.finally(()=>running.delete(a));}
function fx(kind,x,y,w,h){const e=document.createElement('img');e.className='fx';e.src='img/'+art[kind]+'.png';Object.assign(e.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});effects.append(e);return e;}
async function explode(p,size=26){const e=fx('explosion',p.x,p.y,size,60);await animate(e,[{opacity:0,transform:pose(.2)},{opacity:1,transform:pose(1),offset:.25},{opacity:0,transform:pose(1.3)}],420);e.remove();}
function updateDamage(i){
 const config=levels[level-1],states=config.damageStatesByShip?.[i]||config.damageStates;if(!states)return;
 const damage=config.damageByHp?(hp[i]>=config.health[i]?0:config.damageByHp[hp[i]]):(hp[i]*100<=config.health[i]*34?2:hp[i]*100<=config.health[i]*67?1:0);
 const racer=$('racers').children[i];racer.dataset.damage=['normal','damaged','heavy-damaged'][damage];
 racer.querySelector(':scope > img').src='img/'+states[damage];
}
async function exitEnemy(i){
 const racer=$('racers').children[i];
 if(level===8&&i===0){sound('explosion');await animate(racer,[{opacity:1,transform:pose(1)},{opacity:1,filter:'brightness(3)',transform:pose(.35),offset:.7},{opacity:0,transform:pose(.05)}],700);await explode(positions[i],60);}else if(level===6){sound('explosion');await explode(positions[i],36);await animate(racer,[{opacity:1},{opacity:0,translate:'0 180%',rotate:'18deg'}],700);}else if(level===4||level===8){sound('explosion');await Promise.all([explode(positions[i],42),animate(racer,[{opacity:1,filter:'brightness(2)'},{opacity:0,transform:pose(1.15)}],500)]);}else await animate(racer,[{opacity:1},{opacity:0,translate:'10% 180%',rotate:'22deg'}],700);racer.hidden=true;
}
async function hit(victims,concealed=false){
 const targets=[...new Set(victims)],previous=[...hp];
 for(const i of victims)hp[i]=Math.max(0,hp[i]-1);
 for(const i of targets)updateDamage(i);
 if(concealed){for(const i of targets){const racer=$('racers').children[i];TheaterFrame.renderHealth(racer.querySelector('.hp'),hp[i]);}return;}
 await Promise.all(targets.map(async i=>{
  const racer=$('racers').children[i];
  await Promise.all([TheaterFrame.renderHealth(racer.querySelector('.hp'),hp[i],previous[i]),animate(racer,[{filter:'brightness(2)',translate:'-5px 0'},{filter:'brightness(1)',translate:'0 0'}],220)]);
  if(hp[i]===0)await exitEnemy(i);
 }));
}
async function attack(kind){if(!loaded||busy||paused||!total())return false;if(!attacks[kind])throw Error('Unknown attack: '+kind);busy=true;const token=generation,order=targetOrder(),index=order[0],p=positions[index],victims=(level===8&&stage.dataset.phase==='guards'?[...order,0]:order).flatMap(i=>Array(hp[i]).fill(i)).slice(0,attacks[kind].damage);target=index;draw();$('status').textContent=attacks[kind].name+' → 對手 '+(index+1);
try{
 if(kind==='lv1'){
  const gun=fx('gun',50,65,95,110);
  sound('machine-gun');
  await animate(gun,[{opacity:0},{opacity:1}],30);
  await Promise.all([hit(victims),explode(p), (async()=>{
   for(let i=0;i<6;i++){await animate(gun,[{opacity:1},{opacity:0}],95);}
   gun.remove();
  })()]);
 }
 if(kind==='lv2'){
  sound('explosion');
  const shell=document.createElement('div');shell.className='fx shell';shell.style.left='50%';shell.style.top='96%';effects.append(shell);
  await animate(shell,[{left:'50%',top:'96%',transform:pose(2)},{left:'50%',top:'50%',transform:pose(.6)}],350);shell.remove();
  // The second blast follows the first without waiting for the first wreck to fall.
  sound('explosion');
  await Promise.all([hit([victims[0]]),(async()=>{
   await explode({x:50,y:50},85);sound('explosion');
   await Promise.all([explode({x:50,y:50},85),victims[1]===undefined?Promise.resolve():hit([victims[1]])]);
  })()]);
 }
 if(kind==='lv3'){
  const mine=fx('mine',50,130,28,90);mine.style.height='auto';
  await animate(mine,[
   {left:'50%',top:'130%',transform:pose(1)+' rotate(0deg)'},
   {left:'50%',top:'60%',transform:pose(1)+' rotate(0deg)',offset:.24,easing:'ease-in'},
   {left:'50%',top:'60%',transform:pose(1)+' rotate(0deg)',offset:.27},
   {left:'50%',top:'35%',transform:pose(.56)+' rotate(324deg)',offset:.7},
   {left:'50%',top:'50%',transform:pose(.18)+' rotate(720deg)'}
  ],720);
  mine.remove();
  const sphere=fx('electric',50,50,82,92);sound('electric-charge');
  // As in Pirate's sprites, keep positioning and scaling in one transform.
  // An independent scale also scales the CSS translate and shifts the centre.
  await animate(sphere,[{opacity:0,transform:pose(.05)},{opacity:.32,transform:pose(.35),offset:.35},{opacity:.8,transform:pose(1)}],1500);
  sound('explosion');
  const burst=fx('explosion',50,50,92,100);
  await Promise.all([hit(victims),animate(sphere,[{opacity:.8},{opacity:0}],220),animate(burst,[{opacity:0,transform:pose(.25)},{opacity:1,transform:pose(1),offset:.3},{opacity:0,transform:pose(1.15)}],650)]);
  sphere.remove();burst.remove();
 }
 if(kind==='lv4'){
  const shade=document.createElement('div');shade.className='shade';effects.append(shade);
  await animate(shade,[{opacity:0},{opacity:1}],300);
  sound('judgment');
  const beam=fx('beam',50,50,0,150);
  // Size by height to keep a slender beam; clip the excess above and below.
  beam.style.width='auto';
  await animate(beam,[{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)'}],450);
  const flash=document.createElement('div');flash.className='flash';effects.append(flash);
  await animate(flash,[{opacity:0,clipPath:'inset(0 49.8% 0 49.8%)'},{opacity:.35,clipPath:'inset(0 25% 0 25%)',offset:.45},{opacity:1,clipPath:'inset(0 0% 0 0%)'}],1400);
  await hit(victims,true);
  await animate(flash,[{opacity:1},{opacity:1}],300);
  beam.remove();shade.remove();
  await animate(flash,[{opacity:1},{opacity:0}],800);
  flash.remove();
  await Promise.all([...new Set(victims)].filter(i=>hp[i]===0).map(exitEnemy));
 }
 if(token!==generation)return false;
 if(level===8){await advanceGodPunishment();if(token!==generation)return false;}
 target=targetOrder()[0]??-1;
 $('status').textContent=total()?`剩餘 ${total()} / ${state().maxHp} 顆心`:`Boss ${level} 完成`;return true;
}catch(error){if(token!==generation)return false;throw error;}finally{if(token===generation){effects.replaceChildren();busy=false;draw();}}
}
function pause(value){soundBank?.setPaused(value);paused=value;stage.classList.toggle('paused',value);for(const a of running)value?a.pause():a.play();$('water').textContent=value?'播放動態':'暫停動態';$('water').setAttribute('aria-pressed',String(value));draw();}
document.querySelectorAll('[data-attack]').forEach(b=>b.onclick=()=>attack(b.dataset.attack).catch(e=>{$('status').textContent=e.message;}));$('next-state').onclick=()=>enter();$('water').onclick=()=>pause(!paused);$('height').oninput=e=>stage.style.aspectRatio=100/Number(e.target.value);
$('enemy-type').replaceChildren(...levels.map((config,i)=>{const option=document.createElement('option');option.value=String(i+1);option.textContent=`Boss ${i+1} · ${config.name}`;return option;}));
async function choose(next,skipWarning=false,background){if(!Number.isInteger(next)||!levels[next-1])throw Error('Steampunk 尚未建立此關卡');level=next;setBackground(levels[level-1].background||0);if(background){const image=stage.querySelector('.background');image.src=background;await image.decode();}await enter(skipWarning);}
$('enemy-type').onchange=e=>choose(Number(e.target.value));
$('next-level').onclick=()=>choose(level+1);
async function advanceGodPunishment(){
 if(hp[1]||hp[2]||!hp[0])return;
 const token=generation,image=$('racers').children[0].querySelector(':scope > img');
 const width=44+(6-hp[0])*18;
 const from=image.getBoundingClientRect().width/stage.getBoundingClientRect().width*300;
 await animate(image,[{width:from+'%'},{width:width*3+'%'}],stage.dataset.phase==='guards'?1400:650);
 if(token===generation)stage.dataset.phase='body';
}
async function enterGodPunishment(){
 const body=$('racers').children[0];
 await animate(body,[{opacity:0,transform:pose(.02)},{opacity:1,transform:pose(1)}],1800);
 await Promise.all([1,2].map(async i=>{
  const crystal=$('racers').children[i];crystal.hidden=false;
  await animate(crystal,[{left:'50%',top:'50%',opacity:0,transform:pose(.05)},{left:positions[i].x+'%',top:positions[i].y+'%',opacity:1,transform:pose(1)}],1200);
 }));
}
async function launchAirships(){
 const token=generation;stage.dataset.launching='true';
 try{
  await Promise.all([3,4,5].map(async i=>{
   hp[i]=1;const ship=createEnemy(i);$('racers').children[i].replaceWith(ship);
   const origin={x:positions[0].x+8,y:positions[0].y-4};
   Object.assign(ship.style,{left:origin.x+'%',top:origin.y+'%',opacity:'0',transform:pose(.2)});
   await animate(ship,[{left:origin.x+'%',top:origin.y+'%',opacity:0,transform:pose(.2)},{left:positions[i].x+'%',top:positions[i].y+'%',opacity:1,transform:pose(1)}],900);
  }));
 }finally{if(token===generation)delete stage.dataset.launching;}
}
async function enter(skipWarning=false){
 reset();busy=true;draw();const token=generation;
 if(!skipWarning)await TheaterFrame.warning(stage);
 if(token!==generation)return;
 await frame.curtains(true);$('racers').hidden=false;
 if(level===2||level===6)for(const ship of $('racers').children){ship.style.opacity='0';ship.style.transform=pose(.18);}
 if(level===3||level===5)for(const ship of $('racers').children){ship.style.opacity='0';ship.style.transform=pose(1)+' translateX(80%)';}
 if(level===4)for(const ship of $('racers').children){ship.style.opacity='0';ship.style.transform=pose(.8);}
 if(level===7)for(const ship of [...$('racers').children].filter((_,i)=>level!==7||i<3)){ship.style.opacity='0';ship.style.transform=pose(1)+(level===7?' translateX(-80%)':' translateY(-65%)');}
 if(level===7)for(const i of [3,4,5])$('racers').children[i].hidden=true;
 if(level===6)for(const ship of $('racers').children){ship.style.left='18%';ship.style.top='15%';}
 if(level===8){const body=$('racers').children[0];body.style.opacity='0';body.style.transform=pose(.02);for(const i of [1,2])$('racers').children[i].hidden=true;}
 await frame.curtains(false);
 if(level===8)await enterGodPunishment();
 if(level===7)await Promise.all([...$('racers').children].filter((_,i)=>level!==7||i<3).map(ship=>animate(ship,[{opacity:0,transform:pose(1)+(level===7?' translateX(-80%)':' translateY(-65%)')},{opacity:1,transform:pose(1)}],1400)));
 if(level===4)await Promise.all([...$('racers').children].map(ship=>animate(ship,[{opacity:0,transform:pose(.8)},{opacity:1,transform:pose(1)}],1200)));
 if(level===3||level===5)await Promise.all([...$('racers').children].map(ship=>animate(ship,[{opacity:0,transform:pose(1)+' translateX(80%)'},{opacity:1,transform:pose(1)}],1400)));
 if(level===6)await Promise.all([...$('racers').children].map(ship=>animate(ship,[{left:'18%',top:'15%',opacity:0,transform:pose(.18)},{left:'50%',top:levels[level-1].visualTop,opacity:1,transform:pose(1)}],1400)));
 if(level===2)await Promise.all([...$('racers').children].map(ship=>animate(ship,[{opacity:0,transform:pose(.18)},{opacity:1,transform:pose(1)}],1000)));
 if(level===7&&token===generation)await launchAirships();
 if(token===generation){target=targetOrder()[0]??-1;busy=false;draw();}
}
async function changeBackground(){if(!loaded||busy||paused)return;busy=true;draw();try{await frame.transition(()=>setBackground((backgroundIndex+1)%backgrounds.length));}finally{busy=false;draw();}}
$('daynight').onclick=changeBackground;setBackground(levels[level-1].background||0);
window.SteampunkTheater={attack,reset,pause,state,changeBackground,choose};
reset();
const sources=['img/theater-curtain-right.png','img/health-heart.svg',...Object.values(art).map(n=>'img/'+n+'.png'),...new Set(levels.flatMap(config=>[...config.ships,...(config.damageStates||[]),...(config.damageStatesByShip||[]).flat().filter(Boolean)].map(name=>'img/'+name))),...backgrounds.map(name=>'img/steampunk-theater-background-'+name+'.png'),'img/steampunk-theater-cloud.png'];
const ready=Promise.all(sources.map(src=>{const im=new Image();im.src=src;return im.decode();})).then(async()=>{if(!embedded)await enter();loaded=true;draw();}).catch(()=>{$('status').textContent='素材載入失敗';});
TheaterFrame.connect({stage,ready,
 bounds(){
  const s=stage.getBoundingClientRect(),rs=[...document.querySelectorAll('#racers .hp')].map(el=>el.getBoundingClientRect()).filter(r=>r.width&&r.height);
  if(!rs.length)return {};
  const x=Math.min(...rs.map(r=>r.left)),y=Math.min(...rs.map(r=>r.top));
  return {hearts:{x:(x-s.left)/s.width,y:(y-s.top)/s.height,w:(Math.max(...rs.map(r=>r.right))-x)/s.width,h:(Math.max(...rs.map(r=>r.bottom))-y)/s.height}};
 },
 async reset(){await frame.curtains(true);level=1;reset();$('racers').hidden=true;},
 async enemy(data){
  if(data.attackDefeat){
   level=data.stage;reset();target=-1;busy=true;
   const background=stage.querySelector('.background');if(data.background)background.src=data.background;
   await Promise.all([background.decode(),...[...$('racers').children].map(r=>r.querySelector(':scope > img').decode())]);
   $('racers').hidden=false;draw();
   await animate($('racers'),[{opacity:1},{opacity:1}],1200);
   // Story finale: one electric wave destroys all three ships; gameplay HP is unchanged.
   hp=hp.map(()=>1);busy=false;
   await attack(data.attackDefeat);return;
  }

  if(data.defeatOnly){
   level=data.stage;reset();busy=true;target=-1;
   const background=stage.querySelector('.background');if(data.background)background.src=data.background;
   const victims=level===7?hp.map((_,i)=>i):[0];
   for(const i of victims){hp[i]=0;updateDamage(i);}draw();
   await Promise.all([background.decode(),...victims.map(i=>$('racers').children[i].querySelector(':scope > img').decode())]);
   $('racers').hidden=false;
   await animate($('racers'),[{opacity:1},{opacity:1}],700);
   sound('explosion');
   await Promise.all(victims.map(async i=>{await explode(positions[i],42);await exitEnemy(i);}));
   busy=false;return;
  }
  await choose(data.mode==='boss'?data.stage:data.mode==='free'?1+Math.floor(Math.random()*levels.length):level,data.skipWarning,data.background);
 },
 async attack(command){const kind={ball:'lv1',barrel:'lv2',airdrop:'lv3',kraken:'lv4'}[command]||command;if(attacks[kind])await attack(kind);},
 state
});
})();
