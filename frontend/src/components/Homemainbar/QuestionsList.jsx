import React from 'react'
import Questions from './Questions'

const QuestionsList = ({ questionsList = [] }) => {
  return (
    // Outer Shell List layout that manages layout margins and partitioning automatically
    <div className="flex flex-col w-full divide-y divide-theme-border/50">
       {
        questionsList.map((question, index) => (
          <Questions question={question} key={question._id || index} />
        ))
       }
    </div>
  );
};

export default QuestionsList;