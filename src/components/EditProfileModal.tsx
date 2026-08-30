import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, AtSign, FileText, Sparkles, CheckCircle2, AlertCircle, Shuffle } from 'lucide-react';

const AVATAR_PRESETS = [
  'Felix',
  'Aneka',
  'Liam',
  'Sophia',
  'Alex',
  'Maya',
  'Leo',
  'Zoe',
  'Ethan',
  'Chloe',
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setAvatarUrl(profile.avatar_url || '');
      setBio(profile.bio || '');
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
  };

  const handleSelectPreset = (seed: string) => {
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(false);

    if (!fullName.trim() || !username.trim()) {
      setErrorMessage('Full name and username are required.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await updateProfile({
      full_name: fullName.trim(),
      username: username.trim().toLowerCase().replace(/\s+/g, '_'),
      avatar_url: avatarUrl.trim() || undefined,
      bio: bio.trim() || undefined,
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#181818] border border-neutral-200 dark:border-[#2e2e2e] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-[#262626] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              Edit Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start space-x-2 text-xs text-red-600 dark:text-red-400 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-start space-x-2 text-xs text-emerald-600 dark:text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">Profile updated successfully!</span>
            </div>
          )}

          {/* Avatar Preview & Presets */}
          <div className="flex flex-col items-center justify-center space-y-3 py-1">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shadow-pink-500/20">
                <img
                  src={avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stride'}
                  alt="Avatar preview"
                  className="w-full h-full rounded-full object-cover bg-white dark:bg-[#121212] border-2 border-white dark:border-[#121212]"
                />
              </div>
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md hover:scale-110 active:scale-95 transition-all"
                title="Randomize Avatar"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Avatar Preset Quick Choices */}
            <div className="space-y-1 w-full text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Avatar Styles
              </span>
              <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="w-7 h-7 rounded-full overflow-hidden border border-neutral-300 dark:border-[#333] hover:scale-110 active:scale-95 transition-all flex-shrink-0"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${preset}`}
                      alt={preset}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Full Name *
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-neutral-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm glass-input rounded-xl"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Username *
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-neutral-400">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="janedoe"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm glass-input rounded-xl"
              />
            </div>
          </div>

          {/* Bio / Headline */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Bio / Goal Mantra
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-3 text-neutral-400">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. 10k daily steps walker & non-fiction reader 📚"
                rows={2}
                maxLength={120}
                className="w-full pl-10 pr-4 py-2 text-sm glass-input rounded-xl resize-none"
              />
            </div>
            <span className="text-[10px] text-neutral-400 block text-right">
              {bio.length}/120
            </span>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-neutral-300 dark:border-[#333] hover:bg-neutral-100 dark:hover:bg-[#222] text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !fullName.trim() || !username.trim()}
              className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center space-x-1.5 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Save Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
