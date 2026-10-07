// Snapshot of stage7-3-layout.json; positions are in background pixels.
const ch7Layout={"version":1,"coordinateSystem":"background-pixels","background":{"src":"../img/pirate-story-kraken-cave.png","width":1672,"height":941},"camera":{"x":560,"y":22,"width":500,"height":888.89,"aspectRatio":"9:16"},"objects":[{"id":"pirate-eye-closed-1","asset":"pirate-eye-closed","src":"../img/pirate-eye-closed.png","x":736,"y":268,"width":35,"height":33.97,"zIndex":1},{"id":"pirate-eye-closed-2","asset":"pirate-eye-closed","src":"../img/pirate-eye-closed.png","x":828,"y":210,"width":40,"height":38.82,"zIndex":2},{"id":"pirate-eye-glowing-3","asset":"pirate-eye-glowing","src":"../img/pirate-eye-glowing.png","x":637,"y":278,"width":60,"height":58.24,"zIndex":3},{"id":"pirate-eye-open-4","asset":"pirate-eye-open","src":"../img/pirate-eye-open.png","x":948,"y":272,"width":60,"height":58.24,"zIndex":4},{"id":"pirate-eye-open-5","asset":"pirate-eye-open","src":"../img/pirate-eye-open.png","x":890,"y":316,"width":50,"height":48.53,"zIndex":5},{"id":"pirate-story-kraken-body-6","asset":"pirate-story-kraken-body","src":"../img/pirate-story-kraken-body.png","x":470,"y":356,"width":700,"height":393.96,"zIndex":6},{"id":"pirate-story-kraken-attack-burst-7","asset":"pirate-story-kraken-attack-burst","src":"../img/pirate-story-kraken-attack-burst.png","x":0,"y":0,"width":1680,"height":945.5,"zIndex":7}]};
let ch7EyeSchedules=[];
function resetCh7Eyes(){
 ch7EyeSchedules=Array.from({length:5},()=>{
  const schedule=[];let time=800;
  while(time<6000){time+=500+Math.random()*500;schedule.push({time,third:Math.random()<.5});}
  return schedule;
 });
}
resetCh7Eyes();
function renderCh7Third(ms){
 const camera=ch7Layout.camera, scale=phone.clientWidth/camera.width;
 const world=document.querySelector('#ch7-third-world');
 world.style.width=ch7Layout.background.width+'px';world.style.height=ch7Layout.background.height+'px';
 const attackTime=ms-9900;
 const zoom=attackTime<0 || attackTime>=400 ? 1
  : attackTime<200 ? 1-.01*attackTime/200
  : .99+.01*(attackTime-200)/200;
 const riseTime=ms-4300;
 const quake=riseTime>=0 && riseTime<3000
  ? Math.min(riseTime/180,1,(3000-riseTime)/250) : 0;
 const quakeX=(Math.sin(ms*.091)+Math.sin(ms*.163)*.5)*phone.clientWidth*.012*quake;
 const quakeY=(Math.cos(ms*.117)+Math.sin(ms*.193)*.5)*phone.clientHeight*.009*quake;
 const centeredX=phone.clientWidth*(1-zoom)/2+quakeX;
 const centeredY=phone.clientHeight*(1-zoom)/2+quakeY;
 world.style.transform=`translate(${centeredX-camera.x*scale*zoom}px,${centeredY-camera.y*scale*zoom}px) scale(${scale*zoom})`;
 const t=ms-1500;
 document.querySelectorAll('.ch7-eye').forEach((eye,index)=>{
  eye.style.opacity=clamp(t/800,0,1);
  let third=false;for(const frame of ch7EyeSchedules[index]){if(t<frame.time)break;third=frame.third;}
  eye.querySelector('.eye-third').style.opacity=third?1:0;
 });
 const boss=document.querySelector('#ch7-boss'), pose=ch7Layout.objects.find(o=>o.asset==='pirate-story-kraken-body');
 const rise=t-2800,below=pose.height+20;
 let shift=below;
 if(rise>=0 && rise<3000)shift=below*(1-rise/3000);
 else if(rise>=3000 && rise<3200)shift=(8/scale)*(rise-3000)/200;
 else if(rise>=3200 && rise<3600)shift=(8/scale)*(1-(rise-3200)/400);
 else if(rise>=3600)shift=0;
 boss.style.opacity=rise>=0?1:0;boss.style.transform=`translateY(${shift}px)`;
 const bob=document.querySelector('#ch7-bob');
 bob.style.opacity=rise<0?0:Math.min(rise/400,1)*Math.max(0,Math.min((2800-rise)/400,1));
 const flutterX=(Math.sin(rise*.039)+Math.sin(rise*.083)*.5)/1.5*2/scale;
 const flutterY=(Math.cos(rise*.047)+Math.sin(rise*.071)*.5)/1.5*2/scale;
 bob.style.transform=bob.style.opacity>0?`translate(${flutterX}px,${flutterY}px)`:'translate(0,0)';
 document.querySelector('#ch7-attack').style.opacity=clamp((rise-5600)/1000,0,1);
}


function render(elapsed){document.querySelector('#ch7-story').hidden=false;
  if(elapsed>=ch7Start){
    document.querySelector('#ch7-third').hidden=false;
    const ch7Ms=elapsed-ch7Start;
    const pan=clamp((ch7Ms-2500)/12000,0,1);
    document.querySelector('#ch7-composition').style.opacity=clamp((ch7Ms-1000)/1500,0,1);
    const eased=pan*pan*(3-2*pan);
    document.querySelector('#ch7-composition').style.transform=`translate(-37.5%,${(eased-1)*75}%) scale(1.75)`;
    const second=document.querySelector('#ch7-second');
    const secondMs=ch7Ms-16500;
    second.style.opacity=clamp(secondMs/1500,0,1)*(1-clamp((ch7Ms-30500)/1500,0,1));
    document.querySelector('#ch7-composition').hidden=secondMs>=1500;
    document.querySelector('#ch7-whirlpool').style.animationPlayState=secondMs>=1500?'paused':'running';
    const travel=clamp(secondMs/12000,0,1);
    const scale=Math.max(phone.clientWidth/second.naturalWidth,phone.clientHeight/second.naturalHeight)*1.75;
    const width=second.naturalWidth*scale,height=second.naturalHeight*scale;
    second.style.width=`${width}px`;second.style.height=`${height}px`;
    second.style.transform=`translate(${(phone.clientWidth-width)*travel}px,${(phone.clientHeight-height)*(1-travel)}px)`;
    document.querySelector('#ch7-third').style.opacity=clamp((ch7Ms-33000)/1500,0,1);
    renderCh7Third(ch7Ms-33000);
    phone.dataset.phase=ch7Ms<1000?'stage7-black':ch7Ms<2500?'stage7-1-fade':ch7Ms<16500?'stage7-whirlpool':ch7Ms<28500?'stage7-2-pan':ch7Ms<30500?'stage7-2-hold':ch7Ms<32000?'stage7-fade-black':ch7Ms<33000?'stage7-black-hold':'stage7-3-fade';
    return;
  }
}
function resetChapter(){resetCh7Eyes();}
