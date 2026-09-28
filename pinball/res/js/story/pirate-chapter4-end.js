const victory=document.querySelector('#victory'),victoryTheater=document.querySelector('#victory-theater');
let victoryReady=false,victoryStarted=false;
function renderVictory(){
 if(victoryReady&&!victoryStarted){
  victoryStarted=true;
  victoryTheater.contentWindow.postMessage({channel:'pinball-theater',command:'story-victory',id:'story-victory'},'*');
 }
 phone.dataset.phase='victory-theater';
}
window.addEventListener('message',event=>{
 if(event.source!==victoryTheater.contentWindow||event.data?.channel!=='pinball-theater')return;
 if(event.data.type==='ready'){victoryReady=true;if(!victory.hidden)renderVictory();}
 if(event.data.type==='sound'&&event.data.name==='explosion'&&!victory.hidden){playSound(explosion,.9);}
 if(event.data.type==='sound'&&event.data.name==='snare'&&!victory.hidden){playSound(snare,.85);}
 if(event.data.type==='error'){document.querySelector('#error').textContent='劇場演出載入失敗，請重播。';document.querySelector('#error').hidden=false;}
});
function render(){victory.hidden=false;renderVictory();}
function resetChapter(){victoryReady=false;victoryStarted=false;victoryTheater.src='../../pirate_enemy_theater.html?embed&story-victory';}
