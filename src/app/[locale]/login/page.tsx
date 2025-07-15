"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Đảm bảo đã tạo file này

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
          photo: user.photoURL || "",
        })
      );

      router.push("/");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Tài khoản không tồn tại");
      } else if (err.code === "auth/wrong-password") {
        setError("Mật khẩu không đúng");
      } else {
        setError("Lỗi đăng nhập. Vui lòng thử lại");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
