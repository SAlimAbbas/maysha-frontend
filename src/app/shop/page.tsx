"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Star,
  Check,
  Search,
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { Product, PaginationMeta } from "@/types";
import { apiBffFetch } from "@/lib/api";

interface FacetItem {
  id?: string;
  name: string;
  slug?: string;
  count: number;
}

interface FacetsData {
  categories: FacetItem[];
  benefits: FacetItem[];
  skinTypes: FacetItem[];
  priceRange: { min: number; max: number };
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const activeCategory = searchParams.get("category") || "all";
  const activeBenefit = searchParams.get("benefit") || "all";
  const activeSkinType = searchParams.get("skin_type") || "all";
  const activeRating = searchParams.get("rating") || "all";
  const activeMinPrice = searchParams.get("min_price") || "";
  const activeMaxPrice = searchParams.get("max_price") || "";
  const searchQuery = searchParams.get("search") || searchParams.get("q") || "";
  const activeSort = searchParams.get("sort") || "popularity";

  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [facets, setFacets] = useState<FacetsData>({
    categories: [],
    benefits: [],
    skinTypes: [],
    priceRange: { min: 299, max: 1299 },
  });
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Mobile drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Accordion toggle states in sidebar
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    benefits: true,
    skinTypes: true,
    rating: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Check if any filter is active
  const hasActiveFilters =
    activeCategory !== "all" ||
    activeBenefit !== "all" ||
    activeSkinType !== "all" ||
    activeRating !== "all" ||
    Boolean(activeMinPrice) ||
    Boolean(activeMaxPrice) ||
    Boolean(searchQuery);

  // Fetch products & dynamic facets
  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    async function loadProducts() {
      const sortMap: Record<string, string> = {
        relevance: "popularity",
        popularity: "popularity",
        "price-asc": "price_asc",
        "price-desc": "price_desc",
        rating: "rating",
        newest: "newest",
      };

      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (activeBenefit !== "all") params.set("benefit", activeBenefit);
      if (activeSkinType !== "all") params.set("skin_type", activeSkinType);
      if (activeRating !== "all") params.set("rating", activeRating);
      if (activeMinPrice) params.set("min_price", activeMinPrice);
      if (activeMaxPrice) params.set("max_price", activeMaxPrice);
      if (searchQuery) params.set("q", searchQuery);

      params.set("sort", sortMap[activeSort] || "popularity");
      params.set("per_page", "24");
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
            if (res.meta.facets) {
              setFacets(res.meta.facets);
            }
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
  }, [
    activeCategory,
    activeBenefit,
    activeSkinType,
    activeRating,
    activeMinPrice,
    activeMaxPrice,
    searchQuery,
    activeSort,
    page,
  ]);

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

  const removeFilter = (key: string) => {
    updateFilters({ [key]: "all" });
  };

  const clearAllFilters = () => {
    setPage(1);
    router.push("/shop");
  };

  // Active Category Name for Breadcrumb
  const currentCategoryObj = facets.categories.find(
    (c) => c.slug === activeCategory || c.id === activeCategory
  );
  const categoryDisplayName = currentCategoryObj
    ? currentCategoryObj.name
    : activeCategory !== "all"
    ? activeCategory
    : "All Formulations";

  // Sidebar Filter Content component (reused for desktop and mobile drawer)
  const FilterSidebarContent = () => (
    <div className="space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E3DA]">
        <h2 className="text-[17px] font-bold text-[#1A1A1A] uppercase tracking-wider">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[13px] font-bold text-[#4E5942] hover:text-[#1A1A1A] uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* 1. CATEGORIES (DYNAMIC) */}
      <div className="border-b border-[#F0ECE4] pb-5">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between text-left text-[14px] font-bold uppercase tracking-wider text-[#1A1A1A] py-1 cursor-pointer"
        >
          <span>Categories</span>
          {openSections.categories ? (
            <ChevronUp className="w-4 h-4 text-[#736E67]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#736E67]" />
          )}
        </button>

        {openSections.categories && (
          <div className="mt-3 space-y-2">
            <button
              onClick={() => updateFilters({ category: "all" })}
              className={`w-full flex items-center justify-between text-[14px] py-1 px-2 rounded-2xs text-left transition-colors cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#1A1A1A] text-white font-semibold"
                  : "text-[#4A4640] hover:bg-[#F5F2EB]"
              }`}
            >
              <span>All Categories</span>
              <span className={`text-[12px] ${activeCategory === "all" ? "text-white/80" : "text-[#736E67]"}`}>
                {facets.categories.reduce((acc, c) => acc + c.count, 0)}
              </span>
            </button>

            {facets.categories.map((cat) => {
              const isSelected =
                activeCategory === cat.slug || activeCategory === cat.id;
              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() =>
                    updateFilters({
                      category: isSelected ? "all" : cat.slug || cat.id || "",
                    })
                  }
                  className={`w-full flex items-center justify-between text-[14px] py-1.5 px-2 rounded-2xs text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#4E5942] text-white font-semibold"
                      : "text-[#4A4640] hover:bg-[#F5F2EB]"
                  }`}
                >
                  <span className="truncate pr-2">{cat.name}</span>
                  <span
                    className={`text-[12px] font-medium shrink-0 ${
                      isSelected ? "text-white/90" : "text-[#736E67]"
                    }`}
                  >
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. PRICE RANGE */}
      <div className="border-b border-[#F0ECE4] pb-5">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-left text-[14px] font-bold uppercase tracking-wider text-[#1A1A1A] py-1 cursor-pointer"
        >
          <span>Price (₹)</span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-[#736E67]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#736E67]" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-3">
            {/* Quick Price Pills */}
            <div className="flex flex-col gap-1.5">
              {[
                { label: "All Prices", min: "", max: "" },
                { label: "Under ₹499", min: "", max: "499" },
                { label: "₹499 – ₹699", min: "499", max: "699" },
                { label: "₹700 & Above", min: "700", max: "" },
              ].map((tier, idx) => {
                const isSelected =
                  activeMinPrice === tier.min && activeMaxPrice === tier.max;
                return (
                  <button
                    key={idx}
                    onClick={() =>
                      updateFilters({ min_price: tier.min, max_price: tier.max })
                    }
                    className={`w-full text-left text-[13px] py-1 px-2 rounded-2xs transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-[#EDF3E8] text-[#3E4534] font-bold border border-[#C5D7BD]"
                        : "text-[#4A4640] hover:bg-[#F5F2EB]"
                    }`}
                  >
                    <span>{tier.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#4E5942]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Min / Max Inputs */}
            <div className="pt-2 border-t border-[#F0ECE4] flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={activeMinPrice}
                onBlur={(e) => updateFilters({ min_price: e.target.value })}
                className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[13px] py-1.5 px-2 rounded-2xs text-[#1A1A1A] focus:outline-hidden focus:border-[#1A1A1A]"
              />
              <span className="text-[#736E67] text-[13px]">to</span>
              <input
                type="number"
                placeholder="Max"
                defaultValue={activeMaxPrice}
                onBlur={(e) => updateFilters({ max_price: e.target.value })}
                className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[13px] py-1.5 px-2 rounded-2xs text-[#1A1A1A] focus:outline-hidden focus:border-[#1A1A1A]"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. KEY BENEFITS & CONCERNS (DYNAMIC FACETS) */}
      {facets.benefits && facets.benefits.length > 0 && (
        <div className="border-b border-[#F0ECE4] pb-5">
          <button
            onClick={() => toggleSection("benefits")}
            className="w-full flex items-center justify-between text-left text-[14px] font-bold uppercase tracking-wider text-[#1A1A1A] py-1 cursor-pointer"
          >
            <span>Key Benefits</span>
            {openSections.benefits ? (
              <ChevronUp className="w-4 h-4 text-[#736E67]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#736E67]" />
            )}
          </button>

          {openSections.benefits && (
            <div className="mt-3 space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {facets.benefits.map((b) => {
                const isSelected = activeBenefit === b.name;
                return (
                  <label
                    key={b.name}
                    className="flex items-center justify-between text-[13px] text-[#4A4640] hover:text-[#1A1A1A] py-1 px-1 rounded-2xs cursor-pointer group hover:bg-[#F5F2EB]"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          updateFilters({ benefit: isSelected ? "all" : b.name })
                        }
                        className="rounded-2xs text-[#4E5942] accent-[#4E5942] cursor-pointer"
                      />
                      <span className="group-hover:font-medium">{b.name}</span>
                    </div>
                    <span className="text-[12px] text-[#736E67]">({b.count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. TARGET SKIN TYPES / USAGE (DYNAMIC FACETS) */}
      {facets.skinTypes && facets.skinTypes.length > 0 && (
        <div className="border-b border-[#F0ECE4] pb-5">
          <button
            onClick={() => toggleSection("skinTypes")}
            className="w-full flex items-center justify-between text-left text-[14px] font-bold uppercase tracking-wider text-[#1A1A1A] py-1 cursor-pointer"
          >
            <span>Target Skin / Usage</span>
            {openSections.skinTypes ? (
              <ChevronUp className="w-4 h-4 text-[#736E67]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#736E67]" />
            )}
          </button>

          {openSections.skinTypes && (
            <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {facets.skinTypes.map((st) => {
                const isSelected = activeSkinType === st.name;
                return (
                  <label
                    key={st.name}
                    className="flex items-center justify-between text-[13px] text-[#4A4640] hover:text-[#1A1A1A] py-1 px-1 rounded-2xs cursor-pointer group hover:bg-[#F5F2EB]"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          updateFilters({ skin_type: isSelected ? "all" : st.name })
                        }
                        className="rounded-2xs text-[#4E5942] accent-[#4E5942] cursor-pointer"
                      />
                      <span className="group-hover:font-medium">{st.name}</span>
                    </div>
                    <span className="text-[12px] text-[#736E67]">({st.count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. CUSTOMER RATINGS */}
      <div className="pb-2">
        <button
          onClick={() => toggleSection("rating")}
          className="w-full flex items-center justify-between text-left text-[14px] font-bold uppercase tracking-wider text-[#1A1A1A] py-1 cursor-pointer"
        >
          <span>Customer Ratings</span>
          {openSections.rating ? (
            <ChevronUp className="w-4 h-4 text-[#736E67]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#736E67]" />
          )}
        </button>

        {openSections.rating && (
          <div className="mt-3 space-y-2">
            {[
              { val: "4.5", label: "4.5★ & Above" },
              { val: "4.0", label: "4.0★ & Above" },
              { val: "3.5", label: "3.5★ & Above" },
            ].map((r) => {
              const isSelected = activeRating === r.val;
              return (
                <label
                  key={r.val}
                  className="flex items-center gap-2 text-[13px] text-[#4A4640] hover:text-[#1A1A1A] py-1 px-1 rounded-2xs cursor-pointer group hover:bg-[#F5F2EB]"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      updateFilters({ rating: isSelected ? "all" : r.val })
                    }
                    className="rounded-2xs text-[#4E5942] accent-[#4E5942] cursor-pointer"
                  />
                  <span className="flex items-center gap-1 font-medium">
                    <span className="text-[#E37400]">★</span> {r.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-6 lg:py-10 border-b border-[#E8E3DA]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb matching Screenshot 3 */}
        <nav
          className="flex items-center gap-2 text-[13px] text-[#736E67] mb-4"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-[#1A1A1A] transition-colors">
            Shop
          </Link>
          {activeCategory !== "all" && (
            <>
              <span>›</span>
              <span className="text-[#1A1A1A] font-semibold">
                {categoryDisplayName}
              </span>
            </>
          )}
        </nav>

        {/* Catalog Main Two-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* ============================================================ */}
          {/* LEFT SIDEBAR: FILTERS (DESKTOP) */}
          {/* ============================================================ */}
          <aside className="hidden lg:block w-72 shrink-0 bg-[#FFFFFF] border border-[#E8E3DA] p-5 rounded-xs shadow-2xs sticky top-24">
            <FilterSidebarContent />
          </aside>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: SEARCH HEADER, SORT TABS & PRODUCTS GRID */}
          {/* ============================================================ */}
          <main className="flex-1 w-full min-w-0">
            {/* Top Bar: Results Count & Mobile Filter Toggle */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-4 sm:p-5 rounded-xs mb-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                    {searchQuery
                      ? `Search results for "${searchQuery}"`
                      : activeCategory !== "all"
                      ? `${categoryDisplayName}`
                      : "All Formulations"}
                  </h1>
                  <p className="text-[13px] text-[#736E67] mt-0.5">
                    Showing{" "}
                    <span className="font-bold text-[#1A1A1A]">
                      1 – {products.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-[#1A1A1A]">
                      {meta?.total ?? products.length}
                    </span>{" "}
                    results
                  </p>
                </div>

                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-4 py-2.5 rounded-2xs text-[14px] font-semibold cursor-pointer self-start sm:self-auto"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters {hasActiveFilters ? "(Active)" : ""}</span>
                </button>
              </div>

              {/* Sort By Tabs (Matching Screenshot 3 design) */}
              <div className="pt-3 border-t border-[#F0ECE4] flex items-center gap-2 sm:gap-6 overflow-x-auto text-[14px]">
                <span className="font-bold text-[#1A1A1A] shrink-0 text-[13px] uppercase tracking-wider">
                  Sort By
                </span>
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  {[
                    { id: "popularity", label: "Popularity" },
                    { id: "relevance", label: "Relevance" },
                    { id: "price-asc", label: "Price -- Low to High" },
                    { id: "price-desc", label: "Price -- High to Low" },
                    { id: "rating", label: "Customer Rating" },
                    { id: "newest", label: "Newest First" },
                  ].map((s) => {
                    const isSelected = activeSort === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => updateFilters({ sort: s.id })}
                        className={`py-1 text-[13px] sm:text-[14px] font-semibold transition-all relative cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "text-[#4E5942] font-bold after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[2px] after:bg-[#4E5942]"
                            : "text-[#5A5650] hover:text-[#1A1A1A]"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Filters Dismissible Pills Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-[13px] font-semibold text-[#736E67]">
                  Active Filters:
                </span>
                {activeCategory !== "all" && (
                  <button
                    onClick={() => removeFilter("category")}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD7CD] text-[13px] text-[#1A1A1A] font-medium hover:border-[#1A1A1A] transition-colors"
                  >
                    <span>Category: {categoryDisplayName}</span>
                    <X className="w-3.5 h-3.5 text-[#736E67]" />
                  </button>
                )}
                {activeBenefit !== "all" && (
                  <button
                    onClick={() => removeFilter("benefit")}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD7CD] text-[13px] text-[#1A1A1A] font-medium hover:border-[#1A1A1A] transition-colors"
                  >
                    <span>Benefit: {activeBenefit}</span>
                    <X className="w-3.5 h-3.5 text-[#736E67]" />
                  </button>
                )}
                {activeSkinType !== "all" && (
                  <button
                    onClick={() => removeFilter("skin_type")}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD7CD] text-[13px] text-[#1A1A1A] font-medium hover:border-[#1A1A1A] transition-colors"
                  >
                    <span>Type: {activeSkinType}</span>
                    <X className="w-3.5 h-3.5 text-[#736E67]" />
                  </button>
                )}
                {(activeMinPrice || activeMaxPrice) && (
                  <button
                    onClick={() => updateFilters({ min_price: "", max_price: "" })}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD7CD] text-[13px] text-[#1A1A1A] font-medium hover:border-[#1A1A1A] transition-colors"
                  >
                    <span>
                      Price: ₹{activeMinPrice || "0"} - ₹{activeMaxPrice || "Max"}
                    </span>
                    <X className="w-3.5 h-3.5 text-[#736E67]" />
                  </button>
                )}
                {activeRating !== "all" && (
                  <button
                    onClick={() => removeFilter("rating")}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD7CD] text-[13px] text-[#1A1A1A] font-medium hover:border-[#1A1A1A] transition-colors"
                  >
                    <span>Rating: {activeRating}★+</span>
                    <X className="w-3.5 h-3.5 text-[#736E67]" />
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => updateFilters({ search: "", q: "" })}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD7CD] text-[13px] text-[#1A1A1A] font-medium hover:border-[#1A1A1A] transition-colors"
                  >
                    <span>Query: &ldquo;{searchQuery}&rdquo;</span>
                    <X className="w-3.5 h-3.5 text-[#736E67]" />
                  </button>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-[13px] font-bold text-[#A94438] hover:underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid */}
            {isLoading && page === 1 ? (
              <ProductGridSkeleton count={9} />
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Load More */}
                {meta && meta.currentPage < meta.lastPage && (
                  <div className="mt-12 text-center">
                    <button
                      type="button"
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={isLoading}
                      className="bg-[#1A1A1A] text-white hover:bg-[#333333] px-8 py-3.5 text-[14px] font-bold uppercase tracking-wider rounded-2xs transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      {isLoading ? "Loading..." : "Load More Formulations"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-12 text-center rounded-xs shadow-2xs">
                <Search className="w-12 h-12 text-[#A6A095] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">
                  No matching formulations found
                </h3>
                <p className="text-[14px] text-[#736E67] mb-6 max-w-md mx-auto">
                  Try unchecking some filters or selecting another category to view active botanical rituals.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#1A1A1A] text-white text-[14px] uppercase tracking-wider font-semibold px-6 py-3 rounded-2xs hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE FILTER DRAWER */}
      {/* ============================================================ */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-2xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-[#FFFFFF] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E3DA] mb-4">
                <span className="text-[16px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Filters & Facets
                </span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-[#736E67] hover:text-[#1A1A1A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebarContent />
            </div>

            <div className="pt-4 border-t border-[#E8E3DA] mt-6">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#1A1A1A] text-white py-3 rounded-2xs text-[14px] font-bold uppercase tracking-wider"
              >
                Apply Filters ({products.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1400px] mx-auto px-4 py-12">
          <ProductGridSkeleton count={8} />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
