/* Editor JSON -> physics geometry. Shared by editor previews and built games. */
(function(root){
'use strict';
const SlopeRegions=typeof module!=='undefined'&&module.exports?require('./slope-regions.js'):root.SlopeRegions;
// Shared shape references for main, editor previews and Node tests.
const FLIPPER_REFERENCE={"left":{"pivot":[127.73488354682922,407.82425594329834],"tip":[159.8123854994774,430.25012969970703],"raised":[159.8123854994774,385.6379671096802],"radii":[6.530601114034653,4.059467911720276]},"right":{"pivot":[232.26900172233582,407.82425594329834],"tip":[200.18100053071976,430.25012969970703],"raised":[200.18100053071976,385.6379671096802],"radii":[6.530601114034653,4.059467911720276]}};
const SHOOTER_FLOOR_ORIGIN=[316.5,448];
const LEGACY_CENTER_POST={"id":"test-post-center","kind":"test-post","center":[180,435],"radius":6.5,"layer":"lower","mechanic":"rollover_post"};
function compileLayout(layout,base){
 const copy=v=>JSON.parse(JSON.stringify(v)),rad=v=>(v||0)*Math.PI/180,dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 if(layout?.format!=='pinball-layout-editor'||!Array.isArray(layout.objects)||!Array.isArray(layout.lockedLayout))throw Error('不是有效的布局 JSON');
 for(const art of layout.artLayers||[])if(art.state!=='ball-layer'&&(!/^res\/(?:img|hd_img)\/(?:(?:pirate|steampunk|space|touhou|saga)\/)?[^/\\?#]+\.(png|webp|jpg|jpeg)$/i.test(art.src||'')||art.src.includes('..')))throw Error('請指定 res/img 或 res/hd_img 中的圖片：'+art.id);
 const g=copy(base);
 g.layout_preview=true;g.artLayers=copy(layout.artLayers||[]);g.art_layout_objects=copy(layout.objects);g.art_layout_templates=copy(layout.templates||{});g.gameplay=copy(layout.gameplay||{});
 if(g.gameplay.ballImage!==undefined&&(typeof g.gameplay.ballImage!=='string'||!/^res\/(?:img|hd_img)\/(?:[\w-]+\/)*[\w.-]+\.(?:png|webp|jpe?g)$/i.test(g.gameplay.ballImage)||g.gameplay.ballImage.includes('..')))throw Error('球圖片必須指定 res/img 或 res/hd_img 中的圖片');
 for(const art of g.artLayers)if((art.src||'').endsWith('/plunger-rod.png')&&(art.state||'static')==='static')Object.assign(art,{state:'plunger',bind:'plunger'});
 const rescueGates=new Set(layout.objects.filter(o=>o.mechanic==='rescue-return').map(o=>o.id));
 for(const art of g.artLayers)if(rescueGates.has(art.bind)&&art.state!=='guide-arrow')art.state='return-gate';
 const wells=layout.objects.filter(o=>o.mechanic==='gravity-well');
 for(const art of g.artLayers)if((art.src||'').endsWith('/pirate-whirlpool.png')&&wells.length){const w=wells.find(w=>w.id===art.bind)||wells.reduce((a,b)=>Math.hypot(a.cx-art.x,a.cy-art.y)<=Math.hypot(b.cx-art.x,b.cy-art.y)?a:b);Object.assign(art,{state:'vortex',bind:w.id})}
 const rules={};for(const rule of g.gameplay.target_rules||[])for(const id of rule.objects)rules[id]=rule.id;
 const center=copy(LEGACY_CENTER_POST);
 g.lower=copy(layout.lockedLayout.filter(o=>!['main-perimeter','left-approach-outer-wall','shooter-divider'].includes(o.id)));
 if((layout.version||1)<6&&!g.lower.some(o=>o.id===center.id))g.lower.push(center);
 const topParts=copy(layout.topLayout||[]);
 let destination=g.lower;
 function poly(id,points,kind='wall',closed=false,extra={}){if(closed&&JSON.stringify(points[0])!==JSON.stringify(points.at(-1)))points=[...points,points[0]];const o={id,kind,points,closed,...extra};destination.push(o);return o}
 const transform=(o,[x,y])=>{const a=rad(o.angle);return[o.x+x*Math.cos(a)-y*Math.sin(a),o.y+x*Math.sin(a)+y*Math.cos(a)]};
 const floor=layout.lockedLayout.find(o=>o.id==='shooter-floor'),offset=floor?floor.points[0].map((v,i)=>v-SHOOTER_FLOOR_ORIGIN[i]):[0,0];g.lower_offset=offset;
 Object.assign(g.plunger,{launch_min:0,charge_seconds:2.5,charge_step_seconds:.025,launch_max:2100});
 for(const k of ['x','left','right'])g.plunger[k]+=offset[0];for(const k of ['rest_y','base_y'])g.plunger[k]+=offset[1];
 const rod=g.artLayers.find(o=>o.state==='plunger'&&!o.hidden);
 if(rod){const a=rad(rod.angle),dx=rod.x+Math.sin(a)*rod.height/2-g.plunger.x;for(const k of ['x','left','right'])g.plunger[k]+=dx;g.plunger.rest_y=rod.y-Math.cos(a)*rod.height/2}
 const launcher=layout.objects.find(o=>o.type==='plunger');if(launcher){const dx=launcher.x-g.plunger.x;for(const k of ['x','left','right'])g.plunger[k]+=dx;g.plunger.rest_y=launcher.y-4}
 g.plunger.layer=({lower:'lower',upper:'tavern',top:'top'}[launcher?.layer]||'lower');
 g.plunger.enabled=(layout.version||1)<6||!!(launcher||rod||floor);
 const collar=g.artLayers.find(o=>(o.src||'').endsWith('/plunger-collar.png')&&!o.hidden);if(collar)g.plunger.stroke=Math.max(0,collar.y-Math.cos(rad(collar.angle))*collar.height/2-g.plunger.rest_y);
 if((layout.version||1)<6)poly('shooter-divider-lower',[[311,300],[311,448],[316,448],[316,300]]);
 if((layout.version||1)>=6){const upper=copy(layout.upperLayout||[]);g.deck=upper.find(o=>o.kind==='deck')||{points:[]};g.ramp_triangles=upper.filter(o=>o.kind==='ramp-floor').map(o=>o.points);g.upper_parts=upper.filter(o=>!['deck','ramp-floor','portal','drop'].includes(o.kind));g.deck_exit=upper.find(o=>o.kind==='drop')||null;g.portals=g.portals.map(o=>upper.find(u=>u.kind==='portal'&&u.id===o.id)||o)}
 g.guided_tracks=[];g.visual_tracks=[];
 g.editor_transitions=[];g.oneway_speeds=[];g.gravity_zones=[];
 if(layout.gravityRegions!==undefined&&(!Array.isArray(layout.gravityRegions)||!layout.gravityRegions.every(o=>['gravityZone','slopeZone'].includes(o.type))))throw Error('區域資料不合法');
 for(const o of [...layout.objects,...(layout.gravityRegions||[])]){
  const t=o.type,key=o.id;if(o.slingshot!==undefined&&typeof o.slingshot!=='boolean')throw Error('Slingshot 設定不合法：'+key);if(o.bumperStrength!==undefined&&!['weak','strong'].includes(o.bumperStrength))throw Error('Bumper 強度不合法：'+key);if(o.reboundStrength!==undefined&&!['weak','strong'].includes(o.reboundStrength))throw Error('反彈強度不合法：'+key);if(t.startsWith('original_'))continue;destination=o.layer==='top'?topParts:o.layer==='upper'?g.upper_parts:g.lower;
  if(['rescue-kicker','rescue-return'].includes(o.mechanic))continue;
  if(o.stopOnEntry!==undefined&&typeof o.stopOnEntry!=='boolean')throw Error('跨層停球設定不合法：'+o.id);
   if(o.initialSpeed!==undefined&&(!Number.isFinite(o.initialSpeed)||o.initialSpeed<0))throw Error('單向線初速不合法：'+key);
  const points=()=>[[o.x1,o.y1],[o.x2,o.y2]],layer=o.layer||'lower';
  if(t==='slopeZone'){
   const vectors={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
   if(!Object.hasOwn(vectors,o.gravityDirection)||![o.x,o.y,o.width,o.height,o.slopeAngle].every(Number.isFinite)||o.width<1||o.height<1||o.slopeAngle<0||o.slopeAngle>=90||o.angle!==0||!['lower','upper','top'].includes(layer)||!SlopeRegions.valid(o.outline)||o.outline.some(p=>p.some(v=>Math.abs(v)>.500001)))throw Error('坡面區域設定不合法：'+key);
   g.gravity_zones.push({id:key,layer:layer==='upper'?'tavern':layer,x:o.x,y:o.y,width:o.width,height:o.height,points:SlopeRegions.worldPoints(o),direction:o.gravityDirection,slopeAngle:o.slopeAngle,acceleration:vectors[o.gravityDirection]});
  }else if(t==='gravityZone'){
   const vectors={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
   if(o.outline&&(!SlopeRegions.valid(o.outline)||o.outline.some(p=>p.some(v=>Math.abs(v)>.500001))))throw Error('重力區塊輪廓不合法：'+key);
   if(!Object.hasOwn(vectors,o.gravityDirection)||![o.x,o.y,o.width,o.height,o.gravityStrength].every(Number.isFinite)||o.width<1||o.height<1||o.gravityStrength<0||o.angle!==0||!['lower','upper','top'].includes(layer))throw Error('重力區塊設定不合法：'+key);
   g.gravity_zones.push({id:key,layer:layer==='upper'?'tavern':layer,x:o.x,y:o.y,width:o.width,height:o.height,...(o.outline?{points:SlopeRegions.worldPoints(o)}:{}),direction:o.gravityDirection,acceleration:vectors[o.gravityDirection].map(v=>v*o.gravityStrength)});
  }else if(o.mechanic==='layer-transition'){
   const layers={lower:'lower',upper:'tavern',top:'top'};
   if(t!=='oneway'||!Object.hasOwn(layers,o.fromLayer)||!Object.hasOwn(layers,o.toLayer)||o.fromLayer===o.toLayer||typeof o.bidirectional!=='boolean'||![1,-1].includes(o.direction)||![o.x1,o.y1,o.x2,o.y2].every(Number.isFinite)||dist(...points())<.5)throw Error('跨層入口線設定不合法：'+key);
   const length=dist(...points()),n=[-(o.y2-o.y1)/length*o.direction,(o.x2-o.x1)/length*o.direction];
   g.editor_transitions.push({id:key,points:points(),n,from:layers[o.fromLayer],to:layers[o.toLayer],stopOnEntry:o.stopOnEntry,initialSpeed:o.initialSpeed});
   if(o.bidirectional)g.editor_transitions.push({id:key,points:points(),n:n.map(v=>-v),from:layers[o.toLayer],to:layers[o.fromLayer],stopOnEntry:o.stopOnEntry,initialSpeed:o.initialSpeed});
  }else if(o.mechanic==='active-rebound'){
   if(t!=='line'||![o.x1,o.y1,o.x2,o.y2].every(Number.isFinite)||dist(...points())<.5)throw Error('彈片線尺寸不合法：'+key);
   poly(key,points(),'rebound',false,{mechanic:'active_rebound',reboundStrength:o.reboundStrength||'weak',slingshot:o.slingshot!==false,vpxSlingshot:o.slingshot!==false});
  }else if(o.mechanic==='guided-rail'){
   if(!['line','arc'].includes(t)||!['x1','y1','x2','y2',...(t==='arc'?['qx','qy']:[])].every(k=>Number.isFinite(o[k]))||dist(...points())<.5||!Number.isFinite(o.trackWidth)||o.trackWidth<14||o.trackWidth>60)throw Error('高架軌道尺寸不合法：'+key);
   const n=t==='arc'?Math.max(8,Math.ceil((Math.hypot(o.qx-o.x1,o.qy-o.y1)+Math.hypot(o.x2-o.qx,o.y2-o.qy))/1.5)):1;
   const ps=t==='arc'?Array.from({length:n+1},(_,i)=>{const u=i/n;return[(1-u)**2*o.x1+2*(1-u)*u*o.qx+u*u*o.x2,(1-u)**2*o.y1+2*(1-u)*u*o.qy+u*u*o.y2]}):points();
   if(o.ballSpeed!==undefined&&(!Number.isFinite(o.ballSpeed)||o.ballSpeed<0))throw Error('滑軌球速不合法：'+key);
   (o.visualOnly?g.visual_tracks:g.guided_tracks).push({id:key,points:ps,width:o.trackWidth,railMaterial:o.railMaterial,ballSpeed:o.ballSpeed,layer:layer==='upper'?'tavern':layer,showAboveArt:o.showAboveArt===true});
  }else if(t==='line'&&o.mechanic==='airdrop-rollover')poly(key,points(),'airdrop-rollover',false,{layer,collision:false});
  else if(t==='circle'&&o.mechanic==='gravity-well')destination.push({id:key,kind:'field',mechanic:'gravity-well',center:[o.cx,o.cy],radius:o.r,layer,collision:false});
  else if(t==='circle'&&o.mechanic==='solid-circle'){
   const n=Math.max(32,Math.ceil(2*Math.PI*o.r/2));
   poly(key,Array.from({length:n},(_,i)=>[o.cx+o.r*Math.cos(i*2*Math.PI/n),o.cy+o.r*Math.sin(i*2*Math.PI/n)]),'wall',true,{mechanic:o.mechanic});
  }
  else if(t==='circle'&&o.mechanic==='pachinko-pin')destination.push({id:key,kind:'wall',mechanic:o.mechanic,center:[o.cx,o.cy],radius:2});
  else if(t==='circle')destination.push({id:key,kind:'bumper',center:[o.cx,o.cy],radius:o.r,bumperStrength:o.bumperStrength||'weak'});
  else if(t==='rect')poly(key,[[-o.width/2,-o.height/2],[o.width/2,-o.height/2],[o.width/2,o.height/2],[-o.width/2,o.height/2]].map(p=>transform(o,p)),'wall',true);
  else if(t==='line')poly(key,points(),'rail');
  else if(t==='plunger')continue;
  else if(t==='sensor')poly(key,points(),'sensor',false,{layer,collision:false});
  else if(t==='thickline'){if(o.thickness!==5)throw Error('Invalid thick line: '+key);poly(key,points(),'rail',false,{thickness:5})}
  else if(t==='flipper'){
   const original=FLIPPER_REFERENCE.left,[ra,rb]=original.radii,length=dist(original.pivot,original.tip),local=-(length+ra+rb)/2+ra,pivot=transform(o,[local,0]),tip=transform(o,[local+length,0]),side=tip[0]>pivot[0]?'left':'right',src=FLIPPER_REFERENCE[side];
   const rest=Math.atan2(src.tip[1]-src.pivot[1],src.tip[0]-src.pivot[0]),raised=Math.atan2(src.raised[1]-src.pivot[1],src.raised[0]-src.pivot[0]),a=rad(o.angle)+Math.atan2(Math.sin(raised-rest),Math.cos(raised-rest));destination.push({id:key,kind:'flipper',pivot,tip,raised:[pivot[0]+length*Math.cos(a),pivot[1]+length*Math.sin(a)],radii:[ra,rb],control:side,profile:'tapered'});
  }else if(t==='oneway'){const dx=o.x2-o.x1,dy=o.y2-o.y1,length=Math.hypot(dx,dy);if(length<.5||![-1,1].includes(o.direction))throw Error('Invalid one-way line: '+key);const n=[-dy/length*o.direction,dx/length*o.direction];poly(key,points(),'rail',false,{pass_normal:n});if(o.initialSpeed>0)g.oneway_speeds.push({id:key,points:points(),n,layer:layer==='upper'?'tavern':layer,stopOnEntry:o.stopOnEntry,initialSpeed:o.initialSpeed});}
  else if(t==='arc'){const n=Math.max(8,Math.ceil((Math.hypot(o.qx-o.x1,o.qy-o.y1)+Math.hypot(o.x2-o.qx,o.y2-o.qy))/1.5));poly(key,Array.from({length:n+1},(_,i)=>{const t=i/n;return[(1-t)**2*o.x1+2*(1-t)*t*o.qx+t*t*o.x2,(1-t)**2*o.y1+2*(1-t)*t*o.qy+t*t*o.y2]}),'rail')}
  else if(t==='rebound'){const length=layout.templates[t].width-1;poly(key,[transform(o,[-length/2,0]),transform(o,[length/2,0])],'rebound',false,{mechanic:'active_rebound',reboundStrength:o.reboundStrength||'weak',slingshot:o.slingshot!==false,vpxSlingshot:o.slingshot!==false})}
  else if(t==='targets'||t==='target'){let i=0;for(const m of layout.templates[t].markup.matchAll(/<polygon points="([^"]+)"/g)){const ps=m[1].trim().split(/\s+/).map(p=>transform(o,p.split(',').map(Number)));poly(key+'-'+(++i),ps,'target',true,{target_group:rules[key]||key})}}
  else if(t==='triangleLeft'||t==='triangleRight'){
   const match=layout.templates?.[t]?.markup.match(/<polygon points="([^"]+)"/);
   if(!match)throw Error('三角擋板缺少輪廓：'+key);
   poly(key,match[1].trim().split(/\s+/).map(p=>transform(o,p.split(',').map(Number))),'rebound',true,{mechanic:'active_rebound',reboundStrength:o.reboundStrength||'weak',slingshot:o.slingshot!==false,vpxSlingshot:o.slingshot!==false});
  }
  else if(t==='ublock')poly(key,[[-12,11],[-12,-11],[12,-11],[12,11],[9,11],[9,-8],[-9,-8],[-9,11]].map(p=>transform(o,p)),'wall',true);
  else if(t==='blockhole'||t==='hole'&&o.mechanic==='vortex-center')destination.push({id:key,kind:'field',mechanic:'vortex-center',center:[o.x,o.y],radius:5.5,layer,collision:false});
  else if(t==='hole'){const nearby=layout.objects.filter(u=>u.type==='ublock'&&Math.hypot(u.x-o.x,u.y-o.y)<20).sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y)),a=nearby.length?rad(nearby[0].angle):0,direction=o.releaseMode==='fixed'?[Math.cos(rad(o.releaseAngle)),Math.sin(rad(o.releaseAngle))]:o.releaseMode==='cadet'?[-Math.sin(a),Math.cos(a)]:o.release_direction||[-Math.sin(a),Math.cos(a)],mag=Math.hypot(...direction);if(mag<=0)throw Error('Invalid socket release direction: '+key);const v=direction.map(v=>v/mag);destination.push({id:key,kind:'socket',center:[o.x,o.y],radius:5.5,release:o.release_point||[o.x+v[0]*14,o.y+v[1]*14],release_direction:v,release_mode:o.releaseMode||(o.release_direction?'fixed':'cadet'),...(o.release_point?{remote_release:true}:{}),...(o.mechanic==='shark-inlet'?{mechanic:o.mechanic}:{})})}
  else if(t==='flag')poly(key,'x1'in o?points():[transform(o,[-7,0]),transform(o,[7,0])],'flag',false,{layer,collision:false});
  else throw Error('Unsupported editor type: '+t);
 }
 function segmentDistance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)}
 const solids=g.lower.filter(o=>['wall','rail','active','rebound','bumper','target'].includes(o.kind));
 for(const socket of g.lower.filter(o=>o.kind==='socket'&&o.release)){
  // A teleport-only entrance never ejects here; destinations still need clearance.
  if(layout.objects.some(o=>o.id===socket.id&&o.exitHole)&&!layout.objects.some(o=>o.exitHole===socket.id))continue;
  const center=socket.remote_release?socket.release:socket.center,edges=[],circles=[],required=g.ball_radius+1;
  for(const solid of solids)if(solid.center)circles.push([solid.center,solid.radius,Math.max(0,required-dist(center,solid.center)+solid.radius)]);else for(let i=1;i<solid.points.length;i++){const a=solid.points[i-1],b=solid.points[i],distance=segmentDistance(center,a,b),r=(solid.thickness||0)/2;if(distance<30)edges.push([a,b,r,Math.max(0,required-distance+r)])}
  function clearance(v){let result=Infinity;for(let i=0;i<49;i++){const p=[center[0]+v[0]*i*.5,center[1]+v[1]*i*.5],fade=socket.remote_release?0:Math.max(0,1-i*.5/14);for(const [a,b,r,bias] of edges)result=Math.min(result,segmentDistance(p,a,b)-r+bias*fade);for(const [c,r,bias] of circles)result=Math.min(result,dist(p,c)-r+bias*fade);if(result<required-1e-7)return result;}return result}
  const preferred=socket.release_direction;if(clearance(preferred)<g.ball_radius+1-1e-7){if(socket.release_mode==='fixed')throw Error('指定射出角度被阻擋：'+socket.id);if(socket.remote_release)throw Error('Remote socket exit is obstructed: '+socket.id);const candidates=Array.from({length:72},(_,i)=>[Math.cos(rad(i*5)),Math.sin(rad(i*5))]).sort((a,b)=>(b[0]*preferred[0]+b[1]*preferred[1])-(a[0]*preferred[0]+a[1]*preferred[1])),v=candidates.find(v=>clearance(v)>=g.ball_radius+1-1e-7);if(!v)throw Error('Socket has no ball-width exit: '+socket.id);socket.release_direction=v;socket.release=[center[0]+v[0]*14,center[1]+v[1]*14]}
 }
 g.one_way_gates=g.one_way_gates.filter(o=>Math.min(...o.points.map(p=>p[1]))>=300);for(const gate of g.one_way_gates)gate.points=gate.points.map(p=>[p[0]+offset[0],p[1]+offset[1]]);
 const rescueLayer=o=>o.layer==='upper'?'tavern':o.layer||'lower';
 if((layout.version||1)>=6||g.gameplay.rescueGatesFromObjects||layout.objects.some(o=>o.mechanic==='rescue-return'))g.one_way_gates=layout.objects.filter(o=>o.mechanic==='rescue-return').map(o=>({id:o.id,mechanic:'rescue-return',side:o.side??null,layer:rescueLayer(o),points:[[o.x1,o.y1],[o.x2,o.y2]],normal:[-(o.y2-o.y1)*o.direction,(o.x2-o.x1)*o.direction]}));
 g.rescue_kickers=layout.objects.filter(o=>o.mechanic==='rescue-kicker').map(o=>({id:o.id,side:o.side,layer:rescueLayer(o),points:[[o.x1,o.y1],[o.x2,o.y2]],aim:o.aim,launch_point:o.launch_point??null,direction:o.direction??null,speed:o.speed??600}));
 g.extra_transitions=[];
 for(const o of layout.objects.filter(o=>o.layer==='upper'&&['enter','exit'].includes(o.transition))){const gate=g.upper_parts.find(p=>p.id===o.id);if(gate)g.extra_transitions.push({id:o.id,layer:gate.collision_layer||'tavern',points:gate.points,n:o.transition==='enter'?gate.pass_normal:gate.pass_normal.map(v=>-v),mode:o.transition,lip_clearance:g.ball_radius+1})}
 if(topParts.length){
  g.top_parts=topParts;
  g.top_transitions=layout.objects.filter(o=>o.layer==='top'&&['enter-top','exit-top'].includes(o.transition)).map(o=>{
   const gate=topParts.find(p=>p.id===o.id);return {id:o.id,points:gate.points,n:gate.pass_normal,from:o.transition==='enter-top'?'tavern':'top',to:o.transition==='enter-top'?'top':'tavern'};
  });
 }
 const adjacency=new Map(),pointMap=new Map();const key=p=>JSON.stringify(p.map(v=>Math.round(v*1e6)/1e6));
 for(const o of layout.objects.filter(o=>o.type==='line'&&(o.layer||'lower')==='lower'&&!o.mechanic)){const a=key([o.x1,o.y1]),b=key([o.x2,o.y2]);for(const [p,q] of [[a,b],[b,a]]){if(!adjacency.has(p))adjacency.set(p,[]);adjacency.get(p).push(q);pointMap.set(p,JSON.parse(p))}}
 g.preview_islands=[];const visited=new Set();for(const start of adjacency.keys()){if(visited.has(start))continue;const component=new Set(),stack=[start];while(stack.length){const p=stack.pop();if(component.has(p))continue;component.add(p);stack.push(...adjacency.get(p))}for(const p of component)visited.add(p);if(component.size<3||[...component].some(p=>adjacency.get(p).length!==2))continue;const path=[start];let previous=null,current=start;while(true){const next=adjacency.get(current).find(p=>p!==previous);if(next===start)break;path.push(next);previous=current;current=next}g.preview_islands.push(path.map(p=>pointMap.get(p)))}
 const launchOnly=new Set(layout.objects.filter(o=>o.collisionMode==='launch-only').map(o=>o.id));for(const p of [...g.lower,...g.upper_parts,...topParts])if(launchOnly.has(p.id))p.collisionMode='launch-only';
 g.view_box=[-7,-11,374,464];if(layout.screenLayout){const s=layout.screenLayout;g.view_box=[0,s.top,s.width,s.bottom-s.top];g.drain_top=s.top-40}
 return g;
}
root.compileLayout=compileLayout;
if(typeof module!=='undefined')module.exports=compileLayout;
})(globalThis);
