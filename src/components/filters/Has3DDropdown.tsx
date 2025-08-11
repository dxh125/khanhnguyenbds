"use client";

interface DropdownProps {
  filters?: Record<string, string | string[] | undefined>;
}

export default function Has3DDropdown({ filters }: DropdownProps) {
  const currentValue = String(filters?.has3D || "");

  return (
    <select
      className="border rounded px-2 py-1"
      defaultValue={currentValue}
      onChange={(e) => {
        const params = new URLSearchParams(window.location.search);
        if (e.target.value) params.set("has3D", e.target.value);
        else params.delete("has3D");
        window.location.search = params.toString();
      }}
    >
      <option value="">Có 3D</option>
      <option value="true">Có</option>
      <option value="false">Không</option>
    </select>
  );
}
