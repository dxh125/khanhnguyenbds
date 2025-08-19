// src/components/filters/Has3DDropdown.tsx
"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface Has3DDropdownProps {
  initialValue: string;
  className?: string;
}

export default function Has3DDropdown({
  initialValue,
  className = "",
}: Has3DDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(initialValue || "");

  const options = [
    { value: "yes", label: "Có 3D" },
    { value: "no", label: "Không có 3D" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // ✅ Giữ các param khác, chỉ update has3D
    const params = new URLSearchParams(searchParams.toString());
    if (newValue) {
      params.set("has3D", newValue);
    } else {
      params.delete("has3D");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      className={`border rounded px-3 py-2 ${className}`}
      value={value}
      onChange={handleChange}
    >
      <option value="">3D</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
