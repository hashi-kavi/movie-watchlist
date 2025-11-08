import React from 'react'
import { motion } from 'framer-motion'

export default function MovieCard({ movie, onAdd, onRemove, isInWatchlist }){
  const title = movie.title || movie.name || 'Untitled'
  const year = (movie.release_date || movie.first_air_date || '').slice(0,4)
  const rating = movie.vote_average || movie.rating || 0
  const imgPath = movie.poster_path || movie.posterPath
  const imgBase = imgPath ? `https://image.tmdb.org/t/p/w500${imgPath}` : null

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative bg-gradient-to-b from-white/3 to-white/2 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
      <div className="relative w-full">
        {imgBase ? (
          <img src={imgBase} alt={title} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-gray-800 flex items-center justify-center text-gray-500">No image</div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-100"></div>

        <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between">
          <div className="text-white">
            <h3 className="text-lg font-semibold leading-tight">{title}</h3>
            <div className="text-xs text-gray-300">{year} • <span className="text-yellow-400">{rating.toFixed ? rating.toFixed(1) : rating}</span></div>
          </div>

          <div className="flex items-center gap-2">
            {onAdd && !isInWatchlist && (
              <button onClick={() => onAdd(movie)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm">Add</button>
            )}
            {onRemove && (
              <button onClick={() => onRemove(movie)} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm">Remove</button>
            )}
          </div>
        </div>

        {/* rating badge */}
        <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded-md flex items-center gap-2">
          <span className="text-xs text-yellow-400 font-semibold">★</span>
          <span className="text-xs text-white">{rating.toFixed ? rating.toFixed(1) : rating}</span>
        </div>

      </div>
    </motion.div>
  )
}
