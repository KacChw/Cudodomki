import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Inicjalizacja Firebase (Twoja konfiguracja)
const firebaseConfig = {
  apiKey: "AIzaSyAO6W4-rLOYqVyrcHdbKlMd6BZAAqYDWQI",
  authDomain: "cudodomki.firebaseapp.com",
  projectId: "cudodomki",
  storageBucket: "cudodomki.firebasestorage.app",
  messagingSenderId: "854596007648",
  appId: "1:854596007648:web:5c62f53622f81e78814285"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- KALENDARZ & OBSŁUGA REZERWACJI FIREBASE ---
const calendarTitle = document.querySelector('#calendar-title');
const calendarDays = document.querySelector('#calendar-days');
const calendarSelect = document.querySelector('#cabin-calendar');

if (calendarTitle && calendarDays && calendarSelect) {
  const calendarState = { year: 2026, month: 6 }; // Lipiec 2026 (miesiące 0-11)

  const dateKey = (year, month, day) => 
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Pobieranie ZATWIERDZONYCH rezerwacji z Firestore
  const fetchApprovedBookings = async (cabin) => {
    const approvedBookings = [];
    try {
      const q = query(
        collection(db, "bookings"),
        where("cabin", "==", cabin),
        where("status", "==", "approved")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        approvedBookings.push(doc.data());
      });
    } catch (error) {
      console.error("Błąd podczas pobierania rezerwacji:", error);
    }
    return approvedBookings;
  };

  // Renderowanie kalendarza z podziałem na pół-dni
  const renderCalendar = async () => {
    const { year, month } = calendarState;
    const cabin = calendarSelect.value;
    
    const monthName = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
    calendarTitle.textContent = monthName;
    calendarDays.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">Ładowanie...</p>';

    const activeBookings = await fetchApprovedBookings(cabin);
    calendarDays.innerHTML = '';

    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Puste pola na początku miesiąca
    for (let empty = 0; empty < firstDay; empty += 1) {
      calendarDays.insertAdjacentHTML('beforeend', '<span class="calendar-day empty"></span>');
    }

    // Generowanie dni
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateStr = dateKey(year, month, day);
      
      let isCheckIn = false;
      let isCheckOut = false;
      let isFullBooked = false;

      activeBookings.forEach((b) => {
        if (dateStr === b.startDate) isCheckIn = true;
        else if (dateStr === b.endDate) isCheckOut = true;
        else if (dateStr > b.startDate && dateStr < b.endDate) isFullBooked = true;
      });

      let classes = ['calendar-day'];
      if (isFullBooked) {
        classes.push('booked');
      } else {
        if (isCheckIn) classes.push('check-in');
        if (isCheckOut) classes.push('check-out');
        if (!isCheckIn && !isCheckOut) classes.push('free');
      }

      calendarDays.insertAdjacentHTML('beforeend', `<span class="${classes.join(' ')}">${day}</span>`);
    }
  };

  document.querySelector('#calendar-prev').addEventListener('click', () => {
    calendarState.month -= 1;
    if (calendarState.month < 0) { calendarState.month = 11; calendarState.year -= 1; }
    renderCalendar();
  });

  document.querySelector('#calendar-next').addEventListener('click', () => {
    calendarState.month += 1;
    if (calendarState.month > 11) { calendarState.month = 0; calendarState.year += 1; }
    renderCalendar();
  });

  calendarSelect.addEventListener('change', renderCalendar);
  renderCalendar();
}

// --- OBSŁUGA FORMULARZA REZERWACJI ---
const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formMsg = bookingForm.querySelector('.form-message');
    formMsg.textContent = 'Wysyłanie zapytania...';

    const inputs = bookingForm.elements;
    const startDate = inputs[0].value; // Przyjazd
    const endDate = inputs[1].value;   // Wyjazd
    const cabinRaw = inputs[2].value;  // Wybrany domek
    const guests = inputs[3].value;    // Osoby
    const email = inputs[4].value;     // E-mail

    // Mapowanie nazwy z formularza na klucz domku
    let cabin = 'woszczele';
    if (cabinRaw.includes('Mrozy')) cabin = 'mrozy';
    if (cabinRaw.includes('Loft')) cabin = 'loft';

    try {
      await addDoc(collection(db, "bookings"), {
        startDate,
        endDate,
        cabin,
        guests,
        email,
        status: "pending", // Nowe zgłoszenie wymaga Twojej akceptacji!
        createdAt: new Date()
      });

      formMsg.textContent = 'Dziękujemy! Wniosek został wysłany. Oczekuje na potwierdzenie gospodarza.';
      bookingForm.reset();
    } catch (err) {
      console.error(err);
      formMsg.textContent = 'Błąd podczas wysyłania. Spróbuj ponownie.';
    }
  });
}

// --- LOGIKA NAWIGACJI MOBILNEJ ---
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

const activateCabinTab = (cabinKey) => {
  cabinTabBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === cabinKey);
  });
  cabinDetailPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === `detail-${cabinKey}`);
  });
};

cabinTabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    activateCabinTab(btn.dataset.target);
  });
});

btnPoznajList.forEach((btn) => {
  btn.addEventListener('click', () => {
    const cabinKey = btn.dataset.cabin;
    activateCabinTab(cabinKey);
  });
});

// --- GALERIA ---
const galleryPhotos = [
  // Woszczele
  { src: 'assets/images/bilard.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-02.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-03.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-04.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-05.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-06.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-07.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-08.jpg', category: 'woszczele' },
  { src: 'assets/gallery/foto-09.jpg', category: 'woszczele' },
  // Mrozy
  { src: 'assets/images/mrozy_ogród.jpg', category: 'mrozy' },
  { src: 'assets/images/mrozy_spa.jpg', category: 'mrozy' },
  { src: 'assets/images/mrozy_srodek.jpg', category: 'mrozy' },
  { src: 'assets/images/mrozy_wew.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-14.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-15.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-16.jpg', category: 'mrozy' },
  { src: 'assets/gallery/foto-17.jpg', category: 'mrozy' },
  // Loft
  { src: 'assets/images/loft_bok.jpg', category: 'loft' },
  { src: 'assets/images/loft_jacuzzi.jpeg', category: 'loft' },
  { src: 'assets/images/loft_jacuzzi_niebieskie.jpg', category: 'loft' },
  { src: 'assets/images/loft_sauna.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-24.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-25.jpg', category: 'loft' },
  { src: 'assets/gallery/foto-26.jpg', category: 'loft' }
];

const galleryGrid = document.querySelector('#gallery-grid');
if (galleryGrid) {
  galleryGrid.innerHTML = galleryPhotos.map((photo, index) => `<button class="gallery-thumb" data-photo="${index}" data-category="${photo.category}" aria-label="Otwórz zdjęcie ${index + 1}"><img src="${photo.src}" loading="lazy" alt="Zdjęcie ${index + 1} z galerii Cudodomków" /></button>`).join('');
}

const tabs = document.querySelectorAll('.gallery-tabs button');
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => item.classList.remove('active'));
  tab.classList.add('active');
  const filter = tab.dataset.filter;
  document.querySelectorAll('.gallery-thumb').forEach((thumb) => {
    const match = filter === 'all' || thumb.dataset.category === filter;
    thumb.classList.toggle('hidden', !match);
  });
}));

// // --- FORMULARZ REZERWACJI ---
// const bookingForm = document.querySelector('#booking-form');
// if (bookingForm) {
//   bookingForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     event.currentTarget.querySelector('.form-message').textContent = 'Dziękujemy! Wkrótce wrócimy z odpowiedzią.';
//   });
// }

// --- SLAJDY HERO ---
const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length > 0) {
  let currentSlide = 0;
  setInterval(() => {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  }, 5500);
}

// --- LIGHTBOX ---
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

// // --- KALENDARZ ---
// const calendarTitle = document.querySelector('#calendar-title');
// const calendarDays = document.querySelector('#calendar-days');
// const calendarSelect = document.querySelector('#cabin-calendar');

// if (calendarTitle && calendarDays && calendarSelect) {
//   const calendarState = { year: 2026, month: 6 };
//   const bookings = {
//     woszczele: ['2026-07-16/2026-07-26', '2026-08-08/2026-08-18'],
//     mrozy: ['2026-05-01/2026-05-03', '2026-06-04/2026-06-07'],
//     loft: ['2026-07-04/2026-07-11', '2026-08-15/2026-08-22'],
//   };
//   const dateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//   const isBooked = (date) => {
//     const periodList = bookings[calendarSelect.value] || [];
//     return periodList.some((period) => {
//       const [start, end] = period.split('/');
//       return date >= start && date <= end;
//     });
//   };
//   const renderCalendar = () => {
//     const { year, month } = calendarState;
//     const monthName = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
//     calendarTitle.textContent = monthName;
//     calendarDays.innerHTML = '';
//     const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     for (let empty = 0; empty < firstDay; empty += 1) calendarDays.insertAdjacentHTML('beforeend', '<span class="calendar-day empty"></span>');
//     for (let day = 1; day <= daysInMonth; day += 1) {
//       const date = dateKey(year, month, day);
//       calendarDays.insertAdjacentHTML('beforeend', `<span class="calendar-day ${isBooked(date) ? 'booked' : 'free'}">${day}</span>`);
//     }
//   };
//   document.querySelector('#calendar-prev').addEventListener('click', () => { calendarState.month -= 1; if (calendarState.month < 0) { calendarState.month = 11; calendarState.year -= 1; } renderCalendar(); });
//   document.querySelector('#calendar-next').addEventListener('click', () => { calendarState.month += 1; if (calendarState.month > 11) { calendarState.month = 0; calendarState.year += 1; } renderCalendar(); });
//   calendarSelect.addEventListener('change', renderCalendar);
//   renderCalendar();
// }

// --- DYNAMICZNA MAPA GOOGLE ---
const mapButtons = document.querySelectorAll('.map-btn');
const mapFrame = document.querySelector('#contact-map-frame');
const mapExternalLink = document.querySelector('#map-link-external');

if (mapButtons.length > 0 && mapFrame) {
  mapButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      mapButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const lat = btn.dataset.lat;
      const lng = btn.dataset.lng;

      mapFrame.src = `https://www.google.com/maps?q=${lat},${lng}&z=13&output=embed`;
      if (mapExternalLink) {
        mapExternalLink.href = `https://maps.google.com/?q=${lat},${lng}`;
      }
    });
  });
}

// // --- TEST POŁĄCZENIA Z FIREBASE ---
// async function testFirebaseConnection() {
//   try {
//     const docRef = await addDoc(collection(db, "test_connection"), {
//       message: "Połączenie działa!",
//       timestamp: new Date()
//     });
//     console.log("%c SUCCESS: Połączenie z Firebase działa! ID dokumentu: " + docRef.id, "color: green; font-size: 14px; font-weight: bold;");
//   } catch (error) {
//     console.error("%c ERROR: Błąd połączenia z Firebase:", "color: red; font-size: 14px; font-weight: bold;", error);
//   }
// }

// testFirebaseConnection();