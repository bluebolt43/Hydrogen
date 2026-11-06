(function(root){
'use strict';
class PlayCanvasLayers{
 constructor(canvas,{interactive=true,cachedOutput=false}={}){
  this.canvas=canvas;this.layers=new Map();this.keys=new Map();this.revision=0;this.scoreHeight=null;this.scratch=document.createElement('canvas');
  const parent=canvas.parentElement;if(getComputedStyle(parent).position==='static')parent.style.position='relative';
  for(const name of interactive&&!cachedOutput?['static','interactive']:['static']){const c=document.createElement('canvas');c.dataset.playLayer=name;c.setAttribute('aria-hidden','true');c.style.cssText='position:absolute;z-index:3;pointer-events:none;max-width:none;aspect-ratio:auto;object-fit:fill;background:transparent';if(!cachedOutput)canvas.before(c);this.layers.set(name,c);}
  canvas.style.background='transparent';canvas.dataset.playLayer=cachedOutput?'combined':'dynamic';this.layers.set('ui-values',document.createElement('canvas'));if(cachedOutput)this.layers.set('composite',document.createElement('canvas'));
 }
 resize(){
  const main=this.canvas,box=main.getBoundingClientRect(),parent=main.parentElement.getBoundingClientRect(),shift=(main.style.translate||'').split(' ').map(v=>parseFloat(v)||0);
  let changed=false;
  for(const [name,c] of this.layers){
   const height=name==='ui-values'&&this.scoreHeight!==null?Math.min(main.height,this.scoreHeight):main.height;
   if(c.width!==main.width||c.height!==height){c.width=main.width;c.height=height;changed=true;}
   if(c.isConnected){c.style.left=(box.left-parent.left-(shift[0]||0))+'px';c.style.top=(box.top-parent.top-(shift[1]||0))+'px';c.style.width=box.width+'px';c.style.height=box.height+'px';}
  }
  if(changed){this.revision++;this.keys.clear();}this.shift();
 }
 shift(){for(const c of this.layers.values())if(c.isConnected&&c.style.translate!==this.canvas.style.translate)c.style.translate=this.canvas.style.translate;}
 setScoreHeight(height){const c=this.layers.get('ui-values');this.scoreHeight=Math.max(1,Math.min(this.canvas.height,Math.ceil(height)));if(c.height!==this.scoreHeight){c.height=this.scoreHeight;this.keys.delete('ui-values');}}
 regions(boxes){
  // Remove duplicate/contained clips; merge only when the union is rectangular.
  const result=[];for(const box of boxes){let b=[Math.max(0,box[0]),Math.max(0,box[1]),Math.min(this.canvas.width,box[2]),Math.min(this.canvas.height,box[3])];if(b[2]<=b[0]||b[3]<=b[1])continue;
   for(let i=0;i<result.length;){const a=result[i];
    if(a[0]<=b[0]&&a[1]<=b[1]&&a[2]>=b[2]&&a[3]>=b[3]){b=null;break;}
    if(b[0]<=a[0]&&b[1]<=a[1]&&b[2]>=a[2]&&b[3]>=a[3]){result.splice(i,1);continue;}
    if(a[0]===b[0]&&a[2]===b[2]&&a[1]<=b[3]&&b[1]<=a[3]||a[1]===b[1]&&a[3]===b[3]&&a[0]<=b[2]&&b[0]<=a[2]){b=[Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[2],b[2]),Math.max(a[3],b[3])];result.splice(i,1);i=0;}else i++;
   }if(b)result.push(b);
  }return result;
 }
 restore(ctx,name,regions){
  if(!regions.length)return;
  let x=this.canvas.width,y=this.canvas.height,right=0,bottom=0;for(const b of regions){x=Math.min(x,b[0]);y=Math.min(y,b[1]);right=Math.max(right,b[2]);bottom=Math.max(bottom,b[3]);}const w=right-x,h=bottom-y;
  // The caller clips to the sparse diff union. Replace those pixels before
  // blending lamps, including transparent pixels in the theater opening.
  ctx.clearRect(x,y,w,h);ctx.globalCompositeOperation='source-over';ctx.drawImage(this.layers.get(name),x,y,w,h,x,y,w,h);
 }
 restoreRectangles(ctx,name,regions){
  const image=this.layers.get(name),hole=this.transparentBounds;ctx.globalAlpha=1;
  for(const r of regions){const x=r[0],y=r[1],w=r[2]-x,h=r[3]-y;
   if(!hole||x<hole[2]&&r[2]>hole[0]&&y<hole[3]&&r[3]>hole[1]){
    ctx.clearRect(x,y,w,h);ctx.globalCompositeOperation='source-over';ctx.drawImage(image,x,y,w,h,x,y,w,h);
   }else{ctx.globalCompositeOperation='source-over';ctx.drawImage(image,x,y,w,h,x,y,w,h);}
  }ctx.globalCompositeOperation='source-over';
 }
 paint(name,key,view,paint){
  if(this.keys.get(name)===key)return false;
  const c=this.layers.get(name),work=name==='ui-values'?c:this.scratch;
  if(work.width!==c.width||work.height!==c.height){work.width=c.width;work.height=c.height;}
  const ctx=work.getContext('2d'),scale=c.width/view[2];ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,c.width,c.height);ctx.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);
  ctx.save();try{paint(ctx);}finally{ctx.restore();}
  if(work!==c){const out=c.getContext('2d');out.save();out.setTransform(1,0,0,1,0,0);out.globalCompositeOperation='copy';out.drawImage(work,0,0);out.restore();}
  this.keys.set(name,key);return true;
 }
 updateComposite(key,regions,paint){
  if(this.keys.get('composite')===key)return false;
  regions=this.regions(regions);
  const ctx=this.layers.get('composite').getContext('2d');ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.beginPath();for(const b of regions)ctx.rect(b[0],b[1],b[2]-b[0],b[3]-b[1]);ctx.clip();
  this.restore(ctx,'static',regions);try{paint(ctx);}finally{ctx.restore();}this.keys.set('composite',key);return true;
 }
 updateInteractive(key,regions,paint){
  if(this.keys.get('interactive')===key)return false;
  const c=this.layers.get('interactive'),ctx=c.getContext('2d');ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.beginPath();for(const b of regions)ctx.rect(b[0],b[1],b[2]-b[0],b[3]-b[1]);ctx.clip();for(const b of regions)ctx.clearRect(b[0],b[1],b[2]-b[0],b[3]-b[1]);try{paint(ctx);}finally{ctx.restore();}this.keys.set('interactive',key);return true;
 }
 blitScore(ctx,height){const c=this.layers.get('ui-values');height=Math.max(0,Math.min(c.height,height));if(!height)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(c,0,0,c.width,height,0,0,c.width,height);ctx.restore();}
 destroy(){for(const c of this.layers.values()){c.width=c.height=0;c.remove();}delete this.canvas.dataset.playLayer;this.scratch.width=this.scratch.height=0;this.layers.clear();}
}
if(typeof module!=='undefined')module.exports=PlayCanvasLayers;else root.PlayCanvasLayers=PlayCanvasLayers;
})(typeof window!=='undefined'?window:globalThis);
