import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    /* Structural Container Layout Rules:
       - min-h-[calc(100vh-4rem)]: Accounts perfectly for your top navbar space context
       - py-12 lg:py-20: Uses fluid structural margins instead of rigid layouts to prevent item overlaps
    */
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-theme-bg-main flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 px-4 sm:px-6 lg:px-8 select-none">
      
      {/* ================= DESIGN SYSTEM AMBIENT VISUAL BLURS ================= */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-theme-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-theme-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] opacity-15 dark:opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-theme-accent-primary/8 dark:bg-theme-accent-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-5 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none hidden md:block" />

      {/* ================= PRIMARY RESPONSIVE PLATFORM CONTENT HUB ================= */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 animate-fade-in space-y-8">
        
        {/* Brand Emblem Label Track */}
        <header className="flex flex-col items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-linear-to-br from-theme-accent-primary via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-theme-accent-primary/10 transform hover:rotate-6 transition-all duration-300 cursor-default">
            Q
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-theme-accent-primary bg-theme-accent-primary/8 border border-theme-accent-primary/10 px-2.5 py-0.5 rounded-md">
            Developer Knowledge Network
          </span>
        </header>

        {/* Scalable Dynamic Typography Heading Header */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-theme-text-main leading-[1.1] sm:leading-tight">
            Engineering clarity,{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-theme-accent-primary via-indigo-500 to-purple-500">
              structured and resolved.
            </span>
          </h1>
          
          {/* Platform Explanatory Subtext */}
          <p className="text-xs sm:text-sm font-medium text-theme-text-muted max-w-xl mx-auto leading-relaxed pt-1">
            Join an advanced workspace engineered to dissolve complex compilation roadblocks and system exceptions into peer-verified community resolutions.
          </p>
        </div>

        {/* Conceptual RAG Data Flow Map / Frame Display Quote */}
        <div className="w-full max-w-xl bg-theme-bg-surface/60 dark:bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl p-5 sm:p-6 shadow-2xs relative group transition-all duration-300 hover:border-theme-border">
          
          {/* Subtle Visual Flow Line Grid Mapping inside the background container */}
          <div className="absolute inset-0 opacity-5 dark:opacity-[0.03] pointer-events-none rounded-2xl overflow-hidden bg-[linear-gradient(to_right,var(--color-theme-text-main)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="p-2 rounded-xl bg-theme-accent-primary/8 text-theme-accent-primary shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <blockquote className="text-xs sm:text-sm font-semibold text-theme-text-muted leading-relaxed italic">
              "Where raw compilation roadblocks dissolve into community-verified resolution, one structured breakdown at a time."
            </blockquote>
          </div>
        </div>

        {/* Dynamic Interactive Call-To-Action Layout Group */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate('/Questions')}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 h-11 text-xs font-bold uppercase tracking-wider text-white bg-theme-text-main dark:bg-theme-bg-surface hover:bg-theme-accent-primary dark:hover:bg-theme-accent-primary border border-transparent rounded-xl transition-all duration-150 shadow-xs cursor-pointer active:scale-97"
          >
            <span>Explore</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/Chatbot')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 h-11 text-xs font-bold text-theme-text-muted hover:text-theme-text-main bg-theme-bg-surface/80 border border-theme-border rounded-xl transition-all duration-150 shadow-3xs cursor-pointer active:scale-97"
          >
            <span>Ask AI Copilot</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default LandingPage;