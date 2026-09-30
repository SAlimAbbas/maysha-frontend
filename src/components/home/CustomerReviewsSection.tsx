"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { CUSTOMER_REVIEWS } from "@/data/reviews";

export default function CustomerReviewsSection() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, CUSTOMER_REVIEWS.length - visibleCount) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + visibleCount >= CUSTOMER_REVIEWS.length ? 0 : prev + 1));
  };

  const displayedReviews = CUSTOMER_REVIEWS.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="py-12 sm:py-16 bg-[#FBF9F5] border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A1A]">
              What Our Customers Say
            </h2>
            <p className="text-xs sm:text-sm text-[#736E67] mt-1">
              Real stories and experiences from verified Maysha users
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-full transition-colors"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-full transition-colors"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFFFFF] border border-[#E8E3DA] p-6 rounded-xs flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#D4A373]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8C867D]">{rev.date}</span>
                </div>

                <h4 className="font-serif text-base font-medium text-[#1A1A1A] mb-2 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h4>
                <p className="text-xs text-[#5A5650] leading-relaxed mb-6 font-light">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                    {rev.author}
                    {rev.isVerified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[#4E5942] font-normal">
                        <CheckCircle className="w-3 h-3 text-[#4E5942]" /> Verified
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-[#8C867D] mt-0.5">
                    Purchased: <span className="text-[#5A5650]">{rev.productName}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
