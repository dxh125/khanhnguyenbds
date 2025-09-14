// src/lib/fetchWithAuth.ts
import { auth } from "@/lib/firebase";

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const user = auth.currentUser;
  const idToken = user ? await user.getIdToken() : "";
  const headers = new Headers(init.headers || {});
  if (idToken) headers.set("Authorization", `Bearer ${idToken}`);
  return fetch(input, { ...init, headers });
}
