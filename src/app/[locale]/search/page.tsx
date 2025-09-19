// app/[locale]/search/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertiesByFilterPaged } from "@/lib/queries";
import PropertyCard from "@/components/PropertyCard";
import FilterBar from "@/components/filters/FilterBar";
import { parseSearchIntent } from "@/lib/searchIntent";

type SP = Record<string, string | string[] | undefined>;

type PageProps = {
  params: Promise<{ locale: string }>; // Next 15: Promise
  searchParams: Promise<SP>;           // Next 15: Promise
};

// ép về string an toàn
const toStr = (v: unknown) =>
  typeof v === "string" ? v : Array.isArray(v) ? (v[0] || "") : "";

// clone searchParams (object) -> URLSearchParams
const toURLSearchParams = (sp: SP) => {
  const p = new URLSearchParams();
  Object.entries(sp || {}).forEach(([k, v]) => {
    if (typeof v === "string") {
      if (v) p.set(k, v);
    } else if (Array.isArray(v) && v.length) {
      p.set(k, v[0]); // hoặc append nhiều giá trị nếu bạn cần
    }
  });
  return p;
};

export default async function Page({ params, searchParams }: PageProps) {
  // ✅ BẮT BUỘC await khi dùng Next 15
  const { locale } = await params;
  const spRaw = await searchParams;

  if (!locale) notFound();

  const q = toStr(spRaw.q);
  const sort =
    (toStr(spRaw.sort) as
      | "newest"
      | "oldest"
      | "priceAsc"
      | "priceDesc"
      | "areaAsc"
      | "areaDesc") || "newest";

  // Gợi ý ý định tìm kiếm (nếu có)
  const intent = parseSearchIntent?.(q || undefined) ?? { reasons: [] as string[] };

  // Lấy dữ liệu phân trang
  const { items, total, page, pageSize } = await getPropertiesByFilterPaged({
    ...(spRaw || {}),
    sort,
  } as any);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // helper build URL từ spRaw + overrides
  const buildUrl = (
    overrides?: Record<string, string | number | boolean | null | undefined>
  ) => {
    const paramsQS = toURLSearchParams(spRaw);
    if (overrides) {
      Object.entries(overrides).forEach(([k, v]) => {
        if (v === null || typeof v === "undefined" || v === "") paramsQS.delete(k);
        else paramsQS.set(k, String(v));
      });
    }
    const qs = paramsQS.toString();
    return `/${locale}/search${qs ? `?${qs}` : ""}`;
  };

  const toPriceParam = (maxPrice?: number) => (maxPrice ? `-${maxPrice}` : undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">
            Kết quả {q ? <>cho “{q}”</> : "tìm kiếm"}
          </h1>
          <p className="text-sm text-gray-500">{total} tin phù hợp</p>
        </div>

        {/* Sắp xếp */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sắp xếp:</span>
          {[
            { key: "newest", label: "Mới nhất" },
            { key: "oldest", label: "Cũ nhất" },
            { key: "priceAsc", label: "Giá ↑" },
            { key: "priceDesc", label: "Giá ↓" },
            { key: "areaAsc", label: "Diện tích ↑" },
            { key: "areaDesc", label: "Diện tích ↓" },
          ].map((opt) => (
            <Link
              key={opt.key}
              href={buildUrl({ sort: opt.key, page: 1 })}
              className={`text-sm px-2.5 py-1.5 rounded border ${
                sort === (opt.key as any)
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {!!q && (
        <div className="rounded-xl border bg-amber-50 p-3 text-amber-900 flex flex-wrap gap-2 items-center">
          <div className="text-sm">
            Gợi ý từ truy vấn: {intent.reasons.join(" · ") || "—"}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl({
                purpose: (intent as any).purpose ?? undefined,
                propertyType: (intent as any).type ?? undefined,
                city: (intent as any).city ?? undefined,
                district: (intent as any).district ?? undefined,
                price: toPriceParam((intent as any).maxPrice),
                page: 1,
              })}
              className="text-xs px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 border"
            >
              Áp dụng khu vực/loại hình/giá gợi ý
            </Link>

            {(!!toStr(spRaw.city) ||
              !!toStr(spRaw.district) ||
              !!toStr(spRaw.price)) && (
              <Link
                href={buildUrl({ city: null, district: null, price: null, page: 1 })}
                className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border"
              >
                Xoá khu vực/giá đang áp dụng
              </Link>
            )}
          </div>
        </div>
      )}

      {/* FilterBar (nhận object đã await) */}
      <FilterBar
        initialFilters={spRaw}
        defaultPurpose={(toStr(spRaw.purpose) as "buy" | "rent") || "buy"}
        defaultType={toStr(spRaw.propertyType) || "can-ho"}
        basePath={`/${locale}/search`}
      />

      {/* Kết quả */}
      {items.length === 0 ? (
        <div className="text-gray-600">
          Không tìm thấy kết quả.
          {q && <> Thử từ khóa khác hoặc bấm “Áp dụng gợi ý” phía trên.</>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((p: any) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <Link
            href={buildUrl({ page: Math.max(1, page - 1) })}
            className={`px-3 py-1.5 rounded border ${
              page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-gray-50"
            }`}
          >
            ← Trước
          </Link>
          <span className="text-sm text-gray-600">
            Trang {page}/{totalPages}
          </span>
          <Link
            href={buildUrl({ page: Math.min(totalPages, page + 1) })}
            className={`px-3 py-1.5 rounded border ${
              page >= totalPages
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-50"
            }`}
          >
            Sau →
          </Link>
        </div>
      )}
    </div>
  );
}
