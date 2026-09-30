"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CONCERNS } from "@/data/categories";

export default function ShopByConcern() {
  return (
    <section className="py-12 sm:py-16 bg-[#FBF9F5] border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A1A]">
              Shop by Concern
            </h2>
            <p className="text-xs sm:text-sm text-[#736E67] mt-1">
              Targeted routines formulated for your skin&apos;s unique challenges
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CONCERNS.map((concern) => (
            <Link
              key={concern.id}
              href={`/shop?concern=${concern.slug}`}
              className="group bg-[#FFFFFF] border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-xs overflow-hidden transition-all duration-300 flex flex-col"
            >
              <div className="w-full aspect-[4/3] relative bg-[#EFECE4] overflow-hidden">
                <Image
                  src={concern.image}
                  alt={concern.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="p-3 text-center flex-1 flex flex-col justify-center">
                <h3 className="font-serif text-sm font-medium text-[#1A1A1A] group-hover:text-[#4E5942] transition-colors">
                  {concern.name}
                </h3>
                <p className="text-[11px] text-[#8C867D] mt-1 line-clamp-2">
                  {concern.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
