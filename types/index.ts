export type UserRole = "admin" | "parent" | "kaffa";
export type ReviewerRole = "ayah" | "ibu" | "kaffa";
export type AcquisitionType = "bought" | "gift" | "hand_me_down";
export type ItemStatus = "active" | "outgrown" | "donated" | "lost";
export type WishlistPriority = "low" | "medium" | "high";
export type WishlistStatus = "wanted" | "bought" | "cancelled";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Emoji or Lucide icon name
  parent_id?: string | null;
  sort_order: number;
  created_at: string;
}

export interface Item {
  id: string;
  name: string;
  brand: string;
  category_id: string;
  category_name?: string;
  subcategory?: string;
  description: string;
  photos: string[];
  acquisition_type: AcquisitionType;
  acquired_at: string;
  acquired_price?: number;
  gifted_by?: string;
  purchase_url?: string;
  store_name?: string;
  kaffa_age_months: number;
  status: ItemStatus;
  is_recommended: boolean;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  // Computed helpers for UI
  average_rating?: number;
  total_reviews?: number;
  kaffa_approved?: boolean;
}

export interface Review {
  id: string;
  item_id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_role: ReviewerRole;
  rating: number; // 1 to 10
  title?: string;
  body: string;
  pros?: string;
  cons?: string;
  would_buy_again: boolean;
  usage_duration?: string;
  reviewed_at: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  brand?: string;
  category_id: string;
  category_name?: string;
  notes?: string;
  purchase_url?: string;
  estimated_price?: number;
  priority: WishlistPriority;
  status: WishlistStatus;
  added_by: string;
  created_at: string;
}
