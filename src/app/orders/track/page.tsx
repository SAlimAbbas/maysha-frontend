"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { apiBffFetch, formatINR } from "@/lib/api";
import { Order } from "@/types";

export default function TrackOrderPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() || !email.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setOrder(null);

    try {
      const cleanRef = reference.trim();
      const cleanEmail = email.trim();
      const res = await apiBffFetch<Order>(
        `orders/${cleanRef}?email=${encodeURIComponent(cleanEmail)}`,
      );
      setOrder(res.data);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          "No order was found matching that reference number and email address.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "pending_payment":
        return 0;
      case "paid":
      case "processing":
        return 1;
      case "shipped":
      case "in_transit":
        return 2;
      case "out_for_delivery":
        return 2.5;
      case "delivered":
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10 lg:py-16 border-b border-[#E8E3DA]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-[13px] uppercase tracking-wider font-semibold text-[#4E5942] block mb-2">
            Order Tracking
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1A1A1A] mb-3">
            Track Your Delivery
          </h1>
          <p className="text-[15px] text-[#736E67] max-w-lg mx-auto">
            Enter your order reference code (found in your confirmation email)
            and the email address used during purchase.
          </p>
        </div>

        {/* Tracking Lookup Card */}
        <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-6 sm:p-8 rounded-xs shadow-xs mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                  Order Reference Code
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. MAY-928172"
                  required
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs uppercase placeholder-normal focus:outline-hidden focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                  Order Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@example.com"
                  required
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-3 px-6 text-[14px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Looking up Order...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#9B1C1C] shrink-0 mt-0.5" />
              <p className="text-[14px] text-[#9B1C1C]">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Order Status Display */}
        {order && (
          <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 sm:p-8 space-y-8 animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E3DA] gap-4">
              <div>
                <span className="text-[13px] uppercase tracking-wider text-[#736E67] font-medium">
                  Order Reference
                </span>
                <h2 className="text-xl font-bold font-mono text-[#1A1A1A]">
                  {order.reference}
                </h2>
                <p className="text-[14px] text-[#736E67] mt-0.5">
                  Ordered on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[13px] uppercase tracking-wider text-[#736E67] font-medium block">
                  Current Status
                </span>
                <span className="inline-block mt-1 px-3 py-1 bg-[#EDF3E8] text-[#3E4534] border border-[#C5D7BD] rounded-full text-[13px] font-semibold uppercase">
                  {order.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* NDR Alert if delivery attempt failed */}
            {order.status === "ndr" && (
              <div className="p-4 bg-[#FFF4E5] border border-[#FFE2B8] rounded-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#B76E00] shrink-0 mt-0.5" />
                <div className="text-xs text-[#7A4B00] leading-relaxed">
                  <span className="font-semibold text-[#B76E00] block text-[13px] mb-0.5">Delivery Attempt Failed</span>
                  {order.shipment?.ndr_reason || "Courier reported customer unavailable. A re-attempt is being scheduled."}
                </div>
              </div>
            )}

            {/* Step-by-Step Progress Bar */}
            <div>
              <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-4">
                Fulfillment Timeline
              </h3>
              <div className="grid grid-cols-4 relative text-center">
                {/* Horizontal line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#E8E3DA] -z-0" />
                <div
                  className="absolute top-4 left-6 h-0.5 bg-[#4E5942] -z-0 transition-all duration-500"
                  style={{ width: `${(currentStep / 3) * 80}%` }}
                />

                {/* Steps */}
                {[
                  { label: "Order Received", icon: Clock },
                  { label: "Formulated & Packed", icon: Package },
                  { label: "In Transit", icon: Truck },
                  { label: "Delivered", icon: CheckCircle2 },
                ].map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = currentStep >= idx;
                  const isCurrent = currentStep === idx;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isDone
                            ? "bg-[#4E5942] text-white"
                            : "bg-[#FFFFFF] border-2 border-[#E8E3DA] text-[#736E67]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[12px] sm:text-[13px] mt-2 font-medium ${
                          isCurrent
                            ? "text-[#1A1A1A] font-semibold"
                            : "text-[#736E67]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Carrier Checkpoints & Waybill Details */}
            {(order.shipment || (order.tracking && order.tracking.trackingNo)) && (
              <div className="p-4 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8E3DA]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#736E67] font-semibold block">
                      Courier Partner
                    </span>
                    <span className="font-semibold text-sm text-[#1A1A1A]">
                      {order.shipment?.courier_name || order.tracking?.courier || "Express Carrier"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#736E67] font-semibold block sm:text-right">
                      AWB Waybill
                    </span>
                    <span className="font-mono font-bold text-sm text-[#1A1A1A]">
                      {order.shipment?.awb_code || order.tracking?.trackingNo}
                    </span>
                  </div>
                </div>

                {order.shipment?.events && order.shipment.events.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#736E67] font-semibold block">
                      Tracking Checkpoints
                    </span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {order.shipment.events.map((evt, i) => (
                        <div key={i} className="flex items-start justify-between text-xs py-1 border-b border-[#F0ECE4] last:border-0">
                          <div>
                            <span className="font-semibold text-[#1A1A1A] block">{evt.activity || evt.status}</span>
                            {evt.location && <span className="text-[#736E67] text-[11px]">{evt.location}</span>}
                          </div>
                          <span className="text-[11px] text-[#A69F93] shrink-0 font-mono">
                            {new Date(evt.occurred_at || evt.occurredAt || evt.created_at || Date.now()).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#E8E3DA]">
              <div>
                <h4 className="text-[14px] font-semibold text-[#1A1A1A] mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#4E5942]" /> Shipping
                  Destination
                </h4>
                <div className="text-[14px] text-[#5A5650] leading-relaxed">
                  <p className="font-semibold text-[#1A1A1A]">
                    {order.shippingAddress.name}
                  </p>
                  <p>{order.shippingAddress.line1}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[14px] font-semibold text-[#1A1A1A] mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#4E5942]" /> Order
                  Summary
                </h4>
                <div className="text-[14px] text-[#5A5650] space-y-1">
                  <p>Items: {order.items.length} item(s)</p>
                  <p>
                    Payment:{" "}
                    {order.paymentMethod === "razorpay"
                      ? "Online (Razorpay)"
                      : "Cash on Delivery"}
                  </p>
                  <p className="font-semibold text-[#1A1A1A] pt-1">
                    Total: {formatINR(order.total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Items snippet */}
            <div className="pt-4 border-t border-[#F0ECE4]">
              <div className="divide-y divide-[#F0ECE4]">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between text-[14px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative bg-[#EFECE4] rounded-2xs overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <span className="font-medium text-[#1A1A1A]">
                          {item.productName}
                        </span>
                        <span className="text-[#736E67] text-[13px] block">
                          Size: {item.size} • Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold text-[#1A1A1A]">
                      {formatINR(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Back link */}
            <div className="pt-2 text-center">
              <Link
                href={`/orders/${order.reference}`}
                className="inline-flex items-center gap-1.5 text-[14px] text-[#4E5942] hover:text-[#1A1A1A] font-semibold underline"
              >
                <span>View Full Order Confirmation Receipt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
