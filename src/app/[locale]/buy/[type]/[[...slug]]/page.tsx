import { notFound } from "next/navigation";
import { getPropertiesByFilter } from "@/lib/queries";
import FilterBar from "@/components/filters/FilterBar";
import PropertyCard from "@/components/PropertyCard";

interface Props {
  params: { locale: string; type: string; slug?: string[] };
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function BuyPage({ params, searchParams }: Props) {
  const { type, slug } = params;

  // slug = [city, district, ward] (có thể undefined)
  const [city, district, ward] = slug ?? [];

  // ✅ Chỉ giữ plain object
  const initialFilters = {
    propertyType: type,
    purpose: "buy",
    ...(city ? { city } : {}),
    ...(district ? { district } : {}),
    ...(ward ? { ward } : {}),
    ...(searchParams?.price ? { price: String(searchParams.price) } : {}),
    ...(searchParams?.area ? { area: String(searchParams.area) } : {}),
  };

  const properties = await getPropertiesByFilter(initialFilters);

  if (!properties.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        Không tìm thấy BĐS
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <FilterBar initialFilters={initialFilters} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
