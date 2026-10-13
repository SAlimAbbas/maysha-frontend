"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { Product } from "@/types";
import { SearchResultSkeleton } from "./skeleton";
import { apiBffFetch, formatINR } from "@/lib/api";

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const timer = setTimeout(async () => {
      try {
        const res = await apiBffFetch<Product[]>(
          `products?q=${encodeURIComponent(trimmed)}&per_page=6`,
          { signal: abortController.signal }
        );
        setResults(res.data || []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
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
        <div className="flex items-center px-4 sm:px-6 py-4.5 border-b border-[#E8E3DA] bg-[#FBF9F5]">
          <Search className="w-5 h-5 text-[#736E67] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cleansers, serums, toners..."
            className="w-full bg-transparent text-[16px] text-[#1A1A1A] placeholder-[#736E67] focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#736E67] hover:text-[#1A1A1A] mr-2"
              aria-label="Clear query"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="p-2 text-[#4A4640] hover:text-[#1A1A1A] transition-colors"
            aria-label="Close search"
          >
            <span className="text-[13px] uppercase tracking-wider font-semibold hidden sm:inline mr-1.5">
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
          ) : query.trim().length >= 2 && results.length > 0 ? (
            <div>
              <p className="text-[14px] uppercase tracking-wider text-[#736E67] font-semibold mb-3.5">
                {results.length} Products Found
              </p>
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={closeSearch}
                    className="flex items-center gap-4 p-3 hover:bg-[#FBF9F5] transition-colors group rounded-xs"
                  >
                    <div className="w-16 h-16 relative bg-[#EFECE4] overflow-hidden shrink-0">
                      <Image
                        src={product.images[0] || "/logo.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[18px] font-semibold text-[#1A1A1A] group-hover:text-[#4E5942] transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-[15px] text-[#736E67] truncate mt-0.5">
                        {product.category} • {product.size}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[17px] font-bold text-[#1A1A1A]">
                        {formatINR(product.price)}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-[14px] text-[#736E67] line-through block font-normal">
                          {formatINR(product.mrp)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-5 pt-3.5 text-center border-t border-[#E8E3DA]">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={closeSearch}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#4E5942] hover:underline"
                >
                  View all search results <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : query.trim().length >= 2 && !isLoading ? (
            <div className="text-center py-10">
              <p className="text-[17px] text-[#1A1A1A] font-semibold">
                No products found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-[15px] text-[#736E67] mt-1.5 font-normal">
                Try searching for &ldquo;Cleanser&rdquo;, &ldquo;Vitamin C&rdquo;, or &ldquo;Rose Water&rdquo;.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[14px] uppercase tracking-wider text-[#736E67] font-semibold mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Face Wash", "Rose Water", "Face Serum", "Hair Oil", "Sunscreen"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-[15px] bg-[#F5F2EB] hover:bg-[#EFECE4] text-[#1A1A1A] px-3.5 py-2 rounded-full transition-colors active:scale-95 font-medium"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>

              <p className="text-[14px] uppercase tracking-wider text-[#736E67] font-semibold mb-3">
                Featured Categories
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { name: "Cleansers", href: "/collections/cleansers" },
                  { name: "Toners", href: "/collections/toners" },
                  { name: "Serums", href: "/collections/serums" },
                  { name: "Sunscreen", href: "/collections/sunscreen" },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={closeSearch}
                    className="p-3.5 bg-[#FBF9F5] border border-[#E8E3DA] text-center hover:border-[#1A1A1A] transition-colors rounded-xs text-[15px] font-semibold text-[#1A1A1A]"
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
