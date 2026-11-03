/* Shared ball mechanics; configured objects own gameplay rules. */
(function(root){
'use strict';
function createGame(core){
 const {CoreGame,Grid,EPS,clamp,add,sub,mul,dot,cross,len,unit,mix,nearest,inside,basicCollision}=core;
 return class TableGame extends CoreGame {
 dynamicEdges(){const p=this.g.plunger;return [...(p.enabled!==false&&this.ball.layer===(p.layer||'lower')?[{id:'plunger',kind:'plunger',faceOnly:true,a:[p.left,p.rest_y],b:[p.right,p.rest_y]}]:[]),...this.gates.filter(g=>!g.unlocked&&g.layer===this.ball.layer&&(g.closed||g.mechanic==='directional_flap')).map(g=>({a:g.points[0],b:g.points[1],id:g.id,kind:'gate',n:g.mechanic==='directional_flap'?g.n:undefined})),...(this.g.rescue_kickers||[]).filter(k=>(k.layer||'lower')===this.ball.layer).map(k=>({id:k.id,kind:'rescue-kicker',a:k.points[0],b:k.points[1],side:k.side,aim:k.aim,direction:k.direction,speed:this.physics.kickbackSpeed}))];}
 portalHit(){}
 transition(){}
 rescueState(layer='lower'){if(layer==='lower')return {available:this.kickbacks,hits:this.kickbackHits};return this.rescueLayers[layer]||(this.rescueLayers[layer]={available:{left:true,right:true},hits:{left:false,right:false}});}
 resetRescue(){
  this.kickbackAt?.clear();this.rescueLayers={};this.kickbacks={left:true,right:true};this.kickbackHits={left:false,right:false};this.rescueCompletedAt?.clear();
  for(const gate of this.gates||[])if(gate.mechanic==='rescue-return'||gate.id==='left-return'||gate.id==='right-return')Object.assign(gate,{closed:false,pending:false,pendingBall:null,unlocked:false});
 }
 edgeEnabled(e,ball=this.ball){if(e.launchOnly&&!ball.launchGuard)return false;return !(e.kind==='rescue-kicker'&&!this.rescueState(ball.layer).available[e.side]);}
 handleCollision(e){if(e.kind!=='rescue-kicker')return false;this.triggerKickback(e.side,unit(e.direction||sub(e.aim,this.ball.p)),e.speed,e.id);return true;}
 activeBoost(){return this.physics.activeBoost;}
 collisionEffect(e,approach){
  if(e.launchOnly&&approach>0)this.ball.launchGuard=false;
  if(approach>=8)this.emit('sound',{name:'metal'});
  if((e.kind==='rebound'||e.kind==='active'||e.mechanic==='active_rebound')&&approach>0&&(this.cooldowns.get(e.id)||0)<=this.time)this.reboundHitAt.set(e.id,this.time);
 }
 rulesInterrupted(){return this.theaterFrozen||this.freezeRemaining>0;}
 visualPlane(ball){return ball.layer==='tavern'?'upper':'lower';}
 mapEvent(type,data){
  if(type==='drain'&&this.balls.every(ball=>ball.state==='drained')&&!this.hasPendingBalls())this.resetRescue();
  if(['plunger-ready','gap-ball-ready'].includes(type))this.kickbackAt?.clear();
  if(type==='launch')this.ball.launchGuard=true;
  if(['capture','plunger-ready','drain'].includes(type))this.ball.launchGuard=false;
  if(type==='free-ball-launch'||type==='release'&&this.sockets.some(s=>s.id===data.id&&s.mechanic==='shark-inlet'))this.sharkFlashAt=this.time;
  if(type==='target-hit'){this.targetVisualAt??=new Map();this.targetVisualAt.set(data.id,this.time);}
  if(type==='layer'){this.layerEnteredAt??=new Map();this.layerEnteredAt.set(data.id,this.time);}
  if(type==='flipper-hit'){this.flipperHitAt??=new Map();this.flipperHitAt.set(data.id,this.time);}
  if(type==='flag-hit'){this.flagHitAt??=new Map();this.flagHitAt.set(data.id,this.time);}
  if(type==='capture'){this.holeCapturedAt.set(data.id,this.time);this.holeCaptureCounts.set(data.id,(this.holeCaptureCounts.get(data.id)||0)+1);}
  if(type==='release'){this.holeReleasedAt??=new Map();this.holeReleasedAt.set(data.id,this.time);}
 }
 onCapture(){}
 beforeStep(dt){if(this.theaterFrozen||this.enemyIntroPending)return false;if(this.freezeRemaining>0){this.freezeRemaining=Math.max(0,this.freezeRemaining-dt);if(!this.freezeRemaining)this.emit('enemy-freeze-ended');return false;}return true;}
 tickRules(){this.updateTargetGroups();}
 afterBallStep(previous,layer,dt){this.sensors(dt);}
 afterSubstep(){this.spawnFreeBall();}
 resetMapBall(){this.resetRescue();this.centerPostRaised=false;this.centerPostHitsLeft=0;this.centerPostHitAt=-Infinity;this.centerPostHitUntil=0;this.freeBallQueue=0;this.freeBallRewardPositions=[];this.freeBallSources=[];this.multiballAwards=0;}
 build(){
  const g=this.g;this.launchGateExitY=Math.max(-Infinity,...[...g.lower,...g.upper_parts].filter(o=>o.collisionMode==='launch-only').flatMap(o=>(o.points||[]).map(p=>p[1])));this.reboundIds=new Set([...g.lower,...g.upper_parts].filter(o=>o.kind==='rebound'||o.kind==='active'||o.mechanic==='active_rebound').map(o=>o.id));this.flippers=g.lower.filter(o=>o.kind==='flipper').map(o=>({...o,angle:Math.atan2(o.tip[1]-o.pivot[1],o.tip[0]-o.pivot[0]),rest:Math.atan2(o.tip[1]-o.pivot[1],o.tip[0]-o.pivot[0]),up:Math.atan2(o.raised[1]-o.pivot[1],o.raised[0]-o.pivot[0]),length:len(sub(o.tip,o.pivot)),omega:0}));
  // Unwrap flipper angles across ±pi before interpolation.
  for(const f of this.flippers){const delta=f.up-f.rest;f.up=f.rest+Math.atan2(Math.sin(delta),Math.cos(delta));}
  const objectsToEdges=objects=>{const edges=[];for(const o of objects){
   if(!['wall','rail','active','rebound','bumper','test-post','target'].includes(o.kind))continue;
   const material=o.material||null;
   if(o.center){edges.push({id:o.id,c:o.center,r:o.radius,kind:o.kind,material,bumperStrength:o.bumperStrength,retractUp:o.mechanic==='retract_for_upward_ball'});continue;}
   const ps=o.points||[];let slingEdge=1;if((o.slingshot||o.kind==='active'||o.kind==='rebound'||o.mechanic==='active_rebound')&&ps.length>2)for(let i=2;i<ps.length;i++)if(len(sub(ps[i],ps[i-1]))>len(sub(ps[slingEdge],ps[slingEdge-1])))slingEdge=i;for(let i=1;i<ps.length;i++)if(len(sub(ps[i],ps[i-1]))>EPS)edges.push({id:o.id,a:ps[i-1],b:ps[i],kind:o.kind,material,mechanic:o.mechanic,reboundStrength:o.reboundStrength,slingshot:o.slingshot===true,slingshotFace:i===slingEdge,n:o.pass_normal,thickness:o.thickness||0,launchOnly:o.collisionMode==='launch-only'});
  }return edges;};
  this.edges={lower:objectsToEdges(g.lower),tavern:objectsToEdges(g.upper_parts)};
  for(const [layer,es]of Object.entries(this.edges))this.grids[layer]=new Grid(es);
  this.sockets=g.lower.filter(o=>o.kind==='socket');
  this.transitions=g.editor_transitions||[];

 }
 recordTarget(){}
 bumperLevel(){return 1;}
 updateTargetGroups(){for(const group of this.targetGroups){if(!group.complete||this.time<group.resetAt)continue;for(const id of group.targets)this.targetHits.delete(id);group.hits.clear();group.complete=false;this.emit('target-group-reset',{id:group.id});}}
 resetTargets(){this.kickbackAt=new Map();this.rescueCompletedAt=new Map();this.holeCaptureCounts=new Map();this.targetVisualAt=new Map();this.layerEnteredAt=new Map();this.flipperHitAt=new Map();this.sensorHitAt=new Map();this.reboundHitAt=new Map();this.sharkFlashAt=null;this.flagHitAt=new Map();this.holeReleasedAt=new Map();this.holeCapturedAt=new Map();this.enemyIntroPending=false;this.enemyActive=false;this.bumperHitUntil=new Map();this.vortexActive=false;this.vortexActivatedAt=this.vortexActive?this.time:null;this.freezeRemaining=0;this.targetHitAt=new Map();this.targetHits=new Set();this.targetGroups=[];for(const o of [...this.g.lower,...this.g.upper_parts]){if(!o.target_group)continue;let group=this.targetGroups.find(g=>g.id===o.target_group);if(!group){group={id:o.target_group,targets:[],hits:new Set(),complete:false,completions:0,resetAt:0};this.targetGroups.push(group);}group.targets.push(o.id);}}
 syncRegion(){}
 field(){
  const b=this.ball,g=this.physics,zoneGravity=this.gravityAt(b.p,b.layer);let a=zoneGravity||[0,g.gravity],drag=g.drag;
  b.z=b.layer==='top'?g.rampHeight*2:b.layer==='tavern'?g.rampHeight:0;
  if(!zoneGravity&&g.physicsModel==='legacy')a[0]+=(.5-this.random())*len(b.v)*g.drag;
  for(const well of [...this.g.lower,...this.g.upper_parts,...(this.g.top_parts||[])].filter(o=>o.kind==='field'&&o.mechanic==='gravity-well'&&o.layer===b.layer&&(o.owner?this.armedHoles?.has(o.owner):this.vortexActive))){
   const delta=sub(well.center,b.p),distance=len(delta);
   if(distance>well.radius||this.balls.some(other=>well.owner&&other.state==='captured'&&other.held?.id===well.owner))continue;
   // TKickout::FieldEffect adds its pull and velocity damping to the table field.
   if(distance>EPS)a=add(a,mul(delta,g.wellPull/distance));drag+=g.wellDrag;
  }
  return {a,drag};
 }
 sensors(){}
 triggerKickback(side,direction,speed=this.physics.kickbackSpeed,kickerId=null){
  const layer=this.ball.layer,state=this.rescueState(layer);
  if(!state.available[side])return;
  const triggerPosition=[...this.ball.p];
  {
   const kicker=this.g.rescue_kickers?.find(k=>k.side===side&&(k.layer||'lower')===layer&&(!kickerId||k.id===kickerId)),point=kicker?.launch_point||kicker?.aim;
   if(point){
    const rescueStart=[...this.ball.p];
    this.ball.p=[...point];this.ball.relocatedFrom=[...point];this.ball.regionPrevious=null;this.ball.trail=[];
    for(const gate of this.gates)if(gate.pendingBall===this.ball){gate.pending=false;gate.pendingBall=null;}
    // Close the gate after clearance, including relocated balls.
    const returnGate=this.gates.find(g=>g.side===side&&g.layer===layer&&!g.closed);
    if(returnGate){returnGate.unlocked=false;returnGate.pending=true;returnGate.pendingBall=this.ball;}
    // Apply return-flap crossing before discarding the pre-relocation position.
    this.updateGates(rescueStart,this.ball.layer);
   }
   direction=[0,-1];
  }
  direction=[0,-1];
  state.available[side]=false;if(this.config.physicsModel!=='legacy')delete this.ball.speedLimit;else this.ball.speedLimit=this.config.maxSpeed;const rebound=this.config.physicsModel!=='legacy'?mul(direction,speed):basicCollision(this.ball.v,direction,.2,.7,0,speed);
  // Both rescue launchers fire vertically, regardless of the layout aim.
  this.ball.v=[0,-len(rebound)];this.limitSpeed();
  const eventId=kickerId||this.g.rescue_kickers?.find(k=>k.side===side&&(k.layer||'lower')===layer)?.id;if(eventId)this.kickbackAt.set(eventId,this.time);
  this.emit('kickback',{side,layer,speed:len(this.ball.v)});state.hits[side]=true;this.emit('kickback-lane',{side,layer});
  if(state.hits.left&&state.hits.right)this.awardMultiball(triggerPosition,layer,'plunger');
 }
 awardExtraLife(source,position=this.ball.p){const reserve=4-this.ballNumber-(this.lifeLaunched?1:0)+(this.extraLives||0);if(this.gameOver||reserve>=99)return false;this.extraLives=(this.extraLives||0)+1;this.emit('extra-life-awarded',{source,remaining:reserve+1,position:[...position]});return true;}
 awardMultiball(position=this.ball.p,layer=this.ball.layer,source=this.g.gameplay?.multiballHole){const state=this.rescueState(layer);if(state.hits.left&&state.hits.right)this.rescueCompletedAt.set(layer,this.time);Object.assign(state.available,{left:true,right:true});Object.assign(state.hits,{left:false,right:false});
  for(const gate of this.gates)if(gate.layer===layer&&(gate.mechanic==='rescue-return'||gate.id==='left-return'||gate.id==='right-return')){gate.closed=false;gate.pending=false;gate.pendingBall=null;gate.unlocked=true;}
  if(this.balls.filter(b=>b.state!=='drained').length+this.freeBallQueue>=3){this.awardExtraLife('multiball',position);return;}
  this.freeBallRewardPositions.push([...position]);this.freeBallSources.push(source);this.freeBallQueue++;this.multiballAwards++;this.emit('multiball-awarded',{count:this.multiballAwards});
 }
 spawnFreeBall(){if(!this.freeBallQueue)return;if(this.balls.filter(b=>b.state!=='drained').length>=3){this.freeBallQueue--;this.freeBallSources.shift();this.awardExtraLife('multiball',this.freeBallRewardPositions.shift()||this.ball.p);return;}const p=[this.g.plunger.x,this.g.plunger.rest_y-this.physics.ballRadius-18];
  const layer=this.launchLayer();
  if(this.balls.some(b=>b.state!=='drained'&&b.layer===layer&&len(sub(b.p,p))<this.physics.ballRadius*2+3))return;
  const gate=this.gates.find(g=>g.id==='shooter-return');if(gate){gate.closed=false;gate.pending=false;}
  this.balls.push({p,v:[0,-(this.config.physicsModel!=='legacy'?this.g.plunger.launch_max:this.config.maxSpeed)],layer,z:this.launchHeight(),state:'playing',immunity:0,lastPortal:-10,trail:[],free:true,launchGuard:true});
  this.freeBallQueue--;this.freeBallSources.shift();this.freeBallRewardPositions.shift();this.plungerReleasedAt=this.time;this.plungerReleaseCharge=1;this.emit('free-ball-launch');
 }

 };
}
const api={createGame};if(typeof module!=='undefined')module.exports=api;else root.TableMechanics=api;
})(globalThis);
