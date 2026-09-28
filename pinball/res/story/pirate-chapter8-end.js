function renderCh8End(ms){
  const scale=phone.clientWidth/940;
  document.querySelector('#ch8-end-world').style.transform=`scale(${scale})`;
  const fadeIn=clamp((ms-2600)/1100,0,1);
  document.querySelector('#ch8-end-third').style.opacity=fadeIn;
  const ship=document.querySelector('#ch8-end-ship');
  const travel=clamp((ms-5700)/8000,0,1);
  const large={x:358.87,y:700.66,width:588.54,height:441.4};
  const small={x:227.35,y:901.14,width:170.94,height:128.2};
  for(const key of ['x','y','width','height']) ship.style[key==='x'?'left':key==='y'?'top':key]=`${large[key]+(small[key]-large[key])*travel}px`;
  ship.style.opacity=fadeIn*(1-clamp((ms-13700)/1000,0,1));
  const finale=document.querySelector('#ch8-end-finale');
  finale.hidden=ms<15700;
  finale.style.opacity=clamp((ms-15700)/1500,0,1);
  const finaleWorld=document.querySelector('#ch8-end-finale-world');
  finaleWorld.style.transform=`scale(${scale})`;
  finaleWorld.style.opacity=clamp((ms-19200)/1500,0,1)*(1-clamp((ms-29500)/1200,0,1));
  const dialogueBeat=clamp(Math.floor((ms-20700)/3000),0,2);
  const dialogueText=document.querySelector('#ch8-end-dialogue-text');
  const treasure=document.querySelector('#ch8-end-treasure');
  dialogueText.hidden=dialogueBeat===1;
  dialogueText.textContent=dialogueBeat===2?':)':'♪';
  dialogueText.style.transform=dialogueBeat===2?'rotate(90deg)':'none';
  treasure.hidden=dialogueBeat!==1;
  document.querySelector('#ch8-end-dialogue').setAttribute('aria-label',['音符','財寶','微笑'][dialogueBeat]);
  document.querySelector('#ch8-end-fifth').style.opacity=clamp((ms-35700)/1500,0,1);
  document.querySelector('#ch8-end-sixth').style.opacity=clamp((ms-44200)/1500,0,1);
  document.querySelector('#ch8-end-black').style.opacity=clamp((ms-46700)/500,0,1);
  const shake=Math.max(...[1000,1800,2600].map(at=>{
    const age=ms-at;return age>=0&&age<1100?1.4*(1-age/1100):0;
  }));
  const x=(Math.sin(ms*.083)+Math.sin(ms*.137)*.5)*phone.clientWidth*.024*shake;
  const y=(Math.cos(ms*.107)+Math.sin(ms*.173)*.5)*phone.clientHeight*.012*shake;
  document.querySelector('#ch8-end-shake').style.transform=`translate(${x}px,${y}px) scale(${1+shake*.08})`;
  document.querySelectorAll('.ch8-end-blast').forEach((smoke,index)=>{
    const t=(ms-1000-index*800)/1100;
    smoke.style.opacity=t>=0&&t<1?Math.min(t/.12,1)*(1-clamp((t-.5)/.5,0,1)):0;
    smoke.style.left=`${[45,59,52][index]}%`;
    smoke.style.transform=`translate(-50%,-50%) translateY(${-clamp(t,0,1)*20}px) scale(${.45+clamp(t,0,1)*.9})`;
  });
  phone.dataset.phase=ms<1000?'stage8-end-establish':ms<3700?'stage8-end-blast':ms<5700?'stage8-end-ship-hold':ms<13700?'stage8-end-ship-move':ms<14700?'stage8-end-ship-fade':ms<15700?'stage8-end-wait':ms<17200?'stage8-end-finale-fade':ms<19200?'stage8-end-finale-hold':ms<20700?'stage8-end-panel-fade':ms<29500?'stage8-end-dialogue':ms<30700?'stage8-end-panel-fade-out':ms<35700?'stage8-end-after-panel-hold':ms<37200?'stage8-end-fifth-fade':ms<44200?'stage8-end-fifth-hold':ms<45700?'stage8-end-sixth-fade':ms<46700?'stage8-end-sixth-hold':ms<47200?'stage8-end-black':'stage8-end-black-hold';
}

function render(elapsed){document.querySelector('#ch8-end-story').hidden=false;renderCh8End(elapsed-ch8End);}
