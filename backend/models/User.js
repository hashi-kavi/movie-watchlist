const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true },
  title: String,
  posterPath: String,
  overview: String,
  rating: { type: Number, min: 0, max: 10 },
  watched: { type: Boolean, default: false },
  addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: true },
  watchlist: [MovieSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

