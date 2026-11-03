/* Scarlet mansion lessons read the current table's mechanics and artwork. */
const Touhou2Tutorial={
 describe(G,artLayers){
  const {regions,groups,bossRegions,info}=TouhouTutorial.describe(G,artLayers);
  const bagua=G.gameplay.touhouBagua,multi=G.gameplay.holeMultiball;
  const t=(key,params)=>()=>PinballI18n.t('tutorial.touhou2.'+key,params());
  const step=(name,targets,params)=>['tutorial.touhou2.'+name+'.title',params?t(name+'.text',params):'tutorial.touhou2.'+name+'.text',targets];
  const attack=level=>(G.gameplay.tutorial?.attackIndicators?.[level]||[]).map(id=>artLayers.find(a=>a.id===id&&!a.hidden)).filter(Boolean).map(a=>info.artBounds(a));
  const baguaRegions=()=>regions([bagua.object],true);
  const firstPlaySteps=[
   step('enemy',bossRegions),
   step('lv1',()=>attack('lv1')),
   step('lv2',()=>attack('lv2')),
   step('lv3',()=>attack('lv3'),()=>({count:G.mechanisms.rolloverGroups.find(r=>r.attack==='lv3')?.members.length||3})),
   step('lv4',baguaRegions,()=>({count:bagua.threshold}))
  ];
  return {firstPlaySteps,steps:[...firstPlaySteps,
   step('bagua',baguaRegions,()=>({count:bagua.threshold})),
   step('upgrade',()=>regions(groups('upgrade').flatMap(r=>[...r.targets,...r.bumpers]))),
   step('multiball',()=>regions([multi.hole],true),()=>({count:multi.hits,balls:multi.balls||2})),
   step('rescue',()=>regions([...(G.rescue_kickers||[]).map(k=>k.id),...G.mechanisms.posts.flatMap(p=>[p.id,...p.sensors])]),()=>({count:G.mechanisms.posts[0]?.hits||1}))
  ]};
 },
 start(options){return PirateTutorial.start({...options,lesson:{storageKey:'pinball-touhou2-first-play-tutorial-v1',...this.describe(options.G,options.artLayers)}});}
};
