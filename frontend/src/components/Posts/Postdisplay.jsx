import React from 'react';
import { useSelector } from 'react-redux';
import Post from './Post';

const Postdisplay = () => {
  const posts = useSelector((state) => state.postsReducer);
  const postsList = posts?.data;

  // Cross-Lookup Source: Fetch the live users array pool directly from global state
  const usersList = useSelector((state) => state.usersReducer) || [];

  return (
    <div className="w-full flex flex-col gap-4 transition-colors duration-200">
      {postsList === null ? (
        /* Premium Skeleton Loading Loop Module */
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xs">
          <div className="w-9 h-9 rounded-full border-4 border-theme-accent-primary/20 border-t-theme-accent-primary animate-spin"></div>
          <h2 className="text-sm font-semibold text-theme-text-muted animate-pulse">
            Syncing community spaces feed...
          </h2>
        </div>
      ) : postsList.length === 0 ? (
        /* Elegant Empty Feed Fallback Layout Box */
        <div className="text-center py-16 px-4 bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xs">
          <svg className="w-12 h-12 text-theme-text-dim mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-base font-bold text-theme-text-main mb-1">
            No milestones shared yet
          </h3>
          <p className="text-sm text-theme-text-muted max-w-sm mx-auto">
            Be the first to update the Queree community workspace on your breaking technical experience!
          </p>
        </div>
      ) : (
        /* Clean Map Render List Stack Layout */
        <div className="flex flex-col gap-4">
          {postsList.map((post) => {
            // Find the dynamic real-time account data using the post's author ID reference
            const postAuthor = usersList.find((u) => u._id === post?.userId);
            const liveProfileImage = postAuthor?.profileImage || post?.profileImage;

            return (
              <Post 
                key={post._id || Math.random()} 
                post={post} 
                profileImage={liveProfileImage} // Injects the live profile picture straight down to the Post component
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Postdisplay;