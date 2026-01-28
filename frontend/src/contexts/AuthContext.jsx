import React, { createContext, useContext, useState, useEffect } from 'react'
import API from '../api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      
      if (!token) {
        setLoading(false)
        return
      }

      // If we have a saved user, restore from cache immediately
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          setIsLoggedIn(true)
        } catch (e) {
          console.error('Failed to parse saved user:', e)
        }
      }

      // Validate token by making a test API call
      const response = await API.get('/auth/me')
      
      // If successful, user is authenticated
      setUser(response.data.user)
      setIsLoggedIn(true)
      
      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
    } catch (error) {
      console.error('Auth check failed:', error)
      // Token is invalid, clear everything
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password })
      const { token, user } = response.data

      // Save to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Update state
      setUser(user)
      setIsLoggedIn(true)

      return { success: true, user }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Clear state
    setUser(null)
    setIsLoggedIn(false)
  }

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext