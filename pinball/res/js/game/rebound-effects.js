/* Simple collision rings. Does not alter collision geometry or collision audio. */
const ReboundHitEffects=typeof module!=='undefined'&&module.exports?require('./hit-effects.js'):HitEffects;
function createReboundEffects(game,sound){
 const hits=new Map(),byPlane=new Map(),original=game.collisionEffect.bind(game);
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
  const t=Math.max(0,Math.min(1,((game.ball.p[0]-a[0])*dx+(game.ball.p[1]-a[1])*dy)/(length*length)));
  remember(edge.id,ReboundHitEffects.ring('rebound',[a[0]+dx*t,a[1]+dy*t],game.visualPlane(game.ball),game.time));
  // The existing collision plays metal above this threshold; avoid doubling it.
  if(approach<8)sound.play('metal');
 };
 const event=game.onEvent;game.onEvent=e=>{if(e.type==='new-game'||e.type==='ready'){hits.clear();byPlane.clear();state.clear();}event?.(e);};
 return {drawGPU(gpu){for(const [id,h]of hits){if(h.suppressed||game.time-h.at>h.life){hits.delete(id);byPlane.get(h.plane)?.delete(id);continue;}ReboundHitEffects.drawRing(gpu,h,game.time,true);}},damageBounds(plane=null){const boxes=[];for(const [id,h]of hits){const age=game.time-h.at;if(h.suppressed||age>h.life){hits.delete(id);byPlane.get(h.plane)?.delete(id);continue;}if(age<0||plane!==null&&h.plane!==plane)continue;boxes.push(ReboundHitEffects.bounds(h,game.time));}return boxes;},draw(ctx,plane){
  const floor=byPlane.get(plane);if(!floor)return;
  for(const [id,h]of floor){const age=game.time-h.at;if(h.suppressed||age<0||age>h.life){hits.delete(id);floor.delete(id);continue;}ReboundHitEffects.drawRing(ctx,h,game.time);}
 }};
}

if(typeof module!=='undefined')module.exports=createReboundEffects;
