
const OFFLINE_AUDIO={"/dial.wav":"./assets/dial.wav","/ring.wav":"./assets/ring.wav","/deposit.wav":"./assets/deposit.wav","/police-approach.wav":"./assets/police-approach.wav","/music-night.wav":"./assets/music-night.wav","/music-morning.wav":"./assets/music-morning.wav","/fbi-open-up-sfx.mp3":"./assets/fbi-open-up-sfx.mp3"},OFFLINE_IMAGES={"/penguin-iceberg.png":"./assets/penguin-iceberg.png","/pigeon-packet.png":"./assets/pigeon-packet.png"};
function randomInt(max){const limit=Math.floor(4294967296/max)*max;const value=new Uint32Array(1);do{crypto.getRandomValues(value);}while(value[0]>=limit);return value[0]%max;}

function loadDialogueTable(){return OFFLINE_TABLE;}
const addFacts=(current,more=[])=>[...new Set([...current,...more])];
const byFact=(value,s)=>{if(!value)return undefined;for(const [fact,text] of Object.entries(value))if(s.facts.includes(fact))return text;};
const matches=(route,facts)=>(route.facts??[route.fact]).every(f=>facts.includes(f));
const presentation=s=>structuredClone({messages:s.messages,smsMessages:s.smsMessages,limeConnected:s.facts.includes('new_contact_established'),blockedContacts:s.blockedContacts,bankBalance:s.bankBalance,currentDateLabel:s.currentDateLabel,currentTime:s.currentTime});
const publicNode=(node,s)=>node?.nodeType==='app_action'?{id:node.id,nodeType:node.nodeType,app:node.app,action:node.action,prompt:node.prompt,target:node.target,payload:node.payload}:node?{id:node.id,nodeType:node.nodeType,app:node.app,prompt:byFact(node.promptByFact,s)??node.prompt}:null;

function endingNewsKey(s){
 const topic=s.story.urgent_event==='accident'?'accident':s.story.money_route;
 if(s.result==='success')return topic+'_success';
 if(!s.story.moneyMentioned&&topic!=='accident')return 'pre_money_advisory';
 if(topic==='game_card')return 'game_card_advisory';
 if(!['accident','stock_goods','friend_debt'].includes(topic))return 'money_request_advisory';
 const outcome=s.endingCode==='bank_intervention'?'bank_intervention':s.endingCode==='delay_exposed'?'exposed':'verification';
 return topic+'_'+outcome;
}

class TableGame{
  constructor(table=loadDialogueTable(),pickIndex=randomInt,randomFloat=Math.random,now=()=>new Date()){this.table=table;this.pickIndex=pickIndex;this.randomFloat=randomFloat;this.now=now;}
  create(timeBand){
    const optionOrders=Object.fromEntries(Object.values(this.table.nodes).filter(n=>n.nodeType==='dialogue').map(n=>{
      const order=n.choices.map(c=>c.id);for(let i=order.length-1;i>0;i--){const j=this.pickIndex(i+1);[order[i],order[j]]=[order[j],order[i]];}return [n.id,order];
    }));
    const now=new Date(this.now());timeBand=timeBand??(this.randomFloat()<0.5?'day':'night');now.setHours(timeBand==='day'?14:20,0,0,0);const entry=this.table.entryByTime?.[timeBand]??this.table.entry;
    return {conversationApp:'phone',timeBand,story:{timeBand},optionOrders,currentNode:entry,visited:[entry],facts:[],messages:[],smsMessages:[],history:[{role:'player',text:'喂，是我啦。'}],interactions:0,actions:0,result:'ongoing',endingCode:null,bankBalance:0,blockedContacts:[],storyDate:new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes()).toISOString(),currentDateLabel:new Intl.DateTimeFormat('zh-TW',{month:'long',day:'numeric',weekday:'long'}).format(now),currentTime:`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,randomEvents:{dajiaMazuTosses:[],dajiaMazuFinal:null},completed:new Map()};
  }
  node(s){return this.table.nodes[s.currentNode];}
  menu(s){
    if(s.result!=='ongoing')return [];
    const node=this.node(s);if(node?.nodeType!=='dialogue')return [];
    if(!(node.requiredFacts??[]).every(f=>s.facts.includes(f)))throw Error('本章分支與已知情境不符。');
    return node.choices;
  }
  view(s,events=[]){
    const node=this.node(s);return {npc:this.table.npc,limeConnected:s.facts.includes('new_contact_established'),timeBand:s.timeBand,story:{...s.story},result:s.result,endingCode:s.endingCode,node:publicNode(node,s),events:events.map(x=>structuredClone(x)),messages:s.messages.map(x=>({...x})),smsMessages:(s.smsMessages??[]).map(x=>({...x})),history:s.history.map(x=>({...x})),interactions:s.interactions,actions:s.actions,bankBalance:s.bankBalance,blockedContacts:[...s.blockedContacts],currentDateLabel:s.currentDateLabel,currentTime:s.currentTime,randomEvents:structuredClone(s.randomEvents),options:this.menu(s).map(c=>({id:c.id,text:byFact(c.textByFact,s)??c.text,display:c.display,channel:c.channel,payload:c.payload})).sort((a,b)=>s.optionOrders[s.currentNode].indexOf(a.id)-s.optionOrders[s.currentNode].indexOf(b.id))};
  }
  route(s,next){if(!next||!this.table.nodes[next])throw Error('本章後續節點不存在。');if(s.visited.includes(next))throw Error('本章不能重新進入已走過的節點。');s.currentNode=next;s.visited.push(next);}
  resolveAutomaticNodes(s){
    const events=[];let hops=0;
    while(s.result==='ongoing'){
      if(++hops>32)throw Error('自動事件超過安全上限。');
      const node=this.node(s);if(!node)throw Error('本章節點不存在。');
      if(node.nodeType==='dialogue'){
        if(node.app==='lime'&&!s.facts.includes('new_contact_established'))throw Error('對方尚未接受 LIME 好友邀請。');
        const route=(node.conditionRoutes??[]).find(x=>matches(x,s.facts));if(route){this.route(s,route.next);continue;}break;
      }
      if(node.nodeType==='app_action')break;
      if(node.nodeType==='time_skip'){
        const date=new Date(s.storyDate);if(node.afterMinutes!=null)date.setMinutes(date.getMinutes()+node.afterMinutes);else if(node.afterHours!=null)date.setHours(date.getHours()+node.afterHours);else{date.setDate(date.getDate()+(node.afterDays??0));const [h,m]=node.time.split(':').map(Number);date.setHours(h,m);}s.storyDate=date.toISOString();s.currentDateLabel=new Intl.DateTimeFormat('zh-TW',{month:'long',day:'numeric',weekday:'long'}).format(date);s.currentTime=`${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;events.push({type:'time_skip',label:node.label,dateLabel:s.currentDateLabel,time:s.currentTime,presentation:presentation(s)});this.route(s,node.next);continue;
      }
      if(node.nodeType==='auto_event'){
        if(node.event.type==='lime_accept'&&!s.facts.includes('lime_friend_request_sent'))throw Error('尚未送出 LIME 好友邀請。');
        if(['lime_message','lime_lines','lime_payment'].includes(node.event.type)&&!s.facts.includes('new_contact_established'))throw Error('對方尚未接受 LIME 好友邀請。');
        s.facts=addFacts(s.facts,node.factsAdded);Object.assign(s.story,node.stateSet);const event=structuredClone(node.event);event.messages=[...(event.messages??[]),...(byFact(event.messagesByFact,s)??[])];delete event.messagesByFact;if(event.linesByFact){event.lines=byFact(event.linesByFact,s)??event.lines;delete event.linesByFact;}events.push(event);
        if(['lime_message','lime_accept','lime_lines','lime_payment'].includes(event.type))s.conversationApp='lime';if(['sms_message','sms_payment','sms_delivery_failed'].includes(event.type))s.conversationApp='messages';
        if(event.lines)s.history.push(...event.lines);
        if(event.type==='lime_lines')s.messages.push(...event.lines);
        if(event.type==='lime_payment'){s.messages.push({role:'player',type:'payment_card',...event.payload});}
        if(event.type==='sms_payment')s.smsMessages.push({role:'player',type:'payment_card',...event.payload});
        if(event.type==='sms_delivery_failed')s.smsMessages.push({role:'system',text:'訊息傳送失敗'});
        if(event.type==='funds_received')event.channel=s.conversationApp;
        if(event.type==='failure_now'){event.channel=s.conversationApp||'phone';event.blocked=!!event.blocked&&event.channel==='lime'&&s.facts.includes('new_contact_established');}
        for(const text of event.messages??[]){if(event.type==='failure_now'&&event.channel==='phone')s.history.push({role:'npc',text});else if(s.conversationApp==='messages')s.smsMessages.push({role:'npc',text});else s.messages.push({role:'npc',text});}
        if(event.type==='failure_now'){s.endingCode=event.cause;if(event.blocked){s.blockedContacts=addFacts(s.blockedContacts,['林美華']);s.messages.push({role:'system',text:'訊息傳送失敗'},{role:'system',text:'你已無法傳送訊息給此使用者'});}}
        if(event.type==='funds_received'){event.amount=event.amountFromStory?s.story.amount:event.amount;s.bankBalance=event.amount;}
        if(event.type==='bank_frozen')s.bankBalance=0;
        event.presentation=presentation(s);
        this.route(s,(node.conditionRoutes??[]).find(r=>matches(r,s.facts))?.next??node.next);continue;
      }
      if(node.nodeType==='random_event'){
        const tosses=[];let final=null;
        for(let i=1;i<=node.maxRandomTosses;i++){
          const value=this.randomFloat();const result=value<node.probabilities.holy?'holy':value<node.probabilities.holy+node.probabilities.laugh?'laugh':'yin';tosses.push(result);if(result!=='laugh'){final=result;break;}
        }
        if(!final){final=node.forcedToss.result;tosses.push(final);}
        s.randomEvents={dajiaMazuTosses:tosses,dajiaMazuFinal:final};events.push({type:'dajia_mazu',tosses:[...tosses],final,autoStart:!!node.autoStart,presentation:presentation(s)});this.route(s,final==='holy'?node.onHoly:node.onYin);continue;
      }
      if(node.nodeType==='terminal'){s.result=node.result;s.endingCode=node.endingCodeFromStory?s.story.endingCode:node.endingCodeFromState?s.endingCode:node.endingCode;events.push({type:'terminal',result:s.result,endingCode:s.endingCode,newsKey:endingNewsKey(s),news:this.table.eventNews[endingNewsKey(s)],story:{...s.story},sources:this.table.provenance.sources,presentation:presentation(s)});break;}
      throw Error('不支援的節點類型。');
    }
    return events;
  }
  complete(s,key,value){s.completed.set(key,{value:structuredClone(value)});return value;}
  async play(s,choiceId,requestId){
    const cached=s.completed.get(requestId);if(cached)return structuredClone(cached.value);
    if(s.result!=='ongoing')throw Error('本章已結束。');const node=this.node(s);if(node?.nodeType!=='dialogue')throw Error('目前不是對話選擇。');
    const choice=this.menu(s).find(c=>c.id===choiceId);if(!choice)throw Error('只接受目前畫面上的預設選項。');
    if(choice.countsInteraction!==false&&s.interactions+1>this.table.maxInteractions)throw Error('本章路徑超過互動上限，請檢查章節資料。');
    s.conversationApp=choice.display==='payment_card'?(choice.channel||'lime'):node.app;
    const nextFacts=addFacts(s.facts,[...(node.factsAdded??[]),...(choice.factsAdded??[])]);const conditional=(choice.conditionRoutes??[]).find(r=>matches(r,nextFacts));
    const text=byFact(choice.textByFact,s)??choice.text,reply=conditional?.reply??byFact(choice.replyByFact,s)??choice.reply;
    if(choice.countsInteraction!==false)s.interactions++;s.facts=addFacts(s.facts,[...(node.factsAdded??[]),...(choice.factsAdded??[])]);Object.assign(s.story,node.stateSet,choice.stateSet);s.history.push({role:'player',text});if(choice.fixedFollowup)s.history.push({role:'npc',text:choice.npcQuestion},{role:'player',text:choice.fixedFollowup});s.history.push({role:'npc',text:reply});s.history=s.history.slice(-24);if(choice.display==='payment_card'){const payload=structuredClone(choice.payload);if(payload.amountFromStory)payload.amount=s.story.amount;delete payload.amountFromStory;if(choice.channel==='messages')s.smsMessages.push({role:'player',type:'payment_card',...payload});else s.messages.push({role:'player',type:'payment_card',...payload},{role:'npc',text:choice.npcQuestion},{role:'player',text:choice.fixedFollowup},{role:'npc',text:reply});}else if(node.app==='lime')s.messages.push({role:'player',text},{role:'npc',text:reply});else if(node.app==='messages')s.smsMessages.push({role:'player',text},{role:'npc',text:reply});this.route(s,conditional?.next??choice.next);
    const beforeEvents=presentation(s),events=this.resolveAutomaticNodes(s);return this.complete(s,requestId,{...this.view(s,events),beforeEvents,reply});
  }
  async performAction(s,action,requestId){
    const cached=s.completed.get(requestId);if(cached)return structuredClone(cached.value);
    if(s.result!=='ongoing')throw Error('本章已結束。');const node=this.node(s);if(node?.nodeType!=='app_action'||node.action!==action)throw Error('目前無法執行此操作。');
    if(action==='send_friend_request'&&s.facts.includes('lime_friend_request_sent'))throw Error('好友邀請已送出。');
    if(node.app==='lime'&&action!=='send_friend_request'&&!s.facts.includes('new_contact_established'))throw Error('對方尚未接受 LIME 好友邀請。');
    if(action==='send_payment_details'&&s.facts.includes('payment_details_sent'))throw Error('收款資料已傳送。');
    if(action.startsWith('send_')&&s.blockedContacts.includes(node.target))throw Error('你已無法傳送訊息給此使用者。');
    if(action==='say_amount')s.history.push({role:'player',text:node.target});
    s.actions++;s.facts=addFacts(s.facts,node.factsAdded);Object.assign(s.story,node.stateSet);if(action==='send_payment_details')s.messages.push({role:'player',type:'payment_card',...node.payload});this.route(s,node.next);
    const beforeEvents=presentation(s),events=this.resolveAutomaticNodes(s);return this.complete(s,requestId,{...this.view(s,events),beforeEvents});
  }
}

async function validateGraph(table){
  const roots=table.entryByTime?Object.values(table.entryByTime):[table.entry];
  if(!Number.isInteger(table.maxInteractions)||table.maxInteractions<1||table.maxInteractions>30)throw Error('Invalid interaction limit');if(!roots.length||roots.some(root=>!table.nodes?.[root]))throw Error('Missing entry');
  const active=new Set(),checked=new Set(),choiceIds=new Set(),nodeTypes=new Set(['dialogue','app_action','time_skip','auto_event','random_event','terminal']);
  const edges=node=>node.nodeType==='dialogue'?[...node.choices.flatMap(c=>[c.next,...(c.conditionRoutes??[]).map(x=>x.next)]),...(node.conditionRoutes??[]).map(x=>x.next)]:node.nodeType==='random_event'?[node.onHoly,node.onYin]:node.nodeType==='terminal'?[]:[node.next,...(node.conditionRoutes??[]).map(r=>r.next)];
  function visit(id){if(active.has(id))throw Error('Node cycle: '+id);if(checked.has(id))return;const n=table.nodes[id];if(!n||n.id!==id||!nodeTypes.has(n.nodeType))throw Error('Invalid node: '+id);
    if(n.nodeType==='dialogue'){if(n.choices?.length!==3||new Set(n.choices.map(c=>c.id)).size!==3)throw Error('Invalid branch menu: '+id);for(const [slot,c] of n.choices.entries()){if(choiceIds.has(c.id)||c.slot!==slot||!c.text?.trim()||!c.reply?.trim()||c.result!=='ongoing'||!c.next)throw Error('Invalid option: '+c.id);choiceIds.add(c.id);}}
    if(n.nodeType==='app_action'&&(!n.app||!n.action||!n.next))throw Error('Invalid app action: '+id);
    if(n.nodeType==='time_skip'&&(!n.label||!n.dateLabel||!/^\d\d:\d\d$/.test(n.time)||!n.next))throw Error('Invalid time skip: '+id);
    if(n.nodeType==='auto_event'&&(!n.event?.type||!n.next))throw Error('Invalid auto event: '+id);
    if(n.nodeType==='random_event'){const p=n.probabilities;if(!p||Math.abs(p.holy+p.laugh+p.yin-1)>1e-9||Object.values(p).some(x=>x<0)||n.forcedToss?.index!==6||n.forcedToss?.result!=='holy')throw Error('Invalid random event: '+id);}
    if(n.nodeType==='terminal'&&(!['success','failure'].includes(n.result)||'next' in n))throw Error('Invalid terminal: '+id);
    active.add(id);for(const next of edges(n)){if(!table.nodes[next])throw Error('Missing node: '+next);visit(next);}active.delete(id);checked.add(id);
  }for(const root of roots)visit(root);
  if(checked.size!==Object.keys(table.nodes).length)throw Error('Unreachable nodes');
  let longest=0;const successTerminals=new Set(),failureCauses=new Set();
  function walk(id,count,facts){const n=table.nodes[id];if(n.nodeType==='dialogue'){const forced=(n.conditionRoutes??[]).find(x=>facts.has(x.fact));if(forced)return walk(forced.next,count,facts);for(const c of n.choices){const nextFacts=new Set([...facts,...(n.factsAdded??[]),...(c.factsAdded??[])]);const conditional=(c.conditionRoutes??[]).find(r=>(r.facts??[]).every(f=>nextFacts.has(f)));walk(conditional?.next??c.next,count+(c.countsInteraction===false?0:1),nextFacts);}return;}if(n.nodeType==='terminal'){longest=Math.max(longest,count);if(n.result==='success')successTerminals.add(id);return;}if(n.nodeType==='auto_event'&&n.event.cause)failureCauses.add(n.event.cause);if(n.nodeType==='random_event'){walk(n.onHoly,count,facts);walk(n.onYin,count,facts);}else {const nextFacts=new Set([...facts,...(n.factsAdded??[])]);walk((n.conditionRoutes??[]).find(r=>matches(r,[...nextFacts]))?.next??n.next,count,nextFacts);}}
  for(const root of roots)walk(root,0,new Set());if(longest>table.maxInteractions||longest>table.maxStoryInteractions)throw Error('Path exceeds chapter bound');
  return {reachableNodes:checked.size,longestPlayerInteractionPath:longest,successTerminalCount:successTerminals.size,failureCauseCount:failureCauses.size,randomEventValidation:'passed'};
}

function measureRandomEvents(table){const n=Object.values(table.nodes).find(x=>x.nodeType==='random_event');const p=n.probabilities;return {holy:p.holy,laugh:p.laugh,yin:p.yin,forcedSixth:n.forcedToss.result,dajiaMazuConditionalSuccess:p.holy*(1-p.laugh**n.maxRandomTosses)/(1-p.laugh)+p.laugh**n.maxRandomTosses};}

async function measureBalance(table){
  const random=measureRandomEvents(table);let reach=0;
  function walk(id,prob,facts){const n=table.nodes[id];if(n.nodeType==='random_event'){reach+=prob;return;}if(n.nodeType==='terminal')return;if(n.nodeType==='dialogue'){const forced=(n.conditionRoutes??[]).find(x=>facts.has(x.fact));if(forced)return walk(forced.next,prob,facts);for(const c of n.choices){const nextFacts=new Set([...facts,...(n.factsAdded??[]),...(c.factsAdded??[])]);const conditional=(c.conditionRoutes??[]).find(r=>(r.facts??[]).every(f=>nextFacts.has(f)));walk(conditional?.next??c.next,prob/3,nextFacts);}return;}const nextFacts=new Set([...facts,...(n.factsAdded??[])]);walk((n.conditionRoutes??[]).find(r=>matches(r,[...nextFacts]))?.next??n.next,prob,nextFacts);}
  const roots=table.entryByTime?Object.values(table.entryByTime):[table.entry];for(const root of roots)walk(root,1/roots.length,new Set());return {choiceAssumption:'uniform visible choices and time bands',storyReachProbability:reach,dajiaMazuConditionalSuccess:random.dajiaMazuConditionalSuccess,overallSuccess:reach*random.dajiaMazuConditionalSuccess};
}

const offlineGame=new TableGame();let offlineSession;
async function offlineApi(path,body){
 if(path==='/api/session'){offlineSession=offlineGame.create();return {sessionId:'local-demo',...offlineGame.view(offlineSession)};}
 if(path==='/api/choice'&&offlineSession&&body.sessionId==='local-demo')return offlineGame.play(offlineSession,body.choiceId,body.requestId);
 if(path==='/api/action'&&offlineSession&&body.sessionId==='local-demo')return offlineGame.performAction(offlineSession,body.action,body.requestId);
 throw Error('請重新開始本輪。');
}
