import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("maysha_session")?.value;

  if (sessionToken) {
    const baseUrl = process.env.API_URL || "http://127.0.0.1:8000";
    try {
      await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Accept: "application/json",
        },
      });
    } catch {
      // Ignore upstream logout error, still clear cookies locally
    }
  }

  const res = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  res.cookies.delete("maysha_session");
  res.cookies.delete("maysha_cart_token");

  return res;
}
