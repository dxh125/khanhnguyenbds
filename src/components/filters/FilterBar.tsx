// src/components/filters/FilterBar.tsx
"use client";
import React from "react";
import PropertyTypeDropdown from "./PropertyTypeDropdown";
import PriceDropdown from "./PriceDropdown";
import AreaDropdown from "./AreaDropdown";
import Has3DDropdown from "./Has3DDropdown";
import LocationFilter from "./LocationFilter";
import AdvancedFiltersModal, { AdvancedFiltersValues } from "./AdvancedFiltersModal";

interface FilterBarProps {
  initialFilters: Record<string, string | string[] | undefined>;
  purpose?: string; // 👈 thêm
}

export default function FilterBar({ initialFilters }: FilterBarProps) {
  const [advancedValues, setAdvancedValues] = React.useState<AdvancedFiltersValues>({
    bedrooms: "",
    bathrooms: "",
    direction: "",
    status: "",
  });

  // 🎯 Class chung để các filter đồng chiều cao
  const filterClass = "h-10 text-sm border rounded px-3";

  return (
    <div className="flex flex-wrap gap-2">
      {/* Địa chỉ */}
      <LocationFilter filters={initialFilters} compact className={filterClass} />

      {/* Loại hình */}
      {/* <PropertyTypeDropdown
        initialValue={(initialFilters.propertyType as string) || ""}
        className={filterClass}
      /> */}

      {/* Khoảng giá */}
      <PriceDropdown
        initialValue={(initialFilters.priceRange as string) || ""}
        className={filterClass}
      />

      {/* Diện tích */}
      <AreaDropdown
        initialValue={(initialFilters.areaRange as string) || ""}
        className={filterClass}
      />

      {/* 3D */}
      <Has3DDropdown
        initialValue={(initialFilters.has3D as string) || ""}
        className={filterClass}
      />

      {/* Nút "Thêm" */}
      <AdvancedFiltersModal
        buttonLabel="Thêm"
        className={filterClass}
        values={advancedValues}
        onApply={(vals) => setAdvancedValues(vals)}
        onReset={() =>
          setAdvancedValues({ bedrooms: "", bathrooms: "", direction: "", status: "" })
        }
      />

    </div>
  );
}
