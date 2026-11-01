/* Event-driven paper fragments, light echoes and combo scoring. Physics stays unchanged. */
function createImpactPresentation(game,artLayers,renderer){
 const artById=new Map(artLayers.map(a=>[a.id,a]));
 const lampsBySource=new Map(),artOrder=new Map(artLayers.map((a,i)=>[a,i]));
 for(const a of artLayers)for(const t of [a.indicator?.trigger,...(a.indicator?.extraTriggers||[])]){
  if(!t?.source)continue;
  if(!lampsBySource.has(t.source))lampsBySource.set(t.source,new Set());
  lampsBySource.get(t.source).add(a);
 }
 const pulseColors=['#ffe59b','#b9f9ff'];
 const particles=[],rings=[],swings=[],lampPulses=new Map(),recent=new Map();
 const effectLists=[particles,rings,swings];let cleanedAt=null,cleanDirty=true;
 let cannonAt=-Infinity;
 let comboFlashAt=-Infinity,comboFlash=null,comboFlashPending=null;
 let combo=0,lastHit=-10,popAt=-10,shakeAt=-10,shakePower=0;
 const multiplier=n=>n>=30?4:n>=20?3:n>=10?2:n>=5?1.5:1;
 const plane=()=>game.visualPlane(game.ball),position=e=>e.position||game.ball.p;
 const cap=(list,n)=>{if(list.length>n)list.splice(0,list.length-n);};
 function burst(p,color,strength=1,direction=null){
  const count=Math.round(8+strength*5),at=game.time,floor=plane();
  for(let i=0;i<count;i++){const angle=direction===null?i/count*Math.PI*2:direction+(i/count-.5)*1.8,speed=25+((i*17)%53)*strength;
   particles.push({p:[...p],v:[Math.cos(angle)*speed,Math.sin(angle)*speed],color,at,plane:floor,life:.28+(i%4)*.08,size:1.1+(i%3)*.55,angle});}
  rings.push({p:[...p],color,at,plane:floor,strength});cap(particles,240);cap(rings,32);
 }
 function pulse(source,all=false){
  if(all&&renderer.rasterCacheEnabled){comboFlashAt=game.time;return;}
  const light=a=>{if(!a.hidden&&a.indicator&&a.indicator.impactFlash!==false)lampPulses.set(a.id,{at:game.time+(all?(a.x%7)*.018:0),color:pulseColors[all?0:1]});};
  if(all){for(const a of artLayers)light(a);return;}
  // A grouped source such as target-001 must also match target-001-1.
  const matched=new Set();
  for(let id=source;id;){
   for(const a of lampsBySource.get(id)||[])matched.add(a);
   const split=id.lastIndexOf('-');if(split<0)break;id=id.slice(0,split);
  }
  for(const a of [...matched].sort((a,b)=>artOrder.get(a)-artOrder.get(b)))light(a);
 }
 function hit(id){
  if(!id||(recent.get(id)??-10)>game.time-.12)return false;
  recent.set(id,game.time);if(game.time-lastHit>2)combo=0;
  combo++;lastHit=popAt=game.time;
  game.combo={count:combo,multiplier:multiplier(combo),expiresAt:lastHit+2};
  if([5,10,20,30].includes(combo)){burst(game.ball.p,'#ffd36d',1.4);pulseCombo();shakeAt=game.time;shakePower=.7;}
  return true;
 }
 function pulseCombo(){
  if(renderer.rasterCacheEnabled)comboFlashAt=game.time;
  else pulse(null,true);
 }
 const comboFlashActive=()=>!!comboFlash&&game.time>=comboFlashAt&&game.time-comboFlashAt<.35;
 function prepareComboFlash(scale){
  if(!renderer.rasterCacheEnabled||typeof document==='undefined')return Promise.resolve();
  const items=artLayers.filter(a=>!a.hidden&&a.indicator&&a.indicator.impactFlash!==false).map(a=>{
   const c=a.indicator,src=c.type==='bumper'&&c.keepLevelOnHit?c['lv'+game.bumperLevel(c.trigger?.source||a.bind)]:c.on||c.lv3||c.complete||a.src;
   return {art:a,img:renderer.image(src)};
  });
  const key=JSON.stringify([scale,...items.map(({art:a,img})=>[renderer.imageKey(img),a.x,a.y,a.width,a.height,a.angle,a.flipX,a.flipY,a.crop])]);
  if(comboFlash?.key===key)return Promise.resolve();
  if(comboFlashPending?.key===key)return comboFlashPending.ready;
  const request={key};comboFlashPending=request;
  request.ready=(async()=>{
   await renderer.decodeImages(new Set(items.map(a=>a.img)));
   if(comboFlashPending!==request)return;
   let next=null;
   if(items.length){
    const [x,y,w,h]=game.g.view_box,pad=14/scale;let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
    for(const {art:a} of items){const angle=(a.angle||0)*Math.PI/180,c=Math.abs(Math.cos(angle)),s=Math.abs(Math.sin(angle)),rx=(a.width*c+a.height*s)/2+pad,ry=(a.width*s+a.height*c)/2+pad;left=Math.min(left,a.x-rx);top=Math.min(top,a.y-ry);right=Math.max(right,a.x+rx);bottom=Math.max(bottom,a.y+ry);}
    left=Math.floor(Math.max(x,left)*scale)/scale;top=Math.floor(Math.max(y,top)*scale)/scale;right=Math.ceil(Math.min(x+w,right)*scale)/scale;bottom=Math.ceil(Math.min(y+h,bottom)*scale)/scale;
    const width=Math.max(1,Math.round((right-left)*scale)),height=Math.max(1,Math.round((bottom-top)*scale)),Art=typeof PinballArt==='undefined'?null:PinballArt;
    const canvas=Art?Art.rasterCanvas(width,height,renderer.bitmapCacheEnabled):document.createElement('canvas');canvas.width=width;canvas.height=height;
    const c=canvas.getContext('2d');c.setTransform(scale,0,0,scale,-left*scale,-top*scale);c.shadowColor=pulseColors[0];c.shadowBlur=6;
    for(const {art:a,img} of items){c.save();c.translate(a.x,a.y);c.rotate((a.angle||0)*Math.PI/180);c.scale(a.flipX?-1:1,a.flipY?-1:1);renderer.drawImageWithShadow(c,img,...a.crop,a.width,a.height,scale);c.restore();}
    next={key,scale,canvas:Art?Art.rasterImage(canvas):canvas,left,top,width:width/scale,height:height/scale};
   }
   if(comboFlash){if(comboFlash.canvas.close)comboFlash.canvas.close();else comboFlash.canvas.width=comboFlash.canvas.height=0;}
   comboFlash=next;comboFlashPending=null;
  })().catch(error=>{if(comboFlashPending===request)comboFlashPending=null;throw error;});
  return request.ready;
 }
 const originalCollision=game.collisionEffect.bind(game);
 game.collisionEffect=(edge,approach)=>{
  originalCollision(edge,approach);
  // Passive rebound faces still count when Boss mode disables score events.
  if(approach>0&&['rebound','active'].includes(edge.kind))hit(edge.id);
  if(approach<=8||!['bumper','rebound','active','target'].includes(edge.kind))return;
  const key='fx:'+edge.id;if((recent.get(key)??-10)>game.time-.12)return;recent.set(key,game.time);
  const bumper=edge.kind==='bumper',p=[...game.ball.p],level=bumper?game.bumperLevel(edge.id):1;
  burst(p,bumper?'#a9edff':edge.kind==='target'?'#ffe69c':'#e9b575',bumper?.8+level*.3:.8,bumper?null:Math.atan2(game.ball.v[1],game.ball.v[0]));
  pulse(edge.id);
 };
 const onEvent=game.onEvent;
 game.onEvent=e=>{
  cleanDirty=true;
  if(['new-game','ready','drain','game-over'].includes(e.type)){
   comboFlashAt=-Infinity;
   combo=0;lastHit=-10;game.combo={count:0,multiplier:1,expiresAt:0};recent.clear();
   if(e.type==='new-game'){cannonAt=-Infinity;shakeAt=-10;particles.length=rings.length=swings.length=0;lampPulses.clear();}
  }
  if(e.type==='score'||e.type==='score-hit'){
   hit(e.id);
   // scoreHit has already awarded base points. Add only the combo delta, before HUD/reward listeners.
   if(e.type==='score'&&game.scoringEnabled!==false&&e.points>0){const base=e.points,total=Math.round(base*multiplier(combo));game.score+=total-base;e.basePoints=base;e.points=total;e.multiplier=multiplier(combo);}
   pulse(e.id);
  }
  if(e.type==='rollover'||e.type==='sensor'){hit(e.id);pulse(e.id);burst(position(e),'#a1f3de',.45);}
  if(e.type==='slingshot-hit'){hit(e.id);pulse(e.id);}
  if(e.type==='flipper-hit'){
   const key='swing:'+e.id;if((recent.get(key)??-10)<=game.time-.1){recent.set(key,game.time);swings.push({p:[...game.ball.p],angle:Math.atan2(game.ball.v[1],game.ball.v[0]),at:game.time,plane:plane()});cap(swings,12);}
  }
  if(['target-group-complete','configured-attack','bumper-upgraded','multiball-awarded','center-post-up','vortex-activated'].includes(e.type)){
   burst(position(e),e.type==='configured-attack'?'#fff0bb':'#ffe49b',e.type==='configured-attack'?2:1.4);pulse(null,true);shakeAt=game.time;shakePower=e.type==='configured-attack'?1.3:.7;
  }
  onEvent?.(e);
  if(comboFlash&&['bumper-upgraded','new-game'].includes(e.type))prepareComboFlash(comboFlash.scale).catch(console.error);
 };
 function clean(){
  if(!cleanDirty&&cleanedAt===game.time)return;
  cleanDirty=false;cleanedAt=game.time;
  if(game.time-lastHit>2&&combo){combo=0;game.combo={count:0,multiplier:1,expiresAt:0};}
  for(const list of effectLists){let live=0;for(let i=0;i<list.length;i++)if(!(game.time-list[i].at>(list[i].life||.4)))list[live++]=list[i];list.length=live;}
  for(const [id,p] of lampPulses)if(game.time-p.at>.35)lampPulses.delete(id);
  for(const [id,at] of recent)if(game.time-at>2)recent.delete(id);
 }
 function hasEffects(floor){
  if(particles.some(q=>q.plane===floor)||rings.some(q=>q.plane===floor)||swings.some(q=>q.plane===floor&&game.time-q.at<=.18))return true;
  if(!comboFlashActive())for(const [id,q] of lampPulses){const a=artById.get(id);if(a&&!a.hidden&&a.plane===floor&&game.time>=q.at)return true;}
  if(game.g.gameplay?.ballEffects!==false)for(const b of game.balls){
   if(game.visualPlane(b)!==floor||b.state!=='playing'||Math.hypot(...b.v)<180)continue;
   let count=0;for(const p of b.trail||[])if(p.layer===b.layer&&++count===2)return true;
  }
  return false;
 }
 function draw(ctx,floor,bounds=game.g.view_box){
  clean();if(!hasEffects(floor))return;
  ctx.save();ctx.lineCap='round';
  let transform,shadowScale,shadowStyle;
  // Effects may surround the ball but must not paint over its silver surface.
  for(const b of game.balls){
   if(b.state==='drained')continue;
   ctx.beginPath();ctx.rect(...bounds);ctx.moveTo(b.p[0]+game.physics.ballRadius,b.p[1]);
   ctx.arc(...b.p,game.physics.ballRadius,0,Math.PI*2);ctx.clip('evenodd');
  }
  for(const b of game.balls){if(game.g.gameplay?.ballEffects===false||game.visualPlane(b)!==floor||b.state!=='playing')continue;const speed=Math.hypot(...b.v);if(speed<180)continue;
   const trail=b.trail;let start=trail?.length||0,count=0;
   for(let i=start-1;i>=0;i--)if(trail[i].layer===b.layer){start=i;if(++count===10)break;}
   ctx.strokeStyle=combo>=10?'#ffe597':'#a9eaff';
   let previous=null,index=0;
   for(let i=start;i<(trail?.length||0);i++){const point=trail[i];if(point.layer!==b.layer)continue;if(previous){index++;ctx.globalAlpha=(index/count)*Math.min(.48,speed/1800);ctx.lineWidth=.5+index/count*2;ctx.beginPath();ctx.moveTo(...previous.p);ctx.lineTo(...point.p);ctx.stroke();}previous=point;}
  }
  for(const r of rings){if(r.plane!==floor)continue;const age=game.time-r.at,t=age/.4;ctx.globalAlpha=(1-t)*.85;ctx.strokeStyle=r.color;ctx.lineWidth=2.2*(1-t)+.3;ctx.beginPath();ctx.arc(...r.p,3+age*42*r.strength,0,Math.PI*2);ctx.stroke();}
  ctx.save();
  for(const q of particles){if(q.plane!==floor)continue;const age=game.time-q.at;
   if(transform===undefined)transform=readTransform(ctx);
   const x=q.p[0]+q.v[0]*age,y=q.p[1]+q.v[1]*age+18*age*age,angle=q.angle+age*5;
   if(transform)setPose(ctx,transform,x,y,angle);else{ctx.save();ctx.translate(x,y);ctx.rotate(angle);}
   ctx.globalAlpha=1-age/q.life;ctx.fillStyle=q.color;ctx.fillRect(-q.size,-q.size*.4,q.size*2,q.size*.8);
   if(!transform)ctx.restore();
  }
  ctx.restore();
  for(const s of swings){if(s.plane!==floor)continue;const age=game.time-s.at;if(age>.18)continue;ctx.globalAlpha=1-age/.18;ctx.strokeStyle='#fff0bb';ctx.lineWidth=2*(1-age/.18);ctx.beginPath();ctx.arc(...s.p,5+age*45,s.angle+Math.PI-.9,s.angle+Math.PI+.9);ctx.stroke();}
  ctx.save();
  if(!comboFlashActive())for(const [id,q] of lampPulses){const a=artById.get(id);if(!a||a.hidden||a.plane!==floor)continue;const age=game.time-q.at;if(age<0)continue;
   const c=a.indicator,src=c.type==='bumper'&&c.keepLevelOnHit?c['lv'+game.bumperLevel(c.trigger?.source||a.bind)]:c.on||c.lv3||c.complete||a.src,img=renderer.image(src),fade=Math.sin(Math.PI*age/.35);
   if(transform===undefined)transform=readTransform(ctx);
   const angle=(a.angle||0)*Math.PI/180,flipX=a.flipX?-1:1,flipY=a.flipY?-1:1;
   if(transform)setPose(ctx,transform,a.x,a.y,angle,flipX,flipY);else{ctx.save();ctx.translate(a.x,a.y);ctx.rotate(angle);ctx.scale(flipX,flipY);}
   ctx.globalAlpha=.65*fade;
   if(transform&&renderer.prepareShadowRaster){
    if(!shadowStyle){
     shadowStyle={shadowBlur:6,shadowColor:q.color,shadowOffsetX:ctx.shadowOffsetX,shadowOffsetY:ctx.shadowOffsetY,globalCompositeOperation:ctx.globalCompositeOperation,filter:ctx.filter,imageSmoothingEnabled:ctx.imageSmoothingEnabled,imageSmoothingQuality:ctx.imageSmoothingQuality,getTransform:()=>ctx.getTransform()};
     ctx.shadowColor='transparent';ctx.shadowBlur=0;
    }
    shadowStyle.shadowColor=q.color;
   }else{ctx.shadowColor=q.color;ctx.shadowBlur=6;}
   if(img.complete&&img.naturalWidth){
    if(shadowScale===undefined)shadowScale=transform&&transform.b===0&&transform.c===0&&Math.abs(Math.abs(transform.a)-Math.abs(transform.d))<1e-7?Math.abs(transform.a):null;
    if(renderer.drawImageWithShadow)renderer.drawImageWithShadow(ctx,img,...a.crop,a.width,a.height,shadowScale,shadowStyle);
    else ctx.drawImage(img,...a.crop,-a.width/2,-a.height/2,a.width,a.height);
   }
   if(!transform)ctx.restore();
  }
  ctx.restore();
  ctx.restore();
 }
 function readTransform(ctx){
  const m=ctx.getTransform?.();
  // Read native DOMMatrix getters once, not for every particle or lamp.
  return m?{a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f}:null;
 }
 function setPose(ctx,m,x,y,angle,flipX=1,flipY=1){
  const c=Math.cos(angle),s=Math.sin(angle);
  ctx.setTransform((m.a*c+m.c*s)*flipX,(m.b*c+m.d*s)*flipX,(m.c*c-m.a*s)*flipY,(m.d*c-m.b*s)*flipY,m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f);
 }
 return {draw,update:clean,prepareComboFlash,drawComboFlash(ctx,bounds=game.g.view_box){
  if(!comboFlashActive())return;
  ctx.save();
  for(const b of game.balls){if(b.state==='drained')continue;ctx.beginPath();ctx.rect(...bounds);ctx.moveTo(b.p[0]+game.physics.ballRadius,b.p[1]);ctx.arc(...b.p,game.physics.ballRadius,0,Math.PI*2);ctx.clip('evenodd');}
  ctx.globalAlpha=.65*Math.sin(Math.PI*(game.time-comboFlashAt)/.35);ctx.shadowBlur=0;
  ctx.drawImage(comboFlash.canvas,comboFlash.left,comboFlash.top,comboFlash.width,comboFlash.height);ctx.restore();
 },async prepareShadows(scale){
  if(!renderer.rasterCacheEnabled||!renderer.prepareShadowRaster)return;
  await prepareComboFlash(scale);
  const entries=[],images=new Set();
  for(const a of artLayers){if(a.hidden||!a.indicator||a.indicator.impactFlash===false)continue;
   const c=a.indicator,sources=c.type==='bumper'&&c.keepLevelOnHit?[c.lv1,c.lv2,c.lv3]:[c.on||c.lv3||c.complete||a.src];
   for(const src of sources){if(!src)continue;const img=renderer.image(src);images.add(img);entries.push({art:a,img});}
  }
  if(!entries.length)return;
  await renderer.decodeImages(images);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const brush=canvas.getContext('2d');brush.setTransform(scale,0,0,scale,0,0);brush.shadowBlur=6;
  try{for(const color of pulseColors){brush.shadowColor=color;for(const {art:a,img} of entries)renderer.prepareShadowRaster(brush,img,...a.crop,a.width,a.height);}}
  finally{canvas.width=canvas.height=0;}
 },onTheaterSound(name,now=performance.now()){
  if(name==='explosion')cannonAt=now;
 },screenShake(now=performance.now()){
  const age=(now-cannonAt)/1000;
  if(game.paused||age<0||age>=.3)return [0,0];
  const amplitude=5*(1-age/.3)**2;
  return [Math.cos(age*135)*amplitude,Math.sin(age*170)*amplitude*.7];
 },preview(kind){
  cleanDirty=true;
  const p=[180,230];
  if(kind==='flipper')swings.push({p,angle:-Math.PI/2,at:game.time,plane:plane()});
  else burst(p,kind==='bumper'?'#a9edff':kind==='slingshot'?'#e9b575':'#ffe49b',kind==='complete'?2:1,kind==='slingshot'?-Math.PI/2:null);
  if(kind==='combo'){combo=19;lastHit=game.time;recent.clear();hit('preview-combo');}
  if(kind==='combo')pulseCombo();else pulse(null,true);
 },drawBallGlow(ctx,ball){
  if(game.g.gameplay?.ballEffects===false||combo<2||game.time-lastHit>2||['ready','drained'].includes(ball.state))return;
  const strength=Math.min(1,(combo-1)/29),r=game.physics.ballRadius,radius=r*(1.25+strength*1.25);
  const glow=ctx.createRadialGradient(...ball.p,r*.65,...ball.p,radius);
  glow.addColorStop(0,'rgba(255,250,220,.8)');glow.addColorStop(.45,'rgba(255,219,135,.45)');glow.addColorStop(1,'rgba(255,219,135,0)');
  ctx.save();ctx.globalAlpha*=(.45+.55*strength)*Math.min(1,(lastHit+2-game.time)/.25);ctx.fillStyle=glow;
  ctx.beginPath();ctx.arc(...ball.p,radius,0,Math.PI*2);ctx.moveTo(ball.p[0]+r,ball.p[1]);ctx.arc(...ball.p,r,0,Math.PI*2);ctx.fill('evenodd');ctx.restore();
 },get combo(){return {count:combo,multiplier:multiplier(combo),expiresAt:lastHit+2};},shake(){const t=game.time-shakeAt;if(t<0||t>.16)return [0,0];const fade=1-t/.16;return [Math.sin(t*150)*shakePower*fade,Math.cos(t*170)*shakePower*fade];},drawHud(ctx,bounds){
  clean();if(combo<2)return;const [x,y,w,h]=bounds;
  // Use the bottommost flipper on each side, excluding higher auxiliary flippers.
  let hasLower=false;for(const f of game.flippers)if((f.layer||'lower')==='lower'){hasLower=true;break;}
  let left=null,right=null,first=null,second=null;
  for(const f of game.flippers){
   if(hasLower&&(f.layer||'lower')!=='lower')continue;
   if(!first||f.pivot[1]>first.pivot[1]){second=first;first=f;}else if(!second||f.pivot[1]>second.pivot[1])second=f;
   const side=f.control||f.side;
   if(side==='left'&&(!left||f.pivot[1]>left.pivot[1]))left=f;
   if(side==='right'&&(!right||f.pivot[1]>right.pivot[1]))right=f;
  }
  const a=left&&right?left:first,b=left&&right?right:second;
  const cx=a?(b?(a.pivot[0]+b.pivot[0])/2:a.pivot[0]):x+w/2;
  const cy=a?(b?(a.pivot[1]+b.pivot[1])/2:a.pivot[1])-75:y+h-100;
  const size=Math.min(28,13+Math.log2(combo)*2.5),pop=1+.18*Math.exp(-Math.max(0,game.time-popAt)*18);
  const hud=game.g.gameplay?.comboHud||{};
  ctx.save();ctx.translate(cx,cy);ctx.scale(pop,pop);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold '+size+'px sans-serif';ctx.lineWidth=3;ctx.strokeStyle=hud.outline||'#142735';ctx.fillStyle=hud.color||(combo>=10?'#ffe39a':'#c6f5ff');ctx.strokeText(String(combo),0,0);ctx.fillText(String(combo),0,0);ctx.scale(1/pop,1/pop);ctx.font='bold 9px sans-serif';ctx.strokeText('COMBO',0,-25);ctx.fillText('COMBO',0,-25);
  ctx.font='bold 9px sans-serif';ctx.fillText('×'+multiplier(combo),0,size*.85);ctx.globalAlpha=.8;ctx.fillStyle=hud.barColor||ctx.fillStyle;ctx.fillRect(-28,size*1.4,56*Math.max(0,(lastHit+2-game.time)/2),hud.barHeight??1.5);ctx.restore();
 }};
}
if(typeof module!=='undefined')module.exports=createImpactPresentation;
