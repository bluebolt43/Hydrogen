/* Join selected perimeter paths into a closed, non-colliding slope region. */
(function(root){
'use strict';
const EPS=1e-7,dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
function valid(points){
 if(!Array.isArray(points)||points.length<3||points.length>8192||points.some(p=>!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)))return false;
 let area=0;
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length];if(dist(a,b)<EPS)return false;area+=a[0]*b[1]-a[1]*b[0];
  for(let j=i+2;j<points.length;j++){
   if(i===0&&j===points.length-1)continue;
   const c=points[j],d=points[(j+1)%points.length];
   if(Math.max(a[0],b[0])+EPS<Math.min(c[0],d[0])||Math.max(c[0],d[0])+EPS<Math.min(a[0],b[0])||Math.max(a[1],b[1])+EPS<Math.min(c[1],d[1])||Math.max(c[1],d[1])+EPS<Math.min(a[1],b[1]))continue;
   const abC=cross(a,b,c),abD=cross(a,b,d),cdA=cross(c,d,a),cdB=cross(c,d,b);
   if(((abC<=EPS&&abD>=-EPS)||(abD<=EPS&&abC>=-EPS))&&((cdA<=EPS&&cdB>=-EPS)||(cdB<=EPS&&cdA>=-EPS)))return false;
  }
 }
 return Math.abs(area)>EPS;
}
function connect(paths){
 if(!paths.length||paths.some(p=>!Array.isArray(p)||p.length<2||p.some(q=>!Array.isArray(q)||q.length!==2||!q.every(Number.isFinite))))throw Error('請選取周邊直線、弧線或封閉輪廓。');
 // Editor boundaries can meet within one pixel (e.g. Pirate arc-009 at
 // y=136 and line-034 at y=135). Snap only their endpoints, not curve samples.
 paths=paths.map(path=>path.map(p=>[...p]));
 const endpoints=paths.flatMap(path=>[path[0],path.at(-1)]);
 for(let i=0;i<endpoints.length;i++)for(let j=i+1;j<endpoints.length;j++)if(Math.floor(i/2)!==Math.floor(j/2)&&dist(endpoints[i],endpoints[j])<=Math.min(1.01,dist(paths[Math.floor(i/2)][0],paths[Math.floor(i/2)].at(-1))*.1,dist(paths[Math.floor(j/2)][0],paths[Math.floor(j/2)].at(-1))*.1)){endpoints[j][0]=endpoints[i][0];endpoints[j][1]=endpoints[i][1];}
 if(paths.length>1&&paths.some(p=>dist(p[0],p.at(-1))<EPS))throw Error('封閉輪廓請單獨建立坡面，不要混入其他輪廓。');
 function join(reverse){
  const remaining=paths.slice(1).map(p=>p.map(q=>[...q])),points=(reverse?[...paths[0]].reverse():paths[0]).map(p=>[...p]),bridges=[];
  while(remaining.length){
   const end=points.at(-1);let best={distance:Infinity};
   remaining.forEach((path,index)=>{for(const reverse of [false,true]){const distance=dist(end,reverse?path.at(-1):path[0]);if(distance<best.distance)best={distance,index,reverse};}});
   const path=remaining.splice(best.index,1)[0];if(best.reverse)path.reverse();
   if(best.distance>EPS)bridges.push([[...end],[...path[0]]]);
   for(const point of path)if(dist(points.at(-1),point)>EPS)points.push(point);
  }
  if(dist(points[0],points.at(-1))<EPS)points.pop();else bridges.push([[...points.at(-1)],[...points[0]]]);
  return {points,bridges};
 }
 const first=join(false);if(valid(first.points))return first;
 const reverse=join(true);if(valid(reverse.points))return reverse;
 // A nearest endpoint is only a preference: long parallel boundaries may
 // require returning to the other end before closing the launch-lane contour.
 let budget=12000;
 function search(points,remaining,bridges){
  if(--budget<0)return null;
  if(!remaining.length){
   const closed=points.map(p=>[...p]),gaps=bridges.slice();
   if(dist(closed[0],closed.at(-1))<EPS)closed.pop();else gaps.push([[...closed.at(-1)],[...closed[0]]]);
   return valid(closed)?{points:closed,bridges:gaps}:null;
  }
  const end=points.at(-1),choices=[];
  remaining.forEach((path,index)=>{for(const reverse of [false,true])choices.push({index,reverse,distance:dist(end,reverse?path.at(-1):path[0])});});
  choices.sort((a,b)=>a.distance-b.distance);
  for(const choice of choices){
   const path=choice.reverse?[...remaining[choice.index]].reverse():remaining[choice.index],next=points.map(p=>[...p]),gaps=bridges.slice();
   if(choice.distance>EPS)gaps.push([[...end],[...path[0]]]);
   for(const point of path)if(dist(next.at(-1),point)>EPS)next.push([...point]);
   const result=search(next,remaining.filter((_,i)=>i!==choice.index),gaps);if(result)return result;
   if(budget<0)return null;
  }
  return null;
 }
 for(const reverse of [false,true]){
  const result=search((reverse?[...paths[0]].reverse():paths[0]).map(p=>[...p]),paths.slice(1),[]);if(result)return result;
 }
 throw Error('最近端點連線後輪廓交叉或沒有面積，請調整周邊物件選取。');
}
function worldPoints(zone){return zone.outline.map(([x,y])=>[zone.x+x*zone.width,zone.y+y*zone.height]);}
function region(paths){
 const {points,bridges}=connect(paths),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
 const x=(left+right)/2,y=(top+bottom)/2,width=right-left,height=bottom-top,normalize=p=>[(p[0]-x)/width,(p[1]-y)/height];
 return {x,y,width,height,angle:0,outline:points.map(normalize),bridges:bridges.map(edge=>edge.map(normalize))};
}
const api={valid,connect,region,worldPoints};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SlopeRegions=api;
})(globalThis);
