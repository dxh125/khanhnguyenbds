// src/app/[locale]/admin/listings/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

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
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const [authReady, setAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  // Chờ Firebase Auth khởi tạo -> tránh gọi token quá sớm gây treo loading
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setIsLoggedIn(!!u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      let res: Response;
      if (isLoggedIn) {
        // lấy tin của chính user
        res = await fetchWithAuth("/api/properties?mine=1", { cache: "no-store" });
      } else {
        // chưa đăng nhập -> trả feed chung
        res = await fetch("/api/properties", { cache: "no-store" });
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Không thể tải dữ liệu");
      }
      const data: Property[] = await res.json();
      setItems(data);
    } catch (e: any) {
      setErr(e?.message || "Có lỗi xảy ra");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (authReady) load();
  }, [authReady, load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xoá tin này?")) return;
    try {
      const res = await fetchWithAuth(`/api/properties/${id}`, {
        method: "DELETE",
      });
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
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Tiêu đề cố định — không phụ thuộc user/token để tránh lệch hydration */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Tin đã đăng</h1>

        <div className="flex items-center gap-2">
          {!isLoggedIn && authReady && (
            <Link
              href={`/${locale}/login`}
              className="px-3 py-2 rounded border text-sm hover:bg-gray-50"
            >
              Đăng nhập
            </Link>
          )}
          <Link
            href={`/${locale}/admin/post-property`}
            className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            + Đăng tin mới
          </Link>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {err && <p className="mb-3 text-red-600">{err}</p>}

      {/* Skeleton khi loading (giống nhau giữa SSR & client) */}
      {loading ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="border rounded p-4 animate-pulse">
              <div className="h-40 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <div className="text-gray-600">
          {isLoggedIn
            ? "Bạn chưa có tin nào."
            : "Chưa có tin nào hoặc bạn chưa đăng nhập."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((p) => (
            <div key={p.id} className="border rounded-lg overflow-hidden bg-white">
              <div className="aspect-[16/9] bg-gray-100">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
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
                  {p.area} m² • {p.propertyType} •{" "}
                  {p.purpose === "buy" ? "Bán" : "Cho thuê"}
                </div>
                <div className="text-sm text-gray-500 line-clamp-2">
                  {p.address}
                  {p.ward ? `, ${p.ward}` : ""}
                  {p.district ? `, ${p.district}` : ""}
                  {p.city ? `, ${p.city}` : ""}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() =>
                      router.push(`/${locale}/admin/edit-property/${p.id}`)
                    }
                    className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
                  >
                    Chỉnh sửa
                  </button>
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
      )}
    </div>
  );
}
