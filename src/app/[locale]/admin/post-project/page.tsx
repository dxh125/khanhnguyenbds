"use client";

import { useState } from "react";
import axios from "axios";

export default function AdminPostProject() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    image: "",
    label: "",
    labelColor: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/projects", form);
      setSuccess(true);
      setForm({
        name: "",
        location: "",
        price: "",
        image: "",
        label: "",
        labelColor: "",
      });
    } catch (err) {
      console.error("Lỗi khi gửi:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">🛠️ Tạo dự án mới</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          ✅ Đã tạo dự án thành công!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Tên dự án" value={form.name} onChange={handleChange} className="input" required />
        <input name="location" placeholder="Vị trí" value={form.location} onChange={handleChange} className="input" required />
        <input name="price" placeholder="Giá" value={form.price} onChange={handleChange} className="input" required />
        <input name="image" placeholder="Đường dẫn ảnh" value={form.image} onChange={handleChange} className="input" required />
        <input name="label" placeholder="Nhãn (ví dụ: Sắp mở bán)" value={form.label} onChange={handleChange} className="input" />
        <input name="labelColor" placeholder="Màu nhãn (ví dụ: bg-red-600)" value={form.labelColor} onChange={handleChange} className="input" />

        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Thêm dự án
        </button>
      </form>
    </div>
  );
}

// Tailwind hỗ trợ nhanh (nếu bạn chưa có)
const inputClass = "w-full px-4 py-2 border rounded focus:outline-none focus:ring";
