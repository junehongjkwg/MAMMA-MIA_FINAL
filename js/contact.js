/* ============================================
   MAMMA MIA — Contact Page JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---- Form Validation & Submission ---- */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(inputId, errorId, show) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (!input || !error) return;
    if (show) {
      input.classList.add('error');
      error.classList.add('visible');
    } else {
      input.classList.remove('error');
      error.classList.remove('visible');
    }
  }

  function validateForm() {
    let valid = true;

    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name) { setError('name', 'nameError', true); valid = false; }
    else { setError('name', 'nameError', false); }

    if (!email || !validateEmail(email)) { setError('email', 'emailError', true); valid = false; }
    else { setError('email', 'emailError', false); }

    if (!message) { setError('message', 'messageError', true); valid = false; }
    else { setError('message', 'messageError', false); }

    return valid;
  }

  // Live validation on blur
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => {
      if (id === 'email') {
        setError('email', 'emailError', !validateEmail(el.value.trim()));
      } else {
        setError(id, id + 'Error', !el.value.trim());
      }
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        if (id === 'email') {
          setError('email', 'emailError', !validateEmail(el.value.trim()));
        } else {
          setError(id, id + 'Error', !el.value.trim());
        }
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Show loading state
    const btnText = submitBtn.querySelector('.form-submit__text');
    const btnArrow = submitBtn.querySelector('.form-submit__arrow');
    const btnSpinner = submitBtn.querySelector('.form-submit__spinner');

    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending...';
    if (btnArrow) btnArrow.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'inline-flex';

    // Simulate send (since this is a static site - replace with your backend/Formspree/Netlify Forms)
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Show success
    submitBtn.style.display = 'none';
    if (formSuccess) {
      formSuccess.style.display = 'flex';
      formSuccess.style.animation = 'fadeUp 0.5s ease forwards';
    }
    form.reset();
  });

  /* ---- FAQ Accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.setAttribute('data-open', 'false');
        }
      });

      // Toggle current
      item.setAttribute('data-open', isOpen ? 'false' : 'true');
    });
  });

  /* ---- Input Label Float Effect ---- */
  const formControls = document.querySelectorAll('.form-control');
  formControls.forEach(input => {
    // Add focus glow
    input.addEventListener('focus', () => {
      const group = input.closest('.form-group');
      if (group) group.style.transform = 'translateY(-1px)';
    });
    input.addEventListener('blur', () => {
      const group = input.closest('.form-group');
      if (group) group.style.transform = '';
    });
  });

  /* ---- Budget option keyboard accessibility ---- */
  const budgetOptions = document.querySelectorAll('.budget-option');
  budgetOptions.forEach(opt => {
    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        opt.querySelector('input[type="radio"]').click();
      }
    });
  });

  /* ---- Portfolio Mosaic — MAMMA MIA actual work (mixed categories) ---- */
  const portfolioImages = [
    // Branding (9)
    'images/branding/01_branding_anthracite.webp', // Branding Anthracite
    'images/branding/02_kitchen_il_forno.webp', // Kitchen Il Forno
    'images/branding/03_el_molino_brand_deck.jpg', // El Molino Brand Deck
    'images/branding/04_la_foret_ig.jpg', // La Foret IG
    'images/branding/05_new_menu_promo_1.jpg', // New Menu Promo 1
    'images/branding/06_new_menu_promo_2.jpg', // New Menu Promo 2
    'images/branding/07_new_menu_promo_3.jpg', // New Menu Promo 3
    'images/branding/08_seasonal_promo.webp', // Seasonal Promo
    'images/branding/09_uber_eats_promo.jpg', // Uber Eats Promo

    // Social Media — Reels & Card News (19)
    'images/social/01_brand_launching_thumb.jpg', // Brand Launching
    'images/social/02_cafe_opening_thumb.jpg', // Cafe Opening
    'images/social/03_cocktail_1_thumb.jpg', // Cocktail 1
    'images/social/04_cocktail_2_thumb.jpg', // Cocktail 2
    'images/social/05_egg_benedict_thumb.jpg', // Egg Benedict
    'images/social/06_fashion_brand_1_thumb.jpg', // Fashion Brand 1
    'images/social/07_fashion_brand_2_thumb.jpg', // Fashion Brand 2
    'images/social/08_fashion_brand_3_thumb.jpg', // Fashion Brand 3
    'images/social/09_fashion_brand_4_thumb.jpg', // Fashion Brand 4
    'images/social/10_fashion_brand_5_thumb.jpg', // Fashion Brand 5
    'images/social/11_new_coffee_bear_thumb.jpg', // New Coffee Bear
    'images/social/12_new_dishes_thumb.jpg', // New Dishes
    'images/social/13_sotbab_thumb.jpg', // Sotbab
    'images/social/14_venue_thumb.jpg', // Venue
    'images/social/15_fashion_week_60pct.webp', // Fashion Week
    'images/social/16_global_fashion_week_650pct.webp', // Global Fashion Week
    'images/social/17_health_supplement_200pct.webp', // Health Supplement
    'images/social/18_korea_tourism_1m.webp', // Korea Tourism
    'images/social/19_seoulgift_brand.webp', // Seoulgift Brand

    // Photo Production — Food / Product / Portrait (40)
    'images/photo/food/01_food_burger.jpg', // Food Burger
    'images/photo/food/02_food_chicken_wing.jpg', // Food Chicken Wing
    'images/photo/food/03_food_cocktail.jpg', // Food Cocktail
    'images/photo/food/04_food_cocktails.jpg', // Food Cocktails
    'images/photo/food/05_food_korean_spice_noodle.webp', // Food Korean Spice Noodle
    'images/photo/food/06_food_martini_cocktail.jpg', // Food Martini Cocktail
    'images/photo/food/07_food_new_dessert.jpg', // Food New Dessert
    'images/photo/food/08_food_pasta.jpg', // Food Pasta
    'images/photo/food/09_food_pizza.jpg', // Food Pizza
    'images/photo/food/10_food_st_patrick.webp', // Food St Patrick
    'images/photo/food/11_food_tacos.jpg', // Food Tacos
    'images/photo/product/01_apparel_1.jpg', // Apparel 1
    'images/photo/product/02_apparel_2.jpg', // Apparel 2
    'images/photo/product/03_apparel_3.jpg', // Apparel 3
    'images/photo/product/04_apparel_4.jpg', // Apparel 4
    'images/photo/product/05_apparel_5.jpg', // Apparel 5
    'images/photo/product/06_apparel_6.jpg', // Apparel 6
    'images/photo/product/07_apparel_7.jpg', // Apparel 7
    'images/photo/product/08_apparel_8.jpg', // Apparel 8
    'images/photo/product/09_arm_sleeve.png', // Arm Sleeve
    'images/photo/product/10_engagement_ring.webp', // Engagement Ring
    'images/photo/product/11_pantyhose.png', // Pantyhose
    'images/photo/product/12_studio_concept_1.webp', // Studio Concept 1
    'images/photo/product/13_studio_concept_2.webp', // Studio Concept 2
    'images/photo/product/14_studio_concept_3.webp', // Studio Concept 3
    'images/photo/product/15_retail_studio_1.webp', // Retail Studio 1
    'images/photo/product/16_retail_studio_2.webp', // Retail Studio 2
    'images/photo/product/17_retail_studio_3.webp', // Retail Studio 3
    'images/photo/product/18_thermo_1.webp', // Thermo 1
    'images/photo/product/19_thermo_2.webp', // Thermo 2
    'images/photo/product/20_thermo_3.webp', // Thermo 3
    'images/photo/portrait_skincare/01_hani_1.webp', // Hani 1
    'images/photo/portrait_skincare/02_hani_2.webp', // Hani 2
    'images/photo/portrait_skincare/03_hani_3.webp', // Hani 3
    'images/photo/portrait_skincare/04_heather_1.webp', // Heather 1
    'images/photo/portrait_skincare/05_heather_2.webp', // Heather 2
    'images/photo/portrait_skincare/06_heather_3.webp', // Heather 3
    'images/photo/portrait_sushi/01_heather_sushi_1.webp', // Heather Sushi 1
    'images/photo/portrait_sushi/02_heather_sushi_2.webp', // Heather Sushi 2
    'images/photo/portrait_sushi/03_jeremy_and_hani_sushi.webp', // Jeremy & Hani Sushi

    // Video Production — Stills / Posters (10)
    'images/video/03_cars_and_hoops.webp', // Cars And Hoops
    'images/video/04_dl_acro_1.webp', // DL Acro 1
    'images/video/05_dl_acro_2.png', // DL Acro 2
    'images/video/06_f_diary_perfume.webp', // F Diary Perfume
    'images/video/07_hanyang_industrial.webp', // Hanyang Industrial
    'images/video/08_mcst_kocca_wild_vr.jpg', // MCST KOCCA Wild VR
    'images/video/09_mcst_asean_doc.webp', // MCST Asean Doc
    'images/video/10_once_upon_shine_gala.webp', // Once Upon Shine Gala
    'images/video/fashion_film_1_thumb.jpg', // Fashion Film 1
    'images/video/fashion_film_2_thumb.jpg', // Fashion Film 2
  ];

  /* ============================================================
     Mosaic Builder — Grid Matrix Algorithm (Method C)
     ------------------------------------------------------------
     1. 가상 행렬에 셀을 순서대로 배치 (big/wide/tall/sq)
     2. 각 셀은 빈 공간(0)에만 들어가고, 자기 영역(1)을 점유
     3. 그리드 채우는 도중 빈 칸이 남으면 1×1 sq 셀로 강제 채움
     4. 마지막 행이 미완성이면 sq로 끝까지 메움
     5. 뷰포트 폭에 따라 4 / 3 / 2 열로 반응형 동작
     => 빈 영역 0% 보장
  ============================================================ */
  function getMosaicCols() {
    const w = window.innerWidth;
    if (w <= 460) return 2;
    if (w <= 768) return 3;
    return 4;
  }
  function getMosaicRows(cols) {
    // 같은 셀 수(약 16칸)를 유지하기 위해 열에 따라 행 수 조정
    if (cols === 2) return 8;
    if (cols === 3) return 6;
    return 4;
  }

  // 가능한 셀 토큰과 각각의 (cols, rows) 크기
  const SIZE = {
    big:  { c: 2, r: 2 }, // 2×2
    wide: { c: 2, r: 1 }, // 2×1
    tall: { c: 1, r: 2 }, // 1×2
    sq:   { c: 1, r: 1 }, // 1×1
  };

  // 가중치: big은 가끔만 등장, wide/tall은 적당히, sq가 채움 역할
  const SHAPE_BAG = ['big', 'wide', 'tall', 'wide', 'tall', 'sq', 'sq', 'sq', 'sq'];

  function pickRandomShape() {
    return SHAPE_BAG[Math.floor(Math.random() * SHAPE_BAG.length)];
  }

  // 가상 행렬에서 (col, row) 위치에 size(c×r) 셀이 들어갈 수 있는지 확인
  function canFit(matrix, col, row, size, cols) {
    if (col + size.c > cols) return false;
    // 필요한 행이 부족하면 행을 확장 (자동 grow)
    while (matrix.length < row + size.r) {
      matrix.push(new Array(cols).fill(0));
    }
    for (let r = row; r < row + size.r; r++) {
      for (let c = col; c < col + size.c; c++) {
        if (matrix[r][c] === 1) return false;
      }
    }
    return true;
  }

  // 행렬에 셀을 표시 (점유)
  function place(matrix, col, row, size) {
    for (let r = row; r < row + size.r; r++) {
      for (let c = col; c < col + size.c; c++) {
        matrix[r][c] = 1;
      }
    }
  }

  // 가장 첫번째 빈 칸의 (col, row) 반환, 없으면 null
  function firstEmpty(matrix, cols) {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c] === 0) return { col: c, row: r };
      }
    }
    return null;
  }

  // 빈 칸 개수 (현재 행렬 기준)
  function countEmpty(matrix, cols) {
    let n = 0;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c] === 0) n++;
      }
    }
    return n;
  }

  function buildMosaic() {
    const mosaic = document.getElementById('contactMosaic');
    if (!mosaic) return;

    const cols = getMosaicCols();
    const targetRows = getMosaicRows(cols);

    const shuffled = [...portfolioImages].sort(() => Math.random() - 0.5);
    mosaic.innerHTML = '';

    // 1. 가상 행렬 생성 (목표 행 수만큼 미리 0으로 초기화)
    const matrix = [];
    for (let r = 0; r < targetRows; r++) {
      matrix.push(new Array(cols).fill(0));
    }

    // 2. 셀 배치 정보 수집 (col, row, size)
    const cells = [];
    let imageIdx = 0;
    let attempts = 0;
    const MAX_ATTEMPTS = 120; // 무한루프 방지

    while (firstEmpty(matrix, cols) && attempts < MAX_ATTEMPTS) {
      attempts++;
      const empty = firstEmpty(matrix, cols);
      if (!empty) break;

      // 2열에서는 big(2x2)이 너무 크니 제외
      let shape = pickRandomShape();
      if (cols < 3 && shape === 'big') shape = 'sq';
      let size = SIZE[shape];

      // 현재 위치에 fit 안 되면 더 작은 토큰으로 fallback
      if (!canFit(matrix, empty.col, empty.row, size, cols)) {
        const fallback = ['wide', 'tall', 'sq'];
        for (const f of fallback) {
          if (canFit(matrix, empty.col, empty.row, SIZE[f], cols)) {
            shape = f;
            size = SIZE[f];
            break;
          }
        }
      }

      // 마지막 안전장치: 무조건 sq로
      if (!canFit(matrix, empty.col, empty.row, size, cols)) {
        shape = 'sq';
        size = SIZE.sq;
      }

      place(matrix, empty.col, empty.row, size);
      cells.push({
        col: empty.col,
        row: empty.row,
        shape: shape,
        size: size,
        src: shuffled[imageIdx % shuffled.length],
      });
      imageIdx++;
    }

    // 3. 행렬에 빈 칸이 남아있으면 1×1로 강제 채우기 (안전망)
    let safety = 0;
    while (countEmpty(matrix, cols) > 0 && safety < 60) {
      safety++;
      const empty = firstEmpty(matrix, cols);
      if (!empty) break;
      place(matrix, empty.col, empty.row, SIZE.sq);
      cells.push({
        col: empty.col,
        row: empty.row,
        shape: 'sq',
        size: SIZE.sq,
        src: shuffled[imageIdx % shuffled.length],
      });
      imageIdx++;
    }

    // 4. DOM 렌더링 — 명시적 grid-area로 위치 고정
    cells.forEach((cell) => {
      const item = document.createElement('div');
      item.className = 'portfolio-mosaic__item';
      if (cell.shape === 'big')  item.classList.add('portfolio-mosaic__item--big');
      if (cell.shape === 'wide') item.classList.add('portfolio-mosaic__item--wide');
      if (cell.shape === 'tall') item.classList.add('portfolio-mosaic__item--tall');

      // grid-area: row-start / col-start / row-end / col-end
      item.style.gridArea =
        `${cell.row + 1} / ${cell.col + 1} / ${cell.row + 1 + cell.size.r} / ${cell.col + 1 + cell.size.c}`;

      const img = document.createElement('img');
      img.src = cell.src;
      img.alt = 'Portfolio work by MAMMA MIA';
      img.loading = 'lazy';
      img.addEventListener('load', () => img.classList.add('loaded'));
      if (img.complete) img.classList.add('loaded');

      item.appendChild(img);
      mosaic.appendChild(item);
    });
  }

  buildMosaic();

  // 5. 반응형 — 뷰포트 폭이 바뀌면 모자이크 재구성 (디바운스)
  let resizeTimer = null;
  let lastCols = getMosaicCols();
  window.addEventListener('resize', () => {
    const currentCols = getMosaicCols();
    if (currentCols === lastCols) return; // 열 수가 안 바뀌면 재빌드 X
    lastCols = currentCols;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildMosaic, 200);
  });

})();
