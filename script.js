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
document.getElementById("bookingForm").addEventListener("submit", function (e) {
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
});

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

/* ---------- CAR CARD BOOKING → WHATSAPP ---------- */
function bookCar(carName, price) {
  const message =
    `🚘 *Car Booking Request*%0A%0A` +
    `🚗 Car: ${carName}%0A` +
    `💰 Price: ₹${price}%0A%0A` +
    `Please confirm availability.`;

  openWhatsApp(message);
}

/* ---------- SERVICE BOOKING → WHATSAPP ---------- */
function bookService(serviceName) {
  const message =
    `🚖 *Service Enquiry*%0A%0A` +
    `🧾 Service: ${serviceName}%0A%0A` +
    `Please share availability and details.`;

  openWhatsApp(message);
}

/* ---------- OPEN WHATSAPP ---------- */
function openWhatsApp(message) {
  const url = `https://wa.me/${config.primary_whatsapp}?text=${message}`;
  window.open(url, '_blank');
}

/* ---------- DATE RESTRICTION & INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('journeyDate')?.setAttribute('min', today);

  onConfigChange(config);

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
