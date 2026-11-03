/* Shared stage curtain motion, inherited from the Pirate theater. */
window.TheaterFrame={create(stage,animate){
 let closed=true;
 return {async transition(update){await this.curtains(true);try{await update();}finally{await this.curtains(false);}},async curtains(close){
  if(closed===close)return;
  const duration=matchMedia('(prefers-reduced-motion:reduce)').matches?0:650;
  await Promise.all([-1,1].map((direction,i)=>{
   const el=stage.querySelector(i?'.curtain.right':'.curtain.left');
   const open=`translateX(${direction*89}%)`,shut='translateX(0%)';
   return animate(el,[{transform:close?open:shut},{transform:close?shut:open}],duration);
  }));
  closed=close;
 }};
}};

// Disposable effect sprites can move without changing layout on every frame.
// Actors keep native positioning: later animations may also own their translate.
{
const origins=new WeakMap();
TheaterFrame.positionFrames=function(element,frames){
 const axes=['left','top'].filter(axis=>frames.some(frame=>frame[axis]!==undefined));
 if(!axes.length||frames.some(frame=>frame.translate!==undefined)||!window.CSS?.supports('translate','1px 1px'))return frames;
 const parent=element.offsetParent;if(!parent||!parent.clientWidth||!parent.clientHeight)return frames;
 const style=getComputedStyle(element);
 let origin=origins.get(element);
 if(!origin){
  const parts=style.translate==='none'?['0px','0px']:style.translate.split(/\s+/);
  if(parts.length>2||parts.some(value=>!/^[-\d.]+(?:px|%)$/.test(value)))return frames;
  origin=[parts[0],parts[1]||'0px'];
 }
 const base={left:parseFloat(style.left),top:parseFloat(style.top)},size={left:parent.clientWidth,top:parent.clientHeight};
 if(axes.some(axis=>!Number.isFinite(base[axis])))return frames;
 const positions=[];
 for(const frame of frames){const position={left:0,top:0};for(const axis of axes){
  const value=String(frame[axis]);if(!/^-?(?:\d+\.?\d*|\.\d+)(?:px|%)$/.test(value))return frames;
  position[axis]=parseFloat(value)*(value.endsWith('%')?size[axis]/100:1)-base[axis];
 }positions.push(position);}
 origins.set(element,origin);
 const translated=(base,delta)=>base==='0px'?delta+'px':delta===0?base:'calc('+base+(delta<0?' - ':' + ')+Math.abs(delta)+'px)';
 return frames.map((frame,i)=>{const converted={...frame,translate:translated(origin[0],positions[i].left)+' '+translated(origin[1],positions[i].top)};for(const axis of axes)delete converted[axis];return converted;});
};
}

// Apply position conversion only to disposable effects, never persistent actors.
TheaterFrame.effectFrames=function(element,frames){
 return ['effects','attack-layer','tentacle-behind','tentacle-ahead'].includes(element.parentElement?.id)?TheaterFrame.positionFrames(element,frames):frames;
};

// Keep decoded sources alive for the current theater, and normalize logical PNG
// aliases before comparing URLs. Clearing the iframe releases the whole cache.
{
 const images=new Map();
 TheaterFrame.preloadImage=function(src){
  const url=PinballRuntimeImages.resolve(src);
  if(!images.has(url)){
   const image=new Image();image.src=url;const entry={image};
   entry.ready=PinballRuntimeImages.decode(image).then(()=>image).catch(error=>{images.delete(url);throw error;});
   images.set(url,entry);
  }
  return images.get(url).ready;
 };
 const tints=new Map();
 const tintKey=(src,filter)=>PinballRuntimeImages.resolve(src)+'|'+filter;
 // Color-only filters commute with scaling. Bake them once at source size;
 // keep CSS shadows, which depend on display size, on their original path.
 TheaterFrame.preloadTint=function(src,filter){
  const key=tintKey(src,filter);if(tints.has(key))return tints.get(key).ready;
  const entry={};tints.set(key,entry);
  entry.ready=TheaterFrame.preloadImage(src).then(async image=>{
   const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
   try{
   const ctx=canvas.getContext('2d');
   if('filter' in ctx){ctx.filter=filter;ctx.drawImage(image,0,0);}
   else{
    ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),brightness=Number(filter.match(/brightness\(([\d.]+)\)/)?.[1]??1),saturation=Number(filter.match(/saturate\(([\d.]+)\)/)?.[1]??1),p=pixels.data;
    for(let i=0;i<p.length;i+=4){const r=p[i]*brightness,g=p[i+1]*brightness,b=p[i+2]*brightness,l=.213*r+.715*g+.072*b;p[i]=l+(r-l)*saturation;p[i+1]=l+(g-l)*saturation;p[i+2]=l+(b-l)*saturation;}
    ctx.putImageData(pixels,0,0);
   }
   const result=new Image();result.src=canvas.toDataURL('image/png');
   await PinballRuntimeImages.decode(result);entry.image=result;return result;
   }finally{canvas.width=canvas.height=0;}
  }).catch(error=>{if(error.name==='SecurityError'){entry.image=null;return null;}tints.delete(key);throw error;});return entry.ready;
 };
 TheaterFrame.setTint=function(image,src,filter){
  const tinted=filter?tints.get(tintKey(src,filter))?.image:null;
  const url=tinted?.src||TheaterFrame.imageSource(src);if(image.src!==url)image.src=url;
  image.style.filter=tinted||!filter?'none':filter;return true;
 };
 TheaterFrame.preloadImages=sources=>Promise.all([...new Set(sources.filter(Boolean))].map(TheaterFrame.preloadImage));
 TheaterFrame.imageSource=function(src){const url=PinballRuntimeImages.resolve(src);return images.get(url)?.image.src||url;};
 TheaterFrame.setImage=function(image,src){const url=TheaterFrame.imageSource(src);if(image.src===url)return false;image.src=url;return true;};
}

/* All themes share embedding, command queue, pause and completion contracts. */
window.TheaterFrame.connect=function({stage,ready,reset,enemy,attack,state,bounds,storyVictory}){
 window.viewReady=ready;
 const embedded=new URLSearchParams(location.search).has('embed');
 document.documentElement.classList.toggle('embed',embedded);
 if(!embedded)return;
 let commands=Promise.resolve(),generation=0,paused=false;
 const held=new Set();
 const report=(type,extra={})=>parent.postMessage({channel:'pinball-theater',type,...extra},'*');
 function pause(value){
  paused=value;stage.classList.toggle('still',value);stage.classList.toggle('paused',value);
  if(value){for(const a of document.getAnimations())if(a.playState==='running'){held.add(a);a.pause();}}
  else{for(const a of held)if(a.playState==='paused')a.play();held.clear();}
 }
 addEventListener('message',e=>{
  if(e.source!==parent||e.data?.channel!=='pinball-theater')return;
  const {command,id}=e.data;
  if(command==='pause'){pause(e.data.paused);return;}
  if(command==='warning-complete'||command==='boss-origin')return;
  if(command==='tutorial-bounds'){if(bounds)report('tutorial-bounds',{bounds:bounds()});return;}
  if(command==='reset')pause(false);
  const token=command==='reset'?++generation:generation;
  commands=commands.catch(()=>{}).then(async()=>{
   await ready;if(token!==generation)return;
   if(command==='reset'){pause(false);await reset();}
   else if(command==='enemy')await enemy(e.data);
   else if(command==='story-victory')await storyVictory?.();
   else await attack(command,e.data);
   if(token===generation)report('complete',{id,...state()});
  }).catch(error=>report('error',{id,message:String(error)}));
 });
 ready.then(()=>{if(paused)pause(true);report('ready');}).catch(error=>report('error',{message:String(error)}));
};

// Both theater pages live in res/; location also works when mounted by createView.
TheaterFrame.heartSource=new URL('img/health-heart.svg',location.href).href;
TheaterFrame.renderHealth=function(container,hp,previous=hp){
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const balanceRows=count=>{const limit=Number(container.dataset.balancedRows);if(limit>0)container.style.setProperty('--heart-columns',Math.max(1,count>limit?Math.ceil(count/2):count));};
 balanceRows(reduced?hp:previous);
 container.replaceChildren(...Array.from({length:reduced?hp:previous},(_,i)=>{
  const heart=document.createElement('img');heart.className='heart'+(i>=hp?' lost':'');heart.src=TheaterFrame.heartSource;heart.alt='';return heart;
 }));
 return Promise.all([...container.querySelectorAll('.lost')].map(async heart=>{
  await Promise.all(heart.getAnimations().map(a=>a.finished.catch(()=>{})));heart.remove();
 })).then(()=>balanceRows(hp));
};

TheaterFrame.warning=function(stage){
 stage.dataset.combat='warning';
 // The warning is a play overlay. Standalone theater previews only show
 // stage animation; embedded stages ask their play host to present it.
 if(!new URLSearchParams(location.search).has('embed')){delete stage.dataset.combat;return Promise.resolve();}
 const token=String(Date.now())+':'+Math.random();
 return new Promise(resolve=>{
  const complete=e=>{if(e.source===parent&&e.data?.channel==='pinball-theater'&&e.data.command==='warning-complete'&&e.data.token===token){removeEventListener('message',complete);delete stage.dataset.combat;resolve();}};
  addEventListener('message',complete);
  parent.postMessage({channel:'pinball-theater',type:'warning',token},'*');
 });
};

TheaterFrame.mountControls=function({title,attacks}){
 const main=document.querySelector('main');
 const header=document.createElement('header'),heading=document.createElement('h1');heading.textContent=title;header.append(heading);main.prepend(header);
 const panel=document.createElement('div');panel.innerHTML=`
 <div class="controls"><label>敵人 <select id="enemy-type" disabled></select></label><button id="next-state" class="primary" disabled>重試本關</button><button id="next-level" disabled>下一關</button><button id="daynight" disabled>換成夜晚</button><label>翻轉 <select id="speed"><option value="1000">正常速度</option><option value="2400">慢速查看</option></select></label><button id="water" aria-pressed="false">暫停動態</button><label>舞台高度 <input id="height" type="range" min="33.3333" max="100" step=".1" value="33.3333"></label></div>
 <div class="controls attack-controls"><span>我方攻擊</span></div><div class="states" id="states"></div><p class="status" id="status" role="status">載入圖層…</p>`;
 for(const [kind,label] of Object.entries(attacks)){const button=document.createElement('button');button.dataset.attack=kind;button.disabled=true;button.textContent=label;panel.querySelector('.attack-controls').append(button);}
 main.append(...panel.children);
};
