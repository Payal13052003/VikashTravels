const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'reviews.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function readReviews() {
  try {
    if (!fs.existsSync(dataFile)) {
      const defaultReviews = [
        {
          name: 'Sandeep Mishra',
          city: 'Korba',
          rating: 5,
          text: 'The driver arrived on time and the car was clean and comfortable. The whole journey from Korba was smooth.',
          verified: true,
          date: '2026-01-12'
        },
        {
          name: 'Neha Gupta',
          city: 'Raipur',
          rating: 5,
          text: 'Booking through WhatsApp was very easy, and the pricing was clear. Excellent service from start to finish.',
          verified: true,
          date: '2026-02-04'
        },
        {
          name: 'Ankit Singh',
          city: 'Bilaspur',
          rating: 5,
          text: 'I booked an airport drop and the cab was ready on time. Professional behavior and a very comfortable ride.',
          verified: true,
          date: '2026-03-15'
        }
      ];
      fs.writeFileSync(dataFile, JSON.stringify(defaultReviews, null, 2));
      return defaultReviews;
    }

    const data = fs.readFileSync(dataFile, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading reviews:', error);
    return [];
  }
}

function writeReviews(reviews) {
  fs.writeFileSync(dataFile, JSON.stringify(reviews, null, 2));
}

app.get('/api/reviews', (req, res) => {
  const reviews = readReviews();
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const { name, city, rating, text } = req.body || {};
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanCity = typeof city === 'string' ? city.trim() : '';
  const cleanText = typeof text === 'string' ? text.trim() : '';

  if (!cleanName || !cleanCity || !cleanText || !rating) {
    return res.status(400).json({ error: 'Name, city, text and rating are required.' });
  }

  if (cleanName.length > 80 || cleanCity.length > 80 || cleanText.length > 1000) {
    return res.status(400).json({ error: 'Review fields are too long.' });
  }

  const reviews = readReviews();
  const newReview = {
    name: cleanName,
    city: cleanCity,
    rating: Number(rating),
    text: cleanText,
    verified: false,
    date: new Date().toISOString().split('T')[0]
  };

  if (newReview.rating < 1 || newReview.rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }

  reviews.push(newReview);
  writeReviews(reviews);

  res.status(201).json({ success: true, review: newReview });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
