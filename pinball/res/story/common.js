const phone=document.querySelector('#phone');
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
function blend(from, to, progress) {
  const t = clamp(progress, 0, 1);
  const ease = t * t * (3 - 2 * t);
  return Object.fromEntries(['x', 'y', 'scale'].map(key => [key, from[key] + (to[key] - from[key]) * ease]));
}
