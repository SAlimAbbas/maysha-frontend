import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret || !secret) {
    return NextResponse.json(
      { success: false, message: "Invalid secret token or revalidation unconfigured." },
      { status: 401 }
    );
  }

  // Security (Finding B7): Constant-time comparison to prevent timing attacks
  const secretBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expectedSecret);

  if (
    secretBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(secretBuffer, expectedBuffer)
  ) {
    return NextResponse.json({ success: false, message: "Invalid secret token." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const tags: string[] = body.tags || [];
    const path: string | undefined = body.path;

    for (const tag of tags) {
      revalidateTag(tag, "maxAge");
    }

    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json({
      success: true,
      message: "Revalidation triggered successfully.",
      revalidatedTags: tags,
      revalidatedPath: path,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to parse revalidation payload." },
      { status: 400 }
    );
  }
}
