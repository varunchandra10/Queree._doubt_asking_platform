import React from 'react'

const AboutAuth = () => {
  return (
    <div className="w-full max-w-lg lg:max-w-md flex flex-col justify-center bg-transparent transition-colors duration-200 py-6">
      
      {/* Brand Header Catchphrase */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-theme-text-main tracking-tight leading-tight">
          Join the <span className="text-theme-accent-primary">Queree</span> community
        </h1>
        <p className="text-sm text-theme-text-muted mt-2">
          Accelerate your development cycle and gain comprehensive clarity alongside thousands of engineers.
        </p>
      </div>

      {/* Feature Matrix Map List */}
      <div className="space-y-6">
        
        {/* Item 1: Get Unstuck */}
        <div className="flex items-start gap-4 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-theme-accent-primary/10 text-theme-accent-primary shrink-0 transition-transform group-hover:scale-105">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-text-main tracking-tight">Get unstuck instantly</h3>
            <p className="text-xs text-theme-text-muted mt-0.5 leading-relaxed">
              Ask deep conceptual technical questions to community experts or query our midnight fine-tuned Copilot AI.
            </p>
          </div>
        </div>

        {/* Item 2: Privileges */}
        <div className="flex items-start gap-4 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0 transition-transform group-hover:scale-105">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-text-main tracking-tight">Unlock system privileges</h3>
            <p className="text-xs text-theme-text-muted mt-0.5 leading-relaxed">
              Gain validation authority to upvote exceptional snippets, write code commentary, and peer review submissions.
            </p>
          </div>
        </div>

        {/* Item 3: Watched Tags */}
        <div className="flex items-start gap-4 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 shrink-0 transition-transform group-hover:scale-105">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-text-main tracking-tight">Curate customized feeds</h3>
            <p className="text-xs text-theme-text-muted mt-0.5 leading-relaxed">
              Save your favorite technological tags, fine-tune filters, and follow custom tech stacks relevant to your profile.
            </p>
          </div>
        </div>

        {/* Item 4: Badges */}
        <div className="flex items-start gap-4 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 shrink-0 transition-transform group-hover:scale-105">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-text-main tracking-tight">Earn reputation and accolades</h3>
            <p className="text-xs text-theme-text-muted mt-0.5 leading-relaxed">
              Contribute comprehensive answers to build your developer index profile and claim premium system badges.
            </p>
          </div>
        </div>

      </div>

      {/* Footer Informational Description Block */}
      <div className="mt-8 pt-6 border-t border-theme-border/60 text-xs text-theme-text-muted space-y-1">
        <p>Collaborate and share information with private workspaces for free.</p>
        <p className="font-semibold text-theme-accent-primary hover:underline cursor-pointer transition-colors">
          Create a private Queree Space for Teams free →
        </p>
      </div>

    </div>
  )
}

export default AboutAuth;