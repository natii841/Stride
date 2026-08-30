import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Category, TrackingItem, CreateCategoryDTO, UpdateCategoryDTO, CreateItemDTO, UpdateItemDTO } from '../types/database';
import * as strideService from '../services/strideService';
import { DashboardAnalytics } from '../components/DashboardAnalytics';
import { CategoryStories } from '../components/CategoryStories';
import { CategoryCard } from '../components/CategoryCard';
import { CreateCategoryModal } from '../components/CreateCategoryModal';
import { CreateItemModal } from '../components/CreateItemModal';
import { FastStepperModal } from '../components/FastStepperModal';
import { MilestoneCelebration } from '../components/MilestoneCelebration';
import { EditProfileModal } from '../components/EditProfileModal';
import {
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Sparkles,
  Plus,
  Home,
  CheckCircle,
  FolderPlus,
  RefreshCw,
  Zap,
  Flame,
  UserCheck,
  Edit3,
} from 'lucide-react';

export const Feed: React.FC = () => {
  const { user, profile, signOut, isEmailVerified } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TrackingItem | null>(null);
  const [targetCategoryIdForItem, setTargetCategoryIdForItem] = useState<string | null>(null);

  // Fast Stepper state
  const [fastStepperItem, setFastStepperItem] = useState<TrackingItem | null>(null);
  const [isFastStepperOpen, setIsFastStepperOpen] = useState(false);

  // Profile Edit modal state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Milestone celebration state
  const [celebrationItem, setCelebrationItem] = useState<TrackingItem | null>(null);

  // Load data for active user
  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [fetchedCats, fetchedItems] = await Promise.all([
        strideService.getCategories(user.id),
        strideService.getItems(user.id),
      ]);
      setCategories(fetchedCats);
      setItems(fetchedItems);
    } catch (err) {
      console.error('Error loading Stride categories & items:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // CATEGORY CRUD ACTIONS
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (data: CreateCategoryDTO | UpdateCategoryDTO) => {
    if (!user) return;
    if (editingCategory) {
      const updated = await strideService.updateCategory(user.id, editingCategory.id, data);
      if (updated) {
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      }
    } else {
      const created = await strideService.createCategory(user.id, data as CreateCategoryDTO);
      setCategories((prev) => [created, ...prev]);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!user) return;
    const confirmed = window.confirm('Are you sure you want to delete this list and all its tracked items?');
    if (!confirmed) return;

    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    setItems((prev) => prev.filter((i) => i.category_id !== categoryId));
    if (selectedCategoryId === categoryId) setSelectedCategoryId(null);

    await strideService.deleteCategory(user.id, categoryId);
  };

  // ITEM CRUD ACTIONS
  const handleOpenAddItem = (categoryId?: string) => {
    setEditingItem(null);
    setTargetCategoryIdForItem(categoryId || selectedCategoryId || categories[0]?.id || null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: TrackingItem) => {
    setEditingItem(item);
    setTargetCategoryIdForItem(item.category_id);
    setIsItemModalOpen(true);
  };

  const handleItemSubmit = async (data: CreateItemDTO | UpdateItemDTO) => {
    if (!user) return;
    if (editingItem) {
      const updated = await strideService.updateItem(user.id, editingItem.id, data);
      if (updated) {
        setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
      }
    } else {
      const created = await strideService.createItem(user.id, data as CreateItemDTO);
      setItems((prev) => [...prev, created]);
    }
  };

  const handleUpdateItemProgress = async (itemId: string, newValue: number) => {
    if (!user) return;
    const currentItem = items.find((i) => i.id === itemId);
    const wasAlreadyCompleted = currentItem && currentItem.current_value >= currentItem.target_value;

    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, current_value: newValue } : it))
    );

    if (currentItem && newValue >= currentItem.target_value && !wasAlreadyCompleted) {
      setCelebrationItem({ ...currentItem, current_value: newValue });
    }

    await strideService.updateItemProgress(user.id, itemId, newValue);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!user) return;
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    await strideService.deleteItem(user.id, itemId);
  };

  const handleOpenFastStepper = (item: TrackingItem) => {
    setFastStepperItem(item);
    setIsFastStepperOpen(true);
  };

  const filteredCategories = selectedCategoryId
    ? categories.filter((c) => c.id === selectedCategoryId)
    : categories;

  const activeCategoryForStepper = fastStepperItem
    ? categories.find((c) => c.id === fastStepperItem.category_id)
    : undefined;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#000000] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 relative">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed top-[-5%] left-[-5%] w-[45vw] h-[45vw] rounded-full ambient-glow-1 pointer-events-none blur-3xl z-0" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[45vw] h-[45vw] rounded-full ambient-glow-2 pointer-events-none blur-3xl z-0" />

      {/* Milestone Celebration Banner */}
      <MilestoneCelebration
        item={celebrationItem}
        onClose={() => setCelebrationItem(null)}
      />

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-neutral-200/80 dark:border-[#262626] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px] shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-[#121212] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#E1306C]" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
            Stride
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="p-2 rounded-full border border-neutral-200/80 dark:border-[#262626] bg-white/70 dark:bg-[#161616] text-neutral-700 dark:text-neutral-300"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-neutral-200/80 dark:border-[#262626] bg-white/70 dark:bg-[#161616] text-neutral-700 dark:text-neutral-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-full border border-neutral-200/80 dark:border-[#262626] bg-white/70 dark:bg-[#161616] text-red-500"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Responsive Shell: 3-Column on Desktop, Fluid Center on Mobile */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* LEFT COLUMN: Desktop Sticky Sidebar */}
          <aside className="hidden lg:flex lg:col-span-3 sticky top-8 flex-col justify-between h-[calc(100vh-4rem)] space-y-6">
            <div className="space-y-6">
              {/* Brand Logo */}
              <div className="flex items-center space-x-3 px-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px] shadow-lg shadow-pink-500/20 flex items-center justify-center">
                  <div className="w-full h-full bg-white dark:bg-[#121212] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#E1306C]" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
                    Stride
                  </h1>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                    Next-Gen Tracker
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5 text-sm font-semibold">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                    selectedCategoryId === null
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-[#181818]'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Main Feed</span>
                </button>

                <button
                  onClick={handleOpenCreateCategory}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-[#181818] transition-all"
                >
                  <FolderPlus className="w-5 h-5 text-[#E1306C]" />
                  <span>Create New List</span>
                </button>

                {items.length > 0 && (
                  <button
                    onClick={() => handleOpenFastStepper(items[0])}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-[#181818] transition-all"
                  >
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>Fast Stepper Log</span>
                  </button>
                )}

                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-[#181818] transition-all"
                >
                  <UserCheck className="w-5 h-5 text-[#3897F0]" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-[#181818] transition-all"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-neutral-700" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </nav>

              {/* Action Button */}
              <button
                onClick={handleOpenCreateCategory}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Category List</span>
              </button>
            </div>

            {/* Desktop User Profile Card */}
            <div className="glass-panel p-3.5 rounded-2xl flex items-center justify-between">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="flex items-center space-x-3 min-w-0 text-left hover:opacity-80 transition-opacity"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={profile?.avatar_url}
                    alt={profile?.full_name || 'User avatar'}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-300 dark:border-[#333]"
                  />
                  {isEmailVerified && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-black flex items-center justify-center">
                      <CheckCircle className="w-1.5 h-1.5 text-white" />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                    {profile?.full_name || 'Member'}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate">@{profile?.username}</p>
                </div>
              </button>

              <button
                onClick={() => signOut()}
                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>

          {/* CENTER COLUMN: Main Feed & Stories */}
          <main className="lg:col-span-5 w-full space-y-4 pb-8 lg:pb-12">
            {/* Mobile Profile Badge */}
            <div className="lg:hidden glass-panel p-3.5 rounded-2xl flex items-center justify-between">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="flex items-center space-x-3 text-left"
              >
                <img
                  src={profile?.avatar_url}
                  alt={profile?.full_name || 'Avatar'}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-300 dark:border-[#333]"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-sm">{profile?.full_name}</span>
                    <ShieldCheck className="w-4 h-4 text-[#3897F0]" />
                  </div>
                  <span className="text-xs text-neutral-400">@{profile?.username} · Tap to edit</span>
                </div>
              </button>

              <button
                onClick={loadData}
                className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Mobile Analytics Bar */}
            <div className="lg:hidden">
              <DashboardAnalytics categories={categories} items={items} />
            </div>

            {/* Instagram Category Stories Carousel */}
            <CategoryStories
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              onOpenCreateCategory={handleOpenCreateCategory}
            />

            {/* Filter Pill */}
            {selectedCategoryId && (
              <div className="flex items-center justify-between px-2 text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Filtering by:{' '}
                  <strong className="text-neutral-900 dark:text-neutral-100">
                    {categories.find((c) => c.id === selectedCategoryId)?.name}
                  </strong>
                </span>
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className="text-[#E1306C] font-semibold hover:underline"
                >
                  Show all
                </button>
              </div>
            )}

            {/* Feed Cards */}
            {loading && categories.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-7 h-7 border-2 border-[#E1306C] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-neutral-400">Loading your goals and lists...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="glass-card rounded-3xl p-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-[#1c1c1c] flex items-center justify-center mx-auto text-neutral-400">
                  <FolderPlus className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-800 dark:text-neutral-200">
                    No Lists Created Yet
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto mt-1 leading-relaxed">
                    Create your first category card (like Books, Steps, or Hydration) to start logging your daily progress!
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateCategory}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs shadow-lg shadow-pink-500/25 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category Card</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCategories.map((category) => {
                  const categoryItems = items.filter((it) => it.category_id === category.id);
                  return (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      items={categoryItems}
                      onOpenAddItem={handleOpenAddItem}
                      onEditCategory={handleOpenEditCategory}
                      onDeleteCategory={handleDeleteCategory}
                      onUpdateItemProgress={handleUpdateItemProgress}
                      onEditItem={handleOpenEditItem}
                      onDeleteItem={handleDeleteItem}
                      onOpenFastStepper={handleOpenFastStepper}
                    />
                  );
                })}
              </div>
            )}
          </main>

          {/* RIGHT COLUMN: Desktop Sticky Analytics & Momentum Widget */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-8 space-y-5">
            <DashboardAnalytics categories={categories} items={items} />

            {/* Inspiration & Momentum Card */}
            <div className="glass-panel p-5 rounded-3xl space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-pink-600 dark:text-pink-400">
                <Flame className="w-4 h-4 fill-pink-500 text-pink-500" />
                <span>Daily Momentum</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
                {profile?.bio
                  ? `"${profile.bio}"`
                  : '"Small daily improvements over time lead to stunning results. Keep your stride strong today."'}
              </p>
              <div className="pt-2 border-t border-neutral-200/50 dark:border-[#222] flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                <span>{categories.length} Active Lists</span>
                <span>{items.length} Tracked Goals</span>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* Category Creation & Edit Modal */}
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        editingCategory={editingCategory}
      />

      {/* Item Creation & Edit Modal */}
      <CreateItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSubmit={handleItemSubmit}
        categories={categories}
        initialCategoryId={targetCategoryIdForItem}
        editingItem={editingItem}
      />

      {/* Fast Stepper Controller Modal */}
      <FastStepperModal
        isOpen={isFastStepperOpen}
        onClose={() => {
          setIsFastStepperOpen(false);
          setFastStepperItem(null);
        }}
        item={fastStepperItem}
        categoryColor={activeCategoryForStepper?.color}
        onSaveProgress={handleUpdateItemProgress}
        onMilestoneAchieved={(milestoneItem) => setCelebrationItem(milestoneItem)}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
