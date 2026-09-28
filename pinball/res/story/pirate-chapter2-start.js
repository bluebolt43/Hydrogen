const scene5=document.querySelector('#scene5');
const finaleShots = {
  cooking: { x: .22, y: .64, scale: 1.85 },
  smoke: { x: .52, y: .61, scale: 1.75 },
  ship: { x: .87, y: .62, scale: 1.65 },
  // 從船的 1.65 倍鏡頭往上拉遠，揭露上方生氣海賊與下方船。
  angry: { x: .75, y: .30, scale: 1.15 }
};
function renderFinale(elapsed) {
  let shot = finaleShots.cooking, phase = 'cooking';
  let dx = 0, dy = 0;
  if (elapsed >= 3000 && elapsed < 4800) {
    shot = finaleShots.smoke; phase = 'explosion';
    const t = (elapsed - 3000) / 1000;
    const strength = Math.pow(1 - t / 1.8, 1.5);
    dx = (Math.sin(t * 83 + 1) + .45 * Math.sin(t * 137)) * .04 * strength * phone.clientWidth;
    dy = (Math.cos(t * 97) + .4 * Math.sin(t * 151)) * .022 * strength * phone.clientHeight;
  } else if (elapsed >= 4800) {
    shot = finaleShots.ship; phase = 'ship';
    if (elapsed >= 6300) {
      shot = blend(finaleShots.ship, finaleShots.angry, (elapsed - 6300) / 3000);
      phase = elapsed < 9300 ? 'angry-zoom' : 'angry';
    }
  }
  const h = phone.clientHeight, w = h * scene5.naturalWidth / scene5.naturalHeight;
  const x = clamp(phone.clientWidth / 2 - shot.x * w * shot.scale + dx, phone.clientWidth - w * shot.scale, 0);
  const y = clamp(h / 2 - shot.y * h * shot.scale + dy, h - h * shot.scale, 0);
  scene5.style.transform = `translate(${x}px, ${y}px) scale(${shot.scale})`;
  phone.dataset.phase = phase;
}
function render(elapsed){scene5.hidden=false;renderFinale(elapsed-scene5Start);}
