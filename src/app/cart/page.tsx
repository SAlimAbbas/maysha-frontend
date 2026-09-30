"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  CheckCircle2,
  Lock,
  ArrowLeft
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTotal,
    getRemainingForFreeShipping,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon
  } = useCartStore();

  const { addToast } = useUIStore();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "9876543210",
    address: "Flat 402, Green Glen Layout, Bellandur",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
    paymentMethod: "razorpay"
  });

  const subtotal = getSubtotal();
  const remainingForFreeShipping = getRemainingForFreeShipping();
  const total = getTotal();
  const progressPercent = Math.min(100, Math.round(((999 - remainingForFreeShipping) / 999) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const success = applyCoupon(promoInput);
    if (success) {
      addToast("Promo Code Applied", "10% discount has been applied.", "success");
      setPromoInput("");
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try MAYSHA10");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);

    setTimeout(() => {
      const generatedId = `MAY-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 1200);
  };

  if (orderComplete) {
    return (
      <div className="bg-[#FBF9F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full bg-[#FFFFFF] border border-[#E8E3DA] p-8 sm:p-10 rounded-xs shadow-sm text-center">
          <div className="w-16 h-16 bg-[#EDF3E8] text-[#4E5942] rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-[14px] uppercase tracking-wider font-semibold text-[#4E5942] block mb-1">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
            Thank you for your order!
          </h1>
          <p className="text-[15px] text-[#4A4640] mb-4">
            Order Reference: <span className="font-mono font-bold text-[#1A1A1A]">{orderId}</span>
          </p>
          <p className="text-[15px] text-[#5A5650] leading-relaxed mb-8 font-normal">
            We are preparing your botanical skincare formulations with utmost care. A confirmation email has been dispatched to {formData.email}.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#333333] text-white text-[15px] uppercase tracking-wider font-semibold px-8 py-4 rounded-2xs transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#FBF9F5] min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#736E67] mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-[15px] text-[#736E67] max-w-sm mb-6 font-normal">
          Your personal skincare ritual awaits. Explore our barrier cleansers, active serums, and nourishing creams.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#333333] text-white text-[15px] uppercase tracking-wider font-semibold px-8 py-3.5 rounded-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-8 lg:py-12 border-b border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#1A1A1A] mb-8 pb-4 border-b border-[#E8E3DA]">
          Review Cart & Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Cart Items & Delivery Address Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Free Shipping Alert Bar */}
            <div className="p-4 bg-[#F6F3EC] border border-[#E8E3DA] rounded-xs">
              {remainingForFreeShipping > 0 ? (
                <p className="text-[15px] text-[#4A4640] mb-2 font-normal">
                  Add <span className="font-semibold text-[#1A1A1A]">₹{remainingForFreeShipping}</span> more to receive <span className="font-semibold text-[#4E5942]">FREE Standard Shipping</span>
                </p>
              ) : (
                <p className="text-[15px] font-semibold text-[#4E5942] mb-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Your order qualifies for FREE Standard Shipping!
                </p>
              )}
              <div className="w-full h-2 bg-[#E8E3DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4E5942] transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 divide-y divide-[#F0ECE4]">
              {items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                  <div className="w-20 h-20 relative bg-[#EFECE4] rounded-2xs overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="text-[18px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#736E67] hover:text-[#A94438] p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[15px] text-[#736E67] mt-0.5 font-normal">Size: {item.size}</p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#E8E3DA] rounded-2xs bg-[#FBF9F5]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-[#4A4640] hover:text-[#1A1A1A]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[15px] font-semibold px-3 text-[#1A1A1A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-[#4A4640] hover:text-[#1A1A1A]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[18px] font-bold text-[#1A1A1A]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address Section */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-[#F0ECE4]">
                Shipping Address
              </h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                    Email Address (for invoice)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-4 border-t border-[#F0ECE4]">
                  <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-2.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2.5 p-3.5 border border-[#1A1A1A] bg-[#FBF9F5] rounded-xs cursor-pointer text-[15px] font-medium text-[#1A1A1A]">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={formData.paymentMethod === "razorpay"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "razorpay" })}
                        className="text-[#4E5942] focus:ring-0"
                      />
                      <span>UPI / Cards / NetBanking (Razorpay)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3.5 border border-[#E8E3DA] hover:border-[#1A1A1A] bg-[#FFFFFF] rounded-xs cursor-pointer text-[15px] font-medium text-[#1A1A1A]">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                        className="text-[#4E5942] focus:ring-0"
                      />
                      <span>Cash on Delivery (COD)</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 sticky top-28 space-y-6">
            <h2 className="text-xl font-semibold text-[#1A1A1A] pb-3 border-b border-[#E8E3DA]">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between p-3.5 bg-[#EDF3E8] border border-[#C5D7BD] rounded-xs text-[15px] text-[#3E4534]">
                  <span className="flex items-center gap-2 font-semibold">
                    <Tag className="w-4 h-4 text-[#4E5942]" />
                    Coupon &lsquo;{couponCode}&rsquo; Applied (-₹{couponDiscount})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-[#736E67] hover:text-[#A94438] underline text-[14px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Coupon Code (e.g. MAYSHA10)"
                      className="flex-1 bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs uppercase placeholder-[#736E67] focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                    <button
                      type="submit"
                      className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-4 py-2.5 text-[15px] font-semibold rounded-2xs transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[14px] text-[#A94438]">{promoError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-[15px] text-[#4A4640] pt-2">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-[#1A1A1A]">₹{subtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#4E5942] font-semibold">
                  <span>Promo Discount (10%)</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Delivery</span>
                <span>
                  {remainingForFreeShipping === 0 ? (
                    <span className="font-semibold text-[#4E5942]">FREE</span>
                  ) : (
                    "₹99"
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[18px] font-bold text-[#1A1A1A] pt-3 border-t border-[#E8E3DA]">
                <span>Total Amount</span>
                <span>₹{total + (remainingForFreeShipping === 0 ? 0 : 99)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isCheckingOut}
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-[#FBF9F5] py-4 px-6 text-[16px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm active:scale-[0.99] disabled:opacity-75"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order • ₹{total + (remainingForFreeShipping === 0 ? 0 : 99)}</span>
                </>
              )}
            </button>

            <div className="pt-2 text-[14px] text-center text-[#736E67] space-y-1 font-normal">
              <p className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4E5942]" /> 256-Bit Encrypted Secure Checkout
              </p>
              <p>Free returns within 14 days of delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
