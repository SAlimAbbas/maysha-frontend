"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { apiBffFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await apiBffFetch("auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      setIsSubmitted(true);
    } catch (err: any) {
      if (err.status === 500) {
        setErrorMessage(
          "Password reset service is undergoing scheduled maintenance. Please reach out to support@maysha.com directly for immediate assistance."
        );
      } else {
        setErrorMessage(err.message || "Unable to send reset instructions. Please check the email entered.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FBF9F5] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E8E3DA] p-8 sm:p-10 rounded-xs shadow-xs">
        <div className="text-center mb-8">
          <span className="text-[13px] uppercase tracking-wider font-semibold text-[#4E5942] block mb-1">
            Account Recovery
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">Reset Password</h1>
          <p className="text-[15px] text-[#736E67] mt-1">
            Enter the email address registered with your account, and we will send you instructions to reset your password.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-[#EDF3E8] text-[#4E5942] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Instructions Dispatched</h2>
            <p className="text-[14px] text-[#5A5650] leading-relaxed">
              If an account matches <span className="font-semibold text-[#1A1A1A]">{email}</span>, you will receive a secure reset link shortly.
            </p>
            <div className="pt-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#4E5942] hover:text-[#1A1A1A] underline"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="mb-6 p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#9B1C1C] shrink-0 mt-0.5" />
                <p className="text-[14px] text-[#9B1C1C]">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. name@example.com"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 pl-10 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                  <Mail className="w-4 h-4 text-[#736E67] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-3.5 px-6 text-[15px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-[14px] text-[#736E67] hover:text-[#1A1A1A] font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
