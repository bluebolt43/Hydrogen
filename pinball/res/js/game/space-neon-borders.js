/* Presentation only: Space object outlines share layout geometry on each plane. */
(function(root){
'use strict';
const color='#ed80ed';
function enabled(theme,settings){return ['sci-fi','space','cosmic-dessert'].includes(theme)&&settings?.neonBorders!==false;}
function defaultEnabled(o){return (o.layer||'lower')==='upper'&&!o.transition&&!['guided-rail','layer-transition','rescue-kicker'].includes(o.mechanic)&&(['line','thickline','arc','rect','ublock'].includes(o.type)||o.type==='circle'&&o.mechanic==='solid-circle');}
function eligible(o){return !!o?.type;}
function mode(o,settings){return o.neonBorder===false?'none':typeof o.neonBorder==='string'?o.neonBorder:o.neonBorder===true||defaultEnabled(o)?settings?.neonBorderColor||'pink':'none';}
function circle(x,y,r){return `M${x-r} ${y}a${r} ${r} 0 1 0 ${r*2} 0a${r} ${r} 0 1 0 ${-r*2} 0`;}
function templatePath(o,t){
 let markup=t?.markup||'',i=0;
 return [...markup.matchAll(/<(path|polygon|polyline|circle|ellipse|rect|line)\b([^>]*)>/g)].map(([,tag,attrs])=>{
  const get=(key,fallback=0)=>{const m=attrs.match(new RegExp('(?:^|\\s)'+key+'="([^"]*)"'));return m?m[1]:fallback;};
  if(tag==='path')return get('d','');
  if(tag==='polygon'||tag==='polyline'){const shift=o.type==='targets'?(i++-1)*((o.spacing??15)-15):0;return String(get('points','')).trim().split(/\s+/).map((p,n)=>{const [x,y]=p.split(',').map(Number);return `${n?'L':'M'}${x+shift} ${y}`;}).join('')+(tag==='polygon'?'Z':'');}
  if(tag==='circle')return circle(+get('cx'),+get('cy'),+get('r'));
  if(tag==='line')return `M${get('x1')} ${get('y1')}L${get('x2')} ${get('y2')}`;
  if(tag==='rect'){const x=+get('x'),y=+get('y'),w=+get('width'),h=+get('height');return `M${x} ${y}h${w}v${h}h${-w}Z`;}
  return '';
 }).join('');
}
function path(o){
 if(Number.isFinite(o.x1)&&o.type!=='arc')return `M${o.x1} ${o.y1}L${o.x2} ${o.y2}`;
 if(o.type==='arc')return `M${o.x1} ${o.y1}Q${o.qx} ${o.qy} ${o.x2} ${o.y2}`;
 if(o.type==='circle')return `M${o.cx-o.r} ${o.cy}a${o.r} ${o.r} 0 1 0 ${o.r*2} 0a${o.r} ${o.r} 0 1 0 ${-o.r*2} 0`;
 const points=o.type==='ublock'?[[-12,11],[-12,-11],[12,-11],[12,11],[9,11],[9,-8],[-9,-8],[-9,11]]:[[-o.width/2,-o.height/2],[o.width/2,-o.height/2],[o.width/2,o.height/2],[-o.width/2,o.height/2]];
 const a=(o.angle||0)*Math.PI/180;
 return points.map(([x,y],i)=>`${i?'L':'M'}${o.x+x*Math.cos(a)-y*Math.sin(a)} ${o.y+x*Math.sin(a)+y*Math.cos(a)}`).join('')+'Z';
}
function entries(objects,templates={}){return objects.filter(o=>eligible(o)&&mode(o)!=='none').map(o=>{
 const local=!Number.isFinite(o.x1)&&o.type!=='circle',x=o.x??o.cx??((o.x1+o.x2)/2),y=o.y??o.cy??((o.y1+o.y2)/2);
 let d=local?templatePath(o,templates[o.type]):path(o);
 if(local&&!d){if(o.type==='centerPost')d=circle(0,0,o.radius??5);else if(o.outline)d=o.outline.map(([px,py],i)=>`${i?'L':'M'}${px*o.width} ${py*o.height}`).join('')+'Z';else d=path({...o,x:0,y:0,angle:0,width:o.width??templates[o.type]?.width??10,height:o.height??templates[o.type]?.height??10});}
 return {id:o.id,plane:o.layer||'lower',color:typeof o.neonBorder==='string'?o.neonBorder:null,d,x,y,local,angle:o.angle||0};
 });}

function strokes(settings){const selected=settings?.neonBorderColor,base=selected==='blue'?'#648dff':selected==='yellow'?'#ffda59':color;return [[4.5,base,.08],[2.5,base,.25],[1.25,base,1],[.4,selected==='blue'?'#dce9ff':selected==='yellow'?'#fff6cb':'#ffe5ff',1]];}
function svg(objects,settings,templates){const list=entries(objects,templates);return ['pink','blue','yellow'].map(color=>{const group=list.filter(e=>(e.color||settings?.neonBorderColor||'pink')===color);return group.length?strokes({neonBorderColor:color}).map(([width,stroke,opacity])=>`<g fill="none" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round">${group.map(e=>`<path data-neon-object="${e.id}" d="${e.d}"${e.local?` transform="translate(${e.x} ${e.y}) rotate(${e.angle})"`:''}/>`).join('')}</g>`).join(''):'';}).join('');}
function createRenderer(list){
 const Art=typeof module!=='undefined'&&module.exports?require('./art-layers.js'):root.PinballArt,caches=new Map();
 const planes=new Map();
 for(const e of list){if(!planes.has(e.plane))planes.set(e.plane,[]);planes.get(e.plane).push(e);}
 const planeIds=new Map([...planes].map(([plane,items])=>[plane,new Set(items.map(e=>e.id))]));
 return {draw(ctx,game,settings=game?.g?.gameplay,plane='upper'){
  const items=planes.get(plane);if(!items?.length)return;
  const hidden=new Set(game?.hiddenObjects||[]),rotated=game?.rotatedObjects||new Set();
  // Rescue flaps are open space until the physical gate has actually closed.
  for(const gate of game?.gates||[])if(gate.mechanic==='rescue-return'&&(!gate.closed||gate.unlocked))hidden.add(gate.id);
  if(items.every(e=>hidden.has(e.id)))return;
  const transform=ctx.getTransform(),scale=Math.max(.25,Math.min(4,Math.hypot(transform.a,transform.b)));
  let {cache,key,x=0,y=-170.5,width=360,height=640}=caches.get(plane)||{};
  const ids=planeIds.get(plane),next=(settings?.neonBorderColor||'pink')+':'+scale+':'+[...hidden].filter(id=>ids.has(id)).sort().join(',')+':'+[...rotated].filter(id=>ids.has(id)).sort().join(',');
  if(!cache||next!==key){
   cache?.close?.();key=next;cache=Art.rasterCanvas(Math.ceil(360*scale),Math.ceil(640*scale),true);
   const c=cache.getContext('2d');c.scale(scale,scale);c.translate(0,170.5);c.lineCap=c.lineJoin='round';
   for(const color of ['pink','blue','yellow'])for(const [width,stroke,opacity] of strokes({neonBorderColor:color})){
    c.lineWidth=width;c.strokeStyle=stroke;c.globalAlpha=opacity;
    for(const e of items){if(hidden.has(e.id)||(e.color||settings?.neonBorderColor||'pink')!==color)continue;c.save();if(rotated.has(e.id)){c.translate(e.x,e.y);c.rotate(Math.PI/2);c.translate(-e.x,-e.y);}if(e.local){c.translate(e.x,e.y);c.rotate(e.angle*Math.PI/180);}c.stroke(new Path2D(e.d));c.restore();}
   }
   x=0;y=-170.5;width=360;height=640;
   // These pixels contain vectors only, so trimming never reads external images.
   if(c.getImageData){
    const w=cache.width,h=cache.height,pixels=c.getImageData(0,0,w,h).data;let left=w,top=h,right=-1,bottom=-1;
    for(let row=0;row<h;row++)for(let col=0;col<w;col++)if(pixels[(row*w+col)*4+3]){left=Math.min(left,col);top=Math.min(top,row);right=Math.max(right,col);bottom=Math.max(bottom,row);}
    if(right>=left){
     left=Math.max(0,left-1);top=Math.max(0,top-1);right=Math.min(w,right+2);bottom=Math.min(h,bottom+2);
     const trimmed=Art.rasterCanvas(right-left,bottom-top,true);
     trimmed.getContext('2d').drawImage(cache,left,top,trimmed.width,trimmed.height,0,0,trimmed.width,trimmed.height);
     x=left*360/w;y=-170.5+top*640/h;width=trimmed.width*360/w;height=trimmed.height*640/h;Art.recycleRasterCanvas(cache);cache=trimmed;
    }
   }
   cache=Art.rasterImage(cache);caches.set(plane,{cache,key,x,y,width,height});
  }
  ctx.drawImage(cache,x,y,width,height);
 }};
}
const api={color,enabled,eligible,mode,entries,svg,createRenderer};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.SpaceNeonBorders=api;
})(typeof globalThis==='undefined'?this:globalThis);
