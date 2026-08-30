import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { GoogleButton } from '../components/GoogleButton';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { signInWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signInWithPassword(email, password);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setErrorMessage('Invalid email or password. Please double check.');
      } else if (error.message.includes('Email not confirmed')) {
        setErrorMessage('Your email address is pending verification.');
        setTimeout(() => {
          navigate('/verify-email', { state: { email } });
        }, 1200);
      } else {
        setErrorMessage(error.message);
      }
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to track your goals, progress and milestones."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start space-x-2.5 text-xs text-red-600 dark:text-red-400 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Email or Username
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

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#3897F0] hover:text-[#287dc9] dark:hover:text-[#52a7f5] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-neutral-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-10 py-2.5 text-sm glass-input rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !email || !password}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Sign In</span>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-neutral-200 dark:border-[#2e2e2e] w-full" />
          <span className="bg-transparent px-3 text-xs font-bold uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">
            OR
          </span>
          <div className="border-t border-neutral-200 dark:border-[#2e2e2e] w-full" />
        </div>

        {/* Google OAuth */}
        <GoogleButton
          onClick={handleGoogleSignIn}
          loading={isGoogleLoading}
          text="Continue with Google"
        />
      </form>

      {/* Switch to Sign Up */}
      <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-[#262626] text-center text-xs text-neutral-600 dark:text-neutral-400">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="font-bold text-[#E1306C] hover:underline transition-colors"
        >
          Create one for free
        </Link>
      </div>
    </AuthLayout>
  );
};
