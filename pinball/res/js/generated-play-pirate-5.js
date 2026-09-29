'use strict';
const tutorialMode=new URLSearchParams(location.search).get('tutorial')==='1';
const requestedBossStage=Number(new URLSearchParams(location.search).get('bossStage'));
const bossStage=Number.isInteger(requestedBossStage)&&requestedBossStage>=1&&requestedBossStage<=8?requestedBossStage:0;
const G=PIRATE_GEOMETRY,P=PiratePhysics,game=new P.Game(G),canvas=document.getElementById('table'),ctx=canvas.getContext('2d'),$=id=>document.getElementById(id);
game.preserveTableOnDrain=!!bossStage;
game.scoringEnabled=!bossStage;
window.layoutGame=game;
const theater=new LayoutTheater();theater.bossStage=bossStage;theater.tutorialPreview=false;window.layoutTheater=theater;
let firstPlayGuide=null;
let firstPlayGuidePending=tutorialMode||bossStage===1&&new URLSearchParams(location.search).get('firstPlayTutorial')==='1'&&localStorage.getItem('pinball-pirate-first-play-tutorial-v1')!=='1';
const touchControls=new Map();let launchMode=localStorage.getItem('pinball-launch-mode')||'hold',launchDrag=null;
const artRenderer=new PinballArt.Renderer();let artLayers=[],artWarning='';
try{artLayers=PinballArt.validate(G.artLayers||[]);
 if(new URLSearchParams(location.search).get('art')==='preview'){
  const preview=JSON.parse(localStorage.getItem('pinball-art-preview-res')||'null');
  if(preview&&JSON.stringify(preview.objects)===JSON.stringify(G.art_layout_objects))artLayers=PinballArt.validate(preview.artLayers);
  else artWarning='美術預覽與試玩布局不同：請匯出 JSON 並重新建置。';
 }
}catch(e){artWarning='美術載入失敗：'+e.message}
$('geometryToggle').checked=!artLayers.length;
const topArt=artLayers.find(a=>a.src.endsWith('/top.png'));
const topBallImage=artRenderer.image('res/img/top-ball.png');
const volleyballArt=artLayers.find(a=>/\/handprint-volleyball-v2\.png$/.test(a.src));
let volleyballShakeUntil=0;
const legacySoundArt=artLayers.find(a=>/top-sound-(on|off)\.png$/.test(a.src)),legacySettingsArt=artLayers.find(a=>a.src.endsWith('/top-settings.png'));
const soundArt=artLayers.find(a=>a.src.endsWith('/system-marker-sound.png'))||legacySoundArt;
const settingsArt=artLayers.find(a=>a.src.endsWith('/system-marker-settings.png'))||legacySettingsArt;
const backArt=artLayers.find(a=>a.src.endsWith('/system-marker-back.png'));
if(soundArt!==legacySoundArt&&legacySoundArt)legacySoundArt.hidden=true;
if(settingsArt!==legacySettingsArt&&legacySettingsArt)legacySettingsArt.hidden=true;
const topItems=new Set([topArt,legacySoundArt,legacySettingsArt,soundArt,settingsArt,backArt].filter(Boolean));
let topVisibleInset=null;
function topOffset(){
 if(!topArt)return 0;
 if(topVisibleInset===null){const img=artRenderer.image(topArt.src);if(img.complete&&img.naturalWidth){
  const c=document.createElement('canvas');c.width=topArt.crop[2];c.height=topArt.crop[3];const brush=c.getContext('2d');brush.drawImage(img,...topArt.crop,0,0,c.width,c.height);
  try{const pixels=brush.getImageData(0,0,c.width,c.height).data;let first=0;for(;first<c.height;first++){let found=false;for(let x=0;x<c.width;x++)if(pixels[(first*c.width+x)*4+3]>32){found=true;break;}if(found)break;}topVisibleInset=first/c.height;}catch{topVisibleInset=.3812;}
 }}
 return view[1]+2-(topArt.y-topArt.height/2+topArt.height*(topVisibleInset??.3812));
}
const soundBank=new PinballSound(PirateMap.sounds);theater.soundBank=soundBank;
for(const event of ['pointerdown','keydown'])addEventListener(event,()=>soundBank.unlock(),{capture:true});
let soundEnabled=localStorage.getItem('pinball-sound')!=='off';
function syncSound(){soundBank.setEnabled(soundEnabled);if(soundArt===legacySoundArt&&soundArt)soundArt.src='res/img/top-sound-'+(soundEnabled?'on':'off')+'.png';document.querySelectorAll('audio,video').forEach(a=>a.muted=!soundEnabled);}
syncSound();
const settings=document.createElement('dialog');settings.style.cssText='background:#30251e;color:#fff0cc;border:2px solid #b89051;border-radius:12px;padding:24px';
settings.innerHTML='<h2>設定</h2>'+[['artToggle','美術圖層'],['geometryToggle','布局線'],['upper','顯示上層']].map(([id,label])=>`<p><label><input type="checkbox" data-setting="${id}"> ${label}</label></p>`).join('')+'<p><label>發射模式 <select id="launchMode"><option value="hold">按住蓄力</option><option value="drag">向下拖曳</option></select></label></p><button id="testImpactSound">測試碰撞音效</button><button id="closeSettings">關閉</button><button id="mobileRestart">重新開始</button>';
document.body.append(settings);$('launchMode').value=launchMode;$('launchMode').onchange=()=>{clearTouchControls();launchMode=$('launchMode').value;localStorage.setItem('pinball-launch-mode',launchMode);};let settingsWasPaused=false;
settings.onchange=e=>{const id=e.target.dataset.setting;if(id){$(id).checked=e.target.checked;draw();}};
$('closeSettings').onclick=()=>settings.close();$('testImpactSound').onclick=()=>{soundEnabled=true;localStorage.setItem('pinball-sound','on');syncSound();soundBank.unlock();soundBank.setPaused(false);soundBank.play('metal');};$('mobileRestart').onclick=()=>{settings.close();reset();};settings.onclose=()=>{game.paused=settingsWasPaused;};
function openSettings(){if(window.AppControls){window.AppControls.openSettings();return;}if(settings.open)return;clearTouchControls();settingsWasPaused=game.paused;game.paused=true;launchStartedAt=null;game.input.launch=game.input.left=game.input.right=false;settings.querySelectorAll('[data-setting]').forEach(e=>e.checked=$(e.dataset.setting).checked);settings.showModal();}
const leaveDialog=document.createElement('dialog');leaveDialog.id='leaveGameDialog';leaveDialog.style.cssText='background:#30251e;color:#fff0cc;border:2px solid #b89051;border-radius:12px;padding:24px';
leaveDialog.innerHTML='<h2>離開球台？</h2><button id="continueGame">繼續遊玩</button> <button id="leaveGame">離開球台</button>';document.body.append(leaveDialog);
let leaveWasPaused=false;
function requestLeaveGame(){if(leaveDialog.open)return;clearTouchControls();leaveWasPaused=game.paused;game.paused=true;game.input.left=game.input.right=game.input.launch=false;launchStartedAt=null;leaveDialog.showModal();$('continueGame').focus();}
leaveDialog.onclose=()=>{game.paused=leaveWasPaused;};
$('continueGame').onclick=()=>leaveDialog.close();
$('leaveGame').onclick=()=>{leaveDialog.close();if(window.AppControls?.exitGame)window.AppControls.exitGame();else location.href=new URL('../res/main.html',location.href).href;};
function topHit(a,x,y){if(!a||a.hidden||!$('artToggle').checked)return false;const angle=-a.angle*Math.PI/180,dx=x-a.x,dy=y-a.y-(topItems.has(a)?topOffset():0);return Math.abs(dx*Math.cos(angle)-dy*Math.sin(angle))<=a.width/2&&Math.abs(dx*Math.sin(angle)+dy*Math.cos(angle))<=a.height/2;}

function art(plane,layers=artLayers){if($('artToggle').checked)artRenderer.draw(ctx,layers.filter(o=>!topItems.has(o)),plane,game)}
function artWithBalls(plane){
 const layers=artLayers.filter(o=>o.plane===plane&&!topItems.has(o));
 // Right ramp balls are drawn separately, just below the right boundary art.
 const drawBalls=()=>{for(const b of game.balls){if(b.layer==='right_upper')continue;const visualPlane=game.visualPlane(b);if(visualPlane===plane)drawBall(b);}};
 if(!layers.some(o=>o.state==='ball-layer'))drawBalls();
 let drawn=false;for(const o of layers){if(o.state==='ball-layer'){if(!drawn){drawBalls();drawn=true;}}else if($('artToggle').checked){if(o===volleyballArt&&game.time<volleyballShakeUntil){const age=volleyballShakeUntil-game.time;ctx.save();ctx.translate(Math.sin(age*55)*Math.min(2.5,age*3),Math.cos(age*47)*Math.min(1.5,age*2));artRenderer.draw(ctx,[o],plane,game);ctx.restore();}else artRenderer.draw(ctx,[o],plane,game);}}
}

const reservePreview=Math.max(0,Math.min(99,Number(new URLSearchParams(location.search).get('previewLives'))||0));
const view=[...G.view_box];
function resize(){
 const parent=canvas.parentElement,r=parent.getBoundingClientRect(),style=getComputedStyle(parent);
 const availableW=Math.max(1,r.width-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)),availableH=Math.max(1,r.height-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom));
 const w=Math.min(availableW,600,availableH*view[2]/view[3]),h=w*view[3]/view[2];
 const pixelWidth=Math.max(1,Math.round(w)),pixelHeight=Math.max(1,Math.round(h));
 if(canvas.width!==pixelWidth)canvas.width=pixelWidth;if(canvas.height!==pixelHeight)canvas.height=pixelHeight;
 canvas.style.width=w+'px';canvas.style.height=h+'px';requestAnimationFrame(()=>draw());
}
new ResizeObserver(resize).observe(canvas.parentElement);resize();
let previous=performance.now(),accumulator=0,noticeUntil=0;
const notice=text=>{$('notice').textContent=text;noticeUntil=game.time+2};
let floatingRewards=[];
let screenDimStarted=null;
let screenDimEnding=null;
const screenDimAnimations=new Set();
function updateScreenDimEvent(e){
 if(['new-game','drain','ball-saved','ready','game-over'].includes(e.type)){screenDimStarted=screenDimEnding=null;screenDimAnimations.clear();return;}
 const kind=e.type==='kraken-attack-started'?'kraken':e.type==='free-ball-launch'?'shark':null;
 if(kind){screenDimAnimations.add(kind);if(screenDimStarted===null)screenDimStarted=performance.now();screenDimEnding=null;}
 if(e.type==='kraken-attack-ended')screenDimAnimations.delete('kraken');
}
function drawScreenDim(){
 if(screenDimStarted===null)return;
 if(screenDimAnimations.has('shark')&&(game.sharkFlashAt===null||game.time-game.sharkFlashAt>=3.18))screenDimAnimations.delete('shark');
 const now=performance.now();
 if(!screenDimAnimations.size&&screenDimEnding===null)screenDimEnding=now;
 if(screenDimEnding!==null&&now-screenDimEnding>=600){screenDimStarted=screenDimEnding=null;return;}
 const alpha=.2*Math.min(1,(now-screenDimStarted)/400)*(screenDimEnding===null?1:1-(now-screenDimEnding)/600);
 ctx.save();ctx.fillStyle=`rgba(0,0,0,${alpha})`;ctx.fillRect(...view);ctx.restore();
}
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
  else{ctx.strokeText(reward.ballIcon?'+1 球':reward.text,0,0);ctx.fillText(reward.ballIcon?'+1 球':reward.text,0,0);}
  ctx.restore();
 }
}
let ballStartedAt=null,ballElapsed=0;
const formatBallTime=seconds=>{
 const tenths=Math.max(0,Math.floor(seconds*10)),minutes=Math.floor(tenths/600),remainder=tenths%600;
 return String(minutes).padStart(2,'0')+':'+String(Math.floor(remainder/10)).padStart(2,'0')+'.'+remainder%10;
};
let gameOverOverlay=null;
function endGame(){
 if(gameOverOverlay)return;clearTouchControls();launchStartedAt=null;game.paused=true;soundBank.stop();
 if(bossStage){window.dispatchEvent(new CustomEvent('pinball:boss-exit',{detail:{stage:bossStage}}));return;}
 let rows=[];try{const saved=JSON.parse(localStorage.getItem('pinball-high-scores-v1')||'[]');if(Array.isArray(saved))rows=saved.filter(r=>r&&Number.isSafeInteger(r.score)&&r.score>=0).slice(0,10);}catch{}
 const id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);rows.push({id,score:game.score,endedAt:new Date().toISOString()});rows.sort((a,b)=>b.score-a.score);rows=rows.slice(0,10);
 try{localStorage.setItem('pinball-high-scores-v1',JSON.stringify(rows));}catch{}
 gameOverOverlay=PirateMap.showGameOver(document,game.score,rows,id,()=>{gameOverOverlay=null;if(bossStage)window.dispatchEvent(new CustomEvent('pinball:boss-exit',{detail:{stage:bossStage}}));else reset();},bossStage?'離開球台':'重新開始');
}
game.onEvent=e=>{firstPlayGuide?.onEvent(e);updateScreenDimEvent(e);if(e.type==='new-game')floatingRewards=[];if((e.type==='score'||e.type==='target-bonus')&&e.points>0)showFloatingReward(e.position,'+'+e.points);if(e.type==='vortex-reclaimed')showFloatingReward(e.position||game.ball.p,'+1',true,.25);if(e.type==='extra-life-awarded')showFloatingReward(e.position||game.ball.p,'+1',true);if(e.type==='launch'){ballStartedAt=game.time;ballElapsed=0;soundBank.play('explosion');}if(e.type==='drain'&&ballStartedAt!==null){ballElapsed=game.time-ballStartedAt;ballStartedAt=null;}if(e.type==='new-game'){ballStartedAt=null;ballElapsed=0;volleyballShakeUntil=0;}if(e.type==='ball-saved')notice('BALL SAVE · 保球成功，不扣命');if(e.type==='ball-save-ready'){launchStartedAt=null;notice('保球補發：請重新發球');}if(e.type==='sound')soundBank.play(e.name);if((e.type==='release'&&e.id!=='tavern-drop')||e.type==='vortex-ejected'||e.type==='kickback')soundBank.play('explosion');if(e.type==='new-game'||e.type==='ready')soundBank.stop();theater.onEvent(e);if(e.type==='vortex-captured')notice('水渦中心扣球');if(e.type==='vortex-ejected')notice('水渦彈出球');if(e.type==='vortex-reclaimed')notice('水渦回收球');if(e.type==='vortex-returned'){launchStartedAt=null;notice('球已回到發球道，不扣球數');}if(e.type==='airdrop-rollover')notice(`空投收集 ${e.count}/3`);if(e.type==='pirate-airdrop-requested'){notice('海盜空投已觸發 · 三條已重置');window.dispatchEvent(new CustomEvent('pinball:pirate-airdrop',{detail:e}));}if(e.type==='pirate-airdrop-ended')notice('空投事件結束');if(e.type==='enemy-spawn-requested'){launchStartedAt=null;game.input.launch=false;game.charge=game.chargeElapsed=0;notice('敵人登場準備');window.dispatchEvent(new CustomEvent('pinball:enemy-spawn',{detail:e}));}if(e.type==='extra-life-awarded')notice((e.source==='multiball'?'Multiball':e.source==='boss-target'?'Boss target':'水渦')+'獎勵：備用球 +1');if(e.type==='vortex-activated')notice('水渦已啟動');if(e.type==='target-bonus')notice('三連完成 · 額外 +150（合計 300）');if(e.type==='bumper-upgraded')notice('Bumper 升至第 '+e.level+' 級');if(e.type==='center-post-up')notice('Center post 已升起');if(e.type==='multiball-awarded')notice('Multiball！獲得額外球');if(e.type==='free-ball-launch')notice('Multiball 額外球已發射');if(e.type==='kickback-lane')notice(e.side==='left'?'左側彈簧已觸發':'右側彈簧已觸發');if(e.type==='capture'){if(['shape-45','shape-71'].includes(e.id))volleyballShakeUntil=game.time+.75;notice('進洞 +250');}if(e.type==='release')notice('出球');if(e.type==='drain')notice('失球');if(e.type==='ready')notice('按住空白鍵發射');if(e.type==='game-over')endGame();if(e.type==='layer')notice(e.to!=='lower'?'進入上層':'回到下層');if(e.type==='target-group-complete')notice(game.targetGroups.find(g=>g.id===e.id)?.targets.length===1?'單顆 target 命中':'三連 target 完成');};
function startBoss(){
 if(!Number.isInteger(bossStage)||bossStage<1||bossStage>8)return;
 game.enemyActive=true;game.enemyIntroPending=true;
 theater.onEvent({type:'enemy-spawn-requested',eventId:bossStage});
 notice('敵人登場準備');
}
if(bossStage&&!tutorialMode)startBoss();
function path(points,fill,stroke,width=1,closed=false){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));if(closed)ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function circle(p,r,fill,stroke){ctx.beginPath();ctx.arc(...p,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke()}}
function object(o,upper=false){
 if(!o)return;
 if(o.kind==='field'&&o.mechanic==='gravity-well'){
  if(!game.vortexActive){ctx.save();ctx.setLineDash([2,3]);circle(o.center,o.radius,null,'#3c6574');ctx.setLineDash([]);ctx.fillStyle='#78a4b0';ctx.font='5px sans-serif';ctx.textAlign='center';ctx.fillText('水渦未啟動',o.center[0],o.center[1]);ctx.restore();return;}
  ctx.save();ctx.setLineDash([2,2]);circle(o.center,o.radius,'#217a9820','#43899e');ctx.setLineDash([]);
  for(let arm=0;arm<3;arm++){
   const ps=[];for(let i=0;i<=60;i++){const t=i/60,r=o.radius*.85*(1-t),a=t*Math.PI*3+arm*Math.PI*2/3+game.time*.45;ps.push([o.center[0]+Math.cos(a)*r,o.center[1]+Math.sin(a)*r]);}
   path(ps,null,'#4faac077',.8);
  }
  circle(o.center,2,'#a0e8ee');ctx.restore();return;
 }
 if(['flipper','field'].includes(o.kind)||o.id==='gravity-well')return;
 if(o.id==='test-post-center'){circle(o.center,o.radius,game.centerPostRaised?'#ffd477':'#263945',game.centerPostRaised?'#fff1b9':'#667986');return}
 if(o.kind==='airdrop-rollover'){path(o.points,null,game.airdropHits.has(o.id)?'#ffd477':'#98deb8',2);return}
 if(o.kind==='rollover'){path(o.points,null,game.rolloverHits.has(o.id)?'#ffd477':'#83bdd0',2);return}
 if(o.center){const color=o.kind==='bumper'?['','#75d8f5','#a7ec84','#ffd477'][game.bumperLevel(o.id)]:o.kind==='socket'||o.kind==='drop'?'#17202c':'#b8bec5';circle(o.center,o.radius,color,upper?'#dfa6ff':'#8eccdf');if(o.kind==='bumper'){circle(o.center,o.radius*.6,'#1d657d','#bcefff');ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.font='bold 5px sans-serif';ctx.fillText(String(game.bumperLevel(o.id)),...o.center);ctx.restore();}if(o.kind==='socket')circle(o.center,o.radius*.55,'#02080e');return}
 if(!o.points)return;
 const lit=game.targetHits.has(o.id);let stroke=upper?'#dfa6ff':'#83bdd0',fill=o.closed?'#334956':null,width=.9;
 if(o.kind==='target'){stroke=lit?'#385362':'#a5f1ff';fill=lit?'#20323d':'#467788'}
 if(o.kind==='rebound'||o.kind==='active'){stroke='#ffbe86';width=2}
 if(o.kind==='flag'){stroke='#e6a5ea';width=1.8}
 if(o.thickness){width=o.thickness;ctx.lineCap='round'}
 path(o.points,fill,stroke,width,o.closed);ctx.lineCap='butt';
 if(o.pass_normal){const c=P.mix(o.points[0],o.points[1],.5),n=o.pass_normal,t=[-n[1],n[0]],tip=P.add(c,P.mul(n,8));path([P.add(c,P.mul(n,-5)),tip],null,"#a6e9b0",1);path([P.add(P.add(tip,P.mul(n,-3)),P.mul(t,3)),tip,P.add(P.add(tip,P.mul(n,-3)),P.mul(t,-3))],null,"#a6e9b0",1)}
}
function setText(id,value){const element=$(id),text=String(value);if(element.textContent!==text)element.textContent=text;}
function draw(){
 const scale=canvas.width/view[2];ctx.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);ctx.clearRect(...view);ctx.fillStyle='#13242f';ctx.fillRect(...view);
 theater.customScore=!!topArt&&!topArt.hidden&&$('artToggle').checked;theater.draw(ctx,game,view[1]);
 const backgroundLayers=artLayers.filter(o=>o.plane==='background');
 const rightBoundaryIndex=backgroundLayers.findIndex(o=>o.src.endsWith('/lower-boundry-right_v3.png'));
 const ballIndex=rightBoundaryIndex<0?backgroundLayers.length:rightBoundaryIndex;
 art('background',backgroundLayers.slice(0,ballIndex));
 for(const b of game.balls)if(b.layer==='right_upper')drawBall(b);
 art('background',backgroundLayers.slice(ballIndex));
 artWithBalls('lower');
 artWithBalls('upper');
 art('foreground');
 if($('artToggle').checked){ctx.save();ctx.translate(0,topOffset());for(const plane of PinballArt.planes)artRenderer.draw(ctx,[...topItems],plane,game);ctx.restore();}
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

 if($('geometryToggle').checked){
 for(const island of G.preview_islands)path(island,'#304657',null,1,true);
 G.lower.forEach(o=>object(o));
 for(const k of G.rescue_kickers||[])path(k.points,null,game.kickbacks[k.side]?'#ffd477':'#667986',1.4);

 for(const f of game.flippers){const tip=P.add(f.pivot,[Math.cos(f.angle)*f.length,Math.sin(f.angle)*f.length]);path(P.taperedOutline(f.pivot,tip,...f.radii),'#ccd5db','#a1b6c4',.4,true);circle(f.pivot,1.5,'#43596a')}
 }
 if($('geometryToggle').checked)for(const gate of game.gates){
  if(!['left-return','right-return'].includes(gate.id))continue;
  const closed=gate.closed&&!gate.unlocked;ctx.save();ctx.setLineDash(closed?[]:[2,1.5]);
  path(gate.points,null,closed?'#ffbe86':'#78b6b9',closed?2:1);
  circle(gate.points[0],1.5,closed?'#ffbe86':'#78b6b9');ctx.restore();
 }

 if($('geometryToggle').checked&&($('upper').checked||game.balls.some(b=>b.layer!=='lower'))){
  ctx.globalAlpha=game.balls.some(b=>b.layer!=='lower')?.8:.22;path(G.deck.points,'#775e9a','#d0abec',.7,true);if(G.upper_feeder_floor?.length)path(G.upper_feeder_floor,'#775e9a',null,0,true);if(G.upper_route_floor?.length)path(G.upper_route_floor,'#775e9a',null,0,true);G.upper_parts.forEach(o=>object(o,true));object(G.deck_exit,true);ctx.globalAlpha=1;
 }
 if(game.centerPostRaised){
  const post=G.lower.find(o=>o.id==='test-post-center');
  ctx.save();ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=2.5;ctx.strokeStyle='#24130b';ctx.fillStyle='#fff5bb';
  ctx.strokeText(String(game.centerPostHitsLeft),...post.center);ctx.fillText(String(game.centerPostHitsLeft),...post.center);
  ctx.restore();
 }

 const charge=game.charge;if($('geometryToggle').checked)path([[G.plunger.x-5,G.plunger.rest_y+7.4+charge*10],[G.plunger.x+5,G.plunger.rest_y+7.4+charge*10]],null,'#f1bb77',2);
 drawScreenDim();
 drawFloatingRewards();
 drawBallOutlines();
 setText('mechanics',`空投：${game.airdropHits.size}/3 · Center post：${game.centerPostRaised?'升起':'未升起'}（${game.rolloverHits.size}/3） · Multiball 彈簧：左 ${game.kickbackHits.left?'✓':'○'}／右 ${game.kickbackHits.right?'✓':'○'} · 場上 ${game.balls.filter(b=>b.state!=='drained').length} 球 · 獎勵 ${game.multiballAwards} 次`);
 const power=game.ball.state==='ready'?game.charge:game.plungerReleaseCharge;$('launchPower').value=power;setText('launchPercent',`${(power*G.plunger.charge_seconds).toFixed(3)} 秒 · ${(power*100).toFixed(1)}%`);
 setText('targetDebugStatus',['left','middle','upper'].map((key,i)=>['左上','中間','上層'][i]+' Lv.'+(game.bumperLevels[key]||1)).join(' · '));
 setText('score',bossStage?'DEFEAT BOSS':game.score);setText('ballNumber',game.ballNumber);setText('ballTime',formatBallTime(ballStartedAt===null?ballElapsed:game.time-ballStartedAt));
 if(artWarning)setText('notice',artWarning);else if(theater.curtainClosing)setText('notice','布幕閉合中，請稍候');else if(game.freezeRemaining>0)setText('notice',`敵人登場 · 凍結 ${game.freezeRemaining.toFixed(1)} 秒`);else if(game.paused)setText('notice','已暫停');else if(game.time>noticeUntil&&game.ball.state==='ready')setText('notice','按住空白鍵，再放開發射');
}
function drawBall(b){if(b.state==='drained')return;ctx.save();if(b.state==='vortex-return')ctx.globalAlpha*=b.vortexFade/.25;if(topBallImage.complete&&topBallImage.naturalWidth)ctx.drawImage(topBallImage,b.p[0]-G.ball_radius,b.p[1]-G.ball_radius,G.ball_radius*2,G.ball_radius*2);else{circle(b.p,G.ball_radius,'#e7eff5','#4c6677');circle([b.p[0]-1,b.p[1]-1],.9,'white')}ctx.restore()}
function drawBallOutlines(){
 ctx.save();ctx.globalCompositeOperation='source-over';ctx.setLineDash([1.7,1.2]);ctx.lineWidth=.5;ctx.strokeStyle='#ffffff';ctx.shadowBlur=0;
 for(const b of game.balls){
  if(b.state==='drained')continue;
  // The right upper route deliberately hides the PNG under its artwork.
  // Keep its location readable with an opaque outline above every art plane.
  ctx.globalAlpha=(b.layer==='right_upper'?1:.35)*(b.state==='vortex-return'?Math.max(0,b.vortexFade/.25):1);
  ctx.beginPath();ctx.arc(b.p[0],b.p[1],5.0,0,Math.PI*2);ctx.stroke();
 }
 ctx.restore();
}
let lastDrawAt=0;
function frame(now){const dt=Math.min(.05,(now-previous)/1000);previous=now;firstPlayGuide?.tick?.(dt);if(firstPlayGuidePending&&!game.paused&&!game.enemyIntroPending&&!theater.curtainClosing&&!game.theaterFrozen){firstPlayGuidePending=false;startTableTutorial();}theater.update(leaveDialog.open?0:dt,game);soundBank.setPaused(game.paused&&!settings.open);if(!game.paused&&!game.theaterFrozen&&!firstPlayGuide?.demoFrozen){accumulator+=dt;while(accumulator>=game.config.step){game.step();accumulator-=game.config.step;if(game.theaterFrozen||game.paused){accumulator=0;break;}}}else accumulator=0;syncLaunchCharge(now);if(!game.paused&&!game.theaterFrozen||screenDimStarted!==null||now-lastDrawAt>=100){draw();lastDrawAt=now;}requestAnimationFrame(frame)}
let launchStartedAt=null;
function syncLaunchCharge(now=performance.now()){
 if(launchDrag)return;
 if(launchStartedAt===null||theater.curtainClosing||game.enemyIntroPending||game.paused||game.freezeRemaining>0||game.ball.state!=='ready')return;
 game.chargeElapsed=Math.max(0,Math.min(G.plunger.charge_seconds,(now-launchStartedAt)/1000));
 game.charge=game.chargePower(game.chargeElapsed);
 game.ball.p[1]=G.plunger.rest_y-G.ball_radius+G.plunger.stroke*game.charge;
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
function applyAppSettings(values){soundEnabled=values.sound;launchMode=values.launchMode; $('launchMode').value=launchMode;syncSound();}
function reset(){gameOverOverlay?.cancel();gameOverOverlay=null;clearTouchControls();launchStartedAt=null;game.reset();accumulator=0;if(bossStage&&!tutorialMode)startBoss();else notice('按住空白鍵發射')}
$('settings').onclick=openSettings;$('restart').onclick=reset;$('nudge').onclick=()=>game.nudge();
function setupPhysicsDebug(){
 const panel=$('debugPanel');if(!panel)return;
 const defaults={config:{...game.config},launchMax:G.plunger.launch_max,kickerSpeeds:(G.rescue_kickers||[]).map(k=>k.speed)};
 const groups=[
  ['球與速度',[
   ['ballRadius','球半徑',1,10,.1],['maxSpeed','速度上限',100,1600,10],['launchMax','最大發射推力',0,2400,10],['kickbackSpeed','救球彈簧推力',0,1600,10]
  ]],
  ['重力與阻力',[
   ['gravity','桌面重力',0,600,1],['verticalGravity','斜坡重力',0,1000,1],['rampHeight','斜坡高度',0,60,1],['drag','桌面阻力',0,1,.001],['rampDrag','斜坡阻力',0,1,.001],['wellPull','重力井吸力',0,1000,1],['wellDrag','重力井阻力',0,2,.01]
  ]],
  ['碰撞與 Bumper',[
   ['elasticity','牆面彈性',0,1,.01],['collisionSmoothness','牆面平滑係數',0,1,.01],['roughWallElasticity','粗糙牆面彈性',0,1,.01],['roughWallSmoothness','粗糙牆面平滑係數',0,1,.01],['bumperElasticity','Bumper 彈性',0,1,.01],['bumperSmoothness','Bumper 平滑係數',0,1,.01],['bumperBoost','下層 Bumper 推力',0,500,1],['upperBumperBoost','上層 Bumper 推力',0,500,1],['bumperThreshold','Bumper 觸發門檻',0,100,1],['activeElasticity','主動反彈彈性',0,1,.01],['activeSmoothness','主動反彈平滑係數',0,1,.01],['activeBoost','主動反彈推力',0,500,1],['activeThreshold','主動反彈最低撞擊速度',0,100,1]
  ]],
  ['擋板',[
   ['flipperSeconds','上揮時間（秒）',.02,.2,.001],['flipperReturnSeconds','回落時間（秒）',.02,.2,.001],['flipperElasticity','擋板彈性',0,1,.01],['flipperSmoothness','擋板平滑係數',0,1,.01],['flipperBoostScale','揮擊推力倍率',0,2,.01]
  ]]
 ];
 function setPanel(open){panel.hidden=!open;$('debugToggle')?.setAttribute('aria-expanded',String(open));resize();}
 $('debugToggle').onclick=()=>setPanel(panel.hidden);$('debugClose').onclick=()=>setPanel(false);
 $('debugProbe').checked=$('probe').checked;
 $('debugProbe').onchange=()=>{$('probe').checked=$('debugProbe').checked;};
 $('probe').addEventListener('change',()=>{$('debugProbe').checked=$('probe').checked;});
 const controls=new Map();
 function apply(key,value){
  if(key==='launchMax'){G.plunger.launch_max=value;return;}
  const old=game.config[key];game.config[key]=value;
  if(key==='ballRadius'){
   G.ball_radius=value;
   if(G.right_upper_region)G.right_upper_region.exit_margin+=value-old;
   for(const t of game.transitions)if(t.lip_clearance)t.lip_clearance+=value-old;
   if(game.shark)game.sharkRelease=P.add(P.mix(...game.shark.entry,.5),P.mul(game.sharkOut,value*2));
   for(const ball of game.balls)if(ball.state==='ready')ball.p[1]=G.plunger.rest_y-value+G.plunger.stroke*game.charge;
  }
  if(key==='maxSpeed')for(const ball of game.balls){ball.speedLimit=value;const speed=P.len(ball.v);if(speed>value)ball.v=P.mul(ball.v,value/speed);}
 }
 for(const [title,fields]of groups){
  const fieldset=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=title;fieldset.append(legend);
  for(const [key,title,min,max,step]of fields){
   const label=document.createElement('label'),text=document.createElement('span'),output=document.createElement('output'),input=document.createElement('input');
   label.className='physics-label';label.htmlFor='physics-'+key;text.textContent=title;output.htmlFor='physics-'+key;label.append(text,output);
   input.type='range';input.id='physics-'+key;input.min=min;input.max=max;input.step=step;
   const display=value=>{input.value=value;output.value=String(Number(Number(value).toFixed(3)));};
   display(key==='launchMax'?G.plunger.launch_max:game.config[key]);
   input.oninput=()=>{const value=Number(input.value);apply(key,value);display(value);draw();};
   fieldset.append(label,input);controls.set(key,{display});
  }
  $('physicsControls').append(fieldset);
 }
 const vortexLabel=document.createElement('label');vortexLabel.className='debug-probe';vortexLabel.textContent='水渦機制 ';const vortexMode=document.createElement('select');vortexMode.id='debugVortexMode';
 vortexMode.innerHTML='<option value="return">回到發射道</option><option value="eject">中心扣球後彈出</option>';vortexMode.value=game.config.vortexMode;
 vortexMode.onchange=()=>{game.config.vortexMode=vortexMode.value;for(const ball of game.balls)ball.vortexDwell=0;notice('水渦模式已切換，下次捕球生效');};vortexLabel.append(vortexMode);$('physicsControls').prepend(vortexLabel);
 $('physicsReset').onclick=()=>{
  game.config.vortexMode=defaults.config.vortexMode;vortexMode.value=game.config.vortexMode;
  for(const [key,{display}]of controls){const value=key==='launchMax'?defaults.launchMax:defaults.config[key];apply(key,value);display(value);}
  (G.rescue_kickers||[]).forEach((k,i)=>{if(defaults.kickerSpeeds[i]===undefined)delete k.speed;else k.speed=defaults.kickerSpeeds[i];});
  notice('物理參數已還原預設');draw();
 };
}
setupPhysicsDebug();
const debugLabels={'left-upgrade':'左上 Bumper 升級','middle-upgrade':'中間 Bumper 升級','upper-upgrade':'上層 Bumper 升級','enemy-trigger':'敵人登場','vortex-trigger':'啟動水渦'};
for(const rule of G.gameplay?.target_rules||[]){
 const button=document.createElement('button');button.textContent=debugLabels[rule.id]||rule.id;
 button.onclick=()=>{
  const group=game.targetGroups.find(g=>g.id===rule.id);if(!group)return;
  // Allow repeated debug clicks, including while paused, without advancing game time.
  if(group.complete){group.resetAt=game.time;game.updateTargetGroups();}
  for(const id of group.targets){if(group.hits.has(id))continue;game.cooldowns.delete(id);game.scoreHit(id,500);}
  notice('除錯：'+button.textContent);draw();
 };
 $('targetDebugButtons').append(button);
}
const postDebug=document.createElement('button');postDebug.textContent='Center post 升起';postDebug.onclick=()=>{for(const lane of G.lower.filter(o=>o.kind==='rollover'))game.rolloverHits.add(lane.id);game.raiseCenterPost();notice(game.centerPostRaised?'Center post 已升起':'球離開中心位置後升起');draw();};$('targetDebugButtons').append(postDebug);
const eyeDebug=document.createElement('button');eyeDebug.textContent='章魚眼睛 +1 / 5';eyeDebug.onclick=()=>{game.collectKrakenEye();notice(`章魚眼睛 ${game.krakenCount}/5`);draw();};$('targetDebugButtons').append(eyeDebug);
function bind(id,set){const b=$(id);b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);set(true);e.preventDefault()};b.onpointerup=()=>set(false);b.onpointercancel=()=>set(false)}
bind('left',v=>game.input.left=v);bind('right',v=>game.input.right=v);bind('launch',launch);
function key(e,on){if(tutorialMode||leaveDialog.open)return;if(e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();const control=['arrowleft','z'].includes(k)?'left':['arrowright','c'].includes(k)?'right':k===' '?'launch':null;if(firstPlayGuide&&!firstPlayGuide.allowed(control)){e.preventDefault();return;}if(!on&&control&&firstPlayGuide)firstPlayGuide.used(control);if([' ','arrowleft','arrowright','z','c','x','r'].includes(k))e.preventDefault();if(['arrowleft','z'].includes(k))game.input.left=on;if(['arrowright','c'].includes(k))game.input.right=on;if(k===' '&&!e.repeat)launch(on);if(on&&!e.repeat){if(k==='r')reset();if(k==='x')game.nudge()}}
addEventListener('keydown',e=>{if(!gameOverOverlay)key(e,true)});addEventListener('keyup',e=>{if(!gameOverOverlay)key(e,false)});
addEventListener('blur',()=>{clearTouchControls();game.input.left=game.input.right=game.input.launch=false;if(!window.AppControls&&!game.paused)openSettings()});
canvas.onpointerdown=e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*view[2]+view[0],y=(e.clientY-r.top)/r.height*view[3]+view[1];if(topHit(backArt,x,y)){requestLeaveGame();return;}if(topHit(settingsArt,x,y)){openSettings();return;}if(topHit(soundArt,x,y)){soundEnabled=!soundEnabled;localStorage.setItem('pinball-sound',soundEnabled?'on':'off');syncSound();notice(soundEnabled?'音效開啟':'音效關閉');draw();return;}if(!$('probe').checked){
 if(e.pointerType!=='touch'||game.paused||game.gameOver||y<0)return;
 const control=game.ball.state==='ready'&&x>=G.plunger.left?'launch':x<180?'left':'right';
 const already=[...touchControls.values()].includes(control);touchControls.set(e.pointerId,control);canvas.setPointerCapture(e.pointerId);e.preventDefault();
 if(control==='launch'){if(!already){if(launchMode==='drag'){if(game.ball.state==='ready'&&!game.freezeRemaining&&!game.enemyIntroPending&&!theater.curtainClosing){launchDrag={pointerId:e.pointerId,y:e.clientY};game.launchAiming=true;}}else launch(true);}}else game.input[control]=true;
 return;
}game.setBall([x,y],[0,20]);notice('已放球；此功能可用來測試通道')};
function clearTouchControls(){touchControls.clear();launchDrag=null;game.launchAiming=false;launchStartedAt=null;game.input.left=game.input.right=game.input.launch=false;game.charge=game.chargeElapsed=0;}
function endTouch(e,cancel=false){const control=touchControls.get(e.pointerId);if(!control)return;touchControls.delete(e.pointerId);if([...touchControls.values()].includes(control))return;if(control==='launch'){if(launchDrag){if(!cancel&&!theater.curtainClosing&&!game.enemyIntroPending)game.launch(game.charge);launchDrag=null;game.launchAiming=false;game.charge=game.chargeElapsed=0;return;}if(cancel){launchStartedAt=null;game.input.launch=false;game.charge=game.chargeElapsed=0;}else launch(false);}else game.input[control]=false;}
canvas.onpointermove=e=>{if(!launchDrag||launchDrag.pointerId!==e.pointerId)return;e.preventDefault();game.charge=Math.max(0,Math.min(1,(e.clientY-launchDrag.y)/100));game.chargeElapsed=game.charge;game.ball.p[1]=G.plunger.rest_y-G.ball_radius+G.plunger.stroke*game.charge;};
canvas.onpointerup=e=>endTouch(e);
canvas.onpointercancel=e=>endTouch(e,true);
canvas.onlostpointercapture=e=>endTouch(e,true);
requestAnimationFrame(frame);

function startTableTutorial(){
 if(tutorialMode)game.paused=true;
 clearTouchControls();
 const overlay=document.createElement('div');overlay.id='tableTutorial';overlay.style.pointerEvents='none';
 overlay.innerHTML='<svg id="tutorialSpotlight" aria-hidden="true"></svg><section id="tutorialPanel"><h2 id="tutorialTitle"></h2><p id="tutorialText"></p><p id="tutorialHint" hidden>點擊進入下一步</p></section>';
 document.body.append(overlay);
 let step=0,waiting=false,pointer=null,heldKey=null,heartOnly=false,narrationReady=tutorialMode,demo=null,demoElapsed=0;
 function bounds(o,padding=12){if(!o)return null;const points=o.points||[o.center],xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return [Math.min(...xs)-padding,Math.min(...ys)-padding,Math.max(...xs)-Math.min(...xs)+padding*2,Math.max(...ys)-Math.min(...ys)+padding*2];}
 function flipper(side){const f=game.flippers.find(f=>f.side===side)||game.flippers[side==='left'?0:1];return bounds({points:[f.pivot,P.add(f.pivot,[Math.cos(f.rest)*f.length,Math.sin(f.rest)*f.length])]});}
 function artBounds(a){return [a.x-a.width/2-5,a.y-a.height/2-5,a.width+10,a.height+10];}
 function holes(attack){return G.lower.filter(o=>G.gameplay.hole_attacks[o.id]===attack).map(o=>bounds(o,15));}
 const steps=[
  ['左 flipper','點按螢幕左半邊，揮動左擋板。',()=>[flipper('left')]],
  ['右 flipper','點按螢幕右半邊，揮動右擋板。',()=>[flipper('right')]],
  ['發球道',launchMode==='drag'?'在高亮區域向下拖曳，放開發球。':'按住高亮區域蓄力，放開發球。',()=>{const p=G.plunger;return [[p.left-5,p.rest_y-32,p.right-p.left+10,Math.min(view[1]+view[3],p.base_y+15)-(p.rest_y-32)]];}],
  ['Boss 血量','每顆愛心代表 1 點血量。',()=>[]],
  ['砲彈攻擊 −1','球進入這區，扣除1顆心。',()=>holes('ball')],
  ['炸藥攻擊 −2','球進入這區，扣除2顆心。',()=>holes('barrel')],
  ['三燈攻擊 −3','亮滿三盞燈，扣除3顆心。',()=>artLayers.filter(a=>a.bind?.startsWith('airdrop-rollover-')).map(artBounds)],
  ['章魚攻擊 −4','經過這區五次，扣除4顆心。',()=>artLayers.filter(a=>a.state==='kraken-body').map(artBounds)]
 ];
 function targets(action){const ids=G.gameplay.target_rules.find(r=>r.action===action)?.objects||[];return artLayers.filter(a=>ids.some(id=>a.bind===id||a.bind?.startsWith(id+'-'))).map(artBounds);}
 if(tutorialMode)steps.splice(3,5,
  ['Boss 出現條件','命中這些目標，召喚 Boss。',()=>targets('enemy')],
  ['砲彈攻擊 −1','球進入這區，扣除1顆心。',()=>holes('ball')],
  ['炸藥攻擊 −2','球進入這區，扣除2顆心。',()=>holes('barrel')],
  ['三燈攻擊 −3','亮滿三盞燈，扣除3顆心。',()=>artLayers.filter(a=>a.bind?.startsWith('airdrop-rollover-')).map(artBounds)],
  ['章魚攻擊 −4','經過這區五次，扣除4顆心。',()=>artLayers.filter(a=>a.state==='kraken-body').map(artBounds)],
  ['水渦','命中這區，啟動水渦。',()=>demo==='vortex'?artLayers.filter(a=>a.state==='vortex').map(artBounds):targets('vortex')],
  ['Center post','亮滿底下三條魚，升起中央保護柱。',()=>artLayers.filter(a=>a.state==='center-post'||a.state==='rollover'&&/\/fish-3-[345]\.png$/.test(a.src)&&G.lower.some(o=>o.kind==='rollover'&&o.id===a.bind)).map(artBounds)]
 );
 function hitTargets(action){const rule=G.gameplay.target_rules.find(r=>r.action===action),group=game.targetGroups.find(g=>g.id===rule?.id);for(const id of group?.targets||[]){game.cooldowns.delete(id);game.scoreHit(id,500);}}
 function demoDone(){if(!demo)return;demo=null;firstPlayGuide.demoFrozen=false;game.paused=true;theater.update(0,game);if(step===steps.length-1){finish();return;}step++;render();}
 function playDemo(){
  demo=['enemy','ball','barrel','airdrop','kraken','vortex','post'][step-3];demoElapsed=0;game.hasLaunchedOnce=true;clearTouchControls();firstPlayGuide.demoFrozen=true;game.paused=false;theater.update(0,game);render();
  if(demo==='enemy')hitTargets('enemy');
  else if(demo==='ball'||demo==='barrel')game.emit('hole-attack-requested',{attack:demo,eventId:step});
  else if(demo==='airdrop'){
   // Cross the actual three sensors to collect the lamps and launch the normal attack.
   for(const lane of G.lower.filter(o=>o.kind==='airdrop-rollover')){const a=lane.points[0],z=lane.points[1],mid=P.mix(a,z,.5),normal=P.unit([-(z[1]-a[1]),z[0]-a[0]]);const before=P.add(mid,P.mul(normal,-2));game.ball.state='playing';game.ball.layer=lane.layer;game.ball.p=P.add(mid,P.mul(normal,2));game.airdropSensors(before,lane.layer);}
   game.ball.state='ready';game.ball.p=[G.plunger.x,G.plunger.rest_y-game.config.ballRadius];
  }else if(demo==='kraken')for(let n=0;n<5;n++)game.collectKrakenEye();
  else if(demo==='vortex'){
   hitTargets('vortex');const well=G.lower.find(o=>o.mechanic==='gravity-well'),center=G.lower.find(o=>o.mechanic==='vortex-center'&&o.layer===well.layer);game.setBall(center?.center||well.center,[0,0],well.layer);
  }else if(demo==='post'){
   game.ball.state='ready';game.ball.p=[G.plunger.x,G.plunger.rest_y-game.config.ballRadius];for(const lane of G.lower.filter(o=>o.kind==='rollover'))game.rolloverHits.add(lane.id);game.raiseCenterPost();
  }
 }

 function rects(){const r=canvas.getBoundingClientRect(),root=overlay.getBoundingClientRect(),scale=r.width/view[2];
  if(step===3&&!tutorialMode){const t=theater.frame.getBoundingClientRect(),b=theater.tutorialBounds;if(!b)return [];return [b.hearts].filter(Boolean).map(q=>({x:t.left-root.left+q.x*t.width-3,y:t.top-root.top+q.y*t.height-3,w:q.w*t.width+6,h:q.h*t.height+6}));}
  const result=steps[step][2]().filter(Boolean).map(([x,y,w,h])=>({x:r.left-root.left+(x-view[0])*scale,y:r.top-root.top+(y-view[1])*scale,w:w*scale,h:h*scale}));
  let merge=true;while(merge){merge=false;for(let i=0;i<result.length&&!merge;i++)for(let j=i+1;j<result.length;j++){const a=result[i],b=result[j];if(a.x<=b.x+b.w&&a.x+a.w>=b.x&&a.y<=b.y+b.h&&a.y+a.h>=b.y){const x=Math.min(a.x,b.x),y=Math.min(a.y,b.y);result[i]={x,y,w:Math.max(a.x+a.w,b.x+b.w)-x,h:Math.max(a.y+a.h,b.y+b.h)-y};result.splice(j,1);merge=true;break;}}}return result;
 }
 function position(){if(waiting)return;const root=overlay.getBoundingClientRect(),rs=rects(),svg=$('tutorialSpotlight');svg.setAttribute('viewBox',`0 0 ${root.width} ${root.height}`);svg.innerHTML=`<defs><mask id="tutorialMask"><rect width="100%" height="100%" fill="white"/>${rs.map(q=>`<rect x="${q.x}" y="${q.y}" width="${q.w}" height="${q.h}" rx="7" fill="black"/>`).join('')}</mask></defs><rect width="100%" height="100%" fill="black" opacity=".75" mask="url(#tutorialMask)"/>`;
  const panel=$('tutorialPanel');const minY=rs.length?Math.min(...rs.map(q=>q.y)):root.height;const maxY=rs.length?Math.max(...rs.map(q=>q.y+q.h)):0;const h=panel.offsetHeight;panel.style.top=Math.max(12,Math.min(root.height-h-12,minY>=h+24?minY-h-16:maxY+16))+'px';
 }
 function render(){overlay.hidden=waiting||tutorialMode&&['enemy','ball','barrel','airdrop','kraken'].includes(demo);overlay.dataset.demo=demo||'';overlay.dataset.step=String(step+1);overlay.dataset.heartOnly=String(heartOnly);$('tutorialTitle').hidden=step>=4;$('tutorialHint').hidden=!!demo||!tutorialMode&&step<3;$('tutorialTitle').textContent=step===3&&heartOnly?'Boss 血量':steps[step][0];$('tutorialText').textContent=step===3&&heartOnly?'每顆愛心代表 1 點血量。':steps[step][1];position();}
 function used(control){if(waiting||step>1||control!==['left','right'][step])return;step++;render();}
 function allowed(control){return waiting||step<3&&control===['left','right','launch'][step];}
 function stop(e){e.preventDefault();e.stopImmediatePropagation();}
 function down(e){if(tutorialMode&&demo){stop(e);return;}if(waiting)return;if(tutorialMode||step>=3){stop(e);if((step<3||narrationReady)&&pointer===null){pointer={id:e.pointerId,control:'next'};canvas.setPointerCapture(e.pointerId);}return;}const r=overlay.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const inside=x>=0&&x<=r.width&&y>=0&&y<=r.height;const hit=inside&&(step===0?x<r.width/2:step===1?x>=r.width/2:rects().some(q=>x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h));if(pointer!==null||!hit){stop(e);return;}
  stop(e);if(game.paused||game.theaterFrozen||game.enemyIntroPending)return;const control=['left','right','launch'][step];pointer={id:e.pointerId,control};canvas.setPointerCapture(e.pointerId);soundBank.unlock();if(control==='launch'){if(launchMode==='drag'){launchDrag={pointerId:e.pointerId,y:e.clientY};game.launchAiming=true;}else launch(true);}else game.input[control]=true;
 }
 function move(e){if(!pointer||pointer.id!==e.pointerId)return;stop(e);if(launchDrag){game.charge=Math.max(0,Math.min(1,(e.clientY-launchDrag.y)/100));game.chargeElapsed=game.charge;game.ball.p[1]=G.plunger.rest_y-G.ball_radius+G.plunger.stroke*game.charge;}}
 function up(e){if(!pointer||pointer.id!==e.pointerId)return;stop(e);const control=pointer.control;pointer=null;if(control==='next'){if(e.type==='pointerup'){if(tutorialMode&&step>=3){playDemo();}else if(step<steps.length-1){step++;if(step===3&&!tutorialMode){heartOnly=true;narrationReady=false;theater.tutorialBounds=null;theater.send({command:'tutorial-bounds'});}render();}else finish();}return;}if(control==='launch'){if(launchDrag){const charge=game.charge;launchDrag=null;game.launchAiming=false;if(e.type==='pointerup')game.launch(charge);}else if(e.type==='pointerup')launch(false);else clearTouchControls();}else{game.input[control]=false;if(e.type==='pointerup')used(control);}}
 // Capture keyboard input so a held key cannot advance a step without pressing it.
 function keyboard(e){if(tutorialMode){stop(e);return;}if(waiting)return;const k=e.key.toLowerCase(),control=['arrowleft','z'].includes(k)?'left':['arrowright','c'].includes(k)?'right':k===' '?'launch':null;stop(e);if(!allowed(control)||game.paused||game.theaterFrozen)return;if(e.type==='keydown'){if(e.repeat||heldKey)return;heldKey={k,control};if(control==='launch')launch(true);else game.input[control]=true;}else if(heldKey?.k===k){heldKey=null;if(control==='launch')launch(false);else{game.input[control]=false;used(control);}}}
 const listeners=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['keydown',keyboard],['keyup',keyboard]];for(const [name,fn]of listeners)addEventListener(name,fn,{capture:true});
 const observer=new ResizeObserver(position);observer.observe(canvas);
 firstPlayGuide={allowed,used,demoFrozen:false,onEvent(e){if(tutorialMode){if(demo==='vortex'&&['vortex-ejected','vortex-returned'].includes(e.type))demoDone();return;}if(e.type==='launch'&&step===2){waiting=true;render();}else if(waiting&&['rollover','airdrop-rollover'].includes(e.type)){waiting=false;step=3;heartOnly=true;game.paused=true;clearTouchControls();theater.update(0,game);narrationReady=false;theater.tutorialBounds=null;theater.send({command:'tutorial-bounds'});render();}}};
 function finish(){if(!tutorialMode)localStorage.setItem('pinball-pirate-first-play-tutorial-v1','1');firstPlayGuide=null;theater.onTutorialBounds=null;theater.onCommandComplete=null;observer.disconnect();for(const [name,fn]of listeners)removeEventListener(name,fn,{capture:true});overlay.remove();canvas.tabIndex=0;canvas.focus();clearTouchControls();if(tutorialMode){if(window.AppControls?.exitGame)window.AppControls.exitGame();else location.href=new URL('res/main.html',document.baseURI).href;return;}game.paused=false;theater.update(0,game);window.dispatchEvent(new CustomEvent('pinball:tutorial-complete'));}
 function theaterBounds(){if(step!==3||waiting)return;narrationReady=true;render();}
 theater.onTutorialBounds=theaterBounds;
 if(tutorialMode){
  theater.onCommandComplete=e=>{if(demo&&e.id?.split(':')[1]===demo){if(e.type==='complete')demoDone();else{game.paused=true;notice('教學示範載入失敗');}}};
  firstPlayGuide.tick=dt=>{if(!demo)return;game.time+=dt;demoElapsed+=dt;if(demo==='vortex')game.vortexRecovery(dt);else if(demo==='post'&&game.centerPostRaised&&demoElapsed>=2)demoDone();};
 }



 render();
}
