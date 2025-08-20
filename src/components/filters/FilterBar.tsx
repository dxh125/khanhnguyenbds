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
}

export default function FilterBar({
  initialFilters,
  className,
  defaultPurpose = "buy",
  defaultType = "can-ho",
  withFrame = false,
  dense = true,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const h = dense ? "h-10" : "h-11";
  const inputBase = `${h} text-sm rounded-lg px-3 border border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 bg-white`;

  // ---- NEW: suy ra purpose hiện tại ----
  const inferPurpose = (): "buy" | "rent" => {
    // ưu tiên từ initialFilters nếu có
    const p = (initialFilters.purpose as string) || "";
    if (p === "buy" || p === "rent") return p as "buy" | "rent";
    // fallback từ URL
    const seg = (pathname || "/").split("/").filter(Boolean);
    const maybe = seg[1];
    return (maybe === "buy" || maybe === "rent") ? (maybe as "buy" | "rent") : defaultPurpose;
  };
  const currentPurpose = inferPurpose();
  // --------------------------------------

  const locationFilters = {
    city: (initialFilters.city as string) || "",
    district: (initialFilters.district as string) || "",
    ward: (initialFilters.ward as string) || "",
  };

  const keepQS = () => {
    const keys = ["price","area","has3D","bedrooms","bathrooms","direction","status","legal","project"];
    const obj: Record<string, string> = {};
    keys.forEach(k => { const v = searchParams.get(k); if (v) obj[k] = v; });
    return obj;
  };

  const parseContext = () => {
    const seg = (pathname || "/").split("/").filter(Boolean);
    const locale = seg[0] || "vi";
    const maybePurpose = seg[1];
    const maybeType = seg[2];
    const inBuyRent = maybePurpose === "buy" || maybePurpose === "rent";
    return {
      locale,
      purpose: (inBuyRent ? (maybePurpose as "buy"|"rent") : currentPurpose),
      type: inBuyRent && maybeType ? maybeType : (defaultType || "can-ho"),
    };
  };

  const s = (v?: string) => (v || "").replaceAll("/", "");

  const handleLocationChange = (updated: { city?: string; district?: string; ward?: string }) => {
    const { locale, purpose, type } = parseContext();
    const city = s(updated.city);
    const district = s(updated.district);
    const ward = s(updated.ward);

    const segments = ["", locale, purpose, type];
    if (city) segments.push(city);
    if (district) segments.push(district);
    if (ward) segments.push(ward);

    const absolutePath = segments.join("/");
    const qs = new URLSearchParams(keepQS()).toString();
    router.replace(qs ? `${absolutePath}?${qs}` : absolutePath);
  };

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
            initialValue={(initialFilters.price as string) || ""}
            className={inputBase + " w-full"}
            purpose={currentPurpose}
          />
        </div>

        <div className="min-w-[160px]">
          <AreaDropdown
            initialValue={(initialFilters.area as string) || ""}
            className={inputBase + " w-full"}
          />
        </div>

        <div className="min-w-[120px]">
          <Has3DDropdown
            initialValue={(initialFilters.has3D as string) || ""}
            className={inputBase + " w-full"}
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
          />
        </div>
      </div>
    </div>
  );
}
