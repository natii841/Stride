import React, { useEffect } from 'react';
import { TrackingItem } from '../types/database';
import { Trophy, Sparkles, X } from 'lucide-react';

interface MilestoneCelebrationProps {
  item: TrackingItem | null;
  onClose: () => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({ item, onClose }) => {
  useEffect(() => {
    if (item) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-bounce">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-2xl shadow-pink-500/30 flex items-center justify-between space-x-3 border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-extrabold text-sm tracking-tight">
                Goal Smashed! 🎉
              </span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </div>
            <p className="text-xs text-white/90 truncate max-w-[200px]">
              You completed <strong>{item.title}</strong>!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
