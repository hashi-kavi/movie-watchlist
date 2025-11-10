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
    navigate(`/movie/${movie.id}`)
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }} 
      className="relative bg-gradient-to-b from-white/5 to-white/2 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-white/10 group"
    >
      <div className="relative w-full cursor-pointer" onClick={handleSeeDetails}>
        {imgBase ? (
          <img src={imgBase} alt={title} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-64 bg-gray-800 flex items-center justify-center text-gray-500">No image</div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* See Details Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg font-medium"
          >
            See Details
          </motion.button>
        </div>

        {/* Movie Info */}
        <div className="absolute left-4 bottom-4 right-4">
          <div className="text-white mb-3">
            <h3 className="text-lg font-semibold leading-tight mb-1">{title}</h3>
            <div className="text-xs text-gray-300 flex items-center gap-2">
              <span>{year}</span>
              <span>•</span>
              <span className="text-yellow-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating.toFixed ? rating.toFixed(1) : rating}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onAdd && !isInWatchlist && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onAdd(movie)
                }} 
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
              </motion.button>
            )}
            {onRemove && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(movie)
                }} 
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Remove
              </motion.button>
            )}
            {isInWatchlist && !onRemove && (
              <div className="px-3 py-1 bg-green-600/20 border border-green-600/30 text-green-400 rounded-lg text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Watchlist
              </div>
            )}
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
          <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating.toFixed ? rating.toFixed(1) : rating}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
