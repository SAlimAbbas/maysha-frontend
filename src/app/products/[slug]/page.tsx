"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  Check,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Sparkles,
  Truck,
  ChevronDown,
  ArrowLeft,
  Plus,
  Minus
} from "lucide-react";
import { getProductBySlug, PRODUCTS } from "@/data/products";
import { ProductCardSkeleton, PdpSkeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product/ProductCard";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("desc");
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addItem } = useCartStore();
  const { addToast } = useUIStore();

  const product = getProductBySlug(slug) || PRODUCTS[0];

  useEffect(() => {
    setMounted(true);
    if (product) {
      setSelectedSize(product.variants[0]?.size || product.size);
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [product]);

  if (!mounted) {
    return <PdpSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-[#1A1A1A] mb-2">Product Not Found</h1>
        <p className="text-sm text-[#8C867D] mb-6">
          The skincare formulation you are looking for does not exist or has been retired.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-2xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const currentVariant =
    product.variants.find((v) => v.size === selectedSize) || {
      price: product.price,
      mrp: product.mrp,
    };

  const handleAddToCart = () => {
    if (isAdding || isAdded) return;
    setIsAdding(true);
    setTimeout(() => {
      addItem(product, selectedSize, quantity);
      setIsAdding(false);
      setIsAdded(true);
      addToast(
        "Added to Cart",
        `${quantity}x ${product.name} (${selectedSize}) added to your bag.`,
        "success"
      );
      setTimeout(() => setIsAdded(false), 1600);
    }, 250);
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-8 lg:py-12 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#8C867D] mb-8" aria-label="Breadcrumb">
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
          <span className="text-[#1A1A1A] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Gallery Column (Desktop Multi-thumbnail + Large Image) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails list */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 relative bg-[#EFECE4] rounded-2xs overflow-hidden border transition-all duration-200 shrink-0 ${
                    selectedImage === idx
                      ? "border-[#1A1A1A] ring-1 ring-[#1A1A1A]"
                      : "border-[#E8E3DA] hover:border-[#8C867D]"
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

            {/* Featured Main Photo */}
            <div className="relative w-full aspect-square sm:aspect-[4/5] bg-[#EFECE4] rounded-xs overflow-hidden border border-[#E8E3DA] shadow-xs">
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-opacity duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#1A1A1A] text-[#FBF9F5] text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-2xs shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Product Details & Purchase Actions Column */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4E5942] mb-1.5 block">
              Maysha Skincare • {product.category}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1A1A] leading-tight mb-2">
              {product.name}
            </h1>

            {/* Rating & Review summary */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center text-[#D4A373]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#1A1A1A]">
                {product.rating}
              </span>
              <span className="text-xs text-[#8C867D]">
                ({product.reviewCount} customer reviews)
              </span>
            </div>

            {/* Price Block */}
            <div className="flex items-center gap-3 py-3 border-y border-[#E8E3DA] mb-6">
              <span className="text-2xl font-semibold text-[#1A1A1A]">
                ₹{currentVariant.price}
              </span>
              {currentVariant.mrp > currentVariant.price && (
                <>
                  <span className="text-sm text-[#8C867D] line-through">
                    ₹{currentVariant.mrp}
                  </span>
                  <span className="text-xs font-semibold text-[#A94438] bg-[#FDF2F0] px-2 py-0.5 rounded-2xs">
                    {product.discountPercentage}% OFF
                  </span>
                </>
              )}
              <span className="text-[11px] text-[#8C867D] ml-auto">
                Inclusive of all taxes
              </span>
            </div>

            {/* Short subtitle / benefit statement */}
            <p className="text-xs sm:text-sm text-[#5A5650] leading-relaxed mb-6 font-light">
              {product.subtitle}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] block mb-2">
                Size: <span className="font-normal text-[#5A5650]">{selectedSize}</span>
              </label>
              <div className="flex gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedSize(v.size)}
                    className={`py-2 px-4 text-xs font-semibold rounded-2xs border transition-all duration-150 ${
                      selectedSize === v.size
                        ? "bg-[#1A1A1A] text-[#FBF9F5] border-[#1A1A1A]"
                        : "bg-[#FFFFFF] text-[#5A5650] border-[#E8E3DA] hover:border-[#1A1A1A]"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper + Add to Cart Button */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border border-[#E8E3DA] rounded-2xs bg-[#FFFFFF]">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-3 text-[#5A5650] hover:text-[#1A1A1A] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-semibold px-3 min-w-8 text-center text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-3 text-[#5A5650] hover:text-[#1A1A1A] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 py-3.5 px-6 text-xs uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${
                  isAdded
                    ? "bg-[#4E5942] text-[#FBF9F5]"
                    : isAdding
                    ? "bg-[#333333] text-[#FBF9F5] cursor-wait"
                    : "bg-[#1A1A1A] hover:bg-[#333333] text-[#FBF9F5] shadow-xs"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : isAdding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  addToast(
                    !isWishlisted ? "Saved to Wishlist" : "Removed from Wishlist",
                    product.name,
                    "info"
                  );
                }}
                className={`p-3.5 border rounded-2xs transition-colors ${
                  isWishlisted
                    ? "border-[#A94438] text-[#A94438] bg-[#FDF2F0]"
                    : "border-[#E8E3DA] text-[#5A5650] hover:text-[#1A1A1A] hover:border-[#1A1A1A] bg-[#FFFFFF]"
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Reassurance Trust Strip (matching reference) */}
            <div className="grid grid-cols-2 gap-3 py-4 border-t border-[#E8E3DA] text-xs text-[#5A5650]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4E5942] shrink-0" />
                <span>Dermatologically Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4E5942] shrink-0" />
                <span>Suitable for All Skin Types</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#4E5942] shrink-0" />
                <span>Free Shipping Above ₹999</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#4E5942] shrink-0" />
                <span>100% Authentic Guaranteed</span>
              </div>
            </div>

            {/* Collapsible Accordion Tabs (Description, Ingredients, How to Use) */}
            <div className="border-t border-[#E8E3DA] mt-2 divide-y divide-[#E8E3DA]">
              {/* Description Accordion */}
              <div>
                <button
                  onClick={() => setActiveTab(activeTab === "desc" ? "" : "desc")}
                  className="w-full py-4 flex items-center justify-between text-left text-sm font-medium text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
                >
                  <span>Product Description</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C867D] transition-transform duration-200 ${
                      activeTab === "desc" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeTab === "desc" && (
                  <div className="pb-4 text-xs text-[#5A5650] leading-relaxed space-y-2 animate-in fade-in duration-200">
                    <p>{product.description}</p>
                    <div className="pt-2">
                      <p className="font-semibold text-[#1A1A1A] mb-1">Key Benefits:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {product.keyBenefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Ingredients Accordion */}
              <div>
                <button
                  onClick={() => setActiveTab(activeTab === "ing" ? "" : "ing")}
                  className="w-full py-4 flex items-center justify-between text-left text-sm font-medium text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
                >
                  <span>Full Ingredients (INCI)</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C867D] transition-transform duration-200 ${
                      activeTab === "ing" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeTab === "ing" && (
                  <div className="pb-4 text-xs text-[#5A5650] leading-relaxed font-mono animate-in fade-in duration-200">
                    <p>{product.ingredients}</p>
                    <p className="text-[11px] text-[#8C867D] font-sans mt-2">
                      Zero parabens • Zero synthetic fragrances • Zero harsh sulfates
                    </p>
                  </div>
                )}
              </div>

              {/* How to Use Accordion */}
              <div>
                <button
                  onClick={() => setActiveTab(activeTab === "use" ? "" : "use")}
                  className="w-full py-4 flex items-center justify-between text-left text-sm font-medium text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
                >
                  <span>How to Use</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C867D] transition-transform duration-200 ${
                      activeTab === "use" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeTab === "use" && (
                  <div className="pb-4 text-xs text-[#5A5650] leading-relaxed animate-in fade-in duration-200">
                    <p>{product.usageInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Recommendation Carousel/Grid */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-[#E8E3DA]">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A1A] mb-8">
            Complete Your Daily Ritual
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
