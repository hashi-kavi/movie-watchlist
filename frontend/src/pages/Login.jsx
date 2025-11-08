import React, { useState } from 'react'
import API from '../api'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    if (!email || password.length < 1) {
      setError('Please enter your email and password')
      return
    }
    setLoading(true)
    try{
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/search')
    }catch(err){
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-md w-full bg-gradient-to-br from-white/6 via-white/3 to-white/5 backdrop-blur-md border border-white/6 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-2">Welcome back</h2>
        <p className="text-sm text-gray-300 mb-6">Log in to access your watchlist and saved movies.</p>

        {error && <div className="text-red-400 bg-red-900/30 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@domain.com" type="email" className="w-full bg-transparent border border-white/10 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Your password" className="w-full bg-transparent border border-white/10 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12" />
              <button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white">{showPassword ? 'Hide' : 'Show'}</button>
            </div>
          </div>

          <button type="submit" className="w-full inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 py-2 rounded-lg text-white font-medium">
            {loading ? <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg> : 'Sign in'}
          </button>

          <div className="text-center text-sm text-gray-400">or continue with</div>
          <div className="flex gap-3 justify-center">
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white/6 border border-white/8 rounded-lg text-white hover:bg-white/10">Google</button>
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white/6 border border-white/8 rounded-lg text-white hover:bg-white/10">Apple</button>
          </div>

          <p className="mt-4 text-sm text-center text-gray-400">Don’t have an account? <Link to="/signup" className="text-indigo-400">Create one</Link></p>
        </form>
      </motion.div>
    </div>
  )
}
