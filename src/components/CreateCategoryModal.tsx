import React, { useState, useEffect } from 'react';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/database';
import { ICON_OPTIONS, COLOR_OPTIONS, CategoryIcon } from './CategoryIcon';
import { X, Sparkles } from 'lucide-react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryDTO | UpdateCategoryDTO) => Promise<void>;
  editingCategory?: Category | null;
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Layers');
  const [color, setColor] = useState('#E1306C');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setIcon(editingCategory.icon || 'Layers');
      setColor(editingCategory.color || '#E1306C');
      setDescription(editingCategory.description || '');
    } else {
      setName('');
      setIcon('Layers');
      setColor('#E1306C');
      setDescription('');
    }
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    await onSubmit({
      name: name.trim(),
      icon,
      color,
      description: description.trim() || undefined,
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
            <Sparkles className="w-5 h-5 text-[#E1306C]" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              {editingCategory ? 'Edit Category List' : 'New Category List'}
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
          {/* Live Preview */}
          <div className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] rounded-xl">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0 transition-colors"
              style={{ backgroundColor: color }}
            >
              <CategoryIcon iconName={icon} className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                Category Preview
              </span>
              <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                {name.trim() || 'Your Category Name'}
              </span>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Books, Steps, Hydration, Finance..."
              required
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#2e2e2e] rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/50 focus:border-[#E1306C]"
            />
          </div>

          {/* Color Palette Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Theme Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center ${
                    color === c.value
                      ? 'scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#181818] ring-[#E1306C]'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Category Icon
            </label>
            <div className="grid grid-cols-7 gap-2 max-h-32 overflow-y-auto p-1 border border-neutral-200 dark:border-[#2e2e2e] rounded-xl bg-neutral-50 dark:bg-[#121212]">
              {ICON_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setIcon(opt.name)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                      icon === opt.name
                        ? 'bg-[#E1306C] text-white shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#252525]'
                    }`}
                    title={opt.label}
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description (Optional) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short note or goal summary..."
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#2e2e2e] rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/50 focus:border-[#E1306C]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-semibold text-sm shadow-md shadow-pink-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
