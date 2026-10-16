"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Leaf, HeartHandshake } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { apiBffFetch } from "@/lib/api";
import { SITE_CONFIG } from "@/config/site";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // Hidden honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addToast } = useUIStore();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await apiBffFetch<{ message?: string }>("newsletter", {
        method: "POST",
        body: JSON.stringify({ email, website }),
      });

      const msg = res.message || "Thank you for subscribing to Maysha Journal.";
      setSuccessMessage(msg);
      addToast("Subscribed", msg, "success");
      setEmail("");
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      const msg = err.message || "Failed to subscribe. Please try again later.";
      setErrorMessage(msg);
      addToast("Subscription Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#FBF9F5] border-t border-[#333333] transition-colors">
      {/* Brand Trust Strip */}
      <div className="border-b border-[#2C2C2C] py-8 sm:py-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Leaf className="w-6 h-6 text-[#8EA07E] mb-2.5" />
              <h5 className="text-[15px] uppercase tracking-wider font-semibold text-[#FBF9F5]">
                Botanical Actives
              </h5>
              <p className="text-[14px] text-[#A69F93] mt-1 font-normal">
                Pure plant extracts clinically balanced
              </p>
            </div>

            <div className="flex flex-col items-center">
              <ShieldCheck className="w-6 h-6 text-[#8EA07E] mb-2.5" />
              <h5 className="text-[15px] uppercase tracking-wider font-semibold text-[#FBF9F5]">
                Dermatologically Tested
              </h5>
              <p className="text-[14px] text-[#A69F93] mt-1 font-normal">
                Tested for sensitive and reactive skin
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Sparkles className="w-6 h-6 text-[#8EA07E] mb-2.5" />
              <h5 className="text-[15px] uppercase tracking-wider font-semibold text-[#FBF9F5]">
                100% Transparent
              </h5>
              <p className="text-[14px] text-[#A69F93] mt-1 font-normal">
                Exact active percentages disclosed
              </p>
            </div>

            <div className="flex flex-col items-center">
              <HeartHandshake className="w-6 h-6 text-[#8EA07E] mb-2.5" />
              <h5 className="text-[15px] uppercase tracking-wider font-semibold text-[#FBF9F5]">
                Cruelty-Free & Vegan
              </h5>
              <p className="text-[14px] text-[#A69F93] mt-1 font-normal">
                Never tested on animals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block focus:outline-hidden" aria-label="Maysha Homepage">
              <Image
                src="/logo.png"
                alt="Maysha"
                width={140}
                height={46}
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert opacity-95 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-[15px] text-[#B5AFA6] leading-relaxed max-w-sm font-normal">
              Thoughtfully crafted skincare that works with your skin, not against it. Experience restorative botanical formulations backed by clinical science.
            </p>

            <div className="pt-2">
              <h5 className="text-[16px] uppercase tracking-wider font-semibold text-[#FBF9F5] mb-2">
                Join the Maysha Circle
              </h5>
              <p className="text-[15px] text-[#A69F93] mb-3 font-normal">
                Receive exclusive skincare rituals, early releases, and formulation insights.
              </p>

              {successMessage ? (
                <div className="flex items-center gap-2 p-3.5 bg-[#2A3125] border border-[#4E5942] text-[#EFECE4] text-[15px] rounded-xs">
                  <CheckCircle2 className="w-5 h-5 text-[#8EA07E]" />
                  <span>{successMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    {/* Honeypot field for spam prevention */}
                    <input
                      type="text"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden="true"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      disabled={isSubmitting}
                      className="flex-1 bg-[#262626] border border-[#3E3E3E] text-[15px] text-[#FBF9F5] px-4 py-3 rounded-xs focus:outline-hidden focus:border-[#8EA07E] transition-colors placeholder-[#736E67]"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#4E5942] hover:bg-[#5E6B51] disabled:opacity-50 text-[#FBF9F5] px-5 py-3 text-[15px] font-semibold rounded-xs transition-colors shrink-0 flex items-center gap-1.5 active:scale-95"
                    >
                      <span>{isSubmitting ? "..." : "Subscribe"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {errorMessage && (
                    <p className="text-xs text-[#E57373] mt-1">{errorMessage}</p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-3.5">
            <h5 className="text-[16px] uppercase tracking-wider font-semibold text-[#FBF9F5]">
              Shop Collection
            </h5>
            <ul className="space-y-2.5 text-[15px] text-[#A69F93]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections/cleansers" className="hover:text-white transition-colors">
                  Cleansers & Balms
                </Link>
              </li>
              <li>
                <Link href="/collections/toners" className="hover:text-white transition-colors">
                  Toners & Floral Mists
                </Link>
              </li>
              <li>
                <Link href="/collections/serums" className="hover:text-white transition-colors">
                  Active Serums & Peptides
                </Link>
              </li>
              <li>
                <Link href="/collections/moisturizers" className="hover:text-white transition-colors">
                  Barrier Moisture Creams
                </Link>
              </li>
              <li>
                <Link href="/collections/sunscreen" className="hover:text-white transition-colors">
                  Mineral Sunscreen SPF 50
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2 space-y-3.5">
            <h5 className="text-[16px] uppercase tracking-wider font-semibold text-[#FBF9F5]">
              About Maysha
            </h5>
            <ul className="space-y-2.5 text-[15px] text-[#A69F93]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Story & Philosophy
                </Link>
              </li>
              <li>
                <Link href="/about#ingredients" className="hover:text-white transition-colors">
                  Ingredient Transparency
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-white transition-colors">
                  Skincare Journal
                </Link>
              </li>
              <li>
                <Link href="/orders/track" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="lg:col-span-3 space-y-3.5">
            <h5 className="text-[16px] uppercase tracking-wider font-semibold text-[#FBF9F5]">
              Customer Care
            </h5>
            <p className="text-[15px] text-[#A69F93] leading-relaxed font-normal">
              Have questions about your skincare routine or order? Our skincare specialists are here to guide you.
            </p>
            <div className="text-[15px] text-[#D8D2C6] space-y-2 pt-1 font-normal">
              <p>Email: <span className="text-[#8EA07E] font-medium">{SITE_CONFIG.supportEmail}</span></p>
              <p>WhatsApp: <span className="text-[#8EA07E] font-medium">{SITE_CONFIG.supportPhone}</span></p>
              <p className="text-[14px] text-[#736E67]">{SITE_CONFIG.hours}</p>
              <div className="pt-2">
                <Link href="/contact" className="inline-flex items-center text-xs font-semibold text-[#8EA07E] hover:underline uppercase tracking-wider">
                  Contact Concierge Desk →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="border-t border-[#2C2C2C] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[14px] text-[#736E67] gap-4 font-normal">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name} Skincare Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-[#A69F93] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#A69F93] transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping-policy" className="hover:text-[#A69F93] transition-colors">
              Shipping Policy
            </Link>
            <Link href="/refund-policy" className="hover:text-[#A69F93] transition-colors">
              Refund Policy
            </Link>
            <Link href="/contact" className="hover:text-[#A69F93] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
