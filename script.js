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

const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
setInterval(() => {
  heroSlides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % heroSlides.length;
  heroSlides[currentSlide].classList.add('active');
}, 5500);

const galleryFull = document.querySelector('#gallery-full');
const galleryPhotos = Array.from({ length: 26 }, (_, index) => `assets/gallery/foto-${String(index + 1).padStart(2, '0')}.jpg`);
galleryFull.innerHTML = galleryPhotos.map((photo, index) => `<button class="gallery-thumb" data-photo="${index}" aria-label="Otwórz zdjęcie ${index + 1}"><img src="${photo}" loading="lazy" alt="Zdjęcie ${index + 1} z galerii Cudodomków" /></button>`).join('');

const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox.querySelector('img');
let activePhoto = 0;
const showPhoto = (index) => {
  activePhoto = (index + galleryPhotos.length) % galleryPhotos.length;
  lightboxImage.src = galleryPhotos[activePhoto];
  lightboxImage.alt = `Zdjęcie ${activePhoto + 1} z galerii Cudodomków`;
};
galleryFull.addEventListener('click', (event) => {
  const button = event.target.closest('.gallery-thumb');
  if (!button) return;
  showPhoto(Number(button.dataset.photo));
  lightbox.showModal();
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(activePhoto + 1));

const calendarTitle = document.querySelector('#calendar-title');
const calendarDays = document.querySelector('#calendar-days');
const calendarSelect = document.querySelector('#cabin-calendar');
const calendarState = { year: 2026, month: 6 };
const bookings = {
  woszczele: ['2026-07-16/2026-07-26', '2026-08-08/2026-08-18'],
  mrozy: ['2026-05-01/2026-05-03', '2026-06-04/2026-06-07'],
  loft: ['2026-07-04/2026-07-11', '2026-08-15/2026-08-22'],
};
const dateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
const isBooked = (date) => bookings[calendarSelect.value].some((period) => {
  const [start, end] = period.split('/');
  return date >= start && date <= end;
});
const renderCalendar = () => {
  const { year, month } = calendarState;
  const monthName = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
  calendarTitle.textContent = monthName;
  calendarDays.innerHTML = '';
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let empty = 0; empty < firstDay; empty += 1) calendarDays.insertAdjacentHTML('beforeend', '<span class="calendar-day empty"></span>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = dateKey(year, month, day);
    calendarDays.insertAdjacentHTML('beforeend', `<span class="calendar-day ${isBooked(date) ? 'booked' : 'free'}">${day}</span>`);
  }
};
document.querySelector('#calendar-prev').addEventListener('click', () => { calendarState.month -= 1; if (calendarState.month < 0) { calendarState.month = 11; calendarState.year -= 1; } renderCalendar(); });
document.querySelector('#calendar-next').addEventListener('click', () => { calendarState.month += 1; if (calendarState.month > 11) { calendarState.month = 0; calendarState.year += 1; } renderCalendar(); });
calendarSelect.addEventListener('change', renderCalendar);
renderCalendar();
