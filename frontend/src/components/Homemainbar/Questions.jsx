import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

const Questions = ({ question }) => {
  // Safe default evaluations to avoid mapping errors if attributes are unpopulated
  const voteScore = (question?.upVote?.length || 0) - (question?.downVote?.length || 0);
  const answersCount = question?.noOfAnswers || 0;
  const tagsList = question?.questionTags || [];

  return (
    <div className="group flex flex-col sm:flex-row items-start gap-4 py-4 px-2 hover:bg-theme-bg-main/40 rounded-none transition-all duration-200 border-b border-theme-border/60 default-last:border-0">
      
      {/* Left Column: Analytics Metrics Counters */}
      <div className="flex sm:flex-col items-center justify-start gap-3 sm:w-20 shrink-0 sm:text-center mt-1">
        
        {/* Votes Score Block */}
        <div className="flex sm:flex-col items-center gap-1 sm:gap-0">
          <span className={`text-sm font-bold ${voteScore > 0 ? 'text-emerald-500' : voteScore < 0 ? 'text-rose-500' : 'text-theme-text-main'}`}>
            {voteScore}
          </span>
          <span className="text-[11px] font-semibold text-theme-text-dim uppercase tracking-wide">
            votes
          </span>
        </div>

        {/* Answers Metric Box (Changes border/bg color dynamically if solved) */}
        <div className={`flex sm:flex-col items-center gap-1 sm:gap-0 px-2.5 py-1 sm:py-1.5 rounded-none border sm:w-full transition-colors ${
          answersCount > 0 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
            : 'border-theme-border text-theme-text-muted'
        }`}>
          <span className="text-sm font-bold tracking-tight">
            {answersCount}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider block">
            answers
          </span>
        </div>

      </div>

      {/* Right Column: Question Content Info details */}
      <div className="flex-1 min-w-0">
        
        {/* Core Title Heading Link */}
        <Link 
          to={`/Questions/${question?._id}`} 
          className="block text-base font-bold text-theme-text-main leading-snug hover:text-theme-accent-primary transition-colors tracking-tight mb-2"
        >
          {question?.questionTitle}
        </Link>

        {/* Tags and Metadata Row Footer Section */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          
          {/* Conceptual Platform Tags Container */}
          <div className="flex flex-wrap gap-1.5">
            {tagsList.map((tag) => (
              <span 
                key={tag} 
                className="px-2.5 py-0.5 text-xs font-semibold text-theme-text-muted bg-theme-bg-element hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary rounded-none transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* User History Action Time Stamp Stamp Meta */}
          <div className="flex items-center gap-2 text-xs text-theme-text-dim font-medium">
            <span>asked</span>
            <time className="text-theme-text-muted font-semibold">
              {moment(question?.askedOn).fromNow()}
            </time>
            <span>by</span>
            <span className="text-theme-accent-primary font-semibold hover:underline cursor-pointer">
              {question?.userPosted || 'Anonymous'}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Questions;