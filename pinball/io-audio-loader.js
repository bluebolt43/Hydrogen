'use strict';
// io-only boot barrier. Native players start after the decrypting worker controls this page.
(async()=>{
 const root=new URL('.',document.currentScript.src),workerURL=new URL('io-audio-sw.js',root).href;
 try{
  if(!isSecureContext||!navigator.serviceWorker)throw new Error('HTTPS is required for audio playback');
  const registration=await navigator.serviceWorker.register(workerURL,{scope:root.href,updateViaCache:'none'});
  await registration.update();
  const candidate=registration.installing||registration.waiting||registration.active;
  if(!candidate)throw new Error('Audio worker unavailable');
  if(candidate.state!=='activated')await new Promise((resolve,reject)=>{
   candidate.addEventListener('statechange',()=>{
    if(candidate.state==='activated')resolve();
    else if(candidate.state==='redundant')reject(new Error('Audio worker could not activate'));
   });
  });
  if(!navigator.serviceWorker.controller||navigator.serviceWorker.controller.scriptURL!==workerURL)
   await new Promise(resolve=>{
    const check=()=>{
     if(navigator.serviceWorker.controller?.scriptURL===workerURL){navigator.serviceWorker.removeEventListener('controllerchange',check);resolve();}
    };
    navigator.serviceWorker.addEventListener('controllerchange',check);check();
   });
  for(const node of document.querySelectorAll('[data-pinball-audio-src]')){
   node.setAttribute('src',node.getAttribute('data-pinball-audio-src'));node.removeAttribute('data-pinball-audio-src');
  }
  for(const node of document.querySelectorAll('script[type="application/x-pinball-pending"]')){
   const script=document.createElement('script');
   for(const attr of node.attributes)if(attr.name!=='type'&&attr.name!=='data-pinball-type')script.setAttribute(attr.name,attr.value);
   const type=node.getAttribute('data-pinball-type');if(type)script.type=type;
   script.async=false;script.textContent=node.textContent;
   const ready=script.src||type==='module'?new Promise((resolve,reject)=>{
    script.onload=resolve;script.onerror=()=>reject(new Error('Game script could not load'));
   }):null;
   node.replaceWith(script);if(ready)await ready;
  }
 }catch(error){
  console.error('io audio initialization failed',error);
  const overlay=document.createElement('div');overlay.setAttribute('role','alert');
  overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#21150f;color:#ffe2ad;display:grid;place-content:center;padding:32px;font:18px sans-serif;text-align:center';
  overlay.textContent='音源載入失敗，請重新整理。 / Audio could not load. Please reload. / 音声を読み込めません。再読み込みしてください。';
  document.body.append(overlay);
 }
})();
