function render(elapsed){
document.querySelector("#ch6-story").hidden=false;
  if(elapsed>=ch6Start){
    const ms=elapsed-ch6Start;
    document.querySelector('#ch6-creature').style.opacity=clamp((ms-2500)/1500,0,1);
    document.querySelector('#ch6-mouth-panel').style.opacity=clamp((ms-7500)/1500,0,1);
    phone.dataset.phase=ms<2500?'stage6-1':ms<4000?'stage6-2-fade':ms<7500?'stage6-2':ms<9000?'stage6-3-fade':'stage6-3';
  }
}
