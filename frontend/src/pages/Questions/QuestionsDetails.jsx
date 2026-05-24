import React, { useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { postAnswer, deleteQuestion, voteQuestion } from '../../actions/question';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import DisplayAnswer from './DisplayAnswer';
import AlertBox from '../../components/AlertBox';
import { Share, Trash2 } from 'lucide-react';

const QuestionDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const questionsList = useSelector((state) => state.questionsReducer);
  const usersList = useSelector((state) => state.usersReducer) || [];
  const User = useSelector((state) => state.currentUserReducer);

  const [Answer, setAnswer] = useState('');

  // Alert Modals State Machine Configuration
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: '',
    title: '',
    variant: 'warning',
    confirmLabel: 'Got it',
    cancelLabel: undefined,
    onConfirm: null
  });

  const url = 'https://stackoverflow-g6az.onrender.com';

  const handlePostAns = (e, answerLength) => {
    e.preventDefault();
    if (User === null) {
      setAlertConfig({
        isOpen: true,
        message: 'Authentication required. Please log in or register to submit an answer.',
        title: 'Action Required',
        variant: 'warning',
        confirmLabel: 'Go to Login',
        onConfirm: () => navigate('/login')
      });
    } else if (Answer.trim() === '') {
      setAlertConfig({
        isOpen: true,
        message: 'Answer parameter nodes cannot be sent empty.',
        title: 'Action Required',
        variant: 'warning',
        onConfirm: null
      });
    } else {
      dispatch(
        postAnswer({
          id,
          noOfAnswers: answerLength + 1,
          answerBody: Answer,
          userAnswered: User.result.name,
          userId: User.result._id,
        })
      );
      setAnswer('');
    }
  };

  const handleShare = () => {
    copy(url + location.pathname);
    setAlertConfig({
      isOpen: true,
      message: 'Share link successfully copied to your system clipboard.',
      title: 'Link Copied',
      variant: 'success',
      onConfirm: null
    });
  };

  const handleDeleteTrigger = () => {
    setAlertConfig({
      isOpen: true,
      message: 'Do you really want to delete this doubt thread permanently from the workspace index?',
      title: 'Delete Thread',
      variant: 'danger',
      confirmLabel: 'Yes, Delete',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        dispatch(deleteQuestion(id, navigate));
      }
    });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const handleUpVote = () => {
    if (User === null) {
      setAlertConfig({
        isOpen: true,
        message: 'Authentication required. Please log in to upvote.',
        title: 'Action Required',
        variant: 'warning',
        confirmLabel: 'Go to Login',
        onConfirm: () => navigate('/login')
      });
    } else {
      dispatch(voteQuestion(id, 'upVote'));
    }
  };

  const handleDownVote = () => {
    if (User === null) {
      setAlertConfig({
        isOpen: true,
        message: 'Authentication required. Please log in to downvote.',
        title: 'Action Required',
        variant: 'warning',
        confirmLabel: 'Go to Login',
        onConfirm: () => navigate('/login')
      });
    } else {
      dispatch(voteQuestion(id, 'downVote'));
    }
  };

  if (questionsList.data === null) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center gap-3 bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl">
        <div className="w-7 h-7 rounded-full border-3 border-theme-accent-primary/10 border-t-theme-accent-primary animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-theme-text-dim animate-pulse">
          Syncing thread parameters...
        </p>
      </div>
    );
  }

  const exactQuestion = questionsList.data.find((q) => q._id === id);

  if (!exactQuestion) {
    return (
      <div className="text-center py-16 bg-theme-bg-surface/40 border border-theme-border rounded-2xl">
        <p className="text-sm font-semibold text-theme-text-muted">Requested thread node does not exist.</p>
      </div>
    );
  }

  // Cross-lookup the freshest user details directly from the global users pool
  const questionAuthor = usersList.find((u) => u._id === exactQuestion?.userId);
  const liveProfileImage = questionAuthor?.profileImage || exactQuestion?.profileImage;

  return (
    <div className="w-full space-y-6 animate-fade-in select-none">

      {/* ================= SECTION 1: MASTER QUESTION BLOCK ================= */}
      <article className="w-full bg-theme-bg-surface/60 dark:bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl p-5 sm:p-6 shadow-2xs">

        {/* Thread Header Identity Title */}
        <header className="pb-4 border-b border-theme-border/40 mb-5">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-theme-text-main leading-snug">
            {exactQuestion.questionTitle}
          </h1>
          <div className="flex flex-wrap gap-4 text-[10px] font-bold text-theme-text-dim uppercase tracking-wider mt-2.5">
            <span className="flex items-center gap-1">
              Asked {moment(exactQuestion.askedOn).fromNow()}
            </span>
            <span className="text-theme-border/60">•</span>
            <span className="text-theme-accent-primary">
              {exactQuestion.noOfAnswers} total feedback segments
            </span>
          </div>
        </header>

        {/* Voting Layout Rails + Content Block */}
        <div className="grid grid-cols-[auto_1fr] gap-4 sm:gap-6 items-start">

          {/* Vertical Micro-Voting Controls Hub */}
          <div className="flex flex-col items-center gap-1 bg-theme-bg-main/40 dark:bg-theme-bg-main/10 border border-theme-border/40 rounded-xl p-1.5 shrink-0">
            <button
              type="button"
              onClick={handleUpVote}
              className="p-1 rounded-lg text-theme-text-dim hover:text-theme-accent-primary hover:bg-theme-bg-surface active:scale-90 transition-all cursor-pointer"
              aria-label="Upvote question thread"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>

            <span className="text-sm font-black text-theme-text-main tracking-tight min-w-[20px] text-center">
              {exactQuestion.upVote.length - exactQuestion.downVote.length}
            </span>

            <button
              type="button"
              onClick={handleDownVote}
              className="p-1 rounded-lg text-theme-text-dim hover:text-rose-500 hover:bg-theme-bg-surface active:scale-90 transition-all cursor-pointer"
              aria-label="Downvote question thread"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Primary Question Body Context Wrapper */}
          <div className="space-y-4 min-w-0">
            <p className="text-sm font-medium text-theme-text-muted leading-relaxed whitespace-pre-wrap break-words text-left">
              {exactQuestion.questionBody}
            </p>

            {/* Injected Technology Badges Flow */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {exactQuestion.questionTags.map((tag) => (
                <Link
                  key={tag}
                  to="/Tags"
                  className="px-2.5 py-1 text-[11px] font-bold text-theme-text-muted bg-theme-bg-main/60 dark:bg-theme-bg-main/20 border border-theme-border/60 rounded-xl hover:border-theme-accent-primary/40 hover:text-theme-accent-primary transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Actions Rail Layout Node */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 mt-6 border-t border-theme-border/30">
              <div className="flex items-center gap-2">
                {/* Enhanced Minimal Share Button Icon */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 text-theme-text-dim hover:text-theme-accent-primary bg-theme-bg-element/40 border border-theme-border/50 hover:bg-theme-bg-element rounded-xl transition-all cursor-pointer active:scale-95"
                  title="Copy share URL to clipboard"
                >
                  <Share className="w-4 h-4" />
                </button>

                {/* Enhanced Minimal Destructive Delete Button Icon */}
                {User?.result?._id === exactQuestion?.userId && (
                  <button
                    type="button"
                    onClick={handleDeleteTrigger}
                    className="p-2 text-theme-text-dim hover:text-rose-500 bg-theme-bg-element/40 border border-theme-border/50 hover:bg-rose-500/10 hover:border-rose-500/20 rounded-xl transition-all cursor-pointer active:scale-95"
                    title="Delete this query entry permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Author User Signature Card Component */}
              <div className="flex items-center gap-2.5 bg-theme-bg-main/30 border border-theme-border/40 rounded-xl p-2 self-end sm:self-auto min-w-[160px]">
                {/* Unified Avatar Container */}
                <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0 select-none shadow-3xs relative bg-theme-bg-element">
                  {liveProfileImage ? (
                    <img
                      src={liveProfileImage}
                      alt={`${exactQuestion.userPosted}'s avatar`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-xs flex items-center justify-center uppercase">
                      {exactQuestion.userPosted ? exactQuestion.userPosted.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                </div>

                {/* Credentials Block */}
                <div className="min-w-0 text-[11px] font-bold text-left">
                  <Link to={`/Users/${exactQuestion.userId}`} className="text-theme-text-main hover:text-theme-accent-primary block truncate">
                    {exactQuestion.userPosted}
                  </Link>
                  <span className="text-[9px] text-theme-text-dim uppercase tracking-wider block mt-0.5">
                    Author Profile
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </article>

      {/* ================= SECTION 2: SYSTEM RESOLUTIONS CONTEXT FEEDACKS ================= */}
      {exactQuestion.noOfAnswers !== 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-theme-text-dim px-1 text-left">
            {exactQuestion.noOfAnswers} System Resolutions
          </h2>
          <div className="w-full bg-theme-bg-surface/60 dark:bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl p-5 sm:p-6 shadow-2xs">
            <DisplayAnswer key={exactQuestion._id} question={exactQuestion} handleShare={handleShare} />
          </div>
        </section>
      )}

      {/* ================= SECTION 3: ANSWER INPUT CONSOLE ================= */}
      <section className="w-full bg-theme-bg-surface/60 dark:bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 text-left">
        <h3 className="text-sm font-black text-theme-text-main tracking-tight">
          Your answer
        </h3>

        <form onSubmit={(e) => handlePostAns(e, exactQuestion.answer.length)} className="space-y-4">
          <textarea
            value={Answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Post your answers or solutions here..."
            rows={6}
            className="w-full p-4 bg-theme-bg-main/50 border border-theme-border rounded-xl text-xs font-medium text-theme-text-main placeholder-theme-text-dim focus:outline-hidden focus:ring-1.5 focus:ring-theme-accent-primary focus:bg-theme-bg-surface transition-all duration-200 resize-none font-mono"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 h-10 text-xs font-bold text-white bg-theme-accent-primary hover:bg-theme-accent-hover rounded-xl shadow-xs shadow-theme-accent-primary/10 transition-all cursor-pointer active:scale-98"
          >
            Post Answer
          </button>
        </form>

        {/* Alternate Link Pipelines */}
        <footer className="text-[11px] font-semibold text-theme-text-dim pt-2 border-t border-theme-border/30 flex flex-wrap gap-1 items-center">
          <span>Browse alternate threads tagged under</span>
          {exactQuestion.questionTags.map((tag) => (
            <Link key={tag} to="/Tags" className="text-theme-accent-primary hover:underline px-0.5">
              #{tag}
            </Link>
          ))}
          <span>or launch a custom</span>
          <Link to="/AskQuestion" className="text-theme-accent-primary hover:underline">
            doubt registration form
          </Link>
          <span>.</span>
        </footer>
      </section>

      {/* ================= DYNAMIC INJECTED ALERTBOX ENGINE CONTROLLER ================= */}
      {alertConfig.isOpen && (
        <AlertBox
          message={alertConfig.message}
          title={alertConfig.title}
          variant={alertConfig.variant}
          confirmLabel={alertConfig.confirmLabel}
          cancelLabel={alertConfig.cancelLabel}
          onConfirm={alertConfig.onConfirm}
          onClose={closeAlert}
        />
      )}

    </div>
  );
};

export default QuestionDetails;
