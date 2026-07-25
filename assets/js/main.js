/* ============================================
   JNDX Portfolio — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  const CONFIG = {
    typingWords: ['AI Systems', 'Web Apps', 'Smart Tools', 'Clean UI', 'Automation', 'Open Source'],
    typingSpeed: 100,
    typingDeleteSpeed: 60,
    typingPause: 2000,
    scrollRevealThreshold: 0.15,
    FORMSPREE_URL: '',
  };

  /* ---------- UTILS ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- LOADER ---------- */
  function initLoader() {
    const loader = $('#loader');
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
  }

  /* ---------- THEME ---------- */
  function initTheme() {
    const toggle = $('#themeToggle');
    const stored = localStorage.getItem('jndx-theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('jndx-theme', next);
    });
  }

  /* ---------- NAVBAR ---------- */
  function initNavbar() {
    const navbar = $('#navbar');
    const hamburger = $('#navHamburger');
    const links = $('#navLinks');
    const navLinkEls = $$('.nav-link');

    /* scroll class */
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    /* hamburger */
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      links.classList.toggle('active');
    });

    /* close on link click */
    navLinkEls.forEach(a => a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      links.classList.remove('active');
    }));

    /* active link on scroll */
    const sections = $$('section[id]');
    function updateActive() {
      const scrollY = window.scrollY + 120;
      sections.forEach(s => {
        const top = s.offsetTop;
        const h = s.offsetHeight;
        const id = s.getAttribute('id');
        const link = $(`.nav-link[href="#${id}"]`);
        if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
      });
    }
    window.addEventListener('scroll', updateActive);
    updateActive();
  }

  /* ---------- TYPING EFFECT ---------- */
  function initTyping() {
    const el = $('#typingText');
    if (!el) return;
    const words = CONFIG.typingWords;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
      const word = words[wordIndex];
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      el.textContent = word.substring(0, charIndex);

      let delay = isDeleting ? CONFIG.typingDeleteSpeed : CONFIG.typingSpeed;

      if (!isDeleting && charIndex === word.length) {
        delay = CONFIG.typingPause;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 300;
      }

      setTimeout(tick, delay);
    }

    tick();
  }

  /* ---------- SCROLL REVEAL ---------- */
  function initReveal() {
    const els = $$('.reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: CONFIG.scrollRevealThreshold });

    els.forEach(el => observer.observe(el));
  }

  /* ---------- STAT COUNTER ---------- */
  function initCounters() {
    const counters = $$('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  function animateCounter(el, target) {
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current;
    }, 30);
  }

  /* ---------- PROJECTS ---------- */
  function initProjects() {
    const grid = $('#projectsGrid');
    const filterBtns = $$('.filter-btn');
    let allProjects = [];

    fetch('assets/data/projects.json')
      .then(r => r.json())
      .then(data => {
        allProjects = data;
        renderProjects(allProjects);
      })
      .catch(() => {
        grid.innerHTML = '<p class="loading-text">Could not load projects.</p>';
      });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        const filtered = filter === 'all' ? allProjects : allProjects.filter(p => p.tags.includes(filter));
        renderProjects(filtered);
      });
    });

    function renderProjects(projects) {
      if (!projects.length) {
        grid.innerHTML = '<p class="loading-text">No projects found.</p>';
        return;
      }
      grid.innerHTML = projects.map(p => `
        <div class="project-card reveal-up revealed">
          <div class="project-card-image">
            <i class="fas fa-${getProjectIcon(p.tags)}"></i>
          </div>
          <div class="project-card-body">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <div class="project-tags">
              ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
            </div>
            <div class="project-links">
              ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="project-link"><i class="fab fa-github"></i> Code</a>` : ''}
              ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" class="project-link"><i class="fas fa-arrow-up-right-from-square"></i> Live</a>` : ''}
            </div>
          </div>
        </div>
      `).join('');
    }

    function getProjectIcon(tags) {
      if (tags.includes('AI')) return 'brain';
      if (tags.includes('React') || tags.includes('TypeScript')) return 'code';
      if (tags.includes('Python')) return 'terminal';
      return 'cube';
    }
  }

  /* ---------- CONTACT FORM ---------- */
  function initContactForm() {
    const form = $('#contactForm');
    const status = $('#formStatus');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!CONFIG.FORMSPREE_URL) {
        const data = new FormData(form);
        status.className = 'form-status success';
        status.textContent = `Thanks ${data.get('name')}! Your message has been received. (Set FORMSPREE_URL in main.js to enable email delivery.)`;
        form.reset();
        setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
        return;
      }

      try {
        const data = new FormData(form);
        const res = await fetch(CONFIG.FORMSPREE_URL, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          status.className = 'form-status success';
          status.textContent = 'Message sent successfully!';
          form.reset();
        } else {
          throw new Error('Failed');
        }
      } catch {
        status.className = 'form-status error';
        status.textContent = 'Something went wrong. Please try again.';
      }

      setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
    });
  }

  /* ---------- BACK TO TOP ---------- */
  function initBackToTop() {
    const btn = $('#backToTop');
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- INIT ---------- */
  initLoader();
  initTheme();
  initNavbar();
  initTyping();
  initReveal();
  initCounters();
  initProjects();
  initContactForm();
  initBackToTop();

})();
