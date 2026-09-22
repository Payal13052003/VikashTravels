/* ---------- CONFIG ---------- */
const defaultConfig = {
  company_name: 'Vikash Travels',
  tagline: 'Your Journey, Our Priority',
  primary_whatsapp: '918770813605', // Primary WhatsApp
  alternate_whatsapp: '919179978779', // Alternate WhatsApp
};

let config = { ...defaultConfig };

/* ---------- UI UPDATE ---------- */
function onConfigChange(updatedConfig) {
  document.body.style.fontFamily = 'Poppins, sans-serif';

  document.getElementById('nav-company-name').textContent =
    updatedConfig.company_name || defaultConfig.company_name;

  document.getElementById('nav-tagline').textContent =
    updatedConfig.tagline || defaultConfig.tagline;

  document.getElementById('footer-company-name').textContent =
    updatedConfig.company_name || defaultConfig.company_name;
}

/* ---------- FORM SUBMIT → WHATSAPP ---------- */
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("journeyDate").value;
    const time = document.getElementById("journeyTime").value;
    if (!source || !destination || !date || !time) {
      alert("Please fill all booking details");
      return;
    }

    if (source === destination) {
      alert("Pickup and Drop location cannot be same");
      return;
    }

    const message =
`🚖 *New Cab Booking Request*

📍 Pickup: ${source}
🎯 Drop: ${destination}
📅 Date: ${date}
⏰ Time: ${time}

Please confirm availability.`;

    const whatsappNumber = "918770813605"; // Your WhatsApp number
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
    openModal(`Your booking from ${source} to ${destination} has been sent. Our team will contact you shortly.`);
  });
}

/* ---------- PREVENT SAME PICKUP & DROP ---------- */
function preventSameLocation() {
  const source = document.getElementById("source")?.value;
  const destination = document.getElementById("destination")?.value;

  if (source && destination && source === destination) {
    alert("Pickup and Drop location cannot be the same");
    document.getElementById("destination").value = "";
  }
}

document.getElementById("source")?.addEventListener("change", preventSameLocation);
document.getElementById("destination")?.addEventListener("change", preventSameLocation);

/* ---------- MODAL HANDLERS ---------- */
function openModal(message) {
  const modal = document.getElementById('bookingModal');
  const modalContent = document.getElementById('modalContent');
  const modalMessage = document.getElementById('modalMessage');

  if (!modal || !modalContent || !modalMessage) return;

  modalMessage.textContent = message;
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  requestAnimationFrame(() => {
    modalContent.classList.remove('scale-95', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
  });
}

function closeModal() {
  const modal = document.getElementById('bookingModal');
  const modalContent = document.getElementById('modalContent');

  if (!modal || !modalContent) return;

  modalContent.classList.add('scale-95', 'opacity-0');
  modalContent.classList.remove('scale-100', 'opacity-100');

  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }, 200);
}

/* ---------- CAR CARD BOOKING → WHATSAPP ---------- */
function bookCar(carName, price) {
  const message =
    `🚘 *Car Booking Request*%0A%0A` +
    `🚗 Car: ${carName}%0A` +
    `💰 Price: ₹${price}%0A%0A` +
    `Please confirm availability.`;

  openWhatsApp(message);
  openModal(`Your request for ${carName} has been sent. Our team will contact you shortly.`);
}

/* ---------- SERVICE BOOKING → WHATSAPP ---------- */
function bookService(serviceName) {
  const message =
    `🚖 *Service Enquiry*%0A%0A` +
    `🧾 Service: ${serviceName}%0A%0A` +
    `Please share availability and details.`;

  openWhatsApp(message);
  openModal(`Your enquiry for ${serviceName} has been sent. Our team will get in touch soon.`);
}

/* ---------- OFFER BOOKING → WHATSAPP ---------- */
function bookOffer(fromCity, toCity) {
  const message =
    `🔥 *Special Offer Request*%0A%0A` +
    `📍 From: ${fromCity}%0A` +
    `🎯 To: ${toCity}%0A%0A` +
    `Please confirm availability and fare.`;

  openWhatsApp(message);
  openModal(`Your travel request from ${fromCity} to ${toCity} has been sent. Our team will contact you soon.`);
}

/* ---------- OPEN WHATSAPP ---------- */
function openWhatsApp(message) {
  const url = `https://wa.me/${config.primary_whatsapp}?text=${message}`;
  window.open(url, '_blank');
}

/* ---------- REVIEW SYSTEM ---------- */
let selectedReviewRating = 0;

const staticReviews = [
  {
    name: 'Sandeep Mishra',
    city: 'Korba',
    rating: 5,
    text: 'The driver arrived on time and the car was clean and comfortable. The whole journey from Korba was smooth.',
    verified: true
  },
  {
    name: 'Neha Gupta',
    city: 'Raipur',
    rating: 5,
    text: 'Booking through WhatsApp was very easy, and the pricing was clear. Excellent service from start to finish.',
    verified: true
  },
  {
    name: 'Ankit Singh',
    city: 'Bilaspur',
    rating: 5,
    text: 'I booked an airport drop and the cab was ready on time. Professional behavior and a very comfortable ride.',
    verified: true
  }
];

const localReviewStorageKey = 'vikashTravelsLocalReviews';

function getLocalReviews() {
  try {
    const savedReviews = JSON.parse(localStorage.getItem(localReviewStorageKey) || '[]');
    return Array.isArray(savedReviews) ? savedReviews : [];
  } catch (error) {
    return [];
  }
}

function saveLocalReview(review) {
  const localReviews = getLocalReviews();
  localReviews.push(review);
  localStorage.setItem(localReviewStorageKey, JSON.stringify(localReviews));
  return localReviews;
}

function renderStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderReviews(reviews) {
  const reviewsList = document.getElementById('reviewsList');
  if (!reviewsList) return;

  if (!Array.isArray(reviews) || reviews.length === 0) {
    reviewsList.innerHTML = '<p class="text-gray-500">No reviews yet. Be the first to share your experience.</p>';
    return;
  }

  reviewsList.innerHTML = reviews
    .slice()
    .reverse()
    .map((review) => `
      <article class="bg-white rounded-2xl p-7 shadow-lg border border-amber-100 hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col">
        <div class="flex items-center justify-between mb-5">
          <span class="text-amber-500 tracking-widest">${renderStars(review.rating)}</span>
          <span class="text-xs font-semibold text-gray-400">${review.verified ? 'Verified ride' : 'Customer review'}</span>
        </div>
          <p class="text-gray-600 leading-relaxed flex-1">“${escapeHtml(review.text)}”</p>
        <div class="border-t border-gray-100 mt-6 pt-5">
          <h3 class="font-bold text-gray-900">${escapeHtml(review.name)}</h3>
          <p class="text-sm text-gray-500">${escapeHtml(review.city)}</p>
        </div>
      </article>
    `)
    .join('');
}

async function fetchReviews() {
  try {
    const response = await fetch('/api/reviews');
    if (!response.ok) throw new Error('Failed to load reviews');
    const reviews = await response.json();
    renderReviews(reviews.length ? reviews : staticReviews);
  } catch (error) {
    console.error(error);
    renderReviews([...staticReviews, ...getLocalReviews()]);
  }
}

function updateRatingUI(value) {
  selectedReviewRating = value;
  const stars = document.querySelectorAll('.star-btn');
  const label = document.getElementById('ratingLabel');

  stars.forEach((button) => {
    const buttonValue = Number(button.dataset.value);
    button.classList.toggle('text-amber-400', buttonValue <= value);
    button.classList.toggle('text-gray-300', buttonValue > value);
  });

  if (label) {
    label.textContent = value > 0 ? `${value} star${value > 1 ? 's' : ''}` : 'No rating selected';
  }
}

async function handleReviewSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('reviewName')?.value.trim();
  const city = document.getElementById('reviewCity')?.value.trim();
  const text = document.getElementById('reviewText')?.value.trim();

  if (!name || !city || !text || selectedReviewRating === 0) {
    alert('Please enter your name, city, review, and rating.');
    return;
  }

  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        city,
        rating: selectedReviewRating,
        text
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit review');
    }

    document.getElementById('reviewForm')?.reset();
    selectedReviewRating = 0;
    updateRatingUI(0);
    await fetchReviews();
    alert('Thank you! Your review has been submitted successfully.');
  } catch (error) {
    console.error(error);
    const localReview = {
      name,
      city,
      rating: selectedReviewRating,
      text,
      verified: false,
      date: new Date().toISOString().split('T')[0]
    };

    saveLocalReview(localReview);
    document.getElementById('reviewForm')?.reset();
    selectedReviewRating = 0;
    updateRatingUI(0);
    renderReviews([...staticReviews, ...getLocalReviews()]);
    alert('Your review was saved on this browser. It will be shared with everyone when the backend is connected.');
  }
}

/* ---------- DATE RESTRICTION & INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('/about.html')) {
    const aboutIntro = document.querySelector('.inner-hero p');
    if (aboutIntro) {
      aboutIntro.textContent = 'Vikash Travels provides reliable cab service across all of Chhattisgarh for people who want travel to feel simple, safe, and well managed.';
    }

    const aboutContent = document.querySelector('.prose-copy');
    if (aboutContent) {
      aboutContent.insertAdjacentHTML('beforeend', `
        <div class="hindi-copy" lang="hi">
          <p>विकाश ट्रैवल्स की शुरुआत इस विचार के साथ हुई कि हर यात्री को साफ वाहन, जिम्मेदार चालक, उचित किराया और समय पर यात्रा मिलनी चाहिए। हम पूरे छत्तीसगढ़ में परिवारों, कर्मचारियों, यात्रियों, विद्यार्थियों, मरीजों और व्यवसायों को शहरों और जिलों के बीच सुरक्षित यात्रा की सुविधा देते हैं।</p>
          <p>हम इस क्षेत्र की यात्रा संबंधी जरूरतों को अच्छी तरह समझते हैं। छोटी स्थानीय यात्रा हो या लंबी आउटस्टेशन यात्रा, हर सफर महत्वपूर्ण होता है। अस्पताल जाना, हवाई अड्डे तक पहुंचना, शादी, पारिवारिक कार्यक्रम या कार्यालय का काम, इन सभी के लिए समय पर और भरोसेमंद वाहन जरूरी होता है। हम यात्री की मंजिल, सामान, यात्रियों की संख्या और वाहन की पसंद के अनुसार बुकिंग तैयार करते हैं।</p>
          <p>हमारी सेवा स्पष्ट बातचीत पर आधारित है। ग्राहक फोन, WhatsApp या बुकिंग फॉर्म के माध्यम से अपनी यात्रा की जानकारी भेज सकते हैं। हमारे चालक अपने व्यवहार, स्थानीय मार्गों की जानकारी और यात्री की सुविधा के लिए चुने जाते हैं। हमारे पास रोजमर्रा की यात्रा के लिए सेडान, आरामदायक प्रीमियम कार और समूह यात्रा के लिए बड़े वाहन उपलब्ध हैं।</p>
          <p>हमारे लिए ग्राहक संतुष्टि का अर्थ है समय पर पिकअप, उपयोगी जानकारी, जिम्मेदारी से वाहन चलाना और यात्री की पूरी यात्रा के दौरान सहायता करना। विकाश ट्रैवल्स का उद्देश्य छत्तीसगढ़ और पूरे भारत में अधिक मार्गों तक सेवा पहुंचाना है, लेकिन अपनी व्यक्तिगत और भरोसेमंद सेवा को बनाए रखना भी उतना ही जरूरी है।</p>
          <p>आप अकेले यात्रा कर रहे हों या पूरे समूह के लिए वाहन बुक कर रहे हों, हम आपकी अगली यात्रा को आसान और आरामदायक बनाने में मदद करने के लिए तैयार हैं।</p>
        </div>
      `);
    }
  }

  const contactBooking = document.querySelector('#booking');
  if (contactBooking && !document.querySelector('.payment-notice')) {
    const bookingHeading = contactBooking.querySelector('h2');
    if (bookingHeading) {
      bookingHeading.insertAdjacentHTML('afterend', `
        <div class="payment-notice mb-6">
          <strong>Payment &amp; Booking Notice</strong>
          <p>We do not collect payment directly through this website. Our team will contact you first to confirm your route, vehicle, availability, and fare. Payment is collected only after the ride is completed.</p>
          <p lang="hi">इस वेबसाइट के माध्यम से सीधे कोई भुगतान नहीं लिया जाता। यात्रा पूरी होने के बाद ही भुगतान लिया जाता है।</p>
        </div>
      `);
    }
  }

  const destinationFromQuery = new URLSearchParams(window.location.search).get('destination');
  const sourceFromQuery = new URLSearchParams(window.location.search).get('from');
  const sourceInput = document.getElementById('source');
  const destinationInput = document.getElementById('destination');
  if (sourceFromQuery && sourceInput) {
    sourceInput.value = sourceFromQuery;
  }
  if (destinationFromQuery && destinationInput) {
    destinationInput.value = destinationFromQuery;
  }

  document.querySelectorAll('a[href="fleet.html"]').forEach((pricingLink) => {
    pricingLink.href = 'city-prices.html';
    pricingLink.textContent = 'Pricing';
  });

  if (window.location.pathname.endsWith('/fleet.html')) {
    document.title = 'Pricing | Vikash Travels';
    const pricingLabel = document.querySelector('.eyebrow');
    if (pricingLabel) pricingLabel.textContent = 'Pricing';
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach((emailLink) => {
    emailLink.href = 'mailto:vikashtravels12@gmail.com?subject=Cab%20Booking%20Enquiry';
    if (emailLink.textContent.trim() === 'vikashtravel@gmail.com') {
      emailLink.textContent = 'vikashtravels12@gmail.com';
    }
  });

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('journeyDate')?.setAttribute('min', today);

  onConfigChange(config);
  fetchReviews();

  const stars = document.querySelectorAll('.star-btn');
  stars.forEach((star) => {
    star.addEventListener('click', () => {
      updateRatingUI(Number(star.dataset.value));
    });
  });

  document.getElementById('reviewForm')?.addEventListener('submit', handleReviewSubmit);
  updateRatingUI(0);

  const animatedItems = document.querySelectorAll('.stagger-grid > *');
  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animatedItems.forEach((item) => animationObserver.observe(item));
  } else {
    animatedItems.forEach((item) => item.classList.add('is-visible'));
  }
});
