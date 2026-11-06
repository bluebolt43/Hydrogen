/* Optional two-digit rAF counter. Uses the existing player loop, no extra timer. */
(function(root){'use strict';
function create(doc){
 const label=doc.createElement('output');label.id='playFps';label.hidden=true;label.textContent='00';label.setAttribute('aria-live','off');
 label.style.cssText='position:fixed;left:8px;top:calc(env(safe-area-inset-top,0px) + 8px);z-index:1100;pointer-events:none;color:#ffff00;font:bold 14px monospace;font-variant-numeric:tabular-nums';doc.body.append(label);
 let enabled=false,start=null,count=0;
 function reset(){start=null;count=0;if(label.textContent!=='00')label.textContent='00';}
 return {reset,get enabled(){return enabled;},setEnabled(value){value=!!value;if(value===enabled)return;enabled=value;label.hidden=!value;reset();},frame(now,paused=false){
  if(!enabled)return;
  if(paused){reset();return;}
  if(start===null||now<start){start=now;count=0;return;}
  count++;const elapsed=now-start;if(elapsed<1000)return;
  const fps=Math.round(count*1000/elapsed),text=String(Math.max(0,Math.min(99,fps))).padStart(2,'0');
  if(label.textContent!==text)label.textContent=text;start=now;count=0;
 }};
}
const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PlayFPS=api;
})(typeof window!=='undefined'?window:globalThis);
