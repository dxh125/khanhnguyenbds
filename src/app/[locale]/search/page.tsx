// app/[locale]/search/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertiesByFilterPaged } from "@/lib/queries";
import PropertyCard from "@/components/PropertyCard";
import FilterBar from "@/components/filters/FilterBar";
import { parseSearchIntent } from "@/lib/searchIntent";

type SP = Record<string, string | string[] | undefined>;

interface Props {
  params: { locale: string };
  searchParams: SP;
}

function toStr(v: string | string[] | undefined) {
  return typeof v === "string" ? v : undefined;
}

function buildUrl(
  locale: string,
  sp: SP,
  overrides?: Record<string, string | number | boolean | null | undefined>
) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") params.set(k, v);
  }
  if (overrides) {
    for (const [k, v] of Object.entries(overrides)) {
      if (v === null || typeof v === "undefined" || v === "") params.delete(k);
      else params.set(k, String(v));
    }
  }
  const qs = params.toString();
  return `/${locale}/search${qs ? `?${qs}` : ""}`;
}

// chuyển intent.maxPrice -> price string cho filter mới
function toPriceParam(maxPrice?: number) {
  if (!maxPrice) return undefined;
  return `-${maxPrice}`; // nghĩa là <= maxPrice
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = params;
  if (!locale) notFound();

  const q = toStr(searchParams.q);
  const sort =
    (toStr(searchParams.sort) as
      | "newest"
      | "oldest"
      | "priceAsc"
      | "priceDesc"
      | "areaAsc"
      | "areaDesc") || "newest";

  // Gợi ý thông minh (không ép)
  const intent = parseSearchIntent(q);

  // Lấy dữ liệu theo filter mới (đã hỗ trợ q/sort/page/pageSize)
  const { items, total, page, pageSize } = await getPropertiesByFilterPaged({
    ...searchParams,
    sort,
  } as any);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">
            Kết quả {q ? <>cho “{q}”</> : "tìm kiếm"}
          </h1>
          <p className="text-sm text-gray-500">{total} tin phù hợp</p>
        </div>

        {/* Sắp xếp (khớp sort mới) */}
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
              href={buildUrl(locale, searchParams, { sort: opt.key, page: 1 })}
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

      {/* Banner gợi ý dựa trên intent (chuyển đúng key filter mới) */}
      {!!q && (
        <div className="rounded-xl border bg-amber-50 p-3 text-amber-900 flex flex-wrap gap-2 items-center">
          <div className="text-sm">
            Gợi ý từ truy vấn: {intent.reasons.join(" · ") || "—"}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl(locale, searchParams, {
                purpose: intent.purpose ?? undefined,
                propertyType: intent.type ?? undefined,
                city: intent.city ?? undefined,
                district: intent.district ?? undefined,
                price: toPriceParam(intent.maxPrice), // ✅ dùng "price" thay vì maxPrice
                page: 1,
              })}
              className="text-xs px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 border"
            >
              Áp dụng khu vực/loại hình/giá gợi ý
            </Link>
            {(searchParams.city ||
              searchParams.district ||
              searchParams.price) && (
              <Link
                href={buildUrl(locale, searchParams, {
                  city: null,
                  district: null,
                  price: null,
                  page: 1,
                })}
                className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border"
              >
                Xoá khu vực/giá đang áp dụng
              </Link>
            )}
          </div>
        </div>
      )}

      {/* FilterBar ngang tái sử dụng (đọc & ghi đúng query mới) */}
      <FilterBar
        initialFilters={searchParams}
        defaultPurpose={
          (toStr(searchParams.purpose) as "buy" | "rent") || "buy"
        }
        defaultType={toStr(searchParams.propertyType) || "can-ho"}
        basePath={`/${locale}/search`} // ✅ tất cả thao tác lọc ở /search
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
            href={buildUrl(locale, searchParams, {
              page: Math.max(1, page - 1),
            })}
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
            href={buildUrl(locale, searchParams, {
              page: Math.min(totalPages, page + 1),
            })}
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
