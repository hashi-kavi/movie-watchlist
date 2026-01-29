import axios from 'axios'

const API = axios.create({
  // Prefer build-time configured backend URL; otherwise use same-origin '/api'
  baseURL: (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : '/api'),
})

// Request interceptor to attach token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Response interceptor to handle token expiration
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token is invalid/expired, clear storage and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Only redirect if not already on login/signup pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default API

