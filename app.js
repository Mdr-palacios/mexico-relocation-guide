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

// ============================================================
// VOLUNTEER FORM — validation, conditionals, submission
// ============================================================
(function () {
  const form = document.getElementById('volunteer-form');
  if (!form) return;

  // Conditional: indigenous language field
  const indigenousCheck = document.getElementById('vf-indig-check');
  const indigenousField = document.getElementById('vf-indig-field');
  if (indigenousCheck && indigenousField) {
    indigenousCheck.addEventListener('change', () => {
      indigenousField.style.display = indigenousCheck.checked ? 'block' : 'none';
    });
  }

  // Conditional: other skills field
  const otherCheck = document.getElementById('vf-other-check');
  const otherField = document.getElementById('vf-other-field');
  if (otherCheck && otherField) {
    otherCheck.addEventListener('change', () => {
      otherField.style.display = otherCheck.checked ? 'block' : 'none';
    });
  }

  // Helper: show error
  function showErr(id, msgEn, msgEs) {
    const el = document.getElementById(id);
    if (!el) return;
    const isEs = document.body.classList.contains('lang-es');
    el.textContent = isEs ? msgEs : msgEn;
    el.classList.add('visible');
  }
  function clearErr(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('visible'); }
  }

  // Validate on submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // First name
    const fname = document.getElementById('vf-fname');
    if (!fname.value.trim()) {
      showErr('vf-fname-err', 'First name is required.', 'El nombre es obligatorio.');
      valid = false;
    } else clearErr('vf-fname-err');

    // Last name
    const lname = document.getElementById('vf-lname');
    if (!lname.value.trim()) {
      showErr('vf-lname-err', 'Last name is required.', 'El apellido es obligatorio.');
      valid = false;
    } else clearErr('vf-lname-err');

    // Email
    const email = document.getElementById('vf-email');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRe.test(email.value)) {
      showErr('vf-email-err', 'Please enter a valid email address.', 'Ingresa un correo electrónico válido.');
      valid = false;
    } else clearErr('vf-email-err');

    // ZIP
    const zip = document.getElementById('vf-zip');
    if (!zip.value.trim()) {
      showErr('vf-zip-err', 'ZIP / postal code is required.', 'El código postal es obligatorio.');
      valid = false;
    } else clearErr('vf-zip-err');

    // Consent radio
    const consent = form.querySelector('input[name="q10_emailConsent"]:checked');
    if (!consent) {
      showErr('vf-consent-err', 'Please select an option.', 'Por favor selecciona una opción.');
      valid = false;
    } else clearErr('vf-consent-err');

    if (!valid) {
      // Scroll to first error
      const firstErr = form.querySelector('.vf-error.visible');
      if (firstErr) firstErr.closest('.vf-field, fieldset')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // ── SUBMIT ──
    // If wired to JotForm (action contains submit.jotform.com), POST in
    // the background so the user stays on the site and sees the bilingual
    // success block. Otherwise, show the demo success state.

    const actionUrl = form.getAttribute('action') || '';
    const isJotform = /submit\.jotform\.com/i.test(actionUrl);

    function showSuccess() {
      form.style.display = 'none';
      const success = document.getElementById('vf-success');
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    if (isJotform) {
      // Roll the two conditional follow-up fields (which have no Jotform
      // counterpart) into the message field so they are not lost.
      const indig = form.querySelector('[name="_vf_indigLang"]');
      const otherTxt = form.querySelector('[name="_vf_otherSkills"]');
      const msg = form.querySelector('[name="q10_q10_textarea8"]');
      const extras = [];
      if (indig && indig.value.trim()) extras.push('Indigenous language: ' + indig.value.trim());
      if (otherTxt && otherTxt.value.trim()) extras.push('Other skills: ' + otherTxt.value.trim());
      if (extras.length && msg) {
        const prefix = extras.join(' | ');
        msg.value = msg.value ? (prefix + '\n\n' + msg.value) : prefix;
      }
      // Strip the local-only inputs so they are not POSTed.
      if (indig) indig.disabled = true;
      if (otherTxt) otherTxt.disabled = true;

      const submitBtn = form.querySelector('.vf-submit-btn');
      if (submitBtn) submitBtn.disabled = true;

      fetch(actionUrl, {
        method: 'POST',
        body: new FormData(form),
        mode: 'no-cors'
      }).then(showSuccess).catch(function () {
        // On error fall back to native submit (which redirects to Jotform's
        // thank-you page) so the submission is not lost.
        if (indig) indig.disabled = false;
        if (otherTxt) otherTxt.disabled = false;
        form.submit();
      });
    } else {
      // Demo: show success message
      showSuccess();
    }
  });

  // Live clear errors on input
  ['vf-fname', 'vf-lname', 'vf-email', 'vf-zip'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearErr(id + '-err'));
  });

})();

/* ============================================================
   ENGAGEMENT POP-UP
   Triggers after 3 meaningful interactions (accordion opens,
   state selector changes, link clicks inside content cards).
   Dismissed state is stored in-memory for the session.
   ============================================================ */
(function () {
  var TRIGGER_THRESHOLD = 3;
  var interactionCount = 0;
  var dismissed = false;

  // --- Build the modal HTML and inject into body ---
  function buildModal() {
    var el = document.createElement('div');
    el.id = 'engage-overlay';
    el.className = 'engage-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'engage-title');
    el.innerHTML = [
      '<div class="engage-modal">',
      '  <button class="engage-modal__close" id="engage-close" aria-label="Close">✕</button>',
      '  <span class="engage-modal__butterfly" aria-hidden="true">🦋</span>',
      '  <p class="engage-modal__eyebrow">',
      '    <span class="en-text">This site is community-built</span>',
      '    <span class="es-text">Este sitio es de la comunidad</span>',
      '  </p>',
      '  <h2 class="engage-modal__title" id="engage-title">',
      '    <span class="en-text">Help us <em>keep this resource alive.</em></span>',
      '    <span class="es-text">Ayúdanos a <em>mantener vivo este recurso.</em></span>',
      '  </h2>',
      '  <p class="engage-modal__body">',
      '    <span class="en-text">You\'re exploring this guide — that means it matters to you. We\'re volunteer-led and need translators, designers, researchers, and supporters to grow. It takes 2 minutes to sign up.</span>',
      '    <span class="es-text">Estás explorando esta guía — eso significa que te importa. Somos voluntarios y necesitamos traductores, diseñadores, investigadores y personas de apoyo para crecer. Registrarte toma 2 minutos.</span>',
      '  </p>',
      '  <a href="#get-involved" class="engage-modal__cta" id="engage-cta">',
      '    <span class="en-text">Support this volunteer-led work 🦋</span>',
      '    <span class="es-text">Apoya este trabajo voluntario 🦋</span>',
      '  </a>',
      '  <button class="engage-modal__skip" id="engage-skip">',
      '    <span class="en-text">Maybe later</span>',
      '    <span class="es-text">Quizás después</span>',
      '  </button>',
      '</div>'
    ].join('\n');
    document.body.appendChild(el);

    // Apply current language state
    var lang = document.body.classList.contains('lang-es') ? 'es' : 'en';
    applyLangToModal(lang);

    // Wire close/skip/cta
    document.getElementById('engage-close').addEventListener('click', closeModal);
    document.getElementById('engage-skip').addEventListener('click', closeModal);
    document.getElementById('engage-cta').addEventListener('click', function () {
      closeModal();
      // Smooth scroll to #get-involved
      var target = document.getElementById('get-involved');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Close on overlay click
    el.addEventListener('click', function (e) {
      if (e.target === el) closeModal();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function applyLangToModal(lang) {
    var modal = document.getElementById('engage-overlay');
    if (!modal) return;
    var isEs = (lang === 'es');
    modal.querySelectorAll('.en-text').forEach(function(el){ el.style.display = isEs ? 'none' : ''; });
    modal.querySelectorAll('.es-text').forEach(function(el){ el.style.display = isEs ? '' : 'none'; });
  }

  function openModal() {
    if (dismissed) return;
    var overlay = document.getElementById('engage-overlay');
    if (!overlay) buildModal();
    overlay = document.getElementById('engage-overlay');
    overlay.classList.add('is-open');
    // Focus the CTA for accessibility
    setTimeout(function() {
      var cta = document.getElementById('engage-cta');
      if (cta) cta.focus();
    }, 300);
  }

  function closeModal() {
    dismissed = true;
    var overlay = document.getElementById('engage-overlay');
    if (overlay) overlay.classList.remove('is-open');
  }

  function recordInteraction() {
    if (dismissed) return;
    interactionCount++;
    if (interactionCount >= TRIGGER_THRESHOLD) {
      // Small delay so the user sees their action complete first
      setTimeout(openModal, 600);
    }
  }

  // --- Observe meaningful interactions ---
  document.addEventListener('DOMContentLoaded', function () {

    // 1. Accordion opens
    document.querySelectorAll('.accordion-btn, .accordion-header, [data-accordion]').forEach(function (btn) {
      btn.addEventListener('click', recordInteraction);
    });

    // 2. State selector changes (work.html)
    var stateSelect = document.getElementById('state-select');
    if (stateSelect) stateSelect.addEventListener('change', recordInteraction);

    // 3. Clicks on resource links inside content tiles/cards
    document.querySelectorAll('.tile a, .card a, .resource-link, .info-card a').forEach(function (a) {
      a.addEventListener('click', recordInteraction);
    });

    // 4. Phrase table / language toggle presses (teens.html)
    document.querySelectorAll('.phrase-tab, .lang-toggle-btn, #lang-toggle').forEach(function (btn) {
      btn.addEventListener('click', recordInteraction);
    });

    // Keep modal language in sync if user toggles EN/ES
    var langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        var lang = document.body.classList.contains('lang-es') ? 'es' : 'en';
        applyLangToModal(lang);
      });
    }
  });
})();
