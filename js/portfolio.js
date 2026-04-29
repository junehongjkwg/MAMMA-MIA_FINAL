/* ============================================
   MAMMA MIA — Portfolio Page JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---- Filter Logic ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portCards = document.querySelectorAll('.port-card');
  const countEl = document.getElementById('portfolioCount');
  const emptyEl = document.getElementById('portfolioEmpty');

  function filterPortfolio(filter) {
    let visible = 0;

    portCards.forEach((card, i) => {
      const cat = card.getAttribute('data-category');
      const show = filter === 'all' || cat === filter;

      if (show) {
        card.style.display = '';
        // Stagger reveal
        setTimeout(() => {
          card.classList.remove('filter-hide');
          card.classList.add('filter-show');
        }, i * 40);
        visible++;
      } else {
        card.classList.add('filter-hide');
        card.classList.remove('filter-show');
        setTimeout(() => {
          if (card.classList.contains('filter-hide')) {
            card.style.display = 'none';
          }
        }, 400);
      }
    });

    if (countEl) countEl.textContent = visible;
    if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPortfolio(btn.getAttribute('data-filter'));
    });
  });

  // Initialize
  filterPortfolio('all');

  /* ---- Card hover magnetic effect ---- */
  portCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      card.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- Lightbox Modal ---- */
  // Build modal
  const modal = document.createElement('div');
  modal.className = 'port-modal';
  modal.innerHTML = `
    <div class="port-modal__backdrop"></div>
    <div class="port-modal__panel">
      <button class="port-modal__close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div class="port-modal__thumb"></div>
      <div class="port-modal__body">
        <span class="port-modal__cat tag tag--accent"></span>
        <h2 class="port-modal__title t-subheadline"></h2>
        <p class="port-modal__desc t-body"></p>
        <div class="port-modal__meta"></div>
        <a href="contact.html" class="btn btn-primary port-modal__cta"><span>Start a Similar Project</span></a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Inject modal CSS
  const modalStyle = document.createElement('style');
  modalStyle.textContent = `
    .port-modal {
      position: fixed; inset: 0; z-index: 2000;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; visibility: hidden;
      transition: opacity 0.4s ease, visibility 0.4s ease;
    }
    .port-modal.open { opacity: 1; visibility: visible; }
    .port-modal__backdrop {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(4px);
      cursor: pointer;
    }
    .port-modal__panel {
      position: relative; z-index: 1;
      background: #fff;
      width: min(820px, calc(100vw - 48px));
      max-height: calc(100vh - 80px);
      overflow-y: auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      transform: translateY(20px) scale(0.97);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .port-modal.open .port-modal__panel { transform: translateY(0) scale(1); }
    .port-modal__close {
      position: absolute; top: 16px; right: 16px; z-index: 10;
      width: 40px; height: 40px;
      background: #0a0a0a; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background 0.2s;
    }
    .port-modal__close:hover { background: var(--color-accent, #2a3bff); }
    .port-modal__close svg { width: 18px; height: 18px; stroke: #fff; }
    .port-modal__thumb {
      min-height: 300px;
      background-size: cover; background-position: center;
    }
    .port-modal__body { padding: 40px 36px; }
    .port-modal__cat { display: inline-block; margin-bottom: 16px; }
    .port-modal__title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(24px, 3vw, 40px);
      line-height: 1;
      text-transform: uppercase;
      margin-bottom: 16px;
      color: #0a0a0a;
    }
    .port-modal__desc { color: #555550; margin-bottom: 24px; font-size: 14px; line-height: 1.7; }
    .port-modal__meta {
      display: flex; flex-direction: column; gap: 8px;
      margin-bottom: 28px; padding-top: 20px;
      border-top: 1px solid #e2e2de;
    }
    .port-modal__meta-item { display: flex; gap: 12px; font-size: 12px; }
    .port-modal__meta-label {
      font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      color: #9a9a96; width: 80px; flex-shrink: 0;
    }
    .port-modal__meta-value { color: #0a0a0a; }
    .port-modal__cta { width: 100%; justify-content: center; }
    @media (max-width: 640px) {
      .port-modal__panel { grid-template-columns: 1fr; }
      .port-modal__thumb { min-height: 200px; }
    }
  `;
  document.head.appendChild(modalStyle);

  // Sample project data
  const projectData = {
    'Anthracite - Complete Brand Identity': {
      desc: 'Full visual identity package including logo system, color palette, typography guide, business card, and social media templates for a contemporary cafe identity.',
      client: 'Anthracite',
      service: 'Branding'
    },
    'IL FORNO - Complete Brand Identity': {
      desc: 'Comprehensive brand identity package including logo design, color palette, typography, menu design, business cards, website, and environmental branding developed for a refined Italian restaurant brand.',
      client: 'IL FORNO',
      service: 'Branding'
    },
    'EL MOLINO - Complete Brand Identity': {
      desc: 'A full branding system for a refined restaurant, encompassing visual identity, print materials, digital touchpoints, and a custom brand deck developed to define the brand’s tone and direction.',
      client: 'EL MOLINO',
      service: 'Branding'
    },
    'La Foret - Brand Performance Analysis': {
      desc: 'Brand tracking analysis of La Forêt, focusing on content direction, visual consistency, and audience engagement to identify key brand patterns and positioning opportunities.',
      client: 'La Foret',
      service: 'Brand Analysis'
    },
    'NICHE - Seasonal Promo': {
      desc: 'Campaign poster design for a holiday promotion and event.',
      client: 'NICHE',
      service: 'Promotional Poster Design'
    },
    'Brunch Restaurant - Uber Eats Promotion': {
      desc: 'Digital promotional assets created for an Uber Eats campaign.',
      client: 'Brunch Restaurant',
      service: 'Promotional Poster Design'
    },
    'SeoulGift - Campaign & Digital Content': {
      desc: 'Brand launch video for Seoul Gift’s Korean snack box introducing the product and brand concept.',
      client: 'SeoulGift',
      service: 'Campaign Film'
    },
    'Brunch Café - Social Media Campaign': {
      desc: 'Opening campaign film created to introduce the launch of a brunch café.',
      client: 'Brunch Café',
      service: 'Social Media Campaign'
    },
    'Bar & Lounge - Digital Content': {
      desc: 'A short-form Reels video showcasing a range of cocktails through clean visuals and engaging content.',
      client: 'Bar & Lounge',
      service: 'Reels Production'
    },
    'Golf Course - Seasonal Campaign Content': {
      desc: 'Seasonal announcement content created to promote the reopening of the venue through calm outdoor imagery and a welcoming brand message.',
      client: 'Golf Course',
      service: 'Social Media Campaign'
    },
    'Fashion Week - Digital Content': {
      desc: 'Social media content designed to capture the energy of runway shows, casting calls, and designer announcements through bold editorial layouts.',
      client: 'Fashion Week',
      service: 'Social Media Marketing'
    },
    'Korea Tourism - Campaign & Digital Content': {
      desc: 'Travel-focused social media content curated to promote seasonal destinations, scenic spots, and regional experiences across Korea.',
      client: 'Korea Tourism',
      service: 'Social Media Campaign'
    },
    'Food Burger': {
      desc: 'Restaurant food photography crafted to drive conversion — every frame styled to make the menu look as good as it tastes.',
      client: 'MAMMA MIA Client',
      service: 'Food Photography'
    },
    'Chicken Wing': {
      desc: 'Restaurant food photography crafted to drive conversion — every frame styled to make the menu look as good as it tastes.',
      client: 'MAMMA MIA Client',
      service: 'Food Photography'
    },
    'Apparel 1': {
      desc: 'Product and apparel photography produced in-studio and on-location, designed to elevate the brand story across e-commerce and editorial.',
      client: 'MAMMA MIA Client',
      service: 'Product Photography'
    },
    'Studio Concept 1': {
      desc: 'Product and apparel photography produced in-studio and on-location, designed to elevate the brand story across e-commerce and editorial.',
      client: 'MAMMA MIA Client',
      service: 'Product Photography'
    },
    'Heather 1': {
      desc: 'Beauty and skincare portrait photography focused on clean light, natural skin texture, and editorial framing for medical spa and wellness brands.',
      client: 'MAMMA MIA Client',
      service: 'Portrait Photography'
    },
    'Jeremy And Hani Sushi': {
      desc: 'Restaurant portrait photography combining chef and brand storytelling — capturing craft, hospitality, and the personality behind the menu.',
      client: 'MAMMA MIA Client',
      service: 'Portrait Photography'
    },
    'DL ACRO - Brand Campaign Film': {
      desc: 'Brand campaign film introducing ACRO\'s landmark value through panoramic city visuals, premium composition, and a strong sense of place.',
      client: 'DL ACRO',
      service: 'Brand Campaign Film'
    },
    'F Diary Perfume - Beauty Campaign Film': {
      desc: 'Beauty campaign film built around clean portraiture and soft, luminous visuals to emphasize the elegance and mood of the perfume product.',
      client: 'F Diary',
      service: 'Beauty Campaign Film'
    },
    'Hanyang - Corporate Brand Film': {
      desc: 'Corporate brand film using cinematic cityscape and infrastructure footage to highlight scale, connectivity, and the brand\'s urban presence.',
      client: 'Hanyang',
      service: 'Corporate Brand Film'
    },
    'MCST x KOCCA - Wild VR Content': {
      desc: 'Government-supported promotional content showcasing an immersive outdoor VR experience through energetic action footage and a strong sense of adventure.',
      client: 'MCST x KOCCA',
      service: 'Branded Content / Experiential Video'
    },
    'MCST - ASEAN Documentary': {
      desc: 'Documentary-style content capturing the landscape, heritage, and atmosphere of ASEAN cultural destinations through wide cinematic travel footage.',
      client: 'MCST',
      service: 'Documentary Film'
    },
    'Fashion Film - In Parallel I': {
      desc: 'Editorial fashion film introducing the collection through structured compositions, architectural backdrops, and a refined luxury mood.',
      client: 'Apparel Brand',
      service: 'Fashion Film'
    },
    default: {
      desc: 'A carefully crafted project built to drive measurable results for our client. Reach out to learn more about how we can replicate similar success for your brand.',
      client: 'MAMMA MIA Client',
      service: 'Full Service'
    }
  };

  portCards.forEach(card => {
    const thumb = card.querySelector('.port-card__img');
    const title = card.querySelector('.port-card__title')?.textContent || '';
    const cat = card.querySelector('.port-card__cat')?.textContent || '';
    const bg = thumb ? getComputedStyle(thumb).backgroundImage : '';

    card.querySelector('.port-card__view')?.addEventListener('click', (e) => {
      e.preventDefault();
      const data = projectData[title] || projectData.default;

      // Populate modal
      modal.querySelector('.port-modal__cat').textContent = cat;
      modal.querySelector('.port-modal__title').textContent = title;
      modal.querySelector('.port-modal__desc').textContent = data.desc;
      modal.querySelector('.port-modal__thumb').style.background = getComputedStyle(thumb).background;

      modal.querySelector('.port-modal__meta').innerHTML = `
        <div class="port-modal__meta-item">
          <span class="port-modal__meta-label">Client</span>
          <span class="port-modal__meta-value">${data.client}</span>
        </div>
        <div class="port-modal__meta-item">
          <span class="port-modal__meta-label">Service</span>
          <span class="port-modal__meta-value">${data.service}</span>
        </div>
      `;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  modal.querySelector('.port-modal__backdrop').addEventListener('click', closeModal);
  modal.querySelector('.port-modal__close').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

})();
