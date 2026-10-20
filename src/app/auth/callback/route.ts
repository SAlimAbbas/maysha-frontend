import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const rawNext = req.nextUrl.searchParams.get("next") || "/account";

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_token", req.url));
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

  // Security (Finding B4): Validate session token with backend /auth/me before setting cookie
  const baseUrl = process.env.API_URL || "http://127.0.0.1:8000";
  try {
    const authRes = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!authRes.ok) {
      return NextResponse.redirect(new URL("/auth/login?error=invalid_token", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/login?error=auth_verification_failed", req.url));
  }

  const redirectUrl = new URL(safeNext, req.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: "maysha_session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  response.headers.set("Referrer-Policy", "no-referrer");

  return response;
}
