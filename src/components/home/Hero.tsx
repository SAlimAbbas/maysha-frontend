"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Leaf } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FBF9F5] border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFECE4] border border-[#E2DDD2] text-xs font-medium text-[#4E5942]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Restorative Clinical Botanical Formulations</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1A1A1A] leading-[1.12]">
                Clean Beauty <br className="hidden sm:inline" />
                <span className="italic font-normal">for Real Skin</span>
              </h1>
              <p className="text-base sm:text-lg text-[#5A5650] max-w-lg leading-relaxed font-light">
                Thoughtfully crafted skincare that works with your skin, not against it. Biocompatible pH-balanced formulations with zero harmful additives.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="bg-[#1A1A1A] hover:bg-[#333333] text-[#FBF9F5] px-8 py-3.5 text-xs uppercase tracking-wider font-semibold rounded-2xs transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 flex items-center gap-2 group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="text-[#1A1A1A] hover:text-[#4E5942] px-6 py-3.5 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Our Philosophy</span>
              </Link>
            </div>

            {/* Micro Pillars */}
            <div className="pt-6 sm:pt-8 border-t border-[#E8E3DA] grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#4E5942] shrink-0" />
                <span className="text-xs text-[#5A5650] font-medium leading-tight">
                  100% Vegan & Clean
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#4E5942] shrink-0" />
                <span className="text-xs text-[#5A5650] font-medium leading-tight">
                  Dermatologist Approved
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4E5942] shrink-0" />
                <span className="text-xs text-[#5A5650] font-medium leading-tight">
                  Clinically Proven
                </span>
              </div>
            </div>
          </div>

          {/* Right Product Hero Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-square sm:aspect-[5/4] lg:aspect-[4/3] rounded-xs overflow-hidden shadow-xl border border-[#E8E3DA] bg-[#EFECE4]">
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85"
                alt="Maysha Gentle Face Cleanser on Sandstone"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-102"
              />

              {/* Floating Product Highlight Tag */}
              <div className="absolute bottom-5 left-5 bg-[#FFFFFF]/90 backdrop-blur-md p-3 rounded-xs border border-[#E8E3DA] shadow-sm max-w-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#4E5942] font-semibold block">
                  Signature Ritual
                </span>
                <p className="font-serif text-sm font-medium text-[#1A1A1A]">
                  Gentle Face Cleanser
                </p>
                <p className="text-[11px] text-[#5A5650] mt-0.5">
                  Natural oat extract & provitamin B5 • ₹399
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
