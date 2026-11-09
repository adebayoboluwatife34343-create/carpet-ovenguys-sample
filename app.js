(function(){
const {RM,$,$$}=K;
/* intro preheat counter */
const deg=$('#deg'),bar=$('#degBar');
if(!RM){let t0=performance.now();const tick=n=>{const k=Math.min(1,(n-t0)/1500);deg.textContent=Math.round(20+160*k);bar.style.width=(k*100)+'%';if(k<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}
K.intro($('#intro'),1750);
K.reveal();K.magnet('.mag');K.tilt('.tilt');K.smooth();
K.waLinks({num:'447425752385',greet:'Hi, I found The Carpet & OvenGuys online and I would like a quote.'});
const F=K.form($('#qf'),{num:'447425752385',biz:'The Carpet & OvenGuys',areaLabel:'Postcode or town',greet:'Hi The Carpet & OvenGuys, I would like a quote.'});
window.__form=F;
$$('.pick').forEach(b=>b.addEventListener('click',()=>{const s=$('#qf').elements.service;s.value=b.dataset.job;s.dispatchEvent(new Event('change',{bubbles:true}));$('#quote').scrollIntoView({behavior:RM?'auto':'smooth'});setTimeout(()=>$('#qf').elements.name.focus({preventScroll:true}),500)}));
/* rail highlight */
const secs=['top','services','grime','about','quote'].map(id=>[id,document.getElementById(id)]);
const links=$$('.rail a');
const hl=()=>{let cur='top';secs.forEach(([id,el])=>{if(el.getBoundingClientRect().top<innerHeight*.45)cur=id});links.forEach(a=>a.classList.toggle('on',a.dataset.s===cur))};
/* shared oven state */
const st=window.OVEN={amt:0,src:'scroll'};
const story=$('#top'),sl=$('#scrub'),out=$('#scrubOut'),hudT=$('#hudT'),hudG=$('#hudG'),hudBar=$('#hudBar'),knob=$('.knob');
function setAmt(v,from){st.amt=Math.max(0,Math.min(100,v));sl.value=st.amt;out.textContent=Math.round(st.amt)+'%';
  hudT.textContent=Math.round(20+160*st.amt/100)+'°C';hudG.textContent='GRIME '+Math.round(100-st.amt)+'%';hudBar.style.width=st.amt+'%';
  knob.style.setProperty('--r',(st.amt*2.7-135)+'deg');window.OVEN.draw&&window.OVEN.draw()}
st.set=setAmt;
let lastScroll=-1;
const onScroll=()=>{hl();const r=story.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const p=K.scrollP(story);const v=Math.min(100,p*125);if(Math.abs(v-lastScroll)>.2){lastScroll=v;setAmt(v)}};
addEventListener('scroll',onScroll,{passive:true});onScroll();
sl.addEventListener('input',()=>setAmt(+sl.value));
$('#reset').addEventListener('click',()=>setAmt(0));
$('#spark').addEventListener('click',()=>{if(RM){setAmt(100);return}let v=st.amt;const go=()=>{v+=2.5;setAmt(v);if(v<100)requestAnimationFrame(go)};go()});
setAmt(0);
})();
