const birthdayConfig = {
  name: 'Ojal',
  birthday: '2026-09-26T10:00:00',
  gallery: [
    { title: 'A little sunshine', image: '', color: 'coral' },
    { title: 'Curious eyes', image: '', color: 'mint' },
    { title: 'Little adventures', image: '', color: 'lilac' },
    { title: 'The sweetest laugh', image: '', color: 'butter' },
    { title: 'Big birthday energy', image: '', color: 'peach' },
    { title: 'Cuddles & joy', image: '', color: 'coral' },
    { title: 'Growing beautifully', image: '', color: 'mint' },
    { title: 'Our little star', image: '', color: 'lilac' }
  ]
};

const gallery = document.querySelector('#gallery');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');

birthdayConfig.gallery.forEach((memory, index) => {
  const button = document.createElement('button');
  button.className = `gallery-card ${index === 0 || index === 5 ? 'tall' : ''}`;
  button.type = 'button';
  button.setAttribute('aria-label', `View memory: ${memory.title}`);
  if (memory.image) {
    button.innerHTML = `<img src="${memory.image}" alt="${memory.title}" loading="lazy">`;
  } else {
    button.innerHTML = `<div class="gallery-placeholder"><span>${index % 3 === 0 ? 'O' : index % 3 === 1 ? '♥' : '✦'}</span></div>`;
  }
  button.addEventListener('click', () => {
    if (memory.image) {
      lightboxImage.src = memory.image;
      lightboxImage.alt = memory.title;
      lightboxImage.hidden = false;
    } else {
      lightboxImage.hidden = true;
    }
    lightboxCaption.textContent = memory.title;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
  gallery.appendChild(button);
});

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}
document.querySelector('#lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeLightbox(); });

const countdownTarget = new Date(birthdayConfig.birthday).getTime();
function updateCountdown() {
  const remaining = countdownTarget - Date.now();
  if (remaining <= 0) {
    document.querySelector('#countdown').innerHTML = '<p class="birthday-today">Today is Ojal\'s special day! 🎂✦</p>';
    return;
  }
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  ['days', 'hours', 'minutes', 'seconds'].forEach((id, index) => { document.querySelector(`#${id}`).textContent = String(values[index]).padStart(2, '0'); });
}
updateCountdown();
setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const nav = document.querySelector('.site-nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 25), { passive: true });
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => { const open = navLinks.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', open); });
navLinks.addEventListener('click', event => { if (event.target.tagName === 'A') { navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); } });

const rsvpForm = document.querySelector('#rsvp-form');
const rsvpStatus = document.querySelector('#rsvp-status');
const attendingCount = document.querySelector('#attending-count');
async function loadAttendingCount() {
  try {
    const response = await fetch('/api/rsvps/count');
    if (!response.ok) throw new Error('Count unavailable');
    attendingCount.textContent = (await response.json()).attending;
  } catch (error) {
    attendingCount.textContent = '♡';
  }
}
rsvpForm.addEventListener('submit', async event => {
  event.preventDefault();
  const formData = new FormData(rsvpForm);
  const payload = { name: formData.get('name'), attending: formData.get('attending') === 'true', guests: Number(formData.get('guests')), message: formData.get('message') };
  rsvpStatus.textContent = 'Saving your RSVP...';
  try {
    const response = await fetch('/api/rsvps', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Could not save RSVP');
    rsvpStatus.textContent = result.message;
    rsvpForm.reset();
    loadAttendingCount();
  } catch (error) {
    rsvpStatus.textContent = 'RSVP is available when the Spring Boot backend is running locally.';
  }
});
loadAttendingCount();

document.querySelector('#wish-button').addEventListener('click', event => {
  document.querySelector('#wish-message').textContent = 'Make a wish, Ojal! ✨';
  event.currentTarget.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 500 });
  for (let index = 0; index < 18; index += 1) {
    const spark = document.createElement('span');
    spark.textContent = index % 2 ? '✦' : '♥';
    spark.style.cssText = `position:fixed;left:${45 + Math.random() * 10}%;top:${48 + Math.random() * 8}%;z-index:30;color:${index % 2 ? '#e98d78' : '#f7dfa1'};font-size:${12 + Math.random() * 18}px;pointer-events:none;`;
    document.body.appendChild(spark);
    spark.animate([{ transform: 'translate(0,0) scale(.3)', opacity: 1 }, { transform: `translate(${(Math.random() - .5) * 260}px,${-80 - Math.random() * 220}px) scale(1)`, opacity: 0 }], { duration: 1100, easing: 'cubic-bezier(.2,.8,.3,1)' }).finished.then(() => spark.remove());
  }
});

const musicToggle = document.querySelector('#music-toggle');
let music;
try { music = new Audio('/audio/birthday-song.mp3'); music.loop = true; } catch (error) { music = null; }
musicToggle.addEventListener('click', async () => {
  if (!music) return;
  if (music.paused) {
    try { await music.play(); musicToggle.innerHTML = 'Ⅱ <span>Pause</span>'; } catch (error) { musicToggle.title = 'Add /audio/birthday-song.mp3 to enable music'; }
  } else { music.pause(); musicToggle.innerHTML = '♪ <span>Music</span>'; }
});
