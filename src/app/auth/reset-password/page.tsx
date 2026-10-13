"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { apiBffFetch } from "@/lib/api";
import { useUIStore } from "@/stores/uiStore";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useUIStore();

  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 10 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMessage("Password must be at least 10 characters long and include both letters and numbers.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await apiBffFetch("auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          email: email.trim(),
          password,
        }),
      });

      addToast("Password Updated", "Your password has been changed successfully. Please log in.", "success");
      router.push("/auth/login");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-8 sm:p-10 rounded-xs shadow-xs">
      <div className="text-center mb-8">
        <span className="text-[13px] uppercase tracking-wider font-semibold text-[#4E5942] block mb-1">
          Security Update
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">Set New Password</h1>
        <p className="text-[15px] text-[#736E67] mt-1">
          Create a new strong password for your account.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#9B1C1C] shrink-0 mt-0.5" />
          <p className="text-[14px] text-[#9B1C1C]">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
          />
        </div>

        <div>
          <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={10}
              placeholder="Min 10 chars (letters + numbers)"
              className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 pl-10 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
            />
            <Lock className="w-4 h-4 text-[#736E67] absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={10}
              placeholder="Re-type new password"
              className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 pl-10 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
            />
            <Lock className="w-4 h-4 text-[#736E67] absolute left-3.5 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-3.5 px-6 text-[15px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 mt-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <span>Save & Update Password</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full">
        <Suspense
          fallback={
            <div className="bg-white border border-[#E8E3DA] p-10 text-center text-[#736E67]">
              Loading reset portal...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
