import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, isLoggedIn } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/search', { replace: true })
    }
  }, [isLoggedIn, navigate])

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    
    if (!email || password.length < 1) {
      setError('Please enter your email and password')
      return
    }
    
    setLoading(true)
    
    try {
      const result = await login(email, password)
      
      if (result.success) {
        navigate('/search', { replace: true })
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-md w-full bg-gradient-to-br from-white/6 via-white/3 to-white/5 backdrop-blur-md border border-white/6 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-2">Welcome back</h2>
        <p className="text-sm text-gray-300 mb-6">Log in to access your watchlist and saved movies.</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 bg-red-900/30 border border-red-500/30 p-3 rounded-lg mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Email</label>
            <input 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="you@domain.com" 
              type="email" 
              disabled={loading}
              className="w-full bg-transparent border border-white/10 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50" 
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Your password" 
                disabled={loading}
                className="w-full bg-transparent border border-white/10 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12 disabled:opacity-50" 
              />
              <button 
                type="button" 
                onClick={()=>setShowPassword(s=>!s)} 
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white disabled:opacity-50"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 py-3 rounded-lg text-white font-medium transition-all duration-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <motion.svg 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </motion.svg>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </motion.button>

          <div className="text-center text-sm text-gray-400">or continue with</div>
          <div className="flex gap-3 justify-center">
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white/6 border border-white/8 rounded-lg text-white hover:bg-white/10 transition-colors">Google</button>
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white/6 border border-white/8 rounded-lg text-white hover:bg-white/10 transition-colors">Apple</button>
          </div>

          <p className="mt-4 text-sm text-center text-gray-400">
            Don't have an account? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">Create one</Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
