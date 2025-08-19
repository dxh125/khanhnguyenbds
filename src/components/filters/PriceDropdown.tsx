// src/components/filters/PriceDropdown.tsx
"use client";
import React from "react";

export interface DropdownProps {
  initialValue: string;
  purpose?: "buy" | "rent";
  className?: string; // 👈 thêm className
}

export default function PriceDropdown({
  initialValue,
  purpose = "buy",
  className = "",
}: DropdownProps) {
  const [value, setValue] = React.useState(initialValue || "");

  const priceOptionsBuy = [
    { value: "0-1000000000", label: "Dưới 1 tỷ" },
    { value: "1000000000-3000000000", label: "1 - 3 tỷ" },
    { value: "3000000000-5000000000", label: "3 - 5 tỷ" },
    { value: "5000000000-10000000000", label: "5 - 10 tỷ" },
    { value: "10000000000-", label: "Trên 10 tỷ" }
  ];

  const priceOptionsRent = [
    { value: "0-3000000", label: "Dưới 3 triệu" },
    { value: "3000000-5000000", label: "3 - 5 triệu" },
    { value: "5000000-10000000", label: "5 - 10 triệu" },
    { value: "10000000-20000000", label: "10 - 20 triệu" },
    { value: "20000000-", label: "Trên 20 triệu" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    // TODO: Trigger filter update (router push or callback)
  };

  const options = purpose === "rent" ? priceOptionsRent : priceOptionsBuy;

  return (
    <select
      className={`border rounded px-3 py-2 ${className}`} // 👈 dùng className ngoài vào
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
