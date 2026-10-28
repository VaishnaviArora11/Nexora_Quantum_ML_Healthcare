const $=s=>document.querySelector(s);
const ls={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const mem={users:ls.get('qc_users',{}),session:ls.get('qc_sess',null)};
let user=Object.assign({email:'demo@nexora.app',name:'Demo researcher',role:'researcher',pts:0,papers:[],booked:[],sessions:[]},ls.get('qc_demo',{})),tab='';
const ROLE={student:'Student',doctor:'Doctor',staff:'Hospital staff',researcher:'Researcher'};
async function hash(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(s)}}
const save=()=>ls.set('qc_demo',user);