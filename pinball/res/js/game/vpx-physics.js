// SPDX-License-Identifier: GPL-3.0-or-later
// Planar VPX ball equations, pinned to the revision in third_party/vpx/README.md.
(function(root){
'use strict';
const F=typeof module!=='undefined'&&module.exports?require('./vpx-flipper.js'):root.VpxFlipper;
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,k)=>a.map(v=>v*k),dot=(a,b)=>a[0]*b[0]+a[1]*b[1],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Native VPX values: table/bumper example defaults and Surface/HitObject defaults.
const CONFIG={physicsModel:'vpx2d',ballRadius:6.3,vpxLengthScale:6.3/25,...F.defaults,vpxGravityConstant:.97,vpxTableSlope:6,vpxFriction:.075,vpxWallFriction:.3,vpxElasticity:.3,vpxElasticityFalloff:0,vpxBumperForce:7,vpxBumperThreshold:1,vpxBumperElasticity:.3,vpxBumperFriction:.3,vpxSlingForce:8,vpxSlingThreshold:0,vpxSlingElasticity:.3,vpxSlingFriction:.3,vpxSlingElasticityFalloff:0,vpxKickerSpeed:40,vpxNudgeX:1.27,vpxNudgeY:2.58,vpxWellPull:0,vpxWellDrag:0,vpxRampHeight:22};
function parameters(c){
 const p=Object.create(c),k=c.vpxLengthScale;
 Object.defineProperties(p,{
  gravity:{get:()=>c.vpxGravityConstant*1.81751*k*1e4*Math.sin(c.vpxTableSlope*Math.PI/180)},
  verticalGravity:{get:()=>c.vpxGravityConstant*1.81751*k*1e4},
  drag:{value:0},rampDrag:{value:0},maxSpeed:{value:Infinity},speedScale:{value:1},step:{value:1/60},
  rampHeight:{get:()=>c.vpxRampHeight},kickbackSpeed:{get:()=>c.vpxKickerSpeed*k*100},wellPull:{get:()=>c.vpxWellPull*k*1e4},wellDrag:{get:()=>c.vpxWellDrag},
  elasticity:{get:()=>c.vpxElasticity},elasticityFalloff:{get:()=>c.vpxElasticityFalloff}
 });return p;
}
// LineSeg::HitTestBasic (rigid, lateral): all calculations use native VPU/VPT.
// Layout lines expose two independent normal faces; end joints are passive circles.
function lineFace(p,v,a,b,r,dt,k){
 p=mul(p,1/k);v=mul(v,1/(100*k));a=mul(a,1/k);b=mul(b,1/k);r/=k;dt*=100;
 const axis=sub(b,a),length=Math.hypot(...axis);if(!length)return null;
 const n=[-axis[1]/length,axis[0]/length],bnv=dot(v,n);if(bnv>.0001)return null;
 const bcpd=dot(sub(p,a),n),bnd=bcpd-r;if(bnd < -r||bcpd<0)return null;
 let time;if(bnd<=.05){time=bnd<=0||Math.abs(bnv)>.099||bnd<=-.05?0:bnd/(2*.05)+.5;}
 else if(Math.abs(bnv)>.0001)time=bnd/-bnv;else return null;
 if(!Number.isFinite(time)||time<0||time>dt)return null;
 const btv=v[0]*n[1]-v[1]*n[0],delta=sub(p,a),btd=delta[0]*n[1]-delta[1]*n[0]+btv*time;
 if(btd<0||btd>length)return null;
 return {t:dt?time/dt:0,position:mul(add(p,mul(v,time)),k),n,gap:bnd*k,depth:0,isContact:Math.abs(bnv)<=.099&&Math.abs(bnd)<=.05,orgNormalVelocity:bnv*k*100,part:'face'};
}
// HitCircle::HitTestBasicRadius, rigid/lateral circle without free Z motion.
function hitCircle(p,v,center,radius,ballRadius,dt,c){
 const k=c.vpxLengthScale,worldDt=dt;dt*=100;p=mul(p,1/k);v=mul(v,1/(100*k));center=mul(center,1/k);radius/=k;ballRadius/=k;
 const delta=sub(p,center),distance=Math.hypot(...delta);if(distance<=1e-6)return null;
 const b=dot(delta,v),bnv=b/distance;if(bnv>.0001)return null;
 const target=radius+ballRadius,gap=distance-target,a=dot(v,v);let time=0,isContact=false;
 if(gap<.05){if(gap < -ballRadius)return null;if(Math.abs(bnv)<=.099)isContact=true;else time=Math.max(0,-gap/bnv);}
 else {if(a<1e-8)return null;const disc=b*b-a*(dot(delta,delta)-target*target);if(disc<0)return null;const root=Math.sqrt(disc),t1=(-b-root)/a,t2=(-b+root)/a;time=t1*t2<0?Math.max(t1,t2):Math.min(t1,t2);}
 if(!Number.isFinite(time)||time<0||time>dt)return null;
 const position=add(p,mul(v,time)),normal=sub(position,center),size=Math.hypot(...normal);
 return {t:worldDt?time/(100*worldDt):0,position:mul(position,k),n:size>1e-4?mul(normal,1/size):[0,1],gap:gap*k,depth:0,isContact,orgNormalVelocity:bnv*k*100,part:'circle'};
}
function hitLine(p,v,a,b,r,dt,c,faceOnly=false,thickness=0,side=0){
 const k=c.vpxLengthScale,axis=sub(b,a),length=Math.hypot(...axis),half=thickness/2,n=length?[-axis[1]/length,axis[0]/length]:[0,0],offset=mul(n,half);
 const hits=[];if(side>=0)hits.push(lineFace(p,v,add(a,offset),add(b,offset),r,dt,k));if(side<=0)hits.push(lineFace(p,v,sub(b,offset),sub(a,offset),r,dt,k));
 if(!faceOnly)for(const point of [a,b]){const h=hitCircle(p,v,point,half,r,dt,c);if(h){h.part='endcap';hits.push(h);}}
 return hits.filter(Boolean).sort((a,b)=>a.t-b.t)[0]||null;
}
// HitBall::HandleStaticContact + ApplyFriction with only planar spin retained.
function contact(ball,n,gravity,dt,friction,c,originalNormalVelocity=dot(ball.v,n)){
 const vn=dot(ball.v,n),speedUnit=c.vpxLengthScale*100;if(vn>.099*speedUnit)return;
 const gn=dot(gravity,n),normalForce=Math.max(0,-(gn*dt+originalNormalVelocity));
 ball.v=add(ball.v,mul(n,normalForce));
 const t=[-n[1],n[0]],slip=dot(ball.v,t)-c.ballRadius*(ball.spin||0),staticContact=dot(ball.v,n)<=.025*speedUnit||Math.abs(slip)<.01*speedUnit;
 const numerator=staticContact?-dot(gravity,t):-slip*100,maxFriction=friction*Math.max(0,-gn),j=clamp(numerator/3.5,-maxFriction,maxFriction)*dt;
 ball.v=add(ball.v,mul(t,j));ball.spin=(ball.spin||0)-2.5*j/c.ballRadius;
}
// HitBall::Collide3DWall, with Z translation suppressed and sphere Z spin retained.
function collision(v,n,spin,r,e,friction,falloff,k,threshold=Infinity,boost=0,gap=0){
 let vn=dot(v,n);if(vn>=-.0001*k*100){if(vn>.0001*k*100||gap>=0)return {velocity:[...v],spin};vn=-.05*k*100;}
 const t=[-n[1],n[0]],slip=dot(v,t)-r*spin,reaction=-vn,j=clamp(-slip/3.5,-friction*reaction,friction*reaction),cor=falloff>0?e/(1+falloff*Math.abs(vn)/(18.53*k*100)):e;
 let velocity=add(sub(v,mul(n,(1+cor)*vn)),mul(t,j));if(reaction>=threshold)velocity=add(velocity,mul(n,boost));
 return {velocity,spin:spin-2.5*j/r,positionShift:mul(n,-.9875*gap>1e-4*k?Math.min(5*k,-.9875*gap):0)};
}
// HitBall::Collide for two free unit-mass balls (native restitution 0.8).
function ballCollision(a,b,n,gap,c){
 const k=c.vpxLengthScale;let normalSpeed=dot(sub(b,a),n);
 if(normalSpeed>=-.0001*k*100){if(normalSpeed>.0001*k*100||gap>=0)return null;normalSpeed=-.05*k*100;}
 const impulse=mul(n,-.9*normalSpeed),shift=-.9875*gap>1e-4*k?Math.min(5*k,-.9875*gap)/2:0;
 return {a:sub(a,impulse),b:add(b,impulse),shift:mul(n,shift)};
}
// HitBall::ApplyFriction projected onto the agreed XY / Z-spin-only model.
// Cross(wZ, Cross(wZ, [0,0,-r])) is zero. Do not retain partial XY spin:
// planar wall/flipper impulses do not evolve those axes consistently.
function floor(ball,acceleration,normalGravity,dt,c){
 delete ball.rollingSpin;
 const size=Math.hypot(...acceleration);if(size<1e-6)return;
 const direction=mul(acceleration,1/size),force=clamp(-size/3.5,-c.vpxFriction*normalGravity,c.vpxFriction*normalGravity);
 ball.v=add(ball.v,mul(direction,force*dt));
}
// VPX UpdateVelocities gravity in XY; Z describes table slope only.
// Default downhill gravity contributes to Y, not to the speed magnitude or X.
function accelerate(ball,acceleration,normalGravity,dt,c){
 ball.v=add(ball.v,mul(acceleration,dt));floor(ball,acceleration,normalGravity,dt,c);
}
// LineSegSlingshot::Collide: position-dependent inward drive, then rubber bounce.
function slingshot(ball,edge,n,c,enabled,gap=0){
 const k=c.vpxLengthScale,point=sub(ball.p,mul(n,c.ballRadius)),axis=sub(edge.b,edge.a),span=axis[0]*n[1]-axis[1]*n[0],delta=sub(point,edge.a),along=delta[0]*n[1]-delta[1]*n[0],position=Math.abs(span)>1e-6?2*along/span-1:-1;
 const force=enabled ? .5*(1-position*position)*c.vpxSlingForce*10*k*100:0;
 const v=sub(ball.v,mul(n,force));return collision(v,n,ball.spin||0,c.ballRadius,c.vpxSlingElasticity,c.vpxSlingFriction,c.vpxSlingElasticityFalloff,k,Infinity,0,gap);
}
const api={CONFIG,parameters,collision,floor,accelerate,slingshot,hitLine,hitCircle,lineFace,contact,ballCollision};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.VpxPhysics=api;
})(typeof globalThis!=='undefined'?globalThis:this);
