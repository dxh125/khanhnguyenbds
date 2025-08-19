// src/components/filters/PropertyTypeDropdown.tsx
"use client";
import React from "react";

export interface DropdownProps {
  initialValue: string;
}

export default function PropertyTypeDropdown({ initialValue }: DropdownProps) {
  const [value, setValue] = React.useState(initialValue || "");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    // TODO: Trigger filter update (router push or callback)
  };

  return (
    <select
      className="border rounded px-3 py-2"
      value={value}
      onChange={handleChange}
    >
      <option value="">Loại hình</option>
      <option value="can-ho">Căn hộ</option>
      <option value="nha-rieng">Nhà riêng</option>
      <option value="dat-nen">Đất nền</option>
      <option value="phong-tro">Phòng trọ</option>
      <option value="nha-xuong">Nhà xưởng</option>
    </select>
  );
}
