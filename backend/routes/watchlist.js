const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/watchlist - get current user's watchlist
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/watchlist - add a movie (body must include tmdbId, title, posterPath)
router.post('/', async (req, res) => {
  try {
    const { tmdbId, title, posterPath, overview } = req.body;
    if (!tmdbId) return res.status(400).json({ message: 'tmdbId required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const exists = user.watchlist.find(m => m.tmdbId === tmdbId);
    if (exists) return res.status(400).json({ message: 'Movie already in watchlist' });

    user.watchlist.push({ tmdbId, title, posterPath, overview });
    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/watchlist - remove movie by tmdbId (send { tmdbId })
router.delete('/', async (req, res) => {
  try {
    const { tmdbId } = req.body;
    if (!tmdbId) return res.status(400).json({ message: 'tmdbId required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.watchlist = user.watchlist.filter(m => m.tmdbId !== tmdbId);
    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

