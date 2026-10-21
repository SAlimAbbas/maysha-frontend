import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Leaf,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Droplets,
  Sun,
  Flame,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import WhatMakesUsSpecial from "@/components/home/WhatMakesUsSpecial";
import ContactForm from "@/components/about/ContactForm";
import { apiServerFetch } from "@/lib/api";
import { StoreInfo } from "@/types";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const storeInfo = await apiServerFetch<StoreInfo>("store-info", {
      revalidate: 60,
      tags: ["settings", "store-info"],
    });

    const title = storeInfo?.seo?.aboutTitle || "About Maysha | Our Botanical Philosophy & Clean Formulations";
    const description =
      storeInfo?.seo?.aboutDescription ||
      "Learn about Maysha's barrier-first skincare philosophy, pure botanical ingredients, ethical harvesting, and transparent biocompatible formulations.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: storeInfo?.about?.heroImage ? [{ url: storeInfo.about.heroImage }] : undefined,
      },
    };
  } catch {
    return {
      title: "About Maysha | Our Botanical Philosophy & Clean Formulations",
      description:
        "Learn about Maysha's barrier-first skincare philosophy, pure botanical ingredients, ethical harvesting, and transparent biocompatible formulations.",
    };
  }
}

const INGREDIENTS = [
  {
    name: "Pure Damask Rose",
    source: "Steam-distilled, Kannauj",
    benefit: "Calms epidermal redness, replenishes moisture, balances natural flora.",
    accent: "Rose hydrosol rich in natural polyphenols",
  },
  {
    name: "Niacinamide (Vitamin B3)",
    source: "Clinical 5% Grade",
    benefit: "Refines enlarged pores, regulates sebum, reinforces skin lipid synthesis.",
    accent: "Clinical active formulated at skin-optimal pH 5.5",
  },
  {
    name: "Cold-Pressed Aloe Vera",
    source: "Organic Certified Farms",
    benefit: "Provides instant anti-inflammatory soothing and weightless humectant hydration.",
    accent: "Rich in vitamins A, C, E and polysaccharides",
  },
  {
    name: "Wild Rosemary Extract",
    source: "CO2 Extracted",
    benefit: "Neutralizes environmental free radicals and protects collagen elasticity.",
    accent: "Potent natural antioxidant preservative",
  },
  {
    name: "Bio-Identical Ceramides",
    source: "Phytoceramides Complex",
    benefit: "Mimics natural intercellular lipid mortar to prevent trans-epidermal water loss.",
    accent: "Barrier restorative multi-ceramide matrix",
  },
  {
    name: "Non-Nano Zinc Oxide",
    source: "Mineral Defense",
    benefit: "Provides broad spectrum UVA/UVB barrier protection without chemical absorption.",
    accent: "Clean physical photoprotection",
  },
];

const APPROACH_STEPS = [
  {
    step: "01",
    phase: "Cleanse",
    title: "Respect the Acid Mantle",
    description:
      "Cleansing should never strip essential lipids. We utilize low-foaming, amino-acid based surfactants that lift impurities while preserving moisture barrier integrity.",
  },
  {
    step: "02",
    phase: "Treat",
    title: "Targeted Micro-Actives",
    description:
      "Rather than overloading skin with high irritating percentages, we deliver proven clinical actives paired with soothing botanicals for high efficacy with zero downtime.",
  },
  {
    step: "03",
    phase: "Hydrate",
    title: "Multi-Depth Hydration",
    description:
      "Dehydration is the precursor to sensitivity and premature aging. Our lightweight humectants draw moisture into cellular matrices for plump, calm resilience.",
  },
  {
    step: "04",
    phase: "Protect",
    title: "Environmental Defense",
    description:
      "Finish every ritual with biocompatible barrier reinforcement and mineral photoprotection against UV, particulate pollution, and oxidative stress.",
  },
];

export default async function AboutPage() {
  let storeInfo: StoreInfo | null = null;
  try {
    storeInfo = await apiServerFetch<StoreInfo>("store-info", {
      revalidate: 60,
      tags: ["settings", "store-info"],
    });
  } catch {
    // Graceful fallback to default values
  }

  const heroImageSrc =
    storeInfo?.about?.heroImage ||
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85";
  const philosophyImageSrc =
    storeInfo?.about?.philosophyImage ||
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=85";

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10 lg:py-16 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[15px] text-[#736E67]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium">About Maysha</span>
        </nav>

        {/* 1. About Hero */}
        <div className="max-w-4xl space-y-6">
          <span className="text-[14px] uppercase tracking-[0.16em] font-medium text-[#4E5942] block">
            Our Purpose &amp; Provenance
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-normal text-[#1A1A1A] leading-[1.18] tracking-tight">
            {storeInfo?.about?.heroTitle ? (
              storeInfo.about.heroTitle
            ) : (
              <>
                Clean Botanical Science <br />
                <span className="italic font-normal text-[#4E5942]">for Resilient, Real Skin</span>
              </>
            )}
          </h1>
          <p className="text-[18px] sm:text-[20px] text-[#3D3A34] leading-[1.7] font-normal">
            {storeInfo?.about?.heroSubtitle ||
              "Maysha was founded on an unwavering truth: skincare should support your skin's natural biology, never wage war against it. We formulate restorative, biocompatible skincare using pure botanical extracts balanced with clinically proven actives."}
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-[4/3] relative bg-[#EFECE4] rounded-xs overflow-hidden border border-[#E8E3DA]">
            <Image
              src={heroImageSrc}
              alt={storeInfo?.about?.heroTitle || "Maysha botanical skincare"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="aspect-[4/3] relative bg-[#EFECE4] rounded-xs overflow-hidden border border-[#E8E3DA]">
            <Image
              src={philosophyImageSrc}
              alt="Maysha laboratory & botanical formulation"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* 2. Our Story & What We Believe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-16 border-b border-[#E8E3DA]">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[14px] uppercase tracking-[0.16em] font-medium text-[#4E5942] block">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1A1A1A] leading-snug tracking-tight">
              {storeInfo?.about?.storyTitle || "Born from a need for honest, barrier-conscious skincare."}
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-[17px] sm:text-[18px] text-[#3D3A34] leading-[1.75] font-normal">
            {storeInfo?.about?.storyContent ? (
              <div className="whitespace-pre-line space-y-4">
                {storeInfo.about.storyContent}
              </div>
            ) : (
              <>
                <p>
                  In an industry dominated by aggressive 10-step routines, harsh chemical peels, and marketing buzzwords, we witnessed countless consumers battling sensitized, compromised moisture barriers. Skin was constantly inflamed, reactive, and tired.
                </p>
                <p>
                  We set out to create an antidote: minimalist skincare that honors the cutaneous acid mantle. We spent two years collaborating with cosmetic chemists and organic farmers across India to harvest botanical actives at their peak therapeutic potency.
                </p>
                <p className="border-l-2 border-[#4E5942] pl-5 italic text-[#1A1A1A] text-[18px] sm:text-[19px] leading-relaxed">
                  &ldquo;We don&apos;t believe in miracle overnight cures. We believe in daily physiological consistency, biocompatible ingredients, and skin that feels calm and radiant in its own skin.&rdquo;
                </p>
              </>
            )}
          </div>
        </div>

        {/* 3. Reusable "What Makes Us Special" (6 Pillars) */}
        <div>
          <WhatMakesUsSpecial />
        </div>

        {/* 4. Formulation Philosophy */}
        <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-8 sm:p-12 rounded-xs space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-[14px] uppercase tracking-[0.16em] font-medium text-[#4E5942] block">
              Formulation Standard
            </span>
            <h2 className="text-3xl sm:text-[34px] font-normal text-[#1A1A1A] tracking-tight">
              Our Formulation Philosophy
            </h2>
            <p className="text-[17px] sm:text-[18px] text-[#4A4640] leading-relaxed">
              Every drop is engineered with precise biocompatibility. Here is how we evaluate our formulations before they ever reach your vanity:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-7 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3.5">
              <div className="w-11 h-11 rounded-full bg-[#EDF3E8] text-[#4E5942] flex items-center justify-center font-medium text-base">
                pH
              </div>
              <h3 className="text-[20px] font-medium text-[#1A1A1A] tracking-tight">Physiological pH Balance</h3>
              <p className="text-[15px] sm:text-[16px] text-[#4A4640] leading-relaxed">
                Formulated strictly between pH 4.5 and 5.5 to match your natural micro-biome, preventing barrier permeability and inflammation.
              </p>
            </div>

            <div className="p-7 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3.5">
              <div className="w-11 h-11 rounded-full bg-[#EDF3E8] text-[#4E5942] flex items-center justify-center font-medium text-base">
                %
              </div>
              <h3 className="text-[20px] font-medium text-[#1A1A1A] tracking-tight">Declared Active Percentages</h3>
              <p className="text-[15px] sm:text-[16px] text-[#4A4640] leading-relaxed">
                We clearly disclose active concentrations on our labels. No &ldquo;fairy dusting&rdquo; of ingredients at ineffective sub-clinical dosages.
              </p>
            </div>

            <div className="p-7 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3.5">
              <div className="w-11 h-11 rounded-full bg-[#EDF3E8] text-[#4E5942] flex items-center justify-center font-medium text-base">
                0%
              </div>
              <h3 className="text-[20px] font-medium text-[#1A1A1A] tracking-tight">Zero Artificial Fragrances</h3>
              <p className="text-[15px] sm:text-[16px] text-[#4A4640] leading-relaxed">
                Free of synthetic parfum, parabens, sulfates, and irritating colorants. Any scent arises naturally from pure organic botanical extracts.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Ingredient Philosophy (Ingredient Cards) */}
        <div className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[14px] uppercase tracking-[0.16em] font-medium text-[#4E5942] block">
              Ingredient Spotlight
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1A1A1A] tracking-tight">
              Our Hero Botanical &amp; Clinical Actives
            </h2>
            <p className="text-[17px] sm:text-[18px] text-[#4A4640]">
              Carefully chosen, clinically vetted, and sustainably harvested.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INGREDIENTS.map((ing, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] border border-[#E8E3DA] p-7 rounded-xs space-y-3.5 hover:border-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] uppercase tracking-wider font-medium text-[#4E5942] bg-[#EDF3E8] px-3 py-1 rounded-full">
                    {ing.source}
                  </span>
                </div>
                <h3 className="text-[21px] font-normal text-[#1A1A1A] tracking-tight">{ing.name}</h3>
                <p className="text-[15px] sm:text-[16px] text-[#4A4640] leading-relaxed">{ing.benefit}</p>
                <p className="text-[13px] sm:text-[14px] font-normal text-[#736E67] pt-2 border-t border-[#F0ECE4]">
                  {ing.accent}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. The Maysha Approach (4-Step Visual Framework) */}
        <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-8 sm:p-12 rounded-xs space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-[14px] uppercase tracking-[0.16em] font-medium text-[#4E5942] block">
              The 4-Step Framework
            </span>
            <h2 className="text-3xl sm:text-[34px] font-normal text-[#1A1A1A] tracking-tight">The Maysha Approach</h2>
            <p className="text-[17px] sm:text-[18px] text-[#4A4640]">
              A balanced daily routine designed to build enduring dermal resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {APPROACH_STEPS.map((step, idx) => (
              <div key={idx} className="p-7 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3.5 relative">
                <span className="font-mono text-2xl font-medium text-[#4E5942] block">{step.step}</span>
                <span className="text-[13px] uppercase tracking-wider font-medium text-[#736E67] block">
                  {step.phase}
                </span>
                <h3 className="text-[18px] sm:text-[19px] font-medium text-[#1A1A1A] tracking-tight">{step.title}</h3>
                <p className="text-[15px] sm:text-[16px] text-[#4A4640] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Quality, Testing & Trust Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 py-8 border-y border-[#E8E3DA] text-center">
          <div className="space-y-2 p-4">
            <ShieldCheck className="w-7 h-7 text-[#4E5942] mx-auto" />
            <h4 className="text-[15px] font-medium text-[#1A1A1A]">Dermatologist Tested</h4>
            <p className="text-[13px] sm:text-[14px] text-[#5A5650]">Verified non-irritating</p>
          </div>
          <div className="space-y-2 p-4">
            <Leaf className="w-7 h-7 text-[#4E5942] mx-auto" />
            <h4 className="text-[15px] font-medium text-[#1A1A1A]">100% Vegan</h4>
            <p className="text-[13px] sm:text-[14px] text-[#5A5650]">Zero animal derivatives</p>
          </div>
          <div className="space-y-2 p-4">
            <HeartHandshake className="w-7 h-7 text-[#4E5942] mx-auto" />
            <h4 className="text-[15px] font-medium text-[#1A1A1A]">Cruelty-Free</h4>
            <p className="text-[13px] sm:text-[14px] text-[#5A5650]">Never tested on animals</p>
          </div>
          <div className="space-y-2 p-4">
            <Award className="w-7 h-7 text-[#4E5942] mx-auto" />
            <h4 className="text-[15px] font-medium text-[#1A1A1A]">No Harsh Chemicals</h4>
            <p className="text-[13px] sm:text-[14px] text-[#5A5650]">Paraben &amp; sulfate free</p>
          </div>
          <div className="space-y-2 p-4 col-span-2 sm:col-span-1">
            <Droplets className="w-7 h-7 text-[#4E5942] mx-auto" />
            <h4 className="text-[15px] font-medium text-[#1A1A1A]">Sustainably Sourced</h4>
            <p className="text-[13px] sm:text-[14px] text-[#5A5650]">Organic Indian botanicals</p>
          </div>
        </div>

        {/* 8. Closing Brand Statement with CTA */}
        <div className="bg-[#1A1A1A] text-white p-8 sm:p-14 rounded-xs text-center space-y-6">
          <span className="text-[14px] uppercase tracking-[0.18em] font-medium text-[#C5D7BD] block">
            Begin Your Botanical Ritual
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal max-w-2xl mx-auto leading-tight tracking-tight">
            Skin in balance. Formulations in harmony.
          </h2>
          <p className="text-[17px] sm:text-[18px] text-[#E8E3DA] max-w-xl mx-auto font-normal leading-relaxed">
            Discover our collection of barrier-restoring cleansers, brightening botanical serums, and refreshing rose hydrosols.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="bg-white hover:bg-[#FBF9F5] text-[#1A1A1A] px-8 py-3.5 text-[15px] uppercase tracking-wider font-medium rounded-2xs inline-flex items-center gap-2 transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/journal"
              className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-8 py-3.5 text-[15px] uppercase tracking-wider font-medium rounded-2xs inline-flex items-center gap-2 transition-colors"
            >
              <span>Read The Journal</span>
            </Link>
          </div>
        </div>

        {/* 9. Contact Section with Working ContactForm */}
        <div id="contact" className="bg-[#FFFFFF] border border-[#E8E3DA] p-8 sm:p-12 rounded-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[14px] uppercase tracking-wider font-medium text-[#4E5942] block">
                Connect With Us
              </span>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] tracking-tight">
                Have questions about your skin journey?
              </h3>
              <p className="text-[16px] sm:text-[17px] text-[#4A4640] leading-relaxed">
                Our in-house skincare specialists are ready to offer routine advice tailored to your climate and skin type.
              </p>

              <div className="pt-4 space-y-2.5 text-[15px] sm:text-[16px] text-[#4A4640]">
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${storeInfo?.supportEmail || "care@mayshaskincare.com"}`}
                    className="font-medium text-[#1A1A1A] hover:underline"
                  >
                    {storeInfo?.supportEmail || "care@mayshaskincare.com"}
                  </a>
                </p>
                <p>
                  WhatsApp:{" "}
                  <a
                    href={`https://wa.me/${(storeInfo?.supportWhatsapp || storeInfo?.supportPhone || "+919876543210").replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#1A1A1A] hover:underline"
                  >
                    {storeInfo?.supportWhatsapp || storeInfo?.supportPhone || "+91 98765 43210"}
                  </a>
                </p>
                <p className="text-[14px] text-[#736E67]">
                  {storeInfo?.supportHours || "Mon - Sat: 9:30 AM to 6:30 PM IST"}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
