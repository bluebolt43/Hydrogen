/* Touhou1 lessons follow the current table's rules and artwork associations. */
const Touhou1Tutorial={
 describe(G,artLayers){
  const {regions,groups,bossRegions,attackIds,attack}=TouhouTutorial.describe(G,artLayers);
  const rules=G.mechanisms;
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
