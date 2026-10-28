/* ---------- Landing hero: helix + qubit scene (Canvas 2D, no dependencies) ---------- */
let PAGE='landing';
const HERO={raf:0,mx:0,my:0,tx:0,ty:0};
function enter(r){PAGE='app';setRole(r);window.scrollTo(0,0)}
function goHome(){PAGE='landing';render();window.scrollTo(0,0)}
const PATHS=[['researcher','For researchers','Quantum drug discovery & disease risk','Benchmark quantum-kernel and variational models against classical baselines on gene, compound and cohort data.'],
 ['doctor','For hospitals','Staffing, monitoring & screening','Optimise ward allocation, watch bedside readings and flag possible diagnoses with the hybrid risk model.'],
 ['student','For everyone','Learn, connect, consult','Health literacy wallet, community sessions, new-disease briefs, papers and video consults with doctors.']];
function landing(){return`<section class="hero"><canvas id="hc" aria-hidden="true"></canvas><div class="hv"></div>
<div class="ht"><button class="logo" onclick="goHome()" aria-label="Nexora home">Nex<span>ora</span></button><nav class="hn"><a onclick="heroGo('paths')">Workspaces</a><a onclick="heroGo('live')">Live circuit</a></nav><button class="lm sm" onclick="enter('researcher')">Enter</button></div>
<div class="hb"><div class="hl"><div class="eb">Quantum × Healthcare</div><h1><em>Step into</em> the quantum side of care</h1>
<p>Nexora brings quantum machine learning to drug discovery and disease detection, and gives hospitals and patients one calm place to act on the results.</p>
<div class="cta"><button class="lm" onclick="enter('researcher')">Open the quantum lab</button><button class="gh" onclick="heroGo('paths')">Choose your path</button></div>
<div class="chips"><div><b>3–8</b><span>simulated qubits</span></div><div><b>5-fold</b><span>cross-validated</span></div><div><b>3</b><span>role workspaces</span></div></div></div>
<aside class="fn" id="live"><div class="eb" style="margin-bottom:8px">Live circuit</div><h3>Four-qubit register</h3><div class="mu">Real amplitudes from the same simulator the risk model uses. Inputs drift over time.</div><div id="hq"></div><div class="mu" id="hz" style="margin-top:6px"></div></aside></div>
<div class="paths" id="paths">${PATHS.map(p=>`<button class="pc" onclick="enter('${p[0]}')"><i>${p[1]}</i><h4>${p[2]}</h4><p>${p[3]}</p><u>Enter workspace →</u></button>`).join('')}</div>
<div class="hfoot">Simulated quantum circuits on classical hardware. Research demo, not a diagnostic device. Doctor listings and payments are demo only.</div></section>`}
function heroGo(id){const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth',block:'center'})}
function startHero(){cancelAnimationFrame(HERO.raf);const c=$('#hc');if(!c)return;const x=c.getContext('2d');if(!x)return;
 const dpr=Math.min(2,window.devicePixelRatio||1),still=matchMedia('(prefers-reduced-motion:reduce)').matches;let W=0,H=0;
 const rs=()=>{W=c.clientWidth;H=c.clientHeight;c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);x.setTransform(dpr,0,0,dpr,0,0)};rs();
 const rnd=mulb(5),P=Array.from({length:90},()=>({x:rnd(),y:rnd(),s:.4+rnd()*1.8,v:.015+rnd()*.05,p:rnd()*6.28,a:.15+rnd()*.5}));
 const N=64,mix=(a,b,t)=>a+(b-a)*t;let t0=performance.now(),fr=0;
 const onMove=e=>{HERO.tx=(e.clientX/innerWidth-.5)*2;HERO.ty=(e.clientY/innerHeight-.5)*2};addEventListener('pointermove',onMove,{passive:true});
 function glow(px,py,r,col,a){const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,col.replace('A',a));g.addColorStop(1,col.replace('A',0));x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,6.2832);x.fill()}
 function frame(now){if(!document.body.contains(c)){removeEventListener('pointermove',onMove);return}
  if(c.clientWidth!==W||c.clientHeight!==H)rs();
  const t=still?0:(now-t0)/1000;HERO.mx=mix(HERO.mx,HERO.tx,.04);HERO.my=mix(HERO.my,HERO.ty,.04);
  x.clearRect(0,0,W,H);x.globalCompositeOperation='lighter';
  const wide=W>860,cx=(wide?W*.7:W*.5)+HERO.mx*-22,R=Math.min(150,W*.22)*(wide?1:1.1),top=-H*.05,span=H*1.1,tilt=.18+HERO.my*.05,F=900;
  /* pollen */
  P.forEach(q=>{const y=((q.y-t*q.v)%1+1)%1,px=(q.x+Math.sin(t*.4+q.p)*.02)*W+HERO.mx*q.s*8,py=y*H;glow(px,py,q.s*5,'rgba(220,255,240,A)',q.a*(.5+.5*Math.sin(t+q.p)))});
  /* helix */
  const pts=[];for(let i=0;i<N;i++){const u=i/(N-1),ang=u*Math.PI*5+t*.55+HERO.mx*.6,y=top+u*span,sk=Math.sin(u*Math.PI*2+t*.3)*18;
   for(let s=0;s<2;s++){const a=ang+s*Math.PI,px=Math.cos(a)*R,z=Math.sin(a)*R,k=F/(F-z),yy=y+z*tilt;pts.push({s,i,x:cx+px*k+sk,y:yy,z,k})}}
  for(let i=0;i<N;i+=2){const a=pts[i*2],b=pts[i*2+1],al=.07+.16*((a.k+b.k)/2-.78);x.strokeStyle=`rgba(157,184,255,${Math.max(.04,al)})`;x.lineWidth=1;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}
  for(let i=0;i<N;i++)for(let s=0;s<2;s++){const p=pts[i*2+s],col=s?'rgba(185,166,255,A)':'rgba(125,255,208,A)',d=.45+.55*((p.z/R+1)/2);glow(p.x,p.y,(3+6*p.k-4)*1.8,col,.55*d)}
  /* qubit nodes: every 8th rung pulses and orbits */
  for(let i=4;i<N;i+=8){const a=pts[i*2],b=pts[i*2+1],mx=(a.x+b.x)/2,my=(a.y+b.y)/2,ph=Math.sin(t*1.6+i)*.5+.5;glow(mx,my,16+10*ph,'rgba(255,255,255,A)',.35+.3*ph);
   x.strokeStyle=`rgba(125,255,208,${.25+.3*ph})`;x.lineWidth=1;x.beginPath();x.ellipse(mx,my,20+8*ph,8+3*ph,t*.7+i,0,6.2832);x.stroke()}
  x.globalCompositeOperation='source-over';
  /* live register readout every few frames */
  if(!(fr++%8)){const q=$('#hq');if(q){const v=[.5+.5*Math.sin(t*.5),.5+.5*Math.sin(t*.37+1),.5+.5*Math.sin(t*.29+2),.5+.5*Math.sin(t*.43+3)],re=circuit(v);q.innerHTML=histo(re);const z=$('#hz');if(z)z.textContent='⟨Z⟩ on qubit 0 = '+zExp(re).toFixed(3)+'  ·  inputs '+v.map(n=>n.toFixed(2)).join(', ')}}
  HERO.raf=still?0:requestAnimationFrame(frame)}
 HERO.raf=requestAnimationFrame(frame)}