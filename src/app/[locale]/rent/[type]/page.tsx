import { notFound } from "next/navigation";
import { getPropertiesByFilter } from "@/lib/queries";
import FilterBar from "@/components/filters/FilterBar";
import PropertyCard from "@/components/PropertyCard";

interface Props {
  params: { locale: string; type: string };
  searchParams: Record<string, string | string[] | undefined>;
}

// Các loại bất động sản hợp lệ cho thuê
const validTypes = ["can-ho", "nha-rieng", "phong-tro"];

export default async function RentPage({ params, searchParams }: Props) {
  const { type } = params;

  if (!validTypes.includes(type)) return notFound();

  // ✅ Gộp searchParams với propertyType và purpose
  const filters = {
    ...searchParams,
    propertyType: type,
    purpose: "rent",
  };

  const properties = await getPropertiesByFilter(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold capitalize mb-6">
        Thuê {type.replace("-", " ")}
      </h1>

      {/* Thanh lọc */}
      <FilterBar initialFilters={searchParams} />

      {/* Danh sách bất động sản */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
