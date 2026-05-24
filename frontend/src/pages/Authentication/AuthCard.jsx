import React from "react";
import { BsEnvelopeFill, BsFillShieldLockFill } from "react-icons/bs";
import OtpInputComponent from "otp-input-react";

const OtpInput = OtpInputComponent.default || OtpInputComponent;

const AuthCard = ({ 
  otp, 
  setOtp, 
  email,
  setEmail,
  loading, 
  showOTP, 
  onSignup, 
  onOTPVerify 
}) => {
  return (
    <div className="w-full max-w-md bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xl p-8 transition-colors duration-200 text-center animate-fade-in flex flex-col items-center">
      
      {/* Component Layout Metadata Headers */}
      <header className="mb-6">
        <h1 className="text-xl font-extrabold tracking-tight text-theme-text-main leading-tight">
          Secure Portal Authentication
        </h1>
        <p className="text-xs text-theme-text-muted mt-2 max-w-xs mx-auto leading-normal">
          Verify identity parameters to initialize real-time RAG-guided multi-lingual assistance frameworks.
        </p>
      </header>

      {showOTP ? (
        /* OTP Pin Code Submission Interface Context Grid */
        <div className="w-full flex flex-col items-center space-y-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 shadow-2xs">
            <BsFillShieldLockFill size={22} />
          </div>
          
          <div className="w-full flex flex-col gap-1.5">
            <label htmlFor="otp" className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
              Verification Passcode
            </label>
            <div className="py-2 custom-otp-wrapper flex justify-center">
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={loading}
                autoFocus
                className="opt-container flex gap-2"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onOTPVerify}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-theme-accent-primary hover:bg-theme-accent-hover disabled:bg-theme-border disabled:cursor-not-allowed transition-colors shadow-md shadow-theme-accent-primary/10 cursor-pointer active:scale-[0.99]"
          >
            {loading ? "Verifying Credentials..." : "Confirm Verification Pin"}
          </button>
        </div>
      ) : (
        /* Email Capture Submission Interface Context Grid */
        <div className="w-full flex flex-col items-center space-y-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-theme-accent-primary/10 text-theme-accent-primary shadow-2xs">
            <BsEnvelopeFill size={20} />
          </div>
          
          <div className="w-full flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-theme-text-muted text-center block">
              Email Address
            </label>
            <div className="custom-email-wrapper pt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-theme-bg-main border border-theme-border rounded-xl text-sm text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onSignup}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-theme-accent-primary hover:bg-theme-accent-hover disabled:bg-theme-border disabled:cursor-not-allowed transition-colors shadow-md shadow-theme-accent-primary/10 cursor-pointer active:scale-[0.99]"
          >
            {loading ? "Requesting Verification Code..." : "Send Verification Code"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthCard;