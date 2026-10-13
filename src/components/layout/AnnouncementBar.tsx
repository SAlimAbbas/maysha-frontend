"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatINR } from "@/lib/api";

export default function AnnouncementBar() {
  const { storeInfo, threshold } = useCart();
  const [index, setIndex] = useState(0);

  const formattedThreshold = formatINR(threshold);

  const announcements = [
    `FREE Express Shipping on orders over ${formattedThreshold}`,
    "Use code MAYSHA10 for 10% off your order",
    "Clean, Dermatologically Tested Botanical Formulations",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <aside
      className="bg-[#3E4534] text-[#FBF9F5] text-[15px] py-2.5 px-4 select-none relative z-40 transition-colors font-medium tracking-wide"
      aria-label="Announcement"
    >
      <div className="max-w-[1360px] mx-auto flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="text-[#EFECE4]/80 hover:text-white transition-opacity p-1 focus:outline-hidden"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 text-center font-medium tracking-wide transition-opacity duration-300">
          <span>{announcements[index]}</span>
        </div>

        <button
          onClick={handleNext}
          className="text-[#EFECE4]/80 hover:text-white transition-opacity p-1 focus:outline-hidden"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
