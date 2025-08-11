"use client";

import PropertyTypeDropdown from "./PropertyTypeDropdown";
import PriceDropdown from "./PriceDropdown";
import AreaDropdown from "./AreaDropdown";
import Has3DDropdown from "./Has3DDropdown";
import AdvancedFiltersModal from "./AdvancedFiltersModal";

interface FilterBarProps {
  initialFilters?: Record<string, string | string[] | undefined>;
  purpose?: "buy" | "rent";
}

export default function FilterBar({ initialFilters, purpose = "buy" }: FilterBarProps) {
  // Nếu đã có propertyType cố định => ẩn dropdown Loại hình
  const hidePropertyType = Boolean(initialFilters?.propertyType);

  // Hàm áp dụng filter nâng cao
  const handleAdvancedApply = (vals: any) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(vals).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
      else params.delete(key);
    });
    window.location.search = params.toString();
  };

  // Hàm reset filter nâng cao
  const handleAdvancedReset = () => {
    const params = new URLSearchParams(window.location.search);
    ["bedrooms", "bathrooms", "direction", "status"].forEach((key) =>
      params.delete(key)
    );
    window.location.search = params.toString();
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Ẩn "Loại hình" khi propertyType đã cố định */}
      {!hidePropertyType && <PropertyTypeDropdown filters={initialFilters} />}

      {/* Khoảng giá - hiển thị khác nhau cho mua / thuê */}
      <PriceDropdown filters={initialFilters} purpose={purpose} />

      {/* Các bộ lọc khác */}
      <AreaDropdown filters={initialFilters} />
      <Has3DDropdown filters={initialFilters} />

      {/* Bộ lọc nâng cao */}
      <AdvancedFiltersModal
        initialValues={{
          bedrooms: String(initialFilters?.bedrooms || ""),
          bathrooms: String(initialFilters?.bathrooms || ""),
          direction: String(initialFilters?.direction || ""),
          status: String(initialFilters?.status || ""),
        }}
        onApply={handleAdvancedApply}
        onReset={handleAdvancedReset}
      />
    </div>
  );
}
