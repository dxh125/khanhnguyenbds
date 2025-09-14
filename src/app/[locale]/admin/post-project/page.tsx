// src/app/[locale]/admin/post-project/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageUploader from "@/components/uploader/ImageUploader";
import { fetchWithAuth } from "@/lib/fetchWithAuth"; // 👈 quan trọng

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostProject() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const update = (k: keyof typeof form, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const canSubmit =
    !!form.name.trim() &&
    !!(form.slug.trim() || slugify(form.name).length) &&
    !!form.description.trim();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setErr("");

    try {
      const finalSlug = form.slug.trim() || slugify(form.name);
      const payload = {
        name: form.name.trim(),
        slug: finalSlug,
        description: form.description.trim(),
        imageUrl: images[0] || undefined, // ảnh không bắt buộc
      };

      const res = await fetchWithAuth("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Tạo dự án thất bại");
      }

      alert("Tạo dự án thành công!");
      router.push(`/${locale}/admin/projects`);
    } catch (e: any) {
      setErr(e?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Tạo dự án</h1>

      {err && <p className="mb-3 text-red-600 text-sm">{err}</p>}

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Tên dự án *"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          onBlur={() => {
            // nếu chưa nhập slug, tự sinh từ name
            if (!form.slug.trim() && form.name.trim()) {
              update("slug", slugify(form.name));
            }
          }}
          required
        />

        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Slug (vd: ecopark) *"
          value={form.slug}
          onChange={(e) => update("slug", slugify(e.target.value))}
          required
        />

        <textarea
          className="border rounded px-3 py-2 w-full min-h-[120px]"
          placeholder="Mô tả *"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            Ảnh đại diện (tuỳ chọn)
          </label>
          <ImageUploader onChange={setImages} max={1} />
        </div>

        <button
          disabled={loading || !canSubmit}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Tạo dự án"}
        </button>
      </form>
    </div>
  );
}
