"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export default function CategoryGrid() {
  return (
    <section className="py-12 sm:py-16 bg-[#FBF9F5] border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A1A]">
              Shop By Category
            </h2>
            <p className="text-xs sm:text-sm text-[#736E67] mt-1">
              Explore targeted formulations designed for every stage of your skincare ritual
            </p>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className="group flex flex-col items-center bg-[#FFFFFF] border border-[#E8E3DA] hover:border-[#1A1A1A] p-3 sm:p-4 rounded-xs transition-all duration-300 text-center"
            >
              <div className="w-full aspect-square relative bg-[#EFECE4] rounded-xs overflow-hidden mb-3">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
              </div>
              <h3 className="font-serif text-sm font-medium text-[#1A1A1A] group-hover:text-[#4E5942] transition-colors leading-tight">
                {category.name}
              </h3>
              <span className="text-[11px] text-[#8C867D] mt-0.5">
                {category.itemCount} items
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
