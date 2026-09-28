const previewMode=new URLSearchParams(location.search).has('preview');
if(new URLSearchParams(location.search).has('embed'))document.querySelector('#chapters').hidden=true;
// Shared playback controls; each page supplies render() and optional resetChapter().
const chapterNumber=Number(document.body.dataset.storyChapter);
const chapterPart=document.body.dataset.storyPart;
let activeChapter=`ch${chapterNumber}-${chapterPart}`;
let playbackEnd=chapters[activeChapter][1],start=0,raf=0,playId=0,lastElapsed=chapters[activeChapter][0];
let exploded=false,ch5BlastSound=-1,ch7VictoryPlayed=false;
let playing=false,ambienceStarted=false;
const gulls=document.querySelector('#gulls'),waves=document.querySelector('#waves'),explosion=document.querySelector('#explosion');
const snare=document.querySelector('#snare'),ch7Music=document.querySelector('#ch7-music'),ch7Victory=document.querySelector('#ch7-victory');
const ch8Music=document.querySelector('#ch8-music');
if(ch8Music&&!previewMode)ch8Music.src=ch8Music.dataset.src;
const sounds=[...document.querySelectorAll('audio')];
const images=[...phone.querySelectorAll('img')];
const error=document.querySelector('#error');
const skipButton=document.createElement('button');
skipButton.id='story-skip';skipButton.type='button';skipButton.textContent='Skip';skipButton.hidden=true;
phone.append(skipButton);
const nextButton=document.createElement('button');
nextButton.id='story-next';nextButton.type='button';nextButton.textContent='Next';nextButton.hidden=true;
phone.append(nextButton);
let nextTimer=0,awaitingNext=false;
const seenKey=chapter=>`pinball-pirate-story-seen-v1:${chapter}`;
function hasSeen(chapter){try{return localStorage.getItem(seenKey(chapter))==='1';}catch{return false;}}
function markSeen(chapter){try{localStorage.setItem(seenKey(chapter),'1');}catch{}}
function showError(message){error.textContent=message;error.hidden=false;}
function stopSounds(){for(const sound of sounds)sound.pause();}
function requestPlayback(){
 playing=false;++playId;cancelAnimationFrame(raf);raf=0;stopSounds();
 if(nextTimer){clearTimeout(nextTimer);nextTimer=0;}
 skipButton.hidden=true;nextButton.hidden=true;error.hidden=true;
 document.querySelector('#begin').hidden=false;
}
function playSound(sound,volume){
 if(!sound)return;
 const id=playId;
 const warn=()=>{if(id===playId&&playing&&!previewMode)requestPlayback();};
 try{sound.currentTime=0;sound.volume=volume;Promise.resolve(sound.play()).catch(warn);}catch{warn();}
}
function draw(elapsed){lastElapsed=Math.min(elapsed,playbackEnd-.01);render(lastElapsed);}
function completeStory(skipped=false){
 if(nextTimer){clearTimeout(nextTimer);nextTimer=0;}
 awaitingNext=false;nextButton.hidden=true;
 window.dispatchEvent(new CustomEvent('story:complete',{detail:{chapter:activeChapter,...(skipped?{skipped:true}:{})}}));
}
function finishStory(skipped=false){
 playing=false;stopSounds();raf=0;skipButton.hidden=true;draw(playbackEnd-.01);
 if(!skipped)markSeen(activeChapter);
 if(activeChapter.endsWith('-end')){
  awaitingNext=true;nextButton.hidden=false;
  nextTimer=setTimeout(()=>completeStory(skipped),10000);
 }else completeStory(skipped);
}
function playEffects(elapsed){
 if(!previewMode&&!ambienceStarted&&elapsed>=timing.birds&&activeChapter!=='ch7-start'&&activeChapter!=='ch8-end'){
  ambienceStarted=true;playSound(waves,.6);
 }
 if(activeChapter==='ch7-end'&&!ch7VictoryPlayed&&elapsed>=ch7EndStart+10200){
  ch7VictoryPlayed=true;playSound(ch7Victory,.85);
 }
 if([5,6,7,8].includes(chapterNumber)&&activeChapter.endsWith('-end')){
  const blastStart=chapters[activeChapter][0],index=Math.floor((elapsed-blastStart-1000)/800);
  if(index>=0&&index<3&&index>ch5BlastSound){ch5BlastSound=index;playSound(explosion,chapterNumber===8?1:.85);}
 }
 if(chapterNumber===2&&!exploded&&elapsed>=scene5Start+3000&&elapsed<stage2EndStart){
  exploded=true;playSound(explosion,.85);
 }
}
function tick(now){
 const elapsed=now-start;
 draw(elapsed);
 playEffects(elapsed);
 gulls.volume=.7*clamp(elapsed/350,0,1)*clamp((timing.birds-elapsed)/600,0,1);
 waves.volume=(activeChapter==='ch7-start'?0:.6)*clamp((elapsed-timing.birds)/900,0,1)*clamp((playbackEnd-elapsed)/1500,0,1);
 if(elapsed>=timing.birds)gulls.pause();
 if(elapsed>=playbackEnd){
  finishStory();
  return;
 }
 raf=requestAnimationFrame(tick);
}
async function play(chapter=activeChapter){
 if(previewMode)return false;
 if(chapter!==`ch${chapterNumber}-${chapterPart}`||!chapters[chapter])return false;
 const missing=images.find(image=>!image.complete||!image.naturalWidth);
 if(missing){showError(`圖片尚未載入：${missing.getAttribute('src')}`);return false;}
 const id=++playId;
 cancelAnimationFrame(raf);raf=0;stopSounds();skipButton.hidden=true;nextButton.hidden=true;awaitingNext=false;if(nextTimer){clearTimeout(nextTimer);nextTimer=0;}
 activeChapter=chapter;const [offset,stop]=chapters[chapter];playbackEnd=stop;
 error.hidden=true;playing=false;ambienceStarted=false;exploded=false;ch5BlastSound=-1;ch7VictoryPlayed=false;
 document.querySelector('#begin').hidden=true;
 // Authorize every ending's media before starting the single animation clock.
 // A tap retries these same elements; rejected or stalled media shows only Play.
 if(chapterPart==='end'){
  let timeout;
  try{
   await Promise.race([
    Promise.all(sounds.map(sound=>{sound.volume=0;return sound.play();})),
    new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('Media start timed out')),3000);})
   ]);
  }catch{if(id===playId)requestPlayback();return false;}
  finally{clearTimeout(timeout);}
  if(id!==playId)return false;
  stopSounds();
 }
 playing=true;
 if(typeof resetChapter==='function')resetChapter();
 for(const sound of sounds)sound.volume=0;
 document.querySelectorAll('[data-chapter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.chapter===chapter)));
 document.querySelector('#begin').hidden=true;
 draw(offset);
 // The animation clock starts immediately; audio never gates or extends it.
 start=performance.now()-offset;draw(offset);skipButton.hidden=!hasSeen(chapter);
 raf=requestAnimationFrame(tick);
 if(chapter==='ch7-start'&&!ch7PreviewThird)playSound(ch7Music,.8);
 else if(chapter==='ch8-end')playSound(ch8Music,1);
 else if(offset<timing.birds)playSound(gulls,.7);
 playEffects(offset);
 return true;
}
skipButton.addEventListener('click',()=>{
 if(skipButton.hidden||!hasSeen(activeChapter))return;
 ++playId;cancelAnimationFrame(raf);raf=0;stopSounds();skipButton.hidden=true;
 finishStory(true);
});
nextButton.addEventListener('click',()=>{if(awaitingNext)completeStory();});
document.querySelector('#start').addEventListener('click',()=>play());
document.querySelector('#replay').addEventListener('click',()=>play());
document.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>play(button.dataset.chapter)));
window.addEventListener('resize',()=>draw(lastElapsed));
window.addEventListener('pagehide',()=>{++playId;cancelAnimationFrame(raf);if(nextTimer)clearTimeout(nextTimer);stopSounds();});
for(const image of images)image.addEventListener('error',()=>showError(`圖片載入失敗：${image.getAttribute('src')}`));
Promise.all(images.map(image=>image.decode())).then(()=>{if(!playId&&!previewMode)draw(chapters[activeChapter][0]);}).catch(()=>showError('章節圖片載入失敗，請確認素材路徑。'));

// The tools page owns the clock and music; normal chapter playback is unchanged.
if(previewMode){
 const [offset,stop]=chapters[activeChapter];
 const seekable=activeChapter!=='ch4-end';
 const style=document.createElement('style');
 style.textContent='#begin,#replay,#credits,#chapters{display:none!important}';document.head.append(style);
 window.storyPreview={
  duration:(stop-offset)/1000,seekable,
  cues:[...document.querySelectorAll('#story-cues [data-start][data-end]')].map(el=>({start:Number(el.dataset.start),end:Number(el.dataset.end),label:el.textContent.trim()})).filter(cue=>Number.isFinite(cue.start)&&Number.isFinite(cue.end)&&cue.start>=0&&cue.end>cue.start&&cue.label).sort((a,b)=>a.start-b.start),
  ready:Promise.all(images.map(image=>image.decode())),
  draw(seconds){if(seekable)draw(offset+Math.min(seconds*1000,stop-offset-.01));},
  pause:stopSounds,
  seek(seconds){
   stopSounds();
   const elapsed=offset+seconds*1000;
   ch5BlastSound=Math.floor((seconds*1000-1000)/800);
   exploded=elapsed>=scene5Start+3000;
   ch7VictoryPlayed=elapsed>=ch7EndStart+10200;
   if(typeof resetChapter==='function'&&chapterNumber!==4)resetChapter();
  },
  advance(seconds){playEffects(offset+Math.min(seconds*1000,stop-offset-.01));}
 };
}

// postMessage also works when the preview and chapter are opened as local files.
if(previewMode)window.addEventListener('message',async event=>{
 if(event.source!==parent||event.data?.channel!=='story-music-preview')return;
 const {command,token,seconds}=event.data;
 if(command==='init'){
  try{await window.storyPreview.ready;parent.postMessage({channel:'story-music-preview',type:'ready',token,duration:window.storyPreview.duration,seekable:window.storyPreview.seekable,cues:window.storyPreview.cues},'*');}
  catch{parent.postMessage({channel:'story-music-preview',type:'error',token},'*');}
  return;
 }
 if(command==='pause'){window.storyPreview.pause();return;}
 if(!Number.isFinite(seconds))return;
 if(command==='draw')window.storyPreview.draw(seconds);
 if(command==='seek')window.storyPreview.seek(seconds);
 if(command==='advance')window.storyPreview.advance(seconds);
});
