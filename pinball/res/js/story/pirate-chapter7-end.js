const ch7EndLayout={"version":1,"coordinateSystem":"background-pixels","background":{"src":"../img/stage7-3.png","width":1672,"height":941},"camera":{"x":560,"y":22,"width":500,"height":888.89,"aspectRatio":"9:16"},"objects":[{"id":"stage7-4-1","asset":"stage7-4","src":"../img/stage7-4.png","x":450,"y":173,"width":700,"height":583.33,"zIndex":1},{"id":"stage7-3-boss-2","asset":"stage7-3-boss","src":"../img/stage7-3-boss.png","x":470,"y":356,"width":700,"height":393.96,"zIndex":2},{"id":"stage7-4-3","asset":"stage7-4","src":"../img/stage7-4.png","x":850,"y":300,"width":100,"height":83.33,"zIndex":3},{"id":"stage7-5-4","asset":"stage7-5","src":"../img/stage7-5.png","x":596.2,"y":219.35,"width":435.99,"height":245.38,"zIndex":4}]};
function renderCh7End(ms){
 const camera=ch7EndLayout.camera,scale=phone.clientWidth/camera.width;
 const world=document.querySelector('#ch7-end-world');
 world.style.width=ch7EndLayout.background.width+'px';world.style.height=ch7EndLayout.background.height+'px';
 world.style.transform=`translate(${-camera.x*scale}px,${-camera.y*scale}px) scale(${scale})`;
 const large=ch7EndLayout.objects.find(o=>o.asset==='stage7-4'&&o.width>500);
 const small=ch7EndLayout.objects.find(o=>o.asset==='stage7-4'&&o.width<500);
 const defeated=document.querySelector('#ch7-end-defeated');
 const travel=clamp((ms-3700)/2000,0,1);
 for(const key of ['x','y','width','height'])defeated.style[key==='x'?'left':key==='y'?'top':key]=`${large[key]+(small[key]-large[key])*travel}px`;
 defeated.style.opacity=ms<3700?0:1-clamp((ms-5700)/1000,0,1);
 document.querySelector('#ch7-end-boss').style.opacity=ms<3700?1:0;
 document.querySelector('#ch7-end-finale').style.opacity=clamp((ms-8700)/1500,0,1);
 const shake=Math.max(...[1000,1800,2600].map(at=>{
  const age=ms-at;return age>=0&&age<1100?1.4*(1-age/1100):0;
 }));
 const x=(Math.sin(ms*.083)+Math.sin(ms*.137)*.5)*phone.clientWidth*.024*shake;
 const y=(Math.cos(ms*.107)+Math.sin(ms*.173)*.5)*phone.clientHeight*.012*shake;
 document.querySelector('#ch7-end-shake').style.transform=`translate(${x}px,${y}px) scale(${1+shake*.08})`;
 document.querySelectorAll('.ch7-end-blast').forEach((smoke,index)=>{
  const t=(ms-1000-index*800)/1100;
  smoke.style.opacity=t>=0&&t<1?Math.min(t/.12,1)*(1-clamp((t-.5)/.5,0,1)):0;
  smoke.style.left=`${[45,59,52][index]}%`;
  smoke.style.transform=`translate(-50%,-50%) translateY(${-clamp(t,0,1)*20}px) scale(${.45+clamp(t,0,1)*.9})`;
 });
}

function render(elapsed){document.querySelector('#ch7-end-story').hidden=false;renderCh7End(elapsed-ch7EndStart);phone.dataset.phase='stage7-end';}
