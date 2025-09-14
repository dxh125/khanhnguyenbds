// src/app/[locale]/admin/post-property/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUploader from "@/components/uploader/ImageUploader";
import LocationFilter from "@/components/filters/LocationFilter";
import ProjectSelect from "@/components/ProjectSelect";
import {
  DIRECTIONS,
  LEGALS,
  PROPERTY_TYPES,
  INDUSTRIAL_TYPES,
} from "@/constants/bdsOptions";
import { fetchWithAuth } from "@/lib/fetchWithAuth"; // 👈 dùng helper kèm idToken

// Union type cho giá trị propertyType dựa trên PROPERTY_TYPES
type PropertyTypeValue = (typeof PROPERTY_TYPES)[number]["value"];

type FormState = {
  title: string;
  description: string;
  price: string;
  area: string;
  address: string;
  ward?: string;
  district?: string;
  city?: string;
  propertyType: PropertyTypeValue; // dùng union thay vì string
  purpose: string; // buy | rent (hiển thị: Bán | Cho thuê)
  status: string;
  bedrooms?: string;
  bathrooms?: string;
  floors?: string;
  legal?: string;
  direction?: string;
  highlightsText?: string;
  projectSlug?: string;
};

// Set để check loại công nghiệp (tránh lỗi TS khi dùng includes)
const INDUSTRIAL_SET = new Set<string>(INDUSTRIAL_TYPES as readonly string[]);

export default function PostPropertyPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale as string) || "vi";

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    price: "",
    area: "",
    address: "",
    propertyType: "can-ho", // slug (nằm trong PROPERTY_TYPES)
    purpose: "buy",          // lưu buy | rent, hiển thị Bán | Cho thuê
    status: "available",     // slug
    legal: "",
    direction: "",
    projectSlug: "",
    city: "",
    district: "",
    ward: "",
  });

  // Thông số kỹ thuật cho BĐS công nghiệp (UI state)
  const [specs, setSpecs] = useState({
    powerKva: "",
    floorLoad: "",
    clearHeight: "",
    dockDoors: "",
    roadWidth: "",
    officeRatio: "",
  });

  const updateSpecs = (k: keyof typeof specs, v: string) =>
    setSpecs((s) => ({ ...s, [k]: v }));

  const isIndustrial = useMemo(
    () => INDUSTRIAL_SET.has(form.propertyType),
    [form.propertyType]
  );

  // Update state có type-safe
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const canSubmit =
    !!images.length &&
    !!form.title &&
    !!form.price &&
    !!form.area &&
    !!form.address &&
    !!form.propertyType &&
    !!form.purpose &&
    !!form.status &&
    !!form.city && // bắt buộc chọn Tỉnh/TP
    !!form.district; // bắt buộc chọn Quận/Huyện

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    try {
      const payload: any = {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        floors: form.floors ? Number(form.floors) : undefined,
        highlights: (form.highlightsText || "")
          .split(/[;,]/)
          .map((s) => s.trim())
          .filter(Boolean),
        images, // secure_url từ Cloudinary
        // chuẩn hoá optional rỗng -> undefined
        legal: form.legal || undefined,
        direction: form.direction || undefined,
        projectSlug: form.projectSlug || undefined,
        city: form.city || undefined,
        district: form.district || undefined,
        ward: form.ward || undefined,
        // ❌ KHÔNG gửi userId — server sẽ gán từ idToken
      };

      if (isIndustrial) {
        payload.specs = {
          powerKva: specs.powerKva ? Number(specs.powerKva) : undefined,
          floorLoad: specs.floorLoad ? Number(specs.floorLoad) : undefined,
          clearHeight: specs.clearHeight ? Number(specs.clearHeight) : undefined,
          dockDoors: specs.dockDoors ? Number(specs.dockDoors) : undefined,
          roadWidth: specs.roadWidth ? Number(specs.roadWidth) : undefined,
          officeRatio: specs.officeRatio ? Number(specs.officeRatio) : undefined,
        };
      }

      const res = await fetchWithAuth("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Tạo tin thất bại");
      }

      alert("Đăng tin thành công!");
      router.push(`/${locale}/admin/listings`);
    } catch (err: any) {
      alert(err.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const selectCls =
    "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Đăng tin bất động sản</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* ===== GRID CHÍNH ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hàng 1: Tiêu đề, Giá */}
          <input
            className="border rounded px-3 py-2"
            placeholder="Tiêu đề *"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Giá (VND) *"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />

          {/* Hàng 2: LocationFilter */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Khu vực (Tỉnh/Thành → Quận/Huyện → Phường/Xã)
            </label>
            <LocationFilter
              mode="inline"
              compact
              containerClassName="grid grid-cols-1 md:grid-cols-3 gap-2"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              filters={{
                city: form.city || "",
                district: form.district || "",
                ward: form.ward || "",
              }}
              onChange={(loc) => {
                update("city", (loc.city || "") as FormState["city"]);
                update("district", (loc.district || "") as FormState["district"]);
                update("ward", (loc.ward || "") as FormState["ward"]);
              }}
            />
          </div>

          {/* Hàng 3: Địa chỉ chi tiết, Diện tích */}
          <input
            className="border rounded px-3 py-2"
            placeholder="Địa chỉ chi tiết (số nhà, đường) *"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            required
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Diện tích (m²) *"
            type="number"
            min="0"
            step="0.01"
            value={form.area}
            onChange={(e) => update("area", e.target.value)}
            required
          />

          {/* Hàng 4+: Loại hình, Mục đích, Trạng thái, các trường khác */}
          {/* Loại hình (slug) */}
          <select
            className={selectCls}
            value={form.propertyType}
            onChange={(e) =>
              update("propertyType", e.target.value as PropertyTypeValue)
            }
          >
            {PROPERTY_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Mục đích (label: Bán/Cho thuê → value: buy/rent) */}
          <select
            className={selectCls}
            value={form.purpose}
            onChange={(e) => update("purpose", e.target.value)}
          >
            <option value="buy">Bán</option>
            <option value="rent">Cho thuê</option>
          </select>

          {/* Trạng thái (slug) */}
          <select
            className={selectCls}
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="available">Còn hàng</option>
            <option value="sold">Đã bán</option>
            <option value="rented">Đã thuê</option>
          </select>

          {/* Số PN / PT / Tầng */}
          <input
            className="border rounded px-3 py-2"
            placeholder="Số phòng ngủ"
            type="number"
            min="0"
            value={form.bedrooms || ""}
            onChange={(e) => update("bedrooms", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Số phòng tắm"
            type="number"
            min="0"
            value={form.bathrooms || ""}
            onChange={(e) => update("bathrooms", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Số tầng"
            type="number"
            min="0"
            value={form.floors || ""}
            onChange={(e) => update("floors", e.target.value)}
          />

          {/* Pháp lý (dropdown slug) */}
          <select
            className={selectCls}
            value={form.legal || ""}
            onChange={(e) => update("legal", e.target.value)}
          >
            <option value="">Pháp lý (tuỳ chọn)</option>
            {LEGALS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Hướng nhà (dropdown slug) */}
          <select
            className={selectCls}
            value={form.direction || ""}
            onChange={(e) => update("direction", e.target.value)}
          >
            <option value="">Hướng nhà (tuỳ chọn)</option>
            {DIRECTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Dự án (dropdown từ DB) */}
          <div className="md:col-span-2">
            <ProjectSelect
              value={form.projectSlug}
              onChange={(slug) => update("projectSlug", slug)}
              placeholder="Thuộc dự án (tuỳ chọn)"
            />
          </div>

          {/* ===== Section thông số công nghiệp (chỉ hiện khi chọn loại công nghiệp) ===== */}
          {isIndustrial && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-lg p-4 bg-gray-50">
              <div>
                <label className="block text-sm mb-1">Điện 3 pha (kVA)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={specs.powerKva}
                  onChange={(e) => updateSpecs("powerKva", e.target.value)}
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Ví dụ: 250"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Tải sàn (tấn/m²)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={specs.floorLoad}
                  onChange={(e) => updateSpecs("floorLoad", e.target.value)}
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Ví dụ: 3"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Cao thông thuỷ (m)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={specs.clearHeight}
                  onChange={(e) => updateSpecs("clearHeight", e.target.value)}
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Ví dụ: 10"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Số cửa/Dock</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={specs.dockDoors}
                  onChange={(e) => updateSpecs("dockDoors", e.target.value)}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ví dụ: 4"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Lộ giới (m)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={specs.roadWidth}
                  onChange={(e) => updateSpecs("roadWidth", e.target.value)}
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Ví dụ: 12"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Tỉ lệ văn phòng (%)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={specs.officeRatio}
                  onChange={(e) => updateSpecs("officeRatio", e.target.value)}
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="Ví dụ: 15"
                />
              </div>
            </div>
          )}
        </div>

        <textarea
          className="border rounded px-3 py-2 w-full min-h-[120px]"
          placeholder="Mô tả chi tiết *"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />

        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Highlight (ngăn cách bằng ; hoặc ,)"
          value={form.highlightsText || ""}
          onChange={(e) => update("highlightsText", e.target.value)}
        />

        <div>
          <label className="block font-medium mb-2">Hình ảnh *</label>
          <ImageUploader onChange={setImages} max={12} />
          {!images.length && (
            <p className="text-xs text-red-600 mt-1">Cần upload ít nhất 1 ảnh.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Đăng tin"}
        </button>
      </form>
    </div>
  );
}
