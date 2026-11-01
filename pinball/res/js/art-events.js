/* Shared artwork event and state associations. */
(function(root){
'use strict';
// Resolve conditions and event timestamps.
function signal(o,g,t){
 const id=t.source||o.bind;
 switch(t.kind){
 case 'game-started':return {active:!!g.hasLaunchedOnce};
 case 'gap-launch':return {stamp:g.gapLaunchAt?.get(id)};
 case 'hole-count':return {active:(g.holeCaptureCounts?.get(id)||0)>=(t.threshold||2)};
 case 'hole-active':return {active:!!g.armedHoles?.has(id)};
 case 'gap-count':return {active:id===g.g.gameplay?.touhouGap?.hole&&(g.gapLock?.count||0)>=(t.threshold||1)};
 case 'count':{const n=g.g.mechanisms.attackCounts[id];return {active:n-(g.attackRemaining.get(id)??n)>=(t.threshold||1),stamp:(t.threshold||1)===n&&(g.attackRemaining.get(id)??n)===n?g.attackCompletedAt.get(id):undefined};}
 case 'count-complete':return {stamp:g.attackCompletedAt.get(id)};
 case 'hole-capture':case 'hole-release':{const stamps=t.kind==='hole-capture'?g.holeCapturedAt:g.holeReleasedAt;return {stamp:stamps?.get(id)};}
 case 'attack':return {stamp:g.attackVisualAt?.get(id)};
 case 'multiball':return {stamp:g.sharkFlashAt};
 case 'target':return {stamp:g.targetVisualAt?.get(id)};
 case 'layer-entry':return {stamp:g.layerEnteredAt?.get(id)};
 case 'flipper':return {stamp:g.flipperHitAt?.get(id)};
 case 'flag':return {stamp:g.flagHitAt?.get(id)};
 case 'rebound':return {stamp:g.reboundHitAt?.get(id)};
 case 'sensor':return {stamp:g.sensorHitAt?.get(id)};
 case 'rollover':return {active:g.rolloverLit(id)};
 case 'enemy-active':return {active:!g.enemyIntroPending&&!!g.enemyActive};
 case 'enemy-idle':return {active:!g.enemyIntroPending&&!g.enemyActive};
 case 'kickback':{const k=g.rescueById?.get(id);return {active:k?!!g.rescueState(k.layer||'lower').hits[k.side]:false};}
 case 'level':return {active:g.bumperLevel(id)>=(t.threshold||1)};
 case 'object-hidden':return {active:!!g.hiddenObjects?.has(id)};
 case 'post':return {active:!!g.configuredPosts?.get(id)?.raised};
 default:return {active:o.indicator?.defaultState==='on'};
 }
}
const api={signal};if(typeof module!=='undefined')module.exports=api;else root.ArtEvents=api;
})(globalThis);
