import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function MovieCard({ movie, onAdd, onRemove, isInWatchlist }){
  const navigate = useNavigate()
  const title = movie.title || movie.name || 'Untitled'
  const year = (movie.release_date || movie.first_air_date || '').slice(0,4)
  const rating = movie.vote_average || movie.rating || 0
  const imgPath = movie.poster_path || movie.posterPath
  const imgBase = imgPath ? `https://image.tmdb.org/t/p/w500${imgPath}` : null

  const handleSeeDetails = () => {
    const movieId = movie.id || movie.tmdbId
    navigate(`/movie/${movieId}`)
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

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-semibold text-white">{rating.toFixed ? rating.toFixed(1) : rating}</span>
        </div>

        {/* Movie Info */}
        <div className="absolute left-2 bottom-2 right-2">
          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-1">{title}</h3>
          <div className="text-xs text-gray-300">{year}</div>
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
