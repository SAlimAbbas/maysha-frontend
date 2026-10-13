import React from "react";

interface Pillar {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PILLARS: Pillar[] = [
  {
    number: "01",
    title: "Thoughtful Formulations",
    description:
      "Every product is conceptualized to solve specific epidermal needs with biocompatible botanical actives formulated at skin-neutral pH.",
    icon: (
      <svg
        className="w-6 h-6 stroke-[#4E5942]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0" />
        <path d="M5.52 16h12.96" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Ingredient-Conscious",
    description:
      "We source cold-pressed organic botanicals and bio-identical peptides while strictly omitting sulfates, parabens, and micro-plastics.",
    icon: (
      <svg
        className="w-6 h-6 stroke-[#4E5942]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Skin-First Philosophy",
    description:
      "We believe that a resilient, hydrated acid mantle is the true foundation of enduring radiance, not abrasive quick fixes.",
    icon: (
      <svg
        className="w-6 h-6 stroke-[#4E5942]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Everyday Practicality",
    description:
      "Luxurious textures that absorb seamlessly in seconds, pairing effortlessly under daily SPF, makeup, and changing climates.",
    icon: (
      <svg
        className="w-6 h-6 stroke-[#4E5942]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Transparent Approach",
    description:
      "Complete ingredient transparency. We disclose all concentrations, active origins, and stability testing openly.",
    icon: (
      <svg
        className="w-6 h-6 stroke-[#4E5942]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Designed for Real Skin",
    description:
      "Formulated and tested extensively across diverse Indian skin types to balance sebum, calm inflammation, and restore uniform clarity.",
    icon: (
      <svg
        className="w-6 h-6 stroke-[#4E5942]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
];

export default function WhatMakesUsSpecial({
  title = "What Makes Us Special",
  subtitle = "Our commitment to biological harmony and honest formulation standards",
  className = "",
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <section
      className={`py-16 md:py-24 bg-[#FBF9F5] border-t border-[#E8E3DA] ${className}`}
    >
      <div className="max-w-[1360px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-[12px] uppercase tracking-[0.14em] text-[#4E5942] font-semibold block mb-2">
            The Maysha Standard
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#1A1A1A] tracking-tight">
            {title}
          </h2>
          <p className="text-sm md:text-base text-[#736E67] mt-3">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.number}
              className="border border-[#E8E3DA] p-6 md:p-8 rounded-[25px] hover:border-[#4E5942]/40 transition-all duration-300 group shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center justify-between mb-6">
                {/* <div className="w-12 h-12 rounded-full bg-[#EFECE4]/60 flex items-center justify-center group-hover:bg-[#EFF7F2] transition-colors">
                  {pillar.icon}
                </div> */}
                <h3 className="text-[22px] font-normal text-[#1A1A1A] mb-2 tracking-tight group-hover:text-[#4E5942] transition-colors">
                  {pillar.title}
                </h3>
                <div className="w-12 h-12 rounded-full bg-[#EFECE4]/60 flex items-center justify-center group-hover:bg-[#EFF7F2] transition-colors">
                  {pillar.icon}
                </div>
                {/* <span className="text-xs font-semibold text-[#A6A095] tracking-widest">
                  {pillar.number}
                </span> */}
              </div>
              <p className="text-[15px] text-[#5A5650] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
