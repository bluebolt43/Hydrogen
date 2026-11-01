/* Space's ten-capture constellation lottery. Native stars/lines, no image filters. */
(function(root){
'use strict';
const patterns={
 enemy:{points:[[-.6,-.65],[0,-.9],[.6,-.65],[.7,-.1],[.4,.4],[.3,.8],[-.3,.8],[-.4,.4],[-.7,-.1],[-.3,-.12],[.3,-.12],[0,.2]],lines:[[0,1,2,3,4,5,6,7,8,0],[0,9,11,10,2],[7,11,4]]},
 multi:{points:[[-.52,.35],[-.75,-.15],[-.4,-.65],[0,-.9],[.4,-.65],[.75,-.15],[.52,.35],[.52,.75],[-.52,.75],[0,.35]],lines:[[0,1,2,3,4,5,6,7,8,0],[2,9,4],[0,9,6]]}
};
const lights=typeof module!=='undefined'&&module.exports?require('../indicator-lights'):null;
const i18n=(key,args)=>root.PinballI18n?.t(key,args)||({'space.lottery.title':'CONSTELLATION','space.lottery.spinning':'DRAWING','space.lottery.enemy':'ENEMY','space.lottery.multiball':'MULTIBALL','space.lottery.progress':`${args?.count||0} / ${args?.total||10}`}[key]||key);
function label(reward){return reward.kind==='score'?'+'+reward.value:reward.kind==='multiplier'?'×'+reward.value:reward.kind==='ball'?'+'+reward.value:reward.kind==='multi'?i18n('space.lottery.multiball'):i18n('space.lottery.enemy');}
function star(ctx,x,y,size,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y-size);ctx.lineTo(x+size*.3,y-size*.3);ctx.lineTo(x+size,y);ctx.lineTo(x+size*.3,y+size*.3);ctx.lineTo(x,y+size);ctx.lineTo(x-size*.3,y+size*.3);ctx.lineTo(x-size,y);ctx.lineTo(x-size*.3,y-size*.3);ctx.closePath();ctx.fill();}
function constellation(ctx,kind,x,y,size,lit,lineAlpha=1){
 const shape=typeof kind==='string'?patterns[kind]:kind;ctx.save();ctx.translate(x,y);ctx.strokeStyle=lit?'#c4efff':'#536879';ctx.lineWidth=lit?.65:.35;ctx.setLineDash([1.2,.9]);
 if(lineAlpha>0){ctx.save();ctx.globalAlpha*=lineAlpha;for(const chain of shape.lines){ctx.beginPath();chain.forEach((n,i)=>{const p=shape.points[n];if(i)ctx.lineTo(p[0]*size,p[1]*size);else ctx.moveTo(p[0]*size,p[1]*size);});ctx.stroke();}ctx.restore();}
 ctx.setLineDash([]);for(const [px,py] of shape.points)star(ctx,px*size,py*size,lit?1.05:.65,lit?'#effbff':'#7b91a0');ctx.restore();
}
function numberChart(text,y=0,height=1,maxWidth=2.5){
 const vertices=[[-.3,-.5],[.3,-.5],[.3,0],[.3,.5],[-.3,.5],[-.3,0]],segments=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[5,2]],digits=[[0,1,2,3,4,5],[1,2],[0,1,6,4,3],[0,1,2,3,6],[5,6,1,2],[0,5,6,2,3],[0,5,6,4,3,2],[0,1,2],[0,1,2,3,4,5,6],[0,1,2,3,5,6]];
 const points=[],lines=[];
 [...text].forEach((c,n)=>{const offset=points.length,x=(n-(text.length-1)/2)*.9;if(c==='+'||c==='×'){const v=c==='+'?[[-.3,0],[.3,0],[0,-.35],[0,.35]]:[[-.3,-.35],[.3,.35],[.3,-.35],[-.3,.35]];points.push(...v.map(([px,py])=>[px+x,py]));lines.push([offset,offset+1],[offset+2,offset+3]);}else{const used=new Map();lines.push(...digits[Number(c)].map(i=>segments[i].map(v=>{if(!used.has(v)){used.set(v,points.length);points.push([vertices[v][0]+x,vertices[v][1]]);}return used.get(v);})));}});
 const width=Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])),scale=Math.min(height,maxWidth/width);
 return {points:points.map(([x,py])=>[x*scale,py*scale+y]),lines};
}
function chart(reward){
 if(reward.kind==='score')return numberChart('+'+reward.value,0,1,2.65);
 if(reward.kind==='multiplier')return numberChart('×'+reward.value,0,1.15,2.2);
 if(reward.kind==='ball'){
  const number=numberChart('+'+reward.value,.65,.55,1.2),points=Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return [Math.cos(a)*.48,Math.sin(a)*.48-.3];});
  return {points:[...points,...number.points],lines:[[0,1,2,3,4,5,0],[1,4],[2,5],...number.lines.map(chain=>chain.map(i=>i+6))]};
 }
 return patterns[reward.kind];
}
function prizeOutline(ctx,reward,shape){
 ctx.save();ctx.scale(29,29);ctx.setLineDash([]);ctx.strokeStyle='#95b9cf';ctx.lineWidth=.045;ctx.lineJoin=ctx.lineCap='round';
 const stroke=()=>ctx.stroke();
 if(reward.kind==='score'||reward.kind==='multiplier'){
  // Outline the numeric strokes; stars and dashed connections run through them.
  ctx.beginPath();for(const chain of shape.lines)chain.forEach((n,i)=>{const p=shape.points[n];if(i)ctx.lineTo(...p);else ctx.moveTo(...p);});ctx.strokeStyle='#7894a8';ctx.lineWidth=.1;stroke();ctx.strokeStyle='#102c40';ctx.lineWidth=.065;stroke();
 }else if(reward.kind==='enemy'){
  ctx.beginPath();ctx.moveTo(-.32,.83);ctx.bezierCurveTo(-.4,.72,-.29,.53,-.36,.44);ctx.bezierCurveTo(-.65,.38,-.8,.04,-.8,-.3);ctx.bezierCurveTo(-.8,-1.2,.8,-1.2,.8,-.3);ctx.bezierCurveTo(.8,.04,.65,.38,.34,.44);ctx.bezierCurveTo(.29,.57,.4,.72,.32,.84);ctx.bezierCurveTo(.13,.91,-.15,.87,-.32,.83);ctx.closePath();stroke();
  for(const x of [-.32,.32]){ctx.beginPath();ctx.ellipse(x,-.19,.21,.22,0,0,Math.PI*2);stroke();}
  ctx.beginPath();ctx.moveTo(0,.09);ctx.lineTo(-.1,.29);ctx.lineTo(.1,.29);ctx.closePath();stroke();
  for(const x of [-.13,.13]){ctx.beginPath();ctx.moveTo(x,.52);ctx.lineTo(x,.79);stroke();}
 }else if(reward.kind==='multi'){
  ctx.beginPath();ctx.moveTo(-.53,.36);ctx.bezierCurveTo(-1.07,.26,-.94,-.62,-.46,-.59);ctx.bezierCurveTo(-.34,-1.18,.36,-1.18,.46,-.59);ctx.bezierCurveTo(1.01,-.65,1.09,.25,.53,.36);ctx.bezierCurveTo(.49,.5,.58,.7,.5,.82);ctx.bezierCurveTo(.21,.9,-.24,.77,-.51,.83);ctx.bezierCurveTo(-.57,.66,-.48,.49,-.53,.36);ctx.closePath();stroke();
  ctx.beginPath();ctx.moveTo(-.53,.38);ctx.bezierCurveTo(-.2,.43,.23,.32,.53,.38);stroke();
  for(const x of [-.3,0,.3]){ctx.beginPath();ctx.moveTo(x,.1);ctx.lineTo(x,.36);stroke();}
 }else if(reward.kind==='ball'){
  ctx.beginPath();ctx.arc(0,-.3,.54,0,Math.PI*2);stroke();ctx.beginPath();ctx.arc(0,-.3,.4,Math.PI*1.1,Math.PI*1.55);stroke();
  ctx.beginPath();for(const chain of shape.lines.slice(3))chain.forEach((n,i)=>{const p=shape.points[n];if(i)ctx.lineTo(...p);else ctx.moveTo(...p);});ctx.lineWidth=.065;stroke();
 }
 ctx.restore();
}
function countChart(value){
 const numeral=['','I','II','III','IV','V','VI','VII','VIII','IX','X'][value]||'';
 const glyphs={I:{width:0,points:[[0,-1],[0,0],[0,1]],lines:[[0,1,2]]},V:{width:1.1,points:[[-.55,-1],[0,1],[.55,-1]],lines:[[0,1,2]]},X:{width:1.1,points:[[-.55,-1],[.55,1],[.55,-1],[-.55,1],[0,0]],lines:[[0,4,1],[2,4,3]]}};
 const points=[],lines=[],width=[...numeral].reduce((sum,c)=>sum+glyphs[c].width,0)+Math.max(0,numeral.length-1)*.45;
 let x=-width/2;
 for(const c of numeral){const glyph=glyphs[c],offset=points.length;points.push(...glyph.points.map(([px,py])=>[px+x+glyph.width/2,py]));lines.push(...glyph.lines.map(chain=>chain.map(i=>i+offset)));x+=glyph.width+.45;}
 return {points,lines};
}
class Controller{
 constructor(game,config){this.game=game;this.config=config;this.clock=0;this.geometry=game.g.art_layout_objects?.find(o=>o.id===config.object);this.charts=config.rewards.map(chart);this.stars=[...new Map(this.charts.flatMap(shape=>shape.points).map(([x,y])=>[x.toFixed(3)+','+y.toFixed(3),[x*29,y*29-3]])).values()];for(let count=0;count<=config.threshold;count++)for(const [x,y] of countChart(count).points)this.stars.push([x*23,y*23-3]);for(let i=0;i<22;i++){const a=i*2.39996,r=18+((i*13)%23);this.stars.push([Math.cos(a)*r,Math.sin(a)*r-3]);}this.stars=[...new Map(this.stars.map(([x,y])=>[x.toFixed(3)+','+y.toFixed(3),[x,y]])).values()];this.multiplier=1;this.reset();}
 reset(){this.count=0;this.phase='idle';this.index=this.winner=-1;this.flashStars=[];this.heldBall=null;this.frozen=this.game.bonusFrozen=false;}
 event(type){if(type==='new-game'){this.multiplier=1;this.reset();}}
 capture(id){
  if(!this.config.holes.includes(id)||this.frozen)return false;
  if(this.phase==='settled'){this.winner=this.index=-1;this.phase='idle';}
  this.count++;this.game.emit('constellation-progress',{count:this.count,total:this.config.threshold});
  if(this.count<this.config.threshold)return false;
  this.heldBall=this.game.ball;this.phase='count';this.phaseAt=this.clock;this.frozen=this.game.bonusFrozen=true;
  const available=this.config.rewards.map((r,i)=>i).filter(i=>this.config.rewards[i].kind!=='enemy'||!this.game.enemyActive&&!this.game.enemyIntroPending&&!this.game.storyMode);
  const random=Math.max(0,Math.min(.999999,(this.game.random||Math.random)()));
  this.target=available[Math.floor(random*available.length)];this.index=-1;this.nextFlashAt=this.clock+.06;
  this.game.emit('constellation-spin',{count:this.count});return true;
 }
 reward(){
  const g=this.game,r=this.config.rewards[this.winner];
  if(r.kind==='score')g.scoreHit('space-constellation-reward',r.value,0);
  if(r.kind==='multiplier')this.multiplier=r.value;
  if(r.kind==='ball')for(let i=0;i<r.value;i++)g.awardExtraLife('constellation');
  if(r.kind==='multi')for(let i=0;i<r.value;i++)g.awardMultiball();
  if(r.kind==='enemy'&&!g.enemyActive&&!g.enemyIntroPending&&!g.storyMode){g.enemyActive=true;g.emit('enemy-spawn-requested',{group:'space-constellation'});}
  g.emit('bonus-awarded',{source:'space-constellation',position:this.winner+1,kind:r.kind,value:r.value,multiplier:this.multiplier});
 }
 finish(){
  const g=this.game,ball=this.heldBall,previous=g.ball;this.phase='settled';this.count=0;this.frozen=g.bonusFrozen=false;this.heldBall=null;
  if(ball?.state==='captured'&&ball.held){g.ball=ball;const id=ball.held.id;g.release();g.completeConstellationCapture(id);}
  this.reward();g.ball=previous;g.selectBall();
 }
 scatter(){
  const pool=this.stars.map((_,i)=>i),count=Math.min(pool.length,6+Math.floor(Math.random()*14));
  for(let i=0;i<count;i++){const j=i+Math.floor(Math.random()*(pool.length-i));[pool[i],pool[j]]=[pool[j],pool[i]];}
  this.flashStars=pool.slice(0,count);
 }
 update(dt){if(this.game.paused)return;this.clock+=dt;const age=this.clock-this.phaseAt;
  if(this.phase==='count'&&age>=(this.config.countSeconds??.8)){this.phase='spin';this.phaseAt=this.clock;this.scatter();this.nextFlashAt=this.clock+.06;}
  else if(this.phase==='spin'){const t=Math.min(1,age/this.config.spinSeconds);if(t>=1){this.winner=this.index=this.target;this.phase='winflash';this.phaseAt=this.clock;}else if(this.clock>=this.nextFlashAt){this.scatter();this.nextFlashAt=this.clock+.06+.5*t**3;}}
  else if(this.phase==='winflash'&&age>=this.config.winFlashSeconds)this.finish();
 }
 draw(ctx){
  const o=this.geometry;if(!o)return;const age=this.clock-this.phaseAt;
  const attract=this.phase==='idle'&&!this.count?(lights||root.IndicatorLights)?.attractLight(this.game,{x:o.cx,y:o.cy,height:o.r*2,indicator:{group:'constellation'}}):null;
  ctx.save();ctx.translate(o.cx,o.cy);ctx.scale(o.r/54,o.r/54);ctx.lineCap='round';
  ctx.save();ctx.globalAlpha=.42;for(const [x,y] of this.stars)star(ctx,x,y,.65,'#7891a7');ctx.restore();
  if(attract!==null&&attract!==undefined){
   if(attract){const tick=Math.floor(this.game.time*8);for(let i=0;i<this.stars.length;i++)if((i*7+tick)%11<4){const [x,y]=this.stars[i];star(ctx,x,y,1.35,'#effbff');}}
   ctx.restore();return;
  }
  for(let i=0;i<this.config.threshold;i++){const a=(-90+i*360/this.config.threshold)*Math.PI/180,lit=i<this.count;star(ctx,Math.cos(a)*49,Math.sin(a)*49,lit?1.9:1.15,lit?'#ffe6a4':'#527084');}
  if(this.phase==='spin'){for(const i of this.flashStars){const [x,y]=this.stars[i];star(ctx,x,y,1.25,'#effbff');}}
  else if(this.winner>=0){
   const focus=this.winner,lineAlpha=this.phase==='winflash'?Math.max(0,Math.min(1,(age-.35)/.35)):1,outlineAlpha=this.phase==='winflash'?Math.max(0,Math.min(1,(age-.75)/.35)):1;
   ctx.save();ctx.translate(0,-3);if(outlineAlpha>0){ctx.save();ctx.globalAlpha*=outlineAlpha;prizeOutline(ctx,this.config.rewards[focus],this.charts[focus]);ctx.restore();}constellation(ctx,this.charts[focus],0,0,29,true,lineAlpha);ctx.restore();
  }
  else constellation(ctx,countChart(this.count),0,-3,23,true);
  ctx.restore();
 }
}
function createGame(Base){return class extends Base{
 constructor(g){super(g);if(g.gameplay?.spaceConstellation)this.bonus=new Controller(this,g.gameplay.spaceConstellation);}
 reset(){this.enemyActive=false;this.enemyIntroPending=false;super.reset();}
 newBall(preserveTable=false){
  const active=this.enemyActive,pending=this.enemyIntroPending;
  super.newBall(preserveTable);
  if(this.spaceEndlessMode){this.enemyActive=active;this.enemyIntroPending=pending;}
 }
 emit(type,data={}){super.emit(type,data);this.bonus?.event(type,data);}
 beforeStep(dt){return !this.bonusFrozen&&super.beforeStep(dt);}
 rulesInterrupted(){return this.bonusFrozen||super.rulesInterrupted();}
 scoreHit(id,points,cooldown){return super.scoreHit(id,points*(this.bonus?.multiplier||1),cooldown);}
 onCapture(id){if(!this.bonus?.capture(id))super.onCapture(id);}
 completeConstellationCapture(id){super.onCapture(id);}
};}
const api={Controller,createGame,constellation,label};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpaceConstellation=api;
})(globalThis);
