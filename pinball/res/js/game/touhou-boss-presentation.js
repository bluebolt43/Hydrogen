/* Shared Touhou Boss music and spell emitters attached to the actual play table. */
(function(root){'use strict';
const FIRST_CAST_DELAY=8;
class TouhouBossPresentation{
 constructor(game,theme='touhou1'){
  this.game=game;this.theme=theme;this.data=root.TouhouSpellcardSets?.[theme]??root.TouhouSpellcards;this.stage=0;this.elapsed=0;this.hasCast=false;this.originPending=false;this.musicWanted=false;
  this.audio=new Audio();this.audio.loop=true;this.audio.preload='metadata';this.audio.volume=.6;this.audio.dataset.role='touhou-boss-bgm';document.body.append(this.audio);
  if(this.theme==='touhou1')this.audio.src='res/audio/touhou1-menu.ogg';
  this.previousMasks=[];this.mask=this.createMask();
 }
 createMask(){
  const canvas=document.createElement('canvas');canvas.width=360;canvas.height=610;canvas.dataset.role='touhou-boss-spell';canvas.style.cssText='position:fixed;pointer-events:none;z-index:5;will-change:transform';canvas.hidden=true;document.body.append(canvas);
  const mask=new root.TouhouSpellMask(canvas,{data:this.data});mask.naturalDrain=true;mask.extendBeamsToViewport=true;
  mask.targetProvider=()=>this.target??{x:.5,y:.9};return mask;
 }
 clearSpells(){this.originPending=false;this.mask.clear();for(const mask of this.previousMasks){mask.destroy();mask.canvas.remove();}this.previousMasks=[];}
 choose(stage){
  if(stage===this.stage)return;
  this.stage=stage;this.origin=undefined;this.defeated=false;this.elapsed=0;this.hasCast=false;this.originPending=false;this.clearSpells();this.audio.pause();this.audio.currentTime=0;this.musicWanted=false;
  if(stage)this.audio.src=this.theme==='touhou2'?'res/audio/touhou2-b'+stage+'.ogg':'res/audio/touhou1/touhou-a'+stage+'-bgm.m4a';
  else if(this.theme==='touhou1')this.audio.src='res/audio/touhou1-menu.ogg';
 }
 defeat(){this.defeated=true;this.elapsed=0;this.clearSpells();}
 onEvent(event){
  if(event.type==='configured-attack'&&event.kind==='lv4')this.clearSpells();
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
  const wanted=(!!this.stage||this.theme==='touhou1')&&!paused&&sound.enabled&&(sound.unlocked||root.PinballPlatform==='android');
  this.audio.muted=!sound.enabled;
  if(wanted&&(!this.musicWanted||retry))this.audio.play().catch(()=>{});
  if(!wanted&&this.musicWanted)this.audio.pause();
  this.musicWanted=wanted;
 }
 update(dt,sound,musicPaused=this.game.paused){
  this.syncMusic(sound,false,musicPaused);
  const running=!!this.stage&&!this.defeated&&this.game.enemyActive&&!this.game.enemyIntroPending&&!this.game.paused&&!this.game.theaterFrozen&&this.game.balls.some(b=>b.state==='playing');
  this.mask.pause(!running);
  this.previousMasks=this.previousMasks.filter(mask=>{if(!mask.active){mask.destroy();mask.canvas.remove();return false;}mask.pause(!running);return true;});
  if(!running)return;
  if(this.mask.active||this.previousMasks.some(mask=>mask.active)||this.originPending)return;
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
  const ball=this.game.balls.find(b=>b.state==='playing');
  if(ball?.p){const [x,y]=ball.p;this.target={x:(r.left+(m.a*x+m.c*y+m.e)*r.width/ctx.canvas.width-left)/width,y:(r.top+(m.b*x+m.d*y+m.f)*sy-top)/height};}
  const pixels=Math.round(360*height/width);
  const style={left:left+'px',top:top+'px',width:width+'px',height:height+'px'};
  for(const mask of masks){const c=mask.canvas;if(c.height!==pixels)c.height=pixels;for(const key in style)if(c.style[key]!==style[key])c.style[key]=style[key];}
  if(layoutChanged&&this.origin)this.mask.origin=this.mapOrigin();
 }

 destroy(){this.choose(0);this.clearSpells();this.mask.destroy();this.mask.canvas.remove();this.audio.removeAttribute('src');this.audio.load();this.audio.remove();}
}
root.TouhouBossPresentation=TouhouBossPresentation;
})(window);
