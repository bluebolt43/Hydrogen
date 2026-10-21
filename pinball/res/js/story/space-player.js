'use strict';
const PATHS=SPACE_STORY.paths,SCENES=SPACE_STORY.scenes||{},ASSET_RECTS=SPACE_STORY.assetRects||{};
const BEATS=[
 [0,'挖礦：Q 版太空人在小型隕石群中採礦，飛船在上方遠處'],
 [5,'呼叫支援：故障工具與對講機的漫畫分鏡'],
 [9,'主角靠近，觀察礦工手上的故障工具'],
 [14,'機神奶奶的小神壇：空供台'],[18,'艙外工具仍然故障，亮紅燈冒煙'],[22,'一盤餅乾放上供台'],[26,'機神奶奶石像發光'],[30,'工具恢復：紅燈轉綠，停止冒煙'],[34,'太空人開心歡呼'],[38,'宇宙海賊船闖入隕石群'],[43,'腕部視訊接通，海賊頭像出現'],[45,'海賊的對話框：餅乾交給我'],[49,'對話框切換：不交就砲擊礦船'],[53,'CH1 END：敵人太空船爆炸'],[57,'海賊倒地，仍然想著餅乾'],[63,'主角回到自己的船艙，拿出餅乾吃掉'],[70,'海賊從視訊看到餅乾被吃掉，當場暈倒'],[77,'CH2 START：金馬桶座王國的星球'],[81,'聚焦皇宮'],[85,'聚焦國王與黃金馬桶王座'],[89,'白色捲假髮、八字鬍財務大臣口頭報告'],[91,'大臣對話泡泡：餅乾金庫與向下走勢圖'],[95,'人民把餅乾放在奶奶石像前，雙手合十拜'],[100,'國王低頭看自己空掉的點心盤'],[104,'國王從陽台看見人民供餅乾，稅務官拿空箱被晾在一旁'],[110,'國王氣得臉色扭曲'],[114,'國王向財務大臣下令'],[116,'國王對話泡泡：機神奶奶＋餅乾'],[118,'大紅叉狠狠蓋下，禁止供奉'],[122,'國王段落淡出'],[123,'黑畫面停留'],[125,'王國飛船畫面緩緩淡入'],[127,'王國飛船靠近主角飛船，保持距離'],[131,'稅收官看到機神奶奶祭壇，主角在旁微笑'],[137,'稅收官直接拿走餅乾供品'],[141,'稅收官收走供品後離開，主角留在空祭壇旁愣住'],[151,'CH2 END：箱子飛起，主角接住並打開'],[158,'主角拿出少一口的餅乾，望向裝死的稅收官'],[166,'CH3 START：主角飛船獨自停留在隕石群'],[167,'難民船淡入靠近主角飛船'],[168.5,'兩艘船停留片刻，準備接通視訊'],[170,'主角在船內控制室，螢幕出現難民代表視訊'],[176,'難民對話泡泡：餅乾與機神奶奶被打紅叉'],[180,'難民對話泡泡：正常機械變成故障機械'],[185,'控制室視訊淡出'],[186,'淡入難民船外景'],[188.5,'難民船外景出現紅色閃光'],[189.3,'淡入王國追擊執行隊躍遷畫面'],[196,'CH3 END：王國追擊機爆炸'],[202,'難民向主角遞餅乾致謝，主角接過'],[208,'主角拿著餅乾望向遠方，頭旁浮現反抗起義思考泡泡'],[214,'CH4 START：接續主角艙內決心畫面'],[217,'主角在金屬艙內攤開地圖'],[222,'難民圍著地圖，主角指向點心強盜旗幟'],[232,'點心強盜旗幟下，盜賊搶走皇家點心運輸車的甜點'],[239,'盜賊頭目坐在點心山上狂吃'],[246,'主角在控制室與盜賊頭目視訊對話'],[253,'主角指向王國方向，邀請一起反抗'],[255,'主角指向王國方向，邀請一起反抗'],[260,'螢幕中的盜賊頭目擺手拒絕'],[266,'CH4 END：主角拿出一箱餅乾'],[272,'盜賊頭目開心抱住餅乾箱'],[278,'頭目撕掉強盜旗換上反抗軍旗，其他盜賊趁機偷吃餅乾'],[286,'CH5 START：星球監獄外觀'],[293,'大量民眾被關在牢房裡'],[300,'漫畫子視窗：囚犯偷偷拿糖，準備放在機器旁祈禱'],[307,'監獄長發現囚犯偷偷拿糖'],[311,'監獄長立刻吹哨'],[315,'監獄長把糖丟向沒收的奶奶石像與點心堆'],[322,'監獄長從監視器看見主角與反抗軍飛船出現在監獄外'],[329,'CH5 END：牢房門仍關著'],[332,'牢房門打開，民眾準備走出牢房'],[337,'民眾爭相拿回點心，供奉機神奶奶並合十祈禱'],[345,'CH6 START：反抗軍船隊包圍王宮'],[353,'國王坐在黃金馬桶王座上，看見主角與後方的點心大盜'],[360,'主角對話泡泡：人民供奉機神奶奶'],[364,'國王以紅叉對話泡泡拒絕'],[368,'子視窗：國王扳下黃金馬桶沖水桿'],[372,'合體漫畫：機械腳、大砲、推進器與馬桶蓋盾牌展開'],[384,'CH6 END：黃金馬桶機器人爆炸'],[390,'國王掉到地上，頭上的王冠歪掉'],[397,'CH7 START：主角把餅乾放到機神奶奶像前'],[402,'大家一起祈禱，等待後機器仍沒有反應'],[409,'大家再祈禱一次，機器不動，開始冒汗'],[415,'供品加成餅乾山，機器還是沒有反應'],[422,'國王得意地慢慢指向主角'],[427,'子視窗：主角側頭瞪國王'],[433,'王座廳上方空間開始撕裂'],[436,'空間裂縫完全張開，停留後切到皇宮遭破壞的全景'],[444,'飛天義大利麵摧毀皇宮'],[453,'低速運鏡：主角、國王、點心大盜與民眾驚慌逃亡'],[473,'CH7 END：怪獸倒下，天空仍未恢復'],[480,'機神牧師登場，抱著合起的書，其他人看向他'],[485,'牧師把書攤開，大家看向書本'],[493,'牧師以圖像泡泡說明禁止祭拜導致機神生氣'],[496,'圖像泡泡：人民祭拜被禁止，箭頭指向生氣的機神奶奶'],[503,'所有人看向國王，國王縮起來'],[510,"CH8 START：遠處宇宙出現巨大光芒"],[515,"星球大小的機神奶奶出現在遠方宇宙；小神像旁祭壇的供品盤完全空著"],[522,"主角拿出一片餅乾，準備供奉"],[527,"子視窗：主角與國王雙手拉扯餅乾"],[531,"子視窗：雙手繼續拉扯餅乾"],[534,"子視窗：餅乾碰地碎裂"],[538,"機神奶奶明顯發怒：怒眉、咬牙、紅眼"],[544,"CH8 ENDING：奶奶頭部直立，從發怒恢復無表情"],[550,"主角翻找口袋，其他人也找，全部沒有餅乾"],[556,"國王慢慢伸進王袍，拿出最後一片餅乾"],[561,"國王抱著餅乾，搖頭不肯交出"],[566,"所有人一起瞪著國王"],[570,"國王最後哭著把餅乾交給主角"],[576,"主角把餅乾放上小神像旁祭壇的供品盤"],[582,"機神奶奶露出笑容"],[586,"小神像開始發光"],[590,"世界各地故障機器：七格靜態分頁"],[592,"奶奶石像淡入至 60% 不透明"],[594,"石像發光，神力音效"],[596,"故障分頁淡入正常狀態，所有機器恢復"],[598,"機器恢復後，奶奶石像淡出"],[600,"世界各地機器正常運轉"],[602,"所有人一起歡呼"],[610,"Steampunk END mask 淡入"],[616.5,"END 字卡淡入"],[619,"結尾淡出全黑"]
];
const W=941,H=1672,INTRO_DURATION=SPACE_STORY.introDuration,DURATION=SPACE_STORY.duration;
const FULL=[0,0,W,H],TOOL_CLOSE=[225,550,480,480*H/W];
const canvas=document.getElementById('film'),ctx=canvas.getContext('2d',{alpha:false}),images={};
const params=new URLSearchParams(location.search);
if(params.has('debug'))document.body.classList.add('debug');
const hosted=!!window.AppProgress;
const soundtrack=new SpaceStorySoundtrack(SPACE_STORY.audio,{hosted});
const pageChapter=SPACE_STORY.chapters.find(c=>c.chapter===Number(document.body.dataset.storyChapter)&&c.part===document.body.dataset.storyPart);
let completionSent=false;
function activeChapter(){return SPACE_STORY.chapters.find(c=>c.timelinePart===chapterPart);}
function completeStory(skipped=false){if(completionSent)return;completionSent=true;const chapter=activeChapter();if(!skipped){if(window.AppProgress)window.AppProgress.markSeen(chapter.id);else localStorage.setItem('pinball-space-story-seen-v1:'+chapter.id,'1');}document.getElementById('story-skip').hidden=true;window.dispatchEvent(new CustomEvent('story:complete',{detail:{chapter:chapter.id}}));}
function syncStorySkip(){const c=activeChapter();document.getElementById('story-skip').hidden=!(hosted&&time>=INTRO_DURATION&&window.AppProgress.hasSeen(c.id));}
async function play(id=pageChapter?.id||activeChapter().id){soundtrack.unlock();await window.viewReady;document.getElementById("begin").hidden=true;const chapter=SPACE_STORY.chapters.find(c=>c.id===id);if(!chapter||pageChapter&&chapter.id!==pageChapter.id)return false;seek(chapter.start);syncStorySkip();setPlaying(true);return true;}

let ready=false,playing=false,loop=false,time=0,last=0,chapterPart='start';
const CH1_END_START=143,CH2_START=167,CH2_END_START=241,CH3_START=256,CH3_END_START=286,CH4_START=304,CH4_END_START=356,CH5_START=376,CH5_END_START=419,CH6_START=435,CH6_END_START=474,CH7_START=487,CH7_END_START=563,CH8_START=600,CH8_END_START=634;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
function camera(rect){ctx.setTransform(W/rect[2],0,0,H/rect[3],-rect[0]*W/rect[2],-rect[1]*H/rect[3]);}
function drawArtwork(key,rect=FULL){
 if(SPACE_STORY.symbolBubbles?.[key]){drawSymbolBubble(key,rect);return;}
 const [x,y,w,h]=rect,scene=SCENES[key];
 if(scene){
  ctx.save();ctx.translate(x,y);ctx.scale(w/W,h/H);
  for(const layer of scene){
   if(layer.source){
    const [dx,dy,dw,dh]=layer.rect||FULL,[sx,sy,sw,sh]=layer.source;
    ctx.save();ctx.beginPath();ctx.rect(dx,dy,dw,dh);ctx.clip();ctx.translate(dx-sx*dw/sw,dy-sy*dh/sh);ctx.scale(dw/sw,dh/sh);drawArtwork(layer.key);ctx.restore();
   }else drawArtwork(layer.key,layer.rect||FULL);
  }
  ctx.restore();return;
 }
 const im=images[key];if(!im)throw new Error('Space image not loaded: '+key);
 const crop=ASSET_RECTS[key];
 if(crop)ctx.drawImage(im,x+w*crop[0]/W,y+h*crop[1]/H,w*crop[2]/W,h*crop[3]/H);
 else ctx.drawImage(im,x,y,w,h);
}
function drawSymbolBubble(key,[x,y,w,h]){
 const kind=SPACE_STORY.symbolBubbles[key];
 ctx.save();ctx.translate(x,y);ctx.scale(w/941,h/470);
 ctx.fillStyle='#fff9e9';ctx.strokeStyle='#223b56';ctx.lineWidth=9;ctx.lineJoin='round';
 // CH3's speaker is in the monitor above the bubble, rather than the hero below it.
 const monitorTail=key==='ch3BanBubble';
 ctx.beginPath();ctx.moveTo(90,15);
 if(monitorTail){ctx.lineTo(650,15);ctx.lineTo(760,-95);ctx.lineTo(800,15);}
 ctx.lineTo(850,15);ctx.quadraticCurveTo(925,15,925,90);ctx.lineTo(925,300);ctx.quadraticCurveTo(925,375,850,375);
 if(key==='ch2BanBubble'){ctx.lineTo(310,375);ctx.lineTo(160,455);ctx.lineTo(220,375);}
 else if(!monitorTail){ctx.lineTo(820,375);ctx.lineTo(900,455);ctx.lineTo(730,375);}
 ctx.lineTo(90,375);ctx.quadraticCurveTo(15,375,15,300);ctx.lineTo(15,90);ctx.quadraticCurveTo(15,15,90,15);ctx.closePath();ctx.fill();ctx.stroke();
 if(kind!=='cross'){
  for(const [icon,bx,by,bw,bh] of [['grandmaSymbol',125,35,330,320],['cookieSymbol',540,100,240,240]]){
   const im=images[icon],scale=Math.min(bw/im.width,bh/im.height);ctx.drawImage(im,bx+(bw-im.width*scale)/2,by+(bh-im.height*scale)/2,im.width*scale,im.height*scale);
  }
 }
 if(kind==='ban'||kind==='cross')drawProhibition(470,195,kind==='cross'?280:240);
 ctx.restore();
}
// Same separate emoji overlay as Pirate story's #ch8-speech-cross.
function drawProhibition(x,y,size){ctx.save();ctx.font=size+'px system-ui, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('❌',x,y);ctx.restore();}
function picture(key,rect=FULL,alpha=1){ctx.save();ctx.globalAlpha=alpha;camera(rect);drawArtwork(key);ctx.restore();}
function cookieInset(key){
 picture('ch8Offer');
 const [x,y,w,h]=[60,840,820,547];
 ctx.save();ctx.shadowColor='#0009';ctx.shadowBlur=18;ctx.fillStyle='#fff5df';ctx.fillRect(x-10,y-10,w+20,h+20);ctx.restore();
 drawArtwork(key,[x,y,w,h]);ctx.save();ctx.strokeStyle='#362d28';ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);ctx.restore();
}
// Each END foreground is one complete RGBA group: cast, altar and statue.
function endComposition(key,expression='neutral',amount=1,glow=0){
 picture('ch8EndNeutral');
 if(expression!=='neutral'){ctx.save();ctx.beginPath();ctx.rect(250,385,480,300);ctx.clip();picture(expression==='angry'?'ch8EndAngry':'ch8EndSmileFace',FULL,amount);ctx.restore();}
 picture(key);
 if(glow)picture(key+'Glow',FULL,glow);
}
function zoomRect(target,amount){const u=smooth(amount);return FULL.map((v,i)=>v+(target[i]-v)*u);}
function pirateVideo(t){
 ctx.save();picture('pirateBroadcast');
 const key=t<45?null:t<49?'demandBubble':'threatBubble';
 if(key){const start=t<49?45:49,amount=smooth((t-start)/.35),im=images[key],bw=740,bh=bw*im.height/im.width;
  ctx.globalAlpha=amount;ctx.translate(140+bw*.5,530+bh*.5);ctx.scale(.94+.06*amount,.94+.06*amount);ctx.drawImage(im,-bw*.5,-bh*.5,bw,bh);}
 ctx.restore();
}
function refugeeArrival(t){
 picture('spaceExteriorBase');
 const amount=smooth((t-167)/1.5);if(!amount)return;
 ctx.save();ctx.globalAlpha=amount;
 for(const layer of SCENES.refugeeExteriorBase)if(layer.key!=='spaceExteriorBase')drawArtwork(layer.key,layer.rect||FULL);
 ctx.restore();
}
function refugeeReport(t){
 picture('ch3Video');
 if(t<176)return;
 ctx.save();ctx.globalAlpha=smooth((t-176)/.3);drawArtwork('ch3BanBubble',[25,730,760,380]);ctx.restore();
}
function banditNegotiation(t){
 const refusal=t>=260;picture(refusal?'ch4Refuse':'ch4Invite');
 if(refusal)return;
 if(t>=254){ctx.save();ctx.globalAlpha=smooth((t-254)/.35);drawArtwork('ch4InviteBubble',[30,730,880,440]);ctx.restore();}
}
function ministerReport(t){
 picture('ch2King');
 ctx.save();ctx.globalAlpha=smooth((t-89)/.35);ctx.fillStyle='#fffdf8';ctx.fillRect(0,H*2/3,W,H/3);ctx.strokeStyle='#263444';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,H*2/3);ctx.lineTo(W,H*2/3);ctx.stroke();
 // The minister faces left; keep the bubble's existing right-hand tail toward him.
 ctx.beginPath();ctx.rect(0,H*2/3,W,H/3);ctx.clip();
 const minister=images.ministerReportObject,mw=410;
 ctx.drawImage(minister,530,1190,mw,mw*minister.height/minister.width);ctx.restore();
 if(t>=91){const key=t<95?'ch2SupplyBubble':'ch2PrayerBubble',width=590;ctx.save();ctx.globalAlpha=smooth((t-(t<95?91:95))/.4);drawArtwork(key,[20,1145,width,295]);ctx.restore();}
}

function kingTransformationPrelude(t){
 picture('ch6KingMeeting');
 if(t<360)return;
 if(t<368){
  const [x,y,w,h]=[20,15,760,380];
  ctx.save();ctx.globalAlpha=smooth((t-360)/.3);drawArtwork('ch6PrayerBubble',[x,y,w,h]);ctx.restore();
  if(t>=364){ctx.save();ctx.globalAlpha=smooth((t-364)/.3);drawProhibition(x+w*470/941,y+h*195/470,w*280/941);ctx.restore();}
  return;
 }
 const key='ch6LeverInset',w=790;
 ctx.save();ctx.globalAlpha=smooth((t-368)/.3);drawArtwork(key,[125,1030,w,w*images[key].height/images[key].width]);ctx.restore();
}
function panStoryImage(key,progress){
 const im=images[key],sw=Math.min(im.width,im.height*W/H),sx=(im.width-sw)*smooth(progress);
 ctx.save();ctx.drawImage(im,sx,0,sw,im.height,0,0,W,H);ctx.restore();
}
function kingBanOrder(t){
 ctx.save();const impact=clamp((t-118)/.32),shake=t>=118&&t<118.32?Math.sin(impact*28)*(1-impact)*9:0;
 ctx.translate(shake,-shake*.5);picture('ch2Order');
 if(t>=116){ctx.save();ctx.globalAlpha=smooth((t-116)/.35);drawArtwork('ch2BanBubble',[80,10,800,400]);ctx.restore();}
 if(t>=118){const progress=clamp((t-118)/.18),scale=1+1.2*(1-progress);ctx.save();ctx.translate(480,180);ctx.scale(scale,scale);ctx.globalAlpha=clamp(progress*3);drawProhibition(0,0,250);ctx.restore();}
 ctx.restore();
}
function shrineLight(t,strength){
 ctx.save();
 const pulse=strength*(.92+Math.sin(t*4)*.08);
 ctx.fillStyle=`rgba(15,12,24,${pulse*.22})`;ctx.fillRect(0,0,W,H);
 ctx.globalCompositeOperation='screen';
 const g=ctx.createRadialGradient(270,710,40,270,710,460);
 g.addColorStop(0,`rgba(255,250,205,${pulse*.88})`);g.addColorStop(.45,`rgba(255,210,95,${pulse*.6})`);g.addColorStop(1,'rgba(255,190,65,0)');
 ctx.fillStyle=g;ctx.fillRect(0,250,740,920);
 ctx.strokeStyle=`rgba(255,238,155,${pulse*.9})`;ctx.lineWidth=7;ctx.lineCap='round';
 for(let i=0;i<9;i++){const angle=-Math.PI+i*Math.PI/8;const x=270+Math.cos(angle)*205,y=700+Math.sin(angle)*280;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(angle)*45,y+Math.sin(angle)*55);ctx.stroke();}
 ctx.restore();
}

function worldMachinesRestoration(t){
 picture('ch8WorldBroken');
 if(t>=596)picture('ch8WorldRestored',FULL,smooth((t-596)/2));
 const fadeIn=smooth((t-592)/2),fadeOut=1-smooth((t-598)/2),alpha=.6*fadeIn*fadeOut;
 if(!alpha)return;
 const statue=images.grandmaSymbol,scale=Math.min(700/statue.width,1120/statue.height),w=statue.width*scale,h=statue.height*scale,glow=smooth((t-594)/.6)*fadeOut;
 ctx.save();ctx.globalAlpha=alpha;ctx.shadowColor='#fff0a8';ctx.shadowBlur=70*glow;ctx.filter=`brightness(${1+glow*.65})`;
 ctx.drawImage(statue,(W-w)/2,(H-h)/2,w,h);ctx.restore();
}
function sceneStateAt(t){
 let n=0;while(n+1<BEATS.length&&t>=BEATS[n+1][0])n++;
 return {beat:n,name:BEATS[n][1],time:t,cookies:t>=22&&t<30,glow:t>=26&&t<30,repaired:t>=30,cheering:t>=34&&t<38,pirates:t>=38};
}
function stateAt(t){return t<INTRO_DURATION?{beat:-1,name:'序幕：星空文字介紹',time:t}:sceneStateAt(t-INTRO_DURATION);}
const STARS=Array.from({length:180},(_,i)=>({x:((i*139.7+Math.sin(i*7.3)*230)%W+W)%W,y:((i*97.3+Math.cos(i*5.1)*550)%H+H)%H,r:.6+(i%5)*.34}));
let introPainted=false,introDistance=0;
function drawIntroduction(t){
 if(!introPainted){
  ctx.fillStyle='#03050c';ctx.fillRect(0,0,W,H);
  for(const star of STARS){ctx.fillStyle='rgba(224,230,248,'+(.3+.6*(.5+.5*Math.sin(star.x)))+')';ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fill();}
  introPainted=true;
 }
 const intro=document.getElementById('intro'),text=document.getElementById('crawl-text');
 if(!introDistance){const frame=document.querySelector('.frame');introDistance=frame.clientHeight*1.65+text.offsetHeight;}
 text.style.transform='translateY('+(-t/INTRO_DURATION*introDistance)+'px)';intro.style.opacity=String(1-clamp((t-INTRO_DURATION+2)/2));
}

function render(){
 if(!ready)return;
 ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
 if(time>=INTRO_DURATION){introPainted=false;ctx.fillStyle='#090b10';ctx.fillRect(0,0,W,H);}
 const introActive=time<INTRO_DURATION,sceneTime=chapterPart==='start'?Math.min(time-INTRO_DURATION,52.999):chapterPart==='end'?Math.min(time-INTRO_DURATION,76.999):chapterPart==='ch2'?Math.min(time-INTRO_DURATION,150.999):chapterPart==='ch2end'?Math.min(time-INTRO_DURATION,165.999):chapterPart==='ch3'?Math.min(time-INTRO_DURATION,195.999):chapterPart==='ch3end'?Math.min(time-INTRO_DURATION,213.999):chapterPart==='ch4'?Math.min(time-INTRO_DURATION,265.999):chapterPart==='ch4end'?Math.min(time-INTRO_DURATION,285.999):chapterPart==='ch5'?Math.min(time-INTRO_DURATION,328.999):chapterPart==='ch5end'?Math.min(time-INTRO_DURATION,344.999):chapterPart==='ch6'?Math.min(time-INTRO_DURATION,383.999):chapterPart==='ch6end'?Math.min(time-INTRO_DURATION,396.999):chapterPart==='ch7'?Math.min(time-INTRO_DURATION,472.999):chapterPart==='ch7end'?Math.min(time-INTRO_DURATION,509.999):chapterPart==='ch8'?Math.min(time-INTRO_DURATION,543.999):time-INTRO_DURATION,state=introActive?stateAt(time):sceneStateAt(sceneTime);
 soundtrack.sync(time,playing&&!document.hidden);
 document.getElementById('intro').hidden=!introActive;document.getElementById('skip-intro').hidden=!introActive;syncStorySkip();
 if(introActive){drawIntroduction(time);}
 else if(sceneTime<5){picture('working');}
 else if(sceneTime<9){picture('radio');}
 else if(sceneTime<14){picture('inspection');}
 else if(sceneTime<18){picture('altar');}
 else if(sceneTime<22){picture('inspection',TOOL_CLOSE);}
 else if(sceneTime<30){
  picture('altar');picture('cookies',FULL,smooth((sceneTime-22)/.8));
  if(sceneTime>=26)shrineLight(sceneTime,smooth((sceneTime-26)/.6));
 }else if(sceneTime<34){picture('repaired',TOOL_CLOSE);}
 else if(sceneTime<38){picture('cheer');}
 else if(sceneTime<43){picture('pirateArrival');}
 else if(sceneTime<53){pirateVideo(sceneTime);}
 else if(sceneTime<57){picture('endExplosion');}
 else if(sceneTime<63){picture('endCookieThought');}
 else if(sceneTime<70){picture('endHeroEat');}
 else if(sceneTime<77){picture('endPirateFaint');}
 else if(sceneTime<81){picture('ch2Planet',zoomRect([475,80,440,440*H/W],(sceneTime-79)/2));}
 else if(sceneTime<85){picture('ch2Palace',zoomRect([330,800,280,280*H/W],(sceneTime-83)/2));}
 else if(sceneTime<89){picture('ch2King');}
 else if(sceneTime<100){ministerReport(sceneTime);}
 else if(sceneTime<104){picture('ch2EmptyPlate');}
 else if(sceneTime<110){picture('ch2BalconyTax');}
 else if(sceneTime<114){picture('ch2Angry');}
 else if(sceneTime<122){kingBanOrder(sceneTime);}
 else if(sceneTime<123){kingBanOrder(122);ctx.fillStyle=`rgba(0,0,0,${smooth(sceneTime-122)})`;ctx.fillRect(0,0,W,H);}
 else if(sceneTime<125){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);}
 else if(sceneTime<127){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);picture('ch2TaxArrival',FULL,smooth((sceneTime-125)/2));}
 else if(sceneTime<131){picture('ch2TaxArrival');}
 else if(sceneTime<137){picture('ch2TaxShrine');}
 else if(sceneTime<141){picture('ch2TakeOffering');}
 else if(sceneTime<151){picture('ch2Leaves');}
 else if(sceneTime<158){picture('ch2EndCatch');}
 else if(sceneTime<166){picture('ch2EndPretend');}
 else if(sceneTime<170){refugeeArrival(sceneTime);}
 else if(sceneTime<185){refugeeReport(sceneTime);}
 else if(sceneTime<186){refugeeReport(184.99);ctx.fillStyle=`rgba(0,0,0,${smooth(sceneTime-185)})`;ctx.fillRect(0,0,W,H);}
 else if(sceneTime<188.5){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);picture('ch3Arrival',FULL,smooth((sceneTime-186)/1.5));}
 else if(sceneTime<189.3){picture('ch3Arrival');const flash=Math.sin(clamp((sceneTime-188.5)/.8)*Math.PI);ctx.fillStyle=`rgba(255,18,28,${flash*.8})`;ctx.fillRect(0,0,W,H);}
 else if(sceneTime<190.8){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);picture('ch3Pursuit',FULL,smooth((sceneTime-189.3)/1.5));}
 else if(sceneTime<196){picture('ch3Pursuit');}
 else if(sceneTime<202){picture('ch3EndExplosion');}
 else if(sceneTime<208){picture('ch3EndThanks');}
 else if(sceneTime<217){picture('ch3EndResolve');}
 else if(sceneTime<222){picture('ch4Map');}
 else if(sceneTime<232){picture('ch4Point');}
 else if(sceneTime<239){picture('ch4Robbery');}
 else if(sceneTime<246){picture('ch4Chief');}
 else if(sceneTime<253){picture('ch4Video');}
 else if(sceneTime<266){banditNegotiation(sceneTime);}
 else if(sceneTime<272){picture('ch4EndOffer');}
 else if(sceneTime<278){picture('ch4EndHug');}
 else if(sceneTime<286){picture('ch4EndFlag');}
 else if(sceneTime<293){picture('ch5Planet');}
 else if(sceneTime<315){
  picture('ch5People');
  if(sceneTime>=300){const key=sceneTime<307?'ch5CandyInset':sceneTime<311?'ch5NoticeInset':'ch5WhistleInset',start=sceneTime<307?300:sceneTime<311?307:311,im=images[key],bw=790,bh=bw*im.height/im.width;ctx.save();ctx.globalAlpha=smooth((sceneTime-start)/.35);ctx.shadowColor='#0009';ctx.shadowBlur=24;ctx.drawImage(im,125,1030,bw,bh);ctx.restore();}
 }else if(sceneTime<322){picture('ch5Toss');}
 else if(sceneTime<329){picture('ch5Monitor');}
 else if(sceneTime<332){picture('ch5People');}
 else if(sceneTime<337){picture('ch5People');picture('ch5EndDoor',FULL,smooth((sceneTime-332)/1.5));}
 else if(sceneTime<345){picture('ch5EndPrayer');}
 else if(sceneTime<353){picture('ch6Siege');}
 else if(sceneTime<372){kingTransformationPrelude(sceneTime);}
 else if(sceneTime<384){picture('ch6Transform');}
 else if(sceneTime<390){picture('ch6EndExplosion');}
 else if(sceneTime<397){picture('ch6EndKing');}
 else if(sceneTime<402){picture('ch6Offer');}
 else if(sceneTime<409){picture('ch6Pray');}
 else if(sceneTime<415){picture('ch6Sweat');}
 else if(sceneTime<422){picture('ch6Mountain');}
 else if(sceneTime<427){picture('ch6Point');}
 else if(sceneTime<433){picture('ch6Point');const im=images.ch6Glare,bw=630;ctx.save();ctx.globalAlpha=smooth((sceneTime-427)/.35);ctx.shadowColor='#0009';ctx.shadowBlur=22;ctx.drawImage(im,35,410,bw,bw*im.height/im.width);ctx.restore();}
 else if(sceneTime<444){
  picture('prayerBg');
  const u=smooth((sceneTime-433)/2.5),im=images.ch7RiftOverlay,bw=1020,bh=bw*im.height/im.width,scale=.08+.92*u;
  ctx.save();ctx.globalAlpha=u;ctx.translate(490,245);ctx.scale(scale,scale);ctx.drawImage(im,-bw/2,-bh/2,bw,bh);ctx.restore();
  picture('ch7PrayerForeground');
 }
 else if(sceneTime<453){panStoryImage('ch7Destruction',(sceneTime-444)/9);}
 else if(sceneTime<473){panStoryImage('ch7Flee',(sceneTime-453)/20);}
 else if(sceneTime<480){picture('ch7EndFallen');}
 else if(sceneTime<485){picture('ch7EndPriest');}
 else if(sceneTime<493){picture('ch7EndSearch');}
 else if(sceneTime<503){picture('ch7EndFound');const im=images.ch7EndBubble,bw=870;ctx.save();ctx.globalAlpha=smooth((sceneTime-493)/.35);ctx.drawImage(im,35,30,bw,bw*im.height/im.width);ctx.restore();}
 else if(sceneTime<510){picture('ch7EndKing');}
 else if(sceneTime<515){picture('ch8Light');}
 else if(sceneTime<522){picture('ch8Light');picture('ch8Grandma',FULL,smooth((sceneTime-515)/5));}
 else if(sceneTime<527){picture('ch8Offer');}
 else if(sceneTime<534){cookieInset('ch8TugInset');}
 else if(sceneTime<538){cookieInset('ch8BreakInset');}
 else if(sceneTime<544){cookieInset('ch8BreakInset');ctx.save();ctx.beginPath();ctx.rect(0,0,W,800);ctx.clip();picture('ch8Red',FULL,smooth((sceneTime-538)/4));ctx.restore();}
 else if(sceneTime<550){endComposition('ch8EndIdle','angry',1-smooth((sceneTime-544)/3));}
 else if(sceneTime<556){endComposition('ch8EndPockets');}
 else if(sceneTime<561){endComposition('ch8EndReveal');}
 else if(sceneTime<566){endComposition('ch8EndHug');}
 else if(sceneTime<570){endComposition('ch8EndGlare');}
 else if(sceneTime<576){endComposition('ch8EndHandoff');}
 else if(sceneTime<582){endComposition('ch8EndPlate');}
 else if(sceneTime<586){endComposition('ch8EndSmile','smile',smooth((sceneTime-582)/1.2));}
 else if(sceneTime<590){endComposition('ch8EndSmile','smile',1,smooth((sceneTime-586)/1.5));}
 else if(sceneTime<602){worldMachinesRestoration(sceneTime);}
 else{
  endComposition('ch8EndCheer','smile',1,1);
  if(sceneTime>=610){picture('endVignette',FULL,smooth((sceneTime-610)/1.5));picture('endCard',FULL,smooth((sceneTime-616.5)/1.5));StoryEndingText.draw(ctx,W,H,smooth((sceneTime-610)/1.5));}
  if(sceneTime>=619){ctx.fillStyle=`rgba(0,0,0,${smooth((sceneTime-619)/.5)})`;ctx.fillRect(0,0,W,H);}
 }

 document.getElementById('seek').value=time;document.getElementById('time').textContent=`${time.toFixed(1)} / ${DURATION.toFixed(1)} s`;document.getElementById('shot-name').textContent=state.name;canvas.dataset.beat=state.beat;
 const tagTime=introActive?0:sceneTime+INTRO_DURATION,buttons=[...document.querySelectorAll('.shots [data-time]')];
 let active=buttons[0];for(const b of buttons)if(Number(b.dataset.time)<=tagTime)active=b;
 for(const b of buttons)b.setAttribute('aria-pressed',String(b===active));
}

function syncPlay(){document.getElementById('play').textContent=playing?'暫停':'播放';document.getElementById('play').setAttribute('aria-label',playing?'暫停動畫':'播放動畫');}
function seek(t){soundtrack.stop();completionSent=false;time=clamp(Number(t)||0,0,DURATION);chapterPart=time>=CH8_END_START?'ch8end':time>=CH8_START?'ch8':time>=CH7_END_START?'ch7end':time>=CH7_START?'ch7':time>=CH6_END_START?'ch6end':time>=CH6_START?'ch6':time>=CH5_END_START?'ch5end':time>=CH5_START?'ch5':time>=CH4_END_START?'ch4end':time>=CH4_START?'ch4':time>=CH3_END_START?'ch3end':time>=CH3_START?'ch3':time>=CH2_END_START?'ch2end':time>=CH2_START?'ch2':time>=CH1_END_START?'end':'start';last=0;render();}
function setPlaying(value){if(!ready)return;if(value&&time===(chapterPart==='start'?CH1_END_START:chapterPart==='end'?CH2_START:chapterPart==='ch2'?CH2_END_START:chapterPart==='ch2end'?CH3_START:chapterPart==='ch3'?CH3_END_START:chapterPart==='ch3end'?CH4_START:chapterPart==='ch4'?CH4_END_START:chapterPart==='ch4end'?CH5_START:chapterPart==='ch5'?CH5_END_START:chapterPart==='ch5end'?CH6_START:chapterPart==='ch6'?CH6_END_START:chapterPart==='ch6end'?CH7_START:chapterPart==='ch7'?CH7_END_START:chapterPart==='ch7end'?CH8_START:chapterPart==='ch8'?CH8_END_START:DURATION))time=chapterPart==='start'?0:chapterPart==='end'?CH1_END_START:chapterPart==='ch2'?CH2_START:chapterPart==='ch2end'?CH2_END_START:chapterPart==='ch3'?CH3_START:chapterPart==='ch3end'?CH3_END_START:chapterPart==='ch4'?CH4_START:chapterPart==='ch4end'?CH4_END_START:chapterPart==='ch5'?CH5_START:chapterPart==='ch5end'?CH5_END_START:chapterPart==='ch6'?CH6_START:chapterPart==='ch6end'?CH6_END_START:chapterPart==='ch7'?CH7_START:chapterPart==='ch7end'?CH7_END_START:chapterPart==='ch8'?CH8_START:CH8_END_START;playing=value;last=0;syncPlay();render();}
function tick(now){
 const advancing=playing&&last&&!document.hidden;
 if(advancing){time+=Math.min((now-last)/1000,.1);const limit=chapterPart==='start'?CH1_END_START:chapterPart==='end'?CH2_START:chapterPart==='ch2'?CH2_END_START:chapterPart==='ch2end'?CH3_START:chapterPart==='ch3'?CH3_END_START:chapterPart==='ch3end'?CH4_START:chapterPart==='ch4'?CH4_END_START:chapterPart==='ch4end'?CH5_START:chapterPart==='ch5'?CH5_END_START:chapterPart==='ch5end'?CH6_START:chapterPart==='ch6'?CH6_END_START:chapterPart==='ch6end'?CH7_START:chapterPart==='ch7'?CH7_END_START:chapterPart==='ch7end'?CH8_START:chapterPart==='ch8'?CH8_END_START:DURATION;
  if(time>=limit){if(loop)time=chapterPart==='start'?0:chapterPart==='end'?CH1_END_START:chapterPart==='ch2'?CH2_START:chapterPart==='ch2end'?CH2_END_START:chapterPart==='ch3'?CH3_START:chapterPart==='ch3end'?CH3_END_START:chapterPart==='ch4'?CH4_START:chapterPart==='ch4end'?CH4_END_START:chapterPart==='ch5'?CH5_START:chapterPart==='ch5end'?CH5_END_START:chapterPart==='ch6'?CH6_START:chapterPart==='ch6end'?CH6_END_START:chapterPart==='ch7'?CH7_START:chapterPart==='ch7end'?CH7_END_START:chapterPart==='ch8'?CH8_START:CH8_END_START;else{time=limit;playing=false;syncPlay();completeStory();}}}
 last=now;if(playing||advancing)render();requestAnimationFrame(tick);
}
document.getElementById('offering-preview').addEventListener('click',()=>{seek(104);setPlaying(true);});
document.getElementById('skip-intro').addEventListener('click',()=>{seek(INTRO_DURATION);setPlaying(true);});window.addEventListener('resize',()=>{introDistance=0;render();});
document.getElementById('play').addEventListener('click',()=>setPlaying(!playing));document.getElementById('replay').addEventListener('click',()=>{seek(pageChapter?.start||0);setPlaying(true);});document.getElementById('seek').addEventListener('input',e=>seek(e.target.value));document.getElementById('loop').addEventListener('click',()=>{loop=!loop;document.getElementById('loop').setAttribute('aria-pressed',String(loop));});document.querySelectorAll('[data-time]').forEach(b=>b.addEventListener('click',()=>{seek(b.dataset.time);setPlaying(true);}));document.addEventListener('visibilitychange',()=>{last=0;});document.addEventListener('keydown',e=>{if(e.code==='Space'&&!e.target.matches('button,input,a')){e.preventDefault();setPlaying(!playing);}});
if(params.has('embed')){document.body.classList.add('embedded');document.getElementById('chapters').hidden=true;}
window.OpeningFilm={get ready(){return ready;},get time(){return time;},get playing(){return playing;},duration:DURATION,introDuration:INTRO_DURATION,beats:BEATS,stateAt,seek,pause:()=>setPlaying(false),play:()=>setPlaying(true)};
const requiredImages=pageChapter&&!params.has('debug')?new Set(pageChapter.imageDependencies):null;
function localizeIntroduction(){
 const text=document.getElementById('crawl-text');
 PinballI18n.apply(text);text.lang=PinballI18n.locale;
 introDistance=0;render();
}
localizeIntroduction();
const stopIntroLanguageUpdates=PinballI18n.onChange(localizeIntroduction);
window.addEventListener('pagehide',stopIntroLanguageUpdates,{once:true});
window.viewReady=Promise.all(Object.entries(PATHS).filter(([key])=>!requiredImages||requiredImages.has(key)).map(([key,src])=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[key]=im;resolve();};im.onerror=()=>reject(new Error(src));im.src=src;}))).then(()=>{ready=true;document.getElementById('loading').hidden=true;document.getElementById('play').disabled=false;document.getElementById('replay').disabled=false;document.getElementById('seek').disabled=false;seek(params.has('t')?params.get('t'):pageChapter?pageChapter.start:params.get('part')==='ch8end'?CH8_END_START:params.get('part')==='ch8'?CH8_START:params.get('part')==='ch7end'?CH7_END_START:params.get('part')==='ch7'?CH7_START:params.get('part')==='ch6end'?CH6_END_START:params.get('part')==='ch6'?CH6_START:params.get('part')==='ch5end'?CH5_END_START:params.get('part')==='ch5'?CH5_START:params.get('part')==='ch4end'?CH4_END_START:params.get('part')==='ch4'?CH4_START:params.get('part')==='ch3end'?CH3_END_START:params.get('part')==='ch3'?CH3_START:params.get('part')==='ch2end'?CH2_END_START:params.get('part')==='ch2'?CH2_START:params.get('part')==='end'?CH1_END_START:0);const awaitIntroClick=!hosted&&!params.has('paused')&&time<INTRO_DURATION;document.getElementById('begin').hidden=!awaitIntroClick;setPlaying(!params.has('paused')&&!hosted&&!awaitIntroClick);syncStorySkip();requestAnimationFrame(tick);}).catch(e=>{document.getElementById('loading').textContent='無法載入畫面：'+e.message;console.error(e);});

document.getElementById("begin").addEventListener("click",()=>play());
document.getElementById("story-skip").addEventListener("click",()=>{if(document.getElementById("story-skip").hidden)return;const chapter=activeChapter();time=chapter.end;playing=false;syncPlay();render();completeStory(true);});
window.viewAPI={play,render(ms){const c=pageChapter||activeChapter();seek(Math.min(c.end-.001,c.start+Math.max(0,ms)/1000));},suspend(){last=0;soundtrack.suspended=true;soundtrack.pause();},resume(){last=0;soundtrack.suspended=false;}};
window.addEventListener("pagehide",()=>{playing=false;soundtrack.stop();});

window.addEventListener("pointerdown",()=>soundtrack.unlock());
window.addEventListener("keydown",()=>soundtrack.unlock());
document.addEventListener("visibilitychange",()=>{if(document.hidden)soundtrack.pause();});

StoryEndingText.watch(render);
