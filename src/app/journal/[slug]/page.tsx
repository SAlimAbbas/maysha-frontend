import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { apiServerFetch } from "@/lib/api";
import { Article, Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const FALLBACK_JOURNAL_HERO =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85";

function resolveSafeImageUrl(img: any, fallback: string = FALLBACK_JOURNAL_HERO): string {
  if (!img) return fallback;
  if (typeof img === "string") {
    const trimmed = img.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  if (typeof img === "object") {
    if (typeof img.url === "string" && img.url.trim().length > 0) return img.url.trim();
    if (typeof img.src === "string" && img.src.trim().length > 0) return img.src.trim();
  }
  return fallback;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  try {
    const article = await apiServerFetch<Article>(`articles/${slug}`);
    const metaImg = resolveSafeImageUrl(article.heroImage);
    const title = article.title?.trim() || "The Maysha Journal";
    return {
      title: `${title} | The Maysha Journal`,
      description: article.excerpt || article.subtitle || "Botanical formulations and skincare science journal.",
      openGraph: {
        title,
        description: article.excerpt || "",
        images: metaImg ? [{ url: metaImg }] : [],
      },
    };
  } catch {
    return {
      title: "Article Not Found | Maysha",
    };
  }
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;

  let article: Article;
  try {
    article = await apiServerFetch<Article>(`articles/${slug}`, { revalidate: 60 });
  } catch {
    notFound();
  }

  // Fetch related articles
  let allArticles: Article[] = [];
  try {
    allArticles = await apiServerFetch<Article[]>("articles", { revalidate: 60 });
  } catch {
    allArticles = [];
  }
  const relatedArticles = (Array.isArray(allArticles) ? allArticles : [])
    .filter((a) => a && a.id !== article.id)
    .slice(0, 3);

  // Fetch recommended products if slugs are present
  let recommendedProducts: Product[] = [];
  if (article.recommendedProductSlugs && article.recommendedProductSlugs.length > 0) {
    try {
      const allProducts = await apiServerFetch<Product[]>("products", { revalidate: 60 });
      if (Array.isArray(allProducts)) {
        recommendedProducts = allProducts.filter((p) =>
          p && article.recommendedProductSlugs.includes(p.slug)
        );
      }
    } catch {
      recommendedProducts = [];
    }
  }

  // Split content into paragraphs for editorial formatting
  const paragraphs = (typeof article.content === "string" && article.content.trim().length > 0)
    ? article.content.split(/\n\n+/).filter(Boolean)
    : [];
  const heroImage = resolveSafeImageUrl(article.heroImage);
  const articleTitle = article.title?.trim() || "The Maysha Journal Article";

  return (
    <article className="bg-[#FBF9F5] min-h-screen py-10 lg:py-16 border-b border-[#E8E3DA]">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-[#736E67]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/journal" className="hover:text-[#1A1A1A] transition-colors">
            Journal
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold truncate max-w-[280px] sm:max-w-md">
            {articleTitle}
          </span>
        </nav>

        {/* Article Header & Byline */}
        <header className="space-y-6 max-w-3xl">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 bg-[#EDF3E8] text-[#3E4534] border border-[#C5D7BD] rounded-full text-[12px] font-semibold tracking-wider uppercase">
              {article.category || "Skincare Science"}
            </span>
            <span className="text-[13px] text-[#736E67] flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime || "5 min read"}
            </span>
            <span className="text-[#736E67]">•</span>
            <span className="text-[13px] text-[#736E67] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }) : "Recent"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1A1A] leading-[1.18]">
            {articleTitle}
          </h1>

          {article.subtitle && (
            <p className="text-[18px] sm:text-[20px] text-[#5A5650] leading-relaxed font-normal">
              {article.subtitle}
            </p>
          )}

          {/* Author Byline */}
          <div className="pt-4 border-t border-[#E8E3DA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFECE4] text-[#4E5942] flex items-center justify-center font-bold text-sm uppercase">
                {(article.author || "Maysha").charAt(0)}
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#1A1A1A]">{article.author || "Maysha Research"}</p>
                <p className="text-[13px] text-[#736E67]">{article.authorRole || "Editorial Team"}</p>
              </div>
            </div>

            <Link
              href="/journal"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#4E5942] hover:text-[#1A1A1A] underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Journal</span>
            </Link>
          </div>
        </header>

        {/* Hero Image */}
        <div className="aspect-[16/9] relative bg-[#EFECE4] rounded-xs overflow-hidden border border-[#E8E3DA] shadow-xs">
          <Image
            src={heroImage}
            alt={articleTitle}
            fill
            className="object-cover"
            sizes="(max-width: 1040px) 100vw, 1040px"
            priority={Boolean(heroImage)}
          />
        </div>

        {/* Editorial Article Body */}
        <div className="max-w-2xl mx-auto py-4">
          <div className="article-body">
            {paragraphs.map((p, idx) => {
              if (idx === 0) {
                // Opening paragraph receives drop cap
                return (
                  <p
                    key={idx}
                    className="editorial-drop-cap text-[17px] sm:text-[18px] text-[#4A4640] leading-relaxed mb-6 font-normal text-justify"
                  >
                    {p}
                  </p>
                );
              }

              return (
                <p
                  key={idx}
                  className="text-[17px] sm:text-[18px] text-[#4A4640] leading-relaxed mb-6 font-normal"
                >
                  {p}
                </p>
              );
            })}
          </div>

          {/* Author Quote Box */}
          <div className="my-10 p-6 sm:p-8 bg-[#FFFFFF] border-l-4 border-[#4E5942] rounded-xs shadow-2xs space-y-2">
            <p className="italic text-[16px] sm:text-[17px] text-[#1A1A1A] leading-relaxed">
              &ldquo;When topicals mirror the cutaneous lipid matrix, the skin ceases its chronic inflammatory defense cycle and reclaims its natural biological radiance.&rdquo;
            </p>
            <p className="text-[13px] font-semibold text-[#4E5942] tracking-wider uppercase pt-1">
              — {article.author || "Maysha"}, {article.authorRole || "Editorial Team"}
            </p>
          </div>
        </div>

        {/* Formulations Featured In This Article */}
        {recommendedProducts.length > 0 && (
          <section className="pt-12 border-t border-[#E8E3DA] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] uppercase tracking-wider font-semibold text-[#4E5942] block">
                  Curated Ritual
                </span>
                <h2 className="text-2xl font-semibold text-[#1A1A1A]">
                  Formulations Mentioned In This Article
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-[13px] font-semibold text-[#4E5942] hover:text-[#1A1A1A] underline flex items-center gap-1"
              >
                <span>View All Formulations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="pt-12 border-t border-[#E8E3DA] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] uppercase tracking-wider font-semibold text-[#4E5942] block">
                  Continue Reading
                </span>
                <h2 className="text-2xl font-semibold text-[#1A1A1A]">Related Journal Stories</h2>
              </div>
              <Link
                href="/journal"
                className="text-[13px] font-semibold text-[#4E5942] hover:text-[#1A1A1A] underline"
              >
                All Stories
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => {
                const relImage = resolveSafeImageUrl(rel.heroImage);
                const relTitle = rel.title?.trim() || "Related Journal Story";
                return (
                  <Link
                    key={rel.id}
                    href={`/journal/${rel.slug}`}
                    className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs overflow-hidden group hover:border-[#1A1A1A] transition-all flex flex-col"
                  >
                    <div className="aspect-[16/10] relative bg-[#EFECE4] overflow-hidden">
                      <Image
                        src={relImage}
                        alt={relTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4E5942]">
                        {rel.category}
                      </span>
                      <h3 className="text-[16px] font-semibold text-[#1A1A1A] group-hover:text-[#4E5942] transition-colors leading-snug line-clamp-2">
                        {rel.title}
                      </h3>
                    </div>
                    <span className="text-[12px] text-[#736E67]">{rel.readingTime}</span>
                  </div>
                </Link>
              );
            })}
            </div>
          </section>
        )}

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-[#E8E3DA] flex items-center justify-between">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Journal Home</span>
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#333333] text-white px-5 py-2.5 rounded-2xs text-[13px] uppercase tracking-wider font-semibold transition-colors"
          >
            <span>Explore Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
