const WHATSAPP = '919313787913';
const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

// Every [data-msg] link opens WhatsApp with its prefilled message.
document.querySelectorAll('[data-msg]').forEach((a) => {
  a.href = waLink(a.dataset.msg);
  a.target = '_blank';
  a.rel = 'noopener';
});

// Mobile menu
const burger = document.querySelector('.burger');
const navLinks = document.getElementById('nav-links');
const setMenu = (open) => {
  burger.setAttribute('aria-expanded', String(open));
  navLinks.classList.toggle('open', open);
};
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Lead form -> WhatsApp message (no backend; nothing is stored).
function leadMessage(d) {
  return [
    'Hi Varun, I would like a free life insurance consultation.',
    `Name: ${d.name.trim()}`,
    `Mobile: +91 ${d.mobile.trim()}`,
    d.email && `Email: ${d.email.trim()}`,
    d.interest && `Interested in: ${d.interest}`,
    d.message && d.message.trim() && `Message: ${d.message.trim()}`,
  ].filter(Boolean).join('\n');
}
console.assert(
  leadMessage({ name: ' A ', mobile: '9876543210', email: '', interest: 'Term insurance', message: ' ' })
    === 'Hi Varun, I would like a free life insurance consultation.\nName: A\nMobile: +91 9876543210\nInterested in: Term insurance',
  'leadMessage format changed'
);

const form = document.getElementById('lead-form');
const note = document.getElementById('form-note');
form.addEventListener('submit', (e) => {
  e.preventDefault(); // browser has already validated required fields + mobile pattern
  window.open(waLink(leadMessage(Object.fromEntries(new FormData(form)))), '_blank', 'noopener');
  form.reset();
  note.textContent = 'Thank you! WhatsApp has opened with your details. Just press send.';
  note.classList.add('ok');
});

// Solution photos come from Unsplash's CDN: retry once, then hide the photo so the card never shows a broken image.
document.querySelectorAll('.card-photo').forEach((img) => {
  img.addEventListener('error', () => {
    if (img.dataset.retried) { img.hidden = true; return; }
    img.dataset.retried = '1';
    img.removeAttribute('srcset');
    img.src += '&retry=1';
  });
});

// Fade sections in as they scroll into view.
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

document.getElementById('year').textContent = new Date().getFullYear();
