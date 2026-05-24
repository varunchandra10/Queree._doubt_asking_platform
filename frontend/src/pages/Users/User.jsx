import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ user }) => {
  return (
    <Link 
      to={`/Users/${user?._id}`} 
      className="group flex flex-col items-center text-center p-5 bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xs hover:border-theme-accent-primary/40 hover:shadow-md hover:shadow-theme-accent-primary/5 transition-all duration-200 select-none cursor-pointer"
    >
      {/* Premium User Identity Profile Token (Avatar Ring)
         group-hover:scale-105: Scales the avatar cleanly when hovered.
      */}
      <div className="h-12 w-12 rounded-xl overflow-hidden text-white font-bold text-base tracking-wide flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0 mb-3 bg-theme-bg-element">
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={`${user?.name}'s profile avatar`} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image link icons gracefully if network pipeline drops
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-theme-accent-primary to-indigo-600 flex items-center justify-center uppercase">
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
        )}
      </div>

      {/* Profile Metadata Text Blocks */}
      <div className="w-full min-w-0">
        <h5 className="text-sm font-bold text-theme-text-main truncate group-hover:text-theme-accent-primary transition-colors">
          {user?.name}
        </h5>
        
        {/* Secondary subtitle tracker to give the card immediate production layout weights */}
        <span className="text-[10px] font-semibold text-theme-text-dim tracking-wider uppercase mt-1 block">
          View Profile →
        </span>
      </div>

    </Link>
  )
}

export default User;