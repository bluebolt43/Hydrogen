const phone=document.getElementById('phone'),panels=[...phone.querySelectorAll('.shot')];
const chapterNumber=Number(document.body.dataset.storyChapter),chapterPart=document.body.dataset.storyPart;
const chapterId=`ch${chapterNumber}-${chapterPart}`;
const startButton=document.getElementById('start'),begin=document.getElementById('begin'),skip=document.getElementById('story-skip'),next=document.getElementById('story-next'),error=document.getElementById('error');
const offsets=[];let duration=0;
for(const shot of STORY_SHOTS){offsets.push(duration);duration+=shot.duration;}
let raf=0,startedAt=0,playing=false,nextTimer=0,completed=false,playSerial=0;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=v=>{const t=clamp(v);return t*t*(3-2*t);};
const seenKey='pinball-steampunk-story-seen-v1:'+chapterId;
const hasSeen=()=>window.AppProgress?window.AppProgress.hasSeen(chapterId):localStorage.getItem(seenKey)==='1';
function markSeen(){if(window.AppProgress)window.AppProgress.markSeen(chapterId);else localStorage.setItem(seenKey,'1');}
function paint(index,elapsed){
 const panel=panels[index],shot=STORY_SHOTS[index],t=elapsed/1000,p=clamp(elapsed/shot.duration);
 panel.hidden=false;panel.style.opacity='1';
 const bg=panel.querySelector('.background');
 bg.style.transform=shot.effect==='crash'?`scale(${1.04+.16*p}) translate(${-2*p}%,${-3*p}%)`:shot.effect==='slowzoom'||shot.effect==='race'?`scale(${1+.08*p})`:'none';
 for(const img of panel.querySelectorAll('[data-fx]')){
  let x=0,y=0,scale=1,angle=0,opacity=1;
  switch(img.dataset.fx){
   case 'chase-ship':x=125-230*p;y=-8*p;break;
   case 'chase-enemy':x=140-270*p;y=-10*p;break;
   case 'impact-burst':scale=.2+1.5*ease(p);opacity=Math.sin(Math.PI*p);angle=-10+20*p;break;
   case 'fright-panel':x=130*(1-ease((t-2.4)/.6));opacity=ease((t-2.4)/.4);scale=1+.025*Math.sin(t*17)*clamp(4-t);break;
   case 'race-flag':y=-35*(1-ease(t/1.4));angle=2*Math.sin(t*2);break;
   case 'float':y=-2*Math.sin(t*1.6);break;
   case 'fall':x=25*p*p;y=170*p*p;angle=24*p;opacity=1-ease((p-.65)/.35);break;
   case 'land':y=-120*(1-ease(t/4));opacity=clamp(t);break;
   case 'rise':y=80*(1-ease(t/3))-20*p;opacity=clamp(t+.3);break;
   case 'approach':scale=.25+.75*ease(t/4);opacity=clamp(t);break;
   case 'burst':scale=.2+.9*ease(t/1.3);opacity=clamp(t*3)*(1-.35*clamp(t-2));break;
   case 'vanish':scale=1-.8*ease(t/3.5);opacity=1-ease(t/3.5);break;
   case 'reward':scale=.4+.6*ease(t/2);opacity=clamp(t);break;
   case 'zoom':scale=1+1.8*ease(p);break;
   case 'escape':x=35*p;y=90*p;scale=1+.9*p;break;
   case 'cloudout':opacity=1-ease(t/4);scale=1+.5*p;break;
   case 'cloudpass':x=-120+260*ease(t/4);break;
   case 'gate-left':x=-35*ease((t-1)/3);break;
   case 'gate-right':x=35*ease((t-1)/3);break;
  }
  img.style.transform=`translate(-50%,-50%) translate(${x}%,${y}%) rotate(${angle}deg) scale(${scale})`;
  if(img.dataset.fx==='chase-enemy')img.style.transform+=' scaleX(-1)';
  img.style.opacity=opacity;
 }
 const fx=panel.querySelector('.effect');fx.style.opacity='1';
 if(shot.effect==='chase')fx.style.opacity=ease((p-.86)/.14);
 if(shot.effect==='crash')fx.style.opacity=ease((p-.88)/.12);
 if(shot.effect==='race')fx.style.opacity=1-ease(t/1.2);
 if(shot.effect==='impact')fx.style.opacity=.8*Math.exp(-t*6);
 if(shot.effect==='alarm')fx.style.opacity=.23*(.5-.5*Math.cos(t*Math.PI*2/1.2));
 if(shot.effect==='speed'){fx.style.opacity='.35';fx.style.backgroundPosition=`0 ${t*160}px`;}
 if(shot.effect==='countdown'){fx.textContent=String(Math.max(2,5-Math.floor(t)));fx.style.background=`rgba(0,0,0,${.5*ease((t-3)/1.5)})`;}
 if(shot.effect==='activation'){fx.textContent='バルス';fx.style.opacity=ease((t-1)/1.5);}
}
function render(elapsed){
 const ms=clamp(elapsed,0,duration-.01);let index=offsets.length-1;
 while(index>0&&ms<offsets[index])index--;
 for(const panel of panels)panel.hidden=true;
 const local=ms-offsets[index];
 if(index>0&&local<550&&!STORY_SHOTS[index].cut){paint(index-1,STORY_SHOTS[index-1].duration);paint(index,local);panels[index].style.opacity=ease(local/550);}
 else paint(index,local);
 phone.dataset.shot=String(index+1);phone.dataset.phase=STORY_SHOTS[index].title;
}
function completeStory(){
 if(completed)return;completed=true;clearTimeout(nextTimer);next.hidden=true;
 window.dispatchEvent(new CustomEvent('story:complete',{detail:{chapter:chapterId}}));
}
function finishStory(skipped=false){
 playing=false;cancelAnimationFrame(raf);skip.hidden=true;render(duration);
 if(!skipped)markSeen();
 if(chapterPart==='end'){next.hidden=false;nextTimer=setTimeout(completeStory,10000);}
 else completeStory();
}
function tick(now){if(!playing)return;const elapsed=now-startedAt;render(elapsed);if(elapsed>=duration)finishStory();else raf=requestAnimationFrame(tick);}
async function play(chapter=chapterId){
 if(chapter!==chapterId)return false;
 const serial=++playSerial;playing=false;cancelAnimationFrame(raf);clearTimeout(nextTimer);next.hidden=true;skip.hidden=true;
 try{await Promise.all([...phone.querySelectorAll('img')].map(image=>image.decode()));}
 catch(e){if(serial===playSerial){error.textContent='圖片載入失敗：'+e.message;error.hidden=false;begin.hidden=false;}return false;}
 if(serial!==playSerial)return false;
 error.hidden=true;completed=false;begin.hidden=true;skip.hidden=!hasSeen();playing=true;startedAt=performance.now();render(0);raf=requestAnimationFrame(tick);return true;
}
startButton.onclick=()=>play();
document.getElementById('replay').onclick=()=>play();
skip.onclick=()=>{if(!skip.hidden&&hasSeen()){++playSerial;finishStory(true);}};
next.onclick=()=>completeStory();
window.addEventListener('pagehide',()=>{++playSerial;playing=false;cancelAnimationFrame(raf);clearTimeout(nextTimer);});
if(new URLSearchParams(location.search).has('embed'))document.getElementById('chapters').hidden=true;
render(0);
