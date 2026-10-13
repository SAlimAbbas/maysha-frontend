import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";

interface BestsellersProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function Bestsellers({
  products = [],
  title = "Bestsellers",
  subtitle = "Our most celebrated formulations, backed by glowing customer reviews",
}: BestsellersProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#FBF9F5] border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
              {title}
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#5A5650] mt-1.5 font-normal">
              {subtitle}
            </p>
          </div>

          <Link
            href="/shop"
            className="group flex items-center gap-1.5 text-[15px] uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
