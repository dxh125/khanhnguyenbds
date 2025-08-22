// app/[locale]/search/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertiesByFilterPaged } from "@/lib/queries";
import PropertyCard from "@/components/PropertyCard";
import FilterBar from "@/components/filters/FilterBar";
import { parseSearchIntent } from "@/lib/searchIntent";

type SP = { [key: string]: string | string[] | undefined };

const toStr = (v?: string | string[]) =>
  typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;

export default async function Page(props: any) {
  // ✅ Thu hẹp type bên trong để vẫn có IntelliSense
  const { params, searchParams } = props as {
    params: { locale?: string };
    searchParams?: SP;
  };

  const locale = params?.locale;
  if (!locale) notFound();

  const q = toStr(searchParams?.q);
  const sort =
    (toStr(searchParams?.sort) as
      | "newest"
      | "oldest"
      | "priceAsc"
      | "priceDesc"
      | "areaAsc"
      | "areaDesc") || "newest";

  // Gợi ý thông minh từ câu truy vấn tự nhiên (không ép, chỉ đề xuất)
  const intent = parseSearchIntent?.(q) ?? { reasons: [] as string[] };

  // Gọi hàm phân trang (đã hỗ trợ q/sort/page/pageSize trong queries.ts)
  const { items, total, page, pageSize } = await getPropertiesByFilterPaged({
    ...(searchParams || {}),
    sort,
  } as any);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildUrl = (
    overrides?: Record<string, string | number | boolean | null | undefined>
  ) => {
    const paramsQS = new URLSearchParams();
    // giữ param hiện có
    Object.entries(searchParams || {}).forEach(([k, v]) => {
      if (typeof v === "string") paramsQS.set(k, v);
    });
    // apply overrides
    if (overrides) {
      Object.entries(overrides).forEach(([k, v]) => {
        if (v === null || typeof v === "undefined" || v === "") paramsQS.delete(k);
        else paramsQS.set(k, String(v));
      });
    }
    const qs = paramsQS.toString();
    return `/${locale}/search${qs ? `?${qs}` : ""}`;
  };

  const toPriceParam = (maxPrice?: number) => {
    if (!maxPrice) return undefined;
    return `-${maxPrice}`;
  };

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

      {/* Banner gợi ý áp dụng intent */}
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
            {((searchParams?.city && typeof searchParams.city === "string") ||
              (searchParams?.district && typeof searchParams.district === "string") ||
              (searchParams?.price && typeof searchParams.price === "string")) && (
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

      {/* FilterBar ngang (điều hướng trên /search) */}
      <FilterBar
        initialFilters={searchParams || {}}
        defaultPurpose={(toStr(searchParams?.purpose) as "buy" | "rent") || "buy"}
        defaultType={toStr(searchParams?.propertyType) || "can-ho"}
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
          {items.map((p) => (
            <PropertyCard key={p.id} property={p as any} />
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
