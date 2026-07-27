
  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAO6W4-rLOYqVyrcHdbKlMd6BZAAqYDWQI",
    authDomain: "cudodomki.firebaseapp.com",
    projectId: "cudodomki",
    storageBucket: "cudodomki.firebasestorage.app",
    messagingSenderId: "854596007648",
    appId: "1:854596007648:web:5c62f53622f81e78814285",
    measurementId: "G-84Z26DF7S6"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


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

// --- OBSŁUGA SEKCJI SZCZEGÓŁÓW DOMKÓW ---
const cabinTabBtns = document.querySelectorAll('.cabin-tab-btn');
const cabinDetailPanels = document.querySelectorAll('.cabin-detail-panel');
const btnPoznajList = document.querySelectorAll('.btn-poznaj');

// Funkcja aktywująca konkretny domek
const activateCabinTab = (cabinKey) => {
  // Przełączanie aktywnego przycisku nad kartą
  cabinTabBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === cabinKey);
  });
  // Przełączanie widocznego panelu z opisem
  cabinDetailPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === `detail-${cabinKey}`);
  });
};

// Kliknięcie bezpośrednio w zakłady nad kartami (Cudodomek Woszczele / SPA Mrozy / SPA Loft)
cabinTabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    activateCabinTab(btn.dataset.target);
  });
});

// Kliknięcie w przyciski "Poznaj →" w kartach powyżej
btnPoznajList.forEach((btn) => {
  btn.addEventListener('click', () => {
    const cabinKey = btn.dataset.cabin;
    activateCabinTab(cabinKey);
  });
});

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

// --- DYNAMICZNA MAPA GOOGLE DLA DOMKÓW ---
const mapButtons = document.querySelectorAll('.map-btn');
const mapFrame = document.querySelector('#contact-map-frame');
const mapExternalLink = document.querySelector('#map-link-external');

if (mapButtons.length > 0 && mapFrame) {
  mapButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Usunięcie klasy active ze wszystkich przycisków i dodanie do klikniętego
      mapButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const lat = btn.dataset.lat;
      const lng = btn.dataset.lng;

      // Zmiana adresu ramki iframe mapy Google
      mapFrame.src = `https://www.google.com/maps?q=${lat},${lng}&z=13&output=embed`;
      
      // Aktualizacja linku zewnętrznego "Otwórz trasę"
      if (mapExternalLink) {
        mapExternalLink.href = `https://maps.google.com/?q=${lat},${lng}`;
      }
    });
  });
}
///import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

// Funkcja testowa
async function testFirebaseConnection() {
  try {
    const docRef = await addDoc(collection(db, "test_connection"), {
      message: "Połączenie działa!",
      timestamp: new Date()
    });
    console.log("%c SUCCESS: Połączenie z Firebase działa! ID dokumentu: " + docRef.id, "color: green; font-size: 14px; font-weight: bold;");
  } catch (error) {
    console.error("%c ERROR: Błąd połączenia z Firebase:", "color: red; font-size: 14px; font-weight: bold;", error);
  }
}

// Uruchomienie testu
testFirebaseConnection();