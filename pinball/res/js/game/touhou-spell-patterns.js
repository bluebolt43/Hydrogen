/* Gameplay references and observation windows: output/reports/touhou1-spellcards-reference-audit.json and touhou2-spellcards-reference-audit.json.
 * Reconstructed emitters, not original ECL. Distances/timing are adapted to the table.
 * Work in a 384 x 448 playfield; translate every emitter from the actual stage Boss.
 */
(function(root){'use strict';
const TAU=Math.PI*2,DEG=Math.PI/180;
// skipgame/th10/stage04.ecl BossCard2, Normal; modified-file provenance
// and decoded instructions: output/reports/touhou-aya-ecl-reference.json.
const LEAF_ROWS=30,LEAF_ARMS=16,LEAF_ROW_INTERVAL=4/60;
const leafPaths=new Map();
const leafRandom=n=>{let x=Math.imul(n+1,0x45d9f3b);x=Math.imul(x^(x>>>16),0x45d9f3b);return ((x^(x>>>16))>>>0)/4294967296;};
function leafLaunch(cycle,color){return (leafRandom(cycle*2+color)-.5)*TAU;}
function leafPath(row,color){
 const key=row*2+color;if(leafPaths.has(key))return leafPaths.get(key);
 // A repeatable local seed replaces the game's global RNG. Motion parameters
 // follow the decoded Normal branch: speed 6, acceleration -.0375 for 120 ticks.
 const omega=(color?-1:1)*Math.PI/60+(leafRandom(key+100)-.5)*TAU*row*.00002;
 const x=new Float64Array(121),y=new Float64Array(121),c=new Float64Array(121),s=new Float64Array(121);c[0]=1;
 for(let f=1;f<=120;f++){c[f]=Math.cos(omega*f);s[f]=Math.sin(omega*f);const speed=6-.0375*f;x[f]=x[f-1]+c[f]*speed;y[f]=y[f-1]+s[f]*speed;}
 const path={x,y,c,s,omega,px:0,py:0,angle:0};leafPaths.set(key,path);return path;
}
function leafPosition(path,age,turnAfter=2){
 const ticks=Math.round(turnAfter*60),frames=Math.max(0,age*60),f=Math.min(ticks,Math.floor(frames+1e-9)),fraction=Math.max(0,frames-f);
 if(f<ticks){path.px=path.x[f]+(path.x[f+1]-path.x[f])*fraction;path.py=path.y[f]+(path.y[f+1]-path.y[f])*fraction;}
 else{path.px=path.x[ticks]+path.c[ticks]*1.5*fraction;path.py=path.y[ticks]+path.s[ticks]*1.5*fraction;}
 path.angle=path.omega*Math.min(frames,ticks);
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// MBossCard1Dummy / Dummy2, skipgame TH10 stage05 replacement, Normal.
function grayGeometry(d,heading){
 const sign=d.colorIndex?-1:1,radius=d.colorIndex?64:96,base=heading+(d.colorIndex?Math.PI:0),edge=Math.floor(d.n/20),u=(d.n%20+1)/20;
 const a=base+sign*edge*TAU*2/5,b=a+sign*TAU*2/5;
 d.x0=radius*(Math.cos(a)*(1-u)+Math.cos(b)*u);d.y0=radius*(Math.sin(a)*(1-u)+Math.sin(b)*u);
 const launch=base+d.arm*TAU/5,accel=b+sign*(d.n%20)*Math.PI/24;
 d.vx=Math.cos(launch)*(d.colorIndex?2:3);d.vy=Math.sin(launch)*(d.colorIndex?2:3);d.ax=Math.cos(accel);d.ay=Math.sin(accel);d.launchAngle=launch;d.exitAngle=accel;
}
function grayTiming(g,t){
 const frames=Math.max(0,(t-g.cycle*7)*60-121),n=Math.min(90,Math.floor(frames)),u=Math.min(90,frames)-n;
 g.travel=n-n*(n-1)/180+u*(1-n/90);
 const accelerated=Math.max(0,frames-91),q=Math.min(90,Math.floor(accelerated)),v=Math.min(90,accelerated)-q;
 g.accel=.01*(q*(q+1)/2+v*(q+1))+.9*Math.max(0,accelerated-90);g.departed=frames>=91;
}

// TH07 skipgame ecldata6: sub23-25 and sub62/64-68. See A4 reference report.
const YOUMU_PERIOD=620/60,YUYUKO_PERIOD=415/60;
function youmuCycle(cycle,emit){
 const counts=[8,8,12,16],steps=[Math.PI/4,-Math.PI/4,Math.PI*.3,-Math.PI/2.3333333333333335];
 for(let phase=0;phase<4;phase++)for(let helper=0;helper<counts[phase];helper++){
  const release=cycle*YOUMU_PERIOD+(phase*155+(counts[phase]-1)*3+39+18)/60;
  const theta=helper*steps[phase],phi=Math.PI/2+theta,cx=Math.cos(theta)*112,cy=Math.sin(theta)*112;
  for(let row=0;row<14;row++){
   const u=row*3/42,h=1-6*u*u+4*u*u*u;
   // Sub25 reuses its angle locals as Hermite-interpolated shoot offsets.
   // Table presentation: hold the completed formation for 18 ticks before release.
   const x=row?Math.cos(phi)*128*h:phi,y=row?Math.sin(phi)*128*h:theta;
   for(let fan=0;fan<3;fan++){
    const angle=x+[0,Math.PI/8,-Math.PI/8][fan];
    emit({id:`sword:${cycle}:${phase}:${helper}:${row}:${fan}`,birth:cycle*YOUMU_PERIOD+(phase*155+helper*3+row*3)/60,release,x0:cx+x,y0:cy+y,a:angle,cos:Math.cos(angle),sin:Math.sin(angle),kind:'petal',color:'#e66bff',radius:6});
   }
  }
 }
}
function yuyukoCycle(cycle,emit){
 const base=cycle*YUYUKO_PERIOD,ways=28+cycle*3,heading=(leafRandom(cycle+700)-.5)*TAU;
 for(let wave=0;wave<10;wave++){
  const red=wave>=6,part=wave-6,count=red?[32,32,38,40][part]:ways,rows=wave%2&& !red?2:3;
  const birth=base+(red?170+part*30:wave*10)/60,omega=red?[1,-1,2,-2][part]*Math.PI/600:0,angle=red?(leafRandom(cycle*4+part+900)-.5)*TAU:heading+wave*Math.PI/ways;
  for(let row=0;row<rows;row++){
   const path=makeYuyukoPath(red?.8:.5,omega,.06-row*(rows===2?.065:.0325));
   const group={path,stamp:-Infinity};
   for(let arm=0;arm<count;arm++){
    const a=angle+arm*TAU/count;
    emit({id:`butterfly-${red?'red':'blue'}:${cycle}:${wave}:${row}:${arm}`,birth,a,cos:Math.cos(a),sin:Math.sin(a),group,kind:'orb',color:red?'#ff779d':wave%2?'#a58dff':'#779dff',radius:5.5});
   }
  }
 }
}
const yuyukoPaths=new Map();
function makeYuyukoPath(speed,omega,acceleration){
 const key=speed+':'+omega+':'+acceleration;if(yuyukoPaths.has(key))return yuyukoPaths.get(key);
 const x=new Float64Array(121),y=new Float64Array(121);
 for(let f=1;f<=120;f++){x[f]=x[f-1]+Math.cos(f*omega)*(speed+.01*f);y[f]=y[f-1]+Math.sin(f*omega)*(speed+.01*f);}
 const p={x,y,omega,speed,acceleration,endCos:Math.cos(120*omega),endSin:Math.sin(120*omega)};yuyukoPaths.set(key,p);return p;
}
function yuyukoPosition(p,age){
 const frames=Math.max(0,age*60),f=Math.min(120,Math.floor(frames+1e-9)),u=Math.max(0,frames-f);
 if(f<120){p.px=p.x[f]+(p.x[f+1]-p.x[f])*u;p.py=p.y[f]+(p.y[f+1]-p.y[f])*u;}
 else{
  const q=Math.min(80,Math.floor(u)),fraction=Math.min(80,u)-q,travel=(p.speed+1.2)*u+p.acceleration*(q*(q+1)/2+fraction*(q+1)+80*Math.max(0,u-80));
  p.px=p.x[120]+p.endCos*travel;p.py=p.y[120]+p.endSin*travel;
 }
 p.angle=p.omega*Math.min(frames,120);
}
function yuyukoLaser(cycle,j,t){
 const age=t-cycle*YUYUKO_PERIOD,count=3+cycle,family=j>=count?1:0,index=j%count,u=clamp(age,0,1),ease=1-(1-u)*(1-u);
 return {angle:Math.PI/2+(family?-1:1)*Math.PI/(2*count)+index*TAU/count+(family?-1:1)*Math.PI/3+(family?1:-1)*Math.PI/3*ease,
  width:age<1.5?1.2:age<2?1.2+(age-1.5)/.5*14.8:age<4?16:Math.max(0,(5-age)*16),alpha:age<1.5?.3:1};
}
// TH08 ecldata5 sub75-77 Normal emissions; table variant omits ExIns14 invisibility.
const MOON_PERIOD=210/60;
// Reuse two interleaved sets of sixteen rays; no per-cycle random rotation.
const MOON_PELLET_DIRECTIONS=Array.from({length:32},(_,i)=>{const a=-Math.PI/2+i*TAU/32;return {a,cos:Math.cos(a),sin:Math.sin(a)};});
// Table variant: continuous visibility and each batch's original launch speed.
function moonTravel(t,birth,speed){return (t-birth)*speed*60;}
function moonCycle(cycle,emit,rowDensity=1,pelletStride=1){
 const base=cycle*MOON_PERIOD;
 for(let wave=0;wave<3;wave++){
  const birth=base+[0,170/60,190/60][wave],count=wave?44:128,layers=wave?2:1,groups=wave?2:1,heading=(leafRandom(cycle*3+wave+1200)-.5)*TAU;
  for(let group=0;group<groups;group++)for(let layer=0;layer<layers;layer++){
   const speed=wave?(wave===1?1.4:1.2)-.3*layer:1,g={birth,speed,stamp:-Infinity};
   for(let arm=0;arm<count;arm++){
    const a=heading+arm*TAU/count+group*Math.PI/48+layer*Math.PI/32;
    emit({id:`moon:${cycle}:${wave}:${group}:${layer}:${arm}`,birth,a,cos:Math.cos(a),sin:Math.sin(a),group:g,kind:'capsule',color:wave===2?'#95a5f1':'#f17c91',radius:6.5});
   }
  }
 }
 // Blue pellets assemble along sixteen rays, then launch together.
 const pellets=[];let releaseAt=-Infinity,rowSlots=0;
 for(let arm=0;arm<16;arm++){
  const {a,cos,sin}=MOON_PELLET_DIRECTIONS[arm*2+(cycle%2)];
  let ray=[];
  for(let row=0;row<13;row++){
   const radius=row*40,x=cos*radius,y=sin*radius;
   // Use the reference playfield + emitter extent to stop offscreen emitters.
   if(192+x< -24||192+x>408||128+y< -24||128+y>472)break;
   ray.push({id:`moon-pellet:${cycle}:${arm}:${row}`,birth:base+190/60+row*20/60,x0:x,y0:y,a,cos,sin,kind:'round',color:'#8b9dff',radius:4.5});
  }
  for(const d of ray)releaseAt=Math.max(releaseAt,d.birth);
  ray=ray.filter(d=>Number(d.id.split(':').at(-1))%pelletStride===0);
  const count=Math.max(1,Math.round((rowSlots+ray.length)*rowDensity)-Math.round(rowSlots*rowDensity));rowSlots+=ray.length;
  for(let i=0;i<count;i++)pellets.push(ray[count===1?0:Math.round(i*(ray.length-1)/(count-1))]);
 }
 for(const d of pellets)emit({...d,releaseAt});
}
function moonPelletTravel(age){const ticks=Math.max(0,age*60),n=Math.min(60,Math.floor(ticks)),u=Math.min(60,ticks)-n;return (n*(n+1)/2+u*(n+1))/30+2*Math.max(0,ticks-60);}
// Source-derived remaining cards. Provenance and adaptations are recorded in
// output/reports/touhou-source-patterns.json; this is not a retail ECL VM.
const SOURCE_PATTERNS=new Set(['phoenix-wing','light-dark-mesh','magical-r360','rainbow-wind-chime','shanghai-dolls','killing-doll','water-elf','laevatein','scarlet-gensokyo','terrible-souvenir','release-of-id']);
const sourcePaths=new Map();
function sourcePath(speed,delta,omega,ticks){
 const key=[speed,delta,omega,ticks].join(':');if(sourcePaths.has(key))return sourcePaths.get(key);
 const x=new Float64Array(ticks+1),y=new Float64Array(ticks+1);
 for(let f=1;f<=ticks;f++){const a=omega*f,v=speed+delta*f;x[f]=x[f-1]+Math.cos(a)*v;y[f]=y[f-1]+Math.sin(a)*v;}
 const p={x,y,speed,delta,omega,ticks,endCos:Math.cos(omega*ticks),endSin:Math.sin(omega*ticks)};sourcePaths.set(key,p);return p;
}
function sourceDistance(frames,speed,accel=0,ticks=0){const n=Math.min(ticks,Math.floor(frames)),u=Math.min(ticks,frames)-n;return speed*frames+accel*(n*(n+1)/2+u*(n+1)+ticks*Math.max(0,frames-ticks));}
function sourceTemplate(pattern,duration,aspect=361/642){
 const bullets=[],beams=[];let order=0;
 function shot(id,birth,a,speed,kind,color,radius,extra={}){if(birth>duration)return;bullets.push({id,birth,a,speed,kind,color,radius,x0:0,y0:0,order:order++,...extra});}
 function laser(birth,life,a,length,width,color,extra={}){if(birth<=duration)beams.push({birth,life,a,length,width,color,x0:0,y0:0,order:beams.length,...extra});}
 if(pattern==='phoenix-wing'){
  // TH08 sub97/98: bird offsets, then 120 ticks of vector acceleration.
  const body=[[0,32],[Math.PI,32],[TAU/3,32],[-TAU/3,32],[0,16],[Math.PI,16],[TAU/3,16],[-TAU/3,16],...[64,96,48,80].flatMap(r=>(r===64||r===48?[3*Math.PI/4,-3*Math.PI/4,TAU/3,-TAU/3]:r===96?[4*Math.PI/5,-4*Math.PI/5,3*Math.PI/4,-3*Math.PI/4]:[4*Math.PI/5,-4*Math.PI/5,3*Math.PI/4,-3*Math.PI/4]).map(a=>[a,r])),[0,0]];
  // sub97 jumps660->170, plus secondaryTime=20-1 at tick510.
  // RunEcl holds the script timer during those nineteen extra wall ticks.
  const period=(490+19)/60,times=[0,140,260,270,280,290,300,310,320],offsets=[0,0,-Math.PI/2,-3*Math.PI/8,-Math.PI/4,0,Math.PI/4,3*Math.PI/8,Math.PI/2];
  for(let cycle=0;cycle<=Math.floor(duration/period);cycle++)for(let wave=0;wave<times.length;wave++){
   const birth=cycle*period+times[wave]/60,aimAt=birth;
   body.forEach(([theta,r],i)=>shot(`phoenix:${cycle}:${wave}:${i}`,birth,offsets[wave],.5,'capsule','#ff9a9e',6.5,{x0:Math.cos(theta+offsets[wave])*r,y0:Math.sin(theta+offsets[wave])*r,aimAt,rotateOrigin:true,accel:1/24,accelTicks:120}));
   for(let i=0;i<32;i++)shot(`phoenix-rice:${cycle}:${wave}:${i}`,birth,i*TAU/32+(leafRandom(cycle*31+wave)-.5)*TAU,2.5,'rice','#ffb2a5',4.2);
  }
 }else if(pattern==='rainbow-wind-chime'){
  const counts=[2,3,4,2,4,3,2],colors=['#ffacba','#ffd2a1','#fff1a0','#b9f4a7','#a7f5e3','#b8ceff','#e9b7ff'];
  for(let wave=0;wave<=Math.floor(duration*60/7);wave++){
   const n=wave%96,base=50*DEG+(n<48?n:96-n)*7.5*DEG;
   for(let color=0;color<7;color++)for(let j=0;j<counts[color];j++)shot(`rainbow:${wave}:${color}:${j}`,wave*7/60,base+color*.11344639957+j*TAU/counts[color],2.6,'petal',colors[color],9);
  }
 }else if(pattern==='release-of-id'){
  // Table variant: larger hearts cross the full viewport and expire instead
  // of accumulating on the native slow-moving outer arcs.
  // Pink waves and successive concentric blue rings use half-second spacing.
  const pinkInterval=.5,pinkLife=6.5,pinkFade=.7;
  const inwardStart=1.2,ringInterval=.5,inwardLife=4.2;
  const cycleDuration=inwardLife;
  for(let wave=0;wave*pinkInterval<=duration;wave++)for(let family=0;family<2;family++)for(let j=0;j<12;j++){
   const birth=wave*pinkInterval;
   const sign=family?1:-1,a=(leafRandom(1600+family)-.5)*TAU-sign*wave*Math.PI/32+(leafRandom(wave*2+family+1700)-.5)*TAU/64+j*TAU/12;
   shot(`id-heart:${wave}:${family}:${j}`,birth,a,3.2,'heart',family?'#ff789f':'#ffbdd5',12,{path:sourcePath(3.2,-.006,sign*Math.PI/500,220),life:pinkLife,fadeOut:pinkFade});
  }
  // Super-Ego-inspired table hybrid: large blue/cyan inward heart curtains.
  // Shared ring clocks keep rotation independent of the projectile count.
  // Ring distances reference the full canvas height while remaining circular.
  // Start only curtains whose outer ring can finish before the spell ends.
  for(let pulse=0;inwardStart+pulse*cycleDuration+3*ringInterval+inwardLife<=duration+1e-9;pulse++)for(let ring=0;ring<4;ring++){
   const r=(160+ring*160)/aspect,count=[6,12,18,24][ring],birth=inwardStart+pulse*cycleDuration+ring*ringInterval,swirl=(pulse%2?1:-1)*.85;
   if(birth>duration)continue;
   for(let j=0;j<count;j++){
    const a=j*TAU/count+ring*.09+pulse*.17;
    shot(`ego-heart:${pulse}:${ring}:${j}`,birth,a+Math.PI,0,'heart',ring%2?'#91eaff':'#8fafff',28,{x0:Math.cos(a)*r,y0:Math.sin(a)*r,motion:'converge',swirl,life:inwardLife,fadeIn:.3,fadeOut:.8});
   }
  }
 }else if(pattern==='killing-doll'){
  // TH06 sub48/49/50 Hard (殺人ドール). Calls and loop rewinds:
  // blue53ticks +red37ticks, stop90, redirects110..134, resume168, loop268.
  const period=268/60;
  for(let cycle=0;cycle<=Math.floor(duration/period);cycle++){
   const base=cycle*period,knives=[];
   for(let family=0;family<2;family++)for(let row=0;row<8;row++)for(let layer=0;layer<(family?4:3);layer++)for(let j=0;j<(family?5:10);j++){
    const birth=base+(family?53+row*2:row*4)/60,a=family?-row*Math.PI/4+(j%2?-1:1)*Math.ceil(j/2)*Math.PI/80:row*Math.PI/4+j*TAU/10,speed=family?2.8-1.8*layer/4:2-layer/3,key=cycle*1000+family*500+row*40+layer*10+j;
    knives.push({id:`knife:${cycle}:${family}:${row}:${layer}:${j}`,birth,a,speed,color:family?'#ff8b9b':'#b3c8ff',aimAt:base+(family?53/60:0),motion:'knife',stopAt:base+90/60,resumeAt:base+168/60,changeAt:Infinity,randomTurn:leafRandom(key+2600),bounceTlr:false,fullScatter:true,key});
   }
   // ExIns4 Hard: at most52 new green knives per random selection pass.
   for(let k=0;k<7;k++){
    let budget=52;
    for(const d of knives)if(d.changeAt===Infinity&&leafRandom(d.key*7+k+2000)<.25){d.changeAt=base+(110+k*4)/60;if(!--budget)break;}
   }
   for(const d of knives)shot(d.id,d.birth,d.a,d.speed,'knife',d.color,11.6,d);
  }
 }else if(pattern==='water-elf'){
  // TH06 stage4 sub57, Hard / neutral rank. No added mixed spell.
  // Blue rings, aimed bubbles, then green rings; repeat every70ticks.
  let turn=0;
  for(let cycle=0;cycle<=Math.floor(duration*60/70);cycle++){
   const base=cycle*70/60;
   if(cycle%2===0)for(let layer=0;layer<2;layer++)for(let j=0;j<30;j++)shot(`elf-blue:${cycle}:${layer}:${j}`,base,Math.PI+j*TAU/30+layer*Math.PI/9,2.8-layer*.8,'round','#8bdcff',8,{aimAt:base});
   for(const frame of [0,cycle===0?19:9]){
    const birth=base+frame/60;
    for(let j=0;j<10;j++){
     const fan=(j%2?-1:1)*(Math.floor(j/2)+.5)*Math.PI/9;
     shot(`elf-bubble:${cycle}:${frame}:${j}`,birth,turn+fan,1.8,'bubble','#8ebaff',23,{aimAt:birth});
    }
   }
   for(const frame of [39])for(let layer=0;layer<2;layer++)for(let j=0;j<20;j++){
    const birth=base+frame/60;
    shot(`elf-green:${cycle}:${frame}:${layer}:${j}`,birth,Math.PI+j*TAU/20+layer*Math.PI/9,2.8-layer*.8,'round','#8ef0a3',8,{aimAt:birth});
   }
   turn-=(leafRandom(cycle+7500)-.5)*Math.PI/14;
   if((cycle+1)%8===0)turn=0;
  }
 }else if(pattern==='shanghai-dolls'){
  const windows=[[0,32,1],[62,94,-1],[184,216,1],[246,278,-1]],period=308/60;
  for(let cycle=0;cycle<=Math.floor(duration/period);cycle++){
   const base=cycle*period;
   // Retain all12 yellow paths;5/4 batches per window (18 per cycle).
   for(let windowIndex=0;windowIndex<windows.length;windowIndex++){
    const [start,end,sign]=windows[windowIndex];
    for(let f=start;f<end;f+=6){
     if(f===start+12||windowIndex%2&&f+3>=end)continue;
     for(let source=0;source<4;source++)for(let j=0;j<3;j++){
      const time=f/60,radius=f<92?96:f<216?48:96,axis=source*TAU/4-sign*f*Math.PI/60;
      shot(`shanghai-yellow:${cycle}:${f}:${source}:${j}`,base+time,axis+(j===0?Math.PI/16:j===1?-Math.PI/16:0),j===2?3:1.5,'petal',sign>0?'#fff09a':'#ffd16e',10,{x0:Math.cos(axis)*radius,y0:Math.sin(axis)*radius,motion:'turn',turnTicks:70,turnAngle:sign*2.513273954,turns:j===2?1:2,aimAfter:j===2,aimAt:j===2?base+time+70/60:undefined,endSpeed:j===2?1.1:undefined});
     }
    }
   }
   // Each purple path already has one projectile: retain all nine paths.
   for(const f of [94,278])for(let j=0;j<9;j++)shot(`shanghai-orb:${cycle}:${f}:${j}`,base+f/60,j*TAU/9+(leafRandom(cycle+f)-.5)*TAU,2.5,'bubble','#b499ff',46);
   for(const [frame,layers]of [[154,2],[278,4]])for(let row=0;row<layers;row+=2)for(let j=0;j<24;j++)shot(`shanghai-wedge:${cycle}:${frame}:${row}:${j}`,base+frame/60,j*TAU/24,frame===154?1.8-row*.5:2-row*.3,'petal','#a1beff',10,{motion:'turn',turnTicks:100,turnAngle:frame===154?2.513273954:-2.513273954,turns:1});
  }
 }else if(pattern==='light-dark-mesh'){
  // TH07 sub97: paired aimed seed fans, followed by moving laser familiars98/99.
  for(let wave=0,waveStart=0;waveStart<=duration;waveStart+=(58+Math.max(130,200-(wave%11)*7))/60,wave++)for(let side=0;side<2;side++){
   const start=waveStart+side*34/60,sign=side?1:-1,color=side?'#ff868e':'#8db8ff',aimAt=start,axis=sign*Math.PI/6;
   const kinds=[['bubble',1,0,4.5,4.5,23],['fire',8,1,2,3.5,5],['rice',16,2,3,4.5,4],['fire',8,3,1,2,5],['rice',56,4,1,3,4]];
   for(const [kind,count,delay,low,high,radius]of kinds)for(let j=0;j<count;j++){
    const spread=(delay<3?Math.PI/32:delay===3?Math.PI/8:Math.PI/4),a=axis+(leafRandom(wave*1000+side*100+delay*60+j)-.5)*2*spread,speed=low+leafRandom(j+wave*50+side*200+3200)*(high-low);
    shot(`mesh-seed:${wave}:${side}:${delay}:${j}`,start+delay/60,a,speed,kind,color,radius,{aimAt});
   }
   const birth=start+24/60;
   for(let row=0;row<16;row++){
    const age=row*8/60,travel=4*age*60;
    for(let j=0;j<2;j++)shot(`mesh-pellet:${wave}:${side}:${row}:${j}`,birth+age,axis+(j?-.5:.5)*Math.PI/16,1.5,'rice',color,4,{x0:Math.cos(axis)*travel,y0:Math.sin(axis)*travel,aimAt,rotateOrigin:true});
   }
  }
  // Requested hybrid: old full crossing lines, followed by the wider beam.
  for(let wave=0;wave<=Math.floor(duration/4.5);wave++)for(let side=0;side<2;side++){
   const birth=wave*4.5+side*.22,sign=(side?1:-1)*(wave%2?-1:1),axis=-sign*.54,a=axis+Math.PI/2,color=side?'#ff868e':'#8db8ff';
   for(let node=0;birth+node*.5<=duration;node++){
    const travel=109*node*.5;
    laser(birth+node*.5,3.3,a,1300,side?14:16,color,{x0:Math.cos(axis)*travel-Math.cos(a)*650,y0:Math.sin(axis)*travel-Math.sin(a)*650,aimAt:wave*4.5,rotateOrigin:true,charge:.65,warningWidth:.65,ramp:10/60,fadeOut:.5});
   }
  }
 }else if(pattern==='scarlet-gensokyo'){
  // Native ten-tick seed cadence; config applies the shared 2/3 density.
  // Calls to sub41 consume200wall ticks apiece; parent timeline resumes on return.
  const period=930/60;
  for(let cycle=0;cycle<=Math.floor(duration/period);cycle++){
   const base=cycle*period,large=[];
   for(const [frame,count,layers,speed,delta,omega,ticks]of [[0,14,4,4,0,0,0],[200,12,1,2,.023,-Math.PI/128,80],[480,17,1,2,.026,Math.PI/128,60],[680,16,1,1,.023,-Math.PI/128,80]])for(let row=0;row<layers;row++)for(let j=0;j<count;j++){
    const v=layers>1?speed-(speed-1.8)*row/layers:speed,a=(leafRandom(cycle*11+frame)-.5)*TAU+j*TAU/count-row*Math.PI/10,path=ticks?sourcePath(v,delta,omega,ticks):null;
    const d={id:`scarlet-orb:${cycle}:${frame}:${row}:${j}`,birth:base+frame/60,a,speed:v,cos:Math.cos(a),sin:Math.sin(a),path};large.push(d);
    shot(d.id,d.birth,a,v,'bubble','#f394ee',23,{path});
   }
   for(const [start,release,spiral]of [[0,200,false],[200,400,true],[480,680,false],[680,880,true]])for(let frame=start;frame<release;frame+=10)for(let j=0;j<large.length;j++){
    const d=large[j];if(d.birth>base+frame/60||d.dead)continue;const f=(base+frame/60-d.birth)*60;let x,y;
    if(d.path){const p=d.path,n=Math.min(p.ticks,Math.floor(f)),tail=Math.max(0,f-p.ticks),px=p.x[n]+p.endCos*(p.speed+p.delta*p.ticks)*tail,py=p.y[n]+p.endSin*(p.speed+p.delta*p.ticks)*tail;x=px*d.cos-py*d.sin;y=px*d.sin+py*d.cos;}else{x=d.cos*d.speed*f;y=d.sin*d.speed*f;}
    if(192+x< -32||192+x>416||128+y< -32||128+y>480){d.dead=true;continue;}
    const endA=spiral?Math.hypot(x,y)*Math.PI/256+(leafRandom(cycle*11+release)-.5)*TAU:(leafRandom(cycle*2000+frame+j+3600)-.5)*TAU;
    shot(`scarlet:${cycle}:${frame}:${j}`,base+frame/60,endA,0,'round','#f6dfe1',7,{x0:x,y0:y,motion:'seed',releaseAt:base+release/60,endA,accel:.01,accelTicks:120});
   }
  }
 }else if(pattern==='laevatein'){
  const period=480/60;
  for(let cycle=0;cycle<=Math.floor(duration/period);cycle++)for(let stroke=0;stroke<2;stroke++){
   // Screen coordinates: left -> down -> right, then right -> down -> left.
   const start=cycle*period+stroke*4,sign=stroke?1:-1,angle=stroke?0:Math.PI,omega=sign*Math.PI/2;
   laser(start,2,angle,388,24,'#ff536b',{near:32,rotation:omega,charge:.4,ramp:.3,fadeOut:.2});
   for(let frame=0;frame<120;frame+=5)for(let n=0;n<9;n++){
    const a=angle+omega*frame/60,r=32+n*48;
    shot(`sword-trail:${cycle}:${stroke}:${frame}:${n}`,start+frame/60,a+sign*Math.PI/2,.01,'rice','#ffd4d7',7.2,{x0:Math.cos(a)*r,y0:Math.sin(a)*r,accel:.02,accelTicks:96});
   }
  }
 }else if(pattern==='terrible-souvenir'){
  for(let half=0;half<=Math.floor(duration/(200/60));half++){
   const base=half*200/60,sign=half%2?-1:1;
   for(let j=0;j<16;j++){const axis=j*TAU/16;laser(base,250/60,axis-sign*Math.PI/2,460,16,half%2?'#ff8cad':'#b497ff',{x0:Math.cos(axis)*64,y0:Math.sin(axis)*64,rotation:sign*.010472*60,charge:20/60,ramp:.3,fadeOut:50/60});}
   // Original sixteen eight-way volleys, six ticks apart.
   for(let wave=0;wave<16;wave++)for(let j=0;j<8;j++)shot(`souvenir-gold:${half}:${wave}:${j}`,base+(200+wave*6)/60,j*TAU/8+Math.PI/2+wave*12,1.6,'orb','#fff292',9);
   // etAngle reads local0 (=12) and the expression stack (=12*.3):
   // the second angle offsets successive speed layers, not a shared aim.
   for(let row=0;row<8;row++)shot(`souvenir-orb:${half}:${row}`,base+296/60,12+row*12*.3,1.5-row/8,'bubble','#f09aff',23,{aimAt:base+296/60});
  }
 }else if(pattern==='magical-r360'){
  // Non-ECL fighter card: beam primitive corroborated by OpenSoku Marisa.
  // Charge/straight/turn timing is a table adaptation, not a decoded R360 script.
  // Requested hybrid keeps the original six colourful star volleys.
  for(let cycle=0;cycle<=Math.floor(duration/8);cycle++){
   const start=cycle*8;laser(start,2.5,Math.PI/2,900,96,'#c7efff',{charge:.7,ramp:.35,fadeOut:.25});
   laser(start+3,4,Math.PI/2,900,96,'#c7efff',{rotation:TAU/3.2,rotationDelay:.5,rotationLimit:3.2,charge:.4,ramp:.3,fadeOut:.3});
   for(const [wave,delay]of [0,.22,.44,5.8,6.02,6.24].entries())for(let j=0;j<12;j++)shot(`spark-star:${cycle}:${wave}:${j}`,start+delay,j*TAU/12+wave*.13,(64+wave%3*13)/60,'star',['#fff07d','#9fd7ff','#c999ff','#9cffb5','#ffaddb'][j%5],(8+wave%3*2)*2,{spin:1.7});
  }
 }
 return {bullets,beams};
}
// Prepare each straight knife leg once; reflection never allocates per frame.
function knifeLeg(leg,x,y,a,speed,limit,bounds,reflect){
 const vx=Math.cos(a)*speed,vy=Math.sin(a)*speed;
 const tx=reflect?(vx< -1e-12?(bounds.left-x)/vx:vx>1e-12?(bounds.right-x)/vx:Infinity):Infinity;
 const ty=reflect&&vy< -1e-12?(bounds.top-y)/vy:Infinity,hit=Math.max(0,Math.min(tx,ty)),bounced=Number.isFinite(hit)&&hit<=limit;
 leg.x=x;leg.y=y;leg.vx=vx;leg.vy=vy;leg.hit=bounced?hit:Infinity;leg.bounced=bounced;leg.startAngle=a;
 leg.afterVx=bounced&&tx<=ty?-vx:vx;leg.afterVy=bounced&&ty<=tx?-vy:vy;
 leg.endAngle=bounced?Math.atan2(leg.afterVy,leg.afterVx):a;
 if(Number.isFinite(limit)){const first=Math.min(limit,leg.hit),tail=Math.max(0,limit-leg.hit);leg.endX=x+vx*first+leg.afterVx*tail;leg.endY=y+vy*first+leg.afterVy*tail;}
}
function sourcePrepare(d,aim,bounds){
 if(d.prepared)return;const heading=d.aimAt===undefined||d.aimAfter?0:aim(d.aimAt);
 if(d.rotateOrigin){const c=Math.cos(heading),s=Math.sin(heading),x=d.x0;d.x0=x*c-d.y0*s;d.y0=x*s+d.y0*c;}
 if(!d.aimAfter)d.a+=heading;
 d.cos=Math.cos(d.a);d.sin=Math.sin(d.a);d.outA=d.a;
 if(d.motion==='knife'){
  d.before={};d.after={};d.beforeFrames=(d.stopAt-d.birth)*60;
  knifeLeg(d.before,0,0,d.a,d.speed,d.beforeFrames,bounds,d.bounceTlr);
  knifeLeg(d.after,d.before.endX,d.before.endY,d.before.endAngle,d.speed,Infinity,bounds,d.bounceTlr&&!d.before.bounced);
 }
 d.prepared=true;
}
function sourceMove(d,age,t){
 const frames=Math.max(0,age*60);let x=0,y=0,da=0;
 d.currentColor=d.color;d.safeRetireAt=d.birth;d.safeToRetire=true;
 if(d.motion==='converge'){
  const g=d.motionGroup;
  if(g.time!==t){const u=clamp(age/d.life,0,1);g.scale=1-u;g.cos=Math.cos(d.swirl*u);g.sin=Math.sin(d.swirl*u);g.turn=d.swirl*u;g.time=t;}
  x=(d.x0*g.cos-d.y0*g.sin)*g.scale-d.x0;y=(d.x0*g.sin+d.y0*g.cos)*g.scale-d.y0;
  d.outA=d.a+g.turn;d.safeRetireAt=d.birth+d.life;d.safeToRetire=false;
 }else if(d.motion==='knife'){
  const resumed=t>=d.resumeAt,leg=resumed?d.after:d.before,n=resumed?Math.max(0,(t-d.resumeAt)*60):Math.min(frames,d.beforeFrames),first=Math.min(n,leg.hit),tail=Math.max(0,n-leg.hit);
  x=leg.x+leg.vx*first+leg.afterVx*tail;y=leg.y+leg.vy*first+leg.afterVy*tail;
  const changed=t>=d.changeAt;d.currentColor=changed?'#7ff5ae':d.color;
  d.outA=changed&&!resumed?d.endA:n>=leg.hit?leg.endAngle:leg.startAngle;d.safeRetireAt=d.resumeAt;
 }else if(d.motion==='turn'){
  const period=d.turnTicks,n=Math.min(d.turns,Math.floor(frames/period)),part=n===d.turns?frames-n*period:frames%period;d.safeToRetire=n===d.turns;
  for(let k=0;k<n;k++){const a=d.a+k*d.turnAngle;const dist=d.speed*(period-1)/2;x+=Math.cos(a)*dist;y+=Math.sin(a)*dist;}
  const angle=d.aimAfter&&n?d.aimHeading:d.a+n*d.turnAngle,speed=n&&d.endSpeed!==undefined?d.endSpeed:d.speed;
  const dist=n===d.turns?speed*part:sourceDistance(part,speed,-speed/period,period);
  x+=Math.cos(angle)*dist;y+=Math.sin(angle)*dist;d.outA=angle;d.safeRetireAt=d.birth+period*d.turns/60;
 }else if(d.motion==='seed'){
  const f=Math.max(0,(t-d.releaseAt)*60),dist=sourceDistance(f,.01,d.accel,d.accelTicks);x=Math.cos(d.endA)*dist;y=Math.sin(d.endA)*dist;d.outA=d.endA;d.currentColor=t>=d.releaseAt?'#ff8189':d.color;d.safeRetireAt=d.releaseAt;
 }else if(d.path){
  const p=d.path,g=d.motionGroup;
  d.safeToRetire=frames>=p.ticks;
  if(!g||g.time!==t){const n=Math.min(p.ticks,Math.floor(frames)),u=frames-n;let px=p.x[n],py=p.y[n];
   if(n<p.ticks){px+=(p.x[n+1]-px)*u;py+=(p.y[n+1]-py)*u;}else{const dist=(p.speed+p.delta*p.ticks)*u;px+=p.endCos*dist;py+=p.endSin*dist;}
   if(g){g.px=px;g.py=py;g.da=p.omega*Math.min(frames,p.ticks);g.time=t;}else{d.localPx=px;d.localPy=py;}
  }
  const px=g?g.px:d.localPx,py=g?g.py:d.localPy;x=px*d.cos-py*d.sin;y=px*d.sin+py*d.cos;da=g?g.da:p.omega*Math.min(frames,p.ticks);d.outA=d.a+da;d.safeRetireAt=d.birth+p.ticks/60;
 }else{const g=d.motionGroup;let dist;if(g){if(g.time!==t){g.dist=sourceDistance(frames,d.speed,d.accel??0,d.accelTicks??0);g.time=t;}dist=g.dist;}else dist=sourceDistance(frames,d.speed,d.accel??0,d.accelTicks??0);x=d.cos*dist;y=d.sin*dist;d.outA=d.a;}
 d.x=d.x0+x;d.y=d.y0+y;
 const displayA=d.outA+(d.spin??0)*age;
 if(d.lastOutA!==displayA){d.angle=((displayA+Math.PI)%TAU+TAU)%TAU-Math.PI;d.lastOutA=displayA;}
}
function sourceBeam(d,t,origin,aspect){
 const age=t-d.birth;if(age<0||age>=d.life)return null;
 const q=clamp(age-(d.rotationDelay??0),0,d.rotationLimit??d.life),a=d.a+(d.rotation??0)*q,c=Math.cos(a),s=Math.sin(a),near=d.near??0,charge=d.charge??0,ramp=d.ramp??.2;
 const strength=age<charge?.1:ramp>0?clamp((age-charge)/ramp,0,1):1,fade=d.fadeOut?Math.min(1,(d.life-age)/d.fadeOut):1;
 return {x:origin.x+(d.x0+c*near)/384,y:origin.y+(d.y0+s*near)*aspect/384,dx:c*d.length/384,dy:s*d.length*aspect/384,width:(age<charge?(d.warningWidth??1):d.width*Math.max(.05,strength)*fade)/384,color:d.color,alpha:age<charge?.25:fade,core:age>=charge};
}
function sourceRuntime(pattern,{duration=14,origin={x:.5,y:.12},aspect=361/642,targetAt=()=>({x:.5,y:.9}),emissionUntil=Infinity,stride=2,density=1,densityByFamily={},onRetire=()=>{},retired=new Set(),unculled=false,retireOutsideViewport=false}={}){
 const template=sourceTemplate(pattern,duration,aspect),active=[],output={bullets:[],beams:[]},aims=new Map(),stats={events:0,spawned:0,retired:0,visited:0};
 const knifeBounds={left:-origin.x*384-8,right:(1-origin.x)*384+8,top:-origin.y*384/aspect-8};
 const aim=t=>{if(!aims.has(t)){const p=targetAt(t);aims.set(t,Math.atan2((p.y-origin.y)*384/aspect,(p.x-origin.x)*384));}return aims.get(t);};
 const skip=d=>{const parts=d.id.split(':'),j=Number(parts.at(-1)),familyDensity=densityByFamily[parts[0]]??density;if(j%stride)return true;if(familyDensity>=1)return false;const g=Number(parts.at(-2)),n=j/stride+g;return Math.floor((n+1)*familyDensity+1e-9)===Math.floor(n*familyDensity+1e-9);};
 const ordered=template.bullets.filter(d=>d.birth<emissionUntil&&!skip(d));for(const d of ordered)d.bullet={id:d.id,x:0,y:0,angle:0,kind:d.kind,color:d.color,radius:d.radius/384,alpha:1,rasterRotation:d.motion==='converge'||['shanghai-dolls','rainbow-wind-chime'].includes(pattern)&&d.kind==='petal'||pattern==='killing-doll'&&d.kind==='knife'};
 // Group only identical clocks; headings and painter order stay per bullet.
 const motionGroups=new Map();for(const d of ordered)if(d.path||!d.motion||d.motion==='converge'){let groups=motionGroups.get(d.path||null);if(!groups){groups=new Map();motionGroups.set(d.path||null,groups);}const key=d.birth+':'+d.speed+':'+(d.accel??0)+':'+(d.accelTicks??0)+':'+(d.life??0)+':'+(d.swirl??0);let g=groups.get(key);if(!g){g={time:NaN};groups.set(key,g);}d.motionGroup=g;}
 const events=ordered.slice().sort((a,b)=>a.birth-b.birth||a.order-b.order),beams=template.beams.filter(d=>d.birth<emissionUntil);stats.events=events.length;let cursor=0,last=-Infinity;
 for(const d of [...events,...beams]){d.initialA=d.a;d.initialX=d.x0;d.initialY=d.y0;}
 function step(t){
  if(t<last){cursor=0;active.length=0;retired.clear();}last=t;output.bullets.length=0;output.beams.length=0;
  while(cursor<events.length&&events[cursor].birth<=t){const d=events[cursor++];sourcePrepare(d,aim,knifeBounds);let lo=0,hi=active.length;while(lo<hi){const m=(lo+hi)>>1;if(active[m].order<d.order)lo=m+1;else hi=m;}active.splice(lo,0,d);stats.spawned++;}
  stats.visited=active.length;let kept=0;
  for(const d of active){if(retired.has(d.id))continue;
   if(d.life!==undefined&&t-d.birth>=d.life){retired.add(d.id);onRetire(d.id);stats.retired++;continue;}
   if(d.motion==='knife'&&!d.redirected&&t>=d.changeAt){
    const target=targetAt(d.changeAt),dx=d.before.endX-(target.x-origin.x)*384,dy=d.before.endY-(target.y-origin.y)*384/aspect;
    d.endA=Math.hypot(dx,dy)>128?(d.fullScatter?d.randomTurn*TAU:Math.PI/4+d.randomTurn*3*Math.PI/4):Math.atan2(dy,dx)+Math.PI/2+d.randomTurn*TAU;
    knifeLeg(d.after,d.before.endX,d.before.endY,d.endA,d.speed,Infinity,knifeBounds,d.bounceTlr&&!d.before.bounced);d.redirected=true;
   }
   if(d.aimAfter&&t>=d.aimAt)d.aimHeading=aim(d.aimAt);sourceMove(d,t-d.birth,t);const x=origin.x+d.x/384,y=origin.y+d.y*aspect/384;
   const margin=retireOutsideViewport?d.radius/192+.01:1,right=1+margin,vertical=retireOutsideViewport?margin*aspect:1,bottom=1+vertical;
   if(!unculled&&t>=d.safeRetireAt&&(!retireOutsideViewport||d.safeToRetire)&&((x< -margin&&Math.cos(d.outA)<=0)||(x>right&&Math.cos(d.outA)>=0)||(y< -vertical&&Math.sin(d.outA)<=0)||(y>bottom&&Math.sin(d.outA)>=0))){retired.add(d.id);onRetire(d.id);stats.retired++;continue;}
   active[kept++]=d;const b=d.bullet;b.x=x;b.y=y;b.angle=d.angle;b.headingFixed=!d.spin&&d.motion!=='converge'&&(!d.path||(t-d.birth)*60>=d.path.ticks);b.color=d.currentColor;b.alpha=(d.life!==undefined&&d.fadeOut?clamp((d.life-(t-d.birth))/d.fadeOut,0,1):1)*(d.fadeIn?clamp((t-d.birth)/d.fadeIn,0,1):1);output.bullets.push(b);
  }active.length=kept;
  for(const d of beams){if(d.birth>t||t>=d.birth+d.life)continue;sourcePrepare(d,aim);const b=sourceBeam(d,t,origin,aspect);if(b)output.beams.push(b);}
  return output;
 }
 // Warning preparation has not emitted or aimed any particles yet.
 function setOrigin(value){origin=value;knifeBounds.left=-origin.x*384-8;knifeBounds.right=(1-origin.x)*384+8;knifeBounds.top=-origin.y*384/aspect-8;}
 function reset(){
  cursor=0;last=-Infinity;active.length=output.bullets.length=output.beams.length=0;aims.clear();retired.clear();stats.spawned=stats.retired=stats.visited=0;
  for(const list of [events,beams])for(const d of list){d.a=d.initialA;d.x0=d.initialX;d.y0=d.initialY;d.prepared=false;d.redirected=false;d.lastOutA=undefined;if(d.motionGroup)d.motionGroup.time=NaN;}
 }
 return {step,stats,setOrigin,reset};
}
function sourceSample(pattern,t,origin,aspect,targetAt,emissionUntil,state){
 const duration=Math.max(14,Math.ceil(t/14)*14);let cached=state?.sourceSimulation;
 if(!cached||cached.duration<duration){cached={duration,simulation:sourceRuntime(pattern,{duration,origin,aspect,targetAt,emissionUntil,stride:state?.stride??1,density:state?.density??1,densityByFamily:state?.densityByFamily??{},retired:state?.retired??new Set(),unculled:!state})};if(state)state.sourceSimulation=cached;}
 return cached.simulation.step(t);
}
// Measured full-cycle return envelopes + 0.12 viewport margin.
// Reproduce with tests/measure_touhou_spell_bounds.cjs; regression compares
// every visible bullet to the unculled emitter, including offscreen returns.
const VIRTUAL_BOUNDS={"icicle-fall":{"left":-0.5,"top":-0.25,"right":1.5,"bottom":1.15},"leaf-veiling":{"left":-0.6,"top":-0.65,"right":1.6,"bottom":1.2},"gray-thaumaturgy":{"left":-1.25,"top":-1.15,"right":2.2,"bottom":1.9},"six-realms-sword":{"left":-0.4,"top":-0.55,"right":1.4,"bottom":1.15},"resurrection-butterfly":{"left":-0.6,"top":-0.65,"right":1.6,"bottom":1.2},"invisible-full-moon":{"left":-0.15,"top":-0.15,"right":1.15,"bottom":1.15}};
function sample(pattern,t,origin={x:.5,y:.12},aspect=361/642,targetAt=()=>({x:.5,y:.9}),emissionUntil=Infinity,state){
 if(SOURCE_PATTERNS.has(pattern))return sourceSample(pattern,t,origin,aspect,targetAt,emissionUntil,state);
 const bullets=[],beams=[],sx=1/384,sy=(['leaf-veiling','gray-thaumaturgy','six-realms-sword','resurrection-butterfly','invisible-full-moon'].includes(pattern))?aspect/384:(1-origin.y)/352;
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

 function beam(x,y,angle,length,width,color,alpha=1,core=true,taper=false){beams.push({x:origin.x+x*sx,y:origin.y+y*sy,dx:Math.cos(angle)*length*sx,dy:Math.sin(angle)*length*sy,width:width*sx,color,alpha,core,taper});}
 switch(pattern){
 case'icicle-fall':{
  // iY_e-WoVIqU 2-8s: three shards per side, sweeping launch direction;
  // outward deceleration, then a quarter-turn into crossing descending streams.
  for(let wave=0;wave<=Math.floor(t/.45);wave++)for(const side of [-1,1])for(let row=0;row<3;row++){
   const id=`ice:${wave}:${side}:${row}`;if(sparse(id)||state?.retired.has(id))continue;
   const age=t-wave*.45,theta=(-10+(wave%11)*5.625)*DEG,a=side===1?theta:Math.PI-theta;
   const travel=86+row*55,u=Math.min(age/1.25,1),out=travel*(2*u-u*u),after=Math.max(0,age-1.25),v=side===1?89:78,down=a+(side===1?1:-1)*Math.PI/2;
   const x=Math.cos(a)*out+Math.cos(down)*v*after,y=Math.sin(a)*out+Math.sin(down)*v*after;
   put(id,x,y,age<1.25?a:down,'ice','#a6a8ff',5);
  }
  for(let wave=0;wave<=Math.floor(t/1.8);wave++)for(let j=0;j<5;j++)shot(`ice-yellow:${wave}:${j}`,wave*1.8,0,0,Math.PI/2+(j-2)*.22,95,'round','#fff17c',4.5);
  break;
 }
 case'leaf-veiling':{
  const rows=state?.leafRows??LEAF_ROWS,arms=state?.leafArms??LEAF_ARMS,turnAfter=state?.turnAfter??2,interval=(LEAF_ROWS-1)*LEAF_ROW_INTERVAL/(rows-1);
  for(let cycle=0;cycle<=Math.floor(t/4);cycle++)for(let row=0;row<rows;row++)for(let color=0;color<2;color++){
   if(row%(state?.rowStride??1))continue;
   const birth=cycle*4+row*interval,age=t-birth;if(age<0||birth>=emissionUntil)continue;
   const path=leafPath(row,color);leafPosition(path,age,turnAfter);
   for(let arm=0;arm<arms;arm++){
    const id=`leaf:${cycle}:${row}:${color*arms+arm}`;if(sparse(id)||state?.retired.has(id))continue;
    const a=leafLaunch(cycle,color)+arm*TAU/arms,c=Math.cos(a),s=Math.sin(a);
    put(id,path.px*c-path.py*s,path.px*s+path.py*c,a+path.angle,'leaf',color?'#48ff71':'#c2ffe0',7);
   }
  }
  break;
 }
 case'gray-thaumaturgy':{
  for(let cycle=0;cycle<=Math.floor(t/7);cycle++){
   const g={cycle};grayTiming(g,t);const heading=aim(cycle*7);
   for(let color=0;color<2;color++)for(let n=0;n<100;n++)for(let arm=0;arm<5;arm++){
    if(Math.floor(n*(state?.rowDensity??1))===Math.floor((n+1)*(state?.rowDensity??1)))continue;
    const birth=cycle*7+(n+1)/60,id=`star:${cycle}:${color}:${n}:${arm}`;
    if(t<birth||birth>=emissionUntil||sparse(id)||state?.retired.has(id))continue;
    const d={colorIndex:color,n,arm};grayGeometry(d,heading);
    put(id,d.x0+d.vx*g.travel+d.ax*g.accel,d.y0+d.vy*g.travel+d.ay*g.accel,g.departed?d.exitAngle:d.launchAngle,color?'round':'rice',color?'#ffc6dc':'#8baaff',color?2.7:3.8);
   }
  }
  break;
 }
 case'six-realms-sword':{
  for(let cycle=0;cycle<=Math.floor(t/YOUMU_PERIOD);cycle++)youmuCycle(cycle,d=>{
   const age=t-d.birth;if(age<0||d.birth>=emissionUntil||sparse(d.id)||state?.retired.has(d.id))return;
   const travel=Math.max(0,t-d.release)*72;
   put(d.id,d.x0+d.cos*travel,d.y0+d.sin*travel,d.a,d.kind,d.color,d.radius);
  });
  break;
 }
 case'resurrection-butterfly':{
  for(let cycle=0;cycle<=Math.floor(t/YUYUKO_PERIOD);cycle++){
   yuyukoCycle(cycle,d=>{
    const age=t-d.birth;if(age<0||d.birth>=emissionUntil||sparse(d.id)||state?.retired.has(d.id))return;
    const p=d.group.path;yuyukoPosition(p,age);put(d.id,p.px*d.cos-p.py*d.sin,p.px*d.sin+p.py*d.cos,d.a+p.angle,d.kind,d.color,d.radius);
   });
   const age=t-cycle*YUYUKO_PERIOD;if(cycle*YUYUKO_PERIOD<emissionUntil&&age<5)for(let j=0;j<2*(3+cycle);j++){
    const laser=yuyukoLaser(cycle,j,t),a=laser.angle;beam(Math.cos(a)*64,Math.sin(a)*64,a,384,laser.width,j<3+cycle?'#fa87df':'#a9e8ff',laser.alpha);
   }
  }
  break;
 }
 case'invisible-full-moon':{
  for(let cycle=0;cycle<=Math.floor(t/MOON_PERIOD);cycle++)moonCycle(cycle,d=>{
   const age=t-d.birth;if(age<0||d.birth>=emissionUntil||sparse(d.id)||state?.retired.has(d.id))return;
   const pellet=d.kind==='round',travel=pellet?moonPelletTravel(t-d.releaseAt):moonTravel(t,d.birth,d.group.speed);
   put(d.id,(d.x0??0)+d.cos*travel,(d.y0??0)+d.sin*travel,d.a,d.kind,pellet&&t>=d.releaseAt?'#b0baff':d.color,d.radius,1);
  },state?.rowDensity??1,state?.stride??1);
  break;
 }
 default:throw Error('Unknown Touhou spell pattern '+pattern);
 }
 return {bullets,beams};
}

// Playback keeps emission events and live bullets for both Touhou chapters. The stateless sample
// above remains the reference/seek fallback; fixed geometry is prepared once.
function createSimulation(pattern,{duration=14,origin={x:.5,y:.12},aspect=361/642,targetAt=()=>({x:.5,y:.9}),emissionUntil=Infinity,stride=2,rowStride=1,leafRows=LEAF_ROWS,leafArms=LEAF_ARMS,turnAfter=2,rowDensity=1,density=1,densityByFamily={},onRetire=()=>{},retireAboveViewport=false,retireOutsideViewport=false}={}){
 if(SOURCE_PATTERNS.has(pattern))return sourceRuntime(pattern,{duration,origin,aspect,targetAt,emissionUntil,stride,density,densityByFamily,onRetire,retireOutsideViewport});
 const supported=['icicle-fall','leaf-veiling','gray-thaumaturgy','six-realms-sword','resurrection-butterfly','invisible-full-moon'];
 if(!supported.includes(pattern))return null;
 const sx=1/384;let sy=(['leaf-veiling','gray-thaumaturgy','six-realms-sword','resurrection-butterfly','invisible-full-moon'].includes(pattern))?aspect/384:(1-origin.y)/352,bounds=origin.x>=.1&&origin.x<=.9&&origin.y>=0&&origin.y<=.5&&aspect>=.35&&aspect<=1?VIRTUAL_BOUNDS[pattern]:null;
 const events=[],active=[],beamEvents=[],activeBeams=[],output={bullets:[],beams:[]},stats={events:0,spawned:0,retired:0,visited:0};let grayGroups,order=0,cursor=0,beamCursor=0,last=-Infinity,motionFrame=0;
 const project=a=>Math.atan2(Math.sin(a)*sy/aspect,Math.cos(a)*sx);
 const skip=id=>{const end=id.lastIndexOf(':'),index=Number(id.slice(end+1));if(index%stride)return true;if(density>=1)return false;const previous=id.lastIndexOf(':',end-1),group=Number(id.slice(previous+1,end)),slot=index/stride+group;return Math.floor((slot+1)*density+1e-9)===Math.floor(slot*density+1e-9);};
 function add(id,birth,type,kind,color,radius,extra={}){
  const rank=order++;if(birth>duration||birth>=emissionUntil||kind!=='glow'&&skip(id))return;
  const d={id,birth,type,order:rank,kind,color,radius,...extra};d.bullet={id,x:0,y:0,angle:0,kind,color,radius:radius*sx,alpha:1};events.push(d);return d;
 }
 function linear(id,birth,x,y,a,speed,kind,color,radius){add(id,birth,0,kind,color,radius,{a,x0:x,y0:y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,angle:project(a)});}
 const aimCache=new Map(),aim=t=>{if(!aimCache.has(t)){const target=targetAt(t);aimCache.set(t,Math.atan2((target.y-origin.y)/sy,(target.x-origin.x)/sx));}return aimCache.get(t);};

 function scheduleBeam(d){d.order=beamEvents.length;if(d.birth<=duration)beamEvents.push(d);}
 // Match reference floor/subtraction eligibility at floating-point wave boundaries.
 function eligible(d,t){
  if(d.wave!==undefined&&pattern==='icicle-fall')return d.wave<=Math.floor(t/.45);
  return d.birth<=t;
 }
 function resetMotion(d){d.outAngle=d.angleStart;d.group.stamp=-Infinity;}
 function advanceMotion(d,age){
  const g=d.group;
  // Six ice shards share their birth and turn time. Evaluate their common
  // progress once; absolute positions also remain stable on skipped frames.
  if(g.stamp!==motionFrame){const u=Math.min(age/1.25,1);g.out=2*u-u*u;g.tail=Math.max(0,age-1.25);g.turned=age>=1.25;g.stamp=motionFrame;}
  d.x=d.endX*g.out+d.nextVx*g.tail;d.y=d.endY*g.out+d.nextVy*g.tail;d.outAngle=g.turned?d.angleEnd:d.angleStart;
 }
 function resetTurnMotion(d){d.group.stamp=-Infinity;}
 function updateLeafGroup(g,age){
  // Reduce the shared heading once per volley; each arm needs only one wrap.
  if(g.stamp!==motionFrame){leafPosition(g.path,age,g.turnAfter);g.x=g.path.px;g.y=g.path.py;g.angle=((g.path.angle+Math.PI)%TAU+TAU)%TAU-Math.PI;g.stamp=motionFrame;}
 }
 function advanceTurnMotion(d,age){
  const g=d.group;updateLeafGroup(g,age);
  d.x=g.x*d.cos-g.y*d.sin;d.y=g.x*d.sin+g.y*d.cos;
  let angle=d.baseAngle+g.angle;if(angle>=Math.PI)angle-=TAU;else if(angle< -Math.PI)angle+=TAU;d.outAngle=angle;
 }
 function updateGray(d,age,t){
  const g=d.group;if(g.stamp!==motionFrame){grayTiming(g,t);g.stamp=motionFrame;}
  d.x=d.x0+d.vx*g.travel+d.ax*g.accel;d.y=d.y0+d.vy*g.travel+d.ay*g.accel;d.outAngle=g.departed?d.angleEnd:d.angleStart;
 }
 function updateYoumu(d,age,t){const travel=Math.max(0,t-d.release)*72;d.x=d.x0+d.cos*travel;d.y=d.y0+d.sin*travel;d.outAngle=d.angleStart;d.bullet.headingFixed=true;}
 function updateYuyuko(d,age){
  const g=d.group;if(g.stamp!==motionFrame){yuyukoPosition(g.path,age);g.x=g.path.px;g.y=g.path.py;g.angle=g.path.angle;g.stamp=motionFrame;}
  d.x=g.x*d.cos-g.y*d.sin;d.y=g.x*d.sin+g.y*d.cos;d.outAngle=((d.a+g.angle+Math.PI)%TAU+TAU)%TAU-Math.PI;
 }
 function updateMoon(d,age,t){
  let travel;
  if(d.kind==='round'){travel=moonPelletTravel(t-d.releaseAt);d.currentColor=t>=d.releaseAt?'#b0baff':d.color;}
  else{const g=d.group;if(g.stamp!==motionFrame){g.travel=moonTravel(t,g.birth,g.speed);g.stamp=motionFrame;}travel=g.travel;}
  d.x=(d.x0??0)+d.cos*travel;d.y=(d.y0??0)+d.sin*travel;d.outAngle=d.angleStart;d.bullet.headingFixed=true;
 }
 if(pattern==='icicle-fall'){
  const iceGroups=[];
  for(let wave=0;wave<=Math.floor(duration/.45);wave++)for(const side of [-1,1])for(let row=0;row<3;row++){
   const theta=(-10+(wave%11)*5.625)*DEG,a=side===1?theta:Math.PI-theta,down=a+(side===1?1:-1)*Math.PI/2;
   const travel=86+row*55,v=side===1?89:78,cos=Math.cos(a),sin=Math.sin(a);
   add(`ice:${wave}:${side}:${row}`,wave*.45,5,'ice','#a6a8ff',5,{a,down,wave,group:iceGroups[wave]??(iceGroups[wave]={stamp:-Infinity}),endX:cos*travel,endY:sin*travel,nextVx:Math.cos(down)*v,nextVy:Math.sin(down)*v,angleStart:project(a),angleEnd:project(down)});
  }
  for(let wave=0;wave<=Math.floor(duration/1.8);wave++)for(let j=0;j<5;j++){
   const a=Math.PI/2+(j-2)*.22;
   linear(`ice-yellow:${wave}:${j}`,wave*1.8,0,0,a,95,'round','#fff17c',4.5);
  }
 }else if(pattern==='leaf-veiling'){
  const interval=(LEAF_ROWS-1)*LEAF_ROW_INTERVAL/(leafRows-1),turnTick=Math.round(turnAfter*60);
  for(let cycle=0;cycle<=Math.floor(duration/4);cycle++)for(let row=0;row<leafRows;row++)for(let color=0;color<2;color++){
   if(row%rowStride)continue;
   const group={path:leafPath(row,color),turnAfter,stamp:-Infinity};
   for(let arm=0;arm<leafArms;arm++){
    const a=leafLaunch(cycle,color)+arm*TAU/leafArms,cos=Math.cos(a),sin=Math.sin(a);
    const d=add(`leaf:${cycle}:${row}:${color*leafArms+arm}`,cycle*4+row*interval,6,'leaf',color?'#48ff71':'#c2ffe0',7,{a,baseAngle:((a+Math.PI)%TAU+TAU)%TAU-Math.PI,cos,sin,tailUp:group.path.c[turnTick]*sin+group.path.s[turnTick]*cos<=0,group});
    if(d)d.bullet.headingFixed=false;
   }
  }
 }else if(pattern==='gray-thaumaturgy'){
  grayGroups=[];
  for(let cycle=0;cycle<=Math.floor(duration/7);cycle++){
   const group={cycle,stamp:-Infinity,live:[[],[]]};grayGroups.push(group);
   for(let color=0;color<2;color++)for(let n=0;n<100;n++)for(let arm=0;arm<5;arm++){
    if(Math.floor(n*rowDensity)===Math.floor((n+1)*rowDensity))continue;
    add(`star:${cycle}:${color}:${n}:${arm}`,cycle*7+(n+1)/60,4,color?'round':'rice',color?'#ffc6dc':'#8baaff',color?2.7:3.8,{cycle,colorIndex:color,n,arm,group,prepareKind:'gray',update:updateGray});
   }
  }
 }else if(pattern==='six-realms-sword'){
  for(let cycle=0;cycle<=Math.floor(duration/YOUMU_PERIOD);cycle++)youmuCycle(cycle,d=>add(d.id,d.birth,4,d.kind,d.color,d.radius,{...d,angleStart:project(d.a),update:updateYoumu}));
 }else if(pattern==='resurrection-butterfly'){
  for(let cycle=0;cycle<=Math.floor(duration/YUYUKO_PERIOD);cycle++){
   yuyukoCycle(cycle,d=>add(d.id,d.birth,4,d.kind,d.color,d.radius,{...d,update:updateYuyuko}));
   if(cycle*YUYUKO_PERIOD<emissionUntil)for(let j=0;j<2*(3+cycle);j++)scheduleBeam({kind:'yuyuko',cycle,j,birth:cycle*YUYUKO_PERIOD,end:cycle*YUYUKO_PERIOD+5});
  }
 }else if(pattern==='invisible-full-moon'){
  for(let cycle=0;cycle<=Math.floor(duration/MOON_PERIOD);cycle++)moonCycle(cycle,d=>add(d.id,d.birth,4,d.kind,d.color,d.radius,{...d,angleStart:project(d.a),alpha:1,update:updateMoon}),rowDensity,stride);

 }
 events.sort((a,b)=>a.birth-b.birth||a.order-b.order);beamEvents.sort((a,b)=>a.birth-b.birth||a.order-b.order);stats.events=events.length;
 const beamPool=[];
 function addBeam(x,y,a,length,width,color,alpha,core=true,taper=false){const i=output.beams.length,b=beamPool[i]||(beamPool[i]={});Object.assign(b,{x:origin.x+x*sx,y:origin.y+y*sy,dx:Math.cos(a)*length*sx,dy:Math.sin(a)*length*sy,width:width*sx,color,alpha,core,taper});output.beams.push(b);}

 function prepare(d){
  if(d.prepared)return;
  if(d.prepareKind==='gray'){d.group.heading??=aim(d.cycle*7);grayGeometry(d,d.group.heading);d.angleStart=project(d.launchAngle);d.angleEnd=project(d.exitAngle);d.prepared=true;return;}

 }

 function step(t){
  motionFrame++;
  if(t<last){cursor=0;beamCursor=0;active.length=0;activeBeams.length=0;}last=t;output.bullets.length=0;output.beams.length=0;
  while(cursor<events.length&&eligible(events[cursor],t)){const d=events[cursor++];prepare(d);if(d.type===5)resetMotion(d);else if(d.type===6)resetTurnMotion(d);let lo=0,hi=active.length;while(lo<hi){const mid=(lo+hi)>>1;if(active[mid].order<d.order)lo=mid+1;else hi=mid;}active.splice(lo,0,d);stats.spawned++;}
  stats.visited=active.length;let kept=0;
  for(const d of active){
   const age=t-d.birth,b=d.bullet;let x,y,angle=d.angle,color=d.color;
   if(d.type===5){advanceMotion(d,age);x=d.x;y=d.y;angle=d.outAngle;}
   else if(d.type===6){advanceTurnMotion(d,age);x=d.x;y=d.y;angle=d.outAngle;}
   else if(d.type===0){x=d.x0+d.vx*age;y=d.y0+d.vy*age;}
   else{d.update(d,age,t);x=d.x;y=d.y;angle=d.outAngle;}
   const nx=origin.x+x*sx,ny=origin.y+y*sy;
   const safeExit=retireOutsideViewport&&(pattern==='six-realms-sword'?t>=d.release:pattern==='resurrection-butterfly'?age>=2:pattern==='invisible-full-moon');
   if(safeExit){const margin=d.radius/192+.01,vertical=margin*aspect,co=Math.cos(angle),si=Math.sin(angle);if(nx< -margin&&co<=0||nx>1+margin&&co>=0||ny< -vertical&&si<=0||ny>1+vertical&&si>=0){stats.retired++;onRetire(d.id);continue;}}
   if(bounds&&(nx<bounds.left||nx>bounds.right||ny<bounds.top||ny>bounds.bottom)){stats.retired++;onRetire(d.id);continue;}
   active[kept++]=d;b.x=nx;b.y=ny;b.angle=angle;b.color=d.currentColor??color;b.alpha=d.alpha??1;output.bullets.push(b);
  }
  active.length=kept;

  while(beamCursor<beamEvents.length){const d=beamEvents[beamCursor],ready=d.birth<=t;if(!ready)break;beamCursor++;let lo=0,hi=activeBeams.length;while(lo<hi){const mid=(lo+hi)>>1;if(activeBeams[mid].order<d.order)lo=mid+1;else hi=mid;}activeBeams.splice(lo,0,d);}
  let beamKept=0;for(const d of activeBeams){
   const age=t-d.birth,limit=d.kind==='yuyuko'?5:.65;if(age>=limit)continue;activeBeams[beamKept++]=d;
   if(d.kind==='yuyuko'){const laser=yuyukoLaser(d.cycle,d.j,t),a=laser.angle;addBeam(Math.cos(a)*64,Math.sin(a)*64,a,384,laser.width,d.j<3+d.cycle?'#fa87df':'#a9e8ff',laser.alpha);}
   else if(d.kind==='sword')addBeam(d.x,d.y,d.a,d.length,2.4,'#d7f5ff',Math.min(1,age*18,(.65-age)*8),false);

  }activeBeams.length=beamKept;

  return output;
 }
 // A1 has only ice shards and straight pellets. Keep its hot loop free of
 // unrelated spell branches while retaining emission and painter order.
 function stepIce(t){
  motionFrame++;
  if(t<last){cursor=0;active.length=0;}last=t;output.bullets.length=0;
  while(cursor<events.length&&eligible(events[cursor],t)){
   const d=events[cursor++];if(d.type===5)resetMotion(d);
   let lo=0,hi=active.length;while(lo<hi){const mid=(lo+hi)>>1;if(active[mid].order<d.order)lo=mid+1;else hi=mid;}active.splice(lo,0,d);stats.spawned++;
  }
  stats.visited=active.length;let kept=0;
  for(const d of active){
   const age=t-d.birth,b=d.bullet;let x,y,angle;
   if(d.type===5){advanceMotion(d,age);x=d.x;y=d.y;angle=d.outAngle;}
   else{x=d.x0+d.vx*age;y=d.y0+d.vy*age;angle=d.angle;}
   const nx=origin.x+x*sx,ny=origin.y+y*sy;
   if(bounds&&(nx<bounds.left||nx>bounds.right||ny<bounds.top||ny>bounds.bottom)){stats.retired++;onRetire(d.id);continue;}
   active[kept++]=d;b.x=nx;b.y=ny;b.angle=angle;output.bullets.push(b);
  }
  active.length=kept;return output;
 }
 // A2's cycle/row/colour/arm emission order is already painter order.
 // A monotonic clock can append directly; rewinding reconstructs the list.
 function stepLeaf(t){
  motionFrame++;
  if(t<last){cursor=0;active.length=0;}last=t;output.bullets.length=0;
  while(cursor<events.length&&events[cursor].birth<=t){active.push(events[cursor++]);stats.spawned++;}
  stats.visited=active.length;let kept=0;
  for(const d of active){
   const g=d.group,b=d.bullet,age=t-d.birth,settled=age>=turnAfter;updateLeafGroup(g,age);
   const nx=origin.x+(g.x*d.cos-g.y*d.sin)*sx,ny=origin.y+(g.x*d.sin+g.y*d.cos)*sy;
   // The turning phase can return from above the screen. Retire only the
   // fully hidden, outward-moving tangent after its turn has finished.
   if((bounds&&(nx<bounds.left||nx>bounds.right||ny<bounds.top||ny>bounds.bottom))||(retireAboveViewport&&settled&&d.tailUp&&ny+b.radius*aspect<0)){stats.retired++;onRetire(d.id);continue;}
   let angle=d.baseAngle+g.angle;if(angle>=Math.PI)angle-=TAU;else if(angle< -Math.PI)angle+=TAU;
   active[kept++]=d;b.x=nx;b.y=ny;b.angle=angle;b.headingFixed=settled;output.bullets.push(b);
  }
  active.length=kept;return output;
 }
 // A3 painter order is cycle, colour, emission index, arm. Independent
 // colour queues append chronologically without shifting the pink queue.
 function stepGray(t){
  motionFrame++;
  if(t<last){cursor=0;for(const g of grayGroups)for(const live of g.live)live.length=0;}last=t;output.bullets.length=0;output.beams.length=0;
  while(cursor<events.length&&events[cursor].birth<=t){const d=events[cursor++];prepare(d);d.group.live[d.colorIndex].push(d);stats.spawned++;}
  stats.visited=0;
  for(const g of grayGroups){
   if(!g.live[0].length&&!g.live[1].length)continue;
   grayTiming(g,t);g.stamp=motionFrame;
   for(const live of g.live){
    stats.visited+=live.length;let kept=0;
    for(const d of live){
     const b=d.bullet,nx=origin.x+(d.x0+d.vx*g.travel+d.ax*g.accel)*sx,ny=origin.y+(d.y0+d.vy*g.travel+d.ay*g.accel)*sy;
     if(bounds&&(nx<bounds.left||nx>bounds.right||ny<bounds.top||ny>bounds.bottom)){stats.retired++;onRetire(d.id);continue;}
     live[kept++]=d;b.x=nx;b.y=ny;b.angle=g.departed?d.angleEnd:d.angleStart;output.bullets.push(b);
    }
    live.length=kept;
   }
  }
  return output;
 }
 function setOrigin(value){
  origin=value;bounds=origin.x>=.1&&origin.x<=.9&&origin.y>=0&&origin.y<=.5&&aspect>=.35&&aspect<=1?VIRTUAL_BOUNDS[pattern]:null;
  if(pattern==='icicle-fall'){
   sy=(1-origin.y)/352;
   for(const d of events)if(d.type===5){d.angleStart=project(d.a);d.angleEnd=project(d.down);}else d.angle=project(d.a);
  }
 }
 function reset(){
  cursor=beamCursor=motionFrame=0;last=-Infinity;active.length=activeBeams.length=output.bullets.length=output.beams.length=0;aimCache.clear();stats.spawned=stats.retired=stats.visited=0;
  for(const d of events){d.prepared=false;if(d.group){d.group.stamp=-Infinity;d.group.heading=undefined;}}
  if(grayGroups)for(const g of grayGroups)for(const live of g.live)live.length=0;
 }
 return {step:pattern==='icicle-fall'?stepIce:pattern==='leaf-veiling'?stepLeaf:pattern==='gray-thaumaturgy'?stepGray:step,stats,setOrigin,reset};
}

const api={sample,createSimulation,virtualBounds:VIRTUAL_BOUNDS};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TouhouSpellPatterns=api;
})(typeof window!=='undefined'?window:globalThis);
