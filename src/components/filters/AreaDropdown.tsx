// src/components/filters/AreaDropdown.tsx
"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface DropdownProps {
  initialValue?: string; // cho phép bỏ qua, sẽ đọc từ URL nếu có
  className?: string;
}

const OPTIONS = [
  { value: "0-30", label: "Dưới 30 m²" },
  { value: "30-50", label: "30 - 50 m²" },
  { value: "50-80", label: "50 - 80 m²" },
  { value: "80-100", label: "80 - 100 m²" },
  { value: "100-150", label: "100 - 150 m²" },
  { value: "150-", label: "Trên 150 m²" }, // dải mở: min-
];

export default function AreaDropdown({ initialValue, className = "" }: DropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ưu tiên giá trị từ URL (area), fallback initialValue
  const urlValue = searchParams.get("area") || "";
  const [value, setValue] = React.useState<string>(urlValue || initialValue || "");

  React.useEffect(() => {
    setValue(urlValue || initialValue || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    const params = new URLSearchParams(searchParams.toString());
    if (newValue) params.set("area", newValue);
    else params.delete("area");

    router.push(`?${params.toString()}`);
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
