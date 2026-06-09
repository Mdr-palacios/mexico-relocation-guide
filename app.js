/* ============================================================
   MEXICO RELOCATION GUIDE — App JS
   ============================================================ */

(function () {
  'use strict';

  // ---- Dark/Light mode toggle ----
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  let currentTheme = root.getAttribute('data-theme') || getSystemTheme();
  root.setAttribute('data-theme', currentTheme);
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    if (currentTheme === 'dark') {
      themeToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // ---- Language toggle ----
  const langToggle = document.getElementById('lang-toggle');
  let currentLang = 'en';

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'es' : 'en';
      document.body.classList.toggle('lang-es', currentLang === 'es');
      // Update html lang attribute for accessibility
      document.documentElement.setAttribute('lang', currentLang);
    });
  }

  // ---- Mobile nav hamburger ----
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Scroll-aware nav ----
  const nav = document.getElementById('site-nav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 60) {
        nav.classList.add('site-nav--scrolled');
      } else {
        nav.classList.remove('site-nav--scrolled');
      }
      lastScroll = current;
    }, { passive: true });
  }

  // ---- Accordion ----
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (!panel) return;

      // Close all in same accordion
      const accordion = btn.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-btn').forEach(b => {
          b.setAttribute('aria-expanded', 'false');
        });
        accordion.querySelectorAll('.accordion-panel').forEach(p => {
          p.classList.remove('open');
        });
      }

      // Toggle current
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
      }
    });
  });

  // ---- State selector (work.html) ----
  const stateSelector = document.getElementById('state-selector');
  if (stateSelector) {
    const defaultMsg = document.getElementById('state-default');
    const panels = document.querySelectorAll('.state-panel');

    stateSelector.addEventListener('change', () => {
      const val = stateSelector.value;

      // Hide all panels
      panels.forEach(p => p.classList.remove('active'));
      if (defaultMsg) defaultMsg.style.display = 'none';

      if (!val) {
        if (defaultMsg) defaultMsg.style.display = 'block';
        return;
      }

      const target = document.getElementById('state-' + val);
      if (target) {
        target.classList.add('active');
        // Smooth scroll to panel
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  }

  // ---- Intersection Observer: tile entrance animations ----
  const tiles = document.querySelectorAll('.tile, .history-card, .friend-tip, .step');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    tiles.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
      observer.observe(el);
    });
  }

})();
