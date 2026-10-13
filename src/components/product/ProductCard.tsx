"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Check, ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useUIStore } from "@/stores/uiStore";
import OfferBadge from "@/components/ui/OfferBadge";
import { formatINR } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ""
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingLocal, setIsAddingLocal] = useState(false);
  const [isAddedLocal, setIsAddedLocal] = useState(false);

  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToast } = useUIStore();

  const isCurrentWishlisted = isWishlisted(product.id);

  const currentVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0] || {
      id: "var-default",
      size: product.size,
      price: product.price,
      mrp: product.mrp,
      inStock: product.inStock,
    };

  const discount =
    currentVariant.mrp > currentVariant.price
      ? Math.round(((currentVariant.mrp - currentVariant.price) / currentVariant.mrp) * 100)
      : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddingLocal || isAddedLocal || !currentVariant.inStock) return;

    setIsAddingLocal(true);
    try {
      await addItem({
        variantId: currentVariant.id,
        quantity: 1,
      });

      setIsAddedLocal(true);
      addToast(
        "Added to Cart",
        `${product.name} (${currentVariant.size}) is in your cart.`,
        "success"
      );

      setTimeout(() => {
        setIsAddedLocal(false);
      }, 1600);
    } catch (err: any) {
      addToast("Stock Notice", err.message || "Could not add to cart.", "error");
    } finally {
      setIsAddingLocal(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await toggleWishlist(product.id);

    addToast(
      !isCurrentWishlisted ? "Saved to Wishlist" : "Removed from Wishlist",
      `${product.name}`,
      "info"
    );
  };

  const rawImage = (isHovered && product.hoverImage ? product.hoverImage : product.images?.[0]) as any;
  let displayImage =
    typeof rawImage === "string" && rawImage.trim().length > 0
      ? rawImage.trim()
      : typeof rawImage === "object" && rawImage !== null && rawImage.url
      ? String(rawImage.url)
      : "";

  if (!displayImage || displayImage === "/logo.png") {
    if (product.slug?.includes("face-wash")) displayImage = "/images/products/face-wash/face-wash-1.png";
    else if (product.slug?.includes("hair-oil") || product.slug?.includes("rosemary")) displayImage = "/images/products/rosemary-hair-oil/hair-oil-1.png";
    else if (product.slug?.includes("freshener") || product.slug?.includes("air")) displayImage = "/images/products/rose-air-freshener/air-freshener-1.png";
    else displayImage = "/images/products/face-wash/face-wash-1.png";
  }

  const badges = product.badge
    ? product.badge
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      className="group relative flex flex-col bg-[#FFFFFF] border border-[#E8E3DA] hover:border-[#1A1A1A] transition-all duration-300 rounded-xs overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block w-full aspect-square bg-[#EFECE4] overflow-hidden"
      >
        <Image
          src={displayImage}
          alt={product.name || "Maysha Botanical Skincare"}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Semantic Offer Badges (Multiple Badges Support) */}
        {badges.length > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
            {badges.map((badgeLabel, idx) => (
              <OfferBadge key={idx} label={badgeLabel} size="sm" />
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
            isCurrentWishlisted
              ? "bg-[#FFFFFF] text-[#A94438] shadow-xs"
              : "bg-[#FFFFFF]/80 text-[#736E67] hover:text-[#1A1A1A] hover:bg-[#FFFFFF]"
          }`}
          aria-label={isCurrentWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-75 ${
              isCurrentWishlisted ? "fill-current scale-110" : ""
            }`}
          />
        </button>
      </Link>

      {/* Product Information */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        {/* Title & Subtitle */}
        <Link href={`/products/${product.slug}`} className="block mb-1.5 group/title">
          <h3 className="text-[18px] font-semibold text-[#1A1A1A] group-hover/title:text-[#4E5942] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[15px] text-[#5A5650] line-clamp-1 mt-1 leading-normal font-normal">
            {product.subtitle}
          </p>
        </Link>

        {/* Rating & Review Count (Only shown if reviewCount > 0) */}
        {product.reviewCount > 0 ? (
          <div className="flex items-center gap-1.5 my-2">
            <div className="flex items-center text-[#D4A373]">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-[15px] font-semibold ml-1.5 text-[#1A1A1A]">
                {product.rating}
              </span>
            </div>
            <span className="text-[15px] text-[#736E67]">
              ({product.reviewCount})
            </span>
          </div>
        ) : (
          <div className="my-2 h-5" />
        )}

        {/* Pricing */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="text-[18px] font-bold text-[#1A1A1A]">
            {formatINR(currentVariant.price)}
          </span>
          {currentVariant.mrp > currentVariant.price && (
            <>
              <span className="text-[15px] text-[#736E67] line-through">
                {formatINR(currentVariant.mrp)}
              </span>
              <span className="text-[12px] font-semibold text-[#A94438] bg-[#FDF2F0] border border-[#F5D5D0] px-2 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Size Variant Chips */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariantId(v.id);
                }}
                className={`text-[15px] px-3 py-1.5 rounded-2xs transition-all duration-150 border ${
                  currentVariant.id === v.id
                    ? "bg-[#1A1A1A] text-[#FBF9F5] border-[#1A1A1A] font-semibold"
                    : "bg-[#FBF9F5] text-[#4A4640] border-[#E8E3DA] hover:border-[#1A1A1A]"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        )}

        {/* Add to Cart CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingLocal || !currentVariant.inStock}
          className={`mt-auto w-full py-3.5 px-4 text-[15px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${
            !currentVariant.inStock
              ? "bg-[#EFECE4] text-[#A6A095] cursor-not-allowed"
              : isAddedLocal
              ? "bg-[#4E5942] text-[#FBF9F5]"
              : isAddingLocal
              ? "bg-[#333333] text-[#FBF9F5] cursor-wait"
              : "bg-[#1A1A1A] hover:bg-[#333333] text-[#FBF9F5]"
          }`}
          aria-live="polite"
        >
          {!currentVariant.inStock ? (
            <span>Sold Out</span>
          ) : isAddedLocal ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added</span>
            </>
          ) : isAddingLocal ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
