/* Shared image-layer renderer. Coordinates use the layout's world units. */
(function(root){
'use strict';
const drawRuntimeImage=globalThis.PinballRuntimeImages?.draw||((ctx,...args)=>ctx.drawImage(...args));
const defaultMap=()=>typeof module!=='undefined'&&module.exports?require('../indicator-lights.js').artMap():root.IndicatorLights.artMap();
const animation=()=>typeof module!=='undefined'&&module.exports?require('../art-animation.js'):root.ArtAnimation;
function rasterScale(ctx,t=ctx.getTransform()){return Math.max(1/64,Math.round(Math.max(Math.hypot(t.a,t.b),Math.hypot(t.c,t.d))*64)/64);}
const rasterPool=[];
function rasterCanvas(width,height,bitmap){
 if(bitmap&&typeof OffscreenCanvas==='function'&&OffscreenCanvas.prototype.transferToImageBitmap){const canvas=rasterPool.pop()||new OffscreenCanvas(width,height);canvas.width=width;canvas.height=height;if(canvas.getContext('2d'))return canvas;}
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;return canvas;
}
function recycleRasterCanvas(canvas){canvas.width=0;canvas.height=0;if(canvas.transferToImageBitmap&&rasterPool.length<4)rasterPool.push(canvas);}
function rasterImage(canvas){if(!canvas.transferToImageBitmap)return canvas;const bitmap=canvas.transferToImageBitmap();recycleRasterCanvas(canvas);return bitmap;}
function releaseRaster(entry){if(!entry?.canvas)return;if(entry.canvas.close)entry.canvas.close();else {entry.canvas.width=0;entry.canvas.height=0;}}
class ImageCache extends Map{
 constructor(entries,changed){super(entries);this.changed=changed;}
 set(key,value){const different=this.get(key)!==value;super.set(key,value);if(different)this.changed?.(value);return this;}
 delete(key){const removed=super.delete(key);if(removed)this.changed?.();return removed;}
 clear(){if(this.size){super.clear();this.changed?.();}}
}
const planes=['background','lower','upper','top','foreground'];
function samePlacement(a,b,compareSource=true){
 if(!b)return false;
 return a.id===b.id&&(!compareSource||a.src===b.src)&&a.x===b.x&&a.y===b.y&&a.width===b.width&&a.height===b.height&&a.angle===b.angle&&a.opacity===b.opacity&&a.flipX===b.flipX&&a.flipY===b.flipY&&a.crop?.[0]===b.crop?.[0]&&a.crop?.[1]===b.crop?.[1]&&a.crop?.[2]===b.crop?.[2]&&a.crop?.[3]===b.crop?.[3];
}
function unknownBounds(o){return !!(o.indicator?.screenMask||o.indicator?.glow||o.indicator?.halo||o.dynamicPose||o.state==='vortex'||o.state==='plunger'||o.state==='ball-layer'||o.blendMode&&o.blendMode!=='source-over');}
function createDrawPlan(items){
 const batches=[];let batch=[],hasBallMarker=false;
 for(const o of items){if(o.state==='ball-layer'){if(batch.length){batches.push(batch);batch=[];}batches.push(null);hasBallMarker=true;}else batch.push(o);}
 if(batch.length)batches.push(batch);
 return {batches,hasBallMarker};
}
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
  if(!['default','game-started','kickback-event','rescue-closed','hole-count','gap-output','gap-launch','hole-active','gap-count','enemy-target','count','count-complete','hole-capture','hole-release','attack','multiball','rebound','sensor','rollover','enemy-active','enemy-idle','kickback','post','level','object-hidden','flipper','flag','target','layer-entry'].includes(t.kind))throw Error('燈號觸發條件不合法');
  if(t.threshold!==undefined&&(!Number.isInteger(t.threshold)||t.threshold<1||t.threshold>99))throw Error('燈號計數門檻不合法');
  if(t.kind==='hole-count'&&t.threshold!==undefined&&t.threshold<2)throw Error('進洞三階段門檻至少 2 次');
 }
 for(const b of [c.behavior,c.completion,c.releaseBehavior,c.captureBehavior])if(b){if(!['keep','once','repeat','burst'].includes(b.mode))throw Error('燈號播放方式不合法');for(const k of ['onSeconds','offSeconds'])if(b[k]!==undefined&&(!Number.isFinite(b[k])||b[k]<=0))throw Error('燈號時間必須大於零');if(b.cycles!==undefined&&(!Number.isInteger(b.cycles)||b.cycles<1||b.cycles>99))throw Error('閃爍次數需為 1～99');}
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
 constructor(base='',map=defaultMap(),preparedImages=new Map()){
  this.map=map;this.base=base;
  this.layoutRevision=0;this.imageRevision=0;this.observedArt=new WeakSet();this.observedLists=new WeakMap();this.observedImages=new WeakSet();this.liveItems=new WeakSet();
  this.cache=new ImageCache(preparedImages,img=>{if(img)this.observeImage(img);this.invalidateImages();});
  for(const img of preparedImages.values())this.observeImage(img);
 }
 // Play owns these layout copies. Editors that mutate unobserved objects retain
 // the validation path; nested writes/deletes on observed copies invalidate it.
 observeLayout(items){
  const proxies=new WeakMap(),wrap=value=>{
   if(!value||typeof value!=='object'||this.observedArt.has(value))return value;
   if(proxies.has(value))return proxies.get(value);
   const copy=Array.isArray(value)?[...value]:{...value};
   const proxy=new Proxy(copy,{
    set:(o,k,v)=>{v=wrap(v);if(Object.is(o[k],v))return true;const ok=Reflect.set(o,k,v);if(ok)this.layoutRevision++;return ok;},
    deleteProperty:(o,k)=>{const had=Object.hasOwn(o,k),ok=Reflect.deleteProperty(o,k);if(ok&&had)this.layoutRevision++;return ok;},
    defineProperty:(o,k,d)=>{if('value' in d)d={...d,value:wrap(d.value)};const ok=Reflect.defineProperty(o,k,d);if(ok)this.layoutRevision++;return ok;}
   });proxies.set(value,proxy);this.observedArt.add(proxy);for(const key of Object.keys(copy))copy[key]=wrap(copy[key]);return proxy;
  };
  return wrap(items);
 }
 trackedList(items){
  let record=this.observedLists.get(items);
  if(!record||record.revision!==this.layoutRevision){record={revision:this.layoutRevision,tracked:this.observedArt.has(items)&&items.every(o=>this.observedArt.has(o.layoutSource||o))};this.observedLists.set(items,record);}
  return record.tracked;
 }
 invalidateImages(){this.imageRevision++;}
 observeImage(img){
  if(!this.observedImages.has(img)){root.PinballRuntimeImages?.prepare?.(img);this.observedImages.add(img);for(const name of ['load','error'])img.addEventListener?.(name,()=>{this.imageKeys?.delete(img);this.invalidateImages();});}
 }
 image(src){let img=this.cache.get(src);if(!img){img=new Image();if(src){const url=src.startsWith('blob:')?src:this.base+src;img.src=root.PinballRuntimeImages?.resolve(url)??url;}this.cache.set(src,img);}return img;}
 decodeImages(images){
  return Promise.all([...images].map(img=>root.PinballRuntimeImages.decode(img)));
 }
 missionGroupKey(o){
  const c=o.indicator;
  if(!c?.group||c.type==='bumper'||!c.on||!c.off||c.extraTriggers?.length||c.completion||c.releaseBehavior||c.captureBehavior||c.fade?.enabled||c.glow||c.halo||c.screenMask||o.hidden||o.opacity!==1||o.animation?.enabled||o.dynamicPose||o.frames>1||o.state&&o.state!=='static'||o.blendMode&&o.blendMode!=='source-over')return null;
  return JSON.stringify([c.group,o.bind,c.trigger,c.behavior,c.defaultState]);
 }
 async prepareMissionLights(items,scale,brightness=this.brightness,e=0,f=0){
  if(!this.rasterCacheEnabled||!this.missionCacheEnabled||this.beforeDraw)return;
  const request=this.missionPrepareSerial=(this.missionPrepareSerial||0)+1,groups=[];
  for(const plane of planes){let group=null;
   for(const o of items){if(o.plane!==plane||o.hidden)continue;const key=this.missionGroupKey(o);
    if(!key){group=null;continue;}
    if(!group||group.key!==key){group={key,plane,items:[]};groups.push(group);}
    group.items.push(o);
   }
  }
  const selected=groups.filter(g=>g.items.length>1),images=new Set();
  for(const g of selected)for(const o of g.items)for(const state of ['off','on'])images.add(this.image(o.indicator[state]));
  await this.decodeImages(images);if(request!==this.missionPrepareSerial)return;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');ctx.setTransform(scale,0,0,scale,e,f);
  const previous=this.brightness;this.brightness=brightness;const prepared=[],allocated=[],members=new WeakMap();let pixels=0;
  try{for(const g of selected){
   const variants={},sources={};let size=0;
   for(const state of ['off','on']){
    const art=g.items.map(o=>({...o,id:'__mission-'+state+'-'+o.id,src:o.indicator[state],indicator:undefined,bind:'',layoutSource:undefined,liveArt:false}));
    if(!this.drawStaticCache(ctx,art,g.plane,null))continue;
    const slot=g.plane+':'+art[0].id,entry=this.staticCaches.get(slot);this.staticCaches.delete(slot);allocated.push(entry);variants[state]=entry;size+=entry.canvas.width*entry.canvas.height;
    sources[state]=g.items.map(o=>{const img=this.image(o.indicator[state]);return {src:o.indicator[state],img,id:this.imageKey(img)};});
   }
   if(!variants.off||!variants.on||pixels+size>1048576){for(const v of Object.values(variants))releaseRaster(v);continue;}
   pixels+=size;const bounds=g.items.map(o=>this.artBounds(o,null));let disjoint=true;
   for(let i=0;i<bounds.length;i++)for(let j=0;j<i;j++){const a=bounds[i],b=bounds[j];if(!a||!b||!(a[2]<b[0]||b[2]<a[0]||a[3]<b[1]||b[3]<a[1]))disjoint=false;}
   const group={plane:g.plane,items:g.items,layout:g.items.map(o=>({...o,crop:[...o.crop]})),variants,sources,disjoint,brightness,scale:ctx.getTransform().a,shadowColor:ctx.shadowColor};prepared.push(group);
   members.set(g.items[0],group);
  }}catch(error){for(const v of allocated)releaseRaster(v);throw error;}
  finally{this.brightness=previous;canvas.width=canvas.height=0;}
  for(const g of this.missionGroups||[])for(const v of Object.values(g.variants))releaseRaster(v);
  this.missionGroups=prepared;this.missionHeads=prepared.length?members:null;this.missionPixels=pixels;
 }
 drawMissionGroup(ctx,items,start,plane,game,group,t,states=null,commands=null){
  if(group.plane!==plane||group.brightness!==this.brightness)return 0;
  if(ctx.globalCompositeOperation!=='source-over'||ctx.shadowBlur>0||ctx.shadowOffsetX||ctx.shadowOffsetY||ctx.shadowColor!==group.shadowColor||ctx.filter&&ctx.filter!=='none'||!group.disjoint&&ctx.globalAlpha!==1)return 0;
  if(t.b||t.c||t.a!==t.d||t.a!==group.scale)return 0;
  const stable=group.validatedItems===items&&group.validatedStart===start&&group.layoutRevision===this.layoutRevision&&group.imageRevision===this.imageRevision&&group.imageLookup===this.image;
  let chosen=null,tracked=this.observedArt.has(items);
  for(let i=0;i<group.items.length;i++){
   const o=items[start+i],source=o&&(o.layoutSource||o),saved=group.layout[i],command=commands?.[start+i];
   if(!stable&&(source!==group.items[i]||o.plane!==plane||o.hidden||o.dynamicPose||o.animation?.enabled||o.indicator?.halo||o.state!==saved.state||o.bind!==saved.bind||o.frames!==saved.frames||o.blendMode&&o.blendMode!=='source-over'||!samePlacement(source,saved)||!samePlacement(o,saved,false)||o.bind&&(game.targetHits.has(o.bind)||game.targetHits.has(o.bind+'-1')||(command?!!command.flipper:game.flippers.some(f=>f.id===o.bind)))))return 0;
   if(stable&&o.bind&&(game.targetHits.has(o.bind)||game.targetHits.has(o.bind+'-1')||(command?!!command.flipper:game.flippers.some(f=>f.id===o.bind))))return 0;
   if(!stable&&(o!==source||!this.observedArt.has(source)))tracked=false;
   const state=states?.has(o)?states.get(o):this.map.artState(o,game,this,command);states?.set(o,state);if(!state||(state.alpha??1)!==1||state.glow?.alpha>0||state.frame||state.baseSrc!==state.src)return 0;
   const c=saved.indicator,selected=state.src===c.on?'on':state.src===c.off?'off':null;
   if(!selected||chosen&&chosen!==selected)return 0;chosen=selected;
   if(!stable){const ref=group.sources[selected][i],img=command?.images[state.src]||this.image(state.src);if(ref.src!==state.src||ref.img!==img||ref.id!==this.imageKey(img))return 0;}
  }
  if(tracked){group.validatedItems=items;group.validatedStart=start;group.layoutRevision=this.layoutRevision;group.imageRevision=this.imageRevision;group.imageLookup=this.image;}
  const v=group.variants[chosen];if(ctx.imageSmoothingEnabled!==v.smoothing||ctx.imageSmoothingQuality!==v.quality)return 0;
  if(this.damagePixels&&ctx.canvas.id==='table'){const x=v.left+t.e-v.e,y=v.top+t.f-v.f;if(!this.damagePixels.some(b=>root.PlayDamage.intersects(b,[x,y,x+v.canvas.width,y+v.canvas.height])))return group.items.length;}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(v.canvas,Math.round(v.left+t.e-v.e),Math.round(v.top+t.f-v.f));ctx.restore();return group.items.length;
 }
 imageKey(img){
  this.imageKeys??=new WeakMap();const src=img.src;let key=this.imageKeys.get(img);
  if(!key||key.src!==src){key={src,id:this.imageKeySerial=(this.imageKeySerial||0)+1};this.imageKeys.set(img,key);}
  return key.id;
 }
 // Gameplay opts in; editors retain original pixels. Cache only raster content,
 // so transforms, light state, opacity and animation still update every frame.
 async prepareArtwork(items,scale){
  if(!this.rasterCacheEnabled)return;
  const tasks=[],images=new Set(),brightness=this.brightness;
  for(const a of items){if(a.hidden)continue;
   const sources=this.drawSources(a);
   for(const src of sources){const img=this.image(src);images.add(img);tasks.push({a,img});}
  }
  await this.decodeImages(images);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const brush=canvas.getContext('2d');brush.setTransform(scale,0,0,scale,0,0);
  const previousBrightness=this.brightness;this.brightness=brightness;
  try{for(const {a,img} of tasks){const [x,y,w,h]=a.crop,colors=new Set([a.indicator?.glow?.on,a.indicator?.glow?.complete,a.indicator?.glow?.preview?.color].filter(Boolean));
   for(let frame=0;frame<(a.frames||1);frame++){const sx=x+(a.frameAxis==='y'?0:frame*(a.frameStride||w)),sy=y+(a.frameAxis==='y'?frame*(a.frameStride||h):0);
    if(sx+w>(img.runtimeWidth??img.naturalWidth)+.01||sy+h>(img.runtimeHeight??img.naturalHeight)+.01)continue;
    this.drawRaster(brush,img,sx,sy,w,h,a.width,a.height);
    for(const color of colors)this.drawGlow(brush,img,sx,sy,w,h,a.width,a.height,{color,alpha:0});
   }
  }}finally{this.brightness=previousBrightness;canvas.width=canvas.height=0;}
 }
 drawRaster(ctx,img,sx,sy,sw,sh,width,height,x=0,y=0,scaleHint=null,pixelTransform=null){
  if(!this.rasterCacheEnabled){drawRuntimeImage(ctx,img,sx,sy,sw,sh,x-width/2,y-height/2,width,height);return;}
  const scale=scaleHint??rasterScale(ctx);
  const aligned=pixelTransform&&!pixelTransform.b&&!pixelTransform.c&&pixelTransform.a!==0&&pixelTransform.d!==0;
  const deviceWidth=aligned?Math.max(1,Math.round(width*Math.abs(pixelTransform.a))):0,deviceHeight=aligned?Math.max(1,Math.round(height*Math.abs(pixelTransform.d))):0;
  const w=Math.max(1,Math.min(2048,aligned?deviceWidth:Math.ceil(width*scale))),h=Math.max(1,Math.min(2048,aligned?deviceHeight:Math.ceil(height*scale)));
  const brightness=this.brightness??1,id=this.imageKey(img),previous=this.rasterLastKeys?.get(img);
  let key;
  if(previous&&previous.id===id&&previous.sx===sx&&previous.sy===sy&&previous.sw===sw&&previous.sh===sh&&previous.w===w&&previous.h===h&&previous.brightness===brightness)key=previous.key;
  else{
   key=JSON.stringify([id,sx,sy,sw,sh,w,h,brightness]);this.rasterLastKeys??=new WeakMap();
   this.rasterLastKeys.set(img,{id,sx,sy,sw,sh,w,h,brightness,key});
  }
  this.rasters??=new Map();this.rasterPixels??=0;
  let entry=this.rasters.get(key);
  if(!entry){
   const canvas=rasterCanvas(w,h,this.bitmapCacheEnabled);
   const c=canvas.getContext('2d');drawRuntimeImage(c,img,sx,sy,sw,sh,0,0,w,h);
   if(brightness<1){c.globalCompositeOperation='source-atop';c.fillStyle=`rgba(0,0,0,${1-brightness})`;c.fillRect(0,0,w,h);}
   entry={canvas:rasterImage(canvas),pixels:w*h};
   // Bound prepared pixels to 64 MiB, including obsolete viewport sizes.
   while(this.rasterPixels+entry.pixels>16777216&&this.rasters.size){const oldest=this.rasters.keys().next().value;this.rasterPixels-=this.rasters.get(oldest).pixels;releaseRaster(this.rasters.get(oldest));this.rasters.delete(oldest);}
   this.rasterPixels+=entry.pixels;
  }
  this.rasters.delete(key);this.rasters.set(key,entry);
  if(aligned){
   // Submit integer pixels in a unit transform. Canvas does not need to
   // cancel fractional world coordinates against a fractional scale.
   const t=pixelTransform,left=Math.round((x-width/2)*t.a+t.e),top=Math.round((y-height/2)*t.d+t.f);
   const fx=t.a<0?-1:1,fy=t.d<0?-1:1;
   ctx.setTransform(fx,0,0,fy,0,0);
   if(deviceWidth===w&&deviceHeight===h)ctx.drawImage(entry.canvas,left*fx,top*fy);
   else ctx.drawImage(entry.canvas,left*fx,top*fy,deviceWidth,deviceHeight);
   ctx.setTransform(t.a,t.b,t.c,t.d,t.e,t.f);
  }else ctx.drawImage(entry.canvas,x-width/2,y-height/2,width,height);
 }
 // Keep the original image separate: fading a flattened image+shadow changes
 // their overlap. Only the expensive blurred silhouette is immutable.
 prepareShadowRaster(ctx,img,sx,sy,sw,sh,width,height,scaleHint=null){
  if(!this.rasterCacheEnabled||!(ctx.shadowBlur>0)||ctx.shadowOffsetX||ctx.shadowOffsetY||ctx.globalCompositeOperation!=='source-over'||ctx.filter&&ctx.filter!=='none')return null;
  const t=scaleHint===null?ctx.getTransform():null,scaleX=scaleHint??Math.hypot(t.a,t.b),scaleY=scaleHint??Math.hypot(t.c,t.d);
  if(scaleX<1/65536||Math.abs(scaleX-scaleY)>1e-7)return null;
  const scale=Math.round(scaleX*65536)/65536,blur=ctx.shadowBlur,pad=Math.ceil(blur*2+2);
  const w=Math.ceil(width*scale)+pad*2,h=Math.ceil(height*scale)+pad*2,pixels=w*h;
  if(w>2048||h>2048||pixels>1048576)return null;
  const imageId=this.imageKey(img),color=ctx.shadowColor,smoothing=ctx.imageSmoothingEnabled,quality=ctx.imageSmoothingQuality;
  this.shadowRasters??=new Map();this.shadowPixels??=0;this.shadowLastEntries??=new WeakMap();
  let entry=this.shadowLastEntries.get(img);
  if(!entry||entry.imageId!==imageId||entry.sx!==sx||entry.sy!==sy||entry.sw!==sw||entry.sh!==sh||entry.width!==width||entry.height!==height||entry.scale!==scale||entry.blur!==blur||entry.color!==color||entry.smoothing!==smoothing||entry.quality!==quality||!this.shadowRasters.has(entry.key)){
   const key=JSON.stringify([imageId,sx,sy,sw,sh,width,height,scale,blur,color,smoothing,quality]);
   entry=this.shadowRasters.get(key);
   if(!entry){
    const canvas=rasterCanvas(w,h,this.bitmapCacheEnabled),c=canvas.getContext('2d');
    c.imageSmoothingEnabled=ctx.imageSmoothingEnabled;c.imageSmoothingQuality=ctx.imageSmoothingQuality;
    // Put the image outside the canvas; its offset shadow lands inside it.
    c.shadowColor=ctx.shadowColor;c.shadowBlur=blur;c.shadowOffsetX=w+pad;
    drawRuntimeImage(c,img,sx,sy,sw,sh,-w,pad,width*scale,height*scale);
    entry={canvas:rasterImage(canvas),pixels,key,pad,imageId,sx,sy,sw,sh,width,height,scale,blur,color,smoothing,quality};
    while(this.shadowPixels+pixels>1048576&&this.shadowRasters.size){const id=this.shadowRasters.keys().next().value,old=this.shadowRasters.get(id);this.shadowPixels-=old.pixels;releaseRaster(old);this.shadowRasters.delete(id);}
    this.shadowPixels+=pixels;
   }
   this.shadowLastEntries.set(img,entry);
  }
  this.shadowRasters.delete(entry.key);this.shadowRasters.set(entry.key,entry);
  return entry;
 }
 drawImageWithShadow(ctx,img,sx,sy,sw,sh,width,height,scaleHint=null,shadowStyle=null){
  const entry=this.prepareShadowRaster(shadowStyle||ctx,img,sx,sy,sw,sh,width,height,scaleHint);
  if(!entry){
   if(!shadowStyle)return drawRuntimeImage(ctx,img,sx,sy,sw,sh,-width/2,-height/2,width,height);
   ctx.save();ctx.shadowBlur=shadowStyle.shadowBlur;ctx.shadowColor=shadowStyle.shadowColor;
   drawRuntimeImage(ctx,img,sx,sy,sw,sh,-width/2,-height/2,width,height);ctx.restore();return;
  }
  const {canvas,pad,scale}=entry;
  if(!shadowStyle){ctx.save();ctx.shadowBlur=0;ctx.shadowColor='transparent';}
  ctx.drawImage(canvas,-width/2-pad/scale,-height/2-pad/scale,canvas.width/scale,canvas.height/scale);drawRuntimeImage(ctx,img,sx,sy,sw,sh,-width/2,-height/2,width,height);if(!shadowStyle)ctx.restore();
 }
 // Cache the colored silhouette and soft edge once, rather than filtering each frame.
 drawGlow(ctx,img,sx,sy,sw,sh,width,height,glow){
  this.glows??=new Map();
  const t=ctx.getTransform(),scale=Math.max(2,Math.ceil(Math.hypot(t.a,t.b))),w=Math.ceil(width*scale),h=Math.ceil(height*scale),pad=Math.max(4,Math.ceil(scale*2));
  const key=JSON.stringify([this.imageKey(img),sx,sy,sw,sh,w,h,glow.color]);let canvas=this.glows.get(key);
  if(!canvas){
   const mask=document.createElement('canvas');mask.width=w;mask.height=h;const m=mask.getContext('2d');
   drawRuntimeImage(m,img,sx,sy,sw,sh,0,0,w,h);m.globalCompositeOperation='source-in';m.fillStyle=glow.color;m.fillRect(0,0,w,h);
   canvas=document.createElement('canvas');canvas.width=w+pad*2;canvas.height=h+pad*2;const c=canvas.getContext('2d');
   c.shadowColor=glow.color;c.shadowBlur=pad*.7;c.globalAlpha=.7;c.drawImage(mask,pad,pad);c.shadowBlur=0;
   c.globalCompositeOperation='destination-out';c.globalAlpha=1;c.drawImage(mask,pad,pad);
   c.globalCompositeOperation='source-over';c.globalAlpha=.48;c.drawImage(mask,pad,pad);
   if(this.glows.size>=128)this.glows.delete(this.glows.keys().next().value);this.glows.set(key,canvas);
  }
  ctx.save();ctx.globalAlpha*=glow.alpha;ctx.drawImage(canvas,-width/2-pad/scale,-height/2-pad/scale,canvas.width/scale,canvas.height/scale);ctx.restore();
 }
 // Interactive objects remain live; only disjoint scenery may cross them.
 cacheable(o,plane){
  return o.plane===plane&&!o.hidden&&!o.indicator&&!o.animation?.enabled&&!o.bind&&!o.dynamicPose&&!o.liveArt&&!(o.frames>1)&&(!o.blendMode||o.blendMode==='source-over')&&(!o.state||o.state==='static');
 }
 artBounds(o,game,result=null){
  if(o.motionBounds)return o.motionBounds;
  if(o.indicator?.screenMask||o.indicator?.glow||o.indicator?.halo||o.dynamicPose||o.state==='vortex'||o.state==='plunger'||o.state==='ball-layer'||o.blendMode&&o.blendMode!=='source-over')return null;
  let f;for(let i=0;i<(game?.flippers?.length||0);i++)if(game.flippers[i].id===o.bind){f=game.flippers[i];break;}
  const radius=f||o.bind?Math.hypot(o.width,o.height)/2:0;
  if(f){const r=Math.hypot(o.x-f.pivot[0],o.y-f.pivot[1])+radius+2;const bounds=result||[];bounds[0]=f.pivot[0]-r;bounds[1]=f.pivot[1]-r;bounds[2]=f.pivot[0]+r;bounds[3]=f.pivot[1]+r;return bounds;}
  const angle=(o.angle||0)*Math.PI/180,c=Math.abs(Math.cos(angle)),s=Math.abs(Math.sin(angle));
  const pad=1+(o.animation?.effect==='shake'?(o.animation.amplitude??2.5):0)+(o.bind?2+radius*.11:0);
  const w=(o.width*c+o.height*s)/2+pad,h=(o.width*s+o.height*c)/2+pad;
  const bounds=result||[];bounds[0]=o.x-w;bounds[1]=o.y-h;bounds[2]=o.x+w;bounds[3]=o.y+h;return bounds;
 }
 compositionPlan(items,plane,game){
  let buffers;
  if(this.reuseCompositionBuffers){
   // Nested draws need independent scratch arrays; moving art may supply fresh items.
   this.compositionBuffers??=new Map();const slot=plane+':'+(this.compositionDepth||0);
   buffers=this.compositionBuffers.get(slot);if(!buffers){buffers={batches:[],barriers:[],bounds:[]};this.compositionBuffers.set(slot,buffers);}
  }
  const batches=buffers?.batches||[],barriers=buffers?.barriers||[];barriers.length=0;
  let group=null,used=0,boundCount=0;
  const nextBatch=cached=>{let batch=batches[used];if(!batch)batch=batches[used]={items:[]};used++;batch.cached=cached;batch.items.length=0;return batch;};
  const boundsFor=o=>{let result=null;if(buffers){result=buffers.bounds[boundCount]??=[];boundCount++;}return this.artBounds(o,game,result);};
  const overlaps=(a,b)=>!a||!b||!(a[2]<b[0]||b[2]<a[0]||a[3]<b[1]||b[3]<a[1]);
  for(const o of items){
   if(o.state==='ball-layer'){group=null;barriers.length=0;continue;}
   if(o.plane!==plane||o.hidden)continue;
   if(this.cacheable(o,plane)){
    let blocked=!group||this.overlapCacheEnabled===false&&barriers.length;
    if(!blocked&&barriers.length){const bounds=boundsFor(o);for(let i=0;i<barriers.length;i++)if(overlaps(bounds,barriers[i])){blocked=true;break;}}
    if(blocked){group=nextBatch(true);barriers.length=0;}
    group.items.push(o);
   }else{
    if(!used||batches[used-1].cached)nextBatch(false);
    batches[used-1].items.push(o);barriers.push(boundsFor(o));
   }
  }
  batches.length=used;return batches;
 }
 preparedCompositionPlan(items,plane,game){
  if(!this.planCacheEnabled||this.beforeDraw||this.artBounds!==Renderer.prototype.artBounds)return this.compositionPlan(items,plane,game);
  if(!items.length)return this.emptyCompositionPlan??=[];
  this.layoutPlans??=new Map();const key=plane+':'+items[0].id,flippers=game?.flippers;
  let record=this.layoutPlans.get(key),valid=record?.entries.length===items.length&&record.flippers===flippers;
  const unchanged=valid&&record.input===items&&record.tracked&&record.revision===this.layoutRevision;
  if(valid&&!unchanged)for(let i=0;i<(flippers?.length||0);i++){const f=flippers[i],old=record.pivots[i];if(!old||old.ref!==f||old.id!==f.id||old.x!==f.pivot[0]||old.y!==f.pivot[1]){valid=false;break;}}
  if(valid&&!unchanged&&record.pivots.length!==(flippers?.length||0))valid=false;
  if(valid)for(const i of unchanged?record.liveIndices:items.keys()){
   const o=items[i],source=o.layoutSource||o,old=record.entries[i],opaque=unknownBounds(o);
   // Grouping depends on geometry, not texture/crop/opacity. Static rasters
   // validate their own appearance separately in drawStaticCache.
   const bounds=old.bounds;
   if(source!==old.source||o.plane!==old.plane||o.hidden!==old.hidden||o.state!==old.state||o.bind!==old.bind||this.cacheable(o,plane)!==old.cached||opaque!==old.opaque||source.x!==bounds[0]||source.y!==bounds[1]||source.width!==bounds[2]||source.height!==bounds[3]||source.angle!==bounds[4]||source.animation?.enabled!==old.enabled||source.animation?.effect!==old.effect||source.animation?.amplitude!==old.amplitude||!!o.motionBounds!==!!old.motion){valid=false;break;}
   if(o.motionBounds)for(let j=0;j<4;j++)if(o.motionBounds[j]!==old.motion[j]){valid=false;break;}
   if(!valid)break;
  }
  if(valid){record.input=items;record.revision=this.layoutRevision;record.tracked=this.trackedList(items);for(const binding of record.bindings)binding.batch.items[binding.index]=items[binding.sourceIndex];return record.plan;}
  const plan=this.compositionPlan(items,plane,game),indices=new Map(items.map((o,i)=>[o,i]));
  if(indices.size!==items.length)return plan;
  record={input:items,tracked:this.trackedList(items),revision:this.layoutRevision,liveIndices:items.flatMap((o,i)=>o.layoutSource||this.liveItems.has(o)?[i]:[]),flippers,pivots:(flippers||[]).map(f=>({ref:f,id:f.id,x:f.pivot[0],y:f.pivot[1]})),entries:items.map(o=>{
   const source=o.layoutSource||o;
   return {source,plane:o.plane,hidden:o.hidden,state:o.state,bind:o.bind,cached:this.cacheable(o,plane),opaque:unknownBounds(o),bounds:[source.x,source.y,source.width,source.height,source.angle],enabled:source.animation?.enabled,effect:source.animation?.effect,amplitude:source.animation?.amplitude,motion:o.motionBounds?[...o.motionBounds]:null};
  }),plan:plan.map(b=>({cached:b.cached,items:[...b.items],indices:b.items.map(o=>indices.get(o))}))};
  record.bindings=[];
  if(record.tracked)for(const batch of record.plan)this.observedArt.add(batch.items);
  for(const batch of record.plan)for(let i=0;i<batch.items.length;i++)if(record.liveIndices.includes(batch.indices[i]))record.bindings.push({batch,index:i,sourceIndex:batch.indices[i]});
  if(this.layoutPlans.size>=32)this.layoutPlans.delete(this.layoutPlans.keys().next().value);
  this.layoutPlans.set(key,record);return record.plan;
 }
 draw(ctx,items,plane,game=null){
  if(!items.length)return;
  if(this.targetRegionCacheEnabled&&game&&!this.beforeDraw&&this.drawTargetRegions(ctx,items,plane,game))return;
  if(!this.buildingBackground&&this.beforeDraw&&this.drawTable&&this.trackedList(items))return this.drawUncached(ctx,items,plane,game);
  if(this.buildingBackground||!(plane==='background'?this.backgroundCacheEnabled:this.staticCacheEnabled))return this.drawUncached(ctx,items,plane,game);
  this.compositionDepth=(this.compositionDepth||0)+1;
  try{for(const batch of this.preparedCompositionPlan(items,plane,game))if(!batch.cached||!this.drawStaticCache(ctx,batch.items,plane,game))this.drawUncached(ctx,batch.items,plane,game);}
  finally{this.compositionDepth--;}
 }
 targetRegionPlan(items,plane,game){
  const commands=this.drawCommands(items,game);if(!commands)return null;
  this.targetRegionPlans??=new WeakMap();let plans=this.targetRegionPlans.get(items);
  if(!plans){plans=new Map();this.targetRegionPlans.set(items,plans);}let plan=plans.get(plane);if(plan)return plan;
  plan=[];let group=[];
  const flush=()=>{if(!group.length)return;const targets=group.filter(o=>this.drawTable.bySource.get(o)?.targetId),list=this.observeLayout(group);
   plan.push({items:list,targets,retained:targets.length>0&&group.length>1});group=[];
  };
  for(let i=0;i<items.length;i++){
   const o=items[i],command=commands[i];
   const target=command.targetId&&!o.indicator&&!o.animation?.enabled&&!this.liveItems.has(o)&&(!o.state||o.state==='static'||o.state==='target')&&(!o.blendMode||o.blendMode==='source-over');
   if(!o.hidden&&o.plane===plane&&(target||this.cacheable(o,plane))){group.push(o);continue;}
   flush();plan.push({items:this.observeLayout([o]),targets:[],retained:false});
  }
  flush();const merged=[];
  for(const group of plan){const last=merged.at(-1);if(!group.retained&&last&&!last.retained)last.items=this.observeLayout([...last.items,...group.items]);else merged.push(group);}
  plans.set(plane,merged);return merged;
 }
 drawTargetRegions(ctx,items,plane,game){
  if(ctx.canvas.width*ctx.canvas.height>1048576||ctx.globalAlpha!==1||ctx.globalCompositeOperation!=='source-over'||ctx.shadowBlur||ctx.filter&&ctx.filter!=='none')return false;
  const t=ctx.getTransform();if(t.b||t.c||t.a<=0||t.d<=0)return false;
  const plan=this.targetRegionPlan(items,plane,game);if(!plan?.some(g=>g.retained))return false;
  this.targetRegionCaches??=new Map();
  // Retain the reference raster during small shakes, including fractional ones.
  // Overscan keeps edge pixels available when the viewport moves.
  for(const group of plan)if(group.retained){const c=this.targetRegionCaches.get(group);if(c&&c.width===ctx.canvas.width&&c.height===ctx.canvas.height&&c.a===t.a&&c.d===t.d&&(Math.abs(c.e-t.e)>8||Math.abs(c.f-t.f)>8))return false;}
  for(const group of plan){
   if(!group.retained){
    for(const batch of this.preparedCompositionPlan(group.items,plane,game))if(!batch.cached||!this.drawStaticCache(ctx,batch.items,plane,game))this.drawUncached(ctx,batch.items,plane,game);continue;
   }
   let cached=this.targetRegionCaches.get(group);
   if(!cached||cached.width!==ctx.canvas.width||cached.height!==ctx.canvas.height||cached.a!==t.a||cached.d!==t.d||cached.brightness!==this.brightness||cached.smoothing!==ctx.imageSmoothingEnabled||cached.quality!==ctx.imageSmoothingQuality){
    if(cached){this.targetRegionPixels-=cached.pixels;releaseRaster(cached);this.targetRegionCaches.delete(group);}
    const pad=8,pixels=(ctx.canvas.width+pad*2)*(ctx.canvas.height+pad*2);
    this.targetRegionPixels??=0;
    while(this.targetRegionPixels+pixels>4194304&&this.targetRegionCaches.size){const oldest=this.targetRegionCaches.keys().next().value,c=this.targetRegionCaches.get(oldest);this.targetRegionPixels-=c.pixels;releaseRaster(c);this.targetRegionCaches.delete(oldest);}
    const canvas=rasterCanvas(ctx.canvas.width+pad*2,ctx.canvas.height+pad*2,false),brush=canvas.getContext('2d');
    brush.setTransform(t.a,0,0,t.d,t.e+pad,t.f+pad);brush.imageSmoothingEnabled=ctx.imageSmoothingEnabled;brush.imageSmoothingQuality=ctx.imageSmoothingQuality;
    const bounds=o=>{const angle=o.angle*Math.PI/180,c=Math.abs(Math.cos(angle)),s=Math.abs(Math.sin(angle)),w=(o.width*c+o.height*s)/2,h=(o.width*s+o.height*c)/2;return [Math.max(0,Math.floor((o.x-w)*t.a+t.e+pad)-2),Math.max(0,Math.floor((o.y-h)*t.d+t.f+pad)-2),Math.min(canvas.width,Math.ceil((o.x+w)*t.a+t.e+pad)+2),Math.min(canvas.height,Math.ceil((o.y+h)*t.d+t.f+pad)+2)];};
    const boxes=group.items.map(bounds),union=[Math.min(...boxes.map(b=>b[0])),Math.min(...boxes.map(b=>b[1])),Math.max(...boxes.map(b=>b[2])),Math.max(...boxes.map(b=>b[3]))];
    const patches=group.targets.map(o=>{const box=bounds(o),contributors=this.observeLayout(group.items.filter((a,i)=>{const b=boxes[i];return b[0]<box[2]&&b[2]>box[0]&&b[1]<box[3]&&b[3]>box[1];}));return {art:o,id:this.drawTable.bySource.get(o).targetId,box,contributors,alpha:null};});
    this.drawUncached(brush,group.items,plane,game);
    cached={canvas,brush,patches,union,pad,pixels,width:ctx.canvas.width,height:ctx.canvas.height,a:t.a,d:t.d,e:t.e,f:t.f,brightness:this.brightness,smoothing:ctx.imageSmoothingEnabled,quality:ctx.imageSmoothingQuality};
    for(const p of patches)p.alpha=game.targetHits.has(p.id)?Math.max(0,1-(game.time-(game.targetHitAt?.get(p.id)??game.time))/.2):1;
    this.targetRegionCaches.set(group,cached);this.targetRegionPixels+=pixels;
   }else{
    for(const p of cached.patches){
     const alpha=game.targetHits.has(p.id)?Math.max(0,1-(game.time-(game.targetHitAt?.get(p.id)??game.time))/.2):1;
     if(alpha===p.alpha)continue;
     const [x0,y0,x1,y1]=p.box,c=cached.brush;p.alpha=alpha;
     if(x1<=x0||y1<=y0)continue;
     c.save();c.setTransform(1,0,0,1,0,0);c.beginPath();c.rect(x0,y0,x1-x0,y1-y0);c.clip();c.clearRect(x0,y0,x1-x0,y1-y0);c.setTransform(cached.a,0,0,cached.d,cached.e+cached.pad,cached.f+cached.pad);
     try{this.drawUncached(c,p.contributors,plane,game);}finally{c.restore();}
    }
   }
   const [x0,y0,x1,y1]=cached.union;if(x1>x0&&y1>y0){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(cached.canvas,x0,y0,x1-x0,y1-y0,Math.round(x0-cached.pad+t.e-cached.e),Math.round(y0-cached.pad+t.f-cached.f),x1-x0,y1-y0);ctx.restore();}
  }
  return true;
 }
 drawStaticCache(ctx,items,plane,game){
  const previous=this.staticCaches?.get(plane+':'+items[0]?.id);
  const unchanged=previous?.validatedItems===items&&previous.layoutRevision===this.layoutRevision&&previous.imageRevision===this.imageRevision&&previous.imageLookup===this.image&&!this.beforeDraw;
  this.staticBatchChecks??=new WeakMap();
  const check=this.staticBatchChecks.get(items),checked=!this.beforeDraw&&check?.revision===this.layoutRevision&&check.plane===plane;
  let count=unchanged?items.length:checked?check.count:0;
  if(!unchanged&&!checked){
   while(count<items.length&&this.cacheable(items[count],plane,game))count++;
   if(!this.beforeDraw&&this.trackedList(items))this.staticBatchChecks.set(items,{revision:this.layoutRevision,plane,count});
  }
  if(count<2)return false;
  const batch=count===items.length?items:items.slice(0,count),t=ctx.getTransform(),slot=plane+':'+batch[0].id;
  let cached=this.staticCaches?.get(slot),ready=true,imagesChanged=cached?.images.length!==batch.length,layoutChanged=cached?.layout?.length!==batch.length;
  if(!unchanged)for(let i=0;i<batch.length;i++){const a=batch[i],im=this.image(a.src);if(!im.complete||!(im.runtimeWidth??im.naturalWidth))ready=false;if(im!==cached?.images[i]||this.imageKey(im)!==cached?.imageIds?.[i])imagesChanged=true;if(!samePlacement(a,cached?.layout?.[i]))layoutChanged=true;}
  if(t.b||t.c||t.a<=0||t.d<=0||ctx.globalAlpha!==1||ctx.globalCompositeOperation!=='source-over'||ctx.shadowBlur>0||ctx.filter&&ctx.filter!=='none'||!ready)return false;
  this.staticCaches??=new Map();
  if(!cached||layoutChanged||imagesChanged||cached.scaleX!==t.a||cached.scaleY!==t.d||cached.brightness!==this.brightness||cached.smoothing!==ctx.imageSmoothingEnabled||cached.quality!==ctx.imageSmoothingQuality){
   const images=batch.map(a=>this.image(a.src));
   let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
   for(const a of batch){const angle=a.angle*Math.PI/180,c=Math.abs(Math.cos(angle)),s=Math.abs(Math.sin(angle)),w=(a.width*c+a.height*s)/2,h=(a.width*s+a.height*c)/2;x0=Math.min(x0,a.x-w);x1=Math.max(x1,a.x+w);y0=Math.min(y0,a.y-h);y1=Math.max(y1,a.y+h);}
   const left=Math.floor(x0*t.a+t.e),top=Math.floor(y0*t.d+t.f),width=Math.ceil(x1*t.a+t.e)-left,height=Math.ceil(y1*t.d+t.f)-top;
   if(width*height>4194304)return false;
   const canvas=rasterCanvas(width,height,this.bitmapCacheEnabled);
   const c=canvas.getContext('2d');c.setTransform(t.a,0,0,t.d,t.e-left,t.f-top);c.imageSmoothingEnabled=ctx.imageSmoothingEnabled;c.imageSmoothingQuality=ctx.imageSmoothingQuality;
   this.buildingBackground=true;try{Renderer.prototype.draw.call(this,c,batch,plane,game);}finally{this.buildingBackground=false;}
   releaseRaster(this.staticCaches.get(slot));this.staticCaches.delete(slot);
   while([...this.staticCaches.values()].reduce((n,c)=>n+c.canvas.width*c.canvas.height,0)+width*height>4194304){const oldest=this.staticCaches.keys().next().value;releaseRaster(this.staticCaches.get(oldest));this.staticCaches.delete(oldest);}
   cached={images,imageIds:images.map(img=>this.imageKey(img)),layout:batch.map(a=>({...a,crop:[...a.crop]})),scaleX:t.a,scaleY:t.d,brightness:this.brightness,smoothing:ctx.imageSmoothingEnabled,quality:ctx.imageSmoothingQuality,canvas:rasterImage(canvas),left,top,e:t.e,f:t.f};this.staticCaches.set(slot,cached);
  }else if(this.beforeDraw)for(const a of batch)this.beforeDraw(ctx,a);
  if(count===items.length&&this.trackedList(items)){cached.validatedItems=items;cached.layoutRevision=this.layoutRevision;cached.imageRevision=this.imageRevision;cached.imageLookup=this.image;}
  if(this.damagePixels&&ctx.canvas.id==='table'){const x=cached.left+t.e-cached.e,y=cached.top+t.f-cached.f;if(!this.damagePixels.some(b=>root.PlayDamage.intersects(b,[x,y,x+cached.canvas.width,y+cached.canvas.height])))return true;}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(cached.canvas,Math.round(cached.left+t.e-cached.e),Math.round(cached.top+t.f-cached.f));ctx.restore();
  if(count<items.length)Renderer.prototype.draw.call(this,ctx,items.slice(count),plane,game);return true;
 }
 drawSources(o){return new Set([o.src,...['off','on','complete','lv1','lv2','lv3'].map(k=>o.indicator?.[k])].filter(Boolean));}
 prepareDrawTable(items,game){
  for(const cached of this.targetRegionCaches?.values()||[])releaseRaster(cached);
  this.targetRegionCaches=new Map();this.targetRegionPixels=0;this.targetRegionPlans=new WeakMap();
  for(const cached of this.lightComposites?.values()||[])releaseRaster(cached);
  this.lightComposites=new Map();this.lightPixels=0;
  const targets=new Set((game.targetGroups||[]).flatMap(g=>g.targets)),flippers=new Map((game.flippers||[]).map(f=>[f.id,f])),gates=new Map((game.gates||[]).map(o=>[o.id,o])),shapes=new Map((game.g?.lower||[]).map(o=>[o.id,o]));
  const knownImages=new Map([...this.cache.values()].map(img=>[img.src,img]));
  const table={items,game,commands:[],byPlane:new Map(planes.map(p=>[p,[]])),bySource:new WeakMap(),images:new Map(),imageRefs:Object.create(null),groups:game.targetGroups,flippers:game.flippers,gates:game.gates,posts:game.configuredPosts,imageLookup:this.image};
  const imageFor=src=>{
   let img=table.images.get(src);if(img)return img;
   img=this.cache.get(src);
   if(!img&&root.PinballRuntimeImages&&typeof document!=='undefined'&&document.baseURI){const url=root.PinballRuntimeImages.resolve(src.startsWith('blob:')?src:this.base+src);img=knownImages.get(new URL(url,document.baseURI).href);if(img)this.cache.set(src,img);}
   img??=this.image(src);this.observeImage(img);table.images.set(src,img);table.imageRefs[src]=img;knownImages.set(img.src,img);return img;
  };
  if(game.bonus?.config){
   const controller=game.bonus,images=table.imageRefs,collect=value=>{
    if(typeof value==='string'&&/^res\/(?:img|hd_img)\/.+\.(?:png|jpe?g|webp|svg)$/i.test(value))images[value]=imageFor(value);
    else if(value&&typeof value==='object')for(const v of Object.values(value))collect(v);
   };collect(controller.config);controller.drawImages=images;
   table.producer={controller,images,plane:controller.config.displayPlane||controller.geometry?.layer||'lower',enabled:!!controller.config.object,draw:controller.draw?.bind(controller),attack:controller.drawAttackOverlay?.bind(controller)};
  }
  for(const o of items){
   const images=Object.create(null);for(const src of this.drawSources(o))images[src]=imageFor(src);
   const targetId=o.bind&&(targets.has(o.bind)?o.bind:targets.has(o.bind+'-1')?o.bind+'-1':null);
   const command={bounds:this.artBounds(o,game),angleCos:Math.cos(o.angle*Math.PI/180),angleSin:Math.sin(o.angle*Math.PI/180),art:o,baseState:{src:o.src,baseSrc:o.src,frame:0},kind:o.id===game.bonus?.config.artId?'producer':o.state==='ball-layer'?'ball-marker':this.cacheable(o,o.plane)&&!this.liveItems.has(o)?'static':'dynamic',images,targetId:targetId||(o.state==='target'?o.bind:null),flipper:flippers.get(o.bind),gate:gates.get(o.bind),post:game.configuredPosts?.get(o.bind),vortexCenter:shapes.get(o.bind)?.center};
   command.compositeLight=!!o.indicator&&!o.bind&&!o.hidden&&(!o.state||o.state==='static')&&!o.animation?.enabled&&!o.indicator.fade?.enabled&&!o.indicator.glow&&!o.indicator.halo&&!o.indicator.screenMask&&!(o.frames>1)&&(!o.blendMode||o.blendMode==='source-over')&&!this.liveItems.has(o);
   table.commands.push(command);table.byPlane.get(o.plane)?.push(command);table.bySource.set(o,command);
  }
  table.layoutRevision=this.layoutRevision;table.imageRevision=this.imageRevision;this.drawTable=table;this.drawPasses=new WeakMap();
  table.passes=[];for(const pass of this.drawPassDefinitions||[])this.prepareDrawPass(pass.items,pass.plane,game);
  return table;
 }
 refreshDrawTable(game){
  const table=this.drawTable;if(!table||table.game!==game)return null;
  return table.layoutRevision===this.layoutRevision&&table.imageRevision===this.imageRevision&&table.groups===game.targetGroups&&table.flippers===game.flippers&&table.gates===game.gates&&table.posts===game.configuredPosts&&(table.producer?.controller||null)===(game.bonus||null)&&table.imageLookup===this.image?table:this.prepareDrawTable(table.items,game);
 }
 drawCommands(items,game){
  const table=this.refreshDrawTable(game);if(!table||!this.trackedList(items))return null;
  const saved=this.drawPasses.get(items);if(saved)return saved;
  const commands=items.map(o=>table.bySource.get(o.layoutSource||o));if(commands.some(c=>!c))return null;
  if(this.stateLightCacheEnabled){
   commands.lightRuns=Object.create(null);
   for(let start=0;start<commands.length;){
    let end=start;while(end<commands.length&&commands[end].compositeLight&&commands[end].art.plane===commands[start].art.plane&&items[end]===commands[end].art)end++;
    if(end-start>1){const runItems=items.slice(start,end),runCommands=commands.slice(start,end);this.observedArt.add(runItems);this.drawPasses.set(runItems,runCommands);commands.lightRuns[start]={items:runItems,commands:runCommands,signature:[]};}
    start=end>start?end:start+1;
   }
  }
  this.drawPasses.set(items,commands);return commands;
 }
 setDrawPasses(passes,game){
  this.drawPassDefinitions=passes;this.drawTable.passes=[];for(const pass of passes)this.prepareDrawPass(pass.items,pass.plane,game);
 }
 prepareDrawPass(items,plane,game){
  if(!items.length)return;
  this.drawCommands(items,game);
  const batches=this.preparedCompositionPlan(items,plane,game);
  for(const batch of batches)this.drawCommands(batch.items,game);
  this.drawTable?.passes.push({plane,items,batches});
 }
 drawLightRun(ctx,run,plane,game,states){
  if(ctx.canvas.width*ctx.canvas.height>1048576||this.buildingLightComposite||this.beforeDraw||ctx.globalAlpha!==1||ctx.globalCompositeOperation!=='source-over'||ctx.shadowBlur>0||ctx.shadowOffsetX||ctx.shadowOffsetY||ctx.filter&&ctx.filter!=='none'||ctx.shadowColor&&ctx.shadowColor!=='transparent'&&ctx.shadowColor!=='rgba(0, 0, 0, 0)')return false;
  const t=ctx.getTransform();if(t.b||t.c||t.a<=0||t.d<=0)return false;
  let changed=false;
  for(let i=0;i<run.items.length;i++){
   const o=run.items[i],state=states.has(o)?states.get(o):this.map.artState(o,game,this,run.commands[i]);states.set(o,state);
   if(state&&((state.alpha??1)!==1||state.frame||state.glow?.alpha>0))return false;
   const old=run.signature[i];if(!old||old.src!==state?.src||old.baseSrc!==state?.baseSrc)changed=true;
  }
  let cached=this.lightComposites.get(run);
  if(!cached||changed||cached.scaleX!==t.a||cached.scaleY!==t.d||cached.fractionX!==t.e%1||cached.fractionY!==t.f%1||cached.sourceWidth!==ctx.canvas.width||cached.sourceHeight!==ctx.canvas.height||cached.clipped&&(cached.e!==t.e||cached.f!==t.f)||cached.brightness!==this.brightness||cached.smoothing!==ctx.imageSmoothingEnabled||cached.quality!==ctx.imageSmoothingQuality){
   let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
   for(const o of run.items){const angle=o.angle*Math.PI/180,c=Math.abs(Math.cos(angle)),s=Math.abs(Math.sin(angle)),w=(o.width*c+o.height*s)/2,h=(o.width*s+o.height*c)/2;x0=Math.min(x0,o.x-w);x1=Math.max(x1,o.x+w);y0=Math.min(y0,o.y-h);y1=Math.max(y1,o.y+h);}
   const left=Math.floor(x0*t.a+t.e)-1,top=Math.floor(y0*t.d+t.f)-1,width=Math.ceil(x1*t.a+t.e)-left+1,height=Math.ceil(y1*t.d+t.f)-top+1;
   if(width*height>1048576)return false;
   const staging=rasterCanvas(ctx.canvas.width,ctx.canvas.height,this.bitmapCacheEnabled),c=staging.getContext('2d');c.setTransform(t.a,0,0,t.d,t.e,t.f);c.imageSmoothingEnabled=ctx.imageSmoothingEnabled;c.imageSmoothingQuality=ctx.imageSmoothingQuality;
   // Keep original device coordinates while rasterizing. Re-origining directly
   // into the crop changes Skia's fractional sampling at some scales.
   this.buildingLightComposite=true;try{this.drawUncached(c,run.items,plane,game,states);}finally{this.buildingLightComposite=false;}
   const canvas=rasterCanvas(width,height,this.bitmapCacheEnabled);canvas.getContext('2d').drawImage(staging,left,top,width,height,0,0,width,height);recycleRasterCanvas(staging);
   if(cached){this.lightPixels-=cached.pixels;releaseRaster(cached);this.lightComposites.delete(run);}
   while(this.lightPixels+width*height>1048576&&this.lightComposites.size){const oldest=this.lightComposites.keys().next().value,entry=this.lightComposites.get(oldest);this.lightPixels-=entry.pixels;releaseRaster(entry);this.lightComposites.delete(oldest);}
   cached={canvas:rasterImage(canvas),pixels:width*height,left,top,e:t.e,f:t.f,fractionX:t.e%1,fractionY:t.f%1,sourceWidth:ctx.canvas.width,sourceHeight:ctx.canvas.height,clipped:left<0||top<0||left+width>ctx.canvas.width||top+height>ctx.canvas.height,scaleX:t.a,scaleY:t.d,brightness:this.brightness,smoothing:ctx.imageSmoothingEnabled,quality:ctx.imageSmoothingQuality};this.lightComposites.set(run,cached);this.lightPixels+=cached.pixels;
   for(let i=0;i<run.items.length;i++){const state=states.get(run.items[i]);run.signature[i]={src:state?.src,baseSrc:state?.baseSrc};}
  }
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(cached.canvas,Math.round(cached.left+t.e-cached.e),Math.round(cached.top+t.f-cached.f));ctx.restore();return true;
 }
 bindingIndex(game){
  this.bindingIndices??=new WeakMap();let index=this.bindingIndices.get(game);
  if(!index||index.groups!==game.targetGroups||index.parts!==game.flippers||index.revision!==this.layoutRevision){
   index={groups:game.targetGroups,parts:game.flippers,revision:this.layoutRevision,targets:new Set((game.targetGroups||[]).flatMap(g=>g.targets)),flippers:new Map((game.flippers||[]).map(f=>[f.id,f]))};this.bindingIndices.set(game,index);
  }
  return index;
 }
 drawUncached(ctx,items,plane,game=null,stateOverrides=null){
  const transform=this.rasterCacheEnabled?ctx.getTransform():null,scale=transform?rasterScale(ctx,transform):null;
  const missions=this.rasterCacheEnabled&&this.missionCacheEnabled&&game&&game.ball.state!=='ready'&&!this.beforeDraw?this.missionHeads:null;
  let states=stateOverrides||this.frameArtStates;const commands=game?this.drawCommands(items,game):null,bindings=!commands&&game&&this.trackedList(items)?this.bindingIndex(game):null;
  for(let i=0;i<items.length;i++){const o=items[i],command=commands?.[i];if(this.staticOnly&&!(command?command.kind==='static':this.cacheable(o,plane)))continue;if(o.state==='ball-layer'||o.plane!==plane||o.hidden)continue;
   const run=commands?.lightRuns?.[i];if(run&&this.drawLightRun(ctx,run,plane,game,states??=new Map())){i+=run.items.length-1;continue;}
   const group=missions?.get(o.layoutSource||o),grouped=group?this.drawMissionGroup(ctx,items,i,plane,game,group,transform,states??=new Map(),commands):0;if(grouped){i+=grouped-1;continue;}
   if(this.damageRects&&ctx.canvas.id==='table'&&command?.bounds&&!o.id.startsWith('frame-')&&!this.damageRects.some(b=>root.PlayDamage.intersects(b,command.bounds)))continue;
   this.beforeDraw?.(ctx,o);
   const targetId=command?command.targetId:game&&o.bind&&(bindings?(bindings.targets.has(o.bind)?o.bind:bindings.targets.has(o.bind+'-1')?o.bind+'-1':null):(game.targetGroups?.some(g=>g.targets.includes(o.bind))?o.bind:game.targetGroups?.some(g=>g.targets.includes(o.bind+'-1'))?o.bind+'-1':null));
   let targetAlpha=1;
   const hitId=targetId||(o.state==='target'?o.bind:null);
   if(game&&game.targetHits.has(hitId)){const age=game.time-(game.targetHitAt?.get(hitId)??game.time);targetAlpha=Math.max(0,1-age/.2);if(!targetAlpha)continue;}
   const state=states?.has(o)?states.get(o):command?.kind==='static'?command.baseState:this.map.artState(o,game,this,command);states?.set(o,state);if(!state)continue;
   const {src,baseSrc,frame}=state,baseImage=command?.images[baseSrc]||this.image(baseSrc),img=src===baseSrc?baseImage:command?.images[src]||this.image(src);
   let [sx,sy,sw,sh]=o.crop;if(o.frameAxis==='y')sy+=frame*(o.frameStride||sh);else sx+=frame*(o.frameStride||sw);
   const ready=(image,x,y)=>image.complete&&(image.runtimeWidth??image.naturalWidth)&&x+sw<=(image.runtimeWidth??image.naturalWidth)+.01&&y+sh<=(image.runtimeHeight??image.naturalHeight)+.01;
   if(!ready(baseImage,o.crop[0],o.crop[1])&&!ready(img,sx,sy))continue;
   const f=command?command.flipper:game&&o.bind&&(bindings?bindings.flippers.get(o.bind):game.flippers.find(f=>f.id===o.bind));
   if((!o.state||o.state==='static')&&!o.angle&&!o.flipX&&!o.flipY&&!o.animation?.enabled&&!f&&!game?.flagHitAt?.has(o.bind)&&o.opacity===1&&targetAlpha===1&&(state.alpha??1)===1&&!o.indicator?.halo&&!(state.glow?.alpha>0)&&(!o.blendMode||o.blendMode==='source-over')){
    if(ready(baseImage,o.crop[0],o.crop[1]))this.drawRaster(ctx,baseImage,o.crop[0],o.crop[1],sw,sh,o.width,o.height,o.x,o.y,scale,this.beforeDraw?null:transform);
    if((src!==baseSrc||frame!==0)&&ready(img,sx,sy))this.drawRaster(ctx,img,sx,sy,sw,sh,o.width,o.height,o.x,o.y,scale,this.beforeDraw?null:transform);
    continue;
   }
   ctx.save();ctx.globalAlpha*=o.opacity*targetAlpha*(state.alpha??1);
   if(o.blendMode)ctx.globalCompositeOperation=o.blendMode;
   if(o.state==='guide-arrow'){const time=game?game.time:performance.now()/1000;ctx.globalAlpha*=.3+.7*(.5+.5*Math.cos(time*Math.PI*3));}
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
    const center=command?command.vortexCenter||[x,y]:game.g.lower.find(shape=>shape.id===o.bind)?.center||[x,y];
    ctx.translate(...center);ctx.rotate(Math.min(vortexAge,15)*Math.PI/3);ctx.translate(-center[0],-center[1]);
   }
   let pixelPlacement=null;
   if(transform&&command&&!this.beforeDraw&&!f&&vortexAge===null&&!sway&&o.angle===command.art.angle){
    const t=transform,c=command.angleCos,s=command.angleSin,fx=o.flipX?-1:1,fy=o.flipY?-1:1;
    // Match Canvas' float matrix translation before choosing device pixels.
    const e=Math.fround(t.a*x+t.c*y+t.e),h=Math.fround(t.b*x+t.d*y+t.f);
    ctx.setTransform((t.a*c+t.c*s)*fx,(t.b*c+t.d*s)*fx,(-t.a*s+t.c*c)*fy,(-t.b*s+t.d*c)*fy,e,h);
    if(!t.b&&!t.c&&c===1&&s===0&&o.animation?.effect!=='flip'){
     pixelPlacement=this.pixelPlacement??={a:0,b:0,c:0,d:0,e:0,f:0};
     pixelPlacement.a=t.a*fx;pixelPlacement.d=t.d*fy;pixelPlacement.e=e;pixelPlacement.f=h;
    }
   }else{ctx.translate(x,y);ctx.rotate(o.angle*Math.PI/180+sway);ctx.scale(o.flipX?-1:1,o.flipY?-1:1);}
   if(o.animation?.effect==='flip'){ctx.translate(0,-o.height/2);ctx.scale(1,animation().flipScale(o,game));ctx.translate(0,o.height/2);}
   if(o.indicator?.halo&&src===o.indicator.on){
    const radius=Math.min(o.width,o.height)*.75,glow=ctx.createRadialGradient(0,0,0,0,0,radius);
    glow.addColorStop(0,'rgba(255,219,155,0)');glow.addColorStop(.55,'rgba(255,219,155,0)');
    glow.addColorStop(.72,'rgba(255,219,155,.65)');glow.addColorStop(1,'rgba(255,219,155,0)');
    ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();
   }
   // Keep the default image underneath every state/frame overlay.
   if(ready(baseImage,o.crop[0],o.crop[1]))this.drawRaster(ctx,baseImage,o.crop[0],o.crop[1],sw,sh,o.width,o.height,0,0,scale,pixelPlacement);
   if((src!==baseSrc||frame!==0)&&ready(img,sx,sy))this.drawRaster(ctx,img,sx,sy,sw,sh,o.width,o.height,0,0,scale,pixelPlacement);
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
const api={compactIndicator,validateIndicator,planes,createDrawPlan,validate,integerGeometry,serializable,Renderer,rasterCanvas,rasterImage,releaseRaster,recycleRasterCanvas};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PinballArt=api;
})(typeof window!=='undefined'?window:globalThis);
