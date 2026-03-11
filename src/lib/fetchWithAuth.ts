// src/lib/fetchWithAuth.ts
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

/** Chờ Firebase xác định currentUser lần đầu (nếu chưa có ngay) */
function waitForUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const u = auth.currentUser;
    if (u) return resolve(u);
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  // 1) Lấy user (chờ nếu cần)
  const user = auth.currentUser ?? (await waitForUser());
  if (!user) {
    throw new Error("Bạn cần đăng nhập để sử dụng chức năng này.");
  }

  // Helper gắn token + merge headers
  const doFetch = async (forceRefresh = false) => {
    const idToken = await user.getIdToken(forceRefresh); // forceRefresh=true để làm mới khi 401
    const headers = new Headers(init.headers || {});
    headers.set("Authorization", `Bearer ${idToken}`);
    // Giữ nguyên Content-Type nếu bạn đã set từ chỗ gọi
    return fetch(input, { ...init, headers });
  };

  // 2) Gọi lần 1
  let res = await doFetch(false);

  // 3) Nếu 401 → refresh token và thử lại 1 lần
  if (res.status === 401) {
    res = await doFetch(true);
  }

  return res;
}
