import React from 'react';
import { Category } from '../types/database';
import { CategoryIcon } from './CategoryIcon';
import { Plus, Sparkles } from 'lucide-react';

interface CategoryStoriesProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onOpenCreateCategory: () => void;
}

export const CategoryStories: React.FC<CategoryStoriesProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onOpenCreateCategory,
}) => {
  return (
    <div className="bg-white dark:bg-[#121212] sm:border sm:border-neutral-200 dark:sm:border-[#262626] sm:rounded-2xl p-3.5 shadow-sm transition-colors">
      <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-1">
        {/* 'All' Feed Story */}
        <button
          onClick={() => onSelectCategory(null)}
          className="flex flex-col items-center space-y-1.5 flex-shrink-0 group focus:outline-none"
        >
          <div
            className={`p-[2.5px] rounded-full transition-all transform group-hover:scale-105 ${
              selectedCategoryId === null
                ? 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-md shadow-pink-500/20'
                : 'bg-neutral-200 dark:bg-[#2e2e2e]'
            }`}
          >
            <div className="w-14 h-14 bg-white dark:bg-[#181818] rounded-full flex items-center justify-center p-2 text-neutral-800 dark:text-neutral-200">
              <Sparkles className="w-6 h-6 text-[#E1306C]" />
            </div>
          </div>
          <span
            className={`text-[11px] max-w-[68px] truncate font-medium ${
              selectedCategoryId === null
                ? 'text-[#E1306C] font-semibold'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            All Lists
          </span>
        </button>

        {/* Dynamic User Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className="flex flex-col items-center space-y-1.5 flex-shrink-0 group focus:outline-none"
            >
              <div
                className="p-[2.5px] rounded-full transition-all transform group-hover:scale-105"
                style={{
                  background: isSelected
                    ? `linear-gradient(45deg, ${cat.color}, #ffffff)`
                    : `linear-gradient(135deg, ${cat.color}80, ${cat.color}30)`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center p-2 text-white shadow-inner"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon iconName={cat.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
              <span
                className={`text-[11px] max-w-[68px] truncate font-medium ${
                  isSelected
                    ? 'font-bold text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}

        {/* New Category Story Button */}
        <button
          onClick={onOpenCreateCategory}
          className="flex flex-col items-center space-y-1.5 flex-shrink-0 group focus:outline-none"
        >
          <div className="p-[2.5px] rounded-full border-2 border-dashed border-neutral-300 dark:border-[#383838] transition-all transform group-hover:scale-105 group-hover:border-[#E1306C]">
            <div className="w-13 h-13 bg-neutral-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:text-[#E1306C] transition-colors">
              <Plus className="w-6 h-6" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 max-w-[68px] truncate">
            + New List
          </span>
        </button>
      </div>
    </div>
  );
};
