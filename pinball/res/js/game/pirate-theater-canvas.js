/* Pirate play theater: data/timelines only; no stage DOM or iframe. */
(function(root){
'use strict';
const assets={"pirate-theater-background-day":"res/img/pirate/pirate-theater-background-day.png","pirate-theater-background-night":"res/img/pirate/pirate-theater-background-night.png","pirate-story-kraken-cave":"res/img/pirate/pirate-story-kraken-cave.png","pirate-story-waterfall-channel":"res/img/pirate/pirate-story-waterfall-channel.png","pirate-waves":"res/img/pirate/pirate-waves.png","pirate-explosive-barrel":"res/img/pirate/pirate-explosive-barrel.png","pirate-volleyball":"res/img/pirate/pirate-volleyball.png","pirate-airborne-crew":"res/img/pirate/pirate-airborne-crew.png","pirate-kraken-tentacle":"res/img/pirate/pirate-kraken-tentacle.png","pirate-lightning":"res/img/pirate/pirate-lightning.png","pirate-explosion-smoke":"res/img/pirate/pirate-explosion-smoke.png"};
const image=name=>assets[name],mix=(a,b,t)=>a+(b-a)*t;
function ease(t,name='linear'){
 if(name==='linear')return t;
 const x1=name==='ease-out'?0:.42,x2=name==='ease-in'?1:.58;let lo=0,hi=1,u=t;
 for(let i=0;i<10;i++){u=(lo+hi)/2;const x=3*(1-u)**2*u*x1+3*(1-u)*u*u*x2+u**3;if(x<t)lo=u;else hi=u;}
 return 3*(1-u)*u*u+u**3;
}
const pose=(x=0,y=0,scale=1,angle=0)=>({x,y,sx:scale,sy:scale,angle,opacity:1});
class PirateTheaterCanvas{
 static requested(){return true;}
 get retainedIds(){return ['enemy','wave-back','wave-front'];}
 static sources=['res/img/theater-curtain-right.png','res/img/health-heart.svg',...PirateTheaterCatalog.flatMap(e=>e.states.map(s=>s.src)),...['pirate-theater-background-day','pirate-theater-background-night','pirate-story-kraken-cave','pirate-story-waterfall-channel','pirate-waves','pirate-explosive-barrel','pirate-volleyball','pirate-airborne-crew','pirate-kraken-tentacle','pirate-lightning','pirate-explosion-smoke'].map(image)];
 static initialSources=['res/img/theater-curtain-right.png','res/img/health-heart.svg',image('pirate-theater-background-day'),image('pirate-waves'),...['pirate-explosive-barrel','pirate-volleyball','pirate-airborne-crew','pirate-kraken-tentacle','pirate-lightning','pirate-explosion-smoke'].map(image)];
 constructor(owner){
  this.owner=owner;this.active=true;this.revision=0;this.clock=0;this.animations=[];this.effects=[];this.generation=0;this.commandQueue=Promise.resolve();this.closed=true;this.open=0;this.curtainDynamic=false;this.present=false;this.defeated=false;this.typeIndex=0;this.stateIndex=0;this.level=1;this.hp=this.maxHp=3;this.actor=pose();this.actor.visible=false;this.oldBounds=[];this.dirty=[];this.height=140.5;this.paused=false;this.warning=false;this.tintCache=new Map();this.spriteCache=new Map();this.spritePixels=0;this.drawRows=new Map();
 }
 attach(images,invalidate){this.images=images;this.invalidate=invalidate;addEventListener('pagehide',()=>this.destroy(),{once:true});this.phase();queueMicrotask(()=>this.report('ready'));}
 destroy(){this.generation++;this.cancel();for(const entry of this.spriteCache.values()){if(entry.image.close)entry.image.close();else entry.image.width=entry.image.height=0;}this.spriteCache.clear();this.spritePixels=0;for(const canvas of this.tintCache.values())canvas.width=canvas.height=0;this.tintCache.clear();for(const canvas of [this.hearts?.canvas])if(canvas){if(canvas.close)canvas.close();else canvas.width=canvas.height=0;}}
 report(type,data={}){this.owner.receive({source:this.owner.frame.contentWindow,data:{channel:'pinball-theater',type,...data}});}
 phase(){this.revision++;this.invalidate?.();}
 staticKey(){return [this.background(),this.typeIndex,this.closed&&!this.curtainDynamic,this.height].join('|');}
 state(){return {defeated:this.present&&this.defeated,maxHp:this.maxHp,hp:this.hp,level:this.level,name:this.present?PirateTheaterCatalog[this.typeIndex].name:null};}
 receive(data){
  const {command,id}=data;if(command==='pause'){if(this.paused!==!!data.paused)this.previous=undefined;this.paused=!!data.paused;return;}
  if(command==='tutorial-bounds'){this.report('tutorial-bounds',{bounds:this.tutorialBounds()});return;}
  if(command==='warning-complete'||command==='boss-origin')return;
  if(command==='reset'){this.generation++;this.cancel();this.commandQueue=Promise.resolve();this.paused=false;}
  const token=this.generation;
  this.commandQueue=this.commandQueue.catch(()=>{}).then(async()=>{
   if(token!==this.generation)return;
   if(command==='reset')await this.reset();
   else if(command==='enemy')await this.choose(data,token);
   else if(this.present&&!this.defeated){this.attackActive=true;try{await this.attack({lv1:'ball',lv2:'barrel',lv3:'pirates',lv4:'kraken',airdrop:'pirates'}[command]||command);}finally{if(token===this.generation)this.attackActive=false;this.invalidate?.();}}
   if(token===this.generation)this.report('complete',{id,...this.state()});
  }).catch(error=>{if(error.name!=='AbortError'&&token===this.generation)this.report('error',{id,message:String(error)});});
 }
 cancel(){this.attackActive=false;const error=new Error('Theater reset');error.name='AbortError';for(const a of this.animations)a.reject(error);this.animations=[];this.effects=[];this.warning=false;}
 animate(target,frames,duration,easing='linear',delay=0){
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  return new Promise((resolve,reject)=>{const keys=[...new Set(frames.flatMap(f=>Object.keys(f)))].filter(k=>!['offset','easing'].includes(k));let previous={};for(const k of keys)previous[k]=target[k]??(k==='opacity'?1:0);const normalized=frames.map((f,i)=>{previous={...previous,...f};return {...previous,offset:f.offset??i/(frames.length-1),easing:f.easing};});for(const k of keys)target[k]=normalized[0][k];this.animations.push({target,frames:normalized,start:this.clock+(reduced?0:delay),duration:reduced?1:duration,easing,resolve,reject});this.invalidate?.();});
 }
 wait(duration){return this.animate({},[{},{}],duration);}
 tick(now,paused){
  const dt=this.previous===undefined?0:Math.max(0,now-this.previous);this.previous=now;
  if(!paused&&!this.paused)this.clock+=dt;
  let changed=false;
  for(const a of [...this.animations]){
   const progress=Math.max(0,Math.min(1,(this.clock-a.start)/a.duration));if(this.clock<a.start)continue;
   const t=ease(progress,a.easing),frames=a.frames;let i=0;while(i<frames.length-2&&t>frames[i+1].offset)i++;
   const from=frames[i],to=frames[i+1],local=ease(Math.max(0,Math.min(1,(t-from.offset)/(to.offset-from.offset||1))),from.easing||'linear');
   for(const key of new Set([...Object.keys(from),...Object.keys(to)]))if(!['offset','easing'].includes(key)){const start=from[key]??a.target[key]??(key==='opacity'?1:0),end=to[key]??start;a.target[key]=mix(start,end,local);}
   changed=true;if(progress===1){this.animations.splice(this.animations.indexOf(a),1);a.resolve();}
  }
  if(changed)this.invalidate?.();return changed;
 }
 async reset(){await this.curtains(true);this.present=false;this.defeated=false;this.typeIndex=this.stateIndex=0;this.level=1;this.hp=this.maxHp=3;this.actor={...pose(),visible:false};this.effects=[];this.heartLayoutCount=null;this.phase();}
 async curtains(close){
  if(this.closed===close&&!this.curtainDynamic)return;
  this.curtainDynamic=true;this.phase();await this.animate(this,[{open:this.open},{open:close?0:1}],650);this.closed=close;this.curtainDynamic=false;this.phase();
 }
 async load(sources){await Promise.all(sources.map(async src=>{if(this.images.has(src))return;const im=new Image(),r=root.PinballRuntimeImages,url=r.resolve(src),local=typeof PLAY_LOCAL_IMAGES!=='undefined'&&PLAY_LOCAL_IMAGES;im.src=local?.[src]||url;if(local?.[src])r.associate(im,url);await r.decode(im);this.images.set(src,im);}));}
 async choose(data,token=this.generation){
  if(this.present&&!this.defeated)return;
  if(!data.skipWarning){this.warning=true;this.phase();await this.wait(1200);this.warning=false;this.phase();}
  await this.curtains(true);
  let index=this.typeIndex,level=this.level;
  if(data.mode==='boss'&&data.stage>=1&&data.stage<=PirateTheaterCatalog.length){index=data.stage-1;level=data.stage;}
  else if(data.mode==='free'){const choices=PirateTheaterCatalog.map((_,i)=>i).filter(i=>!this.present||i!==this.typeIndex);index=choices[Math.floor(Math.random()*choices.length)];level=index+1;}
  else if(this.defeated){index=(this.typeIndex+1)%PirateTheaterCatalog.length;level++;}
  await this.load([...PirateTheaterCatalog[index].states.map(s=>s.src),...['pirate-theater-background-day','pirate-theater-background-night','pirate-story-kraken-cave','pirate-story-waterfall-channel'].map(image)]);
  if(token!==this.generation){const error=new Error('Stale theater command');error.name='AbortError';throw error;}
  this.typeIndex=index;this.level=level;this.stateIndex=0;this.hp=this.maxHp=this.level+2;this.defeated=false;this.present=true;this.actor={...pose(),visible:true};this.phase();await this.curtains(false);
 }
 get enemy(){return PirateTheaterCatalog[this.typeIndex];}
 get night(){return ['pirate-gunship','rock-shell-beast'].includes(this.enemy.id);}
 enemyBox(){
  const type=this.enemy,w=360*.32*type.scale,anchor=type.states[this.stateIndex].waterAnchor;
  const offset={'sea-serpent':.097273,'rock-shell-beast':.127512,'giant-shark':.04487,kraken:.05}[type.id]??.06;
  return [180-w/2,this.height*2/3+360*offset-w*anchor,w,w];
 }
 tutorialBounds(){const [x,y,w,h]=this.enemyBox(),heart=this.heartBox();return {boss:{x:x/360,y:y/this.height,w:w/360,h:h/this.height},hearts:{x:heart[0]/360,y:heart[1]/this.height,w:heart[2]/360,h:heart[3]/this.height}};}
 sound(name){this.report('sound',{name});}
 sprite(src,size,layer=6,origin=[.5,.5]){const item={id:'effect:'+(this.effectSerial=(this.effectSerial||0)+1),src,width:size,...pose(),layer,origin};this.effects.push(item);return item;}
 remove(item){const index=this.effects.indexOf(item);if(index>=0)this.effects.splice(index,1);this.invalidate?.();}
 async smoke(x,y,bursts=1){
  const size=360*.256;
  for(let i=0;i<bursts;i++){const item=this.sprite(image('pirate-explosion-smoke'),size);await this.animate(item,[{...pose(x-size/2,y-size/2,.2),opacity:0,offset:0},{...pose(x-size/2,y-size/2,.95),opacity:1,offset:.15},{...pose(x-size/2,y-size/2-360*.012,1.15),opacity:.9,offset:.5},{...pose(x-size/2,y-size/2-360*.04,1.4),opacity:0,offset:1}],650,'linear',i?120:0);this.remove(item);}
 }
 async attack(kind){
  if(!['ball','barrel','pirates','kraken'].includes(kind))return;
  const [ex,ey,ew]=this.enemyBox(),water=this.height*2/3+360*.019333,cx=ex+ew/2,cy=Math.max(360*.07,Math.min(ey+ew*.4,water-360*.025));
  this.phase();
  if(kind==='kraken'){
   const size=360*.32,baseY=water+360*.075,low=['bamboo-raft','lateen-boat'].includes(this.enemy.id),raised=baseY-size*.95+(low?(size*.95-360*.075)/2:0);
   const arms=[0,1].map(i=>{const a=this.sprite(image('pirate-kraken-tentacle'),size,i?3:1,[.5,.95]);a.x=cx+(i?1:-1)*Math.max(ew*.55,360*.115)-size/2;a.y=this.height+size*.1;a.sx=i?-1:1;return a;});
   this.sound('thunder');await Promise.all(arms.map(a=>this.animate(a,[{y:a.y},{y:raised}],700,'ease-out')));
   await Promise.all(arms.map((a,i)=>this.animate(a,[0,-9,10,-6,0].map(angle=>({angle:angle*(i?-1:1)})),950,'ease-in-out')));
   const bolt=this.sprite(image('pirate-lightning'),360*.24,6,[.5,0]);bolt.x=cx-360*.12;bolt.height=cy+360*.015;bolt.sy=0;bolt.opacity=0;
   await this.animate(bolt,[{sy:0,opacity:0},{sy:1,opacity:1}],180,'ease-in');this.sound('explosion');
   const puff=this.sprite(image('pirate-explosion-smoke'),360*.256);puff.x=cx-puff.width/2;puff.y=cy-puff.width/2;
   await Promise.all([this.animate(bolt,[{opacity:1},{opacity:0}],260),this.animate(puff,[{sx:.2,sy:.2,opacity:0,offset:0},{sx:1,sy:1,opacity:1,offset:.2},{sx:1.15,sy:1.15,y:puff.y-8,opacity:.9,offset:.6},{sx:1.35,sy:1.35,y:puff.y-20,opacity:0,offset:1}],700)]);
   this.remove(bolt);this.remove(puff);await this.damage(4);await Promise.all(arms.map(a=>this.animate(a,[{y:raised},{y:this.height+size*.1}],650,'ease-in')));arms.forEach(a=>this.remove(a));
  }else{
   const count=kind==='pirates'?3:1,src=image({ball:'pirate-volleyball',barrel:'pirate-explosive-barrel',pirates:'pirate-airborne-crew'}[kind]);
   await Promise.all(Array.from({length:count},async(_,i)=>{
    const size=360*(count===3?.23:.28),spread=i-(count-1)/2,startX=180+spread*360*.2,apex=this.height-Math.min(this.height*.4,360*.19),hitX=cx+spread*ew*.18,spin=(i%2?-1:1)*720,item=this.sprite(src,size);
    const p=(x,y,s,a)=>pose(x-size/2,y-size/2,s,a);
    Object.assign(item,p(startX,this.height+size*.6,1,0));
    await this.animate(item,[{...p(startX,this.height+size*.6,1,0),offset:0},{...p(startX,apex,1,0),offset:.24,easing:'ease-in'},{...p(startX,apex,1,0),offset:.27},{...p((startX+hitX)/2,Math.min(apex,cy)-360*.07,.56,spin*.45),offset:.7},{...p(hitX,cy,.18,spin),offset:1}],720,'linear',i*95);
    this.remove(item);this.sound('explosion');await this.smoke(hitX,cy,kind==='barrel'?2:1);
   }));await this.damage({ball:1,barrel:2,pirates:3}[kind]);
  }
  this.phase();
 }
 async damage(amount){
  const previous=this.hp;this.hp=Math.max(0,this.hp-amount);this.heartRevision=(this.heartRevision||0)+1;this.invalidate?.();
  const lost=this.breakHearts(previous);lost.catch(()=>{});
  if(!this.hp){
   this.defeated=true;const [x,y,w]=this.enemyBox(),distance=this.height-y+w*.1;
   if(['bamboo-raft','lateen-boat','pirate-gunship','heavy-warship'].includes(this.enemy.id)){await this.animate(this.actor,[{angle:0},{angle:-22}],350);await this.animate(this.actor,[{y:0},{y:distance+w*.25}],950);}
   else await this.animate(this.actor,[{y:0},{y:distance}],1300);
   this.actor.visible=false;
  }else{
   const state=this.hp*100<=this.maxHp*34?2:this.hp*100<=this.maxHp*67?1:0;
   if(state!==this.stateIndex){await this.animate(this.actor,[{flipAngle:0},{flipAngle:90}],500);this.stateIndex=state;await this.animate(this.actor,[{flipAngle:-90},{flipAngle:0}],500);}
  }
  await lost;
 }
 async breakHearts(previous){
  const token=this.generation;this.heartLayoutCount=previous;const [x,y,,size,gap]=this.heartBox(previous);
  try{await Promise.all(Array.from({length:previous-this.hp},async(_,j)=>{const i=j+this.hp,item=this.sprite('res/img/health-heart.svg',size,6);item.x=x+i*(size+gap);item.y=y;await this.animate(item,[{sx:1,sy:1,opacity:1,offset:0},{sx:1.25,sy:1.25,angle:-10,opacity:1,offset:.3},{sx:.6,sy:.6,angle:25,y:y+14,opacity:0,offset:1}],450,'ease-in');this.remove(item);}));}
  finally{if(token===this.generation){this.heartLayoutCount=null;this.invalidate?.();}}
 }
 background(){return this.enemy.id==='kraken'?image('pirate-story-kraken-cave'):this.enemy.id==='sea-serpent'?image('pirate-story-waterfall-channel'):image(this.night?'pirate-theater-background-night':'pirate-theater-background-day');}
 getImage(src,filter=''){
  const original=this.images.get(src);if(!filter)return original;
  const key=src+'|'+filter;if(!this.tintCache.has(key)){const c=document.createElement('canvas'),r=root.PinballRuntimeImages;c.width=r.width(original);c.height=r.height(original);const b=c.getContext('2d');if('filter' in b){b.filter=filter;r.draw(b,original,0,0);}else{r.draw(b,original,0,0);const data=b.getImageData(0,0,c.width,c.height),brightness=Number(filter.match(/brightness\(([\d.]+)\)/)?.[1]??1),saturation=Number(filter.match(/saturate\(([\d.]+)\)/)?.[1]??1),p=data.data;for(let i=0;i<p.length;i+=4){const red=p[i]*brightness,green=p[i+1]*brightness,blue=p[i+2]*brightness,l=.213*red+.715*green+.072*blue;p[i]=l+(red-l)*saturation;p[i+1]=l+(green-l)*saturation;p[i+2]=l+(blue-l)*saturation;}b.putImageData(data,0,0);}this.tintCache.set(key,c);}return this.tintCache.get(key);
 }
 drawImage(c,src,x,y,w,h,filter=''){const im=this.getImage(src,filter);if(im instanceof HTMLCanvasElement)c.drawImage(im,x,y,w,h);else root.PinballRuntimeImages.draw(c,im,x,y,w,h);}
 paintStatic(c,bounds){
  const s=bounds.width/360,x=bounds.x||0;this.height=bounds.height/s;this.pixelScale=Math.abs(c.getTransform().a*s)||1;c.save();c.translate(x,bounds.y);c.scale(s,s);c.beginPath();c.rect(0,0,360,this.height);c.clip();const src=this.background(),r=root.PinballRuntimeImages,im=this.images.get(src),w=r.width(im),h=r.height(im);
  if(this.enemy.id==='kraken')this.drawImage(c,src,-360*1.5831381733,(this.height-360)*.666667-360*.074941452,360*3.9156908665,360*2.2037470726);
  else if(this.enemy.id==='sea-serpent')this.drawImage(c,src,-360*.2341920375,(this.height-360)*.666667-360*.5858044496,360*1.5426229508,360*2.7409836066);
  else{const scale=Math.max(360/w,this.height/h);this.drawImage(c,src,(360-w*scale)/2,(this.height-h*scale)*.666667,w*scale,h*scale);}
  if(this.closed&&!this.curtainDynamic){for(const a of this.actors(true).filter(a=>a.src===image('pirate-waves')))this.drawImage(c,a.src,a.x,a.y,a.width,a.height,a.filter);this.paintCurtains(c,0);}c.restore();
 }
 paintCurtains(c,open){
  const r=root.PinballRuntimeImages,im=this.images.get('res/img/theater-curtain-right.png'),pw=360*.52,s=Math.max(pw/r.width(im),this.height/r.height(im)),w=r.width(im)*s,h=r.height(im)*s;
  for(const left of [true,false]){const x=(left?0:360-pw)+(left?-1:1)*pw*.89*open;c.save();c.beginPath();c.rect(x,0,pw,this.height);c.clip();if(left){c.translate(x+pw,0);c.scale(-1,1);}this.drawImage(c,'res/img/theater-curtain-right.png',(left?0:x)+(pw-w)/2,(this.height-h)/2,w,h);c.restore();}
 }
 heartBox(count=this.heartLayoutCount??this.hp){const [,y]=this.enemyBox(),size=360*.028,gap=3,w=count?count*size+(count-1)*gap:0;return [180-w/2,Math.max(5,y-size-5),w,size,gap];}
 prepareHearts(){
  const key=[this.present,this.hp,this.level,this.maxHp,this.height,this.typeIndex,this.stateIndex,this.pixelScale,this.heartLayoutCount].join('|');if(this.hearts?.key===key)return;
  const box=this.heartBox(),c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(box[2]*this.pixelScale));c.height=Math.max(1,Math.ceil(box[3]*this.pixelScale));const b=c.getContext('2d');b.scale(this.pixelScale,this.pixelScale);if(this.present)for(let i=0;i<this.hp;i++)this.drawImage(b,'res/img/health-heart.svg',i*(box[3]+box[4]),0,box[3],box[3]);this.hearts={key,canvas:c,box};
 }
 actors(force=false){
  if(!force&&this.closed&&!this.curtainDynamic)return [];
  const t=this.clock/1000,items=[];const wave=image('pirate-waves'),r=root.PinballRuntimeImages,im=this.images.get(wave),waveW=432,waveH=waveW*r.height(im)/r.width(im),water=this.height*2/3+360*.019333;
  const alternating=(duration,delay)=>{const p=(t+delay)/duration,i=Math.floor(p);return ease(i%2?1-(p-i):p-i,'ease-in-out');};
  for(const back of [true,false]){const p=alternating(back?8:6,back?0:3);items.push({id:back?'wave-back':'wave-front',src:wave,width:waveW,height:waveH,...pose(-36+(back?mix(-.03,.03,p):mix(.03,-.03,p))*waveW,water-360*(back?.19:.16)-360*(back?.006:.009)*p),layer:back?4:5,filter:this.night?'brightness(.55) saturate(.8)':back?'brightness(.86)':'',origin:[.5,.5]});}
  if(this.actor.visible){const [x,y,w]=this.enemyBox(),p=this.defeated ? .5 : alternating(4.8,0),ship=['bamboo-raft','lateen-boat','pirate-gunship','heavy-warship'].includes(this.enemy.id);items.push({id:'enemy',src:this.enemy.states[this.stateIndex].src,width:w,height:w,...this.actor,x:x+this.actor.x+mix(-360*.0035,360*.0035,p),y:y+this.actor.y,sx:this.actor.sx*Math.cos((this.actor.flipAngle||0)*Math.PI/180)*(ship?-1:1),angle:this.actor.angle+mix(-1.1,1.1,p),layer:2,filter:this.night?'brightness(.8)':'',contain:true,origin:[.5,this.enemy.states[this.stateIndex].waterAnchor]});}
  items.push(...this.effects);return items.sort((a,b)=>a.layer-b.layer);
 }
 itemBox(item){
  const h=item.height||item.width*root.PinballRuntimeImages.height(this.images.get(item.src))/root.PinballRuntimeImages.width(this.images.get(item.src)),[ox,oy]=item.origin||[.5,.5],a=(item.angle||0)*Math.PI/180,co=Math.cos(a),si=Math.sin(a),points=[];
  for(const x of [0,item.width])for(const y of [0,h]){const px=(x-item.width*ox)*(item.sx??1),py=(y-h*oy)*(item.sy??1);points.push([item.x+item.width*ox+px*co-py*si,item.y+h*oy+px*si+py*co]);}
  const box=[Math.min(...points.map(p=>p[0]))-1,Math.min(...points.map(p=>p[1]))-1,Math.max(...points.map(p=>p[0]))+1,Math.max(...points.map(p=>p[1]))+1];if(this.effectOverflow(item))return box;return [Math.max(0,box[0]),Math.max(0,box[1]),Math.min(360,box[2]),Math.min(this.height,box[3])];
 }
 prepareState(bounds,view,scale){
  this.items=this.actors();this.stableFrame=!this.closed&&!this.curtainDynamic&&!this.effects.length&&!this.animations.length&&!this.owner.activeCommands.size;
  this.drawMatrix={a:scale,e:-view[0]*scale,f:-view[1]*scale};
  this.cacheActors=!this.closed&&!this.curtainDynamic&&this.effects.every(item=>item.layer>=6);
  if(!this.cacheActors){this.drawRows.clear();return;}
  this.retainedActorIds??=new Set(this.retainedIds);
  const stageScale=scale*bounds.width/360,offsetX=((bounds.x||0)-view[0])*scale,offsetY=(bounds.y-view[1])*scale,next=new Map();
  for(const item of this.items){
   if(!this.retainedActorIds.has(item.id))continue;
   const image=this.images.get(item.src),r=root.PinballRuntimeImages,h=item.height||item.width*r.height(image)/r.width(image),[ox,oy]=item.origin||[.5,.5],wpx=Math.max(1,Math.round(item.width*stageScale)),hpx=Math.max(1,Math.round(h*stageScale)),px=Math.round(wpx*ox),py=Math.round(hpx*oy),radius=Math.hypot(Math.max(px,wpx-px),Math.max(py,hpx-py)),angleStep=180/(Math.PI*Math.max(1,radius)),angle=Math.round((item.angle||0)/angleStep)*angleStep;
   const row={item,wpx,hpx,px,py,x:Math.round((item.x+item.width*ox)*stageScale+offsetX),y:Math.round((item.y+h*oy)*stageScale+offsetY),angle,sx:Math.round((item.sx??1)*wpx)/wpx,sy:Math.round((item.sy??1)*hpx)/hpx,opacity:Math.round((item.opacity??1)*255)/255};
   row.key=[item.src,item.filter||'',!!item.contain,item.layer,wpx,hpx,px,py,row.x,row.y,row.angle,row.sx,row.sy,row.opacity].join('|');
   const old=this.drawRows.get(item.id);if(old?.key===row.key){next.set(item.id,old);continue;}
   const a=angle*Math.PI/180,co=Math.cos(a),si=Math.sin(a),points=[];
   for(const x of [0,wpx])for(const y of [0,hpx]){const dx=(x-px)*row.sx,dy=(y-py)*row.sy;points.push([row.x+dx*co-dy*si,row.y+dx*si+dy*co]);}
   const left=Math.max(offsetX,Math.floor(Math.min(...points.map(p=>p[0])))-1),top=Math.max(offsetY,Math.floor(Math.min(...points.map(p=>p[1])))-1),right=Math.min(offsetX+bounds.width*scale,Math.ceil(Math.max(...points.map(p=>p[0])))+1),bottom=Math.min(offsetY+bounds.height*scale,Math.ceil(Math.max(...points.map(p=>p[1])))+1);
   row.bounds=[view[0]+left/scale,view[1]+top/scale,view[0]+right/scale,view[1]+bottom/scale];next.set(item.id,row);
  }
  this.drawRows=next;
 }
 paintPrepared(c,id){
  const row=this.drawRows.get(id);if(!row)return;
  const matrix=c.getTransform(),dx=Math.round(matrix.e-this.drawMatrix.e),dy=Math.round(matrix.f-this.drawMatrix.f),sprite=this.spriteRaster(row.item,row.wpx,row.hpx);
  c.save();c.setTransform(1,0,0,1,dx,dy);if(this.stageClip?.path)c.clip(this.stageClip.path);c.setTransform(1,0,0,1,0,0);c.globalAlpha=row.opacity;c.translate(row.x+dx,row.y+dy);if(row.angle)c.rotate(row.angle*Math.PI/180);if(row.sx!==1||row.sy!==1)c.scale(row.sx,row.sy);c.drawImage(sprite.image,-row.px,-row.py);c.restore();
 }
 prepare(bounds){
  if(this.stableFrame&&!this.oldBounds.length&&!this.wasCurtainDynamic){this.oldBounds=[];this.previousHeart=this.hearts.key;this.wasCurtainDynamic=false;return [];}
  const scale=bounds.width/360,boxes=[];for(const item of this.items)if(!this.drawRows.has(item.id))boxes.push(this.itemBox(item));this.dirty=[...this.oldBounds,...boxes];this.previousHeart=this.hearts.key;if(this.curtainDynamic||this.wasCurtainDynamic)this.dirty.push([0,0,360,this.height]);this.wasCurtainDynamic=this.curtainDynamic;this.oldBounds=boxes;
  return this.dirty.filter(b=>b[2]>b[0]&&b[3]>b[1]).map(b=>[(bounds.x||0)+b[0]*scale,b[1]*scale+bounds.y,(bounds.x||0)+b[2]*scale,b[3]*scale+bounds.y]);
 }
 effectOverflow(item){return this.theme?.startsWith('touhou')&&this.effects.includes(item);}
 paintDynamic(c,bounds,regions=[],legacy=false){
  if(this.closed&&!this.curtainDynamic)return;
  c.save();c.translate(bounds.x||0,bounds.y);c.scale(bounds.width/360,bounds.width/360);
  const native=c.getTransform(),scale=Math.abs(native.a);
  for(const a of this.items||[]){
   if(!legacy&&this.drawRows.has(a.id))continue;
   c.save();
   if(!this.effectOverflow(a)){c.beginPath();c.rect(0,0,360,this.height);c.clip();if(!legacy&&this.stageClip){c.setTransform(1,0,0,1,0,0);c.clip(this.stageClip.path);if(this.stageClip.heartPath)c.clip(this.stageClip.heartPath,'evenodd');c.setTransform(native);}}
   const h=a.height||a.width*root.PinballRuntimeImages.height(this.images.get(a.src))/root.PinballRuntimeImages.width(this.images.get(a.src)),[ox,oy]=a.origin||[.5,.5],wpx=Math.max(1,Math.round(a.width*scale)),hpx=Math.max(1,Math.round(h*scale)),sprite=this.spriteRaster(a,wpx,hpx),x=Math.round((a.x+a.width*ox)*native.a+native.e),y=Math.round((a.y+h*oy)*native.d+native.f);
   c.setTransform(1,0,0,1,0,0);c.globalAlpha=a.opacity??1;c.translate(x,y);if(a.angle)c.rotate(a.angle*Math.PI/180);if(a.sx!==1||a.sy!==1)c.scale(a.sx??1,a.sy??1);c.drawImage(sprite.image,-Math.round(wpx*ox),-Math.round(hpx*oy));c.restore();
  }
  c.beginPath();c.rect(0,0,360,this.height);c.clip();
  if(this.present&&(this.curtainDynamic||legacy&&!this.closed)){const h=this.hearts;c.drawImage(h.canvas,h.box[0],h.box[1],h.box[2],h.box[3]);}
  if(this.curtainDynamic)this.paintCurtains(c,this.open);c.restore();
 }
 spriteRaster(item,width,height){
  const key=[item.src,width,height,item.filter||'',!!item.contain].join('|');let entry=this.spriteCache.get(key);
  if(entry){this.spriteCache.delete(key);this.spriteCache.set(key,entry);return entry;}
  const art=root.PinballArt,canvas=art.rasterCanvas(width,height,true),c=canvas.getContext('2d');
  if(item.contain){const r=root.PinballRuntimeImages,im=this.images.get(item.src),scale=Math.min(width/r.width(im),height/r.height(im)),w=r.width(im)*scale,h=r.height(im)*scale;this.drawImage(c,item.src,(width-w)/2,(height-h)/2,w,h,item.filter);}
  else this.drawImage(c,item.src,0,0,width,height,item.filter);
  entry={image:art.rasterImage(canvas),pixels:width*height};this.spriteCache.set(key,entry);this.spritePixels+=entry.pixels;
  while(this.spritePixels>1048576&&this.spriteCache.size>1){const [id,old]=this.spriteCache.entries().next().value;this.spriteCache.delete(id);this.spritePixels-=old.pixels;if(old.image.close)old.image.close();else old.image.width=old.image.height=0;}
  return entry;
 }
 setView(bounds,scale){this.height=bounds.height/(bounds.width/360);this.pixelScale=scale*(bounds.width/360);this.prepareHearts();}
 heartKey(){return [this.hearts.key,this.present,this.closed,this.curtainDynamic].join('|');}
 heartBounds(bounds){const [x,y,w,h]=this.hearts.box,s=bounds.width/360;return [(bounds.x||0)+x*s,bounds.y+y*s,(bounds.x||0)+(x+w)*s,bounds.y+(y+h)*s];}
 paintHearts(c,bounds){if(!this.present||this.closed||this.curtainDynamic)return;const h=this.hearts;c.save();c.translate(bounds.x||0,bounds.y);c.scale(bounds.width/360,bounds.width/360);c.drawImage(h.canvas,h.box[0],h.box[1],h.box[2],h.box[3]);c.restore();}
 prepareStageClip(key,suffix,width,height,scale,view,paintFrame,bounds){
  // The fixed opening depends on scenery, not whether the curtains are open.
  // Build it during loading and retain it across entrances and curtain changes.
  if(this.stageClip?.key!==key){
   const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(suffix,0,0);c.setTransform(scale,0,0,scale,-view[0]*scale,-view[1]*scale);paintFrame(c);
   const left=Math.max(0,Math.ceil(((bounds.x||0)-view[0])*scale)),top=Math.max(0,Math.ceil((bounds.y-view[1])*scale)),right=Math.min(width,Math.floor(((bounds.x||0)+bounds.width-view[0])*scale)),bottom=Math.min(height,Math.floor((bounds.y+bounds.height-view[1])*scale)),path=new Path2D();
   if(right>left&&bottom>top){
    const pixels=c.getImageData(left,top,right-left,bottom-top).data,w=right-left;let runs=new Map();
    for(let y=0;y<bottom-top;y++){const next=new Map();for(let x=0;x<w;){if(pixels[(y*w+x)*4+3]){x++;continue;}const start=x;while(x<w&&!pixels[(y*w+x)*4+3])x++;const id=start+':'+x,old=runs.get(id);next.set(id,old||{x:start,y,w:x-start,h:0});next.get(id).h++;}
     for(const [id,r]of runs)if(!next.has(id))path.rect(left+r.x,top+r.y,r.w,r.h);runs=next;
    }for(const r of runs.values())path.rect(left+r.x,top+r.y,r.w,r.h);
   }
   canvas.width=canvas.height=0;this.stageClip={key,path};
  }
  const heartKey=this.heartKey();if(this.stageClip.heartKey===heartKey)return;
  const b=this.heartBounds(bounds),left=Math.max(0,Math.floor((b[0]-view[0])*scale)-1),top=Math.max(0,Math.floor((b[1]-view[1])*scale)-1),right=Math.min(width,Math.ceil((b[2]-view[0])*scale)+1),bottom=Math.min(height,Math.ceil((b[3]-view[1])*scale)+1),path=new Path2D();path.rect(0,0,width,height);
  if(right>left&&bottom>top){
   const canvas=document.createElement('canvas');canvas.width=right-left;canvas.height=bottom-top;const c=canvas.getContext('2d',{willReadFrequently:true});c.setTransform(scale,0,0,scale,-view[0]*scale-left,-view[1]*scale-top);this.paintHearts(c,bounds);const pixels=c.getImageData(0,0,canvas.width,canvas.height).data,w=canvas.width;
   for(let y=0;y<canvas.height;y++)for(let x=0;x<w;){if(!pixels[(y*w+x)*4+3]){x++;continue;}const start=x;while(x<w&&pixels[(y*w+x)*4+3])x++;path.rect(left+start,top+y,x-start,1);}canvas.width=canvas.height=0;
  }
  this.stageClip.heartKey=heartKey;this.stageClip.heartPath=path;
 }

 paintWarning(c,view){if(!this.warning)return;c.save();c.fillStyle='#000a';c.fillRect(...view);c.globalAlpha=mix(.15,1,(Math.cos(this.clock/600*Math.PI*2)+1)/2);c.fillStyle=c.strokeStyle='#ff3038';c.textAlign='center';c.font='bold 28px monospace';const x=view[0]+view[2]/2,y=view[1]+view[3]/2;c.fillText('WARNING',x,y-65);c.beginPath();c.moveTo(x,y-48);c.lineTo(x-32,y+12);c.lineTo(x+32,y+12);c.closePath();c.lineWidth=3;c.stroke();c.fillRect(x-2,y-27,4,19);c.beginPath();c.arc(x,y+3,3,0,Math.PI*2);c.fill();c.fillText('ENERMY',x,y+48);c.fillRect(x-85,y+62,170,2);c.restore();}
}
root.PirateTheaterCanvas=PirateTheaterCanvas;
})(typeof window!=='undefined'?window:globalThis);
