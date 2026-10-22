"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { apiBffFetch } from "@/lib/api";
import { useUIStore } from "@/stores/uiStore";

export default function ContactForm() {
  const { addToast } = useUIStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot field
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // If honeypot is filled, silently ignore
    if (website) {
      setIsLoading(false);
      setIsSuccess(true);
      return;
    }

    try {
      await apiBffFetch("contact", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject: subject.trim() || undefined,
          message: message.trim(),
          website: "",
        }),
      });

      setIsSuccess(true);
      addToast("Message Sent", "Thank you! Our skincare team will reply within 24 hours.", "success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to submit message. Please try again or reach out directly to our customer care team."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#EDF3E8] border border-[#C5D7BD] p-8 rounded-xs text-center space-y-3">
        <div className="w-12 h-12 bg-white text-[#4E5942] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-[#3E4534]">Message Dispatched</h3>
        <p className="text-[14px] text-[#4E5942] max-w-md mx-auto">
          Thank you for reaching out to Maysha. Our cosmetic specialists will review your query and reply promptly to your email.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-[13px] font-semibold text-[#3E4534] underline pt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xs flex items-start gap-2.5 text-[13px] text-[#9B1C1C]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-field">Leave this empty</label>
        <input
          id="website-field"
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[15px] font-medium text-[#1A1A1A] block mb-2">
            Your Name <span className="text-[#A94438]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Maya Sen"
            className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-4 py-3 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
          />
        </div>
        <div>
          <label className="text-[15px] font-medium text-[#1A1A1A] block mb-2">
            Email Address <span className="text-[#A94438]">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="e.g. maya@example.com"
            className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-4 py-3 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[15px] font-medium text-[#1A1A1A] block mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-4 py-3 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
          />
        </div>
        <div>
          <label className="text-[15px] font-medium text-[#1A1A1A] block mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Skin routine advice or order enquiry"
            className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-4 py-3 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
          />
        </div>
      </div>

      <div>
        <label className="text-[15px] font-medium text-[#1A1A1A] block mb-2">
          Your Message <span className="text-[#A94438]">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          maxLength={3000}
          placeholder="Tell us about your skin concerns, climate, or enquiry..."
          className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-4 py-3 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A] resize-none"
        />
        <div className="text-right text-[13px] text-[#736E67] mt-1.5">
          {message.length} / 3000
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto bg-[#1A1A1A] hover:bg-[#333333] text-white py-3.5 px-8 text-[14px] uppercase tracking-wider font-medium rounded-2xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
