/* Dedicated transparent spell surface. Simulation stays in TouhouSpellMask. */
(function(root){'use strict';
const TAU=Math.PI*2,cos=Array.from({length:32},(_,i)=>Math.cos(i*TAU/32)),sin=Array.from({length:32},(_,i)=>Math.sin(i*TAU/32)),corners=[-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,.5];
class TouhouSpellWebGL{
 constructor(canvas){
  this.canvas=canvas;const g=this.gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:true,preserveDrawingBuffer:false});if(!g)throw Error('WebGL unavailable');
  this.pages=[];this.tiles=new Map();this.data=new Float32Array(65536);this.used=0;this.calls=0;this.uploads=0;this.lost=false;
  this.onLost=e=>{e.preventDefault();this.lost=true;this.onContextLost?.();};canvas.addEventListener('webglcontextlost',this.onLost);
  const shader=(type,source)=>{const s=g.createShader(type);g.shaderSource(s,source);g.compileShader(s);if(!g.getShaderParameter(s,g.COMPILE_STATUS))throw Error(g.getShaderInfoLog(s));return s;};
  const v=shader(g.VERTEX_SHADER,'attribute vec2 p;attribute vec2 uv;attribute float alpha;uniform vec2 size;varying vec2 tex;varying float a;void main(){gl_Position=vec4(p.x/size.x*2.-1.,1.-p.y/size.y*2.,0.,1.);tex=uv;a=alpha;}'),f=shader(g.FRAGMENT_SHADER,'precision mediump float;uniform sampler2D image;varying vec2 tex;varying float a;void main(){gl_FragColor=texture2D(image,tex)*a;}');
  const program=this.program=g.createProgram();g.attachShader(program,v);g.attachShader(program,f);g.linkProgram(program);g.deleteShader(v);g.deleteShader(f);if(!g.getProgramParameter(program,g.LINK_STATUS))throw Error(g.getProgramInfoLog(program));g.useProgram(program);
  this.buffer=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,this.buffer);for(const [name,n,offset]of [['p',2,0],['uv',2,8],['alpha',1,16]]){const at=g.getAttribLocation(program,name);g.enableVertexAttribArray(at);g.vertexAttribPointer(at,n,g.FLOAT,false,20,offset);}
  this.size=g.getUniformLocation(program,'size');g.uniform1i(g.getUniformLocation(program,'image'),0);g.enable(g.BLEND);g.blendFunc(g.ONE,g.ONE_MINUS_SRC_ALPHA);g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,false);
 }
 begin(){const g=this.gl;if(this.lost)return;g.viewport(0,0,this.canvas.width,this.canvas.height);g.uniform2f(this.size,this.canvas.width,this.canvas.height);g.clearColor(0,0,0,0);g.clear(g.COLOR_BUFFER_BIT);this.used=0;this.batch=null;this.calls=this.uploads=0;}
 flush(){if(!this.used||this.lost)return;const g=this.gl;g.bindTexture(g.TEXTURE_2D,this.batch.texture);g.bindBuffer(g.ARRAY_BUFFER,this.buffer);g.bufferData(g.ARRAY_BUFFER,this.data.subarray(0,this.used),g.STREAM_DRAW);g.drawArrays(g.TRIANGLES,0,this.used/5);this.calls++;this.used=0;}
 tile(mask,kind,color,r){
  const key=kind+':'+color+':'+r;let tile=this.tiles.get(key);if(tile)return tile;
  const sprite=mask.sprite(kind,color,r);if(!sprite)return null;const image=sprite.canvas,side=Math.max(image.width,image.height)+2;if(side>1024)return null;
  let page=this.pages.at(-1);if(page&&page.x+side>1024){page.x=0;page.y+=page.row;page.row=0;}
  if(!page||page.y+side>1024){
   this.flush();const g=this.gl;if(this.pages.length===2){const old=this.pages.shift();g.deleteTexture(old.texture);for(const [key,tile]of this.tiles)if(tile.page===old)this.tiles.delete(key);}
   page={texture:g.createTexture(),x:0,y:0,row:0};this.pages.push(page);g.bindTexture(g.TEXTURE_2D,page.texture);for(const name of [g.TEXTURE_WRAP_S,g.TEXTURE_WRAP_T])g.texParameteri(g.TEXTURE_2D,name,g.CLAMP_TO_EDGE);for(const name of [g.TEXTURE_MIN_FILTER,g.TEXTURE_MAG_FILTER])g.texParameteri(g.TEXTURE_2D,name,g.NEAREST);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,1024,1024,0,g.RGBA,g.UNSIGNED_BYTE,null);
  }
  // Upload only a new glyph; the completed spell canvas is never uploaded.
  this.flush();const g=this.gl;g.bindTexture(g.TEXTURE_2D,page.texture);g.texSubImage2D(g.TEXTURE_2D,0,page.x+1,page.y+1,g.RGBA,g.UNSIGNED_BYTE,image);this.uploads++;
  tile={page,u:(page.x+1)/1024,v:(page.y+1)/1024,du:image.width/1024,dv:image.height/1024,pad:sprite.pad};page.x+=side;page.row=Math.max(page.row,side);this.tiles.set(key,tile);return tile;
 }
 quad(page,x,y,w,h,angle,u,v,du,dv,alpha,index=null){
  if(alpha<=0||this.lost)return;if(this.batch!==page){this.flush();this.batch=page;}if(this.used+30>this.data.length){const next=new Float32Array(this.data.length*2);next.set(this.data);this.data=next;}
  const co=index===null?Math.cos(angle):cos[index],si=index===null?Math.sin(angle):sin[index];
  for(let i=0;i<12;i+=2){const a=corners[i],b=corners[i+1],at=this.used;this.data[at]=x+a*w*co-b*h*si;this.data[at+1]=y+a*w*si+b*h*co;this.data[at+2]=u+(a+.5)*du;this.data[at+3]=v+(b+.5)*dv;this.data[at+4]=alpha;this.used+=5;}
 }
 sprite(mask,kind,color,r,x,y,angle,alpha,size=null,index=null){const tile=this.tile(mask,kind,color,r);if(tile)this.quad(tile.page,x,y,size??tile.pad*2,size??tile.pad*2,angle,tile.u,tile.v,tile.du,tile.dv,alpha,index);}
 aura(mask,t,lead){
  let origin=mask.origin??mask.card.origin,duration=mask.duration;
  if(mask.attacks){const a=mask.activeCast(t);if(!a)return;t-=a.start;origin=a.origin;duration=a.end-a.start;}
  const w=this.canvas.width,o=origin??{x:.5,y:.12},x=o.x*w,y=o.y*this.canvas.height;
  if(mask.entry.castAura==='hexagram'){const alpha=Math.max(0,Math.min(1,t/.3,(duration+lead-t)/.4))*.75,color=mask.entry.castAuraColor??'#fff',tile=this.tile(mask,'magic-ring',color,64);if(tile){const size=w*.3*tile.pad/64;this.sprite(mask,'magic-ring',color,64,x,y,0,alpha,size);this.sprite(mask,'magic-star',color,64,x,y,t*.22,alpha,size);}}
  if(mask.entry.castAura==='ice-crystal'){const tile=this.tile(mask,'ice-circle','#9bdfff',64);if(tile)this.sprite(mask,'ice-circle','#9bdfff',64,x,y,t*.22,Math.min(1,t/.25)*.7,w*.3*(tile.pad/64)*(.55+.45*(1-(1-Math.min(1,t/lead))**3)));}
 }
 renderMask(mask,sample,fade,t,lead){
  if(lead)this.aura(mask,t,lead);
  for(const b of sample.bullets){const r=b.drawRadiusPixels,x=b.drawX,y=b.drawY;if(!(b.alpha??1)||x+b.drawExtent<0||x-b.drawExtent>this.canvas.width||y+b.drawExtent<0||y-b.drawExtent>this.canvas.height)continue;this.sprite(mask,b.kind,b.color,r,x,y,b.drawAngleIndex*TAU/32,fade*(b.alpha??1),null,b.drawAngleIndex);}
  // Beams retain the same viewport exit calculation as the 2D renderer.
  for(const b of sample.beams){const extent=b.taper?1:mask.beamExtent(b);
   const x=b.x*this.canvas.width,y=b.y*this.canvas.height,dx=b.dx*this.canvas.width*extent,dy=b.dy*this.canvas.height*extent,length=Math.hypot(dx,dy),width=b.width*this.canvas.width;
   for(const factor of b.core?[1,.55]:[1]){const color=factor===1?b.color:'#fffaff',solid=this.solid(color);if(b.taper){if(this.batch!==solid.page){this.flush();this.batch=solid.page;}if(this.used+15>this.data.length)this.flush();const nx=-dy/(length||1)*width*factor/2,ny=dx/(length||1)*width*factor/2;for(const p of [[x,y],[x+dx+nx,y+dy+ny],[x+dx-nx,y+dy-ny]]){this.data[this.used++]=p[0];this.data[this.used++]=p[1];this.data[this.used++]=solid.u;this.data[this.used++]=solid.v;this.data[this.used++]=fade*b.alpha;}}else this.quad(solid.page,x+dx/2,y+dy/2,length,width*factor,Math.atan2(dy,dx),solid.u,solid.v,0,0,fade*b.alpha);}
  }
 }
 solid(color){const key='solid:'+color;let t=this.tiles.get(key);if(t)return t;const mask={sprite:()=>{const c=document.createElement('canvas');c.width=c.height=2;const b=c.getContext('2d');b.fillStyle=color;b.fillRect(0,0,2,2);return {canvas:c,pad:1};}};const tile=this.tile(mask,'solid',color,1);t={...tile,u:tile.u+tile.du/2,v:tile.v+tile.dv/2};this.tiles.set(key,t);return t;}
 end(){this.flush();}
 destroy(){this.canvas.removeEventListener('webglcontextlost',this.onLost);if(!this.lost){for(const page of this.pages)this.gl.deleteTexture(page.texture);this.gl.deleteBuffer(this.buffer);this.gl.deleteProgram(this.program);}this.pages=[];this.tiles.clear();}
}
root.TouhouSpellWebGL=TouhouSpellWebGL;
})(window);
