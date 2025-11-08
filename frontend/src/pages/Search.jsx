import React, { useState, useEffect } from 'react'
import API from '../api'
import MovieCard from '../components/MovieCard'

export default function Search(){
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [watchlistIds, setWatchlistIds] = useState(new Set())
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWatchlist()
  }, [])

  async function fetchWatchlist(){
    try{
      const res = await API.get('/watchlist')
      const ids = new Set(res.data.watchlist.map(m => m.tmdbId))
      setWatchlistIds(ids)
    }catch(err){
      console.error(err)
    }
  }

  async function search(e){
    e && e.preventDefault()
    setError('')
    if (!query) return
    try{
      // Call backend TMDb proxy so the key is not exposed client-side
      const res = await API.get('/tmdb/search', { params: { query } })
      setResults(res.data.results || [])
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || 'Search failed')
    }
  }

  async function addMovie(movie){
    try{
      await API.post('/watchlist', { tmdbId: movie.id, title: movie.title, posterPath: movie.poster_path, overview: movie.overview })
      // update local watchlist ids set
      setWatchlistIds(prev => new Set(prev).add(movie.id))
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || 'Add failed')
    }
  }

  return (
    <div>
      <form onSubmit={search} className="mb-6 flex gap-2">
        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="Search movies..."
          className="flex-1 bg-gray-800/50 border border-gray-600 text-gray-100 placeholder-gray-400 px-4 py-2 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"/>
        <button className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">Search</button>
      </form>

      {error && <div className="text-red-400 bg-red-900/30 p-2 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(m=> (
          <MovieCard key={m.id} movie={m} onAdd={addMovie} isInWatchlist={watchlistIds.has(m.id)} />
        ))}
      </div>
    </div>
  )
}
