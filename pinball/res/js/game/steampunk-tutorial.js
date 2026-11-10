// First-stage onboarding uses Pirate's input/spotlight flow with this table's rules.
const SteampunkTutorial={
 start(options){
  const {G,artLayers}=options;
  const objects=[...G.lower,...G.upper_parts,...(G.top_parts||[])];
  const bounds=o=>{const points=o.points||[o.center],xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return [Math.min(...xs)-14,Math.min(...ys)-14,Math.max(...xs)-Math.min(...xs)+28,Math.max(...ys)-Math.min(...ys)+28];};
  const attack=level=>()=>objects.filter(o=>G.mechanisms.attacks[o.id]===level).map(bounds);
  const group=action=>()=>{const ids=G.mechanisms.groups.filter(g=>g.action===action).flatMap(g=>g.targets);return objects.filter(o=>ids.includes(o.id)).map(bounds);};
  const artBounds=a=>{const angle=(a.angle||0)*Math.PI/180,w=Math.abs(a.width*Math.cos(angle))+Math.abs(a.height*Math.sin(angle)),h=Math.abs(a.width*Math.sin(angle))+Math.abs(a.height*Math.cos(angle));return [a.x-w/2-5,a.y-h/2-5,w+10,h+10];};
  const unlock=()=>{const ids=G.mechanisms.groups.filter(g=>g.action==='unblock').flatMap(g=>[...g.targets,...g.blockers]);return [...objects.filter(o=>ids.includes(o.id)).map(bounds),...artLayers.filter(a=>/steampunk-unlock-lights-/.test(a.src)).map(artBounds)];};
  const posts=()=>{const ids=G.mechanisms.posts.flatMap(p=>[p.id,...p.sensors]);return objects.filter(o=>ids.includes(o.id)).map(bounds);};
  const bonus=()=>artLayers.filter(a=>a.id===G.gameplay?.steampunkBonus?.artId).map(a=>[a.x-a.width/2,a.y-a.height/2,a.width,a.height]);
  const firstPlaySteps=[
   ['tutorial.steam.boss.title','tutorial.steam.boss.text',group('boss')],
   ['tutorial.steam.gun.title','tutorial.steam.gun.text',attack('lv1')],
   ['tutorial.steam.tower.title','tutorial.steam.tower.text',attack('lv2')],
   ['tutorial.steam.mine.attack.title','tutorial.steam.mine.attack.text',()=>[...group('blackHole')(),...attack('lv3')()]],
   ['tutorial.steam.crystal.title','tutorial.steam.crystal.text',attack('lv4')]
  ];
  return PirateTutorial.start({...options,lesson:{
   storageKey:'pinball-steampunk-first-play-tutorial-v1',firstPlaySteps,
   steps:[
    ['tutorial.steam.boss.title','tutorial.steam.boss.text',group('boss')],
    ['tutorial.steam.gun.title','tutorial.steam.gun.text',attack('lv1')],
    ['tutorial.steam.tower.title','tutorial.steam.tower.text',attack('lv2')],
    ['tutorial.steam.unlock.title','tutorial.steam.unlock.text',unlock,'below'],
    ['tutorial.steam.mine.title','tutorial.steam.mine.text',()=>[...group('blackHole')(),...attack('lv3')()]],
    ['tutorial.steam.crystal.title','tutorial.steam.crystal.text',attack('lv4')],
    ['tutorial.steam.wheel.title','tutorial.steam.wheel.text',bonus],
    ['tutorial.steam.post.title','tutorial.steam.post.text',posts],
    ['tutorial.steam.next.title','tutorial.steam.next.text',()=>artLayers.filter(a=>/steampunk-mission-arrow-/.test(a.src)&&a.indicator?.trigger?.kind==='enemy-active'&&a.indicator?.behavior?.mode==='repeat').map(artBounds)]
   ]
  }});
 }
};
