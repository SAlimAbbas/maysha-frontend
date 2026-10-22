"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { apiBffFetch } from "@/lib/api";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await apiBffFetch<{ message?: string }>("contact", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          subject: subject || undefined,
          message,
          website,
        }),
      });

      setSuccess(res.message || "Thank you! Your message has been received by our concierge team.");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Unable to send your inquiry. Please try again or reach out to our concierge support team.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#E8E3DA] rounded-xs p-8 space-y-5">
      <h2 className="font-serif text-xl text-[#1A1A1A] font-normal border-b border-[#E8E3DA] pb-4">
        Send a Direct Note
      </h2>

      {success && (
        <div className="p-4 bg-[#EDF3E8] border border-[#C5D8B8] text-[#3D4733] text-xs rounded-2xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#4E5942]" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#FDEDEC] border border-[#F5C6CB] text-[#721C24] text-xs rounded-2xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#E57373]" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field */}
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

        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Your Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ananya Roy"
            disabled={isSubmitting}
            className="w-full text-xs p-3 rounded-2xs border border-[#E8E3DA] bg-[#FBF9F5] focus:bg-white focus:outline-none focus:border-[#4E5942] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Email Address *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={isSubmitting}
            className="w-full text-xs p-3 rounded-2xs border border-[#E8E3DA] bg-[#FBF9F5] focus:bg-white focus:outline-none focus:border-[#4E5942] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              disabled={isSubmitting}
              className="w-full text-xs p-3 rounded-2xs border border-[#E8E3DA] bg-[#FBF9F5] focus:bg-white focus:outline-none focus:border-[#4E5942] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Regimen Advice / Order #..."
              disabled={isSubmitting}
              className="w-full text-xs p-3 rounded-2xs border border-[#E8E3DA] bg-[#FBF9F5] focus:bg-white focus:outline-none focus:border-[#4E5942] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">How can we assist you? *</label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your skincare question or order reference..."
            disabled={isSubmitting}
            className="w-full text-xs p-3 rounded-2xs border border-[#E8E3DA] bg-[#FBF9F5] focus:bg-white focus:outline-none focus:border-[#4E5942] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#4E5942] hover:bg-[#3D4733] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-2xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
        </button>
      </form>
    </div>
  );
}
