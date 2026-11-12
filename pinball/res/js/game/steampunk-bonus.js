/* Steampunk's vortex bonus wheel. Visual time keeps running while physics is frozen. */
(function(root){
'use strict';
const drawRuntimeImage=globalThis.PinballRuntimeImages?.draw||((ctx,...args)=>ctx.drawImage(...args));
class Controller{
 constructor(game,config){this.game=game;this.config=config;this.clock=0;this.multiplier=1;this.reset();}
 reset(){this.pendingMultiball=false;this.phase='idle';this.active=false;this.index=this.winner=-1;this.releaseAt=-Infinity;this.frozen=false;this.game.bonusFrozen=false;this.cycleBoss=false;}
 open(){this.phase='open';this.active=true;this.openedAt=this.phaseAt=this.clock;this.index=this.winner=-1;this.cycleBoss=!!this.game.enemyActive;}
 close(){this.active=false;this.phase=this.winner>=0&&!this.cycleBoss?'settled':'idle';}
 event(type,data){if(type==='new-game'){this.multiplier=1;this.reset();}if(type==='ready'&&!this.game.armedHoles?.has(this.config.hole))this.reset();if(data.id!==this.config.hole)return;if(type==='vortex-activated')this.open();if(type==='vortex-expired'||type==='vortex-deactivated')this.close();if(type==='release')this.releaseAt=this.clock;}
 capture(){if(!this.active)this.open();this.cycleBoss=!!this.game.enemyActive;this.phase=this.cycleBoss?'bossflash':'spin';this.phaseAt=this.clock;this.frozen=this.game.bonusFrozen=true;this.index=0;if(!this.cycleBoss){this.target=Math.floor((this.game.random||Math.random)()*12);this.steps=48+this.target;}}
 reward(){const g=this.game,r=this.config.rewards[this.winner];
  if(r.kind==='score')g.scoreHit('steampunk-bonus-reward',r.value,0);
  if(r.kind==='multiplier')this.multiplier=r.value;
  if(r.kind==='ball')for(let i=0;i<r.value;i++)g.awardExtraLife('bonus-wheel');
  if(r.kind==='multi'){this.pendingMultiball=true;g.multiballAwards++;g.emit('multiball-awarded',{count:g.multiballAwards});}
  if(r.kind==='enemy'&&!g.enemyActive){g.enemyActive=true;g.emit('enemy-spawn-requested',{group:'steampunk-bonus'});}
  g.emit('bonus-awarded',{position:this.winner+1,kind:r.kind,value:r.value,multiplier:this.multiplier});
 }
 launchMultiball(){
  const g=this.game,previous=g.ball;
  for(const id of this.config.multiballHoles||[]){
   const socket=g.socketsById.get(id);if(!socket)continue;
   if(g.balls.filter(b=>b.state!=='drained').length+g.freeBallQueue>=3){g.awardExtraLife('multiball',socket.center);continue;}
   const layer=g.g.upper_parts.includes(socket)?'tavern':(g.g.top_parts||[]).includes(socket)?'top':'lower';
   const ball={p:[...socket.center],v:[0,0],layer,z:0,state:'captured',immunity:0,lastPortal:-10,trail:[],free:true};
   g.balls.push(ball);g.ball=ball;g.held={id,release:[...socket.center],layer,direction:socket.release_direction,speed:0};g.release();
   g.emit('free-ball-launch',{id,position:[...ball.p],layer});
  }
  g.ball=previous;g.selectBall();
 }
 finish(){const g=this.game;this.frozen=g.bonusFrozen=false;const held=g.balls.find(b=>b.state==='captured'&&b.held?.id===this.config.hole);if(held){g.ball=held;g.release();g.selectBall();}g.consumeHole(this.config.hole);if(this.pendingMultiball){this.pendingMultiball=false;this.launchMultiball();}if(this.cycleBoss)g.fireObjectAttack(this.config.hole);}
 update(dt){if(this.game.paused)return;this.clock+=dt;
  if(this.phase==='open'&&this.cycleBoss!==!!this.game.enemyActive)this.cycleBoss=!!this.game.enemyActive;
  const age=this.clock-this.phaseAt;
  if(this.phase==='spin'){const t=Math.min(1,age/this.config.spinSeconds);this.index=Math.floor(this.steps*(1-(1-t)**3))%12;if(t>=1){this.index=this.winner=this.target;this.phase='winflash';this.phaseAt=this.clock;this.reward();}}
  else if(this.phase==='winflash'&&age>=this.config.winFlashSeconds)this.finish();
  else if(this.phase==='bossflash'&&age>=this.config.bossFlashSeconds)this.finish();
 }
 visual(){const lights=Array(12).fill(0),icons=Array(12).fill(false),age=this.clock-this.phaseAt;
  if(['open','spin','winflash','bossflash'].includes(this.phase))icons.fill(true);
  if(this.phase==='open'){const t=age%3;lights.fill(t<1.5?Math.min(1,t/.4):Math.max(0,1-(t-1.5)/.4));}
  if(this.phase==='bossflash')lights.fill(Math.floor(age/.18)%2===0?1:0);
  if(this.phase==='spin')lights[this.index]=1;
  if(this.winner>=0&&['winflash','settled'].includes(this.phase)){icons[this.winner]=true;lights[this.winner]=this.phase==='winflash'&&Math.floor(age/.16)%2===0?1:0;}
  return {lights,icons};
 }
 paintRelease(ctx,p,t){
  ctx.save();ctx.globalAlpha*=1-t;ctx.strokeStyle='#39bfff';ctx.shadowColor='#168fff';ctx.shadowBlur=14;ctx.lineWidth=7*(1-t)+2;ctx.beginPath();ctx.arc(p.cx,p.cy,34+100*(1-(1-t)**2),0,Math.PI*2);ctx.stroke();ctx.restore();
 }
 prepareReleaseSprites(ctx,p={cx:0,cy:0}){
  const m=ctx.getTransform(),sx=Math.hypot(m.a,m.c),sy=Math.hypot(m.b,m.d),x=Math.round((m.a*p.cx+m.c*p.cy+m.e)*256)/256,y=Math.round((m.b*p.cx+m.d*p.cy+m.f)*256)/256,fx=x-Math.floor(x),fy=y-Math.floor(y),opacity=ctx.globalAlpha,key=[m.a,m.b,m.c,m.d,fx,fy,opacity].map(v=>Math.round(v*65536)/65536).join(':'),Art=root.PinballArt;
  if(this.releaseSprites?.key===key)return this.releaseSprites;
  this.clearReleaseSprites();if(!Art||sx<=0||sy<=0)return null;
  const pad=30,halfX=Math.ceil(139*sx)+pad,halfY=Math.ceil(139*sy)+pad,w=halfX*2,h=halfY*2;
  // A normal phone uses small native-pixel frames, with finer steps near fade-out. Bound the entire sequence to 8 MiB.
  const frames=Math.min(64,Math.floor(2097152/(w*h))-15);
  if(frames<16||w>2048||h>2048)return null;
  const entries=[];
  for(let i=0;i<=frames+14;i++){
   const canvas=Art.rasterCanvas(w,h,true),c=canvas.getContext('2d');c.setTransform(m.a,m.b,m.c,m.d,halfX+fx-w*2,halfY+fy);c.shadowOffsetX=w*2;c.globalAlpha=opacity;const t=i<frames-2?i/frames:1-2/frames+(i-frames+2)/(frames*8);this.paintRelease(c,{cx:0,cy:0},t);entries.push({canvas:Art.rasterImage(canvas)});
  }
  return this.releaseSprites={key,entries,frames,pixels:w*h*entries.length,sx,sy,halfX,halfY,w,h};
 }
 prepareArtwork(scale,renderer,offset=[0,0]){
  this.prepareWheelPaths();
  const o=this.game.g.artLayers?.find(o=>o.id===this.config.artId);if(!o)return;
  const canvas=document.createElement('canvas'),c=canvas.getContext('2d');c.setTransform(scale,0,0,scale,...offset);c.translate(o.x,o.y);c.rotate((o.angle||0)*Math.PI/180);c.scale(o.width/this.config.geometry.canvasSize,o.height/this.config.geometry.canvasSize);c.globalAlpha=o.opacity;this.prepareReleaseSprites(c);canvas.width=canvas.height=0;
 }
 clearReleaseSprites(){for(const entry of this.releaseSprites?.entries||[])root.PinballArt.releaseRaster(entry);this.releaseSprites=null;}
 destroy(){this.clearReleaseSprites();this.wheelPaths=null;}
 prepareWheelPaths(){
  if(this.wheelPaths)return;
  const p=this.config.geometry;
  this.wheelPaths=Array.from({length:12},(_,i)=>{const a=(-90+p.startAngle+i*30)*Math.PI/180,b=a+p.angle*Math.PI/180,path=new Path2D();path.arc(p.cx,p.cy,p.outer,a,b);path.arc(p.cx,p.cy,p.inner,b,a,true);path.closePath();return path;});
 }
 drawRelease(ctx,p,t){
  const cache=this.prepareReleaseSprites(ctx,p);if(!cache){this.paintRelease(ctx,p,t);return;}
  const index=this.releaseFrame(t,cache.frames);
  // Only the shadow is baked, including its fade. Keep the sharp ring continuous.
  const m=ctx.getTransform(),x=Math.floor(Math.round((m.a*p.cx+m.c*p.cy+m.e)*256)/256)-cache.halfX,y=Math.floor(Math.round((m.b*p.cx+m.d*p.cy+m.f)*256)/256)-cache.halfY;
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.shadowColor='transparent';ctx.drawImage(cache.entries[index].canvas,x,y);ctx.restore();
  ctx.save();ctx.globalAlpha*=1-t;ctx.shadowBlur=0;ctx.shadowColor='transparent';ctx.strokeStyle='#39bfff';ctx.lineWidth=7*(1-t)+2;ctx.beginPath();ctx.arc(p.cx,p.cy,34+100*(1-(1-t)**2),0,Math.PI*2);ctx.stroke();ctx.restore();
 }
 releaseFrame(t,frames=this.releaseSprites?.frames||64){return Math.max(0,Math.min(frames+14,t<1-2/frames?Math.round(t*frames):frames-2+Math.round((t-1+2/frames)*frames*8)));}
 visualKey(){
  const age=this.clock-this.releaseAt;
  return [this.phase,this.index,this.winner,this.cycleBoss,this.active?this.clock:0,age>=0&&age<.8?age:-1].join('|');
 }
 draw(ctx,o,renderer){const c=this.config,p=c.geometry,v=this.visual(),image=src=>this.drawImages?.[src]||renderer.image(src),draw=(src,crop,x,y,w,h)=>{const im=image(src);if(im.complete&&(im.runtimeWidth??im.naturalWidth)){const [sx,sy,sw,sh]=crop||[0,0,(im.runtimeWidth??im.naturalWidth),(im.runtimeHeight??im.naturalHeight)];drawRuntimeImage(ctx,im,sx,sy,sw,sh,x-w/2,y-h/2,w,h);}};
  ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.angle*Math.PI/180);ctx.scale(o.width/p.canvasSize,o.height/p.canvasSize);ctx.translate(-p.cx,-p.cy);ctx.globalAlpha=o.opacity;
  if(this.active){ctx.save();ctx.beginPath();ctx.arc(p.cx,p.cy,p.inner,0,Math.PI*2);ctx.clip();ctx.globalAlpha*=.5*Math.min(1,(this.clock-this.openedAt)/.8);ctx.translate(p.cx,p.cy);ctx.rotate((this.clock-this.openedAt)*Math.PI*2/18);draw(c.sphere,null,0,0,p.inner*2,p.inner*2);ctx.restore();}
  const manual=renderer.rasterCacheEnabled&&!!ctx.getTransform;
  if(manual)this.prepareWheelPaths();
  for(let i=0;i<12;i++){
   if(!manual){const a=(-90+p.startAngle+i*30)*Math.PI/180,b=a+p.angle*Math.PI/180;ctx.beginPath();ctx.arc(p.cx,p.cy,p.outer,a,b);ctx.arc(p.cx,p.cy,p.inner,b,a,true);ctx.closePath();}
   ctx.fillStyle='#292c29';if(manual)ctx.fill(this.wheelPaths[i]);else ctx.fill();
   if(v.lights[i]){const alpha=ctx.globalAlpha;if(!manual)ctx.save();ctx.globalAlpha=alpha*v.lights[i]*p.opacity;ctx.fillStyle=p.color;if(manual)ctx.fill(this.wheelPaths[i]);else ctx.fill();if(manual)ctx.globalAlpha=alpha;else ctx.restore();}
  }
  draw(o.src,o.crop,p.canvasSize/2,p.canvasSize/2,p.canvasSize,p.canvasSize);
  const transform=manual?ctx.getTransform():null;
  for(let i=0;i<12;i++){
   if(!v.icons[i])continue;const r=c.rewards[i],a=r.art;
   if(transform){const t=transform,angle=a.angle*Math.PI/180,cos=Math.cos(angle),sin=Math.sin(angle);ctx.setTransform(t.a*cos+t.c*sin,t.b*cos+t.d*sin,-t.a*sin+t.c*cos,-t.b*sin+t.d*cos,t.a*a.x+t.c*a.y+t.e,t.b*a.x+t.d*a.y+t.f);}
   else{ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.angle*Math.PI/180);}
   if(this.cycleBoss)draw(c.mine.src,c.mine.crop,0,0,110,125);else draw(a.src,a.crop,0,0,a.width,a.height);
   if(!transform)ctx.restore();
  }
  if(transform)ctx.setTransform(transform.a,transform.b,transform.c,transform.d,transform.e,transform.f);
  const releaseAge=this.clock-this.releaseAt;if(releaseAge>=0&&releaseAge<.8){const t=releaseAge/.8;if(renderer.rasterCacheEnabled)this.drawRelease(ctx,p,t);else this.paintRelease(ctx,p,t);}ctx.restore();
 }
}
function createGame(Base){return class extends Base{
 constructor(g){super(g);if(g.gameplay?.steampunkBonus)this.bonus=new Controller(this,g.gameplay.steampunkBonus);}
 emit(type,data={}){super.emit(type,data);this.bonus?.event(type,data);}
 beforeStep(dt){return !this.bonusFrozen&&super.beforeStep(dt);}
 rulesInterrupted(){return this.bonusFrozen||super.rulesInterrupted();}
 scoreHit(id,points,cooldown){return super.scoreHit(id,points*(this.bonus?.multiplier||1),cooldown);}
 onCapture(id){if(this.bonus&&id===this.bonus.config.hole){this.bonus.capture();return;}super.onCapture(id);}
};}
const api={Controller,createGame};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SteampunkBonus=api;
})(globalThis);
