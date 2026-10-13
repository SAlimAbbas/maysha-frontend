import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const API_SECRET = process.env.CLOUDINARY_API_SECRET || "lKnbpgL_kU937bi52zPa-sy3yb0";
const API_KEY = process.env.CLOUDINARY_API_KEY || "173173337267794";
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "fopric4g";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const paramsToSign = body.paramsToSign || {};

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
      timestamp: paramsToSign.timestamp,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to generate signature" },
      { status: 500 }
    );
  }
}
