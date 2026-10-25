const phone=document.querySelector('#phone');
let storyWidth=phone.clientWidth,storyHeight=phone.clientHeight;
function measureStoryViewport(){storyWidth=phone.clientWidth;storyHeight=phone.clientHeight;}
window.addEventListener('resize',measureStoryViewport);
if(typeof ResizeObserver==='function'){
 const observer=new ResizeObserver(()=>{
  const width=storyWidth,height=storyHeight;measureStoryViewport();
  if((width!==storyWidth||height!==storyHeight)&&typeof draw==='function')draw(lastElapsed);
 });
 observer.observe(phone);
 window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
}
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
function blend(from, to, progress) {
  const t = clamp(progress, 0, 1);
  const ease = t * t * (3 - 2 * t);
  return Object.fromEntries(['x', 'y', 'scale'].map(key => [key, from[key] + (to[key] - from[key]) * ease]));
}
