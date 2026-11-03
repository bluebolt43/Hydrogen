/* Shared Touhou lesson targets follow compiled rules and artwork associations. */
const TouhouTutorial={
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
  const groups=action=>rules.groups.flatMap(r=>[r,...(r.secondary?[{...r.secondary,targets:r.targets}]:[])]).filter(r=>r.action===action);
  const bossRegions=()=>groups('boss').map(group=>{
   const boxes=regions(group.targets);if(!boxes.length)return null;
   const x=Math.min(...boxes.map(b=>b[0])),y=Math.min(...boxes.map(b=>b[1]));
   return [x,y,Math.max(...boxes.map(b=>b[0]+b[2]))-x,Math.max(...boxes.map(b=>b[1]+b[3]))-y];
  }).filter(Boolean);
  const attackIds=level=>[...Object.keys(rules.attacks).filter(id=>rules.attacks[id]===level),...rules.rolloverGroups.filter(r=>r.attack===level).flatMap(r=>r.members)];
  const attack=level=>regions(attackIds(level));
  return {info,regions,groups,bossRegions,attackIds,attack};
 }
};
