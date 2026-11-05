/* Theme scenes use the shared Canvas clock, sprite cache and command protocol. */
(function(root){
'use strict';
const common=['res/img/theater-curtain-right.png','res/img/health-heart.svg','res/img/pirate/pirate-explosion-smoke.png'];
const pose=(x=0,y=0,s=1,angle=0)=>({x,y,sx:s,sy:s,angle,opacity:1});
function sources(value,result=new Set(common)){
 if(typeof value==='string'&&(/^res\/img\/.+\.(png|webp|svg|jpe?g)$/i.test(value)||value.startsWith('data:image/')))result.add(value);
 else if(value&&typeof value==='object')for(const child of Object.values(value))sources(child,result);
 return [...result];
}
class PlayTheaterCanvas extends root.PirateTheaterCanvas{
 static sources(theme){return sources(PlayTheaterCatalog[theme]);}
 static initialSources(theme){const d=PlayTheaterCatalog[theme],c=d.bosses[0];return sources([d.attacks,d.effects,d.blackHoleMask,d.wavesSrc,d.cloudSource,d.lightningSrc,d.electricSrc,d.electricBurstSrc,d.background,d.backgrounds?.[0]?.src,c.background]);}
 constructor(owner){super(owner);this.theme=owner.theme;this.data=PlayTheaterCatalog[this.theme];this.stateIndex=0;this.phaseIndex=0;this.actorStates=[];this.configure();}
 get enemy(){return this.data.bosses[this.typeIndex];}
 get night(){return this.theme==='steampunk'&&this.enemy.background===1;}
 get retainedIds(){return ['enemy:0','enemy:1','enemy:2','enemy:3','enemy:4','enemy:5','decor-back','decor-front'];}
 configure(){
  const c=this.enemy;this.phaseIndex=this.stateIndex=0;this.entryBackground=null;
  this.health=c.health instanceof Array?[...c.health]:c.ships?c.ships.map(s=>typeof s==='string'?1:s.health):[c.health];this.bodyExposed=false;
  this.maximum=[...this.health];this.hp=this.maxHp=this.health.reduce((a,b)=>a+b,0);this.actorStates=this.health.map(()=>({...pose(),visible:true}));this.defeated=false;this.heartLayoutCounts=null;
 }
 state(){const phases=this.enemy.phases||this.enemy.damageStates||[],floor=phases.slice(this.phaseIndex+1).reduce((n,p)=>n+(p.health||0),0);return {name:this.present?this.enemy.name:null,level:this.level,hp:[...this.health],maxHp:this.maxHp,defeated:this.present&&this.defeated,target:this.targetOrder()[0]??-1,phase:this.phaseIndex+1,phaseCount:phases.length||1,phaseHp:this.hp-floor,phaseMaxHp:this.form().health,core:this.form().core?'empty-plate':null,state:this.stateIndex,background:this.background()};}
 destroy(){for(const [key,image] of this.images||[])if(key.startsWith('canvas:'))image.width=image.height=0;super.destroy();}
 tick(now,paused){const changed=super.tick(now,paused);for(const item of this.effects)if(item.maskScale!==undefined)item.src=this.holeRaster(item.maskScale);return changed;}
 receive(data){
  if(data.command==='boss-origin'){
   if(this.present&&!this.defeated){const b=this.enemyBox();this.report('boss-origin',{stage:this.level,origin:{x:(b[0]+b[2]/2)/360,y:(b[1]+b[3]/2)/this.height}});}return;
  }
  return super.receive(data);
 }
 async reset(){await this.curtains(true);this.present=false;this.typeIndex=0;this.level=1;this.configure();this.effects=[];if(this.theme.startsWith('touhou'))this.report('boss-stage',{stage:0});this.phase();}
 async choose(data,token=this.generation){
  if(this.present&&!this.defeated)return;
  if(!data.skipWarning){this.warning=true;this.phase();await this.wait(1200);this.warning=false;this.phase();}
  await this.curtains(true);
  const index=data.mode==='boss'?Number(data.stage)-1:data.mode==='free'?Math.floor(Math.random()*this.data.bosses.length):(this.defeated?(this.typeIndex+1)%this.data.bosses.length:this.typeIndex);
  if(!this.data.bosses[index])throw Error('Unknown '+this.theme+' stage '+data.stage);
  await this.load(sources(this.data.bosses[index]));
  if(this.theme==='steampunk')await this.load([this.data.backgrounds[this.data.bosses[index].background||0].src]);
  if(data.background)await this.load([data.background]);
  if(token!==this.generation){const error=new Error('Stale theater command');error.name='AbortError';throw error;}
  this.typeIndex=index;this.level=index+1;this.configure();this.entryBackground=data.background;this.present=true;this.phase();
  if(this.theme.startsWith('touhou'))this.report('boss-stage',{stage:this.level});
  await this.curtains(false);
  if(this.theme==='steampunk')await this.enterSteam();
 }
 form(){return (this.enemy.phases||this.enemy.damageStates||[])[this.phaseIndex]||this.enemy;}
 background(){if(this.theme==='steampunk')return this.entryBackground||this.data.backgrounds[this.enemy.background||0].src;return this.entryBackground||this.form().background||this.enemy.background||this.data.background;}
 paintStatic(c,bounds){
  const scale=bounds.width/360;this.height=bounds.height/scale;this.pixelScale=Math.abs(c.getTransform().a*scale)||1;
  c.save();c.translate(bounds.x||0,bounds.y);c.scale(scale,scale);c.beginPath();c.rect(0,0,360,this.height);c.clip();c.fillStyle='#10202b';c.fillRect(0,0,360,this.height);
  const src=this.background(),im=this.images.get(src),r=root.PinballRuntimeImages;
  if(im){const w=r.width(im),h=r.height(im),s=Math.max(360/w,this.height/h),position=this.enemy.position||this.enemy.backgroundPosition||'50% 66.6667%',parts=position.split(/\s+/).map(v=>parseFloat(v)/100);let y=(this.height-h*s)*(parts[1]??.666667),height=h*s;
   if(this.enemy.backgroundHorizon){height=360*h/w;y=this.height*.5-height*this.enemy.backgroundHorizon;}
   this.drawImage(c,src,(360-w*(height/h))*(parts[0]??.5),y,w*(height/h),height);
  }
  if(this.closed&&!this.curtainDynamic)this.paintCurtains(c,0);c.restore();
 }
 enemyBox(index=0){
  const d=this.enemy,h=this.height;
  if(this.theme==='steampunk'){
   const p=d.positions[index],w=360*(d.widths?.[index]??d.width)/100,src=d.ships[index],im=this.images?.get(src),r=root.PinballRuntimeImages,ih=im?w*r.height(im)/r.width(im):w;
   const y=d.visualTop?h*.5+360*.10667:h*p.y/100;return [360*p.x/100-w/2,y-ih/2,w,ih];
  }
  if(this.theme==='saga'){
   const w=360*.32*d.scale,visible=Math.min(1,1/d.aspect),anchor=d.waterAnchor!==undefined?(1-visible)/2+d.waterAnchor*visible:(1+visible)/2;
   const y=d.waterAnchor!==undefined?h*2/3:Math.max(h*2/3+360*.07,w*visible+h*.08);return [180-w/2,y-w*anchor,w,w];
  }
  if(this.theme==='space'&&d.ships){const p=d.ships[index],w=360*p.width/100,ih=h*.85*.83;return [360*p.x/100-w/2,h*p.y/100-h*.85/2+h*.85*.17,w,ih];}
  const touhou=this.theme.startsWith('touhou'),w=360*(touhou?(this.level===4?.45:.32):.68),outerH=h*(touhou?.9:.94),top=h*(touhou?.52:.5)-outerH/2;
  return [180-w/2,top+outerH*(touhou?.14:.15),w,outerH*(touhou?.86:.85)];
 }
 actorSource(index){
  const c=this.enemy;
  if(this.theme==='steampunk'){const states=c.damageStatesByShip?.[index]||c.damageStates,hp=this.health[index],max=this.maximum[index],state=c.damageByHp?(hp>=max?0:c.damageByHp[hp]??2):(hp*100<=max*34?2:hp*100<=max*67?1:0);return states?.[state]||c.ships[index];}
  if(this.theme==='saga')return c.states[this.stateIndex].src;
  if(this.theme==='space'&&c.ships)return (c.damageStates?.[this.health[index]*2<=this.maximum[index]?1:0]||c).src;
  return this.form().src;
 }
 actors(force=false){
  if(!force&&this.closed&&!this.curtainDynamic)return [];
  const items=[],t=matchMedia('(prefers-reduced-motion:reduce)').matches?0:this.clock/1000,c=this.enemy;
  if(this.present)for(const [i,a] of this.actorStates.entries()){
   if(!a.visible)continue;const [x,y,w,h]=this.enemyBox(i),q=(1-Math.cos(t*Math.PI*2/(c.motion==='golem'?4:c.motion==='wolf'?3.2:3)))/2;
   let dx=0,dy=0,angle=0,sx=1,sy=1;
   if(!this.defeated){
    if(this.theme.startsWith('touhou'))dy=-5*q;
    else if(this.theme==='space'&&this.level!==8){dx=w*(-.004+.008*q);dy=h*(-.01+.02*q);}
    else if(this.theme==='steampunk'){dy=-9*(.5-.5*Math.cos((t+i)*Math.PI/3));angle=q;}
    else if(this.theme==='saga'){
     if(['boat','whale'].includes(c.motion)){dy=h*(.02-.04*q);angle=-1+2*q;}
     else if(c.motion==='valkyrie'){dx=w*.01*q;dy=h*(.01-.07*q);angle=-2+4*q;}
     else if(c.motion==='raven'){dy=-h*.04*q;angle=-3+6*q;}
     else if(c.motion==='serpent'){angle=-1+2*q;sx=1+.02*q;sy=.98+.02*q;}
     else if(c.motion==='golem'){dy=-h*.015*q;angle=.6*q;}
     else if(c.motion==='wolf'){dx=-w*.01*q;sx=1+.025*q;}
     else{sx=1+.015*q;sy=1+.035*q;}
    }
   }
   items.push({id:'enemy:'+i,src:this.actorSource(i),width:w,height:h,...a,x:x+dx+a.x,y:y+dy+a.y,angle:angle+a.angle,sx:sx*a.sx*Math.cos((a.flipAngle||0)*Math.PI/180),sy:sy*a.sy,layer:2,contain:true,origin:[.5,.5]});
  }
  if(this.theme==='saga'&&c.waves){const src=this.data.wavesSrc,im=this.images.get(src),r=root.PinballRuntimeImages,w=432,h=w*r.height(im)/r.width(im);
   for(const back of [true,false]){const q=.5-.5*Math.cos((t+(back?0:3))*Math.PI/(back?8:6));items.push({id:back?'decor-back':'decor-front',src,width:w,height:h,...pose(-36+w*(back?-.03+.06*q:.03-.06*q),this.height*2/3-360*(back?.19:.16)-360*(back?.006:.009)*q),filter:back?'brightness(.86)':'',layer:back?4:5});}
  }
  if(this.theme==='steampunk'&&(c.background||0)<2){for(let i=0;i<2;i++)items.push({id:i?'decor-front':'decor-back',src:this.data.cloudSource,width:288,height:this.height*.47,...pose(-306+((t/24+i*.5)%1)*702,this.height*.68),opacity:.7,filter:this.night?'brightness(.4)':'',contain:true,layer:4});}
  return items.concat(this.effects).sort((a,b)=>a.layer-b.layer);
 }
 heartPoints(counts=this.heartLayoutCounts||this.health){
  const size=10.08,gap=this.theme==='saga'?1.44:3,points=[];
  counts.forEach((count,index)=>{const b=this.enemyBox(index),columns=Math.min(10,count),rows=Math.ceil(count/10),width=columns*size+Math.max(0,columns-1)*gap;
   const top=this.theme.startsWith('touhou')?this.height*.01:Math.max(5,b[1]-rows*(size+gap)-5);
   for(let i=0;i<count;i++){const n=Math.min(columns,count-Math.floor(i/10)*10),rowWidth=n*size+Math.max(0,n-1)*gap;points.push({index,slot:i,x:b[0]+b[2]/2-rowWidth/2+(i%10)*(size+gap),y:top+Math.floor(i/10)*(size+gap),size});}
  });return points;
 }
 heartBox(){const p=this.heartPoints();if(!p.length)return [0,0,0,0,0];const x=Math.min(...p.map(v=>v.x)),y=Math.min(...p.map(v=>v.y));return [x,y,Math.max(...p.map(v=>v.x+v.size))-x,Math.max(...p.map(v=>v.y+v.size))-y,0];}
 prepareHearts(){
  const key=[this.present,this.health,this.heartLayoutCounts,this.level,this.stateIndex,this.phaseIndex,this.pixelScale,this.height].join('|');if(this.hearts?.key===key)return;
  const box=this.heartBox(),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.ceil(box[2]*this.pixelScale));canvas.height=Math.max(1,Math.ceil(box[3]*this.pixelScale));const c=canvas.getContext('2d');c.scale(this.pixelScale,this.pixelScale);
  if(this.present)for(const p of this.heartPoints())if(p.slot<this.health[p.index])this.drawImage(c,'res/img/health-heart.svg',p.x-box[0],p.y-box[1],p.size,p.size);
  if(this.hearts?.canvas)this.hearts.canvas.width=this.hearts.canvas.height=0;this.hearts={key,canvas,box};
 }
 targetOrder(){
  const live=this.health.map((_,i)=>i).filter(i=>this.health[i]>0),c=this.enemy;
  if(this.theme!=='steampunk')return live;
  if(this.level===8)return this.health[1]||this.health[2]?[1,2].filter(i=>this.health[i]>0).sort((a,b)=>this.health[a]-this.health[b]):live;
  return c.targetOrder?c.targetOrder.filter(i=>this.health[i]>0):live.sort((a,b)=>this.health[a]-this.health[b]);
 }
 async damage(amount){
  const previous=[...this.health],order=this.targetOrder();if(this.theme==='steampunk'&&this.level===8&&(this.health[1]||this.health[2]))order.push(0);
  for(const i of order){const hit=Math.min(amount,this.health[i]);this.health[i]-=hit;amount-=hit;if(!amount)break;}
  this.hp=this.health.reduce((a,b)=>a+b,0);this.defeated=!this.hp;
  this.heartLayoutCounts=previous;this.invalidate?.();
  const lost=this.heartPoints(previous).filter(p=>p.slot>=this.health[p.index]).map(async p=>{const e=this.sprite('res/img/health-heart.svg',p.size,6);e.x=p.x;e.y=p.y;await this.animate(e,[{sx:1,sy:1,opacity:1},{sx:1.25,sy:1.25,angle:-10,offset:.3},{sx:.6,sy:.6,angle:25,y:p.y+14,opacity:0}],450,'ease-in');this.remove(e);});
  await Promise.all(lost);this.heartLayoutCounts=null;
  for(let i=0;i<this.health.length;i++)if(previous[i]!==this.health[i]){
   const a=this.actorStates[i];
   if(!this.health[i]){if(this.defeated&&this.theme.startsWith('touhou'))this.report('boss-stage',{stage:this.level,defeated:true});this.sound('explosion');const b=this.enemyBox(i),distance=this.theme==='saga'||this.theme==='space'&&this.level===8?0:this.theme==='steampunk'?b[3]*1.8:b[3]*.15;await this.animate(a,[{opacity:1,y:a.y},{opacity:0,y:a.y+distance,angle:this.theme==='steampunk'?22:a.angle}],this.theme==='saga'?700:650);a.visible=false;}
   else if(this.theme==='saga'){const state=this.hp*100<=this.maxHp*34?2:this.hp*100<=this.maxHp*67?1:0;if(state!==this.stateIndex){await this.animate(a,[{flipAngle:0},{flipAngle:90}],500);this.stateIndex=state;await this.animate(a,[{flipAngle:-90},{flipAngle:0}],500);}}
   else if(this.theme==='space'&&!this.enemy.ships){const phases=this.enemy.phases||this.enemy.damageStates||[],floor=()=>phases.slice(this.phaseIndex+1).reduce((n,p)=>n+p.health,0);while(this.phaseIndex<phases.length-1&&this.hp<=floor()){await this.animate(a,[{flipAngle:0},{flipAngle:90}],160);this.phaseIndex++;this.phase();await this.animate(a,[{flipAngle:-90},{flipAngle:0}],160);}}
  }
  if(this.theme==='steampunk'&&this.level===8&&this.hp&&!this.health[1]&&!this.health[2]){const a=this.actorStates[0],next=(44+(6-this.health[0])*18)/(100/3);await this.animate(a,[{sx:a.sx,sy:a.sy},{sx:next,sy:next}],this.bodyExposed?650:1400);this.bodyExposed=true;}
  this.phase();
 }
 primitive(kind){
  const key='canvas:'+kind;if(this.images.has(key))return key;
  const c=document.createElement('canvas');c.width=c.height=128;const b=c.getContext('2d');
  if(kind==='ring'){b.strokeStyle='#ffe8a6';b.lineWidth=7;b.beginPath();b.arc(64,64,51,0,Math.PI*2);b.stroke();}
  else if(kind==='shell'){const g=b.createRadialGradient(40,32,2,64,64,60);g.addColorStop(0,'#ffebba');g.addColorStop(.4,'#af6d26');g.addColorStop(1,'#25252b');b.fillStyle=g;b.beginPath();b.arc(64,64,60,0,Math.PI*2);b.fill();}
  else{b.fillStyle=kind==='shade'?'#001326':kind==='white'?'#fff':kind==='black'?'#000':'#dfffff';b.fillRect(0,0,128,128);}
  this.images.set(key,c);return key;
 }
 holeRaster(scale){const step=Math.round(Math.max(0,scale)*32),key='canvas:hole:'+step;if(!this.images.has(key)){const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,128,128);const mask=this.images.get(this.data.blackHoleMask),size=128*step/32;if(mask&&size){c.globalCompositeOperation='destination-out';root.PinballRuntimeImages.draw(c,mask,(128-size)/2,(128-size)/2,size,size);}this.images.set(key,canvas);}return key;}
 centered(src,x,y,w,h=w,layer=6){const e=this.sprite(src,w,layer);e.height=h;e.x=x-w/2;e.y=y-h/2;return e;}
 async ring(x,y,w=72){const e=this.centered(this.primitive('ring'),x,y,w);await this.animate(e,[{sx:.2,sy:.2,opacity:1},{sx:1.5,sy:1.5,opacity:0}],300);this.remove(e);}
 async overlay(color,frames,duration){const e=this.centered(this.primitive(color),180,this.height/2,360,this.height,8);await this.animate(e,frames,duration);this.remove(e);}
 async projectile(src,x,y,width,duration=1100,delay=0){const e=this.centered(src,180,this.height+width*.6,width),p=(cx,cy,s,a)=>pose(cx-width/2,cy-width/2,s,a),apex=this.height-Math.min(this.height*.4,360*.19);await this.animate(e,[{...p(180,this.height+width*.6,1,0),offset:0},{...p(180,apex,1,0),offset:.16,easing:'ease-in'},{...p(180,apex,1,0),offset:.48},{...p((180+x)/2,Math.min(apex,y)-25,.56,324),offset:.8},{...p(x,y,.18,720),offset:1}],duration,'linear',delay);this.remove(e);}
 async attack(command){
  const kind={ball:'lv1',barrel:'lv2',pirates:'lv3',airdrop:'lv3',kraken:'lv4'}[command]||command;if(!/^lv[1-4]$/.test(kind))throw Error('Unknown '+this.theme+' attack '+command);
  if(this.theme.startsWith('touhou'))await this.attackTouhou(kind);
  else if(this.theme==='saga')await this.attackSaga(kind);
  else if(this.theme==='steampunk')await this.attackSteam(kind);
  else await this.attackSpace(kind);
 }
 async attackTouhou(kind){
  // Lv4 is presented by the table's expanding bagua overlay, once.
  if(kind==='lv4'){this.sound('metal');await this.damage(4);return;}
  const a=this.data.attacks[kind],x=180,y=this.height*.56,e=this.centered(a.src,x,y,360*a.width/100),lv=Number(kind.slice(-1));
  await this.animate(e,[{opacity:0,sx:lv===1?1:.15,sy:lv===1?1:.15,angle:lv===4?-30:lv===1?0:-45},{opacity:1,sx:lv===4?.85:lv===1?1:.9,sy:lv===4?.85:lv===1?1:.9,angle:0}],a.approachDuration,'ease-out');if(a.holdDuration)await this.wait(a.holdDuration);
  this.sound(lv===1?'explosion':'metal');const damage=this.damage(lv);
  await Promise.all([damage,this.animate(e,[{opacity:1,sx:e.sx,sy:e.sy,angle:0},{opacity:0,sx:lv===4?1.9:lv===1?1.8:1.6,sy:lv===4?1.9:lv===1?1.8:1.6,angle:lv===4?75:lv===1?0:45}],a.impactDuration,'ease-out'),lv===1?this.ring(x,y):Promise.resolve()]);this.remove(e);
 }
 async attackSaga(kind){
  const a=this.data.attacks[kind],b=this.enemyBox(),x=kind==='lv4'?180:b[0]+b[2]/2,y=kind==='lv4'?81:Math.max(25,Math.min(b[1]+b[3]*.4,this.height*.85));
  await Promise.all([a.src,a.secondarySrc].filter(Boolean).map((src,i)=>this.projectile(src,x+(a.secondarySrc?(i?15:-15):0),y,360*a.width/100)));
  if(kind==='lv3'){this.sound('electric-charge');const e=this.centered(this.data.electricSrc,x,y,360*.82,this.height*.92);await this.animate(e,[{opacity:0,sx:.05,sy:.05},{opacity:.32,sx:.35,sy:.35,offset:.35},{opacity:.8,sx:1,sy:1}],1500,'ease-out');this.remove(e);const burst=this.centered(this.data.electricBurstSrc,x,y,360*.92,this.height);await this.animate(burst,[{opacity:0,sx:.25,sy:.25},{opacity:1,sx:1,sy:1,offset:.3},{opacity:0,sx:1.15,sy:1.15}],650);this.remove(burst);}
  if(kind==='lv4'){await this.overlay('shade',[0,1,.12,1,.12,1,.12,1].map(opacity=>({opacity})),900);this.sound('judgment');const bolt=this.centered(this.data.lightningSrc,180,43.2,86.4);await this.animate(bolt,[{sy:0,opacity:0},{sy:1,opacity:1}],180);await this.wait(220);await this.animate(bolt,[{opacity:1},{opacity:0}],180);this.remove(bolt);await this.wait(250);}
  for(let i=0;i<(kind==='lv2'?2:1);i++){this.sound('explosion');await Promise.all([this.damage(kind==='lv2'?1:a.damage),kind==='lv3'?Promise.resolve():this.smoke(x+(kind==='lv2'?(i?15:-15):0),y)]);}
 }
 async enterSteam(){
  const stage=this.level;
  if(stage===1)return;
  await Promise.all(this.actorStates.map(async(a,i)=>{const b=this.enemyBox(i);if(stage===7&&i>=3){a.opacity=0;a.x=(this.enemyBox(0)[0]+this.enemyBox(0)[2]/2)-(b[0]+b[2]/2);a.y=-this.height*.4;await this.wait(1400);await this.animate(a,[{opacity:0,sx:.2,sy:.2,x:a.x,y:a.y},{opacity:1,sx:1,sy:1,x:0,y:0}],900);return;}
   const small=[2,4,6,8].includes(stage);await this.animate(a,[{opacity:0,sx:stage===8&&i===0?.02:small?.18:1,sy:stage===8&&i===0?.02:small?.18:1,x:[3,5].includes(stage)?b[2]*.8:stage===7?-b[2]*.8:0},{opacity:1,sx:1,sy:1,x:0}],stage===8?1800:stage===2?1000:1400);
  }));
 }
 async attackSteam(kind){
  const art=this.data.attacks,b=this.enemyBox(this.targetOrder()[0]||0),x=b[0]+b[2]/2,y=b[1]+b[3]/2,damage=Number(kind.slice(-1));
  if(kind==='lv1'){const e=this.centered(art.gun,180,this.height*.65,342,this.height*1.1);this.sound('machine-gun');const hit=this.damage(1);for(let i=0;i<6;i++)await this.animate(e,[{opacity:1},{opacity:0}],95);await hit;this.remove(e);await this.ring(x,y);}
  if(kind==='lv2'){const shell=this.centered(this.primitive('shell'),180,this.height*.96,9);await this.animate(shell,[{y:shell.y,sx:2,sy:2},{y:this.height*.5,sx:.6,sy:.6}],350);this.remove(shell);this.sound('explosion');await Promise.all([this.damage(1),this.smoke(180,this.height*.5)]);this.sound('explosion');await Promise.all([this.damage(1),this.smoke(180,this.height*.5)]);}
  if(kind==='lv3'){await this.projectile(art.mine,180,this.height*.5,100.8,720);this.sound('electric-charge');const e=this.centered(art.electric,180,this.height*.5,295.2,this.height*.92);await this.animate(e,[{opacity:0,sx:.05,sy:.05},{opacity:.32,sx:.35,sy:.35,offset:.35},{opacity:.8,sx:1,sy:1}],1500);this.sound('explosion');await Promise.all([this.damage(damage),this.animate(e,[{opacity:.8},{opacity:0}],220),this.explosion(art.explosion,180,this.height*.5,331.2,this.height,650)]);this.remove(e);}
  if(kind==='lv4'){const shade=this.centered(this.primitive('shade'),180,this.height/2,360,this.height,7);await this.animate(shade,[{opacity:0},{opacity:.7}],300);this.sound('judgment');const beam=this.centered(art.beam,180,this.height*.5,75,this.height*1.5,8);await this.animate(beam,[{sy:0},{sy:1}],450);const flash=this.centered(this.primitive('white'),180,this.height/2,360,this.height,9);await this.animate(flash,[{opacity:0,sx:.004},{opacity:.35,sx:.5,offset:.45},{opacity:1,sx:1}],1400);await this.damage(4);await this.wait(300);this.remove(beam);this.remove(shade);await this.animate(flash,[{opacity:1},{opacity:0}],800);this.remove(flash);}
 }
 async explosion(src,x,y,w,h=w,duration=650){const e=this.centered(src,x,y,w,h);await this.animate(e,[{opacity:0,sx:.2,sy:.2},{opacity:1,sx:1,sy:1,offset:.25},{opacity:0,sx:1.4,sy:1.4}],duration);this.remove(e);}
 async attackSpace(kind){
  const b=this.enemyBox(this.targetOrder()[0]||0),x=b[0]+b[2]/2,y=this.form().core?b[1]+b[3]*this.form().core.y:this.height*.56,art=this.data.attacks;
  if(kind==='lv1'){for(let i=0;i<6;i++){this.sound('space-beam');const fromX=360*(i%2?.58:.42),fromY=this.height*1.1,dx=x-fromX,dy=y-fromY,length=Math.hypot(dx,dy),e=this.sprite(this.primitive('beam'),length,6,[0,.5]);e.height=4;e.x=fromX;e.y=fromY-2;e.angle=Math.atan2(dy,dx)*180/Math.PI;await this.animate(e,[{opacity:0,sx:0},{opacity:1,sx:1,offset:.1},{opacity:0,sx:1}],95);this.remove(e);}}
  if(kind==='lv2'){const e=this.centered(art.lv2.src,180,this.height*1.35,64.8);await this.animate(e,[{opacity:0},{opacity:1,y:this.height*.7-32.4}],1100);await this.animate(e,[{x:e.x,y:e.y,angle:0,sx:1,sy:1},{x:(180+x)/2-32.4,y:Math.min(this.height*.7,y)-54-32.4,angle:315,sx:.75,sy:.75,offset:.55},{x:x-32.4,y:y-32.4,angle:720,sx:.35,sy:.35}],850,'ease-in');this.remove(e);this.sound('explosion');await this.smoke(x,y,2);}
  if(kind==='lv3')await Promise.all([0,1,2].map(async i=>{await this.projectile(art.lv3.src,x+(i-1)*18,y,82.8,720,i*95);this.sound('explosion');await Promise.all([this.smoke(x+(i-1)*18,y),this.ring(x,y)]);}));
  if(kind==='lv4'){const e=this.centered(art.lv4.src,180,this.height/2,360,this.height);await this.animate(e,[{opacity:0},{opacity:1}],700);await this.wait(250);const hole=this.centered(this.holeRaster(.9),180,this.height/2,792,792,7);hole.maskScale=.9;await this.animate(hole,[{opacity:0,maskScale:.9,angle:0},{opacity:.8,maskScale:.45,angle:-130,offset:.5},{opacity:.8,maskScale:0,angle:-300}],1600,'ease-in');this.remove(e);await this.wait(250);this.sound('explosion');await this.explosion(this.data.effects.explosion,180,this.height/2,360,this.height,900);await this.animate(hole,[{opacity:1},{opacity:0}],250);this.remove(hole);}
  await this.ring(x,y);if(kind==='lv1')this.sound('metal');await this.damage(Number(kind.slice(-1)));
 }
}
root.PlayTheaterCanvas=PlayTheaterCanvas;
})(typeof window!=='undefined'?window:globalThis);
