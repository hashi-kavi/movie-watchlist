import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isLoggedIn, logout: authLogout } = useAuth();
  const [open, setOpen] = useState(false); // mobile menu
  const navigate = useNavigate();

  const handleLogout = () => {
    authLogout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-gradient-to-b from-black/60 via-black/40 to-black/30 border-b border-white/6">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">MW</div>
            <div className="hidden sm:block">
              <div className="text-white font-semibold">Movie Watchlist</div>
              <div className="text-xs text-gray-400">Your personal movie collection</div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/search" className="text-gray-200 hover:text-white/90 transition">Search</Link>
          <Link to="/watchlist" className="text-gray-200 hover:text-white/90 transition">Watchlist</Link>
          <Link to="/" className="text-gray-200 hover:text-white/90 transition">Discover</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* desktop user area */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/6 px-2 py-1 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold text-white" aria-label="User avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
                <div className="hidden sm:block text-sm text-gray-200">{user?.username || 'User'}</div>
              </div>
              <button onClick={handleLogout} className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white" aria-label="Sign out">Sign out</button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white">Sign in</Link>
              <Link to="/signup" className="px-3 py-1 rounded-md border border-white/8 text-white">Create account</Link>
            </div>
          )}

          {/* mobile hamburger */}
          <button onClick={()=>setOpen(o=>!o)} className="ml-2 md:hidden p-2 bg-white/6 rounded-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16"/></svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden">
            <div className="px-4 pb-4 space-y-2">
              <Link to="/search" className="block px-3 py-2 rounded-md text-gray-200 hover:bg-white/4">Search</Link>
              <Link to="/watchlist" className="block px-3 py-2 rounded-md text-gray-200 hover:bg-white/4">Watchlist</Link>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white">Sign out</button>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md text-gray-200 hover:bg-white/4">Login</Link>
                  <Link to="/signup" className="block px-3 py-2 rounded-md text-gray-200 hover:bg-white/4">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
