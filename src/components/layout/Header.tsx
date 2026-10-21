"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  User as UserIcon,
  Heart,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useLanguage } from "@/providers/LanguageProvider";
import { Category, Product } from "@/types";
import { apiBffFetch, formatINR } from "@/lib/api";

const FALLBACK_CATEGORIES: Partial<Category>[] = [
  {
    id: "cleansers",
    slug: "cleansers",
    name: "Cleansers",
    subtitle: "Gentle non-stripping facial washes",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "toners",
    slug: "toners",
    name: "Toners & Mists",
    subtitle: "Hydrating essences to rebalance pH",
    image:
      "https://images.unsplash.com/photo-1608248597359-548d44747754?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "serums",
    slug: "serums",
    name: "Serums",
    subtitle: "Clinical treatments & actives",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "moisturizers",
    slug: "moisturizers",
    name: "Moisturizers",
    subtitle: "Barrier repair barrier creams",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "sunscreen",
    slug: "sunscreen",
    name: "Sunscreen",
    subtitle: "Broad-spectrum mineral SPF",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "treatments",
    slug: "treatments",
    name: "Treatments & Oils",
    subtitle: "Targeted botanical oils & peels",
    image:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { openCart } = useCartStore();
  const { openSearch, openMobileMenu } = useUIStore();
  const { cart } = useCart();
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Hover Mega-Menu State
  const [activeDropdown, setActiveDropdown] = useState<
    "shop" | "bestsellers" | null
  >(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch categories and bestsellers for header dropdowns
    async function loadNavData() {
      try {
        const [catsRes, bestRes] = await Promise.all([
          apiBffFetch<Category[]>("categories").catch(() => null),
          apiBffFetch<Product[]>("products/bestsellers").catch(() => null),
        ]);

        if (catsRes?.data && Array.isArray(catsRes.data)) {
          setCategories(catsRes.data);
        }
        if (bestRes?.data && Array.isArray(bestRes.data)) {
          const onlyBest = bestRes.data.filter((p) => {
            const b = (p.badge || "").toLowerCase();
            return (
              b.includes("bestseller") ||
              b.includes("best seller") ||
              Boolean(p.isFeatured)
            );
          });
          setBestsellers(onlyBest);
        }
      } catch {
        // Fallbacks silently handle
      }
    }
    loadNavData();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (menu: "shop" | "bestsellers") => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const totalItems = mounted ? cart.itemCount : 0;
  const accountHref = user ? "/account" : "/auth/login";

  const displayCategories =
    categories.length > 0 ? categories : (FALLBACK_CATEGORIES as Category[]);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FBF9F5]/95 backdrop-blur-md shadow-xs border-b border-[#E8E3DA]/80 py-3"
          : "bg-[#FBF9F5] border-b border-[#E8E3DA] py-3.5 sm:py-4"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3 lg:gap-8">
            <button
              onClick={openMobileMenu}
              className="lg:hidden p-1.5 -ml-1.5 text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Branded Logo */}
            <Link
              href="/"
              className="group flex items-center focus:outline-hidden py-0.5"
              aria-label="Maysha Homepage"
            >
              <Image
                src="/logo.png"
                alt="Maysha"
                width={132}
                height={44}
                priority
                className="h-13 sm:h-13 md:h-13 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              />
            </Link>

            {/* Desktop Navigation Links (Minimalist style) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-4">
              {/* 0. HOME */}
              <div className="relative py-2">
                <Link
                  href="/"
                  className={`text-[15px] xl:text-[16px] tracking-wide transition-colors flex items-center cursor-pointer ${
                    pathname === "/"
                      ? "text-[#1A1A1A] font-semibold"
                      : "text-[#4A4640] hover:text-[#1A1A1A]"
                  }`}
                >
                  <span>{t("home", "Home")}</span>
                </Link>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#4E5942] transition-transform duration-200 origin-left ${
                    pathname === "/" ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </div>

              {/* 1. SHOP (Hover to show Categories) */}
              <div
                className="relative py-2"
                onMouseEnter={() => handleMouseEnter("shop")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/shop"
                  className={`text-[15px] xl:text-[16px] tracking-wide transition-colors flex items-center gap-1 group cursor-pointer ${
                    pathname === "/shop" || activeDropdown === "shop"
                      ? "text-[#1A1A1A] font-semibold"
                      : "text-[#4A4640] hover:text-[#1A1A1A]"
                  }`}
                >
                  <span>{t("shop", "Shop")}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "shop"
                        ? "rotate-180 text-[#4E5942]"
                        : "text-[#736E67]"
                    }`}
                  />
                </Link>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#4E5942] transition-transform duration-200 origin-left ${
                    pathname === "/shop" || activeDropdown === "shop"
                      ? "scale-x-100"
                      : "scale-x-0"
                  }`}
                />
              </div>

              {/* 2. BEST SELLERS (Hover to show Bestseller Products) */}
              <div
                className="relative py-2"
                onMouseEnter={() => handleMouseEnter("bestsellers")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/shop?sort=popularity"
                  className={`text-[15px] xl:text-[16px] tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeDropdown === "bestsellers"
                      ? "text-[#1A1A1A] font-bold"
                      : "text-[#1A1A1A] font-medium hover:text-[#4E5942]"
                  }`}
                >
                  {/* <Flame className="w-4 h-4 text-[#A94438]" /> */}
                  <span>Best Sellers</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "bestsellers"
                        ? "rotate-180 text-[#4E5942]"
                        : "text-[#736E67]"
                    }`}
                  />
                </Link>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#A94438] transition-transform duration-200 origin-left ${
                    activeDropdown === "bestsellers"
                      ? "scale-x-100"
                      : "scale-x-0"
                  }`}
                />
              </div>

              {/* 4. Track Order */}
              <Link
                href="/orders/track"
                className="text-[15px] xl:text-[16px] text-[#4A4640] hover:text-[#1A1A1A] transition-colors py-2 whitespace-nowrap"
              >
                Track Order
              </Link>

              {/* 5. About */}
              <Link
                href="/about"
                className="text-[15px] xl:text-[16px] text-[#4A4640] hover:text-[#1A1A1A] transition-colors py-2 whitespace-nowrap"
              >
                {t("about", "About")}
              </Link>

              {/* 6. Journal */}
              <Link
                href="/journal"
                className="text-[15px] xl:text-[16px] text-[#4A4640] hover:text-[#1A1A1A] transition-colors py-2 whitespace-nowrap"
              >
                {t("journal", "Journal")}
              </Link>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Admin Panel Quick Access Button */}
            {mounted && user?.role === "admin" && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white px-3 py-1.5 rounded-full text-[12px] font-bold tracking-wider uppercase transition-all shadow-xs border border-black hover:scale-105"
                title="Go to Admin Panel"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#E6C687]" />
                <span>Admin</span>
              </Link>
            )}

            {/* Search Trigger */}
            <button
              onClick={openSearch}
              className="p-2 text-[#1A1A1A] hover:text-[#4E5942] hover:bg-[#F5F2EB] rounded-full transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              aria-label="Open search dialog"
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline text-[15px] font-medium text-[#4A4640]">
                Search
              </span>
            </button>

            {/* Account Link */}
            <Link
              href={accountHref}
              className="p-2 text-[#1A1A1A] hover:text-[#4E5942] hover:bg-[#F5F2EB] rounded-full transition-all active:scale-95 cursor-pointer"
              aria-label={
                user ? `Account (${user.name})` : "Sign In to Account"
              }
              title={user ? `Account (${user.name})` : "Sign In"}
            >
              <UserIcon className="w-5 h-5" />
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-2 text-[#1A1A1A] hover:text-[#4E5942] hover:bg-[#F5F2EB] rounded-full transition-all active:scale-95 relative flex items-center cursor-pointer"
              aria-label={`Wishlist (${mounted ? wishlistCount : 0} items)`}
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A94438] text-white text-[11px] font-bold min-w-4 h-4 rounded-full flex items-center justify-center px-1 shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger with Badge */}
            <button
              onClick={openCart}
              className="p-2 text-[#1A1A1A] hover:text-[#4E5942] hover:bg-[#F5F2EB] rounded-full transition-all active:scale-95 relative flex items-center cursor-pointer"
              aria-label={`Open shopping cart (${totalItems} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4E5942] text-[#FBF9F5] text-[13px] font-bold min-w-5 h-5 rounded-full flex items-center justify-center px-1 shadow-xs animate-in zoom-in-50 duration-200">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MEGA-MENU 1: CATEGORIES (Hover over Shop) */}
      {/* ============================================================== */}
      {activeDropdown === "shop" && (
        <div
          className="hidden lg:block absolute top-full left-0 right-0 bg-[#FFFFFF] border-b border-[#E8E3DA] shadow-xl animate-fadeIn z-40"
          onMouseEnter={() => handleMouseEnter("shop")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F0ECE4]">
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                  Botanical Categories
                </h3>
                <p className="text-[13px] text-[#736E67] mt-0.5">
                  Browse by category collection tailored to your daily
                  biological ritual.
                </p>
              </div>
              <Link
                href="/shop"
                onClick={() => setActiveDropdown(null)}
                className="text-[14px] font-bold text-[#4E5942] hover:text-[#1A1A1A] flex items-center gap-1.5 uppercase tracking-wider hover:underline"
              >
                <span>View All Formulations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  href={`/shop?category=${cat.slug}`}
                  onClick={() => setActiveDropdown(null)}
                  className="group/card bg-[#FBF9F5] border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-xs transition-all flex flex-col justify-between hover:shadow-sm"
                >
                  <div className="aspect-square relative rounded-2xs overflow-hidden bg-[#EFECE4] mb-3">
                    <Image
                      src={cat.image || "/logo.png"}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                      sizes="180px"
                    />
                  </div>
                  <div className="p-2">
                    <h4 className="text-[15px] font-bold text-[#1A1A1A] group-hover/card:text-[#4E5942] transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[13px] text-[#736E67] line-clamp-2 mt-0.5">
                      {cat.subtitle || "Shop Collection"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MEGA-MENU 2: BEST SELLERS (Matching Screenshot 2) */}
      {/* ============================================================== */}
      {activeDropdown === "bestsellers" && (
        <div
          className="hidden lg:block absolute top-full left-0 right-0 bg-[#FFFFFF] border-b border-[#E8E3DA] shadow-xl animate-fadeIn z-40"
          onMouseEnter={() => handleMouseEnter("bestsellers")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F0ECE4]">
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                  Bestselling Formulations
                </h3>
                <p className="text-[13px] text-[#736E67] mt-0.5">
                  Our highest-rated, clinically backed treatments loved by
                  thousands.
                </p>
              </div>
              <Link
                href="/shop?sort=popularity"
                onClick={() => setActiveDropdown(null)}
                className="text-[14px] font-bold text-[#4E5942] hover:text-[#1A1A1A] flex items-center gap-1.5 uppercase tracking-wider hover:underline"
              >
                <span>View All Bestsellers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Gallery of Products matching Screenshot 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {bestsellers.slice(0, 6).map((prod) => {
                const img =
                  prod.images?.[0] || (prod as any).image || "/logo.png";
                return (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    onClick={() => setActiveDropdown(null)}
                    className="group/prod flex flex-col justify-between bg-[#FFFFFF] border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-xs transition-all hover:shadow-sm"
                  >
                    <div>
                      <div className="aspect-square relative rounded-2xs overflow-hidden bg-[#FBF9F5] mb-2.5">
                        <Image
                          src={img}
                          alt={prod.name}
                          fill
                          className="object-cover group-hover/prod:scale-105 transition-transform duration-300"
                          sizes="180px"
                        />
                      </div>
                      <h4 className="text-[14px] font-semibold text-[#1A1A1A] group-hover/prod:text-[#4E5942] transition-colors line-clamp-2 leading-snug px-2">
                        {prod.name}
                      </h4>
                    </div>

                    <div className="mt-3 p-2 border-t border-[#F0ECE4]">
                      <div className="text-[12px] text-[#736E67]">
                        On Sale from
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[15px] font-bold text-[#1A1A1A]">
                          ₹{prod.price}
                        </span>
                        {prod.mrp > prod.price && (
                          <span className="text-[12px] text-[#8C867D] line-through">
                            ₹{prod.mrp}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Bar matching "Show More" Button in Screenshot 2 */}
            <div className="mt-6 pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
              <span className="text-[13px] text-[#736E67]">
                Free standard shipping on all orders above ₹999 across India.
              </span>
              <Link
                href="/shop?sort=popularity"
                onClick={() => setActiveDropdown(null)}
                className="bg-[#1A1A1A] hover:bg-[#333333] text-white text-[13px] uppercase tracking-wider font-bold px-6 py-2.5 rounded-2xs transition-colors"
              >
                Show More Bestsellers
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
