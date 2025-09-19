// src/lib/getUserIdFromRequest.ts
import { NextRequest } from "next/server";

/** Nếu bạn đã có verify Firebase Admin thì import vào đây và ưu tiên verify idToken.
 *  Chưa có thì tạm fallback 'x-user-id' (chỉ dùng dev hoặc local).
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const authz = req.headers.get("authorization");
  if (authz?.startsWith("Bearer ")) {
    const idToken = authz.slice(7);
    try {
      // TODO: nếu đã có firebase admin:
      // const decoded = await adminAuth.verifyIdToken(idToken);
      // return decoded.uid || decoded.user_id || null;
      // Tạm thời coi như không verify được:
      return null;
    } catch {
      return null;
    }
  }
  // Fallback dev
  const xUser = req.headers.get("x-user-id");
  return xUser || null;
}
