const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

const galleryPhotos = [
  // Woszczele
  { src: 'assets/gallery/foto-01.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-02.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-03.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-04.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-05.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-06.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-07.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-08.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-09.jpg', category: 'woszczele' },
  // Mrozy
  { src: 'assets/gallery/foto-10.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-11.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-12.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-13.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-14.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-15.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-16.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-17.jpg', category: 'mrozy' },
  // Loft
  { src: 'assets/gallery/foto-18.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-19.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-20.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-21.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-22.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-23.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-24.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-25.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-26.jpg', category: 'loft' }
];

const galleryGrid = document.querySelector('#gallery-grid');
if (galleryGrid) {
  galleryGrid.innerHTML = galleryPhotos.map((photo, index) => `<button class="gallery-thumb" data-photo="${index}" data-category="${photo.category}" aria-label="Otwórz zdjęcie ${index + 1}"><img src="${photo.src}" loading="lazy" alt="Zdjęcie ${index + 1} z galerii Cudodomków" /></button>`).join('');
}

const tabs = document.querySelectorAll('.gallery-tabs button');
const thumbs = document.querySelectorAll('.gallery-thumb');
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => item.classList.remove('active'));
  tab.classList.add('active');
  const filter = tab.dataset.filter;
  document.querySelectorAll('.gallery-thumb').forEach((thumb) => {
    const match = filter === 'all' || thumb.dataset.category === filter;
    thumb.classList.toggle('hidden', !match);
  });
}));

const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    event.currentTarget.querySelector('.form-message').textContent = 'Dziękujemy! Wkrótce wrócimy z odpowiedzią.';
  });
}

const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length > 0) {
  let currentSlide = 0;
  setInterval(() => {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  }, 5500);
}

const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox ? lightbox.querySelector('img') : null;
let activePhoto = 0;
const showPhoto = (index) => {
  if (!lightboxImage) return;
  activePhoto = (index + galleryPhotos.length) % galleryPhotos.length;
  lightboxImage.src = galleryPhotos[activePhoto].src;
  lightboxImage.alt = `Zdjęcie ${activePhoto + 1} z galerii Cudodomków`;
};

if (galleryGrid && lightbox) {
  galleryGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.gallery-thumb');
    if (!button || button.classList.contains('hidden')) return;
    showPhoto(Number(button.dataset.photo));
    lightbox.showModal();
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(activePhoto + 1));
}

const calendarTitle = document.querySelector('#calendar-title');
const calendarDays = document.querySelector('#calendar-days');
const calendarSelect = document.querySelector('#cabin-calendar');

if (calendarTitle && calendarDays && calendarSelect) {
  const calendarState = { year: 2026, month: 6 };
  const bookings = {
    woszczele: ['2026-07-16/2026-07-26', '2026-08-08/2026-08-18'],
    mrozy: ['2026-05-01/2026-05-03', '2026-06-04/2026-06-07'],
    loft: ['2026-07-04/2026-07-11', '2026-08-15/2026-08-22'],
  };
  const dateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isBooked = (date) => {
    const periodList = bookings[calendarSelect.value] || [];
    return periodList.some((period) => {
      const [start, end] = period.split('/');
      return date >= start && date <= end;
    });
  };
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
}