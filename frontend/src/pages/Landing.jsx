import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import API from '../api'

export default function Landing(){
  const [trendingMovies, setTrendingMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { isLoggedIn, loading: authLoading } = useAuth()

  useEffect(() => {
    fetchTrendingMovies()
  }, [])

  const handleStartJourney = () => {
    if (isLoggedIn) {
      navigate('/search')
    } else {
      navigate('/signup')
    }
  }

  const fetchTrendingMovies = async () => {
    try {
      const res = await API.get('/tmdb/trending')
      // Get first 4 trending movies
      setTrendingMovies(res.data.results.slice(0, 4))
      setLoading(false)
    } catch (err) {
      console.error('Error fetching trending movies:', err)
      // Fallback to placeholder movies if API fails
      setTrendingMovies([
        { id: 1, poster_path: "/xRWht48C2V8XNfzvPehyClOvDni.jpg", title: "Dune: Part Two", release_date: "2024-02-27", vote_average: 8.7 },
        { id: 2, poster_path: "/q719jXXEzOoYaps6babgKnONONX.jpg", title: "Oppenheimer", release_date: "2023-07-19", vote_average: 8.3 },
        { id: 3, poster_path: "/kqjL17yufvn9OVLyXYpvtyrFfak.jpg", title: "Spider-Man", release_date: "2022-12-14", vote_average: 8.2 },
        { id: 4, poster_path: "/p9vZ7xV2Zq7M6V1z7I2gq6b1v2x.jpg", title: "The Batman", release_date: "2022-03-01", vote_average: 7.8 }
      ])
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-gray-900/30"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Content */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-white space-y-6"
        >
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Trusted by 10K+ movie lovers</span>
            </motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Your Personal
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Movie Library</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300 leading-relaxed max-w-lg"
          >
            Discover, save, and track your favorite movies from the vast TMDb catalog. Create your personal watchlist and never forget what to watch next.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <motion.button
              onClick={handleStartJourney}
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{isLoggedIn ? 'Go to Search' : 'Start Your Journey'}</span>
              <motion.svg 
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.button>
            
            <Link 
              to="/search" 
              className="px-8 py-4 border border-white/20 hover:border-white/40 rounded-xl text-white/90 font-medium text-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/5 hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Movies
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-3 gap-6 pt-8"
          >
            {['🎬 10M+ Movies', '⭐ Personal Ratings', '📱 Sync Across Devices'].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-gray-400 text-sm font-medium">{feature}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Content - Movie Grid */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          {/* Floating Cards Effect */}
          <div className="relative">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 w-24 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg"
            ></motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -right-4 w-20 h-28 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg"
            ></motion.div>
          </div>

          {/* Main Movie Grid */}
          <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="text-sm font-semibold text-white">Trending Now</div>
              </div>
              <div className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">Updated daily</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {loading ? (
                // Loading skeleton
                [1, 2, 3, 4].map((item) => (
                  <div key={item} className="animate-pulse">
                    <div className="h-40 bg-gray-700/50 rounded-xl"></div>
                    <div className="mt-2 h-4 bg-gray-700/50 rounded"></div>
                  </div>
                ))
              ) : (
                trendingMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-white/10">
                      <div 
                        className="h-40 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: movie.poster_path 
                            ? `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-3">
                        <div className="text-sm font-semibold text-white truncate">{movie.title}</div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-xs text-gray-400">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                          </div>
                          <div className="text-xs text-yellow-400">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Bottom Stats */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              <div className="text-xs text-gray-400">Join thousands of movie enthusiasts</div>
              <div className="flex -space-x-2">
                {[1,2,3].map((item) => (
                  <div key={item} className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full border-2 border-gray-900"></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}