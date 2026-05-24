import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../actions/auth';
import AlertBox from '../../components/AlertBox';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAlertMessage('Please enter both your email and password.');
      setShowAlert(true);
      return;
    }
    
    dispatch(login({ email, password }, navigate))
      .then((success) => {
        if (!success) {
          setAlertMessage('Invalid email or password. Please try again.');
          setShowAlert(true);
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        setAlertMessage('An error occurred during authentication. Please try again later.');
        setShowAlert(true);
      });
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-theme-bg-main px-4 py-12 transition-colors duration-200">
      
      {/* Dynamic Native Alert Notification Overlay Mount */}
      {showAlert && (
        <AlertBox message={alertMessage} onClose={() => setShowAlert(false)} />
      )}

      {/* Main Structural Portal Card */}
      <div className="w-full max-w-md bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xl p-8 transition-colors duration-200">
        
        {/* Portal Branding Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-extrabold tracking-tight text-theme-text-main">
            Queree<span className="text-theme-accent-primary">.</span>
          </Link>
          <p className="text-sm text-theme-text-muted mt-2">
            Welcome back! Log in to resolve your technical roadblocks.
          </p>
        </div>

        {/* Authentication Input Group Matrix */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Element Unit */}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2.5 bg-theme-bg-main border border-theme-border rounded-xl text-sm text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all"
            />
          </div>

          {/* Password Element Unit */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs font-semibold text-theme-accent-primary hover:text-theme-accent-hover hover:underline cursor-pointer transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <input 
              type="password" 
              name="password" 
              id="password" 
              autoComplete="current-password"
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2.5 bg-theme-bg-main border border-theme-border rounded-xl text-sm text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all"
            />
          </div>

          {/* Submission Control Module */}
          <button 
            type="submit" 
            className="w-full mt-2 py-3 rounded-xl text-sm font-bold tracking-wide text-white bg-theme-accent-primary hover:bg-theme-accent-hover transition-colors shadow-md shadow-theme-accent-primary/10 cursor-pointer active:scale-[0.99]"
          >
            Log In
          </button>
        </form>

        {/* Footer Gateway Selection Toggle Interface */}
        <div className="mt-8 pt-6 border-t border-theme-border/60 text-center">
          <p className="text-sm text-theme-text-muted">
            Don't have an account yet?{' '}
            <button 
              type="button" 
              onClick={() => navigate('/signup')} 
              className="font-bold text-theme-accent-primary hover:text-theme-accent-hover hover:underline cursor-pointer transition-colors ml-1"
            >
              Sign up
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
