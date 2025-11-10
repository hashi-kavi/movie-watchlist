import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import API from '../api'

export default function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchMovieDetails()
    checkWatchlistStatus()
  }, [id])

  const fetchMovieDetails = async () => {
    try {
      const res = await API.get(`/tmdb/movie/${id}`)
      setMovie(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching movie details:', err)
      setError(err.response?.data?.message || 'Failed to fetch movie details')
      setLoading(false)
    }
  }

  const checkWatchlistStatus = async () => {
    try {
      const res = await API.get('/watchlist')
      const watchlistIds = res.data.watchlist.map(m => m.tmdbId)
      setIsInWatchlist(watchlistIds.includes(parseInt(id)))
    } catch (err) {
      console.error('Error checking watchlist:', err)
    }
  }

  const handleWatchlistAction = async () => {
    if (!movie) return
    setActionLoading(true)

    try {
      if (isInWatchlist) {
        await API.delete(`/watchlist/${id}`)
        setIsInWatchlist(false)
      } else {
        await API.post('/watchlist', {
          tmdbId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          overview: movie.overview
        })
        setIsInWatchlist(true)
      }
    } catch (err) {
      console.error('Watchlist action failed:', err)
      setError(err.response?.data?.message || 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Movie not found'}</div>
          <button 
            onClick={() => navigate('/search')} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
          >
            Back to Search
          </button>
        </div>
      </div>
    )
  }

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : null

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` 
    : null

  return (
    <div className="min-h-screen relative">
      {/* Backdrop Background */}
      {backdropUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-lg text-white transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Poster */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            {posterUrl ? (
              <img 
                src={posterUrl} 
                alt={movie.title}
                className="w-full max-w-md mx-auto rounded-xl shadow-2xl"
              />
            ) : (
              <div className="w-full max-w-md mx-auto h-96 bg-gray-800 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">No Poster Available</span>
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {movie.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.vote_average?.toFixed(1)}/10
                </span>
                {movie.release_date && (
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                )}
                {movie.runtime && (
                  <span>{movie.runtime} min</span>
                )}
              </div>
            </div>

            {/* Overview */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span 
                      key={genre.id}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Release Date */}
            {movie.release_date && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Release Date</h3>
                <p className="text-gray-300">
                  {new Date(movie.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Watchlist Button */}
            <motion.button
              onClick={handleWatchlistAction}
              disabled={actionLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2
                ${isInWatchlist 
                  ? 'bg-red-600 hover:bg-red-500 text-white' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
                }
                ${actionLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}
              `}
            >
              {actionLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isInWatchlist ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    )}
                  </svg>
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}