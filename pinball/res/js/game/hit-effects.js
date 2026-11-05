/* Shared collision budget, ring geometry and lifetime for both drawing backends. */
(function(root){'use strict';
const LIMITS=Object.freeze({canvas:5,webgl:30}),TAU=Math.PI*2;
const rasters=new Map();let rasterBytes=0;
function clearRasters(){for(const row of rasters.values())row.canvas.width=row.canvas.height=0;rasters.clear();rasterBytes=0;}
root.addEventListener?.('pagehide',clearRasters,{once:true});
const styles={
 rebound:{radius:3,speed:30,life:.24,width:1.2,endWidth:1.2,color:'#ffad42',alpha:1},
 bumper:{radius:8,speed:20,life:.24,width:1.2,endWidth:1.2,color:'#62dfff',alpha:1},
 burst:{radius:3,speed:42,life:.4,width:2.5,endWidth:.3,color:'#ffe69c',alpha:.85},
 swing:{radius:5,speed:45,life:.18,width:2,endWidth:0,color:'#fff0bb',alpha:1}
};
function state(game){
 if(game.hitEffects)return game.hitEffects;
 const queue=game.collisionVisualQueue||(game.collisionVisualQueue=[]);
 return game.hitEffects={queue,get limit(){return game.webglEffectsActive?LIMITS.webgl:LIMITS.canvas;},
  trim(){while(queue.length>this.limit)queue.shift().suppressed=true;},
  add(hit,list=null){while(queue.length&&game.time-queue[0].at>queue[0].life)queue.shift();queue.push(hit);this.trim();if(list){list.push(hit);if(list.length>this.limit)list.splice(0,list.length-this.limit);}},
  remove(hit){hit.suppressed=true;const i=queue.indexOf(hit);if(i>=0)queue.splice(i,1);},
  setWebGL(active){game.webglEffectsActive=active;this.trim();},
  clear(){for(const hit of queue)hit.suppressed=true;queue.length=0;}
 };
}
function ring(kind,p,plane,at,options={}){
 const style=styles[kind];return {...style,p:[...p],plane,at,...options,speed:style.speed*(options.strength??1),start:kind==='swing'?options.angle+Math.PI-.9:0,span:kind==='swing'?1.8:TAU};
}
function drawRing(ctx,hit,time,gpu=false){
 const age=time-hit.at;if(hit.suppressed||age<0||age>=hit.life)return;
 const t=age/hit.life,radius=hit.radius+age*hit.speed,width=hit.width+(hit.endWidth-hit.width)*t,alpha=hit.alpha*(1-t);
 if(gpu){ctx.ring(...hit.p,radius,width,hit.color,alpha,hit.start,hit.span);return;}
 if(typeof document!=='undefined'&&ctx.getTransform){
  const m=ctx.getTransform();if(!m.b&&!m.c&&m.a>0&&m.a===m.d){
   const r=radius*m.a,w=width*m.a,pad=Math.ceil(r+w/2+2),key=[r,w,hit.color,hit.start,hit.span].join('|');let row=rasters.get(key);
   if(!row){
    const canvas=document.createElement('canvas');canvas.width=canvas.height=pad*2;const c=canvas.getContext('2d');c.lineCap='round';c.strokeStyle=hit.color;c.lineWidth=w;c.beginPath();c.arc(pad,pad,r,hit.start,hit.start+hit.span);c.stroke();row={canvas,pad,bytes:canvas.width*canvas.height*4};rasters.set(key,row);rasterBytes+=row.bytes;
    while(rasters.size>64||rasterBytes>8*1024*1024){const oldest=rasters.keys().next().value,old=rasters.get(oldest);rasterBytes-=old.bytes;old.canvas.width=old.canvas.height=0;rasters.delete(oldest);}
   }else{rasters.delete(key);rasters.set(key,row);}
   ctx.save();ctx.globalAlpha*=alpha;ctx.shadowBlur=0;ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(row.canvas,Math.round(m.a*hit.p[0]+m.e-row.pad),Math.round(m.d*hit.p[1]+m.f-row.pad));ctx.restore();return;
  }
 }
 ctx.save();ctx.globalAlpha*=alpha;ctx.shadowBlur=0;ctx.strokeStyle=hit.color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.arc(...hit.p,radius,hit.start,hit.start+hit.span);ctx.stroke();ctx.restore();
}
function bounds(hit,time){const r=hit.radius+(time-hit.at)*hit.speed+3;return [hit.p[0]-r,hit.p[1]-r,hit.p[0]+r,hit.p[1]+r];}
const api={state,ring,drawRing,bounds,clearRasters};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HitEffects=api;
})(typeof window!=='undefined'?window:globalThis);
