import React from 'react'
import { useSelector } from 'react-redux';
import { BsCheckCircleFill } from 'react-icons/bs';

import HomeMainbar from '../components/Homemainbar/Homemainbar';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import LandingPage from '../components/LandingPage';
import Payment from '../components/payment';

const Home = () => {
  const User = useSelector((state) => state.currentUserReducer);

  return (
    <div className="relative w-full bg-theme-bg-main min-h-[calc(100vh-4rem)] flex flex-col transition-colors duration-200">
      
      {/* Main Structural Column Frame Switcher */}
      <div className={`flex-1 flex w-full ${User !== null ? 'max-w-7xl mx-auto gap-6 px-4 sm:px-6 lg:px-8' : 'px-0'}`}>
        <div className="flex-1 flex flex-col w-full">
          {User !== null ? (
            /* ================= STATE A: AUTHENTICATED INTERNAL FEED DASHBOARD ================= */
            <div className="grid w-full gap-6 xl:grid-cols-[1fr_290px] xl:items-start pt-6 pb-12">
              <HomeMainbar />
              <RightSidebar />
            </div>
          ) : (
            /* ================= STATE B: MARKETING LANDING STREAM ================= */
            <div className="w-full flex flex-col animate-fade-in">
              
              {/* Premium Asymmetric Visual Hero Header Banner */}
              <LandingPage />

              {/* ================= NEW PRODUCTION-LEVEL FEATURES MATRIX SECTION ================= */}
              <section className="max-w-5xl mx-auto w-full px-6 sm:px-10 lg:px-16 mb-24 relative z-10 select-none">
                <header className="text-center mb-12">
                  <span className="text-[10px] font-black uppercase tracking-widest text-theme-accent-primary bg-theme-accent-primary/8 border border-theme-accent-primary/10 px-2.5 py-0.5 rounded-md">
                    Engineered Workspace Utilities
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-text-main mt-3">
                    A multi-layered ecosystem for engineering teams
                  </h2>
                </header>

                <div className="grid md:grid-cols-2 gap-6 items-stretch w-full">
                  
                  {/* Feature Node 1: Collaborative Q&A Index */}
                  <div className="bg-theme-bg-surface/60 dark:bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-theme-border/100 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-theme-accent-primary/[0.02] to-transparent pointer-events-none" />
                    <div className="flex gap-4 items-start relative z-10">
                      <div className="p-3 bg-theme-accent-primary/8 rounded-xl text-theme-accent-primary shrink-0 transition-transform group-hover:scale-105 duration-300 border border-theme-accent-primary/10">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-theme-text-main tracking-tight mb-2">
                          Human-Verified Solutions
                        </h3>
                        <p className="text-xs font-medium text-theme-text-muted leading-relaxed">
                          Find peer-reviewed resolutions to complex bugs from seasoned engineers. Map network connections, customize your watched tags directory, and gain authoritative platform reputation milestones seamlessly.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature Node 2: AI Copilot Node */}
                  <div className="bg-theme-bg-surface/60 dark:bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-theme-border/100 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/[0.02] to-transparent pointer-events-none" />
                    <div className="flex gap-4 items-start relative z-10">
                      <div className="p-3 bg-indigo-500/8 rounded-xl text-indigo-400 shrink-0 transition-transform group-hover:scale-105 duration-300 border border-indigo-500/10">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-theme-text-main tracking-tight mb-2">
                          Instant AI Doubt Resolution
                        </h3>
                        <p className="text-xs font-medium text-theme-text-muted leading-relaxed">
                          Stuck troubleshooting a production-breaking compiler crash at midnight? Leverage fine-tuned retrieval agents to isolate breaking code parameters, analyze stack traces, and optimize runtimes immediately.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* ================= COMPACT PREMIUM SUBSCRIPTION BLOCK ================= */}
              <section className="w-full bg-theme-bg-surface/40 dark:bg-theme-bg-surface/20 border-t border-b border-theme-border/50 py-16 px-4 sm:px-6 lg:px-8 select-none relative z-10">
                <div className="max-w-4xl mx-auto">
                  <header className="text-center mb-10">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-theme-text-main">
                      Unleash High-Throughput Access
                    </h2>
                    <p className="text-xs text-theme-text-dim mt-1.5 uppercase tracking-wider font-bold">
                      Scale beyond individual query limits cleanly
                    </p>
                  </header>

                  <Payment/>
                </div>
              </section>

              {/* ================= STANDARDIZED CORE PLATFORM FOOTER ================= */}
              <footer className="w-full bg-theme-bg-main border-t border-theme-border/30 py-8 px-4 text-center select-none relative z-10">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-theme-text-dim">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-theme-text-muted">Queree.</span> 
                    <span>© {new Date().getFullYear()} Workspace Operations Inc.</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="cursor-default hover:text-theme-text-muted transition-colors">Security Nodes</span>
                    <span className="cursor-default hover:text-theme-text-muted transition-colors">Terms of Service</span>
                    <span className="cursor-default hover:text-theme-text-muted transition-colors">API Architecture</span>
                  </div>
                </div>
              </footer>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Home;