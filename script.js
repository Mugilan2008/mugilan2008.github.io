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

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict && dict[key] !== undefined) {
        el.placeholder = dict[key];
      } else if (defaultDict && defaultDict[key] !== undefined) {
        el.placeholder = defaultDict[key];
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict && dict[key] !== undefined) {
        el.title = dict[key];
      } else if (defaultDict && defaultDict[key] !== undefined) {
        el.title = defaultDict[key];
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

  /* --------------------------------------------------------------------------
     AI ASSISTANT CONCIERGE & UNIVERSAL INTELLIGENCE ENGINE
     -------------------------------------------------------------------------- */
  const initAiAssistant = () => {
    const triggerBtn = document.getElementById('aiAssistantToggleBtn');
    const modal = document.getElementById('aiAssistantModal');
    const closeBtn = document.getElementById('aiCloseChatBtn');
    const clearBtn = document.getElementById('aiClearChatBtn');
    const messagesContainer = document.getElementById('aiMessagesContainer');
    const inputForm = document.getElementById('aiInputForm');
    const userInput = document.getElementById('aiUserInput');
    const sendBtn = document.getElementById('aiSendBtn');

    if (!triggerBtn || !modal || !messagesContainer) return;

    let isModalOpen = false;
    let isGenerating = false;

    // --- 1. Markdown Formatter Utility ---
    const formatMarkdown = (raw) => {
      if (!raw) return '';
      let html = raw;
      
      // Code blocks with language
      html = html.replace(/```([a-zA-Z0-9_\-#+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="lang-${lang}">${escapeHtml(code.trim())}</code></pre>`;
      });

      // Inline code
      html = html.replace(/`([^`]+)`/g, (match, code) => `<code>${escapeHtml(code)}</code>`);

      // Bold **text**
      html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');

      // Italic *text*
      html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');

      // Markdown links [text](url)
      html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

      // Bullet lists
      const lines = html.split('\n');
      let inList = false;
      const parsedLines = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('- ') || line.startsWith('* ')) {
          if (!inList) {
            parsedLines.push('<ul>');
            inList = true;
          }
          parsedLines.push(`<li>${line.substring(2)}</li>`);
        } else {
          if (inList) {
            parsedLines.push('</ul>');
            inList = false;
          }
          if (line) {
            if (!line.startsWith('<pre') && !line.startsWith('</pre') && !line.startsWith('<div') && !line.startsWith('</div') && !line.startsWith('<p') && !line.startsWith('</p>')) {
              parsedLines.push(`<p>${line}</p>`);
            } else {
              parsedLines.push(line);
            }
          }
        }
      }
      if (inList) parsedLines.push('</ul>');

      return parsedLines.join('\n');
    };

    // --- 2. Math & Formula Evaluator ---
    const solveMathQuery = (query) => {
      const q = query.toLowerCase().trim();
      
      // Check for Ohm's Law or basic formulas explicitly
      if (q.includes('ohm') && (q.includes('law') || q.includes('formula'))) {
        return `
          <p><strong>Ohm's Law Fundamentals:</strong></p>
          <p>Ohm's Law states that the current flowing through a conductor between two points is directly proportional to the voltage across the two points and inversely proportional to the resistance.</p>
          <ul>
            <li><strong>Voltage:</strong> <code>V = I × R</code> (Volts)</li>
            <li><strong>Current:</strong> <code>I = V / R</code> (Amperes)</li>
            <li><strong>Resistance:</strong> <code>R = V / I</code> (Ohms Ω)</li>
            <li><strong>Electrical Power:</strong> <code>P = V × I = I² × R = V² / R</code> (Watts)</li>
          </ul>
        `;
      }

      // Check for Buck Converter formula
      if (q.includes('buck') && (q.includes('formula') || q.includes('equation') || q.includes('calc') || q.includes('duty'))) {
        return `
          <p><strong>DC-DC Buck Converter (Step-Down) Equations:</strong></p>
          <ul>
            <li><strong>Output Voltage:</strong> <code>V_out = D × V_in</code> (where D is Duty Cycle, 0 &lt; D &lt; 1)</li>
            <li><strong>Duty Cycle:</strong> <code>D = V_out / V_in = T_on / T_s</code></li>
            <li><strong>Inductor Value (CCM):</strong> <code>L_min = [(V_in - V_out) × D] / (f_sw × ΔI_L)</code></li>
            <li><strong>Output Capacitor:</strong> <code>C_min = ΔI_L / (8 × f_sw × ΔV_out)</code></li>
          </ul>
        `;
      }

      // Check for Boost Converter formula
      if (q.includes('boost') && (q.includes('formula') || q.includes('equation') || q.includes('calc'))) {
        return `
          <p><strong>DC-DC Boost Converter (Step-Up) Equations:</strong></p>
          <ul>
            <li><strong>Output Voltage:</strong> <code>V_out = V_in / (1 - D)</code> (where D &lt; 1)</li>
            <li><strong>Duty Cycle:</strong> <code>D = 1 - (V_in / V_out)</code></li>
            <li><strong>Inductor Value (CCM):</strong> <code>L_min = (V_in × D) / (f_sw × ΔI_L)</code></li>
            <li><strong>Output Capacitor:</strong> <code>C_min = (I_out × D) / (f_sw × ΔV_out)</code></li>
          </ul>
        `;
      }

      // General Arithmetic & Math Expressions
      const mathCleaned = q.replace(/calculate|solve|what is|evaluate|=|\?/g, '').trim();
      const isMath = /^[\d\.\s\+\-\*/\^\(\)\%eEsqrtpsincota]+$/.test(mathCleaned) && /[\d]/.test(mathCleaned) && /[\+\-\*/\^]/.test(mathCleaned);

      if (isMath) {
        try {
          let expr = mathCleaned
            .replace(/\^/g, '**')
            .replace(/sqrt\(([^\)]+)\)/g, 'Math.sqrt($1)')
            .replace(/sin\(([^\)]+)\)/g, 'Math.sin($1 * Math.PI / 180)')
            .replace(/cos\(([^\)]+)\)/g, 'Math.cos($1 * Math.PI / 180)')
            .replace(/pi/g, 'Math.PI');

          // Safe evaluation using Function
          const result = Function(`"use strict"; return (${expr});`)();
          if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
            const rounded = Math.round(result * 1000000) / 1000000;
            return `
              <p>🧮 <strong>Mathematical Calculation:</strong></p>
              <blockquote><code>${escapeHtml(mathCleaned)} = <strong>${rounded}</strong></code></blockquote>
              <p>Computed with mathematical precision.</p>
            `;
          }
        } catch (err) {
          // Ignore and continue to next handlers
        }
      }

      return null;
    };

    // --- 3. Coding Generator ---
    const solveCodingQuery = (query) => {
      const q = query.toLowerCase();
      if (!q.includes('code') && !q.includes('program') && !q.includes('script') && !q.includes('function') && !q.includes('algorithm') && !q.includes('python') && !q.includes('javascript') && !q.includes('matlab') && !q.includes(' c ') && !q.startsWith('c ') && !q.includes('html')) {
        return null;
      }

      // Python sample
      if (q.includes('python')) {
        return `
          <p>Here is a clean <strong>Python</strong> implementation:</p>
          <pre><code class="lang-python"># Python Implementation
def fibonacci_series(n_terms: int) -> list[int]:
    """Generate Fibonacci sequence up to n terms."""
    if n_terms <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n_terms:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n_terms]

if __name__ == '__main__':
    result = fibonacci_series(10)
    print(f"Fibonacci (10 terms): {result}")
</code></pre>
          <p>Let me know if you need modifications or a specific Python module!</p>
        `;
      }

      // C Programming sample
      if (q.includes(' c ') || q.startsWith('c ') || q.includes('c program')) {
        return `
          <p>Here is a structured <strong>C Program</strong>:</p>
          <pre><code class="lang-c">#include &lt;stdio.h&gt;

// Function to calculate DC-DC Buck Converter Duty Cycle
float calculate_buck_duty(float v_in, float v_out) {
    if (v_in <= 0.0f || v_out >= v_in) {
        return 0.0f;
    }
    return v_out / v_in;
}

int main() {
    float v_in = 12.0f;
    float v_out = 5.0f;
    float duty = calculate_buck_duty(v_in, v_out);
    
    printf("Input: %.2fV, Target Output: %.2fV\n", v_in, v_out);
    printf("Required Duty Cycle (D): %.2f (%.1f%%)\n", duty, duty * 100.0f);
    return 0;
}
</code></pre>
        `;
      }

      // MATLAB / Simulink sample
      if (q.includes('matlab') || q.includes('simulink')) {
        return `
          <p>Here is a <strong>MATLAB Script</strong> for power converter simulation plotting:</p>
          <pre><code class="lang-matlab">% MATLAB Script: DC-DC Buck Converter Transient Response
clc; clear; close all;

Vin = 12;           % Input Voltage (V)
Vout_target = 5;    % Target Output Voltage (V)
D = Vout_target / Vin; % Duty Cycle
fs = 100e3;         % Switching Frequency (100 kHz)
L = 143e-6;         % Inductance (143 uH)
C = 200e-6;         % Capacitance (200 uF)
R_load = 5;         % Load Resistance (5 Ohms)

t = linspace(0, 0.005, 5000); % Time vector
Vout = Vout_target * (1 - exp(-t / (R_load * C)));

figure('Color', [0.08 0.1 0.14]);
plot(t * 1e3, Vout, 'LineWidth', 2, 'Color', [0.16 0.6 1.0]);
grid on;
title('Buck Converter Output Voltage Step Response', 'Color', 'w');
xlabel('Time (ms)', 'Color', 'w');
ylabel('Output Voltage (V)', 'Color', 'w');
set(gca, 'Color', [0.05 0.06 0.09], 'XColor', 'w', 'YColor', 'w');
</code></pre>
        `;
      }

      // JavaScript sample
      if (q.includes('javascript') || q.includes('js')) {
        return `
          <p>Here is a modern <strong>JavaScript (ES6+)</strong> implementation:</p>
          <pre><code class="lang-javascript">// High-Performance Debounce Function
export function debounce(callback, delay = 300) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

// Example Usage:
const handleSearch = debounce((query) => {
  console.log('Searching API for:', query);
}, 250);
</code></pre>
        `;
      }

      return null;
    };

    // --- 4. Electrical Engineering & Science Knowledge Base ---
    const queryEngineeringDeepKnowledge = (query) => {
      const q = query.toLowerCase();

      if (q.includes('pwm') || q.includes('pulse width modulation')) {
        return `
          <p><strong>Pulse Width Modulation (PWM):</strong></p>
          <p>PWM is a modulation technique used to control the amount of power delivered to electrical devices by rapidly pulsing the power supply on and off.</p>
          <ul>
            <li><strong>Duty Cycle ($D$):</strong> Ratio of pulse active duration ($T_{on}$) to total switching period ($T_s$). <code>D = T_on / T_s</code>.</li>
            <li><strong>Key Applications:</strong> Switched-mode power supplies (Buck/Boost converters), DC motor speed control, LED dimming, and solar inverters.</li>
          </ul>
        `;
      }

      if (q.includes('wireless power') || q.includes('wireless charging') || q.includes('inductive') || q.includes('wpt')) {
        return `
          <p><strong>Wireless Power Transfer (WPT) for Electric Vehicles:</strong></p>
          <p>WPT allows contactless transmission of electrical energy across an air gap using electromagnetic fields.</p>
          <ul>
            <li><strong>Magnetic Resonant Coupling:</strong> Both transmitter and receiver coils are tuned to identical resonant frequencies ($f_r = \frac{1}{2\pi\sqrt{LC}}$) to maximize power transfer efficiency over wider gaps.</li>
            <li><strong>Mugilan's IDEA Lab Project:</strong> Implemented dual-bay automated alignment sensing with real-time telemetry for EV charging stations.</li>
          </ul>
          <div class="ai-action-btn-group">
            <button class="ai-action-btn" data-action="filter-hw">🔋 View EV Wireless Project</button>
          </div>
        `;
      }

      if (q.includes('mosfet') || q.includes('igbt') || q.includes('bjt') || q.includes('transistor')) {
        return `
          <p><strong>Power Semiconductor Devices Comparison:</strong></p>
          <ul>
            <li><strong>Power MOSFET:</strong> Voltage-controlled device with high switching speeds (>100 kHz) and low gate drive power. Ideal for low-to-medium voltage DC-DC converters (e.g., IRFZ44N).</li>
            <li><strong>IGBT (Insulated Gate Bipolar Transistor):</strong> Combines the simple gate drive of MOSFETs with the high-current and low-saturation-voltage capability of BJTs. Best for high voltage (>600V) and EV motor traction inverters.</li>
            <li><strong>BJT (Bipolar Junction Transistor):</strong> Current-controlled device with slower switching speed and thermal runaway susceptibility compared to MOSFETs.</li>
          </ul>
        `;
      }

      if (q.includes('inverter') || q.includes('rectifier')) {
        return `
          <p><strong>Power Conversion Categories:</strong></p>
          <ul>
            <li><strong>Rectifier (AC to DC):</strong> Converts alternating current to direct current using diode bridges or active thyristor/MOSFET switches.</li>
            <li><strong>Inverter (DC to AC):</strong> Synthesizes sinusoidal alternating current from a DC source using Sinusoidal Pulse Width Modulation (SPWM) and H-bridge switching.</li>
            <li><strong>DC-DC Converter:</strong> Steps voltage up (Boost) or down (Buck) with high conversion efficiency (>90%).</li>
          </ul>
        `;
      }

      if (q.includes('faraday') || q.includes('lenz') || q.includes('induction')) {
        return `
          <p><strong>Faraday's Law of Electromagnetic Induction:</strong></p>
          <p>States that any change in magnetic flux ($\Phi_B$) through a circuit induces an electromotive force (EMF, $\mathcal{E}$):</p>
          <blockquote><code>EMF (E) = - N × (dΦ / dt)</code></blockquote>
          <p>The negative sign represents <strong>Lenz's Law</strong>, indicating that the induced current creates a magnetic field opposing the change in original magnetic flux.</p>
        `;
      }

      if (q.includes('power factor') || q.includes('reactive power')) {
        return `
          <p><strong>AC Power Factor (PF):</strong></p>
          <p>Power Factor is the ratio of Real Active Power ($P$, in kW) to Apparent Power ($S$, in kVA):</p>
          <ul>
            <li><strong>Formula:</strong> <code>PF = cos(θ) = P / S</code></li>
            <li><strong>Lagging PF:</strong> Caused by inductive loads (motors, inductors) where current lags voltage.</li>
            <li><strong>Leading PF:</strong> Caused by capacitive loads where current leads voltage.</li>
            <li><strong>Unity PF (1.0):</strong> Maximum efficiency where current and voltage are in perfect phase.</li>
          </ul>
        `;
      }

      return null;
    };

    // --- 5. Conversational & Trivia Knowledge ---
    const queryConversationalKnowledge = (query) => {
      const q = query.toLowerCase().trim();

      if (q.includes('joke') || q.includes('funny')) {
        const jokes = [
          "Why did the circuit cross the breadboard? To get to the other diode! ⚡",
          "There are 10 types of people in the world: those who understand binary, and those who don't. 💻",
          "Why do power electronics engineers stay calm? Because they know how to handle high tension! ⚡",
          "What did the capacitor say to the inductor? You are so resistant to change! 🔌"
        ];
        return `<p>😄 ${jokes[Math.floor(Math.random() * jokes.length)]}</p>`;
      }

      if (q.includes('quote') || q.includes('motivation') || q.includes('inspire')) {
        const quotes = [
          ""Scientists study the world as it is; engineers create the world that has never been." — Theodore von Kármán 🚀",
          ""The best way to predict the future is to invent it." — Alan Kay 💡",
          ""If you want to find the secrets of the universe, think in terms of energy, frequency and vibration." — Nikola Tesla ⚡",
          ""Failure is simply the opportunity to begin again, this time more intelligently." — Henry Ford 🛠"
        ];
        return `<p>✨ ${quotes[Math.floor(Math.random() * quotes.length)]}</p>`;
      }

      if (q.includes('time') || q.includes('date') || q.includes('today')) {
        const now = new Date();
        return `
          <p>🕒 <strong>Current Date & Time:</strong></p>
          <p><strong>${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong><br>${now.toLocaleTimeString()}</p>
        `;
      }

      if (q.includes('thank') || q.includes('good') || q.includes('great') || q.includes('awesome') || q.includes('nice')) {
        return `<p>You're very welcome! I'm always here to help you explore Mugilan's engineering journey and answer any technical questions. ⚡</p>`;
      }

      return null;
    };

    // --- 6. Live General Knowledge Wikipedia Fetcher ---
    const fetchLiveKnowledge = async (query) => {
      try {
        // Clean topic string
        let topic = query
          .toLowerCase()
          .replace(/^(what is|who is|tell me about|explain|describe|what are|who was|history of|how does|define|meaning of|where is)\s+/i, '')
          .replace(/[\?\!\.]/g, '')
          .trim();

        if (!topic || topic.length < 2) return null;

        // Capitalize for Wikipedia slug
        const wikiSlug = encodeURIComponent(topic.replace(/\s+/g, '_'));
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiSlug}`, {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) return null;

        const data = await response.json();
        if (!data || data.type === 'disambiguation' || !data.extract) return null;

        const title = data.title || topic;
        const extract = data.extract;
        const pageUrl = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${wikiSlug}`;

        return `
          <p>📚 <strong>${escapeHtml(title)}:</strong></p>
          <p>${escapeHtml(extract)}</p>
          <div class="ai-source-tag">
            <span>🌐 Source:</span>
            <a href="${pageUrl}" target="_blank" rel="noopener noreferrer">Wikipedia Encyclopedia ↗</a>
          </div>
        `;
      } catch (err) {
        return null;
      }
    };

    // --- 7. Portfolio Knowledge Base ---
    const queryPortfolioKnowledge = (query) => {
      const q = query.toLowerCase().trim();

      // Greetings
      if (/^(hi|hello|hey|namaste|vanakkam|bonjour|hallo|konnichiwa|ni hao|who are you|what is this|start|help)/i.test(q)) {
        return `
          <p>Hello! I am <strong>Mugilan's AI Assistant</strong> ⚡.</p>
          <p>I can answer <strong>any question</strong>: from Mugilan's <strong>Engineering Projects &amp; Skills</strong> to <strong>Mathematics</strong>, <strong>Power Electronics</strong>, <strong>Coding</strong>, and <strong>General Science</strong>!</p>
          <div class="ai-action-btn-group">
            <button class="ai-action-btn" data-action="scroll-projects">⚡ View Projects</button>
            <button class="ai-action-btn" data-action="scroll-skills">🛠 Technical Skills</button>
            <button class="ai-action-btn" data-action="scroll-contact">📞 Contact Info</button>
          </div>
        `;
      }

      // Projects
      if (q.includes('project') || q.includes('simulation') || q.includes('buck') || q.includes('boost') || q.includes('dc motor') || q.includes('wireless') || q.includes('idea lab') || q.includes('showcase')) {
        return `
          <p>Mugilan has developed <strong>5 core engineering case studies</strong>:</p>
          <ul>
            <li><strong>1. Buck Converter Simulation (LTspice):</strong> 12V→5V step-down with IRFZ44N MOSFET &amp; 1N5819 diode.</li>
            <li><strong>2. Boost Converter Simulation (LTspice):</strong> 5V→10V step-up with 100 kHz switching.</li>
            <li><strong>3. Closed-Loop DC Motor Control (MATLAB/Simulink):</strong> PI controller with PWM feedback and disturbance rejection.</li>
            <li><strong>4. Smart Wireless EV Power Transfer (IDEA Lab):</strong> Contactless resonant inductive charging prototype with dual bays.</li>
            <li><strong>5. Multilingual Engineering Portfolio:</strong> 9-language web engineering system with audio and interactive visuals.</li>
          </ul>
          <div class="ai-action-btn-group">
            <button class="ai-action-btn" data-action="scroll-projects">🚀 Jump to Projects</button>
            <button class="ai-action-btn" data-action="filter-sim">⚡ Simulation</button>
            <button class="ai-action-btn" data-action="filter-hw">🔋 Hardware / IDEA Lab</button>
          </div>
        `;
      }

      // Skills
      if (q.includes('skill') || q.includes('tool') || q.includes('software') || q.includes('stack') || q.includes('proteus') || q.includes('fusion') || q.includes('autodesk') || q.includes('mssql')) {
        return `
          <p>Mugilan's <strong>Technical Skill Stack</strong>:</p>
          <ul>
            <li><strong>Engineering &amp; Simulation:</strong> MATLAB &amp; Simulink <em>(Certified)</em>, LTspice, Autodesk Fusion 360 <em>(Certified)</em>, Proteus.</li>
            <li><strong>Programming:</strong> C Language, Python, Embedded C.</li>
            <li><strong>Web Development:</strong> Semantic HTML5, Vanilla CSS3 Glassmorphism, Modern JavaScript ES6+.</li>
            <li><strong>Database:</strong> Microsoft SQL Server (MSSQL).</li>
          </ul>
          <div class="ai-action-btn-group">
            <button class="ai-action-btn" data-action="scroll-skills">🛠 View Skills Section</button>
          </div>
        `;
      }

      // Education
      if (q.includes('education') || q.includes('college') || q.includes('school') || q.includes('degree') || q.includes('study') || q.includes('smvec') || q.includes('amalorpavam') || q.includes('btech')) {
        return `
          <p>Mugilan's <strong>Educational Background</strong>:</p>
          <ul>
            <li>🎓 <strong>BTech in EEE (2025–2029):</strong> Sri Manakula Vinayagar Engineering College (SMVEC) — Specializing in power converters, circuit design, and automation.</li>
            <li>🏫 <strong>High School (2011–2025):</strong> Amalorpavam Higher Secondary School — Completed with strong academic grounding in physics and mathematics.</li>
          </ul>
          <div class="ai-action-btn-group">
            <button class="ai-action-btn" data-action="scroll-education">🎓 View Education Timeline</button>
          </div>
        `;
      }

      // Resume
      if (q.includes('resume') || q.includes('cv') || q.includes('curriculum vitae') || q.includes('biodata') || q.includes('download')) {
        return `
          <p>You can download Mugilan's official Engineering Resume / CV below:</p>
          <div class="ai-action-btn-group">
            <a href="Mugilan_Saravana_Perumal_Resume.pdf" download="Mugilan_Saravana_Perumal_Resume.pdf" class="ai-action-btn">📄 Download Resume (PDF)</a>
            <button class="ai-action-btn" data-action="scroll-about">👤 View in About Section</button>
          </div>
        `;
      }

      // Contact
      if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('call') || q.includes('mobile') || q.includes('linkedin') || q.includes('github') || q.includes('hire')) {
        return `
          <p>Connect with <strong>Mugilan Saravana Perumal</strong>:</p>
          <ul>
            <li>📧 <strong>Email:</strong> <a href="mailto:Mugilan02767@gmail.com">Mugilan02767@gmail.com</a></li>
            <li>📱 <strong>Phone:</strong> <a href="tel:+919363158774">🇮🇳 +91 9363158774</a></li>
            <li>💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/mugilan-eee" target="_blank" rel="noopener">linkedin.com/in/mugilan-eee</a></li>
            <li>🐙 <strong>GitHub:</strong> <a href="https://github.com/Mugilan2008" target="_blank" rel="noopener">github.com/Mugilan2008</a></li>
          </ul>
          <div class="ai-action-btn-group">
            <button class="ai-action-btn" data-action="scroll-contact">📬 Go to Contact Section</button>
          </div>
        `;
      }

      // About
      if (q.includes('about') || q.includes('who is mugilan') || q.includes('bio') || q.includes('story') || q.includes('vision') || q.includes('interests')) {
        return `
          <p><strong>Mugilan Saravana Perumal</strong> is an aspiring Electrical &amp; Electronics Engineer passionate about power converters, sustainable energy, and electric vehicle drive systems.</p>
          <div class="ai-action-btn-group">
            <button class="ai-action-btn" data-action="scroll-about">📖 Read Full Story</button>
          </div>
        `;
      }

      // Certifications
      if (q.includes('cert') || q.includes('credential')) {
        return `
          <p>Mugilan holds verified certifications in <strong>Autodesk Fusion 360 CAD</strong> and <strong>MathWorks/MATLAB</strong> modeling.</p>
          <div class="ai-action-btn-group">
            <button class="ai-action-btn" data-action="scroll-certifications">📜 View Certifications</button>
          </div>
        `;
      }

      return null;
    };

    // --- Main Universal Answer Coordinator ---
    const generateUniversalAnswer = async (query) => {
      const q = query.trim();
      if (!q) return null;

      // 1. Portfolio Direct Query
      const portAns = queryPortfolioKnowledge(q);
      if (portAns) return portAns;

      // 2. Mathematical Calculation
      const mathAns = solveMathQuery(q);
      if (mathAns) return mathAns;

      // 3. Coding Request
      const codeAns = solveCodingQuery(q);
      if (codeAns) return codeAns;

      // 4. Electrical Engineering / Science Deep Concept
      const engAns = queryEngineeringDeepKnowledge(q);
      if (engAns) return engAns;

      // 5. Conversational / Humor / Motivation
      const convAns = queryConversationalKnowledge(q);
      if (convAns) return convAns;

      // 6. Live Online Encyclopedia Knowledge
      const liveAns = await fetchLiveKnowledge(q);
      if (liveAns) return liveAns;

      // 7. Intelligent Semantic Fallback with Guided Options
      return `
        <p>I analyzed your question: <em>"${escapeHtml(q)}"</em>.</p>
        <p>I am capable of answering questions on <strong>Mathematics</strong>, <strong>Circuit Physics &amp; Power Electronics</strong>, <strong>Programming in C/Python/MATLAB</strong>, and <strong>Mugilan's Engineering Portfolio</strong>.</p>
        <p>Try asking:</p>
        <ul>
          <li>🧮 <em>"Calculate 24 * 15 / 2"</em></li>
          <li>⚡ <em>"How does a Boost Converter work?"</em></li>
          <li>💻 <em>"Write a Python function for sorting"</em></li>
          <li>🔋 <em>"Explain wireless EV power transfer"</em></li>
          <li>🎓 <em>"Tell me about Mugilan's education and projects"</em></li>
        </ul>
        <div class="ai-action-btn-group">
          <button class="ai-action-btn" data-action="scroll-projects">⚡ Explore Projects</button>
          <button class="ai-action-btn" data-action="scroll-skills">🛠 Technical Skills</button>
        </div>
      `;
    };

    // Render message row
    const appendMessage = (sender, htmlContent) => {
      const msgRow = document.createElement('div');
      msgRow.className = `ai-msg-row ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;

      const avatar = document.createElement('div');
      avatar.className = 'ai-msg-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.innerHTML = sender === 'user' 
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>';

      const bubble = document.createElement('div');
      bubble.className = 'ai-msg-bubble';
      bubble.innerHTML = htmlContent;

      msgRow.appendChild(avatar);
      msgRow.appendChild(bubble);
      messagesContainer.appendChild(msgRow);

      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Attach action listeners
      bubble.querySelectorAll('.ai-action-btn[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const action = btn.getAttribute('data-action');
          handleAction(action);
        });
      });
    };

    // Handle interactive in-chat action buttons
    const handleAction = (action) => {
      if (action.startsWith('scroll-')) {
        const targetId = action.replace('scroll-', '');
        const el = document.getElementById(targetId);
        if (el) {
          if (window.innerWidth < 768) {
            closeModal();
          }
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (action === 'filter-sim') {
        const simFilterBtn = document.querySelector('.filter-btn[data-filter="simulation"]');
        if (simFilterBtn) simFilterBtn.click();
        const projEl = document.getElementById('projects');
        if (projEl) projEl.scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth < 768) closeModal();
      } else if (action === 'filter-hw') {
        const hwFilterBtn = document.querySelector('.filter-btn[data-filter="hardware"]');
        if (hwFilterBtn) hwFilterBtn.click();
        const projEl = document.getElementById('projects');
        if (projEl) projEl.scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth < 768) closeModal();
      }
    };

    // Show / Hide Typing indicator
    let typingIndicatorEl = null;
    const showTypingIndicator = () => {
      if (typingIndicatorEl) return;
      typingIndicatorEl = document.createElement('div');
      typingIndicatorEl.className = 'ai-msg-row bot-msg ai-typing-row';
      typingIndicatorEl.innerHTML = `
        <div class="ai-msg-avatar" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
        </div>
        <div class="ai-typing-indicator" aria-label="Mugilan AI is thinking...">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      `;
      messagesContainer.appendChild(typingIndicatorEl);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const hideTypingIndicator = () => {
      if (typingIndicatorEl && typingIndicatorEl.parentNode) {
        typingIndicatorEl.parentNode.removeChild(typingIndicatorEl);
      }
      typingIndicatorEl = null;
    };

    // Process User Query
    const handleUserSubmit = async (text) => {
      if (!text || isGenerating) return;
      isGenerating = true;

      // Append user message
      appendMessage('user', `<p>${escapeHtml(text)}</p>`);

      // Clear input
      if (userInput) {
        userInput.value = '';
        if (sendBtn) sendBtn.disabled = true;
      }

      showTypingIndicator();

      try {
        const responseHtml = await generateUniversalAnswer(text);
        hideTypingIndicator();
        appendMessage('bot', responseHtml);
      } catch (err) {
        hideTypingIndicator();
        appendMessage('bot', '<p>I encountered an unexpected issue processing that question. Please try asking again or rephrase!</p>');
      } finally {
        isGenerating = false;
        if (userInput) userInput.focus();
      }
    };

    // HTML escape utility
    const escapeHtml = (str) => {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };

    // Initialize welcome message
    const renderWelcomeMessage = () => {
      messagesContainer.innerHTML = '';
      const dict = getTranslationDict(currentLanguage);
      const welcomeText = dict.ai_welcome_msg || "Hi! I am Mugilan's AI Assistant ⚡. I can answer any question about Mugilan's engineering projects, simulation models, mathematics, coding, or science!";
      
      appendMessage('bot', `
        <p>${welcomeText}</p>
        <div class="ai-action-btn-group">
          <button class="ai-action-btn" data-action="scroll-projects">⚡ View Projects</button>
          <button class="ai-action-btn" data-action="scroll-skills">🛠 Skills</button>
          <button class="ai-action-btn" data-action="scroll-contact">📞 Contact</button>
        </div>
      `);
    };

    // Open Modal
    const openModal = () => {
      isModalOpen = true;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      triggerBtn.setAttribute('aria-expanded', 'true');
      if (messagesContainer.children.length === 0) {
        renderWelcomeMessage();
      }
      setTimeout(() => {
        if (userInput) userInput.focus();
      }, 200);
    };

    // Close Modal
    const closeModal = () => {
      isModalOpen = false;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      triggerBtn.setAttribute('aria-expanded', 'false');
    };

    // Toggle Modal
    const toggleModal = () => {
      if (isModalOpen) closeModal();
      else openModal();
    };

    // Event Listeners
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleModal();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderWelcomeMessage();
      });
    }

    // Input events
    if (userInput && sendBtn) {
      userInput.addEventListener('input', () => {
        sendBtn.disabled = !userInput.value.trim();
      });
    }

    if (inputForm) {
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (userInput) {
          const val = userInput.value.trim();
          if (val) handleUserSubmit(val);
        }
      });
    }

    // Prompt Chips
    document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const promptKey = chip.getAttribute('data-prompt');
        let queryText = '';
        if (promptKey === 'projects') queryText = 'Tell me about your simulation and engineering projects';
        else if (promptKey === 'skills') queryText = 'What are your technical skills, programming languages and software tools?';
        else if (promptKey === 'education') queryText = 'Where did you study your degree and high school?';
        else if (promptKey === 'resume') queryText = 'How can I download your resume or CV?';
        else if (promptKey === 'contact') queryText = 'How can I contact Mugilan by phone or email?';

        if (queryText) {
          handleUserSubmit(queryText);
        }
      });
    });

    // Keyboard support: Escape closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    });

    // Language switch hook: update welcome greeting if only welcome message is displayed
    window.addEventListener('languageChange', () => {
      if (messagesContainer.querySelectorAll('.ai-msg-row').length <= 1) {
        renderWelcomeMessage();
      }
    });

    // Initial render
    renderWelcomeMessage();
  };


    // Initialize AI Assistant
  initAiAssistant();

  // Log successful initialization
  console.log('⚡ Mugilan Saravana Perumal Engineering Portfolio initialized successfully with 9 languages and AI Assistant.');
});
