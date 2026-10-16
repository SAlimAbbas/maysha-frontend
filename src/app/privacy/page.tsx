import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Maysha Skincare",
  description: "Learn how Maysha collects, protects, and uses your personal information with absolute integrity and bank-grade data security.",
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-4 h-4" /> Legal & Transparency
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-light mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#736E67]">
            Last updated: October 14, 2026 • Effective immediately across all Maysha platforms.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-[#E8E3DA] rounded-xs p-8 sm:p-12 space-y-8 text-[#4A4742] leading-relaxed text-[15px]">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              1. Our Commitment to Your Privacy
            </h2>
            <p>
              At Maysha Skincare ("Maysha", "we", "us", or "our"), we honor the sacred trust you place in us when sharing your personal information. We treat your personal data with the same purity, rigor, and respect as the botanical ingredients inside our formulations. We never sell, rent, or trade your personal data with third-party data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              2. Information We Collect
            </h2>
            <p>We collect only the information strictly necessary to provide exceptional e-commerce service:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong>Contact & Account Data:</strong> Name, verified email address, phone number, and encrypted password.</li>
              <li><strong>Delivery Information:</strong> Physical delivery address, landmark, PIN code, and recipient telephone number.</li>
              <li><strong>Transaction & Order History:</strong> Ordered products, order reference IDs, GST invoice records, and delivery fulfillment logs.</li>
              <li><strong>Payment Processing:</strong> All online payment credentials (UPI, credit/debit cards, NetBanking) are processed directly by RBI-licensed payment aggregators (Razorpay). Maysha never stores your CVV, PIN, or full card numbers on our servers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              3. How We Use Your Information
            </h2>
            <p>Your data is used strictly for legitimate retail operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Processing, packing, and dispatching orders to your doorstep.</li>
              <li>Generating GST-compliant fiscal tax invoices and shipment tracking manifests.</li>
              <li>Sending automated order confirmations, dispatch updates, and OTP authentications.</li>
              <li>Providing dedicated concierge customer care and handling return requests.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              4. Data Protection & Security
            </h2>
            <p>
              All communications are encrypted in transit using industry-standard TLS 1.3 cryptographic protocols. Access to customer records is restricted by role-based authorization controls and multi-factor authentication.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal">
              5. Grievance Officer & Contact
            </h2>
            <p>
              In compliance with the Information Technology Act 2000 and the Consumer Protection (E-Commerce) Rules, 2020:
            </p>
            <div className="bg-[#FBF9F5] p-5 rounded-2xs border border-[#E8E3DA] text-xs space-y-1 text-[#1A1A1A]">
              <p><strong>Grievance Officer:</strong> Syed Alim Abbas</p>
              <p><strong>Entity:</strong> Maysha Skincare Private Limited</p>
              <p><strong>Email:</strong> grievance@maysha.in / care@maysha.in</p>
              <p><strong>Address:</strong> Bengaluru, Karnataka, India - 560001</p>
              <p><strong>Response Time:</strong> Within 48 hours acknowledgment and 30 days resolution.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
