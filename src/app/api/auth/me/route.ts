import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("maysha_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ success: true, user: null });
  }

  const baseUrl = process.env.API_URL || "http://127.0.0.1:8000";

  try {
    const upstreamRes = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (upstreamRes.status === 401) {
      // Token is stale or invalid: clear dead cookie
      const res = NextResponse.json({ success: true, user: null });
      res.cookies.delete("maysha_session");
      return res;
    }

    if (!upstreamRes.ok) {
      return NextResponse.json({ success: true, user: null });
    }

    const data = await upstreamRes.json();
    return NextResponse.json({
      success: true,
      user: data.data.user || data.data,
    });
  } catch {
    return NextResponse.json({ success: true, user: null });
  }
}
