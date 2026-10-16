import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#E8E3DA] border-t-[#4E5942] animate-spin" />
        </div>
        <p className="font-serif italic text-sm text-[#736E67] tracking-wider animate-pulse">
          Maysha • Preparing Formulations...
        </p>
      </div>
    </div>
  );
}
