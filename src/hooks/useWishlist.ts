"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiBffFetch } from "@/lib/api";
import { Product } from "@/types";

export function useWishlist() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [localWishlist, setLocalWishlist] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize local guest wishlist
  useEffect(() => {
    try {
      const stored = localStorage.getItem("maysha_guest_wishlist");
      if (stored) {
        setLocalWishlist(JSON.parse(stored));
      }
    } catch {}
    setIsInitialized(true);
  }, []);

  // Server Wishlist query for authenticated users
  const serverWishlistQuery = useQuery<Product[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      try {
        const res = await apiBffFetch<Product[]>("account/wishlist");
        return res.data;
      } catch {
        return [];
      }
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  // Sync guest wishlist to database on login, then clear local session
  useEffect(() => {
    if (isAuthenticated && localWishlist.length > 0) {
      apiBffFetch("account/wishlist/sync", {
        method: "POST",
        body: JSON.stringify({ product_ids: localWishlist }),
      })
        .then(() => {
          // Clear guest session storage so another account doesn't see these items
          localStorage.removeItem("maysha_guest_wishlist");
          setLocalWishlist([]);
          queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        })
        .catch(() => {});
    }
  }, [isAuthenticated, localWishlist, queryClient]);

  // Add to wishlist
  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) {
        setLocalWishlist((prev) => {
          const exists = prev.includes(productId);
          const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
          try {
            localStorage.setItem("maysha_guest_wishlist", JSON.stringify(next));
          } catch {}
          return next;
        });
        return;
      }

      // Authenticated mutation
      const serverItems = serverWishlistQuery.data || [];
      const isAlreadyWishlisted = serverItems.some((p) => p.id === productId);

      if (isAlreadyWishlisted) {
        await apiBffFetch(`account/wishlist/${productId}`, { method: "DELETE" }).catch(() => {});
      } else {
        await apiBffFetch(`account/wishlist/${productId}`, { method: "POST" }).catch(() => {});
      }
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    [isAuthenticated, serverWishlistQuery.data, queryClient]
  );

  const isWishlisted = useCallback(
    (productId: string) => {
      if (!isAuthenticated) {
        return localWishlist.includes(productId);
      }
      return (serverWishlistQuery.data || []).some((p) => p.id === productId);
    },
    [isAuthenticated, localWishlist, serverWishlistQuery.data]
  );

  const wishlistCount = isAuthenticated
    ? (serverWishlistQuery.data || []).length
    : localWishlist.length;

  return {
    items: serverWishlistQuery.data || [],
    guestItemIds: localWishlist,
    count: wishlistCount,
    wishlistCount,
    isWishlisted,
    toggleWishlist,
    isLoading: serverWishlistQuery.isLoading && isAuthenticated,
  };
}
