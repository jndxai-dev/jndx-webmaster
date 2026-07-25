/* ============================================
   JNDX Portfolio — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  const CONFIG = {
    typingWords: ['AI Architectures', 'Agentic Systems', 'LLM Pipelines', 'MLOps', 'Intelligent Apps', 'AI Strategy'],
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

  /* ---------- NEURAL NETWORK CANVAS ---------- */
  function initNeuralCanvas() {
    const canvas = $('#heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -9999, y: -9999 };
    let animId;

    const CFG = {
      count: 90,
      maxDist: 160,
      speed: 0.35,
      radiusMin: 1,
      radiusMax: 2.8,
      lineAlpha: 0.18,
      particleAlpha: 0.6,
      mouseRadius: 200,
      mouseForce: 0.04,
      hueBase: 80,
      hueRange: 40,
    };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < CFG.count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * CFG.speed * 2,
          vy: (Math.random() - 0.5) * CFG.speed * 2,
          r: CFG.radiusMin + Math.random() * (CFG.radiusMax - CFG.radiusMin),
          hue: CFG.hueBase + Math.random() * CFG.hueRange,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const t = performance.now() * 0.001;

      /* update & draw particles */
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        /* mouse repel */
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CFG.mouseRadius && dist > 0) {
          const force = (CFG.mouseRadius - dist) / CFG.mouseRadius * CFG.mouseForce;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        /* drift */
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;

        /* wrap */
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        /* pulse */
        p.pulse += 0.015;
        const glow = 0.7 + Math.sin(p.pulse) * 0.3;

        /* draw particle */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${CFG.particleAlpha * glow})`;
        ctx.fill();

        /* connections */
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd < CFG.maxDist) {
            const alpha = (1 - dd / CFG.maxDist) * CFG.lineAlpha;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 70%, 65%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      /* mouse glow */
      if (mouse.x > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, CFG.mouseRadius);
        grad.addColorStop(0, `hsla(${CFG.hueBase + CFG.hueRange / 2}, 80%, 70%, 0.06)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - CFG.mouseRadius, mouse.y - CFG.mouseRadius, CFG.mouseRadius * 2, CFG.mouseRadius * 2);
      }

      animId = requestAnimationFrame(draw);
    }

    /* events */
    window.addEventListener('resize', () => { resize(); createParticles(); });
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    /* pause when not visible */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    });

    resize();
    createParticles();
    draw();
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
  initNeuralCanvas();

})();
