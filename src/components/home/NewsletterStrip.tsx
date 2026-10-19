"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { apiBffFetch } from "@/lib/api";
import { useUIStore } from "@/stores/uiStore";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot trap
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addToast } = useUIStore();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await apiBffFetch("newsletter", {
        method: "POST",
        body: JSON.stringify({ email, website, source: "homepage_footer_strip" }),
      });

      setIsSuccess(true);
      setEmail("");
      addToast("Subscribed", "Welcome to the Maysha Community! 10% coupon code sent.", "success");
    } catch (err: any) {
      if (err.status === 409) {
        setErrorMessage("You are already subscribed to our newsletter.");
      } else {
        setErrorMessage(err.message || "Failed to subscribe. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-16 md:py-20 bg-[#EFECE4] border-t border-[#E5E0D8] overflow-hidden">
      {/* Decorative leaf watermark on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-25 pointer-events-none hidden md:block">
        <Image
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80"
          alt="Botanical background"
          fill
          className="object-cover object-right"
        />
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 md:px-8">
        <div className="max-w-2xl">
          <span className="text-[12px] uppercase tracking-[0.2em] text-[#4E5942] font-semibold block mb-2">
            Join Our Journey
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#1A1A1A] tracking-tight">
            Better Skin. A Kinder Planet.
          </h2>
          <p className="text-sm md:text-base text-[#5A5650] mt-2 leading-relaxed">
            Be the first to know about new botanical launches, exclusive seasonal offers, and expert skincare advice.
          </p>

          {isSuccess ? (
            <div className="mt-6 p-4 bg-[#EDF3E8] border border-[#CDE0C3] rounded-xs flex items-center gap-3 text-[#3E4534]">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#4E5942]" />
              <p className="text-[14px] font-semibold">
                Thank you for subscribing! Check your inbox for your welcome guide.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-lg">
              {/* Bot Honeypot Trap */}
              <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                <label htmlFor="hp_newsletter_website">Leave blank</label>
                <input
                  type="text"
                  id="hp_newsletter_website"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white border border-[#D5CFC3] px-4 py-3 text-[14px] text-[#1A1A1A] rounded-2xs focus:outline-hidden focus:border-[#1A1A1A] placeholder:text-[#8C867D]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-7 py-3 rounded-2xs text-[14px] uppercase tracking-wider font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {errorMessage && (
            <p className="text-[12px] text-[#A94438] mt-2 font-medium">{errorMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
}
