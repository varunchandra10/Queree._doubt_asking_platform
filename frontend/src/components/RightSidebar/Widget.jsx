import React from 'react'

const Widget = () => {
  return (
    <div className="w-full bg-theme-bg-surface/60 dark:bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-2xs flex flex-col divide-y divide-theme-border/40">
        
      {/* Section 1: The Overflow Blog */}
      <div className="p-4.5 sm:p-5">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-theme-text-dim mb-3.5 flex items-center gap-2">
          <div className="h-5 w-5 rounded-lg bg-theme-accent-primary/10 text-theme-accent-primary flex items-center justify-center">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <span>The Overflow Blog</span>
        </h4>
        <div className="space-y-3">
          {[
            "Observability is key to the future of software (and your DevOps career)",
            "Podcast 374: How valuable is your screen name?"
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-2.5 group cursor-pointer">
              <svg className="w-3.5 h-3.5 text-theme-accent-primary shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <p className="text-xs font-medium text-theme-text-muted group-hover:text-theme-text-main transition-colors leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Featured on Meta */}
      <div className="p-4.5 sm:p-5 bg-theme-bg-main/30 dark:bg-theme-bg-main/10">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-theme-text-dim mb-3.5 flex items-center gap-2">
          <div className="h-5 w-5 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          </div>
          <span>Featured on Meta</span>
        </h4>
        <div className="space-y-3">
          {[
            "Review queue workflows - Final release updates",
            "Please welcome Valued Associates: #958 - V2B, #959 - SpencerG",
            "Outdated Answers: Accepted answer is now unpinned on global spaces"
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-2.5 group cursor-pointer">
              <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xs font-medium text-theme-text-muted group-hover:text-theme-text-main transition-colors leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Hot Meta Posts */}
      <div className="p-4.5 sm:p-5">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-theme-text-dim mb-3.5 flex items-center gap-2">
          <div className="h-5 w-5 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </div>
          <span>Hot Meta Posts</span>
        </h4>
        <div className="space-y-3">
          {[
            { count: 38, title: "Why was this spam flag declined, yet the question marked as spam?" },
            { count: 20, title: "What is the best course of action when a user has high enough rep to edit comments?" },
            { count: 14, title: "Is a link to the 'How to ask' help page a useful comment?" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 group cursor-pointer">
              <span className="w-6 py-0.5 rounded-md bg-theme-bg-element text-[10px] font-bold text-theme-text-muted text-center shrink-0 mt-0.5 group-hover:bg-theme-accent-primary/10 group-hover:text-theme-accent-primary transition-colors">
                {item.count}
              </span>
              <p className="text-xs font-medium text-theme-text-muted group-hover:text-theme-text-main transition-colors leading-relaxed">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Widget;