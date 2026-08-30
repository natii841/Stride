import React, { useState, useEffect } from 'react';
import { Category, TrackingItem, CreateItemDTO, UpdateItemDTO } from '../types/database';
import { X, Target, FileText } from 'lucide-react';

const UNIT_PRESETS = [
  'pages',
  'steps',
  'liters',
  'km',
  'miles',
  '$',
  'hours',
  'mins',
  'reps',
  'kg',
  'lbs',
  'cal',
];

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateItemDTO | UpdateItemDTO) => Promise<void>;
  categories: Category[];
  initialCategoryId?: string | null;
  editingItem?: TrackingItem | null;
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialCategoryId,
  editingItem,
}) => {
  const [categoryId, setCategoryId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [currentValue, setCurrentValue] = useState<number | string>(0);
  const [targetValue, setTargetValue] = useState<number | string>(100);
  const [unit, setUnit] = useState('pages');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setCategoryId(editingItem.category_id);
      setTitle(editingItem.title);
      setCurrentValue(editingItem.current_value);
      setTargetValue(editingItem.target_value);
      setUnit(editingItem.unit);
      setNotes(editingItem.notes || '');
    } else {
      setCategoryId(initialCategoryId || (categories[0]?.id ?? ''));
      setTitle('');
      setCurrentValue(0);
      setTargetValue(100);
      setUnit('pages');
      setNotes('');
    }
  }, [editingItem, initialCategoryId, categories, isOpen]);

  if (!isOpen) return null;

  const currentNum = Number(currentValue) || 0;
  const targetNum = Number(targetValue) || 1;
  const previewPercentage = Math.min(100, Math.max(0, Math.round((currentNum / targetNum) * 100)));

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId || targetNum <= 0) return;

    setIsSubmitting(true);
    await onSubmit({
      category_id: categoryId,
      title: title.trim(),
      current_value: currentNum,
      target_value: targetNum,
      unit: unit.trim() || 'units',
      notes: notes.trim() || undefined,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#181818] border border-neutral-200 dark:border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-[#262626] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-[#E1306C]" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              {editingItem ? 'Edit Tracked Item' : 'Add New Item'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category Selector */}
          {!editingItem && categories.length > 1 && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Target Category List
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#2e2e2e] rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/50 focus:border-[#E1306C]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Item Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Atomic Habits, Morning Run, 8 Glasses..."
              required
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#2e2e2e] rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/50 focus:border-[#E1306C]"
            />
          </div>

          {/* Dynamic Value Parameters (Current & Target) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Current Value *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#2e2e2e] rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/50 focus:border-[#E1306C]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Target Goal *
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#2e2e2e] rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/50 focus:border-[#E1306C]"
              />
            </div>
          </div>

          {/* Unit Parameter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Unit of Measurement *
              </label>
              <span className="text-[11px] text-neutral-400">e.g. pages, steps, liters</span>
            </div>
            
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. pages, steps, km, liters, $"
              required
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#2e2e2e] rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/50 focus:border-[#E1306C]"
            />

            {/* Unit quick preset pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {UNIT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setUnit(preset)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                    unit === preset
                      ? 'bg-[#E1306C] text-white'
                      : 'bg-neutral-100 dark:bg-[#222] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#2c2c2c]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Notes (Optional) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>Notes / Details (Optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Chapter notes, reminder, milestone..."
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#2e2e2e] rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/50 focus:border-[#E1306C]"
            />
          </div>

          {/* Live Dynamic Progress Preview */}
          <div className="p-3 bg-neutral-50 dark:bg-[#121212] rounded-xl border border-neutral-200 dark:border-[#262626] space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-neutral-500">Progress Preview</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">
                {currentNum} / {targetNum} {unit} ({previewPercentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${previewPercentage}%`,
                  backgroundColor: selectedCategory?.color || '#E1306C',
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-semibold text-sm shadow-md shadow-pink-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{editingItem ? 'Save Changes' : 'Add Item'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
