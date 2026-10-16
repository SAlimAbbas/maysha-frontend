import React from "react";
import Link from "next/link";
import { Truck, ArrowLeft, Clock, ShieldCheck, MapPin } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | Maysha Skincare",
  description: "Learn about Maysha express delivery timelines, free shipping thresholds, COD availability, and packaging care.",
};

export default function ShippingPolicyPage() {
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
            <Truck className="w-4 h-4" /> Fulfillment & Logistics
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-light mb-4">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm text-[#736E67]">
            Carefully packaged in temperature-controlled sustainable recyclable boxes.
          </p>
        </div>

        <div className="bg-white border border-[#E8E3DA] rounded-xs p-8 sm:p-12 space-y-8 text-[#4A4742] leading-relaxed text-[15px]">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              1. Delivery Timelines & Dispatch
            </h2>
            <p>
              All orders are processed and dispatched within <strong>24 business hours</strong> of confirmation from our central fulfillment center in Bengaluru.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="border border-[#E8E3DA] rounded-2xs p-4 bg-[#FBF9F5]">
                <div className="flex items-center gap-2 font-semibold text-[#1A1A1A] text-sm mb-1">
                  <Clock className="w-4 h-4 text-[#4E5942]" /> Metro Cities (Delhi, Mumbai, Bengaluru, etc.)
                </div>
                <p className="text-xs text-[#736E67]">Delivered within <strong>2 to 3 business days</strong>.</p>
              </div>
              <div className="border border-[#E8E3DA] rounded-2xs p-4 bg-[#FBF9F5]">
                <div className="flex items-center gap-2 font-semibold text-[#1A1A1A] text-sm mb-1">
                  <MapPin className="w-4 h-4 text-[#4E5942]" /> Tier 2 & Rest of India
                </div>
                <p className="text-xs text-[#736E67]">Delivered within <strong>3 to 5 business days</strong>.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              2. Shipping Charges & Free Shipping Threshold
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong>Orders ₹999 and above:</strong> 100% FREE express delivery across India.</li>
              <li><strong>Orders below ₹999:</strong> A standard flat shipping fee of ₹99 applies.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              3. Cash on Delivery (COD) Rules
            </h2>
            <p>
              Cash on Delivery is available for serviceable pincodes across India for order totals up to <strong>₹5,000</strong>. For orders exceeding ₹5,000, secure online prepaid checkout is required to prevent transit refusals and protect high-value skincare products.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              4. Real-Time Tracking
            </h2>
            <p>
              Once your parcel is handed over to our verified logistics partners (Delhivery, BlueDart, Bluedart, or Shiprocket), you will immediately receive an SMS and email notification with your live Air Waybill (AWB) tracking link. You can also monitor real-time milestones anytime via our{" "}
              <Link href="/orders/track" className="text-[#4E5942] underline font-medium">
                Track Order
              </Link>{" "}
              portal.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
