(function(root){
'use strict';
const labels=new WeakMap();
const text=()=>root.PinballI18n?.t('story.end')||'END';
function draw(ctx,width,height,alpha=1,color='#f5e4be'){
 const label=text(),size=width*.125;
 ctx.save();ctx.globalAlpha*=Math.max(0,Math.min(1,alpha));
 ctx.fillStyle=color;ctx.font='700 '+size+'px Georgia,"Times New Roman",serif';ctx.textAlign='center';ctx.textBaseline='alphabetic';
 const vertical=root.PinballI18n?.locale?.startsWith('zh-'),glyphs=vertical?[...label]:[label],gap=size*1.15;
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
function paint(element,alpha){
 element=labels.get(element)?.replacement||element;
 // Legacy chapter markup supplies a canvas placeholder. Text must be a DOM
 // layer: Android WebView can omit these transparent canvas overlays.
 if(element.tagName==='CANVAS'){
  const replacement=root.document.createElement('div');
  for(const attribute of element.attributes)replacement.setAttribute(attribute.name,attribute.value);
  element.replaceWith(replacement);labels.set(element,{replacement});element=replacement;
 }
 let state=labels.get(element);
 if(!state){
  const caption=root.document.createElement('span');element.append(caption);
  state={alpha:0};labels.set(element,state);element.parentElement.style.isolation='isolate';
  Object.assign(element.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'11'});
  Object.assign(caption.style,{position:'absolute',left:'50%',top:(868/1792*100)+'%',transform:'translate(-50%,-50%)',maxWidth:'80%',textAlign:'center',whiteSpace:'pre',lineHeight:'1.15',fontFamily:'Georgia,"Times New Roman",serif',fontWeight:'700'});
  state.redraw=()=>{
   const label=text(),box=element.getBoundingClientRect();
   element.setAttribute('aria-label',label);
   caption.textContent=root.PinballI18n?.locale?.startsWith('zh-')?[...label].join('\n'):label;
   caption.style.fontSize=box.width*.125+'px';
   caption.style.color=element.dataset?.endingColor||'#f5e4be';
  };
  watch(state.redraw);
  if(root.ResizeObserver){const observer=new root.ResizeObserver(state.redraw);observer.observe(element);root.addEventListener?.('pagehide',()=>observer.disconnect(),{once:true});}
  state.redraw();
 }
 state.alpha=Math.max(0,Math.min(1,alpha));element.style.opacity=String(state.alpha);
}

const api={draw,paint,watch};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.StoryEndingText=api;
})(typeof window!=='undefined'?window:globalThis);
