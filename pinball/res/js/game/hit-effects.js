/* Shared collision budget, ring geometry and lifetime for both drawing backends. */
(function(root){'use strict';
const LIMIT=10,TAU=Math.PI*2;
const styles={
 rebound:{radius:3,speed:30,life:.24,width:1.2,endWidth:1.2,color:'#ffad42',alpha:1},
 bumper:{radius:8,speed:20,life:.24,width:1.2,endWidth:1.2,color:'#62dfff',alpha:1},
 burst:{radius:3,speed:42,life:.4,width:2.5,endWidth:.3,color:'#ffe69c',alpha:.85},
 swing:{radius:5,speed:45,life:.18,width:2,endWidth:0,color:'#fff0bb',alpha:1}
};
function state(game){
 if(game.hitEffects)return game.hitEffects;
 const queue=game.collisionVisualQueue||(game.collisionVisualQueue=[]);
 return game.hitEffects={queue,limit:LIMIT,revision:0,
  trim(){while(queue.length>this.limit){queue.shift().suppressed=true;this.revision++;}},
  add(hit,list=null){while(queue.length&&game.time-queue[0].at>queue[0].life)queue.shift();queue.push(hit);this.revision++;this.trim();if(list){list.push(hit);if(list.length>this.limit)list.splice(0,list.length-this.limit);}},
  remove(hit){hit.suppressed=true;this.revision++;const i=queue.indexOf(hit);if(i>=0)queue.splice(i,1);},
  setWebGL(active){game.webglEffectsActive=active;this.trim();},
  clear(){for(const hit of queue)hit.suppressed=true;queue.length=0;this.revision++;}
 };
}
function ring(kind,p,plane,at,options={}){
 const style=styles[kind];return {...style,p:[...p],plane,at,...options,speed:style.speed*(options.strength??1),start:kind==='swing'?options.angle+Math.PI-.9:0,span:kind==='swing'?1.8:TAU};
}
function paintRing(ctx,hit,time,gpu,baseAlpha){
 const age=time-hit.at;if(hit.suppressed||age<0||age>=hit.life)return;
 const t=age/hit.life,radius=hit.radius+age*hit.speed,width=hit.width+(hit.endWidth-hit.width)*t,alpha=hit.alpha*(1-t);
 if(gpu){ctx.ring(...hit.p,radius,width,hit.color,alpha,hit.start,hit.span);return;}
 ctx.globalAlpha=baseAlpha*alpha;
 ctx.strokeStyle=hit.color;ctx.lineWidth=width;ctx.beginPath();ctx.arc(...hit.p,radius,hit.start,hit.start+hit.span);ctx.stroke();
 if(hit.face){const {a,b,n}=hit.face,push=2.5*Math.sin(Math.PI*Math.min(1,age/.14));ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(a[0]+n[0]*push,a[1]+n[1]*push);ctx.lineTo(b[0]+n[0]*push,b[1]+n[1]*push);ctx.stroke();}
}
function drawRing(ctx,hit,time,gpu=false){
 if(gpu){paintRing(ctx,hit,time,true,1);return;}
 const age=time-hit.at;if(hit.suppressed||age<0||age>=hit.life)return;
 const alpha=ctx.globalAlpha;ctx.shadowBlur=0;ctx.lineCap='round';paintRing(ctx,hit,time,false,alpha);ctx.globalAlpha=alpha;
}
function drawRings(ctx,hits,time){
 let started=false;const alpha=ctx.globalAlpha;
 for(const hit of hits){
  const age=time-hit.at;if(hit.suppressed||age<0||age>=hit.life)continue;
  if(!started){started=true;ctx.shadowBlur=0;ctx.lineCap='round';}
  paintRing(ctx,hit,time,false,alpha);
 }if(started)ctx.globalAlpha=alpha;
}
function bounds(hit,time){const r=hit.radius+(time-hit.at)*hit.speed+3;return [hit.p[0]-r,hit.p[1]-r,hit.p[0]+r,hit.p[1]+r];}
const api={state,ring,drawRing,drawRings,bounds};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HitEffects=api;
})(typeof window!=='undefined'?window:globalThis);
