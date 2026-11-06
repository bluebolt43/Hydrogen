/* Space lessons reuse the shared controls, spotlight, narration and progress flow. */
const SpaceTutorial={
 describe(G,artLayers){
  const info=PirateTutorial.describe(G,artLayers),objects=[...G.lower,...G.upper_parts,...(G.top_parts||[])],rules=G.mechanisms;
  const related=a=>[a.indicator?.trigger,...(a.indicator?.extraTriggers||[]),a.animation?.trigger,...(a.animation?.extraTriggers||[])].filter(Boolean);
  const regions=(ids,geometry=false)=>{
   const result=[],seen=new Set();
   for(const id of new Set(ids)){
    const matches=artLayers.filter(a=>!a.hidden&&(a.bind===id||related(a).some(t=>t.source===id)));
    for(const a of matches)if(!seen.has(a.id)){seen.add(a.id);result.push(info.artBounds(a));}
    if(geometry||!matches.length){const object=objects.find(o=>o.id===id),raw=G.art_layout_objects?.find(o=>o.id===id);const b=info.bounds(object||(raw?.type==='circle'?{center:[raw.cx,raw.cy],radius:raw.r}:null));if(b)result.push(b);}
   }return result;
  };
  const controls=effect=>rules.groups.filter(r=>r.action==='objectControl'&&r.effect===effect);
  const hidden=controls('hide');
  const restoredByHole=r=>(G.objectEffects||[]).some(e=>e.object===r.object&&e.action==='restore'&&objects.some(o=>o.id===e.source&&o.kind==='socket'));
  const warden=hidden.filter(restoredByHole),route=hidden.filter(r=>!restoredByHole(r));
  const controlRegions=groups=>regions(groups.flatMap(r=>[...r.targets,r.object,...(G.objectEffects||[]).filter(e=>e.object===r.object&&e.action==='restore').map(e=>e.source)]));
  const upgrades=rules.groups.filter(r=>r.action==='upgrade');
  const attackIds=level=>[...Object.keys(rules.attacks).filter(id=>rules.attacks[id]===level),...rules.groups.filter(r=>r.action==='attack'&&r.attack===level).flatMap(r=>r.targets),...rules.rolloverGroups.filter(r=>r.attack===level).flatMap(r=>r.members)];
  const attack=level=>regions(attackIds(level));
  const counter=Object.keys(rules.attacks).filter(id=>rules.attacks[id]==='lv4');
  const counts=[...new Set(counter.map(id=>rules.attackCounts[id]||1))];
  const star=G.gameplay?.spaceConstellation;
  const artRegions=predicate=>artLayers.filter(a=>!a.hidden&&predicate(a)).map(info.artBounds);
  const firstPlaySteps=[
   ['tutorial.space.attack.title','tutorial.space.attack.text',()=>{const ids=attackIds('lv3'),flags=artRegions(a=>ids.includes(a.bind)&&/\/space-target-bandit-flag\./.test(a.src));return flags.length?flags:regions(ids);}],
   ['tutorial.space.lv1.title','tutorial.space.lv1.text',()=>attack('lv1')],
   ['tutorial.space.lv2.title','tutorial.space.lv2.text',()=>{const throne=artRegions(a=>/\/space-king-toilet-throne-front\./.test(a.src));return throne.length?throne:attack('lv2');}],
   ['tutorial.space.lv4.title',()=>PinballI18n.t('tutorial.space.lv4.text',{count:counts[0]||1}),()=>[...regions(counter,true),...artRegions(a=>/\/space-ch7-spatial-rift-transparent\./.test(a.src))]],
  ];
  return {firstPlaySteps,steps:[...firstPlaySteps,
   ['tutorial.space.upgrade.title','tutorial.space.upgrade.text',()=>regions(upgrades.flatMap(r=>[...r.targets,...r.bumpers]))],
   ['tutorial.space.route.title','tutorial.space.route.text',()=>controlRegions(route)],
   ['tutorial.space.warden.title','tutorial.space.warden.text',()=>controlRegions(warden)],
   ['tutorial.space.stars.title',()=>PinballI18n.t('tutorial.space.stars.text',{count:star?.threshold||10}),()=>regions(star?[star.object,...star.holes]:[])],
   ['tutorial.space.lights.title','tutorial.space.lights.text',()=>artRegions(a=>/space-light-guide-/.test(a.src)||a.indicator?.trigger?.kind==='flag')],
   ['tutorial.space.rescue.title','tutorial.space.rescue.text',()=>regions([...(G.rescue_kickers||[]).map(k=>k.id),...rules.posts.flatMap(p=>[p.id,...p.sensors])])]
  ]};
 },
 start(options){return PirateTutorial.start({...options,lesson:{storageKey:'pinball-space-first-play-tutorial-v1',...this.describe(options.G,options.artLayers)}});}
};
