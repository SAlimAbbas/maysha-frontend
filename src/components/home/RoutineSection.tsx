"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface RoutineStep {
  step: string;
  name: string;
  action: string;
  href: string;
  icon: React.ReactNode;
}

const ROUTINE_STEPS: RoutineStep[] = [
  {
    step: "01",
    name: "Cleanser",
    action: "Cleanse",
    href: "/collections/cleansers",
    icon: (
      <svg
        className="w-7 h-7 stroke-[#4E5942]"
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
    step: "02",
    name: "Toner",
    action: "Balance",
    href: "/collections/toners",
    icon: (
      <svg
        className="w-7 h-7 stroke-[#4E5942]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="7" y="5" width="10" height="17" rx="3" />
        <path d="M10 2h4v3h-4z" />
        <path d="M12 12v3" />
      </svg>
    ),
  },
  {
    step: "03",
    name: "Serum",
    action: "Treat",
    href: "/collections/serums",
    icon: (
      <svg
        className="w-7 h-7 stroke-[#4E5942]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m14 4-2-2-2 2" />
        <path d="M12 2v6" />
        <path d="M8 8h8v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2Z" />
        <path d="M10 13h4" />
      </svg>
    ),
  },
  {
    step: "04",
    name: "Moisturizer",
    action: "Hydrate",
    href: "/collections/moisturizers",
    icon: (
      <svg
        className="w-7 h-7 stroke-[#4E5942]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21a8 8 0 0 0 8-8c0-4-8-11-8-11S4 9 4 13a8 8 0 0 0 8 8z" />
        <path d="M12 17a4 4 0 0 0 4-4" />
      </svg>
    ),
  },
  {
    step: "05",
    name: "Sunscreen",
    action: "Protect",
    href: "/collections/sunscreen",
    icon: (
      <svg
        className="w-7 h-7 stroke-[#4E5942]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
  },
];

export default function RoutineSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FBF9F5] border-t border-[#E8E3DA] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <span className="text-[12px] uppercase tracking-[0.16em] text-[#4E5942] font-semibold block mb-2">
            Daily Ritual
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#1A1A1A] tracking-tight">
            Your Skincare Routine
          </h2>
          <p className="text-sm md:text-base text-[#736E67] mt-2">
            Simple steps. Visible results.
          </p>
        </div>

        {/* 5-Step Flow Diagram */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 items-center">
          {ROUTINE_STEPS.map((item, idx) => (
            <div
              key={item.step}
              className="relative flex flex-col items-center"
            >
              <Link
                href={item.href}
                className="w-full rounded-xs p-6 flex flex-col items-center text-center group hover:border-[#1A1A1A] transition-all duration-300 hover:shadow-xs"
              >
                <div className="w-18 h-18 rounded-full bg-[#EFECE4] flex items-center justify-center mb-4 group-hover:bg-[#EDF3E8] transition-colors">
                  {item.icon}
                </div>

                <span className="text-[11px] font-mono font-semibold text-[#8C867D] uppercase tracking-wider mb-1">
                  Step {item.step}
                </span>

                <h3 className="text-[18px] font-semibold text-[#1A1A1A] group-hover:text-[#4E5942] transition-colors">
                  {item.name}
                </h3>

                <span className="text-[14px] text-[#736E67] mt-0.5">
                  {item.action}
                </span>
              </Link>

              {/* Connecting arrow (hidden on last item and on small screens when wrapping) */}
              {idx < ROUTINE_STEPS.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#B8B2A7]">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
