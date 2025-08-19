// src/app/[locale]/buy/[type]/[...slug]/page.tsx
import { notFound } from "next/navigation";
import { getPropertiesByFilter } from "@/lib/queries";
import FilterBar from "@/components/filters/FilterBar";
import PropertyCard from "@/components/PropertyCard";

interface Props {
  params: { locale: string; type: string; slug?: string[] };
  searchParams: Record<string, string | string[] | undefined>;
}

const typeLabelMap: Record<string, string> = {
  "can-ho": "Căn hộ",
  "nha-rieng": "Nhà riêng",
  "dat-nen": "Đất nền",
};

export default async function BuyPage({ params, searchParams }: Props) {
  const { type, slug = [] } = params;

  if (!typeLabelMap[type]) return notFound();

  // ✅ slug = [city, district, ward]
  const [city, district, ward] = slug;

  // Gộp filter
  const filters = {
    ...searchParams,
    propertyType: type,
    purpose: "buy",
    city,
    district,
    ward,
  };

  const properties = await getPropertiesByFilter(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        Mua {typeLabelMap[type]}
        {city ? ` tại ${city}` : ""}
        {district ? ` - ${district}` : ""}
      </h1>

      <FilterBar initialFilters={filters} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
