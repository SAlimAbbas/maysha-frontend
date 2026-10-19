"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/uiStore";

export default function RegisterPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();
  const { addToast } = useUIStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // Bot honeypot trap
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const googleRedirectUrl = `${
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  }/api/v1/auth/google/redirect`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Validate password min 10 characters with letters and numbers
    if (password.length < 10 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMessage("Password must be at least 10 characters long and include both letters and numbers.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
          website: website.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Please check your information.");
      }

      addToast("Account Created", "Welcome to Maysha Skincare! Please check your email to verify your account.", "success");
      await refetchUser();
      router.push("/account");
    } catch (err: any) {
      setErrorMessage(err.message || "Registration could not be completed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FBF9F5] min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E8E3DA] p-8 sm:p-10 rounded-xs shadow-xs">
        <div className="text-center mb-8">
          <span className="text-[13px] uppercase tracking-wider font-semibold text-[#4E5942] block mb-1">
            New Membership
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">Create Account</h1>
          <p className="text-[15px] text-[#736E67] mt-1">
            Join the Maysha circle for clean formulations, order history, and botanical insights.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#9B1C1C] shrink-0 mt-0.5" />
            <p className="text-[14px] text-[#9B1C1C]">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field for bot/spammer trapping */}
          <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
            <label htmlFor="hp_register_website">Do not fill this field</label>
            <input
              type="text"
              id="hp_register_website"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Priyanshu Mehta"
                className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 pl-10 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
              />
              <User className="w-4 h-4 text-[#736E67] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. name@example.com"
                className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 pl-10 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
              />
              <Mail className="w-4 h-4 text-[#736E67] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 pl-10 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
              />
              <Phone className="w-4 h-4 text-[#736E67] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={10}
                placeholder="Min 10 characters (letters & numbers)"
                className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 pl-10 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
              />
              <Lock className="w-4 h-4 text-[#736E67] absolute left-3.5 top-3.5" />
            </div>
            <p className="text-[12px] text-[#736E67] mt-1">
              Must be at least 10 characters containing both letters and numbers.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-3.5 px-6 text-[15px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 mt-4"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Button */}
        <div className="mt-6 pt-6 border-t border-[#E8E3DA]">
          <a
            href={googleRedirectUrl}
            className="w-full bg-[#FFFFFF] hover:bg-[#FBF9F5] text-[#1A1A1A] border border-[#E8E3DA] py-3 px-4 rounded-2xs text-[14px] font-semibold flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </a>
        </div>

        <div className="mt-6 text-center text-[14px] text-[#736E67]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#1A1A1A] font-semibold underline hover:text-[#4E5942]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
