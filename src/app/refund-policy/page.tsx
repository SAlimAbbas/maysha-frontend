import React from "react";
import Link from "next/link";
import { RotateCcw, ArrowLeft, ShieldAlert, CheckCircle2, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Refund & Returns Policy | Maysha Skincare",
  description: "Our 7-day hassle-free replacement, damaged transit guarantee, and prompt refund processing policy.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FBF9F5] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#736E67] hover:text-[#1A1A1A] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </Link>

        <div className="bg-white border border-[#E8E3DA] rounded-xs p-8 sm:p-12 mb-10 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EDF3E8] text-[#4E5942] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <RotateCcw className="w-4 h-4" /> Returns & Guarantee
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-light mb-4">
            Refund, Return & Cancellation Policy
          </h1>
          <p className="text-sm text-[#736E67]">
            Clean beauty backed by an uncompromising customer satisfaction guarantee.
          </p>
        </div>

        <div className="bg-white border border-[#E8E3DA] rounded-xs p-8 sm:p-12 space-y-8 text-[#4A4742] leading-relaxed text-[15px]">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              1. 7-Day Damaged or Defective Guarantee
            </h2>
            <p>
              Due to strict hygiene, microbiological purity, and safety regulations governing personal skincare formulations, we cannot accept returns of opened or used products. However, if your order arrives:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Physically damaged during transit or with a broken safety seal,</li>
              <li>Incorrect product variant received vs. what was ordered,</li>
              <li>Missing items from your package manifest,</li>
            </ul>
            <p>
              Please notify us within <strong>7 days of delivery</strong> at <a href="mailto:care@maysha.in" className="text-[#4E5942] underline">care@maysha.in</a> with photos of the outer box and invoice. We will immediately ship an express replacement at zero cost or issue a 100% full refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              2. Order Cancellations
            </h2>
            <p>
              You may cancel an order anytime before it has been dispatched from our warehouse. Simply navigate to your Account Orders page or contact our support team. Once an order has received an AWB tracking number and left our facility, it cannot be recalled while in transit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              3. Refund Processing Timelines
            </h2>
            <p>
              Approved refunds are initiated within <strong>24 business hours</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong>Prepaid Orders (UPI / Cards):</strong> Refunded directly to your original source account via Razorpay within 3 to 5 banking business days.</li>
              <li><strong>Cash on Delivery (COD):</strong> Refunded via IMPS / UPI to your provided verified bank account details within 2 to 4 business days.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              4. Contact for Returns
            </h2>
            <div className="bg-[#FBF9F5] p-5 rounded-2xs border border-[#E8E3DA] text-xs space-y-1 text-[#1A1A1A]">
              <p><strong>Support Email:</strong> care@maysha.in</p>
              <p><strong>Customer WhatsApp:</strong> +91 98765 43210 (Mon - Sat, 9:30 AM - 6:30 PM IST)</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
