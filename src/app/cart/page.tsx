"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Check,
  Lock,
  ArrowLeft,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/uiStore";
import { formatINR, apiBffFetch, ApiClientError, mapDottedErrors } from "@/lib/api";
import { Order, RazorpayOrder } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

const checkoutSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  line1: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  paymentMethod: z.enum(["razorpay", "cod"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addToast } = useUIStore();
  const {
    cart,
    isLoading: isCartLoading,
    storeInfo,
    freeShippingRemaining,
    freeShippingProgress,
    threshold,
    updateQuantity,
    isUpdating,
    removeItem,
    isRemoving,
    applyCoupon,
    isApplyingCoupon,
    removeCoupon,
    isRemovingCoupon,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [pincodeStatus, setPincodeStatus] = useState<{
    loading: boolean;
    checked: boolean;
    serviceable?: boolean;
    city?: string;
    state?: string;
    codAvailable?: boolean;
    estimatedDays?: number;
    message?: string;
  }>({ loading: false, checked: false });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "razorpay",
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");
  const watchedPincode = watch("pincode");

  // Live Pincode lookup and auto-fill city/state
  useEffect(() => {
    if (/^[1-9]\d{5}$/.test(watchedPincode)) {
      let isMounted = true;
      setPincodeStatus((prev) => ({ ...prev, loading: true }));
      apiBffFetch<{
        serviceable: boolean;
        city?: string | null;
        state?: string | null;
        codAvailable?: boolean;
        estimatedDays?: number;
      }>(`shipping/pincode/${watchedPincode}`)
        .then((res) => {
          if (!isMounted) return;
          const data = res.data;
          setPincodeStatus({
            loading: false,
            checked: true,
            serviceable: data.serviceable,
            city: data.city || undefined,
            state: data.state || undefined,
            codAvailable: data.codAvailable,
            estimatedDays: data.estimatedDays,
          });
          if (data.serviceable) {
            if (data.city && !getValues("city")) setValue("city", data.city);
            if (data.state && !getValues("state")) setValue("state", data.state);
          }
        })
        .catch(() => {
          if (!isMounted) return;
          setPincodeStatus({
            loading: false,
            checked: true,
            serviceable: false,
            message: "Unable to verify pincode.",
          });
        });
      return () => {
        isMounted = false;
      };
    } else {
      setPincodeStatus({ loading: false, checked: false });
    }
  }, [watchedPincode, setValue, getValues]);

  // COD availability calculation
  const codMax = storeInfo?.codMaxRupees ?? 5000;
  const isCodGloballyDisabled = storeInfo?.codEnabled === false;
  const isCodAboveLimit = cart.total > codMax;
  const isCodPincodeDisabled = pincodeStatus.checked && pincodeStatus.codAvailable === false;
  const isCodDisabled = isCodGloballyDisabled || isCodAboveLimit || isCodPincodeDisabled;
  const codDisableReason = isCodGloballyDisabled
    ? "Cash on Delivery is temporarily disabled."
    : isCodAboveLimit
    ? `COD available up to ₹${codMax.toLocaleString("en-IN")} only. Total exceeds limit.`
    : isCodPincodeDisabled
    ? "Cash on Delivery is unavailable at this pincode (Prepaid only)."
    : null;

  // Auto-revert to online payment if COD becomes disabled
  useEffect(() => {
    if (isCodDisabled && selectedPaymentMethod === "cod") {
      setValue("paymentMethod", "razorpay");
    }
  }, [isCodDisabled, selectedPaymentMethod, setValue]);

  // Autofill user details when authenticated
  useEffect(() => {
    if (user) {
      if (user.name) setValue("name", user.name);
      if (user.email) setValue("email", user.email);
      if (user.phone) setValue("phone", user.phone);
    }
  }, [user, setValue]);

  // Handle promo code application
  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoError("");

    try {
      const res = await applyCoupon(promoInput.trim().toUpperCase());
      addToast("Coupon Applied", res.message || "Discount applied successfully", "success");
      setPromoInput("");
    } catch (err: any) {
      setPromoError(err.message || "Invalid, expired, or inapplicable coupon code.");
    }
  };

  const handleRemovePromo = async () => {
    try {
      await removeCoupon();
      addToast("Coupon Removed", "Coupon has been removed from your cart", "info");
    } catch (err: any) {
      addToast("Error", err.message || "Failed to remove coupon", "error");
    }
  };

  // Checkout submission
  const onSubmit = async (values: CheckoutFormValues) => {
    if (!cart.items || cart.items.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    // Save guest email to sessionStorage for order confirmation lookup
    try {
      sessionStorage.setItem("maysha_order_email", values.email);
    } catch {}

    // Compute idempotency key
    const payloadSignature = JSON.stringify({
      items: cart.items.map((i) => ({ v: i.variantId, q: i.quantity })),
      email: values.email,
      addr: values.line1,
      pin: values.pincode,
      coupon: cart.couponCode,
      pay: values.paymentMethod,
    });

    let idempotencyKey = "";
    try {
      const stored = sessionStorage.getItem("maysha_idempotency");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.signature === payloadSignature && parsed.key) {
          idempotencyKey = parsed.key;
        }
      }
    } catch {}

    if (!idempotencyKey) {
      idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      try {
        sessionStorage.setItem(
          "maysha_idempotency",
          JSON.stringify({ key: idempotencyKey, signature: payloadSignature })
        );
      } catch {}
    }

    try {
      // 1. Create order on server
      const orderRes = await apiBffFetch<Order>("orders", {
        method: "POST",
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            variant_id: item.variantId,
            quantity: item.quantity,
          })),
          shipping_address: {
            name: values.name,
            phone: values.phone,
            line1: values.line1,
            city: values.city,
            state: values.state,
            pincode: values.pincode,
          },
          payment_method: values.paymentMethod,
          coupon_code: cart.couponCode || undefined,
          guest_email: values.email,
        }),
      });

      const order = orderRes.data;

      // 2. If COD, order is immediately confirmed
      if (values.paymentMethod === "cod") {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        router.push(`/orders/${order.reference}`);
        return;
      }

      // 3. Razorpay flow
      const rzpRes = await apiBffFetch<RazorpayOrder>("payments/razorpay/create-order", {
        method: "POST",
        body: JSON.stringify({ order_reference: order.reference }),
      });

      const rzpData = rzpRes.data;
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Unable to initialize payment gateway. Please check your network and retry.");
      }

      const options = {
        key: rzpData.keyId,
        amount: rzpData.amountPaise,
        currency: rzpData.currency || "INR",
        name: "Maysha Skincare",
        description: `Order ${order.reference}`,
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: rzpData.customerName || values.name,
          email: rzpData.customerEmail || values.email,
          contact: rzpData.customerPhone || values.phone,
        },
        theme: {
          color: "#1A1A1A",
        },
        handler: async function (response: any) {
          try {
            await apiBffFetch("payments/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            router.push(`/orders/${order.reference}`);
          } catch (verifyErr: any) {
            setCheckoutError(
              verifyErr.message || "Payment verification encountered an issue. Please contact support."
            );
            setIsCheckingOut(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsCheckingOut(false);
            setCheckoutError(
              "Payment window closed. Your items and order draft are reserved; please click Place Order again to complete payment."
            );
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", function (failResponse: any) {
        setIsCheckingOut(false);
        setCheckoutError(
          failResponse.error?.description || "Payment failed. Please try with another card, UPI, or select COD."
        );
      });
      razorpayInstance.open();
    } catch (err: any) {
      setIsCheckingOut(false);
      if (err instanceof ApiClientError && err.errors) {
        const mapped = mapDottedErrors(err.errors);
        for (const [key, msg] of Object.entries(mapped)) {
          if (["name", "email", "phone", "line1", "city", "state", "pincode"].includes(key)) {
            setError(key as keyof CheckoutFormValues, { message: msg });
          }
        }
      }
      setCheckoutError(
        err.message || "An error occurred while creating your order. Please review your details and retry."
      );
    }
  };

  if (isCartLoading && cart.items.length === 0) {
    return (
      <div className="bg-[#FBF9F5] min-h-[60vh] flex items-center justify-center py-20 px-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#4E5942] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[15px] text-[#736E67]">Loading your botanical bag...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="bg-[#FBF9F5] min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#736E67] mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-[15px] text-[#736E67] max-w-sm mb-6 font-normal">
          Your personal skincare ritual awaits. Explore our barrier cleansers, active serums, and nourishing toners.
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

        {/* Global Cart Warnings if server returned stock adjustments */}
        {cart.warnings && cart.warnings.length > 0 && (
          <div className="mb-6 p-4 bg-[#FFF8EB] border border-[#F2DEB5] rounded-xs space-y-1">
            {cart.warnings.map((warning, idx) => (
              <p key={idx} className="text-[14px] text-[#8C6D1F] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {warning}
              </p>
            ))}
          </div>
        )}

        {/* Checkout Error Message */}
        {checkoutError && (
          <div className="mb-6 p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#9B1C1C] shrink-0 mt-0.5" />
            <div className="text-[14px] text-[#9B1C1C] flex-1">
              <p className="font-semibold mb-0.5">Checkout Notice</p>
              <p>{checkoutError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Cart Items & Delivery Address Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Free Shipping Alert Bar */}
            <div className="p-4 bg-[#F6F3EC] border border-[#E8E3DA] rounded-xs">
              {freeShippingRemaining > 0 ? (
                <p className="text-[15px] text-[#4A4640] mb-2 font-normal">
                  Add <span className="font-semibold text-[#1A1A1A]">₹{freeShippingRemaining}</span> more to receive{" "}
                  <span className="font-semibold text-[#4E5942]">FREE Standard Shipping</span>
                </p>
              ) : (
                <p className="text-[15px] font-semibold text-[#4E5942] mb-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Your order qualifies for FREE Standard Shipping!
                </p>
              )}
              <div className="w-full h-2 bg-[#E8E3DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4E5942] transition-all duration-500 ease-out"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 divide-y divide-[#F0ECE4]">
              {cart.items.map((item) => (
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
                        disabled={isRemoving}
                        className="text-[#736E67] hover:text-[#A94438] p-1 transition-colors disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[15px] text-[#736E67] mt-0.5 font-normal">Size: {item.size}</p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#E8E3DA] rounded-2xs bg-[#FBF9F5]">
                        <button
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity - 1 })}
                          disabled={isUpdating}
                          className="p-2 text-[#4A4640] hover:text-[#1A1A1A] disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[15px] font-semibold px-3 text-[#1A1A1A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                          disabled={isUpdating || item.quantity >= Math.min(10, item.stock)}
                          className="p-2 text-[#4A4640] hover:text-[#1A1A1A] disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[18px] font-bold text-[#1A1A1A]">
                        {formatINR(item.price * item.quantity)}
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
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Priyanshu Mehta"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                    {errors.name && (
                      <p className="text-[13px] text-[#A94438] mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      placeholder="10-digit mobile number"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                    {errors.phone && (
                      <p className="text-[13px] text-[#A94438] mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                    Email Address (for order confirmation & invoice)
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="e.g. client@example.com"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                  {errors.email && (
                    <p className="text-[13px] text-[#A94438] mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                    Street Address (Flat / House / Road)
                  </label>
                  <input
                    type="text"
                    {...register("line1")}
                    placeholder="House / Flat no, Building name, Street"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                  {errors.line1 && (
                    <p className="text-[13px] text-[#A94438] mt-1">{errors.line1.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                    {errors.city && (
                      <p className="text-[13px] text-[#A94438] mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      {...register("state")}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                    {errors.state && (
                      <p className="text-[13px] text-[#A94438] mt-1">{errors.state.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-1.5">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      {...register("pincode")}
                      placeholder="6 digits"
                      maxLength={6}
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                    {errors.pincode && (
                      <p className="text-[13px] text-[#A94438] mt-1">{errors.pincode.message}</p>
                    )}
                    {pincodeStatus.loading && (
                      <p className="text-[12px] text-[#736E67] mt-1 flex items-center gap-1">
                        <span className="w-3 h-3 border border-[#4E5942] border-t-transparent rounded-full animate-spin inline-block" />
                        Verifying courier serviceability...
                      </p>
                    )}
                    {pincodeStatus.checked && pincodeStatus.serviceable && (
                      <p className="text-[12px] text-[#4E5942] font-medium mt-1 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Express delivery available ({pincodeStatus.estimatedDays || 3}–{(pincodeStatus.estimatedDays || 3) + 1} days)
                      </p>
                    )}
                    {pincodeStatus.checked && !pincodeStatus.serviceable && (
                      <p className="text-[12px] text-[#A94438] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Pincode not serviceable for courier delivery.
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-4 border-t border-[#F0ECE4]">
                  <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-2.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-2.5 p-3.5 border rounded-xs cursor-pointer text-[15px] font-medium transition-colors ${
                        selectedPaymentMethod === "razorpay"
                          ? "border-[#1A1A1A] bg-[#FBF9F5] text-[#1A1A1A]"
                          : "border-[#E8E3DA] bg-white text-[#4A4640]"
                      }`}
                    >
                      <input
                        type="radio"
                        value="razorpay"
                        {...register("paymentMethod")}
                        className="text-[#4E5942] focus:ring-0"
                      />
                      <span>UPI / Cards / NetBanking (Razorpay)</span>
                    </label>
                    <label
                      className={`flex flex-col p-3.5 border rounded-xs transition-colors ${
                        isCodDisabled
                          ? "border-[#E8E3DA] bg-[#F9F7F2] text-[#9E988F] opacity-75 cursor-not-allowed"
                          : selectedPaymentMethod === "cod"
                          ? "border-[#1A1A1A] bg-[#FBF9F5] text-[#1A1A1A] cursor-pointer"
                          : "border-[#E8E3DA] bg-white text-[#4A4640] cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          value="cod"
                          disabled={isCodDisabled}
                          {...register("paymentMethod")}
                          className="text-[#4E5942] focus:ring-0 disabled:opacity-50"
                        />
                        <span className="text-[15px] font-medium">Cash on Delivery (COD)</span>
                      </div>
                      {codDisableReason && (
                        <p className="text-[11px] text-[#8C6D1F] mt-1.5 pl-6 font-normal">
                          {codDisableReason}
                        </p>
                      )}
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
              {cart.couponCode ? (
                <div className="flex items-center justify-between p-3.5 bg-[#EDF3E8] border border-[#C5D7BD] rounded-xs text-[15px] text-[#3E4534]">
                  <span className="flex items-center gap-2 font-semibold">
                    <Tag className="w-4 h-4 text-[#4E5942]" />
                    Coupon &lsquo;{cart.couponCode}&rsquo; Applied (-{formatINR(cart.discountPaise, true)})
                  </span>
                  <button
                    onClick={handleRemovePromo}
                    disabled={isRemovingCoupon}
                    className="text-[#736E67] hover:text-[#A94438] underline text-[14px] disabled:opacity-50"
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
                      disabled={isApplyingCoupon}
                      className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-4 py-2.5 text-[15px] font-semibold rounded-2xs transition-colors shrink-0 disabled:opacity-50"
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[14px] text-[#A94438]">{promoError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Price Breakdown from server exact paise fields */}
            <div className="space-y-3 text-[15px] text-[#4A4640] pt-2">
              <div className="flex justify-between">
                <span>Subtotal ({cart.itemCount} items)</span>
                <span className="font-semibold text-[#1A1A1A]">{formatINR(cart.subtotalPaise, true)}</span>
              </div>
              {cart.discountPaise > 0 && (
                <div className="flex justify-between text-[#4E5942] font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatINR(cart.discountPaise, true)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Delivery</span>
                <span>
                  {cart.shippingPaise === 0 ? (
                    <span className="font-semibold text-[#4E5942]">FREE</span>
                  ) : (
                    formatINR(cart.shippingPaise, true)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[13px] text-[#736E67] pt-1">
                <span>Estimated GST Included (18%)</span>
                <span>{formatINR(Math.round((cart.totalPaise * 18) / 118), true)}</span>
              </div>
              <div className="flex justify-between text-[18px] font-bold text-[#1A1A1A] pt-3 border-t border-[#E8E3DA]">
                <span>Total Amount</span>
                <span>{formatINR(cart.totalPaise, true)}</span>
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
                  <span>Place Order • {formatINR(cart.totalPaise, true)}</span>
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
