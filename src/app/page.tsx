import Hero from "@/components/home/Hero";
import WhatMakesUsSpecial from "@/components/home/WhatMakesUsSpecial";
import MoreWaysToCare from "@/components/home/MoreWaysToCare";
import Bestsellers from "@/components/home/Bestsellers";
import RoutineSection from "@/components/home/RoutineSection";
import CommitmentTrustStrip from "@/components/home/CommitmentTrustStrip";
import HomeJournalSection from "@/components/home/HomeJournalSection";
import NewsletterStrip from "@/components/home/NewsletterStrip";
import { apiServerFetch } from "@/lib/api";
import { Banner, Category, Concern, Product, Review } from "@/types";

export const revalidate = 60; // 60s ISR

export default async function HomePage() {
  // Fetch homepage datasets in parallel with server caching
  const [bannersRes, bestsellersRes, newProductsRes] = await Promise.allSettled([
    apiServerFetch<Banner[]>("banners", { revalidate: 300, tags: ["banners"] }),
    apiServerFetch<Product[]>("products/bestsellers", {
      revalidate: 60,
      tags: ["products"],
    }),
    apiServerFetch<Product[]>("products/new", {
      revalidate: 60,
      tags: ["products"],
    }),
  ]);

  const banners = bannersRes.status === "fulfilled" ? bannersRes.value : [];
  const bestsellers =
    bestsellersRes.status === "fulfilled" && Array.isArray(bestsellersRes.value)
      ? bestsellersRes.value.filter((p) => {
          const b = (p.badge || "").toLowerCase();
          return b.includes("bestseller") || b.includes("best seller") || Boolean(p.isFeatured);
        })
      : [];
  const newProducts =
    newProductsRes.status === "fulfilled" && Array.isArray(newProductsRes.value)
      ? newProductsRes.value
      : [];

  return (
    <div className="flex flex-col">
      {/* 1. Hero Dynamic Carousel Banners */}
      <Hero initialBanners={banners} />

      {/* 2. What Makes Us Special (6 Pillars) */}
      <WhatMakesUsSpecial />

      {/* 3. More Ways to Care (New Formulations with Cloudinary/Local images) */}
      <MoreWaysToCare products={newProducts} />

      {/* 5. Your Skincare Routine (5-Step Diagram) */}
      <RoutineSection />

      {/* 4. Best Sellers Products Grid */}
      <Bestsellers products={bestsellers} />

      {/* 6. Our Commitment Trust Strip */}
      <CommitmentTrustStrip />

      {/* 7. From the Journal (Skincare Tips, Insights & More) */}
      <HomeJournalSection />

      {/* 8. Better Skin. A Kinder Planet. Newsletter Signup Strip */}
      <NewsletterStrip />
    </div>
  );
}
