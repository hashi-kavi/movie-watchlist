const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const watchlistRoutes = require('./routes/watchlist');
const tmdbRoutes = require('./routes/tmdb');
const verifyAuth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/watchlist', verifyAuth, watchlistRoutes);
app.use('/api/tmdb', tmdbRoutes);

app.get('/api/protected', verifyAuth, (req, res) => {
  res.json({ message: 'This is protected', user: req.user });
});

// lightweight health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
  });
