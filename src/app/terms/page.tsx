import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | Maysha Skincare",
  description: "Terms of service, purchasing agreements, payment protocols, and operational guidelines for Maysha Skincare.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FBF9F5] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#736E67] hover:text-[#1A1A1A] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </Link>

        {/* Header */}
        <div className="bg-white border border-[#E8E3DA] rounded-xs p-8 sm:p-12 mb-10 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EDF3E8] text-[#4E5942] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <FileText className="w-4 h-4" /> Legal Agreement
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-light mb-4">
            Terms & Conditions of Service
          </h1>
          <p className="text-sm text-[#736E67]">
            Effective Date: October 14, 2026 • Governed by the laws of India.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-[#E8E3DA] rounded-xs p-8 sm:p-12 space-y-8 text-[#4A4742] leading-relaxed text-[15px]">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or placing an order through the Maysha Skincare website (maysha.in) or associated digital channels, you agree to be bound by these Terms and Conditions and our Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              2. Products, Pricing & GST
            </h2>
            <p>
              All prices listed on our platform are displayed in Indian Rupees (INR) and are inclusive of Goods & Services Tax (GST) as applicable under Indian tax laws. While we strive for absolute accuracy in descriptions and pricing, typographical errors or inventory variances may occasionally occur. Maysha reserves the right to correct any pricing discrepancies prior to order fulfillment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              3. Payment & Idempotency Protection
            </h2>
            <p>
              We support secure digital payments through Razorpay (UPI, Credit/Debit cards, Net Banking) and Cash on Delivery (COD) for eligible pincodes up to maximum order value limits. Orders placed online utilize cryptographic idempotency keys to ensure you are never billed twice for the same transaction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              4. Product Suitability & Patch Testing
            </h2>
            <p>
              Maysha skincare formulations are dermatologically tested, non-comedogenic, and 100% vegan. However, individual skin microbiomes vary. We strongly recommend performing a 24-hour patch test behind the ear or inside the wrist before introducing any new formulation into your daily skincare ritual.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              5. Intellectual Property
            </h2>
            <p>
              All trademarks, product photography, editorial journal publications, formulas, and visual brand assets belong exclusively to Maysha Skincare Private Limited. Reproduction without prior written authorization is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              6. Dispute Resolution & Jurisdiction
            </h2>
            <p>
              Any disputes arising from transactions on this platform shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
