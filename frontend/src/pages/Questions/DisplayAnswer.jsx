import React from 'react'
import moment from 'moment'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAnswer } from '../../actions/question.js'
import Avatar from '../../components/Avatar.jsx'

const DisplayAnswer = ({ question, handleShare }) => {
  const User = useSelector((state) => state.currentUserReducer);
  const { id } = useParams();
  const dispatch = useDispatch();

  const handleDelete = (answerId, noOfAnswers) => {
    dispatch(deleteAnswer(id, answerId, noOfAnswers - 1));
  };

  const answerList = question?.answer || [];

  return (
    // Stack items cleanly with uniform borders separating distinct responses
    <div className="flex flex-col w-full divide-y divide-theme-border/50">
      {answerList.map((ans) => {
        const isAuthor = User?.result?._id === ans?.userId;
        
        return (
          <div className="py-6 first:pt-2 group/answer" key={ans._id}>
            
            {/* Core Body Content: Monospace font layout optimized for code snippet safety */}
            <p className="text-sm font-medium text-theme-text-muted leading-relaxed whitespace-pre-wrap font-mono mb-4">
              {ans.answerBody}
            </p>
            
            {/* Metadata Footer Control Strip Module */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              
              {/* Left Wing: Informational Control Action Points */}
              <div className="flex items-center gap-3 text-xs font-semibold">
                
                {/* Share Trigger Action Hook */}
                <button 
                  type="button" 
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-theme-text-muted hover:bg-theme-bg-element hover:text-theme-text-main transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>

                {/* Conditional Delete Control Element */}
                {isAuthor && (
                  <button 
                    type="button" 
                    onClick={() => handleDelete(ans._id, question.noOfAnswers)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer opacity-0 group-hover/answer:opacity-100 focus:opacity-100 transition-opacity"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                )}
              </div>

              {/* Right Wing: Contributor Card Badge Block */}
              <div className="flex items-center gap-3 self-end sm:self-auto bg-theme-bg-main/40 border border-theme-border/60 rounded-xl p-2.5 min-w-[200px]">
                <Link to={`/Users/${ans.userId || ans.userID}`} className="shrink-0">
                  <Avatar className="h-8 w-8 bg-emerald-500 text-white font-bold text-xs">
                    {ans.userAnswered ? ans.userAnswered.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                </Link>
                <div className="flex flex-col min-w-0">
                  <Link 
                    to={`/Users/${ans.userId || ans.userID}`} 
                    className="text-xs font-bold text-theme-text-main hover:text-theme-accent-primary transition-colors truncate block"
                  >
                    {ans.userAnswered}
                  </Link>
                  <span className="text-[10px] font-medium text-theme-text-dim mt-0.5">
                    answered {moment(ans.answeredOn).fromNow()}
                  </span>
                </div>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
};

export default DisplayAnswer;