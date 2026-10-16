import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FBF9F5] flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center bg-white border border-[#E8E3DA] rounded-xs p-8 sm:p-12 shadow-xs">
        <div className="w-16 h-16 bg-[#EDF3E8] text-[#4E5942] rounded-full flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 stroke-[1.5]" />
        </div>

        <span className="text-xs uppercase font-bold tracking-widest text-[#736E67] block mb-2">
          Error 404 • Page Not Found
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-light mb-4">
          A Lost Formulation
        </h1>

        <p className="text-sm text-[#736E67] leading-relaxed mb-8">
          The page or ritual you are seeking does not exist or may have been moved to another section of our boutique.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#4E5942] hover:bg-[#3D4733] text-white text-xs font-semibold uppercase tracking-wider rounded-2xs transition-colors shadow-xs inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return Home
          </Link>

          <Link
            href="/shop"
            className="px-6 py-3 border border-[#E8E3DA] bg-[#FBF9F5] hover:bg-white text-[#1A1A1A] text-xs font-semibold uppercase tracking-wider rounded-2xs transition-colors inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4E5942]" /> Explore Catalog
          </Link>
        </div>
      </div>
    </main>
  );
}
