const sharkEnd=document.querySelector('#shark-end');
const bottleEnding=document.querySelector('#bottle-ending');
const bottle=document.querySelector('#bottle');
const wave=document.querySelector('#wave');
function renderBottle(ms) {
 const t=clamp((ms-1000)/3400,0,1),ease=t*t*(3-2*t);
 const bob=Math.sin(ms/800)*3*ease;
 bottle.style.opacity=ease;
 bottle.style.transform=`translateY(${(1-ease)*95+bob}px) rotate(${Math.sin(ms/1100)*2*ease}deg)`;
 wave.style.transform=`translate(${Math.sin(ms/2100)*12}px,${Math.sin(ms/1300)*3}px)`;
}
function render(elapsed){
  sharkEnd.hidden = elapsed < sharkEndStart || elapsed >= bottleStart;
  bottleEnding.hidden = elapsed < bottleStart || elapsed >= nightStart;
phone.dataset.phase=elapsed<bottleStart?'stage3-3':'bottle';
if(elapsed>=bottleStart)renderBottle(elapsed-bottleStart);
}
