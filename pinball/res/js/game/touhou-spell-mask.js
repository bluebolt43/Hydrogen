/* Transparent visual interference; never changes ball physics or player input. */
(function(root){'use strict';
class TouhouSpellMask{
 constructor(canvas,{onComplete=()=>{},data=root.TouhouSpellcards}={}){this.liveSimulation=true;this.densityStride=2;this.renderFPS=60;this.data=data;this.canvas=canvas;this.ctx=canvas.getContext('2d');this.onComplete=onComplete;this.elapsed=0;this.active=false;this.paused=false;this.frame=0;this.tick=this.tick.bind(this);}
 start(stage,origin,variant){
  const entry=this.data.bosses.find(c=>c.stage===Number(stage));if(!entry)throw Error('Unknown spell stage '+stage);
  const spells=entry.spells||[entry],sequence=variant===undefined&&spells.length>1;
  this.clear();this.entry=entry;this.cards=sequence?spells:[spells[(variant??0)%spells.length]];this.card=sequence?entry:this.cards[0];this.origin=origin??this.card.origin;this.aims=new Map();this.sampleStates=new Map();this.sampleTime=-1;this.elapsed=0;this.lastRenderAt=-Infinity;this.hasRendered=false;this.active=true;this.paused=false;this.last=performance.now();this.frame=requestAnimationFrame(this.tick);return this.card;
 }

 onEvent(event){if(event.type==='boss-spell')return this.start(event.stage);if(['new-game','boss-defeated','boss-changed'].includes(event.type))this.clear();if(event.type==='pause')this.pause(event.paused);}
 pause(value){if(this.paused===!!value)return;this.paused=!!value;this.last=performance.now();}
 clear(){cancelAnimationFrame(this.frame);this.active=false;this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
 tick(now){
  if(!this.active)return;
  const dt=Math.max(0,Math.min(.05,(now-this.last)/1000));this.last=Math.max(this.last,now);if(!this.paused)this.elapsed+=dt;
  // Moving spells follow display frames. A paused spell does not repaint
  // an unchanged frame; low-rate rendering remains available for comparison.
  if(!this.hasRendered||this.lastRenderWidth!==this.canvas.width||this.lastRenderHeight!==this.canvas.height||(!this.paused&&(this.renderFPS>=60||now-this.lastRenderAt>=1000/this.renderFPS-.1))){
   this.render(this.elapsed);this.lastRenderAt=this.hasRendered&&Number.isFinite(this.lastRenderAt)?this.lastRenderAt+Math.max(1,Math.floor((now-this.lastRenderAt+.1)/(1000/this.renderFPS)))*(1000/this.renderFPS):now;this.lastRenderWidth=this.canvas.width;this.lastRenderHeight=this.canvas.height;this.hasRendered=true;
  }
  if(this.elapsed>=this.data.duration&&(!this.naturalDrain||!this.remainingParticles)){this.clear();this.onComplete(this.card);return;}
  this.frame=requestAnimationFrame(this.tick);
 }

 render(t){
  const {canvas,ctx:c,card}=this;if(!card)return;
  // Duo bosses take turns firing; earlier bullets keep their original paths.
  const span=this.data.duration/this.cards.length;
  const sampleKey=[this.origin?.x,this.origin?.y,canvas.width,canvas.height,this.densityStride,this.data.densityStride,this.liveSimulation].join(':');
  if(t<this.sampleTime||sampleKey!==this.sampleKey)this.sampleStates.clear();
  this.sampleTime=t;this.sampleKey=sampleKey;
  const fade=this.naturalDrain?Math.min(1,t/.35):Math.min(1,t/.35,Math.max(0,(this.data.duration-t)/.8));
  const sample={bullets:[],beams:[]};
  for(let index=0;index<this.cards.length;index++){
   const spell=this.cards[index],offset=index*span,localTime=t-offset;
   if(localTime<0)continue;
   if(!this.sampleStates.has(index))this.sampleStates.set(index,{retired:new Set(),stride:spell.densityStride??this.entry.densityStride??this.data.densityStride??this.densityStride,density:spell.particleDensity??this.entry.particleDensity??1});
   const state=this.sampleStates.get(index),targetAt=time=>{
    const key=spell.pattern+':'+time;if(!this.aims.has(key))this.aims.set(key,this.targetProvider?.(offset+time)??{x:.5,y:.9});
    return this.aims.get(key);
   },emissionUntil=index<this.cards.length-1?span:this.naturalDrain?this.data.duration-offset:Infinity;
   if(!('simulation' in state))state.simulation=this.liveSimulation&&root.TouhouSpellPatterns.createSimulation?.(spell.pattern,{duration:this.data.duration-offset,origin:this.origin,aspect:canvas.width/canvas.height,targetAt,emissionUntil,stride:state.stride,density:spell.particleDensity??1,onRetire:id=>state.retired.add(id)})||null;
   const part=state.simulation?state.simulation.step(localTime):root.TouhouSpellPatterns.sample(spell.pattern,localTime,this.origin,canvas.width/canvas.height,targetAt,emissionUntil,state);
   sample.bullets.push(...part.bullets);sample.beams.push(...part.beams);
  }

  this.remainingParticles=sample.bullets.length+sample.beams.length;
  c.clearRect(0,0,canvas.width,canvas.height);c.save();
  // Pixel coordinates keep round bullets round and laser widths constant even
  // when the combined stage/table canvas changes aspect ratio.
  for(const b of sample.bullets){
   const {x,y,kind,color,angle}=b,r=b.radius*canvas.width;
   if((b.alpha??1)===0||x+b.radius<0||x-b.radius>1||y+r/canvas.height<0||y-r/canvas.height>1)continue;
   if(kind==='round'||kind==='orb'||kind==='rice'||kind==='fire'){
    c.globalAlpha=fade*(b.alpha??1);this.drawBullet(c,kind,color,r,x*canvas.width,y*canvas.height,angle);continue;
   }
   c.save();c.translate(x*canvas.width,y*canvas.height);c.rotate(angle);c.globalAlpha=fade*(b.alpha??1);
   const sprite=kind==='glow'||this.entry.rasterGlyphs&&fade*(b.alpha??1)===1?this.sprite(kind,color,r):null;
   if(sprite)c.drawImage(sprite.canvas,-sprite.pad,-sprite.pad,sprite.pad*2,sprite.pad*2);
   else if(kind==='round'||kind==='orb'||kind==='rice'||kind==='fire'||typeof Path2D==='undefined')this.drawBullet(c,kind,color,r);
   else for(const step of this.shape(kind,color,r)){
    if(step.stroke){c.strokeStyle=step.color;c.lineWidth=step.width;c.stroke(step.path);}
    else{c.fillStyle=step.color;c.fill(step.path);}
   }
   c.restore();
  }
  for(const beam of sample.beams){
   c.save();c.globalAlpha=fade*beam.alpha;c.lineWidth=beam.width*canvas.width;c.strokeStyle=beam.color;c.beginPath();c.moveTo(beam.x*canvas.width,beam.y*canvas.height);c.lineTo((beam.x+beam.dx)*canvas.width,(beam.y+beam.dy)*canvas.height);c.stroke();
   if(beam.core){c.lineWidth=beam.width*canvas.width*.55;c.strokeStyle='#fffaff';c.stroke();}c.restore();
  }
  c.restore();
 }

 drawBullet(c,kind,color,r,x=0,y=0,angle=0){
  const merge=(kind==='round'||kind==='orb'||kind==='rice'||kind==='fire')&&c.globalAlpha===1,rim=merge?.6:0;
  c.fillStyle=color;if(!merge){c.strokeStyle=color;c.lineWidth=1.2;}c.beginPath();
  // The coloured rim is filled with the body instead of stroking every
  // moving ellipse. Preserve its outer extent and the white core.
  if(kind==='round'||kind==='orb'){
   c.arc(x,y,r+rim,0,Math.PI*2);c.fill();if(!merge)c.stroke();c.fillStyle='#fffaff';c.beginPath();c.arc(x,y,r*.68,0,Math.PI*2);c.fill();c.fillStyle=color;c.beginPath();c.arc(x,y,r*.37,0,Math.PI*2);c.fill();return;
  }
  if(kind==='rice'||kind==='fire'){
   c.ellipse(x,y,r+rim,(kind==='fire'?r*.5:r*.35)+rim,angle,0,Math.PI*2);c.fill();if(!merge)c.stroke();c.fillStyle='#fffaff';c.beginPath();c.ellipse(x,y,r*.65,r*.2,angle,0,Math.PI*2);c.fill();return;
  }

   if(kind==='star'){for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,rr=k%2?r*.43:r;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();}
   else if(kind==='ice'){c.moveTo(r,0);c.lineTo(r*.25,-r*.45);c.lineTo(-r,-r*.3);c.lineTo(-r*.7,r*.35);c.lineTo(r*.25,r*.45);c.closePath();}
   else if(kind==='butterfly'){c.moveTo(0,0);c.bezierCurveTo(-r*1.4,-r*1.4,-r*1.5,r*.6,0,r*.5);c.bezierCurveTo(r*1.5,r*.6,r*1.4,-r*1.4,0,0);}
   else if(kind==='arrow'){c.moveTo(r,0);c.lineTo(-r*.75,-r*.7);c.lineTo(-r*.25,0);c.lineTo(-r*.75,r*.7);c.closePath();}
   else if(kind==='knife'){c.moveTo(r*1.5,0);c.lineTo(-r*.65,-r*.32);c.lineTo(-r*1.1,0);c.lineTo(-r*.65,r*.32);c.closePath();}
   else if(kind==='heart'){c.moveTo(r,0);c.bezierCurveTo(-r*.1,-r*1.4,-r*1.4,-r*.7,-r*.55,0);c.bezierCurveTo(-r*1.4,r*.7,-r*.1,r*1.4,r,0);c.closePath();}
   else if(kind==='glow'){const g=c.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'#fff8ee');g.addColorStop(.35,color);g.addColorStop(1,'#ff718500');c.fillStyle=g;c.arc(0,0,r,0,Math.PI*2);}
   else c.ellipse(0,0,r,kind==='fire'?r*.5:r*.35,0,0,Math.PI*2);
   c.fill();c.stroke();c.fillStyle='#fffaff';c.beginPath();
   if(kind==='star'){for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,rr=k%2?r*.28:r*.7;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();}
   else if(kind==='ice')c.ellipse(r*.05,0,r*.67,r*.2,0,0,Math.PI*2);
   else if(kind==='butterfly'){c.ellipse(-r*.45,0,r*.3,r*.5,-.5,0,Math.PI*2);c.ellipse(r*.45,0,r*.3,r*.5,.5,0,Math.PI*2);}
   else c.ellipse(0,0,r*.65,r*.2,0,0,Math.PI*2);
   c.fill();
 }
 shape(kind,color,r){
  const key=kind+':'+color+':'+r;
  this.shapes??=new Map();
  if(this.shapes.has(key))return this.shapes.get(key);
  let path;const steps=[],recorder={
   beginPath(){path=new Path2D();},
   fill(){steps.push({path,color:this.fillStyle});},
   stroke(){steps.push({path,color:this.strokeStyle,width:this.lineWidth,stroke:true});}
  };
  for(const name of ['moveTo','lineTo','closePath','arc','ellipse','bezierCurveTo'])recorder[name]=(...args)=>path[name](...args);
  this.drawBullet(recorder,kind,color,r);
  if(this.shapes.size>=128)this.shapes.delete(this.shapes.keys().next().value);
  this.shapes.set(key,steps);return steps;
 }

 sprite(kind,color,r){
  if(typeof document==='undefined')return null;
  const key=kind+':'+color+':'+r;
  this.sprites??=new Map();
  if(this.sprites.has(key))return this.sprites.get(key);
  const pad=Math.ceil(r*1.7+2),canvas=document.createElement('canvas');
  canvas.width=canvas.height=pad*4;
  const ctx=canvas.getContext('2d');ctx.scale(2,2);ctx.translate(pad,pad);
  this.drawBullet(ctx,kind,color,r);
  const sprite={canvas,pad};
  if(this.sprites.size>=128)this.sprites.delete(this.sprites.keys().next().value);
  this.sprites.set(key,sprite);return sprite;
 }

 destroy(){this.clear();}
}
root.TouhouSpellMask=TouhouSpellMask;
})(window);
