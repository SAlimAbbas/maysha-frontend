import React from "react";

interface OfferBadgeProps {
  label: string;
  className?: string;
  size?: "sm" | "md";
}

export default function OfferBadge({ label, className = "", size = "sm" }: OfferBadgeProps) {
  if (!label) return null;

  const normalized = label.toUpperCase().trim();

  // Determine styling based on badge intent
  let colorStyles = "bg-[#F5F3EF] text-[#666159] border-[#E8E3DA]"; // Default Gray

  if (
    normalized.includes("OFF") ||
    normalized.includes("DISCOUNT") ||
    normalized.includes("LIMITED") ||
    normalized.includes("BUY 1 GET 1") ||
    normalized.includes("BOGO")
  ) {
    // Red Accent (discount, urgency)
    colorStyles = "bg-[#FDF2F0] text-[#A94438] border-[#F5D5D0]";
  } else if (
    normalized.includes("BESTSELLER") ||
    normalized.includes("VERIFIED") ||
    normalized.includes("ORGANIC") ||
    normalized.includes("CLEAN")
  ) {
    // Green Accent (bestseller, clean)
    colorStyles = "bg-[#EFF7F2] text-[#386641] border-[#D4EBD9]";
  } else if (
    normalized.includes("SPECIAL") ||
    normalized.includes("TRENDING") ||
    normalized.includes("HOT")
  ) {
    // Yellow Accent (special offer)
    colorStyles = "bg-[#FEF9EE] text-[#8F6215] border-[#FCE9BF]";
  } else if (
    normalized.includes("NEW") ||
    normalized.includes("AWARD") ||
    normalized.includes("EDITORIAL")
  ) {
    // Purple Accent (editorial / new launch)
    colorStyles = "bg-[#F8F2FA] text-[#6B4977] border-[#EADDF0]";
  }

  const sizeStyles =
    size === "sm"
      ? "text-[11px] py-0.5 px-2 tracking-[0.06em]"
      : "text-[12px] py-1 px-2.5 tracking-[0.08em]";

  return (
    <span
      className={`inline-flex items-center font-semibold uppercase rounded-full border transition-colors ${colorStyles} ${sizeStyles} ${className}`}
    >
      {label}
    </span>
  );
}
