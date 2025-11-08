import React, { useState, useEffect } from 'react'
import API from '../api'
import MovieCard from '../components/MovieCard'

export default function Watchlist(){
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => { fetchWatchlist() }, [])

  async function fetchWatchlist(){
    try{
      const res = await API.get('/watchlist')
      setWatchlist(res.data.watchlist || [])
    }catch(err){
      console.error(err)
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

  return (
    <div>
      <h2 className="text-2xl mb-4">Your Watchlist</h2>
      <div className="space-y-4">
        {watchlist.length === 0 && <div>No movies yet. Search and add some!</div>}
        {watchlist.map(m=> (
          <MovieCard key={m.tmdbId} movie={m} onRemove={removeMovie} />
        ))}
      </div>
    </div>
  )
}

