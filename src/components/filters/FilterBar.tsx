// src/components/filters/FilterBar.tsx
"use client";
import React from "react";
import PropertyTypeDropdown from "./PropertyTypeDropdown";
import PriceDropdown from "./PriceDropdown";
import AreaDropdown from "./AreaDropdown";
import Has3DDropdown from "./Has3DDropdown";
import LocationFilter from "./LocationFilter";
import AdvancedFiltersModal from "./AdvancedFiltersModal";

interface FilterBarProps {
  initialFilters: Record<string, string | string[] | undefined>;
  purpose?: string;
}

export default function FilterBar({ initialFilters }: FilterBarProps) {
  // Đồng bộ chiều cao/size cho UI
  const filterClass = "h-10 text-sm border rounded px-3";

  // Lấy đúng 3 field location cho LocationFilter
  const locationFilters = {
    city: (initialFilters.city as string) || "",
    district: (initialFilters.district as string) || "",
    ward: (initialFilters.ward as string) || "",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Địa lý */}
      <LocationFilter filters={locationFilters} compact className={filterClass} />

      {/* Loại hình (nếu cần mở lại) */}
      {/* <PropertyTypeDropdown className={filterClass} /> */}

      {/* Khoảng giá (URL param: price = "min-max" hoặc "min-") */}
      <PriceDropdown
        initialValue={(initialFilters.price as string) || ""}
        className={filterClass}
      />

      {/* Diện tích (URL param: area = "min-max" hoặc "min-") */}
      <AreaDropdown
        initialValue={(initialFilters.area as string) || ""}
        className={filterClass}
      />

      {/* 3D (URL param: has3D = "true" | "false") */}
      <Has3DDropdown
        initialValue={(initialFilters.has3D as string) || ""}
        className={filterClass}
      />

      {/* Bộ lọc nâng cao: tự đọc/ghi URL, KHÔNG cần values/onApply/onReset */}
      <AdvancedFiltersModal buttonLabel="Thêm…" className={filterClass} />
    </div>
  );
}
