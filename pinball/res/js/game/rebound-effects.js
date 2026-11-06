/* Simple collision rings. Does not alter collision geometry or collision audio. */
const ReboundHitEffects=typeof module!=='undefined'&&module.exports?require('./hit-effects.js'):HitEffects;
function createReboundEffects(game,sound){
 const hits=new Map(),byPlane=new Map(),original=game.collisionEffect.bind(game);let preparedAt=null,preparedRevision=-1,version=0,wasActive=false;
 const boundsByPlane=new Map(),empty=[];
 const state=ReboundHitEffects.state(game);
 function remember(id,hit){
  const old=hits.get(id);if(old){byPlane.get(old.plane)?.delete(id);state.remove(old);}state.add(hit);
  let floor=byPlane.get(hit.plane);if(!floor){floor=new Map();byPlane.set(hit.plane,floor);}floor.set(id,hit);hits.set(id,hit);
 }
 game.collisionEffect=(edge,approach)=>{
  original(edge,approach);
  const bumper=edge.kind==='bumper'&&edge.c;
  if(approach<=0||(!bumper&&(!(edge.kind==='rebound'||edge.kind==='active'||edge.mechanic==='active_rebound')||!edge.a||!edge.b)))return;
  const previous=hits.get(edge.id);if(previous&&game.time-previous.at<.12)return;
  if(bumper){remember(edge.id,ReboundHitEffects.ring('bumper',edge.c,game.visualPlane(game.ball),game.time,{radius:edge.r}));return;}
  const [a,b]=[edge.a,edge.b],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);if(!length)return;
  const side=(game.ball.p[0]-a[0])*(-dy)+(game.ball.p[1]-a[1])*dx<0?-1:1;
  const face={a:[...a],b:[...b],n:[-dy/length*side,dx/length*side]};
  const t=Math.max(0,Math.min(1,((game.ball.p[0]-a[0])*dx+(game.ball.p[1]-a[1])*dy)/(length*length)));
  remember(edge.id,ReboundHitEffects.ring('rebound',[a[0]+dx*t,a[1]+dy*t],game.visualPlane(game.ball),game.time,{face}));
  // The existing collision plays metal above this threshold; avoid doubling it.
  if(approach<8)sound.play('metal');
 };
 // Only event lists and damage rectangles are retained; there are no effect images.
 function prepare(){
  if(preparedAt===game.time&&preparedRevision===state.revision)return;
  preparedAt=game.time;preparedRevision=state.revision;
  for(const rows of boundsByPlane.values())rows.length=0;
  let active=false;
  for(const [id,h]of hits){
   const age=game.time-h.at;
   if(h.suppressed||age>=h.life){hits.delete(id);byPlane.get(h.plane)?.delete(id);continue;}
   if(age<0)continue;active=true;
   let rows=boundsByPlane.get(h.plane);if(!rows){rows=[];boundsByPlane.set(h.plane,rows);}
   rows.push(ReboundHitEffects.bounds(h,game.time));
   if(h.face){const {a,b,n}=h.face,push=2.5*Math.sin(Math.PI*Math.min(1,age/.14)),x=n[0]*push,y=n[1]*push;rows.push([Math.min(a[0],b[0])+x-3,Math.min(a[1],b[1])+y-3,Math.max(a[0],b[0])+x+3,Math.max(a[1],b[1])+y+3]);}
  }
  if(active||wasActive)version++;wasActive=active;
 }
 const event=game.onEvent;game.onEvent=e=>{if(e.type==='new-game'||e.type==='ready'){hits.clear();byPlane.clear();state.clear();}event?.(e);};
 return {get revision(){prepare();return version;},drawGPU(gpu){prepare();for(const h of hits.values())ReboundHitEffects.drawRing(gpu,h,game.time,true);},damageBounds(plane=null){
  prepare();return plane===null?[...boundsByPlane.values()].flat():boundsByPlane.get(plane)||empty;
 },draw(ctx,plane){
  prepare();const floor=byPlane.get(plane);if(floor)ReboundHitEffects.drawRings(ctx,floor.values(),game.time);
 }};
}

if(typeof module!=='undefined')module.exports=createReboundEffects;
