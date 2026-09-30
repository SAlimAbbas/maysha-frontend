"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { SearchResultSkeleton } from "./skeleton";

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  // Debounced search with realistic skeleton transition
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const filtered = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.concern.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q)
      );
      setResults(filtered);
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-start items-center bg-[#1A1A1A]/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={closeSearch}
    >
      <div
        className="w-full max-w-2xl bg-[#FFFFFF] border-b sm:border border-[#E8E3DA] sm:rounded-b-sm sm:mt-12 shadow-2xl overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search storefront"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-[#E8E3DA] bg-[#FBF9F5]">
          <Search className="w-5 h-5 text-[#8C867D] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cleansers, serums, sunscreens..."
            className="w-full bg-transparent text-base text-[#1A1A1A] placeholder-[#8C867D] focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#8C867D] hover:text-[#1A1A1A] mr-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="p-1.5 text-[#5A5650] hover:text-[#1A1A1A] transition-colors"
            aria-label="Close search"
          >
            <span className="text-xs uppercase tracking-wider font-medium hidden sm:inline mr-1">
              ESC
            </span>
            <X className="w-5 h-5 inline" />
          </button>
        </div>

        {/* Search Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6 divide-y divide-[#F0ECE4]">
          {isLoading ? (
            <div className="space-y-1">
              <SearchResultSkeleton />
              <SearchResultSkeleton />
              <SearchResultSkeleton />
            </div>
          ) : query && results.length > 0 ? (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8C867D] font-medium mb-3">
                {results.length} Products Found
              </p>
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={closeSearch}
                    className="flex items-center gap-4 p-2.5 hover:bg-[#FBF9F5] transition-colors group rounded-xs"
                  >
                    <div className="w-14 h-14 relative bg-[#EFECE4] overflow-hidden shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#4E5942] transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#8C867D] truncate">
                        {product.category} • {product.size}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-medium text-[#1A1A1A]">
                        ₹{product.price}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-xs text-[#8C867D] line-through block">
                          ₹{product.mrp}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-3 text-center border-t border-[#E8E3DA]">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={closeSearch}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4E5942] hover:underline"
                >
                  View all search results <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : query && !isLoading ? (
            <div className="text-center py-10">
              <p className="text-base text-[#1A1A1A] font-medium">
                No products found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#8C867D] mt-1">
                Try searching for &ldquo;Cleanser&rdquo;, &ldquo;Vitamin C&rdquo;, or &ldquo;Ceramides&rdquo;.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8C867D] font-medium mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Cleanser", "Vitamin C", "Ceramides", "Sunscreen SPF 50", "Hydrating Toner"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-xs bg-[#F5F2EB] hover:bg-[#EFECE4] text-[#1A1A1A] px-3 py-1.5 rounded-full transition-colors active:scale-95"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>

              <p className="text-xs uppercase tracking-wider text-[#8C867D] font-medium mb-3">
                Featured Categories
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { name: "Cleansers", href: "/collections/cleansers" },
                  { name: "Serums", href: "/collections/serums" },
                  { name: "Moisturizers", href: "/collections/moisturizers" },
                  { name: "Sunscreen", href: "/collections/sunscreen" },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={closeSearch}
                    className="p-3 bg-[#FBF9F5] border border-[#E8E3DA] text-center hover:border-[#1A1A1A] transition-colors rounded-xs text-xs font-medium text-[#1A1A1A]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
