const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

const tabs = document.querySelectorAll('.gallery-tabs button');
const galleryItems = document.querySelectorAll('.gallery-item');
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => item.classList.remove('active'));
  tab.classList.add('active');
  const filter = tab.dataset.filter;
  galleryItems.forEach((item) => item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter));
}));

document.querySelector('#booking-form').addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.querySelector('.form-message').textContent = 'Dziękujemy! Wkrótce wrócimy z odpowiedzią.';
});
