/* ---------- Render ---------- */
const VIEWS={home:homeView,qml:()=>labView('qml'),drug:()=>labView('drug'),risk:()=>labView('risk'),patients:patientsView,pub:pubCard,ops:opsView,monitor:monitorView,papers:papersView,wallet:walletView,learn:learnView};
function render(){clearInterval(tmr);cancelAnimationFrame(HERO.raf);const a=$('#app');
 a.innerHTML=shell();$('#v').className=tab==='home'?'full':'';$('#v').innerHTML=VIEWS[tab]();if(tab==='papers')filt();if(tab==='monitor')startMonitor();if(tab==='home')startHero()}
render();initDb();