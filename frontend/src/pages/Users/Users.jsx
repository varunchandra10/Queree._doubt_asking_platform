import React from 'react'
import UsersList from './UsersList'

const Users = () => {
  return (
    /* 
       flex max-w-7xl mx-auto: Coordinates your primary grid layout across desktop screens
       gap-6 px-4: Guarantees fluid columns separation without breaking component borders
       min-h-[calc(100vh-4rem)]: Stretches the canvas cleanly below your app header row
    */
    <div className="flex max-w-7xl mx-auto gap-6 px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-4rem)] bg-theme-bg-main transition-colors duration-200">
      
      {/* Main Directory Viewport Workspace */}
      <div className="flex-1 py-6 min-w-0">
        
        {/* Directory Metadata Header Panel */}
        <div className="pb-6 border-b border-theme-border mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-theme-text-main tracking-tight">
              Community Directory
            </h1>
            <p className="text-sm text-theme-text-muted mt-2 leading-relaxed max-w-xl">
              Explore profiles, code histories, and technical insights from developers collaborating across global workspace channels.
            </p>
          </div>
          
          {/* Informational Profile Counter Tracker Module badge */}
          <div className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-theme-text-dim px-3 py-1.5 bg-theme-bg-surface border border-theme-border rounded-xl self-start sm:self-auto shadow-2xs">
            Active Contributors Index
          </div>
        </div>

        {/* Primary Profiles Renderer Wrapper Grid */}
        <div className="w-full">
          <UsersList />
        </div>

      </div>
    </div>
  )
}

export default Users;