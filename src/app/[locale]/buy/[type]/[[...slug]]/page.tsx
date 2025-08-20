// app/[locale]/buy/[type]/[[...slug]]/page.tsx
import { getPropertiesByFilter } from "@/lib/queries";
import FilterBar from "@/components/filters/FilterBar";
import PropertyCard from "@/components/PropertyCard";

type PageParams = { locale: string; type: string; slug?: string[] };
type PageSearch = { [key: string]: string | string[] | undefined };

type PageProps = {
  params: Promise<PageParams>;          // 👈 Next 15: Promise
  searchParams: Promise<PageSearch>;    // 👈 Next 15: Promise
};

export default async function BuyPage({ params, searchParams }: PageProps) {
  const { type, slug } = await params;                  // 👈 await
  const [city, district, ward] = slug ?? [];

  const sp = await searchParams;                        // 👈 await
  const str = (v: unknown) => (typeof v === "string" ? v : "");

  const initialFilters = {
    // từ segment
    propertyType: type,
    purpose: "buy",
    ...(city ? { city } : {}),
    ...(district ? { district } : {}),
    ...(ward ? { ward } : {}),

    // từ query string
    ...(sp.price ? { price: str(sp.price) } : {}),
    ...(sp.area ? { area: str(sp.area) } : {}),
    ...(sp.has3D ? { has3D: str(sp.has3D) } : {}),
    ...(sp.bedrooms ? { bedrooms: str(sp.bedrooms) } : {}),
    ...(sp.bathrooms ? { bathrooms: str(sp.bathrooms) } : {}),
    ...(sp.direction ? { direction: str(sp.direction) } : {}),
    ...(sp.status ? { status: str(sp.status) } : {}),
    ...(sp.legal ? { legal: str(sp.legal) } : {}),
    ...(sp.project ? { project: str(sp.project) } : {}),
  };

  const properties = await getPropertiesByFilter(initialFilters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <FilterBar initialFilters={initialFilters} />

      {properties.length === 0 ? (
        <div className="mt-6 text-gray-600">Không tìm thấy BĐS</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
