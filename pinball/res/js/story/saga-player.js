
'use strict';
// 每章依 start / end 增補分鏡；時間單位為毫秒。
const chapterNames=SAGA_STORY.chapterNames;
const chapters=SAGA_STORY.chapters;
const storyNodes=new Map();
const $=id=>{if(!storyNodes.has(id))storyNodes.set(id,document.getElementById(id));return storyNodes.get(id);};
const setStoryText=(element,text)=>{if(element.textContent!==text)element.textContent=text;};
const delivery=$('delivery'),loadedImages=new Map();let scene=$('scene');
// Ch2 六鏡重用同一張礁岸底圖；站位由此處固定，換動作不重畫背景。
const ch2Layers=SAGA_STORY.layers.ch2;
const ch2Images=ch2Layers.map(layer=>{const im=new Image();im.dataset.src=layer.src;im.className=layer.kind;im.alt=layer.alt;im.hidden=true;$('ch2-world').append(im);return im});
function renderCh2(s,local){
 $('ch2-world').hidden=!s?.ch2;if(!s?.ch2)return;
 const index=shots.indexOf(s),previous=shots[index-1]?.ch2,fade=Math.max(0,Math.min(1,local/(s.fade||800))),end=index===shots.length-1?Math.max(0,Math.min(1,(s.duration-local)/800)):1;
 // 共用背景始終不透明；相鄰鏡頭只交叉淡換有變化的角色／泡泡，共用物件保持顯示。
 ch2Images.forEach((im,i)=>{const layer=ch2Layers[i],states=layer.states,now=states.includes(s.ch2),before=states.includes(previous);let opacity=(now?(before?1:fade):(before?1-fade:0))*end;
  if(s.ch2==='trade'&&layer.kind==='trade-request')opacity=fade*Math.max(0,Math.min(1,(3500-local)/350))*end;
  if(s.ch2==='trade'&&layer.kind==='trade')opacity=Math.max(0,Math.min(1,(local-3700)/450))*end;
  im.hidden=opacity<=0;im.style.opacity=opacity});
}
// 同一場景只交叉淡換前景，料理快切立即換物件。
const ch3Layers=SAGA_STORY.layers.ch3;
const cookingPanel=document.createElement('aside');cookingPanel.id='cooking-panel';cookingPanel.hidden=true;cookingPanel.setAttribute('aria-label','料理製作步驟子視窗');$('ch3-world').append(cookingPanel);
const ch3Images=ch3Layers.map(layer=>{const im=new Image();im.dataset.src=layer.src;im.className=layer.kind;im.alt=layer.alt||layer.kind;im.hidden=true;(['hands','bake','pie','cod'].includes(layer.kind)?cookingPanel:$('ch3-world')).append(im);return im});
function renderCh3(s,local){
 $('ch3-world').hidden=!s?.layered;const cookingStep=['catch','dough','fish','bake','pie'].includes(s?.layered);cookingPanel.hidden=!cookingStep;cookingPanel.dataset.step=cookingStep?s.layered:'';if(!s?.layered)return;
 const index=shots.indexOf(s),prev=shots[index-1],previous=prev?.src===s.src?prev.layered:null,fade=s.cutIn?1:Math.max(0,Math.min(1,local/(s.fade||800)));
 ch3Images.forEach((im,i)=>{const states=ch3Layers[i].states,now=states.includes(s.layered),before=states.includes(previous),opacity=now?(before?1:fade):(before?1-fade:0);im.hidden=opacity<=0;im.style.opacity=opacity});
}
// 先丟袋／落海，再以固定大小直接切換三個子畫面；拖曳與重播共用局部時間。
const ravenShots=SAGA_STORY.ravenShots;
const ravenImages=ravenShots.map(s=>{const im=new Image();im.dataset.src=s.src;im.alt=s.alt;im.style.opacity=0;$('raven-panel').append(im);return im});
function renderRaven(s,local){
 const panel=$('raven-panel');panel.hidden=!s?.ravenSequence||local<ravenShots[0].start;
 if(!s?.ravenSequence){delete $('stage').dataset.phase;return}
 const index=ravenShots.findLastIndex(p=>local>=p.start);
 $('stage').dataset.phase=index<0?(local<2200?'sack-thrown':'sack-in-sea'):ravenShots[index].phase;
 panel.style.opacity=Math.min(1,Math.max(0,(s.duration-local)/800));
 ravenImages.forEach((im,i)=>{im.style.opacity=i===index?1:0});
}
const villages=[[650,1420],[255,1220],[670,980],[270,735],[675,490],[250,280]],ns='http://www.w3.org/2000/svg';
const paths=[...document.querySelectorAll('#map-paths path')].reverse(),lengths=paths.map(p=>p.getTotalLength());
const stones=villages.map(()=>{const g=document.createElementNS(ns,'g'),im=document.createElementNS(ns,'image');for(const [k,v] of Object.entries({href:window.PinballRuntimeImages?.resolve('img/saga/saga-story-shadow-stone-obsidian.png')||'img/saga/saga-story-shadow-stone-obsidian.png',x:-23,y:-34,width:46,height:46}))im.setAttribute(k==='href'?'data-src':k,v);const halo=document.createElementNS(ns,'circle');halo.setAttribute('r',110);halo.setAttribute('cy',-10);halo.setAttribute('fill','#47e7ee');halo.setAttribute('filter','url(#stone-light)');g.append(halo,im);$('map-stones').append(g);return g});
function drawMap(ms){
 const segment=Math.min(5,Math.floor(ms/4500)),local=ms-segment*4500;
 let p={x:villages[segment][0],y:villages[segment][1]},walking=false;
 let dx=segment<5?villages[segment+1][0]-p.x:villages[5][0]-villages[4][0];
 if(segment<5&&local>1100){const distance=lengths[segment]*(1-Math.min(1,(local-1100)/3400));p=paths[segment].getPointAtLength(distance);const ahead=paths[segment].getPointAtLength(Math.max(0,distance-2));dx=ahead.x-p.x;walking=true}
 const facing=dx<0?-1:1;
 $('traveler').setAttribute('transform','translate('+p.x+' '+(p.y+(walking?Math.sin(ms/110)*3:0))+') scale('+facing+',1)');
 stones.forEach((g,i)=>{const f=Math.min(1,Math.max(0,(ms-i*4500-400)/500));g.style.opacity=f;g.firstChild.style.opacity=.65+.3*Math.sin(ms/550+i);g.setAttribute('transform','translate('+(villages[i][0]+44)+' '+(villages[i][1]+20)+') scale('+(.5+.5*f)+')')})
}
// 同張圖分段拉遠，中間保留揭露金牙的停頓；由故事時間決定，支援反向拖動。
function stagedCamera(s,local){
 const frames=s.cameraStages;
 if(local<=frames[0][0])return frames[0][1];
 for(let i=1;i<frames.length;i++)if(local<=frames[i][0]){const [at,a]=frames[i-1],[end,b]=frames[i],t=Math.max(0,Math.min(1,(local-at)/(end-at))),ease=t*t*(3-2*t);return a.map((v,j)=>v+(b[j]-v)*ease)}
 return frames[frames.length-1][1];
}
function cameraFrame(s,local){const stage=$('stage'),world=$('camera'),w=stage.clientWidth,h=stage.clientHeight,t=Math.max(0,Math.min(1,(local-(s.fade||800)-(s.motionDelay||0))/(s.duration-(s.fade||800)-(s.motionDelay||0)-800-(s.holdEnd||0)))),ease=t*t*(3-2*t),a=s.cameraStages?stagedCamera(s,local):(s.camera?.[0]||[.5,.5,1]),b=s.cameraStages?a:(s.camera?.[1]||a),z=a[2]+(b[2]-a[2])*ease,ww=s.portrait?h*9/16:h*1672/941,x=a[0]+(b[0]-a[0])*ease,y=a[1]+(b[1]-a[1])*ease;world.style.width=ww+'px';world.style.height=h+'px';const tx=Math.min(0,Math.max(w-ww*z,w/2-ww*x*z)),ty=Math.min(0,Math.max(h-h*z,h/2-h*y*z));world.style.transform='translate('+tx+'px,'+ty+'px) scale('+z+')';world.style.opacity=s.ch2==='joy'?Math.min(1,local/1000):s.ch2||s.layered||s.ch5||s.ch6?1:Math.min(1,s.cutIn?1:local/(s.fade||800),s.cutOut?1:Math.max(0,(s.duration-local)/800));const glow=$('stone-glow');glow.hidden=!s.glow;if(s.glow){glow.style.left=s.glow[0]*100+'%';glow.style.top=s.glow[1]*100+'%';glow.style.opacity=(.94+.06*Math.sin(local/550))*Math.max(0,Math.min(1,(local-(s.glowStart||0))/(s.glowRise||1)));glow.style.width=((s.glowSize||150)*(1+.107*Math.sin(local/550)))+'%'}}
let chapter=1,part='start',shots=[],total=0,elapsed=0,current=-1,running=false,ready=false,last=null;
function select(n,p){chapter=n;part=p;shots=chapters[n+'-'+p]||[];total=shots.reduce((sum,s)=>sum+s.duration,0);elapsed=0;current=-1;running=false;stopStoryFrame();$('chapter-title').textContent='ch'+n+' '+p+' · '+chapterNames[n-1];$('shots').replaceChildren();shots.forEach((s,i)=>{const b=document.createElement('button');b.textContent=(i+1)+' · '+s.title;b.onclick=()=>jump(i);$('shots').append(b)});document.querySelectorAll('[data-chapter]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.chapter===n&&b.dataset.part===p)));$('placeholder').hidden=!!shots.length;$('placeholder').textContent='ch'+n+' '+p+'\n尚未製作';for(const id of ['play','next','previous','replay','seek'])$(id).disabled=!shots.length||!ready;const u=new URL(location.href);u.searchParams.set('chapter',n);u.searchParams.set('part',p);if(!window.AppProgress)history.replaceState(null,'',u);completionSent=false;syncSkip();render()}
function shotAt(ms){let start=0;for(let i=0;i<shots.length;i++){if(ms<start+shots[i].duration||i===shots.length-1)return {i,local:ms-start};start+=shots[i].duration}return {i:-1,local:0}}
const ch6Layers=SAGA_STORY.layers.ch6;
const ch6Images=ch6Layers.map(layer=>{const im=new Image();im.dataset.src=layer.src;im.alt=layer.alt||layer.kind;im.className=layer.kind;im.hidden=true;$('ch6-world').append(im);return im});
function renderCh6(s,local){
 $('ch6-world').hidden=!s?.ch6;if(!s?.ch6)return;
 const previous=shots[shots.indexOf(s)-1],prev=previous?.src===s.src?previous.ch6:null,f=s.cutIn?1:Math.min(1,Math.max(0,local/(s.fade||800)));
 ch6Images.forEach((im,i)=>{const layer=ch6Layers[i],a=layer.states,now=a.includes(s.ch6),oldForm=layer.file==='sick-no-sweat'||layer.kind==='body',before=a.includes(prev)&&!(prev==='cat-transform'&&(oldForm||layer.kind==='smoke'));let opacity=now?(before?1:f):(before?1-f:0);im.style.transform='';
  if(s.ch6==='cat-transform'){
   if(oldForm)opacity=local<1700?1:0;
   if(layer.kind==='cat')opacity=local>=1700?1:0;
   if(layer.kind==='smoke'){opacity=Math.max(0,Math.min(1,(local-700)/450,(2900-local)/650));im.style.transform='scale('+(local<1150?.65+.35*Math.max(0,(local-700)/450):1+.1*Math.max(0,(local-2250)/650))+')'}
  }
  im.style.opacity=opacity;im.hidden=opacity<=0;
 });
}
const ch5Layers=SAGA_STORY.layers.ch5;
const ch5Images=ch5Layers.map(layer=>{const im=new Image();im.dataset.src=layer.src;im.alt=layer.alt||layer.kind;im.className=layer.kind;im.hidden=true;$('ch5-world').append(im);return im});
function renderCh5(s,local){$('ch5-world').hidden=!s?.ch5;if(!s?.ch5)return;const prev=shots[shots.indexOf(s)-1]?.ch5,f=Math.min(1,Math.max(0,local/(s.fade||800)));ch5Images.forEach((im,i)=>{const a=ch5Layers[i].states,now=a.includes(s.ch5),before=a.includes(prev),opacity=now?(before?1:f):(before?1-f:0);im.style.opacity=opacity;im.hidden=opacity<=0});}
function renderCh4(s,local){
 const sack=$('sack-inset');sack.hidden=!s?.sackInset;if(s?.sackInset)sack.style.opacity=Math.max(0,Math.min(1,(local-2800)/500,(s.duration-local)/800));
 const core=$('core-inset');core.hidden=!s?.coreInset;if(s?.coreInset)core.style.opacity=Math.max(0,Math.min(1,(local-2500)/600,((s.cooperation?7100:s.duration)-local)/800));
 const cooperation=$('cooperation-bubble');cooperation.hidden=!s?.cooperation||local<7300;
 if(s?.cooperation)cooperation.style.opacity=Math.max(0,Math.min(1,(local-7300)/500,(s.duration-local)/800));
 const bubble=$('memory-intro'),full=$('memory-reveal');bubble.hidden=full.hidden=!s?.memoryIntro;if(!s?.memoryIntro)return;
 const pop=Math.max(0,Math.min(1,(local-3200)/600)),out=Math.max(0,Math.min(1,(local-6200)/1000));
 bubble.style.opacity=pop*(1-out);bubble.style.transform='scale('+(local<3800?.45+.59*pop:local<4000?1.04-.04*(local-3800)/200:1+.12*out)+')';full.style.opacity=out;
}
function renderShell(s,local){
 $('shell-transition').hidden=!s?.shellSequence;if(!s?.shellSequence)return;
 const end=Math.min(1,Math.max(0,(s.duration-local)/500));
 $('shell-closed').style.opacity=local<2350?Math.min(1,Math.max(0,(local-400)/800)):0;
 $('shell-pearl').style.opacity=local>=2350?end:0;
 $('shell-lightning').style.opacity=local>=2000&&local<2450?1:0;
}
// 以故事時間驅動整個鏡頭，暫停與拖動進度時保持一致；放大避免震動露出黑邊。
function renderQuake(s,local){
 if(!s.quake)return;
 const t=Math.max(0,local),strength=Math.min(1,t/180,Math.max(0,(3900-t)/800));
 const x=(Math.sin(t*.071)+.45*Math.sin(t*.137))*9*strength;
 const y=(Math.sin(t*.093+.8)+.4*Math.sin(t*.163))*6*strength;
 const zoom=1+.09*Math.min(1,t/180,Math.max(0,(s.duration-t)/600));
 $('camera').style.transform+=' translate('+x+'px,'+y+'px) translate(50%,50%) scale('+zoom+') translate(-50%,-50%)';
}
function renderEnding(s,local){
 const curtain=$('end-curtain');curtain.hidden=!s?.endCover&&!s?.endCard;
 if(curtain.hidden)return;
 curtain.style.opacity=s.endCover?Math.max(0,Math.min(1,local/1600)):1;
 StoryEndingText.paint($('ending-text'),s.endCard?Math.max(0,1-local/1500):1);
}
function render(){const {i,local}=shotAt(elapsed),s=shots[i],activeSrc=s?.ravenSequence&&local>=2200?s.afterSrc:s?.src;renderRaven(s,local);renderCh2(s,local);renderCh3(s,local);renderShell(s,local);renderCh4(s,local);renderCh5(s,local);renderCh6(s,local);renderEnding(s,local);$('stage').style.background=s?.bookBridge||s?.fromBook?'#f3dfb9':'#000';$('camera').hidden=!s||s.type==='map'||s.type==='black';delivery.toggleAttribute('hidden',!s||s.type!=='map'||!!(s.blackTail&&local>=s.duration-s.blackTail));if(s&&(i!==current||(activeSrc&&scene.getAttribute('src')!==activeSrc))){current=i;if(activeSrc){const next=loadedImages.get(activeSrc);if(next&&next!==scene){scene.removeAttribute('id');scene.replaceWith(next);scene=next;scene.id='scene'}scene.alt=s.title}for(const [j,b] of [...$('shots').children].entries())b.setAttribute('aria-pressed',String(i===j))}if(s?.type==='map'){delivery.style.opacity=Math.min(1,local/800);drawMap(local);}else if(s&&s.type!=='black'){cameraFrame(s,local);renderQuake(s,local)}setStoryText($('play'),running?'暫停':'播放');$('seek').value=total?elapsed/total*100:0;setStoryText($('position'),s?(i+1)+' / '+shots.length+' · '+s.title+' · '+Math.floor(elapsed/1000)+' / '+Math.ceil(total/1000)+' 秒':'');$('previous').disabled=!ready||i<=0;$('next').disabled=!ready||i<0||i>=shots.length-1}
function jump(i){if(i<0||i>=shots.length)return;elapsed=shots.slice(0,i).reduce((sum,s)=>sum+s.duration,0);render()}
$('play').onclick=()=>{if(!ready||!shots.length)return;if(elapsed>=total)elapsed=0;running=!running;stopStoryFrame();scheduleStoryFrame();render()};
$('replay').onclick=()=>play();
$('previous').onclick=()=>jump(current-1);$('next').onclick=()=>jump(current+1);
$('seek').oninput=e=>{elapsed=Number(e.target.value)/100*total;render()};
let storyFrame=0;
function stopStoryFrame(){cancelAnimationFrame(storyFrame);storyFrame=0;last=null;}
function scheduleStoryFrame(){if(running&&!document.hidden&&!storyFrame)storyFrame=requestAnimationFrame(frame);}
function frame(now){storyFrame=0;if(last!==null&&running&&!document.hidden){elapsed=Math.min(total,elapsed+now-last);if(elapsed===total){running=false;completeStory()}render()}last=now;scheduleStoryFrame()}
window.addEventListener('resize',render);
document.addEventListener('visibilitychange',()=>{stopStoryFrame();scheduleStoryFrame()});

const hosted=!!window.AppProgress;
const pageChapter=Number(document.body.dataset.storyChapter),pagePart=document.body.dataset.storyPart;
let completionSent=false,playbackFinished=false,nextTimer=0,loadVersion=0;
const chapterId=()=>`ch${chapter}-${part}`;
const hasSeen=()=>hosted?window.AppProgress.hasSeen(chapterId()):localStorage.getItem('pinball-saga-story-seen-v1:'+chapterId())==='1';
function syncSkip(){$('story-skip').hidden=!hosted||!ready||!hasSeen()||completionSent||playbackFinished;}
function emitCompletion(skipped=false){
 if(completionSent)return;
 completionSent=true;running=false;stopStoryFrame();clearTimeout(nextTimer);$('story-next').hidden=true;syncSkip();
 window.dispatchEvent(new CustomEvent('story:complete',{detail:{chapter:chapterId(),skipped}}));
}
function completeStory(skipped=false){
 if(completionSent||playbackFinished)return;
 playbackFinished=true;running=false;stopStoryFrame();syncSkip();
 if(!skipped){if(hosted)window.AppProgress.markSeen(chapterId());else localStorage.setItem('pinball-saga-story-seen-v1:'+chapterId(),'1');}
 if(part==='end'){$('story-next').hidden=false;nextTimer=setTimeout(()=>emitCompletion(skipped),10000);}
 else emitCompletion(skipped);
}
function showLoadError(error){$('loading').hidden=true;$('error').hidden=false;$('error').textContent='劇情載入失敗：'+error.message;}
async function loadChapter(n,p){
 const version=++loadVersion;ready=false;running=false;stopStoryFrame();
 $('phone').dataset.ready='false';$('loading').hidden=false;$('error').hidden=true;select(n,p);
 const dependencies=SAGA_STORY.imageDependencies[n+'-'+p];
 if(!dependencies)throw Error('不存在的章節：'+n+'-'+p);
 await Promise.all(dependencies.map(src=>{
  if(loadedImages.has(src))return Promise.resolve();
  return new Promise((resolve,reject)=>{const im=new Image();im.onload=async()=>{try{await im.decode();loadedImages.set(src,im);resolve()}catch(error){reject(error)}};im.onerror=()=>reject(Error(src));im.src=src;});
 }));
 if(version!==loadVersion)return;
 const urls=new Set(dependencies.map(src=>new URL(src,document.baseURI).href));
 const layers=[...document.querySelectorAll('[data-src]')];
 await Promise.all(layers.map(async im=>{
  const src=new URL(im.dataset.src,document.baseURI).href;
  if(!urls.has(src))return;
  if(im.namespaceURI===ns)im.setAttribute('href',window.PinballRuntimeImages?.resolve(src)||src);
  else{im.src=src;await im.decode();}
 }));
 if(version!==loadVersion)return;
 ready=true;$('phone').dataset.ready='true';$('loading').hidden=true;select(n,p);syncSkip();
}
async function play(id=`ch${pageChapter}-${pagePart}`){
 await window.viewReady;
 const match=/^ch([1-8])-(start|end)$/.exec(id);
 if(!match||Number(match[1])!==pageChapter||match[2]!==pagePart)return false;
 clearTimeout(nextTimer);$('story-next').hidden=true;elapsed=0;last=null;completionSent=false;playbackFinished=false;running=true;$('begin').hidden=true;syncSkip();render();scheduleStoryFrame();return true;
}
$('start').onclick=()=>play();
$('story-next').onclick=()=>emitCompletion();
$('story-skip').onclick=()=>{if(hasSeen())completeStory(true)};
window.viewAPI={play,render(seconds){elapsed=Math.max(0,Math.min(total,seconds*1000));render()},suspend(){last=null},resume(){last=null},get duration(){return total/1000},get chapter(){return chapterId()},hasSettingsControl:false};
const params=new URLSearchParams(location.search);if(params.has('embed'))document.body.classList.add('embed');
window.viewReady=loadChapter(pageChapter,pagePart).then(()=>{$('begin').hidden=hosted;});
window.viewReady.catch(showLoadError);

window.addEventListener('pagehide',()=>{running=false;++loadVersion;stopStoryFrame();clearTimeout(nextTimer);});
