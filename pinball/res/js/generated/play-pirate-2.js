/* Shared sound player. HTMLAudio keeps direct file:// playtests supported. */
(function(root){
'use strict';
class SoundBank {
 constructor(clips,{AudioClass=root.Audio,now=()=>performance.now()}={}){
  this.enabled=true;this.paused=false;this.unlocked=false;this.now=now;this.clips=new Map();
  for(const [name,clip] of Object.entries(clips)){
   const voices=Array.from({length:clip.voices||3},()=>{const audio=new AudioClass(clip.src);audio.preload='auto';audio.volume=clip.volume??1;return {audio,token:0};});
   this.clips.set(name,{...clip,voices,last:-Infinity,next:0});
  }
 }
 unlock(){
  if(this.unlocked)return;this.unlocked=true;
  // Warm the actual reusable elements during the input gesture (mobile audio).
  for(const clip of this.clips.values())for(const voice of clip.voices){
   const token=++voice.token;voice.audio.volume=0;
   Promise.resolve(voice.audio.play()).then(()=>{
    if(voice.token!==token)return;voice.audio.pause();voice.audio.currentTime=0;voice.audio.volume=clip.volume??1;
   }).catch(()=>{if(voice.token===token)voice.audio.volume=clip.volume??1;});
  }
 }
 play(name){
  const clip=this.clips.get(name),time=this.now();
  if(!clip||!this.enabled||this.paused||!this.unlocked||time-clip.last<(clip.interval??0))return false;
  clip.last=time;
  const voice=clip.voices.find(v=>v.audio.paused||v.audio.ended)||clip.voices[clip.next++%clip.voices.length];
  voice.token++;voice.audio.pause();voice.audio.currentTime=0;voice.audio.volume=clip.volume??1;
  Promise.resolve(voice.audio.play()).catch(()=>{});return true;
 }
 stop(){for(const clip of this.clips.values()){clip.last=-Infinity;for(const voice of clip.voices){voice.token++;voice.audio.pause();voice.audio.currentTime=0;}}}
 setEnabled(enabled){this.enabled=!!enabled;if(!this.enabled)this.stop();}
 setPaused(paused){if(this.paused===!!paused)return;this.paused=!!paused;if(this.paused)this.stop();}
}
if(typeof module!=='undefined'&&module.exports)module.exports=SoundBank;else root.PinballSound=SoundBank;
})(typeof window!=='undefined'?window:globalThis);

/* TFlipperEdge and its maths ray helpers, adapted from alula/SpaceCadetPinball
 * 0bc12d3ca97a30a61e1e325cfde1eeec379bb9b9 (MIT).
 * Copyright (c) 2020-2021 Andrey Muzychenko.
 * Runs in original world coordinates; the adapter reflects X and scales by 21.
 * Keep the source's motion/contact branches, including backside damping.
 */
(function(root){
'use strict';
const FAR=1e9,SCALE=21;
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],mul=(a,k)=>[a[0]*k,a[1]*k];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1],mag=a=>Math.hypot(...a),unit=a=>mul(a,1/(mag(a)||1));
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0],world=p=>[-p[0]/SCALE,p[1]/SCALE],layout=p=>[-p[0]*SCALE,p[1]*SCALE];
function line(a,b){const d=unit(sub(b,a));if(Math.abs(d[0])<1e-9)d[0]=0;const axis=d[0]===0?1:0;return {d,n:[d[1],-d[0]],c:-d[1]*a[0]+d[0]*a[1],lo:Math.min(a[axis],b[axis]),hi:Math.max(a[axis],b[axis]),axis};}
function rayLine(ray,l){const divisor=dot(l.n,ray.d);if(divisor>=0)return FAR;const t=-(dot(ray.p,l.n)+l.c)/divisor;if(t< -ray.min||t>ray.max)return FAR;const p=add(ray.p,mul(ray.d,t));if(p[l.axis]<l.lo||p[l.axis]>l.hi)return FAR;l.hit=p;return t;}
function rayCircle(ray,c,r){const delta=sub(c,ray.p),along=dot(delta,ray.d);if(along<0)return FAR;const d2=dot(delta,delta),det=r*r-d2+along*along;if(d2<r*r)return along-Math.sqrt(det);if(det<0)return FAR;const t=along-Math.sqrt(det);return t<0||t>ray.max?FAR:t;}
class SpaceCadetFlipper{
 constructor(f,config){
  this.f=f;this.origin=world(f.pivot);this.tip=world(f.tip);this.raised=world(f.raised);
  const a=unit(sub(this.tip,this.origin)),b=unit(sub(this.raised,this.origin));
  this.angleMax=Math.acos(Math.max(-1,Math.min(1,dot(a,b))))*(cross(a,b)<0?-1:1);
  this.flag=0;this.angle1=0;this.angle2=0;this.inputTime=0;this.stopTime=0;this.angleMult=0;this.edgeCollision=false;this.pressed=false;
  this.configure(config);
 }
 configure(c){
  this.upSeconds=c.flipperSeconds;this.downSeconds=c.flipperReturnSeconds;this.elasticity=c.flipperElasticity;this.smoothness=c.flipperSmoothness;this.collisionMult=c.flipperBoostScale;
  this.baseRadius=(this.f.radii[0]+c.ballRadius)/SCALE;this.tipRadius=(this.f.radii[1]+c.ballRadius)/SCALE;
  this.distanceDiv=mag(sub(this.tip,this.origin))+this.tipRadius;
  this.timeAdvance=Math.min(this.upSeconds,this.downSeconds)/(2*mag(sub(this.tip,this.raised))/this.tipRadius);
  const axis=unit(sub(this.tip,this.origin)),normal=[-axis[1],axis[0]];
  this.a2=add(this.origin,mul(normal,this.baseRadius));this.a1=add(this.tip,mul(normal,this.tipRadius));
  this.b1=sub(this.origin,mul(normal,this.baseRadius));this.b2=sub(this.tip,mul(normal,this.tipRadius));
  if(this.angleMax<0){[this.a1,this.b1]=[this.b1,this.a1];[this.a2,this.b2]=[this.b2,this.a2];}
 }
 angle(time){
  if(!this.flag)return this.angle1;
  const duration=Math.abs((this.angle1-this.angle2)/this.angleMax*this.angleMult);
  let fraction=duration>=1e-7?(time-this.inputTime)/duration:1;fraction=Math.max(0,Math.min(1,fraction));
  if(this.flag===2)fraction=1-fraction;return fraction*this.angleMax;
 }
 motion(pressed,time){
  if(pressed===this.pressed)return;this.pressed=pressed;this.angle2=this.angle(time);
  this.angle1=pressed?this.angleMax:0;this.angleMult=pressed?this.upSeconds:this.downSeconds;
  if(!this.flag)this.inputTime=time;this.flag=pressed?1:2;this.stopTime=this.angleMult+this.inputTime;
 }
 points(time){
  const angle=this.angle(time),s=Math.sin(angle),c=Math.cos(angle),rotate=p=>{const q=sub(p,this.origin);return add(this.origin,[c*q[0]-s*q[1],s*q[0]+c*q[1]]);};
  this.A1=rotate(this.a1);this.A2=rotate(this.a2);this.B1=rotate(this.b1);this.B2=rotate(this.b2);this.T1=rotate(this.tip);
  this.lineA=line(this.A1,this.A2);this.lineB=line(this.B1,this.B2);
 }
 inside(p){
  const polygon=[this.A1,this.A2,this.B1,this.B2],inside=polygon.every((a,i)=>cross(sub(polygon[(i+1)%4],a),sub(p,a))>=0);
  if(!inside&&mag(sub(p,this.origin))>this.baseRadius&&mag(sub(p,this.T1))>=this.tipRadius)return 0;
  const sign=this.angleMax<0?-1:1,test=this.flag===1?(sign<0?this.B1:this.B2):this.flag===2?(sign<0?this.A2:this.A1):this.T1;
  return cross(sub(this.origin,test),sub(p,test))*sign<0?4:5;
 }
 distance(ray){
  let best={distance:FAR};
  for(const item of [{l:this.lineA},{c:this.origin,r:this.baseRadius},{c:this.T1,r:this.tipRadius},{l:this.lineB}]){
   const distance=item.l?rayLine(ray,item.l):rayCircle(ray,item.c,item.r);
   if(distance<best.distance){const p=item.l?[...item.l.hit]:add(ray.p,mul(ray.d,distance));best={distance,p,n:item.l?[...item.l.n]:unit(sub(p,item.c))};}
  }
  return best;
 }
 find(p,v,time,dt){
  const velocity=world(v),speed=mag(velocity),ray={p:world(p),d:unit(velocity),min:.002,max:speed*dt};
  if(time>this.stopTime)this.flag=0;
  if(this.edgeCollision){this.edgeCollision=false;return null;}
  this.push=false;this.backside=false;
  const finish=(hit,distance=hit.distance)=>{
   if(!hit.p||distance>=FAR)return null;
   this.contact=hit.p;this.normal=hit.n;
   return {t:speed>1e-9?Math.max(0,Math.min(1,distance/(speed*dt))):0,depth:0,n:[-hit.n[0],hit.n[1]],position:layout(hit.p),distance:distance*SCALE};
  };
  if(!this.flag){
   this.points(time);const side=this.inside(ray.p);
   if(!side){const hit=this.distance(ray);if(hit.distance===0&&hit.p)hit.p=sub(hit.p,mul(ray.d,1e-5));return finish(hit);}
   let direction;
   if(mag(sub(ray.p,this.origin))>=this.baseRadius*1.01){
    if(mag(sub(ray.p,this.T1))>=this.tipRadius*1.01)direction=mul(side===4?this.lineA.n:this.lineB.n,-1);
    else direction=unit(sub(this.T1,ray.p));
   }else direction=unit(sub(this.origin,ray.p));
   const cast=d=>this.distance({...ray,p:sub(ray.p,mul(d,5)),d,max:ray.max+10});
   let hit=cast(direction);if(hit.distance>=FAR){direction=unit(sub(this.origin,ray.p));hit=cast(direction);}
   if(hit.distance>=FAR)return null;hit.p=sub(hit.p,mul(direction,1e-5));return finish(hit,0);
  }
  let position=[...ray.p];
  // Source sampling intentionally advances by ray direction * timeAdvance.
  for(let t=time;t<time+dt;t+=this.timeAdvance){
   this.points(t);const side=this.inside(position);
   if(side){
    let perpendicular;
    if(this.flag===1&&side!==5)perpendicular=this.lineA.n;
    else if(this.flag!==2||side===4){
     this.backside=true;const d=unit(sub(this.origin,position));
     const hit=this.distance({...ray,p:sub(position,mul(d,5)),d,max:ray.max+10});
     if(hit.distance>=FAR)return finish({p:position,n:mul(d,-1)},0);
     hit.p=sub(hit.p,mul(d,1e-5));return finish(hit,0);
    }else perpendicular=this.lineB.n;
    this.push=true;this.perpendicular=[...perpendicular];const d=mul(perpendicular,-1);
    const hit=this.distance({...ray,p:sub(ray.p,mul(d,5)),d,max:ray.max+10});
    if(hit.distance>=FAR)return null;hit.p=sub(hit.p,mul(d,1e-5));return finish(hit,0);
   }
   const hit=this.distance({...ray,max:ray.max*this.timeAdvance});
   if(hit.distance<FAR){
    hit.p=sub(hit.p,mul(ray.d,1e-5));this.perpendicular=[...(this.flag===2?this.lineB.n:this.lineA.n)];
    this.push=this.flag===2?this.angleMax<=0:this.angleMax>0;return finish(hit);
   }
   position=add(position,mul(ray.d,this.timeAdvance));
  }
  return null;
 }
 response(){
  this.edgeCollision=true;
  const distance=mag(sub(this.contact,this.origin));let elasticity=this.elasticity,boost=0;
  if(!this.flag||!this.backside||this.push){
   if(this.push&&distance*distance>this.baseRadius*this.baseRadius*1.01)
    boost=Math.max(0,dot(this.perpendicular,this.normal))*distance/this.distanceDiv*(Math.abs(this.angleMax)/this.angleMult)*this.collisionMult*SCALE;
  }else if(distance*distance>this.baseRadius*this.baseRadius*1.01)elasticity=(1-distance/this.distanceDiv)*elasticity;
  return {elasticity,smoothness:this.smoothness,boost,threshold:boost>0?-1:1e9};
 }
}
if(typeof module!=='undefined'&&module.exports)module.exports=SpaceCadetFlipper;else root.SpaceCadetFlipper=SpaceCadetFlipper;
})(typeof window!=='undefined'?window:globalThis);

/* Basic collision response ported from SpaceCadetPinball maths::basic_collision.
 * Copyright (c) 2020-2021 Andrey Muzychenko. MIT; see embedded/third-party LICENSE.
 * Continuous collision detection, browser simulation and layer handling below
 * are this prototype's implementation, not a port of the complete engine.
 */
(function(root){
'use strict';
const CadetFlipper=typeof module!=='undefined'&&module.exports?require('./space-cadet-flipper.js'):root.SpaceCadetFlipper;
const EPS=1e-6, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]], sub=(a,b)=>[a[0]-b[0],a[1]-b[1]], mul=(a,k)=>[a[0]*k,a[1]*k];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1], cross=(a,b)=>a[0]*b[1]-a[1]*b[0], len=a=>Math.hypot(...a), unit=a=>mul(a,1/(len(a)||1));
const mix=(a,b,t)=>add(a,mul(sub(b,a),t));
function nearest(p,a,b){const ab=sub(b,a),t=clamp(dot(sub(p,a),ab)/(dot(ab,ab)||1),0,1);return {p:mix(a,b,t),t};}
function inside(p,poly){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++) {const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
// Preserve the original direction normalization and speed-loss rule. This is
// deliberately not replaced with the simpler v -= (1+e)*dot(v,n)*n formula.
function basicCollision(velocity,normal,elasticity=.82,smoothness=.96,threshold=1e9,boost=0){
 let speed=len(velocity);if(speed===0)return threshold<=0?mul(normal,boost):[0,0];
 let direction=mul(velocity,1/speed),projection=-dot(normal,direction);
 if(projection<0)projection=-projection;
 else direction=unit(add(mul(add(direction,mul(normal,projection)),smoothness),mul(normal,projection*elasticity)));
 const reboundSpeed=projection*speed;speed-=(1-elasticity)*reboundSpeed;
 let result=mul(direction,speed);if(reboundSpeed>=threshold)result=add(result,mul(normal,boost));return result;
}
// maths::ray_intersect_circle: retain negative entry distance for an inside ray.
function circleHit(p,d,c,r){
 const length=len(d);if(!length)return null;const direction=mul(d,1/length),delta=sub(c,p),along=dot(delta,direction);
 if(along<0)return null;const square=dot(delta,delta),det=r*r-square+along*along;
 if(det<0)return null;const distance=along-Math.sqrt(det);
 if(square>=r*r&&(distance<0||distance>length))return null;
 const position=add(p,mul(direction,distance));return {t:distance/length,distance,position,n:unit(sub(position,c)),depth:0};
}
// TLine ray test, in layout coordinates. Pirate editor lines have two exposed
// faces; each face uses the source one-sided test and .002 world-unit tolerance.
function segmentHit(p,d,a,b,r){
 const length=len(d),axis=sub(b,a),span=len(axis);if(!length)return null;if(!span)return circleHit(p,d,a,r);
 const tangent=mul(axis,1/span),normal=[-tangent[1],tangent[0]],direction=mul(d,1/length);let best=null;
 for(const sign of [-1,1]){
  const n=mul(normal,sign),divisor=dot(n,direction);if(divisor>=0)continue;
  const distance=(r-dot(sub(p,a),n))/divisor;if(distance<-.002*21||distance>length)continue;
  const position=add(p,mul(direction,distance)),along=dot(sub(position,a),tangent);if(along<0||along>span)continue;
  const h={t:distance/length,distance,position,n,depth:0};if(!best||distance<best.distance)best=h;
 }
 for(const c of [a,b]){const h=circleHit(p,d,c,r);if(h&&(!best||h.distance<best.distance))best=h;}return best;
}
// Convex hull of unequal end circles: shared by the visible flipper and CCD.
function taperedGeometry(a,b,ra,rb){
 const axis=unit(sub(b,a)),perp=[-axis[1],axis[0]],q=clamp((ra-rb)/len(sub(b,a)),-1,1),h=Math.sqrt(1-q*q);
 const n1=add(mul(axis,q),mul(perp,h)),n2=sub(mul(axis,q),mul(perp,h));
 return {sides:[[add(a,mul(n1,ra)),add(b,mul(n1,rb)),n1],[add(a,mul(n2,ra)),add(b,mul(n2,rb)),n2]],angle:Math.atan2(axis[1],axis[0]),spread:Math.acos(q)};
}
function taperedOutline(a,b,ra,rb){
 const {angle,spread}=taperedGeometry(a,b,ra,rb),points=[];
 for(const [center,r,start,end]of [[a,ra,angle+spread,angle+2*Math.PI-spread],[b,rb,angle-spread,angle+spread]])
  for(let i=0;i<=24;i++){const t=start+(end-start)*i/24;points.push(add(center,[Math.cos(t)*r,Math.sin(t)*r]));}
 return points;
}
function taperedHit(p,d,a,b,ra,rb,r){
 const {sides}=taperedGeometry(a,b,ra,rb),outline=taperedOutline(a,b,ra,rb);
 if(inside(p,outline)){
  let best=null;for(const [center,radius]of [[a,ra],[b,rb]]){const n=unit(sub(p,center)),q=add(center,mul(n,radius));
   // Use only exposed cap arcs, excluding the interior of the hull.
   const t=dot(sub(q,a),unit(sub(b,a)));if(center===a?t<dot(sub(sides[0][0],a),unit(sub(b,a))):t>dot(sub(sides[0][1],a),unit(sub(b,a)))){
    const depth=len(sub(q,p))+r;if(!best||depth<best.depth)best={t:0,n,depth};}}
  for(const [start,end,n]of sides){const q=nearest(p,start,end).p,depth=len(sub(q,p))+r;if(!best||depth<best.depth)best={t:0,n,depth};}return best;
 }
 let best=null;for(const hit of [circleHit(p,d,a,ra+r),circleHit(p,d,b,rb+r),...sides.map(([a,b])=>segmentHit(p,d,a,b,r))])if(hit&&(!best||hit.t<best.t))best=hit;
 return best;
}
class Grid {
 constructor(edges){this.map=new Map();this.size=24;for(const e of edges){const pts=e.c?[e.c,e.c]:[e.a,e.b],r=(e.r||0)+5;
  for(let x=Math.floor((Math.min(pts[0][0],pts[1][0])-r)/24);x<=Math.floor((Math.max(pts[0][0],pts[1][0])+r)/24);x++)for(let y=Math.floor((Math.min(pts[0][1],pts[1][1])-r)/24);y<=Math.floor((Math.max(pts[0][1],pts[1][1])+r)/24);y++){const k=x+','+y;if(!this.map.has(k))this.map.set(k,[]);this.map.get(k).push(e);}}
 }
 query(p,d,padding=5){const found=new Set();for(let x=Math.floor((Math.min(p[0],p[0]+d[0])-padding)/24);x<=Math.floor((Math.max(p[0],p[0]+d[0])+padding)/24);x++)for(let y=Math.floor((Math.min(p[1],p[1]+d[1])-padding)/24);y<=Math.floor((Math.max(p[1],p[1]+d[1])+padding)/24);y++)for(const e of this.map.get(x+','+y)||[])found.add(e);return found;}
}
// PINBALL.DAT: ball/500=.3, table/305=[25,.5,pi/2], table/701=.2.
// World distance and velocity are multiplied by 21; time is still seconds.
const CONFIG={
 step:1/60,speedScale:1,worldScale:21,ballRadius:.3*21,maxSpeed:.3*200*21,
 gravity:25*21*Math.sin(.5),verticalGravity:25*21,drag:.2,rampDrag:.2,rampHeight:22,
 elasticity:.5,collisionSmoothness:.8,roughWallElasticity:.6,roughWallSmoothness:.6,
 bumperElasticity:.6,bumperSmoothness:.95,bumperBoost:17*21,upperBumperBoost:12*21,bumperThreshold:2.5*21,bumperCooldown:.1,
 activeElasticity:.6,activeSmoothness:.95,activeBoost:18*21,activeThreshold:1*21,
 flipperSeconds:.04,flipperReturnSeconds:.08,flipperElasticity:.75,flipperSmoothness:.5,flipperBoostScale:.9,
 kickbackSpeed:55*21,wellPull:30*21,wellDrag:1,vortexMode:'eject'
};
class CoreGame {
 constructor(g){this.g=g;this.random=Math.random;this.config={...CONFIG,ballRadius:g.ball_radius};this.input={left:false,right:false,launch:false};this.events=[];this.onEvent=null;this.time=0;this.paused=false;this.cooldowns=new Map();this.grids={};this.build();this.reset();}
 // Map subclasses supply geometry and rules; the engine owns integration/CCD.
 edgeEnabled(){return true;}
 handleCollision(){return false;}
 activeBoost(){return this.config.activeBoost;}
 collisionEffect(){}
 rulesInterrupted(){return false;}
 mapEvent(){}
 onCapture(){}
 beforeStep(){return true;}
 tickRules(){}
 afterBallStep(){}
 afterSubstep(){}
 handleBallState(){return false;}
 resetMapBall(){}
 visualPlane(ball){return ball.layer;}
 get held(){return this.ball.held;}
 set held(value){this.ball.held=value;}
 get lastPortal(){return this.ball.lastPortal??-10;}
 set lastPortal(value){this.ball.lastPortal=value;}
 get trail(){return this.ball.trail||(this.ball.trail=[]);}
 set trail(value){this.ball.trail=value;}
 emit(type,data={}){this.mapEvent(type,data);const e={type,time:this.time,...data};this.events.push(e);if(this.events.length>200)this.events.shift();if(this.onEvent)this.onEvent(e);}
 scoreHit(id,points,cooldown=.12){if((this.cooldowns.get(id)||0)>this.time)return;this.cooldowns.set(id,this.time+cooldown);this.score+=points;this.emit('score',{id,points,position:[...this.ball.p]});this.recordTarget(id);}
 reset(){this.score=0;this.extraLives=0;this.ballNumber=1;this.hasLaunchedOnce=false;this.gameOver=false;this.time=0;this.events=[];this.cooldowns.clear();this.input.left=this.input.right=this.input.launch=false;this.charge=0;this.paused=false;this.newBall();this.emit('new-game');}
 newBall(preserveTable=false){this.lifeLaunched=false;this.ball={p:[this.g.plunger.x,this.g.plunger.rest_y-this.config.ballRadius],v:[0,0],layer:'lower',z:0,state:'ready',immunity:0,saverAvailable:true};this.balls=[this.ball];if(!preserveTable)this.resetMapBall();this.plungerReleasedAt=-10;this.plungerReleaseCharge=0;this.charge=0;this.chargeElapsed=0;this.nudges=0;this.drainTimer=0;this.lastPortal=-10;this.trail=[];if(preserveTable){for(const gate of this.gates){gate.pending=false;gate.pendingBall=null;if(gate.id==='shooter-return')gate.closed=false;}}else{this.resetGates();this.resetTargets();for(const f of this.flippers){f.angle=f.rest;f.omega=0;f.cadet=null;}}}
 limitSpeed(){const speed=len(this.ball.v),cap=Math.min(this.ball.speedLimit||this.config.maxSpeed,this.config.maxSpeed);if(speed>cap)this.ball.v=mul(this.ball.v,cap/speed);}
 chargePower(seconds){const p=this.g.plunger,step=p.charge_step_seconds||0,duration=p.charge_seconds||1;return clamp(step?(Math.floor(seconds/step)+1)*step/duration:seconds/duration,0,1);}
 launch(power=.7){if(this.ball.state!=='ready'||this.gameOver)return;if(this.ball.saverAvailable&&this.ball.saverUntil===undefined)this.ball.saverUntil=this.time+(this.g.gameplay?.ball_saver_seconds||0);this.lifeLaunched=true;this.hasLaunchedOnce=true;this.plungerReleasedAt=this.time;power=clamp(power,0,1);this.plungerReleaseCharge=power;this.ball.state='playing';const p=this.g.plunger,speed=p.launch_min!==undefined?p.launch_min+(p.launch_max-p.launch_min)*power:(640+180*power)*this.config.speedScale;this.ball.speedLimit=this.config.maxSpeed;this.ball.v=[0,-speed*(1+this.random()*.1)];this.limitSpeed();this.emit('launch',{power,speed:len(this.ball.v)});}
 nudge(){if(this.gameOver||this.ball.state!=='playing')return;if(this.nudges>=3){this.emit('tilt');return;}this.nudges++;this.ball.v=add(this.ball.v,[(this.nudges%2?32:-32)*this.config.speedScale,-65*this.config.speedScale]);this.limitSpeed();this.emit('nudge');}
 setBall(p,v=[0,0],layer='lower'){this.ball={p:[...p],v:[...v],layer,z:layer==='lower'?0:22,state:'playing',immunity:0};this.balls=[this.ball];this.gameOver=false;this.paused=false;this.lastPortal=-10;this.limitSpeed();}
 resetGates(){this.gates=this.g.one_way_gates.map(g=>({...g,n:unit(g.normal),closed:false,pending:false,unlocked:false}));}
 updateGates(previous,previousLayer){const b=this.ball,r=this.config.ballRadius;if(previousLayer!==b.layer)return;
  for(const g of this.gates){if(g.unlocked||g.mechanic==='directional_flap'||g.closed||g.layer!==b.layer)continue;const [a,z]=g.points,from=dot(sub(previous,a),g.n),to=dot(sub(b.p,a),g.n);
   if(from<=0&&to>0){const q=mix(previous,b.p,-from/(to-from)),near=nearest(q,a,z);if(len(sub(q,near.p))<.02){g.pending=true;g.pendingBall=b;}}
   if(to<0&&g.pendingBall===b)g.pending=false;
   if(g.pending&&g.pendingBall===b&&to>r+.12&&!this.balls.some(other=>other!==b&&other.state!=='drained'&&other.layer===b.layer&&len(sub(other.p,nearest(other.p,a,z).p))<r+.12)){g.closed=true;g.pending=false;this.emit('gate-closed',{id:g.id});}}
 }
 collide(dt){
  const b=this.ball,r=this.config.ballRadius;let remaining=dt;
  for(let pass=0;pass<10&&remaining>1e-6;pass++){
   this.limitSpeed();
   const d=mul(b.v,remaining),portal=this.portalHit(b.p,d);let best=null;
   for(const e of [...this.grids[b.layer].query(b.p,d,Math.max(5,r)),...this.dynamicEdges()]){
    if(this.targetHits.has(e.id))continue;
    if((e.kind==='plunger'||e.kind==='rescue-kicker')&&d[1]<=0)continue;
    if(!this.edgeEnabled(e))continue;
    // A flap passes forward travel; it blocks reverse travel only after the
    // complete ball has crossed, so it cannot close through a straddling ball.
    if(e.retractUp&&(b.v[1]<0||b.p[1]>e.c[1]))continue;
    if(e.n&&(dot(d,e.n)>=-EPS||dot(sub(b.p,e.a),e.n)<r-.08))continue;
    const h=e.c?circleHit(b.p,d,e.c,r+e.r):segmentHit(b.p,d,e.a,e.b,r+(e.thickness||0)/2);
    if(h&&(!best||h.t<best.t))best={...h,e};
   }
   if(b.layer==='lower')for(const f of this.flippers){
    if(!f.cadet)f.cadet=new CadetFlipper(f,this.config);
    const h=f.cadet.find(b.p,b.v,(this.collisionTime??this.time)+dt-remaining,remaining);
    if(h&&(!best||h.t<best.t))best={...h,e:{id:f.id,kind:'flipper',f}};
   }
   if(portal&&(!best||portal.t<=best.t+1e-5)){b.p=add(b.p,mul(d,portal.t));remaining*=1-portal.t;this.transition(portal);continue;}
   if(!best){b.p=add(b.p,d);break;}
   const hitDistance=best.distance??len(d)*best.t;
   b.p=best.position||add(add(b.p,mul(d,best.t)),mul(best.n,best.depth+.012));
   const e=best.e;if(e.kind==='plunger'&&b.v[1]>0&&best.n[1]<-.5){b.state='ready';b.v=[0,0];b.p[1]=this.g.plunger.rest_y-r;this.charge=0;this.chargeElapsed=0;this.emit('plunger-ready');return;}
   if(this.handleCollision(e)){if(b.state!=='playing')return;remaining-=len(b.v)>1e-9?Math.abs(hitDistance/len(b.v)):remaining;continue;}
   const approach=Math.abs(dot(b.v,best.n)),active=e.kind==='active'||e.mechanic==='active_rebound',c=this.config;
   let boost=0,threshold=1e9,elasticity=e.material==='roughWall'?c.roughWallElasticity:c.elasticity,smoothness=e.material==='roughWall'?c.roughWallSmoothness:c.collisionSmoothness;
   if(e.kind==='bumper'){boost=e.material==='upperBumper'?c.upperBumperBoost:c.bumperBoost;threshold=(this.bumperHitUntil.get(e.id)||0)>this.time?1e9:c.bumperThreshold;elasticity=c.bumperElasticity;smoothness=c.bumperSmoothness;}
   if(active){boost=c.activeBoost;threshold=c.activeThreshold;elasticity=c.activeElasticity;smoothness=c.activeSmoothness;}
   if(e.kind==='flipper')({boost,threshold,elasticity,smoothness}=e.f.cadet.response());
   {b.v=basicCollision(b.v,best.n,elasticity,smoothness,threshold,boost);
    this.collisionEffect(e,approach);
    // TBumper::Fire disables its booster until the 0.1-second timer expires.
    if(e.kind==='bumper'&&approach>threshold){this.bumperHitUntil.set(e.id,this.time+c.bumperCooldown);this.scoreHit(e.id,100*this.bumperLevel(e.id),c.bumperCooldown);}
    if(active||e.kind==='target')this.scoreHit(e.id,50);
    if(e.kind==='flipper'&&boost>10)this.emit('flipper-hit',{id:e.id});
   }
   // pb::collide consumes distance / POST-collision speed; clamp at the next ray.
   remaining-=len(b.v)>1e-9?Math.abs(hitDistance/len(b.v)):remaining;
   if(this.rulesInterrupted())return;
  }
 }
 capture(id,p,release,layer,direction,points){const b=this.ball;if(this.time<b.immunity||b.state!=='playing'||this.balls.some(other=>other!==b&&other.state==='captured'&&other.held?.id===id))return;
  this.held={id,remaining:.65,speed:len(b.v),incoming:[...b.v],release,layer,direction};b.p=[...p];b.state='captured';this.scoreHit(id,points);this.emit('capture',{id});this.onCapture(id);
 }
 release(){const h=this.held,b=this.ball;let speed=clamp(h.speed*.68+90*this.config.speedScale,160*this.config.speedScale,380*this.config.speedScale);b.p=[...h.release];b.layer=h.layer;b.z=0;
  b.v=mul(unit(h.direction),speed);
  b.state='playing';b.immunity=this.time+1.25;this.held=null;this.limitSpeed();this.emit('release',{id:h.id,speed});}
 drain(){if(this.ball.state!=='playing')return;const b=this.ball;if(b.saverAvailable&&this.time<b.saverUntil){b.saverAvailable=false;b.state='saver-return';b.v=[0,0];b.saveReturnAt=this.time+.35;this.emit('ball-saved');return;}this.ball.state='drained';this.drainTimer=1.1;this.emit('drain');}
 selectBall(){this.ball=this.balls.find(b=>b.state==='ready')||this.balls.find(b=>b.state==='playing')||this.balls.find(b=>b.state!=='drained')||this.balls[0];}
 collideBalls(){const r=this.config.ballRadius;
  const clear=(p,layer,ball)=>[...this.grids[layer].query(p,[0,0],Math.max(5,r))].every(e=>!this.edgeEnabled(e,ball)||(e.c?len(sub(p,e.c))>=r+e.r-.01:len(sub(p,nearest(p,e.a,e.b).p))>=r+(e.thickness||0)/2-.01));
  for(let i=0;i<this.balls.length;i++)for(let j=i+1;j<this.balls.length;j++){const a=this.balls[i],b=this.balls[j];
   if(a.state!=='playing'||b.state!=='playing'||a.layer!==b.layer||Math.abs(a.z-b.z)>2*r)continue;
   const delta=sub(b.p,a.p),distance=len(delta);if(distance>=2*r)continue;const n=distance>EPS?mul(delta,1/distance):[1,0],closing=dot(sub(b.v,a.v),n);
   if(closing<0){const impulse=mul(n,-closing*.95);a.v=sub(a.v,impulse);b.v=add(b.v,impulse);}
   const shift=mul(n,(2*r-distance+.012)/2),pa=sub(a.p,shift),pb=add(b.p,shift);
   if(clear(pa,a.layer,a))a.p=pa;if(clear(pb,b.layer,b))b.p=pb;
   for(const ball of [a,b]){const speed=len(ball.v),cap=Math.min(ball.speedLimit||this.config.maxSpeed,this.config.maxSpeed);if(speed>cap)ball.v=mul(ball.v,cap/speed);}
  }
 }
 step(dt=this.config.step){if(this.paused||this.gameOver||this.beforeStep(dt)===false)return;this.time+=dt;this.tickRules(dt);
  if(this.balls.every(b=>b.state==='drained')&&!this.freeBallQueue){this.drainTimer-=dt;if(this.drainTimer<=0){if(this.extraLives>0){this.extraLives--;this.newBall(this.preserveTableOnDrain);this.emit('ready');}else if(this.ballNumber>=3){this.gameOver=true;this.emit('game-over');}else {this.ballNumber++;this.newBall(this.preserveTableOnDrain);this.emit('ready');}}return;}
  for(const b of this.balls)if(b.state==='saver-return'&&this.time>=b.saveReturnAt){
   const spawn=[this.g.plunger.x,this.g.plunger.rest_y-this.config.ballRadius];
   if(this.balls.some(other=>other!==b&&other.state!=='drained'&&other.state!=='saver-return'&&other.layer==='lower'&&(other.state==='ready'||len(sub(other.p,spawn))<this.config.ballRadius*2+3)))continue;
   Object.assign(b,{p:spawn,v:[0,0],state:'ready',layer:'lower',z:0,trail:[],immunity:0,lastPortal:-10,regionPrevious:null,vortexDwell:0});
   this.charge=this.chargeElapsed=0;this.input.launch=false;
   const gate=this.gates.find(g=>g.id==='shooter-return');if(gate){gate.closed=false;gate.pending=false;gate.pendingBall=null;}
   this.emit('ball-save-ready');
  }
  const ready=this.balls.find(b=>b.state==='ready');if(ready){if(this.input.launch){const duration=this.g.plunger.charge_seconds||1;this.chargeElapsed=clamp((this.chargeElapsed||0)+dt,0,duration);this.charge=this.chargePower(this.chargeElapsed);}ready.p[1]=this.g.plunger.rest_y-this.config.ballRadius+this.g.plunger.stroke*this.charge;}
  const frameStart=this.time-dt;
  for(let i=0;i<this.flippers.length;i++){
   const f=this.flippers[i];if(!f.cadet)f.cadet=new CadetFlipper(f,this.config);else f.cadet.configure(this.config);
   f.cadet.motion(!!this.input[f.control||(i?'right':'left')],frameStart);
   const old=f.angle;f.angle=f.rest-f.cadet.angle(this.time);f.omega=(f.angle-old)/dt;
  }
  // pb::timed_frame: velocity += (sum of fields) * dt, without exponential drag.
  for(const b of this.balls)if(b.state==='playing'){
   this.ball=b;this.syncRegion();const {a,drag}=this.field();b.v=add(b.v,mul(sub(a,mul(b.v,drag)),dt));this.limitSpeed();
  }
  // One continuous collision loop per ball per frame (pb::timed_frame).
  // Extra spatial substeps reset flipper edge suppression and apply duplicate boosts.
  const count=1,h=dt;
  for(let k=0;k<count;k++){
   this.collisionTime=frameStart+k*h;
   for(const b of [...this.balls]){this.ball=b;
    if(this.handleBallState(h))continue;
    if(b.state==='captured'){this.held.remaining-=h;if(this.held.remaining<=0)this.release();continue;}
    if(b.state!=='playing')continue;
    this.syncRegion();const previous=[...b.p],layer=b.layer;this.collide(h);if(this.rulesInterrupted())return;const sensorStart=b.relocatedFrom||previous;delete b.relocatedFrom;this.updateGates(sensorStart,layer);this.afterBallStep(sensorStart,layer,h);this.limitSpeed();
   }
   this.collideBalls();this.afterSubstep();
  }
  this.collisionTime=null;
  for(const b of this.balls)if(b.state==='playing'){b.trail||=[];b.trail.push({p:[...b.p],layer:b.layer});if(b.trail.length>24)b.trail.shift();}
  if(this.balls.some(b=>b.state!=='drained'))this.balls=this.balls.filter(b=>b.state!=='drained');this.selectBall();
 }
 advance(seconds){for(let t=0;t<seconds;t+=this.config.step)this.step(Math.min(this.config.step,seconds-t));}
}
const api={CoreGame,Grid,EPS,clamp,cross,CONFIG,taperedGeometry,taperedOutline,taperedHit,basicCollision,segmentHit,circleHit,inside,nearest,unit,sub,add,mul,dot,len,mix};
// Compatibility for existing consumers; new maps subclass CoreGame directly.
let defaultGame;Object.defineProperty(api,'Game',{get(){if(!defaultGame){const map=typeof module!=='undefined'&&module.exports?require('./pirate-map.js'):root.PirateMap;if(!map)throw Error('Load pirate-map.js before creating the pirate game');defaultGame=map.createGame(api);}return defaultGame;}});
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PiratePhysics=api;
})(typeof window!=='undefined'?window:globalThis);

/* Pirate table rules. Geometry and art ordering still come from the layout JSON.
 * createGame(core) keeps this map independent of browser/Node loading order.
 */
(function(root){
'use strict';
function createGame(core){
 const {CoreGame,Grid,EPS,clamp,add,sub,mul,dot,cross,len,unit,mix,nearest,inside,basicCollision}=core;
 return class PirateGame extends CoreGame {
 dynamicEdges(){const p=this.g.plunger;return [...(this.ball.layer==='lower'?[{id:'plunger',kind:'plunger',a:[p.left,p.rest_y],b:[p.right,p.rest_y]}]:[]),...this.gates.filter(g=>!g.unlocked&&g.layer===this.ball.layer&&(g.closed||g.mechanic==='directional_flap')).map(g=>({a:g.points[0],b:g.points[1],id:g.id,kind:'gate',n:g.mechanic==='directional_flap'?g.n:undefined})),...this.directionalEdges(),...(this.ball.layer==='lower'?(this.g.rescue_kickers||[]).map(k=>({id:k.id,kind:'rescue-kicker',a:k.points[0],b:k.points[1],side:k.side,aim:k.aim,direction:k.direction,speed:this.config.kickbackSpeed})):[])];}
 portalHit(p,d){
  let best=null;const b=this.ball,r=this.config.ballRadius;
  for(const t of this.transitions){const entering=b.layer==='lower',leaving=b.layer===t.layer;if(!entering&&!leaving||entering&&t.mode==='exit')continue;
   const n=entering?t.n:mul(t.n,-1),speed=dot(d,n);if(speed<=EPS)continue;
   const from=dot(sub(p,t.mid),n),to=from+speed;
   // The open tavern mouth uses the same center crossing in both directions.
   // Waiting for the trailing edge rejected diagonal exits near an endpoint,
   // leaving an escaped ball on the upper collision mask.
   const plane=t.lip_clearance?(entering?-t.lip_clearance:t.lip_clearance):0;if(from>plane+.0001||to<plane)continue;
   const f=clamp((plane-from)/speed,0,1),q=add(p,mul(d,f)),onMouth=sub(q,mul(n,plane)),near=nearest(onMouth,...t.points),width=len(sub(...t.points));
   if(entering&&(near.t*width<r||(1-near.t)*width<r))continue;
   if(!entering&&len(sub(onMouth,near.p))>r)continue;
   if(!best||f<best.t)best={t:f,portal:t,entering,n};
  }
  // Same-plane head exit is a score sensor; it never changes the layer.
  if(!this.g.layout_preview&&this.time-this.lastPortal>=.04&&b.layer==='lower'&&d[1]>EPS){const points=this.portals.B.points,y=points[0][1];
   if(p[1]<=y&&p[1]+d[1]>=y){const t=(y-p[1])/d[1],x=p[0]+d[0]*t;
    if(x>points[0][0]+r&&x<points[1][0]-r&&(!best||t<best.t))best={t,head:true};}}
  return best;
 }
 transition(hit){const b=this.ball;if(hit.head){this.lastPortal=this.time;this.scoreHit('head-exit',1000);this.emit('head-exit',{position:[...b.p],velocity:[...b.v]});return;}b.layer=hit.entering?hit.portal.layer:'lower';b.z=hit.entering?1:0;this.lastPortal=this.time;this.emit('layer',{id:hit.portal.id,to:b.layer});}
 edgeEnabled(e,ball=this.ball){if(e.launchOnly&&!ball.launchGuard)return false;return !(e.kind==='rescue-kicker'&&!this.kickbacks[e.side]||e.id==='test-post-center'&&!this.centerPostRaised);}
 handleCollision(e){if(e.kind!=='rescue-kicker')return false;this.triggerKickback(e.side,unit(e.direction||sub(e.aim,this.ball.p)),e.speed);return true;}
 activeBoost(){return this.config.activeBoost;}
 collisionEffect(e,approach){
  if(e.launchOnly&&approach>0)this.ball.launchGuard=false;
  if(approach>=8)this.emit('sound',{name:'metal'});
  if(e.kind==='test-post'&&approach>0&&this.centerPostRaised&&this.time-this.centerPostHitAt>=.12){
   this.centerPostHitAt=this.time;this.centerPostHitUntil=this.time+.12;this.centerPostHitsLeft--;
   this.emit('center-post-hit',{remaining:this.centerPostHitsLeft});
   if(this.centerPostHitsLeft===0){this.centerPostRaised=false;this.rolloverHits.clear();this.emit('center-post-down');}
  }
  if((e.kind==='rebound'||e.kind==='active'||e.mechanic==='active_rebound')&&approach>0&&(this.cooldowns.get(e.id)||0)<=this.time)this.reboundHitAt.set(e.id,this.time);
 }
 rulesInterrupted(){return this.theaterFrozen||this.freezeRemaining>0;}
 visualPlane(ball){return ball.layer==='tavern'?'upper':'lower';}
 mapEvent(type,data){
  if(type==='launch')this.ball.launchGuard=true;
  if(['capture','plunger-ready','drain'].includes(type))this.ball.launchGuard=false;
  if(type==='free-ball-launch')this.sharkFlashAt=this.time;
  if(type==='flag-hit'){this.flagHitAt??=new Map();this.flagHitAt.set(data.id,this.time);}
  if(type==='release'){this.holeReleasedAt??=new Map();this.holeReleasedAt.set(data.id,this.time);}
 }
 onCapture(id){const attack=this.g.gameplay?.hole_attacks?.[id];if(['ball','barrel'].includes(attack))this.emit('hole-attack-requested',{id,attack});}
 beforeStep(dt){if(this.theaterFrozen||this.enemyIntroPending)return false;if(this.freezeRemaining>0){this.freezeRemaining=Math.max(0,this.freezeRemaining-dt);if(!this.freezeRemaining)this.emit('enemy-freeze-ended');return false;}return true;}
 tickRules(){this.updateTargetGroups();if(this.krakenAttackAt!==null&&this.time-this.krakenAttackAt>=3.18)this.finishKraken(this.krakenSequence);}
 afterBallStep(previous,layer,dt){if(this.ball.launchGuard&&this.ball.v[1]>=0&&this.ball.p[1]>this.launchGateExitY+this.config.ballRadius)this.ball.launchGuard=false;this.rolloverSensors(previous,layer);this.airdropSensors(previous,layer);this.flagSensors(previous,layer);this.fishSensorCrossings(previous,layer);this.krakenSensors(previous,layer);this.sensors(dt);this.vortexRecovery(dt,layer===this.ball.layer?previous:null);}
 afterSubstep(){this.raiseCenterPost();this.spawnFreeBall();}
 handleBallState(dt){if(!['vortex-return','vortex-held'].includes(this.ball.state))return false;this.vortexRecovery(dt);return true;}
 resetMapBall(){this.kickbacks={left:true,right:true};this.airdropHits=new Set();this.airdropActive=false;this.airdropLanternLit=false;this.airdropFlashUntil=0;this.airdropActivatedAt=null;this.airdropSequence=this.airdropSequence||0;this.rolloverHits=new Set();this.centerPostRaised=false;this.centerPostHitsLeft=0;this.centerPostHitAt=-Infinity;this.centerPostHitUntil=0;this.kickbackHits={left:false,right:false};this.freeBallQueue=0;this.freeBallRewardPositions=[];this.multiballAwards=0;}
 build(){
  const g=this.g;this.launchGateExitY=Math.max(-Infinity,...[...g.lower,...g.upper_parts].filter(o=>o.collisionMode==='launch-only').flatMap(o=>(o.points||[]).map(p=>p[1])));this.fishSensorIds=new Set((g.artLayers||[]).filter(o=>o.bind&&/\/(school|fish-\d+)-[1-7]\.png$/.test(o.src)).map(o=>o.bind));this.fishSensors=[...g.lower,...g.upper_parts].filter(o=>o.kind==='sensor'&&this.fishSensorIds.has(o.id));this.reboundIds=new Set([...g.lower,...g.upper_parts].filter(o=>o.kind==='rebound'||o.kind==='active'||o.mechanic==='active_rebound').map(o=>o.id));this.portals=Object.fromEntries(g.portals.map(p=>[p.id,p]));this.flippers=g.lower.filter(o=>o.kind==='flipper').map(o=>({...o,angle:Math.atan2(o.tip[1]-o.pivot[1],o.tip[0]-o.pivot[0]),rest:Math.atan2(o.tip[1]-o.pivot[1],o.tip[0]-o.pivot[0]),up:Math.atan2(o.raised[1]-o.pivot[1],o.raised[0]-o.pivot[0]),length:len(sub(o.tip,o.pivot)),omega:0}));
  // atan2 places the right raised tip on the opposite side of ±pi.
  // Unwrap each target around its rest angle before interpolation.
  for(const f of this.flippers){const delta=f.up-f.rest;f.up=f.rest+Math.atan2(Math.sin(delta),Math.cos(delta));}
  const objectsToEdges=objects=>{const edges=[];for(const o of objects){
   if(!['wall','rail','active','rebound','bumper','test-post','target'].includes(o.kind))continue;
   const material=[315,317,326,327,328].includes(o.source)?'roughWall':[405,413,421].includes(o.source)?'upperBumper':null;
   if(o.center){edges.push({id:o.id,c:o.center,r:o.radius,kind:o.kind,material,retractUp:o.mechanic==='retract_for_upward_ball'});continue;}
   const ps=o.points||[];for(let i=1;i<ps.length;i++)if(len(sub(ps[i],ps[i-1]))>EPS)edges.push({id:o.id,a:ps[i-1],b:ps[i],kind:o.kind,material,mechanic:o.mechanic,n:o.pass_normal,thickness:o.thickness||0,launchOnly:o.collisionMode==='launch-only'});
  }return edges;};
  this.edges={lower:objectsToEdges(g.lower),tavern:[]};
  // The complete raised tavern outline owns its collision edges. Only its
  // actual entrance is open; the lower U-shaped rear is on another mask.
  const deck=g.deck.points,ta=this.portals.TA.points;
  for(let i=1;i<deck.length;i++){const a=deck[i-1],b=deck[i];if(len(sub(a,nearest(a,...ta).p))<.05&&len(sub(b,nearest(b,...ta).p))<.05)continue;this.edges.tavern.push({a,b,id:'tavern-wall',kind:'wall'});}
  this.edges.tavern.push(...objectsToEdges(g.upper_parts.filter(o=>o.collision_layer!=='right_upper')));
  if(g.right_upper_region||g.right_upper_ramp)this.edges.right_upper=objectsToEdges(g.upper_parts.filter(o=>o.collision_layer==='right_upper'));
  for(const [layer,es]of Object.entries(this.edges))this.grids[layer]=new Grid(es);
  this.sockets=g.lower.filter(o=>o.kind==='socket'&&o.id!=='gravity-well');
  this.shark=g.lower.find(o=>o.id==='shark-mouth');
  if(this.shark){const mouth=sub(this.shark.entry[1],this.shark.entry[0]);this.sharkOut=unit([-mouth[1],mouth[0]]);this.sharkRelease=add(mix(...this.shark.entry,.5),mul(this.sharkOut,this.config.ballRadius*2));}
  this.transitions=[...(deck.length?[{id:'TA',layer:'tavern',points:ta}]:[]),...(g.extra_transitions||[])];
  for(const t of this.transitions){const ab=sub(t.points[1],t.points[0]);if(!t.n){t.n=unit([ab[1],-ab[0]]);if(t.n[1]>0)t.n=mul(t.n,-1);}t.mid=mix(...t.points,.5);}
 }
 recordTarget(id){const group=this.targetGroups.find(g=>g.targets.includes(id));if(!group||group.complete||group.hits.has(id))return;
  group.hits.add(id);this.targetHitAt.set(id,this.time);this.targetHits.add(id);this.emit('target-hit',{id,group:group.id,count:group.hits.size});
  if(group.hits.size===group.targets.length){group.complete=true;group.resetAt=this.time+.6;group.completions++;this.emit('target-group-complete',{id:group.id});this.completeTargetRule(group);if(group.id==='left-arc'&&this.lighthouseLevel<3){this.lighthouseLevel++;this.emit('bumper-upgraded',{id:'lighthouse',level:this.lighthouseLevel});}if(group.id==='left-bank'&&this.beerLevel<3){this.beerLevel++;this.emit('bumper-upgraded',{id:'tavern-beer',level:this.beerLevel});}}
 }
 completeTargetRule(group){
  const rules=this.g.gameplay,rule=rules?.target_rules?.find(r=>r.id===group.id);if(!rule)return;
  let bonus=false;
  if(rule.action==='upgrade'){
   const key=rule.bumper_group,level=this.bumperLevels[key]||1;
   if(level<3){this.bumperLevels[key]=level+1;this.emit('bumper-upgraded',{id:key,level:level+1});}else bonus=true;
  }else if(rule.action==='vortex'){
   if(this.vortexActive){bonus=true;this.awardExtraLife('vortex');}else{this.vortexActive=true;this.vortexActivatedAt=this.time;this.emit('vortex-activated');}
  }else if(rule.action==='enemy'){
   if(this.enemyActive){this.awardExtraLife('boss-target');return;}
   this.enemyActive=true;
   this.freezeRemaining=rules.enemy_freeze_seconds??.6;
   this.emit('enemy-spawn-requested',{group:group.id,freezeSeconds:this.freezeRemaining});
  }
  if(bonus){const points=rules.repeat_bonus??150;this.score+=points;this.emit('target-bonus',{group:group.id,points,position:[...this.ball.p]});}
 }
 bumperLevel(id){
  for(const [group,ids]of Object.entries(this.g.gameplay?.bumper_groups||{}))if(ids.includes(id))return this.bumperLevels[group]||1;
  return id==='lighthouse'?this.lighthouseLevel:1;
 }
 updateTargetGroups(){for(const group of this.targetGroups){if(!group.complete||this.time<group.resetAt)continue;for(const id of group.targets)this.targetHits.delete(id);group.hits.clear();group.complete=false;this.emit('target-group-reset',{id:group.id});}}
 resetTargets(){this.fishSensorHitAt=new Map();this.reboundHitAt=new Map();this.sharkFlashAt=null;this.flagHitAt=new Map();this.holeReleasedAt=new Map();this.krakenCount=0;this.krakenAttackAt=null;this.enemyIntroPending=false;this.enemyActive=false;this.bumperHitUntil=new Map();this.bumperLevels={};this.vortexActive=!this.g.gameplay?.target_rules?.some(r=>r.action==='vortex');this.vortexActivatedAt=this.vortexActive?this.time:null;this.freezeRemaining=0;this.lighthouseLevel=1;this.beerLevel=1;this.targetHitAt=new Map();this.targetHits=new Set();this.targetGroups=[];for(const o of [...this.g.lower,...this.g.upper_parts]){if(!o.target_group)continue;let group=this.targetGroups.find(g=>g.id===o.target_group);if(!group){group={id:o.target_group,targets:[],hits:new Set(),complete:false,completions:0,resetAt:0};this.targetGroups.push(group);}group.targets.push(o.id);}}
 directionalEdges(){const h=this.g.head_gate,layer=this.ball.layer,edges=[];
  if(this.g.layout_preview)return edges;
  if(layer==='lower'){
   edges.push({id:'head-left',a:h.left,b:h.apex,n:unit([26,25]),kind:'gate'},
    {id:'head-right',a:h.apex,b:h.right,n:unit([-26,25]),kind:'gate'});
  }
  if(layer==='lower')edges.push({id:'head-bottom',a:h.left,b:h.right,n:[0,1],kind:'gate'});
  return edges;
 }
 syncRegion(){
  const region=this.g.right_upper_region,b=this.ball;
  if(!region||!['lower','right_upper'].includes(b.layer))return;
  const ps=region.points,within=inside(b.p,ps);
  // Keep the upper mask until the whole ball clears the lip. Switching with
  // its centre on the lip can push it back against an underlying lower rail.
  const touching=b.layer==='right_upper'&&ps.some((p,i)=>len(sub(b.p,nearest(b.p,p,ps[(i+1)%ps.length]).p))<region.exit_margin);
  // Admission requires crossing the finite top opening inward. Merely being
  // inside the projected floor (or crossing a side/exit) is not an entrance.
  const [a,z]=region.entry_edge,axis=sub(z,a),previous=b.regionPrevious;
  b.regionPrevious=[...b.p];
  let entered=false;
  if(previous){
   const from=cross(axis,sub(previous,a)),to=cross(axis,sub(b.p,a));
   if(from<=0&&to>0){const q=mix(previous,b.p,-from/(to-from)),t=dot(sub(q,a),axis)/dot(axis,axis);entered=t>=0&&t<=1;}
  }
  const occupied=b.layer==='right_upper'?(within||touching):(within&&entered);
  const layer=occupied?'right_upper':'lower';
  if(layer!==b.layer){b.layer=layer;b.z=layer==='lower'?0:region.height;this.emit('layer',{id:'right-upper-region',to:layer,position:[...b.p]});}
 }
 field(){
  const b=this.ball,g=this.config;let a=[0,g.gravity],drag=g.drag,onRamp=false;
  b.z=0;
  if(b.layer==='tavern'){
   const lo=mix(...this.portals.TA.points,.5),hi=mix(...this.portals.T2.points,.5),axis=sub(hi,lo),l2=dot(axis,axis),t=dot(sub(b.p,lo),axis)/l2;
   if(this.g.ramp_triangles.some(tri=>inside(b.p,tri))){a=sub(a,mul(axis,g.verticalGravity*g.rampHeight/l2));b.z=clamp(t,0,1)*g.rampHeight;drag=g.rampDrag;onRamp=true;}else b.z=g.rampHeight;
  }
  if(b.layer==='right_upper')b.z=this.g.right_upper_region.height;
  // TTableLayer includes a small random lateral field. X is mirrored here.
  if(!onRamp)a[0]+=(.5-this.random())*len(b.v)*g.drag;
  for(const well of this.g.lower.filter(o=>o.kind==='field'&&o.mechanic==='gravity-well'&&o.layer===b.layer&&this.vortexActive)){
   const delta=sub(well.center,b.p),distance=len(delta);
   if(distance>well.radius||this.balls.some(other=>other.state==='vortex-held'&&other.vortexHeld?.id===well.id))continue;
   // TKickout::FieldEffect adds its pull and velocity damping to the table field.
   if(distance>EPS)a=add(a,mul(delta,g.wellPull/distance));drag+=g.wellDrag;
  }
  return {a,drag};
 }
 sensors(dt){const b=this.ball;if(b.state!=='playing')return;
  if(b.layer==='tavern'&&this.g.deck_exit&&len(sub(b.p,this.g.deck_exit.center))<this.g.deck_exit.radius){const v=[...b.v];this.capture('tavern-drop',this.g.deck_exit.center,[...this.g.deck_exit.center],'lower',[v[0]*.15,Math.max(60,Math.abs(v[1]))],500);return;}
  if(b.layer==='lower'&&this.time>b.immunity){
   for(const s of this.sockets){const delta=sub(s.center,b.p),dist=len(delta);
    if(dist<14&&dist>5)b.v=add(b.v,mul(unit(delta),160*this.config.speedScale**2*dt));
    if(dist<s.radius){const right=s.id==='right-recess',release=s.release||(right?add(s.center,[-13,8]):[123,150]);this.capture(s.id,s.center,release,'lower',s.release_direction||(right?[-1,.45]:[.9,-.45]),250);return;}}
   if(this.shark){const q=nearest(b.p,...this.shark.points);if(len(sub(b.p,q.p))<4.8){this.capture('shark',q.p,this.sharkRelease,'lower',this.sharkOut,750);return;}}
  }
  const offset=this.g.lower_offset||[0,0],localX=b.p[0]-offset[0],localY=b.p[1]-offset[1];
  if(b.layer==='lower'&&localY>382&&b.v[1]>0){
   const side=localX<40&&!this.g.rescue_kickers?.some(k=>k.side==='left')?'left':localX>298&&localX<311&&!this.g.rescue_kickers?.some(k=>k.side==='right')?'right':null;
   if(side)this.triggerKickback(side,[0,-1]);
  }
  if(localY>461||b.p[1]<(this.g.drain_top??-40)||b.p[0]<-25||b.p[0]>385)this.drain();
 }
 triggerKickback(side,direction,speed=this.config.kickbackSpeed){
  if(!this.kickbacks[side])return;
  const triggerPosition=[...this.ball.p];
  if(side==='right'){
   const kicker=this.g.rescue_kickers?.find(k=>k.side===side),point=kicker?.launch_point||kicker?.aim;
   if(point){
    const rescueStart=[...this.ball.p];
    this.ball.p=[...point];this.ball.relocatedFrom=[...point];this.ball.regionPrevious=null;this.ball.trail=[];
    for(const gate of this.gates)if(gate.pendingBall===this.ball){gate.pending=false;gate.pendingBall=null;}
    // Rescue relocation crosses the return flap even though later sensors start
    // at relocatedFrom. Apply that crossing before discarding the old position.
    this.updateGates(rescueStart,this.ball.layer);
   }
   direction=[0,-1];
  }
  direction=[0,-1];
  this.kickbacks[side]=false;this.ball.speedLimit=this.config.maxSpeed;const rebound=basicCollision(this.ball.v,direction,.2,.7,0,speed);
  // Both rescue launchers fire vertically, regardless of the layout aim.
  this.ball.v=[0,-len(rebound)];this.limitSpeed();
  this.emit('kickback',{side,speed:len(this.ball.v)});this.kickbackHits[side]=true;this.emit('kickback-lane',{side});
  if(this.kickbackHits.left&&this.kickbackHits.right)this.awardMultiball(triggerPosition);
 }
 rolloverSensors(previous,previousLayer){const b=this.ball;if(previousLayer!=='lower'||b.layer!=='lower'||b.state!=='playing')return;
  for(const lane of this.g.lower.filter(o=>o.kind==='rollover')){const y=lane.center[1],a=previous[1]-y,z=b.p[1]-y;if(!((a<0&&z>=0)||(a>0&&z<=0)))continue;
   const x=previous[0]+(b.p[0]-previous[0])*(-a)/(z-a);if(x<lane.points[0][0]||x>lane.points[1][0]||this.rolloverHits.has(lane.id))continue;
   this.rolloverHits.add(lane.id);this.emit('rollover',{id:lane.id,count:this.rolloverHits.size});
  }
 }
 airdropSensors(previous,previousLayer){const b=this.ball;if(b.state!=='playing'||previousLayer!==b.layer)return;
  if(this.time<(this.airdropFlashUntil||0))return;
  const lanes=this.g.lower.filter(o=>o.kind==='airdrop-rollover'&&o.layer===b.layer);
  for(const lane of lanes){if(this.airdropHits.has(lane.id))continue;
   const [a,z]=lane.points,axis=sub(z,a),length2=dot(axis,axis);if(!length2)continue;
   const from=cross(axis,sub(previous,a)),to=cross(axis,sub(b.p,a));
   if(!((from<0&&to>=0)||(from>0&&to<=0)))continue;
   const q=mix(previous,b.p,from/(from-to)),along=dot(sub(q,a),axis)/length2;
   if(along<0||along>1)continue;
   this.airdropHits.add(lane.id);this.emit('airdrop-rollover',{id:lane.id,count:this.airdropHits.size});
   if(lanes.length===3&&lanes.every(o=>this.airdropHits.has(o.id))){this.airdropActivatedAt=this.time;this.airdropFlashUntil=this.time+1.56;const rollovers=[...this.airdropHits];this.airdropHits.clear();this.airdropActive=true;this.airdropLanternLit=true;this.airdropSequence++;this.emit('pirate-airdrop-requested',{eventId:this.airdropSequence,rollovers});return;}
  }
 }
 finishAirdrop(eventId){if(!this.airdropActive||eventId!==this.airdropSequence)return false;
  this.airdropActive=false;this.emit('pirate-airdrop-ended',{eventId});return true;
 }
 collectKrakenEye(){if(this.krakenAttackAt!==null)return false;
  this.krakenCount=Math.min(5,this.krakenCount+1);this.emit('kraken-eye',{count:this.krakenCount});
  if(this.krakenCount===5){this.krakenAttackAt=this.time;this.krakenSequence=(this.krakenSequence||0)+1;this.emit('kraken-attack-started',{eventId:this.krakenSequence});}return true;
 }
 finishKraken(eventId){if(this.krakenAttackAt===null||eventId!==this.krakenSequence)return false;this.krakenAttackAt=null;this.krakenCount=0;this.emit('kraken-attack-ended');return true;}
 fishSensorCrossings(previous,previousLayer){
  const b=this.ball;if(b.state!=='playing'||b.layer!==previousLayer)return;
  for(const sensor of this.fishSensors){
   if(this.visualPlane(b)!==(sensor.layer||'lower'))continue;
   const [a,z]=sensor.points,axis=sub(z,a),length2=dot(axis,axis);if(!length2)continue;
   const from=cross(axis,sub(previous,a)),to=cross(axis,sub(b.p,a));
   if(!((from<0&&to>=0)||(from>0&&to<=0)))continue;
   const q=mix(previous,b.p,from/(from-to)),along=dot(sub(q,a),axis)/length2;
   if(along<0||along>1)continue;
   this.fishSensorHitAt.set(sensor.id,this.time);this.emit('fish-sensor-hit',{id:sensor.id});
  }
 }
 krakenSensors(previous,previousLayer){const b=this.ball;if(b.state!=='playing'||b.layer!==previousLayer||b.layer==='lower'||this.krakenAttackAt!==null)return;
  for(const sensor of this.g.upper_parts.filter(o=>o.kind==='sensor'&&!this.fishSensorIds.has(o.id))){
   const [a,z]=sensor.points,axis=sub(z,a),from=cross(axis,sub(previous,a)),to=cross(axis,sub(b.p,a));
   if(!((from<0&&to>=0)||(from>0&&to<=0)))continue;
   const q=mix(previous,b.p,from/(from-to)),along=dot(sub(q,a),axis)/dot(axis,axis);
   if(along>=0&&along<=1)this.collectKrakenEye();
  }
 }
 flagSensors(previous,previousLayer){const b=this.ball;if(previousLayer!==b.layer||b.state!=='playing')return;
  for(const flag of this.g.lower.filter(o=>o.kind==='flag'&&o.layer===b.layer)){const [a,z]=flag.points,axis=sub(z,a),from=cross(axis,sub(previous,a)),to=cross(axis,sub(b.p,a));
   if(!((from<0&&to>=0)||(from>0&&to<=0)))continue;const q=mix(previous,b.p,from/(from-to)),along=dot(sub(q,a),axis)/dot(axis,axis);
   if(along<0||along>1||(this.cooldowns.get(flag.id)||0)>this.time)continue;
   this.scoreHit(flag.id,50);this.emit('flag-hit',{id:flag.id});
  }
 }
 raiseCenterPost(){if(this.centerPostRaised||this.rolloverHits.size!==3)return;const post=this.g.lower.find(o=>o.id==='test-post-center');
  if(!post)return;
  if(this.balls.some(b=>b.state!=='drained'&&b.layer==='lower'&&len(sub(b.p,post.center))<post.radius+this.config.ballRadius+.5))return;
  this.centerPostRaised=true;this.centerPostHitsLeft=5;this.centerPostHitAt=-Infinity;this.emit('center-post-up');
 }
 awardExtraLife(source,position=this.ball.p){const reserve=4-this.ballNumber-(this.lifeLaunched?1:0)+(this.extraLives||0);if(this.gameOver||reserve>=99)return false;this.extraLives=(this.extraLives||0)+1;this.emit('extra-life-awarded',{source,remaining:reserve+1,position:[...position]});return true;}
 awardMultiball(position=this.ball.p){this.kickbacks={left:true,right:true};this.kickbackHits={left:false,right:false};
  for(const gate of this.gates)if(gate.id==='left-return'||gate.id==='right-return'){gate.closed=false;gate.pending=false;gate.pendingBall=null;gate.unlocked=true;}
  if(this.balls.filter(b=>b.state!=='drained').length+this.freeBallQueue>=3){this.awardExtraLife('multiball',position);return;}
  this.freeBallRewardPositions.push([...position]);this.freeBallQueue++;this.multiballAwards++;this.emit('multiball-awarded',{count:this.multiballAwards});
 }
 spawnFreeBall(){if(!this.freeBallQueue)return;if(this.balls.filter(b=>b.state!=='drained').length>=3){this.freeBallQueue--;this.awardExtraLife('multiball',this.freeBallRewardPositions.shift()||this.ball.p);return;}const p=[this.g.plunger.x,this.g.plunger.rest_y-this.config.ballRadius-18];
  if(this.balls.some(b=>b.state!=='drained'&&b.layer==='lower'&&len(sub(b.p,p))<this.config.ballRadius*2+3))return;
  const gate=this.gates.find(g=>g.id==='shooter-return');if(gate){gate.closed=false;gate.pending=false;}
  this.balls.push({p,v:[0,-this.config.maxSpeed],layer:'lower',z:0,state:'playing',immunity:0,lastPortal:-10,trail:[],free:true,launchGuard:true});
  this.freeBallQueue--;this.freeBallRewardPositions.shift();this.plungerReleasedAt=this.time;this.plungerReleaseCharge=1;this.emit('free-ball-launch');
 }
 vortexRecovery(dt,previous=null){
  const b=this.ball;
  const centerFor=well=>this.g.lower.find(o=>o.mechanic==='vortex-center'&&o.layer===well.layer&&len(sub(o.center,well.center))<=well.radius);
  const inCenter=(well,swept)=>{
   const hole=centerFor(well),center=hole?.center||well.center,radius=hole?.radius??well.radius*(swept ? .05 : .2);
   return len(sub(swept&&previous?nearest(center,previous,b.p).p:b.p,center))<=radius;
  };
  if(b.state==='vortex-held'){
   b.vortexHeld.remaining-=dt;if(b.vortexHeld.remaining>1e-9)return;
   // Web data: gravity well kicker 509, speed 45, scatter 5%, angle 1.256637.
   // Preserve the source's in-place rotation, reflected into layout X.
   const angle=(1-2*this.random())*1.2566370964050293,x=Math.sin(angle),y=Math.sin(angle)*x-Math.cos(angle);
   const speed=45*21*(1+(1-2*this.random())*.05),id=b.vortexHeld.id;
   b.v=[-x*speed,y*speed];b.state='playing';b.vortexDwell=0;b.vortexImmuneUntil=this.time+.05;delete b.vortexHeld;
   this.limitSpeed();this.emit('vortex-ejected',{id,position:[...b.p]});return;
  }
  if(this.config.vortexMode==='eject'&&b.state==='playing'){
   if(!this.vortexActive||this.time<(b.vortexImmuneUntil||0))return;
   const well=this.g.lower.find(o=>o.mechanic==='gravity-well'&&o.layer===b.layer&&!this.balls.some(other=>other!==b&&other.state==='vortex-held'&&other.vortexHeld?.id===o.id)&&inCenter(o,true));
   if(!well)return;b.p=[...(centerFor(well)?.center||well.center)];b.v=[0,0];b.state='vortex-held';b.vortexHeld={id:well.id,remaining:1.5};b.vortexDwell=0;
   this.emit('vortex-captured',{id:well.id,position:[...b.p]});return;
  }
  if(b.state==='vortex-return'){
   b.vortexFade=Math.max(0,b.vortexFade-dt);if(b.vortexFade>0)return;
   const p=this.g.plunger,spawn=[p.x,p.rest_y-this.config.ballRadius];
   if(this.balls.some(other=>other!==b&&other.state!=='drained'&&other.state!=='vortex-return'&&other.layer==='lower'&&(other.state==='ready'||len(sub(other.p,spawn))<this.config.ballRadius*2+3)))return;
   Object.assign(b,{p:spawn,v:[0,0],state:'ready',layer:'lower',z:0,trail:[],immunity:0,lastPortal:-10,regionPrevious:null,vortexDwell:0});
   this.charge=this.chargeElapsed=0;this.input.launch=false;
   const gate=this.gates.find(g=>g.id==='shooter-return');if(gate){gate.closed=false;gate.pending=false;gate.pendingBall=null;}
   this.emit('vortex-returned');return;
  }
  const well=this.vortexActive&&b.state==='playing'&&this.g.lower.find(o=>o.kind==='field'&&o.mechanic==='gravity-well'&&o.layer===b.layer&&inCenter(o,false));
  if(!well){b.vortexDwell=0;return;}
  b.vortexDwell=(b.vortexDwell||0)+dt;
  if(b.vortexDwell>=1){b.state='vortex-return';b.v=[0,0];b.vortexFade=.25;this.emit('vortex-reclaimed',{id:well.id,position:[...b.p]});}
 }

 };
}
const bumperFiles=/\/(bumper-barrel|bumper-skull|lighthouse)-lv[123]\.png$/;
const lanternFiles=/\/lantern-(off|on)\.png$/;
function inferArtState(o){if(o.state==='guide-arrow')return {};return {...(o.bind&&bumperFiles.test(o.src)?{state:'level'}:{}),...(o.bind&&lanternFiles.test(o.src)?{state:'rollover'}:{}),...(['left-return','right-return'].includes(o.bind)?{state:'return-gate'}:{})};}
const attractFish=/\/(school|fish-\d+)-[1-7]\.png$/;
const missionFish=/\/fish-5-[45]\.png$/;
function attractGroup(o){
 if(missionFish.test(o.src))return 'mission-fish';
 if(o.state==='kraken-eye'||o.state==='kraken-body')return 'octopus';
 if(o.state==='multiball-launch'&&/\/shark-(off|on)\.png$/.test(o.src))return 'shark';
 if(lanternFiles.test(o.src))return o.bind?.startsWith('airdrop-rollover-')?'small-lantern':'large-lantern';
 if(attractFish.test(o.src))return 'fish';
 if(bumperFiles.test(o.src))return 'bumper';
 return null;
}
const attractGroups=['octopus','shark','large-lantern','small-lantern','fish','mission-fish','bumper'];
function attractLight(game,o){
 if(!game||game.ball.state!=='ready'||game.input?.launch||game.launchAiming||game.charge>0||game.paused||(game.preserveTableOnDrain&&game.hasLaunchedOnce))return null;
 const group=attractGroup(o);if(!group)return null;
 let show=game.attractVisual;
 if(!show||show.ball!==game.ball){
  const members=(game.g.artLayers||[]).filter(a=>!a.hidden&&attractGroup(a));
  const present=new Set(members.map(attractGroup));
  const xs=members.map(a=>a.x),ys=members.map(a=>a.y);
  const bandWidth=Math.max(12,...members.filter(a=>attractGroup(a)==='large-lantern').map(a=>a.height));
  show=game.attractVisual={ball:game.ball,start:game.time,groups:attractGroups.filter(name=>present.has(name)),
   left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys),bandWidth};
 }
 // Fixed loop: up, down, groups, left-to-right, right-to-left, all on.
 const sweepDuration=3,groupStep=.6,allOnDuration=1.2;
 const verticalDuration=sweepDuration*2,groupDuration=show.groups.length*groupStep;
 const horizontalStart=verticalDuration+groupDuration,horizontalEnd=horizontalStart+sweepDuration*2;
 const elapsed=Math.max(0,game.time-show.start)%(horizontalEnd+allOnDuration);
 if(elapsed>=verticalDuration&&elapsed<horizontalStart)return show.groups[Math.floor((elapsed-verticalDuration)/groupStep)]===group;
 if(elapsed<horizontalEnd){
  const vertical=elapsed<verticalDuration,sweepTime=vertical?elapsed:elapsed-horizontalStart;
  const first=sweepTime<sweepDuration,progress=(first?sweepTime:sweepTime-sweepDuration)/sweepDuration;
  const min=vertical?(first?-show.bottom:show.top):(first?show.left:-show.right);
  const max=vertical?(first?-show.top:show.bottom):(first?show.right:-show.left);
  const value=vertical?(first?-o.y:o.y):(first?o.x:-o.x);
  // Let the whole band pass the final lamp before switching modes.
  const width=show.bandWidth,front=min+progress*(max-min+width);
  return value<=front&&value>=front-width;
 }
 return true;
}

function artState(o,game,renderer,flashImage){
   if(game&&missionFish.test(o.src)){
    const off=o.src.replace(/-[45]\.png$/,'-5.png'),on=off.replace('-5.png','-4.png');
    renderer.image(off);renderer.image(on);
    // The original layout image selects the location's role, not its lit state.
    const attack=o.src.endsWith('/fish-5-4.png');
    const active=!game.enemyIntroPending&&(attack?!!game.enemyActive:!game.enemyActive);
    const attract=attractLight(game,o);
    const lit=attract!==null?attract:active&&game.time%3<.6;
    return {src:lit?on:off,baseSrc:off,frame:0};
   }
   if(game&&o.state==='guide-arrow'){
    const goal=o.bind?.startsWith('guide:')?o.bind.slice(6):null;
    if(goal==='vortex'&&game.vortexActive||goal==='enemy'&&game.enemyActive||goal==='center-post'&&game.centerPostRaised)return null;
    if(['ball','barrel','kraken','airdrop'].includes(goal)&&!game.enemyActive)return null;
    if(goal==='kraken'&&game.krakenAttackAt!==null||goal==='airdrop'&&game.airdropActive)return null;
    if(goal==='multiball'&&game.balls.filter(b=>b.state!=='drained').length+game.freeBallQueue>=3)return null;
    if(game.rolloverHits.has(o.bind)||game.airdropHits.has(o.bind))return null;
    const kicker=game.g.rescue_kickers?.find(k=>k.id===o.bind);if(kicker&&game.kickbackHits[kicker.side])return null;
   }
   if(game&&o.state==='return-gate'&&!game.gates.some(g=>g.id===o.bind&&g.closed&&!g.unlocked))return null;
   const attract=attractLight(game,o);
   const postImage=o.bind==='test-post-center'&&/\/campus-(off|on)\.png$/.test(o.src);
   if(game&&(postImage||o.bind&&o.state==='center-post')&&!game.centerPostRaised)return null;let src=o.src;
   if(game&&postImage)src=src.replace(/campus-(off|on)\.png$/,`campus-${(game.centerPostHitUntil||0)>game.time?'on':'off'}.png`);
   if(game&&o.bind&&/\/fish-3-[345]\.png$/.test(src)){
    const on=o.state==='kickback'?!!game.kickbackHits[o.kickbackSide]:game.rolloverHits.has(o.bind);
    src=src.replace(/fish-3-[345]\.png$/,`fish-3-${on?(o.state==='kickback'?4:3):5}.png`);
   }
   const reboundFish=game?.reboundIds?.has(o.bind)&&/\/(school|fish-\d+)-[1-7]\.png$/.test(o.src);
   if(reboundFish){
    const off=o.src.replace(/-[1-7]\.png$/,'-5.png'),on=off.replace(/-5\.png$/,'-3.png');
    renderer.image(off);renderer.image(on);
    src=flashImage({time:game.time,start:game.reboundHitAt.get(o.bind),duration:.6,images:[on,off],idle:off});
   }
   const sensorFish=game?.fishSensors?.some(sensor=>sensor.id===o.bind);
   if(sensorFish){
    const off=o.src.replace(/-[1-7]\.png$/,'-5.png'),on=off.replace(/-5\.png$/,'-3.png');
    renderer.image(off);renderer.image(on);
    const started=game.fishSensorHitAt.get(o.bind),age=started===undefined?-1:game.time-started;
    src=age>=0&&age<1.2?on:off;
   }
   if(game&&o.state==='multiball-launch'){
    const off=src.replace(/shark-(off|on)\.png$/,'shark-off.png'),on=off.replace('shark-off.png','shark-on.png');
    src=flashImage({time:game.time,start:game.sharkFlashAt,duration:3.18,images:[on,off],idle:off});
   }
   if(game&&(o.state==='kraken-eye'||o.state==='kraken-body')){
    const eye=o.state==='kraken-eye',image=n=>eye?src.replace(/eye-lv[123]\.png$/,`eye-lv${n}.png`):src.replace(/taco-(off|on)\.png$/,`taco-${n}.png`);
    const idle=eye?image((game.krakenCount||0)>=(o.eyeIndex||1)?2:1):image('off');
    src=flashImage({time:game.time,start:game.krakenAttackAt,duration:3.18,images:eye?[image(2),image(3)]:[image('off'),image('on')],idle});
   }
   const splitBumper=game&&o.bind&&bumperFiles.test(src);
   if(splitBumper)for(const level of [1,2,3])renderer.image(src.replace(/-lv[123]\.png$/,`-lv${level}.png`));
   if(splitBumper){let level=game.bumperLevel(o.bind);if((game.bumperHitUntil?.get(o.bind)||0)>game.time)level=level%3+1;src=src.replace(/-lv[123]\.png$/,`-lv${level}.png`);}
   const splitLantern=game&&lanternFiles.test(src);
   if(splitLantern){
    const off=src.replace(/lantern-(off|on)\.png$/,'lantern-off.png'),on=off.replace('lantern-off.png','lantern-on.png');
    const idle=o.bind?(game.airdropHits.has(o.bind)||game.rolloverHits.has(o.bind)?on:off):(game.airdropLanternLit?on:off);
    src=flashImage({time:game.time,start:o.bind?.startsWith('airdrop-rollover-')?game.airdropActivatedAt:null,duration:1.56,images:[on,off],idle});
   }
   if(attract!==null){
    if(attractFish.test(o.src))src=o.src.replace(/-[1-7]\.png$/,`-${attract?3:5}.png`);
    else if(o.state==='kraken-eye')src=o.src.replace(/eye-lv[123]\.png$/,`eye-lv${attract?3:1}.png`);
    else if(o.state==='kraken-body')src=o.src.replace(/taco-(off|on)\.png$/,`taco-${attract?'on':'off'}.png`);
    else if(o.state==='multiball-launch')src=o.src.replace(/shark-(off|on)\.png$/,`shark-${attract?'on':'off'}.png`);
    else if(lanternFiles.test(o.src))src=o.src.replace(/lantern-(off|on)\.png$/,`lantern-${attract?'on':'off'}.png`);
    else if(bumperFiles.test(o.src))src=o.src.replace(/-lv[123]\.png$/,`-lv${attract?3:1}.png`);
   }
   const baseSrc=(reboundFish||sensorFish)?o.src.replace(/-[1-7]\.png$/,'-5.png'):o.src.replace(/-lv[23]\.png$/,'-lv1.png').replace(/-on\.png$/,'-off.png').replace(/fish-3-[34]\.png$/,'fish-3-5.png');
   let frame=0;if(game&&o.bind){if(o.state==='level'){frame=game.bumperLevel(o.bind)-1;if((game.bumperHitUntil?.get(o.bind)||0)>game.time)frame=(frame+1)%3;}else if(o.state==='vortex')frame=game.vortexActive?1:0;else if(o.state==='rollover')frame=game.airdropHits.has(o.bind)||game.rolloverHits.has(o.bind)?1:0;}
   frame=(splitBumper||splitLantern)?0:Math.min(Math.max(frame,0),(o.frames||1)-1);
 return {src,baseSrc,frame};
}
// Shared by the standalone theater and the playtest's top-level document.
// The dark mask stays steady; only the red warning content pulses.
function screenOverlay(doc){
 const mask=doc.createElement('div');
 mask.setAttribute('role','alert');mask.className='pirate-warning';
 mask.style.cssText='position:fixed;margin:0;padding:0;box-sizing:border-box;z-index:2147483647;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;pointer-events:auto';
 const win=doc.defaultView,viewport=win.visualViewport;
 const position=()=>{mask.style.left=(viewport?.offsetLeft||0)+'px';mask.style.top=(viewport?.offsetTop||0)+'px';mask.style.width=(viewport?.width||win.innerWidth)+'px';mask.style.height=(viewport?.height||win.innerHeight)+'px';};
 position();win.addEventListener('resize',position);viewport?.addEventListener('resize',position);viewport?.addEventListener('scroll',position);
 const cleanup=()=>{win.removeEventListener('resize',position);viewport?.removeEventListener('resize',position);viewport?.removeEventListener('scroll',position);mask.remove();};
 return {mask,cleanup};
}
function showWarning(doc){
 const {mask,cleanup}=screenOverlay(doc);
 mask.innerHTML=`<div style="margin:0;padding:0;flex:none;color:#ff3038;text-align:center;font:bold clamp(24px,6vw,64px) monospace;letter-spacing:.12em;line-height:1.35;display:flex;flex-direction:column;align-items:center;gap:12px">
 <div>WARNING</div>
 <svg viewBox="0 0 100 90" aria-label="警告" style="width:clamp(80px,18vw,150px);height:auto"><path d="M50 5L95 84H5Z" fill="none" stroke="currentColor" stroke-width="5"/><path d="M50 34V57" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><circle cx="50" cy="70" r="4" fill="currentColor"/></svg>
 <div>ENERMY</div><div style="width:100%;height:3px;background:currentColor"></div></div>`;
 doc.body.append(mask);
 const animation=mask.firstElementChild.animate([{opacity:1},{opacity:.15},{opacity:1}],{duration:600,iterations:2});
 const finished=animation.finished.catch(()=>{}).finally(cleanup);
 return {finished,cancel(){animation.cancel();cleanup();},pause(){animation.pause();},play(){animation.play();}};
}
function showGameOver(doc,score,rows,currentId,onClose,buttonLabel='點擊回到開始'){
 const {mask,cleanup}=screenOverlay(doc);mask.className='pirate-game-over';mask.setAttribute('role','dialog');mask.setAttribute('aria-modal','true');mask.setAttribute('aria-label','Game Over 分數排行榜');
 mask.innerHTML=`<section style="margin:0;padding:20px;box-sizing:border-box;max-height:95%;overflow:auto;width:min(92vw,480px);color:#ff3038;text-align:center;font:bold 18px monospace;line-height:1.5">
 <h1 style="margin:0;font-size:clamp(32px,8vw,56px)">GAME OVER</h1><p style="margin:8px 0">SCORE <span data-score></span></p><hr style="border:0;border-top:2px solid currentColor"><h2 style="font-size:20px;margin:12px 0">HIGH SCORES</h2><ol style="list-style:none;padding:0;margin:0" data-ranks></ol><button style="margin-top:20px;background:#190a0a;color:#ff3038;border:1px solid currentColor;padding:10px 24px;font:inherit;cursor:pointer"></button></section>`;
 mask.querySelector('button').textContent=buttonLabel;
 mask.querySelector('[data-score]').textContent=String(score).padStart(12,'0');
 rows.forEach((entry,i)=>{const row=doc.createElement('li');row.style.cssText='display:flex;justify-content:space-between;gap:12px;padding:2px 6px';if(entry.id===currentId)row.style.background='#ff303833';row.textContent=String(i+1).padStart(2,'0')+'   '+String(entry.score).padStart(12,'0')+(entry.id===currentId?' ◀':'');mask.querySelector('[data-ranks]').append(row);});
 let closed=false;const close=()=>{if(closed)return;closed=true;cleanup();onClose();};
 mask.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(e.target.closest('button'))close();});
 mask.addEventListener('keydown',e=>e.stopPropagation());
 doc.body.append(mask);mask.querySelector('button').focus();return {cancel(){closed=true;cleanup();}};
}
const sounds={
 metal:{src:'res/audio/electronic-impact.wav',volume:1,interval:70,voices:4},
 thunder:{src:'res/audio/thunder.ogg',volume:.75,interval:100,voices:2},
 explosion:{src:'res/audio/explosion.ogg?v=trim1',volume:.65,interval:70,voices:4}
};
const api={createGame,inferArtState,artState,showWarning,showGameOver,sounds};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PirateMap=api;
})(typeof window!=='undefined'?window:globalThis);
