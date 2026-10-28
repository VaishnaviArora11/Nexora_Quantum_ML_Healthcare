/* ---------- Quantum ML lab (runs fully in the browser) ---------- */
const mkQ=(c,m)=>({mode:m,data:null,label:'',group:'',pos:'',nq:6,cells:200,cpm:c,busy:false,prog:'',res:null,err:'',model:null});
const QS={qml:mkQ(true,'qml'),drug:mkQ(false,'drug'),risk:mkQ(false,'risk')};let Q=QS.qml;
const LAB={qml:{t:'Quantum ML lab',g:'Patient / sample column',w:'Genes',cpm:true,x:'${cfg.x}',d:'Runs entirely in your browser: a quantum-kernel classifier (QSVM) and a variational quantum classifier (VQC), simulated on up to 8 qubits, benchmarked against logistic regression with patient-level 5-fold cross-validation. Upload a CSV (one row per cell, gene columns, a 2-class label column and an optional patient ID column) or try the demo.'},
 drug:{t:'Drug discovery (quantum QSAR)',g:'Series / scaffold column',w:'Descriptors',s:'Rank new compounds',score:1,x:'',d:'Upload a compound table: one row per compound, numeric descriptors (MW, logP, TPSA…), a 2-class activity column (e.g. Active / Inactive) and an optional chemical-series column. A quantum-kernel model and a variational circuit learn which descriptors predict activity, are benchmarked with series-level cross-validation, and then score new candidate compounds.'},
 risk:{t:'Disease risk (hybrid quantum model)',g:'Centre / cohort column',w:'Features',s:'Score new patients',score:1,x:'',d:'Upload a patient table: one row per person, numeric measurements (age, BMI, glucose…), a 2-class outcome column and an optional centre/cohort column. The quantum models are benchmarked with centre-level cross-validation, then used to score a new patient or a whole batch for researchers and detection centres.'}};
const zf=(v,sel,mn,mx)=>sel.map((g,k)=>Math.max(0,Math.min(1,(v[g]-mn[k])/((mx[k]-mn[k])||1)))*Math.PI/2);
const qvals=()=>Q.data?[...new Set(Q.data.rows.map(r=>r[Q.data.headers.indexOf(Q.label)]))].sort():[];
function qPos(){const v=qvals();Q.pos=v.find(x=>/active|disease|tumou?r|cancer|positive|case/i.test(x))||v[1]||v[0]||''}
function demoTab(m){const r=mulb(m==='drug'?11:13),rows=[];
 if(m==='drug'){for(let i=0;i<150;i++){const a=r()<.4,s=Math.floor(r()*6);rows.push(['CMP-'+(1000+i),a?'Active':'Inactive','Series '+(s+1),Math.round(a?330+r()*90:300+r()*220),+(a?2+r()*1.8:.5+r()*4.5).toFixed(2),Math.floor(r()*(a?3:5)),Math.floor(2+r()*5),Math.round(a?60+r()*40:40+r()*90),Math.floor(r()*8),Math.floor(a?2+r()*2:r()*4)])}return{headers:['compound_id','activity','series','MW','logP','HBD','HBA','TPSA','rot_bonds','aromatic_rings'],rows,name:'Synthetic compound library (not real assay data)'}}
 for(let i=0;i<180;i++){const d=r()<.45,c=Math.floor(r()*6);rows.push(['PT-'+(2000+i),d?'Disease':'Healthy','Centre '+'ABCDEF'[c],Math.round(d?52+r()*28:30+r()*40),+(d?26+r()*9:20+r()*8).toFixed(1),Math.round(d?115+r()*80:75+r()*40),Math.round(d?135+r()*35:100+r()*30),Math.round(d?190+r()*60:150+r()*60),Math.round(d?32+r()*14:42+r()*20)])}
 return{headers:['patient_id','outcome','centre','age','bmi','glucose','sbp','cholesterol','hdl'],rows,name:'Synthetic patient dataset (not real patients)'}}
const demoFor=m=>m==='qml'?demo():demoTab(m);
function qScore(rows){const M=Q.model,Zs=rows.map(v=>zf(v,M.sel,M.mn,M.mx)),s=lsqsvm(M.Ztr,M.ytr,Zs),p=vqc(M.Ztr,M.ytr,Zs,M.sel.length,2,11);return s.map((v,i)=>(1/(1+Math.exp(-3*v))+p[i])/2)}
function scoreUI(){const M=Q.model,cfg=LAB[Q.mode];return`<h3 style="margin-top:18px">${cfg.s}</h3><p class="mu">Final model trained on all ${M.ytr.length} rows (average of the quantum-kernel and variational-circuit outputs). Score = estimated probability of “${esc(M.cls[1])}”.</p>
<div class="grid">${M.sel.map((g,k)=>`<div><label>${esc(M.genes[g])}</label><input type="number" step="any" id="sf${k}" value="${+M.med[g].toFixed(2)}"></div>`).join('')}</div><button class="btn" onclick="qPred()">Score this record</button><div id="sfo" style="margin-top:8px"></div>
<label>…or score a CSV of new records (same column names, first column = ID, up to 500 rows)</label><input type="file" accept=".csv,.txt" onchange="qScoreFile(this)"><div class="wrap" id="sfl"></div>`}
function qPred(){const M=Q.model,v=M.med.slice();M.sel.forEach((g,k)=>v[g]=+$('#sf'+k).value||0);const p=qScore([v])[0],[l,c]=lvl(p);$('#sfo').innerHTML=`<b class="${c}" style="font-size:20px">${(p*100).toFixed(1)}% – ${l}</b> <span class="mu">probability of “${esc(M.cls[1])}”</span>`}
async function qScoreFile(el){const f=el.files[0];if(!f)return;const M=Q.model,L=(await f.text()).split(/\r?\n/).filter(x=>x.trim()),sp=s=>s.split(',').map(v=>v.trim().replace(/^"|"$/g,'')),H=sp(L[0]),R=L.slice(1,501).map(sp),miss=M.sel.filter(g=>!H.includes(M.genes[g]));
 if(miss.length){$('#sfl').innerHTML='<p class="bad">Missing columns: '+miss.map(g=>esc(M.genes[g])).join(', ')+'</p>';return}
 $('#sfl').innerHTML='<p class="mu">Scoring…</p>';await sleep();
 const rows=R.map(r=>{const v=M.med.slice();M.sel.forEach(g=>v[g]=+r[H.indexOf(M.genes[g])]||0);return v}),s=qScore(rows),o=R.map((r,i)=>[r[0],s[i]]).sort((a,b)=>b[1]-a[1]).slice(0,25);
 $('#sfl').innerHTML=`<table><tr><th>#</th><th>ID</th><th>Score</th></tr>${o.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x[0])}</td><td>${(x[1]*100).toFixed(1)}%</td></tr>`).join('')}</table><p class="mu">Top ${o.length} of ${R.length} records.</p>`}

const sleep=()=>new Promise(r=>setTimeout(r,0));
function mulb(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuf(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/* n-qubit statevector simulator (RY + CNOT, real amplitudes) */
function gry(re,n,q,t){const c=Math.cos(t/2),s=Math.sin(t/2),N=1<<n;for(let i=0;i<N;i++)if(!(i>>q&1)){const j=i|1<<q,a=re[i],b=re[j];re[i]=c*a-s*b;re[j]=s*a+c*b}}
function gcx(re,n,c,t){const N=1<<n;for(let i=0;i<N;i++)if((i>>c&1)&&!(i>>t&1)){const j=i|1<<t,x=re[i];re[i]=re[j];re[j]=x}}
const gent=(re,n)=>{for(let q=0;q<n;q++)gcx(re,n,q,(q+1)%n)};
function qfeat(x){const n=x.length,re=new Float64Array(1<<n);re[0]=1;for(let r=0;r<2;r++){x.forEach((v,q)=>gry(re,n,q,v));gent(re,n)}return re}
function welch(X,y,g,idx){const n=[0,0],m=[0,0],s=[0,0];idx.forEach(i=>{const c=y[i],v=X[i][g];n[c]++;const d=v-m[c];m[c]+=d/n[c];s[c]+=d*(v-m[c])});return(m[1]-m[0])/Math.sqrt(s[0]/Math.max(1,n[0]-1)/n[0]+s[1]/Math.max(1,n[1]-1)/n[1]+1e-12)}
function pickGenes(X,y,tr,k){const t=[];for(let g=0;g<X[0].length;g++)t.push([g,welch(X,y,g,tr)]);t.sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));const cand=t.slice(0,40),mx=Math.abs(cand[0][1])||1,cols=cand.map(c=>tr.map(i=>X[i][c[0]]));
 const corr=(a,b)=>{const n=a.length;let ma=0,mb=0;for(let i=0;i<n;i++){ma+=a[i];mb+=b[i]}ma/=n;mb/=n;let sab=0,saa=0,sbb=0;for(let i=0;i<n;i++){const x=a[i]-ma,z=b[i]-mb;sab+=x*z;saa+=x*x;sbb+=z*z}return Math.abs(sab/Math.sqrt(saa*sbb+1e-12))};
 const ch=[0];while(ch.length<Math.min(k,cand.length)){let best=-1,bs=-1e9;cand.forEach((c,j)=>{if(ch.includes(j))return;const red=ch.reduce((s,q)=>s+corr(cols[j],cols[q]),0)/ch.length,sc=Math.abs(c[1])/mx-red;if(sc>bs){bs=sc;best=j}});ch.push(best)}
 return ch.map(j=>cand[j][0])}
function lsqsvm(Ztr,ytr,Zte){const S=Ztr.map(qfeat),T=Zte.map(qfeat),n=S.length,dot=(a,b)=>{let d=0;for(let i=0;i<a.length;i++)d+=a[i]*b[i];return d*d};
 const A=S.map((a,i)=>{const r=S.map(b=>dot(a,b));r[i]+=.1;r.push(ytr[i]?1:-1);return r});
 for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];const d=A[c][c]||1e-9;for(let r=c+1;r<n;r++){const f=A[r][c]/d;if(f)for(let k=c;k<=n;k++)A[r][k]-=f*A[c][k]}}
 const al=new Array(n);for(let i=n-1;i>=0;i--){let s=A[i][n];for(let k=i+1;k<n;k++)s-=A[i][k]*al[k];al[i]=s/(A[i][i]||1e-9)}
 return T.map(t=>S.reduce((s,a,i)=>s+al[i]*dot(a,t),0))}
function vqc(Ztr,ytr,Zte,n,L,seed){const r=mulb(seed),P=L*n,w=Array.from({length:P},()=>(r()-.5)*2);
 const f=(x,w)=>{const re=new Float64Array(1<<n);re[0]=1;for(let l=0;l<L;l++){for(let q=0;q<n;q++)gry(re,n,q,x[q]);for(let q=0;q<n;q++)gry(re,n,q,w[l*n+q]);gent(re,n)}let e=0;for(let i=0;i<re.length;i++)e+=(i&1?-1:1)*re[i]*re[i];return e};
 const m=new Array(P).fill(0),v=new Array(P).fill(0),idx=Ztr.map((_,i)=>i);
 for(let t=1;t<=40;t++){const b=shuf(idx.slice(),r).slice(0,32),g=new Array(P).fill(0);
  b.forEach(i=>{const p=Math.min(.98,Math.max(.02,(1-f(Ztr[i],w))/2)),d=(p-ytr[i])/(p*(1-p));for(let k=0;k<P;k++){const wp=w.slice(),wm=w.slice();wp[k]+=Math.PI/2;wm[k]-=Math.PI/2;g[k]+=d*-.25*(f(Ztr[i],wp)-f(Ztr[i],wm))/b.length}});
  for(let k=0;k<P;k++){m[k]=.9*m[k]+.1*g[k];v[k]=.999*v[k]+.001*g[k]*g[k];w[k]-=.1*(m[k]/(1-.9**t))/(Math.sqrt(v[k]/(1-.999**t))+1e-8)}}
 return Zte.map(x=>(1-f(x,w))/2)}
function logreg(Ztr,ytr,Zte){const n=Ztr[0].length,w=new Array(n).fill(0);let b=0;for(let it=0;it<300;it++){const gw=new Array(n).fill(0);let gb=0;Ztr.forEach((x,i)=>{const p=1/(1+Math.exp(-(b+x.reduce((s,v,k)=>s+v*w[k],0)))),d=p-ytr[i];x.forEach((v,k)=>gw[k]+=d*v);gb+=d});w.forEach((_,k)=>w[k]-=.5*gw[k]/Ztr.length);b-=.5*gb/Ztr.length}return Zte.map(x=>b+x.reduce((s,v,k)=>s+v*w[k],0))}
function qm(y,s){let tp=0,tn=0,fp=0,fn=0;s.forEach((v,i)=>{const p=v>0?1:0;if(y[i]&&p)tp++;else if(y[i])fn++;else if(p)fp++;else tn++});
 const sens=tp/(tp+fn||1),spec=tn/(tn+fp||1),pr=tp/(tp+fp||1),mcc=(tp*tn-fp*fn)/(Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn))||1);
 const o=s.map((v,i)=>[v,y[i]]).sort((a,b)=>a[0]-b[0]);let rs=0,pos=0;o.forEach((e,i)=>{if(e[1]){rs+=i+1;pos++}});const neg=o.length-pos;
 return{acc:(tp+tn)/y.length,auroc:(rs-pos*(pos+1)/2)/(pos*neg||1),mcc,prec:pr,sens,spec,f1:2*pr*sens/(pr+sens||1)}}
function demo(){const r=mulb(7),headers=['cell_id','tissue','patient',...Array.from({length:30},(_,i)=>'GENE_'+String(i+1).padStart(2,'0'))],rows=[];
 for(let p=0;p<8;p++){const tum=p%2,pf=.7+r()*.6;for(let c=0;c<20;c++){const row=['c'+p+'_'+c,tum?'Tumor':'Normal','P'+(p+1)];for(let g=0;g<30;g++){let mu=15*pf*(.6+r()*.8);if(g<4&&tum)mu*=2.5;if(g>=4&&g<7&&tum)mu*=.35;row.push(Math.round(mu*(.5+r())))}rows.push(row)}}
 return{headers,rows,name:'Synthetic demo data (not real patients)'}}
async function qLoad(){const f=$('#qf').files[0];if(!f)return;try{if(f.size>30e6)throw new Error('File over 30 MB: export fewer genes or cells');const L=(await f.text()).split(/\r?\n/).filter(x=>x.trim()),sp=s=>s.split(',').map(v=>v.trim().replace(/^"|"$/g,''));qSet({headers:sp(L[0]),rows:L.slice(1).map(sp),name:f.name})}catch(e){Q.err=e.message;render()}}
function qSet(d){Q.data=d;Q.res=null;Q.model=null;Q.err='';Q.prog='';const nn=d.headers.map((h,i)=>i).filter(i=>isNaN(+d.rows[0][i])),u=i=>new Set(d.rows.map(r=>r[i])).size;
 Q.label=d.headers[nn.find(i=>u(i)===2)]||d.headers[0];const g=nn.find(i=>d.headers[i]!==Q.label&&u(i)>=3&&u(i)<d.rows.length/3);Q.group=g===undefined?'':d.headers[g];qPos();render()}
function labView(mode){Q=QS[mode];const cfg=LAB[mode],d=Q.data,hs=d?d.headers:[],o=(h,s)=>`<option ${h===s?'selected':''}>${esc(h)}</option>`;return`<div class="card"><h2>${cfg.t}</h2><p class="mu">${cfg.d}</p>
<div class="row"><input type="file" id="qf" accept=".csv,.txt" onchange="qLoad()" style="max-width:300px"><button class="btn alt" style="margin:0" onclick="qSet(demoFor('${mode}'))">Load demo dataset</button></div>
${d?`<p class="mu">${esc(d.name)} · ${d.rows.length} rows × ${d.headers.length} columns</p><div class="grid"><div><label>Label column (2 classes)</label><select onchange="Q.label=this.value;qPos();render()">${hs.map(h=>o(h,Q.label)).join('')}</select></div><div><label>Positive class</label><select onchange="Q.pos=this.value">${qvals().map(v=>o(v,Q.pos)).join('')}</select></div><div><label>${cfg.g}</label><select onchange="Q.group=this.value"><option value="">(none – random folds)</option>${hs.map(h=>o(h,Q.group)).join('')}</select></div><div><label>Qubits (3–8)</label><input type="number" min="3" max="8" value="${Q.nq}" onchange="Q.nq=Math.max(3,Math.min(8,+this.value||6))"></div><div><label>Max rows used</label><input type="number" min="40" max="400" value="${Q.cells}" onchange="Q.cells=Math.max(40,Math.min(400,+this.value||200))"></div></div>
${cfg.cpm?`<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" style="width:auto" ${Q.cpm?'checked':''} onchange="Q.cpm=this.checked"> Raw counts: apply CPM + log1p</label>`:''}<button class="btn" onclick="qRun()" ${Q.busy?'disabled':''}>${Q.busy?'Running…':'Run benchmark'}</button>`:''}
<div class="bad" style="margin-top:8px">${esc(Q.err)}</div><div class="mu" id="qst">${esc(Q.prog)}</div>${Q.res?qRes():''}${Q.model&&cfg.score?scoreUI():''}
<div class="note">Simulated quantum circuits, not real hardware. Research demo, not diagnostic. Data never leaves your browser. To export from Python: ad[:, genes].to_df().assign(label=…, patient=…).to_csv("data.csv")</div></div>`}
async function qRun(){const d=Q.data;Q.busy=true;Q.err='';Q.res=null;render();const P=m=>{Q.prog=m;const e=$('#qst');if(e)e.textContent=m};await sleep();
 try{const hs=d.headers,li=hs.indexOf(Q.label),gi=Q.group?hs.indexOf(Q.group):-1,gcols=hs.map((h,i)=>i).filter(i=>i!==li&&i!==gi&&!isNaN(+d.rows[0][i])),cls=[...new Set(d.rows.map(r=>r[li]))].sort();
  if(cls.length!==2)throw new Error(`Label column needs exactly 2 classes, found ${cls.length}`);
  if(Q.pos&&cls[1]!==Q.pos&&cls.includes(Q.pos))cls.reverse();
  const r=mulb(1),keep=[0,1].flatMap(c=>shuf(d.rows.map((_,i)=>i).filter(i=>d.rows[i][li]===cls[c]),r).slice(0,Math.floor(Q.cells/2)));
  const X=keep.map(i=>{const v=gcols.map(c=>+d.rows[i][c]||0);if(Q.cpm){const s=v.reduce((a,b)=>a+b,0)||1;return v.map(x=>Math.log1p(x/s*1e6))}return v}),y=keep.map(i=>cls.indexOf(d.rows[i][li])),grp=keep.map(i=>gi>=0?d.rows[i][gi]:null),genes=gcols.map(c=>hs[c]),K=5;
  let fold;if(gi>=0){const u=shuf([...new Set(grp)],mulb(2));fold=grp.map(g=>u.indexOf(g)%K)}else fold=y.map((_,i)=>i%K);
  const nq=Math.min(Q.nq,gcols.length),R={QSVM:[],VQC:[],'Logistic reg.':[]},used={},hasB=a=>new Set(a.map(i=>y[i])).size===2;let ok=0;
  for(let f=0;f<K;f++){const tr=[],te=[];fold.forEach((v,i)=>(v===f?te:tr).push(i));if(!hasB(tr)||!hasB(te))continue;
   P(`Fold ${f+1}/${K}: selecting genes`);await sleep();
   const sel=pickGenes(X,y,tr,nq);sel.forEach(g=>used[genes[g]]=(used[genes[g]]||0)+1);
   const mn=sel.map(g=>Math.min(...tr.map(i=>X[i][g]))),mx=sel.map(g=>Math.max(...tr.map(i=>X[i][g]))),Z=i=>sel.map((g,k)=>Math.max(0,Math.min(1,(X[i][g]-mn[k])/((mx[k]-mn[k])||1)))*Math.PI/2);
   const Ztr=tr.map(Z),Zte=te.map(Z),ytr=tr.map(i=>y[i]),yte=te.map(i=>y[i]);
   P(`Fold ${f+1}/${K}: quantum kernel`);await sleep();R.QSVM.push(qm(yte,lsqsvm(Ztr,ytr,Zte)));
   P(`Fold ${f+1}/${K}: variational circuit`);await sleep();R.VQC.push(qm(yte,vqc(Ztr,ytr,Zte,nq,2,f+3).map(p=>p-.5)));
   R['Logistic reg.'].push(qm(yte,logreg(Ztr,ytr,Zte)));ok++}
  if(!ok)throw new Error('No valid folds: every fold needs both classes in train and test. Add more patients or choose no patient column.');
  const all=X.map((_,i)=>i),t=genes.map((g,j)=>[g,welch(X,y,j,all)]).sort((a,b)=>b[1]-a[1]),M={};
  for(const k in R){M[k]={};['acc','auroc','mcc','prec','sens','spec','f1'].forEach(m=>M[k][m]=R[k].reduce((s,x)=>s+x[m],0)/R[k].length)}
  const sel=pickGenes(X,y,all,nq),mn=sel.map(g=>Math.min(...X.map(v=>v[g]))),mx=sel.map(g=>Math.max(...X.map(v=>v[g])));
  Q.model={sel,mn,mx,genes,cls,Ztr:X.map(v=>zf(v,sel,mn,mx)),ytr:y,med:gcols.map((_,j)=>X.map(v=>v[j]).sort((a,b)=>a-b)[X.length>>1])};
  Q.res={M,ok,K,n:keep.length,cls,nq,up:t.slice(0,5).map(x=>x[0]),down:t.slice(-5).reverse().map(x=>x[0]),used:Object.entries(used).sort((a,b)=>b[1]-a[1]).slice(0,nq).map(x=>x[0])};P('Done')}
 catch(e){Q.err=e.message}Q.busy=false;render()}
function qRes(){const r=Q.res,K=['acc','auroc','mcc','prec','sens','spec','f1'],best=Object.keys(r.M).sort((a,b)=>r.M[b].auroc-r.M[a].auroc)[0];
 return`<h3 style="margin-top:16px">Results – ${r.n} rows, ${r.nq} qubits, ${r.ok}/${r.K} folds</h3><div class="wrap"><table><tr><th>Model</th>${K.map(k=>`<th>${k}</th>`).join('')}</tr>${Object.entries(r.M).map(([n,m])=>`<tr><td><b>${n}</b>${n===best?' <span class="tag ok">best AUROC</span>':''}</td>${K.map(k=>`<td>${m[k].toFixed(3)}</td>`).join('')}</tr>`).join('')}</table></div>
<p class="mu">Class “${esc(r.cls[1])}” vs “${esc(r.cls[0])}”.<br>Higher in ${esc(r.cls[1])}: <b>${r.up.map(esc).join(', ')}</b><br>Lower in ${esc(r.cls[1])}: <b>${r.down.map(esc).join(', ')}</b><br>${LAB[Q.mode].w} most often used as qubit inputs: <b>${r.used.map(esc).join(', ')}</b></p>`}