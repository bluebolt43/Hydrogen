// Credit page separators and typography are shared by review and story views.
window.StoryCredits={
 parse:text=>text.trim().split(/\n(?:[ \t]*\n){2,}/).map(page=>page.trim()).filter(Boolean),
 translate(text,i18n,catalogs=window.PinballLocales){
  const keys=['app.title','credits.producer','credits.programmer','credits.art','credits.music','credits.specialThanks','credits.family','credits.original'];
  const labels=new Map([['PINBALL TALES','app.title']]);
  for(const catalog of Object.values(catalogs))for(const key of keys)if(catalog[key])labels.set(catalog[key],key);
  return text.split('\n').map(line=>{const key=labels.get(line.trim());return key?line.replace(line.trim(),i18n.t(key)):line;}).join('\n');
 },
 layout(element,text,title=false,catalogs=window.PinballLocales){
  element.replaceChildren();element.classList.add('credit-card');element.dataset.title=String(title);
  const roles=new Set();for(const catalog of Object.values(catalogs))for(const [key,label] of Object.entries(catalog))if(key.startsWith('credits.')&&key!=='credits.family')roles.add(label);
  const groups=text.split(/\n[ \t]*\n/);
  groups.forEach((group,index)=>{
   if(index)element.append(document.createTextNode('\n\n'));
   const block=document.createElement('div');block.className='credit-group';
   group.split('\n').forEach((line,i)=>{
    if(i)block.append(document.createTextNode('\n'));
    const span=document.createElement('span');span.className=title?(i===0?'credit-brand':'credit-subtitle'):i===0&&roles.has(line.trim())?'credit-role':'credit-name';span.textContent=line;block.append(span);
   });element.append(block);
  });
 },
 create(container,config,i18n=window.PinballI18n){
  const element=container.querySelector('[data-credit-text]');
  let pages=[],time=-1,index=-1,previousText=null;
  const render=elapsed=>{
   time=elapsed;container.hidden=time<0;
   const page=Math.floor(time/config.cardDuration),text=time>=0&&time<config.duration?pages[page]||'':'';
   if(text!==previousText){this.layout(element,text,page===0);previousText=text;index=page;this.fit(element,container,page===0);}
   const fade=Math.min(config.fade,config.cardDuration/2),age=time-page*config.cardDuration;
   element.style.opacity=!text?0:fade?Math.max(0,Math.min(1,age/fade,(config.cardDuration-age)/fade)):1;
   container.dataset.phase=time<0?'hidden':text?'card':'black';container.dataset.card=text?String(page+1):'';
  };
  const refresh=()=>{pages=this.parse(this.translate(config.text,i18n));previousText=null;render(time);};
  const resize=new ResizeObserver(()=>this.fit(element,container,index===0));resize.observe(container);
  const off=i18n.onChange(refresh);
  window.addEventListener('pagehide',()=>{resize.disconnect();off();});refresh();
  return {render,refresh};
 },
 fit(element,stage,title=false){
  const width=stage.clientWidth,height=stage.clientHeight;
  if(!width||!height||!element.textContent)return;
  let size=Math.min(28,width*.07);
  element.style.fontSize=size+'px';
  if(element.scrollHeight>height*.84){size*=height*.84/element.scrollHeight;element.style.fontSize=size+'px';}
 }
};
