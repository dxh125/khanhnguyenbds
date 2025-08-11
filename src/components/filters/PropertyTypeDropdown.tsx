"use client";

interface DropdownProps {
  filters?: Record<string, string | string[] | undefined>;
}

export default function PropertyTypeDropdown({ filters }: DropdownProps) {
  const currentValue = String(filters?.propertyType || "");

  return (
    <select
      className="border rounded px-2 py-1"
      defaultValue={currentValue}
      onChange={(e) => {
        const params = new URLSearchParams(window.location.search);
        if (e.target.value) params.set("propertyType", e.target.value);
        else params.delete("propertyType");
        window.location.search = params.toString();
      }}
    >
      <option value="">Loại hình</option>
      <option value="can-ho">Căn hộ</option>
      <option value="nha-rieng">Nhà riêng</option>
      <option value="dat-nen">Đất nền</option>
    </select>
  );
}
