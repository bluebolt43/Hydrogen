const nightScene = document.querySelector('#night-scene'), nightIsland = document.querySelector('#night-island'), stage4First = document.querySelector('#stage4-first');
function renderNight(ms) {
  // 直幅鋪滿並留晃動邊界，海上漂浮 2 秒後花 5 秒靠近島嶼。
  const t = clamp((ms - 2000) / 5000, 0, 1), ease = t*t*(3-2*t);
  const ratio = nightIsland.naturalWidth / nightIsland.naturalHeight;
  const w = Math.max(phone.clientWidth, phone.clientHeight * ratio), h = w / ratio;
  nightIsland.style.width = `${w}px`;
  nightIsland.style.height = `${h}px`;
  const scale = 1.06 + 1.44*ease;
  const drift = 1 - .65*ease;
  const swayX = Math.sin(ms/1150)*phone.clientWidth*.012*drift;
  const swayY = Math.sin(ms/780)*phone.clientHeight*.006*drift;
  const roll = Math.sin(ms/1400)*.45*drift;
  const cx = .63 + .12*ease, cy = .5 + .10*ease;
  nightIsland.style.transform = `translate(${phone.clientWidth/2+swayX}px,${phone.clientHeight/2+swayY}px) rotate(${roll}deg) translate(${-cx*w*scale}px,${-cy*h*scale}px) scale(${scale})`;
}
const stage4Story=document.querySelector('#stage4-story');
const scopeMaskFrame=document.querySelector('#scope-mask-frame');
const grin=document.querySelector('#stage4-grin'), scopeScene=document.querySelector('#scope-scene'), scopeImage=document.querySelector('#stage4-scope'), mapImage=document.querySelector('#stage4-map');
const mouthTop=document.querySelector('#mouth-top'),mouthBottom=document.querySelector('#mouth-bottom'),mapView=document.querySelector('#map-view'),stage4Black=document.querySelector('#stage4-black');
function stage4Camera(image, shot) {
  const ratio=image.naturalWidth/image.naturalHeight;
  const w=Math.max(phone.clientWidth,phone.clientHeight*ratio),h=w/ratio;
  image.style.width=`${w}px`;image.style.height=`${h}px`;
  const x=clamp(phone.clientWidth/2-shot.x*w*shot.scale,phone.clientWidth-w*shot.scale,0);
  const y=clamp(phone.clientHeight/2-shot.y*h*shot.scale,phone.clientHeight-h*shot.scale,0);
  image.style.transform=`translate(${x}px,${y}px) scale(${shot.scale})`;
}
function renderStage4(ms) {
  // 4-3 的黑罩隨鏡片拉近；完成後才淡入 4-4，其獨立黑罩固定於螢幕中央。
  stage4First.style.opacity=ms<13500?1:0;
  grin.style.opacity=ms>=7000&&ms<13500?clamp((ms-7000)/1200,0,1):0;
  mouthTop.hidden=mouthBottom.hidden=ms<7000||ms>=13500;
  scopeScene.style.opacity=ms>=13500?1:0;
  mapView.style.opacity=clamp((ms-21000)/1500,0,1);
  stage4Camera(mapImage,blend({x:.5,y:.5,scale:1},{x:.54,y:.65,scale:2.4},(ms-21000)/4500));
  scopeMaskFrame.style.opacity=clamp((ms-16000)/2500,0,1);
  if(ms>=13500) {
    stage4Camera(scopeImage,blend({x:.5,y:.5,scale:1},{x:.585,y:.436,scale:3.8},(ms-16000)/5000));
    scopeMaskFrame.style.width=scopeImage.style.width;
    scopeMaskFrame.style.height=scopeImage.style.height;
    scopeMaskFrame.style.transform=scopeImage.style.transform;
  }
  stage4Black.style.opacity=ms<11500?0:ms<13000?clamp((ms-11500)/1500,0,1):ms<13500?1:1-clamp((ms-13500)/1500,0,1);
  if(ms<7000){
    stage4Camera(stage4First,blend({x:.335,y:.71,scale:1.12},{x:.715,y:.40,scale:1.45},(ms-1800)/4200));
    phone.dataset.phase=ms<1800?'stage4-plea':'stage4-boss';
  } else if(ms<13500){
    stage4Camera(grin,{x:.48,y:.49,scale:1.15});
    phone.dataset.phase=ms<11500?'stage4-grin':'stage4-black';
  } else if(ms<21000){
    phone.dataset.phase='stage4-telescope';
  } else {
    phone.dataset.phase='stage4-map';
  }
}
function render(elapsed){nightScene.hidden=elapsed>=stage4FirstStart;stage4Story.hidden=elapsed<stage4FirstStart;if(elapsed>=stage4FirstStart)renderStage4(elapsed-stage4FirstStart);else{phone.dataset.phase='stage4-island';renderNight(elapsed-nightStart);}}
