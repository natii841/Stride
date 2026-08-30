import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Category,
  TrackingItem,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CreateItemDTO,
  UpdateItemDTO,
} from '../types/database';

// Local storage fallback keys for offline/demo resilience
const getLocalCategoriesKey = (userId: string) => `stride_categories_${userId}`;
const getLocalItemsKey = (userId: string) => `stride_items_${userId}`;

const getInitialSeedData = (userId: string): { categories: Category[]; items: TrackingItem[] } => {
  const defaultCategories: Category[] = [
    {
      id: 'cat-books-1',
      user_id: userId,
      name: 'Books',
      icon: 'BookOpen',
      color: '#E1306C',
      description: 'Reading goals and chapter milestones',
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'cat-steps-2',
      user_id: userId,
      name: 'Steps',
      icon: 'Footprints',
      color: '#F56040',
      description: 'Daily activity & step count',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'cat-hydration-3',
      user_id: userId,
      name: 'Hydration',
      icon: 'Droplets',
      color: '#3897F0',
      description: 'Water and electrolyte tracking',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const defaultItems: TrackingItem[] = [
    {
      id: 'item-book-1',
      user_id: userId,
      category_id: 'cat-books-1',
      title: 'Atomic Habits',
      current_value: 142,
      target_value: 320,
      unit: 'pages',
      notes: 'Chapter 7: The Secret to Self-Control',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'item-book-2',
      user_id: userId,
      category_id: 'cat-books-1',
      title: 'Designing Data-Intensive Applications',
      current_value: 85,
      target_value: 550,
      unit: 'pages',
      notes: 'Part 1: Foundations of Data Systems',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'item-steps-1',
      user_id: userId,
      category_id: 'cat-steps-2',
      title: 'Daily Movement Goal',
      current_value: 7850,
      target_value: 10000,
      unit: 'steps',
      notes: 'Morning walk + afternoon stroll',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'item-hydration-1',
      user_id: userId,
      category_id: 'cat-hydration-3',
      title: 'Water Intake',
      current_value: 2.2,
      target_value: 3.5,
      unit: 'liters',
      notes: 'Hydrate every 2 hours',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return { categories: defaultCategories, items: defaultItems };
};

// CATEGORIES CRUD
export const getCategories = async (userId: string): Promise<Category[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Category[];
      }
      console.warn('Supabase query returned error or empty, checking fallback...', error?.message);
    } catch (err) {
      console.warn('Supabase fetch failed, using local storage fallback:', err);
    }
  }

  // Fallback to local storage
  const stored = localStorage.getItem(getLocalCategoriesKey(userId));
  if (stored) {
    return JSON.parse(stored);
  }

  const { categories, items } = getInitialSeedData(userId);
  localStorage.setItem(getLocalCategoriesKey(userId), JSON.stringify(categories));
  localStorage.setItem(getLocalItemsKey(userId), JSON.stringify(items));
  return categories;
};

export const createCategory = async (
  userId: string,
  category: CreateCategoryDTO
): Promise<Category> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          user_id: userId,
          name: category.name,
          icon: category.icon || 'Layers',
          color: category.color || '#E1306C',
          description: category.description || null,
        })
        .select()
        .single();

      if (!error && data) {
        return data as Category;
      }
      console.warn('Supabase createCategory error, using fallback:', error?.message);
    } catch (err) {
      console.warn('Supabase createCategory failed:', err);
    }
  }

  // Local fallback
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    user_id: userId,
    name: category.name,
    icon: category.icon || 'Layers',
    color: category.color || '#E1306C',
    description: category.description || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const stored = await getCategories(userId);
  const updated = [newCat, ...stored];
  localStorage.setItem(getLocalCategoriesKey(userId), JSON.stringify(updated));
  return newCat;
};

export const updateCategory = async (
  userId: string,
  categoryId: string,
  updates: UpdateCategoryDTO
): Promise<Category | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', categoryId)
        .eq('user_id', userId)
        .select()
        .single();

      if (!error && data) {
        return data as Category;
      }
      console.warn('Supabase updateCategory error:', error?.message);
    } catch (err) {
      console.warn('Supabase updateCategory failed:', err);
    }
  }

  // Local fallback
  const stored = await getCategories(userId);
  let updatedCat: Category | null = null;
  const updated = stored.map((cat) => {
    if (cat.id === categoryId) {
      updatedCat = { ...cat, ...updates, updated_at: new Date().toISOString() };
      return updatedCat;
    }
    return cat;
  });
  localStorage.setItem(getLocalCategoriesKey(userId), JSON.stringify(updated));
  return updatedCat;
};

export const deleteCategory = async (userId: string, categoryId: string): Promise<boolean> => {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', userId);

      if (!error) {
        return true;
      }
      console.warn('Supabase deleteCategory error:', error?.message);
    } catch (err) {
      console.warn('Supabase deleteCategory failed:', err);
    }
  }

  // Local fallback (cascade delete items)
  const storedCats = await getCategories(userId);
  const updatedCats = storedCats.filter((cat) => cat.id !== categoryId);
  localStorage.setItem(getLocalCategoriesKey(userId), JSON.stringify(updatedCats));

  const storedItems = await getItems(userId);
  const updatedItems = storedItems.filter((item) => item.category_id !== categoryId);
  localStorage.setItem(getLocalItemsKey(userId), JSON.stringify(updatedItems));
  return true;
};

// ITEMS CRUD
export const getItems = async (userId: string): Promise<TrackingItem[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data as TrackingItem[];
      }
      console.warn('Supabase getItems error:', error?.message);
    } catch (err) {
      console.warn('Supabase getItems failed:', err);
    }
  }

  // Fallback to local storage
  const stored = localStorage.getItem(getLocalItemsKey(userId));
  if (stored) {
    return JSON.parse(stored);
  }

  const { items } = getInitialSeedData(userId);
  localStorage.setItem(getLocalItemsKey(userId), JSON.stringify(items));
  return items;
};

export const createItem = async (
  userId: string,
  item: CreateItemDTO
): Promise<TrackingItem> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert({
          user_id: userId,
          category_id: item.category_id,
          title: item.title,
          current_value: Number(item.current_value) || 0,
          target_value: Number(item.target_value) || 1,
          unit: item.unit,
          notes: item.notes || null,
        })
        .select()
        .single();

      if (!error && data) {
        return data as TrackingItem;
      }
      console.warn('Supabase createItem error:', error?.message);
    } catch (err) {
      console.warn('Supabase createItem failed:', err);
    }
  }

  // Local fallback
  const newItem: TrackingItem = {
    id: `item-${Date.now()}`,
    user_id: userId,
    category_id: item.category_id,
    title: item.title,
    current_value: Number(item.current_value) || 0,
    target_value: Number(item.target_value) || 1,
    unit: item.unit,
    notes: item.notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const stored = await getItems(userId);
  const updated = [...stored, newItem];
  localStorage.setItem(getLocalItemsKey(userId), JSON.stringify(updated));
  return newItem;
};

export const updateItem = async (
  userId: string,
  itemId: string,
  updates: UpdateItemDTO
): Promise<TrackingItem | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('items')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .eq('user_id', userId)
        .select()
        .single();

      if (!error && data) {
        return data as TrackingItem;
      }
      console.warn('Supabase updateItem error:', error?.message);
    } catch (err) {
      console.warn('Supabase updateItem failed:', err);
    }
  }

  // Local fallback
  const stored = await getItems(userId);
  let updatedItem: TrackingItem | null = null;
  const updated = stored.map((item) => {
    if (item.id === itemId) {
      updatedItem = {
        ...item,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return updatedItem;
    }
    return item;
  });
  localStorage.setItem(getLocalItemsKey(userId), JSON.stringify(updated));
  return updatedItem;
};

export const updateItemProgress = async (
  userId: string,
  itemId: string,
  newValue: number
): Promise<TrackingItem | null> => {
  const safeValue = Math.max(0, newValue);
  return updateItem(userId, itemId, { current_value: safeValue });
};

export const deleteItem = async (userId: string, itemId: string): Promise<boolean> => {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId);

      if (!error) {
        return true;
      }
      console.warn('Supabase deleteItem error:', error?.message);
    } catch (err) {
      console.warn('Supabase deleteItem failed:', err);
    }
  }

  // Local fallback
  const stored = await getItems(userId);
  const updated = stored.filter((item) => item.id !== itemId);
  localStorage.setItem(getLocalItemsKey(userId), JSON.stringify(updated));
  return true;
};
