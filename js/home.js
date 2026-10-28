/* ---------- Landing / overview (Kage-inspired scroll scenes) ---------- */
const HERO={raf:0,io:null,off:null};
const GO={researcher:'Researchers',doctor:'Doctors',staff:'Hospital staff',student:'Students'};
function homeView(){
 const sc=(n,eye,t,p,items,r,btn)=>`<section class="scene"><div class="sc-t rv"><div class="num">${n}</div></div><div class="rv"><div class="eyebrow">${eye}</div><h2>${t}</h2><p>${p}</p><ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul><button class="btn" onclick="setRole('${r}')">${btn}</button></div></section>`;
 return`<section class="hero"><canvas id="hc"></canvas><div class="disc"><i></i><b></b><b></b></div>
<div class="hero-in"><div class="eyebrow">Quantum healthcare platform</div><h1>Where quantum<br>meets the ward.</h1>
<p class="lead">Quantum-kernel models for drug discovery and disease risk, live hospital operations, and community health education — in one calm, connected space.</p>
<div class="cta"><button class="btn" onclick="setRole('researcher')">Enter the lab</button><button class="btn alt" onclick="setRole('doctor')">Hospital view</button><button class="btn alt" onclick="setRole('student')">Learn &amp; earn</button></div></div>
<div class="scroll-hint">Scroll</div></section>
<div class="stats rv"><div><b>8</b><span>Simulated qubits</span></div><div><b>3</b><span>Quantum models</span></div><div><b>5-fold</b><span>Group cross-validation</span></div><div><b>0</b><span>Data leaves your browser</span></div></div>
${sc('01','For researchers','Sharper discovery, clearer risk.','Benchmark a quantum-kernel classifier and a variational circuit against classical baselines, then score new compounds or patients.',['Drug discovery — quantum QSAR with series-level validation','Disease risk — hybrid model for labs and detection centres','Papers — search and add to the research interface'],'researcher','Open the Quantum lab')}
${sc('02','For hospitals','Staff the right ward, at the right hour.','Optimise availability, watch bedside readings, and screen every patient with the hybrid risk model for early flags.',['Staff &amp; availability by shift','Acuity-weighted ward allocation','Live machine readings with risk alerts'],'doctor','Open the hospital view')}
${sc('03','For students &amp; community','Health literacy you can feel.','Earn points in your health wallet, join community education sessions and follow trending topics, new diseases and prevention.',['Health impact wallet and literacy quiz','Sessions published by verified doctors','Trending viruses and prevention guides'],'student','Start learning')}
<div class="foot">Nexora · Simulated quantum circuits, not real hardware. Research demo, not diagnostic.</div>`}
function startHero(){
 cancelAnimationFrame(HERO.raf);if(HERO.io)HERO.io.disconnect();
 HERO.io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');HERO.io.unobserve(e.target)}}),{threshold:.15});
 document.querySelectorAll('.rv').forEach(e=>HERO.io.observe(e));
 const c=$('#hc');if(!c||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const x=c.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1);let W,H;
 const fit=()=>{W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)};fit();
 const P=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*3,v:.15+Math.random()*.5,s:Math.random()*6.28,g:Math.random()<.25}));
 const loop=()=>{if(!$('#hc'))return;x.clearRect(0,0,W,H);const sy=scrollY*.15;
  P.forEach(p=>{p.s+=.01;p.y+=p.v;p.x+=Math.sin(p.s)*.5+.25;if(p.y>H+10){p.y=-10;p.x=Math.random()*W}if(p.x>W+10)p.x=-10;
   x.globalAlpha=.55;x.fillStyle=p.g?'#e9b98b':'#e0231c';x.beginPath();x.ellipse(p.x,(p.y+sy)%H,p.r*1.6,p.r,p.s,0,6.28);x.fill()});
  HERO.raf=requestAnimationFrame(loop)};loop();
 addEventListener('resize',fit);
}