"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Package,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Send,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/uiStore";
import { apiBffFetch, formatINR } from "@/lib/api";

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout, refetchUser } = useAuth();
  const { addToast } = useUIStore();

  // Profile Edit State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Resend Verification State
  const [isResendingVerify, setIsResendingVerify] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Track order fast input
  const [trackRef, setTrackRef] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Sync state when user loads
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");

      setLoadingOrders(true);
      apiBffFetch<any>("account/orders")
        .then((res) => {
          if (res?.data && Array.isArray(res.data)) {
            setOrders(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login?next=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="bg-[#FBF9F5] min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#4E5942] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[15px] text-[#736E67]">Loading your account profile...</p>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccess(false);

    try {
      await apiBffFetch("auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || undefined,
        }),
      });
      await refetchUser();
      setProfileSuccess(true);
      addToast("Profile Updated", "Your account details have been saved.", "success");
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      addToast("Error", err.message || "Failed to update profile.", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 10 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setPasswordError("New password must be at least 10 characters long with letters and numbers.");
      return;
    }

    setIsChangingPassword(true);

    try {
      await apiBffFetch("auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      addToast("Password Changed", "Your password was updated successfully.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password. Verify your current password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResendingVerify(true);
    setResendStatus(null);

    try {
      await apiBffFetch("auth/resend-verification", { method: "POST" });
      setResendStatus("A fresh verification link has been dispatched to your email address.");
      addToast("Verification Sent", "Please check your inbox.", "success");
    } catch (err: any) {
      setResendStatus(err.message || "Rate limit reached. Please wait a few minutes before resending.");
    } finally {
      setIsResendingVerify(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10 lg:py-16 border-b border-[#E8E3DA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Strip */}
        <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#EFECE4] text-[#4E5942] flex items-center justify-center font-bold text-2xl uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold text-[#1A1A1A]">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#EDF3E8] text-[#3E4534] border border-[#C5D7BD] capitalize">
                  {user.role}
                </span>
              </div>
              <p className="text-[14px] text-[#736E67] mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-[#F5F2EB] hover:bg-[#EFECE4] text-[#1A1A1A] border border-[#E8E3DA] px-4 py-2.5 rounded-2xs text-[14px] font-semibold transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4 text-[#736E67]" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Unverified Email Warning Banner */}
        {!user.emailVerified && (
          <div className="p-5 bg-[#FFF8EB] border border-[#F2DEB5] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#8C6D1F] shrink-0 mt-0.5" />
              <div>
                <p className="text-[15px] font-semibold text-[#8C6D1F]">
                  Your email address is unverified
                </p>
                <p className="text-[13px] text-[#8C6D1F]/90 mt-0.5">
                  Verify your email to write product reviews and secure your botanical order history.
                </p>
                {resendStatus && (
                  <p className="text-[13px] text-[#4E5942] font-semibold mt-1">
                    {resendStatus}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleResendVerification}
              disabled={isResendingVerify}
              className="inline-flex items-center gap-2 bg-[#8C6D1F] hover:bg-[#735919] text-white px-4 py-2 rounded-2xs text-[13px] font-semibold tracking-wide shrink-0 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isResendingVerify ? "Sending..." : "Resend Verification"}</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Personal Information & Change Password */}
          <div className="lg:col-span-7 space-y-8">
            {/* Edit Profile Form */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-[#F0ECE4] flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#4E5942]" /> Profile Details
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-[#EFECE4] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs text-[#736E67] cursor-not-allowed"
                  />
                  <p className="text-[12px] text-[#736E67] mt-1">
                    Email address is tied to your account authentication and cannot be changed here.
                  </p>
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-[#1A1A1A] hover:bg-[#333333] text-white py-2.5 px-6 text-[14px] uppercase tracking-wider font-semibold rounded-2xs transition-colors disabled:opacity-50"
                  >
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </button>

                  {profileSuccess && (
                    <span className="text-[13px] text-[#4E5942] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Updated successfully!
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-[#F0ECE4] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#4E5942]" /> Security & Password
              </h2>

              {passwordError && (
                <div className="mb-4 p-3 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xs text-[13px] text-[#9B1C1C]">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={10}
                      placeholder="Min 10 characters"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      minLength={10}
                      placeholder="Re-type password"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-[#1A1A1A] hover:bg-[#333333] text-white py-2.5 px-6 text-[14px] uppercase tracking-wider font-semibold rounded-2xs transition-colors disabled:opacity-50"
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Track Order & Quick Links */}
          <div className="lg:col-span-5 space-y-6">
            {/* My Orders & Review History Card */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#4E5942]" /> My Orders
                </h3>
                {orders.length > 0 && (
                  <span className="text-[12px] font-semibold text-[#736E67]">
                    {orders.length} {orders.length === 1 ? "order" : "orders"}
                  </span>
                )}
              </div>

              {loadingOrders ? (
                <div className="py-4 text-center">
                  <div className="w-5 h-5 border-2 border-[#4E5942] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-[13px] text-[#736E67]">Checking order history...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-4 text-center text-[#736E67] text-[14px]">
                  <p>No previous orders found.</p>
                  <Link href="/shop" className="text-[#4E5942] font-semibold underline text-[13px] mt-1 inline-block">
                    Explore Our Formulations →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 bg-[#FBF9F5] border border-[#E8E3DA] rounded-2xs flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[14px] text-[#1A1A1A]">
                          {ord.reference}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            ord.status === "delivered"
                              ? "bg-[#EDF3E8] text-[#3E4534] border border-[#C5D7BD]"
                              : ord.status === "shipped"
                              ? "bg-[#E8F0FE] text-[#1967D2]"
                              : "bg-[#F5F2EB] text-[#736E67]"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[13px] text-[#5A5650] pt-1 border-t border-[#F0ECE4]">
                        <span>Total: {formatINR(ord.total)}</span>
                        <Link
                          href={`/orders/${ord.reference}`}
                          className={`font-semibold inline-flex items-center gap-1 ${
                            ord.status === "delivered"
                              ? "text-[#4E5942] underline hover:text-[#1A1A1A]"
                              : "text-[#1A1A1A] hover:underline"
                          }`}
                        >
                          <span>{ord.status === "delivered" ? "Review Products ★" : "View Details →"}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Track Order Card */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#4E5942]" /> Track An Order
              </h3>
              <p className="text-[14px] text-[#736E67]">
                Quickly locate your package timeline and live delivery status using your order reference.
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  placeholder="Order Code (e.g. MAY-109283)"
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs uppercase placeholder-normal focus:outline-hidden focus:border-[#1A1A1A]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (trackRef.trim()) {
                      router.push(`/orders/${trackRef.trim()}`);
                    } else {
                      router.push("/orders/track");
                    }
                  }}
                  className="w-full bg-[#4E5942] hover:bg-[#3E4534] text-white py-3 px-4 text-[14px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Track Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Botanical Guarantee / Trust Card */}
            <div className="bg-[#F5F2EB] border border-[#E8E3DA] rounded-xs p-6 space-y-3">
              <h4 className="text-[15px] font-semibold text-[#1A1A1A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4E5942]" /> Maysha Purity Promise
              </h4>
              <p className="text-[13px] text-[#5A5650] leading-relaxed">
                All formulations are dermatologist-evaluated, barrier-safe, and free from parabens, phthalates, and artificial fragrances.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="text-[13px] text-[#4E5942] font-semibold underline hover:text-[#1A1A1A]"
                >
                  Explore Botanical Store →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
