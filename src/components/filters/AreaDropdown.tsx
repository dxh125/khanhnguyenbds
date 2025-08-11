"use client";

interface DropdownProps {
  filters?: Record<string, string | string[] | undefined>;
}

export default function AreaDropdown({ filters }: DropdownProps) {
  const currentValue = String(filters?.area || "");

  return (
    <select
      className="border rounded px-2 py-1"
      defaultValue={currentValue}
      onChange={(e) => {
        const params = new URLSearchParams(window.location.search);
        if (e.target.value) params.set("area", e.target.value);
        else params.delete("area");
        window.location.search = params.toString();
      }}
    >
      <option value="">Diện tích</option>
      <option value="duoi-30">Dưới 30 m²</option>
      <option value="30-50">30 - 50 m²</option>
      <option value="50-80">50 - 80 m²</option>
      <option value="80-100">80 - 100 m²</option>
      <option value="tren-100">Trên 100 m²</option>
    </select>
  );
}
