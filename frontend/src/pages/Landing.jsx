import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Landing(){
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">Keep track of your favorite movies — beautifully.</h1>
          <p className="text-gray-300 text-lg mb-6">Search the TMDb catalog, save movies to your personal watchlist, and come back anytime to pick up where you left off.</p>
          <div className="flex gap-4">
            <Link to="/signup" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium">Get Started</Link>
            <Link to="/search" className="px-6 py-3 border border-white/10 rounded-lg text-white/90">Browse Movies</Link>
          </div>

          <div className="mt-8 text-sm text-gray-400">Trusted by movie lovers · Secure · Fast</div>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="">
          <div className="bg-gradient-to-br from-white/6 to-white/3 backdrop-blur-md rounded-2xl p-4 shadow-xl">
            <div className="text-xs text-gray-400 mb-2">Trending</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded overflow-hidden">
                <div className="h-36 w-full bg-cover bg-center" style={{backgroundImage: `url(https://image.tmdb.org/t/p/w500//xRWht48C2V8XNfzvPehyClOvDni.jpg)`}}></div>
                <div className="p-2 text-sm text-white">Example Movie • 2024</div>
              </div>
              <div className="rounded overflow-hidden">
                <div className="h-36 w-full bg-cover bg-center" style={{backgroundImage: `url(https://image.tmdb.org/t/p/w500//q719jXXEzOoYaps6babgKnONONX.jpg)`}}></div>
                <div className="p-2 text-sm text-white">Another Title • 2023</div>
              </div>
              <div className="rounded overflow-hidden">
                <div className="h-36 w-full bg-cover bg-center" style={{backgroundImage: `url(https://image.tmdb.org/t/p/w500//kqjL17yufvn9OVLyXYpvtyrFfak.jpg)`}}></div>
                <div className="p-2 text-sm text-white">Popular Film • 2022</div>
              </div>
              <div className="rounded overflow-hidden">
                <div className="h-36 w-full bg-cover bg-center" style={{backgroundImage: `url(https://image.tmdb.org/t/p/w500//p9vZ7xV2Zq7M6V1z7I2gq6b1v2x.jpg)`}}></div>
                <div className="p-2 text-sm text-white">Classic • 2021</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
