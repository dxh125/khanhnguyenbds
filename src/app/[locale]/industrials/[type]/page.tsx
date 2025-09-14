// app/[locale]/industrials/[type]/page.tsx
import { notFound } from "next/navigation";
import { getPropertiesByFilter } from "@/lib/queries";
import PropertyCard from "@/components/PropertyCard";

type PageParams = { locale: string; type: string };
type PageSearch = Record<string, string | string[] | undefined>;

type Props = {
  params: Promise<PageParams>;          // 👈 Next 15: Promise
  searchParams: Promise<PageSearch>;    // 👈 Next 15: Promise
};

// Các loại hợp lệ cho khu công nghiệp
const validIndustrialTypes = ["dat-cong-nghiep", "nha-xuong", "khu-cong-nghiep"];

export default async function IndustrialTypePage({ params, searchParams }: Props) {
  const { type } = await params;              // 👈 await
  const sp = await searchParams;              // 👈 await

  if (!validIndustrialTypes.includes(type)) return notFound();

  const filters = {
    ...sp,
    propertyType: type,
    purpose: "buy" as const,                 // hoặc "rent" nếu dùng route cho thuê
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
          {properties.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
