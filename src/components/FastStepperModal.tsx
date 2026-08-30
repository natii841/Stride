import React, { useState, useEffect } from 'react';
import { TrackingItem } from '../types/database';
import { ProgressRing } from './ProgressRing';
import { X, Plus, Minus, Zap, Trophy, Check } from 'lucide-react';

interface FastStepperModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TrackingItem | null;
  categoryColor?: string;
  onSaveProgress: (itemId: string, newValue: number) => Promise<void>;
  onMilestoneAchieved?: (item: TrackingItem) => void;
}

export const FastStepperModal: React.FC<FastStepperModalProps> = ({
  isOpen,
  onClose,
  item,
  categoryColor = '#E1306C',
  onSaveProgress,
  onMilestoneAchieved,
}) => {
  const [val, setVal] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (item) {
      setVal(item.current_value);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const target = item.target_value;
  const percentage = Math.round((val / target) * 100);
  const isGoalAchieved = val >= target;
  const wasAlreadyAchieved = item.current_value >= target;

  // Determine smart step presets based on unit and scale
  const getStepPresets = () => {
    if (item.unit.toLowerCase().includes('step') || target >= 5000) {
      return [
        { label: '-1k', delta: -1000 },
        { label: '-250', delta: -250 },
        { label: '-100', delta: -100 },
        { label: '+100', delta: 100 },
        { label: '+250', delta: 250 },
        { label: '+500', delta: 500 },
        { label: '+1k', delta: 1000 },
        { label: '+2.5k', delta: 2500 },
      ];
    }
    if (target >= 200) {
      return [
        { label: '-50', delta: -50 },
        { label: '-20', delta: -20 },
        { label: '-10', delta: -10 },
        { label: '-1', delta: -1 },
        { label: '+1', delta: 1 },
        { label: '+10', delta: 10 },
        { label: '+20', delta: 20 },
        { label: '+50', delta: 50 },
      ];
    }
    if (target <= 10) {
      return [
        { label: '-2', delta: -2 },
        { label: '-1', delta: -1 },
        { label: '-0.5', delta: -0.5 },
        { label: '-0.1', delta: -0.1 },
        { label: '+0.1', delta: 0.1 },
        { label: '+0.5', delta: 0.5 },
        { label: '+1', delta: 1 },
        { label: '+2', delta: 2 },
      ];
    }
    return [
      { label: '-10', delta: -10 },
      { label: '-5', delta: -5 },
      { label: '-1', delta: -1 },
      { label: '+1', delta: 1 },
      { label: '+5', delta: 5 },
      { label: '+10', delta: 10 },
      { label: '+25', delta: 25 },
    ];
  };

  const applyDelta = (delta: number) => {
    setVal((prev) => {
      const next = Math.max(0, Math.round((prev + delta) * 10) / 10);
      return next;
    });
  };

  const handleSave = async () => {
    setIsUpdating(true);
    await onSaveProgress(item.id, val);
    setIsUpdating(false);

    if (isGoalAchieved && !wasAlreadyAchieved && onMilestoneAchieved) {
      onMilestoneAchieved({ ...item, current_value: val });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-[#181818] border border-neutral-200 dark:border-[#2e2e2e] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-[#262626] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Fast Log Controller
              </h3>
              <p className="text-[11px] text-neutral-400 truncate max-w-[200px]">
                {item.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controller Body */}
        <div className="p-5 space-y-5">
          {/* Progress Ring & Value Hero */}
          <div className="flex flex-col items-center justify-center py-2 space-y-3">
            <ProgressRing
              percentage={percentage}
              size={110}
              strokeWidth={8}
              color={isGoalAchieved ? '#10B981' : categoryColor}
              gradientColors={
                isGoalAchieved ? ['#10B981', '#34D399'] : [categoryColor, '#f09433']
              }
            >
              <div className="flex flex-col items-center justify-center text-center">
                {isGoalAchieved ? (
                  <Trophy className="w-6 h-6 text-amber-500 animate-bounce" />
                ) : (
                  <span className="font-mono font-bold text-lg text-neutral-900 dark:text-white">
                    {percentage}%
                  </span>
                )}
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  {isGoalAchieved ? 'Completed' : 'Progress'}
                </span>
              </div>
            </ProgressRing>

            {/* Direct Value Input with Stepper buttons */}
            <div className="flex items-center space-x-3 w-full justify-center">
              <button
                type="button"
                onClick={() => applyDelta(target <= 10 ? -0.5 : -1)}
                disabled={val <= 0}
                className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-[#242424] hover:bg-neutral-200 dark:hover:bg-[#2e2e2e] text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all disabled:opacity-40"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="text-center">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={val}
                  onChange={(e) => setVal(Math.max(0, Number(e.target.value) || 0))}
                  className="w-32 text-center text-3xl font-extrabold font-mono text-neutral-900 dark:text-white bg-transparent focus:outline-none border-b-2 border-neutral-300 dark:border-[#383838] focus:border-[#E1306C] py-1"
                />
                <span className="block text-xs font-semibold text-neutral-400 mt-1">
                  of {target.toLocaleString()} {item.unit}
                </span>
              </div>

              <button
                type="button"
                onClick={() => applyDelta(target <= 10 ? 0.5 : 1)}
                className="w-11 h-11 rounded-2xl text-white flex items-center justify-center font-bold text-lg active:scale-95 shadow-md transition-all"
                style={{ backgroundColor: categoryColor }}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Delta Pills Grid */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block text-center">
              Fast Increment / Decrement
            </span>
            <div className="grid grid-cols-4 gap-2">
              {getStepPresets().map((step) => {
                const isPositive = step.delta > 0;
                return (
                  <button
                    key={step.label}
                    type="button"
                    onClick={() => applyDelta(step.delta)}
                    className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 border ${
                      isPositive
                        ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-300/80 dark:bg-[#222] dark:hover:bg-[#2a2a2a] dark:text-white dark:border-[#333]'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-[#1c1c1c] dark:hover:bg-[#242424] dark:text-neutral-400 dark:border-[#282828]'
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goal Scrubber / Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={Math.max(target * 1.5, val * 1.2)}
              step={target <= 10 ? '0.1' : '1'}
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 dark:bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#E1306C]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-neutral-300 dark:border-[#333] hover:bg-neutral-100 dark:hover:bg-[#222] text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isUpdating}
              className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-semibold text-xs shadow-md shadow-pink-500/25 transition-all flex items-center justify-center space-x-1.5 active:scale-98 disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Progress</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
