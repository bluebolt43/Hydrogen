const PirateTutorial={
 describe(G,artLayers){
  const objects=[...G.lower,...G.upper_parts,...(G.top_parts||[])],rules=G.mechanisms;
  const bounds=(o,padding=12)=>{if(!o)return null;const points=o.points||[o.center];if(!points[0])return null;const r=o.radius||0,xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return [Math.min(...xs)-padding-r,Math.min(...ys)-padding-r,Math.max(...xs)-Math.min(...xs)+2*(padding+r),Math.max(...ys)-Math.min(...ys)+2*(padding+r)];};
  const artBounds=a=>{const angle=(a.angle||0)*Math.PI/180,w=Math.abs(a.width*Math.cos(angle))+Math.abs(a.height*Math.sin(angle)),h=Math.abs(a.width*Math.sin(angle))+Math.abs(a.height*Math.cos(angle));return [a.x-w/2-5,a.y-h/2-5,w+10,h+10];};
  const regions=ids=>{
   const found=new Set(),result=[];
   for(const id of new Set(ids)){
    const matches=artLayers.filter(a=>!a.hidden&&(a.bind===id||[a.indicator?.trigger,...(a.indicator?.extraTriggers||[])].some(t=>t?.source===id&&['count','count-complete','rollover'].includes(t.kind))));
    if(matches.length){for(const a of matches)if(!found.has(a.id)){found.add(a.id);result.push(artBounds(a));}}
    else {const b=bounds(objects.find(o=>o.id===id));if(b)result.push(b);}
   }return result;
  };
  const groupRules=action=>rules.groups.filter(r=>r.action===({enemy:'boss',vortex:'blackHole'}[action]||action));
  const targets=action=>regions(groupRules(action).flatMap(r=>r.targets));
  const attackIds=level=>[...Object.keys(rules.attacks).filter(id=>rules.attacks[id]===level),...rules.groups.filter(r=>r.action==='attack'&&r.attack===level).flatMap(r=>r.targets),...rules.rolloverGroups.filter(r=>r.attack===level).flatMap(r=>r.members)];
  const rollover=rules.rolloverGroups.filter(r=>r.attack==='lv3'),counts=[...new Set(Object.keys(rules.attacks).filter(id=>rules.attacks[id]==='lv4').map(id=>rules.attackCounts[id]||1))];
  const postCounts=[...new Set(rules.posts.map(p=>p.sensors.length))];
  return {bounds,artBounds,targets,attack:level=>regions(attackIds(level)),
   get barrelText(){return rules.groups.some(r=>r.action==='attack'&&r.attack==='lv2')?PinballI18n.t('tutorial.barrel.group'):PinballI18n.t('tutorial.barrel.hole');},
   get rolloverText(){return PinballI18n.t('tutorial.rollover.text')+(rollover.some(r=>r.laneChange)?PinballI18n.t('tutorial.rollover.switch'):'');},
   get krakenText(){return counts.length===1?PinballI18n.t('tutorial.kraken.count',{count:counts[0]}):PinballI18n.t('tutorial.kraken.text');},
   get postText(){return PinballI18n.t(postCounts.length===1?'tutorial.post.count':'tutorial.post.text',{count:postCounts[0]});},
   posts:()=>regions(rules.posts.flatMap(p=>[p.id,...p.sensors])),
   vortex:()=>regions(groupRules('vortex').map(r=>r.hole))};
 },
 start({game,theater,canvas,G,P,artLayers,view,getView=()=>view,soundBank,controls,clearTouchControls,launch,notice,onFinish,lesson=null}){
 const replay=new URLSearchParams(location.search).get('tutorial')==='1';
 const tutorialMode=replay&&!lesson;
 const $=id=>document.getElementById(id);
 let guide=null;
 if(replay)game.paused=true;
 clearTouchControls();
 const overlay=document.createElement('div');overlay.id='tableTutorial';overlay.style.pointerEvents='none';
 overlay.innerHTML='<canvas id="tutorialSpotlight" aria-hidden="true"></canvas><section id="tutorialPanel"><h2 id="tutorialTitle"></h2><p id="tutorialText"></p><p id="tutorialHint" hidden>點擊進入下一步</p></section>';
 document.body.append(overlay);
 const androidTutorial=window.PinballPlatform==='android';
 const androidText={'tutorial.left.text':'tutorial.android.left.text','tutorial.right.text':'tutorial.android.right.text'};
 const text=value=>typeof value==='function'?value():PinballI18n.t(androidTutorial&&androidText[value]||value);
 let flightTime=0,step=0,waiting=false,pointer=null,heldKey=null,heartOnly=false,narrationReady=replay,demo=null,demoElapsed=0;
 const info=PirateTutorial.describe(G,artLayers),{bounds,artBounds}=info;
 function flipper(side){const f=game.flippers.find(f=>(f.control||f.side)===side&&(f.layer||'lower')==='lower')||game.flippers.filter(f=>(f.control||f.side)===side).sort((a,b)=>b.pivot[1]-a.pivot[1])[0]||game.flippers[side==='left'?0:1];return bounds({points:[f.pivot,P.add(f.pivot,[Math.cos(f.rest)*f.length,Math.sin(f.rest)*f.length])]});}
 const holes=attack=>info.attack({ball:'lv1',barrel:'lv2'}[attack]);
 const steps=[
  ['tutorial.left.title','tutorial.left.text',()=>[flipper('left')]],
  ['tutorial.right.title','tutorial.right.text',()=>[flipper('right')]],
  ['tutorial.launch.title',controls.launchMode==='drag'?'tutorial.launch.drag':'tutorial.launch.hold',()=>{const p=G.plunger,view=getView();return [[p.left-5,p.rest_y-32,p.right-p.left+10,Math.min(view[1]+view[3],p.base_y+15)-(p.rest_y-32)]];}],
  ['tutorial.health.title','tutorial.health.text',()=>[]],
  ['tutorial.ball.title','tutorial.ball.text',()=>holes('ball')],
  ['tutorial.barrel.title',()=>info.barrelText,()=>holes('barrel')],
  ['tutorial.rollover.title',()=>info.rolloverText,()=>info.attack('lv3')],
  ['tutorial.kraken.title',()=>info.krakenText,()=>info.attack('lv4')]
 ];
 if(lesson&&!tutorialMode)steps.splice(4,steps.length-4,...(!replay&&lesson.firstPlaySteps||lesson.steps));
 const targets=info.targets;
 if(tutorialMode)steps.splice(3,5,
  ['tutorial.enemy.title','tutorial.enemy.text',()=>targets('enemy')],
  ['tutorial.ball.title','tutorial.ball.text',()=>holes('ball')],
  ['tutorial.barrel.title',()=>info.barrelText,()=>holes('barrel')],
  ['tutorial.rollover.title',()=>info.rolloverText,()=>info.attack('lv3')],
  ['tutorial.kraken.title',()=>info.krakenText,()=>info.attack('lv4')],
  ['table.vortex','tutorial.vortex.text',()=>demo==='vortex'?info.vortex():targets('vortex')],
  ['tutorial.post.title',()=>info.postText,info.posts]
 );
 function hitTargets(action){for(const rule of G.mechanisms.groups.filter(r=>r.action===({enemy:'boss',vortex:'blackHole'}[action]||action)))for(const id of rule.targets){game.cooldowns.delete(id);game.scoreHit(id,500);}}
 function demoDone(){if(!demo)return;demo=null;guide.demoFrozen=false;game.paused=true;theater.update(0,game);if(step===steps.length-1){finish();return;}step++;render();}
 function playDemo(){
  demo=['enemy','ball','barrel','airdrop','kraken','vortex','post'][step-3];demoElapsed=0;game.hasLaunchedOnce=true;clearTouchControls();guide.demoFrozen=true;game.paused=false;theater.update(0,game);render();
  if(demo==='enemy')hitTargets('enemy');
  else if(['ball','barrel','airdrop','kraken'].includes(demo))game.emit('configured-attack',{kind:{ball:'lv1',barrel:'lv2',airdrop:'lv3',kraken:'lv4'}[demo],id:'demo',position:[...game.ball.p]});
  else if(demo==='vortex'){
   hitTargets('vortex');const id=G.mechanisms.groups.find(r=>r.action==='blackHole')?.hole;const well=[...G.lower,...G.upper_parts,...(G.top_parts||[])].find(o=>o.id===id);if(well){const layer=G.lower.includes(well)?'lower':G.upper_parts.includes(well)?'tavern':'top';game.setBall(well.center,[0,0],layer);}
  }else if(demo==='post'){
   game.ball.state='ready';game.ball.p=[G.plunger.x,G.plunger.rest_y-game.config.ballRadius];for(const post of game.configuredPosts.values())game.raiseCenterPost(post.id);
  }
 }

 function rects(){const view=getView(),r=canvas.getBoundingClientRect(),root=overlay.getBoundingClientRect(),scale=r.width/view[2];
  if(step===3&&!tutorialMode){const t=theater.frame.getBoundingClientRect(),b=theater.tutorialBounds;if(!b)return [];return [b.hearts].filter(Boolean).map(q=>({x:t.left-root.left+q.x*t.width-3,y:t.top-root.top+q.y*t.height-3,w:q.w*t.width+6,h:q.h*t.height+6}));}
  const result=steps[step][2]().filter(Boolean).map(([x,y,w,h])=>({x:r.left-root.left+(x-view[0])*scale,y:r.top-root.top+(y-view[1])*scale,w:w*scale,h:h*scale}));
  let merge=true;while(merge){merge=false;for(let i=0;i<result.length&&!merge;i++)for(let j=i+1;j<result.length;j++){const a=result[i],b=result[j];if(a.x<=b.x+b.w&&a.x+a.w>=b.x&&a.y<=b.y+b.h&&a.y+a.h>=b.y){const x=Math.min(a.x,b.x),y=Math.min(a.y,b.y);result[i]={x,y,w:Math.max(a.x+a.w,b.x+b.w)-x,h:Math.max(a.y+a.h,b.y+b.h)-y};result.splice(j,1);merge=true;break;}}}return result;
 }
 function position(){if(waiting)return;const root=overlay.getBoundingClientRect(),rs=rects(),mask=$('tutorialSpotlight');
  const ratio=window.devicePixelRatio||1;mask.width=Math.max(1,Math.round(root.width*ratio));mask.height=Math.max(1,Math.round(root.height*ratio));
  const context=mask.getContext('2d');context.setTransform(ratio,0,0,ratio,0,0);context.globalAlpha=.6;context.globalCompositeOperation='source-over';context.fillStyle='#000';context.fillRect(0,0,root.width,root.height);context.globalAlpha=1;
  for(const q of rs)context.clearRect(q.x,q.y,q.w,q.h);
  const panel=$('tutorialPanel'),table=canvas.getBoundingClientRect();
  const left=Math.max(0,table.left-root.left),right=Math.min(root.width,table.right-root.left),top=Math.max(0,table.top-root.top),bottom=Math.min(root.height,table.bottom-root.top);
  panel.style.left=(left+right)/2+'px';panel.style.width=Math.max(1,Math.min(310,right-left-24))+'px';
  const h=panel.offsetHeight,minY=rs.length?Math.min(...rs.map(q=>q.y)):0,maxY=rs.length?Math.max(...rs.map(q=>q.y+q.h)):0;
  const preferred=rs.length?(steps[step][3]==='below'?maxY+16:minY-top>=h+24?minY-h-16:maxY+16):(top+bottom-h)/2;
  panel.style.top=Math.max(top+12,Math.min(bottom-h-12,preferred))+'px';
 }
 function render(){overlay.hidden=waiting||tutorialMode&&['enemy','ball','barrel','airdrop','kraken'].includes(demo);overlay.dataset.demo=demo||'';overlay.dataset.step=String(step+1);overlay.dataset.heartOnly=String(heartOnly);$('tutorialTitle').hidden=step>=4;$('tutorialHint').hidden=!!demo||!replay&&step<3;$('tutorialHint').textContent=PinballI18n.t(androidTutorial?'tutorial.android.next':window.matchMedia?.('(pointer: fine)').matches?'tutorial.nextKeyboard':'tutorial.next');$('tutorialTitle').textContent=text(step===3&&heartOnly?'tutorial.health.title':steps[step][0]);$('tutorialText').textContent=text(step===3&&heartOnly?'tutorial.health.text':steps[step][1]);position();}
 function used(control){if(waiting||step>1||control!==['left','right'][step])return;step++;render();}
 function allowed(control){return waiting||step<3&&control===['left','right','launch'][step];}
 function stop(e){e.preventDefault();e.stopImmediatePropagation();}
 function down(e){if(tutorialMode&&demo){stop(e);return;}if(waiting)return;if(replay||step>=3){stop(e);if((step<3||narrationReady)&&pointer===null){pointer={id:e.pointerId,control:'next'};canvas.setPointerCapture(e.pointerId);}return;}const r=overlay.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const inside=x>=0&&x<=r.width&&y>=0&&y<=r.height;const hit=inside&&(step===0?x<r.width/2:step===1?x>=r.width/2:rects().some(q=>x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h));if(pointer!==null||!hit){stop(e);return;}
  stop(e);if(game.paused||game.theaterFrozen||game.enemyIntroPending)return;const control=['left','right','launch'][step];pointer={id:e.pointerId,control};canvas.setPointerCapture(e.pointerId);soundBank.unlock();if(control==='launch'){if(controls.launchMode==='drag'){controls.launchDrag={pointerId:e.pointerId,y:e.clientY};game.launchAiming=true;}else launch(true);}else game.input[control]=true;
 }
 function move(e){if(!pointer||pointer.id!==e.pointerId)return;stop(e);if(controls.launchDrag){game.charge=Math.max(0,Math.min(1,(e.clientY-controls.launchDrag.y)/100));game.chargeElapsed=game.charge;game.ball.p[1]=G.plunger.rest_y-G.ball_radius+G.plunger.stroke*game.charge;}}
 function next(){if(waiting||demo||!(replay||step>=3)||!(step<3||narrationReady))return;if(tutorialMode&&step>=3){playDemo();}else if(step<steps.length-1){step++;if(step===3&&!tutorialMode){heartOnly=true;narrationReady=false;theater.tutorialBounds=null;theater.send({command:'tutorial-bounds'});}render();}else finish();}
 function up(e){if(!pointer||pointer.id!==e.pointerId)return;stop(e);const control=pointer.control;pointer=null;if(control==='next'){if(e.type==='pointerup')next();return;}if(control==='launch'){if(controls.launchDrag){const charge=game.charge;controls.launchDrag=null;game.launchAiming=false;if(e.type==='pointerup')game.launch(charge);}else if(e.type==='pointerup')launch(false);else clearTouchControls();}else{game.input[control]=false;if(e.type==='pointerup')used(control);}}
 // Require a fresh keypress for each tutorial step.
 function keyboard(e){if(waiting)return;const k=e.key.toLowerCase();if(replay||step>=3){stop(e);if(e.type==='keyup'){if(heldKey?.k===k){heldKey=null;next();}}else if(!e.repeat&&!heldKey&&!['shift','control','alt','meta','capslock','numlock','scrolllock'].includes(k)&&!demo&&(step<3||narrationReady))heldKey={k,control:'next'};return;}const control=['arrowleft','z'].includes(k)?'left':['arrowright','c'].includes(k)?'right':[' ','arrowdown'].includes(k)?'launch':null;stop(e);if(!allowed(control)||game.paused||game.theaterFrozen)return;if(e.type==='keydown'){if(e.repeat||heldKey)return;heldKey={k,control};if(control==='launch')launch(true);else game.input[control]=true;}else if(heldKey?.k===k){heldKey=null;if(control==='launch')launch(false);else{game.input[control]=false;used(control);}}}
 const listeners=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['keydown',keyboard],['keyup',keyboard]];for(const [name,fn]of listeners)addEventListener(name,fn,{capture:true});
 const observer=new ResizeObserver(position);observer.observe(canvas);
 guide={refresh:render,allowed,used,demoFrozen:false,onEvent(e){if(tutorialMode){if(demo==='vortex'&&e.type==='release')demoDone();return;}if(e.type==='launch'&&step===2){flightTime=0;waiting=true;render();}else if(waiting&&['ready','ball-save-ready'].includes(e.type)){waiting=false;step=2;render();}else if(waiting&&(e.type==='rollover'||!lesson&&e.type==='sensor')){waiting=false;step=3;heartOnly=true;game.paused=true;clearTouchControls();theater.update(0,game);narrationReady=false;theater.tutorialBounds=null;theater.send({command:'tutorial-bounds'});render();}}};
 if(!tutorialMode){guide.tick=dt=>{if(!waiting||game.paused||game.theaterFrozen||game.enemyIntroPending)return;flightTime+=dt;if(flightTime>=2)guide.onEvent({type:'rollover'});};}
 function finish(){if(!replay){if(window.AppProgress)window.AppProgress.completeTutorial();else localStorage.setItem(lesson?.storageKey||'pinball-pirate-first-play-tutorial-v1','1');}onFinish();theater.onTutorialBounds=null;theater.onCommandComplete=null;observer.disconnect();for(const [name,fn]of listeners)removeEventListener(name,fn,{capture:true});overlay.remove();canvas.tabIndex=0;canvas.focus();clearTouchControls();if(replay){if(window.AppControls?.exitGame)window.AppControls.exitGame();else location.href=new URL('res/main.html',document.baseURI).href;return;}game.paused=false;theater.update(0,game);}
 function theaterBounds(){if(step!==3||waiting)return;narrationReady=true;render();}
 theater.onTutorialBounds=theaterBounds;
 if(tutorialMode){
  theater.onCommandComplete=e=>{if(demo&&e.id?.split(':')[1]===demo){if(e.type==='complete')demoDone();else{game.paused=true;notice(PinballI18n.t('tutorial.demoError'));}}};
  guide.tick=dt=>{if(!demo)return;game.time+=dt;demoElapsed+=dt;if(demo==='vortex'){if(game.ball.state==='playing')game.sensors(dt);else if(game.ball.state==='captured'&&demoElapsed>=1.5)game.release();}else if(demo==='post'&&game.centerPostRaised&&demoElapsed>=2)demoDone();};
 }



 render();
 return guide;
 }
};
