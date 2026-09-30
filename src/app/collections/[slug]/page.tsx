import React from "react";
import { CATEGORIES } from "@/data/categories";
import CollectionClient from "./CollectionClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    slug: c.slug,
  }));
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  return <CollectionClient slug={slug} />;
}
