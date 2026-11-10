(function(root){
'use strict';
const interactionStyle=document.createElement('style');
interactionStyle.id='story-interaction-style';
interactionStyle.textContent='#phone,#phone *{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}#phone img,#phone svg image{-webkit-user-drag:none}';
interactionStyle.textContent+='#story-skip,#skip-intro{touch-action:none;overflow:hidden}.story-hold-progress{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.story-hold-progress rect{fill:none;stroke:#eee;stroke-width:4;stroke-dasharray:100;stroke-dashoffset:100;animation:story-hold-border .9s linear forwards}@keyframes story-hold-border{to{stroke-dashoffset:0}}';
// Keep the six story players' visible controls on the Touhou1 design.
interactionStyle.textContent+='#phone :is(#start,#replay,#story-skip,#skip-intro,#story-next){box-sizing:border-box;padding:12px 18px;border:1px solid #fff9;border-radius:24px;background:#102c3ee6;color:#fff;font:16px system-ui;cursor:pointer;text-shadow:none;box-shadow:none}';
document.head.append(interactionStyle);
const isFinalEnding=()=>document.body.dataset.storyChapter==='8'&&document.body.dataset.storyPart==='end';
const isSkip=button=>button?.id==='story-skip'||button?.id==='skip-intro';
let holding=null,holdTimer=0,holdKey=null,allowSkip=false;
function cancelHold(){
 clearTimeout(holdTimer);holdTimer=0;
 holding?.querySelector('.story-hold-progress')?.remove();holding=null;holdKey=null;
}
function beginHold(button,key=null){
 if(isFinalEnding()||holding||button.disabled||button.hidden)return;
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.classList.add('story-hold-progress');svg.setAttribute('aria-hidden','true');
 const rect=document.createElementNS(svg.namespaceURI,'rect');
 const width=button.clientWidth,height=button.clientHeight;
 const radius=Math.min(parseFloat(getComputedStyle(button).borderTopLeftRadius)||0,width/2,height/2);
 for(const [name,value] of Object.entries({x:2,y:2,width:Math.max(0,width-4),height:Math.max(0,height-4),rx:Math.max(0,radius-2),pathLength:100}))rect.setAttribute(name,value);
 svg.append(rect);button.append(svg);
 holding=button;holdKey=key;
 holdTimer=setTimeout(()=>{
  const ready=holding===button&&!button.disabled&&!button.hidden&&button.getClientRects().length&&getComputedStyle(button).visibility!=='hidden'&&!document.hidden;
  cancelHold();
  if(ready){allowSkip=true;try{button.click();}finally{allowSkip=false;}}
 },900);
}
document.addEventListener('click',event=>{
 if(isSkip(event.target.closest?.('#story-skip,#skip-intro'))&&!allowSkip){event.preventDefault();event.stopImmediatePropagation();}
},{capture:true});
document.addEventListener('pointerdown',event=>{
 const button=event.target.closest?.('#story-skip,#skip-intro');
 if(!button||event.button!==0)return;
 event.preventDefault();button.setPointerCapture(event.pointerId);beginHold(button);
},{capture:true});
for(const type of ['pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,cancelHold,{capture:true});
document.addEventListener('keyup',event=>{if(event.code===holdKey){event.preventDefault();cancelHold();}},{capture:true});
root.addEventListener('blur',cancelHold);
document.addEventListener('visibilitychange',cancelHold);
for(const type of ['contextmenu','dragstart','selectstart'])document.addEventListener(type,event=>{
 if(document.getElementById('phone')?.contains(event.target))event.preventDefault();
},{capture:true});
function keyboard(event){
 if(event.repeat||event.isComposing||event.ctrlKey||event.altKey||event.metaKey||event.target?.closest?.('input,textarea,select,[contenteditable]'))return;
 if(['Shift','Control','Alt','Meta','CapsLock','NumLock','ScrollLock'].includes(event.key))return;
 const ids=['story-skip','skip-intro','story-next','start'];
 const button=ids.map(id=>document.getElementById(id)).find(button=>button&&!button.disabled&&!button.hidden&&button.getClientRects().length&&getComputedStyle(button).visibility!=='hidden');
 if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(isSkip(button))beginHold(button,event.code);else button.click();
}
document.addEventListener('keydown',keyboard,{capture:true});
function apply(){
 for(const label of document.querySelectorAll('[data-story-development]'))label.textContent=root.PinballI18n.t('story.development');
 for(const caption of document.querySelectorAll('[data-story-ending-caption]')){
  if(document.body?.dataset?.storyChapter&&(document.body.dataset.storyChapter!=='8'||document.body.dataset.storyPart!=='end'))continue;
  caption.textContent=root.PinballI18n.t('story.toBeContinued');
 }

 for(const [id,label] of [['story-skip','story.skip'],['story-next','story.next'],['skip-intro','story.skip']]){
  const button=document.getElementById(id);if(!button)continue;
  button.textContent=root.PinballI18n.t(label);
  if(isSkip(button)&&isFinalEnding()){button.hidden=true;button.style.display='none';}
 }
}
apply();
const off=root.PinballI18n.onChange(apply);
root.addEventListener('pagehide',()=>{cancelHold();off();document.removeEventListener('keydown',keyboard,{capture:true});},{once:true});
})(window);
