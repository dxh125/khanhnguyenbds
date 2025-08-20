"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface PriceDropdownProps {
  initialValue?: string;
  className?: string;
  purpose?: "buy" | "rent"; // ✅ thêm prop
}

// Helper: tỷ → VND
const toVND_Billion = (tbn: number) => tbn * 1_000_000_000;
// Helper: triệu → VND
const toVND_Million = (mil: number) => mil * 1_000_000;

const BUY_OPTIONS = [
  { value: `0-${toVND_Billion(1)}`, label: "Dưới 1 tỷ" },
  { value: `${toVND_Billion(1)}-${toVND_Billion(3)}`, label: "1 - 3 tỷ" },
  { value: `${toVND_Billion(3)}-${toVND_Billion(5)}`, label: "3 - 5 tỷ" },
  { value: `${toVND_Billion(5)}-${toVND_Billion(7)}`, label: "5 - 7 tỷ" },
  { value: `${toVND_Billion(7)}-${toVND_Billion(10)}`, label: "7 - 10 tỷ" },
  { value: `${toVND_Billion(10)}-`, label: "Trên 10 tỷ" },
];

const RENT_OPTIONS = [
  { value: `0-${toVND_Million(3)}`, label: "Dưới 3 triệu" },
  { value: `${toVND_Million(3)}-${toVND_Million(5)}`, label: "3 - 5 triệu" },
  { value: `${toVND_Million(5)}-${toVND_Million(10)}`, label: "5 - 10 triệu" },
  { value: `${toVND_Million(10)}-${toVND_Million(20)}`, label: "10 - 20 triệu" },
  { value: `${toVND_Million(20)}-${toVND_Million(50)}`, label: "20 - 50 triệu" },
  { value: `${toVND_Million(50)}-`, label: "Trên 50 triệu" },
];

export default function PriceDropdown({
  initialValue,
  className = "",
  purpose = "buy", // default là mua
}: PriceDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const OPTIONS = purpose === "rent" ? RENT_OPTIONS : BUY_OPTIONS;

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
