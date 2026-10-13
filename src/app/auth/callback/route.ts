import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const next = req.nextUrl.searchParams.get("next") || "/account";

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_token", req.url));
  }

  const redirectUrl = new URL(next, req.url);
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
