window.ArcadePhysicsDefaults={
  "arcadeTableSlope": 6,
  "arcadeVerticalGravity": 3000,
  "arcadeMaxSpeed": 1300,
  "arcadeWallElasticity": 0.86,
  "arcadeContactSpeed": 20,
  "arcadeBumperSpeed": 650,
  "arcadeSlingSpeed": 600,
  "arcadeTriggerSpeed": 30,
  "arcadeFlipperSpeed": 1050,
  "arcadeFlipperSeconds": 0.045,
  "arcadeReturnSeconds": 0.09,
  "arcadeKickerSpeed": 1000
}
;
/* Shared system-menu layout format and frame drawing; classic script for file://. */
(function(root){
'use strict';
const MIN_FRAME=64;
const fixedBackground={src:'res/img/app_background.png',fit:'cover'};
const widthPresets={full:.9022,half:.4442,third:.2912};
const FRAME_HEIGHT_RATIO=.2452;
function applyHeightPreset(o,canvasHeight){if(o.heightRatio===undefined)return;number(o.heightRatio,.01,1,'框高比例');o.height=Math.max(MIN_FRAME,Math.round(canvasHeight*o.heightRatio));o.edgeWidth=Math.min(o.edgeWidth,edgeLimit(o));}
function applyWidthPreset(o,canvasWidth){
 if(o.widthPreset===undefined)return;
 if(!Object.hasOwn(widthPresets,o.widthPreset))throw Error('框寬預設不正確');
 o.width=Math.max(MIN_FRAME,Math.round(canvasWidth*widthPresets[o.widthPreset]));
 o.edgeWidth=Math.min(o.edgeWidth,edgeLimit(o));
}
const defaults={corner:'res/img/system-frame-corner.svg',edge:'res/img/system-frame-edge.svg'};
const buttonDefaults={label:'MAINKAN',src:'res/img/system-button.png',widthRatio:.42,minCanvasWidthRatio:.22,heightRatio:.0538,crop:[189,109,1523,574]};
const lockDefaults={src:'res/img/system-lock.png',widthRatio:.17472,heightRatio:.080916,yOffset:0,crop:[159,159,1117,783]};
// These pixel crops are authored against HD originals. Keep source coordinates
// stable in saved projects while runtime textures can be rebuilt at any density.
const cropReferenceSize={'res/img/system-button.png':[1902,827],'res/img/system-lock.png':[1435,1096]};
function drawPixelCrop(ctx,image,src,crop,x,y,w,h){
 const reference=cropReferenceSize[src],sx=reference?image.naturalWidth/reference[0]:1,sy=reference?image.naturalHeight/reference[1]:1;
 ctx.drawImage(image,crop[0]*sx,crop[1]*sy,crop[2]*sx,crop[3]*sy,x,y,w,h);
}
function visibility(o){return {title:false,button:o.content!=='lock',lock:o.content==='lock',marker:false,clear:false,...o.visible};}
function lockRect(o,canvasWidth,canvasHeight=640){
 const lock=o.lockImage||lockDefaults;
 const width=canvasWidth*(lock.widthRatio??lockDefaults.widthRatio),height=canvasHeight*(lock.heightRatio??lockDefaults.heightRatio);
 return {x:o.x+(o.width-width)/2,y:o.y+o.height-height+(lock.yOffset??0),width,height};
}
function playButtonRect(o,canvasHeight=640,canvasWidth=360){
 const button=o.playButton||buttonDefaults;
 const inset=Math.min(o.edgeWidth,edgeLimit(o))*2;
 // End caps and the centre rivets stay at a fixed scale; only the two flat strips stretch.
 const centreRatio=88/574,minAspect=1+centreRatio;
 const height=Math.min(Math.round(canvasHeight*(button.heightRatio??buttonDefaults.heightRatio)),Math.max(0,o.height-inset*2));
 const width=Math.max(o.width*button.widthRatio,canvasWidth*(button.minCanvasWidthRatio??buttonDefaults.minCanvasWidthRatio),height*minAspect);
 return {x:o.x+(o.width-width)/2,y:o.y+o.height-inset-height,width,height};
}
function drawPlayTexture(ctx,image,button,r){
 const [sx,sy,sw,sh]=button.crop,scale=r.height/sh;
 const cap=sh/2,centre=sh*88/574,strip=(sw-cap*2-centre)/2;
 const capWidth=cap*scale,centreWidth=centre*scale,stripWidth=Math.max(0,(r.width-capWidth*2-centreWidth)/2);
 let sourceX=sx,targetX=r.x;
 for(const [sourceWidth,targetWidth] of [[cap,capWidth],[strip,stripWidth],[centre,centreWidth],[strip,stripWidth],[cap,capWidth]]){
  if(sourceWidth>0&&targetWidth>0)drawPixelCrop(ctx,image,button.src,[sourceX,sy,sourceWidth,sh],targetX,r.y,targetWidth,r.height);
  sourceX+=sourceWidth;targetX+=targetWidth;
 }
}
function edgeLimit(o){return Math.min(64,Math.floor(Math.min(o.width,o.height)/8));}
function number(value,min,max,label){if(!Number.isFinite(value)||value<min||value>max)throw Error(label+'超出範圍');return value;}
function asset(src){if(typeof src!=='string'||!/^res\/img\/(?:(?:pirate|steampunk)\/)?[^/\\?#]+\.(png|webp|jpg|jpeg|svg)$/i.test(src)||src.includes('..'))throw Error('素材路徑須為 res/img/ 或 res/img/pirate/ 下的檔案');return src;}
function validate(input){
 const d=JSON.parse(JSON.stringify(input));
 if(d.format!=='pinball-system-layout'||d.version!==1||!d.canvas||!Array.isArray(d.objects)||d.objects.length>200)throw Error('不是有效的系統布局 JSON');
 if(d.canvas.width!==360||d.canvas.height!==640)throw Error('畫布固定為 360 × 640');
 d.background={...fixedBackground};
 const ids=new Set();
 for(const o of d.objects){
  if(!['frame','image'].includes(o.type)||typeof o.id!=='string'||!o.id||ids.has(o.id))throw Error('邊框 ID 缺少或重複');ids.add(o.id);
  if(typeof o.name!=='string')throw Error('邊框名稱不正確');
  number(o.x,-8192,8192,'X');number(o.y,-8192,8192,'Y');
  if(o.type==='image'){asset(o.src);number(o.width,8,8192,'圖片寬度');number(o.height,8,8192,'圖片高度');continue;}
  applyHeightPreset(o,d.canvas.height);
  applyWidthPreset(o,d.canvas.width);
  number(o.width,MIN_FRAME,8192,'邊框寬度（至少 64）');number(o.height,MIN_FRAME,8192,'邊框高度（至少 64）');
  number(o.edgeWidth,1,64,'邊寬');o.edgeWidth=Math.min(o.edgeWidth,edgeLimit(o));delete o.cornerSize;delete o.opacity;
  if(!['stretch','repeat'].includes(o.edgeMode))throw Error('邊的模式不正確');
  asset(o.corner);asset(o.edge);
  for(const [key,layer] of [['background',o.background],['foreground',o.foreground],['lockMask',o.lockMask]]){if(!layer)continue;asset(layer.src);if(key!=='background')delete layer.crop;const c=layer.crop;
   if(key==='background'&&(!Array.isArray(c)||c.length!==4||!c.every(Number.isFinite)||c[0]<0||c[1]<0||c[2]<=0||c[3]<=0||c[0]+c[2]>1.000001||c[1]+c[3]>1.000001))throw Error('圖片裁切範圍不正確');
   for(const key of ['x','y'])if(layer[key]!==undefined)number(layer[key],-8192,8192,'圖層偏移');if(layer.scale!==undefined)number(layer.scale,.05,20,'图層縮放');
  }
  o.content=o.content??'button';if(!['button','lock'].includes(o.content))throw Error('框內容不正確');
  o.visible=visibility(o);for(const key of ['title','button','lock','marker','clear'])if(typeof o.visible[key]!=='boolean')throw Error('顯示設定不正確');
  if(o.showMarkerText!==undefined&&typeof o.showMarkerText!=='boolean')throw Error('圈內文字顯示設定不正確');
  if(o.markerText!==undefined&&(typeof o.markerText!=='string'||o.markerText.length>20))throw Error('標記文字最多 20 字');
  if(o.title){if(o.title.arc!==undefined)number(o.title.arc,-90,90,'標題文字弧度');if(o.title.textY!==undefined)number(o.title.textY,-8192,8192,'標題文字 Y');if(o.title.src!==undefined)asset(o.title.src);if(o.title.showText!==undefined&&typeof o.title.showText!=='boolean')throw Error('標題文字顯示設定不正確');if(o.title.text!==undefined&&(typeof o.title.text!=='string'||o.title.text.length>80))throw Error('標題文字最多 80 字');if(o.title.width!==undefined)number(o.title.width,8,8192,'標題寬度');if(o.title.yOffset!==undefined)number(o.title.yOffset,-8192,8192,'標題 Y');}
  o.lockImage=o.lockImage||JSON.parse(JSON.stringify(lockDefaults));asset(o.lockImage.src);
  if(o.lockImage.label!==undefined&&(typeof o.lockImage.label!=='string'||o.lockImage.label.length>80))throw Error('鎖牌文字最多 80 字');
  o.lockImage.widthRatio=o.lockImage.widthRatio??lockDefaults.widthRatio;o.lockImage.heightRatio=o.lockImage.heightRatio??lockDefaults.heightRatio;
  number(o.lockImage.widthRatio,.001,1,'鎖寬比例');number(o.lockImage.heightRatio,.001,1,'鎖高比例');
  o.lockImage.yOffset=o.lockImage.yOffset??0;number(o.lockImage.yOffset,-8192,8192,'鎖牌相對框底 Y');
  const lockCrop=o.lockImage.crop;
  if(!Array.isArray(lockCrop)||lockCrop.length!==4||!lockCrop.every(Number.isFinite)||lockCrop[0]<0||lockCrop[1]<0||lockCrop[2]<=0||lockCrop[3]<=0)throw Error('鎖頭裁切範圍不正確');
  o.playButton=o.playButton||JSON.parse(JSON.stringify(buttonDefaults));
  o.playButton.heightRatio=o.playButton.heightRatio??buttonDefaults.heightRatio;number(o.playButton.heightRatio,.001,1,'按鈕高度比例');delete o.playButton.height;
  o.playButton.minCanvasWidthRatio=o.playButton.minCanvasWidthRatio??buttonDefaults.minCanvasWidthRatio;number(o.playButton.minCanvasWidthRatio,.01,1,'按鈕最小寬度比例');
  o.playButton.label=o.playButton.label??buttonDefaults.label;if(typeof o.playButton.label!=='string'||o.playButton.label.length>80)throw Error('按鈕文字不正確');
  asset(o.playButton.src);number(o.playButton.widthRatio,.1,1,'按鈕寬度比例');
  const crop=o.playButton.crop;
  if(!Array.isArray(crop)||crop.length!==4||!crop.every(Number.isFinite)||crop[0]<0||crop[1]<0||crop[2]<=crop[3]*(1+88/574)||crop[3]<=0)throw Error('按鈕裁切範圍不正確');
 }
 return d;
}
function titleText(ctx,text,cx,cy,size,maxWidth,arc=0){
 ctx.save();ctx.font='800 '+size+'px Arial, sans-serif';
 // Keep grapheme clusters intact (accents and combined characters).
 const chars=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(text)].map(s=>s.segment):Array.from(text);
 const curved=arc!==0&&chars.length>1;
 const measure=()=>curved?chars.reduce((sum,c)=>sum+ctx.measureText(c).width,0):ctx.measureText(text).width;
 const measured=measure();if(measured>maxWidth){size*=maxWidth/measured;ctx.font='800 '+size+'px Arial, sans-serif';}
 const m=ctx.measureText(text),baseline=cy+(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2;
 ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle='#000000';
 if(!curved){ctx.fillText(text,cx,baseline);ctx.restore();return;}
 const widths=chars.map(c=>ctx.measureText(c).width),total=widths.reduce((a,b)=>a+b,0);
 if(total<=0){ctx.restore();return;}
 const angle=arc*Math.PI/180,radius=total/angle;let cursor=-total/2;
 for(let i=0;i<chars.length;i++){
  const theta=(cursor+widths[i]/2)/radius;
  ctx.save();ctx.translate(cx+radius*Math.sin(theta),baseline+radius*(1-Math.cos(theta)));ctx.rotate(theta);ctx.fillText(chars[i],0,0);ctx.restore();cursor+=widths[i];
 }
 ctx.restore();
}
function frame(ctx,o,getImage,canvasHeight=640,canvasWidth=360){
 const corner=getImage(o.corner),edge=getImage(o.edge),w=o.width,h=o.height,t=Math.min(o.edgeWidth,edgeLimit(o)),c=t*4;
 const lockFade=visibility(o).lock?Math.max(0,Math.min(1,o.lockFadeProgress??0)):0;
 const darkBoss=visibility(o).lock||o.bossDimmed===true;
 const bossReveal=darkBoss?Math.max(0,Math.min(1,o.bossRevealProgress??0)):0;
 for(const [key,layer] of [['background',o.background],['foreground',o.foreground],['lockMask',visibility(o).lock||o.action==='endless'?o.lockMask:null]]){
  if(!layer)continue;const img=getImage(layer.src);if(!img)continue;
  const [x,y,cw,ch]=key==='background'?layer.crop:[0,0,1,1];let sw=cw*img.naturalWidth,sh=ch*img.naturalHeight,sx=x*img.naturalWidth,sy=y*img.naturalHeight;
  const ratio=w/h;if(key==='background'){if(sw/sh>ratio){const n=sh*ratio;sx+=(sw-n)/2;sw=n;}else{const n=sw/ratio;sy+=(sh-n)/2;sh=n;}}
  const scale=layer.scale??1,fit=key==='background'?1:Math.min(w/sw,h/sh),dw=(key==='background'?w:sw*fit)*scale,dh=(key==='background'?h:sh*fit)*scale;
  ctx.save();ctx.beginPath();ctx.roundRect(o.x+1,o.y+1,w-2,h-2,Math.min(c*.75,w/2-1,h/2-1));ctx.clip();
  if(key==='foreground'&&o.bossSway){
   const px=o.x+(w-dw)/2+(layer.x??0)+dw/2,py=o.y+(h-dh)/2+(layer.y??0)+dh*.81;
   ctx.translate(px+o.bossSway*1.26,py);ctx.rotate(o.bossSway*1.1*Math.PI/180);ctx.translate(-px,-py);
  }
  if(key==='foreground'&&darkBoss){
   ctx.filter='brightness(0)';ctx.globalAlpha=1-bossReveal;
   ctx.drawImage(img,sx,sy,sw,sh,o.x+(w-dw)/2+(layer.x??0),o.y+(h-dh)/2+(layer.y??0),dw,dh);
   ctx.filter='none';ctx.globalAlpha=bossReveal;
  }else if(key==='lockMask')ctx.globalAlpha=Math.max(0,Math.min(1,o.maskAlpha??1))*(1-lockFade);
  if(key!=='foreground'||!darkBoss||bossReveal>0)ctx.drawImage(img,sx,sy,sw,sh,o.x+(w-dw)/2+(layer.x??0),o.y+(h-dh)/2+(layer.y??0),dw,dh);
  ctx.restore();
 }
 ctx.save();ctx.translate(o.x,o.y);
 function drawEdge(x,y,length,angle){
  if(!edge||length<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(angle);
  if(o.edgeMode==='stretch')ctx.drawImage(edge,0,0,length,t);
  else{const tile=edge.naturalWidth*t/edge.naturalHeight;for(let x=0;x<length;x+=tile){const n=Math.min(tile,length-x);ctx.drawImage(edge,0,0,edge.naturalWidth*n/tile,edge.naturalHeight,x,0,n,t);}}
  ctx.restore();
 }
 drawEdge(c,0,w-2*c,0);drawEdge(w,c,h-2*c,Math.PI/2);
 drawEdge(w-c,h,w-2*c,Math.PI);drawEdge(0,h-c,h-2*c,-Math.PI/2);
 if(corner)for(const [x,y,a] of [[0,0,0],[w,0,Math.PI/2],[w,h,Math.PI],[0,h,-Math.PI/2]]){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.drawImage(corner,0,0,c,c);ctx.restore();}
 ctx.restore();
 const visible=visibility(o);
 const markerSize=canvasWidth*.07;
 for(const [key,src,x] of [['marker','card-marker-empty.png',o.x],['clear','card-marker-complete.png',o.x+o.width-markerSize]]){
  if(!visible[key])continue;const image=getImage('res/img/'+src);if(!image)continue;
  const y=o.y;ctx.drawImage(image,x,y,markerSize,markerSize);
  if(key==='marker'&&o.showMarkerText!==false){
   const text=o.markerText??'1';ctx.save();let size=markerSize*.52;ctx.font='800 '+size+'px Arial, sans-serif';
   const measured=ctx.measureText(text).width;if(measured>markerSize*.65){size*=markerSize*.65/measured;ctx.font='800 '+size+'px Arial, sans-serif';}
   const m=ctx.measureText(text);ctx.textAlign='center';ctx.fillStyle='#ffffff';ctx.strokeStyle='#392007';ctx.lineWidth=Math.max(1,markerSize*.055);ctx.lineJoin='round';
   const baseline=y+markerSize/2+(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2;
   ctx.strokeText(text,x+markerSize/2,baseline);ctx.fillText(text,x+markerSize/2,baseline);ctx.restore();
  }
 }
 if(visible.title&&!(o.action==='endless'&&visible.lock)){const image=getImage(o.title?.src||'res/img/card-title.png');if(image){const width=o.title?.width??o.width*.8,height=width*image.naturalHeight/image.naturalWidth;const x=o.x+(o.width-width)/2,y=o.y+(o.title?.yOffset??-height/2);ctx.drawImage(image,x,y,width,height);
   const text=o.title?.text??'';if(text&&o.title?.showText!==false)titleText(ctx,text,x+width/2,y+height*.43+(o.title?.textY??0),height*.48,width*.78,o.title?.arc??0);
}}
 if(visible.lock){
  const lock=o.lockImage||lockDefaults,image=getImage(lock.src),r=lockRect(o,canvasWidth,canvasHeight);
  if(image&&r.width>0&&r.height>0){
   ctx.save();ctx.globalAlpha=1-lockFade;ctx.translate(o.lockShake??0,0);
   drawPixelCrop(ctx,image,lock.src,lock.crop,r.x,r.y,r.width,r.height);
   ctx.font='800 '+r.height*.19+'px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillStyle='#fff8d9';ctx.strokeStyle='#111a23';ctx.lineWidth=Math.max(.5,r.height*.025);ctx.lineJoin='round';
   const label=lock.label??'Locked',measured=ctx.measureText(label).width;if(measured>r.width*.8)ctx.font='800 '+(r.height*.19*r.width*.8/measured)+'px Arial, sans-serif';
   ctx.strokeText(label,r.x+r.width/2,r.y+r.height*.82);
   ctx.fillText(label,r.x+r.width/2,r.y+r.height*.82);ctx.restore();
  }
 }
 if(!visible.button)return;
 const button=o.playButton||buttonDefaults,image=getImage(button.src),r=playButtonRect(o,canvasHeight,canvasWidth);
 if(image&&r.width>0&&r.height>0){
  drawPlayTexture(ctx,image,button,r);
  const label=button.label??buttonDefaults.label,cx=r.x+r.width/2,cy=r.y+r.height/2;
  ctx.save();
  let fontSize=r.height*.36;ctx.font='800 '+fontSize+'px Arial, sans-serif';
  const available=Math.max(1,r.width-r.height*.6),measured=ctx.measureText(label).width;
  if(measured>available){fontSize*=available/measured;ctx.font='800 '+fontSize+'px Arial, sans-serif';}
  const metrics=ctx.measureText(label),baseline=cy+(metrics.actualBoundingBoxAscent-metrics.actualBoundingBoxDescent)/2;
  ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle='#fff8d9';ctx.strokeStyle='#155226';ctx.lineWidth=Math.max(.5,r.height*.017);ctx.lineJoin='round';
  ctx.strokeText(label,cx,baseline);ctx.fillText(label,cx,baseline);ctx.restore();
 }
}
function draw(ctx,d,getImage){
 if(d.background){const b=d.background,img=getImage(b.src);if(img){const ratio=(b.fit==='cover'?Math.max:Math.min)(d.canvas.width/img.naturalWidth,d.canvas.height/img.naturalHeight);const w=img.naturalWidth*ratio,h=img.naturalHeight*ratio;ctx.save();ctx.drawImage(img,(d.canvas.width-w)/2,(d.canvas.height-h)/2,w,h);ctx.restore();}}
 for(const o of d.objects){
  if(o.type==='image'){const img=getImage(o.src);if(img)ctx.drawImage(img,o.x,o.y,o.width,o.height);}
  else frame(ctx,o,getImage,d.canvas.height,d.canvas.width);
 }
}
const api={titleText,visibility,MIN_FRAME,FRAME_HEIGHT_RATIO,applyHeightPreset,widthPresets,applyWidthPreset,edgeLimit,defaults,buttonDefaults,lockDefaults,fixedBackground,lockRect,playButtonRect,validate,draw,frame};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SystemLayout=api;
})(typeof window!=='undefined'?window:globalThis);

/* Shared game-over dialog for the game and standalone preview. */
(()=>{
function screenOverlay(doc){
 const mask=doc.createElement('div');
 mask.setAttribute('role','alert');mask.className='pirate-warning';
 mask.style.cssText='position:fixed;margin:0;padding:0;box-sizing:border-box;z-index:2147483647;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;pointer-events:auto';
 const win=doc.defaultView,viewport=win.visualViewport;
 const position=()=>{mask.style.left=(viewport?.offsetLeft||0)+'px';mask.style.top=(viewport?.offsetTop||0)+'px';mask.style.width=(viewport?.width||win.innerWidth)+'px';mask.style.height=(viewport?.height||win.innerHeight)+'px';};
 position();win.addEventListener('resize',position);viewport?.addEventListener('resize',position);viewport?.addEventListener('scroll',position);
 const cleanup=()=>{win.removeEventListener('resize',position);viewport?.removeEventListener('resize',position);viewport?.removeEventListener('scroll',position);mask.remove();};
 return {mask,cleanup};
}
function showGameOver(doc,score,rows,currentId,onClose,buttonLabel='重新開始'){
 const {mask,cleanup}=screenOverlay(doc);mask.className='pirate-game-over';mask.setAttribute('role','dialog');mask.setAttribute('aria-modal','true');mask.setAttribute('aria-label','Game Over 分數排行榜');

 mask.innerHTML=`<style>
 .pirate-game-over *{box-sizing:border-box}.pirate-game-over .result{position:relative;width:min(92vw,420px);max-height:94%;overflow:hidden;display:flex;flex-direction:column;padding:0;color:#eee4d0;background:radial-gradient(ellipse at 50% 0,#25404c,#101e2a 55%,#0c1721);font-family:system-ui,sans-serif;text-align:center;border-radius:18px;box-shadow:0 24px 80px #000b}
 .pirate-game-over .total{display:block;margin:16px 0 20px;color:#ffe09a;font-size:clamp(30px,8vw,46px);font-weight:800;font-variant-numeric:tabular-nums;line-height:1.25;overflow-wrap:anywhere}
 .pirate-game-over .content{min-height:0;overflow:auto;padding:30px 25px 25px;scrollbar-width:thin;scrollbar-color:#89794f #101e2a}.pirate-game-over .trim{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}
 .pirate-game-over h1{font-size:clamp(25px,7vw,34px);font-weight:850;letter-spacing:.09em;margin:0;color:#f3dfaf}.pirate-game-over .rank-heading{display:flex;align-items:baseline;justify-content:space-between;margin:20px 0 10px}.pirate-game-over h2{margin:0;font-size:12px;letter-spacing:.13em;color:#e5d2a3}.pirate-game-over .rank-heading span{font-size:10px;color:#8399a3}.pirate-game-over ol{list-style:none;padding:0;margin:0;display:grid;gap:5px}.pirate-game-over li{display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:8px;min-height:37px;padding:7px 10px;border:1px solid transparent;border-radius:5px;background:#ffffff04;font-size:14px;font-variant-numeric:tabular-nums}.pirate-game-over .place{color:#839ba9;font-size:12px;text-align:left}.pirate-game-over li:nth-child(1) .place{color:#f0cb70}.pirate-game-over li:nth-child(2) .place{color:#cad9e2}.pirate-game-over li:nth-child(3) .place{color:#d2a07a}.pirate-game-over .row-score{font-size:16px;font-weight:650;text-align:right;overflow-wrap:anywhere}.pirate-game-over .date{font-size:11px;color:#91a5af;text-align:right;white-space:nowrap}.pirate-game-over li.current{border-color:#bc9b5077;background:#d9af4915;animation:game-over-current-frame 1.8s ease-in-out infinite}.pirate-game-over li.current .row-score{color:#ffe5a5}.pirate-game-over .empty{font-size:13px;color:#91a5af;padding:16px}.pirate-game-over button{display:block;width:100%;margin:23px 0 0;padding:12px 16px;border:1px solid #c5a464;border-radius:5px;background:#c8a05a;color:#15232a;font:750 14px system-ui;cursor:pointer;letter-spacing:.04em}.pirate-game-over button:hover{background:#e0bc78}.pirate-game-over button:active{transform:translateY(1px)}.pirate-game-over button:focus-visible{outline:2px solid #d2f5ff;outline-offset:4px}
 @keyframes game-over-current-frame{0%,100%{border-color:#bc9b5055;box-shadow:inset 0 0 0 transparent}50%{border-color:#ffe09a;box-shadow:inset 0 0 8px #e7bd492b}}@media(prefers-reduced-motion:reduce){.pirate-game-over li.current{animation:none;border-color:#ffe09a}}
 @media(max-height:600px){.pirate-game-over .content{padding:20px}.pirate-game-over .rank-heading{margin-top:12px}.pirate-game-over li{min-height:30px;padding:4px 8px}.pirate-game-over button{margin-top:13px}}
 </style><section class="result"><canvas class="trim" aria-hidden="true"></canvas><div class="content">
 <h1>GAME OVER</h1><strong class="total" data-score aria-label="本局分數"></strong><div class="rank-heading"><h2>HIGH SCORES</h2></div><ol data-ranks></ol><button></button></div></section>`;
 const format=n=>Number(n).toLocaleString('en-US');
 const formatDate=endedAt=>{const date=new Date(endedAt);if(!endedAt||Number.isNaN(date.getTime()))return '—';return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('/');};
 mask.querySelector('[data-score]').textContent=format(score);
 mask.querySelector('button').textContent=buttonLabel;
 [...rows].sort((a,b)=>b.score-a.score).forEach((entry,i)=>{
  const row=doc.createElement('li');if(entry.id===currentId){row.className='current';row.setAttribute('aria-current','true');}
  const place=doc.createElement('span');place.className='place';place.textContent=String(i+1).padStart(2,'0');
  const date=doc.createElement('time');date.className='date';date.textContent=formatDate(entry.endedAt);if(date.textContent!=='—')date.dateTime=entry.endedAt;date.setAttribute('aria-label','遊玩結束日期 '+date.textContent);
  const value=doc.createElement('span');value.className='row-score';value.textContent=format(entry.score);row.append(place,value,date);mask.querySelector('[data-ranks]').append(row);
 });
 if(!rows.length){const empty=doc.createElement('li');empty.className='empty';empty.textContent='尚無排行紀錄';mask.querySelector('[data-ranks]').append(empty);}
 const win=doc.defaultView,canvas=mask.querySelector('.trim'),panel=mask.querySelector('.result'),images=new Map();
 let closed=false;
 function drawFrame(){
  if(closed)return;const {width,height}=panel.getBoundingClientRect();if(!width||!height)return;
  const ratio=win.devicePixelRatio||1;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
  const ctx=canvas.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);
  win.SystemLayout.frame(ctx,{x:0,y:0,width,height,edgeWidth:6,edgeMode:'stretch',...win.SystemLayout.defaults,visible:{title:false,button:false,lock:false,marker:false,clear:false}},src=>{
   if(!images.has(src)){const image=new win.Image();images.set(src,image);image.onload=drawFrame;image.src=new URL(src,doc.baseURI).href;}
   const image=images.get(src);return image.complete&&image.naturalWidth?image:null;
  });
 }
 const observer=new win.ResizeObserver(drawFrame);
 const dispose=()=>{observer.disconnect();for(const image of images.values())image.onload=null;cleanup();};
 const close=()=>{if(closed)return;closed=true;dispose();onClose();};
 mask.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(e.target.closest('button'))close();});
 mask.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Tab'){e.preventDefault();mask.querySelector('button').focus();}});
 doc.body.append(mask);observer.observe(panel);drawFrame();mask.querySelector('button').focus();return {cancel(){closed=true;dispose();}};
}
window.GameOverDialog={show:showGameOver};
})();

/* Shared sound player. HTMLAudio keeps direct file:// playtests supported. */
(function(root){
'use strict';
class SoundBank {
 constructor(clips,{AudioClass=root.Audio,now=()=>performance.now()}={}){
  this.enabled=true;this.paused=false;this.unlocked=false;this.now=now;this.clips=new Map();
  for(const [name,clip] of Object.entries(clips)){
   const voices=Array.from({length:clip.voices||3},()=>{const audio=new AudioClass(clip.src);audio.preload='auto';audio.volume=clip.volume??1;return {audio,token:0};});
   this.clips.set(name,{...clip,voices,last:-Infinity,next:0});
  }
 }
 unlock(){
  if(this.unlocked)return;this.unlocked=true;
  // Warm the actual reusable elements during the input gesture (mobile audio).
  for(const clip of this.clips.values())for(const voice of clip.voices){
   const token=++voice.token;voice.audio.volume=0;
   Promise.resolve(voice.audio.play()).then(()=>{
    if(voice.token!==token)return;voice.audio.pause();voice.audio.currentTime=0;voice.audio.volume=clip.volume??1;
   }).catch(()=>{if(voice.token===token)voice.audio.volume=clip.volume??1;});
  }
 }
 play(name){
  const clip=this.clips.get(name),time=this.now();
  if(!clip||!this.enabled||this.paused||!this.unlocked||time-clip.last<(clip.interval??0))return false;
  clip.last=time;
  const voice=clip.voices.find(v=>v.audio.paused||v.audio.ended)||clip.voices[clip.next++%clip.voices.length];
  voice.token++;voice.audio.pause();voice.audio.currentTime=0;voice.audio.volume=clip.volume??1;
  Promise.resolve(voice.audio.play()).catch(()=>{});return true;
 }
 stop(){for(const clip of this.clips.values()){clip.last=-Infinity;for(const voice of clip.voices){voice.token++;voice.audio.pause();voice.audio.currentTime=0;}}}
 setEnabled(enabled){this.enabled=!!enabled;if(!this.enabled)this.stop();}
 setPaused(paused){if(this.paused===!!paused)return;this.paused=!!paused;if(this.paused)this.stop();}
}
if(typeof module!=='undefined'&&module.exports)module.exports=SoundBank;else root.PinballSound=SoundBank;
})(typeof window!=='undefined'?window:globalThis);

/* Shared rail outlines: connected segments use exactly the same two edge joints. */
(function(root){
'use strict';
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],add=(a,b)=>[a[0]+b[0],a[1]+b[1]],mul=(a,k)=>a.map(v=>v*k),length=a=>Math.hypot(...a),unit=a=>mul(a,1/(length(a)||1)),dot=(a,b)=>a[0]*b[0]+a[1]*b[1],cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
function editorTrack(s){
 const n=s.type==='arc'?Math.max(8,Math.ceil((Math.hypot(s.qx-s.x1,s.qy-s.y1)+Math.hypot(s.x2-s.qx,s.y2-s.qy))/1.5)):1;
 const points=Array.from({length:n+1},(_,i)=>{const t=i/n,u=1-t;return s.type==='arc'?[u*u*s.x1+2*u*t*s.qx+t*t*s.x2,u*u*s.y1+2*u*t*s.qy+t*t*s.y2]:[s.x1+(s.x2-s.x1)*t,s.y1+(s.y2-s.y1)*t]});
 return {id:s.id,points,width:s.trackWidth,railMaterial:s.railMaterial,layer:s.layer||'lower',showAboveArt:s.showAboveArt===true};
}
function outlines(tracks){
 const result=new Map();
 for(const track of tracks){
  const points=[track.points[0]];
  for(let i=1;i<track.points.length;i++){const a=track.points[i-1],delta=sub(track.points[i],a),n=Math.max(1,Math.ceil(length(delta)/2));for(let j=1;j<=n;j++)points.push(add(a,mul(delta,j/n)));}
  const distances=[0];for(let i=1;i<points.length;i++)distances.push(distances.at(-1)+length(sub(points[i],points[i-1])));
  const normals=points.map((p,i)=>{const d=unit(sub(points[Math.min(points.length-1,i+1)],points[Math.max(0,i-1)]));return [-d[1],d[0]];});
  result.set(track.id,{...track,points,distances,entry:unit(sub(points[1],points[0])),exit:unit(sub(points.at(-1),points.at(-2))),rails:[-1,1].map(sign=>points.map((p,i)=>add(p,mul(normals[i],sign*track.width/2)))),startJoint:null,endJoint:null});
 }
 for(const a of result.values()){
  const b=[...result.values()].filter(b=>b!==a&&!b.startJoint&&length(sub(a.points.at(-1),b.points[0]))<=1&&dot(a.exit,b.entry)>=-1e-6).sort((b,c)=>dot(a.exit,c.entry)-dot(a.exit,b.entry)||b.id.localeCompare(c.id))[0];
  if(!b)continue;
  const center=mul(add(a.points.at(-1),b.points[0]),.5),na=[-a.exit[1],a.exit[0]],nb=[-b.entry[1],b.entry[0]],normal=unit(add(na,nb));
  const joint=[-1,1].map(sign=>{
   const pa=add(a.points.at(-1),mul(na,sign*a.width/2)),pb=add(b.points[0],mul(nb,sign*b.width/2)),denom=cross(a.exit,b.entry);
   if(Math.abs(denom)>1e-6){const q=add(pa,mul(a.exit,cross(sub(pb,pa),b.entry)/denom));if(length(sub(q,center))<=Math.max(a.width,b.width))return q;}
   return add(center,mul(normal,sign*(a.width+b.width)/4/Math.max(.5,dot(normal,na))));
  });
  a.endJoint=joint;b.startJoint=joint;
 }
 for(const track of result.values()){
  const total=track.distances.at(-1),blend=Math.min(total/2,Math.max(track.width,8));
  for(const [end,joint] of [[false,track.startJoint],[true,track.endJoint]])if(joint){
   for(let side=0;side<2;side++){const rail=track.rails[side],delta=sub(joint[side],end?rail.at(-1):rail[0]);
    for(let i=0;i<rail.length;i++){const distance=end?total-track.distances[i]:track.distances[i],weight=Math.max(0,1-distance/(blend||1));rail[i]=add(rail[i],mul(delta,weight));}
    rail[end?rail.length-1:0]=[...joint[side]];
   }
  }
 }
 return result;
}
function drawRails(ctx,tracks,plane){
 for(const track of tracks.values()){
  if(!track.showAboveArt)continue;
  if((track.layer==='tavern'?'upper':track.layer||'lower')!==plane)continue;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  for(const rail of track.rails){ctx.beginPath();ctx.moveTo(...rail[0]);for(const p of rail.slice(1))ctx.lineTo(...p);ctx.strokeStyle=track.railMaterial==='gold'?'#705126':'#354653';ctx.lineWidth=2.6;ctx.stroke();ctx.strokeStyle=track.railMaterial==='gold'?'#ddbc70':'#bdd9e6';ctx.lineWidth=1.2;ctx.stroke();}
  ctx.restore();
 }
}
const api={editorTrack,outlines,drawRails};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GuidedTrackGeometry=api;
})(globalThis);

/* Adapted from SpaceCadetPinball (MIT).
 * Copyright (c) 2020-2021 Andrey Muzychenko.
 * See third_party/space-cadet/NOTICE.md.
 */
(function(root){
'use strict';
const FAR=1e9,SCALE=21;
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],mul=(a,k)=>[a[0]*k,a[1]*k];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1],mag=a=>Math.hypot(...a),unit=a=>mul(a,1/(mag(a)||1));
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0],world=p=>[-p[0]/SCALE,p[1]/SCALE],layout=p=>[-p[0]*SCALE,p[1]*SCALE];
function line(a,b){const d=unit(sub(b,a));if(Math.abs(d[0])<1e-9)d[0]=0;const axis=d[0]===0?1:0;return {d,n:[d[1],-d[0]],c:-d[1]*a[0]+d[0]*a[1],lo:Math.min(a[axis],b[axis]),hi:Math.max(a[axis],b[axis]),axis};}
function rayLine(ray,l){const divisor=dot(l.n,ray.d);if(divisor>=0)return FAR;const t=-(dot(ray.p,l.n)+l.c)/divisor;if(t< -ray.min||t>ray.max)return FAR;const p=add(ray.p,mul(ray.d,t));if(p[l.axis]<l.lo||p[l.axis]>l.hi)return FAR;l.hit=p;return t;}
function rayCircle(ray,c,r){const delta=sub(c,ray.p),along=dot(delta,ray.d);if(along<0)return FAR;const d2=dot(delta,delta),det=r*r-d2+along*along;if(d2<r*r)return along-Math.sqrt(det);if(det<0)return FAR;const t=along-Math.sqrt(det);return t<0||t>ray.max?FAR:t;}
class SpaceCadetFlipper{
 constructor(f,config){
  this.f=f;this.origin=world(f.pivot);this.tip=world(f.tip);this.raised=world(f.raised);
  const a=unit(sub(this.tip,this.origin)),b=unit(sub(this.raised,this.origin));
  this.angleMax=Math.acos(Math.max(-1,Math.min(1,dot(a,b))))*(cross(a,b)<0?-1:1);
  this.flag=0;this.angle1=0;this.angle2=0;this.inputTime=0;this.stopTime=0;this.angleMult=0;this.edgeCollision=false;this.pressed=false;
  this.configure(config);
 }
 configure(c){
  this.upSeconds=c.flipperSeconds;this.downSeconds=c.flipperReturnSeconds;this.elasticity=c.flipperElasticity;this.smoothness=c.flipperSmoothness;this.collisionMult=c.flipperBoostScale;
  this.baseRadius=(this.f.radii[0]+c.ballRadius)/SCALE;this.tipRadius=(this.f.radii[1]+c.ballRadius)/SCALE;
  this.distanceDiv=mag(sub(this.tip,this.origin))+this.tipRadius;
  this.timeAdvance=Math.min(this.upSeconds,this.downSeconds)/(2*mag(sub(this.tip,this.raised))/this.tipRadius);
  const axis=unit(sub(this.tip,this.origin)),normal=[-axis[1],axis[0]];
  this.a2=add(this.origin,mul(normal,this.baseRadius));this.a1=add(this.tip,mul(normal,this.tipRadius));
  this.b1=sub(this.origin,mul(normal,this.baseRadius));this.b2=sub(this.tip,mul(normal,this.tipRadius));
  if(this.angleMax<0){[this.a1,this.b1]=[this.b1,this.a1];[this.a2,this.b2]=[this.b2,this.a2];}
 }
 angle(time){
  if(!this.flag)return this.angle1;
  const duration=Math.abs((this.angle1-this.angle2)/this.angleMax*this.angleMult);
  let fraction=duration>=1e-7?(time-this.inputTime)/duration:1;fraction=Math.max(0,Math.min(1,fraction));
  if(this.flag===2)fraction=1-fraction;return fraction*this.angleMax;
 }
 motion(pressed,time){
  if(pressed===this.pressed)return;this.pressed=pressed;this.angle2=this.angle(time);
  this.angle1=pressed?this.angleMax:0;this.angleMult=pressed?this.upSeconds:this.downSeconds;
  if(!this.flag)this.inputTime=time;this.flag=pressed?1:2;this.stopTime=this.angleMult+this.inputTime;
 }
 points(time){
  const angle=this.angle(time),s=Math.sin(angle),c=Math.cos(angle),rotate=p=>{const q=sub(p,this.origin);return add(this.origin,[c*q[0]-s*q[1],s*q[0]+c*q[1]]);};
  this.A1=rotate(this.a1);this.A2=rotate(this.a2);this.B1=rotate(this.b1);this.B2=rotate(this.b2);this.T1=rotate(this.tip);
  this.lineA=line(this.A1,this.A2);this.lineB=line(this.B1,this.B2);
 }
 inside(p){
  const polygon=[this.A1,this.A2,this.B1,this.B2],inside=polygon.every((a,i)=>cross(sub(polygon[(i+1)%4],a),sub(p,a))>=0);
  if(!inside&&mag(sub(p,this.origin))>this.baseRadius&&mag(sub(p,this.T1))>=this.tipRadius)return 0;
  const sign=this.angleMax<0?-1:1,test=this.flag===1?(sign<0?this.B1:this.B2):this.flag===2?(sign<0?this.A2:this.A1):this.T1;
  return cross(sub(this.origin,test),sub(p,test))*sign<0?4:5;
 }
 distance(ray){
  let best={distance:FAR};
  for(const item of [{l:this.lineA},{c:this.origin,r:this.baseRadius},{c:this.T1,r:this.tipRadius},{l:this.lineB}]){
   const distance=item.l?rayLine(ray,item.l):rayCircle(ray,item.c,item.r);
   if(distance<best.distance){const p=item.l?[...item.l.hit]:add(ray.p,mul(ray.d,distance));best={distance,p,n:item.l?[...item.l.n]:unit(sub(p,item.c))};}
  }
  return best;
 }
 find(p,v,time,dt){
  const velocity=world(v),speed=mag(velocity),ray={p:world(p),d:unit(velocity),min:.002,max:speed*dt};
  if(time>this.stopTime)this.flag=0;
  if(this.edgeCollision){this.edgeCollision=false;return null;}
  this.push=false;this.backside=false;
  const finish=(hit,distance=hit.distance)=>{
   if(!hit.p||distance>=FAR)return null;
   this.contact=hit.p;this.normal=hit.n;
   return {t:speed>1e-9?Math.max(0,Math.min(1,distance/(speed*dt))):0,depth:0,n:[-hit.n[0],hit.n[1]],position:layout(hit.p),distance:distance*SCALE};
  };
  if(!this.flag){
   this.points(time);const side=this.inside(ray.p);
   if(!side){const hit=this.distance(ray);if(hit.distance===0&&hit.p)hit.p=sub(hit.p,mul(ray.d,1e-5));return finish(hit);}
   let direction;
   if(mag(sub(ray.p,this.origin))>=this.baseRadius*1.01){
    if(mag(sub(ray.p,this.T1))>=this.tipRadius*1.01)direction=mul(side===4?this.lineA.n:this.lineB.n,-1);
    else direction=unit(sub(this.T1,ray.p));
   }else direction=unit(sub(this.origin,ray.p));
   const cast=d=>this.distance({...ray,p:sub(ray.p,mul(d,5)),d,max:ray.max+10});
   let hit=cast(direction);if(hit.distance>=FAR){direction=unit(sub(this.origin,ray.p));hit=cast(direction);}
   if(hit.distance>=FAR)return null;hit.p=sub(hit.p,mul(direction,1e-5));return finish(hit,0);
  }
  let position=[...ray.p];
  // Source sampling intentionally advances by ray direction * timeAdvance.
  for(let t=time;t<time+dt;t+=this.timeAdvance){
   this.points(t);const side=this.inside(position);
   if(side){
    let perpendicular;
    if(this.flag===1&&side!==5)perpendicular=this.lineA.n;
    else if(this.flag!==2||side===4){
     this.backside=true;const d=unit(sub(this.origin,position));
     const hit=this.distance({...ray,p:sub(position,mul(d,5)),d,max:ray.max+10});
     if(hit.distance>=FAR)return finish({p:position,n:mul(d,-1)},0);
     hit.p=sub(hit.p,mul(d,1e-5));return finish(hit,0);
    }else perpendicular=this.lineB.n;
    this.push=true;this.perpendicular=[...perpendicular];const d=mul(perpendicular,-1);
    const hit=this.distance({...ray,p:sub(ray.p,mul(d,5)),d,max:ray.max+10});
    if(hit.distance>=FAR)return null;hit.p=sub(hit.p,mul(d,1e-5));return finish(hit,0);
   }
   const hit=this.distance({...ray,max:ray.max*this.timeAdvance});
   if(hit.distance<FAR){
    hit.p=sub(hit.p,mul(ray.d,1e-5));this.perpendicular=[...(this.flag===2?this.lineB.n:this.lineA.n)];
    this.push=this.flag===2?this.angleMax<=0:this.angleMax>0;return finish(hit);
   }
   position=add(position,mul(ray.d,this.timeAdvance));
  }
  return null;
 }
 response(){
  this.edgeCollision=true;
  const distance=mag(sub(this.contact,this.origin));let elasticity=this.elasticity,boost=0;
  if(!this.flag||!this.backside||this.push){
   if(this.push&&distance*distance>this.baseRadius*this.baseRadius*1.01)
    boost=Math.max(0,dot(this.perpendicular,this.normal))*distance/this.distanceDiv*(Math.abs(this.angleMax)/this.angleMult)*this.collisionMult*SCALE;
  }else if(distance*distance>this.baseRadius*this.baseRadius*1.01)elasticity=(1-distance/this.distanceDiv)*elasticity;
  return {elasticity,smoothness:this.smoothness,boost,threshold:boost>0?-1:1e9};
 }
}
if(typeof module!=='undefined'&&module.exports)module.exports=SpaceCadetFlipper;else root.SpaceCadetFlipper=SpaceCadetFlipper;
})(typeof window!=='undefined'?window:globalThis);

// SPDX-License-Identifier: GPL-3.0-or-later
// XY adaptation of Visual Pinball's hitflipper.cpp and collide.h, revision
// c21daff1a72e1fe4a5c23c1caf129070df4a670b. See third_party/vpx/README.md.
(function(root){
'use strict';
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,k)=>a.map(v=>v*k),dot=(a,b)=>a[0]*b[0]+a[1]*b[1],cross=(a,b)=>a[0]*b[1]-a[1]*b[0],turn=a=>[-a[1],a[0]],length=a=>Math.hypot(...a),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
// Official assets/exampleTable.vpx (both flippers), not a tuned speed curve.
const defaults={vpxFlipperMass:.7,vpxFlipperStrength:1800,vpxFlipperElasticity:.8,vpxFlipperElasticityFalloff:.001,vpxFlipperFriction:.8,vpxFlipperReturnStrength:.05,vpxFlipperEOSTorque:.25,vpxFlipperEOSTorqueAngle:6,vpxFlipperCoilRampUp:0};
const scale=c=>c.vpxLengthScale??c.ballRadius/25, inertia=(f,c)=>c.vpxFlipperMass*f.length*f.length/3;
function reset(f){f.omega=0;f.vpxTorque=0;f.vpxAcceleration=0;f.vpxInContact=false;f.vpxContactTorque=0;delete f.vpxSweep;}
// UpdateVelocities: strength is torque in VP units; 1 VPT = .01 seconds.
function drive(f,pressed,dt,c){
 const k=scale(c),strength=c.vpxFlipperStrength*k*k/1e-4,direction=Math.sign(f.up-f.rest),eos=c.vpxFlipperEOSTorqueAngle*Math.PI/180;
 let desired=strength*(pressed?1:-c.vpxFlipperReturnStrength);
 if(eos>0&&Math.abs(f.angle-f.up)<eos){const blend=(Math.abs(f.angle-f.up)/eos)**4;desired*=blend+c.vpxFlipperEOSTorque*(1-blend);}
 desired*=direction;
 const rampVP=c.vpxFlipperCoilRampUp<=0?1e6:Math.min(c.vpxFlipperStrength/c.vpxFlipperCoilRampUp,1e6),ramp=rampVP*k*k/1e-6;
 f.vpxTorque=(f.vpxTorque||0)+clamp(desired-(f.vpxTorque||0),-ramp*dt,ramp*dt);
 let torque=f.vpxTorque;f.vpxInContact=false;
 const low=Math.min(f.rest,f.up),high=Math.max(f.rest,f.up);
 if(Math.abs(f.omega||0)<=1){
  if(f.angle>=high-.01&&torque>0){f.angle=high;f.vpxInContact=true;}
  else if(f.angle<=low+.01&&torque<0){f.angle=low;f.vpxInContact=true;}
  if(f.vpxInContact){f.vpxContactTorque=torque;f.omega=0;torque=0;}
 }
 f.vpxAcceleration=torque/inertia(f,c);f.omega=(f.omega||0)+f.vpxAcceleration*dt;
}
// UpdateDisplacements/GetHitTime: split at a stopper, then recoil momentum -0.3.
function motion(f,start,omega,duration,offset=0){
 const low=Math.min(f.rest,f.up),high=Math.max(f.rest,f.up),segments=[];let time=offset,angle=start;
 while(time<duration-1e-12){
  const stop=omega>0?high:low,stopTime=omega?(stop-angle)/omega:Infinity,span=Math.min(duration-time,Math.max(0,stopTime));
  if(span>1e-12){segments.push({start:time,end:time+span,angle,omega});angle=clamp(angle+omega*span,low,high);time+=span;}
  if(stopTime<=duration-time+span+1e-12&&omega){omega*=-.3;if(Math.abs(omega)<.05)omega=0;}
  else break;
  if(!omega){segments.push({start:time,end:duration,angle,omega:0});time=duration;}
 }
 return {segments,angle,omega,duration};
}
function move(f,pressed,dt,c){drive(f,pressed,dt,c);f.vpxSweep=motion(f,f.angle,f.omega,dt);f.angle=f.vpxSweep.angle;f.omega=f.vpxSweep.omega;}
function state(f,time){const s=f.vpxSweep;if(!s)return {angle:f.angle,omega:f.omega||0};const seg=s.segments.find(a=>time<a.end-1e-12)||s.segments.at(-1);return seg?{angle:seg.angle+seg.omega*clamp(time-seg.start,0,seg.end-seg.start),omega:seg.omega}:{angle:f.angle,omega:f.omega||0};}
function react(f,time,c){
 const old=f.vpxSweep;if(!old)return;
 const angle=state(f,time).angle,next=motion(f,angle,f.omega,old.duration,time);
 next.segments=[...old.segments.filter(s=>s.start<time).map(s=>({...s,end:Math.min(s.end,time)})),...next.segments];f.vpxSweep=next;f.angle=next.angle;f.omega=next.omega;
}
function surface(f,position,normal,radius){const arm=sub(sub(position,mul(normal,radius)),f.pivot);return {arm,velocity:mul(turn(arm),f.omega||0)};}
function elasticity(value,falloff,velocity,c){return falloff>0?value/(1+falloff*Math.abs(velocity)/ (18.53*scale(c)*100)):value;}
// HitFlipper::Collide: include the stopper's support and use PRE-impact slip.
function response(ball,f,n,c,omega=f.omega,gap=0){
 f.omega=omega;const {arm,velocity}=surface(f,ball.p,n,c.ballRadius),t=turn(n),relative=sub(sub(ball.v,velocity),mul(t,c.ballRadius*(ball.spin||0)));let vn=dot(relative,n);const k=scale(c),low=1e-4*k*100;
 if(vn>=-low){if(vn>low||gap>=0)return 0;vn=-.05*k*100;}
 if(gap<0)ball.p=add(ball.p,mul(n,Math.min(5*k,-.9875*gap)));
 const I=inertia(f,c),lever=cross(arm,n),blocked=f.vpxInContact&&f.vpxContactTorque*(-lever)>=0,e=elasticity(c.vpxFlipperElasticity,c.vpxFlipperElasticityFalloff,vn,c);
 let j=-(1+e)*vn/(1+(blocked?0:lever*lever/I)),angular=-lever*j*(blocked?.5:1);
 if(f.vpxInContact&&angular*f.vpxContactTorque<0&&(-angular/f.vpxContactTorque<=.005||vn+j>0)){j=-(1+e)*vn;angular=0;}
 ball.v=add(ball.v,mul(n,j));f.omega+=angular/I;
 const vt=dot(relative,t),tl=cross(arm,t),friction=clamp(-vt/(3.5+tl*tl/I),-c.vpxFlipperFriction*j,c.vpxFlipperFriction*j);
 ball.v=add(ball.v,mul(t,friction));ball.spin=(ball.spin||0)-2.5*friction/c.ballRadius;f.omega-=tl*friction/I;
 return dot(velocity,n)>10?j:0;
}
// HitFlipper::Contact: support force from relative surface acceleration;
// static/dynamic friction are forces integrated for the remaining time.
function contact(ball,f,n,c,dt,gravity,omega=f.omega,gap=0){
 f.omega=omega;const originalVn=dot(sub(ball.v,surface(f,ball.p,n,c.ballRadius).velocity),n);
 if(gap<0)ball.v=add(ball.v,mul(n,.1*scale(c)*100));
 const r=c.ballRadius,{arm,velocity}=surface(f,ball.p,n,r),t=turn(n),spin=ball.spin||0,relative=sub(sub(ball.v,velocity),mul(t,r*spin)),vn=dot(relative,n),k=scale(c);
 if(vn>.099*k*100)return;
 const aB=add(gravity,mul(n,r*spin*spin)),aF=add(mul(turn(arm),f.vpxAcceleration||0),mul(arm,-omega*omega)),arel=sub(aB,aF),normalAcc=dot(arel,n)+2*dot(mul(turn(n),omega),relative);
 if(normalAcc>=0)return;
 const I=inertia(f,c),lever=cross(arm,n),force=-normalAcc/(1+lever*lever/I),j=force*dt;
 ball.v=add(ball.v,mul(n,j-originalVn));f.omega-=lever*j/I;
 const slip=dot(relative,t),slipAcc=dot(arel,t),numer=Math.abs(slip)<.01*k*100?-slipAcc:-slip*100,tl=cross(arm,t),friction=clamp(numer/(3.5+tl*tl/I),-force*c.vpxFlipperFriction,force*c.vpxFlipperFriction)*dt;
 ball.v=add(ball.v,mul(t,friction));ball.spin=spin-2.5*friction/r;f.omega-=tl*friction/I;
}
// HitTestFlipperFace/End: original 20-pass modified false-position solver.
function rootTime(sample,dt,r,endRadius,k){
 let time=0,t0,t1,d0,d1,previous,hit,iteration;
 for(iteration=1;iteration<=20;iteration++){
  hit=sample(time);const d=hit.gap;if(Math.abs(d)<=.01*k)break;
  if(iteration===1){if(d<-(r+endRadius))return null;if(d<=.05*k)break;t0=t1=dt;d0=0;d1=d;}
  else if(iteration===2){if(previous*d>0)return null;t0=0;t1=dt;d0=previous;d1=d;}
  else if(d*d0<=0){t1=time;d1=d;if(previous*d>0)d0*=.5;}
  else {t0=time;d0=d;if(previous*d>0)d1*=.5;}
  time=t0-d0*(t1-t0)/(d1-d0);previous=d;
 }
 if(!Number.isFinite(time)||time<0||time>dt||iteration>20&&Math.abs(hit.gap)>r*.25)return null;
 return {...hit,time};
}
function hit(p,v,f,r,offset,dt,c){
 const k=scale(c),q=(f.radii[0]-f.radii[1])/f.length,h=Math.sqrt(1-q*q),s=f.vpxSweep,ends=s?s.segments.filter(a=>a.end>offset&&a.start<offset+dt):[{start:offset,end:offset+dt,angle:f.angle,omega:f.omega||0}];
 for(const seg of ends){
  const begin=Math.max(offset,seg.start),span=Math.min(offset+dt,seg.end)-begin,start=state(f,begin),position=add(p,mul(v,begin-offset));
  function finish(a,end=false){
   if(!a)return null;const elapsed=begin-offset+a.time,point=add(p,mul(v,elapsed)),angle=start.angle+start.omega*a.time,omega=(angle>=Math.max(f.rest,f.up)&&start.omega>0||angle<=Math.min(f.rest,f.up)&&start.omega<0)?0:start.omega,arm=sub(sub(point,mul(a.n,r)),f.pivot),vn=dot(sub(v,mul(turn(arm),omega)),a.n);
   if(end?vn>=0:vn>1e-4*k*100&&Math.abs(vn)>.099*k*100)return null;
   return {t:elapsed/dt,n:a.n,depth:Math.max(0,-a.gap),gap:a.gap,position:point,distance:length(v)*elapsed,angularVelocity:omega,isContact:Math.abs(vn)<=.099*k*100&&a.gap<=.05*k};
  }
  for(const sign of [1,-1]){
   const face=rootTime(time=>{const angle=start.angle+start.omega*time,axis=[Math.cos(angle),Math.sin(angle)],n=add(mul(axis,q),mul(turn(axis),sign*h)),a=add(f.pivot,mul(n,f.radii[0])),delta=sub(add(position,mul(v,time)),a),tangent=sign===1?[n[1],-n[0]]:turn(n);return {n,gap:dot(delta,n)-r,along:dot(delta,tangent)};},span,r,f.radii[1],k);
   if(face&&face.along>=0&&face.along<=f.length*h){const found=finish(face);if(found)return found;}
  }
  const end=rootTime(time=>{const angle=start.angle+start.omega*time,tip=add(f.pivot,mul([Math.cos(angle),Math.sin(angle)],f.length)),delta=sub(add(position,mul(v,time)),tip),d=length(delta);return {n:mul(delta,1/(d||1)),gap:d-r-f.radii[1]};},span,r,f.radii[1],k),found=finish(end,true);if(found)return found;
 }
 return null;
}
const api={defaults,reset,drive,move,state,react,surface,response,contact,hit,inertia,elasticity};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.VpxFlipper=api;
})(typeof globalThis!=='undefined'?globalThis:this);

// SPDX-License-Identifier: GPL-3.0-or-later
// Planar VPX ball equations, pinned to the revision in third_party/vpx/README.md.
(function(root){
'use strict';
const F=typeof module!=='undefined'&&module.exports?require('./vpx-flipper.js'):root.VpxFlipper;
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,k)=>a.map(v=>v*k),dot=(a,b)=>a[0]*b[0]+a[1]*b[1],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Native VPX values: table/bumper example defaults and Surface/HitObject defaults.
const CONFIG={physicsModel:'vpx2d',ballRadius:6.3,vpxLengthScale:6.3/25,...F.defaults,vpxGravityConstant:.97,vpxTableSlope:6,vpxFriction:.075,vpxWallFriction:.3,vpxElasticity:.3,vpxElasticityFalloff:0,vpxBumperForce:7,vpxBumperThreshold:1,vpxBumperElasticity:.3,vpxBumperFriction:.3,vpxSlingForce:8,vpxSlingThreshold:0,vpxSlingElasticity:.3,vpxSlingFriction:.3,vpxSlingElasticityFalloff:0,vpxKickerSpeed:40,vpxNudgeX:1.27,vpxNudgeY:2.58,vpxWellPull:0,vpxWellDrag:0,vpxRampHeight:22};
function parameters(c){
 const p=Object.create(c),k=c.vpxLengthScale;
 Object.defineProperties(p,{
  gravity:{get:()=>c.vpxGravityConstant*1.81751*k*1e4*Math.sin(c.vpxTableSlope*Math.PI/180)},
  verticalGravity:{get:()=>c.vpxGravityConstant*1.81751*k*1e4},
  drag:{value:0},rampDrag:{value:0},maxSpeed:{value:Infinity},speedScale:{value:1},step:{value:1/60},
  rampHeight:{get:()=>c.vpxRampHeight},kickbackSpeed:{get:()=>c.vpxKickerSpeed*k*100},wellPull:{get:()=>c.vpxWellPull*k*1e4},wellDrag:{get:()=>c.vpxWellDrag},
  elasticity:{get:()=>c.vpxElasticity},elasticityFalloff:{get:()=>c.vpxElasticityFalloff}
 });return p;
}
// LineSeg::HitTestBasic (rigid, lateral): all calculations use native VPU/VPT.
// Layout lines expose two independent normal faces; end joints are passive circles.
function lineFace(p,v,a,b,r,dt,k){
 p=mul(p,1/k);v=mul(v,1/(100*k));a=mul(a,1/k);b=mul(b,1/k);r/=k;dt*=100;
 const axis=sub(b,a),length=Math.hypot(...axis);if(!length)return null;
 const n=[-axis[1]/length,axis[0]/length],bnv=dot(v,n);if(bnv>.0001)return null;
 const bcpd=dot(sub(p,a),n),bnd=bcpd-r;if(bnd < -r||bcpd<0)return null;
 let time;if(bnd<=.05){time=bnd<=0||Math.abs(bnv)>.099||bnd<=-.05?0:bnd/(2*.05)+.5;}
 else if(Math.abs(bnv)>.0001)time=bnd/-bnv;else return null;
 if(!Number.isFinite(time)||time<0||time>dt)return null;
 const btv=v[0]*n[1]-v[1]*n[0],delta=sub(p,a),btd=delta[0]*n[1]-delta[1]*n[0]+btv*time;
 if(btd<0||btd>length)return null;
 return {t:dt?time/dt:0,position:mul(add(p,mul(v,time)),k),n,gap:bnd*k,depth:0,isContact:Math.abs(bnv)<=.099&&Math.abs(bnd)<=.05,orgNormalVelocity:bnv*k*100,part:'face'};
}
// HitCircle::HitTestBasicRadius, rigid/lateral circle without free Z motion.
function hitCircle(p,v,center,radius,ballRadius,dt,c){
 const k=c.vpxLengthScale,worldDt=dt;dt*=100;p=mul(p,1/k);v=mul(v,1/(100*k));center=mul(center,1/k);radius/=k;ballRadius/=k;
 const delta=sub(p,center),distance=Math.hypot(...delta);if(distance<=1e-6)return null;
 const b=dot(delta,v),bnv=b/distance;if(bnv>.0001)return null;
 const target=radius+ballRadius,gap=distance-target,a=dot(v,v);let time=0,isContact=false;
 if(gap<.05){if(gap < -ballRadius)return null;if(Math.abs(bnv)<=.099)isContact=true;else time=Math.max(0,-gap/bnv);}
 else {if(a<1e-8)return null;const disc=b*b-a*(dot(delta,delta)-target*target);if(disc<0)return null;const root=Math.sqrt(disc),t1=(-b-root)/a,t2=(-b+root)/a;time=t1*t2<0?Math.max(t1,t2):Math.min(t1,t2);}
 if(!Number.isFinite(time)||time<0||time>dt)return null;
 const position=add(p,mul(v,time)),normal=sub(position,center),size=Math.hypot(...normal);
 return {t:worldDt?time/(100*worldDt):0,position:mul(position,k),n:size>1e-4?mul(normal,1/size):[0,1],gap:gap*k,depth:0,isContact,orgNormalVelocity:bnv*k*100,part:'circle'};
}
function hitLine(p,v,a,b,r,dt,c,faceOnly=false,thickness=0,side=0){
 const k=c.vpxLengthScale,axis=sub(b,a),length=Math.hypot(...axis),half=thickness/2,n=length?[-axis[1]/length,axis[0]/length]:[0,0],offset=mul(n,half);
 const hits=[];if(side>=0)hits.push(lineFace(p,v,add(a,offset),add(b,offset),r,dt,k));if(side<=0)hits.push(lineFace(p,v,sub(b,offset),sub(a,offset),r,dt,k));
 if(!faceOnly)for(const point of [a,b]){const h=hitCircle(p,v,point,half,r,dt,c);if(h){h.part='endcap';hits.push(h);}}
 return hits.filter(Boolean).sort((a,b)=>a.t-b.t)[0]||null;
}
// HitBall::HandleStaticContact + ApplyFriction with only planar spin retained.
function contact(ball,n,gravity,dt,friction,c,originalNormalVelocity=dot(ball.v,n)){
 const vn=dot(ball.v,n),speedUnit=c.vpxLengthScale*100;if(vn>.099*speedUnit)return;
 const gn=dot(gravity,n),normalForce=Math.max(0,-(gn*dt+originalNormalVelocity));
 ball.v=add(ball.v,mul(n,normalForce));
 const t=[-n[1],n[0]],slip=dot(ball.v,t)-c.ballRadius*(ball.spin||0),staticContact=dot(ball.v,n)<=.025*speedUnit||Math.abs(slip)<.01*speedUnit;
 const numerator=staticContact?-dot(gravity,t):-slip*100,maxFriction=friction*Math.max(0,-gn),j=clamp(numerator/3.5,-maxFriction,maxFriction)*dt;
 ball.v=add(ball.v,mul(t,j));ball.spin=(ball.spin||0)-2.5*j/c.ballRadius;
}
// HitBall::Collide3DWall, with Z translation suppressed and sphere Z spin retained.
function collision(v,n,spin,r,e,friction,falloff,k,threshold=Infinity,boost=0,gap=0){
 let vn=dot(v,n);if(vn>=-.0001*k*100){if(vn>.0001*k*100||gap>=0)return {velocity:[...v],spin};vn=-.05*k*100;}
 const t=[-n[1],n[0]],slip=dot(v,t)-r*spin,reaction=-vn,j=clamp(-slip/3.5,-friction*reaction,friction*reaction),cor=falloff>0?e/(1+falloff*Math.abs(vn)/(18.53*k*100)):e;
 let velocity=add(sub(v,mul(n,(1+cor)*vn)),mul(t,j));if(reaction>=threshold)velocity=add(velocity,mul(n,boost));
 return {velocity,spin:spin-2.5*j/r,positionShift:mul(n,-.9875*gap>1e-4*k?Math.min(5*k,-.9875*gap):0)};
}
// HitBall::Collide for two free unit-mass balls (native restitution 0.8).
function ballCollision(a,b,n,gap,c){
 const k=c.vpxLengthScale;let normalSpeed=dot(sub(b,a),n);
 if(normalSpeed>=-.0001*k*100){if(normalSpeed>.0001*k*100||gap>=0)return null;normalSpeed=-.05*k*100;}
 const impulse=mul(n,-.9*normalSpeed),shift=-.9875*gap>1e-4*k?Math.min(5*k,-.9875*gap)/2:0;
 return {a:sub(a,impulse),b:add(b,impulse),shift:mul(n,shift)};
}
// HitBall::ApplyFriction projected onto the agreed XY / Z-spin-only model.
// Cross(wZ, Cross(wZ, [0,0,-r])) is zero. Do not retain partial XY spin:
// planar wall/flipper impulses do not evolve those axes consistently.
function floor(ball,acceleration,normalGravity,dt,c){
 delete ball.rollingSpin;
 const size=Math.hypot(...acceleration);if(size<1e-6)return;
 const direction=mul(acceleration,1/size),force=clamp(-size/3.5,-c.vpxFriction*normalGravity,c.vpxFriction*normalGravity);
 ball.v=add(ball.v,mul(direction,force*dt));
}
// VPX UpdateVelocities gravity in XY; Z describes table slope only.
// Default downhill gravity contributes to Y, not to the speed magnitude or X.
function accelerate(ball,acceleration,normalGravity,dt,c){
 ball.v=add(ball.v,mul(acceleration,dt));floor(ball,acceleration,normalGravity,dt,c);
}
// LineSegSlingshot::Collide: position-dependent inward drive, then rubber bounce.
function slingshot(ball,edge,n,c,enabled,gap=0){
 const k=c.vpxLengthScale,point=sub(ball.p,mul(n,c.ballRadius)),axis=sub(edge.b,edge.a),span=axis[0]*n[1]-axis[1]*n[0],delta=sub(point,edge.a),along=delta[0]*n[1]-delta[1]*n[0],position=Math.abs(span)>1e-6?2*along/span-1:-1;
 const force=enabled ? .5*(1-position*position)*c.vpxSlingForce*10*k*100:0;
 const v=sub(ball.v,mul(n,force));return collision(v,n,ball.spin||0,c.ballRadius,c.vpxSlingElasticity,c.vpxSlingFriction,c.vpxSlingElasticityFalloff,k,Infinity,0,gap);
}
const api={CONFIG,parameters,collision,floor,accelerate,slingshot,hitLine,hitCircle,lineFace,contact,ballCollision};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.VpxPhysics=api;
})(typeof globalThis!=='undefined'?globalThis:this);

/* Gameplay-first planar physics. Inspired by action pinball; not DEMON'S TILT source. */
(function(root){
'use strict';
const defaults=typeof module!=='undefined'&&module.exports?require('../../config/arcade-physics-defaults.json'):root.ArcadePhysicsDefaults;
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],mul=(a,k)=>[a[0]*k,a[1]*k],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],len=a=>Math.hypot(...a),unit=a=>mul(a,1/(len(a)||1)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const CONFIG={...defaults,physicsModel:'arcade',ballRadius:6.3,step:1/60,speedScale:1,drag:0,rampDrag:0,rampHeight:22,wellPull:0,wellDrag:0};
function parameters(c){const p=Object.create(c);Object.defineProperties(p,{gravity:{get:()=>c.arcadeVerticalGravity*Math.sin(c.arcadeTableSlope*Math.PI/180)},verticalGravity:{get:()=>c.arcadeVerticalGravity},maxSpeed:{get:()=>c.arcadeMaxSpeed},kickbackSpeed:{get:()=>c.arcadeKickerSpeed}});return p;}
function circle(p,v,center,r,dt){const delta=sub(p,center),dist=len(delta),gap=dist-r,n=dist?mul(delta,1/dist):unit(mul(v,-1));if(gap<=.01){if(dot(v,n)>0&&gap>=0)return null;return {t:0,n,gap,position:[...p],part:'endcap'};}
 const speed2=dot(v,v),b=dot(delta,v),disc=b*b-speed2*(dot(delta,delta)-r*r);if(speed2<1e-12||b>=0||disc<0)return null;const time=(-b-Math.sqrt(disc))/speed2;if(time<0||time>dt)return null;const position=add(p,mul(v,time));return {t:time/dt,position,n:unit(sub(position,center)),gap:0,part:'endcap'};}
function line(p,v,a,b,r,dt,side=0,caps=true){const axis=sub(b,a),span=len(axis);if(!span)return circle(p,v,a,r,dt);const tangent=mul(axis,1/span),normal=[-tangent[1],tangent[0]];let best=null;
 for(const sign of (side?[side]:[-1,1])){const n=mul(normal,sign),distance=dot(sub(p,a),n),vn=dot(v,n);if(distance<-.01||vn>0)continue;const gap=distance-r,time=gap<=.01?0:vn<0?-gap/vn:Infinity;if(time>dt||time<0)continue;const position=add(p,mul(v,time)),along=dot(sub(position,a),tangent);if(along<0||along>span)continue;const hit={t:time/dt,position,n,gap:Math.min(0,gap),part:'face'};if(!best||hit.t<best.t)best=hit;}
 if(caps)for(const c of [a,b]){const h=circle(p,v,c,r,dt);if(h&&(!best||h.t<best.t))best=h;}return best;}
function move(f,pressed,dt,c){const old=f.angle,target=pressed?f.up:f.rest,rate=Math.abs(f.up-f.rest)/(pressed?c.arcadeFlipperSeconds:c.arcadeReturnSeconds);f.arcadeStartAngle=old;f.angle=old+clamp(target-old,-rate*dt,rate*dt);f.omega=(f.angle-old)/dt;f.arcadePressed=pressed;f.arcadeMoving=pressed&&Math.abs(f.omega)>1e-8;}
// Swept tapered capsule; continuous distance also for points beyond either end.
function surface(p,f,angle,r){const axis=[Math.cos(angle),Math.sin(angle)],along=clamp(dot(sub(p,f.pivot),axis)/f.length,0,1),center=add(f.pivot,mul(axis,f.length*along)),delta=sub(p,center),radius=f.radii[0]+(f.radii[1]-f.radii[0])*along;
 return {gap:len(delta)-radius-r,n:len(delta)>1e-8?unit(delta):[-axis[1],axis[0]],along};
}
function flipperHit(p,v,f,r,offset,dt){if(len(sub(p,f.pivot))>f.length+Math.max(...f.radii)+r+len(v)*dt)return null;const at=t=>{const angle=f.arcadeStartAngle+f.omega*(offset+t),position=add(p,mul(v,t)),s=surface(position,f,angle,r),arm=sub(position,f.pivot),sv=[-f.omega*arm[1],f.omega*arm[0]];return {...s,position,relative:dot(sub(v,sv),s.n)};};
 let previous=at(0);if(previous.gap<=.01&&previous.relative<0)return {...previous,t:0};
 for(let i=1;i<=8;i++){const time=dt*i/8,current=at(time);if(current.gap<=0&&previous.gap>0){let lo=dt*(i-1)/8,hi=time;for(let j=0;j<16;j++){const mid=(lo+hi)/2;if(at(mid).gap<=0)hi=mid;else lo=mid;}return {...at(hi),t:hi/dt};}previous=current;}return null;
}
function passive(v,n,c){const vn=dot(v,n);return vn<0?sub(v,mul(n,vn*(Math.abs(vn)<=c.arcadeContactSpeed?1:1+c.arcadeWallElasticity))):[...v];}
function response(ball,edge,hit,c){const vn=dot(ball.v,hit.n);let fired=false;
 if(edge.kind==='flipper'){const f=edge.f,angle=f.arcadeStartAngle+f.omega*hit.elapsed,axis=[Math.cos(angle),Math.sin(angle)];let up=[-axis[1],axis[0]];if(up[1]>0)up=mul(up,-1);
  if(f.arcadeMoving&&dot(hit.n,up)>.2&&!(ball.arcadeFlipperContacts||new Set()).has(f.id)){
   const direction=unit(add(up,mul(axis,(hit.along-.5)*.45))),speed=c.arcadeFlipperSpeed*(.72+.28*hit.along);ball.v=mul(direction,Math.max(speed,len(ball.v)));ball.arcadeFlipperContacts??=new Set();ball.arcadeFlipperContacts.add(f.id);fired=true;
  }else ball.v=passive(ball.v,hit.n,c);
 }else {const active=(edge.kind==='bumper'||edge.vpxSlingshot&&edge.slingshotFace&&hit.part==='face'),key=edge.id;
  if(active&&-vn>=c.arcadeTriggerSpeed&&-vn/Math.max(1e-8,len(ball.v))>=.15&&!(ball.arcadeActiveContacts||new Set()).has(key)){const speed=edge.kind==='bumper'?c.arcadeBumperSpeed:c.arcadeSlingSpeed,tangent=sub(ball.v,mul(hit.n,vn)),reflected=-vn*c.arcadeWallElasticity,extra=Math.min(Math.max(0,speed-reflected),-vn*.75);ball.v=add(tangent,mul(hit.n,reflected+extra));ball.arcadeActiveContacts??=new Set();ball.arcadeActiveContacts.add(key);fired=true;}else ball.v=passive(ball.v,hit.n,c);
 }return fired;
}
function collide(g,dt){const b=g.ball,c=g.physics,r=c.ballRadius;let remaining=dt;const handled=new Set();
 for(const id of b.arcadeActiveContacts||[]){const edges=(g.edges[b.layer]||[]).filter(e=>e.id===id);if(!edges.some(e=>e.c?len(sub(b.p,e.c))<=r+e.r+1:Math.abs(dot(sub(b.p,e.a),unit([e.a[1]-e.b[1],e.b[0]-e.a[0]])))<=r+(e.thickness||0)/2+1))b.arcadeActiveContacts.delete(id);}
 for(const id of b.arcadeFlipperContacts||[]){const f=g.flippers.find(f=>f.id===id);if(!f||surface(b.p,f,f.angle,r).gap>1||!f.arcadePressed)b.arcadeFlipperContacts.delete(id);}
 for(let pass=0;pass<12&&remaining>1e-8;pass++){const d=mul(b.v,remaining),portal=g.portalHit(b.p,d),track=g.guidedTrackHit(b.p,d);let best=null;
  for(const e of [...g.grids[b.layer].query(b.p,d,Math.max(5,r)),...g.dynamicEdges()]){if(handled.has(e.id)||g.targetHits.has(e.id)||!g.edgeEnabled(e))continue;if((e.kind==='plunger'||e.kind==='rescue-kicker')&&b.v[1]<=0)continue;if(e.retractUp&&(b.v[1]<0||b.p[1]>e.c[1]))continue;if(e.n&&(dot(d,e.n)>=0||dot(sub(b.p,e.a),e.n)<r-.08))continue;
   const hit=e.c?circle(b.p,b.v,e.c,r+e.r,remaining):line(b.p,b.v,e.a,e.b,r+(e.thickness||0)/2,remaining,e.vpxSide||0,!e.faceOnly);if(hit&&(!best||hit.t<best.t))best={...hit,e};}
  for(const f of g.flippers){if(handled.has(f.id)||b.layer!==(f.layer||'lower'))continue;const hit=flipperHit(b.p,b.v,f,r,dt-remaining,remaining);if(hit&&(!best||hit.t<best.t))best={...hit,e:{kind:'flipper',id:f.id,f}};}
  if(track&&(!best||track.t<=best.t)&&(!portal||track.t<=portal.t)){g.enterGuidedTrack(track.track);remaining=g.advanceGuidedTrack(remaining*(1-track.t));if(b.state==='guided')return;continue;}
  if(portal&&(!best||portal.t<=best.t)){b.p=add(b.p,mul(d,portal.t));remaining*=1-portal.t;g.transition(portal);if(b.state!=='playing')return;continue;}
  if(!best){b.p=add(b.p,d);break;}if(g.physicsTrace)g.physicsTrace({time:g.time,id:best.e.id,from:[...b.p],to:best.position,gap:best.gap,n:best.n,velocity:[...b.v]});b.p=add(best.position,mul(best.n,Math.max(0,-best.gap)+.012));remaining*=1-clamp(best.t,0,1);handled.add(best.e.id);const e=best.e;
  if(e.kind==='plunger'&&b.v[1]>0&&best.n[1]<-.5){b.state='ready';b.v=[0,0];b.p[1]=g.g.plunger.rest_y-r;g.charge=g.chargeElapsed=0;g.emit('plunger-ready');return;}
  if(g.handleCollision(e)){if(b.state!=='playing')return;continue;}
  const incoming=[...b.v],approach=Math.max(0,-dot(b.v,best.n)),fired=response(b,e,{...best,elapsed:dt-remaining},c);g.limitSpeed();if(g.physicsTrace)g.physicsTrace({phase:'response',time:g.time,id:e.id,kind:e.kind,n:best.n,part:best.part,incoming,velocity:[...b.v],fired});
  if(fired&&e.kind==='flipper')g.emit('flipper-hit',{id:e.id,along:best.along,speed:len(b.v)});
  if(fired&&e.kind!=='bumper'&&e.kind!=='flipper')g.emit('slingshot-hit',{id:e.id});
  if(e.kind==='bumper'&&fired)g.scoreHit(e.id,500*g.bumperLevel(e.id));else if(approach>c.arcadeContactSpeed&&(e.kind==='rebound'||e.kind==='active'||e.kind==='target'))g.scoreHit(e.id,500);
  if(approach>c.arcadeContactSpeed)g.collisionEffect(e,approach);
 }
}
const api={CONFIG,parameters,circle,line,move,surface,flipperHit,passive,response,collide};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.ArcadePhysics=api;
})(typeof window!=='undefined'?window:globalThis);

/* Join selected perimeter paths into a closed, non-colliding slope region. */
(function(root){
'use strict';
const EPS=1e-7,dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
function valid(points){
 if(!Array.isArray(points)||points.length<3||points.length>8192||points.some(p=>!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)))return false;
 let area=0;
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length];if(dist(a,b)<EPS)return false;area+=a[0]*b[1]-a[1]*b[0];
  for(let j=i+2;j<points.length;j++){
   if(i===0&&j===points.length-1)continue;
   const c=points[j],d=points[(j+1)%points.length];
   if(Math.max(a[0],b[0])+EPS<Math.min(c[0],d[0])||Math.max(c[0],d[0])+EPS<Math.min(a[0],b[0])||Math.max(a[1],b[1])+EPS<Math.min(c[1],d[1])||Math.max(c[1],d[1])+EPS<Math.min(a[1],b[1]))continue;
   const abC=cross(a,b,c),abD=cross(a,b,d),cdA=cross(c,d,a),cdB=cross(c,d,b);
   if(((abC<=EPS&&abD>=-EPS)||(abD<=EPS&&abC>=-EPS))&&((cdA<=EPS&&cdB>=-EPS)||(cdB<=EPS&&cdA>=-EPS)))return false;
  }
 }
 return Math.abs(area)>EPS;
}
function connect(paths){
 if(!paths.length||paths.some(p=>!Array.isArray(p)||p.length<2||p.some(q=>!Array.isArray(q)||q.length!==2||!q.every(Number.isFinite))))throw Error('請選取周邊直線、弧線或封閉輪廓。');
 // Editor boundaries can meet within one pixel (e.g. Pirate arc-009 at
 // y=136 and line-034 at y=135). Snap only their endpoints, not curve samples.
 paths=paths.map(path=>path.map(p=>[...p]));
 const endpoints=paths.flatMap(path=>[path[0],path.at(-1)]);
 for(let i=0;i<endpoints.length;i++)for(let j=i+1;j<endpoints.length;j++)if(Math.floor(i/2)!==Math.floor(j/2)&&dist(endpoints[i],endpoints[j])<=Math.min(1.01,dist(paths[Math.floor(i/2)][0],paths[Math.floor(i/2)].at(-1))*.1,dist(paths[Math.floor(j/2)][0],paths[Math.floor(j/2)].at(-1))*.1)){endpoints[j][0]=endpoints[i][0];endpoints[j][1]=endpoints[i][1];}
 if(paths.length>1&&paths.some(p=>dist(p[0],p.at(-1))<EPS))throw Error('封閉輪廓請單獨建立坡面，不要混入其他輪廓。');
 function join(reverse){
  const remaining=paths.slice(1).map(p=>p.map(q=>[...q])),points=(reverse?[...paths[0]].reverse():paths[0]).map(p=>[...p]),bridges=[];
  while(remaining.length){
   const end=points.at(-1);let best={distance:Infinity};
   remaining.forEach((path,index)=>{for(const reverse of [false,true]){const distance=dist(end,reverse?path.at(-1):path[0]);if(distance<best.distance)best={distance,index,reverse};}});
   const path=remaining.splice(best.index,1)[0];if(best.reverse)path.reverse();
   if(best.distance>EPS)bridges.push([[...end],[...path[0]]]);
   for(const point of path)if(dist(points.at(-1),point)>EPS)points.push(point);
  }
  if(dist(points[0],points.at(-1))<EPS)points.pop();else bridges.push([[...points.at(-1)],[...points[0]]]);
  return {points,bridges};
 }
 const first=join(false);if(valid(first.points))return first;
 const reverse=join(true);if(valid(reverse.points))return reverse;
 // A nearest endpoint is only a preference: long parallel boundaries may
 // require returning to the other end before closing the launch-lane contour.
 let budget=12000;
 function search(points,remaining,bridges){
  if(--budget<0)return null;
  if(!remaining.length){
   const closed=points.map(p=>[...p]),gaps=bridges.slice();
   if(dist(closed[0],closed.at(-1))<EPS)closed.pop();else gaps.push([[...closed.at(-1)],[...closed[0]]]);
   return valid(closed)?{points:closed,bridges:gaps}:null;
  }
  const end=points.at(-1),choices=[];
  remaining.forEach((path,index)=>{for(const reverse of [false,true])choices.push({index,reverse,distance:dist(end,reverse?path.at(-1):path[0])});});
  choices.sort((a,b)=>a.distance-b.distance);
  for(const choice of choices){
   const path=choice.reverse?[...remaining[choice.index]].reverse():remaining[choice.index],next=points.map(p=>[...p]),gaps=bridges.slice();
   if(choice.distance>EPS)gaps.push([[...end],[...path[0]]]);
   for(const point of path)if(dist(next.at(-1),point)>EPS)next.push([...point]);
   const result=search(next,remaining.filter((_,i)=>i!==choice.index),gaps);if(result)return result;
   if(budget<0)return null;
  }
  return null;
 }
 for(const reverse of [false,true]){
  const result=search((reverse?[...paths[0]].reverse():paths[0]).map(p=>[...p]),paths.slice(1),[]);if(result)return result;
 }
 throw Error('最近端點連線後輪廓交叉或沒有面積，請調整周邊物件選取。');
}
function worldPoints(zone){return zone.outline.map(([x,y])=>[zone.x+x*zone.width,zone.y+y*zone.height]);}
function region(paths){
 const {points,bridges}=connect(paths),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
 const x=(left+right)/2,y=(top+bottom)/2,width=right-left,height=bottom-top,normalize=p=>[(p[0]-x)/width,(p[1]-y)/height];
 return {x,y,width,height,angle:0,outline:points.map(normalize),bridges:bridges.map(edge=>edge.map(normalize))};
}
const api={valid,connect,region,worldPoints};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SlopeRegions=api;
})(globalThis);

/* Basic collision response ported from SpaceCadetPinball maths::basic_collision.
 * Copyright (c) 2020-2021 Andrey Muzychenko. MIT; see embedded/third-party LICENSE.
 * Continuous collision detection, browser simulation and layer handling below
 * are this prototype's implementation, not a port of the complete engine.
 */
(function(root){
'use strict';
const CadetFlipper=typeof module!=='undefined'&&module.exports?require('./space-cadet-flipper.js'):root.SpaceCadetFlipper;
const VpxFlipper=typeof module!=='undefined'&&module.exports?require('./vpx-flipper.js'):root.VpxFlipper;
const VpxPhysics=typeof module!=='undefined'&&module.exports?require('./vpx-physics.js'):root.VpxPhysics;
const ArcadePhysics=typeof module!=='undefined'&&module.exports?require('./arcade-physics.js'):root.ArcadePhysics;
const EPS=1e-6, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]], sub=(a,b)=>[a[0]-b[0],a[1]-b[1]], mul=(a,k)=>[a[0]*k,a[1]*k];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1], cross=(a,b)=>a[0]*b[1]-a[1]*b[0], len=a=>Math.hypot(...a), unit=a=>mul(a,1/(len(a)||1));
const mix=(a,b,t)=>add(a,mul(sub(b,a),t));
function nearest(p,a,b){const ab=sub(b,a),t=clamp(dot(sub(p,a),ab)/(dot(ab,ab)||1),0,1);return {p:mix(a,b,t),t};}
function inside(p,poly){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++) {const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
// Preserve the original direction normalization and speed-loss rule. This is
// deliberately not replaced with the simpler v -= (1+e)*dot(v,n)*n formula.
function basicCollision(velocity,normal,elasticity=.82,smoothness=.96,threshold=1e9,boost=0){
 let speed=len(velocity);if(speed===0)return threshold<=0?mul(normal,boost):[0,0];
 let direction=mul(velocity,1/speed),projection=-dot(normal,direction);
 if(projection<0)projection=-projection;
 else direction=unit(add(mul(add(direction,mul(normal,projection)),smoothness),mul(normal,projection*elasticity)));
 const reboundSpeed=projection*speed;speed-=(1-elasticity)*reboundSpeed;
 let result=mul(direction,speed);if(reboundSpeed>=threshold)result=add(result,mul(normal,boost));return result;
}
// Project vertical gravity onto the slope, then express it in the 2D
// surface-distance coordinates used by this game (no Z position/bounce).
function slopeAcceleration(angle,direction,gravity){
 const theta=angle*Math.PI/180,s=Math.sin(theta),c=Math.cos(theta),d=unit(direction);
 const normal=[s*d[0],s*d[1],c],g=[0,0,-gravity],projection=g[2]*normal[2];
 const along=[g[0]-projection*normal[0],g[1]-projection*normal[1],g[2]-projection*normal[2]];
 const slopeTangent=[c*d[0],c*d[1],-s],acceleration=along.reduce((sum,v,i)=>sum+v*slopeTangent[i],0);
 return mul(d,acceleration);
}
// VPX-style normal impulse and Coulomb-limited contact friction, restricted
// to XY motion and spin about Z. Unit sphere mass, inertia = 2/5 * r^2.
// Compatibility API delegates to the same VPX implementation as the runtime.
function vpxCollision(velocity,normal,spin,radius,elasticity,friction,threshold=Infinity,boost=0,contact=false){
 if(!contact)return VpxPhysics.collision(velocity,normal,spin,radius,elasticity,friction,0,radius/25,threshold,boost);
 const ball={v:[...velocity],spin};VpxPhysics.contact(ball,normal,[0,0],0,friction,{ballRadius:radius,vpxLengthScale:radius/25});return {velocity:ball.v,spin:ball.spin};
}
// maths::ray_intersect_circle: retain negative entry distance for an inside ray.
function circleHit(p,d,c,r){
 const length=len(d);if(!length)return null;const direction=mul(d,1/length),delta=sub(c,p),along=dot(delta,direction);
 if(along<0)return null;const square=dot(delta,delta),det=r*r-square+along*along;
 if(det<0)return null;const distance=along-Math.sqrt(det);
 if(square>=r*r&&(distance<0||distance>length))return null;
 const position=add(p,mul(direction,distance));return {t:distance/length,distance,position,n:unit(sub(position,c)),depth:0};
}
// TLine ray test, in layout coordinates. Pirate editor lines have two exposed
// faces; each face uses the source one-sided test and .002 world-unit tolerance.
function segmentHit(p,d,a,b,r){
 const length=len(d),axis=sub(b,a),span=len(axis);if(!length)return null;if(!span)return circleHit(p,d,a,r);
 const tangent=mul(axis,1/span),normal=[-tangent[1],tangent[0]],direction=mul(d,1/length);let best=null;
 for(const sign of [-1,1]){
  const n=mul(normal,sign),divisor=dot(n,direction);if(divisor>=0)continue;
  const distance=(r-dot(sub(p,a),n))/divisor;if(distance<-.002*21||distance>length)continue;
  const position=add(p,mul(direction,distance)),along=dot(sub(position,a),tangent);if(along<0||along>span)continue;
  const h={t:distance/length,distance,position,n,depth:0};if(!best||distance<best.distance)best=h;
 }
 for(const c of [a,b]){const h=circleHit(p,d,c,r);if(h&&(!best||h.distance<best.distance))best=h;}return best;
}
// Convex hull of unequal end circles: shared by the visible flipper and CCD.
function taperedGeometry(a,b,ra,rb){
 const axis=unit(sub(b,a)),perp=[-axis[1],axis[0]],q=clamp((ra-rb)/len(sub(b,a)),-1,1),h=Math.sqrt(1-q*q);
 const n1=add(mul(axis,q),mul(perp,h)),n2=sub(mul(axis,q),mul(perp,h));
 return {sides:[[add(a,mul(n1,ra)),add(b,mul(n1,rb)),n1],[add(a,mul(n2,ra)),add(b,mul(n2,rb)),n2]],angle:Math.atan2(axis[1],axis[0]),spread:Math.acos(q)};
}
function taperedOutline(a,b,ra,rb){
 const {angle,spread}=taperedGeometry(a,b,ra,rb),points=[];
 for(const [center,r,start,end]of [[a,ra,angle+spread,angle+2*Math.PI-spread],[b,rb,angle-spread,angle+spread]])
  for(let i=0;i<=24;i++){const t=start+(end-start)*i/24;points.push(add(center,[Math.cos(t)*r,Math.sin(t)*r]));}
 return points;
}
function taperedHit(p,d,a,b,ra,rb,r){
 const {sides}=taperedGeometry(a,b,ra,rb),outline=taperedOutline(a,b,ra,rb);
 if(inside(p,outline)){
  let best=null;for(const [center,radius]of [[a,ra],[b,rb]]){const n=unit(sub(p,center)),q=add(center,mul(n,radius));
   // Use only exposed cap arcs, excluding the interior of the hull.
   const t=dot(sub(q,a),unit(sub(b,a)));if(center===a?t<dot(sub(sides[0][0],a),unit(sub(b,a))):t>dot(sub(sides[0][1],a),unit(sub(b,a)))){
    const depth=len(sub(q,p))+r;if(!best||depth<best.depth)best={t:0,n,depth};}}
  for(const [start,end,n]of sides){const q=nearest(p,start,end).p,depth=len(sub(q,p))+r;if(!best||depth<best.depth)best={t:0,n,depth};}return best;
 }
 let best=null;for(const hit of [circleHit(p,d,a,ra+r),circleHit(p,d,b,rb+r),...sides.map(([a,b])=>segmentHit(p,d,a,b,r))])if(hit&&(!best||hit.t<best.t))best=hit;
 return best;
}
class Grid {
 constructor(edges){this.map=new Map();this.size=24;for(const e of edges){const pts=e.c?[e.c,e.c]:[e.a,e.b],r=(e.r||0)+5;
  for(let x=Math.floor((Math.min(pts[0][0],pts[1][0])-r)/24);x<=Math.floor((Math.max(pts[0][0],pts[1][0])+r)/24);x++)for(let y=Math.floor((Math.min(pts[0][1],pts[1][1])-r)/24);y<=Math.floor((Math.max(pts[0][1],pts[1][1])+r)/24);y++){const k=x+','+y;if(!this.map.has(k))this.map.set(k,[]);this.map.get(k).push(e);}}
 }
 query(p,d,padding=5){const found=new Set();for(let x=Math.floor((Math.min(p[0],p[0]+d[0])-padding)/24);x<=Math.floor((Math.max(p[0],p[0]+d[0])+padding)/24);x++)for(let y=Math.floor((Math.min(p[1],p[1]+d[1])-padding)/24);y<=Math.floor((Math.max(p[1],p[1]+d[1])+padding)/24);y++)for(const e of this.map.get(x+','+y)||[])found.add(e);return found;}
}
// VPX XY flipper equations are kept in their own GPL-3.0-or-later module.
const flipperSurface=VpxFlipper.surface,vpxFlipperResponse=VpxFlipper.response,moveVpxFlipper=VpxFlipper.move;
function vpxFlipperHit(p,v,f,radius,offset,dt,c=CONFIG){
 const hit=VpxFlipper.hit(p,v,f,radius,offset,dt,c);if(hit)return hit;
 const base=circleHit(p,mul(v,dt),f.pivot,radius+f.radii[0]);
 if(!base||dot(v,base.n)>=0)return null;
 return {...base,t:Math.max(0,base.t),position:add(p,mul(v,Math.max(0,base.t)*dt)),angularVelocity:0};
}
// PINBALL.DAT: ball/500=.3, table/305=[25,.5,pi/2], table/701=.2.
// World distance and velocity are multiplied by 21; time is still seconds.
const CONFIG={
 physicsModel:'legacy',step:1/60,speedScale:1,worldScale:21,ballRadius:.3*21,maxSpeed:.3*200*21,
 gravity:25*21*Math.sin(.5),verticalGravity:25*21,drag:.2,rampDrag:.2,rampHeight:22,
 elasticity:.5,collisionSmoothness:.8,roughWallElasticity:.6,roughWallSmoothness:.6,
 bumperElasticity:.6,bumperSmoothness:.95,bumperBoost:17*21,upperBumperBoost:12*21,bumperThreshold:2.5*21,bumperCooldown:.1,
 activeElasticity:.6,activeSmoothness:.95,activeBoost:18*21,activeThreshold:1*21,
 flipperSeconds:.04,flipperReturnSeconds:.08,flipperElasticity:.75,flipperSmoothness:.5,flipperBoostScale:.9,
 kickbackSpeed:55*21,wellPull:30*21,wellDrag:1
};
class CoreGame {
 constructor(g){this.g=g;this.random=Math.random;this.config={...CONFIG,ballRadius:g.ball_radius};this.vpxConfig={...VpxPhysics.CONFIG,ballRadius:g.ball_radius,vpxLengthScale:g.ball_radius/25};this.vpxParameters=VpxPhysics.parameters(this.vpxConfig);this.arcadeConfig={...ArcadePhysics.CONFIG,ballRadius:g.ball_radius};this.arcadeParameters=ArcadePhysics.parameters(this.arcadeConfig);this.input={left:false,right:false,launch:false};this.events=[];this.onEvent=null;this.time=0;this.paused=false;this.cooldowns=new Map();this.grids={};this.build();this.buildGuidedTracks();this.reset();}
 get physics(){return this.config.physicsModel==='arcade'?this.arcadeParameters:this.config.physicsModel==='vpx2d'?this.vpxParameters:this.config;}
 // Map subclasses supply geometry and rules; the engine owns integration/CCD.
 edgeEnabled(){return true;}
 handleCollision(){return false;}
 activeBoost(){return this.physics.activeBoost;}
 collisionEffect(){}
 rulesInterrupted(){return false;}
 mapEvent(){}
 onCapture(){}
 beforeStep(){return true;}
 tickRules(){}
 flagSensors(previous,previousLayer){const b=this.ball;if(previousLayer!==b.layer||b.state!=='playing')return;
  const parts=b.layer==='top'?this.g.top_parts:b.layer==='tavern'?this.g.upper_parts:this.g.lower;
  for(const flag of (parts||[]).filter(o=>o.kind==='flag')){const [a,z]=flag.points,axis=sub(z,a),from=cross(axis,sub(previous,a)),to=cross(axis,sub(b.p,a));
   if(!((from<0&&to>=0)||(from>0&&to<=0)))continue;const q=mix(previous,b.p,from/(from-to)),along=dot(sub(q,a),axis)/dot(axis,axis);
   if(along<0||along>1||(this.cooldowns.get(flag.id)||0)>this.time)continue;
   this.scoreHit(flag.id,500);this.emit('flag-hit',{id:flag.id});
  }
 }
 afterBallStep(){}
 afterSubstep(){}
 handleBallState(){return false;}
 resetMapBall(){}
 visualPlane(ball){return ball.layer;}
 get held(){return this.ball.held;}
 set held(value){this.ball.held=value;}
 get lastPortal(){return this.ball.lastPortal??-10;}
 set lastPortal(value){this.ball.lastPortal=value;}
 get trail(){return this.ball.trail||(this.ball.trail=[]);}
 set trail(value){this.ball.trail=value;}
 emit(type,data={}){this.mapEvent(type,data);const e={type,time:this.time,...data};this.events.push(e);if(this.events.length>200)this.events.shift();if(this.onEvent)this.onEvent(e);}
 scoreHit(id,points,cooldown=.12){if((this.cooldowns.get(id)||0)>this.time)return;this.cooldowns.set(id,this.time+cooldown);if(this.scoringEnabled!==false){this.score+=points;this.emit('score',{id,points,position:[...this.ball.p]});}this.recordTarget(id);}
 reset(){this.arcadeRemainder=0;this.vpxRemainder=0;this.score=0;this.extraLives=0;this.ballNumber=1;this.hasLaunchedOnce=false;this.gameOver=false;this.time=0;this.events=[];this.cooldowns.clear();this.input.left=this.input.right=this.input.launch=false;this.charge=0;this.paused=false;this.newBall();this.emit('new-game');}
 launchLayer(){return this.g.plunger.layer||'lower';}
 launchHeight(){return this.launchLayer()==='top'?this.physics.rampHeight*2:this.launchLayer()==='tavern'?this.physics.rampHeight:0;}
 newBall(preserveTable=false){this.lifeLaunched=false;this.ball={p:[this.g.plunger.x,this.g.plunger.rest_y-this.physics.ballRadius],v:[0,0],layer:this.launchLayer(),z:this.launchHeight(),state:'ready',immunity:0,saverAvailable:true};this.balls=[this.ball];if(!preserveTable)this.resetMapBall();this.plungerReleasedAt=-10;this.plungerReleaseCharge=0;this.charge=0;this.chargeElapsed=0;this.nudges=0;this.drainTimer=0;this.lastPortal=-10;this.trail=[];if(preserveTable){for(const gate of this.gates){gate.pending=false;gate.pendingBall=null;if(gate.id==='shooter-return')gate.closed=false;}}else{this.resetGates();this.resetTargets();for(const f of this.flippers){f.angle=f.rest;f.omega=0;f.cadet=null;VpxFlipper.reset(f);}}}
 limitSpeed(){if(this.config.physicsModel==='arcade'){const speed=len(this.ball.v),cap=this.arcadeConfig.arcadeMaxSpeed;if(speed>cap)this.ball.v=mul(this.ball.v,cap/speed);return;}if(this.config.physicsModel==='vpx2d')return;const speed=len(this.ball.v),cap=Math.min(this.ball.speedLimit||this.config.maxSpeed,this.config.maxSpeed);if(speed>cap)this.ball.v=mul(this.ball.v,cap/speed);}
 chargePower(seconds){const p=this.g.plunger,step=p.charge_step_seconds||0,duration=p.charge_seconds||1;return clamp(step?(Math.floor(seconds/step)+1)*step/duration:seconds/duration,0,1);}
 launch(power=.7){if(this.ball.state!=='ready'||this.gameOver)return;if(this.ball.saverAvailable&&this.ball.saverUntil===undefined)this.ball.saverUntil=this.time+(this.g.gameplay?.ball_saver_seconds||0);this.lifeLaunched=true;this.hasLaunchedOnce=true;this.plungerReleasedAt=this.time;power=clamp(power,0,1);this.plungerReleaseCharge=power;this.ball.state='playing';const p=this.g.plunger,speed=p.launch_min!==undefined?p.launch_min+(p.launch_max-p.launch_min)*power:(640+180*power)*this.physics.speedScale;if(this.config.physicsModel!=='legacy')delete this.ball.speedLimit;else this.ball.speedLimit=this.config.maxSpeed;this.ball.v=[0,-speed*(this.config.physicsModel!=='legacy'?1:1+this.random()*.1)];this.limitSpeed();this.emit('launch',{power,speed:len(this.ball.v)});}
 nudge(){if(this.gameOver||this.ball.state!=='playing')return;if(this.nudges>=3){this.emit('tilt');return;}this.nudges++;this.ball.v=add(this.ball.v,this.config.physicsModel==='arcade'?[(this.nudges%2?32:-32),-65]:this.config.physicsModel==='vpx2d'?[(this.nudges%2?1:-1)*this.vpxConfig.vpxNudgeX*this.vpxConfig.vpxLengthScale*100,-this.vpxConfig.vpxNudgeY*this.vpxConfig.vpxLengthScale*100]:[(this.nudges%2?32:-32)*this.physics.speedScale,-65*this.physics.speedScale]);this.limitSpeed();this.emit('nudge');}
 setBall(p,v=[0,0],layer='lower'){this.ball={p:[...p],v:[...v],layer,z:layer==='lower'?0:22,state:'playing',immunity:0};this.balls=[this.ball];this.gameOver=false;this.paused=false;this.lastPortal=-10;this.limitSpeed();}
 resetGates(){this.gates=this.g.one_way_gates.map(g=>({...g,n:unit(g.normal),closed:false,pending:false,unlocked:false}));}
 updateGates(previous,previousLayer){const b=this.ball,r=this.physics.ballRadius;if(previousLayer!==b.layer)return;
  for(const g of this.gates){if(g.unlocked||g.mechanic==='directional_flap'||g.closed||g.layer!==b.layer)continue;const [a,z]=g.points,from=dot(sub(previous,a),g.n),to=dot(sub(b.p,a),g.n);
   if(from<=0&&to>0){const q=mix(previous,b.p,-from/(to-from)),near=nearest(q,a,z);if(len(sub(q,near.p))<.02){g.pending=true;g.pendingBall=b;}}
   if(to<0&&g.pendingBall===b)g.pending=false;
   if(g.pending&&g.pendingBall===b&&to>r+.12&&!this.balls.some(other=>other!==b&&other.state!=='drained'&&other.layer===b.layer&&len(sub(other.p,nearest(other.p,a,z).p))<r+.12)){g.closed=true;g.pending=false;this.emit('gate-closed',{id:g.id});}}
 }
 gravityRegionAt(position,layer){
  for(let i=(this.g.gravity_zones||[]).length-1;i>=0;i--){const zone=this.g.gravity_zones[i];
   if(zone.layer!==layer||Math.abs(position[0]-zone.x)>zone.width/2||Math.abs(position[1]-zone.y)>zone.height/2)continue;
   if(zone.points&&!inside(position,zone.points)&&!zone.points.some((p,i)=>len(sub(position,nearest(position,p,zone.points[(i+1)%zone.points.length]).p))<=EPS))continue;
   return zone;
  }return null;
 }
 gravityAt(position,layer){
  const zone=this.gravityRegionAt(position,layer);if(!zone)return null;
  return zone.slopeAngle===undefined?[...zone.acceleration]:this.config.physicsModel!=='legacy'?slopeAcceleration(zone.slopeAngle,zone.acceleration,this.physics.verticalGravity):mul(zone.acceleration,this.physics.verticalGravity*Math.sin(zone.slopeAngle*Math.PI/180));
 }
 supportGravityAt(position,layer){const zone=this.gravityRegionAt(position,layer),angle=zone?.slopeAngle??this.vpxConfig.vpxTableSlope;return this.physics.verticalGravity*Math.cos(angle*Math.PI/180);}
 buildGuidedTracks(){
  this.guidedTracks=(this.g.guided_tracks||[]).map(track=>{const distances=[0];for(let i=1;i<track.points.length;i++)distances.push(distances.at(-1)+len(sub(track.points[i],track.points[i-1])));return {...track,distances,length:distances.at(-1),entry:unit(sub(track.points[1],track.points[0])),exit:unit(sub(track.points.at(-1),track.points.at(-2)))};});
 }
 guidedTrackHit(p,d){
  const b=this.ball;if(b.layer!=='lower'||len(d)<=EPS||this.time<(b.trackImmuneUntil||0))return null;
  let best=null;
  for(const track of this.guidedTracks){
   // The mouth catches from every direction; only the entrance is at table level.
   const radius=track.width/2,delta=sub(p,track.points[0]);
   const hit=len(delta)<=radius?{t:0}:circleHit(p,d,track.points[0],radius);
   if(!hit)continue;
   const t=clamp(hit.t,0,1);
   if(!best||t<best.t)best={t,track};
  }
  return best;
 }
 enterGuidedTrack(track){
  const b=this.ball,speed=track.ballSpeed>0?track.ballSpeed:b.state==='guided'?b.track.speed:len(b.v);b.state='guided';b.layer='guided';b.z=this.physics.rampHeight;b.track={id:track.id,distance:0,speed};b.p=[...track.points[0]];b.v=mul(track.entry,speed);b.trail=[];b.launchGuard=false;
  this.emit('track-enter',{id:track.id});
 }
 advanceGravityTrack(dt){
  const b=this.ball;
  while(dt>EPS){
   const track=this.guidedTracks.find(t=>t.id===b.track.id),speed=b.track.speed;
   // A reversing ball uses the segment before a joint, not the one after it.
   let i=1;while(i<track.distances.length-1&&(speed<0?track.distances[i]<b.track.distance-EPS:track.distances[i]<=b.track.distance+EPS))i++;
   const start=track.points[i-1],end=track.points[i],tangent=unit(sub(end,start)),span=track.distances[i]-track.distances[i-1];
   const gravity=this.gravityAt(b.p,track.layer||'lower')||[0,this.physics.gravity],acceleration=dot(gravity,tangent);
   const direction=Math.sign(speed)||Math.sign(acceleration)||1,boundary=track.distances[direction<0?i-1:i],distance=boundary-b.track.distance;
   let boundaryTime=Infinity;
   if(Math.abs(acceleration)>EPS){const square=speed*speed+2*acceleration*distance;
    if(square>=0){const roots=[(-speed+Math.sqrt(square))/acceleration,(-speed-Math.sqrt(square))/acceleration].filter(t=>t>EPS);if(roots.length)boundaryTime=Math.min(...roots);}
   }else if(speed*distance>0)boundaryTime=distance/speed;
   const turnTime=speed*acceleration<0?-speed/acceleration:Infinity,h=Math.min(dt,1/240,boundaryTime,turnTime);
   b.track.distance=clamp(b.track.distance+speed*h+.5*acceleration*h*h,0,track.length);
   b.track.speed=h===turnTime?0:speed+acceleration*h;dt-=h;
   b.p=mix(start,end,span?(b.track.distance-track.distances[i-1])/span:0);b.v=mul(tangent,b.track.speed);
   const atStart=b.track.distance<=EPS&&b.track.speed<0,atEnd=b.track.distance>=track.length-EPS&&b.track.speed>0;
   if(!atStart&&!atEnd)continue;
   const next=atEnd?this.guidedTracks.filter(t=>t.id!==track.id&&len(sub(t.points[0],b.p))<=1&&dot(track.exit,t.entry)>=-EPS).sort((a,z)=>dot(track.exit,z.entry)-dot(track.exit,a.entry)||a.id.localeCompare(z.id))[0]:null;
   this.emit('track-exit',{id:track.id,connected:!!next});
   if(next){this.enterGuidedTrack(next);if(next.ballSpeed>0)return this.advanceGuidedTrack(dt);continue;}
   b.state='playing';b.layer=track.layer||'lower';b.z=b.layer==='top'?this.physics.rampHeight*2:b.layer==='tavern'?this.physics.rampHeight:0;b.regionPrevious=null;b.trackImmuneUntil=this.time+.1;b.relocatedFrom=[...b.p];delete b.track;return dt;
  }
  return 0;
 }
 advanceGuidedTrack(dt){
  const b=this.ball,current=this.guidedTracks.find(t=>t.id===b.track.id);
  if(!(current.ballSpeed>0)&&(this.config.physicsModel!=='legacy'||(this.g.gravity_zones||[]).some(z=>z.layer===(current.layer||'lower'))))return this.advanceGravityTrack(dt);
  while(dt>EPS){
   const track=this.guidedTracks.find(t=>t.id===b.track.id);
   let i=1;while(i<track.distances.length-1&&track.distances[i]<=b.track.distance)i++;
   const a=track.points[i-1],z=track.points[i],span=track.distances[i]-track.distances[i-1];
   // Integrate each sampled segment so gravity follows the downhill tangent.
   const acceleration=track.ballSpeed>0?0:this.physics.gravity*Math.max(0,span?(z[1]-a[1])/span:0),speed=b.track.speed,distance=track.distances[i]-b.track.distance;
   const remaining=acceleration>0?2*distance/(speed+Math.sqrt(speed*speed+2*acceleration*distance)):speed>0?distance/speed:Infinity,used=Math.min(dt,remaining);
   b.track.distance=used===remaining?track.distances[i]:b.track.distance+speed*used+.5*acceleration*used*used;
   b.track.speed+=acceleration*used;dt-=used;
   b.p=mix(a,z,span?(b.track.distance-track.distances[i-1])/span:0);b.v=mul(unit(sub(z,a)),b.track.speed);
   if(b.track.distance<track.length-EPS)continue;
   const next=this.guidedTracks.filter(t=>t.id!==track.id&&len(sub(t.points[0],b.p))<=1&&dot(track.exit,t.entry)>=-EPS).sort((a,z)=>dot(track.exit,z.entry)-dot(track.exit,a.entry)||a.id.localeCompare(z.id))[0];
   this.emit('track-exit',{id:track.id,connected:!!next});
   if(next){this.enterGuidedTrack(next);continue;}
   b.state='playing';b.layer='lower';b.z=0;b.regionPrevious=null;b.trackImmuneUntil=this.time+.1;b.relocatedFrom=[...b.p];delete b.track;return dt;
  }
  return 0;
 }
 collide(dt){
  if(this.config.physicsModel==='arcade'){ArcadePhysics.collide(this,dt);return;}
  const b=this.ball,r=this.physics.ballRadius;let remaining=dt;
  if(this.config.physicsModel!=='vpx2d'){b.slingshotContacts??=new Map();
  for(const [id,state]of b.slingshotContacts){const edges=(this.edges?.[b.layer]||[]).filter(e=>e.id===id&&e.slingshot&&e.slingshotFace&&this.edgeEnabled(e));if(!edges.some(e=>len(sub(b.p,nearest(b.p,e.a,e.b).p))<=r+(e.thickness||0)/2+.2))state.released=true;}}
  const contactFlippers=new Set(),contactEdges=new Set();
  for(let pass=0;pass<10&&remaining>1e-6;pass++){
   this.limitSpeed();
   const d=mul(b.v,remaining),portal=this.portalHit(b.p,d),trackHit=this.guidedTrackHit(b.p,d);let best=null;
   for(const e of [...this.grids[b.layer].query(b.p,d,Math.max(5,r)),...this.dynamicEdges()]){
    if(this.targetHits.has(e.id))continue;
    if((e.kind==='plunger'||e.kind==='rescue-kicker')&&d[1]<=0)continue;
    if(!this.edgeEnabled(e)||contactEdges.has(e))continue;
    // A flap passes forward travel; it blocks reverse travel only after the
    // complete ball has crossed, so it cannot close through a straddling ball.
    if(e.retractUp&&(b.v[1]<0||b.p[1]>e.c[1]))continue;
    if(e.n&&(dot(d,e.n)>=-EPS||dot(sub(b.p,e.a),e.n)<r-.08))continue;
   const h=this.config.physicsModel==='vpx2d'?(e.c?VpxPhysics.hitCircle(b.p,b.v,e.c,e.r,r,remaining,this.physics):VpxPhysics.hitLine(b.p,b.v,e.a,e.b,r,remaining,this.physics,e.faceOnly,e.thickness||0,e.vpxSide||0)):e.c?circleHit(b.p,d,e.c,r+e.r):segmentHit(b.p,d,e.a,e.b,r+(e.thickness||0)/2);
    // A lane's launch face must not catch balls on its rounded end caps
    // through the adjacent divider. Check the impact, not the frame start.
    if(h&&e.faceOnly){const q=h.position||add(b.p,mul(d,h.t)),axis=sub(e.b,e.a),along=dot(sub(q,e.a),axis);if(along<0||along>dot(axis,axis))continue;}
    if(h&&(!best||h.t<best.t))best={...h,e};
   }
   for(const f of this.flippers){
    if(b.layer!==(f.layer||'lower')||contactFlippers.has(f))continue;
    if(this.config.physicsModel!=='vpx2d'&&!f.cadet)f.cadet=new CadetFlipper(f,this.config);
    const h=this.config.physicsModel==='vpx2d'?vpxFlipperHit(b.p,b.v,f,r,dt-remaining,remaining,this.physics):f.cadet.find(b.p,b.v,(this.collisionTime??this.time)+dt-remaining,remaining);
    if(h&&(!best||h.t<best.t))best={...h,e:{id:f.id,kind:'flipper',f}};
   }
   if(trackHit&&(!best||trackHit.t<=best.t+1e-5)&&(!portal||trackHit.t<=portal.t)){this.enterGuidedTrack(trackHit.track);remaining=this.advanceGuidedTrack(remaining*(1-trackHit.t));if(b.state==='guided')return;continue;}
   if(portal&&(!best||portal.t<=best.t+1e-5)){b.p=add(b.p,mul(d,portal.t));remaining*=1-portal.t;this.transition(portal);if(b.state!=='playing')return;continue;}
   if(!best){b.p=add(b.p,d);break;}
   const hitDistance=best.distance??len(d)*best.t,incomingSpeed=len(b.v);
   b.p=best.position||add(add(b.p,mul(d,best.t)),mul(best.n,best.depth+.012));
   const e=best.e;if(e.kind==='plunger'&&b.v[1]>0&&best.n[1]<-.5){b.state='ready';b.v=[0,0];b.p[1]=this.g.plunger.rest_y-r;this.charge=0;this.chargeElapsed=0;this.emit('plunger-ready');return;}
   if(this.handleCollision(e)){if(b.state!=='playing')return;remaining-=this.config.physicsModel==='vpx2d'?remaining*clamp(best.t,0,1):(len(b.v)>1e-9?Math.abs(hitDistance/len(b.v)):remaining);continue;}
   const approach=Math.abs(dot(b.v,best.n)),restingRail=e.kind==='rail'&&!e.mechanic&&approach<5,active=e.kind==='active'||e.mechanic==='active_rebound',c=this.physics,sling=c.physicsModel==='vpx2d'?e.vpxSlingshot===true&&best.part!=='endcap':e.slingshot;
   let boost=0,threshold=1e9,elasticity=c.physicsModel==='vpx2d'?c.vpxElasticity:e.material==='roughWall'?c.roughWallElasticity:c.elasticity,smoothness=c.physicsModel==='vpx2d'?0:e.material==='roughWall'?c.roughWallSmoothness:c.collisionSmoothness;
   if(e.kind==='bumper'&&c.physicsModel!=='vpx2d'){boost=(e.material==='upperBumper'?c.upperBumperBoost:c.bumperBoost)*(e.bumperStrength==='strong'?1:.5);threshold=(this.bumperHitUntil.get(e.id)||0)>this.time?1e9:c.bumperThreshold;elasticity=c.bumperElasticity;smoothness=c.bumperSmoothness;}
   if(e.kind==='bumper'&&c.physicsModel==='vpx2d'){boost=c.vpxBumperForce*c.vpxLengthScale*100;elasticity=c.vpxBumperElasticity;threshold=c.vpxBumperThreshold*c.vpxLengthScale*100;}
   if(c.physicsModel!=='vpx2d'&&active&&(!e.slingshot||e.slingshotFace)){boost=c.activeBoost*(e.reboundStrength==='strong'?1:.5);threshold=c.activeThreshold;elasticity=c.activeElasticity;smoothness=c.activeSmoothness;}
   if(e.kind==='flipper'&&c.physicsModel!=='vpx2d')({boost,threshold,elasticity,smoothness}=e.f.cadet.response());
   {let slingFired=false;
    if(e.kind==='flipper'&&c.physicsModel==='vpx2d'){
     const time=dt-remaining+best.t*remaining;
     if(best.isContact){VpxFlipper.contact(b,e.f,best.n,c,remaining*(1-best.t),this.field().a,best.angularVelocity,best.gap||0);contactFlippers.add(e.f);}
     else if(vpxFlipperResponse(b,e.f,best.n,c,best.angularVelocity,best.gap||0)>0)this.emit('flipper-hit',{id:e.id});
     VpxFlipper.react(e.f,time,c);
    }else if(c.physicsModel==='vpx2d'&&best.isContact){VpxPhysics.contact(b,best.n,this.field().a,remaining*(1-best.t),sling?c.vpxSlingFriction:e.kind==='bumper'?c.vpxBumperFriction:c.vpxWallFriction,c,best.orgNormalVelocity);contactEdges.add(e);
    }else if(sling){const normalSpeed=dot(b.v,best.n),tangent=sub(b.v,mul(best.n,normalSpeed)),state=c.physicsModel==='vpx2d'?null:b.slingshotContacts.get(e.id);
     slingFired=e.slingshotFace&&normalSpeed<=-(c.physicsModel==='vpx2d'?c.vpxSlingThreshold*c.vpxLengthScale*100:EPS)&&(c.physicsModel==='vpx2d'||!state||state.released&&this.time>=state.readyAt);
     if(c.physicsModel==='vpx2d'){const out=VpxPhysics.slingshot(b,e,best.n,c,slingFired,best.gap||0);b.v=out.velocity;b.spin=out.spin;if(out.positionShift)b.p=add(b.p,out.positionShift);}else b.v=add(mul(tangent,smoothness),mul(best.n,Math.max(0,-normalSpeed)*elasticity+(slingFired?boost:0)));
     if(slingFired){if(c.physicsModel==='vpx2d'){const previous=b.vpxLastSlingEventPosition||[0,0],distance=dot(sub(previous,b.p),sub(previous,b.p));b.vpxLastSlingEventPosition=[...b.p];if(distance>.25*c.vpxLengthScale*c.vpxLengthScale)this.emit('slingshot-hit',{id:e.id});}else {b.slingshotContacts.set(e.id,{released:false,readyAt:this.time+.1});this.emit('slingshot-hit',{id:e.id});}}
    }else if(c.physicsModel==='vpx2d'){
     const bumper=e.kind==='bumper',out=VpxPhysics.collision(b.v,best.n,b.spin||0,r,bumper?c.vpxBumperElasticity:c.vpxElasticity,bumper?c.vpxBumperFriction:c.vpxWallFriction,bumper?0:c.vpxElasticityFalloff,c.vpxLengthScale,threshold,boost,best.gap||0);
     b.v=out.velocity;b.spin=out.spin;if(out.positionShift)b.p=add(b.p,out.positionShift);
    }else if(restingRail){
     // Resting contact is sliding, not a new impact every gravity substep.
     // Apply surface damping per second, preserving gravity's tangent motion.
     b.v=mul(sub(b.v,mul(best.n,dot(b.v,best.n))),Math.pow(smoothness,remaining));b.p=add(b.p,mul(best.n,.012));
    }else b.v=basicCollision(b.v,best.n,elasticity,smoothness,threshold,boost);
    if(!best.isContact&&(!sling||slingFired))this.collisionEffect(e,approach);
    // TBumper::Fire disables its booster until the 0.1-second timer expires.
    if(!best.isContact&&e.kind==='bumper'&&approach>threshold){if(c.physicsModel!=='vpx2d')this.bumperHitUntil.set(e.id,this.time+c.bumperCooldown);this.scoreHit(e.id,500*this.bumperLevel(e.id),c.physicsModel==='vpx2d'?.1:c.bumperCooldown);}
    if(!best.isContact&&(!sling||slingFired)&&(active||e.kind==='rebound'||e.kind==='target'))this.scoreHit(e.id,500);
    if(e.kind==='flipper'&&boost>10)this.emit('flipper-hit',{id:e.id});
   }
   // pb::collide consumes distance / POST-collision speed; clamp at the next ray.
   remaining-=c.physicsModel==='vpx2d'?remaining*clamp(best.t,0,1):e.slingshot||restingRail?(incomingSpeed>1e-9?Math.max(0,hitDistance)/incomingSpeed:remaining):(len(b.v)>1e-9?Math.abs(hitDistance/len(b.v)):remaining);
   if(this.rulesInterrupted())return;
  }
 }
 capture(id,p,release,layer,direction,points){const b=this.ball;if(this.time<b.immunity||b.state!=='playing'||this.balls.some(other=>other!==b&&other.state==='captured'&&other.held?.id===id))return;
  this.held={id,remaining:.65,speed:len(b.v),incoming:[...b.v],release,layer,direction};b.p=[...p];b.state='captured';this.scoreHit(id,points);this.emit('capture',{id});this.onCapture(id);
 }
 release(){const h=this.held,b=this.ball;let speed=this.config.physicsModel!=='legacy'?this.physics.kickbackSpeed:clamp(h.speed*.68+90*this.physics.speedScale,160*this.physics.speedScale,380*this.physics.speedScale);b.p=[...h.release];b.layer=h.layer;b.z=0;
  b.v=mul(unit(h.direction),speed);
  b.state='playing';b.immunity=this.time+.5;this.held=null;this.limitSpeed();this.emit('release',{id:h.id,speed});}
 drain(){if(this.ball.state!=='playing')return;const b=this.ball;if(b.saverAvailable&&this.time<b.saverUntil){b.saverAvailable=false;b.state='saver-return';b.v=[0,0];b.saveReturnAt=this.time+.35;this.emit('ball-saved');return;}this.ball.state='drained';this.drainTimer=1.1;this.emit('drain');}
 selectBall(){this.ball=this.balls.find(b=>b.state==='ready')||this.balls.find(b=>b.state==='playing')||this.balls.find(b=>b.state!=='drained')||this.balls[0];}
 collideBalls(){const r=this.physics.ballRadius;
  const clear=(p,layer,ball)=>[...this.grids[layer].query(p,[0,0],Math.max(5,r))].every(e=>!this.edgeEnabled(e,ball)||(e.c?len(sub(p,e.c))>=r+e.r-.01:len(sub(p,nearest(p,e.a,e.b).p))>=r+(e.thickness||0)/2-.01));
  for(let i=0;i<this.balls.length;i++)for(let j=i+1;j<this.balls.length;j++){const a=this.balls[i],b=this.balls[j];
   if(a.state!=='playing'||b.state!=='playing'||a.layer!==b.layer||Math.abs(a.z-b.z)>2*r)continue;
   const delta=sub(b.p,a.p),distance=len(delta);if(distance>=2*r)continue;const n=distance>EPS?mul(delta,1/distance):[1,0],closing=dot(sub(b.v,a.v),n);
   if(this.config.physicsModel==='vpx2d'){const out=VpxPhysics.ballCollision(a.v,b.v,n,distance-2*r,this.physics);if(out){a.v=out.a;b.v=out.b;a.p=sub(a.p,out.shift);b.p=add(b.p,out.shift);}continue;}
   if(closing<0){const impulse=mul(n,-closing*.95);a.v=sub(a.v,impulse);b.v=add(b.v,impulse);}
   const shift=mul(n,(2*r-distance+.012)/2),pa=sub(a.p,shift),pb=add(b.p,shift);
   if(clear(pa,a.layer,a))a.p=pa;if(clear(pb,b.layer,b))b.p=pb;
   if(this.config.physicsModel!=='vpx2d')for(const ball of [a,b]){const speed=len(ball.v),cap=this.config.physicsModel==='arcade'?this.physics.maxSpeed:Math.min(ball.speedLimit||this.config.maxSpeed,this.config.maxSpeed);if(speed>cap)ball.v=mul(ball.v,cap/speed);}
  }
 }
 step(dt=this.physics.step){
  const frameTime=this.time;
  if(this.config.physicsModel==='arcade'){
   if(this.paused||this.gameOver)return;const h=1/240;this.arcadeRemainder=(this.arcadeRemainder||0)+dt;
   while(this.arcadeRemainder>=h-1e-12){this.arcadeRemainder=Math.max(0,this.arcadeRemainder-h);this.stepFrame(h);if(this.paused||this.gameOver){this.arcadeRemainder=0;break;}}
  }else if(this.config.physicsModel==='vpx2d'){
   if(this.paused||this.gameOver)return;
   this.vpxRemainder=(this.vpxRemainder||0)+dt;
   while(this.vpxRemainder>=.001-1e-12){this.vpxRemainder=Math.max(0,this.vpxRemainder-.001);this.stepFrame(.001);if(this.paused||this.gameOver){this.vpxRemainder=0;break;}}
  }else {this.vpxRemainder=0;this.stepFrame(dt);}
  if(this.time!==frameTime)for(const b of this.balls)if(b.state==='playing'){b.trail||=[];b.trail.push({p:[...b.p],layer:b.layer});if(b.trail.length>24)b.trail.shift();}
 }
 stepFrame(dt){if(this.paused||this.gameOver||this.beforeStep(dt)===false)return;this.time+=dt;this.tickRules(dt);
  if(this.balls.every(b=>b.state==='drained')&&!this.freeBallQueue){this.drainTimer-=dt;if(this.drainTimer<=0){if(this.extraLives>0){this.extraLives--;this.newBall(this.preserveTableOnDrain);this.emit('ready');}else if(this.ballNumber>=3){this.gameOver=true;this.emit('game-over');}else {this.ballNumber++;this.newBall(this.preserveTableOnDrain);this.emit('ready');}}return;}
  for(const b of this.balls)if(b.state==='saver-return'&&this.time>=b.saveReturnAt){
   const spawn=[this.g.plunger.x,this.g.plunger.rest_y-this.physics.ballRadius];
   if(this.balls.some(other=>other!==b&&other.state!=='drained'&&other.state!=='saver-return'&&other.layer===this.launchLayer()&&(other.state==='ready'||len(sub(other.p,spawn))<this.physics.ballRadius*2+3)))continue;
   Object.assign(b,{p:spawn,v:[0,0],state:'ready',layer:this.launchLayer(),z:this.launchHeight(),trail:[],immunity:0,lastPortal:-10,regionPrevious:null,vortexDwell:0});
   this.charge=this.chargeElapsed=0;this.input.launch=false;
   const gate=this.gates.find(g=>g.id==='shooter-return');if(gate){gate.closed=false;gate.pending=false;gate.pendingBall=null;}
   this.emit('ball-save-ready');
  }
  const ready=this.balls.find(b=>b.state==='ready');if(ready){if(this.input.launch){const duration=this.g.plunger.charge_seconds||1;this.chargeElapsed=clamp((this.chargeElapsed||0)+dt,0,duration);this.charge=this.chargePower(this.chargeElapsed);}ready.p[1]=this.g.plunger.rest_y-this.physics.ballRadius+this.g.plunger.stroke*this.charge;}
  const frameStart=this.time-dt;
  for(let i=0;i<this.flippers.length;i++){
   const f=this.flippers[i];if(this.config.physicsModel==='arcade'){ArcadePhysics.move(f,!!this.input[f.control||(i?'right':'left')],dt,this.physics);continue;}if(this.config.physicsModel==='vpx2d'){moveVpxFlipper(f,!!this.input[f.control||(i?'right':'left')],dt,this.physics);continue;}if(!f.cadet)f.cadet=new CadetFlipper(f,this.config);else f.cadet.configure(this.config);
   f.cadet.motion(!!this.input[f.control||(i?'right':'left')],frameStart);
   const old=f.angle;f.angle=f.rest-f.cadet.angle(this.time);f.omega=(f.angle-old)/dt;
  }
  // pb::timed_frame: velocity += (sum of fields) * dt, without exponential drag.
  for(const b of this.balls)if(b.state==='playing'){
   this.ball=b;this.syncRegion();const {a,drag}=this.field();if(this.config.physicsModel==='vpx2d')VpxPhysics.accelerate(b,a,this.supportGravityAt(b.p,b.layer),dt,this.physics);else b.v=add(b.v,mul(sub(a,mul(b.v,drag)),dt));this.limitSpeed();
  }
  // One continuous collision loop per ball per frame (pb::timed_frame).
  // Extra spatial substeps reset flipper edge suppression and apply duplicate boosts.
  const count=1,h=dt;
  for(let k=0;k<count;k++){
   this.collisionTime=frameStart+k*h;
   for(const b of [...this.balls]){this.ball=b;let ballStep=h;
    if(b.state==='guided'){ballStep=this.advanceGuidedTrack(h);if(b.state==='guided')continue;}
    if(this.handleBallState(h))continue;
    if(b.state==='captured'){this.held.remaining-=h;if(this.held.remaining<=0)this.release();continue;}
    if(b.state!=='playing')continue;
    this.syncRegion();const previous=[...b.p],layer=b.layer;this.collide(ballStep);if(this.rulesInterrupted())return;if(b.state==='guided')continue;const sensorStart=b.relocatedFrom||previous;delete b.relocatedFrom;this.updateGates(sensorStart,layer);this.flagSensors(sensorStart,layer);this.afterBallStep(sensorStart,layer,h);this.limitSpeed();
   }
   this.collideBalls();this.afterSubstep();
  }
  this.collisionTime=null;
  if(this.balls.some(b=>b.state!=='drained'))this.balls=this.balls.filter(b=>b.state!=='drained');this.selectBall();
 }
 advance(seconds){for(let t=0;t<seconds;t+=this.physics.step)this.step(Math.min(this.physics.step,seconds-t));}
}
const api={ARCADE_CONFIG:ArcadePhysics.CONFIG,VPX_CONFIG:VpxPhysics.CONFIG,CoreGame,Grid,EPS,clamp,cross,CONFIG,taperedGeometry,taperedOutline,taperedHit,basicCollision,vpxCollision,slopeAcceleration,flipperSurface,vpxFlipperResponse,moveVpxFlipper,vpxFlipperHit,segmentHit,circleHit,inside,nearest,unit,sub,add,mul,dot,len,mix};
// Compatibility for existing consumers; new maps subclass CoreGame directly.
let defaultGame;Object.defineProperty(api,'Game',{get(){if(!defaultGame){const map=typeof module!=='undefined'&&module.exports?require('./table-mechanics.js'):root.TableMechanics;if(!map)throw Error('Load table-mechanics.js before creating the game');defaultGame=map.createGame(api);}return defaultGame;}});
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PiratePhysics=api;
})(typeof window!=='undefined'?window:globalThis);

/* Shared ball mechanics; configured objects own gameplay rules. */
(function(root){
'use strict';
function createGame(core){
 const {CoreGame,Grid,EPS,clamp,add,sub,mul,dot,cross,len,unit,mix,nearest,inside,basicCollision}=core;
 return class TableGame extends CoreGame {
 dynamicEdges(){const p=this.g.plunger;return [...(p.enabled!==false&&this.ball.layer===(p.layer||'lower')?[{id:'plunger',kind:'plunger',faceOnly:true,a:[p.left,p.rest_y],b:[p.right,p.rest_y]}]:[]),...this.gates.filter(g=>!g.unlocked&&g.layer===this.ball.layer&&(g.closed||g.mechanic==='directional_flap')).map(g=>({a:g.points[0],b:g.points[1],id:g.id,kind:'gate',n:g.mechanic==='directional_flap'?g.n:undefined})),...(this.g.rescue_kickers||[]).filter(k=>(k.layer||'lower')===this.ball.layer).map(k=>({id:k.id,kind:'rescue-kicker',a:k.points[0],b:k.points[1],side:k.side,aim:k.aim,direction:k.direction,speed:this.physics.kickbackSpeed}))];}
 portalHit(){}
 transition(){}
 rescueState(layer='lower'){if(layer==='lower')return {available:this.kickbacks,hits:this.kickbackHits};return this.rescueLayers[layer]||(this.rescueLayers[layer]={available:{left:true,right:true},hits:{left:false,right:false}});}
 edgeEnabled(e,ball=this.ball){if(e.launchOnly&&!ball.launchGuard)return false;return !(e.kind==='rescue-kicker'&&!this.rescueState(ball.layer).available[e.side]);}
 handleCollision(e){if(e.kind!=='rescue-kicker')return false;this.triggerKickback(e.side,unit(e.direction||sub(e.aim,this.ball.p)),e.speed,e.id);return true;}
 activeBoost(){return this.physics.activeBoost;}
 collisionEffect(e,approach){
  if(e.launchOnly&&approach>0)this.ball.launchGuard=false;
  if(approach>=8)this.emit('sound',{name:'metal'});
  if((e.kind==='rebound'||e.kind==='active'||e.mechanic==='active_rebound')&&approach>0&&(this.cooldowns.get(e.id)||0)<=this.time)this.reboundHitAt.set(e.id,this.time);
 }
 rulesInterrupted(){return this.theaterFrozen||this.freezeRemaining>0;}
 visualPlane(ball){return ball.layer==='tavern'?'upper':'lower';}
 mapEvent(type,data){
  if(type==='launch')this.ball.launchGuard=true;
  if(['capture','plunger-ready','drain'].includes(type))this.ball.launchGuard=false;
  if(type==='free-ball-launch'||type==='release'&&this.sockets.some(s=>s.id===data.id&&s.mechanic==='shark-inlet'))this.sharkFlashAt=this.time;
  if(type==='flag-hit'){this.flagHitAt??=new Map();this.flagHitAt.set(data.id,this.time);}
  if(type==='capture'){this.holeCapturedAt.set(data.id,this.time);}
  if(type==='release'){this.holeReleasedAt??=new Map();this.holeReleasedAt.set(data.id,this.time);}
 }
 onCapture(){}
 beforeStep(dt){if(this.theaterFrozen||this.enemyIntroPending)return false;if(this.freezeRemaining>0){this.freezeRemaining=Math.max(0,this.freezeRemaining-dt);if(!this.freezeRemaining)this.emit('enemy-freeze-ended');return false;}return true;}
 tickRules(){this.updateTargetGroups();}
 afterBallStep(previous,layer,dt){this.sensors(dt);}
 afterSubstep(){this.spawnFreeBall();}
 resetMapBall(){this.rescueLayers={};this.kickbacks={left:true,right:true};this.centerPostRaised=false;this.centerPostHitsLeft=0;this.centerPostHitAt=-Infinity;this.centerPostHitUntil=0;this.kickbackHits={left:false,right:false};this.freeBallQueue=0;this.freeBallRewardPositions=[];this.multiballAwards=0;}
 build(){
  const g=this.g;this.launchGateExitY=Math.max(-Infinity,...[...g.lower,...g.upper_parts].filter(o=>o.collisionMode==='launch-only').flatMap(o=>(o.points||[]).map(p=>p[1])));this.reboundIds=new Set([...g.lower,...g.upper_parts].filter(o=>o.kind==='rebound'||o.kind==='active'||o.mechanic==='active_rebound').map(o=>o.id));this.flippers=g.lower.filter(o=>o.kind==='flipper').map(o=>({...o,angle:Math.atan2(o.tip[1]-o.pivot[1],o.tip[0]-o.pivot[0]),rest:Math.atan2(o.tip[1]-o.pivot[1],o.tip[0]-o.pivot[0]),up:Math.atan2(o.raised[1]-o.pivot[1],o.raised[0]-o.pivot[0]),length:len(sub(o.tip,o.pivot)),omega:0}));
  // Unwrap flipper angles across ±pi before interpolation.
  for(const f of this.flippers){const delta=f.up-f.rest;f.up=f.rest+Math.atan2(Math.sin(delta),Math.cos(delta));}
  const objectsToEdges=objects=>{const edges=[];for(const o of objects){
   if(!['wall','rail','active','rebound','bumper','test-post','target'].includes(o.kind))continue;
   const material=o.material||null;
   if(o.center){edges.push({id:o.id,c:o.center,r:o.radius,kind:o.kind,material,bumperStrength:o.bumperStrength,retractUp:o.mechanic==='retract_for_upward_ball'});continue;}
   const ps=o.points||[];let slingEdge=1;const area=o.closed===true?ps.reduce((sum,p,i)=>{const q=ps[(i+1)%ps.length];return sum+p[0]*q[1]-q[0]*p[1];},0):0,vpxSide=area>0?-1:area<0?1:0;if((o.slingshot||o.vpxSlingshot||o.kind==='active'||o.kind==='rebound'||o.mechanic==='active_rebound')&&ps.length>2)for(let i=2;i<ps.length;i++)if(len(sub(ps[i],ps[i-1]))>len(sub(ps[slingEdge],ps[slingEdge-1])))slingEdge=i;for(let i=1;i<ps.length;i++)if(len(sub(ps[i],ps[i-1]))>EPS)edges.push({id:o.id,a:ps[i-1],b:ps[i],kind:o.kind,material,mechanic:o.mechanic,reboundStrength:o.reboundStrength,slingshot:o.slingshot===true,vpxSlingshot:o.vpxSlingshot??(o.kind==='active'||o.kind==='rebound'||o.mechanic==='active_rebound'),slingshotFace:i===slingEdge,vpxSide,n:o.pass_normal,thickness:o.thickness||0,launchOnly:o.collisionMode==='launch-only'});
  }return edges;};
  this.edges={lower:objectsToEdges(g.lower),tavern:objectsToEdges(g.upper_parts)};
  for(const [layer,es]of Object.entries(this.edges))this.grids[layer]=new Grid(es);
  this.sockets=g.lower.filter(o=>o.kind==='socket');
  this.transitions=g.editor_transitions||[];

 }
 recordTarget(){}
 bumperLevel(){return 1;}
 updateTargetGroups(){for(const group of this.targetGroups){if(!group.complete||this.time<group.resetAt)continue;for(const id of group.targets)this.targetHits.delete(id);group.hits.clear();group.complete=false;this.emit('target-group-reset',{id:group.id});}}
 resetTargets(){this.sensorHitAt=new Map();this.reboundHitAt=new Map();this.sharkFlashAt=null;this.flagHitAt=new Map();this.holeReleasedAt=new Map();this.holeCapturedAt=new Map();this.enemyIntroPending=false;this.enemyActive=false;this.bumperHitUntil=new Map();this.vortexActive=false;this.vortexActivatedAt=this.vortexActive?this.time:null;this.freezeRemaining=0;this.targetHitAt=new Map();this.targetHits=new Set();this.targetGroups=[];for(const o of [...this.g.lower,...this.g.upper_parts]){if(!o.target_group)continue;let group=this.targetGroups.find(g=>g.id===o.target_group);if(!group){group={id:o.target_group,targets:[],hits:new Set(),complete:false,completions:0,resetAt:0};this.targetGroups.push(group);}group.targets.push(o.id);}}
 syncRegion(){}
 field(){
  const b=this.ball,g=this.physics,zoneGravity=this.gravityAt(b.p,b.layer);let a=zoneGravity||[0,g.gravity],drag=g.drag;
  b.z=b.layer==='top'?g.rampHeight*2:b.layer==='tavern'?g.rampHeight:0;
  if(!zoneGravity&&g.physicsModel==='legacy')a[0]+=(.5-this.random())*len(b.v)*g.drag;
  for(const well of [...this.g.lower,...this.g.upper_parts,...(this.g.top_parts||[])].filter(o=>o.kind==='field'&&o.mechanic==='gravity-well'&&o.layer===b.layer&&(o.owner?this.armedHoles?.has(o.owner):this.vortexActive))){
   const delta=sub(well.center,b.p),distance=len(delta);
   if(distance>well.radius||this.balls.some(other=>well.owner&&other.state==='captured'&&other.held?.id===well.owner))continue;
   // TKickout::FieldEffect adds its pull and velocity damping to the table field.
   if(distance>EPS)a=add(a,mul(delta,g.wellPull/distance));drag+=g.wellDrag;
  }
  return {a,drag};
 }
 sensors(){}
 triggerKickback(side,direction,speed=this.physics.kickbackSpeed,kickerId=null){
  const layer=this.ball.layer,state=this.rescueState(layer);
  if(!state.available[side])return;
  const triggerPosition=[...this.ball.p];
  {
   const kicker=this.g.rescue_kickers?.find(k=>k.side===side&&(k.layer||'lower')===layer&&(!kickerId||k.id===kickerId)),point=kicker?.launch_point||kicker?.aim;
   if(point){
    const rescueStart=[...this.ball.p];
    this.ball.p=[...point];this.ball.relocatedFrom=[...point];this.ball.regionPrevious=null;this.ball.trail=[];
    for(const gate of this.gates)if(gate.pendingBall===this.ball){gate.pending=false;gate.pendingBall=null;}
    // Close the gate after clearance, including relocated balls.
    const returnGate=this.gates.find(g=>g.side===side&&g.layer===layer&&!g.closed);
    if(returnGate){returnGate.unlocked=false;returnGate.pending=true;returnGate.pendingBall=this.ball;}
    // Apply return-flap crossing before discarding the pre-relocation position.
    this.updateGates(rescueStart,this.ball.layer);
   }
   direction=[0,-1];
  }
  direction=[0,-1];
  state.available[side]=false;if(this.config.physicsModel!=='legacy')delete this.ball.speedLimit;else this.ball.speedLimit=this.config.maxSpeed;const rebound=this.config.physicsModel!=='legacy'?mul(direction,speed):basicCollision(this.ball.v,direction,.2,.7,0,speed);
  // Both rescue launchers fire vertically, regardless of the layout aim.
  this.ball.v=[0,-len(rebound)];this.limitSpeed();
  this.emit('kickback',{side,layer,speed:len(this.ball.v)});state.hits[side]=true;this.emit('kickback-lane',{side,layer});
  if(state.hits.left&&state.hits.right)this.awardMultiball(triggerPosition,layer);
 }
 awardExtraLife(source,position=this.ball.p){const reserve=4-this.ballNumber-(this.lifeLaunched?1:0)+(this.extraLives||0);if(this.gameOver||reserve>=99)return false;this.extraLives=(this.extraLives||0)+1;this.emit('extra-life-awarded',{source,remaining:reserve+1,position:[...position]});return true;}
 awardMultiball(position=this.ball.p,layer=this.ball.layer){const state=this.rescueState(layer);Object.assign(state.available,{left:true,right:true});Object.assign(state.hits,{left:false,right:false});
  for(const gate of this.gates)if(gate.layer===layer&&(gate.mechanic==='rescue-return'||gate.id==='left-return'||gate.id==='right-return')){gate.closed=false;gate.pending=false;gate.pendingBall=null;gate.unlocked=true;}
  if(this.balls.filter(b=>b.state!=='drained').length+this.freeBallQueue>=3){this.awardExtraLife('multiball',position);return;}
  this.freeBallRewardPositions.push([...position]);this.freeBallQueue++;this.multiballAwards++;this.emit('multiball-awarded',{count:this.multiballAwards});
 }
 spawnFreeBall(){if(!this.freeBallQueue)return;if(this.balls.filter(b=>b.state!=='drained').length>=3){this.freeBallQueue--;this.awardExtraLife('multiball',this.freeBallRewardPositions.shift()||this.ball.p);return;}const p=[this.g.plunger.x,this.g.plunger.rest_y-this.physics.ballRadius-18];
  const layer=this.launchLayer();
  if(this.balls.some(b=>b.state!=='drained'&&b.layer===layer&&len(sub(b.p,p))<this.physics.ballRadius*2+3))return;
  const gate=this.gates.find(g=>g.id==='shooter-return');if(gate){gate.closed=false;gate.pending=false;}
  this.balls.push({p,v:[0,-(this.config.physicsModel!=='legacy'?this.g.plunger.launch_max:this.config.maxSpeed)],layer,z:this.launchHeight(),state:'playing',immunity:0,lastPortal:-10,trail:[],free:true,launchGuard:true});
  this.freeBallQueue--;this.freeBallRewardPositions.shift();this.plungerReleasedAt=this.time;this.plungerReleaseCharge=1;this.emit('free-ball-launch');
 }

 };
}
const api={createGame};if(typeof module!=='undefined')module.exports=api;else root.TableMechanics=api;
})(globalThis);

/* Art states, lights, sound resources and presentation helpers. */
(function(root){
'use strict';
function screenOverlay(doc){
 const mask=doc.createElement('div');
 mask.setAttribute('role','alert');mask.className='pirate-warning';
 mask.style.cssText='position:fixed;margin:0;padding:0;box-sizing:border-box;z-index:2147483647;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;pointer-events:auto';
 const win=doc.defaultView,viewport=win.visualViewport;
 const position=()=>{mask.style.left=(viewport?.offsetLeft||0)+'px';mask.style.top=(viewport?.offsetTop||0)+'px';mask.style.width=(viewport?.width||win.innerWidth)+'px';mask.style.height=(viewport?.height||win.innerHeight)+'px';};
 position();win.addEventListener('resize',position);viewport?.addEventListener('resize',position);viewport?.addEventListener('scroll',position);
 const cleanup=()=>{win.removeEventListener('resize',position);viewport?.removeEventListener('resize',position);viewport?.removeEventListener('scroll',position);mask.remove();};
 return {mask,cleanup};
}
function showWarning(doc){
 const {mask,cleanup}=screenOverlay(doc);
 mask.innerHTML=`<div style="margin:0;padding:0;flex:none;color:#ff3038;text-align:center;font:bold clamp(24px,6vw,64px) monospace;letter-spacing:.12em;line-height:1.35;display:flex;flex-direction:column;align-items:center;gap:12px">
 <div>WARNING</div>
 <svg viewBox="0 0 100 90" aria-label="警告" style="width:clamp(80px,18vw,150px);height:auto"><path d="M50 5L95 84H5Z" fill="none" stroke="currentColor" stroke-width="5"/><path d="M50 34V57" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><circle cx="50" cy="70" r="4" fill="currentColor"/></svg>
 <div>ENERMY</div><div style="width:100%;height:3px;background:currentColor"></div></div>`;
 doc.body.append(mask);
 const animation=mask.firstElementChild.animate([{opacity:1},{opacity:.15},{opacity:1}],{duration:600,iterations:2});
 const finished=animation.finished.catch(()=>{}).finally(cleanup);
 return {finished,cancel(){animation.cancel();cleanup();},pause(){animation.pause();},play(){animation.play();}};
}
function showGameOver(doc,score,rows,currentId,onClose,buttonLabel='重新開始'){
 return doc.defaultView.GameOverDialog.show(doc,score,rows,currentId,onClose,buttonLabel);
}
const sounds={
 metal:{src:'res/audio/electronic-impact.wav',volume:1,interval:70,voices:4},
 thunder:{src:'res/audio/thunder.ogg',volume:.75,interval:100,voices:2},
 explosion:{src:'res/audio/explosion.ogg?v=trim1',volume:.65,interval:70,voices:4}
};
const api={showWarning,showGameOver,sounds};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PirateMap=api;
})(typeof window!=='undefined'?window:globalThis);

/* Steampunk attack cues. OGG effects supplied by the user; machine gun is synthesized. */
const SteampunkSounds={
 'machine-gun':{src:'res/audio/steampunk-machine-gun.wav',volume:.55,interval:50,voices:2},
 'electric-charge':{src:'res/audio/steampunk-electric-charge.wav',volume:.55,interval:50,voices:1},
 'judgment':{src:'res/audio/steampunk-attack-judgment.ogg?v=short2',volume:.65,interval:50,voices:1}
};
