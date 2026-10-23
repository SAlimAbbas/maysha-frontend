"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Banner } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatINR } from "@/lib/api";

interface HeroProps {
  initialBanners?: Banner[];
}

export default function Hero({ initialBanners = [] }: HeroProps) {
  const banners: Banner[] =
    initialBanners && initialBanners.length > 0
      ? initialBanners.slice(0, 7)
      : [
          {
            id: "banner-bogo",
            title: "BUY 1 GET 1 FREE — Vitamin C & Niacinamide Face Wash",
            subtitle:
              "Gentle everyday herbal cleanser designed for regular use with Aloe Vera & Glycerin.",
            desktopImage: "/banners/maysha-bogo-banner.png",
            mobileImage: "/banners/maysha-bogo-banner.png",
            linkUrl: "/products/vitamin-c-niacinamide-face-wash",
            badgeText: "LIMITED TIME OFFER",
            sortOrder: 1,
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { threshold } = useCart();

  const total = banners.length;

  const goToNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay timer (5 seconds)
  useEffect(() => {
    if (total <= 1 || isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [goToNext, isPaused, total, currentIndex]);

  // Touch swipe handling for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) {
      setIsPaused(false);
      return;
    }
    const distance = touchStartX - touchEndX;
    const isSwipeLeft = distance > 50;
    const isSwipeRight = distance < -50;

    if (isSwipeLeft) {
      goToNext();
    } else if (isSwipeRight) {
      goToPrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
    setIsPaused(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrev();
    if (e.key === "ArrowRight") goToNext();
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Promotional Carousel"
      className="relative w-full bg-[#FBF9F5] border-b border-[#E8E3DA] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Banner Container */}
      <div
        className="relative w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] md:aspect-auto md:h-[480px] lg:h-[560px] xl:h-[620px] max-h-[640px]">
          {banners.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={banner.id || index}
                aria-hidden={!isActive}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  isActive
                    ? "opacity-100 z-10 pointer-events-auto"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Link
                  href={banner.linkUrl || "/shop"}
                  className="block relative w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-inset"
                  tabIndex={isActive ? 0 : -1}
                  aria-label={banner.title}
                >
                  {/* Desktop & Tablet Banner Image (768px and up) */}
                  <div className="relative w-full h-full bg-[#EFECE4] hidden md:block">
                    <Image
                      src={banner.desktopImage}
                      alt={banner.title || "Maysha Skincare Banner"}
                      fill
                      priority={index === 0}
                      quality={92}
                      sizes="100vw"
                      className="object-cover object-center w-full h-full"
                    />
                  </div>

                  {/* Mobile Banner Image (under 768px) */}
                  <div className="relative w-full h-full bg-[#EFECE4] block md:hidden">
                    <Image
                      src={banner.mobileImage || banner.desktopImage}
                      alt={banner.title || "Maysha Skincare Banner"}
                      fill
                      priority={index === 0}
                      quality={92}
                      sizes="100vw"
                      className="object-cover object-center w-full h-full"
                    />
                  </div>

                  {/* Accessibility & Visual Overlay */}
                  {/* {banner.badgeText && (
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-20">
                      <span className="inline-block bg-[#1A1A1A]/85 backdrop-blur-md text-[#FBF9F5] text-[13px] sm:text-[14px] font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-white/20">
                        {banner.badgeText}
                      </span>
                    </div>
                  )} */}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Carousel Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                goToPrev();
              }}
              aria-label="Previous Slide"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-[#1A1A1A] border border-[#E8E3DA] backdrop-blur-md shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                goToNext();
              }}
              aria-label="Next Slide"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-[#1A1A1A] border border-[#E8E3DA] backdrop-blur-md shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Carousel Controls Bottom Bar */}
        {total > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-3 pointer-events-none">
            <div className="flex items-center gap-2 bg-[#FFFFFF]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E3DA] shadow-sm pointer-events-auto">
              <div
                className="flex items-center gap-1.5"
                role="tablist"
                aria-label="Slides"
              >
                {banners.map((_, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <button
                      key={index}
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => goToSlide(index)}
                      className={`h-2 transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] ${
                        isActive
                          ? "w-7 sm:w-8 bg-[#1A1A1A]"
                          : "w-2 bg-[#1A1A1A]/30 hover:bg-[#1A1A1A]/60"
                      }`}
                    />
                  );
                })}
              </div>

              <div className="h-3 w-[1px] bg-[#E8E3DA] mx-1" />

              {/* <span className="text-[14px] font-semibold text-[#1A1A1A] tracking-wider tabular-nums">
                {currentIndex + 1} <span className="text-[#888] font-normal">/</span> {total}
              </span> */}

              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                className="text-[#5A5650] hover:text-[#1A1A1A] p-0.5 transition-colors cursor-pointer"
              >
                {isPaused ? (
                  <Play className="w-3.5 h-3.5" />
                ) : (
                  <Pause className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust Micro-Bar */}
      <div className="bg-[#FFFFFF] border-t border-[#E8E3DA] py-3 px-4 sm:px-6">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="w-2 h-2 rounded-full bg-[#4E5942]" />
            <span className="text-[14px] sm:text-[15px] font-semibold text-[#1A1A1A]">
              100% Clean Formulations
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E5942]" />
            <span className="text-[14px] sm:text-[15px] font-semibold text-[#1A1A1A]">
              Dermatologically Tested
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E5942]" />
            <span className="text-[14px] sm:text-[15px] font-semibold text-[#1A1A1A]">
              Cruelty-Free & Vegan
            </span>
          </div>
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="w-2 h-2 rounded-full bg-[#4E5942]" />
            <span className="text-[14px] sm:text-[15px] font-semibold text-[#1A1A1A]">
              Free Shipping Over {formatINR(threshold)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
