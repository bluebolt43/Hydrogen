/* Attack- or entry-powered bagua lottery. The display never captures or freezes a ball. */
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
 reset(){this.count=0;this.phase='idle';this.winner=-1;this.phaseAt=this.clock;this.attackAge=Infinity;this.entryAt=-Infinity;}
 event(type,data){
  if(type==='new-game'){this.multiplier=1;this.reset();}
  if(type==='drain'&&this.game.g.gameplay?.touhouBagua&&!this.game.storyMode&&!this.game.preserveTableOnDrain&&!this.game.hasPendingBalls()&&this.game.balls.every(b=>b.state==='drained')){this.multiplier=1;this.reset();}
  if(this.config.trigger==='circle-entry'||type!=='configured-attack'||data.kind!=='lv1'||this.game.gameOver)return;
  this.progress();
 }
 crossCircle(ball,previous,layer){
  if(this.config.trigger!=='circle-entry'||this.phase==='spin'||this.phase==='winflash')return;
  const o=this.geometry,countLayer=this.config.countLayer||o.layer,expected=countLayer==='upper'?'tavern':countLayer||'lower';
  if(this.game.paused||this.game.gameOver||this.game.theaterFrozen||ball.state!=='playing'||layer!==expected||ball.layer!==expected)return;
  const a=[previous[0]-(o.cx??o.x),previous[1]-(o.cy??o.y)],v=[ball.p[0]-previous[0],ball.p[1]-previous[1]],r=o.r??o.attractionRadius??this.config.radius;
  if(a[0]*a[0]+a[1]*a[1]<=r*r)return;
  const length=v[0]*v[0]+v[1]*v[1];if(!length)return;
  const t=Math.max(0,Math.min(1,-(a[0]*v[0]+a[1]*v[1])/length));
  if((a[0]+t*v[0])**2+(a[1]+t*v[1])**2<r*r){
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
  this.target=this.pick();this.attackAge=0;
  if(!this.game.g.gameplay?.runicTurntable)this.game.emit('configured-attack',{kind:'lv4',id:'touhou-bagua',position:[this.geometry.x,this.geometry.y]});
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
  if(effect&&!effect.fullscreen&&this.attackAge<effect.duration){
   const im=renderer.image(effect.src),t=this.attackAge/effect.duration,size=105*(.3+Math.min(1,t*3));
   if(im.complete&&im.naturalWidth){ctx.save();ctx.globalAlpha*=Math.min(1,t*8)*Math.min(1,(1-t)*3);ctx.rotate(t*Math.PI/3);ctx.drawImage(im,-size/2,-size/2,size,size);ctx.restore();}
  }
  ctx.restore();
 }
 drawAttackOverlay(ctx,renderer,view){
  const effect=this.config.attackArt;
  if(!effect?.fullscreen||this.attackAge>=effect.duration)return;
  const image=renderer.image(effect.src);
  if(!image.complete||!image.naturalWidth)return;
  const t=this.attackAge/effect.duration,p=1-(1-t)**3;
  const start=105*.3*this.config.radius/68,size=start+(Math.hypot(view[2],view[3])*1.5-start)*p;
  const x=this.geometry.x+(view[0]+view[2]/2-this.geometry.x)*p,y=this.geometry.y+(view[1]+view[3]/2-this.geometry.y)*p;
  ctx.save();ctx.globalAlpha*=1-t;ctx.translate(x,y);ctx.rotate(t*Math.PI/3);
  ctx.drawImage(image,-size/2,-size/2,size,size);ctx.restore();
 }
}
// Same prize rules as bagua, with a passable circle and a flat stone presentation.
const runePaths=['M0 -12 V12 M0 -3 L-9 -11 M0 -3 L9 -11','M-6 -12 V12 M-6 -10 L7 -2 L-6 5','M-6 -12 V12 M-6 -10 L7 -2 M-6 0 L7 10','M-7 -12 L7 12 M7 -12 L-7 12','M-6 12 V-12 L7 0 L-6 8','M-6 -12 V12 M6 -12 V12 M-6 -3 L6 3','M-7 -12 V12 M-7 -12 L8 -4 M-7 0 L5 6','M0 -12 V12 M0 -12 L-8 -3 M0 -12 L8 -3'];
class RunicController extends Controller{
 reset(){super.reset();this.rotationBase=0;this.restAngle=0;}
 rotationAngle(){
  if(this.phase==='idle')return this.restAngle;
  const elapsed=this.phase==='spin'?Math.min(this.config.spinSeconds,this.clock-this.phaseAt):this.config.spinSeconds;
  return this.rotationBase+(295*elapsed-125*elapsed*elapsed/this.config.spinSeconds)*Math.PI/180;
 }
 start(){
  if(this.count<this.config.threshold)return;
  this.rotationBase=this.rotationAngle();super.start();
 }
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
