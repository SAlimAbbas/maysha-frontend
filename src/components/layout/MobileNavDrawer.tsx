"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight, Search, User, ShoppingBag, ArrowRight } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCartStore } from "@/stores/cartStore";

export default function MobileNavDrawer() {
  const { isMobileMenuOpen, closeMobileMenu, openSearch } = useUIStore();
  const { openCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  if (!isMobileMenuOpen) return null;

  const totalItems = mounted ? getTotalItems() : 0;

  const handleSearchClick = () => {
    closeMobileMenu();
    openSearch();
  };

  const handleCartClick = () => {
    closeMobileMenu();
    openCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex bg-[#1A1A1A]/50 backdrop-blur-xs transition-opacity duration-300"
      onClick={closeMobileMenu}
    >
      <div
        className="w-full max-w-xs sm:max-w-sm h-full bg-[#FFFFFF] flex flex-col shadow-2xl transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8E3DA] bg-[#FBF9F5]">
          <span className="text-2xl font-bold tracking-[0.16em] uppercase text-[#1A1A1A]">
            MAYSHA
          </span>
          <button
            onClick={closeMobileMenu}
            className="p-2 text-[#5A5650] hover:text-[#1A1A1A] transition-colors rounded-full"
            aria-label="Close navigation"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links Navigation List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[#F0ECE4]">
          <div className="py-2 space-y-1">
            <Link
              href="/shop"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-[17px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
            >
              <span>Shop All Products</span>
              <ChevronRight className="w-5 h-5 text-[#8C867D]" />
            </Link>

            <Link
              href="/collections/cleansers"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3 pl-3 text-[15px] font-medium text-[#4A4640] hover:text-[#1A1A1A] transition-colors"
            >
              <span>Cleansers</span>
              <ChevronRight className="w-4 h-4 text-[#8C867D]" />
            </Link>

            <Link
              href="/collections/serums"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3 pl-3 text-[15px] font-medium text-[#4A4640] hover:text-[#1A1A1A] transition-colors"
            >
              <span>Serums</span>
              <ChevronRight className="w-4 h-4 text-[#8C867D]" />
            </Link>

            <Link
              href="/collections/moisturizers"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3 pl-3 text-[15px] font-medium text-[#4A4640] hover:text-[#1A1A1A] transition-colors"
            >
              <span>Moisturizers</span>
              <ChevronRight className="w-4 h-4 text-[#8C867D]" />
            </Link>

            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-[17px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
            >
              <span>About Us</span>
              <ChevronRight className="w-5 h-5 text-[#8C867D]" />
            </Link>

            <Link
              href="/about#journal"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-[17px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
            >
              <span>Journal & Rituals</span>
              <ChevronRight className="w-5 h-5 text-[#8C867D]" />
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="py-3 space-y-1">
            <button
              onClick={handleSearchClick}
              className="w-full flex items-center justify-between py-3.5 text-[16px] font-medium text-[#1A1A1A] hover:text-[#4E5942] transition-colors text-left"
            >
              <span className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[#8C867D]" />
                Search
              </span>
              <ChevronRight className="w-5 h-5 text-[#8C867D]" />
            </button>

            <Link
              href="/about#contact"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-[16px] font-medium text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
            >
              <span className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#8C867D]" />
                Account
              </span>
              <ChevronRight className="w-5 h-5 text-[#8C867D]" />
            </Link>

            <button
              onClick={handleCartClick}
              className="w-full flex items-center justify-between py-3.5 text-[16px] font-medium text-[#1A1A1A] hover:text-[#4E5942] transition-colors text-left"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#8C867D]" />
                Cart ({totalItems})
              </span>
              <ChevronRight className="w-5 h-5 text-[#8C867D]" />
            </button>
          </div>
        </div>

        {/* Bottom Editorial Banner Card */}
        <div className="p-5 border-t border-[#E8E3DA] bg-[#F6F3EC]">
          <div className="rounded-xs p-4 bg-[#EFECE4] border border-[#E5E0D8]">
            <p className="text-[13px] uppercase tracking-wider text-[#4E5942] font-semibold mb-1">
              Maysha Philosophy
            </p>
            <h4 className="text-[17px] font-semibold text-[#1A1A1A] leading-snug mb-1.5">
              Clean Beauty for Real Skin
            </h4>
            <p className="text-[14px] text-[#4A4640] mb-3 leading-relaxed font-normal">
              Rooted in nature. Crafted with care. Experience formulas that nurture your skin barrier.
            </p>
            <Link
              href="/shop"
              onClick={closeMobileMenu}
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
