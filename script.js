(() => {
  const body = document.body;
  const langToggle = document.getElementById('langToggle');
  let language = localStorage.getItem('np-language') || new URLSearchParams(location.search).get('lang') || 'kn';
  if (!['kn','en'].includes(language)) language = 'kn';
  function setLanguage(next) {
    language = next;
    document.documentElement.lang = language;
    document.querySelectorAll('[data-kn][data-en]').forEach(el => {
      const val = el.dataset[language];
      if (val !== undefined) el.innerHTML = val;
    });
    document.querySelectorAll('[data-kn-placeholder][data-en-placeholder]').forEach(el => {
      el.placeholder = el.dataset[language === 'kn' ? 'knPlaceholder' : 'enPlaceholder'];
    });
    langToggle.innerHTML = language === 'kn' ? 'ಕನ್ನಡ <span>EN</span>' : 'ಕನ್ನಡ <span class="selected-lang">EN</span>';
    langToggle.setAttribute('aria-label', language === 'kn' ? 'Switch to English' : 'Switch to Kannada');
    localStorage.setItem('np-language', language);
    const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState({}, '', url);
  }
  langToggle.addEventListener('click', () => setLanguage(language === 'kn' ? 'en' : 'kn'));
  setLanguage(language);

  const header = document.querySelector('.site-header');
  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 12), {passive:true});
  const menuToggle = document.getElementById('menuToggle'), nav = document.getElementById('mainNav');
  function closeMenu(){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open menu')}
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label',open?'Close menu':'Open menu');
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeModal()}});
  addEventListener('resize',()=>{if(innerWidth>920)closeMenu()});

  const revealTargets = document.querySelectorAll('.section-heading,.step-card,.animal-card,.benefit-card,.feature-card,.about-art,.about-copy,.pilot-form,.faq-item');
  revealTargets.forEach(el=>el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.12});
    revealTargets.forEach(el=>io.observe(el));
  } else revealTargets.forEach(el=>el.classList.add('is-visible'));

  document.querySelectorAll('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-chip').forEach(b=>b.classList.toggle('active',b===btn));
    const filter=btn.dataset.filter;
    document.querySelectorAll('.animal-card').forEach((card,i)=>{
      const show=filter==='all'||card.dataset.kind===filter;
      card.classList.toggle('hidden',!show);
      if(show){card.classList.remove('is-visible');requestAnimationFrame(()=>card.classList.add('is-visible'))}
    });
  }));

  const modal=document.getElementById('animalModal');
  const descriptions={
    cow:{emoji:'🐄',kn:'ಇದು ಹಳ್ಳಿಕಾರ್ ಹಸುವಿನ ಕಲ್ಪಿತ ಮಾದರಿ ಕಾರ್ಡ್. ವಯಸ್ಸು, ಹಾಲಿನ ಪ್ರಮಾಣ ಮತ್ತು ಸ್ಥಳದಂತಹ ವಿವರಗಳನ್ನು ನೈಜ ಪಟ್ಟಿ ಮಾಡುವಾಗ ಮಾಲೀಕರಿಂದ ಪಡೆದು ಪರಿಶೀಲಿಸಬೇಕು.',en:'This is an illustrative Hallikar cow card. Details such as age, milk yield and location should be provided by the owner and checked for a real listing.'},
    buffalo:{emoji:'🐃',kn:'ಇದು ಮುರ್ರಾ ಎಮ್ಮೆಯ ಕಲ್ಪಿತ ಮಾದರಿ ಕಾರ್ಡ್. ತಳಿ, ಹಾಲಿನ ಪ್ರಮಾಣ ಮತ್ತು ಆರೋಗ್ಯದ ವಿವರಗಳನ್ನು ಖರೀದಿಗೂ ಮೊದಲು ಪರಿಶೀಲಿಸಬೇಕು.',en:'This is an illustrative Murrah buffalo card. Breed, milk yield and health details should be checked before purchase.'},
    sheep:{emoji:'🐑',kn:'ಇದು ಬನ್ನೂರು ಕುರಿಯ ಕಲ್ಪಿತ ಮಾದರಿ ಕಾರ್ಡ್. ನೈಜ ಮಾರಾಟದ ಮಾಹಿತಿ ಅಲ್ಲ.',en:'This is an illustrative Bannur sheep card, not a real sale listing.'}
  };
  function openModal(type){const item=descriptions[type];if(!item)return;document.getElementById('modalEmoji').textContent=item.emoji;document.getElementById('modalTitle').textContent=language==='kn'?'ಪಶುವಿನ ವಿವರ':'Animal details';document.getElementById('modalDescription').textContent=item[language];modal.classList.remove('hidden');body.style.overflow='hidden';document.getElementById('modalClose').focus()}
  function closeModal(){if(!modal.classList.contains('hidden')){modal.classList.add('hidden');body.style.overflow=''}}
  document.querySelectorAll('.detail-button').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.animal)));
  document.getElementById('modalClose').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});

  const faqSearch=document.getElementById('faqSearch'), clearSearch=document.getElementById('clearSearch'), faqItems=[...document.querySelectorAll('.faq-item')], faqEmpty=document.getElementById('faqEmpty');
  function filterFaq(){const q=faqSearch.value.trim().toLocaleLowerCase();let count=0;faqItems.forEach(item=>{const match=item.textContent.toLocaleLowerCase().includes(q);item.classList.toggle('hidden',!match);if(match)count++});faqEmpty.classList.toggle('hidden',count!==0);clearSearch.classList.toggle('hidden',!q)}
  faqSearch.addEventListener('input',filterFaq);clearSearch.addEventListener('click',()=>{faqSearch.value='';filterFaq();faqSearch.focus()});faqSearch.addEventListener('keydown',e=>{if(e.key==='Escape'){faqSearch.value='';filterFaq()}});

  const form=document.getElementById('pilotForm'), actions=document.getElementById('contactActions'), feedback=document.getElementById('formFeedback');
  let messageText='';
  form.addEventListener('submit',e=>{
    e.preventDefault(); if(!form.reportValidity())return;
    const name=document.getElementById('fullName').value.trim(), phone=document.getElementById('phone').value.trim(), district=document.getElementById('district').value, role=document.getElementById('role').selectedOptions[0].textContent, interest=document.getElementById('interest').selectedOptions[0].textContent;
    if(name.length<2){feedback.textContent=language==='kn'?'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.':'Please enter a valid name.';return}
    const phoneDigits=phone.replace(/\D/g,'');if(phoneDigits.length<10||phoneDigits.length>13){feedback.textContent=language==='kn'?'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.':'Please enter a valid phone number.';return}
    messageText=(language==='kn'?'ನಮ್ಮ ಪಶು ಪೈಲಟ್ ಆಸಕ್ತಿ ನೋಂದಣಿ':'Namma Pashu pilot interest')+'\n'+(language==='kn'?'ಹೆಸರು':'Name')+': '+name+'\n'+(language==='kn'?'ಮೊಬೈಲ್':'Phone')+': '+phone+'\n'+(language==='kn'?'ಜಿಲ್ಲೆ':'District')+': '+district+'\n'+(language==='kn'?'ಪಾತ್ರ':'Role')+': '+role+'\n'+(language==='kn'?'ಆಸಕ್ತಿ':'Interest')+': '+interest;
    // Recipient details intentionally not configured; avoid implying a successful delivery.
    const wa=document.getElementById('whatsappLink'), mail=document.getElementById('emailLink');
    wa.href='https://wa.me/?text='+encodeURIComponent(messageText);
    mail.href='mailto:?subject='+encodeURIComponent('Namma Pashu pilot interest')+'&body='+encodeURIComponent(messageText);
    actions.classList.remove('hidden');feedback.textContent=language==='kn'?'ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ಕಳುಹಿಸುವ ಮೊದಲು ನಿಮ್ಮ ಆಯ್ಕೆಯ ಆ್ಯಪ್ ತೆರೆಯುತ್ತದೆ.':'Review the details. Your chosen app will open before you send.';
    actions.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
  });
  document.getElementById('copyDetails').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(messageText);feedback.textContent=language==='kn'?'ವಿವರಗಳನ್ನು ನಕಲಿಸಲಾಗಿದೆ.':'Details copied.'}
    catch{feedback.textContent=language==='kn'?'ನಕಲು ಮಾಡಲು ಅನುಮತಿ ಲಭ್ಯವಿಲ್ಲ. ಪಠ್ಯವನ್ನು ಕೈಯಾರೆ ಆಯ್ಕೆಮಾಡಿ.':'Clipboard permission unavailable. Please copy the text manually.'}
  });
})();