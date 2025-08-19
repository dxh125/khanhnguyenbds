"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import provinces from "@/data/locations/index.json";

export interface Filters {
  city?: string;
  district?: string;
  ward?: string;
}

interface LocationFilterProps {
  filters: Filters;
  compact?: boolean;
  className?: string;
  onChange?: (updated: Filters) => void;
  mode?: "inline" | "modal"; // 👈 có thể dùng sau
}

interface ProvinceMeta {
  code: string;
  name: string;
  slug: string;
  file: string;
}

interface District {
  name: string;
  slug: string;
  wards: { name: string; slug: string }[];
}

export default function LocationFilter({
  filters,
  className,
  onChange,
}: LocationFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [province, setProvince] = useState(filters.city || "");
  const [district, setDistrict] = useState(filters.district || "");
  const [ward, setWard] = useState(filters.ward || "");

  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<{ name: string; slug: string }[]>([]);

  // Load districts khi chọn tỉnh
  useEffect(() => {
    if (!province) {
      setDistricts([]);
      setWards([]);
      return;
    }
    const selected = (provinces as ProvinceMeta[]).find((p) => p.slug === province);
    if (selected) {
      import(`@/data/locations/${selected.file}`).then((data) => {
        const provinceData = data.default;
        setDistricts(provinceData.districts as District[]);
      });
    }
  }, [province]);

  // Load wards khi chọn huyện
  useEffect(() => {
    if (!district) {
      setWards([]);
      return;
    }
    const d = districts.find((x) => x.slug === district);
    if (d) setWards(d.wards || []);
  }, [district, districts]);

 const updateFilter = (key: keyof Filters, value: string) => {
  // Cập nhật state tạm
  const newFilters = {
    city: key === "city" ? value : province,
    district: key === "district" ? value : district,
    ward: key === "ward" ? value : ward,
  };
  if (onChange) onChange(newFilters);

  // Lấy các phần hiện tại từ pathname
  // Ví dụ: /vi/buy/can-ho/ha-noi/cau-giay
  const parts = pathname.split("/").filter(Boolean);
  const [locale, purpose, propertyType] = parts;

  // Xây slug mới từ filter location
  const locationPath = [
    newFilters.city || "",
    newFilters.district || "",
    newFilters.ward || "",
  ].filter(Boolean);

  const newPath = [
    "",
    locale,
    purpose,
    propertyType,
    ...locationPath,
  ].join("/");

  // Giữ lại query string (nếu có)
  const query = searchParams.toString();
  router.push(query ? `${newPath}?${query}` : newPath);
};

  return (
    <div className="flex gap-2">
      {/* Province */}
      <select
        className={`border rounded px-3 py-2 ${className}`}
        value={province}
        onChange={(e) => {
          const val = e.target.value;
          setProvince(val);
          setDistrict("");
          setWard("");
          updateFilter("city", val);
        }}
      >
        <option value="">Chọn Tỉnh/Thành phố</option>
        {(provinces as ProvinceMeta[]).map((p) => (
          <option key={p.code} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>

      {/* District */}
      <select
        className={`border rounded px-3 py-2 ${className}`}
        value={district}
        onChange={(e) => {
          const val = e.target.value;
          setDistrict(val);
          setWard("");
          updateFilter("district", val);
        }}
        disabled={!districts.length}
      >
        <option value="">Chọn Quận/Huyện</option>
        {districts.map((d) => (
          <option key={d.slug} value={d.slug}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Ward */}
      <select
        className={`border rounded px-3 py-2 ${className}`}
        value={ward}
        onChange={(e) => {
          const val = e.target.value;
          setWard(val);
          updateFilter("ward", val);
        }}
        disabled={!wards.length}
      >
        <option value="">Chọn Phường/Xã</option>
        {wards.map((w) => (
          <option key={w.slug} value={w.slug}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
}
