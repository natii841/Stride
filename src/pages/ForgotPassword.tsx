import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Mail, KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { resetPasswordForEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await resetPasswordForEmail(email);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your account email and we'll send you a password recovery link."
    >
      <div className="space-y-4">
        {/* Key Lock Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f09433]/20 via-[#dc2743]/20 to-[#bc1888]/20 border border-[#E1306C]/30 flex items-center justify-center shadow-lg">
            <KeyRound className="w-7 h-7 text-[#E1306C]" />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start space-x-2 text-xs text-red-600 dark:text-red-400 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-4 text-center animate-fade-in">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex flex-col items-center space-y-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
              <div className="text-sm font-bold">Recovery Link Sent</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Check your inbox at <strong>{email}</strong> for instructions to reset your password.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block w-full py-3 px-4 rounded-xl bg-neutral-100 dark:bg-[#1e1e1e] hover:bg-neutral-200 dark:hover:bg-[#252525] text-xs font-bold text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm glass-input rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        )}

        {/* Back to login */}
        <div className="pt-4 border-t border-neutral-200/60 dark:border-[#262626] text-center">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
