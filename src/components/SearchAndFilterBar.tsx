import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, ArrowUpDown } from 'lucide-react';

export type FilterStatus = 'all' | 'active' | 'completed';
export type SortOption = 'newest' | 'highest_progress' | 'lowest_progress' | 'alphabetical';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  totalFilteredGoalsCount: number;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortByChange,
  totalFilteredGoalsCount,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest First',
    highest_progress: 'Highest Progress',
    lowest_progress: 'Needs Attention (Lowest %)',
    alphabetical: 'Alphabetical (A - Z)',
  };

  const isFilteringActive = searchQuery.trim() !== '' || filterStatus !== 'all' || sortBy !== 'newest';

  return (
    <div className="glass-panel p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl space-y-3 shadow-sm transition-colors">
      {/* Search Input & Sort Trigger */}
      <div className="flex items-center space-x-2">
        {/* Search Bar */}
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search lists, goals, books, steps..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm glass-input rounded-xl"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className={`p-2.5 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-semibold ${
              sortBy !== 'newest'
                ? 'bg-[#E1306C]/10 border-[#E1306C]/30 text-[#E1306C]'
                : 'border-neutral-200/80 dark:border-[#2e2e2e] bg-neutral-100/60 dark:bg-[#181818] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-[#222]'
            }`}
            title="Sort goals"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">Sort</span>
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-11 w-56 glass-card rounded-2xl shadow-2xl z-30 py-1.5 text-xs animate-fade-in border border-neutral-200 dark:border-[#2e2e2e]">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-[#222]">
                Sort Goals By
              </div>
              {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onSortByChange(option);
                    setIsSortOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between transition-colors ${
                    sortBy === option
                      ? 'text-[#E1306C] font-bold bg-[#E1306C]/10'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#242424]'
                  }`}
                >
                  <span>{sortLabels[option]}</span>
                  {sortBy === option && <Check className="w-3.5 h-3.5 text-[#E1306C]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Status Pills & Results Counter */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-0.5">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onFilterStatusChange('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-[#202020]'
            }`}
          >
            All Goals
          </button>

          <button
            onClick={() => onFilterStatusChange('active')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 ${
              filterStatus === 'active'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-[#202020]'
            }`}
          >
            <span>🎯 In Progress</span>
          </button>

          <button
            onClick={() => onFilterStatusChange('completed')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 ${
              filterStatus === 'completed'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-[#202020]'
            }`}
          >
            <span>🏆 Completed</span>
          </button>
        </div>

        {/* Matches Indicator */}
        {isFilteringActive && (
          <div className="flex items-center space-x-1 text-[11px] text-neutral-400 flex-shrink-0">
            <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
              {totalFilteredGoalsCount}
            </span>
            <span>found</span>
          </div>
        )}
      </div>
    </div>
  );
};
