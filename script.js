document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }));
    document.addEventListener('click', event => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  const copyButton = document.getElementById('copyEmail');
  const toast = document.getElementById('toast');
  if (copyButton) copyButton.addEventListener('click', async () => {
    const email = 'ojaswasrivastava05192876@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      toast.textContent = 'Email address copied';
    } catch {
      toast.textContent = email;
    }
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2200);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-links a');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
  }
});


// Progressive reveal: content remains visible if IntersectionObserver is unavailable.
document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll(
    '.section-heading, .about-main, .mini-card, .experience-item, .skill-card, .tool-logo, .project-card, .process-card, .education-card, .certificate-card, .faq-intro, .faq-item'
  );
  revealTargets.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
  });
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }
});


// ===== v2 effects =====
document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s), body = document.body;
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  document.querySelectorAll('.hero-copy>*').forEach((c, i) => c.style.setProperty('--i', i));
  document.querySelectorAll('.tag-list,.project-tags').forEach(l => [...l.children].forEach((s, i) => s.style.setProperty('--i', i)));

  // Typed "looking for" line
  const roles = ['Data science internships', 'Data analyst roles', 'AI / ML engineer roles', 'Entry-level full-time roles'], ty = $('#typed');
  function typeLoop() { let r = 0, i = 0, del = false; (function tick() { const w = roles[r]; ty.textContent = w.slice(0, i);
    if (!del && i === w.length) { del = true; return setTimeout(tick, 1700); }
    if (del && i === 0) { del = false; r = (r + 1) % roles.length; }
    i += del ? -1 : 1; setTimeout(tick, del ? 35 : 75); })(); }

  // Count-up for the at-a-glance strip
  function countUp(box) { box.querySelectorAll('[data-count]').forEach(n => { const to = +n.dataset.count, sf = n.dataset.suffix || '', t0 = performance.now();
    (function f(t) { const p = Math.min(1, (t - t0) / 1400); n.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + sf; if (p < 1) requestAnimationFrame(f); })(t0); }); }
  const facts = $('.facts');
  if (facts && 'IntersectionObserver' in window && !calm) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { countUp(facts); o.disconnect(); } }), { threshold: .5 }).observe(facts);

  // Splash curtain, then hero entrance
  const sp = $('#splash'); let started = false;
  function start() { if (started) return; started = true; if (sp) { sp.classList.add('done'); setTimeout(() => sp.classList.add('gone'), 1000); } body.classList.add('ready'); if (!calm) typeLoop(); else ty.textContent = roles[0]; }
  if (calm) start(); else { const t0 = performance.now(); addEventListener('load', () => setTimeout(start, Math.max(0, 1500 - (performance.now() - t0)))); setTimeout(start, 4000); }

  // Sticky header state, scroll progress, back-to-top ring
  const hd = $('.site-header'), pg = $('.progress'), tt = $('#toTop');
  const onScroll = () => { const max = Math.max(1, document.documentElement.scrollHeight - innerHeight), p = scrollY / max;
    hd.classList.toggle('scrolled', scrollY > 24); pg.style.transform = `scaleX(${p})`; tt.style.setProperty('--p', (p * 100).toFixed(1) + '%'); tt.classList.toggle('show', scrollY > 600); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  tt.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

  // Hero data-network background (runs only while the hero is on screen)
  const cv = $('#net');
  if (cv && !calm && innerWidth > 720) {
    const c = cv.getContext('2d'), hero = cv.parentNode; let w = 0, h = 0, P = [], on = false, raf = 0, m = { x: -999, y: -999 };
    const init = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); cv.width = r.width * d; cv.height = r.height * d; c.setTransform(d, 0, 0, d, 0, 0); w = r.width; h = r.height;
      P = [...Array(56)].map(() => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, r: 1.2 + Math.random() * 1.6 })); };
    const frame = () => { c.clearRect(0, 0, w, h);
      for (const p of P) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; }
      for (let i = 0; i < P.length; i++) { const a = P[i];
        for (let j = i + 1; j < P.length; j++) { const b = P[j], d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 120) { c.strokeStyle = `rgba(40,126,174,${(1 - d / 120) * .28})`; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); } }
        const dm = Math.hypot(a.x - m.x, a.y - m.y); if (dm < 150) { c.strokeStyle = `rgba(40,126,174,${(1 - dm / 150) * .55})`; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(m.x, m.y); c.stroke(); }
        c.fillStyle = 'rgba(40,126,174,.55)'; c.beginPath(); c.arc(a.x, a.y, a.r, 0, 6.283); c.fill(); }
      raf = on ? requestAnimationFrame(frame) : 0; };
    const run = v => { on = v && !document.hidden; if (on && !raf) raf = requestAnimationFrame(frame); };
    init(); addEventListener('resize', init);
    new IntersectionObserver(([e]) => run(e.isIntersecting)).observe(hero);
    document.addEventListener('visibilitychange', () => run(true));
    hero.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { m.x = m.y = -999; });
  }

  // Card spotlight, subtle project tilt, magnetic buttons
  if (fine && !calm) {
    document.querySelectorAll('.project-card,.certificate-card').forEach(el => {
      const tilt = el.classList.contains('project-card');
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
        if (tilt) el.style.transform = `perspective(900px) rotateY(${(x / r.width - .5) * 5}deg) rotateX(${-(y / r.height - .5) * 5}deg) translateY(-4px)`; });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    document.querySelectorAll('.button-primary,.button-white,.button-outline').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .18}px ${(e.clientY - r.top - r.height / 2) * .28}px`; });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });
  }
});
