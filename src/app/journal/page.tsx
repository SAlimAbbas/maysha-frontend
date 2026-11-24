import React from "react";
import Link from "next/link";
import { apiServerFetch } from "@/lib/api";
import { Article } from "@/types";
import JournalListingClient from "@/components/journal/JournalListingClient";

export const metadata = {
  title: "Maysha Journal | Skincare Tips & Ingredient Guides",
  description:
    "Read the Maysha Journal for skincare tips, ingredient insights and daily beauty rituals. Explore practical guides to botanical ingredients and skin health.",
  keywords: [
    "Skincare Tips",
    "Skincare Blog India",
    "Beauty Tips",
    "Skincare Ingredient Guide",
    "Daily Skincare Routine",
  ],
  openGraph: {
    type: "website",
    title: "Maysha Journal | Skincare Tips & Ingredient Guides",
    description:
      "Read the Maysha Journal for skincare tips, ingredient insights and daily beauty rituals. Explore practical guides to botanical ingredients and skin health.",
    url: "https://mayshaindia.com/journal",
  },
};

export default async function JournalPage() {
  let articles: Article[] = [];

  try {
    articles = await apiServerFetch<Article[]>("articles", { revalidate: 60 });
  } catch (err) {
    articles = [];
  }

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10 lg:py-16 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-[#736E67]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">The Journal</span>
        </nav>

        {/* Blog Hero */}
        <div className="max-w-3xl space-y-4">
          <span className="text-[13px] uppercase tracking-[0.25em] font-semibold text-[#4E5942] block">
            Editorial & Insights
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1A1A1A] leading-[1.12]">
            The Maysha Journal
          </h1>
          <p className="text-[18px] sm:text-[19px] text-[#4A4640] leading-relaxed font-normal">
            Skincare science, botanical provenance, and mindful rituals. Evidence-based explorations into skin health, biocompatible formulations, and the biology of healthy skin.
          </p>
        </div>

        {/* Interactive Journal Listing */}
        <JournalListingClient initialArticles={articles} />
      </div>
    </div>
  );
}
