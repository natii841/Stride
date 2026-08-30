import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { GoogleButton } from '../components/GoogleButton';
import { Mail, Lock, User, AtSign, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const { error, user } = await signUp(email, password, fullName, username);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      if (user && !user.email_confirmed_at) {
        navigate('/verify-email', { state: { email } });
      } else {
        navigate('/');
      }
    }
  };

  const handleGoogleSignUp = async () => {
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
      title="Create Your Account"
      subtitle="Join Stride to start tracking and visualizing your goals."
    >
      <div className="space-y-4">
        {/* Google OAuth Quick Sign Up */}
        <GoogleButton
          onClick={handleGoogleSignUp}
          loading={isGoogleLoading}
          text="Sign up with Google"
        />

        {/* Divider */}
        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-neutral-200 dark:border-[#2e2e2e] w-full" />
          <span className="bg-transparent px-3 text-xs font-bold uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">
            OR
          </span>
          <div className="border-t border-neutral-200 dark:border-[#2e2e2e] w-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMessage && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start space-x-2.5 text-xs text-red-600 dark:text-red-400 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Email Address *
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

          {/* Full Name & Username grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-neutral-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-8 pr-3 py-2.5 text-sm glass-input rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Username
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-neutral-400">
                  <AtSign className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  placeholder="janedoe"
                  className="w-full pl-8 pr-3 py-2.5 text-sm glass-input rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Password *
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
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

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center leading-normal pt-1">
            By signing up, you agree to our <span className="text-[#3897F0] cursor-pointer">Terms</span> and{' '}
            <span className="text-[#3897F0] cursor-pointer">Privacy Policy</span>.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>
      </div>

      {/* Switch to Login */}
      <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-[#262626] text-center text-xs text-neutral-600 dark:text-neutral-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-[#E1306C] hover:underline transition-colors"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
