function paintControlFinale(panel,layout,t){
 const tm=layout.timing,get=id=>panel.querySelector(`[data-race-id="${id}"]`);
 const windowAlpha=ease((t-tm.panel)/tm.panelFade);
 get('rectangle-001').style.opacity=windowAlpha;get('image-006').style.opacity=windowAlpha;
 const entry=ease((t-tm.entry)/tm.entryDuration),upper=ease((t-tm.upper)/tm.upperFade);
 for(const id of ['image-003','image-002']){const el=get(id);el.style.transform=`translate(${-35*(1-entry)}%,${55*(1-entry)}%)`;el.style.opacity=(t>=tm.entry?1:0)*(id==='image-002'?1-upper:1);}
 get('image-007').style.opacity=upper;
 panel.querySelector('.control-spell-bubble').style.opacity=ease((t-tm.bubble)/.5);
}
function paintRocketAscent(panel,layout,t){
 const cam=layout.camera,tm=layout.timing,rocket=layout.objects[0];
 if(tm.fadeIn)panel.style.opacity=ease(t/tm.fadeIn);
 const progress=ease((t-tm.launch)/tm.ascentDuration);
 const cameraY=cam.y+(tm.endCameraY-cam.y)*progress;
 panel.querySelector('.race-background').style.top=-cameraY/cam.height*100+'%';
 const lift=ease((t-tm.launch)/3);
 // Initial position is the supplied layout; track the rocket during ascent.
 panel.querySelector('[data-race-id="image-001"]').style.top=((rocket.y-cam.y)/cam.height*100-18*lift)+'%';
 if(tm.flame){
  let flame=panel.querySelector('.rocket-exhaust');
  if(!flame){flame=document.createElement('canvas');flame.className='rocket-exhaust';flame.width=160;flame.height=360;Object.assign(flame.style,{position:'absolute',zIndex:'2',pointerEvents:'none',transform:'translateX(-50%)'});panel.appendChild(flame);}
  const active=t>=tm.launch;
  Object.assign(flame.style,{display:active?'block':'none',left:(rocket.x+rocket.width*.5-cam.x)/cam.width*100+'%',top:((rocket.y-cam.y+rocket.height*.95)/cam.height*100-18*lift)+'%',width:rocket.width*.32/cam.width*100+'%',height:rocket.height*.5/cam.height*100+'%'});
  const ctx=flame.getContext('2d');ctx.clearRect(0,0,160,360);
  const length=290+35*Math.sin(t*43)+20*Math.sin(t*71);
  for(const [color,width,scale] of [['#ff6420',72,1],['#ffc535',49,.8],['#fff8cf',25,.55]]){
   ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(80-width,0);ctx.bezierCurveTo(80-width,100,65,length*.7*scale,80+Math.sin(t*37)*10,length*scale);ctx.bezierCurveTo(96,length*.7*scale,80+width,100,80+width,0);ctx.closePath();ctx.fill();
  }
 }
 if(tm.shake){const strength=t>=tm.launch?1-ease((t-tm.launch-tm.ascentDuration)/1):0;panel.style.transform=`translate(${Math.sin(t*47)*.18*strength}%,${Math.cos(t*61)*.12*strength}%) scale(${1+.006*strength})`;}

}
function paintDragonReward(panel,layout,t){
 const tm=layout.timing,age=t-tm.hit,dragon=panel.querySelector('[data-race-id="image-001"]'),burst=panel.querySelector('.dragon-hit-burst');
 dragon.style.opacity=1-ease((t-tm.dragonFade)/1.5);
 dragon.style.filter=`brightness(${age>=0&&age<.22?2-age/.22:1})`;
 dragon.style.transform=`translateX(${age>=0&&age<.4?Math.sin(age*65)*.7:0}%)`;
 const p=clamp(age/.6);burst.style.opacity=age>=0&&age<.6?Math.sin(p*Math.PI):0;burst.style.transform=`translate(-50%,-50%) scale(${.3+p})`;
 panel.querySelector('.race-window').style.opacity=ease(t-tm.panel);
 panel.querySelector('[data-race-id="image-002"]').style.opacity=ease((t-tm.crystal)/1.5);
}
function paintDragonApproach(panel,layout,t){
 const cam=layout.camera,tm=layout.timing,objects=Object.fromEntries(layout.objects.map(o=>[o.id,o]));
 panel.querySelector('.race-background').style.opacity=ease(t/tm.backgroundFade);
 const a=objects['image-002'],b=objects['image-001'],p=ease((t-tm.approach)/tm.approachDuration),dragon=panel.querySelector('[data-race-id="image-001"]');
 Object.assign(dragon.style,{left:(a.x+(b.x-a.x)*p-cam.x)/cam.width*100+'%',top:(a.y+(b.y-a.y)*p-cam.y)/cam.height*100+'%',width:(a.width+(b.width-a.width)*p)/cam.width*100+'%',height:(a.height+(b.height-a.height)*p)/cam.height*100+'%',opacity:ease((t-tm.dragon)/tm.dragonFade)});
 const age=t-tm.impact,burst=panel.querySelector('[data-race-id="image-003"]');burst.style.zIndex=5;
 burst.style.opacity=age>=0?1:0;
 const strength=age>=0?1-ease(age/tm.shakeDuration):0;
 panel.style.transform=`translate(${Math.sin(age*53)*1.1*strength}%,${Math.cos(age*47)*.8*strength}%)`;
}
function paintLabArrival(panel,layout,t){
 const dialogue=layout.dialogue;
 if(dialogue){
  const index=Math.floor((t-dialogue.start)/dialogue.beat),step=dialogue.steps[index],bubble=panel.querySelector('.lab-speech');
  bubble.style.opacity=step?1:0;
  if(step){
   const inset=layout.objects.find(o=>o.id==='rectangle-001'),cam=layout.camera;
   bubble.dataset.speaker=step.speaker;
   bubble.style.left=step.speaker==='hero'?'18%':'39%';
   bubble.style.top=(inset.y-cam.y+14)/cam.height*100+'%';
   bubble.style.width='24%';bubble.style.height=inset.height*.36/cam.height*100+'%';
  }
  for(const message of bubble.querySelectorAll('.lab-message'))message.style.display=Number(message.dataset.message)===index?'block':'none';
 }

 const cam=layout.camera,timing=layout.timing,progress=ease((t-timing.panStart)/timing.panDuration);
 const x=timing.fromX+(cam.x-timing.fromX)*progress;
 const y=timing.fromY+(cam.y-timing.fromY)*progress;
 if(!timing.fullBackground)Object.assign(panel.querySelector('.race-background').style,{left:-x/cam.width*100+'%',top:-y/cam.height*100+'%'});
 panel.querySelector('.race-window').style.opacity=ease(t-timing.panel);
 const objects=Object.fromEntries(layout.objects.map(o=>[o.id,o])),entry=ease((t-timing.entry)/timing.entryDuration);
 for(const [from,to] of [['image-003','image-002'],['image-004','image-001'],['image-005','image-006']]){
  const a=objects[from],b=objects[to],el=panel.querySelector(`[data-race-id="${to}"]`);
  el.style.left=(a.x+(b.x-a.x)*entry-cam.x)/cam.width*100+'%';
  el.style.top=(b.y-cam.y)/cam.height*100+'%';el.style.opacity=t>=timing.entry?1:0;
 }
}
function paintVonPlan(panel,layout,t){
 const timing=layout.timing,cam=layout.camera,progress=ease((t-timing.entry)/timing.entryDuration);
 panel.querySelector('.race-window').style.opacity=ease(t-timing.panel);
 for(const id of ['image-001','image-002','image-003']){
  const o=layout.objects.find(o=>o.id===id),el=panel.querySelector(`[data-race-id="${id}"]`),start=id==='image-001'?cam.x-o.width:cam.x+cam.width+80;
  el.style.left=(start+(o.x-start)*progress-cam.x)/cam.width*100+'%';el.style.opacity=t>=timing.entry?1:0;
 }
 panel.querySelector('.von-hero-bubble').style.opacity=t>=timing.god&&t<timing.doctor?1:0;
 panel.querySelector('.von-god').style.opacity=t<timing.question?1:0;
 panel.querySelector('.von-cross').style.opacity=t>=timing.cross&&t<timing.question?1:0;
 panel.querySelector('.von-question').style.opacity=t>=timing.question?1:0;
 panel.querySelector('.von-doctor-bubble').style.opacity=ease((t-timing.doctor)/.5);
}
function paintRuinsGate(panel,layout,t){
 const timing=layout.timing;
 const progress=ease(t/timing.cameraDuration),bg=panel.querySelector('.race-background'),camera=layout.camera,source=layout.background;
 // Camera movement finishes independently of the fog fade.
 const x=camera.x*progress,y=camera.y*progress;
 const width=source.width+(camera.width-source.width)*progress;
 const height=source.height+(camera.height-source.height)*progress;
 Object.assign(bg.style,{left:(-x/width*100)+'%',top:(-y/height*100)+'%',width:(source.width/width*100)+'%',height:(source.height/height*100)+'%'});
 panel.querySelector('.ruins-mist').style.opacity=Math.pow(1-clamp(t/timing.mistDuration),3);
 panel.querySelector('.race-window').style.opacity=ease(t-timing.panel);
 const item=id=>panel.querySelector(`[data-race-id="${id}"]`);
 item('image-002').style.opacity=ease(t-timing.characters);
 const transfer=ease((t-timing.heroine)/1.5);
 item('image-003').style.opacity=ease(t-timing.characters)*(1-transfer);
 item('image-004').style.opacity=transfer;
 const gate=item('image-001');
 let right=panel.querySelector('.ruins-gate-right');
 if(!right){right=gate.cloneNode();right.removeAttribute('data-race-id');right.classList.add('ruins-gate-right');gate.after(right);gate.style.clipPath='inset(0 50% 0 0)';right.style.clipPath='inset(0 0 0 50%)';}
 const open=ease((t-timing.open)/2);
 gate.style.opacity=right.style.opacity=ease(t-timing.gate);
 gate.style.transform=`translateX(${-40*open}%)`;right.style.transform=`translateX(${40*open}%)`;
 const age=t-timing.red;
 panel.querySelector('.ruins-red').style.opacity=age>=0&&age<3?.55*Math.pow(Math.sin(age/.6*Math.PI),2):0;
}
function paintGateDialogue(panel,layout,t){
 const timing=layout.timing,age=t-timing.dialogue,beat=Math.floor(age/timing.beat);
 const bubble=panel.querySelector('.gate-dialogue'),girl=panel.querySelector('.gate-girl'),gate=panel.querySelector('.gate-pair');
 bubble.style.opacity=age>=0?1:0;
 girl.style.opacity=beat===0||beat>=2?1:0;
 girl.style.width=beat>=2?'34%':'60%';girl.style.height=beat>=2?'56%':'85%';girl.style.left=beat>=2?'48%':'20%';girl.style.top=beat>=2?'38%':'8%';
 gate.style.opacity=beat>=1?1:0;
 const open=ease((age-3*timing.beat)/timing.openDuration);
 panel.querySelector('.gate-half.gate-left').style.transform=`translateX(${-38*open}%)`;
 panel.querySelector('.gate-half.gate-right').style.transform=`translateX(${38*open}%)`;
}
function paintDeckReunion(panel,layout,t){
 const objects=Object.fromEntries(layout.objects.map(o=>[o.id,o])),cam=layout.camera,timing=layout.timing;
 panel.querySelector('.race-window').style.opacity=ease((t-timing.panel)/timing.panelFade);
 const progress=ease((t-timing.entry)/timing.entryDuration),fade=ease((t-timing.reunion)/timing.reunionFade);
 for(const [from,to] of [['image-002','image-001'],['image-006','image-005'],['image-008','image-004']]){
  const a=objects[from],b=objects[to],el=panel.querySelector(`[data-race-id="${to}"]`);
  el.style.left=(a.x+(b.x-a.x)*progress-cam.x)/cam.width*100+'%';
  el.style.top=(b.y-cam.y)/cam.height*100+'%';
  el.style.opacity=t<timing.entry?0:to==='image-001'?1:1-fade;
 }
 panel.querySelector('[data-race-id="image-007"]').style.opacity=fade;
}
function paintRescueSequence(panel,layout,t){
 const objects=Object.fromEntries(layout.objects.map(o=>[o.id,o])),cam=layout.camera;
 const timing=layout.timing;
 function move(id,from,to,p,mirror){
  const a=objects[from],b=objects[to],el=panel.querySelector(`[data-race-id="${id}"]`);
  el.style.left=(a.x+(b.x-a.x)*p-cam.x)/cam.width*100+'%';
  el.style.top=(b.y-cam.y)/cam.height*100+'%';
  el.style.transform=mirror?'scaleX(-1)':'none';
 }
 move('image-002','image-001','image-002',ease((t-timing.heroEntry)/timing.entryDuration),false);
 move('image-004','image-003','image-004',ease((t-timing.girlEntry)/timing.entryDuration),true);
 const inset=objects['rectangle-001'];
 function bubbleBox(el,x,y,w,h){el.style.left=(x-cam.x)/cam.width*100+'%';el.style.top=(y-cam.y)/cam.height*100+'%';el.style.width=w/cam.width*100+'%';el.style.height=h/cam.height*100+'%';}
 for(const [selector,id] of [['.rescue-exclaim','rectangle-002'],['.rescue-bubble','rectangle-003']]){
  const b=objects[id];bubbleBox(panel.querySelector(selector),b.x,b.y,b.width,b.height);
 }
 const mark=panel.querySelector('.rescue-exclaim');mark.style.opacity=t>=timing.exclaim&&t<timing.exclaimEnd?1:0;
 const bubble=panel.querySelector('.rescue-bubble');bubble.style.opacity=t>=timing.dialogue&&t<timing.bubbleEnd?1:0;
 const girl=panel.querySelector('.rescue-girl'),ship=panel.querySelector('.rescue-ship'),prayer=panel.querySelector('.rescue-prayer'),skull=panel.querySelector('.rescue-skull');
 const together=t>=timing.together&&t<timing.bubbleEnd;
 girl.style.opacity=(t>=timing.dialogue&&t<timing.prayer)||together?1:0;
 girl.style.left='50%';girl.style.top=together?'12%':'50%';girl.style.transform=together?'translateX(-50%)':'translate(-50%,-50%)';
 ship.style.opacity=(t>=timing.ship&&t<timing.together)||together?1:0;
 ship.style.right='15%';ship.style.width='70%';ship.style.top=together?'30%':'20%';
 prayer.style.opacity=t>=timing.prayer&&t<timing.ship?1:0;
 const drift=clamp((t-timing.skull)/timing.skullDuration),pilot=objects['image-004'];
 bubbleBox(skull,pilot.x+pilot.width*.6,pilot.y+pilot.height*.35-drift*inset.height*.3,pilot.width*.18,pilot.height*.3);
 skull.style.opacity=t>=timing.skull?Math.sin(Math.PI*drift):0;

}
// Sequence coordinates are the user's exported background-pixel layout.
function paintRaceSequence(panel,layout,t){
 t+=layout.timeOffset||0;
 const timing=layout.timing||{window:2.4,rivals:3,rivalMove:3,blast:6.1,drop:7,dropDuration:2.5,hero:9.7,heroMove:1.3,heart:11.3};
 const objects=Object.fromEntries(layout.objects.map(o=>[o.id,o])),camera=layout.camera;
 const inset=objects['rectangle-001'],fade=clamp((t-timing.window)/.6);
 const windowEl=panel.querySelector('.race-window');windowEl.style.opacity=fade;
 const hero=panel.querySelector('.race-hero');
 if(hero){const entry=ease((t-timing.hero)/timing.heroMove);hero.style.opacity=t>=timing.hero?1:0;hero.style.transform=`translateX(${-160*(1-entry)}%) scaleX(-1)`;}
 if(layout.victoryRace){
  const exitOpacity=1-ease((t-timing.exitStart)/timing.exitDuration);
  windowEl.style.opacity=fade*exitOpacity;

  if(hero){const p=clamp((t-timing.hero)/timing.heroMove);hero.style.opacity=t>=timing.hero?exitOpacity:0;hero.style.transform=`translateX(${-160+440*p}%) scaleX(-1)`;}
  panel.querySelector('.race-heart').style.opacity=0;
  const on=panel.querySelector('[data-race-on]').src,off=layout.assets.find(a=>a.id==='asset-001').src;
  for(const id of ['image-001','image-005','image-003']){
   const lamp=panel.querySelector(`[data-race-id="${id}"]`);
   lamp.src=t>=2.4?on:off;
   lamp.hidden=t>=timing.rivals;
  }
  for(const [i,id] of ['image-006','image-009','image-011'].entries()){
   const el=panel.querySelector(`[data-race-id="${id}"]`),p=clamp((t-timing.rivals-i*.2)/timing.rivalMove);
   el.style.left=(-35+175*p)+'%';el.style.opacity=t>=timing.rivals+i*.2?exitOpacity:0;
  }
  for(const id of ['image-012','image-013','image-014'])panel.querySelector(`[data-race-id="${id}"]`).style.opacity=0;
  return;
 }
 const engineStart=layout.engine?layout.engine.start:Infinity;
 const heart=panel.querySelector('.race-heart');
 if(heart)heart.style.opacity=t<engineStart?ease((t-timing.heart)/.4):0;
 if(hero&&t>=engineStart)hero.style.opacity=0;
 const engine=panel.querySelector('.race-engine');
 if(engine){
  engine.style.opacity=t>=engineStart?1:0;
  const age=t-layout.engine.overheat,mask=engine.querySelector('.engine-fx-mask');
  mask.style.opacity=age>=0?1:0;
  for(const puff of mask.querySelectorAll('[data-smoke-puff]')){
   const phase=((Math.max(0,age)+Number(puff.dataset.smokePuff)*.55)%1.8)/1.8;
   const scale=.65+phase*.9;
   puff.setAttribute('transform',`translate(${Math.sin(phase*5)*5} ${-phase*33}) translate(50 45) scale(${scale}) translate(-50 -45)`);
   puff.style.opacity=age>=0?(1-phase)*.85*clamp(age*5):0;
  }
  const flicker=Math.max(0,age)% .62;
  mask.querySelector('[data-engine-short]').style.opacity=age>=0&&(flicker<.08||flicker>.15&&flicker<.22||flicker>.35&&flicker<.4)?1:0;
 }
 const on=panel.querySelector('[data-race-on]').src,off=layout.assets.find(a=>a.id==='asset-001').src;
 for(const id of ['image-001','image-005','image-003'])panel.querySelector(`[data-race-id="${id}"]`).src=t>=1.4?on:off;
 for(const [from,to,blast] of [['image-007','image-006','image-012'],['image-008','image-009','image-013'],['image-010','image-011','image-014']]){
  const a=objects[from],b=objects[to],progress=ease((t-timing.rivals)/timing.rivalMove),drop=clamp((t-timing.drop)/timing.dropDuration);
  const x=a.x+(b.x-a.x)*progress+90*drop,y=a.y+(b.y-a.y)*progress+1000*drop*drop;
  const el=panel.querySelector(`[data-race-id="${to}"]`);
  el.style.left=(x-camera.x)/camera.width*100+'%';el.style.top=(y-camera.y)/camera.height*100+'%';
  el.style.transform=`rotate(${25*drop}deg)`;el.style.opacity=t<timing.rivals?0:1-drop;
  // Clip to the white inset in viewport-scaled CSS pixels.
  const scale=panel.clientWidth/camera.width;
  el.style.clipPath=`inset(${Math.max(0,inset.y-y)*scale}px ${Math.max(0,x+b.width-inset.x-inset.width)*scale}px ${Math.max(0,y+b.height-inset.y-inset.height)*scale}px ${Math.max(0,inset.x-x)*scale}px)`;
  const fx=panel.querySelector(`[data-race-id="${blast}"]`),age=t-timing.blast;
  fx.style.opacity=age>=0&&age<.9?Math.sin(age/.9*Math.PI):0;fx.style.transform=`scale(${.5+clamp(age/.6)})`;
 }
}
const phone=document.getElementById('phone'),panels=[...phone.querySelectorAll('.shot')];
const chapterNumber=Number(document.body.dataset.storyChapter),chapterPart=document.body.dataset.storyPart;
const chapterId=`ch${chapterNumber}-${chapterPart}`;
const startButton=document.getElementById('start'),begin=document.getElementById('begin'),skip=document.getElementById('story-skip'),next=document.getElementById('story-next'),error=document.getElementById('error');
const offsets=[];let duration=0;
for(const shot of STORY_SHOTS){offsets.push(duration);duration+=shot.duration;}
let raf=0,startedAt=0,playing=false,nextTimer=0,completed=false,playSerial=0;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=v=>{const t=clamp(v);return t*t*(3-2*t);};
const seenKey='pinball-steampunk-story-seen-v1:'+chapterId;
const hasSeen=()=>window.AppProgress?window.AppProgress.hasSeen(chapterId):localStorage.getItem(seenKey)==='1';
function markSeen(){if(window.AppProgress)window.AppProgress.markSeen(chapterId);else localStorage.setItem(seenKey,'1');}
function paint(index,elapsed){
 const panel=panels[index],shot=STORY_SHOTS[index],t=elapsed/1000,p=clamp(elapsed/shot.duration);
 panel.hidden=false;panel.style.opacity='1';
 if(shot.endingMask){
  const mask=shot.endingMask;
  panel.querySelector('.story-end-vignette').style.opacity=ease(t/mask.vignetteFade);
  panel.querySelector('.story-end-card').style.opacity=ease((t-mask.cardStart)/mask.cardFade);
 }
 if(shot.theater)return;
 if(shot.sequence){(shot.sequence.kind==='control-finale'?paintControlFinale:shot.sequence.kind==='rocket-ascent'?paintRocketAscent:shot.sequence.kind==='reunion'?paintRescueSequence:shot.sequence.kind==='deck-reunion'?paintDeckReunion:shot.sequence.kind==='gate-dialogue'?paintGateDialogue:shot.sequence.kind==='ruins-gate'?paintRuinsGate:shot.sequence.kind==='von-plan'?paintVonPlan:shot.sequence.kind==='lab-arrival'?paintLabArrival:shot.sequence.kind==='dragon-approach'?paintDragonApproach:shot.sequence.kind==='dragon-reward'?paintDragonReward:paintRaceSequence)(panel,shot.sequence,t);return;}
 const bg=panel.querySelector('.background');
 if(shot.effect==='villain-orders'){
  const d=shot.dialogue;
  const cam=d.camera;
  const bubble=panel.querySelector('.villain-dialogue');
  const bx=d.x/100*941,by=d.y/100*1672,bw=d.w/100*941,bh=d.h/100*1672;
  Object.assign(bubble.style,{left:(bx-cam.x)/cam.width*100+'%',top:(by-cam.y)/cam.height*100+'%',width:bw/cam.width*100+'%',height:bh/cam.height*100+'%'});
  for(const [selector,box] of [['.villain-ship',d.shipBox],['.villain-count',d.countBox]])Object.assign(panel.querySelector(selector).style,{left:(box.x-bx)/bw*100+'%',top:(box.y-by)/bh*100+'%',width:box.width/bw*100+'%',height:box.height/bh*100+'%',bottom:'auto',objectFit:'contain'});

  panel.querySelector('.villain-dialogue').style.opacity=t>=d.angerAt?1:0;
  panel.querySelector('.villain-anger').style.opacity=t>=d.angerAt&&t<d.shipAt?1:0;
  panel.querySelector('.villain-ship').style.opacity=t>=d.shipAt?1:0;
  const count=panel.querySelector('.villain-count'),fade=ease((t-d.countAt)/d.countFade);
  count.style.opacity=fade;count.style.transform='none';
  return;
 }
 if(shot.effect==='record-boot'){
  const cfg=shot.recordScreen,cam=cfg.camera,size=cfg.backgroundSize;
  panel.querySelector('.record-blackout').style.opacity=ease((t-cfg.blackStart)/cfg.blackFadeDuration);
  Object.assign(bg.style,{left:(-cam.x/cam.width*100)+'%',top:(-cam.y/cam.height*100)+'%',width:(size.width/cam.width*100)+'%',height:(size.height/cam.height*100)+'%',objectFit:'fill'});
  panel.querySelector('.record-screen').style.opacity=ease((t-cfg.fadeStart)/cfg.fadeDuration);
  const age=t-cfg.bootStart,signal=panel.querySelector('.record-signal');
  const width=ease(age/.35),height=ease((age-.35)/.65);
  signal.style.opacity=age<0?0:age<1?1:1-.88*ease((age-1)/.5);
  signal.style.transform=`translate(-50%,-50%) scale(${Math.max(.003,width)},${.004+.996*height})`;
  const recording=t>=cfg.recordStart,noiseOn=t>=cfg.noiseStart;
  const footage=panel.querySelector('.record-footage'),noise=panel.querySelector('.record-noise'),scratches=panel.querySelector('.record-scratches');
  footage.style.opacity=recording?1:0;
  const current=(cfg.screens||[]).filter(screen=>t>=screen.at).pop();
  if(current&&footage.getAttribute('src')!==current.src)footage.setAttribute('src',current.src);
  if(recording)signal.style.opacity=0;
  noise.style.opacity=noiseOn?(recording?.13:1):0;
  scratches.style.opacity=recording?.22+.12*Math.sin(t*37):0;
  const frame=Math.floor(t*18);
  if(noiseOn&&noise.dataset.frame!==String(frame)){
   noise.dataset.frame=String(frame);const ctx=noise.getContext('2d'),pixels=ctx.createImageData(noise.width,noise.height);let seed=frame+1;
   for(let i=0;i<pixels.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)|0;const v=seed>>>24;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;pixels.data[i+3]=255;}ctx.putImageData(pixels,0,0);
  }
  scratches.style.transform=`translate(${Math.sin(frame*7)*2}%,${Math.cos(frame*3)*1.5}%)`;
  footage.style.transform='none';
  footage.style.filter='sepia(.5) saturate(.55) contrast(1.08)';
  if(t>=cfg.shutdownStart){
   const off=t-cfg.shutdownStart;
   const sy=1-.996*ease(off/.65),sx=1-.997*ease((off-.65)/.35);
   footage.style.transform=`scale(${sx},${sy})`;
   footage.style.opacity=1-ease(off/.3);
   noise.style.opacity=0;scratches.style.opacity=0;
   signal.style.transform=`translate(-50%,-50%) scale(${sx},${sy})`;
   signal.style.opacity=(.25+.75*ease(off/.15))*(1-ease((off-1)/.5));
  }


  return;
 }
 if(shot.effect==='ruins-to-sky'){
  panel.querySelector('[data-fx="sky-background"]').style.opacity=ease((t-shot.transition.skyStart)/shot.transition.skyFadeDuration);
  panel.querySelector('[data-fx="float"]').style.transform=`translate(-50%,-50%) translateY(${-2*Math.sin(t*1.6)}%)`;
  const age=t-shot.transition.redStart;
  panel.querySelector('.effect').style.opacity=age>=0&&age<shot.transition.redDuration?.55*Math.pow(Math.sin(age/shot.transition.redPeriod*Math.PI),2):0;
  return;
 }
 if(shot.effect==='night-warning'){
  const timing=shot.transition;
  const night=panel.querySelector('[data-fx="night-background"]'),ship=panel.querySelector('[data-fx="float"]');
  night.style.opacity=ease((t-timing.night)/timing.nightFadeDuration);
  ship.style.transform=`translate(-50%,-50%) translateY(${-2*Math.sin(t*1.6)}%)`;
  const age=t-timing.redStart;
  panel.querySelector('.effect').style.opacity=age>=0&&age<timing.redDuration?.55*Math.pow(Math.sin(age/timing.redPeriod*Math.PI),2):0;
  return;
 }
 const chasePosition=20+70*ease((t-1.5)/3.5);
 bg.style.objectPosition=shot.effect==='night-chase'?`${chasePosition}% 50%`:'50% 50%';
 bg.style.transform=shot.effect==='crash'?`scale(${1.04+.16*p}) translate(${-2*p}%,${-3*p}%)`:shot.effect==='slowzoom'||shot.effect==='race'?`scale(${1+.08*p})`:'none';
 if(shot.effect==='landing-stop'){
  const pan=shot.cameraPan||{duration:0,fromX:50,fromY:50,toX:50,toY:50};
  const travel=pan.duration?ease(elapsed/pan.duration):1;
  bg.style.objectPosition=`${pan.fromX+(pan.toX-pan.fromX)*travel}% ${pan.fromY+(pan.toY-pan.fromY)*travel}%`;
  const landingTime=Math.max(0,t-pan.duration/1000),shake=1-ease(landingTime/2.8);
  bg.style.transform=`scale(${1.1-.06*ease(landingTime/3)}) translate(${Math.sin(t*39)*.55*shake}%,${Math.cos(t*47)*.4*shake}%)`;
 }
 for(const img of panel.querySelectorAll('[data-fx]')){
  let x=0,y=0,scale=1,angle=0,opacity=1;
  switch(img.dataset.fx){
   case 'theater-wreck':{const hit=clamp((t-1)/.22),fall=clamp((t-1.22)/.7);x=10*fall;y=180*fall;angle=22*fall;opacity=1-fall;img.style.filter=`brightness(${t>=1&&t<1.22?2-hit:1})`;break;}
   case 'theater-blast':{const age=t-1,q=clamp(age/.42);opacity=age>=0&&age<.42?(q<.25?q/.25:1-(q-.25)/.75):0;scale=q<.25?.2+.8*q/.25:1+.3*(q-.25)/.75;break;}
   case 'gunfire':{const phase=(t-5)%1.8;opacity=t<5?0:phase<.09||phase>=.18&&phase<.27||phase>=.36&&phase<.48?1:0;img.style.objectPosition=`${chasePosition}% 50%`;break;}
   case 'chase-ship':x=125-230*p;y=-8*p;break;
   case 'chase-enemy':x=140-270*p;y=-10*p;break;
   case 'impact-burst':scale=.2+1.5*ease(p);opacity=Math.sin(Math.PI*p);angle=-10+20*p;break;
   case 'fright-panel':x=130*(1-ease((t-2.4)/.6));opacity=ease((t-2.4)/.4);scale=1+.025*Math.sin(t*17)*clamp(4-t);break;
   case 'race-flag':y=-35*(1-ease(t/1.4));angle=2*Math.sin(t*2);break;
   case 'float':y=-2*Math.sin(t*1.6);break;
   case 'fall':x=25*p*p;y=170*p*p;angle=24*p;opacity=1-ease((p-.65)/.35);break;
   case 'land':y=-120*(1-ease(t/4));opacity=clamp(t);break;
   case 'rise':y=80*(1-ease(t/3))-20*p;opacity=clamp(t+.3);break;
   case 'approach':scale=.25+.75*ease(t/4);opacity=clamp(t);break;
   case 'burst':scale=.2+.9*ease(t/1.3);opacity=clamp(t*3)*(1-.35*clamp(t-2));break;
   case 'vanish':scale=1-.8*ease(t/3.5);opacity=1-ease(t/3.5);break;
   case 'reward-fade':opacity=ease(t/1.5);break;
   case 'reward':scale=.4+.6*ease(t/2);opacity=clamp(t);break;
   case 'zoom':scale=1+1.8*ease(p);break;
   case 'escape':x=35*p;y=90*p;scale=1+.9*p;break;
   case 'mist-out':opacity=1-ease(t/4);break;
   case 'cloudout':opacity=1-ease(t/4);scale=1+.5*p;break;
   case 'cloudpass':x=-120+260*ease(t/4);break;
   case 'gate-left':x=-35*ease((t-1)/3);break;
   case 'gate-right':x=35*ease((t-1)/3);break;
  }
  img.style.transform=`translate(-50%,-50%) translate(${x}%,${y}%) rotate(${angle}deg) scale(${scale})`;
  if(img.dataset.fx==='chase-enemy')img.style.transform+=' scaleX(-1)';
  img.style.opacity=opacity;
 }
 const fx=panel.querySelector('.effect');fx.style.opacity='1';
 if(shot.effect==='chase')fx.style.opacity=ease((p-.86)/.14);
 if(shot.effect==='crash')fx.style.opacity=ease((p-.88)/.12);
 if(shot.effect==='race')fx.style.opacity=1-ease(t/1.2);
 if(shot.effect==='impact')fx.style.opacity=.8*Math.exp(-t*6);
 if(shot.effect==='alarm')fx.style.opacity=.23*(.5-.5*Math.cos(t*Math.PI*2/1.2));
 if(shot.effect==='speed'){fx.style.opacity='.35';fx.style.backgroundPosition=`0 ${t*160}px`;}
 if(shot.effect==='countdown'){
  const interrupt=shot.countdownInterrupt;
  if(interrupt){
   const age=t-interrupt.at,flashing=age>=0&&(interrupt.continuousFlash||age<interrupt.flashDuration);
   fx.textContent=age>=interrupt.flashDuration?interrupt.symbol:String(Math.max(2,5-Math.floor(t)));
   const alpha=flashing?.65*(.5-.5*Math.cos(age/interrupt.period*Math.PI*2)):0;
   fx.style.background=`rgba(255,0,0,${alpha})`;
  }else{fx.textContent=String(Math.max(shot.countdownMinimum||2,5-Math.floor(t)));fx.style.background=`rgba(0,0,0,${.5*ease((t-3)/1.5)})`;}
 }
 if(shot.effect==='activation'){fx.textContent='バルス';fx.style.opacity=ease((t-1)/1.5);}
}
function render(elapsed){
 const ms=clamp(elapsed,0,duration-.01);let index=offsets.length-1;
 while(index>0&&ms<offsets[index])index--;
 for(const panel of panels)panel.hidden=true;
 const local=ms-offsets[index];
 const transition=STORY_SHOTS[index].transitionDuration??550;
 if(index>0&&local<transition&&!STORY_SHOTS[index].cut){paint(index-1,STORY_SHOTS[index-1].duration);paint(index,local);panels[index].style.opacity=ease(local/transition);}
 else paint(index,local);
 phone.dataset.shot=String(index+1);phone.dataset.phase=STORY_SHOTS[index].title;
}
function completeStory(){
 if(completed)return;completed=true;clearTimeout(nextTimer);next.hidden=true;
 window.dispatchEvent(new CustomEvent('story:complete',{detail:{chapter:chapterId}}));
}
function finishStory(skipped=false){
 stopStorySounds();playing=false;cancelAnimationFrame(raf);skip.hidden=true;render(duration);
 if(!skipped)markSeen();
 if(chapterPart==='end'){next.hidden=false;nextTimer=setTimeout(completeStory,10000);}
 else completeStory();
}
const storyAudio=new Map(),soundEvents=STORY_SHOTS.flatMap((shot,i)=>(shot.sounds||[]).map(cue=>({...cue,at:offsets[i]+cue.at})));
let soundCursor=0;
function stopStorySounds(){for(const audio of storyAudio.values()){audio.pause();audio.currentTime=0;}}
function playStorySounds(ms){
 while(soundCursor<soundEvents.length&&soundEvents[soundCursor].at<=ms){
  const cue=soundEvents[soundCursor++];
  let audio=storyAudio.get(cue.name);
  if(!audio){audio=new Audio(cue.name==='pirate-victory'?'../audio/pirate-victory.ogg':cue.name==='machine-gun'?'../audio/steampunk-machine-gun.wav':'../audio/explosion.ogg?v=trim1');audio.volume=cue.name==='machine-gun'?.55:.65;storyAudio.set(cue.name,audio);}
  audio.currentTime=0;audio.play().catch(()=>{});
 }
}
function tick(now){if(!playing)return;const elapsed=now-startedAt;render(elapsed);playStorySounds(elapsed);if(elapsed>=duration)finishStory();else raf=requestAnimationFrame(tick);}
let theaterCleanup=()=>{};
function replayStoryTheater(config,serial){
 const frame=phone.querySelector('.story-theater');let step=0,delay=0;
 const send=(command,extra={})=>frame.contentWindow.postMessage({channel:'pinball-theater',command,id:'story-replay',...extra},'*');
 const listener=e=>{
  if(e.source!==frame.contentWindow||e.data?.channel!=='pinball-theater'||serial!==playSerial)return;
  const data=e.data;
  if(data.type==='sound'){
   let audio=storyAudio.get(data.name);
   if(!audio){audio=new Audio(data.name==='electric-charge'?'../audio/steampunk-electric-charge.wav':data.name==='machine-gun'?'../audio/steampunk-machine-gun.wav':'../audio/explosion.ogg?v=trim1');audio.volume=.6;storyAudio.set(data.name,audio);}
   audio.currentTime=0;audio.play().catch(()=>{});
  }
  if(data.type==='ready')send('enemy',{mode:'boss',stage:config.stage,skipWarning:true,background:config.background,defeatOnly:config.defeatOnly,attackDefeat:config.attackDefeat});
  if(data.type==='error'){error.textContent=data.message;error.hidden=false;}
  if(data.type==='complete'&&data.id==='story-replay'){
   if(step<config.attacks.length)delay=setTimeout(()=>send(config.attacks[step++]),1200);
   else delay=setTimeout(()=>{
    theaterCleanup();
    if(serial!==playSerial)return;
    if(STORY_SHOTS.length>1){
     startedAt=performance.now()-offsets[1];render(offsets[1]);raf=requestAnimationFrame(tick);
    }else finishStory();
   },1800);
  }
 };
 theaterCleanup=()=>{clearTimeout(delay);removeEventListener('message',listener);};
 addEventListener('message',listener);frame.src=frame.dataset.src;
}
async function play(chapter=chapterId){
 if(chapter!==chapterId)return false;
 theaterCleanup();stopStorySounds();soundCursor=0;
 const serial=++playSerial;playing=false;cancelAnimationFrame(raf);clearTimeout(nextTimer);next.hidden=true;skip.hidden=true;
 try{await Promise.all([...phone.querySelectorAll('img')].map(image=>image.decode()));}
 catch(e){if(serial===playSerial){error.textContent='圖片載入失敗：'+e.message;error.hidden=false;begin.hidden=false;}return false;}
 if(serial!==playSerial)return false;
 error.hidden=true;completed=false;begin.hidden=true;skip.hidden=!hasSeen();playing=true;startedAt=performance.now();render(0);if(STORY_SHOTS[0].theater){replayStoryTheater(STORY_SHOTS[0].theater,serial);return true;}raf=requestAnimationFrame(tick);return true;
}
startButton.onclick=()=>play();
document.getElementById('replay').onclick=()=>play();
skip.onclick=()=>{if(!skip.hidden&&hasSeen()){++playSerial;finishStory(true);}};
next.onclick=()=>completeStory();
window.addEventListener('pagehide',()=>{theaterCleanup();stopStorySounds();++playSerial;playing=false;cancelAnimationFrame(raf);clearTimeout(nextTimer);});
if(new URLSearchParams(location.search).has('embed'))document.getElementById('chapters').hidden=true;
render(0);
