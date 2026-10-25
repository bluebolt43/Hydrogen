/* Text-free ending artwork is shared; locale text is painted separately. */
(function(root){
'use strict';
const canvases=new WeakMap();
const text=()=>root.PinballI18n?.t('story.end')||'END';
function draw(ctx,width,height,alpha=1){
 const label=text(),size=width*.125;
 ctx.save();ctx.globalAlpha*=Math.max(0,Math.min(1,alpha));
 ctx.fillStyle='#f5e4be';ctx.font='700 '+size+'px Georgia,"Times New Roman",serif';ctx.textAlign='center';ctx.textBaseline='alphabetic';
 const vertical=root.PinballI18n?.locale==='zh-Hant',glyphs=vertical?[...label]:[label],gap=size*1.15;
 for(let i=0;i<glyphs.length;i++){
  const glyph=glyphs[i],metrics=ctx.measureText(glyph),center=height*(868/1792)+(i-(glyphs.length-1)/2)*gap;
  const baseline=center+(metrics.actualBoundingBoxAscent-metrics.actualBoundingBoxDescent)/2;
  ctx.fillText(glyph,width/2,baseline,width*.8);
 }
 ctx.restore();
 return label;
}
function watch(redraw){
 const off=root.PinballI18n?.onChange(redraw)||(()=>{});
 root.addEventListener?.('pagehide',off,{once:true});return off;
}
function paint(canvas,alpha){
 let state=canvases.get(canvas);
 if(!state){
  state={alpha:0};canvases.set(canvas,state);canvas.parentElement.style.isolation='isolate';
  Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'11'});
  state.redraw=()=>{
   const box=canvas.getBoundingClientRect(),ratio=root.devicePixelRatio||1;
   canvas.style.opacity=String(state.alpha);
   const signature=[box.width,box.height,ratio,text()].join(':');if(state.signature===signature)return;state.signature=signature;
   canvas.width=Math.max(1,Math.round(box.width*ratio));canvas.height=Math.max(1,Math.round(box.height*ratio));
   const ctx=canvas.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);
   canvas.setAttribute('aria-label',draw(ctx,box.width,box.height));canvas.style.opacity=String(state.alpha);
  };
  watch(state.redraw);
  if(root.ResizeObserver){const observer=new root.ResizeObserver(state.redraw);observer.observe(canvas);root.addEventListener?.('pagehide',()=>observer.disconnect(),{once:true});}
 }
 // Opacity changes do not invalidate glyph geometry. ResizeObserver and locale
 // changes redraw the text; avoid a forced layout read on every animation frame.
 state.alpha=Math.max(0,Math.min(1,alpha));canvas.style.opacity=String(state.alpha);
 if(!state.signature)state.redraw();
}
const api={draw,paint,watch};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.StoryEndingText=api;
})(typeof window!=='undefined'?window:globalThis);
