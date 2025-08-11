import { notFound } from "next/navigation";
import { getPropertiesByFilter } from "@/lib/queries";
import FilterBar from "@/components/filters/FilterBar";
import PropertyCard from "@/components/PropertyCard";

interface Props {
  params: { locale: string; type: string };
  searchParams: Record<string, string | string[] | undefined>;
}

// Map để hiển thị tên đẹp
const typeLabelMap: Record<string, string> = {
  "can-ho": "Căn hộ",
  "nha-rieng": "Nhà riêng",
  "dat-nen": "Đất nền",
};

export default async function BuyPage({ params, searchParams }: Props) {
  const { type } = params;

  if (!typeLabelMap[type]) return notFound();

  // ✅ Gộp filter truyền vào, bao gồm propertyType và purpose
  const filters = {
    ...searchParams,
    propertyType: type,
    purpose: "buy",
  };

  const properties = await getPropertiesByFilter(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Tiêu đề trang */}
      <h1 className="text-2xl font-bold mb-4">
        Mua {typeLabelMap[type]}
      </h1>

      {/* Thanh lọc filter */}
      <FilterBar initialFilters={filters} purpose="buy" />


      {/* Danh sách bất động sản */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
