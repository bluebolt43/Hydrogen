/* Art states, lights, sound resources and presentation helpers. */
(function(root){
'use strict';
function screenOverlay(doc){
 const mask=doc.createElement('div');
 mask.setAttribute('role','alert');mask.className='pirate-warning';
 mask.style.cssText='position:fixed;margin:0;padding:0;box-sizing:border-box;z-index:2147483647;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;pointer-events:auto';
 const win=doc.defaultView,viewport=win.visualViewport;
 const position=()=>{mask.style.left=(viewport?.offsetLeft||0)+'px';mask.style.top=(viewport?.offsetTop||0)+'px';mask.style.width=(viewport?.width||win.innerWidth)+'px';mask.style.height=(viewport?.height||win.innerHeight)+'px';};
 position();win.addEventListener('resize',position);viewport?.addEventListener('resize',position);viewport?.addEventListener('scroll',position);
 const cleanup=()=>{win.removeEventListener('resize',position);viewport?.removeEventListener('resize',position);viewport?.removeEventListener('scroll',position);mask.remove();};
 return {mask,cleanup};
}
function showWarning(doc){
 const {mask,cleanup}=screenOverlay(doc);
 mask.innerHTML=`<div style="margin:0;padding:0;flex:none;color:#ff3038;text-align:center;font:bold clamp(24px,6vw,64px) monospace;letter-spacing:.12em;line-height:1.35;display:flex;flex-direction:column;align-items:center;gap:12px">
 <div>WARNING</div>
 <svg viewBox="0 0 100 90" aria-label="警告" style="width:clamp(80px,18vw,150px);height:auto"><path d="M50 5L95 84H5Z" fill="none" stroke="currentColor" stroke-width="5"/><path d="M50 34V57" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><circle cx="50" cy="70" r="4" fill="currentColor"/></svg>
 <div>ENERMY</div><div style="width:100%;height:3px;background:currentColor"></div></div>`;
 doc.body.append(mask);
 const animation=mask.firstElementChild.animate([{opacity:1},{opacity:.15},{opacity:1}],{duration:600,iterations:2});
 const finished=animation.finished.catch(()=>{}).finally(cleanup);
 return {finished,cancel(){animation.cancel();cleanup();},pause(){animation.pause();},play(){animation.play();}};
}
function showGameOver(doc,score,rows,currentId,onClose,buttonLabel='重新開始'){
 return doc.defaultView.GameOverDialog.show(doc,score,rows,currentId,onClose,buttonLabel);
}
const sounds={
 metal:{src:'res/audio/electronic-impact.wav',volume:1,interval:70,voices:4},
 thunder:{src:'res/audio/thunder.ogg',volume:.75,interval:100,voices:2},
 explosion:{src:'res/audio/explosion.ogg?v=trim1',volume:.65,interval:70,voices:4}
};
const api={showWarning,showGameOver,sounds};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PirateMap=api;
})(typeof window!=='undefined'?window:globalThis);
