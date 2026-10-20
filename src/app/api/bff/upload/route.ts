import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

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
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return NextResponse.json(
        { success: false, message: "Cloudinary credentials not configured on server." },
        { status: 500 }
      );
    }

    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required for asset upload." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let folder = (formData.get("folder") as string) || "maysha";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided for upload." },
        { status: 400 }
      );
    }

    // Security: Only allow image MIME types
    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only images are permitted." },
        { status: 400 }
      );
    }

    // Security: Cap file size to 10MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // Sanitize folder to avoid path traversal / external folder escape
    folder = folder.replace(/[^a-zA-Z0-9_\-\/]/g, "").replace(/\.\./g, "");
    if (!folder.startsWith("maysha")) {
      folder = `maysha/${folder}`.replace(/\/+/g, "/");
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
