/* Shared rail outlines: connected segments use exactly the same two edge joints. */
(function(root){
'use strict';
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],add=(a,b)=>[a[0]+b[0],a[1]+b[1]],mul=(a,k)=>a.map(v=>v*k),length=a=>Math.hypot(...a),unit=a=>mul(a,1/(length(a)||1)),dot=(a,b)=>a[0]*b[0]+a[1]*b[1],cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
function editorTrack(s){
 const n=s.type==='arc'?Math.max(8,Math.ceil((Math.hypot(s.qx-s.x1,s.qy-s.y1)+Math.hypot(s.x2-s.qx,s.y2-s.qy))/1.5)):1;
 const points=Array.from({length:n+1},(_,i)=>{const t=i/n,u=1-t;return s.type==='arc'?[u*u*s.x1+2*u*t*s.qx+t*t*s.x2,u*u*s.y1+2*u*t*s.qy+t*t*s.y2]:[s.x1+(s.x2-s.x1)*t,s.y1+(s.y2-s.y1)*t]});
 return {id:s.id,points,width:s.trackWidth,railMaterial:s.railMaterial,layer:s.layer||'lower',showAboveArt:s.showAboveArt===true};
}
function outlines(tracks){
 const result=new Map();
 for(const track of tracks){
  const points=[track.points[0]];
  for(let i=1;i<track.points.length;i++){const a=track.points[i-1],delta=sub(track.points[i],a),n=Math.max(1,Math.ceil(length(delta)/2));for(let j=1;j<=n;j++)points.push(add(a,mul(delta,j/n)));}
  const distances=[0];for(let i=1;i<points.length;i++)distances.push(distances.at(-1)+length(sub(points[i],points[i-1])));
  const normals=points.map((p,i)=>{const d=unit(sub(points[Math.min(points.length-1,i+1)],points[Math.max(0,i-1)]));return [-d[1],d[0]];});
  result.set(track.id,{...track,points,distances,entry:unit(sub(points[1],points[0])),exit:unit(sub(points.at(-1),points.at(-2))),rails:[-1,1].map(sign=>points.map((p,i)=>add(p,mul(normals[i],sign*track.width/2)))),startJoint:null,endJoint:null});
 }
 for(const a of result.values()){
  const b=[...result.values()].filter(b=>b!==a&&!b.startJoint&&length(sub(a.points.at(-1),b.points[0]))<=1&&dot(a.exit,b.entry)>=-1e-6).sort((b,c)=>dot(a.exit,c.entry)-dot(a.exit,b.entry)||b.id.localeCompare(c.id))[0];
  if(!b)continue;
  const center=mul(add(a.points.at(-1),b.points[0]),.5),na=[-a.exit[1],a.exit[0]],nb=[-b.entry[1],b.entry[0]],normal=unit(add(na,nb));
  const joint=[-1,1].map(sign=>{
   const pa=add(a.points.at(-1),mul(na,sign*a.width/2)),pb=add(b.points[0],mul(nb,sign*b.width/2)),denom=cross(a.exit,b.entry);
   if(Math.abs(denom)>1e-6){const q=add(pa,mul(a.exit,cross(sub(pb,pa),b.entry)/denom));if(length(sub(q,center))<=Math.max(a.width,b.width))return q;}
   return add(center,mul(normal,sign*(a.width+b.width)/4/Math.max(.5,dot(normal,na))));
  });
  a.endJoint=joint;b.startJoint=joint;
 }
 for(const track of result.values()){
  const total=track.distances.at(-1),blend=Math.min(total/2,Math.max(track.width,8));
  for(const [end,joint] of [[false,track.startJoint],[true,track.endJoint]])if(joint){
   for(let side=0;side<2;side++){const rail=track.rails[side],delta=sub(joint[side],end?rail.at(-1):rail[0]);
    for(let i=0;i<rail.length;i++){const distance=end?total-track.distances[i]:track.distances[i],weight=Math.max(0,1-distance/(blend||1));rail[i]=add(rail[i],mul(delta,weight));}
    rail[end?rail.length-1:0]=[...joint[side]];
   }
  }
 }
 return result;
}
function drawRails(ctx,tracks,plane){
 const visible=[...tracks.values()].filter(track=>track.showAboveArt&&(track.layer==='tavern'?'upper':track.layer||'lower')===plane);
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
 // Draw every shadow first so a following segment cannot cover the metal joint.
 ctx.save();ctx.translate(2,4);ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=3;
 for(const track of visible)for(const rail of track.rails){ctx.beginPath();ctx.moveTo(...rail[0]);for(const p of rail.slice(1))ctx.lineTo(...p);ctx.stroke();}
 ctx.restore();
 for(const track of visible){
  for(const rail of track.rails){ctx.beginPath();ctx.moveTo(...rail[0]);for(const p of rail.slice(1))ctx.lineTo(...p);ctx.strokeStyle=track.railMaterial==='gold'?'#705126':'#52616a';ctx.lineWidth=2.6;ctx.stroke();ctx.strokeStyle=track.railMaterial==='gold'?'#ddbc70':'#b6c2c6';ctx.lineWidth=.75;ctx.stroke();}
 }
 // Only exposed ends receive fasteners; joined curve segments stay seamless.
 for(const track of visible){
  for(const [end,joint] of [[false,track.startJoint],[true,track.endJoint]]){
   if(joint)continue;
   for(const rail of track.rails){
    const [x,y]=end?rail.at(-1):rail[0];
    for(const [dx,dy,r,color] of [[0,.6,2.1,'rgba(45,30,20,.28)'],[0,0,1.8,'#6c512f'],[0,-.15,1.25,'#c2a365'],[-.35,-.55,.4,'#e8d6a6']]){ctx.beginPath();ctx.arc(x+dx,y+dy,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
    ctx.fillStyle='#705735';ctx.fillRect(x-.7,y-.15,1.4,.35);
   }
  }
 }
 ctx.restore();
}
function createRenderer(tracks){
 const Art=typeof module!=='undefined'&&module.exports?require('./art-layers.js'):root.PinballArt,caches=new Map(),budget=2097152;
 return {draw(ctx,plane){
  const visible=[...tracks.values()].filter(t=>t.showAboveArt&&(t.layer==='tavern'?'upper':t.layer||'lower')===plane);
  if(!visible.length)return;
  const m=ctx.getTransform();
  if(m.b||m.c||m.a<=0||m.d<=0||ctx.globalAlpha!==1||ctx.globalCompositeOperation!=='source-over'||ctx.shadowBlur||ctx.filter&&ctx.filter!=='none')return drawRails(ctx,tracks,plane);
  let entry=caches.get(plane);
  if(!entry||entry.sx!==m.a||entry.sy!==m.d){
   let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
   for(const t of visible)for(const rail of t.rails)for(const [x,y] of rail){x0=Math.min(x0,x-6);y0=Math.min(y0,y-6);x1=Math.max(x1,x+8);y1=Math.max(y1,y+10);}
   const left=Math.floor(x0*m.a+m.e),top=Math.floor(y0*m.d+m.f),width=Math.ceil(x1*m.a+m.e)-left,height=Math.ceil(y1*m.d+m.f)-top;
   if(width*height>budget)return drawRails(ctx,tracks,plane);
   const canvas=Art.rasterCanvas(width,height,true);
   const c=canvas.getContext('2d');c.setTransform(m.a,0,0,m.d,m.e-left,m.f-top);drawRails(c,tracks,plane);
   Art.releaseRaster(caches.get(plane));caches.delete(plane);
   while([...caches.values()].reduce((n,e)=>n+e.canvas.width*e.canvas.height,0)+width*height>budget){const oldest=caches.keys().next().value;Art.releaseRaster(caches.get(oldest));caches.delete(oldest);}
   entry={canvas:Art.rasterImage(canvas),sx:m.a,sy:m.d,e:m.e,f:m.f,left,top};caches.set(plane,entry);
  }
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(entry.canvas,Math.round(entry.left+m.e-entry.e),Math.round(entry.top+m.f-entry.f));ctx.restore();
 }};
}
const api={editorTrack,outlines,drawRails,createRenderer};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GuidedTrackGeometry=api;
})(globalThis);
