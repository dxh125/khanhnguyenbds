// src/components/filters/Has3DDropdown.tsx
"use client";
import React from "react";

export interface DropdownProps {
  initialValue: string;
  className?: string; // 👈 thêm className
}

export default function Has3DDropdown({
  initialValue,
  className = "",
}: DropdownProps) {
  const [value, setValue] = React.useState(initialValue || "");

  const options = [
    { value: "yes", label: "Có 3D" },
    { value: "no", label: "Không có 3D" },
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
      <option value="">3D</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
