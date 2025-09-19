// src/components/filters/Has3DDropdown.tsx
"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface Has3DDropdownProps {
  initialValue?: string; // optional, sẽ sync từ URL nếu có
  className?: string;
  onChange?: (value: string) => void; // optional: FilterBar điều khiển điều hướng
}

const OPTIONS = [
  { value: "true", label: "Có 3D" },
  { value: "false", label: "Không có 3D" },
];

export default function Has3DDropdown({
  initialValue,
  className = "",
  onChange,
}: Has3DDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ưu tiên đọc từ URL (?has3D=...), fallback initialValue
  const urlValue = searchParams.get("has3D") || "";
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
    if (newValue) params.set("has3D", newValue);
    else params.delete("has3D");
    router.replace(`?${params.toString()}`);
  };

  return (
    <select
      className={`border rounded px-3 py-2 ${className}`}
      value={value}
      onChange={handleChange}
    >
      <option value="">3D (tất cả)</option>
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
