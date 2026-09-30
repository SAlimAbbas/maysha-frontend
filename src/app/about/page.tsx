import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Sparkles, HeartHandshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10 lg:py-16 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-[#736E67] mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">About Maysha</span>
        </nav>

        {/* Hero Narrative */}
        <div className="max-w-3xl mb-16">
          <span className="text-[14px] uppercase tracking-[0.2em] font-semibold text-[#4E5942] mb-3 block">
            Our Purpose
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1A1A1A] leading-[1.15] mb-6">
            Clean Beauty <br />
            <span className="italic font-normal">for Real Skin</span>
          </h1>
          <p className="text-[17px] sm:text-[18px] text-[#4A4640] leading-relaxed font-normal">
            Maysha was founded on a simple truth: skincare should support your skin&apos;s natural biology, never wage war against it. We formulate restorative, biocompatible skincare using pure botanical extracts balanced with clinically proven actives.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="aspect-[4/3] relative bg-[#EFECE4] rounded-xs overflow-hidden border border-[#E8E3DA]">
            <Image
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=85"
              alt="Maysha botanical formulations on stone"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="aspect-[4/3] relative bg-[#EFECE4] rounded-xs overflow-hidden border border-[#E8E3DA]">
            <Image
              src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1000&q=85"
              alt="Fresh botanicals in natural light"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Three Core Principles */}
        <div className="mb-20 pb-16 border-b border-[#E8E3DA]">
          <span className="text-[14px] uppercase tracking-[0.18em] font-semibold text-[#4E5942] mb-2 block">
            The Maysha Standard
          </span>
          <h2 className="text-3xl font-semibold text-[#1A1A1A] mb-10">
            Our Formulation Commitments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-8 rounded-xs space-y-3">
              <Leaf className="w-7 h-7 text-[#4E5942]" />
              <h3 className="text-xl font-semibold text-[#1A1A1A]">
                1. Biocompatible & Barrier-First
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#4A4640] leading-relaxed font-normal">
                We formulate every product at an optimal physiological pH (4.5 to 5.5) to protect your acid mantle. No stripping agents, no harsh alcohol, and no disruptive sulfates.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-8 rounded-xs space-y-3">
              <Sparkles className="w-7 h-7 text-[#4E5942]" />
              <h3 className="text-xl font-semibold text-[#1A1A1A]">
                2. Absolute Transparency
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#4A4640] leading-relaxed font-normal">
                We proudly disclose the exact percentages of active ingredients on our packaging. You deserve to know what touches your skin and why it works.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-8 rounded-xs space-y-3">
              <HeartHandshake className="w-7 h-7 text-[#4E5942]" />
              <h3 className="text-xl font-semibold text-[#1A1A1A]">
                3. Ethical Sourcing & Vegan
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#4A4640] leading-relaxed font-normal">
                All botanical oils and plant adaptogens are sustainably harvested from organic co-operatives. PETA-certified cruelty-free and 100% vegan.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div id="contact" className="bg-[#FFFFFF] border border-[#E8E3DA] p-8 sm:p-12 rounded-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[14px] uppercase tracking-wider font-semibold text-[#4E5942] mb-1.5 block">
                Connect With Us
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-3">
                Questions about your skin journey?
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#5A5650] leading-relaxed font-normal">
                Our in-house skincare specialists are ready to offer routine advice tailored to your climate and skin type.
              </p>
            </div>
            <div className="space-y-2 text-[15px] text-[#5A5650] md:text-right font-normal">
              <p>Email: <span className="font-semibold text-[#1A1A1A]">care@mayshaskincare.com</span></p>
              <p>WhatsApp: <span className="font-semibold text-[#1A1A1A]">+91 98765 43210</span></p>
              <p className="text-[14px] text-[#736E67]">Mon - Sat: 9:30 AM to 6:30 PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
