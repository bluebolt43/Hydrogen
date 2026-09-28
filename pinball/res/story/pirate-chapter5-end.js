function render(elapsed){
 document.querySelector('#ch5-story').hidden=false;
 const ms=elapsed-ch5Start,endMs=elapsed-ch5Stop;
 const fade=clamp((endMs-2600)/1500,0,1);
 const establishing=document.querySelector('#ch5-establishing');
 const zoom=Math.min(phone.clientWidth/establishing.naturalWidth,phone.clientHeight/establishing.naturalHeight);
 establishing.style.width=`${establishing.naturalWidth*zoom}px`;
 establishing.style.height=`${establishing.naturalHeight*zoom}px`;
 establishing.style.left=`${(phone.clientWidth-establishing.naturalWidth*zoom)*.5}px`;
 establishing.style.top=`${(phone.clientHeight-establishing.naturalHeight*zoom)*.5}px`;
 document.querySelector('#ch5-reveal').style.opacity=1-fade;
 document.querySelector('#ch5-defeated').style.opacity=fade;
 const intensity=Math.max(...[1000,1800,2600].map(at=>{const age=endMs-at;return age>=0&&age<1100?1.4*(1-age/1100):0;}));
 const x=(Math.sin(ms*.083)+Math.sin(ms*.137)*.5)*phone.clientWidth*.024*intensity;
 const y=(Math.cos(ms*.107)+Math.sin(ms*.173)*.5)*phone.clientHeight*.012*intensity;
 document.querySelector('#ch5-composition').style.transform=`translate(${x}px,${y}px) scale(${1+intensity*.08})`;
    document.querySelectorAll('.ch5-blast').forEach((smoke,index)=>{
      const t=(endMs-1000-index*800)/1100;
      const visible=t>=0 && t<1;
      smoke.style.opacity=visible?Math.min(t/.12,1)*(1-clamp((t-.5)/.5,0,1)):0;
      smoke.style.left=`${[35,65,50][index]}%`;
      smoke.style.transform=`translate(-50%,-50%) translateY(${-Math.max(0,t)*20}px) scale(${.45+clamp(t,0,1)*.9})`;
    });
 phone.dataset.phase='stage5-end';
}
