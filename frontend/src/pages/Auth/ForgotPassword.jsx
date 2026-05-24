import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LoaderCircle, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import {
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from '../../api';

const OTP_LENGTH = 6;
const OTP_SECONDS = 60;

const passwordChecks = [
  { key: 'length', label: '8+ characters' },
  { key: 'number', label: 'Contains a number' },
  { key: 'symbol', label: 'Contains a symbol' },
];

const createOtpArray = () => Array.from({ length: OTP_LENGTH }, () => '');

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(createOtpArray());
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpExpiresIn, setOtpExpiresIn] = useState(OTP_SECONDS);
  const [otpVerified, setOtpVerified] = useState(false);
  const inputRefs = useRef([]);

  const otp = useMemo(() => otpValues.join(''), [otpValues]);

  const passwordState = useMemo(() => {
    const value = newPassword;
    return {
      length: value.length >= 8,
      number: /\d/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value),
    };
  }, [newPassword]);

  const passwordMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  useEffect(() => {
    if (step !== 2) return;

    setOtpExpiresIn(OTP_SECONDS);
    const timer = window.setInterval(() => {
      setOtpExpiresIn((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step === 2) {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  const focusIndex = (index) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select?.();
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await requestPasswordResetOtp({ email });
      setStep(2);
      setSuccess('OTP sent. Check your inbox.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to start password recovery.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const nextDigit = value.replace(/\D/g, '').slice(-1);
    const nextValues = [...otpValues];
    nextValues[index] = nextDigit;
    setOtpValues(nextValues);

    if (nextDigit && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpValues[index] && index > 0) {
      focusIndex(index - 1);
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      focusIndex(index - 1);
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handleOtpPaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    event.preventDefault();
    const nextValues = createOtpArray();
    pasted.split('').forEach((digit, index) => {
      nextValues[index] = digit;
    });
    setOtpValues(nextValues);
    focusIndex(Math.min(pasted.length, OTP_LENGTH) - 1);
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (otp.length !== OTP_LENGTH) {
      setError('Enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      await verifyPasswordResetOtp({ email, otp });
      setOtpVerified(true);
      setStep(3);
      setSuccess('OTP verified. Set your new password.');
    } catch (err) {
      setError(err?.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpExpiresIn > 0 || loading) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await requestPasswordResetOtp({ email });
      setOtpValues(createOtpArray());
      setOtpExpiresIn(OTP_SECONDS);
      setSuccess('OTP resent successfully.');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setError('');

    if (!passwordState.length || !passwordState.number || !passwordState.symbol) {
      setError('Please satisfy all password checks.');
      return;
    }

    if (!passwordMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, otp, password: newPassword });
      setSuccess('Password updated successfully. Redirecting to login...');
      window.setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderStatusPill = (active) => (
    <span className={`inline-flex h-2 w-2 rounded-full ${active ? 'bg-theme-accent-primary animate-pulse' : 'bg-theme-border'}`} />
  );

  return (
    <div className="min-h-[100vh] w-full bg-theme-bg-main px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-200">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
        <div className="rounded-3xl border border-theme-border bg-theme-bg-surface/80 backdrop-blur-xl shadow-xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-theme-accent-primary/5 via-transparent to-transparent" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <Link to="/login" className="text-sm font-semibold text-theme-text-muted hover:text-theme-text-main transition-colors">
                ← Back to login
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-theme-border bg-theme-bg-main/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-theme-text-dim">
                <Sparkles className="h-3.5 w-3.5 text-theme-accent-primary" />
                Secure reset flow
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-theme-text-main">
                Forgot password
              </h1>
              <p className="mt-3 max-w-xl text-sm sm:text-base text-theme-text-muted leading-relaxed">
                Recover access through a clean three-step recovery path: verify your email, confirm a one-time code, then lock in a new password.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { title: 'Email', copy: 'Identify the account' },
                { title: 'OTP', copy: 'Confirm the code' },
                { title: 'Password', copy: 'Create a new secret' },
              ].map((item, index) => (
                <div key={item.title} className={`rounded-2xl border p-4 transition-all ${step === index + 1 ? 'border-theme-accent-primary bg-theme-accent-primary/5' : 'border-theme-border bg-theme-bg-main/60'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStatusPill(step === index + 1)}
                    <span className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">Step {index + 1}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-theme-text-main">{item.title}</h3>
                  <p className="mt-1 text-xs text-theme-text-dim">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-10 grid grid-cols-2 gap-3 text-xs text-theme-text-dim">
            <div className="rounded-2xl border border-theme-border bg-theme-bg-main/70 p-4">
              <p className="uppercase tracking-wider font-bold text-theme-text-muted mb-1">Error handling</p>
              <p>Inline state uses the theme border system for clear, low-noise failures.</p>
            </div>
            <div className="rounded-2xl border border-theme-border bg-theme-bg-main/70 p-4">
              <p className="uppercase tracking-wider font-bold text-theme-text-muted mb-1">Micro motion</p>
              <p>Buttons, cards, and inputs remain click-responsive with soft transitions.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-theme-border bg-theme-bg-surface shadow-xl p-5 sm:p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            {(error || success) && (
              <div className={`mb-5 rounded-2xl border border-theme-border px-4 py-3 text-sm ${error ? 'text-rose-300 bg-rose-500/5' : 'text-emerald-300 bg-emerald-500/5'}`}>
                {error || success}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-5 animate-fade-in">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-theme-text-dim mb-3">Step 1 · Email identification</p>
                  <label className="block text-sm font-semibold text-theme-text-main mb-2" htmlFor="forgot-email">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-text-dim" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-theme-border bg-theme-bg-main pl-11 pr-4 py-3.5 text-sm text-theme-text-main placeholder:text-theme-text-dim outline-none focus:ring-2 focus:ring-theme-accent-primary/70 transition-all"
                    />
                  </div>
                  <p className="mt-2 text-xs text-theme-text-dim">We’ll send a recovery code to this inbox.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-theme-accent-primary px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-theme-accent-primary/10 transition-all hover:bg-theme-accent-hover active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Sending code
                    </span>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-theme-text-dim mb-3">Step 2 · OTP verification console</p>
                  <h2 className="text-2xl font-black text-theme-text-main">Enter the 6-digit code</h2>
                  <p className="mt-2 text-sm text-theme-text-muted">Sent to {email}. Digits auto-advance and backspace moves cleanly across the grid.</p>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-theme-border bg-theme-bg-main px-4 py-3 text-xs text-theme-text-muted">
                  <span>OTP expires in {String(Math.floor(otpExpiresIn / 60)).padStart(2, '0')}:{String(otpExpiresIn % 60).padStart(2, '0')}</span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className={`font-semibold transition-colors ${otpExpiresIn > 0 ? 'text-theme-text-dim cursor-not-allowed' : 'text-theme-accent-primary hover:text-theme-accent-hover'}`}
                    disabled={otpExpiresIn > 0 || loading}
                  >
                    Resend OTP
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                  {otpValues.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      value={digit}
                      onChange={(event) => handleOtpChange(index, event.target.value)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      maxLength={1}
                      inputMode="numeric"
                      className="h-14 rounded-2xl border border-theme-border bg-theme-bg-main text-center text-lg font-bold text-theme-text-main outline-none transition-all focus:border-theme-accent-primary focus:ring-2 focus:ring-theme-accent-primary/40 active:scale-98"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-theme-accent-primary px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-theme-accent-primary/10 transition-all hover:bg-theme-accent-hover active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  Verify code
                </button>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handlePasswordReset} className="space-y-5 animate-fade-in">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-theme-text-dim mb-3">Step 3 · Password update dashboard</p>
                  <h2 className="text-2xl font-black text-theme-text-main">Set a new password</h2>
                  <p className="mt-2 text-sm text-theme-text-muted">OTP verified for {email}. Create a password that meets the baseline security checks below.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-theme-text-main mb-2" htmlFor="new-password">New Password</label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="Create a strong password"
                        className="w-full rounded-2xl border border-theme-border bg-theme-bg-main px-4 py-3.5 pr-12 text-sm text-theme-text-main placeholder:text-theme-text-dim outline-none focus:ring-2 focus:ring-theme-accent-primary/70 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-theme-text-dim hover:text-theme-text-main transition-colors"
                        aria-label="Toggle new password visibility"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-theme-text-main mb-2" htmlFor="confirm-password">Confirm Password</label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Re-enter password"
                        className="w-full rounded-2xl border border-theme-border bg-theme-bg-main px-4 py-3.5 pr-12 text-sm text-theme-text-main placeholder:text-theme-text-dim outline-none focus:ring-2 focus:ring-theme-accent-primary/70 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-theme-text-dim hover:text-theme-text-main transition-colors"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-theme-border bg-theme-bg-main p-4 space-y-2">
                  {passwordChecks.map((check) => {
                    const passed = passwordState[check.key];
                    return (
                      <div key={check.key} className={`flex items-center justify-between text-xs ${passed ? 'text-emerald-300' : 'text-theme-text-dim'}`}>
                        <span>{check.label}</span>
                        <span>{passed ? '✓' : '—'}</span>
                      </div>
                    );
                  })}
                  <div className={`flex items-center justify-between text-xs ${passwordMatch ? 'text-emerald-300' : 'text-theme-text-dim'}`}>
                    <span>Passwords match</span>
                    <span>{passwordMatch ? '✓' : '—'}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-theme-accent-primary px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-theme-accent-primary/10 transition-all hover:bg-theme-accent-hover active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Update password'}
                </button>
              </form>
            )}

            <div className="mt-6 rounded-2xl border border-theme-border bg-theme-bg-main px-4 py-3 text-xs text-theme-text-dim">
              Recovery state: <span className="text-theme-text-main font-semibold">{step === 1 ? 'Email capture' : step === 2 ? 'OTP active' : otpVerified ? 'Password ready' : 'Locked'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;