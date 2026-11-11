/* One Google Play check per launch; prompts wait for a safe menu screen. */
(function(root){
'use strict';
function create({bridge,dialog,canPrompt}){
 let pending=false,started=false,focus;
 function maybePrompt(){
  if(!pending||dialog.open||!canPrompt())return;
  pending=false;focus=root.document.activeElement;dialog.showModal();dialog.querySelector('[data-update-later]').focus();
 }
 bridge.onmessage=event=>{
  let value;try{value=typeof event.data==='string'?JSON.parse(event.data):event.data;}catch{return;}
  if(!value||!['checking','available','current','unavailable'].includes(value.status))return;
  pending=value.status==='available';maybePrompt();
 };
 dialog.querySelector('[data-update-later]').onclick=()=>dialog.close();
 dialog.querySelector('[data-update-now]').onclick=()=>{dialog.close();try{bridge.postMessage('open');}catch{}};
 dialog.addEventListener('close',()=>{pending=false;if(focus?.isConnected)focus.focus();});
 return {start(){if(started)return;started=true;try{bridge.postMessage('check');}catch{}},maybePrompt,close(){if(dialog.open)dialog.close();}};
}
root.AppUpdates={create};
})(globalThis);
