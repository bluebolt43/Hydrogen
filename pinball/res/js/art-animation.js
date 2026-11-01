/* Artwork motion does not change lights or collision geometry. */
(function(root){
'use strict';
const {signal}=typeof module!=='undefined'&&module.exports?require('./art-events.js'):root.ArtEvents;
const games=new WeakMap();
function age(o,g){
 const a=o.animation;if(!g||!a?.enabled)return Infinity;
 let cache=games.get(g);if(!cache||cache.epoch!==g.attackRemaining){cache={epoch:g.attackRemaining,items:new Map()};games.set(g,cache);}
 let v=cache.items.get(o);if(!v){v={start:-Infinity,stamp:-Infinity,active:[]};cache.items.set(o,v);}
 const inputs=[a.trigger||{},...(a.extraTriggers||[])].map(t=>signal(o,g,t));
 const stamp=Math.max(...inputs.map(input=>Number.isFinite(input.stamp)?input.stamp:-Infinity));
 if(stamp!==v.stamp){v.start=stamp;v.stamp=stamp;}
 if(inputs.some((input,i)=>input.active&&!v.active[i]))v.start=g.time;
 v.active=inputs.map(input=>!!input.active);
 return g.time-v.start;
}
function offset(o,g){
 const a=o.animation;if(a?.effect!=='shake')return [0,0];
 const elapsed=age(o,g),duration=a.duration??.75,amplitude=a.amplitude??2.5;
 if(elapsed<0||elapsed>=duration)return [0,0];
 const fade=Math.min(1,(duration-elapsed)/.25);
 return [Math.sin(elapsed*55)*amplitude*fade,Math.cos(elapsed*47)*amplitude*.6*fade];
}
function flipScale(o,g){
 const a=o.animation;if(a?.effect!=='flip')return 1;
 const elapsed=age(o,g),duration=a.duration??1.5;
 if(elapsed<0||elapsed>=duration)return 1;
 const t=elapsed/duration,progress=1-(1-t)**2;
 return Math.cos(progress*(a.turns??3)*Math.PI*2);
}
const api={offset,flipScale};if(typeof module!=='undefined')module.exports=api;else root.ArtAnimation=api;
})(globalThis);
