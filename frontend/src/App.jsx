import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';

import Navbar from './components/Navbar'
import LeftSidebar from './components/Leftsidebar';
import Chatbot from './components/Chatbot';
import AlertBox from './components/AlertBox';
import Allroutes from './Allroutes';
import { APP_ALERT_EVENT } from './utils/appAlert';

import { fetchAllQuestions } from './actions/question'
import { fetchAllUsers } from './actions/users';
import { checkSubscription } from './actions/Subscription';
import { fetchPosts } from './actions/posts';

const AppShell = () => {
  const dispatch = useDispatch()
  const User = useSelector((state) => state.currentUserReducer);
  const location = useLocation();
  
  // Single, unified source of truth for the mobile layout state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: '',
    title: '',
    variant: 'warning',
    confirmLabel: 'Got it',
    cancelLabel: undefined,
    onConfirm: null,
  });

  useEffect(() => {
    dispatch(fetchAllQuestions())
    dispatch(fetchAllUsers())
    dispatch(fetchPosts())
  }, [dispatch])

  const userId = User?.result?._id;
  useEffect(() => {
    if (userId) {
      dispatch(checkSubscription(userId));
    }
  }, [dispatch, userId])

  useEffect(() => {
    setIsChatOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleAppAlert = (event) => {
      const detail = event.detail || {};
      setAlertConfig({
        isOpen: true,
        message: detail.message || '',
        title: detail.title || '',
        variant: detail.variant || 'warning',
        confirmLabel: detail.confirmLabel || 'Got it',
        cancelLabel: detail.cancelLabel,
        onConfirm: detail.onConfirm || null,
      });
    };

    window.addEventListener(APP_ALERT_EVENT, handleAppAlert);
    return () => window.removeEventListener(APP_ALERT_EVENT, handleAppAlert);
  }, []);

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  const handleChatbotClick = () => {
    if (User === null) {
      setAlertConfig({
        isOpen: true,
        message: 'Authentication required. Please log in or register to use the chatbot.',
        title: 'Action Required',
        variant: 'warning',
        confirmLabel: 'Got it',
        cancelLabel: undefined,
        onConfirm: null,
      });
      return;
    }

    setIsChatOpen((open) => !open);
  };

  return (
    <div className="min-h-screen bg-theme-bg-main transition-colors duration-200">
      <Navbar onToggleSidebar={() => setSidebarOpen((open) => !open)} />
      {User === null ? (
        <LeftSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      ) : (
        <>
          <div className="lg:hidden">
            <LeftSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          </div>
          <div className="hidden lg:block">
            <LeftSidebar variant="static" />
          </div>
        </>
      )}
      <div className={User !== null ? 'lg:pl-64' : ''}>
        <Allroutes />
      </div>

      {!isAuthRoute ? (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 select-none">
          {isChatOpen ? (
            <div className="w-[min(92vw,24rem)] h-[34rem] max-h-[calc(100vh-7rem)] overflow-hidden rounded-3xl border border-theme-border bg-theme-bg-main shadow-2xl shadow-black/20 animate-scale-up">
              <Chatbot embedded onClose={() => setIsChatOpen(false)} />
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleChatbotClick}
            className="group inline-flex h-14 w-14 items-center justify-center rounded-full bg-theme-accent-primary text-white shadow-lg shadow-theme-accent-primary/20 ring-4 ring-theme-bg-surface transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            aria-label={isChatOpen ? 'Close chatbot' : 'Open chatbot'}
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <svg className={`h-6 w-6 transition-transform duration-300 ${isChatOpen ? 'rotate-90 scale-90' : 'group-hover:scale-105'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m-8 5l-1.5 4 4-1.5A9 9 0 1119 4.5 9 9 0 014 18z" />
              </svg>
            </span>
          </button>
        </div>
      ) : null}

      {alertConfig.isOpen ? (
        <AlertBox
          message={alertConfig.message}
          title={alertConfig.title}
          variant={alertConfig.variant}
          confirmLabel={alertConfig.confirmLabel}
          cancelLabel={alertConfig.cancelLabel}
          onConfirm={alertConfig.onConfirm}
          onClose={() =>
            setAlertConfig((prev) => ({
              ...prev,
              isOpen: false,
              onConfirm: null,
            }))
          }
        />
      ) : null}
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <AppShell />
    </Router>
  );
};

export default App
