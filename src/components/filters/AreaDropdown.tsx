// src/components/filters/AreaDropdown.tsx
"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface DropdownProps {
  initialValue?: string; // sẽ đọc từ URL nếu có
  className?: string;
  onChange?: (value: string) => void; // optional: FilterBar điều khiển điều hướng
}

const OPTIONS = [
  { value: "0-30", label: "Dưới 30 m²" },
  { value: "30-50", label: "30 - 50 m²" },
  { value: "50-80", label: "50 - 80 m²" },
  { value: "80-100", label: "80 - 100 m²" },
  { value: "100-150", label: "100 - 150 m²" },
  { value: "150+", label: "Trên 150 m²" }, // 👈 dùng min+
];

export default function AreaDropdown({
  initialValue,
  className = "",
  onChange,
}: DropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ưu tiên giá trị từ URL (area), fallback initialValue
  const urlValue = searchParams.get("area") || "";
  const [value, setValue] = React.useState<string>(urlValue || initialValue || "");

  React.useEffect(() => {
    setValue(urlValue || initialValue || "");
  }, [urlValue, initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (onChange) {
      // FilterBar sẽ điều hướng => tránh double navigation
      onChange(newValue);
      return;
    }

    // Fallback legacy: tự điều hướng khi KHÔNG có onChange
    const params = new URLSearchParams(searchParams.toString());
    if (newValue) params.set("area", newValue);
    else params.delete("area");
    router.replace(`?${params.toString()}`);
  };

  return (
    <select
      className={`border rounded px-3 py-2 ${className}`}
      value={value}
      onChange={handleChange}
    >
      <option value="">Diện tích</option>
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
