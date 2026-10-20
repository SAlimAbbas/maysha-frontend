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
  FileText,
  History,
  Truck,
  Printer,
  RefreshCw,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiBffFetch, formatINR } from "@/lib/api";
import { Order, OrderItem, RazorpayOrder } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/uiStore";
import CloudinaryGalleryUploader from "@/components/admin/CloudinaryGalleryUploader";

interface OrderPageProps {
  params: Promise<{ reference: string }>;
}

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

  // Retry payment state
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);

  // Invoice modal state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

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
      if (query.state.data?.status === "pending_payment") {
        return 3000;
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

  const handleRetryPayment = async () => {
    if (!order) return;
    setIsRetryingPayment(true);

    try {
      const rzpRes = await apiBffFetch<RazorpayOrder>("payments/razorpay/create-order", {
        method: "POST",
        body: JSON.stringify({
          order_reference: order.reference,
        }),
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please verify your connection.");
      }

      const rzpData = rzpRes.data;
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amountPaise,
        currency: rzpData.currency,
        name: "Maysha Skincare",
        description: `Order ${order.reference}`,
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: rzpData.customerName,
          email: rzpData.customerEmail,
          contact: rzpData.customerPhone,
        },
        theme: {
          color: "#4E5942",
        },
        handler: async function (response: any) {
          try {
            await apiBffFetch("payments/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                order_reference: order.reference,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            addToast("Payment Verified", "Your payment was captured successfully!", "success");
            refetch();
          } catch (err: any) {
            addToast("Payment Notice", err.message || "Payment verification failed.", "error");
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", function (failResponse: any) {
        addToast("Payment Incomplete", failResponse.error?.description || "Payment failed.", "error");
      });
      razorpayInstance.open();
    } catch (err: any) {
      addToast("Payment Error", err.message || "Could not launch Razorpay checkout.", "error");
    } finally {
      setIsRetryingPayment(false);
    }
  };

  const handleOpenInvoice = async () => {
    setShowInvoiceModal(true);
    if (!invoiceData) {
      setIsLoadingInvoice(true);
      try {
        const queryParam = activeEmail ? `?email=${encodeURIComponent(activeEmail)}` : "";
        const res = await apiBffFetch<any>(`orders/${reference}/invoice${queryParam}`);
        setInvoiceData(res.data);
      } catch (err: any) {
        addToast("Invoice Notice", err.message || "Failed to load tax invoice details.", "error");
      } finally {
        setIsLoadingInvoice(false);
      }
    }
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
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-3 px-4 text-[14px] uppercase tracking-wider font-semibold rounded-2xs transition-colors cursor-pointer"
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
        {/* Success / Status Header Banner */}
        <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 sm:p-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#EDF3E8] text-[#4E5942] rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[13px] uppercase tracking-wider font-semibold text-[#4E5942]">
                  Order Summary
                </span>
                {getStatusBadge(order.status)}
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mt-1">
                {order.status === "pending_payment"
                  ? "Order Placed — Awaiting Payment"
                  : "Thank you for your order!"}
              </h1>
              <p className="text-[14px] text-[#736E67] mt-0.5">
                {order.status === "pending_payment"
                  ? "Stock has been reserved for 30 minutes. Complete payment to confirm fulfillment."
                  : "A confirmation summary and invoice have been generated for this purchase."}
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
                className="text-[#736E67] hover:text-[#1A1A1A] p-1 cursor-pointer"
                aria-label="Copy order reference"
              >
                {copied ? <Check className="w-4 h-4 text-[#4E5942]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Pending Payment Alert & Retry Button */}
        {order.status === "pending_payment" && (
          <div className="mb-8 p-5 bg-[#FFF8EB] border border-[#F2DEB5] rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#8C6D1F] shrink-0 mt-0.5 animate-spin" />
              <div>
                <h4 className="text-[15px] font-semibold text-[#8C6D1F]">Payment Pending</h4>
                <p className="text-[13px] text-[#6B5216] mt-0.5">
                  If your previous payment attempt was interrupted or closed, you can retry checkout now without losing your reserved items.
                </p>
              </div>
            </div>
            <button
              onClick={handleRetryPayment}
              disabled={isRetryingPayment}
              className="bg-[#4E5942] hover:bg-[#3D4733] text-white px-5 py-2.5 rounded-2xs text-[14px] font-semibold tracking-wide uppercase transition-colors shrink-0 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRetryingPayment ? "animate-spin" : ""}`} />
              <span>{isRetryingPayment ? "Launching..." : "Complete Online Payment"}</span>
            </button>
          </div>
        )}

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
                    <span className="font-medium text-[#1A1A1A] capitalize">
                      {order.paymentStatus || order.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Courier Dispatch & Tracking if assigned */}
            {order.tracking && order.tracking.trackingNo && (
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6">
                <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-2.5 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#4E5942]" /> Dispatch & Tracking Details
                </h3>
                <div className="text-[14px] text-[#5A5650] space-y-1">
                  <p>
                    Courier Partner: <span className="font-semibold text-[#1A1A1A]">{order.tracking.courier || "Express Surface Logistics"}</span>
                  </p>
                  <p>
                    Waybill / AWB: <span className="font-mono font-bold text-[#1A1A1A]">{order.tracking.trackingNo}</span>
                  </p>
                  {order.tracking.url && (
                    <div className="pt-2">
                      <a
                        href={order.tracking.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4E5942] hover:underline"
                      >
                        Track Package Live →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Timeline Events */}
            {order.events && order.events.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 space-y-4">
                <h3 className="text-[15px] font-semibold text-[#1A1A1A] flex items-center gap-2 pb-2 border-b border-[#F0ECE4]">
                  <History className="w-4 h-4 text-[#4E5942]" /> Order Activity History
                </h3>
                <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E8E3DA]">
                  {order.events.map((evt, idx) => (
                    <div key={evt.id || idx} className="relative">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#4E5942] border-2 border-white ring-1 ring-[#4E5942]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1A1A1A] text-sm capitalize">
                            {evt.status.replace("_", " ")}
                          </span>
                          <span className="text-[11px] text-[#A69F93]">
                            {new Date(evt.createdAt).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#736E67] mt-0.5">{evt.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing Summary & Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 space-y-6">
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
                <div className="flex justify-between text-[13px] text-[#736E67]">
                  <span>GST Included in Total</span>
                  <span>{formatINR(order.tax ?? Math.round((order.total * 18) / 118))}</span>
                </div>
                <div className="flex justify-between text-[18px] font-bold text-[#1A1A1A] pt-3 border-t border-[#E8E3DA]">
                  <span>Total Paid</span>
                  <span>{formatINR(order.total)}</span>
                </div>
              </div>

              {/* Tax Invoice Badge & Button */}
              <div className="pt-4 border-t border-[#E8E3DA]">
                <div className="flex items-center justify-between gap-2 p-3 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#736E67] font-semibold block">
                      Tax Invoice
                    </span>
                    <span className="font-mono text-xs font-bold text-[#1A1A1A]">
                      {order.invoiceNo || "Invoice on record"}
                    </span>
                  </div>
                  <button
                    onClick={handleOpenInvoice}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xs text-xs font-semibold bg-[#4E5942] hover:bg-[#3D4733] text-white transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Receipt
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8E3DA] space-y-3">
                <Link
                  href="/shop"
                  className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-3.5 px-4 text-[14px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/orders/track"
                  className="w-full bg-[#F5F2EB] hover:bg-[#EFECE4] text-[#1A1A1A] py-3 px-4 text-[14px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors border border-[#E8E3DA] cursor-pointer"
                >
                  <span>Track Order Status</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Tax Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border border-[#E8E3DA] rounded-xs max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E3DA]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#4E5942]" />
                <h3 className="font-serif text-xl font-normal text-[#1A1A1A]">Official Tax Invoice</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1.5 text-[#736E67] hover:text-[#1A1A1A] cursor-pointer"
                  title="Print Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1.5 text-[#736E67] hover:text-[#1A1A1A] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isLoadingInvoice ? (
              <div className="py-12 text-center text-sm text-[#736E67]">
                <div className="w-6 h-6 border-2 border-[#4E5942] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading tax invoice breakdown...
              </div>
            ) : invoiceData ? (
              <div className="space-y-6 text-xs text-[#4A4640]">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1A1A]">Maysha Skincare Technologies Pvt. Ltd.</h4>
                    {invoiceData.gstin && (
                      <p className="font-mono mt-0.5">GSTIN: {invoiceData.gstin}</p>
                    )}
                    {invoiceData.financialYear && (
                      <p className="mt-0.5">FY: {invoiceData.financialYear}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-[#1A1A1A]">
                      Invoice #: {invoiceData.invoiceNo || order.invoiceNo}
                    </p>
                    <p className="mt-1">Order Ref: {invoiceData.orderReference || order.reference}</p>
                    <p className="mt-0.5">Date: {new Date(invoiceData.placedAt || order.createdAt).toLocaleDateString("en-IN")}</p>
                    <p className="mt-0.5 uppercase font-semibold text-[#4E5942]">Status: {invoiceData.status || order.status}</p>
                  </div>
                </div>

                {/* Customer Bill To */}
                <div className="bg-[#FBF9F5] p-3 rounded-2xs border border-[#E8E3DA]">
                  <p className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-[11px] mb-1">Billed & Shipped To:</p>
                  <p className="font-medium text-[#1A1A1A]">{invoiceData.customer?.name || order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p>Email: {invoiceData.customer?.email || activeEmail} • Phone: {invoiceData.customer?.phone || order.shippingAddress.phone}</p>
                </div>

                {/* Items Table */}
                <table className="w-full text-left border-collapse border border-[#E8E3DA]">
                  <thead>
                    <tr className="bg-[#F5F2EB] text-[#1A1A1A] font-semibold border-b border-[#E8E3DA]">
                      <th className="p-2 border-r border-[#E8E3DA]">Item</th>
                      <th className="p-2 border-r border-[#E8E3DA]">HSN</th>
                      <th className="p-2 border-r border-[#E8E3DA]">Qty</th>
                      <th className="p-2 border-r border-[#E8E3DA]">Rate</th>
                      <th className="p-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoiceData.items || order.items).map((item: any, i: number) => (
                      <tr key={i} className="border-b border-[#E8E3DA]">
                        <td className="p-2 border-r border-[#E8E3DA] font-medium text-[#1A1A1A]">
                          {item.name || item.productName} ({item.size})
                        </td>
                        <td className="p-2 border-r border-[#E8E3DA] font-mono text-[11px]">{item.hsn || "330499"}</td>
                        <td className="p-2 border-r border-[#E8E3DA] text-center">{item.quantity}</td>
                        <td className="p-2 border-r border-[#E8E3DA]">{formatINR(item.unitPrice || item.price || 0)}</td>
                        <td className="p-2 text-right font-medium">{formatINR(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pricing Breakdown */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-1.5">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatINR(invoiceData.pricing?.subtotal || order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-[#4E5942]">
                        <span>Discount:</span>
                        <span>-{formatINR(invoiceData.pricing?.discount || order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatINR(invoiceData.pricing?.shipping || order.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-[#736E67]">
                      <span>Tax (Inclusive GST):</span>
                      <span>{formatINR(invoiceData.pricing?.tax || order.tax || Math.round((order.total * 18) / 118))}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-[#1A1A1A] pt-2 border-t border-[#E8E3DA]">
                      <span>Total Paid:</span>
                      <span>{formatINR(invoiceData.pricing?.total || order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#736E67] border-t border-[#E8E3DA] pt-3 text-center">
                  This is a computer-generated tax invoice and requires no physical signature.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

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
                className="text-[#736E67] hover:text-[#1A1A1A] text-lg font-bold cursor-pointer"
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
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
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
                  className="px-4 py-2 text-[14px] font-semibold text-[#736E67] hover:text-[#1A1A1A] cursor-pointer"
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
