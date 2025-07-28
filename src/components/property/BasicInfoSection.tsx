"use client";

import { useTranslations } from "next-intl";

export default function BasicInfoSection({ property }: { property: any }) {
  const t = useTranslations("Property");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">{t("basicInfo")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
        <div><strong>{t("type")}:</strong> {property.propertyType}</div>
        <div><strong>{t("bedrooms")}:</strong> {property.bedrooms}</div>
        <div><strong>{t("bathrooms")}:</strong> {property.bathrooms}</div>
        <div><strong>{t("floors")}:</strong> {property.floors}</div>
        <div><strong>{t("direction")}:</strong> {property.direction || "–"}</div>
        <div><strong>{t("legal")}:</strong> {property.legal || "–"}</div>
        <div><strong>{t("address")}:</strong> {property.address}</div>
        <div><strong>{t("postedAt")}:</strong> {new Date(property.postedAt).toLocaleDateString("vi-VN")}</div>
        <div><strong>{t("propertyId")}:</strong> {property.id}</div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">{t("description")}</h3>
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
          {property.description}
        </p>
      </div>
    </div>
  );
}
