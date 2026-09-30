"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { getBestsellers } from "@/data/products";

export default function Bestsellers() {
  const [simulatedLoading, setSimulatedLoading] = useState(false);
  const bestsellers = getBestsellers().slice(0, 4);

  const handleSimulateSkeleton = () => {
    setSimulatedLoading(true);
    setTimeout(() => {
      setSimulatedLoading(false);
    }, 1200);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FBF9F5] border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Skeleton Demo Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
              Bestsellers
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#5A5650] mt-1.5 font-normal">
              Our most celebrated formulations, backed by glowing customer reviews
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSimulateSkeleton}
              className="text-[14px] font-medium text-[#4A4640] hover:text-[#1A1A1A] bg-[#EFECE4] px-3 py-1.5 rounded-2xs border border-[#E2DDD2] flex items-center gap-1.5 transition-colors"
              title="Preview loading skeleton state"
            >
              <Loader2 className={`w-3.5 h-3.5 ${simulatedLoading ? "animate-spin" : ""}`} />
              <span>Preview Skeleton UI</span>
            </button>

            <Link
              href="/shop"
              className="group flex items-center gap-1.5 text-[15px] uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Product Cards or Skeleton Grid */}
        <div className="transition-opacity duration-300">
          {simulatedLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestsellers.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 2} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
