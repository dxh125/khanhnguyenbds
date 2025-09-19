// src/components/filters/FilterBar.tsx
"use client";
import React, { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PriceDropdown from "./PriceDropdown";
import AreaDropdown from "./AreaDropdown";
import Has3DDropdown from "./Has3DDropdown";
import LocationFilter from "./LocationFilter";
import AdvancedFiltersModal from "./AdvancedFiltersModal";
import SaveSearchButton from "@/components/search/SaveSearchButton";

interface FilterBarProps {
  initialFilters: Record<string, string | string[] | undefined>;
  className?: string;
  defaultPurpose?: "buy" | "rent";
  defaultType?: string;
  withFrame?: boolean;
  dense?: boolean;
  /** Khi truyền, mọi thay đổi filter sẽ điều hướng về path này (vd: `/${locale}/search`) */
  basePath?: string;
}

export default function FilterBar({
  initialFilters,
  className,
  defaultPurpose = "buy",
  defaultType = "can-ho",
  withFrame = false,
  dense = true,
  basePath,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const h = dense ? "h-10" : "h-11";
  const inputBase =
    `${h} text-sm rounded-lg px-3 border border-black/20 ` +
    `focus:outline-none focus:ring-2 focus:ring-black/10 bg-white`;

  // ---- Suy ra purpose hiện tại ----
  const inferPurpose = (): "buy" | "rent" => {
    const p =
      (initialFilters.purpose as string) ||
      searchParams.get("purpose") ||
      "";
    if (p === "buy" || p === "rent") return p;
    const seg = (pathname || "/").split("/").filter(Boolean);
    const maybe = seg[1];
    return maybe === "buy" || maybe === "rent" ? (maybe as "buy" | "rent") : defaultPurpose;
  };
  const currentPurpose = inferPurpose();

  // ---- Đọc filter vị trí từ initialFilters (ưu tiên) ----
  const locationFilters = {
    city: (initialFilters.city as string) || "",
    district: (initialFilters.district as string) || "",
    ward: (initialFilters.ward as string) || "",
  };

  // Các key cần giữ lại khi thay đổi vị trí / filter
  const QS_KEYS_TO_KEEP = [
    "q",
    "sort",
    "purpose",
    "propertyType",
    "price",
    "area",
    "has3D",
    "bedrooms",
    "bathrooms",
    "direction",
    "status",
    "legal",
    "project",
  ];

  // build URLSearchParams mới từ current + patch
  const mergeQuery = (patch: Record<string, string | number | boolean | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    // chỉ giữ các key quan trọng
    Array.from(params.keys()).forEach((k) => {
      if (!QS_KEYS_TO_KEEP.includes(k) && !["city", "district", "ward"].includes(k)) {
        params.delete(k);
      }
    });

    // merge patch
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || typeof v === "undefined" || v === "" || v === "all") {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    });

    // reset phân trang khi thay đổi filter
    params.delete("page");

    return params;
  };

  // Lấy context route hiện tại (legacy segment)
  const parseContext = () => {
    const seg = (pathname || "/").split("/").filter(Boolean);
    const locale = seg[0] || "vi";
    const maybePurpose = seg[1];
    const maybeType = seg[2];
    const inBuyRent = maybePurpose === "buy" || maybePurpose === "rent";
    return {
      locale,
      purpose: inBuyRent ? (maybePurpose as "buy" | "rent") : currentPurpose,
      type: inBuyRent && maybeType ? maybeType : (defaultType || "can-ho"),
    };
  };

  // sanitize slug
  const s = (v?: string) => (v || "").replaceAll("/", "");

  // ✅ Thay đổi vị trí:
  // - Nếu có basePath (ví dụ /vi/search): dùng query `city/district/ward`
  // - Nếu KHÔNG có basePath: legacy → encode vào path segments
  const handleLocationChange = (updated: { city?: string; district?: string; ward?: string }) => {
    const city = s(updated.city);
    const district = s(updated.district);
    const ward = s(updated.ward);

    if (basePath) {
      const params = mergeQuery({ city, district, ward });
      const qs = params.toString();
      router.replace(qs ? `${basePath}?${qs}` : basePath);
    } else {
      // legacy: /:locale/:purpose/:type/[:city]/[:district]/[:ward]
      const { locale, purpose, type } = parseContext();
      const segments = ["", locale, purpose, type];
      if (city) segments.push(city);
      if (district) segments.push(district);
      if (ward) segments.push(ward);
      const absolutePath = segments.join("/");
      const keep = new URLSearchParams();
      // giữ lại QS chuẩn
      QS_KEYS_TO_KEEP.forEach((k) => {
        const v = searchParams.get(k);
        if (v) keep.set(k, v);
      });
      const qs = keep.toString();
      router.replace(qs ? `${absolutePath}?${qs}` : absolutePath);
    }
  };

  // Hàm apply patch filter vào URL
  const applyFilters = (patch: Record<string, string | number | boolean | null | undefined>) => {
    const targetPath = basePath || pathname;
    const params = mergeQuery(patch);
    const qs = params.toString();
    router.replace(qs ? `${targetPath}?${qs}` : targetPath);
  };

  // Giá trị hiện tại cho các control
  const priceInit = (initialFilters.price as string) || searchParams.get("price") || "";
  const areaInit = (initialFilters.area as string) || searchParams.get("area") || "";
  const has3DInit = (initialFilters.has3D as string) || searchParams.get("has3D") || "";
  const currentSort = (searchParams.get("sort") as string) || "newest";

  // Object filters hiện tại (đưa vào SaveSearchButton)
  const currentFiltersForSave = useMemo(() => {
    const obj: Record<string, any> = {};
    // lấy từ URL
    searchParams.forEach((v, k) => {
      if (
        QS_KEYS_TO_KEEP.includes(k) ||
        k === "city" || k === "district" || k === "ward"
      ) {
        obj[k] = v;
      }
    });
    // đảm bảo có purpose
    if (!obj.purpose) obj.purpose = currentPurpose;
    // propertyType fallback theo initial
    if (!obj.propertyType && initialFilters.propertyType) {
      obj.propertyType = initialFilters.propertyType;
    }
    // location fallback theo initialFilters nếu URL chưa có
    obj.city = obj.city || locationFilters.city || undefined;
    obj.district = obj.district || locationFilters.district || undefined;
    obj.ward = obj.ward || locationFilters.ward || undefined;
    return obj;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, currentPurpose, initialFilters.propertyType]);

  return (
    <div
      className={[
        "w-full",
        withFrame
          ? "rounded-2xl border border-black/15 bg-white/70 backdrop-blur-sm shadow-sm p-3 md:p-4"
          : "rounded-xl bg-white/60 backdrop-blur-sm p-2 md:p-3",
        "overflow-x-auto no-scrollbar",
        className || "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-2">
        {/* Hàng 1: dãy filter chính */}
        <div className="flex gap-2 md:gap-3 md:flex-wrap lg:flex-nowrap min-w-max">
          <div className="min-w-[260px] lg:min-w-[300px]">
            <LocationFilter
              filters={locationFilters}
              compact
              className={inputBase + " w-full"}
              onChange={handleLocationChange}
            />
          </div>

          {/* Price */}
          <div className="min-w-[160px]">
            <PriceDropdown
              initialValue={priceInit}
              className={inputBase + " w-full"}
              purpose={currentPurpose}
              onChange={(val: string) => applyFilters({ price: val || null })}
            />
          </div>

          {/* Area */}
          <div className="min-w-[160px]">
            <AreaDropdown
              initialValue={areaInit}
              className={inputBase + " w-full"}
              onChange={(val: string) => applyFilters({ area: val || null })}
            />
          </div>

          {/* 3D */}
          <div className="min-w-[120px]">
            <Has3DDropdown
              initialValue={has3DInit}
              className={inputBase + " w-full"}
              onChange={(val: string) => applyFilters({ has3D: val || null })}
            />
          </div>

          {/* Nâng cao */}
          <div className="min-w-[120px]">
            <AdvancedFiltersModal
              buttonLabel="Thêm…"
              className={[
                "inline-flex items-center justify-center w-full",
                h,
                "text-sm rounded-lg px-3 border border-black/20",
                "bg-white hover:bg-gray-50 transition-colors",
              ].join(" ")}
              onApply={(patch: Record<string, any>) => applyFilters(patch)}
            />
          </div>

          {/* Sort */}
          <div className="min-w-[160px]">
            <select
              className={inputBase + " w-full"}
              value={currentSort}
              onChange={(e) => applyFilters({ sort: e.target.value })}
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá ↑</option>
              <option value="price-desc">Giá ↓</option>
              <option value="area-asc">Diện tích ↑</option>
              <option value="area-desc">Diện tích ↓</option>
            </select>
          </div>
        </div>

        {/* Hàng 2: hành động phụ (Save search…) */}
        <div className="flex gap-2 justify-end">
          <SaveSearchButton
            filters={currentFiltersForSave}
            sort={currentSort}
          />
        </div>
      </div>
    </div>
  );
}
