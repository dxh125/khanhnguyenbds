// src/components/filters/AdvancedFiltersModal.tsx
"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface AdvancedFiltersValues {
  bedrooms: string;
  bathrooms: string;
  direction: string;
  status: string;
}

export interface AdvancedFiltersModalProps {
  buttonLabel?: string;
  values: AdvancedFiltersValues;
  onApply: (vals: AdvancedFiltersValues) => void;
  onReset: () => void;
  className?: string;
}

export default function AdvancedFiltersModal({
  buttonLabel = "Bộ lọc nâng cao",
  values,
  onApply,
  onReset,
  className = "",
}: AdvancedFiltersModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [localValues, setLocalValues] = useState(values);

  const handleChange = (key: keyof AdvancedFiltersValues, value: string) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    // ✅ Update URL với các giá trị lọc nâng cao
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(localValues).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`?${params.toString()}`);

    onApply(localValues);
    setOpen(false);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["bedrooms", "bathrooms", "direction", "status"].forEach((key) =>
      params.delete(key)
    );
    router.push(`?${params.toString()}`);

    onReset();
    setLocalValues({ bedrooms: "", bathrooms: "", direction: "", status: "" });
  };

  return (
    <>
      {/* Nút mở modal */}
      <button
        className={`border px-3 py-1 rounded bg-white hover:bg-gray-100 ${className}`}
        onClick={() => setOpen(true)}
      >
        {buttonLabel}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white w-full max-w-lg rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Bộ lọc nâng cao</h3>
              <button
                className="text-sm text-gray-500 hover:text-black"
                onClick={() => setOpen(false)}
              >
                Đóng
              </button>
            </div>

            {/* Nội dung form */}
            <div className="flex flex-wrap gap-2">
              <input
                className="border rounded px-2 py-1 w-24"
                placeholder="Phòng ngủ"
                value={localValues.bedrooms}
                onChange={(e) => handleChange("bedrooms", e.target.value)}
              />
              <input
                className="border rounded px-2 py-1 w-24"
                placeholder="Phòng tắm"
                value={localValues.bathrooms}
                onChange={(e) => handleChange("bathrooms", e.target.value)}
              />
              <select
                className="border rounded px-2 py-1"
                value={localValues.direction}
                onChange={(e) => handleChange("direction", e.target.value)}
              >
                <option value="">Hướng nhà</option>
                <option value="Đông">Đông</option>
                <option value="Tây">Tây</option>
                <option value="Nam">Nam</option>
                <option value="Bắc">Bắc</option>
                <option value="Đông Bắc">Đông Bắc</option>
                <option value="Đông Nam">Đông Nam</option>
                <option value="Tây Bắc">Tây Bắc</option>
                <option value="Tây Nam">Tây Nam</option>
              </select>
              <select
                className="border rounded px-2 py-1"
                value={localValues.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="">Tình trạng</option>
                <option value="available">Đang bán/cho thuê</option>
                <option value="sold">Đã bán/đã thuê</option>
              </select>
            </div>

            {/* Nút hành động */}
            <div className="mt-4 flex justify-between">
              <button
                className="border px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                onClick={handleApply}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
