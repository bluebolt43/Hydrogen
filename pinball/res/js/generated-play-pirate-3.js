/* Shared image-layer renderer. Coordinates use the layout's world units. */
(function(root){
'use strict';
const defaultMap=()=>typeof module!=='undefined'&&module.exports?require('./pirate-map.js'):root.PirateMap;
const planes=['background','lower','upper','top','foreground'];
function validate(items,map=defaultMap()){
 if(!Array.isArray(items)||items.length>500)throw Error('圖片圖層最多 500 個');
 const ids=new Set();
 return items.map(o=>{
  if(!o||typeof o.id!=='string'||ids.has(o.id))throw Error('圖片 ID 重複或缺少');ids.add(o.id);
  if(!(o.src===''&&o.needsAsset)&&!(typeof o.src==='string'&&o.src.startsWith('blob:'))&&(typeof o.src!=='string'||!(/^res\/(?:img|hd_img)\/[^?#]+\.(png|webp|jpg|jpeg)$/i.test(o.src))||o.src.includes('..')))throw Error('圖片只保存 res/img 或 res/hd_img 路徑，不接受 Base64；請先將原圖放入 assets');
  for(const k of ['x','y','width','height','angle','opacity'])if(!Number.isFinite(o[k]))throw Error('圖片座標或尺寸不合法');
  if(o.width<=0||o.height<=0||o.width>5000||o.height>5000||o.opacity<0||o.opacity>1||!planes.includes(o.plane))throw Error('圖片大小、透明度或圖層不合法');
  if(!Array.isArray(o.crop)||o.crop.length!==4||!o.crop.every(Number.isFinite)||o.crop[0]<0||o.crop[1]<0||o.crop[2]<=0||o.crop[3]<=0)throw Error('裁切範圍不合法');
  if(o.frameStride!==undefined&&(!Number.isFinite(o.frameStride)||o.frameStride<=0))throw Error('換圖間距必須大於 0');
  const count=o.frames??1;
  if(!Number.isInteger(count)||count<1||count>32||!['x','y'].includes(o.frameAxis||'x'))throw Error('狀態格數不合法');
  return {...o,...map.inferArtState(o),crop:[...o.crop],frames:count,frameAxis:o.frameAxis||'x'};
 });
}
// Shared timed image sequence: alternate frames, then restore the idle image.
function flashImage({time,start,duration,images,idle,interval=.15}){
 const age=start==null?-1:time-start;
 if(age<0||age>=duration)return idle;
 return images[Math.floor(age/interval)%images.length];
}
class Renderer{
 constructor(base='',map=defaultMap()){this.map=map;this.base=base;this.cache=new Map();}
 image(src){if(!this.cache.has(src)){const img=new Image();if(src)img.src=src.startsWith('blob:')?src:this.base+src;this.cache.set(src,img);}return this.cache.get(src);}
 draw(ctx,items,plane,game=null){
  for(const o of items){if(o.state==='ball-layer'||o.plane!==plane||o.hidden)continue;
   const targetId=game&&o.bind&&(game.targetGroups?.some(g=>g.targets.includes(o.bind))?o.bind:game.targetGroups?.some(g=>g.targets.includes(o.bind+'-1'))?o.bind+'-1':null);
   let targetAlpha=1;
   const hitId=targetId||(o.state==='target'?o.bind:null);
   if(game&&game.targetHits.has(hitId)){const age=game.time-(game.targetHitAt?.get(hitId)??game.time);targetAlpha=Math.max(0,1-age/.2);if(!targetAlpha)continue;}
   let smokeAlpha=1;
   if(game&&o.state==='hole-release'){
    const started=game.holeReleasedAt?.get(o.bind),age=started===undefined?-1:game.time-started;
    if(age<0||age>=.6)continue;
    smokeAlpha=age<.12?age/.12:1-(age-.12)/.48;
   }
   const state=this.map.artState(o,game,this,flashImage);if(!state)continue;
   const {src,baseSrc,frame}=state,baseImage=this.image(baseSrc),img=this.image(src);
   let [sx,sy,sw,sh]=o.crop;if(o.frameAxis==='y')sy+=frame*(o.frameStride||sh);else sx+=frame*(o.frameStride||sw);
   const ready=(image,x,y)=>image.complete&&image.naturalWidth&&x+sw<=image.naturalWidth+.01&&y+sh<=image.naturalHeight+.01;
   if(!ready(baseImage,o.crop[0],o.crop[1])&&!ready(img,sx,sy))continue;
   ctx.save();ctx.globalAlpha*=o.opacity*smokeAlpha*targetAlpha;
   if(o.state==='guide-arrow'){const time=game?game.time:performance.now()/1000;ctx.globalAlpha*=.3+.7*(.5+.5*Math.cos(time*Math.PI*3));}
   const f=game&&game.flippers.find(f=>f.id===o.bind);
   if(f){ctx.translate(...f.pivot);ctx.rotate(f.angle-f.rest);ctx.translate(-f.pivot[0],-f.pivot[1]);}
   const vortexAge=game&&o.bind&&o.state==='vortex'&&game.vortexActivatedAt!=null?Math.max(0,game.time-game.vortexActivatedAt):null;
   if(game&&o.bind&&o.state==='vortex'){
    const fade=vortexAge===null?0:game.vortexActive?Math.min(1,vortexAge/.8):Math.max(0,1-(vortexAge-15)/.8);
    ctx.globalAlpha*=.5+.5*fade*fade*(3-2*fade);
   }
   let x=o.x,y=o.y;
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
function serializable(items){return items.map(o=>{const result=integerGeometry(o);if(!o.src||o.src.startsWith('blob:')||o.src.startsWith('data:')){result.src='';result.needsAsset=true;}return result;});}
const api={flashImage,planes,validate,integerGeometry,serializable,Renderer};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PinballArt=api;
})(typeof window!=='undefined'?window:globalThis);
