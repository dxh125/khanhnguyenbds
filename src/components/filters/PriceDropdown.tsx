"use client";

interface DropdownProps {
  filters?: Record<string, string | string[] | undefined>;
  purpose?: "buy" | "rent";
}

export default function PriceDropdown({ filters, purpose = "buy" }: DropdownProps) {
  const currentValue = String(filters?.price || "");

  // Khoảng giá cho mua
  const buyOptions = [
    { value: "", label: "Khoảng giá" },
    { value: "duoi-1-ty", label: "Dưới 1 tỷ" },
    { value: "1-2-ty", label: "1 - 2 tỷ" },
    { value: "2-3-ty", label: "2 - 3 tỷ" },
    { value: "3-5-ty", label: "3 - 5 tỷ" },
    { value: "tren-5-ty", label: "Trên 5 tỷ" },
  ];

  // Khoảng giá cho thuê
  const rentOptions = [
    { value: "", label: "Khoảng giá" },
    { value: "duoi-3-trieu", label: "Dưới 3 triệu" },
    { value: "3-5-trieu", label: "3 - 5 triệu" },
    { value: "5-10-trieu", label: "5 - 10 triệu" },
    { value: "10-20-trieu", label: "10 - 20 triệu" },
    { value: "tren-20-trieu", label: "Trên 20 triệu" },
  ];

  const options = purpose === "rent" ? rentOptions : buyOptions;

  return (
    <select
      className="border rounded px-2 py-1"
      defaultValue={currentValue}
      onChange={(e) => {
        const params = new URLSearchParams(window.location.search);
        if (e.target.value) params.set("price", e.target.value);
        else params.delete("price");
        window.location.search = params.toString();
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
