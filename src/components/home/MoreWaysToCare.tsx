"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useUIStore } from "@/stores/uiStore";

import { Product } from "@/types";

interface MoreWaysToCareProps {
  products?: Product[];
}

const FALLBACK_PRODUCTS = [
  {
    id: "face-wash",
    slug: "face-wash",
    name: "Vitamin C & Niacinamide Face Wash",
    subtitle: "Gentle Everyday Herbal Cleanser with Aloe Vera & Mild Surfactants",
    price: 399,
    mrp: 499,
    discount: "20% OFF",
    rating: 4.9,
    reviewCount: 186,
    badge: "NEW",
    image: "/images/products/face-wash/face-wash-1.png",
    variantId: "1",
  },
  {
    id: "rosemary-hair-oil",
    slug: "rosemary-hair-oil",
    name: "Rosemary Hair Oil with Blend of 8 Oils",
    subtitle: "Strengthens Hair Roots & Controls Frizz with 100% Pure Botanical Extracts",
    price: 499,
    mrp: 699,
    discount: "28% OFF",
    rating: 4.9,
    reviewCount: 142,
    badge: "NEW",
    image: "/images/products/rosemary-hair-oil/hair-oil-1.png",
    variantId: "2",
  },
];

export default function MoreWaysToCare({ products = [] }: MoreWaysToCareProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToast } = useUIStore();

  // If dynamic products provided from backend, adapt them; otherwise use local client fallbacks
  const displayItems =
    products && products.length > 0
      ? products.slice(0, 2).map((p) => {
          const rawImg = p.images?.[0] || p.hoverImage;
          const safeImg =
            typeof rawImg === "string" && rawImg.trim().length > 0
              ? rawImg.trim()
              : typeof rawImg === "object" && rawImg !== null && (rawImg as any).url
              ? String((rawImg as any).url)
              : "/images/products/face-wash/face-wash-1.png";

          const primaryVar = p.variants?.[0];
          const discountStr =
            p.discountPercentage > 0
              ? `${p.discountPercentage}% OFF`
              : primaryVar && primaryVar.mrp > primaryVar.price
              ? `${Math.round(((primaryVar.mrp - primaryVar.price) / primaryVar.mrp) * 100)}% OFF`
              : "";

          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            subtitle: p.subtitle || "Barrier-conscious botanical formulation",
            price: primaryVar ? primaryVar.price : p.price,
            mrp: primaryVar ? primaryVar.mrp : p.mrp,
            discount: discountStr,
            rating: p.rating || 4.8,
            reviewCount: p.reviewCount || 48,
            badge: p.badge ? p.badge.split(",")[0].trim() : "NEW",
            image: safeImg,
            variantId: primaryVar?.id || p.id,
          };
        })
      : FALLBACK_PRODUCTS;

  const handleAddToCart = async (item: (typeof displayItems)[0]) => {
    try {
      await addItem({ variantId: item.variantId || item.id, quantity: 1 });
      addToast("Added to Bag", `${item.name} added to your bag.`, "success");
    } catch {
      addToast("Added to Bag", `${item.name} ready in your cart.`, "info");
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] border-t border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <span className="text-[12px] uppercase tracking-[0.16em] text-[#4E5942] font-semibold block mb-2">
            New Products
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#1A1A1A] tracking-tight">
            More ways to care
          </h2>
          <p className="text-sm md:text-base text-[#736E67] mt-2">
            Explore our latest additions to your skincare routine.
          </p>
        </div>

        {/* 3-Column Grid matching AFTER Blueprint */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {displayItems.map((prod) => {
            const wish = isWishlisted(prod.id);
            return (
              <div
                key={prod.id}
                className="border border-[#E8E3DA] rounded-xs overflow-hidden flex flex-col justify-between group hover:border-[#1A1A1A]/40 transition-all shadow-2xs"
              >
                <div>
                  {/* Photo area */}
                  <div className="relative aspect-square bg-[#F5F2EB] flex items-center justify-center overflow-hidden">
                    <span className="absolute top-4 left-4 bg-[#4E5942] text-white text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-2xs z-10">
                      {prod.badge}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(prod.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-xs transition-colors z-10 ${
                        wish
                          ? "bg-[#FDF2F2] text-[#A94438]"
                          : "bg-white/80 hover:bg-white text-[#736E67] hover:text-[#1A1A1A]"
                      }`}
                      aria-label="Wishlist toggle"
                    >
                      <Heart
                        className={`w-4 h-4 ${wish ? "fill-current" : ""}`}
                      />
                    </button>

                    <Link
                      href={`/products/${prod.slug}`}
                      className="relative w-full h-full block"
                    >
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </Link>
                  </div>

                  {/* Content area */}
                  <div className="p-6">
                    <Link href={`/products/${prod.slug}`}>
                      <h3 className="text-lg font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors">
                        {prod.name}
                      </h3>
                    </Link>
                    <p className="text-[13px] text-[#736E67] mt-1 line-clamp-2">
                      {prod.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-base font-bold text-[#1A1A1A]">
                        ₹{prod.price}
                      </span>
                      <span className="text-sm text-[#8C867D] line-through">
                        ₹{prod.mrp}
                      </span>
                      <span className="text-[11px] font-semibold text-[#A94438] bg-[#FDF2F2] px-2 py-0.5 rounded-2xs">
                        {prod.discount}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2.5 text-[12px] text-[#736E67]">
                      <div className="flex text-[#D4A373]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="font-semibold text-[#1A1A1A]">
                        {prod.rating}
                      </span>
                      <span>({prod.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart button */}
                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod)}
                    className="w-full bg-[#4E5942] hover:bg-[#3E4534] text-white py-3 px-4 rounded-2xs text-[13px] uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Visual Editorial Card (matches "Pure Ingredients. Real Results.") */}
          <div className="relative bg-[#EFECE4] border border-[#E8E3DA] rounded-xs p-8 flex flex-col justify-between overflow-hidden group min-h-[360px]">
            {/* Background botanical visual */}
            <div className="absolute -right-6 -top-6 w-56 h-56 opacity-40 group-hover:scale-105 transition-transform duration-500 pointer-events-none">
              <Image
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80"
                alt="Botanical flower"
                fill
                className="object-cover rounded-full"
              />
            </div>

            <div className="relative z-10">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#4E5942] font-semibold block mb-3">
                Maysha Laboratory
              </span>
              <h3 className="text-3xl font-normal text-[#1A1A1A] leading-tight max-w-[200px]">
                Pure Ingredients. <br />
                <span className="font-semibold">Real Results.</span>
              </h3>
            </div>

            <div className="relative z-10 pt-8">
              <p className="text-[14px] text-[#5A5650] leading-relaxed mb-4">
                Formulated at natural pH with therapeutic botanical actives.
                Every formulation is clinically evaluated for barrier defense.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#4E5942] hover:text-[#1A1A1A] group/link underline"
              >
                <span>Explore All Formulations</span>
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
