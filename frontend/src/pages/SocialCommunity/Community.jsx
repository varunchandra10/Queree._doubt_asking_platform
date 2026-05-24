import React from 'react';
import PostPage from '../../components/Posts/PostPage';

const Community = () => {
  return (
    /* 
       flex max-w-7xl mx-auto: Centers the primary view layout frame cleanly on desktop displays
       gap-6 px-4: Provides matching structural margins matching your tags and user streams
       min-h-[calc(100vh-4rem)]: Extends the canvas downward beneath your universal platform navigation banner
    */
    <div className="flex max-w-7xl mx-auto gap-6 px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-4rem)] bg-theme-bg-main transition-colors duration-200">
      
      {/* Primary Feed Viewport Workspace */}
      <main className="flex-1 py-6 min-w-0">
        {/* 
           The min-w-0 constraint prevents child text strings, code snippets, or 
           dense block images nested inside <PostPage /> from breaking parent layout container frames.
        */}
        <PostPage />
      </main>

    </div>
  )
}

export default Community;