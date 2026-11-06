/* Event-driven ring flashes, light echoes and combo scoring. Physics stays unchanged. */
const ImpactHitEffects=typeof module!=='undefined'&&module.exports?require('./hit-effects.js'):HitEffects;
function createImpactPresentation(game,artLayers,renderer,{ballsLast=false,collisionRingsHandled=false}={}){
 const drawRuntimeImage=globalThis.PinballRuntimeImages?.draw||((ctx,...args)=>ctx.drawImage(...args));
 const artById=new Map(artLayers.map(a=>[a.id,a]));
 const lampsBySource=new Map(),artOrder=new Map(artLayers.map((a,i)=>[a,i]));
 for(const a of artLayers)for(const t of [a.indicator?.trigger,...(a.indicator?.extraTriggers||[])]){
  if(!t?.source)continue;
  if(!lampsBySource.has(t.source))lampsBySource.set(t.source,new Set());
  lampsBySource.get(t.source).add(a);
 }
 const pulseColors=['#ffe59b','#b9f9ff'];
 const rings=[],lampPulses=new Map(),recent=new Map();
 const effectLists=[rings];let cleanedAt=null,cleanDirty=true,effectRevision=0;
 let cannonAt=-Infinity;
 let comboFlashAt=-Infinity,comboFlash=null,comboFlashPending=null;
 let combo=0,lastHit=-10,popAt=-10,shakeAt=-10,shakePower=0;
 let hudText=null,hudPlacement=null,hudFrame=null;
 const hudRasters=new Map();
 const intersects=(a,b)=>a[0]<b[2]&&b[0]<a[2]&&a[1]<b[3]&&b[1]<a[3];
 const fixedLayout=renderer.observedArt?.has(artLayers);
 function comboText(){
  if(!hudText||hudText.count!==combo){const size=Math.min(28,13+Math.log2(combo)*2.5);hudText={count:combo,text:String(combo),size,font:'bold '+size+'px sans-serif',multiplier:'×'+multiplier(combo)};}
  return hudText;
 }
 const multiplier=n=>n>=30?4:n>=20?3:n>=10?2:n>=5?1.5:1;
 const plane=()=>game.visualPlane(game.ball),position=e=>e.position||game.ball.p;
 const effectState=ImpactHitEffects.state(game);
 function burst(p,color,strength=1){
  cleanDirty=true;effectRevision++;
  effectState.add(ImpactHitEffects.ring('burst',p,plane(),game.time,{color,strength}),rings);
 }
 function pulse(source,all=false){
  if(ballsLast&&!all)return;
  cleanDirty=true;effectRevision++;
  if(all&&renderer.rasterCacheEnabled){comboFlashAt=game.time;return;}
  const light=a=>{if(!a.hidden&&a.indicator&&a.indicator.impactFlash!==false)lampPulses.set(a.id,{art:a,at:game.time+(all?(a.x%7)*.018:0),color:pulseColors[all?0:1]});};
  if(all){for(const a of artLayers)light(a);return;}
  // A grouped source such as target-001 must also match target-001-1.
  const matched=new Set();
  for(let id=source;id;){
   for(const a of lampsBySource.get(id)||[])matched.add(a);
   const split=id.lastIndexOf('-');if(split<0)break;id=id.slice(0,split);
  }
  for(const a of [...matched].sort((a,b)=>artOrder.get(a)-artOrder.get(b)))light(a);
 }
 function hit(id){
  if(!id||(recent.get(id)??-10)>game.time-.12)return false;
  recent.set(id,game.time);if(game.time-lastHit>2)combo=0;
  combo++;lastHit=popAt=game.time;
  game.combo={count:combo,multiplier:multiplier(combo),expiresAt:lastHit+2};
  if([5,10,20,30].includes(combo)){pulseCombo();shakeAt=game.time;shakePower=.7;}
  return true;
 }
 function pulseCombo(){
  if(renderer.rasterCacheEnabled)comboFlashAt=game.time;
  else pulse(null,true);
 }
 const comboFlashActive=()=>!!comboFlash&&game.time>=comboFlashAt&&game.time-comboFlashAt<.35;
 function prepareComboFlash(scale){
  if(!renderer.rasterCacheEnabled||typeof document==='undefined')return Promise.resolve();
  const items=artLayers.filter(a=>!a.hidden&&a.indicator&&a.indicator.impactFlash!==false).map(a=>{
   const c=a.indicator,src=c.type==='bumper'&&c.keepLevelOnHit?c['lv'+game.bumperLevel(c.trigger?.source||a.bind)]:c.on||c.lv3||c.complete||a.src;
   return {art:a,img:renderer.image(src)};
  });
  const key=JSON.stringify([scale,...items.map(({art:a,img})=>[renderer.imageKey(img),a.x,a.y,a.width,a.height,a.angle,a.flipX,a.flipY,a.crop])]);
  if(comboFlash?.key===key)return Promise.resolve();
  if(comboFlashPending?.key===key)return comboFlashPending.ready;
  const request={key};comboFlashPending=request;
  request.ready=(async()=>{
   await renderer.decodeImages(new Set(items.map(a=>a.img)));
   if(comboFlashPending!==request)return;
   let next=null;
   if(items.length){
    const [x,y,w,h]=game.g.view_box,pad=14/scale,boxes=[];let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
    for(const {art:a} of items){const angle=(a.angle||0)*Math.PI/180,c=Math.abs(Math.cos(angle)),s=Math.abs(Math.sin(angle)),rx=(a.width*c+a.height*s)/2+pad,ry=(a.width*s+a.height*c)/2+pad;boxes.push([a.x-rx,a.y-ry,a.x+rx,a.y+ry]);left=Math.min(left,a.x-rx);top=Math.min(top,a.y-ry);right=Math.max(right,a.x+rx);bottom=Math.max(bottom,a.y+ry);}
    left=Math.floor(Math.max(x,left)*scale)/scale;top=Math.floor(Math.max(y,top)*scale)/scale;right=Math.ceil(Math.min(x+w,right)*scale)/scale;bottom=Math.ceil(Math.min(y+h,bottom)*scale)/scale;
    const width=Math.max(1,Math.round((right-left)*scale)),height=Math.max(1,Math.round((bottom-top)*scale)),Art=typeof PinballArt==='undefined'?null:PinballArt;
    const canvas=Art?Art.rasterCanvas(width,height,renderer.bitmapCacheEnabled):document.createElement('canvas');canvas.width=width;canvas.height=height;
    const c=canvas.getContext('2d');c.setTransform(scale,0,0,scale,-left*scale,-top*scale);c.shadowColor=pulseColors[0];c.shadowBlur=6;
    for(const {art:a,img} of items){c.save();c.translate(a.x,a.y);c.rotate((a.angle||0)*Math.PI/180);c.scale(a.flipX?-1:1,a.flipY?-1:1);renderer.drawImageWithShadow(c,img,...a.crop,a.width,a.height,scale);c.restore();}
    const chunks=[];
    for(let sy=0;sy<height;sy+=96)for(let sx=0;sx<width;sx+=96){const tile=[left+sx/scale,top+sy/scale,left+Math.min(width,sx+96)/scale,top+Math.min(height,sy+96)/scale],touching=boxes.filter(b=>intersects(b,tile));if(!touching.length)continue;
     const l=Math.max(sx,Math.floor((Math.min(...touching.map(b=>b[0]))-left)*scale)),t=Math.max(sy,Math.floor((Math.min(...touching.map(b=>b[1]))-top)*scale)),r=Math.min(width,sx+96,Math.ceil((Math.max(...touching.map(b=>b[2]))-left)*scale)),b=Math.min(height,sy+96,Math.ceil((Math.max(...touching.map(b=>b[3]))-top)*scale));
     if(r>l&&b>t)chunks.push({sx:l,sy:t,w:r-l,h:b-t,bounds:[left+l/scale,top+t/scale,left+r/scale,top+b/scale]});
    }
    const clip=new Path2D();for(const chunk of chunks)clip.rect(chunk.bounds[0],chunk.bounds[1],chunk.bounds[2]-chunk.bounds[0],chunk.bounds[3]-chunk.bounds[1]);
    // Bake the fixed light footprint once; fading frames only paste this image.
    c.save();c.shadowBlur=0;c.globalCompositeOperation='destination-in';c.fillStyle='#fff';c.fill(clip);c.restore();
    next={key,scale,canvas:Art?Art.rasterImage(canvas):canvas,left,top,width:width/scale,height:height/scale,chunks};
   }
   if(comboFlash){if(comboFlash.canvas.close)comboFlash.canvas.close();else comboFlash.canvas.width=comboFlash.canvas.height=0;}
   comboFlash=next;comboFlashPending=null;
  })().catch(error=>{if(comboFlashPending===request)comboFlashPending=null;throw error;});
  return request.ready;
 }
 const originalCollision=game.collisionEffect.bind(game);
 game.collisionEffect=(edge,approach)=>{
  cleanDirty=true;effectRevision++;
  originalCollision(edge,approach);
  // Passive rebound faces still count when Boss mode disables score events.
  if(approach>0&&['rebound','active'].includes(edge.kind))hit(edge.id);
  if(approach<=8||!['bumper','rebound','active','target'].includes(edge.kind))return;
  const key='fx:'+edge.id;if((recent.get(key)??-10)>game.time-.12)return;recent.set(key,game.time);
  const bumper=edge.kind==='bumper',handled=collisionRingsHandled&&(bumper&&edge.c||(['rebound','active'].includes(edge.kind)||edge.mechanic==='active_rebound')&&edge.a&&edge.b);
  if(!handled){const level=bumper?game.bumperLevel(edge.id):1;burst(game.ball.p,bumper?'#a9edff':edge.kind==='target'?'#ffe69c':'#e9b575',bumper?.8+level*.3:.8);}
  pulse(edge.id);
 };
 const onEvent=game.onEvent;
 game.onEvent=e=>{
  cleanDirty=true;effectRevision++;
  if(['new-game','ready','drain','game-over'].includes(e.type)){
   comboFlashAt=-Infinity;
   combo=0;lastHit=-10;game.combo={count:0,multiplier:1,expiresAt:0};recent.clear();
   if(e.type==='new-game'){cannonAt=-Infinity;shakeAt=-10;rings.length=0;effectState.clear();lampPulses.clear();}
  }
  if(e.type==='score'||e.type==='score-hit'){
   hit(e.id);
   // scoreHit has already awarded base points. Add only the combo delta, before HUD/reward listeners.
   if(e.type==='score'&&game.scoringEnabled!==false&&e.points>0){const base=e.points,total=Math.round(base*multiplier(combo));game.score+=total-base;e.basePoints=base;e.points=total;e.multiplier=multiplier(combo);}
   pulse(e.id);
  }
  if(e.type==='rollover'||e.type==='sensor'){if(e.combo!==false){hit(e.id);}pulse(e.id);}
  if(e.type==='slingshot-hit'){hit(e.id);pulse(e.id);}
  if(e.type==='capture')burst(position(e),'#a1f3de',.8);
  if(['target-group-complete','configured-attack','bumper-upgraded','multiball-awarded','center-post-up','vortex-activated'].includes(e.type)){
   pulse(null,true);shakeAt=game.time;shakePower=e.type==='configured-attack'?1.3:.7;
  }
  onEvent?.(e);
  if(comboFlash&&['bumper-upgraded','new-game'].includes(e.type))prepareComboFlash(comboFlash.scale).catch(console.error);
 };
 function clean(){
  if(!cleanDirty&&cleanedAt===game.time)return;
  cleanDirty=false;cleanedAt=game.time;
  if(game.time-lastHit>2&&combo){combo=0;game.combo={count:0,multiplier:1,expiresAt:0};}
  for(const list of effectLists){let live=0;for(let i=0;i<list.length;i++)if(!(game.time-list[i].at>(list[i].life||.4)))list[live++]=list[i];list.length=live;}
  for(const [id,p] of lampPulses)if(game.time-p.at>.35)lampPulses.delete(id);
  for(const [id,at] of recent)if(game.time-at>2)recent.delete(id);
 }
 const floors=new Map(),trailStates=new WeakMap();let preparedAt=null,preparedRevision=null,preparedBallEffects=null,preparedBallTrails=null,preparedEffectRevision=-1;
 function floorEffects(plane){
  let row=floors.get(plane);if(!row){row={rings:[],lamps:[],balls:[]};floors.set(plane,row);}return row;
 }
 function prepareEffects(force=false){
  const dirty=cleanDirty;clean();
  if(!force&&!dirty&&preparedEffectRevision===effectRevision&&preparedAt===game.time&&preparedRevision===renderer.layoutRevision&&preparedBallEffects===game.g.gameplay?.ballEffects&&preparedBallTrails===game.g.gameplay?.ballTrails)return;
  preparedAt=game.time;preparedEffectRevision=effectRevision;preparedRevision=renderer.layoutRevision;preparedBallEffects=game.g.gameplay?.ballEffects;preparedBallTrails=game.g.gameplay?.ballTrails;
  for(const row of floors.values())row.rings.length=row.lamps.length=row.balls.length=0;
  for(const r of rings)if(!r.suppressed)floorEffects(r.plane).rings.push(r);
  if(!comboFlashActive())for(const [id,q] of lampPulses){const a=artById.get(id);if(a&&!a.hidden&&game.time>=q.at)floorEffects(a.plane).lamps.push(q);}
  if(game.g.gameplay?.ballEffects!==false&&game.g.gameplay?.ballTrails!==false)for(const b of game.balls){
   if(b.state!=='playing')continue;const speed=Math.hypot(...b.v);if(speed<180)continue;
   const trail=b.trail;let start=trail?.length||0,count=0;
   for(let i=start-1;i>=0;i--)if(trail[i].layer===b.layer){start=i;if(++count===10)break;}
   if(count>=2){let state=trailStates.get(b);if(!state){state={ball:b};trailStates.set(b,state);}state.speed=speed;state.start=start;state.count=count;floorEffects(game.visualPlane(b)).balls.push(state);}
  }
 }
 function hasEffects(floor){
  prepareEffects();const row=floors.get(floor);return !!row&&(row.lamps.length>0||!game.webglEffectsActive&&row.rings.length>0);
 }
 function drawTrails(ctx,floor,onlyBall=null){if(game.webglEffectsActive)return;prepareEffects();const row=floors.get(floor);if(!row?.balls.length)return;ctx.save();
  for(const {ball:b,speed,start,count} of row.balls){
   if(onlyBall&&b!==onlyBall)continue;
   const trail=b.trail;
   ctx.strokeStyle=combo>=10?'#ffe597':'#a9eaff';
   let previous=null,index=0;
   for(let i=start;i<(trail?.length||0);i++){const point=trail[i];if(point.layer!==b.layer)continue;if(previous){index++;ctx.globalAlpha=(index/count)*Math.min(.48,speed/1800);ctx.lineWidth=.5+index/count*2;ctx.beginPath();ctx.moveTo(...previous.p);ctx.lineTo(...point.p);ctx.stroke();}previous=point;}
  }
  ctx.restore();
 }
 function draw(ctx,floor,bounds=game.g.view_box){
  if(!hasEffects(floor))return;const row=floors.get(floor);
  if(ballsLast&&!row.lamps.length){if(!game.webglEffectsActive)ImpactHitEffects.drawRings(ctx,row.rings,game.time);return;}
  ctx.save();ctx.lineCap='round';
  let transform,shadowScale,shadowStyle;
  // Legacy painters still interleave balls with artwork; the final-ball pass needs no holes.
  if(!ballsLast)for(const b of game.balls){
   if(b.state==='drained')continue;
   ctx.beginPath();ctx.rect(...bounds);ctx.moveTo(b.p[0]+game.physics.ballRadius,b.p[1]);
   ctx.arc(...b.p,game.physics.ballRadius,0,Math.PI*2);ctx.clip('evenodd');
  }
  if(!game.webglEffectsActive)ImpactHitEffects.drawRings(ctx,row.rings,game.time);
  ctx.save();
  for(const q of row.lamps){const a=q.art,age=game.time-q.at;
   const c=a.indicator,src=c.type==='bumper'&&c.keepLevelOnHit?c['lv'+game.bumperLevel(c.trigger?.source||a.bind)]:c.on||c.lv3||c.complete||a.src,img=renderer.image(src),fade=Math.sin(Math.PI*age/.35);
   if(transform===undefined)transform=readTransform(ctx);
   const angle=(a.angle||0)*Math.PI/180,flipX=a.flipX?-1:1,flipY=a.flipY?-1:1;
   if(transform)setPose(ctx,transform,a.x,a.y,angle,flipX,flipY);else{ctx.save();ctx.translate(a.x,a.y);ctx.rotate(angle);ctx.scale(flipX,flipY);}
   ctx.globalAlpha=.65*fade;
   if(transform&&renderer.prepareShadowRaster){
    if(!shadowStyle){
     shadowStyle={shadowBlur:6,shadowColor:q.color,shadowOffsetX:ctx.shadowOffsetX,shadowOffsetY:ctx.shadowOffsetY,globalCompositeOperation:ctx.globalCompositeOperation,filter:ctx.filter,imageSmoothingEnabled:ctx.imageSmoothingEnabled,imageSmoothingQuality:ctx.imageSmoothingQuality,getTransform:()=>ctx.getTransform()};
     ctx.shadowColor='transparent';ctx.shadowBlur=0;
    }
    shadowStyle.shadowColor=q.color;
   }else{ctx.shadowColor=q.color;ctx.shadowBlur=6;}
   if(img.complete&&img.naturalWidth){
    if(shadowScale===undefined)shadowScale=transform&&transform.b===0&&transform.c===0&&Math.abs(Math.abs(transform.a)-Math.abs(transform.d))<1e-7?Math.abs(transform.a):null;
    if(renderer.drawImageWithShadow)renderer.drawImageWithShadow(ctx,img,...a.crop,a.width,a.height,shadowScale,shadowStyle);
    else drawRuntimeImage(ctx,img,...a.crop,-a.width/2,-a.height/2,a.width,a.height);
   }
   if(!transform)ctx.restore();
  }
  ctx.restore();
  ctx.restore();
 }
 function readTransform(ctx){
  const m=ctx.getTransform?.();
  // Read native DOMMatrix getters once, not for every particle or lamp.
  return m?{a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f}:null;
 }
 function setPose(ctx,m,x,y,angle,flipX=1,flipY=1){
  const c=Math.cos(angle),s=Math.sin(angle);
  ctx.setTransform((m.a*c+m.c*s)*flipX,(m.b*c+m.d*s)*flipX,(m.c*c-m.a*s)*flipY,(m.d*c-m.b*s)*flipY,m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f);
 }
 function comboAnchor(bounds){
  const [x,y,w,h]=bounds;
  if(fixedLayout&&hudPlacement&&hudPlacement.flippers===game.flippers&&hudPlacement.revision===renderer.layoutRevision&&hudPlacement.x===x&&hudPlacement.y===y&&hudPlacement.w===w&&hudPlacement.h===h)return hudPlacement;
  // Use the bottommost flipper on each side, excluding higher auxiliary flippers.
  let hasLower=false;for(const f of game.flippers)if((f.layer||'lower')==='lower'){hasLower=true;break;}
  let left=null,right=null,first=null,second=null;
  for(const f of game.flippers){
   if(hasLower&&(f.layer||'lower')!=='lower')continue;
   if(!first||f.pivot[1]>first.pivot[1]){second=first;first=f;}else if(!second||f.pivot[1]>second.pivot[1])second=f;
   const side=f.control||f.side;
   if(side==='left'&&(!left||f.pivot[1]>left.pivot[1]))left=f;
   if(side==='right'&&(!right||f.pivot[1]>right.pivot[1]))right=f;
  }
  const a=left&&right?left:first,b=left&&right?right:second;
  const cx=a?(b?(a.pivot[0]+b.pivot[0])/2:a.pivot[0]):x+w/2;
  const cy=a?(b?(a.pivot[1]+b.pivot[1])/2:a.pivot[1])-75:y+h-100;
  hudPlacement={cx,cy,flippers:game.flippers,revision:renderer.layoutRevision,x,y,w,h};return hudPlacement;
 }
 function hudRaster(id,text,font,size,color,outline,scale,stroke=true){
  const key=JSON.stringify([text,font,color,outline,scale,stroke]),previous=hudRasters.get(id);if(previous?.key===key)return previous;
  const canvas=document.createElement('canvas'),c=canvas.getContext('2d');c.font=font;
  canvas.width=Math.max(1,Math.ceil((c.measureText(text).width+8)*scale));canvas.height=Math.ceil((size*2+8)*scale);
  c.setTransform(scale,0,0,scale,canvas.width/2,canvas.height/2);c.font=font;c.textAlign='center';c.textBaseline='middle';c.lineWidth=3;c.strokeStyle=outline;c.fillStyle=color;if(stroke)c.strokeText(text,0,0);c.fillText(text,0,0);
  if(previous)previous.canvas.width=previous.canvas.height=0;
  const result={key,canvas,width:canvas.width/scale,height:canvas.height/scale};hudRasters.set(id,result);return result;
 }
 function prepareHud(scale,bounds){
  clean();const parts=[],damage=[],hud=game.g.gameplay?.comboHud||{},previous=hudFrame;
  let bar=null;
  if(combo>=2){const {cx,cy}=comboAnchor(bounds),label=comboText(),age=Math.max(0,game.time-popAt),pop=age<.3?1+.18*Math.exp(-age*18):1,color=hud.color||(combo>=10?'#ffe39a':'#c6f5ff'),outline=hud.outline||'#142735';
   for(const [id,text,font,size,y,zoom,stroke] of [['label','COMBO','bold 9px sans-serif',9,cy-25,1,true],['number',label.text,label.font,label.size,cy,pop,true],['multiplier',label.multiplier,'bold 9px sans-serif',9,cy+label.size*.85,1,false]]){
    const raster=hudRaster(id,text,font,size,color,outline,scale,stroke),w=raster.width*zoom,h=raster.height*zoom;
    parts.push({id,raster,x:cx-w/2,y:y-h/2,w,h,key:raster.key+'|'+cx+'|'+y+'|'+zoom,bounds:[cx-w/2,y-h/2,cx+w/2,y+h/2]});
   }
   const width=Math.round(56*scale*Math.max(0,(lastHit+2-game.time)/2))/scale;
   bar={x:bounds[0]+Math.round((cx-28-bounds[0])*scale)/scale,y:bounds[1]+Math.round((cy+label.size*1.4-bounds[1])*scale)/scale,width,height:Math.max(1,Math.round((hud.barHeight??1.5)*scale))/scale,color:hud.barColor||color};bar.bounds=[bar.x,bar.y-1/scale,bar.x+bar.width,bar.y+bar.height+1/scale];
  }
  for(const part of parts){const old=previous?.parts.find(p=>p.id===part.id);if(!old||old.key!==part.key){if(old)damage.push(old.bounds);damage.push(part.bounds);}}
  for(const old of previous?.parts||[])if(!parts.some(p=>p.id===old.id))damage.push(old.bounds);
  const old=previous?.bar;
  if(bar&&old&&bar.x===old.x&&bar.y===old.y&&bar.height===old.height&&bar.color===old.color){if(bar.width!==old.width)damage.push([bar.x+Math.min(bar.width,old.width)-1/scale,bar.y-1/scale,bar.x+Math.max(bar.width,old.width)+1/scale,bar.y+bar.height+1/scale]);}
  else{if(old)damage.push(old.bounds);if(bar)damage.push(bar.bounds);}
  hudFrame={parts,bar,damage};return hudFrame;
 }
 return {draw,drawTrails,trailBounds(onlyBall=null){if(game.webglEffectsActive)return [];prepareEffects();const boxes=[];for(const row of floors.values())for(const {ball,start}of row.balls)if(!onlyBall||ball===onlyBall)for(const p of (ball.trail||[]).slice(start))if(p.layer===ball.layer)boxes.push([p.p[0]-7,p.p[1]-7,p.p[0]+7,p.p[1]+7]);return boxes;},hasEffects,damage(){
  prepareEffects();const bounds=[];const add=(x,y,r)=>bounds.push([x-r,y-r,x+r,y+r]);
  for(const row of floors.values()){
   if(!game.webglEffectsActive){
   for(const {ball}of row.balls)for(const p of (ball.trail||[]).slice(-12))add(...p.p,7);
   for(const q of row.rings)bounds.push(ImpactHitEffects.bounds(q,game.time));
   }
   for(const q of row.lamps){const a=q.art,r=Math.hypot(a.width,a.height)/2+24;add(a.x,a.y,r);}
  }
  if(!hudFrame&&combo>=2){const {cx,cy}=comboAnchor(game.g.view_box),size=comboText().size,r=Math.max(110,size*2+12);bounds.push([cx-r,cy-size-40,cx+r,cy+size*1.5+14]);}
  return {full:false,isolated:[...(hudFrame?.damage||[]),...(comboFlashActive()?comboFlash.chunks.map(c=>c.bounds):[])],active:comboFlashActive()||[...floors.values()].some(r=>r.rings.length||r.lamps.length ),bounds};
 },drawGPU(gpu){
  prepareEffects();
  for(const row of floors.values()){
   for(const r of row.rings)ImpactHitEffects.drawRing(gpu,r,game.time,true);
  }
 },update:()=>prepareEffects(true),prepareHud,prepareComboFlash,drawComboFlash(ctx,bounds=game.g.view_box,regions=null,alreadyClipped=false){
  if(!comboFlashActive())return;
  ctx.save();
  if(!ballsLast)for(const b of game.balls){if(b.state==='drained')continue;ctx.beginPath();ctx.rect(...bounds);ctx.moveTo(b.p[0]+game.physics.ballRadius,b.p[1]);ctx.arc(...b.p,game.physics.ballRadius,0,Math.PI*2);ctx.clip('evenodd');}
  ctx.globalAlpha=.65*Math.sin(Math.PI*(game.time-comboFlashAt)/.35);ctx.shadowBlur=0;
  if(regions&&!alreadyClipped){ctx.beginPath();for(const b of regions)ctx.rect(b[0],b[1],b[2]-b[0],b[3]-b[1]);ctx.clip();}
  ctx.drawImage(comboFlash.canvas,comboFlash.left,comboFlash.top,comboFlash.width,comboFlash.height);ctx.restore();
 },async prepareShadows(scale){
  if(!renderer.rasterCacheEnabled||!renderer.prepareShadowRaster)return;
  await prepareComboFlash(scale);
  const entries=[],images=new Set();
  for(const a of artLayers){if(a.hidden||!a.indicator||a.indicator.impactFlash===false)continue;
   const c=a.indicator,sources=c.type==='bumper'&&c.keepLevelOnHit?[c.lv1,c.lv2,c.lv3]:[c.on||c.lv3||c.complete||a.src];
   for(const src of sources){if(!src)continue;const img=renderer.image(src);images.add(img);entries.push({art:a,img});}
  }
  if(!entries.length)return;
  await renderer.decodeImages(images);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const brush=canvas.getContext('2d');brush.setTransform(scale,0,0,scale,0,0);brush.shadowBlur=6;
  try{for(const color of pulseColors){brush.shadowColor=color;for(const {art:a,img} of entries)renderer.prepareShadowRaster(brush,img,...a.crop,a.width,a.height);}}
  finally{canvas.width=canvas.height=0;}
 },onTheaterSound(name,now=performance.now()){
  if(name==='explosion')cannonAt=now;
 },screenShake(now=performance.now()){
  const age=(now-cannonAt)/1000;
  if(game.paused||age<0||age>=.3)return [0,0];
  const amplitude=5*(1-age/.3)**2;
  return [Math.cos(age*135)*amplitude,Math.sin(age*170)*amplitude*.7];
 },preview(kind){
  cleanDirty=true;effectRevision++;
  const p=[180,230];
  if(['target','bumper','rebound','slingshot','hole'].includes(kind))burst(p,kind==='bumper'?'#a9edff':kind==='hole'?'#a1f3de':kind==='slingshot'||kind==='rebound'?'#e9b575':'#ffe49b');
  if(kind==='combo'){combo=19;lastHit=game.time;recent.clear();hit('preview-combo');}
  if(kind==='combo')pulseCombo();else pulse(null,true);
 },ballGlowLevel(ball){
  if(game.g.gameplay?.ballEffects===false||combo<2||game.time-lastHit>=2||['ready','drained'].includes(ball.state))return 0;
  const strength=Math.min(1,(combo-1)/29),fade=Math.min(1,(lastHit+2-game.time)/.25);
  return Math.max(1,Math.ceil(strength*fade*4));
 },drawBallGlow(ctx,ball){
  if(game.g.gameplay?.ballEffects===false||combo<2||game.time-lastHit>2||['ready','drained'].includes(ball.state))return;
  const strength=Math.min(1,(combo-1)/29),r=game.physics.ballRadius,radius=r*(1.25+strength*1.25);
  const glow=ctx.createRadialGradient(...ball.p,r*.65,...ball.p,radius);
  glow.addColorStop(0,'rgba(255,250,220,.8)');glow.addColorStop(.45,'rgba(255,219,135,.45)');glow.addColorStop(1,'rgba(255,219,135,0)');
  ctx.save();ctx.globalAlpha*=(.45+.55*strength)*Math.min(1,(lastHit+2-game.time)/.25);ctx.fillStyle=glow;
  ctx.beginPath();ctx.arc(...ball.p,radius,0,Math.PI*2);ctx.moveTo(ball.p[0]+r,ball.p[1]);ctx.arc(...ball.p,r,0,Math.PI*2);ctx.fill('evenodd');ctx.restore();
 },get combo(){return {count:combo,multiplier:multiplier(combo),expiresAt:lastHit+2};},shake(){const t=game.time-shakeAt;if(t<0||t>.16)return [0,0];const fade=1-t/.16;return [Math.sin(t*150)*shakePower*fade,Math.cos(t*170)*shakePower*fade];},drawHud(ctx,bounds,options=null){
  if(options&&hudFrame){
   const visible=box=>!options.regions||options.regions.some(b=>intersects(box,b));
   for(const part of hudFrame.parts)if(visible(part.bounds))ctx.drawImage(part.raster.canvas,part.x,part.y,part.w,part.h);
   const bar=hudFrame.bar;if(bar&&visible(bar.bounds)){ctx.save();ctx.globalAlpha=.8;ctx.fillStyle=bar.color;ctx.fillRect(bar.x,bar.y,bar.width,bar.height);ctx.restore();}return;
  }
  clean();if(combo<2)return;
  const {cx,cy}=comboAnchor(bounds),label=comboText(),size=label.size;
  const pop=1+.18*Math.exp(-Math.max(0,game.time-popAt)*18);
  const hud=game.g.gameplay?.comboHud||{};
  ctx.save();ctx.translate(cx,cy);ctx.scale(pop,pop);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=label.font;ctx.lineWidth=3;ctx.strokeStyle=hud.outline||'#142735';ctx.fillStyle=hud.color||(combo>=10?'#ffe39a':'#c6f5ff');ctx.strokeText(label.text,0,0);ctx.fillText(label.text,0,0);ctx.scale(1/pop,1/pop);ctx.font='bold 9px sans-serif';ctx.strokeText('COMBO',0,-25);ctx.fillText('COMBO',0,-25);
  ctx.font='bold 9px sans-serif';ctx.fillText(label.multiplier,0,size*.85);ctx.globalAlpha=.8;ctx.fillStyle=hud.barColor||ctx.fillStyle;ctx.fillRect(-28,size*1.4,56*Math.max(0,(lastHit+2-game.time)/2),hud.barHeight??1.5);ctx.restore();
 }};
}
if(typeof module!=='undefined')module.exports=createImpactPresentation;
