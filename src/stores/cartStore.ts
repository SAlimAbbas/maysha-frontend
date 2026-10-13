import { create } from "zustand";

interface CartDrawerStore {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// Clear legacy demo cart from localStorage once
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("maysha_cart_v1");
  } catch {
    // Ignore storage errors
  }
}

export const useCartStore = create<CartDrawerStore>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
