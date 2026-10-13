"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check, AlertCircle } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { useCart } from "@/hooks/useCart";
import { formatINR } from "@/lib/api";

export default function CartDrawer() {
  const { isOpen, closeCart } = useCartStore();
  const {
    cart,
    threshold,
    freeShippingRemaining,
    freeShippingProgress,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    isUpdating,
    isApplyingCoupon,
    isRemovingCoupon,
  } = useCart();

  const { addToast } = useUIStore();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [showPromoBox, setShowPromoBox] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    setPromoError("");

    try {
      const res = await applyCoupon(promoInput);
      addToast("Coupon Applied", res.message || "Discount applied successfully.", "success");
      setPromoInput("");
      setShowPromoBox(false);
    } catch (err: any) {
      setPromoError(err.message || "Invalid coupon code.");
    }
  };

  const handleRemovePromo = async () => {
    try {
      await removeCoupon();
      addToast("Coupon Removed", "Discount code has been removed.", "info");
    } catch (err: any) {
      addToast("Notice", err.message || "Failed to remove coupon.", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1A1A1A]/50 backdrop-blur-xs transition-opacity duration-300"
      onClick={closeCart}
    >
      <div
        className="w-full max-w-md h-full bg-[#FFFFFF] flex flex-col shadow-2xl transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E3DA] bg-[#FBF9F5]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-semibold text-[#1A1A1A]">
              Your Cart
            </h2>
            <span className="text-[14px] font-bold bg-[#EFECE4] text-[#1A1A1A] px-2.5 py-0.5 rounded-full">
              {cart.itemCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-[#5A5650] hover:text-[#1A1A1A] rounded-full transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="px-6 py-4 bg-[#F6F3EC] border-b border-[#E8E3DA]">
          {freeShippingRemaining > 0 ? (
            <p className="text-[15px] text-[#4A4640] mb-2 font-normal">
              Add <span className="font-semibold text-[#1A1A1A]">{formatINR(freeShippingRemaining)}</span> more to unlock <span className="font-semibold text-[#4E5942]">FREE Delivery</span>
            </p>
          ) : (
            <p className="text-[15px] font-semibold text-[#4E5942] mb-2 flex items-center gap-1.5">
              <Check className="w-5 h-5 text-[#4E5942]" />
              You have unlocked <span className="font-bold">FREE Delivery</span>!
            </p>
          )}
          <div className="w-full h-2 bg-[#E8E3DA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4E5942] transition-all duration-500 ease-out"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Warnings Banner if available */}
        {cart.warnings && cart.warnings.length > 0 && (
          <div className="px-6 py-3 bg-[#FFF9E6] border-b border-[#FFE082] text-xs text-[#8F6215] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{cart.warnings.join(" ")}</span>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#F0ECE4]">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#736E67] mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1.5">
                Your cart is empty
              </h3>
              <p className="text-[15px] text-[#736E67] max-w-xs mb-6 font-normal">
                Discover our thoughtfully formulated botanical cleansers, active serums, and barrier creams.
              </p>
              <button
                onClick={closeCart}
                className="bg-[#1A1A1A] hover:bg-[#333333] text-[#FBF9F5] text-[15px] uppercase tracking-wider font-semibold px-7 py-3.5 rounded-2xs transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.items.map((item) => {
              const maxAllowed = Math.min(10, item.stock || 10);
              return (
                <div key={item.id} className="py-4 flex gap-4 items-start group">
                  {/* Product Thumbnail */}
                  <Link
                    href={`/products/${item.productSlug}`}
                    onClick={closeCart}
                    className="w-20 h-20 relative bg-[#EFECE4] rounded-2xs overflow-hidden shrink-0"
                  >
                    <Image
                      src={item.image || "/logo.png"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="80px"
                    />
                  </Link>

                  {/* Details & Controls */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={closeCart}
                        className="text-[18px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#736E67] hover:text-[#A94438] p-1 transition-colors"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[15px] text-[#736E67] mt-0.5 font-normal">{item.size}</p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Stepper */}
                      <div className="flex items-center border border-[#E8E3DA] rounded-2xs bg-[#FBF9F5]">
                        <button
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity - 1 })}
                          disabled={isUpdating}
                          className="p-2 text-[#4A4640] hover:text-[#1A1A1A] disabled:opacity-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[15px] font-semibold px-3 min-w-8 text-center text-[#1A1A1A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity({ itemId: item.id, quantity: Math.min(maxAllowed, item.quantity + 1) })}
                          disabled={isUpdating || item.quantity >= maxAllowed}
                          className="p-2 text-[#4A4640] hover:text-[#1A1A1A] disabled:opacity-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-[18px] font-bold text-[#1A1A1A]">
                          {formatINR(item.lineTotal || item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.items.length > 0 && (
          <div className="border-t border-[#E8E3DA] bg-[#FBF9F5] p-6 space-y-4">
            {/* Promo Code Box */}
            <div>
              {cart.couponCode ? (
                <div className="flex items-center justify-between p-3 bg-[#EDF3E8] border border-[#C5D7BD] rounded-2xs text-[15px] text-[#3E4534]">
                  <span className="flex items-center gap-2 font-semibold">
                    <Tag className="w-4 h-4" /> Code &lsquo;{cart.couponCode}&rsquo; (-{formatINR(cart.discountPaise, true)})
                  </span>
                  <button
                    onClick={handleRemovePromo}
                    disabled={isRemovingCoupon}
                    className="text-[#736E67] hover:text-[#A94438] underline text-[14px]"
                  >
                    {isRemovingCoupon ? "Removing..." : "Remove"}
                  </button>
                </div>
              ) : showPromoBox ? (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. MAYSHA10)"
                      className="flex-1 bg-white border border-[#E8E3DA] px-3.5 py-2 text-[15px] text-[#1A1A1A] rounded-2xs uppercase placeholder-[#8C867D] focus:outline-hidden focus:border-[#4E5942]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon}
                      className="bg-[#1A1A1A] text-white px-4 py-2 text-[15px] font-semibold rounded-2xs hover:bg-[#333333] disabled:opacity-50 transition-colors"
                    >
                      {isApplyingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[14px] text-[#A94438]">{promoError}</p>
                  )}
                </form>
              ) : (
                <button
                  onClick={() => setShowPromoBox(true)}
                  className="flex items-center gap-1.5 text-[15px] text-[#4E5942] hover:underline font-semibold"
                >
                  <Tag className="w-4 h-4" /> Have a promo code?
                </button>
              )}
            </div>

            {/* Calculations from Paise */}
            <div className="space-y-2.5 text-[15px] text-[#4A4640]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1A1A1A]">{formatINR(cart.subtotalPaise, true)}</span>
              </div>
              {cart.discountPaise > 0 && (
                <div className="flex justify-between text-[#4E5942] font-semibold">
                  <span>Discount</span>
                  <span>-{formatINR(cart.discountPaise, true)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {cart.shippingPaise === 0 ? (
                    <span className="font-semibold text-[#4E5942]">FREE</span>
                  ) : (
                    formatINR(cart.shippingPaise, true)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[18px] font-bold text-[#1A1A1A] pt-2.5 border-t border-[#E8E3DA]">
                <span>Total</span>
                <span>{formatINR(cart.totalPaise, true)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/cart"
              onClick={closeCart}
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-[#FBF9F5] py-4 px-5 text-[16px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2.5 transition-colors active:scale-[0.99] shadow-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[14px] text-center text-[#736E67] flex items-center justify-center gap-1.5 font-normal">
              <ShieldCheck className="w-4 h-4 text-[#4E5942]" />
              Guaranteed Safe & Secure Checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
