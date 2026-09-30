"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function EditorialSection() {
  return (
    <section className="bg-[#F5F2EB] border-b border-[#E8E3DA] overflow-hidden">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Botanical Visual (matching reference) */}
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[16/10] lg:aspect-auto lg:h-[480px] bg-[#EAE5DC]">
            <Image
              src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=85"
              alt="Lush green botanical leaves in natural sunlight"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Right Narrative Copy */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4E5942] mb-3 block">
              Formulation Ethics
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1A1A] leading-tight mb-5">
              Natural Ingredients. <br />
              <span className="italic">Visible Results.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5A5650] leading-relaxed max-w-lg mb-8 font-light">
              We reject the false compromise between natural purity and clinical efficacy. Every Maysha formulation begins with potent plant adaptogens, biocompatible antioxidants, and barrier-repairing ceramides proven to produce tangible results on real skin.
            </p>

            <div>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#4E5942] border-b border-[#1A1A1A] pb-1 hover:border-[#4E5942] transition-colors"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
