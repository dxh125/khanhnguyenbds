"use client";
import { useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type SaveSearchButtonProps = {
  filters: Record<string, any>;       // chính là object bạn đang pass vào /api/properties/search
  sort?: string;                      // "newest" | "price-asc" | ...
  className?: string;
  onSaved?: (saved: any) => void;
};

export default function SaveSearchButton({ filters, sort, className, onSaved }: SaveSearchButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const name = window.prompt("Đặt tên bộ lọc này:", "");
    if (name === null) return;

    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined, filters, sort }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Không thể lưu tìm kiếm");
      }
      const saved = await res.json();
      onSaved?.(saved);
      alert("Đã lưu bộ lọc!");
    } catch (e: any) {
      alert(e?.message || "Lỗi lưu tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={loading}
      className={className || "px-3 py-2 rounded border text-sm hover:bg-gray-50"}
    >
      {loading ? "Đang lưu..." : "💾 Lưu tìm kiếm"}
    </button>
  );
}
