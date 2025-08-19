// src/components/filters/AdvancedFiltersModal.tsx
"use client";
import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface AdvancedFiltersValues {
  bedrooms: string;   // số nguyên, server nên parse gte
  bathrooms: string;  // số nguyên, server nên parse gte
  direction: string;  // slug: dong/tay/nam/bac/dong-bac/...
  status: string;     // available/sold (theo seed)
  legal: string;      // so-do/so-hong/hop-dong-thue (theo seed)
  project: string;    // slug dự án: ecopark/masteri-thao-dien/...
}

export interface AdvancedFiltersModalProps {
  buttonLabel?: string;
  className?: string;
}

const DIRECTION_OPTIONS = [
  { value: "", label: "Hướng nhà" },
  { value: "dong", label: "Đông" },
  { value: "tay", label: "Tây" },
  { value: "nam", label: "Nam" },
  { value: "bac", label: "Bắc" },
  { value: "dong-bac", label: "Đông Bắc" },
  { value: "dong-nam", label: "Đông Nam" },
  { value: "tay-bac", label: "Tây Bắc" },
  { value: "tay-nam", label: "Tây Nam" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tình trạng" },
  { value: "available", label: "Đang bán/cho thuê" },
  { value: "sold", label: "Đã bán/đã thuê" },
];

const LEGAL_OPTIONS = [
  { value: "", label: "Pháp lý" },
  { value: "so-do", label: "Sổ đỏ" },
  { value: "so-hong", label: "Sổ hồng" },
  { value: "hop-dong-thue", label: "Hợp đồng thuê" },
];

export default function AdvancedFiltersModal({
  buttonLabel = "Bộ lọc nâng cao",
  className = "",
}: AdvancedFiltersModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔎 Đọc state hiện tại từ URL để luôn đồng bộ
  const urlVals: AdvancedFiltersValues = {
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    direction: searchParams.get("direction") || "",
    status: searchParams.get("status") || "",
    legal: searchParams.get("legal") || "",
    project: searchParams.get("project") || "",
  };

  const [open, setOpen] = useState(false);
  const [localValues, setLocalValues] = useState<AdvancedFiltersValues>(urlVals);

  const handleOpen = () => {
    setLocalValues(urlVals); // sync lại trước khi mở
    setOpen(true);
  };

  const handleChange = (key: keyof AdvancedFiltersValues, value: string) => {
    // chỉ cho số đối với bedrooms/bathrooms (hoặc trống)
    if ((key === "bedrooms" || key === "bathrooms") && value !== "") {
      if (!/^\d+$/.test(value)) return;
    }
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    (Object.keys(localValues) as (keyof AdvancedFiltersValues)[]).forEach((k) => {
      const v = localValues[k];
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["bedrooms", "bathrooms", "direction", "status", "legal", "project"].forEach((k) =>
      params.delete(k)
    );
    router.push(`?${params.toString()}`);
    setLocalValues({
      bedrooms: "",
      bathrooms: "",
      direction: "",
      status: "",
      legal: "",
      project: "",
    });
  };

  // 🔢 Số filter đang bật
  const activeCount = useMemo(() => {
    const keys = ["bedrooms", "bathrooms", "direction", "status", "legal", "project"] as const;
    return keys.reduce((n, k) => n + (urlVals[k] ? 1 : 0), 0);
  }, [urlVals]);

  const active = activeCount > 0;

  return (
    <>
      <button
        className={`border px-3 py-2 rounded bg-white hover:bg-gray-100 transition ${
          active ? "ring-2 ring-blue-500" : ""
        } ${className}`}
        onClick={handleOpen}
      >
        {buttonLabel}
        {active ? ` (${activeCount})` : ""}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center bg-black/30">
          <div className="bg-white w-full md:w-[720px] rounded-t-2xl md:rounded-2xl p-4 md:p-6 shadow-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Bộ lọc nâng cao</h3>
              <button
                className="text-sm text-gray-500 hover:text-black"
                onClick={() => setOpen(false)}
              >
                Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phòng ngủ (tối thiểu)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="vd: 2"
                  inputMode="numeric"
                  value={localValues.bedrooms}
                  onChange={(e) => handleChange("bedrooms", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Phòng tắm (tối thiểu)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="vd: 2"
                  inputMode="numeric"
                  value={localValues.bathrooms}
                  onChange={(e) => handleChange("bathrooms", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Hướng nhà</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={localValues.direction}
                  onChange={(e) => handleChange("direction", e.target.value)}
                >
                  {DIRECTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Tình trạng</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={localValues.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Pháp lý</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={localValues.legal}
                  onChange={(e) => handleChange("legal", e.target.value)}
                >
                  {LEGAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Dự án (slug)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="vd: ecopark, masteri-thao-dien"
                  value={localValues.project}
                  onChange={(e) => handleChange("project", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 justify-between">
              <button className="border px-4 py-2 rounded hover:bg-gray-50" onClick={handleReset}>
                Reset
              </button>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded border" onClick={() => setOpen(false)}>
                  Huỷ
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={handleApply}
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
