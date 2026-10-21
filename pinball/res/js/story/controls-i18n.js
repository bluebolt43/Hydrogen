/* Story navigation shares the system locale, including live language changes. */
(function(root){
'use strict';
function apply(){
 for(const [id,label,aria] of [['story-skip','story.skip','story.skip'],['story-next','story.next','story.next'],['skip-intro','story.skip','story.skipIntro']]){
  const button=document.getElementById(id);if(!button)continue;
  button.textContent=root.PinballI18n.t(label);button.setAttribute('aria-label',root.PinballI18n.t(aria));
 }
}
apply();
const off=root.PinballI18n.onChange(apply);
root.addEventListener('pagehide',off,{once:true});
})(window);
