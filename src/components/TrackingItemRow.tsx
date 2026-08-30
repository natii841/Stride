import React, { useState } from 'react';
import { TrackingItem } from '../types/database';
import { ProgressRing } from './ProgressRing';
import { Plus, Minus, Check, Edit2, Trash2, MoreVertical, Zap, Trophy } from 'lucide-react';

interface TrackingItemRowProps {
  item: TrackingItem;
  categoryColor: string;
  onUpdateProgress: (itemId: string, newValue: number) => void;
  onEditItem: (item: TrackingItem) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenFastStepper?: (item: TrackingItem) => void;
}

export const TrackingItemRow: React.FC<TrackingItemRowProps> = ({
  item,
  categoryColor,
  onUpdateProgress,
  onEditItem,
  onDeleteItem,
  onOpenFastStepper,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const percentage = Math.min(
    100,
    Math.max(0, Math.round((item.current_value / item.target_value) * 100))
  );
  const isCompleted = item.current_value >= item.target_value;

  // Compute smart step (e.g. 250 for steps, 0.5 for liters, 1 for pages)
  const getStep = () => {
    if (item.target_value >= 1000) return 250;
    if (item.target_value >= 100) return 10;
    if (item.target_value <= 10) return 0.5;
    return 1;
  };

  const handleIncrement = () => {
    const step = getStep();
    const nextVal = Math.round((item.current_value + step) * 10) / 10;
    onUpdateProgress(item.id, nextVal);
  };

  const handleDecrement = () => {
    const step = getStep();
    const nextVal = Math.max(0, Math.round((item.current_value - step) * 10) / 10);
    onUpdateProgress(item.id, nextVal);
  };

  const getMilestoneBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
          <Trophy className="w-3 h-3" />
          <span>Smashed!</span>
        </span>
      );
    }
    if (percentage >= 75) {
      return (
        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
          <span>⚡️ Almost there</span>
        </span>
      );
    }
    if (percentage >= 40) {
      return (
        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
          <span>🔥 On track</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] font-medium">
        <span>🎯 Active</span>
      </span>
    );
  };

  return (
    <div
      className={`p-3.5 rounded-xl transition-all duration-150 relative border ${
        isCompleted
          ? 'bg-emerald-500/[0.04] border-emerald-500/20 dark:bg-emerald-500/[0.06] dark:border-emerald-500/25'
          : 'bg-neutral-50 dark:bg-[#181818] border-neutral-200/70 dark:border-[#262626]'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        {/* Left: Progress Ring + Title info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <ProgressRing
            percentage={percentage}
            size={42}
            strokeWidth={3.5}
            color={isCompleted ? '#10B981' : categoryColor}
            gradientColors={
              isCompleted ? ['#10B981', '#34D399'] : [categoryColor, '#f09433']
            }
          >
            {isCompleted ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <span className="font-mono font-bold text-[10px] text-neutral-800 dark:text-neutral-200">
                {percentage}%
              </span>
            )}
          </ProgressRing>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                {item.title}
              </h4>
              {getMilestoneBadge()}
            </div>
            {item.notes && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                {item.notes}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions menu */}
        <div className="relative flex items-center space-x-1">
          {onOpenFastStepper && (
            <button
              onClick={() => onOpenFastStepper(item)}
              className="p-1 text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
              title="Fast Controller"
            >
              <Zap className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors"
            title="Item options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-6 w-32 bg-white dark:bg-[#202020] border border-neutral-200 dark:border-[#333] rounded-xl shadow-lg z-20 py-1 text-xs animate-fade-in">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEditItem(item);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-[#2c2c2c] text-neutral-700 dark:text-neutral-300"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Item</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDeleteItem(item.id);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-red-500/10 text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar & Value Display */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="font-mono font-medium text-neutral-700 dark:text-neutral-300">
            <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              {item.current_value.toLocaleString()}
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">
              {' '}/ {item.target_value.toLocaleString()} {item.unit}
            </span>
          </div>
          <span className="font-semibold text-[11px] text-neutral-600 dark:text-neutral-400">
            {percentage}%
          </span>
        </div>

        {/* Progress bar background */}
        <div className="w-full h-2 bg-neutral-200 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: isCompleted ? '#10B981' : categoryColor,
            }}
          />
        </div>
      </div>

      {/* Quick Increment Controls */}
      <div className="mt-3 pt-2.5 border-t border-neutral-200/50 dark:border-[#242424] flex items-center justify-between">
        <button
          onClick={() => onOpenFastStepper && onOpenFastStepper(item)}
          className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center space-x-1"
        >
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Fast Stepper (±{getStep()} {item.unit})</span>
        </button>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleDecrement}
            disabled={item.current_value <= 0}
            className="w-7 h-7 rounded-lg border border-neutral-300 dark:border-[#333] hover:bg-neutral-200 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            title={`Decrease by ${getStep()} ${item.unit}`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleIncrement}
            className="px-2.5 h-7 rounded-lg text-white font-medium text-xs flex items-center space-x-1 shadow-sm active:scale-95 transition-all"
            style={{ backgroundColor: categoryColor }}
            title={`Add ${getStep()} ${item.unit}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+{getStep()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
