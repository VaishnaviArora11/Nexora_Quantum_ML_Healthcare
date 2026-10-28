/* ---------- Quantum simulator (4 qubits, real amplitudes: RY + CNOT) ---------- */
const NQ=4,W1=[0.7,-0.4,1.1,0.3],W2=[-0.5,0.9,0.2,-0.8];
function ry(re,q,t){const c=Math.cos(t/2),s=Math.sin(t/2);for(let i=0;i<16;i++)if(!(i>>q&1)){const j=i|1<<q,a=re[i],b=re[j];re[i]=c*a-s*b;re[j]=s*a+c*b}}
function cx(re,c,t){for(let i=0;i<16;i++)if((i>>c&1)&&!(i>>t&1)){const j=i|1<<t;[re[i],re[j]]=[re[j],re[i]]}}
const ent=re=>{for(let q=0;q<NQ;q++)cx(re,q,(q+1)%NQ)};
function encode(x){const re=new Float64Array(16);re[0]=1;x.forEach((v,q)=>ry(re,q,v*Math.PI));ent(re);return re}
function circuit(x){const re=encode(x);W1.forEach((w,q)=>ry(re,q,w));ent(re);W2.forEach((w,q)=>ry(re,q,w));return re}
function zExp(re){let e=0;for(let i=0;i<16;i++)e+=(i&1?-1:1)*re[i]*re[i];return e}
function fidelity(a,b){let d=0;for(let i=0;i<16;i++)d+=a[i]*b[i];return d*d}
const clamp=v=>Math.max(0,Math.min(1,v)),norm=(v,a,b)=>clamp((v-a)/(b-a));
function histo(re){return`<div class="bars" title="Basis-state probabilities">${[...re].map(a=>`<div style="height:${Math.max(1,a*a*100)}%"></div>`).join('')}</div><div class="mu">Probabilities of the 16 basis states |0000⟩…|1111⟩</div>`}
function riskModel(p){const x=[norm(p.age,18,90),norm(p.bmi,16,45),norm(p.glu,70,250),norm(p.bp,90,200)];
 const classical=1/(1+Math.exp(-(4*x[0]+3*x[1]+5*x[2]+3.5*x[3]-7.2)));
 const re=circuit(x),quantum=(1-zExp(re))/2,hybrid=.5*classical+.5*quantum;return{classical,quantum,hybrid,re}}
const lvl=r=>r>.66?['High','bad']:r>.4?['Moderate','warn']:['Low','ok'];