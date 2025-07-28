"use client";

import { useTranslations } from "next-intl";

export default function OverviewSection({ property }: { property: any }) {
  const t = useTranslations("Property");

  return (
    <div>
      {/* ✅ Thêm tiêu đề tĩnh cho section */}
      <h2 className="text-xl font-semibold mb-4">{t("overviewTitle")}</h2>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
      <p className="text-gray-600 text-sm mb-4">
        {property.ward}, {property.district}, {property.city}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {property.images?.map((img: string, i: number) => (
          <img
            key={i}
            src={img}
            alt={`Ảnh ${i + 1}`}
            className="h-48 w-full object-cover rounded-lg"
          />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 mt-4">
        <div><strong>{t("price")}:</strong> {property.price.toLocaleString()}₫</div>
        <div><strong>{t("area")}:</strong> {property.area} m²</div>
        <div><strong>{t("bedrooms")}:</strong> {property.bedrooms}</div>
        <div><strong>{t("legal")}:</strong> {property.legal || "–"}</div>
      </div>
    </div>
  );
}
