"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ChevronRight,
  Search,
  User,
  ShoppingBag,
  ArrowRight,
  Heart,
  ShieldAlert,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCartStore } from "@/stores/cartStore";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/providers/LanguageProvider";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function MobileNavDrawer() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isMobileMenuOpen, closeMobileMenu, openSearch } = useUIStore();
  const { openCart } = useCartStore();
  const { cart } = useCart();
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
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

  const totalItems = mounted ? cart.itemCount : 0;
  const accountHref = user ? "/account" : "/auth/login";

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
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="focus:outline-hidden"
            aria-label="Maysha Homepage"
          >
            <Image
              src="/logo.png"
              alt="Maysha"
              width={120}
              height={40}
              className="h-11 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-2">
            {/* <LanguageSwitcher /> */}
            {/* Admin Panel Quick Access Button */}
            {mounted && user?.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white px-3 py-1.5 rounded-full text-[12px] font-bold tracking-wider uppercase transition-all shadow-xs border border-black hover:scale-105"
                title="Go to Admin Panel"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#E6C687]" />
                <span>Admin</span>
              </Link>
            )}

            <button
              onClick={closeMobileMenu}
              className="p-1.5 text-[#5A5650] hover:text-[#1A1A1A] transition-colors rounded-full"
              aria-label="Close navigation"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Links Navigation List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[#F0ECE4]">
          <div className="py-2 space-y-1">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`flex items-center justify-between py-3.5 text-[17px] font-semibold transition-colors ${
                pathname === "/"
                  ? "text-[#4E5942]"
                  : "text-[#1A1A1A] hover:text-[#4E5942]"
              }`}
            >
              <span>{t("home", "Home")}</span>
              <ChevronRight className="w-5 h-5 text-[#8C867D]" />
            </Link>

            <Link
              href="/shop"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-[17px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
            >
              <span>Shop All Products</span>
              <ChevronRight className="w-5 h-5 text-[#8C867D]" />
            </Link>

            <Link
              href="/shop?sort=popularity"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-[17px] font-bold text-[#A94438] hover:text-[#1A1A1A] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>🔥 Best Sellers</span>
              </span>
              <span className="text-[12px] bg-[#FDF2F2] px-2 py-0.5 rounded-full font-bold">
                Trending
              </span>
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
              href="/collections/toners"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3 pl-3 text-[15px] font-medium text-[#4A4640] hover:text-[#1A1A1A] transition-colors"
            >
              <span>Toners & Mists</span>
              <ChevronRight className="w-4 h-4 text-[#8C867D]" />
            </Link>

            <Link
              href="/collections/serums"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3 pl-3 text-[15px] font-medium text-[#4A4640] hover:text-[#1A1A1A] transition-colors"
            >
              <span>Serums & Treatments</span>
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
              href="/collections/sunscreen"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3 pl-3 text-[15px] font-medium text-[#4A4640] hover:text-[#1A1A1A] transition-colors"
            >
              <span>Sun Protection</span>
              <ChevronRight className="w-4 h-4 text-[#8C867D]" />
            </Link>

            <Link
              href="/orders/track"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-[16px] font-medium text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
            >
              <span>Track Order</span>
              <ChevronRight className="w-5 h-5 text-[#8C867D]" />
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
              href="/journal"
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
              href={accountHref}
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-[16px] font-medium text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
            >
              <span className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#8C867D]" />
                {user
                  ? `Account (${user.name.split(" ")[0]})`
                  : "Sign In / Register"}
              </span>
              <ChevronRight className="w-5 h-5 text-[#8C867D]" />
            </Link>

            <Link
              href="/wishlist"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-[16px] font-medium text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
            >
              <span className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#8C867D]" />
                Wishlist ({mounted ? wishlistCount : 0})
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
              Rooted in nature. Crafted with care. Experience formulas that
              nurture your skin barrier.
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
