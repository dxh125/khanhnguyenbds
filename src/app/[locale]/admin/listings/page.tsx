"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Property = {
  id: string;
  title: string;
  price: number;
  area: number;
  address: string;
  city?: string | null;
  district?: string | null;
  ward?: string | null;
  images: string[];
  status: string;
  purpose: string;
  propertyType: string;
  postedAt: string;
  projectSlug?: string | null;
};

export default function AdminListingsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale as string) || "vi";

  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const user = useMemo(() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }, []);

  const userId: string | undefined =
    user?.id || user?._id || user?.uid || user?.email || undefined;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const url = userId
          ? `/api/properties?userId=${encodeURIComponent(userId)}`
          : `/api/properties`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Không tải được danh sách");
        const data = (await res.json()) as Property[];
        if (mounted) setItems(data);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Có lỗi xảy ra");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xoá tin này?")) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Xoá thất bại");
      }
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      alert(e?.message || "Không xoá được tin");
    }
  };

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Tin đã đăng {userId ? "" : "(hiển thị tất cả — chưa xác định userId)"}
        </h1>
        <Link
          href={`/${locale}/admin/post-property`}
          className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
        >
          + Đăng tin mới
        </Link>
      </div>

      {loading && <p>Đang tải…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !items.length && (
        <div className="text-gray-500">Chưa có tin nào.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((p) => (
          <div key={p.id} className="border rounded-lg overflow-hidden bg-white">
            <div className="aspect-[16/9] bg-gray-100">
              {p.images?.[0] ? (
                // dùng <img> cho đơn giản; nếu bạn dùng next/image thì thay vào đây
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Không có ảnh
                </div>
              )}
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-semibold line-clamp-1">{p.title}</h3>
              <div className="text-red-600 font-semibold">{fmtPrice(p.price)}</div>
              <div className="text-sm text-gray-600">
                {p.area} m² • {p.propertyType} • {p.purpose === "buy" ? "Bán" : "Cho thuê"}
              </div>
              <div className="text-sm text-gray-500 line-clamp-2">
                {p.address}
                {p.ward ? `, ${p.ward}` : ""}{p.district ? `, ${p.district}` : ""}{p.city ? `, ${p.city}` : ""}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/${locale}/admin/edit-property/${p.id}`}
                  className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
                >
                  Chỉnh sửa
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1.5 rounded border border-red-600 text-red-600 text-sm hover:bg-red-50"
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
