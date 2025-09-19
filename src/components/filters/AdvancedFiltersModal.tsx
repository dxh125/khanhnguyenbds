// src/components/filters/AdvancedFiltersModal.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";

export interface AdvancedFiltersValues {
  bedrooms: string;
  bathrooms: string;
  direction: string;
  status: string;
  legal: string;
  project: string;
}

export interface AdvancedFiltersModalProps {
  buttonLabel?: string;
  className?: string;
  /** Nếu truyền, component sẽ không tự điều hướng mà trả patch cho bên ngoài */
  onApply?: (patch: Record<string, string | number | boolean | null | undefined>) => void;
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
  { value: "rented", label: "Đã thuê" },
];

const LEGAL_OPTIONS = [
  { value: "", label: "Pháp lý" },
  { value: "so-do", label: "Sổ đỏ" },
  { value: "so-hong", label: "Sổ hồng" },
  { value: "hop-dong-thue", label: "Hợp đồng thuê" },
];

const ALL_KEYS = ["bedrooms", "bathrooms", "direction", "status", "legal", "project"] as const;

export default function AdvancedFiltersModal({
  buttonLabel = "Bộ lọc nâng cao",
  className = "",
  onApply,
}: AdvancedFiltersModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlVals: AdvancedFiltersValues = {
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    direction: searchParams.get("direction") || "",
    status: searchParams.get("status") || "",
    legal: searchParams.get("legal") || "",
    project: searchParams.get("project") || "",
  };

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [localValues, setLocalValues] = useState<AdvancedFiltersValues>(urlVals);

  useEffect(() => setMounted(true), []);

  // Khóa scroll body khi mở modal
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Đóng bằng ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleOpen = () => {
    setLocalValues(urlVals);
    setOpen(true);
  };

  const handleChange = (key: keyof AdvancedFiltersValues, value: string) => {
    if ((key === "bedrooms" || key === "bathrooms") && value !== "") {
      if (!/^\d+$/.test(value)) return; // chỉ chấp nhận số nguyên dương
    }
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  };

  // Tạo patch đồng bộ với FilterBar.mergeQuery (null/"" sẽ bị xoá param)
  const buildPatch = () => {
    const patch: Record<string, string | number | boolean | null | undefined> = {};
    ALL_KEYS.forEach((k) => {
      const v = localValues[k];
      patch[k] = v ? v : null;
    });
    return patch;
  };

  const handleApply = () => {
    // Nếu FilterBar truyền onApply -> trả patch ra ngoài, không tự navigate
    if (onApply) {
      onApply(buildPatch());
      setOpen(false);
      return;
    }

    // Fallback: tự điều hướng (giữ tương thích cũ)
    const params = new URLSearchParams(searchParams.toString());
    ALL_KEYS.forEach((k) => {
      const v = localValues[k];
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.delete("page");
    router.replace(`?${params.toString()}`);
    setOpen(false);
  };

  const handleReset = () => {
    if (onApply) {
      // đẩy mọi key về null -> xoá param
      const patch: Record<string, null> = {} as any;
      ALL_KEYS.forEach((k) => (patch[k] = null));
      onApply(patch);
      setLocalValues({
        bedrooms: "",
        bathrooms: "",
        direction: "",
        status: "",
        legal: "",
        project: "",
      });
      setOpen(false);
      return;
    }

    // Fallback: tự điều hướng
    const params = new URLSearchParams(searchParams.toString());
    ALL_KEYS.forEach((k) => params.delete(k));
    params.delete("page");
    router.replace(`?${params.toString()}`);
    setLocalValues({
      bedrooms: "",
      bathrooms: "",
      direction: "",
      status: "",
      legal: "",
      project: "",
    });
  };

  const activeCount = useMemo(() => {
    return ALL_KEYS.reduce((n, k) => n + (urlVals[k] ? 1 : 0), 0);
  }, [urlVals]);
  const active = activeCount > 0;

  return (
    <>
      <button
        className={`border px-3 py-2 rounded bg-white hover:bg-gray-100 transition ${
          active ? "ring-2 ring-blue-500" : ""
        } ${className}`}
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {buttonLabel}
        {active ? ` (${activeCount})` : ""}
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-end md:items-center md:justify-center"
            aria-modal="true"
            role="dialog"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-neutral-900/50 backdrop-blur-[2px] backdrop-saturate-75"
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <div
              className="relative w-full md:w-[720px] max-h-[90vh] overflow-auto
                         rounded-t-2xl md:rounded-2xl
                         bg-white/98
                         border border-black/10 ring-1 ring-black/10
                         shadow-[0_24px_96px_rgba(0,0,0,0.45)]
                         p-4 md:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Bộ lọc nâng cao</h3>
                <button
                  className="text-sm text-gray-500 hover:text-black"
                  onClick={() => setOpen(false)}
                  aria-label="Đóng"
                >
                  Đóng
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Phòng ngủ (tối thiểu)
                  </label>
                  <input
                    className="border border-black/20 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="vd: 2"
                    inputMode="numeric"
                    value={localValues.bedrooms}
                    onChange={(e) => handleChange("bedrooms", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Phòng tắm (tối thiểu)
                  </label>
                  <input
                    className="border border-black/20 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="vd: 2"
                    inputMode="numeric"
                    value={localValues.bathrooms}
                    onChange={(e) => handleChange("bathrooms", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Hướng nhà
                  </label>
                  <select
                    className="border border-black/20 rounded px-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
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
                  <label className="block text-sm text-gray-600 mb-1">
                    Tình trạng
                  </label>
                  <select
                    className="border border-black/20 rounded px-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
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
                  <label className="block text-sm text-gray-600 mb-1">
                    Pháp lý
                  </label>
                  <select
                    className="border border-black/20 rounded px-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
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
                  <label className="block text-sm text-gray-600 mb-1">
                    Dự án (slug)
                  </label>
                  <input
                    className="border border-black/20 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="vd: ecopark, masteri-thao-dien"
                    value={localValues.project}
                    onChange={(e) => handleChange("project", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 justify-between">
                <button
                  className="border px-4 py-2 rounded hover:bg-gray-50"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded border"
                    onClick={() => setOpen(false)}
                  >
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
          </div>,
          document.body
        )}
    </>
  );
}
