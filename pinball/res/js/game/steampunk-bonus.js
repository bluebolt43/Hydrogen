/* Steampunk's vortex bonus wheel. Visual time keeps running while physics is frozen. */
(function(root){
'use strict';
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
 draw(ctx,o,renderer){const c=this.config,p=c.geometry,v=this.visual(),image=src=>renderer.image(src),draw=(src,crop,x,y,w,h)=>{const im=image(src);if(im.complete&&im.naturalWidth){const [sx,sy,sw,sh]=crop||[0,0,im.naturalWidth,im.naturalHeight];ctx.drawImage(im,sx,sy,sw,sh,x-w/2,y-h/2,w,h);}};
  ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.angle*Math.PI/180);ctx.scale(o.width/p.canvasSize,o.height/p.canvasSize);ctx.translate(-p.cx,-p.cy);ctx.globalAlpha=o.opacity;
  if(this.active){ctx.save();ctx.beginPath();ctx.arc(p.cx,p.cy,p.inner,0,Math.PI*2);ctx.clip();ctx.globalAlpha*=.5*Math.min(1,(this.clock-this.openedAt)/.8);ctx.translate(p.cx,p.cy);ctx.rotate((this.clock-this.openedAt)*Math.PI*2/18);draw(c.sphere,null,0,0,p.inner*2,p.inner*2);ctx.restore();}
  for(let i=0;i<12;i++){const a=(-90+p.startAngle+i*30)*Math.PI/180,b=a+p.angle*Math.PI/180;ctx.beginPath();ctx.arc(p.cx,p.cy,p.outer,a,b);ctx.arc(p.cx,p.cy,p.inner,b,a,true);ctx.closePath();ctx.fillStyle='#292c29';ctx.fill();if(v.lights[i]){ctx.save();ctx.globalAlpha*=v.lights[i]*p.opacity;ctx.fillStyle=p.color;ctx.fill();ctx.restore();}}
  draw(o.src,o.crop,p.canvasSize/2,p.canvasSize/2,p.canvasSize,p.canvasSize);
  for(let i=0;i<12;i++){if(!v.icons[i])continue;const r=c.rewards[i],a=r.art;ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.angle*Math.PI/180);if(this.cycleBoss)draw(c.mine.src,c.mine.crop,0,0,110,125);else draw(a.src,a.crop,0,0,a.width,a.height);ctx.restore();}
  const releaseAge=this.clock-this.releaseAt;if(releaseAge>=0&&releaseAge<.8){const t=releaseAge/.8;ctx.save();ctx.globalAlpha*=1-t;ctx.strokeStyle='#39bfff';ctx.shadowColor='#168fff';ctx.shadowBlur=14;ctx.lineWidth=7*(1-t)+2;ctx.beginPath();ctx.arc(p.cx,p.cy,34+100*(1-(1-t)**2),0,Math.PI*2);ctx.stroke();ctx.restore();}ctx.restore();
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
