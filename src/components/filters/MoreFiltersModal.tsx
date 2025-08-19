"use client";
import { useState } from "react";

type Filters = Record<string, string | string[] | undefined>;

interface MoreFiltersModalProps {
  initialFilters?: Filters;
  onApply?: () => void;   // gọi lại sau khi set URL để reload
}

export default function MoreFiltersModal({ initialFilters, onApply }: MoreFiltersModalProps) {
  const [open, setOpen] = useState(false);

  const [area, setArea] = useState(String(initialFilters?.area || ""));
  const [has3D, setHas3D] = useState(String(initialFilters?.has3D || ""));
  const [bedrooms, setBedrooms] = useState(String(initialFilters?.bedrooms || ""));
  const [bathrooms, setBathrooms] = useState(String(initialFilters?.bathrooms || ""));
  const [direction, setDirection] = useState(String(initialFilters?.direction || ""));
  const [status, setStatus] = useState(String(initialFilters?.status || ""));

  const applyAll = () => {
    const params = new URLSearchParams(window.location.search);
    const up = (k: string, v: string) => (v ? params.set(k, v) : params.delete(k));

    up("area", area);
    up("has3D", has3D);
    up("bedrooms", bedrooms);
    up("bathrooms", bathrooms);
    up("direction", direction);
    up("status", status);

    window.location.search = params.toString();
    onApply?.();
    setOpen(false);
  };

  const resetAll = () => {
    const params = new URLSearchParams(window.location.search);
    ["area","has3D","bedrooms","bathrooms","direction","status"].forEach(k => params.delete(k));
    window.location.search = params.toString();
    setArea(""); setHas3D(""); setBedrooms(""); setBathrooms(""); setDirection(""); setStatus("");
    onApply?.();
    setOpen(false);
  };

  return (
    <div>
      <button className="border px-3 py-1 rounded w-full md:w-auto" onClick={() => setOpen(true)}>
        Thêm bộ lọc
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30">
          <div className="bg-white w-full md:max-w-xl rounded-t-2xl md:rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Bộ lọc</h3>
              <button className="text-sm text-gray-500" onClick={() => setOpen(false)}>Đóng</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Diện tích */}
              <div>
                <label className="text-sm text-gray-600">Diện tích</label>
                <select className="w-full border rounded px-2 py-1"
                        value={area} onChange={(e)=>setArea(e.target.value)}>
                  <option value="">Tất cả</option>
                  <option value="duoi-30">Dưới 30 m²</option>
                  <option value="30-50">30 - 50 m²</option>
                  <option value="50-80">50 - 80 m²</option>
                  <option value="80-100">80 - 100 m²</option>
                  <option value="tren-100">Trên 100 m²</option>
                </select>
              </div>

              {/* Có 3D */}
              <div>
                <label className="text-sm text-gray-600">Có 3D</label>
                <select className="w-full border rounded px-2 py-1"
                        value={has3D} onChange={(e)=>setHas3D(e.target.value)}>
                  <option value="">Tất cả</option>
                  <option value="true">Có</option>
                  <option value="false">Không</option>
                </select>
              </div>

              {/* Nâng cao */}
              <div>
                <label className="text-sm text-gray-600">Phòng ngủ</label>
                <input className="w-full border rounded px-2 py-1" placeholder="vd: 2"
                       value={bedrooms} onChange={(e)=>setBedrooms(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Phòng tắm</label>
                <input className="w-full border rounded px-2 py-1" placeholder="vd: 2"
                       value={bathrooms} onChange={(e)=>setBathrooms(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Hướng nhà</label>
                <select className="w-full border rounded px-2 py-1"
                        value={direction} onChange={(e)=>setDirection(e.target.value)}>
                  <option value="">Tất cả</option>
                  <option value="Đông">Đông</option>
                  <option value="Tây">Tây</option>
                  <option value="Nam">Nam</option>
                  <option value="Bắc">Bắc</option>
                  <option value="Đông Bắc">Đông Bắc</option>
                  <option value="Đông Nam">Đông Nam</option>
                  <option value="Tây Bắc">Tây Bắc</option>
                  <option value="Tây Nam">Tây Nam</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tình trạng</label>
                <select className="w-full border rounded px-2 py-1"
                        value={status} onChange={(e)=>setStatus(e.target.value)}>
                  <option value="">Tất cả</option>
                  <option value="available">Đang bán/cho thuê</option>
                  <option value="sold">Đã bán/đã thuê</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <button className="px-3 py-1 rounded border" onClick={resetAll}>Reset</button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={applyAll}>Áp dụng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
