import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import API from '../api'
import MovieCard from '../components/MovieCard'

export default function Watchlist(){
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchWatchlist() }, [])

  async function fetchWatchlist(){
    try{
      setLoading(true)
      const res = await API.get('/watchlist')
      setWatchlist(res.data.watchlist || [])
    }catch(err){
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function removeMovie(movie){
    try{
      await API.delete('/watchlist', { data: { tmdbId: movie.tmdbId || movie.id } })
      setWatchlist(prev => prev.filter(m => m.tmdbId !== (movie.tmdbId || movie.id)))
    }catch(err){
      console.error(err)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Your Watchlist
          </h1>
          <p className="text-gray-300 text-lg">
            {watchlist.length === 0 ? 'Start adding movies to your watchlist!' : `${watchlist.length} movie${watchlist.length !== 1 ? 's' : ''} saved`}
          </p>
        </motion.div>

        {/* Empty State */}
        {!loading && watchlist.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full mb-6">
              <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16m10-16v16m-8-8h12" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No movies yet</h3>
            <p className="text-gray-400 mb-8 max-w-sm">Start exploring and add your favorite movies to build your personal watchlist</p>
            <a 
              href="/search" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Discover Movies
            </a>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/5 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Movies Grid */}
        {!loading && watchlist.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
          >
            {watchlist.map(movie => (
              <motion.div
                key={movie.tmdbId || movie.id}
                variants={itemVariants}
              >
                <MovieCard movie={movie} onRemove={removeMovie} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

