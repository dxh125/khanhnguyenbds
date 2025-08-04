'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { propertyTypeLabelMap } from "@/constants/propertyTypeLabels";
import FormattedPrice from "@/components/common/FormattedPrice"; // ✅ Đã dùng component format giá

interface Property {
  id: string;
  title: string;
  price: number;
  area: number;
  postedAt: string | Date;
  propertyType: string;
  images: string[];
  status?: string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const date = new Date(property.postedAt).toLocaleDateString("vi-VN");

  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "vi";

  const propertyTypeLabel =
    propertyTypeLabelMap[locale]?.[property.propertyType] || property.propertyType;

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-all overflow-hidden relative">
      {property.status && (
        <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          {property.status}
        </span>
      )}

      <img
        src={property.images?.[0] || "/placeholder.jpg"}
        alt={property.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{property.title}</h3>
        <p className="text-gray-700 text-sm">Loại: {propertyTypeLabel}</p>
        <p className="text-gray-700 text-sm">
          Giá: <FormattedPrice price={property.price} /> VND
        </p>
        <p className="text-gray-700 text-sm">Diện tích: {property.area} m²</p>
        <p className="text-gray-500 text-xs mb-2">Ngày đăng: {date}</p>

        <Link href={`/properties/${property.id}`}>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full">
            Xem chi tiết
          </button>
        </Link>
      </div>
    </div>
  );
}
