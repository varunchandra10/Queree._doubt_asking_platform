import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';

const Friends = ({ currentProfile, users = [] }) => {
  // Pre-process and filter valid existing friend objects to simplify the render loop
  const friendIds = currentProfile?.friends || [];
  const validFriends = friendIds
    .map(id => users.find(user => user?._id === id))
    .filter(friend => friend !== undefined); // Removes any orphaned IDs cleanly

  return (
    <div className="w-full bg-theme-bg-surface border border-theme-border rounded-2xl p-6 shadow-xs transition-colors duration-200">
      
      {/* Module Title Header Group */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-theme-border/60">
        <svg className="w-4 h-4 text-theme-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-main">
          Connections ({validFriends.length})
        </h4>
      </div>

      {/* Conditionally Render Empty State or Friends Grid Stack */}
      {validFriends.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs font-medium text-theme-text-dim">
            No active connections found inside this network node yet.
          </p>
        </div>
      ) : (
        /* 
           Responsive Flexible Flow Flex-row:
           Renders cards side-by-side cleanly and wraps down seamlessly on small viewports
        */
        <div className="flex flex-wrap gap-3">
          {validFriends.map((friend) => (
            <Link 
              key={friend._id}
              to={`/Users/${friend._id}`}
              className="group inline-flex items-center gap-3 pl-2 pr-4 py-2 bg-theme-bg-main border border-theme-border/60 rounded-xl transition-all duration-150 hover:border-theme-accent-primary/40 hover:bg-theme-accent-primary/5 cursor-pointer max-w-[220px] min-w-[140px]"
            >
              {/* Native System Avatar component mapped cleanly onto design classes */}
              <Avatar className="h-8 w-8 text-xs font-bold text-white bg-theme-accent-primary shrink-0 rounded-lg transition-transform group-hover:scale-105">
                {friend.name ? friend.name.charAt(0).toUpperCase() : '?'}
              </Avatar>

              {/* Informational Handling Text block */}
              <div className="min-w-0 flex flex-col">
                <span className="text-xs font-bold text-theme-text-muted group-hover:text-theme-text-main transition-colors truncate block">
                  {friend.name}
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-theme-text-dim uppercase mt-0.5">
                  View Space
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}

export default Friends;