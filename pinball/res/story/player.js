const previewMode=new URLSearchParams(location.search).has('preview');
if(new URLSearchParams(location.search).has('embed'))document.querySelector('#chapters').hidden=true;
// Shared playback controls; each page supplies render() and optional resetChapter().
const chapterNumber=Number(document.body.dataset.storyChapter);
const chapterPart=document.body.dataset.storyPart;
let activeChapter=`ch${chapterNumber}-${chapterPart}`;
let playbackEnd=chapters[activeChapter][1],start=0,raf=0,playId=0,lastElapsed=chapters[activeChapter][0];
let exploded=false,ch5BlastSound=-1,ch7VictoryPlayed=false;
const gulls=document.querySelector('#gulls'),waves=document.querySelector('#waves'),explosion=document.querySelector('#explosion');
const snare=document.querySelector('#snare'),ch7Music=document.querySelector('#ch7-music'),ch7Victory=document.querySelector('#ch7-victory');
const ch8Music=document.querySelector('#ch8-music');
let ch8MusicUrl='';
// Fully load Ogg so its offset and duration also work on servers without Range support.
const ch8MusicReady=ch8Music&&!previewMode?(async()=>{
 let source=ch8Music.dataset.src;
 if(location.protocol!=='file:'){
  const response=await fetch(source);
  if(!response.ok)throw new Error(`Ending music: ${response.status}`);
  ch8MusicUrl=URL.createObjectURL(await response.blob());source=ch8MusicUrl;
 }
 await new Promise((resolve,reject)=>{
  ch8Music.addEventListener('loadedmetadata',resolve,{once:true});
  ch8Music.addEventListener('error',reject,{once:true});
  ch8Music.src=source;
 });
})():null;
if(ch8MusicReady)ch8MusicReady.catch(()=>{});
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
function draw(elapsed){lastElapsed=Math.min(elapsed,playbackEnd-.01);render(lastElapsed);}
function completeStory(skipped=false){
 if(nextTimer){clearTimeout(nextTimer);nextTimer=0;}
 awaitingNext=false;nextButton.hidden=true;
 window.dispatchEvent(new CustomEvent('story:complete',{detail:{chapter:activeChapter,...(skipped?{skipped:true}:{})}}));
}
function finishStory(skipped=false){
 stopSounds();raf=0;skipButton.hidden=true;draw(playbackEnd-.01);
 if(!skipped)markSeen(activeChapter);
 if(activeChapter.endsWith('-end')){
  awaitingNext=true;nextButton.hidden=false;
  nextTimer=setTimeout(()=>completeStory(skipped),10000);
 }else completeStory(skipped);
}
function playEffects(elapsed){
 if(activeChapter==='ch7-end'&&!ch7VictoryPlayed&&elapsed>=ch7EndStart+10200){
  ch7VictoryPlayed=true;ch7Victory.currentTime=0;ch7Victory.volume=.85;ch7Victory.play().catch(()=>{});
 }
 if([5,6,7,8].includes(chapterNumber)&&activeChapter.endsWith('-end')){
  const blastStart=chapters[activeChapter][0],index=Math.floor((elapsed-blastStart-1000)/800);
  if(index>=0&&index<3&&index>ch5BlastSound){ch5BlastSound=index;explosion.currentTime=0;explosion.volume=chapterNumber===8?1:.85;explosion.play().catch(()=>{});}
 }
 if(chapterNumber===2&&!exploded&&elapsed>=scene5Start+3000&&elapsed<stage2EndStart){
  exploded=true;explosion.currentTime=0;explosion.volume=.85;explosion.play().catch(()=>showError('爆破音效無法播放，請按重播再試一次。'));
 }
}
function tick(now){
 const elapsed=activeChapter==='ch8-end'&&ch8Music
  ? (ch8Music.ended?Math.max(ch8End+ch8Music.currentTime*1000,now-start):ch8End+ch8Music.currentTime*1000)
  :activeChapter==='ch7-start'&&!ch7PreviewThird
  ? (ch7Music.ended?Math.max(ch7Start+ch7Music.currentTime*1000,now-start):ch7Start+ch7Music.currentTime*1000):now-start;
 draw(elapsed);
 playEffects(elapsed);
 gulls.volume=.7*clamp(elapsed/350,0,1)*clamp((timing.birds-elapsed)/600,0,1);
 waves.volume=(activeChapter==='ch7-start'?0:.6)*clamp((elapsed-timing.birds)/900,0,1)*clamp((playbackEnd-elapsed)/1500,0,1);
 if(elapsed>=timing.birds)gulls.pause();
 if(elapsed>=playbackEnd&&(activeChapter!=='ch8-end'||!ch8Music||ch8Music.ended)){
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
 error.hidden=true;exploded=false;ch5BlastSound=-1;ch7VictoryPlayed=false;
 if(typeof resetChapter==='function')resetChapter();
 for(const sound of sounds){sound.currentTime=0;sound.volume=0;}
 document.querySelectorAll('[data-chapter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.chapter===chapter)));
 document.querySelector('#begin').hidden=true;
 draw(offset);
 const useMusic=chapter==='ch7-start'&&!ch7PreviewThird;
 const useEndingMusic=chapter==='ch8-end'&&ch8Music;
 if(useEndingMusic){
  try{await ch8MusicReady;}catch{
   if(id!==playId)return;
   showError('結尾配樂載入失敗，請確認音訊檔案後再按播放。');document.querySelector('#begin').hidden=false;return false;
  }
  if(id!==playId)return;
  ch8Music.currentTime=0;ch8Music.volume=1;
  playbackEnd=Math.max(stop,offset+ch8Music.duration*1000);
 }
 if(ch7Music)ch7Music.volume=useMusic?.8:0;
 const toPlay=useEndingMusic?[ch8Music,explosion]:useMusic?[ch7Music]:[gulls,waves,explosion,...(chapter==='ch4-end'?[snare]:[]),...(chapter==='ch7-end'?[ch7Victory]:[])];
 const results=await Promise.allSettled(toPlay.map(sound=>sound.play()));
 if(id!==playId)return;
 for(const sound of [explosion,ch7Victory,snare].filter(Boolean)){sound.pause();sound.currentTime=0;}
 if(results.some(result=>result.status==='rejected')){stopSounds();showError('音效無法播放，請確認音效檔案完整後再按播放。');document.querySelector('#begin').hidden=false;return false;}
 start=performance.now()-offset;draw(offset);skipButton.hidden=!hasSeen(chapter);raf=requestAnimationFrame(tick);return true;
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
window.addEventListener('pagehide',event=>{if(ch8MusicUrl&&!event.persisted)URL.revokeObjectURL(ch8MusicUrl);});
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
