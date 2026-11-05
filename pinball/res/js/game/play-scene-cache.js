/* Authored ball masks are independent of fixed/slow output grouping.
   Other sprite caches retain their existing painter-order compositing. */
(function(root){
'use strict';
const make=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
// Ball buffers keep capacity across one-pixel bounds changes and smaller trails.
const size=(c,w,h,retain=false)=>{const width=retain?Math.max(c.width,Math.ceil(w/16)*16):w,height=retain?Math.max(c.height,Math.ceil(h/16)*16):h;if(c.width!==width)c.width=width;if(c.height!==height)c.height=height;};
// Compiled from the authored layout before any output-cache grouping.
class PlayBallMasks{
 constructor(){this.revision=null;this.layers=new Map();}
 prepare(key,width,height,view,paint,sources=[]){
  if(key===this.revision)return;
  this.destroy();const scale=width/view[2];this.scale=scale;this.view=[...view];this.sources=sources.filter(source=>!source.fixed);this.scratch=make(width,height);this.scratch.getContext('2d',{willReadFrequently:true});
  for(const plane of ['lower','upper','top']){
   const c=this.scratch.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,width,height);
   c.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);paint(c,plane,null,true);
   const m={width,height,bits:new Uint8Array(Math.ceil(width*height/8)),revision:0};this.layers.set(plane,m);this.read(plane,[0,0,width,height]);m.base=m.bits.slice();m.work=m.bits.slice();
  }
  for(const source of this.sources){source.signature=source.key();source.previousBounds=[...source.bounds()];source.masks=new Map();source.current=this.raster(source,source.signature,source.previousBounds);}
  for(const [plane,m] of this.layers){m.sources=this.sources.filter(source=>source.planes.includes(plane));for(const source of m.sources)this.merge(source.current,m.bits,m.width,[0,0,width,height]);m.empty=!m.sources.length&&!m.bits.some(Boolean);}
  this.revision=key;
 }
 read(plane,box){
  const m=this.get(plane),[x,y,right,bottom]=box,w=right-x,h=bottom-y;if(w<=0||h<=0)return false;
  const pixels=this.scratch.getContext('2d').getImageData(x,y,w,h);
  let changed=false;
  for(let py=0;py<h;py++)for(let px=0;px<w;px++){const p=(py*w+px)*4,index=(y+py)*m.width+x+px,bit=1<<(index&7),covered=pixels.data[p+3]>0;if(covered===!!(m.bits[index>>3]&bit))continue;changed=true;if(covered)m.bits[index>>3]|=bit;else m.bits[index>>3]&=~bit;}
  return changed;
 }
 box(bounds){const m=this.get('lower');return [Math.max(0,Math.floor((bounds[0]-this.view[0])*this.scale)),Math.max(0,Math.floor((bounds[1]-this.view[1])*this.scale)),Math.min(m.width,Math.ceil((bounds[2]-this.view[0])*this.scale)),Math.min(m.height,Math.ceil((bounds[3]-this.view[1])*this.scale))];}
 raster(source,key,bounds){
  if(source.masks.has(key))return source.masks.get(key);
  const [x,y,right,bottom]=this.box(bounds),w=Math.max(0,right-x),h=Math.max(0,bottom-y),tile={x,y,w,h,bits:new Uint8Array(Math.ceil(w*h/8))};
  if(w&&h){const c=this.scratch.getContext('2d');c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(x,y,w,h);c.beginPath();c.rect(x,y,w,h);c.clip();c.setTransform(this.scale,0,0,this.scale,-this.view[0]*this.scale,-this.view[1]*this.scale);source.paint(c);c.restore();
   const pixels=c.getImageData(x,y,w,h).data;for(let i=0;i<w*h;i++)if(pixels[i*4+3])tile.bits[i>>3]|=1<<(i&7);
  }
  // Bound animated/fading states; common on/off states remain reusable.
  if(source.masks.size===4)source.masks.delete(source.masks.keys().next().value);source.masks.set(key,tile);return tile;
 }
 merge(tile,bits,width,box){
  const left=Math.max(tile.x,box[0]),top=Math.max(tile.y,box[1]),right=Math.min(tile.x+tile.w,box[2]),bottom=Math.min(tile.y+tile.h,box[3]);
  for(let y=top;y<bottom;y++)for(let x=left;x<right;){const src=(y-tile.y)*tile.w+x-tile.x,dst=y*width+x,n=Math.min(8-(dst&7),right-x),value=(tile.bits[src>>3]>>(src&7))|((tile.bits[(src>>3)+1]||0)<<(8-(src&7)));bits[dst>>3]|=(value&((1<<n)-1))<<(dst&7);x+=n;}
 }
 repair(m,box){
  const [left,top,right,bottom]=box;if(right<=left||bottom<=top)return false;
  for(let y=top;y<bottom;y++){const a=(y*m.width+left)>>3,b=(y*m.width+right+7)>>3;for(let i=a;i<b;i++)m.work[i]=m.base[i];}
  for(const source of m.sources)this.merge(source.current,m.work,m.width,box);
  let changed=false;
  for(let y=top;y<bottom;y++){const a=y*m.width+left,b=y*m.width+right;for(let i=a>>3;i<((b+7)>>3);i++){const start=Math.max(a,i*8),end=Math.min(b,i*8+8),mask=((1<<(end-start))-1)<<(start&7),value=(m.bits[i]&~mask)|(m.work[i]&mask);if(value!==m.bits[i]){m.bits[i]=value;changed=true;}}}
  return changed;
 }
 update(){
  const damage=new Map();
  for(const source of this.sources||[]){const signature=source.key();if(signature===source.signature)continue;
   const bounds=[...source.bounds()],old=source.current;source.signature=signature;source.previousBounds=bounds;source.current=this.raster(source,signature,bounds);
   for(const plane of source.planes){let boxes=damage.get(plane);if(!boxes)damage.set(plane,boxes=[]);for(const tile of [old,source.current]){const box=[tile.x,tile.y,tile.x+tile.w,tile.y+tile.h];if(tile.w&&tile.h&&!boxes.some(b=>b.every((n,i)=>n===box[i])))boxes.push(box);}
   }
  }
  for(const [plane,boxes] of damage){const m=this.get(plane);let changed=false;for(const box of boxes)changed=this.repair(m,box)||changed;if(changed)m.revision++;}
 }
 get(plane){return this.layers.get(plane);}
 destroy(){if(this.scratch)this.scratch.width=this.scratch.height=0;this.layers.clear();this.sources=[];this.revision=null;}
}
class PlaySceneCache{
 constructor(){this.units=[];this.groups=[];this.retainedUnits=[];this.movingUnits=[];this.authoredUnits=[];this.outlineUnits=[];this.drawGroups={};this.revision=null;this.retainedRevision=0;this.stats={builds:0,updates:0,blits:0};this.changedMoving=[];this.changedRetained=[];this.previousExtra=[];this.previousIsolated=[];}
 world(c,x=0,y=0){c.setTransform(this.scale,0,0,this.scale,-this.view[0]*this.scale-x,-this.view[1]*this.scale-y);}
 rect(u,box){
  u.x=Math.max(0,Math.floor((box[0]-this.view[0])*this.scale));u.y=Math.max(0,Math.floor((box[1]-this.view[1])*this.scale));
  u.w=Math.max(0,Math.min(this.width,Math.ceil((box[2]-this.view[0])*this.scale))-u.x);u.h=Math.max(0,Math.min(this.height,Math.ceil((box[3]-this.view[1])*this.scale))-u.y);
 }
 opaque(u,region=null){
  const c=u.cover,m=u.opaque||(u.opaque=make(c.width,c.height));if(m.width!==c.width||m.height!==c.height){m.width=c.width;m.height=c.height;}
  const box=region||[0,0,c.width,c.height],x=box[0],y=box[1],w=box[2]-x,h=box[3]-y;if(w<=0||h<=0)return;
  const pixels=c.getContext('2d').getImageData(x,y,w,h);if(u.ballPlane&&!u.maskAlpha)u.maskAlpha=new Uint8Array(c.width*c.height);
  for(let py=0;py<h;py++)for(let px=0;px<w;px++){const p=(py*w+px)*4,alpha=pixels.data[p+3];pixels.data[p]=pixels.data[p+1]=pixels.data[p+2]=255;pixels.data[p+3]=alpha===255?255:0;if(u.maskAlpha)u.maskAlpha[(py+y)*c.width+px+x]=alpha;}
  m.getContext('2d').putImageData(pixels,x,y);
 }
 visibility(u,box){
  const mask=u.authoredMask,data=mask?.bits||u.maskAlpha,max=mask?1:255;if(!data)return 'visible';
  const x0=Math.floor((box[0]-this.view[0])*this.scale)-u.coverX,y0=Math.floor((box[1]-this.view[1])*this.scale)-u.coverY,x1=Math.ceil((box[2]-this.view[0])*this.scale)-u.coverX,y1=Math.ceil((box[3]-this.view[1])*this.scale)-u.coverY;
  const width=mask?.width||u.cover.width,height=mask?.height||u.cover.height;
  if(x0<0||y0<0||x1>width||y1>height)return 'partial';
  let covered=false,open=false;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const index=y*width+x,a=mask?(data[index>>3]>>(index&7))&1:data[index];covered||=a>0;open||=a<max;if(covered&&open)return 'partial';}
  return covered?'hidden':'visible';
 }
 cover(u,suffix,updateOpaque=true){
  const c=u.cover.getContext('2d');c.globalCompositeOperation='copy';c.drawImage(suffix,u.coverX,u.coverY,u.cover.width,u.cover.height,0,0,u.cover.width,u.cover.height);c.globalCompositeOperation='source-over';
  if(updateOpaque)this.opaque(u);
 }
 prepare(key,width,height,view,units,background,ballMasks=null){
  if(key===this.revision)return;
  this.destroy();this.width=width;this.height=height;this.view=[...view];this.scale=width/view[2];this.units=units;
  const full=[view[0],view[1],view[0]+view[2],view[1]+view[3]],base=this.base=make(width,height),b=base.getContext('2d');this.world(b);background(b);b.setTransform(1,0,0,1,0,0);
  for(const u of units){
   this.rect(u,typeof u.bounds==='function'?full:u.bounds||full);if(!u.w||!u.h)continue;
   if(u.fixed){u.fixedImage=make(u.w,u.h);this.world(u.fixedImage.getContext('2d'),u.x,u.y);u.paint(u.fixedImage.getContext('2d'));b.drawImage(u.fixedImage,u.x,u.y);}
  }
  const suffix=this.suffix=make(width,height),s=suffix.getContext('2d');
  for(let i=units.length-1;i>=0;i--){const u=units[i];if(!u.w||!u.h)continue;
   if(u.fixed){s.globalCompositeOperation='destination-over';s.drawImage(u.fixedImage,u.x,u.y);continue;}
   const authoredMask=u.ballPlane&&ballMasks?.get(u.ballPlane==='background'?'lower':u.ballPlane);
   if(authoredMask){u.authoredMask=authoredMask;u.coverX=u.coverY=0;}
   else if(!u.unmasked){u.coverX=u.x;u.coverY=u.y;u.cover=make(u.w,u.h);this.cover(u,suffix);}
   u.cache=make(1,1);u.signature=null;
   if(u.moving){if(!u.authoredMask&&!u.unmasked){u.staticCover=make(u.w,u.h);u.staticCover.getContext('2d').drawImage(u.cover,0,0);}u.maskRevision=0;}
   if(u.outline&&!authoredMask)u.outlineCache=make(1,1);
  }
  s.globalCompositeOperation='source-over';
  this.groups=[];for(const u of units){if(u.fixed||!u.cache)continue;let g=this.groups.at(-1);if(u.moving||u.separateCache||!g||g.moving||g.separateCache){g={units:[],moving:!!u.moving,separateCache:!!u.separateCache,revision:0,boundsRevision:-1,renderedRevision:-1};this.groups.push(g);}g.units.push(u);u.group=g;}
  for(const g of this.groups)if(g.units.length>1)g.cache=make(1,1);
  this.retainedUnits=units.filter(u=>!u.fixed&&(!u.moving||u.cacheWhenIdle)&&u.cache);this.movingUnits=units.filter(u=>u.moving&&!u.cacheWhenIdle&&u.cache);this.authoredUnits=units.filter(u=>u.authoredMask);this.outlineUnits=units.filter(u=>u.outline);
  for(const u of units)if(u.moving&&u.cover&&!u.authoredMask)u.coverRetained=units.slice(units.indexOf(u)+1).filter(v=>!v.fixed&&(!v.moving||v.cacheWhenIdle)&&v.cache);
  for(const frequency of ['all','moving','retained'])for(const content of ['all','objects','balls'])this.drawGroups[frequency+':'+content]=this.groups.filter(g=>(frequency==='all'||(frequency==='retained'?!g.moving||g.units[0].cacheWhenIdle:g.moving))&&(content==='all'||(g.units[0].ballSlot!==undefined)===(content==='balls')));
  this.revision=key;this.needsMoving=true;this.needsRetained=true;this.previousExtra=[];this.previousIsolated=[];this.stats.builds++;
 }
 prepareBallMask(u){
  if(u.authoredMask.empty){u.maskVisibility='visible';for(const row of u.preparedBalls||[])row.visibility='visible';return;}
  const m=u.authoredMask,bodies=(u.preparedBalls||[]).map(row=>{const b=row.maskBounds||row.bounds,box=[Math.floor((b[0]-this.view[0])*this.scale),Math.floor((b[1]-this.view[1])*this.scale),Math.ceil((b[2]-this.view[0])*this.scale),Math.ceil((b[3]-this.view[1])*this.scale)];return {row,box,covered:false,open:false,outside:box[0]<0||box[1]<0||box[2]>m.width||box[3]>m.height};});
  const key=[u.x,u.y,u.w,u.h,m.revision,...bodies.flatMap(b=>b.box)].join('|');
  if(key===u.maskPathKey){for(let i=0;i<bodies.length;i++)bodies[i].row.visibility=u.bodyVisibility[i];return;}
  let path=null,covered=false,open=false;
  for(let y=0;y<u.h;y++){
   let start=-1;for(let x=0;x<u.w;){const index=(u.y+y)*m.width+u.x+x,n=Math.min(8,u.w-x),all=(1<<n)-1,bits=((m.bits[index>>3]>>(index&7))|((m.bits[(index>>3)+1]||0)<<(8-(index&7))))&all;
    covered||=bits!==0;open||=bits!==all;
    for(const body of bodies){const b=body.box;if(body.outside||body.covered&&body.open||u.y+y<b[1]||u.y+y>=b[3])continue;const left=Math.max(u.x+x,b[0]),right=Math.min(u.x+x+n,b[2]);if(right>left){const mask=(1<<(right-left))-1,value=(bits>>(left-u.x-x))&mask;body.covered||=value!==0;body.open||=value!==mask;}}
    if(bits===all){if(start<0)start=x;x+=n;continue;}
    if(bits===0){if(start>=0){(path??=new Path2D()).rect(start,y,x-start,1);start=-1;}x+=n;continue;}
    for(let i=0;i<n;i++,x++){if(bits&(1<<i)){if(start<0)start=x;}else if(start>=0){(path??=new Path2D()).rect(start,y,x-start,1);start=-1;}}
   }if(start>=0)(path??=new Path2D()).rect(start,y,u.w-start,1);
  }
  u.maskVisibility=covered?(open?'partial':'hidden'):'visible';u.bodyVisibility=bodies.map(body=>body.row.visibility=body.outside?'partial':body.covered?(body.open?'partial':'hidden'):'visible');u.maskPathKey=key;u.maskPath=path;
 }
 updateUnit(u,signature){
  if(signature===u.signature)return false;
  if(u.group)u.group.revision++;
  u.visibleSprite=null;
  const old=[u.x,u.y,u.x+u.w,u.y+u.h];u.prepare?.();
  if(typeof u.bounds==='function')this.rect(u,u.bounds());if(!u.w||!u.h){u.damage=[old];u.signature=signature;return true;}
  if(u.authoredMask)this.prepareBallMask(u);
  if(u.authoredMask&&(u.maskVisibility==='visible'||u.preparedBalls?.length&&u.preparedBalls.every(row=>row.visibility==='visible'))&&(u.visibleSprite=u.directSprite?.())){
   u.skipSprite=false;u.hiddenBalls=0;u.outlineVisible=false;u.damage=[old,[u.x,u.y,u.x+u.w,u.y+u.h]];u.signature=signature;this.stats.updates++;return true;
  }
  size(u.cache,u.w,u.h,!!u.authoredMask||!!u.effectsOnly);
  const c=u.cache.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,u.cache.width,u.cache.height);this.world(c,u.x,u.y);u.paint(c);
  if(u.unmasked){u.damage=[old,[u.x,u.y,u.x+u.w,u.y+u.h]];u.signature=signature;this.stats.updates++;return true;}
  if(u.authoredMask&&u.maskVisibility==='visible'){
   u.outlineVisible=false;u.damage=[old,[u.x,u.y,u.x+u.w,u.y+u.h]];u.signature=signature;this.stats.updates++;return true;
  }
  const out=u.cache.getContext('2d');out.setTransform(1,0,0,1,0,0);
  let mask=u.opaque,maskX=u.coverX-u.x,maskY=u.coverY-u.y;
  if(u.authoredMask){
   out.save();out.globalCompositeOperation='destination-out';out.fillStyle='#000';out.fill(u.maskPath);out.restore();
  }else{out.globalCompositeOperation='source-atop';out.drawImage(u.cover,maskX,maskY);out.globalCompositeOperation='destination-out';out.drawImage(mask,maskX,maskY);out.globalCompositeOperation='source-over';}
  u.outlineVisible=!!u.outline&&(!u.preparedBalls||u.preparedBalls.some(row=>row.visibility!=='visible'));
  if(u.outlineVisible){const a=u.outlineCache||(u.outlineCache=make(1,1));size(a,u.w,u.h,!!u.authoredMask);const o=a.getContext('2d');o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,a.width,a.height);this.world(o,u.x,u.y);u.outline(o);o.setTransform(1,0,0,1,0,0);o.save();o.globalCompositeOperation='destination-in';if(u.authoredMask){o.fillStyle='#000';o.fill(u.maskPath);}else o.drawImage(mask,maskX,maskY);o.restore();}
  u.damage=[old,[u.x,u.y,u.x+u.w,u.y+u.h]];u.signature=signature;this.stats.updates++;return true;
 }
 repairCover(u,changed,force=false){
  if(!u.cover||u.authoredMask||!u.coverRetained||!force&&!changed.size)return;
  const above=u.coverRetained,regions=[];
  if(force)regions.push([0,0,u.cover.width,u.cover.height]);
  else for(const v of above)if(changed.has(v))for(const b of v.damage){const x0=Math.max(0,b[0]-u.coverX),y0=Math.max(0,b[1]-u.coverY),x1=Math.min(u.cover.width,b[2]-u.coverX),y1=Math.min(u.cover.height,b[3]-u.coverY);if(x1>x0&&y1>y0)regions.push([x0,y0,x1,y1]);}
  if(!regions.length)return;
  const c=u.cover.getContext('2d');c.globalCompositeOperation='copy';c.drawImage(u.staticCover,0,0);c.globalCompositeOperation='source-over';
  if(!u.cacheWhenIdle||u.transient)for(const v of above)if(!v.transient&&v.x+v.w>u.coverX&&v.x<u.coverX+u.cover.width&&v.y+v.h>u.coverY&&v.y<u.coverY+u.cover.height)c.drawImage(v.cache,v.x-u.coverX,v.y-u.coverY);
  if(u.outline)for(const region of regions)this.opaque(u,region);
  u.maskRevision++;
 }
 refreshMovingCovers(changed){
  for(const u of this.movingUnits)this.repairCover(u,changed);
  this.retainedRevision++;
 }

 update(){
  const changed=new Set();this.changedMoving=[];this.changedRetained=[];
  for(const u of this.authoredUnits)u.maskRevision=u.authoredMask.revision;
  for(let i=this.retainedUnits.length-1;i>=0;i--){
   const u=this.retainedUnits[i],key=u.key(),wasTransient=!!u.transient;u.transient=!!u.isTransient?.();
   if(u.cacheWhenIdle&&(u.transient||wasTransient))this.repairCover(u,changed,u.transient!==wasTransient);
   const signature=u.cacheWhenIdle?key+'|transient:'+u.transient+'|mask:'+u.maskRevision:key;
   if(this.updateUnit(u,signature)){
    if(u.transient||wasTransient)this.changedMoving.push(...u.damage);
    if(!u.transient||!wasTransient){changed.add(u);this.changedRetained.push(...u.damage);}
   }
  }
  if(changed.size)this.refreshMovingCovers(changed);
  for(const u of this.movingUnits){
   if(u.authoredMask&&u.active&&!u.active()){
    if(!u.inactive){if(u.signature!==null)this.changedMoving.push([u.x,u.y,u.x+u.w,u.y+u.h]);u.inactive=true;u.signature='inactive';u.preparedBalls=[];u.hiddenBalls=0;u.skipSprite=true;u.visibleSprite=null;u.outlineVisible=false;u.x=u.y=u.w=u.h=0;}
    continue;
   }
   u.inactive=false;if(this.updateUnit(u,u.key()+'|mask:'+u.maskRevision))this.changedMoving.push(...u.damage);
  }
 }
 regions(frequency,extra=[],force=false,isolated=[]){
  const moving=frequency==='moving',initial=moving?this.needsMoving:this.needsRetained;this[moving?'needsMoving':'needsRetained']=false;
  const boxes=[...(moving?this.changedMoving:this.changedRetained)];
  if(moving){const converted=extra.map(b=>[Math.floor((b[0]-this.view[0])*this.scale),Math.floor((b[1]-this.view[1])*this.scale),Math.ceil((b[2]-this.view[0])*this.scale),Math.ceil((b[3]-this.view[1])*this.scale)]);if(force)converted.push([0,0,this.width,this.height]);boxes.push(...this.previousExtra,...converted);this.previousExtra=converted;}
  let separate=[];if(moving){const next=isolated.map(b=>[Math.floor((b[0]-this.view[0])*this.scale),Math.floor((b[1]-this.view[1])*this.scale),Math.ceil((b[2]-this.view[0])*this.scale),Math.ceil((b[3]-this.view[1])*this.scale)]);separate=[...(this.previousIsolated||[]),...next];this.previousIsolated=next;}
  if(initial||force)return [[0,0,this.width,this.height]];
  const result=[];for(const box of boxes){let b=[Math.max(0,box[0]),Math.max(0,box[1]),Math.min(this.width,box[2]),Math.min(this.height,box[3])];if(b[2]<=b[0]||b[3]<=b[1])continue;for(let i=0;i<result.length;){const a=result[i];if(a[0]<=b[2]&&b[0]<=a[2]&&a[1]<=b[3]&&b[1]<=a[3]){b=[Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[2],b[2]),Math.max(a[3],b[3])];result.splice(i,1);i=0;}else i++;}result.push(b);}
  for(const box of separate){const b=[Math.max(0,box[0]),Math.max(0,box[1]),Math.min(this.width,box[2]),Math.min(this.height,box[3])];if(b[2]>b[0]&&b[3]>b[1])result.push(b);}return result;
 }
 draw(ctx,{background=true,clear=false,frequency='all',update=true,regions=null,content='all'}={}){
  if(update)this.update();
  const intersection=(x,y,w,h)=>{
   if(!regions)return [x,y,x+w,y+h];let left=x+w,top=y+h,right=x,bottom=y;
   for(const b of regions){const l=Math.max(x,b[0]),t=Math.max(y,b[1]),r=Math.min(x+w,b[2]),d=Math.min(y+h,b[3]);if(r>l&&d>t){left=Math.min(left,l);top=Math.min(top,t);right=Math.max(right,r);bottom=Math.max(bottom,d);}}
   return right>left&&bottom>top?[left,top,right,bottom]:null;
  };
  const blit=(image,x,y,w,h,box)=>{const [left,top,right,bottom]=box,width=right-left,height=bottom-top;ctx.drawImage(image,left-x,top-y,width,height,left,top,width,height);this.stats.blits++;};
  this.stats.blits=0;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;if(clear)ctx.clearRect(0,0,this.width,this.height);
  if(background){ctx.globalCompositeOperation='copy';ctx.drawImage(this.base,0,0);this.stats.blits++;}ctx.globalCompositeOperation='source-over';
  for(const g of this.drawGroups[frequency+':'+content]||[]){
   if(g.units.length===1){
    const u=g.units[0];if(u.cacheWhenIdle&&frequency!=='all'&&(frequency==='moving')!==!!u.transient)continue;if(u.active&&!u.active()||u.skipSprite||!u.w||!u.h)continue;
    const sprite=u.visibleSprite,x=sprite?sprite.x:u.x,y=sprite?sprite.y:u.y,w=sprite?sprite.image.width:u.w,h=sprite?sprite.image.height:u.h,box=intersection(x,y,w,h);if(!box)continue;
    if(sprite&&box[0]===x&&box[1]===y&&box[2]===x+w&&box[3]===y+h){ctx.drawImage(sprite.image,x,y);this.stats.blits++;}else blit(sprite?sprite.image:u.cache,x,y,w,h,box);continue;
   }
   if(g.boundsRevision!==g.revision){
    let left=this.width,top=this.height,right=0,bottom=0;
    for(const u of g.units)if(u.w&&u.h){left=Math.min(left,u.x);top=Math.min(top,u.y);right=Math.max(right,u.x+u.w);bottom=Math.max(bottom,u.y+u.h);}
    g.x=left;g.y=top;g.w=Math.max(0,right-left);g.h=Math.max(0,bottom-top);g.boundsRevision=g.revision;
   }
   if(!g.w||!g.h)continue;const box=intersection(g.x,g.y,g.w,g.h);if(!box)continue;
   if(g.renderedRevision!==g.revision){size(g.cache,g.w,g.h);const c=g.cache.getContext('2d');c.clearRect(0,0,g.w,g.h);for(const u of g.units)if(u.w&&u.h)c.drawImage(u.cache,0,0,u.w,u.h,u.x-g.x,u.y-g.y,u.w,u.h);g.renderedRevision=g.revision;this.stats.updates++;}
   blit(g.cache,g.x,g.y,g.w,g.h,box);
  }
  if((content==='all'||content==='balls')&&frequency!=='retained')for(const u of this.outlineUnits)if(u.outlineVisible!==false&&u.outlineCache&&u.w&&u.h&&(!u.active||u.active())){const box=intersection(u.x,u.y,u.w,u.h);if(box)blit(u.outlineCache,u.x,u.y,u.w,u.h,box);}
  ctx.restore();
 }

 destroy(){for(const g of this.groups)if(g.cache)g.cache.width=g.cache.height=0;this.groups=[];for(const name of ['base','suffix'])if(this[name])this[name].width=this[name].height=0;for(const u of this.units)for(const name of ['fixedImage','staticCover','cover','opaque','cache','outlineCache','maskTile'])if(u[name])u[name].width=u[name].height=0;this.units=[];this.retainedUnits=[];this.movingUnits=[];this.authoredUnits=[];this.outlineUnits=[];this.drawGroups={};this.revision=null;}
}
PlaySceneCache.BallMasks=PlayBallMasks;
if(typeof module!=='undefined')module.exports=PlaySceneCache;else root.PlaySceneCache=PlaySceneCache;
})(typeof window!=='undefined'?window:globalThis);
