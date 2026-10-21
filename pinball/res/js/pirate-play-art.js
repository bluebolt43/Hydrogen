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
 for(const trigger of triggers){if(c.type==='bumper'||!['count','level'].includes(trigger.kind))delete trigger.threshold;if(['default','multiball','enemy-active','enemy-idle'].includes(trigger.kind))delete trigger.source;}
 c.trigger=t;
 if(c.type==='bumper'||triggers.length===1)delete c.extraTriggers;else c.extraTriggers=triggers.slice(1);
 if(!triggers.some(t=>['count','rollover','level'].includes(t.kind))){delete c.complete;delete c.completion;}
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
 if(c.impactFlash!==undefined&&typeof c.impactFlash!=='boolean')throw Error('命中／Combo 閃光設定不合法');
 const states=c.type==='bumper'?['lv1','lv2','lv3']:['off','on'];
 if(c.type!==undefined&&!['binary','bumper'].includes(c.type))throw Error('燈號類型不合法');
 if(c.defaultState!==undefined&&!states.includes(c.defaultState))throw Error('燈號預設狀態不合法');
 for(const k of ['off','on','complete','lv1','lv2','lv3'])if(c[k]!==undefined&&(typeof c[k]!=='string'||c[k]&&(!/^res\/(?:img|hd_img)\/[^?#]+\.(png|webp|jpg|jpeg)$/i.test(c[k])||c[k].includes('..'))))throw Error('燈號圖片路徑不合法');
 
 if(c.extraTriggers!==undefined&&(!Array.isArray(c.extraTriggers)||c.extraTriggers.length>7||c.extraTriggers.some(t=>!t)))throw Error('關聯組數需為 1～8');
 for(const t of [c.trigger,...(c.extraTriggers||[])])if(t){
  if(typeof t!=='object'||Array.isArray(t)||t.source!==undefined&&typeof t.source!=='string')throw Error('燈號關聯來源不合法');
  if(!['default','count','count-complete','hole-capture','hole-release','attack','multiball','rebound','sensor','rollover','enemy-active','enemy-idle','kickback','post','level','object-hidden','flipper','flag','target','layer-entry'].includes(t.kind))throw Error('燈號觸發條件不合法');
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
 // Gameplay opts in; editors retain original pixels. Cache only raster content,
 // so transforms, light state, opacity and animation still update every frame.
 drawRaster(ctx,img,sx,sy,sw,sh,width,height){
  if(!this.rasterCacheEnabled){ctx.drawImage(img,sx,sy,sw,sh,-width/2,-height/2,width,height);return;}
  const t=ctx.getTransform(),scale=Math.ceil(Math.max(Math.hypot(t.a,t.b),Math.hypot(t.c,t.d))*2)/2;
  const w=Math.max(1,Math.min(2048,Math.ceil(width*scale))),h=Math.max(1,Math.min(2048,Math.ceil(height*scale)));
  const brightness=this.brightness??1,key=JSON.stringify([img.src,sx,sy,sw,sh,w,h,brightness]);
  this.rasters??=new Map();this.rasterPixels??=0;
  let entry=this.rasters.get(key);
  if(entry&&entry.image!==img){this.rasterPixels-=entry.pixels;this.rasters.delete(key);entry=null;}
  if(!entry){
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   const c=canvas.getContext('2d');c.drawImage(img,sx,sy,sw,sh,0,0,w,h);
   if(brightness<1){c.globalCompositeOperation='source-atop';c.fillStyle=`rgba(0,0,0,${1-brightness})`;c.fillRect(0,0,w,h);}
   entry={image:img,canvas,pixels:w*h};
   // Bound prepared pixels to 64 MiB, including obsolete viewport sizes.
   while(this.rasterPixels+entry.pixels>16777216&&this.rasters.size){const oldest=this.rasters.keys().next().value;this.rasterPixels-=this.rasters.get(oldest).pixels;this.rasters.delete(oldest);}
   this.rasterPixels+=entry.pixels;
  }
  this.rasters.delete(key);this.rasters.set(key,entry);
  ctx.drawImage(entry.canvas,-width/2,-height/2,width,height);
 }
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
   if(ready(baseImage,o.crop[0],o.crop[1]))this.drawRaster(ctx,baseImage,o.crop[0],o.crop[1],sw,sh,o.width,o.height);
   if((src!==baseSrc||frame!==0)&&ready(img,sx,sy))this.drawRaster(ctx,img,sx,sy,sw,sh,o.width,o.height);
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
  ctx.beginPath();ctx.moveTo(-.34,.82);ctx.lineTo(-.34,.44);ctx.bezierCurveTo(-.65,.38,-.8,.04,-.8,-.3);ctx.bezierCurveTo(-.8,-1.2,.8,-1.2,.8,-.3);ctx.bezierCurveTo(.8,.04,.65,.38,.34,.44);ctx.lineTo(.34,.82);ctx.closePath();stroke();
  for(const x of [-.32,.32]){ctx.beginPath();ctx.ellipse(x,-.19,.21,.22,0,0,Math.PI*2);stroke();}
  ctx.beginPath();ctx.moveTo(0,.09);ctx.lineTo(-.1,.29);ctx.lineTo(.1,.29);ctx.closePath();stroke();
  for(const x of [-.13,.13]){ctx.beginPath();ctx.moveTo(x,.52);ctx.lineTo(x,.79);stroke();}
 }else if(reward.kind==='multi'){
  ctx.beginPath();ctx.moveTo(-.53,.36);ctx.bezierCurveTo(-1.07,.26,-.94,-.62,-.46,-.59);ctx.bezierCurveTo(-.34,-1.18,.36,-1.18,.46,-.59);ctx.bezierCurveTo(1.01,-.65,1.09,.25,.53,.36);ctx.lineTo(.53,.8);ctx.lineTo(-.53,.8);ctx.closePath();stroke();
  ctx.beginPath();ctx.moveTo(-.53,.38);ctx.lineTo(.53,.38);stroke();
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
  ctx.save();ctx.translate(o.cx,o.cy);ctx.scale(o.r/54,o.r/54);ctx.lineCap='round';
  ctx.save();ctx.globalAlpha=.42;for(const [x,y] of this.stars)star(ctx,x,y,.65,'#7891a7');ctx.restore();
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
 emit(type,data={}){super.emit(type,data);this.bonus?.event(type,data);}
 beforeStep(dt){return !this.bonusFrozen&&super.beforeStep(dt);}
 rulesInterrupted(){return this.bonusFrozen||super.rulesInterrupted();}
 scoreHit(id,points,cooldown){return super.scoreHit(id,points*(this.bonus?.multiplier||1),cooldown);}
 onCapture(id){if(!this.bonus?.capture(id))super.onCapture(id);}
 completeConstellationCapture(id){super.onCapture(id);}
};}
const api={Controller,createGame,constellation,label};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpaceConstellation=api;
})(globalThis);
