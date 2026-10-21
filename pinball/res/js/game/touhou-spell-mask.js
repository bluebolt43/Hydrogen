/* Transparent visual interference; never changes ball physics or player input. */
(function(root){'use strict';
class TouhouSpellMask{
 constructor(canvas,{onComplete=()=>{}}={}){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.onComplete=onComplete;this.elapsed=0;this.active=false;this.paused=false;this.frame=0;this.tick=this.tick.bind(this);}
 start(stage){const card=root.TouhouSpellcards.bosses.find(c=>c.stage===Number(stage));if(!card)throw Error('Unknown spell stage '+stage);this.clear();this.card=card;this.elapsed=0;this.active=true;this.paused=false;this.last=performance.now();this.frame=requestAnimationFrame(this.tick);return card;}
 onEvent(event){if(event.type==='boss-spell')return this.start(event.stage);if(['new-game','boss-defeated','boss-changed'].includes(event.type))this.clear();if(event.type==='pause')this.pause(event.paused);}
 pause(value){this.paused=!!value;this.last=performance.now();}
 clear(){cancelAnimationFrame(this.frame);this.active=false;this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
 tick(now){if(!this.active)return;const dt=Math.min(.05,(now-this.last)/1000);this.last=now;if(!this.paused)this.elapsed+=dt;this.render(this.elapsed);if(this.elapsed>=root.TouhouSpellcards.duration){this.clear();this.onComplete(this.card);return;}this.frame=requestAnimationFrame(this.tick);}
 render(t){const {canvas,ctx:c,card}=this;if(!card)return;const w=canvas.width,h=canvas.height;c.clearRect(0,0,w,h);c.save();c.scale(w,h);const fade=Math.min(1,t/.35,Math.max(0,(root.TouhouSpellcards.duration-t)/.8)),limit=card.safeBottom||1;
 c.beginPath();c.rect(0,0,1,limit);c.clip();c.globalAlpha=fade*.88;c.strokeStyle=card.color;c.lineWidth=.002;
 const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
 const bullet=(x,y,r,angle,kind,color)=>{if(x<-.02||x>1.02||y<0||y+r>limit)return;c.save();c.translate(x,y);c.rotate(angle);c.fillStyle=color||card.color;c.strokeStyle=color||card.color;c.beginPath();if(kind==='star'){for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,rr=k%2?r*.43:r;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr*.5625);}c.closePath();}else if(kind==='ice'){c.moveTo(0,-r*.62);c.lineTo(r*.58,0);c.lineTo(0,r*.62);c.lineTo(-r*.58,0);c.closePath();}else if(kind==='petal'){c.ellipse(0,0,r*.65,r*.29,0,0,Math.PI*2);}else if(kind==='round'){c.ellipse(0,0,r,r*.5625,0,0,Math.PI*2);}else{c.ellipse(0,0,r*.38,r*.67,0,0,Math.PI*2);}c.fill();c.globalAlpha*=.8;c.fillStyle='#f5fcff';c.beginPath();c.ellipse(0,0,r*.25,r*.19,0,0,Math.PI*2);c.fill();c.restore();};
 const columns=card.pattern==='gaps'?32:24;
 for(let i=0;i<card.count;i++){const row=Math.floor(i/columns),col=i%columns,birth=row*.045,age=t-birth;if(age<0)continue;let x,y,a=0,kind='rice',r=.012,color=card.color;const p=(age%3.7)/3.7,theta=col/columns*Math.PI*2;
 switch(card.pattern){
 case'ice':{const born=noise(i+4)*1.1,travel=Math.max(0,Math.min(t,2.15)-born);if(t<born)continue;const vx=(noise(i+18)-.5)*.62,vy=.11+noise(i+37)*.34,release=Math.max(0,t-3.2);x=.5+vx*travel+Math.sin(i*2.4)*release*.12;y=.10+vy*travel+release*.17;kind=i%4===0?'ice':'round';r=i%4===0?.015:.010;color=t>=2.15&&t<3.2?'#e9faff':['#71ceff','#9cffed','#a0abff'][i%3];break;}
 case'wind':a=theta+row*.19;x=.5+Math.cos(a)*p*.73;y=.15+p*.78+Math.sin(a)*p*.24;kind='rice';color=row%2?'#b6f0ff':'#efdd9b';break;
 case'stars':a=theta+row*.27+Math.sin(theta*5)*.12;x=.5+Math.cos(a)*p*.79;y=.16+p*.60+Math.sin(a)*p*.45;kind=row%3?'rice':'star';r=kind==='star'?.018:.011;color=row%2?'#fa8cde':'#a8f5d4';break;
 case'petals':a=theta+row*.17;x=.5+Math.cos(a)*p*.80;y=.17+p*.66+Math.sin(a)*p*.42;kind=row%2?'petal':'rice';r=.015;color=row%2?'#ffa4da':'#85dfff';break;
 case'waves':x=col/(columns-1)+Math.sin(p*8+row*.35)*.13;y=.08+p*.95;a=Math.sin(p*9+row*.35)*.9;r=.014;color=row%2?'#ff7ca9':'#aabaff';break;
 case'fire':a=theta+row*.23;x=.5+Math.cos(a)*p*.75;y=.15+p*.65+Math.sin(a)*p*.42;kind=row%3?'rice':'round';r=.013;color=row%2?'#ff8eac':'#ffd382';break;
 case'gaps':{const side=row%2?1:0;x=side+(side?-1:1)*p*1.1;y=.12+(col/(columns-1))*.84+Math.sin(p*5+row*.3)*.09;a=(side?-1:1)*.7;color=row%2?'#e5a0ff':'#ffa7cf';break;}
 case'laser':a=theta+row*.25;x=.5+Math.cos(a)*p*.9;y=.14+p*.64+Math.sin(a)*p*.46;kind='star';r=.017;color=row%2?'#ffe486':'#c0bcff';break;
 }bullet(x,y,r,a,kind,color);
 }
 if(card.pattern==='ice'&&t>2.2){for(let row=0;row<20;row++){const age=t-2.2-row*.065;if(age<0)continue;for(let k=0;k<7;k++){const a=(k-3)*.18;bullet(.5+Math.sin(a)*age*.42,.1+Math.cos(a)*age*.28,.013,0,'round','#448dff');}}}
 if(card.pattern==='waves'){for(let j=0;j<7;j++){const p=((t-j*.19)%2.2)/2.2;if(p<0)continue;c.globalAlpha=fade*(1-p)*.4;c.beginPath();c.ellipse(.5,.15,p*.85,p*.48,0,0,Math.PI*2);c.stroke();}}
 if(card.pattern==='petals'){c.globalAlpha=fade*.3;for(const direction of [-1,1]){c.beginPath();c.moveTo(direction<0?0:1,.24);c.lineTo(direction<0?1:0,.5+Math.sin(t*2)*.15);c.stroke();}}
 if(card.pattern==='gaps'){c.globalAlpha=fade*.7;for(let j=0;j<4;j++){c.beginPath();c.ellipse(j%2?.97:.03,.23+j*.16,.025,.055,0,0,Math.PI*2);c.stroke();}}
 if(card.pattern==='laser'){const age=t-.9;if(age>0&&age<3.8){const power=age<.7?.08:Math.min(1,(age-.7)/.3,Math.max(0,(3.8-age)/.8));c.globalAlpha=fade*power*.45;c.lineWidth=age<.7?.005:.19;c.strokeStyle='#c49cff';c.beginPath();c.moveTo(.5,.10);c.lineTo(.5+Math.sin(t*.9)*.23,1.1);c.stroke();if(age>.7){c.lineWidth=.075;c.strokeStyle='#fff8dc';c.stroke();}}}
 c.restore();}
 destroy(){this.clear();}
}
root.TouhouSpellMask=TouhouSpellMask;
})(window);
