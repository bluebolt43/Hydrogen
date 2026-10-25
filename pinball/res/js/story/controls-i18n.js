/* Story navigation shares the system locale, including live language changes. */
(function(root){
'use strict';
function apply(){
 for(const canvas of document.querySelectorAll('[data-story-ending-caption]')){
  if(document.body?.dataset?.storyChapter&&(document.body.dataset.storyChapter!=='8'||document.body.dataset.storyPart!=='end'))continue;
  const text=root.PinballI18n.t('story.toBeContinued'),ctx=canvas.getContext('2d');
  canvas.setAttribute('aria-label',text);ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#fff';ctx.font='bold 58px Georgia, "Times New Roman", "Noto Serif CJK TC", serif';ctx.textAlign='right';ctx.textBaseline='alphabetic';
  ctx.fillText(text,886,1575,831);
 }

 for(const [id,label,aria] of [['story-skip','story.skip','story.skip'],['story-next','story.next','story.next'],['skip-intro','story.skip','story.skipIntro']]){
  const button=document.getElementById(id);if(!button)continue;
  button.textContent=root.PinballI18n.t(label);button.setAttribute('aria-label',root.PinballI18n.t(aria));
 }
}
apply();
const off=root.PinballI18n.onChange(apply);
root.addEventListener('pagehide',off,{once:true});
})(window);
