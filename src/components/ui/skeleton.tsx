import React from "react";
import { clsx } from "clsx";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "skeleton-shimmer rounded-xs bg-[#EFECE4] transition-opacity duration-300",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-[#FFFFFF] border border-[#E8E3DA] p-4 transition-all duration-300">
      {/* Product Image Area */}
      <Skeleton className="w-full aspect-square mb-4" />

      {/* Product Title & Subtitle */}
      <div className="space-y-2 mb-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Ratings & Price */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Size Pills Placeholder */}
      <div className="flex gap-1.5 mb-4">
        <Skeleton className="h-6 w-12 rounded-sm" />
        <Skeleton className="h-6 w-14 rounded-sm" />
      </div>

      {/* Add to Cart Button Placeholder */}
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PdpSkeleton() {
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-3 w-16" />
        <span className="text-[#8C867D]">/</span>
        <Skeleton className="h-3 w-20" />
        <span className="text-[#8C867D]">/</span>
        <Skeleton className="h-3 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Column */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 shrink-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-16 sm:w-20 sm:h-20" />
            ))}
          </div>
          {/* Main Gallery Image */}
          <Skeleton className="w-full aspect-square sm:aspect-[4/5] flex-1" />
        </div>

        {/* Product Details Column */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-4/5" />
          
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex items-center gap-4 py-2 border-y border-[#E8E3DA]">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>

          <Skeleton className="h-14 w-full" />

          {/* Size Selector */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          {/* Quantity & CTA */}
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 w-28" />
            <Skeleton className="h-12 flex-1" />
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E8E3DA]">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Accordions */}
          <div className="space-y-3 pt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-[#E8E3DA]">
      <Skeleton className="w-20 h-20 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3 border-b border-[#E8E3DA]">
      <Skeleton className="w-14 h-14 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <Skeleton className="w-full aspect-square mb-2.5" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
