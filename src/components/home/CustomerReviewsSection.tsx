"use client";

import React, { useState } from "react";
import { Star, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Review } from "@/types";

interface CustomerReviewsSectionProps {
  reviews: Review[];
}

export default function CustomerReviewsSection({ reviews = [] }: CustomerReviewsSectionProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  if (!reviews || reviews.length === 0) return null;

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, reviews.length - visibleCount) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + visibleCount >= reviews.length ? 0 : prev + 1));
  };

  const displayedReviews = reviews.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="py-12 sm:py-16 bg-[#FBF9F5] border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
              What Our Customers Say
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#5A5650] mt-1.5 font-normal">
              Real stories and experiences from verified Maysha users
            </p>
          </div>

          {reviews.length > visibleCount && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-full transition-colors"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-full transition-colors"
                aria-label="Next reviews"
              >
                <ChevronRight className="w-5 h-5 text-[#1A1A1A]" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFFFFF] border border-[#E8E3DA] p-6 sm:p-7 rounded-xs flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex text-[#D4A373]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[14px] text-[#736E67] font-medium">{rev.date}</span>
                </div>

                <h4 className="text-[18px] font-semibold text-[#1A1A1A] mb-2 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h4>
                <p className="text-[15px] text-[#4A4640] leading-relaxed mb-6 font-normal">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                    {rev.author}
                    {rev.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[13px] text-[#4E5942] font-semibold">
                        <CheckCircle className="w-3.5 h-3.5 text-[#4E5942]" /> Verified
                      </span>
                    )}
                  </p>
                  {rev.productName && (
                    <p className="text-[14px] text-[#736E67] mt-0.5 font-normal">
                      Purchased: <span className="text-[#1A1A1A] font-medium">{rev.productName}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
