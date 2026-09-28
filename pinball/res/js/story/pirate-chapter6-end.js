function render(elapsed){
document.querySelector("#ch6-story").hidden=false;
  if(elapsed>=ch6Start){
    const ms=elapsed-ch6Start;
    document.querySelector('#ch6-creature').style.opacity=1;
    const endMs=elapsed-ch6End;
    const defeatedFade=clamp((endMs-2600)/1500,0,1);
    document.querySelector('#ch6-mouth-panel').style.opacity=1-defeatedFade;
    document.querySelector('#ch6-defeated').style.opacity=defeatedFade;
    const shake=Math.max(...[1000,1800,2600].map(at=>{
      const age=endMs-at;return age>=0 && age<1100?1.4*(1-age/1100):0;
    }));
    const x=(Math.sin(ms*.083)+Math.sin(ms*.137)*.5)*phone.clientWidth*.024*shake;
    const y=(Math.cos(ms*.107)+Math.sin(ms*.173)*.5)*phone.clientHeight*.012*shake;
    document.querySelector('#ch6-composition').style.transform=`translate(${x}px,${y}px) scale(${1+shake*.08})`;
    document.querySelectorAll('.ch6-blast').forEach((smoke,index)=>{
      const t=(endMs-1000-index*800)/1100;
      smoke.style.opacity=t>=0 && t<1?Math.min(t/.12,1)*(1-clamp((t-.5)/.5,0,1)):0;
      smoke.style.left=`${[40,60,50][index]}%`;
      smoke.style.transform=`translate(-50%,-50%) translateY(${-clamp(t,0,1)*20}px) scale(${.45+clamp(t,0,1)*.9})`;
    });
    phone.dataset.phase='stage6-end';
    return;
  }
}
