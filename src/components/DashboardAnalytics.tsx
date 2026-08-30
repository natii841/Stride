import React from 'react';
import { Category, TrackingItem } from '../types/database';
import { ProgressRing } from './ProgressRing';
import { Trophy, Zap, Target, TrendingUp, CheckCircle2 } from 'lucide-react';

interface DashboardAnalyticsProps {
  categories: Category[];
  items: TrackingItem[];
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ items }) => {
  const totalItems = items.length;
  const completedItems = items.filter((it) => it.current_value >= it.target_value);
  const completedCount = completedItems.length;

  // Compute overall average completion score
  const overallPercentage =
    totalItems === 0
      ? 0
      : Math.round(
          items.reduce((acc, curr) => {
            const ratio = Math.min(1, curr.current_value / curr.target_value);
            return acc + ratio;
          }, 0) /
            totalItems *
            100
        );

  // Dynamic volume breakdowns from live Supabase tracking items
  const totalPages = items
    .filter((it) => it.unit.toLowerCase().includes('page'))
    .reduce((acc, curr) => acc + curr.current_value, 0);

  const totalSteps = items
    .filter((it) => it.unit.toLowerCase().includes('step'))
    .reduce((acc, curr) => acc + curr.current_value, 0);

  const totalLiters = items
    .filter((it) => it.unit.toLowerCase().includes('liter') || it.unit.toLowerCase().includes('l'))
    .reduce((acc, curr) => acc + curr.current_value, 0);

  return (
    <section className="bg-white dark:bg-[#121212] sm:border sm:border-neutral-200 dark:sm:border-[#262626] sm:rounded-2xl p-4 shadow-sm space-y-4 transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Today's Stride Metrics
            </h2>
            <p className="text-[11px] text-neutral-400">Live Supabase Sync</p>
          </div>
        </div>

        {/* Dynamic Goals Count Badge */}
        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-[#1c1c1c] border border-neutral-200/80 dark:border-[#282828] text-neutral-700 dark:text-neutral-300 text-xs font-semibold">
          <span>{totalItems} {totalItems === 1 ? 'Goal' : 'Goals'}</span>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-[#181818] dark:to-[#141414] border border-neutral-200/80 dark:border-[#282828] flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
            Overall Completion Rate
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white">
              {overallPercentage}%
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              across {totalItems} {totalItems === 1 ? 'goal' : 'goals'}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {completedCount} of {totalItems} milestones smashed
            </span>
          </div>
        </div>

        {/* Dynamic Progress Ring */}
        <ProgressRing
          percentage={overallPercentage}
          size={64}
          strokeWidth={5}
          color="#E1306C"
          gradientColors={['#f09433', '#bc1888']}
        >
          <span className="font-mono font-bold text-xs text-neutral-800 dark:text-neutral-200">
            {overallPercentage}%
          </span>
        </ProgressRing>
      </div>

      {/* Dynamic Breakdown Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {/* Metric 1: Goals Smashed */}
        <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-neutral-200/60 dark:border-[#242424]">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-1">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono font-extrabold text-sm text-neutral-900 dark:text-white block">
            {completedCount}/{totalItems}
          </span>
          <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
            Completed
          </span>
        </div>

        {/* Metric 2: Pages Read / Active Unit */}
        <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-neutral-200/60 dark:border-[#242424]">
          <div className="w-6 h-6 rounded-lg bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center mx-auto mb-1">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono font-extrabold text-sm text-neutral-900 dark:text-white block truncate">
            {totalPages > 0
              ? totalPages.toLocaleString()
              : totalSteps > 0
              ? totalSteps.toLocaleString()
              : totalItems}
          </span>
          <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider block truncate">
            {totalPages > 0 ? 'Pages Read' : totalSteps > 0 ? 'Steps' : 'Active Units'}
          </span>
        </div>

        {/* Metric 3: Volume Activity */}
        <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-neutral-200/60 dark:border-[#242424]">
          <div className="w-6 h-6 rounded-lg bg-[#3897F0]/10 text-[#3897F0] flex items-center justify-center mx-auto mb-1">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono font-extrabold text-sm text-neutral-900 dark:text-white block truncate">
            {totalSteps > 0 && totalPages > 0
              ? totalSteps.toLocaleString()
              : totalLiters > 0
              ? `${totalLiters.toFixed(1)}L`
              : `${Math.round(overallPercentage)}%`}
          </span>
          <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider block truncate">
            {totalSteps > 0 && totalPages > 0 ? 'Steps' : totalLiters > 0 ? 'Water' : 'Efficiency'}
          </span>
        </div>
      </div>
    </section>
  );
};
