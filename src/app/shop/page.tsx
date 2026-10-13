"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { Product, Category, Concern, PaginationMeta } from "@/types";
import { apiBffFetch } from "@/lib/api";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "all";
  const activeConcern = searchParams.get("concern") || "all";
  const searchQuery = searchParams.get("search") || "";
  const activeSort = searchParams.get("sort") || "featured";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories and concerns once
  useEffect(() => {
    async function loadTaxonomies() {
      try {
        const [catRes, conRes] = await Promise.all([
          apiBffFetch<Category[]>("categories"),
          apiBffFetch<Concern[]>("concerns"),
        ]);
        setCategories(catRes.data || []);
        setConcerns(conRes.data || []);
      } catch {
        // Handled silently
      }
    }
    loadTaxonomies();
  }, []);

  // Fetch products based on active filters and pagination
  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    async function loadProducts() {
      const sortMap: Record<string, string> = {
        featured: "popularity",
        "price-asc": "price_asc",
        "price-desc": "price_desc",
        rating: "rating",
      };

      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (activeConcern !== "all") params.set("concern", activeConcern);
      if (searchQuery) params.set("q", searchQuery);
      params.set("sort", sortMap[activeSort] || "popularity");
      params.set("per_page", "48");
      params.set("page", page.toString());

      try {
        const res = await apiBffFetch<Product[]>(`products?${params.toString()}`);
        if (isCurrent) {
          if (page === 1) {
            setProducts(res.data || []);
          } else {
            setProducts((prev) => [...prev, ...(res.data || [])]);
          }
          if (res.meta) {
            setMeta(res.meta);
          }
        }
      } catch {
        if (isCurrent) {
          setProducts([]);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isCurrent = false;
    };
  }, [activeCategory, activeConcern, searchQuery, activeSort, page]);

  const updateFilters = (newParams: Record<string, string>) => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(newParams)) {
      if (val === "all" || !val) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    }
    router.push(`/shop?${params.toString()}`);
  };

  const resetFilters = () => {
    setPage(1);
    router.push("/shop");
  };

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-8 lg:py-12 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-[#736E67] mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">Shop</span>
        </nav>

        {/* Catalog Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#E8E3DA]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#1A1A1A]">
              All Formulations
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[#5A5650] mt-1.5 font-normal">
              Thoughtfully engineered skincare rituals backed by clean, clinically proven actives
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[15px] text-[#736E67]">
              Showing <span className="font-bold text-[#1A1A1A]">{meta?.total ?? products.length}</span> products
            </span>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-5 rounded-xs mb-8 space-y-4">
          {/* Category Filter Pills */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[15px] uppercase tracking-wider font-semibold text-[#1A1A1A]">
                Category
              </span>
              {(activeCategory !== "all" || activeConcern !== "all" || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-[14px] text-[#A94438] hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => updateFilters({ category: "all" })}
                className={`text-[15px] px-3.5 py-1.5 rounded-full border transition-all ${
                  activeCategory === "all"
                    ? "bg-[#1A1A1A] text-[#FBF9F5] border-[#1A1A1A] font-semibold"
                    : "bg-[#FBF9F5] text-[#4A4640] border-[#E8E3DA] hover:border-[#1A1A1A]"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilters({ category: cat.slug })}
                  className={`text-[15px] px-3.5 py-1.5 rounded-full border transition-all ${
                    activeCategory === cat.slug
                      ? "bg-[#1A1A1A] text-[#FBF9F5] border-[#1A1A1A] font-semibold"
                      : "bg-[#FBF9F5] text-[#4A4640] border-[#E8E3DA] hover:border-[#1A1A1A]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Concern Filter Pills & Sort Dropdown */}
          <div className="pt-3.5 border-t border-[#F0ECE4] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-[15px] uppercase tracking-wider font-semibold text-[#1A1A1A] block mb-2.5">
                Skin Concern
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => updateFilters({ concern: "all" })}
                  className={`text-[15px] px-3.5 py-1.5 rounded-full border transition-all ${
                    activeConcern === "all"
                      ? "bg-[#4E5942] text-[#FBF9F5] border-[#4E5942] font-semibold"
                      : "bg-[#FBF9F5] text-[#4A4640] border-[#E8E3DA] hover:border-[#4E5942]"
                  }`}
                >
                  All Concerns
                </button>
                {concerns.map((con) => (
                  <button
                    key={con.id}
                    onClick={() => updateFilters({ concern: con.slug })}
                    className={`text-[15px] px-3.5 py-1.5 rounded-full border transition-all ${
                      activeConcern === con.slug
                        ? "bg-[#4E5942] text-[#FBF9F5] border-[#4E5942] font-semibold"
                        : "bg-[#FBF9F5] text-[#4A4640] border-[#E8E3DA] hover:border-[#4E5942]"
                    }`}
                  >
                    {con.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2.5 shrink-0">
              <label htmlFor="sort-select" className="text-[15px] font-semibold text-[#1A1A1A] uppercase tracking-wider">
                Sort By:
              </label>
              <select
                id="sort-select"
                value={activeSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] text-[#1A1A1A] px-3.5 py-2.5 rounded-xs focus:outline-hidden focus:border-[#1A1A1A] font-medium"
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
        {isLoading && page === 1 ? (
          <ProductGridSkeleton count={8} />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {meta && meta.currentPage < meta.lastPage && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={isLoading}
                  className="bg-[#1A1A1A] text-white hover:bg-[#333333] px-8 py-3.5 text-[15px] font-semibold uppercase tracking-wider rounded-2xs transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Load More Formulations"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-12 text-center rounded-xs">
            <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
              No products found
            </h3>
            <p className="text-[15px] text-[#736E67] mb-6 max-w-sm mx-auto">
              No skincare formulations match the active filters. Try adjusting your category or concern selection.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#1A1A1A] text-white text-[15px] uppercase tracking-wider font-semibold px-7 py-3.5 rounded-2xs hover:bg-[#333333] transition-colors"
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
