/* Shared Touhou Boss music and spell emitters attached to the actual play table. */
(function(root){'use strict';
const FIRST_CAST_DELAY=8;
class TouhouBossPresentation{
 constructor(game,theme='touhou1',{external=false,overlay=false,renderer=null}={}){
  this.external=external||overlay;this.overlay=overlay;
  this.game=game;this.theme=theme;this.sharedMusic=root.AppStageMusic;this.data=root.TouhouSpellcardSets?.[theme]??root.TouhouSpellcards;this.stage=0;this.elapsed=0;this.hasCast=false;this.originPending=false;this.musicWanted=false;
  this.audio=new Audio();this.audio.loop=true;this.audio.preload='metadata';this.audio.volume=.6;this.audio.dataset.role='touhou-boss-bgm';document.body.append(this.audio);
  if(!this.sharedMusic?.ownsTheme(this.theme))this.audio.src=root.TouhouStageMusic.menuSource(this.theme);
  if(overlay){let selected=renderer;try{selected??=new URLSearchParams(root.location.search).get('spellRenderer')||localStorage.getItem('pinball-spell-renderer');}catch{}this.requestedRenderer=selected||'webgl';this.createOverlay(this.requestedRenderer);}
  this.previousMasks=[];this.mask=this.createMask();
 }
 createOverlay(renderer){
  const old=this.overlayCanvas,c=this.overlayCanvas=document.createElement('canvas');c.dataset.role='touhou-boss-spell';c.dataset.playLayer='boss-spells';c.style.cssText=old?.style.cssText||'position:fixed;pointer-events:none;z-index:5';c.hidden=true;
  if(renderer==='webgl'&&root.TouhouSpellWebGL)try{this.webgl=new root.TouhouSpellWebGL(c);this.webgl.onContextLost=()=>{this.webgl.destroy();this.webgl=null;this.createOverlay('2d');};}catch{this.webgl?.destroy();this.webgl=null;return this.createOverlay('2d');}
  this.renderer=this.webgl?'webgl':'2d';c.dataset.spellRenderer=this.renderer;if(!this.webgl)this.overlayContext=c.getContext('2d');
  if(old?.isConnected){old.replaceWith(c);old.width=old.height=0;}else document.body.append(c);
 }
 setRenderer(renderer){
  renderer=renderer==='webgl'?'webgl':'2d';if(!this.overlay||renderer===this.requestedRenderer)return this.renderer;
  this.requestedRenderer=renderer;this.webgl?.destroy();this.webgl=null;this.overlayContext=null;this.createOverlay(renderer);this.overlayPainted=false;return this.renderer;
 }
 createMask(){
  const canvas=document.createElement('canvas');canvas.width=360;canvas.height=610;canvas.dataset.role='touhou-boss-spell';canvas.style.cssText='position:fixed;pointer-events:none;z-index:5;will-change:transform';canvas.hidden=true;if(!this.external)document.body.append(canvas);
  const mask=new root.TouhouSpellMask(canvas,{data:this.data,external:this.external});mask.naturalDrain=true;mask.extendBeamsToViewport=true;
  mask.targetProvider=()=>this.target??{x:.5,y:.9};return mask;
 }
 prepare(stage){
  return this.mask.prepare(stage);
 }
 clearSpells(){this.originPending=false;this.mask.clear();for(const mask of this.previousMasks){mask.destroy();mask.canvas.remove();}this.previousMasks=[];if(this.overlayCanvas){if(this.overlayPainted){if(this.webgl){this.webgl.begin();this.webgl.end();}else this.overlayContext.clearRect(0,0,this.overlayCanvas.width,this.overlayCanvas.height);}this.overlayPainted=false;this.overlayCanvas.hidden=true;}}
 choose(stage){
  if(stage===this.stage)return;
  this.stage=stage;this.origin=undefined;this.defeated=false;this.elapsed=0;this.hasCast=false;this.originPending=false;this.clearSpells();this.audio.pause();this.audio.currentTime=0;this.musicWanted=false;
  if(stage&&!this.sharedMusic?.matches(this.theme,stage))this.audio.src=root.TouhouStageMusic.source(this.theme,stage);
  else if(!stage)this.audio.src=root.TouhouStageMusic.menuSource(this.theme);
 }
 defeat(){this.defeated=true;this.elapsed=0;this.clearSpells();}
 onEvent(event){
  if(event.type==='configured-attack'&&event.kind==='lv4'){this.elapsed=0;this.hasCast=false;this.clearSpells();}
  if(['new-game','ready','ball-save-ready'].includes(event.type)){
   this.elapsed=0;this.hasCast=false;this.clearSpells();
  }
  if(event.type==='launch'&&!this.hasCast)this.elapsed=0;
 }

 onOrigin(stage,origin){
  if(!this.originPending||stage!==this.stage||this.defeated)return;
  this.originPending=false;this.origin=origin;
  if(!this.game.paused&&!this.game.enemyIntroPending&&!this.game.theaterFrozen&&this.game.enemyActive&&this.game.balls.some(b=>b.state==='playing'))this.cast(stage);
 }

 cast(stage,origin){
  if(stage!==this.stage||this.defeated||this.theme==='touhou1'&&!this.game.balls.some(ball=>ball.state==='playing'))return;
  if(this.mask.active){this.previousMasks.push(this.mask);this.mask=this.createMask();}
  if(origin)this.origin=origin;this.mask.start(stage,this.mapOrigin());this.hasCast=true;this.originPending=false;this.elapsed=0;
 }
 mapOrigin(){
  const r=this.layout,o=this.origin;
  return r&&o?{x:o.x,y:o.y*r.stageHeight/r.height}:undefined;
 }
 syncMusic(sound,retry=false,paused=this.game.paused){
  if(this.sharedMusic?.matches(this.theme,this.stage)){this.sharedMusic.syncGamePause(paused);return;}
  const wanted=(!!this.stage||!!root.TouhouStageMusic.menuSource(this.theme))&&!paused&&sound.enabled&&(sound.unlocked||root.PinballPlatform==='android');
  this.audio.muted=!sound.enabled;
  if(wanted&&(!this.musicWanted||retry))this.audio.play().catch(()=>{});
  if(!wanted&&this.musicWanted)this.audio.pause();
  this.musicWanted=wanted;
 }
 update(dt,sound,musicPaused=this.game.paused){
  this.syncMusic(sound,false,musicPaused);
  const running=!!this.stage&&!this.defeated&&this.game.enemyActive&&!this.game.enemyIntroPending&&!this.game.paused&&!this.game.theaterFrozen&&this.game.balls.some(b=>b.state==='playing');
  this.mask.pause(!running);
  if(this.external)this.mask.advance(dt);
  if(this.previousMasks.length)this.previousMasks=this.previousMasks.filter(mask=>{if(!mask.active){mask.destroy();mask.canvas.remove();return false;}mask.pause(!running);if(this.external)mask.advance(dt);return true;});
  if(!running)return;
  if(this.mask.active||this.previousMasks.length||this.originPending)return;
  if(!this.hasCast){this.elapsed+=dt;if(this.elapsed+1e-9<FIRST_CAST_DELAY)return;}
  if(this.canCast&&!this.canCast())return;
  if(!this.origin&&this.requestOrigin){this.originPending=true;this.requestOrigin(this.stage);}else this.cast(this.stage);
 }
 draw(ctx,theater,viewport=null){
  const masks=[...this.previousMasks,this.mask];
  for(const mask of masks){const hidden=!mask.active;if(mask.canvas.hidden!==hidden)mask.canvas.hidden=hidden;}
  if(!theater)return;
  const r=viewport?.rect??ctx.canvas.getBoundingClientRect(),m=viewport?.transform??ctx.getTransform(),sy=r.height/ctx.canvas.height;
  const left=parseFloat(theater.frame.style.left),top=parseFloat(theater.frame.style.top),width=parseFloat(theater.frame.style.width),stageHeight=parseFloat(theater.frame.style.height),height=r.top+(m.d*469.5+m.f)*sy-top;
  if(!(width>0&&height>0))return;
  const layoutChanged=!this.layout||this.layout.height!==height||this.layout.stageHeight!==stageHeight;
  if(layoutChanged)this.layout={height,stageHeight};
  const shift=viewport?.translation,translate=shift&&(shift.x||shift.y)?shift.x+'px '+shift.y+'px':'';
  const ball=this.game.balls.find(b=>b.state==='playing');
  if(ball?.p){const [x,y]=ball.p;this.target={x:(r.left+(m.a*x+m.c*y+m.e)*r.width/ctx.canvas.width-left)/width,y:(r.top+(m.b*x+m.d*y+m.f)*sy-top)/height};}
  const pixels=Math.round(360*height/width);
  if(this.external){
   const sx=ctx.canvas.width/r.width,sy=ctx.canvas.height/r.height;this.canvasBounds={x:Math.round((left-r.left)*sx),y:Math.round((top-r.top)*sy),width:Math.max(1,Math.round(width*sx)),height:Math.max(1,Math.round(height*sy))};
   for(const mask of masks){const resized=mask.canvas.width!==this.canvasBounds.width||mask.canvas.height!==this.canvasBounds.height;if(mask.canvas.width!==this.canvasBounds.width)mask.canvas.width=this.canvasBounds.width;if(mask.canvas.height!==this.canvasBounds.height)mask.canvas.height=this.canvasBounds.height;if(resized&&mask===this.mask&&!mask.active&&mask.prepared)mask.prepare(mask.entry.stage);}
   if(this.overlayCanvas){const c=this.overlayCanvas,b=this.canvasBounds;if(c.width!==b.width)c.width=b.width;if(c.height!==b.height)c.height=b.height;for(const [key,value]of Object.entries({left:left+'px',top:top+'px',width:width+'px',height:height+'px',translate}))if(c.style[key]!==value)c.style[key]=value;}
   if(layoutChanged&&this.origin)this.mask.origin=this.mapOrigin();return;
  }
  const style={left:left+'px',top:top+'px',width:width+'px',height:height+'px',translate};
  for(const mask of masks){const c=mask.canvas;if(c.height!==pixels)c.height=pixels;for(const key in style)if(c.style[key]!==style[key])c.style[key]=style[key];}
  if(layoutChanged&&this.origin)this.mask.origin=this.mapOrigin();
 }
 get active(){return this.mask.active||this.previousMasks.some(m=>m.active);}
 paint(ctx){
  if(!this.external||!this.canvasBounds)return;
  if(this.overlayCanvas){const c=this.overlayCanvas;if(!this.active){if(this.overlayPainted){if(this.webgl){this.webgl.begin();this.webgl.end();}else this.overlayContext.clearRect(0,0,c.width,c.height);}this.overlayPainted=false;c.hidden=true;return;}c.hidden=false;if(this.webgl&&!this.webgl.lost){const renderer=this.webgl;renderer.begin();try{for(const mask of [...this.previousMasks,this.mask])if(mask.active){mask.webglRenderer=renderer;try{mask.render(mask.elapsed);}finally{mask.webglRenderer=null;}}}finally{renderer.end();}}else{const out=this.overlayContext;out.clearRect(0,0,c.width,c.height);for(const mask of [...this.previousMasks,this.mask])mask.renderTo(out,0,0);}this.overlayPainted=true;return;}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);for(const mask of [...this.previousMasks,this.mask])mask.renderTo(ctx,this.canvasBounds.x,this.canvasBounds.y);ctx.restore();
 }

 destroy(){this.choose(0);this.clearSpells();this.mask.destroy();this.mask.canvas.remove();this.webgl?.destroy();if(this.overlayCanvas){this.overlayCanvas.remove();this.overlayCanvas.width=this.overlayCanvas.height=0;}this.audio.removeAttribute('src');this.audio.load();this.audio.remove();}
}
root.TouhouBossPresentation=TouhouBossPresentation;
})(window);
