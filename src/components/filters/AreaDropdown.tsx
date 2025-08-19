// src/components/filters/AreaDropdown.tsx
"use client";
import React from "react";

export interface DropdownProps {
  initialValue: string;
  className?: string; // 👈 thêm className
}

export default function AreaDropdown({
  initialValue,
  className = "",
}: DropdownProps) {
  const [value, setValue] = React.useState(initialValue || "");

  const areaOptions = [
    { value: "0-30", label: "Dưới 30 m²" },
    { value: "30-50", label: "30 - 50 m²" },
    { value: "50-80", label: "50 - 80 m²" },
    { value: "80-100", label: "80 - 100 m²" },
    { value: "100-150", label: "100 - 150 m²" },
    { value: "150-", label: "Trên 150 m²" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    // TODO: Trigger filter update (router push hoặc callback)
  };

  return (
    <select
      className={`border rounded px-3 py-2 ${className}`} // 👈 dùng className ngoài
      value={value}
      onChange={handleChange}
    >
      <option value="">Diện tích</option>
      {areaOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
