import React from 'react'
import LeftSidebar from '../../components/Leftsidebar'
import RightSidebar from '../../components/RightSidebar/RightSidebar'
import QuestionDetails from './QuestionsDetails'

const DisplayQuestion = () => {
  return (
    /* 
       flex: Establishes a fluid row framework for the columns
       max-w-7xl mx-auto: Uniform page containment box centering the layout beautifully
       gap-6: Matches your platform's grid rhythm exactly
       min-h-[calc(100vh-4rem)]: Forces the page canvas to fill the full vertical browser window below the Navbar
    */
    <div className="flex max-w-7xl mx-auto gap-6 px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-4rem)] bg-theme-bg-main transition-colors duration-200">
      
      {/* Main Flex-1 Workspace: Dynamically partitions core content from context modules */}
      <div className="flex-1 flex gap-6 py-6 min-w-0 overflow-hidden">
        
        {/* Column 2: Detailed Thread Feed Block */}
        <div className="flex-1 min-w-0">
          <QuestionDetails />
        </div>
        
        {/* Column 3: Hot Stats and Meta Tags Module Widget Column */}
        <RightSidebar />
        
      </div>

    </div>
  );
};

export default DisplayQuestion;