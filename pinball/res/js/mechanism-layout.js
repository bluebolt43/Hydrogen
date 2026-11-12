/* Compile and validate object-owned rules from editor layouts. */
(function(root){
"use strict";
const floor=o=>o.layer==='upper'?'tavern':o.layer||'lower',parts=g=>[...g.lower,...g.upper_parts,...(g.top_parts||[])];
function prepare(layout,g){
 g.top_parts??=[];
 g.drain_y=(layout.screenLayout?.bottom??469.5)+20;
 const objects=layout.objects,posts=objects.filter(o=>o.type==='centerPost');
 // Transitions come only from editor objects.
 for(const key of ['right_upper_region','right_upper_ramp','upper_feeder_floor','upper_route_floor'])delete g[key];
 g.deck_exit=null;
 g.extra_transitions=[];
 g.top_transitions=[];
 for(const part of parts(g))if(part.collision_layer==='right_upper')delete part.collision_layer;

 for(const t of [...(g.guided_tracks||[]),...(g.visual_tracks||[])]){const o=objects.find(o=>o.id===t.id);
 t.layer=floor(o);
 t.showAboveArt=o.showAboveArt===true;
 }
 {
  const layerNames={lower:'lower',upper:'tavern',top:'top'};
  g.circle_entries=objects.filter(o=>o.type==='circle'&&o.mechanic==='layer-transition').map(o=>{
   if(!layerNames[o.fromLayer]||!layerNames[o.toLayer]||o.fromLayer===o.toLayer||!Number.isFinite(o.r)||o.r<.5)throw Error('跨層入口圓設定不合法：'+o.id);
   if(o.stopOnEntry!==undefined&&typeof o.stopOnEntry!=='boolean')throw Error('跨層停球設定不合法：'+o.id);
   if(o.initialSpeed!==undefined&&(!Number.isFinite(o.initialSpeed)||o.initialSpeed<0))throw Error('跨層圓初速不合法：'+o.id);
   return {id:o.id,stopOnEntry:o.stopOnEntry,initialSpeed:o.initialSpeed,center:[o.cx,o.cy],radius:o.r,from:layerNames[o.fromLayer],to:layerNames[o.toLayer],bidirectional:o.bidirectional};
  });
  for(const e of g.circle_entries)g[e.from==='lower'?'lower':e.from==='top'?'top_parts':'upper_parts'].push({...e,kind:'layer-circle',collision:false});
  for(const o of objects.filter(o=>o.type==='targets'&&o.spacing!==undefined)){
   if(!Number.isFinite(o.spacing)||o.spacing<13||o.spacing>100)throw Error('Target 間距不合法');
   const a=o.angle*Math.PI/180;
 for(let i=1;i<=3;i++){const t=parts(g).find(t=>t.id===o.id+'-'+i),delta=(i-2)*(o.spacing-15);
 if(t)t.points=t.points.map(p=>[p[0]+Math.cos(a)*delta,p[1]+Math.sin(a)*delta]);
 }
  }
 }
 for(const o of objects.filter(o=>o.type==='rollover')){const part=parts(g).find(p=>p.id===o.id);
 if(part)part.kind='rollover-line';
 }
 const holeMulti=layout.gameplay?.holeMultiball;
 if(layout.gameplay?.multiballHole!==undefined&&!objects.some(o=>o.id===layout.gameplay.multiballHole&&o.type==='hole'))throw Error('Multiball 出球需要有效洞口');
 if(holeMulti&&(!objects.some(o=>o.id===holeMulti.hole&&o.type==='hole')||!Number.isInteger(holeMulti.hits)||holeMulti.hits<1||holeMulti.hits>99))throw Error('Multiball 需要有效洞口及 1～99 次進洞');
 if(holeMulti?.balls!==undefined&&(!Number.isInteger(holeMulti.balls)||holeMulti.balls<2||holeMulti.balls>3))throw Error('Multiball 球數需要為 2～3');
 const gap=layout.gameplay?.touhouGap;
 if(gap){
  const sensor=objects.find(o=>o.id===gap.sensor&&o.type==='sensor'),hole=objects.find(o=>o.id===gap.hole&&o.type==='hole');
  if(!sensor||!hole||floor(sensor)!==floor(hole)||!hole.exitHole||!objects.some(o=>o.id===hole.exitHole&&o.type==='hole'))throw Error('隙間需要同層偵測線、收球洞與有效出口洞');
  if(!Number.isInteger(gap.passes??2)||(gap.passes??2)<1)throw Error('隙間偵測次數設定不合法');
  if((gap.passes??2)>1&&!objects.some(o=>o.id===gap.routeExit&&o.mechanic==='layer-transition'&&o.fromLayer===sensor.layer&&o.toLayer!==sensor.layer))throw Error('隙間需要指定完成軌道的出口線');
  if(gap.locks!==3)throw Error('隙間需要累積三次收球');
  if(gap.readySeconds!==undefined&&(!Number.isFinite(gap.readySeconds)||gap.readySeconds<0))throw Error('隙間準備時間不合法');
  if(gap.captureSeconds!==undefined&&(!Number.isFinite(gap.captureSeconds)||gap.captureSeconds<=0))throw Error('隙間收球時間必須大於零');
 }
 const runic=layout.gameplay?.runicTurntable;
 const bagua=layout.gameplay?.touhouBagua||runic;
 if(runic){
  const art=a=>a?.src&&Array.isArray(a.uv)&&a.uv.length===4&&a.uv.every(Number.isFinite)&&a.uv[0]>=0&&a.uv[1]>=0&&a.uv[2]>0&&a.uv[3]>0&&a.uv[0]+a.uv[2]<=1.000001&&a.uv[1]+a.uv[3]<=1.000001;
  if(!['background','lower','upper','top'].includes(runic.displayPlane)||!['lower','upper','top'].includes(runic.countLayer)||runic.trigger!=='circle-entry'||!art(runic.ringArt)||!art(runic.rotorArt)||!runic.rewards?.every(r=>art(r.art)))throw Error('盧恩石盤需要通過計數與有效石刻圖片');
 }
 if(bagua){
  if(bagua.entryCooldown!==undefined&&(!Number.isFinite(bagua.entryCooldown)||bagua.entryCooldown<0))throw Error('八卦進入冷卻時間不合法');
  const marker=objects.find(o=>o.id===bagua.object&&o.type===(runic?'circle':'blockhole'));
  if(!marker||!Number.isInteger(bagua.threshold)||bagua.threshold<1||bagua.threshold>99||!Number.isFinite(bagua.radius)||bagua.radius<=0||!(bagua.spinSeconds>0)||!(bagua.winFlashSeconds>0)||!Array.isArray(bagua.rewards)||bagua.rewards.length!==8||bagua.rewards.every(r=>r.kind==='enemy'))throw Error('八卦需要位置物件、累積門檻與八個獎項');
  for(const r of bagua.rewards)if(!['score','multiplier','ball','multi','enemy'].includes(r.kind)||!Number.isInteger(r.value)||(r.kind==='enemy'?r.value!==0:r.value<=0)||!r.art?.src)throw Error('八卦獎項設定不合法');
  const fixed=bagua.rewards.filter(r=>r.probability!==undefined);
  if(fixed.length&&(fixed.some(r=>!Number.isFinite(r.probability)||r.probability<0||r.probability>1)||fixed.reduce((sum,r)=>sum+r.probability,0)>=1||!bagua.rewards.some(r=>r.probability===undefined&&!['enemy','multi'].includes(r.kind))))throw Error('八卦／盧恩石盤固定機率設定不合法');
  for(const key of ['lower','upper_parts','top_parts'])g[key]=g[key].filter(p=>p.id!==bagua.object);
 }
 // Compile object-owned rules.
 for(const part of parts(g))if(part.kind==='target')delete part.target_group;
 delete g.gameplay.target_rules;
 delete g.gameplay.hole_attacks;
 const objectEffects=objects.filter(o=>o.objectEffect).map(o=>{const effect=o.objectEffect,target=parts(g).find(p=>p.id===effect.object);if(!['target','targets','hole','blockhole','sensor'].includes(o.type)||!['hide','restore','toggle','rotate90'].includes(effect.action)||!target||!['wall','rail','bumper','rebound','active'].includes(target.kind)||target.mechanic==='guided-rail'||o.id===effect.object)throw Error('控制物件設定不合法：'+o.id);return {source:o.id,...effect};});
 g.objectEffects=objectEffects;
 const groups=objects.filter(o=>o.targetGroup).map(o=>JSON.parse(JSON.stringify(o.targetGroup))),used=new Set();
 for(const r of groups){
  const bank=Array.isArray(r.members)&&r.members.length===1&&objects.some(o=>o.id===r.members[0]&&o.type==='targets');
  if(!Array.isArray(r.members)||(!bank&&(![1,2,3].includes(r.members.length)||new Set(r.members).size!==r.members.length))||r.members.some(id=>!objects.some(o=>o.id===id&&(bank?o.type==='targets':o.type==='target'))||used.has(id)))throw Error('Target 群組需要一至三顆不重複的單個 target');
  r.members.forEach(id=>used.add(id));
  if(!r.action&&!r.secondary?.action)throw Error('請設定 Target 群組事件');
  if(r.secondary)r.secondary.id=r.id+':secondary';
  for(const event of [r,r.secondary]){if(!event?.action)continue;const r=event;
  if(!['upgrade','boss','blackHole','unblock','objectControl','attack'].includes(r.action))throw Error('請設定 Target 群組事件');
  if(r.action==='objectControl'){const target=parts(g).find(p=>p.id===r.object);if(!target||!['wall','rail','bumper','rebound','active'].includes(target.kind)||!['hide','restore','toggle','rotate90'].includes(r.effect||'hide'))throw Error('Target 群組控制物件設定不合法：'+r.id);g.objectEffects.push({source:'group:'+r.id,object:r.object,action:r.effect||'hide'});}
  if(r.action==='upgrade'&&(!Array.isArray(r.bumpers)||r.bumpers.length<1||new Set(r.bumpers).size!==r.bumpers.length||r.bumpers.some(id=>!parts(g).some(o=>o.id===id&&o.kind==='bumper'))))throw Error('升級事件需指定至少一個不重複的 Bumper');
  if(r.action==='blackHole'&&!objects.some(o=>o.id===r.hole&&['hole','blockhole'].includes(o.type)))throw Error('請指定黑洞');
  if(r.action==='unblock'){
   if(!Array.isArray(r.blockers)||r.blockers.length!==2||new Set(r.blockers).size!==2||r.blockers.some(id=>!parts(g).some(p=>p.id===id&&['wall','rail','active','rebound','bumper'].includes(p.kind))))throw Error('依序解除阻擋需指定兩個不同的碰撞物件：'+r.id);
   if(!Array.isArray(r.resetSensors)||!r.resetSensors.length||new Set(r.resetSensors).size!==r.resetSensors.length||r.resetSensors.some(id=>!objects.some(o=>o.id===id&&['sensor','rollover'].includes(o.type))))throw Error('請指定重置用的偵測線或 Rollover：'+r.id);
  }
  if(r.action==='attack'&&(!['lv1','lv2','lv3','lv4'].includes(r.attack||'lv1')||!Number.isInteger(r.attackCount??1)||(r.attackCount??1)<1||(r.attackCount??1)>99))throw Error('Target 攻擊設定不合法：'+r.id);
  if(r.spawnEnemyWhenIdle!==undefined&&typeof r.spawnEnemyWhenIdle!=='boolean')throw Error('Target 無敵人時登場設定不合法：'+r.id);
  }
  r.targets=r.members.flatMap(id=>parts(g).filter(o=>o.kind==='target'&&(o.id===id||o.id.startsWith(id+'-'))).map(o=>o.id));
  if(r.targets.length!==(bank?3:r.members.length))throw Error('Target 群組編譯後數量不符');
  for(const part of parts(g))if(r.targets.includes(part.id))part.target_group=r.id;
 }
 // Unassigned targets keep hit/reset feedback.
 for(const o of objects.filter(o=>['target','targets'].includes(o.type)&&!used.has(o.id))){
  const targets=parts(g).filter(p=>p.kind==='target'&&(p.id===o.id||p.id.startsWith(o.id+'-'))).map(p=>p.id);
  if(!targets.length)continue;
  const rule={id:'passive-'+o.id,members:[o.id],targets,action:'none'};
 groups.push(rule);
  for(const p of parts(g))if(targets.includes(p.id))p.target_group=rule.id;
 }
 // Compile black holes as controlled sockets.
 for(const r of groups.filter(r=>r.action==='blackHole'))for(const list of [g.lower,g.upper_parts,g.top_parts||[]]){
  const hole=list.find(o=>o.id===r.hole);
 if(hole?.kind==='field')Object.assign(hole,{kind:'socket',release:[...hole.center],release_direction:[0,-1]});
 }
 for(const o of objects.filter(o=>['hole','blockhole'].includes(o.type))){
  if(o.releaseMode!==undefined&&!['fixed','cadet'].includes(o.releaseMode)||o.releaseMode==='fixed'&&!Number.isFinite(o.releaseAngle))throw Error('Hole 彈射設定不合法：'+o.id);
  const socket=parts(g).find(p=>p.id===o.id&&p.kind==='socket');
 if(!socket)continue;
  if(o.ballSpeed!==undefined&&(!Number.isFinite(o.ballSpeed)||o.ballSpeed<0))throw Error('洞球速不合法：'+o.id);
  socket.ballSpeed=o.ballSpeed;
  socket.layer=floor(o);
  socket.release_mode=o.releaseMode||(o.release_direction?'fixed':'cadet');
  if(o.releaseMode==='fixed'){const a=o.releaseAngle*Math.PI/180;
 socket.release_direction=[Math.cos(a),Math.sin(a)];
 socket.release=socket.mechanic==='vortex-center'?[...socket.center]:o.release_point||socket.center.map((v,i)=>v+14*socket.release_direction[i]);
 }
 }
 for(const o of objects.filter(o=>['hole','blockhole'].includes(o.type)&&o.exitHole)){
  const entrance=parts(g).find(p=>p.id===o.id&&p.kind==='socket'),exit=parts(g).find(p=>p.id===o.exitHole&&p.kind==='socket');
  if(!entrance||!exit||o.id===o.exitHole)throw Error('出口洞設定不合法：'+o.id);
  entrance.exit_hole=o.exitHole;
 }
 for(const o of objects.filter(o=>['hole','blockhole'].includes(o.type)&&o.attractionRadius!==undefined&&o.id!==bagua?.object)){
  if(!Number.isFinite(o.attractionRadius)||o.attractionRadius<0)throw Error('吸引範圍不合法：'+o.id);
  if(o.attractionRadius>0)g[o.layer==='top'?'top_parts':o.layer==='upper'?'upper_parts':'lower'].push({id:o.id+':attraction',kind:'field',mechanic:'gravity-well',owner:o.id,center:[o.x,o.y],radius:o.attractionRadius,layer:floor(o),collision:false});
 }
 const configs=posts.map(o=>{
  const sensors=o.triggerRollovers??[],hits=o.hitCount??3;
  if(!Array.isArray(sensors)||new Set(sensors).size!==sensors.length||sensors.some(id=>!objects.some(o=>o.id===id&&o.type==='rollover')))throw Error('Center post Rollover 線不存在或重複：'+o.id);
  if(!Number.isInteger(hits)||hits<1||hits>99)throw Error('Center post 碰撞次數需為 1～99');
  const radius=o.radius??5;if(!Number.isFinite(radius)||radius<.5||radius>100)throw Error('Center post 半徑需為 0.5～100：'+o.id);
  const part={id:o.id,kind:'wall',mechanic:'center-post',center:[o.x,o.y],radius};
  for(const key of ['lower','upper_parts','top_parts'])g[key]=(g[key]||[]).filter(p=>p.id!==o.id&&p.id!=='test-post-center');
  g[o.layer==='top'?'top_parts':o.layer==='upper'?'upper_parts':'lower'].push(part);
  return {...part,layer:floor(o),sensors,hits};
 });
 const attacks={};
 for(const o of objects)if(o.attack!==undefined){if(!['hole','blockhole','rollover','sensor','target'].includes(o.type)||!['none','lv1','lv2','lv3','lv4'].includes(o.attack))throw Error('攻擊設定不合法：'+o.id);
 attacks[o.id]=o.attack;
 }
 const rolloverGroups=objects.filter(o=>o.rolloverGroup).map(o=>JSON.parse(JSON.stringify(o.rolloverGroup))),rolloverMembers=new Set();
 for(const r of rolloverGroups){if(!Array.isArray(r.members)||r.members.length<2||new Set(r.members).size!==r.members.length||r.members.some(id=>rolloverMembers.has(id)||!objects.some(o=>o.id===id&&o.type==='rollover'))||!['none','lv1','lv2','lv3','lv4'].includes(r.attack))throw Error('Rollover 群組設定不合法：'+r.id);
 r.members.forEach(id=>rolloverMembers.add(id));
 }
 const attackCounts={};
 for(const o of objects.filter(o=>['rollover','sensor','target'].includes(o.type)))attackCounts[o.id]=o.attackCount??1;
 for(const r of rolloverGroups)attackCounts[r.id]=r.attackCount??1;
 for(const [id,count] of Object.entries(attackCounts))if(!Number.isInteger(count)||count<1||count>99)throw Error('攻擊倒數需為 1～99：'+id);
 const targetAttackSources={};for(const o of objects.filter(o=>o.type==='target'&&o.attack&&o.attack!=='none'))for(const p of parts(g).filter(p=>p.kind==='target'&&(p.id===o.id||p.id.startsWith(o.id+'-'))))targetAttackSources[p.id]=o.id;
 for(const object of objects.filter(o=>o.captureBonus!==undefined)){
  const socket=parts(g).find(p=>p.id===object.id&&p.kind==='socket');
  if(!['hole','blockhole'].includes(object.type)||!Number.isSafeInteger(object.captureBonus)||object.captureBonus<0)throw Error('入洞加分設定不合法：'+object.id);
  if(socket)socket.captureBonus=object.captureBonus;
 }
 g.mechanisms={posts:configs,groups,attacks,rolloverGroups,attackCounts,targetAttackSources};
 return g;
}
function compile(layout,base,compiler){const copy=JSON.parse(JSON.stringify(layout));
 copy.objects=copy.objects.filter(o=>o.type!=='centerPost'&&!(o.type==='circle'&&o.mechanic==='layer-transition'));
 copy.objects=copy.objects.map(o=>o.type==='rollover'?{...o,type:'sensor'}:o);
 return prepare(layout,compiler(copy,base));
 }

const api={prepare,compile};
 if(typeof module!=='undefined')module.exports=api;
 else root.MechanismLayout=api;
})(globalThis);
