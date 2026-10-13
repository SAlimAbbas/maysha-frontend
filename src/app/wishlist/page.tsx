"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";
import { apiBffFetch } from "@/lib/api";

export default function WishlistPage() {
  const { items, guestItemIds, count, isLoading } = useWishlist();
  const [guestProducts, setGuestProducts] = useState<Product[]>([]);
  const [loadingGuest, setLoadingGuest] = useState(false);

  // If user is guest, fetch full product objects for the stored product IDs
  useEffect(() => {
    if (guestItemIds.length > 0 && items.length === 0) {
      setLoadingGuest(true);
      apiBffFetch<Product[]>("products?per_page=48")
        .then((res) => {
          const matched = (res.data || []).filter((p) => guestItemIds.includes(p.id));
          setGuestProducts(matched);
        })
        .catch(() => {})
        .finally(() => setLoadingGuest(false));
    } else {
      setGuestProducts([]);
    }
  }, [guestItemIds, items.length]);

  const displayProducts = items.length > 0 ? items : guestProducts;

  if (isLoading || loadingGuest) {
    return (
      <div className="bg-[#FBF9F5] min-h-[65vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4E5942] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10 lg:py-16 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-[#736E67]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">Wishlist</span>
        </nav>

        {/* Header */}
        <div className="pb-6 border-b border-[#E8E3DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[13px] uppercase tracking-wider font-semibold text-[#4E5942] block mb-1">
              Personal Favorites
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#1A1A1A]">
              Saved Botanical Formulations
            </h1>
            <p className="text-[15px] text-[#5A5650] mt-1">
              {count} {count === 1 ? "item" : "items"} saved to your ritual wish list.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#4E5942] hover:text-[#1A1A1A] underline"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content */}
        {displayProducts.length === 0 ? (
          <div className="bg-white border border-[#E8E3DA] rounded-xs p-12 text-center max-w-lg mx-auto space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#736E67] mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1A1A1A]">Your Wishlist is Empty</h2>
            <p className="text-[15px] text-[#736E67]">
              Explore our biocompatible formulations and tap the heart icon on any product to save it here for later.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-7 py-3 rounded-2xs text-[14px] uppercase tracking-wider font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Botanical Shop</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
