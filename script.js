/* Namma Pashu — front-end behaviour (static site, no backend).
   Sections: language · header/menu · reveal · marketplace · modal · FAQ · pilot form */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } }
  };

  /* ---------- Data ---------- */
  // Karnataka districts (kn, en)
  const DISTRICTS = [
    ['ಬಾಗಲಕೋಟೆ','Bagalkot'],['ಬಳ್ಳಾರಿ','Ballari'],['ಬೆಳಗಾವಿ','Belagavi'],['ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ','Bengaluru Rural'],['ಬೆಂಗಳೂರು ನಗರ','Bengaluru Urban'],['ಬೀದರ್','Bidar'],['ಚಾಮರಾಜನಗರ','Chamarajanagar'],['ಚಿಕ್ಕಬಳ್ಳಾಪುರ','Chikkaballapura'],['ಚಿಕ್ಕಮಗಳೂರು','Chikkamagaluru'],['ಚಿತ್ರದುರ್ಗ','Chitradurga'],['ದಕ್ಷಿಣ ಕನ್ನಡ','Dakshina Kannada'],['ದಾವಣಗೆರೆ','Davanagere'],['ಧಾರವಾಡ','Dharwad'],['ಗದಗ','Gadag'],['ಹಾಸನ','Hassan'],['ಹಾವೇರಿ','Haveri'],['ಕಲಬುರಗಿ','Kalaburagi'],['ಕೊಡಗು','Kodagu'],['ಕೋಲಾರ','Kolar'],['ಕೊಪ್ಪಳ','Koppal'],['ಮಂಡ್ಯ','Mandya'],['ಮೈಸೂರು','Mysuru'],['ರಾಯಚೂರು','Raichur'],['ರಾಮನಗರ','Ramanagara'],['ಶಿವಮೊಗ್ಗ','Shivamogga'],['ತುಮಕೂರು','Tumakuru'],['ಉಡುಪಿ','Udupi'],['ಉತ್ತರ ಕನ್ನಡ','Uttara Kannada'],['ವಿಜಯನಗರ','Vijayanagara'],['ವಿಜಯಪುರ','Vijayapura'],['ಯಾದಗಿರಿ','Yadgir']
  ].map(([kn, en]) => ({ id: en, kn, en }));
  const D = id => DISTRICTS.find(d => d.id === id);

  // DEMONSTRATION DATA ONLY — not real animals, prices or availability.
  const LISTINGS = [
    { id:'hallikar', cat:'cow', img:'assets/hallikar-cow.webp', pos:'50% 50%', district:'Mandya', taluk:{kn:'ಮದ್ದೂರು',en:'Maddur'},
      name:{kn:'ಹಳ್ಳಿಕಾರ್ ಹಸು',en:'Hallikar cow'}, kind:{kn:'ಹಸು · ನಾಟಿ ತಳಿ',en:'Cattle · Indigenous breed'},
      age:{kn:'4.5 ವರ್ಷ',en:'4.5 years'}, ageM:54, milk:'6–8 L/day', price:48000,
      note:{kn:'ಇದು ಹಳ್ಳಿಕಾರ್ ಹಸುವಿನ ಕಲ್ಪಿತ ಮಾದರಿ ಕಾರ್ಡ್. ನೈಜ ಪಟ್ಟಿಯಲ್ಲಿ ವಯಸ್ಸು, ಹಾಲಿನ ಪ್ರಮಾಣ ಮತ್ತು ಸ್ಥಳವನ್ನು ಮಾಲೀಕರು ನೀಡಬೇಕು; ಖರೀದಿದಾರರು ಸ್ಥಳದಲ್ಲೇ ಪರಿಶೀಲಿಸಬೇಕು.',en:'This is an illustrative Hallikar cow card. In a real listing the owner would supply age, milk yield and location, and a buyer would verify them in person.'} },
    { id:'murrah', cat:'buffalo', img:'assets/buffalo.webp', pos:'60% 40%', district:'Dharwad', taluk:{kn:'ಧಾರವಾಡ',en:'Dharwad'},
      name:{kn:'ಮುರ್ರಾ ಎಮ್ಮೆ',en:'Murrah buffalo'}, kind:{kn:'ಎಮ್ಮೆ · ಹೈನು ತಳಿ',en:'Buffalo · Dairy breed'},
      age:{kn:'5.2 ವರ್ಷ',en:'5.2 years'}, ageM:62, milk:'12–14 L/day', price:72000,
      note:{kn:'ಇದು ಮುರ್ರಾ ಎಮ್ಮೆಯ ಕಲ್ಪಿತ ಮಾದರಿ ಕಾರ್ಡ್. ತಳಿ, ಹಾಲಿನ ಪ್ರಮಾಣ ಮತ್ತು ಆರೋಗ್ಯದ ವಿವರಗಳನ್ನು ಖರೀದಿಗೂ ಮೊದಲು ಪರಿಶೀಲಿಸಬೇಕು.',en:'This is an illustrative Murrah buffalo card. Breed, milk yield and health details would need to be checked before any purchase.'} },
    { id:'hf', cat:'cow', img:'assets/hf-cow.webp', pos:'70% 50%', district:'Hassan', taluk:{kn:'ಅರಸೀಕೆರೆ',en:'Arsikere'},
      name:{kn:'ಎಚ್.ಎಫ್. ಕ್ರಾಸ್ ಹಸು',en:'HF crossbred cow'}, kind:{kn:'ಹಸು · ಮಿಶ್ರ ತಳಿ',en:'Cattle · Crossbreed'},
      age:{kn:'3.4 ವರ್ಷ',en:'3.4 years'}, ageM:41, milk:'18–20 L/day', price:64000,
      note:{kn:'ಇದು ಎಚ್.ಎಫ್. ಕ್ರಾಸ್ ಹಸುವಿನ ಕಲ್ಪಿತ ಮಾದರಿ ಕಾರ್ಡ್. ಇಲ್ಲಿನ ಸಂಖ್ಯೆಗಳು ವಿನ್ಯಾಸ ತೋರಿಸಲು ಮಾತ್ರ.',en:'This is an illustrative HF crossbred cow card. The numbers shown are for design demonstration only.'} },
    { id:'bannur', cat:'sheep', img:'assets/sheep.webp', pos:'50% 40%', district:'Mandya', taluk:{kn:'ನಾಗಮಂಗಲ',en:'Nagamangala'},
      name:{kn:'ಬನ್ನೂರು ಕುರಿ',en:'Bannur sheep'}, kind:{kn:'ಕುರಿ · ಸ್ಥಳೀಯ ತಳಿ',en:'Sheep · Local breed'},
      age:{kn:'11 ತಿಂಗಳು',en:'11 months'}, ageM:11, milk:null, price:24500,
      note:{kn:'ಇದು ಬನ್ನೂರು ಕುರಿಗಳ ಕಲ್ಪಿತ ಮಾದರಿ ಕಾರ್ಡ್ (ಜೋಡಿ ಉದಾಹರಣೆ). ನೈಜ ಮಾರಾಟದ ಮಾಹಿತಿ ಅಲ್ಲ.',en:'This is an illustrative Bannur sheep card (a pair, as an example). It is not real sale information.'} },
    { id:'goat', cat:'goat', img:'assets/goat.webp', pos:'65% 40%', district:'Belagavi', taluk:{kn:'ಅಥಣಿ',en:'Athani'},
      name:{kn:'ಸ್ಥಳೀಯ ಮೇಕೆ',en:'Local goat'}, kind:{kn:'ಮೇಕೆ · ಸ್ಥಳೀಯ',en:'Goat · Local'},
      age:{kn:'2 ವರ್ಷ',en:'2 years'}, ageM:24, milk:null, price:9500,
      note:{kn:'ಇದು ಮೇಕೆಯ ಕಲ್ಪಿತ ಮಾದರಿ ಕಾರ್ಡ್. ಬೆಲೆ ಮತ್ತು ಸ್ಥಳ ಕಾಲ್ಪನಿಕ.',en:'This is an illustrative goat card. Price and location are fictional.'} }
  ];

  const ROLES = [
    ['farmer','ಪಶುಪಾಲಕ / ಹೈನು ರೈತ','Livestock / dairy farmer'],['buyer','ಖರೀದಿದಾರ','Buyer'],['trader','ವ್ಯಾಪಾರಿ','Trader'],
    ['vet','ಪಶುವೈದ್ಯಕೀಯ ವೃತ್ತಿಪರ','Veterinary professional'],['other','ಇತರೆ','Other']
  ];
  const INTERESTS = [
    ['all','ಎಲ್ಲಾ ಪಶುಗಳು','All livestock'],['cow','ಹಸುಗಳು','Cattle'],['buffalo','ಎಮ್ಮೆಗಳು','Buffaloes'],['sheep','ಕುರಿಗಳು','Sheep'],['goat','ಮೇಕೆಗಳು','Goats']
  ];

  /* ---------- Language ---------- */
  let lang = new URLSearchParams(location.search).get('lang') || store.get('np-language') || 'kn';
  if (!['kn', 'en'].includes(lang)) lang = 'kn';
  const T = o => o[lang];
  const rerenderHooks = [];

  function setLanguage(next) {
    lang = next;
    document.documentElement.lang = lang;
    $$('[data-kn][data-en]').forEach(el => { el.innerHTML = el.dataset[lang]; });
    $$('[data-kn-placeholder]').forEach(el => { el.placeholder = lang === 'kn' ? el.dataset.knPlaceholder : el.dataset.enPlaceholder; });
    $$('.lang-switch button').forEach(b => {
      const on = b.dataset.lang === lang; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on));
    });
    $('#menuToggle').setAttribute('aria-label', lang === 'kn' ? 'ಮೆನು ತೆರೆಯಿರಿ' : 'Open menu');
    store.set('np-language', lang);
    try { const u = new URL(location.href); u.searchParams.set('lang', lang); history.replaceState(null, '', u); } catch { /* ignore */ }
    rerenderHooks.forEach(fn => fn());
  }
  $$('.lang-switch button').forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.lang)));

  /* ---------- Header / mobile menu ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const menuToggle = $('#menuToggle'), nav = $('#mainNav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? (lang === 'kn' ? 'ಮೆನು ಮುಚ್ಚಿ' : 'Close menu') : (lang === 'kn' ? 'ಮೆನು ತೆರೆಯಿರಿ' : 'Open menu'));
  }
  menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('resize', () => { if (innerWidth > 920) setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.section-head,.step,.benefit,.service,.about-copy,.breeds,.pilot-form,.faq-item,.stage-legend');
  revealEls.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { threshold: .12 });
    revealEls.forEach(el => io.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-visible'));

  /* ---------- Marketplace ---------- */
  const grid = $('#animalGrid'), mSearch = $('#mSearch'), mDistrict = $('#mDistrict'), mTaluk = $('#mTaluk'), mSort = $('#mSort');
  const count = $('#resultCount'), empty = $('#marketEmpty');
  let category = 'all';
  const fmtINR = n => '₹' + n.toLocaleString('en-IN');
  const marketDistricts = [...new Set(LISTINGS.map(l => l.district))];

  function fillMarketSelects() {
    const d = mDistrict.value || 'all', s = mSort.value || 'default';
    mDistrict.innerHTML = `<option value="all">${lang === 'kn' ? 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು' : 'All districts'}</option>` +
      marketDistricts.map(id => `<option value="${id}">${T(D(id))}</option>`).join('');
    mDistrict.value = d;
    fillTaluks();
    mSort.innerHTML = [['default', 'ವಿಂಗಡಿಸಿ: ಶಿಫಾರಸು', 'Sort: Recommended'], ['price-asc', 'ಬೆಲೆ: ಕಡಿಮೆ → ಹೆಚ್ಚು', 'Price: Low → High'], ['price-desc', 'ಬೆಲೆ: ಹೆಚ್ಚು → ಕಡಿಮೆ', 'Price: High → Low'], ['age-asc', 'ವಯಸ್ಸು: ಚಿಕ್ಕದು ಮೊದಲು', 'Age: Youngest first']]
      .map(([v, k, e]) => `<option value="${v}">${lang === 'kn' ? k : e}</option>`).join('');
    mSort.value = s;
  }
  function fillTaluks() {
    const d = mDistrict.value, cur = mTaluk.value || 'all';
    const taluks = d === 'all' ? [] : [...new Map(LISTINGS.filter(l => l.district === d).map(l => [l.taluk.en, l.taluk])).values()];
    mTaluk.disabled = d === 'all';
    mTaluk.innerHTML = `<option value="all">${lang === 'kn' ? 'ಎಲ್ಲಾ ತಾಲ್ಲೂಕುಗಳು' : 'All taluks'}</option>` + taluks.map(t => `<option value="${t.en}">${T(t)}</option>`).join('');
    mTaluk.value = taluks.some(t => t.en === cur) ? cur : 'all';
  }
  const norm = s => s.toLocaleLowerCase();
  function visibleListings() {
    const q = norm(mSearch.value.trim());
    let list = LISTINGS.filter(l => {
      if (category !== 'all' && l.cat !== category) return false;
      if (mDistrict.value !== 'all' && l.district !== mDistrict.value) return false;
      if (mTaluk.value !== 'all' && l.taluk.en !== mTaluk.value) return false;
      if (q) {
        const hay = norm([l.name.kn, l.name.en, l.kind.kn, l.kind.en, D(l.district).kn, D(l.district).en, l.taluk.kn, l.taluk.en].join(' '));
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (mSort.value === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (mSort.value === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (mSort.value === 'age-asc') list = [...list].sort((a, b) => a.ageM - b.ageM);
    return list;
  }
  function renderCards() {
    const list = visibleListings();
    grid.innerHTML = list.map((l, i) => `
      <article class="animal-card" style="animation-delay:${i * 60}ms">
        <div class="animal-photo"><img src="${l.img}" alt="${T(l.name)} — ${lang === 'kn' ? 'ಮಾದರಿ ಚಿತ್ರ' : 'sample image'}" style="object-position:${l.pos}" loading="lazy" width="648" height="370"><span class="sample-badge">${lang === 'kn' ? 'ಮಾದರಿ ಪಟ್ಟಿ' : 'Sample listing'}</span></div>
        <div class="animal-info">
          <span class="animal-kind">${T(l.kind)}</span>
          <h3>${T(l.name)}</h3>
          <p class="animal-loc"><svg class="icon"><use href="#i-pin"/></svg>${T(l.taluk)}, ${T(D(l.district))}</p>
          <dl class="animal-stats">
            <div><dt>${lang === 'kn' ? 'ವಯಸ್ಸು' : 'Age'}</dt><dd>${T(l.age)}</dd></div>
            <div><dt>${lang === 'kn' ? 'ಹಾಲಿನ ಪ್ರಮಾಣ' : 'Milk yield'}</dt><dd>${l.milk ? l.milk : (lang === 'kn' ? 'ಅನ್ವಯಿಸುವುದಿಲ್ಲ' : 'N/A')}</dd></div>
          </dl>
          <div class="animal-price"><small>${lang === 'kn' ? 'ಕಲ್ಪಿತ ಮಾದರಿ ಬೆಲೆ' : 'Illustrative price'}</small><strong>${fmtINR(l.price)}</strong></div>
          <button type="button" class="detail-button" data-id="${l.id}">${lang === 'kn' ? 'ಮಾದರಿ ವಿವರ ನೋಡಿ' : 'View sample details'}<svg class="icon"><use href="#i-arrow-right"/></svg></button>
        </div>
      </article>`).join('');
    if (list.length) grid.insertAdjacentHTML('beforeend', `
      <aside class="cta-card" style="animation-delay:${list.length * 60}ms"><span class="ico ico-orange"><svg class="icon"><use href="#i-sprout"/></svg></span>
        <h3>${lang === 'kn' ? 'ನಿಮ್ಮ ಪಶುವಿನ ಪಟ್ಟಿ ಇಲ್ಲಿ ಕಾಣಿಸಬಹುದು' : 'Your listing could appear here'}</h3>
        <p>${lang === 'kn' ? 'ಇವು ಮಾದರಿಗಳು ಮಾತ್ರ. ನಿಜವಾದ ಪಟ್ಟಿಗಳು ಪೈಲಟ್ ಆರಂಭವಾದ ನಂತರ ಮಾತ್ರ.' : 'These are samples only. Real listings will exist only after the pilot begins.'}</p>
        <a class="text-link" href="#pilot"><span>${lang === 'kn' ? 'ಪೈಲಟ್‌ಗೆ ಆಸಕ್ತಿ ತಿಳಿಸಿ' : 'Register pilot interest'}</span><svg class="icon"><use href="#i-arrow-right"/></svg></a>
      </aside>`);
    empty.classList.toggle('hidden', list.length !== 0);
    grid.classList.toggle('hidden', list.length === 0);
    count.textContent = lang === 'kn' ? `${list.length} ಮಾದರಿ ಪಟ್ಟಿಗಳು` : `${list.length} sample listing${list.length === 1 ? '' : 's'}`;
  }
  fillMarketSelects();
  rerenderHooks.push(() => { fillMarketSelects(); renderCards(); });
  mSearch.addEventListener('input', renderCards);
  mDistrict.addEventListener('change', () => { mTaluk.value = 'all'; fillTaluks(); renderCards(); });
  mTaluk.addEventListener('change', renderCards);
  mSort.addEventListener('change', renderCards);
  $$('.filter-chip').forEach(btn => btn.addEventListener('click', () => {
    category = btn.dataset.filter;
    $$('.filter-chip').forEach(b => { const on = b === btn; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    renderCards();
  }));
  $('#resetFilters').addEventListener('click', () => {
    mSearch.value = ''; mDistrict.value = 'all'; fillTaluks(); mSort.value = 'default'; category = 'all';
    $$('.filter-chip').forEach(b => { const on = b.dataset.filter === 'all'; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    renderCards();
  });

  /* ---------- Listing detail modal ---------- */
  const modal = $('#animalModal');
  let lastFocus = null;
  function openModal(id) {
    const l = LISTINGS.find(x => x.id === id); if (!l) return;
    lastFocus = document.activeElement;
    $('#modalImg').src = l.img; $('#modalImg').alt = T(l.name); $('#modalImg').style.objectPosition = l.pos;
    $('#modalKind').textContent = T(l.kind);
    $('#modalTitle').textContent = T(l.name);
    $('#modalLoc').textContent = `${T(l.taluk)}, ${T(D(l.district))}`;
    $('#modalFacts').innerHTML = `
      <div><dt>${lang === 'kn' ? 'ವಯಸ್ಸು' : 'Age'}</dt><dd>${T(l.age)}</dd></div>
      <div><dt>${lang === 'kn' ? 'ಹಾಲಿನ ಪ್ರಮಾಣ' : 'Milk yield'}</dt><dd>${l.milk || (lang === 'kn' ? 'ಅನ್ವಯಿಸುವುದಿಲ್ಲ' : 'N/A')}</dd></div>
      <div><dt>${lang === 'kn' ? 'ಕಲ್ಪಿತ ಮಾದರಿ ಬೆಲೆ' : 'Illustrative price'}</dt><dd>${fmtINR(l.price)}</dd></div>
      <div><dt>${lang === 'kn' ? 'ಸ್ಥಿತಿ' : 'Status'}</dt><dd>${lang === 'kn' ? 'ಮಾದರಿ ಮಾತ್ರ' : 'Demo only'}</dd></div>`;
    $('#modalDescription').textContent = T(l.note);
    modal.classList.remove('hidden'); document.body.style.overflow = 'hidden';
    $('#modalClose').focus();
  }
  function closeModal() {
    if (modal.classList.contains('hidden')) return;
    modal.classList.add('hidden'); document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  grid.addEventListener('click', e => { const b = e.target.closest('.detail-button'); if (b) openModal(b.dataset.id); });
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); setMenu(false); }
    if (e.key === 'Tab' && !modal.classList.contains('hidden')) { // simple focus trap
      const f = $$('button:not([disabled]),a[href]', modal); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- FAQ search ---------- */
  const faqSearch = $('#faqSearch'), faqItems = $$('.faq-item'), faqEmpty = $('#faqEmpty');
  faqSearch.addEventListener('input', () => {
    const q = norm(faqSearch.value.trim()); let n = 0;
    faqItems.forEach(it => { const hay = norm(it.textContent + ' ' + $$('[data-kn]', it).map(e => e.dataset.kn + ' ' + e.dataset.en).join(' ')); const m = !q || hay.includes(q); it.classList.toggle('hidden', !m); if (m) n++; if (q && m) it.open = true; });
    faqEmpty.classList.toggle('hidden', n !== 0);
  });

  /* ---------- Pilot form ---------- */
  const form = $('#pilotForm'), status = $('#formStatus'), submitBtn = $('#submitBtn');
  const sel = (el, rows, ph) => { const v = el.value; el.innerHTML = `<option value="">${ph}</option>` + rows.map(r => `<option value="${r[0]}">${lang === 'kn' ? r[1] : r[2]}</option>`).join(''); el.value = v; };
  function fillFormSelects() {
    sel($('#district'), DISTRICTS.map(d => [d.id, d.kn, d.en]).concat([['other', 'ಇತರೆ / ಬೇರೆ ರಾಜ್ಯ', 'Other / outside Karnataka']]), lang === 'kn' ? 'ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ' : 'Choose a district');
    sel($('#role'), ROLES, lang === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿ' : 'Choose one');
    const i = $('#interest'), v = i.value || 'all';
    i.innerHTML = INTERESTS.map(r => `<option value="${r[0]}">${lang === 'kn' ? r[1] : r[2]}</option>`).join(''); i.value = v;
    clearErrors();
  }
  rerenderHooks.push(fillFormSelects);

  const MSG = {
    name: { kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ 2 ಅಕ್ಷರ).', en: 'Please enter your name (at least 2 characters).' },
    phone: { kn: 'ದಯವಿಟ್ಟು ಸರಿಯಾದ 10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.', en: 'Please enter a valid 10-digit mobile number.' },
    district: { kn: 'ದಯವಿಟ್ಟು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.', en: 'Please choose your district.' },
    role: { kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.', en: 'Please choose your role.' },
    consent: { kn: 'ಮುಂದುವರಿಯಲು ಸಮ್ಮತಿ ಅಗತ್ಯ.', en: 'Your consent is required to continue.' }
  };
  function setError(key, on) {
    const el = $('#err-' + key), field = el.closest('.field');
    field.classList.toggle('is-invalid', on);
    el.innerHTML = on ? `<svg class="icon" style="width:16px;height:16px"><use href="#i-alert"/></svg><span>${T(MSG[key])}</span>` : '';
    const input = field.querySelector('input,select');
    if (input) input.setAttribute('aria-invalid', String(on));
    return on;
  }
  function clearErrors() { Object.keys(MSG).forEach(k => setError(k, false)); }
  function validate() {
    const name = $('#fullName').value.trim(), digits = $('#phone').value.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
    const bad = {
      name: name.length < 2,
      phone: !/^[6-9]\d{9}$/.test(digits),
      district: !$('#district').value,
      role: !$('#role').value,
      consent: !$('#consent').checked
    };
    Object.entries(bad).forEach(([k, v]) => setError(k, v));
    const firstBad = Object.keys(bad).find(k => bad[k]);
    if (firstBad) { const f = $('#err-' + firstBad).closest('.field').querySelector('input,select'); f && f.focus(); }
    return !firstBad;
  }
  ['fullName', 'phone', 'district', 'role', 'consent'].forEach(id => {
    const key = { fullName: 'name' }[id] || id;
    $('#' + id).addEventListener('input', () => { if ($('#err-' + key).closest('.field').classList.contains('is-invalid')) setError(key, false); });
    $('#' + id).addEventListener('change', () => setError(key, false));
  });

  const CONTACT_EMAIL = 'founder@nammapashu.co.in';
  const ENDPOINT = '/api/pilot';
  let message = '';
  let redrawStatus = null; // re-renders the current result box when the language changes
  function showStatus(kind, html, quiet) {
    status.className = 'form-status alert alert-' + kind; status.innerHTML = html;
    if (quiet) return;
    status.focus();
    if (!reduceMotion) status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function showReceived(quiet) {
    redrawStatus = showReceived;
    showStatus('success', `<div style="display:flex;gap:12px"><svg class="icon" style="margin-top:3px"><use href="#i-check-circle"/></svg><div><b>${lang === 'kn' ? 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ವಿವರಗಳು ತಲುಪಿವೆ.' : 'Thank you! Your details have been received.'}</b><br>${lang === 'kn' ? 'ನಾವು ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಸಂಪರ್ಕಿಸಬಹುದು. ಆಸಕ್ತಿ ತಿಳಿಸಿರುವುದು ಪೈಲಟ್ ಪ್ರವೇಶದ ಖಾತರಿಯಲ್ಲ.' : 'We may contact you on your mobile number. Registering interest does not guarantee a place in the pilot.'}</div></div>`, quiet);
  }
  function showFallback(quiet) {
    redrawStatus = showFallback;
    const mail = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Namma Pashu pilot interest') + '&body=' + encodeURIComponent(message);
    showStatus('error', `
      <div style="display:flex;gap:12px"><svg class="icon" style="margin-top:3px"><use href="#i-alert"/></svg><div><b>${lang === 'kn' ? 'ವಿವರಗಳನ್ನು ಕಳುಹಿಸಲು ಆಗಲಿಲ್ಲ' : 'We could not send your details'}</b><br>${lang === 'kn' ? 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ, ಅಥವಾ ಕೆಳಗಿನ ಸಂದೇಶವನ್ನು ' + CONTACT_EMAIL + ' ಗೆ ನೀವೇ ಕಳುಹಿಸಿ. ನಿಮ್ಮ ವಿವರಗಳು ಇನ್ನೂ ಕಳುಹಿಸಲ್ಪಟ್ಟಿಲ್ಲ.' : 'Please try again in a moment, or send the message below to ' + CONTACT_EMAIL + ' yourself. Your details have not been sent yet.'}</div></div>
      <div class="status-actions">
        <a class="button" href="${mail}">${lang === 'kn' ? 'ಇಮೇಲ್ ಮೂಲಕ ಕಳುಹಿಸಿ' : 'Send by email'}</a>
        <button type="button" class="button button-outline" id="copyDetails"><svg class="icon"><use href="#i-copy"/></svg>${lang === 'kn' ? 'ನಕಲಿಸಿ' : 'Copy'}</button>
      </div>`, quiet);
  }
  status.addEventListener('click', async e => {
    const btn = e.target.closest('#copyDetails'); if (!btn) return;
    try { await navigator.clipboard.writeText(message); btn.lastChild.textContent = lang === 'kn' ? 'ನಕಲಿಸಲಾಗಿದೆ' : 'Copied'; }
    catch { btn.lastChild.textContent = lang === 'kn' ? 'ಕೈಯಾರೆ ನಕಲಿಸಿ' : 'Copy manually'; }
  });
  function setLoading(on) { form.classList.toggle('is-loading', on); submitBtn.disabled = on; submitBtn.setAttribute('aria-busy', String(on)); }

  form.addEventListener('submit', async e => {
    e.preventDefault(); status.className = 'form-status'; status.innerHTML = ''; redrawStatus = null;
    if (!validate()) return;
    const payload = {
      name: $('#fullName').value.trim(), phone: $('#phone').value.trim(), district: $('#district').value, taluk: $('#taluk').value.trim(),
      role: $('#role').value, interest: $('#interest').value, consent: $('#consent').checked, lang, website: $('#website').value
    };
    const role = $('#role').selectedOptions[0].textContent, interest = $('#interest').selectedOptions[0].textContent, dist = $('#district').selectedOptions[0].textContent;
    message = [lang === 'kn' ? 'ನಮ್ಮ ಪಶು ಪೈಲಟ್ ಆಸಕ್ತಿ ನೋಂದಣಿ' : 'Namma Pashu pilot interest',
      `${lang === 'kn' ? 'ಹೆಸರು' : 'Name'}: ${payload.name}`, `${lang === 'kn' ? 'ಮೊಬೈಲ್' : 'Mobile'}: ${payload.phone}`,
      `${lang === 'kn' ? 'ಜಿಲ್ಲೆ' : 'District'}: ${dist}${payload.taluk ? ', ' + payload.taluk : ''}`,
      `${lang === 'kn' ? 'ಪಾತ್ರ' : 'Role'}: ${role}`, `${lang === 'kn' ? 'ಆಸಕ್ತಿ' : 'Interest'}: ${interest}`].join('\n');
    setLoading(true);
    try {
      const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl.signal });
      clearTimeout(t);
      if (res.ok) { form.reset(); $('#interest').value = 'all'; showReceived(); }
      else if (res.status === 422) {
        const data = await res.json().catch(() => ({})); const f = data.fields || {};
        ['name', 'phone', 'district', 'role', 'consent'].forEach(k => setError(k, !!f[k]));
      } else showFallback();
    } catch { showFallback(); }
    finally { setLoading(false); }
  });

  // Keep the result box and any field errors in the visitor's current language.
  rerenderHooks.push(() => {
    if (redrawStatus) redrawStatus(true);
    Object.keys(MSG).forEach(k => { if ($('#err-' + k).closest('.field').classList.contains('is-invalid')) setError(k, true); });
  });

  /* Design-review helper: ?formstate=loading | success | error | fallback  (static previews of the form states; no data is sent) */
  function previewFormState() {
    const s = new URLSearchParams(location.search).get('formstate'); if (!s) return;
    if (s === 'loading') setLoading(true);
    if (s === 'error') { validate(); showStatus('error', `<div style="display:flex;gap:12px"><svg class="icon" style="margin-top:3px"><use href="#i-alert"/></svg><div><b>${lang === 'kn' ? 'ಕೆಲವು ವಿವರಗಳನ್ನು ಸರಿಪಡಿಸಿ' : 'Please fix the highlighted fields'}</b></div></div>`); }
    if (s === 'success') showReceived();
    if (s === 'fallback') { message = 'Namma Pashu pilot interest (preview)'; showFallback(); }
  }

  setLanguage(lang);
  renderCards();
  previewFormState();
})();
