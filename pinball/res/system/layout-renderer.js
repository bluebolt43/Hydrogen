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
function asset(src){if(typeof src!=='string'||!/^res\/img\/[^/\\?#]+\.(png|webp|jpg|jpeg|svg)$/i.test(src)||src.includes('..'))throw Error('素材路徑須為 res/img/檔名');return src;}
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
 if(visible.title){const image=getImage(o.title?.src||'res/img/card-title.png');if(image){const width=o.title?.width??o.width*.8,height=width*image.naturalHeight/image.naturalWidth;const x=o.x+(o.width-width)/2,y=o.y+(o.title?.yOffset??-height/2);ctx.drawImage(image,x,y,width,height);
   const text=o.title?.text??'';if(text&&o.title?.showText!==false)titleText(ctx,text,x+width/2,y+height*.43+(o.title?.textY??0),height*.48,width*.78,o.title?.arc??0);
}}
 if(visible.lock){
  const lock=o.lockImage||lockDefaults,image=getImage(lock.src),r=lockRect(o,canvasWidth,canvasHeight);
  if(image&&r.width>0&&r.height>0){
   ctx.save();ctx.globalAlpha=1-lockFade;ctx.translate(o.lockShake??0,0);
   drawPixelCrop(ctx,image,lock.src,lock.crop,r.x,r.y,r.width,r.height);
   ctx.font='800 '+r.height*.19+'px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillStyle='#fff8d9';ctx.strokeStyle='#111a23';ctx.lineWidth=Math.max(.5,r.height*.025);ctx.lineJoin='round';
   const label=lock.label??'TERKUNCI',measured=ctx.measureText(label).width;if(measured>r.width*.8)ctx.font='800 '+(r.height*.19*r.width*.8/measured)+'px Arial, sans-serif';
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
