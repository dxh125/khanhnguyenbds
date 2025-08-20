"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { propertyTypeLabelMap } from "@/constants/propertyTypeLabels";
import FormattedPrice from "@/components/common/FormattedPrice";
import { BadgeDollarSign, Ruler, Home, Calendar } from "lucide-react";

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
  const dateStr = new Date(property.postedAt).toLocaleDateString("vi-VN");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "vi";

  const typeLabel =
    propertyTypeLabelMap[locale]?.[property.propertyType] ||
    property.propertyType;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Status badge */}
      {property.status && (
        <span className="absolute z-10 m-3 inline-block bg-yellow-500 text-white text-[11px] px-2 py-1 rounded">
          {property.status}
        </span>
      )}

      {/* Cover */}
      <Link href={`/properties/${property.id}`} className="block relative">
        <img
          src={property.images?.[0] || "/placeholder.jpg"}
          alt={property.title}
          className="w-full aspect-[16/9] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </Link>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/properties/${property.id}`} className="block">
          <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Meta row (one line on desktop, wraps nicely on small screens) */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-gray-600">
          <span className="inline-flex items-center gap-1">
            <BadgeDollarSign size={16} className="opacity-70" />
            <span className="font-medium text-gray-800">
              <FormattedPrice price={property.price} />{" "}
              <span className="text-gray-500">VND</span>
            </span>
          </span>

          <span className="inline-flex items-center gap-1">
            <Ruler size={16} className="opacity-70" />
            {property.area} m²
          </span>

          <span className="inline-flex items-center gap-1">
            <Home size={16} className="opacity-70" />
            {typeLabel}
          </span>

          <span className="inline-flex items-center gap-1">
            <Calendar size={16} className="opacity-70" />
            {dateStr}
          </span>
        </div>

        {/* Footer actions */}
        <div className="mt-3">
          <Link href={`/properties/${property.id}`} className="block">
            <button
              className="w-full h-10 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium
                         hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
