/* Shared artwork event and state associations. */
(function(root){
'use strict';
// Resolve conditions and event timestamps.
function signal(o,g,t){
 const id=t.source||o.bind;
 switch(t.kind){
 case 'game-started':return {active:!!g.hasLaunchedOnce};
 case 'gap-launch':return {stamp:g.gapLaunchAt?.get(id)};
 case 'hole-count':return {active:(g.holeCaptureCounts?.get(id)||0)>=(t.threshold||2)};
 case 'hole-active':return {active:!!g.armedHoles?.has(id)};
 case 'gap-count':return {active:id===g.g.gameplay?.touhouGap?.hole&&(g.gapLock?.count||0)>=(t.threshold||1)};
 case 'count':{const n=g.g.mechanisms.attackCounts[id];return {active:n-(g.attackRemaining.get(id)??n)>=(t.threshold||1),stamp:(t.threshold||1)===n&&(g.attackRemaining.get(id)??n)===n?g.attackCompletedAt.get(id):undefined};}
 case 'count-complete':return {stamp:g.attackCompletedAt.get(id)};
 case 'hole-capture':case 'hole-release':{const stamps=t.kind==='hole-capture'?g.holeCapturedAt:g.holeReleasedAt;return {stamp:stamps?.get(id)};}
 case 'attack':return {stamp:g.attackVisualAt?.get(id)};
 case 'multiball':return {stamp:g.sharkFlashAt};
 case 'target':return {stamp:g.targetVisualAt?.get(id)};
 case 'layer-entry':return {stamp:g.layerEnteredAt?.get(id)};
 case 'flipper':return {stamp:g.flipperHitAt?.get(id)};
 case 'flag':return {stamp:g.flagHitAt?.get(id)};
 case 'rebound':return {stamp:g.reboundHitAt?.get(id)};
 case 'sensor':return {stamp:g.sensorHitAt?.get(id)};
 case 'rollover':return {active:g.rolloverLit(id)};
 case 'enemy-active':return {active:!g.enemyIntroPending&&!!g.enemyActive};
 case 'enemy-idle':return {active:!g.enemyIntroPending&&!g.enemyActive};
 case 'kickback':{const k=g.rescueById?.get(id);return {active:k?!!g.rescueState(k.layer||'lower').hits[k.side]:false};}
 case 'level':return {active:g.bumperLevel(id)>=(t.threshold||1)};
 case 'object-hidden':return {active:!!g.hiddenObjects?.has(id)};
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
function age(o,g){
 const a=o.animation;if(!g||!a?.enabled)return Infinity;
 let cache=games.get(g);if(!cache||cache.epoch!==g.attackRemaining){cache={epoch:g.attackRemaining,items:new Map()};games.set(g,cache);}
 let v=cache.items.get(o);if(!v){v={start:-Infinity,stamp:-Infinity,active:[]};cache.items.set(o,v);}
 const inputs=[a.trigger||{},...(a.extraTriggers||[])].map(t=>signal(o,g,t));
 const stamp=Math.max(...inputs.map(input=>Number.isFinite(input.stamp)?input.stamp:-Infinity));
 if(stamp!==v.stamp){v.start=stamp;v.stamp=stamp;}
 if(inputs.some((input,i)=>input.active&&!v.active[i]))v.start=g.time;
 v.active=inputs.map(input=>!!input.active);
 return g.time-v.start;
}
function offset(o,g){
 const a=o.animation;if(a?.effect!=='shake')return [0,0];
 const elapsed=age(o,g),duration=a.duration??.75,amplitude=a.amplitude??2.5;
 if(elapsed<0||elapsed>=duration)return [0,0];
 const fade=Math.min(1,(duration-elapsed)/.25);
 return [Math.sin(elapsed*55)*amplitude*fade,Math.cos(elapsed*47)*amplitude*.6*fade];
}
function flipScale(o,g){
 const a=o.animation;if(a?.effect!=='flip')return 1;
 const elapsed=age(o,g),duration=a.duration??1.5;
 if(elapsed<0||elapsed>=duration)return 1;
 const t=elapsed/duration,progress=1-(1-t)**2;
 return Math.cos(progress*(a.turns??3)*Math.PI*2);
}
const api={offset,flipScale};if(typeof module!=='undefined')module.exports=api;else root.ArtAnimation=api;
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
 for(const trigger of triggers){if(c.type==='bumper'||!['count','level','gap-count','hole-count'].includes(trigger.kind))delete trigger.threshold;if(['default','multiball','enemy-active','enemy-idle','game-started'].includes(trigger.kind))delete trigger.source;}
 c.trigger=t;
 if(c.type==='bumper'||triggers.length===1)delete c.extraTriggers;else c.extraTriggers=triggers.slice(1);
 if(!triggers.some(t=>['count','rollover','kickback','level','enemy-target','hole-count'].includes(t.kind))){delete c.complete;delete c.completion;}
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
 if(c.keepLevelOnHit!==undefined&&typeof c.keepLevelOnHit!=='boolean')throw Error('Bumper 碰撞等級設定不合法');
 if(c.halo!==undefined&&typeof c.halo!=='boolean')throw Error('燈號光暈設定不合法');
 if(c.attractState!==undefined&&(!['on','complete'].includes(c.attractState)||c.attractState==='complete'&&!c.complete))throw Error('跑馬燈亮燈狀態不合法');
 if(c.glow){
  if(c.glow.attractUseOff!==undefined&&typeof c.glow.attractUseOff!=='boolean')throw Error('跑馬燈底圖設定不合法');
  for(const key of ['on','complete'])if(c.glow[key]!==undefined&&!/^#[0-9a-f]{6}$/i.test(c.glow[key]))throw Error('燈號發光顏色不合法');
  for(const seconds of Object.values(c.glow.pulse||{}))if(!Number.isFinite(seconds)||seconds<=0)throw Error('燈號發光週期必須大於零');
  if(c.glow.preview){const p=c.glow.preview;if(!p.trigger||!/^#[0-9a-f]{6}$/i.test(p.color)||!Number.isFinite(p.pulseSeconds)||p.pulseSeconds<=0)throw Error('燈號預覽設定不合法');validateIndicator({trigger:p.trigger});}
 }
 if(c.impactFlash!==undefined&&typeof c.impactFlash!=='boolean')throw Error('命中／Combo 閃光設定不合法');
 const states=c.type==='bumper'?['lv1','lv2','lv3']:['off','on'];
 if(c.type!==undefined&&!['binary','bumper'].includes(c.type))throw Error('燈號類型不合法');
 if(c.defaultState!==undefined&&!states.includes(c.defaultState))throw Error('燈號預設狀態不合法');
 for(const k of ['off','on','complete','lv1','lv2','lv3'])if(c[k]!==undefined&&(typeof c[k]!=='string'||c[k]&&(!/^res\/(?:img|hd_img)\/[^?#]+\.(png|webp|jpg|jpeg)$/i.test(c[k])||c[k].includes('..'))))throw Error('燈號圖片路徑不合法');
 
 if(c.extraTriggers!==undefined&&(!Array.isArray(c.extraTriggers)||c.extraTriggers.length>7||c.extraTriggers.some(t=>!t)))throw Error('關聯組數需為 1～8');
 for(const t of [c.trigger,...(c.extraTriggers||[])])if(t){
  if(typeof t!=='object'||Array.isArray(t)||t.source!==undefined&&typeof t.source!=='string')throw Error('燈號關聯來源不合法');
  if(!['default','game-started','hole-count','gap-output','gap-launch','hole-active','gap-count','enemy-target','count','count-complete','hole-capture','hole-release','attack','multiball','rebound','sensor','rollover','enemy-active','enemy-idle','kickback','post','level','object-hidden','flipper','flag','target','layer-entry'].includes(t.kind))throw Error('燈號觸發條件不合法');
  if(t.threshold!==undefined&&(!Number.isInteger(t.threshold)||t.threshold<1||t.threshold>99))throw Error('燈號計數門檻不合法');
  if(t.kind==='hole-count'&&t.threshold!==undefined&&t.threshold<2)throw Error('進洞三階段門檻至少 2 次');
 }
 for(const b of [c.behavior,c.completion,c.releaseBehavior])if(b){if(!['keep','once','repeat','burst'].includes(b.mode))throw Error('燈號播放方式不合法');for(const k of ['onSeconds','offSeconds'])if(b[k]!==undefined&&(!Number.isFinite(b[k])||b[k]<=0))throw Error('燈號時間必須大於零');if(b.cycles!==undefined&&(!Number.isInteger(b.cycles)||b.cycles<1||b.cycles>99))throw Error('閃爍次數需為 1～99');}
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
  if(o.blendMode!==undefined&&!['source-over','multiply'].includes(o.blendMode))throw Error('圖片混合模式不合法');
  if(o.indicator!==undefined)validateIndicator(o.indicator);
  if(o.animation!==undefined){
   const a=o.animation;
   if(!a||!['shake','flip'].includes(a.effect)||typeof a.enabled!=='boolean'||!Number.isFinite(a.duration)||a.duration<=0||!Number.isFinite(a.amplitude)||a.amplitude<0)throw Error('美術動畫設定不合法');
   if(a.effect==='flip'&&a.turns!==undefined&&(!Number.isInteger(a.turns)||a.turns<1||a.turns>20))throw Error('翻轉圈數需為 1～20');
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
 imageKey(img){
  this.imageKeys??=new WeakMap();const src=img.src;let key=this.imageKeys.get(img);
  if(!key||key.src!==src){key={src,id:this.imageKeySerial=(this.imageKeySerial||0)+1};this.imageKeys.set(img,key);}
  return key.id;
 }
 // Gameplay opts in; editors retain original pixels. Cache only raster content,
 // so transforms, light state, opacity and animation still update every frame.
 drawRaster(ctx,img,sx,sy,sw,sh,width,height){
  if(!this.rasterCacheEnabled){ctx.drawImage(img,sx,sy,sw,sh,-width/2,-height/2,width,height);return;}
  const t=ctx.getTransform(),scale=Math.ceil(Math.max(Math.hypot(t.a,t.b),Math.hypot(t.c,t.d))*2)/2;
  const w=Math.max(1,Math.min(2048,Math.ceil(width*scale))),h=Math.max(1,Math.min(2048,Math.ceil(height*scale)));
  const brightness=this.brightness??1,key=JSON.stringify([this.imageKey(img),sx,sy,sw,sh,w,h,brightness]);
  this.rasters??=new Map();this.rasterPixels??=0;
  let entry=this.rasters.get(key);
  if(!entry){
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   const c=canvas.getContext('2d');c.drawImage(img,sx,sy,sw,sh,0,0,w,h);
   if(brightness<1){c.globalCompositeOperation='source-atop';c.fillStyle=`rgba(0,0,0,${1-brightness})`;c.fillRect(0,0,w,h);}
   entry={canvas,pixels:w*h};
   // Bound prepared pixels to 64 MiB, including obsolete viewport sizes.
   while(this.rasterPixels+entry.pixels>16777216&&this.rasters.size){const oldest=this.rasters.keys().next().value;this.rasterPixels-=this.rasters.get(oldest).pixels;this.rasters.delete(oldest);}
   this.rasterPixels+=entry.pixels;
  }
  this.rasters.delete(key);this.rasters.set(key,entry);
  ctx.drawImage(entry.canvas,-width/2,-height/2,width,height);
 }
 // Cache the colored silhouette and soft edge once, rather than filtering each frame.
 drawGlow(ctx,img,sx,sy,sw,sh,width,height,glow){
  this.glows??=new Map();
  const t=ctx.getTransform(),scale=Math.max(2,Math.ceil(Math.hypot(t.a,t.b))),w=Math.ceil(width*scale),h=Math.ceil(height*scale),pad=Math.max(4,Math.ceil(scale*2));
  const key=JSON.stringify([this.imageKey(img),sx,sy,sw,sh,w,h,glow.color]);let canvas=this.glows.get(key);
  if(!canvas){
   const mask=document.createElement('canvas');mask.width=w;mask.height=h;const m=mask.getContext('2d');
   m.drawImage(img,sx,sy,sw,sh,0,0,w,h);m.globalCompositeOperation='source-in';m.fillStyle=glow.color;m.fillRect(0,0,w,h);
   canvas=document.createElement('canvas');canvas.width=w+pad*2;canvas.height=h+pad*2;const c=canvas.getContext('2d');
   c.shadowColor=glow.color;c.shadowBlur=pad*.7;c.globalAlpha=.7;c.drawImage(mask,pad,pad);c.shadowBlur=0;
   c.globalCompositeOperation='destination-out';c.globalAlpha=1;c.drawImage(mask,pad,pad);
   c.globalCompositeOperation='source-over';c.globalAlpha=.48;c.drawImage(mask,pad,pad);
   if(this.glows.size>=128)this.glows.delete(this.glows.keys().next().value);this.glows.set(key,canvas);
  }
  ctx.save();ctx.globalAlpha*=glow.alpha;ctx.drawImage(canvas,-width/2-pad/scale,-height/2-pad/scale,canvas.width/scale,canvas.height/scale);ctx.restore();
 }
 // Reuse a static prefix; indicator/animated art stays live above it.
 drawStaticCache(ctx,items,plane,game){
  let count=0;
  while(count<items.length){const a=items[count];if(a.plane!==plane||a.hidden||a.indicator||a.animation?.enabled||a.bind||a.frames>1||a.blendMode&&a.blendMode!=='source-over'||a.state&&a.state!=='static')break;count++;}
  if(count<2)return false;
  const batch=items.slice(0,count),images=batch.map(a=>this.image(a.src)),t=ctx.getTransform();
  if(t.b||t.c||t.a<=0||t.d<=0||ctx.globalAlpha!==1||ctx.globalCompositeOperation!=='source-over'||ctx.shadowBlur>0||ctx.filter&&ctx.filter!=='none'||!images.every(i=>i.complete&&i.naturalWidth))return false;
  this.staticCaches??=new Map();const slot=plane+':'+batch[0].id;
  const key=JSON.stringify([t.a,t.d,this.brightness,ctx.imageSmoothingEnabled,ctx.imageSmoothingQuality,batch]);let cached=this.staticCaches.get(slot);
  if(!cached||cached.key!==key||images.some((im,i)=>im!==cached.images[i])){
   let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
   for(const a of batch){const angle=a.angle*Math.PI/180,c=Math.abs(Math.cos(angle)),s=Math.abs(Math.sin(angle)),w=(a.width*c+a.height*s)/2,h=(a.width*s+a.height*c)/2;x0=Math.min(x0,a.x-w);x1=Math.max(x1,a.x+w);y0=Math.min(y0,a.y-h);y1=Math.max(y1,a.y+h);}
   const left=Math.floor(x0*t.a+t.e),top=Math.floor(y0*t.d+t.f),width=Math.ceil(x1*t.a+t.e)-left,height=Math.ceil(y1*t.d+t.f)-top;
   if(width*height>4194304)return false;
   const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
   const c=canvas.getContext('2d');c.setTransform(t.a,0,0,t.d,t.e-left,t.f-top);c.imageSmoothingEnabled=ctx.imageSmoothingEnabled;c.imageSmoothingQuality=ctx.imageSmoothingQuality;
   this.buildingBackground=true;try{Renderer.prototype.draw.call(this,c,batch,plane,game);}finally{this.buildingBackground=false;}
   this.staticCaches.delete(slot);
   while([...this.staticCaches.values()].reduce((n,c)=>n+c.canvas.width*c.canvas.height,0)+width*height>4194304)this.staticCaches.delete(this.staticCaches.keys().next().value);
   cached={key,images,canvas,left,top,e:t.e,f:t.f};this.staticCaches.set(slot,cached);
  }else for(const a of batch)this.beforeDraw?.(ctx,a);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(cached.canvas,cached.left+t.e-cached.e,cached.top+t.f-cached.f);ctx.restore();
  Renderer.prototype.draw.call(this,ctx,items.slice(count),plane,game);return true;
 }
 draw(ctx,items,plane,game=null){
  if(!this.buildingBackground&&(this.backgroundCacheEnabled&&plane==='background'||this.staticCacheEnabled&&plane==='lower')&&this.drawStaticCache(ctx,items,plane,game))return;
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
   if(o.blendMode)ctx.globalCompositeOperation=o.blendMode;
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
   if(o.animation?.effect==='flip'){ctx.translate(0,-o.height/2);ctx.scale(1,animation().flipScale(o,game));ctx.translate(0,o.height/2);}
   if(o.indicator?.halo&&src===o.indicator.on){
    const radius=Math.min(o.width,o.height)*.75,glow=ctx.createRadialGradient(0,0,0,0,0,radius);
    glow.addColorStop(0,'rgba(255,219,155,0)');glow.addColorStop(.55,'rgba(255,219,155,0)');
    glow.addColorStop(.72,'rgba(255,219,155,.65)');glow.addColorStop(1,'rgba(255,219,155,0)');
    ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();
   }
   // Keep the default image underneath every state/frame overlay.
   if(ready(baseImage,o.crop[0],o.crop[1]))this.drawRaster(ctx,baseImage,o.crop[0],o.crop[1],sw,sh,o.width,o.height);
   if((src!==baseSrc||frame!==0)&&ready(img,sx,sy))this.drawRaster(ctx,img,sx,sy,sw,sh,o.width,o.height);
   if(state.glow?.alpha>0&&ready(img,sx,sy))this.drawGlow(ctx,img,sx,sy,sw,sh,o.width,o.height,state.glow);
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

/* Space's ten-capture constellation lottery. Native stars/lines, no image filters. */
(function(root){
'use strict';
const patterns={
 enemy:{points:[[-.6,-.65],[0,-.9],[.6,-.65],[.7,-.1],[.4,.4],[.3,.8],[-.3,.8],[-.4,.4],[-.7,-.1],[-.3,-.12],[.3,-.12],[0,.2]],lines:[[0,1,2,3,4,5,6,7,8,0],[0,9,11,10,2],[7,11,4]]},
 multi:{points:[[-.52,.35],[-.75,-.15],[-.4,-.65],[0,-.9],[.4,-.65],[.75,-.15],[.52,.35],[.52,.75],[-.52,.75],[0,.35]],lines:[[0,1,2,3,4,5,6,7,8,0],[2,9,4],[0,9,6]]}
};
const lights=typeof module!=='undefined'&&module.exports?require('../indicator-lights'):null;
const i18n=(key,args)=>root.PinballI18n?.t(key,args)||({'space.lottery.title':'CONSTELLATION','space.lottery.spinning':'DRAWING','space.lottery.enemy':'ENEMY','space.lottery.multiball':'MULTIBALL','space.lottery.progress':`${args?.count||0} / ${args?.total||10}`}[key]||key);
function label(reward){return reward.kind==='score'?'+'+reward.value:reward.kind==='multiplier'?'×'+reward.value:reward.kind==='ball'?'+'+reward.value:reward.kind==='multi'?i18n('space.lottery.multiball'):i18n('space.lottery.enemy');}
function star(ctx,x,y,size,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y-size);ctx.lineTo(x+size*.3,y-size*.3);ctx.lineTo(x+size,y);ctx.lineTo(x+size*.3,y+size*.3);ctx.lineTo(x,y+size);ctx.lineTo(x-size*.3,y+size*.3);ctx.lineTo(x-size,y);ctx.lineTo(x-size*.3,y-size*.3);ctx.closePath();ctx.fill();}
function constellation(ctx,kind,x,y,size,lit,lineAlpha=1){
 const shape=typeof kind==='string'?patterns[kind]:kind;ctx.save();ctx.translate(x,y);ctx.strokeStyle=lit?'#c4efff':'#536879';ctx.lineWidth=lit?.65:.35;ctx.setLineDash([1.2,.9]);
 if(lineAlpha>0){ctx.save();ctx.globalAlpha*=lineAlpha;for(const chain of shape.lines){ctx.beginPath();chain.forEach((n,i)=>{const p=shape.points[n];if(i)ctx.lineTo(p[0]*size,p[1]*size);else ctx.moveTo(p[0]*size,p[1]*size);});ctx.stroke();}ctx.restore();}
 ctx.setLineDash([]);for(const [px,py] of shape.points)star(ctx,px*size,py*size,lit?1.05:.65,lit?'#effbff':'#7b91a0');ctx.restore();
}
function numberChart(text,y=0,height=1,maxWidth=2.5){
 const vertices=[[-.3,-.5],[.3,-.5],[.3,0],[.3,.5],[-.3,.5],[-.3,0]],segments=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[5,2]],digits=[[0,1,2,3,4,5],[1,2],[0,1,6,4,3],[0,1,2,3,6],[5,6,1,2],[0,5,6,2,3],[0,5,6,4,3,2],[0,1,2],[0,1,2,3,4,5,6],[0,1,2,3,5,6]];
 const points=[],lines=[];
 [...text].forEach((c,n)=>{const offset=points.length,x=(n-(text.length-1)/2)*.9;if(c==='+'||c==='×'){const v=c==='+'?[[-.3,0],[.3,0],[0,-.35],[0,.35]]:[[-.3,-.35],[.3,.35],[.3,-.35],[-.3,.35]];points.push(...v.map(([px,py])=>[px+x,py]));lines.push([offset,offset+1],[offset+2,offset+3]);}else{const used=new Map();lines.push(...digits[Number(c)].map(i=>segments[i].map(v=>{if(!used.has(v)){used.set(v,points.length);points.push([vertices[v][0]+x,vertices[v][1]]);}return used.get(v);})));}});
 const width=Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])),scale=Math.min(height,maxWidth/width);
 return {points:points.map(([x,py])=>[x*scale,py*scale+y]),lines};
}
function chart(reward){
 if(reward.kind==='score')return numberChart('+'+reward.value,0,1,2.65);
 if(reward.kind==='multiplier')return numberChart('×'+reward.value,0,1.15,2.2);
 if(reward.kind==='ball'){
  const number=numberChart('+'+reward.value,.65,.55,1.2),points=Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return [Math.cos(a)*.48,Math.sin(a)*.48-.3];});
  return {points:[...points,...number.points],lines:[[0,1,2,3,4,5,0],[1,4],[2,5],...number.lines.map(chain=>chain.map(i=>i+6))]};
 }
 return patterns[reward.kind];
}
function prizeOutline(ctx,reward,shape){
 ctx.save();ctx.scale(29,29);ctx.setLineDash([]);ctx.strokeStyle='#95b9cf';ctx.lineWidth=.045;ctx.lineJoin=ctx.lineCap='round';
 const stroke=()=>ctx.stroke();
 if(reward.kind==='score'||reward.kind==='multiplier'){
  // Outline the numeric strokes; stars and dashed connections run through them.
  ctx.beginPath();for(const chain of shape.lines)chain.forEach((n,i)=>{const p=shape.points[n];if(i)ctx.lineTo(...p);else ctx.moveTo(...p);});ctx.strokeStyle='#7894a8';ctx.lineWidth=.1;stroke();ctx.strokeStyle='#102c40';ctx.lineWidth=.065;stroke();
 }else if(reward.kind==='enemy'){
  ctx.beginPath();ctx.moveTo(-.32,.83);ctx.bezierCurveTo(-.4,.72,-.29,.53,-.36,.44);ctx.bezierCurveTo(-.65,.38,-.8,.04,-.8,-.3);ctx.bezierCurveTo(-.8,-1.2,.8,-1.2,.8,-.3);ctx.bezierCurveTo(.8,.04,.65,.38,.34,.44);ctx.bezierCurveTo(.29,.57,.4,.72,.32,.84);ctx.bezierCurveTo(.13,.91,-.15,.87,-.32,.83);ctx.closePath();stroke();
  for(const x of [-.32,.32]){ctx.beginPath();ctx.ellipse(x,-.19,.21,.22,0,0,Math.PI*2);stroke();}
  ctx.beginPath();ctx.moveTo(0,.09);ctx.lineTo(-.1,.29);ctx.lineTo(.1,.29);ctx.closePath();stroke();
  for(const x of [-.13,.13]){ctx.beginPath();ctx.moveTo(x,.52);ctx.lineTo(x,.79);stroke();}
 }else if(reward.kind==='multi'){
  ctx.beginPath();ctx.moveTo(-.53,.36);ctx.bezierCurveTo(-1.07,.26,-.94,-.62,-.46,-.59);ctx.bezierCurveTo(-.34,-1.18,.36,-1.18,.46,-.59);ctx.bezierCurveTo(1.01,-.65,1.09,.25,.53,.36);ctx.bezierCurveTo(.49,.5,.58,.7,.5,.82);ctx.bezierCurveTo(.21,.9,-.24,.77,-.51,.83);ctx.bezierCurveTo(-.57,.66,-.48,.49,-.53,.36);ctx.closePath();stroke();
  ctx.beginPath();ctx.moveTo(-.53,.38);ctx.bezierCurveTo(-.2,.43,.23,.32,.53,.38);stroke();
  for(const x of [-.3,0,.3]){ctx.beginPath();ctx.moveTo(x,.1);ctx.lineTo(x,.36);stroke();}
 }else if(reward.kind==='ball'){
  ctx.beginPath();ctx.arc(0,-.3,.54,0,Math.PI*2);stroke();ctx.beginPath();ctx.arc(0,-.3,.4,Math.PI*1.1,Math.PI*1.55);stroke();
  ctx.beginPath();for(const chain of shape.lines.slice(3))chain.forEach((n,i)=>{const p=shape.points[n];if(i)ctx.lineTo(...p);else ctx.moveTo(...p);});ctx.lineWidth=.065;stroke();
 }
 ctx.restore();
}
function countChart(value){
 const numeral=['','I','II','III','IV','V','VI','VII','VIII','IX','X'][value]||'';
 const glyphs={I:{width:0,points:[[0,-1],[0,0],[0,1]],lines:[[0,1,2]]},V:{width:1.1,points:[[-.55,-1],[0,1],[.55,-1]],lines:[[0,1,2]]},X:{width:1.1,points:[[-.55,-1],[.55,1],[.55,-1],[-.55,1],[0,0]],lines:[[0,4,1],[2,4,3]]}};
 const points=[],lines=[],width=[...numeral].reduce((sum,c)=>sum+glyphs[c].width,0)+Math.max(0,numeral.length-1)*.45;
 let x=-width/2;
 for(const c of numeral){const glyph=glyphs[c],offset=points.length;points.push(...glyph.points.map(([px,py])=>[px+x+glyph.width/2,py]));lines.push(...glyph.lines.map(chain=>chain.map(i=>i+offset)));x+=glyph.width+.45;}
 return {points,lines};
}
class Controller{
 constructor(game,config){this.game=game;this.config=config;this.clock=0;this.geometry=game.g.art_layout_objects?.find(o=>o.id===config.object);this.charts=config.rewards.map(chart);this.stars=[...new Map(this.charts.flatMap(shape=>shape.points).map(([x,y])=>[x.toFixed(3)+','+y.toFixed(3),[x*29,y*29-3]])).values()];for(let count=0;count<=config.threshold;count++)for(const [x,y] of countChart(count).points)this.stars.push([x*23,y*23-3]);for(let i=0;i<22;i++){const a=i*2.39996,r=18+((i*13)%23);this.stars.push([Math.cos(a)*r,Math.sin(a)*r-3]);}this.stars=[...new Map(this.stars.map(([x,y])=>[x.toFixed(3)+','+y.toFixed(3),[x,y]])).values()];this.multiplier=1;this.reset();}
 reset(){this.count=0;this.phase='idle';this.index=this.winner=-1;this.flashStars=[];this.heldBall=null;this.frozen=this.game.bonusFrozen=false;}
 event(type){if(type==='new-game'){this.multiplier=1;this.reset();}}
 capture(id){
  if(!this.config.holes.includes(id)||this.frozen)return false;
  if(this.phase==='settled'){this.winner=this.index=-1;this.phase='idle';}
  this.count++;this.game.emit('constellation-progress',{count:this.count,total:this.config.threshold});
  if(this.count<this.config.threshold)return false;
  this.heldBall=this.game.ball;this.phase='count';this.phaseAt=this.clock;this.frozen=this.game.bonusFrozen=true;
  const available=this.config.rewards.map((r,i)=>i).filter(i=>this.config.rewards[i].kind!=='enemy'||!this.game.enemyActive&&!this.game.enemyIntroPending&&!this.game.storyMode);
  const random=Math.max(0,Math.min(.999999,(this.game.random||Math.random)()));
  this.target=available[Math.floor(random*available.length)];this.index=-1;this.nextFlashAt=this.clock+.06;
  this.game.emit('constellation-spin',{count:this.count});return true;
 }
 reward(){
  const g=this.game,r=this.config.rewards[this.winner];
  if(r.kind==='score')g.scoreHit('space-constellation-reward',r.value,0);
  if(r.kind==='multiplier')this.multiplier=r.value;
  if(r.kind==='ball')for(let i=0;i<r.value;i++)g.awardExtraLife('constellation');
  if(r.kind==='multi')for(let i=0;i<r.value;i++)g.awardMultiball();
  if(r.kind==='enemy'&&!g.enemyActive&&!g.enemyIntroPending&&!g.storyMode){g.enemyActive=true;g.emit('enemy-spawn-requested',{group:'space-constellation'});}
  g.emit('bonus-awarded',{source:'space-constellation',position:this.winner+1,kind:r.kind,value:r.value,multiplier:this.multiplier});
 }
 finish(){
  const g=this.game,ball=this.heldBall,previous=g.ball;this.phase='settled';this.count=0;this.frozen=g.bonusFrozen=false;this.heldBall=null;
  if(ball?.state==='captured'&&ball.held){g.ball=ball;const id=ball.held.id;g.release();g.completeConstellationCapture(id);}
  this.reward();g.ball=previous;g.selectBall();
 }
 scatter(){
  const pool=this.stars.map((_,i)=>i),count=Math.min(pool.length,6+Math.floor(Math.random()*14));
  for(let i=0;i<count;i++){const j=i+Math.floor(Math.random()*(pool.length-i));[pool[i],pool[j]]=[pool[j],pool[i]];}
  this.flashStars=pool.slice(0,count);
 }
 update(dt){if(this.game.paused)return;this.clock+=dt;const age=this.clock-this.phaseAt;
  if(this.phase==='count'&&age>=(this.config.countSeconds??.8)){this.phase='spin';this.phaseAt=this.clock;this.scatter();this.nextFlashAt=this.clock+.06;}
  else if(this.phase==='spin'){const t=Math.min(1,age/this.config.spinSeconds);if(t>=1){this.winner=this.index=this.target;this.phase='winflash';this.phaseAt=this.clock;}else if(this.clock>=this.nextFlashAt){this.scatter();this.nextFlashAt=this.clock+.06+.5*t**3;}}
  else if(this.phase==='winflash'&&age>=this.config.winFlashSeconds)this.finish();
 }
 draw(ctx){
  const o=this.geometry;if(!o)return;const age=this.clock-this.phaseAt;
  const attract=this.phase==='idle'&&!this.count?(lights||root.IndicatorLights)?.attractLight(this.game,{x:o.cx,y:o.cy,height:o.r*2,indicator:{group:'constellation'}}):null;
  ctx.save();ctx.translate(o.cx,o.cy);ctx.scale(o.r/54,o.r/54);ctx.lineCap='round';
  ctx.save();ctx.globalAlpha=.42;for(const [x,y] of this.stars)star(ctx,x,y,.65,'#7891a7');ctx.restore();
  if(attract!==null&&attract!==undefined){
   if(attract){const tick=Math.floor(this.game.time*8);for(let i=0;i<this.stars.length;i++)if((i*7+tick)%11<4){const [x,y]=this.stars[i];star(ctx,x,y,1.35,'#effbff');}}
   ctx.restore();return;
  }
  for(let i=0;i<this.config.threshold;i++){const a=(-90+i*360/this.config.threshold)*Math.PI/180,lit=i<this.count;star(ctx,Math.cos(a)*49,Math.sin(a)*49,lit?1.9:1.15,lit?'#ffe6a4':'#527084');}
  if(this.phase==='spin'){for(const i of this.flashStars){const [x,y]=this.stars[i];star(ctx,x,y,1.25,'#effbff');}}
  else if(this.winner>=0){
   const focus=this.winner,lineAlpha=this.phase==='winflash'?Math.max(0,Math.min(1,(age-.35)/.35)):1,outlineAlpha=this.phase==='winflash'?Math.max(0,Math.min(1,(age-.75)/.35)):1;
   ctx.save();ctx.translate(0,-3);if(outlineAlpha>0){ctx.save();ctx.globalAlpha*=outlineAlpha;prizeOutline(ctx,this.config.rewards[focus],this.charts[focus]);ctx.restore();}constellation(ctx,this.charts[focus],0,0,29,true,lineAlpha);ctx.restore();
  }
  else constellation(ctx,countChart(this.count),0,-3,23,true);
  ctx.restore();
 }
}
function createGame(Base){return class extends Base{
 constructor(g){super(g);if(g.gameplay?.spaceConstellation)this.bonus=new Controller(this,g.gameplay.spaceConstellation);}
 reset(){this.enemyActive=false;this.enemyIntroPending=false;super.reset();}
 newBall(preserveTable=false){
  const active=this.enemyActive,pending=this.enemyIntroPending;
  super.newBall(preserveTable);
  if(this.spaceEndlessMode){this.enemyActive=active;this.enemyIntroPending=pending;}
 }
 emit(type,data={}){super.emit(type,data);this.bonus?.event(type,data);}
 beforeStep(dt){return !this.bonusFrozen&&super.beforeStep(dt);}
 rulesInterrupted(){return this.bonusFrozen||super.rulesInterrupted();}
 scoreHit(id,points,cooldown){return super.scoreHit(id,points*(this.bonus?.multiplier||1),cooldown);}
 onCapture(id){if(!this.bonus?.capture(id))super.onCapture(id);}
 completeConstellationCapture(id){super.onCapture(id);}
};}
const api={Controller,createGame,constellation,label};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpaceConstellation=api;
})(globalThis);

/* Touhou's attack-powered bagua lottery. The display never captures or freezes a ball. */
(function(root){
'use strict';
const trigrams=[7,3,5,1,6,2,4,0];
function drawYinYang(ctx,radius){
 const white='#f6f4ea',black='#151a21';
 const disc=(x,y,r,color)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();};
 disc(0,0,radius,white);ctx.beginPath();ctx.arc(0,0,radius,-Math.PI/2,Math.PI/2);ctx.closePath();ctx.fillStyle=black;ctx.fill();
 disc(0,-radius/2,radius/2,white);disc(0,radius/2,radius/2,black);
 disc(0,-radius/2,radius*.128,black);disc(0,radius/2,radius*.128,white);
}
class Controller{
 constructor(game,config){this.game=game;this.config=config;this.geometry=game.g.art_layout_objects.find(o=>o.id===config.object);this.clock=0;this.multiplier=1;this.reset();}
 reset(){this.count=0;this.phase='idle';this.winner=-1;this.phaseAt=this.clock;this.attackAge=Infinity;}
 event(type,data){
  if(type==='new-game'){this.multiplier=1;this.reset();}
  if(this.config.trigger==='circle-entry'||type!=='configured-attack'||data.kind!=='lv1'||this.game.gameOver)return;
  this.progress();
 }
 progress(){
  if(this.game.gameOver)return;
  if(this.phase==='settled'){this.phase='idle';this.winner=-1;}
  this.count++;this.game.emit('bagua-progress',{count:this.count,total:this.config.threshold});
  if(this.phase==='idle'||this.phase==='settled')this.start();
 }
 start(){
  if(this.count<this.config.threshold)return;
  this.count-=this.config.threshold;this.phase='spin';this.phaseAt=this.clock;this.winner=-1;
  this.available=this.availableRewards();
  this.target=this.pick();this.attackAge=0;
  if(this.config.trigger!=='circle-entry')this.game.emit('configured-attack',{kind:'lv4',id:'touhou-bagua',position:[this.geometry.x,this.geometry.y]});
  this.game.emit('bagua-spin',{total:this.config.threshold});
  if(this.config.spinSound)this.game.emit('sound',{name:'runic-spin'});
 }
 pick(){const random=Math.max(0,Math.min(.999999,(this.game.random||Math.random)()));return this.available[Math.floor(random*this.available.length)];}
 availableRewards(){
  const g=this.game,full=g.balls.filter(b=>b.state!=='drained').length+g.freeBallQueue+(g.gapLock?.pending||0)>=3;
  return this.config.rewards.map((r,i)=>i).filter(i=>{
   const kind=this.config.rewards[i].kind;
   return (kind!=='enemy'||!g.enemyActive&&!g.enemyIntroPending)&&(kind!=='multi'||!full);
  });
 }
 reward(){
  const g=this.game,r=this.config.rewards[this.winner];
  if(r.kind==='score')g.scoreHit('touhou-bagua-reward',r.value,0);
  if(r.kind==='multiplier')this.multiplier=r.value;
  if(r.kind==='ball')for(let i=0;i<r.value;i++)g.awardExtraLife('bagua');
  if(r.kind==='multi'){
   if(g.g.gameplay?.touhouGap)g.awardGapMultiball(r.value);
   else for(let i=0,n=Math.min(r.value,Math.max(0,3-g.balls.filter(b=>b.state!=='drained').length-g.freeBallQueue));i<n;i++)g.awardMultiball([this.geometry.cx??this.geometry.x,this.geometry.cy??this.geometry.y],this.geometry.layer==='upper'?'tavern':this.geometry.layer||'lower');
  }
  if(r.kind==='enemy'&&!g.enemyActive&&!g.enemyIntroPending){g.enemyActive=true;g.emit('enemy-spawn-requested',{group:'touhou-bagua'});}
  g.emit('bonus-awarded',{source:'touhou-bagua',position:this.winner+1,kind:r.kind,value:r.value,multiplier:this.multiplier});
 }
 update(dt){
  if(this.game.paused||this.game.gameOver)return;
  this.clock+=dt;this.attackAge+=dt;const age=this.clock-this.phaseAt;
  if(this.phase==='spin'){
   this.available=this.availableRewards();
   if(!this.available.includes(this.target))this.target=this.pick(true);
   if(age>=this.config.spinSeconds&&!this.game.theaterFrozen&&!this.game.enemyIntroPending){this.winner=this.target;this.phase='winflash';this.phaseAt=this.clock;this.reward();}
  }else if(this.phase==='winflash'&&age>=this.config.winFlashSeconds&&!this.game.theaterFrozen&&!this.game.enemyIntroPending){this.phase='settled';this.start();}
 }
 visual(){
  const age=this.clock-this.phaseAt;
  const reveal=this.winner<0?0:this.phase==='winflash'?Math.max(0,Math.min(1,age/this.config.yinYang.fadeSeconds)):1;
  return {prize:this.winner,prizeOpacity:reveal,yinOpacity:1-reveal};
 }
 draw(ctx,renderer){
  const o=this.geometry,r=this.config.radius,centerRadius=31,age=this.clock-this.phaseAt,spin=this.phase==='spin';
  ctx.save();ctx.translate(o.x,o.y);ctx.rotate((o.angle||0)*Math.PI/180);ctx.scale(r/68,r/68);ctx.lineWidth=.65;
  const flashOn=Math.floor(age/.16)%2===0;
  const glowing=spin?flashOn:this.phase==='idle'&&this.count>0;
  let glow;
  if(glowing){glow=ctx.createRadialGradient(0,0,35,0,0,66);glow.addColorStop(0,'#d89b2c');glow.addColorStop(.55,'#ffe39a');glow.addColorStop(1,'#dba936');}
  for(let i=0;i<8;i++){
   const a=(-112.5+i*45)*Math.PI/180,b=a+Math.PI/4;
   const lit=spin?flashOn:this.phase==='idle'&&i<this.count;
   ctx.beginPath();ctx.arc(0,0,66,a,b);ctx.arc(0,0,35,b,a,true);ctx.closePath();ctx.fillStyle=lit?glow:'#252b32';ctx.fill();ctx.strokeStyle=lit?'#ffe7a0':'#7d7055';ctx.stroke();
   ctx.save();ctx.rotate(i*Math.PI/4);ctx.strokeStyle=lit?'#fff4c3':'#625e51';ctx.lineWidth=2.3;
   for(let j=0;j<3;j++){const y=-56+j*5;ctx.beginPath();if(trigrams[i]&(1<<j)){ctx.moveTo(-10,y);ctx.lineTo(10,y);}else{ctx.moveTo(-10,y);ctx.lineTo(-3,y);ctx.moveTo(3,y);ctx.lineTo(10,y);}ctx.stroke();}ctx.restore();
  }
  ctx.beginPath();ctx.arc(0,0,centerRadius,0,Math.PI*2);ctx.fillStyle='#17202a';ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(0,0,centerRadius,0,Math.PI*2);ctx.clip();
  const visual=this.visual();
  if(visual.prize>=0&&visual.prizeOpacity>0){
   ctx.save();ctx.globalAlpha*=visual.prizeOpacity;
   const art=this.config.rewards[visual.prize].art,im=renderer.image(art.src);
   if(im.complete&&im.naturalWidth){const crop=art.crop||[0,0,im.naturalWidth,im.naturalHeight],w=42,h=w*crop[3]/crop[2];ctx.drawImage(im,...crop,-w/2,-h/2,w,h);}
   ctx.restore();
  }
  if(visual.yinOpacity>0){
   ctx.save();ctx.globalAlpha*=visual.yinOpacity;
   drawYinYang(ctx,centerRadius);ctx.restore();
  }
  ctx.restore();
  ctx.beginPath();ctx.arc(0,0,centerRadius,0,Math.PI*2);ctx.strokeStyle='#b5a57d';ctx.lineWidth=.65;ctx.stroke();
  for(let i=0;i<this.config.threshold;i++){const a=(-90+i*360/this.config.threshold)*Math.PI/180;ctx.beginPath();ctx.arc(Math.cos(a)*63,Math.sin(a)*63,1.4,0,Math.PI*2);ctx.fillStyle=i<this.count?'#ffe49a':'#56616b';ctx.fill();}
  const effect=this.config.attackArt;
  if(effect&&this.attackAge<effect.duration){
   const im=renderer.image(effect.src),t=this.attackAge/effect.duration,size=105*(.3+Math.min(1,t*3));
   if(im.complete&&im.naturalWidth){ctx.save();ctx.globalAlpha*=Math.min(1,t*8)*Math.min(1,(1-t)*3);ctx.rotate(t*Math.PI/3);ctx.drawImage(im,-size/2,-size/2,size,size);ctx.restore();}
  }
  ctx.restore();
 }
}
// Same prize rules as bagua, with a passable circle and a flat stone presentation.
const runePaths=['M0 -12 V12 M0 -3 L-9 -11 M0 -3 L9 -11','M-6 -12 V12 M-6 -10 L7 -2 L-6 5','M-6 -12 V12 M-6 -10 L7 -2 M-6 0 L7 10','M-7 -12 L7 12 M7 -12 L-7 12','M-6 12 V-12 L7 0 L-6 8','M-6 -12 V12 M6 -12 V12 M-6 -3 L6 3','M-7 -12 V12 M-7 -12 L8 -4 M-7 0 L5 6','M0 -12 V12 M0 -12 L-8 -3 M0 -12 L8 -3'];
class RunicController extends Controller{
 pick(replacement=false){
  let random=Math.max(0,Math.min(.999999,(this.game.random||Math.random)())),reserved=0;
  const rewards=this.config.rewards,common=this.available.filter(i=>rewards[i].probability===undefined);
  // Fixed probabilities remain absolute when Boss or ball capacity excludes a prize.
  // An invalidated result only falls back to common prizes, never rerolls rare ones.
  if(!replacement)for(const i of this.available){const chance=rewards[i].probability;if(chance===undefined)continue;if(random<chance)return i;random-=chance;reserved+=chance;}
  return common[Math.min(common.length-1,Math.floor(random/(1-reserved)*common.length))];
 }
 progress(){
  if(this.phase==='spin'||this.phase==='winflash')return;
  super.progress();
 }
 event(type,data){
  super.event(type,data);
  if(type==='drain'&&!this.game.storyMode&&!this.game.freeBallQueue&&this.game.balls.every(b=>b.state==='drained')){this.multiplier=1;this.reset();}
 }
 crossCircle(ball,previous,layer){
  const o=this.geometry,countLayer=this.config.countLayer||o.layer,expected=countLayer==='upper'?'tavern':countLayer||'lower';
  if(this.game.paused||this.game.theaterFrozen||ball.state!=='playing'||layer!==expected||ball.layer!==expected)return;
  const a=[previous[0]-o.cx,previous[1]-o.cy],v=[ball.p[0]-previous[0],ball.p[1]-previous[1]],r=o.r;
  if(a[0]*a[0]+a[1]*a[1]<=r*r)return;
  const length=v[0]*v[0]+v[1]*v[1];if(!length)return;
  const t=Math.max(0,Math.min(1,-(a[0]*v[0]+a[1]*v[1])/length));
  if((a[0]+t*v[0])**2+(a[1]+t*v[1])**2<r*r)this.progress();
 }
 draw(ctx,renderer){
  const o=this.geometry,r=this.config.radius,age=Math.min(this.config.spinSeconds,this.clock-this.phaseAt),spin=this.phase==='spin';
  // Rotation is evaluated from elapsed time; the central reward stays upright.
  const elapsed=spin?age:this.phase==='idle'?0:this.config.spinSeconds;
  const angle=(295*elapsed-125*elapsed*elapsed/this.config.spinSeconds)*Math.PI/180;
  const bitmap=(art,size)=>{const im=renderer.image(art.src);if(!im.complete||!im.naturalWidth)return;const uv=art.uv||[0,0,1,1],w=im.naturalWidth,h=im.naturalHeight;ctx.drawImage(im,uv[0]*w,uv[1]*h,uv[2]*w,uv[3]*h,-size/2,-size/2,size,size);};
  ctx.save();ctx.translate(o.cx,o.cy);ctx.scale(r/100,r/100);
  ctx.save();ctx.rotate(angle);bitmap(this.config.rotorArt,136);
  ctx.scale(.68,.68);ctx.lineCap='round';ctx.lineJoin='round';
  const paths=this.runeShapes||(this.runeShapes=runePaths.map(d=>new Path2D(d)));
  for(let i=0;i<8;i++){
   const a=i*Math.PI/4-Math.PI/2;ctx.save();ctx.translate(65*Math.cos(a),65*Math.sin(a));ctx.rotate(i*Math.PI/4);
   const lit=spin||i<this.count;ctx.lineWidth=4.5;ctx.strokeStyle=lit?'#9df7e6':'#302c24';ctx.stroke(paths[i]);ctx.restore();
  }
  ctx.beginPath();ctx.arc(0,0,29,0,Math.PI*2);ctx.lineWidth=1.3;ctx.strokeStyle='#514938';ctx.stroke();ctx.restore();
  bitmap(this.config.ringArt,200);
  if(this.winner>=0){ctx.save();ctx.globalAlpha*=this.visual().prizeOpacity;const art=this.config.rewards[this.winner].art,im=renderer.image(art.src);if(im.complete&&im.naturalWidth){const uv=art.uv,w=im.naturalWidth,h=im.naturalHeight,ratio=uv[2]*w/(uv[3]*h),dw=38*Math.min(1,ratio),dh=38*Math.min(1,1/ratio);ctx.drawImage(im,uv[0]*w,uv[1]*h,uv[2]*w,uv[3]*h,-dw/2,-dh/2,dw,dh);}ctx.restore();}
  ctx.restore();
 }
}
function createGame(Base){return class extends Base{
 constructor(g){super(g);if(g.gameplay?.touhouBagua||g.gameplay?.runicTurntable)this.bonus=new (g.gameplay.runicTurntable?RunicController:Controller)(this,g.gameplay.runicTurntable||g.gameplay.touhouBagua);}
 afterBallStep(previous,layer,dt){super.afterBallStep?.(previous,layer,dt);this.bonus?.crossCircle?.(this.ball,previous,layer);}
 emit(type,data={}){const result=super.emit(type,data);this.bonus?.event(type,data);return result;}
 scoreHit(id,points,cooldown){return super.scoreHit(id,points*(this.bonus?.multiplier||1),cooldown);}
};}
const api={Controller,createGame};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TouhouBagua=api;
})(globalThis);

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
  const lights=typeof module!=='undefined'&&module.exports?require('../indicator-lights.js'):root.IndicatorLights;
  if(game.ball?.state==='ready'&&o.indicator?.group&&lights.attractLight(game,o)!==null)return o;
  if(o.bind==='blockhole-001'&&o.indicator){
   const until=game.holeExpiresAt?.get(o.bind),time=game.time||0;
   const available=game.armedHoles?.has(o.bind)&&Number.isFinite(until)&&time<until;
   const age=Math.max(0,time-(until-15)),b=o.indicator.behavior;
   const lit=available&&age%(b.onSeconds+b.offSeconds)<b.onSeconds;
   return {...o,indicator:undefined,src:lit?o.indicator.on:o.indicator.off};
  }
  const attack=o.indicator?.trigger?.kind==='enemy-active',unlock=o.bind==='targetGroup-004';
  if(attack||unlock){
   const rule=game.configuredGroups?.find(r=>r.id===o.bind);
   const available=!!game.enemyActive&&!game.enemyIntroPending&&(!unlock||(!!rule&&rule.unlocked<rule.blockers.length))&&!(rule?.action==='blackHole'&&game.armedHoles?.has(rule.hole));
   // Once play starts, mission availability controls these arrows.
   const b=o.indicator.behavior,on=b?.onSeconds||.5,off=b?.offSeconds||.5;
   const lit=available&&(b?.mode!=='repeat'||(game.time||0)%(on+off)<on);
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
 const count=Math.max(0,Math.min(2,rule?.unlocked||0));
 return {...o,indicator:undefined,src:`res/img/steampunk/steampunk-unlock-lights-${count}.png`};
}
class Renderer extends Art.Renderer{
 constructor(base,map){super(base,map);this.launchAt=null;this.resetAt=null;}
 onEvent(e){
  if(e.type==='new-game'){this.launchAt=null;this.resetAt=null;}
  if(e.type==='blocker-unlocked'&&e.id==='targetGroup-004'&&e.total>0&&e.count===e.total){this.launchAt=e.time;this.resetAt=null;}
  if(e.type==='blockers-reset'&&e.id==='targetGroup-004')this.resetAt=e.time;
 }
 draw(ctx,items,plane,game){let batch=[];for(const o of items){if(o.id===game?.bonus?.config.artId){if(batch.length){this.drawItems(ctx,batch,plane,game);batch=[];}if(!o.hidden&&o.plane===plane)game.bonus.draw(ctx,o,this);}else batch.push(o);}if(batch.length)this.drawItems(ctx,batch,plane,game);}
 drawItems(ctx,items,plane,game){super.draw(ctx,game?items.map(o=>pose(missionArt(unlockArt(o,game),game),game.time,this.launchAt,this.resetAt)):items,plane,game);}
}
const api={Renderer,pose,unlockArt,missionArt};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SteampunkArt=api;
})(globalThis);
