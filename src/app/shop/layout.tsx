import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Skincare & Haircare Products Online | Maysha",
  description:
    "Explore Maysha's skincare and haircare collection online. Find botanical cleansers, serums, rose water, moisturizers and daily beauty essentials.",
  keywords: [
    "Skincare Products Online",
    "Haircare Products Online",
    "Beauty Products India",
    "Botanical Beauty Products",
    "Natural Beauty Products",
  ],
  openGraph: {
    type: "website",
    title: "Shop Skincare & Haircare Products Online | Maysha",
    description:
      "Explore Maysha's skincare and haircare collection online. Find botanical cleansers, serums, rose water, moisturizers and daily beauty essentials.",
    url: "https://mayshaindia.com/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
