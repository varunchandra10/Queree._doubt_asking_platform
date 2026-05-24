import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '../actions/currentUser';
import { jwtDecode } from 'jwt-decode';

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  
  const User = useSelector((state) => state.currentUserReducer);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Sync Global Theme State Skin Token Elements
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    dispatch(setCurrentUser(null));
    navigate('/');
  };

  // JWT Lifespan Token Guardian
  useEffect(() => {
    const token = User?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
  }, [User?.token, dispatch]);

  useEffect(() => {
    const storedProfile = localStorage.getItem('Profile');
    if (storedProfile) {
      dispatch(setCurrentUser(JSON.parse(storedProfile)));
    }
  }, [dispatch]);

  // Command Palette Keyboard Listener (Ctrl + K / Cmd + K Focus Trap)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="w-full bg-theme-bg-surface/80 dark:bg-theme-bg-surface/70 backdrop-blur-xl border-b border-theme-border/50 sticky top-0 z-50 transition-all duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Left Hub: Drawer Controller & Brand Architecture */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Important: Retained Sidebar Navigation Hamburger functionality */}
          <button 
            type="button"
            onClick={onToggleSidebar}
            className={`${User === null ? '' : 'lg:hidden '}p-2 rounded-xl text-theme-text-muted hover:text-theme-text-main hover:bg-theme-bg-element/80 border border-theme-border/30 transition-all duration-200 cursor-pointer active:scale-95`}
            aria-label="Toggle Navigation Stack"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h12M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2 group select-none">
            <div className="h-8 w-8 rounded-xl bg-linear-to-br from-theme-accent-primary via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
              Q
            </div>
            <span className="text-lg font-black tracking-tight text-theme-text-main hidden sm:block">
              Queree<span className="text-theme-accent-primary animate-pulse">.</span>
            </span>
          </Link>

          {/* Minimal Navigation Pipes */}
          <div className="hidden xl:flex items-center gap-1 ml-4 text-xs font-bold uppercase tracking-wider">
            {[
              { label: 'Explore', path: '/Questions' },
              { label: 'Spaces', path: '/community' },
              { label: 'Experts', path: '/users' }
            ].map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'text-theme-accent-primary bg-theme-accent-primary/8 border border-theme-accent-primary/10' 
                      : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-bg-element/50 border border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Center Hub: Frosted Floating Search Core Console */}
        <div className="flex-1 max-w-xl hidden md:block relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
            <svg className="h-4 w-4 text-theme-text-dim group-focus-within:text-theme-accent-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, technical errors, or tags..."
            className="w-full pl-10 pr-16 h-10 bg-theme-bg-main/50 border border-theme-border rounded-xl text-xs font-medium text-theme-text-main placeholder-theme-text-dim focus:outline-hidden focus:ring-1.5 focus:ring-theme-accent-primary/80 focus:bg-theme-bg-surface shadow-inner transition-all duration-200"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-theme-text-dim bg-theme-bg-surface rounded-md border border-theme-border/80 shadow-3xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Hub: Theme Controls, Registration Gates & Profile Nodes */}
        <div className="flex items-center gap-4">
          
          {/* Subtle Dark/Light System Toggle */}
          <button 
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-theme-bg-element/40 border border-theme-border/30 text-theme-text-muted hover:text-theme-text-main transition-all duration-200 cursor-pointer active:scale-95"
            aria-label="Toggle System Layout Theme"
          >
            {darkMode ? (
              <svg className="w-4 h-4 text-amber-400 fill-amber-400/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-500 fill-slate-500/5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <div className="h-5 w-px bg-theme-border/60 hidden sm:block"></div>

          {User === null ? (
            /* Guest Identity Navigation Action Triggers */
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="px-3 h-9 inline-flex items-center text-xs font-bold text-theme-text-muted hover:text-theme-text-main transition-colors"
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="px-4 h-9 inline-flex items-center justify-center text-xs font-bold text-white bg-theme-accent-primary hover:bg-theme-accent-hover rounded-xl transition-all shadow-md shadow-theme-accent-primary/10 active:scale-98"
              >
                Register
              </Link>
            </div>
          ) : (
            /* Authenticated Platform Contributor Identity Dashboard Node */
            <div className="flex items-center gap-3.5">
              <Link
                to={`/Users/${User?.result?._id}`}
                className="h-8 w-8 rounded-xl shadow-sm transform hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 select-none block"
                title={User?.result?.name}
              >
                {User?.result?.profileImage ? (
                  <img
                    src={User.result.profileImage}
                    alt="user profile image node"
                    className="h-full w-full object-cover rounded-xl border border-theme-border/60"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-xs tracking-wider">
                    {User.result.name ? User.result.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </Link>
              
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-bold text-theme-text-dim hover:text-rose-500 px-2 py-2 rounded-lg hover:bg-rose-500/5 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;