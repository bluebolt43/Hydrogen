const sharkArrival=document.querySelector('#shark-arrival');
function render(elapsed){
  sharkArrival.hidden = elapsed < sharkStart || elapsed >= ch3FirstStart;
  document.querySelector('#ch3-first').hidden = elapsed < ch3FirstStart || elapsed >= ch3SecondStart;
  document.querySelector('#ch3-second').hidden = elapsed < ch3SecondStart || elapsed >= sharkEndStart;
  document.querySelector('#ch3-comic-panel').hidden = sharkArrival.hidden;
  if (!sharkArrival.hidden) {
    const progress = clamp((elapsed - sharkStart - 300) / 1500, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    document.querySelector('#ch3-fish').style.transform = `translateX(${110 * (1 - eased)}%)`;
  }
phone.dataset.phase=elapsed<ch3FirstStart?'stage3-comic':elapsed<ch3SecondStart?'stage3-1':'stage3-2';
}
