"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES, CONCERNS } from "@/data/categories";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/skeleton";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialConcern = searchParams.get("concern") || "all";
  const searchQuery = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedConcern, setSelectedConcern] = useState(initialConcern);
  const [sortBy, setSortBy] = useState("featured");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = (slug: string) => {
    setIsLoading(true);
    setSelectedCategory(slug);
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleConcernChange = (slug: string) => {
    setIsLoading(true);
    setSelectedConcern(slug);
    setTimeout(() => setIsLoading(false), 200);
  };

  const resetFilters = () => {
    setIsLoading(true);
    setSelectedCategory("all");
    setSelectedConcern("all");
    setSortBy("featured");
    setTimeout(() => setIsLoading(false), 200);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
        return false;
      }
      if (selectedConcern !== "all" && p.concernSlug !== selectedConcern) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured
    });
  }, [selectedCategory, selectedConcern, sortBy, searchQuery]);

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-8 lg:py-12 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8C867D] mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium">Shop</span>
        </nav>

        {/* Catalog Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#E8E3DA]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1A1A]">
              All Formulations
            </h1>
            <p className="text-xs sm:text-sm text-[#736E67] mt-1">
              Thoughtfully engineered skincare rituals backed by clean, clinically proven actives
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8C867D]">
              Showing <span className="font-semibold text-[#1A1A1A]">{filteredProducts.length}</span> of {PRODUCTS.length} products
            </span>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-4 rounded-xs mb-8 space-y-4">
          {/* Category Filter Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]">
                Category
              </span>
              {(selectedCategory !== "all" || selectedConcern !== "all") && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#A94438] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#1A1A1A] text-[#FBF9F5] border-[#1A1A1A] font-medium"
                    : "bg-[#FBF9F5] text-[#5A5650] border-[#E8E3DA] hover:border-[#1A1A1A]"
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    selectedCategory === cat.slug
                      ? "bg-[#1A1A1A] text-[#FBF9F5] border-[#1A1A1A] font-medium"
                      : "bg-[#FBF9F5] text-[#5A5650] border-[#E8E3DA] hover:border-[#1A1A1A]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Concern Filter Pills & Sort Dropdown */}
          <div className="pt-3 border-t border-[#F0ECE4] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] block mb-2">
                Skin Concern
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleConcernChange("all")}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    selectedConcern === "all"
                      ? "bg-[#4E5942] text-[#FBF9F5] border-[#4E5942] font-medium"
                      : "bg-[#FBF9F5] text-[#5A5650] border-[#E8E3DA] hover:border-[#4E5942]"
                  }`}
                >
                  All Concerns
                </button>
                {CONCERNS.map((con) => (
                  <button
                    key={con.id}
                    onClick={() => handleConcernChange(con.slug)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      selectedConcern === con.slug
                        ? "bg-[#4E5942] text-[#FBF9F5] border-[#4E5942] font-medium"
                        : "bg-[#FBF9F5] text-[#5A5650] border-[#E8E3DA] hover:border-[#4E5942]"
                    }`}
                  >
                    {con.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="sort-select" className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                Sort By:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FBF9F5] border border-[#E8E3DA] text-xs text-[#1A1A1A] px-3 py-2 rounded-xs focus:outline-hidden focus:border-[#1A1A1A]"
              >
                <option value="featured">Featured / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid or Skeleton */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-12 text-center rounded-xs">
            <h3 className="font-serif text-xl font-normal text-[#1A1A1A] mb-2">
              No products found
            </h3>
            <p className="text-xs text-[#8C867D] mb-6 max-w-sm mx-auto">
              No skincare formulations match the active filters. Try adjusting your category or concern selection.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-2xs hover:bg-[#333333] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1360px] mx-auto px-4 py-12">
          <ProductGridSkeleton count={8} />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
