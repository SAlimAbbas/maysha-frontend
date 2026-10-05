"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Leaf, HeartHandshake } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useUIStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    addToast("Welcome to Maysha", "You've successfully subscribed to our weekly skincare journal.", "success");
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
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
                Receive 10% off your first purchase and exclusive skincare rituals.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-3.5 bg-[#2A3125] border border-[#4E5942] text-[#EFECE4] text-[15px] rounded-xs">
                  <CheckCircle2 className="w-5 h-5 text-[#8EA07E]" />
                  <span>Thank you for subscribing! Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 bg-[#262626] border border-[#3E3E3E] text-[15px] text-[#FBF9F5] px-4 py-3 rounded-xs focus:outline-hidden focus:border-[#8EA07E] transition-colors placeholder-[#736E67]"
                  />
                  <button
                    type="submit"
                    className="bg-[#4E5942] hover:bg-[#5E6B51] text-[#FBF9F5] px-5 py-3 text-[15px] font-semibold rounded-xs transition-colors shrink-0 flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
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
                <Link href="/collections/serums" className="hover:text-white transition-colors">
                  Active Serums
                </Link>
              </li>
              <li>
                <Link href="/collections/moisturizers" className="hover:text-white transition-colors">
                  Barrier Moisturizers
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
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/about#ingredients" className="hover:text-white transition-colors">
                  Ingredient Transparency
                </Link>
              </li>
              <li>
                <Link href="/about#journal" className="hover:text-white transition-colors">
                  Skincare Journal
                </Link>
              </li>
              <li>
                <Link href="/about#sustainability" className="hover:text-white transition-colors">
                  Sustainability
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
              <p>Email: <span className="text-[#8EA07E] font-medium">care@mayshaskincare.com</span></p>
              <p>WhatsApp Care: <span className="text-[#8EA07E] font-medium">+91 98765 43210</span></p>
              <p className="text-[14px] text-[#736E67]">Mon – Sat: 9:30 AM – 6:30 PM IST</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="border-t border-[#2C2C2C] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[14px] text-[#736E67] gap-4 font-normal">
          <p>© {new Date().getFullYear()} Maysha Skincare Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about#privacy" className="hover:text-[#A69F93] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about#terms" className="hover:text-[#A69F93] transition-colors">
              Terms of Service
            </Link>
            <Link href="/about#shipping" className="hover:text-[#A69F93] transition-colors">
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
