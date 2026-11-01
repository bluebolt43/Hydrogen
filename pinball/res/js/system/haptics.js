/* Shared game events -> optional Android haptics. No bridge means no vibration. */
(function(root){
'use strict';
function create({bridge,storage,now=()=>performance.now(),foreground=()=>true}){
 const priorities={tap:1,hit:2,launch:3,reward:4,attack:4,drain:5};
 const events={'score':'hit','score-hit':'hit','slingshot-hit':'hit','flipper-hit':'tap',
  launch:'launch',release:'launch',kickback:'launch',capture:'tap',
  'configured-attack':'attack','target-group-complete':'reward','multiball-awarded':'reward',
  'extra-life-awarded':'reward',drain:'drain','game-over':'drain'};
 let enabled=true,last=-Infinity,priority=0;
 try{enabled=storage?.getItem('pinball-haptics')!=='off';}catch{}
 const available=()=>typeof bridge()?.postMessage==='function';
 function stop(){try{bridge()?.postMessage('stop');}catch{}}
 function play(kind){
  if(!enabled||!foreground()||!available()||!Object.hasOwn(priorities,kind))return false;
  const time=now(),next=priorities[kind];
  if(time-last<90&&next<=priority)return false;
  try{bridge().postMessage(kind);last=time;priority=next;return true;}catch{return false;}
 }
 return Object.freeze({available,get enabled(){return enabled;},play,stop,
  setEnabled(value){enabled=!!value;try{storage?.setItem('pinball-haptics',enabled?'on':'off');}catch{}if(!enabled)stop();},
  onEvent(event,game){if(!game?.paused&&events[event.type])return play(events[event.type]);return false;}
 });
}
if(typeof module!=='undefined'&&module.exports){module.exports={create};return;}
if(root.PinballHaptics)return;
let storage;try{storage=root.localStorage;}catch{}
root.PinballHaptics=create({bridge:()=>root.AndroidHaptics,storage,foreground:()=>!root.document.hidden});
root.document.addEventListener('visibilitychange',()=>{if(root.document.hidden)root.PinballHaptics.stop();});
})(globalThis);
