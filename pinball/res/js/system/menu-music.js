/* Menu music: preserve playback and the ten-second repeat gap while suspended. */
(function(root){
'use strict';
function createMenuMusic(src){
 const audio=new Audio(src);audio.preload='metadata';audio.loop=false;
 let enabled=false,disposed=false,timer=null,due=0,remaining=null;
 function pause(){
  audio.pause();if(timer!==null){remaining=Math.max(0,due-performance.now());clearTimeout(timer);timer=null;}
 }
 function start(){
  if(!enabled||disposed)return;
  if(remaining!==null){if(timer!==null)return;due=performance.now()+remaining;timer=setTimeout(()=>{timer=null;remaining=null;audio.currentTime=0;start();},remaining);return;}
  if(audio.paused)audio.play().catch(()=>{}); // Retry on a user gesture if autoplay is blocked.
 }
 audio.addEventListener('ended',()=>{remaining=10000;start();});
 function gesture(){start();}
 document.addEventListener('pointerup',gesture);document.addEventListener('keydown',gesture);
 return {audio,stop(){enabled=false;pause();remaining=null;audio.currentTime=0;},setEnabled(value){enabled=!!value;if(enabled)start();else pause();},dispose(){disposed=true;enabled=false;pause();document.removeEventListener('pointerup',gesture);document.removeEventListener('keydown',gesture);audio.removeAttribute('src');audio.load();}};
}
function createMenuMixer(sources,initial){
 const tracks=Object.fromEntries(Object.entries(sources).map(([key,src])=>[key,createMenuMusic(src)]));
 let selected=initial,enabled=false,fade=null,raf=null,last=0,volume=1;
 const levels=Object.fromEntries(Object.keys(tracks).map(key=>[key,key===selected?1:0]));
 function applyVolume(){for(const [key,track] of Object.entries(tracks))track.audio.volume=levels[key]*volume;}
 function tick(time){
  if(!enabled||!fade)return;const dt=Math.max(0,time-last);last=time;fade.elapsed+=dt;
  for(const [key,track] of Object.entries(tracks)){
   const duration=key===selected?1000:800,p=Math.min(1,fade.elapsed/duration),target=key===selected?1:0;
   levels[key]=fade.start[key]+(target-fade.start[key])*p;
   if(key!==selected&&p===1)track.stop();
  }
  applyVolume();
  if(fade.elapsed>=1000){fade=null;raf=null;}else raf=requestAnimationFrame(tick);
 }
 function sync(){for(const [key,track] of Object.entries(tracks))track.setEnabled(enabled&&(key===selected||!!fade&&fade.start[key]>0&&fade.elapsed<800));}
 applyVolume();
 return {setEnabled(value){if(enabled===!!value)return;enabled=!!value;sync();if(raf!==null)cancelAnimationFrame(raf);raf=null;if(enabled&&fade){last=performance.now();raf=requestAnimationFrame(tick);}},
  setVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));applyVolume();},
  select(key){if(key===selected)return;if(!tracks[key])throw Error('Unknown music');if(raf!==null)cancelAnimationFrame(raf);raf=null;
   tracks[key].stop();levels[key]=0;selected=key;applyVolume();
   if(enabled){fade={elapsed:0,start:{...levels}};sync();last=performance.now();raf=requestAnimationFrame(tick);}
   else{fade=null;for(const [k,t] of Object.entries(tracks)){t.stop();levels[k]=k===selected?1:0;}applyVolume();}
  },dispose(){if(raf!==null)cancelAnimationFrame(raf);for(const track of Object.values(tracks))track.dispose();}};
}
root.createMenuMusic=createMenuMusic;root.createMenuMixer=createMenuMixer;
})(globalThis);
