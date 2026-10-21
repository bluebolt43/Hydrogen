(()=>{'use strict';const $=id=>document.getElementById(id),data=window.TouhouSpellcards;let stage=1,paused=false,auto=false,next=0,time=0,last=0;
const mask=new TouhouSpellMask($('mask'),{onComplete(){ $('status').textContent='符卡結束';}});window.spellMask=mask;
function choose(value){stage=Number(value);mask.clear();const card=data.bosses.find(c=>c.stage===stage);$('spell').textContent=card.spell;$('description').textContent=card.description;for(const b of $('bosses').children)b.setAttribute('aria-pressed',String(Number(b.dataset.stage)===stage));$('status').textContent='準備發動';next=time+data.interval;}
function cast(){mask.start(stage);mask.pause(paused);$('status').textContent=data.bosses[stage-1].spell+' · 發動';next=time+data.interval;}
for(const card of data.bosses){const b=document.createElement('button');b.dataset.stage=card.stage;b.textContent='A'+card.stage+' '+card.name;b.onclick=()=>{choose(card.stage);cast();};$('bosses').append(b);}
$('cast').onclick=cast;$('clear').onclick=()=>{mask.clear();$('status').textContent='已清除';};$('pause').onclick=()=>{paused=!paused;mask.pause(paused);$('pause').textContent=paused?'繼續':'暫停';};$('auto').onclick=()=>{auto=!auto;$('auto').setAttribute('aria-pressed',String(auto));if(auto)cast();};
addEventListener('pinball:boss-spell',e=>{choose(e.detail.stage);cast();});addEventListener('pinball:boss-defeated',()=>mask.clear());addEventListener('pagehide',()=>mask.destroy());
const c=$('table').getContext('2d');function line(points,color,width){c.beginPath();c.strokeStyle=color;c.lineWidth=width;points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function draw(now){if(last&&!paused)time+=Math.min(.05,(now-last)/1000);last=now;c.clearRect(0,0,361,642);c.fillStyle='#211d32';c.fillRect(0,0,361,642);c.strokeStyle='#756383';c.lineWidth=2;c.strokeRect(15,15,331,610);
line([[25,470],[50,540],[124,577]],'#bc957a',8);line([[336,470],[311,540],[237,577]],'#bc957a',8);line([[125,580],[166,601]],'#ebc471',13);line([[236,580],[195,601]],'#ebc471',13);
for(const [x,y] of [[110,215],[250,215],[180,295]]){c.beginPath();c.fillStyle='#433858';c.strokeStyle='#d0a589';c.arc(x,y,26,0,Math.PI*2);c.fill();c.stroke();}for(let i=0;i<4;i++)line([[110+i*45,350],[110+i*45,380]],'#cda26e',7);
c.fillStyle='#ccb3d0';c.font='14px system-ui';c.textAlign='center';c.fillText('BOSS · '+data.bosses[stage-1].name,180,48);c.fillStyle='#f5ecd4';c.beginPath();c.arc(180+Math.sin(time*1.6)*115,330+Math.sin(time*2.2)*180,7,0,Math.PI*2);c.fill();if(auto&&!paused&&time>=next)cast();requestAnimationFrame(draw);}
choose(1);requestAnimationFrame(draw);
})();
