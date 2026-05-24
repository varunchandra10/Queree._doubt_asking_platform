import React from 'react'
import RightSidebar from '../../components/RightSidebar/RightSidebar'
import HomeMainbar from '../../components/HomeMainbar/HomeMainbar'

const Questions = () => {
  return (
    <div className="flex w-full gap-6 px-0 min-h-[calc(100vh-4rem)] bg-theme-bg-main transition-colors duration-200">
      <div className="flex-1 flex gap-6 py-3 min-w-0">
        
        {/* Column 2: Main Questions Feed List (Flexes dynamically) */}
        <main className="flex-1 min-w-0">
          <HomeMainbar />
        </main>
        
        {/* Column 3: Hot Metadata Widgets and Watched Tags */}
        <RightSidebar />
        
      </div>

    </div>
  )
}

export default Questions;