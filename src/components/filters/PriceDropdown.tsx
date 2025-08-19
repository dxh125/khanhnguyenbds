// src/components/filters/PriceDropdown.tsx
"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface PriceDropdownProps {
  initialValue?: string; // optional: sẽ sync từ URL nếu không truyền
  className?: string;
}

// Helper: tỷ → VND
const b = (tbn: number) => tbn * 1_000_000_000;

const OPTIONS = [
  { value: `0-${b(1)}`, label: "Dưới 1 tỷ" },
  { value: `${b(1)}-${b(3)}`, label: "1 - 3 tỷ" },
  { value: `${b(3)}-${b(5)}`, label: "3 - 5 tỷ" },
  { value: `${b(5)}-${b(7)}`, label: "5 - 7 tỷ" },
  { value: `${b(7)}-${b(10)}`, label: "7 - 10 tỷ" },
  { value: `${b(10)}-`, label: "Trên 10 tỷ" }, // dải mở: min-
];

export default function PriceDropdown({
  initialValue,
  className = "",
}: PriceDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ưu tiên giá từ URL (price), fallback initialValue
  const urlValue = searchParams.get("price") || "";
  const [value, setValue] = React.useState<string>(urlValue || initialValue || "");

  React.useEffect(() => {
    setValue(urlValue || initialValue || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    const params = new URLSearchParams(searchParams.toString());
    if (newValue) params.set("price", newValue);
    else params.delete("price");

    // Giữ nguyên các param khác
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      className={`border rounded px-3 py-2 ${className}`}
      value={value}
      onChange={handleChange}
    >
      <option value="">Khoảng giá</option>
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
