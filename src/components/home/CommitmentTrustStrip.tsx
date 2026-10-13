import React from "react";
import Image from "next/image";
import { Sparkles, Heart, ShieldCheck, Leaf } from "lucide-react";

const COMMITMENTS = [
  {
    title: "Clean Ingredients",
    subtitle: "Biocompatible botanicals at skin-neutral pH",
    icon: <Sparkles className="w-6 h-6 stroke-[#4E5942]" />,
  },
  {
    title: "Cruelty Free",
    subtitle: "Never tested on animals, strictly ethical",
    icon: <Heart className="w-6 h-6 stroke-[#4E5942]" />,
  },
  {
    title: "Sustainable Packaging",
    subtitle: "Recyclable glass & post-consumer resin",
    icon: <Leaf className="w-6 h-6 stroke-[#4E5942]" />,
  },
  {
    title: "Dermatologically Tested",
    subtitle: "Safe for sensitive skin & reactive barriers",
    icon: <ShieldCheck className="w-6 h-6 stroke-[#4E5942]" />,
  },
];

export default function CommitmentTrustStrip() {
  return (
    <section className="py-14 md:py-20 bg-[#F4F1EA] border-t border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8">
        <div className="bg-[#EFECE4] border border-[#E0DBD0] rounded-xs p-6 md:p-10 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left title & image block */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[12px] uppercase tracking-[0.18em] text-[#4E5942] font-semibold block">
                Maysha Standards
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] leading-tight">
                Our Commitment to Real Skin
              </h2>
              <p className="text-[15px] text-[#5A5650] leading-relaxed">
                Zero compromises on ingredient purity. We craft restorative
                barrier care that respects both your skin microbiome and the
                planet.
              </p>
            </div>

            {/* 4 Badges on the right */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {COMMITMENTS.map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-xs flex flex-col items-center text-center group hover:border-[#4E5942] transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#EDF3E8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-[#736E67] leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
