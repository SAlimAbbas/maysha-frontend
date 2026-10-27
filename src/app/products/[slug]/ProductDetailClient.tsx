"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Check,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Sparkles,
  Truck,
  ChevronDown,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Search,
  ThumbsUp,
  ThumbsDown,
  Camera,
  CheckCircle2,
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import SkincareRoutineSteps from "@/components/product/SkincareRoutineSteps";
import DOMPurify from "isomorphic-dompurify";
import OfferBadge from "@/components/ui/OfferBadge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useUIStore } from "@/stores/uiStore";
import { Product, Review, CouponOffer } from "@/types";
import { formatINR, apiBffFetch } from "@/lib/api";

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
  initialReviews: Review[];
  initialOffers?: CouponOffer[];
}

interface OfferItem {
  id: string;
  code: string;
  description: string;
}

const DEFAULT_OFFERS: OfferItem[] = [
  {
    id: "offer-1",
    code: "ATC10",
    description: "Get Additional 10% Off on orders above ₹599/-",
  },
  {
    id: "offer-2",
    code: "B2G3RDFREE",
    description: "Buy 2, Get the 3rd product FREE",
  },
  {
    id: "offer-3",
    code: "MAYSHA10",
    description: "Get 10% Off on all clean skincare orders",
  },
  {
    id: "offer-4",
    code: "CLEAN50",
    description: "Flat ₹50 Off on orders above ₹499/-",
  },
];

const POPULAR_TOPICS = [
  "smell",
  "feels",
  "packaging",
  "issues",
  "skin",
  "texture",
  "results",
  "price",
  "hydrating",
  "gentle",
];

function formatInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[#1A1A1A]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-[#3E4534]">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

function renderFormattedHowToUse(raw: string | undefined | null) {
  if (!raw || !raw.trim()) {
    return (
      <p className="text-[15px] text-[#736E67]">
        Dispense adequate amount and gently press into cleansed skin morning and
        night.
      </p>
    );
  }

  const text = raw.trim();
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return (
      <div
        className="prose prose-stone text-[15px] text-[#4A4640] leading-relaxed max-w-none space-y-2"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
      />
    );
  }

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3 pt-1">
      {lines.map((line, idx) => {
        const stepMatch = line.match(/^(\d+)[\.\)]\s*(.*)$/);
        if (stepMatch) {
          const stepNum = stepMatch[1];
          const stepBody = stepMatch[2];
          return (
            <div key={idx} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#EDF3E8] text-[#3E4534] border border-[#C5D7BD] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                {stepNum}
              </span>
              <p className="text-[15px] text-[#4A4640] leading-relaxed flex-1">
                {formatInlineMarkdown(stepBody)}
              </p>
            </div>
          );
        }

        if (/^[•\-\*]\s*/.test(line)) {
          const bulletBody = line.replace(/^[•\-\*]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4E5942] shrink-0 mt-2" />
              <p className="text-[15px] text-[#4A4640] leading-relaxed flex-1">
                {formatInlineMarkdown(bulletBody)}
              </p>
            </div>
          );
        }

        if (line.startsWith(">")) {
          const quoteBody = line.replace(/^>\s*/, "");
          return (
            <div
              key={idx}
              className="my-3 p-3.5 bg-[#F6F8F4] border-l-3 border-[#4E5942] rounded-2xs text-[14px] text-[#3E4534]"
            >
              {formatInlineMarkdown(quoteBody)}
            </div>
          );
        }

        if (line === "---" || line === "___") {
          return <hr key={idx} className="my-2 border-[#E8E3DA]" />;
        }

        return (
          <p key={idx} className="text-[15px] text-[#4A4640] leading-relaxed">
            {formatInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function ProductDetailClient({
  product,
  related = [],
  initialReviews = [],
  initialOffers = [],
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || "",
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("potent");
  const [isAddingLocal, setIsAddingLocal] = useState(false);
  const [isAddedLocal, setIsAddedLocal] = useState(false);

  // Zoom Lightbox Modal State
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  // Dynamic Offers State (SSR hydrated with fallback, refreshed via client fetch)
  const [offers, setOffers] = useState<OfferItem[]>(() => {
    if (initialOffers && initialOffers.length > 0) {
      return initialOffers.map((o) => ({
        id: String(o.id),
        code: o.code,
        description: o.description,
      }));
    }
    return DEFAULT_OFFERS;
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    apiBffFetch<CouponOffer[]>("coupons")
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setOffers(
            data.map((o) => ({
              id: String(o.id),
              code: o.code,
              description: o.description,
            })),
          );
        }
      })
      .catch(() => {
        // keep fallback or initial offers
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Pincode Delivery Check
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");
  const [pincodeMessage, setPincodeMessage] = useState("");

  // Reviews State & Filters
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [withMediaOnly, setWithMediaOnly] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"highest" | "lowest" | "recent">(
    "highest",
  );
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, "up" | "down">>({});
  const [previewMediaModal, setPreviewMediaModal] = useState<string | null>(
    null,
  );

  const mediaCarouselRef = useRef<HTMLDivElement>(null);

  const { addItem, threshold } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToast } = useUIStore();

  const isCurrentWishlisted = isWishlisted(product.id);

  const currentVariant = product.variants.find(
    (v) => v.id === selectedVariantId,
  ) ||
    product.variants[0] || {
      id: "var-default",
      size: product.size,
      price: product.price,
      mrp: product.mrp,
      inStock: product.inStock,
    };

  const discount =
    currentVariant.mrp > currentVariant.price
      ? Math.round(
          ((currentVariant.mrp - currentVariant.price) / currentVariant.mrp) *
            100,
        )
      : 0;

  // Fetch live active offers on mount
  useEffect(() => {
    let isMounted = true;
    apiBffFetch<any[]>("coupons")
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setOffers(
            data.map((c) => ({
              id: c.id || c.code,
              code: c.code,
              description: c.description || `Get ${c.value}% Off on orders`,
            })),
          );
        }
      })
      .catch(() => {
        // Fallback to defaults
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (!isZoomOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsZoomOpen(false);
      } else if (e.key === "ArrowLeft") {
        setZoomIndex((prev) =>
          prev > 0 ? prev - 1 : product.images.length - 1,
        );
      } else if (e.key === "ArrowRight") {
        setZoomIndex((prev) =>
          prev < product.images.length - 1 ? prev + 1 : 0,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, product.images.length]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast("Coupon Copied", `Code '${code}' copied to clipboard!`, "success");
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6) {
      setPincodeStatus("invalid");
      setPincodeMessage("Please enter a valid 6-digit Indian PIN code.");
      return;
    }
    setPincodeStatus("checking");
    try {
      const res = await apiBffFetch<{
        serviceable: boolean;
        estimatedDays?: number;
      }>(`shipping/pincode/${pincode.trim()}`);
      if (res && res.data && res.data.serviceable !== false) {
        setPincodeStatus("valid");
        setPincodeMessage(
          `Delivery available in ${res.data.estimatedDays || "2-4"} business days with standard courier.`,
        );
      } else {
        setPincodeStatus("invalid");
        setPincodeMessage(
          "Delivery is currently not available for this PIN code.",
        );
      }
    } catch {
      setPincodeStatus("valid");
      setPincodeMessage("Standard Delivery available in 2-4 business days.");
    }
  };

  const handleAddToCart = async () => {
    if (isAddingLocal || isAddedLocal || !currentVariant.inStock) return;
    setIsAddingLocal(true);

    try {
      await addItem({
        variantId: currentVariant.id,
        quantity,
      });

      setIsAddedLocal(true);
      addToast(
        "Added to Cart",
        `${quantity}x ${product.name} (${currentVariant.size}) is in your cart.`,
        "success",
      );
      setTimeout(() => setIsAddedLocal(false), 1600);
    } catch (err: any) {
      addToast("Cart Notice", err.message || "Failed to add to cart.", "error");
    } finally {
      setIsAddingLocal(false);
    }
  };

  const handleWishlistToggle = async () => {
    await toggleWishlist(product.id);
    addToast(
      !isCurrentWishlisted ? "Saved to Wishlist" : "Removed from Wishlist",
      product.name,
      "info",
    );
  };

  const handleVote = (reviewId: string, type: "up" | "down") => {
    const current = userVoted[reviewId];
    if (current === type) return;

    setUserVoted((prev) => ({ ...prev, [reviewId]: type }));
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + (type === "up" ? 1 : -1),
    }));

    if (type === "up") {
      apiBffFetch(`reviews/${reviewId}/helpful`, { method: "POST" }).catch(
        () => {},
      );
      addToast("Helpful Vote", "Thank you for your feedback!", "info");
    }
  };

  const scrollMediaCarousel = (direction: "left" | "right") => {
    if (mediaCarouselRef.current) {
      const shift = direction === "left" ? -280 : 280;
      mediaCarouselRef.current.scrollBy({ left: shift, behavior: "smooth" });
    }
  };

  // Compile all media images across reviews
  const allReviewImages: { url: string; author: string }[] = [];
  reviews.forEach((r) => {
    if (r.images && r.images.length > 0) {
      r.images.forEach((img) => {
        allReviewImages.push({ url: img, author: r.author });
      });
    }
  });

  // Calculate Star Breakdown
  const totalReviewsCount = reviews.length > 0 ? reviews.length : 1;
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percentage = Math.round((count / totalReviewsCount) * 100);
    return { star, count, percentage };
  });

  // Filtered & Sorted Reviews
  const filteredReviews = reviews
    .filter((r) => {
      if (selectedRating !== null && Math.round(r.rating) !== selectedRating) {
        return false;
      }
      if (withMediaOnly && (!r.images || r.images.length === 0)) {
        return false;
      }
      if (selectedTopic) {
        const text = `${r.title} ${r.comment}`.toLowerCase();
        if (!text.includes(selectedTopic.toLowerCase())) {
          return false;
        }
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const text = `${r.title} ${r.comment} ${r.author}`.toLowerCase();
        if (!text.includes(q)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-8 lg:py-12 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-2 text-[14px] text-[#736E67] mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#1A1A1A] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${product.categorySlug}`}
            className="hover:text-[#1A1A1A] transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Gallery & Offers Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 relative bg-[#EFECE4] rounded-2xs overflow-hidden border transition-all duration-200 shrink-0 cursor-pointer ${
                      selectedImage === idx
                        ? "border-[#1A1A1A] ring-2 ring-[#1A1A1A]"
                        : "border-[#E8E3DA] hover:border-[#736E67]"
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} photo ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Featured Main Photo with Click-to-Zoom */}
              <div
                onClick={() => {
                  setZoomIndex(selectedImage);
                  setIsZoomOpen(true);
                  setIsZoomedIn(false);
                }}
                className="relative w-full aspect-square aspect-[4/5] bg-[#EFECE4] rounded-xs overflow-hidden border border-[#E8E3DA] shadow-xs cursor-zoom-in group"
                title="Click to view full image and zoom"
              >
                <Image
                  src={
                    product.images[selectedImage] ||
                    product.images[0] ||
                    "/logo.png"
                  }
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Multiple Badges */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                    {product.badge
                      .split(",")
                      .map((b) => b.trim())
                      .filter(Boolean)
                      .map((badgeLabel, idx) => (
                        <OfferBadge key={idx} label={badgeLabel} size="md" />
                      ))}
                  </div>
                )}

                {/* Zoom Hint Icon */}
                <div className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-[#1A1A1A] p-2 rounded-full shadow-xs transition-opacity duration-200 opacity-80 group-hover:opacity-100 flex items-center justify-center">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Offers Ticket Strip (Dynamic from Database) */}
            {offers.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-[17px] font-semibold text-[#1A1A1A] tracking-tight">
                    Offers ({offers.length})
                  </h3>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                  {offers.map((offer) => (
                    <div
                      key={offer.code}
                      className="relative shrink-0 w-[240px] sm:w-[260px] bg-[#111111] text-white p-4.5 rounded-xl flex flex-col justify-between shadow-md group hover:bg-[#000000] transition-all overflow-hidden"
                    >
                      {/* Perforated Notches on Left and Right (matching screenshot 1) */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FBF9F5] rounded-full border border-[#E8E3DA]" />
                      <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FBF9F5] rounded-full border border-[#E8E3DA]" />

                      {/* Faint Percent Watermark */}
                      <div className="absolute right-2 top-1 opacity-10 text-4xl font-black pointer-events-none">
                        %
                      </div>

                      {/* Top Code Pill with Copy Action */}
                      <div className="flex items-center justify-between pl-1 pr-1 mb-3">
                        <button
                          type="button"
                          onClick={() => handleCopyCoupon(offer.code)}
                          className="flex items-center gap-2 border border-dashed border-white/60 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-[13px] font-mono font-bold tracking-wider transition-colors cursor-pointer"
                          title="Click to copy coupon code"
                        >
                          <Copy className="w-3.5 h-3.5 text-white/80" />
                          <span>{offer.code}</span>
                        </button>
                        {copiedCode === offer.code && (
                          <span className="text-[11px] font-semibold text-[#86EFAC] animate-in fade-in">
                            Copied! ✓
                          </span>
                        )}
                      </div>

                      {/* Bottom Description */}
                      <p className="text-[13px] font-medium text-[#E5E0D8] leading-snug pl-1 pr-1">
                        {offer.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details Column */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="text-[14px] uppercase tracking-[0.16em] font-semibold text-[#4E5942] mb-1.5 block">
              Maysha Skincare • {product.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-normal text-[#1A1A1A] leading-tight mb-2.5 tracking-tight">
              {product.name}
            </h1>

            <p className="text-[16px] text-[#5A5650] leading-relaxed mb-4 font-normal">
              {product.subtitle}
            </p>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-[#D4A373]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating)
                        ? "fill-current"
                        : "text-[#E8E3DA]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[15px] font-semibold text-[#1A1A1A]">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-[#8C867D]">•</span>
              <a
                href="#reviews"
                className="text-[14px] text-[#4E5942] underline hover:text-[#1A1A1A] transition-colors"
              >
                {product.reviewCount} customer reviews
              </a>
            </div>

            {/* Price Box */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-5 rounded-xs mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold text-[#1A1A1A]">
                  {formatINR(currentVariant.price)}
                </span>
                {currentVariant.mrp > currentVariant.price && (
                  <span className="text-lg text-[#8C867D] line-through font-normal">
                    {formatINR(currentVariant.mrp)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-[13px] font-bold text-[#A94438] bg-[#FDF2F0] px-2.5 py-0.5 rounded-2xs">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#736E67]">
                MRP (Incl. of all taxes) • Standard Free Shipping available
              </p>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="text-[15px] uppercase tracking-wider font-semibold text-[#1A1A1A] block mb-2.5">
                Size:{" "}
                <span className="font-normal text-[#5A5650]">
                  {currentVariant.size}
                </span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-4 py-2.5 text-[14px] rounded-2xs border transition-all cursor-pointer ${
                      selectedVariantId === v.id
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A] font-semibold"
                        : "bg-[#FFFFFF] text-[#1A1A1A] border-[#E8E3DA] hover:border-[#1A1A1A]"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-[#E8E3DA] rounded-2xs bg-[#FFFFFF]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-[#5A5650] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold text-[15px] text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-[#5A5650] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!currentVariant.inStock || isAddingLocal}
                className={`flex-1 py-3.5 px-6 rounded-2xs text-[15px] uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !currentVariant.inStock
                    ? "bg-[#EFECE4] text-[#A6A095] cursor-not-allowed"
                    : isAddedLocal
                      ? "bg-[#4E5942] text-[#FBF9F5]"
                      : isAddingLocal
                        ? "bg-[#333333] text-[#FBF9F5] cursor-wait"
                        : "bg-[#1A1A1A] hover:bg-[#333333] text-[#FBF9F5] shadow-xs"
                }`}
              >
                {!currentVariant.inStock ? (
                  <span>Sold Out</span>
                ) : isAddedLocal ? (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-3.5 border rounded-2xs transition-colors cursor-pointer ${
                  isCurrentWishlisted
                    ? "border-[#A94438] text-[#A94438] bg-[#FDF2F0]"
                    : "border-[#E8E3DA] text-[#5A5650] hover:text-[#1A1A1A] hover:border-[#1A1A1A] bg-[#FFFFFF]"
                }`}
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${isCurrentWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Delivery Details PIN Code Checker (Screenshot 1) */}
            <div className="mb-6 pt-4 border-t border-[#E8E3DA]">
              <span className="text-[14px] uppercase tracking-wider font-semibold text-[#1A1A1A] block mb-2">
                Delivery Details
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter your pincode"
                  className="flex-1 bg-[#FFFFFF] border border-[#E8E3DA] px-4 py-2.5 rounded-2xs text-[14px] text-[#1A1A1A] focus:outline-hidden focus:border-[#1A1A1A]"
                />
                <button
                  type="submit"
                  disabled={pincodeStatus === "checking"}
                  className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-5 py-2.5 rounded-2xs text-[14px] font-semibold transition-colors cursor-pointer disabled:opacity-60"
                >
                  {pincodeStatus === "checking" ? "Checking..." : "Check"}
                </button>
              </form>
              {pincodeMessage && (
                <p
                  className={`text-[13px] mt-2 font-medium ${
                    pincodeStatus === "valid"
                      ? "text-[#386641]"
                      : "text-[#A94438]"
                  }`}
                >
                  {pincodeMessage}
                </p>
              )}
            </div>

            {/* Accordions (Screenshot 1 & PDP specs) */}
            <div className="border-t border-[#E8E3DA] divide-y divide-[#E8E3DA]">
              <div>
                <button
                  onClick={() =>
                    setActiveTab(activeTab === "potent" ? "" : "potent")
                  }
                  className="w-full py-4 flex items-center justify-between text-left text-[16px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors cursor-pointer"
                >
                  <span>Description</span>
                  <Plus
                    className={`w-4 h-4 text-[#736E67] transition-transform duration-200 ${
                      activeTab === "potent" ? "rotate-45" : ""
                    }`}
                  />
                </button>
                {activeTab === "potent" && (
                  <div className="pb-4 text-[15px] text-[#4A4640] leading-relaxed space-y-2 animate-in fade-in duration-200">
                    <p>{product.description}</p>
                    {product.keyBenefits && product.keyBenefits.length > 0 && (
                      <div className="pt-2">
                        <p className="font-semibold text-[#1A1A1A] mb-1">
                          Key Benefits:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          {product.keyBenefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() =>
                    setActiveTab(activeTab === "ideal" ? "" : "ideal")
                  }
                  className="w-full py-4 flex items-center justify-between text-left text-[16px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors cursor-pointer"
                >
                  <span>Ideal For</span>
                  <Plus
                    className={`w-4 h-4 text-[#736E67] transition-transform duration-200 ${
                      activeTab === "ideal" ? "rotate-45" : ""
                    }`}
                  />
                </button>
                {activeTab === "ideal" && (
                  <div className="pb-4 text-[15px] text-[#4A4640] leading-relaxed animate-in fade-in duration-200">
                    <p>
                      Formulated specifically for{" "}
                      <span className="font-semibold text-[#1A1A1A]">
                        {product.skinTypes?.join(", ") || "All Skin Types"}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setActiveTab(activeTab === "use" ? "" : "use")}
                  className="w-full py-4 flex items-center justify-between text-left text-[16px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors cursor-pointer"
                >
                  <span>How to Use</span>
                  <Plus
                    className={`w-4 h-4 text-[#736E67] transition-transform duration-200 ${
                      activeTab === "use" ? "rotate-45" : ""
                    }`}
                  />
                </button>
                {activeTab === "use" && (
                  <div className="pb-4 animate-in fade-in duration-200">
                    {renderFormattedHowToUse(product.usageInstructions)}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setActiveTab(activeTab === "ing" ? "" : "ing")}
                  className="w-full py-4 flex items-center justify-between text-left text-[16px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors cursor-pointer"
                >
                  <span>Full Ingredients (INCI)</span>
                  <Plus
                    className={`w-4 h-4 text-[#736E67] transition-transform duration-200 ${
                      activeTab === "ing" ? "rotate-45" : ""
                    }`}
                  />
                </button>
                {activeTab === "ing" && (
                  <div className="pb-4 text-[15px] text-[#4A4640] leading-relaxed animate-in fade-in duration-200">
                    <p className="font-mono text-xs sm:text-sm">
                      {product.ingredients}
                    </p>
                    <p className="text-[13px] text-[#736E67] mt-2">
                      Zero parabens • Zero synthetic fragrances • Zero harsh
                      sulfates
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skincare Routine Diagram */}
        <div className="mt-14">
          <SkincareRoutineSteps activeCategory={product.category} />
        </div>

        {/* Customer Reviews Section (Screenshot 2: Exact Layout Reproduction) */}
        <div
          id="reviews"
          className="mt-16 sm:mt-24 pt-12 border-t border-[#E8E3DA]"
        >
          <h2 className="text-3xl sm:text-4xl font-normal text-[#1A1A1A] text-center mb-10 tracking-tight">
            Customer Reviews
          </h2>

          {/* Rating Summary Box (Big score + Star progress bars) */}
          <div className="max-w-3xl mx-auto bg-white border border-[#E8E3DA] rounded-xs p-6 sm:p-8 mb-12 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Score Block */}
              <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-normal text-[#1A1A1A] tracking-tight">
                    {product.rating.toFixed(1)}
                  </span>
                  <div className="flex text-[#D4A373]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(product.rating)
                            ? "fill-current"
                            : "text-[#E8E3DA]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[14px] text-[#736E67]">
                  Based on {product.reviewCount || reviews.length} reviews
                </p>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block w-px h-28 bg-[#E8E3DA]" />

              {/* Right Star Breakdown Bars */}
              <div className="md:col-span-6 space-y-2 w-full">
                {ratingDistribution.map((item) => (
                  <div
                    key={item.star}
                    className="flex items-center gap-3 text-[13px] text-[#5A5650]"
                  >
                    <span className="w-6 font-medium text-[#1A1A1A]">
                      {item.star} ★
                    </span>
                    <div className="flex-1 h-2 bg-[#EFECE4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1A1A1A] rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-[12px] text-[#736E67]">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews with Media Strip (Screenshot 2: Customer Photo Strip) */}
          {allReviewImages.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                  Reviews with media
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollMediaCarousel("left")}
                    className="w-8 h-8 rounded-full border border-[#E8E3DA] bg-white flex items-center justify-center hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                    aria-label="Previous customer photos"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollMediaCarousel("right")}
                    className="w-8 h-8 rounded-full border border-[#E8E3DA] bg-white flex items-center justify-center hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                    aria-label="Next customer photos"
                  >
                    <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
                  </button>
                </div>
              </div>

              <div
                ref={mediaCarouselRef}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
              >
                {allReviewImages.map((media, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewMediaModal(media.url)}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xs overflow-hidden border border-[#E8E3DA] bg-[#EFECE4] cursor-pointer group shadow-2xs"
                  >
                    <Image
                      src={media.url}
                      alt={`Customer photo by ${media.author}`}
                      fill
                      sizes="128px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search, Filter Toolbar & Popular Topics (Screenshot 2) */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-[#736E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reviews"
                  className="w-full bg-white border border-[#E8E3DA] pl-10 pr-4 py-2 rounded-full text-[14px] text-[#1A1A1A] focus:outline-hidden focus:border-[#1A1A1A]"
                />
              </div>

              {/* Rating Dropdown */}
              <select
                value={selectedRating !== null ? selectedRating : ""}
                onChange={(e) =>
                  setSelectedRating(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="bg-white border border-[#E8E3DA] px-3.5 py-2 rounded-full text-[14px] text-[#1A1A1A] focus:outline-hidden cursor-pointer"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              {/* With Media Toggle */}
              <button
                type="button"
                onClick={() => setWithMediaOnly(!withMediaOnly)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-[14px] border transition-colors cursor-pointer ${
                  withMediaOnly
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-white text-[#1A1A1A] border-[#E8E3DA] hover:border-[#1A1A1A]"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>With media</span>
              </button>
            </div>

            {/* Popular Topics Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[13px]">
              <span className="text-[#736E67] font-medium mr-1">
                Popular topics:
              </span>
              {POPULAR_TOPICS.map((topic) => {
                const isActive = selectedTopic === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(isActive ? null : topic)}
                    className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#4E5942] text-white border-[#4E5942]"
                        : "bg-white text-[#5A5650] border-[#E8E3DA] hover:border-[#1A1A1A]"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
              {selectedTopic && (
                <button
                  type="button"
                  onClick={() => setSelectedTopic(null)}
                  className="text-[12px] text-[#A94438] underline ml-2 cursor-pointer font-medium"
                >
                  Clear topic
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex justify-end pt-2">
              <div className="flex items-center gap-2 text-[14px] text-[#736E67]">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-semibold text-[#1A1A1A] focus:outline-hidden cursor-pointer"
                >
                  <option value="highest">Highest rating</option>
                  <option value="lowest">Lowest rating</option>
                  <option value="recent">Most recent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List (Screenshot 2: Exact 2-Column Review Cards) */}
          {filteredReviews.length > 0 ? (
            <div className="space-y-6">
              {filteredReviews.map((rev) => {
                const initials = rev.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                const currentHelpful =
                  (rev.helpfulCount || 0) + (helpfulVotes[rev.id] || 0);

                return (
                  <div
                    key={rev.id}
                    className="bg-white border border-[#E8E3DA] p-6 sm:p-8 rounded-xs shadow-2xs"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Left Column: Reviewer & Skin Profile (Screenshot 2) */}
                      <div className="md:col-span-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#EFECE4] text-[#4E5942] font-semibold text-sm flex items-center justify-center shrink-0">
                            {initials || "HP"}
                          </div>
                          <div>
                            <p className="text-[15px] font-semibold text-[#1A1A1A] leading-tight">
                              {rev.author}{" "}
                              <span className="text-xs text-[#736E67] font-normal">
                                IN
                              </span>
                            </p>
                            {rev.isVerified && (
                              <p className="text-[12px] text-[#386641] font-medium flex items-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#386641]" />
                                Verified Buyer
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Skin Profile Table */}
                        <div className="text-[13px] text-[#5A5650] space-y-1 pt-2 border-t border-[#F0ECE4]">
                          <div className="flex justify-between">
                            <span className="text-[#8C867D]">Age</span>
                            <span className="font-medium text-[#1A1A1A]">
                              {rev.age || "25 to 34"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8C867D]">Skin Type</span>
                            <span className="font-medium text-[#1A1A1A]">
                              {rev.skinType || "Combination"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8C867D]">Concerns</span>
                            <span className="font-medium text-[#1A1A1A]">
                              {rev.skinConcerns || "Barrier Repair"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Review Content, Attached Photos, and Helpful Actions (Screenshot 2) */}
                      <div className="md:col-span-8 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex text-[#1A1A1A]">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.round(rev.rating)
                                      ? "fill-current"
                                      : "text-[#E8E3DA]"
                                  }`}
                                />
                              ))}
                            </div>
                            <h4 className="text-[16px] font-semibold text-[#1A1A1A]">
                              {rev.title || "Real Customer Experience"}
                            </h4>
                          </div>
                          <span className="text-[13px] text-[#736E67]">
                            {rev.date || "Recently"}
                          </span>
                        </div>

                        <p className="text-[15px] text-[#4A4640] leading-relaxed">
                          {rev.comment}
                        </p>

                        {/* Customer Attached Photos */}
                        {rev.images && rev.images.length > 0 && (
                          <div className="flex flex-wrap gap-2.5 pt-2">
                            {rev.images.map((photoUrl, pIdx) => (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => setPreviewMediaModal(photoUrl)}
                                className="relative w-20 h-20 rounded-xs overflow-hidden border border-[#E8E3DA] bg-[#EFECE4] hover:opacity-90 transition-opacity cursor-pointer"
                              >
                                <Image
                                  src={photoUrl}
                                  alt={`Customer photo ${pIdx + 1}`}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Was this review helpful? 👍 2 👎 1 */}
                        <div className="pt-4 flex items-center gap-4 text-[13px] text-[#736E67]">
                          <span>Was this review helpful?</span>
                          <button
                            type="button"
                            onClick={() => handleVote(rev.id, "up")}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                              userVoted[rev.id] === "up"
                                ? "bg-[#EDF3E8] text-[#386641] border-[#C5D7BD]"
                                : "hover:bg-[#FBF9F5] border-[#E8E3DA] text-[#5A5650]"
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{currentHelpful}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVote(rev.id, "down")}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                              userVoted[rev.id] === "down"
                                ? "bg-[#FDF2F0] text-[#A94438] border-[#F8B4B4]"
                                : "hover:bg-[#FBF9F5] border-[#E8E3DA] text-[#5A5650]"
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>0</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#E8E3DA] p-12 text-center rounded-xs">
              <p className="text-[15px] text-[#736E67] mb-2">
                No reviews match your filter criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRating(null);
                  setWithMediaOnly(false);
                  setSelectedTopic(null);
                }}
                className="text-[14px] font-semibold text-[#4E5942] underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Related Products Recommendation */}
        {related && related.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-[#E8E3DA]">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-8">
              Complete Your Daily Ritual
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FULL-SCREEN IMAGE ZOOM / VIEW LIGHTBOX MODAL */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between text-white z-10">
            <span className="text-[14px] font-mono text-white/80">
              {zoomIndex + 1} / {product.images.length} • {product.name}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsZoomedIn(!isZoomedIn)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-[13px] font-medium transition-colors cursor-pointer"
              >
                {isZoomedIn ? (
                  <ZoomOut className="w-4 h-4" />
                ) : (
                  <ZoomIn className="w-4 h-4" />
                )}
                <span>{isZoomedIn ? "Fit View" : "2x Zoom"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close zoom viewer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Central Image Viewport */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            <button
              type="button"
              onClick={() =>
                setZoomIndex((prev) =>
                  prev > 0 ? prev - 1 : product.images.length - 1,
                )
              }
              className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              onClick={() => setIsZoomedIn(!isZoomedIn)}
              className={`relative w-full h-full max-w-4xl max-h-[75vh] transition-transform duration-300 ${
                isZoomedIn
                  ? "scale-150 cursor-zoom-out"
                  : "scale-100 cursor-zoom-in"
              }`}
            >
              <Image
                src={product.images[zoomIndex] || "/logo.png"}
                alt={product.name}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setZoomIndex((prev) =>
                  prev < product.images.length - 1 ? prev + 1 : 0,
                )
              }
              className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Navigation */}
          <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setZoomIndex(idx);
                  setIsZoomedIn(false);
                }}
                className={`relative w-14 h-14 rounded-xs overflow-hidden border transition-all shrink-0 cursor-pointer ${
                  zoomIndex === idx
                    ? "border-white ring-2 ring-white scale-105"
                    : "border-white/30 hover:border-white/70 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt="Thumb"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SINGLE CUSTOMER PHOTO PREVIEW MODAL */}
      {previewMediaModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewMediaModal(null)}
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] w-full aspect-square bg-[#1A1A1A] rounded-xs overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setPreviewMediaModal(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={previewMediaModal}
              alt="Customer Review Photo"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
