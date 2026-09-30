import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  couponDiscount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, size?: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getTotalItems: () => number;
  getRemainingForFreeShipping: () => number;
}

const FREE_SHIPPING_THRESHOLD = 999;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "prod-1-100ml",
          productId: "prod-1",
          productSlug: "gentle-face-cleanser",
          name: "Gentle Face Cleanser",
          size: "100 ml",
          price: 399,
          mrp: 750,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: "prod-2-100ml",
          productId: "prod-2",
          productSlug: "hydrating-toner",
          name: "Hydrating Toner",
          size: "100 ml",
          price: 449,
          mrp: 899,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1608248597359-0a69a9e32a68?auto=format&fit=crop&w=400&q=80",
        }
      ],
      isOpen: false,
      couponCode: "",
      couponDiscount: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, size = "100 ml", quantity = 1) => {
        const currentItems = get().items;
        const itemId = `${product.id}-${size}`;
        const existingIndex = currentItems.findIndex((item) => item.id === itemId);

        const variant = product.variants.find((v) => v.size === size);
        const price = variant ? variant.price : product.price;
        const mrp = variant ? variant.mrp : product.mrp;

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += quantity;
          set({ items: updated, isOpen: true });
        } else {
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            productSlug: product.slug,
            name: product.name,
            size: size,
            price: price,
            mrp: mrp,
            quantity: quantity,
            image: product.images[0] || "",
          };
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      applyCoupon: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === "MAYSHA10" || clean === "CLEAN10") {
          const subtotal = get().getSubtotal();
          const discount = Math.round(subtotal * 0.1);
          set({ couponCode: clean, couponDiscount: discount });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ couponCode: "", couponDiscount: 0 }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().couponDiscount;
        return Math.max(0, subtotal - discount);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getRemainingForFreeShipping: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
      }
    }),
    {
      name: "maysha_cart_v1",
      partialize: (state) => ({ items: state.items, couponCode: state.couponCode, couponDiscount: state.couponDiscount }),
    }
  )
);
