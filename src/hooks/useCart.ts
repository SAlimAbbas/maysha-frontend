"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiBffFetch, ApiClientError } from "@/lib/api";
import { CartSummary, StoreInfo } from "@/types";
import { useCartStore } from "@/stores/cartStore";

const EMPTY_CART: CartSummary = {
  items: [],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  total: 0,
  subtotalPaise: 0,
  discountPaise: 0,
  shippingPaise: 0,
  totalPaise: 0,
  couponCode: null,
  warnings: [],
  itemCount: 0,
};

export function useCart() {
  const queryClient = useQueryClient();
  const { openCart } = useCartStore();

  // Query: Store Info (for dynamic free-shipping threshold and fee)
  const storeInfoQuery = useQuery<StoreInfo>({
    queryKey: ["storeInfo"],
    queryFn: async () => {
      const res = await apiBffFetch<StoreInfo>("store-info");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Query: Cart Summary
  const cartQuery = useQuery<CartSummary>({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const res = await apiBffFetch<CartSummary>("cart");
        return res.data;
      } catch (err: any) {
        // Return clean empty cart if token is new or cart empty
        return EMPTY_CART;
      }
    },
    staleTime: 10 * 1000,
  });

  // Mutation: Add Item
  const addItemMutation = useMutation({
    mutationFn: async ({
      variantId,
      quantity = 1,
    }: {
      variantId: string;
      quantity?: number;
    }) => {
      const res = await apiBffFetch<CartSummary>("cart/items", {
        method: "POST",
        body: JSON.stringify({ variant_id: variantId, quantity }),
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      openCart();
    },
  });

  // Mutation: Update Quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const res = await apiBffFetch<CartSummary>(`cart/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });

  // Mutation: Remove Item
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await apiBffFetch<CartSummary>(`cart/items/${itemId}`, {
        method: "DELETE",
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });

  // Mutation: Apply Coupon
  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiBffFetch<CartSummary>("cart/coupon", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      return res;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["cart"], res.data);
    },
  });

  // Mutation: Remove Coupon
  const removeCouponMutation = useMutation({
    mutationFn: async () => {
      const res = await apiBffFetch<CartSummary>("cart/coupon", {
        method: "DELETE",
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });

  const cart = cartQuery.data || EMPTY_CART;
  const storeInfo = storeInfoQuery.data;

  const threshold = storeInfo?.freeShippingThreshold ?? 999;
  const freeShippingRemaining = Math.max(0, threshold - cart.subtotal);
  const freeShippingProgress = Math.min(100, Math.round((cart.subtotal / threshold) * 100));

  return {
    cart,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    storeInfo,
    freeShippingRemaining,
    freeShippingProgress,
    threshold,
    addItem: addItemMutation.mutateAsync,
    isAdding: addItemMutation.isPending,
    updateQuantity: updateQuantityMutation.mutateAsync,
    isUpdating: updateQuantityMutation.isPending,
    removeItem: removeItemMutation.mutateAsync,
    isRemoving: removeItemMutation.isPending,
    applyCoupon: applyCouponMutation.mutateAsync,
    isApplyingCoupon: applyCouponMutation.isPending,
    removeCoupon: removeCouponMutation.mutateAsync,
    isRemovingCoupon: removeCouponMutation.isPending,
    refetchCart: cartQuery.refetch,
  };
}
