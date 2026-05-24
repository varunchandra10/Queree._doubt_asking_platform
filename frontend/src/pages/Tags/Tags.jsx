import React, { useState } from "react";
import TagsList from "./TagsList";
import { tagsList } from './tagList';

const Tags = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamically filter the tags list based on user text selection input
  const filteredTags = tagsList.filter((tag) => {
    const tagName = tag?.tagName?.toLowerCase() || "";
    const tagDesc = tag?.tagDesc?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return tagName.includes(query) || tagDesc.includes(query);
  });

  return (
    <div className="flex max-w-7xl mx-auto gap-6 px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-4rem)] bg-theme-bg-main transition-colors duration-200">
      
      {/* Main Directory Workspace Viewport */}
      <div className="flex-1 py-6 min-w-0">
        
        {/* Directory Metadata Header Panel */}
        <div className="pb-6 border-b border-theme-border mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-xl">
            <h1 className="text-3xl font-extrabold text-theme-text-main tracking-tight">
              Technology Directory
            </h1>
            <p className="text-sm text-theme-text-muted mt-2 leading-relaxed">
              A tag is a categorized metadata keyword mapping similar technical doubts together. 
              Utilizing specific classification filters streamlines discovery routes for workspace experts.
            </p>
          </div>

          {/* Fully Functional Search Input Field */}
          <div className="relative w-full md:w-64 shrink-0">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tags index..." 
              className="w-full pl-9 pr-4 py-2.5 bg-theme-bg-surface border border-theme-border rounded-xl text-xs font-semibold text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all shadow-xs"
            />
            <svg className="w-4 h-4 text-theme-text-dim absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            {/* Clear Search Action Button */}
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-theme-text-dim hover:text-theme-text-main text-xs font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Matrix View Port Engine */}
        {filteredTags.length === 0 ? (
          /* Empty Search Filter Fallback State Layout */
          <div className="text-center py-16 bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xs px-4">
            <svg className="w-12 h-12 text-theme-text-dim mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <h3 className="text-base font-bold text-theme-text-main mb-1">No technology matches found</h3>
            <p className="text-sm text-theme-text-muted max-w-sm mx-auto">
              We couldn't find any tags matching your query "<span className="font-semibold">{searchQuery}</span>". Try clearing filters or checking typos.
            </p>
          </div>
        ) : (
          /* Auto-Responsive Multi-Column Grid Matrix */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTags.map((tag, index) => (
              <TagsList tag={tag} key={tag.id || tag.tagName || index} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Tags;