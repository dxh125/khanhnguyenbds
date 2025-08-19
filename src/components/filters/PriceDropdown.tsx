// src/components/filters/PriceDropdown.tsx
"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface PriceDropdownProps {
  initialValue: string;
  className?: string;
}

export default function PriceDropdown({
  initialValue,
  className = "",
}: PriceDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(initialValue || "");

  const options = [
    { value: "0-1000", label: "Dưới 1 tỷ" },
    { value: "1000-3000", label: "1 - 3 tỷ" },
    { value: "3000-5000", label: "3 - 5 tỷ" },
    { value: "5000-7000", label: "5 - 7 tỷ" },
    { value: "7000-10000", label: "7 - 10 tỷ" },
    { value: "10000+", label: "Trên 10 tỷ" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // ✅ Giữ các param khác và chỉ cập nhật priceRange
    const params = new URLSearchParams(searchParams.toString());
    if (newValue) {
      params.set("priceRange", newValue);
    } else {
      params.delete("priceRange");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      className={`border rounded px-3 py-2 ${className}`}
      value={value}
      onChange={handleChange}
    >
      <option value="">Khoảng giá</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
