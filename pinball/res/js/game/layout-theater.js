/* Shared Canvas theater command bridge. */
(function(root){
'use strict';
class LayoutTheater{
 constructor(theme='pirate'){
  this.theme=['saga','norse','ragnarok'].includes(theme)?'saga':['space','sci-fi','cosmic-dessert'].includes(theme)?'space':['touhou1','touhou-horrors'].includes(theme)?'touhou1':['touhou2','touhou-black-knight-2000'].includes(theme)?'touhou2':theme==='steampunk'?'steampunk':'pirate';
  this.pending=[];this.activeCommands=new Map();this.ready=false;this.curtainClosing=true;this.paused=null;this.generation=0;
  this.canvasBackend=this.theme==='pirate'?new root.PirateTheaterCanvas(this):new root.PlayTheaterCanvas(this);
  this.frame={style:{},getBoundingClientRect:()=>{const s=this.frame.style,left=parseFloat(s.left)||0,top=parseFloat(s.top)||0,width=parseFloat(s.width)||0,height=parseFloat(s.height)||0;return {left,top,width,height,right:left+width,bottom:top+height};},contentWindow:{postMessage:message=>this.canvasBackend.receive(message)}};this.frame.title=this.theme==='saga'?'黑曜石傳奇劇場':this.theme==='space'?'宇宙點心劇場':['touhou1','touhou2'].includes(this.theme)?'東方賽銭録劇場':this.theme==='steampunk'?'蒸氣龐克劇場':'海盜劇場';
  this.frame.style.cssText='position:fixed;border:0;pointer-events:none;z-index:2;visibility:hidden';
  this.receive=e=>{
   if(e.source!==this.frame.contentWindow||e.data?.channel!=='pinball-theater')return;
   if(['complete','error'].includes(e.data.type)&&e.data.id&&!e.data.id.startsWith(this.generation+':'))return;
   if(e.data.type==='boss-stage'&&['touhou1','touhou2'].includes(this.theme)&&Number.isInteger(e.data.stage)&&e.data.stage>=0&&e.data.stage<=8){if(e.data.defeated)this.onBossDefeated?.();else this.onBossChanged?.(e.data.stage);return;}
   if(e.data.type==='boss-origin'&&['touhou1','touhou2'].includes(this.theme)){this.onBossOrigin?.(e.data.stage,e.data.origin);return;}
   if(e.data.type==='boss-warning'&&['touhou1','touhou2'].includes(this.theme)&&Number.isInteger(e.data.stage)&&e.data.stage>=1&&e.data.stage<=8){this.onBossWarning?.(e.data.stage);return;}
   if(e.data.type==='complete'&&(this.activeCommands.has(e.data.id)||e.data.id===this.generation+':reset:0'))this.hudState=e.data;
   if(e.data.type==='tutorial-bounds'){this.tutorialBounds=e.data.bounds;this.onTutorialBounds?.();return;}
   if(e.data.type==='sound'){this.soundBank?.play(e.data.name);this.onSound?.(e.data.name);return;}
   if(e.data.type==='ready'){this.ready=true;this.curtainClosing=false;this.send({command:'pause',paused:!!this.game?.paused});this.flushPending();}
   if(['complete','error'].includes(e.data.type)&&e.data.id===this.generation+':reset:0')this.curtainClosing=false;
   if(e.data.type==='complete'&&this.activeCommands.has(e.data.id)&&e.data.defeated){
    const stageCleared=!!this.bossStage&&!this.bossDefeated&&Number.isFinite(e.data.maxHp)&&e.data.maxHp>0;
    if(stageCleared)this.bossDefeated=true;
    this.onEnemyDefeated?.(e.data,stageCleared);
   }
   if(['complete','error'].includes(e.data.type)&&this.activeCommands.has(e.data.id)&&e.data.id.startsWith(this.generation+':enemy:'))this.onEnemyReady?.(e.data);
   if(['complete','error'].includes(e.data.type)&&this.activeCommands.has(e.data.id)){
    const remaining=this.activeCommands.get(e.data.id)-1;
    if(remaining)this.activeCommands.set(e.data.id,remaining);else this.activeCommands.delete(e.data.id);
    this.syncGameState();
    if(!remaining)this.onCommandComplete?.(e.data);
   }
   if(e.data.type==='error')console.error('Theater:',e.data.message);
  };
  this.reset();
 }
 setPresentationReady(value){this.presentationReady=!!value;this.flushPending();}
 flushPending(){if(!this.ready||this.presentationReady===false)return;for(const message of this.pending)this.send(message);this.pending=[];}
 send(message){this.frame.contentWindow.postMessage({channel:'pinball-theater',...message},'*');}
 hasEnemyCommand(){for(const id of this.activeCommands.keys())if(id.startsWith(this.generation+':enemy:'))return true;return false;}
 blocksTable(){return this.theme==='touhou1'||this.theme==='touhou2'?this.hasEnemyCommand():this.activeCommands.size>0;}
 syncGameState(){if(this.game){this.game.theaterFrozen=this.blocksTable();this.game.enemyIntroPending=this.hasEnemyCommand();}}

 reset(){this.onBossChanged?.(0);this.hudState=null;this.bossDefeated=false;this.generation++;this.pending=[];this.activeCommands.clear();this.syncGameState();this.curtainClosing=true;if(this.ready)this.send({command:'reset',id:this.generation+':reset:0'});}
 onEvent(e){
  if(e.type==='ready'&&this.theme==='space'&&this.game?.spaceEndlessMode&&(this.game.enemyActive||this.game.enemyIntroPending))return;
  if(e.type==='new-game'||(e.type==='ready'&&!this.bossStage)){this.reset();return;}
  // A replacement ball keeps the stage Boss and its HP.
  if(e.type==='ready'&&this.bossStage)return;
  const attack=e.type==='configured-attack';
  const command=e.type==='enemy-spawn-requested'?'enemy':attack?(['steampunk','space','touhou1','touhou2','saga'].includes(this.theme)?e.kind:{lv1:'ball',lv2:'barrel',lv3:'airdrop',lv4:'kraken'}[e.kind]):null;
  if(!command||attack&&!this.game?.enemyActive)return;
  const message={command,skipWarning:!!this.tutorialPreview,mode:this.bossStage?'boss':this.game?.g?.gameplay?.mode||'free',stage:this.bossStage||0,id:this.generation+':'+command+':'+(attack?(this.attackSerial=(this.attackSerial||0)+1):(e.eventId||0))};
  this.activeCommands.set(message.id,(this.activeCommands.get(message.id)||0)+1);
  this.syncGameState();
  if(this.ready&&this.presentationReady!==false)this.send(message);else this.pending.push(message);
 }
 update(dt,game){if(this.game!==game){this.game=game;this.syncGameState();}if(this.paused!==game.paused){this.paused=game.paused;if(this.ready)this.send({command:'pause',paused:game.paused});}}
 drawAttackMessage(ctx,x,y,width,height,time){
  if(Math.floor(time)%2)return;
  ctx.save();ctx.beginPath();ctx.rect(x,y,width,height);ctx.clip();
  ctx.font='bold 15px monospace';ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillStyle='#ffe6a3';
  const text=PinballI18n.t('table.defeatBoss'),span=ctx.measureText(text).width;
  if(typeof document!=='undefined'&&ctx.drawImage&&ctx.getTransform){
   const m=ctx.getTransform(),sx=Math.hypot(m.a,m.b),sy=Math.hypot(m.c,m.d),pad=Math.ceil((2*(ctx.shadowBlur||0)+Math.abs(ctx.shadowOffsetX||0)+Math.abs(ctx.shadowOffsetY||0)+2)/Math.min(sx,sy));
   const key=JSON.stringify([text,span,height,ctx.font,sx,sy,ctx.shadowBlur,ctx.shadowColor,ctx.shadowOffsetX,ctx.shadowOffsetY]);
   if(this.attackMessageRaster?.key!==key){
    this.attackMessageRaster?.canvas.close?.();const Art=root.PinballArt;
    const canvas=Art?.rasterCanvas(Math.ceil((span+pad*2)*sx),Math.ceil((height+pad*2)*sy),true)||document.createElement('canvas');canvas.width=Math.ceil((span+pad*2)*sx);canvas.height=Math.ceil((height+pad*2)*sy);
    const c=canvas.getContext('2d');c.setTransform(sx,0,0,sy,pad*sx,pad*sy);c.font=ctx.font;c.textBaseline='middle';c.fillStyle=ctx.fillStyle;c.shadowBlur=ctx.shadowBlur;c.shadowColor=ctx.shadowColor;c.shadowOffsetX=ctx.shadowOffsetX;c.shadowOffsetY=ctx.shadowOffsetY;c.fillText(text,0,height/2);
    this.attackMessageRaster={key,canvas:Art?Art.rasterImage(canvas):canvas};
   }
   ctx.shadowColor='transparent';ctx.shadowBlur=0;
   const fit=Math.min(1,width/span);ctx.drawImage(this.attackMessageRaster.canvas,x+(width-span*fit)/2-pad*fit,y-pad,this.attackMessageRaster.canvas.width/sx*fit,this.attackMessageRaster.canvas.height/sy);
  }else{ctx.textAlign='center';ctx.fillText(text,x+width/2,y+height/2,width);}
  ctx.restore();
 }
 clearScoreShadows(){for(const entry of this.scoreShadows?.glyphs||[])root.PinballArt?.releaseRaster(entry);this.scoreShadows=null;}
 prepareScoreShadows(ctx,fit=1){
  const m=ctx.getTransform(),sx=Math.round(Math.hypot(m.a,m.b)*fit*65536)/65536,sy=Math.round(Math.hypot(m.c,m.d)*65536)/65536;
  if(!(sx>0&&sy>0)||!ctx.shadowBlur)return null;
  const key=JSON.stringify([ctx.font,ctx.textBaseline,sx,sy,ctx.shadowBlur,ctx.shadowColor,ctx.shadowOffsetX,ctx.shadowOffsetY]);if(this.scoreShadows?.key===key)return this.scoreShadows;
  this.clearScoreShadows();const glyphs=[],pad=Math.ceil(ctx.shadowBlur*2+Math.abs(ctx.shadowOffsetX)+Math.abs(ctx.shadowOffsetY)+2),Art=root.PinballArt;
  for(let digit=0;digit<10;digit++){
   const canvas=Art.rasterCanvas(1,1,true),c=canvas.getContext('2d');c.font=ctx.font;c.textBaseline=ctx.textBaseline;c.textAlign='left';const metrics=c.measureText(String(digit)),left=metrics.actualBoundingBoxLeft,right=metrics.actualBoundingBoxRight,ascent=metrics.actualBoundingBoxAscent,descent=metrics.actualBoundingBoxDescent;
   const x=pad+left*sx,y=pad+ascent*sy,w=Math.ceil((left+right)*sx)+pad*2+2,h=Math.ceil((ascent+descent)*sy)+pad*2+2,far=w*2;
   canvas.width=w;canvas.height=h;c.setTransform(sx,0,0,sy,0,y);c.font=ctx.font;c.textAlign='left';c.textBaseline=ctx.textBaseline;c.fillStyle='#fff';c.shadowColor=ctx.shadowColor;c.shadowBlur=ctx.shadowBlur;c.shadowOffsetX=far+x+ctx.shadowOffsetX;c.shadowOffsetY=ctx.shadowOffsetY;c.fillText(String(digit),-far/sx,0);
   glyphs.push({canvas:Art.rasterImage(canvas),x:x/sx,y:y/sy,w:w/sx,h:h/sy});
  }
  return this.scoreShadows={key,glyphs};
 }
 drawScoreText(ctx,text,maxWidth){
  if(!/^\d+$/.test(text)||!root.PinballArt)return ctx.fillText(text,0,0,maxWidth);
  const width=ctx.measureText(text).width,fit=Math.min(1,maxWidth/width),prepared=this.prepareScoreShadows(ctx,fit);if(!prepared)return ctx.fillText(text,0,0,maxWidth);
  ctx.save();ctx.shadowBlur=0;ctx.shadowColor='transparent';ctx.save();ctx.scale(fit,1);const advance=width/text.length;
  for(let i=0;i<text.length;i++){const g=prepared.glyphs[Number(text[i])];ctx.drawImage(g.canvas,-width/2+i*advance-g.x,-g.y,g.w,g.h);}ctx.restore();ctx.fillText(text,0,0,maxWidth);ctx.restore();
 }
 invalidateViewport(){this.viewportRect=null;this.onViewportChange?.();}
 viewport(target,translated=false){
  if(this.viewportTarget!==target){
   this.viewportCleanup?.();this.viewportTarget=target;this.invalidateViewport();
   const invalidate=()=>this.invalidateViewport(),observer=typeof ResizeObserver==='function'?new ResizeObserver(invalidate):null;
   observer?.observe(target);if(target.parentElement)observer?.observe(target.parentElement);
   root.addEventListener?.('resize',invalidate);root.addEventListener?.('scroll',invalidate,true);
   const scrollRoot=target.getRootNode?.();scrollRoot?.addEventListener('scroll',invalidate,true);
   root.visualViewport?.addEventListener('resize',invalidate);root.visualViewport?.addEventListener('scroll',invalidate);
   const ancestors=typeof MutationObserver==='function'?new MutationObserver(invalidate):null;
   for(let p=target.parentElement;p;p=p.parentElement||p.getRootNode?.().host)ancestors?.observe(p,{attributes:true,attributeFilter:['style','class']});
   this.viewportCleanup=()=>{observer?.disconnect();ancestors?.disconnect();scrollRoot?.removeEventListener('scroll',invalidate,true);root.removeEventListener?.('resize',invalidate);root.removeEventListener?.('scroll',invalidate,true);root.visualViewport?.removeEventListener('resize',invalidate);root.visualViewport?.removeEventListener('scroll',invalidate);};
   if(!this.viewportLifetime){this.viewportLifetime=true;root.addEventListener?.('pagehide',()=>this.viewportCleanup?.(),{once:true});}
  }
  const [x=0,y=0]=translated?(target.style?.translate||'').split(' ').map(v=>parseFloat(v)||0):[];
  if(!this.viewportRect){const r=target.getBoundingClientRect();this.viewportCssScale={x:r.width/(parseFloat(target.style?.width)||target.width||r.width||1),y:r.height/(parseFloat(target.style?.height)||target.height||r.height||1)};this.viewportRect={left:r.left-x*this.viewportCssScale.x,top:r.top-y*this.viewportCssScale.y,width:r.width,height:r.height};}
  const r=this.viewportRect;if(!x&&!y)return r;
  return {left:r.left+x*this.viewportCssScale.x,top:r.top+y*this.viewportCssScale.y,width:r.width,height:r.height};
 }
 positionFrame(position){
  // Cache submitted values: CSSOM may round pixel strings on readback.
  const previous=this.framePosition||(this.framePosition={});
  for(const [key,value] of Object.entries(position))if(previous[key]!==value){this.frame.style[key]=value;previous[key]=value;}
 }
 draw(ctx,game,top=-170.5){
  this.game=game;const bounds=PlayFrame.theaterBounds(top),scoreH=bounds.scoreHeight,sceneY=bounds.y,sceneH=bounds.height;
  if(this.panelElement){const box=this.viewport(this.panelElement),width=Math.min(box.width,box.height*3),height=width/3,r={left:box.left+(box.width-width)/2,top:box.top+(box.height-height)/2,width,height};this.positionFrame({left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',visibility:r.width&&r.height?'visible':'hidden',zIndex:'4'});return;}
  const canvas=ctx.canvas,r=this.viewport(canvas,true),m=ctx.getTransform(),sx=r.width/canvas.width,sy=r.height/canvas.height;
  // Both surfaces already share CSS shake. Position the theater from the unshaken
  // layout box; quantize away float noise in translated DOMRect coordinates.
  const [shakeX=0,shakeY=0]=(canvas.style?.translate||'').split(' ').map(v=>parseFloat(v)||0);
  const left=Math.round((r.left-shakeX*this.viewportCssScale.x)*64)/64,topY=Math.round((r.top-shakeY*this.viewportCssScale.y)*64)/64;
  this.positionFrame({left:(left+m.e*sx)+'px',top:(topY+(m.d*sceneY+m.f)*sy)+'px',width:(360*m.a*sx)+'px',height:Math.max(0,sceneH*m.d*sy)+'px',visibility:sceneH>0?'visible':'hidden',zIndex:'2'});
  // Spell geometry uses the same unshaken box as the theater. CSS camera
  // motion is carried separately so it cannot invalidate a live simulation.
  const viewport={rect:{left,top:topY,width:r.width,height:r.height},transform:m,translation:{x:shakeX*this.viewportCssScale.x,y:shakeY*this.viewportCssScale.y}};
  if(this.customScore)return viewport;
  this.paintScorePanel(ctx,game,top);
  return viewport;
 }
 paintScorePanel(ctx,game,top){const scoreH=PlayFrame.theaterBounds(top).scoreHeight;
  ctx.save();ctx.fillStyle='#36251e';ctx.fillRect(0,top,360,scoreH);ctx.strokeStyle='#ba9456';ctx.lineWidth=1;ctx.strokeRect(1,top+1,358,scoreH-2);ctx.fillStyle='#ffe5a6';ctx.textAlign='left';ctx.font='bold 12px monospace';if(this.bossStage)this.drawAttackMessage(ctx,12,top+6,220,20,game.time);else ctx.fillText('SCORE '+String(game.score).padStart(12,'0'),12,top+20);ctx.textAlign='right';ctx.font='bold 10px monospace';ctx.fillText('BALL '+game.ballNumber+' / 3',348,top+20);ctx.restore();
 }

}
if(typeof module!=='undefined'&&module.exports)module.exports=LayoutTheater;else root.LayoutTheater=LayoutTheater;
})(typeof window!=='undefined'?window:globalThis);
