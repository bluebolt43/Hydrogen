const ch8Dialogue=[
  {speaker:'officer',text:'✋'},
  {speaker:'main',image:'../img/pirate-kraken-normal.png',label:'章魚'},
  {speaker:'main',image:'../img/pirate-kraken-normal.png',cross:true,label:'章魚禁止'},
  {speaker:'main',image:'../img/pirate-story-treasure-chest.png',label:'財寶'},
  {speaker:'officer',image:'../img/pirate-story-queen-silhouette.png',label:'女王剪影'},
  {speaker:'officer',text:'🤌'}, {speaker:'officer',text:'50%'},
  {speaker:'main',text:'💢'}
];
let ch8LastReactionBeat=-1;
function renderCh8(ms){
  const scale=phone.clientWidth/940;
  document.querySelector('#ch8-world').style.transform=`scale(${scale})`;
  const panel=document.querySelector('#ch8-panel');
  panel.hidden=ms<2000;
  const move=clamp((ms-2000)/2000,0,1);
  document.querySelector('#ch8-officer').style.left=`${950+(473-950)*move}px`;
  document.querySelector('#ch8-main').style.left=`${-333+(-33+333)*move}px`;
  const speech=document.querySelector('#ch8-speech');
  const dialogueTime=ms-6000;
  const beat=Math.floor(dialogueTime/3000);
  const inPause=dialogueTime%3000>=2000;
  const sameSpeakerNext=beat>=0&&beat<ch8Dialogue.length-1&&ch8Dialogue[beat].speaker===ch8Dialogue[beat+1].speaker;
  const visible=dialogueTime>=0&&beat<ch8Dialogue.length&&(!inPause||sameSpeakerNext||beat===ch8Dialogue.length-1);
  speech.hidden=!visible;
  const kraken=document.querySelector('#ch8-speech-kraken');
  const cross=document.querySelector('#ch8-speech-cross');
  const treasure=document.querySelector('#ch8-speech-treasure');
  const queen=document.querySelector('#ch8-speech-queen');
  const label=document.querySelector('#ch8-speech-text');
  kraken.hidden=true;
  cross.hidden=true;
  treasure.hidden=true;
  queen.hidden=true;
  label.hidden=true;
  if(dialogueTime<0){
    ch8LastReactionBeat=-1;
    document.querySelector('#ch8-main').style.animation='none';
    document.querySelector('#ch8-officer').style.animation='none';
  }else if(!inPause&&beat<ch8Dialogue.length&&beat!==ch8LastReactionBeat){
    ch8LastReactionBeat=beat;
    const mainSpeaking=ch8Dialogue[beat].speaker==='main';
    const character=document.querySelector(mainSpeaking?'#ch8-main':'#ch8-officer');
    const listener=document.querySelector(mainSpeaking?'#ch8-officer':'#ch8-main');
    listener.style.animation='none';
    character.style.animation='none';
    void character.offsetWidth;
    character.style.animation=mainSpeaking?'ch8-main-react .48s ease-out':'ch8-officer-react .6s ease-out';
  }
  if(visible){
    const line=ch8Dialogue[beat];
    const officer=line.speaker==='officer';
    speech.dataset.speaker=line.speaker;
    speech.style.left='251px';
    speech.style.top=officer?'518px':'747px';
    speech.style.width='190px';
    speech.style.height=officer?'156.97px':'150px';
    speech.setAttribute('aria-label',`${officer?'軍官':'主角'}：${line.label||line.text}`);
    if(line.image){
      const imageBySource={
        '../img/pirate-kraken-normal.png':kraken,
        '../img/pirate-story-treasure-chest.png':treasure,
        '../img/pirate-story-queen-silhouette.png':queen
      };
      imageBySource[line.image].hidden=false;
      cross.hidden=!line.cross;
      label.textContent='';
    }else{
      label.hidden=false;
      label.textContent=line.text;
      label.style.fontSize=line.text==='50%'?'46px':'68px';
    }
  }else{
    label.textContent='';
  }
  phone.dataset.phase=ms<2000?'stage8-establish':ms<4000?'stage8-entry':ms<6000?'stage8-wait':visible?'stage8-dialogue':'stage8-pause';
}
function render(elapsed){document.querySelector('#ch8-story').hidden=false;renderCh8(elapsed-ch8Start);}
function resetChapter(){ch8LastReactionBeat=-1;}
