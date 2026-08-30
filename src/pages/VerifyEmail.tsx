import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { MailCheck, RefreshCw, Send, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const { user, isEmailVerified, resendVerificationEmail, refreshSession, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const passedEmail = (location.state as { email?: string })?.email;
  const email = user?.email || passedEmail || 'your email';

  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (isEmailVerified) {
      navigate('/', { replace: true });
    }
  }, [isEmailVerified, navigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    setErrorMessage(null);
    setResendSuccess(false);
    setIsResending(true);

    const { error } = await resendVerificationEmail(email);
    setIsResending(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setResendSuccess(true);
      setCooldown(60);
    }
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setErrorMessage(null);
    await refreshSession();
    setIsChecking(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Almost there! Please verify your email to unlock your Stride feed."
    >
      <div className="space-y-5 text-center">
        {/* Animated Mail Icon with Glowing Ring */}
        <div className="flex justify-center my-2">
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-[#f09433]/20 via-[#dc2743]/20 to-[#bc1888]/20 flex items-center justify-center p-4 border border-[#E1306C]/30 shadow-lg animate-pulse-glow">
            <MailCheck className="w-9 h-9 text-[#E1306C]" />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start space-x-2 text-xs text-red-600 dark:text-red-400 text-left animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-start space-x-2 text-xs text-emerald-600 dark:text-emerald-400 text-left animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              A fresh verification link has been sent to <strong>{email}</strong>.
            </span>
          </div>
        )}

        <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <p>We've sent a secure activation link to:</p>
          <div className="py-1.5 px-3.5 bg-neutral-100 dark:bg-[#1c1c1c] rounded-xl font-mono font-bold text-neutral-900 dark:text-neutral-100 inline-block max-w-full truncate border border-neutral-200 dark:border-[#2e2e2e]">
            {email}
          </div>
          <p>
            Tap the link in the message to activate your account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.99]"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking status...' : "I've verified my email"}</span>
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-[#333] hover:bg-neutral-100 dark:hover:bg-[#1c1c1c] text-neutral-700 dark:text-neutral-300 font-semibold text-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : isResending
                ? 'Sending...'
                : 'Resend verification email'}
            </span>
          </button>
        </div>

        {/* Logout / Switch Account */}
        <div className="pt-3 border-t border-neutral-200/60 dark:border-[#262626] flex justify-center">
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign in with different account</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
