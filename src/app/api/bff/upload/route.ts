import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "fopric4g";
const API_KEY = process.env.CLOUDINARY_API_KEY || "173173337267794";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "lKnbpgL_kU937bi52zPa-sy3yb0";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "maysha";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided for upload." },
        { status: 400 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000);

    // Generate SHA-1 signature per Cloudinary specification: parameters in alphabetical order
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    // Prepare upload payload
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("api_key", API_KEY);
    uploadData.append("timestamp", timestamp.toString());
    uploadData.append("signature", signature);
    uploadData.append("folder", folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: uploadData,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.error?.message || "Failed to upload asset to Cloudinary.",
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal upload failure." },
      { status: 500 }
    );
  }
}
