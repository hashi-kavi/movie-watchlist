const express = require('express')
const router = express.Router()
const axios = require('axios')

// GET /api/tmdb/search?query=...
router.get('/search', async (req, res) => {
  const q = req.query.query || req.query.q
  if (!q) return res.status(400).json({ message: 'query parameter required' })

  const key = process.env.TMDB_API_KEY
  if (!key) return res.status(500).json({ message: 'TMDB API key not configured' })

  try {
    const tmdbRes = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: { api_key: key, query: q }
    })
    res.json(tmdbRes.data)
  } catch (err) {
    console.error('TMDB proxy error', err?.response?.data || err.message)
    res.status(502).json({ message: 'Error fetching from TMDB', details: err?.response?.data || err.message })
  }
})

module.exports = router

