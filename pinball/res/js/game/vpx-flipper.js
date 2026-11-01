// SPDX-License-Identifier: GPL-3.0-or-later
// XY adaptation of Visual Pinball's hitflipper.cpp and collide.h, revision
// c21daff1a72e1fe4a5c23c1caf129070df4a670b. See third_party/vpx/README.md.
(function(root){
'use strict';
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,k)=>a.map(v=>v*k),dot=(a,b)=>a[0]*b[0]+a[1]*b[1],cross=(a,b)=>a[0]*b[1]-a[1]*b[0],turn=a=>[-a[1],a[0]],length=a=>Math.hypot(...a),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
// Official assets/exampleTable.vpx (both flippers), not a tuned speed curve.
const defaults={vpxFlipperMass:.7,vpxFlipperStrength:1800,vpxFlipperElasticity:.8,vpxFlipperElasticityFalloff:.001,vpxFlipperFriction:.8,vpxFlipperReturnStrength:.05,vpxFlipperEOSTorque:.25,vpxFlipperEOSTorqueAngle:6,vpxFlipperCoilRampUp:0};
const scale=c=>c.vpxLengthScale??c.ballRadius/25, inertia=(f,c)=>c.vpxFlipperMass*f.length*f.length/3;
function reset(f){f.omega=0;f.vpxTorque=0;f.vpxAcceleration=0;f.vpxInContact=false;f.vpxContactTorque=0;delete f.vpxSweep;}
// UpdateVelocities: strength is torque in VP units; 1 VPT = .01 seconds.
function drive(f,pressed,dt,c){
 const k=scale(c),strength=c.vpxFlipperStrength*k*k/1e-4,direction=Math.sign(f.up-f.rest),eos=c.vpxFlipperEOSTorqueAngle*Math.PI/180;
 let desired=strength*(pressed?1:-c.vpxFlipperReturnStrength);
 if(eos>0&&Math.abs(f.angle-f.up)<eos){const blend=(Math.abs(f.angle-f.up)/eos)**4;desired*=blend+c.vpxFlipperEOSTorque*(1-blend);}
 desired*=direction;
 const rampVP=c.vpxFlipperCoilRampUp<=0?1e6:Math.min(c.vpxFlipperStrength/c.vpxFlipperCoilRampUp,1e6),ramp=rampVP*k*k/1e-6;
 f.vpxTorque=(f.vpxTorque||0)+clamp(desired-(f.vpxTorque||0),-ramp*dt,ramp*dt);
 let torque=f.vpxTorque;f.vpxInContact=false;
 const low=Math.min(f.rest,f.up),high=Math.max(f.rest,f.up);
 if(Math.abs(f.omega||0)<=1){
  if(f.angle>=high-.01&&torque>0){f.angle=high;f.vpxInContact=true;}
  else if(f.angle<=low+.01&&torque<0){f.angle=low;f.vpxInContact=true;}
  if(f.vpxInContact){f.vpxContactTorque=torque;f.omega=0;torque=0;}
 }
 f.vpxAcceleration=torque/inertia(f,c);f.omega=(f.omega||0)+f.vpxAcceleration*dt;
}
// UpdateDisplacements/GetHitTime: split at a stopper, then recoil momentum -0.3.
function motion(f,start,omega,duration,offset=0){
 const low=Math.min(f.rest,f.up),high=Math.max(f.rest,f.up),segments=[];let time=offset,angle=start;
 while(time<duration-1e-12){
  const stop=omega>0?high:low,stopTime=omega?(stop-angle)/omega:Infinity,span=Math.min(duration-time,Math.max(0,stopTime));
  if(span>1e-12){segments.push({start:time,end:time+span,angle,omega});angle=clamp(angle+omega*span,low,high);time+=span;}
  if(stopTime<=duration-time+span+1e-12&&omega){omega*=-.3;if(Math.abs(omega)<.05)omega=0;}
  else break;
  if(!omega){segments.push({start:time,end:duration,angle,omega:0});time=duration;}
 }
 return {segments,angle,omega,duration};
}
function move(f,pressed,dt,c){drive(f,pressed,dt,c);f.vpxSweep=motion(f,f.angle,f.omega,dt);f.angle=f.vpxSweep.angle;f.omega=f.vpxSweep.omega;}
function state(f,time){const s=f.vpxSweep;if(!s)return {angle:f.angle,omega:f.omega||0};const seg=s.segments.find(a=>time<a.end-1e-12)||s.segments.at(-1);return seg?{angle:seg.angle+seg.omega*clamp(time-seg.start,0,seg.end-seg.start),omega:seg.omega}:{angle:f.angle,omega:f.omega||0};}
function react(f,time,c){
 const old=f.vpxSweep;if(!old)return;
 const angle=state(f,time).angle,next=motion(f,angle,f.omega,old.duration,time);
 next.segments=[...old.segments.filter(s=>s.start<time).map(s=>({...s,end:Math.min(s.end,time)})),...next.segments];f.vpxSweep=next;f.angle=next.angle;f.omega=next.omega;
}
function surface(f,position,normal,radius){const arm=sub(sub(position,mul(normal,radius)),f.pivot);return {arm,velocity:mul(turn(arm),f.omega||0)};}
function elasticity(value,falloff,velocity,c){return falloff>0?value/(1+falloff*Math.abs(velocity)/ (18.53*scale(c)*100)):value;}
// HitFlipper::Collide: include the stopper's support and use PRE-impact slip.
function response(ball,f,n,c,omega=f.omega,gap=0){
 f.omega=omega;const {arm,velocity}=surface(f,ball.p,n,c.ballRadius),t=turn(n),relative=sub(sub(ball.v,velocity),mul(t,c.ballRadius*(ball.spin||0)));let vn=dot(relative,n);const k=scale(c),low=1e-4*k*100;
 if(vn>=-low){if(vn>low||gap>=0)return 0;vn=-.05*k*100;}
 if(gap<0)ball.p=add(ball.p,mul(n,Math.min(5*k,-.9875*gap)));
 const I=inertia(f,c),lever=cross(arm,n),blocked=f.vpxInContact&&f.vpxContactTorque*(-lever)>=0,e=elasticity(c.vpxFlipperElasticity,c.vpxFlipperElasticityFalloff,vn,c);
 let j=-(1+e)*vn/(1+(blocked?0:lever*lever/I)),angular=-lever*j*(blocked?.5:1);
 if(f.vpxInContact&&angular*f.vpxContactTorque<0&&(-angular/f.vpxContactTorque<=.005||vn+j>0)){j=-(1+e)*vn;angular=0;}
 ball.v=add(ball.v,mul(n,j));f.omega+=angular/I;
 const vt=dot(relative,t),tl=cross(arm,t),friction=clamp(-vt/(3.5+tl*tl/I),-c.vpxFlipperFriction*j,c.vpxFlipperFriction*j);
 ball.v=add(ball.v,mul(t,friction));ball.spin=(ball.spin||0)-2.5*friction/c.ballRadius;f.omega-=tl*friction/I;
 return dot(velocity,n)>10?j:0;
}
// HitFlipper::Contact: support force from relative surface acceleration;
// static/dynamic friction are forces integrated for the remaining time.
function contact(ball,f,n,c,dt,gravity,omega=f.omega,gap=0){
 f.omega=omega;const originalVn=dot(sub(ball.v,surface(f,ball.p,n,c.ballRadius).velocity),n);
 if(gap<0)ball.v=add(ball.v,mul(n,.1*scale(c)*100));
 const r=c.ballRadius,{arm,velocity}=surface(f,ball.p,n,r),t=turn(n),spin=ball.spin||0,relative=sub(sub(ball.v,velocity),mul(t,r*spin)),vn=dot(relative,n),k=scale(c);
 if(vn>.099*k*100)return;
 const aB=add(gravity,mul(n,r*spin*spin)),aF=add(mul(turn(arm),f.vpxAcceleration||0),mul(arm,-omega*omega)),arel=sub(aB,aF),normalAcc=dot(arel,n)+2*dot(mul(turn(n),omega),relative);
 if(normalAcc>=0)return;
 const I=inertia(f,c),lever=cross(arm,n),force=-normalAcc/(1+lever*lever/I),j=force*dt;
 ball.v=add(ball.v,mul(n,j-originalVn));f.omega-=lever*j/I;
 const slip=dot(relative,t),slipAcc=dot(arel,t),numer=Math.abs(slip)<.01*k*100?-slipAcc:-slip*100,tl=cross(arm,t),friction=clamp(numer/(3.5+tl*tl/I),-force*c.vpxFlipperFriction,force*c.vpxFlipperFriction)*dt;
 ball.v=add(ball.v,mul(t,friction));ball.spin=spin-2.5*friction/r;f.omega-=tl*friction/I;
}
// HitTestFlipperFace/End: original 20-pass modified false-position solver.
function rootTime(sample,dt,r,endRadius,k){
 let time=0,t0,t1,d0,d1,previous,hit,iteration;
 for(iteration=1;iteration<=20;iteration++){
  hit=sample(time);const d=hit.gap;if(Math.abs(d)<=.01*k)break;
  if(iteration===1){if(d<-(r+endRadius))return null;if(d<=.05*k)break;t0=t1=dt;d0=0;d1=d;}
  else if(iteration===2){if(previous*d>0)return null;t0=0;t1=dt;d0=previous;d1=d;}
  else if(d*d0<=0){t1=time;d1=d;if(previous*d>0)d0*=.5;}
  else {t0=time;d0=d;if(previous*d>0)d1*=.5;}
  time=t0-d0*(t1-t0)/(d1-d0);previous=d;
 }
 if(!Number.isFinite(time)||time<0||time>dt||iteration>20&&Math.abs(hit.gap)>r*.25)return null;
 return {...hit,time};
}
function hit(p,v,f,r,offset,dt,c){
 const k=scale(c),q=(f.radii[0]-f.radii[1])/f.length,h=Math.sqrt(1-q*q),s=f.vpxSweep,ends=s?s.segments.filter(a=>a.end>offset&&a.start<offset+dt):[{start:offset,end:offset+dt,angle:f.angle,omega:f.omega||0}];
 for(const seg of ends){
  const begin=Math.max(offset,seg.start),span=Math.min(offset+dt,seg.end)-begin,start=state(f,begin),position=add(p,mul(v,begin-offset));
  function finish(a,end=false){
   if(!a)return null;const elapsed=begin-offset+a.time,point=add(p,mul(v,elapsed)),angle=start.angle+start.omega*a.time,omega=(angle>=Math.max(f.rest,f.up)&&start.omega>0||angle<=Math.min(f.rest,f.up)&&start.omega<0)?0:start.omega,arm=sub(sub(point,mul(a.n,r)),f.pivot),vn=dot(sub(v,mul(turn(arm),omega)),a.n);
   if(end?vn>=0:vn>1e-4*k*100&&Math.abs(vn)>.099*k*100)return null;
   return {t:elapsed/dt,n:a.n,depth:Math.max(0,-a.gap),gap:a.gap,position:point,distance:length(v)*elapsed,angularVelocity:omega,isContact:Math.abs(vn)<=.099*k*100&&a.gap<=.05*k};
  }
  for(const sign of [1,-1]){
   const face=rootTime(time=>{const angle=start.angle+start.omega*time,axis=[Math.cos(angle),Math.sin(angle)],n=add(mul(axis,q),mul(turn(axis),sign*h)),a=add(f.pivot,mul(n,f.radii[0])),delta=sub(add(position,mul(v,time)),a),tangent=sign===1?[n[1],-n[0]]:turn(n);return {n,gap:dot(delta,n)-r,along:dot(delta,tangent)};},span,r,f.radii[1],k);
   if(face&&face.along>=0&&face.along<=f.length*h){const found=finish(face);if(found)return found;}
  }
  const end=rootTime(time=>{const angle=start.angle+start.omega*time,tip=add(f.pivot,mul([Math.cos(angle),Math.sin(angle)],f.length)),delta=sub(add(position,mul(v,time)),tip),d=length(delta);return {n:mul(delta,1/(d||1)),gap:d-r-f.radii[1]};},span,r,f.radii[1],k),found=finish(end,true);if(found)return found;
 }
 return null;
}
const api={defaults,reset,drive,move,state,react,surface,response,contact,hit,inertia,elasticity};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.VpxFlipper=api;
})(typeof globalThis!=='undefined'?globalThis:this);
