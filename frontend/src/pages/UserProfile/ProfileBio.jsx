import React from 'react';
import Friends from './Friends';

const ProfileBio = ({ currentProfile, users }) => {
  const tags = currentProfile?.tags || [];
  const hasTags = tags.length > 0;
  const hasAbout = !!currentProfile?.about?.trim();

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Segment 1: About / Biography block */}
      <div className="w-full bg-theme-bg-surface border border-theme-border rounded-2xl p-6 shadow-xs transition-colors duration-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-main mb-3 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-theme-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Developer Biography
        </h4>
        
        {hasAbout ? (
          <p className="text-sm font-medium text-theme-text-muted leading-relaxed whitespace-pre-wrap">
            {currentProfile.about}
          </p>
        ) : (
          <p className="text-xs font-medium italic text-theme-text-dim py-2">
            No bio information has been filled out across this user segment yet.
          </p>
        )}
      </div>

      {/* Segment 2: Tags of Expertise block */}
      <div className="w-full bg-theme-bg-surface border border-theme-border rounded-2xl p-6 shadow-xs transition-colors duration-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-main mb-4 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Tags of Expertise
        </h4>

        {hasTags ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag}
                className="px-2.5 py-1 text-xs font-semibold text-theme-text-muted bg-theme-bg-main border border-theme-border/60 rounded-lg hover:border-theme-accent-primary/40 hover:text-theme-accent-primary transition-colors cursor-default select-none"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs font-medium italic text-theme-text-dim py-1">
            0 technical keywords selected for tracking.
          </p>
        )}
      </div>

      {/* Kept hidden per your legacy specification requirement layout */}
      <div className="hidden" aria-hidden="true">
        <Friends currentProfile={currentProfile} users={users} />
      </div>

    </div>
  )
}

export default ProfileBio;