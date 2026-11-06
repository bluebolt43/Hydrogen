/* Saga lessons use the shared input, spotlight and tutorial progress flow. */
const SagaTutorial={
 describe(G,artLayers){
  const info=PirateTutorial.describe(G,artLayers),objects=[...G.lower,...G.upper_parts,...(G.top_parts||[])],rules=G.mechanisms;
  const related=a=>[a.indicator?.trigger,...(a.indicator?.extraTriggers||[]),a.animation?.trigger,...(a.animation?.extraTriggers||[])].filter(Boolean);
  const regions=ids=>{
   const result=[],seen=new Set();
   for(const id of new Set(ids)){
    const matches=artLayers.filter(a=>!a.hidden&&(a.bind===id||related(a).some(t=>t.source===id)));
    for(const a of matches)if(!seen.has(a.id)){seen.add(a.id);result.push(info.artBounds(a));}
    if(!matches.length){
     const raw=G.art_layout_objects?.find(o=>o.id===id),object=objects.find(o=>o.id===id)||G.guided_tracks?.find(o=>o.id===id)||G.editor_transitions?.find(o=>o.id===id)||rules.posts.find(o=>o.id===id);
     const group=rules.groups.find(r=>r.members?.includes(id));
     const shapes=object?[object]:group?objects.filter(o=>group.targets.includes(o.id)):raw?.type==='circle'?[{center:[raw.cx,raw.cy],radius:raw.r}]:[];
     for(const shape of shapes){const b=info.bounds(shape);if(b)result.push(b);}
    }
   }return result;
  };
  const groups=action=>rules.groups.filter(r=>r.action===action),members=groups=>groups.flatMap(r=>r.members||r.targets);
  const attackIds=level=>[...Object.keys(rules.attacks).filter(id=>rules.attacks[id]===level),...rules.groups.filter(r=>r.action==='attack'&&r.attack===level).flatMap(r=>r.members||r.targets),...rules.rolloverGroups.filter(r=>r.attack===level).flatMap(r=>r.members)];
  const attack=level=>regions(attackIds(level));
  const wolves=rules.rolloverGroups.filter(r=>r.attack==='lv3'),counters=attackIds('lv4');
  const counts=[...new Set(counters.map(id=>rules.attackCounts[id]||1))];
  return {steps:[
   ['tutorial.saga.boss.title','tutorial.saga.boss.text',()=>regions(members(groups('boss')))],
   ['tutorial.saga.lv1.title','tutorial.saga.lv1.text',()=>attack('lv1')],
   ['tutorial.saga.lv2.title','tutorial.saga.lv2.text',()=>attack('lv2')],
   ['tutorial.saga.lv3.title',()=>PinballI18n.t('tutorial.saga.lv3.text',{count:wolves[0]?.members.length||2}),()=>attack('lv3')],
   ['tutorial.saga.lv4.title',()=>PinballI18n.t('tutorial.saga.lv4.text',{count:counts.join('／')||1}),()=>attack('lv4')]
  ]};
 },
 start(options){return PirateTutorial.start({...options,lesson:{storageKey:'pinball-norse-first-play-tutorial-v1',...this.describe(options.G,options.artLayers)}});}
};
