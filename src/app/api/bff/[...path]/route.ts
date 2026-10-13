import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ALLOWED_PATH_PREFIXES = [
  "admin",
  "products",
  "categories",
  "concerns",
  "banners",
  "reviews",
  "cart",
  "orders",
  "payments/razorpay",
  "newsletter",
  "contact",
  "articles",
  "store-info",
  "shipping/pincode",
  "search/suggest",
  "auth/me",
  "auth/change-password",
  "auth/resend-verification",
  "account",
  "coupons",
];

function isPathAllowed(pathString: string): boolean {
  return ALLOWED_PATH_PREFIXES.some(
    (allowed) => pathString === allowed || pathString.startsWith(`${allowed}/`)
  );
}

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathString = path.join("/");

  if (!isPathAllowed(pathString)) {
    return NextResponse.json(
      { success: false, message: "Forbidden: Endpoint not allowed through BFF proxy." },
      { status: 403 }
    );
  }

  // Same-origin verification on mutating methods
  const method = req.method.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const requestedWith = req.headers.get("x-requested-with");
    if (requestedWith !== "maysha") {
      const secFetchSite = req.headers.get("sec-fetch-site");
      if (secFetchSite && secFetchSite !== "same-origin") {
        return NextResponse.json(
          { success: false, message: "Invalid cross-origin request." },
          { status: 403 }
        );
      }
    }
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("maysha_session")?.value;
  const cartToken = cookieStore.get("maysha_cart_token")?.value;

  const baseUrl = process.env.API_URL || "http://127.0.0.1:8000";
  const search = req.nextUrl.search;
  const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/v1/${pathString}${search}`;

  const forwardHeaders = new Headers();
  forwardHeaders.set("Accept", "application/json");

  if (sessionToken) {
    forwardHeaders.set("Authorization", `Bearer ${sessionToken}`);
  }
  if (cartToken) {
    forwardHeaders.set("X-Cart-Token", cartToken);
  }

  const idempotencyKey = req.headers.get("idempotency-key");
  if (idempotencyKey) {
    forwardHeaders.set("Idempotency-Key", idempotencyKey);
  }

  // Forward client IP
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";
  forwardHeaders.set("X-Forwarded-For", clientIp);

  let body: BodyInit | undefined = undefined;
  if (["POST", "PUT", "PATCH"].includes(method)) {
    forwardHeaders.set("Content-Type", "application/json");
    try {
      const jsonBody = await req.json();
      // If posting an order, merge cart_token from cookie into the body so Laravel links & clears the cart
      if (pathString === "orders" && cartToken && !jsonBody.cart_token) {
        jsonBody.cart_token = cartToken;
      }
      body = JSON.stringify(jsonBody);
    } catch {
      // Body may be empty
    }
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body,
    });

    const responseBody = await upstreamRes.text();
    let parsedJson: any = null;
    try {
      parsedJson = JSON.parse(responseBody);
    } catch {
      // Not JSON
    }

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");

    const res = new NextResponse(responseBody, {
      status: upstreamRes.status,
      headers: responseHeaders,
    });

    // If upstream returns a new or refreshed cartToken in meta, set HttpOnly cookie
    if (parsedJson?.meta?.cartToken) {
      res.cookies.set({
        name: "maysha_cart_token",
        value: parsedJson.meta.cartToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    }

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to communicate with backend." },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
