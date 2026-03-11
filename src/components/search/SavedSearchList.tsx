// src/components/search/SavedSearchList.tsx
"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useRouter } from "next/navigation";

type Saved = {
  id: string;
  name?: string | null;
  sort?: "newest" | "price-asc" | "price-desc" | "area-asc" | "area-desc";
  filters: any;
  createdAt: string;
};

export default function SavedSearchList({ locale }: { locale: string }) {
  const [items, setItems] = useState<Saved[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    const res = await fetchWithAuth("/api/saved-searches");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const applySearch = (s: Saved) => {
    // encode filters vào query param f
    const f = encodeURIComponent(JSON.stringify(s.filters || {}));
    const qs = new URLSearchParams();
    if (s.sort) qs.set("sort", s.sort);
    qs.set("f", f);
    router.push(`/${locale}/search?` + qs.toString());
  };

  const rename = async (s: Saved) => {
    const name = window.prompt("Đổi tên bộ lọc:", s.name || "");
    if (name === null) return;
    const res = await fetchWithAuth(`/api/saved-searches/${s.id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
    if (!res.ok) alert("Không đổi tên được");
    await load();
  };

  const removeOne = async (s: Saved) => {
    if (!confirm("Xoá bộ lọc này?")) return;
    const res = await fetchWithAuth(`/api/saved-searches/${s.id}`, { method: "DELETE" });
    if (!res.ok) alert("Không xoá được");
    await load();
  };

  if (loading) return <div className="p-4">Đang tải…</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-3">
      <h1 className="text-xl font-semibold">Bộ lọc đã lưu</h1>
      {items.length === 0 && <div>Chưa có bộ lọc nào.</div>}
      {items.map((s) => (
        <div key={s.id} className="border rounded p-3 flex items-center justify-between">
          <div>
            <div className="font-medium">{s.name || "(không tên)"}</div>
            <div className="text-xs text-gray-500">
              {new Date(s.createdAt).toLocaleString()} • sort: {s.sort || "newest"}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={() => applySearch(s)}>
              Áp dụng
            </button>
            <button className="px-3 py-1 border rounded" onClick={() => rename(s)}>
              Đổi tên
            </button>
            <button className="px-3 py-1 border rounded" onClick={() => removeOne(s)}>
              Xoá
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
