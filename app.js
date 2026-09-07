const $=id=>document.getElementById(id);
const phone=document.querySelector('.phone');
 document.querySelectorAll('[data-task-content]').forEach(el=>el.append($('taskTemplate').content.cloneNode(true)));
 document.querySelector('#chapter [data-task-key=goal]').id='taskCheck';
let hasCompletedCall=false;
let messageDraft=null,eventPresentation=null,openingState=null,openingSession=null;
let pendingAppOpen=null,phoneDraft=null;
const displayed=()=>eventPresentation||state||openingState;
function renderTaskChecklist(){
 const result=state?.result||'ongoing';
 const statuses={goal:result,background:'success',number:'success',call:hasCompletedCall?'success':'ongoing',message:[...(state?.messages||[]),...(state?.smsMessages||[])].some(m=>m.type==='payment_card')?'success':result==='failure'?'failure':'ongoing',funds:result};
 document.querySelectorAll('[data-task-key]').forEach(el=>{const status=statuses[el.dataset.taskKey];el.dataset.result=status;el.setAttribute('aria-label',status==='success'?'已完成':status==='failure'?'未完成，已結束':'尚未完成');el.closest('li')?.classList.toggle('completed',status==='success');});
 document.querySelectorAll('.task-row').forEach(el=>el.classList.toggle('failed',result==='failure'));
}
const reduceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const timeFormat=new Intl.DateTimeFormat('zh-TW',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const dateFormat=new Intl.DateTimeFormat('zh-TW',{month:'long',day:'numeric',weekday:'long'});
let sessionId,state,busy=false,pending=null,accepted=false,muted=false;
let currentScreen='warning',connected=false,callStartedAt=0,elapsed=0,policeActive=false;
let selectedArticle=null,endingNews=null,limeStep=0;
let notificationTarget=null,notificationTimer,newsData=null,newsReady=false,balanceHidden=false,creditedAt=null,accountFrozen=false;
let transition=0,animations=[],dialAttempt=0,deferNodeRender=false;
const recentApps=new Map();let beforeRecents='home';
const music=new Audio(OFFLINE_AUDIO["/music-night.wav"]);music.preload='none';music.volume=.45;
let callAudioActive=false,resumeMusicAfterCall=false;
function pauseMusicForCall(){
 if(!callAudioActive)resumeMusicAfterCall=!music.paused;
 callAudioActive=true;music.pause();updateMusic();
}
function restoreMusicAfterCall(){
 callAudioActive=false;const resume=resumeMusicAfterCall;resumeMusicAfterCall=false;updateMusic();
 if(resume)playMusic();
}
const depositSound=new Audio(OFFLINE_AUDIO["/deposit.wav"]);depositSound.preload='auto';
const fbiEffect=new Audio(OFFLINE_AUDIO["/fbi-open-up-sfx.mp3"]),approachEffect=new Audio(OFFLINE_AUDIO["/police-approach.wav"]);
fbiEffect.preload=approachEffect.preload='none';let policeChoice=null,policeEffectTimer;
const ring=new Audio(OFFLINE_AUDIO["/ring.wav"]);ring.loop=true;
const dialTone=new Audio(OFFLINE_AUDIO["/dial.wav"]);dialTone.loop=true;
function stopDialTone(){dialTone.pause();dialTone.currentTime=0;}
const duration=ms=>`${String(Math.floor(ms/60000)).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
function syncClock(){
 const now=new Date(),clock=displayed()?.currentTime||'--:--';$('clock').textContent=$('homeClock').textContent=clock;$('homeDate').textContent=displayed()?.currentDateLabel||dateFormat.format(now);
 if(connected)$('callStatus').textContent=duration(elapsed+Date.now()-callStartedAt);
}
syncClock();setInterval(syncClock,1000);
window.addEventListener('focus',syncClock);document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncClock();});
const owner=id=>({conversation:'call',police:'call',bankDetail:'bank',newsArticle:'news',briefing:'chapter'}[id]||id);
function updateChrome(){
 const light=!['home','conversation','police','warning','mazu','timeSkip'].includes(currentScreen);
 phone.classList.toggle('light',light);
 const backgroundCall=connected&&currentScreen!=='conversation';
 $('callPill').classList.toggle('hidden',!backgroundCall);phone.classList.toggle('call-in-background',backgroundCall);
 $('androidNav').classList.toggle('hidden',!accepted||['police','briefing'].includes(currentScreen));
}
function iconTransform(id){
 const icon=document.querySelector(`#home [data-open="${owner(id)}"] .icon`);
 if(!icon)return 'translateY(45px) scale(.85)';
 const r=icon.getBoundingClientRect(),p=phone.getBoundingClientRect(),top=$('home').offsetTop;
 return `translate(${r.x+r.width/2-p.x-p.width/2}px,${r.y+r.height/2-p.y-top-($('home').clientHeight)/2}px) scale(.15)`;
}
function screen(id){
 if(!accepted&&id!=='warning')return;
 if(policeActive&&currentScreen==='police'&&id!=='police')return;
 const previous=currentScreen;currentScreen=id;
 if(!['home','warning','recents','police','briefing'].includes(id)){recentApps.delete(owner(id));recentApps.set(owner(id),id);}
 const seq=++transition;
 animations.forEach(a=>a.cancel());animations=[];
 document.querySelectorAll('.screen').forEach(el=>{
  const visible=el.id===id||el.id==='home'||el.id===previous;
  el.classList.toggle('active',visible);el.classList.remove('leaving');el.style.zIndex='';
  el.inert=el.id!==id;el.setAttribute('aria-hidden',String(el.id!==id));
 });
 updateChrome();
 if(id==='bank'){$('bankBadge').classList.add('hidden');renderBank();}
 if(id==='news'){$('newsBadge').classList.add('hidden');renderNews();}
 if(id==='newsArticle')renderArticle();
 if(id==='lime')renderLime();if(id==='messages')renderMessages();
 if(pendingAppOpen?.app===id){const resume=pendingAppOpen.resolve;pendingAppOpen=null;resume();}
 if(notificationTarget===id)hideNotification();
 const next=$(id),old=$(previous);
 if(previous===id){return;}
 if(old&&previous!=='home')old.classList.add('leaving');
 let target=next,frames;
 const withinApp=owner(previous)===owner(id);
 if(id==='home'){
  target=old;frames=[{transform:'none',opacity:1,borderRadius:'0px'},{transform:iconTransform(previous),opacity:0,borderRadius:'60px'}];
  if(previous==='briefing'){
   target=old.querySelector('.briefing-note');const r=target.getBoundingClientRect(),icon=document.querySelector('#home [data-open=chapter] .icon').getBoundingClientRect();
   frames=[{transform:'rotate(-2deg)',opacity:1},{transform:`translate(${icon.x+icon.width/2-r.x-r.width/2}px,${icon.y+icon.height/2-r.y-r.height/2}px) scale(${icon.width/r.width}) rotate(0deg)`,opacity:0,borderRadius:'18px'}];
  }
 }else if(previous==='home'){
  frames=[{transform:iconTransform(id),opacity:.3,borderRadius:'65px'},{transform:'none',opacity:1,borderRadius:'0px'}];
 }else if(withinApp&&['newsArticle','bankDetail'].includes(id)){
  frames=[{transform:'translateX(100%)',opacity:1},{transform:'none',opacity:1}];
 }else if(withinApp&&['newsArticle','bankDetail'].includes(previous)){
  target=old;frames=[{transform:'none',opacity:1},{transform:'translateX(100%)',opacity:1}];
 }else{
  frames=[{transform:'translateY(55px)',opacity:0},{transform:'none',opacity:1}];
 }
 if(next&&id!=='home')next.style.zIndex='6';
 if(target===old&&old)old.style.zIndex='7';
 const finish=()=>{
  if(seq!==transition)return;
  document.querySelectorAll('.screen').forEach(el=>{el.classList.toggle('active',el.id===id||el.id==='home');el.classList.remove('leaving');el.style.zIndex='';});
  if(id!=='home'&&id!=='police'){next.setAttribute('tabindex','-1');next.focus({preventScroll:true});}
 };
 if(target&&previous!=='warning'&&!reduceMotion()){
  const animation=target.animate(frames,{duration:previous==='briefing'?850:id==='home'?250:340,easing:'cubic-bezier(.2,.8,.2,1)'});
  animations.push(animation);animation.finished.then(finish).catch(()=>{});
 }else finish();
}
function hideNotification(){clearTimeout(notificationTimer);$('notification').classList.add('hidden');notificationTarget=null;}
function notify(target,app,title,body=''){
 if(policeActive||(target!=='news'&&owner(currentScreen)===target))return;
 clearTimeout(notificationTimer);notificationTarget=target;
 $('notificationApp').textContent=app;$('notificationTitle').textContent=title;$('notificationBody').textContent=body;
 $('notificationIcon').classList.toggle('news',target==='news');
 $('notificationIcon').innerHTML=`<svg><use href="#i-${target==='news'?'hulan':target==='lime'?'message':target==='messages'?'sms':'bank'}"/></svg>`;
 $('notification').classList.remove('hidden');
 if(!reduceMotion())$('notification').animate([{transform:'translateY(-140%)',opacity:0},{transform:'none',opacity:1}],{duration:380,easing:'cubic-bezier(.16,1,.3,1)'});
 notificationTimer=setTimeout(hideNotification,target==='news'?10000:6500);
}
async function api(path,body){return offlineApi(path,body);}
function caption(text){$('transcript').replaceChildren();const p=document.createElement('p');p.textContent=text;$('transcript').append(p);}
function controls(){
 $('choices').replaceChildren();
 if(phoneDraft){const b=document.createElement('button');b.className='choice';b.textContent=phoneDraft.text;b.onclick=()=>{const resume=phoneDraft.resolve;phoneDraft=null;b.disabled=true;resume();};$('choices').append(b);return;}
 if(connected&&state?.node?.action==='say_amount'){const b=document.createElement('button');b.className='choice';b.textContent=state.node.target;b.disabled=busy;b.onclick=()=>performAction('say_amount');$('choices').append(b);return;}
 if(connected&&state?.result==='ongoing'&&state.node?.app==='phone')for(const option of state.options){
  const b=document.createElement('button');b.className='choice';b.disabled=busy||!!pending||!!messageDraft;b.textContent=option.text;b.onclick=()=>choose(option.id);$('choices').append(b);
 }
 $('retry').classList.toggle('hidden',!pending||busy||!connected);
 document.querySelector('.manual').classList.toggle('hidden',!connected||state?.result!=='ongoing');
}
function showError(e){$('callError').textContent=e.message;$('callError').classList.remove('hidden');}
function startConnection(){pauseMusicForCall();stopDialTone();connected=true;callStartedAt=Date.now();syncClock();updateChrome();}
function endConnection(keepMusicPaused=false){if(phoneDraft){const resume=phoneDraft.resolve;phoneDraft=null;resume();}if(connected)hasCompletedCall=true;renderTaskChecklist();stopDialTone();if(connected)elapsed+=Date.now()-callStartedAt;connected=false;$('callStatus').textContent='通話結束';$('recentCall').textContent=`林美華　·　${displayed()?.currentTime||''}　·　${duration(elapsed)}`;$('recentCall').classList.remove('hidden');updateChrome();controls();if(!keepMusicPaused)restoreMusicAfterCall();screen('home');}
async function dial(){
 if(busy)return;
 screen('conversation');
 if(sessionId){
  if(state.result==='ongoing'&&state.node?.app==='phone')startConnection();else $('callStatus').textContent='通話結束';
  caption(state.node?.prompt||state.history.findLast(m=>m.role==='npc')?.text||'喂？');controls();return;
 }
 const attempt=++dialAttempt;busy=true;$('dial').disabled=true;$('callStatus').textContent='正在撥號…';caption('');
 pauseMusicForCall();dialTone.play().catch(()=>showError(new Error('無法播放撥號音')));
 try{
  const [data]=await Promise.all([openingSession||prepareOpening(),new Promise(resolve=>setTimeout(resolve,1600))]);
  sessionId=data.sessionId;state=data;if(attempt!==dialAttempt)return;startConnection();
  await playPhoneLines([{role:'npc',text:'喂？'},{role:'player',text:'喂，是我啦。'},{role:'npc',text:state.node?.prompt||'喂？'}]);$('callError').classList.add('hidden');
 }catch(e){restoreMusicAfterCall();showError(e);$('callStatus').textContent='無法接通';}
 finally{stopDialTone();busy=false;$('dial').disabled=false;controls();}
}
async function choose(id,sendCard=false){
 const option=state?.options?.find(o=>o.id===id);
 if(!busy&&option?.display==='payment_card'&&!sendCard){messageDraft={...option,payload:{...option.payload,amount:option.payload.amountFromStory?state.story.amount:option.payload.amount}};controls();if(connected)endConnection();return;}

 if(busy||(!connected&&!['lime','messages'].includes(state?.node?.app))||!sessionId)return;
 const previousPresentation=structuredClone(displayed());
 const replyMessages=state.node?.app==='messages'?'smsMessages':state.node?.app==='lime'?'messages':null;
 pending||={choiceId:id,requestId:Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('')};busy=true;$('callError').classList.add('hidden');controls();
 try{
  const [data]=await Promise.all([api('/api/choice',{sessionId,...pending}),new Promise(resolve=>setTimeout(resolve,300))]);
  state=data;eventPresentation=data.beforeEvents||null;pending=null;messageDraft=null;
  if(replyMessages)await presentMessages(data.beforeEvents,previousPresentation,false);
  if(!replyMessages&&connected&&state.reply){
   await playPhoneLines(state.reply.split('\n').filter(Boolean).map(text=>({role:'npc',text})));
  }else caption(state.reply);
  if(currentScreen==='lime')renderLime();if(currentScreen==='messages')renderMessages();deferNodeRender=false;await processEvents(data.events);if(!deferNodeRender||state?.node?.action==='answer_110')renderCurrentNode();
 }catch(e){showError(e);}
 finally{eventPresentation=null;busy=false;controls();if(currentScreen==='lime')renderLime();if(currentScreen==='messages')renderMessages();}
}
const pause=ms=>new Promise(resolve=>setTimeout(resolve,reduceMotion()?0:ms));
function requestId(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');}
async function performAction(action){
 if(busy||!sessionId)return;busy=true;controls();
 try{const data=await api('/api/action',{sessionId,action,requestId:requestId()});state=data;eventPresentation=data.beforeEvents||null;deferNodeRender=false;if(action==='send_friend_request'){$('limeStatus').textContent='好友邀請已送出';await pause(700);}await processEvents(data.events);if(!deferNodeRender||state?.node?.action==='answer_110')renderCurrentNode();}
 catch(e){showError(e);}finally{eventPresentation=null;busy=false;controls();if(currentScreen==='lime')renderLime();if(currentScreen==='messages')renderMessages();}
}
function renderLime(){
 const content=$('limeContent');if(!content)return;content.replaceChildren();
 const node=state?.node;
 const draft=messageDraft?.channel==='lime'?messageDraft:null;
 if(!state){content.innerHTML='<p class="empty-label">尚無聯絡人</p>';return;}
 if(node?.nodeType==='app_action'&&node.action==='send_friend_request'){
  $('limeStatus').textContent=['新增好友','任務聯絡人','確認邀請'][limeStep];
  const panel=document.createElement('div');panel.className='lime-panel';
  if(limeStep===0)panel.innerHTML='<button class="lime-action">＋ 新增好友</button>';
  else if(limeStep===1)panel.innerHTML='<div class="lime-row"><span><strong>林美華</strong><small>任務聯絡人</small></span><button class="lime-action">選擇</button></div>';
  else panel.innerHTML='<div class="lime-row"><span><strong>林美華</strong><small>等待邀請</small></span><button class="lime-action">送出好友邀請</button></div>';
  panel.querySelector('button').onclick=()=>{if(limeStep<2){limeStep++;renderLime();}else performAction('send_friend_request');};content.append(panel);return;
 }
 if(!displayed()?.limeConnected){$('limeStatus').textContent='通訊錄';content.innerHTML='<p class="empty-label">尚無聯絡人</p>';return;}
 $('limeStatus').textContent=displayed()?.blockedContacts?.includes('林美華')?'無法傳送':'林美華';
 const chat=document.createElement('div');chat.className='lime-chat';
 for(const message of displayed()?.messages??[]){const bubble=document.createElement('div');bubble.className='lime-bubble '+(message.role==='player'?'player':message.role==='system'?'system':'');if(message.type==='payment_card')bubble.innerHTML=`<strong>${message.bankName||'收款資料'}</strong><p>戶名：${message.accountName}<br>收款人：${message.recipient}<br>帳號：${message.account}<br>金額：NT$${message.amount.toLocaleString('en-US')}</p>`;else bubble.textContent=message.text;chat.append(bubble);}
 if(!busy&&node?.prompt&&displayed()?.messages?.at(-1)?.text!==node.prompt){const bubble=document.createElement('div');bubble.className='lime-bubble';bubble.textContent=node.prompt;chat.append(bubble);}
 content.append(chat);
 if(draft){
  const composer=document.createElement('div');composer.className='lime-composer';
  const text=document.createElement('div');text.className='lime-compose-text';text.setAttribute('role','textbox');text.setAttribute('aria-readonly','true');text.setAttribute('aria-label','待傳送訊息');
  const payload=draft.payload;
  text.textContent=payload?`${payload.bankName||'理財調度銀行'}\n${payload.accountName} · ${payload.recipient}\n${payload.account}\nNT$${payload.amount.toLocaleString('en-US')}`:draft.text;
  const send=document.createElement('button');send.className='lime-action';send.textContent='傳送';send.disabled=busy&&!draft.send;
  send.onclick=()=>{if(send.disabled)return;send.disabled=true;if(draft.send)draft.send();else choose(draft.id,true);};
  composer.append(text,send);content.append(composer);return;
 }
 if(!busy&&node?.nodeType==='dialogue'){
  const choices=document.createElement('div');choices.className='lime-choices';for(const option of state.options){const button=document.createElement('button');button.textContent=option.text;button.disabled=busy;button.onclick=()=>choose(option.id);choices.append(button);}content.append(choices);
 }else if(node?.nodeType==='app_action'&&node.action==='send_payment_details'){
  const card=document.createElement('div');card.className='payment-card';card.innerHTML=`<strong>${node.payload.bankName||'理財調度銀行'}</strong><p>戶名：${node.payload.accountName}<br>收款人：${node.payload.recipient}<br>帳號：${node.payload.account}<br>金額：NT$${node.payload.amount.toLocaleString('en-US')}</p><button class="lime-action">傳送收款資料</button>`;card.querySelector('button').onclick=()=>performAction('send_payment_details');content.append(card);
 }
}
async function showTimeSkip(event){
 const overlay=$('timeSkip');$('timeSkipLabel').textContent=event.label;$('timeSkipDate').textContent=event.dateLabel;$('timeSkipTime').textContent=event.time;
 overlay.classList.remove('leaving');overlay.inert=false;overlay.setAttribute('aria-hidden','false');overlay.classList.add('active');
 if(!reduceMotion())await pause(650);
 // Close app presentation under the opaque transition; retain chapter data.
 dialAttempt++;policeActive=false;
 if(connected)endConnection(true);else stopDialTone();
 ring.pause();music.pause();resumeMusicAfterCall=false;callAudioActive=false;
 hideNotification();recentApps.clear();$('recentApps').replaceChildren();
 screen('home');
 await new Promise(resolve=>setTimeout(resolve,1500));
 if(!reduceMotion()){overlay.classList.add('leaving');await pause(650);}
 overlay.classList.remove('active','leaving');overlay.inert=true;overlay.setAttribute('aria-hidden','true');syncClock();
}
async function animateJiaobei(toss){
 const reel=$('jiaobei').querySelector('.mazu-reel');
 const previous=reel.lastElementChild.dataset.toss||'holy';
 const symbols=['holy','yin','laugh'];
 const rows=[previous,...Array.from({length:24},(_,i)=>symbols[i%3]),toss];
 reel.style.transform='translateY(0)';
 reel.replaceChildren(...rows.map(result=>{
  const row=document.createElement('span');row.dataset.toss=result;
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 200 140');
  const use=document.createElementNS('http://www.w3.org/2000/svg','use');
  use.setAttribute('href','#mazu-'+result);svg.append(use);row.append(svg);return row;
 }));
 if(!reduceMotion()){
  const height=reel.firstElementChild.getBoundingClientRect().height;
  const animation=reel.animate([
   {transform:'translateY(0)'},
   {transform:`translateY(-${(rows.length-1)*height}px)`}
  ],{duration:2200,easing:'cubic-bezier(.15,.65,.2,1)',fill:'forwards'});
  await animation.finished;
  reel.replaceChildren(reel.lastElementChild);
  animation.cancel();
 }else{
  reel.replaceChildren(reel.lastElementChild);
 }
}
let mazuAnimation=null,mazuBankStart=null;
const mazuResultText={holy:'聖筊',laugh:'笑筊',yin:'陰筊'};
$('mazuThrow').onclick=async()=>{
 if(mazuAnimation||$('mazuThrow').disabled)return;
 $('mazuThrow').disabled=true;
 if(mazuBankStart){const start=mazuBankStart;mazuBankStart=null;start();return;}
 // Ordinary visits are standalone draws, never chapter or bank decisions.
 const toss=['holy','laugh','yin'][Math.floor(Math.random()*3)];
 mazuAnimation=(async()=>{
  $('mazuStatus').textContent='正在請示……';
  await animateJiaobei(toss);
  $('mazuStatus').textContent=mazuResultText[toss];
 })();
 try{await mazuAnimation;}finally{mazuAnimation=null;$('mazuThrow').disabled=false;}
};
async function showMazu(event){
 if(mazuAnimation)await mazuAnimation;
 $('mazuBankLabel').classList.remove('hidden');
 screen('mazu');$('mazuStatus').textContent='按下擲筊，請示是否匯款';$('mazuThrow').disabled=false;
 await new Promise(resolve=>{mazuBankStart=resolve;});
 mazuAnimation=(async()=>{
  for(const [index,toss] of event.tosses.entries()){
   $('mazuStatus').textContent=index?'笑筊，再請示一次……':'正在請示……';
   await animateJiaobei(toss);
   $('mazuStatus').textContent=mazuResultText[toss];
   await new Promise(resolve=>setTimeout(resolve,toss==='laugh'?1400:1800));
   if(toss!=='laugh')break;
  }
 })();
 try{await mazuAnimation;}finally{mazuAnimation=null;$('mazuThrow').disabled=false;$('mazuBankLabel').classList.add('hidden');}
}

async function waitForPlayerApp(app){
 if(currentScreen===app)return;
 await new Promise(resolve=>{pendingAppOpen={app,resolve};});
}

async function playPhoneLines(lines){
 for(const line of lines){
  if(!connected)break;
  if(line.role==='player'){
   await new Promise(resolve=>{phoneDraft={text:line.text,resolve};controls();});
   await new Promise(resolve=>setTimeout(resolve,1200));
  }else{
   if($('transcript').textContent===line.text)continue;
   caption(line.text);
   await new Promise(resolve=>setTimeout(resolve,Math.max(1500,Math.min(4000,line.text.length*100))));
  }
 }
}

async function presentMessages(target,previous,waitForPlayer=false,notifyIncoming=true){
 if(!target)return;
 const shown=structuredClone(target);
 for(const key of ['messages','smsMessages'])shown[key]=structuredClone(previous?.[key]||[]);
 shown.blockedContacts=structuredClone(previous?.blockedContacts||[]);
 eventPresentation=shown;
 for(const [key,app] of [['messages','lime'],['smsMessages','messages']]){
  for(const message of (target[key]||[]).slice(shown[key].length)){
   if(message.role==='player'&&waitForPlayer){
    await waitForPlayerApp(app);
    await new Promise(resolve=>{messageDraft={channel:app,text:message.text,send:()=>{messageDraft=null;resolve();}};if(app==='lime')renderLime();else renderMessages();});
   }else if(message.role!=='player')await new Promise(resolve=>setTimeout(resolve,1200));
   for(const text of message.type==='payment_card'?[null]:String(message.text||'').split('\n').filter(Boolean)){
    // Keep the persisted message intact, revealing its lines progressively.
    const last=shown[key].at(-1);
    if(text!==null&&last?._revealing){last.text+='\n'+text;}
    else shown[key].push(text===null?{...message}:{...message,text,_revealing:true});
    if(currentScreen===app){if(app==='lime')renderLime();else renderMessages();}
    else if(message.role==='npc'&&notifyIncoming)notify(app,app==='lime'?'LIME':'簡訊','林美華',text);
    if(message.role!=='player')await new Promise(resolve=>setTimeout(resolve,Math.max(1500,Math.min(4000,(text||'').length*100))));
   }
   if(shown[key].at(-1))delete shown[key].at(-1)._revealing;
  }
 }
 eventPresentation=target;
 if(currentScreen==='lime')renderLime();if(currentScreen==='messages')renderMessages();
}

async function processEvents(events=[]){
 for(const event of events){
  if(event.type==='sms_payment'||event.type==='lime_payment'){
   await waitForPlayerApp(event.type==='sms_payment'?'messages':'lime');
  }
  if(event.type==='sms_payment'||event.type==='lime_payment'){
   await new Promise(resolve=>{
    messageDraft={channel:event.type==='sms_payment'?'messages':'lime',payload:event.payload,send:()=>{messageDraft=null;resolve();}};
    if(currentScreen==='lime')renderLime();else renderMessages();
   });
  }
  if(event.presentation){await presentMessages(event.presentation,displayed(),event.type==='lime_lines',event.type!=='funds_received');syncClock();}
  if(event.type==='wait'){await new Promise(resolve=>setTimeout(resolve,event.durationMs));}
  else if(event.type==='lime_lines'){}
  else if(['phone_lines','call_end'].includes(event.type)){
   await playPhoneLines(event.lines||[]);
   if(event.type==='call_end')endConnection();
  }
  else if(event.type==='lime_payment'){renderLime();await new Promise(resolve=>setTimeout(resolve,1000));deferNodeRender=false;}
  else if(event.type==='sms_payment'){renderMessages();await new Promise(resolve=>setTimeout(resolve,1000));}
  else if(event.type==='sms_delivery_failed'){screen('messages');renderMessages();await new Promise(resolve=>setTimeout(resolve,1500));}
  else if(event.type==='time_skip'){await showTimeSkip(event);deferNodeRender=true;}
  else if(event.type==='lime_accept'){screen('home');notify('lime','LIME',event.title,'點擊開啟');deferNodeRender=true;}
  else if(['lime_message','sms_message'].includes(event.type)){deferNodeRender=true;}
  else if(event.type==='failure_now'){if(event.channel==='messages'){screen('messages');await new Promise(resolve=>setTimeout(resolve,3000));}else if(event.channel==='lime'&&event.blocked){screen('lime');await new Promise(resolve=>setTimeout(resolve,3000));}else{await playPhoneLines((event.messages||[]).map(text=>({role:'npc',text})));if(connected)endConnection(true);await pause(600);}}
  else if(event.type==='dajia_mazu')await showMazu(event);
  else if(event.type==='funds_received'){creditedAt=new Date();accountFrozen=false;renderBank();$('bankBadge').classList.remove('hidden');screen('home');notify('bank','理財調度銀行','入帳通知',`+NT$${Number(event.amount).toLocaleString('en-US')}`);depositSound.currentTime=0;depositSound.play().catch(()=>{});await pause(900);notify(event.channel==='messages'?'messages':'lime',event.channel==='messages'?'簡訊':'LIME','林美華','好了，轉過去了。');await pause(900);}
  else if(event.type==='bank_frozen'){accountFrozen=true;creditedAt=null;renderBank();screen('bank');await pause(1000);}
  else if(event.type==='terminal')await finishChapter(event);
 }
}
async function finishChapter(event){
 endingNews={...event.news,sources:event.news?.sources||event.sources,endingCode:event.endingCode};newsData=endingNews;newsReady=true;renderTaskChecklist();
 $('newsBadge').classList.remove('hidden');
 if(event.result==='failure'){deferNodeRender=true;selectedArticle=endingNews;hideNotification();screen('newsArticle');}
 else{screen('home');notify('news','虎蘭新聞',endingNews.title,'點擊閱讀事件後續');}
}
function renderCurrentNode(){
 syncClock();if(!state)return;
 if(state.result!=='ongoing'){screen('home');return;}
 if(state.node?.nodeType==='dialogue'){
  if(state.node.app==='phone'){screen('conversation');caption(state.node.prompt||state.reply||'');controls();}
  else if(state.node.app==='messages'){if(currentScreen==='messages')renderMessages();}else if(currentScreen==='lime')renderLime();return;
 }
 if(state.node?.nodeType==='app_action'){
  if(state.node.action==='say_amount'){screen('conversation');caption(state.node.prompt);controls();}
  else if(state.node.action==='send_friend_request'){if(connected)endConnection();screen('home');}
  else if(state.node.action==='send_payment_details'){if(currentScreen==='lime')renderLime();}
  else if(state.node.action==='answer_110'){hideNotification();pauseMusicForCall();policeActive=true;policeChoice=null;$('policeControls').classList.remove('hidden');$('policeStatus').textContent='行動電話';screen('police');ring.play().catch(()=>{});}return;
 }
}
function renderBank(){
 $('balance').textContent=balanceHidden?'••••••':`NT$ ${Number(displayed()?.bankBalance||0).toLocaleString('en-US')}`;
 document.querySelector('.account-frozen')?.remove();if(accountFrozen){const warning=document.createElement('div');warning.className='account-frozen';warning.innerHTML='<strong>帳戶已限制使用</strong><p>帳戶狀態異常</p>';document.querySelector('.balance-card').after(warning);}
 if(!creditedAt){$('transaction').classList.add('empty');$('transaction').textContent='尚無交易紀錄';return;}
 $('transaction').classList.remove('empty');$('transaction').replaceChildren();
 const row=document.createElement('button');row.className='transaction-entry';row.id='transactionEntry';
 const icon=document.createElement('span');icon.className='transfer-icon';icon.textContent='↙';
 const label=document.createElement('span'),title=document.createElement('strong'),time=document.createElement('small');
 title.textContent='轉帳存入';time.textContent=timeFormat.format(creditedAt);label.append(title,time);
 const amount=document.createElement('span');amount.className='transaction-amount';amount.textContent=balanceHidden?'••••':`+ ${Number(displayed()?.bankBalance||0).toLocaleString('en-US')}`;
 row.append(icon,label,amount);row.onclick=()=>screen('bankDetail');$('transaction').append(row);
 $('transactionTime').textContent=`${creditedAt.getMonth()+1}/${creditedAt.getDate()} ${timeFormat.format(creditedAt)}`;
}
function choosePolice(choice='answer'){
 if(!policeActive||policeChoice)return;policeChoice=choice;ring.pause();ring.currentTime=0;
 $('policeControls').classList.add('hidden');$('policeStatus').textContent=choice==='decline'?'已掛斷':'已接通';
 const effect=choice==='decline'?approachEffect:fbiEffect;effect.currentTime=0;effect.muted=muted;
 effect.onended=finishPolice;effect.onerror=()=>{ $('audioError').textContent='音效無法播放';finishPolice(); };
  policeEffectTimer=setTimeout(finishPolice,choice==='decline'?3000:4000);
 effect.play().catch(()=>{ $('audioError').textContent='音效無法播放';finishPolice(); });
}
async function finishPolice(){
 if(!policeActive)return;policeActive=false;clearTimeout(policeEffectTimer);fbiEffect.pause();approachEffect.pause();ring.pause();stopDialTone();$('policeStatus').textContent='通話結束';
 restoreMusicAfterCall();
 await performAction('answer_110');
}
function renderNews(){
 document.querySelectorAll('.news-visual').forEach(el=>{el.classList.toggle('verified',state?.result==='failure');el.setAttribute('aria-label',state?.result==='failure'?'電話身分查證與防護示意圖':'陌生來電與金錢風險示意圖');});
 $('newsCard').classList.toggle('hidden',!newsReady);
 if(newsData)$('feedTitle').textContent=newsData.title;
}
function renderArticle(){
 const article=selectedArticle||newsData;if(!article)return;
 for(const [id,key] of Object.entries({newsTitle:'title',lessonTitle:'lessonTitle',lesson:'lesson'}))$(id).textContent=article[key]||'';
 $('newsByline').textContent=article.byline||'社會中心／綜合報導';
 document.querySelector('#article .news-kicker').textContent=article.category||'社會';
 document.querySelector('#article aside').classList.toggle('hidden',!article.lesson);
 document.querySelector('#article .news-visual').classList.toggle('hidden',!!article.artKind);
 $('articleFunArt').className='fun-news-art '+(article.artKind||'hidden');$('articleFunArt').replaceChildren();if(article.image){const img=document.createElement('img');img.src=article.image;img.alt=article.imageAlt;$('articleFunArt').append(img);$('articleFunArt').removeAttribute('aria-hidden');}else{$('articleFunArt').textContent=article.icon||'';$('articleFunArt').setAttribute('aria-hidden','true');}
 $('newsBody').replaceChildren();for(const text of article.paragraphs){const p=document.createElement('p');p.textContent=text;$('newsBody').append(p);}
 const sources=$('newsSources');sources.replaceChildren();sources.classList.toggle('hidden',!article.sources);if(article.sources){const h=document.createElement('h2');h.textContent='改編資料來源';sources.append(h);for(const source of article.sources){const a=document.createElement('a');a.href=source.url;a.target='_blank';a.rel='noopener';a.textContent=`${source.publisher}・${source.publishedAt}`;sources.append(a);}}
}

function toggleSound(){
 muted=!muted;$('settingsSound').setAttribute('aria-checked',String(!muted));
 for(const id of ['sound']){$(id).classList.toggle('muted',muted);$(id).setAttribute('aria-label',muted?'開啟聲音':'關閉聲音');}
 ring.muted=dialTone.muted=music.muted=fbiEffect.muted=approachEffect.muted=depositSound.muted=muted;
}
$('start').onclick=()=>{
 if(accepted)return;accepted=true;$('start').disabled=true;
 document.body.classList.remove('intro');
 for(const id of ['home','briefing']){$(id).classList.add('active');$(id).inert=true;$(id).setAttribute('aria-hidden','true');}
 $('warning').classList.add('fade-out');
 setTimeout(()=>screen('briefing'),reduceMotion()?0:1400);
};
$('saveTask').onclick=()=>{const page=document.querySelector('#home [data-open=chapter]').closest('.desktop-page');setDesktopPage(Math.max(0,[...desktopPages.children].indexOf(page)));screen('home');};
$('contactSearch').oninput=()=>{const match='林美華'.includes($('contactSearch').value.trim());$('dial').classList.toggle('hidden',!match);$('contactEmpty').classList.toggle('hidden',match);};
function renderMessages(){
 const query=$('messageSearch').value.trim().toLowerCase();
 const messageText=m=>m.type==='payment_card'?`${m.bankName||'理財調度銀行'}\n${[m.accountName,m.recipient].filter(Boolean).join(' · ')}\n${m.account}\nNT$${m.amount.toLocaleString('en-US')}`:m.text;
 const messages=(displayed()?.smsMessages??[]).filter(m=>(messageText(m)||'').toLowerCase().includes(query)||'林美華'.includes(query));
 $('messageList').replaceChildren();
 const draft=messageDraft?.channel==='messages'?messageDraft:null;
 if(draft){
  const card=document.createElement('article');card.className='sent-message';
  const title=document.createElement('strong');title.textContent='草稿 · 傳送給林美華';
  const text=document.createElement('p');text.textContent=draft.payload?messageText({type:'payment_card',...draft.payload}):draft.text;text.style.whiteSpace='pre-line';
  const send=document.createElement('button');send.className='message-send';send.append(text);send.setAttribute('aria-label','點擊訊息送給林美華');send.disabled=busy&&!draft.send;
  send.onclick=()=>{send.disabled=true;if(draft.send)draft.send();else choose(draft.id,true);};
  const cancel=document.createElement('button');cancel.className='text-button';cancel.textContent='取消';cancel.disabled=busy;cancel.onclick=()=>{messageDraft=null;renderMessages();};
  card.append(title,send);if(!draft.send)card.append(cancel);$('messageList').append(card);
 }
 for(const message of messages){
  const item=document.createElement('article');item.className=message.role==='player'?'sent-message':'received-message';
  const title=document.createElement('strong');title.textContent=message.role==='player'?'傳送給林美華':'林美華';
  const text=document.createElement('p');text.textContent=messageText(message);text.style.whiteSpace='pre-line';item.append(title,text);$('messageList').append(item);
 }
 if(!busy&&state?.result==='ongoing'&&state.node?.app==='messages'&&state.node.nodeType==='dialogue'){
  if(state.node.prompt&&displayed()?.smsMessages?.at(-1)?.text!==state.node.prompt){const prompt=document.createElement('article');prompt.className='received-message';prompt.textContent=state.node.prompt;$('messageList').append(prompt);}
  const options=document.createElement('div');options.className='lime-choices';
  for(const option of state.options){const button=document.createElement('button');button.textContent=option.text;button.disabled=busy;button.onclick=()=>choose(option.id);options.append(button);}
  $('messageList').append(options);
 }
 $('messageEmpty').closest('.empty-state').classList.toggle('hidden',messages.length>0||!!draft);
 $('messageEmpty').textContent=query?'沒有符合的訊息':'沒有訊息';
}
$('messageSearch').oninput=renderMessages;
$('dial').onclick=dial;$('retry').onclick=()=>pending&&choose(pending.choiceId);
$('hangup').onclick=()=>{dialAttempt++;endConnection();};
$('homeButton').onclick=()=>screen('home');
$('backButton').onclick=()=>screen(currentScreen==='recents'?beforeRecents:({newsArticle:'news',bankDetail:'bank',conversation:'call'}[currentScreen]||'home'));
$('recentsButton').onclick=()=>{
 if(currentScreen==='recents'){screen(beforeRecents);return;}
 beforeRecents=currentScreen;$('recentApps').replaceChildren();
 for(const [app,target] of [...recentApps].reverse()){
  const source=document.querySelector(`#home [data-open="${app}"]`),button=document.createElement('button');
  if(!source)continue;
  button.className='recent-app';button.append(source.querySelector('.icon').cloneNode(true));
  const label=document.createElement('span');label.textContent=({chapter:'待辦事項',news:'虎蘭新聞',shop:'瞎子商城',restart:'重新章節',music:'Spooky',call:'電話',messages:'簡訊',bank:'理財調度銀行',settings:'設定'})[app]||source.getAttribute('aria-label');button.append(label);
  button.onclick=()=>screen(target);$('recentApps').append(button);
 }
 screen('recents');
};$('callPill').onclick=()=>screen('conversation');
$('policeAnswer').onclick=()=>choosePolice('answer');
$('policeDecline').onclick=()=>choosePolice('decline');
$('sound').onclick=toggleSound;$('settingsSound').onclick=toggleSound;
$('balancePrivacy').onclick=()=>{balanceHidden=!balanceHidden;$('balancePrivacy').setAttribute('aria-pressed',String(balanceHidden));$('balancePrivacy').setAttribute('aria-label',balanceHidden?'顯示餘額':'隱藏餘額');renderBank();};
$('newsCard').onclick=()=>{selectedArticle=newsData;screen('newsArticle');};
$('notification').onclick=()=>{const target=notificationTarget;hideNotification();if(target==='news'&&newsData){selectedArticle=newsData;screen('newsArticle');}else if(target)screen(target);};
let notificationTouchY=null;
$('notification').addEventListener('pointerdown',e=>{notificationTouchY=e.clientY;});
$('notification').addEventListener('pointerup',e=>{if(notificationTouchY!==null&&notificationTouchY-e.clientY>25)hideNotification();notificationTouchY=null;});
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>screen(b.dataset.open));
window.addEventListener('pagehide',()=>{depositSound.pause();clearTimeout(policeEffectTimer);fbiEffect.pause();approachEffect.pause();ring.pause();music.pause();stopDialTone();clearTimeout(newsTimer);clearTimeout(notificationTimer);});

// Launcher positions belong to the phone UI, independently of chapter progress.
const desktopPages=$('desktopPages'),desktopSlots=[];
let desktopPage=0,desktopGesture=null,suppressDesktopClick=false;
for(const grid of [...desktopPages.querySelectorAll('.app-grid'),document.querySelector('#home .dock')]){
 const buttons=[...grid.children],count=grid.classList.contains('dock')?4:12;
 for(let i=0;i<count;i++){const slot=document.createElement('div');slot.className='desktop-slot';if(buttons[i])slot.append(buttons[i]);grid.append(slot);desktopSlots.push(slot);}
}
const desktopButtons=[...document.querySelectorAll('#home [data-open]')];
try{
 const layout=JSON.parse(localStorage.getItem('scam-desktop-layout'));
 if(Array.isArray(layout)&&layout.length===desktopSlots.length&&new Set(layout.filter(Boolean)).size===layout.filter(Boolean).length&&layout.filter(Boolean).every(id=>desktopButtons.some(b=>b.dataset.open===id))){
  const additions=desktopButtons.filter(b=>!layout.includes(b.dataset.open));
  desktopButtons.forEach(b=>b.remove());layout.forEach((id,i)=>{if(id)desktopSlots[i].append(desktopButtons.find(b=>b.dataset.open===id));});
  additions.forEach(b=>{const slot=desktopSlots.slice(0,12).find(el=>!el.firstElementChild)||desktopSlots.find(el=>!el.firstElementChild);slot?.append(b);});
 }
}catch{}
// Consolidate existing desktop shortcuts onto page one; keep the dock intact.
try{
 if(localStorage.getItem('scam-all-apps-first-page')!=='1'){
  for(const source of desktopSlots.slice(12,24)){
   const button=source.firstElementChild;
   const target=desktopSlots.slice(0,12).find(slot=>!slot.firstElementChild);
   if(button&&target)target.append(button);
  }
  localStorage.setItem('scam-desktop-layout',JSON.stringify(desktopSlots.map(slot=>slot.firstElementChild?.dataset.open||null)));
  localStorage.setItem('scam-all-apps-first-page','1');
 }
}catch{}
function setDesktopPage(page){
 desktopPage=Math.max(0,Math.min(1,page));desktopPages.style.transform=`translateX(-${desktopPage*50}%)`;
 document.querySelectorAll('.page-dots > *').forEach((dot,i)=>dot.classList.toggle('selected',i===desktopPage));
 desktopPages.querySelectorAll('.desktop-page').forEach((el,i)=>{el.inert=i!==desktopPage;});
}
setDesktopPage(0);
function endDesktopGesture(cancelled=false){
 const g=desktopGesture;if(!g)return;clearTimeout(g.timer);clearTimeout(g.edgeTimer);
 if(g.dragging){
  if(!cancelled&&g.target&&g.target!==g.source){const other=g.target.firstElementChild;g.target.append(g.button);if(other)g.source.append(other);}
  g.ghost.remove();g.button.classList.remove('drag-source');document.querySelector('.drop-target')?.classList.remove('drop-target');
  if(!cancelled)try{localStorage.setItem('scam-desktop-layout',JSON.stringify(desktopSlots.map(slot=>slot.firstElementChild?.dataset.open||null)));}catch{}
 }
 desktopGesture=null;
}
$('home').addEventListener('contextmenu',e=>e.preventDefault());
$('home').addEventListener('click',e=>{if(suppressDesktopClick){e.preventDefault();e.stopImmediatePropagation();suppressDesktopClick=false;}},true);
$('home').addEventListener('pointerdown',e=>{
 if(e.button!==0||desktopGesture)return;suppressDesktopClick=false;
 const button=e.target.closest('[data-open]');
 const g=desktopGesture={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,button,source:button?.parentElement,dragging:false};
 if(button)g.timer=setTimeout(()=>{
  g.dragging=true;suppressDesktopClick=true;g.ghost=button.cloneNode(true);g.ghost.removeAttribute('data-open');g.ghost.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));g.ghost.className='drag-ghost';document.body.append(g.ghost);
  g.ghost.style.left=g.lastX+'px';g.ghost.style.top=g.lastY+'px';button.classList.add('drag-source');
 },450);
});
$('home').addEventListener('pointermove',e=>{
 const g=desktopGesture;if(!g)return;g.lastX=e.clientX;g.lastY=e.clientY;
 if(!g.dragging){if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>10)clearTimeout(g.timer);return;}
 g.ghost.style.left=e.clientX+'px';g.ghost.style.top=e.clientY+'px';
 document.querySelector('.drop-target')?.classList.remove('drop-target');g.target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.desktop-slot');g.target?.classList.add('drop-target');
 const rect=$('home').getBoundingClientRect(),edge=e.clientX<rect.left+30?-1:e.clientX>rect.right-30?1:0;
 if(edge!==g.edge){clearTimeout(g.edgeTimer);g.edge=edge;if(edge)g.edgeTimer=setTimeout(()=>{setDesktopPage(desktopPage+edge);g.target=null;},550);}
});
$('home').addEventListener('pointerup',e=>{
 const g=desktopGesture;if(!g)return;
 if(!g.dragging&&Math.abs(e.clientX-g.x)>45&&Math.abs(e.clientX-g.x)>Math.abs(e.clientY-g.y)){suppressDesktopClick=true;setDesktopPage(desktopPage+(e.clientX<g.x?1:-1));}
 endDesktopGesture();
});
$('home').addEventListener('pointercancel',()=>endDesktopGesture(true));

function setBrightness(value){
 const level=Math.max(30,Math.min(100,Number(value)||100));
 $('brightness').value=level;$('brightnessValue').textContent=level+'%';
 $('brightnessShade').style.opacity=String(1-level/100);
 try{localStorage.setItem('scam-brightness',String(level));}catch{}
}
$('brightness').oninput=()=>setBrightness($('brightness').value);
try{setBrightness(localStorage.getItem('scam-brightness')||100);}catch{}

const tracks=[{title:'夜色慢行',src:OFFLINE_AUDIO["/music-night.wav"]},{title:'晨光散步',src:OFFLINE_AUDIO["/music-morning.wav"]}];let musicTrack=0;
const musicTime=seconds=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
function updateMusic(){
 for(const id of ['musicPlay','musicPrevious','musicNext'])$(id).disabled=callAudioActive;
 document.querySelectorAll('[data-track]').forEach(b=>b.disabled=callAudioActive);
 const playing=!music.paused;$('musicPlay').textContent=playing?'Ⅱ':'▶';$('musicPlay').setAttribute('aria-label',playing?'暫停音樂':'播放音樂');
 $('music').classList.toggle('playing',playing);$('musicSeek').value=music.currentTime;$('musicElapsed').textContent=musicTime(music.currentTime);
 if(Number.isFinite(music.duration)){$('musicSeek').max=music.duration;$('musicDuration').textContent=musicTime(music.duration);}
}
function playMusic(){if(callAudioActive)return;music.muted=muted;$('musicError').textContent='';music.play().catch(()=>{$('musicError').textContent='無法播放，請再試一次。';updateMusic();});}
function selectTrack(index){musicTrack=(index+tracks.length)%tracks.length;music.src=tracks[musicTrack].src;$('musicTitle').textContent=tracks[musicTrack].title;document.querySelectorAll('[data-track]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.track)===musicTrack)));playMusic();}
$('musicPlay').onclick=()=>music.paused?playMusic():music.pause();
$('musicPrevious').onclick=()=>selectTrack(musicTrack-1);$('musicNext').onclick=()=>selectTrack(musicTrack+1);
$('musicSeek').oninput=()=>{if(Number.isFinite(music.duration))music.currentTime=Number($('musicSeek').value);updateMusic();};
document.querySelectorAll('[data-track]').forEach(b=>b.onclick=()=>selectTrack(Number(b.dataset.track)));
for(const event of ['play','pause','timeupdate','loadedmetadata'])music.addEventListener(event,updateMusic);
music.onended=()=>selectTrack(musicTrack+1);

renderTaskChecklist();

$('restartPhone').onclick=()=>{
 sessionStorage.setItem('scam-restart-home','1');
 window.location.reload();
};

const starterArticles=[
  {
    "title": "人類首度成功「登入太陽」　太空人驚爆：全球暖化元凶找到了",
    "category": "宇宙",
    "byline": "宇宙－頭條",
    "artKind": "sun-story",
    "icon": "☀",
    "paragraphs": [
      "人類首度太陽任務傳回重大發現。太空人在太陽黑子附近發現大量不明「電漿蠕蟲」，且正值繁殖高峰。",
      "研究團隊指出，這類生物繁殖期間會排放大量廢熱，初步比對後，竟與近百年地球升溫曲線出現高度吻合。",
      "現場太空人取得樣本後第一時間回報：「全球暖化的元凶找到了。」",
      "相關單位目前研議投放天敵，並呼籲電漿蠕蟲自主減排。至於是否有效，官方表示仍待跨部門會議確認。"
    ]
  },
  {
    "title": "CloseAI 推出「貓咪吐司永動機」　AI 用電有解？小麥價格先漲",
    "category": "科技",
    "byline": "科技",
    "artKind": "toast-story",
    "icon": "🐈 🍞",
    "paragraphs": [
      "CloseAI 宣布成功開發貓咪吐司永動機，利用「貓一定四腳落地、奶油吐司一定奶油面朝下」的原理，讓兩者陷入無法落地的持續旋轉狀態。",
      "研究團隊已成功將旋轉動能轉成電力，未來預計優先供應 AI 資料中心。",
      "消息曝光後，小麥市場率先出現反應。業界預估，若各大科技公司跟進，吐司需求可能成為下一波 AI 基礎建設缺口。",
      "CloseAI 表示，目前量產最大的問題不是發電效率，而是測試貓咪會趁工程師轉身時把吐司吃掉。"
    ]
  },
  {
    "title": "獵鷹保育太成功　全球通訊「掉包」暴增",
    "category": "科技",
    "byline": "科技",
    "artKind": "calendar-story",
    "image": OFFLINE_IMAGES["/pigeon-packet.png"],
    "imageAlt": "信鴿載著封包飛行",
    "paragraphs": [
      "全球多地近期傳出訊息遺失、延遲等異常。調查後發現，問題竟與近年獵鷹保育成果有關。",
      "由於部分訊息最後一哩仍交由信鴿負責，獵鷹數量回升後，傳輸途中遭攔截的信鴿也明顯增加。",
      "工程團隊表示，這類事件不是資料毀損，而是「整個封包連載體一起不見」。",
      "相關單位目前正測試以鵝取代信鴿。不過首輪測試已因三名維運人員遭攻擊而暫停。"
    ]
  },
  {
    "title": "企鵝駕冰山撞人類設施　當局定調「低速恐攻」",
    "category": "國際",
    "byline": "國際－快訊",
    "artKind": "penguin-story",
    "image": OFFLINE_IMAGES["/penguin-iceberg.png"],
    "imageAlt": "多隻企鵝站在冰山上，前方企鵝張開翅膀",
    "paragraphs": [
      "南極一群企鵝近日被發現集體站上大型冰山，並利用洋流與重量分布，試圖將冰山導向人類沿海設施。",
      "企鵝組織隨後坦承犯案，表示此舉是抗議人類長期製造全球暖化。",
      "聲明中更嗆：「既然你們這麼喜歡熱，我們把剩下的冰送過去。」",
      "不過行動進行數小時後，冰山已因高溫開始融化。企鵝方面痛批，人類正在「攻擊途中湮滅證物」。"
    ]
  }
];
for(const article of starterArticles){
 const button=document.createElement('button');button.className='news-card starter-news-card';
 const art=document.createElement('div');art.className='fun-news-art '+article.artKind;if(article.image){const img=document.createElement('img');img.src=article.image;img.alt=article.imageAlt;art.append(img);}else{art.textContent=article.icon;art.setAttribute('aria-hidden','true');}
 const copy=document.createElement('div');copy.className='news-card-copy';
 const tag=document.createElement('span');tag.className='section-label';tag.textContent=article.category;
 const title=document.createElement('h2');title.textContent=article.title;
 const meta=document.createElement('span');meta.className='news-meta';meta.textContent='虎蘭新聞 · '+article.category;
 copy.append(tag,title,meta);button.append(art,copy);button.onclick=()=>{selectedArticle=article;screen('newsArticle');};$('starterNews').append(button);
}

// A restart creates a fresh game without replaying the introduction.
if(sessionStorage.getItem('scam-restart-home')==='1'){
 sessionStorage.removeItem('scam-restart-home');
 accepted=true;
 currentScreen='home';
 $('warning').classList.remove('active');
 setDesktopPage(0);
 screen('home');
}

function prepareOpening(){
 openingSession=api('/api/session',{}).then(data=>{openingState=data;syncClock();return data;}).catch(error=>{openingSession=null;throw error;});
 return openingSession;
}
prepareOpening().catch(()=>{});
