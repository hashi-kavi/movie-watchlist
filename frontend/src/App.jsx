import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Search from './pages/Search.jsx';
import Watchlist from './pages/Watchlist.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/watchlist" 
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/movie/:id" 
              element={
                <ProtectedRoute>
                  <MovieDetails />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
