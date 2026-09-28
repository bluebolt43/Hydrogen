const scene=document.querySelector('#scene');
const scene2=document.querySelector('#scene2');
const scene3=document.querySelector('#scene3');
const hooked=document.querySelector('#hooked');
const snapped=document.querySelector('#snapped');
const floor=document.querySelector('#floor');
const flyingFish=document.querySelector('#flying-fish');
const pirateHand=document.querySelector('#pirate-hand');
const bubble=document.querySelector('#bubble');
const shots = {
  birds: { x: .60, y: .19, scale: 2.8 },
  sky: { x: .70, y: .25, scale: 2 },
  buoy: { x: .77, y: .659, scale: 4 },
  person: { x: .34, y: .697, scale: 1.65 }
};
function renderFish(elapsed) {
  const zoom = clamp(elapsed / 4000, 0, 1);
  const ease = zoom * zoom * (3 - 2 * zoom);
  hooked.style.transform = `scale(${1.5 - .5 * ease})`;
  snapped.hidden = elapsed < 4000;
  floor.style.opacity = clamp((elapsed - 6000) / 1200, 0, 1);
  flyingFish.hidden = elapsed < 7200;
  const t = clamp((elapsed - 7200) / 2000, 0, 1);
  const flight = 1 - Math.pow(1 - t, 3);
  // 從左上畫面外飛入，旋轉一圈後停在畫面中央。
  const x = -phone.clientWidth * 1.1 * (1 - flight);
  const y = -phone.clientHeight * .8 * (1 - flight);
  flyingFish.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${-360 * (1 - flight)}deg) scale(${.6 + .4 * flight})`;
  // 魚落地稍停，再讓手與袖子由右下方伸入，接到下一幕海賊拿魚。
  pirateHand.hidden = elapsed < 9900;
  pirateHand.style.display = elapsed < 9900 ? 'none' : 'block';
  const reach = clamp((elapsed - 9900) / 2200, 0, 1);
  const reachEase = reach * reach * (3 - 2 * reach);
  pirateHand.style.transform = `translate(${phone.clientWidth * (1.05 - .48 * reachEase)}px, ${phone.clientHeight * .52}px)`;
  phone.dataset.phase = elapsed < 4000 ? 'fish-hooked' : elapsed < 6000 ? 'line-snapped' : elapsed < 7200 ? 'floor-fade' : elapsed < 9200 ? 'fish-flying' : 'fish-landed';
  if (elapsed >= 9900) phone.dataset.phase = 'pirate-hand-reach';
}
function camera(shot) {
  // 百分比位移在視窗縮放時保持構圖一致，限制邊界避免露出空白。
  const x = clamp(.5 - shot.x * shot.scale, 1 - shot.scale, 0);
  const y = clamp(.5 - shot.y * shot.scale, 1 - shot.scale, 0);
  scene.style.transform = `translate(${x * 100}%, ${y * 100}%) scale(${shot.scale})`;
}

function render(elapsed){
scene2.hidden=elapsed<scene2Start||elapsed>=scene3Start;
scene3.hidden=elapsed<scene3Start||elapsed>=scene4Start;
  if (elapsed >= scene3Start) {
    bubble.classList.remove('show');
    bubble.setAttribute('aria-hidden', 'true');
    phone.dataset.phase = 'scene3';
    return;
  }
  if (elapsed >= scene2Start) {
    bubble.classList.remove('show');
    bubble.setAttribute('aria-hidden', 'true');
    renderFish(elapsed - scene2Start);
    return;
  }
  const zoomStart = timing.birds + timing.buoy;
  let shot = shots.birds;
  let phase = 'birds';
  if (elapsed < timing.birds) {
    const t = clamp(elapsed / 4000, 0, 1);
    const ease = t * t * (3 - 2 * t);
    shot = Object.fromEntries(['x', 'y', 'scale'].map(key =>
      [key, shots.birds[key] + (shots.sky[key] - shots.birds[key]) * ease]));
  }
  if (elapsed >= timing.birds) { shot = shots.buoy; phase = 'buoy'; }
  if (elapsed < zoomStart) {
    const birds = phase === 'birds';
    const local = birds ? elapsed : elapsed - timing.birds;
    const duration = birds ? timing.birds : timing.buoy;
    const progress = clamp(local / duration, 0, 1);
    // 頭尾收回原位並減速，浮標晃動結束後可連續接上拉遠。
    const envelope = Math.sin(Math.PI * progress) ** 2;
    const wave = local / (birds ? 2400 : 1800) * Math.PI * 2;
    shot = {
      ...shot,
      x: shot.x + Math.sin(wave) * envelope * (birds ? .004 : .002),
      y: shot.y + Math.sin(wave + .7) * envelope * (birds ? .0018 : .003)
    };
  }
  if (elapsed >= zoomStart) {
    const t = clamp((elapsed - zoomStart) / timing.pullback, 0, 1);
    const ease = t * t * (3 - 2 * t);
    shot = Object.fromEntries(['x', 'y', 'scale'].map(key =>
      [key, shots.buoy[key] + (shots.person[key] - shots.buoy[key]) * ease]));
    phase = t < 1 ? 'pullback' : 'person';
  }
  camera(shot);
  const humming = elapsed >= zoomStart + timing.pullback + timing.bubbleDelay;
  bubble.classList.toggle('show', humming);
  bubble.setAttribute('aria-hidden', String(!humming));
  phone.dataset.phase = humming ? 'humming' : phase;
}
