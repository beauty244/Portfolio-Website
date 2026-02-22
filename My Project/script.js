/**
 * Portfolio - Main JavaScript
 * Handles: loader, nav, theme, smooth scroll, scroll reveal, typing, filters, form, lazy images
 */

(function () {
  'use strict';

  /* ========== DOM References ========== */
  const loader = document.getElementById('loader');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.navbar__link');
  const themeToggle = document.getElementById('theme-toggle');
  const contactForm = document.getElementById('contact-form');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const typingEl = document.getElementById('typing-text');
  const yearEl = document.getElementById('year');

  /* ========== Configuration ========== */
  const TYPING_PHRASES = [
    'Seeking internship opportunities.',
    'Passionate about software development.',
    'Always learning and adapting.',
  ];
  const TYPING_SPEED = 80;
  const TYPING_PAUSE = 2000;
  const REVEAL_THRESHOLD = 0.1;
  const REVEAL_ROOT_MARGIN = '0px 0px -60px 0px';

  /* ========== Loader ========== */
  function hideLoader() {
    if (!loader) return;
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }

  window.addEventListener('load', function () {
    setTimeout(hideLoader, 600);
  });

  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 400);
  }

  /* ========== Theme (Dark / Light) ========== */
  function getStoredTheme() {
    return localStorage.getItem('theme');
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
      }
    } else {
      root.removeAttribute('data-theme');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  }

  function initTheme() {
    const stored = getStoredTheme();
    const system = getSystemTheme();
    const theme = stored || system;
    applyTheme(theme);
  }

  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  initTheme();

  /* ========== Mobile Nav ========== */
  function openNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) closeNav();
      else openNav();
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeNav();
    });
  });

  /* ========== Smooth Scroll ========== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ========== Active Nav Link on Scroll ========== */
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    const scrollY = window.scrollY;
    const navbarHeight = 80;

    sections.forEach(function (section) {
      const id = section.getAttribute('id');
      const top = section.offsetTop - navbarHeight;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', function () {
    setActiveLink();
  });
  setActiveLink();

  /* ========== Scroll Reveal ========== */
  const revealEls = document.querySelectorAll('.reveal');

  function revealCallback(entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: REVEAL_THRESHOLD,
    rootMargin: REVEAL_ROOT_MARGIN,
  });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ========== Typing Animation (Hero) ========== */
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function typeNext() {
    if (!typingEl) return;

    const phrase = TYPING_PHRASES[phraseIndex];
    let delay = TYPING_SPEED;

    if (isDeleting) {
      typingEl.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;
      delay = TYPING_SPEED / 2;
    } else {
      typingEl.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === phrase.length) {
      delay = TYPING_PAUSE;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length;
      delay = TYPING_SPEED * 2;
    }

    typingTimeout = setTimeout(typeNext, delay);
  }

  if (typingEl && TYPING_PHRASES.length) {
    setTimeout(typeNext, 800);
  }

  /* ========== Project Filter ========== */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      filterBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      this.classList.add('active');

      projectCards.forEach(function (card) {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });

  /* ========== Form Validation ========== */
  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + '-error');
    const group = input ? input.closest('.form-group') : null;
    if (group) group.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + '-error');
    const group = input ? input.closest('.form-group') : null;
    if (group) group.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    clearError('name');
    clearError('email');
    clearError('message');

    if (!name.value.trim()) {
      showError('name', 'Name is required.');
      valid = false;
    }

    if (!email.value.trim()) {
      showError('email', 'Email is required.');
      valid = false;
    } else if (!validateEmail(email.value)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    if (!message.value.trim()) {
      showError('message', 'Message is required.');
      valid = false;
    }

    return valid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      // Simulate submit (replace with real endpoint)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.textContent = 'Sent!';
        contactForm.reset();
        clearError('name');
        clearError('email');
        clearError('message');
        setTimeout(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }, 800);
    });

    ['name', 'email', 'message'].forEach(function (id) {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', function () {
          clearError(id);
        });
        input.addEventListener('blur', function () {
          if (input.value.trim()) clearError(id);
        });
      }
    });
  }

  /* ========== Lazy Load Images ========== */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  function lazyLoadImage(img) {
    if (!img.dataset.src && !img.src) return;
    const src = img.dataset.src || img.src;
    if (img.dataset.src) {
      img.src = src;
      img.removeAttribute('data-src');
    }
  }

  const imageObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      lazyLoadImage(entry.target);
      obs.unobserve(entry.target);
    });
  }, { rootMargin: '100px' });

  lazyImages.forEach(function (img) {
    imageObserver.observe(img);
  });

  /* ========== Footer Year ========== */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
