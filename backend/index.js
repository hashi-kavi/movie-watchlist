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
// lightweight health endpoint with DB status
let dbStatus = { connected: false, lastError: null };
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: dbStatus });
});

const PORT = process.env.PORT || 5000;

// Start the HTTP server immediately so /api/health always responds
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Connect to MongoDB (non-blocking for server startup)
const uri = process.env.MONGO_URI;
if (!uri) {
  dbStatus.lastError = 'MONGO_URI not set';
  console.error('MongoDB connection skipped: MONGO_URI is not configured');
} else {
  mongoose.connect(uri)
    .then(() => {
      dbStatus.connected = true;
      dbStatus.lastError = null;
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      dbStatus.connected = false;
      dbStatus.lastError = err?.message || String(err);
      console.error('MongoDB connection error', err);
    });

  // Track connection state changes
  mongoose.connection.on('connected', () => { dbStatus.connected = true; dbStatus.lastError = null; });
  mongoose.connection.on('error', (err) => { dbStatus.connected = false; dbStatus.lastError = err?.message || String(err); });
  mongoose.connection.on('disconnected', () => { dbStatus.connected = false; });
}
