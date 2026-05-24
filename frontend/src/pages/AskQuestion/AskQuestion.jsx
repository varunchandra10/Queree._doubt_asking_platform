import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { askQuestion } from '../../actions/question.js'
import { showAppAlert } from '../../utils/appAlert';

const AskQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionBody, setQuestionBody] = useState('');
  const [tagInput, setTagInput] = useState(''); // Handles tags as a string while typing safely

  const dispatch = useDispatch()
  const User = useSelector((state) => state.currentUserReducer)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!User) {
      showAppAlert("Please log in to submit a question.");
      navigate('/login');
      return;
    }

    if (!questionTitle.trim() || !questionBody.trim() || !tagInput.trim()) {
      showAppAlert("Please complete all fields before reviewing your question.");
      return;
    }

    // Process the space-separated string into a clean array on submission
    const processedTags = tagInput
      .trim()
      .split(/\s+/) // Splits cleanly by any number of empty spaces
      .filter(tag => tag.length > 0);

    dispatch(
      askQuestion(
        { 
          questionTitle, 
          questionBody, 
          questionTags: processedTags, 
          userPosted: User?.result?.name, 
          userId: User?.result?._id
        }, 
        navigate
      )
    )
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-theme-bg-main py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200 flex justify-center">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        
        {/* Section Title Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-theme-text-main tracking-tight">
            Ask a public doubt
          </h1>
          <p className="text-sm text-theme-text-muted mt-1.5">
            Join the collective brain trust. Your detailed query could help developers all around the workspace.
          </p>
        </div>

        {/* Core Submission Web Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="w-full bg-theme-bg-surface border border-theme-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors duration-200">
            
            {/* Field 1: Question Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ask-ques-title" className="text-sm font-bold text-theme-text-main tracking-tight">
                Title
              </label>
              <p className="text-xs text-theme-text-dim leading-normal mb-1">
                Be specific and imagine you're explaining your bug or roadblocks to another engineer.
              </p>
              <input 
                type="text" 
                id="ask-ques-title" 
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)} 
                placeholder="e.g. Is there a simple way to compute intersection metrics for overlapping spatial arrays?"
                className="w-full px-4 py-2.5 bg-theme-bg-main border border-theme-border rounded-xl text-sm text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all"
              />
            </div>

            {/* Field 2: Question Detailed Body Documentation */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ask-ques-body" className="text-sm font-bold text-theme-text-main tracking-tight">
                Body Documentation
              </label>
              <p className="text-xs text-theme-text-dim leading-normal mb-1">
                Introduce the problem, share your error stack logs, and specify the architecture constraints.
              </p>
              <textarea 
                id="ask-ques-body" 
                rows="10" 
                value={questionBody}
                onChange={(e) => setQuestionBody(e.target.value)}
                placeholder="Describe your compilation issues or mathematical derivations here..."
                className="w-full px-4 py-3 bg-theme-bg-main border border-theme-border rounded-xl text-sm font-medium font-mono text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all resize-y min-h-[180px]"
              />
            </div>

            {/* Field 3: Code Tag Filters */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ask-ques-tags" className="text-sm font-bold text-theme-text-main tracking-tight">
                Tags
              </label>
              <p className="text-xs text-theme-text-dim leading-normal mb-1">
                Add up to 5 space-separated keywords to classify your subject matter correctly.
              </p>
              <input 
                type="text" 
                id="ask-ques-tags" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)} 
                placeholder="e.g. pytorch clips vision-transformer machine-learning"
                className="w-full px-4 py-2.5 bg-theme-bg-main border border-theme-border rounded-xl text-sm text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all"
              />
            </div>

          </div>

          {/* Form Submittal Operational Controls */}
          <div className="flex items-center justify-end">
            <button 
              type="submit" 
              className="px-5 py-3 rounded-xl text-sm font-bold text-white bg-theme-accent-primary hover:bg-theme-accent-hover shadow-md shadow-theme-accent-primary/10 transition-all cursor-pointer active:scale-98"
            >
              Review your question
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default AskQuestion;
