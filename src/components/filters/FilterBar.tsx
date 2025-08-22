// src/components/filters/FilterBar.tsx
"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PriceDropdown from "./PriceDropdown";
import AreaDropdown from "./AreaDropdown";
import Has3DDropdown from "./Has3DDropdown";
import LocationFilter from "./LocationFilter";
import AdvancedFiltersModal from "./AdvancedFiltersModal";

interface FilterBarProps {
  initialFilters: Record<string, string | string[] | undefined>;
  className?: string;
  defaultPurpose?: "buy" | "rent";
  defaultType?: string;
  withFrame?: boolean;
  dense?: boolean;

  /** ✅ Khi truyền, mọi thay đổi filter sẽ điều hướng về path này (ví dụ: `/${locale}/search`) */
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
  const inputBase = `${h} text-sm rounded-lg px-3 border border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 bg-white`;

  // ---- Suy ra purpose hiện tại (ưu tiên query/initialFilters, fallback theo path) ----
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
      if (!QS_KEYS_TO_KEEP.includes(k) && !["city","district","ward"].includes(k)) {
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

  // Lấy context hiện tại của route cũ
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
  // - Nếu KHÔNG có basePath: giữ hành vi cũ → encode vào path segments
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

  // (Gợi ý) Nếu sau này bạn muốn FilterBar điều khiển cả price/area/has3D…
  // hãy tạo 1 hàm applyFilters và gọi nó ở các onChange tương ứng.
  const applyFilters = (patch: Record<string, string | number | boolean | null | undefined>) => {
    const targetPath = basePath || pathname;
    const params = mergeQuery(patch);
    const qs = params.toString();
    router.replace(qs ? `${targetPath}?${qs}` : targetPath);
  };

  // Lấy giá trị hiện tại để truyền vào control (giữ như bạn đang làm)
  const priceInit = (initialFilters.price as string) || "";
  const areaInit = (initialFilters.area as string) || "";
  const has3DInit = (initialFilters.has3D as string) || "";

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
      <div className="flex gap-2 md:gap-3 md:flex-wrap lg:flex-nowrap min-w-max">
        <div className="min-w-[260px] lg:min-w-[300px]">
          <LocationFilter
            filters={locationFilters}
            compact
            className={inputBase + " w-full"}
            onChange={handleLocationChange}
          />
        </div>

        {/* ✅ truyền purpose cho PriceDropdown để switch thang giá */}
        <div className="min-w-[160px]">
          <PriceDropdown
            initialValue={priceInit}
            className={inputBase + " w-full"}
            purpose={currentPurpose}
            // Nếu PriceDropdown hỗ trợ onChange(value: string), bật dòng dưới:
            // onChange={(val) => applyFilters({ price: val || null })}
          />
        </div>

        <div className="min-w-[160px]">
          <AreaDropdown
            initialValue={areaInit}
            className={inputBase + " w-full"}
            // Nếu AreaDropdown hỗ trợ onChange(value: string), bật dòng dưới:
            // onChange={(val) => applyFilters({ area: val || null })}
          />
        </div>

        <div className="min-w-[120px]">
          <Has3DDropdown
            initialValue={has3DInit}
            className={inputBase + " w-full"}
            // Nếu Has3DDropdown hỗ trợ onChange(value: string), bật dòng dưới:
            // onChange={(val) => applyFilters({ has3D: val || null })}
          />
        </div>

        <div className="min-w-[120px]">
          <AdvancedFiltersModal
            buttonLabel="Thêm…"
            className={[
              "inline-flex items-center justify-center w-full",
              h,
              "text-sm rounded-lg px-3 border border-black/20",
              "bg-white hover:bg-gray-50 transition-colors",
            ].join(" ")}
            // Nếu AdvancedFiltersModal có onApply trả về object patch, bật dòng dưới:
            // onApply={(patch) => applyFilters(patch)}
          />
        </div>
      </div>
    </div>
  );
}
