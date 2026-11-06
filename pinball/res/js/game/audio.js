/* Shared sound player. HTMLAudio keeps direct file:// playtests supported. */
(function(root){
'use strict';
class SoundBank {
 constructor(clips,{AudioClass=root.Audio,now=()=>performance.now(),synth=false,AudioContextClass=root.AudioContext||root.webkitAudioContext,buffered=/^https?:$/.test(root.location?.protocol),fetcher=root.fetch?.bind(root),audioSession=root.navigator?.audioSession}={}){
  this.enabled=true;this.paused=false;this.unlocked=false;this.now=now;this.clips=new Map();
  this.synthEnabled=synth;this.AudioContextClass=AudioContextClass;this.synthContext=null;this.synthVoices=new Set();
  this.buffered=buffered;this.fetcher=fetcher;this.bufferContext=null;this.outputGain=null;this.volume=1;this.loadErrors=[];this.destroyed=false;
  this.audioSession=audioSession;this.previousSessionType=null;this.sessionError=null;
  for(const [name,clip] of Object.entries(clips)){
   const voices=Array.from({length:clip.voices||3},()=>{const audio=new AudioClass(clip.src);audio.preload='auto';audio.volume=clip.volume??1;return {audio,token:0};});
   this.clips.set(name,{...clip,voices,last:-Infinity,next:0});
  }
 }
 // Decode short effects once during loading, never from a collision callback.
 prepare(){
  if(this.preparation)return this.preparation;
  this.preparation=this.prepareBuffers();return this.preparation;
 }
 async prepareBuffers(){
  if(!this.buffered||!this.AudioContextClass||!this.fetcher||this.destroyed)return false;
  try{this.bufferContext=new this.AudioContextClass();this.outputGain=this.bufferContext.createGain();this.outputGain.gain.value=this.volume;this.outputGain.connect(this.bufferContext.destination);}catch(error){this.loadErrors.push(String(error));return false;}
  const pending=new Map();
  await Promise.all([...this.clips.values()].filter(clip=>!clip.stream).map(async clip=>{
   const src=clip.voices[0].audio.src;
   if(!pending.has(src))pending.set(src,(async()=>{const response=await this.fetcher(src);if(!response.ok)throw Error('Audio fetch failed: '+src);return this.bufferContext.decodeAudioData(await response.arrayBuffer());})());
   try{const buffer=await pending.get(src);if(!this.destroyed){clip.buffer=buffer;clip.bufferVoices=new Set();}}catch(error){this.loadErrors.push(String(error));}
  }));
  return !this.destroyed&&[...this.clips.values()].some(clip=>clip.buffer);
 }
 get backend(){const clips=[...this.clips.values()].filter(clip=>!clip.stream),count=clips.filter(clip=>clip.buffer).length;return count===clips.length&&count?'webaudio':count?'mixed':'htmlaudio';}
 resumeContext(context){if(context&&context.state!=='closed'&&context.state!=='running')Promise.resolve(context.resume()).catch(()=>{});}
 unlock(){
  if(this.destroyed)return;
  // Safari's default Web Audio session can be silent under the ringer switch,
  // unlike HTMLAudio. Declare media playback before resuming from the gesture.
  if((this.buffered||this.synthEnabled)&&this.audioSession)try{if(this.audioSession.type!=='playback'){this.previousSessionType??=this.audioSession.type;this.audioSession.type='playback';}}catch(error){this.sessionError=String(error);}
  this.resumeContext(this.bufferContext);this.resumeContext(this.synthContext);
  if(this.unlocked)return;this.unlocked=true;
  if(this.synthEnabled&&this.AudioContextClass){try{this.synthContext=new this.AudioContextClass();this.synthContext.resume().catch(()=>{});}catch{}}
  // iOS may ignore volume writes. Mute and stop within the gesture instead
  // of leaving every effect playing until its play promise settles.
  for(const clip of this.clips.values()){if(clip.buffer)continue;for(const voice of clip.voices){
   const audio=voice.audio,muted=audio.muted;voice.token++;
   try{audio.muted=true;Promise.resolve(audio.play()).catch(()=>{});}
   finally{audio.pause();audio.currentTime=0;audio.muted=muted;}
  }}
 }
 play(name){
  if(name==='space-beam')return this.playBeam();
  const clip=this.clips.get(name),time=this.now();
  if(!clip||this.destroyed||!this.enabled||this.paused||!this.unlocked||time-clip.last<(clip.interval??0))return false;
  clip.last=time;
  if(clip.buffer){
   if(clip.bufferVoices.size>=clip.voices.length){const oldest=clip.bufferVoices.values().next().value;oldest.stop();oldest.onended();}
   const source=this.bufferContext.createBufferSource(),gain=this.bufferContext.createGain();source.buffer=clip.buffer;gain.gain.value=clip.volume??1;
   source.connect(gain);gain.connect(this.outputGain);clip.bufferVoices.add(source);
   source.onended=()=>{clip.bufferVoices.delete(source);source.disconnect();gain.disconnect();};source.start();return true;
  }
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
 stop(){for(const voice of this.synthVoices)voice.stop();this.synthVoices.clear();for(const clip of this.clips.values()){clip.last=-Infinity;if(clip.buffer){for(const source of clip.bufferVoices){source.stop();source.onended();}continue;}for(const voice of clip.voices){voice.token++;voice.audio.pause();voice.audio.currentTime=0;}}}
 setVolume(volume){if(!Number.isFinite(volume))return;this.volume=Math.max(0,Math.min(1,volume));if(this.outputGain)this.outputGain.gain.value=this.volume;}
 setEnabled(enabled){this.enabled=!!enabled;if(!this.enabled)this.stop();}
 setPaused(paused){if(this.paused===!!paused)return;this.paused=!!paused;if(this.paused)this.stop();}
 destroy(){if(this.destroyed)return;this.destroyed=true;this.stop();for(const clip of this.clips.values())clip.buffer=null;for(const context of new Set([this.bufferContext,this.synthContext]))if(context)Promise.resolve(context.close()).catch(()=>{});if(this.previousSessionType!==null&&this.audioSession?.type==='playback')try{this.audioSession.type=this.previousSessionType;}catch{}}
}
if(typeof module!=='undefined'&&module.exports)module.exports=SoundBank;else root.PinballSound=SoundBank;
})(typeof window!=='undefined'?window:globalThis);
