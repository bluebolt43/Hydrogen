/* Menu music: loop continuously and preserve playback position while suspended. */
(function(root){
'use strict';
function createMenuMusic(src){
 const audio=new Audio();audio.preload='none';audio.loop=true;
 let enabled=false,disposed=false,sourceAttached=false,pendingPlay=null,appliedVolume=null;
 function pause(){
  pendingPlay=null;audio.pause();
 }
 function start(){
  if(!enabled||disposed)return;
  if(!sourceAttached){audio.src=src;sourceAttached=true;}
  if(audio.paused&&!pendingPlay){
   const request=audio.play();pendingPlay=request;
   const settled=()=>{if(pendingPlay===request)pendingPlay=null;};
   Promise.resolve(request).then(settled,settled); // A later gesture may retry blocked playback.
  }
 }
 function gesture(){start();}
 document.addEventListener('pointerup',gesture);document.addEventListener('keydown',gesture);
 return {audio,
  setSource(value){if(value===src)return;pause();src=value;if(sourceAttached){audio.removeAttribute('src');audio.load();}sourceAttached=false;if(enabled)start();},
  play(){start();const request=pendingPlay;return request?Promise.resolve(request).then(()=>true,()=>false):Promise.resolve(!enabled||!audio.paused);},
  stop(){enabled=false;if(!sourceAttached)return;pause();audio.currentTime=0;},setEnabled(value){value=!!value;if(enabled===value)return;enabled=value;if(enabled)start();else pause();},setVolume(value){if(appliedVolume===value)return;appliedVolume=value;audio.volume=value;},dispose(){disposed=true;enabled=false;pause();document.removeEventListener('pointerup',gesture);document.removeEventListener('keydown',gesture);audio.removeAttribute('src');audio.load();}};
}
function createMenuMixer(sources,initial){
 const tracks=Object.fromEntries(Object.entries(sources).map(([key,src])=>[key,createMenuMusic(src)]));
 let selected=initial,enabled=false,fade=null,raf=null,last=0,volume=1;
 const levels=Object.fromEntries(Object.keys(tracks).map(key=>[key,key===selected?1:0]));
 function applyVolume(){for(const [key,track] of Object.entries(tracks))track.setVolume(levels[key]*volume);}
 function tick(time){
  if(!enabled||!fade)return;const dt=Math.max(0,time-last);last=time;fade.elapsed+=dt;
  for(const [key,track] of Object.entries(tracks)){
   const duration=key===selected?1000:800,p=Math.min(1,fade.elapsed/duration),target=key===selected?1:0;
   levels[key]=fade.start[key]+(target-fade.start[key])*p;
   if(key!==selected&&p===1&&fade.start[key]>0){track.stop();fade.start[key]=0;}
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
