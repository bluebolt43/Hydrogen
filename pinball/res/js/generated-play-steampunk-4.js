/* Theater iframe bridge. */
(function(root){
'use strict';
class LayoutTheater{
 constructor(){
  this.pending=[];this.activeCommands=new Map();this.ready=false;this.curtainClosing=true;this.paused=null;this.generation=0;
  this.frame=document.createElement('iframe');this.frame.title='海盜劇場';
  this.frame.style.cssText='position:fixed;border:0;pointer-events:none;z-index:2;visibility:hidden';
  document.body.append(this.frame);
  addEventListener('message',e=>{
   if(e.source!==this.frame.contentWindow||e.data?.channel!=='pinball-theater')return;
   if(e.data.type==='tutorial-bounds'){this.tutorialBounds=e.data.bounds;this.onTutorialBounds?.();return;}
   if(e.data.type==='sound'){this.soundBank?.play(e.data.name);return;}
   if(e.data.type==='warning'){this.showWarning(e.data.token);return;}
   if(e.data.type==='ready'){this.ready=true;this.curtainClosing=false;this.send({command:'pause',paused:!!this.game?.paused});for(const message of this.pending)this.send(message);this.pending=[];}
   if(['complete','error'].includes(e.data.type)&&e.data.id===this.generation+':reset:0')this.curtainClosing=false;
   if(e.data.type==='complete'&&e.data.id?.startsWith(this.generation+':')&&e.data.defeated&&this.game){
    this.game.enemyActive=false;
    if(this.bossStage&&!this.bossDefeated){
     const maxHp=e.data.maxHp;
     if(!Number.isFinite(maxHp)||maxHp<=0)return;
     this.bossDefeated=true;
     this.game.scoreHit('boss-clear:'+this.bossStage,maxHp*1500,0);
     this.game.paused=true;this.soundBank?.stop();
     window.dispatchEvent(new CustomEvent('pinball:boss-defeated',{detail:{stage:this.bossStage}}));
    }
   }
   if(['complete','error'].includes(e.data.type)&&e.data.id?.startsWith(this.generation+':enemy:')&&this.game){this.game.enemyIntroPending=false;this.game.freezeRemaining=0;if(e.data.type==='error')this.game.enemyActive=false;}
   if(['complete','error'].includes(e.data.type)&&this.activeCommands.has(e.data.id)){
    const remaining=this.activeCommands.get(e.data.id)-1;
    if(remaining)this.activeCommands.set(e.data.id,remaining);else this.activeCommands.delete(e.data.id);
    if(this.game)this.game.theaterFrozen=this.activeCommands.size>0;
    if(!remaining)this.onCommandComplete?.(e.data);
   }
   if(e.data.type==='error')console.error('Theater:',e.data.message);
  });
  this.reset();
 }
 showWarning(token){
  this.warning?.cancel();
  const generation=this.generation,warning=root.PirateMap.showWarning(document);this.warning=warning;
  if(this.game?.paused)warning.pause();
  warning.finished.then(()=>{if(generation!==this.generation||this.warning!==warning)return;this.warning=null;this.send({command:'warning-complete',token});});
 }
 send(message){this.frame.contentWindow.postMessage({channel:'pinball-theater',...message},'*');}
 reset(){this.bossDefeated=false;this.warning?.cancel();this.warning=null;this.generation++;this.pending=[];this.activeCommands.clear();if(this.game)this.game.theaterFrozen=false;this.curtainClosing=true;if(this.ready)this.send({command:'reset',id:this.generation+':reset:0'});else this.frame.src='pirate_enemy_theater.html?embed=1&session='+this.generation;}
 onEvent(e){
  if(e.type==='new-game'||(e.type==='ready'&&!this.bossStage)){this.reset();return;}
  // A replacement ball keeps the stage Boss and its HP.
  if(e.type==='ready'&&this.bossStage){if(this.game)this.game.enemyActive=!this.bossDefeated;return;}
  const attack=e.type==='configured-attack';
  const command=e.type==='enemy-spawn-requested'?'enemy':attack?{lv1:'ball',lv2:'barrel',lv3:'airdrop',lv4:'kraken'}[e.kind]:null;
  if(!command||attack&&!this.game?.enemyActive)return;
  if(command==='enemy'&&this.game)this.game.enemyIntroPending=true;
  const message={command,skipWarning:!!this.tutorialPreview,mode:this.bossStage?'boss':this.game?.g?.gameplay?.mode||'free',stage:this.bossStage||0,id:this.generation+':'+command+':'+(attack?(this.attackSerial=(this.attackSerial||0)+1):(e.eventId||0))};
  this.activeCommands.set(message.id,(this.activeCommands.get(message.id)||0)+1);
  if(this.game)this.game.theaterFrozen=true;
  if(this.ready)this.send(message);else this.pending.push(message);
 }
 update(dt,game){this.game=game;game.theaterFrozen=this.activeCommands.size>0;if(this.paused!==game.paused){this.paused=game.paused;if(this.warning)this.warning[game.paused?'pause':'play']();if(this.ready)this.send({command:'pause',paused:game.paused});}}
 drawAttackMessage(ctx,x,y,width,height,time){
  ctx.save();ctx.beginPath();ctx.rect(x,y,width,height);ctx.clip();
  ctx.font='bold 15px monospace';ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillStyle='#ffe6a3';
  const text='DEFEAT BOSS',span=ctx.measureText(text).width+45,offset=(time*35)%span;
  for(let at=x-offset;at<x+width;at+=span)ctx.fillText(text,at,y+height/2);
  ctx.restore();
 }
 draw(ctx,game,top=-170.5){
  this.game=game;const scoreH=30,sceneY=top+scoreH,sceneH=-sceneY;
  const canvas=ctx.canvas,r=canvas.getBoundingClientRect(),m=ctx.getTransform(),sx=r.width/canvas.width,sy=r.height/canvas.height;
  const position={left:(r.left+m.e*sx)+'px',top:(r.top+(m.d*sceneY+m.f)*sy)+'px',width:(360*m.a*sx)+'px',height:Math.max(0,sceneH*m.d*sy)+'px',visibility:sceneH>0?'visible':'hidden'};
  for(const [key,value] of Object.entries(position))if(this.frame.style[key]!==value)this.frame.style[key]=value;
  // Reveal the theater iframe beneath the table artwork.
  ctx.clearRect(0,sceneY,360,Math.max(0,sceneH));
  if(this.customScore)return;
  ctx.save();ctx.fillStyle='#36251e';ctx.fillRect(0,top,360,scoreH);ctx.strokeStyle='#ba9456';ctx.lineWidth=1;ctx.strokeRect(1,top+1,358,scoreH-2);ctx.fillStyle='#ffe5a6';ctx.textAlign='left';ctx.font='bold 12px monospace';if(this.bossStage)this.drawAttackMessage(ctx,12,top+6,220,20,game.time);else ctx.fillText('SCORE '+String(game.score).padStart(12,'0'),12,top+20);ctx.textAlign='right';ctx.font='bold 10px monospace';ctx.fillText('BALL '+game.ballNumber+' / 3',348,top+20);ctx.restore();
 }
}
if(typeof module!=='undefined'&&module.exports)module.exports=LayoutTheater;else root.LayoutTheater=LayoutTheater;
})(typeof window!=='undefined'?window:globalThis);
