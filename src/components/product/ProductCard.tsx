"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Check, ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(
    product.variants[0]?.size || product.size
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addItem } = useCartStore();
  const { addToast } = useUIStore();

  const currentVariant =
    product.variants.find((v) => v.size === selectedSize) || {
      price: product.price,
      mrp: product.mrp,
    };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || isAdded) return;

    setIsAdding(true);
    setTimeout(() => {
      addItem(product, selectedSize, 1);
      setIsAdding(false);
      setIsAdded(true);
      addToast(
        "Added to Cart",
        `${product.name} (${selectedSize}) is now in your cart.`,
        "success"
      );

      setTimeout(() => {
        setIsAdded(false);
      }, 1600);
    }, 280);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    addToast(
      !isWishlisted ? "Saved to Wishlist" : "Removed from Wishlist",
      `${product.name}`,
      "info"
    );
  };

  const displayImage =
    isHovered && product.hoverImage ? product.hoverImage : product.images[0];

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
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-[#1A1A1A] text-[#FBF9F5] text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-2xs shadow-xs z-10">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all duration-200 z-10 ${
            isWishlisted
              ? "bg-[#FFFFFF] text-[#A94438] shadow-xs"
              : "bg-[#FFFFFF]/80 text-[#8C867D] hover:text-[#1A1A1A] hover:bg-[#FFFFFF]"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform active:scale-75 ${
              isWishlisted ? "fill-current scale-110" : ""
            }`}
          />
        </button>
      </Link>

      {/* Product Information */}
      <div className="flex-1 flex flex-col p-4">
        {/* Title & Subtitle */}
        <Link href={`/products/${product.slug}`} className="block mb-1 group/title">
          <h3 className="font-serif text-base sm:text-[17px] font-medium text-[#1A1A1A] group-hover/title:text-[#4E5942] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#736E67] line-clamp-1 mt-0.5 leading-normal">
            {product.subtitle}
          </p>
        </Link>

        {/* Rating & Review Count */}
        <div className="flex items-center gap-1.5 my-2">
          <div className="flex items-center text-[#D4A373]">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-semibold ml-1 text-[#1A1A1A]">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-[#8C867D]">
            ({product.reviewCount})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
            ₹{currentVariant.price}
          </span>
          {currentVariant.mrp > currentVariant.price && (
            <>
              <span className="text-xs text-[#8C867D] line-through">
                ₹{currentVariant.mrp}
              </span>
              <span className="text-[11px] font-semibold text-[#A94438] bg-[#FDF2F0] px-1.5 py-0.5 rounded-2xs">
                {product.discountPercentage}% OFF
              </span>
            </>
          )}
        </div>

        {/* Size Variant Chips */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(v.size);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-2xs transition-all duration-150 border ${
                  selectedSize === v.size
                    ? "bg-[#1A1A1A] text-[#FBF9F5] border-[#1A1A1A] font-medium"
                    : "bg-[#FBF9F5] text-[#5A5650] border-[#E8E3DA] hover:border-[#1A1A1A]"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        )}

        {/* Add to Cart CTA with Micro-Interaction */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`mt-auto w-full py-2.5 px-4 text-xs uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${
            isAdded
              ? "bg-[#4E5942] text-[#FBF9F5]"
              : isAdding
              ? "bg-[#333333] text-[#FBF9F5] cursor-wait"
              : "bg-[#1A1A1A] hover:bg-[#333333] text-[#FBF9F5]"
          }`}
          aria-live="polite"
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : isAdding ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
