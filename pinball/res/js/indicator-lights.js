/* Indicator triggers and playback. */
(function(root){
'use strict';
function attractLight(game,o){
 if(!game||game.ball.state!=='ready'||game.input?.launch||game.launchAiming||game.charge>0||game.paused||(game.preserveTableOnDrain&&game.hasLaunchedOnce))return null;
 const group=o.indicator?.group;if(!group)return null;
 let show=game.configuredAttractVisual;
 if(!show||show.ball!==game.ball){
  const members=(game.g.artLayers||[]).filter(a=>!a.hidden&&a.indicator?.group);
  const xs=members.map(a=>a.x),ys=members.map(a=>a.y);
  const bandWidth=Math.max(12,...members.map(a=>a.height));
  show=game.configuredAttractVisual={ball:game.ball,start:game.time,
   left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys),bandWidth};
 }
 // Fixed loop: up, down, left-to-right, right-to-left, all on.
 const sweepDuration=3,allOnDuration=1.2;
 const verticalDuration=sweepDuration*2;
 const horizontalStart=verticalDuration,horizontalEnd=horizontalStart+sweepDuration*2;
 const elapsed=Math.max(0,game.time-show.start)%(horizontalEnd+allOnDuration);
 if(elapsed<horizontalEnd){
  const vertical=elapsed<verticalDuration,sweepTime=vertical?elapsed:elapsed-horizontalStart;
  const first=sweepTime<sweepDuration,progress=(first?sweepTime:sweepTime-sweepDuration)/sweepDuration;
  const min=vertical?(first?-show.bottom:show.top):(first?show.left:-show.right);
  const max=vertical?(first?-show.top:show.bottom):(first?show.right:-show.left);
  const value=vertical?(first?-o.y:o.y):(first?o.x:-o.x);
  // Let the whole band pass the final lamp before switching modes.
  const width=show.bandWidth,front=min+progress*(max-min+width);
  return value<=front&&value>=front-width;
 }
 return true;
}


const {signal}=typeof module!=='undefined'&&module.exports?require('./art-events.js'):root.ArtEvents;
const visualStates=new WeakMap();
function presentation(o,g){
 const c=o.indicator,initial=c.defaultState||(c.type==='bumper'?'lv1':'off');
 if(!g)return {state:initial,alpha:1,on:initial==='on'};
 const attract=attractLight(g,o);if(attract!==null)return {state:c.type==='bumper'?(attract?'lv3':'lv1'):(attract?(c.attractState||'on'):'off'),alpha:1,on:false,attract:true};
 if(c.trigger?.kind==='hole-count'){const count=g.holeCaptureCounts?.get(c.trigger.source)||0,state=count>=(c.trigger.threshold||2)?'complete':count>0?'on':'off';return {state,alpha:1,on:state!=='off'};}
 const linkedTriggers=[c.trigger||{},...(c.extraTriggers||[])],captureSource=linkedTriggers.find(t=>t.kind==='hole-active')?.source;
 // Boss replacement balls retain locks, but paired gaps stay visually closed
 // until a ball is back in play. A live multiball must not close the pair.
 if(g.storyMode&&g.preserveTableOnDrain&&captureSource===g.g.gameplay?.touhouGap?.hole&&
    linkedTriggers.some(t=>t.kind==='gap-launch')&&g.balls.every(ball=>['ready','drained','saver-return'].includes(ball.state)))
  return {state:'off',alpha:1,on:false};
 if(captureSource&&c.captureBehavior&&g.balls.some(ball=>ball.state==='captured'&&ball.held?.id===captureSource)){
  const b=c.captureBehavior,on=b.onSeconds||.2,off=b.offSeconds||.2,age=Math.max(0,g.time-(g.holeCapturedAt.get(captureSource)??g.time)),lit=age%(on+off)<on;
  return {state:lit?'on':'off',alpha:1,on:lit};
 }
 if(c.releaseBehavior){
  const stamp=Math.max(...linkedTriggers.filter(t=>t.kind==='gap-launch').map(t=>g.gapLaunchAt?.get(t.source)??-Infinity));
  const b=c.releaseBehavior,on=b.onSeconds||.15,off=b.offSeconds||.15,age=g.time-stamp;
  const duration=b.mode==='once'?on:b.mode==='burst'?(on+off)*(b.cycles||3):Infinity;
  if(Number.isFinite(stamp)&&age>=0&&age<duration){const lit=['repeat','burst'].includes(b.mode)?age%(on+off)<on:true;return {state:lit?'on':'off',alpha:1,on:lit};}
 }
 if(c.trigger?.kind==='gap-output'){
  const gap=g.g.gameplay?.touhouGap,lock=g.gapLock,exit=gap&&g.socketsById?.get(gap.hole)?.exit_hole;
  const entrance=g.g.gameplay?.multiballHole,socket=entrance&&g.socketsById?.get(entrance);
  const queued=!!entrance&&c.trigger.source===(socket?.exit_hole||entrance)&&!!g.freeBallQueue&&g.freeBallSources?.includes(entrance);
  const gapPending=c.trigger.source===exit&&lock?.active&&lock.pending;
  if(!gapPending&&!queued)return {state:'off',alpha:1,on:false};
  const releasing=gapPending?Number.isFinite(lock.releaseStartedAt):(g.holeMultiballNextAt||0)>0,b=(releasing?c.releaseBehavior:c.behavior)||{};
  const start=gapPending?(releasing?lock.releaseStartedAt:lock.readyAt):(g.holeMultiballNextAt||0);
  const on=b.onSeconds||(releasing?.1:.6),off=b.offSeconds||(releasing?.1:.6),age=Math.max(0,g.time-start);
  const lit=age%(on+off)<on;return {state:lit?'on':'off',alpha:1,on:lit};
 }
 if(c.trigger?.kind==='enemy-target'){
  const id=c.trigger.source,rule=g.targetRuleById?.get(id),completed=rule?.last;
  const b=c.behavior||{},on=b.onSeconds||.3,off=b.offSeconds||.3;
  const finish=c.completion||{},flashOn=finish.onSeconds||.15,flashOff=finish.offSeconds||.15;
  const age=g.time-completed,duration=(flashOn+flashOff)*(finish.cycles||3);
  const lit=Number.isFinite(completed)&&age<duration?age%(flashOn+flashOff)<flashOn:
   g.targetHits?.has(id)||(!g.enemyActive&&!g.enemyIntroPending&&g.time%(on+off)<on);
  return {state:lit?'on':'off',alpha:1,on:!!lit};
 }
 if(c.type==='bumper'){const id=c.trigger?.source||o.bind;let n=g.bumperLevel(id);if(!c.keepLevelOnHit&&(g.bumperHitUntil?.get(id)||0)>g.time)n=n%3+1;return {state:'lv'+n,alpha:1,on:false};}
 let cache=visualStates.get(g);if(!cache||cache.epoch!==g.attackRemaining){cache={epoch:g.attackRemaining,items:new Map()};visualStates.set(g,cache)}
 let v=cache.items.get(o);if(!v){v={active:false,start:null,stamp:undefined,lastOn:false,alpha:0,time:g.time};cache.items.set(o,v)}
 const triggers=c.releaseBehavior?linkedTriggers.filter(t=>t.kind!=='gap-launch'):linkedTriggers;
 const inputs=v.signals||(v.signals=[]);inputs.length=triggers.length;
 for(let i=0;i<triggers.length;i++)inputs[i]=signal(o,g,triggers[i]);
 let completion=null;
 if(c.completion)for(let i=0;i<triggers.length;i++){
  const t=triggers[i],id=t.source;let stamp,rest;
  if(t.kind==='count'){
   const n=g.g.mechanisms.attackCounts[id];stamp=g.attackCompletedAt.get(id);rest=(g.attackRemaining.get(id)??n)===n;
   inputs[i].stamp=undefined;
  }else if(t.kind==='level'){stamp=g.bumperRewardAt?.get(id);
  }else if(t.kind==='kickback'){
   const kicker=g.rescueById?.get(id);stamp=kicker?g.rescueCompletedAt?.get(kicker.layer||'lower'):undefined;rest=!inputs[i].active;
  }else if(t.kind==='rollover'){
   const group=g.rolloverByMember.get(id);stamp=g.rolloverCompletedAt.get(group?.id);rest=!g.rolloverVisualGroups.get(group?.id)?.has(id);
  }else continue;
  if(stamp!=null&&(!completion||stamp>completion.stamp))completion={stamp};
  if(stamp!=null&&rest)inputs[i].active=false;
 }
 let stamp=-Infinity,active=false,rising=false;
 const previousInputs=v.inputs||(v.inputs=[]);
 for(let i=0;i<inputs.length;i++){
  const input=inputs[i];if(Number.isFinite(input.stamp))stamp=Math.max(stamp,input.stamp);
  if(input.active){active=true;if(!previousInputs[i])rising=true;}
  previousInputs[i]=!!input.active;
 }
 previousInputs.length=inputs.length;
 const event=Number.isFinite(stamp);
 const b=c.behavior||{mode:'keep'},on=b.onSeconds||.6,off=b.offSeconds||2.4;
 if(event&&v.stamp!==stamp){v.start=stamp;v.stamp=stamp;}
 if(rising)v.start=g.time;
 if(completion&&completion.stamp>=stamp){
  const b=c.completion,on=b.onSeconds||.6,off=b.offSeconds||2.4,age=Math.max(0,g.time-completion.stamp);
  const duration=b.mode==='once'?on:b.mode==='burst'?(on+off)*(b.cycles||3):Infinity;
  if(age<duration){const state=['repeat','burst'].includes(b.mode)?(age%(on+off)<on?'on':'complete'):'complete';return {state,alpha:1,on:true};}
  if(!active&&!event)return {state:'off',alpha:1,on:false};
 }
 let lit=false,age=v.start===null?Infinity:Math.max(0,g.time-v.start),duration=Infinity;
 if(b.mode==='once')duration=on;
 if(b.mode==='burst')duration=(on+off)*Math.max(1,b.cycles||3);
 if(age<duration&&(event||active))lit=['repeat','burst'].includes(b.mode)?age%(on+off)<on:true;
 const dt=Math.max(0,g.time-v.time);v.time=g.time;
 const fade=c.fade,fadeTime=lit?Math.min(fade?.inSeconds||0,on):Math.min(fade?.outSeconds||0,off);
 if(!fade?.enabled||fadeTime<=0)v.alpha=lit?1:0;else v.alpha=Math.max(0,Math.min(1,v.alpha+(lit?1:-1)*dt/fadeTime));
 v.lastOn=lit;
 return {state:lit||v.alpha>0?'on':'off',alpha:lit||v.alpha>0?v.alpha:1,on:lit};
}
function configuredState(o,g){return presentation(o,g).state;}
function maskActive(o,g){return !!o.indicator?.screenMask&&presentation(o,g).on;}
function basicState(o,g){
 if(g&&o.state==='return-gate'&&!g.gates.some(p=>p.id===o.bind&&p.closed&&!p.unlocked))return null;
 if(g&&o.state==='center-post'&&!g.configuredPosts?.get(o.bind)?.raised)return null;
 const active=!!(g&&o.state==='vortex'&&(g.armedHoles?.has(o.bind)||g.balls?.some(b=>b.state==='captured'&&b.held?.id===o.bind)));
 return {src:o.src,baseSrc:o.src,frame:Math.min(active?1:0,(o.frames||1)-1),active};
}
function artMap(base={}){return {...base,artState(o,g,renderer){
 if(g&&o.state==='return-gate'&&!g.gates.some(p=>p.id===o.bind&&p.closed&&!p.unlocked))return null;
 if(!o.indicator)return (base.artState||basicState)(o,g,renderer);
 const p=presentation(o,g),src=o.indicator[p.attract&&o.indicator.glow?.attractUseOff?'off':p.state];if(!src)return null;
 const glow=o.indicator.glow,preview=glow?.preview;
 let color=glow?.[p.state],period=p.attract?null:glow?.pulse?.[p.state];
 // Preview light never changes the collected state; collected progress stays steady.
 if(!p.attract&&p.state==='off'&&g&&preview&&signal(o,g,preview.trigger).active){color=preview.color;period=preview.pulseSeconds;}
 const alpha=period&&g?.time!=null?((g.time%period+period)%period<period/2?1:0):1;
 renderer.image(src);return {src,baseSrc:src,frame:0,alpha:p.alpha,glow:color?{color,alpha}:null};
}};}
const api={attractLight,artMap,configuredState,maskActive,presentation};if(typeof module!=='undefined')module.exports=api;else root.IndicatorLights=api;
})(globalThis);
