(function(root){
'use strict';
const interactionStyle=document.createElement('style');
interactionStyle.id='story-interaction-style';
interactionStyle.textContent='#phone,#phone *{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}#phone img,#phone svg image{-webkit-user-drag:none}';
document.head.append(interactionStyle);
for(const type of ['contextmenu','dragstart','selectstart'])document.addEventListener(type,event=>{
 if(document.getElementById('phone')?.contains(event.target))event.preventDefault();
},{capture:true});
function keyboard(event){
 if(event.repeat||event.isComposing||event.ctrlKey||event.altKey||event.metaKey||event.target?.closest?.('input,textarea,select,[contenteditable]'))return;
 if(['Shift','Control','Alt','Meta','CapsLock','NumLock','ScrollLock'].includes(event.key))return;
 const ids=['story-skip','skip-intro','story-next','start'];
 const button=ids.map(id=>document.getElementById(id)).find(button=>button&&!button.disabled&&!button.hidden&&button.getClientRects().length&&getComputedStyle(button).visibility!=='hidden');
 if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();button.click();
}
document.addEventListener('keydown',keyboard,{capture:true});
function apply(){
 for(const canvas of document.querySelectorAll('[data-story-ending-caption]')){
  if(document.body?.dataset?.storyChapter&&(document.body.dataset.storyChapter!=='8'||document.body.dataset.storyPart!=='end'))continue;
  const text=root.PinballI18n.t('story.toBeContinued'),ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#fff';ctx.font='bold 58px Georgia, "Times New Roman", "Noto Serif CJK TC", serif';ctx.textAlign='right';ctx.textBaseline='alphabetic';
  ctx.fillText(text,886,1575,831);
 }

 for(const [id,label] of [['story-skip','story.skip'],['story-next','story.next'],['skip-intro','story.skip']]){
  const button=document.getElementById(id);if(!button)continue;
  button.textContent=root.PinballI18n.t(label);
 }
}
apply();
const off=root.PinballI18n.onChange(apply);
root.addEventListener('pagehide',()=>{off();document.removeEventListener('keydown',keyboard,{capture:true});},{once:true});
})(window);
