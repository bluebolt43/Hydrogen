function render(elapsed){
document.querySelector("#ch5-story").hidden=false;
  if(elapsed>=ch5Start){
    const ms=elapsed-ch5Start;
    const ch5Panel=document.querySelector('#ch5-panel');
    ch5Panel.hidden=false;
    ch5Panel.style.opacity=clamp((ms-2500)/1200,0,1);
    const shaking=ms>=6000 && ms<8500;
    const intensity=shaking ? 1-clamp((ms-7800)/700,0,1) : 0;
    const x=(Math.sin(ms*.083)+Math.sin(ms*.137)*.5)*phone.clientWidth*.024*intensity;
    const y=(Math.cos(ms*.107)+Math.sin(ms*.173)*.5)*phone.clientHeight*.012*intensity;
    document.querySelector('#ch5-composition').style.transform=`translate(${x}px,${y}px) scale(${1+intensity*.08})`;
    const pullback=clamp((ms-10000)/2000,0,1);
    const easedPullback=pullback*pullback*(3-2*pullback);
    const establishing=document.querySelector('#ch5-establishing');
    const fit=Math.max(phone.clientWidth/establishing.naturalWidth,phone.clientHeight/establishing.naturalHeight);
    const fullFit=Math.min(phone.clientWidth/establishing.naturalWidth,phone.clientHeight/establishing.naturalHeight);
    const closeZoom=fit*1.725;
    const zoom=closeZoom+(fullFit-closeZoom)*easedPullback;
    establishing.style.width=`${establishing.naturalWidth*zoom}px`;
    establishing.style.height=`${establishing.naturalHeight*zoom}px`;
    establishing.style.left=`${(phone.clientWidth-establishing.naturalWidth*zoom)*(.6-.1*easedPullback)}px`;
    establishing.style.top=`${(phone.clientHeight-establishing.naturalHeight*zoom)*.5}px`;
    const emotion=document.querySelector('#ch5-emotion');
    const cycle=ms%2400;
    emotion.style.opacity=Math.min(clamp(cycle/350,0,1),clamp((1900-cycle)/450,0,1));
    emotion.style.left=`${parseFloat(establishing.style.left)+establishing.naturalWidth*zoom*.61}px`;
    emotion.style.top=`${parseFloat(establishing.style.top)+establishing.naturalHeight*zoom*.49}px`;
    const symbol='ZZZ';
    document.querySelector('#ch5-emotion-text').textContent=symbol;
    emotion.setAttribute('aria-label',symbol);
    document.querySelector('#ch5-reveal').style.opacity=clamp((ms-12000)/1500,0,1);
    phone.dataset.phase=ms<2500?'stage5-1':ms<3700?'stage5-2-fade':ms<6000?'stage5-2-hold':shaking?'stage5-shake':ms<10000?'stage5-pause':ms<12000?'stage5-pullback':ms<13500?'stage5-3-fade':'stage5-3';
    return;
  }
}
