"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ANNOUNCEMENTS = [
  "Free shipping on orders above ₹999",
  "Use code MAYSHA10 for 10% off your first order",
  "Dermatologically tested • 100% clean & cruelty-free"
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? ANNOUNCEMENTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
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
          <span>{ANNOUNCEMENTS[index]}</span>
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
