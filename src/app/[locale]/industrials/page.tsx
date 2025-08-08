import { getIndustrialProperties } from "@/lib/queries"; // bạn cần tạo hàm này
import PropertyCard from "@/components/PropertyCard";

export default async function IndustrialsPage() {
  const properties = await getIndustrialProperties();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Khu công nghiệp</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
