async function startPreview(PIRATE_GEOMETRY,preparedImages){
'use strict';
const tutorialMode=!!TableTutorial&&new URLSearchParams(location.search).get('tutorial')==='1';
const requestedBossStage=Number(new URLSearchParams(location.search).get('bossStage'));
const bossStage=Number.isInteger(requestedBossStage)&&requestedBossStage>=1&&requestedBossStage<=8?requestedBossStage:0;
const G=PIRATE_GEOMETRY,P=PiratePhysics,Game=ConfiguredMechanisms.createGame(LayeredGame.createGame(P),P),game=new (PLAYTEST_THEME==='steampunk'?SteampunkBonus.createGame(Game):G.gameplay?.spaceConstellation?SpaceConstellation.createGame(Game):(G.gameplay?.touhouBagua||G.gameplay?.runicTurntable)?TouhouBagua.createGame(Game):Game)(G),canvas=document.getElementById('table'),ctx=canvas.getContext('2d'),$=id=>document.getElementById(id);
try{localStorage.setItem('pinball-physics-model','legacy');}catch{}
game.config.physicsModel='legacy';
game.storyMode=!!bossStage&&!tutorialMode;
game.spaceEndlessMode=['sci-fi','space','cosmic-dessert'].includes(PLAYTEST_THEME)&&!bossStage&&!tutorialMode&&!new URLSearchParams(location.search).has('editor');
game.disableBossTargetLife=['touhou1','touhou2','norse'].includes(PLAYTEST_THEME);
game.targetRehitRequiresExit=PLAYTEST_THEME==='touhou1';
game.preserveTableOnDrain=!!bossStage;
game.scoringEnabled=!bossStage;
window.layoutGame=game;
const theater=new LayoutTheater(PLAYTEST_THEME);theater.bossStage=bossStage;theater.tutorialPreview=false;window.layoutTheater=theater;
theater.onEnemyReady=data=>{game.freezeRemaining=0;if(data.type==='error')game.enemyActive=false;};
theater.onEnemyDefeated=(data,stageCleared)=>{
 game.enemyActive=false;
 if(stageCleared){game.scoreHit('boss-clear:'+bossStage,data.maxHp*1500,0);game.paused=true;soundBank.stop();window.dispatchEvent(new CustomEvent('pinball:boss-defeated',{detail:{stage:bossStage}}));}
};
let firstPlayGuide=null;
let firstPlayGuidePending=!!TableTutorial&&(tutorialMode||bossStage===1&&new URLSearchParams(location.search).get('firstPlayTutorial')==='1'&&!(window.AppProgress?window.AppProgress.tutorialComplete:localStorage.getItem(`pinball-${PLAYTEST_THEME}-first-play-tutorial-v1`)==='1'));
const touchControls=new Map();let launchMode=localStorage.getItem('pinball-launch-mode')||'hold',launchDrag=null;
const artRenderer=new (PLAYTEST_THEME==='steampunk'?SteampunkArt.Renderer:PinballArt.Renderer)("",IndicatorLights.artMap(PirateMap),preparedImages);let artLayers=[],artWarning='';
artRenderer.rasterCacheEnabled=true;
artRenderer.bitmapCacheEnabled=true;
artRenderer.backgroundCacheEnabled=true;
artRenderer.staticCacheEnabled=true;
artRenderer.reuseCompositionBuffers=true;
artRenderer.planCacheEnabled=true;
artRenderer.missionCacheEnabled=true;
try{artLayers=PinballArt.validate(G.artLayers||[]);
 if(new URLSearchParams(location.search).get('art')==='preview'){
  const preview=JSON.parse(localStorage.getItem('pinball-art-preview-res')||'null');
  if(preview&&JSON.stringify(preview.objects)===JSON.stringify(G.art_layout_objects))artLayers=PinballArt.validate(preview.artLayers);
  else artWarning='美術預覽與試玩布局不同：請匯出 JSON 並重新建置。';
 }
}catch(e){artWarning='美術載入失敗：'+e.message}
// Ignore legacy frame entries in saved drafts; the chrome has one shared owner.
artLayers=artLayers.filter(a=>!PlayFrame.isFrameArt(a));
const [topArt,soundArt,settingsArt,backArt]=PinballArt.validate(PlayFrame.createArt(PLAYTEST_THEME));
const topBallImage=artRenderer.image(G.gameplay?.ballImage||(['touhou1','touhou2','touhou-horrors','touhou-black-knight-2000'].includes(PLAYTEST_THEME)?'res/img/touhou/touhou-ball-yin-yang.png':['sci-fi','space','cosmic-dessert'].includes(PLAYTEST_THEME)?'res/img/space/space-ball-cookie.png':'res/img/top-ball.png'));
const topLayers=[topArt,soundArt,settingsArt,backArt],topItems=new Set(topLayers);
const artByPlane=new Map(PinballArt.planes.map(plane=>[plane,artLayers.filter(o=>o.plane===plane&&!topItems.has(o))]));
const artDrawPlans=new Map([...artByPlane].map(([plane,items])=>[plane,PinballArt.createDrawPlan(items)]));
const backgroundLayers=artByPlane.get('background'),rightBoundaryIndex=backgroundLayers.findIndex(o=>o.src.endsWith('/pirate-wall-right.png'));
const ballIndex=rightBoundaryIndex<0?backgroundLayers.length:rightBoundaryIndex;
const backgroundBelowBall=backgroundLayers.slice(0,ballIndex),backgroundAboveBall=backgroundLayers.slice(ballIndex);
const maskCandidates=[...PinballArt.planes.flatMap(plane=>artByPlane.get(plane)),...PinballArt.planes.flatMap(plane=>topLayers.filter(o=>o.plane===plane))].filter(o=>!o.hidden&&o.indicator?.screenMask);

let topVisibleInset=null;
function topOffset(){
 if(!topArt)return 0;
 if(topVisibleInset===null){const img=artRenderer.image(topArt.src);if(img.complete&&img.naturalWidth){
  const c=document.createElement('canvas');c.width=topArt.crop[2];c.height=topArt.crop[3];const brush=c.getContext('2d');brush.drawImage(img,...topArt.crop,0,0,c.width,c.height);
  try{const pixels=brush.getImageData(0,0,c.width,c.height).data;let first=0;for(;first<c.height;first++){let found=false;for(let x=0;x<c.width;x++)if(pixels[(first*c.width+x)*4+3]>32){found=true;break;}if(found)break;}topVisibleInset=first/c.height;}catch{topVisibleInset=.3812;}
 }}
 return view[1]+2-(topArt.y-topArt.height/2+topArt.height*(topVisibleInset??.3812));
}
const spaceTheme=['sci-fi','space','cosmic-dessert'].includes(PLAYTEST_THEME);
const soundBank=new PinballSound({...PirateMap.sounds,...(G.gameplay?.runicTurntable?.spinSound?{'runic-spin':{src:G.gameplay.runicTurntable.spinSound,volume:.4,voices:1}}:{}),...(spaceTheme?{'space-magic':{src:'res/audio/space/space-magic.ogg',volume:1,voices:3}}:{}),...(PLAYTEST_THEME==='steampunk'?SteampunkSounds:{})},{synth:theater.theme==='space'});theater.soundBank=soundBank;
const bossPresentation=['touhou1','touhou2'].includes(theater.theme)?new TouhouBossPresentation(game,theater.theme):null;
if(bossPresentation){bossPresentation.choose(bossStage);theater.bossPresentation=bossPresentation;theater.onBossChanged=stage=>bossPresentation.choose(stage||bossStage);theater.onBossDefeated=()=>bossPresentation.defeat();bossPresentation.requestOrigin=()=>theater.send({command:'boss-origin'});theater.onBossOrigin=(stage,origin)=>bossPresentation.cast(stage,origin);addEventListener('pagehide',()=>bossPresentation.destroy(),{once:true});}
for(const event of ['pointerdown','keydown'])addEventListener(event,()=>{soundBank.unlock();bossPresentation?.syncMusic(soundBank,true);},{capture:true});
let soundEnabled=localStorage.getItem('pinball-sound')!=='off';
function syncSound(){soundBank.setEnabled(soundEnabled);document.querySelectorAll('audio,video').forEach(a=>a.muted=!soundEnabled);soundArt.src='res/img/system-marker-'+(soundEnabled&&window.PinballSystemVolume!==0?'sound':'muted')+'.png';const button=$('wideSound');button.setAttribute('aria-pressed',String(soundEnabled));button.querySelector('img').src=PinballRuntimeImages.resolve(soundArt.src);}
function setPlaySound(enabled){
 if(window.AppControls?.setSound)window.AppControls.setSound(!!enabled);
 else{soundEnabled=!!enabled;localStorage.setItem('pinball-sound',soundEnabled?'on':'off');syncSound();}
 draw();
}
addEventListener('storage',event=>{if(event.key==='pinball-sound'){soundEnabled=localStorage.getItem('pinball-sound')!=='off';syncSound();draw();}});
syncSound();
const controls=createPlayControls({game,G,P,ctx,theater,bossStage,draw,reset,bind,clearTouchControls,applyPhysicsModel,applyPlayAspect,setPlaySound,soundBank,path,circle,withLayoutLayer,
 get launchMode(){return launchMode;},setLaunchMode(value){clearTouchControls();launchMode=value;localStorage.setItem('pinball-launch-mode',value);},
 get trackLayout(){return trackLayout;},get playAspect(){return playAspect;},get ballStartedAt(){return ballStartedAt;},get ballElapsed(){return ballElapsed;},get noticeUntil(){return noticeUntil;},get artWarning(){return artWarning;},notice(text){notice(text);}});
const openSettings=()=>controls.openSettings();
const leaveDialog=document.createElement('dialog');leaveDialog.id='leaveGameDialog';leaveDialog.setAttribute('aria-labelledby','leave-game-title');
leaveDialog.innerHTML='<h2 id="leave-game-title" data-i18n="table.leaveTitle">離開球台？</h2><button id="continueGame" data-i18n="table.continue">繼續遊玩</button> <button id="leaveGame" data-i18n="table.leave">離開球台</button>';document.body.append(leaveDialog);
function applyLocale(){
 document.documentElement.lang=PinballI18n.locale;PinballI18n.apply(document);controls.refreshLocale?.();firstPlayGuide?.refresh();
}
const stopLanguageUpdates=PinballI18n.onChange(applyLocale);addEventListener('pagehide',stopLanguageUpdates,{once:true});applyLocale();
let leaveWasPaused=false;
function requestLeaveGame(){if(leaveDialog.open)return;clearTouchControls();leaveWasPaused=game.paused;game.paused=true;game.input.left=game.input.right=game.input.launch=false;launchStartedAt=null;leaveDialog.showModal();$('continueGame').focus();}
leaveDialog.onclose=()=>{game.paused=leaveWasPaused;};
$('continueGame').onclick=()=>leaveDialog.close();
$('leaveGame').onclick=()=>{leaveDialog.close();if(window.AppControls?.exitGame)window.AppControls.exitGame();else location.href=new URL('../res/main.html',location.href).href;};
function topHit(a,x,y){if(!a||a.hidden||!controls.art)return false;const angle=-a.angle*Math.PI/180,dx=x-a.x,dy=y-a.y-(topItems.has(a)?topOffset():0);return Math.abs(dx*Math.cos(angle)-dy*Math.sin(angle))<=a.width/2&&Math.abs(dx*Math.sin(angle)+dy*Math.cos(angle))<=a.height/2;}

function art(plane,layers=artByPlane.get(plane)){if(controls.art){artRenderer.brightness=.82;try{artRenderer.draw(ctx,layers,plane,game);}finally{artRenderer.brightness=1;}}}
const spaceNeon=SpaceNeonBorders.createRenderer(SpaceNeonBorders.entries(G.art_layout_objects||[],G.art_layout_templates));
function bonusArt(plane){if(controls.art&&game.bonus?.config.object&&plane===(game.bonus.config.displayPlane||game.bonus.geometry?.layer||'lower'))game.bonus.draw(ctx,artRenderer);}
function artWithBalls(plane){
 const plan=artDrawPlans.get(plane);
 if(controls.art&&SpaceNeonBorders.enabled(PLAYTEST_THEME,G.gameplay))spaceNeon.draw(ctx,game,G.gameplay,plane);
 bonusArt(plane);
 // Right ramp balls are drawn separately, just below the right boundary art.
 const drawBalls=()=>{reboundEffects.draw(ctx,plane);for(const b of game.balls){if(b.layer==='right_upper')continue;const track=b.state==='guided'?game.guidedTracks.find(t=>t.id===b.track.id):null;const visualPlane=track?(track.layer==='tavern'?'upper':track.layer||'lower'):game.visualPlane(b);if(visualPlane===plane)drawBall(b);}};
 if(!plan.hasBallMarker)drawBalls();
 let drawn=false;for(const batch of plan.batches){if(batch)art(plane,batch);else if(!drawn){drawBalls();drawn=true;}}
 trackRenderer.draw(ctx,plane);
 if(!spaceTheme)ConfiguredMechanisms.drawPostCounts(game,ctx,plane);
}

const reservePreview=Math.max(0,Math.min(99,Number(new URLSearchParams(location.search).get('previewLives'))||0));
function tableObjectBounds(g,art,flippers){
 const xs=[],ys=[],add=(p,r=0)=>{if(p?.every(Number.isFinite)){xs.push(p[0]-r,p[0]+r);ys.push(p[1]-r,p[1]+r);}};
 for(const o of [...g.lower,...(g.upper_parts||[]),...(g.top_parts||[]),g.deck,...(g.guided_tracks||[]),...(g.visual_tracks||[])]){
  if(!o||o.kind==='field')continue;
  for(const p of o.points||[])add(p,(o.width||0)/2);
  if(o.center)add(o.center,o.radius||0);
 }
 for(const f of flippers)add(f.pivot,f.length+Math.max(...f.radii));
 for(const o of art){if(o.hidden||o.state==='ball-layer')continue;const a=o.angle*Math.PI/180,c=Math.abs(Math.cos(a)),t=Math.abs(Math.sin(a)),w=(o.width*c+o.height*t)/2,h=(o.width*t+o.height*c)/2;xs.push(o.x-w,o.x+w);ys.push(o.y-h,o.y+h);}
 const p=g.plunger;if(p){xs.push(p.left,p.right);ys.push(p.top??0,p.rest_y+p.stroke);}
 if(!xs.length)return [g.view_box[0],0,g.view_box[2],g.view_box[1]+g.view_box[3]];
 const y=Math.min(0,Math.min(...ys)-2);return [g.view_box[0],y,g.view_box[2],g.view_box[1]+g.view_box[3]-y];
}
const view=[...G.view_box],portraitView=[...G.view_box],tableView=tableObjectBounds(G,artLayers,game.flippers);
let playAspect='portrait';
function applyPlayAspect(value){
 playAspect=value==='landscape'?'landscape':'portrait';localStorage.setItem('pinball-play-aspect',playAspect);controls.setPlayAspect?.(playAspect);
 document.documentElement.dataset.playAspect=playAspect;$('playLayout').dataset.aspect=playAspect;$('landscapePanel').hidden=playAspect!=='landscape';theater.panelElement=playAspect==='landscape'?$('landscapeTheater'):null;
 view.splice(0,4,...(playAspect==='landscape'?tableView:portraitView));
 clearTouchControls();resize();
}
$('wideBack').onclick=()=>requestLeaveGame();
$('wideSettings').onclick=()=>openSettings();$('wideRestart').onclick=()=>reset();$('wideSound').onclick=()=>setPlaySound(!soundEnabled);
$('wideTitle').textContent=({pirate:'PIRATE PINBALL',steampunk:'STEAMPUNK PINBALL','sci-fi':'SPACE PINBALL',norse:'SAGA PINBALL'}[PLAYTEST_THEME]||'PINBALL');
function resize(){
 const stage=$('playLayout');
 if(playAspect==='landscape'){const host=stage.parentElement.getBoundingClientRect(),padding=getComputedStyle(stage.parentElement),aw=Math.max(1,host.width-parseFloat(padding.paddingLeft)-parseFloat(padding.paddingRight)),ah=host.height-parseFloat(padding.paddingTop)-parseFloat(padding.paddingBottom),width=Math.min(aw,ah*16/9);stage.style.width=width+'px';stage.style.height=width*9/16+'px';stage.style.setProperty('--table-width',Math.max((width-4)*.6,Math.min(width-5,(width*9/16-4)*view[2]/view[3]))+'px');}else{stage.style.width='';stage.style.height='';}
 const parent=canvas.parentElement,r=parent.getBoundingClientRect(),style=getComputedStyle(parent);
 const availableW=Math.max(1,r.width-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)),availableH=Math.max(1,r.height-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom));
 const w=Math.min(availableW,playAspect==='landscape'?Infinity:600,availableH*view[2]/view[3]),h=w*view[3]/view[2];
 const pixelWidth=Math.max(1,Math.round(w)),pixelHeight=Math.max(1,Math.round(h));
 const artworkSizeChanged=canvas.width!==pixelWidth||canvas.height!==pixelHeight;
 if(canvas.width!==pixelWidth)canvas.width=pixelWidth;if(canvas.height!==pixelHeight)canvas.height=pixelHeight;
 canvas.style.width=w+'px';canvas.style.height=h+'px';requestAnimationFrame(()=>draw());
 if(artworkSizeChanged&&window.viewAPI){const scale=pixelWidth/view[2];Promise.all([impactPresentation.prepareComboFlash(scale),artRenderer.prepareMissionLights(artLayers,scale,.82,-view[0]*scale,-view[1]*scale)]).then(()=>draw()).catch(console.error);}
}
new ResizeObserver(resize).observe($('playLayout').parentElement);new ResizeObserver(resize).observe(canvas.parentElement);
let previous=performance.now(),accumulator=0,noticeUntil=0;
const notice=text=>{controls.notice?.(text);noticeUntil=game.time+2};
let floatingRewards=[];
let screenDimAlpha=0,screenDimTime=null,screenDimAnchor=null,screenDimDrawn=false;
function updateScreenDimEvent(e){if(['new-game','drain','ball-saved','ready','game-over'].includes(e.type)){screenDimAlpha=0;screenDimTime=null;screenDimAnchor=null;}}
function updateScreenDim(){
 const effect=controls.art?maskCandidates.find(o=>IndicatorLights.maskActive(o,game)):null;
 const now=game.time,dt=screenDimTime===null?0:Math.max(0,now-screenDimTime);screenDimTime=now;
 screenDimAlpha=effect?Math.min(.2,screenDimAlpha+dt*.2/.4):Math.max(0,screenDimAlpha-dt*.2/.6);
 if(effect)screenDimAnchor=effect;
 screenDimDrawn=false;
}
artRenderer.beforeDraw=(ctx,o)=>{
 if(screenDimDrawn||screenDimAlpha<=0||o!==screenDimAnchor)return;
 screenDimDrawn=true;
 ctx.save();
 const scale=canvas.width/view[2];ctx.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);
 ctx.globalAlpha=1;ctx.fillStyle=`rgba(0,0,0,${screenDimAlpha})`;ctx.fillRect(...view);ctx.restore();
};
function showFloatingReward(position,text,ballIcon=false,delay=0){
 if(!position)return;
 floatingRewards.push({position:[...position],text,ballIcon,start:game.time+delay});
 if(floatingRewards.length>24)floatingRewards.shift();
}
function drawFloatingRewards(){
 floatingRewards=floatingRewards.filter(reward=>game.time-reward.start<1.3);
 for(const reward of floatingRewards){
  const age=game.time-reward.start;if(age<0)continue;
  const [x,y]=reward.position;
  ctx.save();ctx.globalAlpha=Math.min(1,(1.3-age)/.35);ctx.translate(x,y-9-age*15);
  ctx.font='bold 12px system-ui, sans-serif';ctx.textBaseline='middle';ctx.textAlign='center';
  ctx.lineWidth=3;ctx.strokeStyle='#1e1309';ctx.fillStyle='#fff2af';
  if(reward.ballIcon&&topBallImage.complete&&topBallImage.naturalWidth){ctx.drawImage(topBallImage,-24,-7,14,14);ctx.strokeText(reward.text,2,0);ctx.fillText(reward.text,2,0);}
  else{ctx.strokeText(reward.ballIcon?PinballI18n.t('table.oneBall'):reward.text,0,0);ctx.fillText(reward.ballIcon?PinballI18n.t('table.oneBall'):reward.text,0,0);}
  ctx.restore();
 }
}
let ballStartedAt=null,ballElapsed=0;
let gameOverOverlay=null;
function endGame(){
 if(gameOverOverlay)return;clearTouchControls();launchStartedAt=null;game.paused=true;soundBank.stop();
 if(bossStage){window.dispatchEvent(new CustomEvent('pinball:boss-exit',{detail:{stage:bossStage}}));return;}
 let rows=[];try{const saved=JSON.parse(localStorage.getItem('pinball-high-scores-v1')||'[]');if(Array.isArray(saved))rows=saved.filter(r=>r&&Number.isSafeInteger(r.score)&&r.score>=0).slice(0,10);}catch{}
 const id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);rows.push({id,score:game.score,endedAt:new Date().toISOString()});rows.sort((a,b)=>b.score-a.score);rows=rows.slice(0,10);
 try{localStorage.setItem('pinball-high-scores-v1',JSON.stringify(rows));}catch{}
 gameOverOverlay=PirateMap.showGameOver(document,game.score,rows,id,()=>{gameOverOverlay=null;if(bossStage)window.dispatchEvent(new CustomEvent('pinball:boss-exit',{detail:{stage:bossStage}}));else reset();},bossStage?PinballI18n.t('table.leave'):'重新開始');
}
game.onEvent=e=>{if(e.type==='ready'&&bossStage)game.enemyActive=!theater.bossDefeated;window.PinballHaptics?.onEvent(e,game);bossPresentation?.onEvent(e);artRenderer.onEvent?.(e);firstPlayGuide?.onEvent(e);updateScreenDimEvent(e);if(e.type==='new-game')floatingRewards=[];if((e.type==='score'||e.type==='target-bonus')&&e.points>0)showFloatingReward(e.position,'+'+e.points);if(e.type==='extra-life-awarded')showFloatingReward(e.position||game.ball.p,'+1',true);if(e.type==='launch'){ballStartedAt=game.time;ballElapsed=0;soundBank.play('explosion');}if(e.type==='drain'&&ballStartedAt!==null){ballElapsed=game.time-ballStartedAt;ballStartedAt=null;}if(e.type==='new-game'){ballStartedAt=null;ballElapsed=0;}if(e.type==='ball-saved')notice(PinballI18n.t('table.ballSaved'));if(e.type==='ball-save-ready'){launchStartedAt=null;notice(PinballI18n.t('table.relaunch'));}if(e.type==='sound'&&e.name!=='runic-spin')soundBank.play(e.name);if(e.type==='release'||e.type==='kickback')soundBank.play('explosion');if(e.type==='new-game'||e.type==='ready')soundBank.stop();theater.onEvent(e);if(e.type==='enemy-spawn-requested'){launchStartedAt=null;game.input.launch=false;game.charge=game.chargeElapsed=0;notice(PinballI18n.t('table.enemyWait'));window.dispatchEvent(new CustomEvent('pinball:enemy-spawn',{detail:e}));}if(e.type==='extra-life-awarded')notice(PinballI18n.t('table.extraBall',{source:e.source==='multiball'?'Multiball':e.source==='boss-target'?'Boss target':PinballI18n.t('table.vortex')}));if(e.type==='vortex-activated')notice(PinballI18n.t('table.vortexActive'));if(e.type==='target-bonus')notice(PinballI18n.t('table.targetBonus'));if(e.type==='bumper-upgraded')notice(PinballI18n.t('table.bumperLevel',{level:e.level}));if(e.type==='center-post-up')notice(PinballI18n.t('table.postUp'));if(e.type==='multiball-awarded')notice(PinballI18n.t('table.multiball'));if(e.type==='free-ball-launch')notice(PinballI18n.t('table.multiballLaunch'));if(e.type==='kickback-lane')notice(e.side==='left'?PinballI18n.t('table.kickLeft'):PinballI18n.t('table.kickRight'));if(e.type==='capture'){if(spaceTheme)soundBank.play('space-magic');notice(PinballI18n.t('table.capture'));}if(e.type==='release')notice(PinballI18n.t('table.release'));if(e.type==='drain')notice(PinballI18n.t('table.drain'));if(e.type==='ready')notice(PinballI18n.t('table.launchShort'));if(e.type==='game-over')endGame();if(e.type==='layer')notice(e.to==='top'?PinballI18n.t('table.enterTop'):e.to!=='lower'?PinballI18n.t('table.enterMiddle'):PinballI18n.t('table.enterLower'));if(e.type==='target-group-complete')notice(game.targetGroups.find(g=>g.id===e.id)?.targets.length===1?PinballI18n.t('table.singleTarget'):PinballI18n.t('table.targetSet'));};
theater.game=game;
function startBoss(){
 if(!Number.isInteger(bossStage)||bossStage<1||bossStage>8)return;
 game.enemyActive=true;
 theater.onEvent({type:'enemy-spawn-requested',eventId:bossStage});
 notice(PinballI18n.t('table.enemyWait'));
}
if(bossStage&&(!tutorialMode||['steampunk','space','norse','touhou1'].includes(PLAYTEST_THEME)))startBoss();
function path(points,fill,stroke,width=1,closed=false){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));if(closed)ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function circle(p,r,fill,stroke){ctx.beginPath();ctx.arc(...p,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke()}}
const reboundEffects=createReboundEffects(game,soundBank);
const impactPresentation=createImpactPresentation(game,artLayers,artRenderer);
theater.onSound=name=>impactPresentation.onTheaterSound(name);
const trackOverlay=GuidedTrackGeometry.outlines([...(G.guided_tracks||[]),...(G.visual_tracks||[])]);const trackLayout=new Map([...trackOverlay].map(([id,t])=>[id,{...t,showAboveArt:true}]));
const trackRenderer=GuidedTrackGeometry.createRenderer(trackOverlay);
function withLayoutLayer(layer,draw){
 const active=game.balls.some(b=>b.state!=='drained'&&(b.state==='guided'?(game.guidedTracks.find(t=>t.id===b.track?.id)?.layer||'lower'):b.layer)===layer);
 ctx.save();ctx.globalAlpha=active?1:.5;draw();ctx.restore();
}
function draw(){
 updateScreenDim();
 const scale=canvas.width/view[2];ctx.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);ctx.clearRect(...view);ctx.fillStyle='#13242f';ctx.fillRect(...view);
 impactPresentation.update();ctx.translate(...impactPresentation.shake());
 theater.customScore=playAspect!=='landscape'&&!!topArt&&!topArt.hidden&&controls.art;const theaterViewport=theater.draw(ctx,game,view[1]);
 art('background',backgroundBelowBall);
 for(const b of game.balls)if(b.layer==='right_upper')drawBall(b);
 art('background',backgroundAboveBall);
 bonusArt('background');
 artWithBalls('lower');
 artWithBalls('upper');artWithBalls('top');
 art('foreground');
 bossPresentation?.draw(ctx,theater,theaterViewport);
 if(spaceTheme)for(const plane of ['lower','upper','top'])ConfiguredMechanisms.drawPostCounts(game,ctx,plane,'#000');
 if(controls.art&&playAspect!=='landscape'){ctx.save();ctx.translate(0,topOffset());for(const plane of PinballArt.planes)artRenderer.draw(ctx,topLayers,plane,game);ctx.restore();}
 if(theater.customScore){ctx.save();ctx.translate(topArt.x,topArt.y+topOffset());ctx.rotate(topArt.angle*Math.PI/180);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffe6a3';ctx.shadowColor='#201209';ctx.shadowBlur=4;ctx.font='bold 15px monospace';if(bossStage)theater.drawAttackMessage(ctx,topArt.width*(118/370-.5),topArt.height*(54/124-.5),topArt.width*134/370,topArt.height*18/124,game.time);else ctx.fillText(String(game.score).padStart(12,'0'),0,0,topArt.width*.48);
  const reserve=reservePreview|| (game.gameOver?0:Math.max(0,Math.min(99,4-game.ballNumber-(game.lifeLaunched?1:0)+(game.extraLives||0))));
  const counterX=topArt.width*(.159-.5),counterY=topArt.height*.014,counterW=topArt.width*.16,counterH=topArt.width*.047;
  ctx.shadowBlur=0;
  if(reserve<=3){
   const iconSize=counterH*.75,slotSpacing=topArt.width*30/594;
   if(topBallImage.complete&&topBallImage.naturalWidth){
    for(let i=0;i<reserve;i++)ctx.drawImage(topBallImage,counterX-slotSpacing+i*slotSpacing-iconSize/2,counterY-iconSize/2,iconSize,iconSize);
   }
  }else{
   ctx.fillStyle='#080808';ctx.fillRect(counterX-counterW/2,counterY-counterH/2,counterW,counterH);
   ctx.font='bold '+(topArt.width*.028)+'px monospace';ctx.fillStyle='#ffe6a3';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('BALL '+reserve,counterX,counterY,counterW*.94);
  }
  ctx.restore();}

 controls.drawGeometry?.();
 for(const plane of PinballArt.planes)withLayoutLayer(plane==='upper'?'tavern':plane,()=>impactPresentation.draw(ctx,plane,view));
 impactPresentation.drawComboFlash(ctx,view);
 drawFloatingRewards();
 drawBallOutlines();
 impactPresentation.drawHud(ctx,view);
 if(controls.art)game.bonus?.drawAttackOverlay?.(ctx,artRenderer,view);
 controls.updateHUD?.();
}
function drawBall(b){if(b.state==='drained')return;impactPresentation.drawBallGlow(ctx,b);ctx.save();if(topBallImage.complete&&topBallImage.naturalWidth)ctx.drawImage(topBallImage,b.p[0]-game.physics.ballRadius,b.p[1]-game.physics.ballRadius,game.physics.ballRadius*2,game.physics.ballRadius*2);else{circle(b.p,game.physics.ballRadius,'#e7eff5','#4c6677');circle([b.p[0]-1,b.p[1]-1],.9,'white')}ctx.restore()}
function drawBallOutlines(){
 if(G.gameplay?.ballOutline===false)return;
 ctx.save();ctx.globalCompositeOperation='source-over';ctx.setLineDash([1.7,1.2]);ctx.lineWidth=.5;ctx.strokeStyle='#ffffff';ctx.shadowBlur=0;
 for(const b of game.balls){
  if(b.state==='drained')continue;
  // Outline balls hidden beneath route artwork.
  ctx.globalAlpha=(b.layer==='right_upper'?1:.35);
  ctx.beginPath();ctx.arc(b.p[0],b.p[1],5.0,0,Math.PI*2);ctx.stroke();
 }
 ctx.restore();
}
let lastDrawAt=0;
function frame(now){
 const [shakeX,shakeY]=impactPresentation.screenShake(now),screenTranslate=shakeX||shakeY?`${shakeX}px ${shakeY}px`:'';
 // CSS translation keeps theater and table synchronized even while physics/drawing is frozen.
 if(canvas.style.translate!==screenTranslate){canvas.style.translate=screenTranslate;theater.frame.style.translate=screenTranslate;}
 const dt=Math.min(.05,(now-previous)/1000);previous=now;firstPlayGuide?.tick?.(dt);if(firstPlayGuidePending&&!game.paused&&!game.enemyIntroPending&&!theater.curtainClosing&&!game.theaterFrozen){firstPlayGuidePending=false;firstPlayGuide=TableTutorial.start({game,theater,canvas,G,P,artLayers,view,getView:()=>view,soundBank,clearTouchControls,launch,notice,
controls:{get launchMode(){return launchMode},get launchDrag(){return launchDrag},set launchDrag(value){launchDrag=value}},
onFinish(){firstPlayGuide=null;}});}theater.update(leaveDialog.open?0:dt,game);game.bonus?.update(dt);bossPresentation?.update(dt,soundBank,controls.settingsOpen||leaveDialog.open||suspendedGameState!==null||game.paused&&!firstPlayGuide&&!theater.bossDefeated);soundBank.setPaused(game.paused&&!controls.settingsOpen);if(G.gameplay?.runicTurntable)soundBank.sync('runic-spin',game.bonus.clock-game.bonus.phaseAt,!game.paused&&game.bonus.phase==='spin'&&game.bonus.clock-game.bonus.phaseAt<G.gameplay.runicTurntable.spinSeconds);if(!game.paused&&!game.theaterFrozen&&!game.bonusFrozen&&!firstPlayGuide?.demoFrozen){accumulator+=dt;while(accumulator>=game.physics.step){game.step();accumulator-=game.physics.step;if(game.theaterFrozen||game.bonusFrozen||game.paused){accumulator=0;break;}}}else accumulator=0;syncLaunchCharge(now);if(!game.paused&&!game.theaterFrozen||screenDimAlpha>0||now-lastDrawAt>=100){draw();lastDrawAt=now;}requestAnimationFrame(frame)}
let launchStartedAt=null;
function syncLaunchCharge(now=performance.now()){
 if(launchDrag)return;
 if(launchStartedAt===null||theater.curtainClosing||game.enemyIntroPending||game.paused||game.freezeRemaining>0||game.ball.state!=='ready')return;
 game.chargeElapsed=Math.max(0,Math.min(G.plunger.charge_seconds,(now-launchStartedAt)/1000));
 game.charge=game.chargePower(game.chargeElapsed);
 game.ball.p[1]=G.plunger.rest_y-game.physics.ballRadius+G.plunger.stroke*game.charge;
}
function launch(on){
 if(on){if(theater.curtainClosing||game.enemyIntroPending||game.paused||game.freezeRemaining>0||game.ball.state!=='ready'||launchStartedAt!==null)return;launchStartedAt=performance.now();game.input.launch=true;syncLaunchCharge();}
 else{syncLaunchCharge();const was=launchStartedAt!==null&&game.input.launch;launchStartedAt=null;game.input.launch=false;if(was&&!theater.curtainClosing&&!game.enemyIntroPending)game.launch(game.charge);game.charge=0;game.chargeElapsed=0;}
}
let suspendedGameState=null;
function suspendGame(){
 if(suspendedGameState!==null)return;
 suspendedGameState=game.paused;clearTouchControls();launchStartedAt=null;
 game.charge=game.chargeElapsed=0;game.input.left=game.input.right=game.input.launch=false;
 game.paused=true;soundBank.setPaused(true);
}
function resumeGame(){if(suspendedGameState===null)return;game.paused=suspendedGameState;suspendedGameState=null;soundBank.setPaused(game.paused);}
function applyPhysicsModel(value){value='legacy';game.config.physicsModel=value;game.vpxRemainder=game.arcadeRemainder=0;for(const f of game.flippers){f.angle=f.rest;f.omega=0;delete f.cadet;VpxFlipper.reset(f);}for(const ball of game.balls){ball.spin=0;delete ball.rollingSpin;delete ball.vpxLastSlingEventPosition;delete ball.slingshotContacts;delete ball.arcadeActiveContacts;delete ball.arcadeFlipperContacts;}$('physicsModel').value=value;localStorage.setItem('pinball-physics-model',value);}
function applyAppSettings(values){if(values.physicsModel&&values.physicsModel!==game.config.physicsModel)applyPhysicsModel(values.physicsModel);if(values.playAspect)applyPlayAspect('portrait');soundEnabled=values.sound;launchMode=values.launchMode; controls.setLaunchMode?.(launchMode);syncSound();}
function reset(){gameOverOverlay?.cancel();gameOverOverlay=null;clearTouchControls();launchStartedAt=null;game.reset();accumulator=0;if(bossStage&&(!tutorialMode||['steampunk','space','norse','touhou1'].includes(PLAYTEST_THEME)))startBoss();else notice(PinballI18n.t('table.launchShort'))}
function bind(id,set){const b=$(id);b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);set(true);if(!game.paused&&!game.gameOver)window.PinballHaptics?.play('tap');e.preventDefault()};b.onpointerup=()=>set(false);b.onpointercancel=()=>set(false)}
controls.bindInputs?.(launch);
function key(e,on){if(tutorialMode||leaveDialog.open)return;if(e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();const control=['arrowleft','z'].includes(k)?'left':['arrowright','c'].includes(k)?'right':[' ','arrowdown'].includes(k)?'launch':null;if(firstPlayGuide&&!firstPlayGuide.allowed(control)){e.preventDefault();return;}if(!on&&control&&firstPlayGuide)firstPlayGuide.used(control);if([' ','arrowdown','arrowleft','arrowright','z','c','x','r'].includes(k))e.preventDefault();if(['arrowleft','z'].includes(k))game.input.left=on;if(['arrowright','c'].includes(k))game.input.right=on;if([' ','arrowdown'].includes(k)&&!e.repeat)launch(on);if(on&&!e.repeat){if(k==='r')reset();if(k==='x')game.nudge()}}
addEventListener('keydown',e=>{if(!gameOverOverlay)key(e,true)});addEventListener('keyup',e=>{if(!gameOverOverlay)key(e,false)});
addEventListener('blur',()=>{clearTouchControls();game.input.left=game.input.right=game.input.launch=false;if(!window.AppControls&&!game.paused)openSettings()});
canvas.onpointerdown=e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*view[2]+view[0],y=(e.clientY-r.top)/r.height*view[3]+view[1];if(topHit(backArt,x,y)){requestLeaveGame();return;}if(topHit(settingsArt,x,y)){openSettings();return;}if(topHit(soundArt,x,y)){setPlaySound(!soundEnabled);notice(soundEnabled?PinballI18n.t('table.soundOn'):PinballI18n.t('table.soundOff'));draw();return;}if(controls.probe){controls.placeBall(x,y);return;}
{
 if(e.pointerType!=='touch'||game.paused||game.gameOver||y<0)return;
 const control=game.ball.state==='ready'&&x>=G.plunger.left?'launch':x<180?'left':'right';
 const already=[...touchControls.values()].includes(control);if(!already)window.PinballHaptics?.play('tap');touchControls.set(e.pointerId,control);canvas.setPointerCapture(e.pointerId);e.preventDefault();
 if(control==='launch'){if(!already){if(launchMode==='drag'){if(game.ball.state==='ready'&&!game.freezeRemaining&&!game.enemyIntroPending&&!theater.curtainClosing){launchDrag={pointerId:e.pointerId,y:e.clientY};game.launchAiming=true;}}else launch(true);}}else game.input[control]=true;
 return;
}

};
function clearTouchControls(){touchControls.clear();launchDrag=null;game.launchAiming=false;launchStartedAt=null;game.input.left=game.input.right=game.input.launch=false;game.charge=game.chargeElapsed=0;}
function endTouch(e,cancel=false){const control=touchControls.get(e.pointerId);if(!control)return;touchControls.delete(e.pointerId);if([...touchControls.values()].includes(control))return;if(control==='launch'){if(launchDrag){if(!cancel&&!theater.curtainClosing&&!game.enemyIntroPending)game.launch(game.charge);launchDrag=null;game.launchAiming=false;game.charge=game.chargeElapsed=0;return;}if(cancel){launchStartedAt=null;game.input.launch=false;game.charge=game.chargeElapsed=0;}else launch(false);}else game.input[control]=false;}
canvas.onpointermove=e=>{if(!launchDrag||launchDrag.pointerId!==e.pointerId)return;e.preventDefault();game.charge=Math.max(0,Math.min(1,(e.clientY-launchDrag.y)/100));game.chargeElapsed=game.charge;game.ball.p[1]=G.plunger.rest_y-game.physics.ballRadius+G.plunger.stroke*game.charge;};
canvas.onpointerup=e=>endTouch(e);
canvas.onpointercancel=e=>endTouch(e,true);
canvas.onlostpointercapture=e=>endTouch(e,true);
applyPlayAspect(playAspect);
artRenderer.brightness=.82;
try{await artRenderer.prepareArtwork(artLayers,canvas.width/view[2]);}finally{artRenderer.brightness=1;}
await artRenderer.prepareMissionLights(artLayers,canvas.width/view[2],.82,-view[0]*canvas.width/view[2],-view[1]*canvas.width/view[2]);
await impactPresentation.prepareShadows(canvas.width/view[2]);
draw();
previous=performance.now();accumulator=0;
requestAnimationFrame(frame);
window.viewAPI={hasSettingsControl:true,game,applyLocale,applySettings:applyAppSettings,suspend:suspendGame,resume:resumeGame};

}
