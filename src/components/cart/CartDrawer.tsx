"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    getTotalItems,
    getRemainingForFreeShipping,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon
  } = useCartStore();

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

  const subtotal = getSubtotal();
  const remainingForFreeShipping = getRemainingForFreeShipping();
  const progressPercent = Math.min(100, Math.round(((999 - remainingForFreeShipping) / 999) * 100));
  const totalItems = getTotalItems();
  const total = getTotal();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const success = applyCoupon(promoInput);
    if (success) {
      addToast("Promo Code Applied", "10% discount has been applied to your order.", "success");
      setPromoInput("");
      setPromoError("");
      setShowPromoBox(false);
    } else {
      setPromoError("Invalid code. Try MAYSHA10");
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
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-normal text-[#1A1A1A]">
              Your Cart
            </h2>
            <span className="text-xs font-semibold bg-[#EFECE4] text-[#1A1A1A] px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-[#5A5650] hover:text-[#1A1A1A] rounded-full transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="px-6 py-3.5 bg-[#F6F3EC] border-b border-[#E8E3DA]">
          {remainingForFreeShipping > 0 ? (
            <p className="text-xs text-[#5A5650] mb-2">
              Add <span className="font-semibold text-[#1A1A1A]">₹{remainingForFreeShipping}</span> more to unlock <span className="font-semibold text-[#4E5942]">FREE Delivery</span>
            </p>
          ) : (
            <p className="text-xs font-medium text-[#4E5942] mb-2 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#4E5942]" />
              You have unlocked <span className="font-semibold">FREE Delivery</span>!
            </p>
          )}
          <div className="w-full h-1.5 bg-[#E8E3DA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4E5942] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#F0ECE4]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#8C867D] mb-4">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-normal text-[#1A1A1A] mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-[#8C867D] max-w-xs mb-6">
                Discover our thoughtfully formulated botanical cleansers, active serums, and barrier creams.
              </p>
              <button
                onClick={closeCart}
                className="bg-[#1A1A1A] hover:bg-[#333333] text-[#FBF9F5] text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-2xs transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-start group">
                {/* Product Thumbnail */}
                <Link
                  href={`/products/${item.productSlug}`}
                  onClick={closeCart}
                  className="w-20 h-20 relative bg-[#EFECE4] rounded-2xs overflow-hidden shrink-0"
                >
                  <Image
                    src={item.image}
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
                      className="font-serif text-sm font-medium text-[#1A1A1A] hover:text-[#4E5942] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#8C867D] hover:text-[#A94438] p-1 transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#8C867D] mt-0.5">{item.size}</p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E8E3DA] rounded-2xs bg-[#FBF9F5]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-[#5A5650] hover:text-[#1A1A1A] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold px-2.5 min-w-6 text-center text-[#1A1A1A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-[#5A5650] hover:text-[#1A1A1A] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-[#E8E3DA] bg-[#FBF9F5] p-6 space-y-4">
            {/* Promo Code Toggle */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 bg-[#EDF3E8] border border-[#C5D7BD] rounded-2xs text-xs text-[#3E4534]">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Tag className="w-3.5 h-3.5" /> Code &lsquo;{couponCode}&rsquo; (-₹{couponDiscount})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-[#8C867D] hover:text-[#A94438] underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : showPromoBox ? (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Enter promo code (e.g. MAYSHA10)"
                      className="flex-1 bg-white border border-[#E8E3DA] px-3 py-1.5 text-xs text-[#1A1A1A] rounded-2xs uppercase placeholder-[#8C867D] focus:outline-hidden focus:border-[#4E5942]"
                    />
                    <button
                      type="submit"
                      className="bg-[#1A1A1A] text-white px-3 py-1.5 text-xs font-semibold rounded-2xs hover:bg-[#333333] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-[#A94438]">{promoError}</p>
                  )}
                </form>
              ) : (
                <button
                  onClick={() => setShowPromoBox(true)}
                  className="flex items-center gap-1.5 text-xs text-[#4E5942] hover:underline font-medium"
                >
                  <Tag className="w-3.5 h-3.5" /> Have a promo code?
                </button>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-[#5A5650]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1A1A1A]">₹{subtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#4E5942]">
                  <span>Discount</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {remainingForFreeShipping === 0 ? (
                    <span className="font-semibold text-[#4E5942]">FREE</span>
                  ) : (
                    "Calculated at checkout"
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#1A1A1A] pt-2 border-t border-[#E8E3DA]">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/cart"
              onClick={closeCart}
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-[#FBF9F5] py-3.5 px-4 text-xs uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors active:scale-[0.99] shadow-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-center text-[#8C867D] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4E5942]" />
              Guaranteed Safe & Secure Checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
