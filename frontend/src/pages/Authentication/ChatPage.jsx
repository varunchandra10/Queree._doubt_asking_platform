import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import Chatbot from "../../components/Chatbot";
import AuthCard from "./AuthCard";
import { sendOtp, verifyOtp } from "../../api";

const ChatbotPage = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  async function onSignup() {
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await sendOtp({ email });
      setShowOTP(true);
      toast.success("OTP sent successfully to your email.");
    } catch (error) {
      console.error("OTP dispatch failure:", error);
      toast.error(error?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function onOTPVerify() {
    if (otp.length < 6) {
      toast.error("Please enter a complete 6-digit verification pin.");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      setUser({ email });
      toast.success("Identity verified. Initializing Bot Assistance context.");
    } catch (error) {
      console.error("Verification breakdown:", error);
      toast.error(error?.response?.data?.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex max-w-7xl mx-auto gap-6 px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-4rem)] bg-theme-bg-main transition-colors duration-200">
      <Toaster toastOptions={{ duration: 4000 }} />

      {/* Primary Activity Hub Workspace Layout Viewport */}
      <main className="flex-1 py-6 min-w-0 flex flex-col items-center justify-center">
        {user ? (
          /* Active State View: Yields full bleed responsive layout space for the RAG chat engine */
          <div className="w-full h-full flex flex-col animate-fade-in">
            <Chatbot />
          </div>
        ) : (
          /* Locked State View: Mounts isolation gatekeeper authentication interface sheet */
          <AuthCard 
            otp={otp}
            setOtp={setOtp}
            email={email}
            setEmail={setEmail}
            loading={loading}
            showOTP={showOTP}
            onSignup={onSignup}
            onOTPVerify={onOTPVerify}
          />
        )}
      </main>

      {/* Styled Override Injection Layer preserving dynamic style skin token hierarchies */}
      <style>{`
        .custom-email-wrapper input {
          width: 100% !important;
          height: 42px !important;
          background-color: var(--color-theme-bg-main, #f8fafc) !important;
          border: 1px solid var(--color-theme-border, #e2e8f0) !important;
          color: var(--color-theme-text-main, #0f172a) !important;
          border-radius: 12px !important;
          font-size: 14px !important;
        }
        .custom-otp-wrapper input {
          width: 40px !important;
          height: 44px !important;
          font-size: 16px !important;
          font-weight: 700 !important;
          background-color: var(--color-theme-bg-main, #f8fafc) !important;
          color: var(--color-theme-text-main, #0f172a) !important;
          border: 1px solid var(--color-theme-border, #e2e8f0) !important;
          border-radius: 10px !important;
        }
        .custom-otp-wrapper input:focus {
          outline: none !important;
          border-color: var(--color-theme-accent-primary, #4f46e5) !important;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default ChatbotPage;