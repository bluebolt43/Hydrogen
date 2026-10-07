/* Shared artwork event and state associations. */
(function(root){
'use strict';
// Resolve conditions and event timestamps.
function signal(o,g,t){
 const id=t.source||o.bind;
 switch(t.kind){
 case 'count':{const n=g.g.mechanisms.attackCounts[id];return {active:n-(g.attackRemaining.get(id)??n)>=(t.threshold||1),stamp:(t.threshold||1)===n&&(g.attackRemaining.get(id)??n)===n?g.attackCompletedAt.get(id):undefined};}
 case 'count-complete':return {stamp:g.attackCompletedAt.get(id)};
 case 'hole-capture':case 'hole-release':{const stamps=t.kind==='hole-capture'?g.holeCapturedAt:g.holeReleasedAt;return {stamp:stamps?.get(id)};}
 case 'attack':return {stamp:g.attackVisualAt?.get(id)};
 case 'multiball':return {stamp:g.sharkFlashAt};
 case 'rebound':return {stamp:g.reboundHitAt?.get(id)};
 case 'sensor':return {stamp:g.sensorHitAt?.get(id)};
 case 'rollover':return {active:g.rolloverLit(id)};
 case 'enemy-active':return {active:!g.enemyIntroPending&&!!g.enemyActive};
 case 'enemy-idle':return {active:!g.enemyIntroPending&&!g.enemyActive};
 case 'kickback':{const k=g.rescueById?.get(id);return {active:k?!!g.rescueState(k.layer||'lower').hits[k.side]:false};}
 case 'post':return {active:!!g.configuredPosts?.get(id)?.raised};
 default:return {active:o.indicator?.defaultState==='on'};
 }
}
const api={signal};if(typeof module!=='undefined')module.exports=api;else root.ArtEvents=api;
})(globalThis);

/* Artwork motion does not change lights or collision geometry. */
(function(root){
'use strict';
const {signal}=typeof module!=='undefined'&&module.exports?require('./art-events.js'):root.ArtEvents;
const games=new WeakMap();
function offset(o,g){
 const a=o.animation;if(!g||!a?.enabled||a.effect!=='shake')return [0,0];
 let cache=games.get(g);if(!cache||cache.epoch!==g.attackRemaining){cache={epoch:g.attackRemaining,items:new Map()};games.set(g,cache);}
 let v=cache.items.get(o);if(!v){v={start:-Infinity,stamp:-Infinity,active:[]};cache.items.set(o,v);}
 const inputs=[a.trigger||{},...(a.extraTriggers||[])].map(t=>signal(o,g,t));
 const stamp=Math.max(...inputs.map(input=>Number.isFinite(input.stamp)?input.stamp:-Infinity));
 if(stamp!==v.stamp){v.start=stamp;v.stamp=stamp;}
 if(inputs.some((input,i)=>input.active&&!v.active[i]))v.start=g.time;
 v.active=inputs.map(input=>!!input.active);
 const age=g.time-v.start,duration=a.duration??.75,amplitude=a.amplitude??2.5;
 if(age<0||age>=duration)return [0,0];
 const fade=Math.min(1,(duration-age)/.25);
 return [Math.sin(age*55)*amplitude*fade,Math.cos(age*47)*amplitude*.6*fade];
}
const api={offset};if(typeof module!=='undefined')module.exports=api;else root.ArtAnimation=api;
})(globalThis);

/* Shared image-layer renderer. Coordinates use the layout's world units. */
(function(root){
'use strict';
const defaultMap=()=>typeof module!=='undefined'&&module.exports?require('../indicator-lights.js').artMap():root.IndicatorLights.artMap();
const animation=()=>typeof module!=='undefined'&&module.exports?require('../art-animation.js'):root.ArtAnimation;
const planes=['background','lower','upper','top','foreground'];
function compactIndicator(o){
 if(!o.indicator)return o;
 const c={...o.indicator},t={...(c.trigger||{kind:'default'})},b={...(c.behavior||{mode:'keep'})};
 const triggers=[t,...(c.extraTriggers||[]).map(t=>({...t}))];
 for(const trigger of triggers){if(trigger.kind!=='count')delete trigger.threshold;if(['default','multiball','enemy-active','enemy-idle'].includes(trigger.kind))delete trigger.source;}
 c.trigger=t;
 if(c.type==='bumper'||triggers.length===1)delete c.extraTriggers;else c.extraTriggers=triggers.slice(1);
 if(!triggers.some(t=>['count','rollover'].includes(t.kind))){delete c.complete;delete c.completion;}
 if(c.completion){c.completion={...c.completion};if(c.completion.mode==='keep'){delete c.completion.onSeconds;delete c.completion.offSeconds;}else if(c.completion.mode==='once')delete c.completion.offSeconds;if(c.completion.mode!=='burst')delete c.completion.cycles;}
 if(c.type==='bumper'){delete c.off;delete c.on;delete c.behavior;delete c.fade;delete c.screenMask;}
 else{delete c.lv1;delete c.lv2;delete c.lv3;if(c.type==='binary')delete c.type;
 if(b.mode==='keep'){delete b.onSeconds;delete b.offSeconds;}else if(b.mode==='once')delete b.offSeconds;
 if(b.mode!=='burst')delete b.cycles;c.behavior=b;
 if(!c.fade?.enabled)delete c.fade;if(!c.screenMask)delete c.screenMask;
 }
 const result={...o,indicator:c};if((!o.state||o.state==='static')&&o.bind===t.source)delete result.bind;
 return result;
}
function validateIndicator(c){
 if(!c||typeof c!=='object'||Array.isArray(c))throw Error('燈號設定不合法');
 const states=c.type==='bumper'?['lv1','lv2','lv3']:['off','on'];
 if(c.type!==undefined&&!['binary','bumper'].includes(c.type))throw Error('燈號類型不合法');
 if(c.defaultState!==undefined&&!states.includes(c.defaultState))throw Error('燈號預設狀態不合法');
 for(const k of ['off','on','complete','lv1','lv2','lv3'])if(c[k]!==undefined&&(typeof c[k]!=='string'||c[k]&&(!/^res\/(?:img|hd_img)\/[^?#]+\.(png|webp|jpg|jpeg)$/i.test(c[k])||c[k].includes('..'))))throw Error('燈號圖片路徑不合法');
 
 if(c.extraTriggers!==undefined&&(!Array.isArray(c.extraTriggers)||c.extraTriggers.length>7||c.extraTriggers.some(t=>!t)))throw Error('關聯組數需為 1～8');
 for(const t of [c.trigger,...(c.extraTriggers||[])])if(t){
  if(typeof t!=='object'||Array.isArray(t)||t.source!==undefined&&typeof t.source!=='string')throw Error('燈號關聯來源不合法');
  if(!['default','count','count-complete','hole-capture','hole-release','attack','multiball','rebound','sensor','rollover','enemy-active','enemy-idle','kickback','post','level'].includes(t.kind))throw Error('燈號觸發條件不合法');
  if(t.threshold!==undefined&&(!Number.isInteger(t.threshold)||t.threshold<1||t.threshold>99))throw Error('燈號計數門檻不合法');
 }
 for(const b of [c.behavior,c.completion])if(b){if(!['keep','once','repeat','burst'].includes(b.mode))throw Error('燈號播放方式不合法');for(const k of ['onSeconds','offSeconds'])if(b[k]!==undefined&&(!Number.isFinite(b[k])||b[k]<=0))throw Error('燈號時間必須大於零');if(b.cycles!==undefined&&(!Number.isInteger(b.cycles)||b.cycles<1||b.cycles>99))throw Error('閃爍次數需為 1～99');}
 if(c.fade)for(const k of ['inSeconds','outSeconds'])if(c.fade[k]!==undefined&&(!Number.isFinite(c.fade[k])||c.fade[k]<0))throw Error('淡入淡出時間不合法');
}
function validate(items){
 if(!Array.isArray(items)||items.length>500)throw Error('圖片圖層最多 500 個');
 const ids=new Set();
 return items.map(o=>{
  if(!o||typeof o.id!=='string'||ids.has(o.id))throw Error('圖片 ID 重複或缺少');ids.add(o.id);
  if(!(o.src===''&&o.needsAsset)&&!(typeof o.src==='string'&&o.src.startsWith('blob:'))&&(typeof o.src!=='string'||!(/^res\/(?:img|hd_img)\/[^?#]+\.(png|webp|jpg|jpeg)$/i.test(o.src))||o.src.includes('..')))throw Error('圖片只保存 res/img 或 res/hd_img 路徑，不接受 Base64；請先將原圖放入 assets');
  for(const k of ['x','y','width','height','angle','opacity'])if(!Number.isFinite(o[k]))throw Error('圖片座標或尺寸不合法');
  if(o.width<=0||o.height<=0||o.width>5000||o.height>5000||o.opacity<0||o.opacity>1||!planes.includes(o.plane))throw Error('圖片大小、透明度或圖層不合法');
  if(!Array.isArray(o.crop)||o.crop.length!==4||!o.crop.every(Number.isFinite)||o.crop[0]<0||o.crop[1]<0||o.crop[2]<=0||o.crop[3]<=0)throw Error('裁切範圍不合法');
  if(o.frameStride!==undefined&&(!Number.isFinite(o.frameStride)||o.frameStride<=0))throw Error('換圖間距必須大於 0');
  if(o.indicator!==undefined)validateIndicator(o.indicator);
  if(o.animation!==undefined){
   const a=o.animation;
   if(!a||a.effect!=='shake'||typeof a.enabled!=='boolean'||!Number.isFinite(a.duration)||a.duration<=0||!Number.isFinite(a.amplitude)||a.amplitude<0)throw Error('美術動畫設定不合法');
   validateIndicator({trigger:a.trigger,extraTriggers:a.extraTriggers});
  }
  const count=o.frames??1;
  if(!Number.isInteger(count)||count<1||count>32||!['x','y'].includes(o.frameAxis||'x'))throw Error('狀態格數不合法');
  return {...o,crop:[...o.crop],frames:count,frameAxis:o.frameAxis||'x'};
 });
}
class Renderer{
 constructor(base='',map=defaultMap()){this.map=map;this.base=base;this.cache=new Map();}
 image(src){if(!this.cache.has(src)){const img=new Image();if(src)img.src=src.startsWith('blob:')?src:this.base+src;this.cache.set(src,img);}return this.cache.get(src);}
 draw(ctx,items,plane,game=null){
  for(const o of items){if(o.state==='ball-layer'||o.plane!==plane||o.hidden)continue;
   this.beforeDraw?.(ctx,o);
   const targetId=game&&o.bind&&(game.targetGroups?.some(g=>g.targets.includes(o.bind))?o.bind:game.targetGroups?.some(g=>g.targets.includes(o.bind+'-1'))?o.bind+'-1':null);
   let targetAlpha=1;
   const hitId=targetId||(o.state==='target'?o.bind:null);
   if(game&&game.targetHits.has(hitId)){const age=game.time-(game.targetHitAt?.get(hitId)??game.time);targetAlpha=Math.max(0,1-age/.2);if(!targetAlpha)continue;}
   const state=this.map.artState(o,game,this);if(!state)continue;
   const {src,baseSrc,frame}=state,baseImage=this.image(baseSrc),img=this.image(src);
   let [sx,sy,sw,sh]=o.crop;if(o.frameAxis==='y')sy+=frame*(o.frameStride||sh);else sx+=frame*(o.frameStride||sw);
   const ready=(image,x,y)=>image.complete&&image.naturalWidth&&x+sw<=image.naturalWidth+.01&&y+sh<=image.naturalHeight+.01;
   if(!ready(baseImage,o.crop[0],o.crop[1])&&!ready(img,sx,sy))continue;
   ctx.save();ctx.globalAlpha*=o.opacity*targetAlpha*(state.alpha??1);
   if(o.state==='guide-arrow'){const time=game?game.time:performance.now()/1000;ctx.globalAlpha*=.3+.7*(.5+.5*Math.cos(time*Math.PI*3));}
   const f=game&&game.flippers.find(f=>f.id===o.bind);
   if(f){ctx.translate(...f.pivot);ctx.rotate(f.angle-f.rest);ctx.translate(-f.pivot[0],-f.pivot[1]);}
   const vortexAge=game&&o.bind&&o.state==='vortex'&&state.active&&game.vortexActivatedAt!=null?Math.max(0,game.time-game.vortexActivatedAt):null;
   if(game&&o.bind&&o.state==='vortex'){
    const fade=vortexAge===null?0:Math.min(1,vortexAge/.8);
    ctx.globalAlpha*=.5+.5*fade*fade*(3-2*fade);
   }
   const motion=o.animation?animation().offset(o,game):[0,0];
   let x=o.x+motion[0],y=o.y+motion[1];
   if(game&&o.state==='plunger'&&o.bind==='plunger'){
    const p=game.g.plunger,age=game.time-game.plungerReleasedAt;
    const ready=game.balls.some(b=>b.state==='ready');
    const pull=ready?game.charge:(age>=0&&age<.08?game.plungerReleaseCharge*(1-age/.08)**2:0);
    const angle=o.angle*Math.PI/180;
    // Anchor the sprite's top midpoint to the physical ball contact point.
    x=p.x-Math.sin(angle)*o.height/2;y=p.rest_y+p.stroke*pull+Math.cos(angle)*o.height/2;
   }
   let sway=0;
   const flagTime=game&&o.bind?game.flagHitAt?.get(o.bind):undefined;
   if(flagTime!==undefined){
    const age=game.time-flagTime,duration=1.2;
    if(age>=0&&age<duration){const envelope=(1-age/duration)**2;
     x+=Math.sin(age*Math.PI*5)*2*envelope;
     y+=Math.sin(age*Math.PI*7)*1.5*envelope;
     sway=Math.sin(age*Math.PI*5)*.1*envelope;
    }
   }
   if(vortexAge!==null){
    // The vortex core is not necessarily the sprite rectangle's midpoint.
    const center=game.g.lower.find(shape=>shape.id===o.bind)?.center||[x,y];
    ctx.translate(...center);ctx.rotate(Math.min(vortexAge,15)*Math.PI/3);ctx.translate(-center[0],-center[1]);
   }
   ctx.translate(x,y);ctx.rotate(o.angle*Math.PI/180+sway);ctx.scale(o.flipX?-1:1,o.flipY?-1:1);
   // Keep the default image underneath every state/frame overlay.
   if(ready(baseImage,o.crop[0],o.crop[1]))ctx.drawImage(baseImage,o.crop[0],o.crop[1],sw,sh,-o.width/2,-o.height/2,o.width,o.height);
   if((src!==baseSrc||frame!==0)&&ready(img,sx,sy))ctx.drawImage(img,sx,sy,sw,sh,-o.width/2,-o.height/2,o.width,o.height);
   ctx.restore();
  }
 }
}
function integerGeometry(o){
 const result={...o,crop:o.crop.map(Math.round)};
 for(const k of ['x','y','width','height'])result[k]=Math.round(o[k]);
 result.width=Math.max(1,result.width);result.height=Math.max(1,result.height);
 if(o.frameStride!==undefined)result.frameStride=Math.max(1,Math.round(o.frameStride));
 return result;
}
function serializable(items){return items.map(o=>{const result=compactIndicator(integerGeometry(o));if(!o.src||o.src.startsWith('blob:')||o.src.startsWith('data:')){result.src='';result.needsAsset=true;}return result;});}
const api={compactIndicator,validateIndicator,planes,validate,integerGeometry,serializable,Renderer};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PinballArt=api;
})(typeof window!=='undefined'?window:globalThis);

/* Steampunk's vortex bonus wheel. Visual time keeps running while physics is frozen. */
(function(root){
'use strict';
class Controller{
 constructor(game,config){this.game=game;this.config=config;this.clock=0;this.multiplier=1;this.reset();}
 reset(){this.pendingMultiball=false;this.phase='idle';this.active=false;this.index=this.winner=-1;this.releaseAt=-Infinity;this.frozen=false;this.game.bonusFrozen=false;this.cycleBoss=false;}
 open(){this.phase='open';this.active=true;this.openedAt=this.phaseAt=this.clock;this.index=this.winner=-1;this.cycleBoss=!!this.game.enemyActive;}
 close(){this.active=false;this.phase=this.winner>=0&&!this.cycleBoss?'settled':'idle';}
 event(type,data){if(type==='new-game'){this.multiplier=1;this.reset();}if(type==='ready'&&!this.game.armedHoles?.has(this.config.hole))this.reset();if(data.id!==this.config.hole)return;if(type==='vortex-activated')this.open();if(type==='vortex-expired'||type==='vortex-deactivated')this.close();if(type==='release')this.releaseAt=this.clock;}
 capture(){if(!this.active)this.open();this.cycleBoss=!!this.game.enemyActive;this.phase=this.cycleBoss?'bossflash':'spin';this.phaseAt=this.clock;this.frozen=this.game.bonusFrozen=true;this.index=0;if(!this.cycleBoss){this.target=Math.floor((this.game.random||Math.random)()*12);this.steps=48+this.target;}}
 reward(){const g=this.game,r=this.config.rewards[this.winner];
  if(r.kind==='score')g.scoreHit('steampunk-bonus-reward',r.value,0);
  if(r.kind==='multiplier')this.multiplier=r.value;
  if(r.kind==='ball')for(let i=0;i<r.value;i++)g.awardExtraLife('bonus-wheel');
  if(r.kind==='multi'){this.pendingMultiball=true;g.multiballAwards++;g.emit('multiball-awarded',{count:g.multiballAwards});}
  if(r.kind==='enemy'&&!g.enemyActive){g.enemyActive=true;g.emit('enemy-spawn-requested',{group:'steampunk-bonus'});}
  g.emit('bonus-awarded',{position:this.winner+1,kind:r.kind,value:r.value,multiplier:this.multiplier});
 }
 launchMultiball(){
  const g=this.game,previous=g.ball;
  for(const id of this.config.multiballHoles||[]){
   const socket=g.socketsById.get(id);if(!socket)continue;
   if(g.balls.filter(b=>b.state!=='drained').length+g.freeBallQueue>=3){g.awardExtraLife('multiball',socket.center);continue;}
   const layer=g.g.upper_parts.includes(socket)?'tavern':(g.g.top_parts||[]).includes(socket)?'top':'lower';
   const ball={p:[...socket.center],v:[0,0],layer,z:0,state:'captured',immunity:0,lastPortal:-10,trail:[],free:true};
   g.balls.push(ball);g.ball=ball;g.held={id,release:[...socket.center],layer,direction:socket.release_direction,speed:0};g.release();
   g.emit('free-ball-launch',{id,position:[...ball.p],layer});
  }
  g.ball=previous;g.selectBall();
 }
 finish(){const g=this.game;this.frozen=g.bonusFrozen=false;const held=g.balls.find(b=>b.state==='captured'&&b.held?.id===this.config.hole);if(held){g.ball=held;g.release();g.selectBall();}g.consumeHole(this.config.hole);if(this.pendingMultiball){this.pendingMultiball=false;this.launchMultiball();}if(this.cycleBoss)g.fireObjectAttack(this.config.hole);}
 update(dt){if(this.game.paused)return;this.clock+=dt;
  if(this.phase==='open'&&this.cycleBoss!==!!this.game.enemyActive)this.cycleBoss=!!this.game.enemyActive;
  const age=this.clock-this.phaseAt;
  if(this.phase==='spin'){const t=Math.min(1,age/this.config.spinSeconds);this.index=Math.floor(this.steps*(1-(1-t)**3))%12;if(t>=1){this.index=this.winner=this.target;this.phase='winflash';this.phaseAt=this.clock;this.reward();}}
  else if(this.phase==='winflash'&&age>=this.config.winFlashSeconds)this.finish();
  else if(this.phase==='bossflash'&&age>=this.config.bossFlashSeconds)this.finish();
 }
 visual(){const lights=Array(12).fill(0),icons=Array(12).fill(false),age=this.clock-this.phaseAt;
  if(['open','spin','winflash','bossflash'].includes(this.phase))icons.fill(true);
  if(this.phase==='open'){const t=age%3;lights.fill(t<1.5?Math.min(1,t/.4):Math.max(0,1-(t-1.5)/.4));}
  if(this.phase==='bossflash')lights.fill(Math.floor(age/.18)%2===0?1:0);
  if(this.phase==='spin')lights[this.index]=1;
  if(this.winner>=0&&['winflash','settled'].includes(this.phase)){icons[this.winner]=true;lights[this.winner]=this.phase==='winflash'&&Math.floor(age/.16)%2===0?1:0;}
  return {lights,icons};
 }
 draw(ctx,o,renderer){const c=this.config,p=c.geometry,v=this.visual(),image=src=>renderer.image(src),draw=(src,crop,x,y,w,h)=>{const im=image(src);if(im.complete&&im.naturalWidth){const [sx,sy,sw,sh]=crop||[0,0,im.naturalWidth,im.naturalHeight];ctx.drawImage(im,sx,sy,sw,sh,x-w/2,y-h/2,w,h);}};
  ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.angle*Math.PI/180);ctx.scale(o.width/p.canvasSize,o.height/p.canvasSize);ctx.translate(-p.cx,-p.cy);ctx.globalAlpha=o.opacity;
  if(this.active){ctx.save();ctx.beginPath();ctx.arc(p.cx,p.cy,p.inner,0,Math.PI*2);ctx.clip();ctx.globalAlpha*=.5*Math.min(1,(this.clock-this.openedAt)/.8);ctx.translate(p.cx,p.cy);ctx.rotate((this.clock-this.openedAt)*Math.PI*2/18);draw(c.sphere,null,0,0,p.inner*2,p.inner*2);ctx.restore();}
  for(let i=0;i<12;i++){const a=(-90+p.startAngle+i*30)*Math.PI/180,b=a+p.angle*Math.PI/180;ctx.beginPath();ctx.arc(p.cx,p.cy,p.outer,a,b);ctx.arc(p.cx,p.cy,p.inner,b,a,true);ctx.closePath();ctx.fillStyle='#292c29';ctx.fill();if(v.lights[i]){ctx.save();ctx.globalAlpha*=v.lights[i]*p.opacity;ctx.fillStyle=p.color;ctx.fill();ctx.restore();}}
  draw(o.src,o.crop,p.canvasSize/2,p.canvasSize/2,p.canvasSize,p.canvasSize);
  for(let i=0;i<12;i++){if(!v.icons[i])continue;const r=c.rewards[i],a=r.art;ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.angle*Math.PI/180);if(this.cycleBoss)draw(c.mine.src,c.mine.crop,0,0,110,125);else draw(a.src,a.crop,0,0,a.width,a.height);ctx.restore();}
  const releaseAge=this.clock-this.releaseAt;if(releaseAge>=0&&releaseAge<.8){const t=releaseAge/.8;ctx.save();ctx.globalAlpha*=1-t;ctx.strokeStyle='#39bfff';ctx.shadowColor='#168fff';ctx.shadowBlur=14;ctx.lineWidth=7*(1-t)+2;ctx.beginPath();ctx.arc(p.cx,p.cy,34+100*(1-(1-t)**2),0,Math.PI*2);ctx.stroke();ctx.restore();}ctx.restore();
 }
}
function createGame(Base){return class extends Base{
 constructor(g){super(g);if(g.gameplay?.steampunkBonus)this.bonus=new Controller(this,g.gameplay.steampunkBonus);}
 emit(type,data={}){super.emit(type,data);this.bonus?.event(type,data);}
 beforeStep(dt){return !this.bonusFrozen&&super.beforeStep(dt);}
 rulesInterrupted(){return this.bonusFrozen||super.rulesInterrupted();}
 scoreHit(id,points,cooldown){return super.scoreHit(id,points*(this.bonus?.multiplier||1),cooldown);}
 onCapture(id){if(this.bonus&&id===this.bonus.config.hole){this.bonus.capture();return;}super.onCapture(id);}
};}
const api={Controller,createGame};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SteampunkBonus=api;
})(globalThis);

/* Steampunk-only scenery motion; never changes the layout or physical objects. */
(function(root){
'use strict';
const Art=typeof module!=='undefined'&&module.exports?require('./art-layers.js'):root.PinballArt;
function pose(o,time,launchAt,resetAt=null){
 const name=(o.src||'').split('/').pop();
 if(name==='steampunk-gear.png')return {...o,angle:o.angle+time*20};
 if(name==='steampunk-pressure-needle.png'){
  const keys=[[0,-55],[.45,55],[.55,51],[.65,57],[1,-55]],t=(time%4)/4;
  const i=keys.findIndex((k,i)=>i>0&&t<=k[0]),a=keys[i-1],b=keys[i],u=(t-a[0])/(b[0]-a[0]);
  return {...o,angle:o.angle+a[1]+(b[1]-a[1])*(.5-.5*Math.cos(u*Math.PI))};
 }
 if(name==='steampunk-rocket.png'&&launchAt!==null){
  if(resetAt!==null&&resetAt>=launchAt)return {...o,opacity:o.opacity*Math.max(0,Math.min(1,(time-resetAt)/.5))};
  const age=time-launchAt;
  if(age>=0&&age<.3)return {...o,x:o.x+Math.sin(age*90)*.8};
  if(age>=.3&&age<1.8){const t=(age-.3)/1.5;return {...o,y:o.y-(o.y+o.height+30)*t*t,opacity:o.opacity*Math.min(1,(1-t)*5)};}
  if(age>=1.8)return {...o,opacity:0};
 }
 return o;
}
function missionArt(o,game){
 if(o.src?.endsWith('/steampunk-mission-arrow-off.png')){
  const attack=o.indicator?.trigger?.kind==='enemy-active',unlock=o.bind==='targetGroup-004';
  if(attack||unlock){
   const rule=game.configuredGroups?.find(r=>r.id===o.bind);
   const available=!!game.enemyActive&&!game.enemyIntroPending&&(!unlock||(!!rule&&rule.unlocked<rule.blockers.length))&&!(rule?.action==='blackHole'&&game.armedHoles?.has(rule.hole));
   // Mission conditions take precedence over the idle attract-light sequence.
   const b=o.indicator.behavior,on=b?.onSeconds||.5,off=b?.offSeconds||.5;
   const lit=available&&(!attack||b?.mode!=='repeat'||(game.time||0)%(on+off)<on);
   return {...o,indicator:undefined,src:lit?o.indicator.on:o.indicator.off};
  }
 }
 if(o.state!=='guide-arrow')return o;
 const rule=game.configuredGroups?.find(r=>r.id===o.bind);
 if(!rule)return o;
 let available=true;
 if(rule.action==='unblock')available=rule.unlocked<rule.blockers.length;
 if(rule.action==='upgrade')available=rule.bumpers.some(id=>game.bumperLevel(id)<3);
 if(rule.action==='boss')available=!game.enemyActive&&!game.enemyIntroPending;
 if(rule.action==='blackHole')available=!game.armedHoles.has(rule.hole);
 return available?o:{...o,hidden:true};
}
function unlockArt(o,game){
 if(o.src.endsWith('/steampunk-target-gear-standing-off.png')){
  const rule=game.targetRuleById?.get(o.bind);
  const fighting=!!game.enemyActive&&!game.enemyIntroPending;
  let available=false;
  if(rule?.action==='unblock')available=fighting&&rule.unlocked<rule.blockers.length;
  if(rule?.action==='upgrade')available=rule.bumpers.some(id=>game.bumperLevel(id)<3);
  if(rule?.action==='blackHole')available=!game.armedHoles.has(rule.hole);
  // Retain bind so the shared target renderer fades a hit target out.
  const lit=available&&(!fighting||(game.time||0)%1<.5);
  return {...o,indicator:undefined,src:lit?o.indicator.on:o.indicator.off};
 }
 if(o.src.endsWith('/steampunk-blocker.png')&&game.isBlockerDisabled(o.bind))return {...o,hidden:true};
 if(!o.src.endsWith('/steampunk-unlock-lights-0.png'))return o;
 const rule=game.configuredGroups?.find(r=>r.id==='targetGroup-004');
 const lights=typeof module!=='undefined'&&module.exports?require('../indicator-lights.js'):root.IndicatorLights;
 if(o.indicator?.group&&lights.attractLight(game,o)!==null)return o;
 const count=Math.max(0,Math.min(2,rule?.unlocked||0));
 return {...o,indicator:undefined,src:`res/img/steampunk-unlock-lights-${count}.png`};
}
class Renderer extends Art.Renderer{
 constructor(base,map){super(base,map);this.launchAt=null;this.resetAt=null;}
 onEvent(e){
  if(e.type==='new-game'){this.launchAt=null;this.resetAt=null;}
  if(e.type==='blocker-unlocked'&&e.id==='targetGroup-004'&&e.total>0&&e.count===e.total){this.launchAt=e.time;this.resetAt=null;}
  if(e.type==='blockers-reset'&&e.id==='targetGroup-004')this.resetAt=e.time;
 }
 draw(ctx,items,plane,game){for(const o of items){if(o.id===game?.bonus?.config.artId){if(!o.hidden&&o.plane===plane)game.bonus.draw(ctx,o,this);}else this.drawItems(ctx,[o],plane,game);}}
 drawItems(ctx,items,plane,game){super.draw(ctx,game?items.map(o=>pose(missionArt(unlockArt(o,game),game),game.time,this.launchAt,this.resetAt)):items,plane,game);}
}
const api={Renderer,pose,unlockArt,missionArt};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SteampunkArt=api;
})(globalThis);
