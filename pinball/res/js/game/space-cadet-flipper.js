/* Adapted from SpaceCadetPinball (MIT).
 * Copyright (c) 2020-2021 Andrey Muzychenko.
 * See third_party/space-cadet/NOTICE.md.
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
