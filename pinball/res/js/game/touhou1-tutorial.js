/* Touhou1 lessons follow the current table's rules and artwork associations. */
const Touhou1Tutorial={
 describe(G,artLayers){
  const info=PirateTutorial.describe(G,artLayers),objects=[...G.lower,...G.upper_parts,...(G.top_parts||[])],rules=G.mechanisms;
  const related=a=>[a.indicator?.trigger,...(a.indicator?.extraTriggers||[]),a.animation?.trigger,...(a.animation?.extraTriggers||[])].filter(Boolean);
  const regions=(ids,geometry=false)=>{
   const result=[],seen=new Set();
   for(const id of new Set(ids)){
    const matches=artLayers.filter(a=>!a.hidden&&(a.bind===id||related(a).some(t=>t.source===id)));
    for(const a of matches)if(!seen.has(a.id)){seen.add(a.id);result.push(info.artBounds(a));}
    if(geometry||!matches.length){const raw=G.art_layout_objects?.find(o=>o.id===id),object=objects.find(o=>o.id===id)||(raw?.type==='blockhole'?{center:[raw.x,raw.y],radius:G.gameplay?.touhouBagua?.radius||raw.attractionRadius}:null),bounds=info.bounds(object);if(bounds)result.push(bounds);}
   }return result;
  };
  const groups=action=>rules.groups.filter(r=>r.action===action);
  const bossRegions=()=>groups('boss').map(group=>{
   const boxes=regions(group.targets);if(!boxes.length)return null;
   const x=Math.min(...boxes.map(b=>b[0])),y=Math.min(...boxes.map(b=>b[1]));
   return [x,y,Math.max(...boxes.map(b=>b[0]+b[2]))-x,Math.max(...boxes.map(b=>b[1]+b[3]))-y];
  }).filter(Boolean);
  const attackIds=level=>[...Object.keys(rules.attacks).filter(id=>rules.attacks[id]===level),...rules.rolloverGroups.filter(r=>r.attack===level).flatMap(r=>r.members)];
  const attack=level=>regions(attackIds(level));
  const bagua=G.gameplay?.touhouBagua;
  const counters=attackIds('lv3').filter(id=>rules.attackCounts[id]>1),counts=[...new Set(counters.map(id=>rules.attackCounts[id]))];
  const t=(key,params)=>()=>PinballI18n.t(key,params());
  const firstPlaySteps=[
   ['tutorial.touhou1.enemy.title','tutorial.touhou1.enemy.text',bossRegions],
   ['tutorial.touhou1.lv1.title','tutorial.touhou1.lv1.text',()=>attack('lv1')],
   ['tutorial.touhou1.lv2.title','tutorial.touhou1.lv2.text',()=>attack('lv2')],
   ['tutorial.touhou1.lv3.title',t('tutorial.touhou1.lv3.text',()=>({count:counts.join('／')||1})),()=>attack('lv3')],
   ['tutorial.touhou1.lv4.title',t('tutorial.touhou1.lv4.text',()=>({count:bagua?.threshold||8})),()=>attack('lv1')]
  ];
  const gap=G.gameplay?.touhouGap;
  return {firstPlaySteps,steps:[...firstPlaySteps,
   ['tutorial.touhou1.bagua.title',t('tutorial.touhou1.bagua.text',()=>({count:bagua?.threshold||8})),()=>regions(bagua?[bagua.object]:[])],
   ['tutorial.touhou1.upgrade.title','tutorial.touhou1.upgrade.text',()=>regions(groups('upgrade').flatMap(r=>[...r.targets,...r.bumpers]))],
   ['tutorial.touhou1.gap.title',t('tutorial.touhou1.gap.text',()=>({count:gap?.locks||3})),()=>regions(gap?[gap.sensor,gap.hole]:[])],
   ['tutorial.touhou1.rescue.title','tutorial.touhou1.rescue.text',()=>regions([...(G.rescue_kickers||[]).map(k=>k.id),...rules.posts.flatMap(p=>[p.id,...p.sensors])])]
  ]};
 },
 start(options){return PirateTutorial.start({...options,lesson:{storageKey:'pinball-touhou1-first-play-tutorial-v1',...this.describe(options.G,options.artLayers)}});}
};
