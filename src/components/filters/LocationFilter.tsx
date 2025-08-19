// src/components/filters/LocationFilter.tsx (compact + className + mode)
"use client";
import { useEffect, useMemo, useState } from "react";

type Filters = Record<string, string | string[] | undefined>;
type IndexItem = { code: string; name: string; slug: string; file: string };

interface LocationFilterProps {
  filters?: Filters;
  compact?: boolean;
  className?: string; // ⬅️ thêm để đồng bộ chiều cao (h-10, h-11...)
  mode?: "url" | "local"; // ⬅️ thêm: url = cập nhật URL ngay; local = chỉ đổi state
  onChange?: (vals: { city?: string; district?: string; ward?: string }) => void; // dùng khi mode="local"
}

export default function LocationFilter({
  filters,
  compact = true,
  className = "",
  mode = "url",
  onChange,
}: LocationFilterProps) {
  const [index, setIndex] = useState<IndexItem[]>([]);
  const [province, setProvince] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // giá trị hiện tại từ URL (hoặc từ modal khi bạn truyền filters tạm vào)
  const currentCity = String(filters?.city || "");
  const currentDistrict = String(filters?.district || "");
  const currentWard = String(filters?.ward || "");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const mod = await import("@/data/locations/index.json");
      if (mounted) setIndex(mod.default || (mod as any));
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!index.length) return;
    const item = index.find((i) => i.slug === currentCity);
    if (!item) {
      setProvince(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      const mod = await import(`@/data/locations/${item.file}`);
      if (mounted) {
        setProvince(mod.default || mod);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [index, currentCity]);

  const districts = useMemo(() => province?.districts || [], [province]);
  const wards = useMemo(() => {
    const d = districts.find((x: any) => x.slug === currentDistrict);
    return d?.wards || [];
  }, [districts, currentDistrict]);

  const updateURL = (key: string, val: string) => {
    const params = new URLSearchParams(window.location.search);
    if (val) params.set(key, val);
    else params.delete(key);
    if (key === "city") {
      params.delete("district");
      params.delete("ward");
    }
    if (key === "district") {
      params.delete("ward");
    }
    window.location.search = params.toString();
  };

  const emitLocal = (vals: Partial<{ city: string; district: string; ward: string }>) => {
    onChange?.({
      city: vals.city ?? currentCity,
      district: vals.district ?? currentDistrict,
      ward: vals.ward ?? currentWard,
    });
  };

  // lớp gọn cho select
  const base = compact ? "text-sm px-2 py-1 w-28 md:w-36" : "px-3 py-2";
  const sel = `border rounded ${base} ${className}`.trim();

  return (
    <div className="flex gap-2 items-center">
      {/* City */}
      <select
        className={sel}
        value={currentCity}
        onChange={(e) => {
          const val = e.target.value;
          if (mode === "url") {
            updateURL("city", val);
          } else {
            // local: reset district & ward khi đổi city
            emitLocal({ city: val, district: "", ward: "" });
          }
        }}
        title="Thành phố"
      >
        <option value="">Thành phố</option>
        {index.map((i) => (
          <option key={i.code} value={i.slug}>
            {i.name}
          </option>
        ))}
      </select>

      {/* District */}
      <select
        className={sel}
        value={currentDistrict}
        disabled={!currentCity || loading || !province}
        onChange={(e) => {
          const val = e.target.value;
          if (mode === "url") {
            updateURL("district", val);
          } else {
            emitLocal({ district: val, ward: "" });
          }
        }}
        title="Quận/Huyện"
      >
        <option value="">{currentCity ? "Quận/Huyện" : "Chọn TP trước"}</option>
        {districts.map((d: any) => (
          <option key={d.code} value={d.slug}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Ward */}
      <select
        className={sel}
        value={currentWard}
        disabled={!currentDistrict || loading}
        onChange={(e) => {
          const val = e.target.value;
          if (mode === "url") {
            updateURL("ward", val);
          } else {
            emitLocal({ ward: val });
          }
        }}
        title="Phường/Xã"
      >
        <option value="">{currentDistrict ? "Phường/Xã" : "Chọn Quận trước"}</option>
        {wards.map((w: any) => (
          <option key={w.code} value={w.slug}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
}
