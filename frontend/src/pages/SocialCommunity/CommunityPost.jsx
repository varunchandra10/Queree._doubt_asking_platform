import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Post from '../../components/Posts/Post';

const CommunityPost = () => {
  const { id } = useParams();
  
  // Optimization: Extract the targeted data entity instantly using native find operations
  const postsList = useSelector((state) => state.postsReducer?.data || []);
  const post = postsList.find((p) => p._id === id);

  // Premium Fallback State UI displayed while resolving Redux records
  if (!post) {
    return (
      <div className="flex max-w-7xl mx-auto gap-6 px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-4rem)] bg-theme-bg-main transition-colors duration-200">
        <div className="flex-1 py-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 bg-theme-bg-surface border border-theme-border rounded-2xl p-12 shadow-xs max-w-sm w-full text-center">
            <div className="w-8 h-8 rounded-full border-4 border-theme-accent-primary/20 border-t-theme-accent-primary animate-spin"></div>
            <p className="text-xs font-semibold text-theme-text-muted animate-pulse tracking-wide">
              Resolving community publication parameter nodes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    /* 
       flex max-w-7xl mx-auto: Coordinates your primary layout across standard viewport limits
       gap-6 px-4: Preserves clean column gutters matching the architecture of your feed views
       min-h-[calc(100vh-4rem)]: Forces the page canvas to fill down below the universal application navbar
    */
    <div className="flex max-w-7xl mx-auto gap-6 px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-4rem)] bg-theme-bg-main transition-colors duration-200">
      
      {/* Primary Feed Viewport Workspace */}
      <main className="flex-1 py-6 min-w-0">
        {/* 
           The min-w-0 flex constraint blocks nested text strings or massive raw 
           imagery cards inside <Post /> from generating breaking overflow page snapping.
        */}
        <Post post={post} />
      </main>

    </div>
  );
};

export default CommunityPost;