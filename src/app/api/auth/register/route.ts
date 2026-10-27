import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Bot honeypot trap check: reject or silently return dummy success to trap bots
    if (body.website || body.bot_trap) {
      return NextResponse.json(
        {
          success: true,
          message: "Registration successful. A verification email has been sent.",
          user: { name: body.name || "Customer", email: body.email || "" },
        },
        { status: 201 }
      );
    }

    const cookieStore = await cookies();
    const cartToken = cookieStore.get("maysha_cart_token")?.value;

    const baseUrl = process.env.API_URL || "http://127.0.0.1:8000";
    const headers = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    if (cartToken) {
      headers.set("X-Cart-Token", cartToken);
    }

    const edgeClientIp =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      (process.env.NODE_ENV !== "production" ? req.headers.get("x-forwarded-for")?.split(",")[0].trim() : null) ||
      "127.0.0.1";
    headers.set("X-Maysha-Client-IP", edgeClientIp);
    if (process.env.BFF_SECRET) {
      headers.set("X-Maysha-BFF-Secret", process.env.BFF_SECRET);
    }

    const upstreamRes = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/register`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await upstreamRes.json();

    if (!upstreamRes.ok) {
      return NextResponse.json(data, { status: upstreamRes.status });
    }

    const res = NextResponse.json(
      {
        success: true,
        message: data.message || "Registration successful.",
        user: data.data.user,
      },
      { status: 201 }
    );

    if (data.data.token) {
      res.cookies.set({
        name: "maysha_session",
        value: data.data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Registration service error." },
      { status: 500 }
    );
  }
}
