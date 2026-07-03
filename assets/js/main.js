/* ============================================
   Main Application Script
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------
     1. Theme Toggle
     ------------------------------------------ */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ------------------------------------------
     2. Mobile Nav
     ------------------------------------------ */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true' ? false : true;
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', expanded);
  });

  navAnchors.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------
     3. Active Nav Link (scroll spy)
     ------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('load', updateActiveNav);

  /* ------------------------------------------
     4. Typing Effect
     ------------------------------------------ */
  const typingEl = document.getElementById('typing');
  const words = ['web apps', 'APIs', 'beautiful UIs', 'scalable systems', 'open-source tools'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeTimeout;

  function typeEffect() {
    const currentWord = words[wordIndex];
    if (!isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        typeTimeout = setTimeout(typeEffect, 1800);
        return;
      }
      typeTimeout = setTimeout(typeEffect, 80);
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeTimeout = setTimeout(typeEffect, 400);
        return;
      }
      typeTimeout = setTimeout(typeEffect, 40);
    }
  }

  typeEffect();

  /* ------------------------------------------
     5. Projects (fetch JSON, render, filter)
     ------------------------------------------ */
  const projectsGrid = document.getElementById('projectsGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let projects = [];

  async function loadProjects() {
    try {
      const res = await fetch('assets/data/projects.json');
      if (!res.ok) throw new Error('Failed to load');
      projects = await res.json();
      renderProjects(projects, 'all');
    } catch (err) {
      projectsGrid.innerHTML = `<p class="project-placeholder">Could not load projects. Try again later.</p>`;
    }
  }

  function renderProjects(list, filter) {
    if (!list.length) {
      projectsGrid.innerHTML = `<p class="project-placeholder">No projects found.</p>`;
      return;
    }

    let filtered = list;
    if (filter === 'featured') {
      filtered = list.filter(p => p.featured);
    } else if (filter !== 'all') {
      filtered = list.filter(p => p.tags.includes(filter));
    }

    if (!filtered.length) {
      projectsGrid.innerHTML = `<p class="project-placeholder">No projects match this filter.</p>`;
      return;
    }

    projectsGrid.innerHTML = filtered.map((project, i) => `
      <article class="project-card" style="animation-delay: ${i * 0.08}s">
        <img
          src="${project.image}"
          alt="${project.title}"
          class="project-image"
          loading="lazy"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22><rect fill=%22%231a1a2e%22 width=%22600%22 height=%22400%22/><text fill=%22%23e94560%22 font-size=%2224%22 x=%22200%22 y=%22210%22>${project.title}</text></svg>'"
        />
        <div class="project-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
          </div>
          <div class="project-links">
            <a href="${project.liveUrl}" target="_blank" rel="noopener" class="project-link">
              &#8599; Live Demo
            </a>
            <a href="${project.repoUrl}" target="_blank" rel="noopener" class="project-link">
              &#128193; Source
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(projects, btn.dataset.filter);
    });
  });

  loadProjects();

  /* ------------------------------------------
     6. Contact Form (Formspree)
     ------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // Replace with your Formspree endpoint after signup
  const FORMSPREE_URL = 'https://formspree.io/f/yourFormID';

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = 'Sending...';
    formStatus.className = 'form-status loading';

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        formStatus.textContent = 'Thanks! Your message has been sent.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      formStatus.textContent = 'Could not send. Please email me directly at hello@example.com';
      formStatus.className = 'form-status error';
    }
  });

  /* ------------------------------------------
     7. Back to Top
     ------------------------------------------ */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------
     8. Stats Counter Animation
     ------------------------------------------ */
  const stats = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    stats.forEach(stat => {
      const target = parseInt(stat.dataset.count, 10);
      if (isNaN(target)) return;
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 60));
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target + '+';
          clearInterval(timer);
        } else {
          stat.textContent = current;
        }
      }, 25);
    });
  }

  // Intersection Observer for stats
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(aboutSection);
  }

  /* ------------------------------------------
     9. Footer year
     ------------------------------------------ */
  document.getElementById('year').textContent = new Date().getFullYear();

});
