/* Gameplay references and observation windows: output/reports/touhou1-spellcards-reference-audit.json and touhou2-spellcards-reference-audit.json.
 * Reconstructed emitters, not original ECL. Distances/timing are adapted to the table.
 * Work in a 384 x 448 playfield; translate every emitter from the actual stage Boss.
 */
(function(root){'use strict';
const TAU=Math.PI*2,DEG=Math.PI/180;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Measured full-cycle return envelopes + 0.12 viewport margin.
// Reproduce with tests/measure_touhou_spell_bounds.cjs; regression compares
// every visible bullet to the unculled emitter, including offscreen returns.
const VIRTUAL_BOUNDS={"icicle-fall":{"left":-0.2,"top":-0.6,"right":1.2,"bottom":1.15},"leaf-veiling":{"left":-0.4,"top":-0.4,"right":1.4,"bottom":1.15},"gray-thaumaturgy":{"left":-1.25,"top":-1.15,"right":2.2,"bottom":1.9},"six-realms-sword":{"left":-0.4,"top":-0.55,"right":1.4,"bottom":1.15},"resurrection-butterfly":{"left":-0.15,"top":-0.2,"right":1.15,"bottom":1.15},"invisible-full-moon":{"left":-0.15,"top":-0.15,"right":1.15,"bottom":1.15},"phoenix-wing":{"left":-0.35,"top":-0.5,"right":1.35,"bottom":1.15},"light-dark-mesh":{"left":-1.15,"top":-0.15,"right":2.05,"bottom":1.7},"magical-r360":{"left":-0.2,"top":-0.2,"right":1.2,"bottom":1.2},"rainbow-wind-chime":{"left":-0.15,"top":-0.15,"right":1.15,"bottom":1.15},"shanghai-dolls":{"left":-0.2,"top":-0.2,"right":1.2,"bottom":1.2},"killing-doll":{"left":-0.55,"top":-0.7,"right":1.5,"bottom":1.2},"royal-flare":{"left":-0.35,"top":-0.2,"right":1.35,"bottom":1.15},"laevatein":{"left":-0.55,"top":-0.4,"right":1.55,"bottom":1.15},"scarlet-gensokyo":{"left":-0.2,"top":-0.2,"right":1.2,"bottom":1.2},"terrible-souvenir":{"left":-0.2,"top":-0.2,"right":1.2,"bottom":1.2},"release-of-id":{"left":-0.2,"top":-0.25,"right":1.2,"bottom":1.2}};
function sample(pattern,t,origin={x:.5,y:.12},aspect=361/642,targetAt=()=>({x:.5,y:.9}),emissionUntil=Infinity,state){
 const bullets=[],beams=[],sx=1/384,sy=(1-origin.y)/352;
 function aim(time){const target=targetAt(time);return Math.atan2((target.y-origin.y)/sy,(target.x-origin.x)/sx);}
 const bounds=state&&origin.x>=.1&&origin.x<=.9&&origin.y>=0&&origin.y<=.5&&aspect>=.35&&aspect<=1?VIRTUAL_BOUNDS[pattern]:null;
 function sparse(id){
  const stride=state?.stride??1,last=id.lastIndexOf(':'),index=Number(id.slice(last+1));
  if(stride>1&&index%stride!==0)return true;
  const density=state?.density??1;if(density>=1)return false;
  // Stable thinning after the shared lightweight stride. Shift by emission
  // group so short rings do not always lose the same angular position.
  const previous=id.lastIndexOf(':',last-1),group=Number(id.slice(previous+1,last)),slot=index/stride+group;
  return Math.floor((slot+1)*density+1e-9)===Math.floor(slot*density+1e-9);
 }
 function put(id,x,y,angle,kind,color,radius=4,alpha=1){
  if(kind!=='glow'&&sparse(id))return;
  if(bounds){const nx=origin.x+x*sx,ny=origin.y+y*sy;
   if(nx<bounds.left||nx>bounds.right||ny<bounds.top||ny>bounds.bottom){state.retired.add(id);return;}
  }
  bullets.push({id,x:origin.x+x*sx,y:origin.y+y*sy,angle:Math.atan2(Math.sin(angle)*sy/aspect,Math.cos(angle)*sx),kind,color,radius:radius*sx,alpha});
 }
 function shot(id,birth,x,y,angle,speed,kind,color,radius=4,alpha=1){const age=t-birth;if(age<0||birth>=emissionUntil||sparse(id)||state?.retired.has(id))return;put(id,x+Math.cos(angle)*speed*age,y+Math.sin(angle)*speed*age,angle,kind,color,radius,alpha);}

 function beam(x,y,angle,length,width,color,alpha=1,core=true){beams.push({x:origin.x+x*sx,y:origin.y+y*sy,dx:Math.cos(angle)*length*sx,dy:Math.sin(angle)*length*sy,width:width*sx,color,alpha,core});}
 // Integral of a constant-speed turn; continues along the final tangent afterwards.
 function turn(angle,speed,age,delay,rotation,turnTime){
  const straight=Math.min(age,delay),q=clamp(age-delay,0,turnTime),omega=rotation/turnTime;
  let x=Math.cos(angle)*speed*straight,y=Math.sin(angle)*speed*straight;
  if(q>0){if(Math.abs(omega)<1e-9){x+=Math.cos(angle)*speed*q;y+=Math.sin(angle)*speed*q;}else{x+=speed*(Math.sin(angle+omega*q)-Math.sin(angle))/omega;y+=speed*(Math.cos(angle)-Math.cos(angle+omega*q))/omega;}}
  const tail=Math.max(0,age-delay-turnTime),a=angle+omega*q;
  return {x:x+Math.cos(a)*speed*tail,y:y+Math.sin(a)*speed*tail,angle:a};
 }
 switch(pattern){
 case'icicle-fall':{
  // iY_e-WoVIqU 2-8s: three shards per side, sweeping launch direction;
  // outward deceleration, then a quarter-turn into crossing descending streams.
  // Table adaptation stretches the frontal opening to the lower central flippers.
  for(let wave=0;wave<=Math.floor(t/.45);wave++)for(const side of [-1,1])for(let row=0;row<3;row++){
   const id=`ice:${wave}:${side}:${row}`;if(sparse(id)||state?.retired.has(id))continue;
   const age=t-wave*.45,theta=(-10+(wave%11)*5.625)*DEG,a=side===1?theta:Math.PI-theta;
   const travel=86+row*55,u=Math.min(age/1.25,1),out=travel*(2*u-u*u),after=Math.max(0,age-1.25),v=side===1?89:78,down=a+(side===1?1:-1)*Math.PI/2;
   const x=Math.cos(a)*out+Math.cos(down)*v*after,y=Math.sin(a)*out+Math.sin(down)*v*after;
   put(id,x*1.7,y*4.76,age<1.25?a:down,'ice','#a6a8ff',5);
  }
  break;
 }
 case'leaf-veiling':{
  // oOKAZ_Mmtp8 2.3-8s: 28 arms (original reference density restored). Each row curls around Aya before
  // being released; opposite bends make the interlocking green/white petals.
  for(let cycle=0;cycle<=Math.floor(t/4.2);cycle++)for(let row=0;row<24;row++)for(let arm=0;arm<28;arm++){
   const id=`leaf:${cycle}:${row}:${arm}`;if(sparse(id)||state?.retired.has(id))continue;
   const birth=cycle*4.2+row*.047,age=t-birth;if(age<0)continue;
   const sign=row%2?1:-1,a=arm*TAU/28+row*.012;
   const p=turn(a,106,age,.72,sign*TAU,2.6);
   put(id,p.x,p.y,p.angle,'rice',row%2?'#8eeac2':'#e6ffdc',3.6);
  }
  break;
 }
 case'gray-thaumaturgy':{
  if(state)state.geometry??=new Map();
  // Npr0OwAaERQ 2.4-9s: one star separates into five smaller stars.
  // Their points subsequently curl into loops; this is not a growing outline.
  for(let cycle=0;cycle<=Math.floor(t/7.2);cycle++)for(let color=0;color<2;color++)for(let vertex=0;vertex<5;vertex++)for(let edge=0;edge<5;edge++)for(let n=0;n<13;n++){
   const id=`star:${cycle}:${color}:${vertex}:${edge}:${n}`;if(sparse(id)||state?.retired.has(id))continue;
   const age=t-cycle*7.2-color*.16;if(age<0)continue;
   let geometry=state?.geometry.get(id);
   if(!geometry){
    const rotation=-Math.PI/2+color*Math.PI/5,a=rotation+edge*TAU*2/5,b=a+TAU*2/5,u=n/13,axis=rotation+vertex*TAU/5;
    geometry={px:Math.cos(a)*(1-u)+Math.cos(b)*u,py:Math.sin(a)*(1-u)+Math.sin(b)*u,u,ax:Math.cos(axis),ay:Math.sin(axis)};
    if(state)state.geometry.set(id,geometry);
   }
   const {px,py,u,ax,ay}=geometry,initial=Math.min(age,.9)*40,separation=clamp(age-.9,0,2.0)*52;
   const split=clamp((age-.9)/.75,0,1),size=(1-split)*initial*1.65+split*58,curl=Math.max(0,age-2.9),phase=curl*(color?-1:1)*1.55+u*TAU;
   // At formation the five copies coincide. They then travel along the five axes.
   const dx=ax*separation,dy=ay*separation;
   const x=dx+px*size+curl*(ax*28+Math.cos(phase)*23),y=dy+py*size+curl*(ay*28+Math.sin(phase)*23);
   put(id,x,y,Math.atan2(py,px)+phase,'round',color?'#ffc6dc':'#8baaff',2.7);
  }
  break;
 }
 case'six-realms-sword':{
  // xHyCQfUgukY 21-34s: two interlaced squares, followed by purple
  // arrow rows along the cuts. Four fixed volleys, then repeat; no time freeze.
  const directions=[-1,-1,1,1];
  for(let wave=0;wave<=Math.floor(Math.min(t,emissionUntil)/3.05);wave++)for(let cut=0;cut<8;cut++){
   const phase=wave%4,a=-Math.PI/2+cut*TAU/8,b=a+Math.PI/2,r=144;
   const x0=Math.cos(a)*r,y0=Math.sin(a)*r,x1=Math.cos(b)*r,y1=Math.sin(b)*r,edge=Math.atan2(y1-y0,x1-x0),birth=wave*3.05+cut*.045,age=t-birth;
   if(age<0||birth>=emissionUntil)continue;
   if(age<.65)beam(x0,y0,edge,Math.hypot(x1-x0,y1-y0),2.4,'#d7f5ff',Math.min(1,age*18,(.65-age)*8),false);
   for(let row=0;row<3;row++)for(let n=0;n<24;n++){
    const u=(n+.5+(phase%2)*.2)/24,direction=edge+directions[phase]*Math.PI/2;
    shot(`sword:${wave}:${cut}:${row}:${n}`,birth+.58+row*.07,x0+(x1-x0)*u,y0+(y1-y0)*u,direction,48+row*10,'arrow','#b875ee',4);
   }
  }
  break;
 }
 case'resurrection-butterfly':{
  // KtEmxuwtHJo: blue/purple straight waves + fixed lasers, alternating
  // with red waves that kink to each side. Never replace the whole card by spirals.
  for(let cycle=0;cycle<=Math.floor(t/6.65);cycle++){
   const start=cycle*6.65,ways=31+cycle*3;
   for(let row=0;row<3;row++)for(let color=0;color<2;color++)for(let j=0;j<ways;j++)shot(`butterfly-blue:${cycle}:${row}:${color}:${j}`,start+row*.19+color*.07,0,0,j*TAU/ways+color*Math.PI/ways,91,'butterfly',color?'#bc8bff':'#7da7ff',5);
   const age=t-start,laserCount=6+cycle*2;
   if(age>.35&&age<3.2)for(let j=0;j<laserCount;j++)beam(0,0,j*TAU/laserCount+.16,780,age<.85?1:3,j%2?'#ff8ce7':'#8cefff',age<.85?.24:Math.min(1,(3.2-age)*3));
   for(let group=0;group<2;group++)for(let row=0;row<3;row++)for(let j=0;j<(group?35:27);j++){
    const id=`butterfly-red:${cycle}:${group}:${row}:${j}`;if(sparse(id)||state?.retired.has(id))continue;
    const birth=start+2.65+group*.54+row*.13,age=t-birth;if(age<0)continue;
    const a=j*TAU/(group?35:27)+group*.045,p=turn(a,96,age,1.0,(group?-.28:.28)*(1+cycle*.12),.4);
    put(id,p.x,p.y,p.angle,'butterfly','#ff5c78',5);
   }
  }
  break;
 }
 case'invisible-full-moon':{
  // mIaQff0fP2M 7-18s: whole red/blue rings; illusion is synchronized
  // across the rice bullets. Blue familiar pellets remain visible between flashes.
  const phase=t%3.2,alpha=phase>=2.65||phase<.32?0:clamp(Math.min((phase-.32)/.13,(2.65-phase)/.13),0,1);
  for(let wave=0;wave<=Math.floor(t/.44);wave++){
   for(let j=0;j<88;j++)shot(`moon:${wave}:${j}`,wave*.44,0,0,j*TAU/88+wave*.018,112,'rice',wave%2?'#9b9dff':'#ffc1c4',4,alpha);
   for(let j=0;j<20;j++)shot(`moon-pellet:${wave}:${j}`,wave*.44+.18,0,0,j*TAU/20+wave*.12,68,'round','#929cff',3.2);
  }
  break;
 }
 case'phoenix-wing':{
  // eoZ72G9-hiI 9-20s: complete rice-bullet wreaths launch first;
  // the red packets then rush along their aimed heading, leaving broad wings.
  // Snapshot the aim once per packet, rather than homing every bullet every frame.
  for(let wave=0;wave<=Math.floor(t/1.6);wave++)for(let row=0;row<5;row++)for(let j=0;j<36;j++){
   const id=`phoenix:${wave}:${row}:${j}`;if(sparse(id)||state?.retired.has(id))continue;
   const birth=wave*1.6+row*.065,age=t-birth;if(age<0)continue;
   const a=j*TAU/36,heading=aim(wave*1.6),p=turn(a,96+row*8,age,.55,Math.atan2(Math.sin(heading-a),Math.cos(heading-a))*.8,.65);
   put(id,p.x,p.y,p.angle,'fire','#ff523d',5.2-row*.25);
  }
  break;
 }
 case'light-dark-mesh':{
  // HCBIwCRCOtI 5-11s: blue and red travelling sources pass on opposite
  // sides, shedding round pellets and perpendicular lasers. Next pair swaps sides.
  for(let wave=0;wave<=Math.floor(t/4.5);wave++)for(let side=0;side<2;side++){
   const birth=wave*4.5+side*.22,age=t-birth;if(age<0)continue;
   const sign=(side?1:-1)*(wave%2?-1:1),a=aim(wave*4.5)-sign*.54,color=side?'#ff343f':'#4869ff',speed=109;
   const head={x:Math.cos(a)*speed*age,y:Math.sin(a)*speed*age};
   if(!state?.retired.has(`mesh-head:${wave}:${side}`))put(`mesh-head:${wave}:${side}`,head.x,head.y,a,'orb',color,11);
   for(let node=0;node<=Math.floor(age/.5);node++){
    const at=node*.5,x=Math.cos(a)*speed*at,y=Math.sin(a)*speed*at,life=age-at;
    if(life<3.3){const laser=a+Math.PI/2;beam(x-Math.cos(laser)*650,y-Math.sin(laser)*650,laser,1300,life<.65?.65:3,color,life<.65?.25:clamp((3.3-life)*2,0,1));}
    for(let j=0;j<7;j++)shot(`mesh-pellet:${wave}:${side}:${node}:${j}`,birth+at, x,y,j*TAU/7+node*.43,25+(j%3)*11,'round',color,2.8+(j%2));
   }
  }
  break;
 }
 case'magical-r360':{
  // zJn8RIdbjuk: outward coloured star volleys, a held straight Spark,
  // then a rapid complete turn. Launched stars keep travelling during the beam.
  const phase=t%7.2,charge=phase<1.0,turning=phase>=4.0&&phase<5.6,angle=Math.PI/2+(turning?TAU*(phase-4)/1.6:phase>=5.6?TAU:0);
  if(phase<5.6){beam(0,0,angle,1100,charge?1:52,'#8edbff',charge?.3:Math.min(1,(phase-1)*6),!charge);}
  for(let cycle=0;cycle<=Math.floor(t/7.2);cycle++)for(const [wave,delay] of [0,.22,.44,5.8,6.02,6.24].entries())for(let j=0;j<12;j++){
   const id=`spark-star:${cycle}:${wave}:${j}`;if(sparse(id)||state?.retired.has(id))continue;
   const birth=cycle*7.2+delay,age=t-birth;if(age<0)continue;
   const a=j*TAU/12+wave*.13,dist=(64+wave%3*13)*age;
   put(id,Math.cos(a)*dist,Math.sin(a)*dist,a+age*1.7,'star',['#fff07d','#9fd7ff','#c999ff','#9cffb5','#ffaddb'][j%5],8+wave%3*2);
  }
  break;
 }
 case'rainbow-wind-chime':{
  // pO3VYEG2f6Y 3-12s: 24 rainbow spokes, full density restored;
  // Meiling uses stride 1: preserve all rays, cadence and turn rate.
  const colors=['#ffacba','#ffd2a1','#fff1a0','#b9f4a7','#a7f5e3','#b8ceff','#e9b7ff'];
  for(let wave=0;wave<=Math.floor(t/.115);wave++)for(let j=0;j<24;j++)shot(`rainbow:${wave}:${j}`,wave*.115,0,0,j*TAU/24+wave*.105,88+(wave%5)*4,'rice',colors[(wave+Math.floor(j/4))%7],4.2);
  break;
 }
 case'shanghai-dolls':{
  // Zw3EuAhG1ko 6-16s: rotating yellow/blue wedge rings and purple
  // large-ball waves. The card's name does not mean that every shot is a doll.
  for(let wave=0;wave<=Math.floor(t/.16);wave++)for(let j=0;j<24;j++)shot(`shanghai-wedge:${wave}:${j}`,wave*.16,0,0,j*TAU/24+wave*.155,76+wave%3*7,'arrow',wave%12<6?'#ffe98c':'#a1beff',4.4);
  for(let wave=0;wave<=Math.floor(t/1.65);wave++)for(let j=0;j<10;j++)shot(`shanghai-orb:${wave}:${j}`,wave*1.65+.8,0,0,j*TAU/10+wave*.24,72,'orb','#b499ff',13);
  break;
 }
 case'killing-doll':{
  // on2P3NfhsYk 1-12s: wide blue knives + aimed red rows. During
  // the stop, only some knives become green and scatter in new directions.
  // Re-aiming every blue knife at one point wrongly collapses the entire field.
  const random=n=>{const v=Math.sin(n*12.9898)*43758.5453;return v-Math.floor(v);};
  for(let cycle=0;cycle<=Math.floor(t/3.8);cycle++)for(let row=0;row<5;row++)for(let family=0;family<2;family++)for(let j=0;j<(family?9:40);j++){
   const id=family?`knife-red:${cycle}:${row}:${j}`:`knife:${cycle}:${row}:${j}`;if(sparse(id)||state?.retired.has(id))continue;
   const birth=cycle*3.8+row*.055,age=t-birth;if(age<0)continue;
   const seed=cycle*409+row*47+j+family*701,a=family?aim(birth)+(j-4)*.026:j*TAU/40+row*.025;
   const speed=family?116+row*8:172+row*12,distance=speed*Math.min(age,.85),x=Math.cos(a)*distance,y=Math.sin(a)*distance,changed=random(seed)<.68;
   const color=family?'#ff8b9b':'#b3c8ff';
   if(age<1.4)put(id,x,y,a,'knife',color,5.8);
   else shot(id,birth+1.4,x,y,changed?random(seed+211)*TAU:a,119+row*6,'knife',changed?'#7ff5ae':color,5.8);
  }
  break;
 }
 case'royal-flare':{
  // rwQmSs31O_8 3-12s: three revolving red fire sources leave
  // continuous bead streams, opening the characteristic triangular loops.
  for(let source=0;source<3;source++){
   const phase=t%5.2,r=Math.min(t/.8,1)*(32+Math.sin(phase*Math.PI/5.2)*94),a=source*TAU/3+t*1.35;
   put(`sun:${source}`,Math.cos(a)*r,Math.min(t*100,110)+Math.sin(a)*r,a,'glow','#ff6b76',14);
   for(let n=0;n<=Math.floor(t/.065);n++){
    const birth=n*.065,phase=birth%5.2,r=Math.min(birth/.8,1)*(32+Math.sin(phase*Math.PI/5.2)*94),a=source*TAU/3+birth*1.35;
    shot(`flare:${source}:${n}`,birth,Math.cos(a)*r,Math.min(birth*100,110)+Math.sin(a)*r,a+Math.PI/2,59,'round','#ff7185',3.7);
   }
  }
  break;
 }
 case'laevatein':{
  // wr_1YxuJyb0 3-12s: extend the red sword, sweep across the field,
  // reverse the next stroke. White rice bullets peel off the sword's path.
  for(let cycle=0;cycle<=Math.floor(t/3.7);cycle++){
   const start=cycle*3.7,age=t-start,sign=cycle%2?-1:1,angleAt=q=>sign===1?-.3+Math.PI*clamp((q-.55)/1.65,0,1):Math.PI+.3-Math.PI*clamp((q-.55)/1.65,0,1);
   if(age<2.3)beam(0,0,angleAt(age),650*Math.min(1,age/.55),age<.55?1.2:15,'#ff4656',age<.55?.4:clamp((2.3-age)*7,0,1));
   for(let sweep=0;sweep<25;sweep++)for(let n=1;n<=12;n++){
    const birth=start+.55+sweep*.065,a=angleAt(.55+sweep*.065),r=n*25;
    shot(`sword-trail:${cycle}:${sweep}:${n}`,birth,Math.cos(a)*r,Math.sin(a)*r,a+sign*Math.PI/2,53,'rice','#ffd4d7',3.6);
   }
  }
  break;
 }
 case'scarlet-gensokyo':{
  // P-LvcuPxep0 3-12s: dense red/white rotating spokes interrupted
  // by the broad purple large-ball ring. Both families remain on screen.
  for(let wave=0;wave<=Math.floor(t/.15);wave++)for(let j=0;j<24;j++)shot(`scarlet:${wave}:${j}`,wave*.15,0,0,j*TAU/24+Math.sin(wave*.07)*1.15,91+wave%4*4,'round','#ff8189',3.2);
  for(let wave=0;wave<=Math.floor(t/3.1);wave++)for(let j=0;j<16;j++)shot(`scarlet-orb:${wave}:${j}`,wave*3.1+.4,0,0,j*TAU/16+wave*.16,103,'orb','#ed92ef',14);
  break;
 }
 case'terrible-souvenir':{
  // Wte1JsHPCi8 3-14s: fixed radial red laser warnings/fire;
  // yellow expanding circles and a revolving chain of purple large balls.
  for(let cycle=0;cycle<=Math.floor(t/3.2);cycle++){
   const start=cycle*3.2,age=t-start;
   if(age<2.1)for(let j=0;j<18;j++)beam(0,0,j*TAU/18,850,age<.8?.7:3,'#ff5365',age<.8?.25:clamp((2.1-age)*4,0,1));
   for(let row=0;row<6;row++)for(let j=0;j<24;j++)shot(`memory-pellet:${cycle}:${row}:${j}`,start+1.3+row*.14,0,0,j*TAU/24+row*.045,91,'round','#fff2a5',3.3);
   if(cycle>0)for(let row=0;row<12;row++)shot(`memory-orb:${cycle}:${row}`,start+.15+row*.095,0,0,row*.16+cycle*1.5,91,'orb','#c49dff',13);
  }
  break;
 }
 case'release-of-id':{
  // VfeVWXEjS3c 3-12s: pink heart spirals that curl and continue
  // outwards. No safe-area masks or generic round-bullet substitution.
  for(let wave=0;wave<=Math.floor(t/.16);wave++)for(let j=0;j<18;j++){
   const id=`id-heart:${wave}:${j}`;if(sparse(id)||state?.retired.has(id))continue;
   const birth=wave*.16,age=t-birth,a=j*TAU/18+wave*.085;
   const p=turn(a,73,age,.65,.7,1.05);
   put(id,p.x,p.y,p.angle,'heart','#ffb8da',6.4);
  }
  break;
 }
 default:throw Error('Unknown Touhou spell pattern '+pattern);
 }
 return {bullets,beams};
}

// Playback keeps emission events and live bullets for both Touhou chapters. The stateless sample
// above remains the reference/seek fallback; fixed geometry is prepared once.
function createSimulation(pattern,{duration=14,origin={x:.5,y:.12},aspect=361/642,targetAt=()=>({x:.5,y:.9}),emissionUntil=Infinity,stride=2,density=1,onRetire=()=>{}}={}){
 const supported=['icicle-fall','leaf-veiling','gray-thaumaturgy','six-realms-sword','resurrection-butterfly','invisible-full-moon','phoenix-wing','light-dark-mesh','magical-r360','rainbow-wind-chime','shanghai-dolls','killing-doll','royal-flare','laevatein','scarlet-gensokyo','terrible-souvenir','release-of-id'];
 if(!supported.includes(pattern))return null;
 const sx=1/384,sy=(1-origin.y)/352,bounds=origin.x>=.1&&origin.x<=.9&&origin.y>=0&&origin.y<=.5&&aspect>=.35&&aspect<=1?VIRTUAL_BOUNDS[pattern]:null;
 const events=[],active=[],beamEvents=[],activeBeams=[],output={bullets:[],beams:[]},stats={events:0,spawned:0,retired:0,visited:0};let order=0,cursor=0,beamCursor=0,last=-Infinity;
 const project=a=>Math.atan2(Math.sin(a)*sy/aspect,Math.cos(a)*sx);
 const skip=id=>{const end=id.lastIndexOf(':'),index=Number(id.slice(end+1));if(index%stride)return true;if(density>=1)return false;const previous=id.lastIndexOf(':',end-1),group=Number(id.slice(previous+1,end)),slot=index/stride+group;return Math.floor((slot+1)*density+1e-9)===Math.floor(slot*density+1e-9);};
 function add(id,birth,type,kind,color,radius,extra={}){
  const rank=order++;if(birth>duration||birth>=emissionUntil||kind!=='glow'&&skip(id))return;
  const d={id,birth,type,order:rank,kind,color,radius,...extra};d.bullet={id,x:0,y:0,angle:0,kind,color,radius:radius*sx,alpha:1};events.push(d);return d;
 }
 function linear(id,birth,x,y,a,speed,kind,color,radius){add(id,birth,0,kind,color,radius,{x0:x,y0:y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,angle:project(a)});}
 const aimCache=new Map(),aim=t=>{if(!aimCache.has(t)){const target=targetAt(t);aimCache.set(t,Math.atan2((target.y-origin.y)/sy,(target.x-origin.x)/sx));}return aimCache.get(t);};
 const random=n=>{const v=Math.sin(n*12.9898)*43758.5453;return v-Math.floor(v);};

 function setupTurn(d){
  const {a,speed,delay,rotation,turnTime}=d;d.cos=Math.cos(a);d.sin=Math.sin(a);d.omega=rotation/turnTime;const end=a+d.omega*turnTime;
  d.cosEnd=Math.cos(end);d.sinEnd=Math.sin(end);d.angleStart=project(a);d.angleEnd=project(end);
  d.xEnd=d.cos*speed*delay;d.yEnd=d.sin*speed*delay;
  if(Math.abs(d.omega)<1e-9){d.xEnd+=d.cos*speed*turnTime;d.yEnd+=d.sin*speed*turnTime;}
  else{d.xEnd+=speed*(d.sinEnd-d.sin)/d.omega;d.yEnd-=speed*(d.cosEnd-d.cos)/d.omega;}
 }
 function updateTurn(d,age){
  const q=clamp(age-d.delay,0,d.turnTime),straight=Math.min(age,d.delay);
  if(q===d.turnTime){const tail=Math.max(0,age-d.delay-d.turnTime);d.x=d.xEnd+d.cosEnd*d.speed*tail;d.y=d.yEnd+d.sinEnd*d.speed*tail;d.outAngle=d.angleEnd;return;}
  d.x=d.cos*d.speed*straight;d.y=d.sin*d.speed*straight;d.outAngle=d.angleStart;
  if(q>0){const a=d.a+d.omega*q,sin=Math.sin(a),cos=Math.cos(a);if(Math.abs(d.omega)<1e-9){d.x+=d.cos*d.speed*q;d.y+=d.sin*d.speed*q;}else{d.x+=d.speed*(sin-d.sin)/d.omega;d.y-=d.speed*(cos-d.cos)/d.omega;}d.outAngle=Math.atan2(sin*sy/aspect,cos*sx);}
 }
 function curve(id,birth,a,speed,delay,rotation,turnTime,kind,color,radius){const d=add(id,birth,4,kind,color,radius,{a,speed,delay,rotation,turnTime,update:updateTurn});if(d)setupTurn(d);return d;}
 function scheduleBeam(d){d.order=beamEvents.length;if(d.birth<=duration)beamEvents.push(d);}
 // Match reference floor/subtraction eligibility at floating-point wave boundaries.
 function eligible(d,t){
  if(d.wave!==undefined&&(pattern==='icicle-fall'||pattern==='release-of-id'))return d.wave<=Math.floor(t/(pattern==='icicle-fall'?.45:.16));
  if(pattern==='gray-thaumaturgy')return t-d.cycle*7.2-d.colorIndex*.16>=0;
  if(d.parentBirth!==undefined)return d.birth<=t&&Math.floor((t-d.parentBirth)/.5)>=d.node;
  return d.birth<=t;
 }
 function updateIce(d,age){const u=Math.min(age/1.25,1),out=d.travel*(2*u-u*u),after=Math.max(0,age-1.25);d.x=(d.cos*out+d.cosDown*d.v*after)*1.7;d.y=(d.sin*out+d.sinDown*d.v*after)*4.76;d.outAngle=age<1.25?d.angleStart:d.angleEnd;}
 // Five star copies share the same thirteen curl phases and projected angles.
 function updateGray(d,age,t){
  const g=d.group;if(g.stamp!==t){
   const a=t-g.cycle*7.2-g.color*.16,initial=Math.min(a,.9)*40,split=clamp((a-.9)/.75,0,1);
   g.separation=clamp(a-.9,0,2)*52;g.size=(1-split)*initial*1.65+split*58;g.curl=Math.max(0,a-2.9);g.angles.fill(NaN);
   for(let n=0;n<13;n++){const phase=g.curl*(g.color?-1:1)*1.55+n/13*TAU;g.phases[n]=phase;g.cos[n]=Math.cos(phase);g.sin[n]=Math.sin(phase);}g.stamp=t;
  }
  d.x=d.ax*g.separation+d.px*g.size+g.curl*(d.ax*28+g.cos[d.n]*23);d.y=d.ay*g.separation+d.py*g.size+g.curl*(d.ay*28+g.sin[d.n]*23);
  const index=d.edge*13+d.n;if(Number.isNaN(g.angles[index]))g.angles[index]=project(d.staticAngle+g.phases[d.n]);d.outAngle=g.angles[index];
 }
 function updateSpark(d,age){const dist=d.speed*age;d.x=d.cos*dist;d.y=d.sin*dist;d.outAngle=project(d.a+age*1.7);}
 if(pattern==='icicle-fall'){
  for(let wave=0;wave<=Math.floor(duration/.45);wave++)for(const side of [-1,1])for(let row=0;row<3;row++){
   const theta=(-10+(wave%11)*5.625)*DEG,a=side===1?theta:Math.PI-theta,down=a+(side===1?1:-1)*Math.PI/2;
   add(`ice:${wave}:${side}:${row}`,wave*.45,4,'ice','#a6a8ff',5,{wave,travel:86+row*55,v:side===1?89:78,cos:Math.cos(a),sin:Math.sin(a),cosDown:Math.cos(down),sinDown:Math.sin(down),angleStart:project(a),angleEnd:project(down),update:updateIce});
  }
 }else if(pattern==='leaf-veiling'){
  for(let cycle=0;cycle<=Math.floor(duration/4.2);cycle++)for(let row=0;row<24;row++)for(let arm=0;arm<28;arm++)curve(`leaf:${cycle}:${row}:${arm}`,cycle*4.2+row*.047,arm*TAU/28+row*.012,106,.72,(row%2?1:-1)*TAU,2.6,'rice',row%2?'#8eeac2':'#e6ffdc',3.6);
 }else if(pattern==='gray-thaumaturgy'){
  for(let cycle=0;cycle<=Math.floor(duration/7.2);cycle++)for(let color=0;color<2;color++){
   const group={cycle,color,stamp:NaN,angles:new Float64Array(65),phases:new Float64Array(13),cos:new Float64Array(13),sin:new Float64Array(13)};
   for(let vertex=0;vertex<5;vertex++)for(let edge=0;edge<5;edge++)for(let n=0;n<13;n++){
    const rotation=-Math.PI/2+color*Math.PI/5,a=rotation+edge*TAU*2/5,b=a+TAU*2/5,u=n/13,px=Math.cos(a)*(1-u)+Math.cos(b)*u,py=Math.sin(a)*(1-u)+Math.sin(b)*u,axis=rotation+vertex*TAU/5;
    add(`star:${cycle}:${color}:${vertex}:${edge}:${n}`,cycle*7.2+color*.16,4,'round',color?'#ffc6dc':'#8baaff',2.7,{cycle,colorIndex:color,group,edge,n,px,py,ax:Math.cos(axis),ay:Math.sin(axis),staticAngle:Math.atan2(py,px),update:updateGray});
   }
  }
 }else if(pattern==='six-realms-sword'){
  const directions=[-1,-1,1,1];
  for(let wave=0;wave<=Math.floor(Math.min(duration,emissionUntil)/3.05);wave++)for(let cut=0;cut<8;cut++){
   const phase=wave%4,a=-Math.PI/2+cut*TAU/8,b=a+Math.PI/2,r=144,x0=Math.cos(a)*r,y0=Math.sin(a)*r,x1=Math.cos(b)*r,y1=Math.sin(b)*r,edge=Math.atan2(y1-y0,x1-x0),birth=wave*3.05+cut*.045;
   if(birth>=emissionUntil)continue;scheduleBeam({kind:'sword',birth,x:x0,y:y0,a:edge,length:Math.hypot(x1-x0,y1-y0),end:birth+.65});
   for(let row=0;row<3;row++)for(let n=0;n<24;n++){const u=(n+.5+(phase%2)*.2)/24,direction=edge+directions[phase]*Math.PI/2;linear(`sword:${wave}:${cut}:${row}:${n}`,birth+.58+row*.07,x0+(x1-x0)*u,y0+(y1-y0)*u,direction,48+row*10,'arrow','#b875ee',4);}
  }
 }else if(pattern==='resurrection-butterfly'){
  for(let cycle=0;cycle<=Math.floor(duration/6.65);cycle++){
   const start=cycle*6.65,ways=31+cycle*3;
   for(let row=0;row<3;row++)for(let color=0;color<2;color++)for(let j=0;j<ways;j++)linear(`butterfly-blue:${cycle}:${row}:${color}:${j}`,start+row*.19+color*.07,0,0,j*TAU/ways+color*Math.PI/ways,91,'butterfly',color?'#bc8bff':'#7da7ff',5);
   for(let j=0;j<6+cycle*2;j++)scheduleBeam({kind:'butterfly',birth:start+.35,start,j,count:6+cycle*2,end:start+3.2});
   for(let group=0;group<2;group++)for(let row=0;row<3;row++)for(let j=0;j<(group?35:27);j++)curve(`butterfly-red:${cycle}:${group}:${row}:${j}`,start+2.65+group*.54+row*.13,j*TAU/(group?35:27)+group*.045,96,1,(group?-.28:.28)*(1+cycle*.12),.4,'butterfly','#ff5c78',5);
  }
 }else if(pattern==='invisible-full-moon'){
  for(let wave=0;wave<=Math.floor(duration/.44);wave++){
   for(let j=0;j<88;j++){linear(`moon:${wave}:${j}`,wave*.44,0,0,j*TAU/88+wave*.018,112,'rice',wave%2?'#9b9dff':'#ffc1c4',4);const d=events.at(-1);if(d&&d.id===`moon:${wave}:${j}`)d.blink=true;}
   for(let j=0;j<20;j++)linear(`moon-pellet:${wave}:${j}`,wave*.44+.18,0,0,j*TAU/20+wave*.12,68,'round','#929cff',3.2);
  }
 }else if(pattern==='phoenix-wing'){
  for(let wave=0;wave<=Math.floor(duration/1.6);wave++)for(let row=0;row<5;row++)for(let j=0;j<36;j++)add(`phoenix:${wave}:${row}:${j}`,wave*1.6+row*.065,4,'fire','#ff523d',5.2-row*.25,{a:j*TAU/36,speed:96+row*8,delay:.55,turnTime:.65,waveBirth:wave*1.6,prepareKind:'phoenix',update:updateTurn});
 }else if(pattern==='light-dark-mesh'){
  for(let wave=0;wave<=Math.floor(duration/4.5);wave++)for(let side=0;side<2;side++){
   const birth=wave*4.5+side*.22,sign=(side?1:-1)*(wave%2?-1:1),color=side?'#ff343f':'#4869ff',waveBirth=wave*4.5;
   add(`mesh-head:${wave}:${side}`,birth,0,'orb',color,11,{x0:0,y0:0,waveBirth,sign,prepareKind:'mesh-head'});
   for(let node=0;node<=Math.floor((duration-birth)/.5);node++){
    const at=node*.5;scheduleBeam({kind:'mesh',birth:birth+at,parentBirth:birth,waveBirth,sign,node,at,color,end:birth+at+3.3});
    for(let j=0;j<7;j++){const a=j*TAU/7+node*.43,speed=25+j%3*11;add(`mesh-pellet:${wave}:${side}:${node}:${j}`,birth+at,0,'round',color,2.8+j%2,{parentBirth:birth,node,waveBirth,sign,at,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,angle:project(a),prepareKind:'mesh-pellet'});}
   }
  }
 }else if(pattern==='magical-r360'){
  for(let cycle=0;cycle<=Math.floor(duration/7.2);cycle++)for(const [wave,delay] of [0,.22,.44,5.8,6.02,6.24].entries())for(let j=0;j<12;j++){const a=j*TAU/12+wave*.13;add(`spark-star:${cycle}:${wave}:${j}`,cycle*7.2+delay,4,'star',['#fff07d','#9fd7ff','#c999ff','#9cffb5','#ffaddb'][j%5],8+wave%3*2,{a,cos:Math.cos(a),sin:Math.sin(a),speed:64+wave%3*13,update:updateSpark});}
 }else if(pattern==='rainbow-wind-chime'){
  const colors=['#ffacba','#ffd2a1','#fff1a0','#b9f4a7','#a7f5e3','#b8ceff','#e9b7ff'];
  for(let w=0;w<=Math.floor(duration/.115);w++)for(let j=0;j<24;j++)linear(`rainbow:${w}:${j}`,w*.115,0,0,j*TAU/24+w*.105,88+w%5*4,'rice',colors[(w+Math.floor(j/4))%7],4.2);
 }else if(pattern==='shanghai-dolls'){
  for(let w=0;w<=Math.floor(duration/.16);w++)for(let j=0;j<24;j++)linear(`shanghai-wedge:${w}:${j}`,w*.16,0,0,j*TAU/24+w*.155,76+w%3*7,'arrow',w%12<6?'#ffe98c':'#a1beff',4.4);
  for(let w=0;w<=Math.floor(duration/1.65);w++)for(let j=0;j<10;j++)linear(`shanghai-orb:${w}:${j}`,w*1.65+.8,0,0,j*TAU/10+w*.24,72,'orb','#b499ff',13);
 }else if(pattern==='killing-doll'){
  for(let cycle=0;cycle<=Math.floor(duration/3.8);cycle++)for(let row=0;row<5;row++)for(let family=0;family<2;family++)for(let j=0;j<(family?9:40);j++)add(family?`knife-red:${cycle}:${row}:${j}`:`knife:${cycle}:${row}:${j}`,cycle*3.8+row*.055,1,'knife',family?'#ff8b9b':'#b3c8ff',5.8,{cycle,row,family,j});
 }else if(pattern==='royal-flare'){
  for(let source=0;source<3;source++){
   add(`sun:${source}`,0,3,'glow','#ff6b76',14,{source});
   for(let n=0;n<=Math.floor(duration/.065);n++){const birth=n*.065,phase=birth%5.2,r=Math.min(birth/.8,1)*(32+Math.sin(phase*Math.PI/5.2)*94),a=source*TAU/3+birth*1.35;linear(`flare:${source}:${n}`,birth,Math.cos(a)*r,Math.min(birth*100,110)+Math.sin(a)*r,a+Math.PI/2,59,'round','#ff7185',3.7);}
  }
 }else if(pattern==='laevatein'){
  for(let cycle=0;cycle<=Math.floor(duration/3.7);cycle++){
   const start=cycle*3.7,sign=cycle%2?-1:1,angleAt=q=>sign===1?-.3+Math.PI*clamp((q-.55)/1.65,0,1):Math.PI+.3-Math.PI*clamp((q-.55)/1.65,0,1);
   for(let sweep=0;sweep<25;sweep++)for(let n=1;n<=12;n++){const birth=start+.55+sweep*.065,a=angleAt(.55+sweep*.065),r=n*25;linear(`sword-trail:${cycle}:${sweep}:${n}`,birth,Math.cos(a)*r,Math.sin(a)*r,a+sign*Math.PI/2,53,'rice','#ffd4d7',3.6);}
  }
 }else if(pattern==='scarlet-gensokyo'){
  for(let w=0;w<=Math.floor(duration/.15);w++)for(let j=0;j<24;j++)linear(`scarlet:${w}:${j}`,w*.15,0,0,j*TAU/24+Math.sin(w*.07)*1.15,91+w%4*4,'round','#ff8189',3.2);
  for(let w=0;w<=Math.floor(duration/3.1);w++)for(let j=0;j<16;j++)linear(`scarlet-orb:${w}:${j}`,w*3.1+.4,0,0,j*TAU/16+w*.16,103,'orb','#ed92ef',14);
 }else if(pattern==='terrible-souvenir'){
  for(let cycle=0;cycle<=Math.floor(duration/3.2);cycle++){
   const start=cycle*3.2;for(let row=0;row<6;row++)for(let j=0;j<24;j++)linear(`memory-pellet:${cycle}:${row}:${j}`,start+1.3+row*.14,0,0,j*TAU/24+row*.045,91,'round','#fff2a5',3.3);
   if(cycle>0)for(let row=0;row<12;row++)linear(`memory-orb:${cycle}:${row}`,start+.15+row*.095,0,0,row*.16+cycle*1.5,91,'orb','#c49dff',13);
  }
 }else if(pattern==='release-of-id'){
  for(let w=0;w<=Math.floor(duration/.16);w++)for(let j=0;j<18;j++){
   const a=j*TAU/18+w*.085,speed=73,delay=.65,turnTime=1.05,omega=.7/turnTime,end=a+omega*turnTime,cos=Math.cos(a),sin=Math.sin(a);
   add(`id-heart:${w}:${j}`,w*.16,2,'heart','#ffb8da',6.4,{wave:w,a,cos,sin,omega,cosEnd:Math.cos(end),sinEnd:Math.sin(end),endAngle:project(end),xEnd:cos*speed*delay+speed*(Math.sin(end)-Math.sin(a))/omega,yEnd:sin*speed*delay-speed*(Math.cos(end)-Math.cos(a))/omega});
  }
 }
 events.sort((a,b)=>a.birth-b.birth||a.order-b.order);beamEvents.sort((a,b)=>a.birth-b.birth||a.order-b.order);stats.events=events.length;
 const beamPool=[];
 function addBeam(x,y,a,length,width,color,alpha,core=true){const i=output.beams.length,b=beamPool[i]||(beamPool[i]={});Object.assign(b,{x:origin.x+x*sx,y:origin.y+y*sy,dx:Math.cos(a)*length*sx,dy:Math.sin(a)*length*sy,width:width*sx,color,alpha,core});output.beams.push(b);}

 function prepare(d){
  if(d.prepared)return;
  if(d.prepareKind==='phoenix'){const heading=aim(d.waveBirth);d.rotation=Math.atan2(Math.sin(heading-d.a),Math.cos(heading-d.a))*.8;setupTurn(d);d.prepared=true;return;}
  if(d.prepareKind==='mesh-head'||d.prepareKind==='mesh-pellet'){
   const a=aim(d.waveBirth)-d.sign*.54,cos=Math.cos(a),sin=Math.sin(a);
   if(d.prepareKind==='mesh-head'){d.vx=cos*109;d.vy=sin*109;d.angle=project(a);}else{d.x0=cos*109*d.at;d.y0=sin*109*d.at;}d.prepared=true;return;
  }
  if(d.type!==1)return;
  const {cycle,row,family,j}=d,seed=cycle*409+row*47+j+family*701,a=family?aim(d.birth)+(j-4)*.026:j*TAU/40+row*.025,speed=family?116+row*8:172+row*12,changed=random(seed)<.68,b=changed?random(seed+211)*TAU:a;
  d.vx=Math.cos(a)*speed;d.vy=Math.sin(a)*speed;d.angle=project(a);d.vxEnd=Math.cos(b)*(119+row*6);d.vyEnd=Math.sin(b)*(119+row*6);d.endAngle=project(b);d.endColor=changed?'#7ff5ae':d.color;d.prepared=true;
 }

 function step(t){
  if(t<last){cursor=0;beamCursor=0;active.length=0;activeBeams.length=0;}last=t;output.bullets.length=0;output.beams.length=0;
  while(cursor<events.length&&eligible(events[cursor],t)){const d=events[cursor++];prepare(d);let lo=0,hi=active.length;while(lo<hi){const mid=(lo+hi)>>1;if(active[mid].order<d.order)lo=mid+1;else hi=mid;}active.splice(lo,0,d);stats.spawned++;}
  stats.visited=active.length;let kept=0;
  for(const d of active){
   if(d.kind==='glow'&&t>=Math.min(duration,emissionUntil))continue;
   const age=t-d.birth,b=d.bullet;let x,y,angle=d.angle,color=d.color;
   if(d.type===0){x=d.x0+d.vx*age;y=d.y0+d.vy*age;}
   else if(d.type===1){const move=Math.min(age,.85);x=d.vx*move;y=d.vy*move;if(age>=1.4){x+=d.vxEnd*(age-1.4);y+=d.vyEnd*(age-1.4);angle=d.endAngle;color=d.endColor;}}
   else if(d.type===2){
    const q=clamp(age-.65,0,1.05),a=d.a+d.omega*q;
    if(age>=1.7){const tail=Math.max(0,age-.65-1.05);x=d.xEnd+d.cosEnd*73*tail;y=d.yEnd+d.sinEnd*73*tail;angle=d.endAngle;}
    else{const straight=Math.min(age,.65);x=d.cos*73*straight;y=d.sin*73*straight;if(q>0){x+=73*(Math.sin(a)-Math.sin(d.a))/d.omega;y-=73*(Math.cos(a)-Math.cos(d.a))/d.omega;}angle=project(a);}
   }else if(d.type===4){d.update(d,age,t);x=d.x;y=d.y;angle=d.outAngle;}else{const phase=t%5.2,r=Math.min(t/.8,1)*(32+Math.sin(phase*Math.PI/5.2)*94),a=d.source*TAU/3+t*1.35;x=Math.cos(a)*r;y=Math.min(t*100,110)+Math.sin(a)*r;angle=project(a);}
   const nx=origin.x+x*sx,ny=origin.y+y*sy;
   if(bounds&&(nx<bounds.left||nx>bounds.right||ny<bounds.top||ny>bounds.bottom)){stats.retired++;onRetire(d.id);continue;}
   active[kept++]=d;b.x=nx;b.y=ny;b.angle=angle;b.color=color;b.alpha=d.blink?(t%3.2>=2.65||t%3.2<.32?0:clamp(Math.min((t%3.2-.32)/.13,(2.65-t%3.2)/.13),0,1)):1;output.bullets.push(b);
  }
  active.length=kept;

  while(beamCursor<beamEvents.length){const d=beamEvents[beamCursor],ready=d.kind==='butterfly'?t-d.start>.35:d.kind==='mesh'?t>=d.parentBirth&&Math.floor((t-d.parentBirth)/.5)>=d.node:d.birth<=t;if(!ready)break;beamCursor++;let lo=0,hi=activeBeams.length;while(lo<hi){const mid=(lo+hi)>>1;if(activeBeams[mid].order<d.order)lo=mid+1;else hi=mid;}activeBeams.splice(lo,0,d);}
  let beamKept=0;for(const d of activeBeams){
   const age=d.kind==='butterfly'?t-d.start:d.kind==='mesh'?(t-d.parentBirth)-d.at:t-d.birth,limit=d.kind==='butterfly'?3.2:d.kind==='mesh'?3.3:.65;if(age>=limit)continue;activeBeams[beamKept++]=d;
   if(d.kind==='sword')addBeam(d.x,d.y,d.a,d.length,2.4,'#d7f5ff',Math.min(1,age*18,(.65-age)*8),false);
   else if(d.kind==='butterfly')addBeam(0,0,d.j*TAU/d.count+.16,780,age<.85?1:3,d.j%2?'#ff8ce7':'#8cefff',age<.85?.24:Math.min(1,(3.2-age)*3));
   else{const a=aim(d.waveBirth)-d.sign*.54,x=Math.cos(a)*109*d.at,y=Math.sin(a)*109*d.at,laser=a+Math.PI/2;addBeam(x-Math.cos(laser)*650,y-Math.sin(laser)*650,laser,1300,age<.65?.65:3,d.color,age<.65?.25:clamp((3.3-age)*2,0,1));}
  }activeBeams.length=beamKept;
  if(pattern==='magical-r360'&&Math.floor(t/7.2)*7.2<Math.min(duration,emissionUntil)){
   const phase=t%7.2,charge=phase<1,turning=phase>=4&&phase<5.6,a=Math.PI/2+(turning?TAU*(phase-4)/1.6:phase>=5.6?TAU:0);if(phase<5.6)addBeam(0,0,a,1100,charge?1:52,'#8edbff',charge?.3:Math.min(1,(phase-1)*6),!charge);
  }
  if(pattern==='laevatein'&&Math.floor(t/3.7)*3.7<Math.min(duration,emissionUntil)){
   const cycle=Math.floor(t/3.7),age=t-cycle*3.7,sign=cycle%2?-1:1,a=sign===1?-.3+Math.PI*clamp((age-.55)/1.65,0,1):Math.PI+.3-Math.PI*clamp((age-.55)/1.65,0,1);
   if(age<2.3)addBeam(0,0,a,650*Math.min(1,age/.55),age<.55?1.2:15,'#ff4656',age<.55?.4:clamp((2.3-age)*7,0,1));
  }else if(pattern==='terrible-souvenir'&&Math.floor(t/3.2)*3.2<Math.min(duration,emissionUntil)){
   const age=t-Math.floor(t/3.2)*3.2;if(age<2.1)for(let j=0;j<18;j++)addBeam(0,0,j*TAU/18,850,age<.8?.7:3,'#ff5365',age<.8?.25:clamp((2.1-age)*4,0,1));
  }
  return output;
 }
 return {step,stats};
}

const api={sample,createSimulation,virtualBounds:VIRTUAL_BOUNDS};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TouhouSpellPatterns=api;
})(typeof window!=='undefined'?window:globalThis);
