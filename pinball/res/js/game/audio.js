/* Shared sound player. HTMLAudio keeps direct file:// playtests supported. */
(function(root){
'use strict';
class SoundBank {
 constructor(clips,{AudioClass=root.Audio,now=()=>performance.now(),synth=false,AudioContextClass=root.AudioContext||root.webkitAudioContext}={}){
  this.enabled=true;this.paused=false;this.unlocked=false;this.now=now;this.clips=new Map();
  this.synthEnabled=synth;this.AudioContextClass=AudioContextClass;this.synthContext=null;this.synthVoices=new Set();
  for(const [name,clip] of Object.entries(clips)){
   const voices=Array.from({length:clip.voices||3},()=>{const audio=new AudioClass(clip.src);audio.preload='auto';audio.volume=clip.volume??1;return {audio,token:0};});
   this.clips.set(name,{...clip,voices,last:-Infinity,next:0});
  }
 }
 unlock(){
  if(this.unlocked)return;this.unlocked=true;
  if(this.synthEnabled&&this.AudioContextClass){try{this.synthContext=new this.AudioContextClass();this.synthContext.resume().catch(()=>{});}catch{}}
  // Warm the actual reusable elements during the input gesture (mobile audio).
  for(const clip of this.clips.values())for(const voice of clip.voices){
   const token=++voice.token;voice.audio.volume=0;
   Promise.resolve(voice.audio.play()).then(()=>{
    if(voice.token!==token)return;voice.audio.pause();voice.audio.currentTime=0;voice.audio.volume=clip.volume??1;
   }).catch(()=>{if(voice.token===token)voice.audio.volume=clip.volume??1;});
  }
 }
 play(name){
  if(name==='space-beam')return this.playBeam();
  const clip=this.clips.get(name),time=this.now();
  if(!clip||!this.enabled||this.paused||!this.unlocked||time-clip.last<(clip.interval??0))return false;
  clip.last=time;
  const voice=clip.voices.find(v=>v.audio.paused||v.audio.ended)||clip.voices[clip.next++%clip.voices.length];
  voice.token++;voice.audio.pause();voice.audio.currentTime=0;voice.audio.volume=clip.volume??1;
  Promise.resolve(voice.audio.play()).catch(()=>{});return true;
 }
 // Keep a finite mechanism recording aligned to its animation, including resume.
 sync(name,position,active){
  const clip=this.clips.get(name);if(!clip)return;
  const voice=clip.voices[0],audio=voice.audio;
  if(!active||!this.enabled||this.paused||!this.unlocked){if(!audio.paused){voice.token++;audio.pause();}return;}
  if(audio.paused||Math.abs(audio.currentTime-position)>.15){voice.token++;audio.currentTime=position;audio.volume=clip.volume??1;Promise.resolve(audio.play()).catch(()=>{});}
 }
 playBeam(){
  const context=this.synthContext;if(!context||!this.enabled||this.paused||!this.unlocked)return false;
  const at=context.currentTime,oscillator=context.createOscillator(),gain=context.createGain(),filter=context.createBiquadFilter();
  oscillator.type='sawtooth';oscillator.frequency.setValueAtTime(1700,at);oscillator.frequency.exponentialRampToValueAtTime(220,at+.075);
  filter.type='lowpass';filter.frequency.setValueAtTime(3500,at);filter.frequency.exponentialRampToValueAtTime(500,at+.08);
  gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.07,at+.004);gain.gain.exponentialRampToValueAtTime(.0001,at+.08);
  oscillator.connect(filter);filter.connect(gain);gain.connect(context.destination);this.synthVoices.add(oscillator);
  oscillator.onended=()=>{this.synthVoices.delete(oscillator);oscillator.disconnect();filter.disconnect();gain.disconnect();};
  oscillator.start(at);oscillator.stop(at+.085);return true;
 }
 stop(){for(const voice of this.synthVoices)voice.stop();this.synthVoices.clear();for(const clip of this.clips.values()){clip.last=-Infinity;for(const voice of clip.voices){voice.token++;voice.audio.pause();voice.audio.currentTime=0;}}}
 setEnabled(enabled){this.enabled=!!enabled;if(!this.enabled)this.stop();}
 setPaused(paused){if(this.paused===!!paused)return;this.paused=!!paused;if(this.paused)this.stop();}
}
if(typeof module!=='undefined'&&module.exports)module.exports=SoundBank;else root.PinballSound=SoundBank;
})(typeof window!=='undefined'?window:globalThis);
