/* Attack- or entry-powered bagua lottery. The display never captures or freezes a ball. */
(function(root){
'use strict';
const drawRuntimeImage=globalThis.PinballRuntimeImages?.draw||((ctx,...args)=>ctx.drawImage(...args));
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
 reset(){this.count=0;this.phase='idle';this.winner=-1;this.phaseAt=this.clock;this.attackAge=Infinity;this.entryAt=-Infinity;this.entryLatched=new WeakSet();}
 event(type,data){
  if(type==='new-game'){this.multiplier=1;this.reset();}
  if(type==='drain'&&this.game.g.gameplay?.touhouBagua&&!this.game.storyMode&&!this.game.preserveTableOnDrain&&!this.game.hasPendingBalls()&&this.game.balls.every(b=>b.state==='drained')){this.multiplier=1;this.reset();}
  if(this.config.trigger==='circle-entry'||type!=='configured-attack'||data.kind!=='lv1'||this.game.gameOver)return;
  this.progress();
 }
 crossCircle(ball,previous,layer){
  if(this.config.trigger!=='circle-entry')return;
  const o=this.geometry,countLayer=this.config.countLayer||o.layer,expected=countLayer==='upper'?'tavern':countLayer||'lower';
  if(this.game.paused||this.game.gameOver||this.game.theaterFrozen||ball.state!=='playing'||layer!==expected||ball.layer!==expected)return;
  const a=[previous[0]-(o.cx??o.x),previous[1]-(o.cy??o.y)],v=[ball.p[0]-previous[0],ball.p[1]-previous[1]],r=o.r??o.attractionRadius??this.config.radius;
  const distance=a[0]*a[0]+a[1]*a[1],clearRadius=r+this.game.physics.ballRadius;
  // A fresh entry requires the entire ball to leave, not just its center.
  if(distance>clearRadius*clearRadius)this.entryLatched.delete(ball);
  if(this.entryLatched.has(ball)||distance<=r*r){
   this.entryLatched.add(ball);
   if((a[0]+v[0])**2+(a[1]+v[1])**2>clearRadius*clearRadius)this.entryLatched.delete(ball);
   return;
  }
  const length=v[0]*v[0]+v[1]*v[1];if(!length)return;
  const t=Math.max(0,Math.min(1,-(a[0]*v[0]+a[1]*v[1])/length));
  if((a[0]+t*v[0])**2+(a[1]+t*v[1])**2<r*r){
   this.entryLatched.add(ball);
   if(this.phase==='spin'||this.phase==='winflash')return;
   if(this.game.time-this.entryAt<(this.config.entryCooldown??0))return;
   this.entryAt=this.game.time;this.progress();
  }
 }
 progress(){
  if(this.game.gameOver||this.phase==='spin'||this.phase==='winflash')return;
  if(this.phase==='settled')this.phase='idle';
  this.count++;this.game.emit('bagua-progress',{count:this.count,total:this.config.threshold});
  if(this.phase==='idle'||this.phase==='settled')this.start();
 }
 start(){
  if(this.count<this.config.threshold)return;
  this.count-=this.config.threshold;this.phase='spin';this.phaseAt=this.clock;this.winner=-1;
  this.available=this.availableRewards();
  this.target=this.pick();
  // The lottery still runs without a Boss; only its Lv4 attack overlay is gated.
  this.attackAge=this.game.g.gameplay?.runicTurntable||this.game.enemyActive&&!this.game.enemyIntroPending?0:Infinity;
  if(!this.game.g.gameplay?.runicTurntable)this.game.emit('configured-attack',{kind:'lv4',id:'touhou-bagua',position:[this.geometry.x,this.geometry.y]});
  this.game.emit('bagua-spin',{total:this.config.threshold});
  if(this.config.spinSound)this.game.emit('sound',{name:'runic-spin'});
 }
 pick(replacement=false){
  let random=Math.max(0,Math.min(.999999,(this.game.random||Math.random)())),reserved=0;
  const rewards=this.config.rewards,common=this.available.filter(i=>rewards[i].probability===undefined);
  // Fixed probabilities remain absolute when Boss or ball capacity excludes a prize.
  // An invalidated result only falls back to common prizes, never rerolls rare ones.
  if(!replacement)for(const i of this.available){const chance=rewards[i].probability;if(chance===undefined)continue;if(random<chance)return i;random-=chance;reserved+=chance;}
  return common[Math.min(common.length-1,Math.floor(random/(1-reserved)*common.length))];
 }
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
 visualKey(){
  if(this.game.g.gameplay?.runicTurntable)return null;
  const effect=this.config.attackArt;
  return [this.phase,this.count,this.winner,this.phase==='spin'?Math.floor((this.clock-this.phaseAt)/.16)%2:0,this.phase==='winflash'?this.visual().prizeOpacity:0,effect&&!effect.fullscreen&&this.attackAge<effect.duration?this.attackAge:0].join('|');
 }
 paintFace(ctx,litCount,count){
  const glowing=litCount>0;let glow;
  if(glowing){glow=ctx.createRadialGradient(0,0,35,0,0,66);glow.addColorStop(0,'#d89b2c');glow.addColorStop(.55,'#ffe39a');glow.addColorStop(1,'#dba936');}
  for(let i=0;i<8;i++){
   const a=(-112.5+i*45)*Math.PI/180,b=a+Math.PI/4,lit=i<litCount;
   ctx.beginPath();ctx.arc(0,0,66,a,b);ctx.arc(0,0,35,b,a,true);ctx.closePath();ctx.fillStyle=lit?glow:'#252b32';ctx.fill();ctx.strokeStyle=lit?'#ffe7a0':'#7d7055';ctx.stroke();
   ctx.save();ctx.rotate(i*Math.PI/4);ctx.strokeStyle=lit?'#fff4c3':'#625e51';ctx.lineWidth=2.3;
   for(let j=0;j<3;j++){const y=-56+j*5;ctx.beginPath();if(trigrams[i]&(1<<j)){ctx.moveTo(-10,y);ctx.lineTo(10,y);}else{ctx.moveTo(-10,y);ctx.lineTo(-3,y);ctx.moveTo(3,y);ctx.lineTo(10,y);}ctx.stroke();}ctx.restore();
  }
  ctx.beginPath();ctx.arc(0,0,31,0,Math.PI*2);ctx.fillStyle='#17202a';ctx.fill();
  for(let i=0;i<this.config.threshold;i++){const a=(-90+i*360/this.config.threshold)*Math.PI/180;ctx.beginPath();ctx.arc(Math.cos(a)*63,Math.sin(a)*63,1.4,0,Math.PI*2);ctx.fillStyle=i<count?'#ffe49a':'#56616b';ctx.fill();}
 }
 faceSprite(scale,litCount,count){
  scale=Math.max(1/64,Math.round(scale*64)/64);const Art=root.PinballArt;
  if(this.faceScale!==scale){this.clearFaces();this.faceScale=scale;this.faces=new Map();}
  const key=litCount+':'+count;let entry=this.faces.get(key);if(entry)return entry;
  const half=Math.ceil(68*scale)+1,canvas=Art.rasterCanvas(half*2,half*2,true),c=canvas.getContext('2d');c.setTransform(scale,0,0,scale,half,half);c.lineWidth=.65;this.paintFace(c,litCount,count);
  entry={canvas:Art.rasterImage(canvas),half,scale};if(this.faces.size>=32){const id=this.faces.keys().next().value;Art.releaseRaster(this.faces.get(id));this.faces.delete(id);}this.faces.set(key,entry);return entry;
 }
 prepareArtwork(scale){
  if(!this.config.yinYang)return;
  scale*=this.config.radius/68;
  for(let count=0;count<Math.min(16,this.config.threshold);count++)this.faceSprite(scale,Math.min(8,count),count);
  this.faceSprite(scale,8,0);
 }
 clearFaces(){for(const entry of this.faces?.values()||[])root.PinballArt.releaseRaster(entry);this.faces?.clear();}
 destroy(){this.clearFaces();if(this.attackRaster)root.PinballArt.releaseRaster(this.attackRaster);this.attackRaster=null;}
 draw(ctx,renderer){
  const o=this.geometry,r=this.config.radius,centerRadius=31,age=this.clock-this.phaseAt,spin=this.phase==='spin';
  ctx.save();ctx.translate(o.x,o.y);ctx.rotate((o.angle||0)*Math.PI/180);ctx.scale(r/68,r/68);ctx.lineWidth=.65;
  const flashOn=Math.floor(age/.16)%2===0;
  const litCount=spin?(flashOn?8:0):this.phase==='idle'?Math.min(8,this.count):0;
  if(renderer.rasterCacheEnabled&&root.PinballArt){const t=ctx.getTransform(),sprite=this.faceSprite(Math.max(Math.hypot(t.a,t.b),Math.hypot(t.c,t.d)),litCount,this.count);ctx.drawImage(sprite.canvas,-sprite.half/sprite.scale,-sprite.half/sprite.scale,sprite.canvas.width/sprite.scale,sprite.canvas.height/sprite.scale);}else this.paintFace(ctx,litCount,this.count);
  ctx.save();ctx.beginPath();ctx.arc(0,0,centerRadius,0,Math.PI*2);ctx.clip();
  const visual=this.visual();
  if(visual.prize>=0&&visual.prizeOpacity>0){
   ctx.save();ctx.globalAlpha*=visual.prizeOpacity;
   const art=this.config.rewards[visual.prize].art,im=(this.drawImages?.[art.src]||renderer.image(art.src));
   if(im.complete&&(im.runtimeWidth??im.naturalWidth)){const crop=art.crop||[0,0,(im.runtimeWidth??im.naturalWidth),(im.runtimeHeight??im.naturalHeight)],w=42,h=w*crop[3]/crop[2];drawRuntimeImage(ctx,im,...crop,-w/2,-h/2,w,h);}
   ctx.restore();
  }
  if(visual.yinOpacity>0){
   ctx.save();ctx.globalAlpha*=visual.yinOpacity;
   drawYinYang(ctx,centerRadius);ctx.restore();
  }
  ctx.restore();
  ctx.beginPath();ctx.arc(0,0,centerRadius,0,Math.PI*2);ctx.strokeStyle='#b5a57d';ctx.lineWidth=.65;ctx.stroke();
  const effect=this.config.attackArt;
  if(effect&&!effect.fullscreen&&this.attackAge<effect.duration){
   const im=(this.drawImages?.[effect.src]||renderer.image(effect.src)),t=this.attackAge/effect.duration,size=105*(.3+Math.min(1,t*3));
   if(im.complete&&(im.runtimeWidth??im.naturalWidth)){ctx.save();ctx.globalAlpha*=Math.min(1,t*8)*Math.min(1,(1-t)*3);ctx.rotate(t*Math.PI/3);drawRuntimeImage(ctx,im,-size/2,-size/2,size,size);ctx.restore();}
  }
  ctx.restore();
 }
 attackPose(renderer,view){
  const effect=this.config.attackArt;if(!effect?.fullscreen||this.attackAge>=effect.duration)return null;
  const image=this.drawImages?.[effect.src]||renderer.image(effect.src);if(!image.complete||!(image.runtimeWidth??image.naturalWidth))return null;
  const t=this.attackAge/effect.duration,p=1-(1-t)**3,start=105*.3*this.config.radius/68,size=start+(Math.hypot(view[2],view[3])*1.5-start)*p;
  return {image,size,x:this.geometry.x+(view[0]+view[2]/2-this.geometry.x)*p,y:this.geometry.y+(view[1]+view[3]/2-this.geometry.y)*p,angle:t*Math.PI/3,alpha:1-t};
 }
 attackSprite(renderer){
  const effect=this.config.attackArt;if(!effect?.fullscreen)return null;const image=this.drawImages?.[effect.src]||renderer.image(effect.src);if(!image.complete||!image.naturalWidth)return null;
  if(this.attackRaster?.source===image)return this.attackRaster.canvas;
  if(this.attackRaster)root.PinballArt.releaseRaster(this.attackRaster);
  const r=root.PinballRuntimeImages,w=r.width(image),h=r.height(image),scale=Math.min(1,1024/Math.max(w,h)),canvas=root.PinballArt.rasterCanvas(Math.max(1,Math.round(w*scale)),Math.max(1,Math.round(h*scale)),true);r.draw(canvas.getContext('2d'),image,0,0,canvas.width,canvas.height);this.attackRaster={source:image,canvas:root.PinballArt.rasterImage(canvas)};return this.attackRaster.canvas;
 }
 prepareAttackGPU(gpu,renderer){const sprite=this.attackSprite(renderer);if(sprite)gpu.texture(sprite);}
 drawAttackOverlay(ctx,renderer,view){
  const p=this.attackPose(renderer,view);if(!p)return;
  ctx.save();ctx.globalAlpha*=p.alpha;ctx.translate(p.x,p.y);ctx.rotate(p.angle);drawRuntimeImage(ctx,p.image,-p.size/2,-p.size/2,p.size,p.size);ctx.restore();
 }
 drawAttackGPU(gpu,renderer,view){
  const p=this.attackPose(renderer,view);if(!p)return;const sprite=this.attackSprite(renderer);if(!sprite)return;const scale=gpu.canvas.width/view[2];
  gpu.spritePx(sprite,(p.x-view[0])*scale,(p.y-view[1])*scale,p.size*scale,p.size*scale,{origin:[.5,.5],angle:p.angle*180/Math.PI,alpha:p.alpha});
 }

}
// Same prize rules as bagua, with a passable circle and a flat stone presentation.
const runePaths=['M0 -12 V12 M0 -3 L-9 -11 M0 -3 L9 -11','M-6 -12 V12 M-6 -10 L7 -2 L-6 5','M-6 -12 V12 M-6 -10 L7 -2 M-6 0 L7 10','M-7 -12 L7 12 M7 -12 L-7 12','M-6 12 V-12 L7 0 L-6 8','M-6 -12 V12 M6 -12 V12 M-6 -3 L6 3','M-7 -12 V12 M-7 -12 L8 -4 M-7 0 L5 6','M0 -12 V12 M0 -12 L-8 -3 M0 -12 L8 -3'];
class RunicController extends Controller{
 reset(){super.reset();this.rotationBase=0;this.restAngle=0;}
 prepareArtwork(){this.prepareRuneGroups();}
 destroy(){super.destroy();this.runeGroups=null;this.runeShapes=null;}
 prepareRuneGroups(){
  if(this.runeGroups)return;
  const paths=this.runeShapes||(this.runeShapes=runePaths.map(d=>new Path2D(d)));
  this.runeGroups=Array.from({length:9},(_,count)=>{
   const lit=new Path2D(),dark=new Path2D();
   for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,m=new DOMMatrix().translate(65*Math.cos(a),65*Math.sin(a)).rotate(i*45);(i<count?lit:dark).addPath(paths[i],m);}
   return {lit,dark};
  });
 }
 visualKey(){return [this.phase,this.count,this.winner,this.rotationAngle(),this.phase==='winflash'?this.visual().prizeOpacity:0].join('|');}
 rotationAngle(){
  if(this.phase==='idle')return this.restAngle;
  const elapsed=this.phase==='spin'?Math.min(this.config.spinSeconds,this.clock-this.phaseAt):this.config.spinSeconds;
  return this.rotationBase+(295*elapsed-125*elapsed*elapsed/this.config.spinSeconds)*Math.PI/180;
 }
 start(){
  if(this.count<this.config.threshold)return;
  this.rotationBase=this.rotationAngle();super.start();
 }

 progress(){
  if(this.phase==='spin'||this.phase==='winflash')return;
  if(this.phase==='settled'){this.restAngle=this.rotationAngle();this.phase='idle';}
  super.progress();
 }
 event(type,data){
  super.event(type,data);
  if(type==='drain'&&!this.game.storyMode&&!this.game.freeBallQueue&&this.game.balls.every(b=>b.state==='drained')){this.multiplier=1;this.reset();}
 }

 draw(ctx,renderer){
  const o=this.geometry,r=this.config.radius,spin=this.phase==='spin';
  // Rotation is evaluated from elapsed time; the central reward stays upright.
  const angle=this.rotationAngle();
  const bitmap=(art,size)=>{const im=(this.drawImages?.[art.src]||renderer.image(art.src));if(!im.complete||!(im.runtimeWidth??im.naturalWidth))return;const uv=art.uv||[0,0,1,1],w=(im.runtimeWidth??im.naturalWidth),h=(im.runtimeHeight??im.naturalHeight);drawRuntimeImage(ctx,im,uv[0]*w,uv[1]*h,uv[2]*w,uv[3]*h,-size/2,-size/2,size,size);};
  ctx.save();ctx.translate(o.cx,o.cy);ctx.scale(r/100,r/100);
  ctx.save();ctx.rotate(angle);bitmap(this.config.rotorArt,136);
  ctx.scale(.68,.68);ctx.lineCap='round';ctx.lineJoin='round';
  const paths=this.runeShapes||(this.runeShapes=runePaths.map(d=>new Path2D(d)));
  if(renderer.rasterCacheEnabled&&typeof DOMMatrix!=='undefined'){
   this.prepareRuneGroups();const count=spin?8:Math.max(0,Math.min(8,this.count)),groups=this.runeGroups[count];ctx.lineWidth=4.5;
   if(count<8){ctx.strokeStyle='#302c24';ctx.stroke(groups.dark);}if(count>0){ctx.strokeStyle='#9df7e6';ctx.stroke(groups.lit);}
  }else for(let i=0;i<8;i++){
   const a=i*Math.PI/4-Math.PI/2;ctx.save();ctx.translate(65*Math.cos(a),65*Math.sin(a));ctx.rotate(i*Math.PI/4);
   const lit=spin||i<this.count;ctx.lineWidth=4.5;ctx.strokeStyle=lit?'#9df7e6':'#302c24';ctx.stroke(paths[i]);ctx.restore();
  }
  ctx.beginPath();ctx.arc(0,0,29,0,Math.PI*2);ctx.lineWidth=1.3;ctx.strokeStyle='#514938';ctx.stroke();ctx.restore();
  bitmap(this.config.ringArt,200);
  if(this.winner>=0){ctx.save();ctx.globalAlpha*=this.visual().prizeOpacity;const art=this.config.rewards[this.winner].art,im=(this.drawImages?.[art.src]||renderer.image(art.src));if(im.complete&&(im.runtimeWidth??im.naturalWidth)){const uv=art.uv,w=(im.runtimeWidth??im.naturalWidth),h=(im.runtimeHeight??im.naturalHeight),ratio=uv[2]*w/(uv[3]*h),dw=38*Math.min(1,ratio),dh=38*Math.min(1,1/ratio);drawRuntimeImage(ctx,im,uv[0]*w,uv[1]*h,uv[2]*w,uv[3]*h,-dw/2,-dh/2,dw,dh);}ctx.restore();}
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
