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
 const {mask,cleanup}=screenOverlay(doc);mask.className='pirate-game-over';mask.setAttribute('role','dialog');mask.setAttribute('aria-modal','true');mask.setAttribute('aria-label',PinballI18n.t('gameOver.label'));

 mask.innerHTML=`<style>
 .pirate-game-over *{box-sizing:border-box}.pirate-game-over .result{position:relative;width:min(92vw,420px);max-height:94%;overflow:hidden;display:flex;flex-direction:column;padding:0;color:#eee4d0;background:radial-gradient(ellipse at 50% 0,#25404c,#101e2a 55%,#0c1721);font-family:system-ui,sans-serif;text-align:center;border-radius:18px;box-shadow:0 24px 80px #000b}
 .pirate-game-over .total{display:block;margin:16px 0 20px;color:#ffe09a;font-size:clamp(30px,8vw,46px);font-weight:800;font-variant-numeric:tabular-nums;line-height:1.25;overflow-wrap:anywhere}
 .pirate-game-over .content{min-height:0;overflow:auto;padding:30px 25px 25px;scrollbar-width:thin;scrollbar-color:#89794f #101e2a}.pirate-game-over .trim{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}
 .pirate-game-over h1{font-size:clamp(25px,7vw,34px);font-weight:850;letter-spacing:.09em;margin:0;color:#f3dfaf}.pirate-game-over .rank-heading{display:flex;align-items:baseline;justify-content:space-between;margin:20px 0 10px}.pirate-game-over h2{margin:0;font-size:12px;letter-spacing:.13em;color:#e5d2a3}.pirate-game-over .rank-heading span{font-size:10px;color:#8399a3}.pirate-game-over ol{list-style:none;padding:0;margin:0;display:grid;gap:5px}.pirate-game-over li{display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:8px;min-height:37px;padding:7px 10px;border:1px solid transparent;border-radius:5px;background:#ffffff04;font-size:14px;font-variant-numeric:tabular-nums}.pirate-game-over .place{color:#839ba9;font-size:12px;text-align:left}.pirate-game-over li:nth-child(1) .place{color:#f0cb70}.pirate-game-over li:nth-child(2) .place{color:#cad9e2}.pirate-game-over li:nth-child(3) .place{color:#d2a07a}.pirate-game-over .row-score{font-size:16px;font-weight:650;text-align:right;overflow-wrap:anywhere}.pirate-game-over .date{font-size:11px;color:#91a5af;text-align:right;white-space:nowrap}.pirate-game-over li.current{border-color:#bc9b5077;background:#d9af4915;animation:game-over-current-frame 1.8s ease-in-out infinite}.pirate-game-over li.current .row-score{color:#ffe5a5}.pirate-game-over .empty{font-size:13px;color:#91a5af;padding:16px}.pirate-game-over button{display:block;width:100%;margin:23px 0 0;padding:12px 16px;border:1px solid #c5a464;border-radius:5px;background:#c8a05a;color:#15232a;font:750 14px system-ui;cursor:pointer;letter-spacing:.04em}.pirate-game-over button:hover{background:#e0bc78}.pirate-game-over button:active{transform:translateY(1px)}.pirate-game-over button:focus-visible{outline:2px solid #d2f5ff;outline-offset:4px}
 @keyframes game-over-current-frame{0%,100%{border-color:#bc9b5055;box-shadow:inset 0 0 0 transparent}50%{border-color:#ffe09a;box-shadow:inset 0 0 8px #e7bd492b}}@media(prefers-reduced-motion:reduce){.pirate-game-over li.current{animation:none;border-color:#ffe09a}}
 @media(max-height:600px){.pirate-game-over .content{padding:20px}.pirate-game-over .rank-heading{margin-top:12px}.pirate-game-over li{min-height:30px;padding:4px 8px}.pirate-game-over button{margin-top:13px}}
 </style><section class="result"><canvas class="trim" aria-hidden="true"></canvas><div class="content">
 <h1>GAME OVER</h1><strong class="total" data-score aria-label="${PinballI18n.t('gameOver.score')}"></strong><div class="rank-heading"><h2>HIGH SCORES</h2></div><ol data-ranks></ol><button></button></div></section>`;
 const format=n=>Number(n).toLocaleString('en-US');
 const formatDate=endedAt=>{const date=new Date(endedAt);if(!endedAt||Number.isNaN(date.getTime()))return '—';return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('/');};
 mask.querySelector('[data-score]').textContent=format(score);
 mask.querySelector('button').textContent=buttonLabel;
 [...rows].sort((a,b)=>b.score-a.score).forEach((entry,i)=>{
  const row=doc.createElement('li');if(entry.id===currentId){row.className='current';row.setAttribute('aria-current','true');}
  const place=doc.createElement('span');place.className='place';place.textContent=String(i+1).padStart(2,'0');
  const date=doc.createElement('time');date.className='date';date.textContent=formatDate(entry.endedAt);if(date.textContent!=='—')date.dateTime=entry.endedAt;date.setAttribute('aria-label',PinballI18n.t('gameOver.date',{date:date.textContent}));
  const value=doc.createElement('span');value.className='row-score';value.textContent=format(entry.score);row.append(place,value,date);mask.querySelector('[data-ranks]').append(row);
 });
 if(!rows.length){const empty=doc.createElement('li');empty.className='empty';empty.textContent=PinballI18n.t('gameOver.empty');mask.querySelector('[data-ranks]').append(empty);}
 const win=doc.defaultView,canvas=mask.querySelector('.trim'),panel=mask.querySelector('.result'),images=new Map();
 let closed=false;
 function drawFrame(){
  if(closed)return;const {width,height}=panel.getBoundingClientRect();if(!width||!height)return;
  const ratio=win.devicePixelRatio||1;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
  const ctx=canvas.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);
  win.SystemLayout.frame(ctx,{x:0,y:0,width,height,edgeWidth:6,edgeMode:'stretch',...win.SystemLayout.defaults,visible:{title:false,button:false,lock:false,marker:false,clear:false}},src=>{
   if(!images.has(src)){const image=new win.Image();images.set(src,image);image.onload=drawFrame;const url=new URL(src,doc.baseURI).href;image.src=win.PinballRuntimeImages?.resolve(url)??url;}
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
