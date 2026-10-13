"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Star,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiBffFetch, formatINR } from "@/lib/api";
import { Order, OrderItem } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/uiStore";
import CloudinaryGalleryUploader from "@/components/admin/CloudinaryGalleryUploader";

interface OrderPageProps {
  params: Promise<{ reference: string }>;
}

export default function OrderConfirmationPage({ params }: OrderPageProps) {
  const { reference } = React.use(params);
  const { user } = useAuth();
  const { addToast } = useUIStore();

  const [emailInput, setEmailInput] = useState("");
  const [activeEmail, setActiveEmail] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Review state for delivered order items
  const [reviewingItem, setReviewingItem] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewedItemIds, setReviewedItemIds] = useState<string[]>([]);

  // Retrieve stored guest email from checkout session
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("maysha_order_email");
      if (stored) {
        setActiveEmail(stored);
      } else if (user?.email) {
        setActiveEmail(user.email);
      }
    } catch {}
  }, [user]);

  // Query order details
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Order>({
    queryKey: ["order", reference, activeEmail],
    queryFn: async () => {
      const queryParam = activeEmail ? `?email=${encodeURIComponent(activeEmail)}` : "";
      const res = await apiBffFetch<Order>(`orders/${reference}${queryParam}`);
      return res.data;
    },
    enabled: Boolean(reference),
    retry: 1,
    refetchInterval: (query) => {
      // Poll if pending payment up to a few cycles
      if (query.state.data?.status === "pending_payment") {
        return 2500;
      }
      return false;
    },
  });

  const handleCopyReference = () => {
    if (reference) {
      navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUnlockWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setActiveEmail(emailInput.trim());
    try {
      sessionStorage.setItem("maysha_order_email", emailInput.trim());
    } catch {}
  };

  const handleSubmitItemReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingItem || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      await apiBffFetch("reviews", {
        method: "POST",
        body: JSON.stringify({
          product_id: reviewingItem.productId || undefined,
          product_slug: reviewingItem.productSlug,
          rating,
          title: reviewTitle.trim() || undefined,
          comment: reviewComment.trim(),
          images: reviewImages,
        }),
      });

      addToast("Review Submitted", "Thank you! Your verified review has been submitted.", "success");
      setReviewedItemIds((prev) => [...prev, reviewingItem.id]);
      setReviewingItem(null);
      setReviewComment("");
      setReviewTitle("");
      setReviewImages([]);
    } catch (err: any) {
      addToast("Review Notice", err.message || "Failed to submit review.", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-[#EDF3E8] text-[#3E4534] border border-[#C5D7BD]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4E5942]" /> Confirmed & Processing
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-[#E8F0FE] text-[#1967D2] border border-[#AECBFA]">
            <Package className="w-3.5 h-3.5" /> Dispatched / In Transit
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-[#EDF3E8] text-[#3E4534] border border-[#C5D7BD]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4E5942]" /> Delivered
          </span>
        );
      case "pending_payment":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-[#FFF8EB] text-[#8C6D1F] border border-[#F2DEB5]">
            <Clock className="w-3.5 h-3.5 animate-spin" /> Awaiting Payment Confirmation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-[#F5F2EB] text-[#736E67] border border-[#E8E3DA]">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#FBF9F5] min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#4E5942] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[15px] text-[#736E67]">Fetching order verification details...</p>
        </div>
      </div>
    );
  }

  // If email was required or order is not directly unlocked
  if (isError || !order) {
    return (
      <div className="bg-[#FBF9F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E8E3DA] p-8 rounded-xs shadow-sm text-center">
          <div className="w-12 h-12 bg-[#F5F2EB] text-[#4E5942] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Order Access Verification</h1>
          <p className="text-[14px] text-[#736E67] mb-6">
            For security, please verify the email address provided when ordering reference{" "}
            <span className="font-mono font-semibold text-[#1A1A1A]">{reference}</span>.
          </p>

          <form onSubmit={handleUnlockWithEmail} className="space-y-4">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your order email address"
              required
              className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
            />
            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-3 px-4 text-[14px] uppercase tracking-wider font-semibold rounded-2xs transition-colors"
            >
              Verify & View Receipt
            </button>
          </form>

          {isError && (
            <p className="text-[13px] text-[#A94438] mt-4 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Unable to locate this order with that email. Please check your spelling.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-8 lg:py-12 border-b border-[#E8E3DA]">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header Banner */}
        <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 sm:p-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#EDF3E8] text-[#4E5942] rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[13px] uppercase tracking-wider font-semibold text-[#4E5942]">
                  Order Placed Successfully
                </span>
                {getStatusBadge(order.status)}
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mt-1">
                Thank you for your order!
              </h1>
              <p className="text-[14px] text-[#736E67] mt-0.5">
                A confirmation summary has been logged for this purchase.
              </p>
            </div>
          </div>

          <div className="bg-[#FBF9F5] border border-[#E8E3DA] px-4 py-3 rounded-2xs text-center shrink-0">
            <span className="text-[12px] uppercase tracking-wider text-[#736E67] font-semibold block">
              Reference Code
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono font-bold text-[#1A1A1A] text-[16px]">{order.reference}</span>
              <button
                onClick={handleCopyReference}
                className="text-[#736E67] hover:text-[#1A1A1A] p-1"
                aria-label="Copy order reference"
              >
                {copied ? <Check className="w-4 h-4 text-[#4E5942]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Order Details & Items */}
          <div className="lg:col-span-8 space-y-6">
            {/* Products List */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6">
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-[#F0ECE4] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#4E5942]" /> Items In This Order
              </h2>

              <div className="divide-y divide-[#F0ECE4]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-16 h-16 relative bg-[#EFECE4] rounded-2xs overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="text-[16px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] transition-colors"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-[14px] text-[#736E67] mt-0.5">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>

                      {/* Review option for delivered orders */}
                      {order.status === "delivered" && (
                        <div className="mt-2.5">
                          {reviewedItemIds.includes(item.id) ? (
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#3E4534] bg-[#EDF3E8] px-2.5 py-1 rounded-full border border-[#C5D7BD]">
                              <Check className="w-3.5 h-3.5 text-[#4E5942]" /> Review Submitted
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setReviewingItem(item);
                                setRating(5);
                                setReviewTitle("");
                                setReviewComment("");
                                setReviewImages([]);
                              }}
                              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1A1A1A] hover:text-[#4E5942] bg-[#F5F2EB] hover:bg-[#EFECE4] px-3 py-1.5 rounded-2xs border border-[#E8E3DA] transition-colors cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 text-[#D4A373] fill-current" />
                              <span>Review This Product</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[16px] font-bold text-[#1A1A1A]">
                        {formatINR(item.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6">
                <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#4E5942]" /> Delivery Address
                </h3>
                <div className="text-[14px] text-[#5A5650] space-y-1">
                  <p className="font-semibold text-[#1A1A1A]">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.pincode}
                  </p>
                  <p className="pt-1 text-[#736E67]">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6">
                <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#4E5942]" /> Payment Information
                </h3>
                <div className="text-[14px] text-[#5A5650] space-y-2">
                  <div>
                    <span className="text-[#736E67] block text-[13px]">Payment Method:</span>
                    <span className="font-semibold text-[#1A1A1A] uppercase">
                      {order.paymentMethod === "razorpay" ? "Online Payment (Razorpay)" : "Cash on Delivery"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#736E67] block text-[13px]">Payment Status:</span>
                    <span className="font-medium text-[#1A1A1A] capitalize">{order.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Summary & Actions */}
          <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 space-y-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A] pb-3 border-b border-[#E8E3DA]">
              Receipt Summary
            </h2>

            <div className="space-y-3 text-[15px] text-[#4A4640]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1A1A1A]">{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#4E5942] font-semibold">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span>-{formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>
                  {order.shipping === 0 ? (
                    <span className="font-semibold text-[#4E5942]">FREE</span>
                  ) : (
                    formatINR(order.shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[18px] font-bold text-[#1A1A1A] pt-3 border-t border-[#E8E3DA]">
                <span>Total Paid</span>
                <span>{formatINR(order.total)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E3DA] space-y-3">
              <Link
                href="/shop"
                className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-3.5 px-4 text-[14px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/orders/track"
                className="w-full bg-[#F5F2EB] hover:bg-[#EFECE4] text-[#1A1A1A] py-3 px-4 text-[14px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors border border-[#E8E3DA]"
              >
                <span>Track Order Status</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delivered Product Review Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-6 sm:p-8 rounded-xs max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4E5942] block">
                  Verified Order Review
                </span>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mt-0.5">
                  {reviewingItem.productName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingItem(null)}
                className="text-[#736E67] hover:text-[#1A1A1A] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitItemReview} className="space-y-4">
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1.5">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? "fill-[#D4A373] text-[#D4A373]"
                            : "text-[#E8E3DA]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1.5">
                  Headline (Optional)
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Skin felt hydrated and calm within days"
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-none focus:border-[#4E5942]"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1.5">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe your skin experience with this botanical formula..."
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-3 rounded-2xs focus:outline-none focus:border-[#4E5942]"
                />
              </div>

              <div className="pt-2 border-t border-[#F0ECE4]">
                <CloudinaryGalleryUploader
                  images={reviewImages}
                  onChange={setReviewImages}
                  folder="maysha/reviews"
                  maxImages={3}
                  label="Attach Photos (Optional - Results, Texture, Packaging)"
                />
              </div>

              <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReviewingItem(null)}
                  className="px-4 py-2 text-[14px] font-semibold text-[#736E67] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-6 py-2.5 rounded-2xs text-[14px] font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
