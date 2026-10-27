import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const tokenParam = req.nextUrl.searchParams.get("token");
  const rawNext = req.nextUrl.searchParams.get("next") || "/account";

  if (!code && !tokenParam) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_auth_code", req.url));
  }

  // Security (Finding B4): Ensure 'next' is strictly a relative path to prevent open redirect
  let safeNext = "/account";
  if (
    rawNext &&
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//") &&
    !rawNext.includes("\\") &&
    !rawNext.toLowerCase().includes("javascript:")
  ) {
    safeNext = rawNext;
  }

  const baseUrl = process.env.API_URL || "http://127.0.0.1:8000";
  let resolvedToken = tokenParam;

  // S3: If one-time authorization code provided, securely exchange it for session Bearer token server-side
  if (code) {
    try {
      const headers = new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      });

      const edgeClientIp =
        req.headers.get("cf-connecting-ip") ||
        req.headers.get("x-real-ip") ||
        (process.env.NODE_ENV !== "production" ? req.headers.get("x-forwarded-for")?.split(",")[0].trim() : null) ||
        "127.0.0.1";
      headers.set("X-Maysha-Client-IP", edgeClientIp);
      if (process.env.BFF_SECRET) {
        headers.set("X-Maysha-BFF-Secret", process.env.BFF_SECRET);
      }

      const exchangeRes = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/exchange-code`, {
        method: "POST",
        headers,
        body: JSON.stringify({ code }),
        cache: "no-store",
      });

      if (!exchangeRes.ok) {
        return NextResponse.redirect(new URL("/auth/login?error=invalid_or_expired_code", req.url));
      }

      const data = await exchangeRes.json();
      resolvedToken = data?.data?.token;

      if (!resolvedToken) {
        return NextResponse.redirect(new URL("/auth/login?error=token_exchange_failed", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/auth/login?error=auth_exchange_network_error", req.url));
    }
  } else if (tokenParam) {
    // Legacy fallback: Validate session token with backend /auth/me before setting cookie
    try {
      const authRes = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/me`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenParam}`,
        },
        cache: "no-store",
      });

      if (!authRes.ok) {
        return NextResponse.redirect(new URL("/auth/login?error=invalid_token", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/auth/login?error=auth_verification_failed", req.url));
    }
  }

  const redirectUrl = new URL(safeNext, req.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: "maysha_session",
    value: resolvedToken!,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  response.headers.set("Referrer-Policy", "no-referrer");

  return response;
}
