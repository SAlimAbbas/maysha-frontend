"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/skeleton";

export default function CollectionPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [isLoading, setIsLoading] = useState(true);

  const category = CATEGORIES.find((c) => c.slug === slug);
  const products = getProductsByCategory(slug);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [slug]);

  if (!category) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Category Not Found</h1>
        <p className="text-[15px] text-[#736E67] mb-6">
          The requested collection could not be located.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white text-[15px] uppercase tracking-wider font-semibold px-7 py-3.5 rounded-2xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-8 lg:py-12 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-[#736E67] mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#1A1A1A] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">{category.name}</span>
        </nav>

        {/* Collection Header */}
        <div className="mb-10 pb-6 border-b border-[#E8E3DA]">
          <span className="text-[14px] uppercase tracking-[0.16em] font-semibold text-[#4E5942] mb-1.5 block">
            Maysha Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1A1A1A] mb-2.5">
            {category.name}
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#5A5650] max-w-xl leading-relaxed font-normal">
            {category.subtitle}
          </p>
        </div>

        {/* Products */}
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[15px] text-[#736E67]">
              New products in this category are coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
