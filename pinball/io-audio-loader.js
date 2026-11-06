'use strict';
// Game scripts start independently; only audio waits for its decrypting worker.
(()=>{
 const root=new URL('.',document.currentScript.src),workerURL=new URL('io-audio-sw.js',root).href;
 const audioRoot=new URL('res/audio/',root),players=new Map();let controlled=false;
 let resolveAudio,rejectAudio;
 const audioReady=new Promise((resolve,reject)=>{resolveAudio=resolve;rejectAudio=reject;});
 audioReady.catch(()=>{});
 const isAudio=value=>{const url=new URL(value,document.baseURI);return url.origin===audioRoot.origin&&url.pathname.startsWith(audioRoot.pathname);};
 const nativePlay=HTMLMediaElement.prototype.play,nativePause=HTMLMediaElement.prototype.pause;
 function track(audio){if(!players.has(audio))players.set(audio,{wanted:false,preload:audio.preload});return players.get(audio);}
 HTMLMediaElement.prototype.play=function(){
  if(!controlled&&this.src&&isAudio(this.src)){track(this).wanted=true;return Promise.resolve();}
  return nativePlay.call(this);
 };
 HTMLMediaElement.prototype.pause=function(){const entry=players.get(this);if(entry)entry.wanted=false;return nativePause.call(this);};
 const NativeAudio=window.Audio,preload=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'preload');
 window.Audio=function(src){
  const audio=new NativeAudio();
  if(!controlled){
   const entry=track(audio);preload.set.call(audio,'none');
   Object.defineProperty(audio,'preload',{configurable:true,get(){return entry.preload;},set(value){entry.preload=value;}});
  }
  if(src)audio.src=src;return audio;
 };
 window.Audio.prototype=NativeAudio.prototype;Object.setPrototypeOf(window.Audio,NativeAudio);
 const nativeFetch=window.fetch.bind(window);
 window.fetch=(input,options)=>{
  const url=input instanceof Request?input.url:input;
  return !controlled&&isAudio(url)?audioReady.then(()=>nativeFetch(input,options)):nativeFetch(input,options);
 };
 async function prepareAudio(){
  if(!isSecureContext||!navigator.serviceWorker)throw new Error('HTTPS is required for audio playback');
  const registration=await navigator.serviceWorker.register(workerURL,{scope:root.href,updateViaCache:'none'});
  const candidate=registration.installing||registration.waiting||registration.active;
  if(!candidate)throw new Error('Audio worker unavailable');
  if(candidate.state!=='activated')await new Promise((resolve,reject)=>{
   const check=()=>{
    if(candidate.state==='activated'||candidate.state==='redundant'){
     candidate.removeEventListener('statechange',check);
     if(candidate.state==='activated')resolve();else reject(new Error('Audio worker could not activate'));
    }
   };
   candidate.addEventListener('statechange',check);check();
  });
  if(!navigator.serviceWorker.controller||navigator.serviceWorker.controller.scriptURL!==workerURL)
   await new Promise(resolve=>{
    const check=()=>{if(navigator.serviceWorker.controller?.scriptURL===workerURL){navigator.serviceWorker.removeEventListener('controllerchange',check);resolve();}};
    navigator.serviceWorker.addEventListener('controllerchange',check);check();
   });
  controlled=true;resolveAudio();
  for(const node of document.querySelectorAll('[data-pinball-audio-src]')){
   node.setAttribute('src',node.getAttribute('data-pinball-audio-src'));node.removeAttribute('data-pinball-audio-src');
  }
  for(const [audio,entry] of players){
   delete audio.preload;audio.preload=entry.preload;
   if(audio.src)audio.load();
   if(entry.wanted)nativePlay.call(audio).catch(error=>console.warn('io audio playback delayed',error));
  }
  players.clear();document.documentElement.dataset.audioState='ready';
 }
 async function startGame(){
  for(const node of document.querySelectorAll('script[type="application/x-pinball-pending"]')){
   const script=document.createElement('script');
   for(const attr of node.attributes)if(attr.name!=='type'&&attr.name!=='data-pinball-type')script.setAttribute(attr.name,attr.value);
   const type=node.getAttribute('data-pinball-type');if(type)script.type=type;
   script.async=false;script.textContent=node.textContent;
   const ready=script.src||type==='module'?new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=()=>reject(new Error('Game script could not load'));}):null;
   node.replaceWith(script);if(ready)await ready;
  }
 }
 prepareAudio().catch(error=>{rejectAudio(error);document.documentElement.dataset.audioState='error';console.warn('io audio initialization failed',error);});
 startGame().catch(error=>console.error('io game initialization failed',error));
})();
