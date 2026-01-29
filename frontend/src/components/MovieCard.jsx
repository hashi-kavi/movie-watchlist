import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import API from '../api'

function Star({ fillPercent = 0 }) {
  return (
    <div className="relative w-4 h-4">
      <svg className="absolute inset-0 w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="absolute left-0 top-0 h-4 overflow-hidden" style={{ width: `${fillPercent}%` }}>
        <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    </div>
  )
}

function StarRating({ value = undefined, onChange, editable = true }) {
  // Render 5 stars, each representing 2 points on a 0–10 scale.
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)

  const getFillForStar = (i) => {
    // i is 1-based star index
    if (value === undefined || value === null) return 0
    // Convert 0–10 user rating to 0–5 star units
    const starUnits = value / 2
    if (starUnits >= i) return 100
    if (starUnits <= i - 1) return 0
    const frac = starUnits - (i - 1) // between 0..1
    return Math.max(0, Math.min(100, frac * 100))
  }

  const handleClick = (e, i) => {
    if (!editable || !onChange) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = e.clientX - rect.left
    const half = relX <= rect.width / 2 ? 0.5 : 1.0
    // Convert 0–5 star units (with halves) to 0–10 rating
    const newUnits = (i - 1) + half
    const newVal = newUnits * 2
    onChange(Number(newVal.toFixed(1)))
  }

  return (
    <div className="flex items-center gap-1">
      {stars.map((i) => (
        <div
          key={i}
          className={`relative ${editable ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={(e) => handleClick(e, i)}
        >
          <Star fillPercent={getFillForStar(i)} />
        </div>
      ))}
    </div>
  )
}

export default function MovieCard({ movie, onAdd, onRemove, isInWatchlist, imdbRating: imdbRatingProp, userRating: userRatingProp }){
  const navigate = useNavigate()
  const title = movie.title || movie.name || 'Untitled'
  const year = (movie.release_date || movie.first_air_date || '').slice(0,4)
  const imgPath = movie.poster_path || movie.posterPath
  const imgBase = imgPath ? `https://image.tmdb.org/t/p/w500${imgPath}` : null

  // Separate ratings
  const imdbRating = useMemo(() => {
    const v = imdbRatingProp ?? movie.vote_average
    return typeof v === 'number' ? Number(v.toFixed(1)) : undefined
  }, [imdbRatingProp, movie.vote_average])

  const [userRating, setUserRating] = useState(
    userRatingProp !== undefined && userRatingProp !== null ? Number(userRatingProp) : undefined
  )

  const handleSeeDetails = () => {
    const movieId = movie.id || movie.tmdbId
    navigate(`/movie/${movieId}`)
  }

  const saveUserRating = async (val) => {
    try {
      const tmdbId = movie.tmdbId || movie.id
      await API.put('/watchlist/rating', { tmdbId, rating: val })
      setUserRating(val)
    } catch (err) {
      console.error('Failed to set rating', err)
    }
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -8 }} 
      className="relative bg-gradient-to-b from-white/5 to-white/2 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-white/10 group cursor-pointer"
      onClick={handleSeeDetails}
    >
      <div className="relative w-full aspect-[2/3]">
        {imgBase ? (
          <img src={imgBase} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Movie Info */}
        <div className="absolute left-2 bottom-2 right-2">
          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-1">{title}</h3>
          <div className="text-xs text-gray-300">{year}</div>
        </div>

        {/* Ratings Panel */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg text-white space-y-1">
          <div className="flex items-center gap-2 text-xs opacity-90">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>IMDb:</span>
            <span className="font-semibold">{typeof imdbRating === 'number' ? imdbRating.toFixed(1) : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-200">Your Rating:</span>
            {userRating === undefined || userRating === null ? (
              <span className="text-xs text-gray-300">Not rated</span>
            ) : (
              <span className="text-xs text-gray-300">{userRating.toFixed ? userRating.toFixed(1) : userRating}</span>
            )}
          </div>
          <div className="mt-1" onClick={(e)=>e.stopPropagation()}>
            <StarRating 
              value={userRating}
              editable={!!isInWatchlist}
              onChange={(val) => saveUserRating(val)}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {onAdd && !isInWatchlist && (
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onAdd(movie)
            }} 
            className="p-2 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-full shadow-lg backdrop-blur-sm transition-colors duration-200"
            title="Add to watchlist"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </motion.button>
        )}
        {onRemove && (
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onRemove(movie)
            }} 
            className="p-2 bg-red-600/90 hover:bg-red-500 text-white rounded-full shadow-lg backdrop-blur-sm transition-colors duration-200"
            title="Remove from watchlist"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
        {isInWatchlist && !onRemove && (
          <div className="p-2 bg-green-600/80 text-white rounded-full shadow-lg backdrop-blur-sm" title="In watchlist">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  )
}
