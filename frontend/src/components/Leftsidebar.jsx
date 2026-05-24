import React from 'react';
import { NavLink } from 'react-router-dom';

const LeftSidebar = ({ isOpen = false, setIsOpen, variant = 'drawer' }) => {
  const isStatic = variant === 'static';

  const linkStyles = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl font-bold transition-all duration-150 group relative ${isStatic ? 'px-3.5 py-2 text-xs' : 'px-4 py-2.5 text-xs'
    } ${isActive
      ? 'bg-theme-accent-primary/8 text-theme-accent-primary before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-theme-accent-primary before:rounded-r-full'
      : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-bg-element/50'
    }`;

  const handleClose = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Premium Frosted Backdrop Mask for mobile viewports */}
      {variant !== 'static' && isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      {/* Main Sidebar Panel Frame */}
      <aside className={`
        ${isStatic ? 'fixed top-14 h-[calc(100vh-3.5rem)] w-56' : 'fixed top-14 h-[calc(100vh-3.5rem)] w-60'}
        left-0 bg-theme-bg-surface/90 dark:bg-theme-bg-surface/80 backdrop-blur-md border-r border-theme-border/50 z-40 
        transition-all duration-300 ease-out select-none
        ${isStatic ? 'translate-x-0' : isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className={`flex flex-col gap-4 p-3 h-full overflow-y-auto scrollbar-thin ${isStatic ? 'p-2.5' : 'p-3.5'}`}>

          {/* Main Route Group */}
          <NavLink to="/" onClick={handleClose} className={linkStyles} end>
            <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard Home</span>
          </NavLink>

          {/* Section Sub-Header Indicator */}
          <div className={isStatic ? 'pt-4 pb-1 px-2.5' : 'pt-5 pb-1.5 px-3.5'}>
            <span className="text-[9px] font-black uppercase tracking-wider text-theme-text-dim/80 block">
              Public Directory
            </span>
          </div>

          {/* Core Feature Tracking Channels */}
          <div className="flex flex-col gap-0.5">

            <NavLink to="/Questions" onClick={handleClose} className={linkStyles}>
              <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
              </svg>
              <span>Explore Doubts</span>
            </NavLink>

            <NavLink to="/Tags" onClick={handleClose} className={linkStyles}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span>Tags Index</span>
            </NavLink>

            <NavLink to="/Users" onClick={handleClose} className={linkStyles}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Users</span>
            </NavLink>

            <NavLink to="/Community" onClick={handleClose} className={linkStyles}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span>Community</span>
            </NavLink>

          </div>

          {/* <div className={isStatic ? 'pt-4 pb-1 px-2.5' : 'pt-5 pb-1.5 px-3.5'}>
            <span className="text-[9px] font-black uppercase tracking-wider text-theme-text-dim/80 block">
              Bot Utilities
            </span>
          </div> */}

          <div className="flex flex-col gap-0.5">

            {/* <NavLink to="/Chatbot" onClick={handleClose} className={linkStyles}>
              <div className="relative">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {/* Embedded live activity status indicator to match high-signal professional interfaces 
                <div className="absolute top-0 right-0 h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
              </div>
              <span>AI Copilot Node</span>
            </NavLink> */}



          </div>

          <div className="mt-auto pt-4 border-t border-theme-border/30">
            <NavLink to="/Payment" onClick={handleClose} className={linkStyles}>
              <svg className="w-3.5 h-3.5 shrink-0 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="font-extrabold tracking-tight">Premium Access</span>
            </NavLink>
          </div>

        </nav>
      </aside>
    </>
  );
};

export default LeftSidebar;