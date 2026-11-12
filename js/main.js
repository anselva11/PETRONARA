/**
 * PT PETRO MANDIRI NUSANTARA (PMN)
 * Main Interactive Application Script
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentLang: localStorage.getItem('pmn_lang') || 'en',
    currentHeroSlide: 0,
    heroInterval: null,
    heroDuration: 6000,
    heroTimerStart: 0,
    heroPaused: false,
    activeAboutTab: 'overview'
  };

  // DOM Elements cache
  const elements = {
    navbar: document.getElementById('main-navbar'),
    mobileMenu: document.getElementById('mobile-menu'),
    mobileMenuOverlay: document.getElementById('mobile-menu-overlay'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    mobileMenuClose: document.getElementById('mobile-menu-close'),
    langToggleBtns: document.querySelectorAll('.lang-toggle-btn'),
    langIndicator: document.getElementById('lang-indicator'),
    heroSlidesContainer: document.getElementById('hero-slides-container'),
    heroDotsContainer: document.getElementById('hero-dots-container'),
    heroPrevBtn: document.getElementById('hero-prev-btn'),
    heroNextBtn: document.getElementById('hero-next-btn'),
    heroProgressBar: document.getElementById('hero-progress-bar'),
    businessCardsContainer: document.getElementById('business-cards-container'),
    newsCardsContainer: document.getElementById('news-cards-container'),
    businessModal: document.getElementById('business-modal'),
    businessModalContent: document.getElementById('business-modal-content'),
    businessModalClose: document.getElementById('business-modal-close'),
    newsModal: document.getElementById('news-modal'),
    newsModalContent: document.getElementById('news-modal-content'),
    newsModalClose: document.getElementById('news-modal-close'),
    backToTopBtn: document.getElementById('back-to-top'),
    contactForm: document.getElementById('contact-form'),
    toast: document.getElementById('pmn-toast'),
    toastMessage: document.getElementById('pmn-toast-message')
  };

  /**
   * Initialize Application
   */
  function init() {
    setupNavbarScroll();
    setupMobileMenu();
    setupLanguage();
    renderHeroSlides();
    startHeroSlider();
    renderBusinessCards();
    renderNewsCards();
    setupAboutTabs();
    setupCounters();
    setupScrollReveals();
    setupBackToTop();
    setupContactForm();
    setupModals();
    setupLucideIcons();
  }

  /**
   * Setup Lucide Icons
   */
  function setupLucideIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  /**
   * Navbar Scroll Handler
   */
  function setupNavbarScroll() {
    function handleScroll() {
      if (!elements.navbar) return;
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 50) {
        elements.navbar.classList.add('scrolled');
      } else {
        elements.navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /**
   * Mobile Drawer Navigation
   */
  function setupMobileMenu() {
    if (!elements.mobileMenuBtn || !elements.mobileMenu) return;

    function openMobileMenu() {
      elements.mobileMenu.classList.remove('translate-x-full');
      elements.mobileMenuOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      elements.mobileMenu.classList.add('translate-x-full');
      elements.mobileMenuOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }

    elements.mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (elements.mobileMenuClose) elements.mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (elements.mobileMenuOverlay) elements.mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Close when clicking nav links in mobile menu
    const mobileLinks = elements.mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !elements.mobileMenu.classList.contains('translate-x-full')) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Language Switcher (EN / ID)
   */
  function setupLanguage() {
    elements.langToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetLang = e.currentTarget.getAttribute('data-lang');
        if (targetLang && targetLang !== state.currentLang) {
          setLanguage(targetLang);
        }
      });
    });

    applyLanguage();
  }

  function setLanguage(lang) {
    state.currentLang = lang;
    localStorage.setItem('pmn_lang', lang);
    applyLanguage();
  }

  function applyLanguage() {
    const isEn = state.currentLang === 'en';

    // Update buttons
    elements.langToggleBtns.forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === state.currentLang) {
        btn.classList.add('bg-pmn-blue', 'text-white');
        btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        btn.classList.remove('bg-pmn-blue', 'text-white');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    });

    // Update all text elements with data-i18n-en and data-i18n-id
    document.querySelectorAll('[data-i18n-en]').forEach(el => {
      const text = isEn ? el.getAttribute('data-i18n-en') : el.getAttribute('data-i18n-id');
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Re-render language-dependent components
    renderHeroSlideContent(state.currentHeroSlide);
    renderBusinessCards();
    renderNewsCards();
    updateAboutTabContent();
    setupLucideIcons();
  }

  /**
   * Hero Carousel System
   */
  function renderHeroSlides() {
    if (!elements.heroSlidesContainer || !elements.heroDotsContainer) return;
    const slides = PMN_DATA.heroSlides;

    elements.heroSlidesContainer.innerHTML = '';
    elements.heroDotsContainer.innerHTML = '';

    slides.forEach((slide, index) => {
      const slideEl = document.createElement('div');
      slideEl.className = `hero-slide absolute inset-0 ${index === 0 ? 'active' : ''}`;
      slideEl.id = `hero-slide-${index}`;

      slideEl.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-t from-pmn-dark/90 via-pmn-dark/50 to-pmn-dark/30 z-10"></div>
        <div class="absolute inset-0 bg-radial-vignette opacity-50 z-10 pointer-events-none"></div>
        <img src="${slide.image}" alt="PMN Energy Facility" class="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-out" />
        <div class="absolute inset-0 z-20 flex items-center justify-center">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-16 text-center flex flex-col items-center justify-center">
            <div class="max-w-4xl mx-auto text-center flex flex-col items-center justify-center hero-content-anim">
              <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 mx-auto">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span class="slide-badge">${state.currentLang === 'en' ? slide.badgeEn : slide.badgeId}</span>
              </div>
              <h1 class="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6 drop-shadow-lg slide-title max-w-4xl mx-auto">
                ${state.currentLang === 'en' ? slide.titleEn : slide.titleId}
              </h1>
              <p class="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed mb-10 max-w-2xl mx-auto drop-shadow-md slide-desc">
                ${state.currentLang === 'en' ? slide.descEn : slide.descId}
              </p>
              <div class="flex flex-wrap items-center justify-center gap-4 mx-auto">
                <a href="#business" class="btn-primary group">
                  <span data-i18n-en="Discover Our Business" data-i18n-id="Jelajahi Bisnis Kami">${state.currentLang === 'en' ? 'Discover Our Business' : 'Jelajahi Bisnis Kami'}</span>
                  <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i>
                </a>
                <a href="#contact" class="btn-white-glass">
                  <span data-i18n-en="Get In Touch" data-i18n-id="Hubungi Kami">${state.currentLang === 'en' ? 'Get In Touch' : 'Hubungi Kami'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;

      elements.heroSlidesContainer.appendChild(slideEl);

      // Dot indicator
      const dot = document.createElement('button');
      dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${index === 0 ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/70'}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToHeroSlide(index);
        restartHeroSlider();
      });
      elements.heroDotsContainer.appendChild(dot);
    });

    if (elements.heroPrevBtn) {
      elements.heroPrevBtn.addEventListener('click', () => {
        prevHeroSlide();
        restartHeroSlider();
      });
    }

    if (elements.heroNextBtn) {
      elements.heroNextBtn.addEventListener('click', () => {
        nextHeroSlide();
        restartHeroSlider();
      });
    }
  }

  function renderHeroSlideContent(index) {
    const slide = PMN_DATA.heroSlides[index];
    if (!slide) return;
    const slideEl = document.getElementById(`hero-slide-${index}`);
    if (slideEl) {
      const badge = slideEl.querySelector('.slide-badge');
      const title = slideEl.querySelector('.slide-title');
      const desc = slideEl.querySelector('.slide-desc');
      if (badge) badge.textContent = state.currentLang === 'en' ? slide.badgeEn : slide.badgeId;
      if (title) title.textContent = state.currentLang === 'en' ? slide.titleEn : slide.titleId;
      if (desc) desc.textContent = state.currentLang === 'en' ? slide.descEn : slide.descId;
    }
  }

  function goToHeroSlide(newIndex) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = elements.heroDotsContainer ? elements.heroDotsContainer.querySelectorAll('button') : [];

    if (!slides.length) return;

    slides.forEach((s, i) => {
      s.classList.toggle('active', i === newIndex);
    });

    dots.forEach((d, i) => {
      if (i === newIndex) {
        d.classList.add('bg-white', 'w-8');
        d.classList.remove('bg-white/40');
      } else {
        d.classList.remove('bg-white', 'w-8');
        d.classList.add('bg-white/40');
      }
    });

    state.currentHeroSlide = newIndex;
    renderHeroSlideContent(newIndex);
    setupLucideIcons();
  }

  function nextHeroSlide() {
    const total = PMN_DATA.heroSlides.length;
    const next = (state.currentHeroSlide + 1) % total;
    goToHeroSlide(next);
  }

  function prevHeroSlide() {
    const total = PMN_DATA.heroSlides.length;
    const prev = (state.currentHeroSlide - 1 + total) % total;
    goToHeroSlide(prev);
  }

  function startHeroSlider() {
    if (state.heroInterval) clearInterval(state.heroInterval);
    state.heroInterval = setInterval(() => {
      if (!state.heroPaused) {
        nextHeroSlide();
      }
    }, state.heroDuration);
  }

  function restartHeroSlider() {
    startHeroSlider();
  }

  /**
   * Business Cards Rendering & Learn More Action
   */
  function renderBusinessCards() {
    if (!elements.businessCardsContainer) return;
    const isEn = state.currentLang === 'en';
    const categories = PMN_DATA.businessCategories;

    elements.businessCardsContainer.innerHTML = '';

    categories.forEach((cat, index) => {
      const card = document.createElement('div');
      card.className = `pmn-card flex flex-col h-full group reveal-on-scroll delay-${(index + 1) * 100}`;

      const capabilities = isEn ? cat.capabilitiesEn : cat.capabilitiesId;
      const capabilitiesListHtml = capabilities
        .map(
          item => `
          <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
            <i data-lucide="check-circle-2" class="w-4 h-4 text-pmn-blue shrink-0 mt-0.5"></i>
            <span>${item}</span>
          </li>`
        )
        .join('');

      card.innerHTML = `
        <div class="pmn-card-img-wrap h-56 w-full relative">
          <img src="${cat.image}" alt="${isEn ? cat.titleEn : cat.titleId}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-pmn-dark/80 via-pmn-dark/20 to-transparent"></div>
          <div class="absolute top-4 left-4">
            <div class="w-11 h-11 rounded-lg bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-pmn-blue group-hover:bg-pmn-blue group-hover:text-white transition-colors duration-300">
              <i data-lucide="${cat.icon}" class="w-5 h-5"></i>
            </div>
          </div>
          <div class="absolute bottom-4 left-4 right-4">
            <span class="text-xs uppercase font-bold tracking-wider text-cyan-300">${isEn ? cat.taglineEn : cat.taglineId}</span>
            <h3 class="text-xl font-bold text-white">${isEn ? cat.titleEn : cat.titleId}</h3>
          </div>
        </div>
        <div class="p-6 flex flex-col flex-grow justify-between bg-white">
          <div>
            <p class="text-sm text-slate-600 leading-relaxed mb-5">
              ${isEn ? cat.shortDescEn : cat.shortDescId}
            </p>
            <div class="border-t border-slate-100 pt-4 mb-6">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                ${isEn ? 'Key Capabilities' : 'Kemampuan Utama'}
              </h4>
              <ul class="space-y-2">
                ${capabilitiesListHtml}
              </ul>
            </div>
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button type="button" class="learn-more-btn inline-flex items-center gap-2 text-sm font-bold text-pmn-blue hover:text-pmn-navy transition-colors group/btn" data-category-id="${cat.id}">
              <span>${isEn ? 'Learn More' : 'Pelajari Selengkapnya'}</span>
              <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover/btn:translate-x-1"></i>
            </button>
            <span class="text-[11px] font-medium text-slate-400 italic">
              ${isEn ? 'Customizable' : 'Disesuaikan'}
            </span>
          </div>
        </div>
      `;

      elements.businessCardsContainer.appendChild(card);
    });

    // Attach click handlers to Learn More buttons
    document.querySelectorAll('.learn-more-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-category-id');
        openBusinessModal(catId);
      });
    });

    setupLucideIcons();
  }

  /**
   * Business Detail Modal
   */
  function openBusinessModal(catId) {
    const isEn = state.currentLang === 'en';
    const cat = PMN_DATA.businessCategories.find(c => c.id === catId);
    if (!cat || !elements.businessModal || !elements.businessModalContent) return;

    const capabilities = isEn ? cat.capabilitiesEn : cat.capabilitiesId;
    const capabilitiesHtml = capabilities
      .map(
        c => `
        <div class="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100">
          <i data-lucide="check-circle-2" class="w-5 h-5 text-pmn-blue shrink-0 mt-0.5"></i>
          <span class="text-sm font-medium text-slate-700">${c}</span>
        </div>`
      )
      .join('');

    elements.businessModalContent.innerHTML = `
      <div class="relative h-64 sm:h-72 w-full">
        <img src="${cat.image}" alt="${isEn ? cat.titleEn : cat.titleId}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-pmn-dark via-pmn-dark/40 to-transparent"></div>
        <div class="absolute bottom-6 left-6 right-6">
          <span class="badge-blue mb-2">${isEn ? 'Business Division' : 'Divisi Bisnis'}</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-white">${isEn ? cat.titleEn : cat.titleId}</h2>
          <p class="text-sm text-cyan-200 mt-1">${isEn ? cat.taglineEn : cat.taglineId}</p>
        </div>
      </div>
      <div class="p-6 sm:p-8 space-y-6">
        <div>
          <h3 class="text-sm font-bold text-pmn-navy uppercase tracking-wider mb-2">
            ${isEn ? 'Overview & Scope of Operations' : 'Ikhtisar & Ruang Lingkup Operasional'}
          </h3>
          <p class="text-slate-600 leading-relaxed text-sm sm:text-base">
            ${isEn ? cat.detailsEn : cat.detailsId}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-bold text-pmn-navy uppercase tracking-wider mb-3">
            ${isEn ? 'Strategic Capabilities' : 'Kemampuan Strategis'}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${capabilitiesHtml}
          </div>
        </div>

        <div class="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p class="text-xs font-bold text-pmn-navy uppercase tracking-wider">
              ${isEn ? 'Tailored to PMN Activities' : 'Disesuaikan dengan Aktivitas PMN'}
            </p>
            <p class="text-xs text-slate-500 mt-0.5">
              ${isEn ? 'Service specifications can be adjusted according to your operational project requirements.' : 'Spesifikasi layanan dapat disesuaikan dengan kebutuhan proyek operasional Anda.'}
            </p>
          </div>
          <button type="button" class="btn-primary py-2.5 px-4 text-xs font-bold modal-inquire-btn" data-subject="${isEn ? cat.titleEn : cat.titleId}">
            <span>${isEn ? 'Inquire About This Service' : 'Konsultasikan Layanan Ini'}</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;

    elements.businessModal.classList.remove('hidden');
    setTimeout(() => {
      elements.businessModal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';

    // Hook up inquire button inside modal
    const inquireBtn = elements.businessModalContent.querySelector('.modal-inquire-btn');
    if (inquireBtn) {
      inquireBtn.addEventListener('click', () => {
        const subject = inquireBtn.getAttribute('data-subject');
        closeBusinessModal();
        const subjectSelect = document.getElementById('inquiry-subject');
        if (subjectSelect) {
          subjectSelect.value = 'Partnership';
        }
        const messageInput = document.getElementById('inquiry-message');
        if (messageInput) {
          messageInput.value = isEn
            ? `Inquiry regarding ${subject}: Please provide detailed information on supply availability and technical specifications.`
            : `Pertanyaan mengenai ${subject}: Mohon informasi detail mengenai ketersediaan pasokan dan spesifikasi teknis.`;
        }
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    setupLucideIcons();
  }

  function closeBusinessModal() {
    if (!elements.businessModal) return;
    elements.businessModal.classList.remove('active');
    setTimeout(() => {
      elements.businessModal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  /**
   * News Cards Rendering & Reader Modal
   */
  function renderNewsCards() {
    if (!elements.newsCardsContainer) return;
    const isEn = state.currentLang === 'en';
    const newsList = PMN_DATA.news;

    elements.newsCardsContainer.innerHTML = '';

    newsList.forEach((item, index) => {
      const card = document.createElement('article');
      card.className = `pmn-card flex flex-col h-full reveal-on-scroll delay-${(index + 1) * 100}`;

      card.innerHTML = `
        <div class="pmn-card-img-wrap h-52 w-full relative">
          <img src="${item.image}" alt="${isEn ? item.titleEn : item.titleId}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          <div class="absolute top-4 left-4">
            <span class="badge-blue shadow-sm">${isEn ? item.categoryEn : item.categoryId}</span>
          </div>
        </div>
        <div class="p-6 flex flex-col flex-grow justify-between bg-white">
          <div>
            <div class="flex items-center gap-3 text-xs text-slate-400 font-medium mb-3">
              <span class="inline-flex items-center gap-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                <span>${isEn ? item.date : item.dateId}</span>
              </span>
              <span>•</span>
              <span class="inline-flex items-center gap-1">
                <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                <span>${item.readTime}</span>
              </span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-pmn-navy leading-snug mb-3 hover:text-pmn-blue transition-colors cursor-pointer read-news-btn" data-news-id="${item.id}">
              ${isEn ? item.titleEn : item.titleId}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
              ${isEn ? item.excerptEn : item.excerptId}
            </p>
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button type="button" class="read-news-btn inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-pmn-blue hover:text-pmn-navy transition-colors group/read" data-news-id="${item.id}">
              <span>${isEn ? 'Read Article' : 'Baca Selengkapnya'}</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5 transition-transform group-hover/read:translate-x-1"></i>
            </button>
            <span class="text-xs text-slate-400">PMN Press</span>
          </div>
        </div>
      `;

      elements.newsCardsContainer.appendChild(card);
    });

    document.querySelectorAll('.read-news-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const newsId = e.currentTarget.getAttribute('data-news-id');
        openNewsModal(newsId);
      });
    });

    setupLucideIcons();
  }

  /**
   * News Article Reader Modal
   */
  function openNewsModal(newsId) {
    const isEn = state.currentLang === 'en';
    const item = PMN_DATA.news.find(n => n.id === newsId);
    if (!item || !elements.newsModal || !elements.newsModalContent) return;

    elements.newsModalContent.innerHTML = `
      <div class="relative h-64 sm:h-80 w-full">
        <img src="${item.image}" alt="${isEn ? item.titleEn : item.titleId}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-pmn-dark via-pmn-dark/40 to-transparent"></div>
        <div class="absolute bottom-6 left-6 right-6">
          <span class="badge-blue mb-3">${isEn ? item.categoryEn : item.categoryId}</span>
          <h2 class="text-xl sm:text-3xl font-extrabold text-white leading-tight">${isEn ? item.titleEn : item.titleId}</h2>
          <div class="flex items-center gap-4 text-xs text-slate-200 mt-3">
            <span>${isEn ? item.date : item.dateId}</span>
            <span>•</span>
            <span>${item.author}</span>
            <span>•</span>
            <span>${item.readTime}</span>
          </div>
        </div>
      </div>
      <div class="p-6 sm:p-10">
        <div class="prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base">
          ${isEn ? item.fullContentEn : item.fullContentId}
        </div>
        <div class="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Tags:</span>
            <span class="px-2.5 py-1 rounded bg-slate-100 text-slate-600">Energy</span>
            <span class="px-2.5 py-1 rounded bg-slate-100 text-slate-600">Petroleum</span>
            <span class="px-2.5 py-1 rounded bg-slate-100 text-slate-600">Indonesia</span>
          </div>
          <button type="button" class="btn-secondary py-2 px-4 text-xs share-article-btn">
            <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
            <span>${isEn ? 'Share Article' : 'Bagikan Berita'}</span>
          </button>
        </div>
      </div>
    `;

    elements.newsModal.classList.remove('hidden');
    setTimeout(() => {
      elements.newsModal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';

    const shareBtn = elements.newsModalContent.querySelector('.share-article-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (navigator.share) {
          navigator.share({
            title: isEn ? item.titleEn : item.titleId,
            url: window.location.href
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.href);
          showToast(isEn ? 'Link copied to clipboard!' : 'Tautan disalin ke papan klip!');
        }
      });
    }

    setupLucideIcons();
  }

  function closeNewsModal() {
    if (!elements.newsModal) return;
    elements.newsModal.classList.remove('active');
    setTimeout(() => {
      elements.newsModal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  /**
   * Setup Modal Backdrop and Close Handlers
   */
  function setupModals() {
    if (elements.businessModalClose) {
      elements.businessModalClose.addEventListener('click', closeBusinessModal);
    }
    if (elements.businessModal) {
      elements.businessModal.addEventListener('click', (e) => {
        if (e.target === elements.businessModal) closeBusinessModal();
      });
    }

    if (elements.newsModalClose) {
      elements.newsModalClose.addEventListener('click', closeNewsModal);
    }
    if (elements.newsModal) {
      elements.newsModal.addEventListener('click', (e) => {
        if (e.target === elements.newsModal) closeNewsModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeBusinessModal();
        closeNewsModal();
      }
    });
  }

  /**
   * About Us Interactive Tabs (Overview, Vision & Mission, Corporate Values)
   */
  function setupAboutTabs() {
    const tabBtns = document.querySelectorAll('.about-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab && tab !== state.activeAboutTab) {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.activeAboutTab = tab;
          updateAboutTabContent();
        }
      });
    });

    updateAboutTabContent();
  }

  function updateAboutTabContent() {
    const isEn = state.currentLang === 'en';
    const container = document.getElementById('about-tab-content-panel');
    if (!container) return;

    if (state.activeAboutTab === 'overview') {
      container.innerHTML = `
        <div class="space-y-5 animate-fade-in">
          <p class="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            ${isEn ? PMN_DATA.about.overviewEn : PMN_DATA.about.overviewId}
          </p>
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-xs font-bold uppercase text-slate-400">${isEn ? 'Established' : 'Didirikan'}</span>
              <p class="text-lg font-extrabold text-pmn-navy">${PMN_DATA.company.established}</p>
              <p class="text-xs text-slate-500 mt-0.5">${isEn ? 'Republic of Indonesia' : 'Republik Indonesia'}</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-xs font-bold uppercase text-slate-400">${isEn ? 'Headquarters' : 'Kantor Pusat'}</span>
              <p class="text-lg font-extrabold text-pmn-navy">Jakarta, SCBD</p>
              <p class="text-xs text-slate-500 mt-0.5">${isEn ? 'Menara Energi Nusantara' : 'Pusat Bisnis Energi'}</p>
            </div>
          </div>
        </div>
      `;
    } else if (state.activeAboutTab === 'vision-mission') {
      const missions = isEn ? PMN_DATA.about.missionEn : PMN_DATA.about.missionId;
      const missionItems = missions
        .map(
          (m, idx) => `
          <div class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span class="w-6 h-6 rounded-full bg-pmn-blue text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${m}</p>
          </div>`
        )
        .join('');

      container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
          <div class="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
            <div class="flex items-center gap-2 text-xs font-bold text-pmn-blue uppercase tracking-wider mb-1">
              <i data-lucide="compass" class="w-4 h-4"></i>
              <span>${isEn ? 'Our Vision' : 'Visi Kami'}</span>
            </div>
            <p class="text-sm sm:text-base font-semibold text-pmn-navy leading-relaxed">
              "${isEn ? PMN_DATA.about.visionEn : PMN_DATA.about.visionId}"
            </p>
          </div>
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              ${isEn ? 'Our Mission Pillars' : 'Pilar Misi Kami'}
            </h4>
            <div class="space-y-2.5">
              ${missionItems}
            </div>
          </div>
        </div>
      `;
    } else if (state.activeAboutTab === 'values') {
      const values = PMN_DATA.about.values;
      const valueCards = values
        .map(
          v => `
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3.5 hover:border-blue-200 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-blue-100 text-pmn-navy flex items-center justify-center shrink-0">
              <i data-lucide="${v.icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <h5 class="text-sm font-bold text-pmn-navy">${isEn ? v.titleEn : v.titleId}</h5>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">${isEn ? v.descEn : v.descId}</p>
            </div>
          </div>`
        )
        .join('');

      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fade-in">
          ${valueCards}
        </div>
      `;
    }

    setupLucideIcons();
  }

  /**
   * Animated Metric Counters
   */
  function setupCounters() {
    const counterElements = document.querySelectorAll('.stat-counter');
    if (!counterElements.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateAllCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.getElementById('statistics-strip');
    if (statsSection) observer.observe(statsSection);

    function animateAllCounters() {
      counterElements.forEach(el => {
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;

          el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = isDecimal ? target.toFixed(1) : target;
          }
        }

        requestAnimationFrame(update);
      });
    }
  }

  /**
   * Scroll Reveal Animation Observer
   */
  function setupScrollReveals() {
    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  }

  /**
   * Back to top button
   */
  function setupBackToTop() {
    if (!elements.backToTopBtn) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 400) {
        elements.backToTopBtn.classList.add('visible');
      } else {
        elements.backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    elements.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Contact Form Handling
   */
  function setupContactForm() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isEn = state.currentLang === 'en';

      const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Visual loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>${isEn ? 'Submitting Inquiry...' : 'Mengirim Pesan...'}</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        elements.contactForm.reset();

        showToast(
          isEn
            ? 'Thank you! Your inquiry has been transmitted to PMN Commercial Desk. We will respond within 24 hours.'
            : 'Terima kasih! Pesan Anda telah diteruskan ke Tim Komersial PMN. Kami akan segera merespons dalam 24 jam.'
        );
        setupLucideIcons();
      }, 1200);
    });
  }

  /**
   * Toast notification system
   */
  function showToast(message) {
    if (!elements.toast || !elements.toastMessage) return;
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('translate-y-24', 'opacity-0');
    elements.toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      elements.toast.classList.remove('translate-y-0', 'opacity-100');
      elements.toast.classList.add('translate-y-24', 'opacity-0');
    }, 4500);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

