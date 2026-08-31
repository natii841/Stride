import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ProgressRing } from './ProgressRing';
import {
  Moon,
  Sun,
  ShieldAlert,
  Sparkles,
  Flame,
  CheckCircle2,
  Footprints,
  BookOpen,
} from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isConfigured } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#FAFAFA] dark:bg-[#000000] text-neutral-900 dark:text-neutral-100 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full ambient-glow-1 pointer-events-none blur-3xl z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full ambient-glow-2 pointer-events-none blur-3xl z-0" />
      <div className="fixed top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-pink-500/5 to-purple-500/5 pointer-events-none blur-3xl z-0" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px] shadow-lg shadow-pink-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-[#121212] rounded-[10px] flex items-center justify-center">
              <span className="w-5 h-5 inline-flex items-center justify-center font-bold text-[#E1306C] text-sm leading-none select-none">
                S
              </span>
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] font-sans">
            Stride
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full border border-neutral-200/80 dark:border-[#282828] bg-white/80 dark:bg-[#141414]/80 hover:bg-white dark:hover:bg-[#1e1e1e] backdrop-blur-md text-neutral-700 dark:text-neutral-200 transition-all duration-200 shadow-sm active:scale-95"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-700" />
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Modern Interactive Visual Showcase (Desktop & Large screens) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-8 pr-4">
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-500/20 text-xs font-semibold text-pink-600 dark:text-pink-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Goal & Habit Progression</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.15] text-neutral-900 dark:text-white">
                Track your stride.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
                  Celebrate every milestone.
                </span>
              </h1>
              <p className="text-sm xl:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Experience an Instagram-inspired visual habit tracker. Monitor
                your reading, daily steps, hydration, and custom goals in
                real-time with synchronized cloud persistence.
              </p>
            </div>

            {/* Floating Visual Mockup Cards */}
            <div className="relative w-full max-w-md h-[270px]">
              {/* Mockup Card 1: Daily Steps (Top Left) */}
              <div className="absolute top-0 left-0 w-[270px] glass-card p-4 rounded-2xl animate-float-slow z-20 border-l-4 border-l-[#F56040]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F56040]/15 text-[#F56040] flex items-center justify-center">
                      <Footprints className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-neutral-900 dark:text-white">
                        Daily Steps
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        Activity Goal
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full flex items-center space-x-1">
                    <Flame className="w-3 h-3 fill-amber-500" />
                    <span>85%</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-sm">8,450</span>
                  <span className="text-neutral-400">/ 10,000 steps</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 dark:bg-[#252525] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F56040] rounded-full w-[85%]" />
                </div>
              </div>

              {/* Mockup Card 2: Atomic Habits (Bottom Right) */}
              <div className="absolute bottom-2 right-0 w-[290px] glass-card p-4 rounded-2xl animate-float-reverse z-30 border-l-4 border-l-[#E1306C]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#E1306C]/15 text-[#E1306C] flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-neutral-900 dark:text-white">
                        Atomic Habits
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        Reading List
                      </p>
                    </div>
                  </div>
                  <ProgressRing
                    percentage={78}
                    size={34}
                    strokeWidth={3.5}
                    color="#E1306C"
                  >
                    <span className="font-mono font-bold text-[8px]">78%</span>
                  </ProgressRing>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>250 / 320 pages</span>
                  <span className="text-emerald-500 flex items-center space-x-1 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>On Track</span>
                  </span>
                </div>
              </div>

              {/* Mockup Badge 3 (Top Right) */}
              <div className="absolute top-4 right-6 glass-panel px-3.5 py-2 rounded-2xl flex items-center space-x-2 shadow-lg z-10 animate-pulse-glow">
                <Sparkles className="w-4 h-4 text-[#E1306C]" />
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Live Goal Tracking ✨
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Modern Glass Auth Form */}
          <div className="w-full lg:col-span-5 flex flex-col items-center justify-center">
            {!isConfigured && (
              <div className="w-full max-w-[420px] mb-4 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-700 dark:text-amber-300 animate-fade-in backdrop-blur-md">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <span className="font-semibold">Setup Notice:</span> Provide
                  your Supabase credentials in{' '}
                  <code className="px-1 py-0.5 bg-amber-500/20 rounded font-mono text-[11px]">
                    .env
                  </code>{' '}
                  to connect real-time Postgres synchronization.
                </div>
              </div>
            )}

            <div className="w-full max-w-[420px] glass-card rounded-3xl p-6 sm:p-8 transition-all duration-300 relative">
              {/* Header inside Card */}
              <div className="text-center mb-6">
                <div className="lg:hidden flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px] shadow-md shadow-pink-500/20 flex items-center justify-center">
                    <div className="w-full h-full bg-white dark:bg-[#121212] rounded-[14px] flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#E1306C]" />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                  {title || 'Welcome to Stride'}
                </h2>
                {subtitle && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Form Content */}
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-5 px-6 text-center text-xs text-neutral-400 dark:text-neutral-600">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-2">
          <span className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer">
            About
          </span>
          <span className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer">
            Features
          </span>
          <span className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer">
            Security
          </span>
          <span className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer">
            Privacy
          </span>
          <span className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer">
            Terms
          </span>
        </div>
        <p>© 2026 Stride · Next-Gen Goal & Habit Platform</p>
      </footer>
    </div>
  );
};
