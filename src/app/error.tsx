"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Maysha Storefront Error Caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#FBF9F5] flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center bg-white border border-[#E8E3DA] rounded-xs p-8 sm:p-12 shadow-xs">
        <div className="w-16 h-16 bg-[#FFF4F2] text-[#A94438] rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 stroke-[1.5]" />
        </div>

        <span className="text-xs uppercase font-bold tracking-widest text-[#A94438] block mb-2">
          Something Went Wrong
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-light mb-4">
          Temporary Interruption
        </h1>

        <p className="text-sm text-[#736E67] leading-relaxed mb-8">
          We encountered an unexpected error while loading this page. Our engineers have been alerted.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 bg-[#4E5942] hover:bg-[#3D4733] text-white text-xs font-semibold uppercase tracking-wider rounded-2xs transition-colors shadow-xs inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>

          <Link
            href="/"
            className="px-6 py-3 border border-[#E8E3DA] bg-[#FBF9F5] hover:bg-white text-[#1A1A1A] text-xs font-semibold uppercase tracking-wider rounded-2xs transition-colors inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
