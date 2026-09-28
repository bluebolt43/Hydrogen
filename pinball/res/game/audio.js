/* Shared sound player. HTMLAudio keeps direct file:// playtests supported. */
(function(root){
'use strict';
class SoundBank {
 constructor(clips,{AudioClass=root.Audio,now=()=>performance.now()}={}){
  this.enabled=true;this.paused=false;this.unlocked=false;this.now=now;this.clips=new Map();
  for(const [name,clip] of Object.entries(clips)){
   const voices=Array.from({length:clip.voices||3},()=>{const audio=new AudioClass(clip.src);audio.preload='auto';audio.volume=clip.volume??1;return {audio,token:0};});
   this.clips.set(name,{...clip,voices,last:-Infinity,next:0});
  }
 }
 unlock(){
  if(this.unlocked)return;this.unlocked=true;
  // Warm the actual reusable elements during the input gesture (mobile audio).
  for(const clip of this.clips.values())for(const voice of clip.voices){
   const token=++voice.token;voice.audio.volume=0;
   Promise.resolve(voice.audio.play()).then(()=>{
    if(voice.token!==token)return;voice.audio.pause();voice.audio.currentTime=0;voice.audio.volume=clip.volume??1;
   }).catch(()=>{if(voice.token===token)voice.audio.volume=clip.volume??1;});
  }
 }
 play(name){
  const clip=this.clips.get(name),time=this.now();
  if(!clip||!this.enabled||this.paused||!this.unlocked||time-clip.last<(clip.interval??0))return false;
  clip.last=time;
  const voice=clip.voices.find(v=>v.audio.paused||v.audio.ended)||clip.voices[clip.next++%clip.voices.length];
  voice.token++;voice.audio.pause();voice.audio.currentTime=0;voice.audio.volume=clip.volume??1;
  Promise.resolve(voice.audio.play()).catch(()=>{});return true;
 }
 stop(){for(const clip of this.clips.values()){clip.last=-Infinity;for(const voice of clip.voices){voice.token++;voice.audio.pause();voice.audio.currentTime=0;}}}
 setEnabled(enabled){this.enabled=!!enabled;if(!this.enabled)this.stop();}
 setPaused(paused){if(this.paused===!!paused)return;this.paused=!!paused;if(this.paused)this.stop();}
}
if(typeof module!=='undefined'&&module.exports)module.exports=SoundBank;else root.PinballSound=SoundBank;
})(typeof window!=='undefined'?window:globalThis);
