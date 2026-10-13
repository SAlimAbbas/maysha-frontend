import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { apiServerFetch } from "@/lib/api";

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: string;
  author: string;
  readingTime: string;
  heroImage: string;
  publishedAt?: string;
}

function formatJournalDate(dateStr?: string): string {
  if (!dateStr) return "Recently Published";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function resolveSafeImageUrl(raw: any): string {
  if (typeof raw === "string" && raw.trim().length > 0) return raw.trim();
  if (typeof raw === "object" && raw !== null) {
    if (typeof raw.url === "string" && raw.url.trim().length > 0) return raw.url.trim();
    if (typeof raw.src === "string" && raw.src.trim().length > 0) return raw.src.trim();
  }
  return "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80";
}

export default async function HomeJournalSection() {
  let articles: ArticleItem[] = [];

  try {
    const res = await apiServerFetch<ArticleItem[]>("articles", {
      revalidate: 120,
      tags: ["articles"],
    });
    articles = (res || []).slice(0, 3);
  } catch {
    articles = [];
  }

  // Fallback high-quality editorial articles if none returned
  if (articles.length === 0) {
    articles = [
      {
        id: "1",
        slug: "the-right-way-to-layer-your-skincare",
        title: "The Right Way to Layer Your Skincare Products",
        excerpt: "Why application sequence matters for active penetration and lipid absorption.",
        category: "Skincare Science",
        author: "Maysha Formulation Team",
        readingTime: "5 min read",
        heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
        publishedAt: "Apr 12, 2026",
      },
      {
        id: "2",
        slug: "why-rose-water-is-a-skincare-essential",
        title: "Why Pure Rose Water is a Barrier Hydration Essential",
        excerpt: "The chemistry of steam-distilled Damask rose and cellular moisture retention.",
        category: "Ingredient Focus",
        author: "Botanical Research Lab",
        readingTime: "4 min read",
        heroImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
        publishedAt: "Apr 8, 2026",
      },
      {
        id: "3",
        slug: "building-a-sustainable-skincare-routine",
        title: "Building a Sustainable & Minimalist Daily Routine",
        excerpt: "How reducing unnecessary steps strengthens the skin barrier and reduces impact.",
        category: "Rituals & Guides",
        author: "Maysha Research",
        readingTime: "6 min read",
        heroImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
        publishedAt: "Apr 2, 2026",
      },
    ];
  }

  return (
    <section className="py-16 md:py-24 bg-[#FBF9F5] border-t border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[12px] uppercase tracking-[0.16em] text-[#4E5942] font-semibold block mb-2">
              From the Journal
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#1A1A1A] tracking-tight">
              Skincare Tips, Insights & More
            </h2>
            <p className="text-sm md:text-base text-[#736E67] mt-2">
              Expert advice, botanical science guides and real stories.
            </p>
          </div>

          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4E5942] hover:text-[#1A1A1A] underline group shrink-0"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((art) => {
            const safeImage = resolveSafeImageUrl(art.heroImage);
            return (
              <Link
                key={art.id}
                href={`/journal/${art.slug}`}
                className="bg-white border border-[#E8E3DA] rounded-xs overflow-hidden flex flex-col group hover:border-[#1A1A1A]/40 transition-all shadow-2xs hover:shadow-xs"
              >
                <div className="aspect-[16/10] relative bg-[#EFECE4] overflow-hidden">
                  <Image
                    src={safeImage}
                    alt={art.title || "Journal article"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#4E5942] text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] group-hover:text-[#4E5942] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-[13px] text-[#5A5650] mt-2 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between text-[12px] text-[#736E67]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#8C867D]" /> {art.readingTime}
                    </span>
                    <span>{formatJournalDate(art.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
