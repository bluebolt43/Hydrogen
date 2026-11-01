/* Steampunk-only scenery motion; never changes the layout or physical objects. */
(function(root){
'use strict';
const needleKeys=[[0,-55],[.45,55],[.55,51],[.65,57],[1,-55]];
const unlockLightImages=['res/img/steampunk/steampunk-unlock-lights-0.png','res/img/steampunk/steampunk-unlock-lights-1.png','res/img/steampunk/steampunk-unlock-lights-2.png'];
const Art=typeof module!=='undefined'&&module.exports?require('./art-layers.js'):root.PinballArt;
function pose(o,time,launchAt,resetAt=null){
 const src=o.src||'';
 if(src.endsWith('/steampunk-gear.png'))return {...o,angle:o.angle+time*20};
 if(src.endsWith('/steampunk-pressure-needle.png')){
  const keys=needleKeys,t=(time%4)/4;
  const i=t<=.45?1:t<=.55?2:t<=.65?3:4,a=keys[i-1],b=keys[i],u=(t-a[0])/(b[0]-a[0]);
  return {...o,angle:o.angle+a[1]+(b[1]-a[1])*(.5-.5*Math.cos(u*Math.PI))};
 }
 if(src.endsWith('/steampunk-rocket.png')&&launchAt!==null){
  if(resetAt!==null&&resetAt>=launchAt)return {...o,opacity:o.opacity*Math.max(0,Math.min(1,(time-resetAt)/.5))};
  const age=time-launchAt;
  if(age>=0&&age<.3)return {...o,x:o.x+Math.sin(age*90)*.8};
  if(age>=.3&&age<1.8){const t=(age-.3)/1.5;return {...o,y:o.y-(o.y+o.height+30)*t*t,opacity:o.opacity*Math.min(1,(1-t)*5)};}
  if(age>=1.8)return {...o,opacity:0};
 }
 return o;
}
function missionArt(o,game){
 if(o.src?.endsWith('/steampunk-mission-arrow-off.png')){
  const lights=typeof module!=='undefined'&&module.exports?require('../indicator-lights.js'):root.IndicatorLights;
  if(game.ball?.state==='ready'&&o.indicator?.group&&lights.attractLight(game,o)!==null)return o;
  if(o.bind==='blockhole-001'&&o.indicator){
   const until=game.holeExpiresAt?.get(o.bind),time=game.time||0;
   const available=game.armedHoles?.has(o.bind)&&Number.isFinite(until)&&time<until;
   const age=Math.max(0,time-(until-15)),b=o.indicator.behavior;
   const lit=available&&age%(b.onSeconds+b.offSeconds)<b.onSeconds;
   return {...o,indicator:undefined,src:lit?o.indicator.on:o.indicator.off};
  }
  const attack=o.indicator?.trigger?.kind==='enemy-active',unlock=o.bind==='targetGroup-004';
  if(attack||unlock){
   const rule=game.configuredGroups?.find(r=>r.id===o.bind);
   const available=!!game.enemyActive&&!game.enemyIntroPending&&(!unlock||(!!rule&&rule.unlocked<rule.blockers.length))&&!(rule?.action==='blackHole'&&game.armedHoles?.has(rule.hole));
   // Once play starts, mission availability controls these arrows.
   const b=o.indicator.behavior,on=b?.onSeconds||.5,off=b?.offSeconds||.5;
   const lit=available&&(b?.mode!=='repeat'||(game.time||0)%(on+off)<on);
   return {...o,indicator:undefined,src:lit?o.indicator.on:o.indicator.off};
  }
 }
 if(o.state!=='guide-arrow')return o;
 const rule=game.configuredGroups?.find(r=>r.id===o.bind);
 if(!rule)return o;
 let available=true;
 if(rule.action==='unblock')available=rule.unlocked<rule.blockers.length;
 if(rule.action==='upgrade')available=rule.bumpers.some(id=>game.bumperLevel(id)<3);
 if(rule.action==='boss')available=!game.enemyActive&&!game.enemyIntroPending;
 if(rule.action==='blackHole')available=!game.armedHoles.has(rule.hole);
 return available?o:{...o,hidden:true};
}
function unlockArt(o,game){
 if(o.src.endsWith('/steampunk-target-gear-standing-off.png')){
  const rule=game.targetRuleById?.get(o.bind);
  const fighting=!!game.enemyActive&&!game.enemyIntroPending;
  let available=false;
  if(rule?.action==='unblock')available=fighting&&rule.unlocked<rule.blockers.length;
  if(rule?.action==='upgrade')available=rule.bumpers.some(id=>game.bumperLevel(id)<3);
  if(rule?.action==='blackHole')available=!game.armedHoles.has(rule.hole);
  // Retain bind so the shared target renderer fades a hit target out.
  const lit=available&&(!fighting||(game.time||0)%1<.5);
  return {...o,indicator:undefined,src:lit?o.indicator.on:o.indicator.off};
 }
 if(o.src.endsWith('/steampunk-blocker.png')&&game.isBlockerDisabled(o.bind))return {...o,hidden:true};
 if(!o.src.endsWith('/steampunk-unlock-lights-0.png'))return o;
 const rule=game.configuredGroups?.find(r=>r.id==='targetGroup-004');
 const count=Math.max(0,Math.min(2,rule?.unlocked||0));
 return {...o,indicator:undefined,src:unlockLightImages[count]};
}
class Renderer extends Art.Renderer{
 constructor(base,map,preparedImages){super(base,map,preparedImages);this.launchAt=null;this.resetAt=null;this.motionLayouts=new WeakMap();}
 onEvent(e){
  if(e.type==='new-game'){this.launchAt=null;this.resetAt=null;}
  if(e.type==='blocker-unlocked'&&e.id==='targetGroup-004'&&e.total>0&&e.count===e.total){this.launchAt=e.time;this.resetAt=null;}
  if(e.type==='blockers-reset'&&e.id==='targetGroup-004')this.resetAt=e.time;
 }
 draw(ctx,items,plane,game){let batch=[];for(const o of items){if(o.id===game?.bonus?.config.artId){if(batch.length){this.drawItems(ctx,batch,plane,game);batch=[];}if(!o.hidden&&o.plane===plane)game.bonus.draw(ctx,o,this);}else batch.push(o);}if(batch.length)this.drawItems(ctx,batch,plane,game);}
 drawItems(ctx,items,plane,game){super.draw(ctx,game?items.map(o=>{
  let layout=this.motionLayouts.get(o);
  if(!layout||layout.src!==o.src){layout={src:o.src,moving:/\/(?:steampunk-gear|steampunk-pressure-needle|steampunk-rocket)\.png$/.test(o.src)};this.motionLayouts.set(o,layout);}
  const state=missionArt(unlockArt(o,game),game);
  if(!layout.moving)return state===o?state:{...state,liveArt:true,layoutSource:o};
  if(layout.x!==o.x||layout.y!==o.y||layout.width!==o.width||layout.height!==o.height){
   const r=Math.hypot(o.width,o.height)/2+2,top=o.src.endsWith('/steampunk-rocket.png')?-o.height-30:o.y;
   Object.assign(layout,{x:o.x,y:o.y,width:o.width,height:o.height,bounds:[o.x-r,top-r,o.x+r,o.y+r]});
  }
  const posed=pose(state,game.time,this.launchAt,this.resetAt),result=posed===o?{...posed}:posed;
  result.dynamicPose=true;result.motionBounds=layout.bounds;result.layoutSource=o;return result;
 }):items,plane,game);}
}
const api={Renderer,pose,unlockArt,missionArt};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SteampunkArt=api;
})(globalThis);
