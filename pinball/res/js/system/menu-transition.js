/* One 360 x 640 object stage, shared renderer and independently timed tracks. */
(function(root){
function startMenuTransition(host,from,to,getImage,settings,reverse=false,sound=true){
 const animations=[],jobs=[],t=settings.durationsMs;
 const kind=o=>o.type==='frame'?'frame':/system-marker-/.test(o.src)?'system':'title';
 const rank=o=>o.action==='tutorial'?0:Number.isInteger(o.stage)?o.stage:o.action==='endless'?9:10;
 function piece(o){
  const pad=o.type==='frame'?64:0,left=o.x-pad,top=o.y-pad,w=o.width+pad*2,h=o.height+pad*2;
  const c=document.createElement('canvas');c.style.cssText=`position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px;backface-visibility:hidden;transform-origin:${w/2}px ${h/2}px;z-index:${kind(o)==='frame'?10:kind(o)==='title'?20:30}`;
  const density=Math.max(3,host.parentElement.getBoundingClientRect().width/360*(devicePixelRatio||1));c.width=Math.ceil(w*density);c.height=Math.ceil(h*density);
  const ctx=c.getContext('2d');ctx.scale(density,density);ctx.translate(-left,-top);const obj=JSON.parse(JSON.stringify(o));if(obj.src==='res/img/system-marker-sound.png'&&!sound)obj.src='res/img/system-marker-muted.png';SystemLayout.draw(ctx,{canvas:from.canvas,objects:[obj]},getImage);host.append(c);return c;
 }
 function animate(node,keyframes,duration,delay,exit){const a=node.animate(keyframes,{duration,delay,easing:settings.easing,fill:'both'});a.pause();animations.push(a);jobs.push(a.finished.then(()=>{if(exit)node.remove();}).catch(()=>{}));}
 const shared=new Set();for(const o of from.objects.filter(o=>kind(o)==='system')){const next=to.objects.find(n=>n.src===o.src);if(next){shared.add(o.src);piece(next);}}
 const count=from.objects.filter(o=>kind(o)==='frame').length,outEnd=count?t.frameOut+(count-1)*t.stagger:0;
 for(const [objects,incoming] of [[from.objects,false],[to.objects,true]]){
  const order=new Map(objects.filter(o=>kind(o)==='frame').sort((a,b)=>rank(a)-rank(b)).map((o,i)=>[o.id,i]));
  for(const o of objects){const type=kind(o);if(type==='system'&&shared.has(o.src))continue;const c=piece(o);
   if(type==='frame'){
    const angle=reverse?-90:90;
    animate(c,incoming?[{transform:`rotateY(${-angle}deg)`,visibility:'hidden',offset:0},{transform:`rotateY(${-angle}deg)`,visibility:'visible',offset:.001},{transform:'rotateY(0deg)',visibility:'visible'}]:[{transform:'rotateY(0deg)',visibility:'visible'},{transform:`rotateY(${angle}deg)`,visibility:'hidden'}],incoming?t.frameIn:t.frameOut,order.get(o.id)*t.stagger+(incoming?outEnd+t.frameWait:0),!incoming);
   }else if(type==='title'){
    const off=-(o.y+o.height+20);animate(c,incoming?[{transform:`translateY(${off}px)`},{transform:'translateY(0)'}]:[{transform:'translateY(0)'},{transform:`translateY(${off}px)`}],incoming?t.titleIn:t.titleOut,incoming?t.titleOut+t.titleWait:0,!incoming);
   }else animate(c,incoming?[{opacity:0},{opacity:1}]:[{opacity:1},{opacity:0}],t.fade,0,!incoming);
  }
 }
 const start=document.timeline.currentTime;for(const a of animations){a.play();a.startTime=start;}
 return {finished:Promise.all(jobs),pause(){for(const a of animations)if(a.playState==='running')a.pause();},resume(){for(const a of animations)if(a.playState==='paused')a.play();},cancel(){for(const a of animations)a.cancel();host.replaceChildren();}};
}
root.startMenuTransition=startMenuTransition;
})(globalThis);
