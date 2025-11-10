import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import API from '../api'
import MovieCard from '../components/MovieCard'

export default function Search(){
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [watchlistIds, setWatchlistIds] = useState(new Set())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    if (!query.trim()) return
    
    setLoading(true)
    try{
      // Call backend TMDb proxy so the key is not exposed client-side
      const res = await API.get('/tmdb/search', { params: { query } })
      setResults(res.data.results || [])
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  async function addMovie(movie){
    try{
      await API.post('/watchlist', { 
        tmdbId: movie.id, 
        title: movie.title, 
        posterPath: movie.poster_path, 
        overview: movie.overview 
      })
      // update local watchlist ids set
      setWatchlistIds(prev => new Set(prev).add(movie.id))
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || 'Add failed')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Search Movies</h1>
        <p className="text-gray-400">Discover your next favorite movie from millions of titles</p>
      </motion.div>

      {/* Search Form */}
      <motion.form 
        onSubmit={search} 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex gap-3 max-w-2xl">
          <div className="flex-1 relative">
            <input
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full bg-gray-800/50 border border-gray-600 text-gray-100 placeholder-gray-400 px-4 py-3 pl-10 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <motion.button 
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
            Search
          </motion.button>
        </div>
      </motion.form>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 bg-red-900/30 border border-red-500/30 p-4 rounded-xl mb-6 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </motion.div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MovieCard 
                  movie={movie} 
                  onAdd={addMovie} 
                  isInWatchlist={watchlistIds.has(movie.id)} 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && query && results.length === 0 && !error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No movies found</h3>
          <p className="text-gray-500">Try searching with different keywords</p>
        </motion.div>
      )}

      {/* Initial State */}
      {!loading && !query && results.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <svg className="w-20 h-20 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H7z" />
          </svg>
          <h3 className="text-2xl font-semibold text-gray-300 mb-3">Start Your Movie Discovery</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Search through millions of movies and add your favorites to your personal watchlist
          </p>
        </motion.div>
      )}
    </div>
  )
}
