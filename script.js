// Smooth scroll (enhances default behavior)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMenu();
    }
  });
});

// Mobile menu toggle
const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.navbar');
function closeMenu() {
  nav.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}
btn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
});

// Scrollspy (active link)
const sections = [...document.querySelectorAll('section[id]')];
const links = [...document.querySelectorAll('.nav-link')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = '#' + entry.target.id;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
sections.forEach(s => spy.observe(s));

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Typing effect (cycles phrases)
const typingEl = document.querySelector('.typing');
if (typingEl) {
  const phrases = JSON.parse(typingEl.dataset.text || '[]');
  let i = 0, j = 0, deleting = false;
  function type() {
    if (!phrases.length) return;
    const word = phrases[i];
    typingEl.textContent = deleting ? word.slice(0, j--) : word.slice(0, j++);
    if (!deleting && j > word.length + 6) deleting = true;
    else if (deleting && j < 0) { deleting = false; i = (i + 1) % phrases.length; }
    setTimeout(type, deleting ? 60 : 90);
  }
  type();
}

// Stats counters
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target || 0;
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => {
        n += step;
        if (n >= target) { el.textContent = target; }
        else { el.textContent = n; requestAnimationFrame(tick); }
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObserver.observe(c));

// Subtle tilt effect on project cards
document.querySelectorAll('.tilt').forEach(card => {
  let bounds;
  const damp = 20; // smaller -> stronger rotation
  function set(e) {
    bounds = bounds || card.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((e.clientY - bounds.top) / bounds.height - 0.5) * 2;
    card.style.transform = `rotateX(${-y * damp}deg) rotateY(${x * damp}deg)`;
  }
  function clear() { card.style.transform = ''; bounds = null; }
  card.addEventListener('mousemove', set);
  card.addEventListener('mouseleave', clear);
  card.addEventListener('touchstart', clear, { passive: true });
});

// Back to top
const toTop = document.querySelector('.to-top');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 700);
});
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form submission feedback
const contactForm = document.querySelector('.contact-form');

contactForm?.addEventListener('submit', () => {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
  }
});