/* Layout guides and debug text; no gameplay mutations. */
(function(root){
"use strict";
function draw(o,game,ctx,circle){if(!o)return false;if(game.hiddenObjects?.has(o.id))return true;
 if(game.isBlockerDisabled?.(o.id)){ctx.save();
 ctx.globalAlpha*=.25;
 ctx.setLineDash([2,2]);
 if(o.center)circle(o.center,o.radius,null,'#83bdd0');
 else if(o.points?.length){ctx.beginPath();
 ctx.moveTo(...o.points[0]);
 for(const p of o.points.slice(1))ctx.lineTo(...p);
 ctx.strokeStyle='#83bdd0';
 ctx.lineWidth=.9;
 ctx.stroke();
 }ctx.restore();
 return true;
 }if(o.kind==='rollover-line'){ctx.save();
 const lit=game.rolloverLit?.(o.id);
 ctx.strokeStyle=lit?'#fff4a0':'#98deb8';
 ctx.lineWidth=lit?2.5:1.4;
 ctx.beginPath();
 ctx.moveTo(...o.points[0]);
 ctx.lineTo(...o.points[1]);
 ctx.stroke();
 ctx.restore();
 return true;
 }if(o.kind==='layer-circle'){ctx.save();
 ctx.setLineDash([2,2]);
 circle(o.center,o.radius,null,'#77e8d1');
 ctx.restore();
 return true;
 }const p=game.configuredPosts?.get(o.id);
 if(!p)return false;
 circle(p.center,p.radius,p.raised?'#ffd477':'#263945',p.raised?'#fff1b9':'#667986');
 ctx.save();
 ctx.fillStyle='#fff';
 ctx.font='4px sans-serif';
 ctx.textAlign='center';
 if(!p.raised)ctx.fillText(p.collected.size+'/'+p.sensors.length,p.center[0],p.center[1]+1.5);
 ctx.restore();
 return true;
 }
function drawPostCount(post,ctx,color){
  ctx.save();
  ctx.globalAlpha=1;ctx.setLineDash([]);
  ctx.font='bold '+Math.max(7,Math.min(12,post.radius*1.3))+'px sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=1.5;ctx.strokeStyle=color==='#000'?'#fff5bb':'#21180e';ctx.fillStyle=color;
  ctx.strokeText(String(post.left),...post.center);
  ctx.fillText(String(post.left),...post.center);
  ctx.restore();
}
function drawPostCounts(game,ctx,plane,color='#fff5bb'){
 for(const post of game.configuredPosts?.values()||[]){
  if(!post.raised||(post.layer==='tavern'?'upper':post.layer)!==plane)continue;
  drawPostCount(post,ctx,color);
 }
}
function preparePostCounts(game,scale,color='#fff5bb'){
 if(!game.configuredPosts?.size)return;
 const canvas=document.createElement('canvas');
 canvas.width=Math.ceil(128*scale);canvas.height=Math.ceil(32*scale);
 try{
  const ctx=canvas.getContext('2d');ctx.setTransform(scale,0,0,scale,0,0);
  for(const post of game.configuredPosts.values())drawPostCount({radius:post.radius,center:[64,16],left:'0123456789'},ctx,color);
 }finally{canvas.width=canvas.height=0;}
}
function status(game){const items=[...(game.configuredPosts?.values()||[])].map(p=>'Center post '+p.id+'：'+(p.raised?'剩 '+p.left+' 次':p.collected.size+'/'+p.sensors.length));
 if(game.gapLock){const gap=game.gapLock;items.push('隙間 '+(gap.active?'多球中':gap.count+'/3 · '+(gap.armed?'開啟':gap.routePending?'首趟進行中':gap.passes?'首趟完成，待再次進入':'待首趟完成')));}
 return items.join(' · ');
 }
function groupStatus(game){return [...[...(game.attackRemaining||[])].filter(([id])=>game.g.mechanisms.attacks[id]&&game.g.mechanisms.attacks[id]!=='none'||game.rolloverGroups?.some(g=>g.id===id&&g.attack!=='none')).map(([id,n])=>id+' 攻擊倒數 '+n),...(game.configuredGroups||[]).map(g=>g.id+' '+(g.action==='unblock'?'解除阻擋 '+g.unlocked+'/'+g.blockers.length+' · Target '+g.collected.size+'/'+g.targets.length:g.collected.size+'/'+g.targets.length)),...(game.rolloverGroups||[]).map(g=>g.id+' '+g.collected.size+'/'+g.members.length)].join(' · ');
 }

const api={draw,drawPostCounts,preparePostCounts,status,groupStatus};
 if(typeof module!=='undefined')module.exports=api;
 else root.MechanismView=api;
})(globalThis);
