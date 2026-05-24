import React from "react";

const TagsList = ({ tag }) => {
  return (
    <div className="group flex flex-col justify-between p-5 bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xs hover:border-theme-accent-primary/40 hover:shadow-md hover:shadow-theme-accent-primary/5 transition-all duration-200 select-none">
      
      <div>
        {/* Technology Tag Badge Header */}
        <div className="mb-3 self-start">
          <span className="inline-block px-2.5 py-1 text-xs font-bold tracking-tight text-theme-accent-primary bg-theme-accent-primary/10 rounded-lg group-hover:bg-theme-accent-primary group-hover:text-white transition-colors duration-200">
            {tag?.tagName}
          </span>
        </div>

        {/* Informational Description Content */}
        <p className="text-xs text-theme-text-muted leading-relaxed font-medium line-clamp-4">
          {tag?.tagDesc}
        </p>
      </div>

      {/* Decorative Quick-View Metrics Action row */}
      <div className="mt-4 pt-3 border-t border-theme-border/40 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-theme-text-dim">
        <span>Submissions View</span>
        <svg className="w-3.5 h-3.5 transform translate-x-0 group-hover:translate-x-1 transition-transform text-theme-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>

    </div>
  );
};

export default TagsList;