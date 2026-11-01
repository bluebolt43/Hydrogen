/* Visual-only spring face, sparks and bumper light pulses. Does not alter collision geometry. */
function createReboundEffects(game,sound){
 const hits=new Map(),original=game.collisionEffect.bind(game);
 game.collisionEffect=(edge,approach)=>{
  original(edge,approach);
  const bumper=edge.kind==='bumper'&&edge.c;
  if(approach<=0||(!bumper&&(!(edge.kind==='rebound'||edge.kind==='active'||edge.mechanic==='active_rebound')||!edge.a||!edge.b)))return;
  const previous=hits.get(edge.id);if(previous&&game.time-previous.at<.12)return;
  if(bumper){hits.set(edge.id,{kind:'bumper',plane:game.visualPlane(game.ball),at:game.time,center:[...edge.c],radius:edge.r});return;}
  const [a,b]=[edge.a,edge.b],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);if(!length)return;
  let n=[-dy/length,dx/length];if((game.ball.p[0]-a[0])*n[0]+(game.ball.p[1]-a[1])*n[1]<0)n=n.map(v=>-v);
  const t=Math.max(0,Math.min(1,((game.ball.p[0]-a[0])*dx+(game.ball.p[1]-a[1])*dy)/(length*length)));
  hits.set(edge.id,{plane:game.visualPlane(game.ball),at:game.time,a:[...a],b:[...b],n,p:[a[0]+dx*t,a[1]+dy*t]});
  // The existing collision plays metal above this threshold; avoid doubling it.
  if(approach<8)sound.play('metal');
 };
 const event=game.onEvent;game.onEvent=e=>{if(e.type==='new-game'||e.type==='ready')hits.clear();event?.(e);};
 return {draw(ctx,plane){
  for(const [id,h] of hits){const age=game.time-h.at;if(age<0||age>.24){hits.delete(id);continue;}
   if(h.plane!==plane)continue;
   if(h.kind==='bumper'){
    const fade=1-age/.24;ctx.save();ctx.globalAlpha*=fade;ctx.shadowColor='#83eaff';ctx.shadowBlur=18*fade;
    ctx.beginPath();ctx.arc(...h.center,h.radius,0,Math.PI*2);ctx.strokeStyle='#edffff';ctx.lineWidth=2.2;ctx.stroke();
    ctx.shadowBlur=8*fade;ctx.beginPath();ctx.arc(...h.center,h.radius+age*20,0,Math.PI*2);ctx.strokeStyle='#62dfff';ctx.lineWidth=1.2;ctx.stroke();ctx.restore();continue;
   }
   const fade=1-age/.24,push=2.5*Math.sin(Math.PI*Math.min(1,age/.14));
   ctx.save();ctx.globalAlpha*=fade;ctx.lineCap='round';ctx.shadowColor='#ffae42';ctx.shadowBlur=12*fade;
   ctx.beginPath();ctx.moveTo(h.a[0]+h.n[0]*push,h.a[1]+h.n[1]*push);ctx.lineTo(h.b[0]+h.n[0]*push,h.b[1]+h.n[1]*push);
   ctx.strokeStyle='#ffad42';ctx.lineWidth=3.2;ctx.stroke();ctx.strokeStyle='#fff3bf';ctx.lineWidth=1.1;ctx.stroke();ctx.shadowBlur=0;
   for(let i=0;i<5;i++){const angle=Math.atan2(h.n[1],h.n[0])+(i-2)*.35,r=age*(30+i*7),x=h.p[0]+Math.cos(angle)*r,y=h.p[1]+Math.sin(angle)*r;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(angle)*1.7,y+Math.sin(angle)*1.7);ctx.stroke();}
   ctx.restore();
  }
 }};
}
if(typeof module!=='undefined')module.exports=createReboundEffects;
