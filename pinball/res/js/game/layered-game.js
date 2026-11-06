/* Shared upper-floor physics for formal and debug players. */
(function(root){
'use strict';
function createGame(core){
 const {Grid,sub,dot,add,mul,len,nearest}=core;
 return class EditorLayerGame extends core.Game {
  build(){
   super.build();
   const parts=this.g.top_parts||[],edges=[];
   for(const o of parts){
    if(['wall','rail','active','rebound','bumper','test-post','target'].includes(o.kind)){
     if(o.center)edges.push({id:o.id,c:o.center,r:o.radius,kind:o.kind,bumperStrength:o.bumperStrength});
     else {let slingEdge=1;const ps=o.points||[];if((o.slingshot||o.kind==='active'||o.kind==='rebound'||o.mechanic==='active_rebound')&&ps.length>2)for(let i=2;i<ps.length;i++)if(len(sub(ps[i],ps[i-1]))>len(sub(ps[slingEdge],ps[slingEdge-1])))slingEdge=i;for(let i=1;i<(o.points||[]).length;i++)edges.push({id:o.id,a:o.points[i-1],b:o.points[i],kind:o.kind,n:o.pass_normal,thickness:o.thickness||0,mechanic:o.mechanic,reboundStrength:o.reboundStrength,slingshot:o.slingshot===true,slingshotFace:i===slingEdge,launchOnly:o.collisionMode==='launch-only'});}
    }
   }
   this.edges.top=edges;this.grids.top=new Grid(edges);
   for(const o of parts)if(o.kind==='rebound'||o.kind==='active'||o.mechanic==='active_rebound')this.reboundIds.add(o.id);
   // Flippers use the same engine on each floor; old ones default to lower.
   for(const [layer,objects] of [['tavern',this.g.upper_parts],['top',parts]])for(const o of objects.filter(o=>o.kind==='flipper')){
    const rest=Math.atan2(o.tip[1]-o.pivot[1],o.tip[0]-o.pivot[0]),up=Math.atan2(o.raised[1]-o.pivot[1],o.raised[0]-o.pivot[0]);
    this.flippers.push({...o,layer,angle:rest,rest,up:rest+Math.atan2(Math.sin(up-rest),Math.cos(up-rest)),length:len(sub(o.tip,o.pivot)),omega:0});
   }
  }
  syncRegion(){} // Legacy Pirate occupancy regions are not editor entrances.
  portalHit(p,d){
   let best=null; // Only explicit editor layer-entry objects may change floors.
   for(const t of (this.g.editor_transitions||[])){
    if(this.ball.layer!==t.from)continue;
    const from=dot(sub(p,t.points[0]),t.n),speed=dot(d,t.n);
    if(speed<=0||from>0||from+speed<0)continue;
    const time=-from/speed,q=add(p,mul(d,time)),near=nearest(q,...t.points);
    // An entrance is a crossing sensor; adjacent walls determine physical clearance.
    if(len(sub(q,near.p))>.01)continue;
    if(!best||time<best.t)best={t:time,editorPortal:t,n:t.n};
   }
   return best;
  }
  transition(hit){
   if(!hit.editorPortal)return super.transition(hit);
   this.ball.layer=hit.editorPortal.to;this.lastPortal=this.time;
   // A line sensor may enter with the ball already overlapping a destination wall.
   // Restore clearance so the next sweep can resolve that wall using normal physics.
   if(hit.editorPortal.points)for(const edge of this.edges[this.ball.layer]||[]){
    if(!['wall','rail'].includes(edge.kind)||edge.n||!edge.a||!this.edgeEnabled(edge))continue;
    const radius=this.physics.ballRadius+(edge.thickness||0)/2,bounds=edge.segmentBounds;
    // Use loading-time bounds when geometry is unchanged. Keep wall order and read the
    // current ball position after each push, including chains of overlapping walls.
    const prepared=bounds&&bounds[0]===edge.a[0]&&bounds[1]===edge.a[1]&&bounds[2]===edge.b[0]&&bounds[3]===edge.b[1];
    const minX=prepared?bounds[4]:Math.min(edge.a[0],edge.b[0]),minY=prepared?bounds[5]:Math.min(edge.a[1],edge.b[1]),maxX=prepared?bounds[6]:Math.max(edge.a[0],edge.b[0]),maxY=prepared?bounds[7]:Math.max(edge.a[1],edge.b[1]);
    if(this.ball.p[0]<minX-radius||this.ball.p[0]>maxX+radius||this.ball.p[1]<minY-radius||this.ball.p[1]>maxY+radius)continue;
    const offset=sub(this.ball.p,nearest(this.ball.p,edge.a,edge.b).p),distance=len(offset);
    if(distance>=radius)continue;
    let normal;
    if(distance>1e-9)normal=mul(offset,1/distance);
    else {
     const segment=sub(edge.b,edge.a),length=len(segment);if(!length)continue;
     normal=[-segment[1]/length,segment[0]/length];
     if(dot(normal,this.ball.v)>0)normal=mul(normal,-1);
    }
    this.ball.p=add(this.ball.p,mul(normal,radius-distance+.012));
   }
   if(hit.editorPortal.initialSpeed>0)this.ball.v=mul(this.ball.v,hit.editorPortal.initialSpeed/(len(this.ball.v)||1));
   if(hit.editorPortal.stopOnEntry){this.ball.v=[0,0];this.ball.state='layer-paused';this.ball.layerResumeAt=this.time+.5;this.ball.trail=[];}
   this.emit('layer',{id:hit.editorPortal.id,to:this.ball.layer});
  }
  handleBallState(dt){
   if(this.ball.state==='layer-paused'){
    if(this.time>=this.ball.layerResumeAt){this.ball.state='playing';delete this.ball.layerResumeAt;}
    return true;
   }
   return super.handleBallState(dt);
  }
  applyOneWaySpeed(previous,layer){
   const b=this.ball;if(b.state!=='playing'||b.layer!==layer)return;
   for(const line of this.g.oneway_speeds||[]){
    if(line.layer!==layer||!this.edgeEnabled({id:line.id,kind:'rail'}))continue;
    const from=dot(sub(previous,line.points[0]),line.n),to=dot(sub(b.p,line.points[0]),line.n);
    if(from>=0||to<0)continue;
    const q=add(previous,mul(sub(b.p,previous),-from/(to-from)));
    if(len(sub(q,nearest(q,...line.points).p))>.01)continue;
    b.v=mul(b.v,line.initialSpeed/(len(b.v)||1));
   }
  }
  visualPlane(ball){return ball.layer==='top'?'top':super.visualPlane(ball);}
  field(){const result=super.field();if(this.ball.layer==='top')this.ball.z=this.physics.rampHeight*2;return result;}
  resetTargets(){
   super.resetTargets();
   for(const o of this.g.top_parts||[]){
    if(!o.target_group)continue;
    let group=this.targetGroups.find(g=>g.id===o.target_group);
    if(!group){group={id:o.target_group,targets:[],hits:new Set(),complete:false,completions:0,resetAt:0};this.targetGroups.push(group);}
    group.targets.push(o.id);
   }
  }
  sensors(dt){
   super.sensors(dt);
   const b=this.ball;if(b.layer!=='top'||b.state!=='playing'||this.time<=b.immunity)return;
   for(const socket of (this.g.top_parts||[]).filter(o=>o.kind==='socket'))if(len(sub(socket.center,b.p))<socket.radius){this.capture(socket.id,socket.center,socket.release,'top',socket.release_direction,250);return;}
  }
 };
}
const api={createGame};
if(typeof module!=='undefined')module.exports=api;else root.LayeredGame=api;
})(globalThis);
