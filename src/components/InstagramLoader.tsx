import React from 'react';
import { Sparkles } from 'lucide-react';

export const InstagramLoader: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-[#000000] text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <div className="relative flex flex-col items-center">
        {/* Animated Brand Logo Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px] animate-pulse-glow shadow-lg">
          <div className="w-full h-full bg-white dark:bg-[#121212] rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#E1306C] animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        
        {/* Logo Text */}
        <h1 className="mt-4 text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#E1306C] via-[#833AB4] to-[#F56040] font-sans">
          Stride
        </h1>

        <div className="mt-8 flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-[#E1306C] animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#833AB4] animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#F56040] animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center">
        <span className="text-xs text-neutral-400 dark:text-neutral-600 uppercase tracking-widest font-semibold">
          from Stride Labs
        </span>
      </div>
    </div>
  );
};
