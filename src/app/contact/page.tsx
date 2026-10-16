import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowLeft } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us & Concierge Care | Maysha Skincare",
  description: "Get in touch with the Maysha skincare concierge for orders, regimen guidance, and support.",
};

export default function ContactPage() {
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
            <MessageSquare className="w-4 h-4" /> Client Concierge
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-light mb-4">
            We Are Here to Care for You
          </h1>
          <p className="text-sm text-[#736E67]">
            Whether you need regimen advice, order assistance, or wholesale inquiries, our team responds within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="bg-white border border-[#E8E3DA] rounded-xs p-8 space-y-6">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-normal border-b border-[#E8E3DA] pb-4">
              Get in Touch
            </h2>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#4E5942] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-[#736E67]">Email Support</p>
                <a href="mailto:care@maysha.in" className="text-sm font-medium text-[#1A1A1A] hover:underline">
                  care@maysha.in
                </a>
                <p className="text-xs text-[#736E67] mt-0.5">Average reply time under 4 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#4E5942] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-[#736E67]">Phone & WhatsApp</p>
                <a href="tel:+919876543210" className="text-sm font-medium text-[#1A1A1A] hover:underline">
                  +91 98765 43210
                </a>
                <p className="text-xs text-[#736E67] mt-0.5">Monday to Saturday, 9:30 AM to 6:30 PM IST</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#4E5942] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-[#736E67]">Headquarters & Labs</p>
                <p className="text-sm text-[#1A1A1A]">
                  Maysha Skincare Private Limited<br />
                  100 Feet Road, Indiranagar<br />
                  Bengaluru, Karnataka - 560038, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#4E5942] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-[#736E67]">Order Dispatch Schedule</p>
                <p className="text-sm text-[#1A1A1A]">Dispatched daily before 3:00 PM IST</p>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
