import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { apiServerFetch } from "@/lib/api";
import { Product, Review } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await apiServerFetch<{ product: Product; related: Product[] }>(`products/${slug}`, {
      revalidate: 60,
    });
    const { product } = data;
    if (!product) return { title: "Product | Maysha" };

    return {
      title: `${product.name} — Maysha Skincare`,
      description: product.subtitle || product.description?.slice(0, 160),
      openGraph: {
        title: `${product.name} | Maysha`,
        description: product.subtitle,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: "Product | Maysha" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let product: Product | null = null;
  let related: Product[] = [];
  let reviews: Review[] = [];

  try {
    const [pData, rData] = await Promise.all([
      apiServerFetch<{ product: Product; related: Product[] }>(`products/${slug}`, {
        revalidate: 60,
        tags: [`product:${slug}`],
      }),
      apiServerFetch<Review[]>(`reviews?product_slug=${slug}`, {
        revalidate: 60,
        tags: [`reviews:${slug}`],
      }).catch(() => []),
    ]);

    product = pData.product;
    related = pData.related || [];
    reviews = rData || [];
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  // Generate JSON-LD Structured Data
  const primaryVariant = product.variants[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: primaryVariant?.id || product.id,
    brand: {
      "@type": "Brand",
      name: "Maysha",
    },
    offers: {
      "@type": "Offer",
      url: `https://mayshacare.com/products/${product.slug}`,
      priceCurrency: "INR",
      price: primaryVariant?.price || product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        related={related}
        initialReviews={reviews}
      />
    </>
  );
}
