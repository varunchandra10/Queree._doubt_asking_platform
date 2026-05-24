import React from 'react'
import { Link } from 'react-router-dom'
import Widget from './Widget'
import WidgetTags from './WidgetTags'

const RightSidebar = () => {
  return (
    /* 
       Architectural Layout Configuration:
       - hidden lg:flex: Hidden on smaller tablets, renders beautifully as a third structural column at 1024px+
       - sticky top-20 h-fit: Snaps firmly below the frosted navbar; stays perfectly static with NO internal nested scrolling
       - self-start: Allows the parent container to dictate page height naturally without dragging down or clipping components
    */
    <aside className="hidden lg:flex flex-col gap-6 w-76 shrink-0 sticky top-20 h-fit self-start pb-6 select-none animate-fade-in">
      
      {/* Module 1: Platform Bulletins & Announcements */}
      <section className="w-full">
        <Widget />
      </section>

      {/* Module 2: Monitored Technology Filters */}
      <section className="w-full">
        <div className="mb-2 px-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-theme-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-dim">
              Watched Tags
            </span>
          </div>
          {/* Quick Action Anchor matching industry-standard developer portals */}
          <Link to="/Tags" className="text-[10px] font-semibold text-theme-accent-primary hover:underline transition-all">
            Manage
          </Link>
        </div>
        <WidgetTags />
      </section>

      {/* Visual Architectural Grid Divider line */}
      <div className="w-full h-px bg-linear-to-r from-theme-border/60 via-theme-border/10 to-transparent" aria-hidden="true" />

      {/* Module 3: Professional Platform Metric Ticker */}
      <section className="w-full bg-theme-bg-surface/40 border border-theme-border/50 rounded-2xl p-4 transition-colors duration-200">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-dim">
            Network Operations
          </span>
        </div>
        
        {/* Metric Data Rows */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-black text-theme-text-main tracking-tight">14.2k</span>
            <span className="text-[9px] font-semibold text-theme-text-dim uppercase mt-0.5">Doubt Solutions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-theme-text-main tracking-tight">99.4%</span>
            <span className="text-[9px] font-semibold text-theme-text-dim uppercase mt-0.5">Response Rate</span>
          </div>
        </div>
      </section>

    </aside>
  )
}

export default RightSidebar;