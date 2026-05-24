import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../actions/auth';
import AboutAuth from './AboutAuth';
import AlertBox from '../../components/AlertBox';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAlertMessage('Please enter both an email and a password.');
      return;
    }
    if (!name.trim()) {
      setAlertMessage('Please enter a display name to continue.');
      return;
    }
    dispatch(signup({ name, email, password }, navigate));
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-theme-bg-main px-4 py-12 transition-colors duration-200">
      {alertMessage ? (
        <AlertBox message={alertMessage} onClose={() => setAlertMessage('')} />
      ) : null}
      
      {/* Outer Layout Matrix: Splits copy features on desktop viewports */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-16">
        
        {/* Left Side: Premium Info Copy Panel (Hidden on mobile phones for tight spacing) */}
        <div className="hidden md:block flex-1">
          <AboutAuth />
        </div>

        {/* Right Side: Card Form Panel Container */}
        <div className="w-full max-w-md bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xl p-8 transition-colors duration-200 shrink-0">
          
          <div className="mb-6 md:hidden text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-theme-text-main">
              Join Queree<span className="text-theme-accent-primary">.</span>
            </h2>
            <p className="text-xs text-theme-text-muted mt-1">Create an account to clear structural coding roadblocks.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field 1: Display Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
                Display Name
              </label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                autoComplete="name"
                placeholder="e.g. Alex" 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-2.5 bg-theme-bg-main border border-theme-border rounded-xl text-sm text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all"
              />
            </div>

            {/* Field 2: Email Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
                Email Address
              </label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                autoComplete="email"
                placeholder="alex@example.com" 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-2.5 bg-theme-bg-main border border-theme-border rounded-xl text-sm text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all"
              />
            </div>

            {/* Field 3: Password Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                autoComplete="new-password"
                value={password} 
                placeholder="••••••••" 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2.5 bg-theme-bg-main border border-theme-border rounded-xl text-sm text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all"
              />
            </div>

            {/* Field 4: Legal Consent Opt-in Checkbox */}
            <label htmlFor="check" className="flex items-start gap-2.5 pt-1 cursor-pointer group select-none">
              <input 
                type="checkbox" 
                id="check" 
                className="mt-1 accent-theme-accent-primary rounded cursor-pointer h-4 w-4"
              />
              <p className="text-xs text-theme-text-muted leading-normal group-hover:text-theme-text-main transition-colors">
                Opt-in to receive occasional platform updates, expert digests, and system notifications.
              </p>
            </label>

            {/* Submit Register Control */}
            <button 
              type="submit" 
              className="w-full mt-2 py-3 rounded-xl text-sm font-bold tracking-wide text-white bg-theme-accent-primary hover:bg-theme-accent-hover transition-colors shadow-md shadow-theme-accent-primary/10 cursor-pointer active:scale-[0.99]"
            >
              Sign Up
            </button>

            {/* Terms Disclaimer Text Block */}
            <p className="text-[11px] text-theme-text-dim leading-normal text-center mt-3">
              By clicking "Sign up", you agree to our{' '}
              <span className="text-theme-text-muted hover:text-theme-accent-primary font-semibold transition-colors cursor-pointer underline">terms of service</span>,{' '}
              <span className="text-theme-text-muted hover:text-theme-accent-primary font-semibold transition-colors cursor-pointer underline">privacy policy</span> and{' '}
              <span className="text-theme-text-muted hover:text-theme-accent-primary font-semibold transition-colors cursor-pointer underline">cookie policy</span>.
            </p>
          </form>

          {/* Footer Navigation Redirection Interface */}
          <div className="mt-6 pt-5 border-t border-theme-border/60 text-center">
            <p className="text-sm text-theme-text-muted">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => navigate('/login')} 
                className="font-bold text-theme-accent-primary hover:text-theme-accent-hover hover:underline cursor-pointer transition-colors ml-1"
              >
                Log in
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
