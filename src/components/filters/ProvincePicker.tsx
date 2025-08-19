// src/components/filters/ProvincePicker.tsx
"use client";
import React from "react";
import provinces from "@/data/locations/index.json";

type ProvinceMeta = {
  code: string;
  name: string;
  slug: string;
  file: string;
  region?: "bac" | "trung" | "nam"; // nếu chưa có trong json, sẽ map tạm ở dưới
};

const VIETNAMESE_MAP: Record<string, string> = {
  // 1 số alias phổ biến để tìm nhanh
  "hcm": "thanh-pho-ho-chi-minh",
  "tphcm": "thanh-pho-ho-chi-minh",
  "sg": "thanh-pho-ho-chi-minh",
  "sai gon": "thanh-pho-ho-chi-minh",
  "sài gòn": "thanh-pho-ho-chi-minh",
  "hn": "thanh-pho-ha-noi",
  "ha noi": "thanh-pho-ha-noi",
  "đn": "thanh-pho-da-nang",
  "dn": "thanh-pho-da-nang",
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bóc dấu
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

// Nếu file index.json chưa có trường region, bạn có thể map nhanh ở đây:
const REGION_FALLBACK: Record<string, "bac" | "trung" | "nam"> = {
  "thanh-pho-ha-noi": "bac",
  "tinh-bac-ninh": "bac",
  "tinh-hai-phong": "bac",
  "tinh-quang-ninh": "bac",
  "tinh-nam-dinh": "bac",
  "tinh-thanh-hoa": "bac",
  "thanh-pho-da-nang": "trung",
  "tinh-thua-thien-hue": "trung",
  "tinh-quang-nam": "trung",
  "tinh-khanh-hoa": "trung",
  "thanh-pho-ho-chi-minh": "nam",
  "tinh-dong-nai": "nam",
  "tinh-binh-duong": "nam",
  "tinh-long-an": "nam",
  "tinh-ba-ria-vung-tau": "nam",
  // ...bổ sung dần (không có cũng không sao, chỉ ảnh hưởng filter theo miền)
};

const REGIONS = [
  { key: "all", label: "Tất cả" },
  { key: "bac", label: "Miền Bắc" },
  { key: "trung", label: "Miền Trung" },
  { key: "nam", label: "Miền Nam" },
] as const;

export interface ProvincePickerProps {
  value?: string; // slug tỉnh hiện tại
  onSelect: (slug: string) => void;
  className?: string;
  placeholder?: string;
}

export default function ProvincePicker({
  value = "",
  onSelect,
  className = "",
  placeholder = "Chọn Tỉnh/Thành phố hoặc gõ để tìm…",
}: ProvincePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [region, setRegion] = React.useState<"all" | "bac" | "trung" | "nam">("all");
  const [q, setQ] = React.useState("");

  const items = React.useMemo(() => {
    // ép kiểu + gán region tạm nếu chưa có
    const list = (provinces as ProvinceMeta[]).map((p) => ({
      ...p,
      region: p.region || REGION_FALLBACK[p.slug],
      _n: normalize(p.name),
    }));

    const nq = normalize(q);
    let filtered = list;

    if (region !== "all") {
      filtered = filtered.filter((p) => p.region === region);
    }

    if (nq) {
      // alias nhanh theo slug
      const alias = VIETNAMESE_MAP[nq];
      if (alias) {
        filtered = filtered.filter((p) => p.slug === alias);
      } else {
        filtered = filtered.filter(
          (p) => p._n.includes(nq) || normalize(p.slug).includes(nq)
        );
      }
    }

    // sort: ưu tiên khớp tên trước slug
    filtered.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    return filtered;
  }, [q, region]);

  const selected = React.useMemo(
    () => (provinces as ProvinceMeta[]).find((p) => p.slug === value)?.name || "",
    [value]
  );

  const handlePick = (slug: string) => {
    onSelect(slug);
    setOpen(false);
    setQ("");
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full h-10 px-3 text-left border rounded bg-white hover:bg-gray-50"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected || "Chọn Tỉnh/Thành phố"}
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-[340px] max-w-[90vw] bg-white border rounded-xl shadow-lg p-3">
          {/* Tabs vùng miền */}
          <div className="flex gap-1 mb-2">
            {REGIONS.map((r) => (
              <button
                key={r.key}
                className={`px-3 py-1 rounded text-sm border ${region === r.key ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}
                onClick={() => setRegion(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Tìm kiếm */}
          <input
            autoFocus
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder={placeholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          {/* Danh sách gợi ý */}
          <div className="max-h-72 overflow-auto">
            {items.length === 0 ? (
              <div className="text-sm text-gray-500 px-1 py-2">Không có kết quả</div>
            ) : (
              <ul role="listbox" className="divide-y">
                {items.map((p) => (
                  <li key={p.slug}>
                    <button
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${value === p.slug ? "bg-gray-50" : ""}`}
                      onClick={() => handlePick(p.slug)}
                      role="option"
                      aria-selected={value === p.slug}
                    >
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {p.region ? (p.region === "bac" ? "Miền Bắc" : p.region === "trung" ? "Miền Trung" : "Miền Nam") : "—"}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Đóng */}
          <div className="mt-2 text-right">
            <button className="text-sm text-gray-600 hover:text-black" onClick={() => setOpen(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
