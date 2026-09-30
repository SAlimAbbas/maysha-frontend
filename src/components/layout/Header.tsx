"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, User, Sparkles } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { openCart, getTotalItems } = useCartStore();
  const { openSearch, openMobileMenu } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "/about#journal" },
  ];

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FBF9F5]/95 backdrop-blur-md shadow-xs border-b border-[#E8E3DA]/80 py-3.5"
          : "bg-[#FBF9F5] border-b border-[#E8E3DA] py-4 sm:py-5"
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile Hamburger & Logo Group */}
          <div className="flex items-center gap-3 lg:gap-8">
            <button
              onClick={openMobileMenu}
              className="lg:hidden p-1.5 -ml-1.5 text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Branded Logo */}
            <Link
              href="/"
              className="group flex items-center gap-1.5 focus:outline-hidden"
              aria-label="Maysha Homepage"
            >
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.18em] text-[#1A1A1A] group-hover:text-[#4E5942] transition-colors uppercase">
                MAYSHA
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 ml-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative text-sm tracking-wide transition-colors py-1 group ${
                      isActive ? "text-[#1A1A1A] font-medium" : "text-[#5A5650] hover:text-[#1A1A1A]"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#4E5942] transition-transform duration-200 origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={openSearch}
              className="p-2 text-[#1A1A1A] hover:text-[#4E5942] hover:bg-[#F5F2EB] rounded-full transition-all active:scale-95 flex items-center gap-1.5"
              aria-label="Open search dialog"
            >
              <Search className="w-4 sm:w-[18px] h-4 sm:h-[18px]" />
              <span className="hidden md:inline text-xs text-[#8C867D]">
                Search
              </span>
            </button>

            {/* Account Link */}
            <Link
              href="/about#contact"
              className="p-2 text-[#1A1A1A] hover:text-[#4E5942] hover:bg-[#F5F2EB] rounded-full transition-all active:scale-95"
              aria-label="User Account"
            >
              <User className="w-4 sm:w-[18px] h-4 sm:h-[18px]" />
            </Link>

            {/* Cart Drawer Trigger with Badge */}
            <button
              onClick={openCart}
              className="p-2 text-[#1A1A1A] hover:text-[#4E5942] hover:bg-[#F5F2EB] rounded-full transition-all active:scale-95 relative flex items-center"
              aria-label={`Open shopping cart (${totalItems} items)`}
            >
              <ShoppingBag className="w-4 sm:w-[18px] h-4 sm:h-[18px]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#4E5942] text-[#FBF9F5] text-[10px] font-semibold min-w-4 h-4 rounded-full flex items-center justify-center px-1 shadow-xs animate-in zoom-in-50 duration-200">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
