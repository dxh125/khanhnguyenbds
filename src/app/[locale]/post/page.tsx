"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PostPropertyForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    area: "",
    date: new Date().toISOString().slice(0, 10),
    type: "",
    image: "",
    status: "Mới đăng",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/properties", form);
      alert("Đăng tin thành công!");
      router.push("/");
    } catch (error) {
      console.error("Lỗi khi đăng tin:", error);
      alert("Đăng tin thất bại.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Đăng tin bất động sản</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Tiêu đề"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Giá (vd: 3.2 tỷ)"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="area"
          value={form.area}
          onChange={handleChange}
          placeholder="Diện tích (vd: 90m²)"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Link hình ảnh"
          className="w-full border p-2 rounded"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Chọn loại bất động sản</option>
          <option value="nhà phố">Nhà phố</option>
          <option value="căn hộ">Căn hộ</option>
          <option value="đất">Đất nền</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Đăng tin
        </button>
      </form>
    </div>
  );
}
