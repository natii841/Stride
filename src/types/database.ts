export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrackingItem {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  current_value: number;
  target_value: number;
  unit: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryDTO {
  name: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface CreateItemDTO {
  category_id: string;
  title: string;
  current_value: number;
  target_value: number;
  unit: string;
  notes?: string;
}

export interface UpdateItemDTO {
  title?: string;
  current_value?: number;
  target_value?: number;
  unit?: string;
  notes?: string;
}

export interface CategoryWithItems extends Category {
  items: TrackingItem[];
  progress: number; // 0 to 100%
  completedItemsCount: number;
}
