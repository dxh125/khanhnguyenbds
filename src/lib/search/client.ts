// src/lib/search/client.ts
export type SearchParams = {
  q?: string;
  purpose?: "buy" | "rent";
  propertyType?: string | string[];      // "can-ho" | ["can-ho","nha-rieng"]
  city?: string; district?: string; ward?: string;
  projectSlug?: string;

  minPrice?: number; maxPrice?: number;
  minArea?: number;  maxArea?: number;
  minBedrooms?: number; minBathrooms?: number; minFloors?: number;

  legal?: string; direction?: string; status?: string;
  industrial?: boolean;

  sort?: "newest" | "price-asc" | "price-desc" | "area-asc" | "area-desc";
  page?: number; pageSize?: number;
};

export function buildQuery(p: SearchParams) {
  const sp = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) sp.set(k, v.join(","));
    else sp.set(k, String(v));
  });
  return sp.toString();
}

export async function getPropertiesByFilter(params: SearchParams) {
  const qs = buildQuery(params);
  const res = await fetch(`/api/properties/search?${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Không thể tải dữ liệu");
  return res.json() as Promise<{
    items: any[]; page: number; pageSize: number; total: number; hasMore: boolean;
  }>;
}
