import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { updateUserPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await updateUserPassword(newPassword);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1800);
    }
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Your new password must be at least 6 characters long."
    >
      <div className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start space-x-2 text-xs text-red-600 dark:text-red-400 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="p-5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex flex-col items-center space-y-2 text-emerald-600 dark:text-emerald-400 animate-fade-in text-center">
            <CheckCircle2 className="w-9 h-9" />
            <div className="text-sm font-bold">Password Reset Successfully!</div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Redirecting you to your feed...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                New Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm glass-input rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newPassword || !confirmPassword}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};
