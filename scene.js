import * as THREE from './three.module.js';
import {makeEnv} from './env.js';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const el=document.getElementById('stage'),cv=document.getElementById('c3d');
let r;try{r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});}catch(e){document.getElementById('nowebgl').hidden=false;throw e}
r.setPixelRatio(Math.min(devicePixelRatio,2));r.toneMapping=THREE.ACESFilmicToneMapping;r.outputColorSpace=THREE.SRGBColorSpace;
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.1,60);cam.position.set(0,.2,11);
sc.environment=makeEnv(THREE,r,{bg:0x1a1410,lights:[[0xffffff,7],[0xffd9b0,4],[0x8fb0ff,3]]});sc.add(new THREE.HemisphereLight(0xcfd6ff,0x20140c,.9));
const key=new THREE.DirectionalLight(0xffffff,1.6);key.position.set(4,6,8);sc.add(key);
const rim=new THREE.DirectionalLight(0xff7a2a,1.2);rim.position.set(-6,2,-4);sc.add(rim);
const glow=new THREE.PointLight(0xff6a1a,0,9,1.6);glow.position.set(0,0,.2);sc.add(glow);
const G=new THREE.Group();sc.add(G);
const W=4.4,H=4.6,D=3.2,T=.22;
const steel=new THREE.MeshStandardMaterial({color:0x9ea2a8,metalness:.85,roughness:.32});
const dark=new THREE.MeshStandardMaterial({color:0x151517,metalness:.4,roughness:.55});
const burnt=new THREE.Color(0x2a1608),shiny=new THREE.Color(0xc4c9cf);
const wallM=new THREE.MeshStandardMaterial({color:burnt.clone(),metalness:.3,roughness:.8,emissive:0xff4a00,emissiveIntensity:0});
const box=(w,h,d,m,x,y,z)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);G.add(b);return b};
/* shell */
box(W,T,D,steel,0,H/2-T/2,0);box(W,T,D,steel,0,-H/2+T/2,0);box(T,H,D,steel,-W/2+T/2,0,0);box(T,H,D,steel,W/2-T/2,0,0);
const back=box(W-2*T,H-2*T,T,wallM,0,0,-D/2+T/2);
const sideL=box(T*.4,H-2*T,D-T,wallM,-W/2+T+.02,0,0),sideR=box(T*.4,H-2*T,D-T,wallM,W/2-T-.02,0,0);
/* control panel strip above door */
box(W,.7,.3,dark,0,H/2+.35,D/2-.15);
const knobs=[];for(let i=0;i<4;i++){const k=new THREE.Mesh(new THREE.CylinderGeometry(.18,.2,.18,24),new THREE.MeshStandardMaterial({color:0xd8dadd,metalness:.9,roughness:.25}));k.rotation.x=Math.PI/2;k.position.set(-1.35+i*.9,H/2+.35,D/2+.08);const t=new THREE.Mesh(new THREE.BoxGeometry(.04,.14,.2),new THREE.MeshStandardMaterial({color:0xff6a1a,emissive:0xff6a1a,emissiveIntensity:.8}));t.position.set(0,.06,.1);t.rotation.x=0;k.add(t);G.add(k);knobs.push(k)}
/* racks */
const rackM=new THREE.MeshStandardMaterial({color:burnt.clone(),metalness:.8,roughness:.45});
const racks=[];[-.9,.3].forEach(y=>{const g=new THREE.Group();for(let i=0;i<9;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,D-.5,6),rackM);b.rotation.x=Math.PI/2;b.position.set(-1.7+i*.425,0,0);g.add(b)}
 for(let i=0;i<7;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,W-1.02,6),rackM);b.rotation.z=Math.PI/2;b.position.set(0,0,-1.2+i*.4);g.add(b)}g.position.y=y;G.add(g);racks.push(g)});
/* door on bottom hinge */
const hinge=new THREE.Group();hinge.position.set(0,-H/2+.05,D/2);G.add(hinge);
const dH=H-.1,dW=W;
const frame=new THREE.Mesh(new THREE.BoxGeometry(dW,dH,.22),steel);frame.position.set(0,dH/2,0);hinge.add(frame);
const glassM=new THREE.MeshPhysicalMaterial({color:0x0b0b0c,metalness:0,roughness:.08,transparent:true,opacity:.62,clearcoat:1});
const glass=new THREE.Mesh(new THREE.BoxGeometry(dW-.7,dH-1.15,.06),glassM);glass.position.set(0,dH/2-.15,.13);hinge.add(glass);
const handle=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,dW-.9,12),new THREE.MeshStandardMaterial({color:0xe4e6e9,metalness:1,roughness:.18}));handle.rotation.z=Math.PI/2;handle.position.set(0,dH-.25,.52);hinge.add(handle);
for(const sx of[-1,1]){const s=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.4,10),new THREE.MeshStandardMaterial({color:0xe4e6e9,metalness:1,roughness:.2}));s.rotation.x=Math.PI/2;s.position.set(sx*(dW/2-.5),dH-.25,.33);hinge.add(s)}
/* grime canvas on glass */
const gc=document.createElement('canvas');gc.width=gc.height=512;const gx=gc.getContext('2d');
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
gx.clearRect(0,0,512,512);
for(let i=0;i<260;i++){const x=rnd()*512,y=rnd()*512,rr=4+rnd()*rnd()*70;const g=gx.createRadialGradient(x,y,0,x,y,rr);g.addColorStop(0,'rgba(40,22,8,.95)');g.addColorStop(.6,'rgba(60,34,12,.6)');g.addColorStop(1,'rgba(60,34,12,0)');gx.fillStyle=g;gx.beginPath();gx.arc(x,y,rr,0,7);gx.fill()}
for(let i=0;i<70;i++){const x=rnd()*512,y=rnd()*400;gx.strokeStyle='rgba(30,16,6,.7)';gx.lineWidth=2+rnd()*3;gx.beginPath();gx.moveTo(x,y);gx.lineTo(x+(rnd()-.5)*6,y+30+rnd()*110);gx.stroke()}
const gt=new THREE.CanvasTexture(gc);gt.colorSpace=THREE.SRGBColorSpace;
const grimeM=new THREE.MeshBasicMaterial({map:gt,transparent:true,opacity:1,depthWrite:false});
const grime=new THREE.Mesh(new THREE.PlaneGeometry(dW-.7,dH-1.15),grimeM);grime.position.set(0,dH/2-.15,.165);hinge.add(grime);
/* interior grime on back wall (second texture) */
const bm=new THREE.MeshBasicMaterial({map:gt,transparent:true,opacity:1,depthWrite:false});
const bgr=new THREE.Mesh(new THREE.PlaneGeometry(W-2*T,H-2*T),bm);bgr.position.set(0,0,-D/2+T+.01);G.add(bgr);
/* steam + sparkles */
const N=90,pg=new THREE.BufferGeometry(),pp=new Float32Array(N*3),pv=[];for(let i=0;i<N;i++){pp[i*3]=(Math.random()-.5)*3;pp[i*3+1]=Math.random()*4-2;pp[i*3+2]=Math.random()*1.6;pv.push(.004+Math.random()*.012)}
pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
const sp=new THREE.Points(pg,new THREE.PointsMaterial({color:0x8ff5e6,size:.09,transparent:true,opacity:0,depthWrite:false}));sp.position.set(0,0,D/2);G.add(sp);
G.position.y=-.2;
let amt=0,yaw=-.45,pitch=.08,ty=-.45,tp=.08,drag=null,vis=true,t=0;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
function apply(){
  const a=(window.OVEN?window.OVEN.amt:0);amt=a;
  const open=sm(0,40,a),clean=sm(25,95,a);
  hinge.rotation.x=open*1.45*(-1)*-1; // opens forward/down
  hinge.rotation.x=open*1.5;
  grimeM.opacity=1-clean;bm.opacity=1-clean;
  wallM.color.copy(burnt).lerp(shiny.clone().multiplyScalar(.55),clean);wallM.emissiveIntensity=(1-clean)*0;
  rackM.color.copy(burnt).lerp(shiny,clean);
  glow.intensity=open*(1-clean*.4)*22;
  sp.material.opacity=open*(1-sm(60,100,a))*.55;
  knobs.forEach((k,i)=>k.rotation.y=-(a/100)*(2.2+i*.4));
}
function size(){const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h<.9?42:32;cam.updateProjectionMatrix()}
function frame_(){
  if(!vis&&!RM)return;
  yaw+=(ty-yaw)*.08;pitch+=(tp-pitch)*.08;
  G.rotation.y=yaw;G.rotation.x=pitch;
  if(!RM){t+=.016;const arr=pg.attributes.position.array;for(let i=0;i<N;i++){arr[i*3+1]+=pv[i];if(arr[i*3+1]>2.6)arr[i*3+1]=-2;arr[i*3]+=Math.sin(t+i)*.002}pg.attributes.position.needsUpdate=true}
  r.render(sc,cam);
}
function loop(){frame_();if(!RM)requestAnimationFrame(loop)}
window.OVEN=window.OVEN||{};window.OVEN.draw=()=>{apply();if(RM)frame_()};
new ResizeObserver(()=>{size();apply();frame_()}).observe(el);
new IntersectionObserver(es=>{vis=es[0].isIntersecting},{threshold:0}).observe(el);
el.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};el.setPointerCapture(e.pointerId)});
el.addEventListener('pointermove',e=>{if(drag){ty+=(e.clientX-drag.x)*.01;tp=Math.max(-.3,Math.min(.4,tp+(e.clientY-drag.y)*.004));drag={x:e.clientX,y:e.clientY};if(RM)frame_()}else if(!RM&&matchMedia('(pointer:fine)').matches){const b=el.getBoundingClientRect();ty=-.45+((e.clientX-b.left)/b.width-.5)*.7;tp=.08-((e.clientY-b.top)/b.height-.5)*.25}});
el.addEventListener('pointerup',()=>drag=null);el.addEventListener('pointercancel',()=>drag=null);
window.__oven3d={ready:true,get amt(){return amt},get yaw(){return yaw}};
size();apply();loop();if(RM)frame_();
