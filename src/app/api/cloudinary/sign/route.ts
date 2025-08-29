import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "khanhnguyenbds";

    const paramsToSign = { folder, timestamp };
    const toSign = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${(paramsToSign as any)[k]}`)
      .join("&");

    const signature = crypto
      .createHash("sha1")
      .update(toSign + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");

    return NextResponse.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (e) {
    console.error("Cloudinary sign error:", e);
    return NextResponse.json({ error: "Sign error" }, { status: 500 });
  }
}
