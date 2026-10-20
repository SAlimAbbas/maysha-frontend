import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("maysha_session")?.value;
  if (!sessionToken) return false;

  const baseUrl = process.env.API_URL || "http://127.0.0.1:8000";
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.data?.role === "admin" || data?.role === "admin";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!API_SECRET || !API_KEY || !CLOUD_NAME) {
      return NextResponse.json(
        { success: false, message: "Cloudinary credentials not configured on server." },
        { status: 500 }
      );
    }

    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required for signing uploads." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawParams = body.paramsToSign || {};

    // Only allow safe, expected signing parameters
    const timestamp = rawParams.timestamp || Math.round(Date.now() / 1000);
    let folder = (rawParams.folder as string) || "maysha";
    folder = folder.replace(/[^a-zA-Z0-9_\-\/]/g, "").replace(/\.\./g, "");
    if (!folder.startsWith("maysha")) {
      folder = `maysha/${folder}`.replace(/\/+/g, "/");
    }

    const paramsToSign: Record<string, any> = {
      folder,
      timestamp,
    };

    if (rawParams.transformation) {
      paramsToSign.transformation = String(rawParams.transformation);
    }

    // Sort parameters alphabetically
    const sortedKeys = Object.keys(paramsToSign).sort();
    const serialized = sortedKeys
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join("&");

    const toHash = serialized + API_SECRET;
    const signature = crypto.createHash("sha1").update(toHash).digest("hex");

    return NextResponse.json({
      signature,
      apiKey: API_KEY,
      cloudName: CLOUD_NAME,
      timestamp,
      folder,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to generate signature" },
      { status: 500 }
    );
  }
}
