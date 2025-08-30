// ------------------------
// NeonDrive — JavaScript
// ------------------------

// Theme toggle
(function themeToggle(){
  const btn = document.getElementById('toggleTheme');
  const saved = localStorage.getItem('neon-theme');
  if(saved === 'light') document.body.classList.add('light');
  btn.addEventListener('click', ()=>{
    document.body.classList.toggle('light');
    localStorage.setItem('neon-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
})();

// Stats playful counters
(function counters(){
  const targets = { builds: 126, hours: 4872, meets: 9 };
  const ids = { builds:'stat-builds', hours:'stat-hours', meets:'stat-meets' };
  Object.keys(targets).forEach(key=>{
    const el = document.getElementById(ids[key]);
    const target = targets[key];
    let n=0, step = Math.max(1, Math.floor(target/80));
    const t = setInterval(()=>{ n+= step; if(n>=target){ n=target; clearInterval(t);} el.textContent = n.toLocaleString(); }, 18);
  });
})();

// Build data
const builds = [
  { id:1, name:'R32 Skyline GT-R', year:1992, hp:520, tag:'JDM', pop:98 },
  { id:2, name:'S550 Mustang 5.0', year:2020, hp:480, tag:'Muscle', pop:87 },
  { id:3, name:'A90 Supra', year:2022, hp:550, tag:'JDM', pop:92 },
  { id:4, name:'E46 M3 CSL Tribute', year:2005, hp:360, tag:'Euro', pop:83 },
  { id:5, name:'Model 3 Track Pack', year:2024, hp:510, tag:'EV', pop:90 },
  { id:6, name:'GR Yaris Track', year:2023, hp:300, tag:'Track', pop:85 },
  { id:7, name:'1969 Camaro ProTouring', year:1969, hp:650, tag:'Muscle', pop:95 },
  { id:8, name:'Audi RS6 Avant', year:2021, hp:591, tag:'Euro', pop:88 },
  { id:9, name:'S2000 AP2', year:2007, hp:350, tag:'JDM', pop:80 },
];

const grid = document.getElementById('grid');
const chips = document.getElementById('chips');
const sortSel = document.getElementById('sort');

function carSVG(){
  return `
    <svg class="car-svg" viewBox="0 0 640 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M60 220c10-36 36-60 84-78 72-26 164-34 252-20 24 4 42 12 54 22 22 18 44 30 80 34 26 2 40 10 40 24s-12 22-38 22H116c-30 0-50-1-56-4-10-4-12-10 0-20Z" stroke="url(#g1)" stroke-width="10" stroke-linecap="round"/>
      <circle cx="180" cy="236" r="34" stroke="url(#g2)" stroke-width="12"/>
      <circle cx="470" cy="236" r="34" stroke="url(#g2)" stroke-width="12"/>
      <defs>
        <linearGradient id="g1" x1="60" y1="200" x2="600" y2="240" gradientUnits="userSpaceOnUse">
          <stop stop-color="var(--brand-2)"/><stop offset="1" stop-color="var(--brand-3)"/>
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="var(--brand)"/><stop offset="1" stop-color="var(--brand-3)"/>
        </linearGradient>
      </defs>
    </svg>`;
}



function renderCards(list){
  grid.innerHTML = '';
  list.forEach(b=>{
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <div class="thumb">${carSVG()}</div>
      <div class="body">
        <h3>${b.name} <span class="tag">${b.tag}</span></h3>
        <div class="specs"><span>Year: ${b.year}</span><span>•</span><span>${b.hp} hp</span><span>•</span><span>Score ${b.pop}</span></div>
      </div>`;
    el.addEventListener('click', ()=> pinCard(b, el));
    grid.appendChild(el);
  });
}

function currentFiltered(){
  const active = chips.querySelector('.chip.active');
  const filter = active?.dataset.filter || 'all';
  let arr = builds.filter(b => filter==='all' ? true : b.tag===filter);
  switch (sortSel.value) {
    case 'hp':  arr.sort((a,b)=> b.hp - a.hp); break;
    case 'year': arr.sort((a,b)=> b.year - a.year); break;
    default:    arr.sort((a,b)=> b.pop - a.pop);
  }
  return arr;
}

function pinCard(b, el){
  // simple focus effect + toast
  grid.querySelectorAll('.card').forEach(c=> c.style.outline='none');
  el.style.outline = '2px solid var(--brand-2)';
  toast(`${b.name} pinned — ${b.hp} hp • ${b.year} • ${b.tag}`);
}

chips.addEventListener('click', (e)=>{
  if(e.target.classList.contains('chip')){
    chips.querySelectorAll('.chip').forEach(c=> c.classList.remove('active'));
    e.target.classList.add('active');
    renderCards(currentFiltered());
  }
});

sortSel.addEventListener('change', ()=> renderCards(currentFiltered()));

// Initial render
renderCards(currentFiltered());

// Toast utility
function toast(text){
  const t = document.createElement('div');
  t.textContent = text;
  Object.assign(t.style, {
    position:'fixed', bottom:'20px', left:'50%', transform:'translateX(-50%)', padding:'10px 14px',
    borderRadius:'999px', background:'rgba(20,24,32,0.9)', color:'var(--text)', border:'1px solid var(--panel-strong)',
    boxShadow:'var(--shadow)', zIndex:70, fontWeight:700
  });
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity='0', 1600);
  setTimeout(()=> t.remove(), 2000);
}

document.addEventListener('DOMContentLoaded', function() {
  // ... (existing variable declarations)

  function estimate0to100(hp, kg, traction, aero) {
    const pw = hp / (kg / 1000);
    let time = 7.5 - (pw * 0.7); // This line needs to be inside the function

    if (traction === 'AWD') time -= 0.6;
    else if (traction === 'RWD') time -= 0.2;
    else if (traction === 'FWD') time += 0.2;

    if (aero === 'track') time -= 0.3;
    else if (aero === 'sport') time -= 0.15;

    time = Math.max(2.5, Math.min(time, 15));
    return { pw: pw.toFixed(2), time: time.toFixed(2) };
  }

  calcBtn.addEventListener('click', function() {
    const hp = parseFloat(hpInput.value) || 0;
    const kg = parseFloat(kgInput.value) || 0;
    const traction = tractionInput.value;
    const aero = aeroInput.value;

    if (hp < 50 || kg < 600) {
      pwOut.textContent = 'Power-to-Weight: —';
      timeOut.textContent = '— s';
      tipOut.textContent = 'Please enter realistic values.';
      return;
    }

    const result = estimate0to100(hp, kg, traction, aero);
    pwOut.textContent = `Power-to-Weight: ${result.pw} hp/ton`;
    timeOut.textContent = `${result.time} s`;
    tipOut.textContent = 'Try AWD + track aero for traction-limited builds.';
  });
});

// Gallery (placeholder Unsplash-like IDs via picsum.photos)
const gallery = [
  'https://picsum.photos/id/1011/800/600',
  'https://picsum.photos/id/1018/800/600',
  'https://picsum.photos/id/1020/800/600',
  'https://picsum.photos/id/1035/800/600',
  'https://picsum.photos/id/1043/800/600',
  'https://picsum.photos/id/1050/800/600',
  'https://picsum.photos/id/1069/800/600',
  'https://picsum.photos/id/1074/800/600',
  'https://picsum.photos/id/1084/800/600'
];

const masonry = document.getElementById('masonry');
gallery.forEach(src=>{
  const a = document.createElement('a');
  a.href = src; a.className = 'shot';
  a.innerHTML = `<img loading="lazy" src="${src}" alt="car meet"/>`;
  a.addEventListener('click', (e)=>{ e.preventDefault(); openLightbox(src); });
  masonry.appendChild(a);
});

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
function openLightbox(src){ lbImg.src = src; lb.classList.add('active'); }
lb.addEventListener('click', ()=> lb.classList.remove('active'));

// Timeline events (sample)
const events = [
  { when:'Sat • 7 Sep', what:'Cars & Coffee — Riverside Lot', note:'8:00–11:00 · Free · Family friendly' },
  { when:'Fri • 20 Sep', what:'Night Run — Coastal Loop', note:'Meet 10:30 PM · Fuel full · Radios on' },
  { when:'Sun • 6 Oct', what:'Autocross Round 3', note:'9:00–16:00 · Helmets provided · Sign-up closes 1 Oct' }
];
const timeline = document.getElementById('timeline');
events.forEach(ev=>{
  const e = document.createElement('div');
  e.className = 'event';
  e.innerHTML = `<div class="pill">${ev.when}</div><div><b>${ev.what}</b><div class="note">${ev.note}</div></div>`;
  timeline.appendChild(e);
});

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();