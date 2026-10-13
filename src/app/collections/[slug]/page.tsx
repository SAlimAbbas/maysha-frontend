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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const categories = await apiServerFetch<Category[]>("categories", { revalidate: 300 });
    const category = categories.find((c) => c.slug === slug);
    if (!category) return { title: "Collection | Maysha" };
    return {
      title: `${category.name} | Maysha Skincare`,
      description: category.subtitle,
    };
  } catch {
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
    notFound();
  }

  const category = categories.find((c) => c.slug === slug);
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
