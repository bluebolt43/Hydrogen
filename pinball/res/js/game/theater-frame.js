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

/* Both themes use the same embedding, command queue, pause and completion contract. */
window.TheaterFrame.connect=function({stage,ready,reset,enemy,attack,state,bounds,storyVictory}){
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
  if(command==='warning-complete')return;
  if(command==='tutorial-bounds'){if(bounds)report('tutorial-bounds',{bounds:bounds()});return;}
  if(command==='reset')pause(false);
  const token=command==='reset'?++generation:generation;
  commands=commands.catch(()=>{}).then(async()=>{
   await ready;if(token!==generation)return;
   if(command==='reset'){pause(false);await reset();}
   else if(command==='enemy')await enemy(e.data);
   else if(command==='story-victory')await storyVictory?.();
   else await attack(command);
   if(token===generation)report('complete',{id,...state()});
  }).catch(error=>report('error',{id,message:String(error)}));
 });
 ready.then(()=>{if(paused)pause(true);report('ready');}).catch(error=>report('error',{message:String(error)}));
};

// Both theater pages live in res/; location also works when mounted by createView.
TheaterFrame.heartSource=new URL('img/health-heart.svg',location.href).href;
TheaterFrame.renderHealth=function(container,hp,previous=hp){
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 container.replaceChildren(...Array.from({length:reduced?hp:previous},(_,i)=>{
  const heart=document.createElement('img');heart.className='heart'+(i>=hp?' lost':'');heart.src=TheaterFrame.heartSource;heart.alt='';return heart;
 }));
 return Promise.all([...container.querySelectorAll('.lost')].map(async heart=>{
  await Promise.all(heart.getAnimations().map(a=>a.finished.catch(()=>{})));heart.remove();
 }));
};

TheaterFrame.warning=function(stage){
 stage.dataset.combat='warning';
 if(!new URLSearchParams(location.search).has('embed'))return PirateMap.showWarning(document).finished.finally(()=>delete stage.dataset.combat);
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
