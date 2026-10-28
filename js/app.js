/* ---------- Render ---------- */
const VIEWS={qml:()=>labView('qml'),drug:()=>labView('drug'),risk:()=>labView('risk'),patients:patientsView,pub:pubCard,ops:opsView,monitor:monitorView,papers:papersView,wallet:walletView,learn:learnView};
function render(){clearInterval(tmr);const a=$('#app');
 a.innerHTML=shell();$('#v').innerHTML=VIEWS[tab]();if(tab==='papers')filt();if(tab==='monitor')startMonitor()}
render();initDb();