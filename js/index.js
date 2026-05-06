/* ============================================
   MAMMA MIA - Index Page JS  v6
   Sticky services, Horizontal drag scroll,
   Parallax, Process bars, Work nav arrows
   ============================================ */
(function () {
  'use strict';

  /* ================================================================
     0. HERO SLIDESHOW - 1.5s interval auto rotate
     Mobile compatibility: set inline opacity directly on each slide
     and force reflow to bypass Safari layer cache bug.
  ================================================================ */
  const heroSlideEls = document.querySelectorAll('.hero__slide');
  if (heroSlideEls.length > 1) {
    // Initial state explicit setup
    heroSlideEls.forEach((el, i) => {
      el.style.opacity = i === 0 ? '1' : '0';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.4,0,0.2,1)';
      el.style.willChange = 'opacity';
      // Force GPU layer
      el.style.transform = 'translate3d(0,0,0)';
      el.style.backfaceVisibility = 'hidden';
    });

    let heroSlideIdx = 0;
    setInterval(() => {
      const prev = heroSlideEls[heroSlideIdx];
      heroSlideIdx = (heroSlideIdx + 1) % heroSlideEls.length;
      const next = heroSlideEls[heroSlideIdx];

      // Apply both class and inline style so other media queries cannot
      // override the opacity transition.
      prev.classList.remove('active');
      prev.style.opacity = '0';

      next.classList.add('active');
      next.style.opacity = '1';

      // Force reflow to prevent Safari from skipping the transition.
      void next.offsetHeight;
    }, 1500);
  }

  /* ================================================================
     1. HERO PARALLAX
  ================================================================ */
  const heroParallax = document.getElementById('heroParallax');
  const heroContent  = document.querySelector('.hero__content');
  const heroScroll   = document.getElementById('heroScroll');

  if (heroParallax) {
    window.addEventListener('scroll', () => {
      const y  = window.scrollY;
      const vh = window.innerHeight;
      if (y < vh * 1.2) {
        heroParallax.style.transform = `translateY(${y * 0.28}px)`;
        if (heroContent) {
          heroContent.style.transform = `translateY(${y * 0.14}px)`;
          heroContent.style.opacity   = Math.max(0, 1 - y / (vh * 0.65));
        }
        if (heroScroll) {
          heroScroll.style.opacity = Math.max(0, 1 - y / 200);
        }
      }
    }, { passive: true });
  }

  /* ================================================================
     2. STICKY SERVICES - scroll switches services + 5 image rotation
  ================================================================ */
  const svcPanels     = document.querySelectorAll('.sticky-services__panel');
  const svcImgs       = document.querySelectorAll('.sticky-services__img');
  const svcCounterCur = document.getElementById('svcCounterCur');
  const svcDots       = document.querySelectorAll('.sticky-services__dot');

  // Active service index
  let currentService  = 0;
  let slideIndex      = 0;    // current slide number within the service
  let slideTimer      = null;

  // Returns the array of slide images for a given service
  function getServiceImgs(serviceIdx) {
    return Array.from(svcImgs).filter(
      img => parseInt(img.dataset.service, 10) === serviceIdx
    );
  }

  // Switch the slide within a service to slideIdx
  function showSlide(serviceIdx, slideIdx) {
    const imgs = getServiceImgs(serviceIdx);
    svcImgs.forEach(img => img.classList.remove('active'));
    if (imgs[slideIdx]) imgs[slideIdx].classList.add('active');

    // Dots update
    svcDots.forEach((dot, i) => dot.classList.toggle('active', i === slideIdx));
  }

  // Start auto slide rotation
  function startAutoSlide(serviceIdx) {
    stopAutoSlide();
    const imgs = getServiceImgs(serviceIdx);
    if (imgs.length <= 1) return;
    slideIndex = 0;
    showSlide(serviceIdx, slideIndex);

    slideTimer = setInterval(() => {
      slideIndex = (slideIndex + 1) % imgs.length;
      showSlide(serviceIdx, slideIndex);
    }, 1000);
  }

  function stopAutoSlide() {
    if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
  }

  if (svcPanels.length && svcImgs.length) {
    // Initial run
    startAutoSlide(0);

    const panelObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const panel = entry.target;
        const idx   = parseInt(panel.dataset.index, 10);

        // Panel text intro
        panel.querySelector('.sticky-services__panel-inner')
             .classList.add('in-view');

        // Reset slides only when switching services
        if (idx !== currentService) {
          currentService = idx;
          startAutoSlide(idx);
        }

        // Counter update
        if (svcCounterCur) {
          svcCounterCur.textContent = String(idx + 1).padStart(2, '0');
        }
      });
    }, { threshold: 0.45, rootMargin: '0px 0px -10% 0px' });

    svcPanels.forEach(p => panelObs.observe(p));
  }

  /* ================================================================
     3. HORIZONTAL DRAG SCROLL - Recent Work
        Drag + momentum + arrow buttons + counter
        Mobile: disabled (CSS converts the section to a vertical gallery)
  ================================================================ */
  const hscroll      = document.getElementById('workHScroll');
  const htrack       = document.getElementById('workTrack');
  const btnPrev      = document.getElementById('workNavPrev');
  const btnNext      = document.getElementById('workNavNext');
  const navCurEl     = document.getElementById('workNavCur');
  const navTotalEl   = document.getElementById('workNavTotal');

  // Detect mobile: skip horizontal drag init when in vertical gallery mode
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  if (hscroll && htrack && !isMobile) {
    const cards        = htrack.querySelectorAll('.work-card');
    const totalCards   = cards.length;
    let currentX       = 0;
    let isDragging     = false;
    let startX         = 0;
    let velX           = 0;
    let lastX          = 0;
    let rafId          = null;
    let activeCardIdx  = 0;   // current visible card index

    // Total card count display
    if (navTotalEl) navTotalEl.textContent = String(totalCards).padStart(2, '0');

    /* ---------- Utilities ---------- */
    function getMaxScroll() {
      return -(htrack.scrollWidth - hscroll.clientWidth);
    }
    function clampX(x) {
      return Math.max(getMaxScroll(), Math.min(0, x));
    }
    function applyX(x, smooth) {
      currentX = clampX(x);
      htrack.style.transition = smooth ? 'transform 0.55s cubic-bezier(0.16,1,0.3,1)' : 'none';
      htrack.style.transform  = `translateX(${currentX}px)`;
    }
    function updateCounter() {
      const cardW = cards[0] ? cards[0].offsetWidth + 24 : 300; // gap=24
      const idx   = Math.round(-currentX / cardW);
      activeCardIdx = Math.max(0, Math.min(totalCards - 1, idx));
      if (navCurEl) navCurEl.textContent = String(activeCardIdx + 1).padStart(2, '0');
      if (btnPrev) btnPrev.disabled = activeCardIdx === 0;
      if (btnNext) btnNext.disabled = activeCardIdx >= totalCards - 1;
    }
    updateCounter();

    /* ---------- Arrow buttons ---------- */
    function scrollToCard(idx) {
      const cardW = cards[0] ? cards[0].offsetWidth + 24 : 300;
      applyX(-(idx * cardW), true);
      activeCardIdx = Math.max(0, Math.min(totalCards - 1, idx));
      if (navCurEl) navCurEl.textContent = String(activeCardIdx + 1).padStart(2, '0');
      if (btnPrev) btnPrev.disabled = activeCardIdx === 0;
      if (btnNext) btnNext.disabled = activeCardIdx >= totalCards - 1;
    }

    if (btnPrev) {
      btnPrev.disabled = true;
      btnPrev.addEventListener('click', () => scrollToCard(activeCardIdx - 1));
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => scrollToCard(activeCardIdx + 1));
    }

    /* ---------- Mouse drag (desktop only) ---------- */
    hscroll.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - currentX;
      lastX  = e.clientX;
      cancelAnimationFrame(rafId);
      htrack.style.transition = 'none';
      hscroll.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      velX     = e.clientX - lastX;
      lastX    = e.clientX;
      currentX = clampX(e.clientX - startX);
      htrack.style.transform = `translateX(${currentX}px)`;
    });
    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      hscroll.style.cursor = 'grab';
      momentum();
    });

    /* ---------- Momentum + card snap ---------- */
    function momentum() {
      if (Math.abs(velX) > 1.5) {
        velX    *= 0.91;
        currentX = clampX(currentX + velX);
        htrack.style.transition = 'none';
        htrack.style.transform  = `translateX(${currentX}px)`;
        rafId = requestAnimationFrame(momentum);
      } else {
        const cardW = cards[0] ? cards[0].offsetWidth + 24 : 300;
        const idx   = Math.round(-currentX / cardW);
        scrollToCard(Math.max(0, Math.min(totalCards - 1, idx)));
      }
      updateCounter();
    }
  } else if (hscroll && htrack && isMobile) {
    // Mobile: use native horizontal scroll instead of JS drag.
    // Hide arrow buttons but keep the counter (e.g. 09 / 10).
    if (btnPrev) btnPrev.style.display = 'none';
    if (btnNext) btnNext.style.display = 'none';

    // Reset any inline transform/transition so native scrolling can work.
    htrack.style.transform = '';
    htrack.style.transition = '';

    const cards = htrack.querySelectorAll('.work-card');
    const totalCards = cards.length;
    if (navTotalEl) navTotalEl.textContent = String(totalCards).padStart(2, '0');

    // Update counter as the user swipes through cards.
    function updateMobileCounter() {
      const cardW = cards[0] ? cards[0].offsetWidth + 24 : 300;
      const idx = Math.round(hscroll.scrollLeft / cardW);
      const clamped = Math.max(0, Math.min(totalCards - 1, idx));
      if (navCurEl) navCurEl.textContent = String(clamped + 1).padStart(2, '0');
    }
    updateMobileCounter();
    hscroll.addEventListener('scroll', updateMobileCounter, { passive: true });
  }

  /* ================================================================
     4. PROCESS STEP BARS
  ================================================================ */
  const processSteps = document.querySelectorAll('.process__step');
  if (processSteps.length) {
    const stepObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.25 });
    processSteps.forEach(s => stepObs.observe(s));
  }

  /* ================================================================
     5. WORK CARD - subtle parallax hover (desktop only)
  ================================================================ */
  if (!isMobile) {
    document.querySelectorAll('.work-card').forEach(card => {
      const img = card.querySelector('img');
      if (!img) return;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
        img.style.transform = `scale(1.06) translate(${x * 0.4}px, ${y * 0.4}px)`;
      });
      card.addEventListener('mouseleave', () => { img.style.transform = ''; });
    });
  }

  /* ================================================================
     6. MARQUEE PAUSE ON HOVER
  ================================================================ */
  const mtrack = document.getElementById('marqueeTrack');
  if (mtrack) {
    mtrack.addEventListener('mouseenter', () => mtrack.style.animationPlayState = 'paused');
    mtrack.addEventListener('mouseleave', () => mtrack.style.animationPlayState = 'running');
  }

  /* ================================================================
     7. NAV THEME SWITCH - bright nav once past hero
  ================================================================ */
  const nav  = document.getElementById('mainNav');
  const hero = document.querySelector('.hero');
  if (nav && hero) {
    const switchObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) nav.classList.remove('nav--dark');
        else nav.classList.add('nav--dark');
      });
    }, { threshold: 0.05 });
    switchObs.observe(hero);
  }

})();
