"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageUploader from "@/components/uploader/ImageUploader";

export default function PostProject() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof form, v: string) =>
    setForm(s => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, imageUrl: images[0] };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Tạo dự án thất bại");
      alert("Tạo dự án thành công!");
      router.push(`/${locale}/admin/projects`);
    } catch (e: any) {
      alert(e.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Tạo dự án</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="border rounded px-3 py-2 w-full" placeholder="Tên dự án *"
          value={form.name} onChange={e => update("name", e.target.value)} required/>
        <input className="border rounded px-3 py-2 w-full" placeholder="Slug (vd: ecopark) *"
          value={form.slug} onChange={e => update("slug", e.target.value)} required/>
        <textarea className="border rounded px-3 py-2 w-full min-h-[120px]"
          placeholder="Mô tả *" value={form.description}
          onChange={e => update("description", e.target.value)} required />
        <div>
          <label className="block text-sm font-medium mb-2">Ảnh đại diện (tuỳ chọn)</label>
          <ImageUploader onChange={setImages} max={1} />
        </div>
        <button disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
          {loading ? "Đang lưu..." : "Tạo dự án"}
        </button>
      </form>
    </div>
  );
}
