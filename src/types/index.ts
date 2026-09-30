export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  mrp: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  categorySlug: string;
  concern: string;
  concernSlug: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  size: string;
  rating: number;
  reviewCount: number;
  badge?: "Bestseller" | "New Launch" | "Award Winner" | "Trending";
  inStock: boolean;
  images: string[];
  hoverImage?: string;
  variants: ProductVariant[];
  keyBenefits: string[];
  ingredients: string;
  usageInstructions: string;
  description: string;
  skinTypes: string[];
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  itemCount: number;
}

export interface Concern {
  id: string;
  slug: string;
  name: string;
  image: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  isVerified: boolean;
  title: string;
  comment: string;
  productId: string;
  productName: string;
  helpfulCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  name: string;
  size: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "info" | "error";
}
