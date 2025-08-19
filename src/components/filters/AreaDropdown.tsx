"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface DropdownProps {
  initialValue: string;
  className?: string;
}

export default function AreaDropdown({ initialValue, className = "" }: DropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    const newValue = e.target.value;
    setValue(newValue);

    // tạo URL mới giữ nguyên params cũ
    const params = new URLSearchParams(searchParams.toString());
    if (newValue) {
      params.set("areaRange", newValue);
    } else {
      params.delete("areaRange");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      className={`border rounded px-3 py-2 ${className}`}
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
