import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { apiServerFetch } from "@/lib/api";
import { Product, Review, CouponOffer } from "@/types";

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

    const metaTitle = (product as any).seoTitle || `${product.name} — Maysha Botanical Skincare`;
    const metaDescription =
      (product as any).seoDescription ||
      product.subtitle ||
      product.description?.replace(/<[^>]*>?/gm, "").slice(0, 160);
    const ogImage = product.images?.[0] || "/logo.png";

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: product.keyBenefits && product.keyBenefits.length > 0
        ? product.keyBenefits.join(", ")
        : "botanical skincare, clean beauty, natural barrier care",
      alternates: {
        canonical: `/products/${product.slug}`,
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: `/products/${product.slug}`,
        siteName: "Maysha Skincare",
        images: [{ url: ogImage, width: 800, height: 800, alt: product.name }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: [ogImage],
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
  let offers: CouponOffer[] = [];

  try {
    const [pData, rData, cData] = await Promise.all([
      apiServerFetch<{ product: Product; related: Product[] }>(`products/${slug}`, {
        revalidate: 60,
        tags: [`product:${slug}`],
      }),
      apiServerFetch<Review[]>(`reviews?product_slug=${slug}`, {
        revalidate: 60,
        tags: [`reviews:${slug}`],
      }).catch(() => []),
      apiServerFetch<CouponOffer[]>("coupons", {
        revalidate: 60,
        tags: ["coupons"],
      }).catch(() => []),
    ]);

    product = pData.product;
    related = pData.related || [];
    reviews = rData || [];
    offers = Array.isArray(cData) ? cData : [];
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
        initialOffers={offers}
      />
    </>
  );
}
