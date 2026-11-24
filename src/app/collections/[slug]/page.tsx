import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductCard from "@/components/product/ProductCard";
import { apiServerFetch } from "@/lib/api";
import { Category, Product } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

const COLLECTION_SEO_MAP: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  cleansers: {
    title: "Face Cleansers & Face Wash Online | Maysha India",
    description:
      "Shop gentle facial cleansers and face washes from Maysha. Explore daily cleansing options designed to remove impurities while supporting skin moisture.",
    keywords: [
      "Face Cleanser Online",
      "Gentle Face Wash",
      "Botanical Face Cleanser",
      "Daily Face Cleanser",
      "Skincare Cleansing Products",
    ],
  },
  toners: {
    title: "Botanical Toners & Rose Water Online | Maysha India",
    description:
      "Shop botanical toners and floral mists from Maysha. Refresh your skin with rose water and gentle toning essentials for your daily skincare routine.",
    keywords: [
      "Rose Water Online",
      "Botanical Face Toner",
      "Natural Face Mist",
      "Hydrating Face Toner",
      "Floral Face Mist",
    ],
  },
  serums: {
    title: "Face Serums & Peptides Online | Maysha India",
    description:
      "Explore face serums and peptide skincare by Maysha. Discover targeted formulations with active ingredients to support hydration and healthy-looking skin.",
    keywords: [
      "Face Serum Online",
      "Peptide Face Serum",
      "Active Skincare Serum",
      "Niacinamide Face Serum",
      "Botanical Face Serum",
    ],
  },
  moisturizers: {
    title: "Moisturizers & Barrier Creams Online | Maysha India",
    description:
      "Shop barrier moisture creams from Maysha for daily hydration and skin comfort. Explore formulations designed to support your skin's natural moisture barrier.",
    keywords: [
      "Moisturizer Online",
      "Barrier Repair Cream",
      "Hydrating Face Moisturizer",
      "Skin Barrier Cream",
      "Daily Moisturizing Cream",
    ],
  },
  sunscreen: {
    title: "Mineral Sunscreen SPF 50 Online | Maysha India",
    description:
      "Explore Maysha mineral sunscreen SPF 50 for everyday sun protection. Discover a mineral-based skincare essential for UVA and UVB protection.",
    keywords: [
      "Mineral Sunscreen SPF 50",
      "Sunscreen Online India",
      "Mineral Sun Protection",
      "SPF 50 Sunscreen",
      "Zinc Oxide Sunscreen",
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mapped = COLLECTION_SEO_MAP[slug.toLowerCase()];

  try {
    const categories = await apiServerFetch<Category[]>("categories", { revalidate: 300 });
    const category = categories.find((c) => c.slug === slug);

    const title =
      mapped?.title ||
      (category?.seo_title ? category.seo_title : category ? `${category.name} | Maysha Skincare` : "Collection | Maysha");
    const description = mapped?.description || category?.seo_description || category?.subtitle || "";
    const keywords = mapped?.keywords || [
      "Botanical Skincare Products",
      "Clean Beauty Products",
      "Natural Skincare Products",
    ];

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `https://mayshaindia.com/collections/${slug}`,
      },
    };
  } catch {
    if (mapped) {
      return {
        title: mapped.title,
        description: mapped.description,
        keywords: mapped.keywords,
      };
    }
    return { title: "Collection | Maysha" };
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;

  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    const [catsRes, prodsRes] = await Promise.all([
      apiServerFetch<Category[]>("categories", { revalidate: 300, tags: ["categories"] }),
      apiServerFetch<Product[]>(`products?category=${slug}&per_page=48`, { revalidate: 60, tags: ["products"] }),
    ]);
    categories = catsRes;
    products = prodsRes;
  } catch {
    // Graceful fallback
  }

  const fallbackNames: Record<string, string> = {
    cleansers: "Face Cleansers",
    toners: "Botanical Toners",
    serums: "Face Serums",
    moisturizers: "Moisturizers",
    sunscreen: "Mineral Sunscreen",
  };

  const category =
    categories.find((c) => c.slug === slug) ||
    (COLLECTION_SEO_MAP[slug]
      ? ({
          id: 0,
          slug,
          name: fallbackNames[slug] || slug,
          subtitle: COLLECTION_SEO_MAP[slug].description,
          image: null,
          sort_order: 10,
          is_active: true,
        } as unknown as Category)
      : null);

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-8 lg:py-12 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-[#736E67] mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#1A1A1A] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">{category.name}</span>
        </nav>

        {/* Collection Header */}
        <div className="mb-10 pb-6 border-b border-[#E8E3DA]">
          <span className="text-[14px] uppercase tracking-[0.16em] font-semibold text-[#4E5942] mb-1.5 block">
            Maysha Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1A1A1A] mb-2.5">
            {category.name}
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#5A5650] max-w-xl leading-relaxed font-normal">
            {category.subtitle}
          </p>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, idx) => (
              <ProductCard key={p.id} product={p} priority={idx < 2} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[#E8E3DA] rounded-xs p-8">
            <p className="text-[16px] text-[#1A1A1A] font-medium">
              New formulations in this collection are coming soon.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-block bg-[#1A1A1A] text-white px-6 py-2.5 text-sm uppercase tracking-wider font-semibold rounded-2xs"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
