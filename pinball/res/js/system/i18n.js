/* Shared offline localization. Catalogs are generated from res/config/locales. */
(function(root){
'use strict';
if(root.PinballI18n)return;
function create(catalogs,storage){
 const fallback='zh-Hant',listeners=new Set(),supported=Object.freeze(['zh-Hant','en']);
 const normalize=value=>supported.includes(value)?value:fallback;
 let locale=fallback;
 try{locale=normalize(storage?.getItem('pinball-language'));}catch{}
 function t(key,params={}){
  const message=language=>Object.hasOwn(catalogs[language]||{},key)?catalogs[language][key]:undefined;
  const text=message(locale)??message(fallback)??key;
  return text.replace(/\{(\w+)\}/g,(match,name)=>Object.hasOwn(params,name)?String(params[name]):match);
 }
 function apply(element){
  if(!element)return;
  const nodes=[...(element.matches?.('[data-i18n],[data-i18n-aria-label],[data-i18n-title]')?[element]:[]),...element.querySelectorAll('[data-i18n],[data-i18n-aria-label],[data-i18n-title]')];
  for(const node of nodes){
   const key=node.getAttribute('data-i18n');if(key)node.textContent=t(key);
   for(const attribute of ['aria-label','title']){const key=node.getAttribute('data-i18n-'+attribute);if(key)node.setAttribute(attribute,t(key));}
  }
 }
 return {create,supported,get locale(){return locale;},t,apply,
  setLocale(value){const next=normalize(value);try{storage?.setItem('pinball-language',next);}catch{}if(next===locale)return;locale=next;for(const listener of listeners)listener(locale);},
  onChange(listener,{signal}={}){if(signal?.aborted)return ()=>{};listeners.add(listener);const off=()=>listeners.delete(listener);signal?.addEventListener('abort',off,{once:true});return off;}
 };
}
let storage;try{storage=root.localStorage;}catch{}
root.PinballI18n=create(root.PinballLocales||{},storage);
if(typeof module!=='undefined'&&module.exports)module.exports={create};
})(globalThis);
