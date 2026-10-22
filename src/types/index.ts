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
  badge?: string;
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
  seoTitle?: string;
  seoDescription?: string;
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
  images?: string[];
  productId: string;
  productName: string;
  helpfulCount: number;
  age?: string;
  skinType?: string;
  skinConcerns?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  desktopImage: string;
  mobileImage: string;
  linkUrl: string;
  badgeText?: string | null;
  sortOrder: number;
}

export interface StoreInfo {
  brand: string;
  tagline: string;
  currency: string;
  symbol: string;
  freeShippingThreshold: number;
  shippingFee: number;
  codEnabled?: boolean;
  codMaxRupees?: number;
  announcementMessages?: string[];
  supportPhone?: string;
  supportWhatsapp?: string;
  supportHours?: string;
  storeAddress?: string;
  gstin?: string;
  status: string;
  supportEmail: string;
  about?: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: string;
    philosophyImage?: string;
    storyTitle?: string;
    storyContent?: string;
  };
  seo?: {
    homeTitle?: string;
    homeDescription?: string;
    aboutTitle?: string;
    aboutDescription?: string;
    journalTitle?: string;
    journalDescription?: string;
    shopTitle?: string;
    shopDescription?: string;
  };
}

export interface CartLine {
  id: string;
  variantId: string;
  productId: string;
  productSlug: string;
  name: string;
  size: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
  lineTotal: number;
  stock: number;
}

export interface CartSummary {
  items: CartLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  totalPaise: number;
  couponCode: string | null;
  warnings: string[];
  itemCount: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  id: string;
  productId?: string;
  productName: string;
  productSlug: string;
  size: string;
  unitPrice: number;
  unitMrp: number;
  quantity: number;
  total: number;
  image: string;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "failed";

export interface OrderTimelineEvent {
  id: string;
  status: string;
  message: string;
  createdAt: string;
}

export interface OrderTracking {
  courier: string | null;
  trackingNo: string | null;
  url: string | null;
}

export interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  paymentStatus?: string;
  invoiceNo?: string | null;
  invoiceUrl?: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  tax?: number;
  total: number;
  currency: string;
  couponCode: string | null;
  paymentMethod: "razorpay" | "cod";
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  tracking?: OrderTracking;
  events?: OrderTimelineEvent[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface RazorpayOrder {
  paymentId: string;
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  amountPaise: number;
  currency: string;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  heroImage: string;
  category: string;
  readingTime: string;
  author: string;
  authorRole: string;
  authorAvatar: string | null;
  isFeatured: boolean;
  recommendedProductSlugs: string[];
  publishedAt: string;
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  currentPage: number;
  lastPage: number;
  perPage?: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta & { cartToken?: string; count?: number; maxAllowed?: number; [key: string]: any };
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "info" | "error";
}

export interface CouponOffer {
  id: string;
  code: string;
  type?: string;
  value?: number;
  minOrderRupees?: number;
  maxDiscountRupees?: number | null;
  firstOrderOnly?: boolean;
  description: string;
}

