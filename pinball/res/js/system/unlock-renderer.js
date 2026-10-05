'use strict';
window.UnlockLayout=(()=>{
function material(ctx,o,image){const img=image(o.src);if(!img)return;const [x,y,w,h]=o.crop.map((v,i)=>v*(i%2?img.naturalHeight:img.naturalWidth));
 ctx.save();ctx.globalAlpha=o.opacity??1;
 if(o.paperInset){const s=Math.min(110,w/3,h/3),t=Math.min(o.paperInset,o.width/3,o.height/3),sx=[x,x+s,x+w-s],sy=[y,y+s,y+h-s],sw=[s,w-2*s,s],sh=[s,h-2*s,s],dx=[o.x,o.x+t,o.x+o.width-t],dy=[o.y,o.y+t,o.y+o.height-t],dw=[t,o.width-2*t,t],dh=[t,o.height-2*t,t];for(let row=0;row<3;row++)for(let col=0;col<3;col++)ctx.drawImage(img,sx[col],sy[row],sw[col],sh[row],dx[col],dy[row],dw[col],dh[row]);}
 else ctx.drawImage(img,x,y,w,h,o.x,o.y,o.width,o.height);ctx.restore();
}
function drawText(ctx,o){
 if(!o.label&&!o.price)return;
 ctx.save();ctx.fillStyle=o.color||'#fff6de';ctx.textAlign='center';ctx.textBaseline='middle';
 if(o.type==='frame'){ctx.shadowColor='#201000';ctx.shadowBlur=1;ctx.shadowOffsetY=1;}
 ctx.font='bold '+(o.fontSize||13)+'px '+(o.fontFamily||'Arial');
 ctx.fillText(o.label||'',o.x+o.width/2,o.y+o.height*(o.price?.34:.5),o.width-8);
 if(o.price){ctx.font='bold '+(o.priceFontSize||20)+'px Arial';ctx.fillText(o.price,o.x+o.width/2,o.y+o.height*.69,o.width-8);}
 ctx.restore();
}
function draw(ctx,layout,image,allDisabled=false){
 for(const o of layout.objects){
  if(allDisabled&&o.id==='best-value')continue;
  ctx.save();
  if(o.rotation){const cx=o.x+o.width/2,cy=o.y+o.height/2;ctx.translate(cx,cy);ctx.rotate(o.rotation*Math.PI/180);ctx.translate(-cx,-cy);}
  if(o.type==='material')material(ctx,o,image);
  else{
   const radius=o.type==='frame'?Math.min(o.edgeWidth,SystemLayout.edgeLimit(o))*3:4;
   if(o.fill){ctx.save();ctx.fillStyle=o.fill;
    if(o.type==='frame'){ctx.shadowColor='rgba(35,15,0,.8)';ctx.shadowBlur=8;ctx.shadowOffsetY=5;}
    ctx.beginPath();ctx.roundRect(o.x,o.y,o.width,o.height,radius);ctx.fill();ctx.restore();}
   if(o.texture){const wood=image('res/img/app-wood-texture.png');if(wood){ctx.save();ctx.beginPath();ctx.roundRect(o.x,o.y,o.width,o.height,radius);ctx.clip();ctx.drawImage(wood,0,0,wood.naturalWidth,wood.naturalHeight*.3,o.x,o.y,o.width,o.height);ctx.restore();}}
   if(o.type==='frame')SystemLayout.frame(ctx,o,image,640,360);
  }
  drawText(ctx,o);
  if(allDisabled&&o.id==='all'){ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.roundRect(o.x,o.y,o.width,o.height,Math.min(o.edgeWidth,SystemLayout.edgeLimit(o))*3);ctx.fill();}
  ctx.restore();
 }
}
return {draw};
})();
