/* Shared chrome geometry and controls; Space supplies its own score-bar skin. */
const PlayFrame={
 legacyNames:new Set(['score-bar.png','pirate-score-bar.png','space-system-score-bar.png','system-marker-sound.png','system-marker-settings.png','system-marker-back.png']),
 isFrameArt(item){return this.legacyNames.has(item?.src?.split('/').pop());},
 createArt(theme){
  const space=['space','sci-fi','cosmic-dessert'].includes(theme);
  const common={angle:0,opacity:1,frames:1,frameAxis:'x',state:'static',bind:''};
  return [
   {id:'frame-score',src:space?'res/img/space/space-system-score-bar.png':'res/img/score-bar.png',x:180,y:-157,width:370,height:123,crop:[0,0,370,124],plane:'background'},
   {id:'frame-sound',src:'res/img/system-marker-sound.png',x:269,y:-156,width:30,height:30,crop:[0,0,49,48],plane:'lower'},
   {id:'frame-settings',src:'res/img/system-marker-settings.png',x:301,y:-155,width:31,height:30,crop:[0,0,49,46],plane:'lower'},
   {id:'frame-back',src:'res/img/system-marker-back.png',x:332,y:-155,width:31,height:30,crop:[0,0,49,46],plane:'lower'}
  ].map(item=>({...common,...item}));
 },
 theaterBounds(top){const scoreHeight=30;return {width:360,scoreHeight,y:top+scoreHeight,height:Math.max(0,-top-scoreHeight)};}
};
if(typeof module!=='undefined'&&module.exports)module.exports=PlayFrame;
