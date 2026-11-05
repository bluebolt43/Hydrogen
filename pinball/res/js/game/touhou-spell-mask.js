/* Transparent visual interference; never changes ball physics or player input. */
(function(root){'use strict';
const DRAW_ANGLE_SCALE=16/Math.PI,DRAW_ANGLE_STEP=Math.PI/16;
const DRAW_ANGLES=Array.from({length:32},(_,i)=>i*DRAW_ANGLE_STEP),DRAW_COS=DRAW_ANGLES.map(a=>{const v=Math.cos(a);return Math.abs(v)<1e-12?0:v;}),DRAW_SIN=DRAW_ANGLES.map(a=>{const v=Math.sin(a);return Math.abs(v)<1e-12?0:v;});
function drawAngleIndex(angle){return Math.round(angle*DRAW_ANGLE_SCALE)&31;}
// Extend a visible straight laser to its forward canvas exit, without moving
// its emitter or bringing an entirely offscreen finite segment into view.
function beamExitScale(beam,aspect){
 let near=0,far=Infinity;
 for(let axis=0;axis<2;axis++){
  const p=axis?beam.y:beam.x,d=axis?beam.dy:beam.dx,pad=beam.width/2*(axis?aspect:1);
  if(Math.abs(d)<1e-12){if(p< -pad||p>1+pad)return 1;continue;}
  const a=(-pad-p)/d,b=(1+pad-p)/d;
  near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));
  if(far<near)return 1;
 }
 return near<=1&&far>1&&Number.isFinite(far)?far:1;
}
class TouhouSpellMask{
 constructor(canvas,{onComplete=()=>{},data=root.TouhouSpellcards,external=false}={}){this.external=external;this.liveSimulation=true;this.densityStride=2;this.renderFPS=60;this.data=data;this.canvas=canvas;this.ctx=canvas.getContext('2d',{willReadFrequently:true});this.onComplete=onComplete;this.elapsed=0;this.active=false;this.paused=false;this.frame=0;this.tick=this.tick.bind(this);}
 start(stage,origin,variant){
  const entry=this.data.bosses.find(c=>c.stage===Number(stage));if(!entry)throw Error('Unknown spell stage '+stage);
  const spells=entry.spells||[entry],sequence=variant===undefined&&spells.length>1;
  if(this.entry&&this.entry!==entry)this.clearBulletRaster();
  this.clear();this.duration=entry.duration??this.data.duration;this.entry=entry;this.cards=sequence?spells:[spells[(variant??0)%spells.length]];this.card=sequence?entry:this.cards[0];this.origin=origin??this.card.origin;this.attacks=sequence&&entry.attackSequence?entry.attackSequence.map(part=>({...part,card:spells[part.spell],origin:origin??spells[part.spell].origin})):null;this.aims=new Map();this.sampleStates=new Map();this.sampleTime=-1;this.elapsed=0;this.lastRenderAt=-Infinity;this.hasRendered=false;this.active=true;this.paused=false;this.last=performance.now();if(!this.external)this.frame=requestAnimationFrame(this.tick);return this.card;
 }

 onEvent(event){if(event.type==='boss-spell')return this.start(event.stage);if(['new-game','boss-defeated','boss-changed'].includes(event.type))this.clear();if(event.type==='pause')this.pause(event.paused);}
 pause(value){if(this.paused===!!value)return;this.paused=!!value;this.last=performance.now();}
 clear(){cancelAnimationFrame(this.frame);this.active=false;if(!this.external)this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
 advance(dt){if(!this.active||this.paused)return;this.elapsed+=Math.max(0,Math.min(.05,dt));if(this.elapsed>=this.duration+(this.entry.castLeadIn??0)&&(!this.naturalDrain||this.card.drainOnEnd===false||!this.remainingParticles)){this.active=false;this.onComplete(this.card);}}
 renderTo(ctx,x,y){if(!this.active)return;const original=this.ctx;ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.rect(0,0,this.canvas.width,this.canvas.height);ctx.clip();this.ctx=ctx;try{this.render(this.elapsed);}finally{this.ctx=original;ctx.restore();}}
 tick(now){
  if(!this.active)return;
  const dt=Math.max(0,Math.min(.05,(now-this.last)/1000));this.last=Math.max(this.last,now);if(!this.paused)this.elapsed+=dt;
  // Moving spells follow display frames. A paused spell does not repaint
  // an unchanged frame; low-rate rendering remains available for comparison.
  if(!this.hasRendered||this.lastRenderWidth!==this.canvas.width||this.lastRenderHeight!==this.canvas.height||(!this.paused&&(this.renderFPS>=60||now-this.lastRenderAt>=1000/this.renderFPS-.1))){
   this.render(this.elapsed);this.lastRenderAt=this.hasRendered&&Number.isFinite(this.lastRenderAt)?this.lastRenderAt+Math.max(1,Math.floor((now-this.lastRenderAt+.1)/(1000/this.renderFPS)))*(1000/this.renderFPS):now;this.lastRenderWidth=this.canvas.width;this.lastRenderHeight=this.canvas.height;this.hasRendered=true;
  }
  if(this.elapsed>=this.duration+(this.entry.castLeadIn??0)&&(!this.naturalDrain||this.card.drainOnEnd===false||!this.remainingParticles)){this.clear();this.onComplete(this.card);return;}
  this.frame=requestAnimationFrame(this.tick);
 }

 render(t){
  const {canvas,ctx:c,card}=this;if(!card)return;
  const castTime=t,lead=this.entry.castLeadIn??0;t-=lead;
  if(t<0){this.remainingParticles=0;if(this.webglRenderer){this.webglRenderer.aura(this,castTime,lead);return;}if(!this.external)c.clearRect(0,0,canvas.width,canvas.height);this.drawCurrentAura(castTime,lead);return;}
  // Duo bosses take turns firing; earlier bullets keep their original paths.
  const span=this.duration/this.cards.length;
  const sampleKey=[this.origin?.x,this.origin?.y,canvas.width,canvas.height,this.densityStride,this.data.densityStride,this.liveSimulation].join(':');
  if(t<this.sampleTime||sampleKey!==this.sampleKey)this.sampleStates.clear();
  this.sampleTime=t;this.sampleKey=sampleKey;
  const fade=this.naturalDrain?Math.min(1,t/.35):Math.min(1,t/.35,Math.max(0,(this.duration-t)/.8));
  const sample={bullets:[],beams:[]};
  for(let index=0;index<(this.attacks??this.cards).length;index++){
   const attack=this.attacks?.[index],spell=attack?.card??this.cards[index],offset=attack?.start??index*span,localTime=t-offset,origin=attack?.origin??this.origin;
   if(localTime<0)continue;
   if(!this.sampleStates.has(index))this.sampleStates.set(index,{retired:new Set(),stride:spell.densityStride??this.entry.densityStride??this.data.densityStride??this.densityStride,leafRows:spell.emissionRows??this.entry.emissionRows,leafArms:spell.emissionArms??this.entry.emissionArms,turnAfter:spell.turnAfter??this.entry.turnAfter,rowDensity:spell.emissionRowDensity??this.entry.emissionRowDensity??1,rowStride:spell.emissionRowStride??this.entry.emissionRowStride??1,densityByFamily:spell.particleDensityByFamily??this.entry.particleDensityByFamily??{},density:spell.particleDensity??this.entry.particleDensity??1});
   const state=this.sampleStates.get(index),targetAt=time=>{
    const key=index+':'+time;if(!this.aims.has(key))this.aims.set(key,this.targetProvider?.(offset+time)??{x:.5,y:.9});
    return this.aims.get(key);
   },emissionUntil=attack?attack.end-offset:index<this.cards.length-1?span:this.naturalDrain?this.duration-offset:Infinity;
   if(!('simulation' in state))state.simulation=this.liveSimulation&&root.TouhouSpellPatterns.createSimulation?.(spell.pattern,{duration:this.duration-offset,origin,aspect:canvas.width/canvas.height,targetAt,emissionUntil,stride:state.stride,rowStride:state.rowStride,rowDensity:state.rowDensity,leafRows:state.leafRows,leafArms:state.leafArms,turnAfter:state.turnAfter,density:state.density,densityByFamily:state.densityByFamily,onRetire:id=>state.retired.add(id),retireAboveViewport:spell.pattern==='leaf-veiling',retireOutsideViewport:!['icicle-fall','leaf-veiling','gray-thaumaturgy'].includes(spell.pattern)})||null;
   const part=state.simulation?state.simulation.step(localTime):root.TouhouSpellPatterns.sample(spell.pattern,localTime,origin,canvas.width/canvas.height,targetAt,emissionUntil,state);
   const radiusScale=spell.bulletRadiusScale??this.entry.bulletRadiusScale??1;
   for(const b of part.bullets){
    b.drawRadius=b.radius*radiusScale;b.drawRadiusPixels=b.drawRadius*canvas.width;
    b.drawX=Math.round(b.x*canvas.width);b.drawY=Math.round(b.y*canvas.height);b.drawExtent=Math.ceil(b.drawRadiusPixels);
    b.drawAngleIndex=['round','orb','bubble','glow'].includes(b.kind)?0:drawAngleIndex(b.angle);
   }
   sample.bullets.push(...part.bullets);sample.beams.push(...part.beams);
  }

  this.remainingParticles=sample.bullets.length+sample.beams.length;
  if(this.webglRenderer){this.webglRenderer.renderMask(this,sample,fade,castTime,lead);return;}
  if(!this.external)c.clearRect(0,0,canvas.width,canvas.height);c.save();
  if(lead)this.drawCurrentAura(castTime,lead);
  // Pixel coordinates keep round bullets round and laser widths constant even
  // when the combined stage/table canvas changes aspect ratio.
  // All projectile images use native pixels and nearest sampling. The saved
  // context keeps aura and caller state independent of projectile rendering.
  c.imageSmoothingEnabled=false;
  const leafBase=this.entry.pattern==='leaf-veiling'?c.getTransform():null;
  if(this.leafRasterCache)this.leafRasterCache.createdThisFrame=0;
  // Paint new atlas cells before any drawImage reads the atlas this frame,
  // avoiding repeated copy-on-write snapshots of the large source canvas.
  if(leafBase){
   this.leafRasterDrawing=false;
   for(const b of sample.bullets){
    if(!b.headingFixed||b.kind!=='leaf'||b.drawX+b.drawExtent<0||b.drawX-b.drawExtent>canvas.width||b.drawY+b.drawExtent<0||b.drawY-b.drawExtent>canvas.height)continue;
    this.leafRaster(b,b.color,b.drawRadiusPixels,DRAW_ANGLES[b.drawAngleIndex]);
    if(this.leafRasterCache?.createdThisFrame>=8)break;
   }
   this.leafRasterDrawing=true;
  }
  const graySprites=this.entry.pattern==='gray-thaumaturgy'&&fade===1;
  if(this.grayRasterCache)this.grayRasterCache.createdThisFrame=0;
  if(graySprites){
   this.grayRasterDrawing=false;
   for(const b of sample.bullets){
    if((b.kind!=='round'&&b.kind!=='rice')||(b.alpha??1)!==1||b.drawX+b.drawExtent<0||b.drawX-b.drawExtent>canvas.width||b.drawY+b.drawExtent<0||b.drawY-b.drawExtent>canvas.height)continue;
    this.grayRaster(b,b.kind,b.color,b.drawRadiusPixels,DRAW_ANGLES[b.drawAngleIndex]);
    if(this.grayRasterCache?.createdThisFrame>=8)break;
   }
   this.grayRasterDrawing=true;
  }
  const iceSprites=this.entry.pattern==='icicle-fall';
  const rasterBullets=!['leaf-veiling','gray-thaumaturgy'].includes(this.entry.pattern)&&(fade===1||['release-of-id','shanghai-dolls','rainbow-wind-chime','killing-doll'].includes(this.entry.pattern));
  if(this.bulletRasterCache)this.bulletRasterCache.createdThisFrame=0;
  this.bulletRasterDrawing=false;
  if(rasterBullets)for(const b of sample.bullets){
   if(!b.rasterRotation&&(fade!==1||(b.alpha??1)!==1||!b.headingFixed&&!iceSprites&&!['round','orb','bubble','glow'].includes(b.kind))||b.drawX+b.drawExtent<0||b.drawX-b.drawExtent>canvas.width||b.drawY+b.drawExtent<0||b.drawY-b.drawExtent>canvas.height)continue;
   this.bulletRaster(b,b.kind,b.color,b.drawRadiusPixels,DRAW_ANGLES[b.drawAngleIndex]);
   if(this.bulletRasterCache?.createdThisFrame>=8)break;
  }
  this.bulletRasterDrawing=true;
  const fastBase=['water-elf','shanghai-dolls','release-of-id','magical-r360'].includes(this.entry.pattern)?c.getTransform():null;
  let fastTransformed=false;
  let leafTransformed=false,leafColor,leafRadius,leafSprite;
  let bulletAlpha;
  for(const b of sample.bullets){
   const {kind,color}=b,index=b.drawAngleIndex,angle=DRAW_ANGLES[index],r=b.drawRadiusPixels,px=b.drawX,py=b.drawY;
   if((b.alpha??1)===0||b.drawX+b.drawExtent<0||b.drawX-b.drawExtent>canvas.width||b.drawY+b.drawExtent<0||b.drawY-b.drawExtent>canvas.height)continue;
   const alpha=fade*(b.alpha??1);if(alpha!==bulletAlpha){c.globalAlpha=alpha;bulletAlpha=alpha;}
   if(rasterBullets&&(b.rasterRotation||fade===1&&(b.alpha??1)===1&&(iceSprites||b.headingFixed||['round','orb','bubble','glow'].includes(kind)))){
    const tile=this.bulletRaster(b,kind,color,r,angle);
    if(tile){if(fastTransformed){c.setTransform(fastBase);fastTransformed=false;}const dx=px-tile.pad,dy=py-tile.pad;c.drawImage(tile.canvas,tile.x,tile.y,tile.side,tile.side,dx,dy,tile.pad*2,tile.pad*2);continue;}
   }
   // A4..B8 share glyphs. Reuse their unrotated sprite and set the affine
   // transform directly, avoiding per-particle Canvas save/rotate/restore.
   // Partially transparent round/rice/fire retain the original stroked rim.
   if(fastBase&&(!['round','orb','rice','fire'].includes(kind)||fade*(b.alpha??1)===1)){
    const tile=this.sprite(kind,color,r);
    if(tile){
     // Circular glyphs have no heading. Rotating their raster makes CPU
     // Canvas resample a large square without changing the intended shape.
     const circular=kind==='bubble'||kind==='round'||kind==='orb'||kind==='glow';
     const m=fastBase,co=circular?1:DRAW_COS[index],si=circular?0:DRAW_SIN[index];
     c.setTransform(m.a*co+m.c*si,m.b*co+m.d*si,m.c*co-m.a*si,m.d*co-m.b*si,m.a*px+m.c*py+m.e,m.b*px+m.d*py+m.f);
     c.drawImage(tile.canvas,-tile.pad,-tile.pad,tile.pad*2,tile.pad*2);fastTransformed=true;continue;
    }
   }
   if(fastTransformed){c.setTransform(fastBase);fastTransformed=false;}
   if(kind==='leaf'&&leafBase){
    if(b.headingFixed){
     const tile=this.leafRaster(b,color,r,angle);
     if(tile){
      if(leafTransformed){c.setTransform(leafBase);leafTransformed=false;}
      c.drawImage(tile.canvas,tile.x,tile.y,tile.side,tile.side,px-tile.pad,py-tile.pad,tile.pad*2,tile.pad*2);continue;
     }
    }
    if(color!==leafColor||r!==leafRadius){leafSprite=this.sprite(kind,color,r);leafColor=color;leafRadius=r;}
    if(leafSprite){
     const co=DRAW_COS[index],si=DRAW_SIN[index],m=leafBase;
     c.setTransform(m.a*co+m.c*si,m.b*co+m.d*si,m.c*co-m.a*si,m.d*co-m.b*si,m.a*px+m.c*py+m.e,m.b*px+m.d*py+m.f);
     c.drawImage(leafSprite.canvas,-leafSprite.pad,-leafSprite.pad,leafSprite.pad*2,leafSprite.pad*2);leafTransformed=true;continue;
    }
   }
   if(leafTransformed){c.setTransform(leafBase);leafTransformed=false;}
   if(graySprites&&(kind==='round'||kind==='rice')&&(b.alpha??1)===1){
    const tile=this.grayRaster(b,kind,color,r,angle);
    if(tile){c.drawImage(tile.canvas,tile.x,tile.y,tile.side,tile.side,px-tile.pad,py-tile.pad,tile.pad*2,tile.pad*2);continue;}
   }
   if(kind==='capsule'||kind==='round'||kind==='orb'||kind==='rice'||kind==='fire'){
    this.drawBullet(c,kind,color,r,px,py,angle);continue;
   }
   c.save();c.translate(px,py);c.rotate(angle);
   const sprite=kind==='petal'||kind==='leaf'||kind==='glow'||kind==='bubble'||this.entry.rasterGlyphs&&fade*(b.alpha??1)===1?this.sprite(kind,color,r):null;
   if(sprite)c.drawImage(sprite.canvas,-sprite.pad,-sprite.pad,sprite.pad*2,sprite.pad*2);
   else if(kind==='round'||kind==='orb'||kind==='rice'||kind==='fire'||kind==='leaf'||typeof Path2D==='undefined')this.drawBullet(c,kind,color,r);
   else for(const step of this.shape(kind,color,r)){
    if(step.stroke){c.strokeStyle=step.color;c.lineWidth=step.width;c.stroke(step.path);}
    else{c.fillStyle=step.color;c.fill(step.path);}
   }
   c.restore();
  }
  if(fastTransformed)c.setTransform(fastBase);
  if(leafTransformed)c.setTransform(leafBase);
  this.leafRasterDrawing=false;this.grayRasterDrawing=false;this.bulletRasterDrawing=false;
  for(const beam of sample.beams){
   if(beam.taper){
    const x=beam.x*canvas.width,y=beam.y*canvas.height,dx=beam.dx*canvas.width,dy=beam.dy*canvas.height,length=Math.hypot(dx,dy)||1,half=beam.width*canvas.width/2,nx=-dy/length*half,ny=dx/length*half;
    c.save();c.globalAlpha=fade*beam.alpha;
    for(const scale of beam.core?[1,.55]:[1]){c.fillStyle=scale===1?beam.color:'#fffaff';c.beginPath();c.moveTo(x,y);c.lineTo(x+dx+nx*scale,y+dy+ny*scale);c.lineTo(x+dx-nx*scale,y+dy-ny*scale);c.closePath();c.fill();}
    c.restore();continue;
   }
   const extent=this.beamExtent(beam);
   c.save();c.globalAlpha=fade*beam.alpha;c.lineWidth=beam.width*canvas.width;c.strokeStyle=beam.color;c.beginPath();c.moveTo(beam.x*canvas.width,beam.y*canvas.height);c.lineTo((beam.x+beam.dx*extent)*canvas.width,(beam.y+beam.dy*extent)*canvas.height);c.stroke();
   if(beam.core){c.lineWidth=beam.width*canvas.width*.55;c.strokeStyle='#fffaff';c.stroke();}c.restore();
  }
  c.restore();
 }

 beamExtent(beam){return this.extendBeamsToViewport?beamExitScale(beam,this.canvas.width/this.canvas.height):1;}
 activeCast(t){
  const lead=this.entry.castLeadIn??0;let active;
  for(const attack of this.attacks??[])if(t>=attack.start&&t<attack.end+lead)active=attack;
  return active;
 }
 drawCurrentAura(t,lead){
  if(!this.attacks){this.drawCastAura(t,lead);return;}
  const attack=this.activeCast(t);if(attack)this.drawCastAura(t-attack.start,lead,attack.origin,attack.end-attack.start);
 }
 drawCastAura(t,lead,origin=this.origin??this.card.origin,duration=this.duration){
  if(this.entry.castAura==='hexagram'){
   const color=this.entry.castAuraColor??'#ffffff',ring=this.sprite('magic-ring',color,64),star=this.sprite('magic-star',color,64);if(!ring||!star)return;
   const c=this.ctx,w=this.canvas.width,o=origin??{x:.5,y:.12},size=w*.3*(ring.pad/64);
   c.save();c.translate(o.x*w,o.y*this.canvas.height);c.globalAlpha=Math.max(0,Math.min(1,t/.3,(duration+lead-t)/.4))*.75;
   c.drawImage(ring.canvas,-size/2,-size/2,size,size);
   c.rotate(t*.22);c.drawImage(star.canvas,-size/2,-size/2,size,size);c.restore();return;
  }
  if(this.entry.castAura!=='ice-crystal')return;
  const sprite=this.sprite('ice-circle','#9bdfff',64);if(!sprite)return;
  const c=this.ctx,w=this.canvas.width,o=this.origin??this.card.origin??{x:.5,y:.18},u=Math.min(1,t/lead),size=w*.3*(sprite.pad/64)*(.55+.45*(1-Math.pow(1-u,3)));
  c.save();c.translate(o.x*w,o.y*this.canvas.height);c.rotate(t*.22);c.globalAlpha=Math.min(1,t/.25)*.7;
  c.drawImage(sprite.canvas,-size/2,-size/2,size,size);c.restore();
 }

 drawBullet(c,kind,color,r,x=0,y=0,angle=0){
  if(kind==='magic-ring'||kind==='magic-star'){
   c.save();c.strokeStyle=color;c.lineJoin='round';
   // Bake the soft coloured edge once; no runtime blur or shadow.
   for(const [width,alpha] of [[.065,.12],[.035,.25],[.018,.95]]){
    c.lineWidth=r*width;c.globalAlpha=alpha;c.beginPath();
    if(kind==='magic-ring'){
     for(const q of [.94,.86]){c.moveTo(r*q,0);c.arc(0,0,r*q,0,Math.PI*2);}
    }else for(let triangle=0;triangle<2;triangle++){
     for(let i=0;i<3;i++){const a=-Math.PI/2+triangle*Math.PI/3+i*Math.PI*2/3,px=Math.cos(a)*r*.86,py=Math.sin(a)*r*.86;if(i)c.lineTo(px,py);else c.moveTo(px,py);}c.closePath();
    }
    c.stroke();
   }
   c.restore();return;
  }
  if(kind==='ice-circle'){
   c.strokeStyle=color;c.fillStyle='#dff6ff';c.lineWidth=r*.018;
   c.beginPath();c.arc(0,0,r*.94,0,Math.PI*2);c.arc(0,0,r*.86,0,Math.PI*2);c.stroke();
   for(let i=0;i<6;i++){
    c.save();c.rotate(i*Math.PI/3);
    c.beginPath();c.moveTo(0,0);c.lineTo(r*.8,0);
    for(const q of [.3,.5,.67]){c.moveTo(r*q,-r*.12);c.lineTo(r*(q-.12),0);c.lineTo(r*q,r*.12);}c.stroke();
    c.beginPath();c.moveTo(r*.95,0);c.lineTo(r*1.12,-r*.055);c.lineTo(r*1.25,0);c.lineTo(r*1.12,r*.055);c.closePath();c.stroke();
    c.rotate(Math.PI/6);c.beginPath();c.moveTo(r*.68,0);c.lineTo(r*.43,-r*.1);c.lineTo(r*.34,0);c.lineTo(r*.43,r*.1);c.closePath();c.stroke();
    c.beginPath();c.moveTo(r*.75,-r*.025);c.lineTo(r*.8,0);c.lineTo(r*.75,r*.025);c.stroke();c.restore();
   }
   c.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6,rr=r*(i%2?.43:.8);c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();c.stroke();return;
  }
  if(kind==='capsule'){
   c.fillStyle=color;c.beginPath();c.ellipse(x,y,r,r*.43,angle,0,Math.PI*2);c.fill();c.fillStyle='#fffaff';c.beginPath();c.ellipse(x,y,r*.78,r*.27,angle,0,Math.PI*2);c.fill();return;
  }
  if(kind==='petal'){
   for(const scale of [1,.64]){const q=r*scale;c.fillStyle=scale===1?color:'#fff2ff';c.beginPath();c.moveTo(q,0);c.bezierCurveTo(-q*.2,-q*.9,-q*1.15,-q*.65,-q*.75,0);c.bezierCurveTo(-q*1.15,q*.65,-q*.2,q*.9,q,0);c.closePath();c.fill();}return;
  }
  if(kind==='leaf'){
   for(const scale of [1,.76]){
    const q=r*scale;c.fillStyle=scale===1?color:'#edfff4';c.beginPath();c.moveTo(q,0);
    c.lineTo(-q*.08,-q*.7);c.lineTo(-q,0);c.lineTo(q*.08,q*.7);c.closePath();c.fill();
   }return;
  }
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
   else if(kind==='bubble'){const g=c.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'#18003a');g.addColorStop(.36,color);g.addColorStop(.72,'#fffaff');g.addColorStop(.86,'#fffaff');g.addColorStop(.94,color);g.addColorStop(1,color+'00');c.fillStyle=g;c.arc(0,0,r,0,Math.PI*2);c.fill();return;}
   else if(kind==='glow'){const g=c.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'#fff8ee');g.addColorStop(.35,color);g.addColorStop(1,'#ff718500');c.fillStyle=g;c.arc(0,0,r,0,Math.PI*2);}
   else c.ellipse(0,0,r,kind==='fire'?r*.5:r*.35,0,0,Math.PI*2);
   c.fill();c.stroke();c.fillStyle='#fffaff';c.beginPath();
   if(kind==='star'){for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,rr=k%2?r*.28:r*.7;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();}
   else if(kind==='ice')c.ellipse(r*.05,0,r*.67,r*.2,0,0,Math.PI*2);
   else if(kind==='butterfly'){c.ellipse(-r*.45,0,r*.3,r*.5,-.5,0,Math.PI*2);c.ellipse(r*.45,0,r*.3,r*.5,.5,0,Math.PI*2);}
   else if(kind==='heart'){const q=r*.76;c.moveTo(q,0);c.bezierCurveTo(-q*.1,-q*1.4,-q*1.4,-q*.7,-q*.55,0);c.bezierCurveTo(-q*1.4,q*.7,-q*.1,q*1.4,q,0);c.closePath();}
   else if(kind==='arrow'){const q=r*.67;c.moveTo(q,0);c.lineTo(-q*.75,-q*.7);c.lineTo(-q*.25,0);c.lineTo(-q*.75,q*.7);c.closePath();}
   else if(kind==='knife'){const q=r*.72;c.moveTo(q*1.5,0);c.lineTo(-q*.65,-q*.32);c.lineTo(-q*1.1,0);c.lineTo(-q*.65,q*.32);c.closePath();}
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

 leafRaster(b,color,r,angle){
  if(typeof document==='undefined')return null;
  const angleIndex=b.drawAngleIndex??drawAngleIndex(angle);angle=DRAW_ANGLES[angleIndex];
  // Keep native glyphs and integer headings within the bounded atlas budget.
  const pad=Math.ceil(r+2),side=pad*2,atlasSide=1024,atlasBytes=atlasSide*atlasSide*4;
  if(side>atlasSide)return null;
  const cache=this.leafRasterCache??={entries:new Map(),atlases:[],bytes:0,limit:8*1024*1024,nextSlot:0,createdThisFrame:0};
  if(cache.side!==side){
   for(const old of cache.entries.values())old.tile=null;cache.entries.clear();
   for(const atlas of cache.atlases)atlas.canvas.width=atlas.canvas.height=0;
   cache.atlases=[];cache.bytes=0;cache.nextSlot=0;cache.side=side;cache.columns=Math.floor(atlasSide/side);cache.slotsPerAtlas=cache.columns*cache.columns;cache.capacity=cache.slotsPerAtlas*Math.floor(cache.limit/atlasBytes);
  }
  if(!cache.capacity)return null;
  const hints=this.leafRasterHints??=new WeakMap();let entry=hints.get(b);
  if(entry&&entry.r===r&&entry.color===color&&entry.angleIndex===angleIndex&&entry.tile)return entry.tile;
  const key=color+':'+r+':'+angleIndex;entry=cache.entries.get(key);
  if(!entry){
   if(this.leafRasterDrawing||cache.createdThisFrame>=8)return null;
   let slot;
   while(cache.entries.size>=cache.capacity){const k=cache.entries.keys().next().value,old=cache.entries.get(k);cache.entries.delete(k);slot=old.slot;old.tile=null;}
   if(slot===undefined)slot=cache.nextSlot++;
   const index=Math.floor(slot/cache.slotsPerAtlas),cell=slot%cache.slotsPerAtlas,x=(cell%cache.columns)*side,y=Math.floor(cell/cache.columns)*side;
   let atlas=cache.atlases[index];
   if(!atlas){const canvas=document.createElement('canvas');canvas.width=canvas.height=atlasSide;atlas={canvas,ctx:canvas.getContext('2d',{willReadFrequently:true})};cache.atlases[index]=atlas;cache.bytes+=atlasBytes;}
   const c=atlas.ctx,co=DRAW_COS[angleIndex],si=DRAW_SIN[angleIndex];c.setTransform(1,0,0,1,0,0);c.clearRect(x,y,side,side);c.setTransform(co,si,-si,co,x+pad,y+pad);this.drawBullet(c,'leaf',color,r);
   entry={r,color,angle,angleIndex,slot,tile:{canvas:atlas.canvas,x,y,side,pad}};cache.entries.set(key,entry);cache.createdThisFrame++;
  }
  hints.set(b,entry);return entry.tile;
 }

 grayRaster(b,kind,color,r,angle){
  if(typeof document==='undefined')return null;
  const pad=Math.ceil(r+1.6),side=pad*2,maxRadius=Math.max(r,3.8*this.canvas.width/384*(this.entry?.bulletRadiusScale??1)),cell=2**Math.ceil(Math.log2(Math.max(32,Math.ceil(maxRadius+1.6)*2)));if(cell>128)return null;
  const angleIndex=kind==='round'?0:(b.drawAngleIndex??drawAngleIndex(angle));angle=DRAW_ANGLES[angleIndex];
  let cache=this.grayRasterCache;
  if(!cache){const canvas=document.createElement('canvas');canvas.width=canvas.height=512;cache=this.grayRasterCache={entries:new Map(),canvas,ctx:canvas.getContext('2d',{willReadFrequently:true}),bytes:512*512*4,limit:512*512*4,nextSlot:0,cell,capacity:(512/cell)**2,createdThisFrame:0};}
  if(cache.cell!==cell){
   for(const old of cache.entries.values())old.tile=null;
   cache.entries.clear();cache.ctx.clearRect(0,0,512,512);cache.nextSlot=0;cache.cell=cell;cache.capacity=(512/cell)**2;
  }
  const hints=this.grayRasterHints??=new WeakMap();let entry=hints.get(b);
  if(entry&&entry.kind===kind&&entry.color===color&&entry.r===r&&entry.angleIndex===angleIndex&&entry.tile)return entry.tile;
  const key=kind+':'+color+':'+r+':'+angleIndex;entry=cache.entries.get(key);
  if(!entry){
   if(this.grayRasterDrawing||cache.createdThisFrame>=8)return null;
   let slot;
   while(cache.entries.size>=cache.capacity){const k=cache.entries.keys().next().value,old=cache.entries.get(k);cache.entries.delete(k);slot=old.slot;old.tile=null;}
   if(slot===undefined)slot=cache.nextSlot++;
   const columns=512/cell,x=(slot%columns)*cell,y=Math.floor(slot/columns)*cell,c=cache.ctx,co=DRAW_COS[angleIndex],si=DRAW_SIN[angleIndex];
   c.setTransform(1,0,0,1,0,0);c.clearRect(x,y,cell,cell);c.setTransform(co,si,-si,co,x+pad,y+pad);this.drawBullet(c,kind,color,r);
   entry={kind,color,r,angle,angleIndex,slot,tile:{canvas:cache.canvas,x,y,side,pad}};cache.entries.set(key,entry);cache.createdThisFrame++;
  }
  hints.set(b,entry);return entry.tile;
 }

 paintHeart(c,color,r,angle,pad,scale,x=0,y=0){
  // Keep the original margin for Bezier control points while painting, then
  // copy the transparent border away. Directly painting into the tight cell
  // changes Skia clipping at the first atlas row/column.
  const wide=Math.ceil(r*1.7+2),needed=wide*2*scale;if(needed>256)return false;
  let scratch=this.heartScratch;
  if(!scratch){const canvas=document.createElement('canvas');scratch=this.heartScratch={canvas,ctx:canvas.getContext('2d',{willReadFrequently:true})};canvas.width=canvas.height=0;}
  const size=Math.max(64,2**Math.ceil(Math.log2(needed)));
  if(scratch.canvas.width<size)scratch.canvas.width=scratch.canvas.height=size;
  const t=scratch.ctx;t.setTransform(1,0,0,1,0,0);t.clearRect(0,0,scratch.canvas.width,scratch.canvas.height);
  const co=Math.cos(angle),si=Math.sin(angle);t.setTransform(scale*co,scale*si,-scale*si,scale*co,wide*scale,wide*scale);this.drawBullet(t,'heart',color,r);
  c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.imageSmoothingEnabled=false;
  c.drawImage(scratch.canvas,(wide-pad)*scale,(wide-pad)*scale,pad*2*scale,pad*2*scale,x,y,pad*2*scale,pad*2*scale);return true;
 }

 clearBulletRaster(){if(this.heartScratch){this.heartScratch.canvas.width=this.heartScratch.canvas.height=0;this.heartScratch=null;}if(this.bulletRasterCache){for(const e of this.bulletRasterCache.entries.values())e.tile=null;this.bulletRasterCache.entries.clear();for(const a of this.bulletRasterCache.atlases)a.canvas.width=a.canvas.height=0;this.bulletRasterCache.atlases=[];this.bulletRasterCache.bytes=0;this.bulletRasterCache=null;}this.bulletRasterHints=null;}

 bulletRaster(b,kind,color,r,angle){
  if(typeof document==='undefined')return null;
  const angleIndex=['round','orb','bubble','glow'].includes(kind)?0:(b.drawAngleIndex??drawAngleIndex(angle));angle=DRAW_ANGLES[angleIndex];
  // Heart curves stay inside their radius; reserve only the stroked rim.
  const pad=Math.ceil(kind==='knife'?r*1.5+4.8:r*(['arrow','star'].includes(kind)?1.7:1)+1.6);
  const scale=1,side=pad*2,moon=this.entry?.pattern==='invisible-full-moon';
  if(side>128)return null;
  // A5 shares tightly packed native cells between capsules and small rings.
  // Separate power-of-two pools leave most pixels idle while capsules thrash.
  const cell=moon?Math.max(side,2*Math.ceil(6.5*this.canvas.width/384*(this.entry.bulletRadiusScale??1)+1.6)):side<=32?32:side<=64?64:128;
  if(moon&&this.bulletRasterCache?.poolCell!==undefined&&this.bulletRasterCache.poolCell!==cell)this.clearBulletRaster();
  const cache=this.bulletRasterCache??={entries:new Map(),atlases:[],bytes:0,limit:8*1024*1024,createdThisFrame:0},hints=this.bulletRasterHints??=new WeakMap();
  if(moon)cache.poolCell=cell;
  let entry=hints.get(b);if(entry&&entry.kind===kind&&entry.color===color&&entry.r===r&&entry.angleIndex===angleIndex&&entry.tile)return entry.tile;
  const key=kind+':'+color+':'+r+':'+angleIndex;entry=cache.entries.get(key);
  if(!entry){
   if(this.bulletRasterDrawing||cache.createdThisFrame>=8)return null;
   let atlas=cache.atlases.find(a=>a.cell===cell&&a.nextSlot<a.capacity),slot;
   if(!atlas&&cache.bytes+4*1024*1024<=cache.limit){const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;atlas={canvas,ctx:canvas.getContext('2d',{willReadFrequently:true}),cell,columns:Math.floor(1024/cell),capacity:Math.floor(1024/cell)**2,nextSlot:0};cache.atlases.push(atlas);cache.bytes+=4*1024*1024;}
   if(atlas)slot=atlas.nextSlot++;
   else{let victim;for(const pair of cache.entries){const old=pair[1];if(old.atlas.cell!==cell)continue;victim??=pair;if(!old.rasterRotation){victim=pair;break;}}if(!victim)return null;const [k,old]=victim;atlas=old.atlas;slot=old.slot;old.tile=null;cache.entries.delete(k);}
   const x=(slot%atlas.columns)*cell,y=Math.floor(slot/atlas.columns)*cell,c=atlas.ctx,co=DRAW_COS[angleIndex],si=DRAW_SIN[angleIndex];
   c.setTransform(1,0,0,1,0,0);c.clearRect(x,y,cell,cell);if(kind==='heart'){if(!this.paintHeart(c,color,r,angle,pad,scale,x,y))return null;}else{c.setTransform(scale*co,scale*si,-scale*si,scale*co,x+pad*scale,y+pad*scale);this.drawBullet(c,kind,color,r);}
   entry={kind,color,r,angle,angleIndex,atlas,slot,rasterRotation:!!b.rasterRotation,tile:{canvas:atlas.canvas,x,y,side,pad}};cache.entries.set(key,entry);cache.createdThisFrame++;
  }
  hints.set(b,entry);return entry.tile;
 }

 sprite(kind,color,r){
  if(typeof document==='undefined')return null;
  const key=kind+':'+color+':'+r;
  this.sprites??=new Map();
  if(this.sprites.has(key))return this.sprites.get(key);
  const ice=kind==='ice-circle',magic=kind==='magic-ring'||kind==='magic-star',leaf=kind==='leaf',tight=kind==='petal'||kind==='bubble'||kind==='heart'&&Math.ceil(r*1.7+2)*2<=256,pad=Math.ceil(kind==='knife'?r*1.5+4.8:r*(leaf||magic||tight?1:ice?1.28:1.7)+(leaf?1:2)),scale=ice||magic?1.25:1,canvas=document.createElement('canvas');
  canvas.width=canvas.height=Math.ceil(pad*2*scale);
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.scale(scale,scale);ctx.translate(pad,pad);
  if(kind!=='heart'||!this.paintHeart(ctx,color,r,0,pad,scale))this.drawBullet(ctx,kind,color,r);
  const sprite={canvas,pad};
  if(this.sprites.size>=128)this.sprites.delete(this.sprites.keys().next().value);
  this.sprites.set(key,sprite);return sprite;
 }

 destroy(){this.clear();this.clearBulletRaster();if(this.sprites){for(const sprite of this.sprites.values())sprite.canvas.width=sprite.canvas.height=0;this.sprites.clear();this.sprites=null;}if(this.leafRasterCache){for(const entry of this.leafRasterCache.entries.values())entry.tile=null;this.leafRasterCache.entries.clear();for(const atlas of this.leafRasterCache.atlases)atlas.canvas.width=atlas.canvas.height=0;this.leafRasterCache.atlases=[];this.leafRasterCache.bytes=0;this.leafRasterCache=null;}this.leafRasterHints=null;if(this.grayRasterCache){for(const entry of this.grayRasterCache.entries.values())entry.tile=null;this.grayRasterCache.entries.clear();this.grayRasterCache.canvas.width=this.grayRasterCache.canvas.height=0;this.grayRasterCache.bytes=0;this.grayRasterCache=null;}this.grayRasterHints=null;}
}
root.TouhouSpellMask=TouhouSpellMask;
})(window);
