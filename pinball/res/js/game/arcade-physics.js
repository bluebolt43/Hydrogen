/* Gameplay-first planar physics. Inspired by action pinball; not DEMON'S TILT source. */
(function(root){
'use strict';
const defaults=typeof module!=='undefined'&&module.exports?require('../../config/arcade-physics-defaults.json'):root.ArcadePhysicsDefaults;
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],mul=(a,k)=>[a[0]*k,a[1]*k],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],len=a=>Math.hypot(...a),unit=a=>mul(a,1/(len(a)||1)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const CONFIG={...defaults,physicsModel:'arcade',ballRadius:6.3,step:1/60,speedScale:1,drag:0,rampDrag:0,rampHeight:22,wellPull:0,wellDrag:0};
function parameters(c){const p=Object.create(c);Object.defineProperties(p,{gravity:{get:()=>c.arcadeVerticalGravity*Math.sin(c.arcadeTableSlope*Math.PI/180)},verticalGravity:{get:()=>c.arcadeVerticalGravity},maxSpeed:{get:()=>c.arcadeMaxSpeed},kickbackSpeed:{get:()=>c.arcadeKickerSpeed}});return p;}
function circle(p,v,center,r,dt){const delta=sub(p,center),dist=len(delta),gap=dist-r,n=dist?mul(delta,1/dist):unit(mul(v,-1));if(gap<=.01){if(dot(v,n)>0&&gap>=0)return null;return {t:0,n,gap,position:[...p],part:'endcap'};}
 const speed2=dot(v,v),b=dot(delta,v),disc=b*b-speed2*(dot(delta,delta)-r*r);if(speed2<1e-12||b>=0||disc<0)return null;const time=(-b-Math.sqrt(disc))/speed2;if(time<0||time>dt)return null;const position=add(p,mul(v,time));return {t:time/dt,position,n:unit(sub(position,center)),gap:0,part:'endcap'};}
function line(p,v,a,b,r,dt,side=0,caps=true){const axis=sub(b,a),span=len(axis);if(!span)return circle(p,v,a,r,dt);const tangent=mul(axis,1/span),normal=[-tangent[1],tangent[0]];let best=null;
 for(const sign of (side?[side]:[-1,1])){const n=mul(normal,sign),distance=dot(sub(p,a),n),vn=dot(v,n);if(distance<-.01||vn>0)continue;const gap=distance-r,time=gap<=.01?0:vn<0?-gap/vn:Infinity;if(time>dt||time<0)continue;const position=add(p,mul(v,time)),along=dot(sub(position,a),tangent);if(along<0||along>span)continue;const hit={t:time/dt,position,n,gap:Math.min(0,gap),part:'face'};if(!best||hit.t<best.t)best=hit;}
 if(caps)for(const c of [a,b]){const h=circle(p,v,c,r,dt);if(h&&(!best||h.t<best.t))best=h;}return best;}
function move(f,pressed,dt,c){const old=f.angle,target=pressed?f.up:f.rest,rate=Math.abs(f.up-f.rest)/(pressed?c.arcadeFlipperSeconds:c.arcadeReturnSeconds);f.arcadeStartAngle=old;f.angle=old+clamp(target-old,-rate*dt,rate*dt);f.omega=(f.angle-old)/dt;f.arcadePressed=pressed;f.arcadeMoving=pressed&&Math.abs(f.omega)>1e-8;}
// Swept tapered capsule; continuous distance also for points beyond either end.
function surface(p,f,angle,r){const axis=[Math.cos(angle),Math.sin(angle)],along=clamp(dot(sub(p,f.pivot),axis)/f.length,0,1),center=add(f.pivot,mul(axis,f.length*along)),delta=sub(p,center),radius=f.radii[0]+(f.radii[1]-f.radii[0])*along;
 return {gap:len(delta)-radius-r,n:len(delta)>1e-8?unit(delta):[-axis[1],axis[0]],along};
}
function flipperHit(p,v,f,r,offset,dt){if(len(sub(p,f.pivot))>f.length+Math.max(...f.radii)+r+len(v)*dt)return null;const at=t=>{const angle=f.arcadeStartAngle+f.omega*(offset+t),position=add(p,mul(v,t)),s=surface(position,f,angle,r),arm=sub(position,f.pivot),sv=[-f.omega*arm[1],f.omega*arm[0]];return {...s,position,relative:dot(sub(v,sv),s.n)};};
 let previous=at(0);if(previous.gap<=.01&&previous.relative<0)return {...previous,t:0};
 for(let i=1;i<=8;i++){const time=dt*i/8,current=at(time);if(current.gap<=0&&previous.gap>0){let lo=dt*(i-1)/8,hi=time;for(let j=0;j<16;j++){const mid=(lo+hi)/2;if(at(mid).gap<=0)hi=mid;else lo=mid;}return {...at(hi),t:hi/dt};}previous=current;}return null;
}
function passive(v,n,c){const vn=dot(v,n);return vn<0?sub(v,mul(n,vn*(Math.abs(vn)<=c.arcadeContactSpeed?1:1+c.arcadeWallElasticity))):[...v];}
function response(ball,edge,hit,c){const vn=dot(ball.v,hit.n);let fired=false;
 if(edge.kind==='flipper'){const f=edge.f,angle=f.arcadeStartAngle+f.omega*hit.elapsed,axis=[Math.cos(angle),Math.sin(angle)];let up=[-axis[1],axis[0]];if(up[1]>0)up=mul(up,-1);
  if(f.arcadeMoving&&dot(hit.n,up)>.2&&!(ball.arcadeFlipperContacts||new Set()).has(f.id)){
   const direction=unit(add(up,mul(axis,(hit.along-.5)*.45))),speed=c.arcadeFlipperSpeed*(.72+.28*hit.along);ball.v=mul(direction,Math.max(speed,len(ball.v)));ball.arcadeFlipperContacts??=new Set();ball.arcadeFlipperContacts.add(f.id);fired=true;
  }else ball.v=passive(ball.v,hit.n,c);
 }else {const active=(edge.kind==='bumper'||edge.vpxSlingshot&&edge.slingshotFace&&hit.part==='face'),key=edge.id;
  if(active&&-vn>=c.arcadeTriggerSpeed&&-vn/Math.max(1e-8,len(ball.v))>=.15&&!(ball.arcadeActiveContacts||new Set()).has(key)){const speed=edge.kind==='bumper'?c.arcadeBumperSpeed:c.arcadeSlingSpeed,tangent=sub(ball.v,mul(hit.n,vn)),reflected=-vn*c.arcadeWallElasticity,extra=Math.min(Math.max(0,speed-reflected),-vn*.75);ball.v=add(tangent,mul(hit.n,reflected+extra));ball.arcadeActiveContacts??=new Set();ball.arcadeActiveContacts.add(key);fired=true;}else ball.v=passive(ball.v,hit.n,c);
 }return fired;
}
function collide(g,dt){const b=g.ball,c=g.physics,r=c.ballRadius;let remaining=dt;const handled=new Set();
 for(const id of b.arcadeActiveContacts||[]){const edges=(g.edges[b.layer]||[]).filter(e=>e.id===id);if(!edges.some(e=>e.c?len(sub(b.p,e.c))<=r+e.r+1:Math.abs(dot(sub(b.p,e.a),unit([e.a[1]-e.b[1],e.b[0]-e.a[0]])))<=r+(e.thickness||0)/2+1))b.arcadeActiveContacts.delete(id);}
 for(const id of b.arcadeFlipperContacts||[]){const f=g.flippers.find(f=>f.id===id);if(!f||surface(b.p,f,f.angle,r).gap>1||!f.arcadePressed)b.arcadeFlipperContacts.delete(id);}
 for(let pass=0;pass<12&&remaining>1e-8;pass++){const d=mul(b.v,remaining),portal=g.portalHit(b.p,d),track=g.guidedTrackHit(b.p,d);let best=null;
  for(const e of [...g.grids[b.layer].query(b.p,d,Math.max(5,r)),...g.dynamicEdges()]){if(handled.has(e.id)||g.targetHits.has(e.id)||!g.edgeEnabled(e))continue;if((e.kind==='plunger'||e.kind==='rescue-kicker')&&b.v[1]<=0)continue;if(e.retractUp&&(b.v[1]<0||b.p[1]>e.c[1]))continue;if(e.n&&(dot(d,e.n)>=0||dot(sub(b.p,e.a),e.n)<r-.08))continue;
   const hit=e.c?circle(b.p,b.v,e.c,r+e.r,remaining):line(b.p,b.v,e.a,e.b,r+(e.thickness||0)/2,remaining,e.vpxSide||0,!e.faceOnly);if(hit&&(!best||hit.t<best.t))best={...hit,e};}
  for(const f of g.flippers){if(handled.has(f.id)||b.layer!==(f.layer||'lower'))continue;const hit=flipperHit(b.p,b.v,f,r,dt-remaining,remaining);if(hit&&(!best||hit.t<best.t))best={...hit,e:{kind:'flipper',id:f.id,f}};}
  if(track&&(!best||track.t<=best.t)&&(!portal||track.t<=portal.t)){g.enterGuidedTrack(track.track);remaining=g.advanceGuidedTrack(remaining*(1-track.t));if(b.state==='guided')return;continue;}
  if(portal&&(!best||portal.t<=best.t)){b.p=add(b.p,mul(d,portal.t));remaining*=1-portal.t;g.transition(portal);if(b.state!=='playing')return;continue;}
  if(!best){b.p=add(b.p,d);break;}if(g.physicsTrace)g.physicsTrace({time:g.time,id:best.e.id,from:[...b.p],to:best.position,gap:best.gap,n:best.n,velocity:[...b.v]});b.p=add(best.position,mul(best.n,Math.max(0,-best.gap)+.012));remaining*=1-clamp(best.t,0,1);handled.add(best.e.id);const e=best.e;
  if(e.kind==='plunger'&&b.v[1]>0&&best.n[1]<-.5){b.state='ready';b.v=[0,0];b.p[1]=g.g.plunger.rest_y-r;g.charge=g.chargeElapsed=0;g.emit('plunger-ready');return;}
  if(g.handleCollision(e)){if(b.state!=='playing')return;continue;}
  const incoming=[...b.v],approach=Math.max(0,-dot(b.v,best.n)),fired=response(b,e,{...best,elapsed:dt-remaining},c);g.limitSpeed();if(g.physicsTrace)g.physicsTrace({phase:'response',time:g.time,id:e.id,kind:e.kind,n:best.n,part:best.part,incoming,velocity:[...b.v],fired});
  if(fired&&e.kind==='flipper')g.emit('flipper-hit',{id:e.id,along:best.along,speed:len(b.v)});
  if(fired&&e.kind!=='bumper'&&e.kind!=='flipper')g.emit('slingshot-hit',{id:e.id});
  if(e.kind==='bumper'&&fired)g.scoreHit(e.id,500*g.bumperLevel(e.id));else if(approach>c.arcadeContactSpeed&&(e.kind==='rebound'||e.kind==='active'||e.kind==='target'))g.scoreHit(e.id,500);
  if(approach>c.arcadeContactSpeed)g.collisionEffect(e,approach);
 }
}
const api={CONFIG,parameters,circle,line,move,surface,flipperHit,passive,response,collide};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.ArcadePhysics=api;
})(typeof window!=='undefined'?window:globalThis);
