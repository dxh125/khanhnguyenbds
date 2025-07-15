"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Cập nhật tên người dùng
      await updateProfile(userCredential.user, {
        displayName: form.name,
      });

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email đã được sử dụng");
      } else if (err.code === "auth/invalid-email") {
        setError("Email không hợp lệ");
      } else if (err.code === "auth/weak-password") {
        setError("Mật khẩu quá yếu (ít nhất 6 ký tự)");
      } else {
        setError("Lỗi đăng ký. Vui lòng thử lại");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Đăng ký tài khoản</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Họ tên"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
