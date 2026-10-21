// Standard chapter lifecycle for the existing Touhou 1 animation timelines.
const hostPhone = document.getElementById('phone');
const hostPart = document.body.dataset.storyPart;
const hostKey = `ch${hostedChapter}-${hostPart}`;
const hostDuration = Number(document.body.dataset.storyDuration);
const hostEmbedded = new URLSearchParams(location.search).has('embed');
const hostNext = document.getElementById('story-next');
const hostSkip = document.getElementById('story-skip');
const hostBegin = document.getElementById('begin');
const hostAudio = hostedChapter === 1 ? bgm : document.getElementById(`a${hostedChapter}-bgm`);
const hostMusicStart = Number(document.body.dataset.musicStart || 0);
const hostSounds = [bgm, a2Bgm, a3Bgm, a4Bgm, a5Bgm, a6Bgm, a7Bgm, a8Bgm];
let hostTimeline = [], hostTime = 0, hostPlaying = false, hostLast = 0;
let hostFrame = 0, hostNextTimer = 0, hostCompleted = false, hostSerial = 0;
let hostResume = false, hostMusicStarted = false;

function hostSeen() {
  if (window.AppProgress) return window.AppProgress.hasSeen(hostKey);
  return localStorage.getItem('pinball-touhou1-story-seen-v1:' + hostKey) === '1';
}
function hostMarkSeen() {
  if (window.AppProgress) window.AppProgress.markSeen(hostKey);
  else localStorage.setItem('pinball-touhou1-story-seen-v1:' + hostKey, '1');
}
function hostStopAudio() { hostSounds.forEach(audio => audio.pause()); }
function prepareHostChapter() {
  looping = false;
  play(); // Establish the original A1 background animation state used by seekTo.
  if (hostedChapter !== 1 || hostPart !== 'start') {
    const selector = hostedChapter === 1 ? '#end-preview' : `#a${hostedChapter}-${hostPart}`;
    document.querySelector(selector).onclick();
  }
  hostTimeline = hostedChapter === 1 && hostPart === 'start' ? animations : endAnimations;
  [...animations, ...endAnimations].forEach(animation => animation.pause());
  paused = true;
  hostStopAudio();
  hostMusicStarted = false;
  renderHostChapter(0);
}
function renderHostChapter(ms) {
  hostTime = Math.max(0, Math.min(hostDuration, Number(ms) || 0));
  hostTimeline.forEach(animation => { animation.currentTime = hostTime; });
  hostPhone.dataset.chapter = hostKey;
  hostPhone.dataset.time = String(hostTime);
  if (hostPart === 'start') {
    hostAudio.currentTime = Math.max(0, hostTime - hostMusicStart) / 1000;
  }
}
function completeHostChapter() {
  if (hostCompleted) return;
  hostCompleted = true;
  clearTimeout(hostNextTimer);
  hostNext.hidden = true;
  window.dispatchEvent(new CustomEvent('story:complete', {detail: {chapter: hostKey}}));
}
function finishHostChapter(skipped = false) {
  hostPlaying = false; paused = true;
  cancelAnimationFrame(hostFrame); hostStopAudio();
  renderHostChapter(hostDuration); hostSkip.hidden = true;
  if (!skipped) hostMarkSeen();
  if (hostPart === 'end') {
    hostNext.hidden = false;
    hostNextTimer = setTimeout(completeHostChapter, 10000);
  } else completeHostChapter();
}
function hostTick(now) {
  if (!hostPlaying) return;
  const nextTime = Math.min(hostDuration, hostTime + Math.max(0, now - hostLast));
  hostLast = now;
  // Do not seek the audio every frame; only advance the existing visual timeline.
  hostTime = nextTime;
  hostTimeline.forEach(animation => { animation.currentTime = hostTime; });
  hostPhone.dataset.time = String(hostTime);
  if (hostPart === 'start' && hostTime >= hostMusicStart && !hostMusicStarted) {
    hostMusicStarted = true;
    hostAudio.play().catch(() => {});
  }
  if (hostTime >= hostDuration) finishHostChapter();
  else hostFrame = requestAnimationFrame(hostTick);
}
async function playHostChapter(key = hostKey) {
  if (key !== hostKey) return false;
  await window.viewReady;
  const serial = ++hostSerial;
  clearTimeout(hostNextTimer); cancelAnimationFrame(hostFrame);
  hostPlaying = false; hostCompleted = false;
  hostNext.hidden = true; hostSkip.hidden = true;
  prepareHostChapter();
  // Prime delayed Start music while this call still has the user's gesture.
  if (hostPart === 'start' && !hostAudio.muted) {
    try {
      await hostAudio.play();
      if (serial !== hostSerial) return false;
      hostAudio.pause(); hostAudio.currentTime = 0;
    } catch {
      hostBegin.hidden = false;
      return false;
    }
  }
  if (serial !== hostSerial) return false;
  hostBegin.hidden = true; hostSkip.hidden = !hostSeen();
  paused = false; hostPlaying = true; hostLast = performance.now();
  hostFrame = requestAnimationFrame(hostTick);
  return true;
}
document.getElementById('start').onclick = () => playHostChapter();
document.getElementById('replay').onclick = () => playHostChapter();
hostSkip.onclick = () => { if (hostSeen()) finishHostChapter(true); };
hostNext.onclick = completeHostChapter;
if (hostEmbedded) document.getElementById('chapters').hidden = true;
window.addEventListener('pagehide', () => {
  ++hostSerial; hostPlaying = false;
  cancelAnimationFrame(hostFrame); clearTimeout(hostNextTimer); hostStopAudio();
});
window.viewAPI = {
  play: playHostChapter,
  render: renderHostChapter,
  suspend() {
    hostResume = hostPlaying; hostPlaying = false; paused = true;
    cancelAnimationFrame(hostFrame); hostStopAudio();
  },
  resume() {
    if (!hostResume) return;
    hostResume = false; hostPlaying = true; paused = false;
    hostLast = performance.now(); hostMusicStarted = false;
    hostFrame = requestAnimationFrame(hostTick);
  }
};
window.viewReady = window.viewReady.then(() => {
  prepareHostChapter();
  hostPhone.dataset.ready = 'true';
  if (new URLSearchParams(location.search).has('autoplay')) playHostChapter();
});
