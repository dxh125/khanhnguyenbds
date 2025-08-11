"use client";
import React, { useState } from "react";

export interface AdvancedFiltersValues {
  bedrooms: string;
  bathrooms: string;
  direction: string;
  status: string;
}

interface AdvancedFiltersModalProps {
  initialValues?: Partial<AdvancedFiltersValues>;
  onApply: (vals: AdvancedFiltersValues) => void;
  onReset: () => void;
}

export default function AdvancedFiltersModal({
  initialValues,
  onApply,
  onReset,
}: AdvancedFiltersModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<AdvancedFiltersValues>({
    bedrooms: initialValues?.bedrooms || "",
    bathrooms: initialValues?.bathrooms || "",
    direction: initialValues?.direction || "",
    status: initialValues?.status || "",
  });

  const handleApply = () => {
    onApply(values);
    setIsOpen(false);
  };

  const handleReset = () => {
    setValues({ bedrooms: "", bathrooms: "", direction: "", status: "" });
    onReset();
  };

  return (
    <div>
      {/* Nút mở modal */}
      <button
        className="border px-3 py-1 rounded"
        onClick={() => setIsOpen(true)}
      >
        Thêm bộ lọc
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Bộ lọc nâng cao</h2>

            <input
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Phòng ngủ"
              value={values.bedrooms}
              onChange={(e) =>
                setValues({ ...values, bedrooms: e.target.value })
              }
            />

            <input
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Phòng tắm"
              value={values.bathrooms}
              onChange={(e) =>
                setValues({ ...values, bathrooms: e.target.value })
              }
            />

            <select
              className="border rounded px-2 py-1 w-full mb-2"
              value={values.direction}
              onChange={(e) =>
                setValues({ ...values, direction: e.target.value })
              }
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
              className="border rounded px-2 py-1 w-full mb-4"
              value={values.status}
              onChange={(e) =>
                setValues({ ...values, status: e.target.value })
              }
            >
              <option value="">Tình trạng</option>
              <option value="available">Đang bán/cho thuê</option>
              <option value="sold">Đã bán/đã thuê</option>
            </select>

            {/* Nút hành động */}
            <div className="flex justify-end gap-2">
              <button
                className="border px-3 py-1 rounded"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
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
