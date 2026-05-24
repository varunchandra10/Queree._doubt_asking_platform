import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import QuestionsList from './QuestionsList'
import { showAppAlert } from '../../utils/appAlert';

const HomeMainbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [activeFilter, setActiveFilter] = useState('top')

  // Grab real authentication & question state from Redux store safely
  const User = useSelector((state) => state.currentUserReducer);
  const questionsList = useSelector(state => state.questionsReducer);

  const checkAuth = () => {
    if (User === null) {
      showAppAlert("Please log in or sign up to ask a question.");
      navigate('/login');
    } else {
      navigate('/AskQuestion');
    }
  };

  return (
    /* 
       Main Container Core Framework:
       - bg-theme-bg-surface/60 + backdrop-blur-md: Elegant frosted glass feel matching your navigation rails
       - rounded-2xl + border-theme-border/60: Modern micro-squircle framing to maximize clean whitespace
    */
    <div className="flex-1 min-w-0 bg-theme-bg-surface/60 dark:bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl shadow-2xs p-5 sm:p-6 transition-all duration-300">
      
      {/* Upper Hub Section: Title Identity & Primary Action Call */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-theme-border/40 mb-5">
        <div>
          <h1 className="text-xl font-black tracking-tight text-theme-text-main sm:text-2xl">
            {location.pathname === '/' ? 'Top Engineering Doubts' : 'All Workspace Doubts'}
          </h1>
          {questionsList?.data && (
            <div className="inline-flex items-center gap-1.5 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-theme-accent-primary animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-theme-text-dim">
                {questionsList.data.length} active threads indexed
              </p>
            </div>
          )}
        </div>

        <button 
          type="button"
          onClick={checkAuth} 
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-theme-accent-primary hover:bg-theme-accent-hover rounded-xl shadow-xs shadow-theme-accent-primary/10 transition-all cursor-pointer active:scale-98 shrink-0 self-start sm:self-auto"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Ask a Doubt</span>
        </button>
      </div>

      {/* Middle Hub Section: Professional Technical Segment Filters */}
      {questionsList?.data && questionsList.data.length > 0 && (
        <div className="flex items-center justify-between gap-4 mb-6 bg-theme-bg-main/40 dark:bg-theme-bg-main/10 p-1.5 rounded-xl border border-theme-border/40">
          <div className="flex items-center gap-1">
            {[
              { id: 'top', label: 'Trending' },
              { id: 'newest', label: 'Newest' },
              { id: 'unresolved', label: 'Unresolved' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-theme-bg-surface text-theme-accent-primary shadow-3xs'
                    : 'text-theme-text-muted hover:text-theme-text-main'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <span className="text-[10px] font-bold tracking-wider text-theme-text-dim px-2 hidden sm:inline-block">
            Filter Controls
          </span>
        </div>
      )}

      {/* Lower Hub Section: Main Structural Feed Render Layer */}
      <div className="w-full">
        {questionsList?.data === null ? (
          /* Premium Structural Spinner Loader Node */
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-theme-bg-main/30 dark:bg-theme-bg-main/5 rounded-xl border border-theme-border/40">
            <div className="w-7 h-7 rounded-full border-3 border-theme-accent-primary/10 border-t-theme-accent-primary animate-spin"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-theme-text-dim animate-pulse">
              Syncing network master index...
            </p>
          </div>
        ) : questionsList.data.length === 0 ? (
          /* Clean Minimalist Empty State Layout Card */
          <div className="text-center py-16 px-5 bg-theme-bg-main/20 border border-dashed border-theme-border rounded-xl">
            <div className="w-10 h-10 bg-theme-bg-surface border border-theme-border/60 text-theme-text-dim rounded-xl flex items-center justify-center mx-auto mb-3.5 shadow-3xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-sm font-black text-theme-text-main tracking-tight mb-1">
              No doubts recorded inside this node
            </h3>
            <p className="text-xs text-theme-text-muted max-w-xs mx-auto leading-normal">
              Be the pioneer to kickstart discussion threads. Post a core doubt to sync with cross-channel specialists.
            </p>
          </div>
        ) : (
          /* Premium Linear List Stream Mapping Grid */
          <div className="w-full divide-y divide-theme-border/40 animate-fade-in">
            <QuestionsList questionsList={questionsList.data} filterCondition={activeFilter} />
          </div>
        )}
      </div>

    </div>
  )
}

export default HomeMainbar;
