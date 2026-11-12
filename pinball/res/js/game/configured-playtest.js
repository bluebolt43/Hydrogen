async function startPreview(PIRATE_GEOMETRY,preparedImages){
'use strict';
const drawRuntimeImage=globalThis.PinballRuntimeImages?.draw||((ctx,...args)=>ctx.drawImage(...args));
const tutorialMode=!!TableTutorial&&new URLSearchParams(location.search).get('tutorial')==='1';
const requestedBossStage=Number(new URLSearchParams(location.search).get('bossStage'));
const bossStage=Number.isInteger(requestedBossStage)&&requestedBossStage>=1&&requestedBossStage<=8?requestedBossStage:0;
const G=PIRATE_GEOMETRY,P=PiratePhysics,Game=ConfiguredMechanisms.createGame(LayeredGame.createGame(P),P),game=new (PLAYTEST_THEME==='steampunk'?SteampunkBonus.createGame(Game):G.gameplay?.spaceConstellation?SpaceConstellation.createGame(Game):(G.gameplay?.touhouBagua||G.gameplay?.runicTurntable)?TouhouBagua.createGame(Game):Game)(G),canvas=document.getElementById('table'),gameContext=canvas.getContext('2d',{alpha:false}),$=id=>document.getElementById(id);
const layeredRenderingEnabled=true;
const retainedCanvasEnabled=false;
const combinedCacheEnabled=true;
let ctx=gameContext,effectsGL=null,effectsRequested=null;
addEventListener('pagehide',()=>effectsGL?.destroy(),{once:true});
const canvasLayers=layeredRenderingEnabled?new PlayCanvasLayers(canvas,{interactive:retainedCanvasEnabled,cachedOutput:combinedCacheEnabled}):null;
addEventListener('pagehide',()=>canvasLayers?.destroy(),{once:true});
try{localStorage.setItem('pinball-physics-model','legacy');}catch{}
game.config.physicsModel='legacy';
game.storyMode=!!bossStage&&!tutorialMode;
game.spaceEndlessMode=['sci-fi','space','cosmic-dessert'].includes(PLAYTEST_THEME)&&!bossStage&&!tutorialMode&&!new URLSearchParams(location.search).has('editor');
game.disableBossTargetLife=['pirate','touhou1','touhou2','norse'].includes(PLAYTEST_THEME);
game.targetRehitRequiresExit=PLAYTEST_THEME==='touhou1';
game.preserveTableOnDrain=!!bossStage;
game.scoringEnabled=!bossStage;
const sceneCache=layeredRenderingEnabled?new PlaySceneCache():null;
const ballMasks=layeredRenderingEnabled?new PlaySceneCache.BallMasks():null;
addEventListener('pagehide',()=>ballMasks?.destroy(),{once:true});
addEventListener('pagehide',()=>sceneCache?.destroy(),{once:true});
let graphicsPreparation=null,graphicsGeneration=0;
let artworkReady=false,drawRequested=true,drawnGameTime,drawnBonusClock,drawnHudState,drawnPaused,drawnFrozen;
window.layoutGame=game;
const theater=new LayoutTheater(PLAYTEST_THEME);theater.setPresentationReady(false);theater.bossStage=bossStage;theater.tutorialPreview=false;window.layoutTheater=theater;
const theaterCanvas=theater.canvasBackend;theaterCanvas.attach(preparedImages,()=>{drawRequested=true;});window.layoutTheaterCanvas=theaterCanvas;
theater.onEnemyReady=data=>{game.freezeRemaining=0;if(data.type==='error')game.enemyActive=false;};
theater.onEnemyDefeated=(data,stageCleared)=>{
 game.enemyActive=false;
 if(stageCleared){game.scoreHit('boss-clear:'+bossStage,data.maxHp*1500,0);game.paused=true;soundBank.stop();window.dispatchEvent(new CustomEvent('pinball:boss-defeated',{detail:{stage:bossStage}}));}
};
let firstPlayGuide=null;
let firstPlayGuidePending=!!TableTutorial&&(tutorialMode||bossStage===1&&new URLSearchParams(location.search).get('firstPlayTutorial')==='1'&&!(window.AppProgress?window.AppProgress.tutorialComplete:localStorage.getItem(`pinball-${PLAYTEST_THEME}-first-play-tutorial-v1`)==='1'));
const touchControls=new Map();let launchMode=localStorage.getItem('pinball-launch-mode')||'hold',launchDrag=null;
const artRenderer=new (PLAYTEST_THEME==='steampunk'?SteampunkArt.Renderer:PinballArt.Renderer)("",IndicatorLights.artMap(PirateMap),preparedImages);let artLayers=[],artWarning='';
addEventListener('pagehide',()=>{theater.clearScoreShadows();artRenderer.clearHaloRasters();game.bonus?.destroy?.();},{once:true});
artRenderer.rasterCacheEnabled=true;
artRenderer.bitmapCacheEnabled=true;
artRenderer.backgroundCacheEnabled=true;
artRenderer.staticCacheEnabled=true;
artRenderer.reuseCompositionBuffers=true;
artRenderer.planCacheEnabled=true;
artRenderer.missionCacheEnabled=true;
// Keep the experimental light composite off: CPU4 paired runs regress slow frames.
artRenderer.stateLightCacheEnabled=false;
try{artLayers=PinballArt.validate(G.artLayers||[]);
 if(new URLSearchParams(location.search).get('art')==='preview'){
  const preview=JSON.parse(localStorage.getItem('pinball-art-preview-res')||'null');
  if(preview&&JSON.stringify(preview.objects)===JSON.stringify(G.art_layout_objects))artLayers=PinballArt.validate(preview.artLayers);
  else artWarning='美術預覽與試玩布局不同：請匯出 JSON 並重新建置。';
 }
}catch(e){artWarning='美術載入失敗：'+e.message}
// Ignore legacy frame entries in saved drafts; the chrome has one shared owner.
artLayers=artRenderer.observeLayout(artLayers.filter(a=>!PlayFrame.isFrameArt(a)));
const [topArt,soundArt,settingsArt,backArt]=artRenderer.observeLayout(PinballArt.validate(PlayFrame.createArt(PLAYTEST_THEME)));
const topBallImage=artRenderer.image(G.gameplay?.ballImage||(['touhou1','touhou2','touhou-horrors','touhou-black-knight-2000'].includes(PLAYTEST_THEME)?'res/img/touhou/touhou-ball-yin-yang.png':['sci-fi','space','cosmic-dessert'].includes(PLAYTEST_THEME)?'res/img/space/space-ball-cookie.png':'res/img/top-ball.png'));
const ballImages=new BallImageCache(topBallImage);
function prepareBallImages(){ballImages.prepare(canvas.width/view[2],game.physics.ballRadius*2,topArt.width*.047*.75,layeredRenderingEnabled?4:0);}
topBallImage.addEventListener('load',()=>{ballImages.clear();if(window.viewAPI)preparePlayGraphics().catch(console.error);else drawRequested=true;});
addEventListener('pagehide',()=>ballImages.clear(),{once:true});
const topLayers=artRenderer.observeLayout([topArt,soundArt,settingsArt,backArt]),topItems=new Set(topLayers);
const artByPlane=new Map(PinballArt.planes.map(plane=>[plane,artRenderer.observeLayout(artLayers.filter(o=>o.plane===plane&&!topItems.has(o)))]));
const artDrawPlans=new Map([...artByPlane].map(([plane,items])=>[plane,artRenderer.observeLayout(PinballArt.createDrawPlan(items))]));
const backgroundLayers=artByPlane.get('background'),rightBoundaryIndex=backgroundLayers.findIndex(o=>o.src.endsWith('/pirate-wall-right.png'));
const ballIndex=rightBoundaryIndex<0?backgroundLayers.length:rightBoundaryIndex;
const backgroundBelowBall=artRenderer.observeLayout(backgroundLayers.slice(0,ballIndex)),backgroundAboveBall=artRenderer.observeLayout(backgroundLayers.slice(ballIndex));
const maskCandidates=[...PinballArt.planes.flatMap(plane=>artByPlane.get(plane)),...PinballArt.planes.flatMap(plane=>topLayers.filter(o=>o.plane===plane))].filter(o=>!o.hidden&&o.indicator?.screenMask);

let topVisibleInset=null;
function topOffset(){
 if(!topArt)return 0;
 if(topVisibleInset===null){const img=artRenderer.image(topArt.src);if(img.complete&&img.naturalWidth){
  const c=document.createElement('canvas');c.width=topArt.crop[2];c.height=topArt.crop[3];const brush=c.getContext('2d');drawRuntimeImage(brush,img,...topArt.crop,0,0,c.width,c.height);
  try{const pixels=brush.getImageData(0,0,c.width,c.height).data;let first=0;for(;first<c.height;first++){let found=false;for(let x=0;x<c.width;x++)if(pixels[(first*c.width+x)*4+3]>32){found=true;break;}if(found)break;}topVisibleInset=first/c.height;}catch{topVisibleInset=.3812;}
 }}
 return view[1]+2-(topArt.y-topArt.height/2+topArt.height*(topVisibleInset??.3812));
}
const spaceTheme=['sci-fi','space','cosmic-dessert'].includes(PLAYTEST_THEME);
const soundBank=new PinballSound({...PirateMap.sounds,...(G.gameplay?.runicTurntable?.spinSound?{'runic-spin':{src:G.gameplay.runicTurntable.spinSound,volume:.4,voices:1,stream:true}}:{}),...(spaceTheme?{'space-magic':{src:'res/audio/space/space-magic.ogg',volume:1,voices:3}}:{}),...(PLAYTEST_THEME==='steampunk'?SteampunkSounds:{})},{synth:theater.theme==='space'});theater.soundBank=soundBank;
addEventListener('pagehide',()=>soundBank.destroy(),{once:true});
const bossPresentation=['touhou1','touhou2'].includes(theater.theme)?new TouhouBossPresentation(game,theater.theme,{external:true,overlay:true}):null;
if(bossPresentation){bossPresentation.choose(bossStage);theater.bossPresentation=bossPresentation;theater.onBossWarning=stage=>bossPresentation.prepare(stage);theater.onBossChanged=stage=>bossPresentation.choose(stage||bossStage);theater.onBossDefeated=()=>bossPresentation.defeat();bossPresentation.requestOrigin=()=>theater.send({command:'boss-origin'});theater.onBossOrigin=(stage,origin)=>bossPresentation.onOrigin(stage,origin);bossPresentation.canCast=()=>{for(const id of theater.activeCommands.keys())if(id.includes(':lv4:'))return false;return true;};addEventListener('pagehide',()=>bossPresentation.destroy(),{once:true});}
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
const fpsDisplay=PlayFPS.create(document);
try{fpsDisplay.setEnabled(localStorage.getItem('pinball-show-fps')==='on');}catch{}
const controls=createPlayControls({game,G,P,ctx,theater,bossStage,bossPresentation,draw,reset,bind,clearTouchControls,applyPhysicsModel,applyPlayAspect,setPlaySound,soundBank,syncAudioPause,path,circle,withLayoutLayer,
 get showFPS(){return fpsDisplay.enabled;},setShowFPS(value){fpsDisplay.setEnabled(value);try{localStorage.setItem('pinball-show-fps',value?'on':'off');}catch{}},
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
leaveDialog.onclose=()=>{if(!leaveDialog.open&&suspendedGameState===null)game.paused=leaveWasPaused;};
$('continueGame').onclick=()=>leaveDialog.close();
$('leaveGame').onclick=()=>{leaveDialog.close();if(window.AppControls?.exitGame)window.AppControls.exitGame();else location.href=new URL('../res/main.html',location.href).href;};
function topHit(a,x,y){if(!a||a.hidden||!controls.art)return false;const angle=-a.angle*Math.PI/180,dx=x-a.x,dy=y-a.y-(topItems.has(a)?topOffset():0);return Math.abs(dx*Math.cos(angle)-dy*Math.sin(angle))<=a.width/2&&Math.abs(dx*Math.sin(angle)+dy*Math.cos(angle))<=a.height/2;}


const spaceNeon=SpaceNeonBorders.createRenderer(SpaceNeonBorders.entries(G.art_layout_objects||[],G.art_layout_templates));
addEventListener('pagehide',()=>spaceNeon.destroy(),{once:true});
function bonusArt(plane){const producer=artRenderer.drawTable?.producer;if(controls.art&&producer?.enabled&&plane===producer.plane)producer.draw(ctx,artRenderer);}
const activeBallLayers=new Set();
const ballsByPlane=new Map(['lower','upper','top'].map(plane=>[plane,[]]));
function prepareDrawBalls(){
 activeBallLayers.clear(); for(const balls of ballsByPlane.values())balls.length=0;
 for(const b of game.balls){
  if(b.state==='drained')continue;
  const track=b.state==='guided'?game.guidedTracks.find(t=>t.id===b.track.id):null;
  if(b.state!=='drained')activeBallLayers.add(b.state==='guided'?(track?.layer||'lower'):b.layer);
  if(b.layer==='right_upper')continue;
  const plane=track?(track.layer==='tavern'?'upper':track.layer||'lower'):game.visualPlane(b);
  ballsByPlane.get(plane)?.push(b);
 }
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
function canvasTheaterBounds(){return {x:0,...PlayFrame.theaterBounds(view[1])};}
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
 theater.invalidateViewport();
 canvas.style.width=w+'px';canvas.style.height=h+'px';canvasLayers?.resize();if(effectsGL)effectsGL.layoutDirty=true;requestAnimationFrame(()=>draw());
 if(artworkSizeChanged&&window.viewAPI)preparePlayGraphics().catch(console.error);
}
new ResizeObserver(resize).observe($('playLayout').parentElement);new ResizeObserver(resize).observe(canvas.parentElement);
let previous=performance.now(),accumulator=0,noticeUntil=0;
const notice=text=>{controls.notice?.(text);noticeUntil=game.time+2};
let floatingRewards=[];
let screenDimAlpha=0,screenDimTime=null,screenDimAnchor=null,screenDimDrawn=false;
function updateScreenDimEvent(e){if(['new-game','drain','ball-saved','ready','game-over'].includes(e.type)){screenDimAlpha=0;screenDimTime=null;screenDimAnchor=null;}}
function updateScreenDim(){
 if(controls.screenMask===false){screenDimAlpha=0;screenDimTime=theaterCanvas.clock/1000;screenDimAnchor=null;screenDimDrawn=false;artRenderer.beforeDraw=null;return;}
 const effect=controls.art?maskCandidates.find(o=>IndicatorLights.maskActive(o,game)):null;
 // Theater attacks freeze physics; their shade must keep fading with the animation.
 const now=theaterCanvas.clock/1000,dt=screenDimTime===null?0:Math.max(0,now-screenDimTime);screenDimTime=now;
 screenDimAlpha=effect?Math.min(.2,screenDimAlpha+dt*.2/.4):Math.max(0,screenDimAlpha-dt*.2/.6);
 if(effect)screenDimAnchor=effect;
 screenDimDrawn=false;
 artRenderer.beforeDraw=!layeredRenderingEnabled&&screenDimAlpha>0?drawScreenDim:null;
}
function drawScreenDim(ctx,o){
 if(screenDimDrawn||screenDimAlpha<=0||o!==screenDimAnchor)return;
 screenDimDrawn=true;
 ctx.save();
 const scale=canvas.width/view[2];ctx.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);
 ctx.globalAlpha=1;ctx.fillStyle=`rgba(0,0,0,${screenDimAlpha})`;ctx.fillRect(...view);ctx.restore();
};
function showFloatingReward(position,text,ballIcon=false,delay=0){
 if(!position)return;
 floatingRewards.push({position:[...position],text,ballIcon,start:game.time+delay});
 if(floatingRewards.length>24)releaseFloatingReward(floatingRewards.shift());
}
function releaseFloatingReward(reward){if(reward.raster)PinballArt.releaseRaster(reward.raster);reward.raster=null;}
function resetFloatingRewards(){for(const reward of floatingRewards)releaseFloatingReward(reward);floatingRewards.length=0;}
function pruneFloatingRewards(){let live=0;for(const reward of floatingRewards)if(game.time-reward.start<1.3)floatingRewards[live++]=reward;else releaseFloatingReward(reward);floatingRewards.length=live;}
let rewardMeasure=null;
function prepareFloatingRewards(scale){
 pruneFloatingRewards();
 for(const reward of floatingRewards){
  reward.bounds=null;const age=game.time-reward.start;if(age<0)continue;
  const icon=!!(reward.ballIcon&&topBallImage.complete&&topBallImage.naturalWidth),text=String(reward.ballIcon&&!icon?PinballI18n.t('table.oneBall'):reward.text),key=[scale,text,icon,icon?topBallImage.src:''].join('|');
  if(reward.raster?.key!==key){
   releaseFloatingReward(reward);
   if(!rewardMeasure){const c=document.createElement('canvas');c.width=c.height=1;rewardMeasure=c.getContext('2d');}
   rewardMeasure.font='bold 12px system-ui, sans-serif';rewardMeasure.textBaseline='middle';rewardMeasure.textAlign='center';
   const m=rewardMeasure.measureText(text),tx=icon?2:0,left=Math.floor(Math.min(tx-(m.actualBoundingBoxLeft??m.width/2)-3,icon?-24:Infinity)*scale),top=Math.floor(Math.min(-(m.actualBoundingBoxAscent??8)-3,icon?-7:Infinity)*scale),right=Math.ceil(Math.max(tx+(m.actualBoundingBoxRight??m.width/2)+3,icon?-10:-Infinity)*scale),bottom=Math.ceil(Math.max((m.actualBoundingBoxDescent??8)+3,icon?7:-Infinity)*scale),width=Math.max(1,right-left),height=Math.max(1,bottom-top),canvas=PinballArt.rasterCanvas(width,height,artRenderer.bitmapCacheEnabled),c=canvas.getContext('2d');
   c.setTransform(scale,0,0,scale,-left,-top);c.font=rewardMeasure.font;c.textBaseline='middle';c.textAlign='center';c.lineWidth=3;c.strokeStyle='#1e1309';c.fillStyle='#fff2af';
   if(icon)drawRuntimeImage(c,topBallImage,-24,-7,14,14);c.strokeText(text,tx,0);c.fillText(text,tx,0);
   reward.raster={key,canvas:PinballArt.rasterImage(canvas),left,top,width,height};
  }
  const r=reward.raster;reward.px=Math.round((reward.position[0]-view[0])*scale+r.left);reward.py=Math.round((reward.position[1]-9-age*15-view[1])*scale+r.top);reward.bounds=[view[0]+reward.px/scale,view[1]+reward.py/scale,view[0]+(reward.px+r.width)/scale,view[1]+(reward.py+r.height)/scale];
 }
}
addEventListener('pagehide',resetFloatingRewards,{once:true});
function drawFloatingRewards(){
 if(layeredRenderingEnabled){ctx.save();ctx.setTransform(1,0,0,1,0,0);for(const reward of floatingRewards)if(reward.bounds){ctx.globalAlpha=Math.min(1,(1.3-(game.time-reward.start))/.35);ctx.drawImage(reward.raster.canvas,reward.px,reward.py);}ctx.restore();return;}
 pruneFloatingRewards();
 for(const reward of floatingRewards){
  const age=game.time-reward.start;if(age<0)continue;
  const [x,y]=reward.position;
  ctx.save();ctx.globalAlpha=Math.min(1,(1.3-age)/.35);ctx.translate(x,y-9-age*15);
  ctx.font='bold 12px system-ui, sans-serif';ctx.textBaseline='middle';ctx.textAlign='center';
  ctx.lineWidth=3;ctx.strokeStyle='#1e1309';ctx.fillStyle='#fff2af';
  if(reward.ballIcon&&topBallImage.complete&&topBallImage.naturalWidth){drawRuntimeImage(ctx,topBallImage,-24,-7,14,14);ctx.strokeText(reward.text,2,0);ctx.fillText(reward.text,2,0);}
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
 gameOverOverlay=PirateMap.showGameOver(document,game.score,rows,id,()=>{gameOverOverlay=null;reset();},PinballI18n.t('common.restart'),()=>{gameOverOverlay=null;if(window.AppControls?.exitGame)window.AppControls.exitGame();else location.href=new URL('../res/main.html',location.href).href;});
}
game.onEvent=e=>{drawRequested=true;if(window.viewAPI&&(e.type==='new-game'||e.type==='ready'&&!artRenderer.rebindDrawTable(game)))preparePlayGraphics().catch(console.error);if(e.type==='ready'&&bossStage)game.enemyActive=!theater.bossDefeated;window.PinballHaptics?.onEvent(e,game);bossPresentation?.onEvent(e);artRenderer.onEvent?.(e);firstPlayGuide?.onEvent(e);updateScreenDimEvent(e);if(e.type==='new-game')resetFloatingRewards();if((e.type==='score'||e.type==='target-bonus')&&e.points>0)showFloatingReward(e.position,'+'+e.points);if(e.type==='extra-life-awarded')showFloatingReward(e.position||game.ball.p,'+1',true);if(e.type==='launch'){ballStartedAt=game.time;ballElapsed=0;soundBank.play('explosion');}if(e.type==='drain'&&ballStartedAt!==null){ballElapsed=game.time-ballStartedAt;ballStartedAt=null;}if(e.type==='new-game'){ballStartedAt=null;ballElapsed=0;}if(e.type==='ball-saved')notice(PinballI18n.t('table.ballSaved'));if(e.type==='ball-save-ready'){launchStartedAt=null;notice(PinballI18n.t('table.relaunch'));}if(e.type==='sound'&&e.name!=='runic-spin')soundBank.play(e.name);if(e.type==='release'||e.type==='kickback')soundBank.play('explosion');if(e.type==='new-game'||e.type==='ready')soundBank.stop();theater.onEvent(e);if(e.type==='enemy-spawn-requested'){launchStartedAt=null;game.input.launch=false;game.charge=game.chargeElapsed=0;notice(PinballI18n.t('table.enemyWait'));window.dispatchEvent(new CustomEvent('pinball:enemy-spawn',{detail:e}));}if(e.type==='extra-life-awarded')notice(PinballI18n.t('table.extraBall',{source:e.source==='multiball'?'Multiball':e.source==='boss-target'?'Boss target':PinballI18n.t('table.vortex')}));if(e.type==='vortex-activated')notice(PinballI18n.t('table.vortexActive'));if(e.type==='target-bonus')notice(PinballI18n.t('table.targetBonus'));if(e.type==='bumper-upgraded')notice(PinballI18n.t('table.bumperLevel',{level:e.level}));if(e.type==='center-post-up')notice(PinballI18n.t('table.postUp'));if(e.type==='multiball-awarded')notice(PinballI18n.t('table.multiball'));if(e.type==='free-ball-launch')notice(PinballI18n.t('table.multiballLaunch'));if(e.type==='kickback-lane')notice(e.side==='left'?PinballI18n.t('table.kickLeft'):PinballI18n.t('table.kickRight'));if(e.type==='capture'){if(spaceTheme)soundBank.play('space-magic');notice(PinballI18n.t('table.capture'));}if(e.type==='release')notice(PinballI18n.t('table.release'));if(e.type==='drain')notice(PinballI18n.t('table.drain'));if(e.type==='ready')notice(PinballI18n.t('table.launchShort'));if(e.type==='game-over')endGame();if(e.type==='layer')notice(e.to==='top'?PinballI18n.t('table.enterTop'):e.to!=='lower'?PinballI18n.t('table.enterMiddle'):PinballI18n.t('table.enterLower'));if(e.type==='target-group-complete')notice(game.targetGroups.find(g=>g.id===e.id)?.targets.length===1?PinballI18n.t('table.singleTarget'):PinballI18n.t('table.targetSet'));};
theater.game=game;
function startBoss(){
 if(!Number.isInteger(bossStage)||bossStage<1||bossStage>8)return;
 game.enemyActive=true;
 theater.onEvent({type:'enemy-spawn-requested',eventId:bossStage});
 notice(PinballI18n.t('table.enemyWait'));
}
if(bossStage&&(!tutorialMode||['steampunk','space','norse','touhou1','touhou2'].includes(PLAYTEST_THEME)))startBoss();
function path(points,fill,stroke,width=1,closed=false){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));if(closed)ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function circle(p,r,fill,stroke){ctx.beginPath();ctx.arc(...p,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke()}}
const reboundEffects=createReboundEffects(game,soundBank);
const impactPresentation=createImpactPresentation(game,artLayers,artRenderer,{ballsLast:layeredRenderingEnabled,collisionRingsHandled:true});
theater.onSound=name=>impactPresentation.onTheaterSound(name);
const trackOverlay=GuidedTrackGeometry.outlines([...(G.guided_tracks||[]),...(G.visual_tracks||[])]);const trackLayout=new Map([...trackOverlay].map(([id,t])=>[id,{...t,showAboveArt:true}]));
const trackRenderer=GuidedTrackGeometry.createRenderer(trackOverlay);
function withLayoutLayer(layer,draw,active=null){
 active??=game.balls.some(b=>b.state!=='drained'&&(b.state==='guided'?(game.guidedTracks.find(t=>t.id===b.track?.id)?.layer||'lower'):b.layer)===layer);
 ctx.save();ctx.globalAlpha=active?1:.5;draw();ctx.restore();
}
let frameArtRevision=-1,frameArtPlanes=[];
function prepareFrameArt(){
 if(frameArtRevision!==artRenderer.layoutRevision){
  frameArtPlanes=PinballArt.planes.map(plane=>({plane,items:artRenderer.observeLayout(topLayers.filter(o=>o.plane===plane))})).filter(group=>group.items.length);
  frameArtRevision=artRenderer.layoutRevision;
 }
}
function drawFrameArt(offset){
 prepareFrameArt();
 ctx.save();ctx.translate(0,offset);for(const {plane,items} of frameArtPlanes)artRenderer.draw(ctx,items,plane,game);ctx.restore();
}
function bonusVisualTime(){const b=game.bonus;return b&&(b.active||['open','count','spin','winflash'].includes(b.phase)||b.attackAge<b.config?.attackArt?.duration||b.clock-b.releaseAt<.8)?b.clock:null;}
function scoreCaptionStyle(c){c.textAlign='center';c.textBaseline='middle';c.fillStyle='#ffe6a3';c.shadowColor='#201209';c.shadowBlur=4;c.font='bold 15px monospace';}
function prepareScoreGraphics(){const c=document.createElement('canvas'),brush=c.getContext('2d'),scale=canvas.width/view[2];brush.setTransform(scale,0,0,scale,0,0);brush.rotate(topArt.angle*Math.PI/180);scoreCaptionStyle(brush);theater.prepareScoreShadows(brush);c.width=c.height=0;}
function paintScore(frameOffset){
 if(theater.customScore){ctx.save();ctx.translate(topArt.x,topArt.y+frameOffset);ctx.rotate(topArt.angle*Math.PI/180);scoreCaptionStyle(ctx);if(bossStage)theater.drawAttackMessage(ctx,topArt.width*(118/370-.5),topArt.height*(54/124-.5),topArt.width*134/370,topArt.height*18/124,game.time);else theater.drawScoreText(ctx,String(game.score).padStart(12,'0'),topArt.width*.48);
  const reserve=reservePreview|| (game.gameOver?0:Math.max(0,Math.min(99,4-game.ballNumber-(game.lifeLaunched?1:0)+(game.extraLives||0))));
  const counterX=topArt.width*(.159-.5),counterY=topArt.height*.014,counterW=topArt.width*.16,counterH=topArt.width*.047;
  ctx.shadowBlur=0;
  if(reserve<=3){
   const slotSpacing=topArt.width*30/594;
   if(reserve&&ballImages.sprites){
    drawReserveBallIcons(reserve,counterX,counterY,slotSpacing);
   }
  }else{
   ctx.fillStyle='#080808';ctx.fillRect(counterX-counterW/2,counterY-counterH/2,counterW,counterH);
   ctx.font='bold '+(topArt.width*.028)+'px monospace';ctx.fillStyle='#ffe6a3';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('BALL '+reserve,counterX,counterY,counterW*.94);
  }
  ctx.restore();}else theater.paintScorePanel(ctx,game,view[1]);
}
let scoreTextWidth=null;
function scoreDamage(frameOffset,scoreHeight){
 if(!theater.customScore||bossStage)return [[view[0],view[1],view[0]+view[2],view[1]+scoreHeight*view[2]/canvas.width]];
 if(scoreTextWidth===null){gameContext.save();gameContext.font='bold 15px monospace';scoreTextWidth=gameContext.measureText('000000000000').width;gameContext.restore();}
 const a=topArt.angle*Math.PI/180,c=Math.cos(a),s=Math.sin(a),textWidth=Math.min(topArt.width*.48,scoreTextWidth*Math.max(12,String(game.score).length)/12),hud=(ballImages.hudSize||0)*view[2]/canvas.width,counterX=topArt.width*(.159-.5),counterY=topArt.height*.014,halfW=Math.max(topArt.width*.08,topArt.width*30/594+hud/2)+2,halfH=Math.max(topArt.width*.047/2,hud/2)+2;
 return [[0,0,textWidth/2+8,16],[counterX,counterY,halfW,halfH]].map(([x,y,w,h])=>{const cx=topArt.x+x*c-y*s,cy=topArt.y+frameOffset+x*s+y*c,rx=Math.abs(c)*w+Math.abs(s)*h,ry=Math.abs(s)*w+Math.abs(c)*h;return [cx-rx,cy-ry,cx+rx,cy+ry];});
}
let sceneUnitsKey=null,sceneUnits=[],sceneTable=null,sceneEpoch=0,bossWasActive=false;
function sceneArtObject(command){
 if(!artRenderer.poseItem)return command.art;
 const poses=artRenderer.frameArtPoses;if(poses?.has(command))return poses.get(command);
 const o=artRenderer.poseItem(command.art,game);poses?.set(command,o);return o;
}
function sceneBonusKey(){const b=game.bonus;return b?.visualKey?.()??(b?[bonusVisualTime(),b.phase,b.count,b.index,b.winner,b.cycleBoss,b.phase==='idle'&&game.ball.state==='ready'?game.time:0].join('|'):'');}

function sceneArtState(command){
 const o=sceneArtObject(command),states=artRenderer.frameArtStates;
 if(states?.has(o))return states.get(o);
 const state=command.kind==='static'?command.baseState:artRenderer.map.artState(o,game,artRenderer,command);states?.set(o,state);return state;
}
function sceneArtKey(command){
 const keys=artRenderer.frameArtKeys;if(keys?.has(command))return keys.get(command);
 const o=sceneArtObject(command),state=sceneArtState(command);
 const hit=!!command.targetId&&game.targetHits.has(command.targetId);
 const finite=command.scenePreparedStates?.key?.(hit?null:state);if(finite!==undefined){command.transient=!hit&&!!(state?.glow&&o.indicator?.glow?.pulse||state?.active&&o.frames>1);keys?.set(command,finite);return finite;}
 if(hit){const key='target-hidden|'+command.targetId;command.transient=false;keys?.set(command,key);return key;}
 const flag=game.flagHitAt?.get(o.bind),flagAge=flag===undefined?0:game.time-flag;
 const motion=o.animation?.enabled?ArtAnimation.offset(o,game):null,motionX=motion?motion[0]:0,motionY=motion?motion[1]:0,flip=o.animation?.enabled&&o.animation.effect==='flip'?ArtAnimation.flipScale(o,game):1;
 const vortex=o.state==='vortex'&&state?.active&&game.vortexActivatedAt!=null?Math.min(15,Math.max(0,game.time-game.vortexActivatedAt)):0;
 const continuous=!artRenderer.poseItem&&o.dynamicPose||o.state==='guide-arrow';
 command.transient=!!(motionX||motionY||flip!==1||flag!==undefined&&flagAge>=0&&flagAge<1.2||o.state==='plunger'&&(game.charge>0||game.time-game.plungerReleasedAt>=0&&game.time-game.plungerReleasedAt<.08)||vortex>0&&vortex<15||continuous||o.dynamicPose&&(o.motionActive??true)||state?.alpha>0&&state.alpha<1||state?.glow&&o.indicator?.glow?.pulse||state?.active&&o.frames>1);
 // Both comparison buffers are established during loading and reused per pose.
 const previous=command.sceneKeyParts,parts=command.sceneNextParts||(command.sceneNextParts=new Array(23));
 parts[0]=command.sceneImageIds?.[state?.src]??state?.src;parts[1]=command.sceneImageIds?.[state?.baseSrc]??state?.baseSrc;parts[2]=state?.frame;parts[3]=state?.alpha;parts[4]=state?.glow?.alpha;
 parts[5]=hit;parts[6]=command.flipper?.angle;parts[7]=flag!==undefined;parts[8]=flagAge>=0&&flagAge<1.2?flagAge:0;
 parts[9]=o.state==='plunger'?game.charge:0;parts[10]=o.state==='plunger'?game.balls.some(b=>b.state==='ready'):false;parts[11]=o.state==='plunger'&&game.time-game.plungerReleasedAt<.08?game.time:0;
 parts[12]=motionX;parts[13]=motionY;parts[14]=flip;parts[15]=vortex;parts[16]=continuous?game.time:0;
 parts[17]=o.x;parts[18]=o.y;parts[19]=o.angle;parts[20]=o.opacity;parts[21]=o.hidden;parts[22]=command.kind==='producer'?sceneBonusKey():'';
 let same=!!previous;if(same)for(let i=0;i<parts.length;i++)if(parts[i]!==previous[i]){same=false;break;}
 const key=same?command.sceneKey:parts.join('|');command.sceneNextParts=previous||new Array(23);command.sceneKeyParts=parts;command.sceneKey=key;keys?.set(command,key);return key;
}
function sceneArtGroupKey(commands){
 const previous=[];let revision=0;
 return ()=>{let changed=previous.length!==commands.length;for(let i=0;i<commands.length;i++){const next=sceneArtKey(commands[i]);if(next!==previous[i]){previous[i]=next;changed=true;}}previous.length=commands.length;if(changed)revision++;return revision;};
}
function prepareSceneArtKeys(command){
 if(command.scenePreparedStates!==undefined)return command.scenePreparedStates;
 command.sceneImageIds=Object.create(null);for(const [src,image] of Object.entries(command.images||{}))command.sceneImageIds[src]=artRenderer.imageKey(image);
 command.scenePreparedStates=false;const o=command.art;
 if(command.kind==='producer'||command.flipper||o.animation?.enabled||o.dynamicPose||o.indicator?.fade?.enabled||!['static','target','return-gate','center-post'].includes(o.state||'static')||[...game.g.lower,...game.g.upper_parts,...(game.g.top_parts||[])].some(shape=>shape.id===o.bind&&shape.kind==='flag'))return false;
 const names=['x','y','width','height','angle','opacity','hidden','flipX','flipY'],initial=names.map(name=>o[name]),crop=o.crop?.slice();
 const tracked=!artRenderer.poseItem&&artRenderer.observedArt?.has(o),layoutRevision=artRenderer.layoutRevision;
 const colors=[...new Set([o.indicator?.glow?.on,o.indicator?.glow?.complete,o.indicator?.glow?.preview?.color].filter(Boolean))],states=[null,...[...artRenderer.drawSources(o)].flatMap(src=>{const state={src,baseSrc:src,frame:0,alpha:1};return [state,...colors.map(color=>({...state,glow:{color,alpha:1}}))];})];if(states.length>128)return false;
 const bySource=new Map();let last;
 for(let id=1;id<states.length;id++){const state=states[id],entry={id,src:state.src,base:state.baseSrc,frame:state.frame,alpha:state.alpha,color:state.glow?.color,glow:state.glow?.alpha};if(!bySource.has(entry.src))bySource.set(entry.src,[]);bySource.get(entry.src).push(entry);}
 const key=state=>{
  if(tracked){if(artRenderer.layoutRevision!==layoutRevision)return undefined;}else{
   const a=sceneArtObject(command);for(let i=0;i<names.length;i++)if(a[names[i]]!==initial[i])return undefined;
   if(crop?!a.crop||crop.length!==a.crop.length:!!a.crop)return undefined;if(crop)for(let i=0;i<crop.length;i++)if(crop[i]!==a.crop[i])return undefined;
  }
  if(!state)return 0;
  const src=state.src,base=state.baseSrc,frame=state.frame||0,alpha=state.alpha??1,color=state.glow?.alpha>0?state.glow.color:undefined,glow=state.glow?.alpha>0?state.glow.alpha:undefined;
  if(last&&last.src===src&&last.base===base&&last.frame===frame&&last.alpha===alpha&&last.color===color&&last.glow===glow)return last.id;
  for(const entry of bySource.get(src)||[])if(entry.base===base&&entry.frame===frame&&entry.alpha===alpha&&entry.color===color&&entry.glow===glow){last=entry;return entry.id;}
  return undefined;
 };
 return command.scenePreparedStates={states,key};
}

function sceneArtBounds(command){
 const o=sceneArtObject(command);if(o.motionBounds)return o.motionBounds;
 if(command.bounds)return command.bounds;
 if(o.dynamicPose)return null;
 if(o.state==='plunger'&&o.bind==='plunger'){const p=game.g.plunger,a=o.angle*Math.PI/180,c=Math.cos(a),t=Math.sin(a),x=p.x-t*o.height/2,y=p.rest_y+c*o.height/2,w=(Math.abs(c)*o.width+Math.abs(t)*o.height)/2+4,h=(Math.abs(t)*o.width+Math.abs(c)*o.height)/2+4;return [x-w,y-h,x+w,y+h+p.stroke];}
 const radius=Math.hypot(o.width,o.height)/2+12+(o.indicator?.halo?Math.max(o.width,o.height)/2:0),center=o.state==='vortex'&&command.vortexCenter?command.vortexCenter:[o.x,o.y],offset=Math.hypot(o.x-center[0],o.y-center[1]);return [center[0]-radius-offset,center[1]-radius-offset,center[0]+radius+offset,center[1]+radius+offset];
}
function sceneFlipperBounds(command){
 const o=sceneArtObject(command),f=command.flipper,angle=f.angle-f.rest,co=Math.cos(angle),si=Math.sin(angle),dx=o.x-f.pivot[0],dy=o.y-f.pivot[1],x=f.pivot[0]+dx*co-dy*si,y=f.pivot[1]+dx*si+dy*co,a=(o.angle||0)*Math.PI/180+angle,c=Math.abs(Math.cos(a)),t=Math.abs(Math.sin(a)),pad=2*view[2]/canvas.width,w=(c*o.width+t*o.height)/2+pad,h=(t*o.width+c*o.height)/2+pad;
 return [x-w,y-h,x+w,y+h];
}
function authoredBallMaskPlanes(art,plane,index,marker){
 if(art.ignoreBallMask===true)return [];
 const planes=['lower','upper','top'],affected=planes.filter(ballPlane=>plane==='foreground'||planes.indexOf(plane)>planes.indexOf(ballPlane)||plane===ballPlane&&(marker<0||index>marker));
 if(theater.theme==='touhou1'||theater.theme==='touhou2')return affected.includes('lower')?['lower']:[];
 // The right ramp's terrain is authored before the lower ball marker, but
 // its opaque rocks still cover balls underneath; its open pixels stay open.
 if(theater.theme==='pirate'&&/\/pirate-lower-right-terrain(?:\.runtime)?\.(?:png|webp)$/.test(art.src)&&!affected.includes('lower'))affected.push('lower');
 return affected;
}
function prepareAuthoredBallMasks(key){
 if(ballMasks.revision===key){ballMasks.update();return;}
 const planes=['lower','upper','top'],plans=new Map(planes.map(plane=>[plane,[]])),sources=[];
 for(const plane of [...planes,'foreground']){
  const items=artLayers.filter(o=>o.plane===plane),marker=items.findIndex(o=>o.state==='ball-layer');
  for(let i=0;i<items.length;i++){
   const o=items[i];if(o.hidden||o.state==='ball-layer')continue;
   const command=artRenderer.drawTable.bySource.get(o);if(!command)continue;prepareSceneArtKeys(command);
   const affected=authoredBallMaskPlanes(o,plane,i,marker);
   if(!affected.length)continue;
   const source={art:o,fixed:command.kind==='static',planes:affected,key:()=>sceneArtKey(command),bounds:()=>sceneArtBounds(command)||[view[0],view[1],view[0]+view[2],view[1]+view[3]]};
   const drawItems=[o];artRenderer.observedArt.add(drawItems);
   source.paint=(c,plungerPull=null,maskState=undefined)=>{if(!controls.art)return;const brightness=artRenderer.brightness;artRenderer.brightness=.82;try{drawItems[0]=sceneArtObject(command);if(command.kind==='producer')artRenderer.drawTable.producer.draw(c,drawItems[0],artRenderer);else artRenderer.drawUncached(c,drawItems,o.plane,game,maskState===undefined?null:new Map([[drawItems[0],maskState]]),plungerPull!==null||maskState!==undefined?{plungerPull,targetVisible:maskState!==undefined}:null);}finally{artRenderer.brightness=brightness;}};
   // Stable interactive pictures have finite silhouettes. Prepare every image
   // and the hidden state before play, using the actual renderer and no events.
   const prepared=prepareSceneArtKeys(command);
   if(!source.fixed&&prepared){
    const stateKey=state=>{const a=sceneArtObject(command);return JSON.stringify(['picture',state?[state.src,state.baseSrc,state.frame||0,state.alpha??1,state.glow?.alpha>0?[state.glow.color,state.glow.alpha]:null]:null,a.x,a.y,a.width,a.height,a.angle,a.opacity,a.hidden]);};
    const states=prepared.states,bounds=source.bounds(),scale=canvas.width/view[2],bytes=Math.ceil(Math.max(0,Math.min(canvas.width,Math.ceil((bounds[2]-view[0])*scale))-Math.max(0,Math.floor((bounds[0]-view[0])*scale)))*Math.max(0,Math.min(canvas.height,Math.ceil((bounds[3]-view[1])*scale))-Math.max(0,Math.floor((bounds[1]-view[1])*scale)))/8);
    if(states.length*bytes<=1024*1024){
     source.key=()=>{const state=command.targetId&&game.targetHits.has(command.targetId)?null:sceneArtState(command);return prepared.key(state)??stateKey(state);};
     source.maskVariants=states.map((state,id)=>({key:id,paint:c=>source.paint(c,null,state)}));
    }
   }
   if(o.state==='plunger'&&o.bind==='plunger'&&!o.angle&&!o.flipX&&!o.flipY&&!o.indicator&&!o.animation?.enabled&&!o.dynamicPose){
    // Native-pixel rod silhouettes are finite: prepare them without ticking
    // the real game or generating sensor, collision or scoring events.
    const scale=canvas.width/view[2],s=Math.fround(scale),f=Math.fround(-view[1]*scale),p=game.g.plunger,bounds=source.bounds(),tileY=Math.max(0,Math.floor((bounds[1]-view[1])*scale));
    const maskKey=g=>{const age=g.time-g.plungerReleasedAt,pull=g.balls.some(b=>b.state==='ready')?g.charge:age>=0&&age<.08?g.plungerReleaseCharge*(1-age/.08)**2:0,y=p.rest_y+p.stroke*pull+o.height/2;return Math.round(Math.fround(s*y+f)-s*o.height/2);};
    const steps=Math.max(1,Math.ceil(Math.abs(p.stroke)*scale*4)),bytes=Math.ceil(Math.max(0,Math.min(canvas.width,Math.ceil((bounds[2]-view[0])*scale))-Math.max(0,Math.floor((bounds[0]-view[0])*scale)))*Math.max(0,Math.min(canvas.height,Math.ceil((bounds[3]-view[1])*scale))-tileY)/8),variants=new Map();
    if(steps<=512){for(let i=0;i<=steps;i++){const pull=i/steps,key=maskKey({time:game.time,balls:[{state:'ready'}],charge:pull});if(!variants.has(key))variants.set(key,{key,paint:c=>source.paint(c,pull)});}
     if(variants.size<=128&&variants.size*bytes<=1024*1024){source.key=()=>maskKey(game);source.maskVariants=[...variants.values()];}
    }
   }
   for(const ballPlane of affected)plans.get(ballPlane).push(source);
   sources.push(source);
  }
 }
 ballMasks.prepare(key,canvas.width,canvas.height,view,(c,plane,region=null,staticOnly=false)=>{
  if(!controls.art)return;const brightness=artRenderer.brightness;artRenderer.brightness=.82;
  try{for(const source of plans.get(plane)){if(staticOnly&&!source.fixed)continue;const b=source.previousBounds;if(region&&b&&(b[2]<=region[0]||region[2]<=b[0]||b[3]<=region[1]||region[3]<=b[1]))continue;source.paint(c);}}finally{artRenderer.brightness=brightness;}
 },sources);
}
// Finite, stationary source states only. The scene cache renders comparisons
// with its exact native origin during loading, before any game input is enabled.
function sceneDiffSources(commands,plane){
 const sources=[];
 for(const command of commands){
  const o=command.art;
  if(command.flipper||command.kind==='producer'||o.animation?.enabled||o.dynamicPose||o.indicator?.glow||o.indicator?.halo||o.indicator?.fade?.enabled||(o.frames||1)>1||o.blendMode&&o.blendMode!=='source-over'||!['static','target','return-gate','center-post'].includes(o.state||'static')||[...game.g.lower,...game.g.upper_parts,...(game.g.top_parts||[])].some(s=>s.id===o.bind&&s.kind==='flag'))return null;
  const prepared=prepareSceneArtKeys(command);if(!prepared||prepared.states.length>8)return null;
  sources.push({key:()=>prepared.key(command.targetId&&game.targetHits.has(command.targetId)?null:sceneArtState(command))??null,variants:prepared.states.map((state,id)=>({key:id,hidden:state===null,paint:c=>{if(!controls.art)return;const a=sceneArtObject(command),brightness=artRenderer.brightness;artRenderer.brightness=.82;try{artRenderer.drawUncached(c,[a],plane,game,new Map([[a,state]]),{targetVisible:true});}finally{artRenderer.brightness=brightness;}}}))});
 }
 return sources;
}
function prepareSceneUnits(key){
 if(sceneUnitsKey===key)return sceneUnits;
 sceneUnitsKey=key;sceneUnits=[];
 const paint=fn=>c=>{const previous=ctx;ctx=c;try{fn();}finally{ctx=previous;}};
 const postCountKey=posts=>{let map=game.configuredPosts,states=posts;return()=>{if(map!==game.configuredPosts){map=game.configuredPosts;states=posts.map(post=>map.get(post.id));}return states.map(post=>[post.raised,post.left].join(':')).join('|');};};
 const addBonus=plane=>{const producer=artRenderer.drawTable?.producer;if(producer?.enabled&&producer.plane===plane){const o=producer.controller.geometry,r=producer.controller.config.radius||o.r||68,x=o.cx??o.x,y=o.cy??o.y;sceneUnits.push({fixed:false,moving:true,cacheWhenIdle:true,isTransient:()=>bonusVisualTime()!==null,bounds:[x-r-8,y-r-8,x+r+8,y+r+8],key:sceneBonusKey,paint:paint(()=>bonusArt(plane))});}};
 const addArt=(plane,items)=>{
  for(const o of items){const command=artRenderer.drawTable.bySource.get(o);if(!command||o.hidden||o.state==='ball-layer')continue;prepareSceneArtKeys(command);
   if(controls.screenMask!==false&&o.indicator?.screenMask)sceneUnits.push({fixed:false,screenMask:true,key:()=>screenDimAnchor===o?screenDimAlpha:0,paint:paint(()=>{if(screenDimAnchor===o&&screenDimAlpha>0){ctx.fillStyle=`rgba(0,0,0,${screenDimAlpha})`;ctx.fillRect(...view);}})});
   const fixed=command.kind==='static',moving=!!(command.flipper||o.indicator?.glow||o.indicator?.halo||o.indicator?.fade?.enabled||o.animation?.enabled||sceneArtObject(command).dynamicPose||command.kind==='producer'||['flag','vortex','plunger','guide-arrow'].includes(o.state)),control=!fixed&&!moving&&(o.indicator?.group?JSON.stringify([plane,o.indicator.group,o.indicator.trigger,o.indicator.behavior]):null),last=sceneUnits.at(-1);
   if(control&&last?.control===control){last.items.push(o);last.commands.push(command);const b=sceneArtBounds(command);if(!b||!last.bounds)last.bounds=null;else last.bounds=[Math.min(last.bounds[0],b[0]),Math.min(last.bounds[1],b[1]),Math.max(last.bounds[2],b[2]),Math.max(last.bounds[3],b[3])];continue;}
   const u={fixed,control,plane,items:[o],commands:[command],bounds:sceneArtBounds(command),moving};
   u.diffSources=()=>sceneDiffSources(u.commands,plane);
   u.diffRasterOnly=()=>u.commands.some(c=>c.art.angle);
   u.directOrder=o.state==='plunger'&&o.bind==='plunger';
   u.cacheWhenIdle=u.moving&&!command.flipper;
   if(u.cacheWhenIdle)u.isTransient=()=>command.transient;
   u.key=control?sceneArtGroupKey(u.commands):()=>sceneArtKey(command);
   // Loading sees the full rotation bounds; retain that surface as poses shrink.
   if(command.flipper)u.cacheCapacity=()=>[u.w+4,u.h+4];
   if(command.flipper&&!o.animation?.enabled&&!o.indicator?.glow&&!o.indicator?.halo)u.prepare=()=>sceneCache.rect(u,sceneFlipperBounds(command));
   const drawItems=[];artRenderer.observedArt.add(drawItems);
   const drawArt=(c,keys=null)=>{if(!controls.art)return;const brightness=artRenderer.brightness;artRenderer.brightness=.82;try{if(command.kind==='producer')artRenderer.drawTable.producer.draw(c,o,artRenderer);else{drawItems.length=0;for(const item of u.commands)drawItems.push(sceneArtObject(item));const states=keys&&new Map(drawItems.map((item,i)=>{const key=keys[i];if(typeof key==='number')return [item,u.commands[i].scenePreparedStates.states[key]];const s=key==='hidden'?null:JSON.parse(key);return [item,s?{src:s[0],baseSrc:s[1],frame:s[2],alpha:s[3],glow:s[4]}:null];}));artRenderer.drawUncached(c,drawItems,plane,game,states,keys?{targetVisible:true}:null);}}finally{artRenderer.brightness=brightness;}};
   u.paint=c=>drawArt(c);u.paintState=(c,keys)=>drawArt(c,keys);sceneUnits.push(u);
  }
 };
 const addBalls=(plane,right=false)=>{
  const balls=()=>right?game.balls.filter(b=>b.layer==='right_upper'&&b.state!=='drained'):ballsByPlane.get(plane)||[];
  if(!right){
   const effects={fixed:false,effectPlane:plane,moving:true,effectsOnly:true,unmasked:true,directPaint:true};let boxes=[];
   effects.key=()=>{const version=reboundEffects.revision;boxes=game.webglEffectsActive?[]:reboundEffects.damageBounds(plane);return boxes.length?version:0;};
   effects.active=()=>boxes.length>0;effects.damageBounds=()=>boxes;
   effects.paint=paint(()=>{effects.skipSprite=!effects.active();if(!effects.skipSprite)reboundEffects.draw(ctx,plane);});sceneUnits.push(effects);
  }
  // Native gameplay caps multiball at three. Each slot owns its own small
  // damage bounds and masked/trail cache; visible balls share prepared skins.
  for(let slot=0;slot<3;slot++){
   const ball=()=>balls()[slot],trails=()=>{const b=ball();return !right&&b?impactPresentation.trailBounds(b):[];};
   const u={fixed:false,ballPlane:plane,moving:true,ballSlot:slot};u.active=()=>!!ball();
   u.cacheCapacity=()=>{const scale=canvas.width/view[2],half=Math.max(5*scale+2.5,...(ballImages.glowing||[]).map(s=>s.half+1)),side=Math.ceil(half*2+2);return [side,side];};
   u.directSprite=()=>{const b=ball();if(!b||!ballImages.sprites||trails().length)return null;const sprite=ballImages.glowing[impactPresentation.ballGlowLevel(b)],scale=canvas.width/view[2];return {image:sprite.canvas,x:u.x+Math.round(Math.fround(scale)*b.p[0]+Math.fround(-view[0]*scale-u.x)-sprite.half),y:u.y+Math.round(Math.fround(scale)*b.p[1]+Math.fround(-view[1]*scale-u.y)-sprite.half)};};
   u.prepare=()=>{const b=ball(),glowLevel=impactPresentation.ballGlowLevel(b),scale=canvas.width/view[2],sprite=ballImages.glowing?.[glowLevel],maskRadius=(sprite?sprite.half/scale:game.physics.ballRadius*(glowLevel?1.25+glowLevel/4*1.25:1))+1/scale,r=G.gameplay?.ballOutline===false?maskRadius:Math.max(maskRadius,5+2.5/scale);u.preparedBalls=b?[{ball:b,bounds:[b.p[0]-r,b.p[1]-r,b.p[0]+r,b.p[1]+r],maskBounds:[b.p[0]-maskRadius,b.p[1]-maskRadius,b.p[0]+maskRadius,b.p[1]+maskRadius]}]:[];};
   u.bounds=()=>{const boxes=[...(u.preparedBalls||[]).map(row=>row.bounds),...trails()];return boxes.length?[Math.min(...boxes.map(b=>b[0])),Math.min(...boxes.map(b=>b[1])),Math.max(...boxes.map(b=>b[2])),Math.max(...boxes.map(b=>b[3]))]:[0,0,1,1];};
   u.key=()=>{const b=ball();return b?JSON.stringify([b.p,b.state,b.layer,game.webglEffectsActive||game.g.gameplay?.ballTrails===false?null:b.trail,impactPresentation.ballGlowLevel(b)]):'empty';};
   u.paint=paint(()=>{const trail=trails().length>0;u.skipSprite=!trail;u.hiddenBalls=0;const b=ball();if(trail)impactPresentation.drawTrails(ctx,plane,b);for(const row of u.preparedBalls){if(row.visibility==='hidden'){u.hiddenBalls++;continue;}u.skipSprite=false;drawBall(row.ball);}});
   u.outline=paint(()=>{const b=ball();if(b)drawBallOutlines([b]);});sceneUnits.push(u);
  }
 };
 for(const id of theaterCanvas.retainedIds)sceneUnits.push({fixed:false,unmasked:true,separateCache:true,theaterActor:id,bounds:()=>theaterCanvas.drawRows.get(id)?.bounds||[0,0,0,0],key:()=>[theaterCanvas.drawRows.get(id)?.key||'hidden',theaterCanvas.stageClip?.key].join('|'),paint:paint(()=>theaterCanvas.paintPrepared(ctx,id))});
 sceneUnits.push({fixed:false,separateCache:true,theaterHearts:true,bounds:()=>theaterCanvas.heartBounds(canvasTheaterBounds()),key:()=>theaterCanvas.heartKey(),paint:paint(()=>theaterCanvas.paintHearts(ctx,canvasTheaterBounds()))});
 addArt('background',backgroundBelowBall);addBalls('background',true);addArt('background',backgroundAboveBall);
 addBonus('background');
 for(const plane of ['lower','upper','top']){
  if(controls.art&&SpaceNeonBorders.enabled(PLAYTEST_THEME,G.gameplay))sceneUnits.push({fixed:false,bounds:[0,-170.5,360,469.5],key:()=>spaceNeon.key(game,G.gameplay,plane),paint:paint(()=>spaceNeon.draw(ctx,game,G.gameplay,plane))});
  addBonus(plane);
  const plan=artDrawPlans.get(plane);if(!plan.hasBallMarker)addBalls(plane);
  let drawn=false;for(const batch of plan.batches){if(batch)addArt(plane,batch);else if(!drawn){addBalls(plane);drawn=true;}}
  sceneUnits.push({fixed:true,paint:paint(()=>trackRenderer.draw(ctx,plane))});
  const posts=[...(game.configuredPosts?.values()||[])].filter(p=>(p.layer==='tavern'?'upper':p.layer)===plane);
  if(posts.length&&!spaceTheme)sceneUnits.push({fixed:false,bounds:[Math.min(...posts.map(p=>p.center[0]-14)),Math.min(...posts.map(p=>p.center[1]-14)),Math.max(...posts.map(p=>p.center[0]+14)),Math.max(...posts.map(p=>p.center[1]+14))],key:postCountKey(posts),paint:paint(()=>ConfiguredMechanisms.drawPostCounts(game,ctx,plane))});
 }
 addArt('foreground',artByPlane.get('foreground'));
 if(spaceTheme)for(const plane of ['lower','upper','top']){const posts=[...(game.configuredPosts?.values()||[])].filter(p=>(p.layer==='tavern'?'upper':p.layer)===plane);if(posts.length)sceneUnits.push({fixed:false,bounds:[Math.min(...posts.map(p=>p.center[0]-14)),Math.min(...posts.map(p=>p.center[1]-14)),Math.max(...posts.map(p=>p.center[0]+14)),Math.max(...posts.map(p=>p.center[1]+14))],key:postCountKey(posts),paint:paint(()=>ConfiguredMechanisms.drawPostCounts(game,ctx,plane,'#000'))});}
 return sceneUnits;
}
function prepareSceneGraphics(){
 artRenderer.refreshDrawTable(game);if(sceneTable!==artRenderer.drawTable){sceneTable=artRenderer.drawTable;sceneEpoch++;}updateScreenDim();impactPresentation.update();
 artRenderer.frameArtKeys=new Map();artRenderer.frameArtStates=new Map();artRenderer.frameArtPoses=new Map();
 const attackArt=game.bonus?.config.attackArt,fullscreenBonus=controls.art&&attackArt?.fullscreen&&game.bonus.attackAge<attackArt.duration;
 const scale=canvas.width/view[2],baseKey=[sceneEpoch,canvasLayers.revision,artRenderer.layoutRevision,artRenderer.imageRevision,controls.art,controls.screenMask!==false,playAspect,...view].join('|'),backgroundKey=baseKey+'|'+theaterCanvas.staticKey();
 theaterCanvas.setView(canvasTheaterBounds(),scale);theaterCanvas.prepareState(canvasTheaterBounds(),view,scale);
 const frameOffset=controls.art&&playAspect!=='landscape'?topOffset():0;
 theater.customScore=playAspect!=='landscape'&&!!topArt&&!topArt.hidden&&controls.art;
 const mainContext=gameContext;
 const paintLayer=(name,key,paint)=>canvasLayers.paint(name,key,view,c=>{ctx=c;try{paint();}finally{ctx=mainContext;}});
 prepareDrawBalls();
 prepareAuthoredBallMasks(baseKey);
 const units=prepareSceneUnits(baseKey);
 const paintBackground=c=>{
  c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,canvas.width,canvas.height);c.fillStyle='#13242f';c.fillRect(0,0,canvas.width,canvas.height);c.restore();
  theaterCanvas.paintStatic(c,canvasTheaterBounds());
  /* Empty bounds means opaque; null means unknown. */
  canvasLayers.transparentBounds=[0,0,0,0];
 };
 sceneCache.prepare(baseKey,canvas.width,canvas.height,view,units,paintBackground,ballMasks,backgroundKey);
 const bounds=canvasTheaterBounds(),backgroundDamage=sceneCache.updateBackground(backgroundKey,paintBackground,[(bounds.x||0),bounds.y,(bounds.x||0)+bounds.width,bounds.y+bounds.height]);
 paintLayer('static',backgroundKey+'|'+frameOffset,()=>{ctx.save();ctx.setTransform(1,0,0,1,0,0);drawRuntimeImage(ctx,sceneCache.base,0,0);ctx.restore();if(controls.art&&playAspect!=='landscape')drawFrameArt(frameOffset);});
 theaterCanvas.prepareStageClip(baseKey,sceneCache.suffix,canvas.width,canvas.height,scale,view,c=>{const previous=ctx;ctx=c;try{if(controls.art&&playAspect!=='landscape')drawFrameArt(frameOffset);}finally{ctx=previous;}},canvasTheaterBounds());
 return {baseKey,backgroundKey,backgroundDamage,scale,frameOffset,mainContext,paintLayer,fullscreenBonus};
}
function draw(){
 if(!artworkReady){drawRequested=true;return;}
 drawRequested=false;drawnGameTime=game.time;drawnBonusClock=bonusVisualTime();drawnHudState=theater.hudState;drawnPaused=game.paused;drawnFrozen=game.theaterFrozen;
 const {baseKey,backgroundKey,backgroundDamage,scale,frameOffset,mainContext,paintLayer,fullscreenBonus}=prepareSceneGraphics();
 sceneCache.update();
 const retainedRegions=[...sceneCache.regions('retained'),...backgroundDamage];
 if(combinedCacheEnabled)canvasLayers.updateComposite(backgroundKey+'|'+sceneCache.retainedRevision,retainedRegions,c=>sceneCache.draw(c,{background:false,frequency:'retained',update:false,regions:retainedRegions}));
 else if(retainedCanvasEnabled)canvasLayers.updateInteractive(backgroundKey+'|'+sceneCache.retainedRevision,retainedRegions,c=>sceneCache.draw(c,{background:false,frequency:'retained',update:false,regions:retainedRegions}));
 if(combinedCacheEnabled||!retainedCanvasEnabled)sceneCache.changedMoving.push(...retainedRegions);
 const scoreHeight=theater.customScore?Math.ceil((topArt.y+frameOffset+topArt.height/2-view[1])*scale):Math.ceil(PlayFrame.theaterBounds(view[1]).scoreHeight*scale);
 canvasLayers.setScoreHeight(scoreHeight);let scoreChanged=false;
 const values=[baseKey,game.score,game.ballNumber,game.extraLives,game.lifeLaunched,game.gameOver,theater.hudState,bossStage?Math.floor(game.time)%2:0].join('|');
 scoreChanged=paintLayer('ui-values',values,()=>paintScore(frameOffset));
 prepareFloatingRewards(scale);
 impactPresentation.prepareHud(scale,view);
 const fx=impactPresentation.damage(),extra=fx.bounds.map(b=>[b[0]-4,b[1]-4,b[2]+4,b[3]+4]);
 for(const reward of floatingRewards)if(reward.bounds)extra.push(reward.bounds);
 if(scoreChanged)extra.push(...scoreDamage(frameOffset,scoreHeight));
 const theaterBounds=canvasTheaterBounds(),theaterDamage=theaterCanvas.prepare(theaterBounds),isolated=[...fx.isolated,...theaterDamage];
 if(theaterCanvas.warning||theaterCanvas.wasWarning){extra.push([view[0],view[1],view[0]+view[2],view[1]+view[3]]);theaterCanvas.wasWarning=theaterCanvas.warning;}
 const bossActive=!!bossPresentation?.active&&!bossPresentation.overlay;
 const regions=canvasLayers.regions(sceneCache.regions('moving',extra,fx.full||bossActive||bossWasActive||!!$('geometryToggle')?.checked||fullscreenBonus,isolated));
 bossWasActive=bossActive;
 const worldRegions=regions.map(b=>[view[0]+b[0]/scale,view[1]+b[1]/scale,view[0]+b[2]/scale,view[1]+b[3]/scale]);
 ctx=mainContext;ctx.save();ctx.setTransform(1,0,0,1,0,0);if(combinedCacheEnabled)canvasLayers.restoreRectangles(ctx,'composite',regions);ctx.beginPath();for(const b of regions)ctx.rect(b[0],b[1],b[2]-b[0],b[3]-b[1]);ctx.clip();if(!combinedCacheEnabled)for(const b of regions)ctx.clearRect(b[0],b[1],b[2]-b[0],b[3]-b[1]);
 if(!combinedCacheEnabled&&!retainedCanvasEnabled)sceneCache.draw(ctx,{background:false,frequency:'retained',update:false,regions});
 if(!theaterCanvas.stableFrame&&(!theaterCanvas.closed||theaterCanvas.curtainDynamic)){ctx.save();ctx.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);theaterCanvas.paintDynamic(ctx,theaterBounds,worldRegions);ctx.restore();}
 sceneCache.draw(ctx,{background:false,frequency:'moving',update:false,regions,content:'objects'});
 ctx.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);
 const viewport=theater.draw(ctx,game,view[1],false);bossPresentation?.draw(ctx,theater,viewport);controls.drawGeometry?.();
 for(const plane of PinballArt.planes)if(impactPresentation.hasEffects(plane)){const layer=plane==='upper'?'tavern':plane;withLayoutLayer(layer,()=>impactPresentation.draw(ctx,plane,view),activeBallLayers.has(layer));}
 impactPresentation.drawComboFlash(ctx,view,worldRegions,true);if(controls.art&&fullscreenBonus)artRenderer.drawTable?.producer?.attack?.(ctx,artRenderer,view);
 if(theater.customScore&&regions.some(b=>b[1]<scoreHeight&&b[3]>0))canvasLayers.blitScore(ctx,scoreHeight);
 drawFloatingRewards();impactPresentation.drawHud(ctx,view,{regions:worldRegions});sceneCache.draw(ctx,{background:false,frequency:'moving',update:false,regions,content:'balls'});bossPresentation?.paint(ctx);theaterCanvas.paintWarning(ctx,view);ctx.restore();
 if(effectsGL){
  effectsGL.begin(view);
  if(!game.theaterFrozen&&!theaterCanvas.warning&&!fullscreenBonus){
   reboundEffects.drawGPU(effectsGL);impactPresentation.drawGPU(effectsGL);
  }
  effectsGL.end();
 }
 artRenderer.frameArtKeys=null;artRenderer.frameArtStates=null;artRenderer.frameArtPoses=null;
 controls.updateHUD?.();
}
function drawReserveBallIcons(reserve,x,y,spacing){
 const t=ctx.getTransform();ctx.setTransform(1,0,0,1,0,0);
 for(let i=0;i<reserve;i++){const cx=x-spacing+i*spacing;ballImages.draw(ctx,'hud',t.a*cx+t.c*y+t.e,t.b*cx+t.d*y+t.f);}
 ctx.setTransform(t.a,t.b,t.c,t.d,t.e,t.f);
}
function drawBall(b,t=null){
 if(b.state==='drained')return;if(!layeredRenderingEnabled||!ballImages.sprites)impactPresentation.drawBallGlow(ctx,b);
 if(ballImages.sprites){
  t??=ctx.getTransform();ctx.setTransform(1,0,0,1,0,0);
  ballImages.draw(ctx,'ball',t.a*b.p[0]+t.c*b.p[1]+t.e,t.b*b.p[0]+t.d*b.p[1]+t.f,layeredRenderingEnabled?impactPresentation.ballGlowLevel(b):0);
  ctx.setTransform(t.a,t.b,t.c,t.d,t.e,t.f);
 }else{ctx.save();circle(b.p,game.physics.ballRadius,'#e7eff5','#4c6677');circle([b.p[0]-1,b.p[1]-1],.9,'white');ctx.restore();}
}
function drawBallOutlines(balls=game.balls){
 if(G.gameplay?.ballOutline===false)return;
 const scale=canvas.width/view[2];
 ctx.save();ctx.globalCompositeOperation='source-over';ctx.setLineDash([1.7,1.2]);ctx.lineWidth=layeredRenderingEnabled?1/scale:.5;ctx.strokeStyle='#ffffff';ctx.shadowBlur=0;
 for(const b of balls){
  if(b.state==='drained')continue;
  // Outline balls hidden beneath route artwork.
  ctx.globalAlpha=1;
  ctx.beginPath();ctx.arc(b.p[0],b.p[1],5.0,0,Math.PI*2);
  if(layeredRenderingEnabled){ctx.lineWidth=3/scale;ctx.strokeStyle='#17212a';ctx.stroke();ctx.lineWidth=1/scale;ctx.strokeStyle='#ffffff';}
  ctx.stroke();
 }
 ctx.restore();
}
theater.onViewportChange=()=>{drawRequested=true;};
function frame(now){
 if(!artworkReady){previous=now;accumulator=0;requestAnimationFrame(frame);return;}
 fpsDisplay.frame(now,game.paused||document.hidden);
 controls.onFrame?.(now);
 theaterCanvas.tick(now,game.paused);
 const theaterZ=theaterCanvas.warning?'5':'';if(canvas.style.zIndex!==theaterZ)canvas.style.zIndex=theaterZ;
 const cannonShake=impactPresentation.screenShake(now),worldShake=layeredRenderingEnabled?impactPresentation.shake():[0,0],shakeX=cannonShake[0]+worldShake[0]*canvas.width/view[2],shakeY=cannonShake[1]+worldShake[1]*canvas.width/view[2],screenTranslate=shakeX||shakeY?`${shakeX}px ${shakeY}px`:'';
 // CSS translation keeps theater and table synchronized even while physics/drawing is frozen.
 if(canvas.style.translate!==screenTranslate){canvas.style.translate=screenTranslate;theater.frame.style.translate=screenTranslate;canvasLayers?.shift();if(effectsGL)effectsGL.layoutDirty=true;}
 const dt=Math.min(.05,(now-previous)/1000);previous=now;firstPlayGuide?.tick?.(dt);if(firstPlayGuidePending&&!game.paused&&!game.enemyIntroPending&&!theater.curtainClosing&&!game.theaterFrozen){firstPlayGuidePending=false;firstPlayGuide=TableTutorial.start({game,theater,canvas,G,P,artLayers,view,getView:()=>view,soundBank,clearTouchControls,launch,notice,
controls:{get launchMode(){return launchMode},get launchDrag(){return launchDrag},set launchDrag(value){launchDrag=value}},
onFinish(){firstPlayGuide=null;}});}game.bonus?.update(dt);bossPresentation?.update(dt,soundBank,controls.settingsOpen||leaveDialog.open||suspendedGameState!==null||game.paused&&!firstPlayGuide&&!theater.bossDefeated);if(G.gameplay?.runicTurntable)soundBank.sync('runic-spin',game.bonus.clock-game.bonus.phaseAt,!game.paused&&game.bonus.phase==='spin'&&game.bonus.clock-game.bonus.phaseAt<G.gameplay.runicTurntable.spinSeconds);if(!game.paused&&!game.theaterFrozen&&!game.bonusFrozen&&!firstPlayGuide?.demoFrozen){accumulator+=dt;while(accumulator>=game.physics.step){game.step();accumulator-=game.physics.step;if(!artworkReady||game.theaterFrozen||game.bonusFrozen||game.paused){accumulator=0;break;}}}else accumulator=0;syncLaunchCharge(now);if(!game.paused&&!game.theaterFrozen||drawRequested||game.time!==drawnGameTime||bonusVisualTime()!==drawnBonusClock||theater.hudState!==drawnHudState||game.paused!==drawnPaused||game.theaterFrozen!==drawnFrozen)draw();requestAnimationFrame(frame)}
let launchStartedAt=null;
function syncLaunchCharge(now=performance.now()){
 if(launchDrag)return;
 if(launchStartedAt===null||theater.curtainClosing||game.enemyIntroPending||game.paused||game.freezeRemaining>0||game.ball.state!=='ready')return;
 game.chargeElapsed=Math.max(0,Math.min(G.plunger.charge_seconds,(now-launchStartedAt)/1000));
 game.charge=game.chargePower(game.chargeElapsed);
 game.ball.p[1]=G.plunger.rest_y-game.physics.ballRadius+G.plunger.stroke*game.charge;
}
function launch(on){
 if(!artworkReady)return;
 if(on){if(theater.curtainClosing||game.enemyIntroPending||game.paused||game.freezeRemaining>0||game.ball.state!=='ready'||launchStartedAt!==null)return;launchStartedAt=performance.now();game.input.launch=true;syncLaunchCharge();}
 else{syncLaunchCharge();const was=launchStartedAt!==null&&game.input.launch;launchStartedAt=null;game.input.launch=false;if(was&&!theater.curtainClosing&&!game.enemyIntroPending)game.launch(game.charge);game.charge=0;game.chargeElapsed=0;}
}
let suspendedGameState=null;
let suspendedLeaveDialog=false;
let gamePaused=game.paused;
// All pause writers (including tutorials and reset) share this transition.
Object.defineProperty(game,'paused',{enumerable:true,configurable:true,get(){return gamePaused;},set(value){
 value=!!value;if(value===gamePaused)return;gamePaused=value;syncAudioPause();theater.update(0,game);
}});
function syncAudioPause(){soundBank.setPaused(suspendedGameState!==null||game.paused&&!controls.settingsOpen);}
theater.update(0,game);
function suspendGame(){fpsDisplay.reset();
 if(suspendedGameState!==null)return;
 suspendedGameState=game.paused;clearTouchControls();launchStartedAt=null;
 suspendedLeaveDialog=leaveDialog.open;if(suspendedLeaveDialog)leaveDialog.close();
 game.charge=game.chargeElapsed=0;game.input.left=game.input.right=game.input.launch=false;
 game.paused=true;soundBank.setPaused(true);
}
function resumeGame(){theater.setPresentationReady(true);fpsDisplay.reset();if(suspendedGameState===null)return;const paused=suspendedGameState;if(suspendedLeaveDialog){suspendedLeaveDialog=false;leaveDialog.showModal();$('continueGame').focus();}suspendedGameState=null;if(game.paused===paused)syncAudioPause();else game.paused=paused;}
function applyPhysicsModel(value){value='legacy';game.config.physicsModel=value;for(const f of game.flippers){f.angle=f.rest;f.omega=0;delete f.cadet;}for(const ball of game.balls){ball.spin=0;delete ball.rollingSpin;delete ball.slingshotContacts;}$('physicsModel').value=value;localStorage.setItem('pinball-physics-model',value);}
function setEffectsRenderer(){
 // Collision rings use the legacy Canvas2D path on all tables, independently of Boss spells.
 if(effectsRequested==='2d')return;
 effectsRequested='2d';
 HitEffects.state(game).setWebGL(false);
 sceneEpoch++;drawRequested=true;
}
function applyAppSettings(values){if(Number.isFinite(values.volume))soundBank.setVolume(values.volume);if(typeof values.showFPS==='boolean')fpsDisplay.setEnabled(values.showFPS);if(values.effectsRenderer)setEffectsRenderer(values.effectsRenderer);if(values.physicsModel&&values.physicsModel!==game.config.physicsModel)applyPhysicsModel(values.physicsModel);if(values.playAspect)applyPlayAspect('portrait');if(values.spellRenderer&&bossPresentation){bossPresentation.setRenderer(values.spellRenderer);drawRequested=true;}soundEnabled=values.sound;launchMode=values.launchMode; controls.setLaunchMode?.(launchMode);syncSound();}
function reset(){gameOverOverlay?.cancel();gameOverOverlay=null;clearTouchControls();launchStartedAt=null;game.reset();accumulator=0;if(bossStage&&(!tutorialMode||['steampunk','space','norse','touhou1','touhou2'].includes(PLAYTEST_THEME)))startBoss();else notice(PinballI18n.t('table.launchShort'));return graphicsPreparation;}
function bind(id,set){const b=$(id);b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);set(true);if(!game.paused&&!game.gameOver)window.PinballHaptics?.play('tap');e.preventDefault()};b.onpointerup=()=>set(false);b.onpointercancel=()=>set(false)}
controls.bindInputs?.(launch);
function key(e,on){if(!artworkReady)return;if(tutorialMode||leaveDialog.open)return;if(e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();const control=['arrowleft','z'].includes(k)?'left':['arrowright','c'].includes(k)?'right':[' ','arrowdown'].includes(k)?'launch':null;if(firstPlayGuide&&!firstPlayGuide.allowed(control)){e.preventDefault();return;}if(!on&&control&&firstPlayGuide)firstPlayGuide.used(control);if([' ','arrowdown','arrowleft','arrowright','z','c','x','r'].includes(k))e.preventDefault();if(['arrowleft','z'].includes(k))game.input.left=on;if(['arrowright','c'].includes(k))game.input.right=on;if([' ','arrowdown'].includes(k)&&!e.repeat)launch(on);if(on&&!e.repeat){if(k==='r')reset();if(k==='x')game.nudge()}}
addEventListener('keydown',e=>{if(!gameOverOverlay)key(e,true)});addEventListener('keyup',e=>{if(!gameOverOverlay)key(e,false)});
addEventListener('blur',()=>{clearTouchControls();game.input.left=game.input.right=game.input.launch=false;if(!window.AppControls&&!game.paused)openSettings()});
canvas.onpointerdown=e=>{if(!artworkReady)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*view[2]+view[0],y=(e.clientY-r.top)/r.height*view[3]+view[1];if(topHit(backArt,x,y)){requestLeaveGame();return;}if(topHit(settingsArt,x,y)){openSettings();return;}if(topHit(soundArt,x,y)){setPlaySound(!soundEnabled);notice(soundEnabled?PinballI18n.t('table.soundOn'):PinballI18n.t('table.soundOff'));draw();return;}if(controls.probe){controls.placeBall(x,y);return;}
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
async function preprocessPlayGraphics(){
 // Audio fetch/decode may finish later; it must not gate graphics readiness.
 soundBank.prepare().catch(error=>console.warn('Sound preparation:',error));
 // Preprocess the complete resource plan before gameplay may advance.
 const drawingTable=artRenderer.refreshDrawTable(game)||artRenderer.prepareDrawTable(tableArt,game);
 await artRenderer.decodeImages([...drawingTable.images.values(),topBallImage]);
 prepareBallImages();
 artRenderer.brightness=.82;
 try{await artRenderer.prepareArtwork(artLayers,canvas.width/view[2]);}finally{artRenderer.brightness=1;}
 await artRenderer.prepareMissionLights(artLayers,canvas.width/view[2],.82,-view[0]*canvas.width/view[2],-view[1]*canvas.width/view[2]);
 await impactPresentation.prepareShadows(canvas.width/view[2]);
 await impactPresentation.prepareHudText(canvas.width/view[2]);
 ConfiguredMechanisms.preparePostCounts(game,canvas.width/view[2],spaceTheme?'#000':'#fff5bb');
 artRenderer.refreshDrawTable(game);
 prepareFrameArt();
 const drawPasses=[{plane:'background',items:backgroundBelowBall},{plane:'background',items:backgroundAboveBall}];
 for(const plane of ['lower','upper','top'])for(const batch of artDrawPlans.get(plane).batches)if(batch)drawPasses.push({plane,items:batch});
 drawPasses.push({plane:'foreground',items:artByPlane.get('foreground')},...frameArtPlanes);
 artRenderer.setDrawPasses(drawPasses,game);
 if(SpaceNeonBorders.enabled(PLAYTEST_THEME,G.gameplay))spaceNeon.prepare(game,G.gameplay,canvas.width/view[2]);
 game.bonus?.prepareArtwork?.(canvas.width/view[2],artRenderer,[-view[0]*canvas.width/view[2],-view[1]*canvas.width/view[2]]);prepareScoreGraphics();
 game.prepareFlippers?.();
 for(const f of game.flippers)f.cadet?.points(game.time);
 prepareSceneGraphics();
 sceneCache.update();
}
function preparePlayGraphics(){
 graphicsGeneration++;
 if(graphicsPreparation)return graphicsPreparation;
 artworkReady=false;clearTouchControls();
 const stamp=()=>[graphicsGeneration,canvas.width,canvas.height,...view,artRenderer.layoutRevision,artRenderer.imageRevision].join('|');
 graphicsPreparation=(async()=>{
  let started;
  do{started=stamp();await preprocessPlayGraphics();}while(started!==stamp());
  artworkReady=true;
  draw();
 })().finally(()=>{graphicsPreparation=null;});
 return graphicsPreparation;
}
applyPlayAspect(playAspect);
const tableArt=artRenderer.observeLayout([...artLayers,...topLayers]);
await preparePlayGraphics();
if(!window.AppControls)theater.setPresentationReady(true);
previous=performance.now();accumulator=0;
requestAnimationFrame(frame);
try{setEffectsRenderer(localStorage.getItem('pinball-effects-renderer')||'webgl');}catch{setEffectsRenderer('webgl');}
window.viewAPI={hasSettingsControl:true,game,get leaveConfirmationOpen(){return leaveDialog.open||suspendedLeaveDialog;},requestLeave(){if(leaveDialog.open)leaveDialog.close();else requestLeaveGame();},get graphicsReady(){return artworkReady;},get theaterRenderer(){return 'canvas';},get effectsRenderer(){return effectsGL?'webgl':'2d';},get spellRenderer(){return bossPresentation?.renderer||null;},applyLocale,applySettings:applyAppSettings,suspend:suspendGame,resume:resumeGame};

}
