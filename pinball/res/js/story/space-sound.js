'use strict';
// The scene clock owns these clips, including loops and resumed playback.
class SpaceStorySoundtrack{
 constructor(config,{hosted=false}={}){
  this.config=config;this.hosted=hosted;this.active=new Map();this.time=0;
  this.enabled=true;this.volume=1;this.suspended=false;
  if(!hosted)try{
   this.enabled=localStorage.getItem('pinball-sound')!=='off';
   const saved=localStorage.getItem('pinball-volume');
   if(saved!==null&&Number.isFinite(Number(saved)))this.volume=Math.max(0,Math.min(1,Number(saved)));
  }catch{}
 }
 stop(){for(const entry of this.active.values()){entry.audio.pause();entry.audio.removeAttribute('src');entry.audio.load();}this.active.clear();}
 pause(){for(const entry of this.active.values())entry.audio.pause();}
 unlock(){for(const entry of this.active.values())entry.blocked=false;}
 sync(time,playing){
  this.time=time;
  if(!playing||!this.enabled||this.suspended){this.pause();return;}
  const wanted=new Set();
  for(let i=0;i<this.config.events.length;i++){
   const cue=this.config.events[i];
   if(time<cue.at||time>=cue.at+cue.duration)continue;
   wanted.add(i);
   let entry=this.active.get(i);
   if(!entry){
    const audio=new Audio(this.config.clips[cue.sound].src);audio.preload='auto';audio.loop=!!cue.loop;
    entry={audio,cue,blocked:false,pending:false};this.active.set(i,entry);
   }
   const {audio}=entry,elapsed=time-cue.at;
   const fade=Math.min(1,elapsed/.08,(cue.duration-elapsed)/.18);
   audio.volume=cue.volume*this.volume*Math.max(0,fade);
   if(Number.isFinite(audio.duration)&&audio.duration>0){
    const offset=cue.loop?elapsed%audio.duration:Math.min(elapsed,audio.duration);
    if(!cue.loop&&offset>=audio.duration){audio.pause();continue;}
    if(Math.abs(audio.currentTime-offset)>.25)audio.currentTime=offset;
   }
   if(audio.paused&&!entry.pending&&!entry.blocked&&!audio.ended){
    entry.pending=true;
    audio.play().catch(error=>{entry.blocked=error.name==='NotAllowedError';}).finally(()=>{entry.pending=false;});
   }
  }
  for(const [key,entry] of this.active)if(!wanted.has(key)){
   entry.audio.pause();entry.audio.removeAttribute('src');entry.audio.load();this.active.delete(key);
  }
 }
}
