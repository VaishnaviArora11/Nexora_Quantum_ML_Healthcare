/* ---------- Render ---------- */
const VIEWS={qml:()=>labView('qml'),drug:()=>labView('drug'),risk:()=>labView('risk'),patients:patientsView,pub:pubCard,ops:opsView,monitor:monitorView,papers:()=>user.role==='researcher'?papersView():papersBase(),doctors:doctorsView,wallet:walletView,learn:learnView};
function render(){clearInterval(tmr);cancelAnimationFrame(HERO.raf);const a=$('#app');
 if(PAGE==='landing'){a.innerHTML=landing();startHero();return}
 a.innerHTML=shell();$('#v').innerHTML=VIEWS[tab]();if(tab==='papers')filt();if(tab==='monitor')startMonitor()}
render();initDb();