/* Simple collision rings. Does not alter collision geometry or collision audio. */
function createReboundEffects(game,sound){
 const hits=new Map(),byPlane=new Map(),original=game.collisionEffect.bind(game);
 function remember(id,hit){
  const old=hits.get(id);if(old)byPlane.get(old.plane)?.delete(id);
  let floor=byPlane.get(hit.plane);if(!floor){floor=new Map();byPlane.set(hit.plane,floor);}floor.set(id,hit);hits.set(id,hit);
 }
 game.collisionEffect=(edge,approach)=>{
  original(edge,approach);
  const bumper=edge.kind==='bumper'&&edge.c;
  if(approach<=0||(!bumper&&(!(edge.kind==='rebound'||edge.kind==='active'||edge.mechanic==='active_rebound')||!edge.a||!edge.b)))return;
  const previous=hits.get(edge.id);if(previous&&game.time-previous.at<.12)return;
  if(bumper){remember(edge.id,{kind:'bumper',plane:game.visualPlane(game.ball),at:game.time,center:[...edge.c],radius:edge.r});return;}
  const [a,b]=[edge.a,edge.b],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);if(!length)return;
  const t=Math.max(0,Math.min(1,((game.ball.p[0]-a[0])*dx+(game.ball.p[1]-a[1])*dy)/(length*length)));
  remember(edge.id,{plane:game.visualPlane(game.ball),at:game.time,p:[a[0]+dx*t,a[1]+dy*t]});
  // The existing collision plays metal above this threshold; avoid doubling it.
  if(approach<8)sound.play('metal');
 };
 const event=game.onEvent;game.onEvent=e=>{if(e.type==='new-game'||e.type==='ready'){hits.clear();byPlane.clear();}event?.(e);};
 return {damageBounds(plane=null){const boxes=[];for(const [id,h] of hits){const age=game.time-h.at;if(age>.24){hits.delete(id);byPlane.get(h.plane)?.delete(id);continue;}if(age<0||plane!==null&&h.plane!==plane)continue;const p=h.center||h.p,r=(h.center?h.radius+age*20:3+age*30)+3;boxes.push([p[0]-r,p[1]-r,p[0]+r,p[1]+r]);}return boxes;},draw(ctx,plane){
  const floor=byPlane.get(plane);if(!floor)return;
  for(const [id,h] of floor){const age=game.time-h.at;if(age<0||age>.24){hits.delete(id);floor.delete(id);continue;}
   ctx.save();ctx.globalAlpha*=1-age/.24;ctx.shadowBlur=0;ctx.strokeStyle=h.center?'#62dfff':'#ffad42';ctx.lineWidth=1.2;
   ctx.beginPath();ctx.arc(...(h.center||h.p),h.center?h.radius+age*20:3+age*30,0,Math.PI*2);ctx.stroke();
   ctx.restore();
  }
 }};
}
if(typeof module!=='undefined')module.exports=createReboundEffects;
