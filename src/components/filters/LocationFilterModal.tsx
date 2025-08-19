"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LocationFilter from "./LocationFilter";

type Filters = Record<string, string | string[] | undefined>;

export default function LocationFilterModal({ filters }: { filters?: Filters }) {
  const [open, setOpen] = useState(false);

  // State tạm cho modal
  const [tempFilters, setTempFilters] = useState<Filters>({
    city: filters?.city || "",
    district: filters?.district || "",
    ward: filters?.ward || "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // Khi mở modal, load lại giá trị hiện tại vào state tạm
  useEffect(() => {
    if (open) {
      setTempFilters({
        city: filters?.city || "",
        district: filters?.district || "",
        ward: filters?.ward || "",
      });
    }
  }, [open, filters]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (tempFilters.city) params.set("city", String(tempFilters.city));
    else params.delete("city");

    if (tempFilters.district) params.set("district", String(tempFilters.district));
    else params.delete("district");

    if (tempFilters.ward) params.set("ward", String(tempFilters.ward));
    else params.delete("ward");

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div>
      <button
        className="border px-3 py-1 rounded"
        onClick={() => setOpen(true)}
      >
        Địa chỉ
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white w-full max-w-xl rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Chọn địa chỉ</h3>
              <button className="text-sm text-gray-500" onClick={() => setOpen(false)}>Đóng</button>
            </div>

            {/* Truyền state tạm vào LocationFilter */}
            <div className="space-y-3">
              <LocationFilter
                filters={tempFilters}
                onChange={(updated) => setTempFilters((prev) => ({ ...prev, ...updated }))}
                mode="inline" // chế độ chọn cục bộ, không filter ngay
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="border px-3 py-1 rounded"
                onClick={() => setOpen(false)}
              >
                Hủy
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={handleApply}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
