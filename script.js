/**
 * Mugilan Saravana Perumal — Engineering Portfolio
 * Interactive Controller, Multi-Language Engine & Animation System
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. GLOBAL CACHED SELECTORS
     ========================================================================== */
  const siteHeader = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const sections = document.querySelectorAll('section[id]');
  
  // Language Selectors
  const langSelector = document.getElementById('langSelector');
  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');
  const currentLangLabel = document.getElementById('currentLangLabel');
  const langOptions = document.querySelectorAll('.lang-option');
  const mobileLangBtns = document.querySelectorAll('.mobile-lang-btn');

  // Filter Selectors
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectItems = document.querySelectorAll('.project-item');

  // Lightbox Selectors
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxZoomBtn = document.getElementById('lightboxZoomBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxFallbackDisplay = document.getElementById('lightboxFallbackDisplay');
  const lightboxMediaContainer = document.getElementById('lightboxMediaContainer');

  /* ==========================================================================
     2. MULTI-LANGUAGE TRANSLATION ENGINE (9 LANGUAGES)
     ========================================================================== */
  const SUPPORTED_LANGS = ['en', 'ta', 'te', 'hi', 'fr', 'de', 'ru', 'ja', 'zh'];
  let currentLanguage = 'en';

  const getTranslationDict = (lang) => {
    const all = window.portfolioTranslations || window.translations || (typeof translations !== 'undefined' ? translations : null);
    if (!all) return {};
    return all[lang] || all['en'] || {};
  };

  const setLanguage = (lang) => {
    if (!SUPPORTED_LANGS.includes(lang)) {
      lang = 'en';
    }
    currentLanguage = lang;

    try {
      localStorage.setItem('mugilan_portfolio_lang', lang);
    } catch (err) {
      console.warn('localStorage write failed:', err);
    }

    document.documentElement.lang = lang;

    // Update label in header dropdown
    const currentLabel = document.getElementById('currentLangLabel');
    if (currentLabel) {
      currentLabel.textContent = lang.toUpperCase();
    }

    // Sync active classes in desktop dropdown
    document.querySelectorAll('.lang-option').forEach(opt => {
      const optLang = opt.getAttribute('data-lang');
      if (optLang === lang) {
        opt.classList.add('active');
        opt.setAttribute('aria-selected', 'true');
      } else {
        opt.classList.remove('active');
        opt.setAttribute('aria-selected', 'false');
      }
    });

    // Sync active classes in mobile drawer
    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Apply translations to all DOM elements with data-i18n
    const dict = getTranslationDict(lang);
    const defaultDict = getTranslationDict('en');

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict && dict[key] !== undefined) {
        el.innerHTML = dict[key];
      } else if (defaultDict && defaultDict[key] !== undefined) {
        el.innerHTML = defaultDict[key];
      }
    });

    // Update page title if key exists
    if (dict && dict.page_title) {
      document.title = dict.page_title;
    }

    console.log(`🌐 Language switched to: ${lang.toUpperCase()}`);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
  };

  // Language Dropdown Event Handlers (using delegation for click safety)
  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langMenu.classList.contains('open');
      if (isOpen) {
        langMenu.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
      } else {
        langMenu.classList.add('open');
        langBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Global click handler for language options & closing menu
  document.addEventListener('click', (e) => {
    // 1. Check if a desktop language option was clicked
    const langOpt = e.target.closest('.lang-option');
    if (langOpt) {
      e.preventDefault();
      e.stopPropagation();
      const selectedLang = langOpt.getAttribute('data-lang');
      if (selectedLang) {
        setLanguage(selectedLang);
      }
      if (langMenu) langMenu.classList.remove('open');
      if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
      return;
    }

    // 2. Check if a mobile drawer language button was clicked
    const mobLangBtn = e.target.closest('.mobile-lang-btn');
    if (mobLangBtn) {
      e.preventDefault();
      const selectedLang = mobLangBtn.getAttribute('data-lang');
      if (selectedLang) {
        setLanguage(selectedLang);
      }
      return;
    }

    // 3. Close desktop language dropdown if clicked outside
    if (langSelector && !langSelector.contains(e.target)) {
      if (langMenu) langMenu.classList.remove('open');
      if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Initialize saved or browser language
  let initialLang = 'en';
  try {
    const saved = localStorage.getItem('mugilan_portfolio_lang');
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      initialLang = saved;
    } else {
      const browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGS.includes(browserLang)) {
        initialLang = browserLang;
      }
    }
  } catch (e) {
    initialLang = 'en';
  }

  setLanguage(initialLang);

  /* ==========================================================================
     3. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHTING
     ========================================================================== */
  const handleNavbarScroll = () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Active section tracking via IntersectionObserver
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        updateActiveNavLinks(currentId);
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  function updateActiveNavLinks(activeId) {
    desktopNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     4. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const toggleMobileNav = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
    if (shouldOpen) {
      mobileNav.classList.add('open');
      mobileNavBackdrop.classList.add('open');
      menuToggle.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNav.classList.remove('open');
      mobileNavBackdrop.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => toggleMobileNav());
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', () => toggleMobileNav(false));
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });

  const mobileContactBtn = document.querySelector('.mobile-contact-btn');
  if (mobileContactBtn) {
    mobileContactBtn.addEventListener('click', () => toggleMobileNav(false));
  }

  /* ==========================================================================
     5. PROJECT FILTERING ENGINE
     ========================================================================== */
  if (filterTabs.length > 0 && projectItems.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filterValue = tab.getAttribute('data-filter');

        // Update active tab styles & ARIA attributes
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Filter project items
        projectItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.classList.remove('hidden-by-filter');
            // Trigger animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(16px)';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.classList.add('hidden-by-filter');
          }
        });
      });
    });
  }

  /* ==========================================================================
     6. UNIVERSAL LIGHTBOX MODAL & GALLERY CAROUSEL
     ========================================================================== */
  let lightboxItems = [];
  let currentLightboxIndex = 0;
  let isZoomed = false;

  // Gather all lightbox trigger elements
  const collectLightboxItems = () => {
    const triggers = document.querySelectorAll('[data-lightbox]');
    lightboxItems = Array.from(triggers).map(trigger => ({
      src: trigger.getAttribute('data-lightbox'),
      caption: trigger.getAttribute('data-caption') || '',
      fallbackType: trigger.querySelector('img')?.getAttribute('data-fallback') || 'circuit',
      alt: trigger.querySelector('img')?.getAttribute('alt') || ''
    }));
  };

  collectLightboxItems();

  const openLightbox = (index) => {
    if (index < 0 || index >= lightboxItems.length) return;
    currentLightboxIndex = index;
    const item = lightboxItems[currentLightboxIndex];

    isZoomed = false;
    if (lightboxImg) lightboxImg.classList.remove('zoomed');

    // Update Counter
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentLightboxIndex + 1} of ${lightboxItems.length}`;
    }

    // Update Caption
    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption;
    }

    // Load Image
    if (lightboxImg) {
      lightboxImg.style.display = 'block';
      if (lightboxFallbackDisplay) lightboxFallbackDisplay.classList.remove('active');

      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;

      lightboxImg.onerror = () => {
        lightboxImg.style.display = 'none';
        if (lightboxFallbackDisplay) {
          lightboxFallbackDisplay.classList.add('active');
          lightboxFallbackDisplay.innerHTML = `
            <div style="padding: 40px 20px; color: #a1a1a6; text-align: center;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2997ff" stroke-width="1.5" style="margin: 0 auto 16px;">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <h4 style="color: #fff; margin-bottom: 8px;">${item.caption || 'Technical Asset'}</h4>
              <p style="font-size: 0.875rem;">Interactive visual asset representation</p>
            </div>
          `;
        }
      };
    }

    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImg) {
      lightboxImg.src = '';
      lightboxImg.classList.remove('zoomed');
    }
  };

  const showNextLightbox = () => {
    const nextIndex = (currentLightboxIndex + 1) % lightboxItems.length;
    openLightbox(nextIndex);
  };

  const showPrevLightbox = () => {
    const prevIndex = (currentLightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    openLightbox(prevIndex);
  };

  // Bind Lightbox Triggers
  document.querySelectorAll('[data-lightbox]').forEach((trigger, idx) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(idx);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevLightbox);

  // Zoom Toggle
  if (lightboxZoomBtn && lightboxImg) {
    lightboxZoomBtn.addEventListener('click', () => {
      isZoomed = !isZoomed;
      lightboxImg.classList.toggle('zoomed', isZoomed);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextLightbox();
    if (e.key === 'ArrowLeft') showPrevLightbox();
  });

  // Touch Swipe for Mobile Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxMediaContainer) {
    lightboxMediaContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxMediaContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  const handleSwipe = () => {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance < 0) {
        showNextLightbox();
      } else {
        showPrevLightbox();
      }
    }
  };

  /* ==========================================================================
     7. IMAGE LOADING & GRACEFUL FALLBACKS
     ========================================================================== */
  const allImages = document.querySelectorAll('img[data-fallback]');
  allImages.forEach(img => {
    const parentContainer = img.closest('.profile-image-container, .cert-image-frame, .image-showcase-item, .gallery-item');
    
    if (img.complete && img.naturalHeight !== 0) {
      if (parentContainer) parentContainer.classList.add('image-loaded');
    } else {
      img.addEventListener('load', () => {
        if (parentContainer) parentContainer.classList.add('image-loaded');
      });
      img.addEventListener('error', () => {
        if (parentContainer) parentContainer.classList.remove('image-loaded');
      });
    }
  });

  /* ==========================================================================
     8. INTERACTIVE HERO CANVAS ANIMATION (ELECTRICAL WAVEFORMS & PARTICLES)
     ========================================================================== */
  const canvas = document.getElementById('heroCircuitCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isVisible = true;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }, { passive: true });

    // Optimize performance: pause canvas when hero is out of viewport
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          renderCanvas();
        }
      });
    }, { threshold: 0.05 });

    const heroSection = document.getElementById('home');
    if (heroSection) heroObserver.observe(heroSection);

    // Particle nodes in subtle circuit layout
    const particles = [];
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width || 800),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.35 + 0.15
      });
    }

    const renderCanvas = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      // Draw animated electrical sine and PWM waves
      ctx.lineWidth = 1.5;
      
      // Wave 1: Primary sinusoidal voltage wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(41, 151, 255, 0.18)';
      for (let x = 0; x < width; x += 4) {
        const y = height * 0.45 + Math.sin(x * 0.008 + time) * 35 + Math.cos(x * 0.003 - time * 0.5) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2: Fast switching ripple wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(48, 209, 88, 0.12)';
      for (let x = 0; x < width; x += 4) {
        const y = height * 0.55 + Math.sin(x * 0.015 - time * 1.5) * 20 + Math.sin(x * 0.005 + time) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw and update particle grid connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(41, 151, 255, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles with subtle trace lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(41, 151, 255, ${0.08 * (1 - dist / 110)})`;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderCanvas);
    };

    // Check prefers-reduced-motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      renderCanvas();
    }
  }

  /* ==========================================================================
     9. SCROLL REVEAL OBSERVER
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     10. BACK TO TOP BUTTON
     ========================================================================== */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     11. AMBIENT BACKGROUND MUSIC ENGINE
     ========================================================================== */
  const bgmAudio = document.getElementById('bgmAudio');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const navAudioBtn = document.getElementById('navAudioBtn');
  const mobileAudioBtn = document.getElementById('mobileAudioBtn');
  const audioControllerWrap = document.getElementById('audioControllerWrap');
  const audioLabel = document.getElementById('audioLabel');

  let isBgmPlaying = false;
  let fadeInterval = null;

  const setAudioUIState = (playing) => {
    isBgmPlaying = playing;
    const targets = [audioToggleBtn, navAudioBtn, mobileAudioBtn, audioControllerWrap];
    targets.forEach(el => {
      if (!el) return;
      if (playing) {
        el.classList.add('playing');
        el.setAttribute('aria-pressed', 'true');
      } else {
        el.classList.remove('playing');
        el.setAttribute('aria-pressed', 'false');
      }
    });

    if (audioLabel) {
      const currentLang = window.currentPortfolioLanguage || 'en';
      const dict = (window.portfolioTranslations && window.portfolioTranslations[currentLang]) || {};
      audioLabel.textContent = playing ? (dict.bgm_pause || 'BGM: Playing') : (dict.bgm_label || 'BGM: Ambient Vibe');
    }
  };

  const playBgm = () => {
    if (!bgmAudio) return;
    bgmAudio.volume = 0;
    const playPromise = bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setAudioUIState(true);
          localStorage.setItem('portfolio_bgm_pref', 'play');
          // Smooth fade in volume to 0.35
          let vol = 0;
          clearInterval(fadeInterval);
          fadeInterval = setInterval(() => {
            if (vol < 0.35) {
              vol = Math.min(0.35, vol + 0.03);
              bgmAudio.volume = vol;
            } else {
              clearInterval(fadeInterval);
            }
          }, 50);
        })
        .catch(err => {
          console.log('Autoplay policy restriction (user interaction required):', err);
          setAudioUIState(false);
        });
    }
  };

  const pauseBgm = () => {
    if (!bgmAudio) return;
    // Smooth fade out volume
    let vol = bgmAudio.volume;
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
      if (vol > 0.03) {
        vol = Math.max(0, vol - 0.05);
        bgmAudio.volume = vol;
      } else {
        clearInterval(fadeInterval);
        bgmAudio.pause();
        setAudioUIState(false);
        localStorage.setItem('portfolio_bgm_pref', 'paused');
      }
    }, 40);
  };

  const toggleBgm = () => {
    if (isBgmPlaying) {
      pauseBgm();
    } else {
      playBgm();
    }
  };

  if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleBgm);
  if (navAudioBtn) navAudioBtn.addEventListener('click', toggleBgm);
  if (mobileAudioBtn) mobileAudioBtn.addEventListener('click', toggleBgm);

  // Auto-play on first user interaction if user had previously enabled or first interaction
  const onFirstInteraction = () => {
    const pref = localStorage.getItem('portfolio_bgm_pref');
    if (pref === 'play') {
      playBgm();
    }
    document.removeEventListener('click', onFirstInteraction);
    document.removeEventListener('keydown', onFirstInteraction);
    document.removeEventListener('touchstart', onFirstInteraction);
  };

  document.addEventListener('click', onFirstInteraction, { once: true });
  document.addEventListener('keydown', onFirstInteraction, { once: true });
  document.addEventListener('touchstart', onFirstInteraction, { once: true });

  // Pause audio when tab is hidden, resume when tab is active
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isBgmPlaying && bgmAudio) {
        bgmAudio.pause();
      }
    } else {
      if (isBgmPlaying && bgmAudio) {
        bgmAudio.play().catch(() => {});
      }
    }
  });

  // Log successful initialization
  console.log('⚡ Mugilan Saravana Perumal Engineering Portfolio initialized successfully with 9 languages.');
});
