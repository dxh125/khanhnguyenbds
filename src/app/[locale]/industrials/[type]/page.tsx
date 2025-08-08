import { notFound } from "next/navigation";
import { getPropertiesByFilter } from "@/lib/queries";
import PropertyCard from "@/components/PropertyCard";

interface Props {
  params: { locale: string; type: string };
  searchParams: Record<string, string | string[] | undefined>;
}

// Các loại hợp lệ cho khu công nghiệp
const validIndustrialTypes = ["dat-nen", "nha-xuong", "khu-cong-nghiep"];

export default async function IndustrialTypePage({ params, searchParams }: Props) {
  const { type } = params;

  if (!validIndustrialTypes.includes(type)) {
    return notFound();
  }

  const filters = {
    ...searchParams,
    propertyType: type,
    purpose: "buy", // hoặc "rent" nếu muốn cho thuê khu công nghiệp
  };

  const properties = await getPropertiesByFilter(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        Khu công nghiệp: {type.replace(/-/g, " ")}
      </h1>

      {properties.length === 0 ? (
        <p>Không có bất động sản nào phù hợp.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
