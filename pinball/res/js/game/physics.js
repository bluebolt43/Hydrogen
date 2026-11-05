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
 const length=len(d);if(!length)return null;const scale=1/length,dx=d[0]*scale,dy=d[1]*scale,cx=c[0]-p[0],cy=c[1]-p[1],along=cx*dx+cy*dy;
 if(along<0)return null;const square=cx*cx+cy*cy,det=r*r-square+along*along;
 if(det<0)return null;const distance=along-Math.sqrt(det);
 if(square>=r*r&&(distance<0||distance>length))return null;
 const x=p[0]+dx*distance,y=p[1]+dy*distance,nx=x-c[0],ny=y-c[1],normalScale=1/(Math.hypot(nx,ny)||1);
 return {t:distance/length,distance,position:[x,y],n:[nx*normalScale,ny*normalScale],depth:0};
}
// TLine ray test, in layout coordinates. Pirate editor lines have two exposed
// faces; each face uses the source one-sided test and .002 world-unit tolerance.
function segmentHit(p,d,a,b,r){
 const length=len(d),ax=b[0]-a[0],ay=b[1]-a[1],span=Math.hypot(ax,ay);if(!length)return null;if(!span)return circleHit(p,d,a,r);
 const axisScale=1/span,tx=ax*axisScale,ty=ay*axisScale,directionScale=1/length,dx=d[0]*directionScale,dy=d[1]*directionScale;let best=null;
 // Misses are common: keep intermediate vectors scalar until a hit is found.
 for(let sign=-1;sign<=1;sign+=2){
  const nx=-ty*sign,ny=tx*sign,divisor=nx*dx+ny*dy;if(divisor>=0)continue;
  const distance=(r-((p[0]-a[0])*nx+(p[1]-a[1])*ny))/divisor;if(distance<-.002*21||distance>length)continue;
  const x=p[0]+dx*distance,y=p[1]+dy*distance,along=(x-a[0])*tx+(y-a[1])*ty;if(along<0||along>span)continue;
  const h={t:distance/length,distance,position:[x,y],n:[nx,ny],depth:0};if(!best||distance<best.distance)best=h;
 }
 for(let i=0;i<2;i++){const h=circleHit(p,d,i?b:a,r);if(h&&(!best||h.distance<best.distance))best=h;}return best;
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
 physicsModel:'legacy',step:1/60,speedScale:1,worldScale:21,ballRadius:.3*21,maxSpeed:.3*200*21,
 gravity:25*21*Math.sin(.5),verticalGravity:25*21,drag:.2,rampDrag:.2,rampHeight:22,
 elasticity:.5,collisionSmoothness:.8,roughWallElasticity:.6,roughWallSmoothness:.6,
 bumperElasticity:.6,bumperSmoothness:.95,bumperBoost:17*21,upperBumperBoost:12*21,bumperThreshold:2.5*21,bumperCooldown:.1,
 activeElasticity:.6,activeSmoothness:.95,activeBoost:18*21,activeThreshold:1*21,
 flipperSeconds:.04,flipperReturnSeconds:.08,flipperElasticity:.75,flipperSmoothness:.5,flipperBoostScale:.9,
 kickbackSpeed:55*21,wellPull:30*21,wellDrag:1
};
class CoreGame {
 constructor(g){this.g=g;this.random=Math.random;this.config={...CONFIG,ballRadius:g.ball_radius};this.input={left:false,right:false,launch:false};this.events=[];this.onEvent=null;this.time=0;this.paused=false;this.cooldowns=new Map();this.grids={};this.build();this.buildGuidedTracks();this.reset();}
 get physics(){return this.config;}
 // Map subclasses supply geometry and rules; the engine owns integration/CCD.
 edgeEnabled(){return true;}
 handleCollision(){return false;}
 activeBoost(){return this.physics.activeBoost;}
 collisionEffect(){}
 rulesInterrupted(){return false;}
 mapEvent(){}
 onCapture(){}
 beforeStep(){return true;}
 tickRules(){}
 flagSensors(previous,previousLayer){const b=this.ball;if(previousLayer!==b.layer||b.state!=='playing')return;
  const parts=b.layer==='top'?this.g.top_parts:b.layer==='tavern'?this.g.upper_parts:this.g.lower;
  for(const flag of (parts||[]).filter(o=>o.kind==='flag')){const [a,z]=flag.points,axis=sub(z,a),from=cross(axis,sub(previous,a)),to=cross(axis,sub(b.p,a));
   if(!((from<0&&to>=0)||(from>0&&to<=0)))continue;const q=mix(previous,b.p,from/(from-to)),along=dot(sub(q,a),axis)/dot(axis,axis);
   if(along<0||along>1||(this.cooldowns.get(flag.id)||0)>this.time)continue;
   this.scoreHit(flag.id,500);this.emit('flag-hit',{id:flag.id});
  }
 }
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
 scoreHit(id,points,cooldown=.12){if((this.cooldowns.get(id)||0)>this.time)return;this.cooldowns.set(id,this.time+cooldown);if(this.scoringEnabled!==false){this.score+=points;this.emit('score',{id,points,position:[...this.ball.p]});}else this.emit('score-hit',{id,position:[...this.ball.p]});this.recordTarget(id);}
 reset(){this.score=0;this.extraLives=0;this.ballNumber=1;this.hasLaunchedOnce=false;this.gameOver=false;this.time=0;this.events=[];this.cooldowns.clear();this.input.left=this.input.right=this.input.launch=false;this.charge=0;this.paused=false;this.newBall();this.emit('new-game');}
 launchLayer(){return this.g.plunger.layer||'lower';}
 launchHeight(){return this.launchLayer()==='top'?this.physics.rampHeight*2:this.launchLayer()==='tavern'?this.physics.rampHeight:0;}
 newBall(preserveTable=false){this.kickbackAt?.clear();this.lifeLaunched=false;this.ball={p:[this.g.plunger.x,this.g.plunger.rest_y-this.physics.ballRadius],v:[0,0],layer:this.launchLayer(),z:this.launchHeight(),state:'ready',immunity:0,saverAvailable:true};this.balls=[this.ball];if(!preserveTable)this.resetMapBall();this.plungerReleasedAt=-10;this.plungerReleaseCharge=0;this.charge=0;this.chargeElapsed=0;this.nudges=0;this.drainTimer=0;this.lastPortal=-10;this.trail=[];if(preserveTable){for(const gate of this.gates){gate.pending=false;gate.pendingBall=null;if(gate.id==='shooter-return')gate.closed=false;}}else{this.resetGates();this.resetTargets();for(const f of this.flippers){f.angle=f.rest;f.omega=0;f.cadet=null;}}}
 limitSpeed(){const speed=len(this.ball.v),cap=Math.min(this.ball.speedLimit||this.config.maxSpeed,this.config.maxSpeed);if(speed>cap)this.ball.v=mul(this.ball.v,cap/speed);}
 chargePower(seconds){const p=this.g.plunger,step=p.charge_step_seconds||0,duration=p.charge_seconds||1;return clamp(step?(Math.floor(seconds/step)+1)*step/duration:seconds/duration,0,1);}
 launch(power=.7){if(this.ball.state!=='ready'||this.gameOver)return;if(this.ball.saverAvailable&&this.ball.saverUntil===undefined)this.ball.saverUntil=this.time+(this.g.gameplay?.ball_saver_seconds||0);this.lifeLaunched=true;this.hasLaunchedOnce=true;this.plungerReleasedAt=this.time;power=clamp(power,0,1);this.plungerReleaseCharge=power;this.ball.state='playing';const p=this.g.plunger,speed=p.launch_min!==undefined?p.launch_min+(p.launch_max-p.launch_min)*power:(640+180*power)*this.physics.speedScale;this.ball.speedLimit=this.config.maxSpeed;this.ball.v=[0,-speed*(1+this.random()*.1)];this.limitSpeed();this.emit('launch',{power,speed:len(this.ball.v)});}
 nudge(){if(this.gameOver||this.ball.state!=='playing')return;if(this.nudges>=3){this.emit('tilt');return;}this.nudges++;this.ball.v=add(this.ball.v,[(this.nudges%2?32:-32)*this.physics.speedScale,-65*this.physics.speedScale]);this.limitSpeed();this.emit('nudge');}
 setBall(p,v=[0,0],layer='lower'){this.ball={p:[...p],v:[...v],layer,z:layer==='lower'?0:22,state:'playing',immunity:0};this.balls=[this.ball];this.gameOver=false;this.paused=false;this.lastPortal=-10;this.limitSpeed();}
 resetGates(){this.gates=this.g.one_way_gates.map(g=>({...g,n:unit(g.normal),closed:false,pending:false,unlocked:false}));}
 updateGates(previous,previousLayer){const b=this.ball,r=this.physics.ballRadius;if(previousLayer!==b.layer)return;
  for(const g of this.gates){if(g.unlocked||g.mechanic==='directional_flap'||g.closed||g.layer!==b.layer)continue;const [a,z]=g.points,from=dot(sub(previous,a),g.n),to=dot(sub(b.p,a),g.n);
   if(from<=0&&to>0){const q=mix(previous,b.p,-from/(to-from)),near=nearest(q,a,z);if(len(sub(q,near.p))<.02){g.pending=true;g.pendingBall=b;}}
   if(to<0&&g.pendingBall===b)g.pending=false;
   if(g.pending&&g.pendingBall===b&&to>r+.12&&!this.balls.some(other=>other!==b&&other.state!=='drained'&&other.layer===b.layer&&len(sub(other.p,nearest(other.p,a,z).p))<r+.12)){g.closed=true;g.pending=false;this.emit('gate-closed',{id:g.id});}}
 }
 gravityRegionAt(position,layer){
  for(let i=(this.g.gravity_zones||[]).length-1;i>=0;i--){const zone=this.g.gravity_zones[i];
   if(zone.layer!==layer||Math.abs(position[0]-zone.x)>zone.width/2||Math.abs(position[1]-zone.y)>zone.height/2)continue;
   if(zone.points&&!inside(position,zone.points)&&!zone.points.some((p,i)=>len(sub(position,nearest(position,p,zone.points[(i+1)%zone.points.length]).p))<=EPS))continue;
   return zone;
  }return null;
 }
 gravityAt(position,layer){
  const zone=this.gravityRegionAt(position,layer);if(!zone)return null;
  return zone.slopeAngle===undefined?[...zone.acceleration]:mul(zone.acceleration,this.physics.verticalGravity*Math.sin(zone.slopeAngle*Math.PI/180));
 }
 buildGuidedTracks(){
  this.guidedTracks=(this.g.guided_tracks||[]).map(track=>{const distances=[0];for(let i=1;i<track.points.length;i++)distances.push(distances.at(-1)+len(sub(track.points[i],track.points[i-1])));return {...track,distances,length:distances.at(-1),entry:unit(sub(track.points[1],track.points[0])),exit:unit(sub(track.points.at(-1),track.points.at(-2)))};});
 }
 guidedTrackHit(p,d){
  const b=this.ball;if(b.layer!=='lower'||len(d)<=EPS||this.time<(b.trackImmuneUntil||0))return null;
  let best=null;
  for(const track of this.guidedTracks){
   // The mouth catches from every direction; only the entrance is at table level.
   const radius=track.width/2,delta=sub(p,track.points[0]);
   const hit=len(delta)<=radius?{t:0}:circleHit(p,d,track.points[0],radius);
   if(!hit)continue;
   const t=clamp(hit.t,0,1);
   if(!best||t<best.t)best={t,track};
  }
  return best;
 }
 enterGuidedTrack(track){
  const b=this.ball,speed=track.ballSpeed>0?track.ballSpeed:b.state==='guided'?b.track.speed:len(b.v);b.state='guided';b.layer='guided';b.z=this.physics.rampHeight;b.track={id:track.id,distance:0,speed};b.p=[...track.points[0]];b.v=mul(track.entry,speed);b.trail=[];b.launchGuard=false;
  this.emit('track-enter',{id:track.id});
 }
 advanceGravityTrack(dt){
  const b=this.ball;
  while(dt>EPS){
   const track=this.guidedTracks.find(t=>t.id===b.track.id),speed=b.track.speed;
   // A reversing ball uses the segment before a joint, not the one after it.
   let i=1;while(i<track.distances.length-1&&(speed<0?track.distances[i]<b.track.distance-EPS:track.distances[i]<=b.track.distance+EPS))i++;
   const start=track.points[i-1],end=track.points[i],tangent=unit(sub(end,start)),span=track.distances[i]-track.distances[i-1];
   const gravity=this.gravityAt(b.p,track.layer||'lower')||[0,this.physics.gravity],acceleration=dot(gravity,tangent);
   const direction=Math.sign(speed)||Math.sign(acceleration)||1,boundary=track.distances[direction<0?i-1:i],distance=boundary-b.track.distance;
   let boundaryTime=Infinity;
   if(Math.abs(acceleration)>EPS){const square=speed*speed+2*acceleration*distance;
    if(square>=0){const roots=[(-speed+Math.sqrt(square))/acceleration,(-speed-Math.sqrt(square))/acceleration].filter(t=>t>EPS);if(roots.length)boundaryTime=Math.min(...roots);}
   }else if(speed*distance>0)boundaryTime=distance/speed;
   const turnTime=speed*acceleration<0?-speed/acceleration:Infinity,h=Math.min(dt,1/240,boundaryTime,turnTime);
   b.track.distance=clamp(b.track.distance+speed*h+.5*acceleration*h*h,0,track.length);
   b.track.speed=h===turnTime?0:speed+acceleration*h;dt-=h;
   b.p=mix(start,end,span?(b.track.distance-track.distances[i-1])/span:0);b.v=mul(tangent,b.track.speed);
   const atStart=b.track.distance<=EPS&&b.track.speed<0,atEnd=b.track.distance>=track.length-EPS&&b.track.speed>0;
   if(!atStart&&!atEnd)continue;
   // Match geometry endpoints, not the interpolated ball position near the seam.
   const next=atEnd?this.guidedTracks.filter(t=>t.id!==track.id&&len(sub(t.points[0],track.points.at(-1)))<=1+EPS&&dot(track.exit,t.entry)>=-EPS).sort((a,z)=>dot(track.exit,z.entry)-dot(track.exit,a.entry)||a.id.localeCompare(z.id))[0]:null;
   this.emit('track-exit',{id:track.id,connected:!!next});
   if(next){this.enterGuidedTrack(next);if(next.ballSpeed>0)return this.advanceGuidedTrack(dt);continue;}
   b.state='playing';b.layer=track.layer||'lower';b.z=b.layer==='top'?this.physics.rampHeight*2:b.layer==='tavern'?this.physics.rampHeight:0;b.regionPrevious=null;b.trackImmuneUntil=this.time+.1;b.relocatedFrom=[...b.p];delete b.track;return dt;
  }
  return 0;
 }
 advanceGuidedTrack(dt){
  const b=this.ball,current=this.guidedTracks.find(t=>t.id===b.track.id);
  if(!(current.ballSpeed>0)&&(this.g.gravity_zones||[]).some(z=>z.layer===(current.layer||'lower')))return this.advanceGravityTrack(dt);
  while(dt>EPS){
   const track=this.guidedTracks.find(t=>t.id===b.track.id);
   let i=1;while(i<track.distances.length-1&&track.distances[i]<=b.track.distance)i++;
   const a=track.points[i-1],z=track.points[i],span=track.distances[i]-track.distances[i-1];
   // Integrate each sampled segment so gravity follows the downhill tangent.
   const acceleration=track.ballSpeed>0?0:this.physics.gravity*Math.max(0,span?(z[1]-a[1])/span:0),speed=b.track.speed,distance=track.distances[i]-b.track.distance;
   const remaining=acceleration>0?2*distance/(speed+Math.sqrt(speed*speed+2*acceleration*distance)):speed>0?distance/speed:Infinity,used=Math.min(dt,remaining);
   b.track.distance=used===remaining?track.distances[i]:b.track.distance+speed*used+.5*acceleration*used*used;
   b.track.speed+=acceleration*used;dt-=used;
   b.p=mix(a,z,span?(b.track.distance-track.distances[i-1])/span:0);b.v=mul(unit(sub(z,a)),b.track.speed);
   if(b.track.distance<track.length-EPS)continue;
   const next=this.guidedTracks.filter(t=>t.id!==track.id&&len(sub(t.points[0],track.points.at(-1)))<=1+EPS&&dot(track.exit,t.entry)>=-EPS).sort((a,z)=>dot(track.exit,z.entry)-dot(track.exit,a.entry)||a.id.localeCompare(z.id))[0];
   this.emit('track-exit',{id:track.id,connected:!!next});
   if(next){this.enterGuidedTrack(next);continue;}
   b.state='playing';b.layer='lower';b.z=0;b.regionPrevious=null;b.trackImmuneUntil=this.time+.1;b.relocatedFrom=[...b.p];delete b.track;return dt;
  }
  return 0;
 }
 collide(dt){
  const b=this.ball,r=this.physics.ballRadius;let remaining=dt;
  b.slingshotContacts??=new Map();
  for(const [id,state]of b.slingshotContacts){const edges=(this.edges?.[b.layer]||[]).filter(e=>e.id===id&&e.slingshot&&e.slingshotFace&&this.edgeEnabled(e));if(!edges.some(e=>len(sub(b.p,nearest(b.p,e.a,e.b).p))<=r+(e.thickness||0)/2+.2))state.released=true;}
  if(this.targetRehitRequiresExit){
   b.targetContacts??=new Map();
   for(const [id,contact] of b.targetContacts){
    const touching=contact.layer===b.layer&&contact.edges.some(e=>e.c?len(sub(b.p,e.c))<=r+e.r+.2:len(sub(b.p,nearest(b.p,e.a,e.b).p))<=r+(e.thickness||0)/2+.2);
    if(!touching)b.targetContacts.delete(id);
   }
  }
  for(let pass=0;pass<10&&remaining>1e-6;pass++){
   this.limitSpeed();
   const d=mul(b.v,remaining),portal=this.portalHit(b.p,d),trackHit=this.guidedTrackHit(b.p,d);let best=null;
   for(const e of [...this.grids[b.layer].query(b.p,d,Math.max(5,r)),...this.dynamicEdges()]){
    if(this.targetHits.has(e.id))continue;
    if((e.kind==='plunger'||e.kind==='rescue-kicker')&&d[1]<=0)continue;
    if(!this.edgeEnabled(e))continue;
    // A flap passes forward travel; it blocks reverse travel only after the
    // complete ball has crossed, so it cannot close through a straddling ball.
    if(e.retractUp&&(b.v[1]<0||b.p[1]>e.c[1]))continue;
    if(e.n&&(dot(d,e.n)>=-EPS||dot(sub(b.p,e.a),e.n)<r-.08))continue;
   const h=e.c?circleHit(b.p,d,e.c,r+e.r):segmentHit(b.p,d,e.a,e.b,r+(e.thickness||0)/2);
    // A lane's launch face must not catch balls on its rounded end caps
    // through the adjacent divider. Check the impact, not the frame start.
    if(h&&e.faceOnly){const q=h.position||add(b.p,mul(d,h.t)),axis=sub(e.b,e.a),along=dot(sub(q,e.a),axis);if(along<0||along>dot(axis,axis))continue;}
    if(h&&(!best||h.t<best.t))best={...h,e};
   }
   for(const f of this.flippers){
    if(b.layer!==(f.layer||'lower'))continue;
    if(!f.cadet)f.cadet=new CadetFlipper(f,this.config);
    const h=f.cadet.find(b.p,b.v,(this.collisionTime??this.time)+dt-remaining,remaining);
    if(h&&(!best||h.t<best.t))best={...h,e:{id:f.id,kind:'flipper',f}};
   }
   if(trackHit&&(!best||trackHit.t<=best.t+1e-5)&&(!portal||trackHit.t<=portal.t)){this.enterGuidedTrack(trackHit.track);remaining=this.advanceGuidedTrack(remaining*(1-trackHit.t));if(b.state==='guided')return;continue;}
   if(portal&&(!best||portal.t<=best.t+1e-5)){
    const previous=[...b.p],layer=b.layer;b.p=add(b.p,mul(d,portal.t));remaining*=1-portal.t;
    // Resolve flags along the old-floor segment before the portal changes layers.
    this.flagSensors(previous,layer);this.transition(portal);if(b.state!=='playing')return;continue;
   }
   if(!best){b.p=add(b.p,d);break;}
   const hitDistance=best.distance??len(d)*best.t,incomingSpeed=len(b.v);
   b.p=best.position||add(add(b.p,mul(d,best.t)),mul(best.n,best.depth+.012));
   const e=best.e;if(e.kind==='plunger'&&b.v[1]>0&&best.n[1]<-.5){b.state='ready';b.v=[0,0];b.p[1]=this.g.plunger.rest_y-r;this.charge=0;this.chargeElapsed=0;this.emit('plunger-ready');return;}
   if(this.handleCollision(e)){if(b.state!=='playing')return;remaining-=(len(b.v)>1e-9?Math.abs(hitDistance/len(b.v)):remaining);continue;}
   const approach=Math.abs(dot(b.v,best.n)),restingRail=e.kind==='rail'&&!e.mechanic&&approach<5,active=e.kind==='active'||e.mechanic==='active_rebound',c=this.physics,sling=e.slingshot;
   let boost=0,threshold=1e9,elasticity=e.material==='roughWall'?c.roughWallElasticity:c.elasticity,smoothness=e.material==='roughWall'?c.roughWallSmoothness:c.collisionSmoothness;
   if(e.kind==='bumper'){boost=(e.material==='upperBumper'?c.upperBumperBoost:c.bumperBoost)*(e.bumperStrength==='strong'?1:.5);threshold=(this.bumperHitUntil.get(e.id)||0)>this.time?1e9:c.bumperThreshold;elasticity=c.bumperElasticity;smoothness=c.bumperSmoothness;}
   if(active&&(!e.slingshot||e.slingshotFace)){boost=c.activeBoost*(e.reboundStrength==='strong'?1:.5);threshold=c.activeThreshold;elasticity=c.activeElasticity;smoothness=c.activeSmoothness;}
   if(e.kind==='flipper')({boost,threshold,elasticity,smoothness}=e.f.cadet.response());
   {let slingFired=false;
    if(sling){const normalSpeed=dot(b.v,best.n),tangent=sub(b.v,mul(best.n,normalSpeed)),state=b.slingshotContacts.get(e.id);
     slingFired=e.slingshotFace&&normalSpeed<=-EPS&&(!state||state.released&&this.time>=state.readyAt);
     b.v=add(mul(tangent,smoothness),mul(best.n,Math.max(0,-normalSpeed)*elasticity+(slingFired?boost:0)));
     if(slingFired){b.slingshotContacts.set(e.id,{released:false,readyAt:this.time+.1});this.emit('slingshot-hit',{id:e.id});}
    }else if(restingRail){
     // Resting contact is sliding, not a new impact every gravity substep.
     // Apply surface damping per second, preserving gravity's tangent motion.
     b.v=mul(sub(b.v,mul(best.n,dot(b.v,best.n))),Math.pow(smoothness,remaining));b.p=add(b.p,mul(best.n,.012));
    }else b.v=basicCollision(b.v,best.n,elasticity,smoothness,threshold,boost);
    if(!best.isContact&&(!sling||slingFired))this.collisionEffect(e,approach);
    // TBumper::Fire disables its booster until the 0.1-second timer expires.
    if(!best.isContact&&e.kind==='bumper'&&approach>threshold){this.bumperHitUntil.set(e.id,this.time+c.bumperCooldown);this.scoreHit(e.id,500*this.bumperLevel(e.id),c.bumperCooldown);}
    if(!best.isContact&&(!sling||slingFired)&&(active||e.kind==='rebound'||e.kind==='target')){
     const repeatedTarget=this.targetRehitRequiresExit&&e.kind==='target'&&b.targetContacts.has(e.id);
     if(!repeatedTarget){
      if(this.targetRehitRequiresExit&&e.kind==='target')b.targetContacts.set(e.id,{layer:b.layer,edges:this.edges[b.layer].filter(edge=>edge.kind==='target'&&edge.id===e.id)});
      this.scoreHit(e.id,500);
     }
    }
    if(e.kind==='flipper'&&boost>10)this.emit('flipper-hit',{id:e.id});
   }
   // pb::collide consumes distance / POST-collision speed; clamp at the next ray.
   remaining-=e.slingshot||restingRail?(incomingSpeed>1e-9?Math.max(0,hitDistance)/incomingSpeed:remaining):(len(b.v)>1e-9?Math.abs(hitDistance/len(b.v)):remaining);
   if(this.rulesInterrupted())return;
  }
 }
 capture(id,p,release,layer,direction,points){const b=this.ball;if(this.time<b.immunity||b.state!=='playing'||this.balls.some(other=>other!==b&&other.state==='captured'&&other.held?.id===id))return;
  this.held={id,remaining:.65,speed:len(b.v),incoming:[...b.v],release,layer,direction};b.p=[...p];b.state='captured';this.scoreHit(id,points);this.emit('capture',{id});this.onCapture(id);
 }
 release(){const h=this.held,b=this.ball;let speed=clamp(h.speed*.68+90*this.physics.speedScale,160*this.physics.speedScale,380*this.physics.speedScale);b.p=[...h.release];b.layer=h.layer;b.z=0;
  b.v=mul(unit(h.direction),speed);
  b.state='playing';b.immunity=this.time+.5;this.held=null;this.limitSpeed();this.emit('release',{id:h.id,speed});}
 drain(){if(this.ball.state!=='playing')return;const b=this.ball;if(b.saverAvailable&&this.time<b.saverUntil){b.saverAvailable=false;b.state='saver-return';b.v=[0,0];b.saveReturnAt=this.time+.35;this.emit('ball-saved');return;}this.ball.state='drained';this.drainTimer=1.1;this.emit('drain');}
 selectBall(){this.ball=this.balls.find(b=>b.state==='ready')||this.balls.find(b=>b.state==='playing')||this.balls.find(b=>b.state!=='drained')||this.balls[0];}
 collideBalls(){const r=this.physics.ballRadius;
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
 step(dt=this.physics.step){
  if(this.g.gameplay?.ballTrails===false)return this.stepFrame(dt);
  const frameTime=this.time;
  this.stepFrame(dt);
  if(this.time!==frameTime)for(const b of this.balls){if(b.state==='playing'){b.trail||=[];b.trail.push({p:[...b.p],layer:b.layer});if(b.trail.length>24)b.trail.shift();}}
 }
 hasPendingBalls(){return this.freeBallQueue>0;}
 stepFrame(dt){if(this.paused||this.gameOver||this.beforeStep(dt)===false)return;this.time+=dt;this.tickRules(dt);
  if(this.balls.every(b=>b.state==='drained')&&!this.hasPendingBalls()){this.drainTimer-=dt;if(this.drainTimer<=0){if(this.extraLives>0){this.extraLives--;this.newBall(this.preserveTableOnDrain);this.emit('ready');}else if(this.ballNumber>=3){this.gameOver=true;this.emit('game-over');}else {this.ballNumber++;this.newBall(this.preserveTableOnDrain);this.emit('ready');}}return;}
  for(const b of this.balls)if(b.state==='saver-return'&&this.time>=b.saveReturnAt){
   const spawn=[this.g.plunger.x,this.g.plunger.rest_y-this.physics.ballRadius];
   if(this.balls.some(other=>other!==b&&other.state!=='drained'&&other.state!=='saver-return'&&other.layer===this.launchLayer()&&(other.state==='ready'||len(sub(other.p,spawn))<this.physics.ballRadius*2+3)))continue;
   Object.assign(b,{p:spawn,v:[0,0],state:'ready',layer:this.launchLayer(),z:this.launchHeight(),trail:[],immunity:0,lastPortal:-10,regionPrevious:null,vortexDwell:0});
   this.charge=this.chargeElapsed=0;this.input.launch=false;
   const gate=this.gates.find(g=>g.id==='shooter-return');if(gate){gate.closed=false;gate.pending=false;gate.pendingBall=null;}
   this.emit('ball-save-ready');
  }
  const ready=this.balls.find(b=>b.state==='ready');if(ready){if(this.input.launch){const duration=this.g.plunger.charge_seconds||1;this.chargeElapsed=clamp((this.chargeElapsed||0)+dt,0,duration);this.charge=this.chargePower(this.chargeElapsed);}ready.p[1]=this.g.plunger.rest_y-this.physics.ballRadius+this.g.plunger.stroke*this.charge;}
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
   for(const b of [...this.balls]){this.ball=b;let ballStep=h;
    if(b.state==='guided'){ballStep=this.advanceGuidedTrack(h);if(b.state==='guided')continue;}
    if(this.handleBallState(h))continue;
    if(b.state==='captured'){this.held.remaining-=h;if(this.held.remaining<=0)this.release();continue;}
    if(b.state!=='playing')continue;
    this.syncRegion();const previous=[...b.p],layer=b.layer;this.collide(ballStep);if(this.rulesInterrupted())return;if(b.state==='guided')continue;const sensorStart=b.relocatedFrom||previous;delete b.relocatedFrom;this.updateGates(sensorStart,layer);this.flagSensors(sensorStart,layer);this.afterBallStep(sensorStart,layer,h);this.limitSpeed();
   }
   this.collideBalls();this.afterSubstep();
  }
  this.collisionTime=null;
  if(this.balls.some(b=>b.state!=='drained'))this.balls=this.balls.filter(b=>b.state!=='drained');this.selectBall();
 }
 advance(seconds){for(let t=0;t<seconds;t+=this.physics.step)this.step(Math.min(this.physics.step,seconds-t));}
}
const api={CoreGame,Grid,EPS,clamp,cross,CONFIG,taperedGeometry,taperedOutline,taperedHit,basicCollision,segmentHit,circleHit,inside,nearest,unit,sub,add,mul,dot,len,mix};
// Compatibility for existing consumers; new maps subclass CoreGame directly.
let defaultGame;Object.defineProperty(api,'Game',{get(){if(!defaultGame){const map=typeof module!=='undefined'&&module.exports?require('./table-mechanics.js'):root.TableMechanics;if(!map)throw Error('Load table-mechanics.js before creating the game');defaultGame=map.createGame(api);}return defaultGame;}});
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PiratePhysics=api;
})(typeof window!=='undefined'?window:globalThis);
