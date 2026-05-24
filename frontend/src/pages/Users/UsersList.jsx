import React from 'react'
import { useSelector } from 'react-redux'
import User from './User'

const UsersList = () => {
  const users = useSelector((state) => state.usersReducer);

  // Safeguard: checking if data is nested inside a 'data' object or is a direct array
  const usersList = Array.isArray(users) ? users : users?.data || null;

  return (
    <div className="w-full">
      {usersList === null ? (
        /* Premium Skeleton Loading State Module */
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xs">
          <div className="w-8 h-8 rounded-full border-4 border-theme-accent-primary/20 border-t-theme-accent-primary animate-spin"></div>
          <p className="text-xs font-semibold text-theme-text-muted animate-pulse">
            Syncing workspace developer index...
          </p>
        </div>
      ) : usersList.length === 0 ? (
        /* Empty Directory Fallback Layout */
        <div className="text-center py-16 bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xs px-4">
          <svg className="w-12 h-12 text-theme-text-dim mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-base font-bold text-theme-text-main mb-1">No active developers found</h3>
          <p className="text-sm text-theme-text-muted max-w-sm mx-auto">
            There are currently no profile accounts registered inside this localized workspace network node.
          </p>
        </div>
      ) : (
        /* 
           Responsive Multi-Column User Grid:
           1 Column on phone screens -> 2 on small tablets -> 3 on large tablets -> 4 on wide monitors.
        */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
          {usersList.map((user, index) => (
            <User user={user} key={user?._id || index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;