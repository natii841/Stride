import React, { useState } from 'react';
import { Category, TrackingItem } from '../types/database';
import { CategoryIcon } from './CategoryIcon';
import { TrackingItemRow } from './TrackingItemRow';
import { ProgressRing } from './ProgressRing';
import {
  MoreHorizontal,
  Plus,
  Edit2,
  Trash2,
  ListPlus,
  CheckCircle2,
} from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  items: TrackingItem[];
  onOpenAddItem: (categoryId: string) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateItemProgress: (itemId: string, newValue: number) => void;
  onEditItem: (item: TrackingItem) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenFastStepper?: (item: TrackingItem) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  items,
  onOpenAddItem,
  onEditCategory,
  onDeleteCategory,
  onUpdateItemProgress,
  onEditItem,
  onDeleteItem,
  onOpenFastStepper,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Calculate overall category progress percentage
  const totalItems = items.length;
  const completedItems = items.filter((it) => it.current_value >= it.target_value).length;

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

  return (
    <article className="bg-white dark:bg-[#121212] sm:border sm:border-neutral-200 dark:sm:border-[#262626] sm:rounded-2xl overflow-hidden shadow-sm transition-colors">
      {/* Category Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100 dark:border-[#202020]">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: category.color }}
          >
            <CategoryIcon iconName={category.icon} className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                {category.name}
              </h3>
              {completedItems === totalItems && totalItems > 0 && (
                <span className="flex items-center space-x-0.5 text-emerald-500 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {totalItems} {totalItems === 1 ? 'tracked item' : 'tracked items'} ·{' '}
              <span className="font-semibold" style={{ color: category.color }}>
                {overallPercentage}% completed
              </span>
            </p>
          </div>
        </div>

        {/* Right side: Circular Progress Ring + Options */}
        <div className="flex items-center space-x-2">
          <ProgressRing
            percentage={overallPercentage}
            size={36}
            strokeWidth={3}
            color={category.color}
          >
            <span className="font-mono font-bold text-[9px] text-neutral-700 dark:text-neutral-300">
              {overallPercentage}%
            </span>
          </ProgressRing>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-neutral-400 hover:text-neutral-800 dark:hover:text-white rounded-lg transition-colors"
              title="Category options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 w-40 bg-white dark:bg-[#202020] border border-neutral-200 dark:border-[#333] rounded-xl shadow-xl z-20 py-1 text-xs animate-fade-in">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onOpenAddItem(category.id);
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center space-x-2.5 hover:bg-neutral-100 dark:hover:bg-[#2c2c2c] text-neutral-800 dark:text-neutral-200"
                >
                  <Plus className="w-4 h-4 text-[#E1306C]" />
                  <span>Add New Item</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEditCategory(category);
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center space-x-2.5 hover:bg-neutral-100 dark:hover:bg-[#2c2c2c] text-neutral-800 dark:text-neutral-200"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit List</span>
                </button>
                <div className="border-t border-neutral-100 dark:border-[#2a2a2a] my-1" />
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteCategory(category.id);
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center space-x-2.5 hover:bg-red-500/10 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete List</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Progress Bar */}
      <div className="w-full h-1 bg-neutral-100 dark:bg-[#1a1a1a]">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${overallPercentage}%`,
            backgroundColor: category.color,
          }}
        />
      </div>

      {/* Items Section */}
      <div className="p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-6 px-4 border border-dashed border-neutral-200 dark:border-[#2a2a2a] rounded-xl space-y-2">
            <ListPlus className="w-8 h-8 text-neutral-400 mx-auto" />
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              No items in this list yet.
            </p>
            <button
              onClick={() => onOpenAddItem(category.id)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
              style={{ backgroundColor: category.color }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Item</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item) => (
              <TrackingItemRow
                key={item.id}
                item={item}
                categoryColor={category.color}
                onUpdateProgress={onUpdateItemProgress}
                onEditItem={onEditItem}
                onDeleteItem={onDeleteItem}
                onOpenFastStepper={onOpenFastStepper}
              />
            ))}

            {/* Quick Add Button */}
            <button
              onClick={() => onOpenAddItem(category.id)}
              className="w-full py-2.5 border border-dashed border-neutral-300 dark:border-[#333] hover:border-neutral-400 dark:hover:border-[#444] rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center justify-center space-x-1.5 transition-colors mt-2 bg-neutral-50/50 dark:bg-[#161616]/50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add item to {category.name}</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
