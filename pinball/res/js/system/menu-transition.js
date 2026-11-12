/* One 360 x 640 object stage, shared renderer and independently timed tracks. */
(function(root){
function startMenuTransition(host,from,to,getImage,settings,reverse=false,sound=true){
 const animations=[],jobs=[],pieces=new Set(),painters=new Map(),t=settings.durationsMs;
 let pending=[],frame=null,paused=false,disposed=false,resolvePrepared,rejectPrepared;
 const prepared=new Promise((resolve,reject)=>{resolvePrepared=resolve;rejectPrepared=reject;});
 function release(node){painters.delete(node);pieces.delete(node);node.width=node.height=0;node.remove();}
 function stopFrame(){if(frame!==null)cancelAnimationFrame(frame);frame=null;}
 function schedule(){if(pending.length&&!paused&&!disposed&&frame===null)frame=requestAnimationFrame(prepareIncoming);}
 function prepareIncoming(){frame=null;if(paused||disposed)return;try{pending=pending.filter(row=>{if(row.animation.currentTime===null||row.animation.currentTime<row.delay-50)return true;painters.get(row.node)?.();painters.delete(row.node);return false;});}catch(error){rejectPrepared(error);return;}if(!pending.length)resolvePrepared();else schedule();}
 const lookup=getImage,images=new Map();getImage=src=>{if(!images.has(src))images.set(src,lookup(src));return images.get(src);};
 for(const src of new Set([...SystemLayout.imageSources(from),...SystemLayout.imageSources(to)]))getImage(src);
 const kind=o=>o.type==='frame'?'frame':/system-marker-/.test(o.src)?'system':'title';
 const rank=o=>o.action==='tutorial'?0:Number.isInteger(o.stage)?o.stage:o.action==='endless'?9:10;
 function piece(o,deferred=false){
  const pad=o.type==='frame'?64:0,left=o.x-pad,top=o.y-pad,w=o.width+pad*2,h=o.height+pad*2;
  const c=document.createElement('canvas');c.style.cssText=`position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px;backface-visibility:hidden;transform-origin:${w/2}px ${h/2}px;z-index:${kind(o)==='frame'?10:kind(o)==='title'?20:30}`;
  const density=Math.max(3,host.parentElement.getBoundingClientRect().width/360*(devicePixelRatio||1));c.width=c.height=0;pieces.add(c);
  const obj=JSON.parse(JSON.stringify(o));if(obj.src==='res/img/system-marker-sound.png'&&!sound)obj.src='res/img/system-marker-muted.png';
  const paint=()=>{c.width=Math.ceil(w*density);c.height=Math.ceil(h*density);const ctx=c.getContext('2d');ctx.scale(density,density);ctx.translate(-left,-top);SystemLayout.draw(ctx,{canvas:from.canvas,objects:[obj]},getImage);};
  if(deferred)painters.set(c,paint);else paint();host.append(c);return c;
 }
 function animate(node,keyframes,duration,delay,exit){const a=node.animate(keyframes,{duration,delay,easing:settings.easing,fill:'both'});a.pause();animations.push(a);if(painters.has(node))pending.push({node,animation:a,delay});jobs.push(a.finished.then(()=>{if(exit)release(node);}).catch(()=>{}));}
 const shared=new Set();for(const o of from.objects.filter(o=>kind(o)==='system')){const next=to.objects.find(n=>n.src===o.src);if(next){shared.add(o.src);piece(next);}}
 const count=from.objects.filter(o=>kind(o)==='frame').length,outEnd=count?t.frameOut+(count-1)*t.stagger:0;
 for(const [objects,incoming] of [[from.objects,false],[to.objects,true]]){
  const order=new Map(objects.filter(o=>kind(o)==='frame').sort((a,b)=>rank(a)-rank(b)).map((o,i)=>[o.id,i]));
  for(const o of objects){const type=kind(o);if(type==='system'&&shared.has(o.src))continue;const c=piece(o,incoming);
   if(type==='frame'){
    const angle=reverse?-90:90;
    animate(c,incoming?[{transform:`rotateY(${-angle}deg)`,visibility:'hidden',offset:0},{transform:`rotateY(${-angle}deg)`,visibility:'visible',offset:.001},{transform:'rotateY(0deg)',visibility:'visible'}]:[{transform:'rotateY(0deg)',visibility:'visible'},{transform:`rotateY(${angle}deg)`,visibility:'hidden'}],incoming?t.frameIn:t.frameOut,order.get(o.id)*t.stagger+(incoming?outEnd+t.frameWait:0),!incoming);
   }else if(type==='title'){
    const off=-(o.y+o.height+20);animate(c,incoming?[{transform:`translateY(${off}px)`},{transform:'translateY(0)'}]:[{transform:'translateY(0)'},{transform:`translateY(${off}px)`}],incoming?t.titleIn:t.titleOut,incoming?t.titleOut+t.titleWait:0,!incoming);
   }else animate(c,incoming?[{opacity:0},{opacity:1}]:[{opacity:1},{opacity:0}],t.fade,0,!incoming);
  }
 }
 const start=document.timeline.currentTime;for(const a of animations){a.play();a.startTime=start;}
 schedule();if(!pending.length)resolvePrepared();
 return {finished:Promise.all([...jobs,prepared]),pause(){paused=true;stopFrame();for(const a of animations)if(a.playState==='running')a.pause();},resume(){paused=false;for(const a of animations)if(a.playState==='paused')a.play();schedule();},cancel(){disposed=true;stopFrame();for(const a of animations)a.cancel();for(const node of [...pieces])release(node);pending=[];resolvePrepared();host.replaceChildren();}};
}
root.startMenuTransition=startMenuTransition;
})(globalThis);
