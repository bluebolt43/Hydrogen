/* Native-pixel ball and life-icon skins. Rebuild only at load/resize. */
(function(root){
'use strict';
class BallImageCache{
 constructor(image){this.image=image;this.sprites=null;}
 prepare(scale,ballSize,hudSize,glowLevels=0){
  if(!this.image.complete||!this.image.naturalWidth)return;
  const ball=Math.max(1,Math.round(ballSize*scale)),hud=Math.max(1,Math.round(hudSize*scale));
  if(this.sprites&&this.source===this.image.src&&this.ballSize===ball&&this.hudSize===hud&&this.glowLevels===glowLevels)return;
  this.clear();this.source=this.image.src;this.ballSize=ball;this.hudSize=hud;this.glowLevels=glowLevels;
  const art=root.PinballArt,make=size=>{
   const c=art.rasterCanvas(size,size,true);
   root.PinballRuntimeImages.draw(c.getContext('2d'),this.image,0,0,size,size);
   return {canvas:art.rasterImage(c),half:size/2};
  };
  const a=make(ball);this.sprites={ball:a,hud:hud===ball?a:make(hud)};
  this.glowing=[a];
  for(let level=1;level<=glowLevels;level++){
   const strength=level/glowLevels,r=ballSize*scale/2,radius=r*(1.25+strength*1.25),size=ball+2*Math.ceil(radius-ball/2+1),half=size/2;
   const canvas=art.rasterCanvas(size,size,true),c=canvas.getContext('2d'),glow=c.createRadialGradient(half,half,r*.65,half,half,radius);
   glow.addColorStop(0,'rgba(255,250,220,.8)');glow.addColorStop(.45,'rgba(255,219,135,.45)');glow.addColorStop(1,'rgba(255,219,135,0)');
   c.globalAlpha=.45+.55*strength;c.fillStyle=glow;c.beginPath();c.arc(half,half,radius,0,Math.PI*2);c.moveTo(half+r,half);c.arc(half,half,r,0,Math.PI*2);c.fill('evenodd');
   c.globalAlpha=1;c.drawImage(a.canvas,(size-ball)/2,(size-ball)/2);this.glowing.push({canvas:art.rasterImage(canvas),half});
  }
 }
 draw(ctx,kind,x,y,glowLevel=0){
  const s=kind==='ball'?this.glowing[glowLevel]||this.sprites.ball:this.sprites[kind];ctx.drawImage(s.canvas,Math.round(x-s.half),Math.round(y-s.half));
 }
 clear(){
  if(this.sprites){root.PinballArt.releaseRaster(this.sprites.ball);if(this.sprites.hud!==this.sprites.ball)root.PinballArt.releaseRaster(this.sprites.hud);}
  for(const s of this.glowing?.slice(1)||[])root.PinballArt.releaseRaster(s);
  this.sprites=null;this.glowing=null;
 }
}
if(typeof module!=='undefined')module.exports=BallImageCache;else root.BallImageCache=BallImageCache;
})(typeof window!=='undefined'?window:globalThis);
