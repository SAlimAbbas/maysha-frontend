"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, ArrowRight, BookOpen, Calendar, User } from "lucide-react";
import { Article } from "@/types";

interface JournalListingClientProps {
  initialArticles: Article[];
}

const CATEGORIES = [
  "All",
  "Skincare Science",
  "Ingredient Deep Dives",
  "Daily Rituals",
];

const FALLBACK_JOURNAL_HERO =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85";

function resolveSafeImageUrl(img: any): string {
  if (!img) return FALLBACK_JOURNAL_HERO;
  if (typeof img === "string") {
    const trimmed = img.trim();
    return trimmed.length > 0 ? trimmed : FALLBACK_JOURNAL_HERO;
  }
  if (typeof img === "object") {
    if (typeof img.url === "string" && img.url.trim().length > 0) return img.url.trim();
    if (typeof img.src === "string" && img.src.trim().length > 0) return img.src.trim();
  }
  return FALLBACK_JOURNAL_HERO;
}

export default function JournalListingClient({ initialArticles }: JournalListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" ||
        article.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.subtitle.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.author.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    return initialArticles.find((a) => a.isFeatured) || initialArticles[0];
  }, [initialArticles]);

  // Exclude featured article from standard list only if viewing "All" with no search
  const regularArticles = useMemo(() => {
    if (selectedCategory === "All" && !searchQuery.trim() && featuredArticle) {
      return filteredArticles.filter((a) => a.id !== featuredArticle.id);
    }
    return filteredArticles;
  }, [filteredArticles, selectedCategory, searchQuery, featuredArticle]);

  return (
    <div className="space-y-16">
      {/* Search & Category Filter Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E3DA]">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#1A1A1A] text-white shadow-xs"
                    : "bg-[#FFFFFF] text-[#4A4640] border border-[#E8E3DA] hover:border-[#1A1A1A]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles & ingredients..."
            className="w-full bg-[#FFFFFF] border border-[#E8E3DA] text-[14px] px-3.5 py-2 pl-9 rounded-full focus:outline-hidden focus:border-[#1A1A1A]"
          />
          <Search className="w-4 h-4 text-[#736E67] absolute left-3 top-3" />
        </div>
      </div>

      {/* Featured Article Highlight (Shown when no search is active) */}
      {!searchQuery.trim() && selectedCategory === "All" && featuredArticle && (
        <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative bg-[#EFECE4] min-h-[320px]">
              <Image
                src={resolveSafeImageUrl(featuredArticle.heroImage)}
                alt={featuredArticle.title || "Featured Journal Story"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#EDF3E8] text-[#3E4534] border border-[#C5D7BD] rounded-full text-[12px] font-semibold tracking-wider uppercase">
                    Featured Story
                  </span>
                  <span className="text-[13px] text-[#736E67] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readingTime}
                  </span>
                </div>

                <Link href={`/journal/${featuredArticle.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors leading-snug">
                    {featuredArticle.title}
                  </h2>
                </Link>

                <p className="text-[15px] sm:text-[16px] text-[#5A5650] leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[#1A1A1A]">{featuredArticle.author}</p>
                  <p className="text-[12px] text-[#736E67]">{featuredArticle.authorRole}</p>
                </div>

                <Link
                  href={`/journal/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {regularArticles.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-12 text-center rounded-xs space-y-3">
          <BookOpen className="w-10 h-10 text-[#736E67] mx-auto" />
          <h3 className="text-lg font-semibold text-[#1A1A1A]">No articles found</h3>
          <p className="text-[14px] text-[#736E67] max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="text-[13px] font-semibold text-[#4E5942] underline pt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article) => (
            <article
              key={article.id}
              className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs overflow-hidden flex flex-col group hover:border-[#1A1A1A] transition-all duration-300"
            >
              <Link href={`/journal/${article.slug}`} className="block relative aspect-[16/10] bg-[#EFECE4] overflow-hidden">
                <Image
                  src={resolveSafeImageUrl(article.heroImage)}
                  alt={article.title || "The Maysha Journal Story"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#FFFFFF]/90 backdrop-blur-xs text-[#1A1A1A] rounded-full text-[12px] font-semibold tracking-wide">
                  {article.category}
                </span>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-[12px] text-[#736E67]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readingTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <Link href={`/journal/${article.slug}`}>
                    <h3 className="text-xl font-semibold text-[#1A1A1A] group-hover:text-[#4E5942] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-[14px] text-[#5A5650] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                  <span className="text-[13px] text-[#736E67] font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {article.author}
                  </span>

                  <Link
                    href={`/journal/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1A1A] group-hover:text-[#4E5942] transition-colors"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Editorial Closing CTA */}
      <div className="bg-[#F5F2EB] border border-[#E8E3DA] p-8 sm:p-12 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-[12px] uppercase tracking-wider font-semibold text-[#4E5942] block">
            Skin-First Formulations
          </span>
          <h3 className="text-2xl font-semibold text-[#1A1A1A]">
            Discover the products featured in our Journal
          </h3>
          <p className="text-[15px] text-[#5A5650]">
            Explore pure damask rose waters, active barrier serums, and gentle facial cleansers.
          </p>
        </div>

        <Link
          href="/shop"
          className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-7 py-3.5 rounded-2xs text-[14px] uppercase tracking-wider font-semibold inline-flex items-center gap-2 transition-colors shrink-0"
        >
          <span>Explore Shop</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
