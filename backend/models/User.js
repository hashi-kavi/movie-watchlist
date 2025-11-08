const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true },
  title: String,
  posterPath: String,
  overview: String
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [MovieSchema]
});

module.exports = mongoose.model('User', UserSchema);

