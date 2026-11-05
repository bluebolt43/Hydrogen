/* Optional GPU collision effects. Table artwork stays on Canvas2D. */
(function(root){'use strict';
const corners=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1],TAU=Math.PI*2;
class PlayEffectsWebGL{
 constructor(table,onLost){
  this.table=table;this.canvas=document.createElement('canvas');this.canvas.dataset.playLayer='webgl-effects';this.canvas.style.cssText='position:fixed;pointer-events:none;z-index:4';this.canvas.hidden=true;
  this.masks=new Map();this.colors=new Map();this.data=new Float32Array(65536);this.bodies=new Float32Array(9);this.used=0;this.stats={drawCalls:0,shapes:0,maskUploads:0};this.layoutDirty=true;
  this.onLost=e=>{e.preventDefault();this.lost=true;onLost();};this.onLayout=()=>{this.layoutDirty=true;};
  try{
   const g=this.gl=this.canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:true});if(!g)throw Error('WebGL unavailable');
   const shader=(type,source)=>{const s=g.createShader(type);g.shaderSource(s,source);g.compileShader(s);if(!g.getShaderParameter(s,g.COMPILE_STATUS)){const message=g.getShaderInfoLog(s);g.deleteShader(s);throw Error(message);}return s;};
   const v=shader(g.VERTEX_SHADER,'attribute vec2 p;attribute vec2 local;attribute vec4 shape;attribute vec4 color;uniform vec2 size;varying vec2 q;varying vec4 s;varying vec4 tint;varying vec2 pixel;void main(){gl_Position=vec4(p.x/size.x*2.-1.,1.-p.y/size.y*2.,0.,1.);q=local;s=shape;tint=color;pixel=p;}');
   const f=shader(g.FRAGMENT_SHADER,`precision highp float;
uniform sampler2D mask;uniform vec4 maskSize;uniform vec3 bodies[3];
varying vec2 q;varying vec4 s;varying vec4 tint;varying vec2 pixel;
void main(){
 for(int i=0;i<3;i++){if(bodies[i].z>0.&&distance(pixel,bodies[i].xy)<bodies[i].z)discard;}
 if(maskSize.x>0.){vec2 p=floor(pixel);if(p.x>=0.&&p.y>=0.&&p.x<maskSize.x&&p.y<maskSize.y){float bit=p.y*maskSize.x+p.x;float byte=floor(bit/8.);vec2 uv=(vec2(mod(byte,maskSize.z),floor(byte/maskSize.z))+.5)/maskSize.zw;float value=floor(texture2D(mask,uv).r*255.+.5);if(mod(floor(value/exp2(mod(bit,8.))),2.)>.5)discard;}}
 float d;
 if(s.w<0.){d=length(vec2(max(abs(q.x)-s.x,0.),q.y))-s.y;}
 else{d=abs(length(q)-s.x)-s.y;if(s.w<6.28){float angle=mod(atan(q.y,q.x)-s.z+6.2831853,6.2831853);if(angle>s.w){vec2 a=vec2(cos(s.z),sin(s.z))*s.x;vec2 b=vec2(cos(s.z+s.w),sin(s.z+s.w))*s.x;d=min(distance(q,a),distance(q,b))-s.y;}}}
 float alpha=tint.a*clamp(.5-d,0.,1.);gl_FragColor=vec4(tint.rgb*alpha,alpha);
}`);
   this.program=g.createProgram();g.attachShader(this.program,v);g.attachShader(this.program,f);g.linkProgram(this.program);g.deleteShader(v);g.deleteShader(f);if(!g.getProgramParameter(this.program,g.LINK_STATUS))throw Error(g.getProgramInfoLog(this.program));g.useProgram(this.program);
   this.buffer=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,this.buffer);for(const [name,n,offset]of [['p',2,0],['local',2,8],['shape',4,16],['color',4,32]]){const a=g.getAttribLocation(this.program,name);g.enableVertexAttribArray(a);g.vertexAttribPointer(a,n,g.FLOAT,false,48,offset);}
   this.size=g.getUniformLocation(this.program,'size');this.maskSize=g.getUniformLocation(this.program,'maskSize');this.bodyLocation=g.getUniformLocation(this.program,'bodies[0]');g.uniform1i(g.getUniformLocation(this.program,'mask'),0);g.enable(g.BLEND);g.blendFunc(g.ONE,g.ONE_MINUS_SRC_ALPHA);g.pixelStorei(g.UNPACK_ALIGNMENT,1);
   this.emptyTexture=g.createTexture();g.bindTexture(g.TEXTURE_2D,this.emptyTexture);this.textureParameters();g.texImage2D(g.TEXTURE_2D,0,g.LUMINANCE,1,1,0,g.LUMINANCE,g.UNSIGNED_BYTE,new Uint8Array(1));
   this.canvas.addEventListener('webglcontextlost',this.onLost);root.addEventListener('resize',this.onLayout);root.addEventListener('scroll',this.onLayout,true);document.body.append(this.canvas);
  }catch(error){this.destroy();throw error;}
 }
 textureParameters(){const g=this.gl;for(const name of [g.TEXTURE_WRAP_S,g.TEXTURE_WRAP_T])g.texParameteri(g.TEXTURE_2D,name,g.CLAMP_TO_EDGE);for(const name of [g.TEXTURE_MIN_FILTER,g.TEXTURE_MAG_FILTER])g.texParameteri(g.TEXTURE_2D,name,g.NEAREST);}
 begin(view,balls,radius,masks){
  if(this.maskLayout!==masks.revision){for(const r of this.masks.values())this.gl.deleteTexture(r.texture);this.masks.clear();this.maskLayout=masks.revision;}
  const c=this.canvas,t=this.table;if(c.width!==t.width||c.height!==t.height){c.width=t.width;c.height=t.height;this.layoutDirty=true;}
  if(this.layoutDirty){const r=t.getBoundingClientRect();c.style.left=r.left+'px';c.style.top=r.top+'px';c.style.width=r.width+'px';c.style.height=r.height+'px';this.layoutDirty=false;}
  this.view=view;this.scale=t.width/view[2];this.used=0;this.frameStarted=false;this.mask=null;this.stats.drawCalls=this.stats.shapes=this.stats.maskUploads=0;this.bodies.fill(0);
  let i=0;for(const b of balls){if(b.state==='drained'||i===3)continue;this.bodies[i*3]=(b.p[0]-view[0])*this.scale;this.bodies[i*3+1]=(b.p[1]-view[1])*this.scale;this.bodies[i*3+2]=radius*this.scale+.5;i++;}
 }
 startFrame(){if(this.frameStarted)return;const g=this.gl;g.viewport(0,0,this.canvas.width,this.canvas.height);g.uniform2f(this.size,this.canvas.width,this.canvas.height);g.uniform3fv(this.bodyLocation,this.bodies);g.clearColor(0,0,0,0);g.clear(g.COLOR_BUFFER_BIT);this.frameStarted=true;}
 useMask(mask){if(mask?.empty)mask=null;if(this.mask===mask)return;this.flush();this.mask=mask;}
 uploadMask(){
  const g=this.gl,m=this.mask;if(!m){g.bindTexture(g.TEXTURE_2D,this.emptyTexture);g.uniform4f(this.maskSize,0,0,1,1);return;}
  let record=this.masks.get(m);if(!record){for(const [old,r]of this.masks)if(old.width!==m.width||old.height!==m.height){g.deleteTexture(r.texture);this.masks.delete(old);}record={texture:g.createTexture(),revision:-1,width:256,height:Math.ceil(m.bits.length/256)};record.bytes=new Uint8Array(record.width*record.height);this.masks.set(m,record);g.bindTexture(g.TEXTURE_2D,record.texture);this.textureParameters();g.texImage2D(g.TEXTURE_2D,0,g.LUMINANCE,record.width,record.height,0,g.LUMINANCE,g.UNSIGNED_BYTE,null);}
  g.bindTexture(g.TEXTURE_2D,record.texture);if(record.revision!==m.revision){record.bytes.set(m.bits);g.texSubImage2D(g.TEXTURE_2D,0,0,0,record.width,record.height,g.LUMINANCE,g.UNSIGNED_BYTE,record.bytes);record.revision=m.revision;this.stats.maskUploads++;}g.uniform4f(this.maskSize,m.width,m.height,record.width,record.height);
 }
 quad(x,y,w,h,radius,halfWidth,start,span,color,alpha,angle=0){
  if(alpha<=0||this.lost)return;const needed=72;if(this.used+needed>this.data.length)this.flush();let rgb=this.colors.get(color);if(!rgb){rgb=[parseInt(color.slice(1,3),16)/255,parseInt(color.slice(3,5),16)/255,parseInt(color.slice(5,7),16)/255];this.colors.set(color,rgb);}
  const co=Math.cos(angle),si=Math.sin(angle),scale=this.scale;x=(x-this.view[0])*scale;y=(y-this.view[1])*scale;w*=scale;h*=scale;
  for(let i=0;i<12;i+=2){const a=corners[i]*w,b=corners[i+1]*h,at=this.used;this.data[at]=x+a*co-b*si;this.data[at+1]=y+a*si+b*co;this.data[at+2]=a;this.data[at+3]=b;this.data[at+4]=radius*scale;this.data[at+5]=halfWidth*scale;this.data[at+6]=start;this.data[at+7]=span;this.data[at+8]=rgb[0];this.data[at+9]=rgb[1];this.data[at+10]=rgb[2];this.data[at+11]=alpha;this.used+=12;}this.stats.shapes++;
 }
 ring(x,y,radius,width,color,alpha,start=0,span=TAU){const extent=radius+width/2+1/this.scale;this.quad(x,y,extent,extent,radius,width/2,start,span,color,alpha);}
 line(a,b,width,color,alpha){const dx=b[0]-a[0],dy=b[1]-a[1],half=Math.hypot(dx,dy)/2,r=width/2,pad=1/this.scale;this.quad((a[0]+b[0])/2,(a[1]+b[1])/2,half+r+pad,r+pad,half,r,0,-1,color,alpha,Math.atan2(dy,dx));}
 flush(){if(!this.used||this.lost)return;this.startFrame();this.uploadMask();const g=this.gl;g.bindBuffer(g.ARRAY_BUFFER,this.buffer);g.bufferData(g.ARRAY_BUFFER,this.data.subarray(0,this.used),g.STREAM_DRAW);g.drawArrays(g.TRIANGLES,0,this.used/12);this.stats.drawCalls++;this.used=0;}
 end(){this.flush();if(!this.frameStarted&&this.painted){this.startFrame();}this.painted=this.stats.shapes>0;this.canvas.hidden=!this.painted;}
 destroy(){root.removeEventListener('resize',this.onLayout);root.removeEventListener('scroll',this.onLayout,true);this.canvas.removeEventListener('webglcontextlost',this.onLost);if(this.gl&&!this.lost){for(const r of this.masks.values())this.gl.deleteTexture(r.texture);if(this.emptyTexture)this.gl.deleteTexture(this.emptyTexture);if(this.buffer)this.gl.deleteBuffer(this.buffer);if(this.program)this.gl.deleteProgram(this.program);this.gl.getExtension('WEBGL_lose_context')?.loseContext();}this.masks.clear();this.canvas.remove();this.canvas.width=this.canvas.height=0;}
}
root.PlayEffectsWebGL=PlayEffectsWebGL;
})(typeof window!=='undefined'?window:globalThis);
