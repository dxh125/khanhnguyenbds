// src/lib/getUserIdFromRequest.ts
import { NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebaseAdmin";

export async function getUserIdFromRequest(req: NextRequest) {
  const authz = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authz?.startsWith("Bearer ")) {
    console.log("[auth] Missing Authorization header");
    return null;
  }
  const token = authz.slice(7);
  try {
    const decoded = await verifyIdToken(token);
    console.log("[auth] OK uid:", decoded.uid);
    return decoded.uid || null;
  } catch (e: any) {
    console.error("[auth] verifyIdToken error:", e?.errorInfo || e?.message || e);
    return null;
  }
}
