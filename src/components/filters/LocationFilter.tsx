"use client";
import React, { useEffect, useState } from "react";
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
  onChange?: (updated: Filters) => void; // ✅ chỉ emit ra ngoài, KHÔNG push
}

interface ProvinceMeta {
  code: string;
  name: string;
  slug: string;
  file: string;
}
interface Ward { name: string; slug: string; }
interface District { name: string; slug: string; wards: Ward[]; }

// Chuẩn hoá dữ liệu từ file JSON (tránh .map lỗi)
function normalizeWards(wards: any): Ward[] {
  if (!wards) return [];
  if (Array.isArray(wards)) {
    return wards.map((w: any) => ({
      name: w?.name ?? w?.title ?? String(w?.slug ?? w?.code ?? ""),
      slug: w?.slug ?? (w?.code ? String(w.code) : (w?.name || "")),
    }));
  }
  if (typeof wards === "object") {
    return Object.entries<any>(wards).map(([slugKey, val]) => ({
      name: val?.name ?? val?.title ?? String(slugKey),
      slug: val?.slug ?? String(slugKey),
    }));
  }
  return [];
}
function normalizeDistricts(data: any): District[] {
  if (!data) return [];
  if (Array.isArray((data as any).districts)) {
    return (data as any).districts.map((d: any) => ({
      name: d.name ?? d.title ?? String(d.slug ?? d.code ?? ""),
      slug: d.slug ?? (d.code ? String(d.code) : (d.name || "")),
      wards: normalizeWards(d.wards),
    }));
  }
  if (Array.isArray(data)) {
    return data.map((d: any) => ({
      name: d.name ?? d.title ?? String(d.slug ?? d.code ?? ""),
      slug: d.slug ?? (d.code ? String(d.code) : (d.name || "")),
      wards: normalizeWards(d.wards),
    }));
  }
  if (typeof data === "object") {
    return Object.entries<any>(data).map(([slugKey, val]) => {
      if (Array.isArray(val)) {
        return {
          name: String(slugKey).replace(/-/g, " "),
          slug: String(slugKey),
          wards: normalizeWards(val),
        };
      }
      return {
        name: val?.name ?? val?.title ?? String(slugKey),
        slug: val?.slug ?? String(slugKey),
        wards: normalizeWards(val?.wards),
      };
    });
  }
  return [];
}

export default function LocationFilter({
  filters,
  compact,
  className,
  onChange,
}: LocationFilterProps) {
  const [province, setProvince] = useState(filters.city || "");
  const [district, setDistrict] = useState(filters.district || "");
  const [ward, setWard] = useState(filters.ward || "");
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!province) { if (active) { setDistricts([]); setWards([]); } return; }
      const provMeta = (provinces as ProvinceMeta[]).find((p) => p.slug === province);
      if (!provMeta) { if (active) { setDistricts([]); setWards([]); } return; }
      const mod = await import(`@/data/locations/${provMeta.file}`);
      const normalized = normalizeDistricts((mod as any)?.default ?? mod);
      if (!active) return;
      setDistricts(normalized);
      if (district) {
        const d = normalized.find((x) => x.slug === district);
        setWards(d?.wards ?? []);
      } else {
        setWards([]);
      }
    }
    load();
    return () => { active = false; };
  }, [province]); // eslint-disable-line

  useEffect(() => {
    if (!district) { setWards([]); return; }
    const d = districts.find((x) => x.slug === district);
    setWards(d?.wards ?? []);
  }, [district, districts]);

  const emit = (updated: Filters) => onChange?.(updated);

  const handleProvince = (val: string) => {
    setProvince(val); setDistrict(""); setWard("");
    emit({ city: val, district: "", ward: "" });
  };
  const handleDistrict = (val: string) => {
    setDistrict(val); setWard("");
    emit({ city: province, district: val, ward: "" });
  };
  const handleWard = (val: string) => {
    setWard(val);
    emit({ city: province, district, ward: val });
  };

  const selectCls = `border rounded px-2 ${compact ? "h-10" : "h-11"} bg-white`;

  return (
    <div className={`flex gap-2 ${className || ""}`}>
      <select value={province} onChange={(e) => handleProvince(e.target.value)} className={selectCls}>
        <option value="">Chọn tỉnh/thành</option>
        {Array.isArray(provinces) && (provinces as ProvinceMeta[]).map((p) => (
          <option key={p.slug} value={p.slug}>{p.name}</option>
        ))}
      </select>

      <select value={district} onChange={(e) => handleDistrict(e.target.value)}
              className={selectCls} disabled={!province || districts.length === 0}>
        <option value="">Chọn quận/huyện</option>
        {districts.map((d) => (<option key={d.slug} value={d.slug}>{d.name}</option>))}
      </select>

      <select value={ward} onChange={(e) => handleWard(e.target.value)}
              className={selectCls} disabled={!district || wards.length === 0}>
        <option value="">Chọn phường/xã</option>
        {wards.map((w) => (<option key={w.slug} value={w.slug}>{w.name}</option>))}
      </select>
    </div>
  );
}
