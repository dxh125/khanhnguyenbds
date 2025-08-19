"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  mode?: "inline" | "modal";
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
  compact,
  className,
  onChange,
}: LocationFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [province, setProvince] = useState(filters.city || "");
  const [district, setDistrict] = useState(filters.district || "");
  const [ward, setWard] = useState(filters.ward || "");

  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<{ name: string; slug: string }[]>([]);

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

  useEffect(() => {
    if (!district) {
      setWards([]);
      return;
    }
    const d = districts.find((x) => x.slug === district);
    if (d) setWards(d.wards || []);
  }, [district, districts]);

  const updateFilter = (key: keyof Filters, value: string) => {
    const newFilters = { city: province, district, ward, ...filters, [key]: value };

    if (onChange) onChange(newFilters);

    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
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
