/* ---------- Demo role switcher (no sign-in) ---------- */
function setRole(r){user.role=r;user.name='Demo '+ROLE[r].toLowerCase();tab=tabsFor(r)[1][0];save();render();scrollTo(0,0)}
/* ---------- Tabs ---------- */
const tabsFor=r=>[['home','Overview'],...tabsBase(r)];
function tabsBase(r){const clin=[['patients','Patient data'],['monitor','Machine readings'],['ops','Staff & availability']];
 if(r==='researcher')return[['qml','Quantum ML lab'],['drug','Drug discovery'],['risk','Disease risk'],['papers','Papers']];
 if(r==='doctor')return[...clin,['pub','Publish to students']];
 if(r==='staff')return clin;
 return[['wallet','Health wallet'],['learn','Community & trends']]}
function shell(){const t=tabsFor(user.role);if(!t.find(x=>x[0]===tab))tab=t[0][0];
 return`<header><div class="logo" onclick="tab='home';render();scrollTo(0,0)">Nex<span>ora</span></div><nav>${t.map(x=>`<button class="${x[0]===tab?'on':''}" onclick="tab='${x[0]}';render()">${x[1]}</button>`).join('')}</nav>
<div class="sw"><span class="mu">View as:</span>${['researcher','doctor','staff','student'].map(r=>`<button class="${r===user.role?'on':''}" onclick="setRole('${r}')">${ROLE[r]}</button>`).join('')}</div></header><main id="v"></main>`}