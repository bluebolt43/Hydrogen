/* Authored ball masks are independent of fixed/slow output grouping.
   Other sprite caches retain their existing painter-order compositing. */
(function(root){
'use strict';
const make=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
// Ball buffers keep capacity across one-pixel bounds changes and smaller trails.
const size=(c,w,h,retain=false)=>{const width=retain?Math.max(c.width,Math.ceil(w/16)*16):w,height=retain?Math.max(c.height,Math.ceil(h/16)*16):h;if(c.width!==width)c.width=width;if(c.height!==height)c.height=height;};
// Loading-only comparison. Retain rectangles, never the temporary RGBA arrays.
function prepareDiffs(entries,width,height,pixel){
 const pairs=new Map(entries.map(e=>[e,new Map()]));
 for(let a=0;a<entries.length;a++)for(let b=a;b<entries.length;b++){
  let left=width,top=height,right=0,bottom=0;
  if(a!==b)for(let i=0;i<width*height;i++)if(pixel(entries[a],i)!==pixel(entries[b],i)){const x=i%width,y=Math.floor(i/width);left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x+1);bottom=Math.max(bottom,y+1);}
  const box=right>left?[left,top,right,bottom]:[];pairs.get(entries[a]).set(entries[b],box);pairs.get(entries[b]).set(entries[a],box);
 }
 return pairs;
}
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
  for(const source of this.sources){source.signature=source.key();source.previousBounds=[...source.bounds()];source.masks=new Map();
   if(source.maskVariants){source.maskLimit=Math.max(4,source.maskVariants.length);for(const variant of source.maskVariants)this.raster(source,variant.key,source.previousBounds,variant.paint);delete source.maskVariants;
    const tiles=[...source.masks.values()],first=tiles[0];
    if(first&&tiles.length<=128&&tiles.length*tiles.length*first.bits.length<=8*1024*1024&&tiles.every(t=>t.x===first.x&&t.y===first.y&&t.w===first.w&&t.h===first.h)){
     source.diffs=prepareDiffs(tiles,first.w,first.h,(t,i)=>(t.bits[i>>3]>>(i&7))&1);
     for(let i=1;i<tiles.length;i++)for(let j=0;j<i;j++)if(!source.diffs.get(tiles[i]).get(tiles[j]).length){tiles[i].bits=tiles[j].bits;break;}
    }
   }
   source.current=this.raster(source,source.signature,source.previousBounds);
  }
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
 raster(source,key,bounds,paint=source.paint){
  if(source.masks.has(key))return source.masks.get(key);
  const [x,y,right,bottom]=this.box(bounds),w=Math.max(0,right-x),h=Math.max(0,bottom-y),tile={x,y,w,h,bits:new Uint8Array(Math.ceil(w*h/8))};
  if(w&&h){const c=this.scratch.getContext('2d');c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(x,y,w,h);c.beginPath();c.rect(x,y,w,h);c.clip();c.setTransform(this.scale,0,0,this.scale,-this.view[0]*this.scale,-this.view[1]*this.scale);paint(c);c.restore();
   const pixels=c.getImageData(x,y,w,h).data;for(let i=0;i<w*h;i++)if(pixels[i*4+3])tile.bits[i>>3]|=1<<(i&7);
  }
  // Bound animated/fading states; common on/off states remain reusable.
  if(source.masks.size===(source.maskLimit||4))source.masks.delete(source.masks.keys().next().value);source.masks.set(key,tile);return tile;
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
   const diff=source.diffs?.get(old)?.get(source.current),regions=diff?(diff.length?[[old.x+diff[0],old.y+diff[1],old.x+diff[2],old.y+diff[3]]]:[]):[old,source.current].filter(t=>t.w&&t.h).map(t=>[t.x,t.y,t.x+t.w,t.y+t.h]);
   for(const plane of source.planes){let boxes=damage.get(plane);if(!boxes)damage.set(plane,boxes=[]);for(const box of regions)if(!boxes.some(b=>b.every((n,i)=>n===box[i])))boxes.push(box);}

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
 updateBackground(key,paint,bounds){
  if(key===this.backgroundKey)return [];
  const box={};this.rect(box,bounds);this.backgroundKey=key;if(!box.w||!box.h)return [];
  const c=this.base.getContext('2d'),overlaps=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
  c.save();c.setTransform(1,0,0,1,0,0);c.beginPath();c.rect(box.x,box.y,box.w,box.h);c.clip();c.clearRect(box.x,box.y,box.w,box.h);this.world(c);paint(c);c.setTransform(1,0,0,1,0,0);
  // Replay already prepared fixed pixels above the changed background. Keep
  // translucent edges and the direct-order exclusions exactly as in prepare.
  const ordered=this.units.filter(u=>u.orderedOverlay);
  for(const u of this.units){if(!u.fixedImage||!overlaps(u,box))continue;const above=ordered.filter(v=>v.orderedIndex<u.baseIndex&&overlaps(u,v));
   if(above.length){c.save();c.beginPath();c.rect(0,0,this.width,this.height);for(const v of above)c.rect(v.x,v.y,v.w,v.h);c.clip('evenodd');c.drawImage(u.fixedImage,u.x,u.y);c.restore();}else c.drawImage(u.fixedImage,u.x,u.y);
  }
  c.restore();return [[box.x,box.y,box.x+box.w,box.y+box.h]];
 }
 prepare(key,width,height,view,units,background,ballMasks=null,backgroundKey=key){
  if(key===this.revision)return;
  units=units.filter(u=>!u.orderedParent);this.destroy();this.width=width;this.height=height;this.view=[...view];this.scale=width/view[2];this.units=units;this.preparedPixels=0;this.preparedFullPixels=0;
  const full=[view[0],view[1],view[0]+view[2],view[1]+view[3]],base=this.base=make(width,height),b=base.getContext('2d');this.world(b);background(b);b.setTransform(1,0,0,1,0,0);
  for(const [index,u] of units.entries()){u.baseIndex=index;this.rect(u,typeof u.bounds==='function'?full:u.bounds||full);}
  // Move only the intersecting fixed pixels above a direct-order mechanism
  // out of the base. Replay that prepared slice after its raw moving sprite.
  const overlaps=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
  const ordered=[];
  for(let i=0;i<units.length;i++){const u=units[i];if(!u.directOrder||!u.cacheWhenIdle||!u.w||!u.h)continue;
   if(ordered.some(v=>overlaps(u,v)))continue;
   u.orderedUnmasked=u.unmasked;u.unmasked=true;u.orderedOverlay=make(u.w,u.h);u.orderedIndex=i;ordered.push(u);
  }
  for(const u of units){
   if(!u.w||!u.h)continue;
   if(u.fixed){u.fixedImage=make(u.w,u.h);this.world(u.fixedImage.getContext('2d'),u.x,u.y);u.paint(u.fixedImage.getContext('2d'));const above=ordered.filter(v=>v.orderedIndex<units.indexOf(u)&&overlaps(u,v));
    if(above.length){b.save();b.beginPath();b.rect(0,0,width,height);for(const v of above){b.rect(v.x,v.y,v.w,v.h);v.orderedOverlay.getContext('2d').drawImage(u.fixedImage,u.x-v.x,u.y-v.y);}b.clip('evenodd');b.drawImage(u.fixedImage,u.x,u.y);b.restore();}
    else b.drawImage(u.fixedImage,u.x,u.y);}
  }
  // Objects above a direct-order mechanism leave cache 2 with it, so their
  // existing caches can be replayed once in the original painter order.
  for(const u of ordered)for(const v of units.slice(u.orderedIndex+1)){
   if(v.fixed||v.ballPlane||v.effectsOnly||v.unmasked||v.moving&&!v.cacheWhenIdle)continue;
   let bounds=v;if(typeof v.bounds==='function'){bounds={};this.rect(bounds,v.bounds());}if(!overlaps(u,bounds))continue;
   v.orderedLeader={moving:v.moving,cacheWhenIdle:v.cacheWhenIdle,key:v.key,isTransient:v.isTransient};const old=v.orderedLeader;
   v.moving=v.cacheWhenIdle=true;v.key=()=>{u.key();return old.key();};v.isTransient=()=>!!u.isTransient?.()||!!old.isTransient?.();
  }
  // Slices share the mechanism's stable/transient lifetime. No mask, alpha
  // readback or recoloring is needed for either part during animation.
  for(const u of ordered){const image=u.orderedOverlay,overlay={moving:true,cacheWhenIdle:true,unmasked:true,orderedParent:u,bounds:[view[0]+u.x/this.scale,view[1]+u.y/this.scale,view[0]+(u.x+u.w)/this.scale,view[1]+(u.y+u.h)/this.scale],key:()=>{u.key();return 'fixed-overlay';},isTransient:()=>u.isTransient?.(),paint:c=>{c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(image,0,0);c.restore();}};
   units.splice(units.indexOf(u)+1,0,overlay);overlay.x=u.x;overlay.y=u.y;overlay.w=u.w;overlay.h=u.h;
  }
  const suffix=this.suffix=make(width,height),s=suffix.getContext('2d');
  for(let i=units.length-1;i>=0;i--){const u=units[i];if(!u.w||!u.h)continue;
   if(u.fixed){s.globalCompositeOperation='destination-over';s.drawImage(u.fixedImage,u.x,u.y);continue;}
   if(u.directPaint){u.signature=null;u.maskRevision=0;u.directBounds=[];continue;}
   const authoredMask=u.ballPlane&&ballMasks?.get(u.ballPlane==='background'?'lower':u.ballPlane);
   if(authoredMask){u.authoredMask=authoredMask;u.coverX=u.coverY=0;}
   else if(!u.unmasked){u.coverX=u.x;u.coverY=u.y;u.cover=make(u.w,u.h);this.cover(u,suffix);}
   u.cache=make(1,1);u.workCache=u.cache;u.signature=null;u.maskPathKey=null;u.diffState=null;u.stateDiffs=null;u.preparedStates=null;u.currentPatch=null;
   this.prepareStateDiffs(u);
   const reserve=u.cacheCapacity?.();
   if(reserve){size(u.cache,Math.min(width,Math.max(1,reserve[0])),Math.min(height,Math.max(1,reserve[1])),true);const c=u.cache.getContext('2d');c.fillRect(0,0,1,1);c.clearRect(0,0,1,1);
    if(authoredMask&&u.outline){u.outlineCache=make(u.cache.width,u.cache.height);const o=u.outlineCache.getContext('2d');o.fillRect(0,0,1,1);o.clearRect(0,0,1,1);}
   }
   if(u.moving){if(!u.authoredMask&&!u.unmasked){u.staticCover=make(u.w,u.h);u.staticCover.getContext('2d').drawImage(u.cover,0,0);}u.maskRevision=0;}
   if(u.outline&&!authoredMask)u.outlineCache=make(1,1);
   // The relocated upper scenery is now an ordered unit, not part of the
   // fixed suffix for objects below this mechanism. Keeping it here would
   // blend translucent pixels twice when that ordered unit is replayed.
   if(u.orderedOverlay)s.clearRect(u.x,u.y,u.w,u.h);
  }
  s.globalCompositeOperation='source-over';
  this.groups=[];for(const u of units){if(u.fixed||!u.cache&&!u.directPaint)continue;let g=this.groups.at(-1);if(u.moving||u.separateCache||!g||g.moving||g.separateCache){g={units:[],moving:!!u.moving,separateCache:!!u.separateCache,revision:0,boundsRevision:-1,renderedRevision:-1};this.groups.push(g);}g.units.push(u);u.group=g;}
  for(const g of this.groups)if(g.units.length>1)g.cache=make(1,1);
  this.retainedUnits=units.filter(u=>!u.fixed&&(!u.moving||u.cacheWhenIdle)&&u.cache);this.movingUnits=units.filter(u=>u.moving&&!u.cacheWhenIdle&&(u.cache||u.directPaint));this.authoredUnits=units.filter(u=>u.authoredMask);this.outlineUnits=units.filter(u=>u.outline);
  for(const u of units)if(u.moving&&u.cover&&!u.authoredMask)u.coverRetained=units.slice(units.indexOf(u)+1).filter(v=>!v.fixed&&(!v.moving||v.cacheWhenIdle)&&v.cache&&v.x<u.coverX+u.cover.width&&v.x+v.w>u.coverX&&v.y<u.coverY+u.cover.height&&v.y+v.h>u.coverY);
  for(const frequency of ['all','moving','retained'])for(const content of ['all','objects','balls'])this.drawGroups[frequency+':'+content]=this.groups.filter(g=>(frequency==='all'||(frequency==='retained'?!g.moving||g.units[0].cacheWhenIdle:g.moving))&&(content==='all'||(g.units[0].ballSlot!==undefined)===(content==='balls')));
  this.revision=key;this.backgroundKey=backgroundKey;this.needsMoving=true;this.needsRetained=true;this.previousExtra=[];this.previousIsolated=[];this.stats.builds++;
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
 prepareStateDiffs(u){
  if(u.moving||u.authoredMask||u.outline||!u.diffSources||!u.w||!u.h)return;
  const sources=u.diffSources();if(!sources?.length)return;
  // Bound both temporary pixels and pairwise loading work. Unknown/continuous
  // poses use the existing full repair; they never trigger a runtime comparison.
  const count=sources.reduce((n,s)=>n+s.variants.length*s.variants.length,0);
  if(u.w*u.h*count>8*1024*1024)return;
  const scratch=make(u.w,u.h),c=scratch.getContext('2d',{willReadFrequently:true});
  u.stateDiffs=sources.map(source=>{
   const entries=source.variants.map(v=>{c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,u.w,u.h);this.world(c,u.x,u.y);v.paint(c);const data=c.getImageData(0,0,u.w,u.h).data;return {key:v.key,pixels:new Uint32Array(data.buffer)};});
   const pairs=prepareDiffs(entries,u.w,u.h,(e,i)=>e.pixels[i]>>>24?e.pixels[i]:0),diffs=new Map(entries.map(e=>[e.key,new Map(entries.map(other=>[other.key,pairs.get(e).get(other)]))]));
   return {key:source.key,diffs};
  });scratch.width=scratch.height=0;this.prepareUnitStates(u,sources);
 }
 prepareUnitStates(u,sources){
  if(!u.paintState)return;
  const count=sources.reduce((n,s)=>n*s.variants.length,1),pixels=u.w*u.h;
  if(count>64||count*pixels>8*1024*1024)return;
  const entries=[],unique=[];
  const prepare=keys=>{
   const image=make(u.w,u.h),c=image.getContext('2d',{willReadFrequently:true});this.world(c,u.x,u.y);u.paintState(c,keys);c.setTransform(1,0,0,1,0,0);
   if(!u.unmasked){c.globalCompositeOperation='source-atop';c.drawImage(u.cover,u.coverX-u.x,u.coverY-u.y);c.globalCompositeOperation='destination-out';c.drawImage(u.opaque,u.coverX-u.x,u.coverY-u.y);c.globalCompositeOperation='source-over';}
   const data=c.getImageData(0,0,u.w,u.h);image.width=image.height=0;let hash=2166136261;for(const value of data.data)hash=Math.imul(hash^value,16777619);
   const same=unique.find(e=>e.hash===hash&&e.data.data.every((v,i)=>v===data.data[i]));const entry=same||{hash,data,pixels:new Uint32Array(data.data.buffer)};if(!same)unique.push(entry);entries.push({key:JSON.stringify(keys),keys,entry});
  };
  const visit=(index,keys)=>{if(index===sources.length){prepare(keys);return;}for(const variant of sources[index].variants)visit(index+1,[...keys,variant.key]);};visit(0,[]);
  // Hidden states remove the common pixels; they must not make the common
  // image empty when the visible off/on/level images share most of their art.
  const visible=entries.filter(e=>e.keys.every((key,i)=>key!=='hidden'&&!sources[i].variants.some(v=>v.key===key&&v.hidden))),reference=(visible[0]||entries[0]).entry;
  const common=new ImageData(new Uint8ClampedArray(reference.data.data),u.w,u.h),commonPixels=new Uint32Array(common.data.buffer);
  for(const {entry} of visible)for(let i=0;i<pixels;i++)if(commonPixels[i]!==entry.pixels[i])commonPixels[i]=0;
  let allocated=0;const images=[];
  const crop=(data,box)=>{
   if(!box.length)return null;const [x,y,right,bottom]=box;let visible=false;for(let py=y;py<bottom&&!visible;py++)for(let px=x;px<right;px++)if(data.data[(py*u.w+px)*4+3]){visible=true;break;}
   if(!visible)return null;const image=make(right-x,bottom-y),c=image.getContext('2d');c.putImageData(data,-x,-y,x,y,right-x,bottom-y);images.push(image);allocated+=image.width*image.height;return image;
  };
  let left=u.w,top=u.h,right=0,bottom=0;for(let i=0;i<pixels;i++)if(common.data[i*4+3]){const x=i%u.w,y=Math.floor(i/u.w);left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x+1);bottom=Math.max(bottom,y+1);}
  const baseBox=right>left?[left,top,right,bottom]:[],base={box:baseBox,image:crop(common,baseBox)},patches=new Map();
  for(const entry of unique){const diff=prepareDiffs([commonPixels,entry.pixels],u.w,u.h,(data,i)=>data[i]>>>24?data[i]:0).get(commonPixels).get(entry.pixels);patches.set(entry,{box:diff,image:crop(entry.data,diff)});}
  if(this.preparedPixels+allocated>4*1024*1024){for(const image of images)image.width=image.height=0;return;}
  u.preparedBase=base;u.preparedStates=new Map(entries.map(e=>[e.key,patches.get(e.entry)]));size(u.workCache,u.w,u.h);this.preparedPixels+=allocated;this.preparedFullPixels+=unique.length*pixels;
 }
 stateDamage(u){
  if(!u.stateDiffs)return null;
  const next=u.stateDiffs.map(s=>s.key()),previous=u.diffState;u.diffState=next;
  if(!previous||u.signature===null)return null;
  const boxes=[];
  for(let i=0;i<next.length;i++){
   const box=u.stateDiffs[i].diffs.get(previous[i])?.get(next[i]);if(!box)return null;
   // Include sampling edges while keeping damage inside the existing cache.
   if(box.length)boxes.push([u.x+Math.max(0,box[0]-1),u.y+Math.max(0,box[1]-1),u.x+Math.min(u.w,box[2]+1),u.y+Math.min(u.h,box[3]+1)]);
  }
  return boxes;
 }
 updateUnit(u,signature){
  if(signature===u.signature)return false;
  if(u.directPaint){
   const next=[];let left=this.width,top=this.height,right=0,bottom=0;
   for(const box of u.damageBounds()){
    const x=Math.max(0,Math.floor((box[0]-this.view[0])*this.scale)),y=Math.max(0,Math.floor((box[1]-this.view[1])*this.scale)),r=Math.min(this.width,Math.ceil((box[2]-this.view[0])*this.scale)),b=Math.min(this.height,Math.ceil((box[3]-this.view[1])*this.scale));
    if(r>x&&b>y){next.push([x,y,r,b]);left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,r);bottom=Math.max(bottom,b);}
   }
   u.damage=[...(u.directBounds||[]),...next];u.directBounds=next;u.skipSprite=!next.length;
   if(next.length){u.x=left;u.y=top;u.w=right-left;u.h=bottom-top;}else u.w=u.h=0;
   u.signature=signature;return u.damage.length>0;
  }
  const damage=this.stateDamage(u),prepared=u.preparedStates?.get(JSON.stringify(u.diffState));
  if(prepared){
   const previous=u.currentPatch;u.currentPatch=prepared;
   u.cache=u.workCache;u.visibleSprite=null;u.damage=damage||[[u.x,u.y,u.x+u.w,u.y+u.h]];u.signature=signature;
   if(!u.damage.length)return false;
   const c=u.cache.getContext('2d');c.save();c.setTransform(1,0,0,1,0,0);c.beginPath();for(const b of u.damage)c.rect(b[0]-u.x,b[1]-u.y,b[2]-b[0],b[3]-b[1]);c.clip();
   // A replacement patch already contains the final pixels (including fixed
   // pixels inside its rectangle). Retain everything outside it in cache 2.
   const box=prepared.box,replaceOnly=damage&&previous&&(!previous.box.length||box.length&&box[0]<=previous.box[0]&&box[1]<=previous.box[1]&&box[2]>=previous.box[2]&&box[3]>=previous.box[3]);
   if(!replaceOnly){c.clearRect(0,0,u.w,u.h);const base=u.preparedBase;if(base.image)c.drawImage(base.image,base.box[0],base.box[1]);}
   if(prepared.box.length){const b=prepared.box;c.clearRect(b[0],b[1],b[2]-b[0],b[3]-b[1]);if(prepared.image)c.drawImage(prepared.image,b[0],b[1]);}c.restore();
   if(u.group)u.group.revision++;this.stats.updates++;return true;
  }
  if(damage&&!damage.length){u.damage=[];u.signature=signature;return false;}
  // Rotated bitmap sampling can change with a tighter Canvas clip. Preserve
  // its original rasterization; downstream restoration still uses the diff.
  if(damage&&!u.diffRasterOnly?.()){
   const c=u.cache.getContext('2d');c.save();c.setTransform(1,0,0,1,0,0);c.beginPath();for(const b of damage)c.rect(b[0]-u.x,b[1]-u.y,b[2]-b[0],b[3]-b[1]);c.clip();c.clearRect(0,0,u.w,u.h);this.world(c,u.x,u.y);u.paint(c);c.setTransform(1,0,0,1,0,0);
   if(!u.unmasked){c.globalCompositeOperation='source-atop';c.drawImage(u.cover,u.coverX-u.x,u.coverY-u.y);c.globalCompositeOperation='destination-out';c.drawImage(u.opaque,u.coverX-u.x,u.coverY-u.y);}c.restore();
   u.damage=damage;u.signature=signature;if(u.group)u.group.revision++;this.stats.updates++;return true;
  }
  if(u.group)u.group.revision++;
  u.visibleSprite=null;
  const old=[u.x,u.y,u.x+u.w,u.y+u.h];u.prepare?.();
  if(typeof u.bounds==='function')this.rect(u,u.bounds());if(!u.w||!u.h){u.damage=[old];u.signature=signature;return true;}
  if(u.authoredMask)this.prepareBallMask(u);
  if(u.authoredMask&&(u.maskVisibility==='visible'||u.preparedBalls?.length&&u.preparedBalls.every(row=>row.visibility==='visible'))&&(u.visibleSprite=u.directSprite?.())){
   u.skipSprite=false;u.hiddenBalls=0;u.outlineVisible=false;u.damage=damage||[old,[u.x,u.y,u.x+u.w,u.y+u.h]];u.signature=signature;this.stats.updates++;return true;
  }
  size(u.cache,u.w,u.h,!!u.cacheCapacity||!!u.authoredMask||!!u.effectsOnly);
  const c=u.cache.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,u.w,u.h);this.world(c,u.x,u.y);u.paint(c);
  if(u.unmasked){u.damage=damage||[old,[u.x,u.y,u.x+u.w,u.y+u.h]];u.signature=signature;this.stats.updates++;return true;}
  if(u.authoredMask&&u.maskVisibility==='visible'){
   u.outlineVisible=false;u.damage=damage||[old,[u.x,u.y,u.x+u.w,u.y+u.h]];u.signature=signature;this.stats.updates++;return true;
  }
  const out=u.cache.getContext('2d');out.setTransform(1,0,0,1,0,0);
  let mask=u.opaque,maskX=u.coverX-u.x,maskY=u.coverY-u.y;
  if(u.authoredMask){
   out.save();out.globalCompositeOperation='destination-out';out.fillStyle='#000';out.fill(u.maskPath);out.restore();
  }else{out.globalCompositeOperation='source-atop';out.drawImage(u.cover,maskX,maskY);out.globalCompositeOperation='destination-out';out.drawImage(mask,maskX,maskY);out.globalCompositeOperation='source-over';}
  u.outlineVisible=!!u.outline&&(!u.preparedBalls||u.preparedBalls.some(row=>row.visibility!=='visible'));
  if(u.outlineVisible){const a=u.outlineCache||(u.outlineCache=make(1,1));size(a,u.w,u.h,!!u.authoredMask);const o=a.getContext('2d');o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,u.w,u.h);this.world(o,u.x,u.y);u.outline(o);o.setTransform(1,0,0,1,0,0);o.save();o.globalCompositeOperation='destination-in';if(u.authoredMask){o.fillStyle='#000';o.fill(u.maskPath);}else o.drawImage(mask,maskX,maskY);o.restore();}
  u.damage=damage||[old,[u.x,u.y,u.x+u.w,u.y+u.h]];u.signature=signature;this.stats.updates++;return true;
 }
 repairCover(u,changed,force=false){
  if(!u.cover||u.authoredMask||!u.coverRetained||!force&&!changed.size)return;
  const above=u.coverRetained,regions=[];
  if(force)regions.push([0,0,u.cover.width,u.cover.height]);
  else for(const v of above)if(changed.has(v))for(const b of v.damage){const x0=Math.max(0,b[0]-u.coverX),y0=Math.max(0,b[1]-u.coverY),x1=Math.min(u.cover.width,b[2]-u.coverX),y1=Math.min(u.cover.height,b[3]-u.coverY);if(x1>x0&&y1>y0)regions.push([x0,y0,x1,y1]);}
  if(!regions.length)return;
  const c=u.cover.getContext('2d');c.save();c.beginPath();for(const b of regions)c.rect(b[0],b[1],b[2]-b[0],b[3]-b[1]);c.clip();c.globalCompositeOperation='copy';c.drawImage(u.staticCover,0,0);c.globalCompositeOperation='source-over';
  if(!u.cacheWhenIdle||u.transient)for(const v of above)if(!v.transient&&regions.some(b=>v.x<u.coverX+b[2]&&v.x+v.w>u.coverX+b[0]&&v.y<u.coverY+b[3]&&v.y+v.h>u.coverY+b[1]))c.drawImage(v.cache,v.x-u.coverX,v.y-u.coverY);
  c.restore();if(u.outline)for(const region of regions)this.opaque(u,region);
  u.maskRevision++;
 }
 refreshMovingCovers(changed){
  for(const u of this.movingUnits)this.repairCover(u,changed);
  this.retainedRevision++;
 }

 groupDamage(u){const g=u.group;if(g?.units.length>1&&(!g.damage||g.damage.length<=64))(g.damage??=[]).push(...u.damage);}
 update(){
  const changed=new Set();this.changedMoving=[];this.changedRetained=[];
  for(const u of this.authoredUnits)u.maskRevision=u.authoredMask.revision;
  for(let i=this.retainedUnits.length-1;i>=0;i--){
   const u=this.retainedUnits[i],key=u.key(),wasTransient=!!u.transient;u.transient=!!u.isTransient?.();
   if(u.cacheWhenIdle&&(u.transient||wasTransient))this.repairCover(u,changed,u.transient!==wasTransient);
   const signature=u.cacheWhenIdle?key+'|transient:'+u.transient+'|mask:'+u.maskRevision:key;
   if(this.updateUnit(u,signature)){
    this.groupDamage(u);
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
   const key=u.key();u.inactive=false;if(this.updateUnit(u,u.directPaint?key:key+'|mask:'+u.maskRevision)){this.groupDamage(u);this.changedMoving.push(...u.damage);}
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
    if(u.directPaint){if(intersection(u.x,u.y,u.w,u.h)){this.world(ctx);u.paint(ctx);ctx.setTransform(1,0,0,1,0,0);}continue;}
    const sprite=u.visibleSprite,x=sprite?sprite.x:u.x,y=sprite?sprite.y:u.y,w=sprite?sprite.image.width:u.w,h=sprite?sprite.image.height:u.h,box=intersection(x,y,w,h);if(!box)continue;
    if(sprite&&box[0]===x&&box[1]===y&&box[2]===x+w&&box[3]===y+h){ctx.drawImage(sprite.image,x,y);this.stats.blits++;}else blit(sprite?sprite.image:u.cache,x,y,w,h,box);continue;
   }
   const oldGroupBounds=g.renderedBounds||[];
   if(g.boundsRevision!==g.revision){
    let left=this.width,top=this.height,right=0,bottom=0;
    for(const u of g.units)if(u.w&&u.h){left=Math.min(left,u.x);top=Math.min(top,u.y);right=Math.max(right,u.x+u.w);bottom=Math.max(bottom,u.y+u.h);}
    g.x=left;g.y=top;g.w=Math.max(0,right-left);g.h=Math.max(0,bottom-top);g.boundsRevision=g.revision;
   }
   if(!g.w||!g.h)continue;const box=intersection(g.x,g.y,g.w,g.h);if(!box)continue;
   if(g.renderedRevision!==g.revision){
    const partial=g.renderedRevision>=0&&g.damage?.length&&g.damage.length<=64&&oldGroupBounds.every((n,i)=>n===[g.x,g.y,g.w,g.h][i]);
    size(g.cache,g.w,g.h);const c=g.cache.getContext('2d');c.save();if(partial){c.beginPath();for(const b of g.damage)c.rect(b[0]-g.x,b[1]-g.y,b[2]-b[0],b[3]-b[1]);c.clip();}c.clearRect(0,0,g.w,g.h);
    for(const u of g.units)if(u.w&&u.h&&(!partial||g.damage.some(b=>b[0]<u.x+u.w&&u.x<b[2]&&b[1]<u.y+u.h&&u.y<b[3])))c.drawImage(u.cache,0,0,u.w,u.h,u.x-g.x,u.y-g.y,u.w,u.h);
    c.restore();g.damage=[];g.renderedBounds=[g.x,g.y,g.w,g.h];g.renderedRevision=g.revision;this.stats.updates++;
   }
   blit(g.cache,g.x,g.y,g.w,g.h,box);
  }
  if((content==='all'||content==='balls')&&frequency!=='retained')for(const u of this.outlineUnits)if(u.outlineVisible!==false&&u.outlineCache&&u.w&&u.h&&(!u.active||u.active())){const box=intersection(u.x,u.y,u.w,u.h);if(box)blit(u.outlineCache,u.x,u.y,u.w,u.h,box);}
  ctx.restore();
 }

 destroy(){for(const g of this.groups)if(g.cache)g.cache.width=g.cache.height=0;this.groups=[];for(const name of ['base','suffix'])if(this[name])this[name].width=this[name].height=0;for(const u of this.units)for(const name of ['fixedImage','orderedOverlay','staticCover','cover','opaque','cache','workCache','outlineCache','maskTile'])if(u[name])u[name].width=u[name].height=0;for(const u of this.units){for(const entry of new Set(u.preparedStates?.values()))if(entry.image)entry.image.width=entry.image.height=0;if(u.preparedBase?.image)u.preparedBase.image.width=u.preparedBase.image.height=0;u.preparedBase=null;u.preparedStates=null;u.currentPatch=null;u.stateDiffs=null;u.diffState=null;}for(const u of this.units)if(u.orderedOverlay){u.unmasked=u.orderedUnmasked;delete u.orderedOverlay;delete u.orderedUnmasked;}for(const u of this.units)if(u.orderedLeader){Object.assign(u,u.orderedLeader);delete u.orderedLeader;}this.units=[];this.retainedUnits=[];this.movingUnits=[];this.authoredUnits=[];this.outlineUnits=[];this.drawGroups={};this.revision=null;}
}
PlaySceneCache.BallMasks=PlayBallMasks;
if(typeof module!=='undefined')module.exports=PlaySceneCache;else root.PlaySceneCache=PlaySceneCache;
})(typeof window!=='undefined'?window:globalThis);
