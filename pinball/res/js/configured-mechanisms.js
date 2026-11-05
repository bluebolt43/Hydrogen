/* Shared gameplay rules. */
(function(root){
'use strict';
const layout=typeof module!=='undefined'?require('./mechanism-layout.js'):root.MechanismLayout;
const view=typeof module!=='undefined'?require('./mechanism-view.js'):root.MechanismView;
function createGame(Base,P){return class ConfiguredGame extends Base{
  reset(){this.gapLock=null;super.reset();}
  gapBusy(){return this.gapLock?.active||this.freeBallQueue>0||this.balls.filter(b=>b.state!=='drained').length>1;}
  hasPendingBalls(){return super.hasPendingBalls()||this.gapLock?.pending>0;}
  spawnFreeBall(){
   const entrance=this.socketsById.get(this.freeBallSources[0]);
   if(!entrance)return super.spawnFreeBall();
   if(!this.freeBallQueue)return;
   if(this.balls.filter(b=>b.state!=='drained').length>=3){this.freeBallQueue--;this.freeBallSources.shift();this.awardExtraLife('multiball',this.freeBallRewardPositions.shift()||this.ball.p);return;}
   const exit=this.socketsById.get(entrance.exit_hole)||entrance;
   if(this.time<(this.holeMultiballNextAt||0)||this.balls.some(b=>b.state==='captured'&&b.held?.id===exit.id||b.state!=='drained'&&b.layer===exit.layer&&P.len(P.sub(b.p,exit.release))<this.physics.ballRadius*2+3))return;
   const previous=this.ball,b={p:[...exit.center],v:[0,0],layer:exit.layer,z:0,state:'captured',immunity:0,trail:[],free:true};
   this.balls.push(b);this.ball=b;this.held={id:exit.id,remaining:0,speed:0,release:[...exit.release],layer:exit.layer,direction:exit.release_direction};
   this.release();this.freeBallQueue--;this.freeBallSources.shift();this.freeBallRewardPositions.shift();this.holeMultiballNextAt=this.time+.5;
   this.emit('free-ball-launch',{id:exit.id,position:[...b.p],layer:b.layer});this.ball=previous;
  }
  awardGapMultiball(count){
   const gap=this.g.gameplay.touhouGap,state=this.gapLock;
   const room=Math.max(0,3-this.balls.filter(b=>b.state!=='drained').length-this.freeBallQueue-state.pending),added=Math.min(count,room);
   if(!added)return;
   if(!state.active){
    const delay=gap.readySeconds??1.5;
    Object.assign(state,{count:0,active:true,readyAt:this.time,releaseStartedAt:null,nextReleaseAt:this.time+delay});
    if(this.held?.id===gap.hole)this.held.remaining=delay;
   }
   state.pending+=added;this.multiballAwards+=added;
   this.emit('multiball-awarded',{count:this.multiballAwards});
   this.emit('gap-multiball',{id:gap.hole,balls:this.balls.filter(b=>b.state!=='drained').length+state.pending});
  }
  releaseGapBall(){
   const state=this.gapLock,gap=this.g.gameplay?.touhouGap;
   if(!state?.pending||this.time<state.nextReleaseAt||this.balls.some(b=>b.state==='captured'&&b.held?.id===gap.hole))return;
   const entrance=this.socketsById.get(gap.hole),exit=this.socketsById.get(entrance.exit_hole),p=exit.release;
   if(this.balls.filter(b=>b.state!=='drained').length+this.freeBallQueue>=3)return;
   if(this.balls.some(b=>b.state!=='drained'&&b.layer===exit.layer&&P.len(P.sub(b.p,p))<this.physics.ballRadius*2+3))return;
   const previous=this.ball,b={p:[...exit.center],v:[0,0],layer:exit.layer,z:0,state:'captured',immunity:0,trail:[],free:true};
   this.balls.push(b);this.ball=b;this.held={id:exit.id,remaining:0,speed:0,release:[...exit.release],layer:exit.layer,direction:exit.release_direction};
   this.release();state.releaseStartedAt??=this.time;state.pending--;state.nextReleaseAt=this.time+.5;
   this.emit('free-ball-launch',{id:exit.id,position:[...b.p],layer:b.layer});this.ball=previous;
  }
  // Physics integration: flippers, portals and guided tracks.
  enterGuidedTrack(track){
   const previous=[...this.ball.p],layer=this.ball.layer;
   super.enterGuidedTrack(track);
   // Snapping to an entrance can cross a sensor before guided motion skips afterBallStep.
   // Connected guided segments have no free-ball entrance movement to count.
   if(layer!=='guided')this.crossConfiguredSensors(previous,layer);
  }
  collide(dt){
   if(this.config.physicsModel!=='legacy'){super.collide(dt);return;}
   const Cadet=typeof module!=='undefined'?require('./game/space-cadet-flipper.js'):root.SpaceCadetFlipper;
   for(const f of this.flippers){
    if(!f.cadet)f.cadet=new Cadet(f,this.config);
    if(f.cadet.configuredWallGuard)continue;
    const find=f.cadet.find.bind(f.cadet);
    f.cadet.find=(p,v,time,remaining)=>{
     const hit=find(p,v,time,remaining);
 if(!hit?.position)return hit;
     const d=P.sub(hit.position,p),r=this.physics.ballRadius;
     // Sweep depenetration against walls to prevent tunneling.
     for(const edge of [...this.grids[this.ball.layer].query(p,d,Math.max(5,r)),...this.dynamicEdges()]){
      if(!['wall','rail','gate'].includes(edge.kind)||!this.edgeEnabled(edge))continue;
      if(edge.n&&(P.dot(d,edge.n)>=-P.EPS||P.dot(P.sub(p,edge.a),edge.n)<r-.08))continue;
      const blocked=edge.c?P.circleHit(p,d,edge.c,r+edge.r):P.segmentHit(p,d,edge.a,edge.b,r+(edge.thickness||0)/2);
      if(blocked&&blocked.t<1-1e-6)return null;
     }
     return hit;
    };
    f.cadet.configuredWallGuard=true;
   }
   super.collide(dt);
  }
 emit(type,data={}){
  const gap=this.g.gameplay?.touhouGap,state=this.gapLock;
  if(gap&&state&&type==='multiball-awarded'&&(!gap.keepOpenUntilFull||state.active)){state.armed=false;state.passes=0;state.routePending=false;this.armedHoles.delete(gap.hole);}
  if(gap&&state&&type==='drain'){
   state.routePending=false;
   if(!this.storyMode&&!this.preserveTableOnDrain&&!this.freeBallQueue&&!state.pending&&this.balls.every(b=>b.state==='drained')){
    Object.assign(state,{count:0,passes:0,routePending:false,armed:false,active:false,pending:0,readyAt:0,releaseStartedAt:null,nextReleaseAt:0});
    this.armedHoles.delete(gap.hole);this.gapLaunchAt?.delete(gap.hole);this.holeCapturedAt?.delete(gap.hole);
   }
  }
  if(gap&&state&&type==='layer'&&data.id===gap.routeExit&&state.routePending&&!this.gapBusy()){
   state.routePending=false;state.passes++;super.emit('gap-route-completed',{id:gap.routeExit,passes:state.passes});
  }
  if(gap&&state&&type==='sensor'&&data.id===gap.sensor&&!state.armed&&!state.routePending&&!this.gapBusy()){
   if(state.passes>=(gap.passes??2)-1){state.passes=0;state.armed=true;this.armedHoles.add(gap.hole);super.emit('gap-opened',{id:gap.hole,locked:state.count});}
   else state.routePending=true;
  }
  if(type==='gap-ball-ready'){this.gapLaunchAt??=new Map();this.gapLaunchAt.set(data.id,this.time);}
  if(type==='configured-attack'){this.attackVisualAt??=new Map();
 this.attackVisualAt.set(data.kind,this.time);
 }return super.emit(type,data);
 }
 portalHit(p,d){let best=super.portalHit(p,d);
 const b=this.ball,entries=this.g.circle_entries||[];
  if(b.circleEntryBlocked){if(entries.some(e=>P.len(P.sub(p,e.center))<=e.radius+.05))return best;
 b.circleEntryBlocked=false;
 }
  for(const e of entries){const to=b.layer===e.from?e.to:e.bidirectional&&b.layer===e.to?e.from:null;
 if(!to)continue;
 const h=P.len(P.sub(p,e.center))<=e.radius?{t:0}:P.circleHit(p,d,e.center,e.radius);
 if(h&&(!best||h.t<best.t))best={t:h.t,editorPortal:{id:e.id,to,stopOnEntry:e.stopOnEntry,initialSpeed:e.initialSpeed},circleEntry:true,center:e.center};
 }return best;
 }
 transition(hit){
 if(!hit.circleEntry)return super.transition(hit);
 const b=this.ball;
 b.circleEntryBlocked=true;
 b.entryCapture={hit,start:[...b.p],incoming:[...b.v],elapsed:0};
 b.v=[0,0];b.state='entry-capture';b.trail=[];
 }
 handleBallState(dt){
 const b=this.ball;
 if(b.state!=='entry-capture')return super.handleBallState(dt);
 const capture=b.entryCapture;
 capture.elapsed+=dt;
 const t=Math.min(1,capture.elapsed/.15);
 b.p=P.add(capture.start,P.mul(P.sub(capture.hit.center,capture.start),t));
 if(t===1){
  b.p=[...capture.hit.center];b.v=capture.incoming;b.state='playing';delete b.entryCapture;
  super.transition(capture.hit);
 }
 return true;
 }
 guidedTrackHit(p,d){const layer=this.ball.layer,tracks=this.guidedTracks;
 if(!['lower','tavern','top'].includes(layer))return null;
 try{this.guidedTracks=tracks.filter(t=>t.layer===layer);
 this.ball.layer='lower';
 return super.guidedTrackHit(p,d);
 }finally{this.guidedTracks=tracks;
 this.ball.layer=layer;
 }}
 advanceGuidedTrack(dt){const tracks=this.guidedTracks,layer=tracks.find(t=>t.id===this.ball.track.id).layer,previous=[...this.ball.p];
 try{this.guidedTracks=tracks.filter(t=>t.layer===layer);
 const remaining=super.advanceGuidedTrack(dt);
 this.crossConfiguredSensors(previous,layer);
 if(this.ball.state==='playing')this.ball.layer=layer;
 return remaining;
 }finally{this.guidedTracks=tracks;
 }}
 rebuildObjectGrids(){for(const layer of ['lower','tavern','top'])if(this.edges[layer])this.grids[layer]=new P.Grid(this.edges[layer]);}
 restoreObjectGeometry(part){const original=this.objectGeometryOriginal?.get(part);if(!original)return;for(const [point,value] of original){point[0]=value[0];point[1]=value[1];}this.objectGeometryOriginal.delete(part);this.rebuildObjectGrids();}
 applyObjectEffect(source){
  for(const rule of this.g.objectEffects||[]){if(rule.source!==source||(!['restore','toggle'].includes(rule.action)&&this.objectEffectsDone.has(source))||(rule.action==='rotate90'&&this.rotatedObjects.has(rule.object)))continue;
   this.objectEffectsDone.add(source);
   const part=[...this.g.lower,...this.g.upper_parts,...(this.g.top_parts||[])].find(o=>o.id===rule.object);
   if(rule.action==='toggle'){if(this.hiddenObjects.has(part.id))this.hiddenObjects.delete(part.id);else this.hiddenObjects.add(part.id);}
   else if(rule.action==='hide')this.hiddenObjects.add(part.id);
   else if(rule.action==='restore'){this.hiddenObjects.delete(part.id);this.restoreObjectGeometry(part);this.rotatedObjects.delete(part.id);for(const related of this.g.objectEffects||[])if(related.object===part.id)this.objectEffectsDone.delete(related.source);}
   else if(part.points?.length){
    this.rotatedObjects.add(part.id);
    const points=[...new Set(part.points)],normal=part.pass_normal;
    if(!this.objectGeometryOriginal.has(part))this.objectGeometryOriginal.set(part,new Map([...points,...(normal?[normal]:[])].map(p=>[p,[...p]])));
    const center=[(Math.min(...points.map(p=>p[0]))+Math.max(...points.map(p=>p[0])))/2,(Math.min(...points.map(p=>p[1]))+Math.max(...points.map(p=>p[1])))/2];
    for(const p of points){const x=p[0]-center[0],y=p[1]-center[1];p[0]=center[0]-y;p[1]=center[1]+x;}
    if(normal){const x=normal[0];normal[0]=-normal[1];normal[1]=x;}
    this.rebuildObjectGrids();
   }
   this.emit('object-effect',{source,object:rule.object,action:rule.action});
  }
 }
 capture(...args){if(args[0]===this.g.gameplay?.touhouGap?.hole&&(!this.gapLock?.armed||this.gapBusy()))return;const playing=this.ball.state==='playing',start=this.events.length;super.capture(...args);if(playing&&this.ball.state==='captured'&&this.held?.id===args[0]&&!this.events.slice(start).some(e=>e.type==='object-effect'&&e.source===args[0]))this.applyObjectEffect(args[0]);}
 // Rule state.
 resetTargets(){
 for(const part of this.objectGeometryOriginal?.keys()||[])this.restoreObjectGeometry(part);
 this.objectGeometryOriginal=new Map();
 this.objectEffectsDone=new Set();this.hiddenObjects=new Set();this.rotatedObjects=new Set();
 super.resetTargets();
 this.configuredPosts=new Map((this.g.mechanisms?.posts||[]).map(p=>[p.id,{...p,collected:new Set(),raised:false,left:0,contacts:new Set()}]));
 this.configuredGroups=(this.g.mechanisms?.groups||[]).map(r=>({...r,secondary:r.secondary?{...r.secondary,unlocked:0}:undefined,collected:new Set(),last:-Infinity,unlocked:0}));
 for(const r of this.configuredGroups){if(r.secondary)r.secondary.groupState=r;let group=this.targetGroups.find(g=>g.id===r.id);
 if(!group){group={id:r.id,hits:new Set(),complete:false,completions:0,resetAt:0};
 this.targetGroups.push(group);
 }group.targets=[...r.targets];
 }this.configuredBumpers=new Map();
 this.armedHoles=new Set();this.gapLaunchAt=new Map();
 this.holeExpiresAt=new Map();
 this.holeMultiballHits=0;
 this.holeMultiballNextAt=0;
 if(this.configuredGroups.some(r=>r.action==='blackHole')){this.vortexActive=false;
 this.vortexActivatedAt=null;
 }this.attackVisualAt=new Map();
 this.attackCompletedAt=new Map();
 this.bumperRewardAt=new Map();
 this.objectAttackAt=new Map();
 this.attackRemaining=new Map(Object.entries(this.g.mechanisms?.attackCounts||{}));
 this.rolloverFlipperInput={left:false,right:false};
 this.rolloverFlashUntil=new Map();
 this.rolloverVisualGroups=new Map();
 this.rolloverCompletedAt=new Map();
 this.rolloverGroups=(this.g.mechanisms?.rolloverGroups||[]).map(r=>({...r,collected:new Set()}));
 // Rebuild event indexes on reset.
 this.rolloverByMember=new Map();
 for(const group of this.rolloverGroups)for(const id of group.members)this.rolloverByMember.set(id,group);
 this.targetRuleById=new Map();
 this.targetDisplayById=new Map(this.targetGroups.map(group=>[group.id,group]));
 this.blockerOwners=new Map();this.blockerResets=new Map();this.controlledHoles=new Set();
 const add=(map,id,value)=>{if(!map.has(id))map.set(id,[]);map.get(id).push(value)};
 for(const rule of this.configuredGroups.flatMap(r=>[r,...(r.secondary?[r.secondary]:[])])){
  for(const id of rule.targets||[])this.targetRuleById.set(id,rule);
  if(rule.action==='blackHole')this.controlledHoles.add(rule.hole);
  if(rule.action==='unblock'){
   rule.blockers.forEach((id,index)=>add(this.blockerOwners,id,{rule,index}));
   for(const id of rule.resetSensors)add(this.blockerResets,id,rule);
  }
 }
 this.postsByRollover=new Map();
 for(const post of this.configuredPosts.values())for(const id of post.sensors)add(this.postsByRollover,id,post);
 this.rescueById=new Map((this.g.rescue_kickers||[]).map(kicker=>[kicker.id,kicker]));
 this.socketsById=new Map();this.socketsByLayer=new Map();this.sensorsByLayer=new Map();
 for(const [layer,list] of [['lower',this.g.lower],['tavern',this.g.upper_parts],['top',this.g.top_parts||[]]]){
  const sockets=list.filter(part=>part.kind==='socket');this.socketsByLayer.set(layer,sockets);
  for(const socket of sockets)this.socketsById.set(socket.id,socket);
  this.sensorsByLayer.set(layer,list.filter(part=>['sensor','rollover-line'].includes(part.kind)));
 }

 const gap=this.g.gameplay?.touhouGap;
 if(gap){const armed=!!gap.keepOpenUntilFull&&!!this.gapLock?.armed;this.gapLock??={count:0,passes:0,routePending:false,armed:false,active:false,pending:0,nextReleaseAt:0};this.gapLock.armed=armed;if(armed)this.armedHoles.add(gap.hole);this.gapLock.passes=0;this.gapLock.routePending=false;this.controlledHoles.add(gap.hole);}

 }
 // Attack counters and grouped rollover completion.
 fireObjectAttack(objectId){
  const group=this.rolloverByMember.get(objectId);
  const id=group?.id||objectId;
  const kind=group?group.attack:this.g.mechanisms?.attacks?.[id];
  if(!kind||kind==='none'&&!this.g.gameplay?.indicatorCounters?.includes(id))return;
  // A multi-lane group already deduplicates its members with a Set. Applying
  // the last round's contact cooldown here can discard a valid next-lane hit.
  if((!group||group.members.length<2)&&this.time-(this.objectAttackAt.get(id)??-Infinity)<.3)return;

  if(group){
   group.collected.add(objectId);
   if(group.collected.size<group.members.length)return;
   group.collected.clear();
  }

  this.objectAttackAt.set(id,this.time);
  const count=this.g.mechanisms.attackCounts[id]??1;
  const remaining=(this.attackRemaining.get(id)??count)-1;
  this.attackRemaining.set(id,remaining>0?remaining:count);
  this.emit('attack-countdown',{id,remaining});
  if(remaining>0)return;

  this.attackCompletedAt.set(id,this.time);
  // Table feedback is independent of enemy presence; the theater guards damage.
  if(kind!=='none')this.emit('configured-attack',{kind,id,position:[...this.ball.p]});
 }
 // Hole release, activation and expiry.
 release(){
   const gap=this.g.gameplay?.touhouGap,state=this.gapLock;
   if(gap&&this.held?.id===gap.hole&&state.count>0&&!state.active){
    const b=this.ball,p=this.g.plunger;
    Object.assign(b,{p:[p.x,p.rest_y-this.physics.ballRadius],v:[0,0],layer:this.launchLayer(),z:this.launchHeight(),state:'ready',immunity:0,trail:[],launchGuard:false});
    delete b.held;delete b.track;this.charge=this.chargeElapsed=0;this.input.launch=false;
    const gate=this.gates.find(g=>g.id==='shooter-return');if(gate){gate.closed=false;gate.pending=false;gate.pendingBall=null;}
    this.emit('gap-ball-ready',{id:gap.hole,locked:state.count});if(gap.autoLaunch)this.launch(1);return;
   }
  const h=this.held,entrance=this.socketsById.get(h?.id),socket=this.socketsById.get(entrance?.exit_hole)||entrance,releaseStart=[...this.ball.p],remote=socket!==entrance;
 if(!socket?.release_mode)return super.release();
  // Space Cadet angular and speed variation.
  // https://github.com/k4zmu2a/SpaceCadetPinball/blob/master/SpaceCadetPinball/TBall.cpp
  const spread=socket.mechanic==='vortex-center'?45:5;
  const random=this.random||Math.random,angle=this.config.physicsModel!=='legacy'||socket.release_mode==='fixed'?0:(1-2*random())*spread*Math.PI/180;
  const d=socket.release_direction||h.direction,c=Math.cos(angle),s=Math.sin(angle),speed=socket.ballSpeed>0?socket.ballSpeed:this.config.physicsModel!=='legacy'?this.physics.kickbackSpeed:260*this.physics.speedScale*(1+(1-2*random())*.1),b=this.ball;
  b.p=[...(remote?socket.release:h.release)];
 b.layer=remote?socket.layer:h.layer;
 b.z=b.layer==='top'?this.physics.rampHeight*2:b.layer==='tavern'?this.physics.rampHeight:0;
 b.v=P.mul(P.unit([d[0]*c-d[1]*s,d[0]*s+d[1]*c]),speed);
  b.state='playing';
 b.immunity=this.time+.5;
 this.held=null;
 this.limitSpeed();
 if(gap&&h.id===gap.hole&&state.active&&state.pending>0){state.releaseStartedAt=this.time;state.nextReleaseAt=this.time+.5;}
 this.emit('release',{id:h.id,speed:P.len(b.v)});
 // Scan only the exit's local ejection segment, never the teleport between holes.
 if(!socket.remote_release)this.crossConfiguredSensors(remote?socket.center:releaseStart,b.layer);
 }
 syncHoleActivation(){this.vortexActive=this.armedHoles.size>0;
 }
 activateHole(id){this.armedHoles.add(id);
 this.holeExpiresAt.set(id,this.time+15);
 this.vortexActivatedAt=this.time;
 this.syncHoleActivation();
 }
 consumeHole(id){if(this.armedHoles.has(id)){this.armedHoles.delete(id);
 this.holeExpiresAt.delete(id);
 this.syncHoleActivation();
 this.emit('vortex-deactivated',{id});
 }}
 expireHoles(){for(const [id,until] of this.holeExpiresAt)if(this.time>=until){this.holeExpiresAt.delete(id);
 this.armedHoles.delete(id);
 this.syncHoleActivation();
 this.emit('vortex-expired',{id});
 }}
 tickRules(){this.updateTargetGroups();
 this.expireHoles();
 this.releaseGapBall();
 }
 onCapture(id){
 const multi=this.g.gameplay?.holeMultiball;
 if(multi&&id===multi.hole){this.holeMultiballHits++;if(this.holeMultiballHits>=multi.hits){this.holeMultiballHits=0;this.holeCaptureCounts.set(id,0);this.awardMultiball(this.ball.p,this.ball.layer,multi.hole);
  const total=multi.balls||2,live=this.balls.filter(b=>b.state!=='drained').length;
  while(live+this.freeBallQueue<total){this.freeBallQueue++;this.freeBallSources.push(multi.hole);this.freeBallRewardPositions.push([...this.ball.p]);}}}
 const gap=this.g.gameplay?.touhouGap,state=this.gapLock;
 if(gap&&id===gap.hole){
  if(gap.captureSeconds>0&&this.held)this.held.remaining=gap.captureSeconds;
  state.count++;state.armed=!!gap.keepOpenUntilFull&&state.count<gap.locks;if(!state.armed)this.armedHoles.delete(id);
  this.emit('gap-ball-locked',{id,locked:state.count});
  if(state.count===gap.locks){const delay=gap.readySeconds??1.5;state.count=0;state.active=true;state.pending=2;state.readyAt=this.time;state.releaseStartedAt=null;state.nextReleaseAt=this.time+delay;if(this.held)this.held.remaining=delay;this.multiballAwards++;this.emit('multiball-awarded',{count:this.multiballAwards});this.emit('gap-multiball',{id,balls:3});}
 }
 this.fireObjectAttack(id);
 if(!gap?.keepOpenUntilFull||id!==gap.hole||!state.armed)this.consumeHole(id);
 }
 // Rollover display and center-post collection.
 recordRolloverLight(id){
  const group=this.rolloverByMember.get(id);
  if(!group){this.rolloverFlashUntil.set(id,this.time+.65);
 return;
 }
  let hits=this.rolloverVisualGroups.get(group.id);
 if(!hits){hits=new Set();
 this.rolloverVisualGroups.set(group.id,hits);
 }hits.add(id);
  if(group.members.every(id=>hits.has(id))){this.rolloverCompletedAt.set(group.id,this.time);for(const member of group.members)this.rolloverFlashUntil.set(member,this.time+.65);
 hits.clear();
 }
 }
 rolloverLit(id){
  const group=this.rolloverByMember.get(id);
  return (this.rolloverFlashUntil.get(id)||0)>this.time||!!this.rolloverVisualGroups.get(group?.id)?.has(id)||(this.postsByRollover.get(id)||[]).some(post=>post.collected.has(id));
 }
 syncPost(){const p=this.configuredPosts.values().next().value;
 if(p){this.centerPostRaised=p.raised;
 this.centerPostHitsLeft=p.left;
 }}
 raiseCenterPost(id){if(id){const post=this.configuredPosts?.get(id);
 if(post)this.activatePost(post);
 return;
 }for(const post of this.configuredPosts?.values()||[])if(post.sensors.length&&post.sensors.every(id=>post.collected.has(id)))this.activatePost(post);
 }
 activatePost(p){if(p.raised)return;
 p.raised=true;
 p.left=p.hits;
 p.collected.clear();
 p.contacts.clear();
 this.syncPost();
 this.emit('center-post-up',{id:p.id});
 }
 // Target-controlled blockers and per-ball collision hooks.
 isBlockerDisabled(id){const owners=this.blockerOwners?.get(id);return owners?owners.some(({rule,index})=>index<rule.unlocked):false;
 }
 resetBlockers(sensorId){for(const r of this.blockerResets.get(sensorId)||[]){r.unlocked=0;
 const state=r.groupState||r;state.last=this.time;
 state.collected.clear();
 for(const id of state.targets){this.targetHits.delete(id);
 this.targetHitAt.delete(id);
 }const display=this.targetDisplayById.get(state.id);
 display.hits.clear();
 display.complete=false;
 display.resetAt=0;
 this.emit('blockers-reset',{id:r.id,objects:[...r.blockers]});
 }}
 edgeEnabled(e,b=this.ball){if(this.hiddenObjects?.has(e.id)||this.isBlockerDisabled(e.id))return false;
 const p=this.configuredPosts?.get(e.id);
 return p?p.raised:super.edgeEnabled(e,b);
 }
 collisionEffect(e,approach){const p=this.configuredPosts?.get(e.id);
 if(!p)return super.collisionEffect(e,approach);
 if(!p.raised||approach<=0||p.contacts.has(this.ball))return;
 p.contacts.add(this.ball);
 p.hitUntil=this.time+.12;
 p.left--;
 this.emit('center-post-hit',{id:p.id,remaining:p.left});
 if(!p.left){p.raised=false;
 this.emit('center-post-down',{id:p.id});
 }this.syncPost();
 }
 updateRolloverLaneChange(){
  const previous=this.rolloverFlipperInput||{left:false,right:false},left=!!this.input.left,right=!!this.input.right;
  this.rolloverFlipperInput={left,right};
  const shift=(right&&!previous.right?1:0)-(left&&!previous.left?1:0);
  if(!shift)return;
  const parts=[...(this.g.lower||[]),...(this.g.upper_parts||[]),...(this.g.top_parts||[])];
  const x=id=>{const p=parts.find(p=>p.id===id);return p?.points?.length?p.points.reduce((sum,point)=>sum+point[0],0)/p.points.length:p?.a&&p?.b?(p.a[0]+p.b[0])/2:(p?.c?.[0]??p?.p?.[0]??0);};
  for(const group of this.rolloverGroups||[]){
   if(group.laneChange!==true)continue;
   const members=[...group.members].sort((a,b)=>x(a)-x(b)),rotate=set=>new Set([...set].map(id=>{const index=members.indexOf(id);return index<0?id:members[(index+shift+members.length)%members.length];}));
   const hits=this.rolloverVisualGroups.get(group.id);if(hits)this.rolloverVisualGroups.set(group.id,rotate(hits));
   group.collected=rotate(group.collected);
  }
 }
 afterSubstep(){this.updateRolloverLaneChange();this.spawnFreeBall();
 if(this.gapLock?.active&&!this.gapLock.pending&&!this.freeBallQueue&&this.balls.filter(b=>b.state!=='drained').length<=1)this.gapLock.active=false;
 for(const p of this.configuredPosts.values())for(const b of p.contacts)if(b.state!=='playing'||b.layer!==p.layer||P.len(P.sub(b.p,p.center))>p.radius+this.physics.ballRadius+.3)p.contacts.delete(b);
 }
 afterBallStep(previous,layer,dt){
  this.applyOneWaySpeed?.(previous,layer);
  if(this.ball.launchGuard&&this.ball.v[1]>=0&&this.ball.p[1]>this.launchGateExitY+this.physics.ballRadius)this.ball.launchGuard=false;
  this.flagSensors(previous,layer);
  this.sensors(previous,layer);
  if(this.ball.state!=='playing')return;

  this.crossConfiguredSensors(previous,layer);
 }
 crossConfiguredSensors(previous,layer){
  const movement=P.sub(this.ball.p,previous);
  const floorParts=this.sensorsByLayer.get(layer)||[];
  const crossedRollovers=new Set();
  for(const sensor of floorParts||[]){
   const axis=P.sub(sensor.points[1],sensor.points[0]);
   const denominator=P.cross(movement,axis);
   if(Math.abs(denominator)<1e-8)continue;
   const delta=P.sub(sensor.points[0],previous);
   const alongMovement=P.cross(delta,axis)/denominator;
   const alongSensor=P.cross(delta,movement)/denominator;
   // Count arrival at the line, excluding departure from a shared step endpoint.
   if(alongMovement<=0||alongMovement>1||alongSensor<0||alongSensor>1)continue;

   if(sensor.kind==='sensor'){this.sensorHitAt.set(sensor.id,this.time);this.emit('sensor',{id:sensor.id,layer,position:[...this.ball.p]});}
   else{
    crossedRollovers.add(sensor.id);
    this.recordRolloverLight(sensor.id);
    this.emit('rollover',{id:sensor.id,layer});
   }
   this.applyObjectEffect(sensor.id);
   this.fireObjectAttack(sensor.id);
   this.resetBlockers(sensor.id);
  }

  const touchedPosts=new Set();
  for(const id of crossedRollovers)for(const post of this.postsByRollover.get(id)||[]){
   if(post.raised)continue;
   post.collected.add(id);touchedPosts.add(post);
  }
  for(const post of touchedPosts)if(post.sensors.every(id=>post.collected.has(id)))this.activatePost(post);
 }
 bumperLevel(id){return this.configuredBumpers?.get(id)??1;
 }
 // Target-bank completion actions.
 recordTarget(id){const attackSource=this.g.mechanisms?.targetAttackSources?.[id];if(attackSource)this.fireObjectAttack(attackSource);this.applyObjectEffect(id);const bank=(this.g.objectEffects||[]).find(r=>id.startsWith(r.source+'-'));if(bank)this.applyObjectEffect(bank.source);const r=this.targetRuleById.get(id);
 if(!r)return;
  if(r.action==='unblock'&&r.unlocked>=r.blockers.length&&!r.secondary?.action)return;
 this.updateTargetGroups();
 if(this.time-r.last<.4||r.collected.has(id))return;
 this.targetHitAt.set(id,this.time);
 this.targetHits.add(id);
 r.collected.add(id);
  const display=this.targetDisplayById.get(r.id);
 display.hits.add(id);
 this.emit('target-hit',{id,group:r.id,count:r.collected.size});
  if(r.collected.size!==r.targets.length)return;
 r.collected.clear();
 r.last=this.time;
 display.complete=true;
 display.resetAt=this.time+.4;
 display.completions++;
  for(const event of [r,r.secondary].filter(e=>e?.action).sort((a,b)=>(b.action==='boss')-(a.action==='boss')))this.runTargetEvent(event);
  this.emit('target-group-complete',{id:r.id});
 }
 runTargetEvent(r){
  if(r.action==='objectControl')this.applyObjectEffect('group:'+r.id);
  if(r.action==='unblock'&&r.unlocked<r.blockers.length){const object=r.blockers[r.unlocked++];
 this.emit('blocker-unlocked',{id:r.id,object,count:r.unlocked,total:r.blockers.length});
 }
  if(r.action==='upgrade'){const max=r.bumpers.every(id=>this.bumperLevel(id)>=3);
 for(const id of r.bumpers)this.configuredBumpers.set(id,Math.min(3,this.bumperLevel(id)+1));
 if(max&&r.repeatExtraBall&&this.awardExtraLife('bumper-max'))for(const id of r.bumpers)this.bumperRewardAt.set(id,this.time);
 this.emit('bumper-upgraded',{level:Math.max(...r.bumpers.map(id=>this.bumperLevel(id)))});
 }
  if(r.action==='boss'){if(this.enemyActive){if(!this.disableBossTargetLife&&!this.spaceEndlessMode)this.awardExtraLife('boss-target');
 }else{this.enemyActive=true;
 this.emit('enemy-spawn-requested',{group:r.id});
 }}
  if(r.action==='blackHole'){this.activateHole(r.hole);
 this.emit('vortex-activated',{id:r.hole});
 }
  if(r.action==='attack'){
   if(r.spawnEnemyWhenIdle){if(this.enemyIntroPending)return;if(!this.enemyActive){this.enemyActive=true;this.emit('enemy-spawn-requested',{group:r.id});return;}}
   r.attackRemaining=(r.attackRemaining??r.attackCount??1)-1;if(r.attackRemaining<=0){r.attackRemaining=r.attackCount??1;this.emit('configured-attack',{kind:r.attack||'lv1',id:r.id,position:[...this.ball.p]});}
  }
 }
 sensors(previous=null,previousLayer=null){
  this.expireHoles();
  const ball=this.ball;
  if(ball.state!=='playing')return;
  const floorParts=this.socketsByLayer.get(ball.layer)||[];
  if(this.time>=ball.immunity){
   for(const socket of floorParts||[]){
    const controlled=this.controlledHoles.has(socket.id);
    if(controlled&&!this.armedHoles.has(socket.id))continue;
    const position=Array.isArray(previous)&&previousLayer===ball.layer?P.nearest(socket.center,previous,ball.p).p:ball.p;
    // Gap collection starts when the ball surface reaches the open mouth.
    const radius=socket.radius+(socket.id===this.g.gameplay?.touhouGap?.hole?this.physics.ballRadius:0);
    if(P.len(P.sub(position,socket.center))>=radius)continue;
    this.capture(socket.id,socket.center,socket.release,ball.layer,socket.release_direction,250);
    return;
   }
  }
  const outside=ball.p[1]>this.g.drain_y||ball.p[1]<(this.g.drain_top??-210)||ball.p[0]<-25||ball.p[0]>385;
  if(outside)this.drain();
 }

};
 }
const api={...layout,createGame,...view};
 if(typeof module!=='undefined')module.exports=api;
 else root.ConfiguredMechanisms=api;
})(globalThis);
