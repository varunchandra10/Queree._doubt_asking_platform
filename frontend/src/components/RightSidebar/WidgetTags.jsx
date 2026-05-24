import React from 'react';
import { Link } from 'react-router-dom';

const WidgetTags = () => {
  const tags = [
    'c', 'css', 'express', 'firebase', 'html', 'java', 
    'javascript', 'mern', 'mongodb', 'mysql', 'node.js', 
    'php', 'python', 'reactjs'
  ];

  return (
    <div className="w-full bg-theme-bg-surface/60 dark:bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl p-5 transition-all duration-300 shadow-2xs">
      
      {/* Module Title Header Group */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-theme-border/40">
        <div className="h-5 w-5 rounded-lg bg-theme-accent-primary/10 text-theme-accent-primary flex items-center justify-center">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-wider text-theme-text-main">
          Trending Tracks
        </h4>
      </div>

      {/* 
         Fluid Wrap Matrix Container:
         Arranges tag cards tightly together, automatically rolling down into balanced rows.
      */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            to={`/Tags`} // Redirects cleanly into your main tags search index router view
            className="px-2.5 py-1 text-xs font-semibold text-theme-text-muted bg-theme-bg-main/60 dark:bg-theme-bg-main/20 border border-theme-border/60 rounded-xl transition-all duration-150 hover:border-theme-accent-primary/40 hover:bg-theme-accent-primary/5 hover:text-theme-accent-primary select-none active:scale-95"
          >
            {tag}
          </Link>
        ))}
      </div>

    </div>
  )
}

export default WidgetTags;